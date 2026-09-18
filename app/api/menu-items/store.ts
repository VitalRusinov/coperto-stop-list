import type { MenuItem } from "@/entities/menu/model";

const SEED: MenuItem[] = [
  {
    id: "borscht",
    title: "Борщ",
    shop: "kitchen",
    stock: 14,
    status: { kind: "available" },
    updatedAt: "2026-09-18T08:00:00.000Z",
  },
  {
    id: "ribeye",
    title: "Стейк рибай",
    shop: "kitchen",
    stock: 0,
    status: { kind: "stopped", reason: "out_of_stock", until: null },
    updatedAt: "2026-09-18T09:15:00.000Z",
  },
  {
    id: "carbonara",
    title: "Паста карбонара",
    shop: "kitchen",
    stock: 8,
    status: { kind: "available" },
    updatedAt: "2026-09-18T08:05:00.000Z",
  },
  {
    id: "caesar",
    title: "Цезарь с курицей",
    shop: "kitchen",
    stock: 5,
    status: {
      kind: "stopped",
      reason: "equipment",
      until: "2026-09-18T18:00:00.000Z",
    },
    updatedAt: "2026-09-18T10:00:00.000Z",
  },
  {
    id: "tom-yum",
    title: "Том ям",
    shop: "kitchen",
    stock: 11,
    status: { kind: "available" },
    updatedAt: "2026-09-18T08:10:00.000Z",
  },
  {
    id: "espresso",
    title: "Эспрессо",
    shop: "bar",
    stock: 40,
    status: { kind: "available" },
    updatedAt: "2026-09-18T08:00:00.000Z",
  },
  {
    id: "cappuccino",
    title: "Капучино",
    shop: "bar",
    stock: 16,
    status: {
      kind: "stopped",
      reason: "quality",
      until: "2026-09-18T16:30:00.000Z",
    },
    updatedAt: "2026-09-18T11:00:00.000Z",
  },
  {
    id: "mojito",
    title: "Мохито",
    shop: "bar",
    stock: 9,
    status: { kind: "available" },
    updatedAt: "2026-09-18T08:20:00.000Z",
  },
  {
    id: "whiskey-sour",
    title: "Виски сауэр",
    shop: "bar",
    stock: 4,
    status: { kind: "stopped", reason: "menu_change", until: null },
    updatedAt: "2026-09-18T07:45:00.000Z",
  },
  {
    id: "lemonade",
    title: "Лимонад",
    shop: "bar",
    stock: 22,
    status: { kind: "available" },
    updatedAt: "2026-09-18T08:25:00.000Z",
  },
  {
    id: "napoleon",
    title: "Наполеон",
    shop: "pastry",
    stock: 6,
    status: { kind: "available" },
    updatedAt: "2026-09-18T08:00:00.000Z",
  },
  {
    id: "cheesecake",
    title: "Чизкейк",
    shop: "pastry",
    stock: 2,
    status: {
      kind: "stopped",
      reason: "out_of_stock",
      until: "2026-09-19T09:00:00.000Z",
    },
    updatedAt: "2026-09-18T12:00:00.000Z",
  },
  {
    id: "croissant",
    title: "Круассан",
    shop: "pastry",
    stock: 18,
    status: { kind: "available" },
    updatedAt: "2026-09-18T08:30:00.000Z",
  },
  {
    id: "tiramisu",
    title: "Тирамису",
    shop: "pastry",
    stock: 7,
    status: { kind: "available" },
    updatedAt: "2026-09-18T08:35:00.000Z",
  },
  {
    id: "macaron",
    title: "Макарон",
    shop: "pastry",
    stock: 10,
    status: { kind: "stopped", reason: "equipment", until: null },
    updatedAt: "2026-09-18T13:00:00.000Z",
  },
];

const globalStore = globalThis as typeof globalThis & {
  __copertoMenuItems?: MenuItem[];
};

export function getMenuStore(): MenuItem[] {
  globalStore.__copertoMenuItems ??= structuredClone(SEED);
  return globalStore.__copertoMenuItems;
}
