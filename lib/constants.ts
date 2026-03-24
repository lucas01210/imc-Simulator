import type { BrandTypeId } from "../types/brand";
import type { EventModule } from "../types/event";

export const APP_VERSION = 1 as const;

export const DEFAULT_TOTAL_TURNS = 5 as const;

export const METRIC_BOUNDS = {
  min: -50,
  max: 100,
} as const;

export const DECISION_CARD_LIMIT_PER_TURN = 2 as const;

export const BRAND_IDS: BrandTypeId[] = ["beauty", "tea", "auto"];

// Decision modules that will appear as cards in MVP
export const EVENT_MODULES: EventModule[] = [
  "advertising",
  "media",
  "content",
  "pr",
  "sales",
  "crisis",
  "alliance",
];

// UI tokens for global consistency.
// Note: Tailwind className 仍是主实现方式；此处用于文档/约定。
export const UI_TOKENS = {
  // Typography
  fontMono:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  // Spacing guidance (match the Tailwind scale you're using in components)
  spacing: {
    xs: "gap-2 / px-3",
    sm: "gap-3 / px-4",
    md: "gap-4 / px-5",
    lg: "gap-5 / px-6",
  },
  // Pixel feel: prefer square corners and sharp borders
  radius: {
    pixel: 0,
  },
} as const;

