"use client";

import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { resumeMenuItem } from "@/entities/menu/api";
import type { MenuItem } from "@/entities/menu/model";
import { menuKeys } from "./queries";
import { useUiStore } from "./uiStore";

type ResumeItemContext = {
  previous: [QueryKey, MenuItem[] | undefined][];
};

function applyResume(item: MenuItem): MenuItem {
  return {
    ...item,
    status: { kind: "available" },
    updatedAt: new Date().toISOString(),
  };
}

export function useResumeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeMenuItem(id),
    onMutate: async (id): Promise<ResumeItemContext> => {
      await queryClient.cancelQueries({ queryKey: menuKeys.all });
      const previous = queryClient.getQueriesData<MenuItem[]>({
        queryKey: menuKeys.all,
      });

      queryClient.setQueriesData<MenuItem[]>(
        { queryKey: menuKeys.all },
        (current) =>
          current?.map((item) => (item.id === id ? applyResume(item) : item)),
      );

      return { previous };
    },
    onError: (error, _id, context) => {
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
