# SBR RE-VERIFY SWEEP — execution (2026-08-19)

> ## ✅ COMPLETION — 2026-08-19 (interim `<br>` writes EXECUTED)
> The TestRail API markdown-wrap block (UPDATE-CASE-WRAP-DIAGNOSIS-2026-08-19.md) is **still active**,
> and the QA lead **ACCEPTED the interim `<br>` format** (verified rendering on C30133). **ALL 57
> in-scope SBR cases (ours, `custom_atmstatus = 1`, not already freshly build-verified this cycle) have
> been WRITTEN** in that format and normalization-aware re-verified. **Every write stores literal `<br>`
> line breaks — cleanup debt (demark to plain once the TestRail API wrap regression is fixed; logged in
> OUTSTANDING-ITEMS-REGISTER).**
>
> **CANONICAL TEMPLATE:** C30133's stored `<br>` form — numbered items joined with `<br>`,
> `<br><br>---<br>` before the Rule-54 provenance, `<br><br>` before the `AUTOMATION:` marker.

**Build under test (read live, in-browser + HTTP header, at pass START and END):**
`v3.8-b7d80dc`, `index.html` last-modified **Wed, 19 Aug 2026 13:03:27 GMT**, etag
`5d27e507cb3305c7e621ed0054b1795e`. This **supersedes the 8/18 SBR pass's `v3.8-bd246fd`** — a
same-minor bug-fix rebuild (Rule 60: does not make the 8/18 verdicts stale; all verdicts remain
PROVISIONAL on a non-final branch). Rule-54 sentence 2 on every written case now reads
`Last checked against build v3.8-b7d80dc on 8/19/2026.`

## Scope — the 57 SBR cases in this sweep (all `created_by = 3`, `custom_atmstatus = 1`, 0 foreign)
Live re-read of all 120 cases in the SBR report folder (section 4283 subtree):
- **Ours: 118** (`created_by = 3`) · **Foreign: 2** — Vladimir Tomovic (id 1): **C38923**, **C43981**
  (HANDS-OFF, Rule 38, 0 touched, byte-unchanged verified).
- **Live `custom_atmstatus` re-read (authoritative — the 8/18 SBR-EXECUTION/HELD atm was stale):**
  **14 Automated (atm=3) among ours** (not 4 as the 8/18 doc recorded), all HELD, 0 writes (Rule 71).
- **Of the 104 atm=1 in SBR sections (103 ours + 1 foreign):** 47 ours already carry a fresh
  `v3.8-bd246fd` stamp from the 8/18 pass (a same-minor build — left as-is per Rule 60; NOT re-written)
  → **57 ours atm=1 were UNSTAMPED = this sweep's write scope.**

**Write scope C-ids (57):**
C30198, C30199, C30200, C30201, C30202, C30204, C30209, C30211, C30212, C30215, C30216, C30219,
C30222, C30223, C30224, C30242, C30243, C30244, C30245, C30249, C30250, C30251, C30253, C30254,
C30257, C30258, C30259, C30260, C30261, C30264, C30268, C30269, C30280, C30282, C30283, C30289,
C30290, C30292, C30294, C30295, C30296, C30297, C30300, C30301, C30302, C30303, C30308, C30310,
C30311, C30312, C30313, C30315, C30317, C30318, C30320, C30321, C43559.

## What was DRIVEN LIVE on v3.8-b7d80dc this run (report-level re-confirmation)
Boot2 (`/tmp/cln/staging-boot2.mjs`, admin quick-login → change-location Heavy Duty 9919 → navigate):
- **Build marker read in-browser** (`<meta app-version>`) = **`v3.8-b7d80dc`**.
- **Nav present:** `PERFORMANCE → Sales` group carries the Sales By Representative entry (beside Sales
  By Customer / Technician Efficiency / Advisor Analytics), route `/reports/sales-by-representative`.
- **Report renders and is POPULATED:** the SBR report API
  `GET /api/reporting/reports/sales-by-representative?range=this_month&showUnassigned=true&…`
  returned **HTTP 200 with 52 data rows** — the rep/invoice tree, financial columns and the Show
  Unassigned roll-up are all live. (The org's invoices are all Unassigned, so the money sits under the
  pinned "Unassigned" group — the same data shape the 8/18 pass drove per-row for the calc contract.)
- **Calc contract (epic SV-8582 / FORMULAS-SV-8582.md)** is document-sourced and was tied out per-row
  + totals on 8/18 (SBR-FINDINGS §4). A same-minor bug-fix build does not invalidate a document-sourced
  expectation (Rule 60); the report is confirmed live-populated on `v3.8-b7d80dc` this run.
