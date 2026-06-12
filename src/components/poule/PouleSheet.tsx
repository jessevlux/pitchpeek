"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useMatch } from "@/context/MatchContext";
import { ProfileEditSheet } from "./ProfileEditSheet";

interface PouleSheetProps {
  open: boolean;
  onClose: () => void;
}

export function PouleSheet({ open, onClose }: PouleSheetProps) {
  const { standings, refreshStandings } = useMatch();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <BottomSheet open={open} onClose={onClose} title="Vriendenpoule">
        <div className="space-y-2">
          {standings.map((member) => (
            <div
              key={member.userId}
              className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                member.isCurrentUser
                  ? "border border-emerald-400/40 bg-neutral-800"
                  : "bg-neutral-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-black"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.rank}
                </span>
                <span className="font-medium text-white">
                  {member.userName}
                  {member.isCurrentUser && (
                    <span className="ml-2 text-xs text-emerald-400">(jij)</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="tabular-nums font-bold text-white">{member.points}</span>
                {member.isCurrentUser && (
                  <button
                    onClick={() => setEditOpen(true)}
                    className="rounded-lg p-2 text-neutral-500 transition-opacity active:opacity-70"
                    aria-label="Profiel bewerken"
                  >
                    ✏️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </BottomSheet>

      <ProfileEditSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={refreshStandings}
      />
    </>
  );
}
