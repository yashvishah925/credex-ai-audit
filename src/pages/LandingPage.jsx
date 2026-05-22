import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="bg-[#f5f7fc] min-h-screen text-[#032b1f]">

      {/* NAVBAR */}

      <nav className="flex items-center justify-between px-6 md:px-12 py-6">
        <h1 className="text-3xl font-bold">Credex</h1>

        <Link to="/form">
          <button className="bg-[#003d2b] text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition">
            Run Free Audit
          </button>
        </Link>
      </nav>

      {/* HERO SECTION */}

      <section className="flex flex-col items-center justify-center text-center px-6 py-20">

        <div className="bg-[#d9f5df] text-[#0b5d3b] px-5 py-2 rounded-full text-sm font-medium">
          Powered By Advanced AI Analytics
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mt-8 max-w-4xl">
          Optimize Your AI Stack Spending
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-3xl leading-relaxed">
          Analyze AI subscriptions, detect overlapping tools, and uncover monthly
          savings opportunities for your team instantly.
        </p>

        <div className="flex justify-center mt-10">
          <Link to="/form">
            <button className="bg-[#003d2b] text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:scale-105 transition">
              Run Free Audit
            </button>
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}

      <section className="px-6 md:px-12 py-16">

        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold">
            Precision Features for Enterprise AI Governance
          </h2>

          <p className="text-gray-600 mt-5 text-lg">
            Intelligent AI spend optimization built for modern teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

          {/* CARD 1 */}

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#d9f5df] flex items-center justify-center text-2xl">
              💡
            </div>

            <h3 className="text-2xl font-semibold mt-6">
              AI Spend Analysis
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Analyze active AI subscriptions, unused seats, and overlapping tools
              across your organization.
            </p>
          </div>

          {/* CARD 2 */}

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#d9f5df] flex items-center justify-center text-2xl">
              📊
            </div>

            <h3 className="text-2xl font-semibold mt-6">
              Smart Recommendations
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Discover cheaper plans, better pricing models, and alternative AI
              tools that fit your usage.
            </p>
          </div>

          {/* CARD 3 */}

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#d9f5df] flex items-center justify-center text-2xl">
              ⚡
            </div>

            <h3 className="text-2xl font-semibold mt-6">
              AI Audit Engine
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Generate detailed optimization audits with estimated monthly and
              yearly savings instantly.
            </p>
          </div>

          {/* CARD 4 */}

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#d9f5df] flex items-center justify-center text-2xl">
              📁
            </div>

            <h3 className="text-2xl font-semibold mt-6">
              Shareable Reports
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Create public audit reports that teams can share internally or on
              social platforms.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="px-6 md:px-12 py-20">

        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20 text-center">

          <div>
            <div className="w-24 h-24 rounded-full bg-[#d9f5df] flex items-center justify-center text-4xl font-bold mx-auto">
              1
            </div>

            <h3 className="text-3xl font-semibold mt-8">
              Enter AI Tools
            </h3>

            <p className="text-gray-600 mt-4 text-lg">
              Add your AI subscriptions, plans, seats, and monthly spending.
            </p>
          </div>

          <div>
            <div className="w-24 h-24 rounded-full bg-[#d9f5df] flex items-center justify-center text-4xl font-bold mx-auto">
              2
            </div>

            <h3 className="text-3xl font-semibold mt-8">
              Generate Audit
            </h3>

            <p className="text-gray-600 mt-4 text-lg">
              Our audit engine analyzes overspending and optimization opportunities.
            </p>
          </div>

          <div>
            <div className="w-24 h-24 rounded-full bg-[#00d66f] flex items-center justify-center text-4xl font-bold mx-auto">
              3
            </div>

            <h3 className="text-3xl font-semibold mt-8">
              Save Money
            </h3>

            <p className="text-gray-600 mt-4 text-lg">
              Reduce AI expenses with smarter recommendations and plan changes.
            </p>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}

      <section className="px-6 md:px-12 py-20">

        <div className="w-full max-w-5xl mx-auto rounded-[40px] bg-gradient-to-r from-[#003d2b] to-[#1f3fb7] text-white text-center px-8 py-20">

          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Ready to Optimize Your AI Stack?
          </h2>

          <p className="text-lg md:text-2xl mt-8 text-gray-200 max-w-3xl mx-auto">
            Join companies using Credex to eliminate AI waste and improve ROI.
          </p>

          <Link to="/form">
            <button className="mt-12 bg-white text-black px-10 py-4 rounded-2xl text-lg font-semibold hover:scale-105 transition">
              Run Free Audit Now
            </button>
          </Link>

        </div>
      </section>

    </div>
  );
}

export default LandingPage;