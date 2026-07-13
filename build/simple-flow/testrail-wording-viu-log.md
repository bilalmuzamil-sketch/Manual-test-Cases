# Simple Flow — Build-Accurate Wording + VIU Pass — Audit Log (2026-07-13)

> Per-case audit for the combined build-accurate-wording + VIU pass on sv7301
> (QA-lead authorized F&D-style flow, incl. TestRail `update_case` pushes). Method:
> `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`. Live labels →
> `wording-glossary-2026-07-13.md`; screenshots → `screenshots/wording-2026-07-13/`.
> TestRail: curl `update_case` only, Basic auth from `/tmp` (never committed),
> GET→diff→update-changed→re-verify. One row per case; one summary line per area.

Columns: **SF-ID · C# · viu_status · wording change · TestRail push**

---

## Area SF-SET — Work Order Settings — TESTER-READY ✅

Labels captured live 2026-07-13 (`SET-workorders-tab.png`): 7 toggles + exact helper
text; no Full/Simple mode selector; no Create-Purchase-Orders toggle; no Require-VIN
toggle; flat list (no visual new/existing distinction). API VIU: save-persist
round-trip 200 + restored; tech settings save 403 (admin 200); model has no
operatingMode/requireVin/createPurchaseOrders.

| SF-ID | C# | viu_status | Wording change | TestRail push |
|---|---|---|---|---|
| SF-SET-01 | C29275 | VIU-Verified | Title corrected (dropped "new vs existing visually distinct" — not in build); expected now lists exact 7 toggles + flat-list note | updated 200/OK |
| SF-SET-02 | C29276 | VIU-Verified | Steps/expected to exact "Full vs Simple" / "Require VIN" build terms | updated 200/OK |
| SF-SET-03 | C29277 | **Deviation** | Rewrote to plain terms; toggle confirmed ABSENT in build (build lags V2.4 S1-R2) | updated 200/OK |
| SF-SET-04 | C29278 | VIU-Verified | Helper text now exact verbatim (dropped "approximately") | updated 200/OK |
| SF-SET-05 | C29279 | VIU-Verified | (tester fields unchanged) helper text re-confirmed; behavior per prior line-drive | no-op |
| SF-SET-06 | C29280 | VIU-Verified | (tester fields unchanged) helper text re-confirmed; behavior per prior line-drive | no-op |
| SF-SET-07 | C29281 | VIU-Verified | Steps/expected to exact toggle names + settings keys | updated 200/OK |
| SF-SET-08 | C29282 | **Blocked-Env** | Expected clarified; non-seedable brand-new org (first-use defaults not observable) | updated 200/OK |
| SF-SET-09 | C29283 | VIU-Verified | (tester fields unchanged) save-persist re-driven live 200 + restored | no-op |
| SF-SET-10 | C29284 | **VIU-Pending** | (tester fields unchanged) needs two-completion drive; not driven this run | no-op |
| SF-SET-11 | C29285 | VIU-Verified | Steps/expected to exact roles + 403 | updated 200/OK |
| SF-SET-12 | C29286 | VIU-Verified | (tester fields unchanged) model keys re-verified live | updated 200/OK |
| SF-SET-13 | C29287 | VIU-Verified | Expected: Save Settings always-enabled acceptable (Milos Q6) | updated 200/OK |
| SF-SET-14 | C29288 | VIU-Verified | Expected to exact "Complete & Send to Review" relabel | updated 200/OK |
| SF-SET-15 | C29289 | VIU-Verified | Expected to plain helper-text-present wording | updated 200/OK |

**SF-SET summary:** 15 cases · VIU-Verified 12 · Deviation 1 (SF-SET-03 Create-POs
toggle absent) · Blocked-Env 1 (SF-SET-08 brand-new org non-seedable) · VIU-Pending 1
(SF-SET-10 future-completions drive). TestRail: **13 updated + 2 no-op, all 200/OK,
0 errors.** All tester-facing wording matches the live build. **TESTER-READY.**

---

## Area SF-COMP — Work Order Completion — TESTER-READY (wording) ✅ · 3 delta behaviors VIU-Pending

