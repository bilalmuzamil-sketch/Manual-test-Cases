# Simple Mode — Streamlined Work Order Completion & Receiving (Simple Flow)

> **Project:** Simple Flow (a.k.a. Simple Mode / Express Mode) — ShopView
> **Source spec:** `31240e6d-SimpleMode_StreamlinedWorkOrderCompletionReceiving.doc`
> (Confluence "Save as .doc" = MHTML; parsed via Python `email` + HTML strip).
> **Epic:** SV-7301 · **Owner:** @Milos Vasic
> **Spec status (per doc header):** *Draft for build — V2.3* (line approval → all
> lines must be approved to complete; core-parts resolution in Stories 3/4/8/10/16;
> in sync with Jira SV-7696…SV-7710 + SV-7870 + SV-7876).
> **CURRENT VERSION: V2.6 (spec `_4`, 2026-07-17)** — the V2.3 body below is kept
> for traceability with the V2.4 / `_3` / **`_4` (V2.6)** delta sections appended
> at the end (latest-wins). Complete V2.6 text:
> `spec-v4-2026-07-17/requirements-v4.md`; delta record:
> `spec-v4-2026-07-17/spec-diff-v4-2026-07-17.md`. Headline V2.6 changes: **NEW
> Story 18 — Core Parts (SV-8353, pre-resolve-BEFORE-receive in BOTH flows,
> C-R1..C-R10)** superseding the S3-C1..C4 / S4-C1..C2 / S8-C1..C2 invoice-gate
> core model below; Story 9 Apply button REMOVED; S8-R7 cost editable ONLY when
> $0; S6-R6 rewritten (QB Vendor-Bill-export + Vendors-Expenses exclusion — no
> "needs vendor" report); new S11-R4 / S12-R6 / S13-R8; part-sale POs confirmed
> in scope for Stories 7/8.

---

## COMPLETENESS GAPS (read first)

The **product spec .doc parsed cleanly and appears COMPLETE**: 17 stories
(Story 1–17), each with Summary / Context / Requirements / Acceptance Criteria,
plus Business Case, Feature Overview, Jobs-to-be-Done, Key Decisions,
Cross-System & Data Integrity, Terminology, and Open Questions. No mid-document
truncation was detected (unlike the Fees & Discounts PDF). However, the following
gaps/ambiguities remain and should be resolved with the user before authoring
test cases:

1. **No permissions/role matrix.** §8 Open Questions explicitly lists
   *"Permissions — which roles do completion vs bulk receive vs settings vs
   review"* as UNRESOLVED. Story 11 says "hidden for office/readonly users";
   Story 16 says Mark Reviewed is "manager/foreman only" but the spec flags
   *role-gating review (custom roles vs open for v1)* as an OPEN item. There is
   **no consolidated permission table** (unlike the Custom Roles project). Any
   role-based test cases would be guesses.

2. **Spec-version drift between doc and design.** The .doc header says
   **V2.3**, but BOTH design handoffs (`WO Review Flow - Handoff.md`,
   `Resolve Cores Flow - Handoff.md`) cite **"Spec: Simple Mode V1.4."** Confirm
   which is authoritative.

3. **Default-value conflict (settings) — spec vs design.** The .doc defaults
   (§4, S1) say: **Auto-approve OFF, Create POs ON, Vendor invoice REQUIRED.**
   The design `HANDOFF.md` / Workflow Settings mockup show: **Auto-approve ON,
   Create POs ON, Vendor invoice Optional (default).** These contradict — confirm
   the correct first-use defaults before writing settings/matrix cases.

4. **Require-review toggle not in the shipped settings design.** Spec S1-R4 adds
   "Require review before completion," but the design handoff notes it "lives only
   in the prototype panel" and is NOT yet on the Workflow Settings page. Story 16
   also marks the review DEFAULT and role-gating as ⚠️ Design pending.

5. **Tech-story placement divergence.** Spec S15-R2 (older wording) says tech
   story stays on the line, not in a modal; Story 17 (SV-7876) supersedes this
   with an inline + gate-modal approach. Design handoff flags this as
   "[Confirm]". Treat Story 17 as current, but confirm.

6. **Close-confirm modal design pending.** S15-R4 (close-vs-cancel confirmation)
   is explicitly ⚠️ "Figma still to be added" — no design surface to test yet.

7. **Unanswered §8 open questions** that affect expected results: cost-at-
   completion (avoid $0-cost margins), auto-receive of in-stock inventory on
   simple completion, and whether the **backend enforces** Simple-Flow settings
   (relevant because in Custom Roles we learned BE often only enforces
   resource-level View/Edit; granular gates are front-end only).

8. **Live sources unverified.** The Confluence page and Jira Epic SV-7301 both
   returned **HTTP 403 (blocked)** — we could not confirm the .doc is the latest
   version, nor read individual Jira story bodies/comments/status. Story IDs below
   are recovered from the .doc text only.

9. **Feature is UNDER DEVELOPMENT.** Per design handoffs, several items are "not
   yet built." VIU (verify-in-UI) will be PARTIAL — some surfaces exist, some do
   not. User may supply QA-env (sv7301 POC) cookies later.

---

## INTERPRETATION NOTE — Simple Flow "shortcut" principle (authoring rule)

> **Scope: Simple Flow ONLY.** Simple Flow (Simple Mode) exists to shorten/skip
> legacy multi-step flows so the user reaches the **same end state faster**.
> Therefore, when authoring/verifying expected results:
>
> - Any behavior that reaches the same destination by **SKIPPING** a legacy
>   flow/step is **EXPECTED** — it is NOT a bug and NOT a question for the PO.
> - It is a **DEFECT only** if the skip (a) throws an **ERROR**, or (b) **corrupts
>   data / inventory / Part-History integrity**.
>
> Applied 2026-07-08 (see `finding-reclassification.md`): the completion wizard
> having **no distinct "Resolve Cores" step** (core Ok/Not-Ok is line-level;
> Details→Success) = EXPECTED; review sign-off going **straight Review→Complete**
> with no distinct "Reviewed" holding state = EXPECTED; the Mark-Reviewed dialog
> **omitting the optional review-note field** = EXPECTED (a simplification, still a
> light PO confirm). By contrast, **receiving a WO-originated PO returning HTTP 500
> (BUG-11)** = REAL DEFECT (the skip throws an error). Permission/enforcement
> findings (BE not enforcing completion/review atoms — BUG-6/7/8) and added
> requirements (vendorless part-add requiring a Category — BUG-9) are NOT
> flow-skips; they remain OTHER (question/bug as appropriate).

---

## Story ↔ Jira ID map (recovered from .doc)

| Story | Title | Jira |
|---|---|---|
| 1 | Work Order Settings (Simple Flow) | SV-7696 |
| 2 | Simple Completion — No-PO (Skip) Flow | SV-7697 |
| 3 | Simple Completion — PO On + Optional Vendor Invoice | SV-7698 |
| 4 | Simple Completion — PO On + Required Vendor Invoice | SV-7699 |
| 5 | Add a Vendorless / No-Part-Number Part | SV-7700 |
| 6 | Vendorless Part on the WO PO — "Vendor Missing" + QB flag | SV-7701 |
| 7 | PO Multi-Select + "Receive Selected" | SV-7702 |
| 8 | PO Bulk Receive Page | SV-7703 |
| 9 | Per-Vendor "Apply Invoice to Selected POs" | SV-7704 |
| 10 | Inline Part-Number Fix → First-Class Inventory Part | SV-7705 |
| 11 | Receive Button on Work-Order-Originated POs | SV-7706 |
| 12 | Accept Delivery — multi-vendor + Simple-Flow parts support | SV-7707 |
| 13 | Assign Vendor + Merge / Keep-Separate | SV-7708 |
| 14 | "Waiting on Parts" Column + Receive Shortcut | SV-7709 |
| 15 | UX Refinements — labels, centralized required fields, close confirm | SV-7710 |
| 16 | Simple Completion — Review ON (review gate + sign-off) | SV-7870 |
| 17 | Tech Story Flow — per-line entry + completion gate | SV-7876 |

**17 stories total. Epic = SV-7301.**

---

## 1. Business Case

Completing a work order in ShopView is slow and click-heavy — up to 18+ clicks
from work order to invoice. For shops doing 20–50 WOs/day that is hours of
friction, and it is the top friction point across the customer base.
Single-operator and mobile shops do not need the PO/receiving ceremony but are
forced through it. Parts added without vendor info get stuck. Accountants receive
vendor invoices one PO at a time. The work-order list gives no receiving
visibility. Missing cost at completion produces wrong QuickBooks margins.

Simple Mode cuts completion to 2–3 clicks, configurable per org, without
sacrificing QuickBooks or inventory integrity. **It is not a separate mode or
app** — it makes specific existing steps optional plus a set of pure additions.
At default settings the app behaves exactly as today.

