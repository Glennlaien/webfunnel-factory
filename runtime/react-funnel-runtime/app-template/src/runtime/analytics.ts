import mixpanel from "mixpanel-browser";
import type { FunnelPage } from "./types";
import { readIdentity } from "./storage";

export type AnalyticsEventName =
  | "OB Started"
  | "OB Step Viewed"
  | "OB Answer Submitted"
  | "OB Step Back"
  | "Identity Created"
  | "Email Submitted"
  | "Summary Viewed"
  | "Plan Generation Started"
  | "Plan Generation Completed"
  | "Plan Ready Viewed"
  | "Paywall Viewed"
  | "Offer Selected"
  | "Checkout Started"
  | "Checkout Failed"
  | "Purchase Completed"
  | "Account Created"
  | "Login Succeeded"
  | "Subscription Viewed"
  | "Cancel Subscription Clicked";

type AnalyticsProps = Record<string, unknown>;

const token = import.meta.env.VITE_MIXPANEL_TOKEN || "3392ba9657bd7e259393334e088e7cb7";
const debug = import.meta.env.VITE_MIXPANEL_DEBUG === "true";
let initialized = false;

function cleanProps(props: AnalyticsProps) {
  return Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

function sourceValue() {
  if (typeof window === "undefined") return "direct";
  const params = new URLSearchParams(window.location.search);
  return params.get("utm_source") || params.get("source") || params.get("lpid") || "direct";
}

function globalProps(page?: FunnelPage): AnalyticsProps {
  return cleanProps({
    uid: readIdentity()?.uid,
    page_id: page?.id,
    section: page?.sectionLabel || page?.sectionId || page?.phase,
    source: sourceValue(),
    env: import.meta.env.VITE_APP_ENV || import.meta.env.MODE || "dev"
  });
}

export function initAnalytics() {
  if (initialized || !token) return;
  mixpanel.init(token, {
    debug,
    persistence: "localStorage",
    ignore_dnt: false
  });
  initialized = true;
}

export function identifyAnalytics(uid?: string) {
  initAnalytics();
  if (uid) mixpanel.identify(uid);
}

export function resetAnalytics() {
  initAnalytics();
  mixpanel.reset();
}

export function trackEvent(eventName: AnalyticsEventName, page?: FunnelPage, props: AnalyticsProps = {}) {
  initAnalytics();
  mixpanel.track(eventName, cleanProps({ ...globalProps(page), ...props }));
}

export function emailDomain(email: string) {
  return email.split("@")[1]?.toLowerCase() || "unknown";
}

export function answerAnalyticsProps(page: FunnelPage, value: unknown): AnalyticsProps {
  return cleanProps({
    data_key: page.dataKey,
    answer_value: Array.isArray(value) ? undefined : value,
    answer_count: Array.isArray(value) ? value.length : 1,
    page_type: page.pageType
  });
}