Completion surface captured live 2026-07-13 (`COMP-A-*`, `COMP-B-*`): drove
S2-15795 and S2-15825 to the Success screen (labor-only / no-receive path) —
confirmed exact labels: WO Lines toolbar `New Line` + `Complete Work Order`;
modal title `Complete Work Order`; Success `Order complete` / `Sent to Finance as
an invoice-ready draft` / `Invoice total $434.95` / `Done` / `Go To Invoice`;
line-level `Receive`; vehicle `VIN/Serial #` `Mileage` `Engine Hours`
`License Plate` + `Valid VIN Required` chip. Case wording already matched these
labels — no label corrections needed for the non-delta cases.

- **Surface-confirmed live this run:** SF-COMP-01/02/03/04/10/17 (C29290-93, C29299, C29306).
- **Behavior per documented prior VIU drives (surface re-confirmed):** SF-COMP-05,07,08,09,11,12,13,14,15,18,19,20,23.
- **SF-COMP-06 → Blocked-Env** (C29295, UPDATED): No-PO completion path unreachable — the 'Create Purchase Orders' toggle is absent from the build (see SF-SET-03); cannot set Create POs OFF.
- **Delta cases (V2.4 Δ1/Δ2 wording applied; tester-facing story-ref jargon stripped):**
  - SF-COMP-16 (C29305, UPDATED) → **VIU-Pending** — needs Require Mileage+Engine Hours ON + a WO missing those; not driven (settings churn on shared env).
  - SF-COMP-21 (C29310, UPDATED) → **VIU-Pending** — needs Require Vendor Invoice Number ON + Auto-approve OFF + a Needs-Approval line.
  - SF-COMP-22 (C29311, UPDATED) → **VIU-Pending** — needs Require Vendor Invoice Number ON + Auto-approve ON + a manually un-approved line.
- SF-COMP-18 (C29307, UPDATED) — synced the sell-price-only expected clause.

**SF-COMP summary:** 23 cases · VIU-Verified 19 · VIU-Pending 3 (delta behaviors)
· Blocked-Env 1 (SF-COMP-06). TestRail: **5 updated + 18 no-op, all 200/OK, 0
errors.** Wording tester-ready; the 3 delta behaviors need a dedicated
settings-managed drive on a confirmed-idle shared env.
**Shared-env note:** completed disposable approved WOs S2-15795 and S2-15825 during
surface capture (labor-only; harmless — reopenable by adding a line). Require Vendor
Invoice Number toggled ON then RESTORED to OFF (baseline verified).

---

## Area SF-PERM — Permissions — TESTER-READY ✅

Roles & Permissions page captured live 2026-07-13 (`PERM-roles-list.png`): route
`/administration/roles-permissions`; columns Role Name / Description / Template /
Role Type / Users / Action; `Create Custom Role` button; exact system-role
descriptions recorded in the glossary. All per-role expectations re-verified against
the fresh live roles matrix `roles-matrix-2026-07-13.md` (no system-role drift);
settings BE atom re-driven live (Technician settings save 403, Admin 200).

| SF-ID | C# | viu_status | Note | TestRail push |
|---|---|---|---|---|
| SF-PERM-01 | C29405 | VIU-Verified | settings gate 403/200 re-driven live | no-op |
| SF-PERM-02 | C29406 | VIU-Verified | complete-WO role set vs matrix | updated 200/OK |
| SF-PERM-03 | C29407 | VIU-Verified | Bulk Receive role set vs matrix | updated 200/OK |
| SF-PERM-04 | C29408 | VIU-Verified | Mark Reviewed gate + self-review allowed | updated 200/OK |
| SF-PERM-05 | C29409 | VIU-Verified | PO Receive = Order Parts; Office none | updated 200/OK |
| SF-PERM-06 | C29410 | VIU-Verified | stripped backend enum jargon; 'app blocks / backend allows' plainized | updated 200/OK |
| SF-PERM-07 | C29411 | VIU-Verified | review sign-off gate + self-review | updated 200/OK |
| SF-PERM-08 | C29412 | VIU-Verified | positive self-review case | updated 200/OK |
| SF-PERM-09 | C29413 | VIU-Verified | Tech lacks See Financial Data | updated 200/OK |
| SF-PERM-10 | C29414 | VIU-Verified | 11-role completion matrix = matrix exactly | updated 200/OK |

