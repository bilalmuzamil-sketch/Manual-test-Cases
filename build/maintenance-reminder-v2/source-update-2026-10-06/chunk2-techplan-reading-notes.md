# Chunk 2 — tech-plan reading notes (2026-10-06)

Plan 2 file: `sources/tech-plan/Plan-2-The-work-order-and-the-customer-Technical-Implementation-Plan.md` — 3,240 lines, 451,369 bytes. Read sequentially with the Read tool; every range below was read in full.
Classification: TV = tester-visible (feeds a case), EX = not manually testable (reason), INFO = context only.

## Plan 2 L1–220 (header, §0 Execution State, §1 S16/S17/S18/entry-points/S14 tables)
- TV L14/L55: nothing-dated line is literally "Nothing is scheduled for {unit} yet." — greeting, call to action, signature and footer stay; Send stays offered and sends (S19-R23).
- INFO L12/L27: no feature flag (D27/D28); one shared branch; no Plan 3. => the HOLD marker text in mr2_lib.py ("ships behind the maintenance_reminders flag") is now factually stale (report to coordinator; do not change the marker).
- TV L38: ASSUMPTION — S19-R9 "a guessed date" = ANY meter-estimated date at any confidence → "Soon"; asked of Product 2026-10-05 (reply 919502849), unanswered. => DIVERGE/PO question (spec says "including every Low confidence date", not explicitly all estimates).
- TV L44 (PQ-12): an invoice completion is NOT undoable (no Undo complete for a service reset by invoicing); A29 refuses it.
- TV L51 (PQ-22): greeting strings with trailing comma: "Hi Dave Brabay," / "Hi Dave Brabay and Lisa Brabay," / "Hello,". Preferred contact first when ticked.
- TV L52 (PQ-23): every contact listed; no-email contact unticked, cannot be ticked, shows "No email" + Add email, writes the address onto the contact.
- TV L53 (PQ-24): Send reminder never disabled; nothing due within 91 days → next two upcoming as Coming up.
- EX L73: non-production mail sink/allowlist (NFR-118) — environment safety; tester note only: on QA, mail may go to a sink, so recipient receipt may need the sink.
- TV L120 (S16-R2): badge counts top-level due rows only; next-service rows not counted; a covered service folded under a listed coverer is not counted separately (ASSUMPTION stated by engineering, not in spec) => PO question / note.
- TV L125 (S16-R7): hover contents carry no prices; parts always returned (hidden at non-home in modal preview).
- TV L127 (S16-R9): a service without canned lines cannot be added (refused) — UI: no Add Service.
- TV L130 (S16-R12): per-row "Needs mileage reading" hint is a button that focuses the asset card's Mileage/Engine Hours input (FD-226).
- TV L137 (S16-R20): "Added · N lines" count = lines the add appended, including any later deleted by hand (ASSUMPTION).
- TV L143 (S16-R22): tech time copied as well as hours; no labour type → not priced.
- TV L146 (S16-R25): Remove un-addresses; removed links excluded from the step, the origin, the worklist WO column.
- TV L149 (S16-N8): card hidden when the org has no active schedule AND the asset has no enrolment or record.
- TV L162 (S17-R1): destination choice (this WO / new one) sits inside the Add Service modal (FD-209).
- TV L163 (S17-N1): "this WO" gated on work-order create-and-edit (New Line permission); new WO = Create work order.
- TV L165 (S17-E2): Mark complete on this WO writes a link so the panel shows the row addressed.
- TV L176 (S18-R8): unticking undoes the completion (the service stays due).
- TV L177 (S18-R9): closed-line date shown on the WO lines (end date, empty while open).
- TV L178 (S18-R13): proposal basis lines_closed / invoice_date / carried (user date carried after reversal).
- TV L180 (S18-R15): closing untouched = accepted.
- TV L184 (S18-N5): reversed/removed invoice → step shows nothing.
- TV L191/192 (S18-N7/N8): gated on invoice-create permission; no reopen; invoice completion not undoable.
- TV L193/194 (S18-R20/R21): before payment dialog; "Discard your changes? The proposed dates stay."
- TV L212/216 (S14-R9/N1, Chunk 1 surface): setting off → disabled with reason, not hidden. (Chunk 1 note.)
- TV L215 (S14-R13, Chunk 1 surface): Send reminder offered when ANY contact has an email, even if preferred has none.
- TV L217/219 (S14-E2/S21-R5): send log with subject, body, recipients, user, time — no screen in v1 (EX for manual).

