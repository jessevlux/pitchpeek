"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { APP_CONFIG } from "@/lib/config";
import { getMomentumAtMinute, scoreAtMinute } from "@/lib/score";
import type {
  MatchData,
  MatchEvent,
  MomentumPoint,
  PredictionRecord,
  PouleStanding,
} from "@/lib/types";
import { createMatchFeed } from "@/services/matchFeed";
import { getMatch, getMomentumPoints, getEvents } from "@/services/matchService";
import {
  addPrediction,
  getPredictions,
} from "@/services/predictionService";
import { getStandingsAtMinute } from "@/services/pouleService";
import { usePrediction } from "@/hooks/usePrediction";

interface MatchContextValue {
  match: MatchData | null;
  events: MatchEvent[];
  momentumPoints: MomentumPoint[];
  liveMinute: number;
  liveTimeRef: MutableRefObject<number>;
  viewMinute: number;
  isFollowingLive: boolean;
  standings: PouleStanding[];
  predictions: PredictionRecord[];
  activeEvent: MatchEvent | null;
  loading: boolean;
  setViewMinute: (minute: number) => void;
  snapToLive: () => void;
  setActiveEvent: (event: MatchEvent | null) => void;
  refreshStandings: () => void;
  refreshPredictions: () => void;
  score: { home: number; away: number };
  currentPoint: MomentumPoint | undefined;
  prediction: ReturnType<typeof usePrediction>;
}

const MatchContext = createContext<MatchContextValue | null>(null);

export function MatchProvider({ children }: { children: ReactNode }) {
  const [match, setMatch] = useState<MatchData | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [momentumPoints, setMomentumPoints] = useState<MomentumPoint[]>([]);
  const [liveMinute, setLiveMinute] = useState<number>(APP_CONFIG.START_MINUTE);
  const [viewMinute, setViewMinuteState] = useState<number>(APP_CONFIG.START_MINUTE);
  const [isFollowingLive, setIsFollowingLive] = useState(true);
  const [standings, setStandings] = useState<PouleStanding[]>([]);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [activeEvent, setActiveEvent] = useState<MatchEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const liveMinuteRef = useRef(liveMinute);
  const liveTimeRef = useRef<number>(APP_CONFIG.START_MINUTE);
  const openPredictionRef = useRef<(event: MatchEvent) => void>(() => {});

  useEffect(() => {
    liveMinuteRef.current = liveMinute;
  }, [liveMinute]);

  const refreshStandings = useCallback(() => {
    getStandingsAtMinute(liveMinuteRef.current).then(setStandings);
  }, []);

  const refreshPredictions = useCallback(() => {
    getPredictions().then(setPredictions);
  }, []);

  const handlePredictionResolved = useCallback(
    (record: PredictionRecord) => {
      addPrediction(record).then(() => {
        refreshPredictions();
      });
    },
    [refreshPredictions],
  );

  const prediction = usePrediction({
    onBonusAwarded: refreshStandings,
    onResolved: handlePredictionResolved,
  });

  useEffect(() => {
    openPredictionRef.current = prediction.openPrediction;
  }, [prediction.openPrediction]);

  useEffect(() => {
    Promise.all([getMatch(), getEvents(), getMomentumPoints(), getPredictions()]).then(
      ([m, e, p, preds]) => {
        setMatch(m);
        setEvents(e);
        setMomentumPoints(p);
        setPredictions(preds);
        setLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    if (loading) return;

    let unsub: (() => void) | undefined;
    const feed = createMatchFeed();

    feed.init().then(() => {
      unsub = feed.subscribe({
        onTime: (time) => {
          liveTimeRef.current = time;
        },
        onMinute: (minute) => {
          setLiveMinute(minute);
          setIsFollowingLive((following) => {
            if (following) setViewMinuteState(minute);
            return following;
          });
          getStandingsAtMinute(minute).then(setStandings);
        },
        onEvent: (event) => {
          if (event.prediction) {
            setIsFollowingLive(true);
            setViewMinuteState(event.minute);
            openPredictionRef.current(event);
          }
        },
      });
      getStandingsAtMinute(APP_CONFIG.START_MINUTE).then(setStandings);
    });

    return () => {
      unsub?.();
    };
  }, [loading]);

  const setViewMinute = useCallback((minute: number) => {
    const clamped = Math.max(0, Math.min(APP_CONFIG.MAX_MINUTE, minute));
    setViewMinuteState(clamped);
    setIsFollowingLive(false);
  }, []);

  const snapToLive = useCallback(() => {
    setViewMinuteState(liveMinuteRef.current);
    setIsFollowingLive(true);
  }, []);

  const score = useMemo(
    () => scoreAtMinute(events, viewMinute),
    [events, viewMinute],
  );

  const currentPoint = useMemo(
    () => getMomentumAtMinute(momentumPoints, viewMinute),
    [momentumPoints, viewMinute],
  );

  const value: MatchContextValue = {
    match,
    events,
    momentumPoints,
    liveMinute,
    liveTimeRef,
    viewMinute,
    isFollowingLive,
    standings,
    predictions,
    activeEvent,
    loading,
    setViewMinute,
    snapToLive,
    setActiveEvent,
    refreshStandings,
    refreshPredictions,
    score,
    currentPoint,
    prediction,
  };

  return (
    <MatchContext.Provider value={value}>{children}</MatchContext.Provider>
  );
}

export function useMatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error("useMatch must be used within MatchProvider");
  return ctx;
}
