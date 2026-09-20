# HANDOFF → RUN SESSION — Global Search: same-record permission toggle (7 cases)
### Run on `sv9160` (build `v26.36.8-d146c39`), record results in run **R415**. 2026-09-20.

**You are the run session.** All 7 are build-verified on `v26.36.8-d146c39`
(report: `build/global-search/build-verify-7flip-2026-09-18/REPORT-2026-09-20.md`). Data fully seeded
(2026-09-20; every keyword returns its record). Execute each, mark **Passed / Failed / Blocked** in
**R415**. **C55737 is held — mark "not available on build", do not pass or fail it (§3).**

- **Scope:** C55731, C55732, C55733, C55734, C55735, C55736, C55737 (section 6734). All `created_by=3`, none Automated.
- **Run:** R415 — <https://shopview.testrail.io/index.php?/runs/view/415>.
- **🔑 RESULT-WRITE GO-AHEAD:** the QA lead asked for results recorded in R415 — explicit go-ahead for
  **result writes on R415 only** (Rule 6). Use `build/testing-tools/push_results_to_run.py` (playbook §W); union-only sync (Rule 34).
- **Branch:** `https://sv9160.qa.shopview.com` ONLY (dummy QA, full CRUD, Rule 107). Not staging/production.
- **Access:** `source build/testing-tools/ensure_bridge.sh`; fresh `sv_sso_session` in
  `/tmp/qa-cookies/sv9160-sso.txt` (chmod 600, /tmp only, NEVER committed — Rule 82); then
  `node build/testing-tools/qa-branch-boot.mjs sv9160 <route> admin`.
- **TestRail API:** the API *key* is `/tmp`-only and may be wiped in a fresh container — the **web login
  password** (`ENVIRONMENT-CREDENTIALS.md` §4) authenticates `/index.php?/api/v2/` via Basic auth.
- **First three checks (toggle doc header):**
  ```
  curl -s https://sv9160.qa.shopview.com/ | grep app-version
  cd build/global-search/seeding && python3 status.py
  cd build/global-search/seeding && python3 verify_toggle.py
  ```
  **If every API call is 403 `AccessDenied`, the branch is ASLEEP** (not a login failure). Test with no
  cookies; if it still fails, wake it: `POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv -d '{"action":"wake","env":"sv9160"}'` (playbook §R). Data survives.

## Each case is TWO runs of the SAME search — run the WITH-access half first
If the record does not appear in the WITH half, stop — it is a data problem, not the build, and the
without half is then meaningless. **Reset a stock role To Template before assigning; the `ZZAUTOTEST`
roles are already template-clean. After a role change, re-login and confirm it took effect before reading.**

| Case | Type | WITH access (admin) → record appears | WITHOUT access as | What must change |
|---|---|---|---|---|
| **C55731** | `ZZTOGPART` | Part **`ZZTOGPART Brake Kit`** in the Parts group | `ZZAUTOTEST No Parts View` | the whole Parts group is gone |
| **C55732** | `ZZTOGWO` | Work order **`S9160-17699`** in the Work Orders group | `ZZAUTOTEST No Work Orders View` | Work Orders group gone (the customer/asset that also match STAY — §Traps) |
| **C55733** | `ZZTOGCUST` | Customer **`ZZTOGCUST Freight`** AND its vehicle | `ZZAUTOTEST No Customers View` | BOTH the customer and the vehicle go (one permission gates both) |
| **C55734** | `ZZTOGPS` | Part sale **`P9160-265`** (Part sales tab) | `ZZAUTOTEST No Part Sales View` | the part sale goes. (`Part Sales` needs `partSalesView` AND `seeFinancialData` — confirm which you changed.) |
| **C55735** | `ZZTOGVEN` | Vendor **`ZZTOGVEN Supply`**, PO **`I9160-1399`**, and its vendor invoice — all three | `ZZAUTOTEST No Vendor Order View` | **ALL THREE** go together. Two of three vanishing is NOT a pass. (A stray part row stays — §Traps.) |
| **C55736** | `ZZTOGPRICE` | Part **`ZZTOGPRICE Filter`** row, with its **price `137.45`** shown (the purchase price, not `305.44`) | `ZZAUTOTEST No Financial Data` | **the SAME row stays, only the price is hidden.** 🔴 If the ROW vanishes, that is a finding, not a pass. `See Financial Data` is a separate toggle, not a list permission. |
| **C55737** | `ZZTALLYQ` | 🔴 **HELD** — mark **not available on build** (§3). | — | — |

🔴 **C55736 note:** confirm the price actually renders on the part row when signed in WITH `See Financial
Data` before judging the masked half. The build-verify pass saw the row but did not capture the price
value cleanly; the seeding session measured `137.45` on this build. If no price shows on the row even
with financial access, that is a finding — do not read a price-less row as a clean mask.

## §3 · C55737 — do not run as a pass
C55737 needs a role that sees *some* records of a type but is blocked from *one specific record of that
type*. This build's permissions are **per type, not per record** — the scenario cannot be built. Mark
**"not available on build"** (Rule 69). It asserts a negative (a hidden record is not counted); if no
record can be hidden it passes while proving nothing. A PO question is with the QA lead.

## §Traps — three things that look like bugs and are NOT
1. `ZZTOGPART` also returns two unrelated brake parts (near-spelling). Harmless — pick our row by name.
2. `ZZTOGWO` also returns a customer + vehicle that STAY after the Work Orders flip — they are Customers/Assets rows, a different permission. C55732 is the Work Orders group only.
3. `ZZTOGVEN` leaves a Parts row after the flip — the part is a different permission. Correct.
Judge by *"is OUR named record there?"*, never by row count.

## OUTSTANDING — what I need from you (run session)
| # | Item |
|---|---|
| 1 | 6 of 7 ready; run each as two halves (with/without access). |
| 2 | **C55737** — mark not-available (per-record permission absent). |
| 3 | **C55736** — confirm the price renders on the row before judging the mask. |
| 4 | Read §Traps before raising any defect on C55731/C55732/C55735. |

**Standing holds:** no Jira/external artefact without the QA lead, no TestRail *case* writes without his
go-ahead (result writes on R415 covered above), Vladimir's cases never, Automated cases held, secrets
never committed, production is not a test environment. All on `sv9160` only.

---
_(Rule 95 — the twelve-clause Token-Discipline Charter is embedded verbatim in the companion build-verify
document `BUILD-VERIFICATION-Global-Search-Permission-Toggle-Same-Record-7-cases`; canonical copy
`build/skills/TOKEN-DISCIPLINE-CHARTER.md`. Strategy first · never bulk-read · spawn discipline · never
poll · batch writes · piggyback · never re-do · answer in text · the budget · week-start guard · quality
is never the thing cut.)_
