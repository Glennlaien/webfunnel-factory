import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const imagePlanPath = "outputs/assets/image-plan.json";
const manifestPath = "outputs/assets/asset-manifest.json";
const appConfigManifestPath = "outputs/config/app-config/assets-manifest.json";
const promptsPath = "outputs/assets/asset-prompts.md";

if (!exists(imagePlanPath)) {
  console.error(`Missing ${imagePlanPath}. Run image-planner first.`);
  process.exit(1);
}

const plan = readJson(imagePlanPath);
const productBrief = exists("outputs/strategy/product-brief.json")
  ? readJson("outputs/strategy/product-brief.json")
  : {};
const theme = exists("outputs/design/theme.json")
  ? readJson("outputs/design/theme.json")
  : exists("outputs/config/app-config/theme.json")
    ? readJson("outputs/config/app-config/theme.json")
    : {};
const themeImageBackground = imageBackgroundForTheme(theme);
const previousAssets = exists(manifestPath)
  ? normalizePreviousAssets(readJson(manifestPath))
  : new Map();
const forceAssets = new Set(
  String(process.env.PREPARE_FORCE_ASSETS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
);

const assets = [];
const promptSections = [];

for (const slot of plan.slots ?? []) {
  if (slot.sourcePolicy === "skip") continue;

  if (slot.kind === "age_group_option_set" || slot.kind === "summary_body_set") {
    const items = orderedSetItems(slot);
    const baseItem = slot.kind === "summary_body_set" && slot.sourcePolicy === "edit"
      ? items.find((item) => item.optionValue === "normal") ?? items[0]
      : null;

    for (const item of items) {
      const id = item.id;
      const isEditVariant = Boolean(baseItem && item.id !== baseItem.id);
      const backgroundMeta = assetBackgroundMeta(slot);
      const prompt = buildPrompt(slot, item, productBrief, {
        editReference: isEditVariant ? baseItem : null
      });
      pushAsset({
        id,
        source: "gpt-image-2",
        model: "gpt-image-2",
        status: "pending_generation",
        generationMode: isEditVariant ? "edit" : "generate",
        referenceAssetIds: isEditVariant ? [baseItem.id] : [],
        referenceLocalPaths: isEditVariant ? [plannedPath(baseItem.id)] : [],
        type: slot.kind === "age_group_option_set" ? "option_image" : "supporting_image",
        kind: slot.kind,
        pageId: slot.pageId,
        pageType: slot.pageType,
        slot: slot.id,
        optionValue: item.optionValue,
        label: item.label,
        prompt,
        alt: `${plan.productName} ${item.label} visual`,
        localPath: plannedPath(id),
        usage: slot.runtimeUsage,
        scene: slot.displayRole,
        userMoment: item.visualBrief,
        emotionalJob: slot.displayRole,
        visualJob: item.differentiationRequirement,
        composition: `${slot.aspectRatio}; ${backgroundMeta.backgroundPolicy}; ${slot.styleConsistency}`,
        negativePrompt: backgroundMeta.negativePrompt,
        aspectRatio: slot.aspectRatio,
        backgroundPolicy: backgroundMeta.backgroundPolicy,
        backgroundKind: backgroundMeta.backgroundKind,
        styleConsistency: slot.styleConsistency,
        sourceSlotId: slot.id
      });
      promptSections.push(formatPromptSection(id, prompt, slot, item));
    }
    continue;
  }

  if (slot.sourcePolicy === "generate") {
    const prompt = buildPrompt(slot, null, productBrief);
    pushAsset({
      id: slot.id,
      source: "gpt-image-2",
      model: "gpt-image-2",
      status: "pending_generation",
      generationMode: "generate",
      type: "page_hero",
      kind: slot.kind,
      pageId: slot.pageId,
      pageType: slot.pageType,
      slot: slot.id,
      prompt,
      alt: `${plan.productName} ${slot.pageId} image`,
      localPath: plannedPath(slot.id),
      usage: slot.runtimeUsage,
      scene: slot.displayRole,
      userMoment: slot.promptBrief,
      emotionalJob: slot.displayRole,
      visualJob: slot.runtimeUsage,
      composition: `${slot.aspectRatio}; ${slot.backgroundPolicy}; ${slot.styleConsistency}`,
      negativePrompt: slot.negativePrompt,
      aspectRatio: slot.aspectRatio,
      backgroundPolicy: slot.backgroundPolicy,
      styleConsistency: slot.styleConsistency,
      sourceSlotId: slot.id
    });
    promptSections.push(formatPromptSection(slot.id, prompt, slot));
    continue;
  }

  if (slot.sourcePolicy === "reuse_generated_summary_asset") {
    pushAsset({
      id: slot.id,
      source: "provided",
      status: "ready",
      type: "supporting_image",
      kind: slot.kind,
      pageId: slot.pageId,
      pageType: slot.pageType,
      slot: slot.id,
      dependsOn: slot.dependsOn ?? [],
      prompt: slot.promptBrief,
      alt: `${plan.productName} paywall result comparison reused from summary visuals`,
      usage: slot.runtimeUsage,
      scene: slot.displayRole,
      userMoment: "After the user reaches the paywall, the page reuses summary result assets to preserve continuity.",
      emotionalJob: slot.displayRole,
      visualJob: "Reuse two summary body visuals for now-versus-goal comparison.",
      composition: `${slot.aspectRatio}; ${slot.backgroundPolicy}; ${slot.styleConsistency}`,
      negativePrompt: slot.negativePrompt,
      aspectRatio: slot.aspectRatio,
      backgroundPolicy: slot.backgroundPolicy,
      styleConsistency: slot.styleConsistency,
      sourceSlotId: slot.id
    });
    continue;
  }

  if (slot.sourcePolicy === "app_store") {
    const screenshotAssets = await appStoreScreenshotAssets(slot, productBrief, plan.productName);
    for (const asset of screenshotAssets) pushAsset(asset);
    continue;
  }
}

const manifest = {
  version: "1.0.0",
  productId: plan.productId,
  productName: plan.productName,
  mode: "planned",
  sourcePlan: imagePlanPath,
  generatedAt: new Date().toISOString(),
  largeImageOnly: true,
  assets
};

writeJson(manifestPath, manifest);
if (exists(appConfigManifestPath)) {
  writeJson(appConfigManifestPath, manifest);
}
writeText(promptsPath, [
  `# Asset Prompts`,
  ``,
  `Product: ${plan.productName}`,
  ``,
  `These prompts were prepared from outputs/assets/image-plan.json. App Store screenshot slots are sourced, not generated.`,
  ``,
  ...promptSections
].join("\n"));

console.log(`Prepared ${assets.length} manifest asset(s).`);
console.log(`Wrote ${manifestPath}`);
if (exists(appConfigManifestPath)) {
  console.log(`Wrote ${appConfigManifestPath}`);
}
console.log(`Wrote ${promptsPath}`);

function pushAsset(asset) {
  const previous = previousAssets.get(asset.id);
  const previousPath = previous?.localPath ? abs(previous.localPath) : null;
  if (!forceAssets.has(asset.id) && previous?.status === "ready" && previousPath && fs.existsSync(previousPath)) {
    assets.push({
      ...asset,
      status: previous.status,
      localPath: previous.localPath,
      sourceGeneratedPath: previous.sourceGeneratedPath,
      generationId: previous.generationId,
      generationTool: previous.generationTool ?? (previous.source === "gpt-image-2" ? "sub2api-image-generation" : undefined),
      generationProvider: previous.generationProvider,
      generatedAt: previous.generatedAt,
      src: previous.src,
      publicPath: previous.publicPath,
      preparationNote: previous.preparationNote
    });
    return;
  }

  assets.push(asset);
}

function orderedSetItems(slot) {
  const items = [...(slot.items ?? [])];
  if (slot.kind !== "summary_body_set" || slot.sourcePolicy !== "edit") return items;
  const baseIndex = items.findIndex((item) => item.optionValue === "normal");
  if (baseIndex <= 0) return items;
  const [base] = items.splice(baseIndex, 1);
  return [base, ...items];
}

async function appStoreScreenshotAssets(slot, productBrief, productName) {
  const appStoreUrl = productBrief.appStoreUrl;
  if (!appStoreUrl) {
    return pendingAppStoreAssets(slot, productName, "Missing appStoreUrl in product brief.");
  }

  const idMatch = appStoreUrl.match(/id(\d+)/);
  if (!idMatch) {
    return pendingAppStoreAssets(slot, productName, `Could not parse App Store id from ${appStoreUrl}`);
  }

  const lookupUrl = `https://itunes.apple.com/lookup?id=${idMatch[1]}&country=us`;
  try {
    const response = await fetch(lookupUrl);
    if (!response.ok) throw new Error(`lookup returned ${response.status}`);
    const payload = await response.json();
    const result = payload?.results?.[0];
    const urls = [
      ...(result?.screenshotUrls ?? []),
      ...(result?.ipadScreenshotUrls ?? [])
    ].slice(0, slot.count);

    if (!urls.length) {
      return pendingAppStoreAssets(slot, productName, "Lookup returned no screenshots.");
    }

    const prepared = [];
    for (let index = 0; index < urls.length; index += 1) {
      const url = urls[index];
      const id = `${slot.id}.${index + 1}`;
      const localPath = await downloadScreenshot(url, id);
      prepared.push({
        id,
        source: "app_store",
        status: "ready",
        type: "supporting_image",
        kind: slot.kind,
        pageId: slot.pageId,
        pageType: slot.pageType,
        slot: slot.id,
        prompt: slot.promptBrief,
        alt: `${productName} App Store screenshot ${index + 1}`,
        localPath,
        src: `/assets/images/${path.basename(localPath)}`,
        appStoreUrl: url,
        usage: slot.runtimeUsage,
        scene: slot.displayRole,
        userMoment: "The user is evaluating what the companion app includes after purchase.",
        emotionalJob: slot.displayRole,
        visualJob: "Show real product value with an App Store screenshot.",
        composition: `${slot.aspectRatio}; ${slot.backgroundPolicy}; ${slot.styleConsistency}`,
        negativePrompt: slot.negativePrompt,
        aspectRatio: slot.aspectRatio,
        backgroundPolicy: slot.backgroundPolicy,
        styleConsistency: slot.styleConsistency,
        sourceSlotId: slot.id
      });
    }

    if (prepared.length < slot.count) {
      prepared.push(...pendingAppStoreAssets(slot, productName, `Only ${prepared.length} screenshots found.`, prepared.length));
    }
    return prepared;
  } catch (error) {
    return pendingAppStoreAssets(slot, productName, error instanceof Error ? error.message : String(error));
  }
}

function pendingAppStoreAssets(slot, productName, reason, startIndex = 0) {
  const count = Math.max(0, slot.count - startIndex);
  return Array.from({ length: count }, (_, offset) => {
    const index = startIndex + offset + 1;
    return {
      id: `${slot.id}.${index}`,
      source: "app_store",
      status: "pending_generation",
      type: "supporting_image",
      kind: slot.kind,
      pageId: slot.pageId,
      pageType: slot.pageType,
      slot: slot.id,
      prompt: slot.promptBrief,
      alt: `${productName} App Store screenshot ${index}`,
      usage: slot.runtimeUsage,
      scene: slot.displayRole,
      userMoment: "The user is evaluating what the companion app includes after purchase.",
      emotionalJob: slot.displayRole,
      visualJob: "Show real product value with an App Store screenshot.",
      composition: `${slot.aspectRatio}; ${slot.backgroundPolicy}; ${slot.styleConsistency}`,
      negativePrompt: slot.negativePrompt,
      aspectRatio: slot.aspectRatio,
      backgroundPolicy: slot.backgroundPolicy,
      styleConsistency: slot.styleConsistency,
      sourceSlotId: slot.id,
      lastPreparationError: reason
    };
  });
}

async function downloadScreenshot(url, id) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`screenshot ${url} returned ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const ext = extensionFromUrl(url) ?? "jpg";
  const target = `outputs/assets/images/${slugify(id)}.${ext}`;
  fs.mkdirSync(abs("outputs/assets/images"), { recursive: true });
  fs.writeFileSync(abs(target), bytes);
  return target;
}

function buildPrompt(slot, item, productBrief, options = {}) {
  const isPerItemAsset = Boolean(item);
  const themedBackground = isThemeMatchedBackgroundSlot(slot) ? themeImageBackground : null;
  const backgroundPolicy = themedBackground
    ? themedBackgroundPolicyForSlot(slot)
    : slot.backgroundPolicy;
  const negativePrompt = themedBackground
    ? rewriteThemedBackgroundNegativePrompt(slot.negativePrompt, themedBackground)
    : slot.negativePrompt;
  const parts = [
    isPerItemAsset ? perItemPromptBrief(slot, item, options) : slot.promptBrief,
    item?.visualBrief ? `Specific item brief: ${item.visualBrief}` : "",
    item?.differentiationRequirement ? `Differentiation requirement: ${item.differentiationRequirement}` : "",
    options.editReference
      ? `Edit reference requirement: Use ${options.editReference.label} as the identity reference. Preserve the same face, hairstyle, expression, pose family, crop, outfit direction, lighting, and camera angle. Only adjust the body-state to ${item.label}.`
      : "",
    `Product category: ${productBrief.category ?? "unknown"}.`,
    `Target audience: ${JSON.stringify(productBrief.targetAudience ?? {})}.`,
    `Core promise: ${productBrief.corePromise ?? ""}.`,
    `Tone: ${productBrief.tone ?? ""}.`,
    `Visual direction: ${productBrief.visualDirection ?? ""}.`,
    `Display role: ${slot.displayRole}.`,
    `Runtime usage: ${slot.runtimeUsage}.`,
    `Aspect ratio: ${slot.aspectRatio}.`,
    `Background policy: ${backgroundPolicy}.`,
    `Style consistency: ${slot.styleConsistency}.`,
    `Negative prompt: ${negativePrompt}.`,
    "Generate a polished raster image for a mobile Web2App funnel.",
    "This request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.",
    "Do not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested."
  ].filter(Boolean);

  return parts.join("\n");
}

function perItemPromptBrief(slot, item, options = {}) {
  if (slot.kind === "age_group_option_set") {
    return `Create exactly one age-group option image for ${item.label}. This is one standalone option asset from a larger set, not the whole set. Show exactly one person only. Use a ${themeImageBackground.label} studio background that matches the funnel theme.`;
  }

  if (slot.kind === "summary_body_set" && options.editReference) {
    return `Create exactly one ${item.label.toLowerCase()} body-state image as an edit from the provided reference image. This is one standalone body-state asset, not the whole set. Show exactly one person only. Preserve a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a ${themeImageBackground.label} studio background that matches the funnel theme.`;
  }

  if (slot.kind === "summary_body_set") {
    return `Create exactly one ${item.label.toLowerCase()} body-state base image for a summary page. This is one standalone body-state asset, not the whole set. Show exactly one person only. Use a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a ${themeImageBackground.label} studio background that matches the funnel theme.`;
  }

  return slot.promptBrief;
}

function imageBackgroundForTheme(theme) {
  const bg = theme?.colorTokens?.background ?? theme?.colors?.background ?? theme?.colorSystem?.background ?? "#ffffff";
  const isDark = relativeLuminance(bg) < 0.42;
  return isDark
    ? {
        kind: "dark",
        label: "perfectly plain solid black #050505",
        prompt: "Perfectly plain solid black background (#050505) for a dark-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene",
        negative: "no white background, no pale background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop"
      }
    : {
        kind: "light",
        label: "perfectly plain solid white #FFFFFF",
        prompt: "Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene",
        negative: "no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop"
      };
}

function assetBackgroundMeta(slot) {
  if (!isThemeMatchedBackgroundSlot(slot)) {
    return {
      backgroundPolicy: slot.backgroundPolicy,
      negativePrompt: slot.negativePrompt,
      backgroundKind: undefined
    };
  }
  const consistencyNote = slot.kind === "age_group_option_set"
    ? "Keep the backdrop simple, seamless, and identical across all four age option images."
    : "Keep the backdrop simple, seamless, and identical across all four body-state images.";
  return {
    backgroundPolicy: themedBackgroundPolicyForSlot(slot),
    negativePrompt: rewriteThemedBackgroundNegativePrompt(slot.negativePrompt, themeImageBackground),
    backgroundKind: themeImageBackground.kind
  };
}

function isThemeMatchedBackgroundSlot(slot) {
  return slot.kind === "summary_body_set" || slot.kind === "age_group_option_set";
}

function themedBackgroundPolicyForSlot(slot) {
  const consistencyNote = slot.kind === "age_group_option_set"
    ? "Keep the backdrop simple, seamless, and identical across all four age option images."
    : "Keep the backdrop simple, seamless, and identical across all four body-state images.";
  return `${themeImageBackground.prompt}. ${consistencyNote}`;
}

function relativeLuminance(hex) {
  const parsed = String(hex || "").trim().match(/^#?([0-9a-f]{6})$/i);
  if (!parsed) return 1;
  const [r, g, b] = parsed[1].match(/.{2}/g).map((value) => parseInt(value, 16) / 255);
  const [lr, lg, lb] = [r, g, b].map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function rewriteThemedBackgroundNegativePrompt(prompt, background) {
  const cleaned = String(prompt || "")
    .replace(/,\s*no dark background/gi, "")
    .replace(/no dark background,?\s*/gi, "")
    .replace(/,\s*no black background/gi, "")
    .replace(/no black background,?\s*/gi, "")
    .replace(/,\s*no white background/gi, "")
    .replace(/no white background,?\s*/gi, "")
    .trim()
    .replace(/[,.]\s*$/, "");
  return `${cleaned}, ${background.negative}`;
}

function formatPromptSection(id, prompt, slot, item) {
  return [
    `## ${id}`,
    ``,
    `Page: \`${slot.pageId}\``,
    item?.optionValue ? `Option: \`${item.optionValue}\`` : "",
    `Source policy: \`${slot.sourcePolicy}\``,
    ``,
    "```text",
    prompt,
    "```",
    ""
  ].filter((line) => line !== "").join("\n");
}

function plannedPath(id) {
  return `outputs/assets/images/${slugify(id)}.png`;
}

function extensionFromUrl(url) {
  const clean = String(url).split("?")[0];
  const match = clean.match(/\.([a-z0-9]+)$/i);
  const ext = match?.[1]?.toLowerCase();
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) return ext === "jpeg" ? "jpg" : ext;
  return null;
}

function exists(filePath) {
  return fs.existsSync(abs(filePath));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(abs(filePath), "utf8"));
}

function normalizePreviousAssets(manifest) {
  const map = new Map();
  if (Array.isArray(manifest?.assets)) {
    for (const asset of manifest.assets) map.set(asset.id, asset);
  } else if (manifest?.assets && typeof manifest.assets === "object") {
    for (const [id, asset] of Object.entries(manifest.assets)) map.set(id, { id, ...asset });
  }
  return map;
}

function writeJson(filePath, value) {
  const target = abs(filePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(filePath, value) {
  const target = abs(filePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${value}\n`);
}

function slugify(value) {
  return String(value).replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

function abs(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.join(root, filePath);
}
