import { CheckCircle2, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { RendererProps } from "../runtime/rendererRegistry";
import { trackEvent } from "../runtime/analytics";
import { bindCurrentUser, createStripeEmbeddedSession, resolveOffers } from "../runtime/billingClient";
import { requireSessionIdentity } from "../runtime/identityGuards";

type OfferPrice = {
  amount?: number;
  priceText?: string;
  currency?: string;
};

type Offer = {
  productId: string;
  priceId: string;
  title: string;
  sortOrder?: number;
  recommended?: boolean;
  initialPrice?: OfferPrice;
  renewalPrice?: OfferPrice;
  billingInterval?: string;
  billingIntervalCount?: number;
};

type OffersPayload = {
  paywallCode?: string;
  placementCode?: string;
  currency?: string;
  defaultPriceId?: string;
  offers?: Offer[];
};

type DiscountType = "discount" | "further_discount";
type Testimonial = {
  name: string;
  rating?: number;
  text: string;
};

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

function readKg(value: unknown) {
  return (value as { kg?: number } | undefined)?.kg;
}

function asText(value: unknown, fallback: string) {
  if (Array.isArray(value) && value.length) {
    return value.map((item) => String(item).replace(/_/g, " ")).join(", ");
  }
  if (typeof value === "string" && value) return value.replace(/_/g, " ");
  return fallback;
}

function goalDelta(currentKg?: number, targetKg?: number) {
  if (!currentKg || !targetKg) return "A plan paced around your starting point";
  const delta = Math.round(Math.abs(currentKg - targetKg));
  if (delta < 1) return "A plan to maintain your momentum";
  return currentKg > targetKg ? delta + " kg to lose" : delta + " kg to gain";
}

function intervalText(offer?: Offer) {
  const count = offer?.billingIntervalCount || 1;
  const interval = offer?.billingInterval || "week";
  if (interval === "week") return count === 1 ? "Every week" : `Every ${count} weeks`;
  if (interval === "month") return count === 1 ? "Every month" : `Every ${count} months`;
  if (interval === "year") return count === 1 ? "Every year" : `Every ${count} years`;
  return count === 1 ? `Every ${interval}` : `Every ${count} ${interval}s`;
}

function normalizedOfferText(offer?: Offer) {
  return [offer?.title, intervalText(offer)].filter(Boolean).join(" ").toLowerCase();
}

function planPhaseText(offer?: Offer) {
  const text = normalizedOfferText(offer);
  if (text.includes("1-week") || text.includes("1 week") || text.includes("weekly") || text.includes("every week")) return "1-week";
  if (text.includes("12-week") || text.includes("12 week")) return "12-week";
  if (text.includes("4-week") || text.includes("4 week")) return "4-week";
  return "4-week";
}

function sortedOffers(offers: Offer[]) {
  return [...offers].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
}

function priceKey(offer: Offer) {
  return offer.priceId || offer.productId || offer.title;
}

function hasDiscount(offer: Offer, normalOffer?: Offer) {
  const currentAmount = offer.initialPrice?.amount;
  const normalAmount = normalOffer?.initialPrice?.amount || offer.renewalPrice?.amount;
  if (typeof currentAmount === "number" && typeof normalAmount === "number") return normalAmount > currentAmount;
  const currentText = offer.initialPrice?.priceText;
  const normalText = normalOffer?.initialPrice?.priceText || offer.renewalPrice?.priceText;
  return Boolean(currentText && normalText && currentText !== normalText);
}

function originalPriceText(offer: Offer, normalOffer?: Offer) {
  if (!hasDiscount(offer, normalOffer)) return "";
  return normalOffer?.initialPrice?.priceText || offer.renewalPrice?.priceText || "";
}

function savingsText(offer: Offer, normalOffer?: Offer) {
  const currentAmount = offer.initialPrice?.amount;
  const normalAmount = normalOffer?.initialPrice?.amount || offer.renewalPrice?.amount;
  if (typeof currentAmount !== "number" || typeof normalAmount !== "number" || normalAmount <= currentAmount) return "";
  return `Save ${Math.round((1 - currentAmount / normalAmount) * 100)}%`;
}

function periodDays(offer: Offer) {
  const count = offer.billingIntervalCount || 1;
  const interval = offer.billingInterval || "week";
  if (interval === "day") return count;
  if (interval === "week") return count * 7;
  if (interval === "month") return count * 30;
  if (interval === "year") return count * 365;
  return count * 7;
}

function perDayText(offer: Offer) {
  const amount = offer.initialPrice?.amount;
  if (typeof amount !== "number") return "";
  return `$${(amount / periodDays(offer)).toFixed(2)}/day`;
}

function fallbackOffers(): Offer[] {
  return [
    {
      productId: "fallback-4-week",
      priceId: "",
      title: "4-week starter",
      billingInterval: "week",
      billingIntervalCount: 4,
      recommended: true,
      initialPrice: { priceText: "$14.99" },
      renewalPrice: { priceText: "$38.95" }
    },
    {
      productId: "fallback-12-week",
      priceId: "",
      title: "12-week plan",
      billingInterval: "week",
      billingIntervalCount: 12,
      initialPrice: { priceText: "$29.99" },
      renewalPrice: { priceText: "$89.99" }
    }
  ];
}

function offerKey(offer: Offer, index: number) {
  return offer.priceId || offer.productId || `${offer.title}-${index}`;
}

function allPageAssets(page: { assets?: Record<string, { kind?: string; optionValue?: string; src?: string }> }) {
  return Object.values(page.assets || {});
}

function localScreenshotUrls(page: { assets?: Record<string, { kind?: string; src?: string }> }) {
  const urls = allPageAssets(page)
    .filter((asset) => asset.kind === "paywall_app_screenshot_set" && asset.src)
    .map((asset) => asset.src!);
  return urls;
}

function localBodyAsset(page: { assets?: Record<string, { kind?: string; optionValue?: string; src?: string }> }, optionValue: string) {
  const assets = allPageAssets(page).filter((asset) => asset.kind === "summary_body_set");
  return assets.find((asset) => asset.optionValue === optionValue)?.src
    || assets.find((asset) => asset.optionValue === "normal")?.src
    || assets[0]?.src;
}

function pageTestimonials(page: Record<string, unknown>): Testimonial[] {
  const source = Array.isArray(page.testimonials) ? page.testimonials : [];
  const normalized = source
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const value = item as { name?: unknown; text?: unknown; quote?: unknown; rating?: unknown };
      const name = typeof value.name === "string" ? value.name : "";
      const text = typeof value.text === "string" ? value.text : typeof value.quote === "string" ? value.quote : "";
      if (!name || !text) return null;
      return {
        name,
        text,
        rating: typeof value.rating === "number" ? value.rating : 5
      };
    })
    .filter(Boolean) as Testimonial[];
  return normalized.length ? normalized : [
    {
      name: "Marcus",
      rating: 5,
      text: "The plan gave me a clear starting point and made it easier to stay consistent without going to a gym."
    },
    {
      name: "Daniel",
      rating: 5,
      text: "I liked that the sessions felt structured. It was challenging, but not random."
    },
    {
      name: "Ethan",
      rating: 5,
      text: "The workouts fit into my day and still felt focused on strength, core work, and visible progress."
    }
  ];
}

