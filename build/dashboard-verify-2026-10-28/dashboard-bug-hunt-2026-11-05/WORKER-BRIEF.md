# Dashboard bug hunt, 5 Nov 2026: worker brief

## The order
QA lead, 5 Nov 2026, verbatim:
> "Can you check if you can still find any bugs/defects related to dashboard, I do not want anyone to be able to find a bug which we missed to report."

Then:
> "I wont be able to answer your questions, you have to continue unattended as I am goingt o sleep, you have all my authority to unblock yourself."

You are the worker. The coordinator (the session that spawned you) verifies your evidence and files the tickets. **You do NOT create Jira tickets or post Jira comments yourself.** You draft them (see the end of this brief).

## Read first (your rule book: this repo, your own branch only; Rule 98)
1. `/home/user/Manual-test-Cases/CLAUDE.md`, the index. Pay special attention to:
   - Rules 12, 57, 58, 94, 97, 99, 100, 103 (and its 5 Nov amendments: annotated screenshot; epic at creation);
   - Rule 82 (secret scan before every commit; this repo is PUBLIC);
   - Rule 29 (commit and push after every step, `git add -- <paths>` only).
2. `build/skills/TOKEN-DISCIPLINE-CHARTER.md` (12 clauses; never bulk-read, script it; never poll).
3. `build/skills/09-TEST-EXECUTION.md` and `build/skills/06-DEFECT-PREP.md`.
4. `build/APP-ACTIONS-PLAYBOOK.md`: grep it, don't read it whole. Relevant sections:
   - "QA-branch seeding & screen recipes proven on sv11839";
   - "How to unblock yourself: methods proven 4–5 Nov 2026".
5. The Dashboard PRD as read: `build/dashboard-verify-2026-10-28/PRD-Dashboard-v1-read-2026-10-28.md`.
   - Confluence page 788430850, v53, unchanged since 22 Oct. **Re-check that the version is still 53 before relying on it (Rule 59).**
   - Stories 1–12: access, layout, formulas, KPI tiles, count tiles, expanding, date ranges, chart filters, chart behaviour, report drill-in, chart on report page, visual conformance.
6. Chris Ward's answers (an expectation source):
   - `build/dashboard-verify-2026-10-28/chris-answers-2026-10-29/ANSWERS-AND-DASHBOARD-IMPACT.md`;
   - `chris-answers-2026-11-04-section3-verbatim.md`.

## What has ALREADY been done: do not repeat it (Rule 80; never re-do work)
- **28 Oct, staging:** full calculation pass, layers A/B/C/L1. See `RUN-STATE.md` and `ShopView-Dashboard-and-Reports-Full-Check-2026-10-28.md`.
- **4 Nov, sv11839:** same layers: `rerun-sv11839-2026-11-04/SUMMARY-sv11839-2026-11-04.md`.
  - Result: every tile equals its report; independent recompute matches; preset dates, wording, expanded panels and chart filters were checked.
  - Observations O1 (no comma in percentages ≥ 1,000) and O2 (remembered technician filter) are already known.
- **Dashboard tickets already in epic SV-11839:** SV-11820..SV-11829, SV-11931..SV-11934, SV-11691, SV-11885, SV-11822, SV-12199, SV-12201, SV-12202 (all QA Complete), and SV-12146.
  - Also SV-11688 (never-clocked-out timesheets in Technician Utilization).
  - **Before calling anything new, search Jira for a duplicate:** JQL `parent = SV-11839`, `parent = SV-11936`, and text search.

