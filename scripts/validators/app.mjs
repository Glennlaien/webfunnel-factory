export function validateApp(ctx) {
  if (ctx.exists("outputs/app/index.html")) {
    const indexHtml = ctx.readText("outputs/app/index.html");
    if (!/<meta\s+name=["']viewport["'][^>]*width=device-width[^>]*initial-scale=1/i.test(indexHtml)) {
      ctx.fail("outputs/app/index.html must include mobile viewport meta: width=device-width, initial-scale=1");
    }
  }

  if (ctx.exists("outputs/design/theme.json") && ctx.exists("outputs/app/src/styles.css")) {
    const theme = ctx.readJson("outputs/design/theme.json");
    const styles = ctx.readText("outputs/app/src/styles.css");
    const expectedBackground = (theme.colorSystem?.background ?? "").toLowerCase();
    const bgMatch = styles.match(/--bg:\s*(#[0-9a-fA-F]{6})\s*;/);

    if (expectedBackground && bgMatch && bgMatch[1].toLowerCase() !== expectedBackground) {
      ctx.fail(`outputs/app/src/styles.css --bg (${bgMatch[1]}) must match outputs/design/theme.json colorSystem.background (${theme.colorSystem.background})`);
    }
  }

  if (ctx.exists("outputs/app/src")) {
    const app = ctx.readTextTree("outputs/app/src");
    const paywallMatch = app.match(/function\s+Paywall[\s\S]*?function\s+AuthForm/);
    if (paywallMatch) {
      const paywallSource = paywallMatch[0];
      if (/onClick=\{next\}/.test(paywallSource)) {
        ctx.fail("Paywall must not use CTA onClick={next}; it must create/mount checkout before payment_success.");
      }
      if (!app.includes("embedded-session")) {
        ctx.fail("Paywall checkout flow must call the Stripe embedded-session backend endpoint.");
      }
      if (!app.includes("clientSecret")) {
        ctx.fail("Paywall checkout flow must require a backend clientSecret before mounting checkout.");
      }
      if (!paywallSource.includes("createEmbeddedCheckoutPage") || !paywallSource.includes(".mount(")) {
        ctx.fail("Paywall checkout flow must mount Stripe Embedded Checkout with stripe.createEmbeddedCheckoutPage({ clientSecret }).mount(...).");
      }
      if (!paywallSource.includes("returnUrl") || !paywallSource.includes("idempotencyKey")) {
        ctx.fail("Stripe embedded checkout request body must include returnUrl and a stable idempotencyKey per api-reference.md.");
      }
      if (/await\s+syncSnapshot\s*\(/.test(paywallSource)) {
        ctx.fail("Paywall checkout must not await non-critical answers_snapshot telemetry before embedded-session; queue failures and continue to checkout.");
      }
      if (paywallSource.includes("successUrl") || paywallSource.includes("cancelUrl")) {
        ctx.fail("Stripe embedded checkout request body must not use successUrl/cancelUrl; api-reference.md requires returnUrl for embedded-session.");
      }
      if (
        !paywallSource.includes("resolve/offers") ||
        !paywallSource.includes("placementCode")
      ) {
        ctx.fail("Paywall must load frontend offers with /paywalls/resolve/offers?placementCode={lpid} and use mock plans only as fallback.");
      }
      if (/\/products/.test(paywallSource) || /paywalls\/\$\{[^}]*paywallCode/.test(paywallSource) || /paywallCode/.test(paywallSource)) {
        ctx.fail("Paywall product loading must not call /products or use generated paywallCode; use resolve/offers with placementCode/lpid.");
      }
      if (!paywallSource.includes("useEffect")) {
        ctx.fail("Paywall must hydrate products/offers on mount before checkout selection.");
      }
    }

    if (!app.includes("credentials: 'omit'") && !app.includes('credentials: "omit"')) {
      ctx.fail("Billing API fetch calls must use credentials: 'omit' so frontend auth uses bearer tokens, not cookies.");
    }
    if (!app.includes("ngrok-skip-browser-warning")) {
      ctx.fail("Ngrok-backed development API calls must include ngrok-skip-browser-warning header when using the configured ngrok base URL.");
    }
    if (/\{page\.order\}\s*\/\s*\{pages\.length\}/.test(app) || /page\.order\s*\/\s*pages\.length/.test(app)) {
      ctx.fail("Top OB progress must use page.progress.step/page.progress.total, not page.order/pages.length.");
    }
    if (!app.includes("progress?.showStepCount") || !app.includes("progressStep") || !app.includes("progressTotal")) {
      ctx.fail("Generated React app must render numbered OB progress from page.progress metadata.");
    }
    if (/visitor:\s*\{/.test(app) || /"visitor"\s*:\s*\{/.test(app)) {
      ctx.fail("Stripe embedded checkout body must send visitor as a boolean, not an object.");
    }
    if (/priceId:\s*[^,\n]*providerPriceId/.test(app)) {
      ctx.fail("Stripe embedded checkout must pass Billing price.priceId only; providerPriceId is not a checkout priceId fallback.");
    }
    if (/fallbackPlans\[0\]\?\.id/.test(app)) {
      ctx.fail("Stripe checkout must not use mock fallback plan ids as priceId. Mock plans can render fallback UI only; checkout requires resolve/offers priceId.");
    }

    if (/case 'payment_success_page': return <Result/.test(app)) {
      ctx.fail("payment_success_page must not use the generic Result renderer; it must verify backend payment/subscription/entitlement state before account continuation.");
    }
    if (!app.includes("subscriptions/status") || !app.includes("subscriptions?uid") || !app.includes("entitlements")) {
      ctx.fail("payment_success_page must verify Stripe return through subscription status, subscription list, and entitlement backend endpoints from api-reference.md.");
    }
    if (!app.includes("signInWithCustomToken") || !app.includes("getIdToken")) {
      ctx.fail("Generated React app must exchange backend customToken through Firebase Web SDK signInWithCustomToken and getIdToken.");
    }
    if (/Authorization\s*=\s*`Bearer\s+\$\{identity\.customToken\}/.test(app) || /Authorization:\s*`Bearer\s+\$\{[^`]*customToken/.test(app)) {
      ctx.fail("Generated React app must not use customToken directly as Billing API bearer token.");
    }
    if (!app.includes("isClosedSessionPage")) {
      ctx.fail("Generated React app must distinguish closed-session pages without hard browser history guards.");
    }
    if (/function\s+canAccessPage/.test(app) || /phaseRank\[page\.phase\]\s*>=\s*phaseRank\[committedPhase\(\)\]/.test(app) || app.includes("pushRoute(fallback)") || app.includes("sealHistoryBoundary")) {
      ctx.fail("Generated React app must not use committedPhase as a hard URL redirect guard or browser Back trap.");
    }
    if (app.includes("localStorage.")) {
      ctx.fail("Generated React app must keep funnel identity and runtime state in sessionStorage only; new browser tabs should be new users.");
    }
    if (!app.includes("browserSessionPersistence") || !app.includes("setPersistence(firebaseAuth, browserSessionPersistence)")) {
      ctx.fail("Firebase Auth persistence must be browserSessionPersistence for tab-scoped Web2App identity.");
    }
    if (!app.includes("Start a new plan") || !app.includes("sessionStorage.removeItem(storage.answers)") || !app.includes("sessionStorage.removeItem(storage.identity)")) {
      ctx.fail("Generated React app must offer an explicit Start new plan action that clears the current tab session.");
    }
    if (!app.includes("requireSessionIdentity") || !app.includes("Missing session identity")) {
      ctx.fail("Account/payment-success/subscription pages must have a reusable existing-session identity guard.");
    }
    if (/function\s+Paywall[\s\S]*?await\s+ensureIdentity\s*\(/.test(app)) {
      ctx.fail("Paywall checkout must require the existing first-answer session identity; direct paywall access must not silently create anonymous identity.");
    }
    if (!app.includes("ensureIdentity()") || !app.includes("idToken")) {
      ctx.fail("Generated React app must ensure uid/idToken before protected account or subscription calls.");
    }
    if (!app.includes('firebase/firestore') || !app.includes("getFirestore") || !app.includes("setDoc")) {
      ctx.fail("Generated React app must persist OB answers to Cloud Firestore with Firebase Web SDK.");
    }
    if (!app.includes("VITE_FIRESTORE_FUNNEL_COLLECTION") || !app.includes('|| "test"') || !app.includes("doc(firestoreDb, firestoreCollection, identity.uid)")) {
      ctx.fail("Firestore answer persistence must use collection VITE_FIRESTORE_FUNNEL_COLLECTION || test and document id uid.");
    }
    const firestorePersistMatch = app.match(/async function persistAnswersToFirestore[\s\S]*?\n}/);
    if (!firestorePersistMatch || !/setDoc\(\s*doc\(firestoreDb,\s*firestoreCollection,\s*identity\.uid\),\s*answers,\s*\{\s*merge:\s*true\s*\}\s*\)/.test(firestorePersistMatch[0])) {
      ctx.fail("Firestore answer document must write the flat answers object directly with setDoc(..., answers, { merge: true }).");
    }
    if (firestorePersistMatch && /\b(project|uid|data|updatedAt|appCode|placementCode|eventType|dataKey|value|sessionStorageKey)\s*:/.test(firestorePersistMatch[0])) {
      ctx.fail("Firestore answer document must contain only flattened user answer fields; wrapper/metadata fields are forbidden.");
    }
    const appFunctionMatch = app.match(/function\s+App\(\)[\s\S]*?(?:export function TopProgress|export function Icon|export function Spinner)/);
    if (appFunctionMatch && /useEffect\s*\([\s\S]*?(ensureIdentity|createAnonymousUser)\s*\(/.test(appFunctionMatch[0])) {
      ctx.fail("Generated React app must not create anonymous identity on app boot; create it after the first real OB answer/input.");
    }
    if (!app.includes("createSaveAnswer") || !app.includes("syncAnswer(answers, options)") || !app.includes("ensureIdentityForFirstAnswer")) {
      ctx.fail("Generated React app must trigger anonymous identity creation through answer persistence after the first OB answer.");
    }
    if (!app.includes("options?: { blocking?: boolean }") || !app.includes("{ blocking: !hasSessionIdentity() }")) {
      ctx.fail("First OB answer submission must support blocking identity creation before navigation.");
    }
    if (/saveAnswer\(page\.dataKey,\s*o\.value\);\s*setTimeout\(\(\)\s*=>\s*route/.test(app)) {
      ctx.fail("Single choice auto-advance must not route before first-answer identity creation completes.");
    }
    if (!app.includes("LoadingOverlay") || !app.includes("We couldn't start your session. Please try again.")) {
      ctx.fail("First-answer identity creation must expose a full-screen loading overlay and retryable error state.");
    }
    const measurementMatch = app.match(/function\s+Measurement[\s\S]*?function\s+EmailCapture/);
    if (measurementMatch) {
      const measurementSource = measurementMatch[0];
      if (!measurementSource.includes("normalizeUnit")) {
        ctx.fail("Measurement renderer must normalize unit aliases before deciding the active tab.");
      }
      if (!measurementSource.includes("defaultValue?.cm") || !measurementSource.includes("defaultValue?.kg")) {
        ctx.fail("Measurement renderer must initialize from config defaultValue for height and weight.");
      }
      if (!measurementSource.includes("aria-pressed") || !measurementSource.includes("className={unit === u ? \"active\" : \"\"}")) {
        ctx.fail("Measurement unit tabs must expose and render a visible selected default state.");
      }
      if (!measurementSource.includes("currentValue") || !/saveAnswer\(page\.dataKey,\s*currentValue\)/.test(measurementSource)) {
        ctx.fail("Measurement Continue must save the initialized default value when the user does not edit.");
      }
    }
  }
}
