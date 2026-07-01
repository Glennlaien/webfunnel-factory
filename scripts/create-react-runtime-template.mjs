import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runtimeTemplateDir = path.join(root, "runtime/react-funnel-runtime/app-template");
const appOutputDir = path.join(root, "outputs/app");

const neutralTheme = {
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
};

const neutralFunnelConfig = {
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
};

const neutralPageVisualMap = {
  version: "runtime-default",
  defaults: {
    pageMaxWidth: 420,
    desktopMaxWidth: 760,
    background: "var(--bg)",
    titleAlign: "center",
    selectedStyle: "primary_outline_or_fill",
    motion: "subtle"
  },
  pageTypes: {
    single_choice_page: {
      supportedVariants: ["image_grid", "plain_list", "icon_list"],
      ctaMode: "auto_advance"
    },
    multi_choice_page: {
      supportedVariants: ["image_grid", "plain_list", "icon_list"],
      ctaMode: "sticky_bottom",
      minSelectionFeedback: "disabled_cta"
    },
    paywall_page: {
      layout: "long_vertical_sales_page",
      desktopLayout: "vertical_centered_not_split"
    }
  },
  pages: {}
};

const neutralIconMap = {
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
};

const neutralAssetsManifest = {
  version: "runtime-default",
  mode: "runtime-template",
  assets: {}
};

