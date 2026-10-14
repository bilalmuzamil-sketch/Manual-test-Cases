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

## Wave 2 judged (14 Oct 19:45 UTC) — `judge/wave2.json`: 12 Passed, 17 to re-run, 0 Failed, 1 doubt (C96973)
- **Fix shipped (case outcome 3 — tell the QA lead):** C368134, C368136, C154889 — the "what you should see today" note says the
  shift question does not appear; on staging it appears and behaves as the expected results say.
- **C96973 — for the QA lead:** after reassigning the only card away with Assigned to me on, the board shows the filter empty
  state ("No work orders match these filters") instead of your column with 0. The PRD's newer S1-N1/S1-N1a (v43) say an empty
  filtered result shows that empty state; the case says "your column count goes from 1 to 0". Case vs newer source — report,
  Expected untouched (114).
- Re-run: C96943 C154886 C368132 (s3-batchB crashed) · C96950 C368131 C96967 C96970 (missing staff — seed-staff.mts first) ·
  C96957 C96959 (pin limit full from leftover pins — clear pins first: WOB_PIN_NAMES=" ") · C96961 C96962 C368140 (off screen —
  pin) · C96956 C96966 (partial readings) · C368133 C96965 (covered by stg6.mts on the current build) · C154888 (ran at 00:23 shop
  time — re-run away from shop midnight).

## Wave 3 judged (14 Oct 20:30 UTC) — `judge/wave3.json`: 22 Passed, 13 to re-run, 0 Failed
Re-run: C96974 (Invoiced work order not made; other-location work not made) · C96975 C96976 (second location — location route) ·
C96983 (Tech View columns not read) · C96978 (two technicians must be clocked in — use two different fresh technicians) ·
C96980 C96986 (role "ZZAUTOTEST WO View Only" + its users missing on staging — create) · C96989 (location route) · C96992 (only
Customers table compared) · C96997 C96999 C97000 (by hand on the QA branch — no script reading; script or walk them) · C96998
(the canned line has parts waiting, so "Receive parts" stopped the completion — use a line with no parts).

## Wave 4 judged (14 Oct 21:10 UTC) — `judge/wave4.json`: 13 Passed, 11 to re-run, 0 Failed
Re-run: C97003 C97012 C368147 C97020 (view-only role — now made by stg-setup.mts) · C97007 ("Ben Bravo" not in the lead list —
seed first) · C97013 (In progress set-up failed) · C97011 (Tech View repeat not done) · C97005 (real sign-out + technician drag
not done) · C97010 (second-tab invoice not done) · C368148 (read while loading — wait) · C368146 (board read stops at 125
columns — pin Aaron/Ezra or scroll to the end).
