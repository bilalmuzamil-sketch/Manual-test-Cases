# Staging full run (14 Oct 2026) — checks to re-run after the main run (my script's fault, not the product)
| Case | Script | Why | Fix |
|---|---|---|---|
| C96912 | s1-batch4a | location switch: the script's picker found 0 options on staging ("options for Staging Lethbridge = 0") | switch with profile menu → `select_location` (stg6.mts `switchLoc`) |
| C96923 | s1-batch4a | same location-picker fault; then the Tech View click timed out | same |
| C96913, C154884 | s1-batch2b | read customers ("ZZAUTOTEST F1 Tabs" …) that s1-batch2 creates — and s1-batch2 runs AFTER it on staging (on the QA branch the data already existed) | second pass after the first full pass |
| C96920 | s1-batch3 | offline check: "Something went wrong loading this section" + "Part of the page failed to load" shown, the List click timed out — judge from the pictures; re-run if unclear | second pass |

**Rule for the second pass:** every script with an empty reading, an error, or a reading that depends on another script's data is
re-run once after the first pass, when all the suite's data exists on staging.

## Wave 1 judged (14 Oct 18:55 UTC) — `judge/wave1.json`: 25 Passed, 26 to re-run, 0 Failed, 1 doubt (C96920)
**Staging was redeployed during the run: v26.40.17-ddb9ba1 at 17:40 → v26.40.17-a5c4210 by 18:05 (read from the sign-in lines).**
Every script that ran before 18:05 (s1-batch1, s1-batch4a, s1-batch3) and the six of this afternoon (stg6) are re-run on a5c4210,
so the whole run is on one build.
Second-pass settings (all in wob-run.sh's list): `WOB_PIN_NAMES="Ayesha Khan"` (her group/column was off screen among ~119
technicians: C96914 C96915 C96916 C96917 C96925 C96932 C96933 C96935 C368129 C368126 C96949), `WOB_LOC_SELECT=1` (location via
profile menu → select_location: C96912 C96923), `seed-staff.mts` first (Aaron Baker, Brenda Martinez, Chris Lee ×2, Billy Nobill,
the long-named technician: C96926 C96930 C96938 C368161). Still to look at: C368130 (needs a location with no technicians —
"ZZAUTOTEST Empty Shop" exists only on the QA branch), C96937 (Service Advisor set-up), C96936 C96929 (empty readings), C96927
C368125 C368127 (partial readings), C96913 C154884 (data order).
