# SV-11822 — retest of Mudassir Qamar's comment 80176 (5 Nov 2026, 01:17 −05:00)

**Ticket:** https://shopview.atlassian.net/browse/SV-11822 (status now REJECTED FROM TESTING). The QA lead deleted our 5 Nov "QA passed" comment (80173) after Mudassir's report.

## Mudassir's claim
- Still fails for him on sv11839 (v26.45.0-277b249) and staging (v26.45.0-440aa25).
- His set-up: Chrome on Windows, viewport 1536×936, display scaling 125% (devicePixelRatio 1.25), PC on Karachi time.
- Fails with any active location (Test Location on sv11839, QB Location on staging), even on a plain page load.
- The menu holds all locations, but it has no inline top/left, sits at x=0 / y=page bottom, with `visibility: collapse`.
- "Retests at DPR 1.0 won't show it."
- He wrote "Evidence attached", but the ticket has **no attachment from 5 Nov**. The newest of his attachments are from 27–28 Oct.

## Are his three points about our 5 Nov pass correct?
| His point | Correct? | What it changes |
|---|---|---|
| "You tested aacb66c" | **Yes.** The 5 Nov pass ran on v26.45.0-aacb66c. | Nothing for this menu. Between aacb66c and 277b249 **no front-end file changed** (`git diff --stat aacb66c73 277b24901 -- app/` is empty; the three commits are SV-12199/12201/12202 export fixes). |
| "You set the PC time zone to Fiji" | **Yes**, for DVI Test (Rule 99: the location's own zone). | Retested now with a Karachi browser, both Rule-99-matched (Test Location, staging Heavy Duty, both Asia/Karachi) and deliberately mismatched (DVI Test, QB Location). All opened. |
| 125% scaling | **Yes, our pass did not cover it.** The 5 Nov run used devicePixelRatio **2**, not 1.25. | Retested now at 1.25 (below). |

## What the DOM state he describes means (from the Quasar 2.19.3 source)
- `.q-position-engine { visibility: collapse }` is Quasar's starting state. It is "removed on first positioning" (`css/core/positioning.sass:106`).
- The position engine writes the inline top/left. It retries only 5 times, 10 ms apart, while the menu measures 0 high or 0 wide, then gives up silently (`utils/private.position-engine/position-engine.js`, `setPosition`).
- So "no inline top/left + visibility collapse" means **the engine measured the menu as 0 size and gave up**.
- This app already fixed the same failure twice for Firefox (SV-10801: `css/filters.scss`, `DateRangeSelector.vue`, both overriding with `visibility: hidden`). The location menu (`components/navigation/LocationSelector.vue` → shared Select, `.limit-select-options`) has no such override.
- This is a lead for the developer, **not a proven cause**.

## What I ran (5 Nov 2026, 06:30–06:45 UTC), Chromium, viewport 1536×936, Admin
Each run did plain load Dashboard → Profile → chip; plain load Work Orders → chip; reload Dashboard → chip.

| Run | Build | Browser zone | DPR | List on screen |
|---|---|---|---|---|
| sv11839 Test Location | 277b249 | Asia/Karachi (= location) | 1.25 | 3 / 3 |
| sv11839 Test Location, Chrome's own `--force-device-scale-factor=1.25` (closest to OS scaling) | 277b249 | Asia/Karachi | 1.25 | 3 / 3 |
| sv11839 Test Location, CPU slowed 6× | 277b249 | Asia/Karachi | 1.25 | 3 / 3 |
| sv11839 DVI Test | 277b249 | Pacific/Fiji (= location) | 1.25 | 3 / 3 |
| sv11839 DVI Test (diagnostic, zone mismatched on purpose) | 277b249 | Asia/Karachi | 1.25 | 3 / 3 |
| staging QB Location | 440aa25 | America/Vancouver (= location) | 1.25 | 3 / 3 |
| staging QB Location (diagnostic, mismatched) | 440aa25 | Asia/Karachi | 1.25 | 3 / 3 |
| staging Staging Heavy Duty - 9919 | 440aa25 | Asia/Karachi (= location) | 1.25 | 3 / 3 |

All 24 checks: menu positioned (top 202.9 px), visibility visible, all 4 locations listed.
Evidence: `evidence-*.json` and `*-0/1/2.png` in this folder. Tools: `../tools/sv11822_dpr.mjs`, `../tools/sv11822_staging_dpr.mjs`.

## Verdict
- **Mudassir is right that our 5 Nov pass did not test his set-up.** It ran on Linux Chromium at DPR 2 with the location's zone. Calling it "QA passed" while the reporter still reproduces on the current build was premature. Deleting the comment and rejecting the ticket is correct.
- **He is not right that the time zone or the aacb66c build is the cause.**
  - The front end is identical between the two builds.
  - A Karachi browser opens the menu fine, with every location.
- **I cannot reproduce it here, even at 125%.** That includes the Chrome flag that imitates OS scaling and a 6× slower CPU, on both sv11839 and staging. So the trigger is something on his Windows machine that this Linux browser does not copy: real Windows display scaling, GPU, extensions, or Chrome's version or zoom. This environment has no Windows Chrome.
- **His own 28 Oct comment differs from today's.** Then: only DVI Test failed, and Lethbridge opened. Today: every location fails. So the location is not the variable; his machine's set-up is.
- **Status:** NOT VERIFIED as fixed. Not reproducible on Linux Chromium. Reproducible only on Mudassir's Windows Chrome at 125%.
- **What would settle it:**
  1. His missing 5 Nov evidence: a screenshot, plus his Chrome version and `navigator.userAgent`.
  2. Whether it still fails in a Chrome Guest window (no extensions) at browser zoom 100%.
  3. The developer could try the SV-10801-style override (`visibility: hidden` on this menu) and have Mudassir retest.
