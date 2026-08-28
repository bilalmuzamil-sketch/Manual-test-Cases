# Estate-Wide Case-Body Damage Sweep — 2026-08-28

**Pass type: DETECTION ONLY. No TestRail writes were made.** No `add_case`, no `update_case`, no run
or result writes. Repairs are held until the QA lead has seen this list.

**Machine-readable companion:** `RESULTS.csv` (433 rows, one per damaged/suspect **field**, with
`case_id · class · severity · project · section · field · history_evidence · damaged_by · damaged_on ·
field_format · title · url`).

---

## 1 · Headline

| | |
|---|---|
| **Confirmed damaged cases** | **19** |
| — escaped-tag damage | **2** (both Custom Roles) |
| — flattened | **17** (all Schedule) |
| Suspect, needs a human look | **174** (8 high-priority, 166 low) |
| Ruled out — legacy authoring, **not** damage | **209** |
| **Calibration against the rendered page** | **10 of 10 true positives** |

**The 17 flattened cases were all damaged on the same day, 2026-08-20, all in the Schedule project, all
in the Expected Results field, all by us (TestRail user 3, Bilal Muzamil).** That is one pass, one
project, one field — a bounded blast radius, not estate-wide rot.

**The good news the sweep can state positively:** Report Suite, Filters, Global Search, Simple Flow and
Fees & Discounts have **zero** confirmed damaged cases. **C30457**, the case that prompted this sweep,
**currently renders correctly** — its Expected Results carries proper `<br>` separators, so the
flattening it once had has already been repaired.

---

## 2 · Scope actually scanned — the paging proof

`get_cases` and `get_sections` were both **fully paged** (`limit=250` with an incrementing `offset`,
looping until a short page or an absent `_links.next`). An unpaged call silently returns 250 sections
and finds zero cases in most projects — that trap was avoided.

| | Count |
|---|---|
| Sections fetched (fully paged) | **684** |
| Cases fetched (fully paged) | **4,584** |
| **Our cases (`created_by = 3`) — the sweep population** | **2,739** |
| Case-history calls made (`get_history_for_case`, one per our case, paged `limit=250`) | **2,739** |

**Every one of our 2,739 cases was scanned, and every one had its full edit history pulled** — the
sweep is a census, not a sample.

### Cases scanned per project

| Project | Our cases scanned | Root/branch used to attribute it |
|---|---|---|
| Custom Roles | **515** | section 3527 *Custom Roles - (Revised)* |
| Report Suite | **513** | section 4281 *Reports Suite* |
| Fees & Discounts | **200** | section 3894 *Fees & Discounts* |
| Schedule | **195** | *Test Cases > Schedule* (35) |
| Simple Flow | **185** | *Test Cases > Simple Flow* (4058) |
| Filters | **124** | section 4110 *Filters - (2026)* |
| Global Search | **118** | *Test Cases > Global Search* (49) |
| **Other / unlisted** | **889** | Work Orders, Parts, Administration, Digital Inspections, Invoice Refresh, Simple Flow V2, ShopCoach 2.0 etc. |
| **TOTAL** | **2,739** | |

The seven named projects account for 1,850 of our cases; the remaining **889 were swept as well** so
that the answer is genuinely estate-wide. Note the counts differ from the CLAUDE.md index in two
places — **Report Suite 513 (index says 509)** and **Global Search 118 (index says 86)** — because
these were re-derived live today. The others match the index exactly.

---

## 3 · The detection rules — stated exactly, so the count can be trusted

### 3.1 Escaped-tag damage

A field is **ESCAPED-TAG** if it contains an HTML-entity-escaped tag — `&lt;` … `&gt;` wrapping a
**known HTML tag name** (`p`, `br`, `li`, `ul`, `ol`, `div`, `strong`, `em`, `b`, `i`, `span`, `table`,
`tr`, `td`). The tester sees the literal characters `<p>` on screen.

**Two deliberate exclusions, both verified by hand:**

