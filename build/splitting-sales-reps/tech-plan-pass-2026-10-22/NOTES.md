# Running notes — tech plan pass, 22 Oct 2026 (Rule 134)

Source: `sources/Tech-Plan-Splitting-Sales-Representatives-2026-10-19-upload.md` (278,939 bytes, 2,641 lines; byte-identical to
`sources/tech-plan-2026-10-22/` — `cmp` exit 0, 22 Oct 2026). Read in chunks of at most 400 lines; notes after every chunk.
Compared against PRD v11 (Confluence 919928833, 21 Oct 2026), Chris Ward's answers 1-40, report specs SBR v28 / SBC v21.

Read first (22 Oct 2026): Rules 30, 41, 57, 96, 113, 114, 115, 116, 117 (12 amendments), 122, 130, 134; LESSONS-REGISTER (L-01..L-06);
IDEAL-TEST-CASE-STANDARD; skill 07 (§0, §0a, §0b, §4, §5, §6, steps); INTAKE (setup file NOT linked); PROJECT-STATE; PRD v11 in full
(425 lines); chris-answers.json (40 answers).

Baseline: `python3 authoring/build.py` before any edit → 129 cases, 143 PRD codes covered, 0 PROBLEM lines.

## Chunk 1a — lines 1-200 (read 22 Oct 2026)
- Header: dated 2026-10-14, planned against develop @ 022941e459, PRD v8 (138 ids). Stack Symfony/Vue/Quasar.
- §0 Execution state: 6 Product Qs answered 14 Oct and folded into PRD v8 (Q1 S5-R2 current name; Q2 S1-R4 42px = match LT/SA;
  Q3 S3-R4 arrow always on touch; Q4 design canvas; Q12 S4-R19 rep rows on every customer; Q13 S5-N1 $0.00 row).
  FYIs: pre-2026-07-29 invoices Unassigned (S5-E2); Audit Log access as today; phone card expands with edit button; New Customer rep
  field; 10 legacy customers.
  - TP-0a: box height 42px = LT/SA height → CONFIRM (answer 1; D-02 C666018 quotes S1-R4 + answer 1).
  - TP-0b: S1-R6 16px gaps "verify and fix" in Phase 5 browser walk → CONFIRM (PRD v11 S1-R6, S1-R6a + context note, answer 40; D-01).
  - TP-0c: 10 customers whose rep is not a user of the org (deleted or foreign) → "Unassigned" by the Phase 2 migration → CONFIRM
    (PRD v11 S4-E1 / Release day, answer 19; REL-01 C666003).
- §1 Requirements: verbatim copy of PRD v8 (lines 47-200 = S1..S8-R5). Compared with v11: v8 lacks S1-R6a, S1-E3, S2-E6, S5-R15b, S7-R6
  and the v9-v11 sentences (S2-R17 read-only labels, S2-N2 label, S4-R3 part sale, S4-R20 reactivation, S4-R21 window text, S4-R23 file
  name, S4-N2 (Inactive), S4-E1 10 customers, S5-R6 Adjustments, S5-R7 rounding [v8 "A cent left over ... goes to the Labor row" vs v11
  "Parts row's share is rounded to the nearest cent ... exact half cent the Labor row gets the extra cent"], S5-R8 empty side, S5-R15 0.0
  rule, S5-R19/R23 before Location, S7-R1/R4 examples, S8-R4 other empty exports). All are PRD-version differences: PRD v11 wins (Rule 30)
  and every case already quotes v11 (build.py checks quotes against v11). No case quotes the plan's §1 copy → nothing to change.

## Chunk 1b — lines 201-400 (read 22 Oct 2026)
- 201-207: rest of v8 §1 copy (S8-R6..S8-E1). v8 S8-R9 lacks the "other empty exports" sentence; v8 S8-E1 "remembered" (v11 = saved or
  bookmarked link, answer 29). PRD v11 wins; cases quote v11.
- NFRs (all "introduced by analysis"):
  - NFR-001 tenant-scoped rep joins (D4) → the user-visible part is the cross-org/deleted rep display: plan D4 says "a cross-org id now
    reads "(Inactive)" with no name" → DIVERGES from PRD v11 S1-E3/S7-R6/S6-N1 + answer 5 ("Unassigned"). ALREADY RULED (answer 5, PRD v9).
    Cases S1-11 C690666, S6-05 C665980, S7-05 C690670 follow the PRD. No new question.
  - NFR-002 server-validated customer reps (D5) → S4-23 C665989 (refused when switched off in another tab). D5 also: active + switch
    checked "only for ids the customer does not already hold" → a customer holding a switched-off rep (S4-N2) can still be saved → check
    S4-20 C665959 covers a re-save. (follow-up in case check)
  - NFR-003 no whole-table rewrites; old rows read "not split" → REL-02 C666004 / REL-03 C666005 (observable result only).
  - NFR-004 "Endpoints that select i.* from invoice must not leak the new BINARY(16) column into JSON (the SV-9496 regression class;
    ListVehicleInvoices)" → user-visible symptom: the vehicle's invoice list fails to load. No case covers a vehicle's invoice list. CANDIDATE
    ADD (tech plan alone sources it; PRD silent → Rule 30: sourced). Decide after full read.
