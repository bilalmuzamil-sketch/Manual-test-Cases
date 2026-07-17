<!--
Source      : /root/.claude/uploads/dd1d42ba-2c47-5229-9b17-b8f94e3eb99a/
              652f5198-SimpleMode_StreamlinedWorkOrderCompletionBulkReceiving_4.doc
              (Confluence MHTML export, uploaded 2026-07-17; md5 de6fa115b7a38f6f9e4b52c39ca15b4e)
Decoded     : 2026-07-17, python email/quopri + BeautifulSoup html.parser, tables +
              <pre> markdown-macro blocks preserved; SAME extractor run on the _3 doc
              for the content diff (see spec-diff-v4-2026-07-17.md).
Version     : Header now reads "Draft for build — V2.6" (the _3 doc still said V2.4
              while being de-facto V2.5 — version strings remain untrustworthy; the
              content diff is authoritative).
What's new  : Story 18 — Core Parts (SV-8353, pre-resolve-before-receive, C-R1..C-R10);
              S11-R4 return-to-originating-line; S12-R6 vendorless group on single-part
              receive; S13-R8 vendor+PN changeable until receive (SV-8343); S6-R6
              REWRITTEN (no "needs vendor" report — QB Vendor Bill export + Vendors
              Expenses exclusion); Story 9 / S8-R9 Apply button REMOVED; S8-R7 cost
              editable ONLY when 0; part-sale POs confirmed in scope (S7/S8 AC + §8).
              4 new change-log rows (2026-07-15 x2, 2026-07-16 x2, all @Milos Vasic).
Note        : READABLE SNAPSHOT for traceability + the pending apply pass. The
              authoritative authoring baseline REMAINS build/simple-flow/requirements.md
              until the apply phase runs (do NOT treat this file as applied).
              ~~strikethrough~~ / ** markers are literal artifacts of the rich-text
              markup (e.g. S10-R2 is still struck through = still deprecated).
-->

# Simple Mode — Streamlined WO Completion & Bulk Receiving — SOURCE SNAPSHOT (2026-07-17, doc _4, "V2.6")


# Simple Mode — Streamlined Work Order Completion & Bulk Receiving

|  |  |
|---|---|
| Epic | SV-7301 |
| Owner | @Milos Vasic |
| Design | Simple Flow Design (Claude Design) · QA env — sv7301 (POC) |
| Status | Draft for build — V2.6 (core resolution = resolve-before-receive for special-order cores in BOTH flows, Story 18 / SV-8353; line approval = all must be approved; sell-price mandatory at save + orderable-from-line; editable cost on Accept-Delivery; in sync with Jira SV-7696…SV-7710 + SV-7870 + SV-7876 + SV-8183 + SV-8353) |

# Simple Mode — Product Specification

## 1. Business Case

Completing a work order in ShopView is slow and click-heavy — up to 18+ clicks from work order to invoice. For shops doing 20–50 WOs/day that's hours of friction, and it's the top friction point across the customer base. Single-operator and mobile shops don't need the PO/receiving ceremony but are forced through it. Parts added without vendor info get stuck. Accountants receive vendor invoices one PO at a time. The work-order list gives no receiving visibility. Missing cost at completion produces wrong QuickBooks margins.
Simple Mode cuts completion to 2–3 clicks, configurable per org, without sacrificing QuickBooks or inventory integrity . It is not a separate mode or app — it makes specific existing steps optional plus a set of pure additions . At default settings the app behaves exactly as today.
What we KEEP (not removed): individual-line Complete ; all existing per-part / per-line receive actions + "received" statuses ; a Receive button at the WO line level ; the only receiving change is that a WO's POs are bundled onto the same shared Accept Delivery / receive page (every receive entry point → that surface; receive all vendors at once).
Guiding principles: (1) Consistency over novelty. (2) Data integrity non-negotiable (§5). (3) Settings drive behavior; QA tests the matrix.

## 2. Feature Overview (at a glance)

- Settings — one Work Order settings page (no Full/Simple mode): Auto-approve lines, Create POs (+ Vendor invoice Optional/Required), Require review; plus existing Require tech story / mileage / engine hours / Auto-pick inventory. First-use defaults preserve today's behavior.
- Completion — one Complete Work Order button; three settings-driven flows (No-PO / PO+Optional / PO+Required) + a review-on variant; centralized required-fields modal; success screen.
- Vendorless / no-part-number parts — add with description + qty + sell only; on completion they sit on the WO's PO flagged "Vendor Missing" (no dummy PO).
- Bulk Receive — new page to receive many POs grouped by vendor; per-vendor apply-invoice / expand / receive-all.
- Vendor-aware receiving — Receive button on WO-originated POs; the existing multi-vendor Accept Delivery screen; assign vendor + merge.
- Visibility — Waiting-on-Parts column; Ready-for-Review queue.
(Full requirements + acceptance criteria per story in §7.)

## 3. Jobs to be Done

- Shop without POs → complete in one confirm. · Require vendor invoices → blocked until received. · Tech hands a part with no number/vendor → still add it. · Accountant with many POs from one vendor → receive on one page, one invoice number. · PO with several vendors → receive each on the same screen. · Foreman → review a completed WO before invoicing. · Scanning the WO list → see what's waiting on parts or review.

## 4. Key Decisions

- No operating-mode selector ; behavior driven by individual settings ( operatingMode dropped). No "VIN required" setting.
- First-use defaults preserve today's behavior: auto-approve OFF, create POs ON, vendor invoice REQUIRED.
- KEEP: individual-line Complete; existing per-part receive actions/statuses; a line-level Receive button ; only change = the WO's POs are bundled onto the same shared receive page .
- Line approval — all lines must be approved to complete. A WO cannot complete (or Send to Review) unless every line is approved . Holds regardless of Auto-approve: OFF → manual approval; ON → approved on add, but a manually unapproved line must be re-approved. An unapproved line surfaces the existing "you need to approve the line to complete the work order" error on Complete (no new disabled state). Applies across the optional/required-invoice flows and the review-on variant.
- No "dummy PO." A vendorless vendor part goes on the WO's normal PO , flagged "Vendor Missing" ; unflag once both a vendor and a part number are provided → eligible for QuickBooks.
- Sell price is the only mandatory financial field to add a part (enforced at save; cost is never mandatory — edited later on the PO/receive). A sell-price-only part (missing vendor and/or cost) is orderable from the line — the Order action creates the Vendor-Missing PO and moves it to waiting-to-receive , so it never sits stuck in "requested" with nothing to receive.
- Create POs OFF ⇒ no PO at all — received at request, no catalog/inventory sync; type by source field.
- Tech story is its own flow (Story 17).
- Review (Story 16) = two-state gate (Review → Reviewed → Complete); CTA "Send to Review"; VIN captured by the reviewer ; invoicing blocked until reviewed.
- Auto-pick inventory off → pick in the completion modal.
- Vendor invoice: optional to complete (Story 3 setting), but required to receive on any receive surface (Bulk Receive / Accept Delivery), along with vendor + part number for vendor-missing / no-PN.
- Field locking (receive screens): quantity editable; cost editable (pulled from WO/PO); sell editable until the WO is invoiced/paid, then locked with a lock icon + tooltip; after lock only cost is editable.
- Part number + vendor mandatory to receive.
- Accept Delivery is already multi-vendor (reused, not rebuilt); invoice mandatory there. Required-invoice completion routes "Receive Parts" to the shared receive page and round-trips back to the completion modal.
- Editing a part number → first-class inventory/catalog part.
- One vendor bill per vendor per receive; merge → one bill, keep-separate → two; invoice-# uniqueness relaxed.
- Success screen = WO# + total; invoice number on the Finance step.
- Close-confirm modal: Close = close only; Cancel = close + return to previous screen.
- Core parts. Resolution gates the money , not completion: inventory cores resolved in the completion modal (after Pick); special-order cores — pre-resolved before receiving in both flows (required and optional): the decision is saved on the request, the charge follows immediately, and it is auto-applied at receive. Gated only on undecided cores. No core-engine change. Canonical spec: Story 18 — Core Parts (SV-8353) .

