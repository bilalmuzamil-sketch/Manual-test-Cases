# DEFECT CANDIDATE — Technician Efficiency counts lines the customer declined
Project: Dashboard v1 (epic SV-490) · Prepared: 2026-10-28 · Prepared by: credit-memo-document-location lane (independent dashboard pass)
TestRail case: none — independent pass, no TestRail writes (QA lead, 2026-10-28: "TestRail ... NO")

## VERDICT: HELD — fails A2 (the expectation cannot be quoted unambiguously); PO question DQ-1 raised. Ticket fully drafted in `TICKET-F2-tech-efficiency-counts-declined-lines.wiki`, ready to file the moment the PO confirms.

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ✅ | Build `v26.43.2-f8698cb` (staging, develop f8698cbc1, deployed 2026-10-28 13:56 UTC). Run 1 ~19:00 UTC: WO S1-38195, "ZZAUTOTEST Dash A1", Esther Howard → tile 133.33% "2.00 Invoiced Tech Hrs / 1.50 Clocked". Run 2 ~21:30 UTC: WO S1-38198, "ZZAUTOTEST Dash F2", Fabian Bonjean → his row 1.50 / 2.00 / 133.33%. Also found in existing data: 10 declined lines at Heavy Duty and Lethbridge (e.g. S2-12614 "Replace - Hydraulic pump feed line", 2.5 tech hrs) |
| A2 | Expectation quoted VERBATIM from the CURRENT source version | ❌ | Dashboard PRD, Confluence 788430850, **v53 (2026-10-22, Chris Ward)**, read 2026-10-28. §4: *"**Invoiced technician hours** — the technician time recorded on work order lines. Used by Technician Efficiency. This is a different figure from invoiced hours."* and *"**Invoiced hours** — the labor time billed on work order lines."* The PRD says *billed* for one and *recorded* for the other, so it does not clearly say a declined (unbilled) line is left out of Technician Efficiency. Story 3 table: *"Invoiced technician hours divided by clocked hours"*. S3-E2 ties "invoiced technician hours" to invoices ("A voided invoice … contributes nothing … to invoiced hours or invoiced technician hours"), which **leans** towards "only what was invoiced" — but leaning is not a quote. |
| A3 | NOT an unfinished feature | ✅ | Owning story SV-9575 "Dashboard v1 - Story 3 - Measure Formulas & Report Parity" = **Done**; epic SV-490 = **Done** (read live 2026-10-28) |
| A4 | NOT already reported (incl. CLOSED) | ✅ | `project = SV AND (text ~ "\"technician efficiency\"" AND (text ~ "declined" OR text ~ "decline"))` → SV-6030 (ShopCoach, obsolete), SV-2386 (WO stats tab) — unrelated. `project = SV AND (summary ~ "Technician Efficiency" OR summary ~ "Tech Efficiency" OR parent = SV-9575 OR summary ~ "invoiced tech hours") AND created >= 2026-06-01` → SV-11905 (sort), SV-11297 (SQL refactor), SV-10934 (scroll), SV-10932, SV-10894 (Last 12 months), SV-10887 (SBC 0 after login), SV-10884 (CSV), SV-9127, SV-8985, SV-8245, SV-7850 (extreme % near zero — OBSOLETE), SV-7573 — none about declined lines |
| A5 | NOT by design | ⚠️ | No recorded decision either way. The code reads `tech_time` from every line of the latest invoice's work order with no line-status filter, while Billing Efficiency's query filters declined lines out — the two measures treat the same declined line differently. Whether that is intended is the PO question. |
| A6 | NOT environment / data / role | ✅ | Seeded clean data in DVI Test (quiet location), Admin role; same behaviour in existing production-like data at two other locations |
| A7 | Correct parent, proved | ✅ | Technician Efficiency's formula is PRD Story 3 (S3-R2 table row "Technician Efficiency") → SV-9575 |
| A8 | Evidence complete | ✅ | 4 annotated pictures `F2-pictures/`; numbered steps; build marker; Admin; DVI Test; 2026-10-28 |
| A9 | Adversarial self-review survived | ❌ | Refusal 3 ("works as designed — the PRD says *recorded* on work order lines") is NOT defeated from the PRD text alone. |
| A10 | Rule 62 — prepared to the button, not filed | ✅ | Not filed. Jira creation hold H1 + per-ticket permission. Not yet asked. |

## A9 — THE SIX REFUSALS, ARGUED AND ANSWERED
1. "This is unbuilt / not finished yet." → SV-9575 and SV-490 are Done.
2. "The spec changed — this is obsolete." → PRD v53 (2026-10-22) is current; its change log has no entry about declined lines.
3. "Works as designed." → **Not defeated.** PRD §4 defines invoiced technician hours as time *recorded* on work order lines, not *billed*. The counter-argument (the name says "invoiced"; S3-E2 ties the figure to invoices; Billing Efficiency on the very same invoice leaves the declined line out; a declined line shows 200% efficiency) is strong but is an interpretation.
4. "Cannot reproduce." → Reproduced twice on seeded data with exact steps, plus 10 instances in existing data.
5. "Duplicate." → Two JQL searches, no match (A4).
6. "Environment / data / your account." → Clean seeded data, Admin, two technicians, two locations' existing data agree.

## IF NOT ADMISSIBLE
What it is instead: a PO decision — "Should a line the customer declined count towards Technician Efficiency?"
Where it was recorded instead: `PO-QUESTIONS-2026-10-28.md` DQ-1 · `NOT-FILED.md` · the ticket is drafted in full so it can be filed unchanged if the PO answers "No, declined lines must not count".
