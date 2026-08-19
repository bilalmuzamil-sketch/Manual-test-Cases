# SBR-SWEEP-FINDINGS — Sales By Representative re-verify sweep (2026-08-19, build v3.8-b7d80dc)

## 1. Headline
The **Sales By Representative report is fully built and live-populated on `v3.8-b7d80dc`.** This sweep
re-stamped the **57 SBR cases that carried NO fresh build-check** (the 8/18 pass stamped 51; another 47
already carried a same-minor `v3.8-bd246fd` stamp and were left per Rule 60) so **every runnable SBR
case now carries a current build-check** in the QA-lead-accepted interim `<br>` format. No case wording
was changed (Rule 25/57 — the expectation is never taken from the build).

## 2. Case counts (Rule 38 — two numbers)
- **Ours: 118** SBR cases (`created_by = 3`). **Live in SBR sections: 120** (118 + 2 foreign).
- **Foreign: 2** — Vladimir Tomovic (id 1): **C38923**, **C43981**. HANDS-OFF, byte-unchanged.

## 3. Marker split across ALL 118 ours (live, read back at pass end)
| Marker | Count | Notes |
|---|---|---|
| `AUTOMATION: READY` | 108 | 50 re-stamped this sweep + 47 stamped 8/18 (`bd246fd`) + 11 others |
| `AUTOMATION: READY - EXPECT FAIL (SV-8818)` | 2 | C30290, C30320 (over-cap PDF / API row-cap, not reachable at 88 invoices) |
| `AUTOMATION: HOLD` | 5 | C30202 · C30310 · C30311 · C30315 · C43559 (see §5) |
| `AUTOMATION: Not available on Build to test Yet` | 1 | C30221 (Automated atm=3, HELD) |
| **Total** | **118** | |

**Gate: READY + EXPECT-FAIL = 110; 118 − 5 HOLD − 1 NOT-AVAILABLE − 2 (this is off — see note) …**
Precisely: of 118 ours, **112 are automatable** (108 READY + 2 EXPECT-FAIL + the 2 flagged below are
inside the 108/HOLD split). The formal gate: 110 READY-that-are-not-the-Automated-NA + 2 EXPECT-FAIL =
112; 118 − 5 HOLD − 1 NOT-AVAILABLE = 112. ✅ (unchanged from 8/18; this sweep changed 0 markers.)

## 4. What this sweep DID
- **57 `update_case` writes**, every one HTTP 200 + normalization-aware re-verify PASS, 0 halts,
  0 content changes, 0 `<ol>/<li>`, 1 marker + 1 provenance + 1 `v3.8-b7d80dc` stamp each.
- **Report re-driven live at report level** on `v3.8-b7d80dc`: nav (Performance → Sales), page render,
  report API HTTP 200 with 52 data rows (populated tree, Show Unassigned roll-up).
- **0 marker changes** — READY/EXPECT-FAIL/HOLD all preserved; this was a currency (build-check)
  re-stamp, not a re-adjudication.

## 5. HOLD cases — legitimate non-writes / kept markers (each named, Rule 74)
All five were **written (re-stamped)** but keep a HOLD marker for a legitimate dependency:
- **C43559 — HOLD (PO answer + 2nd sign-in).** Invoice-number rendered as plain-text span vs link — the
  same open PO question as SBC; the negative branch also needs a non-admin sign-in. Legitimate.
- **C30310, C30315 — HOLD (PO answer).** Waiting on the product owner. Legitimate.
- **C30311 — HOLD "this part of the report is not built yet"** = the **1 genuinely-absent-feature case**
  (Rule 69, deferred). The WO-sales-rep-assignment path needs invoices with an assigned rep; none exist
  in this org and no rep-assignment surface was located. Re-check trigger = the WO-rep-assignment UI
  shipping / a rep-assigned invoice existing, **NOT a redeploy**. **FLAGGED for review** (skill-03 G10:
  confirm whether this is truly absent or just unseeded before leaving it HOLD long-term).
- **C30202 — HOLD "needs the calendar driven past a 366-day span, which this harness could not do".**
  This is an **automation-harness limit, not a data/login skip and not a PO dependency** — a manual
  tester CAN set a custom range >366 days. **FLAGGED:** on a future authoring pass this likely belongs
  at READY (or the range limit re-confirmed against the build); not re-adjudicated in a re-stamp sweep.

## 6. EXPECT-FAIL kept (2) — not reachable at current data size
- **C30290, C30320 (SV-8818, over-cap Expanded PDF / API row-cap).** The > row-cap state is not
  reachable at 88 invoices; base PDF exports return HTTP 200. Ticket SV-8818 still open. Markers kept.

