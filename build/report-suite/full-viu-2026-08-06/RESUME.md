# RESUME — Report Suite live-observation pass, 2026-08-06

**Session state at the end of batch 1:** cookies alive. Build unchanged.

## Build marker in force
`v3.5-16cf83f` · last-mod **Wed, 05 Aug 2026 06:40:32 GMT** · etag `177c59546701e7810b894492dabc1423`
· `index.html` sha256 `67932a75b5a3a11d987b065c526d2d6dd38d0f47f76adeef61a6d341b249fa78`.
Read at **03:43:35Z**. **Byte-identical to the 5 August pass — no redeploy.**

## Specs (Confluence version numbers, not the in-body field)
SBC **15** · SBR **17** · PV **5** · TU **6** · WIP **9** · IV **4** — read live 03:44Z.
**None moved** since the 5 August pass.

## Epic SV-8582
**105 children**, verified two ways (`parent=` and `"Epic Link"=`) with equal key sets and no paging
remainder. **No new children** since the previous pass. Only three Story Defects hang off the 105 and
all three are ours (SV-8907, SV-8908, SV-8780). **No candidate coverage gaps** from other authors on
this epic in the last 48 hours — the six new tickets the coordinator flagged are all on the
**Schedule** epic, not this one.

## Progress

| | Count |
|---|---|
| Our cases | **476** (481 live incl. 5 foreign) |
| Observed by the 5 Aug pass | 32 |
| **Observed by this pass (batch 1)** | **23** |
| **Total observed** | **55** |
| **Remaining** | **421** |

The full remaining list, re-derived from the population minus recorded verdicts, is
`REMAINING.txt` (421 lines, each with its C-id and section). **Do not copy a list forward — re-derive it.**

## THE EXACT NEXT ACTION

Take the next section from `REMAINING.txt`. Suggested order (biggest evidence reuse first):
**IV — Filters & Part Search (5)**, **IV — Location Filter (5)**, **IV — Access & Display (5)**,
**IV — Exports (4)** — these finish Inventory Value while the IV evidence is fresh — then
**PV — Columns & Calculations (17)**, **SBR — Exports (13)**, **PV — Filters (13)**.

## Tooling that works (reuse, do not re-derive)
- `build/report-suite/full-viu-2026-08-05/tools/rs.py` — raw-cookie API + export downloader.
  **`-g` (globoff) is required** for `pagination[...]` bracket params.
- `/tmp/rs-viu/boot.mjs` — Chromium straight through `$HTTPS_PROXY` with
  `--ignore-certificate-errors`; **no MITM bridge needed**. Hydrates localStorage from
  `/tmp/report-suite-viu/rc/userobj.json`. Exports `boot()` and `go(page,path,waitMs)`.
- `build/report-suite/full-viu-2026-08-06/tools/writer.py` — rebuilds an expected-results field
  (Rule-54 two-sentence provenance, marker, known-issue line, body edits) and writes it with
  **all three text fields** and Rule-50 byte verification.
- `/tmp/testrail/tr.py` — TestRail with byte verification built in.

## Env facts established this pass
- IV report page: `/reports/inventory-value`. Part search input `data-test-id="input_report_search"`.
  Column control `data-test-id="button_column_selection"` (accessible name "Column Selection");
  its menu items are `.q-menu .q-item`, and the toggle to click is the inner `[aria-checked]`,
  **not the row** — clicking the row does nothing.
- The report's saved view lives in local storage at `report_view:<slug>`.
- **"This Month" is sent as `range=custom&start_date=…&end_date=…`**, not as a preset name.
- Money in the report API is in **cents**; the screen renders dollars.
- **1200 inventory parts scanned: not one has `is_core=1`.** `R134A-CORE` is merely named "CORE".
- **Every part has a category** — the no-category path is not producible.

## SESSION DIAGNOSTIC worth keeping (coordinator, confirmed by us)
When the QA lead re-supplied cookies mid-run, `sv_sso_session` and `PHPSESSID` were **identical** and
only **`cf_clearance`** had changed. So a 401 on this estate is more likely an expired **Cloudflare
clearance** than a dead sign-in, and the right ask is a fresh clearance token, not a whole new
sign-in. **This belongs in `build/APP-ACTIONS-PLAYBOOK.md` — not edited from this worker.**

## Write ledger so far
TestRail **23 `update_case`**, all HTTP 200 + byte-verified, 0 collateral. 0 add · 0 delete ·
0 section · **0 run writes** · **0 results logged**. Jira **5 Story Defects created**, 0 edits to
anyone else's ticket. Application **read-only**.

## Proofs re-run after batch 1
- Live 481 = pre-write 481, **case-id sets equal both directions**.
- **Exactly 23 cases changed by CONTENT** and all 23 are ones we wrote (compared on title,
  preconds, steps, expected, refs, section, type, priority, template, atmstatus, automation type —
  **not** on `updated_on`).
- **Foreign C38919–C38923 byte-identical**, including `updated_on`/`updated_by`.
- **Run 359 untouched:** `include_all` still false, 476 tests, **535 results, 0 missing by ID,
  0 with any real field changed, 0 echo changes, 0 new results.**
