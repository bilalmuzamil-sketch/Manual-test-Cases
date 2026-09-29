# Did these checks ever pass before? Yes — most of them, and recently. Here is what changed.

You asked the right question, and the answer changes the picture in two ways: it pins down **exactly
what changed in the product in the last week**, and it caught **one failure of mine that was wrong**.

**Run 415** — https://shopview.testrail.io/index.php?/runs/view/415 — every check has been run;
**15** did not pass, down from 16 (see the correction below).

---

## The short answer

Of the 16 that failed yesterday, **12 had passed before** and **4 had never passed**. More usefully,
**8 of them passed within the last eight days** — so something moved, and I can now say what.

| What the history shows | How many |
|---|---|
| Passed before, then **the product was deliberately changed** and the check now describes the old way | **6** |
| Passed once or twice, but the failure was always understood and the report closed as intended | **5** |
| **Never passed** — failing since the day they were first run | **4** |
| **Passed before and still passes — my failure yesterday was wrong** | **1** |

---

## 1 · First, a correction I owe you

**The check about a part already on the job not being pushed down does NOT fail. It passes.** I
recorded it as failed yesterday and told you it was the one live fault. That was wrong.

A part already on the job you are looking at really is pushed down. Proved today with a part that
leads the list from an unrelated screen: standing anywhere else it is first, and searching from the
job it sits on it drops to second, below a part that is not on that job. Two passes, alternating
between screens, identical both times.

**Why I got it wrong:** I put a part on the job that was already SECOND in the list — which is
exactly where a demotion would have put it. Both readings looked the same, so I called it broken,
when in truth my test could not have shown a difference either way. Swapping to a part that starts
FIRST gives the demotion somewhere to show, and it shows.

A session on 21 September reached the same conclusion on the previous build and wrote down that the
developer was right. I had read that note and still made the mirror image of the mistake it
describes. The result is corrected, and the report raised about it should be closed.

---

## 2 · Six failures are explained by two deliberate changes, both datable

### Phones: "Show All" was ADDED, on purpose, after 21 September

Four checks — the three about the phone results being uncapped with no "Show all", and the one
about the wording inside the phone search box — passed on **21 September**. On **22 September**
someone raised a request saying the "Show all" link was MISSING on phones and should be there. By
the time I tested on 28 September it was there, and the results on a phone are capped the same way a
computer caps them.

Our four checks require the opposite: on a phone you should scroll the whole list with no "Show all"
anywhere. **The product did what was asked of it; our checks still describe the older design.**

### The top line: the single pinned result was folded back into its section, on 28 September

The two checks about typing an exact number — one of them with a name that also matches — passed on
**21 September**, when typing an exact number did put
that record on a line of its own above everything. On **28 September** two complaints were raised
that the very first result did not show what KIND of record it was — one of them was fixed the same
day. When I tested later that same day, that separate line was gone and the record sat inside its
labelled section instead.

**That is almost certainly the fix for those complaints**, and it is the opposite of what our two
checks require.

---

## 3 · Five where the failure was always understood

| What the check is about | Last passed | Where it stands |
|---|---|---|
| A count somewhere reading past twenty | 17 Sep, once | reported, closed as intended |
| The most-recently-changed record winning a tie | 17 Sep, once | reported, closed as intended |
| A catalogue part that was never stocked being findable | 22 Sep, once | reported, closed as intended. A second check on the same fault has NEVER passed, so that single pass looks doubtful |
| Pressing Enter opening the top result (two checks) | 22 Sep | the cause is the MOUSE POINTER — the row under it becomes the one Enter opens. Whoever ran it on 22 September will have kept the mouse clear or used the keyboard. Not a product change; a difference in how it was run |

---

## 4 · Four have never passed at all

Recording a usage-tracking event when you pick a result — the work behind that was dropped
altogether. Finding a catalogue part that has never been stocked. Finding a record by part of a word
taken from the middle of a name. And a name bringing back other, differently spelled names. Each has
been failing since the day it was first run, each has a report, and every one of those reports has
been closed as intended behaviour.

---

## 5 · What this means for you

**Nothing here is a newly broken product.** Six failures are our checks lagging behind two changes
that were asked for and made on purpose; five are long-settled; four never worked and were accepted;
and the one I called a live fault turns out to work.

**What is worth knowing:** two of those deliberate changes went in during the past week, and both
were made in response to complaints that point the opposite way to our checks. The phone one is a
straight conflict — a request to ADD "Show all" on phones is still open while three of our checks
require it to be absent. Somebody has to say which is right, and that is the decision I need from
you.

---REFERENCE---

Never passed: C45160 · C53601 · C55660 · C55685
Passed then a deliberate change: C44898 · C45134 · C45136 · C45132 (SV-10345, raised 22 Sep, open) ·
C44850 · C55729 (SV-10547 Done and SV-10556 Obsolete, both raised 28 Sep)
Already checked and written up: C53476 (SV-10320) · C55716 (SV-10340) · C45153 (SV-10001) · C55673 · C55686 (SV-10061)
Corrected to Passed: C44854 — https://shopview.testrail.io/index.php?/tests/view/2723924 — SV-10188
does not reproduce and should be closed; the 21 September note reaching the same conclusion is
`run415-execution/sv10188-recheck/DEVELOPER-IS-RIGHT-2026-09-21.md`.

Full per-case result history: `failed-history.json`. Today's re-measurement: `measure-44854.json`.
