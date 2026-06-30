import { useMemo, useState, type CSSProperties } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { answerAnalyticsProps, trackEvent } from "../runtime/analytics";
import { bmiCategory, calculateBmi, kgToLbs, normalizeUnit, normalizeWeightFromDisplay, targetWeightWarning } from "../runtime/unitConversion";

function readHeightCm(answers: Record<string, unknown>) {
  const height = answers.height as { cm?: number } | undefined;
  return height?.cm;
}

function readCurrentWeightKg(answers: Record<string, unknown>) {
  const weight = answers.currentWeight as { kg?: number } | undefined;
  return weight?.kg;
}

function weightDisplay(unit: string, value: { kg?: number; lbs?: number } | undefined) {
  const normalized = normalizeUnit(unit);
  if (normalized === "kg") return value?.kg ? String(Math.round(value.kg)) : "";
  return value?.lbs ? String(Math.round(value.lbs)) : "";
}

function defaultObject(value: unknown): Record<string, number> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, number> : undefined;
}

function bmiInsight(bmi: number | null) {
  if (!bmi) return null;
  if (bmi < 18.5) {
    return {
      tone: "underweight",
      icon: "!",
      label: "underweight",
      body: "You have a clear starting point. We'll use your BMI to shape a plan that supports steady strength, energy, and healthy progress."
    };
  }
  if (bmi < 25) {
    return {
      tone: "normal",
      icon: "✓",
      label: "normal",
      body: "You're starting from a solid place. We'll use your BMI to tailor your plan around your goal, routine, and preferred pace."
    };
  }
  if (bmi < 30) {
    return {
      tone: "overweight",
      icon: "!",
      label: "overweight",
      body: "This gives us useful context for your plan. We'll use your BMI to guide realistic weight-loss pacing and daily workout intensity."
    };
  }
  return {
    tone: "obese",
    icon: "!",
    label: "obese",
    body: "There may be meaningful room for progress. We'll use your BMI to create a plan focused on steady movement, confidence, and sustainable weight loss."
  };
}

export function WeightInputPage({ page, answers, saveAnswer, onNext }: RendererProps) {
  const defaultValue = defaultObject(page.defaultValue);
  const measurementType = typeof page.measurementType === "string" ? page.measurementType : page.variant;
  const isCurrentWeight = measurementType === "current_weight";
  const isTargetWeight = measurementType === "target_weight";
  const shouldShowBmiCard = Boolean(page.showBmiCard) || isCurrentWeight;
  const shouldShowTargetCard = Boolean(page.showTargetWarning || page.showGoalCard) || isTargetWeight;
  const [unit, setUnit] = useState(normalizeUnit(page.defaultUnit || "kg"));
  const [display, setDisplay] = useState(weightDisplay(page.defaultUnit || "kg", defaultValue));
  const numericDisplay = Number(display || 0);
  const currentValue = useMemo(() => normalizeWeightFromDisplay(unit, numericDisplay), [unit, numericDisplay]);
  const heightCm = readHeightCm(answers);
  const bmi = calculateBmi(heightCm, currentValue.kg);
  const category = bmiCategory(bmi);
  const insight = isCurrentWeight ? bmiInsight(bmi) : null;
  const targetWarning = isTargetWeight && shouldShowTargetCard ? targetWeightWarning(readCurrentWeightKg(answers), currentValue.kg, heightCm) : null;
  const unitOptions = page.units || ["lbs", "kg"];
  const activeUnitIndex = Math.max(0, unitOptions.findIndex((u) => normalizeUnit(u) === unit));
  const unitTabStyle = { "--active-index": activeUnitIndex, "--unit-count": unitOptions.length } as CSSProperties;
  const valid = unit === "kg" ? currentValue.kg >= 25 && currentValue.kg <= 300 : currentValue.lbs >= 55 && currentValue.lbs <= 660;
  const showRangeError = display.length > 0 && !valid;
  const rangeMessage = unit === "kg" ? "Please enter a value from 25 kg to 300 kg." : "Please enter a value from 55 lbs to 660 lbs.";

  const changeUnit = (nextUnit: string) => {
    const normalized = normalizeUnit(nextUnit);
    setUnit(normalized);
    setDisplay(normalized === "kg" ? String(Math.round(currentValue.kg)) : String(kgToLbs(currentValue.kg)));
  };

  const save = () => {
    if (!valid) return;
    const payload = {
      ...currentValue,
      ...(isCurrentWeight ? { bmi, bmiCategory: category } : {}),
      ...(isTargetWeight ? { targetBmi: bmi, targetBmiCategory: category } : {})
    };
    void saveAnswer(page.dataKey!, payload).then(() => {
      trackEvent("OB Answer Submitted", page, answerAnalyticsProps(page, payload));
      onNext();
    });
  };

  return (
    <section className="page-stack measurement-page compact-measurement">
      <h1>{page.title}</h1>
      <div className="unit-tabs compact-tabs" style={unitTabStyle}>
        <span className="unit-tabs-indicator" aria-hidden="true" />
        {unitOptions.map((u) => (
          <button key={u} aria-pressed={unit === normalizeUnit(u)} className={unit === normalizeUnit(u) ? "active" : ""} onClick={() => changeUnit(u)}>
            {u}
          </button>
        ))}
      </div>
      <label className="measurement-line-input" style={{ "--digits": Math.max(1, display.length || 1) } as CSSProperties}>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={display}
          placeholder="0"
          onChange={(event) => setDisplay(event.target.value.replace(/\D/g, ""))}
          aria-label="Weight"
        />
        <span>{unit}</span>
      </label>
      {showRangeError ? <p className="measurement-range error-text">{rangeMessage}</p> : null}
      {shouldShowBmiCard && insight && bmi && display && valid ? (
        <div className={`bmi-card bmi-card-${insight.tone}`}>
          <div className="bmi-card-heading">
            <span className="bmi-card-icon" aria-hidden="true">{insight.icon}</span>
            <strong>Your BMI is {bmi} which is considered <b>{insight.label}</b></strong>
          </div>
          <p>{insight.body}</p>
        </div>
      ) : null}
      {targetWarning && display ? (
        <div className={`target-weight-card target-weight-card-${targetWarning.tone}`}>
          <span className="target-weight-card-icon" aria-hidden="true">{targetWarning.icon}</span>
          <div>
            <strong>{targetWarning.title}</strong>
            <span className="target-weight-delta">{targetWarning.deltaLabel}</span>
            <p>{targetWarning.body}</p>
          </div>
        </div>
      ) : null}
      <button className="primary-button sticky-button" disabled={!valid} onClick={save}>Continue</button>
    </section>
  );
}

