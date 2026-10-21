# SV-10673 — Switch every ShopCoach feature to GPT-5.6 Luna (QA, 21 Oct 2026)

**Verdict: PARTIALLY PASSED** — Jira comment 79182 (1 exhibit, 12 rows) + remaining-items comment 79183 to Parth.
Branch `sv10673` build `v26.40.3-df33ae5` (index.html last-modified Fri 02 Oct 2026 10:16:01 GMT, etag
`feace1f6e88c8a3a69ddd1f5ae501673`), re-read before posting.

## Why not green
- The model is chosen in the separate ShopCoach service (`api/src/External/ShopCoach/Infrastructure/Http/ShopCoachClient.php`
  sends `POST {SHOPCOACH_API_BASE_URL}/api/assistant/{assistant}/run`; SV-4392 moved model/system_message off the app).
  No response, header or app screen names the model, and the shopview repo has no SV-10673/Luna PR (branch
  `SV-10673-improve-techstory-in-shopcoach` is 0 commits ahead of main). Model identity cannot be observed from QA.
- The branch front end is the 2 Oct build — the one Parth said carried the Tech Story improvements (comment 77778);
  Chris narrowed scope to the model only on 5 Oct (77902). Asked Parth to confirm/redeploy.
- Done criterion = Lee's 18-case baseline on both models (78701); the baseline page (Confluence 859406338 v2) is a draft
  method with no case contents. Not run.

## Feature matrix (same wording on sv10673 and production; `ev/run-branch.json`, `ev/run-prod.json`)
All ten assistants from `app/src/api/shopcoach/ShopCoachModel.ts` answered `assistant.completed` on the branch:
line-builder-v2, recommend-work, vehicle-history, suggest-story, improve-story, summary, estimate, parts,
analyze-line, estimate-new-line. Line Builder, ShopCoach Analysis and Improve Story were also driven on screen.
One branch call to recommend-work earlier returned "OpenAI Error [503] … overloaded"; the rerun completed.
Branch response times 0.6–11.7 s; production 0.4–6.1 s on the first run (production answered identical repeats in
~0.5 s, so it caches) — not used as evidence of the model.

## Observations raised to the QA lead (not put in Jira as faults — Rule 97(d))
- Suggest Story / Improve Story add **"Job complete."** to notes that never say it, on a line that is not complete —
  on **both** production (S2-984, line "Office User", authorized) and the branch (S10673-17583). Production also turns
  "test drove ok" into "operation normal". The ticket says such cases get their own ticket.
- ShopCoach Analysis on production suggested an invented story for S-988 ("Performed ZZAUTOTEST on SV-9016 to diagnose
  issues. The test indicated potential faults…"); on the branch it suggested "Job complete." for an authorized line.

## Test data
Production: improve-story previewed on S2-984 (not saved). Nothing saved on the branch (Save Story never clicked).

## Gate
Build marker re-read; ticket re-read (TESTING QA, newest comment Chris 78702); image uploaded as attachment and read
back; non-green panel confirmed on the posted comment; no technical section; no recording.
Learning check: new recipe — ShopCoach assistants are all `POST /api/shopcoach/run-assistant {assistant, parameters}`;
list + parameters in `app/src/api/shopcoach/ShopCoachModel.ts`; the model is not visible to QA (external service).

## Update 07:05 CDT — model confirmed (comment 79182 edited in place, dated notes)
- Parth (79184): use the ShopCoach QA admin; the build now has only the model change (Tech Story improvements removed).
- ShopCoach admin `feature.shopcoach.shopview.com` (Google sign-in; access = the five site cookies, playbook §AL):
  `GET /admin/assistant/<name>/config` → all 11 assistants `provider openai, model gpt-5.6-luna` (`ev/configs.json`).
  `GET /api/audit-logs?type=assistant&name=<name>` → my sv10673 runs today (org Staging Foothills Group Inc, Heavy Duty
  9919, WO 3ba1c92e…) logged `gpt-5.6-luna` for recommend-work, vehicle-history, suggest-story, improve-story, summary,
  estimate, parts, estimate-new-line (`ev/runs_today.json`). line-builder-v2 (`llm_call_parse` + `llm_calls_enrich`) and
  analyze-line (`llm_calls_parallel` story/estimate/parts) don't record the model name in their steps.
- **"Job complete." is the configured prompt, not invention:** the Improve Story system message ends
  `Output only the revised text, ending with: "Job complete."`. The QA-lead question about filing it is withdrawn.
- Status stays PARTIALLY PASSED only for Lee's 18-case baseline (row 12).
