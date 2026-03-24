"use client";

import { useMemo } from "react";
import PixelBadge from "../common/PixelBadge";
import PixelButton from "../common/PixelButton";
import PixelPanel from "../common/PixelPanel";
import type { BrandTypeId } from "../../types/brand";
import type { GameMetrics } from "../../types/game";
import {
  buildCapabilityDiagnosis,
  buildTeachingReview,
  computeFinalScore,
  computeOutcome,
  computeScores,
} from "../../lib/scoring";
import { getBrandById } from "../../lib/dataLoader";
import type { OutcomeType } from "../../types/result";
import type { CapabilityDiagnosis } from "../../types/result";

function outcomeTitle(outcome: OutcomeType) {
  switch (outcome) {
    case "short_term_burst_damage":
      return "短期爆量但品牌受损";
    case "steady_growth_cmo":
      return "稳健增长型 CMO";
    case "traffic_expert_trust_loss":
      return "流量高手但失去信任";
    case "brand_equity_builder":
      return "品牌建设专家";
    case "crisis_turnaround_expert":
      return "危机翻盘高手";
  }
}

function toneForOutcome(outcome: OutcomeType): "mint" | "warn" | "danger" {
  switch (outcome) {
    case "short_term_burst_damage":
      return "danger";
    case "traffic_expert_trust_loss":
      return "warn";
    case "crisis_turnaround_expert":
      return "mint";
    case "brand_equity_builder":
      return "mint";
    case "steady_growth_cmo":
      return "mint";
  }
}

function formatMetric(value: number) {
  const v = Math.round(value);
  return v.toString();
}

export default function ResultScreen({
  brandId,
  metrics,
  mode = "final",
  onRestart,
}: {
  brandId: BrandTypeId;
  metrics: GameMetrics;
  mode?: "preview" | "final";
  onRestart?: () => void;
}) {
  const brand = useMemo(() => getBrandById(brandId), [brandId]);

  const { outcome, scores, finalScore, teachingReview, capabilityDiagnosis } =
    useMemo(() => {
      const outcome = computeOutcome(metrics);
      const scores = computeScores(metrics);
      const finalScore = computeFinalScore(scores);
      const teachingReview = buildTeachingReview(brand.name, metrics, finalScore);
      const capabilityDiagnosis = buildCapabilityDiagnosis(scores, metrics);
      return {
        outcome,
        scores,
        finalScore,
        teachingReview,
        capabilityDiagnosis,
      };
    }, [brand.name, metrics]);

  return (
    <PixelPanel
      title={mode === "final" ? "终局结算" : "预览结算"}
      hint="综合认知、信任、跨渠道一致性与风险控制输出结局与能力诊断"
      right={<PixelBadge tone={toneForOutcome(outcome)}>{outcomeTitle(outcome)}</PixelBadge>}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs text-[#00ffaa] font-semibold">结局标题</div>
            <div className="mt-2 text-xl font-extrabold text-[#e8eef6]">
              {outcomeTitle(outcome)}
            </div>
            <div className="mt-1 text-xs text-[#7f8aa3]">
              最终得分（IMC 综合）：{finalScore}/100
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-[#7f8aa3]">品牌</div>
            <div className="mt-1 text-sm font-semibold text-[#00ffaa]">
              {brand.name}
            </div>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["认知", metrics.awareness],
            ["信任", metrics.trust],
            ["一致性", metrics.consistency],
            ["预算", metrics.budget],
            ["利益相关者关系", metrics.stakeholderRelations],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border border-[#00ffaa]/12 bg-[#06080d]/40 px-3 py-3"
            >
              <div className="text-xs text-[#7f8aa3]">{label}</div>
              <div className="mt-2 text-xl font-extrabold text-[#e8eef6]">
                {formatMetric(value as number)}
              </div>
              <div className="mt-1 text-[11px] text-[#7f8aa3]">0-100（MVP 代理）</div>
            </div>
          ))}
        </div>

        {/* Teaching */}
        <div className="border border-[#00ffaa]/12 bg-[#06080d]/35 px-4 py-3">
          <div className="text-xs text-[#00ffaa] font-semibold">教学点评</div>
          <div className="mt-2 text-sm leading-relaxed text-[#a8b3c7]">
            {teachingReview.teachingCommentary}
          </div>
        </div>

        {/* Capability diagnosis */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {capabilityDiagnosis.map((d: CapabilityDiagnosis) => (
            <div
              key={d.aspect}
              className="border border-[#00ffaa]/12 bg-[#06080d]/40 px-3 py-3"
            >
              <div className="text-xs text-[#7f8aa3]">{d.aspect}</div>
              <div className="mt-2 text-lg font-extrabold text-[#e8eef6]">
                {d.finalScore}/100
              </div>
              <div className="mt-1 text-xs leading-relaxed text-[#a8b3c7]">
                {d.diagnosis}
              </div>
            </div>
          ))}
        </div>

        {/* Restart */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-[#7f8aa3]">
            你可以复盘你的“跨渠道一致性 → 信任建立 → 预算承接 → 舆情风险控制”链路。
          </div>
          <div className="flex gap-3">
            {onRestart ? (
              <PixelButton
                onClick={onRestart}
                className="bg-[#070a0f]/60 border-[#00ffaa]/15"
              >
                再玩一次
              </PixelButton>
            ) : (
              <PixelButton
                href={`/play?brand=${encodeURIComponent(brandId)}`}
                className="bg-[#070a0f]/60 border-[#00ffaa]/15"
              >
                再玩一次
              </PixelButton>
            )}
          </div>
        </div>
      </div>
    </PixelPanel>
  );
}

