# Report Suite — PV + WIP spec deltas recorded 2026-08-19 — ✅ EXECUTED 2026-08-20 (Delta A) · B.1/B.2 spot-verified · B.3 HELD+RAISED

> **⚡ STATUS 2026-08-20 — EXECUTED. See `EXECUTION.md` for the run.** Build v3.8-d0e135e (start==end).
> - **DELTA A (PV CSV rule): DONE** — live-verified on the build (CSV plain numbers, numeric nulls
>   empty, no `$`/separators/`%`; S6-R10 PDF-only confirmed from the CSV-lacks-it side; PV PDF export
>   still HTTP 500 = SV-8818). **3 `update_case` (C30380 extended, C30381 confirmed/re-stamped, C30382 →
>   EXPECT-FAIL SV-8818), all byte-verified.** C30348 + C30371 spot-verified, no change (on-screen only).
> - **DELTA B.1 + B.2 (grain + line-state): SPOT-VERIFIED LIVE, NO CHANGE** — already at v24 (Chris
>   rulings 1 & 3, applied by `wip-reconciliation-2026-08-19`); tabs present as documented.
> - **DELTA B.3 (Story-5 design adoption): 🛑 HELD + RAISED.** The build has fully adopted new figure
>   names + grouped +/= math + reworded tooltips, but the six new names/tooltips are in NO document held
>   (v24 spec / Aug-13 design review is SSO-walled) — writing them from the build fails Rules 57/58.
>   **0 WIP writes.** Needs the v24 page / design-review export (RS-WIP-8 updated).
> - **0 Jira · 0 foreign · run 359 untouched (508 tests / 535 results, sets equal both ways).**
>
> **ORIGINAL (superseded) header, kept dated:** DOCS-ONLY pass. Nothing was written to TestRail, Jira or
> staging in recording these deltas. No test case was touched. This file **captures** two spec changes
> the QA lead reported on 2026-08-19 and **queues** the reconciliation work — it does not perform it.
>
> **Chris Ward is the Report Suite / Parts Velocity / WIP Product Owner** (never mixed with Branko /
> Milos). The QA lead relayed these Confluence updates; they are **authoritative source (a) — the
> PRD/Confluence specification — under Standing Rule 57**, and the newest authoritative product source
> (Rule 32), so they prevail over any older spec text they touch.

## 🔢 ORDER OF WORK — READ THIS FIRST

**This reconciliation does NOT run now. The order is fixed:**

1. **Schedule re-check** — *running* (blocked on fresh staging cookies; SCH-BV-1/5).
2. **FILTERS build-verification (~114 cases)** — **NEXT.** It has not started this cycle and **the
   Filters tester has been waiting two days.** Filters is the priority.
3. **THEN this PV + WIP reconciliation** — the Parts Velocity CSV rule (Aug-17) + the WIP Story-5
   design-adoption reconciliation (Aug-19), plus the two WIP spot-verifies below.

**No TestRail / Jira / staging write is authorised or performed by this document.** The Rule-62
creation-hold (register H1) still stands for any Jira work.

---

## SOURCE-CURRENCY (Standing Rule 31)

