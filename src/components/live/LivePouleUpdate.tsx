"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useMatch } from "@/context/MatchContext";
import { ChevronRight } from "@/components/icons";

export function LivePouleUpdate() {
  const { predictions, prediction } = useMatch();
  const pred = prediction.prediction;
  const lastPrediction = predictions[0];

  const isPending =
    pred.phase === "open" || pred.phase === "selected";

  let content: { text: string; sub?: string; highlight?: boolean } | null = null;

  if (isPending && pred.event) {
    content = {
      text: "Voorspelling actief",
      sub: pred.selectedZone
        ? "Wachten op uitkomst..."
        : "Tik een zone op het veld",
      highlight: !!pred.selectedZone,
    };
  } else if (pred.phase === "resolved" && pred.event) {
    content = pred.wasCorrect
      ? {
          text: `+${pred.event.prediction?.bonusPoints ?? 25} punten`,
          sub: pred.event.label,
        }
      : {
          text: "Mis",
          sub: pred.event.label,
        };
  } else if (lastPrediction) {
    content =
      lastPrediction.status === "correct"
        ? {
            text: `+${lastPrediction.points} punten`,
            sub: lastPrediction.label,
          }
        : {
            text: "Mis",
            sub: lastPrediction.label,
          };
  } else {
    content = {
      text: "Klaar voor je eerste voorspelling",
      sub: "Tik een zone bij de volgende spelhervatting",
    };
  }

  return (
    <Link href="/poule" className="mx-4 mt-3 block shrink-0">
      <motion.div
        className="flex items-center justify-between rounded-xl bg-neutral-900 px-5 py-3.5 transition-opacity active:opacity-80"
        layout
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            PitchPeek
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={content.text + (content.sub ?? "")}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <p className={`tabular-nums text-sm font-bold ${content.highlight ? "text-emerald-400" : "text-white"}`}>
                {content.text}
              </p>
              {content.sub && (
                <p className="truncate text-xs text-neutral-500">{content.sub}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <ChevronRight size={16} className="ml-3 shrink-0 text-neutral-600" />
      </motion.div>
    </Link>
  );
}
