import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));

const productName = args["product-name"] || args.product || "";
const appUrl = args["app-url"] || args.url || "";
const targetAge = args["target-age"] || args["targetAge"] || "";
const audience = args.audience || "";
const skipImages = Boolean(args["skip-images"]);
const imageFormat = args["image-format"] || process.env.IMAGE_OUTPUT_FORMAT || "png";
const imageBaseUrl = args["image-base-url"] || process.env.SUB2API_BASE_URL || "http://152.70.196.2:8080";
const imageApiKey = args["image-api-key"] || process.env.SUB2API_API_KEY;

if (!skipImages && !imageApiKey) {
  console.error("Production full run requires SUB2API_API_KEY for gpt-image-2 asset generation.");
  console.error("Set SUB2API_API_KEY or pass --image-api-key. Use --skip-images only for a deliberate dry production rehearsal.");
  process.exit(1);
}

if (productName || appUrl || targetAge || audience) {
  writeProductBrief({ productName, appUrl, targetAge, audience });
}

run("npm", ["run", "clean", "--silent"]);
if (productName || appUrl || targetAge || audience) {
  writeProductBrief({ productName, appUrl, targetAge, audience });
}
run("node", ["scripts/generate-product-run.mjs"]);
run("npm", ["run", "images:prepare", "--silent"]);
if (!skipImages) {
  run("npm", ["run", "images:generate", "--silent"], {
    SUB2API_API_KEY: imageApiKey,
    SUB2API_BASE_URL: imageBaseUrl,
    IMAGE_OUTPUT_FORMAT: imageFormat,
  });
}
run("node", ["scripts/create-react-runtime-template.mjs"]);
run("npm", ["run", "validate", "--silent"], {
  REQUIRE_GENERATED_IMAGES: skipImages ? "0" : "1",
  WEB2APP_RUN_MODE: skipImages ? "rehearsal" : "production",
});
run("npm", ["install", "--silent"], { cwd: "outputs/app" });
run("npm", ["run", "build", "--silent"], { cwd: "outputs/app" });

writeRunSummary({ productName, appUrl, targetAge, audience, skipImages, imageFormat, imageBaseUrl });
console.log("Production funnel run complete.");

function run(bin, commandArgs, env = {}) {
  const cwd = env.cwd ? path.join(root, env.cwd) : root;
  const childEnv = { ...process.env, ...env };
  delete childEnv.cwd;

  console.log(`\n$ ${[bin, ...commandArgs].join(" ")}`);
  const result = spawnSync(bin, commandArgs, {
    cwd,
    env: childEnv,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.stdout.trim()) console.log(result.stdout.trim());
  if (result.stderr.trim()) console.error(result.stderr.trim());
  if (result.status !== 0) {
    throw new Error(`Command failed: ${bin} ${commandArgs.join(" ")}`);
  }
}

function writeProductBrief({ productName, appUrl, targetAge, audience }) {
  fs.mkdirSync(path.join(root, "inputs"), { recursive: true });
  const lines = ["# Product Brief Input", "", "## Raw Product Input", ""];
  if (productName) lines.push(`Product name: ${productName}`);
  if (appUrl) lines.push(`App Store URL: ${appUrl}`);
  if (targetAge) lines.push(`Target age override: ${targetAge}`);
  if (audience) lines.push(`Audience override: ${audience}`);
  lines.push("");
  fs.writeFileSync(path.join(root, "inputs/product-brief.md"), lines.join("\n"));
}

function writeRunSummary({ productName, appUrl, targetAge, audience, skipImages, imageFormat, imageBaseUrl }) {
  const summaryPath = path.join(root, "outputs/qa/production-run-summary.json");
  fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
  const manifestPath = path.join(root, "outputs/assets/asset-manifest.json");
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
  const assets = Array.isArray(manifest.assets) ? manifest.assets : Object.values(manifest.assets ?? {});
  fs.writeFileSync(
    summaryPath,
    `${JSON.stringify(
      {
        status: "complete",
        runMode: skipImages ? "rehearsal" : "production",
        productName,
        appUrl,
        targetAge,
        audience,
        imageFormat,
        imageBaseUrl,
        assetCount: assets.length,
        pendingImageCount: assets.filter((asset) => asset.status === "pending_generation" || asset.source === "placeholder").length,
        readyImageCount: assets.filter((asset) => asset.status === "ready").length,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    )}\n`
  );
}

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
