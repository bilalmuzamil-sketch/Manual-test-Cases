# RUNNABILITY — can a tester run the Report Suite tomorrow morning?

**Build `v3.7-4626299` · 480 ours / 492 live · 12 August 2026**

## The short answer

**Yes for the routes, not yet for the data.**

**472 of 480 cases** had every screen, tab and control their steps name **reached and operated** on the
running build. A tester will not open one of these tomorrow and find a missing button, a dead menu or a
screen that is not there. That is the question that was asked, and it is answered.

**But the preconditions are a different story, and they are the weaker half.** This suite's
preconditions are prose data-states — *"a rep whose invoices span two locations"*, *"the Deactivate
dialog is open for a rep with assignments"*, *"a technician whose unrounded hours land on a rounding
tie"*, *"the same part stocked at two locations with different Min/Max"*. **Those were not individually
established**, and the honest consequence is that I cannot promise a tester will get through a case
end to end, only that they will not be stopped by the interface.

## What was actually done, per report

| Report | Cases | Route walked | Notes |
|---|---:|---:|---|
| Work In Progress **(final)** | 81 | 81 | 4 tabs all switch the table (18 / 6 / 7 / 18 rows); sorting works |
| Technician Utilization **(final)** | 60 | 52 | expand-all works (4 → 7 rows); **sorting NOT established** |
| Sales By Customer **(final)** | 88 | 88 | 14 rows; all 3 sorted columns reordered; expand-all works |
| Sales By Representative | 112 | 112 | expand-all works; 2 of 3 sorted columns reordered |
| Parts Velocity | 71 | 71 | **sorting NOT established** — 0 of 3 reordered |
| Inventory Value | 68 | 68 | 33 rows |
| **TOTAL** | **480** | **472** | |

The 8 not route-walked are Technician Utilization cases that turn on sorting.

## The five checks, and how each came out

1. **Is the precondition reachable?** — **the weak one.** Not individually established; ~106 cases name
   a seeded data state and ~91 name an app or data state. See the caveat below.
2. **Does the navigation path exist?** — **yes**, on all six. Each report was reached by clicking its
   entry in the reports navigation, exactly as the cases' step 1 says, not by typing a URL.
3. **Is each named control where the step says it is?** — **yes.** Every toolbar control on every
   report was opened by its exact test-id and its contents read.
4. **Do the steps work in the order written?** — **yes** for the routes driven: tab → table, filter →
   panel, header → reorder, expand → more rows.
5. **Are the labels the ones on screen?** — **yes**, read from the **rendered** text, not `textContent`.

## The caveat that must travel with the number

I classified preconditions by pattern and then **hand-audited two random samples of 8**. The first
found **4 of 8** with a precondition this session never established. After tightening the patterns,
**about 3 of 8** still did. **So any single "steps and preconditions walked" figure from this pass
over-counts**, and I have not published one as a result. The machine number is 253; treat it as an
upper bound with a known error rate, not an achievement.

**This is itself the most useful finding for tomorrow:** the interface is in good shape; the
*test data* is what will strand a tester, and confirming it is a bigger job than checking controls.

## What would actually strand a tester tomorrow

- **2 Sales By Customer cases** whose filter options do not exist — now carrying `EXPECT FAIL (SV-9074)`
  with the symptom spelled out, so they fail informatively instead of stranding anyone.
- **1 Sales By Representative case** whose step 8 cannot be performed — now carrying a note telling the
  tester to mark that step blocked and record the rest.
- **~9 cases needing a second sign-in**, ~9 dark mode, ~6 a phone, ~6 a logo state — all already held
  or known.
- **Everything else that stops them will be data**, not the build.
