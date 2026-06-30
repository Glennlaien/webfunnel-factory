import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { PNG } from "pngjs";

const root = process.cwd();
const defaultManifestPath = "outputs/assets/asset-manifest.json";
const appConfigManifestPath = "outputs/config/app-config/assets-manifest.json";
const defaultBaseUrl = "http://152.70.196.2:8080";

const args = parseArgs(process.argv.slice(2));
const manifestPath = args.manifest ?? defaultManifestPath;
const outputFormat = normalizeOutputFormat(process.env.IMAGE_OUTPUT_FORMAT ?? args.format ?? "png");
const model = process.env.IMAGE_MODEL ?? args.model ?? "gpt-image-2";
const size = process.env.IMAGE_SIZE ?? args.size ?? "1024x1024";
const baseUrl = trimTrailingSlash(process.env.SUB2API_BASE_URL ?? args.baseUrl ?? defaultBaseUrl);
const apiKey = process.env.SUB2API_API_KEY ?? args.apiKey;
const timeoutMs = Number(process.env.IMAGE_TIMEOUT_MS ?? args.timeoutMs ?? 300000);
const limit = args.limit ? Number(args.limit) : undefined;
const assetFilter = args.asset ? new Set(asArray(args.asset)) : null;
const dryRun = Boolean(args.dryRun);
const force = Boolean(args.force);
const failFast = Boolean(args.failFast) || process.env.IMAGE_FAIL_FAST === "1";

if (!dryRun && !apiKey) {
  console.error("Missing SUB2API_API_KEY. Set it in the environment before running image generation.");
  process.exit(1);
}

if (!fs.existsSync(abs(manifestPath))) {
  console.error(`Asset manifest not found: ${manifestPath}`);
  console.error("Run the workflow through image-planner and image-asset-generator first so outputs/assets/image-plan.json and asset-manifest.json exist.");
  process.exit(1);
}

const manifest = readJson(manifestPath);
const normalized = normalizeAssets(manifest);
if (!normalized.assets.length) {
  console.log("No assets found in manifest.");
  process.exit(0);
}

const selectedAssets = normalized.assets
  .filter((asset) => shouldGenerate(asset))
  .slice(0, limit ?? normalized.assets.length);

if (!selectedAssets.length) {
  console.log("No pending image assets to generate.");
  process.exit(0);
}

console.log(`Image generation plan: ${selectedAssets.length} asset(s), model=${model}, size=${size}, format=${outputFormat}`);
for (const asset of selectedAssets) {
  console.log(`- ${asset.id}: ${asset.pageId ?? "unknown page"} / ${asset.kind ?? "image"}`);
}

if (dryRun) {
  console.log("Dry run complete. No API calls were made.");
  process.exit(0);
}

