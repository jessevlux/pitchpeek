"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useUserProfile } from "@/hooks/useUserProfile";

const AVATAR_COLORS = [
  "#22d3ee",
  "#a78bfa",
  "#34d399",
  "#f472b6",
  "#fbbf24",
  "#60a5fa",
  "#fb923c",
  "#e879f9",
];

interface ProfileEditSheetProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function ProfileForm({
  initialName,
  initialColor,
  onSave,
  onClose,
}: {
  initialName: string;
  initialColor: string;
  onSave: (name: string, color: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/30">
          Naam
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl bg-white/[0.06] px-4 py-3.5 text-sm font-medium text-white outline-none ring-1 ring-white/10 placeholder:text-white/20 focus:ring-cyan-500/50"
          maxLength={20}
          placeholder="Jouw naam..."
        />
      </div>

      <div>
        <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-white/30">
          Avatar kleur
        </label>
        <div className="flex flex-wrap gap-3">
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-10 w-10 rounded-full transition-all duration-200 active:scale-90 ${
                color === c
                  ? "ring-2 ring-white ring-offset-2 ring-offset-transparent"
                  : "opacity-60"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          if (name.trim()) onSave(name.trim(), color);
        }}
        className="w-full rounded-xl bg-white py-3.5 text-sm font-black text-black shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-200 active:scale-[0.97] active:opacity-80"
      >
        Opslaan
      </button>
      <button
        type="button"
        onClick={onClose}
        className="w-full py-2 text-xs font-semibold uppercase tracking-widest text-white/25"
      >
        Annuleren
      </button>
    </div>
  );
}

export function ProfileEditSheet({
  open,
  onClose,
  onSaved,
}: ProfileEditSheetProps) {
  const { profile, updateProfile } = useUserProfile();

  const handleSave = async (name: string, color: string) => {
    if (!profile) return;
    await updateProfile({ userName: name, avatarColor: color });
    onSaved();
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Profiel bewerken">
      {profile && open && (
        <ProfileForm
          key={`${profile.userId}-${open}`}
          initialName={profile.userName}
          initialColor={profile.avatarColor}
          onSave={handleSave}
          onClose={onClose}
        />
      )}
    </BottomSheet>
  );
}
