# The phone Apply-filters check — what is waiting, and what it needs

**Status: OPEN.** Nothing here can be settled until one fresh set of QA cookies arrives. It is then
about **ten minutes** of work.

## Why nothing was observed

Every cookie set left on the machine returns **HTTP 401 `sso_required`** against
`sv8785api.qa.shopview.com`. All of them carry the **same `sv_sso_session` token**, and it is that
token that has expired, so there was no fallback. `POST /api/quick-login {key:'admin'}` is itself
gated by a valid session and also returns **401 `sso_required`**, so it cannot bootstrap one.

**What is needed:** `sv_sso_session`, `PHPSESSID` and `cf_clearance` for `.qa.shopview.com`.

## Why no defect ticket was filed — two independent reasons

**1. It already exists, and it is not ours to duplicate.**

**[SV-8875](https://shopview.atlassian.net/browse/SV-8875)** — *"Mobile individual filter sheets don't
support multi-select and have no "Apply filters" button (S12-R6 / S12-R2)"* — a **Story Defect**,
**Open**, parent **SV-8797** (Mobile Filter Bar), raised by **Ahtasham Amjad** at
**2026-08-05T05:50:12-0500**, which is **32 minutes after Branko closed the question**. His Expected
Result quotes the same reading of the specification that we reached independently:

> *"S12-R6: mobile stages selections and applies them when the user taps an "Apply filters" button
> within the sheet. This applies to individual filter sheets, not only the combined "All Filters"
> sheet."*

He even names our cases in it — *"C29622 / C29623 (All Filters sheet — passing), C29624 (individual
chip sheet — failing)"*.

**So there is no ticket draft to hold here. Filing one would be a duplicate.** His ticket was not
touched in any way — not its priority (Medium, his call), not its links, not a comment (Standing
Rule 38).

**2. We witnessed nothing.** A defect needs a live observation, and there was none.

## What must be observed when cookies arrive

At a **phone viewport (390 × 844)** on `sv8785.qa.shopview.com/workorders`, signed in as an
admin-level user, with work orders present in several statuses:

| # | What to do | What to record |
|---|---|---|
| 1 | Tap the **Status** chip (not "All Filters") | does a bottom sheet open for that one filter? |
| 2 | Tick **one** value | **does the work order list change immediately, or not at all?** Watch for a `GET /api/work-orders?…filters[0][field]=status…` firing on the tap, and whether the address bar gains `?status=…` |
| 3 | Try to tick a **second** value in the same sheet | is multi-select possible? |
| 4 | Look at the bottom of that sheet | **is there an "Apply filters" button — and is the label written "Apply filters" or "Apply Filters"?** |
| 5 | Tap the **All Filters** chip and look at its footer | the combined sheet's button and its exact label |
| 6 | Press that button | does the list only change then? |

**Named test data** — the estate is shared and the exact data matters (Standing Rule 50): any customer
with several work orders will do; the statuses to use are **Paid** and **Declined**, because the seeded
data on this branch is overwhelmingly **Estimate**, so Paid/Declined give an unmistakable before/after.
A viewport of **390 × 844** with touch emulation is what the earlier pass used, so results are
comparable.

## The specification text it would contradict

Confluence page **572030978**, **version 18**, read live 2026-08-05.

**S12-R6, verbatim:**

> *"Unlike desktop, mobile does not filter in real time. Selections made inside a dropdown / bottom
> sheet are staged, and the table updates only when the user taps an "Apply filters" button within the
> sheet. This confirms intent on smaller screens and avoids repeated table reflows / data fetches while
> the user scrolls a long option list. "Clear selection" and "Clear filters" behave as on desktop."*

**§4 Key Decisions, verbatim:**

> *"Mobile uses deferred apply: desktop filters in real time, while mobile stages the user's selections
> and applies them only when the user taps an "Apply filters" button — a deliberate difference for
> small-screen ergonomics (see Story 12)."*

**And the sentence that makes it cover a single filter's sheet too — S12-R2, verbatim:**

> *"The filter chips behave like desktop with one exception (see S12-R5): tapping a chip opens its
> dropdown, selections update the chip appearance, and "Clear filters" appears when active"*

That cross-reference is **broken**: S12-R5 is the page-search rule. The "one exception" it means is the
deferred apply, which **was** S12-R5 until Confluence **version 17** renumbered it — Branko's own note:
*"Fix Story 12 numbering: deferred-apply requirement renumbered to S12-R6, placed after the page-search
S12-R5"*. Read with the renumbering in hand, a chip's own dropdown behaves like desktop **except** that
it stages and needs the button.

## What there IS — someone else's capture, used only for understanding

The re-check pass this morning, on the **byte-identical** build, captured this at a 390 × 844 viewport
(`../recheck-2026-08-05/evidence/raw/o-mob2.json`):

- key **`S12R6_deferredApply`** — tapping **Paid** in the Status sheet fired
  `GET /api/work-orders?…filters[0][value]=paid` **immediately** (HTTP 200), the address bar became
  `?status=paid&tab=all` at once, and four seconds later `applyButtons: []` — **no Apply button in that
  single-filter sheet**;
- key **`allFiltersSheet`** — the **combined** sheet *does* carry the footer button, on-screen text
  **"Apply Filters"** (`data-test-id="apply_filters"`), and `callsBefore: 0` — nothing requested until
  pressed.

**That is another run's evidence, so under Standing Rule 12 it is not a verdict of ours.** It is why
this file exists rather than a ticket, and it is why the eight phone cases carry **HOLD** rather than
READY or EXPECT FAIL. It also raises the **label question**: the specification writes *"Apply filters"*
and our cases follow the specification, but that capture shows a **capital F**. One live look settles it.

## What flips when the check is done

| Outcome | What changes |
|---|---|
| the single-filter sheet **stages and has the button** | the eight cases go from HOLD to **READY**, ready-to-automate rises from **93 to 101**, and SV-8875 should be re-checked as possibly fixed |
| the single-filter sheet **still applies on tap** | C29624 becomes **READY - EXPECT FAIL (SV-8875)** and the other seven **READY** — again 101 — with nothing new to file, because SV-8875 already covers it |
| the label really is **"Apply Filters"** | a one-line casing correction across the phone cases (Standing Rule 9) |
