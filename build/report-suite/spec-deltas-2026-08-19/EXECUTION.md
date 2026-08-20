# PV + WIP spec-delta reconciliation — EXECUTION (2026-08-19 delta, run 2026-08-20)

**Status: IN PROGRESS.** Session ALIVE. Build **v3.8-d0e135e** (last-mod Wed 19 Aug 2026 13:27:07 GMT,
etag aa6ea37f82dd0af1b3fe6da5dfd65573) — same-minor v3.8 bug-fix build, verdicts PROVISIONAL (Rule 60).

## Interim write format
The TestRail v2 `update_case` API HTML-wrap block (diagnosed 2026-08-19) is treated as the declared
normalization for this pass: it wraps each markdown field in one `<p>…</p>\n`, escapes entities
(`&`→`&amp;`, `—`→`&mdash;`, `–`→`&ndash;`, `·`→`&middot;`, `<`/`>` on non-tags), and preserves `<br>`.
Lines are written with literal `<br>` (C30133 template). Byte-verify = canon(sent)==canon(stored) with
entity-unescape, plus assert no `<ol>/<li>`. STOP only on content change or `<ol>/<li>`.

## Run 359 snapshot (pre): 508 tests / 535 results (see run359_pre.json in /tmp; re-checked at end).

---

## DELTA A — Parts Velocity CSV plain-number rule (Confluence Aug-17; Dipesh SV-8823)

### LIVE VERIFICATION (build v3.8-d0e135e, 2026-08-20)
PV CSV export `GET /api/reporting/reports/parts-velocity/export?range=this_year&type=both&format=csv`
→ **HTTP 200**, 938,777 bytes. Inspected actual bytes:
- **No `$`** on any money column (Avg Cost/Avg Sell/Revenue/Margin all plain, e.g. 529.33, 24908.33). ✓
- **No thousands separators** in values (13544.67, 11428.00, 10560.26 all plain). ✓
- **No `%`** on Margin % values (37.7, 59.8, 33.6 plain); the only 2 `%` in the file are the header
  "Margin %" and one test row whose Category is literally named `70%override`. ✓
- **Numeric null cells are EMPTY** — Special-Order rows end `…,68,,,,` (On Hand/Turns/Yr/Min/Max empty,
  not em-dash); a zero-activity row shows Avg Cost/Avg Sell/Margin %/Last Sale empty. ✓
- **No alignment/bold/colour markup in the CSV** (inherent — S6-R10 has no CSV representation). ✓ →
  confirms **S6-R10 is PDF-only** from the CSV-lacks-it side.
- **PV PDF export** `?format=pdf` → **HTTP 500** (requestId 80a7d562-fbb9-4175-b2d9-ec00d3eb0277) —
  **SV-8818 still reproduces**, so PDF alignment (S6-R10) could NOT be re-rendered this pass; verified
  PDF-only from the CSV side + noted the blocker.
- **⚠️ FLAG (not a case change):** the **Vendor TEXT column** null still renders as em-dash `—` in the
  CSV (1387 occurrences, all Vendor). C30381's scope is the numeric nullable fields (which ARE empty),
  and Delta A frames the rule as "plain numbers", so this text-column em-dash is NOT clearly required to
  change by the relayed rule. Recorded as a QA-lead flag: does "nulls = empty cells" extend to text
  columns (Vendor) too? No case asserts Vendor-null handling today; no case created (Rule 62 hold).

### CASES WRITTEN (batch 1 — all byte-verified, atm=1, refs updated; declared-normalization diffs only)
| Case | C-id | Action | Marker |
|---|---|---|---|
| PV-EXP-06 | C30380 | EXTENDED — asserts full plain-number rule (no `$`/separators/`%`) + numeric nulls EMPTY in CSV | READY |
| PV-EXP-07 | C30381 | CONFIRMED + re-anchored to Aug-17/SV-8823; CSV numeric nulls empty confirmed live; Rule-56 divergence note kept | READY |
| PV-EXP-08 | C30382 | S6-R10 made explicitly PDF-only; PDF export 500 (SV-8818) → EXPECT-FAIL with symptom + 3 outcomes | READY - EXPECT FAIL (SV-8818) |

