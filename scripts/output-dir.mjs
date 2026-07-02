import fs from "node:fs";
import path from "node:path";

export const root = process.cwd();
export const outputsLinkPath = path.join(root, "outputs");
export const defaultRunsRoot = path.join(path.dirname(root), "web2app-runs");

export function resolveOutputDir({ outputDir, productName, appUrl } = {}) {
  const explicit = outputDir || process.env.WEB2APP_OUTPUT_DIR;
  if (explicit) return path.resolve(expandHome(explicit));

  const runSlug = process.env.WEB2APP_RUN_SLUG || slugify(productName || appNameFromUrl(appUrl) || "web2app-run");
  return path.join(defaultRunsRoot, runSlug);
}

export function ensureOutputsLink(outputDir) {
  const target = path.resolve(outputDir);
  fs.mkdirSync(target, { recursive: true });

  if (fs.existsSync(outputsLinkPath)) {
    const stat = fs.lstatSync(outputsLinkPath);
    if (stat.isSymbolicLink()) {
      const currentTarget = path.resolve(path.dirname(outputsLinkPath), fs.readlinkSync(outputsLinkPath));
      if (currentTarget === target) return target;
      fs.rmSync(outputsLinkPath, { force: true });
    } else {
      const backup = path.join(root, `.outputs-local-backup-${timestamp()}`);
      fs.renameSync(outputsLinkPath, backup);
      console.warn(`Moved existing local outputs directory to ${path.basename(backup)} before creating external output link.`);
    }
  }

  fs.symlinkSync(target, outputsLinkPath, "dir");
  return target;
}

export function currentOutputsTarget() {
  if (!fs.existsSync(outputsLinkPath)) return null;
  const stat = fs.lstatSync(outputsLinkPath);
  if (!stat.isSymbolicLink()) return outputsLinkPath;
  return path.resolve(path.dirname(outputsLinkPath), fs.readlinkSync(outputsLinkPath));
}

function expandHome(value) {
  if (!value.startsWith("~/")) return value;
  return path.join(process.env.HOME || "", value.slice(2));
}

function appNameFromUrl(value) {
  const text = String(value || "");
  const match = text.match(/\/app\/([^/]+)/);
  return match?.[1]?.replace(/-/g, " ");
}

function slugify(value) {
  return String(value || "web2app-run")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "web2app-run";
}

function timestamp() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}
