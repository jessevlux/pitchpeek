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
      {/* Glass info card */}
      <div className="glass-overlay rounded-2xl px-5 py-3 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">
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
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={3}
            />
            <circle
              cx={20}
              cy={20}
              r={18}
              fill="none"
              stroke="#22d3ee"
              strokeWidth={3}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1s linear",
                filter: "drop-shadow(0 0 4px rgba(34,211,238,0.8))",
              }}
            />
          </svg>
          <span className="absolute tabular-nums text-sm font-black text-cyan-400" style={{ textShadow: "0 0 8px rgba(34,211,238,0.6)" }}>
            {prediction.timeLeft}
          </span>
        </div>
      )}

      {prediction.phase === "selected" && (
        <p className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold tracking-wide text-cyan-400 ring-1 ring-cyan-500/25">
          Voorspelling opgeslagen
        </p>
      )}

      {prediction.phase === "resolved" && (
        <p
          className={`rounded-full px-4 py-1.5 text-sm font-black ring-1 ${
            prediction.wasCorrect
              ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30"
              : "bg-red-500/10 text-red-400 ring-red-500/30"
          }`}
          style={prediction.wasCorrect ? { textShadow: "0 0 10px rgba(52,211,153,0.6)" } : undefined}
        >
          {prediction.wasCorrect
            ? `+${event.prediction?.bonusPoints ?? 25} punten!`
            : "Helaas, mis!"}
        </p>
      )}
    </div>
  );
}
