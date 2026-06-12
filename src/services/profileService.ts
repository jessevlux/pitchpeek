import { STORAGE_KEYS } from "@/lib/config";
import type { UserProfile } from "@/lib/types";
import { POULE_MEMBERS } from "@/data/poule";

const DEFAULT_USER_ID = "user-1";

function getDefaultProfile(): UserProfile {
  const member = POULE_MEMBERS.find((m) => m.userId === DEFAULT_USER_ID)!;
  return {
    userId: member.userId,
    userName: member.userName,
    avatarColor: member.avatarColor,
  };
}

export async function getProfile(): Promise<UserProfile> {
  if (typeof window === "undefined") return getDefaultProfile();

  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (!stored) return getDefaultProfile();

  try {
    return JSON.parse(stored) as UserProfile;
  } catch {
    return getDefaultProfile();
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

export async function getCurrentUserId(): Promise<string> {
  const profile = await getProfile();
  return profile.userId;
}
