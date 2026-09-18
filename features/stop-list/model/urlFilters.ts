import type { MenuListFilters } from "@/entities/menu/api";

type SearchParamValue = string | string[] | undefined;

export type MenuFilterSearchParams = {
  shop?: SearchParamValue;
  status?: SearchParamValue;
};

function firstParam(value: SearchParamValue): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined || raw === "") return undefined;
  return raw;
}

export function menuFiltersFromSearchParams(
  searchParams: MenuFilterSearchParams,
): MenuListFilters {
  const shop = firstParam(searchParams.shop);
  const status = firstParam(searchParams.status);

  return {
    ...(shop !== undefined ? { shop } : {}),
    ...(status !== undefined ? { status } : {}),
  };
}

export function menuFiltersHref(
  pathname: string,
  filters: MenuListFilters,
): string {
  const params = new URLSearchParams();
  if (filters.shop !== undefined && filters.shop !== "") {
    params.set("shop", filters.shop);
  }
  if (filters.status !== undefined && filters.status !== "") {
    params.set("status", filters.status);
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
