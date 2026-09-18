"use client";

import { useCallback } from "react";
import { Toast } from "@/shared/ui";
import { useUiStore } from "../model";

function ToastEntry({ id, message }: { id: string; message: string }) {
  const dismissToast = useUiStore((state) => state.dismissToast);
  const onClose = useCallback(() => {
    dismissToast(id);
  }, [dismissToast, id]);

  return <Toast message={message} onClose={onClose} />;
}

export function ToastStack() {
  const toasts = useUiStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastEntry id={toast.id} message={toast.message} />
        </div>
      ))}
    </div>
  );
}
