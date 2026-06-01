import { pricingData } from "../data/pricingData";

/**
 * CREDEX AI AUDIT ENGINE — May 2026
 * ─────────────────────────────────────────────────────────────────
 * 4 checks per tool, all prices in USD:
 *
 *  CHECK 1 — Plan Fit
 *    Is the user on the right plan for their seat count + use case?
 *    e.g. Team plan for 2 users is overkill — Pro at half the price covers them.
 *
 *  CHECK 2 — Same-Vendor Optimization
 *    Is there a cheaper plan from the SAME vendor that covers their needs?
 *    e.g. annual billing, or a lower tier they haven't outgrown.
 *
 *  CHECK 3 — Tool Overlap / Alternative
 *    Is a redundant tool in the stack?
 *    Is there a substantially cheaper tool with equivalent capability?
 *
 *  CHECK 4 — Retail vs Credits
 *    Are they paying above official retail? (reseller markup, stale contract)
 *    Could they get the same thing cheaper via API / batch / credits?
 *
 * Logic is finance-defensible: every claim cites a specific dollar difference.
 * Plan names match exactly what pricingData.js exposes (= form dropdown values).
 * All prices USD, sourced from official pages, verified May 2026.
 */

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

function numericPrice(toolName, planName) {
  const p = pricingData?.[toolName]?.[planName];
  return typeof p === "number" ? p : null;
}

function officialRetail(toolName, planName, seats) {
  const p = numericPrice(toolName, planName);
  return p === null ? null : p * seats;
}

function fmt(n) {
  return Number(n).toFixed(2);
}

