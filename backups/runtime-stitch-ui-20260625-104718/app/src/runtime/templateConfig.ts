import { normalizeRuntimeConfig } from "./normalizeRuntimeConfig";
import type { AssetsManifest, CopyConfig, FunnelConfig, IconMap, PageVisualMap, Theme } from "./types";

export const templateTheme = {
  "version": "0.5.0",
  "product": "Workout for Women -Lose Weight",
  "rationale": "The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic.",
  "primaryColorDecision": {
    "sourceType": "app_store_visual_evidence",
    "evidence": "The product signal from the App Store name points to home fitness, adult users, and a female audience focus.",
    "audienceFit": "The audience needs clarity, trust, and visible progress. The palette should support the product context without blindly copying reference screenshot colors.",
    "confidence": 0.78,
    "fallbackPolicy": "If brand evidence provides a stronger app color, replace primary/accent tokens only; keep neutral canvas, vertical funnel layout, and runtime component hierarchy."
  },
  "colorTokens": {
    "background": "#f8f9fa",
    "surface": "#ffffff",
    "surfaceSoft": "#f2f4f5",
    "surfaceAlt": "#f2f4f5",
    "text": "#191c1d",
    "mutedText": "#5a4042",
    "muted": "#5a4042",
    "primary": "#ff4d6d",
    "primaryDark": "#b60e3d",
    "primarySoft": "#DDE9DF",
    "accent": "#191c1d",
    "success": "#2D7D61",
    "warning": "#F0A43A",
    "danger": "#D9515C",
    "border": "#e2bec0",
    "disabled": "#B5BEC8",
    "info": "#DCEAF9"
  },
  "colorSystem": {
    "background": "#f8f9fa"
  },
  "typography": {
    "fontFamily": "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    "headingWeight": 760,
    "bodyWeight": 500,
    "letterSpacing": "0"
  },
  "shape": {
    "controlRadius": 8,
    "cardRadius": 16,
    "buttonRadius": 12
  },
  "layout": {
    "mobileFirst": true,
    "desktop": "Centered vertical web funnel column on a full web canvas. Do not use a phone mockup or left-right split layout.",
    "radius": 16
  },
  "designProvider": {
    "source": "stitch",
    "status": "designed_in_stitch",
    "projectId": "5160287003229724876",
    "handoffFile": "outputs/design/stitch-handoff.json",
    "mode": "style_and_layout_direction"
  }
} as Theme;

