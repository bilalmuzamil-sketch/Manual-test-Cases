# ⚠️ ADDENDUM — FOUR MORE SPECS MOVED WHILE THIS PASS RAN, AND THEY REVERSE PART OF IT

**Found at 14:23:34Z by the end-of-pass source re-read (Standing Rule 31).** This is the most important
thing in the folder. **Read it before acting on anything else in this pass.**

## 1 · What happened

| Spec | Version this pass USED | Version at 14:23:34Z | Moved? |
|---|---|---|---|
| Sales By Customer | v14 | v14 | same |
| Parts Velocity | v5 | v5 | same |
| **Sales By Representative** | v15 | **v16** | **MOVED** |
| **Technician Utilization** | v5 | **v6** | **MOVED** |
| **Work In Progress** | v6 | **v7** | **MOVED** |
| **Inventory Value** | v3 | **v4** | **MOVED** |

All four carry the same version message: **"Applied QA review workbook decisions (2026-08-04)"**. Chris Ward
worked through **all six specifications during this pass** — SBC at 13:07Z, PV at 13:21Z, and these four
between 13:55Z and 14:23Z.

**The build did NOT move:** `v3.5-16cf83f`, and `index.html` is **byte-identical at 13:20:39Z, 13:55:25Z and
14:23:34Z** (one sha256 across all three reads). So the specs moved under us; the product did not.

## 2 · What it reverses — stated plainly, because it goes against this pass

**Every one of the four now ratifies the ACCESS-GATE + TOGGLEABLE model for the Location column**, quoting
their own changelogs verbatim:

> "Location column changed to an **access gate** and **made toggleable in the column selector** (any user
> with access to more than one location sees it by default; single-location-access users never see it)"

**Technician Utilization v6 S10-R4 — the exact anchor this pass cited — has FLIPPED:**

| | |
|---|---|
| **v5, which this pass cited** | "The per-row Location column is **not one of the toggleable columns**… and is **never listed in the column selector**." |
| **v6, live now** | "The per-row Location column **is one of the toggleable columns** for a user with access to more than one location: it is **shown by default and can be toggled on or off from the column selector** (S9-R9)." |

**Work In Progress v7 S4-R3 has likewise flipped:** "The Location column **is offered in the column
selector** to any user with access to more than one location; for that user it is **shown by default and can
be toggled on or off**."

**So the boilerplate paragraph this pass removed from 13 cases is now, for at least two of those reports,
what the specification says.** That must be said in exactly those words. **The audit's classification was
correct against the sources as they stood when it ran (13:20–13:55Z) and is now partly overtaken.**

## 3 · What is STILL contradictory — three of the six

Chris updated the Key Decisions and the summaries but **left stale requirement text behind in three specs**:

| Spec | The requirement that still says the OPPOSITE, verbatim | Contradicts |
|---|---|---|
| **SBR v16** | **S21-R7**: "A per-row Location column is shown on the report **only when the current view spans more than one location**… When the view is scoped to a single location the column is hidden." | its own Key Decision + changelog |
| **WIP v7** | **S7-R13**: "…is hidden whenever a single location is in scope; **the user does not toggle it in the column selector**." | its own **S4-R3**, updated in the same version |
| **IV v4** | **S7-R6**: "Its visibility follows the location scope automatically and **it is not one of the columns offered in the column-selection control**." | its own Key Decision + changelog |
| **SBC v14** | **S13-R4**: the toggle list is "**exactly** nine" columns, Location not among them | its own **S4-R12** |
| **PV v5** | **S3-R10**: "**is not user-toggleable**" | the model now ratified in the other five |

**So four of the six specifications still state it both ways, and Parts Velocity has not been changed at all
on this point.**

## 4 · Why the cases are SAFE, and what is owed

**The 16 Location cases carry `AUTOMATION: HOLD - waiting on one answer from the product owner about the
Location column`.** That is the saving grace and it was not luck — it is what holding an ambiguous point
instead of asserting it is *for*. **No tester and no automation engineer will act on the wrong expectation,
in either direction**, because every one of those cases says the question is open and names the sheet.

**What is owed — one authorised follow-up pass:**

1. **Re-diff all four moved specs properly** (SBR v15→v16, TU v5→v6, WIP v6→v7, IV v3→v4), one verdict row
   per changed requirement (Rule 43). **Not done here** — they moved after the writes.
2. **Re-repair the 13 Location cases to the access-gate + toggleable model**, which is now the documented
   expectation in at least SBC, SBR, TU, WIP and IV.
3. **Re-stamp the provenance versions:** SBR → **16**, TU → **6**, WIP → **7**, IV → **4**. Every case in
   those four reports now names a version one behind.
4. **Ask Chris to clean up the four leftover contradictions in §3** — that is the only reason the cases
   cannot come off HOLD immediately, and it is now a much smaller ask than before: he has decided, he just
   has not finished editing.
5. **Ask Chris directly about Parts Velocity**, the one report he has not touched on this point.

## 5 · The lesson, which is Rule 31's and it just cost us a pass

**A source can move in the minutes between reading it and acting on it, and a PO working through a review
workbook will move all six in one sitting.** SBC moved 13 minutes before the first fetch; PV moved **one
minute** before it; the other four moved **during the write pass**.

**What worked:** re-reading every source at the END of the pass, which is what Rule 31 requires and what
caught this. **What did not:** reading them once at the start and treating that as the pass's baseline.

**The concrete change to make:** on any pass expected to run longer than about an hour while a PO is
actively editing, **re-read the sources immediately before the writes begin — not only at the start of the
pass — and again at the end**. Had that been done at ~14:00Z, the 13 Location repairs would have been
written the other way round the first time.
