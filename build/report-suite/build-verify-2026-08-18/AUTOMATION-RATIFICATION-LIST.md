# AUTOMATED-CASE RATIFICATION LIST — Report Suite build-verify 2026-08-18 (Rule 71, ask-first)

**All figures from the committed per-report `*-HELD-AUTOMATED.md` + `FOR-VLAD.md` artifacts** under
`build/report-suite/build-verify-2026-08-18/`. Build verified against **`v3.8-bd246fd`** (SBC section (A) on
`v3.8-2bf8d14`). Every case below is TestRail-flagged **Automated (`custom_atmstatus = 3`)**, confirmed LIVE
per case, and `created_by = 3` (ours) — so under **Standing Rule 71** it is ask-first even though it is ours.
On the Report Suite the `atm=3` flag is **Vladimir Tomovic's own** (id 1), so it is the contract his automation
runs against.

**TOTAL automated cases: 39** = **(A) 4 already edited (need retrospective ratification)** + **(B) 35 held,
not written (need go-ahead before editing)**.
Of the 39, **16 change what an automated run concludes** (2 in A + 14 in B); the other 23 are metadata-only.

**Your decision column is blank — fill it in (approve / hold / edit differently).** On approval, each edit is
made **coupled with build verification** (skill-03 §6.4) and the case number handed to Vladimir Tomovic (id 1)
via `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md` (Rule 65).

---

## (A) ALREADY EDITED — retrospective ratification (4 cases, Sales By Customer)

These 4 SBC Automated cases were **edited during the SBC pass BEFORE the "ask-first / hold-Automated"
correction was in force** (every later report SBR→IV correctly HELD its Automated cases unwritten). They are
surfaced here for your retrospective ratification. Build: **`v3.8-2bf8d14`**.

