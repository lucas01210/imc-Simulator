"use client";

import { motion, useReducedMotion } from "framer-motion";
import PixelBadge from "../common/PixelBadge";
import PixelPanel from "../common/PixelPanel";

type VisualType =
  | "ad_campaign"
  | "pr_crisis"
  | "sales_promo"
  | "influencer_collab"
  | "stakeholder_meeting"
  | "product_launch";

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function detectVisualType(visualKey: string): VisualType {
  const k = visualKey.toLowerCase();

  if (k.includes("crisis") || k.includes("pr")) return "pr_crisis";
  if (k.includes("sales") || k.includes("promo") || k.includes("discount"))
    return "sales_promo";
  if (k.includes("kol") || k.includes("influencer") || k.includes("community"))
    return "influencer_collab";
  if (k.includes("stakeholder") || k.includes("meeting") || k.includes("dealer"))
    return "stakeholder_meeting";
  if (k.includes("launch") || k.includes("product")) return "product_launch";

  // default
  return "ad_campaign";
}

function labelForType(t: VisualType) {
  switch (t) {
    case "ad_campaign":
      return "广告触达 / 媒介放大";
    case "pr_crisis":
      return "公关危机 / 信任修复";
    case "sales_promo":
      return "促销设计 / 转化承接";
    case "influencer_collab":
      return "KOL/社群合作 / 口碑共创";
    case "stakeholder_meeting":
      return "利益相关者会议 / 协同一致";
    case "product_launch":
      return "新品发布 / 上市传播";
  }
}

function ScanBurst({
  reducedMotion,
  variant,
}: {
  reducedMotion: boolean;
  variant: number;
}) {
  return (
    <div className="relative h-40 overflow-hidden border border-[#00ffaa]/15 bg-[#06080d]/45">
      <div className="absolute inset-0 opacity-70 bg-[linear-gradient(90deg,rgba(0,255,170,0.22),transparent_40%)]" />
      {!reducedMotion ? (
        <>
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,255,170,0.22) 0px, transparent 2px)",
              backgroundSize: "100% 8px",
            }}
            animate={{ opacity: [0.25, 0.55, 0.25], y: [0, -6, 0] }}
            transition={{
              duration: 1.1,
              repeat: reducedMotion ? 0 : 2,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* Pixel burst */}
            {Array.from({ length: 8 + variant * 2 }).map((_, i) => {
              const size = 6 + (i % 3) * 2;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    width: size,
                    height: size,
                    background: "rgba(0,255,170,0.28)",
                    border: "1px solid rgba(0,255,170,0.25)",
                    transform: `translate(-50%,-50%) rotate(${i * (16 + variant * 2)}deg) translateY(-28px)`,
                  }}
                  initial={{ opacity: 0.2, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                />
              );
            })}
          </motion.div>
        </>
      ) : (
        <div className="absolute inset-0" />
      )}
    </div>
  );
}

