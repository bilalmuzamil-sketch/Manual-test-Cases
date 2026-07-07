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
