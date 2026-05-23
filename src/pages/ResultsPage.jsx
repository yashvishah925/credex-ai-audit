import { runAudit } from "../utils/auditEngine";
import { useNavigate } from "react-router-dom";

const CHECK_META = [
  {
    number: "01",
    label: "Plan Fit",
    desc: "Right plan for team size?",
    passColor: "#059669",
    failColor: "#7c3aed",
    passBg: "#ecfdf5",
    failBg: "#f5f3ff",
    passBorder: "#a7f3d0",
    failBorder: "#ddd6fe",
  },
  {
    number: "02",
    label: "Same-Vendor Optimization",
    desc: "Cheaper plan, same vendor?",
    passColor: "#059669",
    failColor: "#0369a1",
    passBg: "#ecfdf5",
    failBg: "#f0f9ff",
    passBorder: "#a7f3d0",
    failBorder: "#bae6fd",
  },
  {
    number: "03",
    label: "Tool Overlap / Alternative",
    desc: "Redundant tools in stack?",
    passColor: "#059669",
    failColor: "#b45309",
    passBg: "#ecfdf5",
    failBg: "#fffbeb",
    passBorder: "#a7f3d0",
    failBorder: "#fde68a",
  },
  {
    number: "04",
    label: "Retail vs Credits",
    desc: "Paying above market rate?",
    passColor: "#059669",
    failColor: "#be123c",
    passBg: "#ecfdf5",
    failBg: "#fff1f2",
    passBorder: "#a7f3d0",
    failBorder: "#fecdd3",
  },
];

