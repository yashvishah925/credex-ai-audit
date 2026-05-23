/**
 * CREDEX AI AUDIT — PRICING DATA
 * Prices in USD, verified May 2026.
 * Plan names match exactly what the form dropdowns show.
 * Sources cited in PRICING_DATA.md.
 *
 * Pricing is per-seat per-month (monthly billing) unless noted.
 * "Custom" = enterprise negotiated, no public list price.
 * 0    = free tier or usage-billed (no flat monthly fee).
 */

export const pricingData = {

  // ── CURSOR ─────────────────────────────────────────────────────
  // Source: cursor.com/pricing — verified May 2026
  // Hobby: free  |  Pro: $20/seat/mo  |  Business: $40/seat/mo  |  Enterprise: custom
  Cursor: {
    Hobby:      0,
    Pro:        20,
    Business:   40,
    Enterprise: "Custom"
  },

  // ── GITHUB COPILOT ─────────────────────────────────────────────
  // Source: github.com/features/copilot/plans — verified May 2026
  // Individual (Pro): $10/seat/mo  |  Business: $19/seat/mo  |  Enterprise: $39/seat/mo
  "GitHub Copilot": {
    Individual: 10,
    Business:   19,
    Enterprise: 39
  },

  // ── CLAUDE (Anthropic) ─────────────────────────────────────────
  // Source: anthropic.com/pricing — verified May 2026
  // Free: $0  |  Pro: $20/mo  |  Max: $100/mo (Max 5x entry tier)
  // Team: $25/seat/mo monthly (5-seat minimum)
  // Enterprise: custom  |  API Direct: pay-per-token, no flat fee
  Claude: {
    Free:         0,
    Pro:          20,
    Max:          100,    // Claude Max 5x — $100/mo; Max 20x = $200/mo same family
    Team:         25,     // $25/seat/mo monthly; $20/seat/mo on annual billing
    Enterprise:   "Custom",
    "API Direct": 0
  },

  // ── CHATGPT (OpenAI) ───────────────────────────────────────────
  // Source: openai.com/chatgpt/pricing & openai.com/business/chatgpt-pricing — May 2026
  // Plus: $20/mo  |  Team (Business): $30/seat/mo monthly ($25/seat annual)
  // Enterprise: custom  |  API Direct: pay-per-token
  ChatGPT: {
    Plus:         20,
    Team:         30,     // OpenAI Business plan, $30/seat/mo monthly; $25/seat annual
    Enterprise:   "Custom",
    "API Direct": 0
  },

  // ── ANTHROPIC API ──────────────────────────────────────────────
  // Source: anthropic.com/api — verified May 2026
  // No flat subscription. Pay-per-token only.
  "Anthropic API": {
    "API Direct": 0
  },

  // ── OPENAI API ─────────────────────────────────────────────────
  // Source: platform.openai.com/pricing — verified May 2026
  // No flat subscription. Pay-per-token only. Batch API = 50% off.
  "OpenAI API": {
    "API Direct": 0
  },

  // ── GEMINI (Google) ────────────────────────────────────────────
  // Source: one.google.com/about/plans — verified May 2026 (post Google I/O 2026)
  // Pro = Google AI Pro: $19.99/mo
  // Ultra = Google AI Ultra: $99.99/mo (cut from $249.99 at Google I/O May 20, 2026)
  // API = pay-per-token, no flat fee
  Gemini: {
    Pro:   19.99,
    Ultra: 99.99,
    API:   0
  },

  // ── WINDSURF (Codeium) ─────────────────────────────────────────
  // Source: windsurf.com/pricing — verified May 2026
  // March 19, 2026 overhaul: Pro $15→$20, Teams $30→$40
  // Free: $0  |  Pro: $20/mo  |  Teams: $40/seat/mo
  Windsurf: {
    Free:  0,
    Pro:   20,
    Teams: 40
  }

};
