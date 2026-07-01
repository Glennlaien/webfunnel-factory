import { normalizeRuntimeConfig } from "./normalizeRuntimeConfig";
import type { AssetsManifest, CopyConfig, FunnelConfig, IconMap, PageVisualMap, Theme } from "./types";

export const templateTheme = {
  "version": "0.5.0",
  "styleSystem": "runtime_style_recipe",
  "styleRecipeRef": "outputs/design/ui-style-recipe.json",
  "product": "Workout for Women -Lose Weight",
  "rationale": "Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable.",
  "primaryColorDecision": {
    "sourceType": "app_store_visual_evidence",
    "evidence": "Primary color #F20562 was extracted from App Store icon visual evidence for Workout for Women -Lose Weight. Raw extracted color was #F20562; sampled candidates were filtered for saturation, neutrality, and readability.",
    "audienceFit": "The extracted App Store color is adjusted through the selected Energetic Fitness recipe so it keeps the product's audience fit: women who want an approachable plan for fitness, body confidence, and consistency..",
    "confidence": 0.94,
    "fallbackPolicy": "Use App Store icon/screenshot color when it is saturated, non-neutral, and readable after contrast adjustment. If extraction fails or produces weak neutral colors, fall back to the selected UI recipe while preserving runtime component hierarchy.",
    "extractedPalette": {
      "usable": true,
      "sourceType": "app_store_visual_evidence",
      "appStoreId": "839285684",
      "lookupUrl": "https://itunes.apple.com/lookup?id=839285684&country=us",
      "selectedPrimary": "#F20562",
      "rawSelectedPrimary": "#F20562",
      "background": "#F8F5F7",
      "confidence": 0.94,
      "evidence": "Primary color #F20562 was extracted from App Store icon visual evidence for Workout for Women -Lose Weight. Raw extracted color was #F20562; sampled candidates were filtered for saturation, neutrality, and readability.",
      "reason": "Usable App Store visual color found.",
      "candidates": [
        {
          "hex": "#F20562",
          "count": 257,
          "saturation": 0.96,
          "lightness": 0.484,
          "score": 1044.5682,
          "sourceRole": "icon",
          "sourceWeight": 3
        },
        {
          "hex": "#F00F6E",
          "count": 288,
          "saturation": 0.882,
          "lightness": 0.5,
          "score": 726.8172,
          "sourceRole": "icon_small",
          "sourceWeight": 2
        },
        {
          "hex": "#F1106E",
          "count": 110,
          "saturation": 0.889,
          "lightness": 0.504,
          "score": 417.3357,
          "sourceRole": "icon",
          "sourceWeight": 3
        },
        {
          "hex": "#EF207F",
          "count": 66,
          "saturation": 0.866,
          "lightness": 0.531,
          "score": 160.2578,
          "sourceRole": "icon_small",
          "sourceWeight": 2
        },
        {
          "hex": "#DF1D70",
          "count": 56,
          "saturation": 0.77,
          "lightness": 0.494,
          "score": 129.5424,
          "sourceRole": "icon_small",
          "sourceWeight": 2
        },
        {
          "hex": "#F01D7E",
          "count": 31,
          "saturation": 0.876,
          "lightness": 0.527,
          "score": 114.1203,
          "sourceRole": "icon",
          "sourceWeight": 3
        },
        {
          "hex": "#F20361",
          "count": 40,
          "saturation": 0.976,
          "lightness": 0.48,
          "score": 110.0062,
          "sourceRole": "icon_small",
          "sourceWeight": 2
        },
        {
          "hex": "#D2206D",
          "count": 46,
          "saturation": 0.736,
          "lightness": 0.475,
          "score": 104.0106,
          "sourceRole": "icon_small",
          "sourceWeight": 2
        }
      ],
      "extractedAt": "2026-06-30T09:41:09.828Z"
    }
  },
  "colorTokens": {
    "background": "#F8F5F7",
    "surface": "#FFFFFF",
    "surfaceSoft": "#F7DDE8",
    "surfaceAlt": "#F7DDE8",
    "text": "#22242A",
    "mutedText": "#A23761",
    "muted": "#9698A2",
    "primary": "#F20562",
    "primaryDark": "#bd044c",
    "primarySoft": "#F7CADC",
    "accent": "#A23761",
    "success": "#2D7D61",
    "warning": "#F0A43A",
    "danger": "#B3261E",
    "border": "#DED4DA",
    "disabled": "#B5BEC8",
    "info": "#F7CADC"
  },
  "colorSystem": {
    "background": "#F8F5F7"
  },
  "typography": {
    "fontFamily": "'Inter', sans-serif",
    "headingWeight": 800,
    "bodyWeight": 500,
    "letterSpacing": "0",
    "headingTone": "bold_friendly",
    "titleScale": "expressive_mobile_title",
    "bodyScale": "clear_mobile_body",
    "headlineFamily": "'Inter', sans-serif"
  },
  "shape": {
    "controlRadius": 999,
    "cardRadius": 18,
    "buttonRadius": 999,
    "imageRadius": 18
  },
  "layout": {
    "mobileFirst": true,
    "desktop": "Centered vertical web funnel column on a full web canvas. Do not use a phone mockup or left-right split layout.",
    "radius": 18,
    "contentMaxWidth": 390,
    "desktopContentMaxWidth": 760
  },
  "styleRecipe": {
    "recipeId": "energetic_fitness",
    "recipeName": "Energetic Fitness",
    "recipeMode": "selected_preset",
    "secondaryInfluence": null
  },
  "sourceDesignProvider": "stitch",
  "stitchStyle": {
    "primary": "#F20562",
    "background": "#F8F5F7",
    "surface": "#FFFFFF",
    "text": "#22242A",
    "radius": 18,
    "buttonShape": "pill",
    "imageTreatment": "large_editorial",
    "density": "structured",
    "fontFamily": "'Inter', sans-serif",
    "headingWeight": 800
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
    "styleSystem": "runtime_style_recipe",
    "styleRecipeRef": "outputs/design/ui-style-recipe.json",
    "product": "Workout for Women -Lose Weight",
    "rationale": "Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable.",
    "primaryColorDecision": {
      "sourceType": "app_store_visual_evidence",
      "evidence": "Primary color #F20562 was extracted from App Store icon visual evidence for Workout for Women -Lose Weight. Raw extracted color was #F20562; sampled candidates were filtered for saturation, neutrality, and readability.",
      "audienceFit": "The extracted App Store color is adjusted through the selected Energetic Fitness recipe so it keeps the product's audience fit: women who want an approachable plan for fitness, body confidence, and consistency..",
      "confidence": 0.94,
      "fallbackPolicy": "Use App Store icon/screenshot color when it is saturated, non-neutral, and readable after contrast adjustment. If extraction fails or produces weak neutral colors, fall back to the selected UI recipe while preserving runtime component hierarchy.",
      "extractedPalette": {
        "usable": true,
        "sourceType": "app_store_visual_evidence",
        "appStoreId": "839285684",
        "lookupUrl": "https://itunes.apple.com/lookup?id=839285684&country=us",
        "selectedPrimary": "#F20562",
        "rawSelectedPrimary": "#F20562",
        "background": "#F8F5F7",
        "confidence": 0.94,
        "evidence": "Primary color #F20562 was extracted from App Store icon visual evidence for Workout for Women -Lose Weight. Raw extracted color was #F20562; sampled candidates were filtered for saturation, neutrality, and readability.",
        "reason": "Usable App Store visual color found.",
        "candidates": [
          {
            "hex": "#F20562",
            "count": 257,
            "saturation": 0.96,
            "lightness": 0.484,
            "score": 1044.5682,
            "sourceRole": "icon",
            "sourceWeight": 3
          },
          {
            "hex": "#F00F6E",
            "count": 288,
            "saturation": 0.882,
            "lightness": 0.5,
            "score": 726.8172,
            "sourceRole": "icon_small",
            "sourceWeight": 2
          },
          {
            "hex": "#F1106E",
            "count": 110,
            "saturation": 0.889,
            "lightness": 0.504,
            "score": 417.3357,
            "sourceRole": "icon",
            "sourceWeight": 3
          },
          {
            "hex": "#EF207F",
            "count": 66,
            "saturation": 0.866,
            "lightness": 0.531,
            "score": 160.2578,
            "sourceRole": "icon_small",
            "sourceWeight": 2
          },
          {
            "hex": "#DF1D70",
            "count": 56,
            "saturation": 0.77,
            "lightness": 0.494,
            "score": 129.5424,
            "sourceRole": "icon_small",
            "sourceWeight": 2
          },
          {
            "hex": "#F01D7E",
            "count": 31,
            "saturation": 0.876,
            "lightness": 0.527,
            "score": 114.1203,
            "sourceRole": "icon",
            "sourceWeight": 3
          },
          {
            "hex": "#F20361",
            "count": 40,
            "saturation": 0.976,
            "lightness": 0.48,
            "score": 110.0062,
            "sourceRole": "icon_small",
            "sourceWeight": 2
          },
          {
            "hex": "#D2206D",
            "count": 46,
            "saturation": 0.736,
            "lightness": 0.475,
            "score": 104.0106,
            "sourceRole": "icon_small",
            "sourceWeight": 2
          }
        ],
        "extractedAt": "2026-06-30T09:41:09.828Z"
      }
    },
    "colorTokens": {
      "background": "#F8F5F7",
      "surface": "#FFFFFF",
      "surfaceSoft": "#F7DDE8",
      "surfaceAlt": "#F7DDE8",
      "text": "#22242A",
      "mutedText": "#A23761",
      "muted": "#9698A2",
      "primary": "#F20562",
      "primaryDark": "#bd044c",
      "primarySoft": "#F7CADC",
      "accent": "#A23761",
      "success": "#2D7D61",
      "warning": "#F0A43A",
      "danger": "#B3261E",
      "border": "#DED4DA",
      "disabled": "#B5BEC8",
      "info": "#F7CADC"
    },
    "colorSystem": {
      "background": "#F8F5F7"
    },
    "typography": {
      "fontFamily": "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      "headingWeight": 800,
      "bodyWeight": 500,
      "letterSpacing": "0",
      "headingTone": "bold_friendly",
      "titleScale": "expressive_mobile_title",
      "bodyScale": "clear_mobile_body"
    },
    "shape": {
      "controlRadius": 16,
      "cardRadius": 18,
      "buttonRadius": 14,
      "imageRadius": 18
    },
    "layout": {
      "mobileFirst": true,
      "desktop": "Centered vertical web funnel column on a full web canvas. Do not use a phone mockup or left-right split layout.",
      "radius": 18,
      "contentMaxWidth": 390,
      "desktopContentMaxWidth": 760
    },
    "styleRecipe": {
      "recipeId": "energetic_fitness",
      "recipeName": "Energetic Fitness",
      "recipeMode": "selected_preset",
      "secondaryInfluence": null
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
      }
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
      }
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
      }
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
      "variant": "plain_list",
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
      }
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
      "variant": "plain_list",
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
    }
  ]
} as FunnelConfig;

