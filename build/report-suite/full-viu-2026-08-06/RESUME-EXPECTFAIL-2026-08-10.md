# RESUME — where the expect-fail audit stopped, 2026-08-10

**Read `EXPECT-FAIL-AUDIT-2026-08-10.md` first for the findings, then this file for the next action.**

## Build

`v3.5-4795eee` · last-mod Fri 07 Aug 2026 13:10:42 GMT · etag `a80113cf3856c5fedf63be893e8b41c7`.
**Read three times — 16:14:25Z (start), 16:31:17Z (before the first write), 16:37:24Z (end). All three
byte-identical: sha256 `a4ea53ed…13e8f`. THE BUILD MOVED ZERO TIMES.**

## The number, stated honestly

**53 expect-fail cases existed at the start. 10 have been checked whole. 43 have not.**

| | Count |
|---|---:|
| **Checked whole against `v3.5-4795eee`** | **10** |
| — now PASS (fix shipped, marker cleared) | **3** |
| — still fail, same symptom (marker kept, build re-stamped) | **5** |
| — still fail, but a SECOND failure surfaced underneath | **1** (C30518) |
| — partly checked, deliberately NOT closed | **1** (C30421) |
| **Not yet checked** | **43** |

**Marker census, live:** READY **152** · READY - EXPECT FAIL **50** · HOLD **23** = **225**.
(Was 149 / 53 / 23 — the three flips are the whole movement.)

**Build stamps, live:** only **13 of 225** cases carry `v3.5-4795eee` in their own provenance line.
The other 212 still name an older build — `v3.5-16cf83f` (92), `v3.5-7168d14` (66), `v3.5-f77875c`
(40), `v3.4.1-3d03023` (12), and **2 carry no build line at all**.

## What was written — 8 `update_case`, nothing else

**Every write re-read and byte-compared: 30 fields each, 4 intended, 0 mismatches, 0 collateral.**
**0 `add_case`, 0 `delete_case`, 0 section ops, 0 run writes, 0 results** — and **nothing created
anywhere**, per the standing hold.

Flipped to `AUTOMATION: READY` (symptom block removed, provenance re-stamped, stale spec version
corrected): **C30410 · C30423 · C30510**.
Re-stamped, marker deliberately kept: **C30424 · C30418 · C30468 · C43557 · C30523**.

**Run 359 (Nebojsa's and Viktoria's) PROVEN UNTOUCHED BY CONTENT** — `include_all` still false,
**476 tests**, case_id **and** test_id sets equal in **both** directions, **all 535 results present by
ID**, **0 graded-field changes**, **0 new results**. Checker: `evidence/…/run359b.py`.

## THE EXACT NEXT ACTION

**Continue the expect-fail sweep at the 43 unchecked cases.** They are listed with their tickets in
`evidence/expectfail-2026-08-10/ef.json` (field `ticket`). Work ticket by ticket, not case by case —
cases sharing a ticket usually share a symptom, but **verdict each case separately** (SV-8947 split:
one case passes, its sibling still fails).

**Start with the two biggest untouched clusters, because both are cheap and both are likely stale:**

1. **The remaining 5 SV-8907 cases** — C30511 · C30512 · C30513 · C30514 · C30518.
   **SV-8907 IS FIXED, so all five of their symptom blocks are wrong as written.** Exports now work,
   so each is now *drivable* where before it was blocked. C30518 already has its answer half-written
   (below). The others need: money formats in the file, the Inv. Hrs green/red rule (screen and PDF
   but never CSV, S9-R7), Days Open frozen at generation (S9-R8), and the Inv. Hrs export refusal.
2. **The 17 Sales By Customer expect-fail cases — NOT ONE has been touched this pass.**

### The three working methods, so they are not re-derived

- **Route:** `page.goto(APP+'/reports/<report>')` — **`spaGo()` bounces to `/timesheets`.**
- **A synthetic `.click()` silently does nothing on this build.** Technician Utilization headers are
  **not** Quasar-sortable; the sort control is `span.tu-sort-label`
  (`data-test-id="header_tu_total_hours"` etc). **This is what made the previous session read
  SV-8946 as fixed when it is not.** Always prove the UI *changed* — row order, row count, a total —
  before believing a request count.
- **Working drivers are committed** in `evidence/expectfail-2026-08-10/`: `tu5.mjs` (sort),
  `tu9.mjs` (technician filter), `wip4.mjs` (export + file capture), `wip7.mjs` (empty-tab export).

## Open, and needing the QA lead

1. **Defect 6 in `DEFECTS-FOR-PERMISSION.md`** — the WIP empty-export silent no-op. **Not filed**
   (creation hold). It is the reason **C30518 cannot be finished**: it needs a ticket number for an
   expect-fail marker, and creating one is barred.
2. **C30518 is left as-is deliberately.** Its symptom block is now **wrong** (it says nothing
   downloads; downloads work). Correcting it means either inventing a ticket reference or moving it
   to `HOLD`, and **that is a judgement call worth his ruling rather than a guess.**
3. **The three cases already on `HOLD` only for want of a ticket** are unchanged and still blocked.
