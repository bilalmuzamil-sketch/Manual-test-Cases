# Chunk 1 source-update review — running reading notes (2026-10-06)

Purpose: provable reading coverage + findings carried across context limits. Appended after every chunk read.

## Progress log

### Spec (Chunk 1 MR, Confluence 886931488)
- CURRENT copy `sources/CONFLUENCE-886931488-Chunk1-MR-2026-10-06.md` (816 lines, 66,403 B): READ lines 1-816 in full (Read tool).
- OLD copy `sources/CONFLUENCE-886931488-Chunk1-MR-2026-09-29.md` (779 lines, 57,218 B): diffed in full by script — every anchor line (254) and every non-anchor line compared. Output: `anchors-old-new.json` (this folder).
- Anchor diff: old 254, new 270; ADDED 19 (S1-R14, S4-R7, S4-R8, S4-R9, S5-R13, S6-E5, S11-R26, S11-R27, S18-R1..R6, S18-R17, S18-R19, S13-R43, S14-R13, S21-N3); REMOVED 3 (S3-R12, S7-N1, S7-N3); CHANGED 49; same 202.
- Non-anchor prose changed: intro ("no feature flag"), design checked 2 Oct 2026, Reusable components pointer, "note for the build", S1 where-it-lives (org-wide schedules), S5 user story (due soon, not customer reminder), S8 user story (end date), S8 "Term and the two dates" intro, confidence matrix replaced by locked table + "What each level shows" + Evidence para, new "Mark complete: the manual reset" section prose, S13 row-actions prose (Mark complete shortcut).

### Live cases (81, snapshot chunk1-cases-before.json)
- 264 quotes checked: 210 OK, 51 MISMATCH vs current spec, 3 cite removed anchors (S3-R12 C146325, S7-N1 C146339, S7-N3 C146345).
- Quote-fidelity defects that pre-date the spec change (old spec had the same text): quotation marks around "Every"/"At" dropped (C146318 S2-R6/S2-R7, C146320 S2-N7, C146322 S2-E3, C146341 S7-E1/S7-E2); "unenrolls" spelt "unenrols" (C146336 S6-R6, C146338 S6-E4).
- 21 current anchors cited by no case: S1-R14, S2-R19, S4-R7, S4-R8, S4-R9, S5-R13, S6-E5, S7-R7, S11-R26, S11-R27, S18-R1, S18-R2, S18-R3, S18-R4, S18-R5, S18-R6, S18-R17, S18-R19, S13-R43, S14-R13, S21-N3.
- GLOBAL staleness: all 81 cases' preconditions say the feature "ships behind the maintenance_reminders flag" — spec now: "ships to every organization at release, with no feature flag". mr_lib MARKER text also names the flag (stale; flagged to QA lead, not changed by me).
- 7 S1 cases + C146339 say schedules belong to "the location chosen in the header" (now org-wide with home location).
- Other stale terms: absorb (146314,146323,146329), expiry/effective months (146326,146332,146341,146346-9,146354,146383,146384), On Hold (146363), per page (146361), Enroll in maintenance schedule (146342), inactive (146370), numeric suffix (146335), vi1 (146313), artefact/DVI attachment (146347), month-end (146322?,146348,146382,146383), sender/switched on/Resend (146372), lower-of (146385), Certificates tab (146349), Add a customer/no customer (146339,146351,146368).

