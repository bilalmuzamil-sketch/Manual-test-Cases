# For Vlad — one Schedule test case changed today

**Date:** 2026-08-11 · **Project:** Schedule · **Written because the QA lead's standing instruction
is:** *"do tell me whenever you delete any test case or update it so that I can share the test cases
with VLAd to adjust his automation accordingly."*

---

## The short version

**One case changed. Nothing was deleted. Nothing new was added.**

**[C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** used to check that the
schedule's toolbar search **highlights the shifts that match and fades the ones that do not**. **That
requirement no longer exists**, so that half of the case is gone. What is left is the half that is
still required: **the search matches against five things, and each of them finds the right shifts.**

**The case is not marked Automated**, so if you have not built it yet, nothing of yours breaks. **If
you have built it, the fade/highlight assertion must come out** — see below.

---

## What changed, precisely

| | |
|---|---|
| **Case** | C30041, Schedule → Grid Toolbar |
| **Old title** | *Toolbar search highlights matching blocks and fades non-matching ones* |
| **New title** | *Toolbar search matches customer, work order, unit, technician and line names* |
| **Automated flag** | **`custom_atmstatus` = 1 (Not Automated)** — before and after, unchanged |
| **Automation marker** | `AUTOMATION: READY` — before and after, unchanged |
| **Kind of change** | assertions removed and the case retitled — **not** a rewording |

### The assertions that were REMOVED — do not automate these

1. **"Blocks that match the search are highlighted; blocks that do not match fade."**
2. **"Matching blocks stay in place on the grid (search visually filters; it does not remove or
   rearrange)."**
3. **"Clearing the search restores all blocks to normal."**

### The assertion that SURVIVES — this is what the case now checks

> The toolbar search filters the grid, and **all five of these are matched against, so searching any
> one of them finds the blocks it belongs to: customer name, work order number, unit number,
> technician name, and line name.**

### And one thing the case now tells the tester NOT to judge

The specification **does not say** what happens to the shifts that do **not** match — whether they
stay on the grid faded out, or disappear until the search is cleared. **The case says explicitly not
to pass or fail on that.** It is an open question with the product owner.

---

## Why — in one paragraph

The requirement *"Non-matching blocks fade; matching blocks highlight"* was in the Schedule
specification from version 7 until version 23. **Version 24 deleted it on 6 August 2026**, after
engineering flagged that the design and the specification disagreed, and it has not come back in
versions 25, 26 or 27. The Jira story **SV-8686 still asks for it** — but that wording has not been
edited since the story was created on **27 July 2026**, so the deletion is the newer decision by
nearly eleven days, and the newer decision wins. Full working in `DATING.md`.

---

## 🔴 What this changes for an automated check — read this part

**If you have already automated C30041 against its old title, your check is asserting something the
product is no longer required to do, and it may be FAILING for the wrong reason.**

- **A check that asserts non-matching shifts FADE should be removed.** Nothing requires that any more.
- **A check that asserts non-matching shifts DISAPPEAR should NOT be added in its place.** The
  specification is silent, and we are not allowed to take an expectation from the build. Wait for the
  product owner's answer.
- **A check that asserts the five searchable fields is safe and is exactly what the case now wants.**
  It was already in the case and it is unchanged in substance.
- **A check that asserts "clearing the search puts everything back" has no source.** It is probably
  true of any filter, but nothing states it, so it is not something to fail a build on.

**Nothing else in the Schedule suite is affected.** All 174 Schedule cases were searched: **C30041 was
the only one asserting the fade/highlight behaviour**. The one other case containing the word "fade"
— **[C29987](https://shopview.testrail.io/index.php?/cases/view/29987)**, the Month-view series banner
with its *"faded 'continues' label"* — is a **different requirement**, is still in the live
specification, and **was not touched**.

---

## Deletions

**None.** No test case was deleted today, on this project or any other. **Deleting C30041 was
authorised and was deliberately not done**, because it is the only case in the suite covering the
toolbar search's five matched fields, which the live specification still requires. If that decision is
revisited, this note will be updated and you will be told before anything is removed.

---

## Run 357

**Untouched.** Still 174 tests and 458 result records, all present, nothing regraded. The only thing
that moved is the case title shown against C30041's three existing result records, which is TestRail
displaying the current title rather than a stored value.
