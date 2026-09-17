# Overnight — what moved while you were asleep

**Nothing in the testing is stuck any more.** The one check that was waiting on data has been built,
run and passed, so there is no longer anything held up for want of records, access or tooling. The
only thing waiting is your word on one new problem.

## What I finished

| | What it means for you |
|---|---|
| The last held-up check is done | It is the one about which part sales come first. I built the records it needed on the test branch, ran it, and it passes: the newest come first, your own work is lifted above someone else's from the same day, and a paid one is lifted slightly above an unpaid one of the same age. |
| One new problem found, written up, not raised | A name that **begins** with what you type is meant to come above a name that merely contains the words further along. The product tells the two apart correctly and then scores them the same, so the stronger one gets no advantage and can end up second. Report written, picture drawn, and it stops at your go-ahead. |
| Eleven checks that had been passed on paper were actually watched on screen | They were passed earlier from sign-offs, at a time when nobody could sign in to the test branch. I can sign in now, so I ran them. **Nine are genuine passes.** Two are passes for the product but carry a line of our own wording that is simply wrong — see below. One I have not touched, because it disagrees with something you signed off yourself. |
| The shareable report is refreshed | It now reads one hundred and eighty-one checks in total, one hundred and fifty-four passing, fifteen with a problem behind them, eleven parked behind work that was dropped, one that the requirements themselves put outside this release, and **nothing blocked**. |

## The two checks that were asking for the opposite of the requirement

This is the mistake that would have cost us most, because it is the kind nobody argues with: a
tester follows the check, the product looks wrong, and a report goes to a developer who then has to
prove the product was right all along.

- **Finding a customer by the company's own phone number.** It works. But our check also demanded
  that the line must *not* be marked as a contact match. The requirements page says the opposite in
  so many words — that mark is shown whether the number sits on the company itself or on one of its
  people. **The product is right; our wording is wrong.**
- **Finding a company by a person's job title.** It works. Our check demanded the same mark, which
  the requirements only give to a name, a phone number or an email address. **Again ours, not
  theirs.**

Nothing has been raised against the product for either. I need your word to correct the two lines.

## The one I left alone

**Finding a work order by typing its stage.** You signed this off yesterday as fixed. Tonight, on
the current branch, typing a stage does **not** bring back the work orders sitting at it — typing
"Estimate" returns a single work order that is at Paid, matched on the wording of a line on it. And
the report you closed was closed with a decision written on it: *status will not be something you
can search by*, agreed in the channel. So the product is behaving as that decision says, and it is
**our check** that still expects the old behaviour.

I have not changed anything you signed. Two ways to settle it, either takes a minute:

- **The decision stands** — I rewrite our check to expect what was agreed, and it passes honestly.
- **You still want it back** — then the product does not do it today, and it becomes work for the
  team again.

---

## OUTSTANDING — what I need from you

**1. Go-ahead for the one new report.** A name that begins with what you typed is scored no higher
than one that merely contains it, so the better match can come second. Written, pictured and
checked against the requirements page, which puts the two at different weights. It sits against the
ranking work, which is ready for testing, so it can be raised the moment you say so.
*If you say nothing:* one problem stays invisible to the developers and one check stays failed with
no way for anyone to track it.

**2. The two lines of our own wording, above.** Say yes and I correct both; the product needs
nothing.
*If you say nothing:* the next person to run either one raises a report against a product that is
behaving exactly as written, and a developer spends a day proving it.

**3. The work-order stage question, above.** One of the two answers, and I do the rest.

**4. Still open from earlier** — four other lines of our own wording waiting on the same kind of
yes; the eleven checks parked behind work that was dropped; and my offer to put the right piece of
work on every check in the set, which would let you see at a glance what is covered.

---REFERENCE---

Run 415 · https://shopview.testrail.io/index.php?/runs/view/415 · branch sv9160 · build
v26.36.7-29ca209 · live counts 154 Passed / 15 Failed / 11 Retest / 0 Blocked / 1 Untested = 181.

* Blocked check now passed: C55711 · https://shopview.testrail.io/index.php?/cases/view/55711 ·
  https://shopview.testrail.io/index.php?/tests/view/3050571 — fixture written up in
  `build/global-search/run415-execution/C55711-FIXTURE-2026-09-17.md`.
* New defect held at the button: C55707 · https://shopview.testrail.io/index.php?/cases/view/55707 ·
  https://shopview.testrail.io/index.php?/tests/view/3050567 — owning story SV-9165 (Ready for QA,
  read live); ticket body and picture in
  `build/global-search/run415-execution/tickets/C55707-ranking-prefix.md`.
* Sign-off re-check: C53516, C53582, C53583, C53585, C53603, C53604, C53606, C55662, C55669, C55670,
  C55658 — `build/global-search/run415-execution/SIGNOFF-RECHECK-2026-09-17.md`.
* Case corrections asked for: C55662 and C53603 (this pass), plus C44829, C45132, C45136, C55706.
* Status-search conflict: C55658 vs SV-10008 (closed Done 16 Sep, "Status will not be a searchable
  field").
* Readiness report v7: https://claude.ai/artifact/25r8mu1rsGXa5TF5xviz3B
* Branch head 366a2cf0 on claude/test-execution-defects-cdrjsq.