export const funnelConfig = {
  "version": "0.5.0",
  "product": {
    "appName": "Workout for Women -Lose Weight",
    "appStoreUrl": "https://apps.apple.com/us/app/workout-for-women-lose-weight/id839285684?l=zh-Hans-CN",
    "appStoreId": "839285684",
    "appCode": "oog126_dev",
    "placementCode": "O2MGB",
    "category": "home fitness, web2app onboarding, personalized subscription plan",
    "audience": "women who want an approachable plan for fitness, body confidence, and consistency.",
    "positioningPromise": "Create a personalized home fitness plan around goal, body baseline, and schedule.",
    "profile": {
      "genderFocus": "female",
      "lifeStage": "adult",
      "modality": "fitness",
      "modalityLabel": "home fitness",
      "targetAgeRange": "18-55",
      "ageRangeSource": "product_analysis",
      "ageRangeEvidence": "Product name signals women-focused weight loss, toning, or body-confidence onboarding.",
      "ageGroups": [
        {
          "value": "18_25",
          "label": "Age: 18-25",
          "minAge": 18,
          "maxAge": 25,
          "imageSubject": "Asian adult woman, age 18-25",
          "differentiationRequirement": "youngest bracket; visibly early adult energy without looking underage for 18-25."
        },
        {
          "value": "26_35",
          "label": "Age: 26-35",
          "minAge": 26,
          "maxAge": 35,
          "imageSubject": "Black adult woman, age 26-35",
          "differentiationRequirement": "second bracket; adult styling distinct from the youngest group for 26-35."
        },
        {
          "value": "36_45",
          "label": "Age: 36-45",
          "minAge": 36,
          "maxAge": 45,
          "imageSubject": "White adult woman, age 36-45",
          "differentiationRequirement": "third bracket; mature adult styling with visible age difference for 36-45."
        },
        {
          "value": "46_plus",
          "label": "Age: 46+",
          "minAge": 46,
          "maxAge": null,
          "imageSubject": "Latino or mixed-race adult woman, age 46+",
          "differentiationRequirement": "oldest bracket; clearly older appearance while still capable and confident for 46+."
        }
      ],
      "category": "home fitness, web2app onboarding, personalized subscription plan",
      "audience": "women who want an approachable plan for fitness, body confidence, and consistency.",
      "promise": "Create a personalized home fitness plan around goal, body baseline, and schedule."
    }
  },
  "theme": {
    "version": "0.5.0",
    "product": "Workout for Women -Lose Weight",
    "rationale": "The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic.",
    "primaryColorDecision": {
      "sourceType": "app_store_visual_evidence",
      "evidence": "The product signal from the App Store name points to home fitness, adult users, and a female audience focus.",
      "audienceFit": "The audience needs clarity, trust, and visible progress. The palette should support the product context without blindly copying reference screenshot colors.",
      "confidence": 0.78,
      "fallbackPolicy": "If brand evidence provides a stronger app color, replace primary/accent tokens only; keep neutral canvas, vertical funnel layout, and runtime component hierarchy."
    },
    "colorTokens": {
      "background": "#F5F4EF",
      "surface": "#FFFFFF",
      "surfaceSoft": "#ECEFE8",
      "surfaceAlt": "#ECEFE8",
      "text": "#25282D",
      "mutedText": "#70747C",
      "muted": "#70747C",
      "primary": "#315F4A",
      "primaryDark": "#234637",
      "primarySoft": "#DDE9DF",
      "accent": "#7A624B",
      "success": "#2D7D61",
      "warning": "#F0A43A",
      "danger": "#D9515C",
      "border": "#E0DED6",
      "disabled": "#B5BEC8",
      "info": "#DCEAF9"
    },
    "colorSystem": {
      "background": "#F5F4EF"
    },
    "typography": {
      "fontFamily": "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "headingWeight": 760,
      "bodyWeight": 500,
      "letterSpacing": "0"
    },
    "shape": {
      "controlRadius": 14,
      "cardRadius": 16,
      "buttonRadius": 10
    },
    "layout": {
      "mobileFirst": true,
      "desktop": "Centered vertical web funnel column on a full web canvas. Do not use a phone mockup or left-right split layout.",
      "radius": 16
    }
  },
  "lifecycle": {
    "storage": "sessionStorage",
    "startBehavior": "get_started_clears_current_session_and_creates_new_visitor",
    "navigationPolicy": "do_not_stage_lock_urls; reset_to_entry_when_root_url_has_no_page_param"
  },
  "backendIntegration": {
    "apiBaseUrlEnv": "VITE_BILLING_API_BASE_URL",
    "appCodeEnv": "VITE_BILLING_APP_CODE",
    "appCodeDefault": "oog126_dev",
    "placementCodeEnv": "VITE_BILLING_PLACEMENT_CODE",
    "placementCodeDefault": "O2MGB",
    "identityMode": "backend_custom_token_firebase_web_sdk",
    "storageScope": "sessionStorage",
    "firebaseAuthPersistence": "browserSessionPersistence",
    "anonymousIdentityTrigger": "first_real_ob_answer_input",
    "accountLoginMode": "backend_email_password_login",
    "subscriptionManagementMode": "backend_subscription_management",
    "firestore": {
      "enabled": true,
      "answerCollectionDefault": "test",
      "answerDocumentId": "uid",
      "answerDocumentShape": "flat_user_answers_only"
    },
    "endpoints": {
      "anonymous": "POST /billing/{appCode}/v1/users/anonymous",
      "currentUser": "POST /billing/{appCode}/v1/users/current",
      "login": "POST /billing/{appCode}/v1/users/login",
      "registerFromAnonymous": "POST /billing/{appCode}/v1/users/register-from-anonymous",
      "resolveOffers": "GET /billing/{appCode}/v1/paywalls/resolve/offers?placementCode={placementCode}&discountType={discountType}",
      "stripeEmbeddedCheckout": "POST /billing/{appCode}/v1/checkout/stripe/embedded-session",
      "subscriptions": "GET /billing/{appCode}/v1/subscriptions?uid={uid}",
      "cancelSubscription": "POST /billing/{appCode}/v1/subscriptions/cancel"
    }
  },
  "pages": [
    {
      "phase": "entry",
      "conversionPurpose": "Open with the product promise and route new or returning users correctly.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "entry",
      "pageType": "entry_page",
      "role": "portal",
      "appName": "Workout for Women -Lose Weight",
      "productName": "Workout for Women -Lose Weight",
      "title": "Create a plan that fits your starting point",
      "subtitle": "Answer a few simple questions so your plan can match your goal, routine, and body profile.",
      "ctaLabel": "Get started",
      "secondaryCtaLabel": "Log in",
      "assetRequirement": {
        "required": true,
        "assetType": "entry_hero"
      },
      "progress": {
        "visible": false
      },
      "designSource": "stitch",
      "stitchVariant": "hero-image-overlay",
      "stitchNotes": "Large photographic hero with clear start CTA and login action.",
      "stitchScreenId": "f81748dff7844d13ad26b792d2fb3c0f",
      "stitchScreenResource": "projects/5160287003229724876/screens/f81748dff7844d13ad26b792d2fb3c0f"
    },
    {
      "phase": "onboarding",
      "sectionId": "my_profile",
      "sectionLabel": "Profile",
      "sectionOrder": 1,
      "conversionPurpose": "Create anonymous identity after the first real answer and make the start visual and low friction.",
      "personalizationUse": "Uses the product-specific target age strategy (18-55) to tune pacing, recovery, copy tone, imagery, and plan assumptions.",
      "id": "age_group",
      "pageType": "single_choice_page",
      "role": "question",
      "dataKey": "ageGroup",
      "title": "Select your age to start",
      "subtitle": "This helps tune recovery, difficulty, and weekly pacing.",
      "variant": "image_grid",
      "selectionBehavior": "instant_next_after_identity_ready",
      "options": [
        {
          "value": "18_25",
          "label": "Age: 18-25",
          "icon": "ArrowRightCircle",
          "assetRequirement": {
            "required": true,
            "assetType": "age_group_option"
          }
        },
        {
          "value": "26_35",
          "label": "Age: 26-35",
          "icon": "ArrowRightCircle",
          "assetRequirement": {
            "required": true,
            "assetType": "age_group_option"
          }
        },
        {
          "value": "36_45",
          "label": "Age: 36-45",
          "icon": "ArrowRightCircle",
          "assetRequirement": {
            "required": true,
            "assetType": "age_group_option"
          }
        },
        {
          "value": "46_plus",
          "label": "Age: 46+",
          "icon": "ArrowRightCircle",
          "assetRequirement": {
            "required": true,
            "assetType": "age_group_option"
          }
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 1,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-choice-list-or-image-grid",
      "stitchNotes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons.",
      "stitchScreenId": "a2ca25ff2e5143149766ebc30904925e",
      "stitchScreenResource": "projects/5160287003229724876/screens/a2ca25ff2e5143149766ebc30904925e"
    },
    {
      "phase": "onboarding",
      "sectionId": "my_profile",
      "sectionLabel": "Profile",
      "sectionOrder": 1,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "exact_age",
      "pageType": "age_input_page",
      "role": "question",
      "dataKey": "ageNum",
      "title": "What is your age?",
      "subtitle": "A precise age helps us personalize intensity and recovery.",
      "defaultValue": 42,
      "min": 13,
      "max": 71,
      "ctaLabel": "Continue",
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 2,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "large-centered-number-input",
      "stitchNotes": "Large age input with explanatory support card.",
      "stitchScreenId": "b30983ec7a7147c8a7c9eee88c981390",
      "stitchScreenResource": "projects/5160287003229724876/screens/b30983ec7a7147c8a7c9eee88c981390"
    },
    {
      "phase": "onboarding",
      "sectionId": "goals",
      "sectionLabel": "Goals",
      "sectionOrder": 2,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "question",
      "id": "fitness_goal_discovery",
      "capability": "goal_discovery",
      "capabilityStage": "goals",
      "capabilityReason": "Anchor the user's desired transformation so the generated plan and paywall promise feel personal.",
      "requiredFor": [
        "summary",
        "plan_personalization",
        "paywall_bridge"
      ],
      "contractUse": {
        "summary": true,
        "planGeneration": true,
        "paywall": true,
        "firestore": true,
        "analytics": true
      },
      "source": "capability_planner",
      "required": true,
      "stage": "goals",
      "pageType": "single_choice_page",
      "dataKey": "mainGoal",
      "title": "What is your main goal?",
      "variant": "icon_list",
      "reason": "Anchor the user's desired transformation so the generated plan and paywall promise feel personal.",
      "options": [
        {
          "value": "build_strength",
          "label": "Build strength",
          "icon": "Dumbbell"
        },
        {
          "value": "lose_fat",
          "label": "Lose fat",
          "icon": "Flame"
        },
        {
          "value": "look_more_defined",
          "label": "Look more defined",
          "icon": "Activity"
        },
        {
          "value": "build_discipline",
          "label": "Build discipline",
          "icon": "Target"
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 3,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-choice-list-or-image-grid",
      "stitchNotes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons.",
      "stitchScreenId": "37b7cbae31aa46b78b5092b0922d5e43",
      "stitchScreenResource": "projects/5160287003229724876/screens/37b7cbae31aa46b78b5092b0922d5e43"
    },
    {
      "phase": "onboarding",
      "sectionId": "goals",
      "sectionLabel": "Goals",
      "sectionOrder": 2,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "question",
      "id": "fitness_body_focus",
      "capability": "body_focus",
      "capabilityStage": "goals",
      "capabilityReason": "Identify visible or felt problem areas so the plan can claim relevance before the paywall.",
      "requiredFor": [
        "plan_personalization",
        "summary",
        "paywall_bridge"
      ],
      "contractUse": {
        "summary": true,
        "planGeneration": true,
        "paywall": true,
        "firestore": true,
        "analytics": true
      },
      "source": "capability_planner",
      "required": true,
      "stage": "goals",
      "pageType": "multi_choice_page",
      "dataKey": "focusAreas",
      "title": "Which areas should we focus on?",
      "subtitle": "Choose all that apply",
      "variant": "icon_list",
      "minSelections": 1,
      "reason": "Identify visible or felt problem areas so the plan can claim relevance before the paywall.",
      "visualDecision": {
        "required": false,
        "visualType": "agent_optional_question_image",
        "reason": "Use a question-level image only when the generated question benefits from body-area or movement context."
      },
      "options": [
        {
          "value": "chest",
          "label": "Chest",
          "icon": "Badge"
        },
        {
          "value": "arms",
          "label": "Arms",
          "icon": "Dumbbell"
        },
        {
          "value": "core",
          "label": "Core",
          "icon": "CircleDot"
        },
        {
          "value": "legs",
          "label": "Legs",
          "icon": "Footprints"
        },
        {
          "value": "full_body",
          "label": "Full body",
          "icon": "Activity"
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 4,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-check-list",
      "stitchNotes": "Clear selected state with border/tint/check treatment, no tiny right-side circles.",
      "stitchScreenId": "17692c34393a4a0c969735af16fedccf",
      "stitchScreenResource": "projects/5160287003229724876/screens/17692c34393a4a0c969735af16fedccf"
    },
    {
      "phase": "onboarding",
      "sectionId": "goals",
      "sectionLabel": "Goals",
      "sectionOrder": 2,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "trust_bridge",
      "id": "fitness_goal_trust_bridge",
      "capability": "goal_trust_bridge",
      "capabilityStage": "goals",
      "capabilityReason": "Pause after early goal answers to convert raw answers into belief that a personalized plan is being built.",
      "requiredFor": [
        "trust_building",
        "section_transition"
      ],
      "contractUse": {
        "summary": false,
        "planGeneration": false,
        "paywall": false,
        "firestore": false,
        "analytics": false
      },
      "source": "capability_planner",
      "required": true,
      "stage": "goals",
      "pageType": "intro_page",
      "title": "Your goal gives the plan direction",
      "subtitle": "The next answers help us make it realistic.",
      "body": "A strong plan is not just harder exercises. It needs the right starting point, the right schedule, and a progression you can keep repeating.",
      "ctaLabel": "Continue",
      "assetRequirement": {
        "required": true,
        "assetType": "intro_hero"
      },
      "trustPurpose": "Turn the user's goal into confidence that the generated plan will be specific and realistic.",
      "reason": "Pause after early goal answers to convert raw answers into belief that a personalized plan is being built.",
      "progress": {
        "visible": true,
        "countsTowardTotal": false,
        "showStepCount": false
      },
      "designSource": "stitch",
      "stitchVariant": "image-top-copy-bottom-cta",
      "stitchNotes": "4:3 image area, trust copy, bottom CTA.",
      "stitchScreenId": "2ca066d0b68e4168a99f5cbd7a15f5bb",
      "stitchScreenResource": "projects/5160287003229724876/screens/2ca066d0b68e4168a99f5cbd7a15f5bb"
    },
    {
      "phase": "onboarding",
      "sectionId": "training",
      "sectionLabel": "Training",
      "sectionOrder": 3,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "question",
      "id": "fitness_experience_level",
      "capability": "experience_level",
      "capabilityStage": "training",
      "capabilityReason": "Set starting difficulty and reduce the risk that the generated plan feels too easy or too hard.",
      "requiredFor": [
        "plan_difficulty",
        "summary",
        "paywall_bridge"
      ],
      "contractUse": {
        "summary": true,
        "planGeneration": true,
        "paywall": true,
        "firestore": true,
        "analytics": true
      },
      "source": "capability_planner",
      "required": true,
      "stage": "training",
      "pageType": "single_choice_page",
      "dataKey": "fitnessLevel",
      "title": "How familiar are you with home fitness?",
      "variant": "plain_list",
      "reason": "Set starting difficulty and reduce the risk that the generated plan feels too easy or too hard.",
      "options": [
        {
          "value": "beginner",
          "label": "Beginner",
          "icon": "Circle"
        },
        {
          "value": "returning",
          "label": "Returning after a break",
          "icon": "Circle"
        },
        {
          "value": "intermediate",
          "label": "Intermediate",
          "icon": "Circle"
        },
        {
          "value": "advanced",
          "label": "Advanced",
          "icon": "Circle"
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 5,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-choice-list-or-image-grid",
      "stitchNotes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons."
    },
    {
      "phase": "onboarding",
      "sectionId": "training",
      "sectionLabel": "Training",
      "sectionOrder": 3,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "question",
      "id": "fitness_training_readiness",
      "capability": "training_readiness",
      "capabilityStage": "training",
      "capabilityReason": "Capture readiness so the plan can start credibly and avoid overpromising intensity.",
      "requiredFor": [
        "plan_difficulty",
        "plan_generation",
        "risk_reduction"
      ],
      "contractUse": {
        "summary": false,
        "planGeneration": true,
        "paywall": false,
        "firestore": true,
        "analytics": true
      },
      "source": "capability_planner",
      "required": true,
      "stage": "training",
      "pageType": "single_choice_page",
      "dataKey": "capabilityLevel",
      "title": "What is your current starting level?",
      "variant": "plain_list",
      "reason": "Capture readiness so the plan can start credibly and avoid overpromising intensity.",
      "options": [
        {
          "value": "low",
          "label": "I need a simple start",
          "icon": "Circle"
        },
        {
          "value": "medium",
          "label": "I can handle a challenge",
          "icon": "Circle"
        },
        {
          "value": "high",
          "label": "Push me harder",
          "icon": "Circle"
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 6,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-choice-list-or-image-grid",
      "stitchNotes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons."
    },
    {
      "phase": "onboarding",
      "sectionId": "training",
      "sectionLabel": "Training",
      "sectionOrder": 3,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "question",
      "id": "fitness_current_activity",
      "capability": "current_activity",
      "capabilityStage": "training",
      "capabilityReason": "Estimate current activity baseline to shape pacing and make the result page feel earned.",
      "requiredFor": [
        "plan_pacing",
        "summary",
        "paywall_bridge"
      ],
      "contractUse": {
        "summary": true,
        "planGeneration": true,
        "paywall": true,
        "firestore": true,
        "analytics": true
      },
      "source": "capability_planner",
      "required": true,
      "stage": "training",
      "pageType": "single_choice_page",
      "dataKey": "activeLevel",
      "title": "How active are you now?",
      "variant": "plain_list",
      "reason": "Estimate current activity baseline to shape pacing and make the result page feel earned.",
      "options": [
        {
          "value": "not_active",
          "label": "Not active",
          "icon": "Circle"
        },
        {
          "value": "light",
          "label": "Light movement sometimes",
          "icon": "Circle"
        },
        {
          "value": "moderate",
          "label": "I move a few days a week",
          "icon": "Circle"
        },
        {
          "value": "high",
          "label": "I already stay active",
          "icon": "Circle"
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 7,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-choice-list-or-image-grid",
      "stitchNotes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons."
    },
    {
      "phase": "onboarding",
      "sectionId": "training",
      "sectionLabel": "Training",
      "sectionOrder": 3,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "question",
      "id": "fitness_blockers",
      "capability": "blockers",
      "capabilityStage": "training",
      "capabilityReason": "Collect the objections the paywall and plan-ready pages need to answer before asking for payment.",
      "requiredFor": [
        "objection_handling",
        "paywall_bridge",
        "plan_adherence"
      ],
      "contractUse": {
        "summary": false,
        "planGeneration": true,
        "paywall": true,
        "firestore": true,
        "analytics": true
      },
      "source": "capability_planner",
      "required": true,
      "stage": "training",
      "pageType": "multi_choice_page",
      "dataKey": "barriers",
      "title": "What usually gets in your way?",
      "subtitle": "Choose all that apply",
      "variant": "plain_list",
      "minSelections": 1,
      "reason": "Collect the objections the paywall and plan-ready pages need to answer before asking for payment.",
      "options": [
        {
          "value": "no_time",
          "label": "No time",
          "icon": "Circle"
        },
        {
          "value": "low_motivation",
          "label": "Low motivation",
          "icon": "Circle"
        },
        {
          "value": "too_hard",
          "label": "Plans feel too hard",
          "icon": "Circle"
        },
        {
          "value": "no_plan",
          "label": "I do not know what to do",
          "icon": "Circle"
        },
        {
          "value": "slow_results",
          "label": "Results feel too slow",
          "icon": "Circle"
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 8,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-check-list",
      "stitchNotes": "Clear selected state with border/tint/check treatment, no tiny right-side circles."
    },
    {
      "phase": "onboarding",
      "sectionId": "body",
      "sectionLabel": "Body",
      "sectionOrder": 4,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "question",
      "id": "fitness_limitations",
      "capability": "limitations",
      "capabilityStage": "body",
      "capabilityReason": "Ask for constraints before body metrics so the product feels careful, not generic.",
      "requiredFor": [
        "plan_safety",
        "plan_personalization",
        "trust_building"
      ],
      "contractUse": {
        "summary": false,
        "planGeneration": true,
        "paywall": false,
        "firestore": true,
        "analytics": true
      },
      "source": "capability_planner",
      "required": true,
      "stage": "body",
      "pageType": "multi_choice_page",
      "dataKey": "limitations",
      "title": "Any areas that need extra care?",
      "subtitle": "Choose all that apply",
      "variant": "plain_list",
      "minSelections": 1,
      "reason": "Ask for constraints before body metrics so the product feels careful, not generic.",
      "options": [
        {
          "value": "wrists",
          "label": "Wrists",
          "icon": "Circle"
        },
        {
          "value": "shoulders",
          "label": "Shoulders",
          "icon": "Circle"
        },
        {
          "value": "back",
          "label": "Back",
          "icon": "Circle"
        },
        {
          "value": "knees",
          "label": "Knees",
          "icon": "Circle"
        },
        {
          "value": "none",
          "label": "No special limitations",
          "icon": "Circle"
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 9,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-check-list",
      "stitchNotes": "Clear selected state with border/tint/check treatment, no tiny right-side circles."
    },
    {
      "phase": "onboarding",
      "sectionId": "routine",
      "sectionLabel": "Routine",
      "sectionOrder": 5,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "trust_bridge",
      "id": "fitness_routine_trust_bridge",
      "capability": "routine_trust_bridge",
      "capabilityStage": "routine",
      "capabilityReason": "Transition from body/training answers into schedule questions without making the flow feel like a survey.",
      "requiredFor": [
        "trust_building",
        "section_transition"
      ],
      "contractUse": {
        "summary": false,
        "planGeneration": false,
        "paywall": false,
        "firestore": false,
        "analytics": false
      },
      "source": "capability_planner",
      "required": true,
      "stage": "routine",
      "pageType": "intro_page",
      "title": "Your routine should fit your real week",
      "subtitle": "Consistency matters more than a perfect schedule.",
      "body": "Most people stop because the training plan asks for a version of their week that does not exist. We will use your schedule to shape a home fitness plan that feels easier to repeat.",
      "ctaLabel": "Continue",
      "assetRequirement": {
        "required": true,
        "assetType": "intro_hero"
      },
      "trustPurpose": "Reframe routine constraints as inputs that make the generated plan easier to follow.",
      "reason": "Transition from body/training answers into schedule questions without making the flow feel like a survey.",
      "progress": {
        "visible": true,
        "countsTowardTotal": false,
        "showStepCount": false
      },
      "designSource": "stitch",
      "stitchVariant": "image-top-copy-bottom-cta",
      "stitchNotes": "4:3 image area, trust copy, bottom CTA."
    },
    {
      "phase": "onboarding",
      "sectionId": "routine",
      "sectionLabel": "Routine",
      "sectionOrder": 5,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "question",
      "id": "fitness_time_budget",
      "capability": "time_budget",
      "capabilityStage": "routine",
      "capabilityReason": "Make the plan feel immediately usable by matching session length to the user's real day.",
      "requiredFor": [
        "plan_schedule",
        "paywall_bridge"
      ],
      "contractUse": {
        "summary": false,
        "planGeneration": true,
        "paywall": true,
        "firestore": true,
        "analytics": true
      },
      "source": "capability_planner",
      "required": true,
      "stage": "routine",
      "pageType": "single_choice_page",
      "dataKey": "dailyTime",
      "title": "How much time feels realistic?",
      "variant": "plain_list",
      "reason": "Make the plan feel immediately usable by matching session length to the user's real day.",
      "options": [
        {
          "value": "10",
          "label": "10 minutes",
          "icon": "Circle"
        },
        {
          "value": "15",
          "label": "15 minutes",
          "icon": "Circle"
        },
        {
          "value": "20",
          "label": "20 minutes",
          "icon": "Circle"
        },
        {
          "value": "25",
          "label": "25 minutes",
          "icon": "Circle"
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 10,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-choice-list-or-image-grid",
      "stitchNotes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons."
    },
    {
      "phase": "onboarding",
      "sectionId": "routine",
      "sectionLabel": "Routine",
      "sectionOrder": 5,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "question",
      "id": "fitness_weekly_frequency",
      "capability": "weekly_frequency",
      "capabilityStage": "routine",
      "capabilityReason": "Turn motivation into a concrete schedule variable that can be shown back in plan-ready copy.",
      "requiredFor": [
        "plan_schedule",
        "plan_generation"
      ],
      "contractUse": {
        "summary": false,
        "planGeneration": true,
        "paywall": false,
        "firestore": true,
        "analytics": true
      },
      "source": "capability_planner",
      "required": true,
      "stage": "routine",
      "pageType": "single_choice_page",
      "dataKey": "weeklyFrequency",
      "title": "How many days per week can you commit?",
      "variant": "plain_list",
      "reason": "Turn motivation into a concrete schedule variable that can be shown back in plan-ready copy.",
      "options": [
        {
          "value": "2_3",
          "label": "2-3 days",
          "icon": "Circle"
        },
        {
          "value": "4_5",
          "label": "4-5 days",
          "icon": "Circle"
        },
        {
          "value": "6_7",
          "label": "6-7 days",
          "icon": "Circle"
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 11,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-choice-list-or-image-grid",
      "stitchNotes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons."
    },
    {
      "phase": "onboarding",
      "sectionId": "routine",
      "sectionLabel": "Routine",
      "sectionOrder": 5,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "question",
      "id": "fitness_preferred_time",
      "capability": "preferred_time",
      "capabilityStage": "routine",
      "capabilityReason": "Collect a lightweight adherence signal so plan copy can feel more concrete.",
      "requiredFor": [
        "plan_schedule",
        "adherence_copy"
      ],
      "contractUse": {
        "summary": false,
        "planGeneration": true,
        "paywall": false,
        "firestore": true,
        "analytics": true
      },
      "source": "capability_planner",
      "required": true,
      "stage": "routine",
      "pageType": "single_choice_page",
      "dataKey": "preferredTime",
      "title": "When would you prefer to practice?",
      "variant": "plain_list",
      "reason": "Collect a lightweight adherence signal so plan copy can feel more concrete.",
      "options": [
        {
          "value": "morning",
          "label": "Morning",
          "icon": "Circle"
        },
        {
          "value": "afternoon",
          "label": "Afternoon",
          "icon": "Circle"
        },
        {
          "value": "evening",
          "label": "Evening",
          "icon": "Circle"
        },
        {
          "value": "varies",
          "label": "It changes",
          "icon": "Circle"
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 12,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-choice-list-or-image-grid",
      "stitchNotes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons."
    },
    {
      "phase": "onboarding",
      "sectionId": "routine",
      "sectionLabel": "Routine",
      "sectionOrder": 5,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "question",
      "id": "fitness_energy_level",
      "capability": "energy_level",
      "capabilityStage": "routine",
      "capabilityReason": "Use energy level to tune intensity and make the plan feel sensitive to real-life readiness.",
      "requiredFor": [
        "plan_pacing",
        "difficulty_adjustment"
      ],
      "contractUse": {
        "summary": false,
        "planGeneration": true,
        "paywall": false,
        "firestore": true,
        "analytics": true
      },
      "source": "capability_planner",
      "required": true,
      "stage": "routine",
      "pageType": "single_choice_page",
      "dataKey": "energyLevel",
      "title": "How is your energy on most days?",
      "variant": "plain_list",
      "reason": "Use energy level to tune intensity and make the plan feel sensitive to real-life readiness.",
      "options": [
        {
          "value": "low",
          "label": "Low",
          "icon": "Circle"
        },
        {
          "value": "mixed",
          "label": "It changes",
          "icon": "Circle"
        },
        {
          "value": "steady",
          "label": "Steady",
          "icon": "Circle"
        },
        {
          "value": "high",
          "label": "High",
          "icon": "Circle"
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 13,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-choice-list-or-image-grid",
      "stitchNotes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons."
    },
    {
      "phase": "onboarding",
      "sectionId": "motivation",
      "sectionLabel": "Motivation",
      "sectionOrder": 6,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "question",
      "id": "fitness_motivation_reason",
      "capability": "motivation_reason",
      "capabilityStage": "motivation",
      "capabilityReason": "Capture the emotional payoff that can be echoed before checkout.",
      "requiredFor": [
        "paywall_bridge",
        "plan_ready_copy"
      ],
      "contractUse": {
        "summary": false,
        "planGeneration": true,
        "paywall": true,
        "firestore": true,
        "analytics": true
      },
      "source": "capability_planner",
      "required": true,
      "stage": "motivation",
      "pageType": "single_choice_page",
      "dataKey": "motivationReason",
      "title": "What would make this plan worth it?",
      "variant": "plain_list",
      "reason": "Capture the emotional payoff that can be echoed before checkout.",
      "options": [
        {
          "value": "confidence",
          "label": "Feel more confident",
          "icon": "Circle"
        },
        {
          "value": "discipline",
          "label": "Build discipline",
          "icon": "Circle"
        },
        {
          "value": "appearance",
          "label": "See visible change",
          "icon": "Circle"
        },
        {
          "value": "health",
          "label": "Feel healthier",
          "icon": "Circle"
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 14,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-choice-list-or-image-grid",
      "stitchNotes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons."
    },
    {
      "phase": "onboarding",
      "sectionId": "motivation",
      "sectionLabel": "Motivation",
      "sectionOrder": 6,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "role": "question",
      "id": "fitness_support_style",
      "capability": "support_style",
      "capabilityStage": "motivation",
      "capabilityReason": "Let the plan promise match the user's preferred coaching style.",
      "requiredFor": [
        "plan_tone",
        "retention_copy"
      ],
      "contractUse": {
        "summary": false,
        "planGeneration": true,
        "paywall": false,
        "firestore": true,
        "analytics": true
      },
      "source": "capability_planner",
      "required": true,
      "stage": "motivation",
      "pageType": "single_choice_page",
      "dataKey": "accountabilityStyle",
      "title": "What kind of guidance helps you most?",
      "variant": "plain_list",
      "reason": "Let the plan promise match the user's preferred coaching style.",
      "options": [
        {
          "value": "simple",
          "label": "Simple instructions",
          "icon": "Circle"
        },
        {
          "value": "encouraging",
          "label": "Encourage me",
          "icon": "Circle"
        },
        {
          "value": "progress",
          "label": "Show progress",
          "icon": "Circle"
        },
        {
          "value": "challenge",
          "label": "Challenge me gradually",
          "icon": "Circle"
        }
      ],
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 15,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "flat-choice-list-or-image-grid",
      "stitchNotes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons."
    },
    {
      "phase": "onboarding",
      "sectionId": "body",
      "sectionLabel": "Body",
      "sectionOrder": 4,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "height",
      "pageType": "height_input_page",
      "role": "question",
      "dataKey": "height",
      "title": "How tall are you?",
      "measurementType": "height",
      "units": [
        "ft",
        "cm"
      ],
      "defaultUnit": "cm",
      "defaultValue": {
        "cm": 175,
        "ft": 5,
        "in": 9
      },
      "min": {
        "cm": 120,
        "ftTotalInches": 48
      },
      "max": {
        "cm": 230,
        "ftTotalInches": 91
      },
      "designOverride": {
        "unitInteraction": "real_time_unit_conversion"
      },
      "ctaLabel": "Continue",
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 16,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "large-centered-measurement-input",
      "stitchNotes": "Segmented unit switch, large value input, bottom CTA.",
      "stitchScreenId": "470bdef605104e4985fc7234953d842a",
      "stitchScreenResource": "projects/5160287003229724876/screens/470bdef605104e4985fc7234953d842a"
    },
    {
      "phase": "onboarding",
      "sectionId": "body",
      "sectionLabel": "Body",
      "sectionOrder": 4,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "current_weight",
      "pageType": "weight_input_page",
      "role": "question",
      "dataKey": "currentWeight",
      "title": "What is your current weight?",
      "measurementType": "current_weight",
      "units": [
        "lbs",
        "kg"
      ],
      "defaultUnit": "kg",
      "defaultValue": {
        "kg": 82,
        "lbs": 181
      },
      "min": {
        "kg": 25,
        "lbs": 55
      },
      "max": {
        "kg": 300,
        "lbs": 661
      },
      "showBmiCard": true,
      "designOverride": {
        "unitInteraction": "real_time_unit_conversion_and_bmi_recalculate"
      },
      "ctaLabel": "Continue",
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 17,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "large-centered-measurement-input-with-feedback",
      "stitchNotes": "Runtime applies current-weight BMI feedback and target-weight delta feedback.",
      "stitchScreenId": "6a2d4ff8158a46418d9e1f9658882465",
      "stitchScreenResource": "projects/5160287003229724876/screens/6a2d4ff8158a46418d9e1f9658882465"
    },
    {
      "phase": "onboarding",
      "sectionId": "body",
      "sectionLabel": "Body",
      "sectionOrder": 4,
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "target_weight",
      "pageType": "weight_input_page",
      "role": "question",
      "dataKey": "targetWeight",
      "title": "What is your target weight?",
      "measurementType": "target_weight",
      "units": [
        "lbs",
        "kg"
      ],
      "defaultUnit": "kg",
      "defaultValue": {
        "kg": 76,
        "lbs": 168
      },
      "min": {
        "kg": 25,
        "lbs": 55
      },
      "max": {
        "kg": 300,
        "lbs": 661
      },
      "showGoalCard": true,
      "designOverride": {
        "unitInteraction": "real_time_unit_conversion_and_goal_change_recalculate"
      },
      "ctaLabel": "Continue",
      "progress": {
        "visible": true,
        "countsTowardTotal": true,
        "scope": "ob_questions",
        "step": 18,
        "total": 18,
        "showStepCount": true
      },
      "designSource": "stitch",
      "stitchVariant": "large-centered-measurement-input-with-feedback",
      "stitchNotes": "Runtime applies current-weight BMI feedback and target-weight delta feedback.",
      "stitchScreenId": "f0f8c37f616a4b8ba6c0f8348035e4b9",
      "stitchScreenResource": "projects/5160287003229724876/screens/f0f8c37f616a4b8ba6c0f8348035e4b9"
    },
    {
      "phase": "onboarding",
      "sectionId": "result",
      "sectionLabel": "Plan",
      "sectionOrder": 7,
      "conversionPurpose": "Capture email before plan reveal and bind the plan to the user identity.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "email",
      "pageType": "email_capture_page",
      "role": "lead_capture",
      "dataKey": "email",
      "title": "Where should we send your plan?",
      "subtitle": "Use an email you can access later.",
      "ctaLabel": "Continue",
      "progress": {
        "visible": true,
        "countsTowardTotal": false,
        "showStepCount": false
      },
      "designSource": "stitch",
      "stitchVariant": "flat-email-capture",
      "stitchNotes": "Title, email input, privacy reassurance.",
      "stitchScreenId": "d857a4158a894491bfe877600a6d0f71",
      "stitchScreenResource": "projects/5160287003229724876/screens/d857a4158a894491bfe877600a6d0f71"
    },
    {
      "phase": "result",
      "sectionId": "result",
      "sectionLabel": "Plan",
      "sectionOrder": 7,
      "conversionPurpose": "Show that the user's answers are being used before monetization.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "summary",
      "pageType": "summary_page",
      "role": "personalized_result",
      "title": "Summary of your fitness level",
      "ctaLabel": "Continue",
      "assetRequirement": {
        "required": true,
        "assetType": "summary_body_set"
      },
      "progress": {
        "visible": false
      },
      "designSource": "stitch",
      "stitchVariant": "bmi-report-with-body-image",
      "stitchNotes": "BMI indicator, personalized summary rows, body visual.",
      "stitchScreenId": "77109ad24158445a94af2058b2f342bb",
      "stitchScreenResource": "projects/5160287003229724876/screens/77109ad24158445a94af2058b2f342bb"
    },
    {
      "phase": "result",
      "sectionId": "result",
      "sectionLabel": "Plan",
      "sectionOrder": 7,
      "conversionPurpose": "Use a smooth loading moment, required follow-up answers, and rotating proof to increase perceived personalization.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "plan_generation",
      "pageType": "plan_generation_page",
      "role": "plan_generation",
      "title": "Creating your home fitness plan",
      "subtitle": "Matching your baseline, goal, and weekly schedule.",
      "progressSteps": [
        "Analyzing",
        "Personalizing",
        "Finalizing"
      ],
      "generationPrompts": [
        {
          "id": "baseline_confirmation",
          "question": "Should we start from your current level?",
          "yesLabel": "Yes",
          "noLabel": "No",
          "askAtProgress": 28
        },
        {
          "id": "focus_confirmation",
          "question": "Should we prioritize the areas you selected?",
          "yesLabel": "Yes",
          "noLabel": "No",
          "askAtProgress": 56
        },
        {
          "id": "routine_confirmation",
          "question": "Should the plan fit your weekly schedule?",
          "yesLabel": "Yes",
          "noLabel": "No",
          "askAtProgress": 82
        }
      ],
      "generationTestimonials": [
        {
          "name": "Bella",
          "title": "It finally felt personal",
          "body": "The plan matched my schedule and made the first week feel achievable instead of intimidating."
        },
        {
          "name": "Rory",
          "title": "Easy to stay consistent",
          "body": "I liked that the sessions had structure and did not feel like random workouts."
        },
        {
          "name": "Janet",
          "title": "Clear next steps",
          "body": "Seeing a path based on my answers made it easier to commit to the plan."
        }
      ],
      "progress": {
        "visible": false
      },
      "designSource": "stitch",
      "stitchVariant": "progress-ring-with-overlay-questions",
      "stitchNotes": "Progress animation plus required yes/no overlay questions.",
      "stitchScreenId": "feab4b24b62b4a8b8a67d815c82f7b29",
      "stitchScreenResource": "projects/5160287003229724876/screens/feab4b24b62b4a8b8a67d815c82f7b29"
    },
    {
      "phase": "result",
      "sectionId": "result",
      "sectionLabel": "Plan",
      "sectionOrder": 7,
      "conversionPurpose": "Reveal the expected path and move into monetization with confidence.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "plan_ready",
      "pageType": "plan_ready_page",
      "role": "plan_ready",
      "title": "Your personalized plan is ready",
      "subtitle": "A structured path built around your starting point.",
      "ctaLabel": "Continue",
      "progress": {
        "visible": false
      },
      "designSource": "stitch",
      "stitchVariant": "animated-projection-chart",
      "stitchNotes": "Chart uses runtime weight trajectory and target date.",
      "stitchScreenId": "67d530df9eff459293d06975dd14bd1d",
      "stitchScreenResource": "projects/5160287003229724876/screens/67d530df9eff459293d06975dd14bd1d"
    },
    {
      "phase": "paywall",
      "conversionPurpose": "Convert users with personalized proof, real offers, Stripe checkout, app screenshots, and subscription reassurance.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "paywall",
      "pageType": "paywall_page",
      "role": "monetization",
      "title": "Unlock your personalized plan",
      "subtitle": "Start with a plan shaped around your goal, body profile, and schedule.",
      "ctaLabel": "Get my plan",
      "paymentProvider": "stripe",
      "stripePublishableKeyEnv": "VITE_STRIPE_PUBLISHABLE_KEY",
      "productSource": "billing_resolve_offers",
      "placementCode": "O2MGB",
      "lpid": "O2MGB",
      "resultPreview": {
        "headline": "Your personalized home fitness plan is ready",
        "targetWeightLabel": "Target",
        "fitnessLevelLabel": "Fitness level"
      },
      "plans": [
        {
          "id": "starter",
          "productId": "mock_starter",
          "label": "4-week starter",
          "price": "$14.99",
          "billingPeriod": "First plan phase"
        },
        {
          "id": "twelve_week",
          "productId": "mock_twelve_week",
          "label": "12-week plan",
          "price": "$29.99",
          "billingPeriod": "Recommended"
        }
      ],
      "highlights": [
        "Personalized no-equipment training plan",
        "Progressions matched to your starting strength",
        "Short sessions built around your schedule",
        "Core, upper-body, and full-body focus options"
      ],
      "testimonials": [
        {
          "name": "Bella",
          "rating": 5,
          "text": "The plan matched my schedule and made the first week feel achievable instead of intimidating."
        },
        {
          "name": "Rory",
          "rating": 5,
          "text": "I liked that the sessions had structure and did not feel like random workouts."
        },
        {
          "name": "Janet",
          "rating": 5,
          "text": "Seeing a path based on my answers made it easier to commit to the plan."
        }
      ],
      "faq": [
        {
          "q": "Do I need equipment?",
          "a": "Most sessions are built around bodyweight exercises and can be done at home."
        },
        {
          "q": "Can beginners use it?",
          "a": "Yes. The plan adjusts difficulty based on your starting level and answers."
        },
        {
          "q": "Can I cancel?",
          "a": "Yes. You can manage your subscription from your account page on the website."
        }
      ],
      "moneyBackGuarantee": "30-day money-back guarantee if the plan does not feel like a fit.",
      "renewalDisclosure": "By clicking GET MY PLAN, I agree to start the selected subscription. It renews automatically until canceled in my account before the next billing cycle.",
      "legalLinks": [
        {
          "label": "Terms",
          "href": "#"
        },
        {
          "label": "Privacy",
          "href": "#"
        }
      ],
      "progress": {
        "visible": false
      },
      "assetRequirement": {
        "required": true,
        "assetType": "paywall_result_comparison"
      },
      "designSource": "stitch",
      "stitchVariant": "long-form-stacked",
      "stitchNotes": "Offers, prices, countdown, checkout, and subscription legal text are runtime/API owned.",
      "stitchScreenId": "c0f4590b9c90422d9a5eb1a2a2acd75b",
      "stitchScreenResource": "projects/5160287003229724876/screens/c0f4590b9c90422d9a5eb1a2a2acd75b"
    },
    {
      "phase": "paid",
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "payment_success",
      "pageType": "payment_success_page",
      "role": "payment_success",
      "title": "Payment confirmed",
      "subtitle": "Create your account to keep access to your plan.",
      "ctaLabel": "Create account",
      "milestone": "payment_verified",
      "commitPhase": "paid",
      "progress": {
        "visible": false
      },
      "designSource": "stitch",
      "stitchVariant": "flat-success-confirmation",
      "stitchNotes": "Minimal success state before account creation.",
      "stitchScreenId": "b547d7a33689483cac615dc0a8dc3939",
      "stitchScreenResource": "projects/5160287003229724876/screens/b547d7a33689483cac615dc0a8dc3939"
    },
    {
      "phase": "account",
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "account_create",
      "pageType": "account_create_page",
      "role": "account_create",
      "dataKey": "accountEmail",
      "title": "Create your account",
      "subtitle": "Save your plan and subscription access.",
      "ctaLabel": "Create account",
      "progress": {
        "visible": false
      },
      "designSource": "stitch",
      "stitchVariant": "flat-auth-form",
      "stitchNotes": "Registration only after payment.",
      "stitchScreenId": "9ade5119a2414eca83e276ed9ff5584a",
      "stitchScreenResource": "projects/5160287003229724876/screens/9ade5119a2414eca83e276ed9ff5584a"
    },
    {
      "phase": "account",
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "login",
      "pageType": "login_page",
      "role": "login",
      "title": "Log in",
      "subtitle": "Access your plan and subscription.",
      "ctaLabel": "Log in",
      "progress": {
        "visible": false
      },
      "designSource": "stitch",
      "stitchVariant": "flat-auth-form",
      "stitchNotes": "Returning-user login from entry page.",
      "stitchScreenId": "af0bdb3c4aeb489693746334ca23823d",
      "stitchScreenResource": "projects/5160287003229724876/screens/af0bdb3c4aeb489693746334ca23823d"
    },
    {
      "phase": "account",
      "conversionPurpose": "Collect a meaningful personalization signal while increasing confidence in the paid plan.",
      "personalizationUse": "Used to adapt plan difficulty, summary messaging, and paywall bridge copy.",
      "id": "profile",
      "pageType": "account_page",
      "role": "account_overview",
      "title": "Profile",
      "subtitle": "Your plan and subscription.",
      "subscriptionDataSources": [
        "subscriptionStatus",
        "subscriptionList",
        "entitlements"
      ],
      "progress": {
        "visible": false
      },
      "designSource": "stitch",
      "stitchVariant": "flat-subscription-summary",
      "stitchNotes": "Profile and subscription management.",
      "stitchScreenId": "86f8f15e993c4820811ae4f840ef9f03",
      "stitchScreenResource": "projects/5160287003229724876/screens/86f8f15e993c4820811ae4f840ef9f03"
    }
  ],
  "designProvider": {
    "source": "stitch",
    "status": "designed_in_stitch",
    "projectId": "5160287003229724876",
    "handoffFile": "outputs/design/stitch-handoff.json",
    "mode": "style_and_layout_direction"
  }
} as FunnelConfig;

export const copyConfig = {
  "version": "0.5.0",
  "product": "Workout for Women -Lose Weight",
  "pages": {
    "entry": {
      "title": "Create a plan that fits your starting point",
      "subtitle": "Answer a few simple questions so your plan can match your goal, routine, and body profile.",
      "body": "",
      "cta": "Get started",
      "options": []
    },
    "age_group": {
      "title": "Select your age to start",
      "subtitle": "This helps tune recovery, difficulty, and weekly pacing.",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "18_25",
          "label": "Age: 18-25"
        },
        {
          "value": "26_35",
          "label": "Age: 26-35"
        },
        {
          "value": "36_45",
          "label": "Age: 36-45"
        },
        {
          "value": "46_plus",
          "label": "Age: 46+"
        }
      ]
    },
    "exact_age": {
      "title": "What is your age?",
      "subtitle": "A precise age helps us personalize intensity and recovery.",
      "body": "",
      "cta": "Continue",
      "options": []
    },
    "fitness_goal_discovery": {
      "title": "What is your main goal?",
      "subtitle": "",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "build_strength",
          "label": "Build strength"
        },
        {
          "value": "lose_fat",
          "label": "Lose fat"
        },
        {
          "value": "look_more_defined",
          "label": "Look more defined"
        },
        {
          "value": "build_discipline",
          "label": "Build discipline"
        }
      ]
    },
    "fitness_body_focus": {
      "title": "Which areas should we focus on?",
      "subtitle": "Choose all that apply",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "chest",
          "label": "Chest"
        },
        {
          "value": "arms",
          "label": "Arms"
        },
        {
          "value": "core",
          "label": "Core"
        },
        {
          "value": "legs",
          "label": "Legs"
        },
        {
          "value": "full_body",
          "label": "Full body"
        }
      ]
    },
    "fitness_goal_trust_bridge": {
      "title": "Your goal gives the plan direction",
      "subtitle": "The next answers help us make it realistic.",
      "body": "A strong plan is not just harder exercises. It needs the right starting point, the right schedule, and a progression you can keep repeating.",
      "cta": "Continue",
      "options": []
    },
    "fitness_experience_level": {
      "title": "How familiar are you with home fitness?",
      "subtitle": "",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "beginner",
          "label": "Beginner"
        },
        {
          "value": "returning",
          "label": "Returning after a break"
        },
        {
          "value": "intermediate",
          "label": "Intermediate"
        },
        {
          "value": "advanced",
          "label": "Advanced"
        }
      ]
    },
    "fitness_training_readiness": {
      "title": "What is your current starting level?",
      "subtitle": "",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "low",
          "label": "I need a simple start"
        },
        {
          "value": "medium",
          "label": "I can handle a challenge"
        },
        {
          "value": "high",
          "label": "Push me harder"
        }
      ]
    },
    "fitness_current_activity": {
      "title": "How active are you now?",
      "subtitle": "",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "not_active",
          "label": "Not active"
        },
        {
          "value": "light",
          "label": "Light movement sometimes"
        },
        {
          "value": "moderate",
          "label": "I move a few days a week"
        },
        {
          "value": "high",
          "label": "I already stay active"
        }
      ]
    },
    "fitness_blockers": {
      "title": "What usually gets in your way?",
      "subtitle": "Choose all that apply",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "no_time",
          "label": "No time"
        },
        {
          "value": "low_motivation",
          "label": "Low motivation"
        },
        {
          "value": "too_hard",
          "label": "Plans feel too hard"
        },
        {
          "value": "no_plan",
          "label": "I do not know what to do"
        },
        {
          "value": "slow_results",
          "label": "Results feel too slow"
        }
      ]
    },
    "fitness_limitations": {
      "title": "Any areas that need extra care?",
      "subtitle": "Choose all that apply",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "wrists",
          "label": "Wrists"
        },
        {
          "value": "shoulders",
          "label": "Shoulders"
        },
        {
          "value": "back",
          "label": "Back"
        },
        {
          "value": "knees",
          "label": "Knees"
        },
        {
          "value": "none",
          "label": "No special limitations"
        }
      ]
    },
    "fitness_routine_trust_bridge": {
      "title": "Your routine should fit your real week",
      "subtitle": "Consistency matters more than a perfect schedule.",
      "body": "Most people stop because the training plan asks for a version of their week that does not exist. We will use your schedule to shape a home fitness plan that feels easier to repeat.",
      "cta": "Continue",
      "options": []
    },
    "fitness_time_budget": {
      "title": "How much time feels realistic?",
      "subtitle": "",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "10",
          "label": "10 minutes"
        },
        {
          "value": "15",
          "label": "15 minutes"
        },
        {
          "value": "20",
          "label": "20 minutes"
        },
        {
          "value": "25",
          "label": "25 minutes"
        }
      ]
    },
    "fitness_weekly_frequency": {
      "title": "How many days per week can you commit?",
      "subtitle": "",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "2_3",
          "label": "2-3 days"
        },
        {
          "value": "4_5",
          "label": "4-5 days"
        },
        {
          "value": "6_7",
          "label": "6-7 days"
        }
      ]
    },
    "fitness_preferred_time": {
      "title": "When would you prefer to practice?",
      "subtitle": "",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "morning",
          "label": "Morning"
        },
        {
          "value": "afternoon",
          "label": "Afternoon"
        },
        {
          "value": "evening",
          "label": "Evening"
        },
        {
          "value": "varies",
          "label": "It changes"
        }
      ]
    },
    "fitness_energy_level": {
      "title": "How is your energy on most days?",
      "subtitle": "",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "low",
          "label": "Low"
        },
        {
          "value": "mixed",
          "label": "It changes"
        },
        {
          "value": "steady",
          "label": "Steady"
        },
        {
          "value": "high",
          "label": "High"
        }
      ]
    },
    "fitness_motivation_reason": {
      "title": "What would make this plan worth it?",
      "subtitle": "",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "confidence",
          "label": "Feel more confident"
        },
        {
          "value": "discipline",
          "label": "Build discipline"
        },
        {
          "value": "appearance",
          "label": "See visible change"
        },
        {
          "value": "health",
          "label": "Feel healthier"
        }
      ]
    },
    "fitness_support_style": {
      "title": "What kind of guidance helps you most?",
      "subtitle": "",
      "body": "",
      "cta": "",
      "options": [
        {
          "value": "simple",
          "label": "Simple instructions"
        },
        {
          "value": "encouraging",
          "label": "Encourage me"
        },
        {
          "value": "progress",
          "label": "Show progress"
        },
        {
          "value": "challenge",
          "label": "Challenge me gradually"
        }
      ]
    },
    "height": {
      "title": "How tall are you?",
      "subtitle": "",
      "body": "",
      "cta": "Continue",
      "options": []
    },
    "current_weight": {
      "title": "What is your current weight?",
      "subtitle": "",
      "body": "",
      "cta": "Continue",
      "options": []
    },
    "target_weight": {
      "title": "What is your target weight?",
      "subtitle": "",
      "body": "",
      "cta": "Continue",
      "options": []
    },
    "email": {
      "title": "Where should we send your plan?",
      "subtitle": "Use an email you can access later.",
      "body": "",
      "cta": "Continue",
      "options": []
    },
    "summary": {
      "title": "Summary of your fitness level",
      "subtitle": "",
      "body": "",
      "cta": "Continue",
      "options": []
    },
    "plan_generation": {
      "title": "Creating your home fitness plan",
      "subtitle": "Matching your baseline, goal, and weekly schedule.",
      "body": "",
      "cta": "",
      "options": []
    },
    "plan_ready": {
      "title": "Your personalized plan is ready",
      "subtitle": "A structured path built around your starting point.",
      "body": "",
      "cta": "Continue",
      "options": []
    },
    "paywall": {
      "title": "Unlock your personalized plan",
      "subtitle": "Start with a plan shaped around your goal, body profile, and schedule.",
      "body": "",
      "cta": "Get my plan",
      "options": []
    },
    "payment_success": {
      "title": "Payment confirmed",
      "subtitle": "Create your account to keep access to your plan.",
      "body": "",
      "cta": "Create account",
      "options": []
    },
    "account_create": {
      "title": "Create your account",
      "subtitle": "Save your plan and subscription access.",
      "body": "",
      "cta": "Create account",
      "options": []
    },
    "login": {
      "title": "Log in",
      "subtitle": "Access your plan and subscription.",
      "body": "",
      "cta": "Log in",
      "options": []
    },
    "profile": {
      "title": "Profile",
      "subtitle": "Your plan and subscription.",
      "body": "",
      "cta": "",
      "options": []
    }
  }
} as CopyConfig;

