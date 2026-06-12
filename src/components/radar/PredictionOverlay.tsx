"use client";

import type { PredictionState } from "@/lib/types";

interface PredictionOverlayProps {
  prediction: PredictionState;
  homeTeam: string;
  awayTeam: string;
}

export function PredictionOverlay({
  prediction,
  homeTeam,
  awayTeam,
}: PredictionOverlayProps) {
  if (prediction.phase === "idle") return null;

  const event = prediction.event;
  if (!event) return null;

  const teamLabel = event.team === "home" ? homeTeam : awayTeam;
  const typeLabel =
    event.type === "hoekschop" ? "Hoekschop" : "Vrije trap";
  const totalSec = event.prediction?.windowSec ?? 8;
  const progress =
    prediction.phase === "resolved"
      ? 0
      : prediction.timeLeft / totalSec;
  const circumference = 2 * Math.PI * 18;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center gap-2 p-3">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Voorspel waar de bal valt
        </p>
        <p className="mt-0.5 text-sm font-bold text-white">
          {typeLabel} {teamLabel}
        </p>
      </div>

      {(prediction.phase === "open" || prediction.phase === "selected") && (
        <div className="relative flex h-12 w-12 items-center justify-center">
          <svg className="h-12 w-12 -rotate-90" viewBox="0 0 40 40">
            <circle
              cx={20}
              cy={20}
              r={18}
              fill="none"
              stroke="#262626"
              strokeWidth={3}
            />
            <circle
              cx={20}
              cy={20}
              r={18}
              fill="none"
              stroke="#34d399"
              strokeWidth={3}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <span className="absolute tabular-nums text-sm font-bold text-emerald-400">
            {prediction.timeLeft}
          </span>
        </div>
      )}

      {prediction.phase === "selected" && (
        <p className="rounded-lg bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-400">
          Voorspelling opgeslagen
        </p>
      )}

      {prediction.phase === "resolved" && (
        <p className="rounded-lg bg-neutral-800 px-4 py-1.5 text-sm font-bold text-white">
          {prediction.wasCorrect
            ? `+${event.prediction?.bonusPoints ?? 25} punten`
            : "Helaas, mis"}
        </p>
      )}
    </div>
  );
}
