# Filters — Questions for Branko (and one for the developers) — 2026-07-29

Plain-language product questions raised by the engineering plan for the filter
redesign. Please pick A or B (or write your own answer). No technical knowledge
needed. (QA mapping to test cases is at the bottom, in the QA-only section —
readers can ignore it.)

**Status 2026-07-30: Q1 RESOLVED by user ruling (see below) — 6 questions remain
open for Branko (Q2–Q6 A/B + the Q7 spec v1.3 export request).**

---

**Question 1 — The Status filter on the Estimates and Completed tabs**

**✅ RESOLVED by user ruling 2026-07-30 — no answer needed from Branko.**
User ruling (verbatim): *"Status chip is hidden on certain tabs = greyed-out/disabled"*
— i.e. the tech plan's "hidden" wording and Branko's earlier answer
"greyed-out/disabled" describe the SAME behavior: on the tabs where the Status
filter doesn't apply (Estimates/Completed), the pre-filled Status chip shows
greyed-out/disabled. The engineering plan's phrasing is NOT a different behavior.
**Consequence:** cases FLT-TAB-02 (C29609
https://shopview.testrail.io/index.php?/cases/view/29609) and FLT-TAB-03 (C29610
https://shopview.testrail.io/index.php?/cases/view/29610) remain CORRECT as
pushed — greyed-out/disabled pre-filled chip; no case change, no TestRail write
needed.

<details><summary>Original question (kept for the record — do not answer)</summary>

What happens now (two different answers exist): You told us earlier (July 17)
that on the Estimates and Completed tabs the Status filter button should be
SHOWN, greyed out and pre-filled (for example "Status: Estimate"), just not
clickable. The engineering plan, following the spec text, is building it
HIDDEN on those tabs instead — no Status button at all.

The question: On the Estimates and Completed tabs, should the Status button be:

- **A)** Shown greyed-out and pre-filled, but not clickable (your July 17 answer)
- **B)** Hidden completely (what engineering is building)

Answer: ______________________________________________

</details>

---

**Question 2 — Opening someone else's filtered link**

What happens now: A teammate can send a link that opens the Work Orders page
with certain filters. Engineering is building it so the link is a TEMPORARY
view: it never replaces the filters you saved for yourself, and a small
"back to my saved filters" option brings your own filters back. One sentence
in the spec says the opposite (the link's filters would become your saved ones).

The question: When I open someone's filtered link, should it:

- **A)** Show their view temporarily and leave MY saved filters untouched
  (what engineering is building — and what you reportedly agreed in the page
  comments)
- **B)** Replace my saved filters with the link's filters

Answer: ______________________________________________

---

**Question 3 — The "Imported" status**

What happens now: Imported work orders live in a separate list behind the
scenes. Engineering is building the Imported choice so it works ALONE: when you
pick Imported, the other filter buttons (Customer, Lead Technician, Service
Advisor, Asset on site) grey out and cannot be combined with it. The spec lists
Imported as a normal status like any other.

The question: Should picking "Imported" work alone and grey out the other
filters?

- **A)** Yes — Imported works alone (what engineering is building; combining it
  is not technically possible today)
- **B)** No — I expected it to combine like the other statuses (this would need
  extra engineering work)

Answer: ______________________________________________

---

**Question 4 — Mobile: single filter windows**

What happens now: On a phone, tapping one filter button opens a small window
from the bottom. The designs show an "Apply filter" button in that window; the
engineering plan makes single-filter windows apply INSTANTLY as you tick
(no button) — only the combined "All Filters" window keeps an "Apply filters"
button.

The question: In the single-filter window on a phone, should choices apply:

- **A)** Instantly as you tick, no Apply button (engineering plan)
- **B)** Only after tapping an "Apply filter" button (as the designs show)

Answer: ______________________________________________

---

**Question 5 — Which tab opens first**

What happens now: Engineering decided that the very FIRST time someone opens
the redesigned Work Orders page, the ESTIMATES tab is selected (even though
"All" is the first tab in the row). After that, the page always reopens on the
tab you used last. This was decided for speed/load reasons and is not written
in the product spec.

