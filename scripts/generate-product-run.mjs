import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { PNG } from "pngjs";

const root = process.cwd();

function ensureDir(dir) {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
}

function write(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(path.join(root, file), content);
}

function writeJson(file, value) {
  write(file, `${JSON.stringify(value, null, 2)}\n`);
}

function readText(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function compactList(items) {
  return items.filter(Boolean).join("\n");
}

function pageCta(page, fallback = "Continue") {
  return page?.ctaLabel || page?.cta || fallback;
}

function optionLabels(page) {
  return Array.isArray(page?.options) ? page.options.map((item) => item.label || item.value).filter(Boolean) : [];
}

function buildStitchGlobalBrief({ product, productProfile, theme, uiStyleRecipe }) {
  const tokens = theme.colorTokens || {};
  return `# Stitch Global Visual Brief

Product: ${product.appName}
App Store URL: ${product.appStoreUrl}

## Product Context
- Category: ${product.category}
- Audience: ${product.audience}
- Target age range: ${productProfile.targetAgeRange}
- Modality: ${productProfile.modalityLabel}
- Core promise: ${product.positioningPromise}
- UI recipe: ${uiStyleRecipe.recipeName} (${uiStyleRecipe.recipeId})

## Global Visual Direction
Use one coherent visual system across all Stitch screens. Do not create page-specific art directions that make the funnel feel like multiple products.

- Emotional tone: ${productProfile.lifeStage === "senior" ? "calm, reassuring, readable, steady, trustworthy" : "direct, supportive, premium, motivating, progress-oriented"}.
- Visual world: ${productProfile.modalityLabel}, credible home or studio context, clear movement, clean lighting, premium Web2App onboarding.
- Primary color: ${tokens.primary}. Use for primary CTAs, active states, progress emphasis, selected cards, countdown actions, and offer selection.
- Background: ${tokens.background}. Keep the canvas quiet and consistent across pages.
- Surface: ${tokens.surface}. Use simple surfaces and avoid card-inside-card nesting.
- Text: ${tokens.text}. Preserve strong contrast and readable hierarchy.
- Accent: ${tokens.accent || tokens.secondary || tokens.primary}. Use sparingly for secondary emphasis only.
- Typography: strong, app-like headings; readable body copy; no cramped text; no negative letter spacing unless the design system explicitly requires it.
- Buttons: large, stable, tappable primary CTA; consistent radius and height across pages.
- Images: realistic, product-relevant, polished, no text/logos/app UI inside generated images.
- Desktop implication: the React runtime remains a vertical web funnel column on a full canvas, not a phone mockup and not a side-by-side sales page.

## Global Avoid List
- Do not remove runtime-critical buttons, inputs, option lists, checkout triggers, or navigation.
- Do not invent unrelated product features.
- Do not use phone mockups.
- Do not create fake payment success states.
- Do not use loud gradients, decorative blobs, or nested card stacks.
- Do not switch to generic green/teal wellness colors unless the global tokens explicitly use them.
- Do not copy reference screenshot colors blindly.
`;
}

function stitchPrompt({ key, page, product, globalBriefPath, contract, layout, content, pageVisualNotes }) {
  return compactList([
    `Design one mobile Web2App ${key} screen for "${product.appName}".`,
    "",
    "This is a Stitch design handoff screen, not final production code.",
    `Use the global visual direction from ${globalBriefPath}. Keep the same visual system as every other Stitch screen in this project.`,
    "",
    "Runtime Contract:",
    ...contract.map((item) => `- ${item}`),
    "",
    "Required Layout:",
    ...layout.map((item) => `- ${item}`),
    "",
    "Required Content:",
    ...content.map((item) => `- ${item}`),
    "",
    "Page-Specific Visual Notes:",
    ...pageVisualNotes.map((item) => `- ${item}`),
    "",
    "Output Requirement:",
    "- Generate one complete mobile screen around 390px wide.",
    "- All required runtime elements must be visually present.",
    "- No phone mockup.",
    "- Do not remove required CTAs, inputs, selectable options, checkout trigger areas, or data-driven sections.",
    "- Do not create a different style from the global visual brief."
  ]);
}

function buildStitchPromptPlan({ product, productProfile, theme, uiStyleRecipe, pages }) {
  const globalBriefPath = "outputs/design/stitch-global-brief.md";
  const globalBrief = buildStitchGlobalBrief({ product, productProfile, theme, uiStyleRecipe });
  const findPage = (predicate) => pages.find(predicate);
  const entry = findPage((page) => page.id === "entry" || page.pageType === "entry_page");
  const ageGroup = findPage((page) => page.id === "age_group");
  const singleChoice = findPage((page) => page.pageType === "single_choice_page" && page.id !== "age_group");
  const multiChoice = findPage((page) => page.pageType === "multi_choice_page");
  const intro = findPage((page) => page.pageType === "intro_page");
  const metric = findPage((page) => ["height_input_page", "weight_input_page", "age_input_page"].includes(page.pageType));
  const summary = findPage((page) => page.pageType === "summary_page");
  const planGeneration = findPage((page) => page.pageType === "plan_generation_page");
  const planReady = findPage((page) => page.pageType === "plan_ready_page");
  const paywall = findPage((page) => page.pageType === "paywall_page");
  const login = findPage((page) => page.pageType === "login_page");
  const profile = findPage((page) => page.pageType === "account_page" || page.pageType === "subscription_manage_page");

  const promptItems = [];
  const addPrompt = (item) => {
    if (item.page || item.key === "account_auth_profile") promptItems.push(item);
  };

  addPrompt({
    key: "entry",
    page: entry,
    pageType: "entry_page",
    pageId: entry?.id || "entry",
    required: true,
    prompt: stitchPrompt({
      key: "ENTRY / PORTAL",
      page: entry,
      product,
      globalBriefPath,
      contract: [
        `Must include primary CTA labeled "${pageCta(entry, "Get started")}".`,
        "Must include a login action for returning users.",
        "Must include product/brand name.",
        "Must include one large hero image slot.",
        "Get started begins a fresh tab-scoped funnel session; do not design it as account creation."
      ],
      layout: [
        "Full-screen or first-viewport portal composition.",
        "Brand and login action near the top.",
        "Hero image dominates the page without being trapped inside a decorative card.",
        "Primary CTA is easy to reach and visually dominant."
      ],
      content: [
        `Headline should communicate: ${product.positioningPromise}`,
        "Use concise supporting copy; do not overload the first screen.",
        "No app store badges or fake app UI."
      ],
      pageVisualNotes: [
        "Make the product feel real immediately through imagery.",
        "If text overlays image, add contrast treatment for readability."
      ]
    })
  });

  addPrompt({
    key: "age_group",
    page: ageGroup,
    pageType: "single_choice_page",
    pageId: ageGroup?.id || "age_group",
    required: true,
    prompt: stitchPrompt({
      key: "AGE GROUP IMAGE CHOICE",
      page: ageGroup,
      product,
      globalBriefPath,
      contract: [
        "Must include exactly four selectable age-group option cards.",
        "Each option card must include one image slot and one visible label.",
        "Selecting the first real answer triggers anonymous identity creation in runtime; do not add extra CTA requirements unless the page contract says so.",
        "Runtime needs stable option areas; do not merge the four choices into one image."
      ],
      layout: [
        "Top navigation/progress area.",
        "Centered title.",
        "2x2 image card grid on mobile.",
        "Legal/privacy hint may appear below the grid if needed."
      ],
      content: [
        `Title: ${ageGroup?.title || "Choose your age group"}.`,
        `Options: ${optionLabels(ageGroup).join(", ") || productProfile.ageGroups.map((group) => group.label).join(", ")}.`
      ],
      pageVisualNotes: [
        "Images should show clear age difference and consistent crop/style.",
        "The page should feel visual and low friction."
      ]
    })
  });

  addPrompt({
    key: "single_choice",
    page: singleChoice,
    pageType: "single_choice_page",
    pageId: singleChoice?.id || "single_choice_template",
    required: true,
    prompt: stitchPrompt({
      key: "STANDARD SINGLE CHOICE",
      page: singleChoice,
      product,
      globalBriefPath,
      contract: [
        "Must include a single-choice option list.",
        "Single choice may auto-advance in runtime; do not require a bottom CTA unless explicitly present.",
        "Each option must have a clear selected state.",
        "Icons are optional and must not look forced."
      ],
      layout: [
        "Top navigation/progress area.",
        "Centered title and optional subtitle.",
        "Vertical option rhythm with stable tap targets.",
        "No unnecessary footer controls."
      ],
      content: [
        `Example title: ${singleChoice?.title || "What is your main goal?"}.`,
        `Example options: ${optionLabels(singleChoice).slice(0, 5).join(", ") || "3-5 concise product-specific answers"}.`
      ],
      pageVisualNotes: [
        "Keep this template reusable across many generated OB questions.",
        "Use layout quality, spacing, and selected state to create differentiation without changing logic."
      ]
    })
  });

  addPrompt({
    key: "multi_choice",
    page: multiChoice,
    pageType: "multi_choice_page",
    pageId: multiChoice?.id || "multi_choice_template",
    required: true,
    prompt: stitchPrompt({
      key: "STANDARD MULTI CHOICE",
      page: multiChoice,
      product,
      globalBriefPath,
      contract: [
        "Must include a multi-choice option list.",
        "Must include bottom primary CTA.",
        "CTA must have enabled and disabled visual states.",
        "Runtime requires at least one selected option unless configured otherwise.",
        "Do not use tiny right-side circles as the only selected-state signal."
      ],
      layout: [
        "Top navigation/progress area.",
        "Centered title and subtitle like 'Choose all that apply'.",
        "Scrollable option area if options exceed viewport.",
        "Bottom CTA remains stable."
      ],
      content: [
        `Example title: ${multiChoice?.title || "Where should we focus?"}.`,
        `Example options: ${optionLabels(multiChoice).slice(0, 6).join(", ") || "4-6 concise product-specific answers"}.`,
        `CTA: ${pageCta(multiChoice)}.`
      ],
      pageVisualNotes: [
        "Selected options should feel tactile and obvious.",
        "Option icons are optional; do not force decorative iconography."
      ]
    })
  });

  addPrompt({
    key: "intro_transition",
    page: intro,
    pageType: "intro_page",
    pageId: intro?.id || "intro_template",
    required: true,
    prompt: stitchPrompt({
      key: "INTRO / TRANSITION",
      page: intro,
      product,
      globalBriefPath,
      contract: [
        "Must include one contextual image slot.",
        "Must include headline, supportive paragraph, and bottom primary CTA.",
        "This page collects no input.",
        "CTA advances to the next OB page."
      ],
      layout: [
        "Top navigation/progress area.",
        "4:3 image near the top or upper-middle.",
        "Headline and paragraph below image.",
        "Bottom CTA aligned with other runtime buttons."
      ],
      content: [
        `Example headline: ${intro?.title || "Your plan should match your starting point"}.`,
        "Paragraph should be long enough to build trust but not become an article.",
        `CTA: ${pageCta(intro)}.`
      ],
      pageVisualNotes: [
        "Use this as a trust bridge between sections.",
        "Do not add fake input controls."
      ]
    })
  });

  addPrompt({
    key: "metric_input",
    page: metric,
    pageType: metric?.pageType || "metric_input_template",
    pageId: metric?.id || "metric_input_template",
    required: true,
    prompt: stitchPrompt({
      key: "METRIC INPUT",
      page: metric,
      product,
      globalBriefPath,
      contract: [
        "Must include large numeric input display.",
        "Must include sliding unit switch.",
        "Height supports ft/in and cm; weight supports lb and kg.",
        "Runtime performs real-time unit conversion and validation.",
        "Must include bottom CTA.",
        "Validation warning appears only when user enters out-of-range value."
      ],
      layout: [
        "Top navigation/progress area.",
        "Centered title.",
        "Unit switch directly below title.",
        "Large numeric input in the center.",
        "Optional support/insight card below input.",
        "Bottom CTA."
      ],
      content: [
        `Example title: ${metric?.title || "How tall are you?"}.`,
        "Do not include consent copy unless explicitly required.",
        `CTA: ${pageCta(metric)}.`
      ],
      pageVisualNotes: [
        "Numeric value must look visually centered.",
        "Unit switch selected pill uses global primary color."
      ]
    })
  });

  addPrompt({
    key: "summary",
    page: summary,
    pageType: "summary_page",
    pageId: summary?.id || "summary",
    required: true,
    prompt: stitchPrompt({
      key: "SUMMARY / ANALYSIS",
      page: summary,
      product,
      globalBriefPath,
      contract: [
        "Must include BMI visualization with user marker.",
        "Must include computed profile rows from previous answers.",
        "Must include one body-state image slot.",
        "Must include one insight card.",
        "Must include bottom primary CTA.",
        "Runtime supplies BMI, fitness level, focus, goal change, and body image."
      ],
      layout: [
        "Top navigation/progress area.",
        "Large centered summary heading.",
        "BMI scale near the top.",
        "Profile rows and body image in a balanced layout.",
        "Insight card below.",
        "Bottom CTA."
      ],
      content: [
        `Title: ${summary?.title || "Summary of your fitness level"}.`,
        "Use placeholder computed values, but make data-binding areas clear.",
        `CTA: ${pageCta(summary)}.`
      ],
      pageVisualNotes: [
        "Make it obvious that the plan uses previous answers.",
        "Avoid shame framing; keep analysis supportive."
      ]
    })
  });

  addPrompt({
    key: "plan_generation",
    page: planGeneration,
    pageType: "plan_generation_page",
    pageId: planGeneration?.id || "plan_generation",
    required: true,
    prompt: stitchPrompt({
      key: "PLAN GENERATION",
      page: planGeneration,
      product,
      globalBriefPath,
      contract: [
        "Must include circular progress/loading visualization.",
        "Must include status text under the progress.",
        "Must support modal yes/no follow-up questions over the current page.",
        "Must include rotating social proof or feedback area.",
        "Users must answer follow-up questions when shown; do not design them as passive saved chips."
      ],
      layout: [
        "Progress visualization centered near the top.",
        "Status text below progress.",
        "Feedback/proof area below.",
        "Follow-up question appears as a modal overlay with backdrop."
      ],
      content: [
        `Main status: ${planGeneration?.title || "Creating your plan"}.`,
        "Follow-up answers are simple yes/no or check/cross style.",
        "Keep copy short and believable."
      ],
      pageVisualNotes: [
        "Animation will be implemented in React; Stitch should define visual style and hierarchy.",
        "Do not add too many modules."
      ]
    })
  });

  addPrompt({
    key: "plan_ready",
    page: planReady,
    pageType: "plan_ready_page",
    pageId: planReady?.id || "plan_ready",
    required: true,
    prompt: stitchPrompt({
      key: "PLAN READY / PREDICTION",
      page: planReady,
      product,
      globalBriefPath,
      contract: [
        "Must include a personalized plan-ready headline.",
        "Must include target date text.",
        "Must include animated trend chart design with at most five points.",
        "Chart must support weight loss, weight gain, and maintenance states.",
        "Must include bottom primary CTA."
      ],
      layout: [
        "Top navigation/progress area.",
        "Headline and concise supporting copy.",
        "Target weight/date callout.",
        "Chart section.",
        "Bottom CTA."
      ],
      content: [
        `Title: ${planReady?.title || "Your personalized plan is ready"}.`,
        "Use month plus year labels when timeline crosses years.",
        `CTA: ${pageCta(planReady)}.`
      ],
      pageVisualNotes: [
        "Chart labels and points must align visually.",
        "Avoid decorative clutter behind chart icons."
      ]
    })
  });

  addPrompt({
    key: "paywall",
    page: paywall,
    pageType: "paywall_page",
    pageId: paywall?.id || "paywall",
    required: true,
    prompt: stitchPrompt({
      key: "PAYWALL",
      page: paywall,
      product,
      globalBriefPath,
      contract: [
        "Must include sticky offer countdown at top.",
        "Must include primary CTA labeled 'GET MY PLAN' or 'Get my plan'.",
        "Must include body comparison with two image slots: Now and Goal.",
        "Must include API-driven offer list with selectable plan cards.",
        "Plan cards must visually support title, current price, original price with strikethrough, daily price, selected state, and optional badge.",
        "Must include legal disclosure below CTA.",
        "Must include app screenshot carousel section.",
        "Must include user feedback cards.",
        "Must include guarantee or secure payment reassurance.",
        "Checkout form is not displayed inline; runtime opens a full-screen checkout route/modal."
      ],
      layout: [
        "Vertical layout only.",
        "Countdown bar at top.",
        "Body comparison near top.",
        "Personalized headline and brief promise.",
        "Offer list before first CTA.",
        "CTA immediately after offer list.",
        "Proof, carousel, feedback, guarantee, FAQ/legal below.",
        "No side-by-side desktop sales layout."
      ],
      content: [
        "Use placeholder offers, but preserve data-driven plan card areas.",
        "Use placeholder feedback matching product audience and gender.",
        "Do not include promo code module unless explicitly configured."
      ],
      pageVisualNotes: [
        "Avoid boxes nested inside boxes.",
        "Make the purchase section clear, premium, and trustworthy."
      ]
    })
  });

  addPrompt({
    key: "account_auth_profile",
    page: login || profile,
    pageType: "account_template",
    pageId: "account_auth_profile",
    required: true,
    prompt: stitchPrompt({
      key: "ACCOUNT / LOGIN / PROFILE",
      page: login || profile,
      product,
      globalBriefPath,
      contract: [
        "Must define a simple login screen style.",
        "Must define a simple account creation style.",
        "Must define a profile/subscription management style.",
        "Profile must support ID, email, subscription status, period end date, and cancel subscription action.",
        "Payment success routes to account creation; homepage login routes to login/profile."
      ],
      layout: [
        "Flat, simple form layout.",
        "No redundant top title if page heading is enough.",
        "Profile uses clean rows, not nested cards.",
        "Cancel subscription action is visible but not visually dominant."
      ],
      content: [
        "Login fields: email and password.",
        "Account creation fields: email and password.",
        "Profile rows: ID, email, subscription status, valid until."
      ],
      pageVisualNotes: [
        "Keep it calm and utilitarian.",
        "Match the same global visual system without becoming a marketing page."
      ]
    })
  });

  return {
    globalBrief,
    prompts: {
      version: "0.6.0",
      product: product.appName,
      sourceGlobalBrief: globalBriefPath,
      designProvider: "stitch",
      rule: "Global visual direction is shared by all pages. Page prompts define only runtime contract, required layout, required content, and page-specific notes.",
      screens: promptItems
    },
    promptsMarkdown: `# Stitch Page Prompts\n\nGlobal brief: ${globalBriefPath}\n\n${promptItems
      .map((item, index) => `## ${index + 1}. ${item.key}\n- Page type: ${item.pageType}\n- Page id: ${item.pageId}\n- Required: ${item.required ? "yes" : "no"}\n\n\`\`\`text\n${item.prompt}\n\`\`\`\n`)
      .join("\n")}`
  };
}

function parseProductBrief() {
  const raw = readText("inputs/product-brief.md");
  const name = raw.match(/Product name:\s*(.+)/i)?.[1]?.trim() || "Web2App Product";
  const url = raw.match(/App Store URL:\s*(.+)/i)?.[1]?.trim() || "";
  const targetAge = raw.match(/Target age override:\s*(.+)/i)?.[1]?.trim() || "";
  const audienceOverride = raw.match(/Audience override:\s*(.+)/i)?.[1]?.trim() || "";
  const id = url.match(/id(\d+)/)?.[1] || "";
  return { name, url, id, targetAge, audienceOverride };
}

function parseDepth() {
  const raw = fs.existsSync(path.join(root, "inputs/funnel-requirements.md"))
    ? readText("inputs/funnel-requirements.md")
    : "";
  return raw.match(/Preferred funnel depth:\s*(\w+)/i)?.[1]?.toLowerCase() || "auto";
}

function inferProductProfile(inputProduct) {
  const text = `${inputProduct.name} ${inputProduct.url} ${inputProduct.targetAge} ${inputProduct.audienceOverride}`.toLowerCase();
  const isWomen = /\bwomen\b|female|for women/.test(text);
  const isMen = /\bmen\b|male|muscle|max|military/.test(text) && !isWomen;
  const isSenior = /senior|seniors|older|easy|chair/.test(text);
  const isChair = /chair/.test(text);
  const isTaiChi = /tai\s*chi|taichi/.test(text);
  const isYoga = /yoga/.test(text);
  const isPilates = /pilates/.test(text);
  const isCalisthenics = /calisthenics|military|bodyweight|muscle|max/.test(text);
  const isChairStrength = isChair && (isMen || /muscle|strength|workout|fitness/.test(text)) && !isYoga && !isTaiChi;

  const genderFocus = isWomen ? "female" : isMen ? "male" : "neutral";
  const lifeStage = isSenior ? "senior" : "adult";
  const modality = isTaiChi
    ? "tai_chi"
    : isChairStrength
      ? "chair_strength"
      : isYoga
      ? "yoga"
      : isPilates
        ? "pilates"
        : isCalisthenics
          ? "calisthenics"
          : "fitness";

  const modalityLabel = {
    tai_chi: "tai chi mobility",
    chair_strength: "chair strength",
    yoga: isChair ? "chair yoga" : "yoga",
    pilates: "pilates",
    calisthenics: "bodyweight strength",
    fitness: "home fitness",
  }[modality];

  const audienceBase =
    lifeStage === "senior"
      ? "older adults and beginners who need gentle, confidence-building sessions"
      : genderFocus === "male"
        ? "men who want structured, no-equipment training and visible strength progress"
        : genderFocus === "female"
          ? "women who want an approachable plan for fitness, body confidence, and consistency"
          : "beginners and returning exercisers who want a practical home plan";

  const promise =
    modality === "chair_strength"
      ? "Build a chair-based strength plan around comfort, current ability, schedule, and target progress."
      : modality === "calisthenics"
      ? "Build a disciplined bodyweight plan around current strength, schedule, and target progress."
      : modality === "tai_chi"
        ? "Create a calm, low-impact movement plan that supports balance, mobility, and daily confidence."
        : modality === "yoga"
          ? "Create a steady, accessible routine that supports mobility, comfort, and consistency."
          : modality === "pilates"
            ? "Create a low-friction plan for core strength, posture, and visible body progress."
            : "Create a personalized home fitness plan around goal, body baseline, and schedule.";

  const ageStrategy = inferAgeStrategy({
    text,
    targetAgeOverride: inputProduct.targetAge,
    audienceOverride: inputProduct.audienceOverride,
    lifeStage,
    genderFocus,
    modality,
  });

  return {
    genderFocus,
    lifeStage,
    modality,
    modalityLabel,
    targetAgeRange: ageStrategy.range,
    ageRangeSource: ageStrategy.source,
    ageRangeEvidence: ageStrategy.evidence,
    ageGroups: ageStrategy.groups,
    category: `${modalityLabel}, web2app onboarding, personalized subscription plan`,
    audience: `${audienceBase}.`,
    promise,
  };
}

function inferAgeStrategy({ text, targetAgeOverride, audienceOverride, lifeStage, genderFocus, modality }) {
  const explicitRange = parseExplicitAgeRange(targetAgeOverride) || parseExplicitAgeRange(audienceOverride);
  if (explicitRange) {
    return buildAgeStrategy({
      min: explicitRange.min,
      max: explicitRange.max,
      source: "operator_override",
      evidence: `Operator supplied target age '${targetAgeOverride || audienceOverride}'.`,
      lifeStage,
      genderFocus,
      modality,
    });
  }

  const seniorSignal = /senior|seniors|older|elder|chair|low[-\s]?impact|easy|beginner/.test(text);
  const youngAdultSignal = /military|calisthenics|max|bodyweight|hiit/.test(text) || (/muscle|strength/.test(text) && !/chair/.test(text));
  const womenWeightLossSignal = /women|female|lose weight|weight loss|slim|tone/.test(text);

  if (seniorSignal) {
    return buildAgeStrategy({
      min: /chair|easy/.test(text) ? 55 : 50,
      max: 85,
      source: "product_analysis",
      evidence: "Product name or audience signals seniors, chair/easy movement, low-impact exercise, or older beginners.",
      lifeStage,
      genderFocus,
      modality,
    });
  }

  if (youngAdultSignal && genderFocus === "male") {
    return buildAgeStrategy({
      min: 18,
      max: 50,
      source: "product_analysis",
      evidence: "Product name signals male-oriented strength, military, calisthenics, muscle, or bodyweight training.",
      lifeStage,
      genderFocus,
      modality,
    });
  }

  if (womenWeightLossSignal) {
    return buildAgeStrategy({
      min: 18,
      max: 55,
      source: "product_analysis",
      evidence: "Product name signals women-focused weight loss, toning, or body-confidence onboarding.",
      lifeStage,
      genderFocus,
      modality,
    });
  }

  return buildAgeStrategy({
    min: 18,
    max: 55,
    source: "default_product_analysis",
    evidence: "No narrow age evidence was found, so the workflow uses a broad adult consumer fitness range.",
    lifeStage,
    genderFocus,
    modality,
  });
}

function parseExplicitAgeRange(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const rangeMatch = raw.match(/(\d{1,3})\s*(?:-|to|~|–|—)\s*(\d{1,3})\+?/i);
  if (rangeMatch) {
    const min = Number(rangeMatch[1]);
    const max = Number(rangeMatch[2]);
    if (isValidAgeBound(min) && isValidAgeBound(max) && max > min) return { min, max };
  }
  const plusMatch = raw.match(/(\d{1,3})\s*\+/);
  if (plusMatch) {
    const min = Number(plusMatch[1]);
    if (isValidAgeBound(min)) return { min, max: Math.min(90, min + 30) };
  }
  return null;
}

function isValidAgeBound(value) {
  return Number.isFinite(value) && value >= 13 && value <= 95;
}

function buildAgeStrategy({ min, max, source, evidence, lifeStage, genderFocus, modality }) {
  const clampedMin = Math.max(13, Math.min(95, Math.round(min)));
  const clampedMax = Math.max(clampedMin + 12, Math.min(95, Math.round(max)));
  return {
    range: `${clampedMin}-${clampedMax}${clampedMax >= 85 ? "+" : ""}`,
    source,
    evidence,
    groups: splitAgeRangeIntoFourGroups({
      min: clampedMin,
      max: clampedMax,
      openEndedLast: clampedMax >= 55,
      lifeStage,
      genderFocus,
      modality,
    }),
  };
}

function splitAgeRangeIntoFourGroups({ min, max, openEndedLast = true, lifeStage, genderFocus, modality }) {
  const span = max - min + 1;
  const bucketSize = Math.max(5, Math.ceil(span / 4));
  const groups = [];
  let start = min;
  for (let index = 0; index < 4; index += 1) {
    const isLast = index === 3;
    const end = isLast ? max : Math.min(max - (3 - index) * bucketSize, start + bucketSize - 1);
    const safeEnd = Math.max(start, end);
    const value = isLast && openEndedLast
      ? `${start}_plus`
      : `${start}_${safeEnd}`;
    const label = isLast && openEndedLast
      ? `Age: ${start}+`
      : `Age: ${start}-${safeEnd}`;
    groups.push({
      value,
      label,
      minAge: start,
      maxAge: isLast && openEndedLast ? null : safeEnd,
      imageSubject: subjectForAgeGroup(index, { lifeStage, genderFocus, modality, minAge: start, maxAge: safeEnd, openEnded: isLast && openEndedLast }),
      differentiationRequirement: ageDifferentiation(index, { minAge: start, maxAge: safeEnd, openEnded: isLast && openEndedLast }),
    });
    start = safeEnd + 1;
  }
  return groups;
}

function subjectForAgeGroup(index, { lifeStage, genderFocus, minAge, maxAge, openEnded }) {
  const ethnicities = ["Asian", "Black", "White", "Latino or mixed-race"];
  const genderWord = genderFocus === "male" ? "man" : genderFocus === "female" ? "woman" : "person";
  const ageText = openEnded ? `${minAge}+` : `${minAge}-${maxAge}`;
  const seniorTone = lifeStage === "senior" ? "active older adult" : "adult";
  return `${ethnicities[index]} ${seniorTone} ${genderWord}, age ${ageText}`;
}

function ageDifferentiation(index, { minAge, maxAge, openEnded }) {
  const label = openEnded ? `${minAge}+` : `${minAge}-${maxAge}`;
  const notes = [
    "youngest bracket; visibly early adult energy without looking underage",
    "second bracket; adult styling distinct from the youngest group",
    "third bracket; mature adult styling with visible age difference",
    "oldest bracket; clearly older appearance while still capable and confident",
  ];
  return `${notes[index]} for ${label}.`;
}

function option(value, label, icon = "Circle", extra = {}) {
  return { value, label, icon, ...extra };
}

function readRecipe(fileName) {
  return JSON.parse(fs.readFileSync(path.join(root, "style-recipes", fileName), "utf8"));
}

function buildUiStyleRecipe(profile, product) {
  const gentle = isGentleProfile(profile);
  const chairStrength = /chair/i.test(product.appName) && profile.genderFocus === "male";
  const muscleButLowImpact = /muscle|strength/i.test(product.appName) && gentle;
  let recipeFile = "lifestyle-companion.json";
  let secondaryInfluence = null;
  let reason = "The product is broad lifestyle or habit-oriented, so the lifestyle companion recipe is the safest base.";
  let confidence = "medium";

  if (chairStrength || muscleButLowImpact) {
    recipeFile = "calm-wellness.json";
    secondaryInfluence = "hard_training";
    reason =
      "The product is male and strength-oriented, but chair-based and low-impact signals make safety, clarity, and senior-friendly movement the dominant design need.";
    confidence = "high";
  } else if (profile.lifeStage === "senior" || profile.modality === "tai_chi" || profile.modality === "yoga" || profile.modality === "chair_strength") {
    recipeFile = "calm-wellness.json";
    reason = "The product emphasizes gentle movement, mobility, balance, yoga, tai chi, or senior-friendly support.";
    confidence = "high";
  } else if (profile.modality === "calisthenics" || profile.genderFocus === "male") {
    recipeFile = "hard-training.json";
    reason = "The product emphasizes male-oriented strength, calisthenics, military fitness, muscle building, or disciplined training.";
    confidence = "high";
  } else if (profile.genderFocus === "female") {
    recipeFile = "energetic-fitness.json";
    reason = "The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation.";
    confidence = "high";
  }

  const recipe = readRecipe(recipeFile);
  const selected = {
    ...recipe,
    recipeMode: secondaryInfluence ? "preset_with_overrides" : "selected_preset",
    secondaryInfluence,
    selection: {
      ...recipe.selection,
      source: "product_strategy",
      reason,
      confidence,
      productEvidence: [
        `Product name: ${product.appName}.`,
        `Detected modality: ${profile.modalityLabel}.`,
        `Detected audience: ${profile.audience}`,
        `Detected life stage: ${profile.lifeStage}.`,
        `Detected gender focus: ${profile.genderFocus}.`,
        secondaryInfluence ? `Secondary influence: ${secondaryInfluence}.` : "No secondary influence needed.",
      ],
    },
  };

  if (secondaryInfluence === "hard_training") {
    selected.visualTone = {
      ...selected.visualTone,
      keywords: Array.from(new Set([...selected.visualTone.keywords, "steady strength", "masculine clarity", "practical discipline"])),
      avoid: Array.from(new Set([...selected.visualTone.avoid, "too soft yoga spa look", "young gym aggression"])),
      differentiationGoal:
        "Balance calm senior-friendly movement with enough strength and masculine clarity that the product does not feel like generic yoga.",
    };
    selected.globalTokens = {
      ...selected.globalTokens,
      primary: "#3F6652",
      surfaceContainer: "#ECE8DE",
      surfaceContainerHigh: "#DFD8CB",
      secondary: "#5D645C",
      muted: "#888E86",
    };
    selected.mediaSystem = {
      ...selected.mediaSystem,
      personStyle: "approachable older or middle-aged man with steady confident posture",
      backgroundTreatment: "clean home interior or minimal training room with chair support when relevant",
    };
    selected.paywallSystem = {
      ...selected.paywallSystem,
      primaryEmphasis: "safe strength, joint-friendly consistency, and steady muscle support",
      testimonialTreatment: "credible older-male progress and comfort reviews",
    };
  }

  return selected;
}

function darkenHex(hex, factor = 0.8) {
  const parsed = String(hex || "").trim().match(/^#?([0-9a-f]{6})$/i);
  if (!parsed) return hex;
  const parts = parsed[1].match(/.{2}/g).map((value) => Math.max(0, Math.min(255, Math.round(parseInt(value, 16) * factor))));
  return `#${parts.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function luminance(hex) {
  const parsed = String(hex || "").trim().match(/^#?([0-9a-f]{6})$/i);
  if (!parsed) return 1;
  const [r, g, b] = parsed[1].match(/.{2}/g).map((v) => parseInt(v, 16) / 255);
  const [lr, lg, lb] = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function plainBackgroundForTheme(theme) {
  const bg = theme.colorTokens.background;
  if (luminance(bg) < 0.42) {
    return {
      kind: "dark",
      label: "perfectly plain solid black #050505",
      prompt:
        "Perfectly plain solid black background (#050505). No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, no environmental scene.",
      negative:
        "no white background, no pale background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
    };
  }
  return {
    kind: "light",
    label: "perfectly plain solid white #FFFFFF",
    prompt:
      "Perfectly plain solid white background (#FFFFFF). No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, no environmental scene.",
    negative:
      "no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
  };
}

async function buildAppStoreVisualEvidence(inputProduct, profile, recipe) {
  const appId = inputProduct.id || inputProduct.url.match(/id(\d+)/)?.[1] || "";
  if (!appId) {
    return {
      usable: false,
      sourceType: "app_store_visual_evidence",
      reason: "No App Store id was available for color extraction.",
      candidates: []
    };
  }

  try {
    const lookupUrl = `https://itunes.apple.com/lookup?id=${appId}&country=us`;
    const response = await fetch(lookupUrl);
    if (!response.ok) throw new Error(`lookup returned ${response.status}`);
    const payload = await response.json();
    const result = payload?.results?.[0];
    if (!result) throw new Error("lookup returned no result");

    const imageSources = [
      result.artworkUrl512 ? { role: "icon", url: result.artworkUrl512, weight: 3 } : null,
      result.artworkUrl100 ? { role: "icon_small", url: result.artworkUrl100, weight: 2 } : null,
      ...(result.screenshotUrls ?? []).slice(0, 3).map((url, index) => ({ role: `screenshot_${index + 1}`, url, weight: 1 })),
    ].filter(Boolean);

    const candidates = [];
    for (const source of imageSources) {
      const localPath = await downloadAppStoreVisualSource(source.url, appId, source.role);
      const colors = extractProminentColors(localPath).map((color) => ({
        ...color,
        sourceRole: source.role,
        sourceWeight: source.weight,
        score: Number((color.score * source.weight).toFixed(4)),
      }));
      candidates.push(...colors);
    }

    const ranked = candidates
      .filter((color) => isUsableBrandColor(color.hex))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    const selected = ranked[0] ?? null;
    const background = deriveBackgroundFromRecipeAndPrimary(recipe.globalTokens.background, selected?.hex);
    const adjustedPrimary = selected
      ? ensureReadablePrimary(selected.hex, background)
      : null;

    const evidence = {
      usable: Boolean(adjustedPrimary),
      sourceType: "app_store_visual_evidence",
      appStoreId: appId,
      lookupUrl,
      selectedPrimary: adjustedPrimary,
      rawSelectedPrimary: selected?.hex ?? null,
      background,
      confidence: selected ? Math.min(0.94, Math.max(0.68, Number((0.62 + selected.score / 7).toFixed(2)))) : 0,
      evidence: selected
        ? `Primary color ${adjustedPrimary} was extracted from App Store ${selected.sourceRole} visual evidence for ${inputProduct.name}. Raw extracted color was ${selected.hex}; sampled candidates were filtered for saturation, neutrality, and readability.`
        : `No usable saturated App Store brand color was found for ${inputProduct.name}; falling back to UI recipe.`,
      reason: selected ? "Usable App Store visual color found." : "No usable App Store visual color found after filtering.",
      candidates: ranked,
      extractedAt: new Date().toISOString(),
    };

    writeJson("outputs/design/app-store-visual-evidence.json", evidence);
    return evidence;
  } catch (error) {
    const evidence = {
      usable: false,
      sourceType: "app_store_visual_evidence",
      reason: error instanceof Error ? error.message : String(error),
      appStoreId: appId,
      candidates: [],
      extractedAt: new Date().toISOString(),
    };
    writeJson("outputs/design/app-store-visual-evidence.json", evidence);
    return evidence;
  }
}

async function downloadAppStoreVisualSource(url, appId, role) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${role} image returned ${response.status}`);
  const dir = path.join(root, "outputs/design/app-store-visuals");
  fs.mkdirSync(dir, { recursive: true });
  const sourceExt = extensionFromUrl(url) ?? "jpg";
  const sourcePath = path.join(dir, `${appId}-${role}.${sourceExt}`);
  const pngPath = path.join(dir, `${appId}-${role}.png`);
  fs.writeFileSync(sourcePath, Buffer.from(await response.arrayBuffer()));
  if (sourceExt === "png") return sourcePath;
  const converted = spawnSync("sips", ["-s", "format", "png", sourcePath, "--out", pngPath], {
    encoding: "utf8",
    stdio: "pipe",
  });
  if (converted.status !== 0 || !fs.existsSync(pngPath)) {
    throw new Error(`Could not convert ${role} image to PNG: ${converted.stderr || converted.stdout}`);
  }
  return pngPath;
}

function extractProminentColors(filePath) {
  const png = PNG.sync.read(fs.readFileSync(filePath));
  const buckets = new Map();
  const step = Math.max(1, Math.floor(Math.sqrt((png.width * png.height) / 14000)));
  for (let y = 0; y < png.height; y += step) {
    for (let x = 0; x < png.width; x += step) {
      const index = (png.width * y + x) << 2;
      const alpha = png.data[index + 3];
      if (alpha < 220) continue;
      const r = png.data[index];
      const g = png.data[index + 1];
      const b = png.data[index + 2];
      if (isNearWhiteOrBlack(r, g, b) || isLikelySkinTone(r, g, b)) continue;
      const key = `${Math.round(r / 16) * 16},${Math.round(g / 16) * 16},${Math.round(b / 16) * 16}`;
      const existing = buckets.get(key) ?? { r: 0, g: 0, b: 0, count: 0 };
      existing.r += r;
      existing.g += g;
      existing.b += b;
      existing.count += 1;
      buckets.set(key, existing);
    }
  }

  return [...buckets.values()]
    .map((bucket) => {
      const r = Math.round(bucket.r / bucket.count);
      const g = Math.round(bucket.g / bucket.count);
      const b = Math.round(bucket.b / bucket.count);
      const hex = rgbToHex(r, g, b);
      const hsl = rgbToHsl(r, g, b);
      const score = bucket.count * (0.4 + hsl.saturation) * (1 - Math.abs(hsl.lightness - 0.48) * 0.8);
      return {
        hex,
        count: bucket.count,
        saturation: Number(hsl.saturation.toFixed(3)),
        lightness: Number(hsl.lightness.toFixed(3)),
        score: Number(score.toFixed(4)),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

function isUsableBrandColor(hex) {
  const { saturation, lightness } = hslFromHex(hex);
  if (saturation < 0.18) return false;
  if (lightness < 0.14 || lightness > 0.88) return false;
  return true;
}

function ensureReadablePrimary(hex, background) {
  const targetContrast = 3.2;
  let current = hex;
  let tries = 0;
  while (contrastRatio(current, background) < targetContrast && tries < 8) {
    current = luminance(background) > 0.5 ? darkenHex(current, 0.84) : lightenHex(current, 0.14);
    tries += 1;
  }
  return current;
}

function deriveBackgroundFromRecipeAndPrimary(recipeBackground, primary) {
  if (!primary) return recipeBackground;
  const primaryLum = luminance(primary);
  if (primaryLum < 0.18) return "#F6F3EE";
  return recipeBackground;
}

function applyAppStorePaletteToRecipe(recipe, evidence) {
  if (!evidence?.usable || !evidence.selectedPrimary) return recipe;
  return {
    ...recipe,
    selection: {
      ...recipe.selection,
      source: "app_store_visual_evidence",
      productEvidence: [
        ...(recipe.selection.productEvidence ?? []),
        evidence.evidence,
      ],
    },
    globalTokens: {
      ...recipe.globalTokens,
      primary: evidence.selectedPrimary,
      secondary: mutedFromPrimary(evidence.selectedPrimary),
      surfaceContainer: softSurfaceFromPrimary(evidence.selectedPrimary, evidence.background),
      surfaceContainerHigh: softSurfaceFromPrimary(evidence.selectedPrimary, evidence.background, 0.18),
      background: evidence.background,
    },
    appStoreVisualEvidence: evidence,
  };
}

function isNearWhiteOrBlack(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max > 242 || max < 28 || (max - min < 10 && (max > 214 || max < 64));
}

function isLikelySkinTone(r, g, b) {
  return r > 95 && g > 40 && b > 20 && r > g && g > b && r - b > 35 && Math.max(r, g, b) - Math.min(r, g, b) > 25;
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function hslFromHex(hex) {
  const parsed = String(hex || "").trim().match(/^#?([0-9a-f]{6})$/i);
  if (!parsed) return { hue: 0, saturation: 0, lightness: 1 };
  const [r, g, b] = parsed[1].match(/.{2}/g).map((value) => parseInt(value, 16));
  return rgbToHsl(r, g, b);
}

function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const lightness = (max + min) / 2;
  const delta = max - min;
  let hue = 0;
  let saturation = 0;
  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (max === rn) hue = ((gn - bn) / delta) % 6;
    else if (max === gn) hue = (bn - rn) / delta + 2;
    else hue = (rn - gn) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  return { hue, saturation, lightness };
}

function contrastRatio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

function lightenHex(hex, amount = 0.12) {
  const parsed = String(hex || "").trim().match(/^#?([0-9a-f]{6})$/i);
  if (!parsed) return hex;
  const parts = parsed[1].match(/.{2}/g).map((value) => {
    const n = parseInt(value, 16);
    return Math.max(0, Math.min(255, Math.round(n + (255 - n) * amount)));
  });
  return `#${parts.map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function mutedFromPrimary(hex) {
  const parsed = String(hex || "").trim().match(/^#?([0-9a-f]{6})$/i);
  if (!parsed) return "#5D645C";
  const [r, g, b] = parsed[1].match(/.{2}/g).map((value) => parseInt(value, 16));
  return rgbToHex(
    Math.round(r * 0.45 + 96 * 0.55),
    Math.round(g * 0.45 + 96 * 0.55),
    Math.round(b * 0.45 + 96 * 0.55)
  );
}

function softSurfaceFromPrimary(hex, background, amount = 0.1) {
  const parsed = String(hex || "").trim().match(/^#?([0-9a-f]{6})$/i);
  const bg = String(background || "#F6F3EE").trim().match(/^#?([0-9a-f]{6})$/i);
  if (!parsed || !bg) return "#ECE8DE";
  const p = parsed[1].match(/.{2}/g).map((value) => parseInt(value, 16));
  const b = bg[1].match(/.{2}/g).map((value) => parseInt(value, 16));
  return rgbToHex(
    Math.round(p[0] * amount + b[0] * (1 - amount)),
    Math.round(p[1] * amount + b[1] * (1 - amount)),
    Math.round(p[2] * amount + b[2] * (1 - amount))
  );
}

function extensionFromUrl(url) {
  const clean = String(url).split("?")[0];
  const match = clean.match(/\.([a-z0-9]+)$/i);
  const ext = match?.[1]?.toLowerCase();
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) return ext === "jpeg" ? "jpg" : ext;
  return "jpg";
}

const inputProduct = parseProductBrief();
const depthMode = parseDepth() === "auto" ? "deep" : parseDepth();
const productId = slugify(inputProduct.name);
const productProfile = inferProductProfile(inputProduct);
const product = {
  appName: inputProduct.name,
  appStoreUrl: inputProduct.url,
  appStoreId: inputProduct.id,
  appCode: "oog126_dev",
  placementCode: "O2MGB",
  category: productProfile.category,
  audience: productProfile.audience,
  positioningPromise: productProfile.promise,
  profile: productProfile,
};
const ageGroups = productProfile.ageGroups;
const targetAgeMin = ageGroups[0]?.minAge ?? 18;
const lastAgeGroup = ageGroups[ageGroups.length - 1] ?? {};
const targetAgeMax = lastAgeGroup.maxAge ?? Math.min(95, (lastAgeGroup.minAge ?? 46) + 20);
const targetAgeDefault = Math.round((targetAgeMin + targetAgeMax) / 2);
const capabilityPlan = buildCapabilityPlan(productProfile);
let uiStyleRecipe = buildUiStyleRecipe(productProfile, product);
const appStoreVisualEvidence = await buildAppStoreVisualEvidence(inputProduct, productProfile, uiStyleRecipe);
if (appStoreVisualEvidence?.usable) {
  uiStyleRecipe = applyAppStorePaletteToRecipe(uiStyleRecipe, appStoreVisualEvidence);
}

const theme = {
  version: "0.5.0",
  styleSystem: "runtime_style_recipe",
  styleRecipeRef: "outputs/design/ui-style-recipe.json",
  product: product.appName,
  rationale:
    `${uiStyleRecipe.recipeName} was selected because ${uiStyleRecipe.selection.reason} The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable.`,
  primaryColorDecision: {
    sourceType: appStoreVisualEvidence?.usable ? "app_store_visual_evidence" : uiStyleRecipe.selection.source,
    evidence: appStoreVisualEvidence?.usable
      ? appStoreVisualEvidence.evidence
      : uiStyleRecipe.selection.productEvidence.join(" "),
    audienceFit:
      appStoreVisualEvidence?.usable
        ? `The extracted App Store color is adjusted through the selected ${uiStyleRecipe.recipeName} recipe so it keeps the product's audience fit: ${productProfile.audience}.`
        : `The audience profile is ${productProfile.audience}. The palette should support this context without blindly copying reference screenshot colors.`,
    confidence: appStoreVisualEvidence?.usable
      ? appStoreVisualEvidence.confidence
      : uiStyleRecipe.selection.confidence === "high" ? 0.86 : uiStyleRecipe.selection.confidence === "medium" ? 0.72 : 0.55,
    fallbackPolicy:
      "Use App Store icon/screenshot color when it is saturated, non-neutral, and readable after contrast adjustment. If extraction fails or produces weak neutral colors, fall back to the selected UI recipe while preserving runtime component hierarchy.",
    extractedPalette: appStoreVisualEvidence ?? null,
  },
  colorTokens: {
    background: uiStyleRecipe.globalTokens.background,
    surface: uiStyleRecipe.globalTokens.surface,
    surfaceSoft: uiStyleRecipe.globalTokens.surfaceContainer,
    surfaceAlt: uiStyleRecipe.globalTokens.surfaceContainer,
    text: uiStyleRecipe.globalTokens.text,
    mutedText: uiStyleRecipe.globalTokens.secondary,
    muted: uiStyleRecipe.globalTokens.muted,
    primary: uiStyleRecipe.globalTokens.primary,
    primaryDark: darkenHex(uiStyleRecipe.globalTokens.primary, 0.78),
    primarySoft: uiStyleRecipe.globalTokens.surfaceContainerHigh,
    accent: uiStyleRecipe.globalTokens.accent ?? uiStyleRecipe.globalTokens.secondary,
    success: "#2D7D61",
    warning: "#F0A43A",
    danger: uiStyleRecipe.globalTokens.error,
    border: uiStyleRecipe.globalTokens.outline,
    disabled: "#B5BEC8",
    info: uiStyleRecipe.globalTokens.surfaceContainerHigh,
  },
  colorSystem: {
    background: uiStyleRecipe.globalTokens.background,
  },
  typography: {
    fontFamily: uiStyleRecipe.typography.fontFamily,
    headingWeight: uiStyleRecipe.typography.headingWeight,
    bodyWeight: uiStyleRecipe.typography.bodyWeight,
    letterSpacing: "0",
    headingTone: uiStyleRecipe.typography.headingTone,
    titleScale: uiStyleRecipe.typography.titleScale,
    bodyScale: uiStyleRecipe.typography.bodyScale,
  },
  shape: {
    controlRadius: uiStyleRecipe.shape.optionRadius,
    cardRadius: uiStyleRecipe.shape.cardRadius,
    buttonRadius: uiStyleRecipe.shape.buttonRadius,
    imageRadius: uiStyleRecipe.shape.imageRadius,
  },
  layout: {
    mobileFirst: true,
    desktop: "Centered vertical web funnel column on a full web canvas. Do not use a phone mockup or left-right split layout.",
    radius: uiStyleRecipe.shape.cardRadius,
    contentMaxWidth: uiStyleRecipe.spacing.contentMaxWidth,
    desktopContentMaxWidth: uiStyleRecipe.spacing.desktopContentMaxWidth,
  },
  styleRecipe: {
    recipeId: uiStyleRecipe.recipeId,
    recipeName: uiStyleRecipe.recipeName,
    recipeMode: uiStyleRecipe.recipeMode,
    secondaryInfluence: uiStyleRecipe.secondaryInfluence ?? null,
  },
};

const sections = {
  my_profile: { label: "Profile", order: 1 },
  goals: { label: "Goals", order: 2 },
  training: { label: "Training", order: 3 },
  body: { label: "Body", order: 4 },
  routine: { label: "Routine", order: 5 },
  motivation: { label: "Motivation", order: 6 },
  result: { label: "Plan", order: 7 },
};

function buildCapabilityPlan(profile) {
  const gentle = isGentleProfile(profile);
  const strength = profile.modality === "calisthenics" || profile.modality === "chair_strength";
  const routineName = routineLabel(profile);
  const planName = planLabel(profile);

  const capabilities = [
    capability({
      id: "goal_discovery",
      stage: "goals",
      sectionId: "goals",
      pageType: "single_choice_page",
      dataKey: "mainGoal",
      title: "What is your main goal?",
      variant: "plain_list",
      requiredFor: ["summary", "plan_personalization", "paywall_bridge"],
      reason: "Anchor the user's desired transformation so the generated plan and paywall promise feel personal.",
      options: gentle
        ? [
            option("move_with_less_discomfort", "Move with less discomfort", "HeartPulse"),
            option("improve_balance", "Improve balance", "Scale"),
            option("stay_active", "Stay active at home", "Home"),
            option("feel_more_flexible", "Feel more flexible", "Sparkles"),
          ]
        : [
            option("build_strength", "Build strength", "Dumbbell"),
            option("lose_fat", "Lose fat", "Flame"),
            option("look_more_defined", "Look more defined", "Activity"),
            option("build_discipline", "Build discipline", "Target"),
          ],
    }),
    capability({
      id: "body_focus",
      stage: "goals",
      sectionId: "goals",
      pageType: "multi_choice_page",
      dataKey: "focusAreas",
      title: gentle ? "Where do you want the most support?" : "Which areas should we focus on?",
      subtitle: "Choose all that apply",
      variant: "plain_list",
      minSelections: 1,
      requiredFor: ["plan_personalization", "summary", "paywall_bridge"],
      reason: "Identify visible or felt problem areas so the plan can claim relevance before the paywall.",
      visualDecision: {
        required: false,
        visualType: "agent_optional_question_image",
        reason: "Use a question-level image only when the generated question benefits from body-area or movement context.",
      },
      options: gentle
        ? [
            option("back_comfort", "Back comfort", "HeartPulse"),
            option("hips_legs", "Hips and legs", "Footprints"),
            option("shoulders_neck", "Shoulders and neck", "Activity"),
            option("balance", "Balance confidence", "Scale"),
            option("daily_stiffness", "Morning stiffness", "Sun"),
          ]
        : [
            option("chest", "Chest", "Badge"),
            option("arms", "Arms", "Dumbbell"),
            option("core", "Core", "CircleDot"),
            option("legs", "Legs", "Footprints"),
            option("full_body", "Full body", "Activity"),
          ],
    }),
    capability({
      id: "goal_trust_bridge",
      stage: "goals",
      sectionId: "goals",
      pageType: "intro_page",
      role: "trust_bridge",
      title: gentle ? "Small steps can still create visible progress" : "Your goal gives the plan direction",
      subtitle: "The next answers help us make it realistic.",
      body: gentle
        ? "A useful plan should feel calm, repeatable, and specific to your daily movement. We will use your answers to keep the pace comfortable while still moving you forward."
        : "A strong plan is not just harder exercises. It needs the right starting point, the right schedule, and a progression you can keep repeating.",
      ctaLabel: "Continue",
      assetRequirement: { required: true, assetType: "intro_hero" },
      trustPurpose: "Turn the user's goal into confidence that the generated plan will be specific and realistic.",
      requiredFor: ["trust_building", "section_transition"],
      reason: "Pause after early goal answers to convert raw answers into belief that a personalized plan is being built.",
    }),
    capability({
      id: "experience_level",
      stage: "training",
      sectionId: "training",
      pageType: "single_choice_page",
      dataKey: "fitnessLevel",
      title: `How familiar are you with ${profile.modalityLabel}?`,
      variant: "plain_list",
      requiredFor: ["plan_difficulty", "summary", "paywall_bridge"],
      reason: "Set starting difficulty and reduce the risk that the generated plan feels too easy or too hard.",
      options: gentle
        ? [option("new", "I am new to this"), option("some", "I have tried it before"), option("steady", "I already practice sometimes")]
        : [option("beginner", "Beginner"), option("returning", "Returning after a break"), option("intermediate", "Intermediate"), option("advanced", "Advanced")],
    }),
    capability({
      id: "training_readiness",
      stage: "training",
      sectionId: "training",
      pageType: "single_choice_page",
      dataKey: "capabilityLevel",
      title: gentle ? "What pace feels right today?" : strength ? "How strong is your current baseline?" : "What is your current starting level?",
      variant: "plain_list",
      requiredFor: ["plan_difficulty", "plan_generation", "risk_reduction"],
      reason: "Capture readiness so the plan can start credibly and avoid overpromising intensity.",
      options: gentle
        ? [option("very_gentle", "Very gentle"), option("steady", "Steady and simple"), option("ready", "I can do a little more")]
        : [option("low", "I need a simple start"), option("medium", "I can handle a challenge"), option("high", "Push me harder")],
    }),
    capability({
      id: "current_activity",
      stage: "training",
      sectionId: "training",
      pageType: "single_choice_page",
      dataKey: "activeLevel",
      title: gentle ? "How much movement feels normal right now?" : "How active are you now?",
      variant: "plain_list",
      requiredFor: ["plan_pacing", "summary", "paywall_bridge"],
      reason: "Estimate current activity baseline to shape pacing and make the result page feel earned.",
      options: [
        option("not_active", "Not active"),
        option("light", "Light movement sometimes"),
        option("moderate", "I move a few days a week"),
        option("high", "I already stay active"),
      ],
    }),
    capability({
      id: "blockers",
      stage: "training",
      sectionId: "training",
      pageType: "multi_choice_page",
      dataKey: "barriers",
      title: gentle ? "What makes it harder to stay active?" : "What usually gets in your way?",
      subtitle: "Choose all that apply",
      variant: "plain_list",
      minSelections: 1,
      requiredFor: ["objection_handling", "paywall_bridge", "plan_adherence"],
      reason: "Collect the objections the paywall and plan-ready pages need to answer before asking for payment.",
      options: gentle
        ? [
            option("stiffness", "Stiffness"),
            option("low_energy", "Low energy"),
            option("balance_worry", "Balance concerns"),
            option("no_routine", "No steady routine"),
            option("motivation", "Motivation comes and goes"),
          ]
        : [
            option("no_time", "No time"),
            option("low_motivation", "Low motivation"),
            option("too_hard", "Plans feel too hard"),
            option("no_plan", "I do not know what to do"),
            option("slow_results", "Results feel too slow"),
          ],
    }),
    capability({
      id: "limitations",
      stage: "body",
      sectionId: "body",
      pageType: "multi_choice_page",
      dataKey: "limitations",
      title: "Any areas that need extra care?",
      subtitle: "Choose all that apply",
      variant: "plain_list",
      minSelections: 1,
      requiredFor: ["plan_safety", "plan_personalization", "trust_building"],
      reason: "Ask for constraints before body metrics so the product feels careful, not generic.",
      options: gentle
        ? [option("knees", "Knees"), option("back", "Back"), option("hips", "Hips"), option("shoulders", "Shoulders"), option("none", "No special limitations")]
        : [option("wrists", "Wrists"), option("shoulders", "Shoulders"), option("back", "Back"), option("knees", "Knees"), option("none", "No special limitations")],
    }),
    capability({
      id: "routine_trust_bridge",
      stage: "routine",
      sectionId: "routine",
      pageType: "intro_page",
      role: "trust_bridge",
      title: "Your routine should fit your real week",
      subtitle: "Consistency matters more than a perfect schedule.",
      body: `Most people stop because the ${routineName} plan asks for a version of their week that does not exist. We will use your schedule to shape a ${planName} that feels easier to repeat.`,
      ctaLabel: "Continue",
      assetRequirement: { required: true, assetType: "intro_hero" },
      trustPurpose: "Reframe routine constraints as inputs that make the generated plan easier to follow.",
      requiredFor: ["trust_building", "section_transition"],
      reason: "Transition from body/training answers into schedule questions without making the flow feel like a survey.",
    }),
    capability({
      id: "time_budget",
      stage: "routine",
      sectionId: "routine",
      pageType: "single_choice_page",
      dataKey: "dailyTime",
      title: "How much time feels realistic?",
      variant: "plain_list",
      requiredFor: ["plan_schedule", "paywall_bridge"],
      reason: "Make the plan feel immediately usable by matching session length to the user's real day.",
      options: [option("10", "10 minutes"), option("15", "15 minutes"), option("20", "20 minutes"), option("25", "25 minutes")],
    }),
    capability({
      id: "weekly_frequency",
      stage: "routine",
      sectionId: "routine",
      pageType: "single_choice_page",
      dataKey: "weeklyFrequency",
      title: "How many days per week can you commit?",
      variant: "plain_list",
      requiredFor: ["plan_schedule", "plan_generation"],
      reason: "Turn motivation into a concrete schedule variable that can be shown back in plan-ready copy.",
      options: [option("2_3", "2-3 days"), option("4_5", "4-5 days"), option("6_7", "6-7 days")],
    }),
    capability({
      id: "preferred_time",
      stage: "routine",
      sectionId: "routine",
      pageType: "single_choice_page",
      dataKey: "preferredTime",
      title: "When would you prefer to practice?",
      variant: "plain_list",
      requiredFor: ["plan_schedule", "adherence_copy"],
      reason: "Collect a lightweight adherence signal so plan copy can feel more concrete.",
      options: [option("morning", "Morning"), option("afternoon", "Afternoon"), option("evening", "Evening"), option("varies", "It changes")],
    }),
    capability({
      id: "energy_level",
      stage: "routine",
      sectionId: "routine",
      pageType: "single_choice_page",
      dataKey: "energyLevel",
      title: gentle ? "How does your energy usually feel?" : "How is your energy on most days?",
      variant: "plain_list",
      requiredFor: ["plan_pacing", "difficulty_adjustment"],
      reason: "Use energy level to tune intensity and make the plan feel sensitive to real-life readiness.",
      options: [option("low", "Low"), option("mixed", "It changes"), option("steady", "Steady"), option("high", "High")],
    }),
    capability({
      id: "motivation_reason",
      stage: "motivation",
      sectionId: "motivation",
      pageType: "single_choice_page",
      dataKey: "motivationReason",
      title: "What would make this plan worth it?",
      variant: "plain_list",
      requiredFor: ["paywall_bridge", "plan_ready_copy"],
      reason: "Capture the emotional payoff that can be echoed before checkout.",
      options: gentle
        ? [option("confidence", "Move with more confidence"), option("independence", "Stay independent"), option("comfort", "Feel more comfortable"), option("routine", "Build a calm routine")]
        : [option("confidence", "Feel more confident"), option("discipline", "Build discipline"), option("appearance", "See visible change"), option("health", "Feel healthier")],
    }),
    capability({
      id: "support_style",
      stage: "motivation",
      sectionId: "motivation",
      pageType: "single_choice_page",
      dataKey: "accountabilityStyle",
      title: "What kind of guidance helps you most?",
      variant: "plain_list",
      requiredFor: ["plan_tone", "retention_copy"],
      reason: "Let the plan promise match the user's preferred coaching style.",
      options: [option("simple", "Simple instructions"), option("encouraging", "Encourage me"), option("progress", "Show progress"), option("challenge", "Challenge me gradually")],
    }),
  ];

  return {
    version: "0.5.0",
    planner: "capability_planner_v1",
    productModality: profile.modality,
    productAudience: {
      genderFocus: profile.genderFocus,
      lifeStage: profile.lifeStage,
      targetAgeRange: profile.targetAgeRange,
    },
    selectionPolicy:
      "Select capabilities by required downstream use first, then write product-specific titles/options for each capability. Capabilities are stable; page copy is product-specific.",
    requiredCoverage: ["summary", "plan_personalization", "paywall_bridge", "plan_schedule", "objection_handling", "trust_building"],
    capabilities,
  };
}

function capability(input) {
  return {
    source: "capability_planner",
    required: true,
    ...input,
  };
}

function isGentleProfile(profile) {
  return profile.lifeStage === "senior" || profile.modality === "tai_chi" || profile.modality === "yoga" || profile.modality === "chair_strength";
}

function routineLabel(profile) {
  return profile.modality === "tai_chi" ? "movement" : profile.modality === "yoga" ? "routine" : profile.modality === "chair_strength" ? "chair workout" : "training";
}

function planLabel(profile) {
  return profile.modality === "calisthenics" || profile.modality === "chair_strength" ? "strength plan" : `${profile.modalityLabel} plan`;
}

function buildBusinessPagesFromCapabilityPlan(profile, capabilityPlan) {
  return capabilityPlan.capabilities.map((capabilityItem) => {
    const pageId = `${profile.modality}_${capabilityItem.id}`;
    return {
      id: pageId,
      capability: capabilityItem.id,
      capabilityStage: capabilityItem.stage,
      capabilityReason: capabilityItem.reason,
      requiredFor: capabilityItem.requiredFor,
      contractUse: buildCapabilityContractUse(capabilityItem),
      ...capabilityItem,
      id: pageId,
    };
  });
}

function buildCapabilityContractUse(capabilityItem) {
  return {
    summary: capabilityItem.requiredFor?.includes("summary") || false,
    planGeneration: capabilityItem.requiredFor?.some((item) => item.startsWith("plan_")) || false,
    paywall: capabilityItem.requiredFor?.includes("paywall_bridge") || false,
    firestore: Boolean(capabilityItem.dataKey),
    analytics: Boolean(capabilityItem.dataKey),
  };
}

function buildFieldContract(pages, capabilityPlan) {
  const capabilityById = new Map(capabilityPlan.capabilities.map((item) => [item.id, item]));
  const fieldPages = pages.filter((page) => page.dataKey);
  const fields = fieldPages.map((page) => {
    const capabilityItem = page.capability ? capabilityById.get(page.capability) : null;
    const requiredFor = page.requiredFor ?? capabilityItem?.requiredFor ?? inferRequiredForFixedPage(page);
    return {
      dataKey: page.dataKey,
      pageId: page.id,
      pageType: page.pageType,
      capability: page.capability ?? fixedCapabilityForPage(page),
      source: page.capability ? "capability_plan" : "fixed_runtime_trunk",
      valueShape: inferValueShape(page),
      requiredFor,
      usedBy: {
        firestore: true,
        analytics: true,
        summary: requiredFor.includes("summary") || ["ageGroup", "ageNum", "height", "currentWeight", "targetWeight"].includes(page.dataKey),
        planGeneration: requiredFor.some((item) => item.startsWith("plan_")) || ["height", "currentWeight", "targetWeight"].includes(page.dataKey),
        paywall: requiredFor.includes("paywall_bridge") || ["ageGroup", "mainGoal", "focusAreas", "currentWeight", "targetWeight"].includes(page.dataKey),
      },
      validation: validationForPage(page),
    };
  });

  return {
    version: "0.5.0",
    productId,
    productName: product.appName,
    contractType: "web2app_runtime_field_contract",
    principle:
      "Questions can be product-specific, but fields must remain stable enough for summary, plan generation, paywall personalization, Firestore, and analytics.",
    fields,
  };
}

function inferRequiredForFixedPage(page) {
  const byId = {
    age_group: ["summary", "plan_personalization", "paywall_bridge"],
    exact_age: ["summary", "plan_personalization", "plan_pacing"],
    height: ["summary", "bmi", "plan_personalization"],
    current_weight: ["summary", "bmi", "plan_personalization", "paywall_bridge"],
    target_weight: ["summary", "goal_delta", "plan_prediction", "paywall_bridge"],
    email: ["lead_capture", "account_recovery"],
    account_create: ["account_creation"],
  };
  return byId[page.id] ?? ["runtime"];
}

function fixedCapabilityForPage(page) {
  const byId = {
    age_group: "age_group",
    exact_age: "exact_age",
    height: "height",
    current_weight: "current_weight",
    target_weight: "target_weight",
    email: "email_capture",
    account_create: "account_create",
  };
  return byId[page.id] ?? "fixed_runtime_field";
}

function inferValueShape(page) {
  if (page.pageType === "multi_choice_page") return "string[]";
  if (page.pageType === "age_input_page") return "number";
  if (page.pageType === "height_input_page") return "height_measurement";
  if (page.pageType === "weight_input_page") return "weight_measurement";
  if (page.pageType === "email_capture_page" || page.dataKey === "email" || page.dataKey === "accountEmail") return "email_string";
  return "string";
}

function validationForPage(page) {
  if (page.pageType === "multi_choice_page") return { minSelections: page.minSelections ?? 1 };
  if (page.pageType === "age_input_page") return { min: page.min, max: page.max };
  if (page.pageType === "height_input_page" || page.pageType === "weight_input_page") {
    return { units: page.units, defaultUnit: page.defaultUnit, min: page.min, max: page.max };
  }
  if (page.pageType === "email_capture_page") return { format: "email" };
  return {};
}

function buildGenerationPrompts(profile) {
  return [
    {
      id: "baseline_confirmation",
      question: profile.lifeStage === "senior" ? "Should we keep the first sessions gentle?" : "Should we start from your current level?",
      yesLabel: "Yes",
      noLabel: "No",
      askAtProgress: 28,
    },
    {
      id: "focus_confirmation",
      question: "Should we prioritize the areas you selected?",
      yesLabel: "Yes",
      noLabel: "No",
      askAtProgress: 56,
    },
    {
      id: "routine_confirmation",
      question: "Should the plan fit your weekly schedule?",
      yesLabel: "Yes",
      noLabel: "No",
      askAtProgress: 82,
    },
  ];
}

function buildTestimonials(profile) {
  if (profile.genderFocus === "male" || profile.modality === "calisthenics" || profile.modality === "chair_strength") {
    return [
      { name: "Marcus", rating: 5, title: "I knew exactly where to start", text: "The plan gave me a clear baseline and made home training feel structured instead of random.", body: "The plan gave me a clear baseline and made home training feel structured instead of random." },
      { name: "Daniel", rating: 5, title: "Good pace for getting stronger", text: "It pushed me without making the first week feel impossible. That made it easier to keep showing up.", body: "It pushed me without making the first week feel impossible. That made it easier to keep showing up." },
      { name: "Ethan", rating: 5, title: "No equipment, no excuses", text: "I liked having simple bodyweight sessions I could do at home and still feel like I was progressing.", body: "I liked having simple bodyweight sessions I could do at home and still feel like I was progressing." },
    ];
  }
  if (profile.lifeStage === "senior") {
    return [
      { name: "Linda", rating: 5, title: "Gentle but useful", text: "The sessions felt calm and easy to follow, and I liked seeing how each step connected to balance and comfort.", body: "The sessions felt calm and easy to follow, and I liked seeing how each step connected to balance and comfort." },
      { name: "Robert", rating: 5, title: "A routine I could repeat", text: "It helped me move a little more every day without feeling rushed or overwhelmed.", body: "It helped me move a little more every day without feeling rushed or overwhelmed." },
      { name: "Mary", rating: 5, title: "Clear and reassuring", text: "I felt guided from the first session. The plan was simple, steady, and realistic for home.", body: "I felt guided from the first session. The plan was simple, steady, and realistic for home." },
    ];
  }
  return [
    { name: "Bella", rating: 5, title: "It finally felt personal", text: "The plan matched my schedule and made the first week feel achievable instead of intimidating.", body: "The plan matched my schedule and made the first week feel achievable instead of intimidating." },
    { name: "Rory", rating: 5, title: "Easy to stay consistent", text: "I liked that the sessions had structure and did not feel like random workouts.", body: "I liked that the sessions had structure and did not feel like random workouts." },
    { name: "Janet", rating: 5, title: "Clear next steps", text: "Seeing a path based on my answers made it easier to commit to the plan.", body: "Seeing a path based on my answers made it easier to commit to the plan." },
  ];
}

function entryCopyForProfile(profile) {
  if (profile.modality === "tai_chi") {
    return {
      title: "Move with calm, balance, and confidence",
      subtitle: "Create a gentle Tai Chi plan shaped around your mobility, comfort, and daily routine.",
    };
  }
  if (profile.modality === "yoga") {
    return {
      title: profile.lifeStage === "senior" ? "Start a gentle routine that fits your body" : "Build a routine you can actually keep",
      subtitle: `Create a personalized ${profile.modalityLabel} plan around your comfort, schedule, and starting point.`,
    };
  }
  if (profile.modality === "pilates") {
    return {
      title: "Shape a Pilates plan around your body",
      subtitle: "Create a focused plan for core strength, posture, and visible progress.",
    };
  }
  if (profile.modality === "calisthenics") {
    return {
      title: "Build strength without guesswork",
      subtitle: "Create a no-equipment calisthenics plan shaped around your body, schedule, and starting level.",
    };
  }
  if (profile.modality === "chair_strength") {
    return {
      title: "Build steady strength from a chair",
      subtitle: "Create a joint-friendly chair workout plan shaped around your comfort, schedule, and starting strength.",
    };
  }
  return {
    title: "Create a plan that fits your starting point",
    subtitle: "Answer a few simple questions so your plan can match your goal, routine, and body profile.",
  };
}

function ageGroupCopyForProfile(profile) {
  if (profile.lifeStage === "senior") {
    return {
      title: "Choose your age range",
      subtitle: "This helps us tune comfort, pacing, balance work, and recovery.",
    };
  }
  if (profile.modality === "calisthenics" || profile.modality === "chair_strength") {
    return {
      title: "Select your age to start",
      subtitle: "This helps tune difficulty, recovery, and weekly progression.",
    };
  }
  return {
    title: "Select your age to start",
    subtitle: "This helps tune recovery, difficulty, and weekly pacing.",
  };
}

function paywallCopyForProfile(profile) {
  if (profile.modality === "tai_chi") {
    return {
      highlights: [
        "Gentle Tai Chi sessions matched to your starting point",
        "Balance and mobility practice you can repeat at home",
        "Short routines shaped around your weekly schedule",
        "Clear guidance for comfort, confidence, and steady movement",
      ],
      faq: [
        { q: "Is this suitable for beginners?", a: "Yes. The plan starts gently and adapts around your comfort, balance, and movement level." },
        { q: "Do I need equipment?", a: "No special equipment is required. You only need enough safe space to move comfortably." },
        { q: "Can I cancel?", a: "Yes. You can manage your subscription from your account page on the website." },
      ],
    };
  }
  if (profile.modality === "yoga") {
    return {
      highlights: [
        `Personalized ${profile.modalityLabel} sessions matched to your starting point`,
        "Comfortable routines built around your schedule",
        "Guidance for mobility, consistency, and confidence",
        "Plan pacing adapted from your onboarding answers",
      ],
      faq: [
        { q: "Is this suitable for beginners?", a: "Yes. The plan adapts around your starting level and comfort." },
        { q: "Do I need equipment?", a: "Most sessions can be done at home with simple space and optional support." },
        { q: "Can I cancel?", a: "Yes. You can manage your subscription from your account page on the website." },
      ],
    };
  }
  if (profile.modality === "chair_strength") {
    return {
      highlights: [
        "Chair-based strength sessions matched to your starting point",
        "Low-impact progressions built around comfort and stability",
        "Short home workouts shaped around your weekly schedule",
        "Clear guidance for strength, confidence, and consistency",
      ],
      faq: [
        { q: "Do I need equipment?", a: "Most sessions use a sturdy chair and simple bodyweight movements you can do at home." },
        { q: "Can beginners use it?", a: "Yes. The plan starts from your current ability and adapts pace around comfort and stability." },
        { q: "Can I cancel?", a: "Yes. You can manage your subscription from your account page on the website." },
      ],
    };
  }
  return {
    highlights: [
      "Personalized no-equipment training plan",
      "Progressions matched to your starting strength",
      "Short sessions built around your schedule",
      "Core, upper-body, and full-body focus options",
    ],
    faq: [
      { q: "Do I need equipment?", a: "Most sessions are built around bodyweight exercises and can be done at home." },
      { q: "Can beginners use it?", a: "Yes. The plan adjusts difficulty based on your starting level and answers." },
      { q: "Can I cancel?", a: "Yes. You can manage your subscription from your account page on the website." },
    ],
  };
}

const pages = [];
function page(input) {
  const meta = sections[input.sectionId] || {};
  pages.push({
    phase: "onboarding",
    sectionId: input.sectionId,
    sectionLabel: meta.label,
    sectionOrder: meta.order,
    conversionPurpose:
      input.conversionPurpose ||
      "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
    personalizationUse:
      input.personalizationUse ||
      "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
    ...input,
  });
}

page({
  id: "entry",
  pageType: "entry_page",
  role: "portal",
  phase: "entry",
  appName: product.appName,
  productName: product.appName,
  title: entryCopyForProfile(productProfile).title,
  subtitle: entryCopyForProfile(productProfile).subtitle,
  ctaLabel: "Get started",
  secondaryCtaLabel: "Log in",
  assetRequirement: { required: true, assetType: "entry_hero" },
  progress: { visible: false },
  conversionPurpose: "Open with the product promise and route new or returning users correctly.",
});

page({
  id: "age_group",
  pageType: "single_choice_page",
  role: "question",
  dataKey: "ageGroup",
  sectionId: "my_profile",
  title: ageGroupCopyForProfile(productProfile).title,
  subtitle: ageGroupCopyForProfile(productProfile).subtitle,
  variant: "image_grid",
  selectionBehavior: "instant_next_after_identity_ready",
  options: ageGroups.map((group) =>
    option(group.value, group.label, "ArrowRightCircle", { assetRequirement: { required: true, assetType: "age_group_option" } })
  ),
  conversionPurpose: "Create anonymous identity after the first real answer and make the start visual and low friction.",
  personalizationUse:
    `Uses the product-specific target age strategy (${productProfile.targetAgeRange}) to tune pacing, recovery, copy tone, imagery, and plan assumptions.`,
});

const fixedProfilePages = [
  {
    id: "exact_age",
    pageType: "age_input_page",
    role: "question",
    dataKey: "ageNum",
    sectionId: "my_profile",
    title: "What is your age?",
    subtitle: "A precise age helps us personalize intensity and recovery.",
    defaultValue: targetAgeDefault,
    min: Math.max(13, targetAgeMin - 5),
    max: Math.min(95, targetAgeMax + 5),
    ctaLabel: "Continue",
  },
];

for (const item of fixedProfilePages) page(item);

for (const item of buildBusinessPagesFromCapabilityPlan(productProfile, capabilityPlan)) {
  page({ role: item.role || "question", ...item });
}

const fixedMeasurementAndLeadPages = [
  {
    id: "height",
    pageType: "height_input_page",
    role: "question",
    dataKey: "height",
    sectionId: "body",
    title: "How tall are you?",
    measurementType: "height",
    units: ["ft", "cm"],
    defaultUnit: "cm",
    defaultValue: { cm: 175, ft: 5, in: 9 },
    min: { cm: 120, ftTotalInches: 48 },
    max: { cm: 230, ftTotalInches: 91 },
    designOverride: { unitInteraction: "real_time_unit_conversion" },
    ctaLabel: "Continue",
  },
  {
    id: "current_weight",
    pageType: "weight_input_page",
    role: "question",
    dataKey: "currentWeight",
    sectionId: "body",
    title: "What is your current weight?",
    measurementType: "current_weight",
    units: ["lbs", "kg"],
    defaultUnit: "kg",
    defaultValue: { kg: 82, lbs: 181 },
    min: { kg: 25, lbs: 55 },
    max: { kg: 300, lbs: 661 },
    showBmiCard: true,
    designOverride: { unitInteraction: "real_time_unit_conversion_and_bmi_recalculate" },
    ctaLabel: "Continue",
  },
  {
    id: "target_weight",
    pageType: "weight_input_page",
    role: "question",
    dataKey: "targetWeight",
    sectionId: "body",
    title: "What is your target weight?",
    measurementType: "target_weight",
    units: ["lbs", "kg"],
    defaultUnit: "kg",
    defaultValue: { kg: 76, lbs: 168 },
    min: { kg: 25, lbs: 55 },
    max: { kg: 300, lbs: 661 },
    showGoalCard: true,
    designOverride: { unitInteraction: "real_time_unit_conversion_and_goal_change_recalculate" },
    ctaLabel: "Continue",
  },
  {
    id: "email",
    pageType: "email_capture_page",
    role: "lead_capture",
    dataKey: "email",
    sectionId: "result",
    title: "Where should we send your plan?",
    subtitle: "Use an email you can access later.",
    ctaLabel: "Continue",
    conversionPurpose: "Capture email before plan reveal and bind the plan to the user identity.",
  },
];

for (const item of fixedMeasurementAndLeadPages) page(item);

const resultPages = [
  {
    id: "summary",
    pageType: "summary_page",
    role: "personalized_result",
    phase: "result",
    sectionId: "result",
    title: "Summary of your fitness level",
    ctaLabel: "Continue",
    assetRequirement: { required: true, assetType: "summary_body_set" },
    progress: { visible: false },
    conversionPurpose: "Show that the user's answers are being used before monetization.",
  },
  {
    id: "plan_generation",
    pageType: "plan_generation_page",
    role: "plan_generation",
    phase: "result",
    sectionId: "result",
    title: `Creating your ${productProfile.modalityLabel} plan`,
    subtitle: "Matching your baseline, goal, and weekly schedule.",
    progressSteps: ["Analyzing", "Personalizing", "Finalizing"],
    generationPrompts: buildGenerationPrompts(productProfile),
    generationTestimonials: buildTestimonials(productProfile).map(({ name, title, body, text }) => ({ name, title, body: body || text })),
    progress: { visible: false },
    conversionPurpose: "Use a smooth loading moment, required follow-up answers, and rotating proof to increase perceived personalization.",
  },
  {
    id: "plan_ready",
    pageType: "plan_ready_page",
    role: "plan_ready",
    phase: "result",
    sectionId: "result",
    title: "Your personalized plan is ready",
    subtitle: "A structured path built around your starting point.",
    ctaLabel: "Continue",
    progress: { visible: false },
    conversionPurpose: "Reveal the expected path and move into monetization with confidence.",
  },
  {
    id: "paywall",
    pageType: "paywall_page",
    role: "monetization",
    phase: "paywall",
    title: "Unlock your personalized plan",
    subtitle: "Start with a plan shaped around your goal, body profile, and schedule.",
    ctaLabel: "Get my plan",
    paymentProvider: "stripe",
    stripePublishableKeyEnv: "VITE_STRIPE_PUBLISHABLE_KEY",
    productSource: "billing_resolve_offers",
    placementCode: product.placementCode,
    lpid: product.placementCode,
    resultPreview: {
      headline: `Your personalized ${productProfile.modalityLabel} plan is ready`,
      targetWeightLabel: "Target",
      fitnessLevelLabel: "Fitness level",
    },
    plans: [
      { id: "starter", productId: "mock_starter", label: "4-week starter", price: "$14.99", billingPeriod: "First plan phase" },
      { id: "twelve_week", productId: "mock_twelve_week", label: "12-week plan", price: "$29.99", billingPeriod: "Recommended" },
    ],
    highlights: paywallCopyForProfile(productProfile).highlights,
    testimonials: buildTestimonials(productProfile).map(({ name, rating, text }) => ({ name, rating, text })),
    faq: paywallCopyForProfile(productProfile).faq,
    moneyBackGuarantee: "30-day money-back guarantee if the plan does not feel like a fit.",
    renewalDisclosure:
      "By clicking GET MY PLAN, I agree to start the selected subscription. It renews automatically until canceled in my account before the next billing cycle.",
    legalLinks: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
    ],
    progress: { visible: false },
    assetRequirement: { required: true, assetType: "paywall_result_comparison" },
    conversionPurpose: "Convert users with personalized proof, real offers, Stripe checkout, app screenshots, and subscription reassurance.",
  },
  {
    id: "payment_success",
    pageType: "payment_success_page",
    role: "payment_success",
    phase: "paid",
    title: "Payment confirmed",
    subtitle: "Create your account to keep access to your plan.",
    ctaLabel: "Create account",
    milestone: "payment_verified",
    commitPhase: "paid",
    progress: { visible: false },
  },
  {
    id: "account_create",
    pageType: "account_create_page",
    role: "account_create",
    phase: "account",
    dataKey: "accountEmail",
    title: "Create your account",
    subtitle: "Save your plan and subscription access.",
    ctaLabel: "Create account",
    progress: { visible: false },
  },
  {
    id: "login",
    pageType: "login_page",
    role: "login",
    phase: "account",
    title: "Log in",
    subtitle: "Access your plan and subscription.",
    ctaLabel: "Log in",
    progress: { visible: false },
  },
  {
    id: "profile",
    pageType: "account_page",
    role: "account_overview",
    phase: "account",
    title: "Profile",
    subtitle: "Your plan and subscription.",
    subscriptionDataSources: ["subscriptionStatus", "subscriptionList", "entitlements"],
    progress: { visible: false },
  },
];

for (const item of resultPages) page(item);

const questionTypes = new Set([
  "single_choice_page",
  "multi_choice_page",
  "age_input_page",
  "height_input_page",
  "weight_input_page",
  "measurement_picker_page",
]);
const counted = pages.filter((item) => item.phase === "onboarding" && questionTypes.has(item.pageType) && item.dataKey);
for (const [index, item] of counted.entries()) {
  item.progress = {
    visible: true,
    countsTowardTotal: true,
    scope: "ob_questions",
    step: index + 1,
    total: counted.length,
    showStepCount: true,
  };
}
for (const item of pages) {
  if (!item.progress) item.progress = { visible: item.phase === "onboarding", countsTowardTotal: false, showStepCount: false };
}

const config = {
  version: "0.5.0",
  product,
  theme,
  lifecycle: {
    storage: "sessionStorage",
    startBehavior: "get_started_clears_current_session_and_creates_new_visitor",
    navigationPolicy: "do_not_stage_lock_urls; reset_to_entry_when_root_url_has_no_page_param",
  },
  backendIntegration: {
    apiBaseUrlEnv: "VITE_BILLING_API_BASE_URL",
    appCodeEnv: "VITE_BILLING_APP_CODE",
    appCodeDefault: product.appCode,
    placementCodeEnv: "VITE_BILLING_PLACEMENT_CODE",
    placementCodeDefault: product.placementCode,
    identityMode: "backend_custom_token_firebase_web_sdk",
    storageScope: "sessionStorage",
    firebaseAuthPersistence: "browserSessionPersistence",
    anonymousIdentityTrigger: "first_real_ob_answer_input",
    accountLoginMode: "backend_email_password_login",
    subscriptionManagementMode: "backend_subscription_management",
    firestore: {
      enabled: true,
      answerCollectionDefault: "test",
      answerDocumentId: "uid",
      answerDocumentShape: "flat_user_answers_only",
    },
    endpoints: {
      anonymous: "POST /billing/{appCode}/v1/users/anonymous",
      currentUser: "POST /billing/{appCode}/v1/users/current",
      login: "POST /billing/{appCode}/v1/users/login",
      registerFromAnonymous: "POST /billing/{appCode}/v1/users/register-from-anonymous",
      resolveOffers: "GET /billing/{appCode}/v1/paywalls/resolve/offers?placementCode={placementCode}&discountType={discountType}",
      stripeEmbeddedCheckout: "POST /billing/{appCode}/v1/checkout/stripe/embedded-session",
      subscriptions: "GET /billing/{appCode}/v1/subscriptions?uid={uid}",
      cancelSubscription: "POST /billing/{appCode}/v1/subscriptions/cancel",
    },
  },
  pages,
};

const background = plainBackgroundForTheme(theme);
const subjectPhrase =
  productProfile.genderFocus === "male"
    ? "adult man"
    : productProfile.genderFocus === "female"
      ? "adult woman"
      : "adult person";
const movementPhrase =
  productProfile.modality === "tai_chi"
    ? "gentle Tai Chi movement"
    : productProfile.modality === "chair_strength"
      ? "controlled chair-supported strength movement"
    : productProfile.modality === "yoga"
      ? "accessible yoga movement"
      : productProfile.modality === "pilates"
        ? "controlled Pilates movement"
        : productProfile.modality === "calisthenics"
          ? "controlled no-equipment bodyweight training"
          : "guided home fitness movement";
const introPages = pages.filter((item) => item.pageType === "intro_page" && item.phase === "onboarding");
const imageSlots = [
  {
    id: "entry.hero",
    pageId: "entry",
    kind: "entry_hero",
    sourcePolicy: "generate",
    count: 1,
    aspectRatio: "16:9",
    displayRole: "Full-bleed portal hero for the first page.",
    backgroundPolicy: "Photoreal lifestyle background, no transparency needed.",
    styleConsistency: `Premium editorial ${productProfile.modalityLabel} photography, trustworthy and approachable.`,
    promptBrief:
      `Create one premium hero image for a ${productProfile.modalityLabel} web funnel. Show one ${subjectPhrase} doing ${movementPhrase} in a bright minimal home or studio setting. Confident, approachable, no text, no logos, no app UI.`,
    negativePrompt: "No words, logos, devices, UI screens, weapons, camouflage uniform, injuries, dark gritty scene, or crowded gym.",
    runtimeUsage: "EntryPage hero background.",
  },
  {
    id: "age_group.options",
    pageId: "age_group",
    kind: "age_group_option_set",
    sourcePolicy: "generate",
    count: 4,
    aspectRatio: "4:3",
    displayRole: "Four option images for age-group selection.",
    backgroundPolicy: `${background.prompt} Keep the backdrop simple, seamless, and consistent across all four age option images.`,
    styleConsistency:
      "Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences.",
    promptBrief:
      `Create four separate half-body portraits for age selection in a ${productProfile.modalityLabel} funnel on a ${background.label} studio background. The product target age range is ${productProfile.targetAgeRange}, chosen by ${productProfile.ageRangeSource}. The four options are: ${ageGroups.map((group) => `${group.label} (${group.imageSubject})`).join("; ")}. Each person wears tasteful movement-friendly clothes and has a confident friendly posture. No text, no logo.`,
    negativePrompt: `No full scenes, no text, no numbers, no labels, no duplicated face across age groups, no childlike appearance, no sexualized pose, ${background.negative}.`,
    runtimeUsage: "age_group option cards.",
    items: ageGroups.map((group) => ({
      id: `age_group.${group.value}`,
      optionValue: group.value,
      label: group.label,
      visualBrief: `${group.imageSubject}, half-body, product-relevant, confident, tasteful movement-friendly clothes.`,
      differentiationRequirement: group.differentiationRequirement,
    })),
  },
  ...introPages.map((introPage) => ({
    id: `${introPage.id}.hero`,
    pageId: introPage.id,
    kind: "intro_hero",
    sourcePolicy: "generate",
    count: 1,
    aspectRatio: "4:3",
    displayRole: "Large contextual image for an intro or transition page.",
    backgroundPolicy: "Natural light training scene; no transparent requirement.",
    styleConsistency: `Same premium ${productProfile.modalityLabel} campaign style across intro images.`,
    promptBrief:
      `Create a 4:3 premium ${productProfile.modalityLabel} image for an intro page titled "${introPage.title}". Show one ${subjectPhrase} in a clean modern home or studio context doing or preparing for ${movementPhrase}. The image should support this message: ${introPage.body || introPage.subtitle || product.positioningPromise}. No text, no logos, no app UI.`,
    negativePrompt: "No words, logos, phones, screenshots, weapons, camouflage, injuries, or crowded gym.",
    runtimeUsage: `${introPage.id} IntroPage hero image.`,
  })),
  {
    id: "summary.body_set",
    pageId: "summary",
    kind: "summary_body_set",
    sourcePolicy: "edit",
    count: 4,
    aspectRatio: "3:4",
    displayRole: "Body profile visual for summary and paywall before/after comparison.",
    backgroundPolicy: `${background.prompt} Keep the backdrop simple, seamless, and consistent across all four body-state images.`,
    styleConsistency:
      `Same ${subjectPhrase} identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.`,
    promptBrief:
      `Create one respectful 3/4-body studio image of an ${subjectPhrase} in modest movement-friendly wear for a fitness summary body-state set. Crop from head to mid-thigh or just above the knees; do not show full legs or full body. Keep the person front-facing, neutral confident pose, ${background.label} studio background, no text, no logos.`,
    negativePrompt: `No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, ${background.negative}, no busy room.`,
    runtimeUsage: "Summary body visual and paywall Now/Goal comparison.",
    items: [
      { id: "summary.body.normal", optionValue: "normal", label: "Normal", visualBrief: "Base image: healthy normal body composition, 3/4 body crop.", differentiationRequirement: "Neutral body composition, same face and outfit as the whole set." },
      { id: "summary.body.underweight", optionValue: "underweight", label: "Underweight", visualBrief: "Edit same person to underweight body composition, same face and outfit.", differentiationRequirement: "Underweight body composition without shame framing." },
      { id: "summary.body.overweight", optionValue: "overweight", label: "Overweight", visualBrief: "Edit same person to overweight body composition, same face and outfit.", differentiationRequirement: "Overweight body composition without changing face or clothing direction." },
      { id: "summary.body.obese", optionValue: "obese", label: "Obese", visualBrief: "Edit same person to obese body composition, same face and outfit.", differentiationRequirement: "Obese body composition without changing face or clothing direction." },
    ],
  },
  {
    id: "paywall.result_comparison",
    pageId: "paywall",
    kind: "paywall_result_comparison",
    sourcePolicy: "reuse_generated_summary_asset",
    count: 2,
    aspectRatio: "3:4",
    displayRole: "Reuse two summary body images for Now and Goal comparison.",
    backgroundPolicy: "Reuse generated summary body images.",
    styleConsistency: "Same visual identity as summary body image set.",
    promptBrief: "Reuse current and target body-state images from summary.body_set.",
    negativePrompt: "Do not generate a new image for this slot.",
    runtimeUsage: "Paywall Now/Goal comparison block.",
    dependsOn: ["summary.body.overweight", "summary.body.normal"],
  },
  {
    id: "paywall.app_screenshots",
    pageId: "paywall",
    kind: "paywall_app_screenshot_set",
    sourcePolicy: "app_store",
    count: 3,
    aspectRatio: "9:19.5",
    displayRole: "Companion app screenshot carousel inside paywall.",
    backgroundPolicy: "Use real App Store screenshots.",
    styleConsistency: "Use source screenshots from the target App Store listing.",
    promptBrief: `Download the real App Store screenshots for ${product.appName} when available.`,
    negativePrompt: "Do not use AI generation for real app screenshots by default.",
    runtimeUsage: "Paywall app screenshot carousel.",
    appStoreUrl: product.appStoreUrl,
    appStoreId: product.appStoreId,
  },
];

const imagePlan = {
  version: "0.5.0",
  productId,
  productName: product.appName,
  product,
  status: "approved",
  largeImageOnly: true,
  reviewRequired: true,
  generatedLargeImageCount: 11,
  appStoreScreenshotCount: 3,
  slots: imageSlots,
};
const fieldContract = buildFieldContract(pages, capabilityPlan);

writeJson("outputs/strategy/product-brief.json", {
  version: "0.5.0",
  productId,
  productName: product.appName,
  appStoreUrl: product.appStoreUrl,
  appStoreId: product.appStoreId,
  product,
  category: product.category,
  targetAudience: {
    summary: product.audience,
    targetAgeRange: productProfile.targetAgeRange,
    ageRangeSource: productProfile.ageRangeSource,
    ageRangeEvidence: productProfile.ageRangeEvidence,
    ageGroups: productProfile.ageGroups,
    genderFocus: productProfile.genderFocus,
    lifeStage: productProfile.lifeStage,
  },
  corePromise: product.positioningPromise,
  funnelType: "long quiz onboarding into personalized plan, Stripe checkout, account creation, and subscription management.",
  tone: productProfile.lifeStage === "senior" ? "calm, reassuring, clear, premium, supportive." : "direct, supportive, premium, progress-oriented.",
  visualDirection: theme.rationale,
});
write(
  "outputs/strategy/product-brief.md",
  `# Product Brief\n\n- Product: ${product.appName}\n- App Store URL: ${product.appStoreUrl}\n- Category: ${product.category}\n- Audience: ${product.audience}\n- Target age range: ${productProfile.targetAgeRange}\n- Age source: ${productProfile.ageRangeSource}\n- Age evidence: ${productProfile.ageRangeEvidence}\n- Age groups: ${productProfile.ageGroups.map((group) => group.label).join(", ")}\n- Core promise: ${product.positioningPromise}\n- Tone: ${productProfile.lifeStage === "senior" ? "calm, reassuring, clear, premium, supportive" : "direct, supportive, premium, progress-oriented"}\n- Visual direction: ${theme.rationale}\n`
);

writeJson("outputs/skeleton/selected-skeleton.json", {
  version: "0.5.0",
  skeletonId: "generated_profile_plus_fixed_runtime_trunk_v1",
  depthMode,
  depthSource: "inputs/funnel-requirements.md",
  depthReason:
    "Fixed trunk pages provide runtime stability; product-aware generated business modules provide goal, capability, routine, body, and motivation depth.",
  targetAudience: {
    targetAgeRange: productProfile.targetAgeRange,
    ageRangeSource: productProfile.ageRangeSource,
    ageRangeEvidence: productProfile.ageRangeEvidence,
    ageGroups: productProfile.ageGroups,
  },
  targetQuestionPages: "28-36",
  targetTotalPages: "48-65",
  pageCount: pages.length,
  countedObQuestionCount: counted.length,
  sections: Object.entries(sections).map(([id, meta]) => ({ id, ...meta })),
  pages: pages.map((item) => ({ id: item.id, pageType: item.pageType, role: item.role, phase: item.phase, sectionId: item.sectionId })),
});
write(
  "outputs/skeleton/selected-skeleton.md",
  `# Selected Skeleton\n\nGenerated profile plus fixed runtime trunk for ${product.appName}.\n\n- Total pages: ${pages.length}\n- Counted OB question/input pages: ${counted.length}\n- Depth mode: ${depthMode}\n- Target age range: ${productProfile.targetAgeRange}\n- Age groups: ${productProfile.ageGroups.map((group) => group.label).join(", ")}\n- Age evidence: ${productProfile.ageRangeEvidence}\n- Fixed trunk: entry, age group, exact age, height, current weight, target weight, email, summary, plan generation, plan ready, paywall, payment success, account creation, login, profile.\n- Business questions are generated from product profile; they are not reused from a fixed candidate pool.\n- Result/paywall/account pages do not count toward OB progress.\n`
);

writeJson("outputs/capabilities/capability-plan.json", capabilityPlan);
write(
  "outputs/capabilities/capability-plan.md",
  `# Capability Plan\n\n${capabilityPlan.capabilities
    .map((item, index) => `${index + 1}. ${item.id}\n- Page type: ${item.pageType}\n- Data key: ${item.dataKey || "none"}\n- Required for: ${(item.requiredFor ?? []).join(", ")}\n- Reason: ${item.reason}`)
    .join("\n\n")}\n`
);

writeJson("outputs/contracts/field-contract.json", fieldContract);
write(
  "outputs/contracts/field-contract.md",
  `# Field Contract\n\n${fieldContract.fields
    .map((field) => `## ${field.dataKey}\n- Page: ${field.pageId}\n- Capability: ${field.capability}\n- Source: ${field.source}\n- Value shape: ${field.valueShape}\n- Required for: ${field.requiredFor.join(", ")}\n- Used by: ${Object.entries(field.usedBy).filter(([, value]) => value).map(([key]) => key).join(", ")}`)
    .join("\n\n")}\n`
);

writeJson("outputs/page-map/page-map.json", { version: "0.5.0", product, skeletonId: "generated_profile_plus_fixed_runtime_trunk_v1", capabilityPlanId: "capability_planner_v1", pages });
write(
  "outputs/page-map/page-map.md",
  `# Page Map\n\n${pages.map((item, index) => `${index + 1}. ${item.id} - ${item.pageType} - ${item.phase}`).join("\n")}\n`
);

writeJson("outputs/copy/page-copy.json", {
  version: "0.5.0",
  product: product.appName,
  pages: pages.map(({ id, title, subtitle, body, ctaLabel, options }) => ({ id, title, subtitle, body, ctaLabel, options })),
});
write(
  "outputs/copy/page-copy.md",
  `# Page Copy\n\n${pages.map((item) => `## ${item.id}\n${item.title || ""}\n${item.body || item.subtitle || ""}\n`).join("\n")}`
);

writeJson("outputs/design/ui-style-recipe.json", uiStyleRecipe);
writeJson("outputs/design/theme.json", theme);
writeJson("outputs/design/theme-candidates.json", {
  version: "0.5.0",
  productId,
  productName: product.appName,
  selectedCandidateId: uiStyleRecipe.recipeId,
  selectionRationale:
    `${uiStyleRecipe.recipeName} is selected from product profile, audience, modality, and trust needs. It must not blindly reuse category colors or reference screenshot colors.`,
  candidates: [
    {
      id: "hard_training",
      sourceType: "preset",
      primary: readRecipe("hard-training.json").globalTokens.primary,
      background: readRecipe("hard-training.json").globalTokens.background,
      audienceFit: "Best for male strength, military, calisthenics, and higher-intensity muscle products.",
      conversionFit: "Strong for discipline and visible strength, but can be too aggressive for chair-based or low-impact senior flows.",
      selected: uiStyleRecipe.recipeId === "hard_training",
    },
    {
      id: "calm_wellness",
      sourceType: "preset",
      primary: readRecipe("calm-wellness.json").globalTokens.primary,
      background: readRecipe("calm-wellness.json").globalTokens.background,
      audienceFit: "Best for senior, chair, yoga, tai chi, low-impact, balance, and recovery-oriented products.",
      conversionFit: "Strong for trust and clarity across long OB flows; may need strength-oriented overrides for male muscle products.",
      selected: uiStyleRecipe.recipeId === "calm_wellness",
    },
    {
      id: "energetic_fitness",
      sourceType: "preset",
      primary: readRecipe("energetic-fitness.json").globalTokens.primary,
      background: readRecipe("energetic-fitness.json").globalTokens.background,
      audienceFit: "Best for women's fitness, weight loss, toning, and visible transformation.",
      conversionFit: "Strong for motivation and action, but mismatched for chair-based men's low-impact strength.",
      selected: uiStyleRecipe.recipeId === "energetic_fitness",
    },
  ],
});
write(
  "outputs/design/design-system.md",
  `# Design System\n\n- Selected UI recipe: ${uiStyleRecipe.recipeName} (${uiStyleRecipe.recipeId})\n- Recipe mode: ${uiStyleRecipe.recipeMode}\n- Secondary influence: ${uiStyleRecipe.secondaryInfluence || "none"}\n- Primary: ${theme.colorTokens.primary}\n- Background: ${theme.colorTokens.background}\n- Surface: ${theme.colorTokens.surface}\n\nKeep the funnel vertical on mobile and desktop; no phone mockup and no left-right split layout. Page variants inherit the global recipe instead of creating page-specific visual systems.\n`
);
write(
  "outputs/design/design-prompt.md",
  `# Design Brief For ${product.appName}

## Product Psychology
The funnel should make users feel that ${product.positioningPromise.toLowerCase()} The user has not seen the real app yet, so the onboarding must build belief through progressive questions, visible personalization, and a clear pre-paywall result sequence. The emotional arc is: quick visual start, easy identity creation, goal commitment, capability baseline, routine realism, body baseline, motivation, summary, plan generation, plan ready, and then paywall.

This product is ${productProfile.modalityLabel} for ${product.audience.toLowerCase()} The design must come from that audience and modality, not from generic health, fitness, wellness, military, yoga, or senior category colors. Every page should imply that the final paid plan adapts to age, goal, capability level, schedule, limitations, body metrics, motivation, and target outcome.

The funnel should feel like a mobile app onboarding and personalized plan generator, not a landing page or survey. Questions should be app-like, direct, and easy to answer. Intro pages should act as trust bridges with enough copy to explain why the next section matters without turning into a marketing article.

## Theme Candidate Summary
Three candidates were considered: brand aligned, audience optimized, and differentiated. The selected direction should be justified by product profile and user psychology, not by a fixed category shortcut.

The selected theme is not allowed to rely on "fitness equals red", "wellness equals green", "senior equals teal", or "military equals black". It must be supported by the current product's audience, promise, copy, and image direction.

## Color Rationale
Primary color: #315F4A. Use it for CTA, selected option states, progress emphasis, active unit toggles, plan badges, countdown actions, and paywall purchase actions. Background: #F5F4EF. Surface: #FFFFFF. Text: #25282D. Muted text: #70747C. Accent: #7A624B.

Use red only for validation or risk states. Do not use category-default colors without evidence. The long flow needs a stable visual system that can carry many counted OB questions without fatigue.

## Screen By Screen Composition
Entry page: full-bleed product hero image, brand name, login action, and one strong get-started CTA. It should feel like a product portal. The hero should show the product modality in a clean, credible environment.

Age group page: four image cards with clear age differences and diverse representation. This is the first real answer and must wait for anonymous identity creation before advancing. The images should share one background system and crop so the grid feels deliberate.

Choice pages: use centered title, optional subtitle, clear vertical option rhythm, and stable selected states. Single choice may auto-advance. Multi-choice requires at least one selection and uses a bottom CTA. Icon usage is optional; plain list and image grid variants should not force icons.

Intro pages: one contextual 4:3 image, concise headline, supportive paragraph, bottom CTA. These screens validate why the next section matters and should be inserted between major modules rather than randomly.

Height and weight pages: large centered numeric input, sliding unit switch, real-time conversion, range validation, and supportive cards. Current weight shows BMI interpretation. Target weight shows change direction and feasibility messaging.

Summary page: show BMI range visualization, computed profile rows, body-state image, and a supportive insight card. The page must prove that previous answers affected the result.

Plan generation: simple circular progress, slower final percentages, required yes/no follow-up questions as modal overlays, and rotating proof below. It should feel like the system is finishing personalization, not just loading.

Plan ready: animated weight/progress path with at most five points, month plus year labels when the timeline is long, point labels aligned with the curve, and no decorative clutter.

Paywall: vertical layout only. Include sticky countdown bar, now/goal comparison, personalized plan headline, plan cards from real offers, selected-plan disclosure, full-screen Stripe checkout route, app screenshot carousel, user feedback cards, highlights, guarantee, FAQ, and legal links. Avoid boxes nested inside boxes.

Login, account creation, and profile pages: flat, simple, and consistent with the theme. Payment success should route to account creation only. Homepage login routes to login/profile. Profile displays subscription status and cancellation action with clean rows.

## Image Requirements
Large images are controlled by outputs/assets/image-plan.json. Do not invent extra decorative images in React. Required images: entry hero, age-group option images, intro heroes, summary body-state set, paywall now/goal comparison reusing summary body images, and App Store screenshots for the paywall carousel.

Age group images must be half-body, visibly age differentiated, and racially diverse across the four options. Summary body images must use a 3/4-body crop, preserve the same identity across body-state variants, and avoid shame framing. Intro images must be 4:3 and tied to the specific page message. Plan generation does not need a generated image.

## Interaction And State Requirements
The first real OB answer creates anonymous identity. Do not advance until identity creation succeeds on that first answer. Answers are stored in sessionStorage and Firestore as flat user-answer fields keyed by uid. Starting from the entry page clears the current session and creates a fresh visitor flow. Login is for returning users and should not create anonymous identity.

Progress bars count only OB question/input pages with dataKey. Summary, plan generation, plan ready, paywall, payment success, account creation, login, and profile screens do not count toward OB progress. Browser back should not be hard stage locked; instead invalid actions should be hidden or disabled by phase/state.

Blocking API states use a full-screen loading overlay. Buttons must not show raw loading text like Starting... or Saved chips. Ordinary answer persistence after identity exists should not block navigation unless required.

## Boundaries
Do not use phone mockups on desktop. Desktop should remain a vertical web funnel column on a full canvas, not a side-by-side split. Do not create fake app screenshots when real App Store screenshots are available. Do not hardcode paywall products if resolve/offers returns data. Do not use a product migration string replacement. Do not expose Stripe secret keys or backend secrets.
`
);
writeJson("outputs/design/art-direction.json", {
  version: "0.5.0",
  product: product.appName,
  paletteDecision: "audience-optimized primary plus warm neutral canvas",
  imageDirection: `premium ${productProfile.modalityLabel} photography; clean, trustworthy, and product-specific`,
  visualWorld: `${productProfile.modalityLabel}, credible home or studio context, steady progress, controlled movement.`,
  imageStyle: "Editorial fitness photography, modest athletic wear, no text, no logos, no app UI except real App Store screenshots.",
  compositionPrinciples: "Mobile-first vertical rhythm, strong centered titles, stable controls, bottom CTA, no nested card stacks.",
  differentiationFromPreviousRuns:
    "This run is generated from product profile and fixed runtime capabilities, not from old product strings or migration replacement.",
});

const stitchPromptPlan = buildStitchPromptPlan({ product, productProfile, theme, uiStyleRecipe, pages });
write("outputs/design/stitch-global-brief.md", stitchPromptPlan.globalBrief);
writeJson("outputs/design/stitch-prompts.json", stitchPromptPlan.prompts);
write("outputs/design/stitch-prompts.md", stitchPromptPlan.promptsMarkdown);

const blueprintSeeds = [
  pages.find((item) => item.id === "entry"),
  pages.find((item) => item.id === "age_group"),
  pages.find((item) => item.pageType === "multi_choice_page"),
  pages.find((item) => item.id === "height"),
  pages.find((item) => item.id === "summary"),
  pages.find((item) => item.id === "plan_ready"),
  pages.find((item) => item.id === "paywall"),
].filter(Boolean);
writeJson("outputs/design/screen-blueprints.json", {
  version: "0.5.0",
  product: product.appName,
  blueprints: blueprintSeeds.map((item) => ({
    pageId: item.id,
    pageType: item.pageType,
    conversionPurpose: item.conversionPurpose,
    userMoment: item.role || item.phase,
    visualJob:
      item.pageType === "entry_page"
        ? "Make the product feel real through a strong hero image and direct start action."
        : item.pageType === "single_choice_page" && item.variant === "image_grid"
          ? "Make the first answer visual and low friction."
          : item.pageType === "multi_choice_page"
            ? "Collect multiple personalization signals without forcing decorative icons."
            : item.pageType === "height_input_page"
              ? "Capture body baseline through large numeric input and unit conversion."
              : item.pageType === "summary_page"
                ? "Prove previous answers are used through computed rows, BMI, and body-state visual."
                : item.pageType === "plan_ready_page"
                  ? "Bridge result to paywall with a believable animated progress path."
                  : "Convert with personalized proof, offer selection, checkout, and reassurance.",
    composition:
      item.pageType === "paywall_page"
        ? "Vertical sales page with sticky countdown, comparison, offers, proof, FAQ, and full-screen checkout route."
        : "Mobile-first vertical layout, centered title, stable content area, bottom CTA when needed.",
    componentHierarchy:
      item.pageType === "paywall_page"
        ? ["Sticky countdown", "Result comparison", "Offer list", "Primary CTA", "Proof sections", "FAQ", "Legal links"]
        : item.pageType === "entry_page"
          ? ["Brand", "Login action", "Hero image", "Headline", "Primary CTA"]
          : item.pageType === "summary_page"
            ? ["Top navigation", "BMI visualization", "Personalized rows", "Body image", "Insight card", "CTA"]
            : item.pageType === "height_input_page"
              ? ["Top navigation", "Title", "Unit switch", "Numeric input", "Support card", "CTA"]
              : ["Top navigation", "Title", "Subtitle", "Options or content", "CTA where required"],
  })),
});

writeJson("outputs/assets/image-plan.json", imagePlan);
write(
  "outputs/assets/image-plan.md",
  `# Image Plan\n\nLarge-image-only plan for ${product.appName}.\n\n${imageSlots
    .map((slot) => `## ${slot.id}\n- Page: ${slot.pageId}\n- Kind: ${slot.kind}\n- Source: ${slot.sourcePolicy}\n- Count: ${slot.count}\n- Aspect ratio: ${slot.aspectRatio}\n- Prompt brief: ${slot.promptBrief}\n`)
    .join("\n")}`
);

writeJson("outputs/design-handoff/design-handoff.json", {
  version: "0.5.0",
  source: "config",
  status: "prototype_from_config",
  note: "This handoff drives React Runtime through theme, page map, copy, image plan, and runtime components. It is not a migration or string replacement output.",
  themeFile: "outputs/design/theme.json",
  pageMapFile: "outputs/page-map/page-map.json",
  assetManifestFile: "outputs/assets/asset-manifest.json",
  templates: [
    { pageType: "entry_page", nodeId: "config:entry_page" },
    { pageType: "intro_page", nodeId: "config:intro_page" },
    { pageType: "single_choice_page", nodeId: "config:single_choice_page" },
    { pageType: "multi_choice_page", nodeId: "config:multi_choice_page" },
    { pageType: "height_input_page", nodeId: "config:height_input_page" },
    { pageType: "weight_input_page", nodeId: "config:weight_input_page" },
    { pageType: "summary_page", nodeId: "config:summary_page" },
    { pageType: "plan_generation_page", nodeId: "config:plan_generation_page" },
    { pageType: "plan_ready_page", nodeId: "config:plan_ready_page" },
    { pageType: "paywall_page", nodeId: "config:paywall_page" },
  ],
});
writeJson("outputs/design-handoff/page-type-template-map.json", {
  version: "0.5.0",
  source: "config",
  templates: [
    { pageType: "entry_page", nodeId: "config:entry_page", component: "EntryPage" },
    { pageType: "intro_page", nodeId: "config:intro_page", component: "IntroPage" },
    { pageType: "single_choice_page", nodeId: "config:single_choice_page", component: "ChoicePage" },
    { pageType: "multi_choice_page", nodeId: "config:multi_choice_page", component: "ChoicePage" },
    { pageType: "height_input_page", nodeId: "config:height_input_page", component: "HeightInputPage" },
    { pageType: "weight_input_page", nodeId: "config:weight_input_page", component: "WeightInputPage" },
    { pageType: "summary_page", nodeId: "config:summary_page", component: "SummaryPage" },
    { pageType: "plan_generation_page", nodeId: "config:plan_generation_page", component: "PlanGenerationPage" },
    { pageType: "plan_ready_page", nodeId: "config:plan_ready_page", component: "PlanReadyPage" },
    { pageType: "paywall_page", nodeId: "config:paywall_page", component: "PaywallPage" },
  ],
});

writeJson("outputs/config/funnel.config.json", config);
write("outputs/config/funnel.config.ts", `export const funnelConfig = ${JSON.stringify(config, null, 2)} as const;\n`);
write("outputs/config/developer-brief.md", `# Developer Brief\n\nBuild ${product.appName} with React Runtime. Use config-driven page order, product-specific theme, generated assets, and Billing/Firebase/Mixpanel adapters. Do not hardcode products or page count in components.\n`);

writeJson("outputs/rules/composed-rules.json", {
  version: "0.5.0",
  product: product.appName,
  rules: [
    "No product migration string replacement is allowed.",
    "Product identity comes from inputs/product-brief.md and generated strategy output.",
    "OB progress counts only onboarding question/input pages with dataKey.",
    "Single choice may auto-advance; multi-choice requires minSelections >= 1 unless explicitly skippable.",
    "Height and weight unit switches convert values in real time.",
    "Paywall loads offers through resolve/offers using placementCode and discountType.",
    "Checkout opens a full-screen Stripe embedded checkout page, then routes to payment success.",
    "Answers are stored in sessionStorage and Firestore as flat uid-keyed answer fields.",
  ],
});

console.log(`Generated product run for ${product.appName}: ${pages.length} pages, ${counted.length} counted OB pages, ${imageSlots.length} image slots.`);
