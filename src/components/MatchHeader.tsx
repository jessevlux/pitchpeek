"use client";

import { motion, AnimatePresence } from "motion/react";
import { useMatch } from "@/context/MatchContext";

export function MatchHeader() {
  const { match, score, viewMinute, isFollowingLive } = useMatch();

  if (!match) return null;

  return (
    <header className="flex shrink-0 items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{match.homeFlag}</span>
        <span className="text-sm font-bold text-slate-300">{match.homeTeam}</span>
      </div>

      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${score.home}-${score.away}`}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-slate-100"
          >
            {score.home} - {score.away}
          </motion.div>
        </AnimatePresence>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-medium text-slate-400">{viewMinute}&apos;</span>
          {isFollowingLive ? (
            <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live
            </span>
          ) : (
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400">
              {viewMinute}&apos; — terugkijken
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-slate-300">{match.awayTeam}</span>
        <span className="text-2xl">{match.awayFlag}</span>
      </div>
    </header>
  );
}
