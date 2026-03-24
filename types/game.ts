import type { BrandTypeId } from "./brand";
import type { EventDefinition } from "./event";

export type TurnIndex = number;

export type GameMetrics = {
  /**
   * IMC 核心可见指标（本题要求的必填项）
   * - 品牌认知：awareness
   * - 信任：trust
   * - 销量：sales
   * - 预算：budget
   * - 一致性：consistency（跨渠道信息/口径一致与节奏一致的代理指标）
   * - 利益相关者关系：stakeholderRelations（媒体/社区/渠道伙伴关系的代理指标）
   */
  awareness: number;
  trust: number;
  sales: number;
  budget: number;
  consistency: number;
  stakeholderRelations: number;

  // Legacy fields kept so the current MVP placeholder engine keeps compiling.
  sentiment: number;
  teamwork: number;
  longTermAsset: number;
};

export type GameEventLog = {
  turn: number;
  eventId: string;
  title: string;
  description: string;

  // Teaching payload for UI
  teachingTitle: string;
  teachingBullets: string[];

  // Overall impact summary applied to this event
  impact: Partial<GameMetrics>;

  // Visual feedback hook
  visualKey?: string;

  // Optional: future expansion for option-level granularity
  selectedOptionId?: string;

  tone: "good" | "neutral" | "bad";
};

export type GameState = {
  version: 1;
  brandId: BrandTypeId;
  turnIndex: TurnIndex;
  totalTurns: number;

  // Game state must carry IMC-visible metrics.
  metrics: GameMetrics;
  eventLog: GameEventLog[];

  // Store the decision identifiers/options selected this turn
  selectedDecisionIds: string[];
  lastEvents: EventDefinition[];
};

