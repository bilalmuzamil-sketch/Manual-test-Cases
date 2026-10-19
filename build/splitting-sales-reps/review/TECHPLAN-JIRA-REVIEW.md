# Splitting Sales Representatives: review of the tech plan and Jira against PRD v8

**Project:** Splitting Sales Representatives (epic SV-10890) · **PO:** Chris Ward · **Type:** V2, an upgrade of today's single sales representative
**Prepared:** 19 Oct 2026, by the QA authoring lane's worker · **Build:** none exists yet, so nothing here is build-verified
**Authority:** PRD Confluence 919928833 **v8** (14 Oct 2026). Where the tech plan or Jira says something different, that is a question for the PO. This review never picks a side.

How to read the evidence:
- An L-number such as L1578, followed by a quote in «» marks, quotes line 1578 of the tech plan word for word.
- "PRD L82" before a «» quote means line 82 of the PRD plain-text copy.
- "SV-11265 L27" before a «» quote means line 27 of the saved Jira copy in `review/jira/`.

A script checked every «…» quote in this file against its source line, character for character, before the file was saved. The result is in section g.

---

## a. Reading coverage

| Source | Size | What was read | Coverage |
|---|---|---|---|
| PRD v8 plain text `sources/CONFLUENCE-919928833-v8-2026-10-19.txt` | 42,356 bytes · 315 lines | L1–315 in one read | **100%** |
| Tech plan `sources/Tech-Plan-Splitting-Sales-Representatives-2026-10-19-upload.md` | 278,939 bytes · 2,641 lines | L1–250, 250–499, 499–728, 728–987, 987–1200, 1200–1444, 1444–1688, 1688–1902, 1902–2071, 2071–2255, 2255–2393, 2393–2517 (read in chunks). L2518–2641 (traceability table and verification-ticket table) were read in two passes, the first 220 characters of each line and then the rest of every longer line, so every character was seen. Running notes kept in `review/_running-notes.md`. | **100%** |
| Tech plan §1 "Requirements (extracted from PRD)" vs PRD | L45–207 | A script compared all 138 restated requirement texts with the PRD | **138 / 138 identical**, story tags all correct |
| SV-10890 (epic) | no description, 0 comments | full issue | **100%** |
| SV-11265 … SV-11272 (Stories 1–8) | 8 issues, 0 comments each | full description + acceptance criteria + links + fields | **100%** |
| SV-11384 … SV-11392 (Verify Phase 1–9) | 9 issues, 0 comments each | full description + links + fields | **100%** |
| SV-4854 (named in the PRD Business Case) | 1 issue, 0 comments | full. Client details are left out of the saved copy because this repository is public. | **100%** |
| SV-10266 (Part Sales Update v1, Story 5, named in the PRD) | 1 issue, **2 comments** | full description + both comments | **100%** |
| Jira story requirement texts vs PRD | 138 codes | A script compared every code | **130 identical, 8 different** (see section b) |

Every issue's text is saved in `review/jira/<KEY>.md` (20 files: the epic, 8 stories, 9 verify tasks, SV-4854 and SV-10266). No Jira issue has comments except SV-10266.

---

## b. Verdict for every PRD requirement code (all 138)

**Totals.**
- **Tech plan:** 96 CONFIRM · 38 ADD · 4 DIVERGE.
- **Jira:** 130 CONFIRM · 6 "CONFIRM (older copy)" · 2 DIVERGE.

"CONFIRM (older copy)" means the Jira story still has an earlier wording of the requirement. It leaves out one or more PRD v8 sentences but says nothing that conflicts with them. A tester who reads only Jira would miss those sentences (Q13).

The tech plan's own copy of the requirements (§1) matches PRD v8 word for word for all 138 codes. The verdicts below therefore judge what the rest of the plan **does** with each requirement.