| Source | Identifier | Version / date | Checked | Verdict |
|---|---|---|---|---|
| **Parts Velocity spec** (live Confluence) | pageId **620888066** — Parts Velocity Report | **updated Aug 17** (per QA lead / Chris; new suite-wide CSV number rule, S6-R10 → PDF-only) | 2026-08-19 (relayed) | **NOT FETCHED — SSO-walled, no Atlassian MCP this session.** Proceeding on the QA-lead-relayed Chris ruling (authoritative source (a)). Byte-level page diff owed once the page body is exported. |
| PV spec (local baseline) | id-map refs read **"PV spec v10 2026-08-17"** | v10 / 2026-08-17 | 2026-08-19 | **PARTIAL** — the cases already cite a v10 dated 2026-08-17 and already carry the CSV nulls→empty half (C30381), but the **incremental Aug-17 delta** (plain numbers across ALL numeric/money CSV columns + S6-R10 made explicitly PDF-only) is **not yet fully asserted**. Reconcile to confirm. |
| **WIP spec** (live Confluence) | pageId **703660034** — WIP Work In Progress Report | **updated Aug 18–19** — Chris pins it at **v24** | 2026-08-19 (relayed) | **NOT FETCHED — SSO-walled.** Proceeding on Chris's rulings. The Aug-18 grain + Aug-19 line-state changes were **already applied** by `wip-reconciliation-2026-08-19/EXECUTION.md`; the **Aug-19 Story-5 design adoption is NEW and NOT yet reconciled.** |
| WIP spec (local baseline) | `build/report-suite/wip-v22-2026-08-18/` | v22 | 2026-08-18 | **STALE vs v24** — full byte-level v22→v24 page diff owed (register RS-WIP-6). |
| PO rulings | Chris Ward, relayed by QA lead 2026-08-19 | 2026-08-19 | 2026-08-19 | **CURRENT** — newest authoritative product source (Rule 32). |
| Epic | **SV-8582** (Report Suite) + PV story SV-8646 / WIP Story-5 story **SV-8661** | — | — | **unchanged** this pass (QA lead: no change to SV-8582). |
| Other reports / other projects | SBC · SBR · Technician Utilization · Inventory Value · Filters · Schedule · **SV-8685** | — | 2026-08-19 | **NO CHANGES reported** by the QA lead. (See the suite-wide note under Delta A.) |

---

# DELTA A — PARTS VELOCITY CSV number-format rule (Confluence updated Aug 17) — **NEW, needs reconciliation**

## Verbatim (as relayed by the QA lead, 2026-08-19)

> "New suite-wide rule — CSV exports now write plain numbers (no $, no separators, no % sign; nulls
> are empty cells instead of em-dash). The old alignment/bold/color rule (S6-R10) is now PDF-only.
> Per Dipesh's correction on SV-8823."

## Plain-English interpretation — what the PV CSV-export cases must assert

- **PV CSV exports write PLAIN numbers:**
  - **no `$` (dollar sign)** on money columns,
  - **no thousands separators** (no commas grouping digits),
  - **no `%` sign** on percentage columns,
  - **nulls are EMPTY cells** (not an em-dash `—`).
- **The PDF still formats normally** — the em-dash for nulls, and the S6-R10 alignment/bold/colour
  treatment, are **PDF-ONLY** now. The old S6-R10 rule (alignment, bold, colour) **no longer applies
  to the CSV.**