export function PaywallPage({ page, answers }: RendererProps) {
  const currentProductName = page.productName || page.appName || "this app";
  const [offers, setOffers] = useState<Offer[]>([]);
  const [normalOffers, setNormalOffers] = useState<Offer[]>([]);
  const [discountType, setDiscountType] = useState<DiscountType>(() => {
    if (typeof window === "undefined") return "discount";
    return sessionStorage.getItem("web2app.paywallDiscountType") === "further_discount" ? "further_discount" : "discount";
  });
  const [selectedPriceId, setSelectedPriceId] = useState("");
  const [error, setError] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const checkoutRef = useRef<HTMLDivElement | null>(null);
  const embeddedCheckoutRef = useRef<{ destroy?: () => void } | null>(null);
  const paywallViewedRef = useRef(false);
  const currentKg = readKg(answers.currentWeight);
  const targetKg = readKg(answers.targetWeight);
  const focus = asText(answers.focusAreas, "your focus areas");
  const blockers = asText(answers.blockers, "your biggest blockers");
  const pageScreenshotUrls = localScreenshotUrls(page);
  const beforeBodySrc = localBodyAsset(page, "overweight") || localBodyAsset(page, "obese") || localBodyAsset(page, "normal");
  const afterBodySrc = localBodyAsset(page, "normal") || beforeBodySrc;
  const testimonials = pageTestimonials(page);
  const displayOffers = offers.length ? offers : fallbackOffers();
  const normalOfferByKey = useMemo(() => {
    const map = new Map<string, Offer>();
    normalOffers.forEach((offer) => {
      map.set(priceKey(offer), offer);
      if (offer.productId) map.set(offer.productId, offer);
      if (offer.title) map.set(offer.title.toLowerCase(), offer);
    });
    return map;
  }, [normalOffers]);
  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.priceId && offer.priceId === selectedPriceId) || offers.find((offer) => offer.recommended) || offers[0],
    [offers, selectedPriceId]
  );
  const selectedPhase = planPhaseText(selectedOffer);
  const selectedInitialPrice = selectedOffer?.initialPrice?.priceText || "Offer";
  const selectedRenewalPrice = selectedOffer?.renewalPrice?.priceText || selectedInitialPrice;

  const activateSecondPaywall = useCallback(() => {
    if (discountType === "further_discount") return;
    sessionStorage.setItem("web2app.paywallDiscountType", "further_discount");
    setDiscountType("further_discount");
    trackEvent("Paywall Viewed", page, { discount_type: "further_discount", trigger: "checkout_close_or_timer" });
  }, [discountType, page]);

  useEffect(() => {
    let cancelled = false;
    async function loadOffers() {
      try {
        const [resolvedData, normalData] = await Promise.all([
          resolveOffers(undefined, discountType),
          resolveOffers(undefined, "normal").catch(() => null)
        ]) as [OffersPayload, OffersPayload | null];
        let data = resolvedData;
        let nextOffers = sortedOffers(data.offers || []);
        if (!nextOffers.length && discountType === "further_discount") {
          sessionStorage.removeItem("web2app.paywallDiscountType");
          data = await resolveOffers(undefined, "discount");
          nextOffers = sortedOffers(data.offers || []);
          if (!cancelled) setDiscountType("discount");
        }
        if (cancelled) return;
        const nextNormalOffers = sortedOffers(normalData?.offers || []);
        setOffers(nextOffers);
        setNormalOffers(nextNormalOffers);
        setError("");
        const defaultOffer = nextOffers.find((offer) => offer.priceId === data.defaultPriceId)
          || nextOffers.find((offer) => offer.recommended)
          || nextOffers[0];
        if (defaultOffer?.priceId) setSelectedPriceId(defaultOffer.priceId);
        if (!paywallViewedRef.current) {
          paywallViewedRef.current = true;
          trackEvent("Paywall Viewed", page, {
            offer_count: nextOffers.length,
            placement_code: data.placementCode || data.paywallCode,
            discount_type: discountType
          });
        } else {
          trackEvent("Paywall Viewed", page, {
            offer_count: nextOffers.length,
            placement_code: data.placementCode || data.paywallCode,
            discount_type: discountType
          });
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load billing offers.");
      }
    }
    loadOffers();
    return () => {
      cancelled = true;
    };
  }, [discountType, page]);

  useEffect(() => {
    const onDiscountExpired = () => activateSecondPaywall();
    window.addEventListener("paywall:discount-expired", onDiscountExpired);
    return () => window.removeEventListener("paywall:discount-expired", onDiscountExpired);
  }, [activateSecondPaywall]);

  useEffect(() => {
    if (!selectedPriceId) {
      const recommended = offers.find((offer) => offer.recommended) || offers[0];
      if (recommended?.priceId) setSelectedPriceId(recommended.priceId);
    }
  }, [offers, selectedPriceId]);

  useEffect(() => {
    if (!pageScreenshotUrls.length) return;
    const timer = window.setInterval(() => {
      setScreenshotIndex((current) => (current + 1) % pageScreenshotUrls.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [pageScreenshotUrls.length]);

  useEffect(() => {
    const scrollToNearestPlanList = () => {
      const lists = Array.from(document.querySelectorAll<HTMLElement>(".plan-list"));
      if (!lists.length) return;
      const viewportAnchor = window.scrollY + 96;
      const nearest = lists
        .map((element) => {
          const top = element.getBoundingClientRect().top + window.scrollY;
          const forwardBias = top >= viewportAnchor ? 0 : 420;
          return { element, top, distance: Math.abs(top - viewportAnchor) + forwardBias };
        })
        .sort((a, b) => a.distance - b.distance)[0];
      const topbarHeight = document.querySelector<HTMLElement>(".paywall-topbar")?.offsetHeight || 76;
      window.scrollTo({
        top: Math.max(0, nearest.top - topbarHeight - 14),
        behavior: "smooth"
      });
    };
    window.addEventListener("paywall:scroll-to-nearest-plan", scrollToNearestPlanList);
    return () => window.removeEventListener("paywall:scroll-to-nearest-plan", scrollToNearestPlanList);
  }, []);

  const visibleScreenshots = pageScreenshotUrls.length
    ? [0, 1, 2].map((offset) => pageScreenshotUrls[(screenshotIndex + offset) % pageScreenshotUrls.length])
    : [];

  const startCheckout = async () => {
    setError("");
    setCheckoutLoading(true);
    try {
      const identity = await requireSessionIdentity("age_group");
      await bindCurrentUser(identity, identity.email);
      if (!selectedOffer?.priceId) throw new Error("Choose a real billing offer before checkout.");
      if (!stripePublishableKey) throw new Error("Stripe publishable key is missing. Set VITE_STRIPE_PUBLISHABLE_KEY.");
      trackEvent("Checkout Started", page, {
        price_id: selectedOffer.priceId,
        product_id: selectedOffer.productId,
        amount: selectedOffer.initialPrice?.amount ?? selectedOffer.initialPrice?.priceText,
        billing_period: intervalText(selectedOffer)
      });
      const returnUrl = `${window.location.origin}${window.location.pathname}?page=payment_success&session_id={CHECKOUT_SESSION_ID}`;
      const idempotencyKey = `${identity.uid}:${selectedOffer.priceId}:${Date.now()}`;
      const session = await createStripeEmbeddedSession({
        identity,
        email: identity.email,
        priceId: selectedOffer.priceId,
        returnUrl,
        idempotencyKey,
        visitor: true
      });
      const clientSecret = session.clientSecret;
      setCheckoutOpen(true);
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
      const stripe = await loadStripe(stripePublishableKey);
      const embedded = await stripe?.initEmbeddedCheckout({ clientSecret });
      if (!embedded || !checkoutRef.current) throw new Error("Stripe checkout could not be mounted.");
      embeddedCheckoutRef.current?.destroy?.();
      embeddedCheckoutRef.current = embedded;
      embedded.mount(checkoutRef.current);
    } catch (err) {
      setCheckoutOpen(false);
      trackEvent("Checkout Failed", page, {
        price_id: selectedPriceId,
        reason: err instanceof Error ? err.message : "Checkout failed."
      });
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const closeCheckout = () => {
    embeddedCheckoutRef.current?.destroy?.();
    embeddedCheckoutRef.current = null;
    setCheckoutOpen(false);
    activateSecondPaywall();
  };

  const PlanPicker = ({ compact = false }: { compact?: boolean }) => (
    <div className={compact ? "plan-list compact" : "plan-list"} aria-label="Choose your plan">
      {displayOffers.map((offer, index) => {
        const selected = Boolean(offer.priceId && selectedPriceId === offer.priceId);
        const normalOffer = normalOfferByKey.get(priceKey(offer))
          || normalOfferByKey.get(offer.productId)
          || normalOfferByKey.get(offer.title.toLowerCase());
        const original = originalPriceText(offer, normalOffer);
        const savings = savingsText(offer, normalOffer);
        const daily = perDayText(offer);
        return (
          <button
            className={selected ? "plan-card selected" : "plan-card"}
            disabled={!offer.priceId}
            key={offerKey(offer, index)}
            onClick={() => {
              setSelectedPriceId(offer.priceId);
              trackEvent("Offer Selected", page, {
                price_id: offer.priceId,
                product_id: offer.productId,
                amount: offer.initialPrice?.amount ?? offer.initialPrice?.priceText,
                billing_period: intervalText(offer)
              });
            }}
          >
            {offer.recommended ? <span className="plan-ribbon">Best value</span> : null}
            <strong>{offer.title}</strong>
            <span className="plan-price">
              {original ? <em>{original}</em> : null}
              <b>{offer.initialPrice?.priceText || "Offer"}</b>
              {daily ? <i>{daily}</i> : null}
            </span>
            {savings ? <small>
              {savings ? <b>{savings}</b> : null}
            </small> : null}
          </button>
        );
      })}
    </div>
  );

  const SubscriptionDisclosure = () => (
    <p className="subscription-disclosure">
      By clicking <strong>GET MY PLAN</strong>, I agree to pay <strong>{selectedInitialPrice}</strong> for my plan and that if I do not cancel before the end of the <strong>{selectedPhase} discount plan</strong>, it will convert to a <strong>4-week subscription</strong> and {String(currentProductName)} will automatically charge my payment method the regular price <strong>{selectedRenewalPrice} every 4-week thereafter</strong> until I cancel. I can cancel online by visiting <strong>subscription page in my account only on website</strong> to avoid being charged for the next billing cycle.
    </p>
  );

  return (
    <section className="page-stack paywall-page">
      <div className="paywall-transform-card">
        <div className="transform-visuals" aria-label="Body transformation preview">
          <div className="transform-figure before">
            <span>Now</span>
            <div className="figure-placeholder">{beforeBodySrc ? <img src={beforeBodySrc} alt="" /> : null}</div>
            <strong>Body fat</strong>
            <em>over 40%</em>
          </div>
          <div className="transform-figure after">
            <span>Goal</span>
            <div className="figure-placeholder">{afterBodySrc ? <img src={afterBodySrc} alt="" /> : null}</div>
            <strong>Body fat</strong>
            <em>under 30%</em>
          </div>
        </div>
        <p>Results vary, and personal outcomes depend on individual factors.</p>
      </div>

      <div className="paywall-hero">
        <span className="paywall-kicker">{discountType === "further_discount" ? "Extra discount unlocked" : "Your personalized plan is ready"}</span>
        <h1>{page.title || "Unlock your personalized plan"}</h1>
        <p>{page.subtitle || "Start with a plan shaped around your goal, body profile, and schedule."}</p>
      </div>

      <PlanPicker />

      <div className="paywall-cta-block">
        <button className="primary-button" disabled={!offers.length || !selectedOffer?.priceId} onClick={startCheckout}>Get my plan</button>
        <SubscriptionDisclosure />
      </div>

      <div className="secure-payments">
        <span>Pay safe and secure</span>
        <strong>VISA</strong>
        <strong>Mastercard</strong>
        <strong>Stripe</strong>
        <strong>Pay</strong>
      </div>

      <section className="app-preview-section">
        <h2>Enhance your outcomes with your companion app</h2>
        <div className="phone-preview-row" key={screenshotIndex}>
          {visibleScreenshots.map((src, index) => (
            <div className={index === 1 ? "phone-preview-card active" : "phone-preview-card"} key={src}>
              <img src={src} alt={currentProductName + " app screenshot " + (index + 1)} loading="lazy" />
            </div>
          ))}
        </div>
        <div className="carousel-dots" aria-hidden="true">
          {pageScreenshotUrls.slice(0, 3).map((src, index) => <span className={index === screenshotIndex % 3 ? "active" : ""} key={src} />)}
        </div>
      </section>

      <section className="social-proof-block">
        <h2>Start losing weight right now</h2>
        <div className="people-count"><span>22,403,000+</span><small>people love guided home plans</small></div>
      </section>

      <div className="paywall-value-card">
        <div className="paywall-value-head">
          <Sparkles size={20} />
          <strong>Highlights of your plan</strong>
        </div>
        <ul>
          <li><CheckCircle2 size={17} /> Workout intensity matched to your starting level</li>
          <li><CheckCircle2 size={17} /> Progress pacing based on your current and target weight</li>
          <li><CheckCircle2 size={17} /> Home-friendly sessions designed around consistency</li>
          <li><CheckCircle2 size={17} /> Expert-style guidance personalized from your answers</li>
        </ul>
      </div>

      <section className="challenge-card">
        <div>
          <span>28 Day Challenge</span>
          <strong>Small daily actions, visible momentum</strong>
        </div>
        <div className="calendar-placeholder" />
      </section>

      <section className="feedback-section">
        <h2>100,000 positive feedbacks</h2>
        {testimonials.map((item) => (
          <article className="feedback-card" key={item.name}>
            <div className="feedback-avatar" />
            <div>
              <strong>{item.name}</strong>
              <div className="proof-stars" aria-label={`${item.rating || 5} star rating`}>{"⭐️".repeat(item.rating || 5)}</div>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="result-story">
        <h2>People just like you achieved meaningful progress with guided plans</h2>
        <div className="result-visual">
          <div className="result-photo before">Day 1</div>
          <div className="result-photo after">Day 98</div>
        </div>
        <p>Use this area for generated progress imagery or a compliant placeholder.</p>
      </section>

      <div className="paywall-hero compact">
        <h2>Get visible results with your personalized plan</h2>
      </div>

      <PlanPicker compact />

      <div className="paywall-cta-block">
        <button className="primary-button" disabled={!offers.length || !selectedOffer?.priceId} onClick={startCheckout}>Get my plan</button>
        <SubscriptionDisclosure />
      </div>

      <div className="paywall-trust">
        <ShieldCheck size={20} />
        <div>
          <strong>30-day money-back guarantee</strong>
          <p>Guarantee terms must match your legal policy. Keep this section connected to the actual refund rules shown at checkout.</p>
        </div>
      </div>

      <details className="paywall-faq">
        <summary>What happens after I pay?<ChevronDown size={17} /></summary>
        <p>Your checkout returns to the success page, then account creation saves access to subscription management.</p>
      </details>
      <details className="paywall-faq">
        <summary>Can I cancel later?<ChevronDown size={17} /></summary>
        <p>Yes. The generated app includes a subscription center for viewing status and starting cancellation when the backend supports it.</p>
      </details>

      {error ? <p className="error-text">{error}</p> : null}
      {!offers.length ? <p className="subtle-note">Loading billing offers...</p> : null}
      <p className="paywall-legal">Prices and trial eligibility come from the billing backend. Final checkout terms must match the selected offer.</p>
      {checkoutOpen ? (
        <div className="checkout-overlay" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <section className="checkout-sheet">
            <div className="checkout-sheet-head">
              <div>
                <span>Secure checkout</span>
                <h2 id="checkout-title">Complete your payment</h2>
              </div>
              <button type="button" className="checkout-close-button" onClick={closeCheckout} aria-label="Close checkout">Close</button>
            </div>
            {checkoutLoading ? <p className="checkout-loading">Preparing secure payment...</p> : null}
            <div className="checkout-mount" ref={checkoutRef} />
          </section>
        </div>
      ) : null}
    </section>
  );
}

