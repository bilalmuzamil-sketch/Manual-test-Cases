# Simple Flow — Finding Reclassification under the "Shortcut" Principle

> **Date:** 2026-07-08 · **Scope:** Simple Flow (Simple Mode) ONLY.
> **Status:** ANALYSIS + PROPOSAL. **No case JSON / Excel / TestRail edited.** The
> "Resulting expected wording" and the STEP-5 case-expected updates below are
> proposals for the user to approve before the next TestRail update batch.

## The principle (from the user)

Simple Flow's purpose is to shorten/skip legacy multi-step flows to reach the
**same end state faster**. Therefore:

- Any behavior that reaches the same destination by **SKIPPING** a legacy
  flow/step is **EXPECTED** — not a bug, not a PO question.
- It is a **DEFECT only** if the skip (a) throws an **ERROR**, or
  (b) **corrupts data / inventory / Part-History integrity**.

Anything that is not a flow-skip at all (an EXTRA required field, a
permission/enforcement question, or a data-integrity confirmation) is **OTHER** —
kept as a question or bug on its own merits.

---

## Reclassification table

| Finding / BUG-# | Description | Classification | Reasoning (per principle) | Affected cases | Resulting expected wording (if EXPECTED) / ticket-or-question note |
|---|---|---|---|---|---|
| **BUG-10** | Completion wizard has **no distinct "Resolve Cores" step**; core OK/Not-OK is a **line-level** control on the line's Parts view; wizard goes Details→Success. No error. | **EXPECTED** | A skipped intermediate step that still reaches the same end state (Success / invoice-ready), with no error and no data/inventory/Part-History corruption. The core is still resolvable (line-level Ok/Not-Ok). | SF-CORE-01..10 | Core resolution is a **line-level** control (Ok / Not-Ok + $ on the line's Parts view); the completion wizard has **no distinct Resolve-Cores step** and goes Details→Success. (Receive-dependent special-order-core paths remain separately blocked by BUG-11 — a real defect, not this reclassification.) |
| **BUG-3** | Mark-Reviewed dialog captures VIN only; **no optional `input_review_note`** field. No error. | **REAL DEFECT / build-gap — REVERSED 2026-07-08** (was EXPECTED) | The refreshed **2026-07-08 design bundle** shows the "Mark work order reviewed" dialog carries **VIN (required) + an optional Review note** *by design* (see `design-change-diff.md`). Under **last-update-wins** the 07-08 design is the latest input, so the note is INTENDED and its live absence is a **build gap**, not a Simple-Flow simplification. | SF-REV-10 | EXPECTED **restored** to: the Mark-Reviewed dialog shows **VIN / Serial # (required)** + an **optional review-note field** (`input_review_note`); a note can be saved with the sign-off. Live absence = build gap to fix. |
| **BUG-4** | Review sign-off jumps **Review → Complete**; no distinct "Reviewed" holding state; no separate final Complete click. No error. | **EXPECTED** | A skipped intermediate state ("Reviewed") that still reaches the same end state (Complete / invoice-ready) with no error and no data corruption. | SF-REV-08, SF-REV-11 | After Confirm Review the WO signs off and moves **directly Review → Complete**; there is **no distinct "Reviewed" holding state** and no separate final "Complete Work Order" click. |
| **BUG-11** | Receiving a **WO-originated PO** via Accept Delivery returns **HTTP 500** (`POST /api/inventory/orders/accept`); inventory (non-WO) POs receive fine (201). | **REAL DEFECT** | The skip **throws an ERROR** (server 500) — fails prong (a) of the principle. Also blocks the receive lifecycle (potential Part-History/inventory integrity risk). File as a bug. | SF-COMP-13/19, SF-VAL-05/06, SF-PNFIX-02..06, SF-RCV-08, SF-VPART-07, SF-REV-04/14, SF-CORE-03..07 | KEEP as bug to file (Sev High). No EXPECTED rewrite — expected wording stays as the receive round-trip; case verification is blocked on the fix. |
| **BUG-9** | Vendorless "New Part Request" sub-form **requires a Category** beyond spec S5-R1 (desc + qty + sell); Sell Price not enforced. | **OTHER** | **Not a flow-skip** — it is an ADDED required field, the opposite of skipping a step. Keep as a PO question (is Category-required intended for v1?). | SF-VPART-01, SF-VPART-02 | KEEP as PO question (Milos Round-2 Q4). If confirmed intended → expected adds "Category is required"; also confirm whether Sell Price should be enforced. |
| **SF-PERM-06 / BUG-6 / BUG-7** | Backend does **not** enforce the completion / review-sign-off permission atoms; a Technician can complete a WO / sign off a review via the API (201) — only the FE hides the buttons. | **OTHER** | **Not a Simple-Flow UI shortcut** — it is a permission/enforcement question that contradicts SV-8183's "BE enforces the atoms" vs SV-7864 atom-collapse. Skipping the FE gate here is NOT the feature's intended shorten-the-flow behavior. | SF-PERM-06, SF-PERM-02, SF-PERM-07, SF-REV-09 | KEEP as question/bug (Milos Round-2 Q5). Needs a dev/PO ruling on whether FE-only gating is acceptable (PASS) or a BE gap (FAIL). Note explicitly: this is **not** a flow-skip. |
| **BUG-8** | Mileage / VIN / engine-hours completion gates are FE-only (the `simple-complete` endpoint does not enforce them; only the wizard does). | **OTHER** | Same family as BUG-6/7 — a **permission/enforcement** (BE vs FE) question, not a flow-skip. The UI gate is real; the BE non-enforcement is the deviation. | SF-VAL-01/02/03, SF-COMP-05/16, SF-REV-03 | KEEP as an enforcement note tied to the BUG-6/7 ruling (same "does BE enforce?" decision). Not a flow-skip. UI-layer expected wording stays (the wizard gate is real). |
| **BUG-5** | Reviewer ≠ completer rule not enforced — a user can sign off their own sent-to-review WO. | **OTHER** | **Not a flow-skip** — it is a **net-new Simple-Flow business rule** (SV-8183) that is simply missing. A missing safeguard is a gap, not a shorten-the-flow behavior. | SF-PERM-08, SF-PERM-04(3), SF-PERM-07(2), SF-REV-09(3) | KEEP as a gap to confirm/file (Sev High). |
| **BUG-1** | No "Create Purchase Orders" toggle / no `createPurchaseOrders` field — POs always-on. | **OTHER (RESOLVED)** | Already resolved by Milos (Round-1 Q5) as an **intended descope** — POs are always created. Not reopened here. | SF-SET-03, SF-COMP-06, SF-QB-02 | Already handled in `milos-answers-mapping.md` (descope): rewrite SF-SET-03; retire SF-COMP-06 / SF-QB-02. No change from this pass. |
| **BUG-2** | Save Settings button always enabled (no dirty-state gating). | **OTHER (RESOLVED)** | Already resolved by Milos (Round-1 Q6) as **nice-to-have, non-blocker**. Not reopened here. | SF-SET-13 | Already handled in `milos-answers-mapping.md` (soften expected). No change from this pass. |