- This is the **Dipesh correction on [SV-8823](https://shopview.atlassian.net/browse/SV-8823)** — the
  same SV-8823 the 8/19 sweeps saw "looks fixed" on some reports. So the CSV is now a clean,
  spreadsheet-totalable data file; formatting lives only in the PDF.

## Coverage assessment — PARTIALLY covered; reconciliation required

The PV export cases already cite **"PV spec v10 2026-08-17"** and **C30381 already carries the CSV
nulls→empty half.** What the Aug-17 incremental delta still needs is: (1) the **plain-number rule
across every numeric/money CSV column** (no `$`, no separators, no `%`) asserted explicitly, and
(2) **S6-R10 scoped explicitly to the PDF only.** So the state is **PARTIAL — confirm + extend**, not
"already done".

### Likely-affected PV cases (read-only, from `testrail-id-map.csv`)

| Case | C-id | Title (current) | Why affected / what the reconciliation must do |
|---|---|---|---|
| **PV-EXP-06** | [C30380](https://shopview.testrail.io/index.php?/cases/view/30380) | CSV is named velocity-report.csv and holds full untruncated text values | **PRIMARY CSV-content case.** Today asserts filename + untruncated text + Last Sale raw integer. **Extend** to assert the full plain-number rule: every money/numeric CSV column carries a bare number — **no `$`, no thousands separators, no `%`** — and nulls are empty cells. |
| **PV-EXP-07** | [C30381](https://shopview.testrail.io/index.php?/cases/view/30381) | Em-dash in both exports; Last Sale reads "N days" in the PDF | **DIRECTLY affected.** Already says "null → `—` in PDF, empty cell in CSV" and cites v10. **Confirm/re-anchor** to the Aug-17 rule; note the title/scope should make clear the em-dash is **PDF-only** and the CSV leaves cells empty. Spot-check it does not still imply CSV formatting. |
| **PV-EXP-08** | [C30382](https://shopview.testrail.io/index.php?/cases/view/30382) | PDF export alignment: Type centered, text left, numeric and money right | **S6-R10 case.** Already PDF-scoped (item 4/5 say "export-only … CSV is plain data"). **Confirm** the ref/wording state S6-R10 is now **explicitly PDF-only** suite-wide (it currently reads as PDF-only already — likely just a ref-note re-anchor). Low risk, verify. |
| **PV-ROW-08** | [C30348](https://shopview.testrail.io/index.php?/cases/view/30348) | Em-dash only in nullable fields; counts and Revenue/Margin are never null | On-screen/row-model (S3-R9). **Spot-check** it does not assert the em-dash for the CSV (em-dash is on-screen + PDF only; CSV = empty cell). |
| **PV-CALC-13** | [C30371](https://shopview.testrail.io/index.php?/cases/view/30371) | Number formats match the spec per column; rounding is half away from zero | On-screen number formatting (S5-R5). **Spot-check** it does not assert the CSV carries the same formatted (`$`/`%`/separator) numbers — the CSV is now plain per the Aug-17 rule. |

**Primary edits: C30380, C30381.** **Spot-verify / re-anchor: C30382, C30348, C30371.** Final
affected set to be confirmed against the live v10/Aug-17 page when it is pulled.

### ⚠️ Suite-wide phrasing vs "no changes in other reports" — honest flag (Rules 33 / 40)

Chris's rule text says **"New suite-wide rule"**, yet the QA lead separately reports **no changes** to
the SBC / SBR / TU / IV specs (or SV-8582). These are not fully consistent: a suite-wide CSV rule would
touch every report's CSV-content and CSV-null cases (Rule 40 surface reasoning). **Precedence (Rule 33):
the QA lead's explicit "no changes in the other reports" governs**, so this task scopes the work to
**Parts Velocity only.** During the reconciliation, **spot-verify** whether the other reports' CSV
cases already comply with plain-numbers/empty-nulls (many were written that way) — but **do not
re-version or edit other reports' cases without a fresh QA-lead go-ahead.** Recorded as a spot-verify,
not an authorised expansion.

---

# DELTA B — WIP spec (Confluence updated Aug 18–19) — three changes; **2 already covered (spot-verify), 1 NEW (Story-5)**

Chris pins the live WIP page at **Confluence v24**. Three changes were reported:

## B.1 — Aug 18: nightly-snapshot GRAIN = one row per WO per tab per day — **LIKELY ALREADY COVERED (spot-verify)**

### Verbatim (as relayed)
> "Nightly snapshot grain changed to one row per work order per tab per day (was one row per work
> order), matching the shipped WorkOrderWipSnapshot."

### Coverage assessment — **ALREADY COVERED by the completed WIP v24 reconciliation.**
`build/report-suite/wip-reconciliation-2026-08-19/EXECUTION.md` already applied Chris's grain ruling —
**one row per job per tab per date, keyed by work order + tab + date (S11-R1)**, plus **max two rows
per job** and **Adjustments only on the status-tab row (S3-R6)** — to the WIP History / snapshot family
(**WIP-API-01 [C30528](https://shopview.testrail.io/index.php?/cases/view/30528)**, C30530, C30531,
C30533, and **WIP-ADJ-07 [C43820](https://shopview.testrail.io/index.php?/cases/view/43820)**), and
live-confirmed the read via the "as of" date. **Action: SPOT-VERIFY only during the reconciliation** —
confirm the grain wording matches the live v24 S11-R1 once the page is exported. **Do NOT re-do.**

## B.2 — Aug 19: line-state model clarified (unapproved-lines job ALSO under Estimates) — **LIKELY ALREADY COVERED (spot-verify)**

### Verbatim (as relayed)
> "Line-state model clarified — a job with unapproved lines now explicitly also appears under
> Estimates (wording fix, build already worked this way)."

### Coverage assessment — **ALREADY COVERED by the completed WIP v24 reconciliation.**
The same reconciliation applied Chris's Ruling 3 line-state model (new **S3-R5 / S3-R6** — "a work
order appears in each tab matching one of its line states", a job writes at most two rows: its status
tab plus Estimates if it has unapproved lines) and **retired the Rule-56 divergence note** on the
placement cases: **WIP-SCOPE-01 [C30456](https://shopview.testrail.io/index.php?/cases/view/30456)**,
**WIP-SCOPE-03 [C30458](https://shopview.testrail.io/index.php?/cases/view/30458)**, **WIP-PLACE-03
[C30464](https://shopview.testrail.io/index.php?/cases/view/30464)**, **WIP-PLACE-05
[C43979](https://shopview.testrail.io/index.php?/cases/view/43979)**. **Action: SPOT-VERIFY only** —
confirm the Estimates-plus-status-tab placement wording matches live v24 S3-R5/S3-R6. **Do NOT re-do.**
(Held Automated atm=3 cases **WIP-PLACE-01 C30462** and **WIP-TAB-02 C30452** were live-verified and
left untouched per Rule 71 — respect that.)

## B.3 — Aug 19: Story 5 fully adopts the Aug-13 design review — **🆕 NEW, NOT COVERED, needs live re-check + case updates**

### Verbatim (as relayed)
> "Story 5 fully adopts the Aug 13 design review (figure names, grouped math, locked tooltips, one
> hero figure, new tab-to-figure highlight) — closes a gap where old tooltips were still shipping."

### Plain-English interpretation — what Story-5 (Summary Strip) cases must adopt
Story 5 = the **WIP Summary Strip** (story **SV-8661**). The Aug-13 design review is now fully in the
spec (v24). The five named adoptions:
- **Figure names** — the summary figures' on-screen names as ratified in the design review.
- **Grouped math** — the figures are grouped (e.g. per-stage figures summing to the hero), with the
  relationships as designed.
- **Locked tooltips** — the figures' info-icon explanations are the **locked design-review wording**;
  *"closes a gap where old tooltips were still shipping"* means the **OLD tooltip text may still be on
  screen / in cases** and must be replaced with the locked wording. This is the sharp part.
- **One hero figure** — a single hero figure (Total Earned) is emphasised.
- **New tab-to-figure highlight** — a NEW behaviour: selecting a tab highlights its corresponding
  summary figure (interaction added by the design review).

### Coverage assessment — **NEW. The WIP v24 reconciliation did NOT touch the Story-5 chart/figure/tooltip layer.**
`wip-reconciliation-2026-08-19/EXECUTION.md` covered History grain, aging, line-state placement, and
S11-R7 — it did **not** touch the Summary Strip figure-name / grouped-math / tooltip / hero /
tab-highlight design layer. Some Story-5 cases already partially reference the design review (e.g.
C30493 cites "S5a-R2 … locked verbatim per Fabian design review"), but the **full Aug-13 adoption is
not reconciled**, and the **"old tooltips still shipping" gap means the tooltip cases need a LIVE
re-check** against the locked wording. This is genuinely **NEW work: live re-check + case updates.**

### Likely-affected WIP Story-5 cases (read-only, from `testrail-id-map.csv`)

| Case | C-id | Title (current) | Design-review element |
|---|---|---|---|
| **WIP-SUM-01** | [C30487](https://shopview.testrail.io/index.php?/cases/view/30487) | The summary strip shows seven figures in a fixed order as US dollars | Figure names / order (S5-R1) |
| **WIP-SUM-02** | [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | Total Earned is the hero figure and equals the started-stage figures summed | **One hero figure** + grouped math (S5-R2) |
| **WIP-SUM-03** | [C30489](https://shopview.testrail.io/index.php?/cases/view/30489) | Total Remaining equals Not Started plus Started − Remaining | **Grouped math** (S5-R3) |
| **WIP-SUM-04** | [C30490](https://shopview.testrail.io/index.php?/cases/view/30490) | Each per-stage figure equals the matching tab's money total | **Grouped math** (S5-R4/5/6/7) |
| **WIP-SUM-05** | [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) | The Estimates figure is the Estimates tab's total quoted value, shown muted | Figure names / grouped math (S5-R8/9) |
| **WIP-SUM-07** | [C30493](https://shopview.testrail.io/index.php?/cases/view/30493) | Each summary figure's information icon reveals its plain explanation | **Locked tooltips** (S5a-R2) — the "old tooltips still shipping" gap; live re-check the wording |
| **WIP-ADJ-05** | [C43818](https://shopview.testrail.io/index.php?/cases/view/43818) | The summary strip shows seven figures and no Adjustments figure | Figure set (S5-R1/S5-R13) |
| **WIP-VIS-02** | [C30520](https://shopview.testrail.io/index.php?/cases/view/30520) | The summary strip is a bold band ruled top and bottom above the tabs | Summary-strip visual (Story 10 S10-R2) — spot-check design consistency |
| **WIP-VIS-06** | [C30524](https://shopview.testrail.io/index.php?/cases/view/30524) | Each summary figure's info icon is keyboard-reachable and screen-read | **Locked tooltips** accessibility (S10-R7 / S5-R12) — re-check vs new wording |
| **WIP-VIS-08** | [C43838](https://shopview.testrail.io/index.php?/cases/view/43838) | Active view tab shows the selected-tab highlight (amber glow) when clicked | Closest existing case to the **new tab-to-figure highlight** — re-check whether it now must also assert the tab highlighting its corresponding summary figure |

**Also:** the **new tab-to-figure highlight** interaction may have **no existing case** (WIP-VIS-08
covers the tab's own amber glow, not necessarily the figure highlight). The reconciliation should
determine whether a **new case** is needed — that is an `add_case`, which needs the QA-lead go-ahead and
is subject to the Rule-62 creation-hold (register H1).

**⚠️ Rule 71 (held Automated):** the register records **14 WIP cases at `custom_atmstatus=3`** (held
Automated). Several Story-5 cases may be atm=3 — editing them requires a coupled build-verify pass and
must be ask-first. The reconciliation must live-re-read atm before writing any Story-5 case.

---

## Recommended reconciliation scope (for the QUEUED pass, AFTER Filters)

1. **PV CSV Aug-17 rule** — extend C30380 + C30381 to the full plain-number/empty-null rule; confirm
   C30382 S6-R10 is explicitly PDF-only; spot-verify C30348, C30371. Live re-check against the v10
   Aug-17 CSV once cookies + page body are available.
2. **WIP B.1 + B.2** — SPOT-VERIFY only (grain + line-state already applied); no re-do.
3. **WIP B.3 Story-5** — live re-check the Summary Strip family (C30487–C30493, C43818) + tooltip cases
   (C30493, C30524) against the locked Aug-13 design-review wording; assess whether the tab-to-figure
   highlight needs a new case (ask-first). Respect Rule 71 for atm=3 cases.
4. **Source pulls owed** — the live **PV v10/Aug-17** page body and the live **WIP v24** page body
   (SSO-walled; user export owed) for byte-level diffs.

**No TestRail / Jira / staging write until this pass is authorised AND Filters is done.**