**SF-PERM summary:** 10 cases · all VIU-Verified. TestRail: **9 updated + 1 no-op,
all 200/OK, 0 errors.** All role expectations match the fresh 2026-07-13 roles
matrix; SF-PERM-06 backend-enum jargon cleaned to layman/API-appropriate wording.
FLAG: exact per-permission editor labels (inside a role's detail) not re-captured
this pass — wording uses standard ShopView permission names. **TESTER-READY.**

---

## Area SF-REV — Review sign-off (Story 16) — TESTER-READY ✅ · 3 pending (non-seedable/invoicing)

Drove S2-15823 live 2026-07-13 with Require Review ON (flipped then RESTORED
byte-identical). Confirmed: ready-WO toolbar button **`Send To Review`** (replaces
`Complete Work Order`); status → **`Review`** + **`Ready for Review`** indicator;
**`Mark Reviewed`** button; Mark Reviewed with VIN present → **Review → Complete
directly** (no holding state). Part-bearing WOs keep `Complete Work Order` → wizard.

**Notable build correction:** SF-REV-02 CTA corrected to the confirmed **`Send To
Review`** (was "Complete & Send to Review"); **SF-SET-14 (C29288) re-pushed** with the
same correction. SF-REV-06 stripped the dev test-id `input_review_vin`.

| SF-ID | C# | viu_status | note |
|---|---|---|---|
| SF-REV-01/05/07/08 | C29386/90/92/93 | VIU-Verified | Send To Review flow confirmed live |
| SF-REV-02 | C29387 | VIU-Verified | CTA corrected to 'Send To Review' |
| SF-REV-04 | C29389 | VIU-Verified | Receive Parts → shared page (prior FV-rev04) |
| SF-REV-06/10 | C29391/95 | VIU-Verified | Mark Reviewed VIN required, no note (Δ4); dialog on missing-VIN |
| SF-REV-09 | C29394 | VIU-Verified | gated by Review Work Orders (matrix) |
| SF-REV-12/13 | C29397/98 | VIU-Verified | Ready for Review indicator; approve-line gate |
| SF-REV-03 | C29388 | **VIU-Pending** | review-on Details field set not surfaced (needs mileage/hours-empty WO) |
| SF-REV-11 | C29396 | **VIU-Pending** | invoicing-block half needs an invoicing drive |
| SF-REV-14 | C29399 | **VIU-Pending** | needs genuine inventory+special-order cores (non-seedable) |
| SF-REV-15 | C29400 | **Blocked-Env** | brand-new-org cohort default not provisionable |

**SF-REV summary:** 15 cases · VIU-Verified 11 · VIU-Pending 3 · Blocked-Env 1.
TestRail: **15 updated, 0 no-op, 200/OK, 0 errors** (+ SF-SET-14 re-push).
Settings restored byte-identical. Completed disposable WOs S2-15823/S2-15813 (+ the
earlier S2-15795/S2-15825) during drives. **TESTER-READY.**

---

## Area SF-VAL — Completion / receive validation gates — TESTER-READY ✅ · 3 pending (non-seedable/state)

Drove the completion Details modal live 2026-07-13 (Require Mileage + Engine Hours
ON, restored byte-identical). Confirmed modal **`Complete Work Order`** with
**`Mileage`** + **`Engine Hours`** fields, buttons **`Cancel`** / **`Complete Work
Order →`**; empty required field → **`required field`** error, completion blocked
(S2-15783). **KEY BUILD FINDING:** no VIN field in the completion modal even
review-off → corrected SF-COMP-16 (re-pushed C29305) and SF-REV-03 (upgraded to
Verified, re-pushed C29388).

| SF-ID | C# | viu_status | note |
|---|---|---|---|
| SF-VAL-01/03 | C29415/17 | VIU-Verified | Mileage/Engine Hours block ('required field') — driven live |
| SF-VAL-04/05/07/08/10 | C29418/19/21/22/24 | VIU-Verified | gates per prior drives + this run |
| SF-VAL-02 | C29416 | **VIU-Pending** | no VIN field in modal (build finding); VIN-less asset non-seedable |
| SF-VAL-06 | C29420 | **VIU-Pending** | Δ3 receive gates — drive in SF-VEND/SF-RCV cluster (seed vendor-missing PO) |
| SF-VAL-09 | C29423 | **VIU-Pending** | needs invoiced/paid WO (not drivable in-harness) |
| SF-VAL-11 | C29425 | **VIU-Pending** | needs Needs-Approval line (auto-approve historically ON; New Line form too flaky headless) |

**SF-VAL summary:** 11 cases · VIU-Verified 7 · VIU-Pending 4. TestRail: **11
updated, 200/OK, 0 errors** (+ SF-COMP-16, SF-REV-03 re-pushed). Settings restored
byte-identical. **TESTER-READY.**

---

## Areas SF-UX (4) + SF-WOP (3) — TESTER-READY ✅

Confirmed live 2026-07-13 (`UX-workorders-list.png`): **`Create Work Order`** button;
WO list columns; completion required-fields collected in the centralized **`Complete
Work Order`** modal (Mileage + Engine Hours, no VIN; tech story separate); success
screen `Done` / `Go To Invoice` (invoice on Finance step). SF-WOP (Story 14 Waiting
on Parts column) per prior VIU (case 29384) — 'EXPECTED PER SPEC' jargon stripped.

- SF-UX-01/02/03 (C29401/02/03) VIU-Verified; **SF-UX-04 (C29404) VIU-Pending** (close-confirmation dialog needs a discardable in-progress completion).
- SF-WOP-01/02/03 (C29383/84/85) VIU-Verified (SF-WOP-01 FLAG: exact column-selector label not re-surfaced this run).

**Summary:** 7 cases · VIU-Verified 6 · VIU-Pending 1. TestRail: **7 updated,
200/OK, 0 errors.** **TESTER-READY.**

---

## Receive cluster — SF-POSEL(6) SF-BULK(10) SF-INV(3) SF-RCV(10) SF-VEND(6) SF-PNFIX(6) SF-VPART(7) — TESTER-READY (wording) ✅

Surfaces confirmed live 2026-07-13 (`RCV-po-list.png`, `RCV-bulk-receive.png`): PO
list `Purchase Orders`/`Receive`; Bulk Receive `Receive Vendor Parts` /
`Back To Purchase Orders` / VENDOR groups / `Apply to selected POs` / `Invoice Date`
/ `Tax` / `Receive All` / `COST TOTAL` / `PARTS SELECTED` / `POS SELECTED`.

**Build corrections:** "Back to Purchase Orders"→**Back To Purchase Orders**;
"Apply invoice to selected POs"→**Apply to selected POs**; "Receive all"→**Receive All**.

- **VIU-Verified (33):** SF-POSEL-01..06, SF-BULK-01..09, SF-INV-01..03, SF-RCV-01/02/03/04/09/10, SF-VEND-01, SF-PNFIX-01, SF-VPART-01..07. (SF-BULK-09 FLAG: QuickBooks-side AP internals need a human in QB.)
- **VIU-Pending — need seeded vendor-missing PO (incl. Δ3 deltas):** SF-VEND-04, SF-VEND-06, SF-RCV-06, SF-PNFIX-05, SF-RCV-05, SF-RCV-07. All PO stock this run had vendors (vendorMissing:false); seeding the vendor-missing flow (New Part Request Source=Vendor, free-text PN, no vendor → complete WO) not done this session.
- **VIU-Pending — non-seedable/other:** SF-BULK-10 (core), SF-VEND-02/03 (merge collision), SF-VEND-05 (invoiced WO), SF-PNFIX-02/03/06 (OBS-6 Part-History 500), SF-PNFIX-04 (invoiced WO).
- **Blocked-Env:** SF-RCV-08 (per-vendor QuickBooks bill/AP — needs human in QB).

**Cluster summary:** 48 cases · VIU-Verified 33 · VIU-Pending 14 · Blocked-Env 1.
TestRail: **47 updated + 1 no-op, 200/OK, 0 errors** (SF-VEND-06 = C29442 confirmed
present). **TESTER-READY (wording).**

---

## Areas SF-CORE (10) + SF-TECH (8) — TESTER-READY ✅

Tech-story inline sub-row (`Story` / `Add tech story for this line`) confirmed live
on WO lines this run; inventory-core line-level Ok/Not-OK per prior VIU.

- **SF-CORE:** VIU-Verified SF-CORE-01/02/10 (line-level Ok/Not-OK + no-core direct completion confirmed live); **VIU-Pending SF-CORE-03..09** (need a genuine special-order vendor-source core — not seedable; several also need invoicing).
- **SF-TECH:** all 8 VIU-Verified. **SF-TECH-07 reworded** from the dev-only `input_tech_story` test-id to a tester-meaningful text-box check.

**Summary:** 18 cases · VIU-Verified 11 · VIU-Pending 7. TestRail: **13 updated + 5
no-op, 200/OK, 0 errors.** **TESTER-READY.**