- Clarifications table: invoiced/paid refusal for service WOs (S2-09 C665933); contacts re-import keeps reps (S4-22 C665961); New Customer
  from WO window with only WO Create & Edit (S4-24 C665990); customer list A-Z every active rep (S4-01 C665940); SBR saved columns reset
  + old Product Type links open with every Sales Type (REL-05 C666007); Shop Supplies dash on Parts row and Part Sales row own supplies or
  dash (S5-01 C665962, S5-07 C665968); Q1 current name (S5-14 C665975); Q2 42px (D-02); Q3 phone arrow (S3-02, D-18); Q12 no-address
  customer (S4-08 C665947); Q13 $0 side (S5-13 C665974); 10 legacy customers (REL-01). All CONFIRM.
- "What the code already does": rename updates only ONE customer today (`findOneBy`) → S4-R22 must reach EVERY customer → check S4-20
  uses two customers. Customer dropdown today HAS a search box and NO Unassigned → S4-R3 → S4-01/D-10. Split/reopen copy nothing today →
  S2-12 C665936 / S2-13 C665995. Already built: one field, (Inactive), save-as-you-go, read-only gate, 16px gap, "not a sales representative"
  refusal, one-rep log entry, frozen name on invoice, Unassigned bucket, "Empty export" on both reports → regression of today's behaviour,
  all quoted by PRD cases.
- §2 Architecture: unsplit record's Parts side follows its Labor rep; customer child table with primary/service_parts/part_sales; legacy
  company.sales_rep_* frozen; new docs copy eligible customer reps at creation with no log entry (S7-R5 → S4-09 C665948 quotes S7-R5);
  invoice captured once at creation, both sides, staff id + name (S5-R1/R2); report per-side rows, share in integer cents; picker
  /api/sales-reps for both surfaces.
- §3 decisions D1-D22:
  - D3 "leftover cent to Labor" → plan §8.2 per answer 21 = nearest cent to Parts, half cent to Labor = PRD v11 S5-R7 → S5-05 C665966 CONFIRM.
  - D7 refusal message identical to PRD S2-E4 → S2-09 CONFIRM.
  - D8 saved-view version bump, old links fall back to defaults → REL-05 CONFIRM.
  - D10 "Phone" = @media (hover: none), not screen width → answer 10 → S3-04 C690672 CONFIRM.
  - D11 copy eligible customer reps in create handlers, no log entry; split/reopen copy the source; "Service advisor is not copied" →
    S4-09/S4-10/S4-11, S4-15 (eligible only), S2-12/S2-13 CONFIRM. Service advisor not copied = today's behaviour, outside the feature
    (PRD silent; not a product statement of this feature) → EXCLUDED with reason.
  - D14 picker permission (New Customer from WO would eject to Access Denied) → S4-24 C665990 CONFIRM.
  - D15/D21 change-sales-rep optional split; an inactive Labor holder can be copied to Parts (S2-E1/E2/R6) → check S2-07 C665931.
    D21 absent split preserves split for API callers (stale tab, factory); "The FE still always sends split explicitly" → the screen
    behaviour is answer 6 / S2-E6 → S2-14 C690667 CONFIRM. API-only part: not manual-testable (EXCLUDED: API caller only).
  - D16 none/all encoding (empty selection must not arrive as "all") → S8-R5 → S8-01 C665984 (check it covers none selected).
  - D17 "No (Inactive) suffix on customer fields" → DIVERGES from PRD v11 S4-N2 + answer 14 → ALREADY RULED; S4-20 C665959 follows PRD.
  - D18 part sale rep field moves onto the new WO component (label would become "Sales Representative") → DIVERGES; ALREADY RULED
    (answer 7: nothing changes); S2-11 C665935, D-14 C666030 follow PRD.
  - D19/P-6 migration copies a legacy rep only when a user of the org → REL-01 CONFIRM.
  - D20/P-9 report: invoice number "P%" = part sale, everything else = work order (Labor + Parts rows), incl. numbers outside both
    prefixes; default view must include every invoice as today → totals unchanged = REL-03 / S5-09. Invoice numbers are system-assigned,
    so a manual tester cannot make an invoice outside both prefixes → EXCLUDED (not reachable by hand; plan records a prod count).
  - D22 public-API staff rename cascades (regression test only) → manual tester has no public API → EXCLUDED; in-app rename is S4-20.
  - P-5 Sales Follow-Up keeps reading frozen legacy columns; out of scope and does not load → REL-10 C666012 CONFIRM.
  - P-12 customer names from user, WO/invoice names from staff, kept in sync on every rename path → S4-20 / S5-14 CONFIRM.
