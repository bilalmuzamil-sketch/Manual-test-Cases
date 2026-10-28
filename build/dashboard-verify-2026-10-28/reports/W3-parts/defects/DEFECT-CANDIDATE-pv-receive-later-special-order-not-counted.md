# DEFECT CANDIDATE — Parts Velocity shows a billed "Receive Later" special-order part as 0 sold, $0.00 revenue
Project: Report Suite (epic SV-8582) — Parts Velocity · Prepared: 2026-10-28 · Prepared by: W3 parts lane (independent reports pass)
TestRail case: none — independent pass, no TestRail writes (QA lead, 2026-10-28: "TestRail ... NO")

## VERDICT: ADMISSIBLE — every check passes. Drafted in `TICKET-D1-pv-receive-later-special-order-not-counted.wiki`. NOT filed (Jira creation hold H1 + per-ticket permission).

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ✅ | Build `v26.43.2-f8698cb` at start (19:4x UTC) and end (20:40 UTC). Run 1 (~20:13 UTC, set up through the API): WO S1-38203, part ZZAUTOTEST-SO1-10282011 ordered from vendor, marked Receive later, invoice S1-38203 bills it 1 × $60.00 → Parts Velocity row Units Sold 0.00 / Revenue $0.00 / Demand 0 / Last Sale —. Run 2 (~20:36 UTC, **entirely through the screen**, `tools/repro_ui_a.mjs`, `repro_ui_b.mjs`, `repro_ui_c.mjs`): WO S1-38206, same part, Source changed to Vendor, Order, Receive later, line Complete, Create Invoice → INV-S1-38206 bills it 1 × $68.96 → the same row still reads 0.00 / $0.00 / 0 / —. Existing data: Staging Heavy Duty - 9919 has 57 invoiced "Receive later" requests ($11,123.20 billed) plus 24 still "Awaiting" on invoiced work orders ($1,029.97), and 16 special-order rows in This Year that read all zeros with Last Sale — |
| A2 | Expectation quoted VERBATIM from the CURRENT source version | ✅ | Parts Velocity Report, Confluence 620888066, **version 12** (last modified 14 Sep 2026, Chris Ward), read live 28 Oct 2026. S5-R2: *"Special-order metrics are derived from vendor-sourced part requests (carrying a catalogue part reference, and not a core) on work orders with status Invoiced or Paid …"*. S5-R4 table, Special Order column: Units Sold *"Total quantity across the special-order part's in-window vendor requests …"*; Demand *"Count of in-window vendor part requests."* S5-R4a: *"for special-order, the vendor part requests … Let Revenue = the summed billed sell amount (each line's stored sell price × quantity)"*. S3-N1: *"special-order rows come only from actual in-window vendor requests, so a never-sold special-order part simply produces no row."* |
| A3 | NOT an unfinished feature | ✅ | Owning story SV-8645 "Velocity - Story 5 - Metric Calculations" = **Done**; epic SV-8582 = **Done** (read live 28 Oct 2026). Receive Later is a shipped work-order feature (Receive Parts window, "Receive later" button) |
| A4 | NOT already reported (incl. CLOSED) | ✅ | `project = SV AND (text ~ "\"Parts Velocity\"" OR text ~ "\"velocity\"") AND (text ~ "\"receive later\"" OR text ~ "\"received later\"" OR text ~ "\"receive-later\"" OR text ~ "\"received_later\"")` → 0 hits. `project = SV AND (summary ~ "Parts Velocity" OR summary ~ "velocity") AND (text ~ "\"special order\"" OR text ~ "reverse" OR text ~ "reversed" OR text ~ "re-invoice")` → SV-11511, SV-10080, SV-9810, SV-9808, SV-9807, SV-9219, SV-9197, SV-8938, SV-8596 — none about a billed request that was not yet received. Full Parts Velocity list (100 newest) reviewed in `sources/jira-pv-iv-search-2026-10-28.json` |
| A5 | NOT by design | ✅ | No recorded decision to leave billed, not-yet-received special orders out. The spec counts *vendor part requests* on invoiced/paid work orders; the report itself shows the row (so it accepts the request as in scope) but gives it nothing. Code note: the money pass joins only billed *work-order parts*, and a request that has not been received is not yet a work-order part — an implementation gap, not a decision |
| A6 | NOT environment / data / role | ✅ | Fresh ZZAUTOTEST data in DVI Test (quiet location), Admin; the same pattern in existing data at Staging Heavy Duty - 9919 (16 zero rows) and Staging Lethbridge - 4310 (3) |
| A7 | Correct parent, proved | ✅ | The columns' formulas are PV spec Story 5 (S5-R2, S5-R4, S5-R4a) → SV-8645 "Velocity - Story 5 - Metric Calculations", a child of SV-8582 (JQL `summary ~ "Velocity - Story"`, read live) |
| A8 | Evidence complete | ✅ | 3 annotated pictures (`pictures/D1-1…D1-3`) + `D2-2` shows the same invoice; numbered steps proven on screen; build marker; Admin; DVI Test; 28 Oct 2026 |
| A9 | Adversarial self-review survived | ✅ | Six refusals below |
| A10 | Rule 62 — prepared to the button, not filed | ✅ | Not filed. Not yet asked. |

## A9 — THE SIX REFUSALS, ARGUED AND ANSWERED
1. "This is unbuilt / not finished yet." → SV-8645 and SV-8582 are Done; Receive later is live on the Receive Parts window.
2. "The spec changed — this is obsolete." → v12 (14 Sep 2026) is current; its change log has no entry about received-later or unreceived requests.
3. "Works as designed." → The report already shows the row, so it treats the request as an in-window vendor request; the spec then defines that row's Units Sold as the request quantity, Demand as the request count and Revenue as the billed amount. A row that exists but reads zero on every measure matches neither reading of the spec (S3-N1: a never-sold part "produces no row"; S5-R4: a sold one carries its quantity and money). The customer *was* billed for it.
4. "Cannot reproduce." → Reproduced twice today on fresh data, once entirely through the screen, plus 19 instances in existing data.
5. "Duplicate." → Two JQL searches, no match (A4).
6. "Environment / data / your account." → Clean seeded data, Admin, three locations show it.

## IF NOT ADMISSIBLE
n/a — admissible. If the PO rules that money billed before the part is received should wait until it is received, record that ruling instead and the row with all zeros is then still wrong (S3-N1: a part with no sale "produces no row").
