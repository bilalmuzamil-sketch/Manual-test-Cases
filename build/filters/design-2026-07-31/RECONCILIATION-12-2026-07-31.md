# RECONCILIATION — the 12 outstanding design boards vs our 110 active Filters cases
**2026-07-31 · 5 of 12 boards newly rendered · 6 still structure/text-only (see `BOARD-NOTES-12-2026-07-31.md` §3)**

Sources reconciled against, with versions (Standing Rule 15 — every call cites its source):
- **Boards**: Figma `DR4gEODShYgJqkozs3mF5q`, section `Work Order Explorations 20.4.2026`
  and `Filters` / `Sorting (Work In Progress)` / `Components`. Board set dated
  **20–21.4.2026** by their own section names.
- **Spec**: `build/filters/spec-current-2026-07-31/Filters-spec-current.md` — Confluence
  **v1.6, 2026-07-28**.
- **Branko rulings**: `branko-answers-2026-07-17/`, `branko-answers-round2-2026-07-20/`,
  `branko-answers-2026-07-31/answers-ingested.md`.
- **Cases**: `build/filters/cases/*.json` — **110 active**; C-ids from
  `build/filters/testrail-id-map.csv`.

**Precedence applied (Standing Rules 32/33):** latest source wins; **a Branko ruling
outranks a board**; the **spec v1.6 (2026-07-28) is NEWER than every board (20.4.2026)**,
so where they truly conflict the spec wins. Where Branko has been *asked and has not
answered*, the winner is **not** unambiguous and the item is **staged, not applied**.

## Counts

| Category | Findings | Cases touched | TestRail ops |
|---|---|---|---|
| **A — SAFE FIX (applied)** | 1 finding | **9 cases** | **9 `update_case`, all HTTP 200 + re-GET MATCH** |
| **B — CONTRADICTION (staged, ambiguous)** | 2 findings | 8 cases implicated, **0 changed** | 0 |
| **C — NEW BEHAVIOUR with spec backing (authored)** | **0 findings** | 0 | **0 `add_case`** |
| **D — DESIGN-ONLY, no spec backing (staged, NOT authored)** | 4 findings | 0 | 0 |
| **CONFIRMS (no change needed)** | 5 findings | 0 | 0 |

**Because category C is empty, no `add_case` was made, so run 352 needed no union
`update_run`.** Run 352 was snapshotted before and after anyway: **110 tests, all
Untested, both times — untouched.**

---

# A — SAFE FIX (APPLIED)

## A-1 · The collapse/filter control is not a funnel — 9 cases said it was

**What the board pins.** On every rendered board the toolbar filter control is an icon of
**three short horizontal lines of decreasing length** (the Figma layer is named
`Filter-lines`). The mobile `All Filters` chip uses the **same** icon. Cropped and read at
3× on `11985:9686` (desktop toolbar) and `12867:12201` (mobile chip row). **It is not a
funnel/triangle shape anywhere in the design.**

**What the spec says (verbatim, and it does NOT contradict the board):**
> `S1-R4: The page toolbar contains a toggle button that collapses and expands the filter bar`
> — spec v1.6, 2026-07-28, line 201

The spec names **"a toggle button"** and never names an icon shape, on any line. So there
is no contradiction — the board is the only version-pinned source on the shape, and it
says "not a funnel". **Standing Rule 9** (build-accurate wording, never invented) applies
directly: "funnel" was an invented shape description.

**Fix applied — deliberately conservative.** "funnel" was replaced with "filter", i.e. the
wrong shape claim was **removed** rather than a new shape claim asserted. The cases now
say "the filter icon button" / "the filter button", which is true whether the live build
ships lines or a funnel. The positional anchor already in the cases — *"next to the Search
magnifier and the column/layout toggle, left of the New Work Order button"* — is
**confirmed exactly** by the rendered toolbar, so it was kept. This closes DESIGN-NOTES
§5.3, which had left this "flag only".

