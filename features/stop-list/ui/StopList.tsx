"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/shared/ui";
import {
  useMenuFilters,
  useMenuList,
  useResumeItem,
  useStopItem,
  useUiStore,
  type MenuFilterSearchParams,
} from "../model";
import { Filters } from "./Filters";
import { StopListItem } from "./StopListItem";
import { StopReasonPanel } from "./StopReasonPanel";
import { STOP_LIST_GRID, StopListTable } from "./StopListTable";
import { ToastStack } from "./ToastStack";

const SKELETON_ROWS = 8;

export function StopList({ shop, status }: MenuFilterSearchParams) {
  const { filters, setShop, setStatus } = useMenuFilters({ shop, status });
  const { data, error, refetch, showSkeleton, isError } = useMenuList(filters);
  const stopItem = useStopItem();
  const resumeItem = useResumeItem();
  const selectedId = useUiStore((state) => state.selectedId);
  const openPanel = useUiStore((state) => state.openPanel);
  const closePanel = useUiStore((state) => state.closePanel);
  const selectedItem = data?.find((item) => item.id === selectedId) ?? null;

  let tableBody = null;
  if (showSkeleton) {
    tableBody = <TableSkeleton />;
  } else if (isError && !data) {
    const message =
      error instanceof Error ? error.message : "Не удалось загрузить список";
    tableBody = (
      <div className="flex flex-col items-start gap-3 px-4 py-8" role="row">
        <p className="text-label text-error" role="cell">
          {message}
        </p>
        <Button variant="neutral" onClick={() => void refetch()}>
          Повторить
        </Button>
      </div>
    );
  } else if (!data?.length) {
    tableBody = (
      <div className="px-4 py-8 text-label text-secondary" role="row">
        <div role="cell">Нет позиций по выбранным фильтрам.</div>
      </div>
    );
  } else {
    tableBody = data.map((item, index) => (
      <StopListItem
        key={item.id}
        item={item}
        index={index}
        selected={item.id === selectedId}
        isSaving={
          (stopItem.isPending && stopItem.variables?.id === item.id) ||
          (resumeItem.isPending && resumeItem.variables === item.id)
        }
        onSelect={openPanel}
      />
    ));
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-6 px-4 py-8">
        <h1 className="text-title font-title text-foreground">Стоп-лист</h1>
        <Filters
          shop={filters.shop}
          status={filters.status}
          onShopChange={setShop}
          onStatusChange={setStatus}
        />
        <StopListTable>{tableBody}</StopListTable>
      </div>
      <ToastStack />
      <AnimatePresence>
        {selectedItem ? (
          <motion.button
            key="stop-panel-backdrop"
            type="button"
            className="absolute inset-0 right-[400px] z-10 cursor-default bg-transparent"
            aria-label="Закрыть панель"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closePanel}
          />
        ) : null}
        {selectedItem ? (
          <motion.div
            key="stop-panel"
            className="absolute inset-y-0 right-0 z-20"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
          >
            <StopReasonPanel
              key={`${selectedItem.id}-${selectedItem.status.kind}`}
              item={selectedItem}
              onClose={closePanel}
              isResuming={
                resumeItem.isPending && resumeItem.variables === selectedItem.id
              }
              isStopping={
                stopItem.isPending && stopItem.variables?.id === selectedItem.id
              }
              isSaving={
                stopItem.isPending && stopItem.variables?.id === selectedItem.id
              }
              onResume={() => resumeItem.mutate(selectedItem.id)}
              onStop={(payload) =>
                stopItem.mutate({ id: selectedItem.id, payload })
              }
              onSave={(payload) =>
                stopItem.mutate({ id: selectedItem.id, payload })
              }
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function TableSkeleton() {
  return Array.from({ length: SKELETON_ROWS }, (_, index) => (
    <div
      key={index}
      role="row"
      aria-hidden="true"
      className={`${STOP_LIST_GRID} py-2.5 ${
        index % 2 === 1 ? "bg-background" : "bg-surface"
      }`}
    >
      <div role="cell" className="min-w-0">
        <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
      </div>
      <div role="cell">
        <div className="h-4 w-16 animate-pulse rounded bg-border" />
      </div>
      <div role="cell">
        <div className="h-4 w-8 animate-pulse rounded bg-border" />
      </div>
      <div role="cell">
        <div className="h-4 w-12 animate-pulse rounded bg-border" />
      </div>
      <div role="cell">
        <div className="h-4 w-24 animate-pulse rounded bg-border" />
      </div>
    </div>
  ));
}