export const copyConfig = {
  "version": "0.5.0",
  "product": "Workout for Women -Lose Weight",
  "pages": {
    "entry": {
      "title": "Create a plan that fits your starting point",
      "subtitle": "Answer a few simple questions so your plan can match your goal, routine, and body profile.",
      "cta": "Get started"
    },
    "age_group": {
      "title": "Select your age to start",
      "subtitle": "This helps tune recovery, difficulty, and weekly pacing.",
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
      "cta": "Continue"
    },
    "fitness_goal_discovery": {
      "title": "What is your main goal?",
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
      "cta": "Continue"
    },
    "fitness_experience_level": {
      "title": "How familiar are you with home fitness?",
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
      "cta": "Continue"
    },
    "fitness_time_budget": {
      "title": "How much time feels realistic?",
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
      "cta": "Continue"
    },
    "current_weight": {
      "title": "What is your current weight?",
      "cta": "Continue"
    },
    "target_weight": {
      "title": "What is your target weight?",
      "cta": "Continue"
    },
    "email": {
      "title": "Where should we send your plan?",
      "subtitle": "Use an email you can access later.",
      "cta": "Continue"
    },
    "summary": {
      "title": "Summary of your fitness level",
      "cta": "Continue"
    },
    "plan_generation": {
      "title": "Creating your home fitness plan",
      "subtitle": "Matching your baseline, goal, and weekly schedule."
    },
    "plan_ready": {
      "title": "Your personalized plan is ready",
      "subtitle": "A structured path built around your starting point.",
      "cta": "Continue"
    },
    "paywall": {
      "title": "Unlock your personalized plan",
      "subtitle": "Start with a plan shaped around your goal, body profile, and schedule.",
      "cta": "Get my plan"
    },
    "payment_success": {
      "title": "Payment confirmed",
      "subtitle": "Create your account to keep access to your plan.",
      "cta": "Create account"
    },
    "account_create": {
      "title": "Create your account",
      "subtitle": "Save your plan and subscription access.",
      "cta": "Create account"
    },
    "login": {
      "title": "Log in",
      "subtitle": "Access your plan and subscription.",
      "cta": "Log in"
    },
    "profile": {
      "title": "Profile",
      "subtitle": "Your plan and subscription."
    }
  }
} as CopyConfig;

