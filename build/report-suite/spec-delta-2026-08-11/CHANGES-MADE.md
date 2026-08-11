# Report Suite — changes made, spec-delta pass 2026-08-11

**24 cases updated · 4 cases created · 0 deleted · 0 section writes · 0 run writes · 0 results
logged · 0 Jira calls that create anything.**

Every write was re-GET and byte-compared field by field, 30 fields each, **0 mismatches and 0
collateral changes**. The set of cases that actually changed was derived afterwards from the
PRE/POST snapshots and is **exactly the 24 intended — 0 unintended, 0 intended-but-missed**.

**Rule 54 sentence 2 was preserved byte-exact on all 24** (verified per write and again across the
snapshots: 0 build lines added, removed or re-dated). No build was observed in this pass, so no
build fact is claimed anywhere.

---

## 1 · The Product Type control — 1 case

| Case | What changed |
|---|---|
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) `SBC-TYPE-02` **(Automated)** | Title, steps, expected 1–6 and `refs` rewritten to SBC v17 `S3-R1`–`S3-R6`. It asserted *"exactly three options, in this order"* for a control redesigned into a multi-select with two toggles and two pinned action rows. A note now warns that the toggles read *"Parts"*/*"Services"* while the exports still print *"Parts only"*/*"Service only"* — expected, not a fault. |

## 2 · The Location column — 19 cases

All six specifications now state the access-gated, column-selector-toggleable rule. Nineteen cases
asserted the superseded scope-driven rule.

