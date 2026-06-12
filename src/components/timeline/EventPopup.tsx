"use client";

import { AnimatePresence, motion } from "motion/react";
import type { MatchEvent } from "@/lib/types";

function EventBadge({ type }: { type: string }) {
  if (type === "doelpunt") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="#ffffff" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill="#ffffff" />
        </svg>
      </span>
    );
  }
  if (type === "gele_kaart") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800">
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden>
          <rect width="14" height="20" rx="2" fill="#a3a3a3" />
        </svg>
      </span>
    );
  }
  if (type === "vrije_trap") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="#ffffff" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" fill="#ffffff" />
        </svg>
      </span>
    );
  }
  if (type === "hoekschop") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="15 15 19 19 23 15" />
          <path d="M2 4h10a4 4 0 0 1 4 4v11" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800">
      <span className="h-2 w-2 rounded-full bg-neutral-500" />
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
          initial={{ opacity: 0, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <EventBadge type={event.type} />
            <div>
              <p className="text-sm font-bold text-white">{event.label}</p>
              <p className="tabular-nums text-xs text-neutral-500">{event.minute}&apos;</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
