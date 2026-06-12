import {
  BASE_POINTS,
  POULE_MEMBERS,
  POULE_POINT_DELTAS,
} from "@/data/poule";
import { STORAGE_KEYS } from "@/lib/config";
import type { PouleStanding } from "@/lib/types";
import { getCurrentUserId, getProfile } from "./profileService";

function getBonusPoints(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(STORAGE_KEYS.BONUS_POINTS);
  return stored ? parseInt(stored, 10) : 0;
}

function setBonusPoints(points: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.BONUS_POINTS, String(points));
}

function computePointsAtMinute(minute: number, userId: string): number {
  let total = BASE_POINTS[userId] ?? 0;
  for (const delta of POULE_POINT_DELTAS) {
    if (delta.minute <= minute && delta.userId === userId) {
      total += delta.points;
    }
  }
  return total;
}

export async function getStandingsAtMinute(
  minute: number,
): Promise<PouleStanding[]> {
  const currentUserId = await getCurrentUserId();
  const profile = await getProfile();
  const bonus = getBonusPoints();

  const standings: PouleStanding[] = POULE_MEMBERS.map((member) => {
    const isCurrentUser = member.userId === currentUserId;
    let points = computePointsAtMinute(minute, member.userId);
    if (isCurrentUser) points += bonus;

    const userName = isCurrentUser ? profile.userName : member.userName;
    const avatarColor = isCurrentUser
      ? profile.avatarColor
      : member.avatarColor;

    return {
      userId: member.userId,
      userName,
      points,
      avatarColor,
      isCurrentUser,
      rank: 0,
    };
  });

  standings.sort((a, b) => b.points - a.points);
  standings.forEach((s, i) => {
    s.rank = i + 1;
  });

  return standings;
}

export async function awardBonusPoints(
  userId: string,
  points: number,
): Promise<void> {
  const currentUserId = await getCurrentUserId();
  if (userId !== currentUserId) return;
  setBonusPoints(getBonusPoints() + points);
}

export async function getPouleDeltasUpToMinute(minute: number) {
  return POULE_POINT_DELTAS.filter((d) => d.minute <= minute);
}
