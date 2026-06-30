export function validateDesign(ctx) {
  if (!ctx.exists("outputs/design/theme.json")) return;

  const theme = ctx.readJson("outputs/design/theme.json");
  const decision = theme.primaryColorDecision ?? theme.primaryColorSource;

  for (const filePath of [
    "outputs/design/art-direction.json",
    "outputs/design/screen-blueprints.json",
    "outputs/design/theme-candidates.json",
    "outputs/design/design-prompt.md",
    "outputs/design/design-system.md",
    "outputs/design/stitch-global-brief.md",
    "outputs/design/stitch-prompts.json",
    "outputs/design/stitch-prompts.md"
  ]) {
    if (!ctx.exists(filePath)) ctx.fail(`Design stage must include ${filePath}`);
  }

  if (ctx.exists("outputs/design/theme-candidates.json")) {
    const candidatesDoc = ctx.readJson("outputs/design/theme-candidates.json");
    const candidates = Array.isArray(candidatesDoc.candidates) ? candidatesDoc.candidates : [];
    const candidateIds = new Set(candidates.map((candidate) => candidate.id));
    const usesRuntimeStyleRecipe =
      theme.styleSystem === "runtime_style_recipe" ||
      ctx.exists("outputs/design/ui-style-recipe.json") ||
      [...candidateIds].some((id) => String(id).includes("_"));
    const requiredIds = new Set(["brand_aligned", "audience_optimized", "differentiated"]);
    if (candidates.length < 3) ctx.fail("theme-candidates.json must include at least three theme candidates");
    if (!candidatesDoc.selectedCandidateId) ctx.fail("theme-candidates.json must include selectedCandidateId");
    if (!candidatesDoc.selectionRationale || String(candidatesDoc.selectionRationale).trim().length < 30) {
      ctx.fail("theme-candidates.json must include a meaningful selectionRationale");
    }

    if (!usesRuntimeStyleRecipe) {
      for (const id of requiredIds) {
        if (!candidates.some((candidate) => candidate.id === id)) ctx.fail(`theme-candidates.json must include candidate '${id}'`);
      }
      for (const candidate of candidates) {
        for (const field of ["sourceType", "primary", "accent", "background", "surface", "text", "audienceFit", "conversionFit", "brandEvidence", "risks"]) {
          if (!candidate[field]) ctx.fail(`Theme candidate '${candidate.id ?? "(unknown)"}' must include ${field}`);
        }
        if (candidate.id !== candidatesDoc.selectedCandidateId && !candidate.whyNotSelected) {
          ctx.fail(`Unselected theme candidate '${candidate.id ?? "(unknown)"}' must include whyNotSelected`);
        }
      }
      if (decision && candidatesDoc.selectedCandidateId) {
        const selected = candidates.find((candidate) => candidate.id === candidatesDoc.selectedCandidateId);
        const themePrimary = (theme.colorTokens?.primary ?? "").toLowerCase();
        if (selected?.primary && selected.primary.toLowerCase() !== themePrimary) {
          ctx.fail(`theme.json primary (${theme.colorTokens?.primary}) must match selected theme candidate '${selected.id}' primary (${selected.primary})`);
        }
      }
    } else {
      const selected = candidates.find((candidate) => candidate.id === candidatesDoc.selectedCandidateId);
      if (!selected) ctx.fail(`theme-candidates.json selectedCandidateId '${candidatesDoc.selectedCandidateId}' must match a candidate`);
      for (const candidate of candidates) {
        for (const field of ["sourceType", "primary", "background", "audienceFit", "conversionFit"]) {
          if (!candidate[field]) ctx.fail(`Theme recipe candidate '${candidate.id ?? "(unknown)"}' must include ${field}`);
        }
        if (typeof candidate.selected !== "boolean") {
          ctx.fail(`Theme recipe candidate '${candidate.id ?? "(unknown)"}' must include boolean selected`);
        }
      }
      if (!ctx.exists("outputs/design/ui-style-recipe.json")) {
        ctx.fail("Runtime style recipe flow must include outputs/design/ui-style-recipe.json");
      } else {
        const recipe = ctx.readJson("outputs/design/ui-style-recipe.json");
        if (recipe.recipeId !== candidatesDoc.selectedCandidateId) {
          ctx.fail(`ui-style-recipe.json recipeId (${recipe.recipeId}) must match selectedCandidateId (${candidatesDoc.selectedCandidateId})`);
        }
        const themePrimary = (theme.colorTokens?.primary ?? "").toLowerCase();
        const recipePrimary = (recipe.globalTokens?.primary ?? "").toLowerCase();
        if (recipePrimary && recipePrimary !== themePrimary) {
          ctx.fail(`theme.json primary (${theme.colorTokens?.primary}) must match ui-style-recipe globalTokens.primary (${recipe.globalTokens?.primary})`);
        }
        if (theme.styleRecipe?.recipeId && theme.styleRecipe.recipeId !== recipe.recipeId) {
          ctx.fail(`theme.json styleRecipe.recipeId (${theme.styleRecipe.recipeId}) must match ui-style-recipe recipeId (${recipe.recipeId})`);
        }
      }
    }
  }

  if (!decision) {
    ctx.fail("theme.json must include primaryColorDecision with sourceType, evidence, confidence, and fallbackPolicy");
  } else {
    const sourceType = decision.sourceType;
    const usesRuntimeStyleRecipe = theme.styleSystem === "runtime_style_recipe" || ctx.exists("outputs/design/ui-style-recipe.json");
    const allowed = new Set(["brand_asset", "app_store_visual_evidence", "user_provided", "category_research", "neutral_fallback"]);
    if (usesRuntimeStyleRecipe) allowed.add("product_strategy");
    if (!allowed.has(sourceType)) {
      ctx.fail(`theme.json primaryColorDecision.sourceType must be one of ${Array.from(allowed).join(", ")}`);
    }
    if (!decision.evidence || String(decision.evidence).trim().length < 12) {
      ctx.fail("theme.json primaryColorDecision.evidence must explain the evidence for the primary color");
    }
    if (!decision.audienceFit || String(decision.audienceFit).trim().length < 20) {
      ctx.fail("theme.json primaryColorDecision.audienceFit must explain how the color fits audience age, gender, modality, intensity, and emotional promise");
    }
    if (!decision.fallbackPolicy || String(decision.fallbackPolicy).trim().length < 12) {
      ctx.fail("theme.json primaryColorDecision.fallbackPolicy must explain what happens when brand evidence is weak");
    }
    if (sourceType === "neutral_fallback") {
      const primary = (theme.colorTokens?.primary ?? "").toLowerCase();
      const neutralAllowed = new Set(["#000000", "#111111", "#1f2428", "#202124", "#ffffff"]);
      if (!neutralAllowed.has(primary)) {
        ctx.fail(`theme.json uses neutral_fallback but primary is not an approved neutral color: ${theme.colorTokens?.primary}`);
      }
    }
    if (sourceType === "app_store_visual_evidence") {
      if (!ctx.exists("outputs/design/app-store-visual-evidence.json")) {
        ctx.fail("theme.json uses app_store_visual_evidence but outputs/design/app-store-visual-evidence.json is missing");
      } else {
        const visualEvidence = ctx.readJson("outputs/design/app-store-visual-evidence.json");
        if (!visualEvidence.usable) {
          ctx.fail("theme.json uses app_store_visual_evidence but app-store-visual-evidence.json is not usable");
        }
        const themePrimary = (theme.colorTokens?.primary ?? "").toLowerCase();
        const evidencePrimary = (visualEvidence.selectedPrimary ?? "").toLowerCase();
        if (evidencePrimary && themePrimary !== evidencePrimary) {
          ctx.fail(`theme.json primary (${theme.colorTokens?.primary}) must match app-store visual evidence selectedPrimary (${visualEvidence.selectedPrimary})`);
        }
      }
    }
    if (["#0f9f87", "#10b981", "#14b8a6", "#22c55e"].includes((theme.colorTokens?.primary ?? "").toLowerCase()) && sourceType === "neutral_fallback") {
      ctx.fail("theme.json must not use green/teal primary under neutral_fallback");
    }
  }

  if (ctx.exists("outputs/design/art-direction.json")) {
    const artDirection = ctx.readJson("outputs/design/art-direction.json");
    for (const field of ["visualWorld", "imageStyle", "compositionPrinciples", "differentiationFromPreviousRuns"]) {
      if (!artDirection[field]) ctx.fail(`art-direction.json must include ${field}`);
    }
  }

  if (ctx.exists("outputs/design/screen-blueprints.json")) {
    const blueprints = ctx.readJson("outputs/design/screen-blueprints.json");
    const items = Array.isArray(blueprints.blueprints) ? blueprints.blueprints : [];
    if (items.length < 6) ctx.fail("screen-blueprints.json must include at least six key screen blueprints");
    for (const blueprint of items) {
      for (const field of ["conversionPurpose", "userMoment", "visualJob", "composition", "componentHierarchy"]) {
        if (!blueprint[field]) ctx.fail(`Screen blueprint '${blueprint.pageId ?? blueprint.templateKey ?? "(unknown)"}' must include ${field}`);
      }
    }
  }

  if (ctx.exists("outputs/design/stitch-global-brief.md")) {
    const globalBrief = ctx.readText("outputs/design/stitch-global-brief.md");
    for (const heading of ["Product Context", "Global Visual Direction", "Global Avoid List"]) {
      if (!globalBrief.includes(heading)) ctx.fail(`stitch-global-brief.md must include section '${heading}'`);
    }
    if (globalBrief.trim().length < 1200) {
      ctx.fail("stitch-global-brief.md is too thin; it must define a shared visual system for all Stitch screens");
    }
  }

  if (ctx.exists("outputs/design/stitch-prompts.json")) {
    const stitchPrompts = ctx.readJson("outputs/design/stitch-prompts.json");
    const screens = Array.isArray(stitchPrompts.screens) ? stitchPrompts.screens : [];
    const requiredKeys = new Set(["entry", "age_group", "single_choice", "multi_choice", "metric_input", "summary", "plan_ready", "paywall"]);
    if (screens.length < 8) ctx.fail("stitch-prompts.json must include at least eight key screen prompts");
    if (!stitchPrompts.sourceGlobalBrief) ctx.fail("stitch-prompts.json must include sourceGlobalBrief");
    for (const key of requiredKeys) {
      if (!screens.some((screen) => screen.key === key)) ctx.fail(`stitch-prompts.json must include '${key}' prompt`);
    }
    for (const screen of screens) {
      const prompt = String(screen.prompt || "");
      for (const section of ["Runtime Contract", "Required Layout", "Required Content", "Page-Specific Visual Notes", "Output Requirement"]) {
        if (!prompt.includes(section)) ctx.fail(`Stitch prompt '${screen.key ?? "(unknown)"}' must include section '${section}'`);
      }
      if (!prompt.includes("Use the global visual direction")) {
        ctx.fail(`Stitch prompt '${screen.key ?? "(unknown)"}' must reference the global visual direction`);
      }
      if (prompt.trim().length < 900) {
        ctx.fail(`Stitch prompt '${screen.key ?? "(unknown)"}' is too thin`);
      }
    }
  }

  if (ctx.exists("outputs/design/design-prompt.md")) {
    const prompt = ctx.readText("outputs/design/design-prompt.md");
    for (const heading of [
      "Product Psychology",
      "Theme Candidate Summary",
      "Color Rationale",
      "Screen By Screen Composition",
      "Image Requirements",
      "Interaction And State Requirements",
      "Boundaries"
    ]) {
      if (!prompt.includes(heading)) ctx.fail(`design-prompt.md must include section '${heading}'`);
    }
    if (prompt.trim().length < 2500) {
      ctx.fail("design-prompt.md is too thin; it must be a full Figma design brief, not a short style summary");
    }
  }

}
