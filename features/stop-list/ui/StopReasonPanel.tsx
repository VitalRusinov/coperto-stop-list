import { SHOP_LABELS, type MenuItem } from "@/entities/menu/model";
import { Button } from "@/shared/ui";

type StopReasonPanelProps = {
  item: MenuItem;
  onClose: () => void;
  isResuming?: boolean;
  onResume?: () => void;
};

const ZERO_STOCK_HINT = "Нельзя вернуть в продажу при нулевом остатке";

export function StopReasonPanel({
  item,
  onClose,
  isResuming = false,
  onResume,
}: StopReasonPanelProps) {
  const stopped = item.status.kind === "stopped";
  const stockZero = item.stock === 0;

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
      {stopped ? (
        <div className="mt-auto p-4">
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
        </div>
      ) : null}
    </aside>
  );
}
