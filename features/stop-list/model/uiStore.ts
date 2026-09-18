"use client";

import { create } from "zustand";

export type ToastItem = {
  id: string;
  message: string;
};

type UiState = {
  selectedId: string | null;
  toasts: ToastItem[];
  openPanel: (id: string) => void;
  closePanel: () => void;
  showToast: (message: string) => void;
  dismissToast: (id: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  selectedId: null,
  toasts: [],
  openPanel: (id) => set({ selectedId: id }),
  closePanel: () => set({ selectedId: null }),
  showToast: (message) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message }],
    })),
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
