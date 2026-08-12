# Schedule — cases carrying an automation marker that changed, 2026-08-12

For the automation engineer. **Every marker is machine-findable, exactly one per case, on the last
line of Expected Results after a blank line.**

## Live marker census, read back from TestRail after the writes

| Marker | Count |
|---|---|
| `AUTOMATION: READY` | **147** |
| `AUTOMATION: READY - EXPECT FAIL (…)` | **0** |
| `AUTOMATION: HOLD - …` | **29** |
| **Total** | **176** |

**THE GATE PASSES BOTH WAYS: 147 + 0 = 147, and 176 − 29 = 147.** Both figures were read back from
the live cases, not computed from notes.

**⚠️ 147 IS A COUNT OF WHAT IS AUTOMATABLE. IT IS NOT A COVERAGE CLAIM.** Only **76 of 176** rest on
the build that ships, and only **28** have had their steps walked on it.

## Markers that moved this pass — 9 cases

### HOLD → READY (3) — these are new automation candidates

| Case | Was |
|---|---|
| [C30074](https://shopview.testrail.io/index.php?/cases/view/30074) | needs a second sign-in as a view-only user |
| [C30075](https://shopview.testrail.io/index.php?/cases/view/30075) | needs a second sign-in as a view-only user |
| [C30082](https://shopview.testrail.io/index.php?/cases/view/30082) | needs a second sign-in as a view-only technician |

**All three now run green as a Schedule-View-only user.** They need that sign-in to automate, so hold
the credential rather than the case.

### READY → HOLD (1) — this one will now FAIL, and it has no ticket

| Case | Why |
|---|---|
| [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) | the tooltip shows the VIN only when the `VIN Number` toggle is ON; the documented expectation asks for it either way. **Do not automate as passing.** It cannot carry `READY - EXPECT FAIL` because the creation hold means no ticket number exists to name. |

### HOLD reason rewritten, still HOLD (3)

C30044 · C38872 · C38874 — each now names the **exact** missing user instead of "a second sign-in",
and records which of its points already pass. See `DIVERGENCES.md` §A.

### Text changed, marker unchanged (2)

[C30059](https://shopview.testrail.io/index.php?/cases/view/30059) — **step 1's scope label was wrong
and is corrected.** Any automation written against the old wording would have searched for a control
that does not exist. [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) · C30058 ·
C30061 — provenance only.

## The 29 HOLDs, grouped by what they are actually waiting on

| Waiting on | Cases | Detail |
|---|---|---|
| **a user at a permission level the estate does not have** | **10** | 2 edit-without-delete · 2 cannot-see-work-orders · 1 no-Schedule-permission · 1 delete-capable · 1 holder-of-each-level · C30044 · C38872 · C38874 |
| a feature that is not in the build | **9** | 6 panel collapse · Dashboard section · appointment on work-order creation · Priority field |
| an observed fault with no ticket number yet | **5** | the creation hold bars filing, so none can carry `EXPECT FAIL` |
| a product-owner answer | **3** | 2 never sent · 1 shop-closure setting absent as well |
| a staff-record setting (`Time Clock` ON and OFF) | **1** | C30084 |
| a state that had to be captured before the release | **1** | cannot be produced now |
| **Total** | **29** | matches the live census exactly |

**The first row is the ask.** Three role assignments — one user with Schedule permission off, one
with Edit but not Delete, one without Work Orders: View — would move **ten** cases out of HOLD. No
other single action comes close.
