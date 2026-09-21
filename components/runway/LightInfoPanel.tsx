
"use client";

import type { LightPosition } from "./RunwayEditor";
import { LIGHT_INFO } from "./lightInfo";
import { LIGHT_COLORS } from "./runwayLayout";

type Props = {
  position: LightPosition | null;
};

export default function LightInfoPanel({ position }: Props) {
  if (!position) {
    return (
      <aside className="rounded-xl border border-white/15 bg-black p-4">
        <h2 className="mb-1 font-medium text-white">
          About this light
        </h2>

        <p className="text-xs text-white/60">
          Place a light correctly, or click a placed light, to read about it.
        </p>
      </aside>
    );
  }

  const info = LIGHT_INFO[position.group];

  return (
    <aside className="rounded-xl border border-white/15 bg-black p-4">
      <div className="mb-3 flex items-center gap-3">
        <span
          className="h-5 w-5 shrink-0 rounded-full border-2 border-white/30"
          style={{ backgroundColor: LIGHT_COLORS[position.type] }}
        />

        <div>
          <h2 className="text-sm font-semibold text-white">
            {info.title}
          </h2>

          <p className="text-[11px] text-white/50">
            {info.colorName}
          </p>
        </div>
      </div>

      <p className="mb-3 text-sm text-white/80">
        {info.summary}
      </p>

      <ul className="space-y-2 text-xs text-white/60">
        {info.details.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/50" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {info.note && (
        <p className="mt-3 rounded-md border border-white/15 bg-white/5 p-2 text-[11px] text-white/70">
          {info.note}
        </p>
      )}
    </aside>
  );
}
