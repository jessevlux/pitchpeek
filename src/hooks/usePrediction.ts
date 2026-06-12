"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { APP_CONFIG } from "@/lib/config";
import type { MatchEvent, PredictionState, ZoneId } from "@/lib/types";
import { awardBonusPoints } from "@/services/pouleService";
import { getCurrentUserId } from "@/services/profileService";

const INITIAL: PredictionState = {
  phase: "idle",
  event: null,
  selectedZone: null,
  timeLeft: 0,
  wasCorrect: null,
};

export function usePrediction(onBonusAwarded?: () => void) {
  const [state, setState] = useState<PredictionState>(INITIAL);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resolveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const awardedRef = useRef<string | null>(null);
  const onBonusRef = useRef(onBonusAwarded);
  useEffect(() => {
    onBonusRef.current = onBonusAwarded;
  }, [onBonusAwarded]);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (resolveTimerRef.current) clearTimeout(resolveTimerRef.current);
    timerRef.current = null;
    resolveTimerRef.current = null;
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    awardedRef.current = null;
    setState(INITIAL);
  }, [clearTimers]);

  const resolvePrediction = useCallback(
    (prev: PredictionState) => {
      if (!prev.event?.prediction) return prev;

      const { outcomeZone, bonusPoints } = prev.event.prediction;
      const wasCorrect = prev.selectedZone === outcomeZone;

      if (wasCorrect && awardedRef.current !== prev.event.id) {
        awardedRef.current = prev.event.id;
        getCurrentUserId().then((userId) => {
          awardBonusPoints(userId, bonusPoints).then(() => {
            onBonusRef.current?.();
          });
        });
      }

      resolveTimerRef.current = setTimeout(() => {
        reset();
      }, APP_CONFIG.PREDICTION_RESOLVE_MS);

      return {
        ...prev,
        phase: "resolved" as const,
        timeLeft: 0,
        wasCorrect,
      };
    },
    [reset],
  );

  const openPrediction = useCallback(
    (event: MatchEvent) => {
      if (!event.prediction) return;
      clearTimers();
      awardedRef.current = null;

      const windowSec = event.prediction.windowSec;
      setState({
        phase: "open",
        event,
        selectedZone: null,
        timeLeft: windowSec,
        wasCorrect: null,
      });

      timerRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.phase !== "open" && prev.phase !== "selected") return prev;
          const next = prev.timeLeft - 1;
          if (next <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            return resolvePrediction(prev);
          }
          return { ...prev, timeLeft: next };
        });
      }, 1000);
    },
    [clearTimers, resolvePrediction],
  );

  const selectZone = useCallback((zone: ZoneId) => {
    setState((prev) => {
      if (prev.phase !== "open" || prev.selectedZone) return prev;
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50);
      }
      return { ...prev, phase: "selected", selectedZone: zone };
    });
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    prediction: state,
    openPrediction,
    selectZone,
    reset,
    isActive: state.phase !== "idle",
  };
}
