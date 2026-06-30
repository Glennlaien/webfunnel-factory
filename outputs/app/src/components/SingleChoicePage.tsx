import { useState } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { hasSessionIdentity } from "../runtime/answerStore";
import { answerAnalyticsProps, trackEvent } from "../runtime/analytics";
import { ChoiceOptions } from "./ChoiceOptions";
import { LoadingOverlay } from "./Spinner";

function textValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

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
  const isAgeGroup = page.id === "age_group" && page.variant === "image_grid";
  const ageBrand = textValue(page.productName, textValue(page.appName, textValue(page.brandName, "Personalized Plan")));

  return (
    <section className={isAgeGroup ? "page-stack choice-page single-choice-page age-group-page" : "page-stack choice-page single-choice-page"}>
      <div className={isAgeGroup ? "choice-header age-group-header" : "choice-header"}>
        {isAgeGroup ? <p className="age-group-brand">{ageBrand}</p> : null}
        <h1>{page.title}</h1>
        {page.subtitle ? <p>{page.subtitle}</p> : null}
      </div>
      <div className="choice-scroll-area">
        <ChoiceOptions page={page} mode="single" selectedValues={[]} disabled={starting} onToggle={select} />
        {isAgeGroup ? (
          <p className="age-group-legal">
            By choosing your age and continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        ) : null}
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <LoadingOverlay active={starting} label="Starting your session" />
    </section>
  );
}

