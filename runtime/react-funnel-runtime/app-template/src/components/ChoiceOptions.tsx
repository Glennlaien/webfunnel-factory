import { useState } from "react";
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

function resolvePageImage(page: FunnelPage) {
  const asset = page.asset;
  const assets = page.assets || {};
  const visual = page.visual || {};
  const candidates = [
    page.heroImage,
    page.image,
    page.imageUrl,
    page.bottomImage,
    asset?.url,
    asset?.src,
    asset?.path,
    assets.hero?.url,
    assets.hero?.src,
    assets.bottom?.url,
    assets.bottom?.src,
    visual.image,
    visual.imageUrl,
  ];
  return candidates.find((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function BottomHeroImage({ page }: { page: FunnelPage }) {
  const [failed, setFailed] = useState(false);
  const src = resolvePageImage(page);
  return (
    <div className="choice-bottom-hero" aria-hidden="true">
      {src && !failed ? (
        <img src={src} alt="" onError={() => setFailed(true)} />
      ) : (
        <div className="choice-bottom-hero-placeholder">
          <span>{imageInitial(page.title)}</span>
        </div>
      )}
    </div>
  );
}

export function ChoiceOptions({ page, mode, selectedValues, disabled = false, onToggle }: ChoiceOptionsProps) {
  const selected = new Set(selectedValues);
  const variant = page.variant || "plain_list";
  const isAgeGroup = page.id === "age_group";
  const isBottomImage = variant === "bottom_image";

  if (variant === "image_grid") {
    return (
      <div className={[mode === "multi" ? "choice-image-grid multi" : "choice-image-grid", isAgeGroup ? "age-choice-grid" : ""].filter(Boolean).join(" ")}>
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
    <div className={isBottomImage ? "choice-bottom-image-layout" : undefined}>
      <div className={variant === "icon_list" ? "choice-list icon-list" : isBottomImage ? "choice-list bottom-image-list" : "choice-list plain-list"}>
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
              {mode === "multi" || isBottomImage ? <span className="choice-check" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>
      {isBottomImage ? <BottomHeroImage page={page} /> : null}
    </div>
  );
}
