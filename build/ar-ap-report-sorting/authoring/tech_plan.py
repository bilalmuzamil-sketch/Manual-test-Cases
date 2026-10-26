"""The engineering tech plan (uploaded by the QA lead 22 Oct 2026), its testable statements and the quotes the cases use (Rules 30, 115,
134). Every quote is checked word for word against sources/Tech-Plan-AR-AP-2026-10-22-upload.md as the page reads (markdown marks
removed). The plan informs and never overrules PRD v5 (Rule 30; QA lead's ruling of 12 Aug 2026: where nothing contradicts it, it sources
a case on its own; every contradiction is reported to him). The plan was written against PRD v4 (20 Oct 2026); v5 (21 Oct 2026) only added
the What-changes line on overpaid invoices, which came from this plan.

STATEMENTS: one row per testable statement (or group of statements that say the same thing): id, where (section and line), quote, verdict,
cases, reason. Verdicts: CONFIRM (already a case) · ADD (new case cited to the plan) · CHANGE (an existing case changes because of it) ·
DIVERGE (conflicts with PRD v5: the case follows the PRD; question for Chris Ward) · EXCLUDED (not something a manual tester can observe,
with the reason)."""
import ar_lib as L

def _q(text):
    if L.ws(text) not in L.TPW and L.ws(text) not in L.TP_RAWW:
        raise ValueError("not verbatim in the tech plan: " + text)
    return text

# ---- the quotes the cases use: key -> (label shown in the case, verbatim text)
Q = {k: ("Tech plan " + lab, _q(t)) for k, (lab, t) in {
 "D4": ("§3 D4", "Name order name COLLATE utf8mb4_0900_ai_ci, then LOWER(name) COLLATE utf8mb4_bin, then the entity id"),
 "UCA": ("§9 Performance", "Name order is UCA order (utf8mb4_0900_ai_ci): every PRD example holds, but punctuation sorts below digits and punctuation marks order among themselves differently from ASCII (e.g. - before #)."),
 "D30-tick": ("§3 D30, tick order", "Selections keep tick order end to end (chip state → URL → export params → resolve endpoint returns request order); only pastDue is normalized to menu order."),
 "D30-keys": ("§3 D30", "URL keys asOfDate, customerIds / vendorIds, pastDue, locationIds (repeated keys written, comma lists also read); legacy customerId / vendorId read once as aliases."),
 "D16": ("§3 D16", "Past due tokens 1-30, 31-60, 61-90, 91-plus on the wire and in the URL"),
 "D21": ("§3 D21", "Pinned group row = scroll-driven overlay (ReportPinnedGroupRow + useReportPinnedGroup) showing the group row's chevron and full label — on A/R Collection including \"Phone:\" and \"Credit term:\" (S9-R1/R2) — but no money cells (the group's subtotals stay in its own row)"),
 "CHK3": ("§7 Manual testing checklist", "3. Fling-scroll a long expanded group: pinned row pushes up without overlapping header or totals."),
 "Q2": ("§1 Clarifications, Q2 A/P row location", "A vendor account is per (vendor, location) on every write path (delivery, manual credit, return credit), so vendor_account.workplace_id already is the document's location."),
 "D13": ("§3 D13", "Equal to S5-R7's per-document rule by construction (every write path finds or creates the (vendor, location) account); prod 0 mismatches."),
 "D29": ("§3 D29", "Unknown or unresolvable customer/vendor/location ids in a link are dropped by the FE during the opening reconcile (resolve endpoint / option list) before any request, so the BE 422 is never reached from the UI"),
 "D29-why": ("§3 D29, rationale", "Mirrors S5-N2 for customers/vendors (a deleted or merged customer in an old link must not break the report)."),
 "P1-FE-invalid": ("§6 Phase 1, unit tests", "invalid location ignored / all-invalid → All; pastDue=5 → Any;"),
 "D31": ("§3 D31", "Customer search (ar-aging/customers) searches all of the organization's customers, as Sales By Customer's chip does; vendor list = all of the organization's vendors, as Inventory Value's chip does"),
 "API-cust": ("§5 API, new endpoints", "ar-aging/customers (search, limit ≤ 50), ap-aging/vendors (org vendor list)"),
 "P2-interim": ("§6 Phase 2, frontend", "Until Phase 3 the link keeps today's target query (asOfDate, customerId, customerName), because the legacy Collection page reads only those;"),
 "P3-drill": ("§6 Phase 3, frontend", "switch the name link to the full drill-down scope (S5-R11): asOfDate, customerIds/vendorIds = [id], pastDue, locationIds (only when not All)"),
 "D18": ("§3 D18", "Customer chip multi-search (as Sales By Customer, S5-R13); Vendor chip multi with the organization's vendor list, searchable over 8 (as Inventory Value, S5-R13)"),
 "FSN": ("§6 Phase 1, frontend", "opt-in fullSelectionNarrows flag: no \"All <noun>\" for a full selection, select-all row ticked only when empty (\"Past due: 4 ranges\", S5-R15)"),
 "P3-rowclick": ("§6 Phase 3, frontend", "whole-row click removed (onRowClick, canNavigate, cursor-pointer, text-blue)"),
 "STAY": ("§6 Phase 1, frontend", "'stay' cancel closes the dialog with no toast/no push (S7-R5)"),
 "P4-sort": ("§6 Phase 4, frontend", "sort resets expanded buckets to page 1 but keeps them expanded"),
 "PDF30": ("§9 Known risks", "PDF generation: WeasyPrint HTTP (600 s client timeout) pins an FPM worker; the 2,000-row cap bounds it (~30 s)."),
 "PDFENV": ("§7 E2E backlog", "PDF generator not configured on every environment; CSV covers wiring"),
 "D9": ("§3 D9", "As-of label via the existing AsOfAnchorResolver (api/src/Reporting/Shared/Application/AsOf/), wrapped by a thin AgingAsOfResolver that supplies the workplace timezone and produces both formats: PDF \"As of Oct 15, 2026\", CSV \"As of: Oct 15, 2026\" (M j, Y)"),
 "D9-why": ("§3 D9, rationale", "Fixes the A/R PDF printing the next day's date (S3-R4)."),
 "D28": ("§3 D28", "Empty-export detection reads the report's server count, never loaded rows: Summaries pagination.rowsNumber; Collection/Unpaid totals.documentCount; Detail totals.rowsNumber from the groups query"),
 "D28-why": ("§3 D28, rationale", "On Detail reports with every bucket collapsed no rows are loaded, so a loaded-rows check would wrongly say \"Empty export\" (S3-R10)."),
 "CSVINJ": ("§9 Security", "CSV formula-injection hardening via CsvAttachmentResponseBuilder (system numeric columns masked as safe)."),
 "D20": ("§3 D20", "The native date chip already caps at today (maxDate); label and data always agree."),
 "NFR5": ("§1 NFR-005", "FE sends one request per settled filter change: chip→query path debounced (~400 ms), superseded requests aborted, opening fetch gated until URL state is reconciled."),
 "D5": ("§3 D5", "FE: debounce chip→query (~400 ms), abort superseded queries, gate the opening fetch"),
 "P1-rapid": ("§6 Phase 1, unit tests", "FE: 5 rapid ticks → 1 fetch; superseded signal aborted;"),
 "LAG": ("§1 Clarifications, intake 1", "~1 s replica lag accepted earlier as not a Product question."),
 "D1": ("§3 D1", "Replica live in prod since 2026-10-18. Staging/QA reader = writer."),
 "REGR": ("§7 E2E, regression re-runs", "Regression re-runs (Keep, no edits expected) when Phase 1 lands, because it changes the shared filter kit, URL sync, useReportTableQuery and the location resolver:"),
 "P1-walk": ("§6 Phase 1, verification", "Browser-walk: Inventory Value, Sales By Customer, Work In Progress (filters, URL round-trip, export) and a Work Order ?locationId= cross-location deep link (Cancel still redirects with its toast) — regression only"),
 "P3-walk": ("§6 Phase 3, verification", "Expand all + scroll loads later groups expanded;"),
}.items()}

