# HELD — the 10 Automated WIP cases NOT re-stamped in the full v22 pass (Rule 71)

**Full WIP v21→v22 re-stamp pass, 2026-08-18.** The 76 NON-Automated (`custom_atmstatus = 1`)
WIP cases still at v21 were re-stamped to v22 and byte-verified. **The 10 WIP cases flagged
Automated (`custom_atmstatus = 3`) are HELD and were NOT touched** — under Standing Rule 71 an
Automated case is the contract Vladimir Tomovic's automation runs against, so it is edited **only
coupled to a live build-verify pass**, and build verification is **DEFERRED** this pass. Confirmed
live `custom_atmstatus = 3` for all 10 (2026-08-18). All 10 remain `created_by = 3` (ours).

**Together these 10 are the complete held-Automated WIP set** — the 8 named in the prior pass's
remainder (C30460, C30488, C30498, C30508, C30510, C30515, C30518, C30527) **plus** the 2 held from
the earlier Chris answer-B pass (C30462, C30452). Re-confirmed live: the live Automated v21 set is
**exactly** `{C30452, C30460, C30462, C30488, C30498, C30508, C30510, C30515, C30518, C30527}`.

## Story-11 content impact — checked, NONE affected
The only testable v21→v22 change is the Story-11 nightly-snapshot grain (S11-R1/R2/R3, per-WO →
per-WO-per-tab; see `SPEC-DIFF-v21-v22.md`). **None of the 10 held cases cite S11-R1/R2/R3 and none
carry old per-WO grain phrasing** (checked live). **So every one of the 10 needs only a METADATA v22
re-stamp** — provenance sentence-1 `version 21 → 22` with the spec read-on date bumped to 18 August
2026, and `refs`/`spec_ref` `WIP spec v21 <date>` → `WIP spec v22 2026-08-18`. **The numbered
expected body and the AUTOMATION marker stay byte-identical** (Rule 69 content-vs-metadata
refinement — a metadata-only re-stamp does not change the marker).

**Two of the ten (C30452, C30462) ALSO carry a separate line-state content reword** staged in the
earlier Chris answer-B pass (`build/report-suite/chris-answers-2026-08-18/HELD-AUTOMATED.md`). That
reword is a Story-2/Story-3 placement change (Chris Ward 2026-08-18 answer B), **not** the Story-11
grain change, and it is unchanged by v22 (§3 Key Decisions placement wording is byte-identical
v21↔v22). The build-verify pass applies BOTH the line-state reword AND the v22 metadata pin to those
two in one coupled step.

## The 10 held cases — current live state + intended v22 re-stamp (staged, NOT written)

| C-id | atm | live marker (unchanged) | intended v22 metadata re-stamp |
|---|---|---|---|
| **C30452** WIP-TAB-02 | 3 | `AUTOMATION: READY` | pin→v22, refs `SV-8657 (WIP spec v22 2026-08-18 Story 1 S1-R2; S1-R3; §3 Key Decisions (no on-screen status filter)…)` **+ line-state parenthetical reword** (Chris B; see chris-answers HELD-AUTOMATED.md) |
| **C30460** WIP-SCOPE-05 | 3 | `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` | pin→v22, refs `SV-8655 (WIP spec v22 2026-08-18 S2-N1; …)` |
| **C30462** WIP-PLACE-01 | 3 | `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` | pin→v22, refs `SV-8656→SV-8659 (WIP spec v22 …)` **+ line-state reword** (Chris B; see chris-answers HELD-AUTOMATED.md — that pass also flagged the SV-8656→SV-8659 refs story fix) |
| **C30488** WIP-SUM-02 | 3 | `AUTOMATION: READY` | pin→v22, refs `SV-8661 (WIP spec v22 2026-08-18 Story 5 S5-R2)` |
| **C30498** WIP-FLT-01 | 3 | `AUTOMATION: READY - EXPECT FAIL (SV-8968)` | pin→v22, refs `SV-8663 (WIP spec v22 2026-08-18 Story 7 S7-R1 …)` — marker/EXPECT-FAIL preserved |
| **C30508** WIP-PERS-03 | 3 | `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` | pin→v22, refs `SV-8664 (WIP spec v22 2026-08-18 S8-R7; …)` |
| **C30510** WIP-EXP-01 | 3 | `AUTOMATION: READY` | pin→v22, refs `SV-8665 (WIP spec v22 2026-08-18 Story 9 S9-R1)` |
| **C30515** WIP-EXP-06 | 3 | `AUTOMATION: READY` | pin→v22, refs `SV-8665 (WIP spec v22 2026-08-18 Story 9 S9-R9 …)` |
| **C30518** WIP-EXP-09 | 3 | `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` | pin→v22, refs `SV-8665 (WIP spec v22 2026-08-18 Story 9 S9-R11 …)` |
| **C30527** WIP-PERM-02 | 3 | `AUTOMATION: READY` | pin→v22, refs `SV-8657 (WIP spec v22 2026-08-18 Story 1 S1-N1 …)` |

(TestRail links: `https://shopview.testrail.io/index.php?/cases/view/<id>` per Rule 8.)

## What the build-verify pass owes (Rule 71 + Rule 65)
1. Apply the v22 metadata re-stamp above to each of the 10 (pin + spec read-on 18 Aug 2026 + refs
   `WIP spec v22 2026-08-18`), coupled to a live observation on a WIP build.
2. For **C30452 / C30462** additionally apply the staged line-state reword + the C30462 refs story
   fix (SV-8656 → SV-8659), per `chris-answers-2026-08-18/HELD-AUTOMATED.md`.
3. Preserve each case's marker unless the live observation warrants a change (e.g. C30498's
   EXPECT-FAIL SV-8968 stays until the build shows the fix shipped, Rule 61).
4. **FOR VLAD (Rule 65):** none of the 10 was changed this pass; the tell-Vlad hand-off fires when
   the coupled build-verify pass edits them.

**Ask-first still gates each edit even coupled with build verification.**
