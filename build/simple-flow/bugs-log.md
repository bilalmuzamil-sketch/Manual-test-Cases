# Simple Flow — Bugs / Deviations Log

> QA-found bugs and spec deviations from VIU (Verify-in-UI) on the sv7301 QA env.
> Full evidence + endpoints in `viu-findings.md`. Product/dev rulings feed the
> Blockers Tracker (`SimpleFlow_Blockers_Tracker.xlsx`) BUG/RULING category.

## Legend
- **Sev**: High / Medium / Low.
- **Status**: OPEN (needs a dev/PO ruling or fix).

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

### ⚠ Contradiction to resolve (BUG-6 / BUG-7)
**SV-8183 says "the backend enforces the atoms"**, but **SV-7864 (atom collapse)**
means any Work-Orders Create-&-Edit role can complete/receive/sign-off a WO
regardless of the finer Simple-Flow atoms. VIU shows the split is real: the
**settings** atom (`settingsApp`) is BE-enforced (tech → 403), but **WO
completion, receive, and review sign-off are FE-only** (tech → 201). A dev/PO
ruling is needed on which governs — this decides whether SF-PERM-02/04/06/07/08
and SF-REV-09 are PASS (FE-gating acceptable) or FAIL (BE gap).

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
- **Affects cases:** SF-VPART-01, SF-VPART-02 (expected-result wording may need a
  tweak to add "Category required"; NOT yet changed in the cases/import — flagged
  for PO/team ruling).

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

### BUG-3 — Mark Reviewed dialog missing optional note · Open Q7
Story 16 R7/R10 specify an optional `input_review_note`; the live dialog exposes
only the VIN field. Affects SF-REV-10.

### BUG-4 — Review sign-off jumps to Complete · Open Q8
Story 16 R5/R8 describe Review → **Reviewed** → (final Complete) → Complete as
distinct states; live, Confirm Review went straight to Complete with no distinct
"Reviewed" state observed (possible admin auto-progression). Affects SF-REV-08,
SF-REV-11.