// ─────────────────────────────────────────────────────────────────
// CHECK 1 — PLAN FIT
// Right plan for this seat count and use case?
// ─────────────────────────────────────────────────────────────────
function checkPlanFit(tool) {
  const spend  = Number(tool.monthlySpend || 0);
  const seats  = Number(tool.seats || 1);
  const { name, plan } = tool;

  // ── CURSOR ──────────────────────────────────────────────────────
  if (name === "Cursor" && plan === "Business" && seats < 3) {
    const optimal  = numericPrice("Cursor", "Pro") * seats;   // $20 × seats
    const savings  = Math.max(0, spend - optimal);
    return {
      passed: false,
      title: "Cursor Business Is Overkill for a Small Team",
      recommendation: `Downgrade to Cursor Pro → $20/seat × ${seats} = $${fmt(optimal)}/mo`,
      savings,
      reason: `Cursor Business ($40/seat/mo) adds SSO, centralized billing, and org-wide admin controls — governance features only worthwhile at 3+ seats. At ${seats} seat(s) Pro ($20/seat) delivers identical AI capability: unlimited Tab completions, Cascade agent, and Background Agents. Downgrading saves $${fmt(savings)}/mo with no loss in productivity.`
    };
  }

  // ── GITHUB COPILOT ──────────────────────────────────────────────
  if (name === "GitHub Copilot" && plan === "Business" && seats < 3) {
    const optimal = numericPrice("GitHub Copilot", "Individual") * seats; // $10 × seats
    const savings = Math.max(0, spend - optimal);
    return {
      passed: false,
      title: "Copilot Business Oversized for This Team Size",
      recommendation: `Downgrade to Copilot Individual → $10/seat × ${seats} = $${fmt(optimal)}/mo`,
      savings,
      reason: `Copilot Business ($19/seat/mo) adds org-level policy controls, IP indemnity, audit logs, and SAML SSO — compliance features designed for larger teams with legal or procurement requirements. At ${seats} seat(s) Individual ($10/seat) gives identical AI completions and Chat in all major IDEs. Saves $${fmt(savings)}/mo.`
    };
  }

  if (name === "GitHub Copilot" && plan === "Enterprise" && seats < 10) {
    const optimal = numericPrice("GitHub Copilot", "Business") * seats; // $19 × seats
    const savings = Math.max(0, spend - optimal);
    return {
      passed: false,
      title: "Copilot Enterprise Too Early at This Scale",
      recommendation: `Downgrade to Copilot Business → $19/seat × ${seats} = $${fmt(optimal)}/mo`,
      savings,
      reason: `Copilot Enterprise ($39/seat/mo) adds Knowledge Bases trained on your private codebase and fine-tuned model suggestions. The ROI on those features only materialises at 10+ developers with mature, large codebases. At ${seats} seat(s) Business covers all org-level controls at $${fmt(savings)}/mo less per month.`
    };
  }

  // ── CLAUDE ──────────────────────────────────────────────────────
  if (name === "Claude" && plan === "Team" && seats < 5) {
    const optimal = numericPrice("Claude", "Pro") * seats;   // $20 × seats
    const savings = Math.max(0, spend - optimal);
    return {
      passed: false,
      title: "Claude Team Plan Has a 5-Seat Minimum — Pro Is Correct Below That",
      recommendation: `Switch to Claude Pro → $20/seat × ${seats} = $${fmt(optimal)}/mo`,
      savings,
      reason: `Claude Team ($25/seat/mo) requires a minimum of 5 seats and adds SSO, domain capture, and admin billing controls. Below that threshold the plan is technically incorrectly provisioned and per-seat cost is higher than Pro. Claude Pro ($20/seat) gives identical model access (Sonnet 4.6, Opus 4.7) for ${seats} seat(s) and saves $${fmt(savings)}/mo.`
    };
  }

  if (name === "Claude" && plan === "Max" && seats > 1) {
    // Max is a single-user unlimited plan — not a multi-seat product
    const optimal = numericPrice("Claude", "Team") * seats;  // $25 × seats
    const savings = Math.max(0, spend - optimal);
    return {
      passed: false,
      title: "Claude Max Is a Single-User Plan — Teams Need Team or Enterprise",
      recommendation: `Switch to Claude Team → $25/seat × ${seats} = $${fmt(optimal)}/mo`,
      savings,
      reason: `Claude Max ($100/mo) is an individual high-usage subscription with no shared workspace or team management. For ${seats} users who need collaborative Projects, admin billing, and data-protection controls, Claude Team ($25/seat/mo) is the correct product. Running ${seats} separate Max accounts costs $${fmt(100 * seats)}/mo versus $${fmt(optimal)}/mo on Team — a $${fmt(Math.max(0, 100 * seats - optimal))}/mo premium for features Claude Team already includes.`
    };
  }

  // ── CHATGPT ─────────────────────────────────────────────────────
  if (name === "ChatGPT" && plan === "Team" && seats < 2) {
    // Team plan has a 2-seat minimum
    const optimal = numericPrice("ChatGPT", "Plus");   // $20
    const savings = Math.max(0, spend - optimal);
    return {
      passed: false,
      title: "ChatGPT Team Requires a 2-Seat Minimum — Plus Is Correct for Solo Use",
      recommendation: `Switch to ChatGPT Plus → $20/mo`,
      savings,
      reason: `ChatGPT Team (Business) at $30/seat/mo has a 2-seat minimum and adds shared workspaces, SAML SSO, SOC 2 compliance, and admin controls. A single user gains nothing from those features. ChatGPT Plus ($20/mo) gives the same GPT-5.5 model access and saves $${fmt(savings)}/mo.`
    };
  }

  // ── WINDSURF ────────────────────────────────────────────────────
  if (name === "Windsurf" && plan === "Teams" && seats < 3) {
    const optimal = numericPrice("Windsurf", "Pro") * seats;  // $20 × seats
    const savings = Math.max(0, spend - optimal);
    return {
      passed: false,
      title: "Windsurf Teams Is Overkill Below 3 Developers",
      recommendation: `Downgrade to Windsurf Pro → $20/seat × ${seats} = $${fmt(optimal)}/mo`,
      savings,
      reason: `Windsurf Teams ($40/seat/mo) adds centralized billing and an admin usage dashboard — management features only useful when coordinating 3+ developers. At ${seats} seat(s) Pro ($20/seat) provides identical Cascade agentic editing, full quota access, and all premium model access. Saves $${fmt(savings)}/mo with no capability loss.`
    };
  }

  // ── GEMINI ──────────────────────────────────────────────────────
  if (name === "Gemini" && plan === "Ultra") {
    // Ultra at $99.99 vs Pro at $19.99 — flag unless heavy usage is justified
    const savings = Math.max(0, spend - numericPrice("Gemini", "Pro"));
    return {
      passed: false,
      title: "Gemini AI Ultra — Verify You Need 5× Usage Limits Over AI Pro",
      recommendation: `Evaluate Gemini AI Pro ($19.99/mo) before paying AI Ultra ($99.99/mo)`,
      savings,
      reason: `Gemini AI Ultra ($99.99/mo, cut from $249.99 at Google I/O May 2026) delivers 5× AI Pro usage limits, Veo 3.1 video generation, and 20TB storage. Gemini AI Pro ($19.99/mo) covers Gemini 3.1 Pro with 1M context window and 20 Deep Research sessions/day — sufficient for the vast majority of business knowledge-work and coding tasks. If you are not consistently maxing out AI Pro limits, the $${fmt(savings)}/mo premium for Ultra is not justified.`
    };
  }

  // All good
  return {
    passed: true,
    title: "Plan Tier Is Appropriate for Your Team Size",
    recommendation: "No plan change needed",
    savings: 0,
    reason: `${name} ${plan} is correctly sized for ${seats} seat(s). The plan's governance and collaboration features are proportionate to your declared team scale. No cheaper tier from this vendor covers your seat count without hitting structural limits or losing required features.`
  };
}

