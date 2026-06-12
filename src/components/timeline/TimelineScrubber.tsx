"use client";

import { useCallback, useRef } from "react";
import { APP_CONFIG } from "@/lib/config";

interface TimelineScrubberProps {
  viewMinute: number;
  onScrub: (minute: number) => void;
}

export function TimelineScrubber({
  viewMinute,
  onScrub,
}: TimelineScrubberProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const minuteFromX = useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return viewMinute;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(ratio * APP_CONFIG.MAX_MINUTE);
    },
    [viewMinute],
  );

  const handlePointer = useCallback(
    (clientX: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        onScrub(minuteFromX(clientX));
      });
    },
    [minuteFromX, onScrub],
  );

  const playheadX = (viewMinute / APP_CONFIG.MAX_MINUTE) * 100;

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-10 touch-none"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        handlePointer(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons > 0) handlePointer(e.clientX);
      }}
    >
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-cyan-400"
        style={{ left: `${playheadX}%` }}
      >
        <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50" />
      </div>
    </div>
  );
}
