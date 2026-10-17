# SV-11406 — Tech View: the next group header pushes the held header off while scrolling

- **Verdict: PASSED (5 of 5)** — Jira comment 78922, posted 17 Oct 2026.
- Environment: Staging `v26.40.19-754919e` (last-modified Fri 16 Oct 2026 20:22:02 GMT, etag `W/"928cc4652ba2e8372e3d2a04c1f1d3f0"`), read before testing and again at the pre-post gate. Production `v26.40.19-d2441a9` (no Tech View there, so no before picture).
- Source: PRD page 845185030 v64 — S2-E1 and S2-R18 (quoted in the comment). Ticket "How to check" has 4 bullets; all four plus the "just under the column headings" part of S2-E1 were checked.
- User: Tech (quick-login `tech`), window 1440 x 900, zoom 100%.

## Variant matrix
| Cell | How | Result |
|---|---|---|
| Scroll down, groups with rows (David Haynes 6 WOs, search "Lamkin", all open) | sh06e dh, 2x screenshots held/push/swap | held at y=180 under headings (132–180); pushed to y=160 with Douglas Fields at y=204 = held bottom; Douglas Fields held at 180 |
| Scroll down, all groups open, 90 wheel steps of 20 px | sh06d | 19 group changes, every frame held.top = min(180, next.top − 44) (0 mismatches), max 1 held |
| Scroll down, the Tech user's own open/closed groups, no search, 160 steps | sh06b | 69 group changes, 1 held max. 4 checker mismatches were my checker matching the first of two groups both named "Chris Lee" (duplicate names), not the page |
| Scroll up (both runs, same number of steps) | sh06b/sh06d `up` | each change reversed, held header slides back down to 180 |
| Unassigned, many WOs (137, search "4 Star") | sh06e un + film n5 | held at 180, pushed (156–164) by ZZAUTOTEST Ana Alpha header at next = held bottom, then replaced |
| Unassigned, one WO (search "Lamkin") | sh06d first group | pushed off by ZZAUTOTEST Ana Alpha the same way |
| Only one held header | every snap in all runs (500 positions) | never more than 1 |

Not run: other window widths/densities — the ticket and S2-E1 are about scroll behaviour, not layout, and nothing in the source names a width.

## Evidence
- `ev/sv11406-01-held-header-push.png`, `ev/sv11406-02-unassigned-push.png` (built by `build_exhibits.py` from `ev/dh-*.png`, `ev/un-*.png` + `data/dh.json`, `data/un.json`).
- `data/scroll-trace-collapsed.json`, `data/scroll-trace-expanded-lamkin.json`.
- Film `ev/sv11406-held-header-staging-recording-voiceover.mp4`: 87.1 s raw → 54.6 s, idle removed 32.6 s (5 still stretches); voice offsets n1 0.5, n2 15.7, n3 23.22, n4 32.72, n5 49.3; caption strip checked at each offset (`voiceover/cut.check.png`). A bridging caption was added before the "4 Star" search because the previous caption otherwise stayed over the new page.
- Scripts: `../scripts/sh06*.mjs`, `../scripts/VR06.mjs`.

## State
- Tech user's `collapsedGroups` preference snapshot before each run and PUT back after; read back equal every time (`restored: true`). Nothing else written.

## Side observation (bucket d, unverified — to ask the QA lead, not filed)
- The Collapse-all button kept reading "Collapse all" while the Tech user's groups were all shown closed (no search). Same shape as the earlier "Collapse all" label observation (see main FINDINGS outstanding list). Not part of this ticket.

## Gate
build re-read identical · ticket TESTING STAGE, 1 comment (Chris Ward 15 Oct) · PRD v64 · text scan clean, no technical section · posted 78922 · read back: first block PASSED panel, media 1024x1558, 1024x1558, video; table 6 rows; steps 7.
Learning check: added a bridging caption when a film switches page between two voiced lines (see LESSONS row).
