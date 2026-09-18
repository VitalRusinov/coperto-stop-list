import type { Shop, StopReason } from "./types";

export const SHOP_LABELS: Record<Shop, string> = {
  kitchen: "Кухня",
  bar: "Бар",
  pastry: "Кондитерская",
};

export const STOP_REASON_LABELS: Record<StopReason, string> = {
  out_of_stock: "закончились продукты",
  equipment: "сломалось оборудование",
  quality: "вопросы к качеству",
  menu_change: "выведена из меню смены",
};
