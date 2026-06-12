import { APP_CONFIG } from "@/lib/config";
import type { MatchEvent } from "@/lib/types";
import { getEvents } from "./matchService";

export interface MatchFeedCallbacks {
  onMinute: (minute: number) => void;
  onEvent?: (event: MatchEvent) => void;
}

export interface MatchFeed {
  subscribe(callbacks: MatchFeedCallbacks): () => void;
  getCurrentMinute(): number;
  snapTo(minute: number): void;
}

export class ScriptedMatchFeed implements MatchFeed {
  private currentMinute: number;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private events: MatchEvent[] = [];
  private firedEvents = new Set<string>();

  constructor(startMinute = APP_CONFIG.START_MINUTE) {
    this.currentMinute = startMinute;
  }

  async init(): Promise<void> {
    this.events = await getEvents();
  }

  getCurrentMinute(): number {
    return this.currentMinute;
  }

  snapTo(minute: number): void {
    this.currentMinute = minute;
  }

  subscribe(callbacks: MatchFeedCallbacks): () => void {
    callbacks.onMinute(this.currentMinute);

    this.intervalId = setInterval(() => {
      if (this.currentMinute >= APP_CONFIG.MAX_MINUTE) return;

      this.currentMinute += 1;
      callbacks.onMinute(this.currentMinute);

      const event = this.events.find((e) => e.minute === this.currentMinute);
      if (event && !this.firedEvents.has(event.id)) {
        this.firedEvents.add(event.id);
        callbacks.onEvent?.(event);
      }
    }, APP_CONFIG.TICK_MS);

    return () => {
      if (this.intervalId) clearInterval(this.intervalId);
    };
  }
}

export function createMatchFeed(): ScriptedMatchFeed {
  return new ScriptedMatchFeed();
}
