export function validateConfig(ctx) {
  if (!ctx.exists("outputs/config/funnel.config.json")) return;

  const config = ctx.readJson("outputs/config/funnel.config.json");
  if (!Array.isArray(config.pages) || config.pages.length === 0) {
    ctx.fail("outputs/config/funnel.config.json must include pages");
  }

  for (const page of config.pages ?? []) {
    if (!page.phase) ctx.fail(`Config page '${page.id}' must include phase`);
    if (!page.role) ctx.fail(`Config page '${page.id}' must include role`);
  }

  const countedProgressPages = (config.pages ?? []).filter((page) => page.progress?.countsTowardTotal);
  const obQuestionTypes = new Set([
    "single_choice_page",
    "multi_choice_page",
    "age_input_page",
    "height_input_page",
    "weight_input_page",
    "measurement_picker_page",
  ]);
  const expectedProgressPages = (config.pages ?? []).filter((page) => page.phase === "onboarding" && obQuestionTypes.has(page.pageType) && page.dataKey);
  if (expectedProgressPages.length && countedProgressPages.length !== expectedProgressPages.length) {
    ctx.fail(`OB numbered progress must count only onboarding question/input pages (${expectedProgressPages.length}), found ${countedProgressPages.length}`);
  }
  for (const [index, page] of countedProgressPages.entries()) {
    if (page.progress.scope !== "ob_questions") ctx.fail(`Page '${page.id}' counted progress must use progress.scope: ob_questions`);
    if (page.progress.step !== index + 1) ctx.fail(`Page '${page.id}' progress.step must be ${index + 1}`);
    if (page.progress.total !== countedProgressPages.length) ctx.fail(`Page '${page.id}' progress.total must equal counted OB questions (${countedProgressPages.length})`);
    if (!page.progress.showStepCount) ctx.fail(`Page '${page.id}' counted progress must show step count`);
  }
  for (const page of config.pages ?? []) {
    if (["result", "paywall", "checkout", "paid", "account"].includes(page.phase) && page.progress?.showStepCount) {
      ctx.fail(`Page '${page.id}' is phase '${page.phase}' and must not show OB x/y progress`);
    }
    if (["paywall_page", "payment_success_page", "account_create_page", "login_page", "account_page", "subscription_manage_page", "cancel_subscription_page"].includes(page.pageType) && page.progress?.visible) {
      ctx.fail(`Page '${page.id}' must opt out of top OB progress`);
    }
    if (page.pageType === "height_input_page") {
      if (!page.defaultUnit) ctx.fail(`Height page '${page.id}' must include defaultUnit`);
      if (!page.defaultValue?.cm || Number(page.defaultValue.cm) <= 0) ctx.fail(`Height page '${page.id}' must include defaultValue.cm`);
    }
    if (page.pageType === "weight_input_page") {
      if (!page.defaultUnit) ctx.fail(`Weight page '${page.id}' must include defaultUnit`);
      if (!page.defaultValue?.kg || Number(page.defaultValue.kg) <= 0) ctx.fail(`Weight page '${page.id}' must include defaultValue.kg`);
    }
  }

  const pageTypes = new Set((config.pages ?? []).map((page) => page.pageType));
  const backendIntegration = config.backendIntegration ?? {};

  const paymentSuccess = (config.pages ?? []).find((page) => page.pageType === "payment_success_page");
  if (paymentSuccess && (paymentSuccess.milestone !== "payment_verified" || paymentSuccess.commitPhase !== "paid")) {
    ctx.fail("payment_success_page config must commit paid through milestone payment_verified");
  }

  if (backendIntegration.identityMode && backendIntegration.identityMode !== "backend_custom_token_firebase_web_sdk") {
    ctx.fail("backendIntegration.identityMode must be backend_custom_token_firebase_web_sdk.");
  }
  if (backendIntegration.storageScope !== "sessionStorage") {
    ctx.fail("backendIntegration.storageScope must be sessionStorage so a new tab is a new visitor session.");
  }
  if (backendIntegration.firebaseAuthPersistence !== "browserSessionPersistence") {
    ctx.fail("backendIntegration.firebaseAuthPersistence must be browserSessionPersistence.");
  }
  if (backendIntegration.anonymousIdentityTrigger !== "first_real_ob_answer_input") {
    ctx.fail("backendIntegration.anonymousIdentityTrigger must be first_real_ob_answer_input.");
  }
  if (backendIntegration.firestore?.answerCollectionDefault !== "test") {
    ctx.fail("backendIntegration.firestore.answerCollectionDefault must be test.");
  }
  if (backendIntegration.firestore?.answerDocumentId !== "uid") {
    ctx.fail("backendIntegration.firestore.answerDocumentId must be uid.");
  }
  if (backendIntegration.firestore?.answerDocumentShape !== "flat_user_answers_only") {
    ctx.fail("backendIntegration.firestore.answerDocumentShape must be flat_user_answers_only.");
  }
  if (config.lifecycle?.storage !== "sessionStorage") {
    ctx.fail("lifecycle.storage must be sessionStorage.");
  }

  if (pageTypes.has("login_page") && backendIntegration.accountLoginMode !== "backend_email_password_login") {
    ctx.fail("login_page requires backendIntegration.accountLoginMode: backend_email_password_login");
  }

  if (
    (pageTypes.has("account_page") || pageTypes.has("subscription_manage_page") || pageTypes.has("cancel_subscription_page")) &&
    backendIntegration.subscriptionManagementMode !== "backend_subscription_management"
  ) {
    ctx.fail("account/subscription pages require backendIntegration.subscriptionManagementMode: backend_subscription_management");
  }

  if (pageTypes.has("account_page")) {
    const accountPage = (config.pages ?? []).find((page) => page.pageType === "account_page");
    const sources = accountPage?.subscriptionDataSources ?? [];
    for (const source of ["subscriptionStatus", "subscriptionList", "entitlements"]) {
      if (!sources.includes(source)) ctx.fail(`account_page must include subscriptionDataSources '${source}'`);
    }
  }

  const paywall = (config.pages ?? []).find((page) => page.pageType === "paywall_page");
  if (!paywall) return;

  if (paywall.paymentProvider !== "stripe") {
    ctx.fail("paywall_page must declare paymentProvider: stripe");
  }
  if (paywall.stripePublishableKeyEnv !== "VITE_STRIPE_PUBLISHABLE_KEY") {
    ctx.fail("paywall_page must use stripePublishableKeyEnv: VITE_STRIPE_PUBLISHABLE_KEY");
  }
  if (paywall.productSource !== "billing_resolve_offers") {
    ctx.fail("paywall_page must use productSource: billing_resolve_offers.");
  }
  if (!paywall.placementCode) {
    ctx.fail("paywall_page must include placementCode for resolve/offers product loading.");
  }
  if (paywall.paywallCode && paywall.productSource === "billing_resolve_offers") {
    ctx.fail("paywall_page must not generate paywallCode for frontend resolve/offers product loading; use placementCode/lpid.");
  }

  const serializedPaywall = JSON.stringify(paywall);
  if (serializedPaywall.includes("sk_test_") || serializedPaywall.includes("sk_live_") || serializedPaywall.includes("whsec_")) {
    ctx.fail("paywall_page must not include Stripe secret keys or webhook secrets");
  }

  if (!Array.isArray(paywall.plans) || paywall.plans.length < 2) {
    ctx.fail("paywall_page must include at least two API-ready mock plans");
  }

  for (const plan of paywall.plans ?? []) {
    for (const field of ["id", "productId", "label", "price", "billingPeriod"]) {
      if (!plan[field]) ctx.fail(`Paywall plan missing ${field}`);
    }
  }

  for (const field of ["resultPreview", "renewalDisclosure", "highlights", "faq", "moneyBackGuarantee"]) {
    if (!paywall[field]) ctx.fail(`paywall_page must include ${field}`);
  }

  if (!Array.isArray(paywall.highlights) || paywall.highlights.length < 3) {
    ctx.fail("paywall_page must include at least three plan highlights");
  }
  if (!Array.isArray(paywall.faq) || paywall.faq.length < 3) {
    ctx.fail("paywall_page must include at least three FAQ items");
  }
  if (!Array.isArray(paywall.testimonials) || paywall.testimonials.length < 1) {
    ctx.fail("paywall_page must include social proof testimonials");
  }
  if (!Array.isArray(paywall.legalLinks) || paywall.legalLinks.length < 2) {
    ctx.fail("paywall_page must include footer legal links");
  }
}
