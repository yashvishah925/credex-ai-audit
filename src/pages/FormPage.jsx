import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pricingData } from "../data/pricingData";

function FormPage() {
  const navigate = useNavigate();

  /*
    LOAD LOCAL STORAGE
  */
  const savedForm = JSON.parse(
    localStorage.getItem("credexAuditForm")
  );

  const [company, setCompany] = useState(
    savedForm?.company || {
      teamSize: "",
      useCase: "coding"
    }
  );

  const [tools, setTools] = useState(
    savedForm?.tools || [
      {
        name: "ChatGPT",
        plan: "Plus",
        monthlySpend: "",
        seats: 1
      }
    ]
  );

  /*
    PERSIST EVERYTHING
  */
  useEffect(() => {
    localStorage.setItem(
      "credexAuditForm",
      JSON.stringify({
        company,
        tools
      })
    );
  }, [company, tools]);

  /*
    TOOL UPDATE
  */
  function updateTool(index, field, value) {
    const updated = [...tools];
    updated[index][field] = value;

    /*
      AUTO UPDATE PLAN
    */
    if (field === "name") {
      const plans = Object.keys(
        pricingData[value]
      );
      updated[index].plan = plans[0];
    }

    setTools(updated);
  }

  /*
    ADD TOOL
  */
  function addTool() {
    setTools([
      ...tools,
      {
        name: "ChatGPT",
        plan: "Plus",
        monthlySpend: "",
        seats: 1
      }
    ]);
  }

  /*
    REMOVE TOOL
  */
  function removeTool(index) {
    const updated = tools.filter(
      (_, i) => i !== index
    );
    setTools(updated);
  }

  /*
    SUBMIT
  */
  async function handleSubmit(e) {
  e.preventDefault();

  try {
    const publicId = Date.now().toString();

    const totalSavings = tools.reduce((sum, tool) => {
      return sum + Number(tool.monthlySpend || 0);
    }, 0);

    const { error } = await supabase
      .from("leads")
      .insert([
        {
          email: "demo@credex.ai",
          company: company.useCase,
          role: "Founder",
          team_size: company.teamSize,
          monthly_savings: totalSavings,
          public_id: publicId,
          audit_data: { company, tools }
        }
      ]);

    if (error) {
      console.error(error);
      alert("Failed to save audit: " + error.message);
      return;
    }

    localStorage.setItem("publicAuditId", publicId);

    // ✅ FIXED: wrapped so a missing API route doesn't crash the flow
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        
          savings: totalSavings
        })
      });
    } catch (emailErr) {
      console.warn("Email failed, continuing:", emailErr);
    }

    navigate("/audit");

  } catch (err) {
    console.error(err);
    alert("Error: " + err.message); // temporary — shows real error
  }
}
  return (
    <div className="min-h-screen bg-[#f5f7fc] text-[#032b1f] px-6 sm:px-12 py-16 font-sans">
      <div className="w-full max-w-5xl mx-auto">

        {/* HEADER BLOCK */}
        <header className="text-center mb-16">
          <div className="bg-[#d9f5df] text-[#0b5d3b] px-5 py-2 rounded-full text-sm font-medium inline-block mx-auto mb-4">
            Step 1 of 2: Inventory Architecture Mapping
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#032b22] tracking-tight mt-2">
            AI Spend Inventory
          </h1>
          <p className="text-gray-500 mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Audit your organization's active AI software layers, isolate seat redundancy thresholds, and identify immediate cost-remediation channels.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* COMPANY PROFILE DESIGN LAYER */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-gray-100 shadow-sm text-left">
            <h2 className="text-2xl font-black mb-2 tracking-tight text-gray-900">
              Company Profile
            </h2>
            <p className="text-sm text-gray-400 mb-6 font-medium">Configure global organizational variables to scale optimization recommendations.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block mb-2.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Team Size
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Total headcount accessing AI tiers"
                  value={company.teamSize}
                  onChange={(e) =>
                    setCompany({
                      ...company,
                      teamSize: e.target.value
                    })
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#032f24] transition bg-gray-50/20 font-medium"
                />
              </div>

              <div>
                <label className="block mb-2.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Primary Use Case
                </label>
                <select
                  value={company.useCase}
                  onChange={(e) =>
                    setCompany({
                      ...company,
                      useCase: e.target.value
                    })
                  }
                  className="w-full border border-gray-200 bg-white rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#032f24] transition font-medium text-gray-700"
                >
                  <option value="coding">Coding</option>
                  <option value="writing">Writing</option>
                  <option value="research">Research</option>
                  <option value="data">Data</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>
          </div>

          {/* DYNAMIC TOOLS GRID PANEL */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-black tracking-tight text-gray-900">Active Allocations</h3>
              <span className="text-xs font-bold text-[#0b5d3b] bg-[#d9f5df] px-3.5 py-1.5 rounded-full uppercase tracking-wider">{tools.length} Logged</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[32px] p-6 sm:p-8 border border-gray-100 shadow-sm text-left flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-400">
                          #{index + 1}
                        </div>
                        <h4 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider">Subscription Tier</h4>
                      </div>

                      {tools.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTool(index)}
                          className="text-xs font-bold text-red-400 hover:text-red-600 transition p-1"
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            AI Tool
                          </label>
                          <select
                            value={tool.name}
                            onChange={(e) =>
                              updateTool(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 text-xs sm:text-sm outline-none text-gray-700 font-semibold"
                          >
                            {Object.keys(pricingData).map((name) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Plan
                          </label>
                          <select
                            value={tool.plan}
                            onChange={(e) =>
                              updateTool(
                                index,
                                "plan",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 text-xs sm:text-sm outline-none text-gray-700 font-semibold"
                          >
                            {Object.keys(
                              pricingData[tool.name]
                            ).map((plan) => (
                              <option key={plan} value={plan}>
                                {plan}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Monthly Spend ($)
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            placeholder="0.00"
                            value={tool.monthlySpend}
                            onChange={(e) =>
                              updateTool(
                                index,
                                "monthlySpend",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-xs sm:text-sm outline-none focus:border-[#032f24] transition font-bold"
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Seats
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={tool.seats}
                            onChange={(e) =>
                              updateTool(
                                index,
                                "seats",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-xs sm:text-sm outline-none focus:border-[#032f24] transition font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* DASHED REPEATER ADD CARD BUTTON */}
              <button
                type="button"
                onClick={addTool}
                className="w-full min-h-[220px] border-2 border-dashed border-gray-200 hover:border-gray-400 bg-white/40 text-gray-500 rounded-[32px] p-8 flex flex-col items-center justify-center gap-2 font-bold text-sm transition active:scale-[0.99]"
              >
                <span className="text-2xl bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 border border-gray-200">+</span>
                Add Another AI Platform Layer
              </button>
            </div>
          </div>

          {/* MASTER ACTIONS FOOTER BUTTON */}
          <div className="pt-4 max-w-md mx-auto">
            <button
              type="submit"
              className="w-full bg-[#003d2b] hover:opacity-95 text-white py-5 rounded-2xl font-black text-lg shadow-md tracking-tight transition transform active:scale-[0.99]"
            >
              Run AI Spend Audit Engine →
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default FormPage;
