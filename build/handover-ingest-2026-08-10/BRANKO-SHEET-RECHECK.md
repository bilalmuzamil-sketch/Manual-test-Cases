# BRANKO SHEET RECHECK — all 20 questions against the two new documents — 2026-08-10

**Sheet under review:** `build/filters/questions-2026-08-06/Questions-for-Branko-Cicovic_Filters-and-Schedule_Friendly-Version_2026-08-06.md`/`.xlsx`
(the forward-as-is version, **20 items**). **DRAFT — still NOT SENT.**

**Sources checked against:** the Filters engineering handover · the Schedule design review of 5 August ·
the **live** Filters spec (page 572030978) · the **live** Schedule spec (page 713031682) · eight Jira
tickets read live, read-only.

---

## THE HEADLINE — read this first

> ## **NO question comes off the sheet. It still has 20 items.**
>
> **But TWO of them were about to go out with a premise we can now prove is FALSE, and both have been
> corrected.** Sending either as written would have invited Branko to answer on the strength of
> something untrue — which is the same embarrassment Rule 55 exists to prevent, arriving from the
> other direction.

**The QA lead's specific suspicion was E11 and Section 2 question 8. I checked it and I do not agree
it settles the question — six reasons are set out in full at S2-Q8 below.** In short: the review's own
gate line says the V1 list was **still due**; the review is **Fabian and Sasha's**, not Branko's; and
**Branko's own specification was edited on 7 August, two days AFTER the review, and still says the
opposite.** Under Rule 32 the later authoritative product source wins, and that is his spec. Removing
the question would mean quietly adopting a reviewer's recommendation over the product owner's own
current document — a **Rule 33 inversion**.

**What I did instead is the thing the review actually changes: it falsifies the question's premise.**
The old text told him the narrower timeline *"is tracked as a later improvement rather than for this
release"*. The review lists it **In Scope: Yes**. So the question now says so, and apologises for the
earlier wording.

---

## The 20 verdicts

| # | Question | Project | Verdict |
|---|---|---|---|
| S1-Q1 | Status button on Estimates / Completed tabs | Filters | **NOT ANSWERED — stays, unchanged** |
| S1-Q2 | Spread across days · shop closures | Schedule | **NOT ANSWERED — stays, unchanged** |
| S1-Q3 | Toolbar search · what happens to non-matching jobs | Schedule | **NOT ANSWERED — stays, unchanged** |
| S1-Q4 | Shift window · can estimated hours be typed into | Schedule | **NOT ANSWERED — stays, unchanged** |
| S1-Q5 | Which drawing of the Schedule is canonical | Schedule | **NOT ANSWERED — stays, unchanged (and strengthened)** |
| S2-Q1 | Where the filter bar sits | Filters | **NOT ANSWERED — stays, unchanged** |
| S2-Q2 | Phone · Imported un-picked in reverse | Filters | **NOT ANSWERED — stays, unchanged** |
| S2-Q3 | Phone · "Apply Filters" capital F | Filters | **NOT ANSWERED — stays, unchanged** |
| S2-Q4 | Parts / Reports write-up timing | Filters | **NOT ANSWERED — stays, PREMISE CORRECTED** ⚠️ |
| S2-Q5 | Left-click or right-click menu | Schedule | **NOT ANSWERED — stays, unchanged** |
| S2-Q6 | Weekends for a tech with no hours set | Schedule | **NOT ANSWERED — stays, unchanged** |
| S2-Q7 | Money total on the job lines in the shift window | Schedule | **NOT ANSWERED — stays, unchanged** |
| S2-Q8 | Full 24 hours or working hours + buffer | Schedule | **NOT ANSWERED — stays, PREMISE CORRECTED** ⚠️ |
| S3-Q1 | Existing shifts survive the release | Schedule | **NOT ANSWERED — stays, unchanged** |
| S3-Q2 | Multi-day job on the Dashboard | Schedule | **NOT ANSWERED — stays, unchanged** |
| S3-Q3 | Appointment appears on the calendar | Schedule | **NOT ANSWERED — stays, unchanged** |
| S3-Q4 | Shifts from another branch | Schedule | **NOT ANSWERED — stays, unchanged** |
| S3-Q5 | Priority High / Medium / Low, nothing pre-selected | Schedule | **NOT ANSWERED — stays, unchanged** |
| S3-Q6 | A limit on spread length | Schedule | **NOT ANSWERED — stays, unchanged** |
| S4-Q1 | The pointer that leads to the wrong paragraph | Filters | **NOT ANSWERED — stays, unchanged** |

