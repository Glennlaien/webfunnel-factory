import { normalizeRuntimeConfig } from "./normalizeRuntimeConfig";
import type { AssetsManifest, CopyConfig, FunnelConfig, IconMap, PageVisualMap, Theme } from "./types";

export const templateTheme = {
  version: "runtime-default",
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
    warning: "#F0A43A",
    info: "#DCEAF9"
  },
  colorSystem: {
    background: "#F7F6F9"
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    headlineFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    headingWeight: 750,
    bodyWeight: 500
  },
  shape: {
    cardRadius: 20,
    controlRadius: 18,
    buttonRadius: 18
  }
} as Theme;

export const funnelConfig = {
  version: "runtime-default",
  product: {
    appName: "Web2App Funnel",
    appCode: "oog126_dev",
    placementCode: "O2MGB"
  },
  pages: [
    {
      id: "entry",
      pageType: "entry_page",
      phase: "entry",
      role: "portal",
      title: "Build your personalized plan",
      subtitle: "Answer a few quick questions to shape a plan around your goal.",
      ctaLabel: "Get started",
      secondaryCtaLabel: "Log in",
      progress: { visible: false }
    }
  ]
} as FunnelConfig;

export const copyConfig = {
  version: "runtime-default",
  product: "Web2App Funnel",
  pages: {
    entry: {
      title: "Build your personalized plan",
      subtitle: "Answer a few quick questions to shape a plan around your goal.",
      cta: "Get started"
    }
  }
} as CopyConfig;

export const pageVisualMap = {
  version: "runtime-default",
  defaults: {
    pageMaxWidth: 420,
    desktopMaxWidth: 760,
    background: "var(--bg)",
    titleAlign: "center",
    selectedStyle: "primary_outline_or_fill",
    motion: "subtle"
  },
  pageTypes: {},
  pages: {}
} as PageVisualMap;

export const iconMap = {
  version: "runtime-default",
  library: "lucide-react",
  optionIcons: {},
  uiIcons: {
    back: "ArrowLeft",
    logout: "LogOut",
    passwordVisible: "Eye",
    passwordHidden: "EyeOff",
    subscription: "ShieldCheck",
    heightExplainer: "Ruler"
  }
} as IconMap;

export const assetsManifest = {
  version: "runtime-default",
  mode: "runtime-template",
  assets: {}
} as AssetsManifest;

export const templateConfig: FunnelConfig = normalizeRuntimeConfig({
  funnel: funnelConfig,
  copy: copyConfig,
  theme: templateTheme,
  pageVisualMap,
  iconMap,
  assetsManifest
});