**One `notes` field deliberately still contains the word "funnel"** — FLT-COLL-04's note
now reads *"…the design shows this filter icon in the active blue treatment (icon layer is
named Filter-lines: three short horizontal lines, not a funnel shape)"*. That is the
correction itself, in the QA metadata layer, not a tester-facing claim.

| Internal ID | TestRail | Link | Where "funnel" was | HTTP | re-GET |
|---|---|---|---|---|---|
| FLT-COLL-01 | **C29601** | https://shopview.testrail.io/index.php?/cases/view/29601 | title, 2 steps, 1 expected | 200 | MATCH |
| FLT-COLL-02 | **C29602** | https://shopview.testrail.io/index.php?/cases/view/29602 | 1 precondition, 1 step | 200 | MATCH |
| FLT-COLL-03 | **C29603** | https://shopview.testrail.io/index.php?/cases/view/29603 | 1 precondition, 1 step | 200 | MATCH |
| FLT-COLL-04 | **C29604** | https://shopview.testrail.io/index.php?/cases/view/29604 | title, 2 steps, 2 expected, notes | 200 | MATCH |
| FLT-COLL-05 | **C29605** | https://shopview.testrail.io/index.php?/cases/view/29605 | 1 step | 200 | MATCH |
| FLT-MOB-01 | **C29621** | https://shopview.testrail.io/index.php?/cases/view/29621 | 1 expected ("with a funnel icon") | 200 | MATCH |
| FLT-MOB-09 | **C29629** | https://shopview.testrail.io/index.php?/cases/view/29629 | 1 expected ("(funnel) toggle") | 200 | MATCH |
| FLT-PARTS-01 | **C38904** | https://shopview.testrail.io/index.php?/cases/view/38904 | 2 expected (Parts toolbar icons) | 200 | MATCH |
| FLT-PSRCH-13 | **C38903** | https://shopview.testrail.io/index.php?/cases/view/38903 | 1 step | 200 | MATCH |

**Standing Rule 41 — whole-case re-verification of every touched case.** Each of the 9 was
re-read end to end against **spec v1.6 (2026-07-28)** *and* the rendered boards, not just
the changed line:

| Case | "re-verified whole against …" | Outcome of the whole-case check |
|---|---|---|
| FLT-COLL-01 (C29601) | spec v1.6 S1-R4/S1-R5 + boards `11985:9686`, `11985:10428` | Toolbar order in step 1 matches the render exactly. No other defect. |
| FLT-COLL-02 (C29602) | spec v1.6 S1-R6 + board `11985:9686` | S1-R6 "reappears in its previous state (with any active filters still shown)" supports all 3 expected. No other defect. |
| FLT-COLL-03 (C29603) | spec v1.6 S1-R7 ("persists across navigation") | Supported. No other defect. |
| FLT-COLL-04 (C29604) | spec v1.6 S7-R4/S7-N2 + board `11985:9686` | Blue-indicator styling remains a legitimate open VIU-confirm (already in `notes`). No other defect. |
| FLT-COLL-05 (C29605) | spec v1.6 S7-R5 (verbatim: "the table continues to apply all active filters") | Exactly supported. No other defect. |
| FLT-MOB-01 (C29621) | spec v1.6 S12-R1 + boards `12867:12201` **and** `11884:20807` | Scroll-arrow claim **re-checked and upheld** on `11884:20807` — see BOARD-NOTES §4.2. No other defect. |
| FLT-MOB-09 (C29629) | spec v1.6 S12-R4 (verbatim: "The filter bar collapse toggle is not shown on mobile") + board `12867:12201` | Board confirms the mobile toolbar is Search / sort icon / New Work Order with **no** filter toggle — the case's step 1 names those three, correctly. No other defect. |
| FLT-PARTS-01 (C38904) | spec v1.6 §2/§4 + Branko 2026-07-31 Q2/Q3/Q5/Q7 + board `11884:16885` | Expected 13 still honestly flags the toolbar icons as live-build work. No other defect. |
| FLT-PSRCH-13 (C38903) | spec v1.6 S13-E1 (verbatim: "the query continues to apply and the search control remains in the toolbar") + §4 Key Decisions | Exactly supported. No other defect. |

