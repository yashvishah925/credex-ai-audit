# Reflection

## 1. The hardest bug I hit this week

The hardest bug I encountered was a routing and backend integration issue that completely broke the audit flow between the form page, audit engine page, and summary page. Initially, the application worked correctly, but after integrating Supabase shareable links and email functionality, the navigation flow started failing. Clicking “Run Audit Engine” triggered a generic “Something went wrong” alert instead of navigating to the audit results.

My first hypothesis was that React Router routes were misconfigured. I checked App.jsx and realized multiple routes had been renamed inconsistently while integrating public share URLs. I tried reverting routes manually, but the issue persisted.

Next, I investigated the frontend console and discovered repeated `ERR_CONNECTION_REFUSED` errors on the `/send-email` endpoint. That led me to inspect the backend server. I discovered the Express server was not running because the Resend API key was missing from the backend environment context. The frontend failure was indirectly caused by the backend crashing before the audit completed.

I fixed the issue by:
- restoring the original route structure
- separating audit engine and summary routes correctly
- restarting the backend server independently
- validating environment variables
- testing API requests manually

The biggest lesson was that frontend routing bugs can sometimes originate from backend failures, especially when async actions block navigation.

---

## 2. A decision I reversed mid-week

One decision I reversed mid-week was using AI-generated logic for the audit calculations themselves.

At the beginning of development, I considered using an LLM to dynamically generate optimization recommendations and savings calculations. The idea sounded attractive because it would make the system feel “intelligent.” However, after testing multiple prompt approaches, I realized the outputs were inconsistent and financially unreliable. Different prompts produced different savings estimates for identical inputs, which would not be acceptable for a finance-focused product.

I eventually reversed the decision and moved all audit calculations into deterministic rule-based logic using hardcoded pricing data and explicit recommendation rules. AI was only retained for generating the personalized summary paragraph.

This ended up aligning much better with the assignment requirements, which explicitly stated that the audit engine should use defensible financial logic rather than subjective AI opinions. The final system became significantly more stable, explainable, and easier to debug.

The reversal also improved performance because recommendations were generated instantly without requiring additional API latency.

---

## 3. What I would build in week 2

If I had a second week to continue the project, I would focus heavily on production readiness, analytics, and workflow automation.

The first major improvement would be a real admin dashboard for Credex operators. Currently, audit submissions are stored in Supabase, but there is no internal interface for reviewing leads, sorting high-value accounts, or tracking follow-ups. I would build a secure internal dashboard with filtering, audit history, and lead scoring.

Second, I would improve the pricing intelligence layer. Right now, pricing data is manually maintained in a static file. In week 2, I would build automated pricing crawlers or scheduled sync jobs to validate vendor pricing weekly and detect pricing changes automatically.

Third, I would improve the shareable report system by adding:
- Open Graph image generation
- Twitter card previews
- downloadable PDF exports
- branded public reports

I would also introduce stronger abuse prevention such as:
- IP-based rate limiting
- hCaptcha
- email verification

Finally, I would focus on mobile responsiveness and UI polish. While the current interface is functional and visually strong, a second week would allow much better tablet and desktop optimization across all breakpoints.

---

## 4. How I used AI tools

I used AI tools extensively throughout the project, primarily ChatGPT and Gemini. I used them for:
- debugging React errors
- generating component structures
- improving Tailwind layouts
- drafting documentation
- troubleshooting Supabase integration
- refining prompts for the AI summary feature

However, I was careful not to trust AI blindly for core business logic. I specifically avoided relying on AI-generated financial calculations because the outputs were inconsistent and sometimes unrealistic.

One major failure occurred when Gemini suggested a routing refactor while implementing the shareable audit URLs. The generated code accidentally broke the application flow by replacing the audit engine route structure incorrectly. After applying the changes, the form page stopped navigating properly and repeatedly showed generic frontend errors.

I caught the issue by comparing the new routing structure against my original navigation logic and reviewing console errors carefully. I reverted the routing configuration manually and restored the original page flow.

This experience reinforced an important lesson: AI tools are extremely useful accelerators, but they still require careful verification, especially for architecture changes and production-critical logic.

---

## 5. Self-rating

### Discipline — 8/10
I consistently worked through blockers and continued iterating even during difficult debugging sessions and time pressure.

### Code Quality — 7/10
The architecture is modular and readable, though there are areas where cleanup and better abstraction could improve maintainability.

### Design Sense — 8/10
The visual design, gradients, layout hierarchy, and audit presentation create a strong modern SaaS feel.

### Problem Solving — 9/10
The project involved multiple integration failures across routing, backend APIs, email systems, and Supabase, all of which were eventually resolved through systematic debugging.

### Entrepreneurial Thinking — 8/10
The project was approached not just as an assignment, but as a realistic lead-generation product with shareability, conversion flow, and operational considerations.