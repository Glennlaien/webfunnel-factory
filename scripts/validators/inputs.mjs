export function validateInputs(ctx) {
  if (!ctx.exists("inputs/product-brief.md")) ctx.fail("Missing inputs/product-brief.md");
  if (!ctx.exists("inputs/funnel-requirements.md")) ctx.fail("Missing inputs/funnel-requirements.md");
}
