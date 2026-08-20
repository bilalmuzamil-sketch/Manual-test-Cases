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
