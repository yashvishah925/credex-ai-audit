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

  function handleSubmit(e) {
    e.preventDefault();

    navigate("/audit");
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-10">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-5xl font-black text-[#032b22] mb-4">
          AI Spend Inventory
        </h1>

        <p className="text-[#6c7685] mb-10">
          Audit your AI software stack and identify
          structural overspending opportunities.
        </p>

        {/* COMPANY */}

        <div className="bg-white rounded-3xl border border-[#e8edf2] p-7 mb-8">

          <h2 className="text-2xl font-black mb-6">
            Company Profile
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 text-sm font-semibold">
                Team Size
              </label>

              <input
                type="number"
                value={company.teamSize}
                onChange={(e) =>
                  setCompany({
                    ...company,
                    teamSize: e.target.value
                  })
                }
                className="w-full border border-[#dbe2ea] rounded-2xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold">
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
                className="w-full border border-[#dbe2ea] rounded-2xl px-4 py-3"
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

        {/* TOOLS */}

        <form onSubmit={handleSubmit}>

          <div className="space-y-6">

            {tools.map((tool, index) => (
              <div
                key={index}
                className="bg-white border border-[#e8edf2] rounded-3xl p-7"
              >

                <div className="flex justify-between mb-6">

                  <h2 className="text-xl font-black">
                    Tool #{index + 1}
                  </h2>

                  {tools.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTool(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">

                  {/* TOOL */}

                  <div>
                    <label className="block mb-2 text-sm font-semibold">
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
                      className="w-full border border-[#dbe2ea] rounded-2xl px-4 py-3"
                    >
                      {Object.keys(pricingData).map((name) => (
                        <option key={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PLAN */}

                  <div>
                    <label className="block mb-2 text-sm font-semibold">
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
                      className="w-full border border-[#dbe2ea] rounded-2xl px-4 py-3"
                    >
                      {Object.keys(
                        pricingData[tool.name]
                      ).map((plan) => (
                        <option key={plan}>
                          {plan}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SPEND */}

                  <div>
                    <label className="block mb-2 text-sm font-semibold">
                      Monthly Spend
                    </label>

                    <input
                      type="number"
                      value={tool.monthlySpend}
                      onChange={(e) =>
                        updateTool(
                          index,
                          "monthlySpend",
                          e.target.value
                        )
                      }
                      className="w-full border border-[#dbe2ea] rounded-2xl px-4 py-3"
                    />
                  </div>

                  {/* SEATS */}

                  <div>
                    <label className="block mb-2 text-sm font-semibold">
                      Seats
                    </label>

                    <input
                      type="number"
                      value={tool.seats}
                      onChange={(e) =>
                        updateTool(
                          index,
                          "seats",
                          e.target.value
                        )
                      }
                      className="w-full border border-[#dbe2ea] rounded-2xl px-4 py-3"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ADD */}

          <button
            type="button"
            onClick={addTool}
            className="w-full mt-6 border border-dashed border-[#c8d1db] rounded-3xl py-5 font-bold"
          >
            + Add Another Tool
          </button>

          {/* SUBMIT */}

          <button
            type="submit"
            className="w-full mt-6 bg-[#032f24] hover:bg-[#04382b] text-white py-5 rounded-3xl font-black text-lg"
          >
            Run AI Spend Audit
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormPage;