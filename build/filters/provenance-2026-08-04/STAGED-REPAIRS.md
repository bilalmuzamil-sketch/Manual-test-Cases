# Filters — STAGED (not executed) repair from the Rule-41 whole-case re-reads

**Status: STAGED — awaiting the QA lead's go-ahead. Nothing below was written to TestRail.**

## The one staged item — FLT-MOB-04 · [C29624](https://shopview.testrail.io/index.php?/cases/view/29624)

### What is wrong

The case body was corrupted by a **paste accident**. It is not a wording preference — the
steps are literally unrunnable as formatted, and the expected results are one unbroken
line of raw HTML.

**Live `custom_preconds` — two preconditions collapsed onto one line, no separator:**

```
- You are signed in to the ShopView App on a mobile device.- You are on the Work Orders page.
```

**Live `custom_steps` — four steps collapsed onto one line, and the last two have no
separator or terminator at all:**

```
- Tap the Status chip (not All Filters).- Read the sheet.- Tick a status- Untick it/ tick another
```

**Live `custom_expected` — opens with a bare `<li>` carrying a browser paste attribute,
never wrapped in `<ol>`, with all four expected results inside that single `<li>`:**

```
<li data-pasted="true">A bottom sheet opens for that single filter: its title row shows the
filter's icon and name (for example 'Status') with a close (x) button — no accordion list
of the other filters.- The sheet shows only that filter's options (the nine status
checkboxes plus 'Clear selection').- There is <strong>no 'Apply filter' button</strong>.
Ticking/unticking a status filters the work-order list <strong>immediately</strong>, the
same as desktop — no submit step.- The chip's active state and value update live as the
selection changes; closing the sheet (x) just dismisses it and keeps the applied filter.
```

It fails **Rule 28 dimension 2** ("not actionable — a tester cannot tell what to DO") and
**Rules 7/9** (plain, readable, build-accurate wording). It is the only case of its kind in
either suite.

### What WAS fixed this pass

Its **References** field carried the same paste damage — a `,-,` separator with note text
appended after the closing bracket. Because the Filters `refs` field was being rewritten
anyway for the epic backfill, the artefact was removed **in that same single write**:

| | |
|---|---|
| **before** | `Filters (no Jira epic) (S12-R2; S12-R3) [spec v1.6 2026-07-28],-,individual-chip real-time per S12-R2 + tech-plan 2026-07-29; only the combined All Filters sheet is batch` |
| **after** | `SV-8797 (S12-R2; S12-R3) [spec v1.6 2026-07-28] ; individual-chip real-time per S12-R2 + tech-plan 2026-07-29; only the combined All Filters sheet is batch` |

The note text is preserved verbatim; only the `,-,` artefact became a clean ` ; `.

### Why the BODY repair was NOT executed

Two reasons, and the second is the binding one:

1. **The coordinator's instruction was explicit:** the cases frozen pending Branko —
   *"7 mobile Apply-button C29622–C29628"* — *"get ONLY the provenance line and nothing
   else."* C29624 sits inside that range.
2. **Reflowing the text means re-committing its contested assertion.** The corrupted
   expected result asserts *"There is **no 'Apply filter' button**. Ticking/unticking a
   status filters the work-order list **immediately**"* — and whether the mobile filters
   batch behind an Apply button at all is exactly the **open Branko question (B3)**
   recorded in `fixes-2026-07-31/RULE28-AUDIT-2026-07-31.md` §5. Rewriting the sentence,
   even preserving the words, would restate a position no product source has settled.

So the mechanical half that touches **no** contested text was done; the half that would
restate it is staged.

### The proposed repair, ready to execute on one word of approval

**`custom_preconds`:**

```
1. You are signed in to the ShopView App on a mobile device.
2. You are on the Work Orders page.
```

**`custom_steps`:**

```
1. Tap the Status chip (not the 'All Filters' chip).
2. Read the sheet that opens.
3. Tick one status and watch the work order list.
4. Untick it, then tick a different status, and watch the list again.
```

**`custom_expected`:**

```
1. A bottom sheet opens for that single filter: its title row shows the filter's icon and name (for example 'Status') with a close (x) button, and no accordion list of the other filters.
2. The sheet shows only that filter's options (the nine status checkboxes plus 'Clear selection').
3. There is no 'Apply filter' button. Ticking or unticking a status filters the work order list immediately, the same as on desktop, with no submit step.
4. The chip's active state and value update live as the selection changes; closing the sheet with the x just dismisses it and keeps the applied filter.
```

**Provenance line: unchanged** — the case already carries the `design_awaiting` variant,
which is correct either way.

**Nothing about the assertions changes** — the same four expectations, in the same order,
in the same words, made readable. It is a pure reformat.

### How to execute it

Add the three `(field, old, new)` tuples to `REPAIRS['filters'][29624]` in
`tools/build_plan.py`, refresh that case's snapshot from live (as was done for C29628),
rebuild the plan, and run `python3 exec_push.py filters --only 29624`. The executor's
staged-OLD-text guard will refuse if anything has drifted, and the Rule-50 byte
verification applies as normal.

## What was NOT staged, and why

Nothing else. The whole-case re-read of all 110 Filters cases found **no other** body
defect: 0 malformed refs beyond this one, 0 stale anchors, 0 titles over 80 characters,
0 empty fields, 0 Rule-4 misplacements, 0 internal-ID leaks, 0 C-id leaks, and 0
duplicate titles.
