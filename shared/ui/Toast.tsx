"use client";

import { useEffect } from "react";
import { Button } from "./Button";

const AUTO_HIDE_MS = 4000;

type ToastProps = {
  message: string;
  onClose: () => void;
};

/** Тост ошибки: автоскрытие и закрытие вручную. */
export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, AUTO_HIDE_MS);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      className="flex max-w-sm items-start gap-2 rounded-md border border-border bg-surface px-3 py-2 text-label text-foreground shadow-md"
    >
      <p className="flex-1">{message}</p>
      <Button variant="ghost" aria-label="Закрыть" onClick={onClose}>
        ×
      </Button>
    </div>
  );
}
