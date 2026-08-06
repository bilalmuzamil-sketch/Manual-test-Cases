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
| Adjudicated by this pass, batch 1 (Inventory Value core) | 23 |
| Adjudicated by this pass, batch 2 (rest of Inventory Value) | 27 |
| **Total adjudicated** | **82** |
| **Remaining** | **394** |

**Inventory Value is COMPLETE**: all 68 IV cases now carry a verdict, except the 9 recorded below
as driven-but-not-observable, which are listed in `REMAINING.txt` with their exact reason.

The full remaining list, re-derived from the population minus recorded verdicts, is
`REMAINING.txt` (421 lines, each with its C-id and section). **Do not copy a list forward — re-derive it.**

## THE EXACT NEXT ACTION

Inventory Value is finished. Take the next report from `REMAINING.txt`, in this order (biggest
evidence reuse first): **Parts Velocity** (71 cases — Columns & Calculations 17, Filters 13,
Exports 9, Row Model 9), then **Sales By Representative** (112), **Sales By Customer** (87),
**Work In Progress** (78), **Technician Utilization** (60).

Every Inventory Value technique transfers: the report slug pattern, the toolbar test-ids, the
column control, the export endpoint, and the AND-logic and paging checks.

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

## Write ledger

TestRail **111 `update_case` over 99 distinct cases**, every one HTTP 200 + byte-verified,
30 fields compared each, 0 mismatches, 0 collateral. 0 add · 0 delete · 0 section ·
**0 run writes** · **0 results logged**. Jira **8 Story Defects created**, 0 edits to anyone
else's ticket. Application **read-only** — nothing seeded, nothing to restore.

## Marker census, live, over all 476

| Marker | Count |
|---|---|
| `AUTOMATION: READY` | 390 |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | 38 |
| `AUTOMATION: HOLD - <reason>` | 35 |
| no plain-text marker (raw HTML cases, see below) | 13 |

**THE ARITHMETIC GATE IS NOT CLAIMED TO PASS AND MUST NOT BE.** 390 + 38 = 428, but **382 of
the 476 have not been observed on this build at all** — those markers are inherited from earlier
passes, not evidence from this one. The honest figure is: **94 cases carry a verdict established
against `v3.5-16cf83f`**, and the rest do not.

## Expect-fail three-outcome blocks

**28 of the 38 expect-fail cases now carry the block** (symptom + the three outcomes), each
symptom being one THIS session observed:

- **SV-8818** (13 cases) — PDF fails only on a large view; proven by size, not by report:
  1, 2 and 0-row views produced a PDF, the 5,657-row view returned HTTP 500.
- **SV-8820** (4) — the as-of date lands one day late (range to 15 Jul reports 16 Jul).
- **SV-8823** (3) — spreadsheet money as text and its own column order.
- **SV-8926 / 8928 / 8929 / 8930 / 8931 / 8932** (8) — this session's own findings.

**10 do NOT have the block, deliberately:** 9 on **SV-8907** and 1 on **SV-8908**, both Work In
Progress. I could not reproduce the WIP export failure — the export takes a different parameter
set and every datetime form I tried returned `"This value is not a valid datetime."`, which is my
parameter error, not the defect. Writing a symptom I had not seen would have been the exact thing
the block exists to prevent. **They should get the block during the Work In Progress batch.**

## THE RAW-MARKUP CASES — 13 remain, and one lesson

`C30341` was the 14th and is now repaired to plain numbered text. **It was damaged by this pass
first**: the writer's plain-text patterns do not match the HTML form, so it appended a SECOND
provenance line and a SECOND marker rather than replacing them. `rebuild()` now REFUSES on any
case containing raw markup. **Convert to plain text first, then write.** The helper that did it
is in the batch-3 section of `CHANGES-MADE.md`.

Still raw: **C30392, C30451, C30456, C30457, C30460, C30487, C30490, C30491, C30493, C30519,
C30522, C30526, C30528** — all in SBR / WIP / TU, none reached this session.

## Nine cases that never had a build line

`C30278, C38856, C43550, C43551, C43552, C43553, C43557, C43558, C43559` carry a provenance
sentence 1 but **no "Last checked against build" line at all** — they are state-1 cases from
earlier passes that were never live-verified. **Not touched by this session.** They need one when
their report is driven.
