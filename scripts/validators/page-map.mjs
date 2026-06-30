export function validatePageMap(ctx) {
  const pageTypesConfig = ctx.readJson("configs/page-types.json");
  const pageTypes = new Set(pageTypesConfig.pageTypes.map((pageType) => pageType.id));
  const pageTypeMeta = new Map(pageTypesConfig.pageTypes.map((pageType) => [pageType.id, pageType]));

  if (!ctx.exists("outputs/page-map/page-map.json")) {
    ctx.warn("No outputs/page-map/page-map.json yet; run the page-architect subagent before full validation.");
    return;
  }

  const pageMap = ctx.readJson("outputs/page-map/page-map.json");
  const pageIds = new Set();
  const dataKeys = new Set();
  const usedPageTypes = new Set();
  const requiredAssetRefs = [];
  const imageChoiceVariants = new Set(["image_grid", "image_grid", "image_checkbox_grid"]);
  const iconChoiceVariants = new Set(["icon_list"]);
  let paywallSeen = false;
  let introPageCount = 0;

  for (const page of pageMap.pages ?? []) {
    if (page.pageType === "paywall_page") paywallSeen = true;

    if (pageIds.has(page.id)) ctx.fail(`Duplicate page id: ${page.id}`);
    pageIds.add(page.id);

    if (!pageTypes.has(page.pageType)) {
      ctx.fail(`Unknown pageType '${page.pageType}' on page '${page.id}'`);
      continue;
    }

    if (!page.phase) ctx.fail(`Page '${page.id}' must define phase for funnel state machine`);
    if (!page.role) ctx.fail(`Page '${page.id}' must define role for funnel state machine`);

    usedPageTypes.add(page.pageType);
    const meta = pageTypeMeta.get(page.pageType);

    if (meta.requiresDataKey && !page.dataKey) {
      ctx.fail(`Page '${page.id}' uses ${page.pageType} and must define dataKey`);
    }

    if (page.dataKey) {
      if (dataKeys.has(page.dataKey)) ctx.warn(`Repeated dataKey '${page.dataKey}' on page '${page.id}'`);
      dataKeys.add(page.dataKey);
    }

    if (!paywallSeen && page.phase === "onboarding" && page.pageType !== "paywall_page" && page.pageType !== "entry_page") {
      if (!page.sectionId) ctx.fail(`Pre-paywall page '${page.id}' must define sectionId`);
      if (!page.sectionLabel) ctx.fail(`Pre-paywall page '${page.id}' must define sectionLabel`);
      if (page.sectionOrder === undefined) ctx.fail(`Pre-paywall page '${page.id}' must define sectionOrder`);
    }

    if (page.pageType === "intro_page") {
      introPageCount += 1;
      if (page.dataKey) ctx.fail(`Intro page '${page.id}' should not define dataKey`);
      if (!page.trustPurpose && !page.paywallBridgeRole) {
        ctx.warn(`Intro page '${page.id}' should define trustPurpose or paywallBridgeRole`);
      }
    }

    if (meta.supportsOptions && (!Array.isArray(page.options) || page.options.length < 2)) {
      ctx.fail(`Page '${page.id}' uses ${page.pageType} and must include at least two options`);
    }

    if (Array.isArray(page.options) && iconChoiceVariants.has(page.variant)) {
      for (const option of page.options) {
        if (!option.icon) ctx.fail(`Option '${option.value}' on page '${page.id}' must define a semantic icon key because page variant is icon_list`);
      }
    }

    if (Array.isArray(page.options) && imageChoiceVariants.has(page.variant)) {
      const hasPageAsset = Boolean(page.assetRequirement?.required);
      const everyOptionHasVisual = page.options.every((option) => option.image || option.assetRequirement?.required);
      if (!hasPageAsset && !everyOptionHasVisual) {
        ctx.fail(`Page '${page.id}' uses ${page.variant} and must define page assetRequirement or image/assetRequirement for every option`);
      }
    }

    if (page.assetRequirement?.required) requiredAssetRefs.push({ pageId: page.id, slot: "page" });

    for (const option of page.options ?? []) {
      if (option.assetRequirement?.required) {
        requiredAssetRefs.push({ pageId: page.id, optionValue: option.value, slot: "option" });
      }
    }

    const isMeasurementPage =
      page.pageType === "measurement_picker_page" ||
      page.pageType === "height_input_page" ||
      page.pageType === "weight_input_page" ||
      Boolean(page.measurementType);

    if (isMeasurementPage) {
      if (!page.measurementType) ctx.fail(`Measurement page '${page.id}' must define measurementType`);
      if (!Array.isArray(page.units) || page.units.length < 1) ctx.fail(`Measurement page '${page.id}' must define units`);
      if (!page.defaultUnit) ctx.fail(`Measurement page '${page.id}' must define defaultUnit`);
      if (Array.isArray(page.units) && page.units.length > 1) {
        const interaction = JSON.stringify(page.designOverride ?? {}).toLowerCase();
        if (!interaction.includes("convert") && !interaction.includes("recalculate") && !interaction.includes("unit")) {
          ctx.warn(`Measurement page '${page.id}' supports multiple units; confirm design/React handoff includes real-time unit conversion`);
        }
      }
    }

    if (page.pageType === "multi_choice_page") {
      if (page.minSelections === undefined) {
        ctx.fail(`Page '${page.id}' is multi_choice_page and should define minSelections`);
      }
      if (page.minSelections === 0 && page.allowEmptySelection !== true) {
        ctx.fail(`Page '${page.id}' allows empty multi-choice continue; set minSelections >= 1 or allowEmptySelection: true with a deliberate skip rationale`);
      }
    }

    if (!page.conversionPurpose || page.conversionPurpose.length < 8) {
      ctx.fail(`Page '${page.id}' needs a meaningful conversionPurpose`);
    }
  }

  for (const requiredPageType of pageTypesConfig.pageTypes.filter((pageType) => pageType.required).map((pageType) => pageType.id)) {
    if (!usedPageTypes.has(requiredPageType)) ctx.fail(`Required page type not used: ${requiredPageType}`);
  }

  const pages = pageMap.pages ?? [];
  const firstPage = pages[0];

  if (firstPage) {
    if (firstPage.id !== "entry" || firstPage.pageType !== "entry_page") {
      ctx.fail("First page must be entry with pageType entry_page");
    }
    if (!firstPage.assetRequirement?.required || firstPage.assetRequirement?.assetType !== "entry_hero") {
      ctx.fail("entry page must define a required entry_hero assetRequirement");
    }
  }

  const ageGroupIndex = pages.findIndex((page) => page.id === "age_group");
  const ageGroupPage = pages[ageGroupIndex];

  if (ageGroupIndex === -1) {
    ctx.fail("Page map must include age_group as an early My Profile question");
  } else {
    if (ageGroupIndex === 0 || ageGroupIndex > 3) {
      ctx.fail("age_group should appear early after entry and any optional low-friction split");
    }
    if (ageGroupPage.pageType !== "single_choice_page" || !imageChoiceVariants.has(ageGroupPage.variant)) {
      ctx.fail("age_group must use single_choice_page / image_grid");
    }
    if (ageGroupPage.dataKey !== "ageGroup") ctx.fail("age_group must use dataKey ageGroup");
    if (!["my_profile", "profile"].includes(ageGroupPage.sectionId)) ctx.warn("age_group should belong to a profile section");
    if (!Array.isArray(ageGroupPage.options) || ageGroupPage.options.length !== 4) {
      ctx.fail("age_group must include exactly four options");
    }
  }

  const paywallIndex = pages.findIndex((page) => page.pageType === "paywall_page");
  const planReadyIndex = pages.findIndex((page) => page.pageType === "plan_ready_page");
  const summaryIndex = pages.findIndex((page) => page.pageType === "summary_page");
  const pageTypesInMap = new Set(pages.map((page) => page.pageType));

  if (paywallIndex !== -1 && planReadyIndex !== -1 && paywallIndex < planReadyIndex) {
    ctx.fail("paywall_page should come after plan_ready_page");
  }

  if (paywallIndex !== -1 && summaryIndex !== -1 && paywallIndex < summaryIndex) {
    ctx.fail("paywall_page should come after summary_page");
  }

  if (pageTypesInMap.has("account_create_page") && !pageTypesInMap.has("account_page")) {
    ctx.fail("account_create_page requires account_page so users can view subscription status after account creation");
  }

  if (pageTypesInMap.has("login_page") && !pageTypesInMap.has("account_page")) {
    ctx.fail("login_page requires account_page as the successful-login destination");
  }

  if (pageTypesInMap.has("subscription_manage_page") && !pageTypesInMap.has("cancel_subscription_page")) {
    ctx.fail("subscription_manage_page requires cancel_subscription_page for cancellation flow");
  }

  const paymentSuccess = pages.find((page) => page.pageType === "payment_success_page");
  if (paymentSuccess && (paymentSuccess.commitPhase !== "paid" || paymentSuccess.milestone !== "payment_verified")) {
    ctx.fail("payment_success_page must declare milestone: payment_verified and commitPhase: paid");
  }

  const accountPages = pages.filter((page) => ["account_create_page", "login_page", "account_page"].includes(page.pageType));
  for (const page of accountPages) {
    if (page.phase !== "account") ctx.fail(`Account page '${page.id}' must use phase: account`);
  }

  if (pages.length > 0 && pages.length < 12) {
    ctx.warn(`Page map has only ${pages.length} pages; confirm this is enough for personalization`);
  }

  if (pages.length >= 18 && introPageCount === 0) {
    ctx.fail("Standard OB flows should include intro_page screens between major sections");
  }

  if (ageGroupIndex !== -1) {
    const earlyFeedback = pages
      .slice(ageGroupIndex + 1, Math.min(pages.length, ageGroupIndex + 5))
      .some((page) => page.pageType === "intro_page");
    if (!earlyFeedback && pages.length >= 18) {
      ctx.warn("Standard fitness flows should include an answer-triggered intro_page shortly after age_group");
    }
  }

  for (const page of pages.filter((item) => item.pageType === "intro_page")) {
    if (!page.assetRequirement?.required) ctx.fail(`Intro page '${page.id}' must define a required hero assetRequirement`);
    if (page.assetRequirement?.assetType !== "intro_hero") ctx.fail(`Intro page '${page.id}' must use assetRequirement.assetType intro_hero`);
  }

  if (requiredAssetRefs.length && !ctx.exists("outputs/assets/image-plan.json") && !ctx.exists("outputs/assets/asset-manifest.json")) {
    ctx.fail("Page map has required assetRequirement entries but outputs/assets/image-plan.json is missing");
  }

  if (requiredAssetRefs.length && ctx.exists("outputs/assets/image-plan.json") && !ctx.exists("outputs/assets/asset-manifest.json")) {
    return;
  }

  if (requiredAssetRefs.length && !ctx.exists("outputs/assets/asset-manifest.json")) {
    ctx.fail("Page map has required assetRequirement entries but outputs/assets/asset-manifest.json is missing");
  }

  if (requiredAssetRefs.length && ctx.exists("outputs/assets/asset-manifest.json")) {
    const manifest = ctx.readJson("outputs/assets/asset-manifest.json");
    const assets = normalizeAssets(manifest);

    for (const requiredAsset of requiredAssetRefs) {
      const match = assets.find((asset) => {
        if (asset.pageId !== requiredAsset.pageId) return false;
        if (requiredAsset.optionValue) return asset.optionValue === requiredAsset.optionValue;
        return true;
      });

      if (!match) {
        const suffix = requiredAsset.optionValue ? ` option '${requiredAsset.optionValue}'` : "";
        ctx.fail(`Missing asset manifest entry for page '${requiredAsset.pageId}'${suffix}`);
      }
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
  return [];
}
