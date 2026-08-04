# VERDICT LEDGER — the single authoritative status of all 478 Report Suite cases · 2026-08-04

**This file replaces every other status total in the repository.** Two different tallies were in
circulation and both were being read as "the" number; they are reconciled at the bottom.

Per-case rows: **`per-case-verdicts.csv`**, column `status_ledger` (one row per case, with its
C-id and a clickable TestRail link). Machine-readable totals: **`audit-tally.json`**.

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| SBC spec | Confluence 577634305 | v13, lastModified 2026-07-31 | 2026-08-03 (mirror re-read 2026-08-04) | **CURRENT** |
| SBR spec | Confluence 585629698 | v15, 2026-07-29 | 2026-08-03 | **CURRENT** |
| PV spec | Confluence 620888066 | v4, 2026-07-29 | 2026-08-03 | **CURRENT** |
| TU spec | Confluence 641400833 | v5, 2026-07-29 | 2026-08-03 | **CURRENT** |
| WIP spec | Confluence 703660034 | v6, 2026-07-29 | 2026-08-03 | **CURRENT** |
| IV spec | Confluence 720142338 | v3, 2026-07-29 | 2026-08-03 | **CURRENT** |
| Epic | SV-8582 | 6 stories reopened as of 2026-07-31; not re-read | — | **PARTIAL** — a Tier-2 re-read is a Rule-37 ask |
| Designs | none exist (spec-only project) | — | — | **N/A** — no Rule-35 queue |
| Tech plan | tech-plan-2026-07-29 | 2026-07-29, not re-fetched this pass | — | **PARTIAL** |
| PO answers | Chris Ward, through 2026-08-01 | 2026-08-01 | 2026-08-03 | **CURRENT** |
| **Live build** | `sv8582.qa.shopview.com` | **`v3.4.1-0ed4433`**, index.html last-modified 2026-08-03 13:40:38 GMT | 2026-08-03/04 | **PARTIAL — DECLARED NOT FINAL** |

**This audit is a DESK audit** of the case text against those sources plus the recorded VIU
evidence. It re-observed nothing live. Every status below inherits the non-final-build caveat and
is queued in `../viu-2026-08-03/RECHECK-QUEUE.md`, which is **OPEN** (Standing Rule 49).

---

## POPULATION — confirmed four ways, set equality empty in both directions

| # | Way | Count |
|---|---|---:|
| 1 | Live TestRail under group 4281, `created_by = 3` (us) | **478** |
| 2 | Local active case bodies (`cases/*.json`, `viu_status = VIU-Pending`) | **478** |
| 3 | `testrail-id-map.csv` rows | **478** |
| 4 | Distinct numeric C-ids in the id-map | **478** |

`live − idmap = ∅` · `idmap − live = ∅` · `local − idmap = ∅` · `idmap − local = ∅`.
Live snapshot: `data/live-cases-4281.json` (read-only `get_sections` + `get_cases`).

**Excluded and never touched: 5 foreign cases** authored by **Vladimir Tomovic** (`created_by = 1`)
— **C38919, C38920, C38921, C38922, C38923**. Reported separately per Standing Rule 38.
**Ours 478 / live total under group 4281 = 483.**

---

## THE AUTHORITATIVE STATUS LEDGER — 478

| Status | Cases | What it means |
|---|---:|---|
| **VIU-Observed-PASS** | **327** | At least one assertion of the case was observed live on `v3.4.1-0ed4433` and matched, with nothing observed to contradict it. **This is NOT "VIU-Verified"** — see the honesty note. |
| **DEVIATION** | **109** | Observed live; **our case is right** and the build is behind a spec requirement or a PO ruling. No case change. |
| **NOT-BUILT** | **13** | The behaviour has no implementation to observe on this branch; recorded on evidence of absence. |
| **EXTERNAL-DEPENDENCY** | **20** | Genuinely outside this build — no read surface into the nightly snapshot rows, QuickBooks not connected, no unrated location possible. |
| **BLOCKED-BY-DEFECT** | **9** | One bug fix away from runnable: `POST /api/invoices/create` → **HTTP 500** (**SV-8821**). |
| **TOTAL** | **478** | |

### Per report

