# SPEC-DIFF — Report Suite, 2026-08-06 second session

Standing Rule 43: **every added or changed requirement gets its OWN verdict row.** A narrative summary
is not acceptable. Both totals are reconciled at the end.

## 1 · The delta count

All six specifications were fetched **live** at pass start (08:24Z) and again at pass end (09:25Z).

| Page | Version at start | Version at end | Moved? |
|---|---|---|---|
| Sales By Customer | 15 | 15 | no |
| Sales By Representative | 17 | 17 | no |
| Parts Velocity | 5 | 5 | no |
| Technician Utilization | 6 | 6 | no |
| Work In Progress | 9 | 9 | no |
| Inventory Value | 4 | 4 | no |

**NOTHING MOVED DURING THIS PASS. Requirement-level deltas since the last pass: ZERO.**

That is the honest headline and it means this file has **no new delta rows of its own**. What it does
instead is give a verdict row to each of the **six requirement-level deltas Chris Ward introduced on 5
August** — the three items he posted in the Reports channel — because **this is the first pass that
tested any of them against the running build.** The 2026-08-05 pass diffed them on paper
(`build/report-suite/chris-newreqs-2026-08-05/SPEC-DIFF.md`, six verdict rows, totals reconciled) and
could not check them, because the sign-in was dead that day.

**VERDICT ROWS BELOW = 6. The two totals reconcile.**

---

## 2 · VERDICT ROW 1 — WIP `S4-R5` (rewritten in v8)

**The requirement, verbatim from live WIP v9:**

> "WO # is shown as a link that opens the work order in the same browser tab (the user returns via the
> browser's back navigation) **only when the user has permission to access Work Orders**. A user
> without Work Order permission sees the WO # as plain text, not a link."

**Covering cases, and BOTH texts side by side (Rule 45(e)):**

