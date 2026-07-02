export function validateImagePlan(ctx) {
  if (!ctx.exists("outputs/assets/image-plan.json")) return;

  const plan = ctx.readJson("outputs/assets/image-plan.json");
  if (!plan || typeof plan !== "object") {
    ctx.fail("outputs/assets/image-plan.json must be a JSON object");
    return;
  }

  if (plan.largeImageOnly !== true) {
    ctx.fail("outputs/assets/image-plan.json must declare largeImageOnly: true");
  }

  if (!["planned", "approved", "blocked"].includes(plan.status)) {
    ctx.fail("outputs/assets/image-plan.json status must be planned, approved, or blocked");
  }

  if (plan.reviewRequired !== true) {
    ctx.fail("outputs/assets/image-plan.json must declare reviewRequired: true so image generation can be audited before execution");
  }

  if (!Array.isArray(plan.slots)) {
    ctx.fail("outputs/assets/image-plan.json must include slots as an array");
    return;
  }

  const allowedSourcePolicy = new Set([
    "generate",
    "edit",
    "app_store",
    "reuse_generated_summary_asset",
    "provided",
    "skip"
  ]);

  const allowedKinds = new Set([
    "entry_hero",
    "age_group_option_set",
    "welcome_transition_hero",
    "intro_hero",
    "question_context_image",
    "choice_option_image_set",
    "current_body_option_set",
    "target_body_option_set",
    "focus_area_option_set",
    "special_need_option_set",
    "flexibility_option_set",
    "sleep_hero",
    "summary_body_set",
    "paywall_result_comparison",
    "paywall_app_screenshot_set",
    "paywall_plan_preview"
  ]);

  const forbiddenKindFragments = [
    "icon",
    "logo",
    "progress",
    "chart",
    "stripe",
    "payment",
    "plan_generation"
  ];

  for (const slot of plan.slots) {
    const id = slot?.id ?? "(unknown)";
    if (!slot?.id) ctx.fail("Image plan slot missing id");
    if (!slot?.pageId) ctx.fail(`Image plan slot '${id}' missing pageId`);
    if (!allowedKinds.has(slot?.kind)) {
      ctx.fail(`Image plan slot '${id}' has unsupported kind '${slot?.kind}'`);
    }
    if (!allowedSourcePolicy.has(slot?.sourcePolicy)) {
      ctx.fail(`Image plan slot '${id}' has unsupported sourcePolicy '${slot?.sourcePolicy}'`);
    }
    if (typeof slot?.count !== "number" || slot.count < 0) {
      ctx.fail(`Image plan slot '${id}' must include numeric count >= 0`);
    }
    for (const field of ["displayRole", "backgroundPolicy", "styleConsistency", "promptBrief", "negativePrompt", "runtimeUsage"]) {
      if (!slot?.[field] || String(slot[field]).trim().length < 4) {
        ctx.fail(`Image plan slot '${id}' missing meaningful ${field}`);
      }
    }
    if (!slot?.aspectRatio || !/^\d+(\.\d+)?:\d+(\.\d+)?$/.test(String(slot.aspectRatio))) {
      ctx.fail(`Image plan slot '${id}' must include aspectRatio such as 1:1, 16:9, 3:4, or 9:19.5`);
    }

    const lower = `${slot.kind ?? ""}`.toLowerCase();
    for (const fragment of forbiddenKindFragments) {
      if (lower.includes(fragment)) {
        ctx.fail(`Image plan slot '${id}' appears to include forbidden non-large-image or plan-generation asset type: ${fragment}`);
      }
    }

    if (slot.kind === "age_group_option_set") {
      if (slot.count !== 4) ctx.fail(`Age group image slot '${id}' must count exactly 4 images`);
      if (slot.sourcePolicy !== "generate") ctx.fail(`Age group image slot '${id}' must use sourcePolicy: generate`);
      if (!/#ffffff|#050505|solid white|solid black/i.test(String(slot.backgroundPolicy))) {
        ctx.fail(`Age group image slot '${id}' must require a hard solid #FFFFFF/#050505 background`);
      }
      if (!/gradient|vignette|colored tint|texture/i.test(String(slot.negativePrompt))) {
        ctx.fail(`Age group image slot '${id}' must forbid gradient, vignette, colored tint, and texture backgrounds`);
      }
      if (!/half|waist|torso|upper/i.test(`${slot.styleConsistency} ${slot.promptBrief}`)) {
        ctx.fail(`Age group image slot '${id}' must specify half-body / upper-body crop`);
      }
      if (!/asian|black|white|race|racial|diverse|ethnic/i.test(`${slot.styleConsistency} ${slot.promptBrief} ${JSON.stringify(slot.items ?? [])}`)) {
        ctx.fail(`Age group image slot '${id}' must specify visible racial diversity across the four options`);
      }
      if (!Array.isArray(slot.items) || slot.items.length !== 4) {
        ctx.fail(`Age group image slot '${id}' must include 4 item briefs`);
      }
    }

    if (slot.kind === "summary_body_set") {
      if (slot.count !== 4) ctx.fail(`Summary body set '${id}' must count exactly 4 body-state images`);
      if (!["generate", "edit"].includes(slot.sourcePolicy)) {
        ctx.fail(`Summary body set '${id}' must use sourcePolicy generate or edit`);
      }
      if (!/same|consistent|identity|face|person/i.test(`${slot.styleConsistency} ${slot.promptBrief}`)) {
        ctx.fail(`Summary body set '${id}' must require the same face/person identity across variants`);
      }
    }

    if (slot.kind === "paywall_result_comparison" && slot.sourcePolicy !== "reuse_generated_summary_asset") {
      ctx.fail(`Paywall result comparison '${id}' should reuse summary assets with sourcePolicy: reuse_generated_summary_asset`);
    }

    if (slot.kind === "paywall_app_screenshot_set" && slot.sourcePolicy === "generate") {
      ctx.fail(`Paywall app screenshot slot '${id}' should not use AI generation by default; prefer sourcePolicy: app_store`);
    }
  }
}