export const pageVisualMap = {
  "version": "0.5.0",
  "defaults": {
    "pageMaxWidth": 420,
    "desktopMaxWidth": 760,
    "background": "var(--bg)",
    "titleAlign": "center",
    "selectedStyle": "primary_outline_or_fill",
    "motion": "subtle",
    "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted",
    "designProvider": "stitch"
  },
  "pageTypes": {
    "single_choice_page": {
      "supportedVariants": [
        "image_grid",
        "plain_list",
        "icon_list"
      ],
      "ctaMode": "auto_advance",
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted style-stitch-choice"
    },
    "multi_choice_page": {
      "supportedVariants": [
        "image_grid",
        "plain_list",
        "icon_list"
      ],
      "ctaMode": "sticky_bottom",
      "minSelectionFeedback": "disabled_cta",
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted style-stitch-choice"
    },
    "paywall_page": {
      "layout": "long_vertical_sales_page",
      "desktopLayout": "vertical_centered_not_split",
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted style-stitch-paywall"
    },
    "entry_page": {
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted style-stitch-entry"
    }
  },
  "pages": {
    "entry": {
      "pageType": "entry_page",
      "variant": "default",
      "sectionId": "entry",
      "designProvider": "stitch",
      "stitchSourceScreen": "entry",
      "stitchSections": [
        "top_nav",
        "hero_media",
        "headline",
        "body_comparison",
        "cta"
      ],
      "stitchHints": {
        "heroTreatment": "full_bleed",
        "navTreatment": "transparent",
        "ctaPlacement": "hero_bottom"
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-entry stitch-entry-editorial"
    },
    "age_group": {
      "pageType": "single_choice_page",
      "variant": "image_grid",
      "sectionId": "my_profile",
      "designProvider": "stitch",
      "stitchSourceScreen": "age_group",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "legal",
        "cta"
      ],
      "stitchHints": {
        "labelPlacement": "overlay_bottom",
        "columns": 2,
        "imageRatio": "portrait_card"
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-age_group stitch-choice-image-grid stitch-age-card-grid style-stitch-age-grid"
    },
    "exact_age": {
      "pageType": "age_input_page",
      "variant": "default",
      "sectionId": "my_profile",
      "designProvider": "stitch",
      "stitchSourceScreen": "metric_input",
      "stitchSections": [
        "top_nav",
        "bmi_gauge",
        "unit_input",
        "cta"
      ],
      "stitchHints": {
        "unitToggle": "segmented_pill",
        "valueTreatment": "large_centered",
        "helperCard": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-metric_input stitch-metric-input stitch-centered-measurement"
    },
    "fitness_goal_discovery": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "goals",
      "designProvider": "stitch",
      "stitchSourceScreen": "single_choice",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison"
      ],
      "stitchHints": {
        "optionTreatment": "large_surface_rows",
        "autoAdvance": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-single_choice stitch-choice-list stitch-choice-with-media"
    },
    "fitness_body_focus": {
      "pageType": "multi_choice_page",
      "variant": "plain_list",
      "sectionId": "goals",
      "designProvider": "stitch",
      "stitchSourceScreen": "multi_choice",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison",
        "cta"
      ],
      "stitchHints": {
        "optionTreatment": "large_surface_rows",
        "selectedIndicator": "checkmark_box",
        "ctaPlacement": "sticky_bottom"
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-multi_choice stitch-choice-list stitch-multi-check-list"
    },
    "fitness_goal_trust_bridge": {
      "pageType": "intro_page",
      "variant": "default",
      "sectionId": "goals",
      "designProvider": "stitch",
      "stitchSourceScreen": "intro_transition",
      "stitchSections": [
        "top_nav",
        "hero_media",
        "body_comparison",
        "facts_list",
        "cta"
      ],
      "stitchHints": {
        "heroRatio": "4:3",
        "ctaPlacement": "sticky_bottom",
        "copyDensity": "medium"
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-intro_transition stitch-intro-editorial"
    },
    "fitness_experience_level": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "training",
      "designProvider": "stitch",
      "stitchSourceScreen": "single_choice",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison"
      ],
      "stitchHints": {
        "optionTreatment": "large_surface_rows",
        "autoAdvance": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-single_choice stitch-choice-list stitch-choice-with-media"
    },
    "fitness_training_readiness": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "training",
      "designProvider": "stitch",
      "stitchSourceScreen": "single_choice",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison"
      ],
      "stitchHints": {
        "optionTreatment": "large_surface_rows",
        "autoAdvance": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-single_choice stitch-choice-list stitch-choice-with-media"
    },
    "fitness_current_activity": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "training",
      "designProvider": "stitch",
      "stitchSourceScreen": "single_choice",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison"
      ],
      "stitchHints": {
        "optionTreatment": "large_surface_rows",
        "autoAdvance": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-single_choice stitch-choice-list stitch-choice-with-media"
    },
    "fitness_blockers": {
      "pageType": "multi_choice_page",
      "variant": "plain_list",
      "sectionId": "training",
      "designProvider": "stitch",
      "stitchSourceScreen": "multi_choice",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison",
        "cta"
      ],
      "stitchHints": {
        "optionTreatment": "large_surface_rows",
        "selectedIndicator": "checkmark_box",
        "ctaPlacement": "sticky_bottom"
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-multi_choice stitch-choice-list stitch-multi-check-list"
    },
    "fitness_limitations": {
      "pageType": "multi_choice_page",
      "variant": "plain_list",
      "sectionId": "body",
      "designProvider": "stitch",
      "stitchSourceScreen": "multi_choice",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison",
        "cta"
      ],
      "stitchHints": {
        "optionTreatment": "large_surface_rows",
        "selectedIndicator": "checkmark_box",
        "ctaPlacement": "sticky_bottom"
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-multi_choice stitch-choice-list stitch-multi-check-list"
    },
    "fitness_routine_trust_bridge": {
      "pageType": "intro_page",
      "variant": "default",
      "sectionId": "routine",
      "designProvider": "stitch",
      "stitchSourceScreen": "intro_transition",
      "stitchSections": [
        "top_nav",
        "hero_media",
        "body_comparison",
        "facts_list",
        "cta"
      ],
      "stitchHints": {
        "heroRatio": "4:3",
        "ctaPlacement": "sticky_bottom",
        "copyDensity": "medium"
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-intro_transition stitch-intro-editorial"
    },
    "fitness_time_budget": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "routine",
      "designProvider": "stitch",
      "stitchSourceScreen": "single_choice",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison"
      ],
      "stitchHints": {
        "optionTreatment": "large_surface_rows",
        "autoAdvance": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-single_choice stitch-choice-list stitch-choice-with-media"
    },
    "fitness_weekly_frequency": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "routine",
      "designProvider": "stitch",
      "stitchSourceScreen": "single_choice",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison"
      ],
      "stitchHints": {
        "optionTreatment": "large_surface_rows",
        "autoAdvance": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-single_choice stitch-choice-list stitch-choice-with-media"
    },
    "fitness_preferred_time": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "routine",
      "designProvider": "stitch",
      "stitchSourceScreen": "single_choice",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison"
      ],
      "stitchHints": {
        "optionTreatment": "large_surface_rows",
        "autoAdvance": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-single_choice stitch-choice-list stitch-choice-with-media"
    },
    "fitness_energy_level": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "routine",
      "designProvider": "stitch",
      "stitchSourceScreen": "single_choice",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison"
      ],
      "stitchHints": {
        "optionTreatment": "large_surface_rows",
        "autoAdvance": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-single_choice stitch-choice-list stitch-choice-with-media"
    },
    "fitness_motivation_reason": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "motivation",
      "designProvider": "stitch",
      "stitchSourceScreen": "single_choice",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison"
      ],
      "stitchHints": {
        "optionTreatment": "large_surface_rows",
        "autoAdvance": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-single_choice stitch-choice-list stitch-choice-with-media"
    },
    "fitness_support_style": {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "sectionId": "motivation",
      "designProvider": "stitch",
      "stitchSourceScreen": "single_choice",
      "stitchSections": [
        "top_nav",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison"
      ],
      "stitchHints": {
        "optionTreatment": "large_surface_rows",
        "autoAdvance": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-single_choice stitch-choice-list stitch-choice-with-media"
    },
    "height": {
      "pageType": "height_input_page",
      "variant": "default",
      "sectionId": "body",
      "designProvider": "stitch",
      "stitchSourceScreen": "metric_input",
      "stitchSections": [
        "top_nav",
        "bmi_gauge",
        "unit_input",
        "cta"
      ],
      "stitchHints": {
        "unitToggle": "segmented_pill",
        "valueTreatment": "large_centered",
        "helperCard": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-metric_input stitch-metric-input stitch-centered-measurement"
    },
    "current_weight": {
      "pageType": "weight_input_page",
      "variant": "default",
      "sectionId": "body",
      "designProvider": "stitch",
      "stitchSourceScreen": "metric_input",
      "stitchSections": [
        "top_nav",
        "bmi_gauge",
        "unit_input",
        "cta"
      ],
      "stitchHints": {
        "unitToggle": "segmented_pill",
        "valueTreatment": "large_centered",
        "helperCard": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-metric_input stitch-metric-input stitch-centered-measurement"
    },
    "target_weight": {
      "pageType": "weight_input_page",
      "variant": "default",
      "sectionId": "body",
      "designProvider": "stitch",
      "stitchSourceScreen": "metric_input",
      "stitchSections": [
        "top_nav",
        "bmi_gauge",
        "unit_input",
        "cta"
      ],
      "stitchHints": {
        "unitToggle": "segmented_pill",
        "valueTreatment": "large_centered",
        "helperCard": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-metric_input stitch-metric-input stitch-centered-measurement"
    },
    "email": {
      "pageType": "email_capture_page",
      "variant": "default",
      "sectionId": "result",
      "designProvider": "stitch",
      "stitchSourceScreen": "metric_input",
      "stitchSections": [
        "top_nav",
        "bmi_gauge",
        "unit_input",
        "cta"
      ],
      "stitchHints": {
        "unitToggle": "segmented_pill",
        "valueTreatment": "large_centered",
        "helperCard": true
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-metric_input stitch-metric-input stitch-centered-measurement"
    },
    "summary": {
      "pageType": "summary_page",
      "variant": "default",
      "sectionId": "result",
      "designProvider": "stitch",
      "stitchSourceScreen": "summary",
      "stitchSections": [
        "top_nav",
        "hero_media",
        "headline",
        "body_comparison",
        "bmi_gauge",
        "facts_list",
        "cta"
      ],
      "stitchHints": {
        "modules": [
          "bmi_gauge",
          "facts_list",
          "body_visual",
          "insight_card"
        ]
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-summary stitch-summary-bmi-profile style-stitch-summary"
    },
    "plan_generation": {
      "pageType": "plan_generation_page",
      "variant": "default",
      "sectionId": "result",
      "designProvider": "stitch",
      "stitchSourceScreen": "plan_generation",
      "stitchSections": [],
      "stitchHints": {
        "modules": [
          "progress_ring",
          "overlay_questions",
          "testimonial_card"
        ]
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-plan_generation stitch-generation-proof"
    },
    "plan_ready": {
      "pageType": "plan_ready_page",
      "variant": "default",
      "sectionId": "result",
      "designProvider": "stitch",
      "stitchSourceScreen": "plan_ready",
      "stitchSections": [
        "top_nav",
        "hero_media",
        "headline",
        "line_chart",
        "offer_list",
        "legal",
        "cta"
      ],
      "stitchHints": {
        "modules": [
          "target_date",
          "animated_chart",
          "expected_result"
        ]
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-plan_ready stitch-plan-chart style-stitch-plan-ready"
    },
    "paywall": {
      "pageType": "paywall_page",
      "variant": "default",
      "sectionId": "paywall",
      "designProvider": "stitch",
      "stitchSourceScreen": "paywall",
      "stitchSections": [
        "sticky_timer",
        "segmented_progress",
        "hero_media",
        "headline",
        "body_comparison",
        "offer_list",
        "legal",
        "app_screenshots",
        "cta"
      ],
      "stitchHints": {
        "modules": [
          "sticky_timer",
          "body_comparison",
          "offer_list",
          "app_screenshots",
          "testimonials",
          "guarantee"
        ]
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-paywall stitch-paywall-longform"
    },
    "payment_success": {
      "pageType": "payment_success_page",
      "variant": "default",
      "sectionId": "paid",
      "designProvider": "stitch",
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted"
    },
    "account_create": {
      "pageType": "account_create_page",
      "variant": "default",
      "sectionId": "account",
      "designProvider": "stitch",
      "stitchSourceScreen": "account_auth_profile",
      "stitchSections": [
        "top_nav",
        "hero_media",
        "offer_list",
        "legal"
      ],
      "stitchHints": {
        "formTreatment": "flat_inputs",
        "profileTreatment": "simple_rows"
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-account_auth_profile stitch-account-flat"
    },
    "login": {
      "pageType": "login_page",
      "variant": "default",
      "sectionId": "account",
      "designProvider": "stitch",
      "stitchSourceScreen": "account_auth_profile",
      "stitchSections": [
        "top_nav",
        "hero_media",
        "offer_list",
        "legal"
      ],
      "stitchHints": {
        "formTreatment": "flat_inputs",
        "profileTreatment": "simple_rows"
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-account_auth_profile stitch-account-flat"
    },
    "profile": {
      "pageType": "account_page",
      "variant": "default",
      "sectionId": "account",
      "designProvider": "stitch",
      "stitchSourceScreen": "account_auth_profile",
      "stitchSections": [
        "top_nav",
        "hero_media",
        "offer_list",
        "legal"
      ],
      "stitchHints": {
        "formTreatment": "flat_inputs",
        "profileTreatment": "simple_rows"
      },
      "pageClass": "style-stitch style-stitch-pill style-stitch-editorial style-stitch-structured style-stitch-adapted stitch-screen stitch-screen-account_auth_profile stitch-account-flat"
    }
  },
  "sourceDesignProvider": "stitch"
} as PageVisualMap;

export const iconMap = {
  "version": "runtime-default",
  "library": "lucide-react",
  "optionIcons": {},
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
  "mode": "mixed",
  "sourcePlan": "outputs/assets/image-plan.json",
  "generatedAt": "2026-06-30T09:41:12.216Z",
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
      "prompt": "Create one premium hero image for a home fitness web funnel. Show one adult woman doing guided home fitness movement in a bright minimal home or studio setting. Confident, approachable, no text, no logos, no app UI.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Full-bleed portal hero for the first page..\nRuntime usage: EntryPage hero background..\nAspect ratio: 16:9.\nBackground policy: Photoreal lifestyle background, no transparency needed..\nStyle consistency: Premium editorial home fitness photography, trustworthy and approachable..\nNegative prompt: No words, logos, devices, UI screens, weapons, camouflage uniform, injuries, dark gritty scene, or crowded gym..\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
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
      "generatedAt": "2026-06-30T09:42:17.603Z",
      "generationId": "1782812473-1782812537566",
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
      "prompt": "Create exactly one age-group option image for Age: 18-25. This is one standalone option asset from a larger set, not the whole set. Show exactly one person only. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Asian adult woman, age 18-25, half-body, product-relevant, confident, tasteful movement-friendly clothes.\nDifferentiation requirement: youngest bracket; visibly early adult energy without looking underage for 18-25.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Four option images for age-group selection..\nRuntime usage: age_group option cards..\nAspect ratio: 4:3.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images..\nStyle consistency: Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences..\nNegative prompt: No full scenes, no text, no numbers, no labels, no duplicated face across age groups, no childlike appearance, no sexualized pose, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
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
      "generatedAt": "2026-06-30T09:43:14.129Z",
      "generationId": "1782812538-1782812592673",
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
      "prompt": "Create exactly one age-group option image for Age: 26-35. This is one standalone option asset from a larger set, not the whole set. Show exactly one person only. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Black adult woman, age 26-35, half-body, product-relevant, confident, tasteful movement-friendly clothes.\nDifferentiation requirement: second bracket; adult styling distinct from the youngest group for 26-35.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Four option images for age-group selection..\nRuntime usage: age_group option cards..\nAspect ratio: 4:3.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images..\nStyle consistency: Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences..\nNegative prompt: No full scenes, no text, no numbers, no labels, no duplicated face across age groups, no childlike appearance, no sexualized pose, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
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
      "generatedAt": "2026-06-30T09:44:15.703Z",
      "generationId": "1782812595-1782812654479",
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
      "prompt": "Create exactly one age-group option image for Age: 36-45. This is one standalone option asset from a larger set, not the whole set. Show exactly one person only. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: White adult woman, age 36-45, half-body, product-relevant, confident, tasteful movement-friendly clothes.\nDifferentiation requirement: third bracket; mature adult styling with visible age difference for 36-45.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Four option images for age-group selection..\nRuntime usage: age_group option cards..\nAspect ratio: 4:3.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images..\nStyle consistency: Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences..\nNegative prompt: No full scenes, no text, no numbers, no labels, no duplicated face across age groups, no childlike appearance, no sexualized pose, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
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
      "generatedAt": "2026-06-30T09:45:18.310Z",
      "generationId": "1782812656-1782812717153",
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
      "prompt": "Create exactly one age-group option image for Age: 46+. This is one standalone option asset from a larger set, not the whole set. Show exactly one person only. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Latino or mixed-race adult woman, age 46+, half-body, product-relevant, confident, tasteful movement-friendly clothes.\nDifferentiation requirement: oldest bracket; clearly older appearance while still capable and confident for 46+.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Four option images for age-group selection..\nRuntime usage: age_group option cards..\nAspect ratio: 4:3.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four age option images..\nStyle consistency: Same camera angle, crop, lighting, athletic styling, and visual system. Upper-body or half-body crop. Include Asian, Black, White, and Latino or mixed-race representation across the four options, with clear age differences..\nNegative prompt: No full scenes, no text, no numbers, no labels, no duplicated face across age groups, no childlike appearance, no sexualized pose, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
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
      "generatedAt": "2026-06-30T09:46:19.539Z",
      "generationId": "1782812719-1782812779260",
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
      "prompt": "Create a 4:3 premium home fitness image for an intro page titled \"Your goal gives the plan direction\". Show one adult woman in a clean modern home or studio context doing or preparing for guided home fitness movement. The image should support this message: A strong plan is not just harder exercises. It needs the right starting point, the right schedule, and a progression you can keep repeating.. No text, no logos, no app UI.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Large contextual image for an intro or transition page..\nRuntime usage: fitness_goal_trust_bridge IntroPage hero image..\nAspect ratio: 4:3.\nBackground policy: Natural light training scene; no transparent requirement..\nStyle consistency: Same premium home fitness campaign style across intro images..\nNegative prompt: No words, logos, phones, screenshots, weapons, camouflage, injuries, or crowded gym..\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
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
      "generatedAt": "2026-06-30T09:47:28.840Z",
      "generationId": "1782812780-1782812848784",
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
      "prompt": "Create a 4:3 premium home fitness image for an intro page titled \"Your routine should fit your real week\". Show one adult woman in a clean modern home or studio context doing or preparing for guided home fitness movement. The image should support this message: Most people stop because the training plan asks for a version of their week that does not exist. We will use your schedule to shape a home fitness plan that feels easier to repeat.. No text, no logos, no app UI.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Large contextual image for an intro or transition page..\nRuntime usage: fitness_routine_trust_bridge IntroPage hero image..\nAspect ratio: 4:3.\nBackground policy: Natural light training scene; no transparent requirement..\nStyle consistency: Same premium home fitness campaign style across intro images..\nNegative prompt: No words, logos, phones, screenshots, weapons, camouflage, injuries, or crowded gym..\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
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
      "generatedAt": "2026-06-30T09:48:43.820Z",
      "generationId": "1782812849-1782812923768",
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
      "prompt": "Create exactly one normal body-state base image for a summary page. This is one standalone body-state asset, not the whole set. Show exactly one person only. Use a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Base image: healthy normal body composition, 3/4 body crop.\nDifferentiation requirement: Neutral body composition, same face and outfit as the whole set.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
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
      "generatedAt": "2026-06-30T09:49:46.516Z",
      "generationId": "1782812924-1782812985288",
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
      "prompt": "Create exactly one normal body-state base image for a summary page. This is one standalone body-state asset, not the whole set. Show exactly one person only. Use a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Base image: healthy normal body composition, 3/4 body crop.\nDifferentiation requirement: Neutral body composition, same face and outfit as the whole set.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
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
      "generatedAt": "2026-06-30T09:49:46.516Z",
      "generationId": "1782812924-1782812985288",
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
      "prompt": "Create exactly one underweight body-state image as an edit from the provided reference image. This is one standalone body-state asset, not the whole set. Show exactly one person only. Preserve a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Edit same person to underweight body composition, same face and outfit.\nDifferentiation requirement: Underweight body composition without shame framing.\nEdit reference requirement: Use Normal as the identity reference. Preserve the same face, hairstyle, expression, pose family, crop, outfit direction, lighting, and camera angle. Only adjust the body-state to Underweight.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
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
      "generatedAt": "2026-06-30T09:50:55.133Z",
      "generationId": "1782812989-1782813053839",
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
      "prompt": "Create exactly one underweight body-state image as an edit from the provided reference image. This is one standalone body-state asset, not the whole set. Show exactly one person only. Preserve a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Edit same person to underweight body composition, same face and outfit.\nDifferentiation requirement: Underweight body composition without shame framing.\nEdit reference requirement: Use Normal as the identity reference. Preserve the same face, hairstyle, expression, pose family, crop, outfit direction, lighting, and camera angle. Only adjust the body-state to Underweight.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
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
      "generatedAt": "2026-06-30T09:50:55.133Z",
      "generationId": "1782812989-1782813053839",
      "sourceGeneratedPath": "outputs/assets/images/summary-body-underweight.png",
      "src": "/assets/images/summary-body-underweight.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/edits"
    },
    "summary.body.overweight": {
      "id": "summary.body.overweight",
      "source": "fallback_from_normal_body_asset",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "generate",
      "referenceAssetIds": [],
      "referenceLocalPaths": [
        "outputs/assets/images/summary-body-normal.png"
      ],
      "type": "supporting_image",
      "kind": "summary_body_set",
      "pageId": "summary",
      "slot": "summary.body_set",
      "optionValue": "overweight",
      "label": "Overweight",
      "prompt": "Create exactly one overweight body-state image as an edit from the provided reference image. This is one standalone body-state asset, not the whole set. Show exactly one person only. Preserve a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Edit same person to overweight body composition, same face and outfit.\nDifferentiation requirement: Overweight body composition without changing face or clothing direction.\nEdit reference requirement: Use Normal as the identity reference. Preserve the same face, hairstyle, expression, pose family, crop, outfit direction, lighting, and camera angle. Only adjust the body-state to Overweight.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Overweight visual",
      "localPath": "outputs/assets/images/summary-body-normal.png",
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
      "lastGenerationError": "Image API timed out after 90000ms",
      "lastGenerationAttemptedAt": "2026-06-30T09:57:24.759Z",
      "editDowngradeReason": "Image edit API timed out after 60000ms",
      "fallbackReason": "Image API timed out after 90000ms",
      "fallbackFromAssetId": "summary.body.normal",
      "sourceGeneratedPath": "outputs/assets/images/summary-body-normal.png",
      "src": "/assets/images/summary-body-normal.png",
      "generatedAt": "2026-06-30T09:59:37.051Z"
    },
    "paywall.summary.body.overweight": {
      "id": "paywall.summary.body.overweight",
      "source": "fallback_from_normal_body_asset",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "generate",
      "referenceAssetIds": [],
      "referenceLocalPaths": [
        "outputs/assets/images/summary-body-normal.png"
      ],
      "type": "supporting_image",
      "kind": "summary_body_set",
      "pageId": "paywall",
      "slot": "summary.body_set",
      "optionValue": "overweight",
      "label": "Overweight",
      "prompt": "Create exactly one overweight body-state image as an edit from the provided reference image. This is one standalone body-state asset, not the whole set. Show exactly one person only. Preserve a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Edit same person to overweight body composition, same face and outfit.\nDifferentiation requirement: Overweight body composition without changing face or clothing direction.\nEdit reference requirement: Use Normal as the identity reference. Preserve the same face, hairstyle, expression, pose family, crop, outfit direction, lighting, and camera angle. Only adjust the body-state to Overweight.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
      "alt": "Workout for Women -Lose Weight Overweight visual",
      "localPath": "outputs/assets/images/summary-body-normal.png",
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
      "lastGenerationError": "Image API timed out after 90000ms",
      "lastGenerationAttemptedAt": "2026-06-30T09:57:24.759Z",
      "editDowngradeReason": "Image edit API timed out after 60000ms",
      "fallbackReason": "Image API timed out after 90000ms",
      "fallbackFromAssetId": "summary.body.normal",
      "sourceGeneratedPath": "outputs/assets/images/summary-body-normal.png",
      "src": "/assets/images/summary-body-normal.png",
      "generatedAt": "2026-06-30T09:59:37.051Z"
    },
    "summary.body.obese": {
      "id": "summary.body.obese",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "generate",
      "referenceAssetIds": [],
      "referenceLocalPaths": [
        "outputs/assets/images/summary-body-normal.png"
      ],
      "type": "supporting_image",
      "kind": "summary_body_set",
      "pageId": "summary",
      "slot": "summary.body_set",
      "optionValue": "obese",
      "label": "Obese",
      "prompt": "Create exactly one obese body-state image as an edit from the provided reference image. This is one standalone body-state asset, not the whole set. Show exactly one person only. Preserve a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Edit same person to obese body composition, same face and outfit.\nDifferentiation requirement: Obese body composition without changing face or clothing direction.\nEdit reference requirement: Use Normal as the identity reference. Preserve the same face, hairstyle, expression, pose family, crop, outfit direction, lighting, and camera angle. Only adjust the body-state to Obese.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
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
      "lastGenerationError": "Image edit API timed out after 60000ms",
      "lastGenerationAttemptedAt": "2026-06-30T09:54:18.737Z",
      "editDowngradeReason": "Image edit API timed out after 60000ms",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-30T09:58:47.033Z",
      "generationId": "1782813445-1782813526623",
      "sourceGeneratedPath": "outputs/assets/images/summary-body-obese.png",
      "src": "/assets/images/summary-body-obese.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/generations"
    },
    "paywall.summary.body.obese": {
      "id": "paywall.summary.body.obese",
      "source": "gpt-image-2",
      "model": "gpt-image-2",
      "status": "ready",
      "generationMode": "generate",
      "referenceAssetIds": [],
      "referenceLocalPaths": [
        "outputs/assets/images/summary-body-normal.png"
      ],
      "type": "supporting_image",
      "kind": "summary_body_set",
      "pageId": "paywall",
      "slot": "summary.body_set",
      "optionValue": "obese",
      "label": "Obese",
      "prompt": "Create exactly one obese body-state image as an edit from the provided reference image. This is one standalone body-state asset, not the whole set. Show exactly one person only. Preserve a 3/4-body crop from head to mid-thigh or just above the knees; do not show a full head-to-toe body. Use a perfectly plain solid white #FFFFFF studio background that matches the funnel theme.\nSpecific item brief: Edit same person to obese body composition, same face and outfit.\nDifferentiation requirement: Obese body composition without changing face or clothing direction.\nEdit reference requirement: Use Normal as the identity reference. Preserve the same face, hairstyle, expression, pose family, crop, outfit direction, lighting, and camera angle. Only adjust the body-state to Obese.\nProduct category: home fitness, web2app onboarding, personalized subscription plan.\nTarget audience: {\"summary\":\"women who want an approachable plan for fitness, body confidence, and consistency.\",\"targetAgeRange\":\"18-55\",\"ageRangeSource\":\"product_analysis\",\"ageRangeEvidence\":\"Product name signals women-focused weight loss, toning, or body-confidence onboarding.\",\"ageGroups\":[{\"value\":\"18_25\",\"label\":\"Age: 18-25\",\"minAge\":18,\"maxAge\":25,\"imageSubject\":\"Asian adult woman, age 18-25\",\"differentiationRequirement\":\"youngest bracket; visibly early adult energy without looking underage for 18-25.\"},{\"value\":\"26_35\",\"label\":\"Age: 26-35\",\"minAge\":26,\"maxAge\":35,\"imageSubject\":\"Black adult woman, age 26-35\",\"differentiationRequirement\":\"second bracket; adult styling distinct from the youngest group for 26-35.\"},{\"value\":\"36_45\",\"label\":\"Age: 36-45\",\"minAge\":36,\"maxAge\":45,\"imageSubject\":\"White adult woman, age 36-45\",\"differentiationRequirement\":\"third bracket; mature adult styling with visible age difference for 36-45.\"},{\"value\":\"46_plus\",\"label\":\"Age: 46+\",\"minAge\":46,\"maxAge\":null,\"imageSubject\":\"Latino or mixed-race adult woman, age 46+\",\"differentiationRequirement\":\"oldest bracket; clearly older appearance while still capable and confident for 46+.\"}],\"genderFocus\":\"female\",\"lifeStage\":\"adult\"}.\nCore promise: Create a personalized home fitness plan around goal, body baseline, and schedule..\nTone: direct, supportive, premium, progress-oriented..\nVisual direction: Energetic Fitness was selected because The product emphasizes women's fitness, toning, body shaping, motivation, or visible transformation. The final tokens are derived from the global recipe and App Store visual evidence when the extracted brand color is usable..\nDisplay role: Body profile visual for summary and paywall before/after comparison..\nRuntime usage: Summary body visual and paywall Now/Goal comparison..\nAspect ratio: 3:4.\nBackground policy: Perfectly plain solid white background (#FFFFFF) for a light-themed funnel. No gradient, no vignette, no studio sweep, no shadowed backdrop, no colored tint, no texture, no floor plane, and no environmental scene. Keep the backdrop simple, seamless, and identical across all four body-state images..\nStyle consistency: Same adult woman identity, face, hair, outfit color, lighting, 3/4-body crop, and pose across all four variants. Only body composition changes: underweight, normal, overweight, obese..\nNegative prompt: No text, no labels, no shame framing, no medical imagery, no unrealistic proportions, no sexualized pose, no full-body head-to-toe crop, no feet-dominant framing, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop, no busy room, no black background, no dark background, no gradient, no vignette, no colored tint, no texture, no studio sweep, no shadowed backdrop.\nGenerate a polished raster image for a mobile Web2App funnel.\nThis request is for exactly one standalone image asset. Do not create a contact sheet, collage, four-panel grid, before-after grid, or multiple people/variants in one image.\nDo not include readable text, logos, app UI chrome, watermarks, or SVG-style flat placeholders unless explicitly requested.",
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
      "lastGenerationError": "Image edit API timed out after 60000ms",
      "lastGenerationAttemptedAt": "2026-06-30T09:54:18.737Z",
      "editDowngradeReason": "Image edit API timed out after 60000ms",
      "generationTool": "sub2api-image-generation",
      "generatedAt": "2026-06-30T09:58:47.033Z",
      "generationId": "1782813445-1782813526623",
      "sourceGeneratedPath": "outputs/assets/images/summary-body-obese.png",
      "src": "/assets/images/summary-body-obese.png",
      "outputFormat": "png",
      "generationProvider": "sub2api",
      "generationEndpoint": "http://152.70.196.2:8080/v1/images/generations"
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
  "lastGeneratedAt": "2026-06-30T09:58:47.033Z"
} as AssetsManifest;

export const templateConfig: FunnelConfig = normalizeRuntimeConfig({
  funnel: funnelConfig,
  copy: copyConfig,
  theme: templateTheme,
  pageVisualMap,
  iconMap,
  assetsManifest
});