// ─────────────────────────────────────────────────────────────────
// CHECK 2 — SAME-VENDOR OPTIMIZATION
// Cheaper plan from the same vendor that still covers the need?
// ─────────────────────────────────────────────────────────────────
function checkSameVendor(tool) {
  const spend = Number(tool.monthlySpend || 0);
  const seats = Number(tool.seats || 1);
  const { name, plan } = tool;

  // ── CURSOR — annual billing saves ~20% ──────────────────────────
  if (name === "Cursor" && (plan === "Pro" || plan === "Business")) {
    const annualRate  = plan === "Pro" ? 16 : 32;   // ~20% off list
    const annualTotal = annualRate * seats;
    if (spend > annualTotal * 1.05) {
      const savings = Math.max(0, spend - annualTotal);
      return {
        passed: false,
        title: "Switch to Annual Billing — Save ~20%",
        recommendation: `Cursor ${plan} annual → ~$${annualRate}/seat × ${seats} = $${fmt(annualTotal)}/mo`,
        savings,
        reason: `Cursor offers approximately 20% off on annual billing. Switching from monthly ($${plan === "Pro" ? 20 : 40}/seat) to annual (~$${annualRate}/seat) saves $${fmt(savings)}/mo — $${fmt(savings * 12)}/yr — with no change in features, models, or usage quotas. This is a billing-cycle switch only; no renegotiation required.`
      };
    }
  }

  // ── GITHUB COPILOT — annual billing (Pro: $100/yr = $8.33/mo) ──
  if (name === "GitHub Copilot" && plan === "Individual") {
    const annualMonthly = 100 / 12;   // $8.33 effective
    if (spend > annualMonthly * seats * 1.1) {
      const savings = Math.max(0, spend - annualMonthly * seats);
      return {
        passed: false,
        title: "Switch to Annual Billing — Save $20/yr per Seat",
        recommendation: `Copilot Individual annual → $100/yr per seat ($8.33/mo effective)`,
        savings,
        reason: `Copilot Individual monthly costs $10/seat ($120/yr). Annual billing is $100/seat/yr — saving $20/seat/yr with identical features and usage limits. At ${seats} seat(s) that is $${fmt(savings * 12)}/yr in pure billing-cycle savings.`
      };
    }
  }

  // ── CLAUDE — annual billing on Pro ($200/yr = $16.67/mo) ────────
  if (name === "Claude" && plan === "Pro") {
    const annualEffective = 200 / 12;  // $16.67
    if (spend > annualEffective * seats * 1.05) {
      const savings = Math.max(0, spend - annualEffective * seats);
      return {
        passed: false,
        title: "Switch to Annual Billing — Save ~15% on Claude Pro",
        recommendation: `Claude Pro annual → $200/yr per seat ($16.67/mo effective) vs $20/mo monthly`,
        savings,
        reason: `Claude Pro annual billing costs $200/yr per seat ($16.67/mo effective) versus $20/mo monthly. At ${seats} seat(s) switching to annual saves $${fmt(savings)}/mo ($${fmt(savings * 12)}/yr) with no change in models, usage limits, or features. Note: Max tiers are monthly-only; the annual discount applies to Pro only.`
      };
    }
  }

  // ── CLAUDE Team — annual billing ($20/seat/mo annual vs $25 monthly) ──
  if (name === "Claude" && plan === "Team" && seats >= 5) {
    const annualRate  = 20;
    const annualTotal = annualRate * seats;
    if (spend > annualTotal * 1.05) {
      const savings = Math.max(0, spend - annualTotal);
      return {
        passed: false,
        title: "Switch Claude Team to Annual Billing — Save 20%",
        recommendation: `Claude Team annual → $20/seat × ${seats} = $${fmt(annualTotal)}/mo`,
        savings,
        reason: `Claude Team monthly is $25/seat. Annual billing drops to $20/seat — exactly 20% less for identical SSO, admin controls, and model access. At ${seats} seats annual billing saves $${fmt(savings)}/mo ($${fmt(savings * 12)}/yr). This is a billing-cycle change only; no feature trade-off.`
      };
    }
  }

  // ── CLAUDE Max — evaluate if $100/mo covers you before paying $200/mo ──
  if (name === "Claude" && plan === "Max" && spend >= 200) {
    // User declared $200+ spend on "Max" → they might be on Max 20x; suggest trialling Max 5x first
    return {
      passed: false,
      title: "Are You on Max 20x ($200/mo)? Max 5x ($100/mo) May Suffice",
      recommendation: `Trial Claude Max 5x ($100/mo) before committing to Max 20x ($200/mo)`,
      savings: 100,
      reason: `Claude Max maps to the Max 5x entry tier at $100/mo. If your declared spend of $${fmt(spend)}/mo indicates you are on the Max 20x plan ($200/mo), Max 5x gives 5× Pro usage headroom — sufficient for intensive but non-continuous workflows. Max 20x is justified only when you demonstrably and consistently exhaust Max 5x rate limits. Downgrading to Max 5x saves $100/mo if those limits are not regularly hit.`
    };
  }

  // ── CHATGPT Team — annual billing ($25/seat/mo annual vs $30 monthly) ──
  if (name === "ChatGPT" && plan === "Team" && seats >= 2) {
    const annualRate  = 25;
    const annualTotal = annualRate * seats;
    if (spend > annualTotal * 1.05) {
      const savings = Math.max(0, spend - annualTotal);
      return {
        passed: false,
        title: "Switch ChatGPT Team to Annual Billing — Save ~17%",
        recommendation: `ChatGPT Team annual → $25/seat × ${seats} = $${fmt(annualTotal)}/mo`,
        savings,
        reason: `ChatGPT Team monthly billing is $30/seat. Annual billing drops to $25/seat — saving $5/seat/mo (≈17%) for the same features: GPT-5.5, shared workspaces, SAML SSO, and SOC 2 compliance. At ${seats} seats switching to annual saves $${fmt(savings)}/mo ($${fmt(savings * 12)}/yr) with no capability trade-off.`
      };
    }
  }

  // ── WINDSURF Teams — annual billing or Pro comparison ───────────
  if (name === "Windsurf" && plan === "Teams") {
    // Windsurf Teams = $40/seat; Pro = $20/seat. For 3+ seats Teams is justified for admin.
    // But check if declared spend is above expected retail (possible undisclosed add-ons).
    const expected = 40 * seats;
    if (spend > expected * 1.05) {
      const savings = Math.max(0, spend - expected);
      return {
        passed: false,
        title: "Windsurf Teams Spend Exceeds Official Retail — Possible SSO Add-On",
        recommendation: `Base Windsurf Teams is $40/seat × ${seats} = $${fmt(expected)}/mo. Audit your invoice.`,
        savings,
        reason: `Windsurf Teams official price is $40/seat/mo. Your declared spend of $${fmt(spend)}/mo exceeds that by $${fmt(savings)}. The most likely cause is the optional SSO add-on at +$10/seat/mo (total $50/seat with SSO). If your team does not require SSO integration (Okta, Azure AD), removing that add-on saves $${fmt(savings)}/mo.`
      };
    }
  }

  // Passed
  return {
    passed: true,
    title: "No Cheaper Same-Vendor Plan Available",
    recommendation: "Current plan is the most cost-efficient option from this vendor",
    savings: 0,
    reason: `All ${name} plans reviewed. ${plan} is the appropriate tier at ${seats} seat(s). No cheaper plan from ${name} covers your requirements without hitting structural limits (seat minimums, missing governance features, or reduced model access).`
  };
}

