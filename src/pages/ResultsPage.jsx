import { runAudit } from "../utils/auditEngine";
import { useNavigate } from "react-router-dom";

const CHECK_META = [
  {
    number: "01",
    label: "Plan Fit",
    desc: "Right plan for your seat count?",
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
    desc: "Cheaper plan from same vendor?",
    passColor: "#059669",
    failColor: "#0369a1",
    passBg: "#ecfdf5",
    failBg: "#f0f9ff",
    passBorder: "#a7f3d0",
    failBorder: "#bae6fd",
  },
  {
    number: "03",
    label: "Alternative Tool Check",
    desc: "Cheaper equivalent available?",
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
    desc: "Could credits reduce spend?",
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

  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem("credexAuditForm"));
    } catch {
      return null;
    }
  })();

  if (!saved?.tools || !saved?.company) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f4f6fa",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "system-ui, sans-serif", padding: 24,
      }}>
        <div style={{
          background: "#fff", padding: 40, borderRadius: 20,
          textAlign: "center", maxWidth: 420, width: "100%",
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12, color: "#111827" }}>
            No Audit Data Found
          </h2>
          <p style={{ color: "#6b7280", marginBottom: 24 }}>
            Please complete the form first.
          </p>
          <button
            onClick={() => navigate("/form")}
            style={{
              background: "#032f24", color: "#fff",
              padding: "14px 24px", borderRadius: 12,
              border: "none", fontWeight: 800, cursor: "pointer",
            }}
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
    <div style={{
      minHeight: "100vh", background: "#f4f6fa",
      padding: "32px 16px", fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* ── HERO SAVINGS BANNER ── */}
        <div style={{
          background: "#032f24", borderRadius: 28,
          padding: "32px 28px", marginBottom: 28, color: "#fff",
          position: "relative", overflow: "hidden",
        }}>
          {/* subtle glow */}
          <div style={{
            position: "absolute", top: -40, right: -40,
            width: 220, height: 220, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.1)", padding: "5px 14px",
            borderRadius: 999, fontSize: 11, fontWeight: 800,
            letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18,
          }}>
            ✦ Audit Engine · {auditedTools.length} Tool{auditedTools.length !== 1 ? "s" : ""} Analyzed
          </div>

          <h1 style={{
            fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 900,
            lineHeight: 1.1, marginBottom: 6, position: "relative", zIndex: 1,
          }}>
            AI Spend Audit Results
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 24 }}>
            {failingChecks} of {totalChecks} checks flagged · {saved.company.teamSize}-person team · {saved.company.useCase}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div style={{
              background: "rgba(255,255,255,0.05)", borderRadius: 18,
              padding: "18px 16px", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
                Current Spend
              </p>
              <p style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>
                ${totalCurrentSpend.toFixed(0)}<span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>/mo</span>
              </p>
            </div>
            <div style={{
              background: "rgba(16,185,129,0.12)", borderRadius: 18,
              padding: "18px 16px", border: "1px solid rgba(16,185,129,0.2)",
            }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6ee7b7", marginBottom: 6 }}>
                Monthly Savings
              </p>
              <p style={{ fontSize: 26, fontWeight: 900, color: "#10b981" }}>
                ${totalSavings.toFixed(0)}<span style={{ fontSize: 13, fontWeight: 600, color: "rgba(16,185,129,0.6)" }}>/mo</span>
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.05)", borderRadius: 18,
              padding: "18px 16px", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
                Annual Savings
              </p>
              <p style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>
                ${annualSavings.toFixed(0)}<span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>/yr</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── PAGE LABEL ── */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7 }}>
            Each tool is evaluated across 4 checks: plan fit, same-vendor optimization, alternative tools, and retail pricing. Findings and recommended actions are below.
          </p>
        </div>

        {/* ── TOOL AUDITS ── */}
        {auditedTools.map((tool, idx) => (
          <div key={idx} style={{
            background: "#fff", borderRadius: 24,
            border: "1px solid #e5e7eb", marginBottom: 24,
            overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}>
            {/* Tool header */}
            <div style={{
              padding: "18px 22px", borderBottom: "1px solid #f3f4f6",
              background: "#fafafa",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
            }}>
              <div>
                <h2 style={{ fontSize: "clamp(20px, 3.5vw, 26px)", fontWeight: 900, color: "#111827", marginBottom: 6 }}>
                  {tool.name}
                </h2>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {[
                    ["Plan", tool.plan],
                    ["Seats", tool.seats],
                    ["Spend", `$${Number(tool.monthlySpend || 0).toFixed(2)}/mo`],
                  ].map(([label, val]) => (
                    <span key={label} style={{ fontSize: 13, color: "#6b7280" }}>
                      {label}: <strong style={{ color: "#111827" }}>{val}</strong>
                    </span>
                  ))}
                </div>
              </div>
              {tool.savings > 0 ? (
                <div style={{
                  background: "#ecfdf5", color: "#065f46",
                  border: "1px solid #a7f3d0", borderRadius: 999,
                  padding: "6px 14px", fontSize: 13, fontWeight: 800,
                }}>
                  Save ${tool.savings.toFixed(2)}/mo
                </div>
              ) : (
                <div style={{
                  background: "#f9fafb", color: "#6b7280",
                  border: "1px solid #e5e7eb", borderRadius: 999,
                  padding: "6px 14px", fontSize: 13, fontWeight: 700,
                }}>
                  Optimized ✓
                </div>
              )}
            </div>

            {/* Checks */}
            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
              {(tool.checks || []).map((check, checkIdx) => {
                const meta = CHECK_META[checkIdx];
                const passed = check.passed;
                const bg = passed ? meta.passBg : meta.failBg;
                const border = passed ? meta.passBorder : meta.failBorder;
                const color = passed ? meta.passColor : meta.failColor;

                return (
                  <div key={checkIdx} style={{
                    border: `1.5px solid ${border}`, borderRadius: 16, overflow: "hidden",
                  }}>
                    {/* Check header */}
                    <div style={{
                      background: bg, padding: "12px 16px",
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", gap: 12, flexWrap: "wrap",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: color, color: "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 900, fontSize: 12, flexShrink: 0,
                        }}>
                          {passed ? "✓" : meta.number}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 800, color: "#111827", fontSize: 13 }}>
                            {meta.label}
                          </p>
                          <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>
                            {meta.desc}
                          </p>
                        </div>
                      </div>
                      <span style={{
                        background: "#fff", border: `1px solid ${border}`,
                        color, padding: "4px 11px", borderRadius: 999,
                        fontSize: 10, fontWeight: 800, letterSpacing: "0.05em",
                      }}>
                        {passed ? "PASSED" : "REVIEW REQUIRED"}
                      </span>
                    </div>

                    {/* Check body */}
                    <div style={{ padding: "14px 16px", background: "#fff" }}>
                      <div style={{ marginBottom: 12 }}>
                        <p style={{
                          fontSize: 10, color: "#9ca3af", fontWeight: 700,
                          textTransform: "uppercase", marginBottom: 3,
                        }}>Finding</p>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827" }}>
                          {check.title}
                        </p>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <p style={{
                          fontSize: 10, color: "#9ca3af", fontWeight: 700,
                          textTransform: "uppercase", marginBottom: 3,
                        }}>Recommended Action</p>
                        <p style={{ margin: 0, fontSize: 13, color: "#111827", lineHeight: 1.65 }}>
                          {check.recommendation}
                        </p>
                      </div>

                      <div>
                        <p style={{
                          fontSize: 10, color: "#9ca3af", fontWeight: 700,
                          textTransform: "uppercase", marginBottom: 3,
                        }}>Reasoning</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#4b5563", lineHeight: 1.7 }}>
                          {check.reason}
                        </p>
                      </div>

                      {check.savings > 0 && (
                        <div style={{
                          marginTop: 12, display: "inline-flex", alignItems: "center",
                          gap: 6, background: "#ecfdf5", border: "1px solid #a7f3d0",
                          borderRadius: 8, padding: "5px 10px",
                        }}>
                          <span style={{ fontSize: 11, fontWeight: 900, color: "#065f46" }}>
                            💰 ${check.savings.toFixed(2)}/mo potential savings
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* ── BOTTOM CTA ── */}
        <button
          onClick={() => navigate("/results")}
          style={{
            width: "100%", background: "#032f24", color: "#fff",
            padding: "18px", borderRadius: 16, fontWeight: 900,
            fontSize: "clamp(14px, 2.5vw, 17px)", border: "none",
            cursor: "pointer", marginTop: 8, transition: "0.2s",
            boxShadow: "0 4px 24px rgba(3,47,36,0.25)",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#04382b"}
          onMouseLeave={e => e.currentTarget.style.background = "#032f24"}
        >
          View Full Summary & AI Evaluation →
        </button>

        <p style={{
          textAlign: "center", marginTop: 14,
          fontSize: 11, color: "#9ca3af",
        }}>
          Pricing verified May 2026 · 4 checks per tool · Deterministic audit engine
        </p>
      </div>
    </div>
  );
}

export default ResultsPage;
