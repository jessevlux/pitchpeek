import { APP_CONFIG } from "@/lib/config";
import type { MatchEvent } from "@/lib/types";
import { getEvents } from "./matchService";

export interface MatchFeedCallbacks {
  onMinute: (minute: number) => void;
  /** Called every animation frame with the fractional current time (float). */
  onTime?: (time: number) => void;
  onEvent?: (event: MatchEvent) => void;
}

export interface MatchFeed {
  subscribe(callbacks: MatchFeedCallbacks): () => void;
  getCurrentMinute(): number;
  snapTo(minute: number): void;
}

const MINUTES_PER_MS = 1 / APP_CONFIG.TICK_MS;

export class ScriptedMatchFeed implements MatchFeed {
  private currentTime: number;
  private events: MatchEvent[] = [];
  private firedEvents = new Set<string>();

  constructor(startMinute = APP_CONFIG.START_MINUTE) {
    this.currentTime = startMinute;
  }

  async init(): Promise<void> {
    this.events = await getEvents();
  }

  getCurrentMinute(): number {
    return Math.floor(this.currentTime);
  }

  snapTo(minute: number): void {
    this.currentTime = minute;
  }

  subscribe(callbacks: MatchFeedCallbacks): () => void {
    let lastTs: number | null = null;
    let rafId: number;
    let active = true;

    const loop = (ts: number) => {
      if (!active) return;

      if (lastTs !== null && this.currentTime < APP_CONFIG.MAX_MINUTE) {
        const prevFloor = Math.floor(this.currentTime);
        const delta = ts - lastTs;
        this.currentTime = Math.min(
          APP_CONFIG.MAX_MINUTE,
          this.currentTime + delta * MINUTES_PER_MS,
        );
        const newFloor = Math.floor(this.currentTime);

        // Fire onMinute for every integer boundary crossed (handles frame drops)
        for (let m = prevFloor + 1; m <= newFloor; m++) {
          callbacks.onMinute(m);
          const event = this.events.find((e) => e.minute === m);
          if (event && !this.firedEvents.has(event.id)) {
            this.firedEvents.add(event.id);
            callbacks.onEvent?.(event);
          }
        }
      }

      lastTs = ts;
      callbacks.onTime?.(this.currentTime);
      rafId = requestAnimationFrame(loop);
    };

    // Emit current state immediately
    callbacks.onMinute(Math.floor(this.currentTime));
    callbacks.onTime?.(this.currentTime);
    rafId = requestAnimationFrame(loop);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
    };
  }
}

export function createMatchFeed(): ScriptedMatchFeed {
  return new ScriptedMatchFeed();
}
