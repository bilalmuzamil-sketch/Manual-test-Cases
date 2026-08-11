# Questions for Branko — Schedule — 2026-08-11

**Project: SCHEDULE (the technician scheduling calendar).** Every question row names the project and the
feature, because **Branko owns three products** — Schedule, Filters and Global Search — and a question read
in isolation days later must still be unambiguous (Standing Rule 55).

**Plain, non-technical language only. No case numbers, no section numbers, no jargon** in anything Branko
reads. The internal mapping is on the QA-only tab at the bottom, out of his view (Rules 7 / 55).

---

# 🔴 THE HEADLINE: **THIS PASS PRODUCES NO NEW QUESTIONS. IT PRODUCES ONE OVERDUE ONE.**

**Everything this pass needed from Branko was already written down. Nothing has been sent.**

**The 6 August question sheet — `build/filters/questions-2026-08-06/` — holds 20 items, 8 of them Schedule,
and it has never left our hands. It has been ready for five days. The release is Thursday.**

**Three of our test cases are on hold waiting for answers on that sheet, and two of them say so in their
own text.** So the honest status is not *"waiting on Branko"*; it is **waiting on us to ask him.**

---

## Q1 · SCHEDULE — days the shop is closed. **ALREADY WRITTEN AS ITEM 1.0 OF THE 6 AUGUST SHEET. SEND IT.**

