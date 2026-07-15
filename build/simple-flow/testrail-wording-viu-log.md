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

---

## Areas SF-VMIS (7) + SF-QB (9) — SF-VMIS wording TESTER-READY ✅ · SF-QB QB-blocked (last)

- **SF-VMIS:** VIU-Verified 01/02/04/05/07 (vendor-missing-on-WO-PO per prior VIU + Bulk Receive vendor grouping confirmed live; story-refs stripped from SF-VMIS-04); **Blocked-Env SF-VMIS-03** (QB-exclusion half needs QB human); **VIU-Pending SF-VMIS-06** (reports 'needs vendor', needs seeded vendor-missing PO). TestRail: 6 updated + 1 no-op.
- **SF-QB (QuickBooks internals — done LAST, need a human in QuickBooks):**
  - **Blocked-Env:** SF-QB-02 (No-PO path — Create POs toggle absent), SF-QB-03/05/06/07 (QuickBooks sync / vendor bill / AP / journal entry — no QB read API).
  - **VIU-Pending:** SF-QB-01/04/08 (Part-History half blocked by OBS-6: GET /api/inventory/parts/history 500; decrement half of SF-QB-01 verified prior).
  - **SF-QB-09** — Open-Question, **not in id-map (no C-ID)**, not created in TestRail (dev-investigation). Skipped on push (no-testrail-id, expected). TestRail: 8 updated + 0 no-op (+1 skipped no-id).

**Summary:** 16 cases · VIU-Verified 5 · VIU-Pending 4 · Blocked-Env 6 ·
Open-Question 1. TestRail: **14 updated + 1 no-op, 200/OK, 0 errors** (SF-QB-09
skipped — no C-ID). **SF-VMIS tester-ready; SF-QB QB-internals genuinely blocked.**

---

## Relevance-fix re-VIU (2026-07-13) — the 3 missed "Complete & Send to Review" label cases

Spec-relevance audit (`spec-relevance-audit-2026-07-13.md`) flagged 3 cases still
carrying the stale CTA label **"Complete & Send to Review"**. Re-VIU'd LIVE on
sv7301 (admin; Require Review ON; WOs S2-15827 [part-bearing, all lines approved],
S2-15783 [part-bearing, one unapproved line], S2-15823). No settings change (review
was already ON); Tech never switched. Evidence in
`screenshots/relevance-fix-2026-07-13/`.

**Build-accurate CTA labels captured live:**
- The primary action button (Require Review ON) = **"Send To Review"** on BOTH ready
  and part-bearing work orders — it replaces "Complete Work Order".
- For a part-bearing WO, clicking "Send To Review" opens a dialog **HEADED
  "Complete & Send to Review"** (exact header text confirmed), body "N part waiting to
  receive / Clicking 'Receive Parts' will take you to the purchase order page",
  buttons **Cancel / Receive Parts / Send To Review**. So "Complete & Send to Review"
  is the review-dialog HEADER, not the button; the clickable CTA is **"Send To Review"**.
- With an unapproved line, the **"Send To Review" button is DISABLED** (isDisabled=true)
  until every line is approved.

**Cases corrected + pushed (update_case, GET→diff→update→re-verify):**
- **SF-REV-02 (C29387)** — title retitled to "Send To Review"; steps reworded; expected #2
  corrected (part-bearing WO does NOT read "Complete Work Order" — it opens the
  "Complete & Send to Review" dialog). UPDATED [title, custom_steps, custom_expected] verify=200/OK.
- **SF-REV-05 (C29390)** — step 1 "Click Complete & Send to Review" → "Click Send To Review";
  precondition clarified. UPDATED [custom_preconds, custom_steps] verify=200/OK.
- **SF-REV-13 (C29398)** — step 1 label corrected; title + expected made build-accurate
  (the "Send To Review" button is DISABLED while a line is unapproved). UPDATED
  [title, custom_steps, custom_expected] verify=200/OK.

**Summary:** 3 cases · TestRail **3 updated / 0 no-op / 0 failed, all verify 200/OK.**

---

## Run-325 re-verify (2026-07-14) — 5 cases settled against Ayesha's run 325

Live re-VIU on sv7301 (admin, boot2 hydration). Settings flipped per case then
**restored byte-identical to baseline** (verified). Tech role NOT modified (admin-only).

