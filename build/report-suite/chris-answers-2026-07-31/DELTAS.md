# Report Suite — CONSEQUENCES of Chris Ward's 2026-07-31 answers + the 2026-07-29 spec changelog

> Inputs folded in together (Rule 32 latest-wins, Rule 33 precedence):
> 1. **Chris Ward's 5 answers, 2026-07-31** — `answers-ingested.md` (PO ruling = top authority).
> 2. **The six spec pages he re-published 2026-07-29** (SBC v12 / SBR v15 / PV v4 / TU v5 /
>    WIP v6 / IV v3) — `../spec-current-2026-07-31/SPEC-DIFF-2026-07-31.md`.
>
> Baseline suite: **465 active cases**, all live in TestRail under group 4281, id-map 465/465
> with 0 blanks. Run R359 held 465 tests + 539 recorded results before this pass.
>
> **Nothing in this file is live-verified** (Rule 12) — the Report Suite QA branch is still not
> available, so every item is spec/answer reconciliation to be VIU-confirmed live later.

---

## Summary of dispositions

| Disposition | Count | Cases |
|---|---|---|
| **APPLY-NOW** (edit an existing case) | **70** (executed) | D1–D10 below |
| **NEEDS-NEW-CASE** | **7** | D11 (6 Location-column cases) + D12 (1 WIP export-cap case) |
| **NO-CHANGE** (already correct — recorded so it is provably checked, not skipped) | 13 | N1–N4 below |
| **RETIRE-CANDIDATE** | **0** | nothing in his answers or the changelog retires a case (SBC Print was already retired 2026-07-28) |
| **STILL-AMBIGUOUS** (do NOT guess — ask him) | **3** | A1–A3 below |

Post-pass tally: **465 + 7 = 472 active cases** — ALL PUSHED AND VERIFIED 2026-07-31
(70 `update_case` + 7 `add_case`, all HTTP 200 + re-GET MATCH, 0 deletes; run 359 case-synced
465→472 tests with its 539 recorded results untouched). Audit log:
`testrail-execution-log-2026-07-31.md`. New C-ids: SBC-LOC-04 = C38912, SBR-LOC-05 = C38913,
PV-FILT-14 = C38914, TU-LOC-06 = C38915, WIP-FLT-09 = C38916, IV-LOC-06 = C38917,
WIP-EXP-10 = C38918.

---

## D1 — Q2: one suite-wide "too large" message  → APPLY-NOW (2 cases)

**His ruling:** *"A - great catch"* = one message everywhere:
**"This report is too large to export. Narrow the date range or filters, then try again."**

| Case | C-id | What changes |
|---|---|---|
| SBC-EXP-14 | [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) | Expected 2: `"This export is too large to generate…"` → **`"This report is too large to export. Narrow the date range or filters, then try again."`** |
| SBR-EXP-15 | [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) | Expected 2: `"This export is too large to generate. Narrow the date range or filters and try again."` → the ruled string (note it ALSO fixes a second drift — the missing word "then") |

Already correct, no change: IV-EXP-07 (C30593), PV-EXP-11 (C38885), TU-EXP-09 (C38887) — they
already carry the ruled string. **Spec follow-up:** the SBC spec text (S14-R16 / S15-R25 / §7) still
carries the losing wording — Chris's edit needed.

## D2 — Q1: the Location filter is hidden for a one-location user  → APPLY-NOW, refs only (4 cases)

**His ruling:** *"A -- classic spec drift"* = hidden. **Our four cases ALREADY assert exactly
this**, so the tester-facing words do not change. What changes is the **traceability metadata**:
they currently cite the kickoff video + the 2026-07-28 "video authoritative" user ruling as the
basis for over-riding the spec; they must now cite **the PO's direct answer** (a far stronger
source, and it retires the "pending his answer" caveat).

