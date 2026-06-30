import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputsDir = path.join(root, "outputs");
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

console.log("Cleaned all outputs/* run artifacts. Framework files were kept.");