- **`&gt;` on its own is NOT damage.** 23 fields contain it, almost all in navigation breadcrumbs such
  as *"Administration &gt; QuickBooks integration"*, which renders correctly as `>`. Counting these
  would have inflated the escaped-tag class from 2 to 22.
- **`&lt;entity&gt;`-style prose placeholders are NOT damage.** C44826 contains
  *"Showing N &lt;entity&gt; matching &laquo;query&raquo;"* — the tester is **meant** to see
  `<entity>` as a placeholder. `entity` is not an HTML tag name, so the rule correctly leaves it alone.

### 3.2 Flattened

A field is **FLATTENED** if **both** hold:

1. **A single unbroken block runs an enumerated list together.** The field is split on every construct
   that puts following text on a new line for the tester — `<br>`, `<p>`/`</p>`, `<li>`/`</li>`,
   `<ul>`/`<ol>`/`<div>`/`<tr>`/`<h1-6>`, and literal newlines. Within one resulting block, the
   enumeration markers are collected (`N.` followed by whitespace, at start-of-block or after
   whitespace/`;`/`:`). The block counts as flattened **only if its first two markers are `1.` then
   `2.`, in that order.**
2. **The field contains HTML markup** (`<p>`, `<br>`, `<li>`, `<ul>`, `<ol>`, `<div>`, `<strong>`,
   `<em>`) — i.e. it belongs to our modern authored style, so line breaks are something it once had and
   has lost.

**Why the rule is deliberately this narrow — three conservatism guards:**

- **Requiring the run to start `1.` then `2.`** rejects decimals (`3.5`), version strings (`v1.8`) and
  stray sentence-final numerals. A genuine flattened list always opens `1. … 2. …`.
- **Dropping the `N)` marker form** removed a real false positive: C30606 reads
  *"…the live report (Story 2) — …"*, whose `2)` paired with a leading `1.` to fake a flattened list.
  Only the `N.` form is now counted.
- **Requiring HTML markup (guard 2)** is what separates damage from legacy authoring — see §5.

**A genuinely single-sentence field is never counted.** One sentence has no `1.`/`2.` run and cannot
match.

### 3.3 Suspect

A field is **SUSPECT** if its edit history proves separators were lost — some edit had an `old_value`
containing `<br>`/`<li>`/`<ul>`/`<ol>`/newline and a `new_value` containing none — **but** the current
content shows no run-together enumeration. Sub-ranked:

- **SUSPECT-HIGH** — a surviving block of **≥250 characters with ≥3 sentences**: long enough that lost
  breaks would actually hurt a tester. **8 cases.**
- **SUSPECT-LOW** — the field is now short or genuinely one sentence, so the lost separator most likely
  reflects a legitimate rewrite rather than damage. **166 cases.**

---

## 4 · Calibration against the rendered page

The API returns raw field text; a tester reads TestRail's rendered case page. To prove the detector
matches what a tester actually sees, a UI session was opened and **the rendered HTML of the case page
was fetched and parsed** — extracting each body field's container and the visible text after
converting `<br>`/`</p>`/`</li>` to real line breaks and stripping tags.

This immediately reproduced **the exact container signature described in the brief**: on C29946 the
page carries **three `markdown fr-view` containers and two bare `markdown` containers**.

### Result: 10 of 10 sampled hits were true positives

| Case | Class | What the rendered page shows |
|---|---|---|
| C29946 | FLATTENED | Expected renders as **1 line**: *"1. All applied filters are removed at once. 2. The full work order list is shown again. 3. The active-count badge … --- This is the expected behaviour"* — while Preconditions and Steps render correctly on 2 lines each |
| C29948 | FLATTENED | Expected renders as 1 run-together line |
| C29953 | FLATTENED | Expected renders as 1 run-together line |
| C30016 | FLATTENED | Expected renders as 1 run-together line |
| C30034 | FLATTENED | Expected renders as 1 run-together line |
| C30052 | FLATTENED | Expected renders as 1 run-together line |
| C30071 | FLATTENED | Expected renders as 1 run-together line |
| C38872 | FLATTENED | Expected renders as 1 run-together line |
| C26427 | ESCAPED-TAG | Tester literally sees `<p>Send to Terminal is shown for User B…</p>` as text |
| C26489 | ESCAPED-TAG | Tester literally sees `<p>This toggle applies to work orders only…</p>` as text |

