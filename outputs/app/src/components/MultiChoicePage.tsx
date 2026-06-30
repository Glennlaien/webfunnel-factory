import type { RendererProps } from "../runtime/rendererRegistry";
import { answerAnalyticsProps, trackEvent } from "../runtime/analytics";
import { ChoiceOptions } from "./ChoiceOptions";

export function MultiChoicePage({ page, answers, saveAnswer, onNext }: RendererProps) {
  const selected = Array.isArray(answers[page.dataKey!]) ? answers[page.dataKey!] as string[] : [];
  const minSelections = page.minSelections ?? 1;
  const disabled = selected.length < minSelections;

  const toggle = (value: string) => {
    const next = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];
    void saveAnswer(page.dataKey!, next);
  };

  return (
    <section className="page-stack choice-page multi-choice-page">
      <div className="choice-header">
        <h1>{page.title}</h1>
        <p>{page.subtitle || "Choose all that apply"}</p>
      </div>
      <div className="choice-scroll-area">
        <ChoiceOptions page={page} mode="multi" selectedValues={selected} onToggle={toggle} />
      </div>
      <button className="primary-button sticky-button" disabled={disabled} onClick={() => {
        trackEvent("OB Answer Submitted", page, answerAnalyticsProps(page, selected));
        onNext();
      }}>Continue</button>
    </section>
  );
}