SBR-LOC-04 [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) ·
TU-LOC-05 [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) ·
IV-LOC-04 [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) ·
PV-FILT-13 [C30340](https://shopview.testrail.io/index.php?/cases/view/30340)

**Spec follow-up:** SBR S21-N1, TU S9-N1, IV S7-N1, PV S2-E4 all still say the single-location user
"still sees the filter" — four spec notes needing Chris's edit.

## D3 — Q1 applied to the two reports that had no such case  → APPLY-NOW (2 cases)

His ruling is suite-wide, but only 4 of the 6 reports had a single-location case. Rather than
author two near-duplicates (Rule 28 — no near-duplicate explosion), the assertion is **added to
the existing Location-filter case** on the two missing reports:

| Case | C-id | What changes |
|---|---|---|
| SBC-LOC-01 | [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) | + step and expected: for a user with access to only one location the Location filter is not shown at all |
| WIP-FLT-06 | [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) | same addition |

## D4 — Q4: the permission model  → APPLY-NOW (3 cases) + a DEV-FACING NOTE ⭐

**His ruling, verbatim:** *"A - the intention is to not hide these from normal reports access.
These were specced before CRP was built :)"*

**Plain outcome: the cases CHANGE, and a dev change ticket is needed.** Both halves matter:

1. **He is ruling on INTENDED BEHAVIOUR** ("the intention is…"), so per Rules 30/32/33 his product
   ruling wins and our cases must express the unified model: **all six reports are gated by the
   ordinary reports permission; no report gets its own dedicated View permission.**
