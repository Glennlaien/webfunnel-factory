export function validateCapabilities(ctx) {
  const hasCapabilityPlan = ctx.exists("outputs/capabilities/capability-plan.json");
  const hasFieldContract = ctx.exists("outputs/contracts/field-contract.json");
  const hasPageMap = ctx.exists("outputs/page-map/page-map.json");

  if (!hasPageMap) return;
  if (!hasCapabilityPlan) {
    ctx.fail("Missing outputs/capabilities/capability-plan.json");
    return;
  }
  if (!hasFieldContract) {
    ctx.fail("Missing outputs/contracts/field-contract.json");
    return;
  }

  const capabilityPlan = ctx.readJson("outputs/capabilities/capability-plan.json");
  const fieldContract = ctx.readJson("outputs/contracts/field-contract.json");
  const pageMap = ctx.readJson("outputs/page-map/page-map.json");

  const capabilities = capabilityPlan.capabilities ?? [];
  const capabilityIds = new Set(capabilities.map((item) => item.id));
  const fieldsByDataKey = new Map((fieldContract.fields ?? []).map((field) => [field.dataKey, field]));
  const capabilityPages = (pageMap.pages ?? []).filter((page) => page.source === "capability_planner" || page.capability);

  if (capabilities.length < 8) {
    ctx.warn(`Capability plan has only ${capabilities.length} capabilities; confirm this is enough for a production OB`);
  }

  for (const capability of capabilities) {
    if (!capability.id) ctx.fail("Every capability must define id");
    if (!capability.pageType) ctx.fail(`Capability '${capability.id}' must define pageType`);
    if (!Array.isArray(capability.requiredFor) || capability.requiredFor.length === 0) {
      ctx.fail(`Capability '${capability.id}' must define requiredFor`);
    }
    if (!capability.reason || capability.reason.length < 20) {
      ctx.fail(`Capability '${capability.id}' must explain its reason`);
    }
    if (capability.dataKey && !fieldsByDataKey.has(capability.dataKey)) {
      ctx.fail(`Capability '${capability.id}' dataKey '${capability.dataKey}' is missing from field-contract`);
    }
  }

  for (const page of capabilityPages) {
    if (!page.capability) ctx.fail(`Capability-generated page '${page.id}' must define capability`);
    if (page.capability && !capabilityIds.has(page.capability)) {
      ctx.fail(`Page '${page.id}' references unknown capability '${page.capability}'`);
    }
    if (!Array.isArray(page.requiredFor) || page.requiredFor.length === 0) {
      ctx.fail(`Capability-generated page '${page.id}' must define requiredFor`);
    }
    if (page.dataKey && !fieldsByDataKey.has(page.dataKey)) {
      ctx.fail(`Page '${page.id}' dataKey '${page.dataKey}' is missing from field-contract`);
    }
  }

  for (const field of fieldContract.fields ?? []) {
    if (!field.dataKey) ctx.fail("Every field contract entry must define dataKey");
    if (!field.pageId) ctx.fail(`Field '${field.dataKey}' must define pageId`);
    if (!field.valueShape) ctx.fail(`Field '${field.dataKey}' must define valueShape`);
    if (!field.usedBy || typeof field.usedBy !== "object") {
      ctx.fail(`Field '${field.dataKey}' must define usedBy`);
    }
  }

  const covered = new Set(capabilities.flatMap((item) => item.requiredFor ?? []));
  const requiredCoverage = capabilityPlan.requiredCoverage ?? [];
  for (const coverage of requiredCoverage) {
    if (!covered.has(coverage)) {
      ctx.fail(`Capability plan does not cover required downstream use '${coverage}'`);
    }
  }
}
