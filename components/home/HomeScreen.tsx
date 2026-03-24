import PixelCard from "../common/PixelCard";
import PixelButton from "../common/PixelButton";
import PixelPanel from "../common/PixelPanel";
import PixelBadge from "../common/PixelBadge";

export default function HomeScreen({ showTeaching }: { showTeaching?: boolean }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="space-y-6">
        <PixelCard className="relative overflow-hidden p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,255,170,0.14) 0 2px, transparent 2px 10px), repeating-linear-gradient(90deg, rgba(0,255,170,0.08) 0 2px, transparent 2px 12px)",
            }}
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 inline-block border border-[#00ffaa]/30 bg-[#05070c] px-2 py-1 text-[11px] font-bold tracking-widest text-[#00ffaa]">
                PIXEL CMO SIM
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                IMC 模拟器
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#a8b3c7]">
                你扮演品牌 CMO，在回合制环境中做跨渠道决策，观察认知、信任、销量、舆情与长期资产的联动变化。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <PixelBadge>纯像素界面</PixelBadge>
                <PixelBadge tone="mint">IMC 因果解释</PixelBadge>
                <PixelBadge tone="warn">离线可运行</PixelBadge>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="pixel-tower">
                <div className="pixel-tower-top" />
                <div className="pixel-tower-mid" />
                <div className="pixel-tower-base" />
              </div>
              <div className="text-right text-xs text-[#7f8aa3]">
                主流程：首页 → 品牌选择 → 事件回合
              </div>
            </div>
          </div>
        </PixelCard>

        <PixelPanel title="开始模拟" hint="进入品牌选择（稳定路由）">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#a8b3c7]">
              选择品牌类型后，每个事件会展示 3 个 IMC 决策选项并更新指标。
            </div>
            <div className="flex gap-3">
              <PixelButton href="/brand">开始模拟</PixelButton>
              <PixelButton
                href="/?teach=1"
                className="bg-[#070a0f]/60 border-[#00ffaa]/15"
              >
                教学说明（先占位）
              </PixelButton>
            </div>
          </div>
        </PixelPanel>

        {showTeaching ? (
          <PixelPanel
            title="教学说明（占位）"
            hint="后续将接入事件级别 IMC 解释"
          >
            <div className="text-sm leading-relaxed text-[#a8b3c7]">
              这是一段教学占位文本：你将看到每个事件为何这样影响认知、信任与舆情，并学习如何做“跨渠道一致性 + 风险控制 + 长期资产思维”。
            </div>
            <div className="mt-3">
              <PixelButton href="/" className="bg-[#070a0f]/60">
                返回首页
              </PixelButton>
            </div>
          </PixelPanel>
        ) : null}
      </div>
    </div>
  );
}

