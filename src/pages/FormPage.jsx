import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 1. Rigorous data maps explicitly matching the MVP criteria requirements
const toolsData = {
  Cursor: ["Hobby", "Pro", "Business", "Enterprise"],
  "GitHub Copilot": ["Individual", "Business", "Enterprise"],
  Claude: ["Free", "Pro", "Max", "Team", "Enterprise", "API direct"],
  ChatGPT: ["Plus", "Team", "Enterprise", "API direct"],
  "Anthropic API direct": ["API direct"],
  "OpenAI API direct": ["API direct"],
  Gemini: ["Pro", "Ultra", "API"],
  v0: ["Free", "Premium", "Enterprise"]
};

const defaultToolInstance = {
  tool: "",
  plan: "",
  spend: "",
  seats: ""
};

function FormPage() {
  const navigate = useNavigate();

  // 2. Persisted State Blocks - Keeping metadata global and distinct from tool items array
  const [tools, setTools] = useState(() => {
    const savedTools = localStorage.getItem("credex-ai-tools");
    return savedTools ? JSON.parse(savedTools) : [{ ...defaultToolInstance }];
  });

  const [companyMetrics, setCompanyMetrics] = useState(() => {
    const savedMetrics = localStorage.getItem("credex-global-metrics");
    return savedMetrics ? JSON.parse(savedMetrics) : { teamSize: "", useCase: "" };
  });

  // 3. Sync changes immediately to the local browser storage engine
  useEffect(() => {
    localStorage.setItem("credex-ai-tools", JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem("credex-global-metrics", JSON.stringify(companyMetrics));
  }, [companyMetrics]);

  const handleToolChange = (index, field, value) => {
    const updatedTools = [...tools];
    updatedTools[index][field] = value;

    if (field === "tool") {
      updatedTools[index].plan = "";
    }
    setTools(updatedTools);
  };

  const handleCompanyChange = (field, value) => {
    setCompanyMetrics((prev) => ({ ...prev, [field]: value }));
  };

  const addTool = () => {
    setTools([...tools, { ...defaultToolInstance }]);
  };

  const removeTool = (indexToRemove) => {
    if (tools.length === 1) {
      setTools([{ ...defaultToolInstance }]);
    } else {
      setTools(tools.filter((_, index) => index !== indexToRemove));
    }
  };

  const generateAudit = (e) => {
    e.preventDefault();
    navigate("/results");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fc] text-[#032b1f]">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 sm:px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Credex</h1>
        <button 
          onClick={generateAudit}
          className="bg-[#003d2b] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold shadow-sm hover:opacity-90 transition"
        >
          Run Free Audit
        </button>
      </nav>

      {/* HERO BANNER */}
      <section className="text-center px-4 py-8 sm:py-14 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Spend Inventory
        </h1>
        <p className="mt-4 sm:mt-6 text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed">
          Document your organization’s AI stack to identify overspending, unused seats, 
          redundant subscriptions, and optimization opportunities.
        </p>
      </section>

      {/* STEP FORM WRAPPER */}
      <form onSubmit={generateAudit} className="pb-24 px-4 max-w-4xl mx-auto">
        
        {/* GLOBAL FORM VARIABLES SECTION */}
        <div className="bg-white rounded-2xl sm:rounded-[32px] p-5 sm:p-8 md:p-10 mb-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#e6f5ea] flex items-center justify-center font-bold text-sm sm:text-base">
              01
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Company Profiles</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block mb-2 sm:mb-3 text-sm sm:text-base text-gray-700 font-medium">
                Total Team Size
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="Number of team members"
                value={companyMetrics.teamSize}
                onChange={(e) => handleCompanyChange("teamSize", e.target.value)}
                className="w-full border border-gray-300 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 outline-none focus:border-[#003d2b] transition text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block mb-2 sm:mb-3 text-sm sm:text-base text-gray-700 font-medium">
                Primary Use Case
              </label>
              <select
                required
                value={companyMetrics.useCase}
                onChange={(e) => handleCompanyChange("useCase", e.target.value)}
                className="w-full border border-gray-300 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 bg-white outline-none focus:border-[#003d2b] transition text-sm sm:text-base"
              >
                <option value="">Select Use Case</option>
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="data">Data</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>
        </div>

        {/* REPEATER SOFTWARE SECTION */}
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">02. Subscription Layers</h3>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              {tools.length} {tools.length === 1 ? "Tool added" : "Tools added"}
            </span>
          </div>

          {tools.map((toolData, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl sm:rounded-[32px] p-5 sm:p-8 md:p-10 shadow-sm border border-gray-100 relative group"
            >
              <button
                type="button"
                onClick={() => removeTool(index)}
                className="absolute top-5 right-5 text-gray-400 hover:text-red-500 text-sm font-medium p-2 transition sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Remove item"
              >
                ✕ Remove
              </button>

              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#f0f3fa] flex items-center justify-center font-bold text-xs sm:text-sm text-gray-600">
                  #{index + 1}
                </div>
                <h4 className="text-lg sm:text-xl font-bold">Tool Matrix</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block mb-2 sm:mb-3 text-sm sm:text-base text-gray-700 font-medium">
                    AI Tool Name
                  </label>
                  <select
                    required
                    value={toolData.tool}
                    onChange={(e) => handleToolChange(index, "tool", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 bg-white outline-none focus:border-[#003d2b] transition text-sm sm:text-base"
                  >
                    <option value="">Select Tool</option>
                    {Object.keys(toolsData).map((tool) => (
                      <option key={tool} value={tool}>{tool}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 sm:mb-3 text-sm sm:text-base text-gray-700 font-medium">
                    Plan Tier
                  </label>
                  <select
                    required
                    disabled={!toolData.tool}
                    value={toolData.plan}
                    onChange={(e) => handleToolChange(index, "plan", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 bg-white outline-none focus:border-[#003d2b] disabled:bg-gray-50 disabled:text-gray-400 transition text-sm sm:text-base"
                  >
                    <option value="">Select Plan</option>
                    {toolData.tool && toolsData[toolData.tool] ? (
                      toolsData[toolData.tool].map((plan) => (
                        <option key={plan} value={plan}>{plan}</option>
                      ))
                    ) : null}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 sm:mb-3 text-sm sm:text-base text-gray-700 font-medium">
                    Current Monthly Spend ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="0.00"
                    value={toolData.spend}
                    onChange={(e) => handleToolChange(index, "spend", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 outline-none focus:border-[#003d2b] transition text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block mb-2 sm:mb-3 text-sm sm:text-base text-gray-700 font-medium">
                    Number of Seats
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Active licenses"
                    value={toolData.seats}
                    onChange={(e) => handleToolChange(index, "seats", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 outline-none focus:border-[#003d2b] transition text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTAS SECTION */}
        <div className="mt-8 space-y-4 sm:space-y-6">
          <button
            type="button"
            onClick={addTool}
            className="w-full border-2 border-dashed border-gray-400 rounded-xl sm:rounded-2xl py-4 text-base sm:text-lg font-semibold bg-transparent hover:bg-white hover:border-black transition text-center"
          >
            + Add Another Software Layer
          </button>

          <button
            type="submit"
            className="w-full bg-[#003d2b] text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-semibold shadow-md hover:opacity-95 transform active:scale-[0.99] transition duration-150 text-center"
          >
            ✨ Run Optimization Engine
          </button>
        </div>

      </form>
    </div>
  );
}

export default FormPage;