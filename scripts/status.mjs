import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const routing = JSON.parse(fs.readFileSync(path.join(root, "configs/agent-routing.json"), "utf8"));

console.log("Web2App Subagent Factory Status\n");

const runtimeFiles = [
  "global-rules/company-funnel-rules.json",
  "global-rules/design-rules.json",
  "global-rules/ob-conversion-rules.json",
  "global-rules/image-asset-rules.json",
  "global-rules/compliance-rules.json",
  "contracts/ui-style-recipe.contract.json",
  "docs/ui-style-recipe.md",
  "docs/runtime-page-capabilities.md",
  "style-recipes/README.md",
  "style-recipes/hard-training.json",
  "style-recipes/calm-wellness.json",
  "style-recipes/energetic-fitness.json",
  "style-recipes/clinical-trust.json",
  "style-recipes/lifestyle-companion.json",
  "runtime/react-funnel-runtime/runtime.config.json",
  "runtime/react-funnel-runtime/renderer-registry.json",
  "runtime/react-funnel-runtime/contracts/funnel-config.contract.json",
  "runtime/react-funnel-runtime/contracts/theme.contract.json",
  "runtime/react-funnel-runtime/contracts/design-template-map.contract.json",
  "runtime/react-funnel-runtime/contracts/asset-manifest.contract.json",
  "runtime/react-funnel-runtime/adapters/unit-conversion.spec.json",
  "runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json"
];

console.log("react-runtime");
for (const filePath of runtimeFiles) {
  const exists = fs.existsSync(path.join(root, filePath));
  console.log(`  - ${exists ? "ok" : "missing"} ${filePath}`);
}
console.log("");

for (const agentId of routing.sequence) {
  const agent = routing.agents[agentId];
  const outputs = agent.outputs.map((filePath) => {
    const exists = fs.existsSync(path.join(root, filePath));
    return `${exists ? "ok" : "missing"} ${filePath}`;
  });

  console.log(`${agentId}`);
  for (const line of outputs) {
    console.log(`  - ${line}`);
  }
}
