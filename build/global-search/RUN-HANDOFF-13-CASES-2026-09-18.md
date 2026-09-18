# HANDOFF → RUN SESSION — Global Search: 13 cases C55718–C55730
### Run these on `sv9160`, record results in run **R415**. 2026-09-18.

**You are the run session.** All 13 are build-verified on `sv9160` build `v26.36.7-069b8c2`
(report: `build/global-search/build-verify-13cases-2026-09-18/REPORT-2026-09-18.md`). All 13 are
runnable, render clean, build-stamped, seeded and verified present. Your job: execute each case,
mark **Passed / Failed / Blocked** in run **R415**, and handle any deviation under your own rules.

- **Scope:** Permissions & scoping — C55718, C55719, C55720, C55721, C55722, C55723 (6734, 6726).
  Search algorithm — C55724, C55725, C55726, C55727, C55728, C55729, C55730 (6726, 6725).
  All `created_by=3`, none Automated, none Vladimir's.
- **Run:** **R415** — <https://shopview.testrail.io/index.php?/runs/view/415>.
- **🔑 RESULT-WRITE GO-AHEAD:** the QA lead has asked for these results to be recorded in R415 — that
  is your explicit go-ahead for **result writes on R415 only** (Rule 6). It does **not** extend to
  editing case bodies, other runs, or any Jira/external artefact. Use
  `build/testing-tools/push_results_to_run.py` (playbook §W), never a hand-rolled result write, and
  sync the run **union-only** (Rule 34 — a partial `case_ids` list deletes tests and their results).
- **Branch:** `https://sv9160.qa.shopview.com` ONLY (dummy QA branch, full CRUD authority, Rule 107).
  Not staging, not production.
- **Access:** `source build/testing-tools/ensure_bridge.sh`; fresh `sv_sso_session` in
  `/tmp/qa-cookies/sv9160-sso.txt` (chmod 600, /tmp only, NEVER committed — Rule 82); then
  `node build/testing-tools/qa-branch-boot.mjs sv9160 <route> admin`. Palette walker:
  `build/global-search/probe_gs_surfaces.mjs`. Labels: `build/OBSERVED-UI-LABELS-sv9160.md`.
- **First, prove the data is there** (redeploys wipe it): `cd build/global-search/seeding &&
  python3 status.py`. If the marker has moved off `v26.36.7-069b8c2`, `./reseed_everything.sh qa`
  and allow OpenSearch a moment to index. A record can look absent for a few seconds after seeding.

## Permissions & scoping (C55718–C55723)
Reset a role To Template before assigning it (Settings → Roles & Permissions → role → Edit → Reset To
Template → Save → assign; if Save is disabled the role is already default). After switching role,
re-read to confirm it took effect before reading results. Ranking is config-driven (`search.yaml`) — assert the ORDER RULE, never a position.

| Case | Sign in as | Type | Expected (observed at build-verify where noted) |
|---|---|---|---|
| **C55718** | `ZZAUTOTEST No Work Orders View` (`87ba8d85-…`) | `S2-15430` | The work order is NOT pinned and NOT in any group. (Admin gets it — positive side confirmed.) |
| **C55719** | `ZZAUTOTEST No Customers View` (`530eb5d2-…`) | `(264) 400-0199` or `2643286723` | No Customers row for **Northgate Cartage Company** (name contains neither value — matched only via a contact). Positive side confirmed as admin. |
| **C55720** | a role missing **BOTH** Work Orders AND Vendor & Order Management — handoff names `ZZAUTOTEST No Work Orders Or Vendors`. **⚠️ Confirm this combined role exists first** — the recorded roles file lists only single-bundle roles; if absent, build one from template removing both `workOrdersView` and `vendorOrderManagementView`. | `Fib` | Four groups vanish (Work orders, Vendors, Purchase orders, Vendor invoices — group, count and tab). Customers, Assets, Parts, Part sales stay. Admin sees all 8 (baseline confirmed). |
| **C55721** | `ZZAUTOTEST No Parts View` (`745590e6-…`) | `Altenator` | The part is NOT returned; records you can see still fuzzy-match. Positive (Parts `≈close match`) confirmed as admin. |
| **C55722** | Admin | `ZZOPENCOUNT` | `ZZOPENCOUNT Freight Busy` ("10 open") above `ZZOPENCOUNT Freight Quiet` ("1 open"). **Observed PASS.** |
| **C55723** | Admin | `ZZNAMEBONUS` | `ZZNAMEBONUS Cartage` (name) above `Sterling Brothers Freight` (address). **Observed PASS.** |

