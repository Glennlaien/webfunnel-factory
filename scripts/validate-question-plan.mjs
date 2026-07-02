import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const questionPlanPath = path.join(root, "outputs/capabilities/question-plan.json");
const capabilityPlanPath = path.join(root, "outputs/capabilities/capability-plan.json");

if (!fs.existsSync(questionPlanPath)) fail("Missing outputs/capabilities/question-plan.json");
if (!fs.existsSync(capabilityPlanPath)) fail("Missing outputs/capabilities/capability-plan.json");

const questionPlan = readJson(questionPlanPath);
const capabilityPlan = readJson(capabilityPlanPath);
const capabilities = capabilityPlan.capabilities || [];
const errors = [];
const allowedPageTypes = new Set(["single_choice_page", "multi_choice_page", "intro_page"]);
const allowedSections = new Set(["goals", "training", "body", "routine", "motivation"]);
const fixedDataKeys = new Set(["ageGroup", "ageNum", "height", "currentWeight", "targetWeight", "email", "accountEmail"]);
const ids = new Set();
const dataKeys = new Set();

if (questionPlan.status !== capabilityPlan.status) {
  errors.push(`Question plan status '${questionPlan.status}' does not match capability plan status '${capabilityPlan.status}'`);
}

if (capabilities.length < 8) {
  errors.push(`Capability count is too low (${capabilities.length})`);
}

if (capabilities.length > 30) {
  errors.push(`Capability count is too high (${capabilities.length}); long OB should still stay focused`);
}

for (const capability of capabilities) {
  if (!capability.id) errors.push("Capability is missing id");
  if (capability.id && ids.has(capability.id)) errors.push(`Duplicate capability id '${capability.id}'`);
  if (capability.id) ids.add(capability.id);

  if (!allowedPageTypes.has(capability.pageType)) {
    errors.push(`Capability '${capability.id}' has unsupported pageType '${capability.pageType}'`);
  }

  if (!allowedSections.has(capability.sectionId)) {
    errors.push(`Capability '${capability.id}' has unsupported sectionId '${capability.sectionId}'`);
  }

  if (!capability.title || capability.title.length < 8) {
    errors.push(`Capability '${capability.id}' title is too short`);
  }

  if (capability.pageType === "intro_page") {
    if (capability.dataKey) errors.push(`Intro '${capability.id}' must not have dataKey`);
    if (Array.isArray(capability.options) && capability.options.length) errors.push(`Intro '${capability.id}' must not have options`);
    const words = String(capability.body || "").split(/\s+/).filter(Boolean).length;
    if (words < 20) errors.push(`Intro '${capability.id}' body is too short (${words} words)`);
    if (!capability.assetRequirement?.required) errors.push(`Intro '${capability.id}' must require an intro hero asset`);
  } else {
    if (!capability.dataKey) errors.push(`Question '${capability.id}' is missing dataKey`);
    if (capability.dataKey && fixedDataKeys.has(capability.dataKey)) {
      errors.push(`Question '${capability.id}' uses fixed trunk dataKey '${capability.dataKey}'`);
    }
    if (capability.dataKey && dataKeys.has(capability.dataKey)) errors.push(`Duplicate dataKey '${capability.dataKey}'`);
    if (capability.dataKey) dataKeys.add(capability.dataKey);

    const options = capability.options || [];
    const min = capability.pageType === "multi_choice_page" ? 4 : 3;
    const max = capability.pageType === "multi_choice_page" ? 7 : 5;
    if (options.length < min || options.length > max) {
      errors.push(`Question '${capability.id}' option count ${options.length} is outside ${min}-${max}`);
    }
    const optionValues = new Set();
    for (const option of options) {
      if (!option.value) errors.push(`Question '${capability.id}' has option without value`);
      if (!option.label || option.label.length < 2) errors.push(`Question '${capability.id}' has option label too short`);
      if (option.value && optionValues.has(option.value)) errors.push(`Question '${capability.id}' has duplicate option value '${option.value}'`);
      if (option.value) optionValues.add(option.value);
    }
    if (capability.pageType === "multi_choice_page" && (capability.minSelections ?? 0) < 1) {
      errors.push(`Multi-choice '${capability.id}' must require at least one selection`);
    }
  }

  const requiredFor = capability.requiredFor || [];
  if (!requiredFor.length) errors.push(`Capability '${capability.id}' must include at least one requiredFor value`);
}

const introCount = capabilities.filter((item) => item.pageType === "intro_page").length;
const multiCount = capabilities.filter((item) => item.pageType === "multi_choice_page").length;
const singleCount = capabilities.filter((item) => item.pageType === "single_choice_page").length;
if (introCount < 1) errors.push("Question plan must include at least one intro_page trust bridge");
if (capabilities.length >= 20 && introCount < 3) {
  errors.push("Long question plan must include at least three intro_page trust bridges");
}
if (multiCount < 1) errors.push("Question plan must include at least one multi_choice_page");
if (singleCount < 3) errors.push("Question plan must include at least three single_choice_page items");

const sectionCounts = capabilities.reduce((acc, item) => {
  acc[item.sectionId] = (acc[item.sectionId] || 0) + 1;
  return acc;
}, {});
for (const section of ["goals", "training", "body", "routine", "motivation"]) {
  if (!sectionCounts[section]) errors.push(`Question plan missing section '${section}'`);
}

const coverage = new Set(capabilities.flatMap((item) => item.requiredFor || []));
for (const required of ["summary", "plan_personalization", "paywall_bridge", "plan_schedule", "objection_handling"]) {
  if (!coverage.has(required)) errors.push(`Question plan missing required coverage '${required}'`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Question plan validation passed: ${questionPlan.status} (${questionPlan.provider}/${questionPlan.model})`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
