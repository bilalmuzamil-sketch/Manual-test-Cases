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

## §4 — Honest notes on method

- **I destroyed the recent-searches list mid-pass.** To reach the empty state for item 11 I clicked
  **Clear All**, which wiped the recents, and my attempts to rebuild the list by searching and
  picking results did not repopulate it. All the recents-dependent measurements (items 4, 5, 6 and
  the row weights) had **already been taken** before that, from the live DOM, and the exhibit
  screenshots come from those same earlier captures. Nothing is inferred — but the branch is now
  left with an empty recents list for whoever looks next. Per-ticket QA branch, so no cleanup is
  owed, but it is worth knowing.
- **One measurement was my own checker's fault** (Rule 79c). My first attempt to measure the
  "No results" centring matched a **1-pixel-wide screen-reader element** reading "No results found"
  and reported it as 303 px off centre. The visible message is a different node and measures 0 px.
  Caught by requiring the element to be wider than 20 px.
- **Font weights are measured, not compared.** For items 2 and 5 I can state what the build renders
  (600 / 500 / 700) but not that those match the Figma, because I do not have it.
- Colour changes **are** comparable: I sampled the text pixels out of Branko's own screenshots, so
  the day-label figure (`rgb(156,164,177)` → `rgb(105,117,134)`) is a real before-and-after.

## §5 — Pre-post gate (Rule 72)

