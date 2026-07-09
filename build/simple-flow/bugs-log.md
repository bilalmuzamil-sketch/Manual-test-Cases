# Simple Flow — Bugs / Deviations Log

> QA-found bugs and spec deviations from VIU (Verify-in-UI) on the sv7301 QA env.
> Full evidence + endpoints in `viu-findings.md`. Product/dev rulings feed the
> Blockers Tracker (`SimpleFlow_Blockers_Tracker.xlsx`) BUG/RULING category.

## Legend
- **Sev**: High / Medium / Low.
- **Status**: OPEN (needs a dev/PO ruling or fix).

---

## MILOS ROUND-2 RESOLUTIONS (2026-07-09)

Milos answered the Round-2 open questions (`milos-round2-answers-source.*`,
`milos-round2-mapping.md`). Impact on this log:

- **BUG-3 (review note) → CLOSED / NOT A BUG.** Note removed from the design; v1 has
  no review-note field. SF-REV-10 expected updated to VIN-only.
- **BUG-9 / GAP-A (part-request required fields) → CLOSED / INTENDED.** Category IS
  required, Sell Price NOT enforced — expected for v1. SF-VPART-01/02 expected updated.
- **BUG-6 / BUG-7 (BE enforcement of completion / review sign-off) → RULED: UI gating
  = PASS for v1; API gap stays OPEN as a fix ticket.** Record results as "UI pass /
  API fail". SF-PERM-06 expected updated.
- **Q3 inventory-decrement invariant → CONFIRMED** (in-stock parts DO decrement +
  write Part History on completion); SF-COMP-07 / SF-QB-01 expected already correct.
- **Q2 tech-story (Story 17) → CONFIRMED authoritative** (visuals only + complete
  stories individually or several at once); SF-TECH-08 open question closed.

---

## NEW — Tech-unblock pass (2026-07-07): backend enforcement gaps

These three surfaced once the Technician session became testable (`quick-login
{key:'tech'}` now returns 200). They all bear on the **SV-8183 "backend enforces
the atoms"** claim vs the **SV-7864 atom-collapse** behaviour.

### BUG-5 — reviewer ≠ completer rule NOT enforced  · Sev: High · Status: OPEN
- **The one net-new Simple-Flow permission rule is missing.** A user can sign off
  (Mark Reviewed) their own completed / sent-to-review work order.
- **Repro:** Enable Require Review. As **admin**, complete a WO to "Send to
  Review" (`POST /api/work-orders/{id}/simple-complete` → status `ready_for_review`,
  e.g. WO S2-15752). Then, as the **same admin**, open the Mark-Reviewed dialog and
  Confirm Review. No block occurs — WO goes **Review → Complete**.
  Evidence: `viu-evidence/REV-admin-completer-markreviewed.png`.
- **Expected:** the person who completed / sent the WO to review is barred from
  signing it off (the `sentToReviewBy` / `completedBy` stamp should block the same
  user), per SV-8183's reviewer≠completer rule.
