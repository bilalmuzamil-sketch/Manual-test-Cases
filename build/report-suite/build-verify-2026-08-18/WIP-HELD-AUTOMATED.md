# WIP-HELD-AUTOMATED — the 10 Automated WIP cases HELD this build-verify pass (Rule 71)

**Report 5 of 6 (Work In Progress) · build-verify pass 2026-08-18.**
Build under test: **`v3.8-bd246fd`** (last-modified 2026-08-18 19:57:31 GMT, etag
`c4dd352f91ecfee192844c6a04a643fc`). **⚠️ The live staging session was DEAD for the whole of this pass
(shared `sv_sso_session` rotated by a sibling worker — see `WIP-PLAN.md` §0), so these 10 could NOT be
verified live either.** They remain **HELD and UNTOUCHED** regardless — under Standing Rule 71 an
Automated case (`custom_atmstatus = 3`) is the contract Vladimir Tomovic's automation runs against, so
it is edited **only coupled to a live build-verify pass, ask-first**. **0 of the 10 written.**

## Identification (live TestRail, 2026-08-18 ~22:00Z)

`custom_atmstatus = 3` confirmed LIVE for all 10; all `created_by = 3` (ours). This is **exactly** the
set staged in `build/report-suite/wip-v22-2026-08-18/HELD-AUTOMATED.md` — the 8 named in the prior
remainder (C30460, C30488, C30498, C30508, C30510, C30515, C30518, C30527) **plus** C30452, C30462. No
Automated WIP case exists outside this set. The **2 foreign Automated cases** in the WIP sections
(C43572, C38922, both Vladimir Tomovic id 1) are separate, hands-off, and not in this list (Rule 38).

## The 10 held cases — current LIVE marker + spec pin + what a coupled build-verify pass owes

| C-id | internal | atm | spec pin (live) | live marker (unchanged) | owed when coupled build-verify runs |
|---|---|---|---|---|---|
| [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | WIP-TAB-02 | 3 | v21 | `AUTOMATION: READY` | v22 metadata re-stamp **+ line-state parenthetical reword** (Chris B) + build stamp on live-verify |
| [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) | WIP-SCOPE-05 | 3 | v21 | `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` | v22 re-stamp; live: feature present? lift or keep-deferred(date→8/18) |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | WIP-PLACE-01 | 3 | v21 | `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` | v22 re-stamp **+ line-state reword** + refs story fix SV-8656→SV-8659 (Chris B) |
| [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | WIP-SUM-02 | 3 | v21 | `AUTOMATION: READY` | v22 re-stamp + build stamp on live-verify |
| [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) | WIP-FLT-01 | 3 | v21 | `AUTOMATION: READY - EXPECT FAIL (SV-8968)` | ⚠️ **SV-8968 is OBSOLETE/Done (Jira, live 2026-08-18) → no live backing (§15.1).** A coupled pass strips the marker → plain READY (if feature present), else deferred. v22 re-stamp; **marker change ask-first + Vlad hand-off** |
| [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) | WIP-PERS-03 | 3 | v21 | `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` | v22 re-stamp; live present? lift or keep-deferred |
| [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | WIP-EXP-01 | 3 | v21 | `AUTOMATION: READY` | v22 re-stamp + build stamp |
| [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | WIP-EXP-06 | 3 | v21 | `AUTOMATION: READY` | v22 re-stamp + build stamp |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | WIP-EXP-09 | 3 | v21 | `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` | v22 re-stamp; live present? lift or keep-deferred |
| [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | WIP-PERM-02 | 3 | v21 | `AUTOMATION: READY` | v22 re-stamp + build stamp |

## Reconciliation with `wip-v22-2026-08-18/HELD-AUTOMATED.md`
- The v22 pass staged a **metadata-only v22 re-stamp** for all 10 (none cites S11-R1/R2/R3, so no
  content change from the Story-11 grain), plus a line-state content reword for C30452/C30462 (Chris B,
  Story-2/3 placement). **That staging is unchanged by this pass** — still not written, still held.
- **New this pass:** C30498's EXPECT-FAIL ticket **SV-8968 is confirmed OBSOLETE/Done live**, so its
  marker has no live backing and a coupled build-verify pass should re-adjudicate it (Rule 61) — recorded
  here so it is not missed.

## FOR VLAD (Rule 65)
**None changed this pass.** No `custom_atmstatus = 3` case was written (the 10 are HELD; the session was
dead, so no build-verify coupling was possible). The tell-Vlad hand-off fires only when a coupled
build-verify pass edits any of the 10, at which point each edited case number goes to Vladimir Tomovic
(id 1) via `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.

**Ask-first gates every one of these edits even when coupled with build verification.**
