import { METRIC_BOUNDS } from "./constants";
import type { BrandTypeId } from "../types/brand";
import type { GameEventLog, GameMetrics, GameState } from "../types/game";
import type { EventDefinition } from "../types/event";
import { getBrandById, getBrandEvents } from "./dataLoader";
import {
  computeOutcome,
  computeScores,
  computeFinalScore,
  buildTeachingReview,
  buildCapabilityDiagnosis,
} from "./scoring";

function clampMetric(value: number) {
  return Math.max(METRIC_BOUNDS.min, Math.min(METRIC_BOUNDS.max, value));
}

function applyDelta(metrics: GameMetrics, delta: Partial<GameMetrics>): GameMetrics {
  return {
    awareness: clampMetric(metrics.awareness + (delta.awareness ?? 0)),
    trust: clampMetric(metrics.trust + (delta.trust ?? 0)),
    sentiment: clampMetric(metrics.sentiment + (delta.sentiment ?? 0)),
    sales: clampMetric(metrics.sales + (delta.sales ?? 0)),
    budget: clampMetric(metrics.budget + (delta.budget ?? 0)),

    // IMC 可见代理指标（跨渠道一致性/利益相关者关系）
    consistency: clampMetric(
      metrics.consistency + (delta.consistency ?? 0)
    ),
    stakeholderRelations: clampMetric(
      metrics.stakeholderRelations + (delta.stakeholderRelations ?? 0)
    ),

    teamwork: clampMetric(metrics.teamwork + (delta.teamwork ?? 0)),
    longTermAsset: clampMetric(metrics.longTermAsset + (delta.longTermAsset ?? 0)),
  };
}

export function initializeGame(
  brandId: BrandTypeId,
  totalTurns?: number
): GameState {
  const brand = getBrandById(brandId);
  const events = getBrandEvents(brandId);
  const resolvedTotalTurns = Math.max(1, totalTurns ?? events.length);

  const metrics: GameMetrics = {
    awareness: brand.startingAwareness,
    trust: brand.startingTrust,
    sentiment: brand.startingSentiment,
    sales: brand.startingSales,
    budget: brand.startingBudget,

    // Required by new typing model
    consistency: brand.startingTeamwork,
    stakeholderRelations: brand.startingTrust,

    teamwork: brand.startingTeamwork,
    longTermAsset: brand.startingLongTermAsset,
  };

  return {
    version: 1,
    brandId,
    turnIndex: 0,
    totalTurns: Math.min(resolvedTotalTurns, events.length),
    metrics,
    eventLog: [],
    selectedDecisionIds: [],
    lastEvents: [],
  };
}

export function resolveTurn(
  state: GameState,
  selectedDecisionIds: string[]
): GameState & { turnEvents: EventDefinition[] } {
  const events = getBrandEvents(state.brandId);
  const currentEvent = events[state.turnIndex];

  if (!currentEvent) {
    throw new Error(
      `No current event found at turnIndex=${state.turnIndex}. Game might be finished.`
    );
  }

  if (selectedDecisionIds.length !== 1) {
    throw new Error(
      `This MVP event requires exactly 1 selected option id. Got=${selectedDecisionIds.length}.`
    );
  }

  const selectedOptionId = selectedDecisionIds[0];

  // Option selection must come from current event's 3 options.
  const selectedOption = currentEvent.options.find(
    (o) => o.id === selectedOptionId
  );
  if (!selectedOption) {
    throw new Error(
      `Option id "${selectedOptionId}" not found in current event "${currentEvent.id}".`
    );
  }

  const nextMetrics = applyDelta(
    state.metrics,
    selectedOption.effect as Partial<GameMetrics>
  );

  const turnEvent: EventDefinition = currentEvent;
  const turnLog: GameEventLog = {
    turn: state.turnIndex,
    eventId: turnEvent.id,
    title: turnEvent.title,
    description: turnEvent.situationDescription,
    teachingTitle: turnEvent.teaching.title,
    teachingBullets: turnEvent.teaching.bullets,
    impact: selectedOption.effect as Partial<GameMetrics>,
    visualKey: turnEvent.visualKey,
    selectedOptionId,
    tone: turnEvent.tone,
  };

  const nextTurnIndex = Math.min(state.turnIndex + 1, state.totalTurns);

  const next: GameState = {
    ...state,
    turnIndex: nextTurnIndex,
    metrics: nextMetrics,
    selectedDecisionIds: [selectedOptionId],
    eventLog: [...state.eventLog, turnLog],
    lastEvents: [turnEvent],
  };

  return { ...next, turnEvents: [turnEvent] };
}

export function finalizeGame(state: GameState) {
  const brand = getBrandById(state.brandId);
  const scores = computeScores(state.metrics);
  const outcome = computeOutcome(state.metrics);
  const finalScore = computeFinalScore(scores);
  const capabilityDiagnosis = buildCapabilityDiagnosis(scores, state.metrics);

  return {
    brandId: state.brandId,
    outcomeType: outcome,
    outcome, // legacy alias
    finalScore,
    finalMetrics: state.metrics,
    scores,
    teachingReview: buildTeachingReview(brand.name, state.metrics, finalScore),
    capabilityDiagnosis,
  };
}

export function getCurrentEvent(state: GameState): EventDefinition | null {
  const events = getBrandEvents(state.brandId);
  return events[state.turnIndex] ?? null;
}

export function isGameOver(state: GameState) {
  return state.turnIndex >= state.totalTurns;
}

