import { Activity, Dumbbell, HeartPulse, Target } from "lucide-react";
import type { CSSProperties } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { bmiCategory, calculateBmi } from "../runtime/unitConversion";

type AnswerBinding = {
  fitnessLevel?: string[];
  focusAreas?: string[];
  blockers?: string[];
  motivation?: string[];
};

type PageWithBinding = {
  answerBinding?: AnswerBinding;
  [key: string]: unknown;
};

function asLabel(value: unknown, fallback: string): string {
  if (Array.isArray(value)) return value.map((item) => asLabel(item, "")).filter(Boolean).join(", ") || fallback;
  if (typeof value !== "string") return fallback;
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function readBinding(page: PageWithBinding) {
  return (page.answerBinding || {}) as AnswerBinding;
}

function firstAnswer(answers: Record<string, unknown>, keys: string[] | undefined, fallback: string): string {
  for (const key of keys || []) {
    const value = answers[key];
    if (Array.isArray(value) && value.length) return asLabel(value, fallback);
    if (typeof value === "string" && value) return asLabel(value, fallback);
  }
  return fallback;
}

function readWeightKg(value: unknown) {
  return (value as { kg?: number } | undefined)?.kg;
}

function readHeightCm(value: unknown) {
  return (value as { cm?: number } | undefined)?.cm;
}

function bmiPosition(bmi: number | null) {
  if (!bmi) return 0;
  return Math.max(0, Math.min(100, ((Math.min(bmi, 40) - 15) / 25) * 100));
}

function insightFor(category: string | null) {
  if (category === "normal") {
    return {
      tone: "normal",
      title: "Your starting point looks balanced",
      body: "We'll use this profile to keep your plan focused on consistency, visible progress, and the goal you chose."
    };
  }
  if (category === "underweight") {
    return {
      tone: "underweight",
      title: "Your plan should support strength",
      body: "We'll use your profile to guide a plan that supports energy, confidence, and steady physical progress."
    };
  }
  return {
    tone: category === "obese" ? "obese" : "overweight",
    title: "Your plan should match your starting point",
    body: "We'll use your BMI, goal, and focus areas to personalize pacing and build a plan around sustainable progress."
  };
}

function bodyAssetSrc(page: { assets?: Record<string, { optionValue?: string; src?: string }> }, category: string | null) {
  const normalized = category || "normal";
  const assets = Object.values(page.assets || {});
  return assets.find((asset) => asset.optionValue === normalized)?.src
    || assets.find((asset) => asset.optionValue === "normal")?.src
    || assets[0]?.src;
}

export function SummaryPage({ page, answers, onNext }: RendererProps) {
  const variant = typeof page.variant === "string" ? page.variant : "bmi_profile";
  const heightCm = readHeightCm(answers.height);
  const currentWeightKg = readWeightKg(answers.currentWeight);
  const targetWeightKg = readWeightKg(answers.targetWeight);
  const bmi = calculateBmi(heightCm, currentWeightKg);
  const category = bmiCategory(bmi);
  const insight = insightFor(category);
  const deltaKg = currentWeightKg && targetWeightKg ? Math.round((currentWeightKg - targetWeightKg) * 10) / 10 : null;
  const bodySrc = bodyAssetSrc(page, category);
  const binding = readBinding(page);
  const fitnessLevel = firstAnswer(answers, binding.fitnessLevel || ["starterLevel", "fitnessLevel", "capabilityLevel"], "Personalized");
  const focusAreas = firstAnswer(answers, binding.focusAreas || ["focusAreas"], "Your selected areas");
  const goalChange = deltaKg ? `${Math.abs(deltaKg)} kg ${deltaKg >= 0 ? "to lose" : "to gain"}` : "Based on your target";

  const BmiCard = () => (
    <div className="summary-bmi-card">
      <div className="summary-bmi-head">
        <strong>Body Mass Index (BMI)</strong>
        <span>{category || "Profile"} {bmi ? `- ${bmi}` : ""}</span>
      </div>
      <div className="summary-bmi-scale">
        <span className="summary-bmi-marker" style={{ "--bmi-position": `${bmiPosition(bmi)}%` } as CSSProperties}>
          You {bmi ? `- ${bmi}` : ""}
        </span>
        <div className="summary-bmi-track" />
      </div>
      <div className="summary-bmi-ticks">
        <span>15</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>
      <div className="summary-bmi-labels">
        <span>Underweight</span>
        <span>Normal</span>
        <span>Overweight</span>
        <span>Obese</span>
      </div>
    </div>
  );

  const FactList = () => (
    <div className="summary-facts">
      <div className="summary-fact">
        <Dumbbell size={22} />
        <span>Fitness Level</span>
        <strong>{fitnessLevel}</strong>
      </div>
      <div className="summary-fact">
        <Target size={22} />
        <span>Main Focus</span>
        <strong>{focusAreas}</strong>
      </div>
      <div className="summary-fact">
        <Activity size={22} />
        <span>Goal Change</span>
        <strong>{goalChange}</strong>
      </div>
    </div>
  );

  const BodyVisual = () => (
    <div className={`summary-body-visual summary-body-${category || "normal"}`} aria-label="Body profile visual">
      {bodySrc ? <img src={bodySrc} alt="" /> : <div />}
    </div>
  );

  const InsightCard = () => (
    <div className={`summary-insight-card bmi-card-${insight.tone}`}>
      <HeartPulse size={22} />
      <div>
        <strong>{insight.title}</strong>
        <p>{insight.body}</p>
      </div>
    </div>
  );

  return (
    <section className={`page-stack summary-page summary-variant-${variant}`}>
      <h1>{page.title}</h1>
      {variant === "body_comparison" ? (
        <>
          <div className="summary-profile-grid visual-first">
            <BodyVisual />
            <FactList />
          </div>
          <BmiCard />
          <InsightCard />
        </>
      ) : variant === "clinical_readout" ? (
        <>
          <BmiCard />
          <InsightCard />
          <div className="summary-profile-grid clinical-grid">
            <FactList />
            <BodyVisual />
          </div>
        </>
      ) : (
        <>
          <BmiCard />
          <div className="summary-profile-grid">
            <FactList />
            <BodyVisual />
          </div>
          <InsightCard />
        </>
      )}
      <button className="primary-button sticky-button" onClick={onNext}>{page.cta || "Continue"}</button>
    </section>
  );
}