- §3.2 FE structure: customer + and x always visible (S4-R4) → D-10 C666026 / S4-01; WO hover-revealed, touch always → D-02 / S3-02.
- §4 DB: 3 migrations; open WOs and old invoices read "not split" (REL-02, REL-03). Follow-up column drop: not this release.
- §5 0.1 change-sales-rep: 400 "The Parts sales representative can only be set on a split work order." and "A part sale has one sales
  representative." are "structural, and never reached from the UI" → EXCLUDED (API only). Invoiced service WO 400 = PRD S2-E4 (S2-09).

## Chunk 2 — lines 401-800 (read 22 Oct 2026)
- 0.1 cont.: an id the WO already holds is accepted (inactive holder can stay, move sides, be copied to Parts: S1-E2, S2-E1, S2-R6,
  S2-E2) → S2-07 C665931 (check it adds Parts while Labor holds an inactive person). "An identical (labor, split, parts) tuple writes
  nothing and saves nothing" → S7-03 C665983 CONFIRM.
- 0.2 WO detail: unresolved / foreign id reads name=null, is_inactive=true (D4) → same ruled divergence (answer 5).
- 0.3 customer create/change: primary always present; on change an absent list leaves reps unchanged; names never client-supplied;
  "A `user_id` the customer does not already hold on any side must also be an active user with a staff row flagged `is_sales_rep`.
  Both failures return 400 "The selected staff member is not a sales representative."" → S4-23 C665989 CONFIRM (message on screen).
  "already hold on any side" → a customer holding a switched-off rep can be saved again, and that person can be copied into Service Parts
  (S4-R7 + S4-N2). Check S4-20 C665959 (it covers re-save?). CANDIDATE.
- 0.4 customer view: is_active / is_sales_rep "the FE does not render them (D17 — no "(Inactive)" on customer fields)" → ruled divergence
  (answer 14, PRD v11 S4-N2). Legacy keys dropped (not user-visible).
- 0.5 history log: existing fields = Labor/one side; "`null` split (every entry before this release) reads as not split" → an entry written
  before the release keeps reading the one name. PRD v11 S7-R2 ("A work order that is not split reads the one name"). No case shows a
  pre-release entry. CANDIDATE (needs data from before the release → HOLD like REL-01..06).
- 0.6 SBR: param salesTypes all/none/subset; unknown token 400; "A stale `productType` is ignored" → REL-05 C666007 CONFIRM.
  Masking: labor row → parts cols null; parts row → hours/labor/shop supplies null;
  "`part_sales`: `shop_supplies` = null when it is 0 ("a dash when it has none"). Every other field is numeric." → TWO DIVERGENCES from
  PRD v11: (1) S5-R15a + answer 25 say "$0.00 shows only when a shop supplies charge of $0.00 is on it" (the plan dashes any 0);
  (2) S5-R15b + answer 39 say Labor Delta / Labor Invoiced / Labor Margin show a dash on a Part Sales row (the plan keeps them numeric).
  Both RULED after the plan (answers 25, 39; PRD v9, v11) → cases S5-07 C665968, S5-18 C715271, REL-16 C715272, D-15, D-16 follow PRD.
  Check S5-07 has the $0.00-charge state. Report both to the QA lead (Rule 30).
  "`adjustments`, `margin`, `subtotal` and `margin_pct` are never masked" → check S5-01 (Adjustments/Margin/Subtotal show numbers on both
  rows). "`labor,parts`: every field is numeric" = S5-R15 0.0 rule → S5-08 C665969.
  `invoice_count` = COUNT(DISTINCT invoice) → S5-R13 → S5-01 / S5-08 CONFIRM.
  Export: Sales Type column right after Status, values "Labor"/"Parts"/"Part Sales"/"Labor, Parts" "(blank on rep and total rows)"; masked
  cells blank in CSV, em dash in PDF → S5-12 C665973 / S5-15 C665991 / D-16 (check "blank on rep and total rows" is tested).
  Filter line "Sales Type: All/None/Labor, Parts"; "None" defensive only → S8-02 C665985 CONFIRM.
- 0.7 SBC export caption "Sales Type", values All Sales / Part Sales only / Service Sales only → S8-04 C665987 CONFIRM.
- 0.8 picker: unpaginated, A-Z, guard widened to WO view, WO create & edit, customer create & edit; "There is no separate part-sale
  create/edit permission constant" → the plan gives a part-sales-only user no right to load the list; PRD v11 Story 4 prerequisites +
  S4-R3 + answer 16 say the list shows → RULED (answer 16 was asked for exactly this) → S4-25 C690668 follows PRD. Report to QA lead.
