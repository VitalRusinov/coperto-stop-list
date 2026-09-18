"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  menuFiltersFromSearchParams,
  menuFiltersHref,
  type MenuFilterSearchParams,
} from "./urlFilters";

export function useMenuFilters(searchParams: MenuFilterSearchParams) {
  const router = useRouter();
  const pathname = usePathname();
  const filters = menuFiltersFromSearchParams(searchParams);

  const setShop = useCallback(
    (shop: string | undefined) => {
      router.push(menuFiltersHref(pathname, { ...filters, shop }));
    },
    [filters, pathname, router],
  );

  const setStatus = useCallback(
    (status: string | undefined) => {
      router.push(menuFiltersHref(pathname, { ...filters, status }));
    },
    [filters, pathname, router],
  );

  return { filters, setShop, setStatus };
}
