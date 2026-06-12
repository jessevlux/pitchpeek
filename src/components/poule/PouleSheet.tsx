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
                  ? "bg-slate-800 ring-2 ring-cyan-400/50"
                  : "bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-slate-950"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.rank}
                </span>
                <span className="font-medium text-slate-100">
                  {member.userName}
                  {member.isCurrentUser && (
                    <span className="ml-2 text-xs text-cyan-400">(jij)</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200">{member.points}</span>
                {member.isCurrentUser && (
                  <button
                    onClick={() => setEditOpen(true)}
                    className="rounded-lg p-2 text-slate-400 transition-all hover:text-cyan-400 active:scale-95"
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
