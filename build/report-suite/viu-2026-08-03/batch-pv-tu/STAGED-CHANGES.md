# STAGED CHANGES — Parts Velocity + Technician Utilization (2026-08-03/04)

**NOTHING HAS BEEN WRITTEN TO TESTRAIL.** Everything below is staged for the QA lead's
authorisation (Standing Rule 6). Read-only TestRail access was used only to confirm the C-ids.

Observed on QA branch `sv8582.qa.shopview.com`, build **`v3.4.1-0ed4433`** — re-captured at the
start **and** the end of the run and **identical**, so the build did not change mid-run. The branch
was declared **NOT FINAL**, so every change below is provisional (Standing Rule 49).

---

## SUMMARY OF WHAT IS BEING PROPOSED

| Change | Cases | Kind |
|---|---:|---|
| **A. Notes marker** (the Rule-49 non-final-build note, metadata layer only) | **131** | `update_case`, notes field only |
| **B. Build-accurate label corrections** in tester-facing expected results (Rule 9) | **6** | `update_case`, expected (+ title on one) |
| **C. NO CHANGE — the build is wrong, the case is right** | **26 of the 32 deviations** | none |
| **D. One NEW case proposed** (PDF renderer failure boundary) | **1 new** | `add_case`, awaiting authorisation |
| **E. Reference (`refs`) changes** | **0** | none needed — all 131 verified |
| **F. Section moves** | **0** | none needed |
| **G. Retirements / merges** | **0** | nothing became obsolete against this build |

---

## A. THE NOTES MARKER — all 131 cases

Add to the **notes / metadata layer** of every one of the 131 cases (never to a tester-facing
field):

> Observed on QA branch build v3.4.1-0ed4433 on 2026-08-03/04; the branch was declared NOT FINAL,
> so this observation is PROVISIONAL and is queued for re-check.

Per-case list: every row of `verdicts.csv` (column `notes_addition`).

---

## B. BUILD-ACCURATE LABEL CORRECTIONS (6 cases)

These are cases where **the build ships a different on-screen label from the one the spec writes**.
Standing Rule 9 governs the tester-facing text — it must carry the label the tester will actually
see — so our wording changes here. **The spec-vs-build label difference is reported separately as a
deviation** (see `VERDICTS.md`) so Chris Ward can decide which side moves.

### B1 · PV-ROW-06 = [C30346](https://shopview.testrail.io/index.php?/cases/view/30346)

**Title — CURRENT:** `Info icons sit on Units Sold; Demand and Turns / Yr with descriptions`
**Title — PROPOSED:** `Info icons sit on Units Sold, Demand and Turns/Yr with descriptions`

**Expected item 1 — CURRENT:**
> 1. Each of the three headers carries a grey info icon, shown always (not hover-to-reveal) whenever its column is visible; the Turns / Yr icon appears only once that column is enabled.

**PROPOSED:**
> 1. Each of the three headers carries a grey info icon, shown always (not hover-to-reveal) whenever its column is visible; the **Turns/Yr** icon appears only once that column is enabled.

**Expected item 4 — CURRENT:**
> 4. Turns / Yr shows exactly: "How many times you sell through this part in a year. Higher is better."

**PROPOSED:**
> 4. **Turns/Yr** shows exactly: "How many times you sell through this part in a year. Higher is better."

*Basis:* the live header reads **`Turns/Yr`** with no spaces (`evidence/pv/ui/pv-ui-3.json` →
`turnsIconPresent.text`); the icon's own accessible text is verbatim as the case already states.
Everything else in this case passed.

### B2 · PV-COL-01 = [C30351](https://shopview.testrail.io/index.php?/cases/view/30351)

**Expected item 1 — CURRENT (tail):**
> … Demand, Last Sale, On Hand, **Turns / Yr**, Min, Max.

**PROPOSED (tail):**
> … Demand, Last Sale, On Hand, **Turns/Yr**, Min, Max.

*Basis:* the picker's 20 entries were read live — the eighteenth reads `Turns/Yr`
(`evidence/pv/ui/pv-ui-1.json` → `columnMenu`). The count (20) and the order are correct as written.

### B3 · PV-COL-03 = [C30353](https://shopview.testrail.io/index.php?/cases/view/30353)

Same one-label substitution in **expected items 2 and 3** (`Turns / Yr` → `Turns/Yr`). Items 1–3
otherwise match the build exactly, including the canonical-slot behaviour, which was proven by
enabling **Units Returned** and watching it land between Units Sold and Unit Cost.

### B4 · TU-TECH-01 = [C30423](https://shopview.testrail.io/index.php?/cases/view/30423)

**Expected item 1 — CURRENT:**
> 1. The toolbar has a filter labeled "Filter by Technician" that allows selecting more than one technician.

