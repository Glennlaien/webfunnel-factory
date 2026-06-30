export type PageType =
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
