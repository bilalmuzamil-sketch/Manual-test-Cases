# Maintenance Reminders — source currency check, 6 October 2026 (afternoon)

Checked after the 6 October source update was applied (Chunk 1 group 19397, Chunk 2 group 26635). Read-only; nothing written to TestRail.

## Confluence tree "Maintenance Reminders V1" (833290250) — 9 pages, no new page
| Page | Last modified (UTC) | Our copy | Verdict |
|---|---|---|---|
| 833290250 Maintenance Reminders V1 (main) | 2026-10-05 14:58 | `sources/CONFLUENCE-833290250-…-2026-10-06.md` | ✅ current |
| 886931488 Chunk 1 MR | 2026-10-05 14:58 | `sources/CONFLUENCE-886931488-Chunk1-MR-2026-10-06.md` | ✅ current |
| 897679389 Chunk 2 MR | 2026-10-05 14:58 | `sources/CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md` | ✅ current |
| 892305428 Review Decisions — Chunk one | 2026-09-28 | 2026-10-06 copy | ✅ current |
| 891519016 Run log — Chunk one | 2026-09-28 | 2026-10-06 copy | ✅ current |
| 891944985 Review Decisions — Chunk three | 2026-09-25 | 2026-10-06 copy | ✅ current |
| 891977734 Run log — Chunk three | 2026-09-25 | (machine log, read in the update) | ✅ current |
| 841678852 Review Decisions and Open Questions | 2026-09-09 | 2026-10-06 copy | ✅ current |
| 844431363 Run log | 2026-09-09 | (machine log) | ✅ current |

## Confluence comment threads — NEW as a source in this check (PO answers, Rule 57)
Read in full: Chunk 1 MR footer thread 913866753 (engineering Q1–Q18) with replies 914391043, 916520963, 917667841 (PO),
917438478, 917897217, 917962753, and nested PO replies 917405698, 917438476, 918913025; Chunk 2 MR footer thread
914882562 (engineering #1–#32) with replies 916586498, 917733377 (PO), 917831683, 917536790, 919502849 and nested PO
replies 917209101, 918945793. No inline comments on either page; no comments on the main page.
- Every PO answer is dated 2026-10-05, the last at 14:58:36 UTC; each says the pages were "updated to match", and the
  pages were last edited 14:58:32–33 UTC. The anchors they name (S5-R12, S13-R43, S19-R9, S19-R19, S19-R23, S21-R6,
  S16-R2, S18-N7 …) are present in our 6 Oct copies and cited by the cases (C310711 covers S19-R23).
- **One question is still unanswered:** engineering reply 919502849 (5 Oct 16:54 UTC) asks whether High and Medium
  confidence estimates also read "Soon" in the email. Already PO question "Contact card and email #3"; C204175 asserts
  only the Low → Soon part.
- **One item deferred by the PO:** how the work order maintenance card works on a phone (#6, open on the main page).

## Jira epic SV-3780 — 47 children, all last updated 2026-10-05 (read in full, 94 KB)
- 20 stories (SV-10558…SV-10577): each is a one-line user story linking to the Chunk 1 / Chunk 2 section and the design.
  Nothing beyond the specification. Story ↔ suite split matches (Chunk 2 = S10, S11, S12, S16, S17, S18, S19, S22).
- 27 engineering verification tasks (SV-10847…SV-10873), "Source: tech plan Plan 1/Plan 2 … (the current copy is held
  by Milan Zivanovic)". Their tester-visible details repeat Plan 1/Plan 2, which were read in full in the update;
  their "Product decisions" blocks quote the PO replies above. No new testable behaviour found.
- Copy: `sources/jira-SV-3780-2026-10-06/SV-3780-children-2026-10-06.md`.

## Not checkable from here
- Tech plans: the copies the QA lead uploaded on 6 Oct are what we hold; the tasks say the current copy is held by
  Milan Zivanovic, so a newer revision cannot be detected from our side.
- Design: the live design link needs a claude.ai login; we hold the MR_V2_2 export uploaded on 6 Oct, driven end to end.