## Plan 2 L220–409 (§1 S19, S22, seams, NFR, NFR-F, re-verify, Clarifications, Product answers index)
- TV L226-228 (S19-R2/R4): content box prefilled with fixed wording (copy owned by Product — exact wording NOT given anywhere in the plan or spec => no quotable sentence for the opening wording; cases must not invent it).
- TV L233 (S19-R9): "Due month where the date is sound (a day for a certificate)" — certificate rows show a day. Spec S19-R9 says "due month where the date is sound"; the certificate-day detail is plan-only => DIVERGE-lite / PO question (spec S11-R13 says a certificate date reads its End date as a day on screen; the email rule is silent).
- TV L239 (S19-R19): greeting order: ticked contacts in list order, preferred first when ticked; trailing comma.
- TV L240 (S19-R21): no telephone → call to action omitted (A43 callToAction null).
- TV L241 (S19-R23): nothing dated → content box prefilled with "Nothing is scheduled for {unit} yet."; no table; CTA, signature, footer kept; still sendable.
- TV L242 (S19-N3): setting off → Send disabled with the reason (Chunk 1 contact card).
- TV L266 (S22-R2): column shows schedule name; link opens the schedule from any location; plain text when user cannot open it (no Settings Service permission — "plain text without Settings" L388).
- TV L268 (S22-R4): summary line counts/sums EVERY matching WO across all pages (not the per-page total); total = whole WO total.
- TV L269/L271 (S22-N1/N3): origin only from Add Service / created-from-due-service links; Mark complete never; removed (Undo/Remove) links do not count.
- TV L272 (S22-E1): origin = the EARLIEST qualifying link (adding a second service from another schedule does not replace the first schedule in the column).
- EX L292 (NFR-101): transport failure returns an error and the send is not logged — cannot be forced by hand (EX), but tester-visible error text not given.
- EX L295-298, 300-302 (NFR-107..114 perf/characterization/ownership/split internals): not manually testable (performance budgets, internal transactions).
- TV L302 (NFR-114): split — a lines link moves with the new WO only when every remaining line it added moved there; otherwise stays; Mark-complete links stay with the original. Manually testable via the existing Split work order action (adds detail to S16-E3 case).
- TV L303 (NFR-115): no money in panel, contents, add confirmation, step, or the reminder email.
- TV L304 (NFR-117): once an invoice is reversed/removed/voided, the step shows nothing / a save is refused.
- INFO L305 (NFR-118): QA/staging mail goes only to a sink or allowlist — tester must use an allowlisted address to receive the email (precondition note).
- TV L306 (NFR-119): typed addresses validated (1–30 addresses); typed content is shown as text (HTML not rendered). The validation message text is not given => cannot quote; note only.
- TV L307 (NFR-120): Add email only when the contact has no email; needs create and edit customers.
- TV L313 (NFR-F101): S18-R9 shows as a "Closed {date}" caption on a closed line. Panel shows only when org has an active schedule, or the asset is enrolled or has a record.
- TV L314 (NFR-F102): invoicing never fails, blocks or waits >4 s because of the step; a step error = accepted. (Error forcing EX.)
- TV L315 (NFR-F103): panel never renders on part sales, imported WOs or history mode. => ADD candidate (plan-only; cite Plan 2).
- TV L317 (NFR-F105): panel updates without reload after reading save / Add Service / Mark complete / status change.
- TV L318 (NFR-F106): double-click protection on Add Service, Undo, Remove, Send reminder, Confirm dates.
- TV L320 (NFR-F108): phone layout — rows stack, hover = sheet, menus = action sheets, step full screen (PQ-6 OPEN with Product → phone layout cases HOLD).
- INFO L333-334 (S14-N2/N4): Chunk 1 contact-card states (Chunk 1 notes).
- INFO L342-372 Clarifications: Q2 rate ceiling 1,500/24 accepted; Q4 no flag; Q9 Mark complete records WO readings (S18-R19); E3/Q13 copied mileage not a reading (S10-N6); "S19-R9 Soon" every guessed date incl. every Low reads Soon (918913025); DQ1-3 data queries (EX, production data).
- INFO L381-400 Product answers index: PQ-6 open (phone layout); greeting by count; plain text without Settings for S22-R2.

## Plan 2 L409–658 (§2 architecture BE/FE, §3.1 settled decisions D0–D28)
- EX L411-422 (§2.0 codebase facts: events, tables, endpoints): architecture. Tester-visible consequences: invoiced and paid WOs cannot be split (L416, existing guard); reversal sets the WO back to Complete (L415); the WO keeps the sent HTML for invoice emails (L417) — INFO.
- TV L427-431 (F-1): closing the payment dialog unpaid REVERSES the invoice (existing app behaviour) → resets undone (S18-E2 second clause). Manually reproducible: Create invoice → step → close the payment dialog without paying.
- TV L432-434 (F-2): step opens BEFORE the payment dialog because paying reloads the page (S18-R20).
- TV L435-438 (F-3): panel only on a work order card (not on part sales or imported WOs); on a phone the asset card sits behind "Show details" (PQ-6 open).
- EX L440-512 (§2.2–2.5 BE modules, aggregate, diagram, ports, events): architecture; no tester-visible text. L511 credit memo deliberately not consumed (S18-E2 "A credit memo changes nothing") — TV, already in spec.
- TV L516-522 (FE overview): the step opens from every invoicing entry point; toast Undo; menu Remove; Mark complete becomes the row's button.
- EX L527-536 (§2.6 file locations).
- TV L544 (§2.7): reading dialog NOT mounted on the WO; the Needs-reading hint focuses the asset card's inline inputs.
- TV L545: Mark complete from the panel opens with this WO already chosen (S16-R17/S18-R2).
- TV L546: step date field shows the proposal; the lines-closed and invoice dates are offered beneath the field (same offer chips as Mark complete).
- EX L564-583 (§2.8 query keys) — but TV consequence L576-577: after Add Service the canned lines and the WO note appear without a reload; L581 Undo/Remove refreshes the panel only, lines stay.
- TV L585-596 (§2.9 gating): panel hidden in history mode and without view work orders; with no enrolment/no record the panel shows only to a user with create-and-edit customers (its only offer is Enroll). Add Service → this WO needs the work-order lines create-and-edit permission (same as New Line); → new WO needs create work order; Undo/Remove need lines create-and-edit; Mark complete, Add record, Enroll, Undo complete need create-and-edit customers; Needs-reading hint is a button only when the asset card's input is editable, else plain text; view-only technician sees rows read-only. Step: anyone who can invoice. Origin column always present; link only with Settings Service permission, else plain text. Send reminder hidden without create-and-edit customers; disabled with reason only when the customer's notifications are off; never disabled for nothing due.
- EX L598-620 (§2.10 FE diagram) — TV detail L610-611: invoicing entry points that all reach the step: header Create invoice, the … menu, lines bulk bar, Finance toolbar, completion wizard, clock-out-and-complete, review.
- INFO L626-658 (§3.1 D0–D28): D2 a WO reading is dated by the invoice date, else WO start (Plan 1 detail); D11 line close date stamped on all five paths; D12 a reset failure never rolls back an invoice (EX — cannot force); D25 copied work: name, description, hours and tech time; no prices, fixed prices, parts, adjustments or inspection links (TV: a copied line carries no inspection form link — spec S16-N6 says "Prices and parts are not copied"; the "adjustments / inspection links" detail is plan-only, INFO); D26 certificates as days, overdue from End + 1; D27 no feature flag.

