import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const stitchDir = path.join(root, "outputs/stitch");
const screensDir = path.join(stitchDir, "screens");
const handoffDir = path.join(root, "outputs/design-handoff");

function readJsonIfExists(relativePath, fallback) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(relativePath, value) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(relativePath, value) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

function htmlFiles() {
  if (!fs.existsSync(screensDir)) return [];
  return fs
    .readdirSync(screensDir)
    .filter((file) => file.endsWith(".html"))
    .sort()
    .map((file) => path.join(screensDir, file));
}

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

function extractHexColors(html) {
  const colors = [...html.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((match) => match[0].toUpperCase());
  const counts = new Map();
  for (const color of colors) {
    const normalized = color.length === 4
      ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
      : color.slice(0, 7);
    counts.set(normalized, (counts.get(normalized) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([color, count]) => ({ color, count }));
}

function relativeLuminance(hex) {
  const parsed = String(hex || "").trim().match(/^#?([0-9a-f]{6})$/i);
  if (!parsed) return 1;
  const [r, g, b] = parsed[1].match(/.{2}/g).map((value) => parseInt(value, 16) / 255);
  const [lr, lg, lb] = [r, g, b].map((value) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function isNeutral(hex) {
  const parsed = String(hex || "").trim().match(/^#?([0-9a-f]{6})$/i);
  if (!parsed) return true;
  const [r, g, b] = parsed[1].match(/.{2}/g).map((value) => parseInt(value, 16));
  return Math.max(r, g, b) - Math.min(r, g, b) < 18;
}

function pickPrimaryColor(colors, fallback) {
  const fallbackUpper = String(fallback || "").toUpperCase();
  if (colors.some((item) => item.color === fallbackUpper)) return fallbackUpper;
  const vividPulse = colors.find((item) => item.color === "#F20562" || item.color === "#B80048" || item.color === "#E6005C");
  if (vividPulse) return vividPulse.color === "#B80048" || vividPulse.color === "#E6005C" ? "#F20562" : vividPulse.color;
  const candidate = colors.find((item) => !isNeutral(item.color) && relativeLuminance(item.color) > 0.08 && relativeLuminance(item.color) < 0.72);
  return candidate?.color || fallback;
}

function extractRadius(html) {
  const radii = [...html.matchAll(/border-radius\s*:\s*([0-9.]+)px/gi)].map((match) => Number(match[1])).filter(Number.isFinite);
  if (!radii.length) return null;
  radii.sort((a, b) => a - b);
  return radii[Math.floor(radii.length * 0.66)];
}

function extractFontHint(html) {
  const fontFamily = html.match(/font-family\s*:\s*([^;"}]+)/i)?.[1]?.trim();
  const weightMatches = [...html.matchAll(/font-weight\s*:\s*([0-9]+)/gi)].map((match) => Number(match[1]));
  const headingWeight = weightMatches.length ? Math.max(...weightMatches.filter(Number.isFinite)) : undefined;
  return { fontFamily, headingWeight };
}

function analyzeScreen(filePath, fallbackPrimary) {
  const html = fs.readFileSync(filePath, "utf8");
  const colors = extractHexColors(html);
  const radius = extractRadius(html);
  const font = extractFontHint(html);
  const hasLargeHero = countMatches(html, /<img\b|background-image|object-fit/gi) >= 1;
  const hasSticky = /position\s*:\s*sticky|position\s*:\s*fixed/i.test(html);
  const hasPill = /border-radius\s*:\s*(999|[3-9][0-9])px/i.test(html);
  const cardCount = countMatches(html, /box-shadow|border\s*:\s*1px|card|rounded/gi);
  const htmlPrimary = /#F20562/i.test(html) ? "#F20562" : pickPrimaryColor(colors, fallbackPrimary);
  return {
    file: path.relative(root, filePath),
    pageKey: path.basename(filePath, ".html").replace(/^\d+-/, ""),
    htmlBytes: Buffer.byteLength(html, "utf8"),
    colorInventory: colors.slice(0, 10),
    primaryCandidate: htmlPrimary,
    radius,
    font,
    visualTraits: {
      hasLargeHero,
      hasSticky,
      hasPill,
      cardDensity: cardCount > 18 ? "high" : cardCount > 8 ? "medium" : "low"
    }
  };
}

function deriveStyle(screens, theme) {
  const fallbackPrimary = theme.colorTokens?.primary || "#D93278";
  const allColors = screens.flatMap((screen) => screen.colorInventory);
  const primary = screens.some((screen) => screen.primaryCandidate === fallbackPrimary.toUpperCase() || screen.primaryCandidate === fallbackPrimary)
    ? fallbackPrimary
    : pickPrimaryColor(allColors, fallbackPrimary);
  const radiusValues = screens.map((screen) => screen.radius).filter(Number.isFinite);
  const radius = radiusValues.length ? Math.round(radiusValues.reduce((sum, item) => sum + item, 0) / radiusValues.length) : theme.shape?.cardRadius || 20;
  const fontFamilies = screens.map((screen) => screen.font.fontFamily).filter(Boolean);
  const headingWeights = screens.map((screen) => screen.font.headingWeight).filter(Number.isFinite);
  const hasPill = screens.some((screen) => screen.visualTraits.hasPill);
  const hasLargeHero = screens.some((screen) => screen.visualTraits.hasLargeHero);
  const averageCardDensity = screens.filter((screen) => screen.visualTraits.cardDensity !== "low").length >= Math.ceil(screens.length / 2) ? "structured" : "open";

  return {
    primary,
    background: theme.colorSystem?.background || theme.colorTokens?.background || "#F7F6F9",
    surface: theme.colorTokens?.surface || "#FFFFFF",
    text: theme.colorTokens?.text || "#25282D",
    radius,
    buttonShape: hasPill ? "pill" : "rounded",
    imageTreatment: hasLargeHero ? "large_editorial" : "contained",
    density: averageCardDensity,
    fontFamily: fontFamilies[0] || theme.typography?.fontFamily,
    headingWeight: headingWeights.length ? Math.max(...headingWeights) : theme.typography?.headingWeight
  };
}

const files = htmlFiles();
if (files.length < 4) {
  throw new Error(`Stitch handoff requires at least 4 HTML screen files in ${path.relative(root, screensDir)}. Found ${files.length}.`);
}

const theme = readJsonIfExists("outputs/design/theme.json", {});
const screens = files.map((file) => analyzeScreen(file, theme.colorTokens?.primary || "#D93278"));
const style = deriveStyle(screens, theme);
const templates = screens.map((screen) => ({
  pageType:
    screen.pageKey.includes("paywall") ? "paywall_page" :
    screen.pageKey.includes("entry") ? "entry_page" :
    screen.pageKey.includes("multi") ? "multi_choice_page" :
    screen.pageKey.includes("age") ? "single_choice_page" :
    screen.pageKey.includes("summary") ? "summary_page" :
    screen.pageKey.includes("ready") ? "plan_ready_page" :
    screen.pageKey.includes("generation") ? "plan_generation_page" :
    "single_choice_page",
  nodeId: `stitch:${screen.pageKey}`,
  htmlFile: screen.file
}));

writeJson("outputs/design-handoff/stitch-handoff.json", {
  version: "0.1.0",
  source: "stitch",
  status: "html_captured",
  htmlSourceDir: "outputs/stitch/screens",
  globalBriefFile: "outputs/design/stitch-global-brief.md",
  promptsFile: "outputs/design/stitch-prompts.json",
  style,
  screens
});

writeJson("outputs/design-handoff/design-handoff.json", {
  version: "0.5.0",
  source: "stitch",
  status: "implemented_from_design",
  note: "Stitch generated key screen HTML. React Runtime consumes extracted visual traits while preserving app-template business logic.",
  themeFile: "outputs/design/theme.json",
  pageMapFile: "outputs/page-map/page-map.json",
  assetManifestFile: "outputs/assets/asset-manifest.json",
  stitchHandoffFile: "outputs/design-handoff/stitch-handoff.json",
  stitchGlobalBriefFile: "outputs/design/stitch-global-brief.md",
  stitchPromptsFile: "outputs/design/stitch-prompts.json",
  templates
});

writeJson("outputs/design-handoff/page-type-template-map.json", {
  version: "0.5.0",
  source: "stitch",
  templates: templates.map((template) => ({
    ...template,
    component:
      template.pageType === "paywall_page" ? "PaywallPage" :
      template.pageType === "entry_page" ? "EntryPage" :
      template.pageType === "summary_page" ? "SummaryPage" :
      template.pageType === "plan_ready_page" ? "PlanReadyPage" :
      template.pageType === "plan_generation_page" ? "PlanGenerationPage" :
      "ChoicePage"
  }))
});

writeText(
  "outputs/design-handoff/implementation-notes.md",
  `# Stitch Runtime Handoff\n\nStitch HTML was captured from ${files.length} key screens and converted into runtime-safe visual traits.\n\n- Global brief: outputs/design/stitch-global-brief.md\n- Page prompts: outputs/design/stitch-prompts.json\n- Primary: ${style.primary}\n- Radius: ${style.radius}px\n- Button shape: ${style.buttonShape}\n- Image treatment: ${style.imageTreatment}\n- Density: ${style.density}\n\nRuntime must preserve page behavior, data persistence, API calls, Stripe checkout, Firebase identity, and Mixpanel tracking.\n`
);

console.log(`Created Stitch handoff from ${files.length} HTML screens.`);
