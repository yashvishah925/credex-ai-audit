// api/send-audit-email.js
// Vercel Serverless Function — place this at /api/send-audit-email.js in your project root
// Works with Vercel, Netlify (rename to netlify/functions/send-audit-email.js), or Express

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Simple server-side rate limiter (in-memory, resets on cold start) ─────────
// For production, replace with Redis or Upstash
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const RATE_LIMIT_MAX = 3;

function isServerRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count += 1;
  return false;
}

// ── Email HTML builder ────────────────────────────────────────────────────────
function buildEmailHTML({ companyName, totalSavings, annualSavings, shareUrl, isHighSavings }) {
  const savingsLine =
    totalSavings > 0
      ? `<p style="font-size:32px;font-weight:900;color:#10b981;margin:0 0 4px 0;">$${Number(totalSavings).toFixed(0)}<span style="font-size:14px;color:#6b7280;">/mo identified</span></p>
         <p style="font-size:13px;color:#6b7280;margin:0 0 24px 0;">That's <strong>$${Number(annualSavings).toFixed(0)}</strong> recovered annually.</p>`
      : `<p style="font-size:15px;color:#374151;margin:0 0 24px 0;">✅ Your AI stack is already well-optimized. No material savings found right now — we'll alert you when that changes.</p>`;

  const cta = shareUrl
    ? `<a href="${shareUrl}" style="display:inline-block;background:#032f24;color:#fff;text-decoration:none;font-weight:800;font-size:13px;padding:14px 28px;border-radius:12px;margin-top:8px;">View Full Audit Report →</a>`
    : "";

  const highSavingsNote = isHighSavings
    ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-top:20px;">
        <p style="margin:0;font-size:12px;font-weight:700;color:#065f46;">🚀 High-savings case detected. A Credex advisor may reach out to help you implement these changes.</p>
       </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Your AI Spend Audit — Credex</title></head>
<body style="margin:0;padding:0;background:#f5f7fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fc;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e5e7eb;">

        <!-- Header -->
        <tr><td style="background:#032f24;padding:32px 36px;">
          <p style="margin:0 0 8px 0;font-size:10px;font-weight:900;letter-spacing:3px;color:rgba(255,255,255,0.5);text-transform:uppercase;">✦ Credex</p>
          <h1 style="margin:0;font-size:24px;font-weight:900;color:#ffffff;line-height:1.2;">Your AI Spend<br>Audit Report</h1>
          ${companyName ? `<p style="margin:10px 0 0 0;font-size:12px;color:rgba(255,255,255,0.5);">${companyName}</p>` : ""}
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 36px;">
          <p style="font-size:13px;color:#6b7280;margin:0 0 20px 0;">Here's a summary of your audit results:</p>

          ${savingsLine}
          ${cta}
          ${highSavingsNote}

          <hr style="border:none;border-top:1px solid #f3f4f6;margin:28px 0;">

          <p style="font-size:11px;color:#9ca3af;margin:0;line-height:1.6;">
            Pricing benchmarks verified May 2026. This audit is informational only and does not constitute financial advice.<br><br>
            You're receiving this because you submitted an audit at credex.ai. 
            <a href="#" style="color:#9ca3af;">Unsubscribe</a> at any time.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Handler ────────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Server-side rate limit by IP
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isServerRateLimited(ip)) {
    return res.status(429).json({ error: "Rate limit exceeded. Try again tomorrow." });
  }

  const {
    to,            // ← the user's actual email from the form
    companyName,
    totalSavings,
    annualSavings,
    shareUrl,
    isHighSavings,
  } = req.body;

  // Validate recipient
  if (!to || !to.includes("@")) {
    return res.status(400).json({ error: "Invalid recipient email." });
  }

  // Block obviously fake/disposable patterns (optional, basic)
  const blockedDomains = ["mailinator.com", "guerrillamail.com", "trashmail.com", "10minutemail.com"];
  const domain = to.split("@")[1]?.toLowerCase();
  if (blockedDomains.includes(domain)) {
    return res.status(400).json({ error: "Please use a real work email address." });
  }

  try {
    const html = buildEmailHTML({ companyName, totalSavings, annualSavings, shareUrl, isHighSavings });

    const { data, error } = await resend.emails.send({
      from: "Credex Audits <audits@yourdomain.com>",  // ← replace with your verified Resend sender
      to: [to],                                        // ← goes to exactly what the user typed
      subject:
        Number(totalSavings) > 0
          ? `Your AI Audit: $${Number(totalSavings).toFixed(0)}/mo in savings identified`
          : "Your AI Stack Audit — You're Running Lean",
      html,
      // Optional: BCC yourself for high-savings leads
      ...(isHighSavings && { bcc: ["syashvi569@gmail.com"] }),
    });

    if (error) throw error;

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Failed to send email. Please try again." });
  }
}