**Live verdicts:**
- **SF-COMP-02 (C29291)** — VIU-Verified REAFFIRMED. Labor-only approved-line WO (S-15839)
  completed in ONE confirm to the Success screen ('Order complete' + 'Sent to Finance as
  an invoice-ready draft', Done / Go To Invoice); single simple-complete -> 201; WO ->
  Complete, line -> complete. Ayesha's Fail = FALSE/STALE. **No wording change -> no TestRail write.**
- **SF-TECH-02 (C29324)** — VIU-Verified REAFFIRMED. Require Tech Stories ON: simple-complete
  -> 400 'Line can not be completed without a tech story'; UI routes to a 'Tech story' modal
  (Line 1 of 1 / Tech Story field / Continue). Ayesha's Fail = FALSE/STALE (likely toggle OFF
  at her run). **No wording change -> no TestRail write.**
- **SF-VPART-06 (C29336)** — VIU-Verified REAFFIRMED. Vendorless part (pn/vendor null) -> add
  PN + vendor (change-request -> 200) -> part carries both = no longer vendorless. QB-eligibility
  half remains QB-blocked. Ayesha's Fail = FALSE/STALE. **No wording change -> no TestRail write.**
- **SF-COMP-21 (C29310)** — FLIPPED VIU-Pending -> VIU-Verified. Require Vendor Invoice Number
  ON + Auto-approve OFF: Needs-Approval line -> 'Complete Work Order' button DISABLED
  (aria-disabled=true) with tooltip 'Every line must be approved or declined in order to
  complete the work order.'; approving re-enables. **WORDING FIX:** expected #2/#3 corrected —
  tooltip is GENERIC and does NOT name the line. UPDATED [custom_expected] verify=200/OK.
- **SF-COMP-22 (C29311)** — FLIPPED VIU-Pending -> VIU-Verified. Require Vendor Invoice Number
  ON + Auto-approve ON: line auto-approved then manually un-approved -> button DISABLED + same
  generic tooltip (gate holds with Auto-approve ON); re-approve re-enables. **WORDING FIX:**
  expected #1 corrected to the exact build tooltip. UPDATED [custom_expected] verify=200/OK.