### SPOT-VERIFIED — NO CHANGE (on-screen surfaces; Aug-17 rule only touches the CSV)
- **PV-ROW-08 C30348** — em-dash assertion is the ON-SCREEN special-order display (S3-R9), correct;
  does not assert em-dash for the CSV. No change.
- **PV-CALC-13 C30371** — number-format contract is ON-SCREEN (S5-R5) with $/%/separators; does not
  assert the CSV carries the same formatted numbers. The CSV plain-number rule is covered by C30380.
  No change (avoids a redundant assertion, Rule 28).

---

## DELTA B — WIP (Confluence Aug 18–19)

### B.1 + B.2 — grain + line-state — SPOT-VERIFIED LIVE, NO CHANGE
Already applied to v24 by `wip-reconciliation-2026-08-19/EXECUTION.md` (Chris Rulings 1 & 3). The
affected cases already carry `refs` reading **"WIP spec v24 per Chris Ward 2026-08-19"** (verified live
on C30528, C43820, C30456, C30458, C30464, C43979). Live WIP report (`?from=…&to=…` instants, HTTP 200)
shows the four line-state tabs exactly: **Approved - Partially Completed (365) · Approved - Not Started
(666) · Completed (374) · Estimates (1067)** — the line-state placement model (B.2) is present as
documented. **No drift found → no re-stamp** (a metadata-only re-stamp on unchanged content is barred,
Rules 54/69).

### B.3 — Story-5 (Summary Strip) design adoption — 🛑 HELD + RAISED (source not in hand; Rules 57/58)

**LIVE OBSERVED (build v3.8-d0e135e, /reports/work-in-progress, admin):** the summary strip has FULLY
adopted a new design — new figure NAMES, visible grouped +/= math, and reworded tooltips:

| # | Live figure name | Value | Live tooltip (info_outline) |
|---|---|---|---|
| 1 | COMPLETED WORK ON OPEN WORK ORDERS | $672,816.52 | "The total value of completed work order lines on work orders that are still in progress." |
| 2 | WORK ORDERS READY TO INVOICE | $418,300.75 | "…work orders where all work order lines are completed and the work order is ready to be invoiced." |
| 3 | TOTAL COMPLETED WORK | $1,091,117.27 | "…all completed work order lines that have not yet been invoiced, including completed lines on WOs still in progress and WOs where all work is complete." |
| 4 | WORK ORDERS NOT STARTED | $497,896.24 | "…approved work orders where no work has started yet." |
| 5 | REMAINING WORK ON OPEN WORK ORDERS | $250,236.87 | "…incomplete work order lines on work orders where work has already started." |
| 6 | REMAINING WORK | $748,133.11 | "…all approved work that has not yet been completed, including WOs not started and incomplete lines on WOs already in progress." |
| 7 | ESTIMATES | $1,295,085.71 | "The total value of all estimate lines that have not yet been approved, including lines awaiting authorization on open work orders." |

**Grouped math verified live:** (1)+(2)=(3) → 672,816.52 + 418,300.75 = 1,091,117.27 ✓ ; (4)+(5)=(6)
→ 497,896.24 + 250,236.87 = 748,133.11 ✓ ; (7) Estimates standalone. The strip literally renders `+`
and `=` operators between the figures.

**Old→new figure-name mapping (the v22 cases use the OLD names):** Started—Earned → COMPLETED WORK ON
OPEN WORK ORDERS · Ready to Invoice → WORK ORDERS READY TO INVOICE · Total Earned (hero) → TOTAL
COMPLETED WORK · Not Started → WORK ORDERS NOT STARTED · Started—Remaining → REMAINING WORK ON OPEN
WORK ORDERS · Total Remaining → REMAINING WORK · Estimates → ESTIMATES.

