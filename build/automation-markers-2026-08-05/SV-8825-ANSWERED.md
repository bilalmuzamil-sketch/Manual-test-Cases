# The product owner ANSWERED the phone question this morning — so 8 Filters cases were left alone

**Read this before touching the eight phone cases.**

## What happened, in order

| When (UTC) | What |
|---|---|
| 2026-08-04 18:19 | Branko revised the Filters specification (Confluence **version 18**). |
| 2026-08-05 ~04:50 | Our readiness report was finished. It says the phone question is **"still Open, still no comment on it. It blocks 8 test cases."** That was true when it was written. |
| **2026-08-05 05:18:22** | **Branko commented on [SV-8825](https://shopview.atlassian.net/browse/SV-8825) — *"This is updated in the filters prd, I'm closing it."* — and closed it as Done.** |
| 2026-08-05 11:35 | This pass read that live. **The readiness report was 28 minutes out of date.** |

## He has ruled, and the ruling is in the specification

Read live from Confluence page 572030978, **version 18**, this pass:

- **Section 4, Key Decisions, verbatim:** *"Mobile uses deferred apply: desktop filters in real time,
  while mobile stages the user's selections and applies them only when the user taps an
  **'Apply filters'** button — a deliberate difference for small-screen ergonomics (see Story 12)."*
- **S12-R6, verbatim:** *"Unlike desktop, mobile does not filter in real time. Selections made inside a
  dropdown / bottom sheet are staged, and the table updates only when the user taps an
  **'Apply filters'** button within the sheet. **This confirms intent** on smaller screens..."*

The words *"This confirms intent"* are him deliberately settling the very thing we asked. So under
Standing Rule 33 (a product owner's ruling is the top of the order) and Standing Rule 32 (the newest
authoritative source wins), **the phone question is ANSWERED: a phone applies filters only when the
user taps "Apply filters".**

## Why the eight cases were NOT written

| Case | C-id | Link |
|---|---|---|
| FLT-MOB-01 | C29621 | https://shopview.testrail.io/index.php?/cases/view/29621 |
| FLT-MOB-02 | C29622 | https://shopview.testrail.io/index.php?/cases/view/29622 |
| FLT-MOB-03 | C29623 | https://shopview.testrail.io/index.php?/cases/view/29623 |
| FLT-MOB-04 | C29624 | https://shopview.testrail.io/index.php?/cases/view/29624 |
| FLT-MOB-05 | C29625 | https://shopview.testrail.io/index.php?/cases/view/29625 |
| FLT-MOB-06 | C29626 | https://shopview.testrail.io/index.php?/cases/view/29626 |
| FLT-MOB-07 | C29627 | https://shopview.testrail.io/index.php?/cases/view/29627 |
| FLT-MOB-10 | C29630 | https://shopview.testrail.io/index.php?/cases/view/29630 |

**Both of the things we were asked to write on them are now untrue.**

1. The marker would have said **"HOLD — waiting on the product owner's answer"**. He has answered. That
   would have put a false statement into eight cases.
2. The awaiting-reply sentence would have said the case **"is waiting on the product owner's reply"** and
   pointed at an **open** question. The question is **closed**.

**And we cannot give them a truthful marker either**, because what they should now say is a
**verdict**, not a marker:

- The specification now requires an **"Apply filters"** button on a phone.
- This morning's pass observed the live build — on this exact build, marker byte-identical — applying
  **as you tap, with no Apply button** (`recheck-2026-08-05/FINDINGS.md`: the mobile observations came
  back *"byte-identical"*).
- **So the product now contradicts a requirement the product owner has just ratified.** That most
  likely makes these eight **"the product is wrong"** cases — but there is **no developer ticket** for
  it (SV-8825 was a question, and it is closed), and raising one needs your say-so.

Each of the eight still carries its **existing** line, which now reads as out of date:
*"DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner... The question is
open as SV-8825."* **That line is now wrong and should be corrected** — but correcting it is a
content change driven by a new ruling, not a marker, so it is not ours to make unasked.

## The one thing needed from you

**Say the word and we will, in one pass:** re-read all eight against S12-R6, replace the stale
"waiting on the product owner" line, raise **one** Low-priority defect for the phone Apply button
against epic SV-8785 with story SV-8797 linked, and set each case's marker to
**`AUTOMATION: READY - EXPECT FAIL (<the new ticket>)`**.

**If that is done, the Filters ready-to-automate figure rises from 93 to 101 of 110.**
