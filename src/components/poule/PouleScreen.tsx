"use client";

import { useMatch } from "@/context/MatchContext";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Leaderboard } from "./Leaderboard";
import { MyPredictions } from "./MyPredictions";

export function PouleScreen() {
  const { standings, loading } = useMatch();
  const currentUser = standings.find((s) => s.isCurrentUser);
  const totalMembers = standings.length;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <ScreenHeader
        title="WK Poule"
        subtitle={
          currentUser
            ? `positie #${currentUser.rank} van de ${totalMembers}`
            : undefined
        }
      />

      <section className="px-5 pb-6">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/25">
          Ranglijst
        </p>
        <Leaderboard />
      </section>

      <section className="px-5 pb-10">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/25">
          Mijn voorspellingen
        </p>
        <MyPredictions />
      </section>
    </div>
  );
}
