export const SHOPS = ["kitchen", "bar", "pastry"] as const;
export type Shop = (typeof SHOPS)[number];

export const STOP_REASONS = [
  "out_of_stock",
  "equipment",
  "quality",
  "menu_change",
] as const;
export type StopReason = (typeof STOP_REASONS)[number];

export const MENU_STATUSES = ["available", "stopped"] as const;
export type MenuStatus = (typeof MENU_STATUSES)[number];

export type MenuItemStatus =
  | { kind: Extract<MenuStatus, "available"> }
  | {
      kind: Extract<MenuStatus, "stopped">;
      reason: StopReason;
      until: string | null;
    };

export interface MenuItem {
  id: string;
  title: string;
  shop: Shop;
  stock: number;
  status: MenuItemStatus;
  updatedAt: string;
}

export interface StopItemPayload {
  reason: StopReason;
  until: string | null;
}
