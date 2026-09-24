# SV-10068 — UI / UX fixes to the global search modal

## §0 — Sources and environments

| | where | build | last-modified |
|---|---|---|---|
| AFTER (fix) | `sv9160.qa.shopview.com` | **`v26.36.9-a90a3f0`** | Wed, 23 Sep 2026 19:32:36 GMT |
| BEFORE | **the ten screenshots in the ticket**, taken by Branko on 15 Sep | — | — |

**The ticket** (SV-10068, Story Defect under **SV-9168**, Ready for QA, raised by **Branko Cicovic**,
the PO). It is a list of **eleven separate UI/UX corrections** to the global search modal, each with
a screenshot. Branko's own note: *"I created a list of things that should be fixed in this story
defect, think it's better this way than creating a separate one for each thing."*

**The BEFORE comes from his screenshots rather than production** (Rule 73's second source). This
feature is on a feature branch; production is running `v26.39.0-07c719b` and does not carry this
modal, so there is no pre-fix environment to drive — his ten captures *are* the pre-fix record, and
they are dated and attributable.

### Two things to flag before the results

**1. No developer handoff.** The ticket has one comment — Branko's own — and no "Ready for QA"
note, no PR and no test plan. Branko's eleven bullets are therefore the whole specification.

**2. Five of the eleven items say "as per the design", and I do not have the design.** I can prove
what the build does now, and for colour I can prove the direction of change by sampling his
screenshots. I **cannot** prove "matches the Figma value" for font weights or for the identity of
the clear icon. Those are marked below and raised as an outstanding item rather than passed
silently.

## §1 — The eleven items

Everything below is read from the live DOM (computed styles and geometry), not judged by eye.

| # | What Branko asked for | What the build does now | Verdict |
|---|---|---|---|
| 1 | The clear icon should show **only** once something is typed, and should **clear the input rather than close the modal** | With an empty field there is no clear control at all. After typing, `button_search_clear_query` appears. Clicking it leaves the input empty **and the modal still open** | **PASS** |
| 2 | Stronger font weights for the result title and subtitle | title **14px / weight 600**, subtitle **12px / weight 500** | **PASS** on being strong weights; design match not verifiable |
| 3 | Remove the blue hover **and** the stripe on the left | Hover is now **grey** `rgb(248,250,252)`. No left border and no `::before` stripe on any row | **PASS** — with one thing to confirm, below |
| 4 | Stronger colour for the day labels | **BEFORE `rgb(156,164,177)`** (sampled from his screenshot) → **AFTER `rgb(105,117,134)`**, 11px / weight 700 | **PASS**, measurably darker |
| 5 | Stronger weight and size for "Recent searches"; match the size of "Clear All" | Both are **13.12px** — sizes match exactly. "Recent searches" is **weight 700**, "Clear All" 600 | **PASS** |
| 6 | "Clear all" underlined on hover | At rest `text-decoration: none`; on hover the label renders **underline** | **PASS** |
| 7 | The scroll shouldn't always be visible; remove it and the separator below | The tab strip's `offsetHeight` equals its `clientHeight` — **no scrollbar takes any space**. The strip has **no border-bottom**, and the body below it has no border-top and a transparent background — **no separator** | **PASS** |
| 8 | No clear icon when nothing is typed; use the design's icon | Not shown when empty (same evidence as item 1) | **PASS** on behaviour; the icon's identity against the design is not verifiable here |
| 9 | Remove the open animation — it should appear instantly | Sampled every 40 ms from the click: **on the very first frame** the card is already `opacity: 1`, `transform: none`, and the dialog's `transition-duration` is **`0s`** | **PASS** |
| 10 | Remove the black tint behind the modal | Backdrop computes to **`rgba(0, 0, 0, 0)`** — fully transparent. The page behind is plainly visible in every capture | **PASS** |
| 11 | "Search for something" / "No results for…" centred horizontally on the placeholder below | Both messages measure **0 px** from the centre of the modal body, with `text-align: center` | **PASS** |

## §2 — The one thing that needs Branko, not a verdict

Item 3 has two halves and they came out differently.

- The **left stripe is gone**, and **hover is no longer blue** — it is grey. Both of those are done.
- A **light blue row is still present**, but it is **not hover**: it is the **keyboard-selected**
  row. Proved by pressing Arrow Down — the blue moves from row 0 to row 1 to row 2, one row per
  press. The modal's own footer advertises *"Navigate / Select / Close esc"*, so this is the
  indicator that tells a keyboard user where Enter will take them.

Branko's wording was *"This blue hover shows up sometimes, it should be removed"* — and **"shows up
sometimes" is exactly what a keyboard-selection highlight looks like** if you are not expecting it.
Removing it altogether would leave keyboard navigation with nothing to point at. So this is reported
as it is rather than called a pass or a fail: **the blue he pointed at is now the selection
indicator only, and he should say whether he wants that gone too.**

## §3 — Two wording changes worth noting

- The empty-state message is no longer *"Search for something"*. It now reads **"Type to start
  searching for work orders, parts, customers and more"**. Centred, so item 11 is satisfied either
  way, but the phrase in his bullet no longer exists in the build.
- The field placeholder now reads **"Search work orders, customers, parts and more"**.
