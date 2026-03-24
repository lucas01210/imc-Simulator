import PixelButton from "../../components/common/PixelButton";
import ResultScreen from "../../components/game/ResultScreen";
import ReviewScreen from "../../components/game/ReviewScreen";
import { initializeGame } from "../../lib/gameEngine";
import type { BrandTypeId } from "../../types/brand";

export default function EndingPage({
  searchParams,
}: {
  searchParams?: { brand?: string };
}) {
  const brandId = (searchParams?.brand ?? "beauty") as BrandTypeId;
  const state = initializeGame(brandId);

  return (
    <main>
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-14">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-[#7f8aa3]">
            结局/复盘页（占位版）：用于展示结果与 IMC 回顾结构
          </div>
          <div className="flex gap-3">
            <PixelButton href="/play?brand=beauty" className="bg-[#070a0f]/60">
              返回游戏页
            </PixelButton>
            <PixelButton href="/">返回首页</PixelButton>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <ResultScreen brandId={brandId} metrics={state.metrics} mode="final" />
          <ReviewScreen brandId={brandId} metrics={state.metrics} />
        </div>
      </div>
    </main>
  );
}