| Report | Total | PASS | DEVIATION | NOT-BUILT | EXTERNAL | BLOCKED-BY-DEFECT |
|---|---:|---:|---:|---:|---:|---:|
| Sales By Customer | 85 | 68 | 15 | 2 | 0 | 0 |
| Sales By Representative | 111 | 72 | 20 | 10 | 0 | 9 |
| Parts Velocity | 72 | 54 | 17 | 0 | 1 | 0 |
| Technician Utilization | 60 | 41 | 16 | 0 | 3 | 0 |
| Work In Progress | 79 | 55 | 16 | 1 | 7 | 0 |
| Inventory Value | 71 | 37 | 25 | 0 | 9 | 0 |
| **All six** | **478** | **327** | **109** | **13** | **20** | **9** |

*(Computed from `per-case-verdicts.csv`; the six rows sum to 478 in every column.)*

---

## THE RECLASSIFICATION, APPLIED AND VERIFIED

`../defect-pack-2026-08-04/RECLASSIFIED.md` corrected nine cases that had been labelled
EXTERNAL-DEPENDENCY when what actually blocked them is a defect **inside this branch**. The
distinction matters because EXTERNAL-DEPENDENCY tells the reader *"nothing to chase"* while
BLOCKED-BY-DEFECT tells them *"there is a ticket and these nine become runnable the moment it is
fixed"*.

