"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  Controller,
  useForm,
  useWatch,
  type DefaultValues,
} from "react-hook-form";
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

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "a[href]",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

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

function focusableIn(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => element.getClientRects().length > 0);
}

/** Панель блюда: причина, срок и кнопки стопа, resume и сохранения. */
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
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const resumeAfterExit = useRef(false);
  const [stopFormOpen, setStopFormOpen] = useState(stopped);
  const { control, handleSubmit, trigger, clearErrors, reset } =
    useForm<StopItemPayload>({
    resolver: zodResolver(stopItemPayloadSchema),
    defaultValues: defaultValuesFromItem(item),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const reason = useWatch({ control, name: "reason" });
  const until = useWatch({ control, name: "until" });
  const saveUnchanged =
    item.status.kind === "stopped" &&
    reason === item.status.reason &&
    until === item.status.until;

  useEffect(() => {
    dialogRef.current?.focus({ preventScroll: true });
  }, [item.id]);

  useEffect(() => {
    if (item.status.kind !== "stopped") return;
    if (resumeAfterExit.current) return;
    setStopFormOpen(true);
  }, [item.id, item.status.kind]);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const root = dialogRef.current;
    if (!root) return;
    const nodes = focusableIn(root);
    if (nodes.length === 0) {
      event.preventDefault();
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (event.shiftKey) {
      if (active === first || active === root) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <aside
      ref={dialogRef}
      data-stop-panel
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="flex h-full w-full flex-col overflow-y-auto border-l border-border bg-surface shadow-lg focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-6">
        <div className="min-w-0 flex-1">
          <p
            id={titleId}
            className="text-title font-title text-foreground"
          >
            {item.title}
          </p>
          <dl className="mt-5 flex flex-col gap-4">
            <div>
              <dt className="text-[length:var(--error-size)] font-medium tracking-wide text-secondary uppercase">
                Цех
              </dt>
              <dd className="mt-1 text-label font-medium text-foreground">
                {SHOP_LABELS[item.shop]}
              </dd>
            </div>
            <div>
              <dt className="text-[length:var(--error-size)] font-medium tracking-wide text-secondary uppercase">
                Остаток
              </dt>
              <dd className="mt-1 text-label font-medium text-foreground">
                {item.stock}
              </dd>
            </div>
            <div>
              <dt className="text-[length:var(--error-size)] font-medium tracking-wide text-secondary uppercase">
                Статус
              </dt>
              <dd
                className={`mt-1 flex items-center gap-2 text-label font-title ${
                  stopped ? "text-error" : "text-success"
                }`}
              >
                <span
                  className="size-2 shrink-0 rounded-full bg-current"
                  aria-hidden="true"
                />
                {stopped ? "Стоп" : "В продаже"}
              </dd>
            </div>
          </dl>
        </div>
        <Button
          variant="ghost"
          aria-label="Закрыть"
          className="px-2 text-title leading-none"
          onClick={onClose}
        >
          ×
        </Button>
      </div>
      <form
        className="flex flex-col"
        noValidate
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          if (!stopped && !stopFormOpen) {
            clearErrors();
            reset({ reason: undefined, until: undefined });
            setStopFormOpen(true);
            return;
          }
          void handleSubmit((payload) => {
            if (stopped) {
              onSave(payload);
            } else {
              onStop(payload);
            }
          })();
        }}
      >
        <div className="flex flex-col">
          <AnimatePresence
            onExitComplete={() => {
              if (!resumeAfterExit.current) return;
              resumeAfterExit.current = false;
              onResume();
            }}
          >
            {stopFormOpen ? (
              <motion.div
                key="stop-fields"
                className="overflow-hidden"
                initial={stopped ? false : { height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
              >
                <motion.div
                  className="flex flex-col gap-4 px-5 pt-5"
                  initial={stopped ? false : { y: "-100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{
                    type: "tween",
                    duration: 0.22,
                    ease: "easeOut",
                  }}
                >
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
                        onBlur={() => {
                          field.onBlur();
                          if (field.value) {
                            void trigger("reason");
                          }
                        }}
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
                        onBlur={() => {
                          field.onBlur();
                          if (field.value !== undefined) {
                            void trigger("until");
                          }
                        }}
                      />
                    )}
                  />
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div className="flex flex-col items-start gap-2 px-5 pt-4 pb-5">
            {stopped ? (
              <>
                <span
                  className="inline-flex"
                  title={stockZero ? ZERO_STOCK_HINT : undefined}
                >
                  <Button
                    variant="success"
                    disabled={stockZero}
                    loading={isResuming}
                    onClick={() => {
                      if (!stopFormOpen) {
                        onResume();
                        return;
                      }
                      resumeAfterExit.current = true;
                      setStopFormOpen(false);
                    }}
                  >
                    {isResuming ? "Сохраняем…" : "Вернуть в продажу"}
                  </Button>
                </span>
                <Button
                  type="submit"
                  variant="accent"
                  disabled={saveUnchanged}
                  loading={isSaving}
                >
                  {isSaving ? "Сохраняем…" : "Сохранить"}
                </Button>
              </>
            ) : (
              <Button type="submit" variant="accent" loading={isStopping}>
                {isStopping ? "Сохраняем…" : "В стоп-лист"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </aside>
  );
}
