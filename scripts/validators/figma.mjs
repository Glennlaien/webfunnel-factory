export function validateFigma(ctx) {
  if (!ctx.exists("outputs/figma/figma-file.json")) return;

  const figmaFile = ctx.readJson("outputs/figma/figma-file.json");
  const allowedStatuses = new Set(["designed_in_figma", "implemented_from_figma"]);

  if (!figmaFile.status) {
    ctx.fail("outputs/figma/figma-file.json must include status");
    return;
  }

  if (!allowedStatuses.has(figmaFile.status)) {
    ctx.fail(`outputs/figma/figma-file.json has unknown status: ${figmaFile.status}`);
  }

  if (figmaFile.status !== "designed_in_figma" && figmaFile.status !== "implemented_from_figma") {
    ctx.fail("Figma must be designed_in_figma before React final implementation can proceed.");
  }

  if (!figmaFile.fileKey) ctx.fail("Figma designed_in_figma status requires fileKey");
  if (!figmaFile.fileUrl) ctx.fail("Figma designed_in_figma status requires fileUrl");

  if (!Array.isArray(figmaFile.screens) || figmaFile.screens.length < 6) {
    ctx.fail("Figma designed_in_figma status requires at least six key screen records in figma-file.json");
  }

  for (const screen of figmaFile.screens ?? []) {
    if (!screen.pageId) ctx.fail("Each Figma screen record must include pageId");
    if (!screen.pageType) ctx.fail(`Figma screen '${screen.pageId ?? "unknown"}' must include pageType`);
    if (!screen.nodeId) ctx.fail(`Figma screen '${screen.pageId ?? "unknown"}' must include nodeId`);
  }

  if (!ctx.exists("outputs/figma/page-type-template-map.json")) {
    ctx.fail("Figma designed_in_figma status requires outputs/figma/page-type-template-map.json");
    return;
  }

  const templateMap = ctx.readJson("outputs/figma/page-type-template-map.json");
  if (templateMap.status !== "designed_in_figma" && templateMap.status !== "implemented_from_figma") {
    ctx.fail("page-type-template-map.json must use designed_in_figma or implemented_from_figma status");
  }

  const templates = templateMap.templates ?? [];
  if (!Array.isArray(templates) || templates.length < 6) {
    ctx.fail("page-type-template-map.json must include real Figma node mappings for key templates");
  }

  for (const template of templates) {
    if (!template.pageType) ctx.fail("Each Figma template mapping must include pageType");
    if (!template.nodeId) ctx.fail(`Figma template mapping '${template.pageType ?? "unknown"}' must include nodeId`);
    if (!template.figmaFileKey && !figmaFile.fileKey) ctx.fail(`Figma template mapping '${template.pageType ?? "unknown"}' must include figmaFileKey`);
  }
}
