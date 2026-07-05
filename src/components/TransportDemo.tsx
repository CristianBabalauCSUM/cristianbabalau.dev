"use client";

import { useMemo, useState } from "react";
import { Blip, CornerBrackets } from "./ui";

/**
 * ---------------------------------------------------------------------------
 * MAASTRICHT TRANSPORT ROUTING — INTERACTIVE DEMO
 *
 * A simplified, browser-side re-creation of the university project: pick two
 * stops, hit route, and a Dijkstra pass over a placeholder bus network finds
 * the fastest connection and animates it on a stylized map of Maastricht.
 *
 * DEMO DATA ONLY — the real engine ran on the full GTFS feed with a tuned
 * MySQL schema (see the write-up below the demo).
 * ---------------------------------------------------------------------------
 */

type Stop = { id: string; name: string; x: number; y: number };
type Edge = { from: string; to: string; line: string; minutes: number };

const STOPS: Stop[] = [
  { id: "centraal", name: "Maastricht Centraal", x: 430, y: 150 },
  { id: "markt", name: "Markt", x: 235, y: 150 },
  { id: "vrijthof", name: "Vrijthof", x: 180, y: 205 },
  { id: "boschstraat", name: "Boschstraat", x: 210, y: 75 },
  { id: "ceramique", name: "Céramique", x: 400, y: 250 },
  { id: "randwyck", name: "Randwyck / UM", x: 450, y: 340 },
  { id: "mecc", name: "MECC", x: 520, y: 385 },
  { id: "sintpieter", name: "Sint Pieter", x: 175, y: 350 },
];

const EDGES: Edge[] = [
  { from: "centraal", to: "markt", line: "Bus 1", minutes: 4 },
  { from: "markt", to: "vrijthof", line: "Bus 1", minutes: 2 },
  { from: "markt", to: "boschstraat", line: "Bus 3", minutes: 3 },
  { from: "centraal", to: "boschstraat", line: "Bus 3", minutes: 5 },
  { from: "centraal", to: "ceramique", line: "Bus 5", minutes: 3 },
  { from: "ceramique", to: "randwyck", line: "Bus 5", minutes: 5 },
  { from: "randwyck", to: "mecc", line: "Bus 5", minutes: 3 },
  { from: "vrijthof", to: "ceramique", line: "Bus 10", minutes: 5 },
  { from: "vrijthof", to: "sintpieter", line: "Bus 4", minutes: 6 },
  { from: "sintpieter", to: "randwyck", line: "Bus 4", minutes: 8 },
];

type RouteResult = {
  stops: Stop[];
  legs: { line: string; from: string; to: string; minutes: number }[];
  total: number;
};

/** Tiny Dijkstra over the demo network (bidirectional edges). */
function route(fromId: string, toId: string): RouteResult | null {
  const dist = new Map<string, number>([[fromId, 0]]);
  const prev = new Map<string, { id: string; edge: Edge }>();
  const visited = new Set<string>();

  while (true) {
    let current: string | null = null;
    let best = Infinity;
    for (const [id, d] of dist) {
      if (!visited.has(id) && d < best) {
        best = d;
        current = id;
      }
    }
    if (current === null) break;
    if (current === toId) break;
    visited.add(current);

    for (const e of EDGES) {
      const neighbour =
        e.from === current ? e.to : e.to === current ? e.from : null;
      if (!neighbour || visited.has(neighbour)) continue;
      const alt = best + e.minutes;
      if (alt < (dist.get(neighbour) ?? Infinity)) {
        dist.set(neighbour, alt);
        prev.set(neighbour, { id: current, edge: e });
      }
    }
  }

  if (!dist.has(toId)) return null;
  const ids: string[] = [toId];
  const legs: RouteResult["legs"] = [];
  let cursor = toId;
  while (cursor !== fromId) {
    const p = prev.get(cursor);
    if (!p) return null;
    legs.unshift({
      line: p.edge.line,
      from: p.id,
      to: cursor,
      minutes: p.edge.minutes,
    });
    ids.unshift(p.id);
    cursor = p.id;
  }
  const byId = (id: string) => STOPS.find((s) => s.id === id)!;
  return { stops: ids.map(byId), legs, total: dist.get(toId)! };
}

const stopName = (id: string) => STOPS.find((s) => s.id === id)!.name;