**Repaired to the new rule, note and provenance corrected:**
[C38913](https://shopview.testrail.io/index.php?/cases/view/38913) ·
[C38917](https://shopview.testrail.io/index.php?/cases/view/38917) ·
[C30551](https://shopview.testrail.io/index.php?/cases/view/30551) ·
[C30554](https://shopview.testrail.io/index.php?/cases/view/30554) ·
[C30588](https://shopview.testrail.io/index.php?/cases/view/30588) ·
[C38859](https://shopview.testrail.io/index.php?/cases/view/38859)

**Trigger reworded from location SCOPE to "when the column is shown" / location ACCESS:**
[C30218](https://shopview.testrail.io/index.php?/cases/view/30218) ·
[C30226](https://shopview.testrail.io/index.php?/cases/view/30226) ·
[C30278](https://shopview.testrail.io/index.php?/cases/view/30278) ·
[C30279](https://shopview.testrail.io/index.php?/cases/view/30279) ·
[C30285](https://shopview.testrail.io/index.php?/cases/view/30285) ·
[C30286](https://shopview.testrail.io/index.php?/cases/view/30286) ·
[C30161](https://shopview.testrail.io/index.php?/cases/view/30161) ·
[C30169](https://shopview.testrail.io/index.php?/cases/view/30169) ·
[C38856](https://shopview.testrail.io/index.php?/cases/view/38856) ·
[C30466](https://shopview.testrail.io/index.php?/cases/view/30466)

**Contradiction narrowed but NOT resolved (Parts Velocity only):**
[C38914](https://shopview.testrail.io/index.php?/cases/view/38914) ·
[C30352](https://shopview.testrail.io/index.php?/cases/view/30352) **(Automated)**

### Four HOLDs lifted

[C38917](https://shopview.testrail.io/index.php?/cases/view/38917),
[C30551](https://shopview.testrail.io/index.php?/cases/view/30551),
[C30554](https://shopview.testrail.io/index.php?/cases/view/30554),
[C30588](https://shopview.testrail.io/index.php?/cases/view/30588) were all held for *"the written
description says two different things about the Location column and the product owner has been
asked"*. **Chris answered that question by making the edits** — his own version message says
*"reworded the Location-column visibility to the access-gated, column-selector-toggleable rule"*.
The blocker is gone, so the markers are `AUTOMATION: READY`.

### One case repaired in full because it was being touched anyway (Rule 41)

[C30169](https://shopview.testrail.io/index.php?/cases/view/30169) carried **no automation marker at
all**, a Rule-54 line naming **no spec version**, and a `refs` value containing **commas** — which
TestRail splits, so it was stored as four entries rather than one. All three fixed alongside the
Location wording. It has never been checked against a build and **no build line was invented for
it**.

## 3 · Work In Progress tab placement — 3 cases HELD

[C30458](https://shopview.testrail.io/index.php?/cases/view/30458) ·
[C30462](https://shopview.testrail.io/index.php?/cases/view/30462) **(Automated)** ·
[C30464](https://shopview.testrail.io/index.php?/cases/view/30464)

**Their assertions were NOT changed.** Each states verbatim what the requirement it cites still
says. The specification now contradicts itself, so no side was picked: each case gained a plain
tester note explaining that a newer section states a different rule, that Chris has been asked, and
that seeing a work order in more than one tab is **not** to be raised as a bug meanwhile. Markers
set to `AUTOMATION: HOLD`.

## 4 · Two source-accuracy repairs

| Case | What changed |
|---|---|
| [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) | `refs` claimed *"spec silent on a cap"* — true at v4/v5, **false since v6 added `S6-R12`**. Now cites the anchor. The assertion already matched near-verbatim and was not touched. |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) **(Automated)** | Said *"version 10 of that specification uses S9-R11 for two different requirements"* while pinned to v11. **The caution is still true** — S9-R11 is defined twice in v11 as well, verified directly — so only the version number changed. |

## 5 · Four cases created

| Internal | Case | Covers |
|---|---|---|
| `SBC-TYPE-04` | [C43591](https://shopview.testrail.io/index.php?/cases/view/43591) | SBC v17 `S3-R6a` — *"Clear all"* leaves neither toggle on and shows the empty state |
| `WIP-CALC-11` | [C43592](https://shopview.testrail.io/index.php?/cases/view/43592) | WIP v11 — a fixed-price line is valued at its fixed amount |
| `WIP-CALC-12` | [C43593](https://shopview.testrail.io/index.php?/cases/view/43593) | WIP v11 — binary earning when there are no invoiced hours |
| `WIP-CALC-13` | [C43594](https://shopview.testrail.io/index.php?/cases/view/43594) | WIP v11 — core charges count in parts value; a core decision moves nothing |

All four: `custom_atmstatus` **1** (Not Automated), marker **`AUTOMATION: READY`**, **Rule-54
sentence 1 only with a read-date per source and no sentence 2**, `refs` one comma-free entry within
248 characters, titles within 80. `check_add_case_payloads.py` exited 0 first. Internal IDs checked
three ways — not in the live bodies, not on the retired list, not in the id-map — against every
internal ID ever mentioned anywhere in the repository, which catches retired records the id-map no
longer holds.

## 6 · Deliberately NOT changed

| | Why |
|---|---|
| [C43547](https://shopview.testrail.io/index.php?/cases/view/43547) | Its *"spec is silent on a **renderer** size limit"* is a different claim from C38885's and is **still true** — `S6-R12` caps rows and says nothing about a mid-size PDF failing to render. |
| [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | Asserts the three export filter-summary values, which v17 explicitly leaves unchanged. Correct as written. |
| [C30480](https://shopview.testrail.io/index.php?/cases/view/30480) · [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) · [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) · [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | Affected by the bucketing question but their assertions hold under **both** readings. Editing them would be churn. |
| [C30288](https://shopview.testrail.io/index.php?/cases/view/30288) | Carries no automation marker and no spec version. **Outside this pass's charter** — recorded, not touched (Rule 41). |
| [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | The nightly-snapshot shape the bucketing rule may change. Cites its own unchanged requirement; flagged to Chris rather than edited. |
| The 12 foreign cases | Vladimir Tomovic's. Never touched, and **proven byte-identical including `updated_on`/`updated_by`**. |

## 7 · Markers, live after the pass

| | Before (recorded) | After (measured live) |
|---|---|---|
| READY | 330 | **337** |
| READY - EXPECT FAIL | 103 | **100** |
| HOLD | 43 | **42** |
| No marker | 0 (claimed) | **1** — [C30288](https://shopview.testrail.io/index.php?/cases/view/30288) |
| **Total ours** | 476 | **480** |

**The gate: 337 + 100 = 437, and 480 − 42 = 438.** It is out by exactly **1**, and that 1 is
C30288, the unmarked case. **The gate is not broken — the recorded "476/476 markers" figure was
stale.** A census at the start of this pass found 474 of 476 marked; C30169 was repaired here, so
one remains.