function ResultsPage() {
  const navigate = useNavigate();
  const saved = JSON.parse(localStorage.getItem("credexAuditForm"));
  const audit = runAudit(saved.tools, saved.company);
  const { totalSavings, annualSavings, auditedTools } = audit;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fa", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ─── DARK HERO ─── */}
      <div style={{ background: "#021a12", padding: "40px 24px 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#d1fae5", color: "#065f46",
            padding: "5px 14px", borderRadius: 999,
            fontSize: 12, fontWeight: 700, marginBottom: 20, letterSpacing: "0.03em"
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            Audit Engine Complete — 4 Checks Per Tool
          </div>

          <h1 style={{ fontSize: "clamp(28px, 5vw, 50px)", fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1.1 }}>
            AI Spend Audit Results
          </h1>
          <p style={{ color: "#6ee7b7", fontSize: 14, marginBottom: 28 }}>
            Each tool evaluated across: Plan Fit · Same-Vendor · Tool Overlap · Retail Pricing
          </p>

          {/* SAVINGS HERO */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, borderRadius: "20px 20px 0 0", overflow: "hidden" }}>
            <div style={{ background: "#fff", padding: "28px 32px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Total Monthly Savings</p>
              <p style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "#10b981", margin: 0, lineHeight: 1 }}>
                ${totalSavings.toFixed(2)}
              </p>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: "6px 0 0" }}>{auditedTools.length} tool{auditedTools.length !== 1 ? "s" : ""} audited</p>
            </div>
            <div style={{ background: "#10b981", padding: "28px 32px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#d1fae5", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Annual Savings Projection</p>
              <p style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1 }}>
                ${annualSavings.toFixed(2)}
              </p>
              <p style={{ fontSize: 12, color: "#d1fae5", margin: "6px 0 0" }}>If optimizations applied today</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>

        {/* ─── PER-TOOL CARDS ─── */}
        {auditedTools.map((tool, idx) => (
          <div key={idx} style={{
            background: "#fff", borderRadius: 20,
            border: "1.5px solid #e5e7eb",
            marginBottom: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            overflow: "hidden"
          }}>

            {/* Tool Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              flexWrap: "wrap", gap: 12,
              padding: "20px 24px",
              borderBottom: "1px solid #f3f4f6",
              background: tool.savings > 0 ? "#fffbf0" : "#f0fdf4"
            }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>
                  {tool.name}
                </h2>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>
                    Plan: <strong style={{ color: "#374151" }}>{tool.plan}</strong>
                  </span>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>
                    Seats: <strong style={{ color: "#374151" }}>{tool.seats}</strong>
                  </span>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>
                    Monthly spend: <strong style={{ color: "#374151" }}>${Number(tool.monthlySpend || 0).toFixed(2)}</strong>
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", margin: "0 0 4px", letterSpacing: "0.08em" }}>
                  Potential Monthly Savings
                </p>
                <p style={{ fontSize: 30, fontWeight: 900, color: tool.savings > 0 ? "#d97706" : "#10b981", margin: 0 }}>
                  ${tool.savings.toFixed(2)}
                </p>
              </div>
            </div>

            {/* ── 4 AUDIT CHECKS ── */}
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 14px" }}>
                Audit Engine — 4 Checks
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(tool.checks || []).map((check, checkIdx) => {
                  const meta = CHECK_META[checkIdx];
                  const passed = check.passed;
                  const bg = passed ? meta.passBg : meta.failBg;
                  const border = passed ? meta.passBorder : meta.failBorder;
                  const color = passed ? meta.passColor : meta.failColor;

                  return (
                    <div key={checkIdx} style={{
                      border: `1.5px solid ${border}`,
                      borderRadius: 14,
                      overflow: "hidden"
                    }}>
                      {/* Check header row */}
                      <div style={{
                        background: bg,
                        padding: "10px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 8
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {/* Check number badge */}
                          <span style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: passed ? "#10b981" : color,
                            color: "#fff", fontSize: 11, fontWeight: 900,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0
                          }}>
                            {passed ? "✓" : meta.number}
                          </span>
                          <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#111827" }}>
                              {meta.label}
                            </p>
                            <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>
                              {meta.desc}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          {/* Status pill */}
                          <span style={{
                            background: passed ? "#d1fae5" : bg,
                            color: passed ? "#065f46" : color,
                            border: `1px solid ${border}`,
                            padding: "3px 12px", borderRadius: 999,
                            fontSize: 11, fontWeight: 800
                          }}>
                            {passed ? "✓ PASSED" : "⚠ ISSUE FOUND"}
                          </span>
                          {/* Savings pill */}
                          {!passed && check.savings > 0 && (
                            <span style={{
                              background: "#fef3c7", color: "#92400e",
                              border: "1px solid #fde68a",
                              padding: "3px 12px", borderRadius: 999,
                              fontSize: 11, fontWeight: 800
                            }}>
                              Save ${check.savings.toFixed(2)}/mo
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Check body */}
                      <div style={{ padding: "14px 16px", background: "#fff" }}>
                        <div style={{ marginBottom: 10 }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>
                            Finding
                          </p>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>
                            {check.title}
                          </p>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>
                            Recommended Action
                          </p>
                          <p style={{ fontSize: 13, fontWeight: 600, color: passed ? "#065f46" : "#111827", margin: 0 }}>
                            {check.recommendation}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>
                            Reasoning
                          </p>
                          <p style={{ fontSize: 13, color: "#4b5563", margin: 0, lineHeight: 1.6 }}>
                            {check.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Per-tool savings summary bar */}
            {tool.savings > 0 && (
              <div style={{
                background: "#fffbeb",
                borderTop: "1px solid #fde68a",
                padding: "14px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8
              }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#92400e" }}>
                  💡 Current spend: <strong>${Number(tool.monthlySpend || 0).toFixed(2)}/mo</strong>
                  &nbsp;→&nbsp;
                  Optimized: <strong>${tool.optimizedSpend.toFixed(2)}/mo</strong>
                </p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: "#b45309" }}>
                  Save ${tool.savings.toFixed(2)}/mo · ${(tool.savings * 12).toFixed(2)}/yr
                </p>
              </div>
            )}
          </div>
        ))}

        {/* ─── CREDEX BANNER (>$500 savings) ─── */}
        {totalSavings > 500 && (
          <div style={{
            background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
            borderRadius: 20, padding: "36px 36px",
            marginBottom: 24, position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ position: "relative" }}>
              <div style={{
                display: "inline-flex", gap: 6, alignItems: "center",
                background: "rgba(255,255,255,0.15)", color: "#fff",
                padding: "4px 14px", borderRadius: 999,
                fontSize: 11, fontWeight: 700, marginBottom: 14, letterSpacing: "0.05em"
              }}>
                🏦 HIGH-IMPACT SAVINGS IDENTIFIED
              </div>
              <h2 style={{ fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 900, color: "#fff", margin: "0 0 10px" }}>
                Capture ${totalSavings.toFixed(2)}/mo in Savings With Credex
              </h2>
              <p style={{ color: "#bfdbfe", fontSize: 14, lineHeight: 1.7, margin: "0 0 22px", maxWidth: 520 }}>
                Your audit identified <strong style={{ color: "#fff" }}>${annualSavings.toFixed(2)}/yr in AI procurement waste</strong>.
                Credex centralizes vendor negotiations, eliminates duplicate tool spend,
                and optimizes enterprise credit structures — capturing savings that internal teams typically miss.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button style={{
                  background: "#fff", color: "#1d4ed8",
                  padding: "13px 26px", borderRadius: 12,
                  fontWeight: 900, fontSize: 14, border: "none", cursor: "pointer"
                }}>Book Optimization Review →</button>
                <button style={{
                  background: "rgba(255,255,255,0.1)", color: "#fff",
                  padding: "13px 26px", borderRadius: 12,
                  fontWeight: 700, fontSize: 14,
                  border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer"
                }}>Download Full Report</button>
              </div>
            </div>
          </div>
        )}

        {/* ─── EFFICIENT BANNER (<$100 savings) ─── */}
        {totalSavings < 100 && (
          <div style={{
            background: "#fff", borderRadius: 20,
            border: "1.5px solid #a7f3d0",
            padding: "32px 36px", marginBottom: 24
          }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: "#ecfdf5",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0
              }}>✅</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: "#032b22", margin: "0 0 8px" }}>
                  You're Spending Efficiently
                </h2>
                <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7, margin: "0 0 18px" }}>
                  Your AI stack passed all 4 audit checks with minimal optimization opportunities.
                  No structural overspend detected against official May 2026 pricing.
                  We'll monitor for new opportunities as vendor pricing evolves.
                </p>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <button style={{
                    background: "#032f24", color: "#fff",
                    padding: "12px 22px", borderRadius: 12,
                    fontWeight: 800, fontSize: 13, border: "none", cursor: "pointer"
                  }}>
                    Notify Me When New Optimizations Apply →
                  </button>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>Free · No commitment</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── GENERATE SUMMARY ─── */}
        <button
          onClick={() => navigate("/summary")}
          style={{
            width: "100%", background: "#032f24", color: "#fff",
            padding: "17px", borderRadius: 14,
            fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer"
          }}
        >
          Generate AI Summary →
        </button>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 14 }}>
          Pricing sourced from official vendor pages · Verified May 2026 · See PRICING_DATA.md for all sources
        </p>
      </div>
    </div>
  );
}

export default ResultsPage;