## 5. Cross-System & Data Integrity (QuickBooks + Inventory)

Two QB flows: Vendor Bill → QBO (on receive; PO-dependent) · Journal Entry/Inventory → QBO (on invoice creation; not PO-dependent).
Invariants: (1) In-stock parts decrement inventory on completion — the Simple "skip" path's bare status setter emits no events and bypasses inventory movement / Part History / catalog creation / Delivery / Vendor Bill, so completion must still run the real lifecycle (or route via the WO PO + real receive). (2) POs ON + receiving → full pipeline receive → Delivery → Vendor Bill → QBO; both receive surfaces sync the vendor bill (Accept Delivery explicitly; receiveRequestedParts via the SpecialPartsGetsReceived subscriber); only complete-simple bypasses everything. (3) Inventory Part History preserved for any part that becomes inventory-tracked.
Accepted by design: Create POs OFF ⇒ no PO/vendor bill/AP sync + no catalog/inventory sync. Vendorless/no-PN ⇒ zero inventory interaction until a vendor and/or part number is added. Vendor-missing POs flagged + excluded from QB until vendor + part number provided.
Build-risk callouts (Story 10): the receive pipeline assumes a valid vendor ; several payload fields are required; a default part category must exist; a CataloguePart alone is not inventory stock.

## 6. Terminology

- Simple Mode — the feature name (a.k.a. Express Mode). Not an operating mode/toggle.
- Vendorless part — no vendor and possibly no part number; source vendor / found .
- Vendor Missing — flag on a PO that holds a part with no vendor; excluded from QuickBooks until vendor + part number are provided. (No separate "dummy PO".)
- Waiting on Parts — count of part requests still waiting-to-receive.
- Review / Reviewed — WO states between Approved and Complete when review is on (Story 16).
- Core part — a returnable part carrying a deposit-style charge; resolved as returned (no charge) or kept (charge added). Applies to inventory (charge derived from the catalog record) and special-order/vendor parts (charge entered manually); never to "found" parts.

## 7. Requirements

### Story 1: Work Order Settings (Simple Flow) — SV-7696