**What we KEEP (not removed):** individual-line Complete; all existing
per-part/per-line receive actions + "received" statuses; a Receive button at the
WO line level. The only receiving change is that a WO's POs are bundled onto the
same shared Accept Delivery / receive page (every receive entry point → that
surface; receive all vendors at once).

**Guiding principles:** (1) Consistency over novelty. (2) Data integrity
non-negotiable (§5). (3) Settings drive behavior; QA tests the matrix.

## 2. Feature Overview (at a glance)

- **Settings** — one Work Order settings page (no Full/Simple mode): Auto-approve
  lines, Create POs (+ Vendor invoice Optional/Required), Require review; plus
  existing Require tech story / mileage / engine hours / Auto-pick inventory.
  First-use defaults preserve today's behavior.
- **Completion** — one Complete Work Order button; three settings-driven flows
  (No-PO / PO+Optional / PO+Required) + a review-on variant; centralized
  required-fields modal; success screen.
- **Vendorless / no-part-number parts** — add with description + qty + sell only;
  on completion they sit on the WO's PO flagged "Vendor Missing" (no dummy PO).
- **Bulk Receive** — new page to receive many POs grouped by vendor; per-vendor
  apply-invoice / expand / receive-all.
- **Vendor-aware receiving** — Receive button on WO-originated POs; the existing
  multi-vendor Accept Delivery screen; assign vendor + merge.
- **Visibility** — Waiting-on-Parts column; Ready-for-Review queue.

## 3. Jobs to be Done

- Shop without POs → complete in one confirm.
- Require vendor invoices → blocked until received.
- Tech hands a part with no number/vendor → still add it.
- Accountant with many POs from one vendor → receive on one page, one invoice #.
- PO with several vendors → receive each on the same screen.
- Foreman → review a completed WO before invoicing.
- Scanning the WO list → see what's waiting on parts or review.

## 4. Key Decisions

- **No operating-mode selector**; behavior driven by individual settings
  (`operatingMode` dropped). No "VIN required" setting.
