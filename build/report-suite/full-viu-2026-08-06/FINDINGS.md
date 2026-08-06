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
