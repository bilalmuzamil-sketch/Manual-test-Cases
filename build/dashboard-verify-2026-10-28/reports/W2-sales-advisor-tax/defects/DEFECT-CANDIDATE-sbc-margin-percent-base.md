# DEFECT CANDIDATE — Sales By Customer "Margin %" leaves Shop Supplies out of the bottom number
Project: Report Suite (epic SV-8582) · Report: Sales By Customer · Prepared: 2026-10-28 · Prepared by: W2 (reports phase, independent pass)
TestRail case: none — independent pass, no TestRail writes

## VERDICT: HELD — fails A2/A5: two current written sources disagree. PO question **SQ-1**. Ticket fully drafted in `TICKET-W2-1-sbc-margin-percent-base.wiki`, to be filed unchanged only if the PO answers "Margin ÷ Subtotal".

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ✅ | Build `v26.43.2-f8698cb`. (1) Screen 2026-10-28 20:44 UTC, Staging Heavy Duty - 9919, Date: This month, Customer: TestVT1 → Margin $21,960.81, Shop Supplies $2,050.98, Subtotal $28,569.41, **Margin % 82.81%** (`pictures/SBC-1-margin-percent.png`). (2) Server rows for every invoice of two years, four locations: every row that carries shop supplies has Margin % = Margin ÷ (Subtotal − Shop Supplies), never Margin ÷ Subtotal (counts in `../RESULTS.md`, check "Margin % = Margin / Subtotal"). Rows without shop supplies agree with both readings. |
| A2 | Expectation quoted VERBATIM from the CURRENT source version | ⚠️ | SBC spec, Confluence 577634305 **v22 (2026-10-19)**, S7-R11: *"The Margin % column shows the row's Margin divided by its Subtotal, times 100"*; §4 Terminology: *"Margin % — Margin divided by the row's Subtotal, times 100. Because Subtotal includes Shop Supplies but Margin does not, Margin % is profit measured against total sales."* **But** the SBR spec, Confluence 585629698 **v30 (2026-10-21, newer)**, §3 context note: *"Sales By Customer computes Margin % from the same Margin base, so both reports report the same Margin % for the same invoice."* (Margin base = Labor + Parts + Adjustments = Subtotal minus Shop Supplies.) |
| A3 | NOT an unfinished feature | ✅ | SBC story SV-8605 (Story 7) and SV-8598 Done; SV-9280 (SBC Adjustments + tie-outs) Done |
| A4 | NOT already reported (incl. CLOSED) | ✅ | JQL live 2026-10-28 (`../sources/jql-duplicates-2026-10-28.txt`): only SV-9069 (decimals) and SV-9280 (Adjustments) touch SBC Margin; none about the denominator |
| A5 | NOT by design | ❌ | The SBR spec says SBC uses the Margin base on purpose; the code comment says the same (Subtotal minus shop supplies "holds exactly the revenue that feeds Margin") |
| A6 | NOT environment / data / role | ✅ | All four locations; Admin |
| A7 | Correct parent, proved | ✅ | S7-R11 is SBC Story 7 → SV-8605 (Done, read live) |
| A8 | Evidence complete | ✅ | annotated picture, server counts |
| A9 | Adversarial self-review survived | ❌ | Refusal 3 not defeated (see below) |
| A10 | Rule 62 | ✅ | Not filed |

## A9 — THE SIX REFUSALS
1. "Unbuilt." → Built and Done.
2. "Spec changed." → The SBC page was edited 19 Oct and still says ÷ Subtotal; the SBR page edited 21 Oct says SBC uses the margin base. **This refusal is half-true: the two pages disagree.**
3. "Works as designed." → **Not defeated**: the SBR spec describes exactly what the build does.
4. "Cannot reproduce." → Every shop-supply row, four locations.
5. "Duplicate." → None found.
6. "Environment." → Not environment.

## IF NOT ADMISSIBLE
A PO decision: SQ-1. If the PO keeps the Margin base, the SBC spec S7-R11 / Terminology need the same wording as SBR §3; no ticket.
