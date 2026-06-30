export type HeightValue = {
  cm: number;
  in: number;
  ft: number;
  inch: number;
};

export type WeightValue = {
  kg: number;
  lbs: number;
};

export function normalizeUnit(value: string) {
  const normalized = value.toLowerCase();
  if (normalized === "lb") return "lbs";
  if (normalized === "ft" || normalized === "feet" || normalized === "ft_in") return "in";
  return normalized;
}

export function cmToImperial(cm: number) {
  const totalInches = Math.round(cm / 2.54);
  return {
    in: totalInches,
    ft: Math.floor(totalInches / 12),
    inch: totalInches % 12
  };
}

export function inchesToCm(inches: number) {
  return Math.round(inches * 2.54);
}

export function normalizeHeightFromDisplay(unit: string, value: number): HeightValue {
  const normalized = normalizeUnit(unit);
  const cm = normalized === "cm" ? Math.round(value) : inchesToCm(value);
  const imperial = cmToImperial(cm);
  return { cm, ...imperial };
}

export function kgToLbs(kg: number) {
  return Math.round(kg * 2.20462);
}

export function lbsToKg(lbs: number) {
  return Math.round((lbs / 2.20462) * 10) / 10;
}

export function normalizeWeightFromDisplay(unit: string, value: number): WeightValue {
  const normalized = normalizeUnit(unit);
  const kg = normalized === "kg" ? Math.round(value * 10) / 10 : lbsToKg(value);
  return { kg, lbs: kgToLbs(kg) };
}

export function calculateBmi(heightCm?: number, weightKg?: number) {
  if (!heightCm || !weightKg) return null;
  const meters = heightCm / 100;
  return Math.round((weightKg / (meters * meters)) * 10) / 10;
}

export function bmiCategory(bmi: number | null) {
  if (!bmi) return null;
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

export function targetWeightWarning(currentKg?: number, targetKg?: number, heightCm?: number) {
  if (!currentKg || !targetKg) return null;
  const delta = Math.round((targetKg - currentKg) * 10) / 10;
  const absDelta = Math.abs(delta);
  const deltaKg = Math.round(absDelta * 10) / 10;
  const deltaLbs = kgToLbs(absDelta);
  const deltaDirection = absDelta <= 1 ? "maintain" : delta < 0 ? "decrease" : "increase";
  const deltaLabel =
    deltaDirection === "maintain"
      ? "Maintain within 1 kg"
      : `${deltaDirection === "decrease" ? "Decrease" : "Increase"} ${deltaKg} kg / ${deltaLbs} lbs`;
  const deltaInfo = { deltaKg, deltaLbs, deltaDirection, deltaLabel };
  const lossRatio = (currentKg - targetKg) / currentKg;
  const targetBmi = calculateBmi(heightCm, targetKg);
  if (targetBmi && targetBmi < 18.5) {
    return {
      ...deltaInfo,
      tone: "warning",
      icon: "!",
      title: "Low weight alert",
      body: "This target may be below a typical healthy range for your height. We'll keep the plan focused on safer pacing and supportive habits."
    };
  }
  if (lossRatio > 0.25) {
    return {
      ...deltaInfo,
      tone: "warning",
      icon: "!",
      title: "Long-term transformation goal",
      body: "This is a bigger change, so we'll focus on steady progress, safe pacing, and habits you can keep."
    };
  }
  if (absDelta <= 1) {
    return {
      ...deltaInfo,
      tone: "steady",
      icon: "✓",
      title: "Steady target",
      body: "This goal helps us build a plan focused on consistency, strength, and keeping your progress stable."
    };
  }
  if (delta < 0 && absDelta <= 5) {
    return {
      ...deltaInfo,
      tone: "loss-light",
      icon: "↓",
      title: "Gentle weight-loss goal",
      body: "We'll pace your plan around small, sustainable changes that fit into your routine."
    };
  }
  if (delta < 0 && absDelta <= 20) {
    return {
      ...deltaInfo,
      tone: "loss-structured",
      icon: "↓",
      title: "Structured weight-loss goal",
      body: "We'll break this target into realistic milestones so your plan feels clear and manageable."
    };
  }
  if (delta < 0) {
    return {
      ...deltaInfo,
      tone: "warning",
      icon: "!",
      title: "Long-term transformation goal",
      body: "This is a bigger change, so we'll focus on steady progress, safe pacing, and habits you can keep."
    };
  }
  if (delta > 0 && absDelta <= 5) {
    return {
      ...deltaInfo,
      tone: "gain-light",
      icon: "↑",
      title: "Lean-gain goal",
      body: "We'll help you build a plan focused on strength, consistency, and healthy weight gain."
    };
  }
  if (delta > 0) {
    return {
      ...deltaInfo,
      tone: "gain-structured",
      icon: "↑",
      title: "Build-up goal",
      body: "We'll pace your plan around gradual progress, strength work, and routines that support healthy gains."
    };
  }
  return {
    ...deltaInfo,
    tone: "steady",
    icon: "✓",
    title: "Steady target",
    body: "This goal helps us build a plan focused on consistency, strength, and keeping your progress stable."
  };
}
