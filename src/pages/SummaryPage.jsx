function SummaryPage() {
  const tools =
    JSON.parse(localStorage.getItem("tools")) || [];

  const summary = `
Your organization is currently operating across ${tools.length} AI software subscriptions. 
The audit identified multiple opportunities to optimize monthly operational spending through better plan alignment, elimination of redundant tooling, and restructuring of lower-efficiency enterprise subscriptions.

Several tools currently exceed recommended pricing thresholds relative to seat utilization and usage patterns. Optimizing these subscriptions can significantly reduce annual AI operational expenses while maintaining equivalent productivity capabilities.

The current recommendations focus on reducing unnecessary collaboration-tier overhead, consolidating overlapping AI coding platforms, and aligning vendor pricing structures with actual team requirements.
`;

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-5">

      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-3xl p-10 border shadow-sm">

          <h1 className="text-5xl font-bold text-[#072b1f]">
            AI Executive Summary
          </h1>

          <p className="text-gray-600 mt-5 leading-9 text-lg">
            {summary}
          </p>

          <div className="bg-gray-100 rounded-2xl p-6 mt-10">
            <p className="text-gray-700 leading-8">
              AI-generated summaries may vary depending on operational usage assumptions and pricing updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;