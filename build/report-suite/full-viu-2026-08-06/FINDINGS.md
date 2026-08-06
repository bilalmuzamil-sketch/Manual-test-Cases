# FINDINGS — Report Suite live-observation pass, 2026-08-06

> **⚠️ CORRECTION 2026-08-06 (second session).** This file states below that **none of the six
> specifications mentions the ~10,000-row export cap. That is WRONG, and it is wrong in our own
> favour.** Checked independently against the live spec bodies: **Sales By Customer v15 documents it
> twice (S14-R16 for CSV, S15-R25 for PDF)**, **Sales By Representative v17 documents it (S14-E2)**
> and **Inventory Value v4 documents it including the exact user-facing message (S10-R12)**. Only
> **Parts Velocity v5, Technician Utilization v6 and Work In Progress v9** are silent. So for three
> of the six reports a case may assert the cap on the strength of the SPECIFICATION and does not
> have to fall back on epic story SV-8591; for the other three the story remains the only source.
> The wrong claim is left in place below rather than overwritten, because a claim we made and then
> fixed is part of the record. Full table: `SPEC-DIFF.md` §8. The narrowed question to Chris Ward is
> Q6 in `QUESTIONS-FOR-CHRIS.md`.


## Build in force, read three times

`v3.5-16cf83f` · last-mod **Wed, 05 Aug 2026 06:40:32 GMT** · etag `177c59546701e7810b894492dabc1423`
· `index.html` sha256 `67932a75b5a3a11d987b065c526d2d6dd38d0f47f76adeef61a6d341b249fa78`.
Read at **03:43:35Z** (batch 1), **04:56:57Z** (this session's start) and again at the end.
**Byte-identical every time — no redeploy under any batch.**

## Sources, re-fetched live this session

| Source | Live value | Verdict |
|---|---|---|
| SBC spec (page 577634305) | Confluence **v15**, 2026-08-05T17:53:06Z | CURRENT |
| SBR spec (585629698) | Confluence **v17**, 2026-08-05T17:53:08Z | CURRENT |
| Parts Velocity spec (620888066) | Confluence **v5**, 2026-08-05T13:21:40Z | CURRENT |
| Technician Utilization spec (641400833) | Confluence **v6**, 2026-08-05T13:33:10Z | CURRENT |
| WIP spec (703660034) | Confluence **v9**, 2026-08-05T17:54:07Z | CURRENT |
| Inventory Value spec (720142338) | Confluence **v4**, 2026-08-05T13:33:13Z | CURRENT |
| Epic SV-8582 | **105 children**, verified two ways (`parent=` and `"Epic Link"=`), key sets equal, no paging remainder | CURRENT |

**None of the six specs moved** since the previous pass. Chris Ward published nine versions in one
day on 5 August; nothing has moved since.

## THE HONEST HEADLINE

**120 of the 476 cases carry a verdict established against `v3.5-16cf83f`. 356 do not** — their
markers and verdicts are inherited from earlier passes and say so on themselves. **The arithmetic
gate is NOT claimed to pass and must not be.**

| | Count |
|---|---|
| Our cases | **476** (481 live under group 4281, incl. 5 foreign) |
| Adjudicated by the 5 Aug pass | 32 |
| Batches 1–3 this pass (Inventory Value, Parts Velocity part 1) | 62 |
| **Batch 4 this pass (Parts Velocity part 2)** | **26** |
| **Total with a verdict on this build** | **120** |
| **Remaining** | **356** |

## Batch 4 — Parts Velocity, 26 cases, all driven live

**20 PASS · 6 DEVIATION.** Every one was driven through the report itself or through the product's
own request, captured from the product's own controls. Nothing was inferred and no case was counted
because a broad artefact happened to touch it.

### The six deviations, each with a ticket filed this session

| Case | What the document requires | What the build does | Ticket |
|---|---|---|---|
| [C30337](https://shopview.testrail.io/index.php?/cases/view/30337) | S2-R9 — opens on the user's currently active location | Opens on **All locations**; both locations returned on a genuine first visit | [SV-8939](https://shopview.atlassian.net/browse/SV-8939) |
| [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | item 3 / S7-R8 — Location column leftmost, before Type | Sits **sixth**, after Vendor (the 14 defaults and their order are correct) | [SV-8938](https://shopview.atlassian.net/browse/SV-8938) |
| [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) | S7-R8 — leftmost, before Type, on screen and in both downloads | **Sixth** in all three places (values themselves are correct, incl. "Multiple") | [SV-8938](https://shopview.atlassian.net/browse/SV-8938) |
| [C30379](https://shopview.testrail.io/index.php?/cases/view/30379) | S6-R6 — PDF truncates Description/Category/Vendor to 18 chars | **Nothing is truncated**; a 117-char description printed in full | [SV-8934](https://shopview.atlassian.net/browse/SV-8934) |
| [C30380](https://shopview.testrail.io/index.php?/cases/view/30380) | S6-R8 — CSV renders Last Sale as the raw integer | CSV prints **`"54 days"`** | [SV-8935](https://shopview.atlassian.net/browse/SV-8935) |
| [C30384](https://shopview.testrail.io/index.php?/cases/view/30384) | S6-R9 — "Velocity report exported (CSV)" / "(PDF)" | **"Success / Data exported successfully."** for both | [SV-8936](https://shopview.atlassian.net/browse/SV-8936) |

All six now carry the **Rule-61 three-outcome block**, each symptom one observed this session.

### Two things that looked like defects and were NOT — the mechanism was established first

**(a) The export refusal at ~10,000 rows is DELIBERATE and is in the epic.** The default first-visit
view (This Year, all locations, **10,064 rows**) returns HTTP 400 from both export formats with
*"This report is too large to export. Narrow the date range or filters, then try again."* That reads
like a defect until you find **[SV-8591](https://shopview.atlassian.net/browse/SV-8591) "[Reports
Suite][A3] Export contract + **10k row-cap guard** (CSV attachment + PDF scaffold)"** — an
engineering story on this very epic. Under Rule 57 an epic story is a source of expected behaviour,
so the cap is **expected**. **None of the six specifications mentions it** — that is a documentation
gap for Chris, recorded as a question, not a defect.

**(b) The header-click sort is CORRECT — the first read said otherwise.** A snapshot taken four
seconds after the click still showed the previous order and the previous request URL, which reads
exactly like "the second click does not reverse the direction". Driving four clicks in sequence and
reading the header's own sort class alongside the rows showed the real cycle: first click
**ascending**, second **descending**, third **ascending**. The first reading was a stale read, the
same trap that nearly produced a false defect on the previous pass.

### One finding with no case of its own

The Parts Velocity **PDF heading** prints the range end date **one day late** and is labelled
*"Start Date Range:"* rather than *"Date Range:"*. Proven on three separate ranges — 31 Jul → Aug 1,
28 Feb → Mar 1, 6 Aug → Aug 7 — while the spreadsheet for the same view printed the correct end date.
**We could NOT show that the report's figures are affected**: the one part available at the boundary
had no sales near those dates, so nothing was proven either way about the numbers, and the ticket
says so. Filed as [SV-8937](https://shopview.atlassian.net/browse/SV-8937).

## Proofs

- **26 `update_case`**, every one HTTP 200, **re-GET and byte-compared, 30 fields each, 0 mismatches,
  0 collateral**. All three text fields sent on every write.
- **0 add · 0 delete · 0 section · 0 run writes · 0 results logged.**
- **All 455 untouched cases proven byte-identical BY CONTENT** — every field including `updated_on`
  and `updated_by`, 0 differences.
- **Foreign C38919–C38923 proven byte-identical BY CONTENT.** Never touched.
- **Run 359 proven untouched**: `include_all` still false, 476 tests, case_id sets equal **both
  directions**, **all 535 prior results present BY ID**, **0 fields moved on any of the 535** — not
  even the declared `case_title` / `case_refs` echoes — and **0 new results** during our window.
- **Census over all 26 touched cases: exactly one provenance line, one "Last checked against build"
  line and one `AUTOMATION:` marker each; the marker is last; no barred phrase; no raw markup.**
  Run because the byte-check cannot catch a malformed payload — the C30341 lesson.

## Still owed on Parts Velocity — 31 of its 71 cases

Permissions (C30325/26/27/40, C30391 — a second sign-in, see below), the metric calculations
(C30359–C30374), visual conformance (C30385–87), row-model detail (C30347/49), the remembered-view
edge cases (C30355/56), the custom-range 366-day cap (C30331), the category/vendor filters and AND
logic as UI journeys (C30332/34/39), loading indicator (C30324), PDF alignment (C30382), and
C38924/C38925 (part-of-a-unit quantities).

## What cannot be driven at all, and why

**Permission cases across every report need a SECOND SIGN-IN.** There is exactly one session on this
estate and it is **shared with a sibling worker on the Schedule project**. `POST /api/quick-login`
rotates `sv_sso_session` and would sign them out mid-run, and `POST /api/switch-user` would take the
shared session with it. These are recorded **NOT OBSERVED** with that reason — not seeded around.

## Batch 6 — THE WORK IN PROGRESS EXPORT, reproduced at last

The previous pass could not reproduce this and said so honestly: every datetime form it tried was
rejected as its own input error. **The reason is now clear — Work In Progress does not take the same
date parameters as the other five reports.** They use `range=custom&start_date=&end_date=`; Work In
Progress uses **`from=` and `to=` with full ISO instants**:

```
GET /api/reporting/reports/work-in-progress/export
    ?format=csv|pdf &tab=<Tab> &from=2026-08-02T00:00:00.000Z &to=2026-08-06T23:59:59.999Z
    &locations=<ids> &columns=<list> &sortBy=days_open &descending=true
```

That shape was **taken from the product's own download menu**, not guessed — a request listener was
attached and the menu clicked, exactly as the brief directed.

### The symptom, and the mechanism

| Tab | Rows | CSV | PDF |
|---|---|---|---|
| Approved - Partially Completed | 4 | **HTTP 500** | **HTTP 500** |
| Approved - Not Started | 4 | **HTTP 500** | **HTTP 500** |
| Completed | 2 | **HTTP 500** | **HTTP 500** |
| Estimates | 65 | **HTTP 500** | **HTTP 500** |
| any tab, empty window (0 rows) | 0 | **HTTP 200**, real file | **HTTP 200**, real file |

The error text, from the screen and from the response alike, is *"An error occurred. We're sorry for
this inconvenience, please try again a bit later later."* — the doubled *"later later"* is in the
product. **It is not a size problem**: two rows fail just as four and sixty-five do, so it is not the
10,000-row guard. **It is presence of rows, exactly as [SV-8907](https://shopview.atlassian.net/browse/SV-8907)
describes.** No new ticket was filed — SV-8907 already covers it.

**Five cases now carry the Rule-61 block naming SV-8907** — C30510, C30512, C30513, C30514, C30518 —
replacing the older one-line "Known issue" form.

### Three cases were settled on the ONE path that works

The empty-tab export produces a real file, and that file answers three cases outright:

- **[C30515](https://shopview.testrail.io/index.php?/cases/view/30515) PASS** — `content-disposition`
  returns `filename=wip-2-report.csv` and `filename=wip-2-report.pdf`, exactly, including the `-2-`.
- **[C30516](https://shopview.testrail.io/index.php?/cases/view/30516) PASS** — both files head those
  columns **Unit** and **Branch** while the screen reads Asset and Location: the documented v1
  difference the case asserts, confirmed in the CSV *and* the PDF.
- **[C30517](https://shopview.testrail.io/index.php?/cases/view/30517) PASS** — the PDF carries
  exactly one embedded image (the shop logo); the CSV is plain text with none.

### Two cases deliberately still carry no block

**[C30500](https://shopview.testrail.io/index.php?/cases/view/30500)** points at SV-8908, the **Asset
filter** rather than the export; its symptom was not driven, and an unobserved symptom must never be
written. **[C38918](https://shopview.testrail.io/index.php?/cases/view/38918)** asserts the over-cap
refusal, which **cannot be produced here** — the biggest tab holds 65 work orders against a cap near
10,000, and the case says so itself. **That one is worth a decision: arguably it should be
`AUTOMATION: HOLD`, not expect-fail.**

### One thing checked and cleared

The Parts Velocity PDF prints its date-range heading one day late (SV-8937). **Work In Progress does
not** — asked for 1–2 January 2020 it printed *"Jan 1, 2020 - Jan 2, 2020"*. So SV-8937 is specific to
Parts Velocity, which is what that ticket says.

---

## Batch 7 — TECHNICIAN UTILIZATION, all 57 remaining cases driven live

Build read again at **06:51:12Z**: `v3.5-16cf83f`, last-mod Wed, 05 Aug 2026 06:40:32 GMT, etag
`177c59546701e7810b894492dabc1423`, `index.html` sha256 `67932a75…` — **byte-identical to the start
of the session. No redeploy under this batch.** All six specs re-fetched live at the start of the
batch: SBC **15** · SBR **17** · PV **5** · TU **6** · WIP **9** · IV **4** — **none moved.**

**Technician Utilization is now finished.** All 61 of its live cases carry a verdict or a written
not-observed reason: 57 were ours to drive, 3 were settled by the 5 August pass and 1 (C38919)
belongs to Vladimir Tomovic and was not touched.

| Verdict | Count |
|---|---|
| PASS | 26 |
| DEVIATION | 19 |
| PARTIAL | 5 |
| NOT OBSERVED, with a reason | 7 |

### The nineteen deviations, and the twelve tickets filed for them

| Case | What the document requires | What the build does | Ticket |
|---|---|---|---|
| [C30394](https://shopview.testrail.io/index.php?/cases/view/30394) | S1-R3 / S9-R2 — opens on the user's active location | Opens on **All locations**; both locations returned on a genuine first visit. The date half is correct | [SV-8943](https://shopview.atlassian.net/browse/SV-8943) |
| [C30430](https://shopview.testrail.io/index.php?/cases/view/30430) | S1-R9 — Total Hours equals Timesheet Activities to the cent | Andrew Wade **1080.44 vs 1080.64**; six of eight technicians differ by up to 0.25 h | [SV-8944](https://shopview.atlassian.net/browse/SV-8944) |
| [C30410](https://shopview.testrail.io/index.php?/cases/view/30410) · [C30450](https://shopview.testrail.io/index.php?/cases/view/30450) | S2-R13 — "Sorting is applied on screen to the loaded rows (no reload)" | Every header click sends `pagination[sortBy]` to the server | [SV-8945](https://shopview.atlassian.net/browse/SV-8945) |
| [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) | S9-R3 — the technician filter is "on-screen only" | Ticking a technician sends `exclude_technicians=` to the server | [SV-8946](https://shopview.atlassian.net/browse/SV-8946) |
| [C30423](https://shopview.testrail.io/index.php?/cases/view/30423) · [C30425](https://shopview.testrail.io/index.php?/cases/view/30425) | S5-R1 "Filter by Technician" · S5-R6 "Select all" | Reads **"Technician"** and **"All technicians"** | [SV-8947](https://shopview.atlassian.net/browse/SV-8947) |
| [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) · [C30440](https://shopview.testrail.io/index.php?/cases/view/30440) | S7-R8 / S7-N1 — downloads honour the technician filter; none selected = silent no-op | The export request carries **no technician parameter at all**; a deselected technician is still in the file, and a download with none selected still arrives with a success message | [SV-8948](https://shopview.atlassian.net/browse/SV-8948) |
| [C30438](https://shopview.testrail.io/index.php?/cases/view/30438) | S7-R10a — every download ordered Technician A→Z | Both the spreadsheet and the PDF come out in no recognisable order | [SV-8949](https://shopview.atlassian.net/browse/SV-8949) |
| [C30435](https://shopview.testrail.io/index.php?/cases/view/30435) | S7-R5 / S7-R6 / S7-R12 — Summary row in both PDFs; Title-Case names | **No Summary row in any of the four files**; names are lower-case | [SV-8950](https://shopview.atlassian.net/browse/SV-8950) |
| [C30436](https://shopview.testrail.io/index.php?/cases/view/30436) · [C43552](https://shopview.testrail.io/index.php?/cases/view/43552) | S7-R7 — the spreadsheet is always summary-level, named `technician-utilization.csv` | Two spreadsheets; the **Expanded one holds a per-day row under every technician** | [SV-8951](https://shopview.atlassian.net/browse/SV-8951) |
| [C30441](https://shopview.testrail.io/index.php?/cases/view/30441) | "Download started" / "Failed to download report" | Success reads **"Success / Data exported successfully."**; a failure shows **nothing at all** | [SV-8952](https://shopview.atlassian.net/browse/SV-8952) |
| [C30418](https://shopview.testrail.io/index.php?/cases/view/30418) · [C30421](https://shopview.testrail.io/index.php?/cases/view/30421) | S8-R12 — the expand controls expose their open/closed state | Names are exactly right in both states; **no `aria-expanded` on either control** | [SV-8953](https://shopview.atlassian.net/browse/SV-8953) |
| [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) | S9-R9 / S10-R4 — the Location column follows what the user can REACH and is toggleable | It vanishes when a single location is chosen, and **Location is never offered in the Column Selection control** | [SV-8954](https://shopview.atlassian.net/browse/SV-8954) |
| [C30434](https://shopview.testrail.io/index.php?/cases/view/30434) | S7-R2..R4a — "Download Summary (PDF)" etc. | "Summary (PDF)", "Summary (CSV)", "Expanded (PDF)", "Expanded (CSV)" | already **[SV-8881](https://shopview.atlassian.net/browse/SV-8881)** |

**All 19 carry the Rule-61 three-outcome block**, and every symptom in it is one observed this batch.

### Two Rule-57 repairs — cases that had been written to the build

**[C30423](https://shopview.testrail.io/index.php?/cases/view/30423)** asserted a filter *"labeled
'Technician'"* and **[C30425](https://shopview.testrail.io/index.php?/cases/view/30425)** asserted a
control *"'All technicians'"*. Those are the build's words. **The specification names both plainly** —
S5-R1 *"a filter labeled 'Filter by Technician'"* and S5-R6 *"a control labeled 'Select all'"* — so
both were restored to the documented wording and became expect-fail. Nothing else in either case
changed.

### Four candidates DISPROVEN before anything was filed

**(a) The Total Hours link is NOT colour-only.** It looked like a plain S6-R1 failure: no underline
at rest and none on hover. Reading it against a neighbouring plain cell showed **font-weight 600
against 400**, plus a pointer cursor, and on keyboard focus an underline *and* a 2px focus outline.
S6-R1 asks for *"an underline (or equivalent non-color affordance)"* — weight qualifies. **PASS.**

**(b) The Timesheet Activities drill-through is NOT broken.** The first read showed the staff filter
displaying a raw identifier and *"There are no results for selected date range"*. That was a **stale
read** — the page had not finished resolving the staff list after 8 s. Given longer it settles to
*"Andrew Wade"* with a full Totals line. The same trap as the two sort false alarms.

**(c) The Expanded PDF failure is ALREADY REPORTED.** It returns HTTP 500 after ~32 s on any view
past roughly a thousand rows (874 rows succeeded in 23.6 s; 1,235 rows failed at 31.8 s) — a
timeout, not the 10,000-row guard, which answers HTTP 400 with its own message. **[SV-8818](https://shopview.atlassian.net/browse/SV-8818)
names this report explicitly.** No duplicate filed; only the *missing* failure message went into
SV-8952.

**(d) The Summary's 0.01 gap is the documented drift.** After deselecting one technician the Summary
read 14984.33 where the displayed rows eye-sum to 14984.34. C30415 allows exactly that, and the
figures reconcile to the raw seconds exactly.

### One finding with no case of its own — and it widens an existing ticket

The Technician Utilization PDF heading prints **"Start Date Range: Jan 1, 2026 - Aug 7, 2026"** for a
range that ends on **6 August** — the same one-day-late end date and the same *"Start Date Range:"*
label as **[SV-8937](https://shopview.atlassian.net/browse/SV-8937)**, which was filed saying it was
specific to Parts Velocity. **It is not.** Reported here rather than filed, and **SV-8937 was not
edited** — widening someone's ticket scope is the QA lead's call.

### Proofs for batch 7

- **57 `update_case`**, every one HTTP 200, re-GET and byte-compared, **30 fields each, 0 mismatches,
  0 collateral**. All three text fields sent on every write.
- **0 add · 0 delete · 0 section · 0 run writes · 0 results logged.**
- **All 419 untouched cases proven byte-identical BY CONTENT** — every field including `updated_on`
  and `updated_by`, 0 differences.
- **Foreign C38919–C38923 proven byte-identical BY CONTENT.** Never touched.
- **Run 359 proven untouched**: `include_all` still false, **476 tests**, test-id and case_id sets
  equal **both directions**, **all 535 prior results present BY ID**, **0 new**, and **0 fields moved
  on any of the 535 — not even the declared `case_title` / `case_refs` echoes**.
- **Census over all 61 live TU cases: exactly one provenance line, one "Last checked against build"
  line and one `AUTOMATION:` marker each; the marker is last; no raw markup; no stale build marker;
  no barred phrase.** The only case failing the census is **C38919, which is Vladimir Tomovic's** and
  is meant to have none. Run because the byte-check cannot catch a malformed payload — the C30341
  lesson.
- **C30392's raw `<ol>`/`<li>` markup converted to plain numbered text** in all three fields —
  formatting only, not one word of meaning changed. **12 raw-markup cases remain**, all in Work In
  Progress: C30451, C30456, C30457, C30460, C30487, C30490, C30491, C30493, C30519, C30522, C30526,
  C30528.

---

## Batch 8 — SALES BY CUSTOMER, the first 25 cases

Build read again at **07:05:57Z**: `v3.5-16cf83f`, sha256 `67932a75…` — **byte-identical. No redeploy.**

**25 of Sales By Customer's 83 remaining cases now carry a verdict: 21 PASS · 2 DEVIATION ·
2 PARTIAL.** The other 58 were **not** adjudicated, and deliberately so — the report was opened and
characterised but a characterisation is not a per-case observation, and no case was counted because a
broad artefact happened to touch it.

### The two deviations, both ticketed

| Case | What the document requires | What the build does | Ticket |
|---|---|---|---|
| [C30105](https://shopview.testrail.io/index.php?/cases/view/30105) | S2-R6 — the chosen date range is written to the page link so the report can be shared | **The address bar never changes.** Sampled ten times over fifteen seconds after applying Last Month, then after a Product Type change, then at the moment of clicking through to an invoice — bare `/reports/sales-by-customer` every time | [SV-8955](https://shopview.atlassian.net/browse/SV-8955) |
| [C30160](https://shopview.testrail.io/index.php?/cases/view/30160) | file names `sales-by-customer-summary-{range}.csv` | `sales-by-customer-summary.csv` and `sales-by-customer-expanded.csv` — **no period in either name** | [SV-8956](https://shopview.atlassian.net/browse/SV-8956) |

### What was verified by arithmetic, not by eye

**Aagate Landscaping**: Subtotal **34,948.98 = 18,640.80 + 14,350.89 + 1,957.29**, and Margin
**32,991.69 = 18,640.80 + 14,350.89** — so Shop Supplies adds to Subtotal and **nothing** to Margin,
exactly as the requirement says. Margin % = 32,991.69 / 34,948.98 = **94.4%**. Invoice **S-12528**
checks the same way: 1,097.90 = 479.85 + 567.67 + 50.38, Margin 1,047.52, Margin % **95.4%**.

### Two cases left PARTIAL for want of data, not for want of trying

**[C30150](https://shopview.testrail.io/index.php?/cases/view/30150)** — the em dash when Subtotal is
zero or below: **no row in this data has a Subtotal at or below zero.**
**[C30151](https://shopview.testrail.io/index.php?/cases/view/30151)** — the green `+` and red `-`
Inv. Hrs values: **every row in this data reads `0.0`**, because no invoice has hours invoiced
differing from hours worked. The heading is verbatim `Inv. Hrs` and the zero case is correct.

### One defect in OUR OWN case, reported not fixed

**[C30102](https://shopview.testrail.io/index.php?/cases/view/30102)** is still **titled** *"Date
range picker offers **eleven** options in the specified order"*. The specification says **nine** and
the build shows **nine**; the body does not enumerate them at all and passes. **The title is stale**
and a title change was not in this batch's scope — it is listed as owed.

### The one-day-late PDF end date reproduces on Sales By Customer too — with a twist

The SBC Summary PDF heads *"Date Range: Aug 1, 2026 – Aug 7, 2026"* for a range ending **6 August**.
Same off-by-one as **[SV-8937](https://shopview.atlassian.net/browse/SV-8937)** — but here the label
reads *"Date Range:"* correctly, where Parts Velocity and Technician Utilization both print *"Start
Date Range:"*. So the ticket's Parts-Velocity-only framing is wrong on **two** reports now.
**Reported, not edited.**

### Proofs for batch 8

- **25 `update_case`**, every one HTTP 200, re-GET and byte-compared, **30 fields each, 0 mismatches,
  0 collateral**. All three text fields sent on every write.
- **0 add · 0 delete · 0 section · 0 run writes · 0 results logged.**
- Cumulative over batches 7–8: **82 cases touched**, and **all 399 untouched cases proven
  byte-identical BY CONTENT**, foreign C38919–C38923 included.
- **Run 359 proven untouched again**: `include_all` false, **476 tests**, test-id and case_id sets
  equal both directions, **all 535 results present BY ID, 0 new, 0 non-echo fields changed**.
- **Census over all 82 touched cases: exactly one provenance line, one build line and one
  `AUTOMATION:` marker each; the marker last; no raw markup; no stale build; no barred phrase; and
  all 20 expect-fail cases among them carry the Rule-61 block.**

---

## The QA lead's three decisions, carried out 2026-08-06

Build re-read before and after: `v3.5-16cf83f`, sha256 `67932a75…` — unchanged.

### 1. C38918 is now `AUTOMATION: HOLD`

**[C38918](https://shopview.testrail.io/index.php?/cases/view/38918)** asserted the over-size export
refusal, and that condition **cannot be produced on this estate** — no Work In Progress tab comes
anywhere near the limit. Expect-fail would have claimed a failure nobody has observed. Its marker is
now:

`AUTOMATION: HOLD - the over-size refusal cannot be produced on this environment; no tab comes near the size limit`

The case also gained a plain explanation of **why** it cannot be run, which keeps the fact that the
Work In Progress download currently fails on any tab with rows (**SV-8907**) — a separate problem
that blocks the road to this one. **This lowers the ready-to-automate figure by one**, which is the
honest direction. Live census now: **426 `READY` · 38 `HOLD` · 12 with no plain-text marker** (the
raw-markup cases) **= 476**.

### 2. SV-8937 WIDENED, not duplicated — and it now carries the source block

**[SV-8937](https://shopview.atlassian.net/browse/SV-8937)** was written as a Parts Velocity defect.
It now covers **three reports**, and its summary says so: *"PDF heading shows an end date one day
later than the range asked for, on three reports"*. The body carries the evidence from all three —
Parts Velocity over three separate ranges, Technician Utilization on This Year, Sales By Customer on
This Month — and records honestly that **Sales By Customer prints the label "Date Range:" correctly**
and only has the wrong date, so the mislabel is narrower than the date fault. **Work In Progress was
checked and is clean**, which is in the ruled-out section.

**Parent, type, priority and status untouched**: Story Defect (10007), parent SV-8646, priority Low,
Open. **Two `relates to` links added** — SV-8654 (the Technician Utilization export story) and
SV-8613 (the Sales By Customer PDF story) — so the two newly-named reports' owners can see it.
**16 field checks read back from Jira, all PASS.**

### 3. C30102's title fixed

**[C30102](https://shopview.testrail.io/index.php?/cases/view/30102)** read *"Date range picker
offers **eleven** options in the specified order"* while the specification says nine and the build
shows nine. Now: *"Date range picker offers nine periods in the specified order, no All Time"* —
73 characters, comfortably inside the 80 limit. **The body was not touched**; it never enumerated and
it passes.

### Proofs for this pass

- **3 `update_case`** (C38918, C30102, and C30102's title in the same op), every one HTTP 200,
  re-GET and byte-compared, **30 fields each, 0 mismatches, 0 collateral**. All three text fields
  sent every time; the title op sent four intended fields.
- **1 Jira `PUT`** (HTTP 204) and **2 `issueLink` POSTs** (HTTP 201) on SV-8937, all read back.
- Cumulative: **83 cases touched**, and the **398 untouched proven byte-identical BY CONTENT**,
  foreign C38919–C38923 included.
- **Run 359**: `include_all` false, 476 tests, sets equal both directions, **all 535 results present
  BY ID, 0 new, 0 non-echo fields changed**. **2 results moved in `case_title` only** — both on
  C30102, the one case we were told to retitle. That is the **declared read-time echo**, and it is
  the expected consequence of a title change, not a write to the run.

---

# SESSION 4 — 2026-08-06, Work In Progress driven live on `v3.5-f77875c`

## The build, and the honest bound on this session

| Read at (UTC) | app-version | index.html last-modified | etag | sha256 of index.html |
|---|---|---|---|---|
| 10:55:54Z | `v3.5-f77875c` | Thu, 06 Aug 2026 10:43:37 GMT | `829ed038…` | `b0f05b6f…` |
| 11:53:07Z | `v3.5-f77875c` | Thu, 06 Aug 2026 10:43:37 GMT | `829ed038…` | `b0f05b6f…` |

**Byte-identical at both ends, so nothing redeployed under this pass.** The branch had moved from
`v3.5-7168d14` to `v3.5-f77875c` at **10:43:37Z — twelve minutes BEFORE this session began** — which is
the fourth deploy in three days. The writer's build constant was changed to `v3.5-f77875c` **before the
first write**, so **no case written here carries a marker it was not checked on**.

**⚠️ THE SESSION LOST THE APPLICATION AT ~11:37Z AND COULD NOT GET IT BACK.** Live work ran for about
42 minutes. Everything below was observed inside that window; everything not observed is named as such.

## Sources, re-read live at 10:57:47Z

SBC **15** · SBR **17** · PV **5** · TU **6** · WIP **9** · IV **4** — **none moved.** Epic **SV-8582 =
104 children** (not 105; verified with a fully-paged `parent=` query).

## The count, re-derived from live and agreed

Live under group 4281 **481**, ours **476**, foreign **5**. By build line: 219 on `v3.5-16cf83f` 8/6 +
133 on `v3.5-7168d14` 8/6 = **352 verdicted**; 113 on `v3.4.1-3d03023` 8/4 + 7 on `v3.5-16cf83f` 8/5 + 4
with no build line = **124 outstanding**. **This agrees with the third session's handover exactly.**

## Work In Progress — 35 of 45 closed, 10 not closed

### PASSES (24), each with the evidence

- **C30457** Invoiced/Paid/part-sale never appear — the only statuses present across **394 rows over
  twelve months** are `estimate`, `approved`, `ready_for_review`, `complete`. No invoiced, no paid, no
  part-sale. *Honest bound: the absence is proven; that excluded work orders exist in the window to be
  excluded was not separately proven, because the work-order list needs the session that later died.*
- **C30458** Each work order appears exactly once in exactly one tab — **0 of 394 rows** appear in more
  than one tab and **0** appear twice at all.
- **C30459** Loading indicator — `.q-linear-progress` present for six consecutive 200 ms samples while
  the **old five rows stayed on screen**, then gone with 31 new rows. The table never went blank.
- **C30460** Empty tab — on Last Year, **Completed (0)** and **Approved - Not Started (0)** both show
  **"Empty bays, endless possibilities. Get Going!"** with **no Totals row**, while the populated tabs
  show rows normally.
- **C30462** Status-to-tab mapping — `estimate`→Estimates 208/208, `complete`→Completed 31/31,
  `ready_for_review`→Approved - Partially Completed 14/14, `approved` split 102 APC / 39 ANS.
  *Honest bound: no work order with an `in_progress` status exists on this estate in range, so that one
  of the four mappings was not observed.*
- **C30473** Last Activity — **"Today"**, **"92d ago"** and **"—"** all observed in the same column.
- **C30482** An estimate with nothing approved is $0.00 everywhere — **81 of 208** Estimates rows carry
  `total = 0`, and since `total = earned + remaining` holds on all 394, every money column is zero.
- **C30484** Sort cycle — click 1 `descending=false` ascending, click 2 `descending=true` descending,
  click 3 **back to ascending**, click 4 descending again; clicking Status replaced the sort and only one
  header carried `sorted`. *Observation worth recording: clicks 3 and 4 re-sorted from cache with no new
  request. No requirement covers where the sort happens, so this is not called a defect.*
- **C30485** Sort keys — Asset descending gave `UNIT 2, UNIT 1, trash compactor, Suga, ST-25, ST-24
  TERRY, ST-20, SHUNT, RHAY-08, M-000141…` = **by Unit #, as case-insensitive text**; Total ascending
  gave `$0.00 … $21.92, $30.00` and descending `$24,869.91 … $7,178.27` = **numeric, not text**; Status
  sorted on `sortBy=status`.
- **C30486** Sorting stays inside the tab — Totals row still present and last, other tab counts unchanged.
- **C30490** Per-stage figures equal the tab totals — **all four match to the cent** on a twelve-month
  range: Not Started $31,172.38 = ANS earned+remaining; Started—Earned $212,887.15 = APC earned;
  Started—Remaining $113,800.44 = APC remaining; Ready to Invoice $56,494.23 = Completed earned.
- **C30501** Date range — exactly the **nine** named presets in order, plus a month calendar, a live
  "Range: 5 days" readout and an Apply button; default **This Week**; **no Today, no Yesterday, no item
  called Custom, no All Time**.
- **C30502** Created-date filter and the 366-day cap — **366 days (2025-08-06 → 2026-08-06) loads
  normally; 367 days (2025-08-05 → 2026-08-06) is refused with exactly "Date range cannot be over one
  year."**, and so are 400 and 730 days. **So the first and last days ARE counted** — that is the
  changeover the case asks the tester to record. *Honest bound: the refusal and its exact wording were
  observed at the data layer, because the Quasar calendar could not be driven to build a custom range
  through our tooling; the on-screen presentation of that message was not seen.*
- **C30503** Location filter — rightmost, both accessible locations listed, "All locations" / "Clear
  all" present, and deselecting one fired **exactly one** reload scoped to the remaining location.
  *Honest bound: item 4 (a one-location user never sees the filter) needs a second sign-in.*
- **C30504** Inaccessible locations — passing the **QB Location** id `d5366a95…`, which is **not** in the
  two workplaces this user can access, returns the **active location's counts**, identical to passing no
  location at all; a bogus uuid does the same. Nothing from an inaccessible location leaks, and an
  unresolvable selection falls back to the active location.
- **C30506** Column Selection — tooltip reads exactly **"Column Selection"**; toggling Customer off
  removed it and on restored it; **Total is not offered in the control at all**.
- **C30507** Order never changes — toggling **Inv. Hrs first and VIN second** still produced
  `… Asset, VIN, Location, … Remaining, Inv. Hrs, Total`; Total last; **all four tabs identical**.
- **C30508** Persistence — the saved key is `report_view:wip`, holding dateRange, locationIds, sortBy,
  descending, columns and `extra.{advisors,customers,assets,activeTab}`. Last Quarter + Inv. Hrs on +
  the Completed tab all came back after a reload; a browser with the key cleared showed the defaults.
- **C30509** Invalid saved value — injecting `dateRange:'NOT_A_RANGE'`, `columns:['bogus_column_x']` and
  a non-existent location id loaded the report normally with the defaults restored and **no error**.
- **C30520** Summary strip — `border-top: 1px solid` and `border-bottom: 1px solid`, and it sits
  **above** the tabs (strip bottom 246.95 px, tabs top 254.95 px).
- **C30521** Total column — header `position: sticky; right: 0; font-weight: 800`, class
  `report-col-pinned`; the Totals cell the same at weight 700.
- **C30522** Totals row stays visible — **every one of the 17 cells** is `position: sticky; bottom: 0`.
- **C30525** Dark mode — reached through the profile menu (Light / Dark). Body `rgb(20,24,36)` with white
  text, table `rgb(15,17,26)`, headers and data cells white, strip value `rgb(224,227,231)`, and the
  **Inv. Hrs green survives** at `rgb(33,186,69)`. Light mode restored afterwards.
- **C38916** Location column is automatic and never reads "Multiple" — it appears with two locations in
  scope, **disappears with one**, and every value is a real location name.

Also established but belonging to already-verdicted cases: **S4-R19/R20/R21 hold on all 394 rows**
(earned = labor+parts earned; remaining = labor+parts remaining; total = earned + remaining), the
**Totals row sums match the column sums on all four tabs**, `labor_remaining` is **never negative** so
Labor Earned is capped at the quote, and **all seven summary information-icon texts match S5-R12
verbatim**.

### DEVIATIONS on new tickets (3)

| Case | What the document requires | What the build does | Ticket |
|---|---|---|---|
| **C30466** | **S4-R4** *"WO #, Status, Customer, Asset, VIN, Location, and Advisor are left-aligned; every other column is right-aligned."* | The column ORDER is exactly right and every left-aligned column is right, but **Last Activity is left-aligned** — the only member of the right-aligned group that is wrong | **SV-8987** |
| **C30491** | **S5-R8** *"…is the total quoted value of the jobs in the 'Estimates' tab, and is shown in a muted style."* | The amount is right and it is correctly excluded from both headline totals, but the figure is **styled identically to every other figure** — label `rgb(97,97,97)` 12 px, value `rgb(54,65,82)` 20 px weight 700, opacity 1, class `wip-summary-strip__value` | **SV-8988** |
| **C30481** | **S4-R23** *"a signed number with one decimal place ("+2.0", "-14.0", "0.0")"* | **Two** decimal places, on every row and on the Totals row — `+0.50`, `+1.24`, `-0.81`, `-14.86`, `+246.84`. **30 of 30 on-screen values had two; none had one.** The sign, the unsigned zero and the green/red colouring are all correct | **SV-8989** |

### DEVIATIONS already ticketed (2)

- **C30500** — carries **two**. **SV-8908** (an asset sharing a Unit # is left out) was recorded by an
  earlier session and is **preserved verbatim, not re-verified here**. **SV-8968** is confirmed on this
  build: picking an asset fired **one fresh server request** instead of narrowing on screen — and
  **SV-8968's own summary names the Asset filter explicitly**, so no new ticket. Everything else in the
  case passes: the filter reads "All assets", each option shows Unit # and VIN with the `(no unit #)` and
  `— no VIN —` placeholders, typing **`471` returned both `471 / AAA2MC306YY37JZSC` (a Unit # match) and
  `L35 / 1FTBR3U82NKA27471` (a VIN match)** — a clean demonstration of S7-R4 — a nonsense string gave
  "No results", and Clear all returned it to "All assets".
- **C30511** — **SV-8907 still reproduces on this build.** The download is **HTTP 500 for any tab with
  rows** (2-row Completed fails exactly as 208-row Estimates does, so it is presence of rows, not size),
  requestId `cf2bf8af-b355-4352-8d40-e5e2a1d42005`, and identical for CSV and PDF and for both the
  default and the full column set. An **empty window returns HTTP 200 with a real file**, and that file
  independently proves the UTF-8 BOM, the `"Date Range: …"` line, the `"Locations: All locations"` line,
  the **`Unit`** and **`Branch`** headings of S9-E1, and a Totals row.

### HOLD (6)

- **C30467** and **C43551** — **the WIP specification contradicts itself and it is Chris's to settle.**
  **S4-R3**: *"The Location column **is offered in the column selector** to any user with access to more
  than one location; for that user it is shown by default and **can be toggled on or off**."* **S7-R13**:
  *"…is shown automatically whenever the current scope spans more than one location… **the user does not
  toggle it in the column selector**."* Live, the column-selection list holds fifteen entries and
  **Location is not among them**; the column appears and disappears with the location scope. Per Rule 57
  the build does not settle a documented contradiction, so neither reading is asserted. This is **Q5**,
  already on the sheet.
- **C30528, C30530, C30531, C30533** — the nightly snapshot. **Six candidate readback endpoints were
  probed and all six returned HTTP 404** (`…/snapshots`, `…/snapshot?date=`, `/api/reporting/wip-snapshots`,
  `…/history`, `…/daily`, `/api/reporting/snapshots/work-in-progress`), which matches the specification's
  own note that the capture *"has no reader in this version"*. There is no surface on which a tester or an
  automated run could observe these, so `READY` was wrong and they are now `HOLD`.

### The 10 NOT closed, and precisely why

**Two need a non-administrator sign-in** — **C30526**, **C30527**. Not attempted: `switch-user` and
`quick-login {"key":"tech"}` are already proven to 403 on this branch and a failed attempt burns the
shared session that sibling workers need.

**Eight needed a seeded work order and the session died mid-seed** — **C30456**, **C30464**, **C30475**,
**C30476**, **C30477**, **C30478**, **C30480**, **C38890**. **Seeding was attempted properly, not waved
away.** A work order **was created** (`e40c1c15-63ba-4202-9cc9-358da3d5fe21`) and the New Line dialog
**was opened and its fields identified — `input_time_estimate` ("Estimated Time") and `input_tech_time`
("Tech Time") are exactly the two values these cases need** — but Save & Close fired no request (a
required field not yet identified), and the next attempt hit the 401. **None of these eight was touched
in TestRail, so each still carries its honest 4 August build stamp.**

## Three readings that would have been false defects, and the control that killed each

1. **"The Estimates summary figure is broken — it reads $0.00 with 65 estimates on screen."** It reads
   $0.00 on the **default This Week range** because all 65 estimates created this week have no lines yet.
   Widening to twelve months gives **$548,661.00, equal to the Estimates tab's own total to the cent**.
   **The case's existing "Known issue" block asserted this false defect and has been removed** — an
   earlier session recorded a range artefact as a product fault.
2. **"The asset type-ahead does not filter."** It does. The first attempt typed into the page instead of
   the menu's `Search assets` input; driven through the input, `AAA2MC306` returns exactly one option.
3. **"Labor Earned does not equal the clocked share of the quote — only 52 of 108 rows match."**
   **My formula was wrong, not the build.** S4-R15 caps **per line** and then sums; I compared
   whole-work-order aggregates, which only coincide when there is a single line.

## One contradiction with an already-verdicted case, reported and NOT silently changed

**C30495** (*"The Totals row sums each visible money column and the Inv. Hrs…"*, refs S6-R2 **and
S6-R3**) was verdicted **PASS** on `v3.5-7168d14` by an earlier session. **S6-R3 requires the Totals row's
Inv. Hrs to use *"the same green/red/default coloring as a row"*.** Measured on **all four tabs**, data
rows carry `text-positive` green `rgb(33,186,69)` or `text-negative` red `rgb(193,0,21)`, while the
**Totals cell carries neither class and renders black in light mode and white in dark** — `+246.84`,
`+1434.65`, `+0.52`, `+173.50`, every one positive and none coloured. **C30495 is outside this session's
work list and was not re-verdicted; the QA lead's call.** The second half of S6-R3 (one decimal place) is
the same fault as **SV-8989** and is ticketed.

## An unresolved observation, deliberately not filed

**Five of the 116 "Approved - Partially Completed" rows have neither clocked time nor any Parts Earned
value**, where **S3-R4** puts a started job in that tab only if time has been clocked **or** a part has
been received. That looks wrong — but a part received at a **$0.00 sell value** would show
`parts_earned: 0` while a part genuinely was received, which would make all five correct. **That cannot
be separated without opening the five work orders, and the session was lost before it could be done, so
nothing was filed.** The five are named in `RECHECK-QUEUE.md`.

## Another author's ticket contradicts our sourced position — escalated, not edited

**SV-8960** (*"WIP | Days Open column alignment is inconsistent with other text columns"*, **Nebojsa
Glavinic**, Story Defect, Medium, parent SV-8666, Open) asks for **Days Open to be left-aligned like the
other text columns, and lists Last Activity among the columns that are correctly left-aligned.**
**S4-R4 says the opposite on both counts**: Days Open is not in the left-aligned list, so it belongs on
the right — where the build already puts it (`text-right`, both header and cell) — and **Last Activity
is the column that is genuinely wrong**, which his ticket treats as correct. So as written his expected
result contradicts the specification, and his ticket misses the real defect beside it.
**His ticket was NOT touched (Rules 38 and 52).** Our position is retained on **S4-R4 verbatim**, and
**SV-8987** was filed for Last Activity. **What source he worked from is not established** — his ticket
cites none, and he could not be asked in this session. **This is for the QA lead to put to him.**

---

# SESSION 5 — 2026-08-06, from ~13:53Z

## Build marker readings

| Read at (UTC) | app-version | last-modified | etag | index.html sha256 |
|---|---|---|---|---|
| 13:53:17Z (start) | `v3.5-f77875c` | Thu, 06 Aug 2026 10:43:37 GMT | `829ed03832a746e78cbdb28eb9957a3e` | `b0f05b6f…94fc9b6` |

## Sources at pass start (Rule 31), all fetched live

SBC **15** · SBR **17** · PV **5** · TU **6** · WIP **9** · IV **4** — **none moved.**

## Count re-derived independently from live TestRail

Live under group 4281 **481** · ours **476** · foreign **5** (C38919–C38923, Vladimir Tomovic — untouched,
Rule 38) · carrying an 8/6/2026 build line **387** · **outstanding 89**. **387 + 89 = 476.**
Per-report split matches `RESUME.md` exactly: SBR 45 · PV 17 · SBC 14 · WIP 10 · TU 2 · IV 1.
**I agree with the handover count.**

## WORK IN PROGRESS — the seeding was finished, and it settled 8 cases

**The previous session's blocker is cleared.** Its note said `input_tech_time` was the clocked time and
that Save & Close needed one more unknown field. **Both points are corrected below, and the second one
was a dead end worth abandoning: the canned-line route needs no unknown field at all.**

### What was seeded (ZZAUTOTEST, on WO `e40c1c15-63ba-4202-9cc9-358da3d5fe21`, S8582-16263, Iibay Landscaping, Staging Heavy Duty - 9919)

1. **An approved labour line with a known quote** — `POST /api/work-orders/{woId}/lines/create-from-canned-line`
   `{another:false, canned_line_id, work_order_id, status}` → **201**. Canned line *Replace - Drive axle
   brakes (Drum)*: **180 min estimate, HD Fleet Rate $149.95/h ⇒ $449.85 quoted**, plus 2 vendor part
   requests. Approved with `POST /api/work-orders/lines/change-status {line_id,status:'authorized',workOrderId}` → **200**.
2. **The work order moved to Approved** — `POST /api/work-orders/change-status {id, status}` → **201**
   (note `id`, **not** `work_order_id`; `work_order_id` returns 400 "Work Order ID is missing").
3. **A running clock on the line** — `POST /api/technician-tasks/check-in {task_id, line_id, work_order_id, refresh_lines:true}` → **201**.
4. **An unapproved second line** — same canned-line endpoint with `status:'authorization_required'`;
   *Replace - Suspension air bag*, 90 min ⇒ **$224.93 of unapproved value**.

### 🔴 CORRECTION TO THE PLAYBOOK: `tech_time` IS NOT THE CLOCKED TIME

The canned line arrived with `tech_time: 120` (2.00 h) and the report still showed
**`worked_hours: 0` and `labor_earned: 0`**. The report reads **clock records** (`total_clocked_time`),
not the "Tech Time" field. Playbook §Q says the opposite and needs correcting — **flagged, not edited
from here** (§Q belongs to another worker's pass).

### The maths, verified against three independent readings of the same running clock

| worked_hours | quoted_hours | Labor Earned (report) | clocked share of $449.85 | match |
|---:|---:|---:|---:|:--|
| 0.01 | 3 | **$1.50** | 0.01/3 × 449.85 = $1.4995 | ✓ |
| 0.02 | 3 | **$3.00** | $2.999 | ✓ |
| 0.18 | 3 | **$26.99** | $26.991 | ✓ |

`Labor Earned + Labor Remaining` equalled the quote at every reading (150+44835, 300+44685, 2699+42286
= **44985** every time).

### Verdicts — 8 cases, each with a control

- **C30475 Labor Earned = clocked share — PASS** on items 1 and 3. Item 2 (**the per-line cap**) was
  **NOT exercised** — see the honest limit below.
- **C30476 Earned + Remaining = quoted value — PASS.** Three readings on the seeded WO, **and
  exhaustively across all 104 live rows: 0 rows where Earned+Remaining ≠ Total, 0 where
  Labor+Parts Earned ≠ Earned, 0 where Labor+Parts Remaining ≠ Remaining.**
- **C30477 Parts Earned — PASS.** Verified against each work order's own part records:
  **100 of 104 exact to the cent**, once the **core charge** is included (the first pass omitted it and
  missed by exactly $149.50 on S8582-15781 — that was our formula's error, not the build's).
  **All 4 remaining differences are work orders carrying part RETURNS**, and **the specification says
  nothing about how a returned part affects Parts Earned** → logged as a question for Chris Ward, **not
  a defect** (Rule 58: an ambiguous source is not resolved by looking at the build).
- **C30478 Parts Remaining — PASS.** `outstanding qty × (sell price + core charge)` matched **to the cent
  on 102 of 104** rows; the 2 differences are work orders where a part request still shows an outstanding
  quantity after being fulfilled — the same returns/fulfilment representation question.
- **C30480 unapproved lines contribute nothing — PASS, with a clean control.** A **$224.93** unapproved
  line was added and `total` stayed at **44985** and `quoted_hours` at **3**. (Labor Earned moved only
  because the clock was still running.)
- **C38890 running clock counts toward Labor Earned — PASS** on items 1 and 2: the earned share was
  non-zero **while the technician was still clocked in and had not clocked out**, and it **grew** across
  the three readings. Item 3 (**the cap**) **NOT exercised.**
- **C30464 tab placement, the started boundary — PASS, all three items, each controlled:**
  (1) clocking time moved our WO **ApprovedNotStarted → ApprovedPartiallyCompleted** (counts 2/0 → 1/1),
  with **no part received**; (2) **16 live rows** sit in Approved-partially-completed with
  `worked_hours: 0` and parts received (e.g. S8582-15859, parts_earned 21992) — so a received part alone
  is enough; (3) **0 of the 28** Approved-not-started rows have any worked hours or any received parts.
- **C30456 every open service WO appears — PASS, exhaustively and in both directions.** Report
  **260** distinct work orders; the work-order list filtered to the five open statuses in the same
  window gives **260**; **set-equal both directions, 0 either way.** Status→tab mapping over all 260:
  estimate→Estimates 156 · approved→ApprovedNotStarted 28 / ApprovedPartiallyCompleted 62 ·
  in_progress→ApprovedPartiallyCompleted 1 · ready_for_review→ApprovedPartiallyCompleted 1 ·
  complete→Completed 12. Our own seeded WO was watched entering the report as an Estimate and moving
  tab as its state changed.

### A FALSE DEFECT KILLED BY A CONTROL

An intermediate run made it look as though **passing `locations=` dropped the entire
Approved-not-started tab** (232 work orders instead of 260 — and 260 − 232 = 28, exactly that tab's
count, which is precisely the kind of coincidence that reads as a real bug). **Re-running the four tabs
with and without the parameter gave byte-identical counts (156 / 28 / 64 / 12 both ways).** It was a
transient in **our own script**, not the product. **Nothing filed.**

### 🔴 THE HONEST LIMIT — THE PER-LINE CAP WAS NOT EXERCISED

**C30475 item 2 and C38890 item 3** both assert that Labor Earned never exceeds a line's quoted value.
Proving it needs `worked_hours > quoted_hours`. The seeded line is quoted at **3.00 h** and the clock had
reached **0.18 h**, so the cap never engaged, and it could not be forced:
- the smallest canned line on this estate is **18 minutes** — still far more than a session can clock;
- shrinking the line's own estimate needs `POST /api/work-orders/lines/change`, which was **probed and
  not solved**: it takes **camelCase** keys (`lineName`, `timeEstimate`, `labourTypeId` — `line_id`/
  `time_estimate` return *"Line name is missing"*), but every labour-price key tried
  (`labourRate`, `labourPrice`, `fixedPrice`, `techTime`) still returns
  **400 `{"error":"Labor or fixed prices must be set."}`**. **The field name is still unknown and is not
  guessed here** — it must be captured from the *Edit labor* dialog's own request.
- the *Edit labor* dialog (line kebab → **Edit labor**) is the right route and **was reached once**, but
  its menu item could not be clicked reliably in the harness after a second line changed the row
  geometry.

**So both cases keep their documented expectation and their `AUTOMATION: READY` marker** (which asserts
*automatable*, not *currently passing* — Rule 60), and **the cap is queued in `RECHECK-QUEUE.md` as the
specific thing still owed.**

### Left in place deliberately

The seeded work order, both lines and the **still-running clock** were **left as they are** — the branch
is disposable, no teardown was required, and the running clock is the exact precondition C38890 needs if
someone can later let it pass 3 hours to close out the cap.

## 🔴 SALES BY REPRESENTATIVE — THE Inv. Hrs COLUMN IS ZERO EVERYWHERE, AND IT IS THE BUILD, NOT THE DATA

**This is the largest finding of the session, and it CORRECTS a conclusion three earlier sessions
reached.** Sessions 2–4 recorded that the 8 Inv. Hrs calculation cases could not be checked *"because
every hours figure on this estate is 0.0"* and treated that as a **data** shortage. It is not. **The data
exists; Sales By Representative and Sales By Customer simply do not populate the column.**

### How it was established, and the control that rules out an estate problem

1. **A work order was seeded and invoiced under a named representative** so that the billed hours were
   known: WO **S-16265**, customer **Iibay Landscaping**, rep **Parth Fadadu**, one labour line of
   **45 minutes at the HD Fleet Rate $149.95/h**.
2. The report shows **`labor_invoiced` = 11246 = $112.46**, which is **exactly 0.75 h × $149.95** — so
   the report has correctly derived the *money* for three-quarters of an hour of billed labour.
3. **The same row reports `hours_invoiced: 0`, `hours_worked: 0`, `inv_hrs: 0`.** The internal
   contradiction is the proof: the money knows about the hours, the hours column does not.
4. **It is not our seeded row being odd.** Across the full twelve-month range there are **3,248
   invoices** in the report and **not one** has a non-zero `hours_worked`, `hours_invoiced` or `inv_hrs`.
   The **grand totals are 0** as well.
5. **Four sampled work orders behind existing invoices carry real logged labour AND real clocked time** —
   e.g. **S-15487 with 415.53 minutes clocked and 1,309.8 minutes estimated against $1,799.06 of billed
   labour** — and their report rows still read 0.
6. **THE DECISIVE CONTROL: the Work In Progress report, on the same build and the same work orders, does
   show the hours.** `quoted_hours` is non-zero on **56 of 64** rows, `worked_hours` on **46 of 64**, and
   its **`totals.inv_hours` = 266.84 is exactly Σ(quoted − worked)** across those rows. Some of those
   work orders sit under invoices in Sales By Representative. **So the hours are computable on this
   estate and one report already computes them.**
7. **On screen** (not only in the payload): every representative row and the **Totals** row read **0.0**
   in Inv. Hrs beside real money — Parth Fadadu 0.0 / $112.46, ZZAUTOTEST RepA 0.0 / $224.92, ZZAUTOTEST
   RepB 0.0 / $799.84, Totals 0.0 / $1,137.22.
8. **Sales By Customer is affected identically** — `inv_hrs: 0` on all 60 rows and in its totals, while
   its money columns are populated and its `margin_pct` varies properly (92.5%, 96.1%), so that report is
   otherwise working.

**Requirement breached** — SBR spec **version 17**, §3: *"Inv. Hrs (Labor Delta) = hours invoiced − hours
worked, where hours invoiced = the billed labor hours on the invoice's work-order labor lines…"*, and
**S9-N1** explicitly: *"An invoice with clocked technician hours but no billed labor line shows the
resulting negative delta … this worked-but-unbilled signal is not suppressed to 0.0"* — here **every**
invoice is flattened to 0.0.

**FILED: [SV-8999](https://shopview.atlassian.net/browse/SV-8999)** — Story Defect · parent **SV-8626**
(SBR Story 9, the owning story) · priority **Medium** · `relates to` **SV-8626 and SV-8610** (the SBC
story, since both reports are affected — widened rather than duplicated, following the SV-8937
precedent) · Product Area not sent · five-part body · **16 field checks read back live, all PASS** ·
**evidence screenshot attached and referenced inline** in *Current behaviour*.
**Duplicate-searched with five JQL queries first** (`text ~ "Inv. Hrs"`, `text ~ "hours invoiced"`,
`text ~ "Labor Delta"`, `text ~ "Hrs Worked" OR "hours worked"`, `parent = SV-8626`) — the nearest hits
are **SV-8989** (WIP's Inv. Hrs decimal places, a different report and a different fault) and **SV-8972**
(an SBR spreadsheet column order), neither of which covers this.

**Worth knowing for whoever fixes it:** **[SV-8592](https://shopview.atlassian.net/browse/SV-8592)**
*"[Reports Suite][A4] Denormalized invoice financial columns + backfill + clock subscriber"* is **In
Progress** and looks like the implementation ticket for exactly these columns. **That is context, not
evidence** — under Rule 61 a ticket's status is never read as a statement about the build, and the
observation above stands on its own.

### Cases moved to DEVIATION on SV-8999 — 4

Each now carries the Rule-61 block naming the exact symptom and all three outcomes.

| Case | Verdict |
|---|---|
| [C30229](https://shopview.testrail.io/index.php?/cases/view/30229) | **DEVIATION.** Item 1 **passes** — the heading really is "Inv. Hrs" with the period, read off the live table. Item 2 fails. The note says so, rather than condemning the whole case. |
| [C30230](https://shopview.testrail.io/index.php?/cases/view/30230) | **DEVIATION.** Green/red/default colouring cannot be exercised at all when every value is 0.0. |
| [C30231](https://shopview.testrail.io/index.php?/cases/view/30231) | **DEVIATION.** This is the case S9-N1 was written for, and it is the clearest breach: the worked-but-unbilled negative is suppressed. |
| [C38894](https://shopview.testrail.io/index.php?/cases/view/38894) | **DEVIATION.** A clock edit cannot move a figure that is hard-zero. |

**The documented expectation was kept on all four** (Rule 57) — nothing was rewritten to match the build.
