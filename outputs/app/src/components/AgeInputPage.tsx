import { Ruler } from "lucide-react";
import { useState, type CSSProperties } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { answerAnalyticsProps, trackEvent } from "../runtime/analytics";

function initialAge(value: { age?: number } | undefined) {
  return value?.age ? String(Math.round(value.age)) : "22";
}

export function AgeInputPage({ page, saveAnswer, onNext }: RendererProps) {
  const [display, setDisplay] = useState(initialAge(page.defaultValue as { age?: number } | undefined));
  const age = Number(display || 0);
  const valid = age >= 13 && age <= 100;
  const showRangeError = display.length > 0 && !valid;

  const save = () => {
    if (!valid) return;
    void saveAnswer(page.dataKey!, age).then(() => {
      trackEvent("OB Answer Submitted", page, answerAnalyticsProps(page, age));
      onNext();
    });
  };

  return (
    <section className="page-stack measurement-page compact-measurement age-input-page">
      <h1>{page.title}</h1>
      <label className="measurement-line-input age-line-input" style={{ "--digits": Math.max(1, display.length || 1) } as CSSProperties}>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={display}
          placeholder="0"
          onChange={(event) => setDisplay(event.target.value.replace(/\D/g, ""))}
          aria-label="Age"
        />
      </label>
      {showRangeError ? <p className="measurement-range error-text">Please enter an age from 13 to 100.</p> : null}
      <div className="age-personalization-note">
        <Ruler size={22} />
        <div>
          <strong>We only ask your age to personalize your plan</strong>
          <p>Age helps us adjust workout intensity, pacing, and body insights for you.</p>
        </div>
      </div>
      <button className="primary-button sticky-button" disabled={!valid} onClick={save}>Continue</button>
    </section>
  );
}

