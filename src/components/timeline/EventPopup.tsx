"use client";

import { AnimatePresence, motion } from "motion/react";
import type { MatchEvent } from "@/lib/types";

const EVENT_ICONS: Record<string, string> = {
  doelpunt: "⚽",
  gele_kaart: "🟨",
  kans: "💨",
  vrije_trap: "🎯",
  hoekschop: "📐",
};

interface EventPopupProps {
  event: MatchEvent | null;
}

export function EventPopup({ event }: EventPopupProps) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-slate-800 px-4 py-3 shadow-xl ring-1 ring-slate-700"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{EVENT_ICONS[event.type] ?? "●"}</span>
            <div>
              <p className="text-sm font-bold text-slate-100">{event.label}</p>
              <p className="text-xs text-slate-400">{event.minute}&apos;</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
