<!--
PROVENANCE
Source file : 991acdb4-SimpleMode_StreamlinedWorkOrderCompletionBulkReceiving.doc
Upload dir  : /root/.claude/uploads/dd1d42ba-2c47-5229-9b17-b8f94e3eb99a/
Format      : Confluence "Save as .doc" = MHTML (multipart/related, one text/html part, quoted-printable)
Parsed via  : Python email (MIME) -> html.parser -> markdown (tables preserved)
Parsed on   : 2026-07-09
Doc version : "Draft for build - V2.4"  (Epic SV-7301, Owner @Milos Vasic)
Status line : Draft for build - V2.4 (line approval = all must be approved; sell-price mandatory
              at save + orderable-from-line; editable cost on Accept-Delivery; core resolution in
              Stories 3/4/8/10/16; in sync with Jira SV-7696...SV-7710 + SV-7870 + SV-7876)
Change log  : last entry 2026-07-08 @Milos Vasic (IDENTICAL to prior spec-current-source.md)

VERSION VERDICT (see spec-epic-diff-latest.md):
  This upload is *the SAME V2.4* as build/simple-flow/spec-current-source.md.
  Same version string, same §9 Change Log (last row 2026-07-08). A normalized
  text diff shows only (a) HTML-parse/whitespace/bold-marker artifacts and
  (b) a handful of MINOR clarifying phrases in Story 3 (see diff doc). It is NOT
  a newer spec revision. The genuinely NEW input in this batch is the EPIC
  "What's Been Built" content (epic-content.md) which reports built status.

Note        : Bold/space artifacts from the HTML parse are cosmetic; content is
              verbatim-in-substance. Authoritative extract for authoring remains
              requirements.md (owned/edited by another worker right now).
-->




    Simple Mode — Streamlined Work Order Completion & Bulk Receiving






# Simple Mode — Streamlined Work Order Completion & Bulk Receiving




****


****


****


****


|  |  |
|---|---|
| Epic | SV-7301 |
| Owner | @Milos Vasic |
| Design | Simple Flow Design (Claude Design) · QA env — sv7301 (POC) |
| Status | Draft for build — V2.4 (line approval = all must be approved; sell-price mandatory at save + orderable-from-line; editable cost on Accept-Delivery; core resolution in Stories 3/4/8/10/16; in sync with Jira SV-7696…SV-7710 + SV-7870 + SV-7876) |


# Simple Mode — Product Specification


## 1. Business Case


Completing a work order in ShopView is slow and click-heavy — up to 18+ clicks from work order to invoice. For shops doing 20–50 WOs/day that's hours of friction, and it's the top friction point across the customer base. Single-operator and mobile shops don't need the PO/receiving ceremony but are forced through it. Parts added without vendor info get stuck. Accountants receive vendor invoices one PO at a time. The work-order list gives no receiving visibility. Missing cost at completion produces wrong QuickBooks margins.


**Simple Mode** cuts completion to 2–3 clicks, configurable per org, **without sacrificing QuickBooks or inventory integrity**. It is **not a separate mode or app** — it makes specific existing steps **optional** plus a set of pure **additions**. At default settings the app behaves exactly as today.


**What we KEEP (not removed):** individual-line **Complete**; all existing **per-part / per-line receive actions + "received" statuses**; a **Receive button at the WO line level**; the only receiving change is that a WO's POs are **bundled onto the same shared Accept Delivery / receive page** (every receive entry point → that surface; receive all vendors at once).


**Guiding principles:** (1) Consistency over novelty. (2) Data integrity non-negotiable (§5). (3) Settings drive behavior; QA tests the matrix.


## 2. Feature Overview (at a glance)


  -


**Settings** — one Work Order settings page (no Full/Simple mode): Auto-approve lines, Create POs (+ Vendor invoice Optional/Required), Require review; plus existing Require tech story / mileage / engine hours / Auto-pick inventory. First-use defaults preserve today's behavior.

  -


**Completion** — one **Complete Work Order** button; three settings-driven flows (No-PO / PO+Optional / PO+Required) + a review-on variant; centralized required-fields modal; success screen.

  -


**Vendorless / no-part-number parts** — add with description + qty + sell only; on completion they sit on the **WO's PO flagged "Vendor Missing"** (no dummy PO).

  -


**Bulk Receive** — new page to receive many POs grouped by vendor; per-vendor apply-invoice / expand / receive-all.

  -


**Vendor-aware receiving** — Receive button on WO-originated POs; the existing multi-vendor Accept Delivery screen; assign vendor + merge.

  -


**Visibility** — Waiting-on-Parts column; Ready-for-Review queue.


(Full requirements + acceptance criteria per story in §7.)


## 3. Jobs to be Done


  -


Shop without POs → complete in one confirm. · Require vendor invoices → blocked until received. · Tech hands a part with no number/vendor → still add it. · Accountant with many POs from one vendor → receive on one page, one invoice number. · PO with several vendors → receive each on the same screen. · Foreman → review a completed WO before invoicing. · Scanning the WO list → see what's waiting on parts or review.


## 4. Key Decisions


  -


**No operating-mode selector**; behavior driven by individual settings (operatingMode dropped). **No "VIN required" setting.**

  -


**First-use defaults** preserve today's behavior: auto-approve OFF, create POs ON, vendor invoice REQUIRED.

  -


**KEEP:** individual-line Complete; existing per-part receive actions/statuses; a **line-level Receive button**; only change = the WO's POs are **bundled onto the same shared receive page**.

  -


**Line approval — all lines must be approved to complete.** A WO cannot complete (or Send to Review) unless **every line is approved**. Holds regardless of Auto-approve: OFF → manual approval; ON → approved on add, but a manually unapproved line must be re-approved. An unapproved line surfaces the existing "you need to approve the line to complete the work order" error on Complete (no new disabled state). Applies across the optional/required-invoice flows and the review-on variant.

  -


**No "dummy PO."** A vendorless vendor part goes on the **WO's normal PO**, flagged **"Vendor Missing"**; **unflag once both a vendor and a part number are provided** → eligible for QuickBooks.

  -


**Sell price is the only mandatory financial field to add a part** (enforced at save; cost is never mandatory — edited later on the PO/receive). A **sell-price-only part** (missing vendor and/or cost) is **orderable from the line** — the Order action creates the Vendor-Missing PO and moves it to **waiting-to-receive**, so it never sits stuck in "requested" with nothing to receive.

  -


**Create POs OFF ⇒ no PO at all** — received at request, no catalog/inventory sync; type by source field.

  -


**Tech story is its own flow (Story 17).**

  -