- 0.9 unchanged: /api/staff, sales-rep-assignments count only, assignments export route + Side column.
- §6 phases table; DoD gates; browser walk logs in as admin / tech (QUICK_LOGIN) — internal.
- Phase 1 (SBC relabel + shared pieces): D9 32px button, Lucide plus/x 20px, tooltip suppressed while active (S2-R3) → D-04 C666020;
  FilterChip opt-in "summaryListsNames": "a list must never cut a name" → S8-01 C665984 (check "Sales Type: Labor, Part Sales" text in full).
  Browser walk: "any report other than SBC (e.g. `/reports/parts-velocity`) — every chip text unchanged (opt-in proof)"; D9 "the shared
  chip must not change on ~15 other screens" → NO CASE covers another report's filter chip after the shared-chip change (Rule 96 collateral
  risk on a shared component). → NEW CASE NEEDED (REL-17, cited to tech plan D9 + Phase 1 browser walk).
  SBC walk: All Sales / Part Sales / No sales + empty state + Export "Empty export"; old ?productTypes=parts URL opens Part Sales; CSV/PDF
  filter line → S8-03 C665986, S8-04, REL-06 C666008, S8-12 CONFIRM.
- Phase 2: mid-stack "every customer page reads N/A" (never released; D13) → not a release behaviour, no case.
  3.1 migration: one primary row per company; P-6 org-only copy (REL-01). 3.2 domain: new customer = one primary row Unassigned (S4-R31
  Counter Sale, S4-E1); part-sale following rule (S4-R12/R13/R18/R26) → S4-04/S4-06/S4-11/S4-12 CONFIRM; removeSalesRepresentativeUser:
  primary/service_parts set to Unassigned and kept, part_sales row removed (S4-R20) → S4-18 C665957 CONFIRM; change() drops reps (S4-N3) →
  S4-22 C665961 CONFIRM.

## Chunk 3 — lines 801-1200 (read 22 Oct 2026)
- D22 public-API rename regression test → EXCLUDED (manual tester has no public API); ChangeSalesRepName deleted, names read live → S4-R22.
- 3.3 policy: "(1) every non-null id must be in `usersInOrganization`. (2) Every id not in `$current?->holdsSalesRepresentative()` must
  be in `eligibleSalesRepresentativeUserIds`." "One unowned id fails the whole request" → on screen: a refused customer save saves
  nothing → check S4-23 C665989 says nothing is saved.
- 3.5 write paths: create without list = primary Unassigned (S4-R2 → S4-02); contacts re-import drops nothing (S4-N3 → S4-22); public API /
  sandbox / Counter Sale create paths give one primary Unassigned row (S4-R31 → S4-13 C665952; public API out of scope); deactivation
  subscriber per-field removal (S4-R20 → S4-18); warning count = COUNT(DISTINCT company) over all fields, org-scoped (S4-R21 → S4-19).
- 3.6 read paths: view in window order with live names, Unassigned primary synthesized (S4-R19 → S4-08, D-12). InvoiceSalesRepResolver:
  "The "user has no staff row" branch now returns `(null, null)`" (ENG-Q2: 0 such customers in prod) → not reachable by hand → EXCLUDED.
- 3.6b picker: users with only Customer Create & Edit or only WO Create & Edit get the list (200); with none of the three → refused
  (403). On screen: S4-24 C665990 (WO-only user, New Customer from a work order) CONFIRM; customer-only user opening Edit Customer sees the
  list → S4-01 runs as Admin; a customers-only role is not a separate case. The PRD prerequisite already names 'Customers — Create & Edit'
  → covered by S4-01's role line? (check in case pass; candidate precondition note only).
- 3.7 tests restate the PRD rules (S4-R7, R11, R12, R13, R14, R18, R26, E2, R20, R21, R22, N2, N3, R31). New, plan-only statements:
  "An already-held unflagged id saves (S4-N2)" → a customer that already holds a switched-off rep can be edited and saved → check S4-20.
  "Rename the user, then the view shows the new name on every customer holding them (S4-R22)" → today only ONE customer is updated
  (`findOneBy` bug) → S4-20 must use two customers → check.
  "A user in primary on A, service_parts on B and part_sales and primary on C counts 3 (S4-R21)" → S4-19 C665958 (check it has a customer
  with two fields and two others).
  "a rep-only change does NOT stamp `company.updated_at`" → no visible field shows it on the customer page → EXCLUDED (not visible).
- 4.1 Assignments export: one row per (customer, user); Side labels "Parts and Service" / "Service Labor" / "Service Parts" / "Part
  Sales", joined ", " in window order → S4-21 C665960 CONFIRM. Plan-only: "ORDER BY LOWER(co.name), LOWER(sales_rep_name)" (rows by
  customer name, then representative name); ""Active?" keeps today's meaning (staff exists AND user active)"; "Rows are keyed by user id
  rather than name" (two people with the same name stay two rows). Check S4-21 covers order; candidate CHANGE.
