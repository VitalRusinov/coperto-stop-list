import { useId, type KeyboardEvent } from "react";
import {
  MENU_STATUSES,
  SHOP_LABELS,
  SHOPS,
  type MenuStatus,
} from "@/entities/menu/model";
import { Button } from "@/shared/ui";

const ALL_LABEL = "Все";

const STATUS_FILTER_LABELS: Record<MenuStatus, string> = {
  available: "В продаже",
  stopped: "В стоп-листе",
};

type FilterOption = {
  value: string | undefined;
  label: string;
};

const SHOP_OPTIONS: FilterOption[] = [
  { value: undefined, label: ALL_LABEL },
  ...SHOPS.map((shop) => ({ value: shop, label: SHOP_LABELS[shop] })),
];

const STATUS_OPTIONS: FilterOption[] = [
  { value: undefined, label: ALL_LABEL },
  ...MENU_STATUSES.map((status) => ({
    value: status,
    label: STATUS_FILTER_LABELS[status],
  })),
];

type FiltersProps = {
  shop?: string;
  status?: string;
  onShopChange: (shop: string | undefined) => void;
  onStatusChange: (status: string | undefined) => void;
};

export function Filters({
  shop,
  status,
  onShopChange,
  onStatusChange,
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <FilterGroup
        label="Цех"
        value={shop}
        options={SHOP_OPTIONS}
        onChange={onShopChange}
      />
      <FilterGroup
        label="Статус"
        value={status}
        options={STATUS_OPTIONS}
        onChange={onStatusChange}
      />
    </div>
  );
}

type FilterGroupProps = {
  label: string;
  value: string | undefined;
  options: FilterOption[];
  onChange: (value: string | undefined) => void;
};

function FilterGroup({ label, value, options, onChange }: FilterGroupProps) {
  const labelId = useId();
  const selectedIndex = options.findIndex((option) => option.value === value);
  const tabIndex = selectedIndex === -1 ? 0 : selectedIndex;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowUp"
    ) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const radios = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]'),
    );
    const currentIndex = radios.indexOf(target);
    if (currentIndex < 0) return;

    event.preventDefault();
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (currentIndex + delta + options.length) % options.length;
    onChange(options[nextIndex].value);
    radios[nextIndex]?.focus();
  }

  return (
    <div className="flex flex-col gap-1">
      <p id={labelId} className="text-label font-medium text-foreground">
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-orientation="horizontal"
        className="flex flex-wrap gap-2"
        onKeyDown={handleKeyDown}
      >
        {options.map((option, index) => {
          const checked = option.value === value;

          return (
            <Button
              key={option.value ?? "all"}
              variant={checked ? "neutral" : "ghost"}
              role="radio"
              aria-checked={checked}
              tabIndex={index === tabIndex ? 0 : -1}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