2. **The BUILD currently differs.** The engineering tech plan (§B5.3) has every Sales By Customer
   endpoint gating on a NEW dedicated atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` rather than
   `ROLE_REPORT_VIEW`, and the plan itself flags the bundle placement as *"a product-level decision
   to surface"* (plan decision #5). SBC spec v12 **S1-R2** still says, verbatim: *"The report is
   gated by a dedicated Sales By Customer report View permission — it is not tied to a generic 'all
   reports' permission."* So this is a **product-ruling-vs-build gap → a dev change ticket, NOT a
   silent case flip.** Deliverable: `Q4-permission-dev-note-2026-07-31.md` (dev-facing, plus the
   spec-text correction he owes on SBC S1-R2).

**Cases changed (Sales By Customer is the only report that asserted a dedicated permission):**

| Case | C-id | What changes |
|---|---|---|
| SBC-PERM-01 | [C30098](https://shopview.testrail.io/index.php?/cases/view/30098) | Title + body move from "the dedicated Sales By Customer View permission" to **the ordinary reports access**; the old expected 3 ("access is granted by the dedicated permission itself — not tied to a generic all-reports permission") is **inverted** to the ruled model, plus a plain tester note that the build may still enforce a separate permission and that this is the pending change (raise it, do not edit the test) |
| SBC-PERM-02 | [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) | negative case re-based on the ordinary reports permission |
| SBC-NAV-01 | [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) | precondition "Your role has the Sales By Customer report View permission" → the ordinary reports access |

**Also (LOCAL-ONLY, no TestRail write):** the `permissions_required` metadata field on the **81**
SBC case bodies reads "Sales By Customer report View permission." That field is **not emitted to
TestRail** (`gen_import.py` excludes it) — it is updated locally for coherence only.

**No change to the other five reports' permission cases** — see ambiguity **A1**.

## D5 — Q5: the full word "Sales Representative" everywhere  → APPLY-NOW (24 cases)

**His ruling, verbatim:** *"A - … Rep is too much slang, let's do representative everywhere"*
(scope A = every label, including the work-order box and the assignments download with its file and
columns).

**Rule applied uniformly** (stated here so the sweep can check it): **every UI-visible string** —
label, column header, dropdown entry, dialog sentence, accessible name, file name — uses **"Sales
Representative"**; and our own prose naming the role spells it out too. **Nothing else in the case
changes.** Precedent already in the suite: SBR-WO-06 (C30315) was flipped for the customer card on
2026-07-30 — this pass makes the remaining 25 consistent with it (and fixes an internal
inconsistency inside SBR-WO-06 itself, whose step 3 still said "Sales Rep selector" while its title
and expected 1 said the full word).

| Group | Cases | What changes |
|---|---|---|
| WO selector label + accessible name | SBR-WO-01 [C30310](https://shopview.testrail.io/index.php?/cases/view/30310), SBR-WO-02 [C30311](https://shopview.testrail.io/index.php?/cases/view/30311), SBR-WO-03 [C30312](https://shopview.testrail.io/index.php?/cases/view/30312), SBR-WO-04 [C30313](https://shopview.testrail.io/index.php?/cases/view/30313), SBR-WO-05 [C30314](https://shopview.testrail.io/index.php?/cases/view/30314), SBR-WO-06 [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) | `"Sales Rep"` selector → `"Sales Representative"`; accessible name likewise |
| Assignments export (entry, note, file, column) | SBR-ASGN-01 [C30292](https://shopview.testrail.io/index.php?/cases/view/30292), SBR-ASGN-02 [C30293](https://shopview.testrail.io/index.php?/cases/view/30293), SBR-ASGN-03 [C30294](https://shopview.testrail.io/index.php?/cases/view/30294), SBR-ASGN-04 [C30295](https://shopview.testrail.io/index.php?/cases/view/30295), SBR-ASGN-05 [C30296](https://shopview.testrail.io/index.php?/cases/view/30296), SBR-ASGN-06 [C30297](https://shopview.testrail.io/index.php?/cases/view/30297), SBR-DEACT-06 [C30257](https://shopview.testrail.io/index.php?/cases/view/30257), SBR-PERM-02 [C30199](https://shopview.testrail.io/index.php?/cases/view/30199) | `"Sales Rep Assignments"` → `"Sales Representative Assignments"`; CSV header `Sales Rep` → `Sales Representative`; the file no longer uses the short form (expected `sales-representative-assignments.csv`, exact final file name to be VIU-confirmed) |
| Export column headers | SBR-EXP-10 [C30285](https://shopview.testrail.io/index.php?/cases/view/30285), SBR-EXP-11 [C30286](https://shopview.testrail.io/index.php?/cases/view/30286), SBR-EXP-12 [C30287](https://shopview.testrail.io/index.php?/cases/view/30287), SBR-EXP-13 [C30288](https://shopview.testrail.io/index.php?/cases/view/30288) | first header `Sales Rep` → `Sales Representative` |
| Deactivation dialog sentence | SBR-DEACT-02 [C30253](https://shopview.testrail.io/index.php?/cases/view/30253), SBR-API-06 [C30321](https://shopview.testrail.io/index.php?/cases/view/30321) | `"{Staff Name} is the sales rep on {N} customer{s}."` → `"… is the sales representative on …"` |
| Prose naming the role (SBR-DEACT-04 C30255 was checked and needed NO tester-facing change — notes only, not pushed) | SBR-DEACT-05 [C30256](https://shopview.testrail.io/index.php?/cases/view/30256), SBR-DEACT-07 [C30258](https://shopview.testrail.io/index.php?/cases/view/30258), SBR-UNAS-01 [C30261](https://shopview.testrail.io/index.php?/cases/view/30261), SBR-TYPE-02 [C30206](https://shopview.testrail.io/index.php?/cases/view/30206) | "sales rep" → "sales representative" |

**Spec follow-up:** SBR S19-R1/R7/R8 + Story 15 (9 occurrences of "Sales Rep Assignments") still
use the short form — Chris's edit needed. See ambiguity **A2** for the one label he did NOT name.

## D6 — PV column rename "Sold via WO" → "Sold (WO)"  → APPLY-NOW (9 cases)

Spec source (NEW this changelog, was never on the watch list): PV v4 change-log —
*"renamed the 'Sold via WO' / 'Sold via Parts Sale' columns to 'Sold (WO)' / 'Sold (Parts Sale)'"*
(S3-R9, S4-R3, S4-R4, S5-R4 table, S5-R4b, S5-R7, §4).

PV-COL-01 [C30351](https://shopview.testrail.io/index.php?/cases/view/30351) ·
PV-COL-02 [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) ·
PV-COL-03 [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) ·
PV-ROW-08 [C30348](https://shopview.testrail.io/index.php?/cases/view/30348) ·
PV-CALC-05 [C30363](https://shopview.testrail.io/index.php?/cases/view/30363) ·
PV-CALC-11 [C30369](https://shopview.testrail.io/index.php?/cases/view/30369) ·
PV-CALC-13 [C30371](https://shopview.testrail.io/index.php?/cases/view/30371) ·
PV-CALC-15 [C30373](https://shopview.testrail.io/index.php?/cases/view/30373) ·
PV-CALC-16 [C30374](https://shopview.testrail.io/index.php?/cases/view/30374)

## D7 — PV "Catalogue" → "Special Order" (the rename is now RATIFIED)  → APPLY-NOW (16 + 5 refs)

SPEC-WATCH #7 is now closed: PV v4 pins the exact label — **S2-R1** Type filter options *"Both,
Inventory, **Special Order**"*; **S3-R5** *"The **Type** column displays `Inventory` or `Special
Order` as plain text."* The 2026-07-29 pass renamed only 4 cases (PV-FILT-01/09, PV-ROW-05,
PV-EXP-08); the remaining **16 tester-facing** cases still say "Catalogue":

PV-ROW-02 C30342 · PV-ROW-03 C30343 · PV-ROW-04 C30344 · PV-ROW-08 C30348 · PV-ROW-09 C30349 ·
PV-COL-06 C30356 · PV-CALC-02 C30360 · PV-CALC-06 C30364 · PV-CALC-07 C30365 · PV-CALC-09 C30367 ·
PV-CALC-10 C30368 · PV-CALC-11 C30369 · PV-CALC-14 C30372 · PV-CALC-15 C30373 · PV-EXP-04 C30378 ·
PV-EXP-07 C30381

Plus **5 refs/notes-only** (LOCAL-only, no TestRail write): PV-CALC-03, PV-FILT-01, PV-FILT-08,
PV-FILT-09, PV-ROW-05.

## D8 — Technician Utilization: the ratified column selector + 3 new deltas  → APPLY-NOW (6 cases)

| Case | C-id | What changes | Spec |
|---|---|---|---|
| TU-COL-01 | [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) | The placeholder written from the group message is replaced with the **ratified** detail: tooltip **"Column Selection"**, position immediately after the three-dot menu, **Technician always shown and cannot be turned off**, the other five (Total Hours, WO Hours, Internal Hours, Utilization %, **Est. Lost Labor**) all toggleable and all on by default, **Location never listed**, order never changes, **selection remembered per browser** with a defensive fallback | new **Story 10** S10-R1…R6 |
| TU-ELL-02 | [C30405](https://shopview.testrail.io/index.php?/cases/view/30405) | Est. Lost Labor pinned/bold/info-icon assertions gain the **"when shown"** qualifier and a line that it can now be hidden (it was previously always-on) | S2-R10/R11, S8-R4/R6 (all re-worded "When shown") |
| TU-VIS-01 | [C30447](https://shopview.testrail.io/index.php?/cases/view/30447) | Toolbar order corrected: **⋯ menu → Column Selection → date-range picker → technician filter → Location (rightmost)**. Two changes vs the old case: Column Selection inserted, **and the date-range picker and technician filter swap places** | S8-R3 (rewritten) |
| TU-EXP-01 | [C30434](https://shopview.testrail.io/index.php?/cases/view/30434) | adds "…followed by the Column Selection control" | S8-R2 |
| TU-EXP-06 | [C30439](https://shopview.testrail.io/index.php?/cases/view/30439) | **Expected inverted:** "with no logo set, the PDF views show no logo" → **the bundled ShopView default logo (not a blank space)** | S7-R11 + S7-N2 (both rewritten) |
| TU-EXP-04 | [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) | adds that both downloads mirror the **currently-shown columns** (the exports now follow the column selector) | S7-R10 (rewritten) |

## D9 — Sales By Customer exports: the Summary/Expanded split is now RATIFIED  → APPLY-NOW (5 cases)

SPEC-WATCH #2 and #3 are closed; the ratified detail goes beyond what the group message gave us:

| Case | C-id | What changes | Spec |
|---|---|---|---|
| SBC-EXP-02 | [C30160](https://shopview.testrail.io/index.php?/cases/view/30160) | **Filenames changed** — the old flat `sales-by-customer-{range}.csv` map becomes `sales-by-customer-summary-{range}.csv` / `sales-by-customer-expanded-{range}.csv` (and `.pdf`); the case's menu clicks change from "Download (CSV)/(PDF)" to the four ratified items | S14-R14, S15-R6 |
| SBC-EXP-03 | [C30161](https://shopview.testrail.io/index.php?/cases/view/30161) | Expanded CSV is now **13 columns including Asset** (Customer, **Asset**, Invoice #, Date, …) — the case still asserts the old twelve-column flat list; per-level blank-cell rules restated; the "Parts Sales" bucket appears as an **asset row** | S14-R5, S14-R6, S14-R7 |
| SBC-EXP-16 | [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) | gains the ratified **Summary** column list (Customer, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal) | S14-R4 |
| SBC-EXP-11 | [C30169](https://shopview.testrail.io/index.php?/cases/view/30169) | Expanded PDF body = the Expanded columns **with the asset layer**, one block per customer; Summary PDF body = one row per customer; header title stays "Sales By Customer Report" for both versions | S15-R5, S15-R13, S15-R19, S15-R21 |
| SBC-EXP-06 | [C30164](https://shopview.testrail.io/index.php?/cases/view/30164) | loading state is now **per menu item** (four items, each with its own loading state and failure toast) | S14-E1, S15-E1 |

Already correct: SBC-EXP-01 (C30159 — four items, no Print), SBC-EXP-09 (C30167 — PDF "Locations:"
line), SBC-EXP-14 (row cap — message flipped under D1).

## D10 — WIP: the Location column is no longer user-toggleable  → APPLY-NOW (2 cases)

WIP v6 **S4-R3** now excludes Location from the column selector: *"The **Location** column is not
offered in the column selector; its visibility is automatic — shown only when more than one
location is in scope (Story 7)."*

| Case | C-id | What changes |
|---|---|---|
| WIP-COL-01 | [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) | precondition "every column is turned on in the column-selection control" can no longer produce Location — reworded to "every toggleable column on, **and more than one location in scope** so the automatic Location column shows"; the order/alignment expectations stand |
| WIP-COL-02 | [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | expected 2 removes **Location** from the list of selector-offered columns and states its visibility is automatic |

## D11 — NEEDS-NEW-CASE: the per-row Location column (6 new cases)

The single biggest thing in this changelog, and the suite has **no** coverage of it: a per-row
**Location** column whose visibility is **automatic** (shown only when more than one location is in
scope, hidden for one), which is **never in the column selector**, and whose per-row value rule
**differs per report**. One case per report (each report is its own TestRail section and its own
rule — this is not a near-duplicate explosion; each covers visibility + the per-row value + the
column's position + that it is not in the selector).

| New case | Report | The per-row rule it must assert | Spec |
|---|---|---|---|
| SBC-LOC-04 (C38912) | SBC | customer/asset rows that span locations read **"Multiple"**; invoice rows read their exact location; column sits immediately after Date | S4-R12, S4-R12a, S20-R19 |
| SBR-LOC-05 (C38913) | SBR | rep summary row = its one location's name, or **"Multiple"** when the rep's invoices span locations; invoice detail row = its own location; the Unassigned row follows the same rule; column sits after Status | S21-R7, S21-R8, S18-R13 |
| PV-FILT-14 (C38914) | PV | inventory row = its own location's name; a merged special-order row = **"Multiple"**; column renders **leftmost, before Type** | S2-R12, S3-R10, S7-R8 |
| TU-LOC-06 (C38915) | TU | technician row = its one location, or **"Multiple"** when hours span locations; per-day detail row likewise; **the Summary row leaves it blank**; column renders leftmost, before Technician | S9-R9, S9-R10, S8-R15 |
| WIP-FLT-09 (C38916) | WIP | every row is one work order, so a WIP row **NEVER shows "Multiple"**; column sits between VIN and Advisor; in exports it is headed **"Branch"** | S7-R13, S7-R14, §4, S9-E1 |
| IV-LOC-06 (C38917) | IV | each row is one part at one location, so IV **never shows "Multiple"**; column is inserted **between Vendor and Qty on Hand** | S7-R6, S7-R7, S3-R1, S12-R10 |

Each also asserts the **constant-width Location filter control** (it must not resize as the
selection changes) — a suite-wide addition in this changelog.

## D12 — NEEDS-NEW-CASE: Q3, the export cap on Work In Progress (1 new case)

**His ruling:** *"A - this was not well thought out by me (the specs were written at different
times)"* = the 10,000-row cap applies to **all six** reports. PV and TU already have a cap case
(PV-EXP-11 C38885, TU-EXP-09 C38887, authored on the tech-plan pass); **WIP has none**.

| New case | What it asserts |
|---|---|
| WIP-EXP-10 (C38918) | An over-cap download on a WIP tab produces **no file** (neither PDF nor CSV) and shows the ruled message **"This report is too large to export. Narrow the date range or filters, then try again."**; below the cap the download works normally. Refs cite Chris's answer, because the WIP spec page still has no cap line. |

**Spec follow-up:** the PV, TU and WIP pages all still lack the cap line — Chris's edit needed on
three pages.

---

## NO-CHANGE (checked, provably fine — not skipped)

- **N1.** The Q1 four cases' tester-facing wording (already "hidden") — only refs move (D2).
- **N2.** The six **"Locations:" export-line** cases already assert the line: SBC-EXP-03 (C30161),
  SBC-EXP-09 (C30167), SBR-EXP-02 (C30277), PV-EXP-02 (C30376), TU-EXP-04 (C30437),
  IV-EXP-02 (C30588), WIP-EXP-02 (C30511) — the 2026-07-29 message pass got there first, and the
  ratified spec matches them.
- **N3.** The **SBC VIN chain** cases (SBC-LBL-01 C30134 + LBL-02/03/04) and the **4 WIP VIN-chain**
  cases (WIP-COL-05 C30470, WIP-FLT-03 C30500, WIP-SORT-03 C30485, WIP-EXP-07 C30516) — already
  flipped and pushed. SBC is now spec-ratified; **WIP is not in the spec text but stands on Chris's
  own later answer** (see SPEC-WATCH 1b) — no case change, spec chase only.
- **N4.** SBC-EXP-01 (C30159, four menu items / no Print) and the retirement of SBC-EXP-13 —
  both now ratified exactly as executed on 2026-07-28.

## STILL-AMBIGUOUS — ask Chris, do NOT guess (Rule 32 iii)

- **A1 — how far does "normal reports access" reach?** His Q4 answer settles Sales By Customer
  (no dedicated permission). But the other five reports' cases each cite a **different existing
  per-area reports permission** — PV/IV "Inventory Reports → View", TU "the timesheet-reports
  permission", WIP "the permission that grants access to Work In Progress reports". Those are
  reports permissions (not new report-specific atoms), so they already satisfy his stated intent
  *"not hide these from normal reports access"* — but whether he wants all five **collapsed into
  one single Reports permission** is not something he was asked and not something we will infer.
  **Cases for those five are left unchanged**; question queued.
- **A2 — the second short-form label he did not name.** Q5 named the WO selector, and the
  assignments download's file and its "Sales Rep" column. The same CSV has a **second** column
  header containing the slang — **`Rep is active?`** (SBR spec S15-R4/R6). His principle ("Rep is
  too much slang") would make it "Representative is active?", but he did not name it. **Left as-is**
  in SBR-ASGN-02 (C30293), SBR-ASGN-05 (C30296), SBR-DEACT-06 (C30257); question queued.
- **A3 — the exact renamed file name.** Flipping "Sales Rep Assignments" implies the download file
  name changes from `sales-rep-assignments.csv`. We record the expected
  `sales-representative-assignments.csv` but **flag it for live confirmation** rather than assert an
  invented build string (Rule 9).

## Spec-text corrections Chris still owes (bundle for one message)

1. **WIP asset identifier** → the VIN → Unit # → plate chain (§4, S4-R7/R8/R9, S7-R4) — *he
   believes he already did this.* **Highest priority.**
2. The four single-location filter notes (SBR S21-N1, TU S9-N1, IV S7-N1, PV S2-E4) → hidden.
3. SBC's "too large" message (S14-R16, S15-R25, §7) → the ruled string.
4. The 10,000-row cap line added to the **PV, TU and WIP** pages.
5. SBC **S1-R2** → the ordinary reports permission (plus the build change).
6. SBR **S19-R1/R7/R8** and Story 15 → "Sales Representative".
7. SBC nav group + the named nav anchors; PV S1-R1 "only report"; the WIP asset-dropdown style.
8. **Logo treatment is inconsistent across the suite** (found by the cross-case sweep): TU now
   says the **bundled ShopView default logo** always, SBC S15-R17 has a three-step chain ending in
   **no logo**, and the PV page has **no logo requirement at all** — yet his 2026-07-29 message
   promised "same logo treatment all reports". No case changed (Rule 15 — spec silent / spec
   inconsistent, flagged).
9. **Mojibake** introduced in SBR v15 and PV v4 (`â‹¯` for `⋯`, `â “˜` for `ⓘ`) — cosmetic, no case
   impact, but it will confuse the next reader.