def q(*keys):
    return [Q[k] for k in keys]

# ---- every testable statement of the plan, with its verdict (TECH-PLAN-STATEMENTS.md is rendered from this)
S = []
def st(id, where, quote, verdict, cases, reason):
    S.append(dict(id=id, where=where, quote=_q(quote), verdict=verdict, cases=cases, reason=reason))

ALL_S1 = ["S1-01", "S1-02", "S1-03", "S1-04", "S1-05", "S1-06"]
st("TP-01", "§0 Execution State, line 19", "16 open overpaid invoices across 13 accounts, so for those accounts the A/R Summary Totals will no longer include them (Totals = rows, D7)",
   "CONFIRM", ["DATA-13", "REL-01"], "PRD v5 What changes (WC-5) says the same; DATA-13 checks it, REL-01 names it as the one allowed difference.")
st("TP-02", "§0 Execution State, line 19", "G-DATA ran 2026-10-21: no open invoices with a NULL due date (nothing to do)",
   "CONFIRM", ["REL-01", "REL-02"], "No row moves on release day; REL-01 and REL-02 compare untouched reports with screenshots from before the release.")
st("TP-03", "§1 Requirements, lines 39-66", "Full requirement text lives in the PRD; one-line summaries here.",
   "CONFIRM", ["all PRD-quoting cases"], "Every summary line (Stories 1 to 9) read against PRD v5: no line says more or other than the PRD (v4 to v5 changed only the What-changes line on overpaid invoices). The cases quote the PRD itself (REPORT.md lists the cases per code).")
st("TP-04", "§1 NFR-001, line 69; Clarifications intake 1, line 84; §3 D1, line 130", "~1 s replica lag accepted earlier as not a Product question.",
   "ADD", ["DATA-22"], "Freshness (Rule 116): a payment shows on reload. On a test site the reports read the main database (\"Staging/QA reader = writer\"), so it shows at once; in production up to about a second later. Question 9 (part 2) to Chris is still open.")
st("TP-05", "§1 NFR-002, line 70", "every list read SQL-paginated with a total ORDER BY ending in a unique key",
   "CONFIRM", ["DATA-01", "DATA-02", "DATA-03", "DATA-04", "DATA-05", "DATA-06"], "Paging never repeats or skips (PRD S1-R8) in any sort.")
st("TP-06", "§1 NFR-003, line 71", "export refused on a lean COUNT before any projection; CSV streamed row by row.",
   "CONFIRM", ["DATA-18", "DATA-19", "DATA-20"], "Refused straight away, before anything is generated (PRD S3-N1).")
st("TP-07", "§1 NFR-004, line 72; §9 Security", "every id list validated against the organization.",
   "CONFIRM", ["S5-21", "S5-35", "S5-36"], "Tenant isolation is a developer test; what a tester sees is that an id the organization does not hold, in a link, is ignored (D29).")
st("TP-08", "§1 NFR-005, line 73; §3 D5, line 134; §6 Phase 1 unit tests", "FE sends one request per settled filter change: chip→query path debounced (~400 ms), superseded requests aborted, opening fetch gated until URL state is reconciled.",
   "ADD", ["S5-38"], "Ticking several names quickly must end with the rows for all of them (a stale answer must not win). The ~400 ms wait and the single request are not visible by eye; the end state is.")
