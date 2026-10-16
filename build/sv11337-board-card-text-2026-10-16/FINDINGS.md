# SV-11337 — Board View card text smaller and lighter than the design — staging retest, 16 Oct 2026

**Ticket:** [SV-11337](https://shopview.atlassian.net/browse/SV-11337) — Story Defect, parent SV-10046, TESTING STAGE, assignee Slavcho Mitrov, reporter Ahtasham Amjad (14 Oct). No comments by anyone before ours → not tested by someone else.
**Build:** staging v26.40.19-1493c63 (last-modified Fri 16 Oct 2026 18:32:36 GMT, etag 9bc39e81…). Window 1600 x 1000 (DPR 2), zoom 100%; recording 1440 px.

## Sources (Rule 31/32)
- Ticket expected (14 Oct, design estimate): number ≈15px, customer ≈15–16px/600, unit·asset ≈13px, total ≈16px/600.
- **PRD "Work Orders — Board View & Tech View Display Options" v62** (Confluence 845185030, 2026-10-16T17:35Z) — supersedes it:
  - S6-R4 (added v54, 15 Oct, Chris ruling on Bilal's Q27): "Row and card text is 14px at every density; Compact never shrinks it. Text the design sets at 12px at every density, such as column header labels (S2-R21), the progress percentage and secondary lines, stays 12px."
  - S2-R23 (v55, 15 Oct): "Board card customer and total price are weight 500".
- Verdict judged against the PRD (latest authoritative source); Rule-56 divergence sentence in the comment.

## Matrix (all observed)
| Density | Cards | Number | Customer | Unit · asset | Total price | Other secondary (progress, vehicle, est. hours, technician) |
|---|---|---|---|---|---|---|
| Compact | 57 | 14px/500 ×57 | 14px/500 ×57 | 12px/500 ×57 | 14px/500 ×57 | 12px/500 all |
| Regular | 52 | 14px/500 ×52 | 14px/500 ×52 | 12px/500 ×52 | 14px/500 ×52 | 12px/500 all |
| Comfortable | 52 | 14px/500 ×52 | 14px/500 ×52 | 12px/500 ×52 | 14px/500 ×52 | 12px/500 all |
Same card as the reporter (S2-16614, Desert Edge Truck Service & Repair, Brandi Smith column): identical values at each density; card height 175 / 187 / 203 px. Data `data/b2.json` (all cards), `data/b4.json` (S2-16614).

**Verdict: PASSED** against PRD v62 S6-R4 + S2-R23. Text sizes unchanged since the ticket was filed — the spec moved to match them.
No production comparison: Board View does not exist on production (said in the comment).

## Recording
`ev/sv11337-board-card-text-staging-recording-voiceover.mp4` — 42.6 s, en-US-AriaNeural +10%, 5 lines. **Timing lesson:** the board re-render after each density switch stalls Playwright's video, so wall-clock step times drifted 2–3.5 s and one caption was lost on the first two takes. Fix: wait 1.8 s after the switch, then anchor each voice line to the caption-change times detected in the raw film (PIL frame diff on the caption strip). Captions verified at each voice onset (`voiceover/capstrip3.png`); speech present at every step (−19.9 to −22.4 dB). Density left on Regular (PRD default).

## Pre-post gate (≈15:05 CDT)
Build marker re-read unchanged; ticket re-read (TESTING STAGE, 0 comments); PRD still v62; voice scan clean; no technical section (QA lead: none).

## Posted
Comment **78904**; attachments 62477 (exhibit), 62478 (recording). Read back: green panel first, media file 818x1029 then mp4, table 6 rows, 2 quotes, 4 steps.
