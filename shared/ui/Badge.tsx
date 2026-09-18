"use client";

import { motion } from "framer-motion";

const variants = {
  stop: {
    label: "Стоп",
    className: "bg-accent text-surface",
  },
  saving: {
    label: "Сохраняется",
    className: "bg-border text-secondary",
  },
} as const;

type BadgeProps = {
  variant: keyof typeof variants;
};

/** Бейдж статуса строки: «Стоп» или «Сохраняется». */
export function Badge({ variant }: BadgeProps) {
  const { label, className } = variants[variant];

  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[length:var(--error-size)] font-medium ${className}`}
    >
      {label}
    </motion.span>
  );
}
