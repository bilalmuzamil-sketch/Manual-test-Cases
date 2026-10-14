# Staging full run (14 Oct 2026) — checks to re-run after the main run (my script's fault, not the product)
| Case | Script | Why | Fix |
|---|---|---|---|
| C96912 | s1-batch4a | location switch: the script's picker found 0 options on staging ("options for Staging Lethbridge = 0") | switch with profile menu → `select_location` (stg6.mts `switchLoc`) |
| C96923 | s1-batch4a | same location-picker fault; then the Tech View click timed out | same |
| C96913, C154884 | s1-batch2b | read customers ("ZZAUTOTEST F1 Tabs" …) that s1-batch2 creates — and s1-batch2 runs AFTER it on staging (on the QA branch the data already existed) | second pass after the first full pass |
| C96920 | s1-batch3 | offline check: "Something went wrong loading this section" + "Part of the page failed to load" shown, the List click timed out — judge from the pictures; re-run if unclear | second pass |

**Rule for the second pass:** every script with an empty reading, an error, or a reading that depends on another script's data is
re-run once after the first pass, when all the suite's data exists on staging.