**Summary counts (updated 2026-07-08 after the reconciled V2.4/design batch):**
EXPECTED = **2** (BUG-4, BUG-10) · REAL DEFECT / build-gap = **2** (BUG-11, and
**BUG-3 REVERSED** back to a build-gap because the 07-08 design intends the optional
review note) · OTHER = **6** (BUG-5, BUG-6, BUG-7, BUG-8, BUG-9, plus BUG-1/BUG-2 —
note BUG-1 is now a **build-lag/spec-vs-build gap** under last-update-wins, since V2.4
retains the No-PO path, not an intended descope).

---

## STEP 5 — Proposed case-EXPECTED updates implied by the EXPECTED reclassifications

> For user approval — to be applied to the case JSONs / Excel / TestRail import in
> the **next update batch** (nothing applied yet).

### From BUG-10 (EXPECTED) — cores are line-level, no wizard step
- **SF-CORE-01, SF-CORE-10** (and by extension SF-CORE-02): change EXPECTED from
  "a distinct **Resolve Cores** step in the completion wizard/modal with per-core
  Ok/Not-OK and a live +$-to-invoice running total" → **"Core resolution is a
  line-level control: the cored part generates a Core sub-line with Ok / Not-OK
  and a $ amount on the line's Parts view. The completion wizard has NO distinct
  Resolve-Cores step; a WO whose only remaining action is core resolution
  completes Details → Success."**
- **SF-CORE-03/04/05/07** (special-order / receive-dependent cores): EXPECTED
  wording NOT changed by this reclassification — these remain **blocked by BUG-11**
  (WO-PO receive 500, a real defect) and stay pending the fix.

### From BUG-3 (REVERSED 2026-07-08 → build-gap) — optional review-note field IS intended
- **SF-REV-10:** EXPECTED **restored** to the note-present wording — the dialog shows
  **VIN / Serial # (required)** + an **optional review-note field (`input_review_note`)**;
  a note can be entered and saved with the sign-off. The earlier "no optional
  review-note field" reclassification is **withdrawn** — the 07-08 design bundle
  confirms the note is intended, so the live dialog's missing note is a **build gap**
  (BUG-3, REAL DEFECT/build-gap).

### From BUG-4 (EXPECTED) — sign-off completes directly, no distinct Reviewed state
- **SF-REV-08, SF-REV-11:** change EXPECTED from "Review → **Reviewed** (distinct
  holding state) → separate final Complete Work Order → Complete" → **"After
  Confirm Review the sign-off completes and the WO moves directly Review →
  Complete; there is no distinct 'Reviewed' holding state and no separate final
  Complete Work Order click."**

---

## Cross-references
- Bugs log: `build/simple-flow/bugs-log.md` (BUG-3/4/10 now marked RECLASSIFIED → EXPECTED).
- Milos answers: `build/simple-flow/milos-answers-mapping.md`.
- Remaining PO questions: `build/simple-flow/OpenQuestions-for-Milos-Round2.md` (+ `.xlsx`).
- Principle recorded in `CLAUDE.md` (Simple Flow durable facts) and
  `build/simple-flow/requirements.md` (Interpretation Note).
