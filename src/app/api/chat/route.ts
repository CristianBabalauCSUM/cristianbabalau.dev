import { NextResponse } from "next/server";

/**
 * ---------------------------------------------------------------------------
 * CHAT BACKEND STUB
 *
 * The original site wires this to a self-hosted LLM. Replace the body of
 * this handler with a call to your model of choice — e.g. the Anthropic API,
 * a llama.cpp server, or the Vercel AI SDK — and return { reply: string }.
 *
 * The request body is: { messages: { role: "user" | "assistant"; content: string }[] }
 * ---------------------------------------------------------------------------
 */
export async function POST(request: Request) {
  let messages: { role: string; content: string }[] = [];
  try {
    const body = await request.json();
    if (Array.isArray(body?.messages)) messages = body.messages;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser?.content?.trim()) {
    return NextResponse.json({ error: "empty message" }, { status: 400 });
  }

  // TODO: replace this canned reply with a real LLM call.
  const reply = [
    `you asked: "${lastUser.content.trim()}"`,
    "",
    "this chat isn't wired to a model yet — it's a placeholder.",
    "hook up your LLM in src/app/api/chat/route.ts and I'll start answering for real.",
  ].join("\n");

  return NextResponse.json({ reply });
}