### Confluence history pages
- `sources/CONFLUENCE-841678852-Review-Decisions-Open-Questions-2026-10-06.md` (265 lines, 100,547 B): READ IN FULL (bytes 1-100,547 in four slices). Content: R1-R3 reviews 4-8 Sep 2026 (MF-1..62, FF-1, DF-1..9, OQ-1..36, DR-1..91). All pre-date the chunk page; superseded where they differ (e.g. DR-30 km/mi acronyms reversed; DR-49 customer-facing name removed (S2-R3); DR-69 Snooze removed; DR-10 Resend removed (S14-R5); DR-45/47 automatic mail deferred to v2). No item adds a Chunk 1 tester-visible behaviour not already in the 5 Oct chunk page. Verdict: CONFIRM/superseded, nothing to ADD.
- `sources/CONFLUENCE-891519016-Run-log-Chunk-one-2026-10-06.md` (11 lines, one 78,027-char JSON line; 78,435 B): READ IN FULL (three slices). JSON mirror of page 892305428 (items MF-1..21, FF-1..7, DF-1..2, OQ-1..5, DR-1..12). Nothing new.
- `sources/CONFLUENCE-892305428-Review-Decisions-Chunk-one-2026-10-06.md` (fetched + saved this session; read in full in the MCP result). R2 (28 Sep) findings vs current spec: MF-12 answered by S13-R16 "A Needs readings row keeps every action"; MF-13 answered by S8-R10 days/End date; MF-17 answered by S7-R4 name-match rule; MF-19 partially by S2-N9; MF-20 answered by S8-R13 Compliance section; MF-21 answered by S21-N3 (no screen in v1); FF-1 by S13-R42; FF-2 by main page "Every screen ... works on a phone"; FF-4 by S9-R13 Undo skip; FF-5 by "no feature flag"; FF-6 by S1-R2 columns/default sort + S1-R8; OQ-3 by S8-R12 last sentence. Remaining open in that page and not answered in spec: MF-14 (reading correction - Chunk 2), MF-15 (At milestone lifecycle - Chunk 2 S12), MF-16 (rate - Chunk 2), MF-18 (14-day window - Chunk 2), OQ-4 (observed date - Chunk 2), OQ-5 (fleet size - not testable), FF-7 (feedback table). None needs a Chunk 1 case.
- `sources/CONFLUENCE-891944985-Review-Decisions-Chunk-three-2026-10-06.md` (fetched + saved; read in full). R1 25 Sep worklist: DR-1 no customer/status filter (S13-R12 CONFIRM), DR-2 header drops New customer action (S13-R32), DR-3 no money (main page key decision), DR-4 status badge beside WO (S13-R14/R25), DR-5 three-dot menu (S13-R16), DR-6 confidence on rows (S13-R34); OQ-1 Invoice answered by S13-R26.
- `sources/CONFLUENCE-833290250-Maintenance-Reminders-V1-2026-10-06.md`: fetched + read in full (MCP result); file was re-saved by the Chunk 2 reviewer with identical body (header line differs). Key decisions relevant to Chunk 1 tester behaviour: no feature flag; standard loading state "never a zero that reads as nothing due" + "standard error with Retry"; "A failed save keeps the form open with its values"; dates follow org date format; "Every screen in this release works on a phone. Tables become cards, dialogs open full screen, row and header menus open as action sheets, and every hover opens on tap."; permissions: worklist + asset tab behind view customers; enrol/remove/reading/skip/mark complete/send behind create and edit customers; create WO + add lines behind create and edit work orders; Settings tabs behind Settings Service; "Every gated action is hidden from a user without its permission"; no money on worklist; downstream surfaces unchanged.

## Plan 1 tech plan (`sources/tech-plan/Plan-1-Track-act-clear-Technical-Implementation-Plan.md`, 5,363 lines, ~680 KB)
Max line length 2,875 chars; 2 lines >1,900 chars (checked separately with awk/cut so the Read 2,000-char line cap loses nothing).

### Lines 1-340 (header, §0 Execution State, §1 S1-S10 tables) — READ
- Header: no feature flag (D27); Plans 1+2 tested together on one branch build (D28) → Plan 1 "interim states (automatic reset at invoicing with no visible step, no Send reminder) never reach develop". Tester note: test on the branch build carrying Plan 2.
- Design handoff markdown is stale (spec v7-v12): "The PRD wins wherever they differ" (line 7).
- Q-answers that are tester-visible and already in 5 Oct spec: Q2 ceilings (Chunk 2), Q5 file types (S8-R9), Q6 50 rows on scroll (S13-R37), Q7 On Hold removed / no inactive / S3-R12 removed, Q8 name match / renewal drives at once / location column for all users, Q8a + Q17 before row < interval, 30 days/month, "a yearly At as 365" (line 59) [tester-visible detail beyond spec text -> ADD to S5 before-row case as Plan 1 quote], Q9 (S18-R19), Q11 any contact with email (S14-R13), Q12/Q18 rest after completion, Needs readings stays, enrolment "Mark as done" rests the row (S13-R43).
- §1 S1-E2 (line 103): names unique across the organization, ARCHIVED INCLUDED -> tester-visible detail not in spec -> ADD (Plan 1 quote "Names unique across the organization (archived included); duplicate named (Copy), (Copy 2)").
- §1 S4-R1/S4-R7 (lines 169-170): for an unsaved NEW schedule the picker lists the HEADER location's canned lines ("header workplace for an unsaved schedule"); home location = where first saved -> ADD detail.
- §1 S4-R9: BE 403 refusals (API) -> EXCLUDE (API); FE read-only step is the tester-visible half (spec).
- §1 S7-R1: the work-order entry point is Plan 2 (Chunk 2 surface) -> enrolment from WO panel not a Chunk 1 case.
- §1 S7-R20: "Add contact" = the existing create-contact dialog (FE) -> tester-visible: way to add a contact opens the app's existing contact dialog.
- §1 S8-R9: engineering replaces "reuse DVI attachment" with a new upload field; spec 5 Oct already says one PDF/JPEG/PNG ≤10 MB -> consistent, CONFIRM.
- §1 S8-R12: edit refused on a non-current record (409) -> tester sees earlier records read-only (spec) -> CONFIRM.
- §1 S8-R10: same day number, clamped both directions (End − term too) -> tester-visible: End 31 Mar, term 1 month -> Start = last day of Feb. Spec text covers "+" direction only; "both directions" is Plan 1 detail -> ADD to certificate date case.
- S10 rows are Chunk 2 (reading dialog) except where shown on the asset tab (S9 Enter mileage) -> out of scope except as Chunk 1 copy.

