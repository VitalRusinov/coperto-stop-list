import { SHOP_LABELS, type MenuItem } from "@/entities/menu/model";
import { Button } from "@/shared/ui";

type StopReasonPanelProps = {
  item: MenuItem;
  onClose: () => void;
};

export function StopReasonPanel({ item, onClose }: StopReasonPanelProps) {
  const stopped = item.status.kind === "stopped";

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
    </aside>
  );
}
