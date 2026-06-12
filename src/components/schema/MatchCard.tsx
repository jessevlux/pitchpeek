"use client";

import Link from "next/link";
import { useMatch } from "@/context/MatchContext";
import type { ScheduleMatch } from "@/lib/types";

interface MatchCardProps {
  match: ScheduleMatch;
}

export function MatchCard({ match }: MatchCardProps) {
  const { score, liveMinute } = useMatch();
  const isLive = match.status === "live";

  const content = (
    <div
      className={`glass flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-200 active:scale-[0.98] active:opacity-80 ${
        isLive ? "neon-cyan ring-1 ring-cyan-400/25" : ""
      }`}
    >
      {/* Teams */}
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{match.homeFlag}</span>
          <span className="text-sm font-bold text-white">{match.homeTeam}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{match.awayFlag}</span>
          <span className="text-sm font-bold text-white">{match.awayTeam}</span>
        </div>
      </div>

      {/* Score / kickoff */}
      <div className="shrink-0 text-right">
        {isLive ? (
          <>
            <p className="tabular-nums text-2xl font-black text-white">
              {score.home} — {score.away}
            </p>
            <p className="mt-0.5 flex items-center justify-end gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live · <span className="tabular-nums">{liveMinute}&apos;</span>
            </p>
          </>
        ) : (
          <p className="tabular-nums text-sm font-bold text-white/30">{match.kickoff}</p>
        )}
      </div>
    </div>
  );

  if (isLive) {
    return <Link href="/">{content}</Link>;
  }

  return content;
}
