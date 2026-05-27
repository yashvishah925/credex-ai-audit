import { runAudit } from "../utils/auditEngine";
import { useNavigate } from "react-router-dom";

const CHECK_META = [
  {
    number: "01",
    label: "Plan Fit",
    desc: "Right plan for your seat count?",
    passColor: "text-[#059669]",
    failColor: "text-[#7c3aed]",
    badgeBgColor: "bg-[#059669]",
    badgeFailColor: "bg-[#7c3aed]",
    cardBorder: "border-emerald-100",
    cardFailBorder: "border-purple-100",
    headerBg: "bg-emerald-50/40",
    headerFailBg: "bg-purple-50/40",
  },
  {
    number: "02",
    label: "Same-Vendor Optimization",
    desc: "Cheaper plan from same vendor?",
    passColor: "text-[#059669]",
    failColor: "text-[#0369a1]",
    badgeBgColor: "bg-[#059669]",
    badgeFailColor: "bg-[#0369a1]",
    cardBorder: "border-emerald-100",
    cardFailBorder: "border-sky-100",
    headerBg: "bg-emerald-50/40",
    headerFailBg: "bg-sky-50/40",
  },
  {
    number: "03",
    label: "Alternative Tool Check",
    desc: "Cheaper equivalent available?",
    passColor: "text-[#059669]",
    failColor: "text-[#b45309]",
    badgeBgColor: "bg-[#059669]",
    badgeFailColor: "bg-[#b45309]",
    cardBorder: "border-emerald-100",
    cardFailBorder: "border-amber-100",
    headerBg: "bg-emerald-50/40",
    headerFailBg: "bg-amber-50/40",
  },
  {
    number: "04",
    label: "Retail vs Credits",
    desc: "Could credits reduce spend?",
    passColor: "text-[#059669]",
    failColor: "text-[#be123c]",
    badgeBgColor: "bg-[#059669]",
    badgeFailColor: "bg-[#be123c]",
    cardBorder: "border-emerald-100",
    cardFailBorder: "border-rose-100",
    headerBg: "bg-emerald-50/40",
    headerFailBg: "bg-rose-50/40",
  },
];