**Project:** Schedule · **Feature:** spreading a big job across several days
**Story:** [SV-8691](https://shopview.atlassian.net/browse/SV-8691) *Multi-Day Spread Scheduling*

### What happens now

Your description says two opposite things about days the shop is closed — holidays and inventory days.

In one place it says the calendar **must not** put shifts on those days. In another place it says closed
days and public holidays are **not** skipped in this first version, so shifts **can** land on them.

### The question

When a job is spread across several days and one of those days is a day the shop is closed, what should
happen?

| | |
|---|---|
| **A** | The closed day is **skipped**. The calendar moves the work to the next open day. |
| **B** | The closed day is **used like any other day**. Skipping closed days comes later. |

**Answer:**

### ⚠️ WHAT IS NEW HERE, AND IT IS THE ONLY NEW THING IN THIS FILE

**We have now dated the two sentences, and they are not the same age.** The sentence saying closed days are
**not** skipped was **added on 27 July**, twelve days after the one saying they must be blocked — and you
have edited the page five times since without removing either.

**So our tests currently follow the newer sentence, which is option B.** That is the more defensible
position and it lowers the risk of leaving this open — **but a document that argues with itself still needs
you to settle it**, and we are not going to decide it for you.

---

## Q2 · SCHEDULE — hiding the job list, and whether the calendar remembers it. **ALREADY WRITTEN. SEND IT.**

**Project:** Schedule · **Feature:** the button that hides the job list down the left-hand side
**Story:** [SV-8686](https://shopview.atlassian.net/browse/SV-8686) *Schedule Grid Layout & Navigation*

**This is not a new question.** It was written as item **S-2** on 2026-08-10 and again on 2026-08-11 when it
became cited on a live test case. **Nothing has changed about it; it is repeated here only because it is
still unanswered and it now has a concrete cost.**

### What happens now

Your description of 7 August says that hiding the job list lasts **only while you are signed in** — so if
you hide it, sign out, and sign back in tomorrow, the list is showing again.

Separately, the **design review of 5 August** asks for the calendar's view settings to be **remembered for
each person even after they sign out and come back**.

Those two are different promises and we do not want to guess which you meant.

### The question

When someone hides the job list and then signs out, what should they see next time they sign in?

| | |
|---|---|
| **A** | The job list is **showing again**. Hiding it lasts only for the sign-in you are in. *(This is what your 7 August description says.)* |
| **B** | The job list is **still hidden**. The calendar remembers it for that person from one sign-in to the next. *(This is what the 5 August design review asks for.)* |

**Answer:**

---

## Q3 · SCHEDULE — the pop-up that lists technicians. **A ONE-LINE CONFIRMATION, LOW PRIORITY.**

**Project:** Schedule · **Feature:** the small bar at the top of each day showing how busy the shop is
**Story:** [SV-8698](https://shopview.atlassian.net/browse/SV-8698) *Capacity Visualization*

**Also not new** — written on 2026-08-10 as item S-1. It is repeated because **we have since changed a test
to match the new wording, without waiting for this answer**, and you should know we did that.

### What happens now

When you rest your mouse on that bar, a small pop-up lists technicians and how many hours each has.

On 7 August your description changed by one word: it used to say the pop-up lists **the technicians**, and
now it says it lists **the technicians who have work assigned**.

In a shop with fifteen technicians where only three have work that day, that is the difference between a
fifteen-line pop-up and a three-line one.

### The question

Was that change what you meant?

| | |
|---|---|
| **A** | **Yes** — the pop-up should list **only** the technicians who have work assigned that day. |
| **B** | **No** — it should list **all** technicians, and the change was a slip. |

**Answer:**

**What we have done in the meantime, so it is not a surprise:** our test now expects **A**, because that is
what your description says today. **If the answer is B, we change one test back** — it is a five-minute fix
and no other test depends on it.

---

## Q4 · SCHEDULE — which drawing of the calendar is the real one. **NOT A PRODUCT QUESTION — BUT IT BLOCKS US.**

**Project:** Schedule · **Feature:** the whole calendar

### What happens now

There are two drawings of the Schedule in circulation. We built roughly fifty of our tests' on-screen names
from the one you gave us in July. Three of the tickets raised after the 5 August design review, **and one of
your own stories**, point instead at a **live link that can be edited at any time and carries no date**.

**Because it has no date, we cannot tell whether it is newer than the one we used.** Our own rule is that
the most recent source wins — and that rule cannot be applied to something we cannot date.

### The question

Which drawing should we treat as the real one for the Schedule?

| | |
|---|---|
| **A** | The one shared in **July**, which our tests already follow. |
| **B** | The **live link** from the 5 August review — in which case please tell us it is final, so we can copy it and work from a fixed version. |

**Answer:**

---

## Nothing else in this pass is waiting on Branko

Both of the outstanding clarification tickets raised by somebody else were checked, and **neither is a gap
in our tests** — in both, the description is silent and our tests assert only what it does say, which is
exactly why the tickets exist. **Neither was touched** (Rules 38 / 62).

| Ticket | What it asks | Our position |
|---|---|---|
| [SV-8992](https://shopview.atlassian.net/browse/SV-8992) (Ayesha Khan) | should the search box at the top of the calendar jump to the first match? | the description says only that it *filters* the blocks. Our test asserts the highlighting and the five fields searched, and nothing about jumping. **Correct as written.** |
| [SV-9020](https://shopview.atlassian.net/browse/SV-9020) (Ayesha Khan) | should changing the month in the little calendar move the main grid without clicking a date? | the description says only that *clicking a date* moves the grid. Our two tests assert exactly that. **Correct as written.** |

---

# QA-ONLY — the question → case mapping. **NOT for Branko.**

| Q | Assertion | Cases | Live status |
|---|---|---|---|
| **Q1** | `§12-L307.A1` vs `§4.5-L101` | SCH-EDGE-05 = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) · SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) | both `AUTOMATION: HOLD`, both naming the unsent question in their own text. Verdict **BLOCKED**. Dating this pass: §12 = v1 2026-07-15; §4.5 = **v22 2026-07-27** (newer). |
| **Q2** | `§5.3-L195.A2` vs design-review item E12 | SCH-PANEL-06 = [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | `AUTOMATION: READY`; carries a Rule-58 open-question sentence in its tester text. Verdict **COVERED** — follows the written spec. |
| **Q3** | `§4.12-L165.A1` | SCH-CAP-04 = [C30033](https://shopview.testrail.io/index.php?/cases/view/30033) | already edited to the v26 wording **without waiting for this answer**. Verdict **COVERED**. Reverting is 1 `update_case`. |
| **Q4** | source D of `SOURCE-CURRENCY.md` | ~48 label-pinned cases, plus staged `SCH-EDGE-09` and `SCH-EDGE-10` | design source **PARTIAL**, undatable. Deliberate decision **D7**, risk **HIGH**. |

**Q1, Q2 and Q3 are all already on sheets we hold. The action is not to write another question — it is to
send `build/filters/questions-2026-08-06/`, with Q2, Q3 and Q4 added to it.**
