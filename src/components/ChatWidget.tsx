"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { fallbackReply, findAnswer, qaPool } from "@/data/chat";
import { Blip, CornerBrackets } from "./ui";

type Message = {
  role: "system" | "user" | "assistant";
  text: string;
  /** When true, render the clickable question list under the text */
  showQuestions?: boolean;
};

const roleLabel = (role: Message["role"]) =>
  role === "system" ? "// system" : role === "user" ? "// you" : `// ${site.handle}`;

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** 500–900ms of pretend thinking — instant answers feel wrong in a terminal. */
const thinkingDelay = () => delay(500 + Math.random() * 400);

/** How many characters to reveal per typing tick. */
const typeStep = () => 3 + Math.floor(Math.random() * 4);

/**
 * The "~/ask-me.sh" terminal chat card. Replies come from the pre-generated
 * Q&A pool in src/data/chat.ts — clickable question chips get real answers,
 * anything else gets the credit-saving fallback plus the question list.
 */
export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      text: `connected to ${site.handle}${site.domainSuffix}. ask anything.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [asked, setAsked] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  /** Type `reply` into the last assistant message, terminal-style. */
  const typeOut = (reply: string, showQuestions: boolean) =>
    new Promise<void>((resolve) => {
      let i = 0;
      const tick = () => {
        i = Math.min(reply.length, i + typeStep());
        const done = i >= reply.length;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            text: reply.slice(0, i),
            showQuestions: done && showQuestions,
          };
          return next;
        });
        if (!done) setTimeout(tick, 16);
        else resolve();
      };
      tick();
    });

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    setInput("");
    setBusy(true);
    setMessages((prev) => [...prev, { role: "user", text: question }]);

    await thinkingDelay();

    const match = findAnswer(question);
    if (match) setAsked((prev) => [...new Set([...prev, match.question])]);

    setMessages((prev) => [...prev, { role: "assistant", text: "" }]);
    await typeOut(match ? match.answer : fallbackReply, !match);
    setBusy(false);
  };

  const questionList = (compact: boolean) =>
    qaPool.map((qa) => (
      <button
        key={qa.question}
        disabled={busy}
        onClick={() => send(qa.question)}
        className={`font-[family-name:var(--font-mono)] text-[11.5px] py-1.5 px-2.5 border rounded-full whitespace-nowrap transition-[border-color,color,background] duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
          compact
            ? "text-[var(--text-dim)] border-[var(--border)] bg-[var(--surface-2)] hover:text-[var(--accent)] hover:border-[var(--accent)]"
            : "text-[var(--accent)] border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)] text-left whitespace-normal"
        }`}
      >
        {compact ? qa.question : `→ ${qa.question}`}
      </button>
    ));

  // Chips below the messages: questions not asked yet (keeps the row fresh).
  const chipQuestions = qaPool.filter((qa) => !asked.includes(qa.question)).slice(0, 4);

  return (
    <div
      className="relative bg-[var(--surface)] border border-[var(--border)] rounded-[14px] p-[18px] flex flex-col min-h-[460px] shadow-[var(--shadow-card)]"
      id="chat"
    >
      <CornerBrackets />

      {/* Title bar */}
      <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] border-b border-dashed border-[var(--border)] pb-3 mb-3.5">
        <div className="flex gap-1.5">
          <span className="w-[10px] h-[10px] rounded-full bg-[var(--border-strong)]"></span>
          <span className="w-[10px] h-[10px] rounded-full bg-[var(--border-strong)]"></span>
          <span className="w-[10px] h-[10px] rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]"></span>
        </div>
        <span className="tracking-[0.04em] whitespace-nowrap">~/ask-me.sh</span>
        <span className="flex items-center gap-1.5">
          <Blip size={6} />
          {busy ? "thinking" : "ready"}
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="overflow-y-auto flex flex-col gap-3.5 pt-1 px-1 pb-3 h-[340px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[var(--border-strong)] [&::-webkit-scrollbar-thumb]:rounded-[3px]"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-[14px] leading-[1.55] max-w-[92%] ${m.role === "user" ? "self-end text-right" : ""}`}
          >
            <div
              className={`font-[family-name:var(--font-mono)] text-[11px] tracking-[0.05em] mb-1 ${m.role === "user" ? "text-[var(--accent)]" : "text-[var(--text-dim)]"}`}
            >
              {roleLabel(m.role)}
            </div>
            <div className="whitespace-pre-wrap text-pretty text-[var(--text)]">
              {m.text}
            </div>
            {m.showQuestions && (
              <div className="flex flex-col items-start gap-1.5 mt-2.5">
                {questionList(false)}
              </div>
            )}
          </div>
        ))}
        {busy && messages[messages.length - 1]?.role === "user" && (
          <div className="text-[14px] leading-[1.55] max-w-[92%]">
            <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.05em] mb-1 text-[var(--text-dim)]">
              {roleLabel("assistant")}
            </div>
            <div className="flex gap-1 items-center h-5" aria-label="typing">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="w-1.5 h-1.5 rounded-full bg-[var(--text-dim)]"
                  style={{
                    animation: `typingBounce 1.1s ease-in-out ${d * 0.15}s infinite`,
                  }}
                ></span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-1.5 pt-2.5 pb-3 border-t border-dashed border-[var(--border)]">
        {chipQuestions.map((qa) => (
          <button
            key={qa.question}
            disabled={busy}
            onClick={() => send(qa.question)}
            className="font-[family-name:var(--font-mono)] text-[11.5px] py-1.5 px-2.5 border rounded-full whitespace-nowrap transition-[border-color,color,background] duration-150 text-[var(--text-dim)] border-[var(--border)] bg-[var(--surface-2)] hover:text-[var(--accent)] hover:border-[var(--accent)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            {qa.question}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <div className="flex items-center gap-2 py-2.5 px-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-[10px] transition-[border-color] duration-150 focus-within:border-[var(--accent)]">
          <span
            className="font-[family-name:var(--font-mono)] text-[var(--accent)] text-[13px]"
            aria-hidden="true"
          >
            ›
          </span>
          <input
            className="flex-1 min-w-0 font-[family-name:var(--font-mono)] text-[13.5px] text-[var(--text-bright)] bg-transparent border-none outline-none placeholder:text-[var(--text-faint)]"
            aria-label={`Ask about ${site.handle}`}
            placeholder={`ask anything about ${site.handle}…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="relative font-[family-name:var(--font-mono)] whitespace-nowrap shrink-0 transition-[border-color,background,transform,color] duration-[180ms] active:translate-y-px inline-flex items-center py-1.5 px-2.5 text-[11px] tracking-[0.06em] rounded-[6px] border border-[var(--border-strong)] text-[var(--text-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={!input.trim() || busy}
          >
            <span className="hidden sm:inline">send&nbsp;</span>↵
          </button>
        </div>
      </form>
    </div>
  );
}