// ─────────────────────────────────────────────────────────────────
// CHECK 3 — TOOL OVERLAP / ALTERNATIVE
// Redundant tool in the stack? Substantially cheaper alternative?
// ─────────────────────────────────────────────────────────────────
function checkToolOverlap(tool, allTools, useCase) {
  const spend  = Number(tool.monthlySpend || 0);
  const seats  = Number(tool.seats || 1);
  const { name, plan } = tool;

  // Presence flags (other tools in the stack)
  const has = (n) => allTools.some(t => t.name === n && t.name !== name);
  const hasCursor      = has("Cursor");
  const hasWindsurf    = has("Windsurf");
  const hasCopilot     = has("GitHub Copilot");
  const hasClaudeAPI   = has("Anthropic API");
  const hasOpenAIAPI   = has("OpenAI API");
  const hasChatGPT     = has("ChatGPT");
  const hasClaude      = has("Claude");
  const hasGemini      = has("Gemini");

  const isCoding   = useCase === "coding";
  const isWriting  = useCase === "writing";
  const isResearch = useCase === "research";

  // ── CODING IDE REDUNDANCY ────────────────────────────────────────

  if (name === "GitHub Copilot" && hasCursor && isCoding) {
    return {
      passed: false,
      title: "Redundant: Cursor Already Covers All of Copilot's Functionality",
      recommendation: `Remove GitHub Copilot → save $${fmt(spend)}/mo`,
      savings: spend,
      reason: `Cursor provides inline completions, Tab autocomplete, multi-file Composer edits, and full codebase-aware agent mode — the complete feature set of GitHub Copilot, plus agentic capabilities Copilot has not yet matched. Running both tools is paying twice for the same coding workflow. Copilot is 100% redundant in a stack that already includes Cursor.`
    };
  }

  if (name === "GitHub Copilot" && hasWindsurf && isCoding) {
    return {
      passed: false,
      title: "Redundant: Windsurf Already Covers Copilot's Core Function",
      recommendation: `Remove GitHub Copilot → save $${fmt(spend)}/mo`,
      savings: spend,
      reason: `Windsurf's Cascade agent provides multi-file AI editing, codebase-aware chat, and inline completions — the same core value as GitHub Copilot. Running both is paying $${fmt(spend)}/mo for a tool whose entire function is already covered by Windsurf in your stack.`
    };
  }

  if (name === "Windsurf" && hasCursor && isCoding) {
    return {
      passed: false,
      title: "Duplicate AI IDE: Cursor + Windsurf Serve Identical Workflows",
      recommendation: `Eliminate one AI IDE → save $${fmt(spend)}/mo on Windsurf`,
      savings: spend,
      reason: `Cursor and Windsurf are both AI-native IDEs built on VS Code with multi-file agentic editing, codebase-aware chat, and inline completions. Running both is paying for two tools with nearly identical workflows. Cursor leads on Background Agents and parallel multi-repo tasks; Windsurf offers flat-rate pricing with no credit metering. Pick one and eliminate $${fmt(spend)}/mo in duplicate spend.`
    };
  }

  if (name === "Cursor" && hasWindsurf && isCoding) {
    return {
      passed: false,
      title: "Duplicate AI IDE: Cursor + Windsurf Serve Identical Workflows",
      recommendation: `Eliminate one AI IDE — Windsurf at $20/mo is the cheaper option if Background Agents are not required`,
      savings: 0,
      reason: `You are running Cursor and Windsurf simultaneously — two AI-native IDEs with near-identical capability. Cursor ($20/seat) leads on Background Agents and complex agentic tasks. Windsurf ($20/mo flat) offers unlimited Cascade quota with no credit metering. Both are $20/mo at Pro tier, so the savings come from eliminating one subscription entirely. Evaluate which workflow your team actually defaults to and cancel the other.`
    };
  }

  // ── API + SUBSCRIPTION CHANNEL OVERLAP ─────────────────────────

  if (name === "Claude" && hasClaudeAPI && plan !== "Free" && plan !== "API Direct") {
    return {
      passed: false,
      title: "Overlap: Claude Subscription + Anthropic API Both Active",
      recommendation: "Consolidate to one access channel based on your primary workflow",
      savings: 0,
      reason: `You are paying for a Claude ${plan} subscription ($${fmt(spend)}/mo flat) and Anthropic API access (pay-per-token) simultaneously. Subscriptions are cost-effective for interactive daily chat and Claude Code (human-paced, unpredictable token volume). The API is better for programmatic batch automation. Running both without clear workflow separation means you are likely double-paying for the same model access. Identify the dominant use case and eliminate the redundant channel.`
    };
  }

  if (name === "ChatGPT" && hasOpenAIAPI && plan !== "API Direct") {
    return {
      passed: false,
      title: "Overlap: ChatGPT Subscription + OpenAI API Both Active",
      recommendation: "Consolidate OpenAI access to one channel",
      savings: 0,
      reason: `You are paying for a ChatGPT ${plan} subscription ($${fmt(spend)}/mo) and OpenAI API access simultaneously. Batch/programmatic work belongs on the API — OpenAI Batch API cuts token costs by 50%. Interactive daily chat belongs on a subscription. Without deliberate workflow separation you are paying for the same model access twice.`
    };
  }

  // ── LLM CONSOLIDATION FOR NON-CODING USE CASES ─────────────────

  if (name === "ChatGPT" && hasClaude && (isWriting || isResearch)) {
    return {
      passed: false,
      title: "ChatGPT + Claude Both Active — Evaluate Consolidation for Your Use Case",
      recommendation: "Pick one primary LLM subscription and cancel the other",
      savings: 0,
      reason: `For ${useCase} workflows, ChatGPT (GPT-5.5) and Claude (Sonnet 4.6 / Opus 4.7) deliver comparable quality output. Running both at $${fmt(spend)}/mo for ChatGPT plus your Claude subscription means paying two vendors for the same category of work. Identify which model your team uses for 80%+ of tasks and cancel the other. One well-chosen subscription fully covers most writing and research workflows.`
    };
  }

  if (name === "Gemini" && (hasClaude || hasChatGPT) && (isWriting || isResearch)) {
    return {
      passed: false,
      title: "Gemini + Another LLM Subscription Active — Consolidation Opportunity",
      recommendation: "Verify Gemini adds distinct value beyond your existing LLM subscription",
      savings: 0,
      reason: `You already have a separate LLM subscription for ${useCase} work. Gemini AI Pro ($19.99/mo) is justified if your team relies on Google Workspace AI integration (Docs, Gmail, Drive) as a primary workflow. If the use is standalone chat or research without Workspace, a single best-in-class subscription (Claude or ChatGPT) likely covers 90%+ of tasks — and Gemini at $${fmt(spend)}/mo becomes redundant spend.`
    };
  }

  // Passed
  return {
    passed: true,
    title: "No Redundant Tools Detected in Your Stack",
    recommendation: "No overlap or cheaper alternative identified",
    savings: 0,
    reason: `${name} is the only tool in your stack serving this capability category for ${useCase} workflows. No substantially cheaper alternative provides equivalent feature coverage at your declared use case and team scale. Tool selection is non-redundant and justified.`
  };
}

