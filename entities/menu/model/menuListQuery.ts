import { z } from "zod";
import { MENU_STATUSES, SHOPS } from "./types";

export const menuListQuerySchema = z.object({
  shop: z.enum(SHOPS, { error: "Некорректный цех" }).optional(),
  status: z.enum(MENU_STATUSES, { error: "Некорректный статус" }).optional(),
});

export type MenuListQuery = z.infer<typeof menuListQuerySchema>;