st("TP-09", "§1 NFR-006, NFR-007, NFR-008 (lines 74-76); §3 D12, D24; §4; §9 statement budgets", "NFR-007 (analysis) — per-endpoint statement budget pinned by a query-budget test that also asserts the writer saw zero aging statements.",
   "EXCLUDED", [], "Query plans, indexes, statement budgets and the 1.5 s EXPLAIN gate are measured by the developers on a staging clone; none is a limit the user sees on screen.")
st("TP-10", "§1 NFR-009, line 77; Clarifications Q1", "background exports: moved by Product to a later phase of this epic (SV-11445), designed and specified before it is planned. Not part of this plan.",
   "CONFIRM", [], "Was step 4 of the CSV 50,000-row case (no offer to email the export or prepare it in the background, PRD Out of Scope); that case was deleted on 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up), so this is left to the developers' own checks.")
st("TP-11", "§1 Clarifications, Q2 (line 89); §3 D13 (line 142)", "A vendor account is per (vendor, location) on every write path (delivery, manual credit, return credit), so vendor_account.workplace_id already is the document's location.",
   "CHANGE", ["S5-16", "S5-17"], "A vendor has no single \"own location\": each bill or credit belongs to the location it was written at. S5-16 and S5-17 now say where each document was entered, not \"the vendor's own location\".")
st("TP-12", "§1 Clarifications, Q3 (line 90)", "Removed from S5-R19 (never shipped). S5-N3 stands.",
   "CONFIRM", ["S5-22"], "No case uses the old single-threshold link.")
st("TP-13", "§1 Clarifications, Q4 and Q5 (lines 91-92)", "Not narrowed; changes only with the as-of date.",
   "CONFIRM", ["S5-10b", "S5-10c", "S5-11b", "S5-11c", "S4-07", "S4-08"], "Same as PRD v5 S5-R3 and S1-R8/S4-R4.")
st("TP-14", "§1 Clarifications, Q9a (line 96)", "Every top-10 shop's unfiltered A/P Detail exceeds the 2,000-row PDF cap; CSV cap has 2× headroom.",
   "CONFIRM", ["DATA-18"], "The QA organization (13,540 open A/P lines) is over the PDF limit and under the CSV limit.")
st("TP-15", "§1 Clarifications, Q9c (line 98)", "267,705 open; 0 differ; 17 without a delivery → D13.",
   "EXCLUDED", [], "A bill without a delivery is old production data a tester cannot create by hand; its location is its vendor account's (D13). Listed for the QA lead.")
st("TP-16", "§1 Clarifications, Q9d (line 99)", "Largest 2,459 invoices; ≤162 customers per org. A/R volume is small; A/P is the hot path.",
   "CONFIRM", ["DATA-19"], "Confirms that no test site can reach a 2,000-customer A/R Summary; DATA-19 stays held with that reason.")
st("TP-17", "§1 Clarifications, PRD Review #4 (line 100)", "Totals = sum of rows is a PRD decision.",
   "CONFIRM", ["DATA-07", "DATA-08", "DATA-09", "DATA-10", "DATA-11", "DATA-12", "DATA-13"], "Same as PRD S5-R18.")
st("TP-18", "§2 Architecture, line 124", "Each report is one SQL \"open documents\" derived table (a UNION ALL of document branches with the as-of balance replay computed once per row), from which rows, groups, subtotals, totals and counts all derive, so filters, sort, paging, totals and export agree by construction.",
   "CONFIRM", ["S3-03", "S3-04", "S3-05", "S3-06", "S3-07", "S3-08", "DATA-07", "DATA-12"], "Within one report. Whether A/R Summary and A/R Detail must agree is question 9 (part 1), still open; the plan does not say.")
st("TP-19", "§3 D2, line 131; §9 Security", "Reports stay organization-wide by PRD decision — no WorkplaceDecorator, no enrollment check.",
   "CONFIRM", ["S5-10", "S5-11", "S7-11"], "Same as PRD S5-R3, S5-R12 and Key Decisions.")
st("TP-20", "§3 D3, line 132", "Export caps count-first; ExportRowCapGuard and ReportPaginator::fetchAllWithinCap gain an optional int $maxRows (default stays 10,000)",
   "CONFIRM", ["DATA-18", "REL-05", "REL-05b", "REL-05c"], "The six reports get 2,000 / 50,000; the other reports keep their own limit (REL-05, REL-05b, REL-05c: exports as before).")
st("TP-21", "§3 D4, line 133", "Name order name COLLATE utf8mb4_0900_ai_ci, then LOWER(name) COLLATE utf8mb4_bin, then the entity id",
   "CHANGE", ["S1-07"] + ALL_S1, "S1-01 to S1-06 confirmed. S1-07 (held on question 1) is released: PRD S1-R4 does not say how an accent counts when two names tie, the plan does (the lower-cased names compared as stored, so \"emile\" before \"émile\"), and nothing contradicts it (QA lead's ruling, 12 Aug 2026). Question 1 stays open; Chris Ward's answer wins if different.")
st("TP-22", "§9 Performance, line 539", "Name order is UCA order (utf8mb4_0900_ai_ci): every PRD example holds, but punctuation sorts below digits and punctuation marks order among themselves differently from ASCII (e.g. - before #).",
   "DIVERGE", ["S1-16"], "PRD S1-R2 and Key Decisions: \"plain character order\", \"the way QuickBooks orders names\". The plan's order differs for names that start with a punctuation mark. New held case S1-16 follows the PRD; question 16 for Chris Ward; reported to the QA lead (Rule 30).")
