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
