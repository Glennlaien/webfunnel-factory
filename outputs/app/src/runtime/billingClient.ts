import type { Identity } from "./types";

const apiBase = import.meta.env.VITE_BILLING_API_BASE_URL || "https://billing-dev.cloud.7mfitness.com";
const appCode = import.meta.env.VITE_BILLING_APP_CODE || "oog126_dev";
export const placementCode = import.meta.env.VITE_BILLING_PLACEMENT_CODE || "O2MGB";

type BillingInit = RequestInit & { token?: string };

export async function billingFetch(path: string, init: BillingInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  headers.set("ngrok-skip-browser-warning", "true");
  if (init.token) headers.set("Authorization", `Bearer ${init.token}`);
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers,
    credentials: "omit"
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `Billing request failed: ${response.status}`);
  }
  return payload.data ?? payload;
}

export function createAnonymousUser() {
  return billingFetch(`/billing/${appCode}/v1/users/anonymous`, { method: "POST" });
}

export function bindCurrentUser(identity: Identity, email?: string) {
  return billingFetch(`/billing/${appCode}/v1/users/current`, {
    method: "POST",
    token: identity.idToken,
    body: JSON.stringify({ uid: identity.uid, firebaseUid: identity.uid, email })
  });
}

export function loginEmailUser(email: string, password: string) {
  return billingFetch(`/billing/${appCode}/v1/users/login`, {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function registerFromAnonymous(identity: Identity, email: string, password: string) {
  return billingFetch(`/billing/${appCode}/v1/users/register-from-anonymous`, {
    method: "POST",
    token: identity.idToken,
    body: JSON.stringify({ uid: identity.uid, email, password })
  });
}

function runtimePlacementCode(explicitCode?: string) {
  if (explicitCode) return explicitCode;
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search).get("lpid") || placementCode;
  }
  return placementCode;
}

export function resolveOffers(code?: string, discountType?: "normal" | "discount" | "further_discount") {
  const params = new URLSearchParams({
    placementCode: runtimePlacementCode(code),
    discountType: discountType || (typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("discountType") as "normal" | "discount" | "further_discount" | null) || "discount"
      : "discount")
  });
  return billingFetch(`/billing/${appCode}/v1/paywalls/resolve/offers?${params.toString()}`);
}

export function createStripeEmbeddedSession(input: {
  identity: Identity;
  email?: string;
  priceId: string;
  returnUrl: string;
  idempotencyKey: string;
  visitor: boolean;
}) {
  return billingFetch(`/billing/${appCode}/v1/checkout/stripe/embedded-session`, {
    method: "POST",
    token: input.identity.idToken,
    body: JSON.stringify({
      uid: input.identity.uid,
      email: input.email,
      priceId: input.priceId,
      returnUrl: input.returnUrl,
      idempotencyKey: input.idempotencyKey,
      visitor: input.visitor
    })
  });
}

export function getSubscriptions(identity: Identity) {
  return billingFetch(`/billing/${appCode}/v1/subscriptions?uid=${encodeURIComponent(identity.uid)}`, {
    token: identity.idToken
  });
}

export function getSubscriptionStatus(identity: Identity) {
  return billingFetch(`/billing/${appCode}/v1/subscriptions/status?uid=${encodeURIComponent(identity.uid)}`, {
    token: identity.idToken
  });
}

export function getEntitlements(identity: Identity) {
  return billingFetch(`/billing/${appCode}/v1/entitlements?uid=${encodeURIComponent(identity.uid)}`, {
    token: identity.idToken
  });
}

export function requestCancelSubscription(identity: Identity, subscriptionId?: string) {
  return billingFetch(`/billing/${appCode}/v1/subscriptions/cancel`, {
    method: "POST",
    token: identity.idToken,
    body: JSON.stringify({ uid: identity.uid, subscriptionId })
  });
}

