import type { BrandTypeId } from "./brand";
import type { GameMetrics } from "./game";

export type OutcomeType =
  // 短期爆量但品牌受损
  | "short_term_burst_damage"
  // 稳健增长型 CMO
  | "steady_growth_cmo"
  // 流量高手但失去信任
  | "traffic_expert_trust_loss"
  // 品牌建设专家
  | "brand_equity_builder"
  // 危机翻盘高手
  | "crisis_turnaround_expert";

export type ScoringBreakdown = {
  crossChannelConsistency: number;
  resourceDiscipline: number;
  riskControl: number;
  longTermEquityMindset: number;
  teamworkExecution: number;
};

export type CapabilityDiagnosis = {
  aspect:
    | "跨渠道一致性"
    | "资源配置纪律"
    | "风险控制"
    | "长期资产意识"
    | "团队协同执行";
  finalScore: number; // 0-100
  diagnosis: string; // coach-style short text
};

export type GameResult = {
  brandId: BrandTypeId;

  // 结局类型（必填）
  outcomeType: OutcomeType;

  // Legacy alias for existing placeholder engine/UI
  outcome: OutcomeType;

  // 最终得分（必填）
  finalScore: number;

  finalMetrics: GameMetrics;
  scores: ScoringBreakdown;

  teachingReview: {
    // 教学点评（必填）
    teachingCommentary: string;

    // 简短摘要（保留：供现有 UI 使用）
    summary: string;

    // 用于结局页复盘结构（保留：供现有 UI 使用）
    doNextRound: string[];

    // 可选：更细的教学要点（后续扩展）
    teachingPoints?: string[];
  };

  // 能力诊断（必填）
  capabilityDiagnosis: CapabilityDiagnosis[];
};

