import { useState } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { bindCurrentUser } from "../runtime/billingClient";
import { emailDomain, trackEvent } from "../runtime/analytics";
import { refreshIdentityToken } from "../runtime/firebase";
import { readIdentity, writeIdentity } from "../runtime/storage";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function EmailInputPage({ page, saveAnswer, onNext }: RendererProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const normalizedEmail = email.trim().toLowerCase();
  const valid = isValidEmail(normalizedEmail);

  const submit = async () => {
    if (!valid) {
      setError("Enter a valid email to continue.");
      return;
    }
    setError("");
    await saveAnswer(page.dataKey!, normalizedEmail);
    const identity = await refreshIdentityToken();
    if (identity?.uid) {
      await bindCurrentUser(identity, normalizedEmail);
      writeIdentity({ ...identity, email: normalizedEmail });
    }
    trackEvent("Email Submitted", page, { email_domain: emailDomain(normalizedEmail) });
    onNext();
  };

  return (
    <section className="page-stack email-capture-page">
      <h1>{page.title}</h1>
      <label className="email-input-wrap">
        <input className="text-input" aria-label="Email" value={email} inputMode="email" autoComplete="email" placeholder="name@example.com" onChange={(event) => setEmail(event.target.value)} />
      </label>
      {error ? <p className="error-text">{error}</p> : null}
      <p className="email-privacy-note">We'll use your email to save your plan and let you access it later. Your answers stay private and are used only to personalize this experience.</p>
      <button className="primary-button sticky-button" disabled={!valid} onClick={submit}>{page.cta || "Continue"}</button>
    </section>
  );
}

