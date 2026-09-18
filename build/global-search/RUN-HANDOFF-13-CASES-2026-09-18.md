# HANDOFF → RUN SESSION — Global Search: 13 cases C55718–C55730
### Run on `sv9160` (build `v26.36.8-d146c39`), record results in run **R415**. 2026-09-18.

**You are the run session.** All 13 are build-verified and re-stamped on the current build
`v26.36.8-d146c39` (report: `build/global-search/build-verify-13cases-2026-09-18/REPORT-2026-09-18.md`).
Runnable, render-clean, seeded (status.py: all universes PRESENT, roles 7/7). Execute each case, mark
**Passed / Failed / Blocked** in **R415**, handle deviations under your own rules.

- **Scope:** Permissions & scoping C55718–C55723 (6734, 6726) · Search algorithm C55724–C55730 (6726, 6725). All `created_by=3`, none Automated.
- **Run:** R415 — <https://shopview.testrail.io/index.php?/runs/view/415>.
- **🔑 RESULT-WRITE GO-AHEAD:** the QA lead has asked for results to be recorded in R415 — that is your
  explicit go-ahead for **result writes on R415 only** (Rule 6). It does not extend to case-body edits,
  other runs, or any Jira/external artefact. Use `build/testing-tools/push_results_to_run.py` (playbook
  §W); sync the run **union-only** (Rule 34).
- **Branch:** `https://sv9160.qa.shopview.com` ONLY (dummy QA, full CRUD, Rule 107). Not staging/production.
- **Access:** `source build/testing-tools/ensure_bridge.sh`; fresh `sv_sso_session` in
  `/tmp/qa-cookies/sv9160-sso.txt` (chmod 600, /tmp only, NEVER committed — Rule 82); then
  `node build/testing-tools/qa-branch-boot.mjs sv9160 <route> admin`. Labels: `build/OBSERVED-UI-LABELS-sv9160.md`.
- **First:** `cd build/global-search/seeding && python3 status.py`. If the marker moved off
  `v26.36.8-d146c39`, `./reseed_everything.sh qa` and allow OpenSearch a moment to index.

## Permissions & scoping (C55718–C55723)
Reset a stock role To Template before assigning (the `ZZAUTOTEST` roles are already template-clean).
After switching role, re-read to confirm it took effect. Ranking is config-driven — assert the ORDER RULE.

| Case | Sign in as | Type | Expected (observed at build-verify) |
|---|---|---|---|
| **C55718** | `ZZAUTOTEST No Work Orders View` | `S2-15430` | WO not pinned, not in any group. Admin gets it (positive confirmed). |
| **C55719** | `ZZAUTOTEST No Customers View` | `2643286723` (or `(264) 400-0199`) | No Customers row for Northgate Cartage Company (matched only via a contact). Positive confirmed as admin. |
| **C55720** | `ZZAUTOTEST No Work Orders Or Vendors` | `Fib` | Four groups vanish (Work orders, Vendors, Purchase orders, Vendor invoices); Customers/Assets/Parts/Part sales stay. Admin sees all 8 (baseline confirmed). |
| **C55721** | `ZZAUTOTEST No Parts View` | `Altenator` | Part not returned; visible records still fuzzy-match. Positive (Parts `≈close match`) confirmed as admin. |
| **C55722** | Admin | `ZZOPENCOUNT` | `Freight Busy` above `Freight Quiet`. **Observed PASS.** |
| **C55723** | Admin | `ZZNAMEBONUS` | `ZZNAMEBONUS Cartage` (name) above `Sterling Brothers Freight` (address). **Observed PASS.** |

