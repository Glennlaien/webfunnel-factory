import type { CSSProperties } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";

function readKg(value: unknown) {
  return (value as { kg?: number } | undefined)?.kg;
}

function planMonths(currentKg?: number, targetKg?: number) {
  if (!currentKg || !targetKg) return 3;
  const delta = Math.abs(currentKg - targetKg);
  if (delta < 1) return 3;
  const monthlyPace = 2.5;
  return Math.max(1, Math.ceil(delta / monthlyPace));
}

function addMonths(date: Date, monthCount: number) {
  return new Date(date.getFullYear(), date.getMonth() + monthCount, date.getDate());
}

function formatTargetDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function monthLabel(date: Date, monthCount: number) {
  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  if (monthCount <= 12) return month;
  const year = String(date.getFullYear()).slice(-2);
  return month + " '" + year;
}

function timelineDates(monthCount: number) {
  const now = new Date();
  const labelCount = Math.min(5, monthCount + 1);
  return Array.from({ length: labelCount }, (_, index) => {
    const offset = Math.round((monthCount / (labelCount - 1)) * index);
    return addMonths(now, offset);
  });
}

type ChartMode = "loss" | "gain" | "maintain";

function chartMode(currentKg?: number, targetKg?: number): ChartMode {
  if (!currentKg || !targetKg) return "loss";
  const delta = targetKg - currentKg;
  if (Math.abs(delta) < 1) return "maintain";
  return delta > 0 ? "gain" : "loss";
}

function topCopy(mode: ChartMode) {
  if (mode === "gain") return "We built a steady plan to support healthy progress and strength.";
  if (mode === "maintain") return "We built a steady plan to help you stay consistent and feel in control.";
  return "We built a steady plan to guide your progress week by week.";
}

function chartLabel(mode: ChartMode) {
  if (mode === "gain") return "Strength path";
  if (mode === "maintain") return "Consistency path";
  return "Progress path";
}

function fallbackWeight(mode: ChartMode, index: number, total: number) {
  if (mode === "gain") return Math.round(60 + (8 / Math.max(1, total - 1)) * index);
  if (mode === "maintain") return 60;
  return Math.round(70 - (8 / Math.max(1, total - 1)) * index);
}

function smoothProgress(progress: number, mode: ChartMode) {
  if (mode === "maintain") return progress;
  const eased = progress * progress * (3 - (2 * progress));
  const midLift = Math.sin(progress * Math.PI) * 0.08;
  return Math.min(1, Math.max(0, eased + midLift));
}

type ChartPoint = {
  date: Date;
  label: string;
  value: number;
  x: number;
  y: number;
  left: number;
  top: number;
};

function chartPoints(currentKg: number | undefined, targetKg: number | undefined, dates: Date[], monthCount: number, mode: ChartMode): ChartPoint[] {
  const total = dates.length;
  const start = currentKg ?? fallbackWeight(mode, 0, total);
  const end = targetKg ?? fallbackWeight(mode, total - 1, total);
  const min = Math.min(start, end);
  const max = Math.max(start, end);
  const range = Math.max(1, max - min);
  return dates.map((date, index) => {
    const progress = total === 1 ? 0 : index / (total - 1);
    const shapedProgress = smoothProgress(progress, mode);
    const value = mode === "maintain" ? start : start + ((end - start) * shapedProgress);
    const normalized = mode === "maintain"
      ? 0.5 + Math.sin(index * 1.25) * 0.035
      : 0.16 + ((max - value) / range) * 0.66;
    return {
      date,
      label: monthLabel(date, monthCount),
      value: Math.round(value),
      x: 24 + (248 * progress),
      y: 24 + (100 * normalized),
      left: ((24 + (248 * progress)) / 320) * 100,
      top: ((24 + (100 * normalized)) / 150) * 100
    };
  });
}