- 4.2 history snapshot: "Nothing on the read-only historical card reads the customer's reps (the WO card reads `workOrder.sales_rep_*`)"
  → history card shows the work order's own reps → S2-08 C665932 CONFIRM.
- E2E references name existing TestRail cases C30293, C30256, C30255, C154617, C43575 (customer factory / assignments export / picker
  options): check they are on EXISTING-CASES-THAT-WILL-BREAK-2026-10-19.md; if not, report (not ours to edit in this pass).
- Phase 3 FE: CustomerSalesRepFields (no search, Unassigned first, + always shown, x tooltips, no popup after add, draft until Save);
  customer page rows outside the address check, "N/A" → "Unassigned" → S4-01..S4-08, D-10..D-13 CONFIRM.
  "[design-verify] if "buttons" means Save/Cancel: confirm the footer stays pinned …" → PRD v11 S4-R4 names "the + and the remove x" → no
  ambiguity left → no question.
  Phase 3 browser walk (New Customer field, add Service Parts / Part Sales, remove, Cancel saves nothing, Save lists rows, Edit round-trip,
  WO-only user from New Work Order, phone emulation) → S4-02, S4-03, S4-04, S4-05, S4-06, S4-07, S4-08, S4-24, S3-03 CONFIRM.

## Chunk 4 — lines 1201-1600 (read 22 Oct 2026)
- Phase 4 (BE WO split model): D7 lock message for service WO = PRD S2-E4 → S2-09 CONFIRM; part sale keeps "…on an invoiced or paid part
  sale." (Part Sales Update v1, unchanged; not this feature's text). "A part sale has one sales representative." → API only, EXCLUDED.
  "The "opened from its history" read-only state (S1-N1) has no server write path" → S2-08 (screen only) CONFIRM.
  Change handler: S1-N2 only for new people; held ids pass (S1-E2, S2-E1, S2-R6, S2-E2) → S2-07; one save writes one log entry, no-op
  writes none → S7-01, S7-03 CONFIRM.
- 5.4 audit log: "add `originalPartsSalesRepName` and `newPartsSalesRepName` to the searchable fields" → S7-04 C665994 CONFIRM (quotes it).
- 5.5 detail read (D4): foreign / missing id reads name=null, inactive=true → ruled divergence (answer 5); "Old snapshot blobs lack these
  keys and get the defaults" → a work order opened from its history before the release reads one field → covered by REL-02 logic; history
  card plain text → S2-08.
- 5.6 tests restate PRD rules. Plan-only: "A foreign-org WO id returns 404" / permission 403 → API only, EXCLUDED.
- Phase 4 smoke / browser walk: "confirm a part sale's rep change, lock message and log entry are unchanged"; "the existing (pre-Phase 5)
  card still changes the rep on a work order and a part sale; the Audit Log shows "Sales representative changed"" → regression of the
  part sale's own field (PRD v11 S2-N2: "its look and behavior do not change"). D18 moves the part-sale field onto the new component →
  collateral risk. Check S2-11 C665935 runs a pick on the part sale (saves, no +, log entry). CANDIDATE CHANGE.
- Phase 5 FE card: both rep blocks on OrderStatusCard use the new component; part sale with + off (D18) and "label "Sales
  Representative"" → ruled divergence (answer 7) → S2-11 / D-14 follow PRD ("Sales representative").
  useWorkOrderSalesReps: no optimistic cache write; a pick during a save is dropped (S1-E1); failure → toast + last saved value (S1-N3);
  same state → no write (S7-R4) → S1-10 C665924 (HOLD, developer check), S7-03 CONFIRM.
  labelFor: "(Inactive)" only for the held id with a name; no id → "Unassigned"; an id with no name → '' (empty) → ruled divergence
  (answer 5: "Unassigned"), S1-11 follows PRD.
  Field geometry: 16px row gap, 32px action column, 16px column gap (S1-R5/R6); "min-height:42px" (S1-R4, answer 1); split arrow bottom-right
  (S1-R11); Labor row keeps an empty action cell so both boxes end at the same x (S2-R10); part sale: no action column at all ("the
  part-sale card is visually unchanged") → D-01, D-02, D-05, D-06, D-14 CONFIRM.
  "S2-R14 check: at 100% and 200% zoom in the browser walk, neither long label truncates" → PRD S1-R11 "narrow or zoomed screen", S2-R14
  "never cut off". Check whether D-05 C666021 / S2-01 C665925 has a zoom step. CANDIDATE CHANGE.
  "Neither Select is focused or opened after add (S2-R7)" → S2-01 CONFIRM.
  OrderStatusCard: "Imported card: no rep field today; unchanged." → REL-07 C666009 CONFIRM.

## Chunk 5 — lines 1601-2000 (read 22 Oct 2026)
- OrderStatusCard: "Label case: "Sales representative" -> "Sales Representative" (PRD wording; Lead technician / Service advisor
  untouched)" → work order card: = PRD S1-R2 ("Sales Representative") → S1-01 CONFIRM; read-only LT/SA labels unchanged = S2-R17 +
  answer 8 → S2-08 / D-08 CONFIRM; part sale: ruled divergence (answer 7).