export const pageVisualMap = {
  "version": "0.5.0",
  "defaults": {
    "pageMaxWidth": 760,
    "desktopMaxWidth": 760,
    "background": "var(--bg)",
    "titleAlign": "center",
    "titleSize": "clamp(27px, 4vw, 36px)",
    "bodySize": "16px",
    "ctaRadius": 10,
    "inputRadius": 6,
    "optionRadius": 16,
    "selectedStyle": "primary_outline_or_fill",
    "motion": "subtle",
    "designSource": "stitch",
    "primaryColor": "#ff4d6d"
  },
  "pageTypes": {
    "single_choice_page": {
      "supportedVariants": [
        "image_grid",
        "plain_list",
        "icon_list"
      ],
      "ctaMode": "auto_advance",
      "imageRatio": "4/5",
      "iconPlacement": "leading",
      "stitchVariant": "flat-choice-list-or-image-grid",
      "stitchNotes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "multi_choice_page": {
      "supportedVariants": [
        "image_grid",
        "plain_list",
        "icon_list"
      ],
      "ctaMode": "sticky_bottom",
      "selectedIndicator": "checkmark_or_accent",
      "minSelectionFeedback": "disabled_cta",
      "stitchVariant": "flat-check-list",
      "stitchNotes": "Clear selected state with border/tint/check treatment, no tiny right-side circles.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "age_input_page": {
      "layout": "large_center_numeric_input",
      "helperCard": "flat_tinted_explainer",
      "placeholder": "0",
      "stitchVariant": "large-centered-number-input",
      "stitchNotes": "Large age input with explanatory support card.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "height_input_page": {
      "layout": "large_measurement_input",
      "unitSwitcher": "sliding_capsule",
      "helperCard": "bmi_explainer",
      "stitchVariant": "large-centered-measurement-input",
      "stitchNotes": "Segmented unit switch, large value input, bottom CTA.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "weight_input_page": {
      "layout": "large_measurement_input",
      "unitSwitcher": "sliding_capsule",
      "insightCard": "bmi_or_target_context",
      "stitchVariant": "large-centered-measurement-input-with-feedback",
      "stitchNotes": "Runtime applies current-weight BMI feedback and target-weight delta feedback.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "email_capture_page": {
      "layout": "lead_capture_stack",
      "trustDensity": "light",
      "stitchVariant": "flat-email-capture",
      "stitchNotes": "Title, email input, privacy reassurance.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "paywall_page": {
      "layout": "long_vertical_sales_page",
      "desktopLayout": "centered-vertical-web-funnel",
      "offerRows": "product_deduped",
      "stitchVariant": "long-form-stacked",
      "stitchNotes": "Offers, prices, countdown, checkout, and subscription legal text are runtime/API owned.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "readableMaxWidth": 760
    },
    "login_page": {
      "layout": "flat_auth_form",
      "container": "none",
      "inputSurface": "soft_gray",
      "stitchVariant": "flat-auth-form",
      "stitchNotes": "Returning-user login from entry page.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "account_create_page": {
      "layout": "flat_auth_form",
      "container": "none",
      "inputSurface": "soft_gray",
      "stitchVariant": "flat-auth-form",
      "stitchNotes": "Registration only after payment.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "account_page": {
      "layout": "flat_profile_list",
      "container": "none",
      "dividerStyle": "hairline",
      "stitchVariant": "flat-subscription-summary",
      "stitchNotes": "Profile and subscription management.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "entry_page": {
      "stitchVariant": "hero-image-overlay",
      "stitchNotes": "Large photographic hero with clear start CTA and login action.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "intro_page": {
      "stitchVariant": "image-top-copy-bottom-cta",
      "stitchNotes": "4:3 image area, trust copy, bottom CTA.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "summary_page": {
      "stitchVariant": "bmi-report-with-body-image",
      "stitchNotes": "BMI indicator, personalized summary rows, body visual.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "plan_generation_page": {
      "stitchVariant": "progress-ring-with-overlay-questions",
      "stitchNotes": "Progress animation plus required yes/no overlay questions.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "plan_ready_page": {
      "stitchVariant": "animated-projection-chart",
      "stitchNotes": "Chart uses runtime weight trajectory and target date.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    },
    "payment_success_page": {
      "stitchVariant": "flat-success-confirmation",
      "stitchNotes": "Minimal success state before account creation.",
      "designSource": "stitch",
      "surfaceStyle": "flat",
      "avoidNestedCards": true,
      "desktopLayout": "centered-vertical-web-funnel",
      "readableMaxWidth": 760
    }
  },
  "pages": {
    "entry": {
      "pageType": "entry_page",
      "variant": "default",
      "sectionId": "entry",
      "stitchScreenId": "f81748dff7844d13ad26b792d2fb3c0f",
      "stitchScreenResource": "projects/5160287003229724876/screens/f81748dff7844d13ad26b792d2fb3c0f",
      "designSource": "stitch"
    },
    "age_group": {
      "pageType": "single_choice_page",
      "variant": "image_grid",
      "sectionId": "my_profile",
      "stitchScreenId": "a2ca25ff2e5143149766ebc30904925e",
      "stitchScreenResource": "projects/5160287003229724876/screens/a2ca25ff2e5143149766ebc30904925e",
      "designSource": "stitch"
    },
    "exact_age": {
      "pageType": "age_input_page",
      "variant": "default",
      "sectionId": "my_profile",
      "stitchScreenId": "b30983ec7a7147c8a7c9eee88c981390",
      "stitchScreenResource": "projects/5160287003229724876/screens/b30983ec7a7147c8a7c9eee88c981390",
      "designSource": "stitch"
    },
    "fitness_goal_discovery": {
      "pageType": "single_choice_page",
      "variant": "icon_list",
      "sectionId": "goals",
      "stitchScreenId": "37b7cbae31aa46b78b5092b0922d5e43",
      "stitchScreenResource": "projects/5160287003229724876/screens/37b7cbae31aa46b78b5092b0922d5e43",
      "designSource": "stitch"
    },
    "fitness_body_focus": {
      "pageType": "multi_choice_page",
      "variant": "icon_list",
      "sectionId": "goals",
      "stitchScreenId": "17692c34393a4a0c969735af16fedccf",
      "stitchScreenResource": "projects/5160287003229724876/screens/17692c34393a4a0c969735af16fedccf",
      "designSource": "stitch"
    },
    "fitness_goal_trust_bridge": {
      "pageType": "intro_page",
      "variant": "default",
      "sectionId": "goals",
      "stitchScreenId": "2ca066d0b68e4168a99f5cbd7a15f5bb",
      "stitchScreenResource": "projects/5160287003229724876/screens/2ca066d0b68e4168a99f5cbd7a15f5bb",
      "designSource": "stitch"
    },
    "fitness_experience_level": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "training"
    },
    "fitness_training_readiness": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "training"
    },
    "fitness_current_activity": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "training"
    },
    "fitness_blockers": {
      "pageType": "multi_choice_page",
      "variant": "plain_list",
      "sectionId": "training"
    },
    "fitness_limitations": {
      "pageType": "multi_choice_page",
      "variant": "plain_list",
      "sectionId": "body"
    },
    "fitness_routine_trust_bridge": {
      "pageType": "intro_page",
      "variant": "default",
      "sectionId": "routine"
    },
    "fitness_time_budget": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "routine"
    },
    "fitness_weekly_frequency": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "routine"
    },
    "fitness_preferred_time": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "routine"
    },
    "fitness_energy_level": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "routine"
    },
    "fitness_motivation_reason": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "motivation"
    },
    "fitness_support_style": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "motivation"
    },
    "height": {
      "pageType": "height_input_page",
      "variant": "default",
      "sectionId": "body",
      "stitchScreenId": "470bdef605104e4985fc7234953d842a",
      "stitchScreenResource": "projects/5160287003229724876/screens/470bdef605104e4985fc7234953d842a",
      "designSource": "stitch"
    },
    "current_weight": {
      "pageType": "weight_input_page",
      "variant": "default",
      "sectionId": "body",
      "stitchScreenId": "6a2d4ff8158a46418d9e1f9658882465",
      "stitchScreenResource": "projects/5160287003229724876/screens/6a2d4ff8158a46418d9e1f9658882465",
      "designSource": "stitch"
    },
    "target_weight": {
      "pageType": "weight_input_page",
      "variant": "default",
      "sectionId": "body",
      "stitchScreenId": "f0f8c37f616a4b8ba6c0f8348035e4b9",
      "stitchScreenResource": "projects/5160287003229724876/screens/f0f8c37f616a4b8ba6c0f8348035e4b9",
      "designSource": "stitch"
    },
    "email": {
      "pageType": "email_capture_page",
      "variant": "default",
      "sectionId": "result",
      "stitchScreenId": "d857a4158a894491bfe877600a6d0f71",
      "stitchScreenResource": "projects/5160287003229724876/screens/d857a4158a894491bfe877600a6d0f71",
      "designSource": "stitch"
    },
    "summary": {
      "pageType": "summary_page",
      "variant": "default",
      "sectionId": "result",
      "stitchScreenId": "77109ad24158445a94af2058b2f342bb",
      "stitchScreenResource": "projects/5160287003229724876/screens/77109ad24158445a94af2058b2f342bb",
      "designSource": "stitch"
    },
    "plan_generation": {
      "pageType": "plan_generation_page",
      "variant": "default",
      "sectionId": "result",
      "stitchScreenId": "feab4b24b62b4a8b8a67d815c82f7b29",
      "stitchScreenResource": "projects/5160287003229724876/screens/feab4b24b62b4a8b8a67d815c82f7b29",
      "designSource": "stitch"
    },
    "plan_ready": {
      "pageType": "plan_ready_page",
      "variant": "default",
      "sectionId": "result",
      "stitchScreenId": "67d530df9eff459293d06975dd14bd1d",
      "stitchScreenResource": "projects/5160287003229724876/screens/67d530df9eff459293d06975dd14bd1d",
      "designSource": "stitch"
    },
    "paywall": {
      "pageType": "paywall_page",
      "variant": "default",
      "sectionId": "paywall",
      "stitchScreenId": "c0f4590b9c90422d9a5eb1a2a2acd75b",
      "stitchScreenResource": "projects/5160287003229724876/screens/c0f4590b9c90422d9a5eb1a2a2acd75b",
      "designSource": "stitch"
    },
    "payment_success": {
      "pageType": "payment_success_page",
      "variant": "default",
      "sectionId": "paid",
      "stitchScreenId": "b547d7a33689483cac615dc0a8dc3939",
      "stitchScreenResource": "projects/5160287003229724876/screens/b547d7a33689483cac615dc0a8dc3939",
      "designSource": "stitch"
    },
    "account_create": {
      "pageType": "account_create_page",
      "variant": "default",
      "sectionId": "account",
      "stitchScreenId": "9ade5119a2414eca83e276ed9ff5584a",
      "stitchScreenResource": "projects/5160287003229724876/screens/9ade5119a2414eca83e276ed9ff5584a",
      "designSource": "stitch"
    },
    "login": {
      "pageType": "login_page",
      "variant": "default",
      "sectionId": "account",
      "stitchScreenId": "af0bdb3c4aeb489693746334ca23823d",
      "stitchScreenResource": "projects/5160287003229724876/screens/af0bdb3c4aeb489693746334ca23823d",
      "designSource": "stitch"
    },
    "profile": {
      "pageType": "account_page",
      "variant": "default",
      "sectionId": "account",
      "stitchScreenId": "86f8f15e993c4820811ae4f840ef9f03",
      "stitchScreenResource": "projects/5160287003229724876/screens/86f8f15e993c4820811ae4f840ef9f03",
      "designSource": "stitch"
    }
  },
  "source": "stitch",
  "stitchProjectId": "5160287003229724876",
  "stitchHandoffFile": "outputs/design/stitch-handoff.json"
} as PageVisualMap;

