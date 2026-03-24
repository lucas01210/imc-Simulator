import type { GameMetrics } from "../types/game";
import type { GameResult, ScoringBreakdown } from "../types/result";
import { METRIC_BOUNDS } from "./constants";

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function score01(value: number, min: number, max: number) {
  if (max === min) return 0;
  return clamp01((value - min) / (max - min));
}

export function computeScores(metrics: GameMetrics): ScoringBreakdown {
  // IMC 综合能力评分（MVP 版）：不是只看销量，而是看
  // 1) 跨渠道一致性（consistency + trust + awareness）
  // 2) 资源配置纪律（budget 剩余代表“可持续承接能力”）
  // 3) 风险控制（sentiment + stakeholderRelations + trust）
  // 4) 长期资产意识（longTermAsset + stakeholderRelations）
  // 5) 团队协同执行（teamwork + consistency）

  const consistency01 = score01(
    metrics.consistency,
    METRIC_BOUNDS.min,
    METRIC_BOUNDS.max
  );
  const trust01 = score01(metrics.trust, METRIC_BOUNDS.min, METRIC_BOUNDS.max);
  const awareness01 = score01(
    metrics.awareness,
    METRIC_BOUNDS.min,
    METRIC_BOUNDS.max
  );
  const sales01 = score01(metrics.sales, METRIC_BOUNDS.min, METRIC_BOUNDS.max);
  const budget01 = score01(metrics.budget, METRIC_BOUNDS.min, METRIC_BOUNDS.max);
  const sentiment01 = score01(
    metrics.sentiment,
    METRIC_BOUNDS.min,
    METRIC_BOUNDS.max
  );
  const stakeholderRelations01 = score01(
    metrics.stakeholderRelations,
    METRIC_BOUNDS.min,
    METRIC_BOUNDS.max
  );
  const teamwork01 = score01(metrics.teamwork, METRIC_BOUNDS.min, METRIC_BOUNDS.max);
  const longTermAsset01 = score01(
    metrics.longTermAsset,
    METRIC_BOUNDS.min,
    METRIC_BOUNDS.max
  );

  const crossChannelConsistency01 =
    consistency01 * 0.45 + trust01 * 0.25 + awareness01 * 0.15 + sales01 * 0.15;

  const resourceDiscipline01 =
    budget01 * 0.55 + consistency01 * 0.15 + longTermAsset01 * 0.30;

  const riskControl01 =
    sentiment01 * 0.35 + stakeholderRelations01 * 0.35 + trust01 * 0.30;

  const longTermEquityMindset01 =
    longTermAsset01 * 0.55 + stakeholderRelations01 * 0.25 + trust01 * 0.20;

  const teamworkExecution01 = teamwork01 * 0.65 + consistency01 * 0.35;

  return {
    crossChannelConsistency: Math.round(crossChannelConsistency01 * 100),
    resourceDiscipline: Math.round(resourceDiscipline01 * 100),
    riskControl: Math.round(riskControl01 * 100),
    longTermEquityMindset: Math.round(longTermEquityMindset01 * 100),
    teamworkExecution: Math.round(teamworkExecution01 * 100),
  };
}

export function computeOutcome(metrics: GameMetrics): GameResult["outcomeType"] {
  // 综合规则：不能只看销量；必须结合认知/信任/一致性/预算控制/利益相关者关系。
  // 由于 MVP 目前没有“历史曲线”，我们用最终指标代理“做法结果”。

  const isLowTrust = metrics.trust < 45;
  const isLowConsistency = metrics.consistency < 45;
  const isLowStakeholders = metrics.stakeholderRelations < 45;
  const isBudgetTight = metrics.budget < 20;
  const isAwarenessHigh = metrics.awareness > 65;
  const isSalesHigh = metrics.sales > 70;

  const isLongTermStrong = metrics.longTermAsset > 60;
  const isLongTermMid = metrics.longTermAsset > 45;

  const isRiskEnvBad = metrics.sentiment < -5 || metrics.stakeholderRelations < 45;
  const isRiskMitigated =
    metrics.trust > 65 &&
    metrics.longTermAsset > 60 &&
    metrics.consistency > 50;

  // 1) 危机翻盘高手：舆情环境不佳，但最终信任/长期资产/一致性仍强
  if (isRiskEnvBad && isRiskMitigated) {
    return "crisis_turnaround_expert";
  }

  // 2) 流量高手但失去信任：认知高但信任/一致性/利益相关者关系偏弱
  if (isAwarenessHigh && isLowTrust && (isLowConsistency || isLowStakeholders)) {
    return "traffic_expert_trust_loss";
  }

  // 3) 短期爆量但品牌受损：销量高但长期/信任/一致性明显偏弱，且预算控制不佳
  if (
    isSalesHigh &&
    (metrics.longTermAsset < 45 || metrics.trust < 45 || metrics.consistency < 40) &&
    isBudgetTight
  ) {
    return "short_term_burst_damage";
  }

  // 4) 品牌建设专家：长期资产/一致性/利益相关者关系强，即使销量不一定最高
  if (isLongTermStrong && metrics.consistency > 55 && metrics.stakeholderRelations > 55) {
    return "brand_equity_builder";
  }

  // 5) 稳健增长型 CMO：跨渠道一致性、信任、风险控制相对均衡，长期也在增长
  if (
    metrics.trust > 60 &&
    metrics.consistency > 50 &&
    (metrics.stakeholderRelations > 50 || isLongTermMid) &&
    metrics.budget > 20
  ) {
    return "steady_growth_cmo";
  }

  // 默认落点：偏向稳健但仍保持可解释性
  return "steady_growth_cmo";
}