- P2 tests: "pick while pending -> no second request AND `shown` never shows the ignored id" → S1-E1 → S1-10 (HOLD developer check) CONFIRM.
  "part sale never shows the + button" → S2-11 CONFIRM. Split WO two fields; history mode / restricted status read-only → S2-08.
- P3 print: "one person both sides (split or not) -> one name; inactive -> "(Inactive)"; two people -> "A (Parts) · B (Labor)"; inactive
  side -> "(Parts, inactive)"; one empty side; gone staff on one side -> Unassigned; both empty -> no row" → S6-01..S6-05. Plan-only
  detail: a SPLIT work order with the SAME person on both sides prints the one name (`samePerson = !split || ids equal`) = PRD S6-R1 "when
  one person holds both sides" → check S6-01 C665976 uses a split work order with one person on both sides (CANDIDATE CHANGE).
- P3 audit log: "a split entry reads both sides even when one person holds both (S7-R3 …; S6-R1 collapses only on paper)" → S7-01
  (answer 31 example) CONFIRM. AuditLogDialog test: ""Unknown" for an unresolved id" → ruled divergence (answer 5 / S7-R6 "Unassigned");
  S7-05 C690670 follows PRD.
- Phase 5 browser walk: "throttled double-pick; forced failure" (S1-10 HOLD); "invoiced read-only; history read-only; touch emulation; part
  sale unchanged with no +; print and Audit Log for unsplit / split / one-empty / inactive" → S2-08, S3-02, S2-11, S6-*, S7-* CONFIRM.
  "Check S2-R14 (labels never cut) at 100% and 200% zoom and in a narrow window" → CANDIDATE CHANGE (D-05 / S2-01: is there a zoom step?).
  "S1-R6 gap measurement … in all of: the editable card, the read-only card (invoiced), the history card, the split card (Labor + Parts),
  and a card where Lead Technician falls back to its read-only branch (no technicians loaded). Every gap must be 16px." → D-01 C666017
  (check which states it measures; history card and "no technicians" state are plan-only additions). CANDIDATE CHANGE.
  "S3-R6 (phone collapse) … below `md` … collapsed `OrderStatusCardMobile` … until its edit button expands" → S3-01 C665937 CONFIRM (width
  decides collapse, answer 10).
- E2E reference check: part-sale cases C146392, C154877, C146393, C154615, C154618 (keep their locators). "The label case change … breaks
  no current locator" (answer 7 keeps the label anyway). Check against EXISTING-CASES-THAT-WILL-BREAK.
- Phase 6 (prefill / copy): eligible staff only (S4-R27 → S4-15); create handlers write no log entry (S7-R5 → S4-09 quotes S7-R5);
  part sale create = Part Sales → Service Parts → one rep chain; Counter Sale no special case (S4-13); copy on Split Work Order, Split Part
  Sale and reopening a paid work order incl. split state (S4-R29 / S2-E5); "Moving lines to an EXISTING target WO does not touch reps"
  (S2-13 C665995 quotes it) CONFIRM; ChangeCustomer untouched (S4-R28 → S4-14); S4-R32 (S4-14) CONFIRM; preview WO and imported WOs not
  touched (REL-07).
  Browser walk: "set a customer to split (Labor A, Service Parts B, Part Sales C); New Work Order → the card opens split A/B with no log
  entry; new part sale → C; Counter Sale part sale → Unassigned; Split Work Order and reopen a paid work order → reps copied; change the
  work order's customer → reps unchanged." → S4-10, S4-11, S4-13, S2-12, S4-14. Reopening a paid work order and Split Part Sale: check
  S2-12 covers them; if not, CANDIDATE NEW CASE(S) (PRD S4-R29 names all three routes).
  E2E: C154617 part (b) "sale A now *starts* with the customer's rep" (S4-R26 behaviour change); C154615 / C154618 assert "Unassigned"
  (fixture hygiene) → check WILL-BREAK list.
