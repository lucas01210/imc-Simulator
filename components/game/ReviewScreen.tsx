import PixelPanel from "../common/PixelPanel";
import type { BrandTypeId } from "../../types/brand";
import type { GameMetrics } from "../../types/game";
import { getBrandById } from "../../lib/dataLoader";
import { buildTeachingReview } from "../../lib/scoring";

export default function ReviewScreen({
  brandId,
  metrics,
}: {
  brandId: BrandTypeId;
  metrics: GameMetrics;
}) {
  const brand = getBrandById(brandId);
  // MVP: finalScore 在 gameEngine 里计算；这里用一个占位参数保持类型兼容
  const review = buildTeachingReview(brand.name, metrics, 0);

  return (
    <PixelPanel
      title="IMC 复盘建议（占位）"
      hint="后续会结合事件日志，解释“哪里做对/做错”"
    >
      <div className="text-sm leading-relaxed text-[#a8b3c7]">
        {review.summary}
      </div>
      <div className="mt-3 space-y-2">
        {review.doNextRound.map((b) => (
          <div
            key={b}
            className="border border-[#00ffaa]/10 bg-[#06080d]/35 px-3 py-2 text-xs text-[#a8b3c7]"
          >
            {b}
          </div>
        ))}
      </div>
    </PixelPanel>
  );
}

