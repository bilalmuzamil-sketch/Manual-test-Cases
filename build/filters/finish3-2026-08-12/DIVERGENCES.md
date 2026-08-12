# Filters — divergences (finish3), 2026-08-12

**Build `v3.7-20e801b`, read at 13:44:12Z and 15:13:51Z, byte-identical.** Every entry quotes both
texts and names the affected case with its C-id and link.

> **THIS FILE IS NOT EMPTY.**
> **0 COSMETIC step corrections** — every one of the 65 cases walked this pass was runnable exactly
> as written. No step sent a tester to a control that was not where the step said it was.
> **1 SUBSTANTIVE divergence — a precondition that CANNOT be met on this branch (C38876).**
> **4 build behaviours recorded against cases that are CORRECT and should FAIL** — left asserting
> their source deliberately, because a hold on a working case disarms it.
> **1 case-text defect OF OUR OWN, reported and NOT rewritten (C29625).**
> **1 question that could not be answered either way, recorded as not established (C29568).**
> **1 coverage gap that CANNOT be authored, with the reason (the C29603 / Parts-Reports gap).**

---

## 1 · THE CATEGORY QUESTION, ANSWERED FOR EVERY CASE WALKED

The test is *would a reader of the source recognise what the build offers as the same thing?*

For all **65** fully-walked cases the answer was **yes** on the route: every precondition was
reachable, every navigation path existed, every named control sat where the step said it was, the
steps worked in the order written, and the labels matched what the tester reads. **So nothing was
rewritten, and nothing needed to be.**

**One near-miss is worth naming, because it would have been a correction INTO being wrong:** a
`textContent`-only read of the Status chip says it has no leading icon, which would have made
C29558's expectation 3 look unmet. The icon is an **18 × 18 SVG** with no ligature text. Measured
before anything was written.

---

## 2 · C38897 — THE ONE UNTICKETED REAL DEVIATION, NOW RE-CONFIRMED WITH ALL FOUR STEPS DRIVEN

