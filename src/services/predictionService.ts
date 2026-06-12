import { STORAGE_KEYS } from "@/lib/config";
import type { PredictionRecord } from "@/lib/types";

function readPredictions(): PredictionRecord[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.PREDICTIONS);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as PredictionRecord[];
  } catch {
    return [];
  }
}

function writePredictions(records: PredictionRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(records));
}

export async function getPredictions(): Promise<PredictionRecord[]> {
  return readPredictions().sort((a, b) => b.createdAt - a.createdAt);
}

export async function addPrediction(record: PredictionRecord): Promise<void> {
  const existing = readPredictions();
  if (existing.some((r) => r.id === record.id)) return;
  writePredictions([record, ...existing]);
}

export async function getPitchPeekPoints(): Promise<number> {
  return readPredictions().reduce((sum, r) => sum + r.points, 0);
}

export async function clearPredictions(): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.PREDICTIONS);
}