**Summary:** 5 cases settled · 3 REAFFIRMED (no writes) · 2 FLIPPED to VIU-Verified with
wording fixes. TestRail **2 updated / 0 no-op / 0 failed, all verify 200/OK.** No results
written to run 325 (QA's run). Screenshots: build/simple-flow/screenshots/run325-reverify-2026-07-13/.

## 2026-07-14 VIU grind — wording fix push
- **SF-VAL-11 (C29425)** — `update_case` title + custom_preconds + custom_steps +
  custom_expected, GET->diff->update->verify **200/OK**. Reason: the prior expected
  contained a factual wording error — it claimed the unapproved-line tooltip "names
  the line" and that with Require Vendor Invoice OFF the button "stays active" with an
  error toast. Live VIU (WO S2-15844) proved the tooltip is GENERIC ("Every line must
  be approved or declined in order to complete the work order.") and the Complete Work
  Order button is DISABLED regardless of the invoice setting. Corrected to build-accurate
  wording. (Only 1 TestRail write this session; all other grind verdicts are local
  viu_status/notes changes with no tester-facing wording error.)

## 2026-07-14 — spec _3 (de-facto V2.5) + design _4 pass (Δ5 / Δ6 / Δ7 + design core-block)
Ran BOTH procedures (build-accurate wording+VIU + spec-relevance reconciliation) per
`spec-relevance-audit-2026-07-14.md`. TestRail authorized this pass.
Env: sv7301 (cookies-0714, admin+tech quick-login 200). Settings baseline captured
(settings-baseline-0714.json) and restored **byte-identical** after every flip.

**TestRail push: 18 update_case (all GET->diff->update->verify 200/OK) + 7 add_case
(SF-AUTO-01..07 = C29461..C29467) + 2 add_section (4092 UI, 4093 API). 0 failed.**

### Δ5 — Story 16 R12/R13 auto-complete (NEW cases + sanity)
- NEW **SF-AUTO-01 C29461** (single-line, review OFF) — VIU-Verified. Live S-15838: line1->Approved, last line->Complete (auto, no separate Complete step). Ayesha: not in run 325 (new case).
- NEW **SF-AUTO-02 C29462** (bulk, review OFF) — VIU-Verified. Live S-15824/446c1cd6: 3 lines bulk change-lines -> WO auto-Complete. New case.
- NEW **SF-AUTO-03 C29463** (split, review OFF) — VIU-Verified. Live S-15822: complete 2/3, split open line out -> original fully resolved -> auto-Complete. Split WO cleaned up. New case.
- NEW **SF-AUTO-04 C29464** (delete-line, review OFF) — Blocked-Env. delete-lines API 500 (requestId 768518b…) even when leaving WO open; no Chromium harness. Mechanism verified on other 3 paths. New case.
- NEW **SF-AUTO-05 C29465** (any path, review ON) — VIU-Verified. Live S-15813 review ON: last line -> Review (Ready for Review), NOT Complete. New case.
- NEW **SF-AUTO-06 C29466** (clock-out exception, review OFF) — Blocked-Env. Per-line technician clock-out not API-exposed (technician-tasks 404; department-clock is shop-time punch); no Chromium harness. New case.
- NEW **SF-AUTO-07 C29467** (API — backend status transition) — VIU-Verified. API GET view/{id} showed status Complete (review OFF) / Review (review ON) after last-line-resolve. Placed in API section 4093 (Rule 4). New case.
- **SF-COMP-09 C29298** — update_case custom_expected (R12 clause on re-resolve). Ayesha marked C29298 Passed — no remark.
- **SF-REV-01 C29386** — update_case custom_expected (review-ON last-line-resolve -> Ready for Review). Ayesha marked C29386 Untested.
- **SF-REV-05 C29390** — update_case custom_expected. Ayesha marked C29390 Untested.
- **SF-REV-08 C29393** — update_case custom_expected. Ayesha marked C29393 Untested.
- **SF-REV-11 C29396** — update_case custom_expected. Ayesha marked C29396 Untested.

### Δ6 — S1-R9 settings apply on reopen
- **SF-SET-10 C29284** — update_case title + custom_steps + custom_expected. VIU-Verified: non-retroactive-to-left-completed leg confirmed (untouched completed WO stayed Complete after flipping review ON); apply-on-reopen leg observed (re-triggering the completed WO's last-line-resolve under review ON routed it Complete->Review). Ayesha marked C29284 **Failed** — remark "As discussed with Milos. The specs will be updated. SV-8303" — this spec update is exactly that change; resolved.

### Δ7 — S10-R2 first-class-part deprecation (APPLY, QA-lead last-update-wins)
- **SF-PNFIX-02 C29364** — update_case title + custom_expected; rescoped to PN-persists + receivable (VIU-Verified live: receive-requested-parts 200). Ayesha marked C29364 Untested.
- **SF-PNFIX-03 C29365** — update_case title + custom_expected; rescoped, no-overwrite retained. VIU-Verified. Ayesha marked C29365 Untested.
- **SF-PNFIX-06 C29368** — update_case title + custom_expected; rescoped (catalog/inventory/Part-History creation not v1). VIU-Verified. Ayesha marked C29368 Untested.
- **SF-QB-08 C29433** — update_case title + preconds + steps + expected; rescoped to Part-History for genuinely inventory-tracked parts. VIU-Verified. Ayesha marked C29433 Untested.
- requirements.md V2.4 note #6 marked REVERSED/deprecated (dated).

### Design _4 — waiting special-order core is un-skippable at completion
- **SF-CORE-03 C29315** — FLIPPED: Complete Without Receiving now DISABLED + tooltip + Receive Parts while a core waits (was "stays available"). update_case title+preconds+steps+expected. Blocked-Env (special-order core non-seedable; design #4 copy pending live confirm). Ayesha marked C29315 **Blocked** — "Core parts still have issues…".
- **SF-COMP-11 C29300** — update_case custom_expected (core-waiting disabled caveat). Stays VIU-Verified for base actions. Ayesha marked C29300 Passed.
- **SF-COMP-14 C29303** — update_case custom_expected (not available while core waiting). Stays VIU-Verified for base. Ayesha marked C29303 Passed.
- **SF-CORE-05 C29317** / **SF-CORE-06 C29318** / **SF-CORE-07 C29319** — update_case custom_expected aligned to un-skippable core. Blocked-Env. Ayesha marked each **Blocked** — "Core parts still have issues…".
- **SF-BULK-10 C29359** — update_case custom_expected aligned. Blocked-Env. Ayesha marked C29359 Untested.
- **SF-REV-14 C29399** — update_case custom_expected aligned (review-flow core). Blocked-Env. Ayesha marked C29399 Untested.

No results written to run 325 (Ayesha's/QA's run).
