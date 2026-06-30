import { LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { getSubscriptions, requestCancelSubscription } from "../runtime/billingClient";
import { trackEvent } from "../runtime/analytics";
import { refreshIdentityToken } from "../runtime/firebase";
import { routeTo } from "../runtime/navigation";
import { clearRuntimeSession, readIdentity } from "../runtime/storage";
import { LoadingOverlay } from "./Spinner";

type SubscriptionView = {
  subscribed?: boolean;
  status?: string;
  displayStatus?: string;
  title?: string;
  description?: string;
  plan?: {
    name?: string;
    productId?: string;
    priceId?: string;
  } | null;
  billing?: {
    currentPeriodStart?: string | null;
    currentPeriodEnd?: string | null;
    validUntil?: string | null;
  } | null;
  management?: {
    canCancel?: boolean;
    subscriptionId?: string | null;
  } | null;
};

function formatDate(value?: string | null) {
  if (!value) return "None";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function statusLabel(view: SubscriptionView | null) {
  const raw = view?.displayStatus || view?.status;
  return raw ? String(raw) : "Unknown";
}

function firstSubscriptionId(view: SubscriptionView | null) {
  return String(view?.management?.subscriptionId || "");
}

function canCancelSubscription(view: SubscriptionView | null) {
  return Boolean(view?.management?.canCancel && firstSubscriptionId(view));
}

export function ProfilePage({ page }: RendererProps) {
  const [view, setView] = useState<SubscriptionView | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const identity = readIdentity();
  const subscriptionId = useMemo(() => firstSubscriptionId(view), [view]);
  const canCancel = useMemo(() => canCancelSubscription(view), [view]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const refreshed = await refreshIdentityToken();
        if (!refreshed?.uid) {
          routeTo("login");
          return;
        }
        const subscriptionSummary = await getSubscriptions(refreshed) as SubscriptionView;
        if (!cancelled) {
          setView(subscriptionSummary);
          trackEvent("Subscription Viewed", page, {
            subscription_status: statusLabel(subscriptionSummary),
            subscribed: Boolean(subscriptionSummary.subscribed)
          });
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cancel = async () => {
    const refreshed = await refreshIdentityToken();
    if (!refreshed?.uid) {
      routeTo("login");
      return;
    }
    if (!subscriptionId) {
      setError("No cancellable subscription was found.");
      return;
    }
    setCancelling(true);
    setError("");
    trackEvent("Cancel Subscription Clicked", page, { subscription_id: subscriptionId || undefined });
    try {
      await requestCancelSubscription(refreshed, subscriptionId || undefined);
      const subscriptionSummary = await getSubscriptions(refreshed) as SubscriptionView;
      setView(subscriptionSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel subscription.");
    } finally {
      setCancelling(false);
    }
  };

  const logout = () => {
    clearRuntimeSession();
    routeTo("login");
  };

  return (
    <section className="page-stack profile-page">
      <LoadingOverlay active={loading || cancelling} label={cancelling ? "Cancelling subscription" : "Loading profile"} />
      <div className="profile-head">
        <div>
          <h1>{page.title}</h1>
          <p>{page.subtitle}</p>
          <small className="profile-id-caption">ID {identity?.uid || "No session"}</small>
        </div>
        <button className="icon-button soft" aria-label="Log out" onClick={logout}><LogOut size={19} /></button>
      </div>
      <div className="profile-section">
        <div className="profile-row">
          <span>Email</span>
          <strong>{identity?.email || "Not set"}</strong>
        </div>
      </div>
      <div className="profile-section">
        <div className="profile-row">
          <span>Subscription</span>
          <strong>{statusLabel(view)}</strong>
        </div>
        <div className="profile-row">
          <span>Plan</span>
          <strong>{view?.plan?.name || "No active plan"}</strong>
        </div>
        <div className="profile-row">
          <span>Valid until</span>
          <strong>{formatDate(view?.billing?.validUntil || view?.billing?.currentPeriodEnd)}</strong>
        </div>
      </div>
      <button className="auth-submit-button cancel-flat-button" disabled={!identity?.uid || cancelling || !canCancel} onClick={cancel}>Cancel subscription</button>
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}

