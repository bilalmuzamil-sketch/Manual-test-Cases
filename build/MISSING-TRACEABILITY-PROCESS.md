# Missing-Traceability Process (reusable, any project/feature)

> **Plain-English purpose:** make sure EVERY test case is 100% authentic — i.e. provably
> linked to (a) the Jira ticket(s) it belongs to and (b) the exact spec section it derives
> from. This process **finds the cases that are missing either link and backfills them** (in
> the metadata layer only), so no case is left unsourced.
>
> This enforces **CLAUDE.md Standing Rule 20** (test-case authenticity = full traceability).
> Apply it to any project **WHEN THE USER ASKS**, and always as a sub-step of a spec-recheck or
> VIU pass. Ties to build/SPEC-RECHECK-PROCESS.md + build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md.

## What "traceable" means (the bar)
A case is **Traceable** only if BOTH are present and correct:
- **Ticket link** — the Jira key(s) the case belongs to, in the TestRail case **References
  (`refs`)** field (and mirrored in the per-project `testrail-id-map.csv` / findings).
- **Spec anchor** — the exact spec section/requirement the case derives from, in the QA-side
  records (findings `citation`, coverage matrix, audit log).
Both live in the **metadata layer, NEVER the tester-facing Title/Preconditions/Steps/Expected**
(Rules 7 & 9 keep those jargon-free).

## When to run
- On demand ("check missing traceability for [project]").
- Automatically inside any **spec-recheck** or **VIU** pass (add the check to the change-list).
- After a bulk import/authoring pass, before declaring the suite tester-ready.

## The 6 steps
1. **Enumerate the full case set in scope** (Standing Rule 17 — 100%, no sampling). Pull every
   case: locally from `cases/*.json` (or `cases-<date>/C*.json`) and live from TestRail
   (`get_case` / `get_cases`) so you see the real `refs` field.
2. **Classify each case** into one of:
   - **Traceable** — has both a valid ticket ref and a spec anchor.
   - **Missing-ticket** — no `refs` / no Jira key.
   - **Missing-spec** — no spec section anchor in the QA records.
   - **Missing-both**.
   (A ref that points at a wrong/obsolete ticket = Missing-ticket; verify the key resolves.)
3. **Derive the correct source for each gap** — from the current spec + all Done Jira tickets
   (newest-wins), the ticket→behaviour map, and the coverage matrix. If the behaviour the case
   asserts is uncertain, **live-verify on the build** (Rules 12/13) before assigning a source.
   **Never invent** a ticket/spec anchor: if a case genuinely maps to no ticket AND no spec,
   flag it as **Orphan** (candidate for a new ticket, a spec gap, or retirement) — a human
   decides; do not fabricate a link to look complete.
4. **Deliver a simple "Missing Traceability" list** (this is the sign-off view) — one row per
   gap: Case ID + TestRail link | Area | Gap type (Missing-ticket / -spec / -both / Orphan) |
   Proposed ticket key(s) (+ Done/Not-Done) | Proposed spec section | Confidence | Action
   (Backfill / Decision needed for Orphans). Omit already-Traceable cases (report the count).
5. **Backfill only after explicit go-ahead** (Standing Rule 6). For each approved case:
   set the TestRail **`refs`** field via `update_case` (get → add/merge the key(s) → re-read to
   verify), and record the spec anchor in the QA records (id-map / findings / coverage matrix).
   **Do not touch the tester-facing fields.** Per-case **audit log** (before→after refs +
   the ticket + spec cited). Honor any freeze list.
6. **Report the counts** (Standing Rule 17): total in scope / Traceable / backfilled /
   Orphans-flagged — so completeness is verifiable at a glance.

## Deliverable format (keep it simple — Standing Rule 16)
File: `<Project>_MissingTraceability_<date>.xlsx` (+ `.md`). Columns: Case ID | TestRail link |
Area | Gap type | Proposed ticket (Done/Not-Done) | Proposed spec section | Confidence | Action.
Mirror the change-list layout from SPEC-RECHECK-PROCESS.md.

## Reusable tooling
- TestRail: `build/testing-tools/testrail-api.mjs` — `getCase` (read `refs`), and
  `api('update_case/<id>', {method:'POST', body:{refs:'SV-XXXX'}})` to backfill. Creds in
  `/tmp/testrail/creds.json` only.
- Jira/spec: Atlassian MCP (resolve/confirm ticket keys, read the spec section).
- Live build (when behaviour must be confirmed before assigning a source): the boot2 harness.

## Guardrails
- **Metadata layer only** — refs + spec anchors never go into tester-facing wording.
- **Never invent a link** — an unmatched case is an Orphan for a human to resolve, not a
  fabricated ref (this protects authenticity; a fake link is worse than a flagged gap).
- **Never write TestRail without explicit per-run permission**; honor freeze lists; audit log.
- **No secrets in git** — cookies/creds live only under `/tmp`.
