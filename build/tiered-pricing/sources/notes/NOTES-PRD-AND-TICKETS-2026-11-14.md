# Running notes — PRD and Jira reading (Tiered Pricing intake, 14 Nov 2026)

## PRD 938213378 v37 (1,190 lines incl. 9-line header) — read lines 1-1190 in five chunks (1-239, 240-469, 470-719, 720-959, 960-1190), 100%
- Owner: Matt Barge (Matthew Barge). Design authority: Fabian Bonjean and Mathieu Lachapelle (Mathieu approves after Fabian). Engineering: Milan Zivanovic.
- Status: final design approved 9 Nov 2026; tech review done; tech plan questions answered 11 Nov 2026; ready for engineering.
- In-body version: v0.17 (Rule 31 trap a — in-body version is not the page version). Page version 37 = the version the tech plan was written against, so NO diff is needed (no change since). Last change-log rows dated 2026-11-12 (credits-not-tied row removed; archived-view order) are inside v37.
- PRD §6 "Pricing today (baseline)" (read from code and production 2026-10-06/07) is the documented V1 baseline: resolver order, arithmetic (markup only, round once half away from zero), inclusive ranges, below/above first/last range, no negative markup, 181 zero-markup rules, margin math, cost edit reprices (SV-10035), special-order receive keeps margin (SV-9965), no floor, client-wide matrices/categories/customers vs per-location inventory/fixed rules/F&D/labor, F&D frozen on WO at creation, tax-exempt copied to line.
- Explicit changes vs today flagged by the PRD itself ("today ..."): half-cent ties now round up (S10-R5); typed part number on add row priced by its catalog category (today Uncategorized's price, S10-R17); cost edited to $0 now sets $0 (today keeps old price, S10-N1); received part reprices on category change (today only unreceived, S11-R3); deleting a category used by parts no longer blocked (S8-R8); Settings Parts menu order Categories/Pricing/Bin Locations (S7-R14); Settings › Pricing tabs Tiers/Matrices/Fixed Rules (S6-R11) and now needs See Financial Data too for tiers/matrices (S16-R11); matrix editor dialog replaced by a page (S3-R18); margin >=100% now blocked (today converted silently, S3-R6); receive notice wording (S11-R15); customer card shows pricing rows even with no address (S9-R16); price details "Inventory, bin <bin>" (today "Inventory" only, S12-R2); loading skeleton (today loading bar, S19-R7); load error inline (today toast only, S19-R10); Change Customer now shows a notice (today nothing, S14-R2); Audit Log recording is new (Key Decisions).

## Companion PRD 968687617 v21 (452 body lines) — read in full in-session (markdown, inline) and saved via ADF
- Owner Matt Barge; same design authority; story SV-11718; page 20 screens 20.1-20.24. Tech plan 2 written against page version 21 = current. No diff needed.
- Requirement ids: S1-R1..R14 (R4, R5 absent), S1-N1..N2, S1-E1..E9 (E3 absent), S2-R1..R5, S2-N1, S2-E1, S3-R1..R12, S3-N1, S3-E1, S4-R1..R7, S4-N1..N2, S4-E1, S5-R1..R6, S5-N1, S5-E1..E5 + per-story error handling.

## Jira (epic SV-11692) — per-ticket notes appended below as read
- Tech plan 1 header: built on PRD v0.17 = Confluence page version 37 (revision 9, 2026-11-13). Tech plan 2: reports PRD page version 21. Both match today's pages, so no PRD diff is owed. The 18 Tiered Pricing "Verify:" Jira tasks still say "built on PRD v0.17 (page version 35)" — stale ticket wording only (plan rev 7-9 moved to 36/37); no behaviour impact.

### Story tickets (descriptions + acceptance criteria read in full; all 0 comments except SV-5744 bot ping and SV-11698 closure note)
- SV-11693 (S1): consistent with PRD. AC examples: "Fleet"/"fleet" -> "fleet (2)"; "general matrix" -> "general matrix (old)"; first range at $5.00 prices a $3.00 part by first range; $160 Fleet category at 20% off -> $128.
- SV-11694 (S2): consistent. AC says "when Save is clicked" for a new tier name where PRD names the button Create Tier (ticket wording only). AC: Customers count 3 WO + 2 PS with 1 on both = 4.
- SV-11695 (S3): consistent; AC invalid inputs: "Ab", 128 chars, 10.125, 100% margin, 100% off, -$1 off.
- SV-12456 (S4): consistent; AC adds 1920-wide example (6 columns at 176px, spare width right) and 20 tiers at 1512 (128px, Default + 3 visible).
- SV-12457 (S5): AC numbers: Default 35% markup @ $100 -> $135.00 / $35.00 profit; Tier 2 10% off -> $121.50 / $21.50 profit.
- SV-11696 (S6): consistent; AC "brak" search; Tiers "1, 2, 4".
- SV-12458 (S7): AC example inconsistent with PRD S7-R15 format: "The Tread Plus matrix also prices 1 other category: Tires, Retread." (should list only the other category). Ticket typo; PRD wins (no question). Out of Scope note: Part Sale rule in a Categories cell = open question for the design authority (PRD S7-R2: WO rule only; consistent).
- SV-11704 (S8): consistent.
- SV-11697 (S9): consistent.
- SV-11699 (S10): AC numbers: $100 cost, Default 35% markup, Fleet 10% off $121.50; $5 off $130.00; $200 off $0.00; + $5 on $20 = $25 x3 = $75; 30% margin on $10 = $14.29; 30% markup = $13.00; $10.005 -> $10.01 -> 10% off $9.01; FLT $450, labor $240, parts $210, costs $30/$10 -> shares $157.50/$52.50; Fleet 60% off on $15 Default ($10 cost) -> $6.00 negative margin.
- SV-11700 (S11): consistent; AC $0.01 placeholder received at $40.00 repriced by recorded tier; Manual $4 on $2 cost received at $3 -> $6.
- SV-11701 (S12): consistent; AC "Inventory, bin A3".
- SV-11702 (S13): consistent; walk-in "Counter" tier example.
- SV-11703 (S14): consistent; AC 3 Default + 1 Manual + 1 Fixed -> "3 lines priced at Default for the previous customer".
- SV-11708 (S15): consistent; verified example: Default Cost+$10, Fleet 20% off, $40.03 -> 0.8x50.03=40.024 -> $40.02 < $40.03 (first cost below; $40.00-$40.02 round to cost). AC: Fleet $15 off warns, $10 off no warning; last range from $10,000.01 checked to $100,000.10; from $500 checked to $10,000.
- SV-11705 (S16): consistent.
- SV-11706 (S17): AC: $100 Fleet line credited $40 with $5 restocking -> credit $35 under Fleet.
- SV-11707 (S18): CONFLICT inside the ticket: AC "a part whose catalog category is Brakes on a line moved to Tires, then QuickBooks and AccountingHub book its revenue to Brakes" vs its own requirement line and PRD S18-R3 "book part revenue by the category on the work order or Part Sale line" (and reports PRD key decision; PRD change log 2026-11-11 "QuickBooks books by the line's category"). The later dated decision is the PRD's; stale AC. Not a PO question (Rule 32 latest wins; check a/b); flag to QA lead / PO as a ticket correction.
- SV-11709 (S19): consistent; AC "release plus 120 days" audit retention; "  BRAK " search.
- SV-11718 (reports): Summary says Totals "tie out to Sales by Customer and Sales to the cent" — contradicts its own S1-R7 and companion PRD S1-R7 ("These reports don't tie to the Sales report"); PRD change log 2026-11-11 "totals tie to Sales by Customer only". Stale summary; PRD wins; flag only. Ticket S3-R1 omits the shared 50-value cap (PRD has it).
- SV-11698: OBSOLETE (contracts), closed Won't Do 2026-11-09; out of scope; NO-CASE.
- SV-4387 (Task, backlog, 2025): fixed sell price must survive matrix rule change / rule delete / category delete / all rules deleted; already-added parts not updated. Covered by PRD S11-N2, S11-R6, S10-R1 (CHANGED/fixed behaviour).
- SV-5744, SV-7160 (Bugs, open): fixed price lost on category change and not restored on revert. Fixed by S11-N2 ("covers"). Today's behaviour = defect, so NOT an invariant; new-behaviour cases.
- SV-9314 (feature request): cost/range floor — out of scope (S15 Out of Scope, S15-N5). NO-CASE.

### Engineering "Verify:" tasks (18 TP + 11 reports) and SV-12682 — read in full; they restate PRD ids plus engineering detail. Tester-visible additions not in the PRD (tech-plan sourced):
- SV-12666: half-cent tie example 15% markup on $1.70 -> $1.96 (old $1.95); $10.0049 -> $10.00; $1.6950 -> $1.70; inventory screens/catalog/Inventory Value report sell value unchanged (D4) — invariant evidence.
- SV-12667: "A reopened paid work order takes the customer's current tier." — PRD S10-R14 says a WO keeps the tier it was made with; S11-N1 reopening keeps prices; PRD silent on the tier after reopening -> tech-plan addition; check tech plan; candidate PO item. "Moving parts between Part Sales reprices nothing." (tech plan addition).
- SV-12671 item 7: a tier kept only by an invoiced WO can be deleted; reversing that invoice returns the WO to Complete and a part added then prices at Default (tech plan D33).
- SV-12675: Categories line tooltip "A category uses one matrix. Adding one here moves it from its current matrix."; picker "saves when it closes" (PRD S3-R13 says the move happens "when the matrix is saved") — check tech plan; Cost Range tooltip "A part's cost picks its row. The first range starts at $0.00; the last has no upper limit."; chain ending at Default hover "Priced by 1 · <Default's name>'s rule."
- SV-12676: Part Sale switch disabled while the Part Sale grid is in edit; conflict message has a Reload action.
- SV-12677: Set Rule toast stays up when moving to another page.
- SV-12678: red "Remove 2 Customers" asks "Remove 2 Customers?" first (design 9.17-9.18); archived tier's Customers tab shows Reactivate Tier (design 9.21-9.23).
- SV-12680: pricing section skeleton + inline error with Try again; Edit Customer works at phone width.
- SV-12681: creating a category from the inventory part dialog still works; Fixed Rules dialog still works (invariants).
- SV-12682: release B drops legacy table — engineering only; deleting/duplicating a matrix and duplicate-part cleanup still work (invariant).
- SV-12747: other reports' filter bars unchanged ("Clear all filters", "Range: N days (max 366)") — invariant; these reports: over one year "Choose a date range of one year or less."
- SV-12751: dates "Invoice 10510 · Oct 2, 2026"; "−4.20%"; % of Total two decimals; no "-0".
- SV-12752: documents oldest first, then smallest number; credit row "Credit CM-5003 · Oct 21, 2026"; failure on page 2 keeps page 1.
- SV-12753: column chooser remembered per report and per browser; no empty state before first load.
- SV-12754: Priced For "Multiple" when a row spans several; CSV negatives plain "-12.40" while PDF "−$12.40" (PRD S1-R13 "in every download" + S4-E1 "download as negative numbers" — S4-E1 settles CSV as numbers; note only); header lines "Category: All categories", "Priced By: All", "Customer: All customers", empty pick "None".
- SV-12755: going from Parts Velocity carries nothing; location switch carries Location.
