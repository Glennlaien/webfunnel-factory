import fs from "node:fs";
import path from "node:path";
import { currentOutputsTarget, ensureOutputsLink, resolveOutputDir } from "./output-dir.mjs";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));
const outputsDir = ensureOutputsLink(resolveOutputDir({ outputDir: args["output-dir"] })) || currentOutputsTarget() || path.join(root, "outputs");
const outputDirs = ["strategy", "capabilities", "contracts", "skeleton", "rules", "page-map", "copy", "design", "assets", "config", "design-handoff", "figma", "stitch", "app", "qa", "exports"];

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

console.log(`Cleaned all outputs/* run artifacts in ${outputsDir}. Framework files were kept.`);

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}
