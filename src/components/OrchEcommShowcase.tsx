"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Blip, CornerBrackets } from "./ui";

/**
 * ---------------------------------------------------------------------------
 * ORCHECOMM SHOWCASE
 *
 * Rendered on the OrchEcomm project page (demo: "orchecomm"). Three parts:
 *   1. a 4-box stats grid
 *   2. an interactive ReactFlow diagram of the module structure
 *   3. cards describing every module (6 live, 3 in beta)
 * ---------------------------------------------------------------------------
 */

const LIVE_URL = "https://orchecomm.nl";
const LIVE_LABEL = "orchecomm.nl";

type Module = {
  name: string;
  blurb: string;
  tags: string[];
  status: "live" | "beta";
};

const MODULES: Module[] = [
  {
    name: "OrchSupply",
    blurb:
      "Source products and suppliers without leaving your dashboard: a vetted supplier network, live cost and margin, and one-click import straight into your catalogue.",
    tags: ["Sourcing", "Suppliers", "Catalogue"],
    status: "live",
  },
  {
    name: "OrchMarketing",
    blurb:
      "Your always-on creative team. Drop in your brand file and generate offers, ad campaigns and finished creatives that learn from every approval you make.",
    tags: ["Hook Lab", "Campaigns", "Studio"],
    status: "live",
  },
  {
    name: "OrchSupport",
    blurb:
      "24/7 customer support that knows your store. Orders, policies and product data always in context, so every reply is fast, accurate and on-brand.",
    tags: ["Shared inbox", "Macros", "AI replies"],
    status: "live",
  },
  {
    name: "OrchPayments",
    blurb:
      "Orchestrate every transaction across processors automatically: higher authorization rates, smart retries on failed charges, and one reconciled ledger.",
    tags: ["Smart routing", "Retries", "Reconciliation"],
    status: "live",
  },
  {
    name: "OrchWebsiteBuilder",
    blurb:
      "Proven, high-converting blocks that drop straight into your existing website builder. Launch pages that are already optimized, no redesign required.",
    tags: ["Proven blocks", "Templates", "CRO"],
    status: "live",
  },
  {
    name: "OrchRefund",
    blurb:
      "Fight unjustified refunds and chargebacks automatically. Build the evidence, dispute the claim, and protect your store's reputation and processor standing.",
    tags: ["Disputes", "Evidence", "Protection"],
    status: "live",
  },
  {
    name: "OrchAnalytics",
    blurb:
      "One source of truth across every module: unified dashboards that turn siloed data into decisions.",
    tags: ["Metrics", "Dashboards"],
    status: "beta",
  },
  {
    name: "OrchLogistics",
    blurb:
      "Shipping, fulfilment and tracking orchestrated across carriers, with rates and labels in one place.",
    tags: ["Shipping", "Fulfilment"],
    status: "beta",
  },
  {
    name: "OrchLoyalty",
    blurb:
      "Retention on autopilot: email flows, rewards and win-backs that read the same customer data as every other module.",
    tags: ["Retention", "Rewards"],
    status: "beta",
  },
];

const STATS = [
  { value: "6", label: "fully working modules", caption: "+3 in full-scale dev & beta" },
  { value: "30", label: "e-commerce businesses", caption: "connected to the platform" },
  { value: "50+", label: "suppliers", caption: "of various products" },
  { value: "3.000+", label: "orders / month", caption: "orchestrated across the network" },
];

/* ---- ReactFlow nodes & edges ---- */

const nodeBase: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  borderRadius: 10,
  padding: "9px 12px",
  width: 150,
  textAlign: "center",
};

function moduleNode(id: string, label: string, x: number, y: number, beta = false): Node {
  return {
    id,
    position: { x, y },
    data: { label },
    style: {
      ...nodeBase,
      background: "var(--surface-2)",
      color: beta ? "var(--text-dim)" : "var(--text-bright)",
      border: `1px ${beta ? "dashed" : "solid"} ${beta ? "var(--border-strong)" : "var(--accent)"}`,
      opacity: beta ? 0.75 : 1,
    },
  };
}

const NODES: Node[] = [
  {
    id: "store",
    position: { x: 400, y: 0 },
    data: { label: "Your Store" },
    style: {
      ...nodeBase,
      background: "var(--surface)",
      color: "var(--text-bright)",
      border: "1px solid var(--border-strong)",
    },
  },
  {
    id: "core",
    position: { x: 388, y: 175 },
    data: { label: "⬡ Orchestration Core" },
    style: {
      ...nodeBase,
      width: 174,
      background: "var(--accent)",
      color: "var(--on-accent)",
      border: "1px solid var(--accent)",
      fontWeight: 700,
      boxShadow: "0 0 24px -4px var(--accent-glow)",
    },
  },
  moduleNode("supply", "OrchSupply", 40, 40),
  moduleNode("marketing", "OrchMarketing", 40, 175),
  moduleNode("support", "OrchSupport", 40, 310),
  moduleNode("payments", "OrchPayments", 760, 40),
  moduleNode("website", "OrchWebsiteBuilder", 760, 175),
  moduleNode("refund", "OrchRefund", 760, 310),
  moduleNode("analytics", "OrchAnalytics", 250, 385, true),
  moduleNode("logistics", "OrchLogistics", 410, 385, true),
  moduleNode("loyalty", "OrchLoyalty", 570, 385, true),
];

