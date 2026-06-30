import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readJson = (filePath) => JSON.parse(fs.readFileSync(path.join(root, filePath), "utf8"));
const exists = (filePath) => fs.existsSync(path.join(root, filePath));

const errors = [];
const warnings = [];
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);

const runtimeConfigPath = "runtime/react-funnel-runtime/runtime.config.json";
const registryPath = "runtime/react-funnel-runtime/renderer-registry.json";
const navigationSpecPath = "runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json";
const designRulesPath = "global-rules/design-rules.json";
const obRulesPath = "global-rules/ob-conversion-rules.json";
const imageRulesPath = "global-rules/image-asset-rules.json";
const complianceRulesPath = "global-rules/compliance-rules.json";
const funnelConfigPath = "outputs/config/funnel.config.json";
const designTemplateMapPath = "outputs/design-handoff/page-type-template-map.json";

for (const filePath of [
  "global-rules/company-funnel-rules.json",
  designRulesPath,
  obRulesPath,
  imageRulesPath,
  complianceRulesPath,
  "contracts/ui-style-recipe.contract.json",
  "docs/ui-style-recipe.md",
  "docs/runtime-page-capabilities.md",
  "style-recipes/README.md",
  "style-recipes/hard-training.json",
  "style-recipes/calm-wellness.json",
  "style-recipes/energetic-fitness.json",
  "style-recipes/clinical-trust.json",
  "style-recipes/lifestyle-companion.json",
  runtimeConfigPath,
  registryPath,
  "runtime/react-funnel-runtime/contracts/funnel-config.contract.json",
  "runtime/react-funnel-runtime/contracts/theme.contract.json",
  "runtime/react-funnel-runtime/contracts/design-template-map.contract.json",
  "runtime/react-funnel-runtime/contracts/asset-manifest.contract.json",
  "runtime/react-funnel-runtime/adapters/unit-conversion.spec.json",
  navigationSpecPath
]) {
  if (!exists(filePath)) fail(`Missing runtime file: ${filePath}`);
}

if (exists(runtimeConfigPath)) {
  const runtimeConfig = readJson(runtimeConfigPath);
  if (runtimeConfig.navigationBehavior) {
    fail("runtime.config.json must reference navigationBehaviorSource instead of redefining navigationBehavior");
  }
  if (runtimeConfig.navigationBehaviorSource !== navigationSpecPath) {
    fail(`runtime.config.json navigationBehaviorSource must be '${navigationSpecPath}'`);
  }
  if (runtimeConfig.designRulesSource !== designRulesPath) {
    fail(`runtime.config.json designRulesSource must be '${designRulesPath}'`);
  }
}

if (exists(registryPath)) {
  const registry = readJson(registryPath);
  const rendererKeys = new Set(registry.renderers.map((renderer) => renderer.key));
  if (!rendererKeys.has("intro_page")) {
    fail("renderer-registry.json must include an intro_page renderer");
  }
}

if (exists(registryPath) && exists(funnelConfigPath)) {
  const registry = readJson(registryPath);
  const config = readJson(funnelConfigPath);
  const rendererKeys = new Set(registry.renderers.map((renderer) => renderer.key));
  const fallbackKeys = new Set(registry.renderers.map((renderer) => renderer.key.split(":")[0]));

  for (const page of config.pages ?? []) {
    const key = page.variant ? `${page.pageType}:${page.variant}` : page.pageType;
    if (!rendererKeys.has(key) && !fallbackKeys.has(page.pageType)) {
      fail(`No runtime renderer for page '${page.id}' using ${key}`);
    }
  }
}

if (exists(registryPath) && exists(navigationSpecPath)) {
  const registry = readJson(registryPath);
  const navigationSpec = readJson(navigationSpecPath);
  const defaultBehaviors = navigationSpec.defaultBehaviors ?? {};

  for (const renderer of registry.renderers) {
    if (renderer.navigation) {
      fail(`Renderer '${renderer.key}' must not redefine navigation behavior; use ${navigationSpecPath}`);
    }

    const pageType = renderer.key.split(":")[0];
    if (!defaultBehaviors[pageType]) {
      warn(`Renderer '${renderer.key}' has no canonical navigation behavior for pageType '${pageType}'`);
    }
  }
}

if (exists(navigationSpecPath) && exists(funnelConfigPath)) {
  const navigationSpec = readJson(navigationSpecPath);
  const config = readJson(funnelConfigPath);
  const allowedOverrides = new Set(navigationSpec.allowedOverrides ?? []);
  const defaultBehaviors = navigationSpec.defaultBehaviors ?? {};
  const overrideField = navigationSpec.overrideField ?? "navigationBehavior";

  for (const page of config.pages ?? []) {
    if (!defaultBehaviors[page.pageType] && !page[overrideField]) {
      warn(`Page '${page.id}' has no default navigation behavior for pageType '${page.pageType}'`);
    }
    if (page[overrideField] && !allowedOverrides.has(page[overrideField])) {
      fail(`Page '${page.id}' uses unsupported ${overrideField}: ${page[overrideField]}`);
    }
  }
}

if (exists(registryPath) && exists(designTemplateMapPath)) {
  const registry = readJson(registryPath);
  const templateMap = readJson(designTemplateMapPath);
  const templateKeys = new Set(templateMap.templates.map((template) => template.key));

  for (const renderer of registry.renderers.filter((item) => item.figmaTemplateRequired)) {
    if (!templateKeys.has(renderer.key)) {
      warn(`Renderer '${renderer.key}' expects a design template but none is mapped`);
    }
  }
}

if (warnings.length) {
  console.log("Warnings:");
  for (const message of warnings) console.log(`- ${message}`);
}

if (errors.length) {
  console.error("Runtime validation failed:");
  for (const message of errors) console.error(`- ${message}`);
  process.exit(1);
}

console.log("Runtime validation passed");
