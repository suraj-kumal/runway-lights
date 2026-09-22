// "use client";

// import { useState } from "react";
// import type { LightPosition, LightType } from "./RunwayEditor";
// import {
//   ASPHALT,
//   FILLET_LEFT,
//   FILLET_RIGHT,
//   GROUP_LABELS,
//   LIGHT_COLORS,
//   MOUTH_GAP,
//   RUNWAY,
//   TAXI_CENTER_PATH,
//   TAXI_PATH,
//   TAXI_WIDTH,
//   TURN_EDGE_MARK_PATH,
//   TURN_GUIDE_PATH,
//   TURN_PAD_PATH,
// } from "./runwayLayout";

// type Props = {
//   positions: LightPosition[];
//   placedLights: Record<string, LightType>;
//   selectedId: string | null;
//   wrongId: string | null;
//   hoverId: string | null;
//   showHints: boolean;
//   onLightRemove: (positionId: string) => void;
//   onLightSelect: (positionId: string) => void;
// };

// export default function RunwayCanvas({
//   positions,
//   placedLights,
//   selectedId,
//   wrongId,
//   hoverId,
//   showHints,
//   onLightRemove,
//   onLightSelect,
// }: Props) {
//   const [zoom, setZoom] = useState(1);

//   const zoomIn = () => {
//     setZoom((value) => Math.min(+(value + 0.2).toFixed(1), 7));
//   };

//   const zoomOut = () => {
//     setZoom((value) => Math.max(+(value - 0.2).toFixed(1), 1));
//   };

//   const resetZoom = () => {
//     setZoom(1);
//   };

//   const runwayRight = RUNWAY.x + RUNWAY.width;

//   return (
//     <div className="relative flex h-full min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-white/15 bg-black touch-auto">
//       {/* Zoom controls */}
//       <div className="absolute right-4 top-4 z-20 flex overflow-hidden rounded-lg border border-white/15 bg-black/90 shadow-lg backdrop-blur">
//         <button
//           type="button"
//           onClick={zoomOut}
//           disabled={zoom <= 1}
//           aria-label="Zoom out"
//           className="px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
//         >
//           −
//         </button>

//         <button
//           type="button"
//           onClick={resetZoom}
//           aria-label="Reset zoom"
//           className="min-w-[58px] border-x border-white/15 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10"
//         >
//           {Math.round(zoom * 100)}%
//         </button>

//         <button
//           type="button"
//           onClick={zoomIn}
//           disabled={zoom >= 7}
//           aria-label="Zoom in"
//           className="px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
//         >
//           +
//         </button>
//       </div>

//       {/* Runway viewport */}
//       <div
//         className="h-full max-h-[40vh] sm:max-h-[80vh] w-full flex-1 overflow-auto overscroll-contain bg-black"
//         style={{ scrollbarGutter: "stable" }}
//       >
//         <svg
//           viewBox="0 0 1200 600"
//           preserveAspectRatio="xMidYMid meet"
//           style={{
//             width: `${zoom * 100}%`,
//             minWidth: "100%",
//             height: "auto",
//             display: "block",
//           }}
//         >
//           {/* 1. Ground */}
//           <rect width="1200" height="600" fill="#050505" />

//           {/* 2. Pavement under runway */}
//           <path
//             d={TAXI_PATH}
//             fill="none"
//             stroke={ASPHALT}
//             strokeWidth={TAXI_WIDTH}
//             strokeLinecap="butt"
//             strokeLinejoin="round"
//           />
//           <path d={TURN_PAD_PATH} fill={ASPHALT} />

//           {/* 3. Runway */}
//           <rect
//             x={RUNWAY.x}
//             y={RUNWAY.y}
//             width={RUNWAY.width}
//             height={RUNWAY.height}
//             rx="6"
//             fill={ASPHALT}
//           />

//           {/* 4. Runway edge lines */}
//           <line x1="95" y1="95" x2={runwayRight - 15} y2="95" stroke="#FFFFFF" strokeWidth="4" />
//           <line x1="95" y1="245" x2={runwayRight - 15} y2="245" stroke="#FFFFFF" strokeWidth="4" />

//           {/* 5. Taxiway junction patches */}
//           <rect
//             x={MOUTH_GAP.x}
//             y={MOUTH_GAP.y}
//             width={MOUTH_GAP.width}
//             height={MOUTH_GAP.height}
//             fill={ASPHALT}
//           />
//           <path d={FILLET_LEFT} fill={ASPHALT} />
//           <path d={FILLET_RIGHT} fill={ASPHALT} />

