# FINDINGS — Report Suite live-observation pass, 2026-08-06

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
