# Report Suite — SURFACE MATRIX (Standing Rule 40)

**Why a matrix and not a case list.** Rule 40 exists because the 2026-07-31 Location defect got
through: a requirement was applied to the on-screen surface and never revisited on the export
surface, and the delta document listed only the cases it touched, so nothing showed the hole. This
document gives **every surface its own verdict**, per requirement, for the multi-surface
requirements in this suite — now with a **live build** behind each cell rather than a spec reading.

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

Specs: **SBC v13** (2026-07-31, refreshed capture) · **SBR v15** · **PV v4** · **TU v5** ·
**WIP v6** · **IV v3** (all 2026-07-29, confirmed current 2026-08-03).
Epic **SV-8582** — **PARTIAL**, not re-read this run. Designs — **N/A**, spec-only project.
Tech plan — **PARTIAL**, held from 2026-07-29, not re-fetched.
**Live build — `sv8582.qa.shopview.com`, `v3.4.1-0ed4433`, observed 2026-08-03 — PARTIAL, DECLARED
NOT FINAL.** Every cell is provisional and queued in `RECHECK-QUEUE.md` (**OPEN**).

## SURFACES IN SCOPE FOR THIS SUITE

on-screen grid · **CSV export** · **PDF export** · **column selector** · **filter surface** ·
**data API** · **export API** · sort surface · empty/zero state · print · mobile · email/scheduled.
**Print — N/A**, retired from SBC by ruling and **no Print control exists anywhere on the build**
(observed). **Email/scheduled delivery — N/A**, no such feature in any of the six specs.
**Mobile — NOT REACHED this run** (stated, not silently omitted).

---

## MATRIX 1 — THE PER-ROW LOCATION COLUMN (the requirement that bit us)

Governing text, one anchor per report: SBC **S4-R12** · SBR **S21-R7** + **S14-R20** ·
PV **S6-R11** · TU **S9-R9** · WIP **S7-R13** · IV **S7-R6**.
Requirement, in substance and quoted from TU S9-R9 as representative: *"When the selected scope
spans more than one location, the report shows a per-row Location column; when the scope is a single
location, the column is hidden."*

**This requirement makes TWO assertions, so it gets TWO rows per report** (Rule 45(e)): the
**column** and, for the exports, the **`"Locations:"` metadata line**.

### 1a. The per-row Location COLUMN

| Report | On screen (2 locations) | On screen (1 location) | CSV export | PDF export | Column selector | Verdict |
|---|---|---|---|---|---|---|
| **SBC** | **PRESENT**, 3rd, after Date | absent | **PRESENT** — Summary 2nd, Expanded 5th (right after Date) | 200, generated (position not text-extracted) | not offered — automatic | **CONFORMS** |
| **SBR** | **PRESENT**, 5th, after Status | absent | **PRESENT** — Summary 2nd, Expanded 6th (right after Invoice Status) | 200, generated | not offered — automatic | **CONFORMS** |
| **PV** | **PRESENT**, 6th, after Vendor | absent | **PRESENT**, 6th — same slot as screen | **HTTP 500** at full scope (see Matrix 3) | not offered — automatic | **CONFORMS on screen + CSV; PDF unverifiable at scope** |
| **TU** | **PRESENT**, 2nd, after Technician | absent | **PRESENT but 1st — BEFORE Technician** | 200, generated | not offered — automatic | **DEVIATION on position** |
| **WIP** | **ABSENT by default** — a toggle in Column Selection, off by default | absent | **PRESENT when the column is on**, headed **`Branch`**, in the screen's slot | 200 when columns are supplied | **OFFERED as a toggle** (unique among the six) | **DEVIATION from the "automatic" model — and it REFUTES our own WIP-COL-02** |
| **IV** | **PRESENT**, 5th, after Vendor | absent | **PRESENT**, 5th — same slot as screen | **HTTP 500** at full scope | **OFFERED as a toggle** *and* appears automatically | **CONFORMS on screen + CSV; selector offers it too, which our cases do not mention** |

