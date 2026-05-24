import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { runAudit } from "../utils/auditEngine";

function SummaryPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // ── READ FROM CORRECT KEY (FormPage saves to "credexAuditForm") ──
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem("credexAuditForm"));
    } catch {
      return null;
    }
  })();

  if (!saved?.tools || !saved?.company) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-5 font-sans">
        <div className="bg-white p-10 rounded-3xl text-center w-full max-w-md shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-[#032b1f]">No Audit Data Found</h2>
          <p className="text-sm text-gray-500 mt-2">Please complete the inventory inputs first.</p>
          <button
            onClick={() => navigate("/form")}
            className="mt-6 bg-[#032f24] text-white border-none py-3.5 px-6 rounded-2xl font-bold hover:opacity-90 transition active:scale-[0.99] w-full"
          >
            Back To Form
          </button>
        </div>
      </div>
    );
  }

  const audit = runAudit(saved.tools, saved.company);
  const { auditedTools, totalSavings, totalCurrentSpend, optimizedSpend } = audit;
  const annualSavings = totalSavings * 12;

  // ── SAVINGS TIER: >$500 = Credex CTA | <$100 = honest "spending well" | middle = neutral ──
  const savingsTier = totalSavings >= 500 ? "high" : totalSavings < 100 ? "low" : "mid";

  // ── FALLBACK SUMMARY (used if API fails) ──
  const fallbackSummary = `Your organization is running ${auditedTools.length} AI subscription${auditedTools.length !== 1 ? "s" : ""} at $${totalCurrentSpend.toFixed(2)}/month. Our audit identified ${totalSavings > 0 ? `$${totalSavings.toFixed(2)}/month in optimization opportunities` : "no material overspend"} through ${totalSavings > 0 ? "plan tier adjustments and redundancy elimination" : "your current lean configuration"}. ${totalSavings > 0 ? `Implementing the recommended changes reduces your baseline to $${optimizedSpend.toFixed(2)}/month — a $${annualSavings.toFixed(2)} annual recovery — while preserving equivalent model access and team productivity.` : "Your stack is well-configured for your team size and use case. We recommend monitoring quarterly as vendor pricing continues to shift."}`;

  useEffect(() => {
    async function fetchAISummary() {
      try {
        const toolsSummary = auditedTools
          .map(t => `${t.name} (${t.plan}, ${t.seats} seat${t.seats !== 1 ? "s" : ""}, $${Number(t.monthlySpend || 0).toFixed(2)}/mo${t.savings > 0 ? `, save $${t.savings.toFixed(2)}/mo` : ""})`)
          .join("; ");

        const prompt = `You are a financial analyst writing a concise executive summary for an AI software spend audit report. Write exactly one paragraph of approximately 100 words. Be specific with dollar figures. Be honest — if savings are minimal, say so without manufacturing false urgency. Avoid filler phrases like "it's worth noting" or "in conclusion".

Audit data:
- Total monthly spend: $${totalCurrentSpend.toFixed(2)}
- Optimized monthly spend: $${optimizedSpend.toFixed(2)}
- Monthly savings identified: $${totalSavings.toFixed(2)}
- Annual savings identified: $${annualSavings.toFixed(2)}
- Tools audited: ${toolsSummary}
- Primary use case: ${saved.company.useCase}
- Team size: ${saved.company.teamSize}

Write the summary paragraph now:`;

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 200,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) throw new Error(`API error ${response.status}`);

        const data = await response.json();
        const text = data?.content?.[0]?.text?.trim();
        if (text) {
          setSummary(text);
        } else {
          setSummary(fallbackSummary);
        }
      } catch (err) {
        console.warn("AI summary fallback triggered:", err.message);
        setSummary(fallbackSummary);
      } finally {
        setLoading(false);
      }
    }

    fetchAISummary();
  }, []);

  function handleEmailSubmit() {
    if (!email || !email.includes("@")) return;
    // In production, POST to your backend here
    console.log("Lead captured:", email);
    setEmailSent(true);
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] py-8 px-4 font-sans text-[#032b1f]">
      <div className="max-w-2xl mx-auto">

        {/* ── HERO: SAVINGS NUMBERS ── */}
        <div className="bg-[#032f24] rounded-[32px] p-7 sm:p-10 text-white mb-6 shadow-lg relative overflow-hidden">
          {/* subtle background texture */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #10b981 0%, transparent 60%)" }} />

          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-widest uppercase mb-5 relative z-10">
            ✦ AI Spend Audit Report
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight relative z-10">
            Your Optimization Summary
          </h1>
          <p className="text-white/60 text-sm mt-2 relative z-10">
            {auditedTools.length} tool{auditedTools.length !== 1 ? "s" : ""} audited · {saved.company.teamSize} person team · {saved.company.useCase} workflows
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8 border-t border-white/10 pt-6 relative z-10">
            <div className="bg-white/5 rounded-2xl p-5 text-left border border-white/5">
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-300 block mb-1">
                Monthly Savings
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#10b981] tabular-nums">
                ${totalSavings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 text-left border border-white/5">
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-300 block mb-1">
                Annual Savings
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tabular-nums">
                ${annualSavings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h2>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs text-white/40 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Current spend ${totalCurrentSpend.toFixed(2)}/mo → Optimized ${optimizedSpend.toFixed(2)}/mo
          </div>
        </div>

        {/* ── PER-TOOL BREAKDOWN ── */}
        <div className="space-y-3 mb-6">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1 text-left mb-3">
            Per-Tool Breakdown
          </h3>

          {auditedTools.map((tool, idx) => {
            // Find the single highest-impact failing check for the 1-sentence reason
            const failingChecks = (tool.checks || []).filter(c => !c.passed && c.savings > 0);
            const topCheck = failingChecks.sort((a, b) => b.savings - a.savings)[0];
            const anyFail = (tool.checks || []).some(c => !c.passed);

            // Determine recommended action label
            let actionLabel = "No changes needed";
            if (topCheck) {
              actionLabel = topCheck.recommendation.split("→")[0]?.trim() || topCheck.title;
              if (actionLabel.length > 60) actionLabel = actionLabel.slice(0, 57) + "…";
            } else if (anyFail) {
              const nonSavingsFail = (tool.checks || []).find(c => !c.passed);
              actionLabel = nonSavingsFail?.title?.slice(0, 57) + "…" || "Review recommended";
            }

            // 1-sentence reason: first sentence of the top check reason
            const rawReason = topCheck?.reason || (tool.checks || []).find(c => !c.passed)?.reason || "This tool is correctly configured for your team size and use case.";
            const oneLineReason = rawReason.split(/(?<=[.!?])\s+/)[0] || rawReason;

            return (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Tool header row */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-base">🤖</div>
                    <div>
                      <p className="font-black text-[15px] text-gray-900 leading-none">{tool.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{tool.plan} · {tool.seats} seat{Number(tool.seats) !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  {tool.savings > 0 ? (
                    <span className="bg-emerald-50 text-emerald-700 font-black text-[11px] px-3 py-1 rounded-full border border-emerald-100 whitespace-nowrap">
                      Save ${tool.savings.toFixed(0)}/mo
                    </span>
                  ) : (
                    <span className="bg-gray-50 text-gray-400 font-bold text-[11px] px-3 py-1 rounded-full border border-gray-100">
                      Optimal
                    </span>
                  )}
                </div>

                {/* Data row: spend → action → savings */}
                <div className="grid grid-cols-3 divide-x divide-gray-50 text-center">
                  <div className="px-3 py-3.5">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Current Spend</p>
                    <p className="text-sm font-black text-gray-800">${Number(tool.monthlySpend || 0).toFixed(2)}<span className="text-[10px] font-medium text-gray-400">/mo</span></p>
                  </div>
                  <div className="px-3 py-3.5">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Recommended Action</p>
                    <p className={`text-[11px] font-bold leading-tight ${tool.savings > 0 ? "text-emerald-700" : "text-gray-600"}`}>{actionLabel}</p>
                  </div>
                  <div className="px-3 py-3.5">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Monthly Impact</p>
                    <p className={`text-sm font-black ${tool.savings > 0 ? "text-emerald-600" : "text-gray-400"}`}>
                      {tool.savings > 0 ? `-$${tool.savings.toFixed(2)}` : "—"}
                    </p>
                  </div>
                </div>

                {/* 1-sentence reason */}
                <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-50">
                  <p className="text-[11px] text-gray-500 leading-relaxed italic">"{oneLineReason}"</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CTA BLOCK: SAVINGS-TIER CONDITIONAL ── */}
        {savingsTier === "high" && (
          /* >$500/mo savings → Credex prominently */
          <div className="rounded-3xl mb-6 overflow-hidden shadow-lg border border-blue-800/20">
            <div className="bg-gradient-to-br from-[#0f1f6e] to-[#0d0d2b] p-6 sm:p-8 text-white text-left">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center text-xl flex-shrink-0">🎯</div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-blue-300 mb-1">High Savings Detected</p>
                  <h4 className="text-xl font-black tracking-tight leading-snug">
                    You're leaving ${totalSavings.toFixed(0)}/mo on the table.<br />
                    <span className="text-blue-300">Credex can recover it faster.</span>
                  </h4>
                </div>
              </div>
              <p className="text-sm text-blue-200/80 leading-relaxed mb-1">
                At <span className="text-white font-bold">${annualSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })}/year</span> in identified savings, your stack qualifies for Credex's enterprise optimization program — negotiated credits, consolidated billing, and vendor-matched alternatives that go beyond what a self-serve audit captures.
              </p>
              <p className="text-xs text-blue-300/60 mb-6">Corporate credit programs up to $100,000 · No commitment required</p>
              <button
                type="button"
                onClick={() => window.open("https://credex.rocks", "_blank")}
                className="w-full bg-white text-[#0f1f6e] py-4 rounded-2xl text-sm font-black shadow-xl hover:bg-blue-50 transition active:scale-[0.99] tracking-tight"
              >
                Schedule Free Credex Consultation →
              </button>
              <p className="text-[10px] text-blue-300/40 text-center mt-3">Takes 2 minutes · No credit card · Talk to a human analyst</p>
            </div>
          </div>
        )}

        {savingsTier === "low" && (
          /* <$100/mo savings → honest, no manufactured urgency, lead capture */
          <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-6 text-left shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✅</span>
              <h4 className="font-black text-gray-900 text-base">You're spending well.</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-1">
              Your AI stack is lean and appropriately configured for a {saved.company.teamSize}-person team doing {saved.company.useCase} work.
              {totalSavings > 0 ? ` We found $${totalSavings.toFixed(2)}/mo in minor optimizations above, but no structural overspend.` : " We found no structural overspend."}
            </p>
            <p className="text-xs text-gray-400 mt-1 mb-5">
              Vendor pricing shifts frequently. We'll notify you if a better option appears for your stack.
            </p>
            {emailSent ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl py-3.5 px-5 text-center">
                <p className="text-sm font-black text-emerald-700">✓ You're on the list. We'll reach out when something changes.</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50 focus:border-[#032f24] transition grow"
                />
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  className="bg-[#032f24] text-white text-sm font-bold px-5 py-3 rounded-xl hover:opacity-95 transition tracking-wide shadow-sm whitespace-nowrap"
                >
                  Notify Me
                </button>
              </div>
            )}
          </div>
        )}

        {savingsTier === "mid" && (
          /* $100–$500 savings → show savings, soft Credex mention + lead capture */
          <div className="bg-white border border-gray-100 rounded-3xl p-6 mb-6 shadow-sm text-left">
            <p className="text-[11px] uppercase font-black text-gray-400 tracking-widest mb-2">Next Step</p>
            <h4 className="font-black text-gray-900 text-base mb-2">Implement the changes above and save ${annualSavings.toFixed(0)}/year.</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              The optimizations identified are self-serve — billing plan changes and seat adjustments you can make today. Get notified when new opportunities appear for your stack.
            </p>
            {emailSent ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl py-3.5 px-5 text-center">
                <p className="text-sm font-black text-emerald-700">✓ Saved. We'll track pricing changes for your stack.</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Work email for stack monitoring"
                  className="border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none bg-gray-50 focus:border-[#032f24] transition grow"
                />
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  className="bg-[#032f24] text-white text-xs font-bold px-5 py-3 rounded-xl hover:opacity-95 transition tracking-wide shadow-sm whitespace-nowrap"
                >
                  Track My Stack
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── AI SUMMARY CARD ── */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-100 shadow-sm text-left">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-xl bg-[#032f24]/10 flex items-center justify-center text-sm">✦</div>
            <h2 className="text-lg font-black tracking-tight text-gray-900">
              AI Financial Evaluation
            </h2>
          </div>

          <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 text-sm text-gray-700 leading-7 font-medium min-h-[80px]">
            {loading ? (
              <div className="flex items-center gap-2.5 text-gray-400 text-xs py-2">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </span>
                <span>Generating personalized summary…</span>
              </div>
            ) : (
              <p>{summary}</p>
            )}
          </div>

          <p className="text-[10px] text-gray-400 mt-3 px-1 leading-relaxed">
            ℹ️ Generated by Claude using verified May 2026 pricing data. Summary reflects audit findings only — no data is stored.
          </p>
        </div>

        {/* ── BACK / RESTART ── */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate("/audit")}
            className="flex-1 border border-gray-200 bg-white text-gray-600 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-50 transition"
          >
            ← Back to Audit Detail
          </button>
          <button
            onClick={() => { localStorage.removeItem("credexAuditForm"); navigate("/form"); }}
            className="flex-1 bg-[#032f24] text-white py-3.5 rounded-2xl font-bold text-sm hover:opacity-90 transition"
          >
            New Audit
          </button>
        </div>

      </div>
    </div>
  );
}

export default SummaryPage;