| # | Report | C-id + link | What it is (plain) | What was changed | Changes automation conclusion? | Your decision |
|---|---|---|---|---|---|---|
| A1 | SBC | [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | Product Type multi-select (both toggles on by default, "Clear all"). | Marker `READY - EXPECT FAIL (SV-9074)` → `READY`; removed the known-failure/3-outcome note. SV-9074 is now **QA Complete** and the build behaves correctly. | Marker moved expect-fail → ready (per FOR-VLAD: build now matches; expectation unchanged). | |
| A2 | SBC | [C30114](https://shopview.testrail.io/index.php?/cases/view/30114) | Customer pinned control (All customers / Clear all). | Marker `READY - EXPECT FAIL (SV-8991)` → `READY`; removed the known-failure note. SV-8991 is **OBSOLETE**. Expectation unchanged. | Marker moved expect-fail → ready (per FOR-VLAD: expectation unchanged). | |
| A3 | SBC | [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) | Customer summary row / invoice count. | Metadata only — added the build-check provenance sentence. Marker stays `READY`. Testable content byte-identical. | No — metadata refresh only. | |
| A4 | SBC | [C30123](https://shopview.testrail.io/index.php?/cases/view/30123) | Expand-customer / asset rows. | Metadata only — added the build-check provenance sentence. Marker stays `READY`. Testable content byte-identical. | No — metadata refresh only. | |

*(SBC C30138 (Automated, invoice-number link) was deliberately NOT touched — the link-vs-plain-text behaviour
is an open PO question; kept its existing READY marker, not re-stamped.)*

---

## (B) HELD, NOT WRITTEN — go-ahead needed before editing (35 cases, SBR/PV/TU/WIP/IV)

Grouped by report. All were verified LIVE, byte-unchanged (`updated_on` identical to pre-pass), `atm=3` preserved.

### SBR — Sales By Representative (4)
| # | C-id + link | What it is (plain) | Current marker → intended change | Changes conclusion? | Your decision |
|---|---|---|---|---|---|
| B1 | [C30217](https://shopview.testrail.io/index.php?/cases/view/30217) | Rep/group summary row + contributing-invoice count in parentheses. | `READY` → optional sentence-2 build-check (marker stays READY). | No — metadata only. | |
| B2 | [C30221](https://shopview.testrail.io/index.php?/cases/view/30221) | Expand-on-demand rep/invoice tree. | `Not available on Build to test Yet` → **`AUTOMATION: READY`** (feature verified present) + sentence-2. | **Yes** — deferred → ready. | |
| B3 | [C30262](https://shopview.testrail.io/index.php?/cases/view/30262) | Show Unassigned adds one top-pinned "Unassigned" row. | `READY` → optional sentence-2 (marker stays READY). | No — metadata only. | |
| B4 | [C30314](https://shopview.testrail.io/index.php?/cases/view/30314) | Unassigned credit path (WO-rep / customer-rep fallbacks). | `READY` → optional sentence-2 (marker stays READY). | No — metadata only. | |

### PV — Parts Velocity (8)
| # | C-id + link | What it is (plain) | Current marker → intended change | Changes conclusion? | Your decision |
|---|---|---|---|---|---|
| B5 | [C30326](https://shopview.testrail.io/index.php?/cases/view/30326) | Reports/PV nav visibility (positive verified; negative needs 2nd sign-in). | `READY` → optional sentence-2. | No — metadata only. | |
| B6 | [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | Type filter. **Possible deviation:** case says label "Both" + single-select + first control; build shows "All types" + multi-select + after search/date. | `READY` → **NEEDS REVIEW — do NOT auto-lift.** May be a `READY - EXPECT FAIL` candidate. | **Yes** — if a real deviation, the assertion changes. | |
| B7 | [C30333](https://shopview.testrail.io/index.php?/cases/view/30333) | Toolbar part-number search narrows the report. | `READY` → optional sentence-2. | No — metadata only. | |
| B8 | [C30338](https://shopview.testrail.io/index.php?/cases/view/30338) | Empty-state on zero rows (exact wording not driven to zero-row state). | `READY` → optional sentence-2. | No — metadata only. | |
| B9 | [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | Grey info icons on Units Sold / Demand headers. | `Not available on Build to test Yet` → **`AUTOMATION: READY`** (feature present) + sentence-2. | **Yes** — deferred → ready. | |
| B10 | [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | Location column position (14-col single-location CSV matches; multi-location 6th not leftmost). | `READY - EXPECT FAIL (SV-8938)` → **strip → plain READY** (SV-8938 OBSOLETE) — **but confirm the PO's intended position first** (contested, see FLAGGED-DEFECTS). | **Yes** — strip changes the conclusion. | |
| B11 | [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) | Column-picker toggles take effect immediately. | `Not available on Build to test Yet` → **`AUTOMATION: READY`** (feature present) + sentence-2. | **Yes** — deferred → ready. | |
| B12 | [C30390](https://shopview.testrail.io/index.php?/cases/view/30390) | Header-click sort re-fetches server-side. | `READY` → optional sentence-2. | No — metadata only. | |

### TU — Technician Utilization (8)
| # | C-id + link | What it is (plain) | Current marker → intended change | Changes conclusion? | Your decision |
|---|---|---|---|---|---|
| B13 | [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | Reports entry hidden without reports access (needs no-reports 2nd sign-in). | `HOLD` — reason valid → no change. | No. | |
| B14 | [C30399](https://shopview.testrail.io/index.php?/cases/view/30399) | Clear-all-technicians → empty-state message. | `READY` → optional sentence-2. | No — metadata only. | |
| B15 | [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | Hours columns present, right-aligned two-decimal. | `READY` → optional sentence-2. | No — metadata only. | |
| B16 | [C30404](https://shopview.testrail.io/index.php?/cases/view/30404) | Est. Lost Labor = internal hours × location rate (calc ties out live). | `READY` → optional sentence-2. | No — metadata only. | |
| B17 | [C30410](https://shopview.testrail.io/index.php?/cases/view/30410) | Every sortable column sorts ascending-first; Summary stays pinned. | `READY` → optional sentence-2. | No — metadata only. | |
| B18 | [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) | Deselecting a technician hides the row + recalculates Summary. | `READY - EXPECT FAIL (SV-8946)` → **strip → plain READY** (SV-8946 OBSOLETE; behaviour correct live). | **Yes** — strip changes the conclusion. | |
| B19 | [C30429](https://shopview.testrail.io/index.php?/cases/view/30429) | Total Hours link opens Timesheet Activities. **The link feature is ABSENT from the build** (§F7). | `READY` → **NEEDS REVIEW — do NOT auto-keep READY.** Likely should be `Not available on Build to test Yet`. | **Yes** — case asserts an absent feature. | |
| B20 | [C30449](https://shopview.testrail.io/index.php?/cases/view/30449) | Per-day breakdown appears only after expand (fetch-on-expand). | `READY` → optional sentence-2. | No — metadata only. | |

### WIP — Work In Progress (10)
| # | C-id + link | What it is (plain) | Current marker → intended change | Changes conclusion? | Your decision |
|---|---|---|---|---|---|
| B21 | [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | Tab structure; counts match API. | `READY` → refresh sentence-2. | No — metadata only. | |
| B22 | [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) | Line-state scope loading. | `Not available on Build to test Yet` → **`AUTOMATION: READY`** (feature present) + sentence-2. | **Yes** — deferred → ready. | |
| B23 | [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | Tab placement by line state (fix wrong story ref SV-8656→SV-8659 per register RS-WIP-1). | `Not available on Build to test Yet` → **`AUTOMATION: READY`** + sentence-2. | **Yes** — deferred → ready. | |
| B24 | [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | Summary strip present. | `READY` → refresh sentence-2. | No — metadata only. | |
| B25 | [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) | Customer/Advisor filter server-recompute. SV-8968 **OBSOLETE**; reproduces. | `READY - EXPECT FAIL (SV-8968)` → **strip → plain READY** (no live backing) + remove symptom block + sentence-2. | **Yes** — strip changes the conclusion. | |
| B26 | [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) | Column-persistence. | `Not available on Build to test Yet` → **`AUTOMATION: READY`** + sentence-2. | **Yes** — deferred → ready. | |
| B27 | [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | Exports present (PDF/CSV), download works. | `READY` → refresh sentence-2. | No — metadata only. | |
| B28 | [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | Exports present. | `READY` → refresh sentence-2. | No — metadata only. | |
| B29 | [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | Export feature present. | `Not available on Build to test Yet` → **`AUTOMATION: READY`** + sentence-2. | **Yes** — deferred → ready. | |
| B30 | [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | Permission-gated WO-link behaviour present in report. | `READY` → refresh sentence-2. | No — metadata only. | |

### IV — Inventory Value (5)
| # | C-id + link | What it is (plain) | Current marker → intended change | Changes conclusion? | Your decision |
|---|---|---|---|---|---|
| B31 | [C30535](https://shopview.testrail.io/index.php?/cases/view/30535) | One row per in-stock part at selected locations, valued at the resolved date. | `Not available on Build to test Yet` → **`AUTOMATION: READY`** (feature present) + sentence-2. | **Yes** — deferred → ready. | |
| B32 | [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) | Totals row sums the full filtered set server-side. | `READY` → refresh sentence-2. | No — metadata only. | |
| B33 | [C30563](https://shopview.testrail.io/index.php?/cases/view/30563) | "As of" date control present, defaults today. | `Not available on Build to test Yet` → **`AUTOMATION: READY`** (feature present) + sentence-2. | **Yes** — deferred → ready. | |
| B34 | [C30569](https://shopview.testrail.io/index.php?/cases/view/30569) | Category/Vendor multi-selects reload the report. | `READY` → refresh sentence-2. | No — metadata only. | |
| B35 | [C30583](https://shopview.testrail.io/index.php?/cases/view/30583) | Rows sorted Total Cost highest-first on load. | `READY` → refresh sentence-2. | No — metadata only. | |

---

## SUMMARY OF WHAT CHANGES AN AUTOMATED RUN'S CONCLUSION (the ones Vlad most needs)

- **(A) 2 of 4** — C30107, C30114 (SBC): marker moved expect-fail → ready (build now matches; expectation unchanged).
- **(B) 14 of 35:**
  - **Deferred → READY lifts (8):** C30221 (SBR) · C30346, C30353 (PV) · C30460, C30462, C30508, C30518 (WIP) · C30535, C30563 (IV). *(= 9 — corrected below.)*
  - **Strip stale expect-fail (3):** C30352 (PV, confirm PO first) · C30424 (TU) · C30498 (WIP).
  - **NEEDS REVIEW, do NOT auto-lift (2):** C30328 (PV, possible deviation) · C30429 (TU, asserts absent link).

*(Exact count of B "changes conclusion": 9 lifts + 3 strips + 2 needs-review = **14**. Plus A's 2 = **16 of 39**.)*

**Foreign Automated cases (NOT ours, Rule 38, untouched throughout):** C38923 (SBR), C43567/C38920/C43568 (PV),
C38919 (TU), C43572/C38922 (WIP), C43573/C38921 (IV).
