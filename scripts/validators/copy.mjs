export function validateCopy(ctx) {
  if (!ctx.exists("outputs/page-map/page-map.json") || !ctx.exists("outputs/copy/page-copy.json")) return;

  const pageMap = ctx.readJson("outputs/page-map/page-map.json");
  const copy = ctx.readJson("outputs/copy/page-copy.json");
  const copyPages = Array.isArray(copy.pages)
    ? copy.pages
    : Object.entries(copy.pages ?? {}).map(([id, page]) => ({ id, ...page }));
  const copyById = new Map(copyPages.map((page) => [page.id, page]));
  const missingCopy = (pageMap.pages ?? []).filter((page) => !copyById.has(page.id)).map((page) => page.id);

  if (missingCopy.length) {
    ctx.fail(`Missing copy for pages: ${missingCopy.join(", ")}`);
  }
}
