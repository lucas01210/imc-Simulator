"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { BrandTypeId } from "../../types/brand";
import type { EventDefinition, EventOption } from "../../types/event";
import type { GameState } from "../../types/game";
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
  const [pendingState, setPendingState] = useState<GameState | null>(null);

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

    // Give a short moment to show pixel feedback before applying next state.
    window.setTimeout(() => {
      const next = resolveTurn(gameState, [optionId]);
      setPendingState(next);
      setPhase("after");
    }, 420);
  }

  function onContinue() {
    if (phase === "resolving") return;
    if (showResult) return;
    if (!pendingState) return;

    setGameState(pendingState);
    setPulseId((x) => x + 1);

    if (isGameOver(pendingState)) {
      setResult(finalizeGame(pendingState));
    } else {
      setPhase("selecting");
    }

    setPendingState(null);
    setFeedbackText("");
    setResolvedTurnEventsTitle(null);
    setSelectedOptionId(null);
  }

  const options = currentEvent?.options ?? [];
  const statusLabel =
    phase === "resolving"
      ? "系统结算中..."
      : phase === "after"
        ? "已结算，可进入下一事件"
        : "等待你的选择";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="space-y-6">
        <header className="relative overflow-hidden border border-[#00ffaa]/16 bg-[#06080d]/35 px-4 py-4 shadow-pixel sm:px-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(0,255,170,0.08) 0 2px, transparent 2px 10px)",
            }}
          />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs font-semibold text-[#00ffaa]">
              游戏主界面
              </div>
              <div className="mt-2 text-2xl font-extrabold">{brand.name}</div>
              <div className="mt-1 text-sm leading-relaxed text-[#a8b3c7]">
                {brand.tagline}
              </div>
            </div>
            <div className="space-y-1 text-right text-xs text-[#7f8aa3]">
              <div>回合 {progressText}</div>
              <div className="text-[#00ffaa]">{statusLabel}</div>
            </div>
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
                  {phase === "after"
                    ? "已结算"
                    : phase === "resolving"
                      ? "结算中"
                      : "待选择"}
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
                    "w-full min-h-[70px] bg-[#070a0f]/65 border-[#00ffaa]/15 text-left",
                    selectedOptionId === o.id && phase === "resolving"
                      ? "border-[#00ffaa]/65"
                      : "",
                  ].join(" ")}
                  variant="primary"
                >
                  <span className="flex w-full items-center justify-between gap-3">
                    <span className="leading-snug">{o.label}</span>
                    <span className="text-[11px] text-[#7f8aa3]">选择</span>
                  </span>
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
                  : phase === "resolving"
                    ? "系统正在结算，请稍候..."
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