**Foreign-case gate (Standing Rule 38).** All 9 were snapshotted with `get_case` before
writing: sections **4118** (Collapse and Expand), **4123** (Mobile Filters), **5411**
(Parts Page Filters), **5410** (Page Search Toolbar) — all inside Filters group 4110, all
live titles matching our local IDs. **0 foreign cases touched.** Snapshots:
`design-2026-07-31/push/pre-push-snapshot/C*.json`.

---

# B — CONTRADICTION (STAGED — winner NOT unambiguous, nothing applied)

## B-1 · Mobile `Apply filters` / `Apply filter` button vs the spec's "no apply button"

**The board says (design, 20.4.2026)** — every mobile filter sheet board carries a sticky
bottom button. Verbatim text layers: **`Apply filters`** (plural, on the All-Filters sheet
boards) and **`Apply filter`** (singular, on the single-filter sheet board `11884:21065`).
Also verbatim: **`All Filters (1)`** and **`All Filters (2)`** — the sheet title carries an
applied-filter count, which only makes sense if applying is a discrete action.

**The spec says (v1.6, 2026-07-28)** — verbatim, line 231:
> `S2-R6: The table filters in real time as the user makes selections (no confirm/apply button needed)`

and verbatim, line 517:
> `S12-R2: The filter chips behave identically to desktop: tapping a chip opens its dropdown, selections update the chip appearance, "Clear filters" appears when active`

**But also verbatim, line 518:**
> `S12-R3: Filter dropdowns open as a bottom sheet or overlay appropriate for the mobile viewport`

**Why the winner is NOT unambiguous, honestly.**
- By date, the spec (2026-07-28) beats the boards (20.4.2026), and S2-R6 is explicit.
- **However** S2-R6 sits in **Story 2 (Status filter)**, written in a desktop context, and
  S12-R3 expressly licenses a **"bottom sheet … appropriate for the mobile viewport"**. A
  bottom sheet with a commit button is a standard, viewport-appropriate mobile pattern. The
  spec **nowhere states that the mobile sheet has no apply button** — that reading is an
  inference from combining S12-R2 with S2-R6.
- **Branko has been asked and has not answered.** `branko-answers-2026-07-31/answers-ingested.md`
  records the **"mobile individual-filter 'Apply' button"** as one of five items that
  *"remain live"* — i.e. explicitly unanswered.

**Ruling: STAGED.** Per the instruction "apply only where the winner is unambiguous", and
per **Standing Rule 42** (do not assert a requirement no version-pinned source settles),
nothing was changed. Rewriting 7 cases to real-time-no-button on an inference — and then
back again if Branko says the sheet keeps its button — is worse than waiting.

**Cases implicated (0 changed).** The QA lead's flag on FLT-MOB-04 is **confirmed real**
but it is not a lone case; it is a 7-case pattern:

| Internal ID | TestRail | Link | The Apply assertion |
|---|---|---|---|
| FLT-MOB-02 | **C29622** | https://shopview.testrail.io/index.php?/cases/view/29622 | "A sticky blue 'Apply filters' button sits at the bottom of the sheet." |
| FLT-MOB-03 | **C29623** | https://shopview.testrail.io/index.php?/cases/view/29623 | "After 'Apply filters' the sheet closes and the work order list shows only the ticked statuses." |
| **FLT-MOB-04** | **C29624** | https://shopview.testrail.io/index.php?/cases/view/29624 | **"The bottom button reads 'Apply filter' (singular); tapping it applies the selection and filters the list."** ← the case the QA lead flagged |
| FLT-MOB-05 | **C29625** | https://shopview.testrail.io/index.php?/cases/view/29625 | "…then tap 'Apply filters'." |
| FLT-MOB-06 | **C29626** | https://shopview.testrail.io/index.php?/cases/view/29626 | "…tap 'Apply filters'." |
| FLT-MOB-07 | **C29627** | https://shopview.testrail.io/index.php?/cases/view/29627 | "Choose Yes and tap 'Apply filters'." |
| FLT-MOB-08 | **C29628** | https://shopview.testrail.io/index.php?/cases/view/29628 | applies via the sheet, then checks chips/Clear filters |

