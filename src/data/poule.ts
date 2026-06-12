import type { PouleMember, PoulePointDelta } from "@/lib/types";

export const POULE_MEMBERS: PouleMember[] = [
  { userId: "user-1", userName: "Jesse", avatarColor: "#22d3ee" },
  { userId: "user-2", userName: "Sanne", avatarColor: "#a78bfa" },
  { userId: "user-3", userName: "Tom", avatarColor: "#34d399" },
  { userId: "user-4", userName: "Lisa", avatarColor: "#f472b6" },
  { userId: "user-5", userName: "Mark", avatarColor: "#fbbf24" },
  { userId: "user-6", userName: "Noor", avatarColor: "#60a5fa" },
];

export const BASE_POINTS: Record<string, number> = {
  "user-1": 142,
  "user-2": 158,
  "user-3": 135,
  "user-4": 149,
  "user-5": 128,
  "user-6": 151,
};

export const POULE_POINT_DELTAS: PoulePointDelta[] = [
  { minute: 15, userId: "user-2", points: 5 },
  { minute: 23, userId: "user-1", points: 10 },
  { minute: 23, userId: "user-4", points: 8 },
  { minute: 28, userId: "user-5", points: 3 },
  { minute: 34, userId: "user-6", points: 6 },
  { minute: 40, userId: "user-3", points: 7 },
  { minute: 48, userId: "user-2", points: 4 },
  { minute: 55, userId: "user-5", points: 5 },
  { minute: 62, userId: "user-4", points: 6 },
  { minute: 67, userId: "user-1", points: 12 },
  { minute: 67, userId: "user-6", points: 9 },
  { minute: 74, userId: "user-3", points: 4 },
  { minute: 82, userId: "user-2", points: 5 },
  { minute: 88, userId: "user-5", points: 6 },
];