// ─────────────────────────────────────────────────────────────────
// CHECK 4 — RETAIL PRICING / CREDITS OPPORTUNITY
// Paying above official retail? API batch savings available?
// ─────────────────────────────────────────────────────────────────
function checkRetailPricing(tool) {
  const spend  = Number(tool.monthlySpend || 0);
  const seats  = Number(tool.seats || 1);
  const { name, plan } = tool;
  const expected = officialRetail(name, plan, seats);

  // ── ABOVE-RETAIL DETECTION ──────────────────────────────────────
  // Flag if declared spend is >5% above official retail
  if (expected !== null && expected > 0 && spend > expected * 1.05) {
    const overcharge = spend - expected;
    return {
      passed: false,
      title: "Paying Above Official Retail Price",
      recommendation: `Request itemized invoice — official retail is $${fmt(expected)}/mo; you declared $${fmt(spend)}/mo`,
      savings: overcharge,
      reason: `Official ${name} ${plan} retail: $${fmt(numericPrice(name, plan))}/seat × ${seats} seat(s) = $${fmt(expected)}/mo (May 2026 verified pricing). Your declared spend of $${fmt(spend)}/mo is $${fmt(overcharge)} above that. Most likely causes: reseller or channel-partner markup (10–30% is common), a legacy contract signed before recent price reductions, or a billing error. Request an itemized invoice and compare line-by-line to the current official pricing page.`
    };
  }

  // ── API BATCH SAVINGS ───────────────────────────────────────────
  if ((name === "Anthropic API" || name === "OpenAI API") && spend > 200) {
    const batchSavings = Math.round(spend * 0.30);   // conservative 30% of spend
    return {
      passed: false,
      title: "High API Spend — Batch API and Prompt Caching Can Cut Costs 30–50%",
      recommendation: `Implement Batch API + prompt caching → est. $${fmt(batchSavings)}/mo savings`,
      savings: batchSavings,
      reason: `At $${fmt(spend)}/mo in ${name} costs, infrastructure-level optimisation delivers meaningful ROI. ${name === "Anthropic API" ? "Anthropic" : "OpenAI"} Batch API cuts per-token costs by 50% for async workloads (results returned within 24 hours — fine for non-real-time pipelines). Prompt caching reduces costs on repeated context by up to 90%. Together these measures typically reduce API spend 30–50% without any change in output quality. At your current spend that is $${fmt(batchSavings)}–$${fmt(Math.round(spend * 0.5))}/mo.`
    };
  }

  // ── CUSTOM CONTRACT BENCHMARK ───────────────────────────────────
  if (pricingData?.[name]?.[plan] === "Custom" && spend > 0) {
    return {
      passed: false,
      title: "Custom Enterprise Contract — Benchmark Before Next Renewal",
      recommendation: `Compare your $${fmt(spend)}/mo against current market rates at renewal`,
      savings: 0,
      reason: `${name} Enterprise uses custom pricing with no public list price to benchmark against. Custom contracts frequently carry 15–30% premiums over what is achievable through competitive negotiation, particularly if signed before the 2025–2026 vendor price wars. If this contract is 12+ months old, request a renewal review and obtain competitor quotes (the audit checks above highlight specific alternatives) to use as negotiation leverage. Even a 10% reduction saves $${fmt(spend * 0.1 * 12)}/yr.`
    };
  }

  // ── GEMINI — ultra vs API for developer workflows ───────────────
  if (name === "Gemini" && plan === "Ultra" && spend > 0) {
    return {
      passed: false,
      title: "Gemini Ultra: Verify You Cannot Cover Needs via the Free API Tier First",
      recommendation: "For code generation or automation tasks, evaluate Gemini API (pay-per-token) vs flat Ultra subscription",
      savings: 0,
      reason: `Gemini AI Ultra ($99.99/mo flat) is a consumer subscription. For programmatic or batch workloads (code generation, data processing, automated research), the Gemini API (pay-per-token) is often cheaper: Gemini 3.5 Flash costs $1.50/M input, $9/M output tokens. If your monthly token consumption translates to less than $99.99 at API rates, switching to the API reduces cost. Calculate your approximate monthly token volume and compare.`
    };
  }

  // ── Copilot Enterprise — surface hidden GitHub Enterprise Cloud cost ─
  if (name === "GitHub Copilot" && plan === "Enterprise") {
    const copilotOnly = 39 * seats;
    const withGHE     = 60 * seats;   // $39 Copilot + $21 GHE per seat
    if (spend < withGHE * 0.92) {
      return {
        passed: false,
        title: "Copilot Enterprise: Confirm GitHub Enterprise Cloud Is Budgeted",
        recommendation: `Full cost for new orgs is $60/seat ($39 Copilot + $21 GHE). Verify your total contract.`,
        savings: 0,
        reason: `GitHub Copilot Enterprise ($39/seat/mo) requires GitHub Enterprise Cloud ($21/seat/mo additional) for new customers — total $60/seat/mo. Your declared spend of $${fmt(spend)}/mo at ${seats} seat(s) suggests you may be tracking only the Copilot line item and missing the GHE component. If GitHub Enterprise Cloud is billed separately, total AI tooling cost is $${fmt(withGHE)}/mo, not $${fmt(spend)}/mo. Verify the complete contract to ensure accurate budget accounting.`
      };
    }
  }

  // Passed
  return {
    passed: true,
    title: "Paying At or Below Official Retail Price",
    recommendation: "No above-retail pricing or API batch opportunity detected",
    savings: 0,
    reason: `Your declared spend of $${fmt(spend)}/mo ${
      expected !== null && expected > 0
        ? `matches official ${name} ${plan} retail pricing ($${fmt(expected)}/mo at ${seats} seat(s) — May 2026)`
        : "is consistent with published pricing for this plan type"
    }. No reseller markup, legacy contract overcharge, or significant API batch optimisation opportunity detected at this spend level.`
  };
}