function CrisisVisual({
  reducedMotion,
  variant,
}: {
  reducedMotion: boolean;
  variant: number;
}) {
  return (
    <div className="relative h-40 overflow-hidden border border-[#ff4d6d]/20 bg-[#06080d]/45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,77,109,0.22),transparent_55%)]" />
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,77,109,0.25), rgba(255,77,109,0) 12px)",
          opacity: reducedMotion ? 0.25 : 0.35,
        }}
        animate={
          reducedMotion
            ? undefined
            : { x: [0, 6 + variant * 6, 0], opacity: [0.25, 0.45, 0.25] }
        }
        transition={{
          duration: 0.75 + variant * 0.05,
          repeat: reducedMotion ? 0 : 2,
        }}
      />

      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="relative">
          {/* Triangle icon */}
          <div
            className="h-0 w-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[26px] border-b-[#ff4d6d]/70"
            aria-hidden="true"
          />
          <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-4 rounded-none border border-[#ff4d6d]/35 bg-[#070a0f]/60" />
          <motion.div
            className="absolute left-1/2 top-1/2 h-1 w-3 -translate-x-1/2 -translate-y-1 bg-[#ff4d6d]/80"
            animate={
              reducedMotion
                ? undefined
                : {
                    y: [-2 - variant, 2 + variant, -2 - variant],
                    opacity: [0.65, 1, 0.65],
                  }
            }
            transition={{
              duration: 0.35 + variant * 0.05,
              repeat: reducedMotion ? 0 : 2,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function SalesPromoVisual({
  reducedMotion,
  variant,
}: {
  reducedMotion: boolean;
  variant: number;
}) {
  return (
    <div className="relative h-40 overflow-hidden border border-[#ffd166]/20 bg-[#06080d]/45">
      <div className="absolute inset-0 opacity-60 bg-[linear-gradient(135deg,rgba(255,209,102,0.18),transparent_55%)]" />
      <div className="relative z-10 flex h-full items-center justify-between px-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-[#ffd166]">PROMO</div>
          <div className="text-lg font-extrabold text-[#e8eef6]">-XX%</div>
          <div className="text-[11px] text-[#7f8aa3]">转化承接</div>
        </div>

        <div className="w-24">
          <div className="text-[11px] text-[#7f8aa3]">Impact</div>
          <div className="mt-2 h-2 w-full border border-[#ffd166]/25 bg-[#070a0f]/40" />
          {!reducedMotion ? (
            <motion.div
              className="mt-2 h-2 rounded-none bg-[#ffd166]/35"
              initial={{ width: 12 }}
              animate={{ width: [18, 44 + variant * 6, 30, 58 + variant * 4] }}
              transition={{
                duration: 1.0 + variant * 0.06,
                repeat: 2,
                ease: "easeInOut",
              }}
            />
          ) : (
            <div className="mt-2 h-2 w-48 bg-[#ffd166]/25" />
          )}
        </div>
      </div>
    </div>
  );
}

function InfluencerVisual({
  reducedMotion,
  variant,
}: {
  reducedMotion: boolean;
  variant: number;
}) {
  const vertical = variant % 2 === 1;
  return (
    <div className="relative h-40 overflow-hidden border border-[#00ffaa]/15 bg-[#06080d]/45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(0,255,170,0.18),transparent_50%)]" />
      <div
        className={[
          "relative z-10 flex h-full items-center justify-center gap-6",
          vertical ? "flex-col" : "",
        ].join(" ")}
      >
        <div className="relative">
          <div className="h-14 w-14 border border-[#00ffaa]/25 bg-[#070a0f]/70 shadow-pixel" />
          <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-2 bg-[#00ffaa]/35" />
        </div>
        <div className="relative w-32">
          <motion.div
            className="absolute left-0 top-1/2 h-1 w-full bg-[#00ffaa]/25"
            style={{ transformOrigin: "0% 50%" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
          {!reducedMotion ? (
            <motion.div
              className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1 border border-[#00ffaa]/20 bg-[#06080d]/30"
              animate={{ rotate: [0, 10, -6, 0] }}
              transition={{
                duration: 0.55 + variant * 0.07,
                repeat: 2,
                ease: "easeInOut",
              }}
            />
          ) : null}
        </div>
        <div className="relative">
          <div className="h-14 w-14 border border-[#00ffaa]/25 bg-[#070a0f]/70 shadow-pixel" />
          <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-2 bg-[#00ffaa]/35" />
        </div>
      </div>
    </div>
  );
}

function StakeholderMeetingVisual({
  reducedMotion,
  variant,
}: {
  reducedMotion: boolean;
  variant: number;
}) {
  const nodes = 6 + variant;
  return (
    <div className="relative h-40 overflow-hidden border border-[#7f8aa3]/20 bg-[#06080d]/45">
      <div className="absolute inset-0 opacity-60 bg-[linear-gradient(0deg,rgba(127,138,163,0.14),transparent_60%)]" />
      <div className="relative z-10 flex h-full items-center justify-between px-4">
        <div className="w-40">
          <div className="text-xs font-semibold text-[#00ffaa]">MEETING</div>
          <div className="mt-2 space-y-2">
            <div className="h-10 w-full border border-[#00ffaa]/10 bg-[#06080d]/35 px-3 py-2">
              <div className="h-1 w-16 bg-[#00ffaa]/25" />
              <div className="mt-2 h-1 w-28 bg-[#00ffaa]/15" />
            </div>
            <div className="h-10 w-full border border-[#00ffaa]/10 bg-[#06080d]/35 px-3 py-2">
              <div className="h-1 w-20 bg-[#00ffaa]/25" />
              <div className="mt-2 h-1 w-20 bg-[#00ffaa]/15" />
            </div>
          </div>
        </div>

        <div className="relative h-28 w-32">
          {Array.from({ length: nodes }).map((_, i) => {
            const x = 8 + (i % 4) * 22;
            const y = 8 + Math.floor(i / 4) * 18;
            return (
              <motion.div
                key={i}
                className="absolute h-5 w-5 border border-[#7f8aa3]/20 bg-[#070a0f]/60"
                style={{ left: x, top: y }}
                initial={{ opacity: 0.4, scale: 0.85 }}
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        opacity: [0.45, 1, 0.45],
                        y: [0, -6, 0],
                      }
                }
                transition={{ duration: 0.9, delay: i * 0.05 }}
              />
            );
          })}
          {/* connection line */}
          <div className="absolute inset-0 opacity-60">
            <div className="absolute left-1 top-1 h-px w-[90%] bg-[#7f8aa3]/20 rotate-[18deg]" />
            <div className="absolute left-1 bottom-1 h-px w-[90%] bg-[#7f8aa3]/20 rotate-[-18deg]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductLaunchVisual({
  reducedMotion,
  variant,
}: {
  reducedMotion: boolean;
  variant: number;
}) {
  return (
    <div className="relative h-40 overflow-hidden border border-[#00ffaa]/15 bg-[#06080d]/45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,170,0.22),transparent_55%)]" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <motion.div
          className="relative"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Rocket body */}
          <div className="h-16 w-12 border border-[#00ffaa]/25 bg-[#070a0f]/65 shadow-pixel" />
          <div className="mt-[-3px] mx-auto h-3 w-6 border border-[#00ffaa]/20 bg-[#00ffaa]/25" />
          <div className="absolute left-1/2 top-1/2 h-1 w-10 -translate-x-1/2 -translate-y-10 bg-[#00ffaa]/30" />

          {!reducedMotion ? (
            <motion.div
              className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 translate-y-10 border border-[#00ffaa]/20 bg-[#06080d]/25"
              animate={{
                opacity: [0.25, 0.92 - variant * 0.05, 0.25],
                scale: [0.75, 1.05, 0.82],
              }}
              transition={{
                duration: 0.75 + variant * 0.05,
                repeat: 2,
                ease: "easeInOut",
              }}
            />
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

export default function EventVisual({
  visualKey,
}: {
  visualKey: string;
}) {
  const reducedMotion = !!useReducedMotion();
  const type = detectVisualType(visualKey);
  const variant = hashString(visualKey) % 3;

  return (
    <PixelPanel
      title="事件视觉反馈"
      hint={labelForType(type)}
      right={<PixelBadge>{type}</PixelBadge>}
    >
      <div className="space-y-3">
        {/* Main visual */}
        {type === "ad_campaign" ? (
          <ScanBurst reducedMotion={reducedMotion} variant={variant} />
        ) : null}
        {type === "pr_crisis" ? (
          <CrisisVisual reducedMotion={reducedMotion} variant={variant} />
        ) : null}
        {type === "sales_promo" ? (
          <SalesPromoVisual reducedMotion={reducedMotion} variant={variant} />
        ) : null}
        {type === "influencer_collab" ? (
          <InfluencerVisual reducedMotion={reducedMotion} variant={variant} />
        ) : null}
        {type === "stakeholder_meeting" ? (
          <StakeholderMeetingVisual reducedMotion={reducedMotion} variant={variant} />
        ) : null}
        {type === "product_launch" ? (
          <ProductLaunchVisual reducedMotion={reducedMotion} variant={variant} />
        ) : null}

        {/* Visual key (debug-friendly but still compact) */}
        <div className="text-[11px] text-[#7f8aa3]">
          visualKey:{" "}
          <span className="text-[#00ffaa]">{visualKey}</span>
        </div>
      </div>
    </PixelPanel>
  );
}

