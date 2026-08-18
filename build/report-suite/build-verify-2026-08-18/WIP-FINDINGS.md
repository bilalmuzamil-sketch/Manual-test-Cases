# WIP-FINDINGS — Work In Progress live build-verification findings (2026-08-18)

**Build:** `v3.8-bd246fd` · **Location:** Staging Heavy Duty - 9919 (+ All locations) · **Signed in as:**
Admin ShopView (view_mode `full`, 42 permissions). All observations screen-driven live via the boot2
direct-cookie recipe (no `quick-login`).

**⚠️ 0 Jira tickets filed** — the QA-lead's ticket-creation hold is active (core §11.1 / Rule 62). Every
reproducing deviation below is written up with a recommendation only, for ask-first handling once the hold
lifts.

---

## A. THE 15 EXPECT-FAIL CASES — every backing ticket is OBSOLETE (verified live in Jira, 2026-08-18)

All 15 backing tickets read live: **status OBSOLETE, resolution Done** — no live backing, so under Rule 61
the EXPECT-FAIL marker came off and each case is now plain `AUTOMATION: READY` (symptom/three-outcome
block removed; the documented numbered expectation kept). The manual tester now discovers pass/fail.
**Where the deviation still reproduces on v3.8, it is flagged below.**

| Case (C-id) | internal | ticket (OBSOLETE) | live verdict on v3.8-bd246fd |
|---|---|---|---|
| [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) | WIP-COL-01 | SV-8987 | **REPRODUCES, and broader.** Days Open **and** Last Activity column headers are LEFT-aligned; expected right-aligned. Days Open data cell also left-aligned; Earned cell correctly right. SV-8987 named only Last Activity — Days Open is a second column out of place. |
| [C30468](https://shopview.testrail.io/index.php?/cases/view/30468) | WIP-COL-03 | SV-8967 | **REPRODUCES.** WO # is a plain `<span>`, black text, no `<a>`, no underline, cursor `auto`; the whole table has **0 links**. Checked as Admin (holds Work Orders access). |
| [C43557](https://shopview.testrail.io/index.php?/cases/view/43557) | WIP-COL-09 | SV-8967 | **First half REPRODUCES** — a user WITH Work Orders access still sees plain text (so the "link when entitled" half fails). The "plain text when not entitled" half is untestable while everyone sees plain text. |
| [C30481](https://shopview.testrail.io/index.php?/cases/view/30481) | WIP-CALC-08 | SV-8989 | **REPRODUCES.** Labor Delta shows **two** decimals (`+3.00`, `+2.20`), expected one (`+3.0`). Sign correct; zero reads `0.00` unsigned. |
| [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) | WIP-SUM-05 | SV-8988 | **REPRODUCES.** The Estimates summary figure is `rgb(54,65,82)` — **identical** to the Completed and Not-Started figures — so it is NOT toned down/muted. |
| [C30499](https://shopview.testrail.io/index.php?/cases/view/30499) | WIP-FLT-02 | SV-8969 | **REPRODUCES.** The Customer filter shows "All customers", "Clear all", then the customers, with **nothing selected** — the Clear action is offered before any selection (expected: only after ≥1 pick, labelled "Clear"). |
| [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | WIP-FLT-03 | SV-8908, SV-8968 | Asset filter present with Unit # + VIN options and search. The shared-unit VIN gap (SV-8908) was **not re-driven this pass** (needs the specific shared-unit test data). Server-recompute half (SV-8968) reproduces (see FLT-08). |
| [C30505](https://shopview.testrail.io/index.php?/cases/view/30505) | WIP-FLT-08 | SV-8968 | **REPRODUCES.** Changing the Advisor filter fired **one** request to `…/work-in-progress` (server-side recompute); expected on-screen narrowing with no server request. Figures are correct either way. |
| [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) | WIP-FLT-09 | SV-8954 (a TU ticket, cross-ref) | On screen the Location column **names each work order's location** (Heavy Duty and Lethbridge both shown, not "Multiple") — the expected half holds. The related defect (Location not offered in the Column Selection control, so it cannot be turned on when a single location is chosen) **IS present** — see §B HOLD cases. |
| [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | WIP-EXP-02 | SV-8907 | **FIXED.** WIP CSV download returns HTTP 200 with real rows (368 lines), honours the tab, carries the on-screen columns and the "Locations:" line. (Case body already notes the Labor-Delta-on export refusal.) |
| [C30512](https://shopview.testrail.io/index.php?/cases/view/30512) | WIP-EXP-03 | SV-8907 | Download works. **Minor note:** CSV money values are plain (`6550.00`), not the on-screen `$6,550.00` format — normal CSV convention, but the case asks downloads keep on-screen formats. Tester confirms whether the PDF keeps the `$`/thousands format. |
| [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) | WIP-EXP-04 | SV-8907 | Download works. PDF green/red Labor Delta colouring not separately captured this pass; tester confirms in the PDF. |
| [C30514](https://shopview.testrail.io/index.php?/cases/view/30514) | WIP-EXP-05 | SV-8907 | Download works. "Days Open frozen at generation" not separately captured; tester confirms. |
| [C30519](https://shopview.testrail.io/index.php?/cases/view/30519) | WIP-VIS-01 | SV-8970 | **REPRODUCES exactly.** Header, data rows and Totals row are all `rgb(249,250,251)` (pale blue-grey), not white. Correctly **no** alternating shading. |
| [C30523](https://shopview.testrail.io/index.php?/cases/view/30523) | WIP-VIS-05 | SV-8967 | **REPRODUCES.** No WO # link exists, so there is nothing keyboard-focusable to open the work order. |

**RECOMMENDATION (for the QA lead, once the ticket-creation hold lifts):** SV-8967, SV-8970, SV-8987,
SV-8988, SV-8989, SV-8969, SV-8968 were closed **OBSOLETE** but their deviations **still reproduce** on
v3.8-bd246fd. These are real, spec-backed cosmetic/behaviour defects on a **final** report. Consider
re-opening (or re-filing under the Rule-52/73 evidence bar) — they were closed as a triage decision, not
fixed. **SV-8907 genuinely IS fixed** (download works). Nothing filed this pass (creation hold).

---

## B. HOLD cases — re-verified live, HOLD stands (7)

| Case | internal | HOLD reason | live re-verification |
|---|---|---|---|
| [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | WIP-COL-02 | Location-rule filing HOLD | **Confirmed:** Location is NOT in the Column Selection control (control lists WO#…Labor Delta, no Location). A defect exists but no ticket may be filed under the creation hold → one edit from `READY - EXPECT FAIL` once a ticket is authorised. **Kept HOLD.** |
| [C43551](https://shopview.testrail.io/index.php?/cases/view/43551) | WIP-PERS-05 | same Location-rule filing HOLD | **Confirmed:** Location absent from the column selector, so there is no switch to persist. **Kept HOLD.** |
| [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | WIP-EXP-10 | over-cap refusal cannot be produced | genuine unobtainable state (and the WIP spec sets no export size cap). **Kept HOLD.** |
| [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | WIP-API-01 | nightly snapshot not readable back through the product | genuine observability HOLD. **Kept HOLD.** |
| [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | WIP-API-03 | same (nightly snapshot) | **Kept HOLD.** |
| [C30531](https://shopview.testrail.io/index.php?/cases/view/30531) | WIP-API-04 | same | **Kept HOLD.** |
| [C30533](https://shopview.testrail.io/index.php?/cases/view/30533) | WIP-API-06 | same | **Kept HOLD.** |

---

## C. §multi-tab — SCOPE-03 / PLACE-05 honest limit (2 cases lifted to READY, behaviour not directly observed)

[C30458](https://shopview.testrail.io/index.php?/cases/view/30458) (WIP-SCOPE-03) and
[C43979](https://shopview.testrail.io/index.php?/cases/view/43979) (WIP-PLACE-05) assert that a work order
whose lines are in more than one state appears **in each matching tab**. The line-state tab feature IS
present (the report renders WOs into the four state tabs, and the build follows the line-state model per
SV-9027 / Chris Ward's 2026-08-18 answer B). But the API shows **0 work orders in more than one money tab**
across 453 rows — which cannot distinguish "the build places each WO in one tab" from "no WO in the current
data has lines in >1 state." Neither could be settled without seeding a multi-state WO on a shared
environment. **Verdict:** feature present + runnable by a tester who seeds the state → **lifted to READY**;
the specific multi-tab appearance is left for the tester to confirm (or a later seeded run). The Rule-56
divergence disclosure (line-state vs the older S2-R4 status-model) is preserved on both cases.

---

## D. SPEC SELF-CONTRADICTION — flagged for Chris Ward (do NOT force a verdict)

WIP spec **v22 still carries BOTH placement models, unreconciled**: **S2-R4** ("each qualifying work order
appears exactly once, in exactly one tab") vs the **§3 Key Decisions line-state model per SV-9027** ("a work
order carrying lines in more than one state appears in each matching tab"). Our SCOPE/PLACE cases follow the
line-state model (Chris Ward 2026-08-18 answer B) and disclose the divergence (Rule 56). **This is Chris
Ward's spec-hygiene to fix — an OPEN PO question**, carried on the outstanding items / the WIP question
sheet. The build's behaviour on this point is **NOT_ESTABLISHED** (see §C). No verdict invented.

---

## E. WHAT PASSED (feature present + runnable) — the 75 READY cases
The report, all four tabs and their counts, all columns (incl. **Adjustments**), the Column Selection
control (Total stays last), the Totals row, the summary strip with ⓘ icons, all five filters, both
exports (PDF/CSV — SV-8907 fixed), the as-of date, dark mode, the calc contract (Total = Earned +
Remaining + Adjustments over 453 rows), and the Asset Unit#+VIN cell were all screen-observed present and
runnable. The Adjustments cluster (WIP-ADJ-01..08) — the plan's biggest unknown — is **built** and lifted.