## Your job: hunt where the earlier passes did NOT look
Every finding needs:
- an expectation from a **document** (PRD story/requirement quote, or Chris's answer), never from the build (Rule 57);
- a reproduction **on screen** (a customer must be able to see it);
- Rule 99 zones matched and recorded.

1. **Reconcile first (cheap, high value).** Go through Chris's answers, the defect pack (`defect-pack-2026-10-28/`, including `NOT-FILED.md`), `tickets-2026-10-29/` and the 4 Nov summary.
   - List every item Chris called a **defect** (or that the PRD makes a defect) that touches the **Dashboard**.
   - Check each one has a Jira ticket.
   - Any confirmed Dashboard defect with no ticket is a **missed report**. Draft it.
2. **Day boundary / time zone (highest risk).** This class of bug was found elsewhere: deposits SV-11970/SV-12161, remittance SV-12207, Parts Velocity SV-12202.
   - Test whether a sale made when the location's date differs from the UTC date lands on the right day in every tile and every preset (Today, Yesterday, This Week, This Month, …) and in the drill-in report.
   - **Windows on sv11839:**
     - **DVI Test** (Pacific/Fiji, id 93404b24-8d43-4459-b152-513e64e2ad81): its date is ahead of UTC whenever UTC is 12:00–23:59. That is NOW. It was created by us; seed freely there.
     - **Test Location** (Asia/Karachi): ahead of UTC from 19:00 UTC.
     - **Staging Heavy Duty - 9919** (America/Edmonton, UTC−7): behind UTC from 00:00 to 07:00 UTC.
   - Use at least one ahead-of-UTC zone and, if time allows, Edmonton.
   - Seed ZZAUTOTEST work orders and invoices in the window. Read the tiles at once, and again after the UTC date catches up.
3. **Report drill-in (Story 10) and chart on the report page (Story 11).**
   - Does each tile's link open the right report with the **same** date range, location and filters?
   - Does the report show the same figure?
   - Back-navigation and remembered state.
4. **Access (Story 1).**
   - Non-admin roles: a technician, and a role without report permission.
   - Use **staging**, where `build/testing-tools/staging-boot2.mjs` quick-login is allowed. **Never** use quick-login or switch-user on a QA branch.
   - What does the PRD say each role sees? Is that what they see?
5. **Expand / date range / chart filters / chart behaviour (Stories 6–9)**, on the parts not covered on 4 Nov:
   - per-tile date memory across reloads and location switches;
   - custom range edges (a single day; a range ending today; a future date);
   - empty states and the PRD's empty-chart rule;
   - tooltip values equal the table.
6. **Location switch:** no stale figures from the previous location; per-location memory as the PRD says.
7. **Visual conformance (Story 12)** at 1920, 1536, 1280, 1024 and a phone width, light and dark mode.
   - Look for text cut off, overlaps, unreadable colours and misaligned numbers.
   - Compare with what the PRD/design requires. Not looking nice is not a defect.
8. **Money edge cases:** a voided invoice, a reversed invoice, a credit memo, a refund, a deposit, a $0 invoice and a part-sale-only invoice. Check each one's effect on every tile against the PRD formulas (Story 3) and Chris's answers.

## Environments and access
- **QA branch sv11839:**
  - app https://sv11839.qa.shopview.com, API https://sv11839api.qa.shopview.com.
  - Read the build from `meta[name="app-version"]` and record it. Expected v26.45.0-277b249 or newer.
- **Cookies:**
  - sv11839: `/tmp/cln/qa11839/cookies.json` (QA lead's, chmod 600). Boot with `build/testing-tools/qa-branch-boot.mjs`, or reuse `build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04/tools/common.mjs` (`boot(loc)` does the Rule 99 change-location + timezone + localStorage).
  - Staging: `/tmp/cln/cookies.json` via `build/testing-tools/staging-admin.mjs` / `staging-boot2.mjs`. Quick-login was proven working today.
- **If the branch is asleep** (redirect to sleep.qa.shopview.com): wake it with toggleQaEnv; it's in the playbook. Wait, don't poll in a tight loop.
- **Seeding recipes:** `sv11839-ticket-qa-2026-11-04/tools/` and `sv11839-ticket-qa-2026-11-05/tools/` (seed_qa.py, seed_12202.py, sale_12202.mjs, exp.mjs …). Log every seed call to your `seed-log.jsonl`.
- **Never** print cookies or tokens; never commit them. Throwaway data is tagged ZZAUTOTEST. Restore anything you change on shared records.
- **Chromium:** `/opt/pw-browsers/chromium`; playwright at `/opt/node22/lib/node_modules/playwright/index.js`. Screenshots a person will see: deviceScaleFactor 2.
- **Annotated pictures:** `build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04/tools/annotate.py`. Put labels where they don't cover data; a numbered legend in a white strip works well.

## Output: write everything under `build/dashboard-verify-2026-10-28/dashboard-bug-hunt-2026-11-05/`
- `RESULTS.md`: one table per area above, with what was checked, PASS/FAIL/NOT VERIFIED and the evidence path. Say plainly what was NOT covered and why.
- `RECONCILE.md`: every Dashboard-relevant confirmed defect, with its ticket key or "MISSING".
- **One folder per candidate defect** `D<n>-<slug>/` containing:
  - `TICKET.html`: a Jira description in plain words for a first-time reader (Rule 100). Use the shape of SV-12207/SV-12208: What is wrong · example with the arithmetic · Steps · Actual · Expected with the **document quote** · Where it was seen with build, time and the four zones.
  - `CHRIS-COMMENT.html`: what happens today / what should happen / "fix it, or leave it as it is?", thankful and respectful.
  - the annotated picture(s), and the evidence JSON.
  - a line saying which epic: Dashboard → SV-11839, Reports → SV-11936. Report-only findings: still draft them, marked "Reports".
- **Gate (Rule 94):** draft a defect only if the duplicate search is clean, it was reproduced on screen with zones matched, and the expectation is quoted from a document or Chris's answer.
  - Where the document is silent or ambiguous, write it up as a **question for Chris** (same folder shape, "Expected: to be confirmed by Chris"). Do not guess.
- **Commit and push after every area:**
  - `git add -- <paths>`;
  - `python3 build/testing-tools/scan_secrets.py --staged` must exit 0;
  - branch `claude/credit-memo-document-location-tov2x1`;
  - commit trailer:
    ```
    Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
    Claude-Session: https://claude.ai/code/session_01D95Q7VoyGzYXAt4w5J2bJE
    ```

## Hand-back
Report:
- the table of areas;
- each candidate (folder, one-line what/where, document quote, epic);
- what was not covered;
- commit ids.

Keep it short; the evidence is in the files.
**Quality is never the thing cut. If you cannot test something, say exactly why and what would unblock it.**
