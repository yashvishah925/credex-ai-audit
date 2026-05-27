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

## Day 6 — 2026-05-25

**Hours worked:** 6

**What I did:**  
- Finalized routing structure between form, audit engine, and audit results pages  
- Refactored audit engine flow to separate audit evaluation from final summary display  
- Improved conditional rendering for high-savings and low-savings audit states  
- Added responsive UI adjustments for audit results cards and summary sections  
- Configured Supabase project and connected environment variables  
- Created Supabase database table for lead storage  
- Installed and configured Resend transactional email infrastructure  
- Added frontend Supabase client configuration using environment variables  
- Updated pricing data and pricing source documentation for all supported AI tools  
- Reviewed assignment architecture and clarified implementation plan for shareable public audit URLs and AI-generated summaries  

**What I learned:**  
- Separating audit evaluation logic from results presentation significantly simplified the routing and page structure  
- Supabase setup and environment configuration are straightforward once the data flow is clearly defined  
- The assignment is testing product thinking and infrastructure design as much as frontend implementation  
- Conditional UI messaging based on savings tiers creates a more realistic SaaS-style audit experience  

**Blockers / what I'm stuck on:**  
- Still need to implement actual lead persistence flow from frontend to Supabase  
- AI summary integration is pending because Anthropic API now requires paid credits; evaluating OpenAI/fallback strategy instead  
- Shareable public audit URL architecture still needs implementation planning and backend wiring  

**Plan for tomorrow:**  
- Implement lead capture form submission and save data to Supabase  
- Add transactional email sending using Resend  
- Implement AI-generated summary flow with graceful fallback handling  
- Build public shareable audit URL flow and public audit results page  
- Continue polishing documentation files and test coverage  

## Day 1 — 2026-05-26

**Hours worked:** 8

**What I did:**  
- Continued development of the Credex AI Audit web application using React + Vite.  
- Implemented and refined the audit results page with per-tool AI spend breakdowns, recommended actions, monthly savings, and annual savings calculations.  
- Added high-savings and optimized-user conditional result sections based on audit outcomes.  
- Built the AI-generated financial evaluation summary section and connected fallback handling when API responses fail.  
- Integrated Supabase backend setup for storing lead capture data.  
- Created and configured the `leads` table schema in Supabase with fields for email, company, role, team size, savings, audit data, and timestamps.  
- Integrated Resend transactional email API into the backend server and successfully configured email delivery flow.  
- Verified successful audit email delivery using Resend test emails.  
- Added Express backend routes for sending transactional emails.  
- Worked on dynamic routing for public shareable audit URLs using React Router.  
- Fixed multiple frontend and backend integration issues related to navigation flow, Supabase schema mismatches, audit routes, and email request handling.  
- Debugged issues where audit results routing was incorrectly redirecting users to the public shareable page.  
- Tested multiple AI tool combinations and savings scenarios to verify audit engine calculations and UI behavior.

**What I learned:**  
- Better understanding of Supabase schema management and frontend/backend integration.  
- Learned how transactional email workflows operate using Resend.  
- Improved debugging skills for React Router navigation issues and async API handling.  
- Learned the importance of stabilizing working features before making major structural changes.

**Blockers / what I'm stuck on:**  
- Public shareable audit page still needs full audit data rendering and UI improvements.  
- Email form occasionally displays a frontend error message even though emails are successfully delivered.  
- Desktop responsiveness and layout polish are still pending.

**Plan for tomorrow:**  
- Improve responsiveness and optimize layouts for desktop and tablet devices.  
- Fix remaining frontend email submission error handling.  
- Complete the public shareable audit page design and functionality.  
- Add abuse protection (honeypot/rate limiting).  
- Finalize documentation files including README.md, PROMPTS.md, and PRICING_DATA.md.  
- Push stable commits and deployment-ready code to GitHub.

## Day 7 — 2026-05-27
**Hours worked:** 7
**What I did:** Fully completed the operational application suite. Refactored the form submission pipeline to pass data variables straight to the interactive results grid first, moving conversion form captures safely to the final page. Optimized the layout parameters to stretch to max-w-5xl, aligning fields horizontally to make it look like a sleek dashboard instead of a form. Completed all product documentation metrics.
**What I learned:** Moving structural data inserts to the final workflow section protects the user journey from unexpected database exceptions. Designing forms with horizontal rows on desktop grids makes the interface feel like a premium analytics application instead of a tedious input form.
**Blockers / what I'm stuck on:** None. The end-to-end framework compiles cleanly, records data, prints unique public share hashes, and is completely ready for live deployment.
**Plan for tomorrow:** Submit the fully finalized, operational application package repository for engineering evaluation.