**The single-location half is confirmed on every report and every surface:** with one location in
scope the column is absent from the screen and from every CSV, and the metadata line names that one
location. Evidence: `evidence/location-matrix/*.csv` (14 files, SINGLE vs MULTI vs no-parameter) and
`evidence/location-matrix/location-matrix.json`.

**TU's position deviation, quoted side by side:**
- TU **S9-R9** (and the S14-R20-equivalent "same position it occupies on screen" pattern):
  the column belongs where it sits on screen.
- On screen: `Technician · Location · Total Hours · …`
- In the CSV: `Location · Technician · Total Hours · …`

I read this as **unbuilt-yet / an implementation slip**, not a product decision: no source asks for
Location to lead. It is the kind of thing a tester would fail a build for, so it needs a decision
before the suite is run.

### 1b. The `"Locations:"` metadata LINE

| Report | CSV | PDF | Wording observed | Verdict |
|---|---|---|---|---|
| SBC | **line 1** | generated | `"Locations: Staging Heavy Duty - 9919"` / `"Locations: All locations"` | **CONFORMS** |
| SBR | **line 1** | generated | same pattern | **CONFORMS** |
| PV | **line 1** | 500 at scope | same pattern | **CONFORMS (CSV)** |
| TU | **line 1** | generated | same pattern | **CONFORMS** |
| WIP | **line 1** | generated | same pattern | **CONFORMS** |
| IV | **line 2**, under `"As of: 2026-08-03"` | 500 at scope | same pattern | **CONFORMS**, with the as-of line above it |

**Two things our cases leave open and this now answers:** the line's **exact position is the first
line** (second for IV, under the as-of line), and with everything in scope it prints the words
**`All locations`** rather than listing the location names. Several cases say the line *"nam[es] the
location(s)"* — strictly, at all-locations scope it does not name them. That is a wording edit, not
a build defect.

---

## MATRIX 2 — THE ONE-PERMISSION MODEL (a requirement across four surfaces)

Chris Ward **Q2 = A** (*"Collapse all report access into a single Reports permission"*) and the QA
lead 2026-08-03, verbatim: *"Yes all the reports will be gated by ONE permission FOR NOW."*
SBC **v13 S1-R2** now carries it; **PV, TU, WIP and IV specs still describe per-area permissions.**

| Surface | What was observed | Verdict |
|---|---|---|
| **Permission catalogue** | `GET /api/fe-permissions` contains **exactly one** report atom: `reportsPageAccess`. No per-report atom exists — no Sales-By-Customer View, no Inventory-Reports View, no timesheet-reports or WIP-reports permission | **CONFORMS to the ruling** |
| **Role definitions** | all 11 roles read individually: 5 hold `reportsPageAccess` (Admin, Service Manager, Office User, Sales Representative, Parts Manager), 6 do not | observed |
| **Navigation** | with the atom, all six entries render in the reports side-nav | **CONFORMS** |
| **Data API — positive** | a user whose entire permission set is 8 atoms including `reportsPageAccess` and **no** report-area permission: **200 on all six** | **CONFORMS** |
| **Export API — positive** | same user: **200 on all six exports** | **CONFORMS** |
| **Data API — negative** | Foreman (23 atoms, no `reportsPageAccess`): **403 `"Access denied."` on all six** | **CONFORMS** |
| **Export API — negative** | Foreman: **403 on all six exports** | **CONFORMS** |
| **Column selector / filters** | not permission-gated on any report | observed, no requirement |

**Consequence.** The build follows the ruling, not the stale spec text. Our 16 one-permission cases
are **correct against the build**. **C30327** and **C30391** are verified, and more strongly than
they are written: the extra per-report permission does not merely fail to enforce anything — **it
does not exist**. This also covers the permission surface behind the staged **SBC-API-06**: if the
QA lead authorises that case it can land VIU-Verified rather than Pending, on this evidence.
Evidence: `evidence/permissions/permission-matrix.json`, `evidence/permissions/minimal-role-proof.json`.

---

## MATRIX 3 — EXPORT GENERATION AND THE ROW CAP