const liveEdge = (id: string): Edge => ({
  id: `core-${id}`,
  source: "core",
  target: id,
  animated: true,
  style: { stroke: "var(--accent)", strokeWidth: 1.5 },
});
const betaEdge = (id: string): Edge => ({
  id: `core-${id}`,
  source: "core",
  target: id,
  style: { stroke: "var(--border-strong)", strokeWidth: 1.5, strokeDasharray: "5 5" },
});

const EDGES: Edge[] = [
  {
    id: "store-core",
    source: "store",
    target: "core",
    animated: true,
    style: { stroke: "var(--accent)", strokeWidth: 1.5 },
  },
  liveEdge("supply"),
  liveEdge("marketing"),
  liveEdge("support"),
  liveEdge("payments"),
  liveEdge("website"),
  liveEdge("refund"),
  betaEdge("analytics"),
  betaEdge("logistics"),
  betaEdge("loyalty"),
];

function Flow() {
  const [nodes, , onNodesChange] = useNodesState(NODES);
  const [edges, , onEdgesChange] = useEdgesState(EDGES);
  const noop = useCallback<NodeMouseHandler>(() => {}, []);

  return (
    <div className="h-[440px] w-full rounded-[10px] overflow-hidden border border-[var(--border)] bg-[var(--bg)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={noop}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        zoomOnScroll={false}
        panOnScroll={false}
        preventScrolling={false}
        nodesConnectable={false}
        edgesFocusable={false}
        minZoom={0.4}
        maxZoom={1.5}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1}
          color="var(--dot-base)"
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export function OrchEcommShowcase() {
  return (
    <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-[14px] p-[18px] my-[2em] shadow-[var(--shadow-card)]">
      <CornerBrackets />

      {/* Title bar */}
      <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] border-b border-dashed border-[var(--border)] pb-3 mb-4 gap-3 flex-wrap">
        <span className="tracking-[0.04em]">~/orchecomm --overview</span>
        <a
          href={LIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[var(--accent)] hover:underline"
        >
          <Blip size={6} />
          read more at {LIVE_LABEL} ↗
        </a>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3 mb-5 max-[760px]:grid-cols-2">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="relative overflow-hidden border border-[var(--border)] rounded-xl bg-[var(--bg)] p-4"
          >
            <div className="font-[family-name:var(--font-mono)] text-[clamp(24px,3vw,32px)] font-medium text-[var(--accent)] leading-none">
              {s.value}
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-bright)] mt-2">
              {s.label}
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--text-faint)] mt-0.5">
              {s.caption}
            </div>
          </div>
        ))}
      </div>

      {/* Flowchart */}
      <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)] mb-2">
        <span className="text-[var(--accent)]">##</span> module structure
        <span className="text-[var(--text-faint)] ml-2">
          {"// drag the nodes around"}
        </span>
      </div>
      <Flow />

      {/* Module cards */}
      <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)] mt-6 mb-3">
        <span className="text-[var(--accent)]">##</span> the modules
        <span className="text-[var(--text-faint)] ml-2">
          {"// 6 live, 3 in beta"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
        {MODULES.map((m) => (
          <div
            key={m.name}
            className="border border-[var(--border)] rounded-xl bg-[var(--bg)] p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-[family-name:var(--font-mono)] text-[14px] text-[var(--text-bright)] font-medium">
                {m.name}
              </span>
              <span
                className={`font-[family-name:var(--font-mono)] text-[9.5px] tracking-[0.08em] px-1.5 py-0.5 rounded-[4px] border ${
                  m.status === "live"
                    ? "text-[var(--accent)] border-[var(--accent)] bg-[var(--accent-dim)]"
                    : "text-[var(--text-dim)] border-[var(--border-strong)]"
                }`}
              >
                {m.status === "live" ? "LIVE" : "BETA"}
              </span>
            </div>
            <p className="text-[12.5px] text-[var(--text-dim)] leading-[1.5] m-0">
              {m.blurb}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
              {m.tags.map((t) => (
                <span
                  key={t}
                  className="font-[family-name:var(--font-mono)] text-[10px] px-1.5 py-0.5 border rounded-[4px] border-[var(--border-strong)] text-[var(--text-faint)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--text-faint)] leading-[1.6] mt-4 mb-0">
        {"// explore the full platform at "}
        <a
          href={LIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:underline"
        >
          {LIVE_LABEL}
        </a>
      </p>
    </div>
  );
}
