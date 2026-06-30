import { Ruler } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { answerAnalyticsProps, trackEvent } from "../runtime/analytics";
import { cmToImperial, inchesToCm, normalizeHeightFromDisplay, normalizeUnit } from "../runtime/unitConversion";

function initialCm(value: { cm?: number; in?: number; ft?: number; inch?: number } | undefined) {
  if (value?.cm) return value.cm;
  if (value?.in) return inchesToCm(value.in);
  if (value?.ft || value?.inch) return inchesToCm((value.ft ?? 0) * 12 + (value.inch ?? 0));
  return 165;
}

function initialImperial(value: { cm?: number; in?: number; ft?: number; inch?: number } | undefined) {
  if (value?.ft || value?.inch) return { ft: value.ft ?? 0, inch: value.inch ?? 0 };
  if (value?.in) return cmToImperial(inchesToCm(value.in));
  return cmToImperial(value?.cm ?? 165);
}

function defaultObject(value: unknown): Record<string, number> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, number> : undefined;
}

export function HeightInputPage({ page, saveAnswer, onNext }: RendererProps) {
  const defaultValue = defaultObject(page.defaultValue);
  const [unit, setUnit] = useState(normalizeUnit(page.defaultUnit || "cm"));
  const [cmDisplay, setCmDisplay] = useState(String(initialCm(defaultValue)));
  const imperialDefault = initialImperial(defaultValue);
  const [ftDisplay, setFtDisplay] = useState(String(imperialDefault.ft));
  const [inchDisplay, setInchDisplay] = useState(String(imperialDefault.inch));
  const totalInches = Number(ftDisplay || 0) * 12 + Number(inchDisplay || 0);
  const currentValue = useMemo(() => {
    if (unit === "cm") return normalizeHeightFromDisplay("cm", Number(cmDisplay || 0));
    return normalizeHeightFromDisplay("in", totalInches);
  }, [unit, cmDisplay, totalInches]);
  const unitOptions = page.units || ["ft", "cm"];
  const activeUnitIndex = Math.max(0, unitOptions.findIndex((u) => normalizeUnit(u) === unit));
  const unitTabStyle = { "--active-index": activeUnitIndex, "--unit-count": unitOptions.length } as CSSProperties;
  const valid = unit === "cm" ? currentValue.cm >= 90 && currentValue.cm <= 250 : currentValue.in >= 36 && currentValue.in <= 98;
  const hasInput = unit === "cm" ? cmDisplay.length > 0 : ftDisplay.length > 0 || inchDisplay.length > 0;
  const showRangeError = hasInput && !valid;
  const rangeMessage = unit === "cm" ? "Please enter a value from 90 cm to 250 cm." : "Please enter a value from 3 ft 0 in to 8 ft 2 in.";

  const changeUnit = (nextUnit: string) => {
    const normalized = normalizeUnit(nextUnit);
    if (normalized === unit) return;
    if (normalized === "cm") {
      setCmDisplay(String(currentValue.cm));
    } else {
      const imperial = cmToImperial(currentValue.cm);
      setFtDisplay(String(imperial.ft));
      setInchDisplay(String(imperial.inch));
    }
    setUnit(normalized);
  };

  const save = () => {
    if (!valid) return;
    void saveAnswer(page.dataKey!, currentValue).then(() => {
      trackEvent("OB Answer Submitted", page, answerAnalyticsProps(page, currentValue));
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
            {normalizeUnit(u) === "in" ? "ft" : u}
          </button>
        ))}
      </div>
      {unit === "cm" ? (
        <label className="measurement-line-input" style={{ "--digits": Math.max(1, cmDisplay.length) } as CSSProperties}>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={cmDisplay}
            placeholder="0"
            onChange={(event) => setCmDisplay(event.target.value.replace(/\D/g, ""))}
            aria-label="Height in centimeters"
          />
          <span>cm</span>
        </label>
      ) : (
        <div className="measurement-line-input imperial-height-inputs" role="group" aria-label="Height in feet and inches">
          <label style={{ "--digits": Math.max(1, ftDisplay.length) } as CSSProperties}>
            <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={ftDisplay}
            placeholder="0"
            onChange={(event) => setFtDisplay(event.target.value.replace(/\D/g, ""))}
            aria-label="Feet"
          />
            <span>ft</span>
          </label>
          <label style={{ "--digits": Math.max(1, inchDisplay.length) } as CSSProperties}>
            <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={inchDisplay}
            placeholder="0"
            onChange={(event) => setInchDisplay(event.target.value.replace(/\D/g, ""))}
            aria-label="Inches"
          />
            <span>in</span>
          </label>
        </div>
      )}
      {showRangeError ? <p className="measurement-range error-text">{rangeMessage}</p> : null}
      <div className="height-bmi-note">
        <Ruler size={22} />
        <div>
          <strong>Calculating your body mass index</strong>
          <p>BMI is commonly used as a tool to identify potential weight-related health patterns.</p>
        </div>
      </div>
      <button className="primary-button sticky-button" disabled={!valid} onClick={save}>Continue</button>
    </section>
  );
}