function abs(relativePath) {
  return path.join(root, relativePath);
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function writeJson(relativePath, value) {
  writeText(abs(relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

function readJsonIfExists(relativePath, fallback) {
  const filePath = abs(relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(readText(filePath));
}

function exists(relativePath) {
  return fs.existsSync(abs(relativePath));
}

function copyDirectory(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Missing runtime template directory: ${sourceDir}`);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  for (const item of fs.readdirSync(targetDir, { withFileTypes: true })) {
    if (["node_modules", "dist", "package-lock.json", "tsconfig.tsbuildinfo", ".DS_Store"].includes(item.name)) continue;
    fs.rmSync(path.join(targetDir, item.name), { recursive: true, force: true });
  }

  for (const item of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (["node_modules", "dist", "package-lock.json", "tsconfig.tsbuildinfo", ".DS_Store"].includes(item.name)) continue;
    const sourcePath = path.join(sourceDir, item.name);
    const targetPath = path.join(targetDir, item.name);
    if (item.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else if (item.isFile()) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
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
  const publicDir = path.join(appOutputDir, "public/assets/images");
  fs.rmSync(publicDir, { recursive: true, force: true });
  fs.mkdirSync(publicDir, { recursive: true });

  for (const asset of assets) {
    if (!asset?.localPath) continue;
    const source = path.isAbsolute(asset.localPath) ? asset.localPath : abs(asset.localPath);
    if (!fs.existsSync(source)) continue;
    fs.copyFileSync(source, path.join(publicDir, path.basename(source)));
  }
}

function copyFromFunnelConfig(config) {
  const pageEntries = Array.isArray(config?.pages)
    ? config.pages.map((page) => [
        page.id,
        {
          title: page.title,
          subtitle: page.subtitle,
          body: page.body,
          cta: page.cta || page.ctaLabel,
          options: Array.isArray(page.options)
            ? page.options.map((option) => ({ value: option.value, label: option.label }))
            : undefined
        }
      ])
    : [];
  return {
    version: config?.version ?? "generated",
    product: config?.product?.appName ?? config?.product?.productName ?? "Web2App Funnel",
    pages: Object.fromEntries(pageEntries)
  };
}

function pageVisualMapFromFunnelConfig(config) {
  const pages = Array.isArray(config?.pages) ? config.pages : [];
  return {
    ...neutralPageVisualMap,
    version: config?.version ?? "generated",
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

function readStitchHandoff() {
  if (!exists("outputs/design-handoff/stitch-handoff.json")) return null;
  return readJsonIfExists("outputs/design-handoff/stitch-handoff.json", null);
}

function withStitchTheme(theme, stitchHandoff) {
  if (!stitchHandoff?.style) return theme;
  const style = stitchHandoff.style;
  const safeRadius = Math.max(
    8,
    Math.min(28, Number(style.radius) || Number(theme.shape?.cardRadius) || neutralTheme.shape.cardRadius)
  );
  return {
    ...theme,
    sourceDesignProvider: "stitch",
    stitchStyle: style,
    colorTokens: {
      ...(theme.colorTokens || {}),
      primary: style.primary || theme.colorTokens?.primary || neutralTheme.colorTokens.primary,
      background: style.background || theme.colorTokens?.background || neutralTheme.colorTokens.background,
      surface: style.surface || theme.colorTokens?.surface || neutralTheme.colorTokens.surface,
      text: style.text || theme.colorTokens?.text || neutralTheme.colorTokens.text
    },
    colorSystem: {
      ...(theme.colorSystem || {}),
      background: style.background || theme.colorSystem?.background || theme.colorTokens?.background || neutralTheme.colorTokens.background
    },
    typography: {
      ...(theme.typography || {}),
      fontFamily: style.fontFamily || theme.typography?.fontFamily || neutralTheme.typography.fontFamily,
      headlineFamily: style.fontFamily || theme.typography?.headlineFamily || theme.typography?.fontFamily || neutralTheme.typography.headlineFamily,
      headingWeight: style.headingWeight || theme.typography?.headingWeight || neutralTheme.typography.headingWeight
    },
    shape: {
      ...(theme.shape || {}),
      cardRadius: safeRadius,
      controlRadius: style.buttonShape === "pill" ? 999 : safeRadius,
      buttonRadius: style.buttonShape === "pill" ? 999 : safeRadius
    }
  };
}

function stitchMappingForPage(page, stitchHandoff) {
  const variants = stitchHandoff?.pageVariants || {};
  if (page.id === "entry") return variants.entry;
  if (page.id === "age_group") return variants.age_group || variants.age;
  if (page.pageType === "intro_page") return variants.intro_transition || variants.intro;
  if (
    page.pageType === "height_input_page" ||
    page.pageType === "weight_input_page" ||
    page.pageType === "age_input_page" ||
    page.pageType === "email_capture_page"
  ) return variants.metric_input;
  if (page.pageType === "summary_page") return variants.summary;
  if (page.pageType === "plan_generation_page") return variants.plan_generation;
  if (page.pageType === "plan_ready_page") return variants.plan_ready;
  if (page.pageType === "paywall_page") return variants.paywall;
  if (
    page.pageType === "account_create_page" ||
    page.pageType === "login_page" ||
    page.pageType === "account_page"
  ) return variants.account_auth_profile || variants.profile;
  if (page.pageType === "multi_choice_page") return variants.multi_choice;
  if (page.pageType === "single_choice_page") return variants.single_choice;
  return null;
}

function skinCssVars(skin) {
  const tokens = skin?.tokens || {};
  const vars = {};
  const entries = {
    "--skin-page-padding": tokens.pagePadding,
    "--skin-component-gap": tokens.componentGap,
    "--skin-card-radius": tokens.cardRadius,
    "--skin-control-radius": tokens.controlRadius,
    "--skin-heading-size": tokens.headingSize,
    "--skin-body-size": tokens.bodySize,
    "--skin-option-min-height": tokens.optionMinHeight,
    "--skin-option-radius": tokens.optionRadius,
    "--skin-option-border-width": tokens.optionBorderWidth,
    "--skin-value-size": tokens.valueSize,
    "--skin-section-spacing": tokens.sectionSpacing
  };
  for (const [key, value] of Object.entries(entries)) {
    if (!Number.isFinite(Number(value))) continue;
    vars[key] = key.includes("border-width") ? `${Number(value)}px` : `${Math.round(Number(value))}px`;
  }
  if (tokens.optionImageRatio) vars["--skin-option-image-ratio"] = tokens.optionImageRatio;
  if (tokens.imageRatio) vars["--skin-image-ratio"] = tokens.imageRatio;
  if (tokens.headingWeight) vars["--skin-heading-weight"] = String(tokens.headingWeight);
  return vars;
}

function withStitchVisualMap(pageVisualMap, stitchHandoff, config) {
  if (!stitchHandoff?.style) return pageVisualMap;
  const pages = Array.isArray(config?.pages) ? config.pages : [];
  const styleClass = [
    "style-stitch",
    stitchHandoff.style.buttonShape === "pill" ? "style-stitch-pill" : "style-stitch-rounded",
    stitchHandoff.style.imageTreatment === "large_editorial" ? "style-stitch-editorial" : "style-stitch-contained",
    stitchHandoff.style.density === "open" ? "style-stitch-open" : "style-stitch-structured",
    "style-stitch-adapted"
  ].join(" ");

  return {
    ...pageVisualMap,
    sourceDesignProvider: "stitch",
    defaults: {
      ...(pageVisualMap.defaults || {}),
      pageClass: styleClass,
      designProvider: "stitch"
    },
    pageTypes: {
      ...(pageVisualMap.pageTypes || {}),
      entry_page: {
        ...(pageVisualMap.pageTypes?.entry_page || {}),
        pageClass: `${styleClass} style-stitch-entry`
      },
      single_choice_page: {
        ...(pageVisualMap.pageTypes?.single_choice_page || {}),
        pageClass: `${styleClass} style-stitch-choice`
      },
      multi_choice_page: {
        ...(pageVisualMap.pageTypes?.multi_choice_page || {}),
        pageClass: `${styleClass} style-stitch-choice`
      },
      paywall_page: {
        ...(pageVisualMap.pageTypes?.paywall_page || {}),
        pageClass: `${styleClass} style-stitch-paywall`
      }
    },
    pages: {
      ...(pageVisualMap.pages || {}),
      ...Object.fromEntries(
        pages.map((page) => [
          page.id,
          (() => {
            const existing = pageVisualMap.pages?.[page.id] || {};
            const mapping = stitchMappingForPage(page, stitchHandoff);
            const mappedClass = typeof mapping?.pageClass === "string" ? mapping.pageClass : "";
            const componentSkin = mapping?.componentSkin;
            const skinClass = typeof componentSkin?.skinClass === "string" ? componentSkin.skinClass : "";
            return {
              ...existing,
              designProvider: "stitch",
              stitchSourceScreen: mapping?.sourceScreen,
              stitchSections: mapping?.sections,
              stitchHints: mapping?.hints,
              componentSkin,
              skinVars: skinCssVars(componentSkin),
              variant: mapping?.variant || existing.variant || page.variant,
              pageClass: [
                existing.pageClass,
                styleClass,
                mappedClass,
                skinClass,
                page.id === "age_group" ? "style-stitch-age-grid" : "",
                page.pageType === "summary_page" ? "style-stitch-summary" : "",
                page.pageType === "plan_ready_page" ? "style-stitch-plan-ready" : ""
              ].filter(Boolean).join(" ")
            };
          })()
        ])
      )
    }
  };
}

function cssTokensFromTheme(theme) {
  return {
    primary: theme.colorTokens?.primary ?? neutralTheme.colorTokens.primary,
    accent: theme.colorTokens?.accent ?? neutralTheme.colorTokens.accent,
    bg: theme.colorSystem?.background ?? theme.colorTokens?.background ?? neutralTheme.colorTokens.background,
    surface: theme.colorTokens?.surface ?? neutralTheme.colorTokens.surface,
    surfaceAlt: theme.colorTokens?.surfaceAlt ?? neutralTheme.colorTokens.surfaceAlt,
    text: theme.colorTokens?.text ?? neutralTheme.colorTokens.text,
    muted: theme.colorTokens?.muted ?? neutralTheme.colorTokens.muted,
    border: theme.colorTokens?.border ?? neutralTheme.colorTokens.border,
    disabled: theme.colorTokens?.disabled ?? neutralTheme.colorTokens.disabled,
    warning: theme.colorTokens?.warning ?? neutralTheme.colorTokens.warning,
    info: theme.colorTokens?.info ?? neutralTheme.colorTokens.info,
    fontFamily: theme.typography?.fontFamily ?? neutralTheme.typography.fontFamily,
    headlineFamily: theme.typography?.headlineFamily ?? theme.typography?.fontFamily ?? neutralTheme.typography.fontFamily,
    headingWeight: theme.typography?.headingWeight ?? neutralTheme.typography.headingWeight,
    bodyWeight: theme.typography?.bodyWeight ?? neutralTheme.typography.bodyWeight,
    cardRadius: theme.shape?.cardRadius ?? neutralTheme.shape.cardRadius,
    controlRadius: theme.shape?.controlRadius ?? neutralTheme.shape.controlRadius,
    buttonRadius: theme.shape?.buttonRadius ?? neutralTheme.shape.buttonRadius
  };
}

function relativeLuminance(hex) {
  const parsed = String(hex || "").trim().match(/^#?([0-9a-f]{6})$/i);
  if (!parsed) return 1;
  const [r, g, b] = parsed[1].match(/.{2}/g).map((value) => parseInt(value, 16) / 255);
  const [lr, lg, lb] = [r, g, b].map((value) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function createRootCss(theme) {
  const tokens = cssTokensFromTheme(theme);
  const bodyImageBackground = relativeLuminance(tokens.bg) < 0.42 ? "#07080A" : "#FFFFFF";
  const imageOptionBackground = bodyImageBackground;

  return `:root {
  --primary: ${tokens.primary};
  --accent: ${tokens.accent};
  --bg: ${tokens.bg};
  --surface: ${tokens.surface};
  --surface-alt: ${tokens.surfaceAlt};
  --text: ${tokens.text};
  --muted: ${tokens.muted};
  --border: ${tokens.border};
  --disabled: ${tokens.disabled};
  --warning: ${tokens.warning};
  --info: ${tokens.info};
  --body-image-bg: ${bodyImageBackground};
  --image-option-bg: ${imageOptionBackground};
  --card-radius: ${tokens.cardRadius}px;
  --control-radius: ${tokens.controlRadius}px;
  --button-radius: ${tokens.buttonRadius}px;
  --headline-family: ${tokens.headlineFamily};
  --heading-weight: ${tokens.headingWeight};
  --body-weight: ${tokens.bodyWeight};
  font-family: ${tokens.fontFamily};
  color: var(--text);
  background: var(--bg);
}`;
}

function injectThemeCss(theme) {
  const stylesPath = path.join(appOutputDir, "src/styles.css");
  const styles = readText(stylesPath);
  const rootBlock = createRootCss(theme);
  const nextStyles = styles.replace(/^:root\s*\{[\s\S]*?\n\}/, rootBlock);
  if (nextStyles === styles) {
    throw new Error("Could not inject runtime theme: missing :root block in app-template/src/styles.css");
  }
  writeText(stylesPath, nextStyles);
}

function writeIndexHtml(productName) {
  const indexPath = path.join(appOutputDir, "index.html");
  const indexHtml = readText(indexPath).replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(productName)}</title>`);
  writeText(indexPath, indexHtml);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function writeTemplateConfig({ theme, funnelConfig, copy, pageVisualMap, iconMap, assetsManifest }) {
  writeText(
    path.join(appOutputDir, "src/runtime/templateConfig.ts"),
    `import { normalizeRuntimeConfig } from "./normalizeRuntimeConfig";
import type { AssetsManifest, CopyConfig, FunnelConfig, IconMap, PageVisualMap, Theme } from "./types";

export const templateTheme = ${JSON.stringify(theme, null, 2)} as Theme;

export const funnelConfig = ${JSON.stringify(funnelConfig, null, 2)} as FunnelConfig;

export const copyConfig = ${JSON.stringify(copy, null, 2)} as CopyConfig;

export const pageVisualMap = ${JSON.stringify(pageVisualMap, null, 2)} as PageVisualMap;

export const iconMap = ${JSON.stringify(iconMap, null, 2)} as IconMap;

export const assetsManifest = ${JSON.stringify(assetsManifest, null, 2)} as AssetsManifest;

export const templateConfig: FunnelConfig = normalizeRuntimeConfig({
  funnel: funnelConfig,
  copy: copyConfig,
  theme: templateTheme,
  pageVisualMap,
  iconMap,
  assetsManifest
});
`
  );
}

function writeAppConfigPackage({ theme, funnelConfig, copy, pageVisualMap, iconMap, assetsManifest }) {
  writeJson("outputs/config/app-config/funnel.config.json", funnelConfig);
  writeJson("outputs/config/app-config/copy.json", copy);
  writeJson("outputs/config/app-config/theme.json", theme);
  writeJson("outputs/config/app-config/page-visual-map.json", pageVisualMap);
  writeJson("outputs/config/app-config/icon-map.json", iconMap);
  writeJson("outputs/config/app-config/assets-manifest.json", assetsManifest);
  writeText(
    abs("outputs/config/app-config/README.md"),
    `# Generated App Config

These files are the normalized source inputs injected into the React Runtime package at \`outputs/app\`.

The runtime source code lives in \`runtime/react-funnel-runtime/app-template\`. This folder should contain only product-specific config mirrors for QA.
`
  );
}

function writeTemplateConfigPackage() {
  writeJson("apps/template/funnel.config.json", neutralFunnelConfig);
  writeJson("apps/template/copy.json", copyFromFunnelConfig(neutralFunnelConfig));
  writeJson("apps/template/theme.json", neutralTheme);
  writeJson("apps/template/page-visual-map.json", neutralPageVisualMap);
  writeJson("apps/template/icon-map.json", neutralIconMap);
  writeJson("apps/template/assets-manifest.json", neutralAssetsManifest);
  writeText(
    abs("apps/template/README.md"),
    `# App Template Config Package

This folder is a neutral copyable app-level configuration package.

Runtime source code now lives in \`runtime/react-funnel-runtime/app-template\`. Product runs should replace these JSON files through the workflow instead of editing React component code.
`
  );
}

const stitchHandoff = readStitchHandoff();
const runtimeFunnelConfig = readJsonIfExists("outputs/config/funnel.config.json", neutralFunnelConfig);
const runtimeCopy = exists("outputs/page-map/page-map.json")
  ? copyFromFunnelConfig(runtimeFunnelConfig)
  : readJsonIfExists("outputs/config/app-config/copy.json", copyFromFunnelConfig(runtimeFunnelConfig));
const baseRuntimeTheme = readJsonIfExists("outputs/design/theme.json", readJsonIfExists("outputs/config/app-config/theme.json", neutralTheme));
const runtimeTheme = withStitchTheme(baseRuntimeTheme, stitchHandoff);
const baseRuntimePageVisualMap = exists("outputs/page-map/page-map.json")
  ? pageVisualMapFromFunnelConfig(runtimeFunnelConfig)
  : readJsonIfExists("outputs/config/app-config/page-visual-map.json", pageVisualMapFromFunnelConfig(runtimeFunnelConfig));
const runtimePageVisualMap = withStitchVisualMap(baseRuntimePageVisualMap, stitchHandoff, runtimeFunnelConfig);
const runtimeIconMap = exists("outputs/page-map/page-map.json")
  ? neutralIconMap
  : readJsonIfExists("outputs/config/app-config/icon-map.json", neutralIconMap);
const runtimeAssetsManifest = normalizeAssetManifest(
  readJsonIfExists("outputs/assets/asset-manifest.json", readJsonIfExists("outputs/config/app-config/assets-manifest.json", neutralAssetsManifest))
);
const runtimeProductName =
  runtimeCopy.product ??
  runtimeFunnelConfig?.product?.appName ??
  runtimeFunnelConfig?.product?.productName ??
  "Web2App Funnel";

copyDirectory(runtimeTemplateDir, appOutputDir);
writeIndexHtml(runtimeProductName);
injectThemeCss(runtimeTheme);
writeTemplateConfig({
  theme: runtimeTheme,
  funnelConfig: runtimeFunnelConfig,
  copy: runtimeCopy,
  pageVisualMap: runtimePageVisualMap,
  iconMap: runtimeIconMap,
  assetsManifest: runtimeAssetsManifest
});
writeAppConfigPackage({
  theme: runtimeTheme,
  funnelConfig: runtimeFunnelConfig,
  copy: runtimeCopy,
  pageVisualMap: runtimePageVisualMap,
  iconMap: runtimeIconMap,
  assetsManifest: runtimeAssetsManifest
});
writeTemplateConfigPackage();
copyRuntimeAssets(runtimeAssetsManifest);

console.log(`Created React runtime app from package: ${path.relative(root, runtimeTemplateDir)} -> ${path.relative(root, appOutputDir)}`);
