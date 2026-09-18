"use client";

import { Button } from "@/shared/ui";
import {
  useMenuFilters,
  useMenuList,
  useStopItem,
  useUiStore,
  type MenuFilterSearchParams,
} from "../model";
import { Filters } from "./Filters";
import { StopListItem } from "./StopListItem";
import { StopReasonPanel } from "./StopReasonPanel";
import { STOP_LIST_GRID, StopListTable } from "./StopListTable";

const SKELETON_ROWS = 8;

export function StopList({ shop, status }: MenuFilterSearchParams) {
  const { filters, setShop, setStatus } = useMenuFilters({ shop, status });
  const { data, error, refetch, showSkeleton, isError } = useMenuList(filters);
  const stopItem = useStopItem();
  const selectedId = useUiStore((state) => state.selectedId);
  const openPanel = useUiStore((state) => state.openPanel);
  const closePanel = useUiStore((state) => state.closePanel);
  const selectedItem = data?.find((item) => item.id === selectedId) ?? null;

  let tableBody = null;
  if (showSkeleton) {
    tableBody = <TableSkeleton />;
  } else if (isError) {
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
        isSaving={stopItem.isPending && stopItem.variables?.id === item.id}
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
      {selectedItem ? (
        <>
          <button
            type="button"
            className="absolute inset-0 right-[400px] z-10 cursor-default bg-transparent"
            aria-label="Закрыть панель"
            onClick={closePanel}
          />
          <div className="absolute inset-y-0 right-0 z-20">
            <StopReasonPanel item={selectedItem} onClose={closePanel} />
          </div>
        </>
      ) : null}
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
