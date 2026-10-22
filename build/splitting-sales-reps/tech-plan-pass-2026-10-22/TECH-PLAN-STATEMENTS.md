# Tech plan: every testable statement, with its verdict (22 Oct 2026, Rule 134 / Rule 115)

**Source:** `sources/Tech-Plan-Splitting-Sales-Representatives-2026-10-19-upload.md` ("Splitting Sales Representatives — Technical
Implementation Plan", dated 14 Oct 2026, planned against PRD v8), 278,939 bytes, 2,641 lines; the 22 Oct 2026 upload is byte-identical
(`cmp` exit 0). Read in full (READING-RECORD.md). Compared with PRD v11 (Confluence 919928833, 21 Oct 2026), Chris Ward's answers 1-40,
the Sales By Representative spec v28 and the Sales By Customer spec v21. Where the plan and the PRD differ, the PRD wins (Rule 30) and the
difference is reported to the QA lead.

**Verdicts:** CONFIRM (a case already covers it, named) · ADD (new case written, cited to the plan, quoted word for word) · CHANGE (an
existing case rewritten to cover it) · DIVERGE (plan conflicts with PRD v11 or an answer; ruled = the ruling is named; unruled = new
question) · EXCLUDED (not testable by a manual tester, with the reason).

**Totals:** 72 statements (TP-01 … TP-72) plus one ambiguity (Q-41). Several rows carry more than one verdict (a CONFIRM part and an
ADD/CHANGE/EXCLUDED part). They lead to 9 new cases (ADD), 6 cases changed in content (CHANGE), 6 distinct divergences, all already ruled
(raised in TP-05, TP-18, TP-21, TP-22, TP-33 and TP-54), 1 new question (41), 12 EXCLUDED parts (each with its reason) and 5 rows that are
informational only (TP-04, TP-31, TP-36, TP-38, TP-72). Every other statement is CONFIRMED by the case named.

| # | Plan statement (where) | Verdict | Case(s) |
|---|---|---|---|
| TP-01 | Box height = Lead Technician / Service Advisor, 42 px (§0 Q2; Phase 5 CSS "min-height:42px") | CONFIRM | D-02 C666018 (answer 1) |
| TP-02 | S1-R6 16 px gaps "verify-and-fix"; measured in the editable, read-only (invoiced), history, split and "Lead Technician falls back to its read-only branch (no technicians loaded)" cards (§0; Phase 5 verification) | CONFIRM D-01, D-05, D-08; ADD history card → **S2-15**; LT-fallback state EXCLUDED (no defined manual way to reach "no technicians loaded"; the plan measures it with DevTools) | D-01 C666017, D-05 C666021, D-08 C666024, S2-15 (new) |
| TP-03 | 10 legacy customers whose rep is not a user of the org become "Unassigned"; one primary row per company (§0, D19, P-6, Data migrations) | CONFIRM | REL-01 C666003 (answer 19, S4-E1) |
| TP-04 | §1 is a verbatim copy of PRD **v8**; v9-v11 changed 20+ requirements and added S1-R6a, S1-E3, S2-E6, S5-R15b, S7-R6 | Informational: cases quote PRD v11 (build.py checks every quote against v11) | — |
| TP-05 | A rep id that is not a user of the organization reads "(Inactive)" with no name on the card (D4, §5 0.2, §9, R-8); the card label resolves to '' (Phase 5 `labelFor`); the audit log test expects "Unknown" (P3 tests) | **DIVERGE, RULED** by answer 5 and PRD v11 S1-E3 / S6-N1 / S7-R6 ("Unassigned") | S1-11 C690666, S6-05 C665980, S7-05 C690670 follow the PRD |
| TP-06 | Customer rep ids validated server-side; a new id must be an active sales rep; message "The selected staff member is not a sales representative."; ids the customer already holds pass (NFR-002, D5, §5 0.3, §3.3) | CONFIRM S4-23; CHANGE **S4-20** (save a customer still holding a switched-off rep: "An already-held unflagged id saves (S4-N2).") | S4-23 C665989, S4-20 C665959 |
| TP-07 | No backfill; old work orders and invoices read "not split" (NFR-003, D1, D2, P-11) | CONFIRM | REL-02 C666004, REL-03 C666005, REL-14 C666016 |
| TP-08 | New invoice columns must not break the vehicle's invoice list (NFR-004, §7.2, R-1, Phase 7 smoke "the vehicle invoices list on a vehicle that has a split invoice (must be 200), invoice preview") | ADD | **REL-18** (new) |
| TP-09 | Clarifications table: invoiced/paid refusal on service WOs; contacts re-import keeps reps; New Customer from a WO with WO-only rights; A-Z every active rep; saved columns reset, old Product Type links show every Sales Type; Shop Supplies dash; Q1 current name; Q12 no-address customer; Q13 $0 side | CONFIRM | S2-09, S4-22, S4-24, S4-01, REL-05, S5-01/S5-02/S5-07, S5-14, S4-08, S5-13 |
| TP-10 | "What the code already does": a rename updates only ONE customer today (`findOneBy`); customer dropdown has a search box and no Unassigned today; split / reopen copy nothing today | CHANGE **S4-20** (two customers); CONFIRM S4-01, D-10, S2-12; ADD **S2-16** (reopen), **S4-27** (Split Part Sale) | S4-20, S4-01, D-10, S2-12, S2-16 (new), S4-27 (new) |
| TP-11 | Architecture: new documents copy the customer's eligible reps at creation with no log entry; invoice captures both sides once | CONFIRM | S4-09 C665948 (S7-R5), S4-10, S4-11, S5-01, S2-10 |
| TP-12 | Share by size in integer cents, nearest cent to Parts, a tie cent to Labor, S5-R8 empty-side rules, Σ shares = whole amount (D3, §8.2 (b)) | CONFIRM | S5-03, S5-04, S5-05 (has the half-cent invoice), S5-06 (all three variants), S5-16, S5-17, DR-07 C690664 |
| TP-13 | D7 refusal message on an invoiced or paid work order | CONFIRM | S2-09 C665933 |
| TP-14 | D8 saved-view version bump (one-time reset of columns and sort) | CONFIRM | REL-05 C666007 |
| TP-15 | D9 shared filter chip changes are opt-in: "the shared chip must not change on ~15 other screens"; Phase 1 walk on another report | ADD | **REL-17** (new) |
| TP-16 | D10 touch = no mouse pointer decides the buttons; width decides collapse; LT / SA keep tap-to-reveal | CONFIRM | S3-01, S3-02, S3-04, D-18, REL-12 (answers 9, 10, 11) |
| TP-17 | D11 copy eligible staff only; "Service advisor is not copied (out of scope)" | CONFIRM S4-09..S4-11, S4-15; service advisor EXCLUDED (not part of this feature; PRD silent; today's behaviour, untouched) | S4-09, S4-10, S4-11, S4-15 |
| TP-18 | D14 / §5 0.8 / §3.6b / §9: picker opens to WO view, WO create & edit and customer create & edit; "There is no separate part-sale create/edit permission constant" | CONFIRM S4-24; ADD **S4-28** (customers-only role); **DIVERGE, RULED**: the plan gives a part-sales-only user no right to load the list; PRD v11 S4 prerequisites / S4-R3 and answer 16 say the list shows | S4-24 C665990, S4-28 (new), S4-25 C690668 follows the PRD |
| TP-19 | D15 / D21 / §5 0.1: held ids pass, so an inactive holder is copied onto Parts; an absent `split` keeps the split for API callers; "The FE still always sends `split` explicitly" | CHANGE **S2-07**; CONFIRM S2-14 (answer 6); API-only part EXCLUDED (no API for a manual tester) | S2-07 C665931, S2-14 C690667 |
| TP-20 | D16 "none" must not arrive as "all" | CONFIRM | S8-01 C665984 (step 4) |
| TP-21 | D17 "No "(Inactive)" suffix on customer fields"; §5 0.4 flags not rendered | **DIVERGE, RULED** by answer 14 / PRD v11 S4-N2 | S4-15, S4-20 follow the PRD |
| TP-22 | D18 the part sale's field moves onto the new component; Phase 5 "Label case: "Sales representative" -> "Sales Representative"" for both blocks | **DIVERGE, RULED** by answer 7 / PRD v11 S2-N2 | S2-11, D-14 C666030, DR-02 C690659 follow the PRD |
| TP-23 | D20 / P-9 part sale = invoice number "P%", every other invoice = work order | EXCLUDED (invoice numbers are system-assigned; a tester cannot make one outside both prefixes); default totals unchanged is REL-03 | REL-03 |
| TP-24 | D22 public-API rename cascades (regression test only) | EXCLUDED (no public API for a manual tester; PRD out of scope); in-app rename = S4-20 | S4-20 |
| TP-25 | P-5 / R-11 Sales Follow-Up keeps the frozen legacy columns; out of scope, not loadable | CONFIRM | REL-10 C666012 |
| TP-26 | P-12 names read live; staff and user names stay in sync on every rename path | CONFIRM | S4-20, S5-14 |
| TP-27 | §3.2 customer + / x always shown; work order hover-revealed (touch: always); part sale renders no action column | CONFIRM | S4-01, D-10, D-02, D-14 |
| TP-28 | §5 0.1 400 messages "The Parts sales representative can only be set on a split work order." / "A part sale has one sales representative." — "never reached from the UI" | EXCLUDED (API only) | — |
| TP-29 | §5 0.1 "An identical (labor, split, parts) tuple writes nothing and saves nothing" | CONFIRM | S7-03 C665983 |
| TP-30 | §3.3 "One unowned id fails the whole request" | CONFIRM | S4-23 ("keeps no representative") |
| TP-31 | §5 0.4 legacy customer keys dropped | Not user-visible (D17 part is TP-21) | — |
| TP-32 | §5 0.5 "`null` split (every entry before this release) reads as not split"; FE risks: old history snapshots / entries "rendered as today" | ADD | **REL-19** (new, held: needs data from before the release) |
| TP-33 | §5 0.6 masking: Labor row → parts null; Parts row → hours, labor, shop supplies null; "`part_sales`: `shop_supplies` = null when it is 0 … Every other field is numeric"; adjustments / margin / subtotal / margin % never masked; invoice count = distinct invoices | CONFIRM S5-01, S5-02, S5-03, S5-10, S5-13; **DIVERGE, RULED** twice: a $0.00 shop supplies charge shows $0.00 (answer 25, S5-R15a) and a part sale's labor cells show a dash (answer 39, S5-R15b) | S5-07, S5-18, REL-16, DR-03 C690660, D-15, D-16 follow the PRD |
| TP-34 | §5 0.6 / §8.1 export: Sales Type right after Status, Expanded only, "(blank on rep and total rows)"; masked cells blank in CSV, dash in PDF | CONFIRM | S5-12, S5-15, D-16, DR-06 C690663 |
| TP-35 | §5 0.7 Sales By Customer export captions "All Sales" / "Part Sales only" / "Service Sales only" | CONFIRM | S8-04, S8-12 |
| TP-36 | §5 0.9 unchanged endpoints | No case | — |
| TP-37 | Phase 1 SBC relabel + walk ("Sales Type: All Sales" / "Part Sales" / "No sales", Empty export, old `?productTypes=parts` URL, export caption) | CONFIRM | S8-03, S8-04, S8-08, S8-12, REL-06, D-17. Note: the P1 def also sets `selectAllLabel: 'All Sales'` (SBR `'All'`); the plan does not say what it shows. If it renames the menu's "Select all" row, it would conflict with SBC spec S3-R2 and design boards 4.6 / 5.2. Not confirmed, so this goes to the QA lead as a question for engineering, not as a PO question. S8-08 keeps "Select all" |
| TP-38 | Phase 2 mid-stack: customer pages read "N/A" until Phase 3 | Not a release behaviour (D13) | — |
| TP-39 | §3.2 domain: a new customer has one primary "Unassigned" row (Counter Sale); part-sale following rule; per-field removal on deactivation; re-import drops nothing | CONFIRM | S4-13, S4-04, S4-06, S4-11, S4-12, S4-18, S4-26, S4-22 |
| TP-40 | §3.6 invoice fallback for a customer user with no staff row → nobody | EXCLUDED (0 such customers in prod; not reachable by hand) | — |
| TP-41 | §3.7 warning count over every side, each customer once | CONFIRM | S4-18, S4-19 |
| TP-42 | §3.7 a rep-only customer change does not stamp the customer's update time | EXCLUDED (not shown on any screen) | — |
| TP-43 | §4.1 assignments export: one row per (customer, user), Side labels, "ORDER BY LOWER(co.name), LOWER(sales_rep_name)…"; "Active?" keeps today's meaning | CONFIRM labels; CHANGE **S4-21** (row order); "Active?" EXCLUDED here (unchanged by this feature; Report Suite C30295 covers it) | S4-21 C665960 |
| TP-44 | §4.2 "Nothing on the read-only historical card reads the customer's reps (the WO card reads `workOrder.sales_rep_*`)" | ADD | **S2-15** (new) |
| TP-45 | Phase 3 customer dialog and page + walk (New Customer field, add / remove sides, Cancel saves nothing, rows in window order, WO-only role, phone) | CONFIRM | S4-01..S4-08, S4-24, S3-03, D-10..D-13. The plan's "[design-verify] if "buttons" means Save/Cancel" doubt is settled by PRD v11 S4-R4 ("the + and the remove x"), so no question is needed |
| TP-46 | Phase 4: part sale keeps "…on an invoiced or paid part sale."; history has no write path | CONFIRM (read-only history = S2-08 / S2-15) | S2-08, S2-15 |
| TP-47 | §5.4 log searchable by the Parts names | CONFIRM | S7-04 C665994 |
| TP-48 | Phase 4 smoke / R-12: "the part-sale rep change, lock message and log are unchanged" | CHANGE **S2-11** (pick saved + log entry); the lock message is Part Sales Update v1's own (C146393, C154618), not this suite | S2-11 C665935 |
| TP-49 | Phase 5 state machine: a pick during a save is ignored; failure → last saved value; same value → no write | CONFIRM | S1-10 C665924 (HOLD), S7-03 |
| TP-50 | Phase 5 geometry: 16 px row gap, 32 px action column, 16 px column gap, 42 px, split arrow bottom-right, empty Labor action cell, part sale with no action column | CONFIRM | D-01, D-02, D-05, D-06, D-14 |
| TP-51 | "Check S2-R14 (labels never cut) at 100% and 200% zoom and in a narrow window" | CONFIRM | D-05 (200% zoom and 1536 px steps) |
| TP-52 | Work order card label "Sales Representative"; Lead technician / Service advisor untouched | CONFIRM | S1-01, S2-08, DR-01 C690658 (answer 8) |
| TP-53 | P3 print: "one person both sides (split or not) -> one name"; inactive; Parts first; empty side; gone staff → Unassigned; nobody → no row | CONFIRM S6-02..S6-05; CHANGE **S6-01** (split work order, same person) | S6-01 C665976, S6-02..S6-05 |
| TP-54 | P3 audit log: a split entry reads both sides even when one person holds both; "Unknown" for an unresolved id | CONFIRM S7-01, S7-02, D-09; "Unknown" **DIVERGE, RULED** by answer 5 / S7-R6 | S7-01, S7-05 |
| TP-55 | S3-R6: below `md` the card is collapsed until its edit button expands it | CONFIRM | S3-01, S3-04 |
| TP-56 | Phase 6: prefill on create, copy on Split Work Order, Split Part Sale and reopening a paid work order; moving lines to an existing work order does not touch reps; changing the customer does not | CONFIRM S4-10, S4-11, S4-13, S2-12, S2-13, S4-14; ADD **S2-16**, **S4-27** | S2-16 (new), S4-27 (new) |
| TP-57 | Phase 7 capture: part-sale chain; captured as-is when anyone is on it; customer per side when nobody; no switch filter on the fallback; re-invoice re-captures | CONFIRM | S4-12, S4-17, S4-16, S4-15, S2-10 |
| TP-58 | Phase 8: Sales Type column "in `expanded()` only, never in `summary()`"; line fees and discounts stay in their side | CONFIRM | S5-15, S5-16 |
| TP-59 | §8.2 (c) / 8.4: current staff name; "falls back to the captured name" when the staff record is gone | CONFIRM S5-14 (rename); ADD **S5-19** (developer check, answer 30) | S5-14, S5-19 (new) |
| TP-60 | §8.2 (d) "Labor, Parts" merge only when both sides are selected; different people are always two rows | CONFIRM | S5-08, S5-01, S8-01 |
| TP-61 | §8.2 (e) "A split invoice now counts as 2 rows toward the 10k Expanded cap" | EXCLUDED (10,000 rows not reachable by hand; consistent with SBR spec v28 S14-E2 "data rows", so no question) | — |
| TP-62 | §8.2 (f) worked checks S5-R6, S5-E1, tie cent, S5-R8, S5-E2 | CONFIRM | S5-03, S5-04, S5-05, S5-06, REL-03, DR-07 |
| TP-63 | §8.2 whole-invoice pool holds "the §5 subtotal floor"; §7 N1 uses a taxable discount to avoid "the non-taxable clamp" | ADD | **S5-20** (new; PRD v11 S5-R6 sentence 2 was quoted but never tested, Rule 116) |
| TP-64 | Phase 9: chip "All" / "None" / names; selector first and off; after Status, before Location; "rep and Totals merged cells span it" | CONFIRM S8-01, S5-11, DR-06; CHANGE **S5-01** (summary and Totals rows) | S5-01 C665962 |
| TP-65 | Phase 9 walk: split invoice under both reps with dashes; old link; first-visit reset; exports | CONFIRM | S5-01, REL-05, S5-12 |
| TP-66 | §7 manual checklist: throttled network (Slow 3G) for S1-E1; release-day checks; `tech` sees plain text | CONFIRM | S1-10 (stays HOLD: needs developer tools, Rule 114), REL-01..REL-05, S1-06 |
| TP-67 | §7 TestRail sync: existing cases in other suites the plan changes | Reported to the QA lead (not edited, Rules 38 / 123; QA lead 21 Oct: these wait until the feature is live) | see PASS-REPORT §5 |
| TP-68 | §9 security: reports keep Reports access; public API exposes no rep; accounting payload reads no rep | CONFIRM REL-13, REL-11; public API EXCLUDED (PRD out of scope; no API by hand) | REL-13, REL-11 |
| TP-69 | R-12 regressions: invoice preview works; Counter Sale create and deactivation flow unchanged | ADD (preview → **REL-18**); CONFIRM S4-13, S4-18 | REL-18 (new) |
| TP-70 | FE risks: "CustomerDialog is shared by four hosts … verify the Customers-list redirect after create and the contact dialog chain still run" | EXCLUDED (no source we hold states today's flow, so no quotable expected result, Rule 58); reported to the QA lead for the Customers suite | — |
| TP-71 | §10 traceability covers PRD v8 ids only; the plan predates S1-R6a, S1-E3, S2-E6, S5-R15b, S7-R6 and the new Deactivate window line (S4-R21 v10) | Reported to the QA lead (the plan may not build them); our cases cover all of them | C690666, C690667, C715271, C690670, S4-18, S4-19, D-01 |
| TP-72 | §11 verification tickets SV-11384…SV-11392 | No case (in TICKET-LEDGER) | — |
| Q-41 | §3 Phase 3 `addPartSales` copies the person new part sales follow; D5 lets held ids save → when Service Parts (or the one rep) holds a switched-off person, the added Part Sales field starts with that person. PRD v11 S4-R8 / S4-R26 against S4-R27 can be read either way | **Ambiguity → new question 41** (NEW-QUESTIONS.md); no case until answered | — |

## Divergences (plan against PRD v11 / Chris Ward's answers), for the QA lead (Rule 30: "let me know where it contradicts")
| # | The tech plan builds | PRD v11 / ruling | Cases follow |
|---|---|---|---|
| 1 | A foreign or missing rep reads "(Inactive)" with no name (card), an empty field (`labelFor`), "Unknown" (log) | "Unassigned" on the card, the print and the log (S1-E3, S6-N1, S7-R6; answer 5) | PRD: S1-11, S6-05, S7-05 |
| 2 | No "(Inactive)" on customer fields (D17) | "Name (Inactive)" (S4-N2; answer 14) | PRD: S4-15, S4-20 |
| 3 | The part sale's label becomes "Sales Representative" on the new component (D18, Phase 5) | Nothing changes: "Sales representative" (S2-N2; answer 7) | PRD: S2-11, D-14, DR-02 |
| 4 | A part sale's Shop Supplies of 0 shows a dash | $0.00 only when a $0.00 shop supplies charge is on it; a dash when there is none (S5-R15a; answer 25) | PRD: S5-07, D-15 |
| 5 | A part sale's labor cells stay numeric (0.00 / $0.00) | A dash on screen and in the PDF, blank in the CSV (S5-R15b; answer 39) | PRD: S5-07, S5-18, REL-16, DR-03, D-15, D-16 |
| 6 | The picker is not open to a part-sales-only user (§5 0.8 guard) | The list shows for that user (S4 prerequisites, S4-R3; answer 16) | PRD: S4-25 |
| (note) | Not a divergence: the plan's §1 copy of S5-R7 is v8 ("A cent left over by rounding the share goes to the Labor row."), but §8.2 builds nearest cent to Parts and the tie cent to Labor | = v11 S5-R7 (answer 21) | S5-05 (no conflict in behaviour) |
