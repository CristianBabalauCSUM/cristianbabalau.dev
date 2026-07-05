import { NextResponse } from "next/server";

/**
 * ---------------------------------------------------------------------------
 * CONTACT FORM STUB
 *
 * Wire this to your email provider (Resend, SES, SMTP, …) or database.
 * For now it validates the payload, logs it server-side, and reports success
 * so the form flow can be exercised end-to-end.
 * ---------------------------------------------------------------------------
 */
export async function POST(request: Request) {
  let data: { name?: string; email?: string; msg?: string };
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const name = data.name?.trim();
  const email = data.email?.trim();
  const msg = data.msg?.trim();

  if (!name || !email || !msg || msg.length < 10 || msg.length > 2000) {
    return NextResponse.json({ error: "validation failed" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  // TODO: deliver the message (email service, database, webhook, …).
  console.log("[contact] new message:", { name, email, msg });

  return NextResponse.json({ ok: true });
}
