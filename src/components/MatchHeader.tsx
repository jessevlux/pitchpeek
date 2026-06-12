"use client";

import { motion, AnimatePresence } from "motion/react";
import { useMatch } from "@/context/MatchContext";

export function MatchHeader() {
  const { match, score, viewMinute, isFollowingLive } = useMatch();

  if (!match) return null;

  return (
    <header className="mx-4 mt-4 mb-0 shrink-0 rounded-xl bg-neutral-900 px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 flex-col items-start gap-0.5">
          <span className="text-2xl leading-none">{match.homeFlag}</span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-neutral-500">
            {match.homeTeam}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${score.home}-${score.away}`}
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="tabular-nums text-[40px] font-bold leading-none tracking-tight text-white"
            >
              {score.home}
              <span className="mx-2 text-3xl font-light text-neutral-600">—</span>
              {score.away}
            </motion.div>
          </AnimatePresence>

          <div className="mt-2 flex items-center gap-2">
            {isFollowingLive ? (
              <span className="flex items-center gap-1.5 rounded-lg bg-neutral-800 px-3 py-0.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live
              </span>
            ) : (
              <span className="rounded-lg bg-neutral-800 px-3 py-0.5 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                {viewMinute}&apos; terugkijken
              </span>
            )}
            <span className="tabular-nums text-xs font-semibold text-neutral-500">
              {viewMinute}&apos;
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-end gap-0.5">
          <span className="text-2xl leading-none">{match.awayFlag}</span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-neutral-500">
            {match.awayTeam}
          </span>
        </div>
      </div>
    </header>
  );
}