st("TP-23", "§3 D6, line 135", "replaces the FE's startsWith('P') guess with the stored bare-number product rule.",
   "CONFIRM", ["S7-01", "S7-02", "S7-03", "S7-04", "S7-12", "S7-13", "S7-14"], "A work order invoice opens the work order and a part sale invoice the part sale (both kinds covered).")
st("TP-24", "§3 D7, line 136", "Totals via ReportPaginator::totals() over the same filtered builder; identical on every page; FE reads page-1 meta",
   "CONFIRM", ["DATA-01b", "DATA-02b", "DATA-03b", "DATA-04b"], "The Totals row reads the same on every page (since 22 Oct 2026 its own case per report, split from DATA-01 to DATA-04).")
st("TP-25", "§3 D8, line 137; §9 Security", "Credit term: server-side gate (D8); omitted from JSON, CSV and PDF for users without the switch.",
   "CONFIRM", ["S9-04", "S9-03", "REL-04"], "Same as PRD S9-N2 and S3-R8a.")
st("TP-26", "§3 D9, line 138", "As-of label via the existing AsOfAnchorResolver (api/src/Reporting/Shared/Application/AsOf/), wrapped by a thin AgingAsOfResolver that supplies the workplace timezone and produces both formats: PDF \"As of Oct 15, 2026\", CSV \"As of: Oct 15, 2026\" (M j, Y)",
   "CHANGE", ["REL-03", "S3-09", "S3-10", "S3-11", "S3-12", "S3-13", "S3-14"], "S3-09 to S3-14 confirmed (the PRD's own formats). REL-03 changes: the evening condition is set by the location's time zone, not the tester's, and the day is written without a leading zero (\"M j, Y\").")
st("TP-27", "§3 D11, line 140", "delete orphan shell/LocationFilter.vue, shell/CustomerTypeaheadFilter.vue, PrintARReportButton.vue, asOfDateToDisplay; per-format export cap",
   "CONFIRM", ["S3-01", "S3-01b", "S3-01c"], "A/R's Print button is gone (PRD What changes). The plan's follow-ups (12 bookkeeping CSV exports, other reports' export code) are not changed by this release: nothing to test beyond REL-05.")
st("TP-28", "§3 D16, line 145", "Past due tokens 1-30, 31-60, 61-90, 91-plus on the wire and in the URL",
   "CHANGE", ["S5-22"], "S5-22 has the tester edit the Past due value in the page address; it now names where it is (after \"pastDue=\") and what it reads (31-60).")
st("TP-29", "§3 D17, line 146", "Location-column visibility: FE computes on screen from (option-list size, ticked set) with the same rule the export controller applies server-side",
   "CONFIRM", ["S6-03", "S3-09", "S3-03"], "Same as PRD S6-R2 and S3-R6.")
st("TP-30", "§3 D18, line 147", "Customer chip multi-search (as Sales By Customer, S5-R13); Vendor chip multi with the organization's vendor list, searchable over 8 (as Inventory Value, S5-R13)",
   "CHANGE", ["S5-29", "D-32", "D-73", "D-77", "S5-28", "D-31"], "The Vendor menu shows its search box only above 8 vendors (as Inventory Value). PRD S5-R13 says \"The menu has a search box\" but also \"exactly as Inventory Value's Vendor filter\", so our own sources settle it: no question. The four vendor-menu cases now require more than 8 vendors. Reported to the QA lead as a seeming contradiction (Rule 30).")
st("TP-31", "§3 D19, line 148", "A/P Summary vendor = everyone with report access.",
   "CONFIRM", ["S7-12", "S7-13", "S7-14", "S7-15", "S7-16", "S7-17", "S7-18", "S7-18b", "S7-19"], "The plan's permission matrix is the PRD's Story 7 prerequisites, permission for permission.")
st("TP-32", "§3 D20, line 149", "The native date chip already caps at today (maxDate); label and data always agree.",
   "ADD", ["S5-37"], "PRD silent; the plan sources it. A date after today cannot be picked.")
st("TP-33", "§3 D21, line 150; §7 Manual testing checklist 3, line 437", "3. Fling-scroll a long expanded group: pinned row pushes up without overlapping header or totals.",
   "CHANGE", ["S4-09", "S4-10", "S4-11", "S4-12", "D-57", "D-58"], "The pinned-row cases add a fast scroll (no overlap with the headings or the Totals row) and what the pinned row shows (its chevron and label, on A/R Collection the phone and credit term, no amounts). D-57 and D-58 already compare it with the design pictures, which agree.")
st("TP-34", "§3 D22, line 157", "Info icon placed per report inside ReportToolbar #title, not in Reporting.vue",
   "CONFIRM", ["S8-01", "S8-02", "S8-03", "S8-04", "S8-05", "S8-06", "D-41", "D-42"], "Same as PRD S8-R1.")
st("TP-35", "§3 D23, line 158", "S2-R6 blanks last in both directions",
   "CONFIRM", ["S2-23"], "Same as PRD S2-R6.")
st("TP-36", "§3 D25, line 159", "A/P invoice numbers are user-entered and repeat across vendors",
   "EXCLUDED", [], "About the automated tests' element names. The fact (two vendors' bills can share a number) needs no new case: the number tie-break (S2-R4) is covered by S2-18 and S2-22.")
st("TP-37", "§3 D27, line 151; §5 line 203", "\"No locations\" (S5-R6a) is never sent to the server: the FE sets queryEnabled = false, renders [] (no totals, no Location column, empty state with Clear all filters) and short-circuits export to the \"Empty export\" warning.",
   "CONFIRM", ["S5-14", "S3-24", "S6-03", "D-68", "D-78"], "Same as PRD S5-R6a. It also agrees with the PRD (no Totals row) against the design's $0.00 Totals row (question 13, held case D-78): reported to the QA lead.")