- **Actual:** no such block; self-sign-off succeeds.
- **Affects cases:** SF-PERM-08, SF-PERM-04 (expected #3), SF-PERM-07 (expected #2),
  SF-REV-09 (expected #3).

### BUG-6 — WO-completion permission is FE-only at the backend  · Sev: High · Status: OPEN
- **Role-gating of completion is not server-enforced.** A **Technician** (Tech View
  mode, no `workOrdersCreateAndEdit`) — who per §9.2 cannot complete a WO — can
  complete one via the API.
- **Repro:** As tech, `POST /api/work-orders/{id}/simple-complete {}` returns the
  SAME business-validation 400 as admin ("Line can not be completed without a tech
  story…"), i.e. the permission voter PASSED (not a 403). After admin sets the
  story + mileage, **tech `simple-complete` → 201, `status:"complete"`**.
- **Expected (per SV-8183):** the backend enforces the completion atom → tech gets
  **403**.
- **Actual:** 201. The FE hides the "Complete Work Order" button for tech
  (`viu-evidence/TECH-wo-detail.png`), but the BE does not enforce the distinction.
  Root cause: `workOrderLinesCreateAndEdit` collapses to
  `ROLE_WORK_ORDER::VIEW+CREATE_AND_EDIT` server-side (SV-7864), so any WO C&E role
  can act on the WO.
- **Affects cases:** SF-PERM-06 (expected #1), SF-PERM-02.

### BUG-7 — Review sign-off permission is FE-only at the backend  · Sev: High · Status: OPEN
- **`woReviewWorkOrders` is not server-enforced.** A Technician without the atom
  can drive the review → complete sign-off.
- **Repro:** As tech, `POST /api/work-orders/change-status {id, status:"complete",
  work_order_part_cost:0}` on a `ready_for_review` WO → **201** (WO → complete).
- **Expected (per SV-8183):** backend rejects with 403 for a role lacking
  `woReviewWorkOrders`.
- **Actual:** 201. FE hides the control; BE does not enforce.
  *(Contrast: the settings atom IS enforced — tech `POST
  /api/organizations/settings/change` → 403.)*
- **Affects cases:** SF-PERM-07, SF-REV-09.

### ⚠ Contradiction to resolve (BUG-6 / BUG-7) — RULED 2026-07-09 (Milos Round-2 Q5, ruling by Bilal)
**SV-8183 says "the backend enforces the atoms"**, but **SV-7864 (atom collapse)**
means any Work-Orders Create-&-Edit role can complete/receive/sign-off a WO
regardless of the finer Simple-Flow atoms. VIU shows the split is real: the
**settings** atom (`settingsApp`) is BE-enforced (tech → 403), but **WO
completion, receive, and review sign-off are FE-only** (tech → 201).
> **RULING (2026-07-09, Milos Round-2 Q5, by Bilal):** *"For now let's consider the
> UI restriction the pass for the test cases and not necessarily the API restriction,
> but do note in the comments after running the tests that it passed for UI and failed
> for API so there can be a record in the system to eventually fix that."* So for v1
> the permission cases **PASS on UI gating** (the FE hides the button for the
> unauthorized role). The BE non-enforcement of the WO-completion / review-sign-off
> atoms (**BUG-6 / BUG-7**) is a **known API gap kept OPEN for a future fix** — record
> each result as **"UI pass / API fail"**. This settles SF-PERM-02/04/06/07/08 and
> SF-REV-09 as **UI-PASS** for v1. **SF-PERM-06 expected updated** accordingly (UI
> gating = pass criterion; API gap recorded). BUG-6 / BUG-7 remain OPEN as fix
> tickets; the settings atom stays BE-enforced.

---

## NEW — VIU batch (2026-07-08): completion required-fields are FE-only at the backend

### BUG-8 — mileage / VIN / engine-hours completion gates are FE-only (not BE-enforced) · Sev: Medium · Status: OPEN
- **The required-vehicle-field gates at completion are enforced only by the
  completion wizard (front-end), not by the backend `simple-complete` endpoint.**
- **Repro:** With `requireMileage=true` (and `requireVehicleIdentifier=true`), on a
  fresh WO whose mileage was still empty, `POST /api/work-orders/{id}/simple-complete
  {}` returned **201** and drove the WO to Complete once the only *BE-checked*
  blockers (tech story, line approval) were cleared — mileage was set only later.
  By contrast the **completion wizard UI** blocks Continue with the inline error
  **"Mileage is a required field"** (`viu-evidence/VIU2-02-mileage-gate.png`).
- **Expected (per §4 / SV-8183 "backend enforces"):** backend rejects completion
  when a required vehicle field is missing.
- **Actual:** backend accepts; only the wizard enforces it. Consistent with the
  BUG-6/BUG-7 FE-only pattern.
- **Affects cases:** SF-VAL-01 (verified at the UI layer), SF-VAL-02, SF-VAL-03,
  SF-COMP-05, SF-COMP-16, SF-REV-03. (The UI-level blocks are real and were
  verified where driven; the backend non-enforcement is the deviation.)
- **Note:** the **tech-story gate** and the **all-lines-approved gate** ARE
  BE-enforced (`simple-complete` → 400 with explicit messages), so the split is
  per-check, not blanket.

---

## NEW — VIU batch 3 (2026-07-08): vendorless part-add requires Category

### BUG-9 — Vendorless / no-PN part add requires a Category (spec S5-R1 says only description + qty + sell) · Sev: Low · Status: OPEN
- **The "New Part Request" sub-form enforces a required Category** in addition to
  Description and Quantity. Spec S5-R1 says a part can be requested with **only
  description, quantity and sell price**.
- **Repro:** WO `/lines` → New Line → custom title → **Save & Add Part** → in "New
  Part Request", click Save with fields empty → inline errors **"Description is a
  required field", "Quantity is a required field", "Category is a required field"**.
  Filling only description + quantity + sell price does **not** save (Category
  blocks); adding a Category → **201 `POST /api/work-orders/part/make-request`**.
  Evidence: `viu-evidence/VP-11-validation-empty.png`, `VP-13/VP-14`.
- **Also observed:** **Sell Price is NOT flagged required** by the form (contrary
  to S5-R1's "sell price mandatory"). The created part is correctly vendorless
  (`part_number:null, vendor_id:null, part_source_type:'vendor', inventory_part_id:null`).
- **Expected:** per S5-R1, only description + quantity + sell price required (no
  Category gate); sell price required.
- **Actual:** Category required; sell price not enforced.
- **Affects cases:** SF-VPART-01, SF-VPART-02.
- **2026-07-08 RECONCILIATION (V2.4):** V2.4 **S5-R1** now makes **sell price the
  only mandatory financial field, validated AT SAVE (inline)**. SF-VPART-01/02
  expected were updated to the V2.4 wording (sell required inline at save; sell-only
  parts orderable from the line). The live build's failure to enforce sell **and**
  its extra Category requirement are therefore a confirmed **spec-vs-build gap**
  (build lags V2.4) — see the Spec-vs-build gaps section below. Status: OPEN.
- **2026-07-09 RESOLUTION → NOT A BUG (Milos Round-2, Q4):** Milos ruled the
  **current behavior is expected for v1** — **Category IS required** and **Sell Price
  is NOT enforced**. Under last-update-wins this supersedes the V2.4 S5-R1 wording.
  **SF-VPART-01/02 expected updated** to: required = description + quantity + category;
  sell price optional. GAP-A (below) is likewise **closed**. Status: CLOSED (intended).
  FOLLOW-UP (separate item): the See-Financial-Data gate rationale was "sell is
  mandatory" (now overturned) — whether a permission gate still applies to vendorless
  part-add is an open question.

### BUG-10 — No "Resolve Cores" step in the completion wizard for an inventory core (resolution is line-level) · Sev: Medium · Status: RECLASSIFIED → EXPECTED (2026-07-08)
> **RECLASSIFIED → EXPECTED** per the Simple Flow shortcut principle (see
> `finding-reclassification.md`): the wizard skipping the Resolve-Cores step and
> going Details→Success still reaches the same end state with **no error and no
> data/inventory/Part-History corruption** — core Ok/Not-Ok stays available as a
> line-level control. **Not a defect, not a PO question.** (The receive-dependent
> special-order-core paths remain separately blocked by BUG-11, a real defect.)
- **Spec (SF-CORE-01/10, S3-C1/S4-C1, "Resolve Cores handoff"):** after Pick, the
  completion **modal/wizard** should show a distinct **Resolve Cores** step listing
  the core lines, with **Ok / Not OK per core** and a live **"+$ to invoice"**
  running total; Continue disabled until all cores resolved.
- **Actual (VIU 2026-07-08, BATCH 5):** a genuine cored inventory part **P550848**
  (FUEL/WATER SEPARATOR; `core_charge=1`, has `core_part_id`) added to a service WO
  line generates a **"P550848 Core" sub-line** on the WO with **Ok / Not Ok**
  controls + a `$` amount (`$0` until Not OK) on the **line's Parts view** — but the
  **completion wizard does NOT present a Resolve Cores step**. Completing the WO went
  straight **Details → Success** (verified with `autoPickInventoryParts` **ON and
  OFF**). The core resolution is therefore a **line-level control, not a wizard
  step**.
- **Repro:** WO `/lines` → New Line (custom title) → Save & Add Part → select
  catalog PN **P550848** (Source auto-set Inventory; cost/core/sell auto-fill; qty
  via bin-amount input) → Save → Complete Work Order → wizard shows only Details then
  Success; no Resolve Cores step. Evidence `viu-evidence/CORE-01-part-selected.png`,
  `CORE-01b-filled.png`, `CORE-04-wizard-step1.png`.
- **Open:** whether the modal Resolve-Cores step appears for a **special-order
  (vendor-source) core** that requires **receiving** (the S3/S4 special-order-core
  path, SF-CORE-03/04/05/07). **BATCH 7 update:** a genuine special-order core is NOT
  seedable — selecting the catalog core PN (P550848) forces **Source = Inventory**
  (never vendor), and the manual sub-form's Core Charge produces `is_core:false` (not
  a real core). BUG-10 **re-confirmed with `autoPickInventoryParts` OFF** (wizard
  still Details→Success). The receive-dependent core paths are additionally blocked
  by **BUG-11** (WO-PO receive 500). So all SF-CORE remain pending.

---

## NEW — Deliverable-WO-PO receive pass (2026-07-08, BATCH 7)

### BUG-11 — WO-PO receive HTTP 500 on the LEGACY Accept-Delivery path (the new Bulk Receive pipeline works — receive-requested-parts returns 200) · Sev: High → Low · Status: WORKAROUND EXISTS (bulk path works) — valid bug for the legacy single-PO path only, lower urgency
> **UPDATE 2026-07-09 (re-VIU, Stories 7/8/9 now built):** BUG-11 does **NOT
> reproduce on the new Bulk Receive pipeline**. Receiving a self-created deliverable
> WO PO (S-15786, Source=Vendor + free-text PN, qty 2) via the Bulk Receive page ran
> **`POST /api/orders/receive-requested-parts` → 200** (+ `/api/inventory/orders/
> receive-view` 200), created a Delivery / Vendor Bill (invoice ZZAUTOTEST-APPLY-1,
> Aabridge Beverages), and moved the order to `partial_delivery` (received 1 of 2).
> The 500 only occurs on the **legacy `POST /api/inventory/orders/accept`
> (Accept-Delivery) path**; the bulk path uses a different endpoint that works. Net:
> the WO-PO receive round-trip is now achievable via Bulk Receive — the cases listed
> below as "blocked by BUG-11" are largely **unblocked via the bulk path** (re-VIU as
> budget allows). Severity downgraded (a working path exists); the Accept-Delivery
> 500 should still be fixed for the single-PO receive surface.

- **A work-order-originated PO cannot be received via Accept Delivery** — the receive
  call fails server-side (legacy `/api/inventory/orders/accept`). See the 2026-07-09
  update above: the Bulk Receive pipeline is unaffected.
- **Context / recipe (the deliverable WO PO, which DOES work):** adding a WO part via
  **New Part Request → Source = Vendor + pick a real vendor (e.g. Aabridge Beverages)
  + type a free-text Part Number** (optionally a cost) and completing the WO creates a
  genuinely **deliverable "ordered" WO PO** (`vendorMissing:false`, vendor assigned).
  It surfaces correctly on the shared Accept Delivery page `/accept-delivery/{orderId}`
  (Work Order Number linked, Invoice Number field, Invoice Date, per-line Quantity
  Ordered/Received, Delivery Note, Receive). This is the recipe prior batches were
  missing (vendorless parts → vendor-missing PO; catalog-PN parts → Source=Inventory /
  picked, not received).
- **Actual:** clicking **Receive** (or calling `POST /api/inventory/orders/accept`
  with the exact browser payload — `{id, invoiceNumber, invoiceDate, items:[…],
  total, orderStatus, tax}`) returns **HTTP 500** ("An error occurred… please try
  again", with a `requestId`). Reproduced on **both a $0-cost and a real-cost**
  ($25) WO part, and on **both full and partial** delivery quantities. The same
  Accept Delivery tool receives an **inventory (non-WO) PO fine (201)** — so this is
  **WO-PO-specific**.
- **Likely root cause:** the WO part uses a **free-text / non-catalog part number**
  (`manufacturer_id:null`, no linked catalog/inventory item); receiving it must
  create/link a catalog+inventory part (Story 10 behaviour) and that creation appears
  to fail. This plausibly shares a root cause with the inline-PN cases (SF-PNFIX-02..06).
- **Repro:** create WO → New Part Request (Source=Vendor, vendor=Aabridge, PN=free
  text, cost=25) → set tech story + mileage → `simple-complete` (201, WO PO becomes
  `status:ordered`, `vendorMissing:false`) → `/accept-delivery/{orderId}` → enter
  invoice #, delivered qty → Receive → **500**. Evidence
  `viu-evidence/R7-01-wo-po-accept-delivery.png`, `R7-04-ready.png`, `R7-06-received-full.png`.
- **Affects cases (WO-PO receive round-trip, now blocked by BUG-11 rather than
  "unseeded"):** SF-COMP-19, SF-VAL-05, SF-VAL-06, SF-PNFIX-02, SF-PNFIX-03,
  SF-PNFIX-04, SF-PNFIX-05, SF-PNFIX-06, SF-RCV-08, SF-VPART-07, SF-REV-04, SF-REV-14,
  and SF-COMP-13 (the wizard's "Receive Parts" also routes back to the WO lines page,
  not Accept Delivery, because the PO is not placed until completion). SF-CORE-03..07
  (special-order core receive) likewise.
- **Affects cases:** SF-CORE-01, SF-CORE-10 (and by extension SF-CORE-02); EXPECTED
  wording NOT changed pending a dev/PO ruling on whether cores are resolved in the
  wizard vs on the line.

### Note — vendorless part-add financial fields are FE-gated for non-SFD roles (SF-PERM-09)
- As **Technician** (no See Financial Data) the New Part Request form **hides** all
  financial fields (Sell Price, Cost, Core Charge, Margin, Vendor, Category); tech
  sees only Part Number, Description, Quantity. This is an **FE gate** (fields hidden),
  consistent with the FE-only enforcement pattern of BUG-6/7/8 — not necessarily a
  bug, but recorded so the SF-PERM-09 verdict is understood as FE-level.
  Evidence: `viu-evidence/PERM09-tech-partform.png`.

---

## Earlier pass (2026-07-06): settings / review deviations vs spec

Recorded here for completeness; tracked as Open Questions to Milos (see
`OpenQuestions-for-Milos.md`).

### BUG-1 — No "Create Purchase Orders" setting (S1-R2) · Open Q5
No such toggle in `/administration/settings` and no `createPurchaseOrders` field
in `GET /api/organizations/settings`; POs are effectively always-on. The pure
Story-2 "No-PO / skip" configuration (Create POs OFF ⇒ no PO) is not configurable.
Affects SF-SET-03, SF-COMP-06, SF-QB-02.

### BUG-2 — Save Settings always enabled · Open Q6
The Save button on the Work Orders settings tab is clickable with no pending
changes (no dirty-state gating). Affects SF-SET-13.

### BUG-3 — Mark Reviewed dialog missing optional note · Open Q7 · RESOLVED → NOT A BUG (Milos Round-2, 2026-07-09)
Story 16 R7/R10 specify an optional `input_review_note`; the live dialog exposes
only the VIN field. Affects SF-REV-10.
> **RESOLVED → intended descope (2026-07-09, Milos Round-2)** — supersedes the
> 2026-07-08 "REAL DEFECT / build-gap" reversal. Milos: *"There will not be note on
> this field; it is a design issue which I removed from the design yesterday."* The
> optional review note has been **removed from the design**, so there is **no note
> field** in v1. Under last-update-wins his 2026-07-09 answer governs over the 07-08
> design bundle. **SF-REV-10 expected updated to VIN-only (no note)** and the live
> VIN-only dialog now matches expected. **No longer a bug.** Status: CLOSED.

### BUG-4 — Review sign-off jumps to Complete · Open Q8 · RECLASSIFIED → EXPECTED (2026-07-08)
Story 16 R5/R8 describe Review → **Reviewed** → (final Complete) → Complete as
distinct states; live, Confirm Review went straight to Complete with no distinct
"Reviewed" state observed (possible admin auto-progression). Affects SF-REV-08,
SF-REV-11.
> **RECLASSIFIED → EXPECTED** per the Simple Flow shortcut principle (see
> `finding-reclassification.md`): a skipped intermediate "Reviewed" state that
> still reaches the same Complete end state with no error/corruption. **Not a
> defect.**

---

## NEW — Spec-vs-build gaps (2026-07-08 reconciled batch: build lags V2.4 spec / 07-08 design)

Recorded when applying the reconciled V2.4 + design batch (last-update-wins). These
are cases where the authoritative spec/design is now settled but the **live build
lags** — case EXPECTED follows the spec; the live deviation is the gap to fix.

### GAP-A — Vendorless "New Part Request" requires Category + does not enforce sell · Sev: Low · Status: OPEN
- **Spec (V2.4 S5-R1):** sell price is the **only mandatory financial field**,
  validated **at save (inline)**; no Category gate.
- **Live build:** empty-save errors flag **Description / Quantity / Category** as
  required and do **NOT** flag Sell Price. (Same evidence as BUG-9.)
- **Impact:** SF-VPART-01 / SF-VPART-02 expected follow V2.4 (sell required inline at
  save); the build's Category gate + non-enforced sell is the gap. Ties to BUG-9.

### GAP-B — Wrong first-use settings defaults · Sev: Medium · Status: OPEN
- **Spec (§4 / S1 defaults, confirmed Milos Q3):** first-use defaults = Auto-approve
  Lines **OFF**, Create Purchase Orders **ON**, Vendor Invoice **REQUIRED**.
- **Live build / design HANDOFF:** first-use shows Auto-approve **ON**, Vendor
  Invoice **Optional** (`autoApproveLines:true`, `requireVendorInvoiceNumber:false`).
- **Impact:** SF-SET-08 expected is authoritative (spec defaults); the live/design
  defaults are the gap to fix. (Downgraded BUG-1/BUG-2 do not apply here.)

### Reminder — No-PO path RETAINED (V2.4), BUG-1 is a build-lag not a descope
- Under last-update-wins, **V2.4 (Story 2 + S1-R2 + §4) retains the No-PO / Create-POs-OFF
  path**, overriding the round-1 "POs always on" answer. So **BUG-1** (no Create-POs
  toggle live; POs always-on) is now a **spec-vs-build gap** (build lags V2.4), not an
  intended descope. Cases SF-SET-03 / SF-COMP-06 / SF-QB-02 are **NOT retired** and
  stand as V2.4 documentation.

---

## RE-VIU 2026-07-09 — Stories 7/8/9/14 confirmed BUILT: new observations / minor deviations

Recorded during the targeted re-VIU on sv7301 after the Epic reported Stories
7/8/9/14 built. All confirmed live. These are **minor deviations / notes**, not
filing-grade defects (no error/corruption).

### OBS-1 — Two spec-vs-Epic conflicts RESOLVED in favour of the SPEC (no case change needed)
- **(a) "Dummy PO" (Epic) vs "Vendor Missing on the WO's PO" (spec V2.4):** the built
  app places vendorless parts on the **WO's own PO** flagged **"Vendor Missing"**
  (a self-created WO with 2 vendorless parts → both share ONE order_id, S-15787,
  vendorMissing=true — no separate dummy PO). On the Bulk Receive page they appear
  under a **"Vendor Missing" group** with an inline **assign-vendor** prompt
  ("Assign a vendor to receive these parts"); Receive is **shown-but-disabled**, not
  hidden, and vendor-missing POs **are selectable** on the PO list. → Spec V2.4 wins;
  SF-VMIS-01/02 and SF-POSEL-05 are correct as written.
- **(b) "Waiting on Receive" (Epic) vs "Waiting on Parts" (spec/cases):** the shipped
  column label is **"Waiting On Parts"** (column toggle `toggle_column_
  unreceivedPartRequestsCount`). → Spec/cases correct as written; the Epic's "Waiting
  on Receive" is not the shipped label. No SF-WOP wording change needed.
> Because both conflicts resolved to "built matches our existing spec-based
> expecteds", **no case EXPECTED diverged and no TestRail update_case was required.**

### OBS-2 — Vendor-Missing group ordering on the Bulk Receive page (minor)
- The **Bulk Receive page** renders the **"Vendor Missing" group LAST** (after the
  real vendor groups). Spec S12-R3 (Accept Delivery) wants the vendor-missing group
  to **LEAD** (it needs action first). This is on the Story-8 Bulk page (a different
  surface than Accept Delivery); flag for a Milos/dev confirm whether the vendor-
  missing group should lead on the Bulk Receive page too. Affects SF-RCV-05/07 wording
  only if the same ordering rule is meant to apply to Bulk Receive.

### OBS-3 — SF-VMIS-05: order Vendor-Missing flag clears on VENDOR assignment alone
- Assigning a vendor to a vendor-missing PO sets `vendorMissing → false` and moves it
  to the vendor group **immediately** (before any part number is entered). The part
  number is enforced as a **separate per-part receive gate** (a part still cannot be
  received until its PN is entered). Spec S6-R5 phrases the flag as clearing once
  **both** vendor and PN are present; the built behaviour splits this (vendor → group/
  flag; PN → receive gate). Functionally equivalent for receiving; note the nuance.

### OBS-4 — SF-POSEL-04: fulfilled POs are EXCLUDED from the PO list (not shown-disabled)
- The PO list (`GET /api/inventory/orders`) returns only `ordered` / `partial_delivery`
  orders — fulfilled POs do not appear at all, so they are inherently not selectable
  for receive (stronger than the case's "checkbox disabled" wording). Outcome matches
  the case expected; mechanism differs.

### OBS-5 — SF-WOP-02: "Waiting on Parts" count opens Bulk Receive, not legacy Accept Delivery (BATCH 8, 2026-07-09)
- Clicking a WO's "Waiting On Parts" count navigates to the **new consolidated Bulk
  Receive page** `/bulk-receive?ids=<firstUnreceivedPO>` ("Receive Vendor Parts"),
  NOT the legacy "Accept Delivery" screen worded in SF-WOP-02. Same end-state (receive
  the WO's first unreceived PO). Not a defect — a surface consolidation; SF-WOP-02
  expected refined locally. The same consolidation underlies SF-RCV-06/RCV-10 verdicts
  (the WO-PO receive surface is Bulk Receive; the legacy single-PO Accept-Delivery
  path still 500s for WO POs — BUG-11). No product decision needed; wording note only.

### NOTE — assign-vendor endpoint (BATCH 8)
- The Bulk Receive Vendor-Missing group assign-vendor action = `POST /api/orders/{orderId}/assign-vendor`
  (200); a non-colliding vendor auto-assigns with no Merge/Keep-Separate prompt and
  clears `vendorMissing`. The Story-13 merge/keep-separate prompt (SF-VEND-02/03) only
  surfaces on a same-vendor / same-WO collision, which was not seedable this pass.