## Search algorithm (C55724–C55730)
| Case | Type | Expected | Observed at build-verify (d146c39) |
|---|---|---|---|
| **C55724** | `ZZPREFIX` | `ZZPREFIX Freight Ltd` (prefix) → `Bolton ZZPREFIX Services` (whole-word) → `ZZPREFIY Cartage` (typo) | **Observed in that order — PASS.** Ignore any older "expected to fail" warning; it does not reproduce here. |
| **C55725** | `Zqwxpol`, control `Aabridge` | `Zqwxpol` nothing; `Aabridge` returns | Observed: No results / 62 results. PASS. |
| **C55726** | `ZZACC Jose Martinez`, then accented | both → `ZZACC José Martínez` | Observed PASS. |
| **C55727** | `ZZPUNC OBrien` & `ZZPUNC Smith Jones`, then punctuated | find `ZZPUNC O'Brien Haulage` / `ZZPUNC Smith-Jones Motors` | Observed: 1 record each. PASS. |
| **C55728** | 🔴 **`Nyte`** (control first: **`Knight`**) — **NEVER `Olternaytor`** | The part is NOT returned by a genuine sound-alike (phonetic matching is names-only) | See §C55728 below — read before running. |
| **C55729** | `S2-15430` | WO pins as the single top row above customer `S2-15430 Holdings` | **Observed PASS.** |
| **C55730** | `ZZBROAD`, then `ZZBROAD Target` | Broad: Parts tab 20 rows, `ZZBROAD Target Widget` absent; narrowed: it appears (ZZBROAD-4999) | **Observed PASS.** |

## 🔴 §C55728 — read before running (corrected)
Type a **genuine sound-alike**, `Nyte` or `Nait`. **Do NOT type `Olternaytor`** — it is a close-spelling
typo of "Alternator", which the case's own Expected says *would still match* (ordinary typo tolerance);
using it produces a false result. Run the control **`Knight`** first: it must return the customer
`ZZPHON Knight Haulage` and the part. Then type `Nyte`.

Observed at build-verify: `Knight` returns its records; `Nyte` and `Nait` return **nothing at all** — so
on this build there is **no observable phonetic/sound-alike matching**, only fuzzy edit-distance. C55728
asserts a NEGATIVE (the part must not come back), so it will read as **PASS** — but **qualify the PASS in
your R415 comment**: state that the control could not demonstrate phonetic name-matching, so the pass is
not proof the feature works. Raise the missing phonetic capability as a **PO decision candidate** (Rules
57/58); do NOT rewrite the case.

## Watch-outs (confirmed on the build)
- OpenSearch index lag is real but short — re-search before calling anything absent.
- A parts row carries its NAME in the primary line, its number in the secondary — don't probe the number against the name field.
- A deleted record can linger in search ~a minute — check the list endpoint before touching data if a count is one too high.
- Counts cap at 20 per group; a scope tab shows at most 20 rows, no pagination (C55730's point).
- A work order reads at `/api/work-orders/view/{id}`, NOT `/api/work-orders/{id}` (the wrong path 404s and looks like "unreachable"). Open a record you own before concluding another is unreachable.

## OUTSTANDING — what I need from you (run session)
| # | Item |
|---|---|
| 1 | Nothing blocks the run. All 13 build-verified, runnable, seeded on `v26.36.8-d146c39`. |
| 2 | **C55728**: use `Nyte`/`Knight`, qualify the PASS, raise the no-phonetic-matching finding to the PO. Never `Olternaytor`. |
| 3 | **C55724**: record on the observed order (PASS), not the stale fail warning. |
| 4 | **C55720**: confirm `ZZAUTOTEST No Work Orders Or Vendors` exists before its negative run. |

**Standing holds:** no Jira/external artefact without the QA lead, no TestRail *case* writes without his
go-ahead (result writes on R415 are covered above), Vladimir's cases never, Automated cases held, secrets
never committed, production is not a test environment. All on `sv9160` only.

---
_(Rule 95 — the twelve-clause Token-Discipline Charter is embedded verbatim in the companion build-verify
handoff `976138ad-HANDOFF-BUILD-VERIFY-13-NEW-CASES` this run handoff accompanies; canonical copy
`build/skills/TOKEN-DISCIPLINE-CHARTER.md`. Strategy first · never bulk-read · spawn discipline · never
poll · batch writes · piggyback · never re-do · answer in text · the budget · week-start guard · quality
is never the thing cut.)_
