import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const copyPlanPath = path.join(root, "outputs/copy/copy-plan.json");
const capabilityPlanPath = path.join(root, "outputs/capabilities/capability-plan.json");

if (!fs.existsSync(copyPlanPath)) fail("Missing outputs/copy/copy-plan.json");
if (!fs.existsSync(capabilityPlanPath)) fail("Missing outputs/capabilities/capability-plan.json");

const copyPlan = readJson(copyPlanPath);
const capabilityPlan = readJson(capabilityPlanPath);
const copyById = new Map((copyPlan.capabilities || []).map((item) => [item.id, item]));
const errors = [];

for (const capability of capabilityPlan.capabilities || []) {
  const copy = copyById.get(capability.id);
  if (!copy) {
    errors.push(`Missing copy capability '${capability.id}'`);
    continue;
  }
  if (!copy.title || copy.title.length < 8) errors.push(`Capability '${capability.id}' title is too short`);
  if (capability.pageType === "intro_page") {
    const words = String(copy.body || "").split(/\s+/).filter(Boolean).length;
    if (words < 20) errors.push(`Intro '${capability.id}' body is too short (${words} words)`);
  }
  if (Array.isArray(capability.options) && capability.options.length) {
    const copyOptions = new Map((copy.options || []).map((item) => [item.value, item]));
    for (const option of capability.options) {
      const copyOption = copyOptions.get(option.value);
      if (!copyOption) errors.push(`Capability '${capability.id}' missing option '${option.value}'`);
      if (copyOption && (!copyOption.label || copyOption.label.length < 2)) {
        errors.push(`Capability '${capability.id}' option '${option.value}' label is too short`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const followUps = copyPlan.planGeneration?.followUps || [];
if (followUps.length < 3) errors.push("planGeneration.followUps must include at least 3 items");
for (const item of followUps.slice(0, 3)) {
  if (!item.question || item.question.length < 10) errors.push(`Follow-up '${item.id || "(missing id)"}' question is too short`);
}

const generationTestimonials = copyPlan.planGeneration?.testimonials || [];
if (generationTestimonials.length < 3) errors.push("planGeneration.testimonials must include at least 3 items");

const highlights = copyPlan.paywall?.highlights || [];
if (highlights.length < 4) errors.push("paywall.highlights must include at least 4 items");

const paywallTestimonials = copyPlan.paywall?.testimonials || [];
if (paywallTestimonials.length < 3) errors.push("paywall.testimonials must include at least 3 items");

const faq = copyPlan.paywall?.faq || [];
if (faq.length < 3) errors.push("paywall.faq must include at least 3 items");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Copy plan validation passed: ${copyPlan.status} (${copyPlan.provider}/${copyPlan.model})`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