**What the 12 boards add to this specifically:** my newly rendered `12867:12201` shows the
mobile **chip row** and **no sheet**, so it neither confirms nor denies the button — the
`Apply` evidence all sits on the 73 boards captured earlier. The one genuinely new
data point is negative: the early-exploration board `12141:19858` has **no sheet
mechanism at all** (it used inline toggles), so it offers no support either way.

**Single question that resolves all 7** (layman, Standing Rule 7): *"On a phone, when you
tick a filter — does the list update straight away, or do you tap an 'Apply' button at the
bottom first?"* **A** = updates straight away, no button · **B** = there is an Apply
button.

## B-2 · FLT-TAB-06 "first visit opens Estimates" — the boards point the other way

**What our case asserts** — FLT-TAB-06 / **C38876**
(https://shopview.testrail.io/index.php?/cases/view/38876), expected 1, verbatim:
> "On the very first visit the **Estimates** tab is the selected one, even though All is the
> FIRST tab in the row (order and default are different on purpose)."

**What the spec says** — **nothing.** The case's own `spec_ref` already admits it, verbatim:
> "no requirement in the ratified spec v1.6 - default/last-used tab is
> engineering-plan-only - confirmation requested; tech plan 2026-07-29 D10 (default tab =
> Estimates; last-used tab persists)"

I re-checked spec v1.6 for a default-tab requirement: **Story 9 (Tab Behavior) defines
S9-R1…S9-R5 about what each tab does to the filters, and no line anywhere states which tab
opens first.** So the only source is the engineering plan of 2026-07-29.

**What the boards show (new evidence from this pass).** On **every** board I rendered that
has the final tab row — `11985:9686`, `11985:10428`, `11985:11259` (desktop) and
`12867:12201` (mobile) — the selected tab is **`All`**, never `Estimates`. The already-captured
`11884:20807` also shows `All` selected. The only board showing a different selection is
the superseded `12141:19858`, whose selected tab is `Work Orders` in a tab set that no
longer exists.

**Ruling: STAGED, and the case is now weaker than before.** Two honest caveats keep this
out of category A:
1. A static Figma board showing `All` selected is **not** a statement about a first-visit
   default — designers pick one representative state. The boards are **weak** evidence.
2. But they are weak evidence **against** `Estimates`, and there is **no** version-pinned
   requirement **for** `Estimates`. Under **Standing Rule 42** the case currently asserts a
   requirement no ratified source supports.

**Recommendation for the QA lead (not applied):** either (a) get Branko/engineering to
confirm D10 and cite the tech plan as the source of record, or (b) soften expected 1 to
"note which tab is selected on the first visit" and keep only the last-used-tab half, which
the tech plan and S10 persistence both support. Branko has been asked — `answers-ingested.md`
lists **"which tab opens first"** among the five items that *"remain live"*.

---

# C — NEW BEHAVIOUR the boards show AND the spec supports → author a case

## **ZERO findings. Nothing was authored. `add_case` count = 0.**

This is the honest result and it is worth stating plainly, because it is the reason run 352
needed no touching. Every genuinely new behaviour on the 12 boards turned out to have **no
spec backing**, which puts it in category D, not C:

- Sorting (single + multi-level, field list, direction, `Add Sort`, `Delete sort`, the
  toolbar sort icon, the `Status ↓` column indicator) → **spec v1.6 is silent**. I grepped
  the whole spec for sort-related terms: the **only** hit is
  `S13-R14: … It survives sorting, pagination, and navigating away from the page and
  returning` — which merely acknowledges that sorting exists and defines **no** sorting UI
  or behaviour. → **D-1.**
- The column/layout icon → spec silent. → **D-2.**
- The early-exploration mobile toggles → superseded by the final design. → **D-3.**
- The `Add Sort`-disappears-on-two-rows cap → design-only, and the design itself does not
  say whether it is a cap or an unfinished board. → **D-4.**

The one board-pinned behaviour that *does* have spec backing — the mobile filled-search
state — is **already covered**, not new: see CONFIRMS-1 below.

---

# D — DESIGN-ONLY, NO SPEC BACKING → **NOT AUTHORED** (staged as a proposal)

**Standing Rule 42 governs this section absolutely.** Authoring these would mean asserting
requirements that no version-pinned source supports. Every item below is a *proposal for
the QA lead*, with what the boards suggest, so the decision is theirs.

## D-1 · Sorting — the big one. 4 boards fully specify it; we have 0 cases; spec says nothing

**Why it must not be authored, in three independent reasons:**
1. **The Figma section is literally named `Sorting (Work In Progress)`.** The designer has
   labelled it unfinished.
2. **Spec v1.6 has no sorting requirement** (only the incidental `S13-R14` mention above).
3. **Branko has not answered the sorting-scope question.** `answers-ingested.md` records
   **"sorting (no mention anywhere in his sheet)"** as the first of five items that
   *"remain live"*.

**What the boards suggest, if Branko says sorting is in scope** — enough for roughly 6–8
cases, and now **pixel-confirmed** for steps 1–3 rather than tree-inferred:

| # | What the design shows (verbatim labels) | Source board | Evidence |
|---|---|---|---|
| 1 | A sort entry point in the toolbar action group: an **up/down double-arrow icon**, sitting between the filter icon and the column/layout icon | `11985:9686` | **rendered** |
| 2 | A **`↓` sort-direction indicator on the `Status` column heading** in the default state | `11985:9686` | **rendered** |
| 3 | Clicking the toolbar sort icon puts it in a selected look and opens a field menu of **exactly two items: `Status`, `WO Number`** | `11985:10428` | **rendered** |
| 4 | A **sort chip `↑↓ Status ⌄`** is inserted as the FIRST chip in the filter row, left of `Status`, in the active blue look | `11985:11259` | **rendered** |
| 5 | The sort panel = a field dropdown (`Status`) + a direction dropdown (`Ascending`) + a per-row **`✕`** + **`+ Add Sort`** + panel-level **`🗑 Delete sort`** | `11985:11259` | **rendered** |
| 6 | **Multi-level sort**: two stacked rows, `Status`/`Ascending` then `WO Number`/`Ascending` | `11985:13334` | **layer tree only — no render** |
| 7 | **`Add Sort` is absent once there are two rows** while `Delete sort` remains — possibly a two-sort cap, possibly an unfinished board. The design does not say which. | `11985:13334` | **layer tree only — no render** |
| 8 | **`Descending` appears nowhere** on any of the four boards — the design does not pin how a sort is reversed | all 4 | rendered ×3 + tree ×1 |
| 9 | A sort icon also sits in the toolbar of the **final** (non-WIP) mobile boards and two Reports boards — so the icon has escaped the WIP section even though the panel has not | `12867:12201`, `11884:20807`, `11884:15901`, Reports `Notes`/`Reminders` | rendered |

**Question that unblocks it** (layman, Rule 7): *"Is being able to sort the Work Orders
list — pick a column, pick A→Z or Z→A, and stack a second sort under the first — part of
this release? And if yes, is two sorts the most you can stack?"*

## D-2 · The column/layout icon has no case
Present in the toolbar on every rendered desktop board, between the sort icon and
`New Work Order`. Spec v1.6 never mentions a column chooser. FLT-PARTS-01 (C38904)
expected 10 already *notes its presence* and expected 13 honestly flags that what it does
is unverified — that is the right amount of coverage for something out of scope. **No case
authored.** Likely not a Filters feature at all; confirm with Branko rather than assume.

## D-3 · The early-exploration mobile board is superseded — record and ignore
`12141:19858` shows a **completely different mobile IA**: tabs `Estimates` / `Work Orders`
/ `Completed` / **`By Status`**, a **full-width** `New Work Order` button, and **two toggle
switches `My work orders` and `Asset here?` instead of any filter chips**. Its two toggles
became, in the final design, the `My Work Orders` **tab** and the `Asset on site`
**filter chip**. **No case authored, and no existing case contradicted** — a superseded
exploration is not a requirement. Logged so a future pass does not "discover" it and
mistake it for a delta.

## D-4 · Filter-button `Hover` state has no case
Carried over from DESIGN-NOTES §5.4 and unchanged by this pass: the button component ships
`Default` / `Hover` / `Selected` / `Disabled`; we cover all but `Hover`. Low value. **Not
recommended** as a new case.

---

# CONFIRMS — boards agree with our cases, no change needed

These are recorded because "the board confirms the case" is a result, and Standing Rule 17
wants the whole population accounted for, not just the deltas.

- **CONFIRMS-1 · FLT-PSRCH-05 (C38889)** — https://shopview.testrail.io/index.php?/cases/view/38889.
  The newly rendered `12867:12201` "Search Filled" is the **mobile filled-search state**,
  and it confirms three of that case's expected results **from the design** for the first
  time: the search **expands inline in the toolbar with no popup** (S13-R16), the box
  **stretches into the row while the sort icon and `New Work Order` stay visible and in
  place**, with `New Work Order` at **hug width, not full width** (S13-R17/R18), and there
  is **no separate "search is on" badge** — the box simply stays open showing the query
  `In progress...` with a round `⊗` clear (S13-R20). **No wording change was needed.**
  *(Its `design_ref` could gain this board as an anchor, but `design_ref` is a local-only
  field that the TestRail push does not carry, so this is noted rather than pushed.)*
- **CONFIRMS-2 · FLT-MOB-09 (C29629)** — the mobile toolbar on `12867:12201` is exactly
  `Search` / sort icon / `New Work Order` with **no** filter-bar toggle, which is what the
  case's step 1 and expected 1 say.
- **CONFIRMS-3 · FLT-MOB-01 (C29621)** — the `All Filters` chip leads the row, followed by
  `Status`, `Customer`, `Lead T…`, and the row is clipped at the viewport edge
  (horizontally scrollable). Scroll arrow re-verified on `11884:20807` — see BOARD-NOTES
  §4.2.
- **CONFIRMS-4 · FLT-BAR-02 / FLT-TAB-01 (C29558 / C29608)** — the desktop chip row on all
  three rendered Sorting boards is exactly the five chips in the fixed order `Status`,
  `Customer`, `Lead Technician`, `Service Advisor`, `Asset on site`.
- **CONFIRMS-5 · FLT-COLL-01 (C29601) toolbar geography** — the case's *"next to the Search
  magnifier and the column/layout toggle, left of the New Work Order button"* matches the
  rendered toolbar order exactly (`Search`, filter icon, sort icon, column icon,
  `New Work Order`).

---

## OUTSTANDING

1. **B-1 mobile `Apply filter(s)` — STAGED, 7 cases (C29622–C29628) unchanged.** Needs one
   Branko answer; already on his list as unanswered. Do not rewrite on inference.
2. **B-2 FLT-TAB-06 (C38876) default tab — STAGED.** No ratified requirement supports
   `Estimates`; every final board shows `All` selected. Needs Branko's or engineering's
   confirmation, or the case should be softened.
3. **D-1 sorting — STAGED, 0 cases authored.** ~6–8 cases ready to write the moment Branko
   confirms scope; steps 1–3 are now pixel-confirmed, step 4 (multi-level + the possible
   two-sort cap) is still layer-tree-only and wants its render.
4. **D-2 column/layout icon scope** — unconfirmed, no case.
5. **6 of 85 boards still unrendered** — `11985:13334`, `11829:8908`, `11829:8920`,
   `11884:15901`, `11842:14069`, `11842:16879`. Retry re-armed in `PENDING-FIGMA-FETCH.md`,
   **DUE-AT `2026-07-31T17:05Z`**; a Figma personal access token finishes them immediately.
6. **FLT-PSRCH-08 (C38898) keeps its honest "PNG still pending" note** — `11829:8908` is
   one of the 6 that did not render, so that note remains true and was not touched.
7. **The design source is NOT yet COMPLETE (79/85).**