## Plan 2 L659–793 (D29, §3.2 TD-101..TD-126, TD-37..41, §3a reversal, §3.3 FD-201..FD-226, §3.4/3.5 risks)
- INFO L659 D29: no legal send switch.
- EX L665-666 TD-101/102 module/read model.
- TV L667 TD-103: Add Service guards — WO not invoiced/paid; service active; has canned lines; not already linked open on this WO; NO live link on ANOTHER work order (Plan 1 one-live-link rule) → the add is refused. Error text not given (cannot quote; note).
- TV L669 TD-105: a corrected step date may not precede the service's previous completion (refused). Error text not given.
- TV L670 TD-106: reversed/removed/voided invoice → step shows nothing; a stale save is refused.
- TV L671 TD-107: readings from the WO's existing Mileage / Engine Hours fields (existing change-mileage / change-engine-hours).
- TV L672 TD-108: In the shop value used only as the current position: a meter trigger reached by it becomes DUE TODAY; an "At" reading passed by it becomes OVERDUE; never moves the rate, pairs or confidence age. Applies on panel, asset tab and worklist alike.
- TV L673 TD-110: Mark complete from a WO (no lines added) shows the row addressed on that WO; Undo complete reverts; Mark complete records the WO's readings; Undo complete re-settles them (back to In the shop).
- TV L674 TD-111: this-WO / new-WO only on the panel; worklist and asset tab keep Create/Open work order.
- TV L675 TD-112: origin = EARLIEST Add-Service/create link not removed; Mark complete never; filter "From maintenance"; summary counts every matching WO across all pages and respects the header location, tab/status, search and every other filter; total = whole WO total (the same value as the Total price column); amount hidden when the user cannot see pricing (count still shown).
- TV L676 TD-113: split moves only open lines links; removed links ignored.
- TV L677 TD-115: From = organization name; Reply-To = sender; BCC to sender when the toggle is on; signature user first/last name, org name, header-location phone; no phone → no call to action.
- TV L678/L686 TD-118/TD-37: row state: Coming up (before due) / Due today / Past due (after due). Email items = what the worklist shows for the unit with a date (not skipped, compliance only with a record, due within 91 days); a Needs readings row beyond 91 days is NOT carried; fallback = two earliest dated services (resting/completed rows included) as Coming up; ordered by due date; nothing dated → "Nothing is scheduled for {unit} yet." in the box, no table, still sendable.
- TV L681 TD-122: any guessed date (every Low estimate included) → "Soon"; recipients validated, deduplicated, 1–30; no resend guard (a second send right away is allowed); "Last sent" is the guard.
- TV L682 TD-123: Add Service "this work order" needs the New Line permission (work order lines create and edit); step needs invoice create; Add email needs create-and-edit customers; send needs create-and-edit customers; panel needs view work orders.
- INFO L683/L689 TD-124/TD-40: non-production mail goes to a sink/allowlist (test precondition).
- TV L684 TD-125: Remove refused once invoiced/paid or once reset; lines and the WO note untouched; after Remove, Create work order becomes available again on the worklist/asset tab (hasLiveWorkOrder false) and the worklist work-order column clears.
- TV L685 TD-126: the dialog shows a preview: greeting, editable prefilled content, read-only reminder table, read-only call to action beneath; nothing-dated line replaces the table.
- TV L687 TD-38: Add email only when the contact has none; email validated (max 255); contact change also fires the portal webhook (EX). Accounting email side effect (R2-17) EX.
- TV L688 TD-39: step gated by invoice create permission (never the default office user).
- EX L690 TD-41 performance budgets.
- TV L692-708 §3a: reversal via "reverse invoice" or "remove customer transaction" (closing the unpaid payment dialog) undoes the invoice's resets, reopens the links (rows read addressed again, back to "Added"), puts the WO readings back to In the shop; a user-entered step date is CARRIED to the next invoice's proposal; a PENDING invoice voided by adding a line → undone and re-proposed at the next invoice; voided/reversed invoice no longer fixes the WO readings.
- TV L717 FD-204: rows newly due after an inline reading save show a "Now due" marker for the page visit (plan-only label; spec S16-E1 "a service that has just become due says so" — exact wording not in spec/design → note; cite Plan 2).
- TV L718 FD-205: step before payment dialog; when nothing is pending the payment dialog opens as today.
- TV L719 FD-206: step load waits at most 4 s; any error = accepted (EX to force).
- TV L720 FD-207: Confirm with no change closes; Close (X or Esc) with no edits closes; with edits shows "Discard your changes? The proposed dates stay."
- TV L721 FD-208: live next due preview on date change.
- TV L722 FD-209: Add Service dialog: title "Add {service}"; preview lines with hours (parts only at the home location); destination radio "This work order (#{n})" / "A new work order", each only when permitted (one permitted → no radio); confirm button "Add Service"; invoiced WO → button replaced by the (i).
- TV L723 FD-210: new WO from the panel does NOT navigate; toast "Work order {displayNumber} created for {service}" with Open.
- TV L724 FD-211: addressed labels: "Added · {n} lines" + Mark complete button + Remove in menu; reset by Mark complete after add → "Added · {n} lines · marked complete, next due counts from {date}", no button, NO Undo complete on the panel (undone from the asset tab); Mark complete without add → "Marked complete on this work order · next due counts from {date}", menu Undo complete; no-lines add → "Added · no lines". Collapsed header: title "Maintenance" + badge with the count, nothing else. Invoice completion → no Undo complete (S18-N8).
  => DIVERGE: spec S16-R17/S18-R17 say the row reads "Completed · next due counts from 2 Oct 2026" and its menu offers Undo complete; plan says different wording and no Undo complete on the panel for the lines-added path. Spec wins; PO question.
  => DIVERGE: S16-R2 "carries the badge alone, with no other text" vs plan header title "Maintenance" + badge vs screenshot "Maintenance schedule" + "1 due" badge.
