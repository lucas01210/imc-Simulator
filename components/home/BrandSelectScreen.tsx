import PixelCard from "../common/PixelCard";
import PixelBadge from "../common/PixelBadge";
import Link from "next/link";
import type { BrandTypeId } from "../../types/brand";

const brandCards: Array<{
  id: BrandTypeId;
  name: string;
  hint: string;
  tone?: "mint" | "warn" | "danger";
}> = [
  {
    id: "beauty",
    name: "新锐美妆品牌 CMO",
    hint: "内容叙事与可信背书协同",
    tone: "mint",
  },
  {
    id: "tea",
    name: "国潮茶饮品牌 CMO",
    hint: "利益相关者关系与口碑资产沉淀",
    tone: "warn",
  },
  {
    id: "auto",
    name: "智能汽车品牌 CMO",
    hint: "媒介与渠道协同把触达变信任转化",
    tone: "danger",
  },
];

export default function BrandSelectScreen() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs text-[#00ffaa] font-semibold">
              选择品牌类型
            </div>
            <div className="mt-2 text-2xl font-extrabold sm:text-3xl">
              CMO 起手环境
            </div>
            <div className="mt-2 text-sm leading-relaxed text-[#a8b3c7] max-w-2xl">
              每个品牌会初始化不同资源与事件分布。点击卡片进入游戏流程。
            </div>
          </div>
          <div className="flex gap-2">
            <PixelBadge>本地离线</PixelBadge>
            <PixelBadge tone="mint">事件引擎待演示</PixelBadge>
          </div>
        </div>

        <PixelCard className="p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {brandCards.map((b) => (
              <Link
                key={b.id}
                href={`/play?brand=${encodeURIComponent(b.id)}`}
                className="group block"
              >
                <div className="relative overflow-hidden border border-[#00ffaa]/15 bg-[#06080d]/40 p-4 shadow-pixel transition group-hover:brightness-110">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, rgba(0,255,170,0.15) 0 2px, transparent 2px 10px)",
                    }}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#e8eef6]">
                        {b.name}
                      </div>
                      <div className="mt-1 text-xs text-[#7f8aa3]">
                        {b.hint}
                      </div>
                    </div>
                    <PixelBadge tone={b.tone ?? "mint"}>
                      {b.id.toUpperCase()}
                    </PixelBadge>
                  </div>

                  <div className="mt-3 text-xs text-[#7f8aa3]">
                    点击进入游戏
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </PixelCard>
      </div>
    </div>
  );
}

