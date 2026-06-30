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

function stripTags(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function visibleText(html) {
  return stripTags(html).toLowerCase();
}

function extractHeadings(html) {
  return [...html.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)]
    .map((match) => stripTags(match[1]))
    .filter(Boolean)
    .slice(0, 8);
}

function extractButtonTexts(html) {
  return [...html.matchAll(/<button[\s\S]*?<\/button>/gi)]
    .map((match) => stripTags(match[0]))
    .filter(Boolean)
    .slice(0, 12);
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

function extractRadii(html) {
  const radii = [...html.matchAll(/border-radius\s*:\s*([0-9.]+)px/gi)].map((match) => Number(match[1])).filter(Number.isFinite);
  const classRadii = [...html.matchAll(/rounded-\[([0-9.]+)px\]/gi)].map((match) => Number(match[1])).filter(Number.isFinite);
  const all = [...radii, ...classRadii].sort((a, b) => a - b);
  const cardCandidates = all.filter((value) => value >= 4 && value <= 36);
  const pillCandidates = all.filter((value) => value > 36);
  const cardRadius = cardCandidates.length ? cardCandidates[Math.floor(cardCandidates.length * 0.66)] : null;
  return {
    raw: all,
    cardRadius,
    hasPill: pillCandidates.length > 0 || /rounded-full|border-radius\s*:\s*999/i.test(html)
  };
}

function extractFontHint(html) {
  const fontFamily = html.match(/font-family\s*:\s*([^;"}]+)/i)?.[1]?.trim();
  const weightMatches = [...html.matchAll(/font-weight\s*:\s*([0-9]+)/gi)].map((match) => Number(match[1]));
  const headingWeight = weightMatches.length ? Math.max(...weightMatches.filter(Number.isFinite)) : undefined;
  return { fontFamily, headingWeight };
}

function inferPageType(pageKey) {
  if (pageKey.includes("paywall")) return "paywall_page";
  if (pageKey.includes("entry")) return "entry_page";
  if (pageKey.includes("multi")) return "multi_choice_page";
  if (pageKey.includes("age_group") || pageKey.includes("age")) return "single_choice_page";
  if (pageKey.includes("metric")) return "metric_input_page";
  if (pageKey.includes("summary")) return "summary_page";
  if (pageKey.includes("ready")) return "plan_ready_page";
  if (pageKey.includes("generation")) return "plan_generation_page";
  if (pageKey.includes("auth") || pageKey.includes("profile")) return "account_page";
  if (pageKey.includes("intro")) return "intro_page";
  return "single_choice_page";
}

function sectionOrderFromText(text, rawText, pageType) {
  const checks = [
    ["sticky_timer", /discount reserved|countdown|09:/],
    ["top_nav", /arrow_back|login|menu|topappbar/.test(rawText) ? /./ : /a^/],
    ["segmented_progress", /progress-segment|segmented-bar|segment active|progress bar/.test(rawText) ? /./ : /a^/],
    ["hero_media", /hero|<img|background-image|object-cover|data-alt/.test(rawText) ? /./ : /a^/],
    ["headline", /personalized|unlock|select|choose|summary|creating|ready/],
    ["body_comparison", /before|after|body fat|goal/],
    ["bmi_gauge", /body mass index|bmi|underweight|normal|overweight|obese/],
    ["facts_list", /fitness level|main focus|goal change|activity level/],
    ["unit_input", /\b(lbs|kg|cm|ft)\b|unit toggle/],
    ["progress_ring", /creating|analyzing|progress ring/],
    ["line_chart", /expected result|target weight|\bkg by\b/],
    ["offer_list", /week plan|trial|price|subscription|get my plan/],
    ["legal", /terms|privacy|renew|cancel|guarantee/],
    ["app_screenshots", /companion app|screenshots|app preview/],
    ["testimonials", /feedback|testimonial|positive feedback|people have|users have|stars/],
    ["cta", /continue|get started|get my plan|save my plan|log in/]
  ];
  let order = checks.filter(([, pattern]) => pattern.test(text)).map(([key]) => key);
  if (pageType !== "metric_input_page") order = order.filter((key) => key !== "unit_input");
  if (pageType !== "plan_generation_page") order = order.filter((key) => key !== "progress_ring");
  if (pageType !== "plan_ready_page") order = order.filter((key) => key !== "line_chart");
  if (pageType !== "paywall_page") order = order.filter((key) => key !== "app_screenshots");
  if (!["paywall_page", "plan_generation_page"].includes(pageType)) order = order.filter((key) => key !== "testimonials");
  if (!order.length && pageType.includes("choice")) return ["top_nav", "headline", "choice_options", "cta"];
  return [...new Set(order)];
}

function structureForScreen({ html, pageKey, pageType }) {
  const text = visibleText(html);
  const rawText = html.toLowerCase();
  const imgCount = countMatches(html, /<img\b/gi);
  const buttonTexts = extractButtonTexts(html);
  const headings = extractHeadings(html);
  const optionButtonCount = buttonTexts.filter((item) => !/login|continue|get my plan|save|close/i.test(item)).length;
  const hasImageGrid = /grid-cols-2|repeat\(2|minmax\(0,\s*1fr\)|age:|image grid/i.test(html) && (imgCount >= 2 || optionButtonCount >= 4);
  const hasSegmentedProgress = /progress-segment|segmented-bar|segment active|progress bar|rounded-full overflow-hidden/i.test(rawText);
  const hasSticky = /position\s*:\s*sticky|position\s*:\s*fixed|sticky top-0|fixed top-0/i.test(html);
  const hasBottomCta = /pb-32|sticky-button|fixed bottom|bottom-0|continue|get my plan/i.test(rawText);
  const hasUnitToggle = /\blbs\b|\bkg\b|\bcm\b|\bft\b|unit toggle|segmented/i.test(text);
  const hasLargeNumber = /text-\[[4-9][0-9]px\]|display|font-display|\b\d{2,3}\b/.test(rawText);
  const sections = sectionOrderFromText(text, rawText, pageType);
  return {
    pageType,
    headings,
    primaryHeading: headings.find((heading) => !/^forte$/i.test(heading)) || headings[0] || "",
    buttonTexts,
    optionButtonCount,
    media: {
      imageCount: imgCount,
      hasLargeHero: imgCount >= 1 || /background-image|object-cover|hero/i.test(rawText),
      hasImageGrid
    },
    navigation: {
      hasTopNav: /arrow_back|topappbar|login|menu/i.test(rawText),
      hasSegmentedProgress,
      hasSticky,
      hasBottomCta
    },
    inputs: {
      hasUnitToggle,
      hasLargeNumber
    },
    sections
  };
}

function runtimeMappingForScreen(screen) {
  const { pageKey, pageType, structure } = screen;
  const classes = ["stitch-screen", `stitch-screen-${pageKey.replace(/[^a-z0-9_-]/gi, "-")}`];
  const mapping = {
    sourceScreen: pageKey,
    sourceHtmlFile: screen.file,
    pageType,
    pageClass: "",
    sections: structure.sections,
    hints: {}
  };

  if (pageType === "entry_page") {
    classes.push("stitch-entry-editorial");
    mapping.hints = { heroTreatment: "full_bleed", navTreatment: "transparent", ctaPlacement: "hero_bottom" };
  } else if (pageKey.includes("age_group") || (pageType === "single_choice_page" && structure.media.hasImageGrid)) {
    classes.push("stitch-choice-image-grid", "stitch-age-card-grid");
    mapping.variant = "image_grid";
    mapping.hints = { labelPlacement: "overlay_bottom", columns: 2, imageRatio: "portrait_card" };
  } else if (pageType === "single_choice_page") {
    classes.push("stitch-choice-list", structure.media.hasLargeHero ? "stitch-choice-with-media" : "");
    mapping.variant = "plain_list";
    mapping.hints = { optionTreatment: "large_surface_rows", autoAdvance: true };
  } else if (pageType === "multi_choice_page") {
    classes.push("stitch-choice-list", "stitch-multi-check-list");
    mapping.variant = structure.media.hasImageGrid ? "image_grid" : "plain_list";
    mapping.hints = { optionTreatment: "large_surface_rows", selectedIndicator: "checkmark_box", ctaPlacement: "sticky_bottom" };
  } else if (pageType === "intro_page") {
    classes.push("stitch-intro-editorial");
    mapping.hints = { heroRatio: "4:3", ctaPlacement: "sticky_bottom", copyDensity: "medium" };
  } else if (pageType === "metric_input_page") {
    classes.push("stitch-metric-input", "stitch-centered-measurement");
    mapping.hints = { unitToggle: "segmented_pill", valueTreatment: "large_centered", helperCard: true };
  } else if (pageType === "summary_page") {
    classes.push("stitch-summary-bmi-profile");
    mapping.hints = { modules: ["bmi_gauge", "facts_list", "body_visual", "insight_card"] };
  } else if (pageType === "plan_generation_page") {
    classes.push("stitch-generation-proof");
    mapping.hints = { modules: ["progress_ring", "overlay_questions", "testimonial_card"] };
  } else if (pageType === "plan_ready_page") {
    classes.push("stitch-plan-chart");
    mapping.hints = { modules: ["target_date", "animated_chart", "expected_result"] };
  } else if (pageType === "paywall_page") {
    classes.push("stitch-paywall-longform");
    mapping.hints = { modules: ["sticky_timer", "body_comparison", "offer_list", "app_screenshots", "testimonials", "guarantee"] };
  } else if (pageType === "account_page") {
    classes.push("stitch-account-flat");
    mapping.hints = { formTreatment: "flat_inputs", profileTreatment: "simple_rows" };
  }

  mapping.pageClass = classes.filter(Boolean).join(" ");
  return mapping;
}

function analyzeScreen(filePath, fallbackPrimary) {
  const html = fs.readFileSync(filePath, "utf8");
  const colors = extractHexColors(html);
  const radii = extractRadii(html);
  const font = extractFontHint(html);
  const hasLargeHero = countMatches(html, /<img\b|background-image|object-fit/gi) >= 1;
  const hasSticky = /position\s*:\s*sticky|position\s*:\s*fixed/i.test(html);
  const hasPill = radii.hasPill;
  const cardCount = countMatches(html, /box-shadow|border\s*:\s*1px|card|rounded/gi);
  const htmlPrimary = /#F20562/i.test(html) ? "#F20562" : pickPrimaryColor(colors, fallbackPrimary);
  const pageKey = path.basename(filePath, ".html").replace(/^\d+-/, "");
  const pageType = inferPageType(pageKey);
  const structure = structureForScreen({ html, pageKey, pageType });
  const screen = {
    file: path.relative(root, filePath),
    pageKey,
    pageType,
    htmlBytes: Buffer.byteLength(html, "utf8"),
    colorInventory: colors.slice(0, 10),
    primaryCandidate: htmlPrimary,
    radius: radii.cardRadius,
    radii,
    font,
    structure,
    visualTraits: {
      hasLargeHero,
      hasSticky,
      hasPill,
      cardDensity: cardCount > 18 ? "high" : cardCount > 8 ? "medium" : "low"
    }
  };
  return {
    ...screen,
    runtimeMapping: runtimeMappingForScreen(screen)
  };
}

function deriveStyle(screens, theme) {
  const fallbackPrimary = theme.colorTokens?.primary || "#D93278";
  const allColors = screens.flatMap((screen) => screen.colorInventory);
  const primary = fallbackPrimary || pickPrimaryColor(allColors, "#D93278");
  const radiusValues = screens.map((screen) => screen.radius).filter(Number.isFinite);
  const averageRadius = radiusValues.length ? Math.round(radiusValues.reduce((sum, item) => sum + item, 0) / radiusValues.length) : theme.shape?.cardRadius || 20;
  const radius = Math.max(8, Math.min(28, averageRadius));
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
const pageVariants = Object.fromEntries(
  screens.map((screen) => [
    screen.pageKey,
    {
      ...screen.runtimeMapping,
      structure: screen.structure
    }
  ])
);
const templates = screens.map((screen) => ({
  pageType: screen.pageType === "metric_input_page" ? "height_input_page/weight_input_page" : screen.pageType,
  nodeId: `stitch:${screen.pageKey}`,
  htmlFile: screen.file,
  runtimeMapping: screen.runtimeMapping
}));

writeJson("outputs/design-handoff/stitch-handoff.json", {
  version: "0.1.0",
  source: "stitch",
  status: "html_captured",
  htmlSourceDir: "outputs/stitch/screens",
  globalBriefFile: "outputs/design/stitch-global-brief.md",
  promptsFile: "outputs/design/stitch-prompts.json",
  style,
  pageVariants,
  screens
});

writeJson("outputs/design-handoff/design-handoff.json", {
  version: "0.5.0",
  source: "stitch",
  status: "implemented_from_design",
  note: "Stitch generated key screen HTML. React Runtime consumes extracted page-level structure and visual traits while preserving app-template business logic.",
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
  `# Stitch Runtime Handoff\n\nStitch HTML was captured from ${files.length} key screens and converted into runtime-safe page mappings.\n\n- Global brief: outputs/design/stitch-global-brief.md\n- Page prompts: outputs/design/stitch-prompts.json\n- Primary: ${style.primary}\n- Card radius: ${style.radius}px\n- Button shape: ${style.buttonShape}\n- Image treatment: ${style.imageTreatment}\n- Density: ${style.density}\n\n## Page mappings\n\n${screens.map((screen) => `- ${screen.pageKey}: ${screen.runtimeMapping.pageClass} (${screen.structure.sections.join(", ") || "no sections detected"})`).join("\n")}\n\nRuntime must preserve page behavior, data persistence, API calls, Stripe checkout, Firebase identity, and Mixpanel tracking.\n`
);

console.log(`Created Stitch handoff from ${files.length} HTML screens.`);
