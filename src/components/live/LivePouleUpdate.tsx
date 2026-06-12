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

  let content: { text: string; sub?: string; color: string; glow?: string } | null = null;

  if (isPending && pred.event) {
    content = {
      text: "Voorspelling actief",
      sub: pred.selectedZone
        ? "Wachten op uitkomst..."
        : "Tik een zone op het veld",
      color: "text-amber-400",
    };
  } else if (pred.phase === "resolved" && pred.event) {
    content = pred.wasCorrect
      ? {
          text: `+${pred.event.prediction?.bonusPoints ?? 25} punten`,
          sub: pred.event.label,
          color: "text-emerald-400",
          glow: "rgba(52,211,153,0.15)",
        }
      : {
          text: "Mis",
          sub: pred.event.label,
          color: "text-red-400",
        };
  } else if (lastPrediction) {
    content =
      lastPrediction.status === "correct"
        ? {
            text: `+${lastPrediction.points} punten`,
            sub: lastPrediction.label,
            color: "text-emerald-400",
            glow: "rgba(52,211,153,0.12)",
          }
        : {
            text: "Mis",
            sub: lastPrediction.label,
            color: "text-red-400",
          };
  } else {
    content = {
      text: "Klaar voor je eerste voorspelling",
      sub: "Tik een zone bij de volgende spelhervatting",
      color: "text-white/40",
    };
  }

  return (
    <Link href="/poule" className="mx-4 mt-3 block shrink-0">
      <motion.div
        className="glass flex items-center justify-between rounded-2xl px-5 py-3.5 transition-all duration-200 active:scale-[0.98] active:opacity-80"
        style={content.glow ? { boxShadow: `0 0 20px ${content.glow}` } : undefined}
        layout
      >
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/25">
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
              <p className={`tabular-nums text-sm font-black ${content.color}`}>
                {content.text}
              </p>
              {content.sub && (
                <p className="truncate text-xs text-white/30">{content.sub}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <ChevronRight size={16} className="ml-3 shrink-0 text-white/20" />
      </motion.div>
    </Link>
  );
}
