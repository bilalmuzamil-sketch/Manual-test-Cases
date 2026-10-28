# DEFECT CANDIDATE — Work In Progress shows negative amounts as "(-$3.13)"; the spec format is "-$3.13"
Project: Report Suite (epic SV-8582) · Report: Work In Progress · Prepared: 2026-10-28 · Prepared by: reports-phase worker W1

## VERDICT: HELD — no ticket drafted. The WIP spec is verbatim, but the build's shared formatter documents a "suite-wide negative-amount rule" (brackets AND minus) that "started as a Sales By Representative-only rule (§3)". Another written source may therefore govern; the PO decides (WQ-3). Evidence of a row-level negative was not captured as a picture (A8 incomplete), so even an answer of "minus only" needs one more capture before filing.

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced twice on the current build | ⚠️ | Seen once on screen: Staging Heavy Duty - 9919, tab *Approved - Partially Completed*, Totals row Adjustments **(-$3.13)** (20:37 UTC 28 Oct, `v26.43.2-f8698cb`; API total −313 cents). Totals row of tab *Completed* reads $1.33 (positive). Second observation not made. |
| A2 | Expectation verbatim, current version | ✅ | WIP spec 703660034 v28, S4-R14: *"a negative value shows a leading minus before the "$" (for example "$1,234.56" and "-$1,234.56")"*; S6-R5: *"The Totals row uses the same number formats as the data rows."*; S4-R23 Labor Delta "-14.0". |
| A3 | Not unfinished | ✅ | SV-8660 Done. |
| A4 | Not already reported | ✅ (partial) | `project = SV AND (text ~ "parentheses" OR text ~ "parenthesis" OR text ~ "accounting format") AND created >= 2026-06-01` → 25 issues, none about report negatives. |
| A5 | Not by design | ❌ | The shared report formatter records a deliberate suite-wide rule (code, not a source; the SBR spec §3 it cites was not read in this pass). |
| A6–A8 | — | ⚠️ | One location; no annotated picture. |
| A9 | Refusals | ❌ | Refusal 3 not defeated. |
| A10 | Rule 62 | ✅ | Not filed. |

## IF NOT ADMISSIBLE
PO question WQ-3. If the PO says the suite rule "(-$X)" applies, the WIP spec S4-R14/S4-E3/S4-R23 examples need updating.
