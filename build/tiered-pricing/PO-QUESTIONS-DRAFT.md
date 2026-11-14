# Tiered Pricing — candidate PO questions (DRAFT — not sent, not on any sheet)

Project: **Tiered Pricing** (epic SV-11692) · PO / owner: **Matt Barge** · Drafted 14 Nov 2026 at intake from: Tiered Pricing PRD 938213378 page v37, Sales by Tier and Sales by Category PRD 968687617 page v21, both tech plans (2026-11-11), the 54 tickets under the epic.

Skill 07 rules apply before anything is sent: one sheet, colour-coded format, plain words, sent **last** (Rule 66), only after the design drive and case drafting are done; new questions go at the bottom of an existing sheet if one exists (Rule 131). Each candidate below passed all eight pre-send checks of skill 07 §6.0 on 14 Nov 2026; the record of each check is under the question. Q2 is **conditional** (drop it if the design drive shows the answer, check c); Q3 was dropped the same day because the design settles it; Q4 must be merged with the design worker's divergence register so the PO gets one question, not two.

---

## Q1 · Tiered Pricing — a paid work order that is reopened: which tier prices the parts added to it?

**What it is about.** When a line is added to a work order that is already paid, ShopView reopens it (engineering's plan calls this a work order "re-created" by adding a line to a paid work order). The PRD says a work order keeps the tier its customer had when it was made, and moving a customer to another tier affects only work orders made afterwards or by splitting (S10-R14). Engineering has built the reopened work order to take the customer's **current** tier and told Product only as an FYI ("FYI: TP-S11-R7 path list; reopened paid work order takes the current tier | Confluence comment | informational", tech plan 1 §1 Clarifications; also tech plan 1 Phase 4 and ticket SV-12667 item 1). No PRD sentence covers it.

**Why it needs you.** It decides the price of every part added after reopening, for any customer whose tier changed since the job was first opened. Money on a real invoice.

**Options.**
- **A (recommended).** The reopened work order takes the customer's tier as it is now, as engineering built it. *Reason:* the parts are new work done after payment, the same way a split work order takes the current tier (S11-E6); it needs no change to the build.
- **B.** The reopened work order keeps the tier the original work order kept. *Effect:* matches "keeps the tier its customer had when it was made" literally; engineering must change the reopen path.

**Cases held on it:** the reopened-work-order part of TP-S10-R14; TPX-01 (REQUIREMENTS-MAP.md). The rest of S10-R14 is written now.

**Pre-send checks:** a precedence — no PRD precedence sentence covers reopening · b suggested-answer — no source sentence backs either option for reopening · c silence — the tech plan speaks but contradicts the PRD's general rule and it carries money → ask · d design library — n/a · e testable — yes (add a line to a paid work order) · f right owner — Product (the PRD owner; engineering asked Product as an FYI) · g behaviour, not wording · h survives the merged list.

---

## Q2 · Tiered Pricing — matrix page: when does a category picked on the Categories line move to this matrix? (CONDITIONAL)

**What it is about.** On a matrix page the Categories line has a picker. The PRD says a category picked there "moves it to this matrix when the matrix is saved", and a category removed "moves to the General Matrix when the matrix is saved" (S3-R13); it also says "Renaming, changing its categories and turning the Part Sale switch on save without asking" (S3-R12). Engineering reads this as: on an existing matrix the move happens **as soon as the picker closes**; on a new matrix, with Create Matrix (tech plan 1 D21, "listed for override at plan review"; Appendix B T12).

**Why it needs you.** Moving a category changes the price of every part in it from that moment. The tester must know whether to expect the move when the picker closes or only after Save.

**Options.**
- **A (recommended).** The move happens when the picker closes (as built), like the name, which saves when the field loses focus. *Reason:* S3-R12 says category changes save without asking and apart from the grid; this is how engineering built it.
- **B.** The move happens only when the user clicks Save on the grid.

**Drop this question if** the design (page 3, matrix page screens) shows the move happening on picker close or on Save — then the design settles it (check c) and the case follows the design.

**Cases held on it:** the timing half of TP-S3-R13.

**Design check (14 Nov 2026):** the package has no board for picking categories on an existing matrix (page 3 shows only 3.23 "Open Categories" on New Matrix, note: "Search and tick categories; one already on another matrix says so."), so the design does not settle it.

**Pre-send checks:** a — no precedence sentence · b — S3-R12 leans to A but S3-R13's "when the matrix is saved" reads either way; not a clean quote · c — tech plan speaks; the PRD is ambiguous on an expectation (Rule 58: never settle from the build); pending design · e — testable · f — Product · g — behaviour (timing) · h — kept, conditional.

---

## Q3 · (DROPPED 14 Nov 2026 — settled by the design) Settings › Categories list: today's QuickBooks column

Checked against the design package saved by the design worker (`design-2026-11-14/files-v1794631438-539a/project/`): board 7.1 "Today: the Categories list" (CT01-TodayCategories) shows the column "QuickBooks Products And Services"; board 7.3 "Settings › Categories" (CA01-Categories) shows Category, Pricing Matrix, Default and the tier columns only, and board 7.8 puts the QuickBooks mapping on the category page. The PRD's column list (S7-R1) and the design agree, so check (c) settles it: no question. Cases assert the new column set and that the mapping is on the category page; INV-52 is reclassified as a documented removal.

---

## Q4 · Sales by Tier and Sales by Category — order of the filter lines at the top of a download (COORDINATE WITH THE DESIGN WORKER)

**What it is about.** The reports PRD says every download starts with the title, the date range, the locations, "then one line each for Sales Type, Category, Priced By and Customer" (S4-R7). The design shows **Priced By before Category**: in the current package the CSV stand-in on board 20.20 (GR-Csv) reads "Sales Type: All / Priced By: All / Category: All categories / Customer: All customers" (tech plan 2 R-D32 cites it as 20.21 under the canvas numbering of 11 Nov). Engineering follows the PRD order and takes the "All …" wording from the design (tech plan 2 R-D32).

**Why it needs you.** The PRD and the design disagree (Rule 130: a design difference is closed by a question or a ruling, never parked).

**Options.**
- **A (recommended).** PRD order: Sales Type, Category, Priced By, Customer. *Reason:* it is the PRD's stated text and what engineering builds; the design's "All" wording is kept.
- **B.** Design order: Sales Type, Priced By, Category, Customer.

**Merge note:** the design worker's divergence register (build/tiered-pricing/design-*) may already hold this difference; send one question only.

**Cases held on it:** the line-order check of RPT-S4-R7 and TPX-31 (order only).

**Pre-send checks:** a — no precedence sentence in the reports PRD for download layout · b — A is the PRD's own text, but the design disagrees, so a quote does not close it (Rule 130) · c — sources disagree → ask · d — design library n/a · e — testable (open the PDF/CSV) · f — Product (design authority Fabian Bonjean / Mathieu Lachapelle may be copied) · g — behaviour (order), not wording · h — kept, to be merged.

---

## Candidates dropped (and the check each failed)

| # | Candidate | Dropped by | Disposition |
|---|---|---|---|
| D1 | Ticket SV-11707's acceptance criterion books revenue to the part's catalog category; PRD S18-R3 says the line's category | a/b — the PRD text and its 11 Nov 2026 change log ("QuickBooks books by the line's category") are the later, dated decision | Cases follow S18-R3; tell the QA lead so the ticket can be corrected (TKT-01) |
| D2 | Ticket SV-11718's summary says Totals tie to Sales; PRD S1-R7 says they don't | a/b — same | TKT-02 |
| D3 | Ticket SV-12458's example lists the current category in "also prices" | g — wording slip | TKT-03 |
| D4 | PRD S1-R3 names only half-cent ties as a release-day price change, but S10-R17 (typed part number), S10-N1 (cost edited to $0) and S11-R5 (cleared price) also change prices | b — each specific requirement states its change and "today" explicitly | Cases follow the specific requirements |
| D5 | After a tier is deleted, reversing an invoice of a work order that kept it prices new parts at Default (tech plan D33) | c — tech plan speaks, PRD silent, low risk | TPX-02 case from the tech plan |
| D6 | A range added from the active view gives archived columns the rule of the range above (D36; "page 35 has no rule for that case") | c — tech plan speaks | TPX-03 |
| D7 | The archived view's Same-as-previous chain differs from what an open work order keeping the tier pays | a/f — Product chose it knowingly (PQ22, tech plan D30) | Case per S4-R19 |
| D8 | Inventory Value report's sell value once matrices change (PRD never names the report) | c — tech plan D4 and the PRD's Out of Scope ("Sell price stays the fixed or Default price") agree | INV-89 regression case |
| D9 | Customer filter also finds credit-only customers, while the PRD says "as on Sales by Customer" | c/g — same search behaviour, wider scope stated by the tech plan (R-D13) | TPX-29 |
| D10 | CSV negatives "-12.40" vs PRD "−$12.40 … in every download" | a/b — S4-E1 "Negative amounts download as negative numbers" | TPX-30 |
| D11 | Blocked archive dialog with many customers: capped or scrolled | e — layout, not an expectation (Rule 58 route clause) | Design worker |
| D12 | Maintenance Reminder canned line added at another location creates no part lines (not in the S11-R7 list) | e — nothing to price | INV-39 regression case |
| D13 | "Remove n Customers?" confirmation is in the design, not the PRD | c — design 9.17–9.18 shows it | TPX-17 |
| D14 | Over-a-year date message differs from Sales by Customer's | c — design 20.11 wording is binding | TPX-23 |
| D15 | Imported historical invoices with no part rows | f — engineering owns the Phase 2 finding | TPX-38, outstanding with engineering |
| D16 | The RPT-S1-R7 list (tech plan 2 Appendix C) is empty | f — a sign-off process for Matt Barge and the report-standard owner, not a question | Outstanding item |