//           {/* 6. Runway center line */}
//           <line
//             x1="110"
//             y1="170"
//             x2="950"
//             y2="170"
//             stroke="#FFFFFF"
//             strokeWidth="4"
//             strokeDasharray="25 20"
//             opacity="0.9"
//           />

//           {/* Taxiway center line */}
//           <path
//             d={TAXI_CENTER_PATH}
//             fill="none"
//             stroke="#FFFFFF"
//             strokeWidth="3"
//             strokeDasharray="15 12"
//             opacity="0.7"
//           />

//           {/* Turn pad markings */}
//           <path d={TURN_EDGE_MARK_PATH} fill="none" stroke="#facc15" strokeWidth="1.5" opacity={0.8} />
//           <path d={TURN_GUIDE_PATH} fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinejoin="round" />

//           {/* 7. Light positions */}
//           {positions.map((position) => {
//             const placed = placedLights[position.id];
//             const hovering = hoverId === position.id;
//             const selected = selectedId === position.id;
//             const wrong = wrongId === position.id;

//             return (
//               <g key={position.id}>
//                 {(placed || showHints) && (
//                   <title>{`${GROUP_LABELS[position.group]} (${position.type})`}</title>
//                 )}

//                 {placed && (
//                   <circle
//                     cx={position.x}
//                     cy={position.y}
//                     r={13}
//                     fill={LIGHT_COLORS[placed]}
//                     opacity={0.25}
//                     pointerEvents="none"
//                   />
//                 )}

//                 {placed && selected && (
//                   <circle
//                     cx={position.x}
//                     cy={position.y}
//                     r={14}
//                     fill="none"
//                     stroke="#FFFFFF"
//                     strokeWidth="2"
//                     pointerEvents="none"
//                   />
//                 )}

//                 {wrong && (
//                   <circle
//                     cx={position.x}
//                     cy={position.y}
//                     r={14}
//                     fill="#EF4444"
//                     opacity={0.55}
//                     pointerEvents="none"
//                   />
//                 )}

//                 <circle
//                   cx={position.x}
//                   cy={position.y}
//                   r={placed ? 7 : 5}
//                   fill={placed ? LIGHT_COLORS[placed] : "#666666"}
//                   stroke={placed ? "#FFFFFF" : "#999999"}
//                   strokeWidth="1.5"
//                   pointerEvents="none"
//                 />

//                 {!placed && showHints && (
//                   <circle
//                     cx={position.x}
//                     cy={position.y}
//                     r={10}
//                     fill="none"
//                     stroke={LIGHT_COLORS[position.type]}
//                     strokeOpacity={0.6}
//                     strokeDasharray="3 3"
//                     pointerEvents="none"
//                   />
//                 )}

//                 {/* Drop target: hit-tested via elementFromPoint, so it needs
//                     an id to read and pointerEvents="all" so a transparent
//                     fill still registers as a hit. */}
//                 <circle
//                   data-position-id={position.id}
//                   cx={position.x}
//                   cy={position.y}
//                   r={10}
//                   fill="transparent"
//                   pointerEvents="all"
//                   stroke={hovering ? "#FFFFFF" : wrong ? "#EF4444" : "none"}
//                   strokeWidth="2"
//                   className="cursor-pointer"
//                   onClick={() => {
//                     if (placed) onLightSelect(position.id);
//                   }}
//                   onDoubleClick={() => {
//                     if (placed) onLightRemove(position.id);
//                   }}
//                 />
//               </g>
//             );
//           })}
//         </svg>
//       </div>
//     </div>
//   );
// }
"use client";

import { useRef, useState } from "react";
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
  hoverId: string | null;
  showHints: boolean;
  onLightRemove: (positionId: string) => void;
  onLightSelect: (positionId: string) => void;
};