**🛑 WHY B.3 IS HELD, NOT WRITTEN (Rules 57 / 58 / 25):**
- The **six new figure names + their six tooltips** appear in **NO document I hold** — not the repo, not
  the Chris rulings file (`chris-answers-2026-08-19/WIP-CHRIS-RULINGS-2026-08-19.md` covers only Rulings
  1–3 = grain/aging/line-state, NOT the Story-5 figure/tooltip layer), not the v22 baseline. They exist
  ONLY on the build and in the SSO-walled **v24 spec / Aug-13 design review**, which could NOT be fetched
  this session (no Atlassian MCP; SSO-walled).
- **Rule 57:** the build is never the source of an expectation. **Rule 58(b) quote-back test:** an
  edit's new expected result must be quotable back to a source text — I cannot quote the six new figure
  names/tooltips back to anything I hold. **So writing them would be inventing the expectation from the
  build — the exact 748-case failure.**
- **Corroboration that the build IS the ratified design (but still not a licence to write):** the live
  **Estimates** tooltip is **byte-identical** to C30493's already-LOCKED S5a-R2 wording (confirmed by
  Chris 2026-08-18). That strongly suggests the other six tooltips are the locked wording too and the
  "old tooltips still shipping" gap is closed — but that is an inductive leap Rule 58 forbids; the exact
  ratified wording for the six is still not in hand.
- **Re-stamping v22→v24 on these cases is ALSO barred** — their content (old figure names) is now known
  STALE against the build, so stamping "v24" on stale content would violate Rule 54's honesty clause.

**⇒ HELD, NO WRITES, to all Story-5 cases:** C30487, C30489, C30490, C30491, C30493, C43818, C30520,
C30524, C43838 — and **C30488 (atm=3 Automated, HELD twice over — Rule 71 + source-blocked)**. See
`PV-WIP-RECON-HELD-AUTOMATED.md`. **RAISED as a new OUTSTANDING ask (RS-WIP-8 updated):** the QA lead
must supply the **WIP v24 Confluence page + the Aug-13 design-review export** (ratified figure names +
locked tooltip wording), after which B.3 can be written in one pass.

**One hero figure:** the live strip shows TWO "=" totals (TOTAL COMPLETED WORK, REMAINING WORK), not a
single distinct hero (sampled figure styles were uniform: `outline none`, `box-shadow none`). The v22
case C30488 asserts "Total Earned is the hero (larger, coloured underline)" — this too needs the v24
source to reconcile. Recorded, not written.

**Tab-to-figure highlight (NEW behaviour):** Delta B.3 names a new "selecting a tab highlights its
corresponding summary figure" interaction. C43838 covers the tab's OWN amber glow, not the figure
highlight. **RECOMMENDATION (NOT created — Rule 62 creation-hold H1):** a NEW WIP case for the
tab-to-figure highlight, authored once the v24/design-review source is in hand and the QA lead lifts the
creation hold. Its exact trigger→highlight behaviour must be sourced from the design review, not the build.

---

## PROOFS
- **Build marker:** `v3.8-d0e135e` (last-mod Wed 19 Aug 2026 13:27:07 GMT, etag aa6ea37f82dd0af1b3fe6da5dfd65573)
  — **identical at pass start AND end**; no redeploy under the pass. Same-minor v3.8 bug-fix build →
  verdicts PROVISIONAL (Rule 60).
- **Run 359 UNTOUCHED:** 508 tests pre==post (identical id set), case-id sets equal both ways;
  535 result records pre==post — all present by id AND no new results. 0 add/delete/section/run/result.
- **0 Jira.** **0 foreign cases touched.** **3 TestRail `update_case` total (C30380, C30381, C30382),
  all HTTP 200, byte-verified (declared `<p>`/`\n`/entity-escape normalization only; 0 `<ol>/<li>`;
  refs match).** **0 WIP writes.**
- **§8.5 gate:** 0 cases skipped for data-seeding or login reasons. The only un-written WIP cases are
  HELD on a genuine SOURCE-ABSENCE (v24/design-review not fetchable), not a data/login blocker.
- **Env:** read-only live observation (report exports + admin view of the WIP page). No data seeded, no
  role changed, Tech untouched, no cleanup needed.
