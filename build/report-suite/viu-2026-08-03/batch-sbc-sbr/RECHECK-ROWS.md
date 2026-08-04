# Re-check rows — SBC + SBR (to merge into the master `RECHECK-QUEUE.md`)

> **STATUS: OPEN.** Standing Rule 49: the QA branch was declared NOT FINAL, so every verdict in
> `VERDICTS.md` is PROVISIONAL against build **`v3.4.1-0ed4433`** observed **2026-08-04**.
> Re-run these when the build is declared final, when the app-version marker changes, or when
> the QA lead asks. **Do not merge these rows into the master queue file yourself if another
> worker is mid-write** — hand them to the coordinator.

Re-read the marker with: `curl -s https://sv8582.qa.shopview.com/ | grep app-version`

## A. Every case in scope (195) — the blanket provisional row

All 195 SBC/SBR cases carry a verdict observed only against `v3.4.1-0ed4433`. On a new build, the
cheapest re-confirmation is to re-run the four capture tools in `tools/` and diff their JSON
against the copies in `evidence/`:

```
node tools/observe_full.mjs sales-by-customer
node tools/observe_full.mjs sales-by-representative
node tools/observe_sbr_deep.mjs
node tools/capture_all_exports.mjs sales-by-customer && python3 tools/extract_pdf.py evidence/sales-by-customer/exports/*.pdf
node tools/capture_all_exports.mjs sales-by-representative && python3 tools/extract_pdf.py evidence/sales-by-representative/exports/*.pdf
```

## B. Rows that MUST be individually re-confirmed (a verdict hangs on them)

