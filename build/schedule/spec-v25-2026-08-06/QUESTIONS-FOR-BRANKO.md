# Questions for Branko Cicovic — 2026-08-06

> Written per **Standing Rule 55**: **the project and the feature are named on every question row**,
> because Branko owns **Filters, Schedule AND Global Search** and a question read on its own must still
> be unambiguous. Plain words only — **no case IDs, no section numbers, no technical terms** in anything
> he reads (Rule 7). The QA-only mapping is in the last section, off the reader-facing view.
>
> **Every question below is NEW today and comes from spec versions 24 and 25, published this morning.**
> **These are additional to the 13 questions already written and waiting to be sent** in
> `build/schedule/branko-questions-2026-08-05/Questions-for-Branko-Cicovic_Schedule-and-Filters_2026-08-05.xlsx`
> — **that sheet has still not been sent, and the blocker on it is us, not him.** Ideally these four
> are added to it so he answers everything in one sitting rather than in a drip.

---

## Question 1

| | |
|---|---|
| **Project** | ShopView **Schedule** |
| **Feature** | The **search box in the schedule toolbar** (the one above the calendar grid, not the one in the left-hand list) |

**What happens now:** The product write-up used to say that when you search, the jobs that do not
match go **faded but stay on screen**, so you keep sight of the whole week. Your team decided the
write-up was wrong and took that sentence out this morning. The write-up now says only that the search
**matches on** customer name, work order number, unit number, technician name and line name — it no
longer say anything about what happens to the jobs that do **not** match.

**The question:** When someone searches, what should happen to the jobs that do not match?

**Options:**

- **A)** They disappear from the grid completely — only matching jobs are shown.
- **B)** They stay on screen but faded, and the matching ones stand out.
- **C)** Something else (please describe).

**Your answer:** ____________________

**One more thing, in the same place:** the ticket that describes this feature to the developers
(*"Schedule Grid Layout & Navigation"*) **still says the non-matching jobs should fade** — in two
places. If your answer is **A**, that ticket now disagrees with the write-up and someone should tidy it
up. We have not changed it, because it is not ours.

---

## Question 2

| | |
|---|---|
| **Project** | ShopView **Schedule** |
| **Feature** | The **pop-up window that opens when you click a scheduled job** |

**What happens now:** You told us this morning that the little **estimate badge should not be
clickable**, and that the time is changed in the fields higher up the window instead. That makes sense
to us. But the product write-up **still says** the pop-up should let you **type a new estimate
straight into it**, and so does the developer ticket for that window. So we cannot tell whether your
answer covers **both** things or only the small badge on the job line.

**The question:** In this pop-up window, should the person be able to change the **estimated hours**
by typing into that field?

**Options:**

- **A)** No — the estimate cannot be changed here at all; only the start and end times can be changed,
  in the fields above.
- **B)** Yes — the estimate itself can still be typed into; only the little badge on the job line
  should not be clickable.
- **C)** Something else (please describe).

**Your answer:** ____________________

**Why we are asking rather than guessing:** we have one test that says this field **can** be typed
into. If your answer is **A** that test is wrong and we will correct it. If your answer is **B** the
test is right and the developers have something to fix. **We are not going to decide it by looking at
what the software currently does**, because that would tell us what was built, not what was wanted.

---

## Question 2b

| | |
|---|---|
| **Project** | ShopView **Schedule** |
| **Feature** | The **list of jobs inside that same pop-up window** |

**What happens now:** You said the job lines should show *"the estimate and the status badge and there
shouldn't be totals"*, and the write-up was changed this morning to match. Good — that is what our
tests already expect. There is just one word we want to be sure about: the write-up now says each line
shows **"labor/status figures"**, and we cannot tell whether **"labor"** there means the **number of
hours** (which we do expect to see) or a **money amount for labour** (which we expect **not** to see).

**The question:** On each job line in that pop-up, which of these should the person see?

**Options:**

- **A)** The number of hours and a status label — and no money at all.
- **B)** The number of hours, a status label, **and** a labour amount in dollars.
- **C)** Something else (please describe).

**Your answer:** ____________________

---

## Question 3

| | |
|---|---|
| **Project** | ShopView **Schedule** |
| **Feature** | The **day view** — how wide the timeline is when it opens |

