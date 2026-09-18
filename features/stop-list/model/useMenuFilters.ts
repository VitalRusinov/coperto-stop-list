"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { menuFiltersFromSearchParams, menuFiltersHref } from "./urlFilters";

export function useMenuFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () =>
      menuFiltersFromSearchParams({
        shop: searchParams.get("shop") ?? undefined,
        status: searchParams.get("status") ?? undefined,
      }),
    [searchParams],
  );

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
