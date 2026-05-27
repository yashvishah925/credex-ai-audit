# Credex AI Audit Platform

Credex AI Audit is a full-stack AI spend optimization platform built for startups and modern engineering teams to analyze AI software subscriptions, detect redundant spending, and generate actionable savings recommendations across tools like ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, and Windsurf.

The platform provides a real-time audit engine, AI-generated executive summaries, shareable audit reports, transactional email delivery, and persistent lead capture using Supabase + Resend infrastructure.

---

# Live Demo

Deployed URL:https://credex-ai-audit-app.vercel.app/


GitHub Repository:https://github.com/yashvishah925/credex-ai-audit



# Features

## AI Spend Audit Engine
- Multi-tool AI stack analysis
- Detects plan oversizing
- Finds cheaper vendor alternatives
- Evaluates annual billing savings
- Flags API vs retail inefficiencies

Supported platforms:
- Cursor
- GitHub Copilot
- Claude
- ChatGPT
- Anthropic API
- OpenAI API
- Gemini
- Windsurf

---

## Dynamic Audit Logic
The audit engine evaluates:
- Plan fit based on seat count
- Same-vendor pricing optimization
- Alternative tool overlap
- Retail vs API credit inefficiencies

All pricing logic references official vendor pricing pages verified in May 2026.

---

## AI-Generated Executive Summary
Uses Anthropic Claude API to generate:
- Personalized audit summaries
- Cost optimization insights
- Executive-ready reporting language

Fallback templated summaries are used during API failures.

---

## Shareable Public Audit URLs
Every audit generates:
- Unique public share link
- Sanitized public-facing report
- Open Graph + Twitter preview metadata

Sensitive lead information is stripped from public reports.

---

## Persistent Form State
Audit form data persists automatically using:
- localStorage persistence
- reload-safe recovery

---

## Lead Capture + Backend
Built with:
- Supabase database
- Resend transactional email delivery
- Client-side rate limiting
- Honeypot anti-spam protection

---

# Tech Stack

## Frontend
- React
- Vite
- React Router
- TailwindCSS

## Backend
- Express.js
- Node.js

## Database
- Supabase

## Email Infrastructure
- Resend

## AI Integration
- Anthropic Claude API

## Deployment
- Vercel

---

# Folder Structure

```bash
src/
 ├── components/
 ├── pages/
 ├── data/
 ├── utils/
 ├── lib/
 └── assets/

server/
 ├── index.js
 └── api/

docs/
 ├── ARCHITECTURE.md
 ├── DEVLOG.md
 ├── GTM.md
 ├── ECONOMICS.md
 ├── PROMPTS.md
 └── REFLECTION.md
