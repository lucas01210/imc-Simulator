import type { BrandCategory } from "./brand";

export type MetricKey =
  // Required for IMC simulator core metrics
  | "awareness"
  | "trust"
  | "sales"
  | "budget"
  | "consistency"
  | "stakeholderRelations"
  // Backward-compatible metrics currently used by MVP placeholder engine
  | "sentiment"
  | "teamwork"
  | "longTermAsset";

export type ImpactDelta = Partial<Record<MetricKey, number>>;

export type EventModule =
  | "advertising"
  | "media"
  | "content"
  | "pr"
  | "sales"
  | "crisis"
  | "alliance";

export type TeachingCard = {
  title: string;
  bullets: string[];
};

export type EventOption = {
  id: string;
  label: string;
  effect: ImpactDelta;
};

// An IMC event prompt with 3 decision options.
// The engine can choose to apply one option's effect, and render teaching + IMC point.
export type EventDefinition = {
  id: string;
  module: EventModule;
  title: string;

  // IMC prompt fields (required by the new typing model)
  situationDescription: string;
  decisionGoal: string;
  options: [EventOption, EventOption, EventOption];

  // Teaching & IMC theory
  teachingFeedback: string;
  imcTheoryPoint: string;

  // Used by UI to decide which pixel-visual/animation to show
  visualKey: string;

  // Legacy/compat fields (kept so the current placeholder engine keeps compiling)
  description: string;
  teaching: TeachingCard;
  category: BrandCategory;
  impact: ImpactDelta;
  tone: "good" | "neutral" | "bad";
};

