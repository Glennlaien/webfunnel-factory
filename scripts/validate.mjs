import { validateApp } from "./validators/app.mjs";
import { validateAssets } from "./validators/assets.mjs";
import { validateCapabilities } from "./validators/capabilities.mjs";
import { validateConfig } from "./validators/config.mjs";
import { validateCopy } from "./validators/copy.mjs";
import { validateDesign } from "./validators/design.mjs";
import { validateDesignHandoff } from "./validators/design-handoff.mjs";
import { validateFigma } from "./validators/figma.mjs";
import { validateImagePlan } from "./validators/image-plan.mjs";
import { validateInputs } from "./validators/inputs.mjs";
import { validatePageMap } from "./validators/page-map.mjs";
import { createValidationContext } from "./validators/shared.mjs";

const ctx = createValidationContext();

for (const validate of [
  validateInputs,
  validatePageMap,
  validateCapabilities,
  validateImagePlan,
  validateAssets,
  validateDesign,
  validateConfig,
  validateDesignHandoff,
  validateApp,
  validateFigma,
  validateCopy
]) {
  validate(ctx);
}

if (ctx.warnings.length) {
  console.log("Warnings:");
  for (const message of ctx.warnings) console.log(`- ${message}`);
}

if (ctx.errors.length) {
  console.error("Validation failed:");
  for (const message of ctx.errors) console.error(`- ${message}`);
  process.exit(1);
}

console.log("Validation passed");