- Phase 7 (invoice capture): part sale with no rep → customer chain (S4-R18 → S4-12); WO with anyone on either side captured as is, empty
  side stays empty (S4-N1, S2-N1 → S4-17); nobody → customer per side (S4-R17 → S4-16); "NO is_sales_rep filter: the S4-R27 context
  note" (S4-15 CONFIRM); reversal + re-invoice re-captures (S2-E4 → S2-10 CONFIRM).
  NFR-004 / ListVehicleInvoices: "`i.*` picks up the new BINARY(16) column, which breaks `json_encode` and 500s the vehicle invoices
  list. This is the SV-9496 regression class." Smoke: "plus the vehicle invoices list on a vehicle that has a split invoice (must be 200),
  invoice preview, a part-sale invoice." → NO CASE opens the vehicle's invoice list or an invoice preview after a split invoice →
  NEW CASE NEEDED (REL-18, cited to tech plan NFR-004 + Phase 7 smoke).
- Phase 8 (SBR BE): Sales Type column "inserted **after `PaymentStatus`** in `expanded()` only, never in `summary()`" → S5-15 C665991
  CONFIRM; "invoice rows fill `SalesType` from `exportLabel()`, and rep and total rows leave it blank" → S5-15 (check); null = '' in CSV,
  "—" in PDF → S5-12 / D-16 CONFIRM. Filter line All / None / names in enum order → S8-02.
  Line fees: "an invoice with a labor-line discount and a part-line fee credits each to its own row and leaves `adjustments` for the
  whole-invoice amount only" → S5-16 C665992 CONFIRM.
  (b) arithmetic: share by size, exact floor, "round half TOWARD ZERO: a tie cent stays with Labor (S5-R7)"; D = 0 → whole amount to
  Parts only when Labor has no rep and Parts has one (S5-R8, answer 23); "Σ shares == A exactly (S5-R14)" → S5-03, S5-04, S5-05, S5-06,
  S5-17 CONFIRM. NonVoid filter (today) and Show Unassigned OFF drops a side with no rep → S5-09 CONFIRM. P-9 prefix → EXCLUDED (see 1b).

## Chunk 6 — lines 2001-2400 (read 22 Oct 2026)
- 8.2(c) Level-1: rep name = current staff name, captured name only when the staff row is gone (S5-R2 → S5-14 CONFIRM for the rename half);
  "Multiple" location and inactive flag = today's behaviour (unchanged). COUNT(DISTINCT invoice) (S5-R13, S5-N1 → S5-13).
- (d) Level-2 merge to "labor,parts" only when both sides selected (S5-R10, S5-R12); different people always two rows (S5-R11) → S5-01,
  S5-08, S8-01 CONFIRM.
- (e) "A split invoice now counts as 2 rows toward the 10k Expanded cap (§10 R-9)" → needs about 10,000 invoice rows → EXCLUDED (not
  reachable by hand; cap behaviour unchanged in kind).
- (f) worked checks: S5-R6 ($600/$400/$30/($50) → ($30)/($20), $600 + $380 = $980) → S5-03; S5-E1 → S5-04; "S5-R7 tie: L=100, P=100,
  A=−1 … PARTS=0 and LABOR=−1: the leftover cent goes to Labor ✓" (labor $1.00, parts $1.00, discount ($0.01) → Parts $0.00, Labor ($0.01))
  → PRD v11 S5-R7 "On an exact half cent the Labor row gets the extra cent" + answer 21 → check S5-05 C665966 tests a half-cent case
  (Rule 116 rounding hazard). CANDIDATE CHANGE. Non-tie L=1,P=2,A=−100 → Parts −67, Labor −33 = PRD example → S5-05.
  "S5-R8: L=P=0, A=500. With LR=X, labor gets 500. With LR=null and PR=Y, parts gets 500. With both null, the (Unassigned) labor row gets
  500" → check S5-06 C665967 covers all three. S5-E2/P-11 old invoice one "Labor, Parts" row → REL-03 CONFIRM. "Σ rows = totals holds to
  the cent" → S5-17 CONFIRM.
- 8.4 tests restate PRD; "A cross-org staff id on an invoice gives a null live name and falls back to the captured name with inactive set
  (D4)" → PRD v11 S5-R2 second half ("it shows the captured name only when the staff record no longer exists") has no case that tests it
  (S5-14 tests only the rename). A staff record stops existing only through a data repair (answer 30, Story 6 context note) → NEW CASE
  NEEDED as a developer check (S5-19, AUTOMATION: HOLD, like S1-11 / S6-05 / S7-05).
- Phase 9 FE: chip "All" / "None" / names, "summaryListsNames" (S8-R3) → S8-01; column selector Sales Type first and off, after Status
  before Location (S5-R19..R22) → S5-11 C665972; "`identifierColumnCount` … so the merged rep-name cell and the Totals cell span it (a rep
  row and Totals have no single Sales Type …)" → plan-only: with the column on, the representative's row and the Totals row show no Sales
  Type value → check S5-11 (CANDIDATE CHANGE). Remembered view version '3' one-time reset (REL-05); old productTypes link ignored → all
  three (REL-05); empty state / Empty export unchanged code paths (S8-01, S8-02).
  Browser walk: "A split invoice shows under both reps with dashes on the uncredited side and real sums on the rep rows" → S5-01 CONFIRM;
  "Expanded CSV/PDF carry Sales Type after Status with blank / dash cells" → S5-12 CONFIRM.