**Calibration verdict: 10/10 — no false positives in the two reported damage classes.**

**The 8 SUSPECT-HIGH cases were also all render-checked, and all 8 rendered CLEAN** (C29969, C30133,
C30162, C30181, C30190, C30287, C38918, C30526). That is why they are reported as *suspect*, not as
damaged. C30133 is instructive: it looked flattened to a looser rule only because its own item 5 quotes
*"you do not need any tool for item 4. Just say whether…"*. Its raw body has correct `<br>` separators
throughout and it renders on 8 separate lines. The strict `1.`-then-`2.` rule of §3.2 correctly never
flagged it.

---

## 5 · What the sweep ruled OUT — 209 cases that are not damage

209 cases (C22179–C22443, in *Work Orders* and *Parts*) contain terse plain-text steps such as
*"1. Open invoice. 2. Inspect Payments section."* — enumerations on one line, with **no HTML markup at
all**.

**These are not damage. They were authored that way.** The proof is from history, not inference: across
all 209 cases the **only fields ever edited are `custom_atmstatus` (156 edits) and `priority_id` (21
edits)**, all by Vladimir Tomovic — **their bodies have never been touched since creation**. Nothing was
lost because nothing was ever there.

They are listed in `RESULTS.csv` as `LEGACY-TERSE (not damage)` so the QA lead can see the detector
found them and consciously excluded them. Had guard 2 of §3.2 been omitted, the flattened count would
have been reported as **226 instead of 17** — a 13× overstatement.

---

## 6 · The C-id lists

### 6.1 ESCAPED-TAG DAMAGE — 2 cases (full list)

| C-id | Project | Field | Damaged on | Damaged by | Link |
|---|---|---|---|---|---|
| **C26427** | Custom Roles | Expected | 2026-07-20 | **US** (user 3, Bilal Muzamil) | https://shopview.testrail.io/index.php?/cases/view/26427 |
| **C26489** | Custom Roles | Expected | 2026-07-20 | **US** (user 3, Bilal Muzamil) | https://shopview.testrail.io/index.php?/cases/view/26489 |

Both are *Custom Roles* cases, both damaged the same day, both in Expected Results, both by us. In each
the tester sees a literal `<p>…</p>` block appended after a correctly-rendered first sentence.

### 6.2 FLATTENED — 17 cases (full list)

**All 17: project Schedule · field Expected Results · damaged 2026-08-20 · damaged by US (TestRail
user 3, Bilal Muzamil) · stored field format `markdown`.**

C29946, C29948, C29950, C29951, C29952, C29953, C29954, C29955, C29963, C30008, C30016, C30034, C30052,
C30057, C30066, C30071, C38872

