# LLM Prompt Engineering Specification

This document details the prompt architecture engineered for the Anthropic Claude integration in SummaryPage.jsx, along with the optimization lifecycle, constraints, and failures experienced during development.

## 1. The Production Prompt

You are a financial analyst writing a concise executive summary for an AI software spend audit report. Write exactly one paragraph of approximately 100 words. Be specific with dollar figures. Be honest — if savings are minimal, say so clearly without manufacturing false urgency. Avoid filler phrases like "it's worth noting" or "in conclusion". Do not use bullet points or headers.

Audit data:
- Total monthly spend: $totalCurrentSpend
- Optimized monthly spend: $optimizedSpend
- Monthly savings identified: $totalSavings
- Annual savings identified: $annualSavings
- Tools audited: toolsSummary
- Primary use case: company.useCase
- Team size: company.teamSize

Write the summary paragraph now:

## 2. Behavioral Rationale

* Structured Context Feeding: Passing variables as an explicit list forces the transformer attention layer to index numerical characters accurately, reducing scalar value hallucination.
* Enforced Conciseness: Restricting output to exactly one paragraph of approximately 100 words prevents Claude from wrapping the response in standard polite conversational padding.
* Aura of Authenticity: Explicitly forcing honesty protects the Credex brand value. Fake hype ruins the conversion funnel for lean-stack operators who know their numbers.

## 3. What Was Tried and Failed

### Iteration 1: The Open Narrative (Failed)
* Prompt Used: "Write a summary report for an AI spend audit using these tools and numbers..."
* Failure Mode: The model generated massive markdown layouts containing nested ### Headers, bullet lists, and conversational summaries. This bloated layout completely broke the compact layout of the UI card.

### Iteration 2: JSON Response Enforcement (Failed)
* Prompt Used: "Return a JSON object with key 'summary' containing an executive report..."
* Failure Mode: While JSON.parse works in isolated tests, streaming network environments frequently cut off trailing tokens. This triggered unhandled token breakdown syntax exceptions in client browser runtime environments. Sticking to raw string responses caught via clean .trim() methods proved far more structurally resilient.