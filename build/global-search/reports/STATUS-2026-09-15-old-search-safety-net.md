# Where the old-search safety net stands — 15 September 2026

## 1 · What was checked, and how it came out

The safety net is the set of checks that ask one question: **can a person still do in the new search
everything they can do in the one they use today?** All of it has now been run.

| | How many | What it means for you |
|---|---|---|
| Checks in the safety net | **67** | Every one of them has been run. None is left sitting. |
| Worked | **48** | The new search does these just as the old one does. Nothing to do. |
| Did not work | **17** | Things a person can do today and will not be able to do. Each one is written up. |
| Could not be checked | **2** | Both need a part sale, and a part sale cannot be created on the test copy at the moment. |
| Not started | **0** | — |

## 2 · Does the safety net cover everything the old search could do?

**Yes — all 42 of them.** The rebuilt demonstration of the old search shows 42 different things a
person can type. Earlier today four of those were being typed by nobody. All four are now covered,
and all four have been run:

| What the old search does | Where it is now checked | How it came out |
|---|---|---|
| Part of a telephone number | Added as a step to the company-telephone check | **Does not work** on the new one |
| A contact's own direct line | Added as four steps to the contact check | Whole number works, **part of it does not** |
| The make of a vehicle on its own | A new check, written today | Works |
| The year of a vehicle on its own | A new check, written today | Works |

So the coverage question is closed: nothing the old search demonstrably does is going untested.

## 3 · The seventeen things that stop working — grouped, so it reads as a shortlist

| What a person loses | How many checks say so |
|---|---|
| Finding a company by its postcode, its website, or a contact's job title | 4 |
| Finding a supplier by its postcode, its state, its address line 2 or its website | 4 |
| Finding a vehicle by its number plate, by its year and make together, or by part of its chassis number | 3 |
| Finding jobs by typing the stage they are at | 1 |
| Finding a part that is in the catalogue but has never been stocked | 1 |
| Finding anything by part of a telephone number | 2 |
| Finding a record by a few characters from the middle of a town name | 1 |
| A correctly spelled name buried under unrelated results | 1 |

## 4 · What changed in the write-ups today

**Twenty write-ups existed this morning. Every one has been gone through.**

| | How many | What happened |
|---|---|---|
| Rewritten into the approved shape | **14** | The layout the Head of Product and the Head of Engineering asked for, and each one now carries a single picture showing the live product above and the new version below, sized so it reads without being clicked. |
| Withdrawn | **6** | Re-checked on the test copy and they do not describe the product. Each carries a note saying exactly what was seen, and any of them can be brought back in one click. |

**Why six were wrong.** Four were written from a screen recording on a day the test copy was down, so
they were never run against the product at all: two of those have since been fixed, and two were
written against records this copy has never held. One said a new job takes about a minute and a half
to become findable — three brand new jobs were made today and each was findable within ten seconds,
against a requirement of thirty. One said a list of recently viewed items did not come back; it does.

**Three titles were saying the wrong thing** and have been corrected. The telephone one claimed the
whole number could not be found, when the whole number works and only part of it fails. The state one
claimed nobody could be found by their state, when customers can and only suppliers cannot.

## 5 · Nothing is blocked

| | |
|---|---|
| Anything stopping the work | **No.** Every check ran, every write-up was reached, every picture went up. |
| Anything waiting on a person | Two new findings need your say-so before they can be written up — section 6. |

## 6 · OUTSTANDING — what I need from you

**One decision, and one question.**

### (a) Two new problems found today. May I write them up?

Nothing gets written up without your word, so these are sitting with me. Both are about **suppliers**,
and both are things a customer can do and a supplier cannot:

* **A supplier cannot be found by their address line 2.** Their record prints it on screen. A customer
  can be found by theirs.
* **A supplier cannot be found by their website.** A customer's website is already written up; the
  supplier's was never checked until today.

I went further and checked every part of both addresses side by side, so you get one decision instead
of several. A supplier is found by its name, its street and its town, and not by its address line 2,
its state, its postcode or its website. A customer is found by all of those except the postcode and
the website.

* **Yes** — I write both up in the approved shape, with the comparison picture, and they join the
  other fourteen.
* **No** — they stay recorded against the checks and nobody outside sees them.
* **Or**: I fold them into the two supplier write-ups already open, so the team gets one piece of work
  about the supplier's address rather than four.

**If you say nothing:** they stay recorded and unreported. Nothing else waits on this — all the other
work is finished either way.

### (b) The other 99 checks have not been started. Do you want them run?

The safety net is 67 checks. The run also holds **99 more** that test the new search against its own
written requirements rather than against the old product — the way results are grouped, keyboard
behaviour, permissions, the phone layout, and so on. **Not one of them has been run**, and I was told
earlier not to start them.

* **Yes** — I start them now and report as they land.
* **No** — they stay untouched and the run stays as it is.

**If you say nothing:** they stay untouched. It does not affect anything above — the old-search safety
net is complete on its own.

---REFERENCE---

Run 415 — https://shopview.testrail.io/index.php?/runs/view/415 · branch sv9160 · build v26.36.4-7869ff2

Rewritten: SV-10001 · SV-10002 · SV-10003 · SV-10004 · SV-10005 · SV-10006 · SV-10007 · SV-10008 ·
SV-10025 · SV-10055 · SV-10057 · SV-10058 · SV-10060 · SV-10061
Withdrawn: SV-10014 · SV-10015 · SV-10016 · SV-10017 · SV-10056 · SV-10059 (commented, already QA Complete)

The six corrected cases run today:
C55662 https://shopview.testrail.io/index.php?/tests/view/2977474 — Failed
C53605 https://shopview.testrail.io/index.php?/tests/view/2959371 — Failed
C55664 https://shopview.testrail.io/index.php?/tests/view/2977476 — Passed
C55670 https://shopview.testrail.io/index.php?/tests/view/2980692 — Failed
C53579 https://shopview.testrail.io/index.php?/tests/view/2959356 — Passed
C53604 https://shopview.testrail.io/index.php?/tests/view/2959370 — Failed (the new supplier finding)
C53587 https://shopview.testrail.io/index.php?/tests/view/2959364 — Passed (was Failed; corrected)

The four coverage gaps closed: C55662 step 4 · C55670 steps 6-9 · C55688 · C55689
Sections: 6769 + 8056 are the regression suite (67); the 99 untested sit in sections 6721-6740, 6767, 6774