| Code | Tech plan | Tech plan evidence | Jira | Jira evidence |
|---|---|---|---|---|
| **S1-R1** | CONFIRM | Restated verbatim [L49]; built in Phase 5. | CONFIRM | Same text. |
| **S1-R2** | ADD | The card label's capital R is a change from today: [L1603] «Label case: "Sales representative" -> "Sales Representative" (PRD wording; Lead technician / Service advisor untouched).» | CONFIRM | Same text. |
| **S1-R3** | CONFIRM | — | CONFIRM | Same text. |
| **S1-R4** | ADD | Box height pinned to 42px: [L23] «S1-R4 no longer names a pixel value, so the plan builds to the existing **42px**.» and [L1578] «min-height:42px;». Keyboard reveal: [L635] «Keyboard: tabbing onto a hidden action focuses it, which triggers `:focus-within` and reveals it (S1-R4 "keyboard focus").» | DIVERGE | Jira names a number the PRD removed: [SV-11265 L27] «at the same 44px height and the same left edge» vs [PRD L82] «at the same height as those two fields and the same left edge». Tech plan builds 42px. See Q2. |
| **S1-R5** | CONFIRM | Grid of field, 16px gap, 32px button column [L1575]. | CONFIRM | Same text. |
| **S1-R6** | DIVERGE | Requirement confirmed, but the tech plan says TODAY's gaps are already 16px, contradicting the PRD context note: [L29] «Product's reply calls this "a must-fix in this build" and says *"Today the gap under Lead Technician is wrong."*» vs PRD context note [PRD L101] «before this change Lead Technician reserved a 20px strip for messages under itself, so the gap to Service Advisor measured 36px». Expected result (16px) is the same either way. See Q12. | CONFIRM | Same text (Jira repeats the 36px context note). |
| **S1-R7** | CONFIRM | [L1524]. | CONFIRM | Same text. |
| **S1-R8** | CONFIRM | List stays unpaginated, A–Z [L484]. | CONFIRM | Same text. |
| **S1-R9** | CONFIRM | — | CONFIRM | Same text. |
| **S1-R10** | CONFIRM | — | CONFIRM | Same text. |
| **S1-R11** | ADD | Split arrow offsets are left to the design check: [L1581] «[design-verify] offsets». | CONFIRM (older copy) | Jira omits the PRD's second sentence (arrow moves to the bottom-right corner when split). It says nothing different, but a tester reading only Jira would miss it. See Q13. |
| **S1-R12** | CONFIRM | — | CONFIRM | Same text. |
| **S1-R13** | CONFIRM | [L1506]. | CONFIRM | Same text. |
| **S1-R14** | CONFIRM | — | CONFIRM | Same text. |
| **S1-R15** | CONFIRM | — | CONFIRM | Same text. |
| **S1-N1** | ADD | The built-in technician role sees plain text: [L2268] «`tech` sees plain text on the card (S1-N1).» Server gate is 'Work Orders — Create & Edit' [L1288]. | CONFIRM | Same text. |
| **S1-N2** | ADD | The refusal applies only to people the work order does not already hold: [L401] «An id the WO already holds is accepted as-is, so an inactive holder can stay, move between». | CONFIRM | Same text. |
| **S1-N3** | CONFIRM | Server message shown, field drops back [L1488], [L1492]. | CONFIRM | Same text. |
| **S1-E1** | ADD | [L2266] «Throttled network (Slow 3G): a second pick during a save is ignored with no flash; + / x disabled until the save finishes (S1-E1).» | CONFIRM | Same text. |
| **S1-E2** | ADD | "Inactive" also covers a staff record that no longer exists [L1352]. A rep from another organization: [L283] «Behavior change: a cross-org id now reads "(Inactive)" with no name.» The card code shows a blank instead [L1525]. See Q5. | CONFIRM | Same text. |
| **S2-R1** | ADD | Dark-mode fill defined: [L586] «body.body--dark .icon-action-btn:hover, body.body--dark .icon-action-btn--active { background: rgba(255,255,255,.08); }» | CONFIRM | Same text. |
| **S2-R2** | ADD | [L585] «.icon-action-btn:hover, .icon-action-btn--active { background: rgba(0,0,0,.06); }  // [design-verify] fill token» | CONFIRM | Same text. |
| **S2-R3** | CONFIRM | [L576]. | CONFIRM | Same text. |
| **S2-R4** | ADD | Menu anchored to the bottom-left of the +: [L592] «anchor="bottom left" self="top left"». | CONFIRM | Same text. |
| **S2-R5** | CONFIRM | [L1528]–[L1530]. | CONFIRM | Same text. |
| **S2-R6** | CONFIRM | [L1510]; an inactive holder may be copied onto Parts [L401]. | CONFIRM | Same text. |
| **S2-R7** | CONFIRM | [L1571]. | CONFIRM | Same text. |
| **S2-R8** | CONFIRM | — | CONFIRM | Same text. |
| **S2-R9** | CONFIRM | [L1550]. | CONFIRM | Same text. |
| **S2-R10** | ADD | [L1568] «The Labor field renders an EMPTY `.sales-rep-row__action` cell (S2-R10: no button, column kept so both boxes end at the» (both boxes end at the same point). | CONFIRM | Same text. |
| **S2-R11** | CONFIRM | — | CONFIRM | Same text. |
| **S2-R12** | CONFIRM | [L1507]. | CONFIRM | Same text. |
| **S2-R13** | CONFIRM | Phases 7–8. | CONFIRM | Same text. |
| **S2-R14** | ADD | [L1586] «S2-R14 check: at 100% and 200% zoom in the browser walk,» plus a narrow window [L1676]. | CONFIRM | Same text. |
| **S2-R15** | CONFIRM | [L1404]. | CONFIRM | Same text. |
| **S2-R16** | CONFIRM | [L1511]. | CONFIRM | Same text. |
| **S2-R17** | ADD | Work orders saved in history before the release show one field: [L2384] «Old WO history snapshots** lack `sales_rep_split`; treated as not split.» | CONFIRM | Same text. |
| **S2-N1** | ADD | [L388] «S2-N1 ("a side is never refilled on its own") hold for every caller, including a stale tab or a» but [L389] «The FE still always sends `split` explicitly.» So a second open tab that still shows one field would remove the Parts field. See Q8. | CONFIRM | Same text. |
| **S2-N2** | DIVERGE | Tech plan rebuilds the part-sale field on the new component and changes its label case: [L297] «The part sale's rep field moves onto the new work order rep component with the + off» and [L1603]; it claims the card is [L1570] «visually unchanged (S2-N2 context note).» PRD context note [PRD L129] «with no + button, no remove x and no change to how it looks.» See Q6. | CONFIRM | Same text. |
| **S2-E1** | CONFIRM | [L397]–[L402]. | CONFIRM | Same text. |
| **S2-E2** | CONFIRM | [L1376]. | CONFIRM | Same text. |
| **S2-E3** | CONFIRM | [L1836]. | CONFIRM | Same text. |
| **S2-E4** | ADD | A part sale keeps its own wording: [L396] «The part-sale message is unchanged: "…on an invoiced or paid part sale."» | CONFIRM | Same text. |
| **S2-E5** | ADD | [L1738] «Moving lines to an EXISTING target WO» [L1739] «does not touch reps.» | CONFIRM | Same text. |
| **S3-R1** | CONFIRM | — | CONFIRM | Same text. |
| **S3-R2** | ADD | "Phone" means a device with no hover, not a small screen: [L289] «"Phone" = `@media (hover: none)`, not screen width». | CONFIRM | Same text. |
| **S3-R3** | CONFIRM | — | CONFIRM | Same text. |
| **S3-R4** | CONFIRM | [L632]. | CONFIRM (older copy) | Jira omits the PRD's two sentences about the arrow always showing on touch and Lead Technician / Service Advisor keeping today's tap-to-reveal. See Q13. |
| **S3-R5** | CONFIRM | [L1193]. | CONFIRM | Same text. |
| **S3-R6** | ADD | Collapse is decided by screen width, not touch: [L1678] «No new code: below `md`, `WorkOrderLeftSection.vue` renders the collapsed `OrderStatusCardMobile` (no assignee fields) until its edit button expands the full `OrderStatusCard`.» See Q11. | DIVERGE | [SV-11267 L29] «They show after Show Details, as Lead Technician and Service Advisor do today.» vs [PRD L149] «They show after the card is expanded with its edit button, as Lead Technician and Service Advisor do today. The expand control itself does not change.» See Q3. |
| **S4-R1** | ADD | [L1193] «the dialog stays open (no Access Denied) and lists reps (D14)» for a user with only 'Work Orders — Create & Edit'. | CONFIRM | Same text. |
| **S4-R2** | CONFIRM | [L963]. | CONFIRM | Same text. |
| **S4-R3** | CONFIRM | Unpaginated [L484]. | CONFIRM | Same text. |
| **S4-R4** | ADD | [L1141] «the + and x sit inside the form body (scrolls with the fields)». | CONFIRM | Same text. |
| **S4-R5** | CONFIRM | — | CONFIRM | Same text. |
| **S4-R6** | CONFIRM | [L1100]–[L1103]. | CONFIRM | Same text. |
| **S4-R7** | CONFIRM | [L1096]. | CONFIRM | Same text. |
| **S4-R8** | CONFIRM | [L1097]. | CONFIRM | Same text. |
| **S4-R9** | CONFIRM | — | CONFIRM | Same text. |
| **S4-R10** | CONFIRM | [L1125]. | CONFIRM | Same text. |
| **S4-R11** | CONFIRM | [L1098]. | CONFIRM | Same text. |
| **S4-R12** | CONFIRM | — | CONFIRM | Same text. |
| **S4-R13** | CONFIRM | — | CONFIRM | Same text. |
| **S4-R14** | CONFIRM | — | CONFIRM | Same text. |
| **S4-R15** | CONFIRM | [L1127]. | CONFIRM | Same text. |
| **S4-R16** | CONFIRM | Cancel saves nothing [L1193]. | CONFIRM | Same text. |
| **S4-R17** | ADD | A switched-off person is still credited: [L1837] «NO is_sales_rep filter: the S4-R27 context note». A customer person with no staff record credits nobody [L900]–[L901]. | CONFIRM | Same text. |
| **S4-R18** | CONFIRM | [L1828]. | CONFIRM | Same text. |
| **S4-R24** | CONFIRM | [L1714]–[L1719]. | CONFIRM | Same text. |
| **S4-R25** | ADD | A split customer with one ineligible side still gives a split work order, that side Unassigned [L1717]–[L1718]. | CONFIRM | Same text. |
| **S4-R26** | CONFIRM | [L791]–[L793]. | CONFIRM | Same text. |
| **S4-R31** | CONFIRM | [L1734], [L966]. | CONFIRM | Same text. |
| **S4-R32** | CONFIRM | [L1742]. | CONFIRM | Same text. |
| **S4-R27** | CONFIRM | [L1725]. | CONFIRM | Same text. |
| **S4-R28** | CONFIRM | [L1740]. | CONFIRM | Same text. |
| **S4-R30** | CONFIRM | [L1762]. | CONFIRM | Same text. |
| **S4-R29** | CONFIRM | Split state is copied too [L1738]. | CONFIRM | Same text. |
| **S4-R19** | ADD | [L1155] «Everything else in that block (Phone, Credit, Website, IBS) stays inside the address check, as today.» No "(Inactive)" on customer fields: [L296] «No "(Inactive)" suffix on customer fields». See Q7. | CONFIRM (older copy) | Jira omits the PRD's two address sentences (rows show on every customer, other fields keep today's address rule). See Q13. |
| **S4-R20** | CONFIRM | [L794]–[L795]. | CONFIRM | Same text. |
| **S4-R21** | CONFIRM | [L875]–[L879]; worked count [L969]. | CONFIRM | Same text. |
| **S4-R22** | ADD | Renames made through the public API reach customers too: [L803] «ADD a regression test: rename a staff member via the public API, then GET a». | CONFIRM | Same text. |
| **S4-R23** | ADD | Only fields holding a person get a row [L989]; sort order [L993] «ORDER BY LOWER(co.name), LOWER(sales_rep_name), co.id, csr.user_id»; [L1001] «Rows are keyed by user id rather than name, which answers the old "two people with the same name"». | CONFIRM | Same text. |
| **S4-N1** | CONFIRM | [L1831]. | CONFIRM | Same text. |
| **S4-N2** | ADD | [L284] «S4-N2 holders stay re-savable». | CONFIRM | Same text. |
| **S4-N3** | CONFIRM | [L863]–[L864]. | CONFIRM | Same text. |
| **S4-E1** | DIVERGE | [L30] «The Phase 2 migration turns those 10 into "Unassigned".» vs [PRD L196] «On release day every existing customer has the one "Sales Representative" field, with no Service Parts or Part Sales field, and keeps its one representative». Product accepted it as an FYI [L239] but the PRD text has no exception. See Q4. | CONFIRM | Same text. |
| **S4-E2** | CONFIRM | — | CONFIRM | Same text. |
| **S5-R1** | CONFIRM | [L1817]. | CONFIRM | Same text. |
| **S5-R2** | CONFIRM | [L2005]. | CONFIRM (older copy) | Jira omits the PRD's sentences on the report showing the CURRENT name and the captured name only when the staff record is gone. See Q13. |
| **S5-R3** | ADD | Part sale vs work order is decided by invoice number: [L316] «an invoice numbered `LIKE 'P%'` is a part sale (one Part Sales row); **every other invoice** — `S%` and any number outside both prefixes — is a work order with a Labor row and a Parts row.» | CONFIRM | Same text. |
| **S5-R4** | ADD | Line fees and discounts are already inside Labor/Parts Invoiced: [L1957] «`InvoiceFinancialSnapshotService` already nets `labor_line`-scoped adjustments into `labor_sell` and `part_line`-scoped ones into `parts_sell`». | CONFIRM | Same text. |
| **S5-R5** | CONFIRM | [L1957]. | CONFIRM | Same text. |
| **S5-R6** | ADD | The processing fee and the old invoice discount rate count as whole-invoice amounts: [L1957] «"scopes whole_wo / whole_parts_sale, the processing fee, the legacy invoice.discount rate and the §5 subtotal floor"». Worked example recomputed and correct [L2051]–[L2053]. | CONFIRM | Same text. |
| **S5-R7** | DIVERGE | Parts share is rounded to the NEAREST cent; Labor only gets the extra cent on an exact half-cent tie: [L1968] «round half TOWARD ZERO: a tie cent stays with Labor (S5-R7)» and the non-tie example [L2059] «PARTS=−67 (exact −66.67), LABOR=−33 ✓.» PRD [PRD L212] «A cent left over by rounding the share goes to the Labor row.» Two readings give different cents. See Q1. | CONFIRM | Same text. |
| **S5-R8** | ADD | "Empty side" is read as "no representative": [L1970] «THEN CASE WHEN LR IS NULL AND PR IS NOT NULL THEN A ELSE 0 END    -- S5-R8». See Q9. | CONFIRM | Same text. |
| **S5-R9** | CONFIRM | [L1984]. | CONFIRM | Same text. |
| **S5-R10** | CONFIRM | [L2043]. | CONFIRM | Same text. |
| **S5-R11** | CONFIRM | [L2044]. | CONFIRM | Same text. |
| **S5-R12** | CONFIRM | — | CONFIRM | Same text. |
| **S5-R13** | CONFIRM | [L2013]. | CONFIRM | Same text. |
| **S5-R14** | CONFIRM | [L1972], [L1996]. | CONFIRM | Same text. |
| **S5-R15** | ADD | Exact columns blanked per row type [L463]–[L464]; dash is an em dash, real zero "$0.00" [L2194]. | CONFIRM | Same text. |
| **S5-R15a** | CONFIRM | [L1917]–[L1918]. | CONFIRM | Same text. |
| **S5-R16** | CONFIRM | [L1919]–[L1921]. | CONFIRM | Same text. |
| **S5-R17** | CONFIRM | [L467]–[L468]. | CONFIRM | Same text. |
| **S5-R18** | CONFIRM | — | CONFIRM | Same text. |
| **S5-R19** | ADD | [L2207] «after the four identifiers and BEFORE Location»; not sortable [L2192] «Not server-sortable»; the rep-name and Totals cells span the new column [L2209]. | CONFIRM | Same text. |
| **S5-R20** | CONFIRM | [L2188]. | CONFIRM | Same text. |
| **S5-R21** | CONFIRM | [L2189]. | CONFIRM | Same text. |
| **S5-R22** | ADD | The choice is remembered in the browser: [L2233] «persisted in localStorage». See Q10. | CONFIRM | Same text. |
| **S5-R23** | ADD | Sales Type cell blank on rep and Totals rows [L471]; [L1924] «in `expanded()` only, never in `summary()`.» (no Sales Type column in the Summary export). | CONFIRM | Same text. |
| **S5-R24** | CONFIRM | [L2347]. | CONFIRM | Same text. |
| **S5-N1** | CONFIRM | [L27], [L2013]. | CONFIRM (older copy) | Jira omits the PRD sentence "On a split work order, a side with no dollars … still gives its representative a $0.00 row". See Q13. |
| **S5-N2** | CONFIRM | [L2093]. | CONFIRM | Same text. |
| **S5-E1** | CONFIRM | Recomputed [L2054]–[L2056]; adds up. | CONFIRM | Same text. |
| **S5-E2** | CONFIRM | [L367], [L2062]–[L2063]. | CONFIRM (older copy) | Jira omits the PRD sentence on invoices before 2026-07-29 staying Unassigned. See Q13. |
| **S6-R1** | ADD | A split work order with the same person on both sides also prints one name: [L1647] «const samePerson = !split» (not split, or the same person on both sides). | CONFIRM | Same text. |
| **S6-R2** | CONFIRM | [L640]–[L645]; printed row label [L2308]. | CONFIRM | Same text. |
| **S6-R3** | CONFIRM | [L642]. | CONFIRM | Same text. |
| **S6-R4** | CONFIRM | [L1649]. | CONFIRM | Same text. |
| **S6-N1** | CONFIRM | [L1644]. | CONFIRM | Same text. |
| **S7-R1** | CONFIRM | [L403]–[L404]. | CONFIRM | Same text. |
| **S7-R2** | CONFIRM | — | CONFIRM | Same text. |
| **S7-R3** | ADD | [L1664] «a split entry reads both sides even when one person holds both»; [L1670] «"Unknown" for an unresolved id.»; Parts names become searchable in the log [L1345]–[L1346]. | CONFIRM | Same text. |
| **S7-R4** | CONFIRM | [L1264]. | CONFIRM | Same text. |
| **S7-R5** | CONFIRM | [L1270]. | CONFIRM | Same text. (Story 7's prerequisite paragraph diverges — see section c and Q14.) |
| **S8-R1** | CONFIRM | [L2171]–[L2172]. | CONFIRM | Same text. |
| **S8-R2** | CONFIRM | — | CONFIRM | Same text. |
| **S8-R3** | ADD | The chip never shortens the names: [L613] «skip `truncate()` when `summaryListsNames` is set». | CONFIRM | Same text. |
| **S8-R4** | CONFIRM | [L474]. | CONFIRM | Same text. |
| **S8-R5** | CONFIRM | [L2220]–[L2221]. | CONFIRM | Same text. |
| **S8-R6** | CONFIRM | [L667]. | CONFIRM | Same text. |
| **S8-R7** | CONFIRM | [L663]. | CONFIRM | Same text. |
| **S8-R8** | CONFIRM | [L667]–[L668]. | CONFIRM | Same text. |
| **S8-R9** | CONFIRM | [L678]–[L679]. | CONFIRM | Same text. |
| **S8-R10** | CONFIRM | SBC keeps its own split [L316]. | CONFIRM | Same text. |
| **S8-N1** | CONFIRM | — | CONFIRM | Same text. |
| **S8-E1** | ADD | [L690] «an old `?productTypes=parts` URL opens with Part Sales selected». | CONFIRM | Same text. |

---

## c. Testable behaviour in the tech plan or Jira that no PRD code covers

**"Tester?"** says whether a manual tester can check the behaviour in the product's screens:
- **Yes**: in the UI.
- **Two tabs**: needs two browser tabs or two logins.
- **File**: open a downloaded export.
- **No**: needs the API, the database or impossible data. Keep it for developer or automated checks.

| # | Area | What the source says (verbatim) | Tester? |
|---|---|---|---|
| C1 | Error message on the customer | Customer save refuses a person who is not an active sales rep: [L431] «staff row flagged `is_sales_rep`. Both failures return 400 "The selected staff member is not a sales»; a person the customer already holds is re-savable [L284] «S4-N2 holders stay re-savable». | **Two tabs**: open Edit Customer, switch the person's Sales Representative switch off in a second tab, then pick them and Save |
| C2 | Error message (API only) | [L393] «`split=true` on a part sale (type `parts`) returns 400 "A part sale has one sales representative."» | No |
| C3 | Error message (API only) | [L390] «A non-null `parts_sales_rep_id` without `split=true` (absent or `false`) returns 400 "The Parts sales» | No |
| C4 | Error message (API only) | [L2103] «Add: an unknown `salesTypes` token returns 400.» | No |
| C5 | Part sale lock wording | [L1258] «? 'The sales representative cannot be changed on an invoiced or paid part sale.'» | No (only reachable by another route) |
| C6 | Permissions | The rep list is offered to [L485] «The guard widens from `ROLE_WORK_ORDER_VIEW` to an Expression: any of `ROLE_WORK_ORDER_VIEW`,»; a work-orders-only user making a customer from a work order: [L1193] «the dialog stays open (no Access Denied) and lists reps (D14)». | **Yes** (custom role) |
| C7 | Permissions | [L2268] «`tech` sees plain text on the card (S1-N1).» | **Yes** |
| C8 | Permissions | A user who may only make part sales: [L2374] «Part Sales-only role never requests `sales-reps` (403 trap, keep the watch)» and [L2380] «now runs in create mode. Without C1 this is an AccessDenied ejection for WO-only and part-sales-only roles.» See Q15. | **Yes** (custom role) |
| C9 | Release day | [L30] «The Phase 2 migration turns those 10 into "Unassigned".» Work orders and invoices get no data change: [L367] «**Work orders and invoices:** none. Existing rows read `sales_rep_split = 0`, so their Parts side follows the one rep» | Partly. Production data only for the 10 customers. A QA copy can check an old work order and an old invoice. |
| C10 | Release day | [L2218] «Remembered view: `version: '3'` with a comment "Bumped for Sales Type (SV-10890): one-time reset of columns AND sort to» and [L2197] «an old `productTypes` link is ignored and the default, all» | **Yes** (needs a saved view made before the upgrade) |
| C11 | Exports (SBR) | [L1924] «in `expanded()` only, never in `summary()`.» (no Sales Type column in the Summary export); [L471] «"Labor" / "Parts" / "Part Sales" / "Labor, Parts" (blank on rep and total rows).» | **File** |
| C12 | Exports (Assignments) | Only fields that hold a person produce rows [L989] «INNER JOIN company_sales_representative csr ON csr.company_id = co.id AND csr.user_id IS NOT NULL»; sort [L993] «ORDER BY LOWER(co.name), LOWER(sales_rep_name), co.id, csr.user_id»; two people with the same name are two rows [L1001] «Rows are keyed by user id rather than name, which answers the old "two people with the same name"» | **File** |
| C13 | Sorting | [L2192] «Not server-sortable (not added to `SBR_SERVER_SORTABLE_COLUMN_NAMES`).»; invoice rows [L2039] «ORDER BY i.created_on DESC, i.raw_number ASC, i.id ASC» | **Yes** |
| C14 | Rounding | [L2065] «Hours are» … [L2066] «DECIMAL(…,2) sums rounded once as today. Σ rows = totals holds to the cent.» Shares in whole cents [L272] «The whole-invoice adjustment column is shared by size in integer cents». | **Yes** (add up the rows) |
| C15 | What counts as "whole-invoice" | [L1957] «"scopes whole_wo / whole_parts_sale, the processing fee, the legacy invoice.discount rate and the §5 subtotal floor"». The processing fee is shared by size. | **Yes** (invoice with a card processing fee) |
| C16 | Part sale vs work order on the report | [L316] «an invoice numbered `LIKE 'P%'` is a part sale (one Part Sales row); **every other invoice** — `S%` and any number outside both prefixes — is a work order with a Labor row and a Parts row.» | No (a tester cannot make an invoice outside both prefixes) |
| C17 | Audit log | [L1345] «MODIFY `Application/Service/History/WorkOrderHistorySearch.php`: add `originalPartsSalesRepName` and» … [L1346] «`newPartsSalesRepName` to the searchable fields.»; [L1670] «"Unknown" for an unresolved id.»; [L1664] «a split entry reads both sides even when one person holds both» | **Yes** (search the Audit Log by the Parts person's name) |
| C18 | Phones / devices | [L289] «"Phone" = `@media (hover: none)`, not screen width»; collapse is by width [L1678] «below `md`»; dark mode [L586] «body.body--dark .icon-action-btn:hover» | **Yes** (real phone, tablet, touch laptop, dark mode) |
| C19 | Must-not-break: vehicle invoices list | [L1847] «the `unset(...)` list. `i.*` picks up the new BINARY(16) column, which breaks `json_encode` and 500s» | **Yes**: open a vehicle whose work order was invoiced split, and its invoice list must load |
| C20 | Must-not-break: shared screens | [L2367] «Regressions to verify: the part-sale rep change, lock message and log are unchanged; part-sale invoices are captured as before; invoice preview works; the accounting `CustomerUpdated` payload is unchanged (it reads no rep); the Counter Sale create is unchanged; the deactivation flow is unchanged.» | **Yes**, except the accounting payload (No) |
| C21 | Must-not-break: customer window hosts | [L2379] «**CustomerDialog is shared by four hosts** (Customer page, Customers list, WO dialog, part-sale dialog).» [L2381] «the Customers-list redirect after create and the contact dialog chain still run.» | **Yes** |
| C22 | Moving lines | [L1738] «Moving lines to an EXISTING target WO» [L1739] «does not touch reps.» | **Yes** |
| C23 | Two tabs / two users | [L389] «The FE still always sends `split` explicitly.» A tab that still shows one field and saves a pick sends "not split" and removes the Parts field. See Q8. | **Two tabs** |
| C24 | Customer "updated" stamp | [L800] «`company.updated_at`, which is correct because no Public API customer field changes. The PRD confirms» | No |
| C25 | Big exports | [L2048] «A split invoice now counts as 2 rows toward the 10k Expanded cap (§10 R-9).» | No (10,000 rows) |
| C26 | Rep from another organization | [L2363] «a WO whose `sales_rep_id` points at another org's staff now reads "(Inactive)" with no name, where it used to print a foreign name.» See Q5. | No (needs bad data) |
| C27 | Sales Follow-Up report | [L312] «**Sales Follow-Up report** (`SalesFollowUpReportQueryHandler`) keeps reading those columns, so it shows each customer's pre-release one rep with the name as it was at release, nothing for new customers, and no renames.» | No (PRD: the report does not load) |
| C28 | Loading signal | [L1437] «**Adds `:data-saving="isSaving"` and `aria-busy` on `group_sales_rep`**» | No (screen reader / automation) |
| C29 | Jira Story 7 prerequisite (not a requirement code) | [SV-11271 L20] «The user needs the 'Work Orders — Create & Edit' permission. The log opens from Audit Log in the work order's menu, which shows only to those users.» vs [PRD L258] «The log opens from Audit Log in the work order's menu, for users with history access ('Work Orders — View' or 'View History Logs'), as today. Nothing here changes who can open it.» **DIVERGE.** See Q14. | **Yes** |

---

## d. Facts about TODAY's single sales representative (inputs for the "must not change" checks)

These come from the tech plan, where developers report what the current code does, and from SV-10266. They are facts about today. They are **not** expectations for the new build. A code-vs-document conflict goes to the PO (Rule 96).

| # | Area | Today (verbatim) | Source |
|---|---|---|---|
| D1 | Work order field | [L246] «**Already built:** the work order's single rep field with "Unassigned", (Inactive), save-as-you-go and the read-only gate (SV-8599); the 16px gap (S1-R6); the "not a sales representative" refusal (S1-N2); the "Sales representative changed" log entry for one rep (#3369); the frozen rep name on the invoice;» | Tech plan |
| D2 | Card label case | [L1603] «Label case: "Sales representative" -> "Sales Representative" (PRD wording; Lead technician / Service advisor untouched).» Today the card reads "Sales representative". | Tech plan |
| D3 | Gap on the card | [L29] «already pin all three gaps to 16px» (the PRD context note says 36px under Lead Technician; see Q12) | Tech plan |
| D4 | Invoiced work orders | [L223] «**Not built** for service work orders (only part sales)». Today an invoiced service work order does not refuse a change sent by another route. | Tech plan |
| D5 | Customer window | [L247] «New Customer has a rep field (it does not); the customer dropdown has no search box and offers "Unassigned" (it has a search box and no Unassigned);» | Tech plan |
| D6 | Customer list source | [L491] «The customer dialog no longer calls `GET /api/staff` (`ROLE_USER_VIEW`; it would 403 for WO-only» [L492] «users opening New Customer from the WO window, and it pages 100 rows sorted by id).» | Tech plan |
| D7 | Rename | [L247] «a rename updates every customer (it updates one, `findOneBy`)». Today a rename reaches only one customer. | Tech plan |
| D8 | Customer page | [L1150] «"N/A" -> "Unassigned"»; [L1155] «Everything else in that block (Phone, Credit, Website, IBS) stays inside the address check, as today.» Today the rep row shows only when the customer has an address. | Tech plan |
| D9 | Contacts import | [L947] «failing-first test, because today the import blanks the rep.» | Tech plan |
| D10 | Split / reopen | [L247] «split / reopen copy the rep (nothing copies it).» | Tech plan |
| D11 | New work order / part sale | [SV-11268 L22] «before this change a new work order started with nobody in Sales Representative, and the customer's representative was used only when the work order was invoiced with nobody on it.»; [L1776] «sale A now *starts* with the customer's rep» | Jira SV-11268, tech plan |
| D12 | Part sale field (Part Sales Update v1) | [SV-10266 L25] «S5-R2: It offers the shop’s active sales representatives and can be cleared.»; [SV-10266 L28] «S5-N1: With no rep on the sale, the invoice is attributed to the customer’s assigned representative, exactly as a work order is.»; [SV-10266 L30] «S5-N3: Once invoiced or paid the field is read-only and the captured attribution does not change. Reversing the invoice unlocks the field again, as on a work order, and the next invoice captures the representative afresh.»; QA on 7 Oct: [SV-10266 L70] «Rep picker (Unassigned + active staff), change logged with prev→new, locked when invoiced/paid, unlocked on reversal.» | Jira SV-10266 |
| D13 | Who can be picked | [L483] «Org scoping, the active + `is_sales_rep` filter and the» [L484] «first→last-name sort are unchanged» | Tech plan |
| D14 | Sales By Representative grouping | [L248] «Sales By Representative does not group by a CASE today (`GROUP BY i.sales_rep_id`)» (one row per invoice under its one rep) | Tech plan |
| D15 | SBR "Service" filter today | [L316] «today's SBR/SBC "Service" predicate, which is `LIKE 'S%'`» | Tech plan |
| D16 | SBR Location / Unassigned / selector | [L2007] «ELSE 'Multiple' END» (a rep spanning locations reads "Multiple"); [L2020] «the Unassigned pin are unchanged»; [L2238] «any spec asserting the 9-column selector» (9 columns today) | Tech plan |
| D17 | SBR export filter line | [L472] «The filter line "Product Type: …" becomes» | Tech plan |
| D18 | Sales By Customer chip | [L670] «"All products" -> "All Sales", "No products" -> "No sales"» | Tech plan |
| D19 | Assignments export | [L999] «"Active?" keeps today's meaning (staff exists AND user active), now org-scoped through `u`.» | Tech plan |
| D20 | Deactivation warning | [L873] «MODIFY `src/Staff/Staff/Infrastructure/Doctrine/StaffRepository.php::countCompaniesWithSalesRepUserId()` (S4-R21):». Today it counts customers by the one rep field. | Tech plan |
| D21 | Report name for another organization's rep | [L2363] «where it used to print a foreign name.» | Tech plan |
| D22 | Imported work orders | [L1598] «Imported card: no rep field today; unchanged.» | Tech plan |
| D23 | Staff "Sales Representative" switch | Not described further than "the `is_sales_rep` flag" [L483]. The tech plan gives no new fact about the staff screen itself. | — |

---

## e. Questions for the product owner (Chris Ward)

**Arithmetic check first (as asked).**
- **S5-R6:** labor $600.00, parts $400.00, shop supplies $30.00, whole-invoice discount ($50.00).
  - The discount is shared 600 : 400, so Labor ($30.00) and Parts ($20.00).
  - Labor row: $600.00 + $30.00 − $30.00 = **$600.00**. Parts row: $400.00 − $20.00 = **$380.00**.
  - $600.00 + $380.00 = **$980.00**, which equals the invoice total ($600 + $400 + $30 − $50). **It adds up.**
  - Shop supplies are not part of the weighting. Only labor and parts dollars are, as the PRD says.
- **S5-E1:** labor $600.00, parts ($100.00), whole-invoice discount ($70.00).
  - Weighted by size: 600 : 100, which is six sevenths and one seventh. So Labor ($60.00) and Parts ($10.00).
  - Labor $540.00 and Parts ($110.00) give **$430.00** = $600 − $100 − $70. **It adds up.**
  - Note that the discount makes the negative Parts side more negative. That is what the PRD says, so no question is raised.
- The tech plan reworks both examples in whole cents and gets the same answers ([L2051]–[L2056]).
- The only arithmetic issue is how a leftover cent is rounded (Q1).

| Q | Topic in plain words | Question and options | What we know today | Found in |
|---|---|---|---|---|
| **Q1** | Rounding the shared discount when it does not split evenly | Labor $100.00, parts $200.00 and a whole-invoice discount of ($1.00) give an exact parts share of ($0.666…). Which is right? **(a)** Parts is rounded to the nearest cent, ($0.67), and Labor gets the rest, ($0.33). Labor gets an extra cent only on an exact half-cent tie. **(b)** Parts is rounded down to ($0.66) and the left-over cent goes to Labor, ($0.34). **(c)** Another rule. | PRD: [PRD L212] «S5-R7: A cent left over by rounding the share goes to the Labor row.» Tech plan builds (a): [L1968] «round half TOWARD ZERO: a tie cent stays with Labor (S5-R7)» and [L2059] «PARTS=−67 (exact −66.67), LABOR=−33 ✓.» | S5-R7; tech plan §8.2 |
| **Q2** | Height of the hover box on the work order | **(a)** Exactly the height Lead Technician and Service Advisor use (the tech plan measures 42px), and Jira's "44px" is out of date. **(b)** 44px. | PRD: [PRD L82] «at the same height as those two fields and the same left edge». Jira: [SV-11265 L27] «at the same 44px height and the same left edge». Tech plan: [L23] «so the plan builds to the existing **42px**.» | S1-R4; SV-11265 |
| **Q3** | How a phone user opens the hidden fields on the work order card | **(a)** With the card's existing edit button, unchanged (PRD and tech plan). Jira's "Show Details" is out of date. **(b)** A control named "Show Details". | PRD: [PRD L149] «They show after the card is expanded with its edit button, as Lead Technician and Service Advisor do today. The expand control itself does not change.» Jira: [SV-11267 L29] «They show after Show Details, as Lead Technician and Service Advisor do today.» | S3-R6; SV-11267 |
| **Q4** | The 10 customers whose rep is no longer a user of the shop | You accepted this as an FYI. Should the PRD say so? **(a)** Add the exception to S4-E1 and Release day ("…except about 10 customers whose rep is no longer a user, which read Unassigned"). **(b)** Keep S4-E1 as written: every customer keeps its name, and the migration must keep it. | PRD: [PRD L196] «On release day every existing customer has the one "Sales Representative" field, with no Service Parts or Part Sales field, and keeps its one representative». Tech plan: [L30] «The Phase 2 migration turns those 10 into "Unassigned".» and [L239] «**Accepted** by Product.» | S4-E1; tech plan §0 |
| **Q5** | What a field shows when its person no longer exists, or belongs to another organization | On the work order **card**: **(a)** "Unassigned". **(b)** "(Inactive)" with no name. **(c)** Leave it blank. In the **audit log**: **(d)** "Unassigned". **(e)** "Unknown". | PRD covers print only: [PRD L251] «A side whose staff member no longer exists prints as Unassigned. A row never reads a bare "(Inactive)".» Tech plan, decision table: [L283] «Behavior change: a cross-org id now reads "(Inactive)" with no name.» Card code shows blank: [L1525] «return opts.options.value.find((o) => o.id === id)?.name ?? (id === snap.id ? snap.name ?? '' : '');» Audit log: [L1670] «"Unknown" for an unresolved id.» | S1-E2, S6-N1, S7-R3; tech plan D4, R-8 |
| **Q6** | Does the part sale card change at all? | The tech plan rebuilds the part sale's field on the new work order field. Its label also changes from "Sales representative" to "Sales Representative". **(a)** That is fine: the label case and the hover look may change, as long as there is no + or x. **(b)** Nothing about it may change: keep the label and look exactly as Part Sales Update v1 built them. | PRD: [PRD L129] «Visually nothing changes there: the part sale card keeps the field exactly as Part Sales Update v1 builds it, with no + button, no remove x and no change to how it looks.» Tech plan: [L297] «The part sale's rep field moves onto the new work order rep component with the + off» and [L1603] «Label case: "Sales representative" -> "Sales Representative"». | S2-N2; tech plan D18 |
| **Q7** | How a customer field shows a person whose Sales Representative switch is off | S4-N2 keeps them on the customer. In Edit Customer and on the customer page, should they read **(a)** the plain name (tech plan), or **(b)** "Name (Inactive)", as on a work order? And in the open dropdown, is it right that no option is checked? | PRD: [PRD L193] «Turning off a staff member's Sales Representative switch, without deactivating their account, leaves them in the customer fields they hold, as today.» The feedback table puts "(Inactive)" [PRD L298] «In the work order field». Tech plan: [L296] «No "(Inactive)" suffix on customer fields». | S4-N2, S4-R19; tech plan D17 |
| **Q8** | Two people (or two tabs) editing the same work order | Tab A adds the Parts field. Tab B still shows one field and picks a person. **(a)** Tab B's save wins and the Parts field disappears, which is what the tech plan's card does. **(b)** Tab B's pick changes only the Labor side, and the Parts field stays. **(c)** Tab B is told to reload. | PRD: [PRD L127] «A side is never refilled on its own.» Tech plan: [L388] «S2-N1 ("a side is never refilled on its own") hold for every caller, including a stale tab or a» and [L389] «The FE still always sends `split` explicitly.» | S2-N1; tech plan §0.1 |
| **Q9** | Who gets a whole-invoice fee on an invoice with no labor and no parts | In S5-R8, does "the labor side is empty" mean **(a)** it has no representative (tech plan), or **(b)** something else? Please confirm the wording. | PRD: [PRD L213] «A whole-invoice amount on an invoice with no labor and no parts dollars goes to the labor representative. If the labor side is empty and the parts side is not, it goes to the parts representative. If both are empty, it is Unassigned.» Tech plan: [L1970] «THEN CASE WHEN LR IS NULL AND PR IS NOT NULL THEN A ELSE 0 END    -- S5-R8» | S5-R8 |
| **Q10** | Where the "Sales Type column on" choice is remembered | **(a)** In this browser only. A different browser or computer starts with it off (tech plan). **(b)** For the user's account, on every device. | PRD: [PRD L228] «S5-R22: A user who turns the Sales Type column on keeps it on for later visits.» Tech plan: [L2233] «persisted in localStorage». | S5-R22 |
| **Q11** | A tablet or touch laptop with a wide screen | The + and x always show on any touch screen with no hover. The card collapses only on a narrow screen. On a wide touch tablet: **(a)** the card opens expanded with the buttons always shown (tech plan). **(b)** It should open collapsed like a phone. | PRD: [PRD L142] «The user is on a phone or tablet: a touch screen with no mouse pointer.» Tech plan: [L289] «"Phone" = `@media (hover: none)`, not screen width» and [L1678] «below `md`». | S3-R2, S3-R4, S3-R6 |
| **Q12** | Today's gap under Lead Technician (low priority) | The developers measure 16px on today's build, while the PRD context note says 36px. The expected result is 16px either way. **(a)** Drop the context note. **(b)** Keep it. Please name the screen where you saw 36px, so the tester can look there. | PRD: [PRD L101] «so the gap to Service Advisor measured 36px while the others measured 16px.» Tech plan: [L29] «Product's reply calls this "a must-fix in this build" and says *"Today the gap under Lead Technician is wrong."*» | S1-R6 context note |
| **Q13** | The Jira stories are older than PRD v8 | Eight requirement texts in Jira differ from PRD v8: S1-R4, S1-R11, S3-R4, S3-R6, S4-R19, S5-R2, S5-N1 and S5-E2. **(a)** PRD v8 wins; please refresh the stories. **(b)** Jira wins for some of them (say which). | Script comparison: 130 identical, 8 different (section b). | SV-11265, SV-11267, SV-11268, SV-11269 |
| **Q14** | Who can open the work order Audit Log | **(a)** As today, users with 'Work Orders — View' or 'View History Logs' (PRD). **(b)** Only users with 'Work Orders — Create & Edit' (Jira). | PRD: [PRD L258] «for users with history access ('Work Orders — View' or 'View History Logs'), as today. Nothing here changes who can open it.» Jira: [SV-11271 L20] «The log opens from Audit Log in the work order's menu, which shows only to those users.» | Story 7 prerequisites; SV-11271 |
| **Q15** | New Customer opened from a part sale by a user who can only make part sales | The PRD names only the work order window. The tech plan lists the part sale window as a fourth place the window opens. It does not give that user permission to load the representative list. **(a)** The field shows and lists reps, as from a work order. **(b)** The field shows "Unassigned" only. **(c)** The field is hidden. **(d)** Whatever happens today. | PRD: [PRD L155] «User has 'Customers — Create & Edit' enabled, or 'Work Orders — Create & Edit' when the New Customer window is opened from the work order window, as today.» Tech plan: [L2379] «**CustomerDialog is shared by four hosts** (Customer page, Customers list, WO dialog, part-sale dialog).» and [L2380] «Without C1 this is an AccessDenied ejection for WO-only and part-sales-only roles.» | Story 4 prerequisites; tech plan §9 |

---

## f. Tech plan version, date and what it says is still open

- **Version / date:** [L3] «**Date:** 2026-10-14». The plan was re-checked against the code on 15 Oct: [L9] «**Planned against:** `develop` @ 022941e459 (re-verified 2026-10-15; includes Part Sales Update v1 #3369).» It was uploaded to us on 19 Oct 2026. The file has no version number.
- **Status:** [L17] «**Status:** Not started — plan approved 2026-10-15; verification tickets SV-11384…SV-11392 (one per phase)»
- **PRD version it was written against:** [L45] «Verbatim from the PRD (Confluence page 919928833, **v8 "Ready for tech plan"**, last modified 2026-10-14 16:41». That is the same version we hold.
- **Open questions:** [L21] «**Open questions / blockers:** none.» All six questions it sent the PO (Q1, Q2, Q3, Q4, Q12, Q13 in its own numbering) were answered and folded into PRD v8.
- **Still open or left to check, by the tech plan's own words:**
  1. S1-R6 gap: [L29] «**The plan treats S1-R6 as a requirement to verify and fix, not as already satisfied:**». The gaps get measured during the build.
  2. Look-and-feel items marked **[design-verify]** wait for an eye check against the design: [L25] «items marked **[design-verify]** are still confirmed by eye in the browser walk against the canvas.» These are the hover fill colour [L585], the split-field arrow offsets [L1581], the box ending at the gap [L1577] and whether the customer window's Save/Cancel stay pinned [L1142].
  3. A production count still to be taken: [L316] «Pre-merge, run `SELECT COUNT(*) FROM invoice WHERE invoice_number NOT LIKE 'P%' AND invoice_number NOT LIKE 'S%';` on prod and record the count in the Phase 8 PR.»
  4. A follow-up ticket after one release: [L369] «**Follow-up (separate ticket, after one release):** drop `company.sales_rep_id/_first_name/_last_name`, the legacy embeddable, the `Company` constructor param, and repoint or remove the out-of-scope Sales Follow-Up report, which keeps reading the frozen columns.»
  5. Developer test coverage is capped. Three flows are on a backlog: the audit log for split / unsplit, the Expanded export on a split invoice, and split / reopen copying ([L2313]–[L2315]).
  6. Existing TestRail cases the developers plan to change or retitle. None of them are ours (Rule 38: report only). [L2321] «**Automated cases whose spec changes:** C30293, C30256, C30255, C154617, C30178, C30174, C30161, C30163, C38923, C30277, C30287, C30274.» [L2322] «rewrite C30312 ("a new work order opens … unassigned" — now contradicts S4-R24)». They also plan five new cases (N1–N5) in sections 4327, "Work Orders - Admin", 50 and 299 [L2320].
- **Jira status:**
  - The epic is "Ready for Development".
  - All 8 stories are "Open" and unassigned.
  - All 9 verify tasks are "Board Backlog", assigned to Nemanja Djuric.
  - Every verify task says "Tech plan: the current copy is held by Milan Zivanovic." It also says that "All nine Phase 1–9 verification tickets Done = the feature is ready for QA."

---

## g. Self-check

- All 138 PRD codes have a row in section b. A script checked this: none missing, none extra, no duplicates.
- Every «…» quote in this file was matched character for character against the line it cites (tech plan, PRD or saved Jira copy). The count and result are at the end of this file.
- Nothing was signed in to, written or posted outside the repository. Jira, Confluence and TestRail were only read.

**Check result (19 Oct 2026):** quotes checked 186 bad 0. Verdict data: TP Counter({'CONFIRM': 96, 'ADD': 38, 'DIVERGE': 4})