st("TP-38", "§3 D28, line 152", "On Detail reports with every bucket collapsed no rows are loaded, so a loaded-rows check would wrongly say \"Empty export\" (S3-R10).",
   "ADD", ["S3-28", "S3-29"], "An export from A/R Detail or A/P Detail with every bucket collapsed must still download every row.")
st("TP-39", "§3 D29, line 153; §5 line 203", "Unknown or unresolvable customer/vendor/location ids in a link are dropped by the FE during the opening reconcile (resolve endpoint / option list) before any request, so the BE 422 is never reached from the UI",
   "ADD", ["S5-35", "S5-36", "S5-21"], "PRD S5-N2 covers locations only; the plan extends it to customers and vendors (new S5-35, S5-36). S5-21 changes: a link whose only location is unknown opens on All locations (\"all-invalid → All\").")
st("TP-40", "§3 D30, line 154", "URL keys asOfDate, customerIds / vendorIds, pastDue, locationIds (repeated keys written, comma lists also read); legacy customerId / vendorId read once as aliases.",
   "CHANGE", ["S5-20", "S5-21", "REL-11", "S5-19", "S5-23"], "S5-20 and S5-21 have the tester edit the location list in the address: the address writes each location as its own \"locationIds=\" entry holding a code, not a name, so the steps now say how to get a location's code and how to write a comma list. New REL-11: a drill-down link saved before the release (customerId / vendorId) still opens on its customer or vendor. S5-19 and S5-23 confirmed.")
st("TP-41", "§3 D30, line 154", "Selections keep tick order end to end (chip state → URL → export params → resolve endpoint returns request order); only pastDue is normalized to menu order.",
   "CHANGE", ["S3-17", "S3-09", "S3-10", "S3-11", "S3-12", "S3-13", "S3-14"], "PRD S3-R5 does not say in what order several locations are listed on the export's Locations line (question 7, part 1); the plan does (tick order) and nothing contradicts it: S3-17 now checks tick order. S3-09 to S3-14 confirmed (customers in tick order, Past due in menu order). Question 7 stays open; Chris Ward's answer wins if different.")
st("TP-42", "§3 D31, line 155; §5 line 199", "Customer search (ar-aging/customers) searches all of the organization's customers, as Sales By Customer's chip does; vendor list = all of the organization's vendors, as Inventory Value's chip does",
   "CHANGE", ["S5-24", "S5-32"], "The Customer menu lists at most 50 customers until you search, drawn from all the organization's customers: S5-24's precondition now asks for more than 50 customers in the organization, not \"more than 50 with overdue invoices\". S5-32 confirmed (a customer with nothing at the chosen location can be ticked).")
st("TP-43", "§3 D32, line 156", "Phone shown only when non-blank: NULLIF(TRIM(c.telephone), ''), raw otherwise (the customer card shows the raw value)",
   "CONFIRM", ["S9-01", "S9-02", "D-43"], "Same as PRD S9-R1 and S9-N1. A phone made only of spaces is not added as a case: whether the customer card accepts one is unknown, and S9-02 covers a customer with no phone.")
st("TP-44", "§5 API, line 186; §9 Security, line 564", "Every endpoint #[IsGranted(ROLE_REPORT_VIEW)] (S1-N1, PRD Permissions). No new permission.",
   "CONFIRM", ["S1-14", "REL-04", "REL-04b"], "Same as PRD S1-N1 and Key Decisions, Permissions.")
st("TP-45", "§5 API, line 190", "export 400 ReportExportTooLargeError with the exact S3-N1 / S3-N2 text",
   "CONFIRM", ["DATA-18", "DATA-19", "DATA-20", "D-55"], "The messages are the PRD's, word for word.")
st("TP-46", "§5 API, lines 194-200", "ar-aging/customers/resolve, ap-aging/vendors/resolve (customers= / vendors=) | collection[{id, name}] in request (tick) order",
   "CONFIRM", ["S5-24", "S3-09", "DATA-01", "S4-07"], "Paging sizes (30 rows, 30 groups, 100 lines per bucket) and the tick-order resolve are the PRD's.")
st("TP-47", "§5 API, line 205", "link is null for credit memos, deposits and vendor credits not from a vendor return.",
   "CONFIRM", ["S7-07", "S7-08", "S7-10"], "Same as PRD S7-R9 and S7-R10.")
st("TP-48", "§6 Phase 1, frontend, line 241", "opt-in fullSelectionNarrows flag: no \"All <noun>\" for a full selection, select-all row ticked only when empty (\"Past due: 4 ranges\", S5-R15)",
   "CHANGE", ["S5-30", "S5-31", "D-71"], "The \"Any\" row is ticked only while no range is: S5-30 and S5-31 now check it with all four ranges ticked and with none. D-71 confirmed (the picture shows the same).")
st("TP-49", "§6 Phase 1, frontend, line 242", "opt-in commaListKeys (read comma lists, S5-R10), thread isValidValue (S5-N2/N3)",
   "CONFIRM", ["S5-20", "S5-21", "S5-22"], "Same as PRD S5-R10, S5-N2, S5-N3 (the steps change for TP-40 and TP-28).")
st("TP-50", "§6 Phase 1, frontend, line 244", "'stay' cancel closes the dialog with no toast/no push (S7-R5)",
   "CHANGE", ["S7-05", "D-64", "REL-07"], "S7-05 adds what the plan says: Cancel shows no message. D-64 confirmed. The work order page's own prompt keeps today's Cancel (\"default redirect, byte-identical\"): REL-07 confirmed.")
