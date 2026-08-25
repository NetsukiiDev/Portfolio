"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import toast, { Toaster } from "react-hot-toast";

export interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message) => toast.success(message),
      error: (message) => toast.error(message),
      info: (message) => toast(message),
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1b1b23",
            color: "#f5f5f7",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "1rem",
            fontSize: "0.875rem",
          },
        }}
      />
    </ToastContext.Provider>
  );
}
