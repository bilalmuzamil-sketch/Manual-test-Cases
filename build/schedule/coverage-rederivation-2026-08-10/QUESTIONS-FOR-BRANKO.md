# Questions for Branko Cicovic — 2026-08-10

**Branko owns three things — Filters, Schedule and Global Search — so every question below names its
project and its feature on its own row** (Standing Rule 55). A row read on a phone, days later, out of
order, still has to be unambiguous.

**There are only TWO new questions in this pass, and that is deliberate.** A 20-item sheet for Branko
already exists at `build/filters/questions-2026-08-06/` and **has not been sent**. Adding a third
sheet before the second one has gone out would be noise. Everything this pass found that needs Branko
is either **already on that sheet** (listed below so it is not re-asked) or is one of the two genuinely
new rows.

---

## THE TWO NEW QUESTIONS

### S-1 · SCHEDULE (the technician scheduling calendar) — the little pop-up on the workload bar above each day

**Story:** the capacity story, [SV-8698](https://shopview.atlassian.net/browse/SV-8698), under epic
[SV-8685](https://shopview.atlassian.net/browse/SV-8685)

**What happens now.** Above every day on the calendar there is a small bar showing how full the shop's
day is. When you hover over that bar, a little pop-up appears listing technicians and how many hours
each one has been given against the hours they are available for.

**The question.** On 7 August your description changed one word about that pop-up. It used to say the
pop-up lists the technicians; now it says it lists the **assigned** technicians. On a shop with 15
people where only 3 have work booked that day, those two readings look quite different on screen.
**Which one did you mean?**

| | |
|---|---|
| **A** | The pop-up should list **only the people who have work booked that day** — so on the example above it shows 3 rows. |
| **B** | The pop-up should list **everybody in the shop**, including people with nothing booked, showing 0 hours against their availability — so on the example above it shows 15 rows. |
| **C** | Something else — please describe it. |

**Your answer:**

*(Why we are asking rather than guessing: the wording had been the same since the first version of your
document in July, the change was made without a note explaining it, and it decides whether one of our
tests passes or fails. Our test today says "the technicians" and would accept either.)*

---

### S-2 · SCHEDULE (the technician scheduling calendar) — whether the calendar remembers that you hid the job list

**Story:** the calendar layout story, [SV-8686](https://shopview.atlassian.net/browse/SV-8686), under
epic [SV-8685](https://shopview.atlassian.net/browse/SV-8685)

**What happens now.** Your description of 7 August adds a new button that hides and shows the job list
down the left-hand side of the calendar, giving its space to the calendar. It says the setting is
*"session-scoped per user"* — in plain words, the calendar remembers it while you are signed in, but
forgets it once you sign out.

**Separately**, the design review of 5 August asks for view settings to be *"stored at the user level
so they survive across sessions"* — in plain words, remembered even after you sign out and come back.

**The question.** For **this one button** — the one that hides the job list — which should it be?

| | |
|---|---|
| **A** | Remember it **only until I sign out**, exactly as your description says today. |
| **B** | Remember it **for good**, so it is still hidden next time I sign in. |

**Your answer:**

*(This is not the same as the question about remembering the other view settings, which is already on
the earlier sheet. We are asking about this one button because your description and the design review
give different answers for it, and we would rather ask than pick one.)*

---

## ALREADY ASKED — on the sheet of 6 August, not yet sent. **Please do not re-ask these.**

The sheet is `build/filters/questions-2026-08-06/Questions-for-Branko-Cicovic_Filters-and-Schedule_2026-08-06.xlsx`
— 20 items, 8 of them Schedule. **It has never left our hands, and that is on us, not on Branko.**

| On the sheet | Subject | Why this pass needed it |
|---|---|---|
| Tab 2, Item 1.0 | planning a job across several days — **shop closures** | your document says two opposite things (§12 vs §4.5); **two of our tests are on hold waiting for this** |
| Tab 2, Item 4.0 | **which drawing of the Schedule we should be working from** | the three review tickets point at a live, editable design link with no version and no date |
| Tab 2, Item 8.0 | **how much of the day the timeline shows** when day view opens | the review asks to show only business hours; your document still says the full 24 hours |
| Tab 2, Items 2.0, 3.0, 5.0, 6.0, 7.0 | the menu on empty calendar space · weekends for a technician with no hours · the toolbar search · the pop-up window · the job list inside it | unchanged by this pass |
| Tab 3, Items 1.0–6.0 | six engineering-only questions | unchanged by this pass |

## ALSO ALREADY RAISED — today, in `build/handover-ingest-2026-08-10/QUESTIONS.md`

| Ref | Subject | Status |
|---|---|---|
| **B-2** | the wording of the warning when a shift falls outside someone's hours — the SV-8917 "business hours" question | **not re-asked here.** Our position is sourced (§4.2 makes the technician's own hours take precedence) and recorded at risk **HIGH** in `DELIBERATE-DECISIONS.md` entry 6 |
| **B-3** | the "Add Existing Work Order" button | the phrase appears **0 times in all 27 versions** of the specification |
| **B-4** | hours planned for a half-done job (E5) | your document says the opposite of the review |
| **B-5** | whether the view settings are remembered (E12) | **S-2 above is a different control** — the job-list button, not the view settings — and says so |
| **B-6** | dragging a shift onto the next day (E9) | unchanged by this pass |

---

## NOT FOR BRANKO — two open questions somebody else has already raised

Recorded so nobody asks them twice. **Neither ticket was touched** (Rules 38 / 62).

| Ticket | Question | Our cases |
|---|---|---|
| [SV-8992](https://shopview.atlassian.net/browse/SV-8992) (Ayesha Khan) | should the calendar's toolbar search **scroll to** the first match? | **SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** asserts the highlighting and the five matched fields, and nothing about scrolling — **correct as written** |
| [SV-9020](https://shopview.atlassian.net/browse/SV-9020) (Ayesha Khan) | should changing the mini-calendar month/year move the grid without clicking a date? | **SCH-MCAL-01 = [C29932](https://shopview.testrail.io/index.php?/cases/view/29932)** and **SCH-MCAL-02 = [C29933](https://shopview.testrail.io/index.php?/cases/view/29933)** assert what the document does say — **correct as written** |

---

## OUTSTANDING — what I need from you

1. **Send the 6 August sheet.** It is the single biggest unblock available and it is waiting on us.
2. **Add S-1 and S-2 to it** rather than sending a separate sheet — two extra rows, same format.
3. **A ruling on B-2 (SV-8917)** if Branko cannot give one: the ticket is TESTING QA, so the change
   may already be in the build, and two of our cases would then fail against it.
