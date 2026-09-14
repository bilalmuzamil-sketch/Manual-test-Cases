# Global Search — where the testing stands

## What this is about

Global Search is the search box at the top of every screen. You type a few letters and it finds
customers, jobs, vehicles, parts, suppliers and orders. We are checking that everything people could
find in the old version they can still find in the new one.

## The headline

**The everyday things all work.** A customer's name, a job number, a part's description, a vehicle's
unit number, a supplier's name — all find the right record, and it makes no difference how you
capitalise it or whether you type the whole thing.

**A handful of things people could search for before now find nothing.** None is a crash or a broken
screen. The record is there; search simply no longer looks at that piece of information. Each one is
a decision for you rather than a fault to fix, and the tests themselves say so.

**Nothing failed.** That is not me being generous — these tests are written so that a capability lost
between versions is put to you for a ruling, not raised as a bug.

---

## 1 · What is finished

| What was checked | How it went |
|---|---|
| Finding a customer, job, vehicle, part or supplier the everyday way | All work |
| Capitals, and typing only part of a number | Make no difference — the record is still found |
| The keyboard shortcut and the hint that advertises it | Both work; the hint correctly hides on small screens |
| Search on a phone and on a tablet | Works at every size |
| Clicking a result | Opens the right record every time |
| The arrow keys | Move between results and never land on a section heading |
| Typing fast while results load | Nothing is swallowed; the results match what you typed |
| A brand-new customer | Found seventeen seconds after being created |
| A search matching nothing | Says so plainly |
| A word matching sixty-six records across all eight kinds | Every kind still shown; nothing squeezed out |
| Records from anywhere else | None ever appeared |

## 2 · What is left

| Still to do | What it needs |
|---|---|
| Checks that need someone with limited access | Signing in as a person who is not an administrator — in hand |
| Anything involving a part sale | Part sales cannot be created on this branch at the moment |

## 3 · Held for you — ten questions

Each is a thing that worked before and does not now. Today a person searching this gets nothing back.

| The question | What it costs if the answer is "leave it" |
|---|---|
| Should a vehicle be findable by its number plate? | The plate is often the only thing written down when a vehicle is booked in |
| Should a customer or supplier be findable by postcode? | A common way to pick the right one of several similar names |
| Should a customer be findable by its own phone number? | A supplier's phone works, so this is inconsistent as it stands |
| Should a supplier be findable by the county it is in? | Used when someone knows roughly where a supplier is, not its name |
| Should a company be findable by a contact's job title? | Less common, but it worked before |
| Should a part that has never been stocked be findable? | **The biggest one.** Every catalogue part used to be searchable; now only stocked ones are |
| Should typing a job's status bring back those jobs? | How a dispatcher used to pull up all the estimates at once |
| Should part of a chassis number find the vehicle? | A technician reads the short code off the windscreen; the whole number works, part of it does not |
| Should the recently-viewed list come back when a search finds nothing? | A fruitless search now leaves you at a dead end with nothing to click |
| Should a fragment from the middle of a word find a record? | It works in some places and not others, which is the confusing part |

## 4 · How to clear what is left

| Item | What would clear it |
|---|---|
| The limited-access checks | Nothing from you |
| Part sales | The part-sales problem you already raised needs fixing on this branch |
| The ten questions | One line each from you |

## 5 · Ready to hand to a tester

Not yet — the limited-access checks are still running. Everything else is done and evidenced.

---

## Two things you should know

**A test written to expect failure now passes.** Finding a part by its part number was expected to
fail on this build and does not — it works with dashes and without. Something was fixed.

**One ticket already raised may no longer hold.** It says a part is counted but missing from the parts
section. Today that part does appear there. The test data was rebuilt after that recording, so this
may be different data rather than a fix. I have not touched the ticket, as you asked.

## What I had to fix before any of this could be trusted

**The test data was incomplete.** The customer we test with had no county, no second address line and
no phone number, the supplier had no phone, and the vehicle had the wrong model. Five checks looked
like search was broken when there was simply nothing there to find. I filled the gaps in and re-ran
them — and four of what looked like faults turned out to be nothing at all. Written up separately for
the session that prepared the data.

**My own testing tool was wrong seven times**, each capable of handing you a fault that was not real.
The worst: it was reading the wrong section of the panel; it declared search unreachable on a phone
when it had simply not waited; and it judged every test against a shortened copy of the test's own
wording, which hid the instructions telling me to put these questions to you rather than raise them as
faults. All seven are fixed and written down.

## OUTSTANDING — what I need from you

1. **The ten questions above.** Each needs a yes or no: should this still work? If you would rather
   have them as a sheet you can tick, say so and I will send one.
2. **Part sales on this branch.** Three checks are waiting on the problem you already raised.
3. **Shall I write these results into the test run?** You said to run everything before writing
   anything down. That is nearly done, and I will hold the writing until you say go.

Nothing else is waiting on you.

---REFERENCE---
Run 415 · Global Search V2 regression set (section 6769) · QA branch sv9160 · 14 September 2026.
Held for a Product Owner ruling: C53516 · C53583 · C53585 · C53601 · C53603 · C53606 · C55658 ·
C55660 · C55662 · C55669 · C55679 · C45153 · C55665. Expect-fail case now passing: C55666.
Ticket to re-check: SV-10016. Part sales blocked by SV-10031.
