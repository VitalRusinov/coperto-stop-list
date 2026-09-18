import { queryOptions } from "@tanstack/react-query";
import { getMenuItems, type MenuListFilters } from "@/entities/menu/api";

export const menuKeys = {
  all: ["menu-items"] as const,
  list: (filters: MenuListFilters) =>
    [...menuKeys.all, "list", filters] as const,
};

export function menuListQueryOptions(filters: MenuListFilters) {
  return queryOptions({
    queryKey: menuKeys.list(filters),
    queryFn: () => getMenuItems(filters),
    retry: false,
  });
}