## Search algorithm (C55724–C55730)
| Case | Type | Expected | Observed at build-verify (v26.36.7-069b8c2) |
|---|---|---|---|
| **C55724** | `ZZPREFIX` | Customers: `ZZPREFIX Freight Ltd` (prefix) → `Bolton ZZPREFIX Services` (whole-word) → `ZZPREFIY Cartage` (typo) | **Observed in that exact order — PASS.** 🔴 The earlier "expected to fail" warning (whole-word outranking prefix) does NOT reproduce on this build; do not mark it Failed on the stale warning. |
| **C55725** | `Zqwxpol`, then control `Aabridge` | `Zqwxpol` → nothing; `Aabridge` → Aabridge Freight returns (control) | Observed: `Zqwxpol` No results; `Aabridge` 62 results. PASS. |
| **C55726** | `ZZACC Jose Martinez`, then `ZZACC José Martínez` | Both find the one customer `ZZACC José Martínez` | Observed: each → that customer. PASS. |
| **C55727** | `ZZPUNC OBrien` & `O’Brien`; `ZZPUNC Smith Jones` & `Smith-Jones` | Both forms find `ZZPUNC O’Brien Haulage` / `ZZPUNC Smith-Jones Motors` | Observed: each form → 1 record. PASS. |
| **C55728** | `Olternaytor` | Customer `ZZPHON Alternator Co` returns (control); part `ZZPHON Alternator Assembly` does NOT | 🔴 **Observed the customer returns AND the part `ZZPHON Alternator Assembly` (ZZPHON-3001) ALSO returns.** The expected exclusion does not reproduce. Before recording Failed, reconcile against live PRD v1.5 §7 (Rule 106): is `Olternaytor` a true sound-alike, or within ordinary typo distance of "alternator" (in which case the part legitimately matches and the seed term is the issue, not the build)? Decide, then record; if a real deviation, it is a candidate finding under Rule 62 (held, no ticket without the QA lead's per-candidate go-ahead). |
| **C55729** | `S2-15430` | The work order pins as the single top row above the groups, above the competing customer `S2-15430 Holdings` | **Observed PASS** — WO pinned above Customers group. |
| **C55730** | `ZZBROAD`, then `ZZBROAD Target` | Broad: Parts tab 20 rows, `ZZBROAD Target Widget` absent (no pagination). Narrowed: it appears | **Observed PASS** — 20-cap, target absent then surfaces (ZZBROAD-4999). |

## Watch-outs (confirmed on the build)
- **OpenSearch index lag** is real but short — re-search before calling anything absent.
- **A parts row carries its NAME in the primary line and its number in the secondary line** — don't
  probe a part number against the name field and conclude it is missing.
- **A deleted record can linger in search for ~a minute** — if a count is one too high, check the
  list endpoint (`/api/customers` etc.) before touching data.
- **Counts cap at 20 per group**; a scope tab shows at most 20 rows with no pagination (that is C55730's point).
- Something on the branch drives work orders to terminal states; `apply_ranking_signals.py --confirm`
  restores genuinely-open counts if C55722 looks wrong.

## OUTSTANDING — what I need from you (the run session)
| # | Item |
|---|---|
| 1 | Nothing blocks the run. All 13 are build-verified, runnable and seeded on `v26.36.7-069b8c2`. |
| 2 | **C55728** — resolve the part-returned observation against live PRD v1.5 before recording (above). |
| 3 | **C55724** — record against the observed order (PASS on this build), not the stale fail warning. |
| 4 | **C55720** — confirm the combined reduced role exists before its negative run. |

**Standing holds still apply:** no Jira/external artefact without the QA lead, no TestRail *case*
writes without his go-ahead (result writes on R415 are covered above), Vladimir's cases never,
Automated cases held, secrets never committed, production is not a test environment. All on `sv9160` only.

---

## THE TOKEN-DISCIPLINE CHARTER — EMBEDDED VERBATIM, BINDING FROM YOUR FIRST TURN (Rule 95)
Canonical copy: `build/skills/TOKEN-DISCIPLINE-CHARTER.md`. Clause 12 is the one to read twice.

1. **STRATEGY FIRST (79).** Before ANY task, recall or devise the **cheapest correct plan** — not the first plan. For anything large, **declare an INTENDED SPEND** (roughly: tokens, spawns, script runs) in your first reply. Then begin. One pass, then exit.
2. **NEVER BULK-READ — SCRIPT IT (88).** No case bodies, CSV exports, API dumps, spec bodies or large files go into your context. **Write a script, run it to a file, read a bounded SUMMARY.** Inspect with `wc -l` / `head` / `tail` / `grep -c` / `grep -n` / bounded `sed -n`. **Never read CLAUDE.md end-to-end** and **never read `CLAUDE-FULL-ARCHIVE-2026-08-21.md` or any 100 KB+ artefact whole** — grep it.
3. **THE READING RULE.** The startup reading list is for startup. Afterwards consult **anything the task needs** — any rule, skill, project state, spec or ticket — always **targeted and bounded**. Knowledge is never off-limits; only BULK reading is. Not reading a rule you are about to apply is a worse failure than the tokens it would have cost.
4. **SPAWN DISCIPLINE (76 / 88).** An orchestrator (no file tools) minimises spawns and batches ruthlessly — every spawn re-loads the whole project context (200–380 k tokens each). A lane session (direct tools) does the work itself and does NOT spawn for anything it can do directly. Never spawn for a trivial check — piggyback it.
5. **NEVER POLL (75).** Long work runs as ONE detached, idempotent, resumable script with a checkpoint file, plus a committer loop gated on a RUN-FLAG FILE. **Never `pgrep -f <scriptname>`** — it matches itself and the loop never exits. Progress is self-reported in commit messages. Launch and exit; verify later in one short pass.
6. **BATCH WRITES.** One scripted run with a per-op log (operation · C-id · HTTP status · verification result), never one tool call per case. The log is the evidence (Rule 50); "200 OK" alone is non-compliant.
7. **PIGGYBACK CHEAP CHECKS (78).** Fold a cheap verification into the next substantive task. Keep a pending-cheap-checks list and carry it forward. Never spend a dedicated spawn on one.
8. **NEVER RE-DO WORK (77 / 80).** Before any verification, VIU or ordered task, STATE when it was last done (date + build marker / spec version) and ASK before re-running. A check within the last 3 builds or 3 source versions still COUNTS, shown with its date and freshness badge (91).
9. **ANSWER IN TEXT** when a tool call is not needed. If you already know the answer, or the question is about plan/scope/reporting, just answer.
10. **THE BUDGET (90).** One shared weekly pool: main/orchestrator 15 % · each lane 25 % · 10 % reserve, adjustable by the QA lead. Report cumulative spend WITH every piece of work. At 50 % of your own budget, compare spend against work completed; if spend is outpacing progress, STOP AND REPORT. Never consume the reserve without the QA lead's say-so.
11. **THE WEEK-START GUARD.** The pool resets weekly and was once nearly exhausted in ONE DAY. No lane may spend more than its weekly allocation in the first 48 hours of the week without explicit approval. A task that will exceed its declared intended spend STOPS and reports.
12. **QUALITY IS NEVER THE THING CUT.** None of clauses 1–11 may be used to justify sampling instead of full coverage (50), inferring instead of observing (12), or skipping a verification gate (84, 86). The savings come from HOW the work is executed — scripts, batching, no polling, no re-doing — never from doing less of it, and never from doing it less rigorously. If cheap and correct conflict, correct wins and you report the cost.