| Report | Export menu wording (verbatim) | CSV | PDF | Row-cap guard | Verdict |
|---|---|---|---|---|---|
| **SBC** | `Download Summary (PDF)` · `Download Expanded View (PDF)` · `Download Summary (CSV)` · `Download Expanded View (CSV)` | 200, both variants | 200, both variants | `400` + *"This report is too large to export. Narrow the date range or filters, then try again."* | **CONFORMS** |
| **SBR** | identical four | 200 both | 200 both | same guard | **CONFORMS** |
| **PV** | `Download (PDF)` · `Download (CSV)` | 200 | **500 at full scope**, 200 when narrowed | guard fires on CSV; **PDF 500s instead of using it** | **DEVIATION — my read: defect** |
| **TU** | `Summary (PDF)` · `Summary (CSV)` · `Expanded (PDF)` · `Expanded (CSV)` | 200 both | 200 both | not reached at this data volume | **DEVIATION on the menu wording + item count** |
| **WIP** | `Download (PDF)` · `Download (CSV)` | 200 (needs `tab` + `columns`) | 200 | not reached | **CONFORMS** |
| **IV** | `Download (PDF)` · `Download (CSV)` | 200 | **500 at full scope**, 200 when narrowed | guard fires on CSV; **PDF 500s** | **DEVIATION — my read: defect** |

**Export API contract discovered (durable, for the playbook):**
`GET /api/reporting/reports/<slug>/export?format=csv|pdf&<the same filters as the data call>`
plus, where applicable, `&variant=summary|expanded` (SBC, SBR, TU),
`&tab=ApprovedNotStarted|ApprovedPartiallyCompleted|Completed|Estimates` (WIP, **required**), and
`&columns=<comma-separated keys>` (**required for WIP**, optional elsewhere — omitting it exports
every column).

**Empty export:** when the current view has no rows the front end shows a warning toast
**`Empty export` / `Export didn't yield any results`** with a `Close` action and starts **no**
download. This **refutes** the no-match-export cases, which say the file still downloads with
headers and a zero totals row — e.g. **SBC-EXP-15 = [C30173](https://shopview.testrail.io/index.php?/cases/view/30173)**.

---

## MATRIX 4 — THE ASSET IDENTIFIER (Chris's VIN → Unit # → plate ruling vs the WIP spec)

Chris Ward, 2026-07-29, on the WIP question: *"A is the correct answer"* — the VIN chain, and
verbatim *"Not just for these specs though -- really good to keep this in mind for all actions
moving forward"*. The **WIP spec v6 was never updated**: **S4-R7** still reads *"the unit number on
the first line in bold, and the vehicle identification number on the second line in a smaller,
muted style"*, and **S4-R9** *"The Asset column sorts by unit number."*

| Surface | Observed on the build | Verdict |
|---|---|---|
| WIP data payload | every row carries **both** `unit_number` and `vin` (e.g. `unit_number: "70"`, `vin: "1XKDD40X8CJ955352"`) | observed |
| WIP **CSV export** — `Unit` column | carries the **unit number** (`70`, `10154522`), blank when the asset has none; the **VIN sits in its own separate `VIN` column** | **the build follows the STALE SPEC, not Chris's ruling** |
| WIP **column selector** | offers `Asset` **and** a separate `VIN` toggle, off by default | matches our cases |
| WIP **on-screen Asset cell** | **NOT READ** — the grid is virtualised, so the cell text could not be extracted this run. **Stated, not guessed** | **NOT VERIFIED — remaining work** |
| WIP **sort** | not driven this run | **NOT VERIFIED** |

**Verdict on the four affected cases** — WIP-COL-05 = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470),
WIP-FLT-03 = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500),
WIP-SORT-03 = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485),
WIP-EXP-07 = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516):
**keep them as written** (Rule 32 — they follow the newer authoritative ruling). The export evidence
says the build has **not** implemented the VIN chain, which makes this a genuine
**build-behind-the-ruling** item and Chris's third reminder that the spec edit is still owed.
**WIP-EXP-07 is the exception and is fully MATCHED** — it predicted `Unit`/`Branch` in the exports
and predicted that the export header might not change, and both held.

---

## MATRIX 5 — THE MONEY AND HOURS CONTRACTS (verified against live data)

