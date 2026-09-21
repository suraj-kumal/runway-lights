
"use client";

import { useState } from "react";
import type { LightPosition, LightType } from "./RunwayEditor";
import {
  ASPHALT,
  FILLET_LEFT,
  FILLET_RIGHT,
  GROUP_LABELS,
  LIGHT_COLORS,
  MOUTH_GAP,
  RUNWAY,
  TAXI_CENTER_PATH,
  TAXI_PATH,
  TAXI_WIDTH,
  TURN_EDGE_MARK_PATH,
  TURN_GUIDE_PATH,
  TURN_PAD_PATH,
} from "./runwayLayout";

type Props = {
  positions: LightPosition[];
  placedLights: Record<string, LightType>;
  selectedId: string | null;
  wrongId: string | null;
  showHints: boolean;
  onLightDrop: (positionId: string, lightType: LightType) => boolean;
  onLightRemove: (positionId: string) => void;
  onLightSelect: (positionId: string) => void;
};

export default function RunwayCanvas({
  positions,
  placedLights,
  selectedId,
  wrongId,
  showHints,
  onLightDrop,
  onLightRemove,
  onLightSelect,
}: Props) {
  const [zoom, setZoom] = useState(1);
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Zoom range: 100% → 300%
  const zoomIn = () => {
    setZoom((value) => Math.min(+(value + 0.2).toFixed(1), 3));
  };

  const zoomOut = () => {
    setZoom((value) => Math.max(+(value - 0.2).toFixed(1), 1));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const runwayRight = RUNWAY.x + RUNWAY.width;

  return (
    <div className="relative flex h-full min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-white/15 bg-black">
      {/* ============================================================
          Zoom controls
      ============================================================ */}
      <div className="absolute right-4 top-4 z-20 flex overflow-hidden rounded-lg border border-white/15 bg-black/90 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= 1}
          aria-label="Zoom out"
          className="px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          −
        </button>

        <button
          type="button"
          onClick={resetZoom}
          aria-label="Reset zoom"
          className="min-w-[58px] border-x border-white/15 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= 3}
          aria-label="Zoom in"
          className="px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          +
        </button>
      </div>

      {/* ============================================================
          RUNWAY VIEWPORT
      ============================================================ */}
      <div
        className="h-[85dvh] w-[85dvw] flex-1 overflow-auto overscroll-contain bg-black"
        style={{
          scrollbarGutter: "stable",
        }}
      >
        <svg
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: `${zoom * 100}%`,
            minWidth: "100%",
            height: "auto",
            display: "block",
          }}
        >
          {/* =========================================================
              1. Ground
          ========================================================= */}
          <rect
            width="1200"
            height="600"
            fill="#050505"
          />

          {/* =========================================================
              2. Pavement under runway
          ========================================================= */}
          <path
            d={TAXI_PATH}
            fill="none"
            stroke={ASPHALT}
            strokeWidth={TAXI_WIDTH}
            strokeLinecap="butt"
            strokeLinejoin="round"
          />

          <path
            d={TURN_PAD_PATH}
            fill={ASPHALT}
          />

          {/* =========================================================
              3. Runway
          ========================================================= */}
          <rect
            x={RUNWAY.x}
            y={RUNWAY.y}
            width={RUNWAY.width}
            height={RUNWAY.height}
            rx="6"
            fill={ASPHALT}
          />

          {/* =========================================================
              4. Runway edge lines
          ========================================================= */}
          <line
            x1="95"
            y1="95"
            x2={runwayRight - 15}
            y2="95"
            stroke="#FFFFFF"
            strokeWidth="4"
          />

          <line
            x1="95"
            y1="245"
            x2={runwayRight - 15}
            y2="245"
            stroke="#FFFFFF"
            strokeWidth="4"
          />

          {/* =========================================================
              5. Taxiway junction patches
          ========================================================= */}
          <rect
            x={MOUTH_GAP.x}
            y={MOUTH_GAP.y}
            width={MOUTH_GAP.width}
            height={MOUTH_GAP.height}
            fill={ASPHALT}
          />

          <path
            d={FILLET_LEFT}
            fill={ASPHALT}
          />

          <path
            d={FILLET_RIGHT}
            fill={ASPHALT}
          />

          {/* =========================================================
              6. Runway center line
          ========================================================= */}
          <line
            x1="110"
            y1="170"
            x2="950"
            y2="170"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeDasharray="25 20"
            opacity="0.9"
          />

          {/* =========================================================
              Taxiway center line
              White instead of yellow to match UI theme
          ========================================================= */}
          <path
            d={TAXI_CENTER_PATH}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="15 12"
            opacity="0.7"
          />

          {/* =========================================================
              Turn pad markings
          ========================================================= */}
          <path
            d={TURN_EDGE_MARK_PATH}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            opacity={0.55}
          />

          <path
            d={TURN_GUIDE_PATH}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
            opacity={0.8}
          />

          {/* =========================================================
              7. Light positions
          ========================================================= */}
          {positions.map((position) => {
            const placed = placedLights[position.id];
            const hovering = hoverId === position.id;
            const selected = selectedId === position.id;
            const wrong = wrongId === position.id;

            return (
              <g key={position.id}>
                {/* Tooltip */}
                {(placed || showHints) && (
                  <title>
                    {`${GROUP_LABELS[position.group]} (${position.type})`}
                  </title>
                )}

                {/* Glow for placed lights */}
                {placed && (
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={13}
                    fill={LIGHT_COLORS[placed]}
                    opacity={0.25}
                    pointerEvents="none"
                  />
                )}

                {/* Selection ring */}
                {placed && selected && (
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={14}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    pointerEvents="none"
                  />
                )}

                {/* Wrong-drop flash */}
                {wrong && (
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={14}
                    fill="#EF4444"
                    opacity={0.55}
                    pointerEvents="none"
                  />
                )}

                {/* Visible light */}
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={placed ? 7 : 5}
                  fill={placed ? LIGHT_COLORS[placed] : "#666666"}
                  stroke={placed ? "#FFFFFF" : "#999999"}
                  strokeWidth="1.5"
                  pointerEvents="none"
                />

                {/* Hint ring */}
                {!placed && showHints && (
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={10}
                    fill="none"
                    stroke={LIGHT_COLORS[position.type]}
                    strokeOpacity={0.6}
                    strokeDasharray="3 3"
                    pointerEvents="none"
                  />
                )}

                {/* Larger invisible drop target */}
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={10}
                  fill="transparent"
                  stroke={
                    hovering
                      ? "#FFFFFF"
                      : wrong
                        ? "#EF4444"
                        : "none"
                  }
                  strokeWidth="2"
                  className="cursor-pointer"
                  onDragOver={(event) => {
                    event.preventDefault();
                    setHoverId(position.id);
                  }}
                  onDragLeave={() => {
                    setHoverId(null);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    setHoverId(null);

                    const type = event.dataTransfer.getData(
                      "light-type"
                    ) as LightType;

                    if (!type) return;

                    onLightDrop(position.id, type);
                  }}
                  onClick={() => {
                    if (placed) {
                      onLightSelect(position.id);
                    }
                  }}
                  onDoubleClick={() => {
                    if (placed) {
                      onLightRemove(position.id);
                    }
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
