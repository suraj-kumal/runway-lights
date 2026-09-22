"use client";

import { useState } from "react";
import RunwayCanvas from "./RunwayCanvas";
import LightToolbox from "./LightToolbox";
import LightInfoPanel from "./LightInfoPanel";
import { GROUP_LABELS, LIGHT_COLORS, LIGHT_POSITIONS } from "./runwayLayout";

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
type Carry = { type: LightType; x: number; y: number } | null;

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

  // Pointer-based drag state (mouse, touch, and pen all go through this)
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [carry, setCarry] = useState<Carry>(null);

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
    if (selectedId === positionId) setSelectedId(null);
  }

  function handleClear() {
    setPlacedLights({});
    setSelectedId(null);
    setFeedback(null);
  }

  /** Finds the runway light spot under a given screen point, if any. */
  function resolvePositionId(x: number, y: number): string | null {
    const el = document.elementFromPoint(x, y);
    const target = el?.closest("[data-position-id]");
    return target?.getAttribute("data-position-id") ?? null;
  }

  function handleCarryStart(type: LightType, x: number, y: number) {
    setCarry({ type, x, y });
    setHoverId(resolvePositionId(x, y));
  }

  function handleCarryMove(x: number, y: number) {
    setCarry((c) => (c ? { ...c, x, y } : c));
    setHoverId(resolvePositionId(x, y));
  }

  function handleCarryEnd(x: number, y: number) {
    const type = carry?.type;
    const positionId = resolvePositionId(x, y);

    if (type && positionId) {
      handleLightDrop(positionId, type);
    }

    setCarry(null);
    setHoverId(null);
  }

  function handleCarryCancel() {
    setCarry(null);
    setHoverId(null);
  }

  const placedCount = Object.keys(placedLights).length;
  const complete = placedCount === LIGHT_POSITIONS.length;
  const selectedPosition =
    LIGHT_POSITIONS.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="relative flex h-full min-h-175 flex-col gap-4 overflow-hidden bg-black p-4 text-white touch-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Runway Lights</h1>

          <p className="text-sm text-white/60">
            Drag each light from the toolbox to its correct position. Click a
            placed light to read about it.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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

          <span className="text-sm text-white/60">
            {placedCount} / {LIGHT_POSITIONS.length}
          </span>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={showHints}
              onChange={(e) => setShowHints(e.target.checked)}
              className="peer sr-only"
            />

            <span
              className="
                flex h-4 w-4 shrink-0 items-center justify-center
                rounded border border-white/40
                bg-white
                transition
                peer-focus-visible:ring-2 peer-focus-visible:ring-white/50
              "
            >
              {showHints && (
                <svg
                  viewBox="0 0 12 12"
                  className="h-3 w-3 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 6l2.5 2.5L10 3" />
                </svg>
              )}
            </span>

            <span>Show hints</span>
          </label>


          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white transition hover:bg-white/10"
          >
            Restart
          </button>
        </div>
      </div>

      {complete && (
        <div className="rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-2 text-sm text-green-400">
          All lights placed correctly. Training complete!
        </div>
      )}

      {/* Main content: stacks on mobile, side-by-side from md up */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden md:flex-row">
        <RunwayCanvas
          positions={LIGHT_POSITIONS}
          placedLights={placedLights}
          selectedId={selectedId}
          wrongId={wrongId}
          hoverId={hoverId}
          showHints={showHints}
          onLightRemove={handleLightRemove}
          onLightSelect={setSelectedId}
        />

        <div className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto md:w-72">
          <LightToolbox
            remaining={remaining}
            totals={TOTALS}
            onCarryStart={handleCarryStart}
            onCarryMove={handleCarryMove}
            onCarryEnd={handleCarryEnd}
            onCarryCancel={handleCarryCancel}
          />
          <LightInfoPanel
            position={selectedPosition}
            onRemove={
              selectedPosition
                ? () => handleLightRemove(selectedPosition.id)
                : undefined
            }
          />
        </div>
      </div>

      {/* Floating light that follows the pointer/finger while carrying */}
      {carry && (
        <div
          style={{
            position: "fixed",
            left: carry.x,
            top: carry.y,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/40 bg-black/60 shadow-lg"
        >
          <span
            className="h-6 w-6 rounded-full"
            style={{ backgroundColor: LIGHT_COLORS[carry.type] }}
          />
        </div>
      )}
    </div>
  );
}
