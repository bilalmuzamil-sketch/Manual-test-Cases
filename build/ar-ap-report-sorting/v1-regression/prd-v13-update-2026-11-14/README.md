# PRD v12 -> v13 update of the A/R A/P regression cases (14 Nov 2026)

**Ordered:** QA lead, 14 Nov 2026, "2. YES" to the TestRail updates. Item 1, correcting SV-12545's description, was
first approved and then withdrawn: "I would suggest not to change the description for that ticket". **SV-12545 was
not touched.**

**PRD:** Confluence 947650561 **v13** (13 Nov 2026, Chris Ward). Re-checked as current just before the writes (Rule 59):
last modified 2026-11-13T14:36:51Z, which is the v13 save. v13 only *adds* S5-R10b and a change-log row
(`diff ../sources/PRD-947650561-v12-2026-11-12.md ../sources/PRD-947650561-v13-2026-11-14.md`), so every quote
already in the cases is still word for word in v13 (`tools/check.py`: 0 problems).

**What changed: `custom_expected` only, worked on the live text read 14 Nov (`live-before/`):**

| What | Cases |
|---|---|
| PRD citation labels v12 -> v13 | 103 (all of ours except the 4 retired cases and 1 with no PRD label) |
| C1078980 (V1R-07) and C1078981 (V1R-08): EXPECT FAIL block removed, marker set to `AUTOMATION: READY` (outcome 3: the SV-12545 fix passed on staging) | 2 |
| C1078980 / C1078981: "the PRD v13 is silent on it" -> S5-R10b quoted word for word (no longer silent; Rules 113/123) | 2 |
| C1078980 / C1078981: Rule 54 stamp -> "Last checked against build v26.45.4-f3d3d2d (staging) on 11/14/2026." | 2 |

65 cases say the PRD "does not change" a V1 behaviour. S5-R10b only adds days after today and keeps production's
behaviour, and none of these cases uses a day after today, so that sentence stays true for all 65.

**Readback:** 103 of 103 HTTP 200, verification OK. Each case was read back after its write: the Expected text is
exactly what was sent, and the title, steps, preconditions and Automation status are unchanged (`push-log.jsonl`).
Automated flags: `custom_atmstatus` is 1 ("Not Automated") on all 108 cases, so Rule 71 / 65 did not apply.

**Local copies:** `update_local.py` applied the same change to `cases/cases.json`, `cases/CASES.md`,
`tools/inventory.py` and `tools/check.py`, including the retired cases, as the v12 update did locally. V1R-07 and V1R-08
moved from POSSIBLY LOST to KEPT.

    python3 update_v13.py --dry-run | --write      # TestRail
    python3 update_local.py                        # local copies
