"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { buildUntilSlots } from "./untilSlots";

const END_OF_SHIFT_LABEL = "До конца смены";

type UntilSlotListProps = {
  label: string;
  error?: string;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  onBlur?: () => void;
  now?: Date;
};

export function UntilSlotList({
  label,
  error,
  value,
  onChange,
  onBlur,
  now,
}: UntilSlotListProps) {
  const listId = useId();
  const labelId = `${listId}-label`;
  const errorId = `${listId}-error`;
  const invalid = Boolean(error);
  const [slots] = useState(() => buildUntilSlots(now ?? new Date()));
  const listRef = useRef<HTMLDivElement>(null);

  const options: { until: string | null; label: string }[] = [
    { until: null, label: END_OF_SHIFT_LABEL },
    ...slots.map((slot) => ({ until: slot.until, label: slot.label })),
  ];

  const selectedIndex = options.findIndex((option) => option.until === value);

  useEffect(() => {
    if (selectedIndex < 0) return;
    const option = listRef.current?.children[selectedIndex];
    if (option instanceof HTMLElement) {
      option.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  function moveSelection(delta: number) {
    const fallback = delta > 0 ? 0 : options.length - 1;
    const current = selectedIndex < 0 ? fallback - delta : selectedIndex;
    const next = Math.min(options.length - 1, Math.max(0, current + delta));
    onChange(options[next].until);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSelection(1);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection(-1);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <span id={labelId} className="text-label font-medium text-foreground">
        {label}
      </span>
      <div
        ref={listRef}
        id={listId}
        role="listbox"
        tabIndex={0}
        aria-labelledby={labelId}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        aria-activedescendant={
          selectedIndex >= 0 ? `${listId}-option-${selectedIndex}` : undefined
        }
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        className={`h-40 snap-y snap-mandatory overflow-y-auto rounded-md border bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          invalid ? "border-error" : "border-border"
        }`}
      >
        {options.map((option, index) => {
          const selected = option.until === value;
          return (
            <div
              key={option.until ?? "end-of-shift"}
              id={`${listId}-option-${index}`}
              role="option"
              aria-selected={selected}
              className={`flex h-10 shrink-0 cursor-pointer snap-start items-center px-3 text-label ${
                selected ? "bg-accent/10 text-foreground" : "text-foreground"
              }`}
              onClick={() => onChange(option.until)}
            >
              {option.label}
            </div>
          );
        })}
      </div>
      {invalid ? (
        <p id={errorId} className="text-[length:var(--error-size)] text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