**Review (Story 16) = two-state gate** (Review → Reviewed → Complete); CTA "Send to Review"; **VIN captured by the reviewer**; invoicing blocked until reviewed.

  -


**Auto-pick inventory** off → pick in the completion modal.

  -


**Vendor invoice: optional to *****complete***** (Story 3 setting), but required to *****receive*** on any receive surface (Bulk Receive / Accept Delivery), along with vendor + part number for vendor-missing / no-PN.

  -


**Field locking (receive screens):** quantity editable; cost editable (pulled from WO/PO); **sell editable until the WO is invoiced/paid, then locked** with a lock icon + tooltip; after lock only cost is editable.

  -


**Part number + vendor mandatory to receive.**

  -


**Accept Delivery is already multi-vendor (reused, not rebuilt);** invoice mandatory there. **Required-invoice completion routes "Receive Parts" to the shared receive page** and round-trips back to the completion modal.

  -


**Editing a part number → first-class inventory/catalog part.**

  -


One vendor bill per vendor per receive; merge → one bill, keep-separate → two; invoice-# uniqueness relaxed.

  -


Success screen = WO# + total; invoice number on the Finance step.

  -


Close-confirm modal: **Close** = close only; **Cancel** = close + return to previous screen.

  -


**Core parts.** Resolution gates the *money*, not completion: inventory cores resolved in the completion modal (after Pick); special-order cores at receive (required) or the Create Invoice gate (optional, receive-then-resolve). No core-engine change; enforced by placement + an invoice-time unresolved-core check. See Stories 3/4/8/10/16.


## 5. Cross-System & Data Integrity (QuickBooks + Inventory)


**Two QB flows:** Vendor Bill → QBO (on receive; PO-dependent) · Journal Entry/Inventory → QBO (on invoice creation; not PO-dependent).


**Invariants:** (1) **In-stock parts decrement inventory on completion** — the Simple "skip" path's bare status setter emits no events and bypasses inventory movement / Part History / catalog creation / Delivery / Vendor Bill, so completion must still run the real lifecycle (or route via the WO PO + real receive). (2) **POs ON + receiving → full pipeline** receive → Delivery → Vendor Bill → QBO; both receive surfaces sync the vendor bill (Accept Delivery explicitly; receiveRequestedParts via the SpecialPartsGetsReceived subscriber); only complete-simple bypasses everything. (3) **Inventory Part History preserved** for any part that becomes inventory-tracked.


**Accepted by design:** Create POs OFF ⇒ no PO/vendor bill/AP sync + no catalog/inventory sync. Vendorless/no-PN ⇒ zero inventory interaction until a vendor and/or part number is added. Vendor-missing POs flagged + excluded from QB until vendor + part number provided.


**Build-risk callouts (Story 10):** the receive pipeline assumes a valid **vendor**; several payload fields are required; a default part category must exist; a CataloguePart alone is **not** inventory stock.


## 6. Terminology


  -


**Simple Mode** — the feature name (a.k.a. Express Mode). Not an operating mode/toggle.

  -


**Vendorless part** — no vendor and possibly no part number; source vendor/found.

  -


**Vendor Missing** — flag on a PO that holds a part with no vendor; excluded from QuickBooks until vendor + part number are provided. *(No separate "dummy PO".)*

  -


**Waiting on Parts** — count of part requests still waiting-to-receive.

  -


**Review / Reviewed** — WO states between Approved and Complete when review is on (Story 16).

  -


**Core part** — a returnable part carrying a deposit-style charge; resolved as returned (no charge) or kept (charge added). Applies to inventory (charge derived from the catalog record) and special-order/vendor parts (charge entered manually); never to "found" parts.


## 7. Requirements


### Story 1: Work Order Settings (Simple Flow) — SV-7696


**Summary.** One Work Order settings page where an owner/admin turns the Simple-Flow options on/off. **There is no "operating mode" (Full/Simple) selector** — behavior is driven by the individual settings. The page shows the **new** Simple-Flow toggles together with the **existing** work-order settings.


**Context.** Settings → Work Order settings; org-wide; owner/admin only. **Drop the POC's** operatingMode field — do not build a Full/Simple selector.


**Requirements — settings in the order shown on the page**
*New (introduced by this feature):*


  -


**S1-R1 — Auto-approve lines.** On → every line is approved the moment it's added (no approval step). Off → manual approval, as today. *Must actually drive approval.* Default **OFF**. *Interaction: completion requires **all lines approved** — with auto-approve ON, manually unapproving a line blocks completion (via the existing "approve the line to complete the work order" error) until re-approved. See Stories 3/4/16.*

  -


