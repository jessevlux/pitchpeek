"use client";

import { AnimatePresence, motion } from "motion/react";
import type { MatchEvent } from "@/lib/types";

/** Pure SVG badge instead of emoji, keyed by event type */
function EventBadge({ type }: { type: string }) {
  if (type === "doelpunt") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="#34d399" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill="#34d399" />
        </svg>
      </span>
    );
  }
  if (type === "gele_kaart") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 ring-1 ring-amber-500/30">
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden>
          <rect width="14" height="20" rx="2" fill="#fbbf24" />
        </svg>
      </span>
    );
  }
  if (type === "vrije_trap") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/15 ring-1 ring-cyan-500/30">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="#22d3ee" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" fill="#22d3ee" />
        </svg>
      </span>
    );
  }
  if (type === "hoekschop") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15 ring-1 ring-violet-500/30">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="15 15 19 19 23 15" />
          <path d="M2 4h10a4 4 0 0 1 4 4v11" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
      <span className="h-2 w-2 rounded-full bg-white/50" />
    </span>
  );
}

interface EventPopupProps {
  event: MatchEvent | null;
}

export function EventPopup({ event }: EventPopupProps) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 8 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="glass-overlay absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-2xl px-4 py-3 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <EventBadge type={event.type} />
            <div>
              <p className="text-sm font-bold text-white">{event.label}</p>
              <p className="tabular-nums text-xs text-white/35">{event.minute}&apos;</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
