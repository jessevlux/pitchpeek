import type { Badge, PredictionRecord } from "./types";

export function deriveBadges(predictions: PredictionRecord[]): Badge[] {
  const correctCount = predictions.filter((p) => p.status === "correct").length;
  const totalCount = predictions.length;

  return [
    {
      id: "first-prediction",
      label: "Eerste voorspelling",
      description: "Doe je eerste PitchPeek-voorspelling",
      icon: "target",
      unlocked: totalCount >= 1,
    },
    {
      id: "top-predictor",
      label: "Topvoorspeller",
      description: "Raak 2 of meer voorspellingen",
      icon: "trophy",
      unlocked: correctCount >= 2,
    },
    {
      id: "wk-fan",
      label: "WK Fan",
      description: "Volg het WK 2026 met PitchPeek",
      icon: "globe",
      unlocked: true,
    },
  ];
}