st("TP-51", "§6 Phase 1, frontend, line 245", "collapseOn excludes sort/page (S2-R9, S4-R8, S4-N1), Expand-all mode covers later groups (S4-R2)",
   "CONFIRM", ["S2-25", "S2-26", "S2-27", "S2-28", "S4-05", "S4-06", "S4-13", "S4-14", "S4-17", "S4-18", "S4-19", "S4-20"], "Same as PRD Story 4.")
st("TP-52", "§6 Phase 1, frontend, line 246", "hand-rolled sortable header with sortOrder: 'da' first-click for money/Past due, chevron Collapse-all cell with tooltip anchor=\"top middle\"",
   "CONFIRM", ["S2-02", "S2-09", "S2-13", "S2-17", "S2-21", "S4-01", "S4-02", "S4-03", "S4-04"], "Money and Past due largest first; tooltip above the button. The plan does not say which way the first click on ID or No. goes (question 2 stays open).")
st("TP-53", "§6 Phase 1, frontend, line 249", "TOASTS_ONLY is [400, 404, 500] and does not silence a lost connection (axios.ts:930), which would add a generic \"Network Error\" toast beside the PRD message",
   "CONFIRM", ["S3-26", "S3-27", "D-38"], "The lost-connection cases already check that exactly one message shows.")
st("TP-54", "§6 Phase 1, unit tests, line 272", "FE: 5 rapid ticks → 1 fetch; superseded signal aborted;",
   "ADD", ["S5-38"], "See TP-08.")
st("TP-55", "§6 Phase 1, unit tests, line 272", "invalid location ignored / all-invalid → All; pastDue=5 → Any;",
   "CHANGE", ["S5-21", "S5-22"], "S5-21 adds the all-invalid link (opens on All locations); S5-22 confirmed in substance (5 reads Any).")
st("TP-56", "§6 Phase 1, verification, line 280; §7 regression re-runs, line 462", "Regression re-runs (Keep, no edits expected) when Phase 1 lands, because it changes the shared filter kit, URL sync, useReportTableQuery and the location resolver:",
   "ADD", ["REL-05", "REL-05b", "REL-05c", "REL-07", "REL-12", "REL-12b", "REL-12c", "REL-13"], "Must not change (Rule 96, shared component): REL-05 and REL-07 confirmed; new REL-12 (other reports keep or forget their filters as before) and REL-13 (Sales By Customer's filter menus behave as before). Since 22 Oct 2026 REL-05 and REL-12 are one case per report (\"b\", \"c\").")
st("TP-57", "§6 Phase 2, frontend, line 303", "remove the whole-row click (onRowClick on every cell, cursor-pointer, text-blue) — only the customer name is a .report-link, and only with canView('customers').",
   "CONFIRM", ["S7-18", "S7-18b", "S5-26"], "Same as PRD What changes and Story 7 prerequisites.")
st("TP-58", "§6 Phase 3, frontend, line 360", "whole-row click removed (onRowClick, canNavigate, cursor-pointer, text-blue)",
   "CHANGE", ["S7-02", "S7-01"], "S7-02 (A/R Collection) adds the hover check: no hand pointer and no blue text on the row, only the number is a link. S7-01 (A/R Detail) confirmed: for the Detail reports the plan names only \"whole-row click removed\", which S7-01 already checks.")
st("TP-59", "§6 Phase 2, frontend, line 303; §6 intro, line 212", "Until Phase 3 the link keeps today's target query (asOfDate, customerId, customerName), because the legacy Collection page reads only those;",
   "CHANGE", ["S5-26", "S5-27", "REL-11"], "The reports are delivered family by family (Summaries, then A/R Collection and A/P Unpaid Invoices, then the Detail reports). S5-26 and S5-27 now tell the tester what to do on a build where only the Summaries are new (the drill-down then carries only the date and the name: mark Blocked, not Failed). REL-11 uses the old link form.")
st("TP-60", "§6 Phase 3, frontend, line 362", "switch the name link to the full drill-down scope (S5-R11): asOfDate, customerIds/vendorIds = [id], pastDue, locationIds (only when not All)",
   "CONFIRM", ["S5-26", "S5-27", "D-70"], "Same as PRD S5-R11.")
st("TP-61", "§6 Phase 2 and 3 verification, lines 343 and 370", "no default role separates the two — every default role with report access also has the AP/AR switch",
   "CONFIRM", ["S9-04", "S7-18", "S7-18b", "S1-14"], "The cases already use custom roles for every permission split.")
st("TP-62", "§6 Phase 3, backend, line 354", "opening row order inside a group [doc_date ASC, docNumKey, rawNum, doc_kind, doc_id] (S1-R6: oldest first, ties by number-aware document number)",
   "CONFIRM", ["S1-10", "S1-11", "D-79"], "Same as PRD S1-R6. It also agrees with the PRD (number order) against the design picture (question 14, held case D-79): reported to the QA lead.")
st("TP-63", "§6 Phase 3, frontend, line 360", "switch dialog (lazy BaseDialog, exact copy)",
   "CONFIRM", ["S7-03", "S7-04", "D-39", "D-40", "D-76"], "The PRD's words (\"Switch location\"). It also agrees with the PRD against the design's \"Switch Location\" (question 11, held case D-76): reported to the QA lead.")
st("TP-64", "§6 Phase 3, backend, line 355", "phone raw (c.telephone), credit term COALESCE(NULLIF(c.credit_term,''),'COD')",
   "CONFIRM", ["S9-01", "S9-03"], "Same as PRD S9-R1 and S9-R2 (COD when none is set).")