### Lines 340-666 (§1 S11, S12, S13, S14, S21, S18 subset, S16/S17/S22 subset, deferred list, NFR, NFR-F, Clarifications, Product answers index) — READ
- S11/S12 rows: Chunk 2 rules. Tester-visible on Chunk 1 surfaces but NOT copied on the Chunk 1 page: S11-R12 estimated mileage rounds to 100 / hours to 10 (asset tab reading card), S11-R18 rate "640 a week", S12-R14 today = header location's day -> left to Chunk 2 reviewer (boundary note in findings), not proposed here.
- S13-R14 (line 439): Plan 1 partial — Mark complete against a WO with no link writes no link, so that WO is not shown on the row until Plan 2 TD-110. Plans ship together -> no tester impact on the merged build; note only.
- S13-R25 (line 440): maintenance surfaces never show "On Hold" -> UPDATE C146363 (drop On Hold).
- S13-R26 (line 445): Plan 1 has no visible step after invoicing (Plan 2) -> Invoice action navigates to invoicing; CONFIRM.
- S13-R41 (line 446): orange border only when contact has no phone AND no email AND customer has no company phone -> UPDATE C146366.
- S14-N4 (line 460): action to set a preferred contact = existing change-contact flow -> tester-visible: uses the app's existing set-contact control.
- S18-R17 / S18-N8 Plan 1 half (lines 498, 504): Undo complete only for the latest Mark complete (On a work order / Completed elsewhere); a reset by invoicing, a covered reset or the enrolment "Mark as done" offers no Undo complete -> ADD detail in the Mark complete toast/Undo case (Plan 1 quote).
- S18-R19 (line 503): readings recorded and "undone by Undo complete" -> ADD detail to S18-R19 case.
- NFR-F01 (line 571): existing screens keep every element; maintenance additions render only for users with the permission -> supports permission ADD case.
- NFR-F03 (line 573): "No "0" or empty state while a count or list is loading (skeleton/spinner)" -> ADD loading-state case (with main-page key decision quote).
- NFR-F08 (line 578): "Hover content reachable by hover, focus, Enter/Space and tap. Esc closes. Phone uses a sheet" -> ADD keyboard/tap hover case.
- NFR-F10 (line 580): "Phone (<sm) dialogs fullscreen. Lists become cards below md. Menus become action sheets" -> ADD phone layout case (main page key decision quote).
- NFR-F09 vocabulary -> CONFIRM C146319.
- NFR-001..024 backend: org scoping, no FKs, sync projection, performance p95, bulk cap 2,500 vehicles per request (NFR-009: "capped at 2,500 vehicles per request (400 above)") -> tester-visible? Only as an error when >2,500 assets ticked; seeding 2,501 assets is not realistic by hand -> EXCLUDE (performance/API limit). NFR-018 certificate file download via authorized endpoint -> EXCLUDE (security internals). Rest EXCLUDE (DB/API/perf).
- Clarifications/Product answers: all consistent with 5 Oct spec; no conflict found. DQ1: placeholder vehicles ('NEED VIN', 'PARTS SALE') linked to every customer will appear in bulk enrolment lists -> tester note only.

