"use client";

import { useMatch } from "@/context/MatchContext";

const STATUS_CONFIG = {
  pending: {
    label: "In afwachting",
    className: "bg-neutral-800 text-neutral-400",
  },
  correct: {
    label: (pts: number) => `+${pts} pnt`,
    className: "bg-neutral-800 text-white",
  },
  incorrect: {
    label: "Mis",
    className: "bg-neutral-800 text-neutral-500",
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
      <div className="rounded-xl bg-neutral-900 px-5 py-8 text-center">
        <p className="text-sm text-neutral-500">
          Nog geen voorspellingen deze wedstrijd.
        </p>
        <p className="mt-1 text-xs text-neutral-600">
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
            className="flex items-center justify-between rounded-xl bg-neutral-900 px-4 py-3.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">
                {item.label}
              </p>
              <p className="tabular-nums text-xs text-neutral-500">
                {item.minute}&apos; · {item.predictedZoneLabel}
              </p>
            </div>
            <span
              className={`ml-3 shrink-0 rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wide ${cfg.className}`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
