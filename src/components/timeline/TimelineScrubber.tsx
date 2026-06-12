"use client";

import { useCallback, useRef, useState } from "react";

interface TimelineScrubberProps {
  viewMinute: number;
  maxMinute: number;
  insetX: number;
  isFollowingLive: boolean;
  onScrub: (minute: number) => void;
}

export function TimelineScrubber({
  viewMinute,
  maxMinute,
  insetX,
  isFollowingLive,
  onScrub,
}: TimelineScrubberProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const minuteFromX = useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return viewMinute;
      const rect = el.getBoundingClientRect();
      const usable = rect.width - insetX * 2;
      const ratio = Math.max(
        0,
        Math.min(1, (clientX - rect.left - insetX) / usable),
      );
      return Math.round(ratio * maxMinute);
    },
    [viewMinute, maxMinute, insetX],
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

  const fraction = Math.max(0, Math.min(1, viewMinute / Math.max(maxMinute, 1)));
  const left = `calc(${insetX}px + ${fraction} * (100% - ${insetX * 2}px))`;
  const transition =
    isFollowingLive && !isDragging ? `left 250ms linear` : "none";

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-10 touch-none"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDragging(true);
        handlePointer(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons > 0) handlePointer(e.clientX);
      }}
      onPointerUp={() => setIsDragging(false)}
      onPointerCancel={() => setIsDragging(false)}
    >
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-px bg-emerald-400"
        style={{ left, transition }}
      >
        <div className="absolute -top-0.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-400" />
      </div>
    </div>
  );
}
