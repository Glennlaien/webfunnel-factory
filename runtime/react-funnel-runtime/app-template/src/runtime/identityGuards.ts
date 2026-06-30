import { refreshIdentityToken } from "./firebase";
import { readIdentity } from "./storage";
import { routeTo } from "./navigation";

export async function ensureIdentity() {
  const identity = await refreshIdentityToken();
  if (!identity?.uid) throw new Error("Missing session identity.");
  return identity;
}

export async function requireSessionIdentity(route: string) {
  const existing = readIdentity();
  if (!existing?.uid) {
    routeTo(route);
    throw new Error("Please start or log in first.");
  }
  return ensureIdentity();
}