**Totals: 20 in · 0 removed · 2 premise-corrected · 18 untouched · 20 out.** Reconciles.

---

## S2-Q8 — the one the QA lead flagged, in full

### What our sheet said (verbatim, before correction)

> *"A note on one of the design-review reports asks for something different: that the timeline show
> ONLY THE WORKING HOURS plus a little after them, with anything outside reached by scrolling.
> **That note says it is tracked as a later improvement rather than for this release**, which is why
> we have left our test alone."*

### What the new document says (verbatim)

> **E11 · "Constrain schedule width to business hours + buffer"** — *"Render only business hours plus a
> small trailing buffer rather than the full 24 hours. After-hours scheduling is an edge case and can be
> reached by scrolling."* · **In Scope? `Yes`** · Area *Schedule view* · Scope signal *"Paired with E10"*.

### What Branko's own specification says (verbatim, live 2026-08-10)

> **§4.8** — *"…The auto-scroll fires only on load or day navigation; if the user scrolls manually, their
> position is not overridden. **The full 24-hour timeline remains intact and scrollable.**"*

### The judgement — six reasons the question stays

**1. The review's own gate line says the V1 list was not decided.** Verbatim from its header:
*"**Gate:** V1 must-have vs. fast-follow list due to Fabian before the **Thursday release decision**."*
An "In Scope?" column filled in *before* the list is due is a **recommendation into that decision**, not
the decision.

**2. The PO's own document is LATER and still says the opposite.** The review is dated **5 August**. Page
713031682 was **last modified 7 August** — two days later — and §4.8 still reads *"The full 24-hour
timeline remains intact and scrollable."* **Rule 32: the most recent authoritative product source wins.**
Here that is the spec, not the review.

**3. Rule 33 precedence.** PO ruling → QA lead → our live findings → a reviewer's claim. **Branko is the
PO for Schedule.** Fabian and Sasha are reviewers, however senior. A reviewer's recommendation does not
overwrite the PO's current document, and treating it as if it did is precisely the inversion Rule 33
forbids.

**4. The document is a second-hand extraction.** Its own source line: *"the review text did not come
through in the original request; findings below are extracted from the meeting record."* That is a
perfectly good input and a poor foundation for deleting a PO question.

**5. "Paired with E10" does not inherit ratification, because E10 needed none.** E10 —
*"Business-hours-aware default viewport… open the schedule at the first business hour, defaulting to
7:00am"* — is **already a spec requirement** (§4.8 *"Auto-scroll to business hours"*), and it has been
there **since at least Confluence v23** (proven: the string appears once in the v23, v24 and v25 mirrors
and in the live body). So E10 was never an open scope question. **E11 is the genuinely new ask, and it is
the one that contradicts the spec.**

**6. Under either answer, only he can act.** Answer B requires **his §4.8 to be edited**. The review
cannot do that and neither can we.

### What changed instead

The premise. The question now tells him the review lists it **In Scope for this release**, that his
description was edited **two days after** and still says the full 24 hours, and it **apologises for the
earlier wording** in his reading text rather than burying the correction on the QA tab.

### The honest counter-argument, stated rather than hidden

**SV-8915's own text said the item was *"Tracked separately on the enhancements list"*, and this document
IS that enhancements list — on which E11 is marked in scope.** So a reasonable reader could conclude the
item has landed in V1 and the question is settled. **I have not taken that reading**, for reasons 1–3
above, but it is close enough that **if the QA lead disagrees, the change is one line and I would make it
without argument.**

---

## S2-Q4 — the second premise correction

**What our sheet said:** *"…they are parked because that part of the product is not built yet and because
your write-up for it has not arrived"* and *"the feature still has to be built before anybody can run
them."*

**What the handover says (verbatim):** the program scope is *"**8 Parts views** — Part Sales, Catalogue,
Return Requests, Return Credits, Purchase Orders, Vendor Invoices (Deliveries), Vendors, Inventory"* and
*"**6 Reports** — Shop Billing Efficiency, My Timesheets, Timesheet Activities (PunchClock), Notes,
Reminders, Sales Tax"*, with *"All committed work is gated green… and the pieces in §5 are
browser-verified"* and *"**Nothing is on a PR yet.**"*