function curvePath(points: ChartPoint[]) {
  if (points.length < 2) return "";
  const tension = 0.28;
  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const before = points[Math.max(0, index - 1)];
    const after = points[Math.min(points.length - 1, index + 2)];
    const dx = point.x - previous.x;
    const previousSlope = (point.y - before.y) / Math.max(1, point.x - before.x);
    const nextSlope = (after.y - previous.y) / Math.max(1, after.x - previous.x);
    const c1x = previous.x + (dx * tension);
    const c1y = previous.y + (previousSlope * dx * tension);
    const c2x = point.x - (dx * tension);
    const c2y = point.y - (nextSlope * dx * tension);
    return path + " C " + c1x + " " + c1y + ", " + c2x + " " + c2y + ", " + point.x + " " + point.y;
  }, "M " + points[0].x + " " + points[0].y);
}

function areaPath(points: ChartPoint[], path: string) {
  const first = points[0];
  const last = points[points.length - 1];
  return path + " L " + last.x + " 132 L " + first.x + " 132 Z";
}

export function PlanReadyPage({ page, answers, onNext }: RendererProps) {
  const currentKg = readKg(answers.currentWeight);
  const targetKg = readKg(answers.targetWeight);
  const months = planMonths(currentKg, targetKg);
  const dates = timelineDates(months);
  const mode = chartMode(currentKg, targetKg);
  const points = chartPoints(currentKg, targetKg, dates, months, mode);
  const path = curvePath(points);
  const area = areaPath(points, path);
  const targetDate = formatTargetDate(dates[dates.length - 1]);
  const targetLabel = targetKg ?? points[points.length - 1].value;

  return (
    <section className="page-stack plan-ready-page">
      <div className="plan-ready-hero">
        <h1>{page.title}</h1>
        <p>{topCopy(mode)}</p>
      </div>
      <p className="plan-ready-target"><strong>{targetLabel}kg</strong> by {targetDate}</p>
      <div className="plan-ready-card">
        <div className="plan-ready-card-head">
          <span>{chartLabel(mode)}</span>
          <strong>Starter plan</strong>
        </div>
        <div className="plan-ready-chart" aria-label="Plan preview chart">
          <svg viewBox="0 0 320 150" role="img" aria-hidden="true">
            <defs>
              <linearGradient id="readyCurveGradient" x1="34" y1="42" x2="286" y2="112" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E9D34D" offset="0%" />
                <stop stopColor="#91CF7A" offset="58%" />
                <stop stopColor="#55CDB7" offset="100%" />
              </linearGradient>
              <linearGradient id="readyAreaGradient" x1="0" y1="42" x2="0" y2="138" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E9D34D" stopOpacity="0.18" offset="0%" />
                <stop stopColor="#55CDB7" stopOpacity="0.08" offset="100%" />
              </linearGradient>
            </defs>
            <path className="ready-area-path" d={area} />
            <path className="ready-curve-path" d={path} />
          </svg>
          {points.map((point, index) => (
            <span
              className={"ready-chart-point" + (index === 0 ? " start-point" : "") + (index === points.length - 1 ? " end-point" : "")}
              key={point.label + index}
              style={{
                left: point.left + "%",
                top: point.y + "px",
                "--point-index": index,
                "--point-y": point.y + "px"
              } as CSSProperties & Record<"--point-index", number> & Record<"--point-y", string>}
            >
              <span className="ready-chart-badge">{point.value}KG</span>
              <span className="ready-chart-dot" />
            </span>
          ))}
          {points.map((point, index) => (
            <span
              className="ready-chart-month-tick"
              key={point.label + "-month-" + index}
              style={{ left: point.left + "%", "--point-index": index } as CSSProperties & Record<"--point-index", number>}
            >
              {point.label}
            </span>
          ))}
          <span className={"expected-result-label " + mode + "-expected-label"}>Expected<br />result</span>
        </div>
      </div>
      <button className="primary-button sticky-button" onClick={onNext}>{page.cta || "Continue"}</button>
    </section>
  );
}
