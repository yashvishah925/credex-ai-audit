# Automated Tests

## Test Framework

The audit engine tests are written using:

- Vitest
- Node.js assertion logic

Run all tests with:

```bash
npm run test
```

---

# Test Files

## tests/auditEngine.test.js

This file validates the financial recommendation logic inside the audit engine.

---

# Covered Test Cases

## 1. Detects unnecessary enterprise/team plans

Input:
- ChatGPT Team
- 1 seat

Expected:
- recommendation to downgrade to ChatGPT Plus
- positive savings value returned

Purpose:
Ensures the engine identifies overprovisioned business plans.

---

## 2. Detects overlapping subscriptions

Input:
- ChatGPT Plus
- Claude Pro

Expected:
- overlap optimization recommendation

Purpose:
Ensures the engine flags redundant tooling spend.

---

## 3. Handles already optimized stacks

Input:
- ChatGPT Plus
- correct seat allocation

Expected:
- low or zero savings recommendation
- “You’re spending well” style outcome

Purpose:
Prevents fake or inflated savings generation.

---

## 4. Calculates annual savings correctly

Input:
- monthly savings value

Expected:
- annual savings = monthly × 12

Purpose:
Ensures financial calculations remain accurate.

---

## 5. Detects excessive enterprise licensing

Input:
- GitHub Copilot Enterprise
- small team size

Expected:
- downgrade recommendation to Business or Individual

Purpose:
Ensures enterprise overuse detection works properly.

---

# Additional Manual Validation

The following flows were manually tested:

- email submission flow
- Supabase lead storage
- shareable public URLs
- anonymous public report rendering
- AI summary fallback behavior
- responsive mobile layouts
- routing between all pages

---

# How To Run Tests

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm run test
```

Run linting:

```bash
npm run lint
```