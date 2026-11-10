import { NextResponse } from "next/server";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const DEDUPE_MS = 60_000;

// best-effort dedupe (per server instance)
const recent = new Map<string, number>();

const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
    if (!TOKEN || !CHAT_ID) {
        return NextResponse.json({ ok: false }, { status: 500 });
    }

    const body = await req.json().catch(() => null);
    if (!body?.message) {
        return NextResponse.json({ ok: false }, { status: 400 });
    }

    const message = String(body.message).slice(0, 500);
    const source = String(body.source ?? "unknown").slice(0, 100);
    const stack = String(body.stack ?? "").slice(0, 1500);
    const url = String(body.url ?? "").slice(0, 300);

    // don't spam the same error
    const key = `${source}|${message}`;
    const now = Date.now();
    if (now - (recent.get(key) ?? 0) < DEDUPE_MS) {
        return NextResponse.json({ ok: true, deduped: true });
    }
    recent.set(key, now);

    const text =
        `🚨 <b>${esc(source)}</b>\n` +
        `<b>${esc(message)}</b>\n` +
        (url ? `📍 ${esc(url)}\n` : "") +
        `🕒 ${new Date().toISOString()}\n` +
        (stack ? `<pre>${esc(stack)}</pre>` : "");

    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: text.slice(0, 4000),
            parse_mode: "HTML",
        }),
    });

    return NextResponse.json({ ok: res.ok });
}