| C-id | Title | Link |
|---|---|---|
| C29946 | 'Clear all' resets every applied sidebar filter in one click | https://shopview.testrail.io/index.php?/cases/view/29946 |
| C29948 | Work order card opens the line drill-down in place, with header | https://shopview.testrail.io/index.php?/cases/view/29948 |
| C29950 | Only approved work order lines appear in the drill-down | https://shopview.testrail.io/index.php?/cases/view/29950 |
| C29951 | Line row shows title, hours, the technician roster and a date | https://shopview.testrail.io/index.php?/cases/view/29951 |
| C29952 | Lines with no technician assigned show a 'Needs techs' badge | https://shopview.testrail.io/index.php?/cases/view/29952 |
| C29953 | 'Search lines' matches the line title/name only | https://shopview.testrail.io/index.php?/cases/view/29953 |
| C29954 | 'All / Unscheduled' filter chips show counts and filter the list | https://shopview.testrail.io/index.php?/cases/view/29954 |
| **C29955** | Dropping a single-line work order creates a shift with no scope picker — **⚠ FLAGGED AUTOMATED** | https://shopview.testrail.io/index.php?/cases/view/29955 |
| C29963 | Scope picker contents: the pinned whole-order row and the lines | https://shopview.testrail.io/index.php?/cases/view/29963 |
| C30008 | Clicking a shift opens its detail modal, with VIN always visible | https://shopview.testrail.io/index.php?/cases/view/30008 |
| C30016 | Create an event via left-click 'Create Event' on empty grid | https://shopview.testrail.io/index.php?/cases/view/30016 |
| C30034 | Shift hover tooltip shows the full shift summary incl. up to N | https://shopview.testrail.io/index.php?/cases/view/30034 |
| C30052 | Dragging a shift to another technician row reassigns it | https://shopview.testrail.io/index.php?/cases/view/30052 |
| C30057 | Deleting a middle shift of a series offers all three scopes | https://shopview.testrail.io/index.php?/cases/view/30057 |
| C30066 | Escape closes the topmost open modal or popover, following order | https://shopview.testrail.io/index.php?/cases/view/30066 |
| C30071 | Blue is the default color for all shifts, including long ones | https://shopview.testrail.io/index.php?/cases/view/30071 |
| C38872 | API - Schedule reads need View; writes need Edit; deletes need | https://shopview.testrail.io/index.php?/cases/view/38872 |

**🔴 Rule 65 / Rule 71 — C29955 is flagged Automated in TestRail** (`custom_automation_type = 1`). It is
the only Automated case in the damaged set. Under Rule 71 it must **not** be changed without the QA
lead's explicit go-ahead, and under Rule 65 Vlad must be told if any pass changes it. **It is
read-assessed and held.** The other 18 damaged cases are all `custom_automation_type = 0`.

### 6.3 SUSPECT-HIGH — 8 cases (full list, all render-checked CLEAN)

| C-id | Project | Field | Separators lost on | By | Render check |
|---|---|---|---|---|---|
| C29969 | Schedule | Expected | 2026-08-20 | US | clean |
| C30133 | Report Suite | Expected | 2026-08-19 | US | clean |
| C30162 | Report Suite | Expected | 2026-08-20 | US | clean |
| C30181 | Report Suite | Preconditions | 2026-07-29 | US | clean |
| C30190 | Report Suite | Preconditions | 2026-07-30 | US | clean |
| C30287 | Report Suite | Expected | 2026-08-20 | US | clean |
| C38918 | Report Suite | Preconditions | 2026-08-20 | US | clean |
| C30526 | Report Suite | Expected | 2026-08-28 | US | clean |

### 6.4 SUSPECT-LOW — 166 cases (exceeds 60; first 60 listed, full list in `RESULTS.csv`)

Per project: Report Suite 89 · Custom Roles 29 · Fees & Discounts 27 · Filters 7 · Schedule 7 ·
Other 5 · Simple Flow 2.

C19283, C19284, C19286, C22329, C26323, C26354, C26387, C26419, C26422, C26431, C26459, C26471, C26488,
C26493, C26496, C26497, C26498, C26506, C26550, C26551, C27764, C27777, C27778, C27790, C27802, C27803,
C27827, C27828, C27853, C27854, C27870, C28436, C28437, C28493, C28496, C28497, C28501, C28502, C28503,
C28504, C28505, C28506, C28510, C28512, C28513, C28517, C28522, C28524, C28525, C28526, C28528, C28532,
C28542, C28557, C28560, C28561, C28562, C28591, C29293, C29411

**… and 106 more — total 166. Full list: `build/report-suite/damage-sweep-2026-08-28/RESULTS.csv`,
filter `class_full = SUSPECT-LOW`.**

### 6.5 LEGACY-TERSE — 209 cases, NOT damage (see §5)

Range C22179–C22443. Full list in `RESULTS.csv`, filter `class_full = LEGACY-TERSE (not damage)`.

---

## 7 · Counts by project and class

