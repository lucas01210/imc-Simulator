"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { BrandTypeId } from "../../types/brand";
import type { EventDefinition, EventOption } from "../../types/event";
import type { GameResult } from "../../types/result";
import { getBrandById } from "../../lib/dataLoader";
import {
  getCurrentEvent,
  initializeGame,
  isGameOver,
  finalizeGame,
  resolveTurn,
} from "../../lib/gameEngine";
import PixelButton from "../common/PixelButton";
import MetricsBar from "./MetricsBar";
import EventVisual from "./EventVisual";
import ResultScreen from "./ResultScreen";

type Phase = "selecting" | "resolving" | "after";

function buildFeedbackText(event: EventDefinition, option: EventOption) {
  return `本次选择：${option.label}\n\n${event.teachingFeedback}\n\nIMC 理论点：${event.imcTheoryPoint}`;
}

export default function EventScreen({ brandId }: { brandId: BrandTypeId }) {
  const brand = useMemo(() => getBrandById(brandId), [brandId]);

  const [gameState, setGameState] = useState(() => initializeGame(brandId));
  const [phase, setPhase] = useState<Phase>("selecting");
  const [pulseId, setPulseId] = useState(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [resolvedTurnEventsTitle, setResolvedTurnEventsTitle] = useState<
    string | null
  >(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const reducedMotion = useReducedMotion();

  const currentEvent = useMemo(
    () => getCurrentEvent(gameState),
    [gameState]
  );

  const showResult = result !== null;

  const progressText = useMemo(() => {
    const t = Math.min(gameState.turnIndex + 1, gameState.totalTurns);
    return `${t}/${gameState.totalTurns}`;
  }, [gameState.totalTurns, gameState.turnIndex]);

  function onPick(optionId: string) {
    if (!currentEvent) return;
    if (phase !== "selecting") return;

    const option = currentEvent.options.find((o) => o.id === optionId);
    if (!option) return;

    setPhase("resolving");
    setPulseId((x) => x + 1);
    setSelectedOptionId(optionId);
    setResolvedTurnEventsTitle(currentEvent.title);
    setFeedbackText(buildFeedbackText(currentEvent, option));

    // Give a short moment to show the animation before the numbers jump.
    window.setTimeout(() => {
      const next = resolveTurn(gameState, [optionId]);
      setGameState(next);

      if (isGameOver(next)) {
        setResult(finalizeGame(next));
        setPhase("after");
      } else {
        setPhase("after");
      }
    }, 420);
  }

  function onContinue() {
    if (phase === "resolving") return;
    if (!showResult) {
      setPhase("selecting");
      setFeedbackText("");
      setResolvedTurnEventsTitle(null);
      setSelectedOptionId(null);
      return;
    }
    // MVP：结局由当前页展示，无需强制跳转。
  }

  const options = currentEvent?.options ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs text-[#00ffaa] font-semibold">
              游戏主界面
            </div>
            <div className="mt-2 text-2xl font-extrabold">{brand.name}</div>
            <div className="mt-1 text-sm text-[#a8b3c7] leading-relaxed">
              {brand.tagline}
            </div>
          </div>
          <div className="text-right text-xs text-[#7f8aa3]">
            回合 {progressText}
          </div>
        </header>

        <MetricsBar metrics={gameState.metrics} pulseId={pulseId} />

        {/* Event panel */}
        <motion.section
          initial={false}
          className="border border-[#00ffaa]/18 bg-[#06080d]/35 shadow-pixel px-4 py-3 sm:px-5 sm:py-4"
          animate={
            !reducedMotion && phase === "resolving"
              ? { x: [0, -6, 4, -3, 0] }
              : { x: 0 }
          }
          transition={{ duration: 0.42, ease: "easeOut" }}
        >
          {showResult && result ? (
            <ResultScreen
              brandId={brandId}
              metrics={gameState.metrics}
              mode="final"
              onRestart={() => {
                setGameState(initializeGame(brandId));
                setPhase("selecting");
                setPulseId((x) => x + 1);
                setFeedbackText("");
                setResolvedTurnEventsTitle(null);
                setSelectedOptionId(null);
                setResult(null);
              }}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <div className="text-xs text-[#00ffaa] font-semibold">
                    当前事件
                  </div>
                  <div className="mt-2 text-lg font-extrabold text-[#e8eef6]">
                    {currentEvent?.title ?? "（无）"}
                  </div>
                </div>
                <div className="text-right text-xs text-[#7f8aa3]">
                  {phase === "after" ? "已结算" : "待选择"}
                </div>
              </div>

              <div className="text-sm leading-relaxed text-[#a8b3c7]">
                {currentEvent?.situationDescription ?? ""}
              </div>

              <AnimatePresence mode="wait">
                {phase === "after" && feedbackText ? (
                  <motion.div
                    key="feedback"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="border border-[#00ffaa]/12 bg-[#06080d]/45 px-3 py-3"
                  >
                    <div className="text-xs text-[#00ffaa] font-semibold">
                      本次选择反馈
                    </div>
                    <div className="mt-2 whitespace-pre-line text-xs leading-relaxed text-[#a8b3c7]">
                      {feedbackText}
                    </div>
                    <div className="mt-3 text-[11px] text-[#7f8aa3]">
                      {resolvedTurnEventsTitle
                        ? `事件：${resolvedTurnEventsTitle}`
                        : ""}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )}
        </motion.section>

        {/* Visual feedback */}
        {!showResult && currentEvent ? (
          <div key={`${currentEvent.visualKey}-${pulseId}`}>
            <EventVisual visualKey={currentEvent.visualKey} />
          </div>
        ) : null}

        {/* Decision options */}
        {!showResult ? (
          <section className="grid gap-3 sm:grid-cols-3">
            {options.map((o) => (
              <motion.div
                key={o.id}
                className="relative"
                whileHover={
                  phase === "selecting" ? { scale: 1.02 } : undefined
                }
                whileTap={phase === "selecting" ? { scale: 0.98 } : undefined}
              >
                <PixelButton
                  onClick={() => onPick(o.id)}
                  disabled={phase !== "selecting"}
                  className={[
                    "w-full bg-[#070a0f]/60 border-[#00ffaa]/15",
                    selectedOptionId === o.id && phase === "resolving"
                      ? "border-[#00ffaa]/65"
                      : "",
                  ].join(" ")}
                  variant="primary"
                >
                  {o.label}
                </PixelButton>
              </motion.div>
            ))}
          </section>
        ) : null}

        {/* Continue */}
        {!showResult ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
            <div className="text-xs text-[#7f8aa3]">
              {phase === "selecting"
                ? "选择 1 个选项后，系统将结算指标并生成 IMC 反馈。"
                : "结算完成。点击继续进入下一事件。"}
            </div>
            <div className="flex gap-3">
              <PixelButton
                disabled={phase !== "after"}
                onClick={onContinue}
                className="bg-[#070a0f]/60 border-[#00ffaa]/15"
              >
                继续
              </PixelButton>
            </div>
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>
    </div>
  );
}

