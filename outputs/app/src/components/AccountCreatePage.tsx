import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { registerFromAnonymous } from "../runtime/billingClient";
import { identifyAnalytics, trackEvent } from "../runtime/analytics";
import { signInBillingCustomToken } from "../runtime/firebase";
import { routeTo } from "../runtime/navigation";
import { readIdentity } from "../runtime/storage";
import { LoadingOverlay } from "./Spinner";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function readToken(payload: Record<string, unknown>) {
  return String(payload.customToken || payload.firebaseCustomToken || payload.token || "");
}

export function AccountCreatePage({ page, onNext }: RendererProps) {
  const existing = readIdentity();
  const [email, setEmail] = useState(existing?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const normalizedEmail = email.trim().toLowerCase();
  const valid = isValidEmail(normalizedEmail) && password.length >= 6;

  const submit = async () => {
    if (!valid) return;
    const identity = readIdentity();
    if (!identity?.uid) {
      setError("Start the funnel before creating an account.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const registered = await registerFromAnonymous(identity, normalizedEmail, password);
      const customToken = readToken(registered);
      if (customToken) {
        const nextIdentity = await signInBillingCustomToken({
          uid: String(registered.uid || identity.uid),
          customToken,
          email: normalizedEmail,
          isAnonymous: false
        });
        identifyAnalytics(nextIdentity.uid);
      }
      trackEvent("Account Created", page, { method: "email" });
      routeTo("profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-stack account-auth-page">
      <LoadingOverlay active={loading} label="Creating account" />
      <h1>{page.title}</h1>
      <p>{page.subtitle || "to save your progress and access the plan"}</p>
      <label className="auth-field">
        <input value={email} type="email" inputMode="email" autoComplete="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="auth-field password-field">
        <input value={password} type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
        <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </label>
      <button className="auth-submit-button" disabled={!valid || loading} onClick={submit}>{page.cta || "Create account"}</button>
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}