| # | Case | C-id | Was | Now |
|---|---|---|---|---|
| 1 | SBR-API-06 | [C30321](https://shopview.testrail.io/index.php?/cases/view/30321) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** |
| 2 | SBR-DEACT-02 | [C30253](https://shopview.testrail.io/index.php?/cases/view/30253) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** |
| 3 | SBR-DEACT-03 | [C30254](https://shopview.testrail.io/index.php?/cases/view/30254) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** |
| 4 | SBR-DEACT-04 | [C30255](https://shopview.testrail.io/index.php?/cases/view/30255) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** |
| 5 | SBR-DEACT-05 | [C30256](https://shopview.testrail.io/index.php?/cases/view/30256) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** |
| 6 | SBR-DEACT-06 | [C30257](https://shopview.testrail.io/index.php?/cases/view/30257) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** |
| 7 | SBR-DEACT-07 | [C30258](https://shopview.testrail.io/index.php?/cases/view/30258) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** |
| 8 | SBR-DEACT-08 | [C30259](https://shopview.testrail.io/index.php?/cases/view/30259) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** |
| 9 | SBR-DEACT-09 | [C30260](https://shopview.testrail.io/index.php?/cases/view/30260) | EXTERNAL-DEPENDENCY | **BLOCKED-BY-DEFECT** |

**Verified, not copied.** Re-derived independently from the three batch `verdicts.csv` files:

```
batch-sbc-sbr  195 rows : PASS 139 · DEVIATION 35 · NOT-BUILT 12 · EXTERNAL 9
batch-pv-tu    131 rows : PASS  95 · DEVIATION 32 ·               EXTERNAL 4
batch-wip-iv   149 rows : PASS  92 · DEVIATION 40 · NOT-BUILT  1 · EXTERNAL 16
               ---------------------------------------------------------------
               475 rows : PASS 326 · DEVIATION 107 · NOT-BUILT 13 · EXTERNAL 29
```

All nine reclassified cases were confirmed present in the EXTERNAL-DEPENDENCY set, so
**29 − 9 = 20 EXTERNAL + 9 BLOCKED-BY-DEFECT**, giving **326 / 107 / 13 / 20 / 9 = 475** — the
corrected totals, arrived at independently.

### The three cases authored 2026-08-04, after the batch passes closed

| Case | C-id | Status | Basis |
|---|---|---|---|
| SBC-API-06 | [C43546](https://shopview.testrail.io/index.php?/cases/view/43546) | **VIU-Observed-PASS** | Authored from a live observation that matched: an 8-atom `reportsPageAccess` role got 200 on both the data endpoint and the export; a Foreman got 403 on both. |
| PV-EXP-12 | [C43547](https://shopview.testrail.io/index.php?/cases/view/43547) | **DEVIATION** | The build fails the expected result — a 449-row PDF returns HTTP 500 twice while the CSV of the same scope succeeds. |
| IV-EXP-10 | [C43548](https://shopview.testrail.io/index.php?/cases/view/43548) | **DEVIATION** | The build fails to produce a large PDF (≈30 s timeout, HTTP 500). **Caveat:** the case text makes that failure the PASS condition, so *as written* it would read PASS. See the FIX-WORDING recommendation in `AUDIT.md`. |

**Honesty (Standing Rule 12):** these three statuses are derived from the authoring evidence
recorded in each case's own notes. **This audit did not re-observe them live.**

**475 + 3 = 478 · 326 + 1 = 327 PASS · 107 + 2 = 109 DEVIATION · 13 · 20 · 9. Totals reconcile.**

---

## RECONCILING THE TWO TALLIES THAT WERE IN CIRCULATION

The repository held two different totals for the same 475 cases. They are not a contradiction —
**they answer two different questions** — but both were captioned as "TOTALS", and 86 versus 326 for
what a reader hears as "passed" is exactly the confusion that has to end.

| Source | Question it answers | Its numbers |
|---|---|---|
| `../viu-2026-08-03/CHANGE-LEDGER.md` §TOTALS | **"How much of each case did we actually drive?"** | 86 CORRECT AS IS · 243 PARTLY OBSERVED · 124 NOT REACHED · 13 DEVIATION · 7 EDIT NEEDED · 2 REFUTED · 1 NEW CASE = 475 |
| `../viu-2026-08-03/batch-*/verdicts.csv` | **"What is the outcome verdict for the case?"** | 326 VIU-Observed-PASS · 107 DEVIATION · 13 NOT-BUILT · 29 EXTERNAL-DEPENDENCY = 475 |

**Both are retained as evidence; this ledger is the one to quote for status.** The depth axis is
kept alongside it, because dropping it would overstate the suite:

> **327 cases have a live-matched assertion. Only 86 of the 475 had EVERY assertion the case makes
> driven end to end.** The CHANGE-LEDGER's own words: *"No case is being reported as fully
> VIU-Verified, because on a non-final build that claim cannot be made (Rule 49) and because I did
> not drive every step of any single case end to end."* **That remains true.**

**So: `VIU-Observed-PASS` in this ledger means "observed and matched, nothing contradicted".
It does not mean VIU-Verified, and it must not be reported as such while the re-check queue is
OPEN.**

---

## Three cases whose recorded PASS does not survive its own evidence

Found during the cold read. Each was recorded **VIU-Observed-PASS** while the observation written
in the same row contradicts the case's expected result. **Recommend re-verdicting to DEVIATION** —
not applied here, because changing a VIU verdict is a decision for the QA lead.

| Case | C-id | The case requires | The recorded observation says |
|---|---|---|---|
| **SBR-EXP-06** | [C30281](https://shopview.testrail.io/index.php?/cases/view/30281) | *"The files are named **exactly** "sales-by-representative-summary.pdf" and "sales-by-representative-expanded.pdf""* | *"the filenames are deterministic (**sales-by-representative-`<variant>`-`<range>`.pdf**)"* — a range token the case's "exactly" forbids |
| **SBR-VIS-03** | [C30307](https://shopview.testrail.io/index.php?/cases/view/30307) | five verbatim accessible names: *"Report actions"*, *"Show or hide columns"*, *"Expand all reps"* … | *"'**Export report**', '**Column Selection**', 'Clear Location', '**Expand all representatives**'"* — at least three of five differ |
| **SBC-EXP-09** | [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | *"always shows both dates"* in the PDF header date range | *"NOTE the date-range end is **off by one day**"* |

**If these three are re-verdicted, the ledger becomes 324 PASS / 112 DEVIATION.** Both figures are
stated so nothing is hidden either way.

---

## The 5 foreign cases (Standing Rule 38 — hands off)

| C-id | Author | Title (truncated) |
|---|---|---|
| [C38919](https://shopview.testrail.io/index.php?/cases/view/38919) | Vladimir Tomovic (user id 1) | SBR Summary and Expanded CSV exports carry the Location column… |
| [C38920](https://shopview.testrail.io/index.php?/cases/view/38920) | Vladimir Tomovic | PV Location column is scope-governed — hidden at one location… |
| [C38921](https://shopview.testrail.io/index.php?/cases/view/38921) | Vladimir Tomovic | TU column selector hides Est. Lost Labor, persists across re… |
| [C38922](https://shopview.testrail.io/index.php?/cases/view/38922) | Vladimir Tomovic | WIP CSV export gains the Locations line while its column sem… |
| [C38923](https://shopview.testrail.io/index.php?/cases/view/38923) | Vladimir Tomovic | IV CSV export carries the As of and Locations metadata lines… |

Not edited, not moved, not counted in any figure above. **Note for the QA lead:** four of these five
are about the **Location column being scope-governed** — the same behaviour our CG-LOCATION-COLUMN-MECHANISM
group is split on, and **C38920 states the automatic model**, agreeing with the specs and against our
IV and WIP cases. That is a coverage signal, not a nuisance (Rule 45a), and it independently
corroborates the resolution recommended in `CONTRADICTIONS.md`.
