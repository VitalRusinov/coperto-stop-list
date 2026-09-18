"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type DefaultValues } from "react-hook-form";
import {
  SHOP_LABELS,
  STOP_REASON_LABELS,
  STOP_REASONS,
  stopItemPayloadSchema,
  type MenuItem,
  type StopItemPayload,
} from "@/entities/menu/model";
import { Button, Select, UntilSlotList } from "@/shared/ui";

type StopReasonPanelProps = {
  item: MenuItem;
  onClose: () => void;
  isResuming: boolean;
  isStopping: boolean;
  isSaving: boolean;
  onResume: () => void;
  onStop: (payload: StopItemPayload) => void;
  onSave: (payload: StopItemPayload) => void;
};

const ZERO_STOCK_HINT = "Нельзя вернуть в продажу при нулевом остатке";

const REASON_OPTIONS = STOP_REASONS.map((value) => ({
  value,
  label: STOP_REASON_LABELS[value],
}));

function defaultValuesFromItem(item: MenuItem): DefaultValues<StopItemPayload> {
  if (item.status.kind !== "stopped") {
    return { reason: undefined, until: undefined };
  }
  return {
    reason: item.status.reason,
    until: item.status.until,
  };
}

export function StopReasonPanel({
  item,
  onClose,
  isResuming,
  isStopping,
  isSaving,
  onResume,
  onStop,
  onSave,
}: StopReasonPanelProps) {
  const stopped = item.status.kind === "stopped";
  const stockZero = item.stock === 0;
  const { control, handleSubmit } = useForm<StopItemPayload>({
    resolver: zodResolver(stopItemPayloadSchema),
    defaultValues: defaultValuesFromItem(item),
  });

  return (
    <aside
      data-stop-panel
      className="flex h-full w-[400px] flex-col border-l border-border bg-surface shadow-lg"
    >
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-title font-title text-foreground">
            {item.title}
          </p>
          <p className="mt-1 text-label text-secondary">
            {SHOP_LABELS[item.shop]} · остаток {item.stock}
          </p>
          <p className="mt-1 text-label text-foreground">
            {stopped ? "Стоп" : "В продаже"}
          </p>
        </div>
        <Button variant="ghost" aria-label="Закрыть" onClick={onClose}>
          ×
        </Button>
      </div>
      <form
        className="flex min-h-0 flex-1 flex-col"
        noValidate
        onSubmit={handleSubmit((payload) => {
          if (stopped) {
            onSave(payload);
          } else {
            onStop(payload);
          }
        })}
      >
        <div className="flex flex-col gap-4 p-4">
          <Controller
            name="reason"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                label="Причина"
                options={REASON_OPTIONS}
                placeholder="Выберите причину"
                error={fieldState.error?.message}
                name={field.name}
                value={field.value ?? ""}
                onBlur={field.onBlur}
                onChange={(event) => {
                  const next = event.target.value;
                  field.onChange(next === "" ? undefined : next);
                }}
              />
            )}
          />
          <Controller
            name="until"
            control={control}
            render={({ field, fieldState }) => (
              <UntilSlotList
                label="Срок"
                error={fieldState.error?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="mt-auto flex flex-col items-start gap-2 p-4">
          {stopped ? (
            <>
              <span
                className="inline-flex"
                title={stockZero ? ZERO_STOCK_HINT : undefined}
              >
                <Button
                  variant="neutral"
                  disabled={stockZero}
                  loading={isResuming}
                  onClick={onResume}
                >
                  {isResuming ? "Сохраняем…" : "Вернуть в продажу"}
                </Button>
              </span>
              <Button type="submit" variant="accent" loading={isSaving}>
                {isSaving ? "Сохраняем…" : "Сохранить"}
              </Button>
            </>
          ) : (
            <Button type="submit" variant="accent" loading={isStopping}>
              {isStopping ? "Сохраняем…" : "В стоп-лист"}
            </Button>
          )}
        </div>
      </form>
    </aside>
  );
}
