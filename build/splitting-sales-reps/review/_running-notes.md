# Running notes — tech plan + Jira review (worker, 19 Oct 2026)

## PRD v8 txt — read L1-315 in full (42,356 bytes). 138 codes counted by grep.

## Tech plan chunk L1-250
- L3 Date 2026-10-14; L9 planned against develop @022941e459 re-verified 2026-10-15; L17 status Not started, plan approved 2026-10-15.
- L21 open questions: none; Q1,Q2,Q3,Q4,Q12,Q13 answered by PO reply 941981729 -> PRD v8.
- L23 Q2: builds to existing 42px height (S1-R4 names no px) -> ADD.
- L25/L39 design canvas yields no text to their tooling; [design-verify] items by eye.
- L29 S1-R6: code already 16px on develop and main; PO says "gap under Lead Technician is wrong"; plan verifies/fixes in Phase 5. -> PRD context note says 36px; DIVERGE-ish (fact conflict re today).
- L30 10 legacy customers (rep not a user of org) become "Unassigned" via Phase 2 migration -> exception to S4-E1 (accepted by Product, Q15 L239). DIVERGE vs S4-E1 text (PRD has no exception).
- L45-207 section 1 = PRD restated "verbatim" (check by script).
- L213-216 NFR-001..004 (org-scoped lookups; server-validated customer reps; no table rewrite; no 500 on binary column).
- L223 Invoiced/paid WO refuse rep change: not built today for service WOs (only part sales).
- L224 contacts re-import blanks rep today.
- L227 SBR saved columns/sort reset: saved-view version bump + new salesTypes filter key.
- L246-247 V1 facts: already built single rep field w/ Unassigned, (Inactive), save-as-you-go, read-only gate (SV-8599); 16px gap; "not a sales representative" refusal; log entry single rep (#3369); frozen rep name on invoice; Unassigned bucket & Show Unassigned; "Empty export" both reports. Not true today: rename updates one customer (findOneBy); service WOs don't refuse after invoicing; customer rep write path unvalidated; New Customer no rep field; customer dropdown HAS search box and no Unassigned; 36px note wrong (already 16); split/reopen copy nothing.
- L248 SBR groups by i.sales_rep_id today.

## Tech plan chunk L250-499
- L252 architecture: split flag + second rep id; unsplit Parts follows Labor.
- L269 customer child table; names read live -> renames reach every customer; legacy columns no longer read/written.
- L270 one endpoint, add/remove Parts = one save + one log entry; copy at create not via change endpoint (no log, S7-R5).
- L272 report per-side rows; whole-invoice share by size integer cents.
- L273 picker /api/sales-reps A–Z unpaginated; allowed for WO view, WO create/edit, customer create/edit.
- L282 D3 leftover cent to Labor, invoice count distinct.
- L283 D4 behaviour change: cross-org id now reads "(Inactive)" with no name. L414-415 rep id not resolving -> name=null, is_inactive=true. => QUESTION: what does card show for a nameless inactive rep? (S6-N1 print says Unassigned; S1-E2 says name + "(Inactive)").
- L284 D5 / L429-432 customer create/change: 400 "The selected staff member is not a sales representative." for non-org or non-eligible new ids; existing holders re-savable (S4-N2). ADD (Story 4 has no message).
- L286 D7 refusal msg; L396 part-sale msg "…on an invoiced or paid part sale." unchanged.
- L289 D10 phone = @media (hover: none), not width. ADD.
- L290 D11 service advisor not copied from customer.
- L296 D17 NO "(Inactive)" suffix on customer fields (PRD feedback table scopes it to WO). ADD / ambiguity -> Q (S4-N2 person w/ switch off stays on customer: shows plain name).
- L297 D18 part sale rep field moves onto new WO rep component with + off; "existing test ids kept". vs PRD S2-N2 context note "Visually nothing changes there". -> Q/DIVERGE risk (hover look S1-R3/R4 on part sale?).
- L299 D20/L316 P-9 part sale = invoice number LIKE 'P%'; everything else (S% and others) = work order. Differs from old SBR Service predicate (S%).
- L300 D21 absent split preserves state.
- L301 D22 public API staff rename cascades to user.
- L312 P-5 Sales Follow-Up report keeps legacy columns (out of scope, doesn't load).
- L313 P-6 / L366 migration: 892 customers w/ rep, 10 foreign -> Unassigned.
- L318 P-11 invoice stores parts cols only when split.
- L319 P-12 customer-surface names = user names; WO/invoice names = staff names.
- L333 IconActionButton: tooltip suppressed while active (S2-R3 confirm).
- L334 customer dialog draft until Save.
- L337 WO buttons hover-revealed (touch always), customer always visible.
- L367 WOs/invoices no data migration; split=0 => Parts follows one rep.
- L390 400 "The Parts sales representative can only be set on a split work order." (never reached from UI)
- L393 400 "A part sale has one sales representative." (S2-N2 structural)
- L397-402 eligibility only for ids not already held on either side.
- L403-404 identical tuple writes nothing, saves nothing (S7-R4 confirm).
- L421-425 customer API: primary required; side once; absent on change = unchanged; create absent = primary Unassigned.
- L436-445 customer view sales_representatives array; legacy keys removed.
- L448-453 log entry DTO; null split = not split.
- L456-460 salesTypes param all|none|subset; unknown token 400; stale productType ignored.
- L462-468 masking per row type: labor -> parts_invoiced, parts_margin null; parts -> inv_hrs, hours_worked, hours_invoiced, labor_invoiced, labor_margin, shop_supplies null; part_sales -> shop_supplies null when 0; labor,parts -> all numeric; adjustments, margin, subtotal, margin_pct never masked.
   NOTE: S5-R15 "labor-line fees" / Labor Delta? Plan names inv_hrs (labor delta?) - check later.
- L470-474 Expanded CSV/PDF Sales Type column right after Status; blank on rep and total rows; masked cells blank CSV / em dash PDF; filter line "Product Type: …" -> "Sales Type: All/None/Labor, Parts". "None" defensive only (FE blocks).
- L477-479 SBC export caption Product Type -> Sales Type; values All Sales / Part Sales only / Service Sales only / No sales (defensive).
- L485-486 picker guard widened.
- L491-492 V1: customer dialog called GET /api/staff (ROLE_USER_VIEW): 403 for WO-only users; pages 100 rows by id.
- L496 sales-rep-assignments count logic changes; L497 export gains Side column.

## Tech plan chunk L499-728
- L512 FE lands after BE phase. Phase table L514-524.
- L576 tooltip not shown while active (S2-R3). L583 32px/8px radius. L585 hover fill rgba(0,0,0,.06) [design-verify]; dark mode L586 rgba(255,255,255,.08) -> ADD dark mode.
- L592 + aria-label "Add representative"; menu anchored bottom left (S2-R4 "below it").
- L597 re-entrancy guard via useAsyncAction + :disable.
- L600-614 FilterChip opt-in: allSummaryLabel; summaryListsNames lists names in OPTION order even if picked out of order; never truncated (L613).
- L606 count 0 -> emptySummaryLabel if set.
- L626-635 hover / focus-within / engaged reveal; touch (hover:none) always show actions + rep arrows only; keyboard tab reveals (S1-R4 keyboard focus).
- L640-645 print/log formatter: " · " U+00B7; no name -> "Unassigned (Parts)"; inactive -> "(Parts, inactive)". CONFIRM S6-R2/R3, S7-R3, S6-N1.
- L663-668 SBC: options 'Part Sales'(parts) 'Service Sales'(service); key productTypes unchanged; chip labels 'Sales Type', selectAll 'All Sales', allSummary 'All Sales', empty 'No sales'.
- L670 V1 FACT: SBC chip today reads "All products" / "No products" (spec L379-470).
- L671 S8-E1: URL productTypes=parts restores Part Sales.
- L678-679 SBC export labels All Sales / Part Sales only / Service Sales only / No sales.
- L690 browser walk SBC: Sales Type: All Sales; one -> Part Sales; none -> No sales, empty state, Export -> "Empty export"; old ?productTypes=parts URL; CSV/PDF filter line.
- L693 existing e2e/TestRail ids touched: C30178, C30174 (chip regex), C30161, C30163 (export metadata).
- L719 InvoiceSalesRepResolver reads primary row.
- L724 mid-stack: customer page reads "N/A" between phases (never merged alone). V1 FACT: CustomerLeftSection reads legacy keys and shows "N/A".

## Tech plan chunk L728-987
- L747-752 migration: one primary row per company; only org users copied.
- L778 constructor makes primary Unassigned row -> every new customer (S4-R31, S4-E1).
- L788 split = has ServiceParts. L790 Labor=primary, Parts = split? service_parts : primary.
- L791-793 part-sale rule: part_sales if added (even null) else service_parts else primary. CONFIRM S4-R26/R12/R13/R18.
- L794-795 deactivation: primary/service_parts -> null, field kept; part_sales row removed. CONFIRM S4-R20.
- L797 change(): drop rep param (import no longer blanks, S4-N3).
- L799-801 rep change does NOT move company.updated_at (no public API field changes). ADD (low UI value). Also L972.
- L805 ChangeSalesRepName deleted (findOneBy bug: V1 rename updated only one customer).
- L825 customer policy message "The selected staff member is not a sales representative." one bad id fails whole request.
- L863-865 contacts import: stop passing rep. L947 V1 FACT: "today the import blanks the rep".
- L870 public API still exposes no rep.
- L875-879 warning count = COUNT DISTINCT company. CONFIRM S4-R21. L969 example: primary on A, service_parts on B, part_sales+primary on C = 3.
- L900-901 resolver: user without staff row now returns (null,null) — no name fallback (ENG-Q2: 0 such rows in prod).
- L908-914 picker guard: customer C&E only -> 200; WO C&E only -> 200; none -> 403. ADD (permissions).
- L954-960 functional: rename -> every customer; foreign id 400; non-flagged new id 400; held unflagged saves; absent key unchanged; removing part_sales deletes.
- L963 create without list -> primary Unassigned. L966 new org Counter Sale primary null (S4-R31 CONFIRM).

## Tech plan chunk L987-1200
- L989 export lists only fields holding a person (csr.user_id IS NOT NULL) -> Unassigned fields produce no row. ADD.
- L993 export sort: customer name, then rep name (case-insensitive). ADD (sorting).
- L995-998 side labels CONFIRM S4-R23.
- L999 V1 FACT: "Active?" = staff exists AND user active (kept, now org-scoped).
- L1001-1002 rows keyed by user id: two people with same name -> two rows (old question). ADD.
- L1016 historical WO card reads workOrder rep, not customer.
- L1030-1035 existing e2e/TestRail ids: C30293 (export header Side; "Parts and Service"), C30256/C30255 (SBR deactivation), C154617 (part sales tax+rep).
- L1056 / L1155 rep rows move outside address v-if; Phone, Credit, Website, IBS stay inside (V1 fact: those show only with address).
- L1097 addPartSales snapshot of "follows" -> CONFIRM S4-R8.
- L1122 no use-input -> no search (S4-R3); no in-field x.
- L1136 options from /api/sales-reps, Unassigned first, server sorted.
- L1141-1143 S4-R4 buttons inside form body, scroll with fields; [design-verify] footer pinned.
- L1150 empty -> "Unassigned" (was "N/A") CONFIRM S4-R19.
- L1185-1187 V1 FACT: Edit Customer picker today: no "Unassigned", has search box, absent from New Customer; customer page "N/A".
- L1193 browser walk: New Customer flow; Cancel -> nothing saved; WO-only role opens New Customer from work order: dialog stays open, no Access Denied. ADD (permission).
- L1196 existing case C43575 (sales-rep picker options).

## Tech plan chunk L1200-1444
- L1222 old card keeps working mid-stack.
- L1256-1259 messages: WO "The sales representative cannot be changed on an invoiced or paid work order." part sale "...invoiced or paid part sale." CONFIRM S2-E4.
- L1262 "A part sale has one sales representative." (API only).
- L1264 no-op -> no log (S7-R4).
- L1269-1271 creation-time copy: no status lock, no log (S7-R5); copy from source copies split state.
- L1288 permission WO C&E required for change (S1-N1 CONFIRM). L1405 none -> 403.
- L1305-1311 eligibility only for new ids; S1-N2 message CONFIRM.
- L1332-1333 history view: GET only, no write path (S1-N1).
- L1345-1346 Audit Log SEARCH: Parts rep names (original/new) become searchable. ADD (testable if the Audit Log has a search box).
- L1352 inactive = staff missing OR user missing (in org) OR is_sales_rep=0 OR user inactive. CONFIRM S1-E2.
- L1360 old snapshot blobs default to not split (history view of pre-release WO reads one field).
- L1408 foreign-org rep reads name=null, inactive=true (D4).
- L1414 part sale: rep change, lock message, log entry unchanged.
- L1437 data-saving / aria-busy on group (E2E only).
- L1438 OrderStatusCard: BOTH rep blocks (WO + part sale) use new component; part sale with + off (D18); label "Sales Representative". -> compare PRD S2-N2 context note "no change to how it looks" -> Q.

## Tech plan chunk L1444-1688
- L1475 absent split (old snapshot) = not split.
- L1488 rejected save: interceptor toasts server message; rollback (S1-N3 CONFIRM).
- L1492 after refetch shows what was saved (S1-E1 CONFIRM).
- L1501 pick during save ignored; same value -> no request (S7-R4).
- L1506-1511 single pick sets both sides; addParts copies labor to parts; removeParts keeps labor. CONFIRM S1-R13/S2-R6/S2-R16.
- L1521-1525 label logic: id+inactive+name -> "Name (Inactive)"; no id -> "Unassigned"; else option name; else stored name or ''. => a held id whose name is null (staff gone / cross-org, L1408) shows an EMPTY field on the card. PRD silent for the card (print S6-N1 says Unassigned). -> Q.
- L1528-1530 labels/order CONFIRM S2-R5.
- L1561 engaged counter: S1-R4 stays while popups open.
- L1566 + and x disabled while saving (S1-E1).
- L1568-1570 Labor row keeps an empty action cell; part sale renders no action column -> "visually unchanged".
- L1571 no focus/popup after add (S2-R7).
- L1574-1578 row-gap 16, grid 1fr + 32px, column-gap 16 (S1-R5), static min-height 42px (S1-R4 "same height" = 42px). ADD 42px.
- L1580-1583 split arrow bottom-right; [design-verify] offsets.
- L1586 S2-R14 checked at 100% and 200% zoom. ADD.
- L1594 WO editable = canEditSalesRep && lines loaded.
- L1598 imported card: no rep field today; unchanged (CONFIRM PRD out of scope).
- L1603 V1 FACT: card label today reads "Sales representative" (lower-case r), also on part sale card; becomes "Sales Representative"; "Lead technician / Service advisor untouched" (they read lower case today?). -> part sale label changes too -> vs S2-N2 context note "no change to how it looks". Q.
- L1610 kept test ids for part sale.
- L1647-1651 print: one name when not split OR split with same person (S6-R1 CONFIRM); both empty -> omitted (S6-R4); gone staff -> Unassigned (S6-N1).
- L1657-1665 audit log: split entry reads BOTH sides even when one person holds both (print collapses). ADD (consistent with S7-R3 wording).
- L1670 audit log shows "Unknown" for an unresolved id. ADD -> Q? (PRD silent).
- L1676 browser walk list (as admin and tech; throttled double pick; forced failure; invoiced; history; touch; part sale no +; print & audit log).
- L1677 S1-R6 measured in editable, read-only (invoiced), history, split, Lead Tech read-only branch (no technicians loaded).
- L1678 S3-R6: collapse is below Quasar `md` width (OrderStatusCardMobile), while "phone" for arrows/buttons = hover:none. ADD + minor ambiguity (tablet wider than md).
- L1682 existing part-sale cases C146392, C154877, C146393, C154615, C154618.

## Tech plan chunk L1688-1902
- L1714-1719 WO prefill: labor/parts each only if eligible (active + flagged, L1725); split customer -> split WO even if a side ineligible -> that side Unassigned. CONFIRM S4-R24/25/27.
- L1721 part sale never split. L1734 Counter Sale no special case.
- L1738-1739 copy on Split WO / Split Part Sale / reopen paid WO; MOVING LINES TO AN EXISTING target WO does not touch reps. ADD.
- L1740-1741 Change customer: no change (S4-R28 CONFIRM). L1742-1745 S4-R32 CONFIRM.
- L1747 not touched: sandbox seeder, invoice preview WO, imported WOs.
- L1773 browser walk: customer split A/B/C; new WO opens split A/B with no log entry; new part sale -> C; Counter Sale -> Unassigned; split / reopen copy; change customer -> unchanged.
- L1776 V1 FACT: today a new part sale starts with NO rep (C154617 part b changes); existing C154615, C154618 assert "Unassigned" -> will be affected if base customer has a rep.
- L1828 part sale invoice: own rep, else customer chain (S4-R18 CONFIRM).
- L1831-1834 WO with any rep captured as-is; empty side stays empty (S4-N1 CONFIRM).
- L1836-1837 fallback maps user->staff WITHOUT sales-rep filter (credits switched-off person, S4-R27 note CONFIRM).
- L1843-1844 reversal + re-invoice = new invoice, re-captures (S2-E4 CONFIRM).
- L1845-1848 NFR-004: vehicle's invoices list must not break (500) with a split invoice -> ADD regression check (UI: vehicle page invoices list).
- L1874 browser walk: reverse + re-invoice after changing rep -> new names.
- L1897 mid-stack: SBR productType ignored.

## Tech plan chunk L1902-2071
- L1904-1905 SBR enum labels Labor / Parts / Part Sales in option order (S8-R1 CONFIRM).
- L1907 unknown token -> error (API only).
- L1917-1918 part_sales shop_supplies null when 0 (dash) S5-R15a CONFIRM.
- L1919-1921 summary rows real sums (S5-R16 CONFIRM).
- L1922-1924 Expanded export: "Sales Type" header after PaymentStatus (= "Status"?) in EXPANDED only, never in Summary export. ADD (summary export has no Sales Type column).
- L1925-1930 rep and total rows: Sales Type blank; masked: '' CSV, '—' PDF. CONFIRM S5-R23 (+ADD blank on rep/total rows).
- L1931-1933 export filter line All / None / labels joined ", " in enum order (S8-R3/R4 CONFIRM).
- L1943 none -> no rows (S8-R5).
- L1957 line fees/discounts already netted into labor_sell / parts_sell; invoice_level_adjustments = whole_wo / whole_parts_sale scopes, PROCESSING FEE, legacy invoice.discount rate, subtotal floor. ADD: processing fee is a whole-invoice amount shared by size.
- L1961-1972 share formula: D=|L|+|P|; parts share = round(|A|*|P|/D) half toward zero, sign of A; labor = A - parts. D=0: parts gets A only if labor rep null and parts rep not null; else labor. 
   => S5-R7 rounding rule: parts share is ROUNDED TO NEAREST cent (tie -> labor). PRD "A cent left over by rounding the share goes to the Labor row." ambiguous (truncate vs round). -> Q (arithmetic).
   => S5-R8 "labor side is empty" read as "no labor REPRESENTATIVE". -> ADD clarify / Q.
- L1983 shop supplies (incl. hand typed) to labor (and to part_sales rows) CONFIRM S5-R4.
- L1984 part_sales row gets whole A.
- L1991-1992 P% = part sale.
- L1996 Show Unassigned OFF drops null-rep side rows (S5-R14 CONFIRM).
- L2005 rep_name: current staff name when user in org exists; else captured name (S5-R2 CONFIRM).
- L2006 report inactive flag: staff gone / user gone / switch off / inactive (V1-ish: report marks inactive reps).
- L2007 V1 FACT: rep row Location reads the workplace name, or "Multiple" when the rep's invoices span locations (unchanged).
- L2013 invoice_count distinct (S5-R13/S5-N1 CONFIRM).
- L2020-2021 pagination, totals, Unassigned pin, sort fields unchanged. V1 FACT: Unassigned row pinned.
- L2039 Level-2 invoice rows ordered newest first (created_on DESC), then number ASC (V1-ish).
- L2043-2044 merge only when both sides selected; different people two rows CONFIRM S5-R10/R11/R12.
- L2048 split invoice counts as 2 rows toward the 10k Expanded export cap. ADD (not practical by hand).
- L2051-2056 tech plan recomputes S5-R6 (600/380, Σ980) and S5-E1 (540/-110, Σ430): both add up. My own check agrees.
- L2057-2059 rounding examples: tie L=1.00,P=1.00,A=-0.01 -> Parts 0, Labor -0.01; non-tie L=0.01,P=0.02,A=-1.00 -> Parts -0.67, Labor -0.33.
- L2060-2061 S5-R8 examples.
- L2062-2063 S5-E2 old invoice -> one "labor,parts" row, count 1.
- L2066 Σ rows = totals to the cent; hours DECIMAL rounded once as today.

## Tech plan chunk L2071-2255
- L2075 Sales Type column right after Status in Expanded export and ABSENT in Summary export. ADD.
- L2081/L2111 existing (unsplit) report figures must be unchanged (S5-E2 net).
- L2087-2094 functional list (split X/Y two rows count 1 each; labor Unassigned w/ Show Unassigned off drops; Parts filter alone; none; part sale one row; $0 invoice; negative parts return; cross-org -> captured name with inactive).
- L2103 unknown salesTypes token -> 400 (API only).
- L2118-2119 existing cases C38923, C30277, C30287 (CSV metadata "Product Type: " -> "Sales Type: "; Expanded headers). L2247 C30274.
- L2189 Sales Type off by default; L2192 Sales Type column NOT sortable. ADD.
- L2194 null -> em dash; real zero -> "$0.00" (S5-R15 CONFIRM).
- L2197-2198 old productTypes link ignored -> all three (Release day CONFIRM).
- L2200-2202 chip: label 'Sales Type', selectAll 'All', allSummary 'All', empty 'None', lists names (S8-R3 CONFIRM).
- L2207 Sales Type column after Status and BEFORE Location. ADD (position).
- L2209-2210 rep-name cell and Totals cell span the Sales Type column (no Sales Type on rep/Totals rows). ADD.
- L2218-2219 saved view version '3': one-time reset of columns AND sort (Release day CONFIRM).
- L2220-2221 Empty export / empty state unchanged code paths (S8-R4/R5 CONFIRM; V1 FACT "Empty export" exists).
- L2238 V1 FACT: column selector has 9 columns today.
- L2244 browser walk SBR.

## Tech plan chunk L2255-2393
- L2264-2268 manual checklist: geometry incl. 100/200% zoom + narrow window; touch via hover:none; Slow 3G double pick; release-day checks (10 legacy customers + N/A->Unassigned); permissions (WO C&E-only role creates customer from WO; `tech` sees plain text on card S1-N1). V1 FACT: tech role lacks WO C&E -> plain text.
- L2275-2280 N1: 6h x $100 labor, $400 part, supplies $30, $50 flat TAXABLE whole-WO discount (to avoid non-taxable clamp). Expected A: Labor 600, SS 30, Adj (30), Subtotal 600, parts "—"; B: Parts 400, Adj (20), Subtotal 380, labor/hours/supplies "—"; Σ 980; narrowed chip "Sales Type: Parts".
- L2289 N2 expected; L2297 N3: part sale reads C with no +; L2303 N4; L2308 N5 print header "Sales Representative: A (Parts) · B (Labor)" (V1 FACT: print row label "Sales Representative").
- L2320-2322 TestRail facts: new cases planned by DEV team (N1-N5) into sections 4327, Work Orders - Admin, 50, 299. Automated cases whose spec changes: C30293, C30256, C30255, C154617, C30178, C30174, C30161, C30163, C38923, C30277, C30287, C30274. Wording edits: sections 4309 "SBR — Product Type Filter", 4291 "SBC — Product Type Filter"; C30206, C30107, C43591, C30312 (new WO opens unassigned - contradicts S4-R24), C30265, C30293, C154617.
- L2331-2336 rollback consequences.
- L2345 / L2363 R-8: cross-org rep id now reads "(Inactive)" with no name (SECURITY section) — conflicts with FE label logic L1523 (blank) and print L1644 (Unassigned). Internal inconsistency -> Q.
- L2347 reports keep ROLE_REPORT_VIEW; Sales Type column holds no money.
- L2348 public API: rep-only change does not stamp updated_at.
- L2365 R-10 prefill release-day change; Counter Sale part sales stay Unassigned.
- L2367 R-12 regressions to verify: part-sale rep change, lock message, log unchanged; part-sale invoices captured as before; invoice preview works; accounting CustomerUpdated unchanged; Counter Sale create unchanged; deactivation flow unchanged. -> invariants.
- L2374 Part Sales-only role never requests sales-reps (403 trap) — V1 fact: part-sales-only role cannot load the rep list.
- L2379-2381 CustomerDialog hosts: Customer page, Customers list, WO dialog, PART-SALE dialog. "Without C1 ... AccessDenied ejection for WO-only and part-sales-only roles". Picker guard (L485) = WO view / WO C&E / Customer C&E -> a part-sales-only role opening New Customer from a part sale is not covered by PRD S4 prerequisite (names only WO window). -> Q.
- L2383 SBR remembered view wipe once.
- L2384 old history snapshots/entries render as today.
- L2387-2389 an invoice appears under two reps when both expanded.
- L2390 label case change on WO card.
