"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useMatch } from "@/context/MatchContext";
import { TrendingUp, TrendingDown } from "@/components/icons";

export function Leaderboard() {
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
      const timer = setTimeout(() => setDelta(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentUser?.rank, currentUser]);

  return (
    <div className="space-y-2">
      {standings.map((member) => (
        <div
          key={member.userId}
          className={`glass flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300 ${
            member.isCurrentUser
              ? "neon-cyan ring-1 ring-cyan-400/30"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Rank circle */}
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-black"
              style={{ backgroundColor: member.avatarColor }}
            >
              {member.rank}
            </span>
            <div>
              <span className="font-bold text-white">
                {member.userName}
              </span>
              {member.isCurrentUser && (
                <span className="ml-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                  jij
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {member.isCurrentUser && delta && (
              <motion.span
                initial={{ opacity: 0, y: delta === "up" ? 4 : -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={delta === "up" ? "text-emerald-400" : "text-red-400"}
              >
                {delta === "up" ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
              </motion.span>
            )}
            <span className="tabular-nums text-base font-black text-white">
              {member.points}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/25">
              pnt
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
