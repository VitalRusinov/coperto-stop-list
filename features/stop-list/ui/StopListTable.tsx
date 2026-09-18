import type { ReactNode } from "react";

export const STOP_LIST_GRID =
  "grid grid-cols-[minmax(12ch,1fr)_7.5rem_5.5rem_10rem_15rem] items-center gap-x-4 px-4";

const COLUMNS = ["Название", "Цех", "Остаток", "Статус", "Срок"] as const;

type StopListTableProps = {
  children: ReactNode;
};

export function StopListTable({ children }: StopListTableProps) {
  return (
    <div
      role="table"
      aria-label="Стоп-лист"
      className="overflow-hidden rounded-md border border-border bg-surface"
    >
      <div
        role="row"
        className={`${STOP_LIST_GRID} border-b border-border py-2 text-label font-medium text-secondary`}
      >
        {COLUMNS.map((column) => (
          <div
            key={column}
            role="columnheader"
            className={column === "Название" ? "min-w-0" : undefined}
          >
            {column}
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