**[C30468](https://shopview.testrail.io/index.php?/cases/view/30468)**, expected verbatim:
> "1. For a person who has permission to open work orders, the WO # is shown as a link. 2. Clicking it
> opens that work order in the SAME browser tab (not a new tab). 3. The browser's back navigation
> returns you to the report."

**[C43557](https://shopview.testrail.io/index.php?/cases/view/43557)**, expected verbatim:
> "1. For the person who CAN open work orders, the WO # is shown as a link. 2. For the person who
> CANNOT open work orders, the WO # is shown as ordinary plain text…"

**[C30523](https://shopview.testrail.io/index.php?/cases/view/30523)**, expected verbatim:
> "1. The WO # link can receive keyboard focus. 2. A visible focus indicator shows when it is focused.
> 3. Activating it opens the work order (in the same browser tab)."

**VERDICT: COVERED — three cases, and the requirement's positive half FAILS on the build.**

Observed live on `v3.5-7168d14`, signed in as Admin ShopView whose permissions include
`workOrdersView`, `workOrdersCreateAndEdit`, `workOrdersDelete`, `workOrderLinesCreateAndEdit`,
`workOrderLinesDelete`, `woReviewWorkOrders`: the WO # is a `<span>` with **no href**, text-decoration
`none`, colour `rgb(0,0,0)`, font-weight 400, cursor `auto`; clicking it changed nothing and the
address bar did not move; and **the entire table contains zero anchor elements**.

**Filed as [SV-8967](https://shopview.atlassian.net/browse/SV-8967).** All three cases now carry
`AUTOMATION: READY - EXPECT FAIL (SV-8967)` and the Rule-61 three-outcome block.

---

## 3 · VERDICT ROW 2 — WIP `S7-R1` (rewritten in v8)

**Verbatim, live v9:**

> "The toolbar has an Advisor filter, a multi-select listing the advisors present across all open jobs
> in the current scope (**the report loads the complete set of open jobs in one request**). Selecting
> one or more advisors narrows the visible jobs to those advisors, **on screen only (no reload)**."

**Covering case [C30498](https://shopview.testrail.io/index.php?/cases/view/30498)**, expected verbatim:
> "1. The Advisor filter is a multi-select listing the advisors on every open job in what the report is
> currently showing you — not only the ones on the rows that happen to have loaded. 2. Selecting one or
> more advisors narrows the visible jobs to those advisors instantly, on screen only — no reload and no
> loading indicator."

**VERDICT: COVERED — and SPLIT. The first half PASSES, the second FAILS.**

- **First half — the list is scope-wide: PASS.** `GET /api/reporting/reports/work-in-progress/filters`
  returns **13 advisors** and the full customer and asset lists for the scope, not just the loaded page.
- **Second half — on screen only: FAIL.** Ticking `Admin ShopView` sent **one fresh request**. Switching
  tab afterwards sent `…&advisors=Admin%20ShopView&customers=Aaborough%20Works…`, so the narrowing is
  the server's work. And the report does **not** load the complete set in one request: the data
  response carries `pagination: {page: 1, rowsPerPage: 30, rowsNumber: 115}`.

**Filed as [SV-8968](https://shopview.atlassian.net/browse/SV-8968).**

---

## 4 · VERDICT ROW 3 — WIP `S7-R2` (rewritten in v8)

**Verbatim:** "…a searchable type-ahead multi-select listing the customers present across all open jobs
in the current scope … narrowing is **on screen only (no reload)**."

**Covering case [C30499](https://shopview.testrail.io/index.php?/cases/view/30499)** — expected asserts
"With no customer selected, the filter reads 'All customers', every job is shown, and **no Clear action
is offered**", plus the type-ahead and the on-screen narrowing.

**VERDICT: COVERED — and it fails on TWO counts, which are two separate tickets.**

- the on-screen-only half → **SV-8968** (row 3 above);
- the **Clear action is offered before anything is selected** → **[SV-8969](https://shopview.atlassian.net/browse/SV-8969)**. Observed with nothing selected: the list reads
  `All customers`, `Clear all`, then the customers. `S7-R3` verbatim: "…the filter offers a single
  'Clear' action that returns it to 'All customers', **shown only once at least one customer is
  selected**."

The type-ahead itself is correct: the search box is a real text input with placeholder `Search
customers`.

---

## 5 · VERDICT ROW 4 — WIP `S7-R4` (changed in v9)

**Verbatim:** "The toolbar has an Asset filter … Each option shows **the unit number and the vehicle
identification number**, and the user's typed text matches against **EITHER** the unit number **OR**
the vehicle identification number. Selecting one or more assets narrows the visible jobs **on screen
only (no reload)**."

**VERDICT: PARTLY COVERED, PARTLY OBSERVED.**

The **option rendering is right and was observed**: the list reads `123 — no VIN —`,
`(no unit #) 12345`, `(no unit #) 31UPV8H0JC1XBGM40`, `471 AAA2MC306YY37JZSC` — unit number then
vehicle identification number, with the documented placeholders. **The either/or typed matching was NOT
driven** and is queued (queue section E). The on-screen-only half is covered by **SV-8968**, which names
S7-R4 explicitly.

---

## 6 · VERDICT ROW 5 — SBC `S9-R1a` (added in v15)

**Verbatim:** "The invoice number is rendered as a link **only when the user has permission to open the
target** it links to (the work order or parts sale); a user without that permission sees the invoice
number as plain text."

**VERDICT: COVERED, STILL UNRESOLVABLE — no change.**

- positive half → **[C30138](https://shopview.testrail.io/index.php?/cases/view/30138)**, and the link
  itself was observed live: `<a href="/workorders/ed29aa49-…/finance">S-16244</a>`, same tab. **PASS.**
- negative half → **[C43558](https://shopview.testrail.io/index.php?/cases/view/43558)**, `HOLD`, and it
  **cannot be settled**, because **S9-N2 in the same v15 page says the opposite**: "If the user lacks
  permission to open the destination invoice, **the destination page shows the application's standard
  access-denied state**" — which presupposes a link to activate. One of the two must go. **Chris's
  question, unchanged.**

---

## 7 · VERDICT ROW 6 — SBR `§2` expanded rows (narrative changed in v17, NO anchor)

**VERDICT: NOT INDEPENDENTLY TESTABLE AS A NUMBERED REQUIREMENT — no change, and it is still Chris's.**

`S12-R1` ("Each invoice number on a detail row is a clickable link") and `S12-R3` (the customer name)
are **byte-unchanged from v16** and read unconditionally, while §2 now reads conditionally. **There is
no anchor a negative case can cite.** Sales By Representative was not driven in this pass at all, so
nothing new is known.

---

## 8 · CORRECTION TO OUR OWN RECORD — the export row cap IS documented in three specs

`full-viu-2026-08-06/FINDINGS.md` and `FILED.md` both assert that **none of the six specifications
mentions the ~10,000-row export cap**. **That claim is WRONG, and it is wrong in our favour, so it is
corrected here rather than repeated.** Checked independently against the live spec bodies:

| Spec | Documents the cap? | Anchor and verbatim |
|---|---|---|
| **Sales By Customer v15** | **YES** | **S14-R16**: "Each CSV is capped at 10,000 data rows … counted on the server against the active date range, Product Type, location, Customer filter, and sort." · **S15-R25**: the same for each PDF |
| **Sales By Representative v17** | **YES** | **S14-E2**: "…the export's row cap of 10,000 data rows — the server does not produce a truncated file — it declines to generate and an error toast…" |
| **Inventory Value v4** | **YES** | **S10-R12**: "This report is too large to export. Narrow the date range or filters, then try again." — the exact message, with "Blocking notification; no file is produced" |
| **Parts Velocity v5** | no | silent |
| **Technician Utilization v6** | no | silent |
| **Work In Progress v9** | no | silent (the one apparent hit, S11-R2, is about snapshot rows and names no cap) |

**Consequences, stated plainly:**

1. **A case may assert the cap for SBC, SBR and IV on the STRENGTH OF THE SPECIFICATION** — it does not
   have to fall back to epic story SV-8591. Any case or ticket text resting on "no specification
   mentions this" needs re-deriving for those three reports.
2. For **PV, TU and WIP** the earlier framing was right: the only source is **story SV-8591**, and a
   ticket touching the cap there names the story, in source-type-1 form.
3. **The question for Chris is the NARROW one** — add the cap to the three specifications that omit it.
   It is **not** "is there a cap at all". Recorded that way in `QUESTIONS-FOR-CHRIS.md`.

**No case was edited under this correction in this pass.** The cases that mention the cap are in Parts
Velocity, Technician Utilization and Inventory Value; only the IV one is affected, and re-deriving it
needs its own authorised look rather than being folded into a correction note.
