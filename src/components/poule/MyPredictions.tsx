"use client";

import { useMatch } from "@/context/MatchContext";

const STATUS_CONFIG = {
  pending: {
    label: "In afwachting",
    className: "bg-amber-500/10 text-amber-400 ring-amber-500/25",
  },
  correct: {
    label: (pts: number) => `+${pts} pnt`,
    className: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/25",
  },
  incorrect: {
    label: "Mis",
    className: "bg-red-500/10 text-red-400 ring-red-500/25",
  },
} as const;

export function MyPredictions() {
  const { predictions, prediction } = useMatch();
  const pred = prediction.prediction;

  const isPending =
    pred.phase === "open" || pred.phase === "selected";

  const pendingItem =
    isPending && pred.event
      ? {
          id: "pending",
          label: pred.event.label,
          minute: pred.event.minute,
          predictedZoneLabel: pred.selectedZone
            ? `Zone: ${pred.selectedZone.replace(/_/g, " ")}`
            : "Kies een zone...",
          status: "pending" as const,
          points: 0,
        }
      : null;

  const items = [
    ...(pendingItem ? [pendingItem] : []),
    ...predictions.map((p) => ({
      id: p.id,
      label: p.label,
      minute: p.minute,
      predictedZoneLabel: p.predictedZoneLabel,
      status: p.status as "correct" | "incorrect",
      points: p.points,
    })),
  ];

  if (items.length === 0) {
    return (
      <div className="glass rounded-2xl px-5 py-8 text-center">
        <p className="text-sm text-white/30">
          Nog geen voorspellingen deze wedstrijd.
        </p>
        <p className="mt-1 text-xs text-white/20">
          Ga naar Live en tik een zone bij de volgende spelhervatting.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const cfg = STATUS_CONFIG[item.status];
        const label =
          item.status === "correct"
            ? (STATUS_CONFIG.correct.label as (pts: number) => string)(item.points)
            : (cfg as { label: string }).label;

        return (
          <div
            key={item.id}
            className="glass flex items-center justify-between rounded-2xl px-4 py-3.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">
                {item.label}
              </p>
              <p className="tabular-nums text-xs text-white/30">
                {item.minute}&apos; · {item.predictedZoneLabel}
              </p>
            </div>
            <span
              className={`ml-3 shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ring-1 ${cfg.className}`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