export function TransportDemo() {
  const [from, setFrom] = useState("centraal");
  const [to, setTo] = useState("sintpieter");
  const [result, setResult] = useState<RouteResult | null>(null);

  const path = useMemo(() => {
    if (!result) return "";
    return result.stops
      .map((s, i) => `${i === 0 ? "M" : "L"} ${s.x} ${s.y}`)
      .join(" ");
  }, [result]);

  const pathLength = useMemo(() => {
    if (!result) return 0;
    let len = 0;
    for (let i = 1; i < result.stops.length; i++) {
      const a = result.stops[i - 1];
      const b = result.stops[i];
      len += Math.hypot(b.x - a.x, b.y - a.y);
    }
    return len;
  }, [result]);

  const onRoute = () => setResult(from === to ? null : route(from, to));

  const selectCls =
    "flex-1 min-w-0 font-[family-name:var(--font-mono)] text-[12.5px] text-[var(--text-bright)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[8px] py-2 px-2.5 outline-none transition-[border-color] duration-150 focus:border-[var(--accent)] cursor-pointer";

  return (
    <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-[14px] p-[18px] my-[2em] shadow-[var(--shadow-card)]">
      <CornerBrackets />

      {/* Title bar */}
      <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] border-b border-dashed border-[var(--border)] pb-3 mb-4">
        <span className="tracking-[0.04em]">~/transport-router --demo</span>
        <span className="flex items-center gap-1.5">
          <Blip size={6} />
          gtfs: placeholder
        </span>
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] gap-5 max-[760px]:grid-cols-1">
        {/* Map */}
        <svg
          viewBox="0 0 620 440"
          className="w-full h-auto border border-[var(--border)] rounded-[10px] bg-[var(--bg)]"
          aria-label="Stylized map of Maastricht with bus stops"
        >
          {/* dot grid */}
          <defs>
            <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="var(--dot-base)" />
            </pattern>
          </defs>
          <rect width="620" height="440" fill="url(#dots)" />

          {/* the Maas */}
          <path
            d="M 320 0 C 310 80 330 140 320 200 C 310 260 330 330 315 440"
            fill="none"
            stroke="color-mix(in oklab, var(--accent) 18%, transparent)"
            strokeWidth="34"
          />
          <text
            x="332"
            y="60"
            fill="var(--text-faint)"
            fontSize="11"
            fontFamily="var(--font-mono)"
          >
            de Maas
          </text>

          {/* network edges */}
          {EDGES.map((e, i) => {
            const a = STOPS.find((s) => s.id === e.from)!;
            const b = STOPS.find((s) => s.id === e.to)!;
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="var(--border-strong)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* active route */}
          {result && (
            <path
              d={path}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength,
                animation: "route-draw 0.9s ease-out forwards",
                filter: "drop-shadow(0 0 6px var(--accent-glow))",
              }}
            />
          )}
          <style>{`@keyframes route-draw { to { stroke-dashoffset: 0; } }`}</style>

          {/* stops */}
          {STOPS.map((s) => {
            const active =
              result?.stops.some((r) => r.id === s.id) ??
              (s.id === from || s.id === to);
            const isEnd = s.id === from || s.id === to;
            return (
              <g key={s.id}>
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={isEnd ? 7 : 5}
                  fill={active ? "var(--accent)" : "var(--surface-2)"}
                  stroke={active ? "var(--accent)" : "var(--text-dim)"}
                  strokeWidth="1.5"
                />
                <text
                  x={s.x + 11}
                  y={s.y + 4}
                  fill={active ? "var(--text-bright)" : "var(--text-dim)"}
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                >
                  {s.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Controls + itinerary */}
        <div className="flex flex-col gap-3 min-w-0">
          <label className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.06em] text-[var(--text-dim)]">
            FROM
            <select
              className={`${selectCls} mt-1.5 block w-full`}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {STOPS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.06em] text-[var(--text-dim)]">
            TO
            <select
              className={`${selectCls} mt-1.5 block w-full`}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {STOPS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={onRoute}
            className="relative font-[family-name:var(--font-mono)] whitespace-nowrap transition-[border-color,background,transform,color] duration-[180ms] active:translate-y-px inline-flex items-center justify-center gap-2.5 py-2.5 px-[18px] text-[13px] rounded-lg border border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)] font-semibold hover:bg-transparent hover:text-[var(--accent)] cursor-pointer"
          >
            $ route --fastest
          </button>

          {/* Itinerary, terminal style */}
          <div className="font-[family-name:var(--font-mono)] text-[12px] leading-[1.7] text-[var(--text-dim)] bg-[var(--bg)] border border-[var(--border)] rounded-[10px] p-3.5 min-h-[120px] overflow-x-auto">
            {result ? (
              <>
                <div className="text-[var(--text-faint)]">
                  # fastest route · {result.legs.length} leg
                  {result.legs.length > 1 ? "s" : ""}
                </div>
                {result.legs.map((leg, i) => (
                  <div key={i} className="whitespace-nowrap">
                    <span className="text-[var(--accent)]">{leg.line}</span>{" "}
                    {stopName(leg.from)} → {stopName(leg.to)}{" "}
                    <span className="text-[var(--text-faint)]">
                      ({leg.minutes} min)
                    </span>
                  </div>
                ))}
                <div className="mt-1 text-[var(--text-bright)]">
                  total: {result.total} min
                  {result.legs.some((l, i) => i > 0 && l.line !== result.legs[i - 1].line) &&
                    " · includes transfer"}
                </div>
              </>
            ) : (
              <span className="text-[var(--text-faint)]">
                # pick two stops and run the router…
              </span>
            )}
          </div>

          <p className="font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--text-faint)] leading-[1.6] m-0">
            {"// demo with placeholder stops, lines & times. the real project routes on the full GTFS feed with a tuned MySQL schema."}
          </p>
        </div>
      </div>
    </div>
  );
}