| Requirement | Surface | How it was checked | Verdict |
|---|---|---|---|
| WIP: `Earned = Labor Earned + Parts Earned` | data API | recomputed over **all 178 rows** | **PASS, 0 mismatches** |
| WIP: `Remaining = Labor Remaining + Parts Remaining` | data API | all 178 rows | **PASS** |
| WIP: `Total = Earned + Remaining` | data API | all 178 rows | **PASS** |
| WIP: a job with nothing approved still appears at zero | data API | **77** Estimates rows carry total 0 and are all listed | **PASS** |
| WIP: each job in exactly one tab | data API | 178 unique work-order ids across 178 rows; tabs 25 / 65 / 77 / 11 | **PASS** |
| WIP: money to the cent | data API + CSV | integers in cents (`14500` → `$145.00`); CSV renders `$1,286.26` | **PASS** |
| WIP: Totals row | screen + CSV | screen `Totals … $223,570.02 · $101,505.64 · $325,075.66`; CSV last line `Totals,…` | **PASS** |
| IV: `Total Cost = Qty × Unit Cost`, `Total Sell = Qty × Unit Sell`, `Margin = Total Sell − Total Cost`, `Margin % = Margin ÷ Total Sell` | data API | `786.55 × $14.21 = $11,176.88` ✓ · `786.55 × $21.86 = $17,193.98` ✓ · `$17,193.98 − $11,176.88 = $6,017.10` ✓ · `35.0%` ✓ | **PASS** |
| SBC / SBR / IV: server-computed totals over the full filtered set | data API | a `totals` object is returned alongside the page of rows; SBC `margin ÷ subtotal = 96.7%` matches the reported `margin_pct` | **PASS** |
| PV: server-computed totals | data API | **PV returns NO `totals` key** — only `collection` + `pagination`, unlike the other three | **FINDING — any PV totals-row expectation is unsupported by the payload** |
| PV: `Margin % = Margin ÷ Revenue` | data API | `$1,634.06 ÷ $4,332.11 = 37.72%` matches the reported `margin_pct` | **PASS** |
| PV: `Revenue` is not `Units Sold × Sell Price` | data API | `512 × $7.69 = $3,937.28` but `Revenue = $4,332.11` | **observed, and consistent with Revenue being actual invoiced value rather than a recomputation — worth confirming against the spec wording before any case asserts a formula** |

Evidence: `evidence/calc-checks.json`.

---

## MATRIX 6 — SURFACES DELIBERATELY MARKED N/A OR NOT REACHED

| Surface | Status | Why (stated, never silently skipped) |
|---|---|---|
| **Print** | **N/A** | Retired from SBC by ruling; **no Print control exists anywhere on the build** (observed across all six overflow menus). Note for Chris: Jira **SV-8614 "SBC - Story 16 - Print the report"** is still Open, and SBC **S18-R7/S18-R10** still list Print as an export — the build agrees with the retirement, the documents do not |
| **Email / scheduled delivery** | **N/A** | no such requirement in any of the six specs |
| **Mobile / responsive** | **NOT REACHED** | the MOB cases (SBC 2, SBR 3) need a narrow viewport pass; not run this session |
| **PDF file CONTENTS** | **NOT REACHED** | no PDF text-extraction tool is installed in this container (`pdftotext`, `pypdf`, `PyPDF2` all absent). PDF **generation** was verified by status and byte size; the **column order and header text inside the PDFs are unverified**. This is the one honest gap in the Location matrix |
| **Tree / drill-down expansion** | **PARTIALLY REACHED** | the expander control is present on SBC/SBR/TU/WIP; the expanded child rows were not read because the grid is virtualised |

---

## HOW THIS MATRIX WAS DERIVED (Rule 43)

Re-derived from scratch this run — the requirement list came from the current spec captures and the
per-report case source, and each cell was filled by a live observation, not by copying the
2026-07-31 matrix forward. Both directions were walked: requirement → surface → case, and case →
surface → requirement (which is how the PV-no-`totals` and WIP-Inv.-Hrs findings surfaced, neither
of which any requirement row would have led me to).
