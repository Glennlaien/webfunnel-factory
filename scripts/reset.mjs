import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputsDir = path.join(root, "outputs");
const outputDirs = ["strategy", "capabilities", "contracts", "skeleton", "rules", "page-map", "copy", "design", "assets", "config", "design-handoff", "figma", "app", "qa", "exports"];

function removeDir(target) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      fs.rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
      return;
    } catch (error) {
      if (error?.code !== "ENOTEMPTY" || attempt === 2) throw error;
    }
  }
}

for (const dir of outputDirs) {
  const target = path.join(outputsDir, dir);
  removeDir(target);
  fs.mkdirSync(target, { recursive: true });
}

const referencesDir = path.join(root, "inputs/references");
removeDir(referencesDir);
fs.mkdirSync(referencesDir, { recursive: true });

fs.writeFileSync(
  path.join(root, "inputs/product-brief.md"),
  `# Product Brief Input

Paste the raw product input here.

Acceptable sources:

- Product prompt
- App Store URL
- Competitor URLs
- Existing website copy
- User research notes
- Screenshots or notes saved under \`inputs/references/\`

## Raw Product Input

`
);

fs.writeFileSync(
  path.join(root, "inputs/funnel-requirements.md"),
  `# Funnel Requirements

The funnel should use fixed page types from \`configs/page-types.json\`.

Preferred funnel depth: auto

Depth behavior:

- \`auto\`: workflow selects the depth from product category, audience, commitment level, and personalization complexity.
- \`standard\`: roughly 22-28 counted OB question/input pages, usually 38-48 total funnel pages.
- \`deep\`: roughly 28-36 counted OB question/input pages, usually 48-65 total funnel pages.
- \`expert\`: 36+ counted OB question/input pages, usually 65+ total funnel pages.

Page count is not a target. For personalization-heavy Web2App funnels, 30-40 onboarding steps can be appropriate, but every step must support at least one of:

- Personalization
- User segmentation
- Objection handling
- Summary or analysis output
- Paywall readiness
- Analytics learning

Do not hard-fill pages.

## Rule Sources

- Company flow rules: \`global-rules/company-funnel-rules.json\`
- Design rules: \`global-rules/design-rules.json\`
- OB conversion rules: \`global-rules/ob-conversion-rules.json\`
- Paywall conversion rules: \`global-rules/paywall-rules.json\`
- Image asset rules: \`global-rules/image-asset-rules.json\`
- Image plan contract: \`contracts/image-plan.contract.json\`
- Compliance rules: \`global-rules/compliance-rules.json\`
- Product-run contracts: \`contracts/*.json\`
- Implementation recipes: \`recipes/*.md\`
- Navigation behavior: \`runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json\`
- Unit conversion behavior: \`runtime/react-funnel-runtime/adapters/unit-conversion.spec.json\`
- Backend integration behavior: \`runtime/react-funnel-runtime/adapters/backend-integration.spec.json\`
- Backend API contract: \`contracts/backend-api.contract.json\`
- Backend API reference: \`inputs/api-reference.md\`

## Product-Specific Overrides

Only write requirements here when this product should override the canonical rule files.

Examples:

- Use a shorter OB because this campaign is traffic from a warm email list.
- Replace the default age group options with product-specific ranges.
- Add a special page required by a legal or market requirement.

Default company, design, paywall, image, navigation, measurement, and backend rules should stay in their canonical files. See \`docs/rule-ownership.md\`.
`
);

console.log("Reset project inputs and outputs. Framework files were kept.");
