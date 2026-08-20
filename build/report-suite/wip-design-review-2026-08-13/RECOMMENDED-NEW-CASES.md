# WIP design review (13 Aug 2026) — new-coverage recommendations + reconciliation

**Nothing here is created.** Standing Rule 62 + the ACTIVE creation HOLD (register row
H1) bar `add_case`; these are written up ready for the QA lead to authorise. Source of
record: `DESIGN-REVIEW-AUG-13.md` (artifact
https://claude.ai/code/artifact/42c35f46-2796-467e-9723-7daa5385446e). Live corroboration:
build v3.8-d0e135e, 2026-08-20.

## Reconciliation table (Rule 43) — every design-review requirement → verdict

| # | Design-review requirement | Verdict | Case(s) |
|---|---|---|---|
| 1 | Seven summary figures, final names, grouped-math left-to-right order, US currency | **updated this pass** | C30487, C43818 |
| 2 | Grouped math: Completed Work on Open WOs + Ready to Invoice = Total Completed Work | **updated this pass** | C30488 (hero/equation), C30520 (strip layout) |
| 3 | Grouped math: Work Orders Not Started + Remaining Work on Open WOs = Remaining Work | **updated this pass** | C30489, C30520 |
| 4 | Per-stage figures tie to their matching tab totals (tab names unchanged this wave) | **updated this pass** | C30490 |
| 5 | Seven locked tooltips (verbatim; Fabian signed off Remaining Work) | **updated this pass** | C30493 |
| 6 | Summary-strip info icons keyboard-reachable + screen-read | **updated this pass** (re-stamped) | C30524 |
| 7 | Estimates counted PER LINE incl. lines awaiting authorization; now UN-GREYED / full opacity | **updated this pass** | C30491 |
| 8 | Summary strip is two grouped equations above the tabs, Estimates apart | **updated this pass** | C30520 |
| 9 | No Adjustments tile in the summary strip | **updated this pass** | C43818 |
| 10 | F&D Adjustments column on WIP (WO-level fees +, discounts −); Total = Earned + Remaining + Adjustments | **already covered** | C43814 (column), C43817 (row Total incl. Adjustments), C43819 (Totals-row sum), C43821 (Completed tab) |
| 11 | F&D Adjustments column on SBC (rows tie out with Adjustments) | **already covered** | C43822 (position), C43823 (signed net of fees/discounts), C43824 (rows tie out) |
| 12 | WIP date range → single "as of" date picker (range presets hidden), snapshot-backed | **already covered** | C30501, C30502 |
| 13 | Same "as of" date on Inventory Value | **already covered (out of WIP scope)** | Inventory Value date cases — confirm on the IV pass; not a WIP case |
| 14 | Tab click puts a faded amber glow behind the composing WIDGET(s) | **new case recommended** | none — see NEW-1 |
| 15 | Labels wrap to two rows (no mid-word truncation) | **new case recommended** | none — see NEW-2 |
| 16 | Asset column hides the "(no unit #)" placeholder — VIN alone when no unit # | **existing case, refinement recommended** | C30470 (already says "VIN alone when no unit"; add explicit "placeholder hidden") — see FLAG-1 |
| — | Active-tab highlight (amber glow) on the tab element itself | **FLAG — needs decision** | C43838 — see FLAG-2 |

## New cases recommended (NOT created)

### NEW-1 — Selecting a bucket tab highlights its composing summary widget(s)
- **Section:** WIP — Summary Strip (4356) or WIP — Tabs (4350).
- **Assertion:** clicking a bucket tab puts a **faded amber glow behind the summary
  widget(s) that compose that bucket** — "Approved - partially completed" → both
  Open-Work-Orders widgets (Completed Work on Open Work Orders + Remaining Work on Open
  Work Orders); "Approved - not started" → Work Orders Not Started; "Completed" → Work
  Orders Ready to Invoice; "Estimates" → Estimates. Only the selected tab's widgets glow;
  switching tabs moves the glow. Confirm the exact amber shade/glow style live (do not
  invent a hex).
- **Partial cover:** none. Distinct from C43838 (which is about the tab element, not the widgets).
- **Source:** design review 13 Aug 2026 "Tab click highlights its widgets".

### NEW-2 — Summary-figure / column labels wrap to two rows without truncation
- **Section:** WIP — Visual & Accessibility (4361).
- **Assertion:** a long figure or column label wraps onto a second row rather than being
  cut off mid-word (no ellipsis / no mid-word truncation).
- **Partial cover:** none found in section 4361.
- **Source:** design review 13 Aug 2026 "Labels wrap to two rows (no mid-word truncation)".

## Flags (existing cases — QA-lead decision, NOT written)

### FLAG-1 — C30470 asset placeholder refinement
[C30470](https://shopview.testrail.io/index.php?/cases/view/30470) already asserts "VIN
alone when no unit #", which matches the design intent, but does not explicitly assert
that the **"(no unit #)" placeholder text is hidden**. Recommend a small `update_case`
clarification. **Not written this pass** — it was outside the HELD Story-5 set and has not
been re-verified live this pass; flagged rather than churned (Rule 41 / "if unsure, flag").

### FLAG-2 — C43838 active-tab amber glow vs widget amber glow
[C43838](https://shopview.testrail.io/index.php?/cases/view/43838) asserts the **active TAB
element** shows an amber glow when clicked. The 13 Aug design review assigns the amber glow
to the **composing WIDGETS** (NEW-1), not to the tab element, and says nothing about a
tab-element glow. So C43838's premise may conflate the two behaviours. **Left UNWRITTEN and
untouched this pass** (proven byte-identical, `updated_on` unchanged). **Decision needed:**
is the tab-element highlight a separate real shell treatment to keep (and confirm live), or
should C43838 be re-scoped to the widget glow (NEW-1)? Until the QA lead rules, C43838 keeps
its old provenance/marker; nothing was inferred from the build.
