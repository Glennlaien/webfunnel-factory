import { useState } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { hasSessionIdentity } from "../runtime/answerStore";
import { answerAnalyticsProps, trackEvent } from "../runtime/analytics";
import { ChoiceOptions } from "./ChoiceOptions";
import { LoadingOverlay } from "./Spinner";

export function SingleChoicePage({ page, saveAnswer, onNext }: RendererProps) {
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const select = async (value: string) => {
    setError("");
    try {
      if (!hasSessionIdentity()) {
        setStarting(true);
      }
      await saveAnswer(page.dataKey!, value, { blocking: !hasSessionIdentity() });
      trackEvent("OB Answer Submitted", page, answerAnalyticsProps(page, value));
      onNext();
    } catch {
      setError("We couldn't start your session. Please try again.");
    } finally {
      setStarting(false);
    }
  };

  return (
    <section className="page-stack choice-page single-choice-page">
      <div className="choice-header">
        <h1>{page.title}</h1>
        <p>{page.subtitle}</p>
      </div>
      <div className="choice-scroll-area">
        <ChoiceOptions page={page} mode="single" selectedValues={[]} disabled={starting} onToggle={select} />
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <LoadingOverlay active={starting} label="Starting your session" />
    </section>
  );
}

