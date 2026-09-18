"use client";

import { useQuery } from "@tanstack/react-query";
import type { MenuListFilters } from "@/entities/menu/api";
import { menuListQueryOptions } from "./queries";

export function useMenuList(filters: MenuListFilters) {
  const query = useQuery(menuListQueryOptions(filters));

  return {
    ...query,
    showSkeleton: query.isPending,
  };
}