function ResultsPage() {
  const navigate = useNavigate();

  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem("credexAuditForm"));
    } catch {
      return null;
    }
  })();

  if (!saved?.tools || !saved?.company) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-3xl text-center w-full max-w-md shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-gray-950 mb-2">No Audit Data Found</h2>
          <p className="text-sm text-gray-500 mb-6">Please complete the inventory fields first.</p>
          <button
            onClick={() => navigate("/form")}
            className="w-full bg-[#032f24] text-white py-3.5 px-6 rounded-xl font-bold shadow-sm hover:opacity-95 transition"
          >
            Go To Form →
          </button>
        </div>
      </div>
    );
  }

  const audit = runAudit(saved.tools, saved.company);
  const { auditedTools, totalSavings, totalCurrentSpend, optimizedSpend } = audit;
  const annualSavings = totalSavings * 12;

  const totalChecks = auditedTools.reduce((sum, t) => sum + (t.checks || []).length, 0);
  const failingChecks = auditedTools.reduce((sum, t) => sum + (t.checks || []).filter(c => !c.passed).length, 0);

  return (
    <div className="min-h-screen bg-[#f5f7fc] py-12 px-4 sm:px-8 font-sans text-[#032b1f]">
      {/* Set max width to 5xl to give it identical cinematic scale as your landing section layout */}
      <div className="w-full max-w-5xl mx-auto space-y-10">

        {/* HERO METRICS SUMMARY PANEL */}
        <div className="bg-[#032f24] rounded-[32px] p-6 sm:p-10 text-white shadow-sm relative overflow-hidden text-center sm:text-left">
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #10b981 0%, transparent 60%)" }} />

          <div className="inline-flex items-center gap-1.5 bg-white/10 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold tracking-widest uppercase mb-4 relative z-10">
            ✦ Audit Engine · {auditedTools.length} Platform{auditedTools.length !== 1 ? "s" : ""} Checked
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight relative z-10">
            AI Spend Audit Results
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-2 relative z-10 font-medium">
            {failingChecks} of {totalChecks} checks flagged · {saved.company.teamSize} operators · {saved.company.useCase} focus
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 border-t border-white/10 pt-6 relative z-10">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-left">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Current Spend</p>
              <h2 className="text-xl sm:text-2xl font-black text-white tabular-nums">
                ${totalCurrentSpend.toLocaleString("en-US", { minimumFractionDigits: 0 })}<span className="text-xs font-semibold text-white/40 ml-0.5">/mo</span>
              </h2>
            </div>
            
            <div className="bg-[#10b981]/10 rounded-2xl p-4 border border-[#10b981]/20 text-left">
              <p className="text-[10px] font-bold tracking-widest text-emerald-300 uppercase mb-1">Monthly Savings</p>
              <h2 className="text-xl sm:text-2xl font-black text-[#10b981] tabular-nums">
                ${totalSavings.toLocaleString("en-US", { minimumFractionDigits: 0 })}<span className="text-xs font-semibold text-emerald-500/60 ml-0.5">/mo</span>
              </h2>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-left">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Annual Savings</p>
              <h2 className="text-xl sm:text-2xl font-black text-white tabular-nums">
                ${annualSavings.toLocaleString("en-US", { minimumFractionDigits: 0 })}<span className="text-xs font-semibold text-white/40 ml-0.5">/yr</span>
              </h2>
            </div>
          </div>
        </div>

        {/* SECTION CAPTION HEADER */}
        <div className="text-center max-w-2xl mx-auto px-2">
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            Each logged AI asset is sequentially evaluated across 4 core vectors: plan fit thresholds, same-vendor variations, tool replacement patterns, and third-party credit alternatives. Specific findings are organized down below.
          </p>
        </div>

        {/* STACK LIST BREAKDOWN RENDER ENGINE */}
        <div className="space-y-12">
          {auditedTools.map((tool, idx) => (
            <div key={idx} className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-8 text-left w-full">
              
              {/* ASYMMETRIC GRID LAYER: Auto stacks on mobile, changes to unbalanced 2-column sidebar format on laptops */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* COLUMN 1: STICKY TOOL IDENTITY BADGE BLOCK (NARROW LAYER) */}
                <div className="lg:col-span-1 lg:sticky lg:top-6 bg-[#f8fafc] border border-gray-100 rounded-2xl p-5 text-left">
                  <span className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-lg shadow-sm mb-4">
                    🤖
                  </span>
                  
                  <h2 className="text-2xl font-black tracking-tight text-gray-900 mb-2">{tool.name}</h2>
                  
                  <div className="space-y-2 border-t border-gray-200/60 pt-3 text-xs text-gray-500 font-semibold">
                    <div className="flex justify-between"><span>Plan Level:</span> <strong className="text-gray-700">{tool.plan}</strong></div>
                    <div className="flex justify-between"><span>Assigned Seats:</span> <strong className="text-gray-700">{tool.seats}</strong></div>
                    <div className="flex justify-between border-b border-gray-200/40 pb-2"><span>Monthly Spend:</span> <strong className="text-gray-700">${Number(tool.monthlySpend || 0).toFixed(2)}</strong></div>
                  </div>

                  <div className="mt-4">
                    {tool.savings > 0 ? (
                      <div className="bg-emerald-50 text-emerald-700 font-black text-[11px] px-3 py-2 rounded-xl border border-emerald-100 text-center tracking-wide uppercase">
                        Save ${tool.savings.toFixed(0)} / Month
                      </div>
                    ) : (
                      <div className="bg-gray-100 text-gray-400 font-bold text-[11px] px-3 py-2 rounded-xl text-center border border-gray-200/40 uppercase">
                        Fully Optimized ✓
                      </div>
                    )}
                  </div>
                </div>

                {/* COLUMN 2: VERTICAL SINGLE VECTOR LIST STREAM (WIDE LAYER) */}
                <div className="lg:col-span-2 space-y-4 w-full">
                  {(tool.checks || []).map((check, checkIdx) => {
                    const meta = CHECK_META[checkIdx];
                    const passed = check.passed;
                    const currentBg = passed ? meta.headerBg : meta.headerFailBg;
                    const currentBorder = passed ? meta.cardBorder : meta.cardFailBorder;
                    const currentColor = passed ? meta.passColor : meta.failColor;
                    const currentBadge = passed ? meta.badgeBgColor : meta.badgeFailColor;

                    return (
                      <div key={checkIdx} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm/5 w-full text-left">
                        
                        {/* Check Row Headers */}
                        <div className={`${currentBg} px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-7 h-7 rounded-full ${currentBadge} text-white flex items-center justify-center font-black text-xs shrink-0`}>
                              {passed ? "✓" : meta.number}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-xs sm:text-sm text-gray-900 leading-tight truncate">{meta.label}</p>
                              <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">{meta.desc}</p>
                            </div>
                          </div>
                          <span className={`bg-white border ${currentBorder} ${currentColor} px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider shrink-0`}>
                            {passed ? "PASSED" : "REVIEW REQUIRED"}
                          </span>
                        </div>

                        {/* Content Body Fields */}
                        <div className="p-4 sm:p-5 space-y-3 text-xs sm:text-sm font-medium border-t border-gray-50/20">
                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Finding</p>
                            <h4 className="font-black text-gray-900 text-sm leading-snug">{check.title}</h4>
                          </div>

                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Recommended Action</p>
                            <p className="text-gray-800 font-bold leading-relaxed text-xs sm:text-sm">{check.recommendation}</p>
                          </div>

                          <div className="pt-2 border-t border-gray-50/60">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Reasoning Matrix</p>
                            <p className="text-gray-400 font-normal leading-relaxed text-xs sm:text-sm italic">"{check.reason}"</p>
                          </div>

                          {check.savings > 0 && (
                            <div className="pt-1">
                              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5">
                                <span className="text-xs font-black text-emerald-800">
                                  💰 +${check.savings.toFixed(2)}/mo recovery room
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
              
            </div>
          ))}
        </div>

        {/* DYNAMIC NAVIGATION ACTION HOOK BUTTON */}
        <div className="pt-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => navigate("/summary")}
            className="w-full bg-[#032f24] text-white py-4 rounded-2xl font-black text-base shadow-sm hover:opacity-95 transition transform active:scale-[0.99] tracking-tight"
          >
            View Full Summary & AI Evaluation →
          </button>
          
          <p className="text-center mt-4 text-[10px] sm:text-xs text-gray-400 font-medium">
            Pricing benchmarks verified true May 2026 · 4 operational vector checks per tracking node · Deterministic calculation core
          </p>
        </div>

      </div>
    </div>
  );
}

export default ResultsPage;