**So "not built yet" is wrong** for the eight Parts views and those six reports. **The write-up half of
the question is untouched and still unanswered** — the live Filters spec carries Parts and Reports only as
Feature-Overview prose and Key Decisions, with **no numbered requirements** for either.

**Corrected, and one sentence added** telling him plainly that several other reports are deliberately not
in this piece of work and that reconciling our tests to that is **our** tidy-up, not his question. The
question itself and its three options are **byte-identical to before.**

---

## Why nothing was removed — the eighteen, briefly

**The Filters handover is silent on every Filters question on the sheet.** It never discusses the Status
chip on the Estimates or Completed tabs (S1-Q1); it never states where the filter bar should sit relative
to the tabs — it says the opposite, that the visual layer is *"not pixel-perfect"* and a PM sign-off is
owed (S2-Q1); it does not mention Imported's reverse de-selection (S2-Q2); it lists FilterBar test ids but
**no apply-filters id at all**, so it says nothing about the capital F (S2-Q3); and it does not touch the
S12-R2 cross-reference (S4-Q1).

**The Schedule design review is silent on every Schedule question except the two above.** It says nothing
about shop closures or the spread step (S1-Q2), nothing about the toolbar search or non-matching blocks
(S1-Q3), nothing about the left-click/right-click menu (S2-Q5), nothing about weekends for a technician
with no configured hours (S2-Q6), and nothing about any of the six engineering-plan-only topics —
pre-existing shifts, the Dashboard, appointments, cross-branch shifts, priority, or a spread-length cap
(S3-Q1…Q6).

**Two near-misses, checked and rejected:**

- **S1-Q4 vs E5.** E5 — *"Use remaining hours, not total estimate… scheduling should be driven by
  remaining hours"* — is about **what quantity drives scheduling**. S1-Q4 asks **whether the estimate field
  in the shift window can be typed into**. Different assertions, different surfaces. **E5 raises a NEW
  question of its own**, carried into `QUESTIONS.md` as B-4.
- **S2-Q7 vs E2.** E2 — *"Per-line hours on hover… 'lhr of 4hr'"* — is the **work-order list panel on
  hover**. S2-Q7 is the **shift detail modal's line rows**. Different surfaces. Not an answer.

**And one that got stronger rather than weaker — S1-Q5.** The review's header cites
`claude.ai/design/p/d3cdcf5c…Schedule.dc.html`, **the same link the live spec's own Design row cites**.
That is suggestive but proves nothing: a share link resolves to whatever the page holds when it is opened,
so it cannot tell us whether that page is final or what it said on 27 July. **Meanwhile the review is
positive evidence the design is still moving** — B4 says a button is *"present in the design and absent in
the QA environment"* and *"needs confirmation… whether it was dropped in build or never scoped"*, and E1
has *"Bronco to design"* still to come. **The question is left exactly as written.**

---

## Mechanics — so the two files cannot drift

Both were **regenerated from `gen_branko_friendly.py`**, not hand-edited:

- `Questions-for-Branko-Cicovic_Filters-and-Schedule_Friendly-Version_2026-08-06.md`
  — md5 `2d5524146c…` → `1d44fa5903…`
- `Questions-for-Branko-Cicovic_Filters-and-Schedule_Friendly-Version_2026-08-06.xlsx`
  — md5 `f4853fa408…` → `c9376d3678…`

**Diff verified line by line: exactly 20 changed lines, all inside the two corrected blocks, and no other
line in either file moved.** Item count unchanged at 20; section structure, ordering, opening note and the
QA-only tab all untouched.

**No "REMOVED" row was added to the QA-only tab, because nothing was removed.** Both corrections are
stated **openly in the text Branko reads**, which is better than a QA-tab footnote he will never see: he
is the person best placed to notice if a correction is itself wrong.

**The earlier non-friendly pair in the same folder was already bannered as superseded and was NOT
touched.** It still carries the two uncorrected premises, so **the friendly pair is the only one that may
be sent.**

---

## What to do now

1. **Send the friendly pair.** Do not forward the QA-only tab.
2. **If you disagree with the S2-Q8 judgement, say so and I will drop the question** — it is one line in
   the generator and I would not defend it past your ruling (Rule 33).
3. **The non-friendly pair should get a second banner line** naming the two corrected premises, so it
   cannot be sent by mistake. **Not done — it is outside this pass's write scope.**
