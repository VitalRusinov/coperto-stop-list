import type { MenuItem, StopItemPayload } from "../model";

export type MenuListFilters = {
  shop?: string;
  status?: string;
};

async function errorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
  } catch {
    return "Неизвестная ошибка";
  }
  return "Неизвестная ошибка";
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }
  return (await response.json()) as T;
}

export async function getMenuItems(
  filters: MenuListFilters = {},
): Promise<MenuItem[]> {
  const params = new URLSearchParams();
  if (filters.shop !== undefined) params.set("shop", filters.shop);
  if (filters.status !== undefined) params.set("status", filters.status);
  const query = params.toString();
  const response = await fetch(`/api/menu-items${query ? `?${query}` : ""}`);
  return parseJson<MenuItem[]>(response);
}

export async function stopMenuItem(
  id: string,
  payload: StopItemPayload,
): Promise<MenuItem> {
  const response = await fetch(`/api/menu-items/${id}/stop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<MenuItem>(response);
}

export async function resumeMenuItem(id: string): Promise<MenuItem> {
  const response = await fetch(`/api/menu-items/${id}/resume`, {
    method: "POST",
  });
  return parseJson<MenuItem>(response);
}
