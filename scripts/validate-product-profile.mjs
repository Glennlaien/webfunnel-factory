import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const profilePath = path.join(root, "outputs/strategy/product-profile-analysis.json");
const briefPath = path.join(root, "outputs/strategy/product-brief.json");

if (!fs.existsSync(profilePath)) fail("Missing outputs/strategy/product-profile-analysis.json");
if (!fs.existsSync(briefPath)) fail("Missing outputs/strategy/product-brief.json");

const analysis = readJson(profilePath);
const brief = readJson(briefPath);
const profile = analysis.normalizedProfile || brief.product?.profile || {};
const errors = [];
const allowedGenderFocus = new Set(["male", "female", "neutral"]);
const allowedLifeStage = new Set(["teen", "young_adult", "adult", "senior", "mixed"]);
const allowedRuntimeModalities = new Set(["tai_chi", "chair_strength", "yoga", "pilates", "calisthenics", "fitness"]);

if (!["ai_product_profile", "keyword_fallback"].includes(analysis.source)) {
  errors.push(`Unsupported product profile source '${analysis.source}'`);
}

if (!allowedGenderFocus.has(profile.genderFocus)) errors.push(`Invalid genderFocus '${profile.genderFocus}'`);
if (!allowedLifeStage.has(profile.lifeStage)) errors.push(`Invalid lifeStage '${profile.lifeStage}'`);
if (!allowedRuntimeModalities.has(profile.modality)) errors.push(`Invalid runtime modality '${profile.modality}'`);

for (const key of ["modalityLabel", "category", "audience", "promise", "targetAgeRange", "ageRangeEvidence"]) {
  if (!profile[key] || String(profile[key]).trim().length < 4) {
    errors.push(`Product profile is missing '${key}'`);
  }
}

if (analysis.source === "ai_product_profile" && !profile.productType) {
  errors.push("AI product profile must include productType");
}

if (analysis.source === "ai_product_profile" && (profile.profileConfidence ?? 0) < 0.35) {
  errors.push(`AI product profile confidence is too low (${profile.profileConfidence})`);
}

const groups = profile.ageGroups || [];
if (groups.length !== 4) {
  errors.push(`Product profile must include exactly 4 age groups, got ${groups.length}`);
}

const values = new Set();
let previousMin = 0;
for (const [index, group] of groups.entries()) {
  if (!group.value) errors.push(`Age group ${index + 1} missing value`);
  if (!group.label) errors.push(`Age group ${index + 1} missing label`);
  if (values.has(group.value)) errors.push(`Duplicate age group value '${group.value}'`);
  values.add(group.value);

  if (!Number.isFinite(Number(group.minAge))) errors.push(`Age group '${group.value}' missing numeric minAge`);
  if (Number(group.minAge) < previousMin) errors.push(`Age group '${group.value}' is out of order`);
  previousMin = Number(group.minAge);

  if (group.maxAge != null && Number(group.maxAge) < Number(group.minAge)) {
    errors.push(`Age group '${group.value}' maxAge is lower than minAge`);
  }

  if (!group.imageSubject || String(group.imageSubject).length < 10) {
    errors.push(`Age group '${group.value}' needs imageSubject guidance`);
  }

  if (!group.differentiationRequirement || String(group.differentiationRequirement).length < 10) {
    errors.push(`Age group '${group.value}' needs differentiationRequirement`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Product profile validation passed: ${analysis.source} (${profile.profileModel || "generate-product-run"})`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
