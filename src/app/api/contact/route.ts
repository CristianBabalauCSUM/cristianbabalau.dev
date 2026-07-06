import { NextResponse } from "next/server";
import { site } from "@/data/site";

/**
 * ---------------------------------------------------------------------------
 * CONTACT FORM  →  email delivery
 *
 * Submissions are emailed to CONTACT_TO_EMAIL (defaults to the site's own
 * address) via Resend (https://resend.com), with the sender's address set as
 * reply-to so a reply goes straight back to them.
 *
 * Required env var (set in Netlify → Site settings → Environment variables):
 *   RESEND_API_KEY      — your Resend API key
 * Optional:
 *   CONTACT_TO_EMAIL    — inbox that receives submissions (default: site.email)
 *   CONTACT_FROM_EMAIL  — verified sender (default: onboarding@resend.dev,
 *                         which Resend allows without domain verification when
 *                         sending to your own account address)
 *
 * With no RESEND_API_KEY set, the route degrades gracefully: it validates,
 * logs to the function console, and still returns success so the form UX works.
 * ---------------------------------------------------------------------------
 */

/** Strip CR/LF so user input can't be smuggled into email headers. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

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

  if (!name || !email || !msg) {
    return NextResponse.json({ error: "validation failed" }, { status: 400 });
  }
  if (name.length > 120 || email.length > 200) {
    return NextResponse.json({ error: "validation failed" }, { status: 400 });
  }
  if (msg.length < 10 || msg.length > 2000) {
    return NextResponse.json({ error: "validation failed" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const from =
    process.env.CONTACT_FROM_EMAIL ||
    "Portfolio Contact <onboarding@resend.dev>";

  // No provider configured yet: log as a fallback and keep the UX working.
  if (!apiKey) {
    console.log("[contact] (RESEND_API_KEY not set — message not emailed):", {
      name,
      email,
      msg,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: oneLine(email),
        subject: `Portfolio contact — ${oneLine(name)}`,
        text: `New message from your portfolio contact form\n\nName:  ${name}\nEmail: ${email}\n\n${msg}\n`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[contact] Resend error", res.status, detail);
      return NextResponse.json({ error: "delivery failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] delivery threw", err);
    return NextResponse.json({ error: "delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