**
S1-R2 — Create purchase orders.**
On → vendor parts generate POs + the receiving step (today's behavior). Off → no POs created for vendor parts. Default**
ON**
.

  -


**S1-R3 — Vendor invoice number** (shown only when Create POs is on). **Required** → the WO can't be completed until parts are received and the invoice number captured. **Optional** → complete now, and receive parts later , when the WO is completed. Default **REQUIRED**.

  -


**S1-R4 — Require review before completion.** On → completing sends the WO to a separate review/sign-off before it can be invoiced (Story 16). Off → no review step. Default per cohort (see §8).


*Existing (already in the app — surfaced here, reflecting current values; not changed by this feature):*


  -


**S1-R5 — Require tech story.** Drives the Tech Story flow (Story 17).

  -


**S1-R6 — Require mileage.**

  -


**S1-R7 — Require engine hours.**

  -


**S1-R8 — Automatically pick inventory parts.** Off → in-stock parts must be picked in the completion modal before completing (Stories 3/4).

  -


**S1-R9 — Save settings.** Persists all of the above org-wide, to **future completions only** (never retroactively).


**Defaults on first use (preserve today's behavior):** Auto-approve **OFF**, Create POs **ON**, Vendor invoice **REQUIRED**; the existing settings keep whatever the org already has.


**Out of scope / removed.** No operating-mode selector (operatingMode dropped). No "VIN required" setting (VIN is handled by the existing required-fields behavior at completion).


**Acceptance Criteria**


  - Settings shown in the order above; new vs existing visually distinct; no operating-mode selector anywhere.

  - Create POs on → Vendor invoice (Optional/Required) appears with helper text; off → hidden + no vendor-invoice capture in completion.

  - Auto-approve on → a line is approved immediately on add; off → manual approval as today.

  - Existing settings (tech story / mileage / hours / auto-pick) display + persist the org's current values.

  - First-time defaults: auto-approve OFF, create POs ON, vendor invoice REQUIRED; existing settings unchanged.

  - Save persists org-wide; future completions only; non-admin can't see/modify.

  - No requireVin setting and no operatingMode field in the implementation.


**UI/UX.** Simple Flow Design — Settings · QA — Work Order Settings


###
Story 2: Simple Completion — No-PO (Skip) Flow —
SV-7697


**
Summary.**
In a shop with PO creation off, complete a work order in a single confirm and go straight to an invoice-ready draft.*
(Review-OFF path; when Require review is on, see Story 16.)*


**
Context.**
Create POs off; WO has approved lines; user has WO edit access.


**
What we KEEP.**
Individual-line Complete; all existing per-part receive actions + "received" statuses.


**Requirements**


  -


**
S2-R1**
— A**
Complete Work Order**
button next to New Line.

  -


**
S2-R2**
— Clicking it opens a centralized modal collecting the existing required fields (**
mileage / engine hours / VIN**
per existing rules). Tech story is gated via the Tech Story flow (Story 17), not collected here. Auto-pick-off → pick inventory parts here.

  -


**
S2-R3**
— On confirm: no PO/receive/invoice step; all lines → Completed; Reviewed runs in the background.

  -


**
S2-R4**
— Success screen (WO# + total; Done / Go to Invoice).

  -


**
S2-R5**
— Go to Invoice → Finance step (invoice number shown there).

  -


**
S2-R6**
— No PO / vendor bill / AP sync. A vendor/found part is received at request time,**
not synced to catalog/inventory**
. In-stock parts still decrement inventory.


**Acceptance Criteria**


  -
One-confirm completion → success screen; lines → Completed; Reviewed in background.

  -
Missing required fields (or tech story via Story 17) → blocked.

  -
POs off → no PO/bill/AP-sync + no catalog/inventory sync; in-stock parts decrement inventory + Part History.

  -
Auto-pick off → must pick before Complete.

  -
Individual-line Complete + per-part receive actions still work.

  -
Re-open (uncomplete a line / add a line) → WO returns to Approved; modal summarises already-received vs newly-added.


**
UI/UX.**

Simple Flow Design — completion flow
·
QA — Work Order


### Story 3: Simple Completion — PO On + Optional Vendor Invoice — SV-7698


**Summary.** For shops that create POs but don't require invoices upfront: complete the work order from one place — order/create POs in the background, pick parts, then either **receive now (all vendors at once)** or **finish and receive later**. *(Review-OFF path; review on → Story 16.)*


**Context.** Create POs on; Vendor invoice = Optional; user has WO edit access.


**What we KEEP.** Individual-line Complete + per-part receive actions + "received" statuses; a **Receive button at the WO line level**; the WO's POs are bundled onto the same shared receive page.


We are going to cover all scenarios here , with the Tech story ON/Off, Mileage ON/Off, Engine hours ON/Off, Automatically pick inventory parts ON/Off


**Requirements (in flow order)**


  -


**S3-R1 — Background order + POs.** On Complete, if parts aren't already ordered/received, **actually order all approved-line parts** and create the POs in the background (a vendorless / sell-price-only part is placed on the WO's PO, flagged **Vendor Missing** — Story 6, flagged them from QB integration ). Parts must reach **waiting-to-receive** so "Receive parts" always has something to receive — a part left in **requested** must never be routed to an empty receive screen.

  -


**S3-R2 — Parts + pick status.** An informational modal shows the **count of parts to receive** and the **inventory-pick status** (to-pick / picked). Auto-pick-off → pick inventory parts here.

  -


**S3-R3 — Required vehicle fields (separate step).** Collect **mileage + VIN ( in case Review toggle is off, in case its ON Vin will be asked on the place when Reviewer click review) + engine hours** (when missing). **Tech story is NOT here ( **keeping mostly current behaviour **) ** — its own flow (Story 17) when required.

  -


**S3-R4 — Actions.** **Receive parts**, **Complete without receiving**, **Cancel**.

  -


**S3-R5 — Receive parts.** Routes to the **shared Accept Delivery page** (not an inline popup as now ) where they **receive all the parts for all vendors on the WO at once**.

  -


**S3-R6 — Complete without receiving.** Completes the WO; unreceived parts **stay waiting-to-receive** (Waiting on Parts column). The WO **line still shows a Receive button** so the user can access this later

  -


**S3-R7 — Cancel.** No change; closes the modal.

  -


**S3-R8 — Success screen.** WO# + total; Go to Invoice / Done (invoice number on the Finance step).

  -


**S3-R9 — All lines must be approved to complete.** The work order **cannot be completed until every line is approved** (replaces the earlier partial/mixed-approval behavior). Holds regardless of the Auto-approve lines setting: OFF → lines approved manually; ON → approved on add, but a **manually unapproved (unauthorized)** line must be re-approved **manually** . If any line is unapproved when the user clicks **Complete**, the Simple modal **reuses the system's existing "you need to approve the line to complete the work order" error** and does not complete the WO — the CTA stays active (no new disabled state). Completion proceeds once all lines are approved. *(Individual-line Complete unaffected.)*

**Core parts.** Core resolution (existing **Ok = Return → no charge** / **Not OK = Keep → charge added**) is folded into this flow. **No change to the core engine** (the handle-core call, return entries, invoice charge) — only *where* resolution happens.


    -


**S3-C1 — Inventory cores: gated in the completion modal.** After the Pick step (Pick all / Review individually), the **next step resolves inventory cores** — lists only those parts (line, part number, amount, **Ok / Not OK**). Cannot continue until all resolved. Skipped if none.

    -


**S3-C2 — Special-order cores: completion unchanged.** The part isn't received yet, so there's nothing to resolve at completion — **Complete without receiving** stays available → success → Go to Invoice.

    -


**S3-C3 — "Cores pending" on the invoice.** The invoice shows a flag/indicator when the WO has unresolved special-order cores.

    -


**S3-C4 — Resolve at the Create Invoice gate.** Clicking **Create Invoice** with unresolved cores opens the resolve module: it **first routes to receive the cored line(s)** (core-only partial receive), then resolves **Ok / Not OK**; once all resolved, Create Invoice proceeds. **No dead-end** — cancelling leaves the WO completed, un-invoiced, cores-pending.


**Acceptance Criteria**


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


**Acceptance Criteria (core)**


  - Inventory core → after Pick, a Resolve-cores step lists only inventory cores; can't continue until resolved; skipped if none.

  - Special-order core → Complete without receiving succeeds; invoice shows "cores pending".

  - Create Invoice with an unresolved special-order core → resolve module opens → receive the cored line → resolve Ok/Not OK → invoice proceeds.

  - Cancel at the invoice gate → WO stays completed + un-invoiced + cores-pending; re-entry works.

  - Not OK adds the core charge; OK adds none — via the existing handle-core path (engine unchanged).


**Guardrail.** The invoice gate must detect an unresolved special-order core even when it exists only as a PartRequest (no WorkOrderPart yet). Part-sale WOs auto-resolve at receive; **service WOs need manual Ok/Not OK**.


**UI/UX.** Simple Flow Design — completion flow · QA — Work Order


### Story 4: Simple Completion — PO On + Required Vendor Invoice — SV-7699


**Summary.** For shops that require vendor invoices: same one-place completion as Story 3, but the work order **cannot be completed until all parts are received** (invoice number captured). *(Review-OFF path; review on → Story 16.)*


**Context.** Create POs on; Vendor invoice = Required; user has WO edit access.


**What we KEEP.** Same as Story 3 (individual-line Complete + per-part receive + line-level Receive button + bundle to shared receive page).


**Requirements (in flow order — same as Story 3, with the required-invoice gate)**


  -


**S4-R1 — Background order + POs** (vendorless on the WO's PO, flagged Vendor Missing — Story 6). A **sell-price-only part (missing vendor and/or cost) is ordered too** → waiting-to-receive (Story 6, S6-R7); parts must not remain in "requested" with nothing to receive.

  -


**S4-R2 — Parts + pick status** in the modal (auto-pick-off → pick here).

  -


**S4-R3 — Required vehicle fields** (mileage + VIN + engine hours); tech story separate (Story 17).

  -


**S4-R4 — Actions + gated CTA.** **Receive parts** + **Cancel**. The primary CTA is **"Complete Work Order"**, **disabled until all parts are received**. **No "Complete without receiving"** in this flow.

  -


**S4-R5 — Receive parts (round-trip).** Routes to the **shared Accept Delivery page** (receive all vendors at once; qty, tax, date, note, invoice # per vendor). When receiving finishes — **or** the user clicks **"Back to Work Order"** on the Accept Delivery page — they **return to this modal**; once everything is received, **Complete Work Order** enables.

  -


**S4-R6 — Cancel.** No change.

  -


**S4-R7 — Complete Work Order** (enabled once all received) → success screen (WO# + total; Done / Go to Invoice).

  -


**S4-R8 — All lines must be approved to complete.** The work order **cannot be completed until every line is approved** (replaces partial/mixed-approval). Holds regardless of Auto-approve: OFF → manual approval; ON → approved on add, but a **manually unapproved** line must be re-approved. Any unapproved line when the user clicks **Complete Work Order** → the modal **reuses the existing "you need to approve the line to complete the work order" error**; the CTA stays active. Proceeds once all lines are approved. *(Separate from the required-invoice receive gate in S4-R4/R5.)*


**Acceptance Criteria**


  - Background POs on Complete (vendorless on the WO's PO, flagged Vendor Missing).

  - Modal shows parts-to-receive count + pick status; required fields collected; tech story via Story 17.

  - Primary CTA reads **"Complete Work Order"**, disabled until all parts received.

  - Receive parts → shared Accept Delivery page (all vendors at once); finishing or "Back to Work Order" returns to the modal; CTA enables when all received.

  - No "Complete without receiving" in this flow.

  - Cancel → no change; completion → success screen (WO# + total).

  - Any unapproved line (never approved, or manually unapproved when auto-approve is ON) → clicking Complete Work Order shows the existing "you need to approve the line to complete the work order" error; the WO does not complete.

  - Approving all lines → completion proceeds (subject to the required-invoice receive gate).


**Core parts.** Core resolution (existing **Ok = Return → no charge** / **Not OK = Keep → charge added**) is folded in. **No change to the core engine** — only *where* resolution happens.


  -


**S4-C1 — Inventory cores: gated in the completion modal.** After the Pick step, the **next step resolves inventory cores** (line, part number, amount, **Ok / Not OK**); cannot continue until resolved; skipped if none.

  -


**S4-C2 — Special-order cores: resolved after the Receive round-trip.** Classical path unchanged — complete → pick → **Receive parts** → after receiving, return to the modal (not straight to success). If special-order cores exist, a **gated Resolve-cores modal** shows only those parts. Resolve → **Complete Work Order** → success. (Invoice is required, so the part is always received here and the core is always resolvable.)


**Acceptance Criteria (core)**


  - Inventory core → Resolve-cores step after Pick; can't continue until resolved.

  - Special-order core → after the Receive round-trip, a gated Resolve-cores modal lists only those parts; resolve → Complete → success.

  - Not OK adds the core charge; OK adds none — existing handle-core path (engine unchanged).

  - No cores → no core step.


**UI/UX.** Simple Flow Design — completion flow · QA — Work Order


### Story 5: Add a Vendorless / No-Part-Number Part — SV-7700


**Summary.** Let an advisor add a part with only description, quantity, and sell price — to capture real-world parts that have no number or vendor yet.


**Context.** WO line in an editable state; user has WO edit access.


**Requirements**


  -


**S5-R1** — A part can be requested with **description, quantity, and sell price mandatory**; part number, cost, and vendor optional/empty. **Sell price is validated at save** — the part cannot be saved/closed without it (inline error), not deferred to completion.

  -


**S5-R2** — The part's type is the existing **source field —** vendor or found (never inventory); treated as vendorless downstream.

  -


**S5-R3** — The part is editable after creation.

  -


**S5-R4** — With no part number, the part has **zero inventory interaction** until a part number is added (Story 10). A **part number is required at receive**.


**Acceptance Criteria**


  - A part added with description + quantity + sell price only saves as a vendorless part (source vendor/found).

  - Missing description, quantity, or sell price → saving is **blocked inline at save** (not deferred to completion).

  - A no-part-number part creates no inventory item / Part History.

  - Adding a part number/vendor later transitions it out of vendorless handling.

  - The part cannot be received until a part number (and vendor) is entered at receive.


**UI/UX.** Simple Flow Design · QA — Work Order Lines


### Story 6: Vendorless Part on the WO PO — "Vendor Missing" + QB Flag — SV-7701


**Summary.** When a vendor / special-order part on a work order has **no vendor**, it goes onto the **work order's normal purchase order** like any other special-order part — but that PO is flagged **"Vendor Missing"** and kept **out of QuickBooks** until a vendor **and** a part number are provided. **There is no separate "dummy" PO.**


**Context.** Create POs on; the WO has a vendorless vendor part at completion. (Create POs off → no PO at all — Story 2.) PO creation + grouping is existing behavior; this story adds the **indication**, the **QB flag/exclude**, and the **unflag condition**. Assign-vendor / merge UI = Story 13; part-number entry UI = Story 10.


**Requirements**


  -


**S6-R1 — No dummy PO.** Vendorless vendor part(s) are placed on the **work order's PO** — the same PO that holds the WO's other special-order parts (grouping onto one PO is existing behavior).

  -


**S6-R2 — Indication.** A PO holding a vendor-missing part shows a **"Vendor Missing"** indication in the PO list + detail, with a **"+N"** count when the PO holds multiple vendors.

  -


**S6-R3 — QuickBooks flag.** A vendor-missing PO is **flagged and excluded from QuickBooks sync**.

  -


**S6-R4 — Options to resolve.** On the PO the user is offered the option to **select a vendor** (Story 13) and to **enter/edit the part number** (Story 10).

  -


**S6-R5 — Unflag condition.** Once **both** a vendor **and** a part number are provided, the PO is **unflagged** → eligible for QuickBooks.

  -


**S6-R6 — Reports.** Reports mark vendor-missing POs as **"needs vendor."**

  -


**S6-R7 — Orderable from the line (sell-price-only parts).** A part with a **sell price** but **no cost and/or no vendor** can be **ordered from the line's Order action** — creating/joining the WO's Vendor-Missing PO and moving it from **requested → waiting-to-receive** (same order path as the completion flow, not completion-only). At receive, vendor + part number are still required (cost editable — Story 10).


**Out of scope.** The assign-vendor / merge UI (Story 13) and the part-number edit UI (Story 10) themselves; the POs-off path (Story 2).


**Acceptance Criteria**


  - Vendorless vendor part at completion → placed on the WO's PO (not a separate dummy PO); other special-order parts share that PO.

  - PO shows "Vendor Missing" (+N for multiple vendors) in list + detail.

  - Vendor-missing PO flagged + excluded from QuickBooks sync.

  - User can select a vendor and enter the part number on the vendor-missing PO.

  - Providing both vendor + part number unflags the PO → eligible for QB.

  - Reports mark vendor-missing POs.

  - Given a sell-price-only part (no vendor/cost), clicking **Order** on the line creates/joins the Vendor-Missing PO and moves it to waiting-to-receive — without completing the WO.


**UI/UX.** Simple Flow Design · QA — Purchase Orders


### Story 7: PO Multi-Select + "Receive Selected" — SV-7702


**Summary.** Add the multi-select affordance on the Purchase Orders **list** so an accountant can pick several POs and open them in the Bulk Receive page together.


**Context.** Parts → Purchase Orders, with receiving access. This is the **entry point** only; the destination page is Story 8.


**Requirements**


  -


**S7-R1** — A **select-all** checkbox + **per-PO** checkboxes on the PO list.

  -


**S7-R2** — When any PO is selected, a bar shows **"N purchase orders selected"**, **Clear**, and **Receive Selected**.

  -


**S7-R3** — **Receive Selected** opens the **PO Bulk Receive page** (Story 8) with the selected POs.

  -


**S7-R4** — **Fulfilled (already-received) POs are not selectable.**

  -


**S7-R5** — **Vendor-missing POs are selectable and clearly indicated.**


**Acceptance Criteria**


  - Selecting POs → bar with count + Clear + Receive Selected.

  - Receive Selected opens Bulk Receive with exactly the selected POs.

  - Fulfilled POs not selectable; vendor-missing selectable + indicated.

  - Select-all toggles only the POs on the current page/filter.


**UI/UX.** Simple Flow Design · QA — Purchase Orders


### Story 8: PO Bulk Receive Page — SV-7703


**Summary.** A single page to receive many purchase orders at once, grouped by vendor — reached from the PO list via **Receive Selected** (Story 7). Behaves consistently with the single/multi-PO receive screen. New page (QA has the POC prototype; this builds it for real).


**Context.** Reached via Receive Selected; user has receiving access.


**Requirements**


  -


**S8-R1 — Entry + Back.** A **"Back to Purchase Orders" button** in the **top-left** returns to the PO list.

  -


**S8-R2 — Grouped vendor → POs**, with a **vendor count**.

  -


**S8-R3 — Collapsible POs + per-vendor Expand all / Collapse all** (each vendor has its own control; clearly indicated) — not one global control.

  -


**S8-R4 — PO row:** PO number, related **work order** (or an **inventory / no-WO** indicator), parts count.

  -


**S8-R5 — Selection (nothing selected by default).** Selecting a PO selects all its parts; individual parts also selectable; actions locked until checked.

  -


**S8-R6 — Receive parts (N).** Per-PO button (N = parts to receive); **disabled until the vendor invoice number is entered** (and, for vendor-missing, until a vendor is assigned + any missing part number entered).

  -


**S8-R7 — Editable fields + locking.** **Quantity editable**; **cost editable** (pulled from WO/PO); **sell editable until the WO is invoiced/paid, then locked** with a **lock icon + tooltip "Locked — this part is already invoiced or paid"**; after lock, only cost editable.

  -


**S8-R8 — Vendor-missing POs.** Assign a vendor here → the PO **moves into that vendor's group**; enter the missing part number → unflag → receiving enabled.

  -


**S8-R9 — Apply invoice to selected POs** under a vendor (Story 9).

  -


**S8-R10 — Receive all** — receive everything selected at once; partial receive supported.

  -


**S8-R11 — Pipeline.** Same receive pipeline as the single-PO screen → Delivery → Vendor Bill → QuickBooks.


**Out of scope.** Merge / keep-separate (Story 13 / Accept Delivery) — this page only assigns a vendor.


**Acceptance Criteria**


  - Reached via Receive Selected; top-left Back to Purchase Orders returns to the list.

  - Grouped vendor → PO + vendor count; per-vendor Expand/Collapse all.

  - Nothing selected by default; selecting a PO selects all its parts; individual parts selectable; actions locked until checked.

  - Receive parts (N) disabled until the vendor invoice number is entered.

  - Quantity + cost editable (cost from WO/PO); sell editable until WO invoiced/paid then locked (icon + tooltip); after lock only cost editable.

  - Vendor-missing PO: assigning a vendor moves it into that vendor's group; entering the part number unflags + enables receiving.

  - Apply invoice (Story 9) + Receive all + partial receive work.

  - Receiving creates the vendor bill + syncs to QuickBooks.


**Core parts.** Special-order/vendor cores resolve **during/after receiving** — the core WorkOrderPart is created at receive, then resolved via the existing **Ok / Not OK** (handle-core) call. **No core-engine change.**


  -


**S8-C1** — Once a cored part is received, its **Ok / Not OK** resolution is available (consumed by the completion round-trip — Story 4 — or the optional-invoice resolve module — Story 3).

  -


**S8-C2** — Support **core-only partial receive**: receiving just the cored line(s) so the optional-invoice Create Invoice gate can settle a core without receiving the whole order.


**Acceptance Criteria (core)**


  - Receiving a cored special-order part makes its Ok / Not OK resolution available.

  - A single cored line can be received on its own and then resolved.


**UI/UX.** Simple Flow Design — PO Bulk Receive · QA — PO Bulk Receive


### Story 9: Per-Vendor "Apply Invoice to Selected POs" — SV-7704


**Summary.** Apply one invoice number across several of a vendor's POs on the Bulk Receive page, so an accountant fills it once and receives them together.


**Context.** Bulk Receive page (Story 8); a vendor with multiple POs. The invoice number is what **gates Receive** (S8-R6) — this control fills it in bulk.


**Requirements**


  -


**S9-R1** — Under the **vendor** name, an **"Apply invoice to selected POs"** control, enabled when an invoice number is entered and **≥1 PO under that vendor is selected**.

  -


**S9-R2** — Select PO(s), enter one invoice number, **Apply** → **pre-filled into only the selected POs of that vendor** (still editable per PO). Then **Receive all** for that vendor.

  -


**S9-R3** — Scoped **per vendor**; does not affect other vendors' / unselected POs. **Not for the vendorless group** (assign a vendor first).


**Acceptance Criteria**


  - Apply enabled only with an invoice number + ≥1 selected PO under that vendor.

  - Apply pre-fills into only the selected POs under that vendor; each PO's number stays editable.

  - Apply doesn't affect other vendors' POs or unselected POs.

  - After Apply, Receive all receives that vendor's selected POs at once.

  - Vendorless group shows no Apply control.

  - Same invoice number may be reused across POs (uniqueness relaxed).


**UI/UX.** Simple Flow Design — PO Bulk Receive · QA — PO Bulk Receive


### Story 10: Inline Part-Number Fix → First-Class Inventory Part — SV-7705


**Summary.** Fix a missing part number during receiving and have that part become a proper inventory/catalog part. **Entering the part number is mandatory to receive.**


**Context.** Receiving on Bulk Receive (Story 8) / Accept Delivery; parts may lack a part number or cost.


**Requirements**


  -


    -


**S10-R1** — A part with no number shows **"Missing part number"** with an **Edit** action → enter → **save**; the saved number persists immediately. **Entering the part number is mandatory to receive that part.** A **dummy/suggested** number reuses the existing "found" mechanism. Same edit pattern everywhere a number can be missing.

    -


**
S10-R2**
— When a part number is**
added, the part becomes a first-class inventory/catalog part**
(POs-on receive): an**
existing**
number**
links**
the line to the existing item (updates stock + received cost + Part History, without overwriting the catalog description/category); a**
new**
number**
creates**
a new item.

    -


**S10-R3 (UPDATED — aligned with SV-7703 S8-R7; applies on BOTH the Bulk Receive page AND the single / Accept-Delivery receive screen — parity)** — Field rules: **quantity + cost editable** (cost **pulled from the WO/PO** when available; **editable when $0 / missing on either receive surface**); **sell price editable until the WO is invoiced/paid, then locked** — shown with a **lock icon + tooltip "Locked — this part is already invoiced or paid."** After it locks, **only cost** remains editable.


**Negative cases**


  - On an invoiced/paid WO, the **sell price is locked**; cost remains editable.

  - A part cannot be received until it has a part number (and a vendor for vendor-missing POs).


**Acceptance Criteria**


  - No-number part → Edit → enter → save persists; Receive stays disabled until a number is entered.

  - New number on receive → new inventory/catalog part + stock + Part History.

  - Existing number on receive → links to that item, updates stock + received cost + Part History, without overwriting description/category.


**Technical guardrails.** The inline endpoint must drive catalog creation/linking + the inventory **stock** Part + Part History (not just store a string); a vendor is required before receive; required receive-payload fields + a default part category must be present; don't rely on the complete-simple bypass to create inventory.


**Core parts.** When a received part is a **core**, its **Ok / Not OK** resolution follows the core flow (received per Story 8, placed per Stories 3/4). **No core-engine change here** — this story only covers the part-number fix + field rules; a cored line inherits the same received-part rules and is billed once resolved.


**UI/UX.** Simple Flow Design · QA — PO Bulk Receive


### Story 11: Receive Button on Work-Order-Originated POs — SV-7706


**Summary.** Add a Receive action on POs that came from a work order, so a receiver doesn't have to go back to the work order to receive.


**Context.** A PO that originated from a work order. (Today these can only be received from the work order itself.)


**Requirements**


  -


**S11-R1** — Add a **Receive** action on WO-originated POs in **both the PO list and the PO detail card** (the detail card currently hides it — fix that), opening **Accept Delivery** directly.

  -


**S11-R2** — The opened flow is the shared Accept Delivery surface (Stories 12–13).

  -


**S11-R3** — Hidden for office/readonly users and for fulfilled POs.


**Acceptance Criteria**


  - Receive appears on WO-originated POs in the list + detail; opens Accept Delivery.

  - A non-WO PO retains its existing receive behavior.

  - Office/readonly → hidden; fulfilled → no Receive.


**UI/UX.** Simple Flow Design · QA — Purchase Orders


### Story 12: Accept Delivery — multi-vendor (existing) + Simple-Flow parts support — SV-7707


**Summary.** The Accept Delivery receive screen **already exists and already supports multiple vendors on one PO**. This ticket does **not** rebuild that — it ensures the new Simple-Flow parts flow into the existing screen and enforces the receive gates.


**Already existing (reused as-is — do NOT rebuild).** Grouped by vendor, multiple vendors on one PO (each group own invoice number / date / tax / note / Receive); per-item selection + received-quantity editable per item with the "received more than ordered" warning; multiple vendors summarized with an indicator.


**New work in this ticket**


  -


**S12-R1 — Simple-Flow parts flow in.** The new **vendorless / no-part-number WO parts** (Story 5) and **WO-originated POs** reached via the new Receive button (Story 11) must appear and be receivable here (vendor-missing in their own group at the bottom).

  -


**S12-R2 — Receive gates.** To receive: vendor set, any missing part number entered, vendor invoice number captured. Vendor-missing → assign a vendor (Story 13); missing part # → enter it (Story 10).

  -


**S12-R3 — "+N" vendor indicator** when a PO holds multiple vendors; vendor-missing group leads.

  -


**S12-R4 — Each vendor group → its own vendor bill → QuickBooks** (separate AP entries). Partial delivery + post-receipt behavior unchanged.

  -


**S12-R5 — Editable cost (parity with Bulk Receive).** On this Accept-Delivery screen, **cost is editable** when $0/missing (pulled from WO/PO when available) — matching Story 8 (S8-R7) / Story 10. Quantity stays editable; the sell-price lock rule is unchanged.


**Out of scope.** Building multi-vendor receive (exists); the Receive button entry (Story 11); assign-vendor / merge (Story 13); the Bulk Receive page (Story 8).


**Acceptance Criteria**


  - Existing multi-vendor receive still works unchanged.

  - New vendorless / no-PN WO parts + WO-originated POs appear and can be received (vendor-missing in their own group).

  - Receive gated on vendor + part number + invoice number.

  - "+N" indicator shown when a PO holds multiple vendors.

  - Each vendor group → own vendor bill → QuickBooks.

  - A $0/missing-cost part on Accept Delivery has editable cost (parity with Bulk Receive); sell-price lock rule unchanged.


**UI/UX.** Simple Flow Design — Accept Delivery · QA — Accept Delivery


### Story 13: Assign Vendor + Merge / Keep-Separate — SV-7708


**Summary.** Assign a vendor to a vendor-missing PO at receive and choose to merge or keep it separate — correcting vendor data and clearing the QuickBooks flag.


**Context.** Accept Delivery with a vendor-missing group.


**Requirements**


  -


**S13-R1** — A vendor-missing group provides a **vendor dropdown** to assign a vendor at the PO level (saved locally and on the backend).

  -


**S13-R2** — Vendor already on this PO → **"Add to {vendor}?" → Yes, Merge** (move items into that group) vs **No, Keep Separate** (two invoice numbers for the same vendor on one PO is valid).

  -


**S13-R3** — Vendor on **another PO for the same work order** → prompt to **merge the POs** (move items to the target, remove the emptied source, redirect to the target).

  -


**S13-R4** — Different vendor, no collision → auto-assign + **clear the QuickBooks flag**.

  -


**S13-R5** — After assignment, the group's **Receive** action enables.


**Acceptance Criteria**


  - Assign vendor → saved; Receive enables.

  - Same-PO collision → merge / keep-separate prompt (merge = one bill, keep-separate = two).

  - Cross-PO same-WO → merge POs + redirect to target.

  - New vendor → assign + clear QB flag.

  - Receiving blocked when the WO is invoiced/paid.


**Technical guardrails.** Match vendors by **ID, not name**; use a **targeted backend lookup** for the cross-PO match (not a capped list scan); **surface errors** on assign/merge failures. Merge scope = same work order.


**UI/UX.** Simple Flow Design — Accept Delivery · QA — Accept Delivery


### Story 14: "Waiting on Parts" Column + Receive Shortcut — SV-7709


**Summary.** Show how many parts each WO is waiting on and let the user jump into receiving — without opening each WO.


**Context.** Work Orders list; all statuses.


**Requirements**


  -


**S14-R1** — An optional **"Waiting on Parts"** column (toggle in the column selector, off by default) shows the count of unreceived parts per WO, for all statuses.

  -


**S14-R2** — Clicking the count navigates to **Accept Delivery** for that WO's first unreceived PO.

  -


**S14-R3** — Receiving itself behaves as today.


**Acceptance Criteria**


  - Column (off by default) shows the count for all statuses.

  - Click → Accept Delivery for the WO's first unreceived PO.

  - Nothing to receive against (incl. POs-off) → **"—" with no link**.

  - Several unreceived POs → link targets the first.


**UI/UX.** Simple Flow Design · QA — Work Orders List


### Story 15: UX Refinements — Labels, Centralized Required Fields, Close Confirmation — SV-7710


**Summary.** Clearer labels, a centralized required-fields modal, and a clear close confirmation.


**Requirements**


  -


**S15-R1** — The work-orders primary button reads **"Create Work Order"**.

  -


**S15-R2** — Required fields at completion (**mileage / VIN when required**) collected in a **centralized center modal**. **Tech story is NOT in the modal** — it has its own flow (Story 17).

  -


**S15-R3** — The completion **success screen** shows WO# + total with **Done** / **Go to Invoice** (invoice number on the Finance step).

  -


**S15-R4** — A **close-confirmation modal** for leaving the complete flow: **Close** = closes the modal only, no discard, stays on the WO (prominent/red); **Cancel** = closes the modal + returns to the previous screen (text link, far left). **⚠️ Design pending** for the close-confirm specifically.


**Acceptance Criteria**


  - Primary button reads "Create Work Order".

  - Missing mileage/VIN → centralized center modal; tech story handled by Story 17.

  - Success screen shows WO# + total with Done / Go to Invoice.

  - Close = close only (no discard), stays on the WO; Cancel = close + return to previous screen.

  - Other consumers of the shared confirmation keep their existing action labels.


**UI/UX.** Simple Flow Design · QA — Work Orders List — ⚠️ close-confirm Figma still to be added.


### Story 16: Simple Completion — Review ON (review gate + sign-off) — SV-7870


**Summary.** When **Require review** is on, completing a work order **sends it to review** instead of completing it, and a **different person** (manager/foreman) signs off before it can be invoiced. Documents the **deltas when review is on**; PO/invoice combos are unchanged (Stories 2/3/4).


**Context.** Review = QA of the physical work by a manager/foreman, not the completer. When review is off, completion behaves as Stories 2/3/4 (Reviewed in background).


**Requirements — deltas when review is ON**


  -


**R1** — Setting "Require review before completion" (S1-R4).

  -


**R2** — CTA/labels change → **"Send to Review"** ("Complete & Send to Review"); receive button + labels differ per design.

  -


**R3** — Details step collects **mileage + engine hours only**; **VIN is captured later by the reviewer** in the Mark Reviewed dialog.

  -


**R4** — "Receive Parts" **routes to the shared receive page** — no inline modal.

  -


**R5** — States: Active(Approved) → [Send to Review] → Review (amber) → [Mark Reviewed] → Reviewed (green) → [Complete Work Order] → Complete; status banners (amber "Ready for Review", blue "sign-off complete").

  -


**R6** — On Send to Review: lines lock to Complete; inventory auto-picked.

  -


**R7** — **Mark Reviewed** = manager/foreman only; dialog captures **VIN (required if missing) + optional note**; Confirm disabled until VIN. Advisor → disabled + "Awaiting review".

  -


**R8** — After sign-off → Reviewed; final Complete Work Order (any role) → Complete (invoice-ready). Invoicing blocked until reviewed.

  -


**R9** — **Ready for Review** list filter/column (reviewer queue).

  -


**R10** — Test ids: button_mark_reviewed, input_review_vin, input_review_note, button_confirm_review.

  -


**R11 — All lines must be approved to Send to Review.** The WO cannot be sent to review / completed until **every line is approved** (replaces the earlier mixed-approval rule). Same as Stories 3/4: any unapproved line — never approved, or manually unapproved when auto-approve is ON — makes clicking **Send to Review** surface the existing "you need to approve the line to complete the work order" error; it proceeds once all lines are approved.


**Acceptance Criteria**


  - Review off → completes as Stories 2/3/4 (no review UI).

  - Review on → CTA "Send to Review"; Details = mileage + hours only (no VIN).

  - Receive Parts → shared receive page (no inline modal).

  - Send to Review → state Review (badge + banner); lines locked; inventory auto-picked.

  - Advisor → Mark Reviewed disabled with "Awaiting review".

  - Manager → Mark Reviewed dialog requires VIN (if missing) + optional note; Confirm disabled until VIN.

  - After sign-off → Reviewed; Complete Work Order → Complete + invoice-ready.

  - WO cannot be invoiced until reviewed; reviewers can filter the list to "Ready for Review".

  - Any unapproved line (never approved, or manually unapproved when auto-approve is ON) → clicking Send to Review shows the existing "approve the line to complete the work order" error; it proceeds once all lines are approved.


**Core parts.** Cores play along with the review path; **no core-engine change** — only placement (mirrors Stories 3/4). Inventory cores are resolved in the completion modal (after Pick) **before Send to Review**. Special-order cores follow the vendor-invoice rules: **required** → resolved after the Receive round-trip before Send to Review; **optional** → resolved at the Create Invoice gate after sign-off. Invoicing is blocked until **both** Reviewed **and** all cores resolved.


**Open.** Setting default (on for bigger/existing shops?); role-gating tied to custom roles vs open for v1. **⚠️ Design pending.**


**UI/UX.** Simple Flow Design


### Story 17: Tech Story Flow — per-line entry + completion gate — SV-7876


**Summary.** Capture a tech story per work-order line, entered inline and/or gated at completion — so the technician (often a different person than the completer) can document the work without cramming it into the completion modal.


**Context.** Tech story is its **own flow**, not a step inside the completion modal. Driven by **Require tech story** (S1-R5).


**Requirements**


  -


**TS-R1 — Inline entry.** Each WO line has a **Story** sub-row; empty → **"Add tech story for this line"** link → opens the modal at that line.

  -


**TS-R2 — Setting.** When Require tech story is on, every line needs a tech story before completion.

  -


**TS-R3 — Gate at completion.** Clicking Complete with a line missing a story opens the **tech-story modal first**, then chains into the completion flow (Stories 2/3/4 or Story 16). **Gate order: tech story first, then parts (pick → receive), then complete/send-to-review.**

  -


**TS-R4 — Modal.** Header "Tech story" + WO# · Customer; per-line card (line #, name, Technician); "Line X of N"; required textarea; **Next** disabled until non-empty; **Back** after line 1; last line = **Continue** (chained) / **Save**.

  -


**TS-R5 — Saved state.** Saved stories render inline — green check + text + **Edit** link.

  -


**TS-R6** — Test id input_tech_story.


**Decision.** Entered **both** inline and via the gate modal — supersedes the earlier "on-the-line only" wording in S15-R2.


**Acceptance Criteria**


  - Empty line shows "Add tech story for this line"; clicking opens the modal at that line.

  - Require-tech-story on + a line missing a story → Complete opens the tech-story modal first, then chains into completion.

  - Next disabled until non-empty; Back after line 1; last line shows Continue (chained) or Save.

  - Saved stories render inline with a check + text + Edit.

  - Require-tech-story off → no gate; completion proceeds normally.


**UI/UX.** Simple Flow Design


## 8. Open Questions


  -


**Core parts (resolved — see Stories 3/4/8/10/16).** Inventory cores resolve in the completion modal (after Pick); special-order cores at receive (required: after the receive round-trip; optional: at the Create Invoice gate, receive-then-resolve). Enforced by placement + an invoice-time unresolved-core check — **no core-engine change**. Remaining guardrail: remove the POC complete-simple force-resolve (changeCoreResolved(true)).

  -


**Part Sales impact (investigation — BE).** The shared order/status logic (requested → orderable/waiting-to-receive; PO-on-order without vendor/cost) may touch **Part Sales**, which reuses the same endpoint/screen but has no "complete without receiving." Keep Part Sales behavior **unchanged unless the shared logic forces a change** — confirm whether the status change affects Part Sales and report back.

  -


**Require-review default** — on for bigger/existing shops? + new-org preset (existing orgs keep today's behaviour via backfill).

  -


**Role-gating** review (manager/foreman) — custom roles vs open for v1.

  -


**Cost at completion** — allow entering cost at completion to avoid $0-cost margins?

  -


**Auto-receive of in-stock inventory parts** on simple completion — confirm intended.

  -


**BE enforcement of the Simple-Flow settings** — should BE enforce them?

  -


**Permissions** — which roles do completion vs bulk receive vs settings vs review.


## 9. Change Log


********


********


********


********************


| Date | Reporter | Change |
|---|---|---|
| 2026-07-03 | @Milos Vasic | Mixed line approval added to Stories 3/4/16 (auto-approve off → only approved lines complete; unapproved stay open, non-blocking). Core parts marked deferred (placeholder) pending a designed solution. |
| 2026-07-06 | @Milos Vasic | Core-parts resolution folded in across Stories 3/4/8/10/16 — inventory cores gated in the completion modal (after Pick); special-order cores at receive (required) or the Create Invoice gate (optional, receive-then-resolve). No core-engine change. §8 core question marked resolved. |
| 2026-07-06 | @Milos Vasic | Line approval changed to "all lines must be approved to complete" (replaces mixed/partial completion) on Stories 3/4/16 + §4. With auto-approve ON, a manually-unapproved line blocks completion via the existing "you need to approve the line to complete the work order" error (CTA stays active; no new disabled state). |
| 2026-07-08 | @Milos Vasic | Sell price mandatory at save (Story 5); sell-price-only parts orderable from the line → waiting-to-receive (Story 6, S6-R7); order-before-receive so the receive screen is never empty (Stories 3/4); editable cost on the single / Accept-Delivery receive (parity with Bulk Receive — Stories 10/12). Added Part Sales impact investigation to §8. |




