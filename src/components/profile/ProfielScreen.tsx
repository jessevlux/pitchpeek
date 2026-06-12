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
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-neutral-700 border-t-emerald-400" />
      </div>
    );
  }

  const initial = profile.userName.charAt(0).toUpperCase();

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <ScreenHeader title="Profiel" />

      <section className="flex flex-col items-center px-5 pb-8">
        <div className="relative">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold text-black"
            style={{ backgroundColor: profile.avatarColor }}
          >
            {initial}
          </div>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 transition-opacity active:opacity-60"
            aria-label="Profiel bewerken"
          >
            <Pencil size={13} />
          </button>
        </div>

        <h2 className="mt-4 text-xl font-bold text-white">
          {profile.userName}
        </h2>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-neutral-500">
          PitchPeek speler
        </p>

        <div className="mt-6 w-full rounded-xl bg-neutral-900 px-6 py-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            PitchPeek punten
          </p>
          <p className="tabular-nums mt-2 text-5xl font-bold text-white">
            {pitchPeekPoints}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-neutral-600">
            dit toernooi
          </p>
        </div>
      </section>

      <section className="px-5 pb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
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