- §7 Testing strategy: N1 uses "a whole-work-order $50 flat **taxable** discount (avoids the non-taxable clamp)" → the non-taxable floor
  adjustment (PRD v11 S5-R6 sentence 2 "The adjustment that stops a non-taxable discount from taking the subtotal below zero is a
  whole-invoice amount and is shared the same way.") → check a case tests that adjustment (S5-03/S5-16). CANDIDATE.
  N1-N5 flows = S5-01, S2-01/S2-04/S2-05/S2-08, S4-03/S4-04/S4-08/S4-10/S4-11, S4-24, S6-02 CONFIRM.
  Manual checklist: (1) geometry at rest / hover / dropdown or + menu open / keyboard focus; "100% and 200% zoom; a narrow window" →
  CANDIDATE (see chunk 4); (2) touch → S3-*; (3) "Throttled network (Slow 3G): a second pick during a save is ignored with no flash; + / x
  disabled until the save finishes (S1-E1)" → needs browser developer tools → S1-10 stays AUTOMATION: HOLD (Rule 114) CONFIRM; (4) release
  day checks → REL-01..REL-05 CONFIRM; (5) WO-only role New Customer (S4-24) and "`tech` sees plain text on the card (S1-N1)" → S1-06 CONFIRM.
- TestRail sync (plan's own list of EXISTING cases that change): automated C30293, C30256, C30255, C154617, C30178, C30174, C30161, C30163,
  C38923, C30277, C30287, C30274; wording edits C30206, C30107, C43591, C30312, C30265, sections 4309 / 4291. → compare with
  EXISTING-CASES-THAT-WILL-BREAK-2026-10-19.md (report only; other suites; Rule 38/123: not edited here).
- §8 rollback → not testable. §9 security: "A rep id pointing at another organization's staff now reads "(Inactive)" with no name
  (intended)" → ruled divergence (answer 5). "Reports keep `ROLE_REPORT_VIEW`" → REL-13 C666015 CONFIRM. "The public API still exposes no
  rep" → PRD out of scope (no API for a manual tester) EXCLUDED.
- R-1 vehicle invoices list 500 → NEW CASE REL-18 (chunk 5). R-8 = D4 (ruled). R-10 prefill = S4-09..S4-11. R-11 Sales Follow-Up = REL-10.
  R-12 regressions: "the part-sale rep change, lock message and log are unchanged; part-sale invoices are captured as before; invoice
  preview works; the accounting `CustomerUpdated` payload is unchanged (it reads no rep); the Counter Sale create is unchanged; the
  deactivation flow is unchanged" → part sale: S2-11 (check), S5-07 (part sale credited); preview → REL-18; accounting → REL-11 (QuickBooks
  gets no rep) CONFIRM; Counter Sale → S4-13; deactivation → S4-18.
- FE risks: OrderStatusCard shared by three card types (part-sale pick + refetch; Part Sales-only role; imported card unaffected;
  vehicle-here toggle, lead tech, advisor untouched) → S2-11, REL-07; "CustomerDialog is shared by four hosts (Customer page, Customers
  list, WO dialog, part-sale dialog) … verify the Customers-list redirect after create and the contact dialog chain still run" → today's
  flow, not described by any source we hold (no quotable expected result, Rule 58) → EXCLUDED here; reported to the QA lead as a
  regression note for the Customers suite. FilterChip ~15 screens → REL-17 (new). "SBR remembered-view bump wipes every user's SBR columns
  and sort once" → REL-05. "Old history entries lack C4 fields; rendered as today" → pre-release log entry (chunk 2 CANDIDATE). "Label case
  change … on the WO card" → S1-01 CONFIRM.

## Chunk 7 — lines 2401-2641 (read 22 Oct 2026; end of file)
- §10 traceability table (lines 2393-2624): one row per PRD v8 id x phase x layer x files, all "Planned"; S1-R6 "Planned — verify-and-fix
  (Section 0)". No testable statement beyond the phase text already noted. It maps v8 ids only (no S1-R6a, S1-E3, S2-E6, S5-R15b, S7-R6:
  those came in PRD v9-v11 after the plan) → the plan does not trace the 5 newer codes; our cases cover them (C690666, C690667, C715271,
  C690670, D-01). Reported as an observation, not a case change.
- §11 verification tickets SV-11384..SV-11392 (one per phase, Nemanja Djuric) → already in TICKET-LEDGER (verify tasks). No testable
  statement.

## Reading coverage
Lines 1-2641 of 2,641 read (chunks 1-200, 201-400, 401-800, 801-1200, 1201-1600, 1601-2000, 2001-2400, 2401-2641): 100%.
