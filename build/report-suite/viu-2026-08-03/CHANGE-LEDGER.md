# Report Suite — CHANGE LEDGER (what to correct, create, retire) · 2026-08-03

**What this is.** The QA lead asked for every part of every case to be reviewed, not just its
behaviour: *"Make sure that we correct the references in the test cases where needed and see every
part of those test cases to see if something needs to be corrected/edited/created as new."* This is
the sign-off list. **Nothing here has been pushed to TestRail** — it is all staged for authorisation.

**The full per-case table, with all seven field verdicts for all 475 cases, is
`change-ledger.csv`** (one row per case, with the C-id and a clickable TestRail link). This document
holds the totals and every row that needs a human decision.

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

Specs **SBC v13 · SBR v15 · PV v4 · TU v5 · WIP v6 · IV v3** — all confirmed current 2026-08-03
(SBC refreshed that day; the refreshed capture is `../spec-watch-verification-2026-08-03/live-capture-2026-08-03/`).
Epic **SV-8582 — PARTIAL** (not re-read this run; 6 stories reopened as of 2026-07-31).
Designs **N/A** (spec-only project, no Rule-35 queue). Tech plan **PARTIAL** (2026-07-29, not re-fetched).
PO answers — Chris Ward through 2026-08-01, **CURRENT**.
**Live build `sv8582.qa.shopview.com` `v3.4.1-0ed4433` — PARTIAL, DECLARED NOT FINAL.**
Every verdict below is provisional and queued in `RECHECK-QUEUE.md` (**OPEN**).

---

## TOTALS

| Verdict | Cases | What it means |
|---|---:|---|
| **CORRECT AS IS** | **86** | An assertion of the case was observed live and matched. |
| **PARTLY OBSERVED** | **243** | Some of the case's assertions were observed live and held; the rest of that case still needs driving. **Not a pass.** |
| **NOT REACHED** | **124** | Honestly not observed this run. Each row says what is needed. |
| **DEVIATION** | **13** | Observed live; **our case is right** and the build is behind a ruling or a requirement. **No case change.** |
| **EDIT NEEDED** | **7** | Observed live; **our wording is what must change**. Current vs proposed text given. |
| **REFUTED → EDIT NEEDED** | **2** | Our case asserts something the build plainly contradicts. |
| **NEW CASE NEEDED** | **1** | See the new-cases section. |
| **RETIRE / RESCOPE** | **0** | Nothing became obsolete against this build. |
| **TOTAL** | **475** | |

**Per report** — CORRECT AS IS / PARTLY / NOT REACHED / DEVIATION / EDIT / REFUTED:

| Report | Total | Correct | Partly | Not reached | Deviation | Edit | Refuted |
|---|---:|---:|---:|---:|---:|---:|---:|
| SBC | 84 | 13 | 34 | 32 | 2 | 2 | 1 |
| SBR | 111 | 13 | 48 | 47 | 3 | 0 | 0 |
| PV | 71 | 14 | 52 | 3 | 1 | 1 | 0 |
| TU | 60 | 13 | 15 | 29 | 2 | 1 | 0 |
| WIP | 79 | 17 | 51 | 5 | 3 | 2 | 1 |
| IV | 70 | 16 | 43 | 8 | 2 | 1 | 0 |

**Read this honestly:** **86 of 475 cases have a live-matched assertion**, and a further **243 are
part-way there**. **No case is being reported as fully VIU-Verified**, because on a non-final build
that claim cannot be made (Rule 49) and because I did not drive every step of any single case end to
end. The suite is a great deal better evidenced than it was this morning, when **every one of the
475 was VIU-Pending and nothing had ever been seen running**.

---

## FIELD-BY-FIELD SWEEP (all 475 cases, every field)

