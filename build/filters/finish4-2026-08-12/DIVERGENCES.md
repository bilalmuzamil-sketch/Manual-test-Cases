# FILTERS — DIVERGENCES (finish4), 2026-08-12

**Build `v3.7-20e801b`** (last-mod Wed 12 Aug 2026 12:09:14 GMT, etag
`82eedf656263a3228c8865356eed8379`), read at 15:30:10Z and again at 16:07:04Z before the writes —
byte-identical. Location **Staging Heavy Duty - 9919**.

**THREE divergences. One corrected (cosmetic), two raised (not acted on).** Every one quotes
**both texts side by side** (Rule 45(e)) and names its cases with C-id and link (Rule 8).

**The category test applied throughout:** *would a reader of the source recognise what the build
offers as the same thing?* **Yes → cosmetic, correct and log. No → substantive, record and raise,
never silently rewrite.**

---

## 1 · C29568's ellipsis expectation is UNSOURCED — **RAISED, NOT CHANGED**

**Case:** [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) — *Selected customers
show as removable tags and as ticks in the list*

**WHAT THE CASE SAYS (expectation 3, verbatim):**

> *"3. Long customer names on tags are shortened with an ellipsis (for example 'Texas Truck And
> Aut...')."*

**WHAT THE SOURCE SAYS — the case's own cited anchors, spec v19, verbatim:**

> **S3-R3:** *"The user can select one or more customers; each selected customer appears as a
> tag/chip at the top of the dropdown input area"*
>
> **S3-R4:** *"Selected customers are indicated with a checkmark in the list"*

**Neither mentions truncation, shortening or an ellipsis. Nothing in the specification does.**

**WHAT THE BUILD DOES** (measured at 1024, 1366 and 1680, with the bar chip as a control that
proves the detector can fire — full table in `RUNNABILITY.md` §1):

* the **tag in the dropdown** renders **all 185 characters**, `text-overflow: clip`,
  `scrollWidth == clientWidth`; the **panel grows to fit it**;
* the **bar chip** *does* ellipsise — `text-overflow: ellipsis`, rendering `ZZAUTOTEST Extr...`.

**ASSESSMENT.** This is **not a build defect** — the build satisfies S3-R3 and S3-R4. It is an
**unsourced assertion in our own case**, and the example given (`'Texas Truck And Aut...'`)
describes what the **bar chip** does, which is very likely where it came from.

**WHY IT MATTERS:** left as it stands, a tester on a **spec-compliant build** will fail this case
and raise a defect that will be thrown back. That is the exact harm Rule 25 addresses.

**RECOMMENDED REPAIR** (Rules 25/42 — remove the unsupported assertion or make it
scope-conditional; **never** substitute what the build does):

> *"3. A long customer name is shown in full on its tag, and the dropdown widens to fit it. The
> filter button at the top of the page shortens a long name with an ellipsis instead."*

**NOT APPLIED, deliberately.** This is an **expectation** edit, not a route correction — outside
this pass's remit, and finish3 held back an equivalent expect-fail rewording on C29625 for the same
reason hours before a release. **The QA lead's call.**

---

## 2 · C38886 step 2 sent the tester to a control that does not exist — **CORRECTED (cosmetic)**

**Case:** [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) — *Your typed search
stays in this browser tab only and is never saved*

**WHAT THE STEP SAID (verbatim, before):**

> *"2. Sort the table by a column, then **move to the next page of results**."*

**WHAT IT SAYS NOW (verbatim, after):**

> *"2. Sort the table by a column, then **scroll down through the results to see more**."*

**WHAT THE SOURCE SAYS — S13-R14, spec v19, verbatim:**

> *"The search query is retained for the browser tab session. **It survives sorting, pagination**,
> and navigating away from the page and returning. Tab-switch behaviour within a page is governed
> by S13-R24"*

**WHAT THE BUILD DOES.** There is **no pagination anywhere on the Work Orders list** — established
exhaustively, not by failing to look: no `.q-table__bottom`, no `.q-pagination`, no "rows per page"
text, no aria next/previous/page, no chevron icons, no "load more"; the only page-ish test-ids are
the search's own. The table is a **Quasar virtual scroll**, and advancing through results is done by
scrolling its container — proven: `scrollTop` 0 → 616, **17+ new work orders revealed**, the search
box still `Aagate`, the URL still `search=Aagate`, and **every visible row still matching**.

**WHY THIS IS COSMETIC AND NOT A DEFECT — the reasoning matters, because the spec does say
"pagination".** S13-R14's subject is **the query's retention**, not the existence of a pager. It
requires the query to survive pagination *if pagination happens*; **nothing in the Filters
specification requires the Work Orders table to be paginated at all** (a search of the spec for
pagination language finds only these S13 cross-references and scrollable-list wording). So the
absent pager breaches no requirement, and the clause is vacuously satisfied.

**Applying the category test:** a reader of *"move to the next page of results"* **would** recognise
*"scroll down through the results"* as the same thing — advancing through the result set while the
query holds. **Cosmetic → corrected to the minimum that makes it executable, and logged.**

**THE EXPECTATION WAS NOT TOUCHED.** Expectation 1 still reads *"Sorting and paging keep your search
applied…"*, which is **spec-sourced language from S13-R14** and not ours to rewrite (Rule 57).