- TV L725 FD-212: panel collapsed on every WO open, not remembered.
- TV L726 FD-213: column "Maintenance schedule", visible by default, can be hidden by the user; clicking the link does not open the row.
- TV L727 FD-214: filter "From maintenance"; summary "{n} work orders · {total} · Work order total"; without the financial-data permission "{n} work orders" only.
- TV L728 FD-216: Send reminder hidden without CE, without a preferred contact, or when no contact has an email; disabled with reason only when notifications off; after send toast "Reminder sent." and "Last sent {date}" (Chunk 1 contact card).
- TV L731 FD-219: copied-work (i) hover names home and this location; hover parts heading "PARTS {HOME} USES (reference)"; Add Service preview omits parts.
- TV L732 FD-220: toast "{service} added · {n} lines" with Undo; if it can no longer be undone → "This can no longer be undone".
- TV L733 FD-221: menu item "Remove from this work order" (spec: "Remove"); no confirm; toast "{service} removed from this work order. Its lines stay on it."; hidden once reset.
  => label difference spec "Remove" vs plan "Remove from this work order" — spec label wins; note.
- TV L734 FD-222: send dialog: every contact; preferred contact pre-ticked if it has an email; "Add email" button only for a user with CE; read-only call to action beneath the table (absent when no phone); errors shown as toasts.
- TV L735 FD-223: greeting: 1 → "Hi {A},"; 2 → "Hi {A} and {B},"; 0 or ≥3 → "Hello,"; preferred contact named first; "No email" text on a contact without email; after Add email nothing is re-ticked/un-ticked automatically.
- TV L736 FD-224: org without schedules → invoicing goes straight to the payment dialog.
- TV L737 FD-225: Add email dialog title "Add email for {first last}", one email field, Save; invalid → inline error; already has email → toast "This contact already has an email."; after save the contact is tickable but NOT ticked automatically.
- TV L738 FD-226: hint "Needs mileage reading" / "Needs engine hours reading"; when the WO input is editable it is a link-style button that focuses and scrolls to the asset card's Mileage / Engine Hours input; read-only → plain text.
- EX L740-756 §3.4 BE risks (regression, races, accounting parity). TV L746 R2-7: a step correction after a later Mark complete elsewhere is refused (409) — racy, EX. TV L752 R2-15: at most 30 typed addresses. TV L755 R2-18: fallback may show services months away labelled Coming up.
- EX/INFO L758-782 §3.5 FE risks. TV L762 R201: panel absent on part sale and imported WO cards; TV L767 R206 pinned-note warning may stack with the step; TV L780 R219: "Closed {date}" caption on every completed line.

## Plan 2 L793–1032 (§4 database, §4.4 migration rules, §4.5 data migrations, §5 API A35–A45, modified endpoints, id checks, FE view, §6 intro)
- EX L793-921 (§4.1–4.5 tables, DDL, migrations): database. Tester-visible consequences only: the send log stores recipients, greeting, subject, rendered body, sender, time (S19-R14 — no screen in v1, so EX for a manual tester); due_label examples L832 "October 2026" (meter/calendar month), "14 Oct 2026" (certificate day), "Soon". => email due label for a certificate is a DAY (plan) — spec S19-R9 says "due month where the date is sound" → PO question (see DIVERGE).
- EX L924-934 (§5 conventions: status codes).
- TV L942 (A35): panel rows ordered due rows by due date (overdue first), then next-service rows; a WO without a vehicle shows no panel content; an "unticked" lines link still shows the row as added (not reset); Undo complete only for Mark-complete completions.
- TV L943 (A36): hover lines de-duplicated, in Add Service order; deleted canned lines omitted; no prices; when several canned lines link an inspection form, the FIRST by line order is shown.
- TV L944 (A37): refusals: invoiced WO; enrolment ended; no canned lines; already on this WO; open on another WO; a service of another vehicle.
- TV L945 (A38): step empty for a reversed/removed/void invoice, ordinary WO, Mark-complete resets, orphaned links, removed links.
- TV L946 (A39): a future reset date is refused (400); the preview also shows covered services' next due (S18-R7).
- TV L947 (A40): reset date in the future, or before the previous completion → field error on the date; certificate rules; a certificate posted again for this WO corrects it rather than duplicating; type must match the service.
- TV L948 (A41): 1–30 addresses; content ≤ 5,000 characters; refused when notifications off / no preferred contact; transport failure → error toast and nothing logged (EX to force).
- TV L949 (A43): email due label: month, a DAY for a certificate, "Soon" for any guessed date (Low included); call to action is separate from the editable content box (editing the box cannot delete it); subject is fixed (not shown as editable — S19-N7).
- TV L950 (A44): Remove refused when invoiced/paid, already reset, or nothing to remove.
- TV L951 (A45): Add email invalid → field error; never overwrites an existing email.
- TV L959 (A30′): Last sent = latest hand send for that asset + customer (Chunk 1 contact card).
- TV L962 (A42′): part-sale rows always have an empty Maintenance schedule cell; the filter only returns WOs with an origin link.
- TV L963 (A28): Mark complete On a work order records that WO's readings dated the Reset date; the ASSET's own mileage / engine hours fields are NOT changed by it.
- TV L964 (A29): Undo complete on the panel only for Mark-complete rows; it puts the WO readings back to In the shop unless the WO has a live invoice or another Mark complete on it; invoice completions cannot be undone.
- TV L965 (A24): asset tab shows no Undo for invoice completions (Chunk 1 surface → Chunk 1 note).
- EX L972-988 (§5.3 inbound id checks): security plumbing, not reachable from the UI.
- INFO L990-1021 (§5.4 FE view): restates the above.
- INFO L1025-1032 (§6 intro): phase order Q1→Q6; no Q7.

