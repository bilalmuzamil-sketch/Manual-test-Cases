# SV-11319 — Tech View and Board View: use the design's Lucide icons

**Verdict: PASSED, 7 of 7.** Posted as Jira comment **78912** on 16 Oct 2026 (with the exhibit and a voiced film).

## Source currency
| Source | Version | Checked | Verdict |
|---|---|---|---|
| PRD "Work Orders — Board View & Tech View Display Options" (page 845185030) | v64, 2026-10-16T20:42:55Z | 16 Oct, at posting | CURRENT |
| Ticket SV-11319 | TESTING STAGE, assignee Slavcho Mitrov, 1 comment (Chris Ward 14 Oct: "test against PRD v51 S1-R9a") | at posting | CURRENT, not tested by anyone else |
| Build | staging v26.40.19-754919e, last-modified Fri 16 Oct 2026 20:22:02 GMT | start + at posting | unchanged |

**v51 → v64 divergence (Rule 56):** v51 S1-R9a: "empty states ( clipboard-list ). List's icons are unchanged."
v64: clipboard-list only for "the empty state when there are no work orders at all"; "The filtered no-results state
is the List's, magnifier included"; "The filter chips and Search use the design file's icons in every display option,
List included". Tested against v64 (latest wins); disclosed in the comment, check 6 covers the change.

## Matrix (all observed live, icon names read from `svg[data-icon]` on the page)
| Point | Tech View | Board View | List |
|---|---|---|---|
| Switcher list / user-round / square-kanban, 20 px, unselected rgb(105,117,134), selected rgb(54,65,82) | yes | yes | yes |
| Density icon | row-height | card-height | n/a (no density in List) |
| Collapse chevron | chevron-down (rotated right while closed) | n/a | n/a |
| Unassigned avatar | user-round 14 px | user-round 14 px | n/a |
| Pin / pin-off | pin, pin-off after pinning (pinned one tech temporarily, unpinned again) | pin, pin-off | n/a |
| Lock on Invoiced/Paid | n/a (not in Tech View rows) | lock 12 px (`board_card_lock`) | n/a |
| Group grip | grip-vertical | grip (column drag handle) | n/a |
| No work orders at all (ZZAUTOTEST F2 Empty Shop, Estimates tab) | "No work orders yet" + clipboard-list 24 px + Create Work Order | same | List keeps its own "No work orders found." with Material search |
| Filtered no-results (search ZZNOMATCH19Q) | List's page, Material search in grey circle | same | same |
| Other List icons | — | — | identical to Production apart from the switcher and the Search magnifier (ds-search; checked under SV-11404) |

Evidence: `data/i19.json`, `data/i19c.json`, `data/e08d.json`, `data/nr19.json`; screenshots in `ev/`.
Scripts: `../scripts/i19*.mjs`, `e08d.mjs`, `nr19.mjs`, `VR19.mjs`.

## Film
`VR19.mjs` recorded at 1440 px; voice anchored with `anchor_mux.py` (69.7 s), then still stretches outside the
spoken lines cut with the new `build/testing-tools/idle_cut_voiced.py`: **69.7 s → 49.3 s, 20.7 s removed, 10 stretches**.
Voice/caption sync re-checked after the cut (`voiceover/cut.check.png`, loudness −19.6…−22.6 dB at each line).

## Pre-post gate
Build re-read (unchanged), ticket re-read (TESTING STAGE, only Chris's comment), PRD v64, fingerprint scan clean,
both files referenced. Read-back: first block PASSED panel, image 1024x594 + video as attachments in order, table 8 rows
(header + 7), steps list 5. No technical section.

## State left
Admin pins back to [], location back to Staging Heavy Duty - 9919, Tech View, density Regular.

Learning check: new tool `idle_cut_voiced.py` (playbook §AK 5f) + LESSONS row (voiced films were posted without the
Rule-107 idle cut: SV-11318 11.6 s, SV-11337 11.0 s, SV-11338 9.5 s of still frames left in).
