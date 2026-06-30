export function validateDesignHandoff(ctx) {
  if (!ctx.exists("outputs/design-handoff/design-handoff.json")) {
    if (ctx.exists("outputs/app/src/App.tsx")) {
      ctx.fail("Full React implementation requires outputs/design-handoff/design-handoff.json");
    }
    return;
  }

  const handoff = ctx.readJson("outputs/design-handoff/design-handoff.json");
  const allowedSources = new Set(["figma", "config", "stitch"]);
  const allowedStatuses = new Set(["designed_in_figma", "implemented_from_design", "prototype_from_config", "html_captured"]);

  if (!allowedSources.has(handoff.source)) {
    ctx.fail("design-handoff source must be figma or config");
  }
  if (!allowedStatuses.has(handoff.status)) {
    ctx.fail("design-handoff status must be designed_in_figma, implemented_from_design, or prototype_from_config");
  }
  if (handoff.source === "figma" && handoff.status !== "designed_in_figma" && handoff.status !== "implemented_from_design") {
    ctx.fail("Figma design handoff must use status designed_in_figma or implemented_from_design");
  }
  if (handoff.source === "config" && handoff.status !== "prototype_from_config") {
    ctx.fail("Config prototype design handoff must use status prototype_from_config");
  }
  if (handoff.source === "stitch" && handoff.status !== "implemented_from_design" && handoff.status !== "html_captured") {
    ctx.fail("Stitch design handoff must use status html_captured or implemented_from_design");
  }

  const templates = handoff.templates ?? [];
  if (!Array.isArray(templates) || templates.length < 6) {
    ctx.fail("design-handoff must include at least six key template mappings");
  }
  for (const template of templates) {
    if (!template.pageType) ctx.fail("Each design-handoff template must include pageType");
    if (!template.nodeId) ctx.fail(`Design-handoff template '${template.pageType ?? "unknown"}' must include nodeId`);
  }

  if (!ctx.exists("outputs/design-handoff/page-type-template-map.json")) {
    ctx.fail("Design handoff requires outputs/design-handoff/page-type-template-map.json");
  } else {
    const templateMap = ctx.readJson("outputs/design-handoff/page-type-template-map.json");
    if (templateMap.source !== handoff.source) ctx.fail("design-handoff template map source must match design-handoff source");
    if (!Array.isArray(templateMap.templates) || templateMap.templates.length < 6) {
      ctx.fail("design-handoff template map must include at least six templates");
    }
  }

  if (handoff.source === "figma") {
    if (!ctx.exists("outputs/figma/figma-file.json")) {
      ctx.fail("Figma design handoff requires outputs/figma/figma-file.json");
      return;
    }
    const figmaFile = ctx.readJson("outputs/figma/figma-file.json");
    if (figmaFile.status !== "designed_in_figma" && figmaFile.status !== "implemented_from_design") {
      ctx.fail("outputs/figma/figma-file.json must use status designed_in_figma or implemented_from_design");
    }
    if (!figmaFile.fileKey) ctx.fail("Figma file requires fileKey");
    if (!figmaFile.fileUrl) ctx.fail("Figma file requires fileUrl");
    if (!Array.isArray(figmaFile.screens) || figmaFile.screens.length < 6) {
      ctx.fail("Figma file requires at least six screen records");
    }
  }

  if (handoff.source === "stitch") {
    if (!ctx.exists("outputs/design-handoff/stitch-handoff.json")) {
      ctx.fail("Stitch design handoff requires outputs/design-handoff/stitch-handoff.json");
      return;
    }
    const stitchHandoff = ctx.readJson("outputs/design-handoff/stitch-handoff.json");
    if (stitchHandoff.source !== "stitch") ctx.fail("stitch-handoff source must be stitch");
    if (!stitchHandoff.htmlSourceDir) ctx.fail("stitch-handoff must include htmlSourceDir");
    if (!Array.isArray(stitchHandoff.screens) || stitchHandoff.screens.length < 4) {
      ctx.fail("stitch-handoff must include at least four captured HTML screens");
    }
    for (const screen of stitchHandoff.screens || []) {
      if (!screen.file || !ctx.exists(screen.file)) {
        ctx.fail(`Stitch screen HTML is missing: ${screen.file || "(unknown)"}`);
      }
      if (!screen.htmlBytes || screen.htmlBytes < 1000) {
        ctx.fail(`Stitch screen HTML appears too small: ${screen.file || "(unknown)"}`);
      }
    }
  }
}