**⚠️ ONE RESIDUAL WORDING POINT FOR THE QA LEAD:** the expectation says *"paging"* while the step now
says *"scroll"*. A tester will do the equivalent action and pass, so nothing is blocked — but if he
wants them aligned, expectation 1's *"paging"* could become *"moving further through the results"*.
**Not applied**, for the same reason as §1: it is an expectation.

---

## 3 · 🔴 THE BIG ONE — A SAVED FILTER IS NOT RESTORED WHEN THE PAGE LOADS. **NOT ESTABLISHED, AND IT CONTRADICTS finish3. RAISED.**

**Cases blocked by it:** [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) (step 6)
and [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) (steps 5–6). **These are the
only two of the eight that did not close, and this is why.**

**WHAT THE SOURCE REQUIRES — spec v19, verbatim:**

> **S10-R1:** filters are *"restored exactly as they were left"*
>
> **S10-R2:** filters are *"stored server-side and sync across devices"* — quoted from S13-R25's
> contrast clause, which exists precisely to distinguish filters from the search query

**And the case's own expectation 3:** *"The same filter selections are applied on the other computer
too — the filters are saved to your account, not to one computer or browser."*

**WHAT WAS OBSERVED (probeP9, the run built specifically to settle it):**

| | |
|---|---|
| profile 1 sets `Status : Declined` through the chip | chip reads **`Status : Declined`** |
| **the app saves it itself** | its own **`PUT /api/users/me/preferences/work-orders-list` → 200** |
| stored value | `{"status":["declined"]}` |
| profile 1 closed; **profile 2 = a separate chromium process**, localStorage holding only the three keys the harness injects | |
| **the app fetches the preference ITSELF** | **`GET /api/users/me/preferences/work-orders-list` → 200** |
| chip at **6 s / 12 s / 18 s / 25 s** | **`Status`** — no value, every time |
| after a **further reload in that same profile** | **`Status`** — still no value |
| stored value, re-read after the app had its chance | **still `{"status":["declined"]}`** |
| bridge errors · API 4xx | **0 · 0** |

**THE DECISIVE DATUM is the app's own `GET`.** It rules out the obvious harness explanation: the
application **had the saved value available to it** and did not apply it. The repeated sampling rules
out a slow restore, and the same-profile reload rules out "fresh profiles only".

**WHY IT IS STILL NOT REPORTED AS A DEFECT — and this is the whole point of recording it this way.**
**finish3 observed the OPPOSITE on this same build**, verbatim from its own `RUNNABILITY.md`:

> *"**Steps 3–4 driven properly**: a filter set through the chip, **the browser process closed
> entirely**, a brand-new browser opened → **`Status : Declined`** came back."*

Step 3–4's mechanism (close the browser, open a new one) is **the same mechanism** as step 6's
different profile. Same build marker, same harness, opposite results. **One of the two observations
is wrong or a condition differs, and I have not identified which.** Filter persistence is where
**SV-8871** and **SV-8905** already live, this pass has **already produced one false alarm on exactly
this ground** (`RUNNABILITY.md` §3), and it is the evening before a release. **So: recorded as NOT
ESTABLISHED, with both observations quoted, rather than filed as a defect.**

**WHAT WOULD SETTLE IT — one focused re-run, ~15 minutes:**

1. Set a filter through the chip. Confirm the app's own `PUT` → 200 and the stored value.
2. Open a fresh profile. **Capture whether the app applies it**, sampling to 25 s.
3. Repeat **without any prior forced `PUT`** of `filters: []` anywhere in the sequence — that is the
   one deliberate difference between my run and finish3's, and the likeliest confound.
4. If it still does not restore, **that is a real defect against S10-R1/S10-R2** and needs a ticket
   the moment the creation hold lifts.

**Nothing was filed. The creation hold stands.**

---

## 4 · WHAT WAS *NOT* TREATED AS A DIVERGENCE, AND WHY

Recorded so a deliberate non-finding cannot later look like a miss (Rule 46).

| candidate | why it is not reported |
|---|---|
| **The preference not updating when a filter was applied** | **Ours.** From a proven-clean baseline it saves correctly. State my own earlier probe left behind. `RUNNABILITY.md` §3. |
| **"No empty state from Asset on Site"** | **Ours.** Wrong chip id (`filter_chip_vehicle` for `filter_chip_vehicleHere`), so nothing was ever clicked. |
| **"The technician filter returns HTTP 400"** | **Ours.** Wrong field name (`lead_technician_id` for `tech_assigned_id`). |
| **"Only one customer ticked when two were selected"** | **Ours.** A leftover search term left one option row in the DOM. |
| **"Scrolling reveals no further results"** | **Ours.** Virtual scroll recycles rows; we scrolled `window` instead of the table's own container. |
| **Purchase Orders / Timesheet Activities showing 3–4 un-collapsed icon buttons** | **Our detector is over-inclusive** — it counted app-header chrome as table-toolbar buttons. finish3's narrower reading stands and the case's expectation 7 already tells a tester to mark BLOCKED there. |
| **C29568's tag not truncating** | Real and measured, but **not a build defect** — the spec requires no ellipsis. It is §1, a defect in our case. |

---

## 5 · AUTOMATED CASES AFFECTED

**None.** All six cases written carry `custom_atmstatus = 1` (Not Automated), captured at write
time. See `AUTOMATED-CASES-CHANGED.md` — including the near miss that **C29614 carries
`custom_atmstatus = 3`** and would have needed reporting to Vlad had it been completed.
