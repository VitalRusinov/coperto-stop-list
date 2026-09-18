import { useSyncExternalStore, type KeyboardEvent } from "react";
import { AnimatePresence } from "framer-motion";
import { SHOP_LABELS, type MenuItem } from "@/entities/menu/model";
import { Badge } from "@/shared/ui";
import { formatSlotLabel } from "@/shared/ui/untilSlots";
import { STOP_LIST_GRID } from "./StopListTable";

const subscribeNever = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

type StopListItemProps = {
  item: MenuItem;
  index: number;
  selected?: boolean;
  isSaving?: boolean;
  onSelect: (id: string) => void;
};

export function StopListItem({
  item,
  index,
  selected = false,
  isSaving = false,
  onSelect,
}: StopListItemProps) {
  const stopped = item.status.kind === "stopped";
  const zebra = index % 2 === 1;

  let rowBg = "bg-surface";
  if (selected) rowBg = "bg-accent/10";
  else if (stopped) rowBg = "bg-border/40";
  else if (zebra) rowBg = "bg-background";

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onSelect(item.id);
  }

  return (
    <div
      role="row"
      tabIndex={0}
      aria-selected={selected}
      className={`${STOP_LIST_GRID} cursor-pointer py-2.5 text-label ${rowBg} ${
        stopped ? "text-secondary" : "text-foreground"
      } focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent`}
      onClick={() => onSelect(item.id)}
      onKeyDown={handleKeyDown}
    >
      <div role="cell" className="min-w-0 truncate">
        {item.title}
      </div>
      <div role="cell">{SHOP_LABELS[item.shop]}</div>
      <div role="cell">{item.stock}</div>
      <div role="cell">
        <StatusCell item={item} isSaving={isSaving} />
      </div>
      <div role="cell">
        {item.status.kind === "stopped" ? (
          <UntilText until={item.status.until} />
        ) : null}
      </div>
    </div>
  );
}

function StatusCell({ item, isSaving }: { item: MenuItem; isSaving: boolean }) {
  let badge = null;
  if (isSaving) {
    badge = <Badge key="saving" variant="saving" />;
  } else if (item.status.kind === "stopped") {
    badge = <Badge key="stop" variant="stop" />;
  }

  return (
    <AnimatePresence initial={false} mode="wait">
      {badge}
    </AnimatePresence>
  );
}

function UntilText({ until }: { until: string | null }) {
  const isClient = useIsClient();
  if (until === null) return "до конца смены";
  if (!isClient) return null;
  return formatSlotLabel(new Date(until), new Date());
}
