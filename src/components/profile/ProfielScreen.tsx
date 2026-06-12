"use client";

import { useEffect, useState } from "react";
import { useMatch } from "@/context/MatchContext";
import { deriveBadges } from "@/lib/badges";
import type { Badge } from "@/lib/types";
import { getPitchPeekPoints } from "@/services/predictionService";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ProfileEditSheet } from "@/components/poule/ProfileEditSheet";
import { BadgeGrid } from "./BadgeGrid";
import { Pencil } from "@/components/icons";

export function ProfielScreen() {
  const { predictions, refreshPredictions, refreshStandings } = useMatch();
  const { profile } = useUserProfile();
  const [pitchPeekPoints, setPitchPeekPoints] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    getPitchPeekPoints().then(setPitchPeekPoints);
    setBadges(deriveBadges(predictions));
  }, [predictions]);

  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  const initial = profile.userName.charAt(0).toUpperCase();

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <ScreenHeader title="Profiel" />

      {/* Avatar section */}
      <section className="flex flex-col items-center px-5 pb-8">
        <div className="relative">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-black text-black shadow-[0_0_30px_rgba(0,0,0,0.4)]"
            style={{
              backgroundColor: profile.avatarColor,
              boxShadow: `0 0 0 3px rgba(255,255,255,0.06), 0 0 24px ${profile.avatarColor}40`,
            }}
          >
            {initial}
          </div>
          {/* Edit button */}
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="glass absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full text-white/60 ring-1 ring-white/10 transition-all active:scale-90 active:opacity-60"
            aria-label="Profiel bewerken"
          >
            <Pencil size={13} />
          </button>
        </div>

        <h2 className="mt-4 text-xl font-black text-white">
          {profile.userName}
        </h2>
        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-white/25">
          PitchPeek speler
        </p>

        {/* Points card */}
        <div
          className="glass neon-cyan mt-6 w-full rounded-2xl px-6 py-6 text-center ring-1 ring-cyan-400/25"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
            PitchPeek punten
          </p>
          <p
            className="tabular-nums mt-2 text-5xl font-black text-cyan-400"
            style={{ textShadow: "0 0 20px rgba(34,211,238,0.5)" }}
          >
            {pitchPeekPoints}
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/20">
            dit toernooi
          </p>
        </div>
      </section>

      <section className="px-5 pb-10">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/25">
          Badges
        </p>
        <BadgeGrid badges={badges} />
      </section>

      <ProfileEditSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={() => {
          refreshPredictions();
          refreshStandings();
        }}
      />
    </div>
  );
}