**[C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** — *"When filters and a search
find nothing, each can be cleared on its own"*. Spec anchors on the case: **S8-R3, S8-R4, S8-R5,
S13-N1, S13-N2** (spec v19).

**WHAT THE CASE REQUIRES:**

> *"1. The table is replaced by a no-results message that mentions BOTH the current filters and the
> search — not the filters alone. 2. The message offers a way to clear the filters and, because a
> search is active, a separate way to clear the search. … 4. Clearing the filters leaves your typed
> word in the box and still applied — each is cleared on its own without wiping the other."*

**WHAT THE BUILD DID** (status `invoiced` applied through the chip, then `zzzznomatchzzz` typed —
the word verified present in the field, so the check could fail):

| Required | Observed |
|---|---|
| the message mentions **both** the filters and the search | **"No work orders match your filters"** — **filters alone**, no mention of the search |
| the **message** offers a way to clear the filters **and** a separate way to clear the search | the message offers **`empty_state_clear_filters`** ("Clear Filters") **only**. A search clear exists (`page_search_clear`, the round **x**) but it is in the **toolbar**, not in the message |
| **3.** clearing the search brings back the filtered list, filter still on | **MET** — `?status=invoiced`, 33 rows, chip still `Status : Invoiced` ✓ |
| **4.** clearing the filters **leaves your typed word in the box and still applied** | **NOT MET** — clicking Clear Filters gave `?tab=all` with **`search=` gone from the URL and the box empty**. The search was wiped along with the filters |

**Expectation 3 passes; expectations 1 and 4 do not, and 2 only partly.** **This case is CORRECT and
is left asserting its source, so the tester fails it.** It remains the project's **only unticketed
real deviation** and it needs a ticket the moment the creation hold lifts — its ready-to-file text
is in `DEFECTS-READY-TO-FILE.md`.

---

## 3 · C29623 — THE PHONE SHEET'S TITLE CARRIES NO COUNT

**[C29623](https://shopview.testrail.io/index.php?/cases/view/29623)**, expectation 3:

> *"3. The reopened sheet's title shows the applied-filter count, for example 'All Filters (1)'…"*

**WHAT THE BUILD DID** at 390 × 844, with two statuses applied: the reopened sheet's title reads
**`All Filters`** with **no count**. The count is on the **chip** on the bar, which reads
**`All Filters (1)`**. So the figure the case asks for exists — on a different control.

**Everything else in the case passes**, including the part that matters most: ticking two statuses
inside the combined sheet left the address bar at `?tab=all` and the list at 30 work orders, and only
**`Apply Filters`** applied them (18 work orders). **Left asserting the source; the tester's verdict
is theirs.**

---

## 4 · C29625 — A DEFECT IN OUR OWN CASE TEXT: ITS EXPECT-FAIL NOTE DESCRIBES THE WRONG SHEET

**[C29625](https://shopview.testrail.io/index.php?/cases/view/29625)** — *"Mobile Customer filter has
search, multi-select and removable tags"*.

**ITS PRECONDITION, verbatim:** *"3. The All Filters sheet is open with the Customer accordion
expanded."*

**ITS EXPECT-FAIL NOTE, verbatim:** *"What you should see today: the Customer sheet does have a
Search box, but it applies your choice the moment you tap a name — the address bar changes at once,
the list reloads and the sheet closes — so you cannot pick a second customer, there are no removable
tags, and there is no 'Apply filters' button."*

**WHAT THE BUILD DID ON THE PATH THE PRECONDITION SETS UP — all four steps driven:**

| Step | Observed |
|---|---|
| 1 — type in the Search field | `Aa` narrowed the section to **30** matching names; placeholder **`Search`** |
| 2 — select two or three | **three** selected, every click registered, **the sheet stayed open and the address bar did not change** |
| 3 — look at the input area and the rows | three **tags with remove icons**, three rows carrying a **check** glyph |
| 4 — remove one tag, then Apply | removing *Aason Works* deselected **only** that one (the other two kept their checks); **`Apply Filters`** then sent the two survivors: `?company_id=215096e5…&company_id=25b9c36d…` |

**So the case's four expectations are MET, and its own note contradicts them.** The note is accurate
about the **single-filter** sheet — the one you get by tapping the Customer *chip* directly, which is
the SV-8875 behaviour and which **C29624 confirms independently** — but that is **not** the sheet
this case's precondition opens.

**REPORTED, NOT REWRITTEN.** The note names a real ticket, and rewriting a tester-facing expect-fail
note hours before a release risks disarming a real signal. **Proposed replacement text is in
`CHANGES-MADE.md` for the QA lead's decision.** The tester marked this case **Passed**, which is
consistent with what the build actually does.

---

## 5 · C38876 — A SUBSTANTIVE DIVERGENCE: THE PRECONDITION CANNOT BE MET ON THIS BRANCH

**[C38876](https://shopview.testrail.io/index.php?/cases/view/38876)** — *"First visit opens the
Estimates tab; your last-used tab is remembered"*.

**ITS PRECONDITION, verbatim:** *"1. You can sign in as a user who has never used the redesigned Work
Orders page (no saved page choices for that account)."*

**WHY IT CANNOT BE MET, established rather than assumed:**

* **Both available sign-ins already carry saved page state.** The admin and the technician both return
  a populated `work-orders-list` preference.
* **The state cannot be cleared through the API.** `DELETE /api/users/me/preferences/work-orders-list`
  returns **HTTP 405** (method not allowed), and the preference was **byte-identical before and after**
  the attempt.
* Creating a genuinely fresh user is a **staff-record** operation, which is **barred on this branch** —
  such an edit destroys the session of every holder, and that is how the Schedule technician login was
  lost earlier today.

**THE CATEGORY TEST:** *would a reader of the source recognise what the build offers as the same
thing?* — **No.** The source requires a never-used account; the branch offers no way to produce one.
**So this is CATEGORY (b), SUBSTANTIVE, and it is NOT silently rewritten.**

**WHAT IS OWED, and it is the QA lead's call:** either a third sign-in that has never opened the
redesigned page, or a ruling that the case is `AUTOMATION: HOLD` for that reason. **No case text was
changed** — the case already carries a plain `AUTOMATION: READY` marker, and changing it to `HOLD`
without his ruling would remove it from the automatable count on our own initiative.

**Honest secondary observation, offered as a lead and NOT as a finding:** switching to the **All** tab
did **not** move the saved preference's `updatedAt` (the tab was already `all`, so there may have been
nothing to save). Whether the last-used tab is saved at all is **still not established** — the same
answer the previous pass reached, and for the same reason.

---

## 6 · C29568 — THE ELLIPSIS QUESTION, ANSWERED HONESTLY AS *NOT ESTABLISHED*

**[C29568](https://shopview.testrail.io/index.php?/cases/view/29568)**, expectation 3:

> *"3. Long customer names on tags are shortened with an ellipsis (for example 'Texas Truck And
> Aut...')."*

**THE SOURCE EXISTS, AND CHECKING SAVED US FROM "REPAIRING" A CORRECT CASE.** The spec anchors on
the case (`S3-R3`, `S3-R4`) say only *"each selected customer appears as a tag/chip at the top of the
dropdown input area"* and *"selected customers are indicated with a checkmark in the list"* —
**neither mentions truncation**, and the spec's only truncation wording (`S13-R8`) is about the search
field and says it *"neither grows nor truncates"*. On that alone the assertion looked unsourced. **But
the DESIGN specifies it** — `design-2026-07-31/BOARD-NOTES-12-2026-07-31.md` records
**`Texas Truck And Aut… ×` (truncated with an ellipsis)** — and since 2026-08-06 the design is an
authoritative source of expected behaviour (Rule 57 as amended). **So the case is properly sourced and
was left exactly as it is.**

**WHAT WAS OBSERVED**, with an **84-character** ZZAUTOTEST customer seeded specifically to test it
(the longest name already in the shop is 36 characters and renders in full, which proves nothing):

| Surface | Observed |
|---|---|
| the **tag** inside the dropdown | renders **all 84 characters**; `text-overflow: clip`, `overflow: visible`; **`scrollWidth == clientWidth` (587 = 587)**; chip **613 px** inside a **645 px** panel |
| the **chip on the bar** | **`ZZAUTOTEST Extr...`** — shortened, with an ellipsis |

**VERDICT: NOT ESTABLISHED, and deliberately not reported as a defect.** At 84 characters the tag
**still fits inside the panel**, so no truncation was required — the design's example may simply
reflect a narrower panel. To call this a defect one needs a name long enough to overflow 645 px, and
that was not produced. **Recording "not established" is the correct outcome; calling it a deviation
would have been a finding built on a case that never had to truncate.**

---

## 7 · THE C29603 COVERAGE GAP — WHY THE MISSING CASE CANNOT BE AUTHORED

Authoring was explicitly permitted for this gap. **It still should not be done, and the reason is a
source problem rather than a permission one.**

**[C29603](https://shopview.testrail.io/index.php?/cases/view/29603) PASSES and is marked Failed** —
established twice now, and this pass drove **both** directions with the saved flag **polled** rather
than read once: expanded → away → back = expanded; collapsed (`collapsed: true` genuinely saved) →
away → back = collapsed. The tester's own comment puts the fault on **Parts/Reports** pages, which
this case never touches.

**THE GAP IS REAL: no Filters case covers filter-bar collapse persistence on a Parts or Reports
page** — and the control genuinely exists there (`toggle_filter_bar` was observed on **Parts >
Inventory** and on **Reports > Sales Tax Collected** at 390 × 844 during this pass).

**BUT THERE IS NOTHING TO AUTHOR IT FROM:**

* **`S1-R7`** says *"The collapsed/expanded state of the filter bar persists across navigation"* with
  no page named — which looks page-agnostic **until you read its own section's prerequisites**.
* **Story 1's prerequisites, verbatim:** *"The user is on the Work Orders page"* / *"The user has
  access to the Work Orders page"*. So **S1-R7 is scoped to Work Orders** and does not reach Parts or
  Reports.
* **`S10-R1`** is likewise scoped to *"the Work Orders page"*.
* The Parts/Reports behaviour is exactly what **Branko's write-up still owes** — which is why **ten
  existing cases already sit on `AUTOMATION: HOLD - waiting on Branko's Parts and Reports product
  write-up"`**.

**So authoring this case would mean inventing the expectation, which Rules 57 and 58 forbid and Rule
64 makes a deletion candidate the moment anyone checks it.** **The gap is reported here instead**, and
it belongs with the same Branko dependency as the other ten. **If the QA lead wants a placeholder
authored now, it should carry `AUTOMATION: HOLD` citing that dependency — and that is his call, not
ours.**

---

## 8 · INHERITED AND STILL OWED

| Item | State |
|---|---|
| **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** needs a ticket | **Re-confirmed on `v3.7-20e801b` this pass with all four steps driven** (§2). Ready-to-file text prepared; **not filed** — the creation hold stands. |
| **[C38891](https://shopview.testrail.io/index.php?/cases/view/38891)** — ~42 surface names, two known wrong | Still owed as **one pass over all 42 surfaces**. `AUTOMATION: HOLD`; the tester has it Blocked, which is the correct outcome. |
| **[C29581](https://shopview.testrail.io/index.php?/cases/view/29581)** and **[C29588](https://shopview.testrail.io/index.php?/cases/view/29588)** | Need a **staff record deactivated**, barred for us on this branch. **Ordinary work for a tester with admin rights**, and flagged so nobody records them as unrunnable. |
| **[C43560](https://shopview.testrail.io/index.php?/cases/view/43560)** steps 5–6 | Expectations **1 and 2 now proven** (§ RUNNABILITY). Steps 5–6 still not established. |
| The **18 `AUTOMATION: HOLD`** cases | Unchanged. 10 wait on Branko's Parts/Reports write-up, and the rest on the things named in `COMPLETION-REPORT.md`. |

---

## 9 · RAISED TO THE QA LEAD

1. **[C38876](https://shopview.testrail.io/index.php?/cases/view/38876)'s precondition cannot be met
   on this branch** — the substantive divergence at §5. Needs either a never-used sign-in or a ruling.
2. **[C29625](https://shopview.testrail.io/index.php?/cases/view/29625)'s expect-fail note describes
   the wrong sheet** (§4). Evidence and proposed wording ready; **not rewritten**.
3. **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897) still needs a ticket** (§2).
4. **The Parts/Reports collapse-persistence gap cannot be authored without Branko's write-up** (§7).
5. **A robustness observation, offered as an aside and API-only under Rule 51's reachability test:**
   writing a `filters` value the SPA cannot parse into a user's saved preference **stops it saving
   filter changes at all** until a valid value is restored. **We did this to ourselves with a direct
   `PUT`; a user cannot reach it through any screen**, so it is not a defect ticket — but it is worth
   knowing, because for a while it looked exactly like a filter-persistence bug.
