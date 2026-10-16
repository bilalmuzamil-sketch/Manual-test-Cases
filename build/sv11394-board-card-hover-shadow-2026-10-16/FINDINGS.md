# SV-11394 — Board View card hover shows no shadow (staging check, 16 Oct 2026)

**Asked by:** QA lead (Chris Ward's comment 78880: "check the card's computed box-shadow on hover. If it's there but invisible, reassign to Slavcho...; if it's missing, send it back with the build number"). QA lead's answers: recording **yes**, technical section **no**, **comment only** (no reassign).

**Environment:** staging, build **v26.40.19-edc8195** (last-modified 14:51:30 GMT, read before and after), Admin, window 1440×900 (also 1920×900), Work Orders → All → Board View.

## Matrix
| # | Check | Observed | Result |
|---|---|---|---|
| H1 | Border on hover | rgb(227,232,239) → rgb(205,213,223) = `--sv-border-strong` #cdd5df, on 30/30 cards (12 cards / 4 columns at 1440; 18 / 6 at 1920) | PASS |
| H2 | Card grows or moves | `transform: none`, bounding rect identical before/after | PASS (doesn't move) |
| H3 | Shadow on hover | computed `box-shadow: none` on 30/30 cards; every card has class `no-shadow` | FAIL |
| H4 | Why | hover rule `.board-card[data-v-131aed12]:hover { border-color: var(--sv-border-strong); box-shadow: var(--sv-shadow-card); }`, `--sv-shadow-card` = `0 4px 8px rgba(11, 23, 51, .08)`; overridden by `.no-shadow, .shadow-0 { box-shadow: none !important; }`. Removing the class in my browser only → hover gives `rgba(11, 23, 51, 0.08) 0px 4px 8px 0px` and the shadow is visible | — |
| H5 | Clipping by the column | `board-column__body` overflow auto with 12px padding; `board-column__panel` overflow hidden; a 4px/8px-blur shadow fits inside the padding (and is visible in the diagnostic) | not clipping |

## Verdict
**FAILED / still reproduces** — the shadow is **missing** (computed `none`), not invisible. Per Chris: "send it back with the build number" — build stated in the comment. Not reassigned (QA lead: comment only).

## Recording
41.4 s → 18.3 s (Rule 107), clean decode, frame grid checked; captions carry values read live (border colours, shadow `none`) for S2-33692, S2-33465, S2-33043.

## Pre-post gate
Marker re-read v26.40.19-edc8195 (unchanged); ticket Open, only Chris's 78880 since filing; voice clean; no technical section. Posted **78898**; read back: 3 media `type:file` (960×454, 810×301, video), 4 table rows, first text "OVERALL QA STATUS: FAILED", rule present.

## Learning check
- A hover-only fault is proven by the computed style on hover with a real mouse move, plus a diagnostic that removes the suspected override in the browser only (labelled as such). A faint shadow (8% opacity) needs an enlarged close-up; never draw the box over the area the shadow falls in.
- Waiting for `[data-test-id^="board_card_"]` to be visible times out — the first match is hidden; wait for a card id with a uuid that is on screen. (playbook §AT addendum)