type Point = {
  x: number;
  y: number;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 7;

export default function RunwayCanvas({
  positions,
  placedLights,
  selectedId,
  wrongId,
  hoverId,
  showHints,
  onLightRemove,
  onLightSelect,
}: Props) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({
    x: 0,
    y: 0,
  });

  const viewportRef = useRef<HTMLDivElement>(null);

  /**
   * Active pointer positions.
   *
   * 1 pointer = pan
   * 2 pointers = pinch zoom + pan
   */
  const pointers = useRef<Map<number, Point>>(
    new Map()
  );

  /**
   * State captured when pinch starts.
   */
  const pinchStart = useRef<{
    distance: number;
    zoom: number;
    center: Point;
    pan: Point;
  } | null>(null);

  /**
   * State captured when one-finger pan starts.
   */
  const panStart = useRef<{
    pointerId: number;
    point: Point;
    pan: Point;
  } | null>(null);

  const clampZoom = (value: number) => {
    return Math.min(
      Math.max(value, MIN_ZOOM),
      MAX_ZOOM
    );
  };

  const getDistance = (
    a: Point,
    b: Point
  ): number => {
    return Math.hypot(
      b.x - a.x,
      b.y - a.y
    );
  };

  const getCenter = (
    a: Point,
    b: Point
  ): Point => {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    };
  };

  /**
   * Calculate the maximum amount of panning allowed.
   *
   * This prevents the SVG from being moved completely
   * outside the viewport, which was causing the black screen.
   */
  const clampPan = (
    x: number,
    y: number,
    nextZoom: number
  ): Point => {
    const viewport =
      viewportRef.current;

    if (!viewport) {
      return {
        x,
        y,
      };
    }

    const rect =
      viewport.getBoundingClientRect();

    /*
     * The SVG viewBox is 1200 x 600,
     * therefore its aspect ratio is 2:1.
     */
    const baseWidth = rect.width;
    const baseHeight =
      baseWidth / 2;

    const scaledWidth =
      baseWidth * nextZoom;

    const scaledHeight =
      baseHeight * nextZoom;

    /*
     * Because the SVG is centered, we allow
     * half of the extra scaled size in each direction.
     */
    const maxX = Math.max(
      0,
      (scaledWidth - rect.width) / 2
    );

    const maxY = Math.max(
      0,
      (scaledHeight - rect.height) / 2
    );

    return {
      x: Math.max(
        -maxX,
        Math.min(maxX, x)
      ),
      y: Math.max(
        -maxY,
        Math.min(maxY, y)
      ),
    };
  };

  /**
   * Zoom using the + button.
   */
  const zoomIn = () => {
    setZoom((currentZoom) => {
      const nextZoom = clampZoom(
        +(currentZoom + 0.2).toFixed(1)
      );

      setPan((currentPan) =>
        clampPan(
          currentPan.x,
          currentPan.y,
          nextZoom
        )
      );

      return nextZoom;
    });
  };

  /**
   * Zoom using the - button.
   */
  const zoomOut = () => {
    setZoom((currentZoom) => {
      const nextZoom = clampZoom(
        +(currentZoom - 0.2).toFixed(1)
      );

      setPan((currentPan) =>
        clampPan(
          currentPan.x,
          currentPan.y,
          nextZoom
        )
      );

      return nextZoom;
    });
  };

  /**
   * Reset zoom and pan.
   */
  const resetZoom = () => {
    setZoom(1);
    setPan({
      x: 0,
      y: 0,
    });
  };

  /**
   * Pointer down.
   */
  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    /*
     * Don't let buttons participate in the
     * canvas gesture system.
     */
    const target =
      event.target as HTMLElement;

    if (target.closest("button")) {
      return;
    }

    event.preventDefault();

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    const point = {
      x: event.clientX,
      y: event.clientY,
    };

    pointers.current.set(
      event.pointerId,
      point
    );

    const activePointers =
      Array.from(
        pointers.current.values()
      );

    /*
     * TWO POINTERS
     *
     * Start pinch gesture.
     */
    if (activePointers.length === 2) {
      const [a, b] =
        activePointers;

      pinchStart.current = {
        distance: getDistance(a, b),
        zoom,
        center: getCenter(a, b),
        pan: {
          ...pan,
        },
      };

      panStart.current = null;

      return;
    }

    /*
     * ONE POINTER
     *
     * Start normal pan.
     */
    if (activePointers.length === 1) {
      panStart.current = {
        pointerId:
          event.pointerId,
        point,
        pan: {
          ...pan,
        },
      };
    }
  };

  /**
   * Pointer movement.
   */
  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const previous =
      pointers.current.get(
        event.pointerId
      );

    if (!previous) {
      return;
    }

    const current = {
      x: event.clientX,
      y: event.clientY,
    };

    pointers.current.set(
      event.pointerId,
      current
    );

    const activePointers =
      Array.from(
        pointers.current.values()
      );

    /*
     * TWO FINGERS
     *
     * Pinch zoom + pan.
     */
    if (
      activePointers.length === 2 &&
      pinchStart.current
    ) {
      const [a, b] =
        activePointers;

      const currentDistance =
        getDistance(a, b);

      const currentCenter =
        getCenter(a, b);

      const start =
        pinchStart.current;

      if (start.distance <= 0) {
        return;
      }

      /*
       * Calculate pinch scale.
       */
      const scale =
        currentDistance /
        start.distance;

      const nextZoom =
        clampZoom(
          start.zoom * scale
        );

      /*
       * Move according to the movement
       * of the two-finger center.
       */
      const nextPan = clampPan(
        start.pan.x +
          (currentCenter.x -
            start.center.x),

        start.pan.y +
          (currentCenter.y -
            start.center.y),

        nextZoom
      );

      setZoom(nextZoom);
      setPan(nextPan);

      return;
    }

    /*
     * ONE FINGER
     *
     * Normal pan.
     */
    if (
      activePointers.length === 1 &&
      panStart.current &&
      panStart.current.pointerId ===
        event.pointerId
    ) {
      const start =
        panStart.current;

      const nextPan = clampPan(
        start.pan.x +
          (current.x -
            start.point.x),

        start.pan.y +
          (current.y -
            start.point.y),

        zoom
      );

      setPan(nextPan);
    }
  };

  /**
   * Pointer released.
   */
  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    pointers.current.delete(
      event.pointerId
    );

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    const remaining =
      Array.from(
        pointers.current.entries()
      );

    /*
     * No pointers remaining.
     */
    if (remaining.length === 0) {
      pinchStart.current = null;
      panStart.current = null;

      return;
    }

    /*
     * One finger remains after
     * a pinch gesture.
     *
     * Start a new pan from its
     * current position.
     */
    if (remaining.length === 1) {
      const [
        pointerId,
        point,
      ] = remaining[0];

      panStart.current = {
        pointerId,
        point: {
          ...point,
        },
        pan: {
          ...pan,
        },
      };

      pinchStart.current = null;
    }
  };

  /**
   * Pointer cancelled.
   */
  const handlePointerCancel = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    pointers.current.delete(
      event.pointerId
    );

    pinchStart.current = null;
    panStart.current = null;
  };

  const runwayRight =
    RUNWAY.x + RUNWAY.width;

  return (
    <div className="relative h-full min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-white/15 bg-black">
      {/* ====================================================== */}
      {/* Zoom controls                                           */}
      {/* ====================================================== */}

      <div className="absolute right-4 top-4 z-30 flex overflow-hidden rounded-lg border border-white/15 bg-black/90 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
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
          {Math.round(
            zoom * 100
          )}
          %
        </button>

        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
          className="px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          +
        </button>
      </div>

      {/* ====================================================== */}
      {/* Canvas viewport                                         */}
      {/* ====================================================== */}

      <div
        ref={viewportRef}
        className="h-full max-h-[50vh] w-full flex-1 touch-none overflow-hidden bg-black sm:max-h-[80vh]"
        onPointerDown={
          handlePointerDown
        }
        onPointerMove={
          handlePointerMove
        }
        onPointerUp={
          handlePointerUp
        }
        onPointerCancel={
          handlePointerCancel
        }
      >
        {/* ================================================== */}
        {/* SVG                                                   */}
        {/* ================================================== */}

        <svg
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: "100%",
            height: "auto",
            display: "block",

            /*
             * Zoom and pan happen here.
             *
             * Keeping the SVG itself at 100% prevents
             * the layout dimensions from exploding during
             * fast pinch gestures.
             */
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,

            /*
             * Centered transform makes zoom feel natural.
             */
            transformOrigin:
              "center center",
          }}
        >
          {/* ================================================== */}
          {/* Ground                                               */}
          {/* ================================================== */}

          <rect
            width="1200"
            height="600"
            fill="#050505"
          />

          {/* ================================================== */}
          {/* Pavement                                             */}
          {/* ================================================== */}

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

          {/* ================================================== */}
          {/* Runway                                               */}
          {/* ================================================== */}

          <rect
            x={RUNWAY.x}
            y={RUNWAY.y}
            width={RUNWAY.width}
            height={RUNWAY.height}
            rx="6"
            fill={ASPHALT}
          />

          {/* ================================================== */}
          {/* Runway edge lines                                    */}
          {/* ================================================== */}

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

          {/* ================================================== */}
          {/* Taxiway junction patches                             */}
          {/* ================================================== */}

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

          {/* ================================================== */}
          {/* Runway center line                                   */}
          {/* ================================================== */}

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

          {/* ================================================== */}
          {/* Taxiway center line                                  */}
          {/* ================================================== */}

          <path
            d={TAXI_CENTER_PATH}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="15 12"
            opacity="0.7"
          />

          {/* ================================================== */}
          {/* Turn pad markings                                    */}
          {/* ================================================== */}

          <path
            d={TURN_EDGE_MARK_PATH}
            fill="none"
            stroke="#facc15"
            strokeWidth="1.5"
            opacity={0.8}
          />

          <path
            d={TURN_GUIDE_PATH}
            fill="none"
            stroke="#facc15"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* ================================================== */}
          {/* Lights                                               */}
          {/* ================================================== */}

          {positions.map(
            (position) => {
              const placed =
                placedLights[
                  position.id
                ];

              const hovering =
                hoverId ===
                position.id;

              const selected =
                selectedId ===
                position.id;

              const wrong =
                wrongId ===
                position.id;

              return (
                <g
                  key={
                    position.id
                  }
                >
                  {/* Tooltip */}
                  {(placed ||
                    showHints) && (
                    <title>
                      {`${GROUP_LABELS[position.group]} (${position.type})`}
                    </title>
                  )}

                  {/* Glow */}
                  {placed && (
                    <circle
                      cx={
                        position.x
                      }
                      cy={
                        position.y
                      }
                      r={13}
                      fill={
                        LIGHT_COLORS[
                          placed
                        ]
                      }
                      opacity={0.25}
                      pointerEvents="none"
                    />
                  )}

                  {/* Selected */}
                  {placed &&
                    selected && (
                      <circle
                        cx={
                          position.x
                        }
                        cy={
                          position.y
                        }
                        r={14}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        pointerEvents="none"
                      />
                    )}

                  {/* Wrong */}
                  {wrong && (
                    <circle
                      cx={
                        position.x
                      }
                      cy={
                        position.y
                      }
                      r={14}
                      fill="#EF4444"
                      opacity={0.55}
                      pointerEvents="none"
                    />
                  )}

                  {/* Light */}
                  <circle
                    cx={
                      position.x
                    }
                    cy={
                      position.y
                    }
                    r={
                      placed
                        ? 7
                        : 5
                    }
                    fill={
                      placed
                        ? LIGHT_COLORS[
                            placed
                          ]
                        : "#666666"
                    }
                    stroke={
                      placed
                        ? "#FFFFFF"
                        : "#999999"
                    }
                    strokeWidth="1.5"
                    pointerEvents="none"
                  />

                  {/* Hint */}
                  {!placed &&
                    showHints && (
                      <circle
                        cx={
                          position.x
                        }
                        cy={
                          position.y
                        }
                        r={10}
                        fill="none"
                        stroke={
                          LIGHT_COLORS[
                            position
                              .type
                          ]
                        }
                        strokeOpacity={
                          0.6
                        }
                        strokeDasharray="3 3"
                        pointerEvents="none"
                      />
                    )}

                  {/* Drop target */}
                  <circle
                    data-position-id={
                      position.id
                    }
                    cx={
                      position.x
                    }
                    cy={
                      position.y
                    }
                    r={10}
                    fill="transparent"
                    pointerEvents="all"
                    stroke={
                      hovering
                        ? "#FFFFFF"
                        : wrong
                          ? "#EF4444"
                          : "none"
                    }
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => {
                      if (
                        placed
                      ) {
                        onLightSelect(
                          position.id
                        );
                      }
                    }}
                    onDoubleClick={() => {
                      if (
                        placed
                      ) {
                        onLightRemove(
                          position.id
                        );
                      }
                    }}
                  />
                </g>
              );
            }
          )}
        </svg>
      </div>
      <div className="m-2 px-1 text-[10px] leading-4 text-white/50 sm:mt-2 sm:px-0 sm:text-xs sm:leading-5">
        <p className="hidden sm:block">
          Drag with your mouse to move the canvas. Use the + / − buttons to zoom.
        </p>

        <p className="sm:hidden">
          Drag with one finger to move. Pinch with two fingers to zoom.
        </p>
      </div>

    </div>
  );
}
