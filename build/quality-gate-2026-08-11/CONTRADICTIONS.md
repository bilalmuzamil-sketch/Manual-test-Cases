# CONTRADICTIONS — Stage 2b cross-case consistency sweep — 2026-08-11

**Standing Rule 28 Stage 2b, run over the 240-case population.** Stage 2a reads each case alone and
**cannot** catch these; this stage exists because a suite once scored 100% SENSIBLE case by case
while its cases contradicted each other, and a junior QA spotted it cold.

**All four mechanical helpers were run, plus the surface check.**

| Helper | What it did | Result |
|---|---|---|
| **(i)** opposite-assertion keyword sweep | grouped by the control asserted on; swept hidden/shown, enabled/disabled, present/absent, real-time/on-Apply, editable/locked, persists/resets, included/excluded | **1 group found** — the WIP download family |
| **(ii)** TITLE vs EXPECTED, inside every case | compared each title against its own preconditions/steps/expected | **1 found** — C30102 |
| **(iii)** same-anchor clustering | grouped by the `refs` anchor and diffed the expectations of every case sharing one | **1 found** — C29624's `refs` vs its own expected result |
| **(iv)** surface-split check | for each anchor cluster, verified every surface the requirement names has a case | **0 missing surfaces** in the population |

**FOUND: 3 contradiction groups, covering 11 cases. RESOLVED: 1. ESCALATED: 2.**
Standing Rule 28's delivery bar is met — **no group is left silent**: one is aligned, and two are
**explicitly flagged**, one PENDING a build observation and one PENDING nothing more than a decision.

---

## CONTRADICTION 1 — the Work In Progress download family · **9 cases** · 🔴 **UNRESOLVED, ESCALATED**