The question: Is Estimates the right tab to open first for a brand-new visit?

- **A)** Yes — Estimates first is fine
- **B)** No — it should open on All (please note: engineering chose Estimates
  to keep the heaviest list off the landing page; picking B needs a talk with
  them)

Answer: ______________________________________________

---

**Question 6 — The Parts "Vendors" page filters**

What happens now: The spec lists a Vendors view among the Parts pages that get
filters, but engineering could not find a design for it and will not build its
filters until a design exists. They have requested the design.

The question: Please confirm the Vendors page IS meant to get filters, and have
the design added — or tell us it is out of scope.

- **A)** Vendors gets filters — design coming
- **B)** Vendors is out of scope for now

Answer: ______________________________________________

---

**Question 7 — The updated spec document (request, not a choice)**

The engineering plan tells us the Filters spec on Confluence is now at
version 1.3 and covers much more than the copy we have: the Parts page
filters, the Reports page filters, a new date-range filter, the new in-page
Search box (23 requirements), and the change where the top navigation search
stops filtering page lists. Our copy is version 1.0.

**Please share the current spec** (an export of the Confluence page
"Filters" — the same way as before), so we can bring all the test cases in
line with it. This also covers the PRD update we asked for on July 17 —
it looks like it already exists as spec v1.3.

---

---

## QA-ONLY section (internal mapping — not for the PO)

| Q | Deltas ref | Cases affected | TestRail |
|---|---|---|---|
| Q1 | C3 (G9 vs Branko Q4=B) — **RESOLVED by user ruling 2026-07-30 (hidden == greyed-out/disabled)** | FLT-TAB-02, FLT-TAB-03 | C29609 https://shopview.testrail.io/index.php?/cases/view/29609 · C29610 https://shopview.testrail.io/index.php?/cases/view/29610 stand as pushed — no case change, no TestRail write |
| Q2 | C1 (G7 runtime-only) | FLT-URL-02 (C29618 https://shopview.testrail.io/index.php?/cases/view/29618), FLT-URL-05 (new, no C-ID yet), FLT-PSRCH-04 (new, no C-ID yet) |
| Q3 | C2 (G1 Imported exclusivity) | FLT-STAT-03 (C29562 https://shopview.testrail.io/index.php?/cases/view/29562), FLT-STAT-07 (new, no C-ID yet) |
| Q4 | C4 (D15 vs design) | FLT-MOB-04 (C29624 https://shopview.testrail.io/index.php?/cases/view/29624) |
| Q5 | C5 (D10 default tab) | FLT-TAB-06 (new, no C-ID yet) |
| Q6 | C7 (Vendors design missing) | FLT-PARTS-08 (new, no C-ID yet) |
| Q7 | C9 (spec v1.3 drift) | whole suite — triggers a SPEC-RELEVANCE-RECONCILIATION run (Rule 11 ask first); also settles C6/C8 (page-search ownership → FLT-SRCH-01..09 transfer/retire; query-per-tab) |


> **QA-INTERNAL NOTE — USER RULING 2026-07-31 (page-search ownership).** Verbatim: *"OK do not delete those cases unless Branko confirms that they are related to Global search only."* The nine page-search cases **FLT-SRCH-01..09** (new, no C-IDs yet — none is in TestRail) **STAY in the Filters suite** unless Branko confirms Global-Search-only ownership; **his answer decides move-vs-keep.** Do NOT delete or transfer them before that. Note on numbering: in THIS sheet Q6 is the *Vendors design* question and the page-search-ownership item rides on the Q7 / C6-C8 row above; the reader-facing search/ownership question the ruling refers to is **Question 6 of `../PO-Questions-Branko-PartsReports-2026-07-27.md`** ("The pop-up search box"). The 2026-07-31 Ruthless Usefulness Audit's CUT recommendation for all nine (and its NONSENSE verdict on FLT-SRCH-09) is a RECOMMENDATION ONLY, re-tabled on his answer.

Verify the C-ids for Q2/Q3/Q4 rows against `build/filters/testrail-id-map.csv`
before sending anything that quotes them.
