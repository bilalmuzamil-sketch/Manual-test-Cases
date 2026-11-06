# SV-11822 — Change Location list opens empty after reload — retest 6 Nov 2026

**Verdict: PASSED** — comment **80292** (green, 5 checks, 1 before/after exhibit; read back OK). Label `QAcomplete` added, moved **TESTING QA → QA Complete** (transition 10). QA Assignee already set (Ayesha, Mudassir) — left.

- Branch sv11839 `v26.45.0-5d54a3f` = fix commit 5d54a3f "the Change Location menu is always placed on screen" (menu re-placed on QSelect `virtual-scroll`; min size class `location-selector__menu`). Production `v26.45.1-753355c`.
- Set-up: Chromium (Playwright) on Linux, viewport **1536×936**, deviceScaleFactor **1.25** (and 1.5, 1.0), Admin quick-login, location switched **on screen** (Profile → chip → option), then reload, then Profile → chip (mouse click at its centre).
- Mudassir's real set-up was Windows Chrome at 125% OS scaling — **not available here (no Windows PC)**; stated in the comment.

## Why a delay was needed (comparison only, disclosed in the comment)
At 1.25 with no delay, **production also opens correctly here** (3 runs: normal, CPU 6×, my-workplaces delayed) — the failure depends on the list drawing late. The fix commit says it reproduced by holding the options back 500–1500 ms. Recreated with an init script that defers `requestAnimationFrame` callbacks by 800/1500 ms only at the chip click (`RAF=` in scripts/loc.mjs).
- Production + delay: **3/3 fail** — menu `style` has no top/left, `y=936`, `visibility: collapse`, 8 items inside (Trucks Hill 2 ×2, QA Testing ×1).
- Branch + delay: **pass in every run**.

## Own error caught mid-pass
The first matrix switched location with `POST /api/iam/change-location` — the SPA keeps its own `localStorage.location`, so every "location" there was really Test Location. Thrown away; re-run switching on screen (loc.mjs now verifies `localStorage.location == wanted id`, `SWITCHED LS …`).

## Final matrix (ev/matrix3.txt) — branch, location switched on screen
3 pixel ratios (1.25, 1.5, 1.0) × 4 locations (DVI Test, Staging Heavy Duty - 9919, Staging Lethbridge - 4310, Test Location) × (no delay, 1.5 s delay) = **24/24: y=203, visible, 4 items**. Plus 0.8 s delay (2), CPU 6× (1). Switch from the opened list DVI Test → Staging Lethbridge - 4310: stored + top button shows it.

## Pre-post gate
Build markers re-read before posting (unchanged); ticket re-read (TESTING QA, last comment Ayesha 80282). Voice scan clean. Read back 80292: first line PASSED, 1 image, 5 rows.
Test data: none created. Production location for bilal.muzamil put back to Trucks Hill 2.
