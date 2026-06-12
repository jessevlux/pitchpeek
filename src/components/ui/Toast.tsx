"use client";

import { AnimatePresence, motion } from "motion/react";

interface ToastProps {
  message: string | null;
  variant?: "default" | "success" | "error";
}

export function Toast({ message, variant = "default" }: ToastProps) {
  const colors = {
    default: "bg-slate-800 text-cyan-400 border-cyan-500/30",
    success: "bg-slate-800 text-emerald-400 border-emerald-500/30",
    error: "bg-slate-800 text-red-400 border-red-500/30",
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border px-4 py-2 text-sm font-medium shadow-lg ${colors[variant]}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