## Plan 2 L1033–1262 (§6 gates, Phase Q1 panel: BE/FE files, sketches, unit tests, DoD walk, E2E Q1-1 start)
- EX L1033-1053: build/CI gates.
- TV L1057 Q1 implements list (no new tester-visible rule beyond §1).
- TV L1083 (panel FE): collapsed header = badge with the due count ALONE, "no title or other text" (accessibility label "Maintenance" is not visible) — CONTRADICTS FD-211 (L724: title "Maintenance" + badge) and the DoD walk L1233 ("Maintenance" collapsed with a badge). Spec S16-R2 is the authority: badge alone. Screenshot shows "Maintenance schedule" + "1 due". => DIVERGE (design vs spec), plan internally inconsistent.
- TV L1083: panel renders nothing until loaded (skeleton, never a 0 count — L1207); error → standard error with Retry (L1215).
- TV L1084: row shows service name + schedule chip; summary "4 lines · 2.8 hours" is the hover trigger; covered services folded show as "Includes …" (plan label; spec says "folded into the one that covers them" — no on-screen word in spec); copied-work (i); primary action: Add Service / Mark complete (once added) / invoiced (i) / nothing when no canned lines and not addressed; "Now due" marker.
- TV L1086: row menu: Mark complete (only while not added; needs CE; alone for no-canned-lines service), Remove (lines permission), Add record (compliance, CE), Undo complete (only for a Mark-complete-on-this-WO row; NOT for a lines-added row reset by Mark complete; never for an invoice completion). No menu without CE and without the lines permission.
- TV L1089: copy strings: "Lines can't be created on an invoiced work order." ; "Now due"; "Added · {n} lines"; "{service} added · {n} lines".
- TV L1100-1101 (sketch): skipped services and compliance services with no record are NOT listed as due on the panel; dueCount excludes next-service rows.
- TV L1188: Add Service shown when the user can add lines OR create a work order.
- EX L1192-1225 unit/integration tests — TV restatements: no price key anywhere; WO mileage change via the existing field shows the row due (TD-108).
- TV L1231-1252 DoD walk (useful for runnable steps): admin, /workorders/<id>/lines; change Mileage inline in the card above → panel refreshes, crossed service shows "Now due"; "Needs mileage reading" → click → cursor lands in the card's Mileage field; row menu → Mark complete → modal with this WO chosen → save → row reads "Marked complete on this work order …"; Undo complete restores; compliance row → Add record → asset Compliance section shows it; unit on no schedule → Enroll in Schedule; non-home location (i) "'<service>'s lines were set up at <home>…"; invoiced WO (i) "Lines can't be created on an invoiced work order"; tech (view WOs only): rows visible, no menu, no Add Service unless lines permission; part sale & imported WO unchanged; org with no schedule: no panel; phone: "Show details" → card → panel.
- EX L1254-1262: E2E Q1-1 setup (test data recipe: two canned lines e.g. "Oil" 1.5 h with one part and "Filter" 0.6 h; PM-A every 6 months; CVIP term 12 with End date today+20 → due soon with Remind before 1 month) — reused as example values.