export const stitchDerivedStyle = {
  "version": "0.1.0",
  "source": "stitch",
  "status": "designed_in_stitch",
  "projectId": "5160287003229724876",
  "handoffFile": "outputs/design/stitch-handoff.json",
  "mode": "style_and_layout_direction",
  "global": {
    "designIntent": {
      "audience": "Women seeking approachable home fitness, body confidence, and consistent routines.",
      "mood": [
        "premium",
        "energetic",
        "clean",
        "motivating"
      ],
      "visualDirection": "Premium athletic mobile-first funnel with crisp light surfaces, pink action accents, strong editorial headlines, generous whitespace, and restrained depth."
    },
    "tokens": {
      "background": "#f8f9fa",
      "surface": "#ffffff",
      "surfaceSoft": "#f2f4f5",
      "primary": "#ff4d6d",
      "primaryDark": "#b60e3d",
      "accent": "#191c1d",
      "text": "#191c1d",
      "mutedText": "#5a4042",
      "border": "#e2bec0",
      "fontFamily": "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "headlineFontFamily": "Montserrat, Inter, system-ui, sans-serif",
      "backgroundStyle": "soft-neutral-athletic",
      "surfaceStyle": "flat-white-tonal-layers",
      "buttonStyle": "full-width-rounded-primary",
      "navStyle": "compact-section-segmented",
      "progressStyle": "segmented-bars",
      "radius": {
        "controls": 8,
        "cards": 16,
        "buttons": 12
      },
      "layout": {
        "mobileFirst": true,
        "desktop": "centered-vertical-web-funnel",
        "readableMaxWidth": 760,
        "avoidPhoneMockup": true,
        "avoidSplitLayout": true
      }
    },
    "typography": {
      "headlineFamily": "Montserrat, Inter, system-ui, sans-serif",
      "bodyFamily": "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "headlineWeight": 780,
      "bodyWeight": 500
    },
    "radius": {
      "controls": 8,
      "cards": 16,
      "buttons": 12
    },
    "layout": {
      "mobileFirst": true,
      "desktop": "centered-vertical-web-funnel",
      "readableMaxWidth": 760,
      "avoidPhoneMockup": true,
      "avoidSplitLayout": true
    },
    "principles": [
      "Use Stitch as visual hierarchy and layout direction.",
      "Preserve Runtime-owned data, validation, payment, analytics, Firebase, and navigation.",
      "Prefer flat composition over nested cards."
    ]
  },
  "pageTypes": {
    "entry_page": {
      "source": "stitch",
      "screenId": "f81748dff7844d13ad26b792d2fb3c0f",
      "variant": "hero-image-overlay",
      "variantClass": "stitch-variant-hero-image-overlay",
      "notes": "Large photographic hero with clear start CTA and login action.",
      "density": "immersive",
      "titleTreatment": "hero",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "single_choice_page": {
      "source": "stitch",
      "screenId": "37b7cbae31aa46b78b5092b0922d5e43",
      "variant": "flat-choice-list-or-image-grid",
      "variantClass": "stitch-variant-flat-choice-list-or-image-grid",
      "notes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "multi_choice_page": {
      "source": "stitch",
      "screenId": "17692c34393a4a0c969735af16fedccf",
      "variant": "flat-check-list",
      "variantClass": "stitch-variant-flat-check-list",
      "notes": "Clear selected state with border/tint/check treatment, no tiny right-side circles.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "intro_page": {
      "source": "stitch",
      "screenId": "2ca066d0b68e4168a99f5cbd7a15f5bb",
      "variant": "image-top-copy-bottom-cta",
      "variantClass": "stitch-variant-image-top-copy-bottom-cta",
      "notes": "4:3 image area, trust copy, bottom CTA.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "age_input_page": {
      "source": "stitch",
      "screenId": "b30983ec7a7147c8a7c9eee88c981390",
      "variant": "large-centered-number-input",
      "variantClass": "stitch-variant-large-centered-number-input",
      "notes": "Large age input with explanatory support card.",
      "density": "focused",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "height_input_page": {
      "source": "stitch",
      "screenId": "470bdef605104e4985fc7234953d842a",
      "variant": "large-centered-measurement-input",
      "variantClass": "stitch-variant-large-centered-measurement-input",
      "notes": "Segmented unit switch, large value input, bottom CTA.",
      "density": "focused",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "weight_input_page": {
      "source": "stitch",
      "screenId": "6a2d4ff8158a46418d9e1f9658882465",
      "variant": "large-centered-measurement-input-with-feedback",
      "variantClass": "stitch-variant-large-centered-measurement-input-with-feedback",
      "notes": "Runtime applies current-weight BMI feedback and target-weight delta feedback.",
      "density": "focused",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "email_capture_page": {
      "source": "stitch",
      "screenId": "d857a4158a894491bfe877600a6d0f71",
      "variant": "flat-email-capture",
      "variantClass": "stitch-variant-flat-email-capture",
      "notes": "Title, email input, privacy reassurance.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "summary_page": {
      "source": "stitch",
      "screenId": "77109ad24158445a94af2058b2f342bb",
      "variant": "bmi-report-with-body-image",
      "variantClass": "stitch-variant-bmi-report-with-body-image",
      "notes": "BMI indicator, personalized summary rows, body visual.",
      "density": "report",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "plan_generation_page": {
      "source": "stitch",
      "screenId": "feab4b24b62b4a8b8a67d815c82f7b29",
      "variant": "progress-ring-with-overlay-questions",
      "variantClass": "stitch-variant-progress-ring-with-overlay-questions",
      "notes": "Progress animation plus required yes/no overlay questions.",
      "density": "cinematic",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "plan_ready_page": {
      "source": "stitch",
      "screenId": "67d530df9eff459293d06975dd14bd1d",
      "variant": "animated-projection-chart",
      "variantClass": "stitch-variant-animated-projection-chart",
      "notes": "Chart uses runtime weight trajectory and target date.",
      "density": "cinematic",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "paywall_page": {
      "source": "stitch",
      "screenId": "c0f4590b9c90422d9a5eb1a2a2acd75b",
      "variant": "long-form-stacked",
      "variantClass": "stitch-variant-long-form-stacked",
      "notes": "Offers, prices, countdown, checkout, and subscription legal text are runtime/API owned.",
      "density": "sales",
      "titleTreatment": "sales",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "payment_success_page": {
      "source": "stitch",
      "screenId": "b547d7a33689483cac615dc0a8dc3939",
      "variant": "flat-success-confirmation",
      "variantClass": "stitch-variant-flat-success-confirmation",
      "notes": "Minimal success state before account creation.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "account_create_page": {
      "source": "stitch",
      "screenId": "9ade5119a2414eca83e276ed9ff5584a",
      "variant": "flat-auth-form",
      "variantClass": "stitch-variant-flat-auth-form",
      "notes": "Registration only after payment.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "login_page": {
      "source": "stitch",
      "screenId": "af0bdb3c4aeb489693746334ca23823d",
      "variant": "flat-auth-form",
      "variantClass": "stitch-variant-flat-auth-form",
      "notes": "Returning-user login from entry page.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    },
    "account_page": {
      "source": "stitch",
      "screenId": "86f8f15e993c4820811ae4f840ef9f03",
      "variant": "flat-subscription-summary",
      "variantClass": "stitch-variant-flat-subscription-summary",
      "notes": "Profile and subscription management.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true
    }
  },
  "pages": {
    "entry": {
      "source": "stitch",
      "screenId": "f81748dff7844d13ad26b792d2fb3c0f",
      "variant": "hero-image-overlay",
      "variantClass": "stitch-variant-hero-image-overlay",
      "notes": "Large photographic hero with clear start CTA and login action.",
      "density": "immersive",
      "titleTreatment": "hero",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/f81748dff7844d13ad26b792d2fb3c0f",
      "requiredElements": [
        "product/brand signal",
        "large hero image area",
        "core promise headline",
        "start-funnel CTA",
        "login action for returning users"
      ],
      "dataSlots": [
        {
          "key": "productName",
          "required": true,
          "shape": "string",
          "source": "product profile",
          "description": "Displayed as brand/product signal."
        },
        {
          "key": "entryHero",
          "required": true,
          "shape": "image",
          "source": "asset manifest",
          "description": "Hero image or reserved image area."
        },
        {
          "key": "startAction",
          "required": true,
          "shape": "action",
          "source": "runtime",
          "description": "Starts a new tab-scoped OB session."
        },
        {
          "key": "loginAction",
          "required": true,
          "shape": "action",
          "source": "runtime",
          "description": "Routes returning users to login."
        }
      ],
      "visualJob": "Make the product feel real through a strong hero image and direct start action.",
      "composition": "Mobile-first vertical layout, centered title, stable content area, bottom CTA when needed.",
      "componentHierarchy": [
        "Brand",
        "Login action",
        "Hero image",
        "Headline",
        "Primary CTA"
      ],
      "pageClass": "stitch-page stitch-type-entry-page stitch-variant-hero-image-overlay"
    },
    "age_group": {
      "source": "stitch",
      "screenId": "a2ca25ff2e5143149766ebc30904925e",
      "variant": "flat-choice-list-or-image-grid",
      "variantClass": "stitch-variant-flat-choice-list-or-image-grid",
      "notes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/a2ca25ff2e5143149766ebc30904925e",
      "requiredElements": [
        "four age-group option cards",
        "one image area per age option",
        "age labels from the generated age-group strategy",
        "instant-next selected state",
        "terms/privacy reassurance when supplied by Runtime copy"
      ],
      "dataSlots": [
        {
          "key": "ageGroup",
          "required": true,
          "shape": "string",
          "source": "field-contract",
          "description": "User answer captured by this page. Used by firestore, analytics, summary, planGeneration, paywall."
        },
        {
          "key": "ageGroups",
          "required": true,
          "shape": "array",
          "source": "product profile",
          "description": "Age group labels, values, and image requirements generated from target audience."
        },
        {
          "key": "ageGroupImages",
          "required": true,
          "shape": "image[]",
          "source": "asset manifest",
          "description": "One image per age group."
        }
      ],
      "visualJob": "Make the first answer visual and low friction.",
      "composition": "Mobile-first vertical layout, centered title, stable content area, bottom CTA when needed.",
      "componentHierarchy": [
        "Top navigation",
        "Title",
        "Subtitle",
        "Options or content",
        "CTA where required"
      ],
      "pageClass": "stitch-page stitch-type-single-choice-page stitch-variant-flat-choice-list-or-image-grid"
    },
    "exact_age": {
      "source": "stitch",
      "screenId": "b30983ec7a7147c8a7c9eee88c981390",
      "variant": "large-centered-number-input",
      "variantClass": "stitch-variant-large-centered-number-input",
      "notes": "Large age input with explanatory support card.",
      "density": "focused",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/b30983ec7a7147c8a7c9eee88c981390",
      "requiredElements": [
        "large numeric age input",
        "default age value",
        "age validation state",
        "support card explaining why age is collected",
        "bottom CTA"
      ],
      "dataSlots": [
        {
          "key": "ageNum",
          "required": true,
          "shape": "number",
          "source": "field-contract",
          "description": "User answer captured by this page. Used by firestore, analytics, summary, planGeneration."
        }
      ],
      "componentHierarchy": [],
      "pageClass": "stitch-page stitch-type-age-input-page stitch-variant-large-centered-number-input"
    },
    "fitness_goal_discovery": {
      "source": "stitch",
      "screenId": "37b7cbae31aa46b78b5092b0922d5e43",
      "variant": "flat-choice-list-or-image-grid",
      "variantClass": "stitch-variant-flat-choice-list-or-image-grid",
      "notes": "Use image grid when page assets exist; otherwise use clean flat options. Do not force icons.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/37b7cbae31aa46b78b5092b0922d5e43",
      "requiredElements": [
        "all answer options from the generated page copy",
        "clear selected state",
        "tap/click target large enough for mobile",
        "no forced CTA when Runtime selectionBehavior is instant-next",
        "bottom CTA only when Runtime page config requires confirmation"
      ],
      "dataSlots": [
        {
          "key": "mainGoal",
          "required": true,
          "shape": "string",
          "source": "field-contract",
          "description": "User answer captured by this page. Used by firestore, analytics, summary, planGeneration, paywall."
        }
      ],
      "componentHierarchy": [],
      "pageClass": "stitch-page stitch-type-single-choice-page stitch-variant-flat-choice-list-or-image-grid"
    },
    "fitness_body_focus": {
      "source": "stitch",
      "screenId": "17692c34393a4a0c969735af16fedccf",
      "variant": "flat-check-list",
      "variantClass": "stitch-variant-flat-check-list",
      "notes": "Clear selected state with border/tint/check treatment, no tiny right-side circles.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/17692c34393a4a0c969735af16fedccf",
      "requiredElements": [
        "all answer options from the generated page copy",
        "clear selected state",
        "tap/click target large enough for mobile",
        "multiple selected state",
        "bottom CTA",
        "disabled CTA state before minimum selection is met"
      ],
      "dataSlots": [
        {
          "key": "focusAreas",
          "required": true,
          "shape": "string[]",
          "source": "field-contract",
          "description": "User answer captured by this page. Used by firestore, analytics, summary, planGeneration, paywall."
        }
      ],
      "visualJob": "Collect multiple personalization signals without forcing decorative icons.",
      "composition": "Mobile-first vertical layout, centered title, stable content area, bottom CTA when needed.",
      "componentHierarchy": [
        "Top navigation",
        "Title",
        "Subtitle",
        "Options or content",
        "CTA where required"
      ],
      "pageClass": "stitch-page stitch-type-multi-choice-page stitch-variant-flat-check-list"
    },
    "fitness_goal_trust_bridge": {
      "source": "stitch",
      "screenId": "2ca066d0b68e4168a99f5cbd7a15f5bb",
      "variant": "image-top-copy-bottom-cta",
      "variantClass": "stitch-variant-image-top-copy-bottom-cta",
      "notes": "4:3 image area, trust copy, bottom CTA.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/2ca066d0b68e4168a99f5cbd7a15f5bb",
      "requiredElements": [
        "image or visual slot related to intro copy",
        "trust-building headline",
        "supporting paragraph copy",
        "bottom CTA"
      ],
      "dataSlots": [
        {
          "key": "introImage",
          "required": false,
          "shape": "image",
          "source": "asset manifest",
          "description": "Image related to the intro message when this intro page has an image requirement."
        },
        {
          "key": "introCopy",
          "required": true,
          "shape": "text",
          "source": "copy output",
          "description": "Headline and body copy from the copy agent."
        }
      ],
      "componentHierarchy": [],
      "pageClass": "stitch-page stitch-type-intro-page stitch-variant-image-top-copy-bottom-cta"
    },
    "height": {
      "source": "stitch",
      "screenId": "470bdef605104e4985fc7234953d842a",
      "variant": "large-centered-measurement-input",
      "variantClass": "stitch-variant-large-centered-measurement-input",
      "notes": "Segmented unit switch, large value input, bottom CTA.",
      "density": "focused",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/470bdef605104e4985fc7234953d842a",
      "requiredElements": [
        "unit switch between ft/in and cm",
        "two input fields for ft and in when imperial height is selected",
        "single numeric input for cm",
        "real-time unit conversion state",
        "support card explaining body data usage",
        "validation message area",
        "bottom CTA"
      ],
      "dataSlots": [
        {
          "key": "height",
          "required": true,
          "shape": "height_measurement",
          "source": "field-contract",
          "description": "User answer captured by this page. Used by firestore, analytics, summary, planGeneration."
        }
      ],
      "visualJob": "Capture body baseline through large numeric input and unit conversion.",
      "composition": "Mobile-first vertical layout, centered title, stable content area, bottom CTA when needed.",
      "componentHierarchy": [
        "Top navigation",
        "Title",
        "Unit switch",
        "Numeric input",
        "Support card",
        "CTA"
      ],
      "pageClass": "stitch-page stitch-type-height-input-page stitch-variant-large-centered-measurement-input"
    },
    "current_weight": {
      "source": "stitch",
      "screenId": "6a2d4ff8158a46418d9e1f9658882465",
      "variant": "large-centered-measurement-input-with-feedback",
      "variantClass": "stitch-variant-large-centered-measurement-input-with-feedback",
      "notes": "Runtime applies current-weight BMI feedback and target-weight delta feedback.",
      "density": "focused",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/6a2d4ff8158a46418d9e1f9658882465",
      "requiredElements": [
        "unit switch between lb and kg",
        "large centered numeric weight input",
        "real-time unit conversion state",
        "BMI feedback card with category-specific color and icon",
        "validation message area",
        "bottom CTA"
      ],
      "dataSlots": [
        {
          "key": "currentWeight",
          "required": true,
          "shape": "weight_measurement",
          "source": "field-contract",
          "description": "User answer captured by this page. Used by firestore, analytics, summary, planGeneration, paywall."
        }
      ],
      "componentHierarchy": [],
      "pageClass": "stitch-page stitch-type-weight-input-page stitch-variant-large-centered-measurement-input-with-feedback"
    },
    "target_weight": {
      "source": "stitch",
      "screenId": "f0f8c37f616a4b8ba6c0f8348035e4b9",
      "variant": "large-centered-measurement-input-with-feedback",
      "variantClass": "stitch-variant-large-centered-measurement-input-with-feedback",
      "notes": "Runtime applies current-weight BMI feedback and target-weight delta feedback.",
      "density": "focused",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/f0f8c37f616a4b8ba6c0f8348035e4b9",
      "requiredElements": [
        "unit switch between lb and kg",
        "large centered target-weight input",
        "real-time unit conversion state",
        "goal delta card showing weight to lose, gain, or maintain",
        "validation message area",
        "bottom CTA"
      ],
      "dataSlots": [
        {
          "key": "targetWeight",
          "required": true,
          "shape": "weight_measurement",
          "source": "field-contract",
          "description": "User answer captured by this page. Used by firestore, analytics, summary, planGeneration, paywall."
        }
      ],
      "componentHierarchy": [],
      "pageClass": "stitch-page stitch-type-weight-input-page stitch-variant-large-centered-measurement-input-with-feedback"
    },
    "email": {
      "source": "stitch",
      "screenId": "d857a4158a894491bfe877600a6d0f71",
      "variant": "flat-email-capture",
      "variantClass": "stitch-variant-flat-email-capture",
      "notes": "Title, email input, privacy reassurance.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/d857a4158a894491bfe877600a6d0f71",
      "requiredElements": [
        "title explaining where the plan will be sent",
        "email input field",
        "privacy reassurance text",
        "bottom CTA",
        "invalid email state"
      ],
      "dataSlots": [
        {
          "key": "email",
          "required": true,
          "shape": "email_string",
          "source": "field-contract",
          "description": "User answer captured by this page. Used by firestore, analytics."
        }
      ],
      "componentHierarchy": [],
      "pageClass": "stitch-page stitch-type-email-capture-page stitch-variant-flat-email-capture"
    },
    "summary": {
      "source": "stitch",
      "screenId": "77109ad24158445a94af2058b2f342bb",
      "variant": "bmi-report-with-body-image",
      "variantClass": "stitch-variant-bmi-report-with-body-image",
      "notes": "BMI indicator, personalized summary rows, body visual.",
      "density": "report",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/77109ad24158445a94af2058b2f342bb",
      "requiredElements": [
        "BMI range indicator",
        "animated BMI marker position",
        "personalized rows derived from previous answers",
        "body image slot selected by BMI category",
        "insight card",
        "bottom CTA"
      ],
      "dataSlots": [
        {
          "key": "bmi",
          "required": true,
          "shape": "number",
          "source": "runtime calculation",
          "description": "Calculated from height and current weight."
        },
        {
          "key": "bmiCategory",
          "required": true,
          "shape": "underweight | normal | overweight | obese",
          "source": "runtime calculation",
          "description": "Controls BMI marker, copy, color, and body image."
        },
        {
          "key": "fitnessLevel",
          "required": false,
          "shape": "string",
          "source": "answers",
          "description": "Derived from previous answer when available."
        },
        {
          "key": "focusAreas",
          "required": false,
          "shape": "string[]",
          "source": "answers",
          "description": "Derived from focus/body-area answers when available."
        },
        {
          "key": "goalChange",
          "required": true,
          "shape": "number",
          "source": "runtime calculation",
          "description": "Difference between current and target weight."
        },
        {
          "key": "summaryBodyImage",
          "required": true,
          "shape": "image",
          "source": "asset manifest",
          "description": "BMI-category body image."
        }
      ],
      "visualJob": "Prove previous answers are used through computed rows, BMI, and body-state visual.",
      "composition": "Mobile-first vertical layout, centered title, stable content area, bottom CTA when needed.",
      "componentHierarchy": [
        "Top navigation",
        "BMI visualization",
        "Personalized rows",
        "Body image",
        "Insight card",
        "CTA"
      ],
      "pageClass": "stitch-page stitch-type-summary-page stitch-variant-bmi-report-with-body-image"
    },
    "plan_generation": {
      "source": "stitch",
      "screenId": "feab4b24b62b4a8b8a67d815c82f7b29",
      "variant": "progress-ring-with-overlay-questions",
      "variantClass": "stitch-variant-progress-ring-with-overlay-questions",
      "notes": "Progress animation plus required yes/no overlay questions.",
      "density": "cinematic",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/feab4b24b62b4a8b8a67d815c82f7b29",
      "requiredElements": [
        "progress ring or equivalent generation animation",
        "status text that changes during progress",
        "overlay micro-questions that require user answer",
        "social proof or testimonial card",
        "no bottom CTA until generation flow is ready"
      ],
      "dataSlots": [
        {
          "key": "generationProgress",
          "required": true,
          "shape": "number",
          "source": "runtime animation",
          "description": "Animated progress value with deliberate slowdown near completion."
        },
        {
          "key": "microQuestions",
          "required": true,
          "shape": "array",
          "source": "generated copy",
          "description": "Required overlay questions answered by the user."
        },
        {
          "key": "testimonial",
          "required": true,
          "shape": "object",
          "source": "generated copy",
          "description": "Product/audience-appropriate social proof card."
        }
      ],
      "componentHierarchy": [],
      "pageClass": "stitch-page stitch-type-plan-generation-page stitch-variant-progress-ring-with-overlay-questions"
    },
    "plan_ready": {
      "source": "stitch",
      "screenId": "67d530df9eff459293d06975dd14bd1d",
      "variant": "animated-projection-chart",
      "variantClass": "stitch-variant-animated-projection-chart",
      "notes": "Chart uses runtime weight trajectory and target date.",
      "density": "cinematic",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/67d530df9eff459293d06975dd14bd1d",
      "requiredElements": [
        "personalized plan-ready headline",
        "target date derived from current and target weight",
        "animated prediction chart",
        "up to five chart points",
        "month/year labels when timeline crosses years",
        "bottom CTA"
      ],
      "dataSlots": [
        {
          "key": "currentWeight",
          "required": true,
          "shape": "measurement",
          "source": "answers",
          "description": "Current weight."
        },
        {
          "key": "targetWeight",
          "required": true,
          "shape": "measurement",
          "source": "answers",
          "description": "Target weight."
        },
        {
          "key": "goalDirection",
          "required": true,
          "shape": "lose | gain | maintain",
          "source": "runtime calculation",
          "description": "Controls chart direction."
        },
        {
          "key": "targetDate",
          "required": true,
          "shape": "date",
          "source": "runtime calculation",
          "description": "Calculated using 2.5kg/month pacing."
        },
        {
          "key": "chartPoints",
          "required": true,
          "shape": "array",
          "source": "runtime calculation",
          "description": "Up to five chart points with weight and month/year labels."
        }
      ],
      "visualJob": "Bridge result to paywall with a believable animated progress path.",
      "composition": "Mobile-first vertical layout, centered title, stable content area, bottom CTA when needed.",
      "componentHierarchy": [
        "Top navigation",
        "Title",
        "Subtitle",
        "Options or content",
        "CTA where required"
      ],
      "pageClass": "stitch-page stitch-type-plan-ready-page stitch-variant-animated-projection-chart"
    },
    "paywall": {
      "source": "stitch",
      "screenId": "c0f4590b9c90422d9a5eb1a2a2acd75b",
      "variant": "long-form-stacked",
      "variantClass": "stitch-variant-long-form-stacked",
      "notes": "Offers, prices, countdown, checkout, and subscription legal text are runtime/API owned.",
      "density": "sales",
      "titleTreatment": "sales",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/c0f4590b9c90422d9a5eb1a2a2acd75b",
      "requiredElements": [
        "sticky discount countdown bar",
        "body comparison module",
        "personalized plan headline",
        "selectable offer cards",
        "current price, original price, and daily price display when available",
        "selected offer state",
        "checkout CTA",
        "subscription legal text for selected offer",
        "app screenshot carousel",
        "testimonial section",
        "guarantee section",
        "legal links"
      ],
      "dataSlots": [
        {
          "key": "countdown",
          "required": true,
          "shape": "mm:ss",
          "source": "runtime timer",
          "description": "Real 10-minute discount timer."
        },
        {
          "key": "bodyComparison",
          "required": true,
          "shape": "object",
          "source": "summary assets + BMI/goal data",
          "description": "Current vs goal body comparison."
        },
        {
          "key": "offers",
          "required": true,
          "shape": "array",
          "source": "Billing resolve/offers API",
          "description": "Selectable product offers."
        },
        {
          "key": "selectedOffer",
          "required": true,
          "shape": "object",
          "source": "runtime state",
          "description": "Offer selected by the user or backend default."
        },
        {
          "key": "priceText",
          "required": true,
          "shape": "string",
          "source": "Billing API",
          "description": "Current price."
        },
        {
          "key": "originalPriceText",
          "required": false,
          "shape": "string",
          "source": "Billing API",
          "description": "Original price shown with strike-through when present."
        },
        {
          "key": "dailyPriceText",
          "required": false,
          "shape": "string",
          "source": "Billing API",
          "description": "Daily price aligned on the right when present."
        },
        {
          "key": "checkoutAction",
          "required": true,
          "shape": "action",
          "source": "Billing checkout API + Stripe",
          "description": "Opens full-screen checkout page/modal."
        },
        {
          "key": "legalText",
          "required": true,
          "shape": "string",
          "source": "Billing API or runtime offer terms",
          "description": "Subscription legal copy for selected offer."
        },
        {
          "key": "appScreenshots",
          "required": true,
          "shape": "image[]",
          "source": "App Store assets",
          "description": "Companion app screenshot carousel."
        },
        {
          "key": "testimonials",
          "required": true,
          "shape": "array",
          "source": "generated copy",
          "description": "Audience-appropriate testimonials."
        }
      ],
      "visualJob": "Convert with personalized proof, offer selection, checkout, and reassurance.",
      "composition": "Vertical sales page with sticky countdown, comparison, offers, proof, FAQ, and full-screen checkout route.",
      "componentHierarchy": [
        "Sticky countdown",
        "Result comparison",
        "Offer list",
        "Primary CTA",
        "Proof sections",
        "FAQ",
        "Legal links"
      ],
      "pageClass": "stitch-page stitch-type-paywall-page stitch-variant-long-form-stacked"
    },
    "payment_success": {
      "source": "stitch",
      "screenId": "b547d7a33689483cac615dc0a8dc3939",
      "variant": "flat-success-confirmation",
      "variantClass": "stitch-variant-flat-success-confirmation",
      "notes": "Minimal success state before account creation.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/b547d7a33689483cac615dc0a8dc3939",
      "requiredElements": [
        "payment confirmation headline",
        "next-step CTA",
        "safe transition into account creation"
      ],
      "dataSlots": [
        {
          "key": "paymentOrderId",
          "required": false,
          "shape": "string | number",
          "source": "Billing API",
          "description": "Payment order id when available."
        },
        {
          "key": "displayMessage",
          "required": false,
          "shape": "string",
          "source": "Billing API",
          "description": "Payment success display message."
        }
      ],
      "componentHierarchy": [],
      "pageClass": "stitch-page stitch-type-payment-success-page stitch-variant-flat-success-confirmation"
    },
    "account_create": {
      "source": "stitch",
      "screenId": "9ade5119a2414eca83e276ed9ff5584a",
      "variant": "flat-auth-form",
      "variantClass": "stitch-variant-flat-auth-form",
      "notes": "Registration only after payment.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/9ade5119a2414eca83e276ed9ff5584a",
      "requiredElements": [
        "post-payment account creation headline",
        "email field",
        "password field",
        "create account CTA",
        "no login CTA on this post-payment screen"
      ],
      "dataSlots": [
        {
          "key": "email",
          "required": true,
          "shape": "string",
          "source": "auth form",
          "description": "Account email."
        },
        {
          "key": "password",
          "required": true,
          "shape": "string",
          "source": "auth form",
          "description": "Account password."
        },
        {
          "key": "createAccountAction",
          "required": true,
          "shape": "action",
          "source": "Firebase/Auth backend",
          "description": "Creates account after payment."
        }
      ],
      "componentHierarchy": [],
      "pageClass": "stitch-page stitch-type-account-create-page stitch-variant-flat-auth-form"
    },
    "login": {
      "source": "stitch",
      "screenId": "af0bdb3c4aeb489693746334ca23823d",
      "variant": "flat-auth-form",
      "variantClass": "stitch-variant-flat-auth-form",
      "notes": "Returning-user login from entry page.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/af0bdb3c4aeb489693746334ca23823d",
      "requiredElements": [
        "returning-user login headline",
        "email field",
        "password field",
        "forgot password link",
        "login CTA",
        "create account link that starts OB instead of opening post-payment account creation"
      ],
      "dataSlots": [
        {
          "key": "email",
          "required": true,
          "shape": "string",
          "source": "auth form",
          "description": "Login email."
        },
        {
          "key": "password",
          "required": true,
          "shape": "string",
          "source": "auth form",
          "description": "Login password."
        },
        {
          "key": "loginAction",
          "required": true,
          "shape": "action",
          "source": "Firebase/Auth backend",
          "description": "Logs returning user in."
        }
      ],
      "componentHierarchy": [],
      "pageClass": "stitch-page stitch-type-login-page stitch-variant-flat-auth-form"
    },
    "profile": {
      "source": "stitch",
      "screenId": "86f8f15e993c4820811ae4f840ef9f03",
      "variant": "flat-subscription-summary",
      "variantClass": "stitch-variant-flat-subscription-summary",
      "notes": "Profile and subscription management.",
      "density": "quiet",
      "titleTreatment": "balanced",
      "surfaceTreatment": "flat-white-tonal-layers",
      "backgroundTreatment": "soft-neutral-athletic",
      "buttonTreatment": "full-width-rounded-primary",
      "navTreatment": "compact-section-segmented",
      "progressTreatment": "segmented-bars",
      "avoidNestedCards": true,
      "screenResource": "projects/5160287003229724876/screens/86f8f15e993c4820811ae4f840ef9f03",
      "requiredElements": [
        "profile title",
        "user ID as small secondary text",
        "email row",
        "subscription status row",
        "current period end or valid-until row when available",
        "plan/product summary when available",
        "cancel subscription action",
        "logout action"
      ],
      "dataSlots": [
        {
          "key": "uid",
          "required": true,
          "shape": "string",
          "source": "auth/session",
          "description": "Displayed as small ID under profile title."
        },
        {
          "key": "email",
          "required": false,
          "shape": "string",
          "source": "auth/profile API",
          "description": "User email."
        },
        {
          "key": "subscriptionStatus",
          "required": true,
          "shape": "string",
          "source": "subscription API",
          "description": "Current subscription status."
        },
        {
          "key": "validUntil",
          "required": false,
          "shape": "date",
          "source": "subscription API",
          "description": "Current period end or subscription valid-until date."
        },
        {
          "key": "planName",
          "required": false,
          "shape": "string",
          "source": "subscription API",
          "description": "Human-readable current plan when available."
        },
        {
          "key": "cancelSubscriptionAction",
          "required": true,
          "shape": "action",
          "source": "Billing API",
          "description": "Cancels subscription."
        }
      ],
      "componentHierarchy": [],
      "pageClass": "stitch-page stitch-type-account-page stitch-variant-flat-subscription-summary"
    }
  }
} as PageVisualMap;

export const iconMap = {
  "version": "template",
  "library": "lucide-react",
  "optionIcons": {
    "focus_areas.main_goal": "Target",
    "focus_areas.daily_routine": "CalendarDays",
    "focus_areas.motivation": "Zap"
  },
  "uiIcons": {
    "back": "ArrowLeft",
    "logout": "LogOut",
    "passwordVisible": "Eye",
    "passwordHidden": "EyeOff",
    "subscription": "ShieldCheck",
    "heightExplainer": "Ruler"
  }
} as IconMap;

export const assetsManifest = {
  "version": "1.0.0",
  "productId": "workout-for-women-lose-weight",
  "productName": "Workout for Women -Lose Weight",
  "mode": "generated",
  "sourcePlan": "outputs/assets/image-plan.json",
  "generatedAt": "2026-06-24T07:04:34.053Z",
  "largeImageOnly": true,
  "assets": {
    "entry.hero": {
      "id": "entry.hero",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "generate",
      "type": "page_hero",
      "kind": "entry_hero",
      "pageId": "entry",
      "slot": "entry.hero",
      "prompt": "Create one premium hero image for a home fitness web funnel. Show one adult woman doing guided home fitness movement in a bright minimal home or studio setting. Confident, approachable, no text, no logos, no app UI.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Full-bleed portal hero for the first page..\nRuntime usage: EntryPage hero background..\nAspect ratio: 16:9.\nBackground policy: Photoreal lifestyle background, no transparency needed..\nStyle consistency: Premium editorial home fitness photography, trustworthy and approachable..\nNegative prompt: No words, logos, devices, UI screens, weapons, camouflage uniform, injuries, dark gritty scene, or crowded gym..\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight entry image",
      "localPath": "outputs/assets/images/entry-hero.png",
      "usage": "EntryPage hero background.",
      "scene": "Full-bleed portal hero for the first page.",
      "userMoment": "Create one premium hero image for a home fitness web funnel. Show one adult woman doing guided home fitness movement in a bright minimal home or studio setting. Confident, approachable, no text, no logos, no app UI.",
      "emotionalJob": "Full-bleed portal hero for the first page.",
      "visualJob": "EntryPage hero background.",
      "composition": "16:9; Photoreal lifestyle background, no transparency needed.; Premium editorial home fitness photography, trustworthy and approachable.",
      "negativePrompt": "No words, logos, devices, UI screens, weapons, camouflage uniform, injuries, dark gritty scene, or crowded gym.",
      "aspectRatio": "16:9",
      "backgroundPolicy": "Photoreal lifestyle background, no transparency needed.",
      "styleConsistency": "Premium editorial home fitness photography, trustworthy and approachable.",
      "sourceSlotId": "entry.hero",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:06:08.246Z",
      "generationId": "1782284701-1782284768194",
      "sourceGeneratedPath": "outputs/assets/images/entry-hero.png",
      "src": "/assets/images/entry-hero.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/generations"
    },
    "age_group.18_25": {
      "id": "age_group.18_25",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "generate",
      "referenceAssetIds": [],
      "referenceLocalPaths": [],
      "type": "option_image",
      "kind": "age_group_option_set",
      "pageId": "age_group",
      "slot": "age_group.options",
      "optionValue": "18_25",
      "label": "Age: 18-25",
      "prompt": "Create exactly one age-group option image for Age: 18-25. This is one standalone option asset from a larger set, not the whole set. Show exactly one person only. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Asian adult woman, age 18-25, half-body, product-relevant, confident, tasteful movement-friendly clothes.\nDifferentiation requirement: youngest bracket; visibly early adult energy without looking underage for 18-25.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Four option images for age-group selection..\nRuntime usage: age_group option cards..\nAspect ratio: 4:3.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images..\nStyle consistency: Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences..\nNegative prompt: No full scenes, no text, no numbers, no labels, no duplicated face across age groups, no childlike appearance, no sexualized pose, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Age: 18-25 visual",
      "localPath": "outputs/assets/images/age_group-18_25.png",
      "usage": "age_group option cards.",
      "scene": "Four option images for age-group selection.",
      "userMoment": "Asian adult woman, age 18-25, half-body, product-relevant, confident, tasteful movement-friendly clothes.",
      "emotionalJob": "Four option images for age-group selection.",
      "visualJob": "youngest bracket; visibly early adult energy without looking underage for 18-25.",
      "composition": "4:3; Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images.; Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences.",
      "negativePrompt": "No full scenes, no text, no numbers, no labels, no duplicated face across age groups, no childlike appearance, no sexualized pose, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
      "aspectRatio": "4:3",
      "backgroundPolicy": "Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images.",
      "backgroundKind": "light",
      "styleConsistency": "Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences.",
      "sourceSlotId": "age_group.options",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:07:06.823Z",
      "generationId": "1782284769-1782284825366",
      "sourceGeneratedPath": "outputs/assets/images/age_group-18_25.png",
      "src": "/assets/images/age_group-18_25.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/generations"
    },
    "age_group.26_35": {
      "id": "age_group.26_35",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "generate",
      "referenceAssetIds": [],
      "referenceLocalPaths": [],
      "type": "option_image",
      "kind": "age_group_option_set",
      "pageId": "age_group",
      "slot": "age_group.options",
      "optionValue": "26_35",
      "label": "Age: 26-35",
      "prompt": "Create exactly one age-group option image for Age: 26-35. This is one standalone option asset from a larger set, not the whole set. Show exactly one person only. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Black adult woman, age 26-35, half-body, product-relevant, confident, tasteful movement-friendly clothes.\nDifferentiation requirement: second bracket; adult styling distinct from the youngest group for 26-35.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Four option images for age-group selection..\nRuntime usage: age_group option cards..\nAspect ratio: 4:3.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images..\nStyle consistency: Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences..\nNegative prompt: No full scenes, no text, no numbers, no labels, no duplicated face across age groups, no childlike appearance, no sexualized pose, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Age: 26-35 visual",
      "localPath": "outputs/assets/images/age_group-26_35.png",
      "usage": "age_group option cards.",
      "scene": "Four option images for age-group selection.",
      "userMoment": "Black adult woman, age 26-35, half-body, product-relevant, confident, tasteful movement-friendly clothes.",
      "emotionalJob": "Four option images for age-group selection.",
      "visualJob": "second bracket; adult styling distinct from the youngest group for 26-35.",
      "composition": "4:3; Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images.; Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences.",
      "negativePrompt": "No full scenes, no text, no numbers, no labels, no duplicated face across age groups, no childlike appearance, no sexualized pose, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
      "aspectRatio": "4:3",
      "backgroundPolicy": "Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images.",
      "backgroundKind": "light",
      "styleConsistency": "Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences.",
      "sourceSlotId": "age_group.options",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:08:09.043Z",
      "generationId": "1782284827-1782284887735",
      "sourceGeneratedPath": "outputs/assets/images/age_group-26_35.png",
      "src": "/assets/images/age_group-26_35.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/generations"
    },
    "age_group.36_45": {
      "id": "age_group.36_45",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "generate",
      "referenceAssetIds": [],
      "referenceLocalPaths": [],
      "type": "option_image",
      "kind": "age_group_option_set",
      "pageId": "age_group",
      "slot": "age_group.options",
      "optionValue": "36_45",
      "label": "Age: 36-45",
      "prompt": "Create exactly one age-group option image for Age: 36-45. This is one standalone option asset from a larger set, not the whole set. Show exactly one person only. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: White adult woman, age 36-45, half-body, product-relevant, confident, tasteful movement-friendly clothes.\nDifferentiation requirement: third bracket; mature adult styling with visible age difference for 36-45.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Four option images for age-group selection..\nRuntime usage: age_group option cards..\nAspect ratio: 4:3.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images..\nStyle consistency: Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences..\nNegative prompt: No full scenes, no text, no numbers, no labels, no duplicated face across age groups, no childlike appearance, no sexualized pose, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Age: 36-45 visual",
      "localPath": "outputs/assets/images/age_group-36_45.png",
      "usage": "age_group option cards.",
      "scene": "Four option images for age-group selection.",
      "userMoment": "White adult woman, age 36-45, half-body, product-relevant, confident, tasteful movement-friendly clothes.",
      "emotionalJob": "Four option images for age-group selection.",
      "visualJob": "third bracket; mature adult styling with visible age difference for 36-45.",
      "composition": "4:3; Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images.; Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences.",
      "negativePrompt": "No full scenes, no text, no numbers, no labels, no duplicated face across age groups, no childlike appearance, no sexualized pose, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
      "aspectRatio": "4:3",
      "backgroundPolicy": "Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images.",
      "backgroundKind": "light",
      "styleConsistency": "Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences.",
      "sourceSlotId": "age_group.options",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:09:08.250Z",
      "generationId": "1782284889-1782284946783",
      "sourceGeneratedPath": "outputs/assets/images/age_group-36_45.png",
      "src": "/assets/images/age_group-36_45.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/generations"
    },
    "age_group.46_plus": {
      "id": "age_group.46_plus",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "generate",
      "referenceAssetIds": [],
      "referenceLocalPaths": [],
      "type": "option_image",
      "kind": "age_group_option_set",
      "pageId": "age_group",
      "slot": "age_group.options",
      "optionValue": "46_plus",
      "label": "Age: 46+",
      "prompt": "Create exactly one age-group option image for Age: 46+. This is one standalone option asset from a larger set, not the whole set. Show exactly one person only. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Latino or mixed-race adult woman, age 46+, half-body, product-relevant, confident, tasteful movement-friendly clothes.\nDifferentiation requirement: oldest bracket; clearly older appearance while still capable and confident for 46+.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Four option images for age-group selection..\nRuntime usage: age_group option cards..\nAspect ratio: 4:3.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images..\nStyle consistency: Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences..\nNegative prompt: No full scenes, no text, no numbers, no labels, no duplicated face across age groups, no childlike appearance, no sexualized pose, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Age: 46+ visual",
      "localPath": "outputs/assets/images/age_group-46_plus.png",
      "usage": "age_group option cards.",
      "scene": "Four option images for age-group selection.",
      "userMoment": "Latino or mixed-race adult woman, age 46+, half-body, product-relevant, confident, tasteful movement-friendly clothes.",
      "emotionalJob": "Four option images for age-group selection.",
      "visualJob": "oldest bracket; clearly older appearance while still capable and confident for 46+.",
      "composition": "4:3; Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images.; Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences.",
      "negativePrompt": "No full scenes, no text, no numbers, no labels, no duplicated face across age groups, no childlike appearance, no sexualized pose, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
      "aspectRatio": "4:3",
      "backgroundPolicy": "Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images.",
      "backgroundKind": "light",
      "styleConsistency": "Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences.",
      "sourceSlotId": "age_group.options",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:10:02.100Z",
      "generationId": "1782284949-1782285001780",
      "sourceGeneratedPath": "outputs/assets/images/age_group-46_plus.png",
      "src": "/assets/images/age_group-46_plus.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/generations"
    },
    "fitness_goal_trust_bridge.hero": {
      "id": "fitness_goal_trust_bridge.hero",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "generate",
      "type": "page_hero",
      "kind": "intro_hero",
      "pageId": "fitness_goal_trust_bridge",
      "slot": "fitness_goal_trust_bridge.hero",
      "prompt": "Create a 4:3 premium home fitness image for an intro page titled \"Your goal gives the plan direction\". Show one adult woman in a clean modern home or studio context doing or preparing for guided home fitness movement. The image should support this message: A strong plan is not just harder exercises. It needs the right starting point, the right schedule, and a progression you can keep repeating.. No text, no logos, no app UI.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Large contextual image for an intro or transition page..\nRuntime usage: fitness_goal_trust_bridge IntroPage hero image..\nAspect ratio: 4:3.\nBackground policy: Natural light training scene; no transparent requirement..\nStyle consistency: Same premium home fitness campaign style across intro images..\nNegative prompt: No words, logos, phones, screenshots, weapons, camouflage, injuries, or crowded gym..\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight fitness_goal_trust_bridge image",
      "localPath": "outputs/assets/images/fitness_goal_trust_bridge-hero.png",
      "usage": "fitness_goal_trust_bridge IntroPage hero image.",
      "scene": "Large contextual image for an intro or transition page.",
      "userMoment": "Create a 4:3 premium home fitness image for an intro page titled \"Your goal gives the plan direction\". Show one adult woman in a clean modern home or studio context doing or preparing for guided home fitness movement. The image should support this message: A strong plan is not just harder exercises. It needs the right starting point, the right schedule, and a progression you can keep repeating.. No text, no logos, no app UI.",
      "emotionalJob": "Large contextual image for an intro or transition page.",
      "visualJob": "fitness_goal_trust_bridge IntroPage hero image.",
      "composition": "4:3; Natural light training scene; no transparent requirement.; Same premium home fitness campaign style across intro images.",
      "negativePrompt": "No words, logos, phones, screenshots, weapons, camouflage, injuries, or crowded gym.",
      "aspectRatio": "4:3",
      "backgroundPolicy": "Natural light training scene; no transparent requirement.",
      "styleConsistency": "Same premium home fitness campaign style across intro images.",
      "sourceSlotId": "fitness_goal_trust_bridge.hero",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:11:12.036Z",
      "generationId": "1782285004-1782285071994",
      "sourceGeneratedPath": "outputs/assets/images/fitness_goal_trust_bridge-hero.png",
      "src": "/assets/images/fitness_goal_trust_bridge-hero.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/generations"
    },
    "fitness_routine_trust_bridge.hero": {
      "id": "fitness_routine_trust_bridge.hero",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "generate",
      "type": "page_hero",
      "kind": "intro_hero",
      "pageId": "fitness_routine_trust_bridge",
      "slot": "fitness_routine_trust_bridge.hero",
      "prompt": "Create a 4:3 premium home fitness image for an intro page titled \"Your routine should fit your real week\". Show one adult woman in a clean modern home or studio context doing or preparing for guided home fitness movement. The image should support this message: Most people stop because the training plan asks for a version of their week that does not exist. We will use your schedule to shape a home fitness plan that feels easier to repeat.. No text, no logos, no app UI.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Large contextual image for an intro or transition page..\nRuntime usage: fitness_routine_trust_bridge IntroPage hero image..\nAspect ratio: 4:3.\nBackground policy: Natural light training scene; no transparent requirement..\nStyle consistency: Same premium home fitness campaign style across intro images..\nNegative prompt: No words, logos, phones, screenshots, weapons, camouflage, injuries, or crowded gym..\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight fitness_routine_trust_bridge image",
      "localPath": "outputs/assets/images/fitness_routine_trust_bridge-hero.png",
      "usage": "fitness_routine_trust_bridge IntroPage hero image.",
      "scene": "Large contextual image for an intro or transition page.",
      "userMoment": "Create a 4:3 premium home fitness image for an intro page titled \"Your routine should fit your real week\". Show one adult woman in a clean modern home or studio context doing or preparing for guided home fitness movement. The image should support this message: Most people stop because the training plan asks for a version of their week that does not exist. We will use your schedule to shape a home fitness plan that feels easier to repeat.. No text, no logos, no app UI.",
      "emotionalJob": "Large contextual image for an intro or transition page.",
      "visualJob": "fitness_routine_trust_bridge IntroPage hero image.",
      "composition": "4:3; Natural light training scene; no transparent requirement.; Same premium home fitness campaign style across intro images.",
      "negativePrompt": "No words, logos, phones, screenshots, weapons, camouflage, injuries, or crowded gym.",
      "aspectRatio": "4:3",
      "backgroundPolicy": "Natural light training scene; no transparent requirement.",
      "styleConsistency": "Same premium home fitness campaign style across intro images.",
      "sourceSlotId": "fitness_routine_trust_bridge.hero",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:12:20.379Z",
      "generationId": "1782285072-1782285140254",
      "sourceGeneratedPath": "outputs/assets/images/fitness_routine_trust_bridge-hero.png",
      "src": "/assets/images/fitness_routine_trust_bridge-hero.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/generations"
    },
    "summary.body.normal": {
      "id": "summary.body.normal",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "generate",
      "referenceAssetIds": [],
      "referenceLocalPaths": [],
      "type": "supporting_image",
      "kind": "summary_body_set",
      "pageId": "summary",
      "slot": "summary.body_set",
      "optionValue": "normal",
      "label": "Normal",
      "prompt": "Create exactly one normal body-state base image for a summary page. This is one standalone body-state asset, not the whole set. Show exactly one person only. Use a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Base image: healthy normal body composition, 3/4 body crop.\nDifferentiation requirement: Neutral body composition, same face and outfit as the whole set.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Normal visual",
      "localPath": "outputs/assets/images/summary-body-normal.png",
      "usage": "Summary body visual and paywall Now/Goal comparison.",
      "scene": "Body profile visual for summary and paywall before/after comparison.",
      "userMoment": "Base image: healthy normal body composition, 3/4 body crop.",
      "emotionalJob": "Body profile visual for summary and paywall before/after comparison.",
      "visualJob": "Neutral body composition, same face and outfit as the whole set.",
      "composition": "3:4; Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.; Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "negativePrompt": "No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
      "aspectRatio": "3:4",
      "backgroundPolicy": "Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.",
      "backgroundKind": "light",
      "styleConsistency": "Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "sourceSlotId": "summary.body_set",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:13:18.611Z",
      "generationId": "1782285141-1782285198219",
      "sourceGeneratedPath": "outputs/assets/images/summary-body-normal.png",
      "src": "/assets/images/summary-body-normal.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/generations"
    },
    "paywall.summary.body.normal": {
      "id": "paywall.summary.body.normal",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "generate",
      "referenceAssetIds": [],
      "referenceLocalPaths": [],
      "type": "supporting_image",
      "kind": "summary_body_set",
      "pageId": "paywall",
      "slot": "summary.body_set",
      "optionValue": "normal",
      "label": "Normal",
      "prompt": "Create exactly one normal body-state base image for a summary page. This is one standalone body-state asset, not the whole set. Show exactly one person only. Use a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Base image: healthy normal body composition, 3/4 body crop.\nDifferentiation requirement: Neutral body composition, same face and outfit as the whole set.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Normal visual",
      "localPath": "outputs/assets/images/summary-body-normal.png",
      "usage": "Summary body visual and paywall Now/Goal comparison.",
      "scene": "Body profile visual for summary and paywall before/after comparison.",
      "userMoment": "Base image: healthy normal body composition, 3/4 body crop.",
      "emotionalJob": "Body profile visual for summary and paywall before/after comparison.",
      "visualJob": "Neutral body composition, same face and outfit as the whole set.",
      "composition": "3:4; Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.; Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "negativePrompt": "No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
      "aspectRatio": "3:4",
      "backgroundPolicy": "Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.",
      "backgroundKind": "light",
      "styleConsistency": "Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "sourceSlotId": "summary.body_set",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:13:18.611Z",
      "generationId": "1782285141-1782285198219",
      "sourceGeneratedPath": "outputs/assets/images/summary-body-normal.png",
      "src": "/assets/images/summary-body-normal.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/generations"
    },
    "summary.body.underweight": {
      "id": "summary.body.underweight",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "edit",
      "referenceAssetIds": [
        "summary.body.normal"
      ],
      "referenceLocalPaths": [
        "outputs/assets/images/summary-body-normal.png"
      ],
      "type": "supporting_image",
      "kind": "summary_body_set",
      "pageId": "summary",
      "slot": "summary.body_set",
      "optionValue": "underweight",
      "label": "Underweight",
      "prompt": "Create exactly one underweight body-state image as an edit from the provided reference image. This is one standalone body-state asset, not the whole set. Show exactly one person only. Preserve a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Edit same person to underweight body composition, same face and outfit.\nDifferentiation requirement: Underweight body composition without shame framing.\nEdit reference requirement: Use Normal as the identity reference. Preserve the same face, hairstyle, expression, pose family, crop, outfit direction, lighting, and camera angle. Only adjust the body-state to Underweight.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Underweight visual",
      "localPath": "outputs/assets/images/summary-body-underweight.png",
      "usage": "Summary body visual and paywall Now/Goal comparison.",
      "scene": "Body profile visual for summary and paywall before/after comparison.",
      "userMoment": "Edit same person to underweight body composition, same face and outfit.",
      "emotionalJob": "Body profile visual for summary and paywall before/after comparison.",
      "visualJob": "Underweight body composition without shame framing.",
      "composition": "3:4; Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.; Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "negativePrompt": "No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
      "aspectRatio": "3:4",
      "backgroundPolicy": "Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.",
      "backgroundKind": "light",
      "styleConsistency": "Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "sourceSlotId": "summary.body_set",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:14:26.157Z",
      "generationId": "1782285201-1782285264902",
      "sourceGeneratedPath": "outputs/assets/images/summary-body-underweight.png",
      "src": "/assets/images/summary-body-underweight.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/edits"
    },
    "paywall.summary.body.underweight": {
      "id": "paywall.summary.body.underweight",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "edit",
      "referenceAssetIds": [
        "summary.body.normal"
      ],
      "referenceLocalPaths": [
        "outputs/assets/images/summary-body-normal.png"
      ],
      "type": "supporting_image",
      "kind": "summary_body_set",
      "pageId": "paywall",
      "slot": "summary.body_set",
      "optionValue": "underweight",
      "label": "Underweight",
      "prompt": "Create exactly one underweight body-state image as an edit from the provided reference image. This is one standalone body-state asset, not the whole set. Show exactly one person only. Preserve a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Edit same person to underweight body composition, same face and outfit.\nDifferentiation requirement: Underweight body composition without shame framing.\nEdit reference requirement: Use Normal as the identity reference. Preserve the same face, hairstyle, expression, pose family, crop, outfit direction, lighting, and camera angle. Only adjust the body-state to Underweight.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Underweight visual",
      "localPath": "outputs/assets/images/summary-body-underweight.png",
      "usage": "Summary body visual and paywall Now/Goal comparison.",
      "scene": "Body profile visual for summary and paywall before/after comparison.",
      "userMoment": "Edit same person to underweight body composition, same face and outfit.",
      "emotionalJob": "Body profile visual for summary and paywall before/after comparison.",
      "visualJob": "Underweight body composition without shame framing.",
      "composition": "3:4; Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.; Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "negativePrompt": "No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
      "aspectRatio": "3:4",
      "backgroundPolicy": "Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.",
      "backgroundKind": "light",
      "styleConsistency": "Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "sourceSlotId": "summary.body_set",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:14:26.157Z",
      "generationId": "1782285201-1782285264902",
      "sourceGeneratedPath": "outputs/assets/images/summary-body-underweight.png",
      "src": "/assets/images/summary-body-underweight.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/edits"
    },
    "summary.body.overweight": {
      "id": "summary.body.overweight",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "edit",
      "referenceAssetIds": [
        "summary.body.normal"
      ],
      "referenceLocalPaths": [
        "outputs/assets/images/summary-body-normal.png"
      ],
      "type": "supporting_image",
      "kind": "summary_body_set",
      "pageId": "summary",
      "slot": "summary.body_set",
      "optionValue": "overweight",
      "label": "Overweight",
      "prompt": "Create exactly one overweight body-state image as an edit from the provided reference image. This is one standalone body-state asset, not the whole set. Show exactly one person only. Preserve a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Edit same person to overweight body composition, same face and outfit.\nDifferentiation requirement: Overweight body composition without changing face or clothing direction.\nEdit reference requirement: Use Normal as the identity reference. Preserve the same face, hairstyle, expression, pose family, crop, outfit direction, lighting, and camera angle. Only adjust the body-state to Overweight.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Overweight visual",
      "localPath": "outputs/assets/images/summary-body-overweight.png",
      "usage": "Summary body visual and paywall Now/Goal comparison.",
      "scene": "Body profile visual for summary and paywall before/after comparison.",
      "userMoment": "Edit same person to overweight body composition, same face and outfit.",
      "emotionalJob": "Body profile visual for summary and paywall before/after comparison.",
      "visualJob": "Overweight body composition without changing face or clothing direction.",
      "composition": "3:4; Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.; Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "negativePrompt": "No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
      "aspectRatio": "3:4",
      "backgroundPolicy": "Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.",
      "backgroundKind": "light",
      "styleConsistency": "Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "sourceSlotId": "summary.body_set",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:15:42.717Z",
      "generationId": "1782285269-1782285341511",
      "sourceGeneratedPath": "outputs/assets/images/summary-body-overweight.png",
      "src": "/assets/images/summary-body-overweight.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/edits"
    },
    "paywall.summary.body.overweight": {
      "id": "paywall.summary.body.overweight",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "edit",
      "referenceAssetIds": [
        "summary.body.normal"
      ],
      "referenceLocalPaths": [
        "outputs/assets/images/summary-body-normal.png"
      ],
      "type": "supporting_image",
      "kind": "summary_body_set",
      "pageId": "paywall",
      "slot": "summary.body_set",
      "optionValue": "overweight",
      "label": "Overweight",
      "prompt": "Create exactly one overweight body-state image as an edit from the provided reference image. This is one standalone body-state asset, not the whole set. Show exactly one person only. Preserve a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Edit same person to overweight body composition, same face and outfit.\nDifferentiation requirement: Overweight body composition without changing face or clothing direction.\nEdit reference requirement: Use Normal as the identity reference. Preserve the same face, hairstyle, expression, pose family, crop, outfit direction, lighting, and camera angle. Only adjust the body-state to Overweight.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Overweight visual",
      "localPath": "outputs/assets/images/summary-body-overweight.png",
      "usage": "Summary body visual and paywall Now/Goal comparison.",
      "scene": "Body profile visual for summary and paywall before/after comparison.",
      "userMoment": "Edit same person to overweight body composition, same face and outfit.",
      "emotionalJob": "Body profile visual for summary and paywall before/after comparison.",
      "visualJob": "Overweight body composition without changing face or clothing direction.",
      "composition": "3:4; Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.; Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "negativePrompt": "No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
      "aspectRatio": "3:4",
      "backgroundPolicy": "Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.",
      "backgroundKind": "light",
      "styleConsistency": "Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "sourceSlotId": "summary.body_set",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:15:42.717Z",
      "generationId": "1782285269-1782285341511",
      "sourceGeneratedPath": "outputs/assets/images/summary-body-overweight.png",
      "src": "/assets/images/summary-body-overweight.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/edits"
    },
    "summary.body.obese": {
      "id": "summary.body.obese",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "edit",
      "referenceAssetIds": [
        "summary.body.normal"
      ],
      "referenceLocalPaths": [
        "outputs/assets/images/summary-body-normal.png"
      ],
      "type": "supporting_image",
      "kind": "summary_body_set",
      "pageId": "summary",
      "slot": "summary.body_set",
      "optionValue": "obese",
      "label": "Obese",
      "prompt": "Create exactly one obese body-state image as an edit from the provided reference image. This is one standalone body-state asset, not the whole set. Show exactly one person only. Preserve a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Edit same person to obese body composition, same face and outfit.\nDifferentiation requirement: Obese body composition without changing face or clothing direction.\nEdit reference requirement: Use Normal as the identity reference. Preserve the same face, hairstyle, expression, pose family, crop, outfit direction, lighting, and camera angle. Only adjust the body-state to Obese.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Obese visual",
      "localPath": "outputs/assets/images/summary-body-obese.png",
      "usage": "Summary body visual and paywall Now/Goal comparison.",
      "scene": "Body profile visual for summary and paywall before/after comparison.",
      "userMoment": "Edit same person to obese body composition, same face and outfit.",
      "emotionalJob": "Body profile visual for summary and paywall before/after comparison.",
      "visualJob": "Obese body composition without changing face or clothing direction.",
      "composition": "3:4; Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.; Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "negativePrompt": "No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
      "aspectRatio": "3:4",
      "backgroundPolicy": "Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.",
      "backgroundKind": "light",
      "styleConsistency": "Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "sourceSlotId": "summary.body_set",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:16:54.134Z",
      "generationId": "1782285345-1782285413057",
      "sourceGeneratedPath": "outputs/assets/images/summary-body-obese.png",
      "src": "/assets/images/summary-body-obese.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/edits"
    },
    "paywall.summary.body.obese": {
      "id": "paywall.summary.body.obese",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "edit",
      "referenceAssetIds": [
        "summary.body.normal"
      ],
      "referenceLocalPaths": [
        "outputs/assets/images/summary-body-normal.png"
      ],
      "type": "supporting_image",
      "kind": "summary_body_set",
      "pageId": "paywall",
      "slot": "summary.body_set",
      "optionValue": "obese",
      "label": "Obese",
      "prompt": "Create exactly one obese body-state image as an edit from the provided reference image. This is one standalone body-state asset, not the whole set. Show exactly one person only. Preserve a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Edit same person to obese body composition, same face and outfit.\nDifferentiation requirement: Obese body composition without changing face or clothing direction.\nEdit reference requirement: Use Normal as the identity reference. Preserve the same face, hairstyle, expression, pose family, crop, outfit direction, lighting, and camera angle. Only adjust the body-state to Obese.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: The product is a home fitness funnel for women who want an approachable plan for fitness, body confidence, and consistency. The visual system uses a calm primary color with warm off-white surfaces so the funnel feels guided rather than generic..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Obese visual",
      "localPath": "outputs/assets/images/summary-body-obese.png",
      "usage": "Summary body visual and paywall Now/Goal comparison.",
      "scene": "Body profile visual for summary and paywall before/after comparison.",
      "userMoment": "Edit same person to obese body composition, same face and outfit.",
      "emotionalJob": "Body profile visual for summary and paywall before/after comparison.",
      "visualJob": "Obese body composition without changing face or clothing direction.",
      "composition": "3:4; Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.; Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "negativePrompt": "No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop",
      "aspectRatio": "3:4",
      "backgroundPolicy": "Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images.",
      "backgroundKind": "light",
      "styleConsistency": "Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese.",
      "sourceSlotId": "summary.body_set",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-24T07:16:54.134Z",
      "generationId": "1782285345-1782285413057",
      "sourceGeneratedPath": "outputs/assets/images/summary-body-obese.png",
      "src": "/assets/images/summary-body-obese.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/edits"
    },
    "paywall.result_comparison": {
      "id": "paywall.result_comparison",
      "source": "provided",
      "status": "ready",
      "type": "supporting_image",
      "kind": "paywall_result_comparison",
      "pageId": "paywall",
      "slot": "paywall.result_comparison",
      "dependsOn": [
        "summary.body.overweight",
        "summary.body.normal"
      ],
      "prompt": "Reuse current and target body-state images from summary.body_set.",
      "alt": "Workout for Women -Lose Weight paywall result comparison reused from summary visuals",
      "usage": "Paywall Now/Goal comparison block.",
      "scene": "Reuse two summary body images for Now and Goal comparison.",
      "userMoment": "After the user reaches the paywall, the page reuses summary result assets to preserve continuity.",
      "emotionalJob": "Reuse two summary body images for Now and Goal comparison.",
      "visualJob": "Reuse two summary body visuals for now-versus-goal comparison.",
      "composition": "3:4; Reuse generated summary body images.; Same visual identity as summary body image set.",
      "negativePrompt": "Do not generate a new image for this slot.",
      "aspectRatio": "3:4",
      "backgroundPolicy": "Reuse generated summary body images.",
      "styleConsistency": "Same visual identity as summary body image set.",
      "sourceSlotId": "paywall.result_comparison"
    },
    "paywall.app_screenshots.1": {
      "id": "paywall.app_screenshots.1",
      "source": "app_store",
      "status": "ready",
      "type": "supporting_image",
      "kind": "paywall_app_screenshot_set",
      "pageId": "paywall",
      "slot": "paywall.app_screenshots",
      "prompt": "Download the real App Store screenshots for Workout for Women -Lose Weight when available.",
      "alt": "Workout for Women -Lose Weight App Store screenshot 1",
      "localPath": "outputs/assets/images/paywall-app_screenshots-1.jpg",
      "src": "/assets/images/paywall-app_screenshots-1.jpg",
      "appStoreUrl": "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/44/49/73/444973dc-dbe8-c99b-6501-e9a8147228d4/839285684_OOG104_Style_A-Light_en-US_APP_IPAD_PRO_129_OOG104_Style_A-Light_en-US_ipad_01.jpg/576x768bb.jpg",
      "usage": "Paywall app screenshot carousel.",
      "scene": "Companion app screenshot carousel inside paywall.",
      "userMoment": "The user is evaluating what the companion app includes after purchase.",
      "emotionalJob": "Companion app screenshot carousel inside paywall.",
      "visualJob": "Show real product value with an App Store screenshot.",
      "composition": "9:19.5; Use real App Store screenshots.; Use source screenshots from the target App Store listing.",
      "negativePrompt": "Do not use AI generation for real app screenshots by default.",
      "aspectRatio": "9:19.5",
      "backgroundPolicy": "Use real App Store screenshots.",
      "styleConsistency": "Use source screenshots from the target App Store listing.",
      "sourceSlotId": "paywall.app_screenshots"
    },
    "paywall.app_screenshots.2": {
      "id": "paywall.app_screenshots.2",
      "source": "app_store",
      "status": "ready",
      "type": "supporting_image",
      "kind": "paywall_app_screenshot_set",
      "pageId": "paywall",
      "slot": "paywall.app_screenshots",
      "prompt": "Download the real App Store screenshots for Workout for Women -Lose Weight when available.",
      "alt": "Workout for Women -Lose Weight App Store screenshot 2",
      "localPath": "outputs/assets/images/paywall-app_screenshots-2.jpg",
      "src": "/assets/images/paywall-app_screenshots-2.jpg",
      "appStoreUrl": "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/d1/c5/15/d1c51567-fc85-5a6c-5404-a2b47d1ff2b9/839285684_OOG104_Style_A-Light_en-US_APP_IPAD_PRO_129_OOG104_Style_A-Light_en-US_ipad_02.jpg/576x768bb.jpg",
      "usage": "Paywall app screenshot carousel.",
      "scene": "Companion app screenshot carousel inside paywall.",
      "userMoment": "The user is evaluating what the companion app includes after purchase.",
      "emotionalJob": "Companion app screenshot carousel inside paywall.",
      "visualJob": "Show real product value with an App Store screenshot.",
      "composition": "9:19.5; Use real App Store screenshots.; Use source screenshots from the target App Store listing.",
      "negativePrompt": "Do not use AI generation for real app screenshots by default.",
      "aspectRatio": "9:19.5",
      "backgroundPolicy": "Use real App Store screenshots.",
      "styleConsistency": "Use source screenshots from the target App Store listing.",
      "sourceSlotId": "paywall.app_screenshots"
    },
    "paywall.app_screenshots.3": {
      "id": "paywall.app_screenshots.3",
      "source": "app_store",
      "status": "ready",
      "type": "supporting_image",
      "kind": "paywall_app_screenshot_set",
      "pageId": "paywall",
      "slot": "paywall.app_screenshots",
      "prompt": "Download the real App Store screenshots for Workout for Women -Lose Weight when available.",
      "alt": "Workout for Women -Lose Weight App Store screenshot 3",
      "localPath": "outputs/assets/images/paywall-app_screenshots-3.jpg",
      "src": "/assets/images/paywall-app_screenshots-3.jpg",
      "appStoreUrl": "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/4f/ba/82/4fba82df-9807-8070-1ea2-28ff3d156acc/839285684_OOG104_Style_A-Light_en-US_APP_IPAD_PRO_129_OOG104_Style_A-Light_en-US_ipad_03.jpg/576x768bb.jpg",
      "usage": "Paywall app screenshot carousel.",
      "scene": "Companion app screenshot carousel inside paywall.",
      "userMoment": "The user is evaluating what the companion app includes after purchase.",
      "emotionalJob": "Companion app screenshot carousel inside paywall.",
      "visualJob": "Show real product value with an App Store screenshot.",
      "composition": "9:19.5; Use real App Store screenshots.; Use source screenshots from the target App Store listing.",
      "negativePrompt": "Do not use AI generation for real app screenshots by default.",
      "aspectRatio": "9:19.5",
      "backgroundPolicy": "Use real App Store screenshots.",
      "styleConsistency": "Use source screenshots from the target App Store listing.",
      "sourceSlotId": "paywall.app_screenshots"
    }
  },
  "model": "gpt-image-2",
  "generationSkipped": false,
  "lastGeneratedAt": "2026-06-24T07:16:54.135Z"
} as AssetsManifest;

export const templateConfig: FunnelConfig = normalizeRuntimeConfig({
  funnel: funnelConfig,
  copy: copyConfig,
  theme: templateTheme,
  pageVisualMap,
  stitchDerivedStyle,
  iconMap,
  assetsManifest
});
