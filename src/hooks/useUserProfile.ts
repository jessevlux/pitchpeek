"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserProfile } from "@/lib/types";
import { getProfile, saveProfile } from "@/services/profileService";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    const current = await getProfile();
    const next = { ...current, ...updates };
    await saveProfile(next);
    setProfile(next);
    return next;
  }, []);

  return { profile, loading, updateProfile };
}
