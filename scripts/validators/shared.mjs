import fs from "node:fs";
import path from "node:path";

export function createValidationContext(root = process.cwd()) {
  const errors = [];
  const warnings = [];

  return {
    fs,
    path,
    root,
    errors,
    warnings,
    fail(message) {
      errors.push(message);
    },
    warn(message) {
      warnings.push(message);
    },
    exists(filePath) {
      return fs.existsSync(path.join(root, filePath));
    },
    readJson(filePath) {
      return JSON.parse(fs.readFileSync(path.join(root, filePath), "utf8"));
    },
    readText(filePath) {
      return fs.readFileSync(path.join(root, filePath), "utf8");
    },
    readTextTree(dirPath, extensions = [".ts", ".tsx", ".js", ".jsx", ".css"]) {
      const absoluteRoot = path.join(root, dirPath);
      const chunks = [];
      const walk = (current) => {
        if (!fs.existsSync(current)) return;
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
          const fullPath = path.join(current, entry.name);
          if (entry.isDirectory()) {
            if (entry.name === "node_modules" || entry.name === "dist") continue;
            walk(fullPath);
          } else if (extensions.includes(path.extname(entry.name))) {
            chunks.push(fs.readFileSync(fullPath, "utf8"));
          }
        }
      };
      walk(absoluteRoot);
      return chunks.join("\n");
    }
  };
}