**The group:** [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) ·
[C30511](https://shopview.testrail.io/index.php?/cases/view/30511) ·
[C30512](https://shopview.testrail.io/index.php?/cases/view/30512) ·
[C30513](https://shopview.testrail.io/index.php?/cases/view/30513) ·
[C30514](https://shopview.testrail.io/index.php?/cases/view/30514) ·
[C30515](https://shopview.testrail.io/index.php?/cases/view/30515) ·
[C30516](https://shopview.testrail.io/index.php?/cases/view/30516) ·
[C30517](https://shopview.testrail.io/index.php?/cases/view/30517) ·
[C30518](https://shopview.testrail.io/index.php?/cases/view/30518)

**The control under test:** the Work In Progress three-dot menu's *Download (PDF)* / *Download (CSV)*.

**Both assertions quoted side by side (Rule 45(e)):**

> **C30510, expected item 2** — *"Each option downloads a file of the current tab in the chosen
> format."* · marker **`AUTOMATION: READY`** (expected to pass)

> **C30512, C30513, C30514, C30518** — *"Nothing downloads. Both Download (PDF) and Download (CSV)
> fail on every tab that has any work orders in it - no file arrives and a red message appears…
> All four tabs behave the same way."* · marker **`AUTOMATION: READY - EXPECT FAIL (SV-8907)`**

**Can both be true of the same build at the same time? No.**

**How it arose — measured, not guessed.** At the pre-today baseline `43930ee3`, **8 of the 9 carried
`READY - EXPECT FAIL (SV-8907)`**. Today four were flipped to plain `READY` (C30510, C30515, C30516,
C30517), one was moved *into* `EXPECT FAIL` from `HOLD` (C30511), and four were left. **The family
was split down the middle in a single day.**

**RESOLUTION BY RULE 33 — and it stops at tier (c), which is why this is escalated rather than
settled.** There is no PO ruling and no QA-lead ruling on whether SV-8907 is fixed. The next tier is
**our own live-observed evidence — and there is none from today**: every Report Suite pass recorded
`HTTP 401 sso_required` and opened nothing. The only written basis for the flip is a narrative
sentence in `automated-cases-changed-2026-08-11/FOR-VLAD.md` (*"The problem behind them … has been
fixed"*) in a document derived by **diffing case text**, not by observing the product.

**⚠️ Under Standing Rule 61, ticket status is never evidence about the build, so SV-8907 being Open
or Closed does not settle it either.**

**WHAT SETTLES IT:** one download attempt on any Work In Progress tab that has rows. Until then the
group stays flagged. **Nothing was changed** — picking a side here would be inventing a build fact
(Rules 12/57/58).

---

## CONTRADICTION 2 — C30102's title against its own expected result · **1 case** · 🟠 **ESCALATED**

**Found by helper (ii), the check that exists precisely for this.**

> **TITLE:** *"Date range picker offers **nine periods in the specified order**, no All Time"*

> **EXPECTED, in full:** *"1. A date range picker is visible in the report toolbar. **3.** The named
> periods use the application's standard shared calendar boundaries… **3.** There is no "All Time"
> option."*

**The numbering runs 1, 3, 3 — item 2 is missing, and with it the only item that would have
enumerated the nine periods.** The title therefore promises coverage the body does not provide, and a
reviewer scanning titles would count this requirement as covered.

**Honest dating: this PREDATES today.** The same 1, 3, 3 sequence is in the pre-today baseline, so it
is not a regression from today's work — but the case **was** touched today, and Standing Rule 41
makes the whole case the toucher's business, so it is a legitimate finding of this gate.

**RESOLUTION:** the winner is unambiguous — **three sibling cases in the same suite carry the full
sentence** (`IV-DATE-01`, `PV-FILT-03`, `WIP-FLT-04`), all sourced to Chris Ward's 8/5 decision:

> *"The chooser offers nine ready-made periods, in this order: Last 12 Months, This Year, Last Year,
> This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week…"*

**Not written**, because restoring a lost requirement item is authoring rather than repair, and the
population's own [C30160](https://shopview.testrail.io/index.php?/cases/view/30160) shows the nine
periods are still current for this report — so the restore is a copy-paste the QA lead can authorise
in one line.

---

## CONTRADICTION 3 — C29624's `refs` against its own expected result · **1 case (+6 carrying the same stale note)** · 🟢 **RESOLVED — the case body is right**

**Found by helper (iii), same-anchor clustering.**

> **`refs`:** *"individual-chip real-time per S12-R2 + S2-R6 + tech-plan…; only the combined All
> Filters sheet is batch; CONFIRMED by Branko answers 2026-08-04 Q1"* — i.e. the single-filter sheet
> should apply **instantly, with no Apply button**.

> **Expected result, item 3:** *"the work order list does NOT change while you tick - your choices
> are only being held, not applied yet"*, and its symptom block calls instant-apply the **failure**.

**RESOLUTION BY RULE 32 — the expected result wins, and it already does.** Branko settled this on
**5 August** (SV-8825, closed by him: *"This is updated in the filters prd, I'm closing it."*), and
spec **v19 S12-R6** covers a single filter's sheet. The `refs` note is the **superseded 4 August**
position that was simply never removed. The same stale clause is appended to
[C29621](https://shopview.testrail.io/index.php?/cases/view/29621),
[C29623](https://shopview.testrail.io/index.php?/cases/view/29623),
[C29625](https://shopview.testrail.io/index.php?/cases/view/29625),
[C29626](https://shopview.testrail.io/index.php?/cases/view/29626),
[C29627](https://shopview.testrail.io/index.php?/cases/view/29627),
[C29628](https://shopview.testrail.io/index.php?/cases/view/29628).

**The group is already aligned to the winner in every tester-facing field** — all seven cases'
expected results follow the 5 August ruling. **`refs` is metadata; a manual tester never sees it**, so
nobody is misled tomorrow. Left as a P3 tidy-up rather than written, because `refs` is the field two
passes re-pinned today (20:55 and 21:13–21:31) and cutting across that on release eve to correct a
metadata note is the worse trade.

---

## CHECKED AND CLEARED — pairs that look contradictory and are not

Recorded because each cost real time to rule out, and the next reader should not spend it again.

| Pair | Why it is NOT a contradiction |
|---|---|
| [C29942](https://shopview.testrail.io/index.php?/cases/view/29942) / [C29945](https://shopview.testrail.io/index.php?/cases/view/29945) (Priority filter EXISTS) vs [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) (`HOLD - the Priority field … does not exist`) | Different surfaces. The **sidebar filter panel** can offer a Priority group while the **work-order form** has no field to set one. Both are true; the 4 Aug live check saw the group with all three counts at **0**. What it *does* produce is C29945's unreachable precondition — **P1-2**, a runnability defect, not a contradiction |
| [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) (combined sheet HAS an Apply button) vs [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) (single sheet's button is missing → EXPECT FAIL) | Different sheets. S12-R6 requires deferred apply on both; the build defers only on the combined one. Consistent |
| [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) (`HOLD`, Location rule not followed) vs [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) (`READY`, same rule) | Different reports. C38912's own note scopes the observation to *"all three handed-off reports"*; C38913 is Sales By Representative, which is not one of them |
| [C30425](https://shopview.testrail.io/index.php?/cases/view/30425) steps say *"All technicians"*, expected says *"Select all"* | **Correct Rule 9/57 practice, not a defect.** Steps carry the build label so the tester can find the control; the expectation carries the documented requirement; the symptom block bridges the two and names the difference |
| [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) steps say *"Back To My Saved Filters"*, expected says the spec calls it *"Back to my view"* | Same pattern, and the case explicitly tells the tester not to fail on the wording alone |

---

## A DETECTOR THAT DID NOT WORK — reported so it is not trusted next time

A broad cross-reference was tried: harvest every `(C-id, SV-ticket)` pair co-occurring on a line
containing *DEVIATION / FAIL / defect / regression* anywhere in today's markdown, then flag any
population case marked plain `READY`. **It returned 46 cases and was almost entirely noise** — most
hits were stale co-occurrences in old findings documents for tickets since fixed (SV-8824, for
instance, whose known-issue lines were correctly removed from 12 Filters cases on 5 August).

**It is recorded here as a rejected method.** Reporting those 46 would have been a false alarm of
exactly the kind this audit exists to prevent, and it is the reason every finding above rests on a
case's **own text** or on a **named primary record**, never on a keyword co-occurrence.
