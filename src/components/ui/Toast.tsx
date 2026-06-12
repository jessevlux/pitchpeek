"use client";

import { AnimatePresence, motion } from "motion/react";

interface ToastProps {
  message: string | null;
  variant?: "default" | "success" | "error";
}

export function Toast({ message, variant = "default" }: ToastProps) {
  const colors = {
    default: "bg-neutral-900 text-white border-neutral-800",
    success: "bg-neutral-900 text-white border-neutral-800",
    error: "bg-neutral-900 text-neutral-400 border-neutral-800",
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border px-4 py-2 text-sm font-medium ${colors[variant]}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