### Lines 667-975 (§2 Architecture: 2.0-2.13 incl. 2.11 Seam UI) — READ
- 2.0-2.4, 2.12: backend modules/aggregates/ports/events -> EXCLUDE (architecture; not tester-visible). One tester-relevant fact (2.3/2.4): status, confidence and "today" are derived at read time with "today" from the header location's timezone (Chunk 2 S12-R14) -> boundary note.
- 2.6 Routing: worklist is `customers?tab=maintenance` (address carries the tab) -> supports S13-R42 "carried in the address"; asset tab is the 4th child tab `maintenance` of the asset page; Settings nav item placed after Inspection Templates -> CONFIRM C146309.
- 2.7: "A location switch already calls queryClient.clear()" -> tester-visible: switching header location reloads the maintenance lists (no stale "today") -> EXCLUDE as implementation detail (no expected wording); covered behaviourally by Chunk 2 S12-R14.
- 2.8 Permission gating (lines 866-883): canManageSchedules = Settings Service; canView = view customers (asset tab + worklist); canEditCustomerSide = edit customers for "enrol, remove, record, reading, skip, Mark complete, toggle, Add contact"; canCreateWorkOrder = edit work orders (Create work order); canOpenInvoicing = invoicing/payments view + see financial data (the Invoice row action) -> Invoice gating is a Plan-1-only detail (spec silent) -> ADD to permission case as Plan 1 quote? The only quotable text is code -> record as tester note + DIVERGE? No conflict, spec silent -> include in ADD permission case with the prose quote "The Settings nav item is gated on `settingsService` only. It does **not** copy the DVI gate" (line 879-880) for the Settings half; Invoice gating noted as a question (no prose sentence).
- 2.9 Shared components (lines 891-899): QueryState = "spinner, then "Unable to load {subject}." + Retry" -> ADD loading/error case quote; HoverCard = "hover, focus, Enter/Space, tap; Esc, blur and leave close it; rich slot; bottom sheet on phone", used by S4-R5 line count, S2-R4 calendar (i), S3-R3 type (i), ConfidenceMeter, S13-R41, S18-R1 (i) -> ADD hover-access case; ResponsiveActionMenu = desktop dropdown / phone bottom action sheet, "per-action disabled reason; hidden when not permitted" -> phone case; EditableTitle revertOnBlank -> CONFIRM C146313.
- 2.11 Seam UI (lines 921-932): Plan 1 ContactCard shows no send button and a line "Maintenance notifications are off for this customer"; Plan 2 fills Send reminder. Plans ship together (D28) so the tester sees Plan 2's version; "Available soon" never appears. -> CONFIRM/no Chunk 1 change; check Plan 2 for the disabled-reason wording.
- 2.13: Plan 2 reuse list -> EXCLUDE (structure).