export function computeFinalScore(scores: ScoringBreakdown): number {
  // IMC 综合最终得分：仍是 0-100，但强调一致性/长期/风险控制。
  const weighted =
    scores.crossChannelConsistency * 0.22 +
    scores.resourceDiscipline * 0.16 +
    scores.riskControl * 0.22 +
    scores.longTermEquityMindset * 0.22 +
    scores.teamworkExecution * 0.18;

  return Math.max(0, Math.min(100, Math.round(weighted)));
}

export function buildCapabilityDiagnosis(
  scores: ScoringBreakdown,
  _metrics: GameMetrics
): GameResult["capabilityDiagnosis"] {
  // Coach-style diagnosis mapping.
  const list: GameResult["capabilityDiagnosis"] = [
    {
      aspect: "跨渠道一致性",
      finalScore: scores.crossChannelConsistency,
      diagnosis:
        scores.crossChannelConsistency >= 75
          ? "跨渠道口径较一致，能够把覆盖转化为理解与信任。"
          : "跨渠道节奏或信息口径不够一致，容易出现“看见了但不信”。",
    },
    {
      aspect: "资源配置纪律",
      finalScore: scores.resourceDiscipline,
      diagnosis:
        scores.resourceDiscipline >= 75
          ? "预算节奏较稳，能够支撑长期策略，而不是一次性冲刺。"
          : "预算消耗偏激进/偏分散，后续回合可能缺乏承接能力。",
    },
    {
      aspect: "风险控制",
      finalScore: scores.riskControl,
      diagnosis:
        scores.riskControl >= 75
          ? "舆情波动被及时干预，危机传播得到缓冲。"
          : "风险管理偏弱，负面舆情会反噬信任与长期资产。",
    },
    {
      aspect: "长期资产意识",
      finalScore: scores.longTermEquityMindset,
      diagnosis:
        scores.longTermEquityMindset >= 75
          ? "长期资产思维清晰：促销承接了体验与口碑。"
          : "短期销量与长期资产可能背离，需更早建立信任底盘。",
    },
    {
      aspect: "团队协同执行",
      finalScore: scores.teamworkExecution,
      diagnosis:
        scores.teamworkExecution >= 75
          ? "团队协同良好，联动决策产生了更高执行效率。"
          : "跨部门一致性不足，联动决策会打折或出现信息断层。",
    },
  ];

  return list;
}

export function buildTeachingReview(
  brandName: string,
  metrics: GameMetrics,
  finalScore: number
): GameResult["teachingReview"] {
  const scores = computeScores(metrics);
  const bullets: string[] = [];

  // 选择低分维度作为“教学点”
  const sorted = [
    ["跨渠道一致性", scores.crossChannelConsistency],
    ["资源配置纪律", scores.resourceDiscipline],
    ["风险控制", scores.riskControl],
    ["长期资产意识", scores.longTermEquityMindset],
    ["团队协同执行", scores.teamworkExecution],
  ] as const;
  const worst = sorted.reduce((a, b) => (a[1] < b[1] ? a : b));
  const worstLabel = worst[0];

  if (worstLabel === "跨渠道一致性") {
    bullets.push("你的跨渠道一致性偏弱：先统一口径（广告/内容/公关/落地页），再提升触达质量。");
    bullets.push("一致的叙事能减少认知偏差，避免“看过但不信”。");
  } else {
    bullets.push("你具备一定的跨渠道能力底盘，可以在下一局做更精细的“承接—转化—口碑沉淀”。");
  }

  if (metrics.sentiment < -5 || metrics.stakeholderRelations < 0) {
    bullets.push("风险控制需要增强：舆情变负时优先做透明沟通与一致行动，再推进促销。");
  } else {
    bullets.push("风险环境相对稳定：促销与活动可以更强调体验承接与口碑扩散。");
  }

  bullets.push(`本局最终得分 ${finalScore}：复盘时把“短期指标变化”与“长期资产影响”放在同一条链路对照。`);

  return {
    teachingCommentary: bullets.join(" "),
    summary: `${brandName} 在本局呈现了“指标—决策—舆情反馈”的 IMC 训练轨迹。`,
    doNextRound: bullets.slice(0, 3),
    teachingPoints: bullets,
  };
}