**PROPOSED:**
> 1. The toolbar has a filter labeled **"Technician"** that allows selecting more than one technician (when several are chosen its label reads, for example, "2 technicians").

*Basis:* the control's field label reads **`Technician`** and its value area reads
`All technicians` (`evidence/tu/ui/tu-ui-1.json` → `selects`). Items 2 and 3 passed.
**Spec S5-R1 writes "Filter by Technician" — that difference is logged as a deviation for Chris.**

### B5 · TU-TECH-03 = [C30425](https://shopview.testrail.io/index.php?/cases/view/30425)

**Expected item 1 — CURRENT:**
> 1. "Clear all" sets every currently-listed technician to deselected; "Select all" selects all technicians at once.

**PROPOSED:**
> 1. "Clear all" sets every currently-listed technician to deselected; **"All technicians"** selects all technicians at once.

*Basis:* the menu offers `All technicians`, `Clear all`, then the names — there is no control
labelled "Select all" (`evidence/tu/ui/tu-ui-1.json` → `filter1.menus`). Items 2–4 passed.
**Spec S5-R6 writes "Select all" — logged as a deviation for Chris.**

### B6 · TU-LOC-01 = [C30442](https://shopview.testrail.io/index.php?/cases/view/30442)

**Expected item 2 — CURRENT:**
> 2. It lists the locations the signed-in user has access to, plus an "All Locations" option.

**PROPOSED:**
> 2. It lists the locations the signed-in user has access to, plus an **"All locations"** option and a **"Clear all"** action. (If you only have one location, the "All locations" entry is not offered — you see "Clear all" and your one location.)

**Expected item 3 — CURRENT:**
> 3. "All Locations" acts as a select-all shortcut: …

**PROPOSED:**
> 3. **"All locations"** acts as a select-all shortcut: …

