export function validateAssets(ctx) {
  if (!ctx.exists("outputs/assets/asset-manifest.json")) return;

  const manifest = ctx.readJson("outputs/assets/asset-manifest.json");
  const assets = normalizeAssets(manifest);
  const strictImages = process.env.REQUIRE_GENERATED_IMAGES === "1" || process.env.WEB2APP_RUN_MODE === "production";
  if (!assets) {
    ctx.fail("outputs/assets/asset-manifest.json must include assets as an array or object map");
    return;
  }

  if (ctx.exists("outputs/assets/image-plan.json")) {
    const plan = ctx.readJson("outputs/assets/image-plan.json");
    const assetText = JSON.stringify(assets);
    for (const slot of Array.isArray(plan.slots) ? plan.slots : []) {
      if (slot.sourcePolicy === "skip") continue;
      if (slot.kind === "paywall_result_comparison" && slot.sourcePolicy === "reuse_generated_summary_asset") continue;
      if (!assetText.includes(slot.id)) {
      ctx.fail(`Asset manifest is missing planned image slot '${slot.id}' from outputs/assets/image-plan.json`);
      }
    }
  }

  const pendingAssets = assets.filter((asset) => asset.status === "pending_generation" || asset.source === "placeholder");
  if (strictImages && pendingAssets.length) {
    ctx.fail(
      `Production image validation failed: ${pendingAssets.length} asset(s) are still pending_generation: ${pendingAssets
        .map((asset) => asset.id ?? "(unknown)")
        .join(", ")}`
    );
  }

  for (const asset of assets) {
    if (!asset.id) ctx.fail("Asset manifest item missing id");
    if (!asset.pageId) ctx.fail(`Asset '${asset.id ?? "(unknown)"}' missing pageId`);

    const isPlaceholder = manifest.mode === "placeholder" || asset.status === "pending_generation" || asset.source === "placeholder";
    const isReuseOnly = asset.source === "provided" && Array.isArray(asset.dependsOn) && asset.dependsOn.length > 0;
    const pathValue = asset.localPath ?? asset.src;

    if (!pathValue && !isReuseOnly && !isPlaceholder) ctx.fail(`Asset '${asset.id ?? "(unknown)"}' missing localPath/src`);

    if (!isPlaceholder) {
      for (const field of ["scene", "userMoment", "emotionalJob", "visualJob", "composition", "negativePrompt"]) {
        if (!asset[field] || String(asset[field]).trim().length < 8) {
          ctx.fail(`Asset '${asset.id ?? "(unknown)"}' missing meaningful ${field}; images must be scene-based, not placeholders`);
        }
      }
    }

    if (asset.localPath && !asset.localPath.startsWith("outputs/assets/")) {
      ctx.fail(`Asset '${asset.id}' localPath must stay under outputs/assets/: ${asset.localPath}`);
    }
    if (pathValue && pathValue.toLowerCase().endsWith(".svg")) {
      ctx.fail(`Asset '${asset.id}' must be a raster asset, not SVG: ${pathValue}`);
    }
    if (pathValue && !/\.(png|jpg|jpeg|webp)$/i.test(pathValue)) {
      ctx.fail(`Asset '${asset.id}' must use png, jpg, jpeg, or webp: ${pathValue}`);
    }
    if ((asset.source === "generated" || asset.source === "gpt-image-2") && asset.model !== "gpt-image-2") {
      ctx.fail(`Generated asset '${asset.id}' must declare model: gpt-image-2`);
    }
    if (asset.source === "app_store" && (asset.status ?? "ready") === "ready" && !asset.appStoreUrl) {
      ctx.fail(`App Store asset '${asset.id}' must declare appStoreUrl`);
    }
    if (asset.source === "gpt-image-2" && (asset.status ?? "ready") === "ready") {
      const allowedGenerationTools = new Set(["codex-image-generation", "sub2api-image-generation"]);
      if (!allowedGenerationTools.has(asset.generationTool)) {
        ctx.fail(`Ready gpt-image-2 asset '${asset.id}' must declare a supported generationTool`);
      }
      if (!asset.generatedAt) {
        ctx.fail(`Ready gpt-image-2 asset '${asset.id}' must declare generatedAt`);
      }
      if (!asset.sourceGeneratedPath && !asset.generationId) {
        ctx.fail(`Ready gpt-image-2 asset '${asset.id}' must declare sourceGeneratedPath or generationId so it can be traced to the current image run`);
      }
    }
    if (asset.source === "generated") {
      ctx.fail(`Generated asset '${asset.id}' should use source: gpt-image-2`);
    }
    if (!isPlaceholder && (asset.status ?? "ready") === "ready" && asset.localPath && !ctx.exists(asset.localPath)) {
      ctx.fail(`Asset '${asset.id}' local file does not exist: ${asset.localPath}`);
    }
  }
}

function normalizeAssets(manifest) {
  if (Array.isArray(manifest.assets)) return manifest.assets;
  if (manifest.assets && typeof manifest.assets === "object") {
    return Object.entries(manifest.assets).map(([id, asset]) => ({
      id,
      ...asset
    }));
  }
  return null;
}
