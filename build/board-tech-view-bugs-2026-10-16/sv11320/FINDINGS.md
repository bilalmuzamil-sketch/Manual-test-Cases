# SV-11320 — Tech View: drag grip on every row and technician header (none on Unassigned header)

**Verdict: PASSED, 7 of 7.** Posted as Jira comment **78913** on 16 Oct 2026 (exhibit + voiced film, no technical section).

## Source currency
| Source | Version | Checked | Verdict |
|---|---|---|---|
| PRD page 845185030 | v64 (2026-10-16T20:42:55Z) | at start + at posting | CURRENT. S9-R1a unchanged since v53, so v54 (Chris 15 Oct) = v64 for this rule |
| SV-11320 | TESTING STAGE, Slavcho Mitrov, 2 comments (both Chris Ward) | at posting | CURRENT, no other tester |
| Build | staging v26.40.19-754919e (last-modified 16 Oct 20:22:02 GMT) | start + posting | unchanged |

## Matrix (live, 1440 x 900)
| Cell | Admin (Work Orders create & edit) | Technician (role reset to template first; view only) |
|---|---|---|
| Unassigned rows with grip | 59/59 on screen; 156/156 while scrolling | 0/59 |
| Technician group rows with grip | Aaron Baker 16/16 | ZZAUTOTEST Ben Bravo 0/57 |
| Grip: icon / place / visible at rest | grip-vertical, 16 px, 16 px from row's left edge, opacity 1, cursor grab | — |
| Unassigned header grip | none | none |
| Technician header grips | 59/59 | 59/59 (57/57 with search ZZAUTOTEST) |
| Drag by middle of row | S2-35338 Ahtsham Foreman → Ahtsham Parts Manger, "Lead technician updated" | no move, no message, no request sent |
| Drag by grip | S2-35338 back to Ahtsham Foreman, "Lead technician updated" | n/a (no grip) |
| Click on row | opens /workorders/32d52d69…/lines | opens same |
| Click with 2 px slip | opens work order, no drag | opens work order, no drag |

Data: `data/g20-admin.json`, `g20-tech.json`, `c20-*.json`, `d20c.json`, `d20d.json`, `sc20.json`, `x20-*.json`.
Scripts: `../scripts/g20.mjs`, `c20.mjs`, `d20*.mjs`, `sc20.mjs`, `x20.mjs`, `VR20.mjs`. Role reset: `roleReset.mjs Technician`
(before = after = 6 template atoms, no drift).

Notes (not faults, observed): opening S2-35338 (0 lines) opens the New Line dialog automatically; a view-only drag
selects text in the row, which is ordinary browser behaviour.

## Shared staging state
S2-35338 was reassigned and then dragged back to Ahtsham Foreman (verified in the film, and by `d20d.json`).
Admin's and Tech's Tech View group state was left with all groups collapsed (the label reads "Expand all");
before the pass the label read "Collapse all" for both, so at least one group was open. This is a per-user view
preference, not data.

## Film
Two parts (admin, then Tech — signing out in one session would end the shared session), each voiced with
`anchor_mux.py` and cut with `idle_cut_voiced.py`, then joined: admin 91.6 → 51.5 s, Tech 65.2 → 29.3 s, final 80.8 s.
Line 5 had to be pinned with the new `--fix n5=137.3`: opening the work order changed the caption strip at 133.8 s
and was taken for the caption. Check: `voiceover/joined.check.png`.

## Pre-post gate
Build re-read (unchanged), ticket re-read, PRD v64, fingerprint scan clean, files referenced. Read-back: PASSED panel
first, image 1024x966 + video, table 8 rows, steps 6. No technical section.

Learning check: `anchor_mux.py --fix` added (playbook §AK 5d), LESSONS row on page navigation being taken for a caption.
