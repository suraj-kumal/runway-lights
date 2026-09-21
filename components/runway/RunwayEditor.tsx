
"use client";

import { useState } from "react";
import RunwayCanvas from "./RunwayCanvas";
import LightToolbox from "./LightToolbox";
import LightInfoPanel from "./LightInfoPanel";
import { GROUP_LABELS, LIGHT_POSITIONS } from "./runwayLayout";

export type LightType = "white" | "green" | "red" | "blue";

export type LightGroup =
  | "edge"
  | "mid"
  | "threshold"
  | "taxi-center"
  | "turn"
  | "taxi-edge";

export type LightPosition = {
  id: string;
  x: number;
  y: number;
  type: LightType;
  group: LightGroup;
};

type Feedback = { kind: "success" | "error"; message: string };

const ZERO_COUNTS: Record<LightType, number> = {
  white: 0,
  green: 0,
  red: 0,
  blue: 0,
};

const TOTALS: Record<LightType, number> = LIGHT_POSITIONS.reduce(
  (acc, p) => {
    acc[p.type] += 1;
    return acc;
  },
  { ...ZERO_COUNTS }
);

export default function RunwayEditor() {
  const [placedLights, setPlacedLights] = useState<Record<string, LightType>>(
    {}
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(true);

  // Lights left in the toolbox = total needed - already placed
  const remaining: Record<LightType, number> = { ...TOTALS };

  for (const type of Object.values(placedLights)) {
    remaining[type] -= 1;
  }

  function handleLightDrop(positionId: string, lightType: LightType) {
    const position = LIGHT_POSITIONS.find((item) => item.id === positionId);

    if (!position) return false;

    if (placedLights[positionId]) {
      setFeedback({
        kind: "error",
        message: "This position already has a light.",
      });
      return false;
    }

    if (position.type !== lightType) {
      // Wrong spot: nothing is placed, the light stays in the toolbox
      setFeedback({
        kind: "error",
        message: `Wrong position for a ${lightType} light. It stays in the toolbox, try again.`,
      });

      setWrongId(positionId);
      window.setTimeout(() => setWrongId(null), 700);

      return false;
    }

    setPlacedLights((current) => ({
      ...current,
      [positionId]: lightType,
    }));

    setSelectedId(positionId);

    setFeedback({
      kind: "success",
      message: `Correct! ${GROUP_LABELS[position.group]} placed.`,
    });

    return true;
  }

  function handleLightRemove(positionId: string) {
    setPlacedLights((current) => {
      const next = { ...current };
      delete next[positionId];
      return next;
    });

    if (selectedId === positionId) {
      setSelectedId(null);
    }
  }

  function handleClear() {
    setPlacedLights({});
    setSelectedId(null);
    setFeedback(null);
  }

  const placedCount = Object.keys(placedLights).length;
  const complete = placedCount === LIGHT_POSITIONS.length;

  const selectedPosition =
    LIGHT_POSITIONS.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="flex h-full min-h-175 flex-col gap-4 bg-black p-4 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Runway Lights
          </h1>

          <p className="text-sm text-white/60">
            Drag each light from the toolbox to its correct position. Click a
            placed light to read about it. Double-click to remove it.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Success / Error feedback */}
          {feedback && (
            <span
              className={`rounded-md border px-3 py-1 text-xs ${
                feedback.kind === "success"
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : "border-red-500/40 bg-red-500/10 text-red-400"
              }`}
            >
              {feedback.message}
            </span>
          )}

          {/* Counter */}
          <span className="text-sm text-white/60">
            {placedCount} / {LIGHT_POSITIONS.length}
          </span>

          {/* Hints */}
          <label className="flex cursor-pointer items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={showHints}
              onChange={(e) => setShowHints(e.target.checked)}
              className="accent-white"
            />
            Show hints
          </label>

          {/* Restart */}
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white transition hover:bg-white/10"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Completion message */}
      {complete && (
        <div className="rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-2 text-sm text-green-400">
          All lights placed correctly. Training complete!
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        <RunwayCanvas
          positions={LIGHT_POSITIONS}
          placedLights={placedLights}
          selectedId={selectedId}
          wrongId={wrongId}
          showHints={showHints}
          onLightDrop={handleLightDrop}
          onLightRemove={handleLightRemove}
          onLightSelect={setSelectedId}
        />

        <div className="flex w-72 shrink-0 flex-col gap-4 overflow-y-auto">
          <LightToolbox remaining={remaining} totals={TOTALS} />
          <LightInfoPanel position={selectedPosition} />
        </div>
      </div>
    </div>
  );
}