| Field | Result |
|---|---|
| **Title — length** | **475 / 475 within 80 characters.** Zero over. Clean. |
| **Title vs expected result** | **445 clean · 30 flagged for a human read.** The flag is a keyword-overlap heuristic, not a defect — it lists cases whose title words do not obviously recur in the expected text. They are listed in `change-ledger.csv` (`field_title_vs_expected`) and most are almost certainly fine (e.g. *"Without reports access Inventory Value is absent from the navigation"*). **I am not claiming 30 defects — I am claiming 30 need eyes.** |
| **Preconditions** | Reviewed for reachability on the areas I drove. Every precondition I actually needed was satisfiable on this estate by seeding — **no case failed for want of data** (Rule 14). The one genuine exception is QuickBooks (below). |
| **Steps** | One case has a **non-executable step**: SBC-DATE-03 = [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) tells the tester to choose a **"Custom"** item in the date-range picker; **no such item exists on the build.** |
| **Expected results** | The 22 adjudicated rows below. Rule 42 compliance is good: the closed "exactly this list" enumerations I checked (SBC-EXP-03, SBC-DATE-01, SBR-EXP-10/11, SBR-COL-01, TU-COL-01, WIP-COL-01) are all **scope-conditional or version-pinned with the anchor that closes them** — which is why the deviations below are legible instead of ambiguous. |
| **References (Rule 20)** | **475 / 475 carry a Jira ticket. 474 / 475 carry a spec anchor. 475 / 475 have a TestRail C-id.** The single exception is **PV-PREC-02 = [C38925](https://shopview.testrail.io/index.php?/cases/view/38925)**, whose refs say in as many words that **no report spec covers QuickBooks** and cite the tech plan instead — a documented exception, not an unsourced case. **No ref points at spec text the refreshed specs have removed** (checked against the current captures). **No reference change is needed anywhere.** |
| **Section (Rule 4)** | **30 cases** are marked `api_related` and belong in an API-titled section; they are already placed in `<Report> — API` sections. A separate automated sweep raised 5 apparent API-content-in-a-UI-case hits — **all 5 are false positives**: they matched on dollar amounts (`$400.00`), a day count (`400 days`) and CSS font weights (`700` / `400`). **No section move needed.** |
| **Notes (Rule 49)** | **All 475 need one addition** — the non-final-build marker: *"Observed on QA branch build v3.4.1-0ed4433 on 2026-08-03; the branch was declared not final, so this observation is provisional and is queued for re-check."* This is a metadata-layer note, never a tester-facing line. |
| **Rule-24 tester notes** | No new FE-hidden / BE-allowed situation was found in the Report Suite. The permission model is enforced on the **back end** (403s observed), so the Rule-24 pattern does not arise here. Nothing to add. |

---

## THE 22 ROWS THAT NEED A DECISION

### EDIT NEEDED — our wording changes (7 + 2 refuted)

| # | Case | Field | CURRENT (verbatim) | PROPOSED |
|---|---|---|---|---|
| 1 | **WIP-COL-02** = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | Expected item 3 | *"Location is NOT offered in the column-selection control — it appears on its own whenever more than one location is in scope, and is hidden when a single location is in scope."* | *"Location is offered in the Column Selection panel, between VIN and Advisor, and is off by default. Turning it on adds a Location column showing which location each job belongs to."* — and add **Location** to item 2's off-by-default list. **Items 1 and 2 otherwise match the build exactly.** |
| 2 | **SBC-NAV-01** = [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) | Expected item 1 | *"…is listed in the Performance group of the Reports left-side navigation, BELOW the pre-existing entries (Sales, Technician Efficiency, Advisor Analysis, Shop Efficiency)"* | *"…is listed under the SALES heading of the Reports left-side navigation."* The live headings are LABOR / PERFORMANCE / PARTS / SALES / FINANCE / ACCOUNTS RECEIVABLE / ACCOUNTS PAYABLE / ACCOUNTING / COMMUNICATIONS. The spec names no group at all, so nothing is contradicted. |
| 3 | **SBC-EXP-15** = [C30173](https://shopview.testrail.io/index.php?/cases/view/30173) | Expected item 1 | *"The export still downloads — no error and no warning is shown."* | *"No file downloads. A warning appears reading \"Empty export\" and \"Export didn't yield any results\", which you close."* |
| 4 | **SBC-EXP-09** = [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | Expected | *"(exact position in the file is confirmed in the build)"* | Pin it: *"the Locations line is the first line of the file"*, and add: *"when every location is in scope the line reads \"Locations: All locations\" rather than listing the names."* |
| 5 | **TU-LOC-01** = [C30442](https://shopview.testrail.io/index.php?/cases/view/30442) | Expected item 2 | *"plus an \"All Locations\" option"* | *"plus an \"All locations\" option"* (lower-case L), and mention the **"Clear all"** action the filter also offers. Item 1 matches. |
| 6 | **IV-COL-01** = [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) | Expected item 1 | *"…Vendor, Qty on Hand, Unit Cost…"* | *"…Vendor, Qty, Unit Cost…"* — the build's header is **`Qty`**. Everything else, including Location between Vendor and Qty, matches. |
| 7 | **PV-ROW-06** = [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | Expected | *"Turns / Yr"* | *"Turns/Yr"* (no spaces). The three info icons are present as asserted; their tooltip **texts** were not read this run. |
| 8 | **WIP-EXP-02** = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | Expected item 1 | *"Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total last."* | Keep, and add: *"Inv. Hrs is the one exception — it cannot be included in a download on this build, so if you switch it on it will not appear in the file."* |
| 9 | **WIP-TOT-02** = [C30495](https://shopview.testrail.io/index.php?/cases/view/30495) | Expected item 2 | *"The Totals row's Inv. Hrs shows the sum…"* | Keep for the on-screen Totals row; add that this cannot be checked in a download because Inv. Hrs is not exportable on this build. |

### DEVIATION — keep our case, the build is behind (13)

Every one of these is a case where a **newer authoritative ruling** beats the spec text (Rule 32) and
the build has followed the older document. **No case change.** Each says whether I read it as
**unbuilt-yet** or a **defect**.

| # | Case(s) | What the build does | Our basis | My read |
|---|---|---|---|---|
| 10 | **SBR-LOC-04** = [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) · **TU-LOC-05** = [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) · **IV-LOC-04** = [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) · **PV-FILT-13** = [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) | **Observed live:** a user with access to exactly ONE location **still sees the Location filter** on all six reports | Chris Ward **Q1 = A**: hidden | **Build follows the un-updated spec** (SBR S21-N1, TU S9-N1, IV S7-N1, PV S2-E4 all say *"still sees the filter"*). **Highest-risk item in the suite** — a dev reading the spec builds the opposite of what four of our cases assert. Product decision, not a bug ticket, until Chris confirms. |
| 11 | **WIP-COL-05** = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) · **WIP-SORT-03** = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) · **WIP-FLT-03** = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | The WIP export's `Unit` column carries the **unit number**, with the VIN in a separate column — i.e. unit-number-first | Chris Ward 2026-07-29: *"A is the correct answer"* — VIN → Unit # → plate | **Build follows the un-updated WIP spec S4-R7/S4-R9.** This is the **third** time the spec edit has been owed. Unbuilt-yet. |
| 12 | **TU-EXP-01** = [C30434](https://shopview.testrail.io/index.php?/cases/view/30434) | Menu has **four** items: `Summary (PDF)` · `Summary (CSV)` · `Expanded (PDF)` · `Expanded (CSV)` — no "Download" prefix | Our case says three, with "Download" prefixes, from TU S7-R3/R4 which **closes** the list | Product question for Chris. Shipped strings. |
| 13 | **SBC-DATE-01** = [C30102](https://shopview.testrail.io/index.php?/cases/view/30102) | **Nine** presets — Last 12 Months · This Year · Last Year · This Quarter · Last Quarter · This Month · Last Month · This Week · Last Week — plus an inline calendar, a "Range: N days" readout and Apply. No Today, no Yesterday, no "Custom" item | SBC S2-R2 **closes** an eleven-option list | **Unbuilt-as-specified in a shared component**, not a defect — the same picker serves every report. Needs a product decision. Item 3 ("no All Time") **matches**. |
| 14 | **SBC-DATE-03** = [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | No "Custom" item to choose | S2-R3/R4/N2 | Same decision as row 13. **The case's steps are not executable as written** — flagged under Steps above. |
| 15 | **SBR-EXP-10** = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) | Summary CSV has **nine** headers: `Representative, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal`. Missing `# Invoices`, `# Customers`, `Hrs Worked`, `Hrs Invoiced` | Our thirteen-header list, scope-conditional | **Unfinished export** — the data payload *does* carry `invoice_count`, `hours_worked`, `hours_invoiced`, so the numbers exist and only the file is short. |
| 16 | **SBR-EXP-11** = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) | Expanded CSV: `Representative, Invoice #, Date, Customer, Invoice Status, [Location,] Hrs Worked, …` — 15 columns | Our list has Date before Invoice #, and "Status" | Order slip + a renamed header. Also **confirms Location lands right after the status column** when scope spans locations — exactly the other author's assertion. |
| 17 | **the rep label**, affecting rows 15–16 and **SBR-WO-06** = [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) | The build says **`Representative`** | Spec says `Sales Rep`; Chris ruled `Sales Representative` | **Three different words from three sources.** Do not edit until Chris rules. |
| 18 | **IV-EXP-02** = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | The export re-orders the columns and ends with `Margin %`; `Total Cost` sits 9th, although on screen it **is** last | IV S10-R3–R6 (screen order, Total Cost last) | Implementation slip. Same columns, different order. |
| 19 | **PV export + IV export PDFs** — PV-EXP group, IV-EXP group | `format=pdf` returns **HTTP 500** at whole-list scope (*"An error occurred… please try again a bit later later"*, request ids `785df944-…`, `46899551-…`, `13edda95-…`, `1d2e0569-…`); the **CSV of the identical scope succeeds**, and the PDF succeeds once narrowed | — | **I believe this is a genuine defect**, and the most reportable thing found. There is already a friendly guard for over-large exports (`400` + *"This report is too large to export…"*) and the PDF path 500s instead of using it. **Not filed — that is the QA lead's call.** |

### NEW CASE NEEDED (1)

| Case | What it covers | Why nothing covers it |
|---|---|---|
| **`SBC-API-06`** (staged elsewhere, no C-id yet) | The back end serves the SBC report data **and** its export with only ordinary reports access, and refuses both without it | SBC has 5 API cases and **none** touches the permission surface — the surface SV-8780 concerns. **The evidence for it now exists**: with an 8-atom role holding only `reportsPageAccess` both endpoints returned **200**; with Foreman (no such atom) both returned **403 "Access denied."** If the QA lead authorises the case it can land **VIU-Verified**, not Pending. |

**No case should be retired or rescoped** on this build's evidence. Nothing was found to be obsolete.

---

## THE 86 "CORRECT AS IS" — the ones the build confirms

Every one is quoted side by side against the build in `LABEL-DIFF.md` §B (Rule 45(e) — no bare
"covered" verdicts). The standouts:

- **SBC-EXP-03** = [C30161](https://shopview.testrail.io/index.php?/cases/view/30161) — a
  **perfect** thirteen-column / fourteen-with-Location match on both scopes. The best case in the suite.
- **SBC-EXP-01** = [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) — four export
  labels verbatim, in order, and **no Print anywhere on the build**.
- **SBR-COL-01** = [C30265](https://shopview.testrail.io/index.php?/cases/view/30265) — both closed
  lists (seven toggles, five always-on) exactly right.
- **WIP-EXP-07** = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) — predicted
  the `Unit` / `Branch` export headers **and** predicted that the Unit header would not change; both held.
- **TU-COL-01** = [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) and
  **SBC-COL-01** = [C30156](https://shopview.testrail.io/index.php?/cases/view/30156) — tooltip and
  toggle lists exact.
- **The 16 one-permission cases** — verified in both directions.
- **The WIP money contract** — `Earned = Labor + Parts`, `Remaining` likewise, `Total = Earned +
  Remaining`, recomputed over **all 178 live rows** with **zero** mismatches; 77 zero-value estimates
  present rather than hidden; every job in exactly one tab.
- **The IV money contract** — `786.55 × $14.21 = $11,176.88`, `× $21.86 = $17,193.98`,
  margin `$6,017.10`, `35.0%`. All four exact.

---

## HOW TO USE THIS

1. Read the 22 decision rows. Rows 1–9 are **ours to fix** and need only a yes.
2. Rows 10–19 are **questions for Chris** or **for dev** — no case changes.
3. Row 20 (the new case) needs a yes, and then a run-sync (`update_run` union on run 359).
4. Everything else is either confirmed or honestly listed as remaining work.
5. **Nothing has been written to TestRail.** When the pushes are authorised, each touched case must
   also get the Rule-49 non-final-build note, and each must be **re-read end to end** before saving
   (Rule 41) — the log for that push must record *"re-verified whole against &lt;spec + version&gt;"*
   per case, not just the field edited.
