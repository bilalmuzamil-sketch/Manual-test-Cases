# SV-11394 re-test — Board View card hover shadow (19 October 2026)

**Verdict: PASSED** — comment [78958](https://shopview.atlassian.net/browse/SV-11394?focusedCommentId=78958); question to Chris on the cut-off side shadow — comment [78959](https://shopview.atlassian.net/browse/SV-11394?focusedCommentId=78959).

## Source currency
- Build: staging `v26.40.19-31ad1e1` (last-modified Sun 18 Oct 2026 19:39:33 GMT, etag `48a92c2e…`) — read at test start and again at post time (gate), unchanged.
- PRD 845185030 v64 — silent on the hover *look* (S3-R13 covers only what hover reveals).
- Story SV-10046 UI/UX section links the Claude Design "Work Orders"; design README: "Hover is a colour shift plus a lift (elev-1 → elev-2), never a scale."
- Chris Ward ruling, comment 78901 (16 Oct): remove the "no-shadow" override so hovering shows the design's soft shadow, with the darker border. Matches the story's design source (Rule 109).
- Slavcho 78908: fixed in PR #3745.

## Matrix (all observed live, computed style + screenshots)
| Card | Variant | Rest shadow | Hover shadow | Moved/grew |
|---|---|---|---|---|
| S2-34941 | Compact / Regular / Comfortable, Unassigned | none | `rgba(11,23,51,.08) 0 4px 8px, rgba(11,23,51,.05) 0 1px 2px` | no |
| S2-16688 | Paid, technician column | none | same | no |
| S2-17495 | Lamkin, light + dark | none | light same; dark `rgba(0,0,0,.5) 0 6px 16px` | no |
| S2-33692 | first column top, light + dark | none | same | no |
| S2-33043 | first column 2nd card, light + dark | none | same | no |
| S2-35175 / S2-35176 | 2nd / rightmost technician column | none | same | no |

Border: light rgb(227,232,239) → rgb(205,213,223); dark rgb(54,65,82) → rgb(75,85,101). Dark theme switched through the profile menu (product way). Tech View row hover: pixel 255 → 247 (light grey), unchanged.

## Open question (to Chris, 78959)
The shadow's left and right sides are clipped: the virtual-scroll list box (`.q-virtual-scroll__content`) has `contain: content` and is exactly card width, so paint is clipped at the card's sides; the bottom shows. Comparison only (developer tools, `contain: none`): full shadow. Asked A (below is fine) / B (all sides → remaining issue to Slavcho). QA lead's direction: "Ask Chris first".

## Evidence
- `ev/sv11394-01-before-after.png` — BEFORE = our 16 Oct capture on edc8195 (attachments 62455 panel 2 + 62456 top), AFTER = same work order S2-33692 today (`ba94cap.mjs`, `ba94cap.json`); built by `ba94.py`.
- `ev/sv11394-q-side-shadow.png` — 3-panel side-shadow question picture (panel 3 labelled comparison only).
- `ev/sv11394-card-hover-shadow-staging-recording-voiceover-v4.mp4` — `VR94.mjs`; duration_before_s 58.8, duration_s 42.0, idle_removed_s 17.0 (9 stretches); frame grids in `voiceover/`.
- Data: `hv94.json`, `hv94b.json`, `clip94.json`, `cmp94.json`.

## Pre-post gate
Build marker re-read (unchanged), ticket re-read (TESTING STAGE, 4 comments, last Slavcho 78908), PRD v64, fingerprint scan clean, every embed has width+height; read-back: PASSED panel first, media 1024x567 then 1280x800, table 8 rows (header + 7), 5 steps; Chris comment: mention first, media 1024x383, 2 steps.

## Learning check
Nothing new beyond the existing before/after-label rule — applied: the BEFORE half is the same work order as the AFTER.

## 2026-10-19 update
QA lead moved SV-11394 to Done (status Done, resolution Done, re-read live). Chris's answer on the side shadow is still awaited; once he replies, the QA lead will decide what to do (verbatim: "we will see what to do for this remaining issue once Chis replies to our comment").
