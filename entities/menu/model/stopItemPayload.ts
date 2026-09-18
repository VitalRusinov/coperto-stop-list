import { z } from "zod";
import { STOP_REASONS } from "./types";
import { validateUntil } from "./validateUntil";

export const stopItemPayloadSchema = z
  .object({
    reason: z.enum(STOP_REASONS, {
      error: "Укажите причину стопа",
    }),
    until: z.union([z.string(), z.null()], {
      error: "Укажите срок стопа",
    }),
  })
  .superRefine((value, ctx) => {
    const untilError = validateUntil(value.until);
    if (untilError) {
      ctx.addIssue({
        code: "custom",
        path: ["until"],
        message: untilError,
      });
    }
  });
