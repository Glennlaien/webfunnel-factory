import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getEntitlements, getSubscriptionStatus, getSubscriptions } from "../runtime/billingClient";
import { requireSessionIdentity } from "../runtime/identityGuards";
import type { RendererProps } from "../runtime/rendererRegistry";
import { LoadingOverlay } from "./Spinner";

type VerificationState = "checking" | "ready" | "error";

export function PaymentSuccessPage({ page, onNext }: RendererProps) {
  const [state, setState] = useState<VerificationState>("checking");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    let cancelled = false;
    async function verifyPaymentReturn() {
      try {
        const identity = await requireSessionIdentity("paywall");
        await Promise.all([
          getSubscriptionStatus(identity),
          getSubscriptions(identity),
          getEntitlements(identity)
        ]);
        if (cancelled) return;
        setState("ready");
        setMessage("Your payment is confirmed.");
      } catch (error) {
        if (cancelled) return;
        setState("error");
        setMessage(error instanceof Error ? error.message : "We could not verify your subscription yet.");
      }
    }
    verifyPaymentReturn();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="page-stack centered payment-success-page">
      <LoadingOverlay active={state === "checking"} label="Verifying payment" />
      <CheckCircle2 size={44} className="success-icon" />
      <h1>{page.title || "Payment confirmed"}</h1>
      <p>{state === "error" ? message : page.subtitle || message}</p>
      {state === "error" ? <p className="error-text">{message}</p> : null}
      <button className="primary-button" disabled={state !== "ready"} onClick={onNext}>
        {String(page.ctaLabel || page.cta || "Create account")}
      </button>
    </section>
  );
}