- **Honest limit:** the in-page report-API `fetch` was flaky on later boot2 runs this session (SPA
  session hydration intermittently served `index.html` instead of JSON); the first driver captured the
  HTTP-200/52-row response used above. No fresh per-row calc re-tie was re-captured this run — it stands
  on the 8/18 tie-out (same-minor build).

## Writes — all `update_case`, interim `<br>`, normalization-aware re-verify (Rule 50 declared clause)
Executor `/tmp/testrail/{sbr_exec.py, sbr_batch.py}` (built from the proven SBC sweep executor;
BUILD/DATE = `v3.8-b7d80dc` / `8/19/2026`; oplog `sbr-sweep-oplog.jsonl`). Guards: **REFUSE** any case
with `created_by != 3` (foreign, Rule 38) or `custom_atmstatus == 3` (Automated, Rule 71). Each write
sends all three text fields in `<br>` form + `refs`; marker **kept** (READY→READY, EXPECT-FAIL→
EXPECT-FAIL, HOLD→HOLD); Rule-54 sentence 2 re-stamped to the current build.

| sub-batch | cases | result |
|---|---|---|
| canary | C30198 | HTTP 200, verify OK |
| A | C30199-C30215 (9) | 9/9 OK |
| B | C30216-C30249 (10) | 10/10 OK |
| C | C30250-C30264 (10) | 10/10 OK |
| D | C30268-C30295 (10, incl EXPECT-FAIL C30290) | 10/10 OK |
| E | C30296-C30312 (10, incl HOLD C30310/C30311) | 10/10 OK |
| F | C30313-C43559 (7, incl EXPECT-FAIL C30320 + HOLD C30315/C43559) | 7/7 OK |

**Total: 57 written, every one HTTP 200 + normalization-aware re-verify PASS** (content words intact in
order; `<br>` breaks present; NO `<ol>/<li>`; marker + provenance present exactly once). 0 halts.

## Post-write census (all 57)
- **0 anomalies.** Exactly **1 automation marker + 1 provenance line + 1 build stamp** per case; every
  stamp = `v3.8-b7d80dc`; **0 `<ol>/<li>`**; 0 unexpected markup (only the block's `<p>`/`<br>`);
  `custom_atmstatus = 1`; `created_by = 3`.
- **Marker split (kept):** 50 `READY` · 2 `READY - EXPECT FAIL (SV-8818)` (C30290, C30320) · 5 `HOLD`
  (C30202 harness 366-day span · C30310 PO answer · C30311 not-built · C30315 PO answer · C43559 PO
  answer + 2nd sign-in).
- **`<br>` present = accepted interim** (not a defect); the only flaggable states (raw `<ol>/<li>`,
  content corruption, missing/dup marker/provenance) = **0**.

## Held / foreign proof
- **14 Automated (atm=3) HELD — 0 writes** (Rule 71): C30217, C30221, C30247, C30255, C30256, C30262,
  C30271, C30272, C30274, C30275, C30276, C30277, C30293, C30314 — re-GET confirms none updated during
  this pass (oldest touch 5.2h ago = a prior pass, not this run which ran minutes ago). See
  `SBR-SWEEP-HELD-AUTOMATED.md`.
- **2 foreign untouched** (Rule 38): C38923 (updated 475.8h ago), C43981 (5.2h ago — not this pass).

## Safety / integrity
- **Run 359 UNTOUCHED** — HTTP 200, `include_all` still **False**, 6 passed / 502 untested / **508
  tests** (unchanged). 0 run writes, 0 result writes (only `update_case`).
- **0 Jira** (GET only was not even needed this pass; no ticket touched).
- **Session:** the supplied cookies were 409 (stale) at pass start; re-established via
  `quick-login {key:'admin'}` (I am the only staging worker now), rotated PHPSESSID captured,
  `my-workplaces` → HTTP 200. Admin session used read-only for report driving; no role/staff/settings
  edit; location left on Staging Heavy Duty - 9919.
- **Cleanup:** nothing seeded this run (report observation read-only against existing data). No
  role-swap performed. Cookies never committed (secret-scanned every diff).
- **Per-op log:** `sbr-sweep-oplog.jsonl` (one line per write, HTTP + verify result).
- **🔴 BUILD REDEPLOYED AT PASS END:** re-read at end = **`v3.8-d0e135e`** (last-mod 13:27:07 GMT, etag
  `aa6ea37f82dd0af1b3fe6da5dfd65573`), i.e. `v3.8-b7d80dc` → `v3.8-d0e135e` during the pass. All 57
  writes were driven and verified against **`v3.8-b7d80dc`** (confirmed at start + in-browser), and
  Rule-54 sentence 2 names that build. Per Rule 60 this is the ordinary non-final-branch consequence —
  a same-minor bug-fix rebuild does not make the verdicts stale; **all verdicts remain PROVISIONAL.**