// ─────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────
export function runAudit(tools, company) {
  const useCase = company?.useCase?.toLowerCase() || "mixed";

  let totalCurrentSpend   = 0;
  let totalOptimizedSpend = 0;

  const auditedTools = tools.map((tool) => {
    const spend = Number(tool.monthlySpend || 0);
    totalCurrentSpend += spend;

    const check1 = checkPlanFit(tool);
    const check2 = checkSameVendor(tool);
    const check3 = checkToolOverlap(tool, tools, useCase);
    const check4 = checkRetailPricing(tool);

    const checks = [check1, check2, check3, check4];

    // Cap total savings at the tool's full spend — can't save more than you pay
    const totalToolSavings = Math.min(
      spend,
      checks.reduce((sum, c) => sum + Math.max(0, c.savings || 0), 0)
    );

    const optimizedSpend = Math.max(0, spend - totalToolSavings);
    totalOptimizedSpend += optimizedSpend;

    return {
      ...tool,
      currentSpend: spend,
      optimizedSpend,
      savings: totalToolSavings,
      checks
    };
  });

  const totalSavings = Math.max(0, totalCurrentSpend - totalOptimizedSpend);

  return {
    auditedTools,
    totalCurrentSpend,
    optimizedSpend: totalOptimizedSpend,
    totalSavings,
    annualSavings: totalSavings * 12
  };
}