## Plan 2 L1263–1502 (E2E Q1-1..Q1-4, Q1 backlog/dev-layer, Phase Q2 Add Service: BE/FE files, sketches, tests, DoD walk, E2E Q2-1 start)
- TV L1264-1266 (Q1-1): collapsed header shows NO text beside the badge; summary "2 lines · <h> hours" (h = sum of seeded line hours); hover lists line descriptions + part number with quantity; no currency.
- TV L1270-1279 (Q1-2): row menu → Mark complete → "On a work order" selected with this WO already chosen; Reset date defaults to today; confirm → toast with Undo; row no longer Overdue (becomes the schedule's next service); Undo → Overdue again.
- TV L1282-1291 (Q1-3): worked example for In the shop due-at-once: Oil every 10,000 mileage + every 12 months, last done 1 month ago at 50,000, reading 52,000 → row is next-service (not due); type 61000 in the WO's Mileage field → "Now due" marker, badge Due today/Overdue, no reload.
- TV L1293-1300 (Q1-4): invoiced WO → "Lines can't be created on an invoiced work order." and no Add Service; menu still has Mark complete. ("Runs on stage" — invoicing needs a staging-like environment, B-2.)
- TV L1306: view-WO-only user: rows read-only, no menu, no Enroll.
- INFO L1309-1323 dev-layer split: which rules are automated vs manual. S16-R14, N2, N3 "by construction".
- EX L1325-1348 Q2 BE files (controllers, guards, errors, link states). TV consequence L1346: after Remove, the worklist's work-order column no longer shows that WO and Create work order is available again.
- TV L1353: Add Service button hidden when the user has no permitted destination.
- TV L1354: dialog title "Add {service}"; preview lines with hours, parts only at home; no money; destination options only the permitted ones (one → no radio); confirm "Add Service".
- TV L1361-1396 sketch: guard order — invoiced/paid → refused; enrolment ended; another vehicle; no canned lines; already open on this WO; live on another WO.
- TV L1399-1415 sketch: Remove → nothing to remove / invoiced / already reset refusals; lines and the WO note untouched.
- TV L1440-1442: new WO toast has an "Open" action that opens the new WO at its location.
- EX L1448-1467 unit/functional tests — TV restatements: two services sharing a canned line add it once; a line already added by an earlier service on this WO is skipped; after Remove, invoicing writes no completion and the step lists nothing; origin unset; Create work order allowed again.
- TV L1469-1491 DoD walk: Add Service → dialog previews lines, hours, parts, no price → "This work order" → Add Service; lines at the end of the Lines tab as ordinary lines; notes count goes up (note "PM-A added from {schedule}"); toast "PM-A added · n lines" with Undo → row back to Add Service, lines stay; add again, wait for toast to go → "Added · n lines" + Mark complete button; menu → Remove → back to Add Service, lines stay; second service sharing a canned line → toast count reflects dedupe. Non-home: (i), preview no parts, each line "Line note · Internal: Copied from {home}. Parts used there, for reference: …", local labour rate, no parts; fixed-price note. Invoice the WO → Remove gone. "A new work order" → toast with Open, stay on current WO; Open → new WO (estimate) carries the lines; worklist row shows new WO number. User without lines permission sees only "A new work order" (no radio) or no Add Service. Line search still returns canned lines only.
- TV L1496-1502 (Q2-1): toast "PM-A added · 2 lines" with Undo.

## Plan 2 L1503–1752 (E2E Q2-1..Q2-3, Q2-U1, Q2 backlog/dev-layer, Phase Q3 step after invoicing: BE/FE files, sketches, tests start)
- TV L1503-1504: after add — lines on the Lines tab without reload; "Added · 2 lines"; Mark complete button; no Add Service button; persists after reload.
- TV L1508-1517 (Q2-2): new-WO destination: toast naming the new WO number with Open; stays on current WO; new WO is an ESTIMATE carrying both canned lines; worklist row (Customers → Maintenance reminders tab, search) shows the new WO number.
- TV L1519-1528 (Q2-3): Undo from the toast → Add Service again, lines stay; add again, toast gone → menu Remove → Add Service again, lines stay; persists after reload.
- TV L1530-1532 (Q2-U1): Mark complete from the panel (no add) → "Marked complete on this work order …"; Undo → addressed line gone.
- TV L1538: user with WO create but without the New Line permission → offered only "A new work order".
- INFO L1541-1551 dev-layer.
- EX L1553-1583 Q3 BE (subscriber, gate, controllers, sketches). TV consequences: step lists lines/no-lines links reset by THIS invoice or unticked; compliance split into the certificate section; the WO lines read gains each closed line's end date.
- TV L1586-1592: every invoicing entry point (header Create invoice, … menu, lines bulk bar, completion wizard, Finance toolbar, clock-out-and-complete, review) shows the step; part sales and orders never.
- TV L1597: no permission beyond invoicing; any loading error → step skipped (accepted).
- TV L1598: step dialog title "When was the maintenance done?"; rows, then "Compliance certificates (optional)" with type prefilled from the service, Certificate number, Start date, End date (days), term; Start + term fills End; primary "Confirm dates"; close X.
- TV L1599: step row: tick (default ticked), name, reason "Lines added from {schedule}" (=> spec S18-R8 example "Lines added from PM-A" names the SERVICE; plan names the SCHEDULE → PO question), "Also resets: …" for covered services (plan label; spec S18-R7 no on-screen word), date field starting at the proposal, lines-closed and invoice dates offered as chips beneath (never future), "Next due {date}" live; unticked → date disabled and the row reads "Stays due".
- TV L1602: a closed line shows "Closed {date}" on the Lines tab (row and card), date in the header location's timezone, labelled so it cannot be read as the invoice date; every closed line in every shop.
- TV L1621-1633 sketch: a date in the future or before the previous completion → field error on that row's date; superseded → refused.
- TV L1740-1745: auto-paid (full or overflow) invoice → no payment dialog, the step simply shows; payment dialog dismissed afterwards removes the invoice and undoes what the step confirmed; after a reversal the page reloads and re-invoicing shows the step again for the new invoice; a Mark-complete-reset service is not in the step.
- EX L1747-1752 unit tests (restate: carried user date; correct/untick/retick; certificate create vs correct; End = Start + term, same day number, month-end clamp).

## Plan 2 L1753–2002 (Q3 tests, DoD walk, E2E Q3-1..Q3-3, Q3 backlog/dev-layer, Phase Q4 origin column complete, Q5 header)
- EX L1753-1782 tests — TV restatements: a user with invoice permission but WITHOUT customer edit sees the step and can confirm (S18-N7); default office user cannot invoice (existing); X untouched → closes; X after edit → discard confirmation; no reopen entry point; certificate 400 → field error; closed line "Closed {date}" in the header location's timezone, open line shows nothing.
- TV L1788-1808 DoD walk (runnable recipe): WO with PM-A added from the panel, every line completed on 4 Sep → Finance → Create invoice → "When was the maintenance done?" opens first, PM-A ticked, "Lines added from PM-A" (NB: here the SERVICE name — the plan contradicts itself, L1599/L1819 say "{schedule}"), date 4 Sep, chips "Lines closed 4 Sep · Use invoice date (today)", Next due month; change date → Next due changes; Confirm dates → payment dialog; pay → asset tab PM-A counts from chosen date. Every entry point (header Create invoice on an unfinished WO / completion wizard, lines bulk bar Create invoice, clock out and complete) shows the step exactly once. Untick → Confirm → asset tab still shows PM-A due. X untouched → proposals stand. Dismiss payment dialog after confirming → invoice removed → asset tab PM-A not reset; invoice again → date shows the date entered before, lines-closed date offered beneath. Reverse invoice → invoice again → step shows for new invoice. Compliance: certificates section → Start date + term → End derives → asset Compliance section reads "… · ends D Mon YYYY". Ordinary WO and part sale → no step, invoicing as today. Phone 390 px → step full screen. Lines tab "Closed {date}". Invoice-only user → step appears, Confirm dates works.
- TV L1814-1823 (Q3-1): calendar-only PM-A every 6 months, last done 8 months ago; step opens before any payment dialog; reason; date = today (lines closed today); Next due ≈ today + 6 months; set date to today − 40 → Next due = month of (today − 40 d) + 6 months; Confirm → payment form; asset tab Last done = today − 40 d.
- TV L1826-1837 (Q3-2): X on payment dialog removes the invoice (page reloads, Create invoice offered again, WO back to Complete); PM-A Overdue again; re-invoice → date holds today − 40 d (carried), not the lines-closed date; Confirm untouched → Last done today − 40 d.
- TV L1839-1848 (Q3-3): compliance CVIP term 12 added to WO → step shows "Compliance certificates (optional)" and NO CVIP row in the dates list; number C-…, Start today, term 12 → End = today + 12 months; asset card reads "CVIP · C-… · ends <D Mon YYYY+1>".
- INFO L1850-1873 backlog/dev-layer: reverse from the invoice menu → step re-appears; invoice-only role sees step. NOTE L1860: an ordinary-WO check "has no failure mode" for automation because any error = accepted — manual testers should still check no step appears.
- EX L1875-1895 Q4 BE (characterization, port, query). TV consequences: part-sale list rows never show an origin.
- TV L1900: column "Maintenance schedule" after the lines-count column, visible by default; "From maintenance" filter always present; summary line above the table AND above the mobile list: "{n} work orders · {total} · Work order total"; without financial permission "{n} work orders"; never the accumulated page total.
- TV L1902: cell empty with no origin; link to the schedule editor with Settings Service permission, else plain text; clicking the link does not open the WO.
- TV L1917-1918 (origin sketch): Mark complete not an origin; removed Add Service not an origin; earliest wins. NB L1933 filter EXISTS omits the "removed" exclusion (TD-112 text says the filter uses origin links) — internal inconsistency; tester risk: a WO whose only Add Service was removed may still match "From maintenance" while its column is empty. Record as a finding (test it; spec silent → plan TD-112 governs the expectation that a removed Add Service is not an origin).
- TV L1945: summary with page size smaller than the result set still totals all; search and status narrow the summary; another workplace's WOs excluded (list is header-location scoped).
- TV L1958-1965 DoD walk: WOs created from the worklist, the asset and the panel show the schedule name; hand-made empty; click name → schedule editor; "From maintenance" chip → only origin WOs + totals line; column hide/show persists across reload; tech: plain text, no link.
- TV L1971-1984 (Q4-1/Q4-U1): column toggle "Maintenance schedule"; link opens /maintenance-schedules/<id> not the WO; a panel-created WO shows the schedule name.
- INFO L1986-1997.
- INFO L1999-2002 Q5 header (split).

## Plan 2 L2003–2262 (Phase Q5 split complete; Phase Q6 send reminder: BE/FE files, sketches, tests, DoD walk; E2E header)
- EX L2003-2049 Q5 internals. TV L2047-2048: all PM-A lines moved to the new WO → the service moves; some moved → stays on the original; none → stays; Mark complete / no-lines links stay; invoicing the new WO resets the moved service and the original's invoice does not; the split never fails because of maintenance.
- TV L2056-2058 DoD walk: WO with PM-A lines plus other lines → select the PM-A lines → Split → the new WO's panel shows PM-A addressed ("PM-A on this work order" — a third plan wording, not in spec), Back → original no longer does; a service marked complete stays on the original; invoicing the new WO → the step lists PM-A.
- INFO L2060-2072 no E2E for split (existing split navigation unchanged).
- EX L2074-2110 Q6 BE files. TV consequences:
  - L2090 ReminderDueLabel: month label "October 2026"; certificate → day "14 Oct 2026"; "Soon" whenever the winning date is a meter estimate at ANY confidence; calendar → month; never confidence wording. (=> PO question: spec says "including every Low confidence date", product reply 918913025 "every guessed date, including every Low date, reads Soon"; whether High/Medium meter estimates are "guesses" is the open assumption L38.)
  - L2091 states Past due / Due today / Coming up by day.
  - L2092 greeting rule; L2093 the composer: greeting, user content (HTML shown as text), table (none when nothing dated), call to action (none without phone), signature, footer; no money.
  - L2094 allowlist: in non-production, mail to non-allowlisted addresses is DROPPED silently (tester precondition: use an allowlisted inbox / mail sink).
  - L2099 email items = the same rows as the worklist shows for that asset + customer (window ≤ 91 days, not skipped, not resting after Mark complete, compliance with a record); fallback two earliest dated services (resting included) as Coming up.
  - L2100 content ≤ 5,000 characters; 1–30 addresses.
  - L2101 refusals: notifications off; no preferred contact; transport failure.
  - L2103 template fixed copy owned by Product (the opening wording text is NOT in the spec or the plan).
- TV L2115-2116 (SendEmailDialog): one ticked contact with no last name → "Hi {first},"; none ticked + typed address → "Hello,"; one ticked + typed → "Hi {first last},"; a contact gaining an email after Add email becomes tickable, ticks unchanged.
- TV L2117: card shows "Last sent {date}" and a "Send reminder" button (Chunk 1 card).
- TV L2118: dialog document type "Maintenance reminder".
- TV L2119: reminder table columns: unit · service · due label · state; read-only; no table when nothing dated.
- TV L2134-2151 sketch: order of refusals (asset/customer not linked or no active enrolment → not found; notifications off; no preferred contact).
- TV L2165: disabled reason when notifications off (copy text not given in plan; spec S14 is Chunk 1).
- TV L2180: success toast copy.reminderSent ("Reminder sent." per FD-216).
- EX L2210-2224 tests — TV restatements: a service due in 60 days is carried; a service resting after Mark complete is NOT; a Needs readings row beyond 91 days is NOT; content with <script> shown as text; only that asset's services.
- TV L2226-2257 DoD walk (runnable recipe; mail sink/allowlist required): /customers?tab=maintenance → contact → Send reminder → existing send dialog titled "Sending Maintenance reminder"; every contact listed; preferred ticked when it has an email; no-email contact unticked, cannot be ticked, "No email" + Add email → enter address → save → tickable (not auto-ticked); field for further addresses; greeting one → "Hi {first} {last},", two → "Hi {A} and {B},", three → "Hello,"; content box holds the fixed wording, editable, not repeated above the box; reminder table beneath, read only (a Low row reads "Soon"), then the call to action; signature: your name, org name, header location's telephone; BCC toggle present; Send → toast, dialog closes, card shows "Last sent {today}"; in the mail sink: From = org name, Reply-To = you, BCC when toggled, only that asset, greeting matches preview. Other states: notifications off → disabled with reason, row still listed; nothing due in 91 days → enabled, next two as Coming up; nothing dated → content "Nothing is scheduled for {unit} yet.", no table, CTA + signature stay; no preferred contact → no button; no contact with an email → no button, card offers Add contact; tech → no button; phone → dialog fullscreen. Regression: invoice and PO email dialogs still read "Hello," and look as before.
- INFO L2259-2262: E2E for send blocked by environment (mail sink, B-1).

## Plan 2 L2263–2562 (Q6 E2E Q6-1..Q6-3, backlog/dev-layer, Q7 removed, §7 Testing Strategy: unit, integration, manual checklist, §7.4 test ids, E2E conventions, Scenarios Q1-1..Q6-3, Backlog start)
- INFO L2263-2267: send tests only where the mail sink/allowlist exists; QA/staging data cloned from production → a send could reach a real customer without it. => EVERY S19 manual case must carry a precondition: use a test customer whose contact email is an inbox you control (allowlisted) — never a real customer.
- TV L2269-2280 (Q6-1): button reads "Send reminder" (no "Resend"); preferred contact ticked; second contact without email disabled with "No email"; greeting "Hi <first> <last>,"; content non-empty, no message paragraph above it; preview row lists the service; BCC toggle present; send → toast, "Last sent <today>" persists after reload; body opens "Hi <first> <last>", names the unit and the service, no currency, Reply-To = sender.
- TV L2282-2288 (Q6-2): notifications off → row listed; Send reminder disabled; reason names the setting.
- TV L2290-2300 (Q6-3): Add email on W → dialog closes, W enabled and unchecked, shows the new address; tick W → "Hi <V> and <W>,"; the address persists on the customer page.
- INFO L2302-2320 backlog/dev-layer.
- INFO L2322-2339 Q7 removed: deferred-to-v2 list matches the spec's "Deferred to v2" block → EXCLUDE (not v1 requirements).
- EX L2343-2370 unit/integration lists.
- TV L2372-2382 manual checklist: regression walk of WO page, part sale, imported WO, invoicing, Work Orders list in an org WITH and WITHOUT schedules; phone width 390 px for the panel and the step; every invoicing entry point shows the step exactly once; payment-dialog dismissal and reverse + re-invoice walked; invoice and PO email dialogs unchanged.
- EX L2384-2401 test ids (automation only). INFO: the WO's own fields are "input_vehicle_mileage" / "input_vehicle_engine_hours" on the asset card (labels Mileage / Engine Hours per S16-R12).
- INFO L2403-2434 E2E conventions. TV L2422: ARCHIVING a schedule (all schedules archived) makes the org count as having no schedules → panel hidden on WOs whose asset has no enrolment/record (archive ends enrolments, S6-R6). TV L2431: invoice creation fails on a local stack with QuickBooks bookkeeping (environment note: invoicing cases run on the QA environment). TV L2432: X on the payment dialog = invoice removal (reversal) — testers must reload rather than X when they want to keep the invoice.
- INFO L2435-2437 TestRail suggestion (sections) — not ours to act on.
- TV L2439-2551 E2E scenario restatements (same content as the phase blocks; useful runnable values: PM-A overdue + CVIP End date today + 20 days due soon → collapsed badge 2; Oil 10,000/12 months last 50,000, reading 52,000, type 61,000 → Now due; calendar 6 months, date today − 40 → Next due shifts; CVIP term 12 Start today → End today + 12 months; origin link opens the schedule editor).
- INFO L2553-2562 backlog table start.

## Plan 2 L2563–2762 (E2E backlog end, reference updates, edits to Plan 1 specs, summary counts, testability notes B-1..B-9, §8 rollback, §9 security, §10 traceability start S16-R1..R17)
- INFO L2563-2566 backlog: non-home Add Service copy; reverse-from-invoice-menu re-step; invoice-only role; no-CE send.
- EX L2568-2617 E2E reference updates and edits (automation upkeep). TV L2581 / L2598-2601: while an org has an active schedule, every invoice of a WO with a vehicle waits up to 4 s for the step check before the payment dialog — a tester may notice a short delay (not a defect within 4 s, per Plan 2 NFR-F102). TV L2585: every closed line shows "Closed {date}".
- INFO L2618-2628 summary counts.
- TV L2630-2646 testability: B-1 sends only where sink/allowlist exists (QA environment precondition); B-2 invoicing on the QA environment; B-4 fixed: after a reversal the step shows the CARRIED user date (bug class to watch: if the step shows the lines-closed date instead, that is the B-4 defect); B-6/B-9 toasts auto-dismiss (Undo/Open must be clicked quickly; Remove/worklist link are the stable paths); B-8 the column picker should offer the new column.
- EX L2650-2672 §8 rollback (ops). INFO: no flag; rollback = revert release; emails already added stay on contacts.
- TV/EX L2676-2732 §9 security: one asset per message; subject carries only the org name (TV: subject = organization name — not in spec; INFO); user content HTML-escaped (typed HTML shows as text); addresses validated 1–30; Reply-To sender, BCC only when ticked; A38/A40 refuse another WO's invoice (EX); no Golden Rule changes visible. GR-1: the panel shows services of schedules homed at other locations (TV, matches S16-R3 org-wide). Consent: setting off → no send; no preferred contact → no send.
- INFO L2736-2762 §10 traceability rows S16-R1..R17 (restate §1; no new tester-visible detail).

## Plan 2 L2763–3002 (§10 traceability rest incl. E2E rows, §11 verification tickets, Appendix merge notes: contradictions 1–17)
- INFO L2763-2950 traceability: restates §1/§6; no new tester-visible detail. Confirms S19-R8/R9 "certificate → day" (L2831), S22-N1 removed links excluded (L2849), S14-N2/N4 preferred contact without email listed unticked (L2870).
- INFO L2954-2971 §11: verification tickets SV-10863..SV-10873 (Plan 2) — "When all these tickets are marked Done, the feature is ready for QA" (build-readiness signal for our build verification later).
- INFO L2975-3002 Appendix contradictions resolved (API shapes, gates, numbering). L2990: an earlier 60-second resend guard existed but is dropped (TD-122) — a second send right away is allowed.
