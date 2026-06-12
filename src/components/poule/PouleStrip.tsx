"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useMatch } from "@/context/MatchContext";

interface PouleStripProps {
  onOpen: () => void;
}

export function PouleStrip({ onOpen }: PouleStripProps) {
  const { standings } = useMatch();
  const currentUser = standings.find((s) => s.isCurrentUser);
  const prevRankRef = useRef(currentUser?.rank ?? 0);
  const [delta, setDelta] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const prev = prevRankRef.current;
    if (currentUser.rank < prev) setDelta("up");
    else if (currentUser.rank > prev) setDelta("down");
    else setDelta(null);
    prevRankRef.current = currentUser.rank;

    if (currentUser.rank !== prev) {
      const timer = setTimeout(() => setDelta(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentUser?.rank, currentUser]);

  if (!currentUser) return null;

  return (
    <motion.button
      onClick={onOpen}
      className="mx-4 mb-3 flex shrink-0 items-center justify-between rounded-xl bg-slate-900 px-4 py-3 transition-all duration-200 active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-slate-950"
          style={{ backgroundColor: currentUser.avatarColor }}
        >
          {currentUser.rank}
        </span>
        <div className="text-left">
          <p className="text-sm font-bold text-slate-100">
            {currentUser.userName}
          </p>
          <p className="text-xs text-slate-400">Jouw poule</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {delta && (
          <motion.span
            initial={{ opacity: 0, y: delta === "up" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm font-bold ${
              delta === "up" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {delta === "up" ? "▲" : "▼"}
          </motion.span>
        )}
        <span className="text-lg font-bold text-cyan-400">
          {currentUser.points}
        </span>
        <span className="text-xs text-slate-500">pnt</span>
      </div>
    </motion.button>
  );
}
