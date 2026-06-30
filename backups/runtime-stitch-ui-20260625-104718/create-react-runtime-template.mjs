import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputRoot = path.join(root, "outputs");

function write(filePath, content) {
  const absolute = path.join(root, filePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content);
}

function writeJson(filePath, value) {
  write(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function readJsonIfExists(filePath, fallback) {
  const absolute = path.join(root, filePath);
  if (!fs.existsSync(absolute)) return fallback;
  return JSON.parse(fs.readFileSync(absolute, "utf8"));
}

function relativeLuminance(hex) {
  const parsed = String(hex || "").trim().match(/^#?([0-9a-f]{6})$/i);
  if (!parsed) return 1;
  const [r, g, b] = parsed[1].match(/.{2}/g).map((value) => parseInt(value, 16) / 255);
  const [lr, lg, lb] = [r, g, b].map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function normalizeAssetManifest(manifest) {
  const rawAssets = manifest?.assets ?? {};
  const assetsArray = Array.isArray(rawAssets)
    ? rawAssets
    : Object.entries(rawAssets).map(([id, asset]) => ({ id, ...asset }));

  const normalizedAssets = {};
  for (const asset of assetsArray) {
    if (!asset?.id) continue;
    const next = { ...asset };
    if (!next.src && next.localPath) next.src = `/assets/images/${path.basename(next.localPath)}`;
    normalizedAssets[next.id] = next;
    if (next.kind === "summary_body_set") {
      normalizedAssets[`paywall.${next.id}`] = {
        ...next,
        id: `paywall.${next.id}`,
        pageId: "paywall"
      };
    }
  }

  return {
    ...manifest,
    assets: normalizedAssets
  };
}

function copyRuntimeAssets(manifest) {
  const assets = Object.values(manifest?.assets ?? {});
  const publicDir = path.join(root, "outputs/app/public/assets/images");
  fs.rmSync(publicDir, { recursive: true, force: true });
  fs.mkdirSync(publicDir, { recursive: true });

  for (const asset of assets) {
    if (!asset?.localPath) continue;
    const source = path.isAbsolute(asset.localPath) ? asset.localPath : path.join(root, asset.localPath);
    if (!fs.existsSync(source)) continue;
    fs.copyFileSync(source, path.join(publicDir, path.basename(source)));
  }
}

function writeJsonIfMissing(filePath, value) {
  if (fs.existsSync(path.join(root, filePath))) return;
  writeJson(filePath, value);
}

function writeIfMissing(filePath, value) {
  if (fs.existsSync(path.join(root, filePath))) return;
  write(filePath, value);
}

const packageJson = {
  name: "web2app-react-runtime-template",
  private: true,
  version: "0.1.0",
  type: "module",
  scripts: {
    dev: "vite --host 0.0.0.0",
    build: "tsc -b && vite build",
    preview: "vite preview --host 0.0.0.0"
  },
  dependencies: {
    "@stripe/stripe-js": "^4.10.0",
    "@vitejs/plugin-react": "^4.3.4",
    firebase: "^11.0.0",
    "lucide-react": "^0.468.0",
    "mixpanel-browser": "^2.64.0",
    react: "^19.0.0",
    "react-dom": "^19.0.0",
    typescript: "^5.7.0",
    vite: "^6.0.0"
  },
  devDependencies: {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
};

const templateTheme = {
  version: "template",
  colorTokens: {
    primary: "#D93278",
    accent: "#6A4C93",
    background: "#F7F6F9",
    surface: "#FFFFFF",
    surfaceAlt: "#EFEAF1",
    text: "#25282D",
    muted: "#71737A",
    border: "#E4DFE8",
    disabled: "#B5BEC8",
    warning: "#F2D5D8",
    info: "#DCEAF9",
    success: "#2D7D61"
  },
  colorSystem: {
    background: "#F7F6F9"
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  shape: {
    controlRadius: 14,
    cardRadius: 16,
    buttonRadius: 10
  },
  primaryColorDecision: {
    sourceType: "user_provided",
    evidence: "Runtime template uses #D93278 only as a default development token for component QA.",
    confidence: "template",
    audienceFit: "The default color is neutral for testing and must be replaced by each product run based on audience, modality, and brand evidence.",
    fallbackPolicy: "Product runs should select product-specific tokens and must not inherit this template palette blindly."
  }
};

const templateConfig = {
  version: "template",
  product: {
    appName: "Web2App Runtime Template",
    appCode: "oog126_dev",
    placementCode: "O2MGB"
  },
  flowTemplate: {
    id: "short_ob_runtime_template",
    name: "Short OB Runtime Template",
    apiReference: "inputs/api-reference.md",
    sequence: [
      "age_group",
      "age",
      "intro",
      "starter_level",
      "focus_areas",
      "blockers",
      "height",
      "current_weight",
      "target_weight",
      "email",
      "summary",
      "plan_generation",
      "plan_ready",
      "paywall",
      "account_create",
      "login",
      "profile"
    ],
    note: "This short OB demonstrates implemented runtime page capabilities before paywall/account modules. Product runs must replace all product-facing copy and options."
  },
  lifecycle: {
    storage: "sessionStorage",
    anonymousIdentityTrigger: "first_real_ob_answer_input"
  },
  backendIntegration: {
    apiReference: "inputs/api-reference.md",
    apiBaseUrlDefault: "https://billing-dev.cloud.7mfitness.com",
    identityMode: "backend_custom_token_firebase_web_sdk",
    storageScope: "sessionStorage",
    firebaseAuthPersistence: "browserSessionPersistence",
    anonymousIdentityTrigger: "first_real_ob_answer_input",
    accountLoginMode: "backend_email_password_login",
    subscriptionManagementMode: "backend_subscription_management",
    firestore: {
      answerCollectionDefault: "test",
      answerDocumentId: "uid",
      answerDocumentShape: "flat_user_answers_only"
    }
  },
  sections: [
    { id: "profile", label: "Profile", order: 1 },
    { id: "goals", label: "Goals", order: 2 },
    { id: "body", label: "Body", order: 3 },
    { id: "lead", label: "Plan", order: 4 }
  ],
  pages: [
    {
      id: "age_group",
      pageType: "single_choice_page",
      variant: "image_grid",
      phase: "onboarding",
      role: "question",
      sectionId: "profile",
      sectionLabel: "Profile",
      dataKey: "ageGroup",
      title: "Choose your age group",
      subtitle: "This starts a fresh tab-scoped onboarding session.",
      options: [
        { label: "18-29", value: "18_29", image: "/choice-placeholders/age-18-29.png" },
        { label: "30-39", value: "30_39", image: "/choice-placeholders/age-30-39.png" },
        { label: "40-49", value: "40_49", image: "/choice-placeholders/age-40-49.png" },
        { label: "50+", value: "50_plus", image: "/choice-placeholders/age-50-plus.png" }
      ],
      progress: { visible: true, countsTowardTotal: true, scope: "ob_questions", step: 1, total: 8, showStepCount: true }
    },
    {
      id: "age",
      pageType: "age_input_page",
      phase: "onboarding",
      role: "question",
      sectionId: "profile",
      sectionLabel: "Profile",
      dataKey: "age",
      title: "What is your age?",
      subtitle: "This helps personalize the generated plan experience.",
      defaultValue: { age: 22 },
      progress: { visible: true, countsTowardTotal: true, scope: "ob_questions", step: 2, total: 8, showStepCount: true }
    },
    {
      id: "intro",
      pageType: "intro_page",
      phase: "onboarding",
      role: "trust_builder",
      sectionId: "profile",
      sectionLabel: "Profile",
      title: "Your plan should match your starting point",
      body: "Intro pages explain why the next section matters and build confidence without collecting data.",
      cta: "Continue",
      progress: { visible: false, countsTowardTotal: false }
    },
    {
      id: "starter_level",
      pageType: "single_choice_page",
      variant: "plain_list",
      phase: "onboarding",
      role: "question",
      sectionId: "profile",
      sectionLabel: "Profile",
      dataKey: "starterLevel",
      title: "What is your starting level?",
      subtitle: "This template page demonstrates a plain single-choice capability.",
      options: [
        { label: "I'm just getting started", value: "beginner" },
        { label: "I have some experience, but need structure", value: "some_experience" },
        { label: "I am consistent and want a sharper plan", value: "advanced" }
      ],
      progress: { visible: true, countsTowardTotal: true, scope: "ob_questions", step: 3, total: 8, showStepCount: true }
    },
    {
      id: "focus_areas",
      pageType: "multi_choice_page",
      variant: "icon_list",
      phase: "onboarding",
      role: "question",
      sectionId: "goals",
      sectionLabel: "Goals",
      dataKey: "focusAreas",
      title: "Where do you want support?",
      subtitle: "Choose all that apply",
      minSelections: 1,
      options: [
        { label: "Main goal", value: "main_goal", icon: "Target" },
        { label: "Daily routine", value: "daily_routine", icon: "CalendarDays" },
        { label: "Motivation", value: "motivation", icon: "Zap" }
      ],
      progress: { visible: true, countsTowardTotal: true, scope: "ob_questions", step: 4, total: 8, showStepCount: true }
    },
    {
      id: "blockers",
      pageType: "multi_choice_page",
      variant: "plain_list",
      phase: "onboarding",
      role: "question",
      sectionId: "goals",
      sectionLabel: "Goals",
      dataKey: "blockers",
      title: "What tends to get in your way?",
      subtitle: "Choose all that apply",
      minSelections: 1,
      options: [
        { label: "I lose motivation after a few days", value: "motivation" },
        { label: "I don't know what fits me", value: "fit_unclear" },
        { label: "I need something simple to follow", value: "simple_to_follow" },
        { label: "I have limited time", value: "limited_time" }
      ],
      progress: { visible: true, countsTowardTotal: true, scope: "ob_questions", step: 5, total: 8, showStepCount: true }
    },
    {
      id: "height",
      pageType: "height_input_page",
      variant: "unit_switching_numeric_input",
      phase: "onboarding",
      role: "question",
      sectionId: "body",
      sectionLabel: "Body",
      dataKey: "height",
      title: "How tall are you?",
      subtitle: "The runtime owns unit conversion and default values.",
      units: ["ft", "cm"],
      defaultUnit: "cm",
      defaultValue: { cm: 165, in: 65, ft: 5, inch: 5 },
      progress: { visible: true, countsTowardTotal: true, scope: "ob_questions", step: 6, total: 8, showStepCount: true }
    },
    {
      id: "current_weight",
      pageType: "weight_input_page",
      variant: "current_weight",
      phase: "onboarding",
      role: "question",
      sectionId: "body",
      sectionLabel: "Body",
      dataKey: "currentWeight",
      title: "What is your current weight?",
      subtitle: "This measurement can power derived insights when the product needs them.",
      units: ["lbs", "kg"],
      defaultUnit: "kg",
      defaultValue: { lbs: 150, kg: 68 },
      showBmiCard: true,
      progress: { visible: true, countsTowardTotal: true, scope: "ob_questions", step: 7, total: 8, showStepCount: true }
    },
    {
      id: "target_weight",
      pageType: "weight_input_page",
      variant: "target_weight",
      phase: "onboarding",
      role: "question",
      sectionId: "body",
      sectionLabel: "Body",
      dataKey: "targetWeight",
      title: "What is your target weight?",
      subtitle: "The runtime owns target comparison and supportive validation logic.",
      units: ["lbs", "kg"],
      defaultUnit: "kg",
      defaultValue: { lbs: 135, kg: 61 },
      showTargetWarning: true,
      progress: { visible: true, countsTowardTotal: true, scope: "ob_questions", step: 8, total: 8, showStepCount: true }
    },
    {
      id: "email",
      pageType: "email_capture_page",
      phase: "onboarding",
      role: "lead_capture",
      sectionId: "lead",
      sectionLabel: "Plan",
      dataKey: "email",
      title: "Where should we send your personalized plan?",
      subtitle: "Enter your email so the generated plan can be saved for later access.",
      cta: "Save my plan",
      progress: { visible: false, countsTowardTotal: false }
    },
    {
      id: "summary",
      pageType: "summary_page",
      phase: "result",
      role: "summary",
      title: "Summary of your profile",
      subtitle: "A plan-ready snapshot based on your answers.",
      cta: "Continue",
      progress: { visible: false, countsTowardTotal: false }
    },
    {
      id: "plan_generation",
      pageType: "plan_generation_page",
      phase: "result",
      role: "plan_generation",
      title: "Creating your personalized plan",
      subtitle: "We're matching your answers with the right pace, focus, and weekly structure.",
      cta: "Continue",
      progressSteps: [
        "Analyzing your profile",
        "Matching the right pace",
        "Building your plan structure",
        "Preparing your plan preview"
      ],
      generationPrompts: [
        { id: "manageable_start", question: "Do you want your first week to feel manageable?", yesLabel: "Yes", noLabel: "No", askAtProgress: 28 },
        { id: "focus_priority", question: "Should we prioritize your selected focus areas?", yesLabel: "Yes", noLabel: "No", askAtProgress: 56 },
        { id: "recovery_pacing", question: "Should recovery be part of your weekly pacing?", yesLabel: "Yes", noLabel: "No", askAtProgress: 82 }
      ],
      autoAdvance: false,
      progress: { visible: false, countsTowardTotal: false }
    },
    {
      id: "plan_ready",
      pageType: "plan_ready_page",
      phase: "result",
      role: "plan_ready",
      title: "Your personalized plan is ready",
      subtitle: "A plan built around your goal, starting point, and target pace.",
      cta: "Continue",
      progress: { visible: false, countsTowardTotal: false }
    },
    {
      id: "paywall",
      pageType: "paywall_page",
      phase: "monetization",
      role: "paywall",
      title: "Unlock your personalized plan",
      subtitle: "Start with a plan shaped around your goal, body profile, and schedule.",
      cta: "Continue to secure checkout",
      paymentProvider: "stripe",
      stripePublishableKeyEnv: "VITE_STRIPE_PUBLISHABLE_KEY",
      productSource: "billing_resolve_offers",
      placementCode: "O2MGB",
      resultPreview: {
        enabled: true,
        source: ["currentWeight", "targetWeight", "focusAreas", "blockers"]
      },
      plans: [
        { id: "fallback_4_week", productId: "fallback-4-week", label: "4-week starter", price: "$14.99", billingPeriod: "First plan phase" },
        { id: "fallback_12_week", productId: "fallback-12-week", label: "12-week plan", price: "$29.99", billingPeriod: "Recommended" },
        { id: "fallback_monthly", productId: "fallback-monthly", label: "Monthly access", price: "$19.99", billingPeriod: "Flexible access" }
      ],
      highlights: [
        "Plan structure matched to your starting point",
        "Progress pacing based on your answers",
        "Simple steps designed for consistency"
      ],
      faq: [
        { question: "What happens after I pay?", answer: "Checkout returns to the success page and account creation saves access." },
        { question: "Can I cancel later?", answer: "Yes. Subscription management is available after account access is created." },
        { question: "Where do prices come from?", answer: "Prices are loaded from the billing resolve/offers endpoint." }
      ],
      testimonials: [
        { quote: "The structure helped me finally stay consistent.", author: "Template user" }
      ],
      moneyBackGuarantee: {
        enabled: true,
        text: "Guarantee terms are shown at checkout and must match backend/legal policy."
      },
      renewalDisclosure: "Subscription terms, renewal timing, and cancellation details are shown before payment.",
      legalLinks: ["Terms", "Privacy", "Subscription terms"],
      progress: { visible: false, countsTowardTotal: false }
    },
    {
      id: "account_create",
      pageType: "account_create_page",
      phase: "account",
      role: "account_create",
      title: "Create account",
      subtitle: "Save access to your plan.",
      cta: "Create account",
      progress: { visible: false, countsTowardTotal: false }
    },
    {
      id: "login",
      pageType: "login_page",
      phase: "account",
      role: "login",
      title: "Log in",
      subtitle: "Access your plan and subscription.",
      cta: "Log in",
      progress: { visible: false, countsTowardTotal: false }
    },
    {
      id: "profile",
      pageType: "account_page",
      phase: "account",
      role: "profile",
      title: "Profile",
      subtitle: "Your plan and subscription.",
      subscriptionDataSource: "subscriptionSummary",
      progress: { visible: false, countsTowardTotal: false }
    }
  ]
};

const templateCopy = {
  version: "template",
  pages: Object.fromEntries(
    templateConfig.pages.map((page) => [
      page.id,
      {
        title: page.title,
        subtitle: page.subtitle || "",
        body: page.body || "",
        cta: page.cta || "",
        options: (page.options || []).map((option) => ({
          value: option.value,
          label: option.label
        }))
      }
    ])
  )
};

const templatePageVisualMap = {
  version: "template",
  defaults: {
    pageMaxWidth: 420,
    desktopMaxWidth: 760,
    background: "var(--bg)",
    titleAlign: "center",
    titleSize: "clamp(27px, 4vw, 36px)",
    bodySize: "16px",
    ctaRadius: 10,
    inputRadius: 6,
    optionRadius: 16,
    selectedStyle: "primary_outline_or_fill",
    motion: "subtle"
  },
  pageTypes: {
    single_choice_page: {
      supportedVariants: ["image_grid", "plain_list", "icon_list"],
      ctaMode: "auto_advance",
      imageRatio: "4/5",
      iconPlacement: "leading"
    },
    multi_choice_page: {
      supportedVariants: ["image_grid", "plain_list", "icon_list"],
      ctaMode: "sticky_bottom",
      selectedIndicator: "checkmark_or_accent",
      minSelectionFeedback: "disabled_cta"
    },
    age_input_page: {
      layout: "large_center_numeric_input",
      helperCard: "flat_tinted_explainer",
      placeholder: "0"
    },
    height_input_page: {
      layout: "large_measurement_input",
      unitSwitcher: "sliding_capsule",
      helperCard: "bmi_explainer"
    },
    weight_input_page: {
      layout: "large_measurement_input",
      unitSwitcher: "sliding_capsule",
      insightCard: "bmi_or_target_context"
    },
    email_capture_page: {
      layout: "lead_capture_stack",
      trustDensity: "light"
    },
    paywall_page: {
      layout: "long_vertical_sales_page",
      desktopLayout: "vertical_centered_not_split",
      offerRows: "product_deduped"
    },
    login_page: {
      layout: "flat_auth_form",
      container: "none",
      inputSurface: "soft_gray"
    },
    account_create_page: {
      layout: "flat_auth_form",
      container: "none",
      inputSurface: "soft_gray"
    },
    account_page: {
      layout: "flat_profile_list",
      container: "none",
      dividerStyle: "hairline"
    }
  },
  pages: Object.fromEntries(
    templateConfig.pages.map((page) => [
      page.id,
      {
        pageType: page.pageType,
        variant: page.variant || "default",
        sectionId: page.sectionId || page.phase || "global"
      }
    ])
  )
};

const templateIconMap = {
  version: "template",
  library: "lucide-react",
  optionIcons: Object.fromEntries(
    templateConfig.pages.flatMap((page) =>
      (page.options || [])
        .filter((option) => option.icon)
        .map((option) => [`${page.id}.${option.value}`, option.icon])
    )
  ),
  uiIcons: {
    back: "ArrowLeft",
    logout: "LogOut",
    passwordVisible: "Eye",
    passwordHidden: "EyeOff",
    subscription: "ShieldCheck",
    heightExplainer: "Ruler"
  }
};

const templateAssetsManifest = {
  version: "template",
  mode: "placeholder",
  assets: Object.fromEntries(
    templateConfig.pages.flatMap((page) =>
      (page.options || [])
        .filter((option) => option.image)
        .map((option) => [
          `${page.id}.${option.value}`,
          {
            kind: "option_image",
            pageId: page.id,
            optionValue: option.value,
            src: option.image,
            requiredInProductRun: true
          }
        ])
    )
  )
};

function copyFromFunnelConfig(config) {
  const pages = Array.isArray(config?.pages) ? config.pages : [];
  return {
    version: config?.version ?? "generated",
    product: config?.product?.appName ?? config?.product ?? "Generated Product",
    pages: Object.fromEntries(
      pages.map((page) => [
        page.id,
        {
          title: page.title ?? "",
          subtitle: page.subtitle ?? "",
          body: page.body ?? "",
          cta: page.ctaLabel ?? page.cta ?? "",
          options: Array.isArray(page.options)
            ? page.options.map(({ value, label }) => ({ value, label }))
            : []
        }
      ])
    )
  };
}

function pageVisualMapFromFunnelConfig(config) {
  const pages = Array.isArray(config?.pages) ? config.pages : [];
  return {
    version: config?.version ?? "generated",
    defaults: templatePageVisualMap.defaults,
    pageTypes: templatePageVisualMap.pageTypes,
    pages: Object.fromEntries(
      pages.map((page) => [
        page.id,
        {
          pageType: page.pageType,
          variant: page.variant || "default",
          sectionId: page.sectionId || page.phase || "global"
        }
      ])
    )
  };
}

const stitchHandoff = readJsonIfExists("outputs/design/stitch-handoff.json", null);
const stitchPageContracts = readJsonIfExists("outputs/design/stitch-page-contracts.json", null);
const stitchScreenBlueprints = readJsonIfExists("outputs/design/screen-blueprints.json", null);

function stitchRadiusValue(value, fallback) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function mergeFontFamilies(...families) {
  const seen = new Set();
  return families
    .flatMap((family) => String(family || "").split(","))
    .map((family) => family.trim())
    .filter(Boolean)
    .filter((family) => {
      const key = family.replace(/^['"]|['"]$/g, "").toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(", ");
}

function getStitchScreens(handoff) {
  if (Array.isArray(handoff?.screens)) return handoff.screens;
  if (Array.isArray(handoff?.stitchScreens)) return handoff.stitchScreens;
  return [];
}

function kebabCase(value) {
  return String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function contractByPageId(contracts) {
  return Object.fromEntries((contracts?.contracts ?? []).map((contract) => [contract.pageId, contract]));
}

function blueprintByPageId(blueprints) {
  return Object.fromEntries((blueprints?.blueprints ?? []).map((blueprint) => [blueprint.pageId, blueprint]));
}

function derivePageDensity(pageType, stitchVariant) {
  if (pageType === "entry_page") return "immersive";
  if (pageType === "paywall_page") return "sales";
  if (pageType === "summary_page") return "report";
  if (pageType === "plan_generation_page" || pageType === "plan_ready_page") return "cinematic";
  if (String(stitchVariant || "").includes("large-centered")) return "focused";
  return "quiet";
}

function deriveStitchStyle(handoff, contracts, blueprints) {
  if (!handoff || handoff.source !== "stitch") return null;
  const globalStyle = handoff.globalStyle ?? {};
  const componentVariants = handoff.componentVariants ?? {};
  const screens = getStitchScreens(handoff);
  const contractsByPage = contractByPageId(contracts);
  const blueprintsByPage = blueprintByPageId(blueprints);
  const defaultRadius = globalStyle.radius ?? {};
  const defaultTypography = {
    headlineFamily: globalStyle.headlineFontFamily ?? globalStyle.fontFamily,
    bodyFamily: globalStyle.fontFamily,
    headlineWeight: 780,
    bodyWeight: 500
  };
  const pageTypes = Object.fromEntries(
    Object.entries(componentVariants).map(([pageType, config]) => {
      const variant = config.variant ?? "default";
      return [
        pageType,
        {
          source: "stitch",
          screenId: config.screenId,
          variant,
          variantClass: `stitch-variant-${kebabCase(variant)}`,
          notes: config.notes,
          density: derivePageDensity(pageType, variant),
          titleTreatment: pageType === "entry_page" ? "hero" : pageType === "paywall_page" ? "sales" : "balanced",
          surfaceTreatment: globalStyle.surfaceStyle ?? "flat",
          backgroundTreatment: globalStyle.backgroundStyle ?? "soft",
          buttonTreatment: globalStyle.buttonStyle ?? "full-width-rounded-primary",
          navTreatment: globalStyle.navStyle ?? "compact-section-segmented",
          progressTreatment: globalStyle.progressStyle ?? "segmented-bars",
          avoidNestedCards: true
        }
      ];
    })
  );
  const pages = Object.fromEntries(
    screens.map((screen) => {
      const typeStyle = pageTypes[screen.pageType] ?? {};
      const contract = contractsByPage[screen.pageId];
      const blueprint = blueprintsByPage[screen.pageId];
      return [
        screen.pageId,
        {
          ...typeStyle,
          source: "stitch",
          screenId: screen.screenId,
          screenResource: screen.screenResource,
          role: screen.role,
          requiredElements: contract?.requiredElements ?? [],
          dataSlots: contract?.dataSlots ?? [],
          visualJob: blueprint?.visualJob,
          composition: blueprint?.composition,
          componentHierarchy: blueprint?.componentHierarchy ?? [],
          pageClass: [
            "stitch-page",
            `stitch-type-${kebabCase(screen.pageType)}`,
            typeStyle.variantClass
          ].filter(Boolean).join(" ")
        }
      ];
    })
  );
  return {
    version: "0.1.0",
    source: "stitch",
    status: handoff.status,
    projectId: handoff.projectId,
    handoffFile: "outputs/design/stitch-handoff.json",
    mode: handoff.runtimeBoundary?.mode ?? "style_and_layout_direction",
    global: {
      designIntent: handoff.designIntent,
      tokens: globalStyle,
      typography: defaultTypography,
      radius: {
        controls: stitchRadiusValue(defaultRadius.controls, 8),
        cards: stitchRadiusValue(defaultRadius.cards, 16),
        buttons: stitchRadiusValue(defaultRadius.buttons, 12)
      },
      layout: globalStyle.layout ?? {},
      principles: [
        "Use Stitch as visual hierarchy and layout direction.",
        "Preserve Runtime-owned data, validation, payment, analytics, Firebase, and navigation.",
        "Prefer flat composition over nested cards."
      ]
    },
    pageTypes,
    pages
  };
}

function applyStitchHandoffToTheme(theme, handoff) {
  if (!handoff || handoff.source !== "stitch") return theme;
  const style = handoff.globalStyle ?? {};
  const radius = style.radius ?? {};
  const typography = style.typography ?? {};
  const existingFontFamily = theme.typography?.fontFamily ?? templateTheme.typography.fontFamily;
  const bodyFontFamily = mergeFontFamilies(typography.bodyFamily, existingFontFamily);
  const next = {
    ...theme,
    designProvider: {
      source: "stitch",
      status: handoff.status,
      projectId: handoff.projectId,
      handoffFile: "outputs/design/stitch-handoff.json",
      mode: handoff.runtimeBoundary?.mode ?? "style_and_layout_direction"
    },
    colorTokens: {
      ...(theme.colorTokens ?? {}),
      background: style.background ?? theme.colorTokens?.background,
      surface: style.surface ?? theme.colorTokens?.surface,
      surfaceSoft: style.surfaceSoft ?? theme.colorTokens?.surfaceSoft,
      surfaceAlt: style.surfaceSoft ?? theme.colorTokens?.surfaceAlt,
      primary: style.primary ?? theme.colorTokens?.primary,
      primaryDark: style.primaryDark ?? theme.colorTokens?.primaryDark,
      accent: style.accent ?? theme.colorTokens?.accent,
      text: style.text ?? theme.colorTokens?.text,
      mutedText: style.mutedText ?? theme.colorTokens?.mutedText,
      muted: style.mutedText ?? theme.colorTokens?.muted,
      border: style.border ?? theme.colorTokens?.border
    },
    colorSystem: {
      ...(theme.colorSystem ?? {}),
      background: style.background ?? theme.colorSystem?.background ?? theme.colorTokens?.background
    },
    typography: {
      ...(theme.typography ?? {}),
      fontFamily: bodyFontFamily,
      headlineFamily: typography.headlineFamily ?? theme.typography?.headlineFamily,
      headingWeight: typography.headlineWeight ?? theme.typography?.headingWeight,
      bodyWeight: typography.bodyWeight ?? theme.typography?.bodyWeight,
      letterSpacing: typography.letterSpacing ?? theme.typography?.letterSpacing
    },
    shape: {
      ...(theme.shape ?? {}),
      controlRadius: stitchRadiusValue(radius.controls, theme.shape?.controlRadius),
      cardRadius: stitchRadiusValue(radius.cards, theme.shape?.cardRadius),
      buttonRadius: stitchRadiusValue(radius.buttons, theme.shape?.buttonRadius)
    }
  };
  return next;
}

function applyStitchHandoffToPageVisualMap(visualMap, handoff) {
  if (!handoff || handoff.source !== "stitch") return visualMap;
  const componentVariants = handoff.componentVariants ?? {};
  const globalStyle = handoff.globalStyle ?? {};
  const pageTypeEntries = Object.fromEntries(
    Object.entries(componentVariants).map(([pageType, config]) => [
      pageType,
      {
        ...(visualMap.pageTypes?.[pageType] ?? {}),
        stitchVariant: config.variant,
        stitchNotes: config.notes,
        designSource: "stitch",
        surfaceStyle: "flat",
        avoidNestedCards: true,
        desktopLayout: globalStyle.layout?.desktop,
        readableMaxWidth: globalStyle.layout?.readableMaxWidth
      }
    ])
  );
  const screenByPageId = Object.fromEntries(
    getStitchScreens(handoff).map((screen) => [
      screen.pageId,
      {
        stitchScreenId: screen.screenId,
        stitchScreenResource: screen.screenResource,
        stitchRole: screen.role,
        designSource: "stitch"
      }
    ])
  );
  return {
    ...visualMap,
    version: visualMap.version ?? handoff.version,
    source: "stitch",
    stitchProjectId: handoff.projectId,
    stitchHandoffFile: "outputs/design/stitch-handoff.json",
    defaults: {
      ...(visualMap.defaults ?? {}),
      designSource: "stitch",
      background: globalStyle.background ? "var(--bg)" : visualMap.defaults?.background,
      primaryColor: globalStyle.primary,
      pageMaxWidth: globalStyle.layout?.readableMaxWidth ?? visualMap.defaults?.pageMaxWidth,
      desktopMaxWidth: globalStyle.layout?.readableMaxWidth ?? visualMap.defaults?.desktopMaxWidth,
      motion: visualMap.defaults?.motion ?? "subtle"
    },
    pageTypes: {
      ...(visualMap.pageTypes ?? {}),
      ...pageTypeEntries
    },
    pages: Object.fromEntries(
      Object.entries(visualMap.pages ?? {}).map(([pageId, config]) => [
        pageId,
        {
          ...config,
          ...(screenByPageId[pageId] ?? {})
        }
      ])
    )
  };
}

function applyStitchHandoffToFunnelConfig(config, handoff) {
  if (!handoff || handoff.source !== "stitch") return config;
  const componentVariants = handoff.componentVariants ?? {};
  const screenByPageId = Object.fromEntries(getStitchScreens(handoff).map((screen) => [screen.pageId, screen]));
  return {
    ...config,
    designProvider: {
      source: "stitch",
      status: handoff.status,
      projectId: handoff.projectId,
      handoffFile: "outputs/design/stitch-handoff.json",
      mode: handoff.runtimeBoundary?.mode ?? "style_and_layout_direction"
    },
    pages: (config.pages ?? []).map((page) => {
      const variant = componentVariants[page.pageType];
      const screen = screenByPageId[page.id];
      if (!variant && !screen) return page;
      return {
        ...page,
        designSource: "stitch",
        stitchVariant: variant?.variant,
        stitchNotes: variant?.notes,
        stitchScreenId: screen?.screenId,
        stitchScreenResource: screen?.screenResource
      };
    })
  };
}

const baseRuntimeFunnelConfig = readJsonIfExists(
  "outputs/config/funnel.config.json",
  readJsonIfExists("outputs/config/app-config/funnel.config.json", templateConfig)
);
const runtimeFunnelConfig = applyStitchHandoffToFunnelConfig(baseRuntimeFunnelConfig, stitchHandoff);
const runtimeCopy = fs.existsSync(path.join(root, "outputs/page-map/page-map.json"))
  ? copyFromFunnelConfig(runtimeFunnelConfig)
  : readJsonIfExists("outputs/config/app-config/copy.json", templateCopy);
const baseRuntimeTheme = readJsonIfExists(
  "outputs/design/theme.json",
  readJsonIfExists("outputs/config/app-config/theme.json", templateTheme)
);
const runtimeTheme = applyStitchHandoffToTheme(baseRuntimeTheme, stitchHandoff);
const baseRuntimePageVisualMap = fs.existsSync(path.join(root, "outputs/page-map/page-map.json"))
  ? pageVisualMapFromFunnelConfig(runtimeFunnelConfig)
  : readJsonIfExists("outputs/config/app-config/page-visual-map.json", templatePageVisualMap);
const runtimeStitchDerivedStyle = deriveStitchStyle(stitchHandoff, stitchPageContracts, stitchScreenBlueprints);
const runtimePageVisualMap = applyStitchHandoffToPageVisualMap(baseRuntimePageVisualMap, stitchHandoff);
const runtimeIconMap = readJsonIfExists("outputs/config/app-config/icon-map.json", templateIconMap);
const runtimeAssetsManifest = normalizeAssetManifest(readJsonIfExists(
  "outputs/config/app-config/assets-manifest.json",
  readJsonIfExists("outputs/assets/asset-manifest.json", templateAssetsManifest)
));

const cssTokens = {
  primary: runtimeTheme.colorTokens?.primary ?? templateTheme.colorTokens.primary,
  accent: runtimeTheme.colorTokens?.accent ?? templateTheme.colorTokens.accent,
  bg: runtimeTheme.colorSystem?.background ?? runtimeTheme.colorTokens?.background ?? templateTheme.colorTokens.background,
  surface: runtimeTheme.colorTokens?.surface ?? templateTheme.colorTokens.surface,
  surfaceAlt: runtimeTheme.colorTokens?.surfaceAlt ?? templateTheme.colorTokens.surfaceAlt,
  text: runtimeTheme.colorTokens?.text ?? templateTheme.colorTokens.text,
  muted: runtimeTheme.colorTokens?.muted ?? templateTheme.colorTokens.muted,
  border: runtimeTheme.colorTokens?.border ?? templateTheme.colorTokens.border,
  disabled: runtimeTheme.colorTokens?.disabled ?? templateTheme.colorTokens.disabled,
  warning: runtimeTheme.colorTokens?.warning ?? templateTheme.colorTokens.warning,
  info: runtimeTheme.colorTokens?.info ?? templateTheme.colorTokens.info,
  fontFamily: runtimeTheme.typography?.fontFamily ?? templateTheme.typography.fontFamily,
  headlineFamily: runtimeTheme.typography?.headlineFamily ?? runtimeTheme.typography?.fontFamily ?? templateTheme.typography.fontFamily,
  headingWeight: runtimeTheme.typography?.headingWeight ?? 760,
  bodyWeight: runtimeTheme.typography?.bodyWeight ?? 500,
  cardRadius: runtimeTheme.shape?.cardRadius ?? 16,
  controlRadius: runtimeTheme.shape?.controlRadius ?? 8,
  buttonRadius: runtimeTheme.shape?.buttonRadius ?? 12
};
const bodyImageBackground = relativeLuminance(cssTokens.bg) < 0.42 ? "#07080A" : "#FFFFFF";
const imageOptionBackground = bodyImageBackground;

const files = new Map();

files.set("outputs/app/package.json", `${JSON.stringify(packageJson, null, 2)}\n`);
files.set("outputs/app/index.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Web2App Runtime Template</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);
files.set("outputs/app/tsconfig.json", `${JSON.stringify({
  compilerOptions: {
    target: "ES2020",
    useDefineForClassFields: true,
    lib: ["DOM", "DOM.Iterable", "ES2020"],
    allowJs: false,
    skipLibCheck: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    strict: true,
    forceConsistentCasingInFileNames: true,
    module: "ESNext",
    moduleResolution: "Node",
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,
    jsx: "react-jsx"
  },
  include: ["src"],
  references: []
}, null, 2)}\n`);
files.set("outputs/app/.env.example", `VITE_BILLING_API_BASE_URL=https://billing-dev.cloud.7mfitness.com
VITE_BILLING_APP_CODE=oog126_dev
VITE_BILLING_PLACEMENT_CODE=O2MGB
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51O5L81DOSX8YAb7RBP6pbsCt2Nyh9WJgmarDuYY7i25D9EXZQYc1s39FkSq3TOWUyFnKAaS0x1zM8BiVozEdsho300CTYNpxNj
VITE_FIRESTORE_FUNNEL_COLLECTION=test
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxx
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_MIXPANEL_TOKEN=3392ba9657bd7e259393334e088e7cb7
VITE_MIXPANEL_DEBUG=false
VITE_APP_ENV=dev
`);
files.set("outputs/app/src/vite-env.d.ts", `/// <reference types="vite/client" />
`);
files.set("outputs/app/src/main.tsx", `import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./runtime/App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`);
files.set("outputs/app/src/runtime/types.ts", `export type PageType =
  | "entry_page"
  | "intro_page"
  | "single_choice_page"
  | "multi_choice_page"
  | "age_input_page"
  | "height_input_page"
  | "weight_input_page"
  | "email_capture_page"
  | "summary_page"
  | "plan_generation_page"
  | "plan_ready_page"
  | "paywall_page"
  | "payment_success_page"
  | "account_create_page"
  | "login_page"
  | "account_page"
  | "subscription_manage_page"
  | "cancel_subscription_page";

export type OptionItem = {
  label: string;
  value: string;
  icon?: string;
  image?: string;
  assetRequirement?: Record<string, unknown>;
  asset?: AssetEntry;
  [key: string]: unknown;
};

export type ProgressMeta = {
  visible?: boolean;
  countsTowardTotal?: boolean;
  scope?: "ob_questions" | string;
  step?: number;
  total?: number;
  showStepCount?: boolean;
};

export type FunnelPage = {
  id: string;
  pageType: PageType;
  variant?: string;
  phase?: string;
  role?: string;
  sectionId?: string;
  sectionLabel?: string;
  dataKey?: string;
  title: string;
  subtitle?: string;
  body?: string;
  cta?: string;
  options?: OptionItem[];
  minSelections?: number;
  maxSelections?: number;
  units?: string[];
  defaultUnit?: string;
  defaultValue?: number | Record<string, number>;
  showBmiCard?: boolean;
  showTargetWarning?: boolean;
  progressSteps?: string[];
  generationPrompts?: { id?: string; question: string; yesLabel?: string; noLabel?: string; askAtProgress?: number }[];
  progress?: ProgressMeta;
  asset?: AssetEntry;
  assets?: Record<string, AssetEntry>;
  visual?: PageVisualConfig;
  [key: string]: unknown;
};

export type Answers = Record<string, unknown>;

export type Identity = {
  uid: string;
  customToken?: string;
  idToken: string;
  email?: string;
  isAnonymous?: boolean;
};

export type Theme = {
  version?: string;
  colorTokens: Record<string, string>;
  colorSystem?: { background?: string };
  typography?: Record<string, unknown>;
  shape?: Record<string, unknown>;
  [key: string]: unknown;
};

export type FunnelConfig = {
  version?: string;
  product?: {
    appName?: string;
    appCode?: string;
    placementCode?: string;
    appStoreUrl?: string;
    appStoreId?: string;
    category?: string;
    audience?: string;
  };
  pages: FunnelPage[];
  theme?: Theme;
  [key: string]: unknown;
};

export type PageCopyConfig = {
  title?: string;
  subtitle?: string;
  body?: string;
  cta?: string;
  options?: Array<{ value: string; label: string }>;
};

export type CopyConfig = {
  version?: string;
  productSlug?: string;
  pages?: Record<string, PageCopyConfig>;
  [key: string]: unknown;
};

export type PageVisualConfig = Record<string, unknown>;

export type PageVisualMap = {
  version?: string;
  defaults?: PageVisualConfig;
  pageTypes?: Record<string, PageVisualConfig>;
  pages?: Record<string, PageVisualConfig>;
};

export type IconMap = {
  version?: string;
  library?: string;
  optionIcons?: Record<string, string>;
  uiIcons?: Record<string, string>;
};

export type AssetEntry = {
  kind?: string;
  pageId?: string;
  optionValue?: string;
  src?: string;
  requiredInProductRun?: boolean;
  [key: string]: unknown;
};

export type AssetsManifest = {
  version?: string;
  mode?: string;
  model?: string;
  generationSkipped?: boolean;
  reason?: string;
  assets?: Record<string, AssetEntry>;
  [key: string]: unknown;
};

export type RuntimeConfigInput = {
  funnel: FunnelConfig;
  copy?: CopyConfig;
  theme?: Theme;
  pageVisualMap?: PageVisualMap;
  stitchDerivedStyle?: PageVisualMap;
  iconMap?: IconMap;
  assetsManifest?: AssetsManifest;
};

export type SaveAnswer = (
  dataKey: string,
  value: unknown,
  options?: { blocking?: boolean }
) => Promise<void>;
`);
files.set("outputs/app/src/runtime/normalizeRuntimeConfig.ts", `import type { FunnelConfig, OptionItem, RuntimeConfigInput } from "./types";

function assetsForPage(pageId: string, input: RuntimeConfigInput) {
  const assets = input.assetsManifest?.assets || {};
  return Object.fromEntries(
    Object.entries(assets).filter(([, asset]) => asset.pageId === pageId)
  );
}

function primaryAssetForPage(pageId: string, input: RuntimeConfigInput) {
  const pageAssets = Object.values(assetsForPage(pageId, input));
  return pageAssets.find((asset) => asset.type === "page_hero") || pageAssets[0];
}

function mergeOptionLabels(
  pageId: string,
  options: OptionItem[] | undefined,
  input: RuntimeConfigInput
) {
  if (!options?.length) return options;
  const copyOptions = input.copy?.pages?.[pageId]?.options || [];
  const copyByValue = new Map(copyOptions.map((option) => [option.value, option.label]));
  return options.map((option) => {
    const value = String(option.value || "");
    const icon = input.iconMap?.optionIcons?.[\`\${pageId}.\${value}\`];
    const directAsset = input.assetsManifest?.assets?.[\`\${pageId}.\${value}\`];
    const optionAsset = Object.values(input.assetsManifest?.assets || {}).find((asset) => asset.pageId === pageId && asset.optionValue === value);
    const asset = directAsset || optionAsset;
    return {
      ...option,
      label: copyByValue.get(value) || option.label,
      icon: icon || option.icon,
      image: asset?.src || option.image,
      asset
    };
  });
}

export function normalizeRuntimeConfig(input: RuntimeConfigInput): FunnelConfig {
  const theme = input.theme || input.funnel.theme;
  const pages = input.funnel.pages.map((page) => {
    const copy = input.copy?.pages?.[page.id] || {};
    const pageAssets = assetsForPage(page.id, input);
    const pageAsset = primaryAssetForPage(page.id, input);
    const visual = {
      ...(input.pageVisualMap?.defaults || {}),
      ...(input.pageVisualMap?.pageTypes?.[page.pageType] || {}),
      ...(input.pageVisualMap?.pages?.[page.id] || {}),
      ...(input.stitchDerivedStyle?.pageTypes?.[page.pageType] || {}),
      ...(input.stitchDerivedStyle?.pages?.[page.id] || {})
    };
    return {
      ...page,
      title: copy.title || page.title,
      subtitle: copy.subtitle || page.subtitle,
      body: copy.body || page.body,
      cta: copy.cta || page.cta,
      options: mergeOptionLabels(page.id, page.options, input),
      asset: pageAsset,
      assets: pageAssets,
      visual,
      theme
    };
  });
  return {
    ...input.funnel,
    theme,
    pages,
    designConfig: {
      copy: input.copy,
      pageVisualMap: input.pageVisualMap,
      stitchDerivedStyle: input.stitchDerivedStyle,
      iconMap: input.iconMap,
      assetsManifest: input.assetsManifest
    }
  };
}
`);

// Runtime config is emitted once near the end of this generator from neutral/current-run inputs.
// Keep this area free of product-specific embedded JSON so template audits stay clean.

files.set("outputs/app/src/runtime/storage.ts", `import type { Answers, Identity } from "./types";

export const storage = {
  answers: "web2app.answers",
  identity: "web2app.identity",
  route: "web2app.route",
  committedPhase: "web2app.committedPhase",
  selectedPlan: "web2app.selectedPlan",
  checkout: "web2app.checkout",
  subscription: "web2app.subscription"
} as const;

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function readAnswers() {
  return readJson<Answers>(storage.answers, {});
}

export function writeAnswers(answers: Answers) {
  writeJson(storage.answers, answers);
}

export function readIdentity() {
  return readJson<Identity | null>(storage.identity, null);
}

export function writeIdentity(identity: Identity) {
  writeJson(storage.identity, identity);
}

export function hasSessionIdentity() {
  return Boolean(readIdentity()?.uid);
}

export function clearRuntimeSession() {
  sessionStorage.removeItem(storage.answers);
  sessionStorage.removeItem(storage.identity);
  sessionStorage.removeItem(storage.route);
  sessionStorage.removeItem(storage.committedPhase);
  sessionStorage.removeItem(storage.selectedPlan);
  sessionStorage.removeItem(storage.checkout);
  sessionStorage.removeItem(storage.subscription);
}

export function committedPhase() {
  return sessionStorage.getItem(storage.committedPhase) || "entry";
}

export function commitPhase(phase: string) {
  sessionStorage.setItem(storage.committedPhase, phase);
}

`);
files.set("outputs/app/src/runtime/unitConversion.ts", `export type HeightValue = {
  cm: number;
  in: number;
  ft: number;
  inch: number;
};

export type WeightValue = {
  kg: number;
  lbs: number;
};

export function normalizeUnit(value: string) {
  const normalized = value.toLowerCase();
  if (normalized === "lb") return "lbs";
  if (normalized === "ft" || normalized === "feet" || normalized === "ft_in") return "in";
  return normalized;
}

export function cmToImperial(cm: number) {
  const totalInches = Math.round(cm / 2.54);
  return {
    in: totalInches,
    ft: Math.floor(totalInches / 12),
    inch: totalInches % 12
  };
}

export function inchesToCm(inches: number) {
  return Math.round(inches * 2.54);
}

export function normalizeHeightFromDisplay(unit: string, value: number): HeightValue {
  const normalized = normalizeUnit(unit);
  const cm = normalized === "cm" ? Math.round(value) : inchesToCm(value);
  const imperial = cmToImperial(cm);
  return { cm, ...imperial };
}

export function kgToLbs(kg: number) {
  return Math.round(kg * 2.20462);
}

export function lbsToKg(lbs: number) {
  return Math.round((lbs / 2.20462) * 10) / 10;
}

export function normalizeWeightFromDisplay(unit: string, value: number): WeightValue {
  const normalized = normalizeUnit(unit);
  const kg = normalized === "kg" ? Math.round(value * 10) / 10 : lbsToKg(value);
  return { kg, lbs: kgToLbs(kg) };
}

export function calculateBmi(heightCm?: number, weightKg?: number) {
  if (!heightCm || !weightKg) return null;
  const meters = heightCm / 100;
  return Math.round((weightKg / (meters * meters)) * 10) / 10;
}

export function bmiCategory(bmi: number | null) {
  if (!bmi) return null;
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

export function targetWeightWarning(currentKg?: number, targetKg?: number, heightCm?: number) {
  if (!currentKg || !targetKg) return null;
  const delta = Math.round((targetKg - currentKg) * 10) / 10;
  const absDelta = Math.abs(delta);
  const deltaKg = Math.round(absDelta * 10) / 10;
  const deltaLbs = kgToLbs(absDelta);
  const deltaDirection = absDelta <= 1 ? "maintain" : delta < 0 ? "decrease" : "increase";
  const deltaLabel =
    deltaDirection === "maintain"
      ? "Maintain within 1 kg"
      : \`\${deltaDirection === "decrease" ? "Decrease" : "Increase"} \${deltaKg} kg / \${deltaLbs} lbs\`;
  const deltaInfo = { deltaKg, deltaLbs, deltaDirection, deltaLabel };
  const lossRatio = (currentKg - targetKg) / currentKg;
  const targetBmi = calculateBmi(heightCm, targetKg);
  if (targetBmi && targetBmi < 18.5) {
    return {
      ...deltaInfo,
      tone: "warning",
      icon: "!",
      title: "Low weight alert",
      body: "This target may be below a typical healthy range for your height. We'll keep the plan focused on safer pacing and supportive habits."
    };
  }
  if (lossRatio > 0.25) {
    return {
      ...deltaInfo,
      tone: "warning",
      icon: "!",
      title: "Long-term transformation goal",
      body: "This is a bigger change, so we'll focus on steady progress, safe pacing, and habits you can keep."
    };
  }
  if (absDelta <= 1) {
    return {
      ...deltaInfo,
      tone: "steady",
      icon: "✓",
      title: "Steady target",
      body: "This goal helps us build a plan focused on consistency, strength, and keeping your progress stable."
    };
  }
  if (delta < 0 && absDelta <= 5) {
    return {
      ...deltaInfo,
      tone: "loss-light",
      icon: "↓",
      title: "Gentle weight-loss goal",
      body: "We'll pace your plan around small, sustainable changes that fit into your routine."
    };
  }
  if (delta < 0 && absDelta <= 20) {
    return {
      ...deltaInfo,
      tone: "loss-structured",
      icon: "↓",
      title: "Structured weight-loss goal",
      body: "We'll break this target into realistic milestones so your plan feels clear and manageable."
    };
  }
  if (delta < 0) {
    return {
      ...deltaInfo,
      tone: "warning",
      icon: "!",
      title: "Long-term transformation goal",
      body: "This is a bigger change, so we'll focus on steady progress, safe pacing, and habits you can keep."
    };
  }
  if (delta > 0 && absDelta <= 5) {
    return {
      ...deltaInfo,
      tone: "gain-light",
      icon: "↑",
      title: "Lean-gain goal",
      body: "We'll help you build a plan focused on strength, consistency, and healthy weight gain."
    };
  }
  if (delta > 0) {
    return {
      ...deltaInfo,
      tone: "gain-structured",
      icon: "↑",
      title: "Build-up goal",
      body: "We'll pace your plan around gradual progress, strength work, and routines that support healthy gains."
    };
  }
  return {
    ...deltaInfo,
    tone: "steady",
    icon: "✓",
    title: "Steady target",
    body: "This goal helps us build a plan focused on consistency, strength, and keeping your progress stable."
  };
}
`);
files.set("outputs/app/src/runtime/firebase.ts", `import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  browserSessionPersistence,
  getAuth,
  getIdToken,
  setPersistence,
  signInWithCustomToken
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import type { Answers, Identity } from "./types";
import { readIdentity, writeIdentity } from "./storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD7qDq0xFZxAGlc-A7OWyUGW9RnTXYirUc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "laien-billing-platform.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "laien-billing-platform",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "laien-billing-platform.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "70140096854",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:70140096854:web:505eb78571be66a3b7e6f7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XEJVTE2HCB"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
void setPersistence(firebaseAuth, browserSessionPersistence);
void isSupported().then((ok) => ok ? getAnalytics(firebaseApp) : undefined);
export const firestoreDb = getFirestore(firebaseApp);
export const firestoreCollection = import.meta.env.VITE_FIRESTORE_FUNNEL_COLLECTION || "test";

export async function signInBillingCustomToken(data: {
  uid?: string;
  customToken: string;
  email?: string;
  isAnonymous?: boolean;
}) {
  await signInWithCustomToken(firebaseAuth, data.customToken);
  const current = firebaseAuth.currentUser;
  if (!current) throw new Error("Firebase sign-in failed.");
  const idToken = await getIdToken(current, true);
  const identity: Identity = {
    uid: data.uid || current.uid,
    customToken: data.customToken,
    idToken,
    email: data.email,
    isAnonymous: data.isAnonymous ?? true
  };
  writeIdentity(identity);
  return identity;
}

export async function refreshIdentityToken() {
  const identity = readIdentity();
  if (!identity?.uid) return null;
  const current = firebaseAuth.currentUser;
  const idToken = current ? await getIdToken(current, true) : identity.idToken;
  const refreshed = { ...identity, idToken };
  writeIdentity(refreshed);
  return refreshed;
}

export async function persistAnswersToFirestore(identity: Identity, answers: Answers) {
  await setDoc(doc(firestoreDb, firestoreCollection, identity.uid), answers, { merge: true });
}
`);
files.set("outputs/app/src/runtime/billingClient.ts", `import type { Identity } from "./types";

const apiBase = import.meta.env.VITE_BILLING_API_BASE_URL || "https://billing-dev.cloud.7mfitness.com";
const appCode = import.meta.env.VITE_BILLING_APP_CODE || "oog126_dev";
export const placementCode = import.meta.env.VITE_BILLING_PLACEMENT_CODE || "O2MGB";

type BillingInit = RequestInit & { token?: string };

export async function billingFetch(path: string, init: BillingInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  headers.set("ngrok-skip-browser-warning", "true");
  if (init.token) headers.set("Authorization", \`Bearer \${init.token}\`);
  const response = await fetch(\`\${apiBase}\${path}\`, {
    ...init,
    headers,
    credentials: "omit"
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || \`Billing request failed: \${response.status}\`);
  }
  return payload.data ?? payload;
}

export function createAnonymousUser() {
  return billingFetch(\`/billing/\${appCode}/v1/users/anonymous\`, { method: "POST" });
}

export function bindCurrentUser(identity: Identity, email?: string) {
  return billingFetch(\`/billing/\${appCode}/v1/users/current\`, {
    method: "POST",
    token: identity.idToken,
    body: JSON.stringify({ uid: identity.uid, firebaseUid: identity.uid, email })
  });
}

export function loginEmailUser(email: string, password: string) {
  return billingFetch(\`/billing/\${appCode}/v1/users/login\`, {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function registerFromAnonymous(identity: Identity, email: string, password: string) {
  return billingFetch(\`/billing/\${appCode}/v1/users/register-from-anonymous\`, {
    method: "POST",
    token: identity.idToken,
    body: JSON.stringify({ uid: identity.uid, email, password })
  });
}

function runtimePlacementCode(explicitCode?: string) {
  if (explicitCode) return explicitCode;
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search).get("lpid") || placementCode;
  }
  return placementCode;
}

export function resolveOffers(code?: string, discountType?: "normal" | "discount" | "further_discount") {
  const params = new URLSearchParams({
    placementCode: runtimePlacementCode(code),
    discountType: discountType || (typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("discountType") as "normal" | "discount" | "further_discount" | null) || "discount"
      : "discount")
  });
  return billingFetch(\`/billing/\${appCode}/v1/paywalls/resolve/offers?\${params.toString()}\`);
}

export function createStripeEmbeddedSession(input: {
  identity: Identity;
  email?: string;
  priceId: string;
  returnUrl: string;
  idempotencyKey: string;
  visitor: boolean;
}) {
  return billingFetch(\`/billing/\${appCode}/v1/checkout/stripe/embedded-session\`, {
    method: "POST",
    token: input.identity.idToken,
    body: JSON.stringify({
      uid: input.identity.uid,
      email: input.email,
      priceId: input.priceId,
      returnUrl: input.returnUrl,
      idempotencyKey: input.idempotencyKey,
      visitor: input.visitor
    })
  });
}

export function getSubscriptions(identity: Identity) {
  return billingFetch(\`/billing/\${appCode}/v1/subscriptions?uid=\${encodeURIComponent(identity.uid)}\`, {
    token: identity.idToken
  });
}

export function getSubscriptionStatus(identity: Identity) {
  return billingFetch(\`/billing/\${appCode}/v1/subscriptions/status?uid=\${encodeURIComponent(identity.uid)}\`, {
    token: identity.idToken
  });
}

export function getEntitlements(identity: Identity) {
  return billingFetch(\`/billing/\${appCode}/v1/entitlements?uid=\${encodeURIComponent(identity.uid)}\`, {
    token: identity.idToken
  });
}

export function requestCancelSubscription(identity: Identity, subscriptionId?: string) {
  return billingFetch(\`/billing/\${appCode}/v1/subscriptions/cancel\`, {
    method: "POST",
    token: identity.idToken,
    body: JSON.stringify({ uid: identity.uid, subscriptionId })
  });
}

`);
files.set("outputs/app/src/runtime/analytics.ts", `import mixpanel from "mixpanel-browser";
import type { FunnelPage } from "./types";
import { readIdentity } from "./storage";

export type AnalyticsEventName =
  | "OB Started"
  | "OB Step Viewed"
  | "OB Answer Submitted"
  | "OB Step Back"
  | "Identity Created"
  | "Email Submitted"
  | "Summary Viewed"
  | "Plan Generation Started"
  | "Plan Generation Completed"
  | "Plan Ready Viewed"
  | "Paywall Viewed"
  | "Offer Selected"
  | "Checkout Started"
  | "Checkout Failed"
  | "Purchase Completed"
  | "Account Created"
  | "Login Succeeded"
  | "Subscription Viewed"
  | "Cancel Subscription Clicked";

type AnalyticsProps = Record<string, unknown>;

const token = import.meta.env.VITE_MIXPANEL_TOKEN || "3392ba9657bd7e259393334e088e7cb7";
const debug = import.meta.env.VITE_MIXPANEL_DEBUG === "true";
let initialized = false;

function cleanProps(props: AnalyticsProps) {
  return Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

function sourceValue() {
  if (typeof window === "undefined") return "direct";
  const params = new URLSearchParams(window.location.search);
  return params.get("utm_source") || params.get("source") || params.get("lpid") || "direct";
}

function globalProps(page?: FunnelPage): AnalyticsProps {
  return cleanProps({
    uid: readIdentity()?.uid,
    page_id: page?.id,
    section: page?.sectionLabel || page?.sectionId || page?.phase,
    source: sourceValue(),
    env: import.meta.env.VITE_APP_ENV || import.meta.env.MODE || "dev"
  });
}

export function initAnalytics() {
  if (initialized || !token) return;
  mixpanel.init(token, {
    debug,
    persistence: "localStorage",
    ignore_dnt: false
  });
  initialized = true;
}

export function identifyAnalytics(uid?: string) {
  initAnalytics();
  if (uid) mixpanel.identify(uid);
}

export function resetAnalytics() {
  initAnalytics();
  mixpanel.reset();
}

export function trackEvent(eventName: AnalyticsEventName, page?: FunnelPage, props: AnalyticsProps = {}) {
  initAnalytics();
  mixpanel.track(eventName, cleanProps({ ...globalProps(page), ...props }));
}

export function emailDomain(email: string) {
  return email.split("@")[1]?.toLowerCase() || "unknown";
}

export function answerAnalyticsProps(page: FunnelPage, value: unknown): AnalyticsProps {
  return cleanProps({
    data_key: page.dataKey,
    answer_value: Array.isArray(value) ? undefined : value,
    answer_count: Array.isArray(value) ? value.length : 1,
    page_type: page.pageType
  });
}

`);
files.set("outputs/app/src/runtime/answerStore.ts", `import type { Answers, SaveAnswer } from "./types";
import { createAnonymousUser } from "./billingClient";
import { persistAnswersToFirestore, signInBillingCustomToken } from "./firebase";
import { hasSessionIdentity, readAnswers, readIdentity, writeAnswers } from "./storage";
import { identifyAnalytics, trackEvent } from "./analytics";

export async function ensureIdentityForFirstAnswer() {
  const existing = readIdentity();
  if (existing?.uid) return existing;
  const anonymous = await createAnonymousUser();
  const identity = await signInBillingCustomToken({ ...anonymous, isAnonymous: true });
  identifyAnalytics(identity.uid);
  trackEvent("Identity Created", undefined, { uid: identity.uid });
  return identity;
}

export async function syncAnswer(answers: Answers, options?: { blocking?: boolean }) {
  let identity = readIdentity();
  if (!identity?.uid) {
    if (!options?.blocking) return;
    identity = await ensureIdentityForFirstAnswer();
  }
  await persistAnswersToFirestore(identity, answers);
}

export function createSaveAnswer(setAnswers: (answers: Answers) => void): SaveAnswer {
  const saveAnswer = async (dataKey: string, value: unknown, options?: { blocking?: boolean }) => {
    const answers = { ...readAnswers(), [dataKey]: value };
    writeAnswers(answers);
    setAnswers(answers);
    if (options?.blocking) {
      await syncAnswer(answers, options);
      return;
    }
    void syncAnswer(answers).catch((error) => {
      console.warn("Answer sync failed", error);
    });
  };
  return saveAnswer;
}

export { hasSessionIdentity };

`);
files.set("outputs/app/src/runtime/navigation.ts", `import type { FunnelPage } from "./types";

export function routeFromUrl(defaultRoute = "age_group") {
  const params = new URLSearchParams(window.location.search);
  return params.get("page") || defaultRoute;
}

export function routeTo(id: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", id);
  window.history.pushState({}, "", url);
  window.dispatchEvent(new Event("routechange"));
}

export function nextPage(pages: FunnelPage[], id: string) {
  const index = pages.findIndex((page) => page.id === id);
  return pages[Math.min(index + 1, pages.length - 1)];
}

export function isClosedSessionPage(page: FunnelPage) {
  return [
    "payment_success_page"
  ].includes(page.pageType);
}

`);
files.set("outputs/app/src/runtime/identityGuards.ts", `import { refreshIdentityToken } from "./firebase";
import { readIdentity } from "./storage";
import { routeTo } from "./navigation";

export async function ensureIdentity() {
  const identity = await refreshIdentityToken();
  if (!identity?.uid) throw new Error("Missing session identity.");
  return identity;
}

export async function requireSessionIdentity(route: string) {
  const existing = readIdentity();
  if (!existing?.uid) {
    routeTo(route);
    throw new Error("Please start or log in first.");
  }
  return ensureIdentity();
}
`);
files.set("outputs/app/src/runtime/rendererRegistry.tsx", `import type { FunnelPage, SaveAnswer, Answers } from "./types";
import { EntryPage } from "../components/EntryPage";
import { IntroPage } from "../components/IntroPage";
import { SingleChoicePage } from "../components/SingleChoicePage";
import { MultiChoicePage } from "../components/MultiChoicePage";
import { AgeInputPage } from "../components/AgeInputPage";
import { HeightInputPage } from "../components/HeightInputPage";
import { WeightInputPage } from "../components/WeightInputPage";
import { EmailInputPage } from "../components/EmailInputPage";
import { SummaryPage } from "../components/SummaryPage";
import { PlanGenerationPage } from "../components/PlanGenerationPage";
import { PlanReadyPage } from "../components/PlanReadyPage";
import { PaywallPage } from "../components/PaywallPage";
import { PaymentSuccessPage } from "../components/PaymentSuccessPage";
import { AccountCreatePage } from "../components/AccountCreatePage";
import { LoginPage } from "../components/LoginPage";
import { ProfilePage } from "../components/ProfilePage";
import { PlaceholderPage } from "../components/PlaceholderPage";

export type RendererProps = {
  page: FunnelPage;
  answers: Answers;
  saveAnswer: SaveAnswer;
  onNext: () => void;
};

export function renderPage(props: RendererProps) {
  const { page } = props;
  if (page.pageType === "entry_page") return <EntryPage {...props} />;
  if (page.pageType === "intro_page") return <IntroPage {...props} />;
  if (page.pageType === "single_choice_page") return <SingleChoicePage {...props} />;
  if (page.pageType === "multi_choice_page") return <MultiChoicePage {...props} />;
  if (page.pageType === "age_input_page") return <AgeInputPage {...props} />;
  if (page.pageType === "height_input_page") return <HeightInputPage {...props} />;
  if (page.pageType === "weight_input_page") return <WeightInputPage {...props} />;
  if (page.pageType === "email_capture_page") return <EmailInputPage {...props} />;
  if (page.pageType === "summary_page") return <SummaryPage {...props} />;
  if (page.pageType === "plan_generation_page") return <PlanGenerationPage {...props} />;
  if (page.pageType === "plan_ready_page") return <PlanReadyPage {...props} />;
  if (page.pageType === "paywall_page") return <PaywallPage {...props} />;
  if (page.pageType === "payment_success_page") return <PaymentSuccessPage {...props} />;
  if (page.pageType === "account_create_page") return <AccountCreatePage {...props} />;
  if (page.pageType === "login_page") return <LoginPage {...props} />;
  if (page.pageType === "account_page") return <ProfilePage {...props} />;
  return <PlaceholderPage {...props} />;
}
`);
files.set("outputs/app/src/runtime/App.tsx", `import { useEffect, useMemo, useRef, useState } from "react";
import { clearRuntimeSession, readAnswers, storage } from "./storage";
import { templateConfig } from "./templateConfig";
import { createSaveAnswer } from "./answerStore";
import { isClosedSessionPage, nextPage, routeFromUrl, routeTo } from "./navigation";
import { initAnalytics, resetAnalytics, trackEvent } from "./analytics";
import { TopProgress } from "../components/TopProgress";
import { renderPage } from "./rendererRegistry";

const fixedCtaPageTypes = new Set([
  "intro_page",
  "multi_choice_page",
  "age_input_page",
  "height_input_page",
  "weight_input_page",
  "email_capture_page",
  "summary_page",
  "plan_generation_page",
  "plan_ready_page"
]);

export function App() {
  const pages = templateConfig.pages;
  const [route, setRoute] = useState(routeFromUrl(pages[0]?.id));
  const [answers, setAnswers] = useState(readAnswers());
  const saveAnswer = useMemo(() => createSaveAnswer(setAnswers), []);
  const page = pages.find((item) => item.id === route) || pages[0];
  const visualClass = typeof page.visual?.pageClass === "string" ? page.visual.pageClass : "";
  const lastViewedRef = useRef("");

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const syncRoute = () => setRoute(routeFromUrl(pages[0]?.id));
    window.addEventListener("popstate", syncRoute);
    window.addEventListener("routechange", syncRoute);
    return () => {
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("routechange", syncRoute);
    };
  }, [pages]);

  useEffect(() => {
    if (!page || lastViewedRef.current === page.id) return;
    lastViewedRef.current = page.id;
    if (page.progress?.scope === "ob_questions") {
      trackEvent("OB Step Viewed", page, { page_type: page.pageType });
    } else if (page.pageType === "summary_page") {
      trackEvent("Summary Viewed", page);
    } else if (page.pageType === "plan_ready_page") {
      trackEvent("Plan Ready Viewed", page);
    } else if (page.pageType === "payment_success_page") {
      trackEvent("Purchase Completed", page);
    }
  }, [page]);

  const goNext = () => {
    routeTo(nextPage(pages, page.id).id);
  };

  const startNewPlan = () => {
    resetAnalytics();
    clearRuntimeSession();
    setAnswers({});
    routeTo(pages[0].id);
  };

  return (
    <div className={\`app-shell shell-page-\${page.pageType} \${visualClass} \${page.id === "entry" ? "shell-entry" : ""}\`}>
      <TopProgress page={page} pages={pages} />
      <div className="desktop-layout">
        <main key={page.id} className={\`screen-main page-type-\${page.pageType} \${visualClass} \${page.progress?.scope === "ob_questions" ? "is-ob-transition" : ""} \${fixedCtaPageTypes.has(page.pageType) ? "has-fixed-cta" : ""} \${page.id === "entry" ? "page-id-entry" : ""}\`}>
          {renderPage({ page, answers, saveAnswer, onNext: goNext })}
        </main>
      </div>
      {isClosedSessionPage(page) ? (
        <button className="new-plan-link" onClick={startNewPlan}>
          Start a new plan
        </button>
      ) : null}
      <button className="debug-reset" onClick={() => {
        sessionStorage.removeItem(storage.answers);
        sessionStorage.removeItem(storage.identity);
        startNewPlan();
      }}>
        Reset template
      </button>
    </div>
  );
}

`);
files.set("outputs/app/src/components/TopProgress.tsx", `import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { FunnelPage } from "../runtime/types";
import { routeTo } from "../runtime/navigation";

const PAYWALL_COUNTDOWN_KEY = "web2app.paywallDiscountEndsAt";
const PAYWALL_COUNTDOWN_MS = 10 * 60 * 1000;

function getPaywallCountdownEnd() {
  const existing = Number(sessionStorage.getItem(PAYWALL_COUNTDOWN_KEY));
  if (Number.isFinite(existing) && existing > Date.now()) return existing;
  const next = Date.now() + PAYWALL_COUNTDOWN_MS;
  sessionStorage.setItem(PAYWALL_COUNTDOWN_KEY, String(next));
  return next;
}

function formatCountdown(ms: number) {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.ceil(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return \`\${String(minutes).padStart(2, "0")}:\${String(seconds).padStart(2, "0")}\`;
}

function PaywallCountdown() {
  const [endsAt] = useState(getPaywallCountdownEnd);
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, endsAt - Date.now()));

  useEffect(() => {
    let notified = false;
    const tick = () => {
      const nextRemaining = Math.max(0, endsAt - Date.now());
      setRemainingMs(nextRemaining);
      if (!notified && nextRemaining <= 0) {
        notified = true;
        window.dispatchEvent(new CustomEvent("paywall:discount-expired"));
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  return (
    <div className="paywall-countdown">
      <div>
        <span>Discount reserved for</span>
        <strong>{formatCountdown(remainingMs)}</strong>
      </div>
      <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("paywall:scroll-to-nearest-plan"))}>Get my plan</button>
    </div>
  );
}

type SectionSegment = {
  id: string;
  label: string;
  pages: FunnelPage[];
};

function isObProgressPage(page: FunnelPage) {
  return page.progress?.scope === "ob_questions" && page.progress?.countsTowardTotal !== false;
}

function sectionKey(page: FunnelPage) {
  return page.sectionId || page.sectionLabel || page.phase || "onboarding";
}

function buildSections(pages: FunnelPage[]) {
  const sections: SectionSegment[] = [];
  for (const item of pages.filter(isObProgressPage)) {
    const id = sectionKey(item);
    let section = sections.find((candidate) => candidate.id === id);
    if (!section) {
      section = {
        id,
        label: item.sectionLabel || item.phase || "Onboarding",
        pages: []
      };
      sections.push(section);
    }
    section.pages.push(item);
  }
  return sections;
}

function segmentFill(section: SectionSegment, page: FunnelPage, activeIndex: number, sectionIndex: number) {
  if (sectionIndex < activeIndex) return 100;
  if (sectionIndex > activeIndex) return 0;
  const currentIndex = Math.max(0, section.pages.findIndex((item) => item.id === page.id));
  return Math.max(12, ((currentIndex + 1) / Math.max(1, section.pages.length)) * 100);
}

function SectionProgress({ page, pages }: { page: FunnelPage; pages: FunnelPage[] }) {
  const sections = buildSections(pages);
  const activeIndex = Math.max(0, sections.findIndex((section) => section.id === sectionKey(page)));
  const activeSection = sections[activeIndex];
  if (!activeSection) return null;
  return (
    <>
      <strong>{activeSection.label}</strong>
      <div className="section-progress" aria-label="Onboarding section progress">
        {sections.map((section, index) => (
          <span className={index <= activeIndex ? "active" : ""} key={section.id}>
            <i style={{ width: \`\${segmentFill(section, page, activeIndex, index)}%\` }} />
          </span>
        ))}
      </div>
    </>
  );
}

export function TopProgress({ page, pages }: { page: FunnelPage; pages: FunnelPage[] }) {
  const progress = page.progress;
  const progressStep = progress?.step;
  const progressTotal = progress?.total;
  if (page.pageType === "entry_page") return null;
  if (page.pageType === "login_page") {
    return (
      <button className="auth-back-button" aria-label="Back to home" onClick={() => routeTo("entry")}>
          <ArrowLeft size={22} />
      </button>
    );
  }
  if (page.pageType === "account_create_page") {
    return <div className="simple-top-rule" aria-hidden="true" />;
  }
  if (page.pageType === "paywall_page") {
    return (
      <header className="topbar paywall-topbar">
        <PaywallCountdown />
      </header>
    );
  }
  return (
    <header className={progress?.scope === "ob_questions" ? "topbar ob-topbar" : "topbar"}>
      <button className="icon-button" aria-label="Back" onClick={() => window.history.back()}>
        <ArrowLeft size={22} />
      </button>
      <div className="topbar-center">
        {progress?.scope === "ob_questions" ? <SectionProgress page={page} pages={pages} /> : <strong>{page.sectionLabel || page.title}</strong>}
      </div>
      <div className="progress-count" aria-hidden="true">{progress?.showStepCount && progressStep && progressTotal ? \`\${progressStep}/\${progressTotal}\` : ""}</div>
    </header>
  );
}

`);
files.set("outputs/app/src/components/Icon.tsx", `import * as Icons from "lucide-react";

export function Icon({ name }: { name?: string }) {
  const Component = ((Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[name || "Circle"] || Icons.Circle);
  return <Component size={21} strokeWidth={2.1} />;
}
`);
files.set("outputs/app/src/components/Spinner.tsx", `export function Spinner({ label = "Loading" }: { label?: string }) {
  return <span className="spinner" role="status" aria-label={label} />;
}

export function LoadingOverlay({ active, label = "Loading" }: { active: boolean; label?: string }) {
  if (!active) return null;
  return (
    <div className="loading-overlay" role="status" aria-label={label} aria-live="polite">
      <div className="loading-overlay-box">
        <Spinner label={label} />
      </div>
    </div>
  );
}
`);
files.set("outputs/app/src/components/EntryPage.tsx", `import type { RendererProps } from "../runtime/rendererRegistry";
import { routeTo } from "../runtime/navigation";
import { clearRuntimeSession } from "../runtime/storage";
import { resetAnalytics, trackEvent } from "../runtime/analytics";

function textValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function EntryPage({ page, onNext }: RendererProps) {
  const heroSrc = page.asset?.src;
  const brandName = textValue(page.productName, textValue(page.appName, textValue(page.brandName, "Personalized Plan")));
  const headline = textValue(page.title, textValue(page.subtitle, textValue(page.body, "Build your personalized plan")));
  const subtitle = textValue(page.subtitle);
  const supporting = subtitle && subtitle !== headline ? subtitle : "";
  const start = () => {
    resetAnalytics();
    clearRuntimeSession();
    trackEvent("OB Started", page, { entry_variant: page.variant || "default" });
    onNext();
  };

  return (
    <section className="entry-page">
      {heroSrc ? <img className="entry-hero-image" src={heroSrc} alt="" /> : <div className="entry-hero-fallback" />}
      <div className="entry-scrim" />
      <div className="entry-top">
        <strong>{brandName}</strong>
        <button type="button" onClick={() => routeTo("login")}>Log in</button>
      </div>
      <div className="entry-content">
        <h1>{headline}</h1>
        {supporting ? <p>{supporting}</p> : null}
        <button className="entry-start-button" onClick={start}>{page.cta || "Get started"}</button>
      </div>
    </section>
  );
}

`);
files.set("outputs/app/src/components/ChoiceOptions.tsx", `import { useState } from "react";
import type { FunnelPage, OptionItem } from "../runtime/types";
import { Icon } from "./Icon";

type ChoiceMode = "single" | "multi";

type ChoiceOptionsProps = {
  page: FunnelPage;
  mode: ChoiceMode;
  selectedValues: string[];
  disabled?: boolean;
  onToggle: (value: string) => void;
};

function imageInitial(label: string) {
  return label.trim().charAt(0).toUpperCase() || "?";
}

function OptionImage({ option }: { option: OptionItem }) {
  const [failed, setFailed] = useState(false);
  if (!option.image || failed) {
    return (
      <div className="choice-image-placeholder" aria-hidden="true">
        <span>{imageInitial(option.label)}</span>
      </div>
    );
  }
  return <img src={option.image} alt="" onError={() => setFailed(true)} />;
}

export function ChoiceOptions({ page, mode, selectedValues, disabled = false, onToggle }: ChoiceOptionsProps) {
  const selected = new Set(selectedValues);
  const variant = page.variant || "plain_list";

  if (variant === "image_grid") {
    return (
      <div className={mode === "multi" ? "choice-image-grid multi" : "choice-image-grid"}>
        {(page.options || []).map((option) => {
          const isSelected = selected.has(option.value);
          return (
            <button
              className={isSelected ? "image-choice-card selected" : "image-choice-card"}
              key={option.value}
              disabled={disabled}
              onClick={() => onToggle(option.value)}
            >
              <div className="choice-image-media">
                <OptionImage option={option} />
              </div>
              <div className="choice-image-label">
                <span>{option.label}</span>
                {mode === "multi" ? <span className="choice-check" aria-hidden="true" /> : <span className="choice-arrow">›</span>}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={variant === "icon_list" ? "choice-list icon-list" : "choice-list plain-list"}>
      {(page.options || []).map((option) => {
        const isSelected = selected.has(option.value);
        return (
          <button
            className={isSelected ? "option-row selected" : "option-row"}
            key={option.value}
            disabled={disabled}
            onClick={() => onToggle(option.value)}
          >
            {variant === "icon_list" ? <Icon name={option.icon} /> : null}
            <span>{option.label}</span>
            {mode === "multi" ? <span className="choice-check" aria-hidden="true" /> : null}
          </button>
        );
      })}
    </div>
  );
}
`);
files.set("outputs/app/src/components/IntroPage.tsx", `import type { RendererProps } from "../runtime/rendererRegistry";

export function IntroPage({ page, onNext }: RendererProps) {
  const heroSrc = page.asset?.src;
  return (
    <section className="page-stack centered intro-page">
      <div className="intro-content">
        {heroSrc ? <img className="intro-hero-image" src={heroSrc} alt="" /> : <div className="hero-placeholder" />}
        <h1>{page.title}</h1>
        <p>{page.body || page.subtitle}</p>
      </div>
      <button className="primary-button sticky-button" onClick={onNext}>{page.cta || "Continue"}</button>
    </section>
  );
}
`);
files.set("outputs/app/src/components/SingleChoicePage.tsx", `import { useState } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { hasSessionIdentity } from "../runtime/answerStore";
import { answerAnalyticsProps, trackEvent } from "../runtime/analytics";
import { ChoiceOptions } from "./ChoiceOptions";
import { LoadingOverlay } from "./Spinner";

export function SingleChoicePage({ page, saveAnswer, onNext }: RendererProps) {
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const select = async (value: string) => {
    setError("");
    try {
      if (!hasSessionIdentity()) {
        setStarting(true);
      }
      await saveAnswer(page.dataKey!, value, { blocking: !hasSessionIdentity() });
      trackEvent("OB Answer Submitted", page, answerAnalyticsProps(page, value));
      onNext();
    } catch {
      setError("We couldn't start your session. Please try again.");
    } finally {
      setStarting(false);
    }
  };

  return (
    <section className="page-stack choice-page single-choice-page">
      <div className="choice-header">
        <h1>{page.title}</h1>
        <p>{page.subtitle}</p>
      </div>
      <div className="choice-scroll-area">
        <ChoiceOptions page={page} mode="single" selectedValues={[]} disabled={starting} onToggle={select} />
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <LoadingOverlay active={starting} label="Starting your session" />
    </section>
  );
}

`);
files.set("outputs/app/src/components/MultiChoicePage.tsx", `import type { RendererProps } from "../runtime/rendererRegistry";
import { answerAnalyticsProps, trackEvent } from "../runtime/analytics";
import { ChoiceOptions } from "./ChoiceOptions";

export function MultiChoicePage({ page, answers, saveAnswer, onNext }: RendererProps) {
  const selected = Array.isArray(answers[page.dataKey!]) ? answers[page.dataKey!] as string[] : [];
  const minSelections = page.minSelections ?? 1;
  const disabled = selected.length < minSelections;

  const toggle = (value: string) => {
    const next = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];
    void saveAnswer(page.dataKey!, next);
  };

  return (
    <section className="page-stack choice-page multi-choice-page">
      <div className="choice-header">
        <h1>{page.title}</h1>
        <p>{page.subtitle || "Choose all that apply"}</p>
      </div>
      <div className="choice-scroll-area">
        <ChoiceOptions page={page} mode="multi" selectedValues={selected} onToggle={toggle} />
      </div>
      <button className="primary-button sticky-button" disabled={disabled} onClick={() => {
        trackEvent("OB Answer Submitted", page, answerAnalyticsProps(page, selected));
        onNext();
      }}>Continue</button>
    </section>
  );
}

`);
files.set("outputs/app/src/components/AgeInputPage.tsx", `import { Ruler } from "lucide-react";
import { useState, type CSSProperties } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { answerAnalyticsProps, trackEvent } from "../runtime/analytics";

function initialAge(value: { age?: number } | undefined) {
  return value?.age ? String(Math.round(value.age)) : "22";
}

export function AgeInputPage({ page, saveAnswer, onNext }: RendererProps) {
  const [display, setDisplay] = useState(initialAge(page.defaultValue as { age?: number } | undefined));
  const age = Number(display || 0);
  const valid = age >= 13 && age <= 100;
  const showRangeError = display.length > 0 && !valid;

  const save = () => {
    if (!valid) return;
    void saveAnswer(page.dataKey!, age).then(() => {
      trackEvent("OB Answer Submitted", page, answerAnalyticsProps(page, age));
      onNext();
    });
  };

  return (
    <section className="page-stack measurement-page compact-measurement age-input-page">
      <h1>{page.title}</h1>
      <label className="measurement-line-input age-line-input" style={{ "--digits": Math.max(1, display.length || 1) } as CSSProperties}>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={display}
          placeholder="0"
          onChange={(event) => setDisplay(event.target.value.replace(/\\D/g, ""))}
          aria-label="Age"
        />
      </label>
      {showRangeError ? <p className="measurement-range error-text">Please enter an age from 13 to 100.</p> : null}
      <div className="age-personalization-note">
        <Ruler size={22} />
        <div>
          <strong>We only ask your age to personalize your plan</strong>
          <p>Age helps us adjust workout intensity, pacing, and body insights for you.</p>
        </div>
      </div>
      <button className="primary-button sticky-button" disabled={!valid} onClick={save}>Continue</button>
    </section>
  );
}

`);
files.set("outputs/app/src/components/HeightInputPage.tsx", `import { Ruler } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { answerAnalyticsProps, trackEvent } from "../runtime/analytics";
import { cmToImperial, inchesToCm, normalizeHeightFromDisplay, normalizeUnit } from "../runtime/unitConversion";

function initialCm(value: { cm?: number; in?: number; ft?: number; inch?: number } | undefined) {
  if (value?.cm) return value.cm;
  if (value?.in) return inchesToCm(value.in);
  if (value?.ft || value?.inch) return inchesToCm((value.ft ?? 0) * 12 + (value.inch ?? 0));
  return 165;
}

function initialImperial(value: { cm?: number; in?: number; ft?: number; inch?: number } | undefined) {
  if (value?.ft || value?.inch) return { ft: value.ft ?? 0, inch: value.inch ?? 0 };
  if (value?.in) return cmToImperial(inchesToCm(value.in));
  return cmToImperial(value?.cm ?? 165);
}

function defaultObject(value: unknown): Record<string, number> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, number> : undefined;
}

export function HeightInputPage({ page, saveAnswer, onNext }: RendererProps) {
  const defaultValue = defaultObject(page.defaultValue);
  const [unit, setUnit] = useState(normalizeUnit(page.defaultUnit || "cm"));
  const [cmDisplay, setCmDisplay] = useState(String(initialCm(defaultValue)));
  const imperialDefault = initialImperial(defaultValue);
  const [ftDisplay, setFtDisplay] = useState(String(imperialDefault.ft));
  const [inchDisplay, setInchDisplay] = useState(String(imperialDefault.inch));
  const totalInches = Number(ftDisplay || 0) * 12 + Number(inchDisplay || 0);
  const currentValue = useMemo(() => {
    if (unit === "cm") return normalizeHeightFromDisplay("cm", Number(cmDisplay || 0));
    return normalizeHeightFromDisplay("in", totalInches);
  }, [unit, cmDisplay, totalInches]);
  const unitOptions = page.units || ["ft", "cm"];
  const activeUnitIndex = Math.max(0, unitOptions.findIndex((u) => normalizeUnit(u) === unit));
  const unitTabStyle = { "--active-index": activeUnitIndex, "--unit-count": unitOptions.length } as CSSProperties;
  const valid = unit === "cm" ? currentValue.cm >= 90 && currentValue.cm <= 250 : currentValue.in >= 36 && currentValue.in <= 98;
  const hasInput = unit === "cm" ? cmDisplay.length > 0 : ftDisplay.length > 0 || inchDisplay.length > 0;
  const showRangeError = hasInput && !valid;
  const rangeMessage = unit === "cm" ? "Please enter a value from 90 cm to 250 cm." : "Please enter a value from 3 ft 0 in to 8 ft 2 in.";

  const changeUnit = (nextUnit: string) => {
    const normalized = normalizeUnit(nextUnit);
    if (normalized === unit) return;
    if (normalized === "cm") {
      setCmDisplay(String(currentValue.cm));
    } else {
      const imperial = cmToImperial(currentValue.cm);
      setFtDisplay(String(imperial.ft));
      setInchDisplay(String(imperial.inch));
    }
    setUnit(normalized);
  };

  const save = () => {
    if (!valid) return;
    void saveAnswer(page.dataKey!, currentValue).then(() => {
      trackEvent("OB Answer Submitted", page, answerAnalyticsProps(page, currentValue));
      onNext();
    });
  };

  return (
    <section className="page-stack measurement-page compact-measurement">
      <h1>{page.title}</h1>
      <div className="unit-tabs compact-tabs" style={unitTabStyle}>
        <span className="unit-tabs-indicator" aria-hidden="true" />
        {unitOptions.map((u) => (
          <button key={u} aria-pressed={unit === normalizeUnit(u)} className={unit === normalizeUnit(u) ? "active" : ""} onClick={() => changeUnit(u)}>
            {normalizeUnit(u) === "in" ? "ft" : u}
          </button>
        ))}
      </div>
      {unit === "cm" ? (
        <label className="measurement-line-input" style={{ "--digits": Math.max(1, cmDisplay.length) } as CSSProperties}>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={cmDisplay}
            placeholder="0"
            onChange={(event) => setCmDisplay(event.target.value.replace(/\\D/g, ""))}
            aria-label="Height in centimeters"
          />
          <span>cm</span>
        </label>
      ) : (
        <div className="measurement-line-input imperial-height-inputs" role="group" aria-label="Height in feet and inches">
          <label style={{ "--digits": Math.max(1, ftDisplay.length) } as CSSProperties}>
            <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={ftDisplay}
            placeholder="0"
            onChange={(event) => setFtDisplay(event.target.value.replace(/\\D/g, ""))}
            aria-label="Feet"
          />
            <span>ft</span>
          </label>
          <label style={{ "--digits": Math.max(1, inchDisplay.length) } as CSSProperties}>
            <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={inchDisplay}
            placeholder="0"
            onChange={(event) => setInchDisplay(event.target.value.replace(/\\D/g, ""))}
            aria-label="Inches"
          />
            <span>in</span>
          </label>
        </div>
      )}
      {showRangeError ? <p className="measurement-range error-text">{rangeMessage}</p> : null}
      <div className="height-bmi-note">
        <Ruler size={22} />
        <div>
          <strong>Calculating your body mass index</strong>
          <p>BMI is commonly used as a tool to identify potential weight-related health patterns.</p>
        </div>
      </div>
      <button className="primary-button sticky-button" disabled={!valid} onClick={save}>Continue</button>
    </section>
  );
}

`);
files.set("outputs/app/src/components/WeightInputPage.tsx", `import { useMemo, useState, type CSSProperties } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { answerAnalyticsProps, trackEvent } from "../runtime/analytics";
import { bmiCategory, calculateBmi, kgToLbs, normalizeUnit, normalizeWeightFromDisplay, targetWeightWarning } from "../runtime/unitConversion";

function readHeightCm(answers: Record<string, unknown>) {
  const height = answers.height as { cm?: number } | undefined;
  return height?.cm;
}

function readCurrentWeightKg(answers: Record<string, unknown>) {
  const weight = answers.currentWeight as { kg?: number } | undefined;
  return weight?.kg;
}

function weightDisplay(unit: string, value: { kg?: number; lbs?: number } | undefined) {
  const normalized = normalizeUnit(unit);
  if (normalized === "kg") return value?.kg ? String(Math.round(value.kg)) : "";
  return value?.lbs ? String(Math.round(value.lbs)) : "";
}

function defaultObject(value: unknown): Record<string, number> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, number> : undefined;
}

function bmiInsight(bmi: number | null) {
  if (!bmi) return null;
  if (bmi < 18.5) {
    return {
      tone: "underweight",
      icon: "!",
      label: "underweight",
      body: "You have a clear starting point. We'll use your BMI to shape a plan that supports steady strength, energy, and healthy progress."
    };
  }
  if (bmi < 25) {
    return {
      tone: "normal",
      icon: "✓",
      label: "normal",
      body: "You're starting from a solid place. We'll use your BMI to tailor your plan around your goal, routine, and preferred pace."
    };
  }
  if (bmi < 30) {
    return {
      tone: "overweight",
      icon: "!",
      label: "overweight",
      body: "This gives us useful context for your plan. We'll use your BMI to guide realistic weight-loss pacing and daily workout intensity."
    };
  }
  return {
    tone: "obese",
    icon: "!",
    label: "obese",
    body: "There may be meaningful room for progress. We'll use your BMI to create a plan focused on steady movement, confidence, and sustainable weight loss."
  };
}

export function WeightInputPage({ page, answers, saveAnswer, onNext }: RendererProps) {
  const defaultValue = defaultObject(page.defaultValue);
  const measurementType = typeof page.measurementType === "string" ? page.measurementType : page.variant;
  const isCurrentWeight = measurementType === "current_weight";
  const isTargetWeight = measurementType === "target_weight";
  const shouldShowBmiCard = Boolean(page.showBmiCard) || isCurrentWeight;
  const shouldShowTargetCard = Boolean(page.showTargetWarning || page.showGoalCard) || isTargetWeight;
  const [unit, setUnit] = useState(normalizeUnit(page.defaultUnit || "kg"));
  const [display, setDisplay] = useState(weightDisplay(page.defaultUnit || "kg", defaultValue));
  const numericDisplay = Number(display || 0);
  const currentValue = useMemo(() => normalizeWeightFromDisplay(unit, numericDisplay), [unit, numericDisplay]);
  const heightCm = readHeightCm(answers);
  const bmi = calculateBmi(heightCm, currentValue.kg);
  const category = bmiCategory(bmi);
  const insight = isCurrentWeight ? bmiInsight(bmi) : null;
  const targetWarning = isTargetWeight && shouldShowTargetCard ? targetWeightWarning(readCurrentWeightKg(answers), currentValue.kg, heightCm) : null;
  const unitOptions = page.units || ["lbs", "kg"];
  const activeUnitIndex = Math.max(0, unitOptions.findIndex((u) => normalizeUnit(u) === unit));
  const unitTabStyle = { "--active-index": activeUnitIndex, "--unit-count": unitOptions.length } as CSSProperties;
  const valid = unit === "kg" ? currentValue.kg >= 25 && currentValue.kg <= 300 : currentValue.lbs >= 55 && currentValue.lbs <= 660;
  const showRangeError = display.length > 0 && !valid;
  const rangeMessage = unit === "kg" ? "Please enter a value from 25 kg to 300 kg." : "Please enter a value from 55 lbs to 660 lbs.";

  const changeUnit = (nextUnit: string) => {
    const normalized = normalizeUnit(nextUnit);
    setUnit(normalized);
    setDisplay(normalized === "kg" ? String(Math.round(currentValue.kg)) : String(kgToLbs(currentValue.kg)));
  };

  const save = () => {
    if (!valid) return;
    const payload = {
      ...currentValue,
      ...(isCurrentWeight ? { bmi, bmiCategory: category } : {}),
      ...(isTargetWeight ? { targetBmi: bmi, targetBmiCategory: category } : {})
    };
    void saveAnswer(page.dataKey!, payload).then(() => {
      trackEvent("OB Answer Submitted", page, answerAnalyticsProps(page, payload));
      onNext();
    });
  };

  return (
    <section className="page-stack measurement-page compact-measurement">
      <h1>{page.title}</h1>
      <div className="unit-tabs compact-tabs" style={unitTabStyle}>
        <span className="unit-tabs-indicator" aria-hidden="true" />
        {unitOptions.map((u) => (
          <button key={u} aria-pressed={unit === normalizeUnit(u)} className={unit === normalizeUnit(u) ? "active" : ""} onClick={() => changeUnit(u)}>
            {u}
          </button>
        ))}
      </div>
      <label className="measurement-line-input" style={{ "--digits": Math.max(1, display.length || 1) } as CSSProperties}>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={display}
          placeholder="0"
          onChange={(event) => setDisplay(event.target.value.replace(/\\D/g, ""))}
          aria-label="Weight"
        />
        <span>{unit}</span>
      </label>
      {showRangeError ? <p className="measurement-range error-text">{rangeMessage}</p> : null}
      {shouldShowBmiCard && insight && bmi && display && valid ? (
        <div className={\`bmi-card bmi-card-\${insight.tone}\`}>
          <div className="bmi-card-heading">
            <span className="bmi-card-icon" aria-hidden="true">{insight.icon}</span>
            <strong>Your BMI is {bmi} which is considered <b>{insight.label}</b></strong>
          </div>
          <p>{insight.body}</p>
        </div>
      ) : null}
      {targetWarning && display ? (
        <div className={\`target-weight-card target-weight-card-\${targetWarning.tone}\`}>
          <span className="target-weight-card-icon" aria-hidden="true">{targetWarning.icon}</span>
          <div>
            <strong>{targetWarning.title}</strong>
            <span className="target-weight-delta">{targetWarning.deltaLabel}</span>
            <p>{targetWarning.body}</p>
          </div>
        </div>
      ) : null}
      <button className="primary-button sticky-button" disabled={!valid} onClick={save}>Continue</button>
    </section>
  );
}

`);
files.set("outputs/app/src/components/EmailInputPage.tsx", `import { useState } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { bindCurrentUser } from "../runtime/billingClient";
import { emailDomain, trackEvent } from "../runtime/analytics";
import { refreshIdentityToken } from "../runtime/firebase";
import { readIdentity, writeIdentity } from "../runtime/storage";

function isValidEmail(value: string) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
}

export function EmailInputPage({ page, saveAnswer, onNext }: RendererProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const normalizedEmail = email.trim().toLowerCase();
  const valid = isValidEmail(normalizedEmail);

  const submit = async () => {
    if (!valid) {
      setError("Enter a valid email to continue.");
      return;
    }
    setError("");
    await saveAnswer(page.dataKey!, normalizedEmail);
    const identity = await refreshIdentityToken();
    if (identity?.uid) {
      await bindCurrentUser(identity, normalizedEmail);
      writeIdentity({ ...identity, email: normalizedEmail });
    }
    trackEvent("Email Submitted", page, { email_domain: emailDomain(normalizedEmail) });
    onNext();
  };

  return (
    <section className="page-stack email-capture-page">
      <h1>{page.title}</h1>
      <label className="email-input-wrap">
        <input className="text-input" aria-label="Email" value={email} inputMode="email" autoComplete="email" placeholder="name@example.com" onChange={(event) => setEmail(event.target.value)} />
      </label>
      {error ? <p className="error-text">{error}</p> : null}
      <p className="email-privacy-note">We'll use your email to save your plan and let you access it later. Your answers stay private and are used only to personalize this experience.</p>
      <button className="primary-button sticky-button" disabled={!valid} onClick={submit}>{page.cta || "Continue"}</button>
    </section>
  );
}

`);
files.set("outputs/app/src/components/SummaryPage.tsx", `import { Activity, Dumbbell, HeartPulse, Target } from "lucide-react";
import type { CSSProperties } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { bmiCategory, calculateBmi } from "../runtime/unitConversion";

function asLabel(value: unknown, fallback: string): string {
  if (Array.isArray(value)) return value.map((item) => asLabel(item, "")).filter(Boolean).join(", ") || fallback;
  if (typeof value !== "string") return fallback;
  return value.replace(/_/g, " ").replace(/\\b\\w/g, (letter) => letter.toUpperCase());
}

function readWeightKg(value: unknown) {
  return (value as { kg?: number } | undefined)?.kg;
}

function readHeightCm(value: unknown) {
  return (value as { cm?: number } | undefined)?.cm;
}

function bmiPosition(bmi: number | null) {
  if (!bmi) return 0;
  return Math.max(0, Math.min(100, ((Math.min(bmi, 40) - 15) / 25) * 100));
}

function insightFor(category: string | null) {
  if (category === "normal") {
    return {
      tone: "normal",
      title: "Your starting point looks balanced",
      body: "We'll use this profile to keep your plan focused on consistency, visible progress, and the goal you chose."
    };
  }
  if (category === "underweight") {
    return {
      tone: "underweight",
      title: "Your plan should support strength",
      body: "We'll use your profile to guide a plan that supports energy, confidence, and steady physical progress."
    };
  }
  return {
    tone: category === "obese" ? "obese" : "overweight",
    title: "Your plan should match your starting point",
    body: "We'll use your BMI, goal, and focus areas to personalize pacing and build a plan around sustainable progress."
  };
}

function bodyAssetSrc(page: { assets?: Record<string, { optionValue?: string; src?: string }> }, category: string | null) {
  const normalized = category || "normal";
  const assets = Object.values(page.assets || {});
  return assets.find((asset) => asset.optionValue === normalized)?.src
    || assets.find((asset) => asset.optionValue === "normal")?.src
    || assets[0]?.src;
}

export function SummaryPage({ page, answers, onNext }: RendererProps) {
  const heightCm = readHeightCm(answers.height);
  const currentWeightKg = readWeightKg(answers.currentWeight);
  const targetWeightKg = readWeightKg(answers.targetWeight);
  const bmi = calculateBmi(heightCm, currentWeightKg);
  const category = bmiCategory(bmi);
  const insight = insightFor(category);
  const deltaKg = currentWeightKg && targetWeightKg ? Math.round((currentWeightKg - targetWeightKg) * 10) / 10 : null;
  const bodySrc = bodyAssetSrc(page, category);

  return (
    <section className="page-stack summary-page">
      <h1>{page.title}</h1>
      <div className="summary-bmi-card">
        <div className="summary-bmi-head">
          <strong>Body Mass Index (BMI)</strong>
          <span>{category || "Profile"} {bmi ? \`- \${bmi}\` : ""}</span>
        </div>
        <div className="summary-bmi-scale">
          <span className="summary-bmi-marker" style={{ "--bmi-position": \`\${bmiPosition(bmi)}%\` } as CSSProperties}>
            You {bmi ? \`- \${bmi}\` : ""}
          </span>
          <div className="summary-bmi-track" />
        </div>
        <div className="summary-bmi-ticks">
          <span>15</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40</span>
        </div>
        <div className="summary-bmi-labels">
          <span>Underweight</span>
          <span>Normal</span>
          <span>Overweight</span>
          <span>Obese</span>
        </div>
      </div>
      <div className="summary-profile-grid">
        <div className="summary-facts">
          <div className="summary-fact">
            <Dumbbell size={22} />
            <span>Fitness Level</span>
            <strong>{asLabel(answers.starterLevel, "Personalized")}</strong>
          </div>
          <div className="summary-fact">
            <Target size={22} />
            <span>Main Focus</span>
            <strong>{asLabel(answers.focusAreas, "Your selected areas")}</strong>
          </div>
          <div className="summary-fact">
            <Activity size={22} />
            <span>Goal Change</span>
            <strong>{deltaKg ? \`\${Math.abs(deltaKg)} kg \${deltaKg >= 0 ? "to lose" : "to gain"}\` : "Based on your target"}</strong>
          </div>
        </div>
        <div className={\`summary-body-visual summary-body-\${category || "normal"}\`} aria-label="Body profile visual">
          {bodySrc ? <img src={bodySrc} alt="" /> : <div />}
        </div>
      </div>
      <div className={\`summary-insight-card bmi-card-\${insight.tone}\`}>
        <HeartPulse size={22} />
        <div>
          <strong>{insight.title}</strong>
          <p>{insight.body}</p>
        </div>
      </div>
      <button className="primary-button sticky-button" onClick={onNext}>{page.cta || "Continue"}</button>
    </section>
  );
}
`);
files.set("outputs/app/src/components/PlanGenerationPage.tsx", `import { Check, LoaderCircle, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { trackEvent } from "../runtime/analytics";

const defaultSteps = [
  "Analyzing",
  "Personalizing",
  "Finalizing"
];

const progressStages = [
  { label: "Analyzing", target: 34, duration: 1050, pause: 460 },
  { label: "Personalizing", target: 72, duration: 1300, pause: 560 },
  { label: "Finalizing", target: 96, duration: 1200, pause: 900 },
  { label: "Finalizing", target: 97, duration: 760, pause: 420 },
  { label: "Finalizing", target: 98, duration: 820, pause: 460 },
  { label: "Finalizing", target: 99, duration: 920, pause: 520 },
  { label: "Ready", target: 100, duration: 880, pause: 0 }
];

const testimonials = [
  {
    title: "I knew exactly where to start",
    name: "Marcus",
    body: "The plan gave me a clear baseline and made home training feel structured instead of random."
  },
  {
    title: "Good pace for getting stronger",
    name: "Daniel",
    body: "It pushed me without making the first week feel impossible. That made it easier to keep showing up."
  },
  {
    title: "No equipment, no excuses",
    name: "Ethan",
    body: "I liked having simple bodyweight sessions I could do at home and still feel like I was progressing."
  }
];

const defaultGenerationPrompts = [
  { id: "strength_baseline", question: "Should we start from your current strength level?", yesLabel: "Yes", noLabel: "No", askAtProgress: 28 },
  { id: "focus_priority", question: "Should we prioritize the muscle groups you selected?", yesLabel: "Yes", noLabel: "No", askAtProgress: 56 },
  { id: "home_training_fit", question: "Should the plan stay practical for home training?", yesLabel: "Yes", noLabel: "No", askAtProgress: 82 }
];

export function PlanGenerationPage({ page, saveAnswer, onNext }: RendererProps) {
  const steps = Array.isArray(page.progressSteps) && page.progressSteps.length ? page.progressSteps as string[] : defaultSteps;
  const proofItems = useMemo(() => {
    const source = Array.isArray(page.generationTestimonials) && page.generationTestimonials.length ? page.generationTestimonials : testimonials;
    return source.map((item) => ({
      title: typeof item.title === "string" ? item.title : "Clear and easy to follow",
      name: typeof item.name === "string" ? item.name : "Member",
      body: typeof item.body === "string" ? item.body : typeof item.text === "string" ? item.text : "The plan felt practical and easy to keep using."
    }));
  }, [page.generationTestimonials]);
  const prompts = useMemo(() => {
    const source = Array.isArray(page.generationPrompts) && page.generationPrompts.length ? page.generationPrompts : defaultGenerationPrompts;
    return source
      .map((item, index) => ({
        id: item.id || \`generation_followup_\${index + 1}\`,
        question: item.question,
        yesLabel: item.yesLabel || "Yes",
        noLabel: item.noLabel || "No",
        askAtProgress: typeof item.askAtProgress === "number" ? item.askAtProgress : [28, 56, 82][index] || 82
      }))
      .slice(0, 4)
      .sort((a, b) => a.askAtProgress - b.askAtProgress);
  }, [page.generationPrompts]);
  const [progress, setProgress] = useState(6);
  const [stageIndex, setStageIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [activePromptIndex, setActivePromptIndex] = useState<number | null>(null);
  const [answeredPromptIds, setAnsweredPromptIds] = useState<string[]>([]);
  const [promptAnswers, setPromptAnswers] = useState<Record<string, boolean>>({});
  const resolverRef = useRef<(() => void) | null>(null);
  const startedAtRef = useRef<number>(0);
  const completedRef = useRef(false);
  const statusText = progress >= 100 ? "Ready" : progressStages[stageIndex]?.label || steps[0];
  const testimonial = proofItems[testimonialIndex % proofItems.length];
  const activePrompt = activePromptIndex === null ? null : prompts[activePromptIndex];

  useEffect(() => {
    startedAtRef.current = performance.now();
    trackEvent("Plan Generation Started", page);
    let cancelled = false;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
    const animate = (from: number, to: number, duration: number) => new Promise<void>((resolve) => {
      const start = performance.now();
      const frame = (now: number) => {
        if (cancelled) {
          resolve();
          return;
        }
        const t = Math.min(1, (now - start) / duration);
        setProgress(from + (to - from) * easeOut(t));
        if (t < 1) window.requestAnimationFrame(frame);
        else resolve();
      };
      window.requestAnimationFrame(frame);
    });

    void (async () => {
      let from = 6;
      for (let index = 0; index < progressStages.length; index += 1) {
        const stage = progressStages[index];
        setStageIndex(Math.min(index, steps.length - 1));
        const duePrompts = prompts
          .map((prompt, promptIndex) => ({ prompt, promptIndex }))
          .filter(({ prompt }) => prompt.askAtProgress > from && prompt.askAtProgress <= stage.target);
        for (const { prompt, promptIndex } of duePrompts) {
          await animate(from, prompt.askAtProgress, Math.max(420, stage.duration * ((prompt.askAtProgress - from) / Math.max(1, stage.target - from))));
          from = prompt.askAtProgress;
          if (cancelled) return;
          setActivePromptIndex(promptIndex);
          await new Promise<void>((resolve) => {
            resolverRef.current = resolve;
          });
          if (cancelled) return;
        }
        await animate(from, stage.target, stage.duration);
        from = stage.target;
        if (stage.pause) await wait(stage.pause);
        if (cancelled) return;
      }
    })();

    return () => {
      cancelled = true;
      resolverRef.current?.();
      resolverRef.current = null;
    };
  }, [prompts, steps.length]);

  useEffect(() => {
    if (progress < 100 || completedRef.current) return;
    completedRef.current = true;
    trackEvent("Plan Generation Completed", page, {
      duration_ms: Math.round(performance.now() - startedAtRef.current),
      followup_count: answeredPromptIds.length
    });
  }, [answeredPromptIds.length, page, progress]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestimonialIndex((index) => index + 1);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100 && page.autoAdvance) {
      const timer = window.setTimeout(onNext, 650);
      return () => window.clearTimeout(timer);
    }
  }, [progress, page.autoAdvance, onNext]);

  const answerPrompt = (value: boolean) => {
    if (!activePrompt) return;
    const nextAnswers = { ...promptAnswers, [activePrompt.id]: value };
    setPromptAnswers(nextAnswers);
    setAnsweredPromptIds((ids) => ids.includes(activePrompt.id) ? ids : [...ids, activePrompt.id]);
    void saveAnswer("planGenerationFollowups", nextAnswers);
    trackEvent("OB Answer Submitted", page, {
      data_key: activePrompt.id,
      answer_value: value,
      answer_count: 1,
      page_type: page.pageType
    });
    setActivePromptIndex(null);
    const resolve = resolverRef.current;
    resolverRef.current = null;
    resolve?.();
  };

  return (
    <section className="page-stack plan-generation-page simple-plan-generation-page">
      <div className="simple-generation-content">
        <h1>{page.title}</h1>
        <div className="simple-generation-meter" style={{ "--progress": progress } as CSSProperties}>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="simple-generation-status under-meter-status" aria-live="polite">
          {progress < 100 && !activePrompt ? <LoaderCircle size={18} /> : null}
          <strong>{statusText}</strong>
        </div>
        <div className="generation-followup-area" aria-live="polite">
          <p className="generation-followup-placeholder">Checking the last details for your plan...</p>
        </div>
        <div className="generation-social-proof">
          <h2>People are choosing personalized plans</h2>
          <p>Short routines. Clear steps. Built for home.</p>
          <div className="generation-testimonial" key={testimonial.name}>
            <div className="generation-stars" aria-label="5 star review">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <div className="generation-testimonial-head">
              <strong>{testimonial.title}</strong>
              <span>{testimonial.name}</span>
            </div>
            <p>{testimonial.body}</p>
          </div>
        </div>
      </div>
      {activePrompt ? (
        <div className="generation-followup-overlay" role="dialog" aria-modal="true" aria-labelledby="generation-followup-title">
          <article className="generation-followup-card">
            <p className="generation-followup-kicker">One quick thing before we finish</p>
            <h2 id="generation-followup-title">{activePrompt.question}</h2>
            <div className="generation-followup-actions">
              <button type="button" onClick={() => answerPrompt(true)}>
                <Check size={18} />
                {activePrompt.yesLabel}
              </button>
              <button type="button" onClick={() => answerPrompt(false)}>
                <X size={18} />
                {activePrompt.noLabel}
              </button>
            </div>
          </article>
        </div>
      ) : null}
      <button className="primary-button sticky-button" disabled={progress < 100} onClick={onNext}>{page.cta || "View my plan"}</button>
    </section>
  );
}

`);
files.set("outputs/app/src/components/PlanReadyPage.tsx", `import type { CSSProperties } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";

function readKg(value: unknown) {
  return (value as { kg?: number } | undefined)?.kg;
}

function planMonths(currentKg?: number, targetKg?: number) {
  if (!currentKg || !targetKg) return 3;
  const delta = Math.abs(currentKg - targetKg);
  if (delta < 1) return 3;
  const monthlyPace = 2.5;
  return Math.max(1, Math.ceil(delta / monthlyPace));
}

function addMonths(date: Date, monthCount: number) {
  return new Date(date.getFullYear(), date.getMonth() + monthCount, date.getDate());
}

function formatTargetDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function monthLabel(date: Date, monthCount: number) {
  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  if (monthCount <= 12) return month;
  const year = String(date.getFullYear()).slice(-2);
  return month + " '" + year;
}

function timelineDates(monthCount: number) {
  const now = new Date();
  const labelCount = Math.min(5, monthCount + 1);
  return Array.from({ length: labelCount }, (_, index) => {
    const offset = Math.round((monthCount / (labelCount - 1)) * index);
    return addMonths(now, offset);
  });
}

type ChartMode = "loss" | "gain" | "maintain";

function chartMode(currentKg?: number, targetKg?: number): ChartMode {
  if (!currentKg || !targetKg) return "loss";
  const delta = targetKg - currentKg;
  if (Math.abs(delta) < 1) return "maintain";
  return delta > 0 ? "gain" : "loss";
}

function topCopy(mode: ChartMode) {
  if (mode === "gain") return "We built a steady plan to support healthy progress and strength.";
  if (mode === "maintain") return "We built a steady plan to help you stay consistent and feel in control.";
  return "We built a steady plan to guide your progress week by week.";
}

function chartLabel(mode: ChartMode) {
  if (mode === "gain") return "Strength path";
  if (mode === "maintain") return "Consistency path";
  return "Progress path";
}

function fallbackWeight(mode: ChartMode, index: number, total: number) {
  if (mode === "gain") return Math.round(60 + (8 / Math.max(1, total - 1)) * index);
  if (mode === "maintain") return 60;
  return Math.round(70 - (8 / Math.max(1, total - 1)) * index);
}

function smoothProgress(progress: number, mode: ChartMode) {
  if (mode === "maintain") return progress;
  const eased = progress * progress * (3 - (2 * progress));
  const midLift = Math.sin(progress * Math.PI) * 0.08;
  return Math.min(1, Math.max(0, eased + midLift));
}

type ChartPoint = {
  date: Date;
  label: string;
  value: number;
  x: number;
  y: number;
  left: number;
  top: number;
};

function chartPoints(currentKg: number | undefined, targetKg: number | undefined, dates: Date[], monthCount: number, mode: ChartMode): ChartPoint[] {
  const total = dates.length;
  const start = currentKg ?? fallbackWeight(mode, 0, total);
  const end = targetKg ?? fallbackWeight(mode, total - 1, total);
  const min = Math.min(start, end);
  const max = Math.max(start, end);
  const range = Math.max(1, max - min);
  return dates.map((date, index) => {
    const progress = total === 1 ? 0 : index / (total - 1);
    const shapedProgress = smoothProgress(progress, mode);
    const value = mode === "maintain" ? start : start + ((end - start) * shapedProgress);
    const normalized = mode === "maintain"
      ? 0.5 + Math.sin(index * 1.25) * 0.035
      : 0.16 + ((max - value) / range) * 0.66;
    return {
      date,
      label: monthLabel(date, monthCount),
      value: Math.round(value),
      x: 24 + (248 * progress),
      y: 24 + (100 * normalized),
      left: ((24 + (248 * progress)) / 320) * 100,
      top: ((24 + (100 * normalized)) / 150) * 100
    };
  });
}

function curvePath(points: ChartPoint[]) {
  if (points.length < 2) return "";
  const tension = 0.28;
  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const before = points[Math.max(0, index - 1)];
    const after = points[Math.min(points.length - 1, index + 2)];
    const dx = point.x - previous.x;
    const previousSlope = (point.y - before.y) / Math.max(1, point.x - before.x);
    const nextSlope = (after.y - previous.y) / Math.max(1, after.x - previous.x);
    const c1x = previous.x + (dx * tension);
    const c1y = previous.y + (previousSlope * dx * tension);
    const c2x = point.x - (dx * tension);
    const c2y = point.y - (nextSlope * dx * tension);
    return path + " C " + c1x + " " + c1y + ", " + c2x + " " + c2y + ", " + point.x + " " + point.y;
  }, "M " + points[0].x + " " + points[0].y);
}

function areaPath(points: ChartPoint[], path: string) {
  const first = points[0];
  const last = points[points.length - 1];
  return path + " L " + last.x + " 132 L " + first.x + " 132 Z";
}

export function PlanReadyPage({ page, answers, onNext }: RendererProps) {
  const currentKg = readKg(answers.currentWeight);
  const targetKg = readKg(answers.targetWeight);
  const months = planMonths(currentKg, targetKg);
  const dates = timelineDates(months);
  const mode = chartMode(currentKg, targetKg);
  const points = chartPoints(currentKg, targetKg, dates, months, mode);
  const path = curvePath(points);
  const area = areaPath(points, path);
  const targetDate = formatTargetDate(dates[dates.length - 1]);
  const targetLabel = targetKg ?? points[points.length - 1].value;

  return (
    <section className="page-stack plan-ready-page">
      <div className="plan-ready-hero">
        <h1>{page.title}</h1>
        <p>{topCopy(mode)}</p>
      </div>
      <p className="plan-ready-target"><strong>{targetLabel}kg</strong> by {targetDate}</p>
      <div className="plan-ready-card">
        <div className="plan-ready-card-head">
          <span>{chartLabel(mode)}</span>
          <strong>Starter plan</strong>
        </div>
        <div className="plan-ready-chart" aria-label="Plan preview chart">
          <svg viewBox="0 0 320 150" role="img" aria-hidden="true">
            <defs>
              <linearGradient id="readyCurveGradient" x1="34" y1="42" x2="286" y2="112" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E9D34D" offset="0%" />
                <stop stopColor="#91CF7A" offset="58%" />
                <stop stopColor="#55CDB7" offset="100%" />
              </linearGradient>
              <linearGradient id="readyAreaGradient" x1="0" y1="42" x2="0" y2="138" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E9D34D" stopOpacity="0.18" offset="0%" />
                <stop stopColor="#55CDB7" stopOpacity="0.08" offset="100%" />
              </linearGradient>
            </defs>
            <path className="ready-area-path" d={area} />
            <path className="ready-curve-path" d={path} />
          </svg>
          {points.map((point, index) => (
            <span
              className={"ready-chart-point" + (index === 0 ? " start-point" : "") + (index === points.length - 1 ? " end-point" : "")}
              key={point.label + index}
              style={{
                left: point.left + "%",
                top: point.y + "px",
                "--point-index": index,
                "--point-y": point.y + "px"
              } as CSSProperties & Record<"--point-index", number> & Record<"--point-y", string>}
            >
              <span className="ready-chart-badge">{point.value}KG</span>
              <span className="ready-chart-dot" />
            </span>
          ))}
          {points.map((point, index) => (
            <span
              className="ready-chart-month-tick"
              key={point.label + "-month-" + index}
              style={{ left: point.left + "%", "--point-index": index } as CSSProperties & Record<"--point-index", number>}
            >
              {point.label}
            </span>
          ))}
          <span className={"expected-result-label " + mode + "-expected-label"}>Expected<br />result</span>
        </div>
      </div>
      <button className="primary-button sticky-button" onClick={onNext}>{page.cta || "Continue"}</button>
    </section>
  );
}
`);
files.set("outputs/app/src/components/PaywallPage.tsx", `import { CheckCircle2, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { RendererProps } from "../runtime/rendererRegistry";
import { trackEvent } from "../runtime/analytics";
import { bindCurrentUser, createStripeEmbeddedSession, resolveOffers } from "../runtime/billingClient";
import { requireSessionIdentity } from "../runtime/identityGuards";

type OfferPrice = {
  amount?: number;
  priceText?: string;
  currency?: string;
};

type Offer = {
  productId: string;
  priceId: string;
  title: string;
  sortOrder?: number;
  recommended?: boolean;
  initialPrice?: OfferPrice;
  renewalPrice?: OfferPrice;
  billingInterval?: string;
  billingIntervalCount?: number;
};

type OffersPayload = {
  paywallCode?: string;
  placementCode?: string;
  currency?: string;
  defaultPriceId?: string;
  offers?: Offer[];
};

type DiscountType = "discount" | "further_discount";
type Testimonial = {
  name: string;
  rating?: number;
  text: string;
};

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

function readKg(value: unknown) {
  return (value as { kg?: number } | undefined)?.kg;
}

function asText(value: unknown, fallback: string) {
  if (Array.isArray(value) && value.length) {
    return value.map((item) => String(item).replace(/_/g, " ")).join(", ");
  }
  if (typeof value === "string" && value) return value.replace(/_/g, " ");
  return fallback;
}

function goalDelta(currentKg?: number, targetKg?: number) {
  if (!currentKg || !targetKg) return "A plan paced around your starting point";
  const delta = Math.round(Math.abs(currentKg - targetKg));
  if (delta < 1) return "A plan to maintain your momentum";
  return currentKg > targetKg ? delta + " kg to lose" : delta + " kg to gain";
}

function intervalText(offer?: Offer) {
  const count = offer?.billingIntervalCount || 1;
  const interval = offer?.billingInterval || "week";
  if (interval === "week") return count === 1 ? "Every week" : \`Every \${count} weeks\`;
  if (interval === "month") return count === 1 ? "Every month" : \`Every \${count} months\`;
  if (interval === "year") return count === 1 ? "Every year" : \`Every \${count} years\`;
  return count === 1 ? \`Every \${interval}\` : \`Every \${count} \${interval}s\`;
}

function normalizedOfferText(offer?: Offer) {
  return [offer?.title, intervalText(offer)].filter(Boolean).join(" ").toLowerCase();
}

function planPhaseText(offer?: Offer) {
  const text = normalizedOfferText(offer);
  if (text.includes("1-week") || text.includes("1 week") || text.includes("weekly") || text.includes("every week")) return "1-week";
  if (text.includes("12-week") || text.includes("12 week")) return "12-week";
  if (text.includes("4-week") || text.includes("4 week")) return "4-week";
  return "4-week";
}

function sortedOffers(offers: Offer[]) {
  return [...offers].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
}

function priceKey(offer: Offer) {
  return offer.priceId || offer.productId || offer.title;
}

function hasDiscount(offer: Offer, normalOffer?: Offer) {
  const currentAmount = offer.initialPrice?.amount;
  const normalAmount = normalOffer?.initialPrice?.amount || offer.renewalPrice?.amount;
  if (typeof currentAmount === "number" && typeof normalAmount === "number") return normalAmount > currentAmount;
  const currentText = offer.initialPrice?.priceText;
  const normalText = normalOffer?.initialPrice?.priceText || offer.renewalPrice?.priceText;
  return Boolean(currentText && normalText && currentText !== normalText);
}

function originalPriceText(offer: Offer, normalOffer?: Offer) {
  if (!hasDiscount(offer, normalOffer)) return "";
  return normalOffer?.initialPrice?.priceText || offer.renewalPrice?.priceText || "";
}

function savingsText(offer: Offer, normalOffer?: Offer) {
  const currentAmount = offer.initialPrice?.amount;
  const normalAmount = normalOffer?.initialPrice?.amount || offer.renewalPrice?.amount;
  if (typeof currentAmount !== "number" || typeof normalAmount !== "number" || normalAmount <= currentAmount) return "";
  return \`Save \${Math.round((1 - currentAmount / normalAmount) * 100)}%\`;
}

function periodDays(offer: Offer) {
  const count = offer.billingIntervalCount || 1;
  const interval = offer.billingInterval || "week";
  if (interval === "day") return count;
  if (interval === "week") return count * 7;
  if (interval === "month") return count * 30;
  if (interval === "year") return count * 365;
  return count * 7;
}

function perDayText(offer: Offer) {
  const amount = offer.initialPrice?.amount;
  if (typeof amount !== "number") return "";
  return \`$\${(amount / periodDays(offer)).toFixed(2)}/day\`;
}

function fallbackOffers(): Offer[] {
  return [
    {
      productId: "fallback-4-week",
      priceId: "",
      title: "4-week starter",
      billingInterval: "week",
      billingIntervalCount: 4,
      recommended: true,
      initialPrice: { priceText: "$14.99" },
      renewalPrice: { priceText: "$38.95" }
    },
    {
      productId: "fallback-12-week",
      priceId: "",
      title: "12-week plan",
      billingInterval: "week",
      billingIntervalCount: 12,
      initialPrice: { priceText: "$29.99" },
      renewalPrice: { priceText: "$89.99" }
    }
  ];
}

function offerKey(offer: Offer, index: number) {
  return offer.priceId || offer.productId || \`\${offer.title}-\${index}\`;
}

function allPageAssets(page: { assets?: Record<string, { kind?: string; optionValue?: string; src?: string }> }) {
  return Object.values(page.assets || {});
}

function localScreenshotUrls(page: { assets?: Record<string, { kind?: string; src?: string }> }) {
  const urls = allPageAssets(page)
    .filter((asset) => asset.kind === "paywall_app_screenshot_set" && asset.src)
    .map((asset) => asset.src!);
  return urls;
}

function localBodyAsset(page: { assets?: Record<string, { kind?: string; optionValue?: string; src?: string }> }, optionValue: string) {
  const assets = allPageAssets(page).filter((asset) => asset.kind === "summary_body_set");
  return assets.find((asset) => asset.optionValue === optionValue)?.src
    || assets.find((asset) => asset.optionValue === "normal")?.src
    || assets[0]?.src;
}

function pageTestimonials(page: Record<string, unknown>): Testimonial[] {
  const source = Array.isArray(page.testimonials) ? page.testimonials : [];
  const normalized = source
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const value = item as { name?: unknown; text?: unknown; quote?: unknown; rating?: unknown };
      const name = typeof value.name === "string" ? value.name : "";
      const text = typeof value.text === "string" ? value.text : typeof value.quote === "string" ? value.quote : "";
      if (!name || !text) return null;
      return {
        name,
        text,
        rating: typeof value.rating === "number" ? value.rating : 5
      };
    })
    .filter(Boolean) as Testimonial[];
  return normalized.length ? normalized : [
    {
      name: "Marcus",
      rating: 5,
      text: "The plan gave me a clear starting point and made it easier to stay consistent without going to a gym."
    },
    {
      name: "Daniel",
      rating: 5,
      text: "I liked that the sessions felt structured. It was challenging, but not random."
    },
    {
      name: "Ethan",
      rating: 5,
      text: "The workouts fit into my day and still felt focused on strength, core work, and visible progress."
    }
  ];
}

export function PaywallPage({ page, answers }: RendererProps) {
  const currentProductName = page.productName || page.appName || "this app";
  const [offers, setOffers] = useState<Offer[]>([]);
  const [normalOffers, setNormalOffers] = useState<Offer[]>([]);
  const [discountType, setDiscountType] = useState<DiscountType>(() => {
    if (typeof window === "undefined") return "discount";
    return sessionStorage.getItem("web2app.paywallDiscountType") === "further_discount" ? "further_discount" : "discount";
  });
  const [selectedPriceId, setSelectedPriceId] = useState("");
  const [error, setError] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const checkoutRef = useRef<HTMLDivElement | null>(null);
  const embeddedCheckoutRef = useRef<{ destroy?: () => void } | null>(null);
  const paywallViewedRef = useRef(false);
  const currentKg = readKg(answers.currentWeight);
  const targetKg = readKg(answers.targetWeight);
  const focus = asText(answers.focusAreas, "your focus areas");
  const blockers = asText(answers.blockers, "your biggest blockers");
  const pageScreenshotUrls = localScreenshotUrls(page);
  const beforeBodySrc = localBodyAsset(page, "overweight") || localBodyAsset(page, "obese") || localBodyAsset(page, "normal");
  const afterBodySrc = localBodyAsset(page, "normal") || beforeBodySrc;
  const testimonials = pageTestimonials(page);
  const displayOffers = offers.length ? offers : fallbackOffers();
  const normalOfferByKey = useMemo(() => {
    const map = new Map<string, Offer>();
    normalOffers.forEach((offer) => {
      map.set(priceKey(offer), offer);
      if (offer.productId) map.set(offer.productId, offer);
      if (offer.title) map.set(offer.title.toLowerCase(), offer);
    });
    return map;
  }, [normalOffers]);
  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.priceId && offer.priceId === selectedPriceId) || offers.find((offer) => offer.recommended) || offers[0],
    [offers, selectedPriceId]
  );
  const selectedPhase = planPhaseText(selectedOffer);
  const selectedInitialPrice = selectedOffer?.initialPrice?.priceText || "Offer";
  const selectedRenewalPrice = selectedOffer?.renewalPrice?.priceText || selectedInitialPrice;

  const activateSecondPaywall = useCallback(() => {
    if (discountType === "further_discount") return;
    sessionStorage.setItem("web2app.paywallDiscountType", "further_discount");
    setDiscountType("further_discount");
    trackEvent("Paywall Viewed", page, { discount_type: "further_discount", trigger: "checkout_close_or_timer" });
  }, [discountType, page]);

  useEffect(() => {
    let cancelled = false;
    async function loadOffers() {
      try {
        const [resolvedData, normalData] = await Promise.all([
          resolveOffers(undefined, discountType),
          resolveOffers(undefined, "normal").catch(() => null)
        ]) as [OffersPayload, OffersPayload | null];
        let data = resolvedData;
        let nextOffers = sortedOffers(data.offers || []);
        if (!nextOffers.length && discountType === "further_discount") {
          sessionStorage.removeItem("web2app.paywallDiscountType");
          data = await resolveOffers(undefined, "discount");
          nextOffers = sortedOffers(data.offers || []);
          if (!cancelled) setDiscountType("discount");
        }
        if (cancelled) return;
        const nextNormalOffers = sortedOffers(normalData?.offers || []);
        setOffers(nextOffers);
        setNormalOffers(nextNormalOffers);
        setError("");
        const defaultOffer = nextOffers.find((offer) => offer.priceId === data.defaultPriceId)
          || nextOffers.find((offer) => offer.recommended)
          || nextOffers[0];
        if (defaultOffer?.priceId) setSelectedPriceId(defaultOffer.priceId);
        if (!paywallViewedRef.current) {
          paywallViewedRef.current = true;
          trackEvent("Paywall Viewed", page, {
            offer_count: nextOffers.length,
            placement_code: data.placementCode || data.paywallCode,
            discount_type: discountType
          });
        } else {
          trackEvent("Paywall Viewed", page, {
            offer_count: nextOffers.length,
            placement_code: data.placementCode || data.paywallCode,
            discount_type: discountType
          });
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load billing offers.");
      }
    }
    loadOffers();
    return () => {
      cancelled = true;
    };
  }, [discountType, page]);

  useEffect(() => {
    const onDiscountExpired = () => activateSecondPaywall();
    window.addEventListener("paywall:discount-expired", onDiscountExpired);
    return () => window.removeEventListener("paywall:discount-expired", onDiscountExpired);
  }, [activateSecondPaywall]);

  useEffect(() => {
    if (!selectedPriceId) {
      const recommended = offers.find((offer) => offer.recommended) || offers[0];
      if (recommended?.priceId) setSelectedPriceId(recommended.priceId);
    }
  }, [offers, selectedPriceId]);

  useEffect(() => {
    if (!pageScreenshotUrls.length) return;
    const timer = window.setInterval(() => {
      setScreenshotIndex((current) => (current + 1) % pageScreenshotUrls.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [pageScreenshotUrls.length]);

  useEffect(() => {
    const scrollToNearestPlanList = () => {
      const lists = Array.from(document.querySelectorAll<HTMLElement>(".plan-list"));
      if (!lists.length) return;
      const viewportAnchor = window.scrollY + 96;
      const nearest = lists
        .map((element) => {
          const top = element.getBoundingClientRect().top + window.scrollY;
          const forwardBias = top >= viewportAnchor ? 0 : 420;
          return { element, top, distance: Math.abs(top - viewportAnchor) + forwardBias };
        })
        .sort((a, b) => a.distance - b.distance)[0];
      const topbarHeight = document.querySelector<HTMLElement>(".paywall-topbar")?.offsetHeight || 76;
      window.scrollTo({
        top: Math.max(0, nearest.top - topbarHeight - 14),
        behavior: "smooth"
      });
    };
    window.addEventListener("paywall:scroll-to-nearest-plan", scrollToNearestPlanList);
    return () => window.removeEventListener("paywall:scroll-to-nearest-plan", scrollToNearestPlanList);
  }, []);

  const visibleScreenshots = pageScreenshotUrls.length
    ? [0, 1, 2].map((offset) => pageScreenshotUrls[(screenshotIndex + offset) % pageScreenshotUrls.length])
    : [];

  const startCheckout = async () => {
    setError("");
    setCheckoutLoading(true);
    try {
      const identity = await requireSessionIdentity("age_group");
      await bindCurrentUser(identity, identity.email);
      if (!selectedOffer?.priceId) throw new Error("Choose a real billing offer before checkout.");
      if (!stripePublishableKey) throw new Error("Stripe publishable key is missing. Set VITE_STRIPE_PUBLISHABLE_KEY.");
      trackEvent("Checkout Started", page, {
        price_id: selectedOffer.priceId,
        product_id: selectedOffer.productId,
        amount: selectedOffer.initialPrice?.amount ?? selectedOffer.initialPrice?.priceText,
        billing_period: intervalText(selectedOffer)
      });
      const returnUrl = \`\${window.location.origin}\${window.location.pathname}?page=payment_success&session_id={CHECKOUT_SESSION_ID}\`;
      const idempotencyKey = \`\${identity.uid}:\${selectedOffer.priceId}:\${Date.now()}\`;
      const session = await createStripeEmbeddedSession({
        identity,
        email: identity.email,
        priceId: selectedOffer.priceId,
        returnUrl,
        idempotencyKey,
        visitor: true
      });
      const clientSecret = session.clientSecret;
      setCheckoutOpen(true);
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
      const stripe = await loadStripe(stripePublishableKey);
      const embedded = await stripe?.initEmbeddedCheckout({ clientSecret });
      if (!embedded || !checkoutRef.current) throw new Error("Stripe checkout could not be mounted.");
      embeddedCheckoutRef.current?.destroy?.();
      embeddedCheckoutRef.current = embedded;
      embedded.mount(checkoutRef.current);
    } catch (err) {
      setCheckoutOpen(false);
      trackEvent("Checkout Failed", page, {
        price_id: selectedPriceId,
        reason: err instanceof Error ? err.message : "Checkout failed."
      });
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const closeCheckout = () => {
    embeddedCheckoutRef.current?.destroy?.();
    embeddedCheckoutRef.current = null;
    setCheckoutOpen(false);
    activateSecondPaywall();
  };

  const PlanPicker = ({ compact = false }: { compact?: boolean }) => (
    <div className={compact ? "plan-list compact" : "plan-list"} aria-label="Choose your plan">
      {displayOffers.map((offer, index) => {
        const selected = Boolean(offer.priceId && selectedPriceId === offer.priceId);
        const normalOffer = normalOfferByKey.get(priceKey(offer))
          || normalOfferByKey.get(offer.productId)
          || normalOfferByKey.get(offer.title.toLowerCase());
        const original = originalPriceText(offer, normalOffer);
        const savings = savingsText(offer, normalOffer);
        const daily = perDayText(offer);
        return (
          <button
            className={selected ? "plan-card selected" : "plan-card"}
            disabled={!offer.priceId}
            key={offerKey(offer, index)}
            onClick={() => {
              setSelectedPriceId(offer.priceId);
              trackEvent("Offer Selected", page, {
                price_id: offer.priceId,
                product_id: offer.productId,
                amount: offer.initialPrice?.amount ?? offer.initialPrice?.priceText,
                billing_period: intervalText(offer)
              });
            }}
          >
            {offer.recommended ? <span className="plan-ribbon">Best value</span> : null}
            <strong>{offer.title}</strong>
            <span className="plan-price">
              {original ? <em>{original}</em> : null}
              <b>{offer.initialPrice?.priceText || "Offer"}</b>
              {daily ? <i>{daily}</i> : null}
            </span>
            {savings ? <small>
              {savings ? <b>{savings}</b> : null}
            </small> : null}
          </button>
        );
      })}
    </div>
  );

  const SubscriptionDisclosure = () => (
    <p className="subscription-disclosure">
      By clicking <strong>GET MY PLAN</strong>, I agree to pay <strong>{selectedInitialPrice}</strong> for my plan and that if I do not cancel before the end of the <strong>{selectedPhase} discount plan</strong>, it will convert to a <strong>4-week subscription</strong> and {String(currentProductName)} will automatically charge my payment method the regular price <strong>{selectedRenewalPrice} every 4-week thereafter</strong> until I cancel. I can cancel online by visiting <strong>subscription page in my account only on website</strong> to avoid being charged for the next billing cycle.
    </p>
  );

  return (
    <section className="page-stack paywall-page">
      <div className="paywall-transform-card">
        <div className="transform-visuals" aria-label="Body transformation preview">
          <div className="transform-figure before">
            <span>Now</span>
            <div className="figure-placeholder">{beforeBodySrc ? <img src={beforeBodySrc} alt="" /> : null}</div>
            <strong>Body fat</strong>
            <em>over 40%</em>
          </div>
          <div className="transform-figure after">
            <span>Goal</span>
            <div className="figure-placeholder">{afterBodySrc ? <img src={afterBodySrc} alt="" /> : null}</div>
            <strong>Body fat</strong>
            <em>under 30%</em>
          </div>
        </div>
        <p>Results vary, and personal outcomes depend on individual factors.</p>
      </div>

      <div className="paywall-hero">
        <span className="paywall-kicker">{discountType === "further_discount" ? "Extra discount unlocked" : "Your personalized plan is ready"}</span>
        <h1>{page.title || "Unlock your personalized plan"}</h1>
        <p>{page.subtitle || "Start with a plan shaped around your goal, body profile, and schedule."}</p>
      </div>

      <PlanPicker />

      <div className="paywall-cta-block">
        <button className="primary-button" disabled={!offers.length || !selectedOffer?.priceId} onClick={startCheckout}>Get my plan</button>
        <SubscriptionDisclosure />
      </div>

      <div className="secure-payments">
        <span>Pay safe and secure</span>
        <strong>VISA</strong>
        <strong>Mastercard</strong>
        <strong>Stripe</strong>
        <strong>Pay</strong>
      </div>

      <section className="app-preview-section">
        <h2>Enhance your outcomes with your companion app</h2>
        <div className="phone-preview-row" key={screenshotIndex}>
          {visibleScreenshots.map((src, index) => (
            <div className={index === 1 ? "phone-preview-card active" : "phone-preview-card"} key={src}>
              <img src={src} alt={currentProductName + " app screenshot " + (index + 1)} loading="lazy" />
            </div>
          ))}
        </div>
        <div className="carousel-dots" aria-hidden="true">
          {pageScreenshotUrls.slice(0, 3).map((src, index) => <span className={index === screenshotIndex % 3 ? "active" : ""} key={src} />)}
        </div>
      </section>

      <section className="social-proof-block">
        <h2>Start losing weight right now</h2>
        <div className="people-count"><span>22,403,000+</span><small>people love guided home plans</small></div>
      </section>

      <div className="paywall-value-card">
        <div className="paywall-value-head">
          <Sparkles size={20} />
          <strong>Highlights of your plan</strong>
        </div>
        <ul>
          <li><CheckCircle2 size={17} /> Workout intensity matched to your starting level</li>
          <li><CheckCircle2 size={17} /> Progress pacing based on your current and target weight</li>
          <li><CheckCircle2 size={17} /> Home-friendly sessions designed around consistency</li>
          <li><CheckCircle2 size={17} /> Expert-style guidance personalized from your answers</li>
        </ul>
      </div>

      <section className="challenge-card">
        <div>
          <span>28 Day Challenge</span>
          <strong>Small daily actions, visible momentum</strong>
        </div>
        <div className="calendar-placeholder" />
      </section>

      <section className="feedback-section">
        <h2>100,000 positive feedbacks</h2>
        {testimonials.map((item) => (
          <article className="feedback-card" key={item.name}>
            <div className="feedback-avatar" />
            <div>
              <strong>{item.name}</strong>
              <div className="proof-stars" aria-label={\`\${item.rating || 5} star rating\`}>{"⭐️".repeat(item.rating || 5)}</div>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="result-story">
        <h2>People just like you achieved meaningful progress with guided plans</h2>
        <div className="result-visual">
          <div className="result-photo before">Day 1</div>
          <div className="result-photo after">Day 98</div>
        </div>
        <p>Use this area for generated progress imagery or a compliant placeholder.</p>
      </section>

      <div className="paywall-hero compact">
        <h2>Get visible results with your personalized plan</h2>
      </div>

      <PlanPicker compact />

      <div className="paywall-cta-block">
        <button className="primary-button" disabled={!offers.length || !selectedOffer?.priceId} onClick={startCheckout}>Get my plan</button>
        <SubscriptionDisclosure />
      </div>

      <div className="paywall-trust">
        <ShieldCheck size={20} />
        <div>
          <strong>30-day money-back guarantee</strong>
          <p>Guarantee terms must match your legal policy. Keep this section connected to the actual refund rules shown at checkout.</p>
        </div>
      </div>

      <details className="paywall-faq">
        <summary>What happens after I pay?<ChevronDown size={17} /></summary>
        <p>Your checkout returns to the success page, then account creation saves access to subscription management.</p>
      </details>
      <details className="paywall-faq">
        <summary>Can I cancel later?<ChevronDown size={17} /></summary>
        <p>Yes. The generated app includes a subscription center for viewing status and starting cancellation when the backend supports it.</p>
      </details>

      {error ? <p className="error-text">{error}</p> : null}
      {!offers.length ? <p className="subtle-note">Loading billing offers...</p> : null}
      <p className="paywall-legal">Prices and trial eligibility come from the billing backend. Final checkout terms must match the selected offer.</p>
      {checkoutOpen ? (
        <div className="checkout-overlay" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <section className="checkout-sheet">
            <div className="checkout-sheet-head">
              <div>
                <span>Secure checkout</span>
                <h2 id="checkout-title">Complete your payment</h2>
              </div>
              <button type="button" className="checkout-close-button" onClick={closeCheckout} aria-label="Close checkout">Close</button>
            </div>
            {checkoutLoading ? <p className="checkout-loading">Preparing secure payment...</p> : null}
            <div className="checkout-mount" ref={checkoutRef} />
          </section>
        </div>
      ) : null}
    </section>
  );
}

`);
files.set("outputs/app/src/components/PaymentSuccessPage.tsx", `import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getEntitlements, getSubscriptionStatus, getSubscriptions } from "../runtime/billingClient";
import { requireSessionIdentity } from "../runtime/identityGuards";
import type { RendererProps } from "../runtime/rendererRegistry";
import { LoadingOverlay } from "./Spinner";

type VerificationState = "checking" | "ready" | "error";

export function PaymentSuccessPage({ page, onNext }: RendererProps) {
  const [state, setState] = useState<VerificationState>("checking");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    let cancelled = false;
    async function verifyPaymentReturn() {
      try {
        const identity = await requireSessionIdentity("paywall");
        await Promise.all([
          getSubscriptionStatus(identity),
          getSubscriptions(identity),
          getEntitlements(identity)
        ]);
        if (cancelled) return;
        setState("ready");
        setMessage("Your payment is confirmed.");
      } catch (error) {
        if (cancelled) return;
        setState("error");
        setMessage(error instanceof Error ? error.message : "We could not verify your subscription yet.");
      }
    }
    verifyPaymentReturn();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="page-stack centered payment-success-page">
      <LoadingOverlay active={state === "checking"} label="Verifying payment" />
      <CheckCircle2 size={44} className="success-icon" />
      <h1>{page.title || "Payment confirmed"}</h1>
      <p>{state === "error" ? message : page.subtitle || message}</p>
      {state === "error" ? <p className="error-text">{message}</p> : null}
      <button className="primary-button" disabled={state !== "ready"} onClick={onNext}>
        {String(page.ctaLabel || page.cta || "Create account")}
      </button>
    </section>
  );
}
`);
files.set("outputs/app/src/components/AccountCreatePage.tsx", `import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { registerFromAnonymous } from "../runtime/billingClient";
import { identifyAnalytics, trackEvent } from "../runtime/analytics";
import { signInBillingCustomToken } from "../runtime/firebase";
import { routeTo } from "../runtime/navigation";
import { readIdentity } from "../runtime/storage";
import { LoadingOverlay } from "./Spinner";

function isValidEmail(value: string) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
}

function readToken(payload: Record<string, unknown>) {
  return String(payload.customToken || payload.firebaseCustomToken || payload.token || "");
}

export function AccountCreatePage({ page, onNext }: RendererProps) {
  const existing = readIdentity();
  const [email, setEmail] = useState(existing?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const normalizedEmail = email.trim().toLowerCase();
  const valid = isValidEmail(normalizedEmail) && password.length >= 6;

  const submit = async () => {
    if (!valid) return;
    const identity = readIdentity();
    if (!identity?.uid) {
      setError("Start the funnel before creating an account.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const registered = await registerFromAnonymous(identity, normalizedEmail, password);
      const customToken = readToken(registered);
      if (customToken) {
        const nextIdentity = await signInBillingCustomToken({
          uid: String(registered.uid || identity.uid),
          customToken,
          email: normalizedEmail,
          isAnonymous: false
        });
        identifyAnalytics(nextIdentity.uid);
      }
      trackEvent("Account Created", page, { method: "email" });
      routeTo("profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-stack account-auth-page">
      <LoadingOverlay active={loading} label="Creating account" />
      <h1>{page.title}</h1>
      <p>{page.subtitle || "to save your progress and access the plan"}</p>
      <label className="auth-field">
        <input value={email} type="email" inputMode="email" autoComplete="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="auth-field password-field">
        <input value={password} type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
        <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </label>
      <button className="auth-submit-button" disabled={!valid || loading} onClick={submit}>{page.cta || "Create account"}</button>
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}

`);
files.set("outputs/app/src/components/LoginPage.tsx", `import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { loginEmailUser } from "../runtime/billingClient";
import { identifyAnalytics, trackEvent } from "../runtime/analytics";
import { signInBillingCustomToken } from "../runtime/firebase";
import { routeTo } from "../runtime/navigation";
import { clearRuntimeSession } from "../runtime/storage";
import { LoadingOverlay } from "./Spinner";

function isValidEmail(value: string) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
}

function readToken(payload: Record<string, unknown>) {
  return String(payload.customToken || payload.firebaseCustomToken || payload.token || "");
}

export function LoginPage({ page }: RendererProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const normalizedEmail = email.trim().toLowerCase();
  const valid = isValidEmail(normalizedEmail) && password.length > 0;

  const submit = async () => {
    if (!valid) return;
    setLoading(true);
    setError("");
    try {
      const loggedIn = await loginEmailUser(normalizedEmail, password);
      const customToken = readToken(loggedIn);
      if (!customToken) throw new Error("Login response is missing a Firebase custom token.");
      const identity = await signInBillingCustomToken({
        uid: String(loggedIn.uid || loggedIn.firebaseUid || ""),
        customToken,
        email: normalizedEmail,
        isAnonymous: false
      });
      identifyAnalytics(identity.uid);
      trackEvent("Login Succeeded", page, { method: "email" });
      routeTo("profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const startAccountFlow = () => {
    clearRuntimeSession();
    routeTo("entry");
  };

  return (
    <section className="page-stack account-auth-page">
      <LoadingOverlay active={loading} label="Logging in" />
      <h1>{page.title}</h1>
      <p>{page.subtitle || "to save your progress and access the plan"}</p>
      <label className="auth-field">
        <input value={email} type="email" inputMode="email" autoComplete="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="auth-field password-field">
        <input value={password} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
        <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </label>
      <button className="auth-link-button forgot-link" type="button">Forgot your password?</button>
      <button className="auth-submit-button" disabled={!valid || loading} onClick={submit}>{page.cta || "Log in"}</button>
      <button className="auth-link-button" type="button" onClick={startAccountFlow}>Create an account</button>
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}

`);
files.set("outputs/app/src/components/ProfilePage.tsx", `import { LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { getSubscriptions, requestCancelSubscription } from "../runtime/billingClient";
import { trackEvent } from "../runtime/analytics";
import { refreshIdentityToken } from "../runtime/firebase";
import { routeTo } from "../runtime/navigation";
import { clearRuntimeSession, readIdentity } from "../runtime/storage";
import { LoadingOverlay } from "./Spinner";

type SubscriptionView = {
  subscribed?: boolean;
  status?: string;
  displayStatus?: string;
  title?: string;
  description?: string;
  plan?: {
    name?: string;
    productId?: string;
    priceId?: string;
  } | null;
  billing?: {
    currentPeriodStart?: string | null;
    currentPeriodEnd?: string | null;
    validUntil?: string | null;
  } | null;
  management?: {
    canCancel?: boolean;
    subscriptionId?: string | null;
  } | null;
};

function formatDate(value?: string | null) {
  if (!value) return "None";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function statusLabel(view: SubscriptionView | null) {
  const raw = view?.displayStatus || view?.status;
  return raw ? String(raw) : "Unknown";
}

function firstSubscriptionId(view: SubscriptionView | null) {
  return String(view?.management?.subscriptionId || "");
}

function canCancelSubscription(view: SubscriptionView | null) {
  return Boolean(view?.management?.canCancel && firstSubscriptionId(view));
}

export function ProfilePage({ page }: RendererProps) {
  const [view, setView] = useState<SubscriptionView | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const identity = readIdentity();
  const subscriptionId = useMemo(() => firstSubscriptionId(view), [view]);
  const canCancel = useMemo(() => canCancelSubscription(view), [view]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const refreshed = await refreshIdentityToken();
        if (!refreshed?.uid) {
          routeTo("login");
          return;
        }
        const subscriptionSummary = await getSubscriptions(refreshed) as SubscriptionView;
        if (!cancelled) {
          setView(subscriptionSummary);
          trackEvent("Subscription Viewed", page, {
            subscription_status: statusLabel(subscriptionSummary),
            subscribed: Boolean(subscriptionSummary.subscribed)
          });
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cancel = async () => {
    const refreshed = await refreshIdentityToken();
    if (!refreshed?.uid) {
      routeTo("login");
      return;
    }
    if (!subscriptionId) {
      setError("No cancellable subscription was found.");
      return;
    }
    setCancelling(true);
    setError("");
    trackEvent("Cancel Subscription Clicked", page, { subscription_id: subscriptionId || undefined });
    try {
      await requestCancelSubscription(refreshed, subscriptionId || undefined);
      const subscriptionSummary = await getSubscriptions(refreshed) as SubscriptionView;
      setView(subscriptionSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel subscription.");
    } finally {
      setCancelling(false);
    }
  };

  const logout = () => {
    clearRuntimeSession();
    routeTo("login");
  };

  return (
    <section className="page-stack profile-page">
      <LoadingOverlay active={loading || cancelling} label={cancelling ? "Cancelling subscription" : "Loading profile"} />
      <div className="profile-head">
        <div>
          <h1>{page.title}</h1>
          <p>{page.subtitle}</p>
          <small className="profile-id-caption">ID {identity?.uid || "No session"}</small>
        </div>
        <button className="icon-button soft" aria-label="Log out" onClick={logout}><LogOut size={19} /></button>
      </div>
      <div className="profile-section">
        <div className="profile-row">
          <span>Email</span>
          <strong>{identity?.email || "Not set"}</strong>
        </div>
      </div>
      <div className="profile-section">
        <div className="profile-row">
          <span>Subscription</span>
          <strong>{statusLabel(view)}</strong>
        </div>
        <div className="profile-row">
          <span>Plan</span>
          <strong>{view?.plan?.name || "No active plan"}</strong>
        </div>
        <div className="profile-row">
          <span>Valid until</span>
          <strong>{formatDate(view?.billing?.validUntil || view?.billing?.currentPeriodEnd)}</strong>
        </div>
      </div>
      <button className="auth-submit-button cancel-flat-button" disabled={!identity?.uid || cancelling || !canCancel} onClick={cancel}>Cancel subscription</button>
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}

`);
files.set("outputs/app/src/components/PlaceholderPage.tsx", `import type { RendererProps } from "../runtime/rendererRegistry";

export function PlaceholderPage({ page, onNext }: RendererProps) {
  return (
    <section className="page-stack centered">
      <h1>{page.title}</h1>
      <p>{page.subtitle || "This capability is listed in docs/runtime-page-capabilities.md and reserved for the next runtime milestone."}</p>
      <button className="primary-button" onClick={onNext}>{page.cta || "Continue"}</button>
    </section>
  );
}
`);
files.set("outputs/app/src/styles.css", `:root {
  --primary: ${cssTokens.primary};
  --accent: ${cssTokens.accent};
  --bg: ${cssTokens.bg};
  --surface: ${cssTokens.surface};
  --surface-alt: ${cssTokens.surfaceAlt};
  --text: ${cssTokens.text};
  --muted: ${cssTokens.muted};
  --border: ${cssTokens.border};
  --disabled: ${cssTokens.disabled};
  --warning: ${cssTokens.warning};
  --info: ${cssTokens.info};
  --body-image-bg: #FFFFFF;
  --image-option-bg: #FFFFFF;
  --card-radius: ${cssTokens.cardRadius}px;
  --control-radius: ${cssTokens.controlRadius}px;
  --button-radius: ${cssTokens.buttonRadius}px;
  --headline-family: ${cssTokens.headlineFamily};
  --heading-weight: ${cssTokens.headingWeight};
  --body-weight: ${cssTokens.bodyWeight};
  font-family: ${cssTokens.fontFamily};
  color: var(--text);
  background: var(--bg);
}

* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; background: var(--bg); }
button, input { font: inherit; }
.app-shell {
  --page-side-padding: 20px;
  --page-title-max: 13ch;
  --option-min-height: 72px;
  --option-gap: 14px;
  --option-radius: var(--card-radius);
  --image-card-radius: var(--card-radius);
  --image-card-media-ratio: 4 / 5;
  --intro-image-radius: calc(var(--card-radius) + 4px);
  --surface-border: var(--border);
  font-weight: var(--body-weight);
}
.stitch-page {
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--primary) 5%, transparent), transparent 32%),
    var(--bg);
}
.stitch-variant-flat-choice-list-or-image-grid {
  --page-title-max: 15ch;
  --option-min-height: 76px;
  --option-gap: 15px;
  --option-radius: calc(var(--card-radius) + 2px);
}
.stitch-variant-flat-check-list {
  --option-min-height: 78px;
  --option-gap: 14px;
  --option-radius: calc(var(--card-radius) + 3px);
}
.stitch-variant-image-top-copy-bottom-cta {
  --page-title-max: 16ch;
  --intro-image-radius: calc(var(--card-radius) + 8px);
}
.stitch-variant-large-centered-number-input,
.stitch-variant-large-centered-measurement-input,
.stitch-variant-large-centered-measurement-input-with-feedback {
  --page-title-max: 16ch;
}
.stitch-variant-long-form-stacked {
  --page-side-padding: 18px;
}
.stitch-page .topbar {
  background: color-mix(in srgb, var(--bg) 94%, #ffffff);
  border-bottom-color: color-mix(in srgb, var(--border) 42%, transparent);
}
.stitch-page .topbar-center strong {
  font-family: var(--headline-family);
  font-weight: var(--heading-weight);
}
.stitch-page .section-progress {
  width: min(180px, 48vw);
  gap: 7px;
}
.stitch-page .section-progress span {
  height: 4px;
  background: color-mix(in srgb, var(--text) 7%, transparent);
}
.stitch-page .section-progress span i {
  background: linear-gradient(90deg, color-mix(in srgb, var(--primary) 82%, #ffffff), var(--primary));
}
.stitch-variant-flat-choice-list-or-image-grid .choice-header,
.stitch-variant-flat-check-list .choice-header {
  gap: 12px;
  padding-top: 4px;
}
.stitch-variant-flat-choice-list-or-image-grid .choice-header h1,
.stitch-variant-flat-check-list .choice-header h1 {
  margin-inline: auto;
  font-size: clamp(30px, 6vw, 39px);
  line-height: 1.08;
}
.stitch-variant-flat-choice-list-or-image-grid .choice-header p,
.stitch-variant-flat-check-list .choice-header p {
  font-size: 17px;
}
.stitch-variant-flat-choice-list-or-image-grid .choice-list,
.stitch-variant-flat-check-list .choice-list {
  padding-top: 8px;
}
.stitch-variant-flat-choice-list-or-image-grid .option-row,
.stitch-variant-flat-check-list .option-row {
  min-height: 82px;
  border-color: color-mix(in srgb, var(--border) 54%, transparent);
  box-shadow: 0 10px 22px rgba(24, 28, 35, 0.025);
}
.stitch-variant-flat-choice-list-or-image-grid .option-row:hover,
.stitch-variant-flat-check-list .option-row:hover {
  border-color: color-mix(in srgb, var(--primary) 46%, var(--border));
  transform: translateY(-1px);
}
.stitch-variant-flat-choice-list-or-image-grid .image-choice-card {
  box-shadow: 0 14px 28px rgba(24, 28, 35, 0.045);
}
.stitch-variant-flat-choice-list-or-image-grid .choice-image-label {
  min-height: 54px;
  padding-inline: 14px;
}
.stitch-variant-flat-check-list .choice-check {
  border-radius: 999px;
  border-width: 1px;
  background: color-mix(in srgb, var(--primary) 9%, #ffffff);
}
.stitch-variant-flat-check-list .selected .choice-check {
  background: var(--primary);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--primary) 12%, transparent);
}
.stitch-variant-image-top-copy-bottom-cta .intro-content {
  gap: 22px;
}
.stitch-variant-image-top-copy-bottom-cta .intro-hero-image,
.stitch-variant-image-top-copy-bottom-cta .hero-placeholder {
  border: 0;
  box-shadow: 0 18px 40px rgba(24, 28, 35, 0.08);
}
.stitch-variant-image-top-copy-bottom-cta .intro-content h1 {
  font-size: clamp(31px, 6vw, 42px);
  line-height: 1.08;
}
.stitch-variant-bmi-report-with-body-image .summary-bmi-card,
.stitch-variant-animated-projection-chart .plan-chart-card,
.stitch-variant-long-form-stacked .paywall-section {
  border-color: color-mix(in srgb, var(--border) 42%, transparent);
  box-shadow: 0 16px 36px rgba(24, 28, 35, 0.055);
}
.stitch-variant-long-form-stacked .offer-card {
  min-height: 92px;
  border-radius: calc(var(--card-radius) + 4px);
}
.stitch-variant-long-form-stacked .offer-card.selected {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 14%, transparent), 0 18px 32px rgba(24, 28, 35, 0.07);
}
@keyframes pageEnter {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes obPageRise {
  from {
    opacity: 0;
    transform: translateY(42px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes obPageFade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes bmiMarkerSlide {
  from { left: 0%; }
  to { left: var(--bmi-position, 50%); }
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.app-shell { min-height: 100vh; background: var(--bg); }
.desktop-layout {
  width: 100%;
  min-height: inherit;
}
.app-shell:not(.shell-entry) .desktop-layout {
  min-height: calc(100dvh - 60px);
}
.topbar {
  height: 64px;
  display: grid;
  grid-template-columns: 56px 1fr 58px;
  align-items: center;
  padding: 0 18px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  position: sticky;
  top: 0;
  z-index: 5;
}
.ob-topbar {
  height: 60px;
  border-bottom-color: color-mix(in srgb, var(--border) 70%, transparent);
}
.paywall-topbar {
  grid-template-columns: 1fr;
  padding: 8px 16px;
}
.icon-button {
  width: 42px;
  height: 42px;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.topbar-center { text-align: center; }
.topbar-center strong {
  font-size: 15px;
  font-weight: 750;
  letter-spacing: 0;
}
.section-progress {
  width: min(172px, 46vw);
  min-height: 5px;
  margin: 8px auto 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 6px;
}
.section-progress span {
  position: relative;
  height: 3px;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in srgb, var(--text) 8%, transparent);
}
.section-progress span i {
  display: block;
  height: 100%;
  width: 0;
  border-radius: inherit;
  background: var(--primary);
  transition: width 260ms ease;
}
.section-progress span.active i {
  background: var(--primary);
}
.progress-count { text-align: right; color: var(--muted); font-weight: 700; }
.screen-main {
  width: min(100%, 760px);
  margin: 0 auto;
  padding: 34px var(--page-side-padding) 42px;
  animation: pageEnter 260ms cubic-bezier(0.22, 1, 0.36, 1);
}
.screen-main.page-type-single_choice_page,
.screen-main.page-type-multi_choice_page {
  min-height: calc(100dvh - 60px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.screen-main.page-type-multi_choice_page,
.screen-main.page-type-height_input_page,
.screen-main.page-type-weight_input_page,
.screen-main.page-type-age_input_page,
.screen-main.page-type-email_capture_page,
.screen-main.page-type-summary_page,
.screen-main.page-type-plan_ready_page,
.screen-main.page-type-paywall_page {
  padding-bottom: 112px;
}
.screen-main.is-ob-transition {
  animation: obPageRise 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  will-change: transform, opacity;
}
.screen-main.is-ob-transition.has-fixed-cta {
  animation: obPageFade 220ms ease both;
  will-change: opacity;
}
.screen-main.has-fixed-cta {
  animation: obPageFade 220ms ease both;
  will-change: opacity;
}
.page-id-entry {
  width: 100%;
  max-width: none;
  min-height: 100dvh;
  padding: 0;
}
.page-type-entry_page {
  width: 100%;
  max-width: none;
  padding: 0;
}
.entry-page {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
  display: grid;
  align-items: end;
  padding: 92px min(7vw, 72px) max(56px, env(safe-area-inset-bottom));
  isolation: isolate;
}
.entry-hero-image,
.entry-hero-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 58% center;
  z-index: -2;
}
.entry-hero-fallback {
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 28%, #232323), #1f2328);
}
.entry-scrim {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.18) 34%, rgba(0,0,0,0.62) 100%),
    linear-gradient(90deg, rgba(0,0,0,0.66), rgba(0,0,0,0.24) 58%, rgba(0,0,0,0.1));
}
.entry-top {
  position: absolute;
  top: 28px;
  left: min(7vw, 72px);
  right: min(7vw, 72px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
}
.entry-top strong {
  max-width: min(58vw, 340px);
  font-size: clamp(18px, 3.4vw, 24px);
  line-height: 1.1;
  letter-spacing: 0;
  text-wrap: balance;
}
.entry-top button {
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
  color: #ffffff;
  min-width: 78px;
  min-height: 46px;
  padding: 0 18px;
  font-weight: 800;
  white-space: nowrap;
  backdrop-filter: blur(10px);
}
.entry-content {
  width: min(520px, 100%);
  color: #ffffff;
  display: grid;
  gap: 18px;
  justify-items: start;
  text-align: left;
}
.entry-content h1 {
  margin: 0;
  max-width: 11ch;
  font-size: clamp(42px, 7vw, 76px);
  line-height: 0.98;
  text-align: left;
  text-wrap: balance;
}
.entry-content p {
  max-width: 34ch;
  color: rgba(255,255,255,0.82);
  font-size: 17px;
  line-height: 1.42;
  text-align: left;
}
.entry-start-button {
  justify-self: start;
  border: 0;
  border-radius: 999px;
  background: #ffffff;
  color: var(--text);
  min-height: 58px;
  padding: 0 30px;
  font-weight: 900;
  margin-top: 10px;
}
.page-stack { display: flex; flex-direction: column; gap: 18px; }
.choice-page {
  flex: 1;
  min-height: 0;
  gap: 18px;
}
.choice-header {
  flex: 0 0 auto;
  display: grid;
  gap: 10px;
}
.choice-scroll-area {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 2px 0 6px;
  scrollbar-width: thin;
}
.single-choice-page .choice-scroll-area {
  flex: 0 1 auto;
  overflow-y: visible;
}
.multi-choice-page .choice-scroll-area {
  padding-bottom: 86px;
}
.centered { align-items: center; text-align: center; }
.intro-page { min-height: calc(100vh - 78px - 146px); justify-content: flex-start; }
.intro-content {
  width: 100%;
  display: grid;
  gap: 18px;
  justify-items: center;
}
h1 {
  margin: 0;
  max-width: var(--page-title-max);
  font-size: clamp(27px, 4vw, 36px);
  line-height: 1.14;
  font-family: var(--headline-family);
  font-weight: var(--heading-weight);
  text-align: center;
  text-wrap: balance;
}
p { margin: 0; color: var(--muted); line-height: 1.5; font-size: 16px; }
.choice-list { display: grid; gap: var(--option-gap); }
.plain-list .option-row { padding-left: 22px; }
.icon-list .option-row { padding-left: 20px; }
.option-row {
  min-height: var(--option-min-height);
  border: 1px solid var(--surface-border);
  border-radius: var(--option-radius);
  background: var(--surface);
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-weight: 680;
  color: var(--text);
  cursor: pointer;
  text-align: left;
}
.option-row span:first-child { flex: 1; }
.icon-list .option-row span:nth-child(2) { flex: 1; }
.option-row.selected {
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 7%, var(--surface));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 16%, transparent);
}
.stitch-variant-flat-check-list .option-row.selected {
  box-shadow: inset 4px 0 0 var(--primary), 0 0 0 1px color-mix(in srgb, var(--primary) 20%, transparent);
}
.choice-check {
  width: 25px;
  height: 25px;
  border-radius: 7px;
  border: 2px solid var(--border);
  background: var(--surface);
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}
.choice-check::after {
  content: "";
  width: 10px;
  height: 6px;
  border-left: 2px solid transparent;
  border-bottom: 2px solid transparent;
  transform: rotate(-45deg) translateY(-1px);
}
.selected .choice-check {
  border-color: var(--primary);
  background: var(--primary);
}
.selected .choice-check::after {
  border-color: #ffffff;
}
.spinner {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--primary) 24%, transparent);
  border-top-color: var(--primary);
  flex: 0 0 auto;
  animation: spin 0.78s linear infinite;
}
.primary-button .spinner {
  border-color: rgba(255, 255, 255, 0.42);
  border-top-color: #ffffff;
}
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(247, 246, 249, 0.28);
  backdrop-filter: blur(1px);
}
.loading-overlay-box {
  width: 74px;
  height: 74px;
  border-radius: 10px;
  background: rgba(48, 48, 52, 0.78);
  display: grid;
  place-items: center;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
}
.loading-overlay-box .spinner {
  width: 28px;
  height: 28px;
  border-color: rgba(255, 255, 255, 0.34);
  border-top-color: #ffffff;
}
@keyframes spin { to { transform: rotate(360deg); } }
.choice-image-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--option-gap);
}
.choice-image-grid.multi { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.image-choice-card {
  border: 1px solid var(--surface-border);
  border-radius: var(--image-card-radius);
  background: var(--surface);
  overflow: hidden;
  padding: 0;
  min-height: 178px;
  display: grid;
  grid-template-rows: 1fr 48px;
  cursor: pointer;
  text-align: left;
}
.image-choice-card.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 20%, transparent);
}
.choice-image-media {
  min-height: 130px;
  aspect-ratio: var(--image-card-media-ratio);
  background: var(--image-option-bg);
  display: grid;
  place-items: center;
  overflow: hidden;
}
.choice-image-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.choice-image-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: color-mix(in srgb, var(--primary) 78%, #ffffff);
  font-size: 46px;
  font-weight: 800;
}
.choice-image-label {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 12px;
  background: color-mix(in srgb, var(--primary) 92%, #ffffff);
  color: #ffffff;
  font-weight: 800;
}
.choice-image-grid.multi .choice-image-label { background: var(--surface); color: var(--text); }
.choice-image-grid.multi .selected .choice-image-label { background: color-mix(in srgb, var(--primary) 10%, #ffffff); }
.choice-arrow {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: #ffffff;
  color: var(--primary);
  display: grid;
  place-items: center;
  font-size: 28px;
  line-height: 1;
}
.primary-button {
  width: min(720px, 100%);
  min-height: 58px;
  border: 0;
  border-radius: var(--button-radius);
  background: var(--primary);
  color: white;
  padding: 0 22px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.primary-button:disabled { background: var(--disabled); cursor: not-allowed; }
.sticky-button {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  width: min(720px, calc(100% - 40px));
}
.intro-hero-image,
.hero-placeholder {
  width: min(100%, 440px);
  aspect-ratio: 4 / 3;
  max-height: min(42vh, 330px);
  border-radius: var(--intro-image-radius);
  border: 1px solid var(--surface-border);
}
.intro-hero-image {
  display: block;
  object-fit: cover;
  object-position: center;
}
.hero-placeholder {
  background: linear-gradient(135deg, #f1d6e2, #fff 55%, #ded7ed);
}
.unit-tabs {
  display: flex;
  align-self: center;
  background: color-mix(in srgb, var(--surface) 72%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--border) 54%, transparent);
  border-radius: 999px;
  padding: 4px;
}
.compact-measurement {
  min-height: calc(100vh - 78px - 146px);
  align-items: center;
  gap: 28px;
}
.compact-measurement h1 {
  width: min(100%, 560px);
  margin: 4px auto 2px;
  text-align: center;
  font-size: clamp(27px, 5vw, 34px);
}
.compact-tabs {
  width: min(210px, 100%);
  height: 42px;
  padding: 4px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface) 62%, var(--canvas));
  box-shadow: inset 0 0 0 1px rgba(37, 40, 45, 0.035);
  position: relative;
  isolation: isolate;
  overflow: hidden;
}
.unit-tabs-indicator {
  position: absolute;
  z-index: 0;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc((100% - 8px) / var(--unit-count, 2));
  border-radius: 999px;
  background: var(--primary);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--primary) 24%, transparent);
  transform: translateX(calc(var(--active-index, 0) * 100%));
  transition: transform 220ms cubic-bezier(0.2, 0.82, 0.2, 1), background 160ms ease;
}
.unit-tabs button {
  min-width: 96px;
  height: 48px;
  border: 0;
  border-radius: 11px;
  background: transparent;
  font-weight: 800;
  cursor: pointer;
}
.compact-tabs button {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  height: 32px;
  border-radius: 999px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 750;
  transition: background 140ms ease, color 140ms ease, box-shadow 140ms ease;
}
.unit-tabs .active { color: white; }
.compact-tabs .active {
  background: transparent;
  color: #ffffff;
  box-shadow: none;
}
.numeric-input {
  margin: 44px auto 18px;
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-weight: 800;
}
.numeric-input input {
  width: 170px;
  border: 0;
  background: transparent;
  color: var(--text);
  text-align: center;
  outline: none;
  font-size: 68px;
  font-weight: 800;
}
.numeric-input span { font-size: 22px; }
.measurement-line-input {
  width: min(100%, 360px);
  min-height: 96px;
  margin-top: 14px;
  border-bottom: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  padding: 8px 0 0;
}
.measurement-line-input input {
  width: calc((var(--digits, 2) * 0.64em) + 0.14em);
  max-width: 72vw;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text);
  text-align: right;
  font-size: clamp(50px, 14vw, 72px);
  line-height: 1;
  font-weight: 780;
  letter-spacing: 0;
}
.measurement-line-input input::placeholder {
  color: color-mix(in srgb, var(--text) 42%, transparent);
  opacity: 1;
}
.measurement-line-input span {
  position: static;
  min-width: 0;
  text-align: left;
  color: var(--text);
  font-size: clamp(14px, 3.8vw, 17px);
  line-height: 1;
  font-weight: 780;
}
.imperial-height-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: baseline;
  justify-content: center;
  gap: 18px;
  padding-left: 0;
  padding-right: 0;
}
.imperial-height-inputs label {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 7px;
  min-width: 0;
  padding-right: 0;
}
.imperial-height-inputs span {
  min-width: auto;
  text-align: left;
}
.measurement-range {
  margin-top: -20px;
  color: var(--text);
  text-align: center;
  font-size: 13px;
}
.measurement-range strong { font-weight: 800; }
.height-bmi-note {
  width: min(100%, 360px);
  border-radius: 16px;
  background: #e5e3ec;
  padding: 16px 18px;
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 10px;
  align-items: start;
  text-align: left;
}
.height-bmi-note svg {
  color: var(--text);
  margin-top: 1px;
}
.height-bmi-note strong {
  display: block;
  color: var(--text);
  font-size: 16px;
  line-height: 1.2;
}
.height-bmi-note p {
  margin-top: 8px;
  color: #8b8992;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 700;
}
.age-line-input {
  min-height: 150px;
  align-items: center;
  padding-top: 0;
}
.age-line-input input {
  text-align: center;
  font-size: clamp(58px, 18vw, 76px);
}
.age-personalization-note {
  width: min(100%, 360px);
  border-radius: 16px;
  background: #e5e3ec;
  padding: 16px 18px;
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 10px;
  align-items: start;
  text-align: left;
}
.age-personalization-note svg {
  color: var(--text);
  margin-top: 1px;
}
.age-personalization-note strong {
  display: block;
  color: var(--text);
  font-size: 16px;
  line-height: 1.22;
}
.age-personalization-note p {
  margin-top: 10px;
  color: #8b8992;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 700;
}
.info-card {
  width: 100%;
  border-radius: 16px;
  background: var(--info);
  padding: 18px;
  text-align: left;
}
.info-card.warning { background: var(--warning); }
.compact-info {
  padding: 14px 16px;
  font-size: 14px;
}
.target-weight-card {
  width: min(100%, 360px);
  border: 1px solid var(--target-accent);
  border-radius: 16px;
  background: var(--target-bg);
  padding: 16px 18px;
  text-align: left;
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: start;
  gap: 10px;
}
.target-weight-card-icon {
  width: 20px;
  height: 20px;
  margin-top: 1px;
  border: 2px solid var(--target-accent);
  border-radius: 999px;
  color: var(--target-accent);
  display: grid;
  place-items: center;
  font-size: 13px;
  line-height: 1;
  font-weight: 900;
}
.target-weight-card strong {
  display: block;
  color: var(--target-text);
  font-size: 14px;
  line-height: 1.2;
}
.target-weight-delta {
  display: inline-flex;
  width: fit-content;
  margin-top: 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--target-accent) 14%, #ffffff);
  color: var(--target-text);
  padding: 5px 9px;
  font-size: 12px;
  line-height: 1;
  font-weight: 850;
}
.target-weight-card p {
  margin-top: 9px;
  color: var(--text);
  font-size: 14px;
  line-height: 1.42;
}
.target-weight-card-steady {
  --target-accent: #7bb6ee;
  --target-bg: #eaf4ff;
  --target-text: #1f5d99;
}
.target-weight-card-loss-light {
  --target-accent: #57cba6;
  --target-bg: #eafbf5;
  --target-text: #227a62;
}
.target-weight-card-loss-structured {
  --target-accent: #5aa8d8;
  --target-bg: #edf8ff;
  --target-text: #286f9a;
}
.target-weight-card-gain-light {
  --target-accent: #a988e8;
  --target-bg: #f4efff;
  --target-text: #6650a4;
}
.target-weight-card-gain-structured {
  --target-accent: #f0b14b;
  --target-bg: #fff7e8;
  --target-text: #9a6419;
}
.target-weight-card-warning {
  --target-accent: #ff6573;
  --target-bg: #fff0f2;
  --target-text: #b3263a;
}
.bmi-card {
  width: min(100%, 360px);
  border: 1px solid var(--bmi-accent);
  border-radius: 16px;
  background: var(--bmi-bg);
  padding: 20px 22px;
  display: grid;
  gap: 12px;
  color: var(--text);
  text-align: left;
}
.bmi-card-heading {
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: start;
  gap: 10px;
}
.bmi-card-heading strong {
  font-size: 14px;
  line-height: 1.22;
  font-weight: 700;
}
.bmi-card-heading b {
  font-weight: 850;
}
.bmi-card p {
  color: var(--text);
  font-size: 14px;
  line-height: 1.42;
}
.bmi-card-icon {
  width: 19px;
  height: 19px;
  margin-top: 1px;
  border: 2px solid var(--bmi-accent);
  border-radius: 999px;
  color: var(--bmi-accent);
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
}
.bmi-card-underweight {
  --bmi-accent: #ff5c64;
  --bmi-bg: #fff0f1;
}
.bmi-card-normal {
  --bmi-accent: #39c6ad;
  --bmi-bg: #e9fbf7;
}
.bmi-card-overweight {
  --bmi-accent: #f4a937;
  --bmi-bg: #fff7ec;
}
.bmi-card-obese {
  --bmi-accent: #ff5968;
  --bmi-bg: #fff0f2;
}
.summary-page {
  align-items: center;
  gap: 20px;
}
.summary-page h1 {
  width: min(100%, 360px);
  margin: 0 auto 4px;
}
.summary-bmi-card {
  width: min(100%, 360px);
  border-radius: 12px;
  background:
    linear-gradient(rgba(217, 222, 230, 0.28) 1px, transparent 1px),
    linear-gradient(90deg, rgba(217, 222, 230, 0.28) 1px, transparent 1px),
    #ffffff;
  background-size: 28px 28px;
  border: 1px solid rgba(24, 28, 35, 0.06);
  padding: 12px 14px 16px;
  box-shadow: 0 10px 22px rgba(25, 29, 38, 0.04);
}
.summary-bmi-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--text);
  font-size: 14px;
}
.summary-bmi-head span {
  color: var(--muted);
  text-align: right;
}
.summary-bmi-scale {
  position: relative;
  margin: 30px 8px 14px;
}
.summary-bmi-track {
  height: 7px;
  border-radius: 999px;
  background: linear-gradient(90deg, #77c96b 0%, #b8d95c 26%, #f4d85b 46%, #f4a64e 66%, #ff6b63 100%);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.42);
}
.summary-bmi-marker {
  position: absolute;
  z-index: 1;
  top: -28px;
  left: var(--bmi-position, 50%);
  transform: translateX(-50%);
  border-radius: 5px;
  background: #25282d;
  color: #ffffff;
  padding: 6px 8px;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 800;
  animation: bmiMarkerSlide 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
  will-change: left;
}
.summary-bmi-marker::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -5px;
  transform: translateX(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #25282d;
}
.summary-bmi-ticks,
.summary-bmi-labels {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  color: var(--text);
  font-size: 12px;
}
.summary-bmi-ticks span { text-align: center; }
.summary-bmi-labels {
  grid-template-columns: repeat(4, 1fr);
  margin-top: 14px;
  color: var(--muted);
  font-size: 11px;
}
.summary-bmi-labels span { text-align: center; }
.summary-profile-grid {
  width: min(100%, 360px);
  display: grid;
  grid-template-columns: 1fr 132px;
  gap: 14px;
  align-items: center;
}
.summary-facts {
  display: grid;
  gap: 12px;
}
.summary-fact {
  display: grid;
  grid-template-columns: 26px 1fr;
  column-gap: 8px;
  align-items: center;
  color: var(--text);
}
.summary-fact svg {
  grid-row: span 2;
  color: color-mix(in srgb, var(--text) 78%, transparent);
}
.summary-fact span {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}
.summary-fact strong {
  min-width: 0;
  color: var(--text);
  font-size: 14px;
  line-height: 1.25;
}
.summary-body-visual {
  height: 178px;
  border-radius: 18px;
  background: var(--body-image-bg);
  display: grid;
  place-items: end center;
  overflow: hidden;
}
.summary-body-visual div {
  width: 74px;
  height: 148px;
  border-radius: 38px 38px 28px 28px;
  background:
    radial-gradient(circle at 50% 15%, #f0c6aa 0 16px, transparent 17px),
    linear-gradient(180deg, #7f8fb7 0 38%, #f0c6aa 39% 55%, #7f8fb7 56% 100%);
  opacity: 0.92;
  filter: drop-shadow(0 14px 16px rgba(28, 30, 36, 0.16));
}
.summary-body-visual img {
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  display: block;
  filter: none;
}
.summary-body-underweight div { width: 58px; }
.summary-body-overweight div { width: 88px; }
.summary-body-obese div { width: 102px; }
.summary-insight-card {
  width: min(100%, 360px);
  border: 1px solid var(--bmi-accent);
  border-radius: 16px;
  background: var(--bmi-bg);
  padding: 16px;
  display: grid;
  grid-template-columns: 26px 1fr;
  gap: 10px;
  color: var(--text);
  text-align: left;
}
.summary-insight-card svg { color: var(--bmi-accent); }
.summary-insight-card strong {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}
.summary-insight-card p {
  color: var(--text);
  font-size: 14px;
  line-height: 1.42;
}
.plan-generation-page,
.plan-ready-page {
  align-items: center;
  gap: 18px;
}
.simple-plan-generation-page {
  min-height: calc(100vh - 78px - 146px);
  justify-content: center;
  position: relative;
}
.simple-generation-content {
  width: min(100%, 360px);
  display: grid;
  justify-items: center;
  gap: 16px;
  text-align: center;
}
.simple-generation-content h1 {
  width: min(100%, 330px);
}
.simple-generation-content p {
  width: min(100%, 310px);
}
.simple-generation-meter {
  width: 158px;
  height: 158px;
  margin: 10px 0 2px;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, var(--bg) 0 57%, transparent 58%),
    conic-gradient(var(--primary) calc(var(--progress, 0) * 1%), #e7e2eb 0);
  display: grid;
  place-items: center;
  color: var(--text);
  font-size: 30px;
  font-weight: 850;
  filter: drop-shadow(0 12px 22px rgba(24, 28, 36, 0.06));
  transition: background 220ms ease-out;
}
.simple-generation-status {
  min-height: 38px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface) 78%, var(--bg));
  border: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: var(--text);
  font-size: 13px;
  font-weight: 760;
}
.simple-generation-status svg {
  color: var(--primary);
  animation: spin 0.8s linear infinite;
}
.under-meter-status {
  margin-top: -2px;
}
.simple-generation-note {
  color: var(--muted);
  font-size: 14px;
}
.generation-followup-area {
  width: min(100%, 354px);
  min-height: 38px;
  display: grid;
  place-items: center;
  margin-top: 2px;
}
.generation-followup-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(17, 20, 27, 0.42);
  backdrop-filter: blur(8px);
  animation: overlayFadeIn 220ms ease both;
}
.generation-followup-card {
  width: min(100%, 342px);
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid color-mix(in srgb, var(--border) 78%, transparent);
  box-shadow: 0 24px 70px rgba(15, 18, 26, 0.24);
  padding: 18px;
  display: grid;
  gap: 13px;
  text-align: center;
  animation: followupPopIn 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.generation-followup-kicker {
  width: auto;
  margin: 0;
  color: var(--primary);
  font-size: 12px;
  line-height: 1.2;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0;
}
.generation-followup-card h2 {
  margin: 0 auto;
  width: min(100%, 280px);
  color: var(--text);
  font-size: 18px;
  line-height: 1.22;
  font-weight: 820;
}
.generation-followup-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.generation-followup-actions button {
  min-height: 48px;
  border: 1px solid color-mix(in srgb, var(--primary) 20%, var(--border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--primary) 8%, #ffffff);
  color: var(--text);
  font-size: 14px;
  font-weight: 820;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}
.generation-followup-actions button:first-child {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}
.generation-followup-placeholder {
  width: min(100%, 250px);
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.35;
}
.generation-social-proof {
  width: min(100%, 354px);
  margin-top: 10px;
  padding-top: 20px;
  border-top: 1px solid color-mix(in srgb, var(--border) 82%, transparent);
  display: grid;
  justify-items: center;
  gap: 8px;
}
.generation-social-proof h2 {
  width: min(100%, 330px);
  margin: 0;
  color: color-mix(in srgb, var(--primary) 78%, var(--text));
  font-size: 26px;
  line-height: 1.13;
  font-weight: 760;
  text-align: center;
}
.generation-social-proof > p {
  width: min(100%, 300px);
  color: var(--text);
  font-size: 14px;
}
.generation-testimonial {
  width: min(100%, 354px);
  margin-top: 10px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface) 80%, var(--bg));
  padding: 18px;
  text-align: left;
  display: grid;
  gap: 10px;
  animation: testimonialFade 420ms ease both;
}
.generation-stars {
  display: inline-flex;
  justify-self: start;
  gap: 3px;
}
.generation-stars span {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  background: #41b982;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 12px;
  line-height: 1;
  font-weight: 800;
}
.generation-testimonial-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: baseline;
}
.generation-testimonial-head strong {
  color: var(--text);
  font-size: 15px;
  line-height: 1.25;
}
.generation-testimonial-head span {
  color: var(--text);
  font-size: 13px;
  white-space: nowrap;
}
.generation-testimonial p {
  color: var(--text);
  font-size: 14px;
  line-height: 1.45;
}
@keyframes testimonialFade {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes overlayFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes followupPopIn {
  from { opacity: 0; transform: translateY(14px) scale(0.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.plan-ready-hero {
  width: min(100%, 360px);
  display: grid;
  justify-items: center;
  gap: 12px;
  text-align: center;
  animation: readyRise 520ms ease both;
}
.plan-ready-hero p {
  width: min(100%, 318px);
  color: var(--text);
  font-size: 15px;
  line-height: 1.42;
}
.plan-ready-target {
  margin-top: 2px;
  color: var(--text);
  font-size: 17px;
  font-weight: 800;
  text-align: center;
  animation: readyRise 560ms 80ms ease both;
}
.plan-ready-target strong {
  text-decoration: underline;
  text-underline-offset: 3px;
}
.plan-ready-card {
  width: min(100%, 360px);
  display: grid;
  gap: 14px;
  border-radius: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 18px;
  box-shadow: 0 18px 34px rgba(24, 28, 36, 0.07);
  animation: readyRise 620ms 120ms ease both;
}
.plan-ready-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.plan-ready-card-head span {
  border-radius: 999px;
  background: color-mix(in srgb, var(--primary) 10%, var(--surface));
  color: var(--primary);
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 850;
  white-space: nowrap;
}
.plan-ready-card-head strong {
  color: var(--text);
  font-size: 15px;
}
.plan-ready-chart {
  position: relative;
  height: 206px;
  border-radius: 18px;
  overflow: visible;
  background:
    linear-gradient(rgba(218, 223, 231, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(218, 223, 231, 0.14) 1px, transparent 1px);
  background-size: 38px 38px, 38px 38px;
  background-position: 0 0, 0 0;
  background-repeat: repeat;
}
.plan-ready-chart svg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  height: 150px;
}
.ready-area-path {
  fill: url(#readyAreaGradient);
  opacity: 0;
  animation: readyFade 760ms 760ms ease both;
}
.ready-curve-path {
  fill: none;
  stroke: url(#readyCurveGradient);
  stroke-width: 7;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 360;
  stroke-dashoffset: 360;
  filter: drop-shadow(0 9px 11px rgba(85, 205, 183, 0.18));
  animation: readyPathDraw 1550ms 240ms cubic-bezier(0.16, 0.86, 0.18, 1) both;
}
.ready-chart-point {
  position: absolute;
  z-index: 3;
  width: 1px;
  height: 1px;
  animation: readyPointIn 480ms calc(740ms + (var(--point-index) * 130ms)) cubic-bezier(0.2, 1.35, 0.25, 1) both;
}
.ready-chart-dot {
  position: absolute;
  left: -10px;
  top: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  border: 4px solid #e9d34d;
  box-shadow: 0 0 0 4px rgba(255,255,255,0.8);
}
.end-point .ready-chart-dot {
  border-color: #55cdb7;
}
.ready-chart-badge {
  position: absolute;
  left: 50%;
  bottom: 17px;
  transform: translateX(-50%);
  border-radius: 5px;
  background: #25282d;
  color: #ffffff;
  padding: 5px 8px;
  font-size: 11px;
  font-weight: 850;
  line-height: 1;
  white-space: nowrap;
}
.end-point .ready-chart-badge {
  transform: translateX(-74%);
}
.end-point .ready-chart-badge::after {
  left: 74%;
}
.ready-chart-badge::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -5px;
  width: 9px;
  height: 9px;
  background: #25282d;
  transform: translateX(-50%) rotate(45deg);
}
.ready-chart-month-tick {
  position: absolute;
  z-index: 2;
  top: 166px;
  left: 50%;
  min-width: 44px;
  display: grid;
  place-items: center;
  transform: translateX(-50%);
  color: var(--muted);
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0;
  text-align: center;
  white-space: nowrap;
  animation: readyMonthFade 420ms calc(820ms + (var(--point-index) * 120ms)) ease both;
}
.ready-chart-month-tick::before {
  content: "";
  position: absolute;
  left: 50%;
  top: -152px;
  width: 1px;
  height: 142px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, rgba(218, 223, 231, 0.42), rgba(218, 223, 231, 0.12));
  pointer-events: none;
}
.expected-result-label {
  position: absolute;
  right: 10px;
  top: 112px;
  color: color-mix(in srgb, var(--text) 64%, var(--surface));
  font-size: 12px;
  font-weight: 850;
  line-height: 1.12;
  text-align: center;
  animation: readyFade 520ms 1200ms ease both;
}
.loss-expected-label {
  right: 10px;
  top: 118px;
}
.gain-expected-label {
  right: 10px;
  top: 118px;
}
.maintain-expected-label {
  right: 10px;
  top: 118px;
}
@keyframes readyRise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes readyPop {
  from { opacity: 0; transform: scale(0.76); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes readyPathDraw {
  from { stroke-dashoffset: 360; }
  to { stroke-dashoffset: 0; }
}
@keyframes readyPointIn {
  from { opacity: 0; transform: scale(0.62); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes readyFade {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes readyMonthFade {
  from { opacity: 0; transform: translateX(-50%) translateY(6px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
.text-input {
  width: min(100%, 420px);
  height: 58px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: white;
  padding: 0 16px;
}
.email-capture-page {
  width: min(100%, 420px);
  margin: 0 auto;
  min-height: auto;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  gap: 22px;
  padding-top: 0;
}
.email-capture-page h1 {
  width: min(100%, 420px);
  margin: 0 auto 8px;
  font-size: clamp(26px, 4vw, 30px);
  line-height: 1.12;
}
.email-input-wrap {
  width: 100%;
  display: grid;
  text-align: left;
}
.email-input-wrap .text-input {
  width: 100%;
}
.email-privacy-note {
  width: 100%;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
}
.simple-top-rule {
  height: 1px;
  background: var(--border);
}
.auth-back-button {
  position: fixed;
  top: max(18px, env(safe-area-inset-top));
  left: 18px;
  z-index: 8;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--text);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.account-auth-page {
  width: min(100%, 420px);
  margin: 0 auto;
  padding-top: 10px;
  align-items: center;
  gap: 32px;
}
.profile-page {
  width: min(100%, 420px);
  margin: 0 auto;
  gap: 28px;
}
.account-auth-page h1,
.profile-head h1 {
  font-size: 30px;
}
.account-auth-page h1 {
  text-align: center;
  font-weight: 750;
}
.profile-head h1 {
  text-align: left;
}
.account-auth-page p,
.profile-head p {
  font-size: 16px;
}
.account-auth-page p {
  margin-top: -22px;
  text-align: center;
  color: #8d8d8f;
  font-weight: 500;
}
.auth-field {
  position: relative;
  width: 100%;
  display: block;
}
.auth-field input {
  width: 100%;
  height: 64px;
  border-radius: 6px;
  border: 0;
  background: #f1f1f2;
  color: var(--text);
  padding: 0 44px 0 12px;
  outline: none;
  font-size: 18px;
  font-weight: 650;
}
.auth-field input:focus {
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--primary) 35%, transparent);
}
.auth-field input::placeholder {
  color: #b4b4b8;
  opacity: 1;
}
.password-field button {
  position: absolute;
  right: 12px;
  top: 50%;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #99999d;
  cursor: pointer;
}
.auth-submit-button {
  width: 100%;
  min-height: 60px;
  border: 0;
  border-radius: 6px;
  background: var(--primary);
  color: #ffffff;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
}
.auth-submit-button:disabled {
  background: #dddddf;
  color: #9d9da0;
  cursor: not-allowed;
}
.auth-link-button {
  border: 0;
  background: transparent;
  color: #858589;
  padding: 0;
  text-decoration: underline;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
}
.forgot-link {
  align-self: flex-end;
  margin-top: -20px;
}
.profile-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.profile-id-caption {
  display: block;
  max-width: 280px;
  margin-top: 7px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.icon-button.soft {
  border-radius: 999px;
  background: transparent;
  border: 0;
}
.profile-section {
  width: 100%;
  display: grid;
  border-top: 1px solid var(--border);
}
.profile-section:last-of-type {
  border-bottom: 1px solid var(--border);
}
.profile-row {
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid var(--border);
}
.profile-section .profile-row:last-child {
  border-bottom: 0;
}
.profile-row span {
  color: #8d8d8f;
  font-size: 14px;
  font-weight: 700;
}
.profile-row strong {
  color: var(--text);
  font-size: 16px;
  font-weight: 750;
  text-align: right;
}
.cancel-flat-button {
  background: #f1f1f2;
  color: #bd2b47;
}
.answer-preview, .checkout-mount {
  width: 100%;
  min-height: 190px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: white;
  padding: 16px;
  overflow: auto;
}
.paywall-page {
  gap: 22px;
  align-items: center;
}
.paywall-countdown {
  width: min(100%, 390px);
  justify-self: center;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px 12px;
  align-items: center;
  padding: 0;
}
.paywall-countdown span {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.05;
  font-weight: 820;
}
.paywall-countdown strong {
  color: var(--primary);
  display: block;
  margin-top: 2px;
  font-size: 28px;
  line-height: 0.95;
  letter-spacing: 0;
  font-variant-numeric: tabular-nums;
}
.paywall-countdown button {
  min-width: 118px;
  white-space: nowrap;
  border: 0;
  border-radius: 12px;
  background: var(--primary);
  color: #ffffff;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}
.paywall-transform-card {
  width: min(100%, 390px);
  padding: 10px 0 2px;
  display: grid;
  gap: 9px;
}
.transform-visuals {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.transform-figure {
  display: grid;
  gap: 6px;
  text-align: center;
  min-width: 0;
}
.transform-figure span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}
.figure-placeholder {
  aspect-ratio: 0.86;
  border-radius: 18px;
  background: var(--body-image-bg);
  border: 0;
  overflow: hidden;
  position: relative;
}
.transform-figure.after .figure-placeholder {
  background: var(--body-image-bg);
}
.figure-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 18%;
  display: block;
}
.transform-figure strong {
  margin-top: 2px;
  color: var(--ink);
  font-size: 12px;
  line-height: 1.1;
}
.transform-figure em {
  color: var(--primary);
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0;
}
.paywall-transform-card p {
  margin: 1px 0 0;
  color: var(--muted);
  font-size: 10.5px;
  line-height: 1.35;
  text-align: center;
}
.paywall-hero {
  display: grid;
  gap: 8px;
  text-align: center;
  width: min(100%, 380px);
}
.paywall-kicker {
  justify-self: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--primary) 10%, var(--surface));
  color: var(--primary);
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 850;
}
.paywall-hero h1 {
  margin: 0;
  font-size: clamp(28px, 8vw, 36px);
  line-height: 1.04;
}
.paywall-hero p {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.45;
}
.paywall-hero.compact h2 {
  margin: 0;
  font-size: 24px;
  line-height: 1.12;
}
.paywall-snapshot {
  width: min(100%, 390px);
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
.paywall-snapshot div {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  padding: 13px 14px;
  display: grid;
  gap: 4px;
}
.paywall-snapshot span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}
.paywall-snapshot strong {
  color: var(--text);
  font-size: 15px;
  text-transform: capitalize;
}
.paywall-value-card {
  width: min(100%, 390px);
  padding: 4px 0 0;
  display: grid;
  gap: 12px;
}
.paywall-value-head {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
}
.paywall-value-head svg {
  color: var(--primary);
}
.paywall-value-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}
.paywall-value-card li {
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 8px;
  align-items: start;
  color: var(--text);
  font-size: 14px;
  line-height: 1.35;
}
.paywall-value-card li svg {
  color: #41b982;
  margin-top: 1px;
}
.plan-list {
  width: min(100%, 390px);
  display: grid;
  gap: 10px;
}
.plan-list.compact {
  gap: 8px;
}
.plan-card {
  position: relative;
  border: 1.5px solid var(--border);
  border-radius: 18px;
  background: white;
  padding: 17px 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(116px, auto);
  gap: 5px 14px;
  align-items: center;
  text-align: left;
  cursor: pointer;
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}
.plan-card strong {
  font-size: 16px;
  color: var(--text);
  text-transform: capitalize;
  white-space: nowrap;
}
.plan-card span:not(.plan-ribbon) {
  font-size: 18px;
  font-weight: 900;
  color: var(--text);
}
.plan-price {
  display: inline-flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 5px;
  flex-wrap: wrap;
  text-align: right;
  min-width: 116px;
  justify-self: end;
}
.plan-price b {
  color: var(--text);
  font-size: 20px;
  font-weight: 950;
}
.plan-price em {
  color: var(--muted);
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  text-decoration: line-through;
  text-decoration-thickness: 1.5px;
  text-decoration-color: color-mix(in srgb, var(--primary) 74%, #111827);
}
.plan-price i {
  flex-basis: 100%;
  color: var(--muted);
  font-size: 12px;
  font-style: normal;
  font-weight: 850;
  line-height: 1.05;
}
.plan-card small {
  grid-column: 1 / -1;
  color: var(--muted);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.plan-card small b {
  color: var(--primary);
  font-size: 12px;
  font-weight: 850;
}
.plan-card.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 14%, transparent), 0 14px 26px rgba(24, 28, 36, 0.08);
}
.plan-ribbon {
  position: absolute;
  right: 14px;
  top: -10px;
  border-radius: 999px;
  background: var(--primary);
  color: #ffffff;
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 850;
}
.secure-payments {
  width: min(100%, 390px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
}
.secure-payments strong {
  color: var(--text);
  font-size: 12px;
}
.app-preview-section, .social-proof-block, .challenge-card, .feedback-section, .result-story {
  width: min(100%, 390px);
  padding: 18px 0 0;
  border-top: 1px solid var(--border);
  display: grid;
  gap: 14px;
}
.app-preview-section h2,
.social-proof-block h2,
.feedback-section h2,
.result-story h2 {
  margin: 0;
  font-size: 20px;
  line-height: 1.15;
  text-align: center;
}
.phone-preview-row {
  display: grid;
  grid-template-columns: 0.8fr 1fr 0.8fr;
  gap: 10px;
  align-items: center;
  animation: screenshot-row-enter 680ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}
.phone-preview-card {
  aspect-ratio: 3 / 4;
  border-radius: 18px;
  background: var(--surface);
  overflow: hidden;
  box-shadow: 0 12px 26px rgba(37, 40, 45, 0.08);
  transition: transform 520ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 520ms cubic-bezier(0.16, 1, 0.3, 1), opacity 520ms ease;
}
.phone-preview-card.active {
  transform: scale(1.08);
  box-shadow: 0 18px 34px rgba(37, 40, 45, 0.12);
}
.phone-preview-card img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  background: #ffffff;
  animation: screenshot-image-settle 760ms cubic-bezier(0.16, 1, 0.3, 1);
}
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
}
.carousel-dots span {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--primary) 18%, var(--border));
  transition: width 360ms cubic-bezier(0.16, 1, 0.3, 1), background 360ms ease, opacity 360ms ease;
}
.carousel-dots span.active {
  width: 18px;
  background: var(--primary);
}
@keyframes screenshot-row-enter {
  from {
    opacity: 0;
    transform: translate3d(18px, 0, 0) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes screenshot-image-settle {
  from {
    opacity: 0.72;
    transform: scale(1.025);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .phone-preview-row,
  .phone-preview-card img {
    animation: none;
  }
  .phone-preview-card,
  .carousel-dots span {
    transition: none;
  }
}
.people-count {
  padding: 2px 0 0;
  display: grid;
  justify-items: center;
  gap: 4px;
}
.people-count span {
  font-size: 28px;
  font-weight: 950;
}
.people-count small {
  color: var(--muted);
  font-weight: 800;
}
.challenge-card {
  grid-template-columns: 1fr 138px;
  align-items: center;
}
.challenge-card span {
  color: var(--primary);
  font-size: 13px;
  font-weight: 900;
}
.challenge-card strong {
  display: block;
  margin-top: 6px;
  font-size: 18px;
  line-height: 1.2;
}
.calendar-placeholder {
  min-height: 136px;
  border-radius: 16px;
  background:
    linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px),
    linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
    color-mix(in srgb, var(--primary) 14%, #ffffff);
  background-size: 24px 24px;
  border: 1px solid color-mix(in srgb, var(--primary) 20%, var(--border));
}
.feedback-section {
  background: transparent;
  border: 0;
  padding: 0;
}
.feedback-card {
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--surface);
  padding: 14px;
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 10px;
}
.feedback-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, #ffffff), #ffffff);
  border: 1px solid var(--border);
}
.feedback-card strong {
  font-size: 14px;
}
.feedback-card p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.35;
}
.result-visual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.result-photo {
  min-height: 160px;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: linear-gradient(150deg, #ffffff, color-mix(in srgb, var(--primary) 10%, #f5f5f7));
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 900;
}
.result-story p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  text-align: center;
}
.paywall-proof, .paywall-trust, .paywall-faq {
  width: min(100%, 390px);
  border-top: 1px solid var(--border);
  padding: 15px;
}
.paywall-proof {
  display: grid;
  gap: 7px;
}
.proof-stars {
  display: block;
  letter-spacing: 0;
  color: inherit;
  font-size: 13px;
  line-height: 1.25;
}
.paywall-proof strong {
  font-size: 15px;
  line-height: 1.3;
}
.paywall-proof span {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.35;
}
.paywall-trust {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 10px;
  padding-left: 0;
  padding-right: 0;
}
.paywall-trust svg {
  color: var(--primary);
}
.paywall-trust strong {
  display: block;
  margin-bottom: 4px;
}
.paywall-trust p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.4;
}
.paywall-faq {
  padding: 0;
  overflow: hidden;
}
.paywall-faq summary {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 15px;
  cursor: pointer;
  font-weight: 850;
}
.paywall-faq summary::-webkit-details-marker {
  display: none;
}
.paywall-faq p {
  margin: 0;
  padding: 0 15px 15px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.4;
}
.paywall-page .checkout-mount {
  width: 100%;
  min-height: calc(100dvh - 74px);
  color: var(--muted);
}
.paywall-legal {
  width: min(100%, 390px);
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.45;
  text-align: center;
}
.paywall-cta-block {
  width: min(100%, 390px);
}
.paywall-cta-block .primary-button {
  width: 100%;
}
.subscription-disclosure {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.45;
  text-align: center;
}
.subscription-disclosure strong {
  color: var(--text);
  font-weight: 900;
}
.checkout-overlay {
  position: fixed;
  inset: 0;
  z-index: 95;
  display: grid;
  place-items: stretch;
  padding: 0;
  background: var(--surface);
  overflow: auto;
  animation: overlayFadeIn 180ms ease both;
}
.checkout-sheet {
  width: 100%;
  min-height: 100dvh;
  border-radius: 0;
  background: var(--surface);
  box-shadow: none;
  padding: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  align-content: start;
  gap: 0;
}
.checkout-sheet-head {
  min-height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: max(12px, env(safe-area-inset-top)) 18px 12px;
  border-bottom: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.96);
  position: sticky;
  top: 0;
  z-index: 2;
}
.checkout-sheet-head span {
  color: var(--primary);
  font-size: 12px;
  font-weight: 850;
  text-transform: uppercase;
}
.checkout-sheet-head h2 {
  margin: 3px 0 0;
  font-size: 20px;
  line-height: 1.12;
}
.checkout-close-button {
  min-height: 40px;
  border: 0;
  border-radius: var(--button-radius);
  background: color-mix(in srgb, var(--primary) 10%, #ffffff);
  color: var(--text);
  padding: 0 16px;
  font-weight: 800;
}
.checkout-loading {
  margin: 14px 18px 0;
  color: var(--muted);
  font-size: 13px;
}
.error-text { color: #b3261e; font-weight: 700; }
.subtle-note { font-size: 14px; color: var(--muted); text-align: center; }
.debug-reset, .new-plan-link {
  position: fixed;
  right: 14px;
  bottom: 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: white;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
}
.new-plan-link { bottom: 58px; }

@media (min-width: 900px) {
  .app-shell:not(.shell-entry) {
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--bg) 92%, #ffffff) 0 64px, transparent 64px),
      var(--bg);
  }
  .desktop-layout {
    width: min(100%, 1220px);
    margin: 0 auto;
    display: block;
  }
  .shell-entry .desktop-layout {
    width: 100%;
    max-width: none;
  }
  .topbar {
    height: 64px;
    grid-template-columns: 96px minmax(520px, 760px) 96px;
    justify-content: center;
    padding: 0 24px;
  }
  .topbar-center {
    width: min(760px, 56vw);
    justify-self: center;
  }
  .section-progress {
    width: 100%;
    max-width: 180px;
  }
  .screen-main {
    width: min(100%, 760px);
    max-width: 760px;
    padding: 42px 0 52px;
  }
  .screen-main.page-type-single_choice_page,
  .screen-main.page-type-multi_choice_page {
    min-height: calc(100dvh - 64px);
  }
  .screen-main.page-type-multi_choice_page,
  .screen-main.page-type-height_input_page,
  .screen-main.page-type-weight_input_page,
  .screen-main.page-type-age_input_page,
  .screen-main.page-type-email_capture_page,
  .screen-main.page-type-summary_page,
  .screen-main.page-type-plan_ready_page,
  .screen-main.page-type-paywall_page {
    padding-bottom: 132px;
  }
  .page-id-entry,
  .page-type-entry_page {
    width: 100%;
    max-width: none;
    padding: 0;
  }
  .page-stack {
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
  }
  .centered {
    align-items: center;
  }
  .page-stack > h1,
  .intro-content h1 {
    max-width: 760px;
    text-align: center;
    font-size: clamp(30px, 2.6vw, 42px);
    line-height: 1.08;
  }
  .page-stack > p,
  .intro-content p {
    max-width: 620px;
    text-align: center;
    font-size: 17px;
    line-height: 1.5;
  }
  .choice-list,
  .choice-image-grid,
  .input-panel,
  .summary-card,
  .ready-chart-card,
  .account-auth-page,
  .profile-page {
    width: min(100%, 760px);
  }
  .choice-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }
  .choice-list.plain-list,
  .choice-list.icon-list {
    grid-template-columns: 1fr;
    width: min(100%, 720px);
    margin-inline: auto;
  }
  .option-row {
    min-height: 76px;
  }
  .choice-image-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }
  .choice-image-grid.multi {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: min(100%, 760px);
    margin-inline: auto;
  }
  .image-choice-card {
    min-height: 220px;
  }
  .choice-image-media {
    min-height: 154px;
  }
  .intro-page {
    min-height: auto;
    justify-content: flex-start;
  }
  .intro-hero-image,
  .hero-placeholder {
    width: min(720px, 100%);
    max-height: 420px;
  }
  .numeric-input {
    min-height: 180px;
  }
  .numeric-input input {
    font-size: 76px;
  }
  .sticky-button {
    position: fixed;
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    align-self: auto;
    margin-top: 0;
    width: min(720px, calc(100% - 40px));
    box-shadow: 0 16px 42px rgba(34, 30, 38, 0.12);
  }
  .page-type-summary_page,
  .page-type-plan_ready_page,
  .page-type-paywall_page {
    width: min(100%, 860px);
    max-width: 860px;
  }
  .page-type-summary_page .page-stack,
  .page-type-plan_ready_page .page-stack,
  .page-type-paywall_page .paywall-page {
    width: min(100%, 860px);
    max-width: 860px;
    margin: 0 auto;
  }
  .paywall-topbar {
    grid-template-columns: minmax(520px, 860px);
    justify-content: center;
  }
  .paywall-topbar .paywall-countdown {
    width: min(860px, calc(100vw - 80px));
  }
  .paywall-transform-card,
  .paywall-hero,
  .paywall-cta-block,
  .paywall-value-card,
  .paywall-plan-card,
  .paywall-proof,
  .paywall-trust,
  .paywall-faq,
  .paywall-page .checkout-mount,
  .paywall-legal,
  .subscription-disclosure,
  .plan-list {
    width: 100%;
  }
  .paywall-transform-card {
    max-width: 760px;
    margin-inline: auto;
  }
  .screen-main.page-type-account_create_page,
  .screen-main.page-type-login_page,
  .screen-main.page-type-account_page {
    width: min(100%, 560px);
    max-width: 560px;
  }
}

@media (max-width: 520px) {
  .topbar { height: 60px; padding: 0 12px; grid-template-columns: 44px 1fr 48px; }
  .paywall-topbar { grid-template-columns: 1fr; padding: 8px 12px; }
  .screen-main { padding: 30px 20px 42px; }
  .screen-main.page-type-single_choice_page,
  .screen-main.page-type-multi_choice_page {
    min-height: calc(100dvh - 60px);
  }
  .screen-main.page-type-multi_choice_page,
  .screen-main.page-type-height_input_page,
  .screen-main.page-type-weight_input_page,
  .screen-main.page-type-age_input_page,
  .screen-main.page-type-email_capture_page,
  .screen-main.page-type-summary_page,
  .screen-main.page-type-plan_ready_page,
  .screen-main.page-type-paywall_page {
    padding-bottom: 104px;
  }
  .page-type-entry_page,
  .page-id-entry { padding: 0; }
  .entry-page { min-height: 100dvh; padding: 86px 24px max(56px, env(safe-area-inset-bottom)); }
  .entry-hero-image { object-position: 64% center; }
  .entry-top { top: 24px; left: 24px; right: 24px; }
  .entry-top strong { max-width: 210px; font-size: 18px; }
  .entry-top button { min-width: 76px; min-height: 44px; padding: 0 16px; }
  .entry-content { width: min(300px, 82vw); }
  .entry-content h1 { max-width: 10ch; font-size: clamp(38px, 11vw, 48px); }
  .entry-content p { display: none; }
  .intro-page { min-height: calc(100vh - 60px - 134px); }
  .option-row { min-height: 64px; }
  .choice-image-grid { gap: 12px; }
  .image-choice-card { min-height: 164px; }
  .choice-image-media { min-height: 116px; }
  .numeric-input input { font-size: 58px; }
  .plan-card {
    grid-template-columns: minmax(0, 1fr) minmax(104px, auto);
    gap: 5px 10px;
  }
  .plan-card strong {
    font-size: 15px;
  }
  .plan-price {
    min-width: 104px;
  }
  .plan-price b {
    font-size: 19px;
  }
  .debug-reset { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}

`);

writeJson("outputs/design/theme.json", runtimeTheme);
writeJson("apps/template/funnel.config.json", templateConfig);
writeJson("apps/template/copy.json", templateCopy);
writeJson("apps/template/theme.json", templateTheme);
writeJson("apps/template/page-visual-map.json", templatePageVisualMap);
writeJson("apps/template/icon-map.json", templateIconMap);
writeJson("apps/template/assets-manifest.json", templateAssetsManifest);
write("apps/template/README.md", `# App Template Config Package

This folder is the copyable app-level configuration package.

When another app is created, copy this folder to \`apps/{app-slug}\` and replace content files without changing runtime logic.

## Files

- \`funnel.config.json\`: page order, pageType, dataKey, validation defaults, backend placement metadata.
- \`copy.json\`: product-specific page titles, subtitles, body copy, CTA labels, and option labels.
- \`theme.json\`: global design tokens such as colors, typography, and shape.
- \`page-visual-map.json\`: visual behavior per page type and page instance, such as layout, radius, image ratio, selected style, and desktop rules.
- \`icon-map.json\`: Lucide icon assignments for UI controls and option values.
- \`assets-manifest.json\`: generated or placeholder image assets bound to page ids and option values.

The React runtime should consume these through \`normalizeRuntimeConfig()\`, not by letting components read every file directly.
`);
writeJson("outputs/config/app-config/funnel.config.json", runtimeFunnelConfig);
writeJson("outputs/config/app-config/copy.json", runtimeCopy);
writeJson("outputs/config/app-config/theme.json", runtimeTheme);
writeJson("outputs/config/app-config/page-visual-map.json", runtimePageVisualMap);
writeJson("outputs/config/app-config/icon-map.json", runtimeIconMap);
writeJson("outputs/config/app-config/assets-manifest.json", runtimeAssetsManifest);
if (runtimeStitchDerivedStyle) {
  writeJson("outputs/design/stitch-derived-style.json", runtimeStitchDerivedStyle);
  writeJson("outputs/config/app-config/stitch-derived-style.json", runtimeStitchDerivedStyle);
}
write("outputs/config/app-config/README.md", `# Generated App Config

These files are the normalized source inputs for the React runtime template.

They mirror \`apps/template\` so QA can inspect exactly which app-level configuration produced \`outputs/app\`.
`);
writeJsonIfMissing("outputs/design/theme-candidates.json", {
  version: "template",
  selectedCandidateId: "runtime_default",
  selectionRationale: "Template runs use a neutral default token set only to test runtime components. Product runs must replace this with brand and audience evidence.",
  candidates: [
    {
      id: "brand_aligned",
      sourceType: "user_provided",
      primary: "#D93278",
      accent: "#6A4C93",
      background: "#F7F6F9",
      surface: "#FFFFFF",
      text: "#25282D",
      audienceFit: "Placeholder for product-specific audience fit.",
      conversionFit: "Useful for component QA, not final conversion design.",
      brandEvidence: "Template default only.",
      risks: "Should not be inherited as a product color without evidence.",
      whyNotSelected: "The runtime template selects runtime_default."
    },
    {
      id: "audience_optimized",
      sourceType: "category_research",
      primary: "#5368C9",
      accent: "#D95F8B",
      background: "#F8F7FA",
      surface: "#FFFFFF",
      text: "#25282D",
      audienceFit: "Placeholder for audience-optimized candidate.",
      conversionFit: "Placeholder for conversion rationale.",
      brandEvidence: "Not applicable in template mode.",
      risks: "Not selected in template mode.",
      whyNotSelected: "No product audience exists in template mode."
    },
    {
      id: "differentiated",
      sourceType: "neutral_fallback",
      primary: "#1F2428",
      accent: "#D93278",
      background: "#F7F6F9",
      surface: "#FFFFFF",
      text: "#25282D",
      audienceFit: "Placeholder for differentiated candidate.",
      conversionFit: "Placeholder for conversion rationale.",
      brandEvidence: "Not applicable in template mode.",
      risks: "Can feel too generic.",
      whyNotSelected: "No product differentiation target exists in template mode."
    },
    {
      id: "runtime_default",
      sourceType: "user_provided",
      primary: "#D93278",
      accent: "#6A4C93",
      background: "#F7F6F9",
      surface: "#FFFFFF",
      text: "#25282D",
      audienceFit: "Template color set for runtime QA and component development.",
      conversionFit: "Supports visual testing of selected states, progress, CTA, and validation states.",
      brandEvidence: "Template default, not product evidence.",
      risks: "Must be replaced in real product runs."
    }
  ]
});
writeJsonIfMissing("outputs/design/art-direction.json", {
  visualWorld: "Runtime template mode; visual world is intentionally neutral and must be replaced by product-specific Stitch/Figma handoff.",
  imageStyle: "No product imagery is generated in template mode. Product runs should use gpt-image-2 raster assets.",
  compositionPrinciples: "Mobile-first Web2App pages with desktop centered web canvas, stable controls, and no phone mockup.",
  differentiationFromPreviousRuns: "Template focuses on reusable page capability behavior rather than product-specific styling."
});
writeJsonIfMissing("outputs/design/screen-blueprints.json", {
  version: "template",
  blueprints: [
    "TopProgress",
    "SingleChoicePage",
    "MultiChoicePage",
    "ChoiceOptions",
    "IntroPage",
    "AgeInputPage",
    "HeightInputPage",
    "CurrentWeightPage",
    "TargetWeightPage",
    "EmailInputPage"
  ].map((pageId) => ({
    pageId,
    pageType: pageId,
    conversionPurpose: "Runtime component capability template for future generated funnels.",
    userMoment: "Template QA moment; product runs replace this with real funnel psychology.",
    visualJob: "Expose stable component states so Stitch/Figma can design variants without owning logic.",
    composition: "Mobile-first, stable dimensions, desktop web canvas.",
    componentHierarchy: ["TopProgress", "Primary content", "Interactive control", "CTA where required"]
  }))
});
writeIfMissing("outputs/design/design-system.md", `# Runtime Template Design System

This is a neutral design shell for the React Runtime code package.

Product runs must replace these tokens with product-specific theme candidates and Stitch/Figma handoff.
`);
writeIfMissing("outputs/design/design-prompt.md", `# Runtime Template Design Prompt

This document is intentionally written as a full design brief even though this is template mode. Its purpose is to make the relationship between React Runtime, generated config, and Stitch/Figma explicit. Product runs must replace the product psychology, art direction, image requirements, and theme evidence with product-specific decisions.

## Product Psychology

Template mode does not represent a real consumer product. It represents the reusable Web2App runtime component kit. The psychological job of this template is to verify that the system can render common funnel moments without rebuilding business logic from scratch. The first milestone covers the beginning of a Web2App flow: low-friction identity creation after the first real answer, basic goal capture, trust-building intro content, measurement input with calculation, and lead capture with backend identity binding.

In real product runs, this section should describe the target audience, category, current pain, desired transformation, traffic source, funnel type, paywall promise, and trust barriers. For this template, the only audience is the internal operator checking whether the code package behaves correctly. Visual design should be calm and readable so behavior is easy to inspect. It should not try to be a final branded product.

The key mental model is separation of responsibilities. Runtime code owns answer capture, session identity, Firebase custom token exchange, Firestore persistence, unit conversion, BMI calculation, and API calls. Config owns title, subtitle, dataKey, options, default values, section labels, and page order. Stitch/Figma owns visual expression such as spacing, modules, surface treatment, selected states, image placement, and hierarchy.

## Theme Candidate Summary

The selected candidate is runtime_default. It uses #D93278 as a visible QA accent, #F7F6F9 as the canvas, white surfaces, and dark text. This is not a product-specific theme. It exists so selected states, unit tabs, CTA, progress, warning cards, and disabled states are easy to inspect.

The brand_aligned candidate is only a placeholder because template mode has no brand evidence. The audience_optimized candidate is also a placeholder because there is no final user segment. The differentiated candidate uses a darker neutral primary as a reminder that a future product run can be visually distinct without changing runtime behavior.

Product runs should not inherit #D93278 blindly. They should select color based on app store evidence, target audience, modality, gender/age context, and emotional promise. A senior fitness app, military workout app, chair yoga app, and women weight-loss app should not all share this exact accent.

## Color Rationale

Use #D93278 only as a default accent for testing. It should appear on primary CTA, active unit tab, selected plan state, and top progress. The background uses #F7F6F9 because it is a quiet single-color canvas that makes measurement and option components readable. Cards use white surfaces so the runtime's fixed controls can be inspected without visual noise.

The template should avoid loud gradients, decorative effects, or product-specific imagery. The goal is clarity. If a component fails visually here, it will fail worse after product-specific design variations are applied. Disabled CTAs use a gray-blue disabled color, not low-opacity primary, so min-selection and validation states are obvious.

## Screen By Screen Composition

TopProgress should show a back icon, centered section label, segmented progress bar, and optional x/y count. It must count only real onboarding question/input pages. It should never derive progress from raw page index. Entry, intro, summary, analysis, plan generation, plan ready, paywall, payment success, account, login, and subscription management pages are outside OB question progress.

SingleChoicePage should support three visual variants through ChoiceOptions: image_grid for large image cards, plain_list for text-only rows, and icon_list for semantic Lucide icon rows. It has no bottom CTA by default. Choosing an option auto-advances. Only the first real answer blocks navigation while the runtime creates the anonymous user and exchanges the Firebase custom token. After identity exists, ordinary answer persistence runs in the background and must not show full-screen loading. Blocking identity/login/account states use the shared full-screen LoadingOverlay spinner, not inline text or a spinner embedded inside the selected option.

MultiChoicePage should support the same three visual variants through ChoiceOptions: image_grid, plain_list, and icon_list. It requires a bottom CTA and disables it until minSelections is met. The visual selected state should be strong enough to audit from a screenshot. Icon usage is optional unless the page variant is icon_list.

IntroPage is a non-data trust screen. It may include a hero image in product mode, but template mode uses a neutral placeholder. It does not create identity or write answers. Its primary CTA uses the same bottom sticky button size and placement as other CTA-driven OB pages.

AgeInputPage uses fixed runtime logic for exact age capture after the low-friction age group page. It should show a large numeric input, default value, 0 placeholder when empty, validation range, and a reassuring card explaining age is used to personalize intensity, pacing, and body insights.

HeightInputPage uses fixed runtime logic for in/cm conversion. The design can change the visual style of the unit tabs and numeric input, but it cannot change the conversion semantics. The default value must be visible and continuing without editing must save the default normalized value.

CurrentWeightPage uses fixed runtime logic for lbs/kg conversion and BMI calculation when height is available. The BMI card is a runtime-owned derived module. Stitch/Figma may change card styling and warning tone, but not the BMI formula.

TargetWeightPage uses fixed runtime logic for lbs/kg conversion, target BMI, and target-weight warning. The warning should be supportive and compliant. It should not shame the user or make medical claims.

EmailInputPage belongs to lead and identity, not basic input. It validates email, saves it to session answers, writes it to Firestore, and calls /users/current when identity exists. The design may include privacy reassurance, plan preview, or gentle lead-capture framing.

## Image Requirements

Template mode does not generate product imagery. It may use neutral placeholders only. Product runs must use gpt-image-2 raster assets for entry, intro, age group options, plan-ready, and other image-led moments. Images must be scene-based and tied to user psychology rather than decorative fillers. Do not use SVGs for generated image assets.

In product mode, image prompts should specify the user moment, emotional job, visual job, composition, and negative prompt. For example, an intro image should reinforce why the next section matters; an age option image should make the user's life stage feel recognized; a plan-ready image should make the unlocked plan feel owned.

## Interaction And State Requirements

Runtime logic must be inspectable in this template. The first real answer triggers anonymous identity creation only after the answer is chosen. App boot, entry-page view, start CTA, login page view, and account page view must not create anonymous identity. Identity and answers use sessionStorage only, so a new browser tab is a new user session.

Answer persistence writes flat fields to Firestore. The Firestore document id is uid and collection defaults to test through VITE_FIRESTORE_FUNNEL_COLLECTION || "test". Do not store wrapper objects such as project, uid, data, appCode, placementCode, eventType, dataKey, or value inside the answer document.

Paywall runtime behavior is included as an adapter placeholder in the code package. Real product runs must load offers from resolve/offers?placementCode, use Billing offers[].priceId, bind current user, create Stripe embedded-session, and mount Stripe Embedded Checkout using clientSecret. Mock plans are display fallback only and cannot be used as checkout price ids.

## Boundaries

Do not treat this template as a final product design. Do not judge product design quality from template mode. Do not ask Stitch/Figma to invent unit conversion, BMI, identity creation, Firestore persistence, checkout, or subscription lookup. Those are runtime capabilities. Stitch/Figma should only design visual variants around named capabilities such as CurrentWeightPage, TargetWeightPage, EmailInputPage, and PaywallPage.

Do not use a phone mockup on desktop. Desktop Web2App layout should be a centered content column on a full web canvas. Do not create hard stage guards that trap browser Back. If a user returns to a page, invalid actions should be hidden or disabled by state, not blocked through history manipulation.
`);
writeJson("outputs/config/funnel.config.json", runtimeFunnelConfig);
write("outputs/config/funnel.config.ts", `export const funnelConfig = ${JSON.stringify(runtimeFunnelConfig, null, 2)} as const;\n`);
write("outputs/config/short-ob-flow.md", `# Short OB Runtime Flow

This generated runtime template integrates the currently implemented page capabilities into one short onboarding flow.

## Sequence

1. age_group - SingleChoicePage / image_grid / counted OB step 1
2. age - AgeInputPage / exact age personalization / counted OB step 2
3. intro - IntroPage / trust builder / not counted
4. starter_level - SingleChoicePage / plain_list capability example / counted OB step 3
5. focus_areas - MultiChoicePage / icon_list / counted OB step 4
6. blockers - MultiChoicePage / plain_list / counted OB step 5
7. height - HeightInputPage / unit conversion / counted OB step 6
8. current_weight - WeightInputPage / BMI card / counted OB step 7
9. target_weight - WeightInputPage / target warning / counted OB step 8
10. email - EmailInputPage / lead and current-user binding / not counted
11. summary - SummaryPage / answer-derived result / not counted
12. plan_generation - PlanGenerationPage / generated-plan animation / not counted
13. plan_ready - PlanReadyPage / plan preview / not counted

## API Source

Future backend template code must use \`inputs/api-reference.md\` as the canonical API reference.

- Billing base URL default: \`https://billing-dev.cloud.7mfitness.com\`
- Product display: \`GET /billing/{appCode}/v1/paywalls/resolve/offers?placementCode={lpid}\`
- Product display auth: none
- Anonymous identity: \`POST /billing/{appCode}/v1/users/anonymous\`, auth none
- Authenticated calls: Firebase Web SDK customToken exchange, then \`Authorization: Bearer <Firebase ID Token>\`
`);
write("outputs/app/README.md", `# Web2App React Runtime Template

This is the reusable React runtime code package generated from \`docs/runtime-page-capabilities.md\`.

This template is not a product-specific funnel. Product runs should replace config, copy, theme, assets, and design handoff while keeping runtime logic stable.

First milestone implemented:

- TopProgress
- SingleChoicePage
- MultiChoicePage
- ChoiceOptions with image_grid, plain_list, and icon_list variants
- IntroPage
- AgeInputPage
- HeightInputPage
- WeightInputPage for current and target weight
- EmailInputPage
- Shared sessionStorage answer store
- Firebase custom token exchange
- Firestore flat answer persistence
- Billing API adapter
- Stripe Embedded Checkout adapter placeholder through PaywallPage

Run:

\`\`\`bash
npm install
npm run dev -- --port 5192
\`\`\`
`);
write("outputs/qa/qa-report.md", `# Runtime Template QA

Pending build and validation.
`);

files.set("outputs/app/src/runtime/templateConfig.ts", `import { normalizeRuntimeConfig } from "./normalizeRuntimeConfig";
import type { AssetsManifest, CopyConfig, FunnelConfig, IconMap, PageVisualMap, Theme } from "./types";

export const templateTheme = ${JSON.stringify(runtimeTheme, null, 2)} as Theme;

export const funnelConfig = ${JSON.stringify(runtimeFunnelConfig, null, 2)} as FunnelConfig;

export const copyConfig = ${JSON.stringify(runtimeCopy, null, 2)} as CopyConfig;

export const pageVisualMap = ${JSON.stringify(runtimePageVisualMap, null, 2)} as PageVisualMap;

export const stitchDerivedStyle = ${JSON.stringify(runtimeStitchDerivedStyle ?? {}, null, 2)} as PageVisualMap;

export const iconMap = ${JSON.stringify(runtimeIconMap, null, 2)} as IconMap;

export const assetsManifest = ${JSON.stringify(runtimeAssetsManifest, null, 2)} as AssetsManifest;

export const templateConfig: FunnelConfig = normalizeRuntimeConfig({
  funnel: funnelConfig,
  copy: copyConfig,
  theme: templateTheme,
  pageVisualMap,
  stitchDerivedStyle,
  iconMap,
  assetsManifest
});
`);

for (const [filePath, content] of files.entries()) {
  write(filePath, content);
}

copyRuntimeAssets(runtimeAssetsManifest);

console.log(`Created React runtime template at ${path.join(outputRoot, "app")}`);