st("TP-65", "§6 Phase 3, verification, line 370", "Expand all + scroll loads later groups expanded;",
   "CHANGE", ["S2-31", "S2-34", "S2-29", "S2-32", "S4-05", "S4-06"], "On A/R Collection and A/P Unpaid Invoices later groups arrive as the user scrolls. The sort-kept cases S2-29, S2-31, S2-32 and S2-34 said only \"Go to the next page\"; they now say \"or scroll until the next ones load\", as the paging cases do (question 5 still asks which). S4-05, S4-06 confirmed.")
st("TP-66", "§6 Phase 4, backend, line 382", "A/P vendor credit due date = its own date (S2-R6 note); credits never Current",
   "CONFIRM", ["S2-24", "REL-08"], "Same as PRD S2-R6, and today's ageing of a credit dated on the as-of date stays (Out of Scope, SV-11441).")
st("TP-67", "§6 Phase 4, backend, line 382", "groups: 1 statement (GROUP BY bucket, PHP fills all 5)",
   "EXCLUDED", [], "The answer to the screen carries all five buckets; whether an empty bucket's row shows on screen is not stated by the PRD, the design or the plan. No case depends on it (the cases that read five buckets ask for documents in all five), so no question is sent (skill 07 §6). Listed for the QA lead.")
st("TP-68", "§6 Phase 4, frontend, line 387", "sort resets expanded buckets to page 1 but keeps them expanded",
   "CHANGE", ["DATA-05", "DATA-06", "S2-25", "S2-27"], "DATA-05 and DATA-06 said \"expand it if it closed\" after a re-sort, which PRD S4-R8 and the plan rule out; they now check that the bucket stays open and starts again from its first 100 lines. S2-25 and S2-27 confirmed.")
st("TP-69", "§6 Phase 4, verification, line 395", "first paint fast, 100 then more on scroll, header sorts within buckets, PDF over 2,000 rows refused with exactly one toast, CSV succeeds; every column visible at 1440 px",
   "CONFIRM", ["S4-08", "S2-27", "DATA-18", "D-13"], "\"first paint fast\" has no number a tester can check; the rest is covered.")
st("TP-70", "§6 Phase 5, line 410", "tests/Functional/IAM/PricingPdfGuardTest.php (retarget the A/R PDF case to the new export)",
   "CONFIRM", ["REL-04b"], "The plan does not say what this guard does to a user; REL-04b checks the PRD's rule (Reports page access alone exports the reports).")
st("TP-71", "§7 Manual testing checklist 1, line 435", "At 1440 px every column of all six reports fits; headings never wrap; Location wraps only on A/P Detail (S8-R3).",
   "CONFIRM", ["D-01", "D-04", "D-07", "D-10", "D-13", "D-16"], "Same as PRD S8-R3.")
st("TP-72", "§7 Manual testing checklist 2, line 436", "Light and dark theme: link color, pinned column, totals row, pinned group overlay.",
   "CONFIRM", ["D-02", "D-05", "D-08", "D-11", "D-14", "D-17", "D-25", "D-26", "D-27", "D-28", "D-61"], "Every report has a dark-theme case; the pinned group row in dark theme is in D-25 to D-28 and D-61.")
st("TP-73", "§7 Manual testing checklist 4, line 438", "Top-right location switch on each report: filters and rows stay; sort resets; groups collapse; links update (S5-E2).",
   "CONFIRM", ["S5-33", "S5-34", "REL-10"], "Same as PRD S5-E2.")
st("TP-74", "§7 Manual testing checklist 5 and 6, lines 439-440", "Browser Back / reload / shared link restore filters; a link with every location reads as All; \"No locations\" not restored.",
   "CONFIRM", ["S5-19", "S5-20", "S5-14", "S5-23", "S3-09", "S9-03", "S9-04"], "Same as PRD S5-R10 and Story 3.")
st("TP-75", "§7 E2E new coverage, lines 468-504", "This is the only real-MySQL proof of the collation (the BE tests run on SQLite).",
   "CONFIRM", ["S1-01", "S1-03", "S2-01", "S5-10", "S6-04", "S5-26", "S7-03", "S7-05", "S7-08", "S2-23", "S2-27", "S3-11", "S9-03"], "The developers' seven planned browser tests each match one or more of our cases; none expects anything the PRD does not.")
st("TP-76", "§7 E2E backlog, line 512", "PDF generator not configured on every environment; CSV covers wiring",
   "CHANGE", ["DATA-20"], "A test-site fact: a PDF can fail on a site where the PDF generator is not set up. DATA-20 (the case most exposed to it) names it; the setup file lists it for every PDF case.")
st("TP-77", "§7 Notes for /e2e-after-change, line 520", "a way to seed a document at Loc B without enrolling the shared admin there (it would change every other report's Location chip)",
   "EXCLUDED", [], "A setup fact, not a behaviour: recorded in the setup file (enrolment changes other reports' Location chip).")
st("TP-78", "§7 Notes for /e2e-after-change, lines 522-523", "C26553–C26560 describe the reports as gated by the AR/AP atoms (they are gated by Reports → Page Access)",
   "EXCLUDED", [], "TestRail cases written by someone else (Rule 38: report, never edit). Reported to the QA lead with C27260-C27264, C26553-C26560, C29451, which the developers plan to edit, and 7 cases they plan to add.")
st("TP-79", "§9 Known risks, line 558", "PDF generation: WeasyPrint HTTP (600 s client timeout) pins an FPM worker; the 2,000-row cap bounds it (~30 s).",
   "CHANGE", ["DATA-20"], "A 2,000-row PDF can take about 30 seconds: DATA-20 tells the tester to wait for it.")
st("TP-80", "§9 Known risks, line 560", "Collection/Unpaid return all rows of the page's ≤30 groups: one vendor with thousands of bills makes a heavy page.",
   "EXCLUDED", [], "A load-time risk the developers measure on a staging clone; no limit is stated for a tester to check.")
