import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const mode = process.argv[2] || "screens";

const promptsPath = path.join(root, "outputs/design/stitch-prompts.json");
const screensDir = path.join(root, "outputs/stitch/screens");
const handoffPath = path.join(root, "outputs/design-handoff/stitch-handoff.json");

if (mode === "screens") {
  requireScreens();
} else if (mode === "handoff") {
  requireHandoff();
} else {
  console.error("Usage: node scripts/require-stitch-stage.mjs <screens|handoff>");
  process.exit(1);
}

function requireScreens() {
  if (!fs.existsSync(promptsPath)) {
    fail([
      "Stitch prompts are missing.",
      "Expected: outputs/design/stitch-prompts.json",
      "Run product generation before the Stitch design stage."
    ]);
  }

  const prompts = readJson(promptsPath);
  const requiredKeys = (Array.isArray(prompts.screens) ? prompts.screens : [])
    .map((screen) => screen.key)
    .filter(Boolean);

  if (requiredKeys.length < 8) {
    fail([
      "Stitch prompt plan is too small for production.",
      `Expected at least 8 key screen prompts, found ${requiredKeys.length}.`
    ]);
  }

  const htmlFiles = listHtmlFiles();
  const missingKeys = requiredKeys.filter((key) => !htmlFiles.some((file) => file.key === key));
  const invalidFiles = htmlFiles.filter((file) => file.bytes < 1000 || !looksLikeHtml(file.content));

  if (missingKeys.length || invalidFiles.length) {
    fail([
      "Stitch design stage is required and has not produced a complete HTML handoff.",
      `Required screen keys: ${requiredKeys.join(", ")}`,
      `Found HTML screens: ${htmlFiles.map((file) => file.key).join(", ") || "(none)"}`,
      missingKeys.length ? `Missing screen keys: ${missingKeys.join(", ")}` : "",
      invalidFiles.length ? `Invalid/too-small files: ${invalidFiles.map((file) => file.name).join(", ")}` : "",
      "",
      "Required next step:",
      "1. Use Stitch MCP to generate each prompt in outputs/design/stitch-prompts.json.",
      "2. Save each resulting screen HTML into outputs/stitch/screens as <index>-<key>.html.",
      "3. Run: npm run stitch:handoff",
      "4. Resume production with: npm run workflow:production:resume -- --image-api-key <key>"
    ]);
  }

  console.log(`Stitch screen requirement passed: ${htmlFiles.length}/${requiredKeys.length} HTML screens found.`);
}

function requireHandoff() {
  if (!fs.existsSync(handoffPath)) {
    fail([
      "Stitch handoff is missing.",
      "Expected: outputs/design-handoff/stitch-handoff.json",
      "Run: npm run stitch:handoff"
    ]);
  }

  const handoff = readJson(handoffPath);
  const screens = Array.isArray(handoff.screens) ? handoff.screens : [];
  if (handoff.source !== "stitch" || screens.length < 8) {
    fail([
      "Stitch handoff is incomplete.",
      `source=${handoff.source || "(missing)"}, screens=${screens.length}`,
      "Run Stitch screen generation again, then run: npm run stitch:handoff"
    ]);
  }

  const missingFiles = screens
    .map((screen) => screen.file)
    .filter(Boolean)
    .filter((file) => !fs.existsSync(path.join(root, file)));
  if (missingFiles.length) {
    fail([
      "Stitch handoff references missing HTML files.",
      `Missing: ${missingFiles.join(", ")}`
    ]);
  }

  console.log(`Stitch handoff requirement passed: ${screens.length} mapped screen(s).`);
}

function listHtmlFiles() {
  if (!fs.existsSync(screensDir)) return [];
  return fs
    .readdirSync(screensDir)
    .filter((name) => name.endsWith(".html"))
    .sort()
    .map((name) => {
      const filePath = path.join(screensDir, name);
      const content = fs.readFileSync(filePath, "utf8");
      return {
        name,
        key: keyFromFileName(name),
        path: filePath,
        bytes: Buffer.byteLength(content),
        content
      };
    });
}

function keyFromFileName(name) {
  return name
    .replace(/^\d+[-_]/, "")
    .replace(/\.html$/i, "")
    .trim();
}

function looksLikeHtml(content) {
  return /<html[\s>]/i.test(content) || /<body[\s>]/i.test(content) || /<!doctype html>/i.test(content);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fail(lines) {
  console.error(lines.filter(Boolean).join("\n"));
  process.exit(1);
}