| Case | C-id | Verdict now | What to re-confirm |
|---|---|---|---|
| `SBC-CALC-03` | [C30151](https://shopview.testrail.io/index.php?/cases/view/30151) | DEVIATION | Re-run once invoiced-hours data exists: the +green / -red colouring on Inv. Hrs. |
| `SBR-CALC-01` | [C30229](https://shopview.testrail.io/index.php?/cases/view/30229) | DEVIATION | Re-run once hours exist: Inv. Hrs = hours invoiced - hours worked, half-up to one decimal. |
| `SBR-CALC-02` | [C30230](https://shopview.testrail.io/index.php?/cases/view/30230) | DEVIATION | Re-run once hours exist: colouring and rollups from unrounded deltas. |
| `SBR-CALC-03` | [C30231](https://shopview.testrail.io/index.php?/cases/view/30231) | DEVIATION | Re-run once hours exist: the negative clocked-unbilled case. |
| `SBR-CALC-09` | [C38894](https://shopview.testrail.io/index.php?/cases/view/38894) | DEVIATION | Re-run once hours exist: a clock-record edit after invoicing moves Inv. Hrs but not money. |
| `SBR-DEACT-02` | [C30253](https://shopview.testrail.io/index.php?/cases/view/30253) | EXTERNAL-DEPENDENCY | Re-run once invoice creation works: the counted, pluralised dialog headline and focus trap. |
| `SBR-DEACT-03` | [C30254](https://shopview.testrail.io/index.php?/cases/view/30254) | EXTERNAL-DEPENDENCY | Re-run: the type-YES gate (auto-focus, case-insensitive, Enter submits). |
| `SBR-DEACT-04` | [C30255](https://shopview.testrail.io/index.php?/cases/view/30255) | EXTERNAL-DEPENDENCY | Re-run: Cancel/X dismiss, Escape and outside-click do not. |
| `SBR-DEACT-05` | [C30256](https://shopview.testrail.io/index.php?/cases/view/30256) | EXTERNAL-DEPENDENCY | Re-run: valid submit locks the dialog then deactivates, keeping assignments. |
| `SBR-DEACT-06` | [C30257](https://shopview.testrail.io/index.php?/cases/view/30257) | EXTERNAL-DEPENDENCY | Re-run the dialog half; the report-credit half is already proven (F41). |
| `SBR-DEACT-07` | [C30258](https://shopview.testrail.io/index.php?/cases/view/30258) | EXTERNAL-DEPENDENCY | Re-run through the staff-administration UI, not the API — that was the correction made this pass. |
| `SBR-DEACT-08` | [C30259](https://shopview.testrail.io/index.php?/cases/view/30259) | EXTERNAL-DEPENDENCY | Re-run: a deactivation failure shows the error toast and leaves status alone. |
| `SBR-DEACT-09` | [C30260](https://shopview.testrail.io/index.php?/cases/view/30260) | EXTERNAL-DEPENDENCY | Re-run: a failed pre-check still opens the warning dialog. |
| `SBR-API-06` | [C30321](https://shopview.testrail.io/index.php?/cases/view/30321) | EXTERNAL-DEPENDENCY | Re-run: the pre-check request fires first and its count matches the dialog headline. |
| `SBC-TREE-11` | [C30131](https://shopview.testrail.io/index.php?/cases/view/30131) | NOT-BUILT | Re-check when a service invoice with no vehicle exists — no 'Parts Sales' bucket appeared at all. |
| `SBC-TREE-06` | [C30126](https://shopview.testrail.io/index.php?/cases/view/30126) | VIU-Observed-PASS | Re-check the 'Parts Sales bucket always last' half — no such bucket existed. |
| `SBC-LBL-01` | [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) | VIU-Observed-PASS | Re-check the Unit # and plate fallbacks — every asset had a VIN. |
| `SBC-LBL-04` | [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) | NOT-BUILT | Re-check when two assets share a label — no duplicate existed, so no (#1)/(#2) suffix. |
| `SBC-LOC-04` | [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | VIU-Observed-PASS | Re-check the 'Multiple' cell — no SBC customer spanned two locations. |
| `SBR-ROW-03` | [C30219](https://shopview.testrail.io/index.php?/cases/view/30219) | NOT-BUILT | Re-check once a toggled-off or deleted rep holds an invoice — the (Inactive) tag was unobservable. |
| `SBR-CALC-07` | [C30235](https://shopview.testrail.io/index.php?/cases/view/30235) | NOT-BUILT | Re-check when a negative dollar value exists — accounting parentheses were unobservable. |
| `SBR-EXP-05` | [C30280](https://shopview.testrail.io/index.php?/cases/view/30280) | NOT-BUILT | Re-check when an invoice number exceeds 18 characters. |
| `SBR-EXP-07` | [C30282](https://shopview.testrail.io/index.php?/cases/view/30282) | NOT-BUILT | Re-check both clauses (negative money, (Inactive) tag). |
| `SBR-EXP-08` | [C30283](https://shopview.testrail.io/index.php?/cases/view/30283) | VIU-Observed-PASS | Re-check the PDF font step-down thresholds — they were never forced. |
| `SBR-VIS-05` | [C30309](https://shopview.testrail.io/index.php?/cases/view/30309) | VIU-Observed-PASS | Re-check the (Inactive) tag's contrast — only the (N) count was measurable. |
| `SBR-WO-01` | [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) | VIU-Observed-PASS | Re-check on a Part Sale WO and an imported WO — only a standard WO was driven. |
| `SBR-WO-05` | [C30314](https://shopview.testrail.io/index.php?/cases/view/30314) | VIU-Observed-PASS | Re-check the customer-rep fallback leg — it only applies at invoice creation. |
| `SBR-WO-06` | [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) | VIU-Observed-PASS | Re-check the 'Unassigned' empty text on a customer with no rep. |
| `SBR-MOB-03` | [C30304](https://shopview.testrail.io/index.php?/cases/view/30304) | DEVIATION | Re-check the hover-only-tooltip clause — it could not be forced separately. |
| `SBC-EXP-09` | [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | VIU-Observed-PASS | Re-confirm the PDF Date Range end date (off by one day this run). |
| `SBR-ASGN-01` | [C30292](https://shopview.testrail.io/index.php?/cases/view/30292) | NOT-BUILT | Re-check whether the Sales Representative Assignments export has been built. |
| `SBC-EXP-14` | [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) | DEVIATION | Re-check on a bigger org whether the 10,000-row refusal message exists at all, AND whether the Expanded PDF still 500s at scale. |
| `SBR-EXP-15` | [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) | DEVIATION | Same as SBC-EXP-14. |
| `SBC-API-05` | [C30194](https://shopview.testrail.io/index.php?/cases/view/30194) | DEVIATION | Same as SBC-EXP-14 - the cap-counted-first half is still unverified. |
| `SBR-API-05` | [C30320](https://shopview.testrail.io/index.php?/cases/view/30320) | DEVIATION | Same as SBC-EXP-14. |
| `SBC-EXP-15` | [C30173](https://shopview.testrail.io/index.php?/cases/view/30173) | DEVIATION | Re-check whether a zeroed totals row has been added to empty exports. |
| `SBR-EXP-16` | [C30291](https://shopview.testrail.io/index.php?/cases/view/30291) | DEVIATION | Same as SBC-EXP-15. |

`SBR-ASGN-02` C30293, `SBR-ASGN-03` C30294, `SBR-ASGN-04` C30295, `SBR-ASGN-05` C30296 and
`SBR-ASGN-06` C30297 all re-check together with `SBR-ASGN-01`: none of them can be run until
the Assignments export exists.

## C. Rows to re-confirm because they are DEVIATIONS that may just be unfinished work

| Case | C-id | Read as | Re-confirm |
|---|---|---|---|
| `SBC-DATE-04` | [C30105](https://shopview.testrail.io/index.php?/cases/view/30105) | not-built-yet | whether shareable URL state has been added |
| `SBC-PERS-06` | [C30179](https://shopview.testrail.io/index.php?/cases/view/30179) | not-built-yet | same — depends on URL state existing |
| `SBC-EMPTY-01` | [C30181](https://shopview.testrail.io/index.php?/cases/view/30181) | not-built-yet | whether an empty-state message has been added |
| `SBC-EMPTY-02` | [C30182](https://shopview.testrail.io/index.php?/cases/view/30182) | not-built-yet | same |
| `SBR-STATE-01` | [C30298](https://shopview.testrail.io/index.php?/cases/view/30298) | not-built-yet | same, on the SBR side |
| `SBR-STATE-04` | [C30301](https://shopview.testrail.io/index.php?/cases/view/30301) | not-built-yet | whether an inline could-not-load message with Retry has been added |
| `SBR-TOT-03` | [C30239](https://shopview.testrail.io/index.php?/cases/view/30239) | not-built-yet | whether the mobile totals bar has been added |
| `SBC-NAV-01` | [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) | PO question | whether SALES is the intended nav group |
| `SBR-LOC-04` | [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) | spec-vs-ruling | whether the Location filter should hide for one-location users |

## D. Closing this queue

The queue closes only when **100% of the rows above** have been re-verified against a settled
build and each has been flipped to CONFIRMED or CHANGED with fresh evidence (Rule 17 — no
sampling). A row that flips to CHANGED is a finding in its own right and gets reported, not
quietly corrected.

