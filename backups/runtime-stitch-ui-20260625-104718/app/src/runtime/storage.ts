import type { Answers, Identity } from "./types";

export const storage = {
  answers: "web2app.answers",
  identity: "web2app.identity",
  route: "web2app.route",
  committedPhase: "web2app.committedPhase",
  selectedPlan: "web2app.selectedPlan",
  checkout: "web2app.checkout",
  subscription: "web2app.subscription"
} as const;

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function readAnswers() {
  return readJson<Answers>(storage.answers, {});
}

export function writeAnswers(answers: Answers) {
  writeJson(storage.answers, answers);
}

export function readIdentity() {
  return readJson<Identity | null>(storage.identity, null);
}

export function writeIdentity(identity: Identity) {
  writeJson(storage.identity, identity);
}

export function hasSessionIdentity() {
  return Boolean(readIdentity()?.uid);
}

export function clearRuntimeSession() {
  sessionStorage.removeItem(storage.answers);
  sessionStorage.removeItem(storage.identity);
  sessionStorage.removeItem(storage.route);
  sessionStorage.removeItem(storage.committedPhase);
  sessionStorage.removeItem(storage.selectedPlan);
  sessionStorage.removeItem(storage.checkout);
  sessionStorage.removeItem(storage.subscription);
}

export function committedPhase() {
  return sessionStorage.getItem(storage.committedPhase) || "entry";
}

export function commitPhase(phase: string) {
  sessionStorage.setItem(storage.committedPhase, phase);
}

