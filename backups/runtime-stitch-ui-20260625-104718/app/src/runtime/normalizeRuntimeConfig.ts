import type { FunnelConfig, OptionItem, RuntimeConfigInput } from "./types";

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
    const icon = input.iconMap?.optionIcons?.[`${pageId}.${value}`];
    const directAsset = input.assetsManifest?.assets?.[`${pageId}.${value}`];
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
