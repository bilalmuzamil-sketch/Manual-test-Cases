# ⚠️ SUPERSEDED — DO NOT SEND THE WORKBOOK IN THIS FOLDER

**Date superseded:** 2026-08-06.

**Send this instead:**
`build/filters/questions-2026-08-06/Questions-for-Branko-Cicovic_Filters-and-Schedule_2026-08-06.xlsx`
(its plain-language twin and generator sit beside it; the workbook's **4th tab is QA-only and must not be
forwarded**).

## Why

The 13-item sheet in this folder was written, was ready, and **was never sent** (register row C4). Standing
Rule 55 says to sweep every open ambiguity onto **one** sheet so a product owner answers in a single sitting
*"rather than a drip of separate asks"* — and **two unsent sheets to the same person is that drip**.

So **all 13 of its items were carried forward** into the 2026-08-06 workbook, **imported from this folder's
own generator so the wording cannot drift**, and 4 new items were added. The new sheet carries **17 items**:
7 Filters · 4 Schedule questions about Branko's own document · 6 Schedule behaviours that only the
engineering plan describes. **17 of our tests are on hold across them.**

## Nothing here is deleted

The files stay exactly as they were. This folder is the record of what was drafted on 2026-08-05 and of the
wording the newer sheet imports; it is **not** a deliverable any more. Nothing in it was edited.

| File | State |
|---|---|
| `Questions-for-Branko-Cicovic_Schedule-and-Filters_2026-08-05.xlsx` | superseded — **do not send** |
| `Questions-for-Branko-Cicovic_Schedule-and-Filters_2026-08-05.md` | superseded — the plain-language twin |
| `gen_branko_sheet.py` | **still live as a dependency** — the 2026-08-06 generator imports it for the 13 carried-forward rows, so **do not move or delete it** |

## One thing in the superseded sheet is now known to be wrong

If anyone reads the old workbook for any reason: **SV-8876 is not Branko's to answer.** Read live
2026-08-06 — Task, **status Done**, resolution Done, resolved **2026-08-05T08:38:16−0500**, parent SV-8785,
reporter **Ahtasham Amjad**, who **closed it himself**. The half of it that *is* still Branko's — whether he
wanted the buttons on one row, in which case the developer job should be cancelled — is Filters **item 5**
on the 2026-08-06 sheet.

## Why the banner is a separate file rather than an edit

The worker that produced the 2026-08-06 workbook was scoped to write only inside the two new folders, so it
**could not** place this banner and said so in its own README. This file closes that gap without touching a
byte of the superseded deliverables.
