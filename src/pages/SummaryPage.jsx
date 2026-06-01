import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { runAudit } from "../utils/auditEngine";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const TOOL_EMOJI = {
  ChatGPT: "🤖", Claude: "✦", Cursor: "💻", Gemini: "✨", v0: "🎨",
  Midjourney: "🎨", Notion: "📝", "GitHub Copilot": "💻", Windsurf: "🌊",
  Perplexity: "🔍", Jasper: "📣", "Anthropic API": "⚡", "OpenAI API": "⚡",
  default: "🤖",
};

// ── Rate limiting ─────────────────────────────────────────────────────────────
function getRateLimitKey() { return `credex_lead_ts_${new Date().toDateString()}`; }
function isRateLimited() {
  try { return parseInt(localStorage.getItem(getRateLimitKey()) || "0") >= 3; }
  catch { return false; }
}
function incrementRateLimit() {
  try {
    const k = getRateLimitKey();
    localStorage.setItem(k, String(parseInt(localStorage.getItem(k) || "0") + 1));
  } catch {}
}

// ── OG meta tags (client-side fallback) ──────────────────────────────────────
function setOGMeta({ title, description, url }) {
  const set = (prop, content) => {
    let el = document.querySelector(`meta[property="${prop}"]`)
          || document.querySelector(`meta[name="${prop}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(
        prop.startsWith("og:") || prop.startsWith("twitter:") ? "property" : "name",
        prop
      );
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };
  document.title = title;
  set("og:title", title);
  set("og:description", description);
  set("og:url", url);
  set("og:type", "website");
  set("og:image", `${window.location.origin}/og-preview.png`);
  set("twitter:card", "summary_large_image");
  set("twitter:title", title);
  set("twitter:description", description);
  set("twitter:image", `${window.location.origin}/og-preview.png`);
}

// ── Loading screen ────────────────────────────────────────────────────────────
function LoadingScreen({ message = "Loading audit…" }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center px-4">
      <div className="text-center w-full max-w-sm">
        <div className="flex gap-1.5 justify-center mb-4">
          {[0, 150, 300].map(d => (
            <span key={d} className="w-2 h-2 rounded-full bg-[#032f24] animate-bounce"
              style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
        <p className="text-sm text-gray-500 font-medium">{message}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function SummaryPage() {
  const navigate = useNavigate();
  const { shareId } = useParams();
  const isPublicView = Boolean(shareId);

  const [pageState, setPageState] = useState("loading");
  const [auditResult, setAuditResult] = useState(null);

  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const honeypotRef = useRef(null);

  // ── Load audit data ───────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (isPublicView) {
        // Public share view — load from audit_shares table
        const { data, error } = await supabase
          .from("audit_shares")
          .select("tools_data, company_use_case, company_team_size, audit_results")
          .eq("share_id", shareId)
          .single();

        if (cancelled) return;
        if (error || !data) { setPageState("notfound"); return; }

        const audit = data.audit_results;
        const company = {
          useCase: data.company_use_case,
          teamSize: data.company_team_size,
        };

        // Set OG tags for social sharing
        setOGMeta({
          title: `AI Stack Audit — ${audit.totalSavings > 0 ? `Save $${Math.round(audit.totalSavings * 12)}/yr` : "Optimized Stack"} · Credex`,
          description: `${company.teamSize}-person team · ${audit.auditedTools?.length || 0} tools audited · Powered by Credex`,
          url: window.location.href,
        });

        setAuditResult({ ...audit, company });
        setPageState("ready");
        fetchAISummary({ ...audit, company });

      } else {
        // Owner view — load from localStorage
        let saved = null;
        try { saved = JSON.parse(localStorage.getItem("credexAuditForm")); } catch {}

        if (!saved?.tools || !saved?.company) { setPageState("notfound"); return; }

        const company = saved.company;
        const tools = saved.tools;
        const audit = runAudit(tools, company);

        if (cancelled) return;

        setAuditResult({ ...audit, company });
        setPageState("ready");

        // Generate shareable link — no personal info stored
        generateShareRecord({ tools, company, audit }).then(id => {
          if (!cancelled && id) {
            setShareUrl(`${window.location.origin}/share/${id}`);
          }
        });

        fetchAISummary({ ...audit, company });
      }
    }

    init();
    return () => { cancelled = true; };
  }, [shareId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Create share record (no email, no company name — anonymized) ──────────
  async function generateShareRecord({ tools, company, audit }) {
    try {
      const id = Date.now().toString();
      const { error } = await supabase.from("audit_shares").insert({
        share_id: id,
        tools_data: tools,                        // tools + savings only, no PII
        company_use_case: company.useCase,
        company_team_size: company.teamSize,
        audit_results: audit,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      return id;
    } catch (err) {
      console.warn("Share record creation failed:", err.message);
      return null;
    }
  }

  // ── AI summary ────────────────────────────────────────────────────────────
  async function fetchAISummary({ auditedTools, totalSavings, totalCurrentSpend, optimizedSpend, annualSavings, company }) {
    const fallback = buildFallbackSummary({ auditedTools, totalSavings, totalCurrentSpend, optimizedSpend, annualSavings, company });
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    if (!apiKey) { setSummary(fallback); setSummaryLoading(false); return; }

    try {
      const toolsSummary = (auditedTools || [])
        .map(t => `${t.name} (${t.plan}, ${t.seats} seat${t.seats !== 1 ? "s" : ""}, $${Number(t.monthlySpend || 0).toFixed(2)}/mo${t.savings > 0 ? `, save $${t.savings.toFixed(2)}/mo` : ""})`)
        .join("; ");

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 220,
          messages: [{
            role: "user",
            content: `You are a financial analyst writing a concise executive summary for an AI software spend audit report.

Write exactly one paragraph of approximately 100 words. Be specific with dollar figures. Be honest — if savings are minimal or the stack is already well-optimized, say so clearly without manufacturing false urgency. Avoid filler phrases. Do not use bullet points or headers. Write in plain, direct language.

Audit data:
- Total monthly spend: $${totalCurrentSpend.toFixed(2)}
- Optimized monthly spend: $${optimizedSpend.toFixed(2)}
- Monthly savings identified: $${totalSavings.toFixed(2)}
- Annual savings identified: $${annualSavings.toFixed(2)}
- Tools audited: ${toolsSummary}
- Primary use case: ${company?.useCase}
- Team size: ${company?.teamSize}

Write the summary paragraph now:`,
          }],
        }),
      });

      if (!response.ok) throw new Error(`API ${response.status}`);
      const data = await response.json();
      setSummary(data?.content?.[0]?.text?.trim() || fallback);
    } catch {
      setSummary(fallback);
    } finally {
      setSummaryLoading(false);
    }
  }

  function buildFallbackSummary({ auditedTools, totalSavings, totalCurrentSpend, optimizedSpend, annualSavings, company }) {
    if (totalSavings < 1) {
      return `Your organization is running ${(auditedTools || []).length} AI tool${(auditedTools || []).length !== 1 ? "s" : ""} at $${totalCurrentSpend.toFixed(2)}/month. Our audit found no material optimization opportunities — your current stack is well-configured for a ${company?.teamSize}-person team focused on ${company?.useCase}. Consider re-running this audit when you add new tools or your team size changes significantly.`;
    }
    return `Your organization is running ${(auditedTools || []).length} AI tool${(auditedTools || []).length !== 1 ? "s" : ""} at $${totalCurrentSpend.toFixed(2)}/month. Our audit identified $${totalSavings.toFixed(2)}/month in optimization opportunities — primarily through plan tier adjustments and subscription overlap. Implementing the recommended changes reduces your baseline to $${optimizedSpend.toFixed(2)}/month, recovering $${annualSavings.toFixed(2)} annually.`;
  }

  // ── Lead submit ───────────────────────────────────────────────────────────
  const handleLeadSubmit = useCallback(async () => {
    // Honeypot check
    if (honeypotRef.current?.value) {
      setEmailSent(true); // silently reject bots
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (isRateLimited()) {
      setEmailError("Too many submissions today. Try again tomorrow.");
      return;
    }

    setEmailError("");
    setSubmitting(true);

    try {
      // ── Step A: Save lead to Supabase using YOUR existing schema ───────────
      const { error: dbError } = await supabase.from("leads").insert({
        email: cleanEmail,
        company: companyName.trim() || null,      // maps to your 'company' column
        role: role.trim() || null,
        team_size: auditResult?.company?.teamSize || null,
        monthly_savings: auditResult?.totalSavings || 0,
        annual_savings: auditResult?.annualSavings || 0,
        public_id: shareUrl ? shareUrl.split("/share/")[1] || null : null,
        audit_data: {                              // store extra context here
          useCase: auditResult?.company?.useCase,
          tools: auditResult?.auditedTools?.map(t => ({
            name: t.name,
            plan: t.plan,
            seats: t.seats,
            savings: t.savings,
          })),
          isHighSavings: (auditResult?.totalSavings || 0) >= 500,
          shareUrl: shareUrl || null,
        },
        created_at: new Date().toISOString(),
      });

      if (dbError) {
        console.error("Supabase insert error:", dbError);
        // Don't block the flow — still try to send email
      }

      // ── Step B: Send transactional email to USER's entered email ──────────
      try {
        const emailRes = await fetch("/api/send-audit-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: cleanEmail,                        // ← always the user's email
            companyName: companyName.trim() || null,
            totalSavings: auditResult?.totalSavings ?? 0,
            annualSavings: auditResult?.annualSavings ?? 0,
            shareUrl: shareUrl || null,
            isHighSavings: (auditResult?.totalSavings || 0) >= 500,
          }),
        });

        if (!emailRes.ok) {
          const errBody = await emailRes.json().catch(() => ({}));
          console.warn("Email send failed:", errBody.error);
          // Graceful fallback — lead is saved, email just didn't send
        }
      } catch (emailErr) {
        console.warn("Email fetch failed, continuing:", emailErr.message);
        // App continues working even if email fails
      }

      incrementRateLimit();
      setEmailSent(true);

    } catch (err) {
      console.error("Lead capture error:", err);
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [email, companyName, role, auditResult, shareUrl]);

  function handleCopyLink() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Render states ─────────────────────────────────────────────────────────
  if (pageState === "loading") return <LoadingScreen message="Loading audit…" />;

  if (pageState === "notfound") {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-8 rounded-3xl text-center w-full max-w-md shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-[#032b1f]">
            {isPublicView ? "Audit Not Found" : "No Audit Data Found"}
          </h2>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            {isPublicView
              ? "This share link may have expired or been removed."
              : "Please complete the audit form first."}
          </p>
          <button
            onClick={() => navigate("/form")}
            className="bg-[#032f24] text-white py-3.5 px-6 rounded-2xl font-bold hover:opacity-90 transition w-full text-sm"
          >
            {isPublicView ? "Run Your Own Audit →" : "Go to Form →"}
          </button>
        </div>
      </div>
    );
  }

  const {
    auditedTools = [],
    totalSavings = 0,
    totalCurrentSpend = 0,
    optimizedSpend = 0,
    annualSavings = 0,
    company = {},
  } = auditResult;

  const isHighSavings = totalSavings >= 500;
  const isLowSavings  = totalSavings < 100;

  const inputBase =
    "rounded-xl px-4 py-3.5 text-sm outline-none transition w-full font-semibold bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#032f24]";

  return (
    <div className="min-h-screen bg-[#f5f7fc] py-10 px-4 sm:px-8 lg:px-12 font-sans text-[#032b1f]">
      <div className="w-full max-w-screen-xl mx-auto space-y-6">

        {/* ── PUBLIC VIEW BADGE ── */}
        {isPublicView && (
          <div className="text-center">
            <span className="bg-[#d9f5df] text-[#0b5d3b] text-xs font-bold px-5 py-2 rounded-full border border-emerald-200 shadow-sm inline-block">
              🔒 Shared Report View — Company details anonymized
            </span>
          </div>
        )}

        {/* ── HERO BANNER ── */}
        <div className="bg-[#032f24] rounded-[32px] p-8 lg:p-12 text-white shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #10b981 0%, transparent 60%)" }} />

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase mb-4">
                ✦ AI Spend Audit Report
              </div>
              <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight">
                Your Optimization<br className="hidden lg:block" /> Summary
              </h1>
              <p className="text-white/60 text-sm mt-3 font-medium">
                {auditedTools.length} platform{auditedTools.length !== 1 ? "s" : ""} checked
                {company.teamSize ? ` · ${company.teamSize} operators` : ""}
                {company.useCase ? ` · ${company.useCase} focus` : ""}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 lg:gap-6 w-full lg:w-auto lg:min-w-[520px] border-t border-white/10 pt-6 lg:border-t-0 lg:pt-0 lg:border-l lg:border-white/10 lg:pl-10">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-6">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block mb-1">Current Spend</span>
                <h2 className="text-xl lg:text-3xl font-black text-white tabular-nums">
                  ${totalCurrentSpend.toLocaleString()}<span className="text-xs font-semibold text-white/40 ml-0.5">/mo</span>
                </h2>
              </div>
              <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-2xl p-4 lg:p-6">
                <span className="text-[10px] font-bold tracking-widest text-emerald-300 uppercase block mb-1">Monthly Savings</span>
                <h2 className="text-xl lg:text-3xl font-black text-[#10b981] tabular-nums">
                  ${totalSavings.toLocaleString()}<span className="text-xs font-semibold text-emerald-500/60 ml-0.5">/mo</span>
                </h2>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-6">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block mb-1">Annual Savings</span>
                <h2 className="text-xl lg:text-3xl font-black text-white tabular-nums">
                  ${annualSavings.toLocaleString()}<span className="text-xs font-semibold text-white/40 ml-0.5">/yr</span>
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* ── SHARE LINK (owner view only) ── */}
        {!isPublicView && shareUrl && (
          <div className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                🔗 Shareable Link — no personal info included
              </span>
              <p className="text-xs text-gray-500 truncate mt-1 font-medium">{shareUrl}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-black shrink-0 transition ${
                copied
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700"
              }`}
            >
              {copied ? "✓ Copied!" : "Copy Link"}
            </button>
          </div>
        )}

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT: Per-tool breakdown */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
              Per-Tool Financial Impact
            </h3>

            {auditedTools.map((tool, idx) => {
              const failingChecks = (tool.checks || []).filter(c => !c.passed && c.savings > 0);
              const topCheck = failingChecks.sort((a, b) => b.savings - a.savings)[0];
              const anyFail  = (tool.checks || []).some(c => !c.passed);

              let actionLabel = "No changes needed";
              if (topCheck) {
                const raw = topCheck.recommendation?.split("→")[0]?.trim() || topCheck.title || "Review plan";
                actionLabel = raw.length > 50 ? raw.slice(0, 47) + "…" : raw;
              } else if (anyFail) {
                const f = (tool.checks || []).find(c => !c.passed);
                actionLabel = ((f?.title || "Review recommended").slice(0, 47)) + (f?.title?.length > 47 ? "…" : "");
              }

              const rawReason = topCheck?.reason
                || (tool.checks || []).find(c => !c.passed)?.reason
                || "This tool is correctly configured for your team size and use case.";
              const oneLineReason = rawReason.split(/(?<=[.!?])\s+/)[0] || rawReason;
              const emoji = TOOL_EMOJI[tool.name] || TOOL_EMOJI.default;

              return (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left w-full">
                  <div className="flex items-center justify-between px-5 py-4 lg:px-6 lg:py-5 border-b border-gray-50 bg-white">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border flex items-center justify-center text-base shrink-0">
                        {emoji}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-sm lg:text-base text-gray-900 leading-tight truncate">{tool.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                          {tool.plan} Plan · {tool.seats} User License{tool.seats !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    {tool.savings > 0 ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-black text-[10px] px-3 py-1.5 rounded-full shrink-0 uppercase tracking-wider">
                        Save ${tool.savings.toFixed(0)}/mo
                      </span>
                    ) : (
                      <span className="bg-gray-50 text-gray-400 border border-gray-200 font-bold text-[10px] px-3 py-1.5 rounded-full shrink-0 uppercase tracking-wider">
                        Optimal ✓
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-gray-50 text-center bg-white border-b border-gray-50">
                    <div className="px-3 py-4">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Current Spend</p>
                      <p className="text-xs lg:text-sm font-black text-gray-800">${Number(tool.monthlySpend || 0).toFixed(0)}/mo</p>
                    </div>
                    <div className="px-3 py-4 flex flex-col justify-center items-center">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Recommended Action</p>
                      <p className={`text-[10px] lg:text-xs font-black leading-tight text-center ${tool.savings > 0 ? "text-emerald-700" : "text-gray-500"}`}>
                        {actionLabel}
                      </p>
                    </div>
                    <div className="px-3 py-4">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Monthly Savings</p>
                      <p className={`text-xs lg:text-sm font-black ${tool.savings > 0 ? "text-emerald-600" : "text-gray-300"}`}>
                        {tool.savings > 0 ? `-$${tool.savings.toFixed(0)}` : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 lg:px-6 py-3.5 bg-gray-50/50">
                    <p className="text-[11px] lg:text-xs text-gray-500 leading-relaxed italic">"{oneLineReason}"</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="lg:col-span-1 space-y-5">

            {/* ── LEAD CAPTURE (owner view only) ── */}
            {!isPublicView && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-left w-full">
                {isLowSavings ? (
                  <>
                    <h3 className="text-base font-black text-gray-900 mb-1">✅ You're spending well.</h3>
                    <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
                      Your AI stack is already lean. Enter your email and we'll notify you when new optimizations apply.
                    </p>
                  </>
                ) : isHighSavings ? (
                  <>
                    <h3 className="text-base font-black text-gray-900 mb-1">📋 Lock in your audit report</h3>
                    <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
                      Get this audit emailed to you. For high-savings cases, a Credex advisor will follow up.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-black text-gray-900 mb-1">⚡ Get your audit report</h3>
                    <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
                      We'll email you this audit and alert you when new savings opportunities apply.
                    </p>
                  </>
                )}

                {emailSent ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center font-bold text-sm text-emerald-800 leading-relaxed">
                    ✓ Got it. Check your inbox — your report is on its way.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Honeypot — bots fill this, humans don't see it */}
                    <input
                      ref={honeypotRef}
                      type="text"
                      name="website"
                      tabIndex={-1}
                      style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
                      autoComplete="off"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="Company name (optional)"
                      className={inputBase}
                      autoComplete="organization"
                    />
                    <input
                      type="text"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      placeholder="Your role (optional)"
                      className={inputBase}
                      autoComplete="organization-title"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Your email *"
                      className={inputBase}
                      autoComplete="email"
                    />
                    {emailError && (
                      <p className="text-xs text-red-500 px-1 font-bold">{emailError}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleLeadSubmit}
                      disabled={submitting}
                      className="w-full bg-[#032f24] text-white text-xs font-black py-4 rounded-xl hover:opacity-95 transition tracking-wide shadow-sm disabled:opacity-40 uppercase"
                    >
                      {submitting
                        ? "Sending…"
                        : isLowSavings
                          ? "Notify Me of New Optimizations →"
                          : "Send Me the Audit Report →"}
                    </button>
                    <p className="text-[10px] text-gray-400 text-center font-medium">
                      No spam · Unsubscribe any time · Protected by rate limiting + honeypot
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── AI SUMMARY ── */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-left w-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-black bg-gray-100 w-6 h-6 rounded-md flex items-center justify-center text-gray-500">✦</span>
                <h2 className="text-sm font-black tracking-tight text-gray-900">AI-Generated Performance Summary</h2>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-600 leading-relaxed font-medium italic">
                {summaryLoading ? (
                  <div className="flex items-center gap-2.5 text-gray-400 text-xs py-1">
                    <span className="flex gap-1">
                      {[0, 150, 300].map(d => (
                        <span key={d} className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                          style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </span>
                    <span>Generating personalized analysis…</span>
                  </div>
                ) : summary}
              </div>
              <p className="text-[9px] text-gray-400 mt-3 px-1 leading-relaxed font-medium">
                ℹ️ Generated via Claude · Pricing benchmarks verified May 2026 · No credentials stored
              </p>
            </div>

            {/* ── PUBLIC VIEW CTA ── */}
            {isPublicView && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/form")}
                  className="w-full bg-[#032f24] text-white py-4 px-8 rounded-2xl font-black text-sm hover:opacity-95 transition shadow-sm"
                >
                  Audit Your Own Stack →
                </button>
                <p className="text-[10px] text-gray-400 mt-2.5 font-bold uppercase tracking-wider">
                  Free · Takes 3 minutes · Powered by Credex
                </p>
              </div>
            )}

            {/* ── OWNER: Start new audit ── */}
            {!isPublicView && (
              <div className="text-center pt-1">
                <button
                  onClick={() => { localStorage.removeItem("credexAuditForm"); navigate("/form"); }}
                  className="w-full bg-[#032f24] text-white py-3.5 rounded-2xl font-bold text-xs hover:opacity-90 transition"
                >
                  New Stack Audit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;