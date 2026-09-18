import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { act, type ReactNode } from "react";
import { afterEach, expect, test, vi } from "vitest";
import { stopMenuItem } from "@/entities/menu/api";
import type { MenuItem } from "@/entities/menu/model";
import { menuKeys } from "./queries";
import { useStopItem } from "./useStopItem";
import { useUiStore } from "./uiStore";

vi.mock("@/entities/menu/api", () => ({
  getMenuItems: vi.fn(),
  resumeMenuItem: vi.fn(),
  stopMenuItem: vi.fn(),
}));

const item: MenuItem = {
  id: "espresso",
  title: "Эспрессо",
  shop: "bar",
  stock: 40,
  status: { kind: "available" },
  updatedAt: "2026-09-18T08:00:00.000Z",
};

const payload = { reason: "equipment" as const, until: null };

afterEach(() => {
  useUiStore.setState({ selectedId: null, toasts: [] });
});

test("rolls back an optimistic stop when the request fails", async () => {
  let rejectStop: ((error: Error) => void) | undefined;
  vi.mocked(stopMenuItem).mockImplementation(
    () =>
      new Promise((_, reject) => {
        rejectStop = reject;
      }),
  );

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const listKey = menuKeys.list({});
  queryClient.setQueryData(listKey, [item]);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  const { result } = renderHook(() => useStopItem(), { wrapper: Wrapper });

  act(() => {
    result.current.mutate({ id: item.id, payload });
  });

  await waitFor(() => {
    const cached = queryClient.getQueryData<MenuItem[]>(listKey);
    expect(cached?.[0]?.status).toEqual({
      kind: "stopped",
      reason: payload.reason,
      until: payload.until,
    });
  });

  act(() => {
    rejectStop?.(new Error("Не удалось сохранить"));
  });

  await waitFor(() => {
    expect(queryClient.getQueryData<MenuItem[]>(listKey)).toEqual([item]);
  });
});
