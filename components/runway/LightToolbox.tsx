"use client";

import type { LightType } from "./RunwayEditor";

const lights: {
  type: LightType;
  label: string;
  color: string;
  usedFor: string;
}[] = [
  { type: "white", label: "White Light", color: "bg-white", usedFor: "Runway edge and mid lights" },
  { type: "green", label: "Green Light", color: "bg-green-500", usedFor: "Threshold and taxiway centerline" },
  { type: "red", label: "Red Light", color: "bg-red-500", usedFor: "Runway end" },
  { type: "blue", label: "Blue Light", color: "bg-blue-500", usedFor: "Taxiway edge and turnpad" },
];

type Props = {
  remaining: Record<LightType, number>;
  totals: Record<LightType, number>;
  onCarryStart: (type: LightType, x: number, y: number) => void;
  onCarryMove: (x: number, y: number) => void;
  onCarryEnd: (x: number, y: number) => void;
  onCarryCancel: () => void;
};

export default function LightToolbox({
  remaining,
  totals,
  onCarryStart,
  onCarryMove,
  onCarryEnd,
  onCarryCancel,
}: Props) {
  return (
    <aside className="w-full shrink-0 rounded-xl border border-white/15 bg-black p-4">
      <div className="mb-4">
        <h2 className="font-medium text-white">Light Toolbox</h2>
        <p className="mt-1 text-xs leading-relaxed text-white/60">
          Drag (or touch and drag) a light onto its correct position on the runway.
        </p>
      </div>

      <div className="space-y-3">
        {lights.map((light) => {
          const left = remaining[light.type];
          const empty = left <= 0;

          return (
            <div
              key={light.type}
              className={`flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-3 transition ${
                empty ? "opacity-40" : "hover:border-white/30 hover:bg-white/10"
              }`}
            >
              <div
                onPointerDown={(event) => {
                  if (empty) return;
                  event.preventDefault();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  onCarryStart(light.type, event.clientX, event.clientY);
                }}
                onPointerMove={(event) => {
                  if (empty) return;
                  onCarryMove(event.clientX, event.clientY);
                }}
                onPointerUp={(event) => {
                  if (empty) return;
                  onCarryEnd(event.clientX, event.clientY);
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                onPointerCancel={() => {
                  onCarryCancel();
                }}
                title={empty ? "No lights remaining" : "Drag this light"}
                aria-label={`Drag ${light.label}`}
                style={{ touchAction: "none" }}
                className={`group relative flex h-14 w-14 shrink-0 select-none items-center justify-center rounded-full border-2 border-white/20 bg-white/10 ${
                  empty ? "cursor-not-allowed" : "cursor-grab hover:border-white/50 active:cursor-grabbing"
                }`}
              >
                <span
                  className={`h-9 w-9 rounded-full border-2 border-black/30 ${light.color} ${
                    !empty ? "shadow-[0_0_14px_rgba(255,255,255,0.18)] transition-transform group-hover:scale-110" : ""
                  }`}
                />

                {!empty && (
                  <span className="pointer-events-none absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-black text-[10px] text-white/70">
                    ↕
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium text-white">{light.label}</div>
                  <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/60">
                    {left}/{totals[light.type]}
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] leading-tight text-white/50">{light.usedFor}</div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
