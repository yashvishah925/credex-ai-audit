# DEVLOG

---

## Day 1 — 2026-05-20

**Hours worked:** 1.5

**What I did:**  
Reviewed the Credex assignment brief in detail and mapped the required MVP features into frontend, audit logic, AI summary, backend, and documentation workstreams.

Started researching SaaS spend optimization workflows and common AI subscription pricing structures across tools like ChatGPT, Claude, Cursor, Copilot, Gemini, and Windsurf.

Sketched an initial application flow:
Landing Page → Spend Form → Audit Engine → Results & AI Summary.

**What I learned:**  
The assignment evaluates entrepreneurial thinking and reasoning quality as heavily as engineering execution. The audit logic itself needs to feel finance-literate rather than generic AI recommendations.

**Blockers / what I'm stuck on:**  
Still deciding the cleanest separation between audit analysis and final savings presentation.

**Plan for tomorrow:**  
Plan frontend architecture and define pricing data structures for tool + plan mappings.

---

## Day 2 — 2026-05-21

**Hours worked:** 2

**What I did:**  
Planned the frontend routing structure and state organization strategy for handling company-level inputs separately from tool-level subscription data.

Defined the supported AI tools, plans, and pricing relationships required for the audit engine.

Started thinking through how savings calculations and recommendation logic should remain deterministic instead of AI-generated.

**What I learned:**  
Separating global company inputs (team size, use case) from tool-specific inputs (plan, seats, spend) significantly simplifies both UI rendering and audit calculations.

**Blockers / what I'm stuck on:**  
Still evaluating how aggressive the recommendation logic should be without making unrealistic optimization claims.

**Plan for tomorrow:**  
Design responsive UI layouts and begin implementation setup with React + Vite.

---

## Day 3 — 2026-05-22

**Hours worked:** 3.5

**What I did:**  
Initialized the React + Vite application and configured Tailwind CSS and react-router-dom.

Designed responsive wireframes and started implementing the Landing Page and Spend Input Form.

Prepared reusable dropdown mappings for AI tools, plans, and pricing relationships.

Implemented the initial localStorage persistence structure to preserve form state across page reloads.

**What I learned:**  
Reusable configuration-driven form rendering makes the application significantly easier to maintain as pricing and plan mappings evolve.

**Blockers / what I'm stuck on:**  
Dynamic tool-to-plan rendering introduced edge cases around conditional dropdown handling and state synchronization.

**Plan for tomorrow:**  
Complete frontend form implementation and begin audit engine calculation logic.

---

## Day 4 — 2026-05-23

**Hours worked:** 5

**What I did:**  
Completed the responsive Spend Input Form supporting all required AI vendors and plan combinations.

Implemented:
- monthly spend inputs
- seat counts
- team size handling
- primary use case selection
- localStorage persistence across refreshes

Pushed the first major implementation commits to GitHub and began structuring the audit engine recommendation flow.

Started mapping pricing normalization into a centralized pricingData module.

**What I learned:**  
Form persistence dramatically improves UX during multi-step workflows, especially when users revisit calculations repeatedly.

**Blockers / what I'm stuck on:**  
Recommendation logic became more complex once cross-tool comparisons and same-vendor downgrade paths were introduced simultaneously.

**Plan for tomorrow:**  
Implement the audit engine analysis layer and final results + AI summary flow.

---

## Day 5 — 2026-05-24

**Hours worked:** 6.5

**What I did:**  
Refactored the application into a structured multi-step audit flow:
Landing Page → Spend Input Form → Audit Engine → Final Results + AI Summary.

Separated the audit engine analysis layer from the final savings presentation layer to improve UX clarity and recommendation readability. Updated React Router navigation between pages while preserving localStorage persistence across reloads.

Expanded the audit engine logic to evaluate:
- plan fit based on team size and seat count
- cheaper same-vendor plan alternatives
- lower-cost AI tooling alternatives
- retail pricing versus usage-based/API pricing opportunities

Implemented the first version of the final audit results experience including:
- per-tool recommendation cards
- monthly and annual savings calculations
- conditional Credex consultation CTA logic
- AI-generated executive summary section with fallback handling

Normalized pricing data into a centralized pricingData module and updated PRICING_DATA.md using official vendor pricing sources verified on 2026-05-24.

**What I learned:**  
I learned that separating “analysis” from “results presentation” made the product flow significantly easier to reason about and improved the overall UX. I also learned how quickly pricing logic becomes inconsistent unless all calculations pull from a centralized pricing source-of-truth file.

**Blockers / what I'm stuck on:**  
Still need to implement backend persistence for lead capture, transactional email handling, abuse protection, and public shareable audit URLs without overengineering the MVP.

**Plan for tomorrow:**  
Implement Supabase lead storage, transactional email integration, public audit result URLs, and complete the remaining documentation and testing setup.