# Gemini Workflow (Harness-Based)

This workflow is optimized for token efficiency and stable output quality.

## Quick Start (Fully Automated)
- `npm run gemini:fix -- -Task "..." -Files src/a.ts,src/b.ts`
- `npm run gemini:feature -- -Task "..." -Files src/a.tsx`
- `npm run gemini:review -- -Task "..." -Files src/app/api/chat/route.ts`
- `npm run gemini:learn -- -Task "..." -Files src/components/learn/LearnWizard.tsx`
- `npm run gemini:auth -- -Task "..." -Files src/lib/auth.ts,src/app/auth/signin/page.tsx`
- `npm run gemini:catalog -- -Task "..." -Files src/lib/template-catalog.ts`
- Optional session logging:
  - `npm run gemini:log -- -Mode fix -Task "..." -Note "first pass"`
- Output is generated at `.gemini/session/<timestamp>/`
  - `prompt.md` (first message)
  - `checklist.md` (token/quality guardrails)
  - `next-message.md` (delta-only continuation)

## 1) Start with a bounded objective
- Good: "Fix auth callback redirect loop on `/auth/signin`."
- Bad: "Refactor auth and improve UX and add tests."

## 2) Generate a context snapshot
- Run:
  - `npm run gemini:harness -- -Task "your objective" -Files src/path/a.tsx,src/path/b.ts`
- Use the generated `prompt.md` as your first message.

## 3) Use expert-style iteration
- Request small, verifiable patches.
- Ask for delta-only follow-ups:
  - "Continue from last answer, only remaining edits."
- After each patch, run focused checks only (`npm run lint`, targeted build/test).

## 4) Token budget rules
- Keep one prompt = one objective.
- Refresh context every 20-30 minutes or after big diffs.
- Avoid dumping full files unless absolutely needed.
- Reuse focus file list to reduce irrelevant reasoning.

## 5) Recovery pattern (when output drifts)
- Send:
  - "Reset to objective: <single sentence>. Ignore previous speculative branches."
  - "Return only exact code edits and verification commands."

## 6) Preset behavior
- `fix`: root-cause + minimal patch + regression guard
- `feature`: smallest complete vertical slice
- `review`: findings-first (risks/regressions/tests), then patch guidance
- `learn`: 4-step wizard/state/layout stability
- `auth`: NextAuth/session flow regression safety
- `catalog`: template taxonomy + IndustryCard pattern consistency