- **First-use defaults preserve today's behavior:** auto-approve OFF, create POs
  ON, vendor invoice REQUIRED. *(NOTE: design mockups disagree — see gap #3.)*
- **KEEP:** individual-line Complete; existing per-part receive actions/statuses;
  a line-level Receive button; only change = the WO's POs are bundled onto the
  same shared receive page.
- **Line approval — all lines must be approved to complete.** A WO cannot
  complete (or Send to Review) unless every line is approved. Holds regardless of
  Auto-approve: OFF → manual approval; ON → approved on add, but a manually
  unapproved line must be re-approved. An unapproved line surfaces the existing
  "you need to approve the line to complete the work order" error on Complete (no
  new disabled state). Applies across optional/required-invoice flows and the
  review-on variant.
- **No "dummy PO."** A vendorless vendor part goes on the WO's normal PO, flagged
  "Vendor Missing"; unflag once both a vendor and a part number are provided →
  eligible for QuickBooks.
- **Create POs OFF ⇒ no PO at all** — received at request, no catalog/inventory
  sync; type by source field.
- Tech story is its own flow (Story 17).
- **Review (Story 16)** = two-state gate (Review → Reviewed → Complete); CTA
  "Send to Review"; VIN captured by the reviewer; invoicing blocked until
  reviewed.
- Auto-pick inventory off → pick in the completion modal.
- **Vendor invoice:** optional to complete (Story 3 setting), but required to
  receive on any receive surface (Bulk Receive / Accept Delivery), along with
  vendor + part number for vendor-missing / no-PN.
- **Field locking (receive screens):** quantity editable; cost editable (pulled
  from WO/PO); sell editable until the WO is invoiced/paid, then locked with a
  lock icon + tooltip; after lock only cost is editable.
- Part number + vendor mandatory to receive.
- **Accept Delivery is already multi-vendor** (reused, not rebuilt); invoice
  mandatory there. Required-invoice completion routes "Receive Parts" to the
  shared receive page and round-trips back to the completion modal.
- Editing a part number → first-class inventory/catalog part.
- One vendor bill per vendor per receive; merge → one bill, keep-separate → two;
  invoice-# uniqueness relaxed.
- Success screen = WO# + total; invoice number on the Finance step.
- Close-confirm modal: Close = close only; Cancel = close + return to previous
  screen.
- **Core parts.** Resolution gates the money, not completion: inventory cores
  resolved in the completion modal (after Pick); special-order cores at receive
  (required) or the Create Invoice gate (optional, receive-then-resolve). No
  core-engine change; enforced by placement + an invoice-time unresolved-core
  check. See Stories 3/4/8/10/16.

## 5. Cross-System & Data Integrity (QuickBooks + Inventory)

Two QB flows: **Vendor Bill → QBO** (on receive; PO-dependent) ·
**Journal Entry / Inventory → QBO** (on invoice creation; not PO-dependent).

Invariants:
1. In-stock parts decrement inventory on completion — the Simple "skip" path's
   bare status setter emits no events and bypasses inventory movement / Part
   History / catalog creation / Delivery / Vendor Bill, so completion must still
   run the real lifecycle (or route via the WO PO + real receive).
2. POs ON + receiving → full pipeline receive → Delivery → Vendor Bill → QBO;
   both receive surfaces sync the vendor bill (Accept Delivery explicitly;
   `receiveRequestedParts` via the `SpecialPartsGetsReceived` subscriber); only
   complete-simple bypasses everything.
3. Inventory Part History preserved for any part that becomes inventory-tracked.

Accepted by design: Create POs OFF ⇒ no PO/vendor bill/AP sync + no
catalog/inventory sync. Vendorless/no-PN ⇒ zero inventory interaction until a
vendor and/or part number is added. Vendor-missing POs flagged + excluded from QB
until vendor + part number provided.

Build-risk callouts (Story 10): the receive pipeline assumes a valid vendor;
several payload fields are required; a default part category must exist; a
CataloguePart alone is not inventory stock.

## 6. Terminology

- **Simple Mode** — the feature name (a.k.a. Express Mode). Not an operating
  mode/toggle.
- **Vendorless part** — no vendor and possibly no part number; source vendor /
  found.
- **Vendor Missing** — flag on a PO that holds a part with no vendor; excluded
  from QuickBooks until vendor + part number are provided. (No separate "dummy
  PO".)
- **Waiting on Parts** — count of part requests still waiting-to-receive.
- **Review / Reviewed** — WO states between Approved and Complete when review is
  on (Story 16).
- **Core part** — a returnable part carrying a deposit-style charge; resolved as
  returned (no charge) or kept (charge added). Applies to inventory (charge from
  catalog record) and special-order/vendor parts (charge entered manually); never
  to "found" parts.

---

## 7. Requirements (Stories 1–17)

### Story 1: Work Order Settings (Simple Flow) — SV-7696
**Summary.** One Work Order settings page where an owner/admin turns Simple-Flow
options on/off. No "operating mode" (Full/Simple) selector — behavior driven by
individual settings. Shows new Simple-Flow toggles together with existing
work-order settings.
**Context.** Settings → Work Order settings; org-wide; owner/admin only. Drop the
POC's `operatingMode` field.

**New settings:**
- **S1-R1 — Auto-approve lines.** On → every line approved the moment it is added.
  Off → manual approval. Must actually drive approval. **Default OFF.**
  Interaction: completion requires all lines approved.
- **S1-R2 — Create purchase orders.** On → vendor parts generate POs + receiving
  step (today's behavior). Off → no POs created. **Default ON.**
- **S1-R3 — Vendor invoice number** (shown only when Create POs on). Required →
  WO can't complete until parts received + invoice # captured. Optional →
  complete now, receive later. **Default REQUIRED.**
- **S1-R4 — Require review before completion.** On → completing sends WO to a
  separate review/sign-off (Story 16). Off → no review step. Default per cohort.

**Existing settings surfaced (not changed):**
- **S1-R5** Require tech story (drives Story 17). **S1-R6** Require mileage.
  **S1-R7** Require engine hours. **S1-R8** Automatically pick inventory parts
  (off → pick in completion modal). **S1-R9** Save settings — persists org-wide,
  future completions only (never retroactive).

**Defaults on first use:** Auto-approve OFF, Create POs ON, Vendor invoice
REQUIRED; existing settings keep org values.
**Out of scope:** no operating-mode selector; no "VIN required" setting.

**Acceptance Criteria**
- Settings shown in order; new vs existing visually distinct; no operating-mode
  selector anywhere.
- Create POs on → Vendor invoice (Optional/Required) appears with helper text;
  off → hidden + no vendor-invoice capture in completion.
- Auto-approve on → line approved immediately on add; off → manual.
- Existing settings display + persist org's current values.
- First-time defaults: auto-approve OFF, create POs ON, vendor invoice REQUIRED.
- Save persists org-wide; future completions only; non-admin can't see/modify.
- No `requireVin` setting and no `operatingMode` field in the implementation.

### Story 2: Simple Completion — No-PO (Skip) Flow — SV-7697
**Summary.** PO creation off → complete a WO in a single confirm, straight to an
invoice-ready draft. (Review-OFF path; review on → Story 16.)
**Context.** Create POs off; WO has approved lines; user has WO edit access.

**Requirements**
- **S2-R1** A Complete Work Order button next to New Line.
- **S2-R2** Opens a centralized modal collecting existing required fields
  (mileage / engine hours / VIN per existing rules). Tech story via Story 17.
  Auto-pick-off → pick inventory parts here.
- **S2-R3** On confirm: no PO/receive/invoice step; all lines → Completed;
  Reviewed runs in the background.
- **S2-R4** Success screen (WO# + total; Done / Go to Invoice).
- **S2-R5** Go to Invoice → Finance step (invoice number shown there).
- **S2-R6** No PO / vendor bill / AP sync. A vendor/found part is received at
  request time, not synced to catalog/inventory. In-stock parts still decrement
  inventory.

**Acceptance Criteria**
- One-confirm completion → success; lines → Completed; Reviewed in background.
- Missing required fields (or tech story via Story 17) → blocked.
- POs off → no PO/bill/AP-sync + no catalog/inventory sync; in-stock parts
  decrement inventory + Part History.
- Auto-pick off → must pick before Complete.
- Individual-line Complete + per-part receive actions still work.
- Re-open (uncomplete/add a line) → WO returns to Approved; modal summarises
  already-received vs newly-added.

### Story 3: Simple Completion — PO On + Optional Vendor Invoice — SV-7698
**Summary.** Create POs but no invoice upfront: complete from one place — order/
create POs in background, pick parts, then receive now (all vendors at once) or
finish and receive later.
**Context.** Create POs on; Vendor invoice = Optional.

**Requirements (flow order)**
- **S3-R1** Background order + POs on Complete (vendorless part → WO's PO flagged
  Vendor Missing — Story 6).
- **S3-R2** Informational modal: count of parts to receive + inventory-pick
  status. Auto-pick-off → pick here.
- **S3-R3** Required vehicle fields (mileage + VIN + engine hours when missing).
  Tech story separate (Story 17).
- **S3-R4** Actions: Receive parts, Complete without receiving, Cancel.
- **S3-R5** Receive parts → shared Accept Delivery page (receive all vendors at
  once).
- **S3-R6** Complete without receiving → completes WO; unreceived parts stay
  waiting-to-receive (Waiting on Parts column); line still shows Receive button.
- **S3-R7** Cancel → no change; closes modal.
- **S3-R8** Success screen (WO# + total; Go to Invoice / Done).
- **S3-R9** All lines must be approved to complete (reuses existing "approve the
  line" error; CTA stays active; idempotent — no duplicate POs on re-Complete).

**Acceptance Criteria** — see doc; key: background POs + count; pick status;
required fields; receive-all-vendors; complete-without-receiving keeps Receive
button; Cancel idempotent; unapproved-line error; approve-all → proceeds.

**Core parts — ⚠️ SUPERSEDED by Story 18 (SV-8353) per spec `_4` V2.6, 2026-07-17**
*(S3-C1..C4 + the guardrail below are the OLD invoice-gate model, kept for
traceability only. V2.6: special-order cores are PRE-RESOLVED before receiving on
a dedicated resolve screen right before the Receive parts / Complete without
receiving choice; decision persisted on the part request; charge follows the
decision immediately; gates block only UNDECIDED cores; auto-applied at receive.
The "part-sale auto-resolve vs service manual" guardrail sentence was DELETED —
Story 18 is silent on it. See the V2.6 delta section at the end + Story 18 in
`spec-v4-2026-07-17/requirements-v4.md`.)*
- ~~**S3-C1** Inventory cores gated in completion modal after Pick~~ (unchanged in
  substance — now Story 18 C-R7).
- ~~**S3-C2** Special-order cores: completion unchanged (nothing to resolve yet;
  Complete without receiving stays available).~~
- ~~**S3-C3** Invoice shows "Cores pending" flag when unresolved special-order
  cores exist.~~ (V2.6 C-R4: cores_pending reflects UNDECIDED cores only.)
- ~~**S3-C4** Resolve at Create Invoice gate → resolve module routes to receive the
  cored line(s) (core-only partial receive) → resolve Ok/Not OK → invoice
  proceeds. Cancelling leaves WO completed, un-invoiced, cores-pending.~~
- ~~**Guardrail:** invoice gate must detect an unresolved special-order core even
  when it exists only as a PartRequest (no WorkOrderPart yet). Part-sale WOs
  auto-resolve at receive; service WOs need manual Ok/Not OK.~~

### Story 4: Simple Completion — PO On + Required Vendor Invoice — SV-7699
**Summary.** Same one-place completion as Story 3, but WO cannot complete until
all parts received (invoice # captured).
**Context.** Create POs on; Vendor invoice = Required.

**Requirements**
- **S4-R1** Background order + POs (vendorless → WO's PO, Vendor Missing).
- **S4-R2** Parts + pick status in modal (auto-pick-off → pick here).
- **S4-R3** Required vehicle fields (mileage + engine hours, when missing); tech
  story Story 17. *(V2.4 Δ1, applied 2026-07-13: VIN dropped from the required-invoice
  completion modal — VIN is captured by the reviewer in Story 16.)*
- **S4-R4** Actions + gated CTA: Receive parts + Cancel. Primary CTA "Complete
  Work Order" **disabled until all parts received.** No "Complete without
  receiving."
- **S4-R5** Receive parts (round-trip): shared Accept Delivery page (qty, tax,
  date, note, invoice # per vendor). On finish or "Back to Work Order" → return to
  modal; when all received, CTA enables.
- **S4-R6** Cancel → no change.
- **S4-R7** Complete Work Order (enabled once all received) → success screen.
- **S4-R8** All lines must be approved to complete (existing error; separate from
  the required-invoice receive gate).

**Core parts — ⚠️ SUPERSEDED by Story 18 (SV-8353) per spec `_4` V2.6, 2026-07-17**
*(V2.6 C-R6, change-log 2026-07-16: the required-invoice flow now resolves cores
FIRST and then receives — unified with the optional flow. Old resolve-after-the-
receive-round-trip model kept for traceability only.)*
- ~~**S4-C1** Inventory cores gated in completion modal after Pick.~~ (unchanged in
  substance — now Story 18 C-R7.)
- ~~**S4-C2** Special-order cores resolved after the Receive round-trip (gated
  Resolve-cores modal) → Complete → success. (Invoice required, so part is always
  received and core always resolvable.)~~

### Story 5: Add a Vendorless / No-Part-Number Part — SV-7700
**Summary.** Add a part with only description, quantity, sell price.
- **S5-R1** Requestable with description + qty + sell mandatory; part number,
  cost, vendor optional/empty.
- **S5-R2** Type = existing source field — vendor or found (never inventory);
  treated as vendorless downstream.
- **S5-R3** Editable after creation.
- **S5-R4** No part number → zero inventory interaction until a part number is
  added (Story 10). Part number required at receive.

**Acceptance Criteria** — saves as vendorless (source vendor/found); missing
desc/qty/sell → blocked; no-PN part creates no inventory item/Part History;
adding PN/vendor later transitions out of vendorless; can't receive until PN (and
vendor) entered.

### Story 6: Vendorless Part on the WO PO — "Vendor Missing" + QB Flag — SV-7701
**Summary.** A vendor/special-order part with no vendor goes on the WO's normal PO
but flagged "Vendor Missing" and kept out of QuickBooks until a vendor + part
number are provided. No separate dummy PO.
- **S6-R1** No dummy PO — placed on the WO's PO (grouping is existing behavior).
- **S6-R2** "Vendor Missing" indication in PO list + detail, "+N" for multiple
  vendors.
- **S6-R3** Flagged + excluded from QuickBooks sync.
- **S6-R4** Options to resolve: select a vendor (Story 13) + enter/edit part
  number (Story 10).
- **S6-R5** Unflag once both vendor + part number provided → eligible for QB.
- **S6-R6 (REWRITTEN per spec `_4` V2.6, change-log 2026-07-16 — corrected to
  match code):** *Reporting impact (no PO report exists).* There is **no dedicated
  purchase-order report and no "needs vendor" marker** — nothing "marks" these
  POs. A vendor-missing PO's spend is **excluded from the QuickBooks Vendor Bill
  export** (inner-join on vendor) and **not counted in the Vendors Expenses
  report** (grouped by vendor) until a vendor is assigned — then it flows in
  normally. (Separate note: a $0-cost vendor-missing part can skew the Inventory
  report's average cost.) ~~Old V2.3 text: "Reports mark vendor-missing POs as
  'needs vendor'."~~
- **S6-R7** *(V2.4, 2026-07-08)* Orderable from the line (sell-price-only parts) —
  see the V2.4 delta section item 5.

### Story 7: PO Multi-Select + "Receive Selected" — SV-7702
- **S7-R1** Select-all checkbox + per-PO checkboxes on PO list.
- **S7-R2** When any PO selected → bar with "N purchase orders selected", Clear,
  Receive Selected.
- **S7-R3** Receive Selected → PO Bulk Receive page (Story 8) with selected POs.
- **S7-R4** Fulfilled (already-received) POs not selectable.
- **S7-R5** Vendor-missing POs selectable + clearly indicated.
- Select-all toggles only current page/filter POs.

### Story 8: PO Bulk Receive Page — SV-7703
**Summary.** Single page to receive many POs at once, grouped by vendor; reached
via Receive Selected (Story 7). New page (POC prototype exists).
- **S8-R1** "Back to Purchase Orders" (top-left) → PO list.
- **S8-R2** Grouped vendor → POs, with a vendor count.
- **S8-R3** Collapsible POs + per-vendor Expand/Collapse all (each vendor own
  control — not one global).
- **S8-R4** PO row: PO number, related WO (or inventory/no-WO indicator), parts
  count.
- **S8-R5** Selection (nothing selected by default); selecting a PO selects all
  its parts; individual parts selectable; actions locked until checked.
- **S8-R6** Receive parts (N) per-PO button; disabled until vendor invoice number
  entered (and for vendor-missing: vendor assigned + missing PN entered).
- **S8-R7 (UPDATED per spec `_4` V2.6):** Editable + locking: quantity editable
  (supports partial receive); **cost editable ONLY if the cost is $0** ("if cost is
  not 0 cost filed should not be editable"), pulled from WO/PO when available;
  sell editable until WO invoiced/paid, then locked (lock icon + tooltip "Locked —
  this part is already invoiced or paid"); after lock only cost editable. *(⚠️ SPEC
  INCONSISTENCY flagged for Milos: the surviving "after lock only cost editable"
  tail contradicts the new only-if-$0 rule for a non-zero-cost part — Rule 15.5,
  cited not silently resolved.)*
- **S8-R8** Vendor-missing POs: assign a vendor → PO moves into that vendor's
  group; enter missing PN → unflag → receiving enabled.
- **S8-R9 (UPDATED per spec `_4` V2.6):** Set one invoice number across a vendor's
  selected POs (Story 9) — the number is **typed and remembered per PO; no separate
  Apply button**.
- **S8-R10** Receive all — everything selected at once; partial receive supported.
- **S8-R11** Same receive pipeline as single-PO → Delivery → Vendor Bill →
  QuickBooks.
- **Out of scope:** merge/keep-separate (Story 13) — this page only assigns a
  vendor.

**Core parts — ⚠️ SUPERSEDED by Story 18 (SV-8353) per spec `_4` V2.6, 2026-07-17**
*(V2.6 C-R5: a pre-resolved decision AUTO-APPLIES at receive — the user is not
asked again; receive no longer "makes resolution available". Core-only partial
receive retained.)*
- ~~**S8-C1** Once a cored part is received, its Ok/Not OK resolution becomes
  available (consumed by Story 4 round-trip or Story 3 resolve module).~~
- **S8-C2** Support core-only partial receive. *(retained in V2.6)*

### Story 9: Per-Vendor Invoice Number for Selected POs — SV-7704
*(⚠️ UPDATED per spec `_4` V2.6, change-log 2026-07-16: "Apply button removed from
Bulk Invoice — invoice number is typed & remembered, no button." Also S8-R9.)*
- **S9-R1 (V2.6)** Under the vendor name, a field to enter ONE invoice number for
  that vendor's POs, available when ≥1 PO under that vendor is selected. There is
  **no "Apply" button** — the number is remembered as typed.
- **S9-R2 (V2.6)** Select PO(s) and type one invoice number → it is filled into
  only the selected POs of that vendor (still editable per PO). Then Receive all
  for that vendor.
- **S9-R3** Scoped per vendor; does not affect other vendors' / unselected POs.
  Not for the vendorless group (assign a vendor first — the vendorless group shows
  no invoice-number field). Same invoice # may be reused (uniqueness relaxed).

### Story 10: Inline Part-Number Fix → First-Class Inventory Part — SV-7705
- **S10-R1** No-number part shows "Missing part number" + Edit → enter → save
  (persists immediately). Mandatory to receive. Dummy/suggested number reuses
  existing "found" mechanism. Same edit pattern everywhere.
- **S10-R2** Field rules per S8-R7.
- **Negative:** invoiced/paid WO → sell locked, cost editable; can't receive
  without a part number (and a vendor for vendor-missing).
- **AC:** new number → new inventory/catalog part + stock + Part History; existing
  number → links to that item, updates stock + received cost + Part History
  without overwriting description/category.
- **Technical guardrails:** inline endpoint must drive catalog creation/linking +
  inventory stock Part + Part History (not just store a string); vendor required
  before receive; required payload fields + default part category must exist;
  don't rely on complete-simple bypass to create inventory.

### Story 11: Receive Button on Work-Order-Originated POs — SV-7706
- **S11-R1** Add a Receive action on WO-originated POs in both PO list and PO
  detail card (detail card currently hides it — fix), opening Accept Delivery
  directly.
- **S11-R2** Opens the shared Accept Delivery surface (Stories 12–13).
- **S11-R3** Hidden for office/readonly users and fulfilled POs.
- **S11-R4 (NEW per spec `_4` V2.6, change-log 2026-07-15):** *Return to the
  originating line.* After receiving (Receive → Accept Delivery → back to the
  work order), the user is returned to the **exact WO line they received from**
  (scroll/focus preserved), not the top of the WO — for instant visual
  confirmation of the received part. (S3-R5 amended to match.)

### Story 12: Accept Delivery — multi-vendor (existing) + Simple-Flow parts — SV-7707
**Already existing (reuse, do NOT rebuild):** grouped by vendor, multiple vendors
on one PO (each group own invoice # / date / tax / note / Receive); per-item
selection + received-quantity editable with "received more than ordered" warning;
multiple vendors summarized with an indicator.
- **S12-R1** New vendorless/no-PN WO parts (Story 5) + WO-originated POs reached
  via the new Receive button (Story 11) must appear + be receivable here
  (vendor-missing in their own group at the bottom).
- **S12-R2** Receive gates: vendor set, missing PN entered, vendor invoice #
  captured.
- **S12-R3** "+N" vendor indicator; vendor-missing group leads.
- **S12-R4** Each vendor group → own vendor bill → QuickBooks (separate AP
  entries). Partial delivery + post-receipt unchanged.
- **S12-R5** *(V2.4, 2026-07-08)* Editable cost on Accept Delivery (parity with
  Bulk Receive) — cost editable when $0/missing; see the V2.4 delta section item 7.
- **S12-R6 (NEW per spec `_4` V2.6, change-log 2026-07-15):** *Vendorless group
  surfaced when receiving from a WO part.* Clicking Receive on a single WO part
  opens Accept Delivery showing all to-receive parts **for that part's vendor**
  (FE sends the vendor ID; BE returns only that vendor's parts) **plus the
  vendorless group** — so the user can assign a vendor / merge a vendorless part
  into this receive on the spot (reusing the same invoice number) rather than
  going back.

### Story 13: Assign Vendor + Merge / Keep-Separate — SV-7708
- **S13-R1** Vendor-missing group provides a vendor dropdown to assign a vendor at
  PO level (saved locally + backend).
- **S13-R2** Vendor already on this PO → "Add to {vendor}?" → Yes, Merge vs No,
  Keep Separate (two invoice #s for same vendor on one PO is valid).
- **S13-R3** Vendor on another PO for the same WO → prompt to merge the POs (move
  items to target, remove emptied source, redirect to target).
- **S13-R4** Different vendor, no collision → auto-assign + clear QB flag.
- **S13-R5** After assignment, group's Receive enables.
- **S13-R6** *(V2.4 Δ3, added 2026-07-13)* Part number required. If a part number is
  missing, the user gets an indication to enter one; receiving is blocked until it's
  filled.
- **S13-R7** *(V2.4 Δ3, added 2026-07-13)* Cost / sell price required. If cost / sell
  price is missing, the user gets an indication to enter one; receiving is blocked
  until it's filled.
- **S13-R8 (NEW per spec `_4` V2.6, change-log 2026-07-16, from SV-8343):**
  *Vendor & part number stay changeable until receive.* An assigned vendor is
  **not locked on selection** — it stays changeable (same dropdown) **until a part
  is received or the WO is invoiced/paid**, so a wrong pick can be corrected. The
  part number is likewise **editable (edit icon)** after entry, under the same
  condition. Prevents receiving against the wrong vendor.
- **Technical guardrails:** match vendors by ID not name; targeted backend lookup
  for cross-PO match; surface errors; merge scope = same work order. Receiving
  blocked when WO invoiced/paid.

### Story 14: "Waiting on Parts" Column + Receive Shortcut — SV-7709
- **S14-R1** Optional "Waiting on Parts" column (column selector, off by default),
  count of unreceived parts per WO, all statuses.
- **S14-R2** Clicking the count → Accept Delivery for the WO's first unreceived
  PO.
- **S14-R3** Receiving behaves as today. Nothing to receive (incl. POs-off) → "—"
  with no link.

### Story 15: UX Refinements — Labels, Centralized Required Fields, Close Confirm — SV-7710
- **S15-R1** WO primary button reads "Create Work Order".
- **S15-R2** Required fields at completion (mileage / VIN when required) in a
  centralized center modal. Tech story NOT in modal (Story 17).
- **S15-R3** Success screen shows WO# + total (Done / Go to Invoice; invoice # on
  Finance step).
- **S15-R4** Close-confirmation modal: Close = closes modal only, no discard,
  stays on WO (prominent/red); Cancel = closes modal + returns to previous screen
  (text link, far left). ⚠️ **Design pending for close-confirm specifically.**

### Story 16: Simple Completion — Review ON (review gate + sign-off) — SV-7870
**Summary.** When Require review is on, completing sends WO to review; a different
person (manager/foreman) signs off before invoicing. PO/invoice combos unchanged
(Stories 2/3/4).
**Deltas when review ON:**
- **R1** Setting "Require review before completion" (S1-R4).
- **R2** CTA/labels → "Send to Review" ("Complete & Send to Review").
- **R3** Details step collects **mileage + engine hours only**; VIN captured later
  by reviewer in the Mark Reviewed dialog.
- **R4** "Receive Parts" → shared receive page (no inline modal).
- **R5** States: Active(Approved) → [Send to Review] → Review (amber) → [Mark
  Reviewed] → Reviewed (green) → [Complete Work Order] → Complete; status banners
  (amber "Ready for Review", blue "sign-off complete").
- **R6** On Send to Review: lines lock to Complete; inventory auto-picked.
- **R7** Mark Reviewed = manager/foreman only; dialog captures VIN (required if
  missing); Confirm disabled until VIN. Advisor → disabled + "Awaiting review".
  *(V2.4 Δ4, applied 2026-07-13: the "optional note" was removed — dialog is VIN-only.
  FLAG: R10 below still lists the test id `input_review_note` — an internal spec
  inconsistency to confirm on the live build; do not assert the note field exists.)*
- **R8** After sign-off → Reviewed; final Complete Work Order (any role) →
  Complete (invoice-ready). Invoicing blocked until reviewed.
- **R9** Ready for Review list filter/column (reviewer queue).
- **R10** Test ids: `button_mark_reviewed`, `input_review_vin`,
  `input_review_note`, `button_confirm_review`.
- **R11** All lines must be approved to Send to Review (existing error).
- **Core parts (UPDATED per spec `_4` V2.6 — Story 18):** inventory cores resolved
  in completion modal (after Pick) before Send to Review; **special-order cores
  (both required and optional) are pre-resolved before receiving on the resolve
  screen before Send to Review (no longer deferred to the invoice gate).**
  Invoicing blocked until both Reviewed and all cores resolved (gate = undecided
  cores only, C-R4). ~~Old: required → after Receive round-trip; optional → at
  Create Invoice gate after sign-off.~~
- **Open:** setting default (on for bigger/existing shops?); role-gating tied to
  custom roles vs open for v1. ⚠️ Design pending.

### Story 17: Tech Story Flow — per-line entry + completion gate — SV-7876
**Summary.** Capture a tech story per WO line, entered inline and/or gated at
completion. Its own flow, not a step inside the completion modal. Driven by
Require tech story (S1-R5).
- **TS-R1** Inline entry: each WO line has a Story sub-row; empty → "Add tech
  story for this line" link → opens modal at that line.
- **TS-R2** Require tech story on → every line needs a story before completion.
- **TS-R3** Gate at completion: Complete with a line missing a story opens the
  tech-story modal first, then chains into completion. Gate order: tech story →
  parts (pick → receive) → complete/send-to-review.
- **TS-R4** Modal: header "Tech story" + WO# · Customer; per-line card (line #,
  name, Technician); "Line X of N"; required textarea; Next disabled until
  non-empty; Back after line 1; last line = Continue (chained) / Save.
- **TS-R5** Saved stories render inline — green check + text + Edit link.
- **TS-R6** Test id `input_tech_story`.
- **Decision:** entered both inline and via the gate modal — supersedes earlier
  "on-the-line only" wording in S15-R2.

---

## 8. Open Questions (from spec — affect expected results)

- **Core parts** (resolved — see Stories 3/4/8/10/16). Remaining guardrail:
  remove the POC `complete-simple` force-resolve (`changeCoreResolved(true)`).
- **Require-review default** — on for bigger/existing shops? + new-org preset
  (existing orgs keep today's behaviour via backfill).
- **Role-gating review** (manager/foreman) — custom roles vs open for v1.
- **Cost at completion** — allow entering cost at completion to avoid $0-cost
  margins?
- **Auto-receive of in-stock inventory parts on simple completion** — confirm
  intended.
- **BE enforcement of the Simple-Flow settings** — should BE enforce them?
- **Permissions** — which roles do completion vs bulk receive vs settings vs
  review. *(No permission table supplied — see gap #1.)*
  **→ RESOLVED by SV-8183 (see §9 Permissions below).**

---

## 9. Permissions (from SV-8183)

> **Source:** Jira story **SV-8183** — "Permission: Simple Flow — enforcement
> mapping to existing WO / Parts / Settings atoms" (Reporter Milos Vasic, Open,
> 07/Jul/26). Verbatim copy in `SV-8183-permissions-source.md`. **This RESOLVES
> the previously-missing permission open questions.** Mirrors SV-8095 (Digital
> Inspections). Status was **REQUIRES definition → now DEFINED.**

**Core rule:** Simple Flow introduces **NO new permission atom.** Every action
maps to an **existing Custom Roles atom** (SV-7388, merged to develop). The one
NET-NEW rule is behavioural, not an atom: **reviewer ≠ completer** (must be built;
see below).

> **⚠️ CLARIFIED FOR v1 — PO ruling (Milos), 2026-07-10 (relayed by the QA lead):**
> The **reviewer ≠ completer IDENTITY rule is NOT in v1; self-review IS allowed when
> the user's role holds the Mark Reviewed permission (permission-gated only).** In
> plain terms: a user **MAY** Mark Reviewed a work order they completed themselves,
> **provided their role holds the Review Work Orders / Mark Reviewed permission**. Not
> everyone can review — only roles that hold the permission in the matrix can — so the
> rule is **purely PERMISSION-gated, with NO identity restriction**. Origin kept for
> history: the strict same-user identity block came only from **SV-8183**
> acceptance-criteria ("Decision 3 / NET-NEW must be built"); **Story 16 (SV-7870)**
> only ever required a role that holds the permission, which the Review Work Orders
> gate already covers. Milos has now ruled the strict identity block out of v1.
> **Every "reviewer ≠ completer" mention below (§9.1 Mark-Reviewed row, §9.3 NET-NEW
> rule, §10 item 3) is DESCOPED for v1** — the Review Work Orders permission-gating
> stays; only the same-user identity block is dropped. Case impact: SF-PERM-04/07 +
> SF-REV-09 re-adjudicated (identity assertion removed; self-review-by-a-permissioned-role
> explicitly allowed; permission-gating retained & VIU-Verified); **SF-PERM-08 RE-PURPOSED**
> into the POSITIVE case (a permissioned user CAN Mark Reviewed a WO they completed;
> a user without the permission cannot) — no longer obsolete. Origin bug BUG-5 /
> TICKET 1 dropped as expected behavior.

### 9.1 Action → existing atom map

| Simple-Flow action | Story | Gated by (existing atom) |
|---|---|---|
| See/edit the WO Settings page | 1 | **Settings › App Settings** (`settingsApp`). No new gating — new toggles inherit the settings-route guard. |
| Run completion (Active→Complete; Send to Review; Reviewed→Complete) | 2/3/4/16 | **Work Orders: Create & Edit** |
| Approve all lines (hard gate to complete) | all | **WO Lines: Create & Edit + Full View** (Tech View hides Approve) |
| Enter mileage / VIN / engine hours in completion modal | 2/3/4 | **WO Lines: Create & Edit** |
| Tech story per line | 17 | **WO Lines: Create & Edit** |
| Resolve inventory / special-order cores (Ok/Not OK) | 3/4/16 | **WO Lines: Create & Edit** |
| Add a vendorless / no-part-number part (manual sell) | 5 | **WO Lines: Create & Edit + See Financial Data** (sell mandatory, no catalog source) |
| Pick inventory parts in completion modal (auto-pick off) | 2/3/4 | **Pick Parts** (`woPickParts`) |
| Background order + create POs on completion | 3/4/6 | **Order Parts** (`woOrderParts`) → requires See Financial Data |
| Receive on the WO (line Receive button, "Receive parts" → Accept Delivery) | 3/4/11/12 | **FE: Order Parts** (`woOrderParts`). **BE (`ReceiveRequestedParts`): OR of `ROLE_DELIVERY_CREATE_AND_EDIT` / `ROLE_WORK_ORDER_PART_CREATE` / `ROLE_WORK_ORDER_CREATE_AND_EDIT`** |
| Bulk Receive page (accountant, PO-list driven) | 7/8/9 | **Vendor & Order Mgmt: Create & Edit** (route gate `hasPartsPermissions`) **+ See Financial Data** for cost/sell edit |
| Assign vendor to vendor-missing PO / merge / keep-separate | 6/13 | **Vendor & Order Mgmt: Create & Edit** |
| Inline part-number fix → first-class inventory/catalog part | 10 | **Catalog & Inventory: Create & Edit** |
| Cost/sell fields on receive screens (field locking) | 8/10 | **See Financial Data**; sell auto-locks once WO invoiced/paid (**state gate, not a permission**) |
| Mark Reviewed / sign-off; VIN captured by reviewer | 16 | **Review Work Orders** (`woReviewWorkOrders`) **+ reviewer ≠ completer (NET-NEW hard rule)**; VIN entry → WO Lines: Create & Edit |
| Waiting-on-Parts column (visibility) | 14 | **Work Orders: View**; receive click-through suppressed if user lacks the receive gate |
| Go to Invoice / Create Invoice | 2/3/4 | **Invoicing & Payments: Create & Edit + See Financial Data** |

### 9.2 Per-role matrix (from system-role defaults)

| Role | Edit WO settings | Complete WO | Pick | Order/PO | Receive on WO | Bulk Receive | Assign vendor | Fix part # | Add vendorless | Mark Reviewed |
|---|---|---|---|---|---|---|---|---|---|---|
| Admin | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Service Manager | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Senior SA | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Service Advisor | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Foreman | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Technician | No | No (1) | Yes | No | No | No | No | No | No (2) | No |
| Parts Manager | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Parts Tech | No | No (1) | Yes | Yes | Yes | Yes | Yes | Yes | No | No |
| Office | Yes | No (3) | No | No | No | No (4) | No | No | No | No |
| Sales Rep | No | No | No | No | No | No | No | No | No | No |
| Time Clock | No | No | No | No | No | No | No | No | No | No |

1. No completion = Tech View can't approve and/or no WO Create & Edit. Technician
   can still pick; Parts Tech is a receiver, not a completer.
2. Technician has WOL Create & Edit but **no See Financial Data** → cannot enter
   mandatory sell → cannot add a vendorless part (Decision 4).
3. Office has **WO: View only** → configures Simple Flow but cannot operate it.
4. Office has **Vendor & Order Mgmt: View only** → can open Bulk Receive but
   cannot receive.

Custom roles combine atoms freely (e.g. Technician + Order Parts + Vendor & Order
Mgmt C&E = "tech who also receives"; leave Review Work Orders ON only for
manager/foreman for a stricter reviewer).

### Resulting per-role behavior (derived from the system-role matrix)

> **Authoritative per-role behavior table** (re-added 2026-07-10 from
> `SV-8183-permissions-source.md`). Under last-update-wins this is the latest
> authoritative input for per-role behavior. **Reconciliation vs §9.2:** this table
> matches §9.2 above cell-for-cell — **no conflicts / no deltas** (both are the same
> SV-8183 system-role matrix). Kept here under its canonical SV-8183 title for
> traceability.

| Role | Edit WO settings | Complete WO | Pick | Order/PO | Receive on WO | Bulk Receive | Assign vendor | Fix part # | Add vendorless part | Mark Reviewed |
|---|---|---|---|---|---|---|---|---|---|---|
| Admin | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Service Manager | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Senior SA | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Service Advisor | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Foreman | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Technician | No | No (1) | Yes | No | No | No | No | No | No (2) | No |
| Parts Manager | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Parts Tech | No | No (1) | Yes | Yes | Yes | Yes | Yes | Yes | No | No |
| Office | Yes | No (3) | No | No | No | No (4) | No | No | No | No |
| Sales Rep | No | No | No | No | No | No | No | No | No | No |
| Time Clock | No | No | No | No | No | No | No | No | No | No |

**Footnote definitions (verbatim from SV-8183):**

1. **No completion** = Tech View can't approve lines and/or no WO: Create & Edit.
   Technician can still pick; Parts Tech is a receiver, not a completer.
2. Technician has WOL Create & Edit but **no See Financial Data**, so cannot enter
   the mandatory sell price → cannot add a vendorless part (**Decision 4**).
3. Office has **WO: View only** → configures Simple Flow but cannot operate it.
4. Office has **Vendor & Order Mgmt: View only** → can open Bulk Receive but
   cannot receive.

### 9.3 NEW vs REUSED permissions

- **NEW permission atoms introduced: NONE.** All actions reuse existing Custom
  Roles atoms (`settingsApp`, `workOrdersCreateAndEdit`,
  `workOrderLinesCreateAndEdit`, `woFullViewMode`/`woTechViewMode`, `woPickParts`,
  `woOrderParts`, `seeFinancialData`, Vendor & Order Mgmt C&E, Catalog & Inventory
  C&E, `woReviewWorkOrders`, Invoicing & Payments C&E, Work Orders: View).
- **One NET-NEW behavioural rule (not an atom, must be built):** **reviewer ≠
  completer** — stamp `sentToReviewBy`/`completedBy`; block Mark Reviewed for the
  user who completed / sent-to-review.

### 9.4 Backend-ENFORCED vs FRONT-END gate (per SV-8183)

- **BE ENFORCES** the Simple-Flow settings AND the permission atoms — **not
  FE-only** (AC: "BE enforces the Simple-Flow settings and the permission atoms").
  *(This is a change from the Custom Roles finding that granular gates were
  FE-only. Note the atom-collapse caveat below.)*
- **BE atom collapse (caveat):** `woOrderParts`, `workOrderLinesCreateAndEdit`,
  `woFullViewMode`, `woTechViewMode`, `workOrdersCreateAndEdit` all resolve to the
  same BE pair `ROLE_WORK_ORDER::VIEW + CREATE_AND_EDIT` and are indistinguishable
  server-side. So **any role with WO Create & Edit can receive onto a WO** — a
  deliberate, spec-sanctioned low-privilege trade-off (SV-7864). FE distinctions
  (Order Parts vs Full/Tech View) are **conveniences, not BE-enforceable
  boundaries.**
- **Receive-on-WO** specifically: **FE gate = Order Parts**; **BE gate = OR of
  `ROLE_DELIVERY_CREATE_AND_EDIT` / `ROLE_WORK_ORDER_PART_CREATE` /
  `ROLE_WORK_ORDER_CREATE_AND_EDIT`.**
- **State (not permission) gates:** sell field auto-locks once WO invoiced/paid.

---

## 10. Spec updates (from SV-8183)

> Deltas SV-8183 introduces vs our current requirements extract (V2.3). Recorded
> for the case-update proposal (STEP 5) — cases NOT yet rewritten.

1. **Permissions open questions RESOLVED (§8 → §9).** All four "which roles do
   completion / bulk receive / settings / review" items are now answered by the
   atom map + role matrix. Affects **SF-PERM-01..07, SF-RCV-03, SF-REV-09**.

2. **Vendorless part now has a financial gate (NEW rule).** Adding a vendorless /
   no-PN part (Story 5) requires **WO Lines: Create & Edit + See Financial Data**
   (sell is mandatory, no catalog source). Normal catalogued part-adds do NOT
   require financial visibility. Also resolves the §8 "cost at completion"
   question (Decision 4). Affects **SF-VPART-01/02, SF-QB-06**.

3. **Review sign-off gating DEFINED + NET-NEW reviewer≠completer rule.** Mark
   Reviewed requires **Review Work Orders** atom (not "open for v1"); PLUS a hard
   rule that the reviewer cannot be the person who completed / sent-to-review.
   Affects **SF-REV-06/09, SF-PERM-04/07, SF-VAL-07**. Implies a NEW case for the
   reviewer≠completer block.

4. **BE enforcement answered: BE DOES enforce** settings + atoms (with the
   atom-collapse caveat). Affects **SF-PERM-06** (expected can now be stated, not
   left open).

5. **"office/readonly" resolved to concrete atoms.** Story 11 "hidden for
   office/readonly" = **Office role (WO View-only / Vendor & Order View-only)**
   and any role lacking **Order Parts**. Affects **SF-RCV-03, SF-PERM-05**.

6. **Settings-editor roles named.** Story 1 "owner/admin only" = any role with
   **App Settings ON** — system defaults **Admin, Service Manager, Office** (note:
   Office CAN edit settings but cannot operate the flow). Affects **SF-SET-11,
   SF-PERM-01**.

7. **Confirms `operatingMode` must be dropped (drift).** SV-8183 flags the POC
   branch still renders the Full/Simple `operatingMode` selector; V2.3 says drop
   it. Reinforces **SF-SET-02, SF-SET-12** (no operating-mode selector / field).

8. **`settingsIntegrations` gap (track).** Permission catalog seeds
   `[app, service, parts, finance, dataImport, wages]` — no `settingsIntegrations`
   though Custom Roles lists Integrations. Tracked for Custom Roles; note only for
   Simple Flow.

9. **Unguarded feature-flags route (track).** The feature-flags admin route has no
   permission guard. Informational — out of Simple Flow case scope.

**NOT contradicted by SV-8183** (our other open items stand): the settings-default
conflict (gap #3, auto-approve/create-POs/vendor-invoice defaults) is NOT
addressed here; the four VIU deviations (missing Create-POs toggle, always-enabled
Save, missing review note, review→Complete jump) are NOT addressed here; design
V1.4-vs-spec-V2.3 drift is NOT addressed. Those remain open.

---

## Spec update (from `dffd85b6-…CompletionBulkReceiving.doc`, 2026-07-08, V2.4)

> **The V2.3 body above is kept intact for traceability.** This section captures
> the deltas the updated doc introduces. Version **V2.3 → V2.4**; title changed
> **"…Completion & Receiving" → "…Completion & Bulk Receiving."** Full delta table
> + case-impact proposal in `spec-change-diff.md`; readable verbatim copy in
> `spec-current-source.md`. V2.4 = V2.3 **plus** the doc's 2026-07-08 change-log
> batch (below). Cases are **NOT yet rewritten**.

**V2.4 status line (verbatim-in-substance):** *Draft for build — V2.4 (line
approval = all must be approved; sell-price mandatory at save + orderable-from-line;
editable cost on Accept-Delivery; core resolution in Stories 3/4/8/10/16; in sync
with Jira SV-7696…SV-7710 + SV-7870 + SV-7876).*

**New/changed content (substance):**

1. **§4 Key Decisions — new decision.** *Sell price is the only mandatory
   financial field to add a part* (enforced **at save**; cost never mandatory —
   edited later on the PO/receive). A **sell-price-only part** (missing vendor
   and/or cost) is **orderable from the line** — the Order action creates the
   Vendor-Missing PO and moves it to **waiting-to-receive**, so it never sits stuck
   in "requested" with nothing to receive.

2. **Story 3, S3-R1 (strengthened) — order-before-receive.** On Complete,
   **actually order all approved-line parts** and create POs in the background
   (vendorless **/ sell-price-only** part → WO's PO flagged Vendor Missing).
   **Parts must reach waiting-to-receive** so "Receive parts" always has something
   to receive — a part left in **requested** must never be routed to an empty
   receive screen. (New AC bullet to match.)

3. **Story 4, S4-R1 (added).** A **sell-price-only part (missing vendor and/or
   cost) is ordered too → waiting-to-receive** (Story 6, S6-R7); parts must not
   remain in "requested" with nothing to receive.

4. **Story 5, S5-R1 (changed) — sell price validated AT SAVE.** The part **cannot
   be saved/closed without a sell price (inline error), not deferred to
   completion.** (AC: "missing description/quantity/sell price → blocked **inline
   at save**, not deferred to completion.")
   *NOTE — VIU conflict:* the live build does **not** enforce sell-at-save and
   instead requires **Category** (SF-VPART-02 / BUG-9 / round-2 Q4).

5. **Story 6, S6-R7 (NEW).** *Orderable from the line (sell-price-only parts).* A
   part with a sell price but no cost and/or vendor can be **ordered from the
   line's Order action** — creating/joining the WO's Vendor-Missing PO and moving
   it **requested → waiting-to-receive** (same order path as completion, not
   completion-only). At receive, vendor + part number still required (cost editable
   — Story 10). (New AC bullet.)

6. **Story 10 (restructured).** S10-R1 unchanged (PN mandatory to receive).
   **~~NEW S10-R2 (promoted from AC to requirement)~~ — REVERSED/DEPRECATED per spec
   `_3` (2026-07-14, last-update-wins; QA-lead ruling 2026-07-14):** the earlier V2.4
   promotion of "when a PN is added the part becomes a **first-class
   inventory/catalog part** (existing number links / new number creates)" is
   **struck through in spec `_3` and is NO LONGER a v1 requirement.** Only S10-R1 (PN
   mandatory to receive) and S10-R3 (field rules) remain in force. Cases rescoped
   accordingly: SF-PNFIX-02 (C29364), SF-PNFIX-03 (C29365), SF-PNFIX-06 (C29368),
   SF-QB-08 (C29433) — the first-class-part / catalog-inventory-creation assertions
   were removed; PN-persists + part-becomes-receivable retained. *(Doc inconsistency
   flagged: `_3` leaves the Story-10 AC bullets + "Technical guardrails" paragraph
   still describing first-class-part creation while R2 itself is struck — flagged for
   spec cleanup.)*
   **S10-R3 (UPDATED):** field rules apply on **BOTH the Bulk Receive page AND the
   single / Accept-Delivery receive screen — parity**; cost is **editable when
   $0 / missing on either receive surface**; sell editable until WO invoiced/paid
   then locked (lock icon + tooltip); after lock only cost editable.

7. **Story 12, S12-R5 (NEW) — editable cost on Accept Delivery (parity).** On the
   Accept-Delivery screen, **cost is editable when $0/missing** (pulled from WO/PO
   when available) — matching Story 8 (S8-R7)/Story 10. Quantity stays editable;
   the **sell-price lock rule is unchanged**. (New AC bullet.)

8. **§8 Open Questions — new item: Part Sales impact (investigation — BE).** The
   shared order/status logic (requested → orderable/waiting-to-receive; PO-on-order
   without vendor/cost) may touch **Part Sales** (reuses the same endpoint/screen,
   but has no "complete without receiving"). Keep Part Sales **unchanged unless the
   shared logic forces a change** — confirm and report.

9. **§9 Change Log** now embedded in the doc (2026-07-03…2026-07-08 entries).

**Deltas that DID NOT change (spec still shows OLD behavior — the doc lags Milos's
Google-sheet answers):**
- **Require-review default** — S1-R4 still "Default **per cohort** (see §8)" and §8
  still asks the cohort question. Milos's round-1 answer ("ON for all orgs") is
  **NOT** reflected in V2.4. Our SF-REV-15 / SF-SET-14 rewrite is answer-backed
  only, not spec-backed — confirm before applying.
- **No-PO path / POs always ON** — V2.4 **still fully documents** Story 2 (No-PO),
  S1-R2 "Off → no POs / Default ON", and §4 "Create POs OFF ⇒ no PO at all."
  Milos's round-1 answer ("we removed PO OFF, always have a PO") is **contradicted**
  by the V2.4 text. **Do NOT retire SF-COMP-06 / SF-QB-02 or rewrite SF-SET-03**
  on the answer alone until Milos reconciles the doc.

**Round-2 questions after V2.4:** only **Q4** partially resolved (sell price now
mandatory at save; Category half still open). Q1, Q2, Q3, Q5 remain open.

---

## Δ1–Δ4 applied 2026-07-13 (previously recorded as pending)

The four V2.4 deltas catalogued in `spec-diff-2026-07-13.md` (a byte-identical
re-delivery of the 2026-07-10 silent V2.4 revision) are now **APPLIED** to this
spec body and to `cases/*.json`, and pushed to TestRail:

- **Δ1 — VIN dropped from the Story-4 completion modal (S4-R3).** S4-R3 above now
  reads "mileage + engine hours (when missing)"; VIN is captured by the reviewer
  (Story 16). Story 3 (S3-R3) and Story 15 (S15-R2) **retain** VIN for the review-off
  completion modal — VIN was not over-removed. Cases: SF-COMP-16, SF-VAL-02
  (SF-UX-02 / SF-REV-03 already spec-accurate, no change).
- **Δ2 — Story-4 unapproved line = Complete button DISABLED + tooltip (S4-R8),
  Story 4 ONLY.** Stories 2/3 (S3-R9) and Story 16 (R11) keep the error-toast /
  active-CTA model. Cases: SF-COMP-21, SF-COMP-22, SF-VAL-11 (SF-REV-13 unchanged).
- **Δ3 — new receive-time gates S13-R6 (part number) + S13-R7 (cost / sell price)**
  added to Story 13 above. Cases: SF-VEND-04, SF-VAL-06, SF-RCV-06, SF-PNFIX-05 +
  **new case SF-VEND-06** (dedicated S13-R7 cost/sell receive gate).
- **Δ4 — Mark-Reviewed "optional note" removed (R7).** R7 above is now VIN-only.
  Cases SF-REV-06 / SF-REV-10 were already note-free (Milos Round-2, 2026-07-09) so
  no case-content change was needed — V2.4 2026-07-13 confirms the removal. **FLAG:**
  R10 still lists the test id `input_review_note` — internal spec inconsistency,
  recorded as a case flag, not asserted; confirm on the live build during re-VIU.

Every case whose expected behaviour changed carries
`viu_status: "Pending / Retest — expected changed by V2.4 Δ (2026-07-13), needs
live re-VIU"` + `fresh_run: 2026-07-13`; the wording + VIU pass is the next task.

---

## Spec update `_4` (2026-07-17 upload, V2.6) — Δ8–Δ16 APPLIED

> Source: `652f5198-SimpleMode_StreamlinedWorkOrderCompletionBulkReceiving_4.doc`
> (2026-07-17). Complete decoded V2.6 text: `spec-v4-2026-07-17/requirements-v4.md`;
> full delta analysis + case-impact plan: `spec-v4-2026-07-17/spec-diff-v4-2026-07-17.md`.
> The design bundle re-shared the same day is CONTENT-IDENTICAL to design `_4`
> (135/135 files md5-match — `spec-v4-2026-07-17/design-new-notes.md`). Δ1–Δ7
> (V2.4 + `_3`) all remain in force. Change-log rows: 2026-07-15 ×2 + 2026-07-16 ×2,
> all @Milos Vasic. Applied to `cases/*.json` + TestRail 2026-07-17.

### Δ8 — NEW Story 18: Core Parts — Resolution Across Simple Completion (pre-receive + receive-time) — SV-8353

**Canonical core spec; Stories 3/4/8/10/16 point here.** No change to the core
engine's OK/Not-OK outcomes — only when/where the decision is captured, plus a
persisted decision on the un-received request. Supersedes the S3-C1..C4 /
S4-C1..C2 / S8-C1..C2 invoice-gate model (marked inline above, 2026-07-17).

*Optional vendor invoice — resolve cores BEFORE receiving (NEW):*
- **C-R1 — Dedicated resolve screen.** Right before the **Complete without
  receiving / Receive parts** choice, a separate consolidated screen lists every
  un-received vendor core (part info + core charge + **OK / Not OK**), with a
  message that resolving now is for **invoice accuracy**.
- **C-R2 — Decision persisted on the request.** Saved on the core
  `work_order_part_request` (`core_resolution = ok | not_ok | NULL`) — no
  WorkOrderPart, statement item, or vendor return created at this point.
- **C-R3 — Charge follows the decision immediately.** Not OK → core charge priced
  into the WO total → customer invoice; OK → no charge (vendor core return created
  automatically at receive).
- **C-R4 — Gates use the decision.** Completion and invoice creation are blocked
  **only for undecided (NULL) cores**; `cores_pending` reflects this.
- **C-R5 — Auto-apply at receive.** The saved decision is applied automatically at
  receive — the user is **not asked again** (Not OK → core created already
  resolved, no return; OK → existing Core-OK: resolve + vendor PartReturnRequest).

*Mandatory vendor invoice:*
- **C-R6 (2026-07-16)** — resolve-before-receive in BOTH flows: the mandatory flow
  now asks the user to **resolve, and then to receive**, consistent with the
  optional flow.

*Inventory cores (both flows, unchanged):*
- **C-R7** — resolved as soon as parts are auto-picked (or picked manually), on
  the same step. Identical in both flows.

*Receive-time quantity rule (invoice accuracy):*
- **C-R8** — When the WO is **invoiced/paid**, the receive dialog **locks quantity
  to the full remaining amount** (core auto-selected; tooltip "This part is on a
  customer invoice and should be received in full"). Before invoice, quantity
  stays editable. **FE-only lock** (invoice is a frozen snapshot; accepted
  WO-total-vs-invoice drift).

*Read models / status:*
- **C-R9** — Lines tab shows the decision before and after receive: NULL → "Core
  decision pending"; ok → "Core OK — return to vendor, no charge"; not_ok → "Core
  Not OK — customer charged". No duplicate prompts; received pre-resolved cores
  show the resolved state with no OK/Not-OK buttons.
- **C-R10 — Sync-back.** Resolving a received core via the existing handle-core(s)
  endpoints also writes the value to the linked core PartRequest.

*AC extras:* pre-resolve via `POST /api/work-orders/{id}/pre-resolve-cores`
(mirrors handle-cores); at receive OK → exactly one vendor return, retries create
no duplicates, invoice never changes at receive; **resolution cannot change after
the WO has an active invoice.** *Out of scope:* BE mutation-locking of invoiced
parts; BE full-quantity receive enforcement (FE-only by decision); any core-engine
change.

**Cases:** reworded SF-CORE-03/04/07/08, SF-BULK-10, SF-REV-14, SF-COMP-11/14;
NEW SF-CORE-11..17 (UI, section "Core parts — Pre-Resolve (Story 18)") +
SF-CORE-18/19 (API, section "API — Core Pre-Resolve (Story 18)");
RETIRE-PROPOSED (awaiting user ruling, TestRail untouched): SF-CORE-05/06
(invoice-gate module gone) + SF-CORE-09 (guardrail sentence deleted; spec silent).

### Δ9 — S11-R4 return to the originating WO line after receive (merged inline above; + S3-R5 amendment). NEW case SF-RCV-11.

### Δ10 — S12-R6 vendorless group surfaced when receiving a single WO part (merged inline above). NEW cases SF-RCV-12/13. Does NOT resolve the SF-RCV-05/07 group-position deviation (Milos Round-3 ruling stands).

### Δ11 — S13-R8 vendor & part number changeable until receive / invoiced-paid (SV-8343; merged inline above). NEW cases SF-VEND-07/08.

### Δ12 — S6-R6 REWRITTEN (merged inline above): no PO report / no "needs vendor" marker exists; vendor-missing spend excluded from the QB Vendor Bill export + Vendors Expenses report until a vendor is assigned (verified in VendorBillExportQueryHandler / VendorsExpensesQueryHandler; SV-7701 updated). **Legitimizes the SF-VMIS-06 deviation → rescoped, Deviation resolved; dev-route item dropped.**

### Δ13 — Story 9 / S8-R9: the Apply button is REMOVED (merged inline above) — the invoice number is typed & remembered; vendorless group shows no invoice-number field. Cases SF-INV-01/02/03 reworded → VIU-Pending (old-build 'Apply to selected POs' label was live-confirmed 2026-07-13; expect a build deviation until dev ships).

### Δ14 — S8-R7: cost editable ONLY when $0 (merged inline above; ⚠️ tail inconsistency flagged for Milos). Case SF-BULK-06 reworded → VIU-Pending.

### Δ15 — Part-sale POs CONFIRMED in scope for Stories 7/8 (§8 "Part Sales — confirmed (Jul 14)"; new S7/S8 AC bullets). Resolves the §8 investigation open question → SF-QB-09 rescoped to the residual status-transition regression check (now in TestRail); NEW cases SF-POSEL-07, SF-BULK-11, SF-WOP-04.

### Δ16 — Header V2.4 → V2.6 (finally matches content; never trust the version string regardless).

**NOT changed by `_4` (checked, byte-identical to `_3`):** §9/SV-8183 permissions,
Story 1 settings, Stories 2/5/14/15/17, S12-R1..R4, S13-R1..R7, Story 16 R1–R13,
the S12-R1(bottom)-vs-S12-R3(leads) self-contradiction (Milos Round-3 split ruling
STANDS; SF-RCV-05/07 stay Deviation), the Story-10 Δ7 residue, and the 5
awaiting-Milos questions (SF-SET-08 / SF-COMP-06 / SF-REV-11 / SF-UX-04 / SF-QB-02
— none answered).
