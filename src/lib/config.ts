export const APP_CONFIG = {
  TICK_MS: 4000,
  START_MINUTE: 31,
  MAX_MINUTE: 90,
  HEATMAP_TRAIL_MINUTES: 5,
  PREDICTION_RESOLVE_MS: 3000,
  EVENT_POPUP_DISMISS_MS: 4000,
  DEFAULT_BONUS_POINTS: 25,
} as const;

export const STORAGE_KEYS = {
  USER_PROFILE: "tactisch-momentum-profile",
  BONUS_POINTS: "tactisch-momentum-bonus",
} as const;
