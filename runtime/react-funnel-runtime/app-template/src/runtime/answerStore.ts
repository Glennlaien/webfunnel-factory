import type { Answers, SaveAnswer } from "./types";
import { createAnonymousUser } from "./billingClient";
import { persistAnswersToFirestore, signInBillingCustomToken } from "./firebase";
import { hasSessionIdentity, readAnswers, readIdentity, writeAnswers } from "./storage";
import { identifyAnalytics, trackEvent } from "./analytics";

export async function ensureIdentityForFirstAnswer() {
  const existing = readIdentity();
  if (existing?.uid) return existing;
  const anonymous = await createAnonymousUser();
  const identity = await signInBillingCustomToken({ ...anonymous, isAnonymous: true });
  identifyAnalytics(identity.uid);
  trackEvent("Identity Created", undefined, { uid: identity.uid });
  return identity;
}

export async function syncAnswer(answers: Answers, options?: { blocking?: boolean }) {
  let identity = readIdentity();
  if (!identity?.uid) {
    if (!options?.blocking) return;
    identity = await ensureIdentityForFirstAnswer();
  }
  try {
    await persistAnswersToFirestore(identity, answers);
  } catch (error) {
    console.warn("Answer Firestore sync failed", error);
  }
}

export function createSaveAnswer(setAnswers: (answers: Answers) => void): SaveAnswer {
  const saveAnswer = async (dataKey: string, value: unknown, options?: { blocking?: boolean }) => {
    const answers = { ...readAnswers(), [dataKey]: value };
    writeAnswers(answers);
    setAnswers(answers);
    if (options?.blocking) {
      await syncAnswer(answers, options);
      return;
    }
    void syncAnswer(answers).catch((error) => {
      console.warn("Answer sync failed", error);
    });
  };
  return saveAnswer;
}

export { hasSessionIdentity };
