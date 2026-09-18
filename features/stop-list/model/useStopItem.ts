"use client";

import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { stopMenuItem } from "@/entities/menu/api";
import type { MenuItem, StopItemPayload } from "@/entities/menu/model";
import { menuKeys } from "./queries";
import { useUiStore } from "./uiStore";

export type StopItemVariables = {
  id: string;
  payload: StopItemPayload;
};

type StopItemContext = {
  previous: [QueryKey, MenuItem[] | undefined][];
};

function applyStop(item: MenuItem, payload: StopItemPayload): MenuItem {
  return {
    ...item,
    status: {
      kind: "stopped",
      reason: payload.reason,
      until: payload.until,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function useStopItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: StopItemVariables) =>
      stopMenuItem(id, payload),
    onMutate: async ({ id, payload }): Promise<StopItemContext> => {
      await queryClient.cancelQueries({ queryKey: menuKeys.all });
      const previous = queryClient.getQueriesData<MenuItem[]>({
        queryKey: menuKeys.all,
      });

      queryClient.setQueriesData<MenuItem[]>(
        { queryKey: menuKeys.all },
        (current) =>
          current?.map((item) =>
            item.id === id ? applyStop(item, payload) : item,
          ),
      );

      return { previous };
    },
    onError: (error, _variables, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      useUiStore
        .getState()
        .showToast(
          error instanceof Error ? error.message : "Не удалось сохранить",
        );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },
  });
}