st("TP-81", "§9 Security, line 569", "CSV formula-injection hardening via CsvAttachmentResponseBuilder (system numeric columns masked as safe).",
   "ADD", ["S3-30"], "PRD silent; the plan sources it. A name that starts with \"=\" must open in a spreadsheet as text, not as a formula.")
st("TP-82", "§9 Security, line 568", "destination pages keep their own authorization.",
   "CONFIRM", ["S7-09"], "Same as PRD S7-R8.")
st("TP-83", "Header and 🎨 note, lines 6 and 29", "Only three things are genuinely new: the pinned push-up group row (S4-R6/R7, net-new component), the info icon's placement beside a report title (S8-R1; ReportInfoIcon.vue itself exists), and the hourglass Past due chip icon (a material ligature).",
   "CONFIRM", ["D-25", "D-26", "D-27", "D-28", "D-41", "D-42", "D-33", "D-34"], "The plan was written without the design (\"the canvas was not readable by the planning account\"); where the design differs from the PRD (questions 11 to 15) the plan follows the PRD.")
st("TP-84", "§11 Verification Tickets, lines 641-645", "When all these tickets are marked Done, the feature is ready for QA.",
   "CONFIRM", [], "SV-11595 to SV-11599 are in the ticket ledger (read 22 Oct 2026). No case: the build is not yet ready for QA.")

# ---- 26 Oct 2026: full pass against PRD version 9 (23 Oct 2026) and Chris Ward's answers 1 to 16 (Rules 122, 134). The plan itself has not changed
# (same upload, read in full 22 Oct 2026); each statement below was re-checked against PRD v9. Verdicts are changed only where PRD v9 or an answer
# moves them; the 22 Oct reason is kept and the 26 Oct reason added after it. Cases deleted on 26 Oct 2026 (D-76 to D-80) are taken off the lists.
V9 = {
 "TP-04": ("CONFIRM", None, "26 Oct 2026: PRD v9 S5-R18b (from Chris Ward's answer 9) now states it: reloading shows a payment recorded a moment before. DATA-22 quotes the PRD instead of the plan."),
 "TP-18": (None, None, "26 Oct 2026: question 9 (part 1) is answered: PRD v9 S5-R18a; new DATA-23, DATA-24 and released DATA-14, DATA-15 check it."),
 "TP-21": (None, None, "26 Oct 2026: PRD v9 S1-R4 adds this very example (\"Emile's Towing\" before \"Émile's Towing\", Chris Ward's answer 1); S1-07 now uses the PRD's names and quotes it; the plan agrees."),
 "TP-22": (None, None, "26 Oct 2026: Chris Ward (answer 16) keeps the PRD's plain character order and asks engineering to match it; PRD v9 S1-R2 adds the example \"#1 Diesel\", \"-1 Diesel\", \"10 Trucking\", \"@Home Towing\". S1-16 released (normal marker); it notes the build may follow the plan's order until engineering changes it (no ticket number known)."),
 "TP-30": ("CONFIRM", ["S5-29", "D-32", "D-73", "S5-28", "D-31"], "26 Oct 2026: PRD v9 S5-R13 now says it (\"as there, the search box shows only when there are more than 8 vendors\"); the cases quote the PRD instead of the plan. D-77 deleted."),
 "TP-37": (None, ["S5-14", "S3-24", "S6-03", "D-68"], "26 Oct 2026: Chris Ward (answer 13): no Totals row, the design picture will be corrected; D-78 deleted."),
 "TP-41": ("DIVERGE", None, "26 Oct 2026: PRD v9 S3-R5 (Chris Ward's answer 7) lists the ticked locations in the Location menu's order (A to Z), separated by a comma and a space; the plan keeps tick order for locations. S3-17 now follows the PRD, quotes this plan line and notes the build may differ (no ticket number known). Customers and vendors stay in tick order in both (S3-09 to S3-14 confirmed)."),
 "TP-52": (None, None, "26 Oct 2026: questions 2 and 3 are answered: PRD v9 S2-R2 and S2-R4 (smallest number first, ties smallest number first both ways); the number-order cases now check both."),
 "TP-62": (None, ["S1-10", "S1-11"], "26 Oct 2026: PRD v9 S1-R6 and S2-R4 (Chris Ward's answers 12 and 14): same-day rows by document number whatever the time of day; the plan agrees. D-79 deleted; S1-10 and S1-11 now ask for invoices created in the other order of time and note that the current build orders by time of day (a build bug, no ticket number known)."),
 "TP-63": (None, ["S7-03", "S7-04", "D-39", "D-40"], "26 Oct 2026: Chris Ward (answer 11): the existing prompt has \"Cancel\" on the left, \"Switch location\" on the right and a close ×; PRD v9 S7-R3 and S7-R5 say so; \"exact copy\" agrees. D-76 deleted; new S7-20 checks the ×."),
 "TP-65": (None, None, "26 Oct 2026: PRD v9 S1-R8 (Chris Ward's answer 5): the next 30 load as the user scrolls, no page buttons; every paging step now says scroll."),
 "TP-83": (None, None, "26 Oct 2026: questions 11 to 15 are answered; the design differences are closed (DESIGN-DIVERGENCE-REGISTER.json)."),
}
for _x in S:
    if _x["id"] in V9:
        _v, _c, _r = V9[_x["id"]]
        if _v: _x["verdict"] = _v
        if _c is not None: _x["cases"] = _c
        _x["reason"] = _x["reason"] + " " + _r
for _x in S:
    _x["cases"] = [k for k in _x["cases"] if k not in ("D-76", "D-77", "D-78", "D-79", "D-80")]
