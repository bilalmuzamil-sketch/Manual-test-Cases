# SV-9697 — CLOSING STATE (work paused 2026-09-22)

**Read this first.** Full detail is in `FINDINGS.md` §0–§25; this is the cold-resume summary.

## Verdict

**All eleven checks in the developer's handoff are settled.** QA is complete on everything this
ticket owns. From our side it is ready to leave **Blocked**.

| # | Check | Final state |
|---|---|---|
| 1, 2, 3, 8 | The reverse itself + the confirmation wording | **PASSED** — live-verified |
| 4, 5, 6 | The four blocked-button messages | **Behaviour PASSED.** Wording moved to **SV-10298** on develop |
| 7 | Invoice paid through the customer portal | **PASSED** — live-verified 21 Sep on **P9697-253** |
| 9 | The same reverse dialog elsewhere | **PASSED** — live-verified, no wording leaked |
| 10 | Credited line stays, stock returns | **PASSED** — re-verified off the Inventory screen |
| 11 | Older part sales with empty credit records | **Not reproducible here** — developer's note, Chris confirmed they stay blocked |

## The one thing outstanding

**Chris Ward owes one line: A or B**, asked in
[comment 76976](https://shopview.atlassian.net/browse/SV-9697?focusedCommentId=76976).

* **A** — his 21 Sep copy: *"…has been applied. Remove the payment that used it on the Payments tab
  before reversing this invoice."*
* **B** — his 18 Sep copy: *"…has been used. Void the payment that used it before reversing this
  invoice."*

**Why it matters:** **SV-10298 is titled after B** (*"say 'used' and 'Void', not 'applied' and
'Unwind'"*) — the version Chris withdrew once Nemanja proved "Void" and "used" appear nowhere in the
released frontend. Built to its own title it ships the words both of them ruled out. If the answer is
A, **Nemanja needs to correct the ticket title.** Whichever he picks, that is the expected result to
assert when SV-10298 is tested.

## Comments we own on the ticket

| id | what it is | rule |
|---|---|---|
| 76831 | the 18 Sep QA result | **reverted to its pre-21-Sep text and must not be edited again** |
| 76969 | 21 Sep retest | superseded by 76974/76975, left as posted |
| 76974 | state after Nemanja's portal explanation | left as posted |
| 76975 | check 7 verified live + the SV-10298 title catch | left as posted |
| 76976 | the A/B question to Chris | **awaiting his reply** |

**Standing rule learned here: once a comment has been read and replied to, it is part of the record.
New information goes in a NEW comment.**

## Environment

**The `sv8801`-era note applies: `sv9697.qa.shopview.com` and `sv9697api.qa.shopview.com` now return
`connect_rejected` through the agent proxy** (production, the portal and Atlassian all still 200), so
the branch is gone and **no further live check on this ticket is possible**. Nothing is lost — every
check was settled first, and SV-10298 lives on develop.

## Evidence kept

`ev/EX1`–`EX5` (18 Sep), `EX6b_inventory_screen.png` (Inventory screen, 4 real captures),
`EX7_unwind_still_shipped.png` (both live tooltips), `EX8_portal_blocks_reverse.png` (check 7),
`nemanja_proof_18981.jpg` (his portal capture). Comment generators: `build_comment.py` (= live 76831),
`build_comment_2026-09-21.py`, `build_comment_final_76975.py`, `build_comment_question_76976.py`.

## If this is picked up again

The work is on **SV-10298**, not here. Wait for Chris's A/B, confirm the ticket title matches it, then
test the four messages word for word on whatever branch SV-10298 ships to.