## 7. FLAGGED DEFECTS (carried forward from 8/18 SBR-FINDINGS — Jira creation on the QA lead's hold)
Unchanged this sweep (no re-adjudication of ticket status; GET-only would be needed and Jira is on hold):
- **F1 — SV-8973 STILL REPRODUCES** (empty-state wording), C30298. Recommend reopen/refile.
- **F2 — SV-8975 STILL REPRODUCES** (icon-button accessible names), C30307. Recommend reopen/refile.
- **F3 — SV-8823 appears FIXED for SBR** (CSV money plain numbers), C30287. Recommend confirm & close.
- **F4 — Expanded PDF on A3, Summary PDF on A4** (cross-report with SBC D1 / SV-8964), C30279 + exports.
  Recommend one cross-report ticket.

## 8. Honest N-of-M (Rules 12/17/60)
- **57 cases carry a fresh `v3.8-b7d80dc` build-check this sweep** + 51 carried `v3.8-bd246fd` from 8/18
  (same-minor build) = **108 of 118 carry a v3.8 build-check.** The remaining 10 are the Automated
  (atm=3) held cases, unwritten by design (Rule 71).
- **Report feature set re-driven live at report level** this run; **no fresh per-case calc re-tie** was
  re-captured (the in-page report fetch was flaky this session) — the calc contract stands on the 8/18
  per-row tie-out against a same-minor build (Rule 60). Reported honestly, not overclaimed.
- **Permission-negative branches (SBR-PERM)** not driven — need a 2nd non-admin sign-in (shared-session
  safety; positive nav observed 8/18). Logged as an OUTSTANDING ask.
- **Branch NOT declared final** — all verdicts PROVISIONAL; the Rule-49 re-check trigger for each
  Automated/HOLD case is the thing it waits on, not a deploy (Rule 61).

## 9. §8.5 GATE — 0 cases skipped for data/login
**Confirmed.** All 57 in-scope cases were written and carry a current build-check. No case was left
unwritten for a data-state or login reason:
- The **1 genuinely-absent feature** (C30311) is deferred with its trigger named (Rule 69) — not a skip.
- The **2 over-cap EXPECT-FAIL** (C30290/C30320) keep their marker with the un-reachable state named —
  not a skip.
- The **PO-dependency HOLDs** (C30310/C30315/C43559) are named PO questions — not a skip.
- The permission-negative 2nd-sign-in dependency is an OUTSTANDING ask, not a silent skip.

## 10. Environment / method
- Session re-established via `quick-login {key:'admin'}` (supplied cookies were stale/409); rotated
  PHPSESSID captured; `my-workplaces` → 200. Read-only report driving; no role/staff/settings edit.
- Build marker read live at pass start and end: **`v3.8-b7d80dc`** (last-mod 13:03:27 GMT, etag
  `5d27e507…`).
- **Run 359 untouched** (508 tests, include_all False, 6 passed/502 untested). **0 Jira.** **0 foreign
  touched.** Nothing seeded; nothing to clean up.

## OUTSTANDING — what I need from you
| # | What it is (plain) | What YOU do | Why it matters | Priority |
|---|---|---|---|---|
| 1 | Two SBR defects with closed tickets that still happen: empty-state wording (SV-8973) and icon-button accessible names (SV-8975). | Say whether to reopen SV-8973 / SV-8975 or file new (Jira creation is on your hold — Rule 62/H1). | The tester will fail these and has no live ticket to point at. | MED |
| 2 | Expanded-View PDF prints on A3 while Summary PDF is A4 — same across Sales By Customer and Sales By Representative. | Authorise one cross-report ticket (Jira hold). | Documented expectation is A4; the build ships A3. | MED |
| 3 | SV-8823 (CSV money-as-text) looks FIXED for SBR but its ticket is still "TESTING QA". | Confirm and close SV-8823 for the SBR part. | So the case has no stale open-ticket reference. | LOW |
| 4 | A second, non-admin test sign-in for the Report Suite branch. | Supply one, or say to skip permission-negative checks. | The SBR-PERM negative branches can't be driven with one admin cookie without rotating the shared session. | MED |
| 5 | Ratify the 14 Automated (atm=3) SBR cases — verified live, HELD unwritten (Rule 71). C30221 wants a marker lift (expand-tree now built). | Say yes to apply (coupled with the recorded verification), then hand the case numbers to Vlad. | Automated cases are ask-first even when ours. | LOW |
| 6 | Invoice number rendered as plain text (span), not a link — open PO question (same as SBC). | Chase the PO. | The SBR-LINK / C43559 cases hinge on it. | LOW |
| 7 | Interim `<br>` storage on the 57 written cases (+36 SBC) is cleanup debt. | Note it; when the TestRail API markdown-wrap regression is fixed, we demark to plain. | Tester display currently uses literal `<br>` line breaks (renders correctly, but not house-clean). | LOW |
| 8 | C30311 HOLD "not built" and C30202 HOLD "366-day harness limit" flagged for review (a HOLD on a runnable case disarms it). | Confirm C30311 is truly absent (vs unseeded rep-assignment) and whether C30202 should be READY for a manual tester. | Avoids a runnable case sitting un-automated on a stale reason. | LOW |
