"use client";

import type { GameMetrics } from "../../types/game";

function MetricTile({
  label,
  value,
  sublabel,
  pulseId,
}: {
  label: string;
  value: number;
  sublabel: string;
  pulseId: number;
}) {
  return (
    <div className="flex flex-col gap-1 border border-[#00ffaa]/20 bg-[#06080d]/55 px-3 py-2">
      <div className="text-xs text-[#a8b3c7]">{label}</div>
      <div className="flex items-baseline justify-between gap-3">
        <div
          key={`${pulseId}-${label}`}
          className="text-xl font-bold tracking-wide text-[#e8eef6]"
          style={{ lineHeight: 1.1 }}
        >
          <span className="imc-digit-pop">{Math.round(value)}</span>
        </div>
      </div>
      <div className="text-[11px] text-[#7f8aa3]">{sublabel}</div>
    </div>
  );
}

export default function MetricsBar({
  metrics,
  pulseId,
}: {
  metrics: GameMetrics;
  pulseId: number;
}) {
  return (
    <div className="border border-[#00ffaa]/16 bg-[#06080d]/35 shadow-pixel px-4 py-3 sm:px-5 sm:py-4">
      <style jsx>{`
        .imc-digit-pop {
          display: inline-block;
          animation: imcDigitPop 420ms ease-out;
          text-shadow: 0 0 18px rgba(0, 255, 170, 0.22);
        }
        @keyframes imcDigitPop {
          0% {
            transform: translateY(6px) scale(0.98);
            opacity: 0.7;
          }
          45% {
            transform: translateY(-2px) scale(1.02);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      <div className="flex items-baseline justify-between gap-3">
        <div className="text-sm font-bold text-[#e8eef6]">指标面板</div>
        <div className="text-xs text-[#7f8aa3]">Core IMC metrics（MVP）</div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricTile
          label="品牌认知"
          value={metrics.awareness}
          sublabel="Coverage → Understanding"
          pulseId={pulseId}
        />
        <MetricTile
          label="信任"
          value={metrics.trust}
          sublabel="Credibility & Consistency"
          pulseId={pulseId}
        />
        <MetricTile
          label="销量"
          value={metrics.sales}
          sublabel="Conversion outcome"
          pulseId={pulseId}
        />
        <MetricTile
          label="预算"
          value={metrics.budget}
          sublabel="可持续承接资源"
          pulseId={pulseId}
        />
        <MetricTile
          label="一致性"
          value={metrics.consistency}
          sublabel="跨渠道口径/节奏一致"
          pulseId={pulseId}
        />
        <MetricTile
          label="利益相关者关系"
          value={metrics.stakeholderRelations}
          sublabel="媒体/渠道/社区关系"
          pulseId={pulseId}
        />
      </div>
    </div>
  );
}