for (const asset of selectedAssets) {
  const existingPath = findExistingGeneratedPath(asset);
  if (!force && existingPath) {
    const runtimePath = copyToRuntimePublic(existingPath);
    const updatedAsset = markAssetReadyFromLocalFile(asset, existingPath, runtimePath);
    normalized.set(asset.id, updatedAsset);
    writeUpdatedManifest(manifest, normalized);
    console.log(`Recovered ${asset.id} from existing file -> ${existingPath}`);
    continue;
  }

  const prompt = buildPrompt(asset);
  const generationMode = asset.generationMode === "edit" ? "edit" : "generate";
  console.log(`${generationMode === "edit" ? "Editing" : "Generating"} ${asset.id}...`);

  try {
    const response = generationMode === "edit"
      ? await requestImageEdit({
          prompt,
          model,
          size,
          baseUrl,
          apiKey,
          timeoutMs,
          referencePaths: resolveReferencePaths(asset)
        })
      : await requestImageGeneration({ prompt, model, size, baseUrl, apiKey, timeoutMs });
    const generatedPath = writeImageFile(asset, response.b64Json, outputFormat);
    const runtimePath = copyToRuntimePublic(generatedPath);
    const updatedAsset = {
      ...asset,
      source: "gpt-image-2",
      model,
      status: "ready",
      generationTool: "sub2api-image-generation",
      generationMode,
      generatedAt: new Date().toISOString(),
      generationId: response.generationId,
      sourceGeneratedPath: generatedPath,
      localPath: generatedPath,
      src: runtimePath,
      outputFormat,
      generationProvider: "sub2api",
      generationEndpoint: `${baseUrl}/v1/images/${generationMode === "edit" ? "edits" : "generations"}`
    };
    normalized.set(asset.id, updatedAsset);
    writeUpdatedManifest(manifest, normalized);
    console.log(`Generated ${asset.id} -> ${generatedPath}`);
  } catch (error) {
    normalized.set(asset.id, {
      ...asset,
      status: asset.status ?? "pending_generation",
      source: asset.source ?? "placeholder",
      lastGenerationError: error instanceof Error ? error.message : String(error),
      lastGenerationAttemptedAt: new Date().toISOString()
    });
    writeUpdatedManifest(manifest, normalized);
    console.error(`Failed to generate ${asset.id}: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
    if (failFast) break;
  }
}

writeUpdatedManifest(manifest, normalized);

if (process.exitCode) {
  console.error("Image generation stopped with errors. Successful assets were kept; failed assets remain pending.");
} else {
  console.log("Image generation complete.");
}

function shouldGenerate(asset) {
  if (!asset?.id) return false;
  if (assetFilter && !assetFilter.has(asset.id)) return false;
  const isGeneratable = asset.source === "gpt-image-2" || asset.source === "placeholder";
  if (!isGeneratable) return false;
  if (force) return true;
  return asset.status === "pending_generation" || asset.source === "placeholder" || !asset.localPath;
}

function findExistingGeneratedPath(asset) {
  const candidates = [
    asset.localPath,
    asset.sourceGeneratedPath,
    `outputs/assets/images/${slugify(asset.id)}.${outputFormat}`,
    `outputs/assets/images/${slugify(asset.id)}.png`,
    `outputs/assets/images/${slugify(asset.id)}.webp`,
    `outputs/assets/images/${slugify(asset.id)}.jpg`,
    `outputs/assets/images/${slugify(asset.id)}.jpeg`,
  ].filter(Boolean);

  return candidates.find((candidate) => fs.existsSync(abs(candidate))) || null;
}

function markAssetReadyFromLocalFile(asset, localPath, runtimePath) {
  const ext = path.extname(localPath).replace(".", "").toLowerCase() || outputFormat;
  return {
    ...asset,
    source: "gpt-image-2",
    model,
    status: "ready",
    generationTool: asset.generationTool ?? "sub2api-image-generation",
    generationMode: asset.generationMode === "edit" ? "edit" : "generate",
    generatedAt: asset.generatedAt ?? new Date().toISOString(),
    generationId: asset.generationId ?? `recovered-${slugify(asset.id)}-${Date.now()}`,
    sourceGeneratedPath: localPath,
    localPath,
    src: runtimePath,
    outputFormat: ext,
    generationProvider: "sub2api",
  };
}

function buildPrompt(asset) {
  const sections = [
    asset.prompt,
    asset.scene ? `Scene: ${asset.scene}` : "",
    asset.userMoment ? `User moment: ${asset.userMoment}` : "",
    asset.emotionalJob ? `Emotional job: ${asset.emotionalJob}` : "",
    asset.visualJob ? `Visual job: ${asset.visualJob}` : "",
    asset.composition ? `Composition: ${asset.composition}` : "",
    asset.optionValue ? `Option value this image represents: ${asset.optionValue}` : "",
    asset.negativePrompt ? `Negative prompt: ${asset.negativePrompt}` : "",
    "Generate a polished raster image for a mobile Web2App funnel.",
    "Do not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested by the prompt."
  ].filter(Boolean);

  return sections.join("\n");
}

async function requestImageGeneration({ prompt, model, size, baseUrl, apiKey, timeoutMs }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

  try {
    const response = await fetch(`${baseUrl}/v1/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        prompt,
        n: 1,
        size
      }),
      signal: controller.signal
    });

    const text = await response.text();
    const payload = parseJson(text);
    if (!response.ok) {
      const message = payload?.error?.message ?? payload?.message ?? text.slice(0, 500);
      throw new Error(`Image API returned ${response.status}: ${message}`);
    }

    const b64Json = payload?.data?.[0]?.b64_json;
    if (!b64Json || typeof b64Json !== "string") {
      throw new Error("Image API response did not include data[0].b64_json");
    }

    return {
      b64Json,
      generationId: payload?.id ?? `${payload?.created ?? Date.now()}-${Date.now()}`,
      elapsedMs: Date.now() - startedAt
    };
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`Image API timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function requestImageEdit({ prompt, model, size, baseUrl, apiKey, timeoutMs, referencePaths }) {
  if (!referencePaths.length) {
    throw new Error("Edit generation requires at least one reference image path.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

  try {
    const form = new FormData();
    form.append("model", model);
    form.append("prompt", prompt);
    form.append("size", size);
    form.append("n", "1");

    for (const referencePath of referencePaths) {
      const bytes = fs.readFileSync(referencePath);
      const blob = new Blob([bytes], { type: contentTypeForPath(referencePath) });
      form.append("image", blob, path.basename(referencePath));
    }

    const response = await fetch(`${baseUrl}/v1/images/edits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: form,
      signal: controller.signal
    });

    const text = await response.text();
    const payload = parseJson(text);
    if (!response.ok) {
      const message = payload?.error?.message ?? payload?.message ?? text.slice(0, 500);
      throw new Error(`Image edit API returned ${response.status}: ${message}`);
    }

    const b64Json = payload?.data?.[0]?.b64_json;
    if (!b64Json || typeof b64Json !== "string") {
      throw new Error("Image edit API response did not include data[0].b64_json");
    }

    return {
      b64Json,
      generationId: payload?.id ?? `${payload?.created ?? Date.now()}-${Date.now()}`,
      elapsedMs: Date.now() - startedAt
    };
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`Image edit API timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function writeImageFile(asset, b64Json, format) {
  const safeId = slugify(asset.id);
  const imagesDir = abs("outputs/assets/images");
  fs.mkdirSync(imagesDir, { recursive: true });

  const rawBuffer = Buffer.from(b64Json, "base64");
  const pngPath = path.join(imagesDir, `${safeId}.png`);
  fs.writeFileSync(pngPath, rawBuffer);
  cropToAspectIfNeeded(pngPath, asset.aspectRatio);
  normalizePlainBackgroundIfNeeded(pngPath, asset);

  if (format === "png") return rel(pngPath);

  const webpPath = path.join(imagesDir, `${safeId}.webp`);
  convertPngToWebp(pngPath, webpPath);
  return rel(webpPath);
}

function normalizePlainBackgroundIfNeeded(filePath, asset) {
  const backgroundKind = asset.backgroundKind;
  if (!["light", "dark"].includes(backgroundKind)) return;
  if (path.extname(filePath).toLowerCase() !== ".png") return;

  let image;
  try {
    image = PNG.sync.read(fs.readFileSync(filePath));
  } catch (error) {
    console.warn(`Could not normalize background for ${rel(filePath)}: ${error instanceof Error ? error.message : String(error)}`);
    return;
  }

  const { width, height, data } = image;
  const visited = new Uint8Array(width * height);
  const queue = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixelIndex = y * width + x;
    if (visited[pixelIndex]) return;
    if (!isPlainBackgroundPixel(data, pixelIndex * 4, backgroundKind)) return;
    visited[pixelIndex] = 1;
    queue.push(pixelIndex);
  };

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }

  const fill = backgroundKind === "light" ? [255, 255, 255] : [5, 5, 5];
  let changed = 0;

  while (queue.length) {
    const pixelIndex = queue.shift();
    const offset = pixelIndex * 4;
    data[offset] = fill[0];
    data[offset + 1] = fill[1];
    data[offset + 2] = fill[2];
    data[offset + 3] = 255;
    changed += 1;

    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  if (!changed) return;
  fs.writeFileSync(filePath, PNG.sync.write(image));
}

function isPlainBackgroundPixel(data, offset, backgroundKind) {
  const alpha = data[offset + 3];
  if (alpha < 16) return true;

  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const chroma = max - min;

  if (backgroundKind === "light") {
    return min >= 224 && chroma <= 34;
  }
  return max <= 34 && chroma <= 22;
}

function resolveReferencePaths(asset) {
  const references = [
    ...(asset.referenceLocalPaths ?? []),
    ...(asset.referenceAssets ?? []).map((reference) => reference.localPath).filter(Boolean)
  ];
  const absolutePaths = references.map((referencePath) => abs(referencePath));
  const missing = absolutePaths.filter((referencePath) => !fs.existsSync(referencePath));
  if (missing.length) {
    throw new Error(`Missing edit reference image(s): ${missing.map((value) => rel(value)).join(", ")}`);
  }
  return absolutePaths;
}

function cropToAspectIfNeeded(filePath, aspectRatio) {
  const targetRatio = parseAspectRatio(aspectRatio);
  if (!targetRatio || !commandExists("sips")) return;

  const dimensions = readImageDimensions(filePath);
  if (!dimensions) return;

  const currentRatio = dimensions.width / dimensions.height;
  if (Math.abs(currentRatio - targetRatio) < 0.01) return;

  let cropWidth = dimensions.width;
  let cropHeight = dimensions.height;
  if (currentRatio > targetRatio) {
    cropWidth = Math.round(dimensions.height * targetRatio);
  } else {
    cropHeight = Math.round(dimensions.width / targetRatio);
  }

  cropWidth = Math.max(1, Math.min(dimensions.width, cropWidth));
  cropHeight = Math.max(1, Math.min(dimensions.height, cropHeight));

  const temporaryPath = `${filePath}.crop.png`;
  const result = spawnSync("sips", ["-c", String(cropHeight), String(cropWidth), filePath, "--out", temporaryPath], {
    encoding: "utf8"
  });
  if (result.status !== 0 || !fs.existsSync(temporaryPath)) {
    console.warn(`Could not crop ${rel(filePath)} to ${aspectRatio}: ${(result.stderr || result.stdout || "unknown error").trim()}`);
    return;
  }
  fs.renameSync(temporaryPath, filePath);
}

function readImageDimensions(filePath) {
  const result = spawnSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", filePath], {
    encoding: "utf8"
  });
  if (result.status !== 0) return null;
  const width = Number(result.stdout.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const height = Number(result.stdout.match(/pixelHeight:\s*(\d+)/)?.[1]);
  if (!width || !height) return null;
  return { width, height };
}

function parseAspectRatio(value) {
  const match = String(value ?? "").match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!width || !height) return null;
  return width / height;
}

function contentTypeForPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "image/png";
}

function convertPngToWebp(pngPath, webpPath) {
  const attempts = [
    ["cwebp", ["-quiet", "-q", "90", pngPath, "-o", webpPath]],
    ["magick", [pngPath, "-quality", "90", webpPath]],
    ["ffmpeg", ["-y", "-i", pngPath, "-compression_level", "6", "-quality", "90", webpPath]]
  ];

  const failures = [];
  for (const [command, commandArgs] of attempts) {
    if (!commandExists(command)) continue;
    const result = spawnSync(command, commandArgs, { encoding: "utf8" });
    if (result.status === 0 && fs.existsSync(webpPath)) return;
    failures.push(`${command}: ${(result.stderr || result.stdout || "unknown error").trim()}`);
  }

  throw new Error(
    `Unable to convert PNG to WebP. Install cwebp, ImageMagick, or ffmpeg. ${failures.join(" | ")}`
  );
}

function commandExists(command) {
  const result = spawnSync("sh", ["-lc", `command -v ${shellQuote(command)} >/dev/null 2>&1`]);
  return result.status === 0;
}

function copyToRuntimePublic(generatedPath) {
  const source = abs(generatedPath);
  const fileName = path.basename(generatedPath);
  const publicDir = abs("outputs/app/public/assets/images");
  fs.mkdirSync(publicDir, { recursive: true });
  fs.copyFileSync(source, path.join(publicDir, fileName));
  return `/assets/images/${fileName}`;
}

function writeUpdatedManifest(originalManifest, normalized) {
  const assets = normalized.toManifestAssets();
  const pendingCount = normalized.assets.filter((asset) => asset.status === "pending_generation" || asset.source === "placeholder").length;
  const nextManifest = {
    ...originalManifest,
    mode: pendingCount === normalized.assets.length ? "placeholder" : pendingCount > 0 ? "mixed" : "generated",
    model,
    generationSkipped: false,
    lastGeneratedAt: new Date().toISOString(),
    assets
  };

  writeJson(manifestPath, nextManifest);
  if (fs.existsSync(abs(appConfigManifestPath))) {
    writeJson(appConfigManifestPath, nextManifest);
  }
}

function normalizeAssets(manifest) {
  const originalWasArray = Array.isArray(manifest.assets);
  const map = new Map();

  if (Array.isArray(manifest.assets)) {
    for (const asset of manifest.assets) map.set(asset.id, asset);
  } else if (manifest.assets && typeof manifest.assets === "object") {
    for (const [id, asset] of Object.entries(manifest.assets)) map.set(id, { id, ...asset });
  }

  return {
    get assets() {
      return [...map.values()];
    },
    set(id, asset) {
      map.set(id, asset);
    },
    toManifestAssets() {
      if (originalWasArray) return [...map.values()];
      return Object.fromEntries([...map.entries()].map(([id, asset]) => [id, asset]));
    }
  };
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") parsed.dryRun = true;
    else if (arg === "--force") parsed.force = true;
    else if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) {
        parsed[key] = true;
      } else {
        if (parsed[key]) parsed[key] = asArray(parsed[key]).concat(value);
        else parsed[key] = value;
        i += 1;
      }
    }
  }
  return parsed;
}

function normalizeOutputFormat(value) {
  if (!["png", "webp"].includes(value)) {
    throw new Error(`IMAGE_OUTPUT_FORMAT must be png or webp, received: ${value}`);
  }
  return value;
}

function trimTrailingSlash(value) {
  return String(value).replace(/\/+$/, "");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(abs(filePath), "utf8"));
}

function writeJson(filePath, value) {
  const target = abs(filePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [value];
}

function slugify(value) {
  return String(value).replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

function abs(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.join(root, filePath);
}

function rel(filePath) {
  return path.relative(root, filePath);
}