| Project | Escaped-tag | Flattened | Suspect-HIGH | Suspect-LOW | Legacy (not damage) | **Confirmed damaged** |
|---|---|---|---|---|---|---|
| Schedule | 0 | **17** | 1 | 7 | 0 | **17** |
| Custom Roles | **2** | 0 | 0 | 29 | 0 | **2** |
| Report Suite | 0 | 0 | 7 | 89 | 0 | **0** |
| Fees & Discounts | 0 | 0 | 0 | 27 | 0 | **0** |
| Filters | 0 | 0 | 0 | 7 | 0 | **0** |
| Simple Flow | 0 | 0 | 0 | 2 | 0 | **0** |
| Global Search | 0 | 0 | 0 | 0 | 0 | **0** |
| Other / unlisted | 0 | 0 | 0 | 5 | 209 | **0** |
| **TOTAL** | **2** | **17** | **8** | **166** | **209** | **19** |

---

## 8 · Us or a foreign editor?

Attribution is taken from `get_history_for_case`, which records the editing `user_id` on the change
that lost the separators or introduced the escaped text. TestRail user ids resolve as: **3 = Bilal
Muzamil (us)**; **1 = Vladimir Tomovic**, **4 = Viktoria Videnovic**, **7 = Ahtasham Amjad** (foreign).

| Class | By US | By a foreign editor | UNKNOWN |
|---|---|---|---|
| Escaped-tag (2) | **2** | 0 | 0 |
| Flattened (17) | **17** | 0 | 0 |
| Suspect (174 cases / 205 fields) | 181 fields | 24 fields | 0 |

**Every one of the 19 confirmed damaged cases was damaged by US, not by a foreign editor.** History
covered all 19, so **no UNKNOWN is being reported and nothing has been guessed**.

The 24 foreign-edited suspect fields all fall in SUSPECT-LOW: 20 by Vladimir Tomovic, 3 by Ahtasham
Amjad, 1 by Viktoria Videnovic, spread across
C19283, C19284, C19286, C26354, C26419, C26422, C26471, C26493, C29293, C29558, C29560, C29600, C38847,
C38848, C38849, C38850, C43811, C43845, C45088. **Under Rule 38 these are hands-off — reported, never
edited** — and none of them is confirmed damaged.

Where history could not have established authorship it would have been reported as UNKNOWN; that did
not occur, because the history call was made for **all 2,739** of our cases.

---

## 9 · What this means, and what a repair would involve

The damage is **narrow and dated**: a single Schedule pass on **2026-08-20** flattened the Expected
Results of 17 cases, and a single Custom Roles pass on **2026-07-20** escaped HTML into 2. Both were
ours. All 19 are the same shape — one body field, recoverable.

**The repair material already exists.** `get_history_for_case` returns the full `old_value` for every
change, so for each of the 19 the pre-damage body text is available verbatim; the fix is a re-render of
known-good content, not a re-authoring from the spec. Note that **Rule 41 applies — touching a case
means re-verifying the whole case**, so this is a sized pass, and **Rule 87** is confirmed working:
history *is* the authoritative per-field record, and nothing here was unreconstructable.

**No repair has been attempted. Nothing was written.**

---

## OUTSTANDING — what I need from you

1. **Go-ahead to repair the 19 confirmed damaged cases** (2 escaped-tag + 17 flattened), restoring each
   Expected Results field from the pre-damage `old_value` in its own TestRail history. Rule 62's hold is
   Jira tickets only and does not block `update_case`, but this pass was ordered detection-only, so
   nothing was written and I am holding for your word.
2. **A separate decision on C29955** — it is **flagged Automated**, so under Rule 71 it needs your
   explicit go-ahead even if you approve the other 18, and under Rule 65 Vlad should be told. Please
   confirm whether to include it or leave it damaged for now.
3. **Whether you want the 166 SUSPECT-LOW cases triaged at all.** All 8 SUSPECT-HIGH were render-checked
   and are clean, so my recommendation is to close SUSPECT-LOW without further spend unless you want a
   sample checked — but that is your call, not mine.
4. **Confirmation of two case-count corrections for the CLAUDE.md project index**, re-derived live
   today: **Report Suite 513** (index says 509) and **Global Search 118** (index says 86). The other
   five projects match the index exactly.
