import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { loginEmailUser } from "../runtime/billingClient";
import { identifyAnalytics, trackEvent } from "../runtime/analytics";
import { signInBillingCustomToken } from "../runtime/firebase";
import { routeTo } from "../runtime/navigation";
import { clearRuntimeSession } from "../runtime/storage";
import { LoadingOverlay } from "./Spinner";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function readToken(payload: Record<string, unknown>) {
  return String(payload.customToken || payload.firebaseCustomToken || payload.token || "");
}

export function LoginPage({ page }: RendererProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const normalizedEmail = email.trim().toLowerCase();
  const valid = isValidEmail(normalizedEmail) && password.length > 0;

  const submit = async () => {
    if (!valid) return;
    setLoading(true);
    setError("");
    try {
      const loggedIn = await loginEmailUser(normalizedEmail, password);
      const customToken = readToken(loggedIn);
      if (!customToken) throw new Error("Login response is missing a Firebase custom token.");
      const identity = await signInBillingCustomToken({
        uid: String(loggedIn.uid || loggedIn.firebaseUid || ""),
        customToken,
        email: normalizedEmail,
        isAnonymous: false
      });
      identifyAnalytics(identity.uid);
      trackEvent("Login Succeeded", page, { method: "email" });
      routeTo("profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const startAccountFlow = () => {
    clearRuntimeSession();
    routeTo("entry");
  };

  return (
    <section className="page-stack account-auth-page">
      <LoadingOverlay active={loading} label="Logging in" />
      <h1>{page.title}</h1>
      <p>{page.subtitle || "to save your progress and access the plan"}</p>
      <label className="auth-field">
        <input value={email} type="email" inputMode="email" autoComplete="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="auth-field password-field">
        <input value={password} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
        <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </label>
      <button className="auth-link-button forgot-link" type="button">Forgot your password?</button>
      <button className="auth-submit-button" disabled={!valid || loading} onClick={submit}>{page.cta || "Log in"}</button>
      <button className="auth-link-button" type="button" onClick={startAccountFlow}>Create an account</button>
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}