**What happens now:** The product write-up says the day view keeps the **whole 24 hours** available and
scrollable, and simply scrolls itself so the start of the working day is on the left. A note on one of
the design-review tickets asks for something different — that the timeline show **only the working
hours plus a small amount after them**, with anything outside that reachable by scrolling. That note
says it is being tracked as a future improvement rather than for this release.

**The question:** For **this** release, which is correct?

**Options:**

- **A)** Keep the full 24 hours, as the write-up says today — the narrower version is for later.
- **B)** Change it now to show only the working hours plus a small amount after them.
- **C)** Something else (please describe).

**Your answer:** ____________________

---

## Question 4 — this one is for the QA lead first, not for Branko

**Do not send this to Branko until the QA lead has seen it.** It is a process question about which
document wins, and it may change how the whole Schedule suite is sourced.

**What happened:** Twice today, people told us the **design** is the document that decides:

- Branko, on the estimate-badge ticket: *"Please always check the design as it is single source of
  truth."*
- Stefan, on the search ticket: *"per design we show only shifts/events that are matching the search.
  This is a gap between PRD and design."*

**And it had a real effect:** the second one led to a requirement being **removed from the product
write-up** the same morning.

**Why it matters to us:** our whole method takes expected behaviour from the **product write-up, the
developer tickets, and the product owner's answers** — and takes only the **on-screen wording** from
the design. If the design outranks all of those, then **a design we cannot name, date, or confirm is
final is now the top authority on this project** — and roughly **48 of our on-screen labels came from a
design copy taken on 27 July** that may not be the same document the design review was looking at on
5 August.

**The question for the QA lead:** should we treat the design as the deciding document on Schedule, and
if so, do we now need the design named, dated and confirmed final before the next pass?

---

## QA-only mapping — not part of what Branko reads

| Q | Case(s) affected | Current state | What his answer changes |
|---|---|---|---|
| **Q1** | **SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** | Asserts fade/highlight — the requirement was **deleted at Confluence v24**. Marker is `AUTOMATION: READY - EXPECT FAIL (SV-8874)`, and **SV-8874 is now closed OBSOLETE**, so the marker is wrong whatever he answers. | Decides what the case should assert positively. Answer **A** → assert non-matching blocks are removed, marker becomes `READY`. Answer **B** → the build has a real defect and SV-8874 was closed wrongly. Also: **SV-8686** needs correcting by its owner (Rule 38 — not ours to edit). |
| **Q2** | **SCH-MODAL-05 = [C30012](https://shopview.testrail.io/index.php?/cases/view/30012)** | Asserts inline editing of estimated hours, marker `AUTOMATION: READY` — i.e. we expect a **pass**. **v25 §4.9 and SV-8695 both still require it**; Branko's 2026-08-06 comment on **SV-8829** appears to contradict it but is ambiguous in scope. Proposed `HOLD` in the meantime. | **The difference between a case that passes and a case that fails on the same build.** Answer **A** → the case is wrong and must be rewritten; the spec line and SV-8695 are both stale. Answer **B** → the case is right and SV-8829 was closed wrongly. |
| **Q2b** | **SCH-MODAL-04 = [C30011](https://shopview.testrail.io/index.php?/cases/view/30011)** | Asserts *"a status pill only"* and *"no labor figures and no total dollar amount"* while also requiring *"hours"*. **v25's new phrase is "labor/status figures"** — the word *labor* survives, so our own text is doing two jobs with one term. | Removes an ambiguity in our own wording. Neither answer changes the case's substance; **A** confirms it as written, **B** would mean item 3 needs re-wording. |
| **Q3** | **SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** | Correct against **v25 §4.8** as written, and already covers the full start-time hierarchy. **No change proposed.** | Only matters if he picks **B**, which would make v25 §4.8's *"full 24-hour timeline remains intact"* wrong and need a spec edit before any case change. Asked so we are not relying on a ticket note that contradicts the live spec. |
| **Q4** | Potentially **~48 design-pinned labels** across the suite | Design source is **PARTIAL** under Rule 31 (`DESIGN-SOURCE.md`). | Whether Rule 57's three-source list needs amending for this project, and whether register row **C3** escalates. |

**Nothing in this sheet has been applied to TestRail.** All of it waits on answers plus the QA lead's
go-ahead (Rule 6).