### Lines 976-1075 (§3.1 settled decisions D0-D29, §3.2 TD-01..TD-36) — READ
- D3 / TD-10 (lines 1007, 1048): schedule READS on the API are gated by work-order view, "wider than the PRD's "Settings tabs behind Settings Service""; the Settings UI itself is gated on Settings Service -> API-only, not visible in the UI -> EXCLUDE (API), flagged in findings as an engineering-acknowledged deviation at API level (security reviewer's question, not a manual case).
- D13 (line 1017): Invoice row action "only navigates to the WO invoicing, never arms the invoice shortcut" -> CONFIRM S13-R26 case wording ("opens that work order's invoicing").
- D21 (line 1025): "After the first Save of a new schedule the editor stays open, does router.replace to the schedule's /:id route and shows a success toast" -> tester-visible, spec silent -> ADD detail to S1-R4 case (C146311 UPDATE) with Plan 1 quote.
- TD-23 (line 1061): name normalisation = trim, COLLAPSE INNER WHITESPACE, lower-case. Spec S7-R4: "Names match ignoring capitals and surrounding spaces" -> plan is broader (inner spaces) -> DIVERGE (PO question; case follows spec only).
- TD-27 (line 1065): skip auto-clear: routine on new reading or new/switched WO; compliance on any record change -> CONFIRM S9-R18 (C146356).
- TD-28 (line 1066): Mark complete WO picker lists the asset's service WOs from every location, "ordered updated_at DESC" (most recently updated first), "paged 20" -> tester-visible detail -> ADD to Mark complete "Where was it done?" case (Plan 1 quote).
- TD-33 (line 1071): both dates typed -> both kept as typed; "14 Oct 2025 + 12 months = 14 Oct 2026, valid through 14 Oct and overdue from 15 Oct"; clamp both directions -> ADD (certificate case: End − term clamp) + CONFIRM S8-E2.
- TD-36 (line 1074): "Undo complete, an invoice reversal and the VOID reconciliation restore the previous last_done_path, so the row returns" -> ADD to Mark complete Undo case: after Undo complete the worklist row returns.
- TD-01..09, 11-22, 24-26, 29-32, 34-35: storage, modules, events, kill switch, ORM/DBAL, audit writer internals, lifecycle hooks, copy-mode internals -> EXCLUDE (backend). TD-32 copy-mode line note text "Copied from {home}. Parts used there, for reference:" is visible on the WORK ORDER (Chunk 2 S16-R23) but is reached from Chunk 1 Create work order at a non-home location -> covered by NEW S13-R30 case at a non-home location (quote S13-R30 only; line-note wording is Chunk 2's).

### Lines 1076-1163 (§3.3 FD-1..FD-29, §3.4 BR1-BR22, §3.5 FR1-FR22) — READ
Tester-visible items found:
- FD-12: worklist filters persist in user preferences + address (keys mr_tiles, mr_compliance, mr_locations), sort in the preference blob -> CONFIRM S13-R42 (C146370).
- FD-16 (line 1095): Open/Invoice from the org-wide worklist (and the Mark complete picker) push the WO's location "so useWorkOrderLocationResolver offers the location switch" -> ADD: opening a work order that belongs to another location offers to switch location (spec silent).
- FD-20: Undo toasts use the app's existing Undo affordance -> CONFIRM.
- FD-23 (line 1102): "Lines from {name}" is also shown on each enrolment schedule option, and "A new schedule shows the header workplace's name ... until its first Save" -> ADD to S1-R14 case.
- FD-24 (line 1103): read-only canned lines hide Add canned lines, remove AND Move up/down; (i) text "These lines belong to {home}. Only someone with access to {home} can change them." -> matches S4-R9 -> ADD S4-R9 case.
- FD-28 (line 1107): note text "A reminder before the due date must be shorter than the {n}-day interval"; while rows are untouched defaults the 14-before row "is present only when intervalDays > 14 and follows interval changes; once the user edits a row nothing is added or removed automatically"; months = N × 30; yearly At = 365 -> ADD S5-R13 case + S5-R12 boundary case.
- FD-29 (line 1108): no-email note "None of this customer's contacts has an email address, so no reminder can be sent." with button "Add contact" (edit customers only) opening the existing contact dialog; same rule on customer card, enrolment, worklist contact card -> UPDATE C146343 / ADD.
- FR8: tiles show a skeleton until data arrives (no wrong "0") -> loading case.
- FR10 (line 1150): Invoice row action "Hidden when the user lacks the finance route permissions (falls back to Open work order)" -> ADD to permission case.
- FR12 (line 1152): bulk list unpaged ≤2,500 with a truncation caption; search server-side; "Selections are kept by id across searches" -> ADD to bulk enrolment case (selection survives a search).
- FR13 (line 1153): Settings Maintenance nav "visible with DigitalInspections off" -> ADD to Settings access case.
- FR1: Customers list kept verbatim, "keep-alive panels so tab switches don't reset the list" -> ADD detail to S13-R32 shared-search case? (switching tabs keeps the customer list state) -> include in worklist tab case (Plan 1 quote).
- FR19: users see schedules built elsewhere; S4-R9 read-only -> same as S4-R9 ADD.
- All BR (backend risks) -> EXCLUDE (internal); BR6/FR12 cap 2,500 -> EXCLUDE (not hand-seedable).
- FD-1..FD-11, FD-13..FD-15, FD-17..FD-19, FD-21, FD-22, FD-25..FD-27: implementation choices; FD-11 infinite scroll, no numbered pager -> CONFIRM S13-R37 new wording; FD-22 location column by org workplace count -> CONFIRM S13-R9; FD-18 accept PDF/JPEG/PNG + client size check ≤10 MB -> ADD to attachment case.

### Lines 1164-1507 (§4 Database: 4.1 tables, 4.2 DDL, 4.3 migration rules, 4.4 data migrations) — READ
- All table/column/index/migration content -> EXCLUDE (database; not tester-visible), except:
  - Length limits: schedule name, service name VARCHAR(120); certificate number VARCHAR(64); elsewhere shop name VARCHAR(160). No UI wording or behaviour for over-length input exists in spec or plan -> not proposed as a case (would invent an expectation); listed in findings as a PO/engineering question (what the form does at 121 characters).
  - `maintenance_compliance_record.voided_at` "Undo complete voids the record it created" (line 1268) -> tester-visible: after Undo complete on a compliance Mark complete, the certificate added by that Mark complete is no longer the current record -> ADD to compliance Mark complete case (Plan 1 quote).
  - `company.maintenance_notifications` DEFAULT 1 for every existing row (line 1502) -> CONFIRM S7-R17 (C146343).
  - 4.4 historical load: past WO and imported readings loaded once "on the QA environment after each branch-build deploy" (line 1504) -> TESTER PRECONDITION NOTE: reading cards/estimates on the asset tab depend on this load having run on the QA environment; not a case.

### Lines 1508-1704 (§5 API: 5.1 wire rules, 5.2 contract A1-A34, 5.3 backend view) — READ
- Wire rules, status codes, DTO shapes, gates, id checks, handlers -> EXCLUDE (API; a manual tester cannot call or inspect them).
- Tester-visible facts embedded in the contract:
  - A3 (line 1551): duplicate name message text "A schedule with this name already exists." -> CONFIRM S1-E2 wording (UPDATE C146313 to the new spec text).
  - A7 (line 1555): "archived names stay reserved ... so a restore can never collide" -> supports ADD "name of an archived schedule is refused".
  - A9 (line 1557): enrolment customer chooser capped at 50 linked customers and searchable -> tester-visible only for an asset with >50 customer links (placeholder assets, DQ1); EXCLUDE as a separate case (seeding 51 customer links by hand is impractical); noted.
  - A12 (line 1560): bulk asset list "sorted by unit" -> ADD detail to bulk enrolment case.
  - A20 (line 1568): wrong file type or >10 MB refused -> ADD to certificate attachment case (spec S8-R9 is the quote; plan FD-18 adds the client size check).
  - A24 (line 1572): Undo complete never offered for invoice/covered/enrolment completions -> same as S18-N8 Plan 1 half (ADD detail).
  - A29 (line 1577): Undo refused "once a later completion exists" -> ADD detail (Undo complete only on the latest Mark complete).
  - A33 (line 1581): a live linked WO already exists -> 409; UI offers Open work order (S13-R14) -> CONFIRM.
  - "No money field appears in any MR response" (line 1640) -> CONFIRM key decision "The worklist shows no money" (C146365/C146329).

### Lines 1705-1889 (§5.4 FE view of the contract, DTO shapes, modified endpoints; §6 intro + gates; P0 header + BE table start) — READ
- 5.4 item 4 (lines 1724-1725): duplicate-name and Reset-date errors "render inline without a second toast"; "an undo that is no longer allowed shows "This can no longer be undone" instead of the generic conflict toast" -> tester-visible string -> ADD to Mark complete Undo case (stale Undo complete, e.g. after a later completion made in another browser tab).
- A11 (line 1747): enrol error -> "toast, dialog stays open" -> CONFIRM key decision "A failed save keeps the form open with its values" (loading/error case).
- A33 (line 1769): live WO already exists -> toast, row then shows Open work order -> CONFIRM.
- DTO shapes, wire rules, modified existing endpoints (behaviour unchanged) -> EXCLUDE (API/code). Modified endpoints note: creating a WO by hand is unchanged; asset delete/merge flows dispatch events, responses unchanged -> no visible change.
- §6 gates (lines 1850-1867): includes "a walk of every touched existing screen as a user without the new permission" -> supports permission ADD case. Rest EXCLUDE (CI/dev gates).
- P0 BE table rows to line 1889: access gate atoms, entity_event types, today port -> EXCLUDE (backend).
- Design-drive coordination: a separate worker is driving the whole design (DESIGN-DRIVE-2026-10-06/DESIGN-DRIVE-FINDINGS.md); fold in if it exists before finishing.

### Lines 1890-2088 (P0 FE table, code sketches, tests, browser-walk, E2E P0-1) — READ
- Customers page tab labels "Customers" and "Maintenance reminders" (line 1957-1958) -> CONFIRM C146358.
- keep-alive (line 1986): "stops a tab switch from re-mounting the Vuex list and losing its scroll and pagination" -> ADD detail: switching to the worklist and back keeps the customer list's scroll position/page (Plan 1 quote).
- New customer only on the customers tab; search kept across tabs; mr_* filter keys dropped from the address on tab change and "restored from user prefs on return, S13-R42" -> CONFIRM C146358/C146370.
- DueBadge (line 1910): "Overdue red except compliance (orange, S3-R10). Grey Skipped. "Completed" chip" -> CONFIRM C146354/C146327; "Completed" chip relevant to Mark complete ADD case.
- DueCell (line 1911): line 2 values "Calendar", "Certificate", ConfidenceMeter, "Calendar · needs mileage reading", "No record"; dates per org date format -> CONFIRM C146355/C146364.
- ConfidenceMeter (line 1912): "3 bars + word. Low is never red"; hover holds the rule, the fixed disclaimer and "View work orders" -> ADD case for S11-R27 (uncited anchor).
- HoverCard (lines 1899, 2017): "300 ms open delay on hover only"; "a 150 ms grace on leave"; opens on focus, Enter/Space, click/tap; closes on Esc, blur, leave -> ADD hover-access case.
- EditableTitle (line 2054): commit on Enter/blur, Esc reverts, blank reverts -> ADD detail to S1-N3 case (Esc reverts) — Plan 1 quote.
- VehicleTabsBar: tab counters except Work Orders; existing tabs unchanged -> CONFIRM.
- Fullscreen dialogs on phone width (prop) -> phone ADD case.
- BE/FE unit tests, gates -> EXCLUDE (developer tests), but they confirm behaviours above.

### Lines 2089-2263 (Phase P1 Settings: BE/FE tables, sketch, tests, browser-walk, E2E P1-1..P1-4) — READ
Tester-visible:
- AdminLeftMenuNav (line 2131): nav item label "Maintenance schedules" (q-route-tab) — spec S1 "Settings, Maintenance, beneath Inspection Templates" / S1-R1 "a Maintenance entry". LABEL QUESTION -> check design board; if design differs from spec record DIVERGE (spec is authority for behaviour; label from design/spec only).
- Schedule list (line 2134): Active/Archived tabs with count badges; default sort name ascending; Assets plain text; row menu Edit, Duplicate, Archive / Restore; empty state "No maintenance schedules yet" + New schedule; FilteredTableEmptyState for a search with no match; list NOT scoped by header location -> ADD: org-wide list stays the same after switching header location (Plan 1 browser-walk 1b "Switch the header location to B and the same schedules stay listed").
- Editor (line 2137): Cancel/Save; "CloseConfirmationDialog when dirty (Cancel and onBeforeRouteLeave)" -> leaving the editor by navigation with unsaved changes also asks -> ADD detail to S1-R8 case; duplicate-name error inline under the title with no extra toast; archived read-only: "every control disabled, Restore shown"; D21 success toast + stays open after first Save; header caption "Lines from {home}"; a new schedule shows the header workplace name.
- ServiceTable (line 2139): "4 lines · 3 covered" HoverCard; Move up/down; row menu "Edit / Remove (confirm, S6-R11)".
- ServiceFormDialog (line 2140): steps order; covered step only with ≥1 other routine service and not compliance; "the failed save keeps the dialog open" (line 2185).
- TriggerBlock (line 2142): plain line "Comes due at whichever trigger arrives first" -> label from plan + design screenshot ("Comes due at whichever trigger arrives first.") -> CONFIRM C146321 (check its wording).
- ComplianceBlock: Type + (i) examples; term 1-60 list; Remind before expiry defaults 1/2 months; ≤ term.
- ReminderTimingRows/serviceFormRules tests (lines 2170, 2178-2179) give exact boundaries: "13 and 14 days drop the 14-before row, 15 keeps it; before = interval refused, interval − 1 accepted; 1-month interval → 29 accepted, 30 refused"; "every 3 months → 89 accepted, 90 refused; yearly At → 364 accepted"; note "absent at 15 days and for months"; "untouched defaults follow an interval change across 14 days (row removed, then restored); after a row edit nothing is added or removed automatically" -> ADD S5-R12/S5-R13 cases (spec quotes + Plan 1 quotes).
- Browser-walk P1 (lines 2194-2208): exact note "A reminder before the due date must be shorter than the 7-day interval"; read-only canned lines for a user without access to the home location (remove access in Settings › Users); phone 390 px: service form fullscreen, row menu action sheet; tech without settingsService: no nav item, direct URL denied -> CONFIRM/ADD.
- E2E P1-1 (line 2220): interval reads "10,000 mileage · 6 months", "1 line"; P1-2 (line 2233-2235): "2 lines · 2 covered"; keyboard focus/Enter opens the hover card; removing PM-A -> "PM-B keeps its 2 lines, and the covered count is 0" -> ADD to S6-R11 removal case (C146334 UPDATE).
- P1-3: Duplicate opens the editor on "(Copy)"; archived opens read-only "only Restore offered"; P1-4: deep link redirects away.
- BE classes/handlers/VOs, unit/functional tests -> EXCLUDE (code), used only as confirmation.

### Lines 2264-2416 (Phase P2 header, DB, BE table, FE table, sketches) — READ
Tester-visible UI strings and rules (FE table lines 2311-2324, sketch 2333-2379):
- Enrolment dialog static title "Enroll in schedule" (S7-R7 has no wording; plan gives it) -> ADD S7-R7 case (uncited anchor) with Plan 1 quote.
- Body line "{unit} · {customer}" at normal weight (S7-R7).
- Customer chooser: preselected and shown as text when exactly one; searchable; >50 links caption "Showing 50 of {customersTotal}. Type to search."; "the schedule Select is disabled until a customer is chosen" -> ADD detail to S7-R23 case (C146339 UPDATE?) — keep to quotes.
- Schedule options show "Lines from {homeWorkplaceName}" when >1 workplace; schedules the asset is already on are filtered out (S7-E8).
- Service row: "(optional)" inline, date input max today, hint "Blank counts from today", Needs mileage/engine hours reading badge, meter-At-passed "Mark as done" (default) / "Leave due", compliance line "{number} · ends {endDate}" or "No record" + "+ Add record" opening the certificate fields inline.
- Bulk Assets section: server search type/make/unit/VIN; greyed "Already on this schedule"; "{n} of {m} have a last service on record; the rest count from today" computed from ticked assets; truncation caption "Showing {assets.length} of {total}. Search to narrow."; "Selections survive a search change"; confirm "Enroll N assets"; "Select all" ticks only assets not already on; a toast after submit (enrolled / skipped counts).
- Notification checkbox label "Send preventive maintenance notifications"; writes immediately; stands if cancelled; disabled without edit customers.
- Confirmation caption "The rows appear on the worklist. No emails are sent for them." -> S7-R10 wording -> CONFIRM/UPDATE C146345.
- No schedules: message + "Create a schedule" link (only for Settings Service users) -> S7-N6 (C146339) ADD detail.
- No-email note under the checkbox + Add contact; contact dialog stacks over enrolment; note clears after saving a contact with an email -> ADD (S7-R20 case).
- CertificateFields: type prefilled from the service, term, Start date, End date, Certificate number, attachment; half/full widths; derivation preview.
- CertificateAttachmentField: accept pdf/jpeg/png, ≤10 MB client check, file chip with open/replace/remove.
- CertificateRecordDialog: add / edit-current; read-only history list beneath.
- ComplianceSection: "CVIP · AB-4471902 · ends 14 Oct 2026" per current record, + Add record (edit customers only); placed "after the Preferred Contact card" (spec: "below Contact") -> CONFIRM.
- Customer card toggle "Maintenance notifications"; Off -> inline "N enrolled units will not receive reminders" (S7-R19); no-email note + Add contact; toggle disabled without edit customers (S7-R22) -> UPDATE/ADD.
- Customer Assets tab: "Enroll in Schedule" button beside New Asset, only for users with edit customers.
- Code (BE classes, CalendarMath sketches) -> EXCLUDE; certificate sketch confirms clamp both ways.

### Lines 2417-2539 (P2 tests, browser-walk, E2E P2-1..P2-5) — READ
- certificateDates.spec (lines 2431-2436): "14 Oct 2025 + 12 → 14 Oct 2026"; "31 Jan 2026 + 1 → 28 Feb 2026; 31 Jan 2028 + 1 → 29 Feb 2028; 30 Nov + 3 → 28 Feb (non-leap)"; "a typed End beats a derived End, and a typed Start beats a derived Start"; "a changed term re-derives only the untouched date" -> ADD to certificate arithmetic case (C146383 UPDATE) with Plan 1 quotes.
- Browser-walk P2 (lines 2459-2471): bulk "search "Heavy" narrows ... tick 3; enroll; toast; reopen: those 3 are greyed"; toggle off -> "N enrolled units…", persists on reload; no-email note -> Add contact -> note disappears; certificate "End 14 Oct 2026, term 12 → Start 14 Oct 2025; change Start → End follows unless End was typed"; "attach a PDF (and a 12 MB file is refused)"; line "Type · number · ends D Mon YYYY"; renewal -> history read-only; phone modals fullscreen; "As tech without customers edit: the toggle is disabled and no Enroll in Schedule button shows" -> ADD/UPDATE cases (S7-R22 toggle disabled-not-hidden, S7-R24 button hidden).
- E2E P2-1..P2-5: confirm the above; P2-3 exact "2 enrolled units will not receive reminders"; P2-5 archived schedule shows Assets 0 and is not offered in Enroll in Schedule -> CONFIRM C146336.
- Backend/frontend unit/functional tests -> EXCLUDE (developer layer).

### Lines 2540-2708 (Phase P3 Readings) — READ
- Reading capture at every entry point, idempotency keys, historical load CLI, transactional WO handlers -> EXCLUDE (backend; Chunk 2 S10 behaviour).
- ReadingDialog (lines 2591-2593): mounted on the Chunk 1 asset tab as "Enter mileage" (S9); labels "Mileage" / "Engine hours"; current value read-only with source + age, "In the shop" state; orange confirm block with "Save anyway" / "Change"; Undo toast; a stale undo shows "This can no longer be undone" -> the dialog's rules are Chunk 2 (S10) and are not copied on the Chunk 1 page -> boundary: Chunk 1 keeps only S9-E2 (entering a reading here recalculates immediately) -> CONFIRM existing S9-E2 coverage; dialog detail left to Chunk 2 reviewer.
- Browser-walk P3 regression (existing WO mileage and asset edit inputs keep working) -> no Chunk 1 case (existing-screen regression; noted).
