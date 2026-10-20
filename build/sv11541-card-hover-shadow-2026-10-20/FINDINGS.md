# SV-11541 — Board View card hover shadow cut off left/right (staging, 20 Oct 2026)

Story Defect, parent SV-10046, TESTING STAGE, Slavcho. Pass bar = ticket "How to check" (Chris 79039). No PRD anchor quoted.
Build `v26.40.20-9c75418` (start and end of every run), Admin, 1440x900, dpr 2.

## Matrix (`sv11541.mjs`, `ev/run-admin.json`, pixel `px41.py`)
3 densities x {Unassigned top, Unassigned 2nd, first technician column, right-most on screen} x {light, dark} = **24 cells, 24 pass**.
- Rest box-shadow `none` in all 24. Hover light: `rgba(11,23,51,.08) 0 4px 8px, rgba(11,23,51,.05) 0 1px 2px`; border
  rgb(227,232,239) -> rgb(205,213,223). Dark: `rgba(0,0,0,.5) 0 6px 16px`; border rgb(54,65,82) -> rgb(75,85,101).
- Card rect identical rest vs hover in all 24 (moved=false).
- Clipping: `.q-virtual-scroll__content` now `contain: layout style` (19 Oct: `contain: content`, which clipped paint).
- Pixel darkening hover-minus-rest, 2-8 px outside the card (2x px, mean/max): light L 4.83/7, R 4.83/7, bottom 11.5/18;
  dark L 8.17/9, R 8.17/9, bottom 13.5/15.
- Same card S2-17495, Regular, light: today L 5.0/8, R 5.0/8, B 11.88/19. 19 Oct (`v26.40.19-31ad1e1`, SV-11394 cmp94):
  L 0/0, R 0/0, B 11.88/19 — and 19 Oct's developer-tools comparison without `contain` was L 5.0/8, R 5.0/8: today equals it.

## Not covered
Tech user not run: hover styling is not role-based and the How-to-check names no role.

## Exhibits
`sv11541-01-side-shadow-before-after.png` (same card, 19 Oct vs today, 5x contrast-raised edge strips, labelled),
`sv11541-02-rest-and-hover.png`. `build.py`.

## State
Admin prefs + theme restored (`restored true`, theme light at end). No recording / no technical section (QA lead: no preference = no).

## Outcome
Pre-post gate: build v26.40.20-9c75418 re-read, ticket TESTING STAGE no new comment, text scanned. **Posted 79105** (PASSED);
read back: panel first, 2 attachments in order (900x804, 900x1085), 7 rows + header, 5 steps.
