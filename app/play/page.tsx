import PixelButton from "../../components/common/PixelButton";
import EventScreen from "../../components/game/EventScreen";
import type { BrandTypeId } from "../../types/brand";

export default function PlayPage({
  searchParams,
}: {
  searchParams?: { brand?: string };
}) {
  const brandId = (searchParams?.brand ?? "beauty") as BrandTypeId;

  return (
    <main>
      <div className="mx-auto max-w-5xl px-4 pt-10">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-[#7f8aa3]">
            本地离线回合模拟（占位：已接入初始化指标与 IMC 解释骨架）
          </div>
          <div>
            <PixelButton href="/" className="bg-[#070a0f]/60">
              返回首页
            </PixelButton>
          </div>
        </div>
      </div>

      <EventScreen brandId={brandId} />
    </main>
  );
}

