"use client";

import { motion, AnimatePresence } from "motion/react";
import { useMatch } from "@/context/MatchContext";

export function MatchHeader() {
  const { match, score, viewMinute, isFollowingLive } = useMatch();

  if (!match) return null;

  return (
    <header className="glass mx-4 mt-4 mb-0 shrink-0 rounded-2xl px-5 py-4">
      <div className="flex items-center justify-between">
        {/* Home team */}
        <div className="flex flex-1 flex-col items-start gap-0.5">
          <span className="text-2xl leading-none">{match.homeFlag}</span>
          <span className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
            {match.homeTeam}
          </span>
        </div>

        {/* Score + status */}
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${score.home}-${score.away}`}
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="tabular-nums text-[40px] font-black leading-none tracking-tight text-white"
            >
              {score.home}
              <span className="mx-2 text-3xl font-light text-white/20">—</span>
              {score.away}
            </motion.div>
          </AnimatePresence>

          <div className="mt-2 flex items-center gap-2">
            {isFollowingLive ? (
              <span className="neon-cyan flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 ring-1 ring-emerald-500/30">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            ) : (
              <span className="rounded-full bg-white/5 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/30 ring-1 ring-white/10">
                {viewMinute}&apos; terugkijken
              </span>
            )}
            <span className="tabular-nums text-xs font-semibold text-white/30">
              {viewMinute}&apos;
            </span>
          </div>
        </div>

        {/* Away team */}
        <div className="flex flex-1 flex-col items-end gap-0.5">
          <span className="text-2xl leading-none">{match.awayFlag}</span>
          <span className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
            {match.awayTeam}
          </span>
        </div>
      </div>
    </header>
  );
}