**Expected item 4 — CURRENT (a hedge that can now be replaced with fact):**
> 4. With all locations selected you can tell which location the shown data belongs to — a location label or marking is shown. (Exactly where and how it appears is confirmed in the build; this report pools each technician's hours into one row, so the marking may take a different form here.)

**PROPOSED:**
> 4. With more than one location selected, a **Location column** appears in the table and each row names its location — or reads **"Multiple"** for a technician whose hours span more than one of them. (Where that column sits on screen is checked by its own test.)

*Basis:* lower-case `All locations` plus `Clear all` read live
(`evidence/tu/ui/tu-ui-1.json` → `filter2.menus`); the one-location menu drops the "All locations"
entry (`evidence/perms/singleloc-pv-tu.json`); the "marking" is the Location column with the
literal `Multiple`, observed live. This also removes a Rule-42 hedge.

---

## C. NO CHANGE — the build is wrong and the case is right (26 cases)

Full verbatim spec quotations and my defect-vs-not-built-yet read for each are in `VERDICTS.md`.
Grouped by the underlying build issue so the QA lead can raise them as tickets:

| # | Build issue | Cases affected (internal ID = C-id) | My read |
|---|---|---|---|
| 1 | **The per-row Location column sits after Vendor (PV) / after Technician (TU) instead of leftmost.** In the EXPORTS it *is* first, so screen and file disagree. | PV-FILT-14 = C38914 · TU-HRS-02 = C30401 · TU-LOC-06 = C38915 | Build defect, placement only. Everything else about the column passes. |
| 2 | **A single-location user still sees the Location filter** (Chris ruled it hidden 2026-07-31 Q1=A; PV S2-E4 / TU S9-N1 still say "still sees the filter"). | PV-FILT-13 = C30340 · TU-LOC-05 = C30446 | Build follows the un-updated spec — **product decision, not a bug ticket**, until Chris's spec edit lands. |
| 3 | **Turns/Yr divides by the EXCLUSIVE day count** (215 for Jan 1 – Aug 4), one day short of the spec's inclusive Window. Arithmetic proof on two rows. | PV-CALC-09 = C30367 · PV-CALC-16 = C30374 | Build defect — a clean off-by-one. |
| 4 | **Export success toast reads "Data exported successfully."** instead of the report-specific strings. | PV-EXP-10 = C30384 · TU-EXP-08 = C30441 | Build defect on wording. The FAILURE path is correct on both reports. |
| 5 | **Download filenames differ** — `parts-velocity-report.csv/.pdf` and `technician-utilization-summary/-expanded.*` rather than the specified names. | PV-EXP-05 = C30379 · PV-EXP-06 = C30380 · TU-EXP-02 = C30435 · TU-EXP-03 = C30436 | Build defect. Note the API's own `Content-Disposition` says `velocity-report.csv` — the front end renames it. |
| 6 | **PV PDF is A4 landscape, not A3 landscape.** | PV-EXP-05 = C30379 | Build defect. |
| 7 | **The CSV renders Last Sale as "52 days"** where the spec wants the raw integer. | PV-EXP-06 = C30380 · PV-EXP-07 = C30381 | Build defect (or a spec simplification — Chris's call). |
| 8 | **Long Description/Category/Vendor are not ellipsis-truncated and carry no hover title.** | PV-ROW-07 = C30347 | Build defect. |
| 9 | **The Location filter defaults to ALL locations on a first visit**, not the user's active location. | PV-FILT-10 = C30337 · TU-NAV-03 = C30394 | Build defect on the default. |
| 10 | **An invalid saved date range leaves the report with no date and NO data request** instead of falling back to This Year. | PV-COL-05 = C30355 | Build defect. |
| 11 | **An export with zero columns enabled produces no file at all** (front end short-circuits) instead of a header-only file. | PV-COL-08 = C30358 | Build defect, minor. |
| 12 | **Visual token drift** — surfaces are #F9FAFB not white, no 1px header top border, toolbar padding 0/0/24px, cell padding 14.28px not 2rem, 4px card radius. | PV-VIS-01 = C30385 · PV-VIS-02 = C30386 | Shared report-shell design drift — a **design decision for the PO**, not a Parts-Velocity bug. |
| 13 | **The date picker offers nine presets including "Last 12 Months", with no Yesterday and no Custom item.** | PV-FILT-03 = C30330 | Not-built-as-specified in a **shared** component (the same picker serves all six reports) — product decision. |
| 14 | **The TU download menu has FOUR items** (Summary/Expanded × PDF/CSV) with no "Download" prefix. | TU-EXP-01 = C30434 | Shipped strings + a shipped extra variant — **product question for Chris**, not a bug ticket. |
| 15 | **Neither the TU CSV nor the Summary PDF contains the Summary row, and the expanded CSV is not summary-level.** | TU-EXP-02 = C30435 · TU-EXP-03 = C30436 | Build defect (two separate ones). |
| 16 | **A TU download with NO technician selected still exports** and shows a success toast. | TU-EXP-04 = C30437 · TU-EXP-07 = C30440 | Build defect. |
| 17 | **TU export rows are not ordered Technician A→Z** — they come out in raw server order. | TU-EXP-05 = C30438 | Build defect. |
| 18 | **The TU expand/collapse controls carry no `aria-expanded`** (state reaches assistive technology only through the changing accessible name). | TU-DAY-01 = C30418 | Accessibility build defect, narrow. |
| 19 | **The TU Total Hours link is colour-only at rest** — it gains an underline and a focus outline only on hover/focus. | TU-LINK-01 = C30428 | Accessibility build defect. |

---

## D. ONE NEW CASE PROPOSED — the PDF renderer failure boundary

**Why it is a gap.** The suite already covers the *graceful* over-cap refusal
(PV-EXP-11 = [C38885](https://shopview.testrail.io/index.php?/cases/view/38885),
TU-EXP-09 = [C38887](https://shopview.testrail.io/index.php?/cases/view/38887)). Nothing covers the
distinct, reproducible state where a PDF **under** that cap fails with a bare HTTP 500 while the CSV
of the identical scope succeeds. This came out of the automation-engineer lens (Rule 45b): an
engineer running exports off the real build hits it immediately, and no case would catch it.

**Proposed placement:** `PV — Exports` (a UI case; the request ids are metadata, so no API section
is needed). **Proposed internal ID:** `PV-EXP-12` (**new, no C-id yet**).

**Proposed title (66 chars):** `A large PDF download fails outright while the CSV of the same view works`

**Proposed refs:** `SV-8646 (PV spec v4 2026-07-29 Story 6 exports — spec silent on a renderer size limit; tech-plan-2026-07-29 A3/FR-F4 covers only the 10,000-row cap)`

**Proposed preconditions:**
1. You are signed in with ordinary reports access, on a desktop browser.
2. Parts Velocity is open with a date range that returns a few hundred rows — narrow with the
   toolbar search until the list is roughly 300–500 rows.

**Proposed steps:**
1. Narrow the report with the toolbar search so it shows a few hundred rows.
2. Open the three-dot menu and choose **Download (CSV)**. Wait for the file.
3. Open the three-dot menu again and choose **Download (PDF)**. Wait up to a minute.
4. Narrow the search further, to a couple of dozen rows, and choose **Download (PDF)** again.

**Proposed expected results:**
1. The CSV downloads successfully at that size.
2. The PDF **also** downloads successfully. If instead nothing downloads and a message appears
   saying something went wrong, that is a failure — record roughly how many rows were on screen.
3. Note for the tester: a *very* large view is refused politely with "This report is too large to
   export. Narrow the date range or filters, then try again." — that message is expected and is not
   this failure. This test is about a **medium-sized** view where the CSV works but the PDF errors.
4. The small PDF downloads successfully, which shows the failure depends on size.

**What was observed live (the reason for the case):** Parts Velocity, one location, This Year —
344 rows / 31 pages produced a PDF **twice**, byte-identical (308,830 bytes, 37.9 s and 55.4 s);
449 rows failed **twice** with HTTP 500 (35.1 s and 36.0 s). Because a 55 s success and a 36 s
failure both occurred, it is **not** a wall-clock timeout — it is size-driven. The CSV of every one
of those scopes succeeded, including the full 6,219-row list. The same failure class appears on
Technician Utilization: the This-Year **Expanded** PDF returns HTTP 500 after 32.8 s
(request id `87142301-9ebe-4330-9f3d-c23c91837800`) while its Summary PDF returns in 1.95 s.
Request ids for the PV failures: `4059eddd-e295-4876-9fc5-7f6c9c473342`,
`7c5c451a-e845-459b-bdd4-4f3ff1aa3021`, `1f6ec1cd-458f-4144-822f-ef27c5772267`,
`36af28ab-0a4e-456d-8be5-ba1e33837d0b`, `767a0020-a8ac-4452-8ae3-bb654a4594c1`.
Renderer: `WeasyPrint 69.0`. Evidence: `evidence/pv/exports/exports-log.jsonl`.

**This is also a dev ticket in its own right**, independently of the test case.

---

## E. REFERENCES — checked on every case, zero changes needed

All **131** cases carry both a Jira ticket **and** a spec anchor, in the Rule-20
`<TICKET> (<spec anchor>)` shape. Every anchor cited still exists in the current spec bodies
(PV v4, TU v5) and governs the assertion its case makes — checked one by one, not sampled. The
single documented exception is **PV-PREC-02 = [C38925](https://shopview.testrail.io/index.php?/cases/view/38925)**,
whose refs state in as many words that no report spec covers QuickBooks and cite the tech plan
instead; that is a recorded exception, not an unsourced case.

## F. SECTIONS — zero moves needed

Six cases carry API content (**PV-API-01..04**, **PV-PREC-02**, **TU-API-01/02**) and all six are
already in `PV — API` / `TU — API`. No UI-only case in either report contains an endpoint, verb or
status code in a tester-facing field.

## G. RETIREMENTS / MERGES — none

Nothing in either report became obsolete, duplicated or untestable against this build.

---

## TWO FINDINGS THAT ARE NOT TEST-CASE CHANGES

1. **`POST /api/labour-types/change` accepts `is_default: false`, returns 201, and does not
   persist it.** Found while trying to produce a location with no default labor rate. Re-reading
   the record shows `is_default` still `true`. `POST /api/labour-types/set-default` also refuses
   `null`/empty/bogus ids, so **a location's default labor rate cannot be cleared at all**. Worth a
   dev ticket on the settings API; it is also exactly what blocks the four EXTERNAL-DEPENDENCY rows.
2. **`POST /api/workplaces/delete` returns HTTP 500 for every id tried** (including a syntactically
   valid non-existent one). Because of that, a rate-less third location was **deliberately not
   created** on this shared organisation — creating one would have been irreversible. Worth a dev
   ticket.

## ONE THING THE OUTSIDE-IN LENS ASKED THAT NEEDS NO ACTION

**Parts Velocity returns no `totals` object in its payload** — confirmed live
(`data` holds only `collection` and `pagination`). The PV spec requires no totals row and no
Parts Velocity case asserts one, so there is **no coverage gap here**: our suite is right not to
assert it, and an automation engineer who assumed parity with the other five reports would be
asserting something the product does not promise. Recorded so the question is not re-opened.

## OUTSTANDING — what I need from you

1. **Authorisation to push A (131 notes markers) and B (6 label corrections).** Nothing has been
   written.
2. **Authorisation to author D** (the new PDF-failure case) — or a ruling that it should be a dev
   ticket only.
3. **A ruling on the two product questions** in section C, which are Chris Ward's to answer, not
   ours: the **TU four-item download menu** (#14) and the **shared date-picker preset list** (#13).
   Both are shipped strings; our cases follow the spec and currently fail the build.
4. **Chris Ward's spec edits are still owed** for the single-location Location-filter ruling
   (#2 in section C) — this is the third pass in which that edit has been outstanding.
5. **An administrator or dev to give us a location with no default labor rate** (or a way to clear
   one), which is the single thing blocking the four EXTERNAL-DEPENDENCY rows.
6. **A QuickBooks-connected company on the QA branch**, which is the single thing blocking
   PV-PREC-02.
7. **Tell us when the branch is declared final** so `RECHECK-ROWS.md` can be run and closed. Until
   then neither report can be called VIU-complete.
