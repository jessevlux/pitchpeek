"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useUserProfile } from "@/hooks/useUserProfile";

const AVATAR_COLORS = [
  "#d4d4d4",
  "#a3a3a3",
  "#737373",
  "#525252",
  "#404040",
  "#e5e5e5",
  "#b0b0b0",
  "#8a8a8a",
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
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Naam
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-neutral-800 bg-neutral-800 px-4 py-3.5 text-sm font-medium text-white outline-none placeholder:text-neutral-600 focus:border-emerald-400"
          maxLength={20}
          placeholder="Jouw naam..."
        />
      </div>

      <div>
        <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Avatar kleur
        </label>
        <div className="flex flex-wrap gap-3">
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-10 w-10 rounded-full transition-opacity active:opacity-70 ${
                color === c
                  ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-neutral-900"
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
        className="w-full rounded-lg bg-white py-3.5 text-sm font-semibold text-black transition-opacity active:opacity-80"
      >
        Opslaan
      </button>
      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-lg bg-neutral-800 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-opacity active:opacity-80"
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
