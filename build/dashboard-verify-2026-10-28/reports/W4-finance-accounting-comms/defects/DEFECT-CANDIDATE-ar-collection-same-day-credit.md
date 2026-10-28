# DEFECT CANDIDATE — A credit created ON the as-of date is listed on A/R Aging Collection as 1 day past due (and A/P Aging Detail shows such a vendor credit as 1 day old)
Project: Reports — A/R aging (SV-2316) and A/P aging (SV-4732) · Prepared: 2026-10-28 · Prepared by: W4 finance / accounting / communications lane
TestRail case: none — independent pass, no TestRail writes

## VERDICT: HELD — fails A5 (a later written statement, SV-5606, says the opposite of the PRD). PO question RQ-1. Ticket drafted in `TICKET-AR1-ar-collection-same-day-credit.wiki`, to be filed unchanged only if the PO answers "No".

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ✅ | Build `v26.43.2-f8698cb`. Run 1 (API, 19:41 UTC): A/R Aging Collection as of 30 Sep 2026 (Heavy Duty, Asia/Karachi) lists CM2-4462 and CM2-4463 (E2E Credits Customer, created 30 Sep 2026) with Past Due **1**; as of 28 Oct 2026 (Lethbridge, America/Edmonton) lists CM1-4535 (ZZAUTOTEST Dash A1, created 28 Oct 2026) with Past Due **1**. Run 2 (screen, 20:18 UTC): same report, customer E2E Credits Customer, Date 2026-09-30 → both credits shown, Past Due 1 (picture AR1-1). A/P side: A/P Aging Detail as of 30 Jun 2026 → C-10617, C-10450; as of 31 Dec 2025 → C-5297, C-5294, C-5320, all created on the as-of date, Past Due **1** (API). |
| A2 | Expectation quoted VERBATIM from the CURRENT source version | ✅ (PRD) | Confluence "AR aging summary report, detail report and collections report" 82083852 **v25 (2026-02-19)**, A/R collections report §6: *"Credits (unapplied portions) — Days aged = Selected Date – Credit Creation Date. If the calculated days are ≤ 0, the transaction is not past due and it's not shown on the report."* A/P: "AP reports" 265093124 v13 §6: *"Vendor Credits (Unapplied) — Days aged = Selected Date – Credit Creation Date"*. |
| A3 | NOT an unfinished feature | ✅ | SV-5027 (BE A/R collections) / SV-5255 (FE) Done; SV-5654 / SV-5773 Done. |
| A4 | NOT already reported (incl. CLOSED) | ⚠️ | SV-5606 (Done, Feb 2026) is ABOUT this very case — see A5. SV-11441 (Open) is the same root seen from Summary/Detail ("credit dated on the as-of day lands in 1-30 instead of Current"), but per the PRD credits never go in Current, so SV-11441's own question is different. JQL: `project = SV AND (text ~ "\"past due\"" AND (text ~ "\"A/P\"" OR text ~ "aging" OR text ~ "unpaid invoices"))` (29 hits, read live). |
| A5 | NOT by design | ❌ | **SV-5606 "A/R Aging Collections Report - Aging Logic for 'Past Due' Column when it's zero Past due" (Done, QA Viktoria Videnovic, Jan 2026) states as its Expected result: *"Today's Credits are displayed with 1 as a Past Due; Invoices should NOT be displayed since those are not past due."* and *"IMPORTANT: … Only the invoice should not be displayed, credit should be, but 1 instead of 0 past due."*** The build does exactly that. A closed ticket is not a spec change (Rule 57), but this is a later written statement that contradicts the PRD, so the PO must say which one stands. |
| A6 | NOT environment / data / role | ✅ | Three dates, two locations / time zones, Admin. |
| A7 | Correct parent, proved | ✅ | A/R collections report → SV-5027 (BE A/R collections report, Done). |
| A8 | Evidence complete | ✅ | `pictures/AR1-1-ar-collection-same-day-credit-past-due-1.png`; steps; build marker. |
| A9 | Adversarial self-review survived | ❌ | Refusal 3 ("works as designed — SV-5606 decided it") is not defeated. |
| A10 | Rule 62 — prepared to the button, not filed | ✅ | Not filed. |

## A9 — THE SIX REFUSALS, ARGUED AND ANSWERED
1. "Unbuilt." → Collections report Done.
2. "Spec changed." → PRD v25 (Feb 2026) still says "≤ 0 … not shown"; SV-5606 is a ticket, not a spec edit.
3. "Works as designed." → **Not defeated**: SV-5606 explicitly asked for "1 instead of 0" for same-day credits.
4. "Cannot reproduce." → Reproduced on screen and in four as-of dates.
5. "Duplicate." → It is the subject of SV-5606 (Done) — which is why it is HELD, not filed.
6. "Environment." → Two locations, two time zones.

## IF NOT ADMISSIBLE
What it is instead: a PO decision — should a credit created ON the chosen date count as 0 days old (PRD: left off A/R Collection; A/P Detail Past Due 0) or 1 day old (SV-5606, today's build)?
Where it was recorded instead: `PO-QUESTIONS.md` RQ-1 · `RESULTS.md` (A/R Collection C4/C5, A/P Detail PD6b).