| Check | Result |
|---|---|
| Branch build marker re-read at post time | `v26.36.9-a90a3f0`, last-mod Wed 23 Sep 19:32:36 GMT, etag `52864fd0…` — unchanged all pass |
| Ticket state re-read | SV-10068, **Ready for QA**, priority Medium, 1 comment (Branko's own) — unchanged |
| Every figure traced to a live measurement | yes — computed styles and geometry read this pass |
| Human voice / no AI fingerprint | scanned before posting |
| No technical-details section | per Rule 84, asked per ticket |

---

# §6 — DESIGN RECEIVED: conformance check (24 Sep, supersedes the "cannot verify" notes above)

The QA lead supplied the **ShopView Design System** as four zips (`_18`, `_19`, `_20`, `_21`).
**All four are byte-identical** — same 314 files, `diff -rq` clean between every pair — so there is
one design, exported four times. The search modal's spec is
`ds21/global-search.jsx` with token values in `ds21/colors_and_type.css`.

Every design value below is quoted from those two files; every build value is the live measurement
from §1.

| Element | Design | Build | |
|---|---|---|---|
| Modal width | `640` | 640 px | match |
| Modal border | `5px solid var(--sv-border-subtle)` = **#EEF2F6** | `5px solid rgb(238,242,246)` | **exact** |
| Backdrop | the overlay div has **no background at all** | `rgba(0, 0, 0, 0)` | match |
| Open animation | none declared | none, `transition-duration: 0s` | match |
| Placeholder | `"Search work orders, customers, parts and more"` | identical | **exact** |
| Clear button | `{hasQuery && <button …>}` — rendered **only** when there is a query; `onClick` sets the query to "" and refocuses, it does not close | identical behaviour | **exact** |
| Tab strip | `overflowX: auto`, `scrollbarWidth: thin`, no `borderBottom` | same | match |
| Row **hover** | `var(--sv-surface-hover)` = `--sv-grey-50` = **#F8FAFC** | `rgb(248,250,252)` | **exact** |
| Row **selected** | **`var(--sv-surface-hover)` — the same grey** (`const on = isHov \|\| selected`) | `rgb(233,245,255)` = **#E9F5FF** | **✗ MISMATCH** |
| Left stripe | none anywhere in the component | none | match |
| Result title | 14px / 600 / `--sv-text-primary` = #364152 | 14px / 600 / #121926 | size + weight exact; colour darker |
| Result subtitle | 12px / 500 / `--sv-text-secondary` = #697586 | 12px / 500 / rgb(105,117,134) | **exact** |
| "Recent searches" | 12px / **600** / #697586 | **13.12px** / **700** / #697586 | colour exact; larger and bolder |
| "Clear all" | 12px / 600 / `--sv-accent-text` = #175CD3, `textDecoration: hov ? "underline" : "none"` | 13.12px / 600 / rgb(23,92,211), underline on hover | colour, weight and hover exact; larger. **Label reads "Clear All"**, design says **"Clear all"** |
| Day label | 10px / 600 / uppercase / `--sv-text-muted` = **#828A98** | 11px / 700 / uppercase / **#697586** | darker, bolder and larger than the token |
| Empty state | **"Type to start searching for work orders, parts, customers and more"**, 14px, text-secondary, centred | identical | **exact** |
| No results | 14px, text-secondary, centred | 14px, rgb(105,117,134), centred, 0 px offset | match |

## §6.1 — The blue row is a real miss, and the design says so

This settles the question I was going to put to Branko.

- The Global Search component spec renders a row's background as
  **`on ? "var(--sv-surface-hover)" : "transparent"`** where **`const on = isHov || selected`** —
  so in the design a **selected row and a hovered row are the same grey, #F8FAFC**. There is no
  blue row in this component at all.
- The design system *does* define **`--sv-surface-selected: var(--sv-primary-50)` = #E9F5FF**,
  commented *"selected row / active nav"* — and **that is exactly the colour the build renders**.
  But **`global-search.jsx` never uses that token** (`grep -c surface-selected` → **0**).

So the build reached for the design system's general selected-row colour where the component's own
spec says to use the hover grey. The component spec governs the component, and **Branko asked for
the blue to go** — both point the same way. **Item 3 is not complete.**

## §6.2 — Three places the build is *stronger* than the design token

On the three "use stronger…" items the build overshoots the design values — in the direction Branko
asked for:

- **Day labels**: #697586 where the token is #828A98, and 11px/700 where the design is 10px/600.
- **"Recent searches"**: 13.12px/700 where the design is 12px/600.
- **Result title**: #121926 where the token is #364152.

These satisfy his request and exceed the token. Not called failures — but he should say whether he
wants them pulled back to the token values or left as they are.

## §6.3 — Resolved by the design, no longer open

- The empty-state wording is **not** a deviation. *"Type to start searching for work orders, parts,
  customers and more"* **is the design's own string** — Branko's "Search for something" is the text
  the design already replaced. §3's note is withdrawn.
- The clear-button behaviour matches the design exactly, including the conditional render.

## §7 — Comment updated in place

**Comment [77233](https://shopview.atlassian.net/browse/SV-10068?focusedCommentId=77233)** was
**edited, not replaced** — one comment on the ticket, no chain. Verdict changed from PASSED to
**FAILED** once the design showed the selected-row blue is a genuine miss rather than an open
question. Failure written in the Rule-83 order: description, steps to reproduce, current vs
expected, screenshot, environment — then what passed. Five exhibits attached (61405–61409).
Re-read from Jira and verified.

## §8 — Self-review of the comment, and the check it surfaced

The QA lead asked whether the comment needed editing. Re-reading it as a reader would, **three
faults, all mine**:

1. **The table contradicted the verdict.** The panel said "ten of the eleven points are done; one is
   not" and the table then listed **eleven rows, every one PASSED**. The failure existed only in the
   prose above it.
2. **"Point 3" meant two opposite things in the same comment** — the failure was headed *"Point 3 —
   the blue is still there"* while table row 3 read *"Blue hover removed … PASSED"*.
3. **The numbering was mine, not Branko's.** His description is a bullet list; I invented 1–11 and
   split his single *"blue hover … as well as the stripe"* bullet across two rows, so "Point 3"
   pointed at nothing he could locate.

Rebuilt so the table **mirrors his eleven bullets in his own order**, with bullet 3 carried as a
**FAILED** row. The arithmetic now closes: 10 passed + 1 failed = 11.

**The re-read also caught an unrun check** — exactly the Rule-85 trap of an "honest limit" that has
quietly stopped being one. His bullet 8 has two halves, and the second is *"Also use the one from the
design."* I had marked the icon's identity unverifiable **before** the design arrived and never went
back once it did. Checked now:

| | Design | Build |
|---|---|---|
| icon | lucide **`circle-x`** (`ICO.xCircle`) | `lucide-icon` svg, paths `M12 22a10 10 0 1 0 0-20…` + two crossing strokes = **`circle-x`** |
| colour | `grey400` = **#9AA4B2** | `rgb(154,164,178)` = **#9AA4B2** |
| size | 18 px | **20 px** |

Right icon, exact colour, 2 px larger — so bullet 8 passes, and the size joins the list of places the
build overshoots the design.