Summary. One Work Order settings page where an owner/admin turns the Simple-Flow options on/off. There is no "operating mode" (Full/Simple) selector — behavior is driven by the individual settings. The page shows the new Simple-Flow toggles together with the existing work-order settings.
Context. Settings → Work Order settings; org-wide; owner/admin only. Drop the POC's operatingMode field — do not build a Full/Simple selector.
Requirements — settings in the order shown on the page New (introduced by this feature):
- S1-R1 — Auto-approve lines. On → every line is approved the moment it's added (no approval step). Off → manual approval, as today. Must actually drive approval. Default OFF . Interaction: completion requires all lines approved — with auto-approve ON, manually unapproving a line blocks completion (via the existing "approve the line to complete the work order" error) until re-approved. See Stories 3/4/16.
- S1-R2 — Create purchase orders. On → vendor parts generate POs + the receiving step (today's behavior). Off → no POs created for vendor parts. Default ON .
- S1-R3 — Vendor invoice number (shown only when Create POs is on). Required → the WO can't be completed until parts are received and the invoice number captured. Optional → complete now, and receive parts later , when the WO is completed. Default REQUIRED .
- S1-R4 — Require review before completion. On → completing sends the WO to a separate review/sign-off before it can be invoiced (Story 16). Off → no review step. Default per cohort (see §8).
Existing (already in the app — surfaced here, reflecting current values; not changed by this feature):
- S1-R5 — Require tech story. Drives the Tech Story flow (Story 17).
- S1-R6 — Require mileage.
- S1-R7 — Require engine hours.
- S1-R8 — Automatically pick inventory parts. Off → in-stock parts must be picked in the completion modal before completing (Stories 3/4).
- S1-R9 — Save settings. Persists all of the above org-wide, to future completions only (never retroactively). This Settings will be applied if someone reopen the already completed WO
Defaults on first use (preserve today's behavior): Auto-approve OFF , Create POs ON , Vendor invoice REQUIRED ; the existing settings keep whatever the org already has.
Out of scope / removed. No operating-mode selector ( operatingMode dropped). No "VIN required" setting (VIN is handled by the existing required-fields behavior at completion).
Acceptance Criteria
- Settings shown in the order above; new vs existing visually distinct; no operating-mode selector anywhere.
- Create POs on → Vendor invoice (Optional/Required) appears with helper text; off → hidden + no vendor-invoice capture in completion.
- Auto-approve on → a line is approved immediately on add; off → manual approval as today.
- Existing settings (tech story / mileage / hours / auto-pick) display + persist the org's current values.
- First-time defaults: auto-approve OFF, create POs ON, vendor invoice REQUIRED; existing settings unchanged.
- Save persists org-wide; future completions only; non-admin can't see/modify.
- No requireVin setting and no operatingMode field in the implementation.
UI/UX. Simple Flow Design — Settings · QA — Work Order Settings

### Story 2: Simple Completion — No-PO (Skip) Flow — SV-7697

~~Summary.~~ ~~In a shop with PO creation off, complete a work order in a single confirm and go straight to an invoice-ready draft.~~ ~~(Review-OFF path; when Require review is on, see Story 16.)~~
~~Context.~~ ~~Create POs off; WO has approved lines; user has WO edit access.~~
~~What we KEEP.~~ ~~Individual-line Complete; all existing per-part receive actions + "received" statuses.~~
Requirements
- S2-R1 — A Complete Work Order button next to New Line.
- S2-R2 — Clicking it opens a centralized modal collecting the existing required fields ( mileage / engine hours / VIN per existing rules). Tech story is gated via the Tech Story flow (Story 17), not collected here. Auto-pick-off → pick inventory parts here.
- S2-R3 — On confirm: no PO/receive/invoice step; all lines → Completed; Reviewed runs in the background.
- S2-R4 — Success screen (WO# + total; Done / Go to Invoice).
- S2-R5 — Go to Invoice → Finance step (invoice number shown there).
- S2-R6 — No PO / vendor bill / AP sync. A vendor/found part is received at request time, not synced to catalog/inventory . In-stock parts still decrement inventory.
Acceptance Criteria
- One-confirm completion → success screen; lines → Completed; Reviewed in background.
- Missing required fields (or tech story via Story 17) → blocked.
- POs off → no PO/bill/AP-sync + no catalog/inventory sync; in-stock parts decrement inventory + Part History.
- Auto-pick off → must pick before Complete.
- Individual-line Complete + per-part receive actions still work.
- Re-open (uncomplete a line / add a line) → WO returns to Approved; modal summarises already-received vs newly-added.
~~UI/UX. ~~ ~~Simple Flow Design — completion flow~~ ~~·~~ ~~QA — Work Order~~

### Story 3: Simple Completion — PO On + Optional Vendor Invoice — SV-7698

Summary. For shops that create POs but don't require invoices upfront: complete the work order from one place — order/create POs in the background, pick parts, then either receive now (all vendors at once) or finish and receive later . (Review-OFF path; review on → Story 16.)
Context. Create POs on; Vendor invoice = Optional; user has WO edit access.
What we KEEP. Individual-line Complete + per-part receive actions + "received" statuses; a Receive button at the WO line level ; the WO's POs are bundled onto the same shared receive page.
We are going to cover all scenarios here , with the Tech story ON/Off, Mileage ON/Off, Engine hours ON/Off, Automatically pick inventory parts ON/Off
Requirements (in flow order)
- S3-R1 — Background order + POs. On Complete, if parts aren't already ordered/received, actually order all approved-line parts and create the POs in the background (a vendorless / sell-price-only part is placed on the WO's PO, flagged Vendor Missing — Story 6, flagged them from QB integration ). Parts must reach waiting-to-receive so "Receive parts" always has something to receive — a part left in requested must never be routed to an empty receive screen.
- S3-R2 — Parts + pick status. An informational modal shows the count of parts to receive and the inventory-pick status (to-pick / picked). Auto-pick-off → pick inventory parts here.
- S3-R3 — Required vehicle fields (separate step). Collect mileage + VIN ( in case Review toggle is off, in case its ON Vin will be asked on the place when Reviewer click review) + engine hours (when missing). Tech story is NOT here ( keeping mostly current behaviour ) — its own flow (Story 17) when required.
- S3-R4 — Actions. Receive parts , Complete without receiving , Cancel .
- S3-R5 — Receive parts. Routes to the shared Accept Delivery page (not an inline popup as now ) where they receive all the parts for all vendors on the WO at once . On return, the user lands on the originating line (scroll/focus preserved), not the top of the WO — see Story 11 (S11-R4).
- S3-R6 — Complete without receiving. Completes the WO; unreceived parts stay waiting-to-receive (Waiting on Parts column). The WO line still shows a Receive button so the user can access this later
- S3-R7 — Cancel. No change; closes the modal.
- S3-R8 — Success screen. WO# + total; Go to Invoice / Done (invoice number on the Finance step).
- S3-R9 — All lines must be approved to complete. The work order cannot be completed until every line is approved (replaces the earlier partial/mixed-approval behavior). Holds regardless of the Auto-approve lines setting: OFF → lines approved manually; ON → approved on add, but a manually unapproved (unauthorized) line must be re-approved manually . If any line is unapproved when the user clicks Complete , the Simple modal reuses the system's existing "you need to approve the line to complete the work order" error and does not complete the WO — the CTA stays active (no new disabled state). Completion proceeds once all lines are approved. (Individual-line Complete unaffected.)
Core parts. Core resolution for this flow is specified on Story 18 — Core Parts (SV-8353) (canonical). Optional-invoice summary: inventory cores resolve in the completion modal after Pick; special-order cores are resolved before receiving on a dedicated resolve screen shown right before the Complete without receiving / Receive parts choice (Not OK → charge on the invoice; OK → no charge, vendor return at receive). Completion/invoice are gated only on undecided cores; the saved decision auto-applies at receive. No core-engine change.
Acceptance Criteria
- Unordered parts → background POs (vendorless on the WO's PO, flagged Vendor Missing); modal shows count.
- Modal shows parts-to-receive count + inventory pick status; auto-pick-off → pick in the modal.
- Required mileage + VIN + engine hours (when missing) collected in the modal; tech story via Story 17.
- Receive parts → shared Accept Delivery page; all vendors' parts for the WO received together.
- Complete without receiving → WO completes; parts waiting-to-receive; WO line still shows a Receive button.
- Cancel → no change; re-Complete creates no duplicate POs (idempotent).
- Re-open → Approved + modal summary. Success screen → WO# + total.
- An approved line whose part is still "requested" (sell-price-only, missing vendor/cost) is ordered first on Complete (→ waiting-to-receive) so "Receive parts" shows it — never an empty receive screen.
- Any unapproved line (never approved, or manually unapproved when auto-approve is ON) → clicking Complete shows the existing "you need to approve the line to complete the work order" error; the WO does not complete.
- Approving all lines → completion proceeds normally.
Acceptance Criteria (core). Specified on Story 18 (SV-8353) — pre-resolve before receive (optional flow), auto-apply at receive, gate only on undecided cores.
UI/UX. Simple Flow Design — completion flow · QA — Work Order

### Story 4: Simple Completion — PO On + Required Vendor Invoice — SV-7699

Summary. For shops that require vendor invoices: same one-place completion as Story 3, but the work order cannot be completed until all parts are received (invoice number captured). (Review-OFF path; review on → Story 16.)
Context. Create POs on; Vendor invoice = Required; user has WO edit access.
What we KEEP. Same as Story 3 (individual-line Complete + per-part receive + line-level Receive button + bundle to shared receive page).
Requirements (in flow order — same as Story 3, with the required-invoice gate)
- S4-R1 — Background order + POs (vendorless on the WO's PO, flagged Vendor Missing — Story 6). A sell-price-only part (missing vendor and/or cost) is ordered too → waiting-to-receive (Story 6, S6-R7); parts must not remain in "requested" with nothing to receive.
- S4-R2 — Parts + pick status in the modal (auto-pick-off → pick here).
- S4-R3 — Required vehicle fields (mileage + engine hours, when missing); tech story separate (Story 17).
- S4-R4 — Actions + gated CTA. Receive parts + Cancel . The primary CTA is "Complete Work Order" , disabled until all parts are received . No "Complete without receiving" in this flow.
- S4-R5 — Receive parts (round-trip). Routes to the shared Accept Delivery page (receive all vendors at once; qty, tax, date, note, invoice # per vendor). When receiving finishes — or the user clicks "Back to Work Order" on the Accept Delivery page — they return to this modal ; once everything is received, Complete Work Order enables.
- S4-R6 — Cancel. No change.
- S4-R7 — Complete Work Order (enabled once all received) → success screen (WO# + total; Done / Go to Invoice).
- S4-R8 — All lines must be approved to complete. The work order cannot be completed until every line is approved (replaces partial/mixed-approval). Holds regardless of Auto-approve: OFF → manual approval; ON → approved on add, but a manually unapproved line must be re-approved. Any unapproved line → the Complete Work Order button is disabled , with a tooltip describing the reason (which line needs approval); it enables once all lines are approved. (Separate from the required-invoice receive gate in S4-R4/R5.)
Acceptance Criteria
- Background POs on Complete (vendorless on the WO's PO, flagged Vendor Missing).
- Modal shows parts-to-receive count + pick status; required fields collected; tech story via Story 17.
- Primary CTA reads "Complete Work Order" , disabled until all parts received.
- Receive parts → shared Accept Delivery page (all vendors at once); finishing or "Back to Work Order" returns to the modal; CTA enables when all received.
- No "Complete without receiving" in this flow.
- Cancel → no change; completion → success screen (WO# + total).
- Any unapproved line (never approved, or manually unapproved when auto-approve is ON) → the Complete Work Order button is disabled with a tooltip describing the reason; the WO does not complete.
- Approving all lines → completion proceeds (subject to the required-invoice receive gate).
Core parts. Core resolution for this flow is specified on Story 18 — Core Parts (SV-8353) (canonical). Required-invoice summary: inventory cores resolve in the completion modal after Pick; special-order cores are resolved before receiving on the resolve screen (same pre-resolve mechanism as the optional flow), then received. No core-engine change.
Acceptance Criteria (core). Specified on Story 18 (SV-8353) — resolve-before-receive (consistent with the optional flow); inventory cores at Pick.
UI/UX. Simple Flow Design — completion flow · QA — Work Order

### Story 5: Add a Vendorless / No-Part-Number Part — SV-7700

Summary. Let an advisor add a part with only description, quantity, and sell price — to capture real-world parts that have no number or vendor yet.
Context. WO line in an editable state; user has WO edit access.
Requirements
- S5-R1 — A part can be requested with description, quantity, and sell price mandatory ; part number, cost, and vendor optional/empty. Sell price is validated at save — the part cannot be saved/closed without it (inline error), not deferred to completion.
- S5-R2 — The part's type is the existing source field — vendor or found (never inventory ); treated as vendorless downstream.
- S5-R3 — The part is editable after creation.
- S5-R4 — With no part number, the part has zero inventory interaction until a part number is added (Story 10). A part number is required at receive .
Acceptance Criteria
- A part added with description + quantity + sell price only saves as a vendorless part (source vendor/found).
- Missing description, quantity, or sell price → saving is blocked inline at save (not deferred to completion).
- A no-part-number part creates no inventory item / Part History.
- Adding a part number/vendor later transitions it out of vendorless handling.
- The part cannot be received until a part number (and vendor) is entered at receive.
UI/UX. Simple Flow Design · QA — Work Order Lines

### Story 6: Vendorless Part on the WO PO — "Vendor Missing" + QB Flag — SV-7701

Summary. When a vendor / special-order part on a work order has no vendor , it goes onto the work order's normal purchase order like any other special-order part — but that PO is flagged "Vendor Missing" and kept out of QuickBooks until a vendor and a part number are provided. There is no separate "dummy" PO.
Context. Create POs on; the WO has a vendorless vendor part at completion. (Create POs off → no PO at all — Story 2.) PO creation + grouping is existing behavior; this story adds the indication , the QB flag/exclude , and the unflag condition . Assign-vendor / merge UI = Story 13; part-number entry UI = Story 10.
Requirements
- S6-R1 — No dummy PO. Vendorless vendor part(s) are placed on the work order's PO — the same PO that holds the WO's other special-order parts (grouping onto one PO is existing behavior).
- S6-R2 — Indication. A PO holding a vendor-missing part shows a "Vendor Missing" indication in the PO list + detail, with a "+N" count when the PO holds multiple vendors.
- S6-R3 — QuickBooks flag. A vendor-missing PO is flagged and excluded from QuickBooks sync .
- S6-R4 — Options to resolve. On the PO the user is offered the option to select a vendor (Story 13) and to enter/edit the part number (Story 10).
- S6-R5 — Unflag condition. Once both a vendor and a part number are provided, the PO is unflagged → eligible for QuickBooks.
- S6-R6 — Reporting impact (no PO report exists). There is no dedicated purchase-order report and no "needs vendor" marker today, so nothing "marks" these POs. What actually happens: a vendor-missing PO has no vendor, so its spend is excluded from the QuickBooks Vendor Bill export (inner-join on vendor) and is not counted in the Vendors Expenses report (grouped by vendor) until a vendor is assigned — then it flows in normally. (Separate, cost-not-vendor note: a $0-cost vendor-missing part can skew the Inventory report's average cost.)
- S6-R7 — Orderable from the line (sell-price-only parts). A part with a sell price but no cost and/or no vendor can be ordered from the line's Order action — creating/joining the WO's Vendor-Missing PO and moving it from requested → waiting-to-receive (same order path as the completion flow, not completion-only). At receive, vendor + part number are still required (cost editable — Story 10).
Out of scope. The assign-vendor / merge UI (Story 13) and the part-number edit UI (Story 10) themselves; the POs-off path (Story 2).
Acceptance Criteria
- Vendorless vendor part at completion → placed on the WO's PO (not a separate dummy PO); other special-order parts share that PO.
- PO shows "Vendor Missing" (+N for multiple vendors) in list + detail.
- Vendor-missing PO flagged + excluded from QuickBooks sync.
- User can select a vendor and enter the part number on the vendor-missing PO.
- Providing both vendor + part number unflags the PO → eligible for QB.
- A vendor-missing PO's spend is excluded from the QuickBooks Vendor Bill export and from Vendors Expenses until a vendor is assigned; once assigned it appears normally. (No "needs vendor" marker is added by this story.)
- Given a sell-price-only part (no vendor/cost), clicking Order on the line creates/joins the Vendor-Missing PO and moves it to waiting-to-receive — without completing the WO.
UI/UX. Simple Flow Design · QA — Purchase Orders

### Story 7: PO Multi-Select + "Receive Selected" — SV-7702

Summary. Add the multi-select affordance on the Purchase Orders list so an accountant can pick several POs and open them in the Bulk Receive page together.
Context. Parts → Purchase Orders, with receiving access. This is the entry point only; the destination page is Story 8.
Requirements
- S7-R1 — A select-all checkbox + per-PO checkboxes on the PO list.
- S7-R2 — When any PO is selected, a bar shows "N purchase orders selected" , Clear , and Receive Selected .
- S7-R3 — Receive Selected opens the PO Bulk Receive page (Story 8) with the selected POs.
- S7-R4 — Fulfilled (already-received) POs are not selectable.
- S7-R5 — Vendor-missing POs are selectable and clearly indicated.
Acceptance Criteria
- Selecting POs → bar with count + Clear + Receive Selected.
- Receive Selected opens Bulk Receive with exactly the selected POs.
- Fulfilled POs not selectable; vendor-missing selectable + indicated.
- Select-all toggles only the POs on the current page/filter.
- Part-sale-originated POs appear in the list and are selectable/receivable like WO-originated POs.
UI/UX. Simple Flow Design · QA — Purchase Orders

### Story 8: PO Bulk Receive Page — SV-7703

Summary. A single page to receive many purchase orders at once, grouped by vendor — reached from the PO list via Receive Selected (Story 7). Behaves consistently with the single/multi-PO receive screen. New page (QA has the POC prototype; this builds it for real).
Context. Reached via Receive Selected; user has receiving access.
Requirements
- S8-R1 — Entry + Back. A "Back to Purchase Orders" button in the top-left returns to the PO list.
- S8-R2 — Grouped vendor → POs , with a vendor count .
- S8-R3 — Collapsible POs + per-vendor Expand all / Collapse all (each vendor has its own control; clearly indicated) — not one global control.
- S8-R4 — PO row: PO number, related work order (or an inventory / no-WO indicator), parts count.
- S8-R5 — Selection (nothing selected by default). Selecting a PO selects all its parts; individual parts also selectable; actions locked until checked.
- S8-R6 — Receive parts (N). Per-PO button (N = parts to receive); disabled until the vendor invoice number is entered (and, for vendor-missing, until a vendor is assigned + any missing part number entered).
- S8-R7 — Editable fields + locking. Quantity is editable (supports partial receive). Cost is editable ( if the cost is 0 , if cost is not 0 cost filed should not be editable) , pulled from the work order / PO when available. Sell price is editable until the WO is invoiced/paid , then locked — shown with a lock icon + tooltip "Locked — this part is already invoiced or paid." After it locks, only cost remains editable.
- S8-R8 — Vendor-missing POs. Assign a vendor here → the PO moves into that vendor's group ; enter the missing part number → unflag → receiving enabled.
- S8-R9 — Set one invoice number across a vendor's selected POs (Story 9) — the number is typed and remembered per PO; no separate Apply button .
- S8-R10 — Receive all — receive everything selected at once; partial receive supported.
- S8-R11 — Pipeline. Same receive pipeline as the single-PO screen → Delivery → Vendor Bill → QuickBooks.
Out of scope. Merge / keep-separate (Story 13 / Accept Delivery) — this page only assigns a vendor.
Acceptance Criteria
- Reached via Receive Selected; top-left Back to Purchase Orders returns to the list.
- Grouped vendor → PO + vendor count; per-vendor Expand/Collapse all.
- Nothing selected by default; selecting a PO selects all its parts; individual parts selectable; actions locked until checked.
- Receive parts (N) disabled until the vendor invoice number is entered.
- Quantity + cost editable (cost from WO/PO); sell editable until WO invoiced/paid then locked (icon + tooltip); after lock only cost editable.
- Vendor-missing PO: assigning a vendor moves it into that vendor's group; entering the part number unflags + enables receiving.
- Apply invoice (Story 9) + Receive all + partial receive work.
- Receiving creates the vendor bill + syncs to QuickBooks.
- Part-sale-originated POs can be received on this page like WO-originated POs.
Core parts. Specified on Story 18 — Core Parts (SV-8353) . On this page a special-order/vendor core is received (core WorkOrderPart created); a decision pre-resolved on the WO auto-applies at receive, and core-only partial receive is supported so a single cored line can be settled. No core-engine change.
Acceptance Criteria (core). Specified on Story 18 (SV-8353) — receiving a cored line makes/keeps its resolution settled; single cored line receivable on its own.
UI/UX. Simple Flow Design — PO Bulk Receive · QA — PO Bulk Receive

### Story 9: Per-Vendor "Apply Invoice to Selected POs" — SV-7704

Summary. Apply one invoice number across several of a vendor's POs on the Bulk Receive page, so an accountant fills it once and receives them together.
Context. Bulk Receive page (Story 8); a vendor with multiple POs. The invoice number is what gates Receive (S8-R6) — this control fills it in bulk.
Requirements
- S9-R1 — Under the vendor name, a field to enter one invoice number for that vendor’s POs, available when ≥1 PO under that vendor is selected . There is no "Apply" button — the number is remembered as typed.
- S9-R2 — Select PO(s) and type one invoice number → it is filled into only the selected POs of that vendor (still editable per PO). Then Receive all for that vendor.
- S9-R3 — Scoped per vendor ; does not affect other vendors' / unselected POs. Not for the vendorless group (assign a vendor first).
Acceptance Criteria
- The invoice-number field is available only with ≥1 selected PO under that vendor.
- The typed number fills into only the selected POs under that vendor; each PO's number stays editable.
- It doesn't affect other vendors' POs or unselected POs.
- After the number is entered, Receive all receives that vendor's selected POs at once.
- Vendorless group shows no invoice-number field (assign a vendor first).
- Same invoice number may be reused across POs (uniqueness relaxed).
UI/UX. Simple Flow Design — PO Bulk Receive · QA — PO Bulk Receive

### Story 10: Inline Part-Number Fix → First-Class Inventory Part — SV-7705

Summary. Fix a missing part number during receiving and have that part become a proper inventory/catalog part. Entering the part number is mandatory to receive.
Context. Receiving on Bulk Receive (Story 8) / Accept Delivery; parts may lack a part number or cost.
Requirements
- 
1. **S10-R1** — A part with no number shows **"Missing part number"** with an **Edit** action → enter → **save**; the saved number persists immediately. **Entering the part number is mandatory to receive that part.** A **dummy/suggested** number reuses the existing "found" mechanism. Same edit pattern everywhere a number can be missing.
2. **~~S10-R2~~** ~~— When a part number is **added, the part becomes a first-class inventory/catalog part** (POs-on receive): an **existing** number **links** the line to the existing item (updates stock + received cost + Part History, without overwriting the catalog description/category); a **new** number **creates** a new item.~~
3. **S10-R3 (UPDATED — aligned with SV-7703 S8-R7; applies on BOTH the Bulk Receive page AND the single / Accept-Delivery receive screen — parity)** — Field rules: **quantity + cost editable** (cost **pulled from the WO/PO** when available; **editable when $0 / missing on either receive surface**); **sell price editable until the WO is invoiced/paid, then locked** — shown with a **lock icon + tooltip "Locked — this part is already invoiced or paid."** After it locks, **only cost** remains editable.
Negative cases
- On an invoiced/paid WO, the sell price is locked ; cost remains editable.
- A part cannot be received until it has a part number (and a vendor for vendor-missing POs).
Acceptance Criteria
- No-number part → Edit → enter → save persists; Receive stays disabled until a number is entered.
- New number on receive → new inventory/catalog part + stock + Part History.
- Existing number on receive → links to that item, updates stock + received cost + Part History, without overwriting description/category.
Technical guardrails. The inline endpoint must drive catalog creation/linking + the inventory stock Part + Part History (not just store a string); a vendor is required before receive; required receive-payload fields + a default part category must be present; don't rely on the complete-simple bypass to create inventory.
Core parts. Core handling is specified on Story 18 — Core Parts (SV-8353) . This story only covers the part-number fix + field rules; a cored line inherits the same received-part rules and is billed once resolved. No core-engine change here.
UI/UX. Simple Flow Design · QA — PO Bulk Receive

### Story 11: Receive Button on Work-Order-Originated POs — SV-7706

Summary. Add a Receive action on POs that came from a work order, so a receiver doesn't have to go back to the work order to receive.
Context. A PO that originated from a work order. (Today these can only be received from the work order itself.)
Requirements
- S11-R1 — Add a Receive action on WO-originated POs in both the PO list and the PO detail card (the detail card currently hides it — fix that), opening Accept Delivery directly.
- S11-R2 — The opened flow is the shared Accept Delivery surface (Stories 12–13).
- S11-R3 — Hidden for office/readonly users and for fulfilled POs.
- S11-R4 — Return to the originating line. After receiving (Receive → Accept Delivery → back to the work order), the user is returned to the exact WO line they receded from (scroll/focus preserved), not the top of the WO — for instant visual confirmation of the received part.
Acceptance Criteria
- Receive appears on WO-originated POs in the list + detail; opens Accept Delivery.
- A non-WO PO retains its existing receive behavior.
- Office/readonly → hidden; fulfilled → no Receive.
- On return from receiving, the work order scrolls/focuses to the originating line (not the top).
UI/UX. Simple Flow Design · QA — Purchase Orders

### Story 12: Accept Delivery — multi-vendor (existing) + Simple-Flow parts support — SV-7707

Summary. The Accept Delivery receive screen already exists and already supports multiple vendors on one PO . This ticket does not rebuild that — it ensures the new Simple-Flow parts flow into the existing screen and enforces the receive gates.
Already existing (reused as-is — do NOT rebuild). Grouped by vendor, multiple vendors on one PO (each group own invoice number / date / tax / note / Receive); per-item selection + received-quantity editable per item with the "received more than ordered" warning; multiple vendors summarized with an indicator.
New work in this ticket
- S12-R1 — Simple-Flow parts flow in. The new vendorless / no-part-number WO parts (Story 5) and WO-originated POs reached via the new Receive button (Story 11) must appear and be receivable here (vendor-missing in their own group at the bottom).
- S12-R2 — Receive gates. To receive: vendor set, any missing part number entered, vendor invoice number captured. Vendor-missing → assign a vendor (Story 13); missing part # → enter it (Story 10).
- S12-R3 — "+N" vendor indicator when a PO holds multiple vendors; vendor-missing group leads.
- S12-R4 — Each vendor group → its own vendor bill → QuickBooks (separate AP entries). Partial delivery + post-receipt behavior unchanged.
- S12-R5 — Editable cost (parity with Bulk Receive). On this Accept-Delivery screen, cost is editable when $0/missing (pulled from WO/PO when available) — matching Story 8 (S8-R7) / Story 10. Quantity stays editable; the sell-price lock rule is unchanged.
- S12-R6 — Vendorless group surfaced when receiving from a WO part. Clicking Receive on a single WO part opens Accept Delivery showing all to-receive parts for that part's vendor (FE sends the vendor ID; BE returns only that vendor's parts) plus the vendorless group — so the user can assign a vendor / merge a vendorless part into this receive on the spot (reusing the same invoice number) rather than going back.
Out of scope. Building multi-vendor receive (exists); the Receive button entry (Story 11); assign-vendor / merge (Story 13); the Bulk Receive page (Story 8).
Acceptance Criteria
- Existing multi-vendor receive still works unchanged.
- New vendorless / no-PN WO parts + WO-originated POs appear and can be received (vendor-missing in their own group).
- Receive gated on vendor + part number + invoice number.
- "+N" indicator shown when a PO holds multiple vendors.
- Each vendor group → own vendor bill → QuickBooks.
- A $0/missing-cost part on Accept Delivery has editable cost (parity with Bulk Receive); sell-price lock rule unchanged.
- Receiving a single WO part shows that vendor's other to-receive parts + the vendorless group; the user can assign/merge a vendorless part there.
UI/UX. Simple Flow Design — Accept Delivery · QA — Accept Delivery

### Story 13: Assign Vendor + Merge / Keep-Separate — SV-7708

Summary. Assign a vendor to a vendor-missing PO at receive and choose to merge or keep it separate — correcting vendor data and clearing the QuickBooks flag.
Context. Accept Delivery with a vendor-missing group.
Requirements
- S13-R1 — A vendor-missing group provides a vendor dropdown to assign a vendor at the PO level (saved locally and on the backend).
- S13-R2 — Vendor already on this PO → "Add to {vendor}?" → Yes, Merge (move items into that group) vs No, Keep Separate (two invoice numbers for the same vendor on one PO is valid).
- S13-R3 — Vendor on another PO for the same work order → prompt to merge the POs (move items to the target, remove the emptied source, redirect to the target).
- S13-R4 — Different vendor, no collision → auto-assign + clear the QuickBooks flag .
- S13-R5 — After assignment, the group's Receive action enables.
- S13-R6 — Part number required. If a part number is missing, the user gets an indication to enter one; receiving is blocked until it's filled.
- S13-R7 — Cost / sell price required. If cost / sell price is missing, the user gets an indication to enter one; receiving is blocked until it's filled.
- S13-R8 — Vendor & part number stay changeable until receive. An assigned vendor is not locked on selection — it stays changeable (same dropdown) until a part is received or the WO is invoiced/paid, so a wrong pick can be corrected. The part number is likewise editable (edit icon) after entry, under the same condition. Prevents receiving against the wrong vendor (SV-8343).
Acceptance Criteria
- Assign vendor → saved; Receive enables.
- Same-PO collision → merge / keep-separate prompt (merge = one bill, keep-separate = two).
- Cross-PO same-WO → merge POs + redirect to target.
- New vendor → assign + clear QB flag.
- Receiving blocked when the WO is invoiced/paid.
- If the part number is empty, the user must enter one before receiving.
- If the cost / sell price is empty, the user must enter one before receiving.
- An assigned vendor can be changed until a part is received or the WO is invoiced/paid; part number editable via an edit icon under the same condition.
Technical guardrails. Match vendors by ID, not name ; use a targeted backend lookup for the cross-PO match (not a capped list scan); surface errors on assign/merge failures. Merge scope = same work order.
UI/UX. Simple Flow Design — Accept Delivery · QA — Accept Delivery

### Story 14: "Waiting on Parts" Column + Receive Shortcut — SV-7709

Summary. Show how many parts each WO is waiting on and let the user jump into receiving — without opening each WO.
Context. Work Orders list; all statuses.
Requirements
- S14-R1 — An optional "Waiting on Parts" column (toggle in the column selector, off by default) shows the count of unreceived parts per WO, for all statuses.
- S14-R2 — Clicking the count navigates to Accept Delivery for that WO's first unreceived PO.
- S14-R3 — Receiving itself behaves as today.
Acceptance Criteria
- Column (off by default) shows the count for all statuses.
- Click → Accept Delivery for the WO's first unreceived PO.
- Nothing to receive against (incl. POs-off) → "—" with no link .
- Several unreceived POs → link targets the first.
UI/UX. Simple Flow Design · QA — Work Orders List

### Story 15: UX Refinements — Labels, Centralized Required Fields, Close Confirmation — SV-7710

Summary. Clearer labels, a centralized required-fields modal, and a clear close confirmation.
Requirements
- S15-R1 — The work-orders primary button reads "Create Work Order" .
- S15-R2 — Required fields at completion ( mileage / VIN when required ) collected in a centralized center modal . Tech story is NOT in the modal — it has its own flow (Story 17).
- S15-R3 — The completion success screen shows WO# + total with Done / Go to Invoice (invoice number on the Finance step).
- S15-R4 — A close-confirmation modal for leaving the complete flow: Close = closes the modal only, no discard, stays on the WO (prominent/red); Cancel = closes the modal + returns to the previous screen (text link, far left). ⚠️ Design pending for the close-confirm specifically.
Acceptance Criteria
- Primary button reads "Create Work Order".
- Missing mileage/VIN → centralized center modal; tech story handled by Story 17.
- Success screen shows WO# + total with Done / Go to Invoice.
- Close = close only (no discard), stays on the WO; Cancel = close + return to previous screen.
- Other consumers of the shared confirmation keep their existing action labels.
UI/UX. Simple Flow Design · QA — Work Orders List — ⚠️ close-confirm Figma still to be added.

### Story 16: Simple Completion — Review ON (review gate + sign-off) — SV-7870

Summary. When Require review is on, completing a work order sends it to review instead of completing it, and a different person (manager/foreman) signs off before it can be invoiced. Documents the deltas when review is on ; PO/invoice combos are unchanged (Stories 2/3/4).
Context. Review = QA of the physical work by a manager/foreman, not the completer. When review is off, completion behaves as Stories 2/3/4 (Reviewed in background).
Requirements — deltas when review is ON
- R1 — Setting "Require review before completion" (S1-R4).
- R2 — CTA/labels change → "Send to Review" ("Complete & Send to Review"); receive button + labels differ per design.
- R3 — Details step collects mileage + engine hours only ; VIN is captured later by the reviewer in the Mark Reviewed dialog.
- R4 — "Receive Parts" routes to the shared receive page — no inline modal.
- R5 — States: Active(Approved) → [Send to Review] → Review (amber) → [Mark Reviewed] → Reviewed (green) → [Complete Work Order] → Complete ; status banners (amber "Ready for Review", blue "sign-off complete").
- R6 — On Send to Review: lines lock to Complete; inventory auto-picked.
- R7 — Mark Reviewed = manager/foreman only; dialog captures VIN (required if missing) ; Confirm disabled until VIN. Advisor → disabled + "Awaiting review".
- R8 — After sign-off → Reviewed; final Complete Work Order (any role) → Complete (invoice-ready). Invoicing blocked until reviewed.
- R9 — Ready for Review list filter/column (reviewer queue).
- R10 — Test ids: button_mark_reviewed , input_review_vin , input_review_note , button_confirm_review .
- R11 — All lines must be approved to Send to Review. The WO cannot be sent to review / completed until every line is approved (replaces the earlier mixed-approval rule). Same as Stories 3/4: any unapproved line — never approved, or manually unapproved when auto-approve is ON — makes clicking Send to Review surface the existing "you need to approve the line to complete the work order" error; it proceeds once all lines are approved.
- R12 — Auto-complete trigger (last open line resolved, any path). When the WO's last remaining open line becomes resolved , the outcome depends on Require review: OFF → the WO is auto-marked Complete (invoice-ready; no extra manual step); ON → the WO goes to Ready for Review and must be signed off before Complete (unchanged from today). Applies regardless of how the last line resolves : (a) a single line ; (b) bulk (several at once); (c) split — if the original and/or newly created WO ends fully resolved, it auto-completes; (d) delete a line — if the remaining lines end resolved, the WO auto-completes.
- R13 — Clock-out exception (intentional). A clock-out that finishes the last line routes the WO to Ready for Review even when review is OFF — left as-is on purpose (a technician may not be allowed to complete a WO). The one path that does not auto-Complete when review is OFF.
Acceptance Criteria
- Review off → completes as Stories 2/3/4 (no review UI).
- Review on → CTA "Send to Review"; Details = mileage + hours only (no VIN).
- Receive Parts → shared receive page (no inline modal).
- Send to Review → state Review (badge + banner); lines locked; inventory auto-picked.
- Advisor → Mark Reviewed disabled with "Awaiting review".
- Manager → Mark Reviewed dialog requires VIN (if missing) Confirm disabled until VIN.
- After sign-off → Reviewed; Complete Work Order → Complete + invoice-ready.
- WO cannot be invoiced until reviewed; reviewers can filter the list to "Ready for Review".
- Any unapproved line (never approved, or manually unapproved when auto-approve is ON) → clicking Send to Review shows the existing "approve the line to complete the work order" error; it proceeds once all lines are approved.
- Review OFF : last open line completed (single or bulk) → WO = Complete (not Ready for Review).
- Review OFF : a split leaving a WO fully resolved → that WO = Complete .
- Review OFF : deleting a line that leaves remaining lines resolved → WO = Complete .
- Review ON : all of the above → Ready for Review + sign-off (regression check).
- A completed WO behaves like any normal completion (Complete lists, invoiceable).
- Clock-out finishing the last line → Ready for Review even when review is OFF (intentional exception).
Core parts. Core resolution is specified on Story 18 — Core Parts (SV-8353) ; the review path only changes when it happens. Inventory cores resolve in the completion modal (after Pick) before Send to Review . Special-order cores (both required and optional) are pre-resolved before receiving on the resolve screen before Send to Review (no longer deferred to the invoice gate). Invoicing is blocked until both Reviewed and all cores resolved. No core-engine change.
Open. Setting default (on for bigger/existing shops?); role-gating tied to custom roles vs open for v1. ⚠️ Design pending.
UI/UX. Simple Flow Design

### Story 17: Tech Story Flow — per-line entry + completion gate — SV-7876

Summary. Capture a tech story per work-order line, entered inline and/or gated at completion — so the technician (often a different person than the completer) can document the work without cramming it into the completion modal.
Context. Tech story is its own flow , not a step inside the completion modal. Driven by Require tech story (S1-R5).
Requirements
- TS-R1 — Inline entry. Each WO line has a Story sub-row; empty → "Add tech story for this line" link → opens the modal at that line.
- TS-R2 — Setting. When Require tech story is on, every line needs a tech story before completion.
- TS-R3 — Gate at completion. Clicking Complete with a line missing a story opens the tech-story modal first , then chains into the completion flow (Stories 2/3/4 or Story 16). Gate order: tech story first, then parts (pick → receive), then complete/send-to-review.
- TS-R4 — Modal. Header "Tech story" + WO# · Customer ; per-line card (line #, name, Technician); "Line X of N"; required textarea; Next disabled until non-empty; Back after line 1; last line = Continue (chained) / Save .
- TS-R5 — Saved state. Saved stories render inline — green check + text + Edit link.
- TS-R6 — Test id input_tech_story .
Decision. Entered both inline and via the gate modal — supersedes the earlier "on-the-line only" wording in S15-R2.
Acceptance Criteria
- Empty line shows "Add tech story for this line"; clicking opens the modal at that line.
- Require-tech-story on + a line missing a story → Complete opens the tech-story modal first, then chains into completion.
- Next disabled until non-empty; Back after line 1; last line shows Continue (chained) or Save.
- Saved stories render inline with a check + text + Edit.
- Require-tech-story off → no gate; completion proceeds normally.
UI/UX. Simple Flow Design

### Story 18: Core Parts — Resolution Across Simple Completion (pre-receive + receive-time) — SV-8353

Summary. Canonical spec for how core charges (deposit-style returnable-part charges) are resolved during Simple completion. For the optional vendor-invoice flow, the user decides Core OK / Core Not OK before the vendor part is received , so the customer invoice is accurate without forcing a receive first. Inventory cores and the mandatory-invoice flow are documented here too. No change to the core engine's OK / Not-OK outcomes — only when/where the decision is captured, plus a persisted decision on the un-received request. Stories 3/4/8/10/16 point here.
Context. Today a special-order/vendor core can only be resolved after it is received (WorkOrderPart created at receive, then Ok/Not-OK via handle-core ). That forces a receive before the invoice can be accurate. Inventory cores resolve at pick. Full tech plan attached to SV-8353 .
Requirements
Optional vendor invoice — resolve cores BEFORE receiving (NEW)
- C-R1 — Dedicated resolve screen. Right before the Complete without receiving / Receive parts choice, a separate consolidated screen lists every un-received vendor core (part info + core charge + OK / Not OK ), with a message that resolving now is for invoice accuracy .
- C-R2 — Decision persisted on the request. Saved on the core work_order_part_request ( core_resolution = ok | not_ok | NULL ) — no WorkOrderPart, statement item, or vendor return created at this point.
- C-R3 — Charge follows the decision immediately. Not OK → core charge priced into the WO total → customer invoice; OK → no charge (vendor core return created automatically at receive ).
- C-R4 — Gates use the decision. Completion and invoice creation are blocked only for undecided ( NULL ) cores; cores_pending reflects this.
- C-R5 — Auto-apply at receive. The saved decision is applied automatically at receive — the user is not asked again (Not OK → core created already resolved, no return; OK → existing Core-OK: resolve + vendor PartReturnRequest ).
Mandatory vendor invoice — receive-then-resolve (UI change only)
- C-R6 — Flow is unchanged in logic: As now we have ability to show the users resolve cores first we will ask them to resolve , and then to receive to be consistent with the optional flow as well.
Inventory cores — resolve at pick (both flows, unchanged)
- C-R7 — Resolved as soon as parts are auto-picked (or, auto-pick off, as soon as the user picks them), then resolved on the same step. Identical in both flows.
Receive-time quantity rule (invoice accuracy)
- C-R8 — When the WO is invoiced/paid , the receive dialog locks quantity to the full remaining amount (core auto-selected; tooltip "This part is on a customer invoice and should be received in full"). Before invoice, quantity stays editable to align with reality. FE-only lock — the invoice is a frozen snapshot, so a partial receive never changes the customer's charge (accepted WO-total-vs-invoice drift, same as main parts today).
Read models / status
- C-R9 — Lines tab shows the decision before and after receive: NULL → "Core decision pending"; ok → "Core OK — return to vendor, no charge"; not_ok → "Core Not OK — customer charged". No duplicate prompts; received pre-resolved cores show the resolved state with no OK/Not-OK buttons.
- C-R10 — Sync-back. Resolving a received core via the existing handle-core(s) endpoints also writes the value to the linked core PartRequest, so core_resolution stays the single source of history.
Out of scope. Backend mutation-locking of invoiced parts (delete/edit/move guards) — own ticket; backend full-quantity receive enforcement (lock is FE-only by decision); the PartRequest-reference fallback in secondary invoice readers ( StatementItemFetcher ) — degraded-not-broken; any change to the core engine's OK/Not-OK outcomes.
Acceptance Criteria
- User can pick OK / Not OK for an un-received vendor core on the resolve screen before the receive/complete choice (optional flow).
- Decision saved to work_order_part_request.core_resolution via pre-resolve-cores ; no WorkOrderPart/statement/return at save.
- Not OK adds the core charge to WO totals + the customer invoice; OK does not.
- Completion and invoice creation are blocked only for undecided ( NULL ) cores; cores_pending flips.
- At receive the saved decision auto-applies: OK → exactly one vendor return; Not OK → resolved core, no return; invoice never changes at receive; retries create no duplicates.
- Mandatory flow: resolve cores first, then receive (consistent with the optional flow; same pre-resolve mechanism).
- Inventory cores resolve at pick (auto-pick on or off) in both flows.
- Invoiced/paid WO: receive dialog locks quantity to full remaining (core auto-selected); before invoice quantity is editable.
- Lines tab shows the three states before and after receive; no duplicate prompts.
- Resolution cannot change after the WO has an active invoice.
Technical plan. Attached to SV-8353 : core_resolution column + CoreResolution enum + PartRequest domain methods; POST /api/work-orders/{id}/pre-resolve-cores (mirrors handle-cores ); UnresolvedCoreFetcher gate amendments; one match in WorkOrderPartsAndLinesHydrator::hydratePart() ; receive-time apply extracted from HandleCorePart (+ sync-back); read-model additions ( lines , receive-view ); FE resolve step + lines-tab display + receive-dialog FE lock.
UI/UX. Simple Flow Design

## Permissions — Enforcement Mapping (SV-8183)

Simple Flow needs no new permission atom — every action maps to an existing atom in the Custom Roles model (SV-7388). This section documents that mapping and resolves the permission open questions in §8. Source: SV-8183 .
Core rule — Simple-Flow action → gating atom

| Simple-Flow action | Story | Gated by (existing atom) |
|---|---|---|
| See/edit the WO Settings page | 1 | Settings › App Settings (settingsApp) — inherits the existing settings route guard; no new gating |
| Run completion — change WO status | 2/3/4/16 | Work Orders: Create & Edit |
| Approve all lines (hard gate to complete) | all | WO Lines: Create & Edit + Full View (Tech View hides Approve) → BE ROLE_WORK_ORDER::VIEW + CREATE_AND_EDIT |
| Enter mileage / VIN / engine hours in completion modal | 2/3/4 | WO Lines: Create & Edit |
| Tech story per line | 17 | WO Lines: Create & Edit |
| Resolve inventory / special-order cores (Ok / Not OK) | 3/4/16 | WO Lines: Create & Edit |
| Add a vendorless / no-part-number part (manual sell) | 5 | WO Lines: Create & Edit + See Financial Data (seeFinancialData) |
| Pick inventory parts in completion modal (auto-pick off) | 2/3/4 | Pick Parts (woPickParts) |
| Background order + create POs on completion | 3/4/6 | Order Parts (woOrderParts) → requires See Financial Data |
| Receive on the WO (line Receive button, completion "Receive parts") | 3/4/11/12 | FE: Order Parts. BE (ReceiveRequestedParts): OR of ROLE_DELIVERY_CREATE_AND_EDIT, ROLE_WORK_ORDER_PART_CREATE, ROLE_WORK_ORDER_CREATE_AND_EDIT |
| Bulk Receive page (accountant, PO-list driven) | 7/8/9 | Vendor & Order Mgmt: Create & Edit (hasPartsPermissions) + See Financial Data |
| Assign vendor to a vendor-missing PO / merge / keep-separate | 6/13 | Vendor & Order Mgmt: Create & Edit |
| Inline part-number fix → first-class inventory/catalog part | 10 | Catalog & Inventory: Create & Edit |
| Cost/sell fields on receive screens (field locking) | 8/10 | See Financial Data; sell auto-locks once WO invoiced/paid (state gate) |
| Mark Reviewed / sign-off; VIN captured by reviewer | 16 | Review Work Orders (woReviewWorkOrders) + reviewer ≠ completer (NET-NEW hard rule); VIN entry → WO Lines: Create & Edit |
| Waiting-on-Parts column (visibility) | 14 | Work Orders: View; click-through suppressed without the receive gate |
| Go to Invoice / Create Invoice | 2/3/4 | Invoicing & Payments: Create & Edit + See Financial Data |

Key consequences
- Completion follows WO edit + line approval (Full View); receiving-on-a-WO follows Order Parts; the accountant Bulk Receive page follows Vendor & Order Mgmt.
- BE atom collapse: woOrderParts , workOrderLinesCreateAndEdit , woFullViewMode , woTechViewMode , workOrdersCreateAndEdit all resolve to ROLE_WORK_ORDER::VIEW + CREATE_AND_EDIT server-side — so any role with WO Create & Edit can receive onto a WO (a deliberate low-privilege trade-off, SV-7864). FE distinctions are conveniences, not BE-enforceable boundaries.
- NET-NEW hard rule: reviewer ≠ completer — stamp sentToReviewBy / completedBy and block Mark Reviewed for that user. This is not an atom and must be built.
Per-role behavior (from the system-role matrix)

| Role | Edit WO settings | Complete WO | Pick | Order/PO | Receive on WO | Bulk Receive | Assign vendor | Fix part # | Add vendorless part | Mark Reviewed |
|---|---|---|---|---|---|---|---|---|---|---|
| Admin | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Service Manager | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Senior SA | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Service Advisor | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Foreman | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Technician | No | No (1) | Yes | No | No | No | No | No | No | No (2) |
| Parts Manager | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Parts Tech | No | No (1) | Yes | Yes | Yes | Yes | Yes | Yes | No | No |
| Office | Yes | No (3) | No | No | No | No (4) | No | No | No | No |
| Sales Rep | No | No | No | No | No | No | No | No | No | No |
| Time Clock | No | No | No | No | No | No | No | No | No | No |

(1) No completion = Tech View can’t approve lines and/or no WO Create & Edit; Technician can still pick, Parts Tech is a receiver not a completer. (2) Technician has WOL Create & Edit but no See Financial Data → cannot enter the mandatory sell price → cannot add a vendorless part. (3) Office has WO View only → configures Simple Flow but cannot operate it. (4) Office has Vendor & Order Mgmt View only → can open Bulk Receive but cannot receive.
Custom roles combine these atoms freely (e.g. grant a Technician Order Parts + Vendor & Order Mgmt: C&E for a "tech who also receives").
Resolves the §8 open questions on completion / bulk-receive / settings / review roles, cost at completion, and BE enforcement. Inline role-wording cleanup across §4/§7/§8 (SV-8183 AC #11) is deferred and tracked on SV-8183.

## 8. Open Questions

- Core parts (resolved — now a dedicated story, Story 18 / SV-8353 ). Inventory cores resolve in the completion modal (after Pick); special-order cores — pre-resolved before receiving in both flows (required and optional): decision persisted on work_order_part_request.core_resolution , charge follows immediately, auto-applied at receive. Completion/invoice gated only on undecided cores; no core-engine change . Receive-time quantity is locked to full remaining once the WO is invoiced/paid (FE-only). Remaining guardrail: remove the POC complete-simple force-resolve ( changeCoreResolved(true) ).
- Part Sales — confirmed (Jul 14). Adding a part on a Part Sale already creates a PO that appears in the PO list and is received via the same PO/receive pipeline as work orders. So part-sale POs are in scope for PO multi-select + Bulk Receive (Stories 7/8) and Accept Delivery. Remaining check: verify part-sale POs behave in Bulk Receive + Waiting-on-Parts, and that the new order/status logic does not regress part-sale status transitions.
- Require-review default — on for bigger/existing shops? + new-org preset (existing orgs keep today's behaviour via backfill).
- Role-gating review (manager/foreman) — custom roles vs open for v1.
- Cost at completion — allow entering cost at completion to avoid $0-cost margins?
- Auto-receive of in-stock inventory parts on simple completion — confirm intended.
- BE enforcement of the Simple-Flow settings — should BE enforce them?
- Permissions — which roles do completion vs bulk receive vs settings vs review.

## 9. Change Log

| Date | Reporter | Change |
|---|---|---|
| 2026-07-03 | @Milos Vasic | Mixed line approval added to Stories 3/4/16 (auto-approve off → only approved lines complete; unapproved stay open, non-blocking). Core parts marked deferred (placeholder) pending a designed solution. |
| 2026-07-06 | @Milos Vasic | Core-parts resolution folded in across Stories 3/4/8/10/16 — inventory cores gated in the completion modal (after Pick); special-order cores at receive (required) or the Create Invoice gate (optional, receive-then-resolve). No core-engine change. §8 core question marked resolved. |
| 2026-07-06 | @Milos Vasic | Line approval changed to "all lines must be approved to complete" (replaces mixed/partial completion) on Stories 3/4/16 + §4. With auto-approve ON, a manually-unapproved line blocks completion via the existing "you need to approve the line to complete the work order" error (CTA stays active; no new disabled state). |
| 2026-07-08 | @Milos Vasic | Sell price mandatory at save (Story 5); sell-price-only parts orderable from the line → waiting-to-receive (Story 6, S6-R7); order-before-receive so the receive screen is never empty (Stories 3/4); editable cost on the single / Accept-Delivery receive (parity with Bulk Receive — Stories 10/12). Added Part Sales impact investigation to §8. |
| 2026-07-14 | @Milos Vasic | Review-setting auto-complete behavior clarified (Story 16, R12/R13, from Dipesh's findings): when a WO's last open line resolves — via single/bulk complete, split, or delete-line — review OFF auto-Completes the WO (invoice-ready), review ON routes to Ready for Review. Clock-out that finishes the last line stays routed to Ready for Review even when OFF (intentional exception — a technician may not be allowed to complete a WO). |
| 2026-07-15 | @Milos Vasic | Jul 14 SU follow-ups: vendorless group surfaced when receiving a single WO part (Story 12, S12-R6); return to the originating WO line after the receive round-trip (Story 11, S11-R4); Part Sales POs confirmed in scope for PO list + Bulk Receive (Stories 7/8, §8). |
| 2026-07-15 | @Milos Vasic | Core parts consolidated into a dedicated story (Story 18 / SV-8353) with Dipesh's pre-receive plan: the optional flow now resolves special-order cores BEFORE receiving (decision persisted on work_order_part_request.core_resolution, charge follows immediately, auto-applied at receive) instead of at the Create Invoice gate; receive-time quantity locked to full remaining once invoiced/paid (FE-only). Per-story core sections (Stories 3/4/8/10/16) + §4/§8 slimmed to point at Story 18. |
| 2026-07-16 | @Milos Vasic | Core resolution unified to resolve-before-receive for special-order parts in BOTH flows (mandatory now matches optional — Story 18 C-R6; Stories 4/16, §4/§8). Apply button removed from Bulk Invoice (Story 9 — invoice number is typed & remembered, no button). Vendor + part number stay changeable until receive on Assign Vendor (Story 13, S13-R8; from SV-8343). |
| 2026-07-16 | @Milos Vasic | S6-R6 (reports) corrected to match code: no dedicated PO report or "needs vendor" marker exists; a vendor-missing PO is simply excluded from the QuickBooks Vendor Bill export and the Vendors Expenses report until a vendor is assigned (verified in VendorBillExportQueryHandler / VendorsExpensesQueryHandler). SV-7701 updated to match. |
