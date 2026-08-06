# RESUME — Report Suite live-observation pass, 2026-08-06

## Build marker in force
`v3.5-16cf83f` · last-mod **Wed, 05 Aug 2026 06:40:32 GMT** · etag `177c59546701e7810b894492dabc1423`
· `index.html` sha256 `67932a75b5a3a11d987b065c526d2d6dd38d0f47f76adeef61a6d341b249fa78`.
Read at the start of every batch and at the end. **Byte-identical every time — no redeploy.**

## Sources, re-fetched live 2026-08-06 (Rule 59)
SBC **15** · SBR **17** · PV **5** · TU **6** · WIP **9** · IV **4**. **None moved.**
Epic **SV-8582 = 105 children**, verified two ways with equal key sets, no paging remainder.

## Progress — RE-DERIVED, never copied forward

| | Count |
|---|---|
| Our cases | **476** (481 live under group 4281, incl. 5 foreign) |
| With a verdict established on `v3.5-16cf83f` | **125** |
| **Remaining** | **351** |

125 + 351 = 476. `REMAINING.txt` is regenerated from the population minus recorded verdicts every
batch — **do not copy it forward, re-derive it.** Note that a case recorded `NOT OBSERVED` stays in
`REMAINING.txt`, because a reason is not a verdict.

**Inventory Value and Parts Velocity are both FINISHED** — every one of their 68 + 71 cases now
carries either a verdict or a written not-observed reason.

## THE EXACT NEXT ACTION

Take the next report from `REMAINING.txt`. Suggested order (largest evidence reuse first):
**Technician Utilization** (57), **Sales By Customer** (83), **Sales By Representative** (109),
**Work In Progress** (67, last — see the export note below).

Everything learned on Parts Velocity transfers directly:

- Report data endpoint: `GET /api/reporting/reports/<slug>?type=&range=custom&start_date=&end_date=&locations=&pagination[page]=&pagination[rowsPerPage]=&pagination[sortBy]=&pagination[descending]=`
- Export endpoint: the **same path + `/export?format=csv|pdf`** plus a **`columns=`** list.
  **Capture it from the product's own download menu first** — that is how the right shape is learned.
- Money in the report API is in **cents**; the screen renders dollars.
- **Presets are sent as `range=custom&start_date=&end_date=`**, never as a preset name.
- Toolbar test-ids follow `select_<slug-initials>_*`, `date-range-selector_<x>_trigger`,
  `btn_dropdown_<x>_export`, `button_column_selection`, `input_report_search`,
  `select_multiple_report_location_filter`.
- Menu item text is prefixed by its icon word (`check Both`), so match on the **suffix**.

## THE WIP EXPORT — still the specific unfinished business

9 cases hold `EXPECT FAIL (SV-8907)` and 1 holds SV-8908 **without the Rule-61 block**, because the
previous pass could not reproduce the failure. **Do not guess the parameters.** Open the Work In
Progress report in the browser, attach a request listener, click the download menu, and take the
product's own URL — that worked first time on Parts Velocity and is what established the export
shape there. Then observe the real symptom and write the block. If it still cannot be reproduced,
**leave those 10 without the block and say so** — an unobserved symptom must never be written.

## Two traps this pass hit, so the next one does not

1. **A 400 or 500 from an export is not automatically a defect.** The ~10,000-row export refusal is
   the deliberate guard in epic story **SV-8591**. Search the epic's engineering stories before
   filing.
2. **Read the header's own sort class alongside the rows, not the last request URL.** A snapshot
   taken four seconds after a header click still showed the previous order and read exactly like a
   broken sort. Four clicks in sequence proved the cycle is correct.

## Tooling that works (reuse, do not re-derive)
- `build/report-suite/full-viu-2026-08-05/tools/rs.py` — raw-cookie API + export downloader.
  **`-g` (globoff) is required** for `pagination[...]` bracket params.
- `/tmp/rs-viu/boot.mjs` — Chromium straight through `$HTTPS_PROXY`; no MITM bridge. Exports
  `boot()` and `go(page,path,waitMs)` and returns a `netlog` of every `/api/` request.
- `/tmp/rs2/lib.mjs` — `rows`, `heads`, `lastUrl`, `menuPick`, `menuItems`, `save`. **Wrap every
  batch in try/catch and save incrementally** — one timeout loses a whole script otherwise.
- `build/report-suite/full-viu-2026-08-06/tools/writer.py` — rebuilds an expected-results field and
  writes it with all three text fields and Rule-50 byte verification. **It REFUSES on a raw-markup
  case.** Keep that guard.
- `/tmp/testrail/tr.py` — TestRail with byte verification built in.
- `/tmp/conf_fetch.py` — all six Confluence specs, live, with version numbers.
- `/tmp/jql.py` — the epic child count, two ways.

## Write ledger (this pass, cumulative)

TestRail **140 `update_case` over 128 distinct cases**, every one HTTP 200 + byte-verified,
30 fields compared each, 0 mismatches, 0 collateral. **0 add · 0 delete · 0 section · 0 run writes ·
0 results logged.** Jira **15 Story Defects created** (SV-8925–SV-8940), 0 edits to anyone else's
ticket. Application **read-only**.

## Marker census caveat

**THE ARITHMETIC GATE IS NOT CLAIMED TO PASS AND MUST NOT BE.** 125 of the 476 carry a verdict
established against `v3.5-16cf83f`; the other 351 carry markers inherited from earlier passes.

## STILL OWED — carried forward

- **13 raw-markup cases**: C30392, C30451, C30456, C30457, C30460, C30487, C30490, C30491, C30493,
  C30519, C30522, C30526, C30528 — all in SBR / WIP / TU, none reached yet. Convert to plain
  numbered text as you meet them (formatting only).
- **9 cases with no build line at all**: C30278, C38856, C43550, C43551, C43552, C43553, C43557,
  C43558, C43559. Give them one when their report is driven.
- **Permission cases across every report cannot be driven**: there is one session on this estate and
  it is shared with a sibling worker; `quick-login` and `switch-user` both rotate it.
- **A question for Chris Ward**: none of the six specifications mentions the ~10,000-row export cap,
  yet it is real, deliberate and in epic story SV-8591. The Parts Velocity default first-visit view
  cannot be exported at all because of it.

## Ticket filing — the standing authorisation STANDS

A mid-session instruction to stop filing was **retracted by the QA lead the same hour**, verbatim:
*"I take everything back which I said before... Do not take any action or change anything based on
the above which I said to you earlier."* **It was never in force. No case text was ever written under
it** — the live census confirms **0 cases carry a "no ticket yet" marker**, and that variant must not
be used. Defects are filed as found, in the Rule-52 shape, after a duplicate search and after trying
to disprove them. **Rule 51 is untouched: an API-only fault is never filed — it goes to `API-ASK.md`
as an ask.**

## Rule-61 block census, live over all 476

| Marker | Count |
|---|---|
| `AUTOMATION: READY` | 388 |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | 42 |
| `AUTOMATION: HOLD` | 33 |
| no plain-text marker (the 13 raw-markup cases) | 13 |

**40 of the 42 expect-fail cases carry the ticketed Rule-61 three-outcome block. 0 carry a no-ticket
variant.** The two without a block are **C30500** (SV-8908, the Asset filter — its symptom was not
driven, and an unobserved symptom must never be written) and **C38918** (the over-cap refusal, which
cannot be produced here: the biggest tab holds 65 work orders against a cap near 10,000). **C38918 is
worth the QA lead's decision — arguably it should be `AUTOMATION: HOLD`, not expect-fail.**
