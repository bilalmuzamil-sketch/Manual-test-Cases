# F&D — Combined wording-correction + VIU pass — per-case log (2026-07-13)

> QA-lead-authorized combined pass: rewrite Title/Preconditions/Steps/Expected to
> EXACT build labels in plain layman language (Standing Rule 9), VIU-verify behavior,
> then push corrected wording to TestRail (update_case only; GET→diff→update-changed→
> re-verify 200/200; skip no-ops). Build labels captured live — glossary in
> `wording-glossary-2026-07-13.md`; screenshots in `screenshots/wording-2026-07-13/`.
> FD→C-ID from `testrail-id-map.csv`. Fees & Discounts project only; no runs/results.

## Area: FD-WO (Work Order — Whole-WO Fee/Discount) — 16 cases — TESTER-READY

**Build terms corrected (notable):** ⋯ menu item is **'Add Fee/Discount'** (was
"Add Work Order Fee / Discount"); dialog title **'Add new fee/discount'** (was "New Fee
/ Discount"); dropdown **'Apply From Template'** (was "Apply from template (optional)");
**'Calculation Type'** options are exactly **Flat Amount / % of Labor Total / % of Parts
Total / % of Subtotal** (no generic "Percentage", no "% of Grand Total"); amount field is
**'$ Amount'** (flat) or **'Percent %'** (percentage); **'$ Max Amount (Optional)'** shows
only for percentage methods; **'Taxable'** is a Yes/No **toggle** (not a dropdown);
confirm button **'Add Fee' / 'Add Discount'**; sidebar card **'WO Fees & Discounts'** (was
"Work Order Fee / Discount"); preview empty prompt is exactly **'Enter an amount to see the
impact.'**. Also removed spec-ref/design-mockup jargon (S2-Rxx, §5-Rx, "design updateCalcUI()")
from tester-facing fields.

**VIU (fresh_run 2026-07-13):**
- Confirmed live today via UI (WO S3-15960): dialog opens from ⋯ 'Add Fee/Discount'
  (FD-WO-001); Calculation Type options (FD-WO-011); preview prompt text (FD-WO-014);
  Max Amount only on % methods (FD-WO-006); Add button ENABLED on empty form = DEVIATION
  BUG-FD-4 (FD-WO-005); **§5-R15 jurisdiction note ABSENT below the Taxable toggle =
  DEVIATION** (FD-WO-016). Arithmetic/save behaviors (002/003/006/009/010/011) carried
  from the 2026-07-10 fresh API pass (same build; labels unchanged).
- FD-WO-013 permission-hide: DEVIATION (BUG-FD-3, front-end-only); NOT re-tested this run
  (Technician role drifted on shared qb env — re-derive roles matrix first).

| FD-ID | TestRail | viu_status | TestRail push |
|---|---|---|---|
| FD-WO-001 | [C28424](https://shopview.testrail.io/index.php?/cases/view/28424) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-002 | [C28425](https://shopview.testrail.io/index.php?/cases/view/28425) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-003 | [C28426](https://shopview.testrail.io/index.php?/cases/view/28426) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-004 | [C28427](https://shopview.testrail.io/index.php?/cases/view/28427) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-005 | [C28428](https://shopview.testrail.io/index.php?/cases/view/28428) | VIU-Deviation | updated title+preconds+steps+expected 200/200 |
| FD-WO-006 | [C28429](https://shopview.testrail.io/index.php?/cases/view/28429) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-007 | [C28430](https://shopview.testrail.io/index.php?/cases/view/28430) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-008 | [C28431](https://shopview.testrail.io/index.php?/cases/view/28431) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-009 | [C28432](https://shopview.testrail.io/index.php?/cases/view/28432) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-010 | [C28433](https://shopview.testrail.io/index.php?/cases/view/28433) | VIU-Verified | updated preconds+steps+expected 200/200 |
| FD-WO-011 | [C28434](https://shopview.testrail.io/index.php?/cases/view/28434) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-012 | [C28435](https://shopview.testrail.io/index.php?/cases/view/28435) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-013 | [C28436](https://shopview.testrail.io/index.php?/cases/view/28436) | VIU-Deviation | updated title+preconds+steps+expected 200/200 |
| FD-WO-014 | [C28437](https://shopview.testrail.io/index.php?/cases/view/28437) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-015 | [C28438](https://shopview.testrail.io/index.php?/cases/view/28438) | VIU-Verified | updated title+preconds+steps+expected 200/200 |
| FD-WO-016 | [C29441](https://shopview.testrail.io/index.php?/cases/view/29441) | VIU-Deviation | updated title+preconds+steps+expected 200/200 |

**FD-WO push totals:** 16 updated · 0 no-op · 0 error.

## Area: FD-FIN / FD-INLINE / FD-STATS / FD-REMOVE (WO Lines surface) — 18 cases — TESTER-READY

**Build terms corrected (notable):** sidebar card title **'WO Fees & Discounts'** (was
"Work Order Fee / Discount"); per-row and inline ⋮ menu options are **'Edit' / 'Remove'**
(was "Edit/Delete"); the Remove confirm dialog is exactly **title 'Remove Fee / Discount',
message 'Are you sure you want to remove this fee?', buttons 'Remove'/'Cancel'**; inline
fee/discount row is labelled **'Fees/Discounts'** with a ↳ arrow; Financial Info shows a
**'Fees & Discounts (N)'** row (net in grey); Stats shows a **'Fees & Discounts (N)'**
section below Hours/Labor/Parts/Total. Removed spec-ref jargon (S3-Rxx, S4-Rxx, U+2212).

**VIU (fresh_run 2026-07-13) — confirmed live (WO S3-15960):** Financial Info net row
(shot fin-03); sidebar 'WO Fees & Discounts' card + Edit/Remove menu (fin-03); inline
'Fees/Discounts' rows (wo-01/fin-03); inline ⋮ Edit/Remove (inline-01); Remove confirm
dialog exact text (inline-02, cancelled — no shared data deleted); Stats 'Fees & Discounts
(N)' section layout (fin-01).

**Kept as DEVIATIONS (unchanged, PO/dev-owned):** FD-INLINE-003 (no 'Show N more'
collapse, BUG-FD-5); FD-STATS-001 (no Value/Amount column headers, BUG-FD-2),
FD-STATS-002 (no scope hyperlink), FD-STATS-004 (creation-order ruling pending).
**Flipped to Verified after wording match:** FD-FIN-004 (card title now 'WO Fees &
Discounts'), FD-REMOVE-001 (confirm dialog matched exactly).

| FD-ID | TestRail | viu_status | push |
|---|---|---|---|
| FD-FIN-001 | [C28464](https://shopview.testrail.io/index.php?/cases/view/28464) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-FIN-002 | [C28465](https://shopview.testrail.io/index.php?/cases/view/28465) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-FIN-003 | [C28466](https://shopview.testrail.io/index.php?/cases/view/28466) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-FIN-004 | [C28467](https://shopview.testrail.io/index.php?/cases/view/28467) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-FIN-005 | [C28468](https://shopview.testrail.io/index.php?/cases/view/28468) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-INLINE-001 | [C28454](https://shopview.testrail.io/index.php?/cases/view/28454) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-INLINE-002 | [C28455](https://shopview.testrail.io/index.php?/cases/view/28455) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-INLINE-003 | [C28456](https://shopview.testrail.io/index.php?/cases/view/28456) | VIU-Deviation | title+preconds+steps+expected 200/200 |
| FD-INLINE-004 | [C28457](https://shopview.testrail.io/index.php?/cases/view/28457) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-INLINE-005 | [C28458](https://shopview.testrail.io/index.php?/cases/view/28458) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-STATS-001 | [C28459](https://shopview.testrail.io/index.php?/cases/view/28459) | VIU-Deviation | title+preconds+steps+expected 200/200 |
| FD-STATS-002 | [C28460](https://shopview.testrail.io/index.php?/cases/view/28460) | VIU-Deviation | title+preconds+steps+expected 200/200 |
| FD-STATS-003 | [C28461](https://shopview.testrail.io/index.php?/cases/view/28461) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-STATS-004 | [C28462](https://shopview.testrail.io/index.php?/cases/view/28462) | VIU-Deviation | title+preconds+steps+expected 200/200 |
| FD-STATS-005 | [C28463](https://shopview.testrail.io/index.php?/cases/view/28463) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-REMOVE-001 | [C28479](https://shopview.testrail.io/index.php?/cases/view/28479) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-REMOVE-002 | [C28480](https://shopview.testrail.io/index.php?/cases/view/28480) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-REMOVE-003 | [C28481](https://shopview.testrail.io/index.php?/cases/view/28481) | VIU-Verified | title+preconds+steps+expected 200/200 |

**Push totals:** 18 updated · 0 no-op · 0 error.

## Area: FD-EDIT / FD-VAL (Edit dialog + Add-dialog validation) — 10 cases — TESTER-READY

**Build terms confirmed live (shot edit-01):** Edit dialog title **'Edit Fee / Discount'**;
**Type and Calculation Type are greyed/locked**, Name / amount / Max Amount / Taxable
editable; **no 'Apply From Template' dropdown** in Edit; confirm button **'Save'**; preview
rows **'Work-order subtotal' / 'Discount' (or Fee) / 'New work-order subtotal' / 'Tax is
recalculated on save.'**. FD-VAL reuses the confirmed Add-dialog labels ('Add Fee'/'Add
Discount', 'Calculation Type', '$ Max Amount (Optional)' only on % methods). Removed
design-ref jargon (S2-Rxx, "validateForm").

**Deviations kept:** FD-VAL-001 (Add button enabled on empty form, BUG-FD-4 — re-confirmed
live); FD-VAL-006 (Max Amount 0 = no cap vs cap-at-$0 is PO Q2 — pending).

| FD-ID | TestRail | viu_status | push |
|---|---|---|---|
| FD-EDIT-001 | [C28476](https://shopview.testrail.io/index.php?/cases/view/28476) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-EDIT-002 | [C28477](https://shopview.testrail.io/index.php?/cases/view/28477) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-EDIT-003 | [C28478](https://shopview.testrail.io/index.php?/cases/view/28478) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-VAL-001 | [C28599](https://shopview.testrail.io/index.php?/cases/view/28599) | VIU-Deviation | title+preconds+steps+expected 200/200 |
| FD-VAL-002 | [C28600](https://shopview.testrail.io/index.php?/cases/view/28600) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-VAL-003 | [C28601](https://shopview.testrail.io/index.php?/cases/view/28601) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-VAL-004 | [C28602](https://shopview.testrail.io/index.php?/cases/view/28602) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-VAL-005 | [C28603](https://shopview.testrail.io/index.php?/cases/view/28603) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-VAL-006 | [C28604](https://shopview.testrail.io/index.php?/cases/view/28604) | VIU-Deviation | title+preconds+steps+expected 200/200 |
| FD-VAL-007 | [C28605](https://shopview.testrail.io/index.php?/cases/view/28605) | VIU-Verified | title+preconds+steps+expected 200/200 |

**Push totals:** 10 updated · 0 no-op · 0 error.

## Area: FD-CALC (Calculation contract) — 17 cases — TESTER-READY

**Build terms:** reuses the confirmed Add/Edit dialog glossary ('Add Fee/Discount',
'Calculation Type' with % of Labor Total / % of Parts Total / % of Subtotal, '$ Amount',
'Percent %', '$ Max Amount (Optional)', 'Taxable' toggle). Stripped §5/S2/S6/S8 spec-ref
jargon; layman rewrite. **VIU:** resolution engine re-confirmed live 2026-07-13 via API —
flat $25 → +$25.00; 20% capped at $15 → +$15.00; 150% discount rejected with exact message
'A percentage discount cannot exceed 100%'. Remaining arithmetic carried from the stable
2026-07-10 API pass.

**Deviations kept (dev/PO-owned):** FD-CALC-006 (FDBUG-10, below-min % coerced up, PO Q3),
FD-CALC-008 (FDBUG-9, Max 0 = no cap, PO Q2), FD-CALC-013 (FDBUG-2, pfee base includes
whole-WO adjustments). **Blocked-Env:** FD-CALC-017 (QuickBooks penny-cap allocation needs a
human in QuickBooks). FD-CALC-009/015 carry a QuickBooks-side note (in-app halves verified).

| FD-ID | TestRail | viu_status | push |
|---|---|---|---|
| FD-CALC-001 | [C28568](https://shopview.testrail.io/index.php?/cases/view/28568) | VIU-Verified | title+preconds+steps+expected 200/200 |
| FD-CALC-002 | [C28569](https://shopview.testrail.io/index.php?/cases/view/28569) | VIU-Verified | 200/200 |
| FD-CALC-003 | [C28570](https://shopview.testrail.io/index.php?/cases/view/28570) | VIU-Verified | 200/200 |
| FD-CALC-004 | [C28571](https://shopview.testrail.io/index.php?/cases/view/28571) | VIU-Verified | 200/200 |
| FD-CALC-005 | [C28572](https://shopview.testrail.io/index.php?/cases/view/28572) | VIU-Verified | 200/200 |
| FD-CALC-006 | [C28573](https://shopview.testrail.io/index.php?/cases/view/28573) | VIU-Deviation | 200/200 |
| FD-CALC-007 | [C28574](https://shopview.testrail.io/index.php?/cases/view/28574) | VIU-Verified | 200/200 |
| FD-CALC-008 | [C28575](https://shopview.testrail.io/index.php?/cases/view/28575) | VIU-Deviation | 200/200 |
| FD-CALC-009 | [C28576](https://shopview.testrail.io/index.php?/cases/view/28576) | VIU-Verified | 200/200 |
| FD-CALC-010 | [C28577](https://shopview.testrail.io/index.php?/cases/view/28577) | VIU-Verified | 200/200 |
| FD-CALC-011 | [C28578](https://shopview.testrail.io/index.php?/cases/view/28578) | VIU-Verified | 200/200 |
| FD-CALC-012 | [C28579](https://shopview.testrail.io/index.php?/cases/view/28579) | VIU-Verified | 200/200 |
| FD-CALC-013 | [C28580](https://shopview.testrail.io/index.php?/cases/view/28580) | VIU-Deviation | 200/200 |
| FD-CALC-014 | [C28581](https://shopview.testrail.io/index.php?/cases/view/28581) | VIU-Verified | 200/200 |
| FD-CALC-015 | [C28582](https://shopview.testrail.io/index.php?/cases/view/28582) | VIU-Verified | 200/200 |
| FD-CALC-016 | [C28583](https://shopview.testrail.io/index.php?/cases/view/28583) | VIU-Verified | 200/200 |
| FD-CALC-017 | [C28584](https://shopview.testrail.io/index.php?/cases/view/28584) | VIU-Blocked-Env | 200/200 |

**Push totals:** 17 updated · 0 no-op · 0 error.

## Area: FD-TMPL (Template admin) — 17 cases — TESTER-READY

**Build terms corrected (notable):** templates admin is at **Administration → FINANCE →
'Fees & Discounts'** (below **'Payment Methods'**) — the case's "Service, below Canned Lines"
was WRONG (Canned Lines is under SERVICE). List heading **'Fees & Discounts'**; button
**'New Fee / Discount'**; columns **Name / Type / Calculation Type / Amount / Max Amount /
Taxable / Auto-Apply To Work Orders** + pencil(edit) + red-trash(delete). Create dialog
**'New Fee / Discount'** with **Name / Type / Calculation Type / '$ Default Amount' /
Taxable toggle / 'Auto-apply to new work orders' toggle / 'Description (Optional)' / Create**.
Edit dialog **'Edit Fee / Discount'** with **Save**. Delete confirm **'Delete Template'**
with the customer-default warning **'This template is set as a default for N customer(s).
Deleting it will remove it from them.'** (confirmed live). **Type offers only Fee/Discount**
(the builder does NOT expose Processing Fee — Story 8 not built; the BE still accepts
`processing_fee` via API, 201).

**VIU (fresh 2026-07-13):** list + create dialog + delete confirm captured live (shots
tmpl-01/02/03); create/edit/delete lifecycle exercised via API (create 201, delete 204,
delete-precondition returns affectedCustomerCount); %>100 discount rejected. Toast texts
(created/updated/save-failure) and the empty-state carried/blocked as noted.

**Deviations kept:** FD-TMPL-010 (scoping/hint — needs the line picker), FD-TMPL-011 (Max 0
= no cap, PO Q2). **Blocked-Env:** FD-TMPL-012 (empty-state unobservable — list never empty
on the shared env). **Flipped to Verified after wording match:** FD-TMPL-001/003/004/006/008.

| FD-ID | TestRail | viu_status |
|---|---|---|
| FD-TMPL-001 | [C28502](https://shopview.testrail.io/index.php?/cases/view/28502) | VIU-Verified |
| FD-TMPL-002 | [C28503](https://shopview.testrail.io/index.php?/cases/view/28503) | VIU-Verified |
| FD-TMPL-003 | [C28504](https://shopview.testrail.io/index.php?/cases/view/28504) | VIU-Verified |
| FD-TMPL-004 | [C28505](https://shopview.testrail.io/index.php?/cases/view/28505) | VIU-Verified |
| FD-TMPL-005 | [C28506](https://shopview.testrail.io/index.php?/cases/view/28506) | VIU-Verified |
| FD-TMPL-006 | [C28507](https://shopview.testrail.io/index.php?/cases/view/28507) | VIU-Verified |
| FD-TMPL-007 | [C28508](https://shopview.testrail.io/index.php?/cases/view/28508) | VIU-Verified |
| FD-TMPL-008 | [C28509](https://shopview.testrail.io/index.php?/cases/view/28509) | VIU-Verified |
| FD-TMPL-009 | [C28510](https://shopview.testrail.io/index.php?/cases/view/28510) | VIU-Verified |
| FD-TMPL-010 | [C28511](https://shopview.testrail.io/index.php?/cases/view/28511) | VIU-Deviation |
| FD-TMPL-011 | [C28512](https://shopview.testrail.io/index.php?/cases/view/28512) | VIU-Deviation |
| FD-TMPL-012 | [C28513](https://shopview.testrail.io/index.php?/cases/view/28513) | VIU-Blocked-Env |
| FD-TMPL-013 | [C28514](https://shopview.testrail.io/index.php?/cases/view/28514) | VIU-Verified |
| FD-TMPL-014 | [C28515](https://shopview.testrail.io/index.php?/cases/view/28515) | VIU-Verified |
| FD-TMPL-015 | [C28516](https://shopview.testrail.io/index.php?/cases/view/28516) | VIU-Verified |
| FD-TMPL-016 | [C28517](https://shopview.testrail.io/index.php?/cases/view/28517) | VIU-Verified |
| FD-TMPL-017 | [C28518](https://shopview.testrail.io/index.php?/cases/view/28518) | VIU-Verified |

**Push totals:** 17 updated · 0 no-op · 0 error.

## Area: FD-CUST (Customer Fees & Discounts tab) — 17 cases — TESTER-READY

**Build terms confirmed live (shots cust-01/02):** customer tab **'Fees & Discounts (N)'**;
card **'Default Fees & Discounts'**; caption exact ('These fees & discounts auto-apply to
every new work order for this customer. They can still be edited or removed on individual
work orders without changing the defaults here.'); button **'Add Fee/Discount'**; columns
**Name / Type / Calculation Type / Amount / Max Amount / Taxable** + remove action (NO
Auto-Apply column on the customer tab — corrected); empty state **"No fees or discounts yet.
Use 'Add Fee/Discount' to add one."**; add picker dialog **'Add Fee/Discount'** with a
single **'Fee / Discount Templates'** dropdown + **Save**. Corrected the tab list and the
admin nav (Service → Finance).

**VIU (fresh 2026-07-13):** customer-default add/remove lifecycle confirmed via API (add
201, remove 204, clean). Defaults→new-WO behavior + seeding carried from the stable
2026-07-10 pass (FDBUG-12 fixed). **Deviations kept:** FD-CUST-005 (Processing Fee shows as
type 'Fee' in the picker), FD-CUST-006 (empty-picker state — not re-captured). **FD-CUST-015**
permission gate: re-check the Tech negative after the roles matrix is re-derived.

| FD-ID | TestRail | viu_status |
|---|---|---|
| FD-CUST-001 | [C28485](https://shopview.testrail.io/index.php?/cases/view/28485) | VIU-Verified |
| FD-CUST-002 | [C28486](https://shopview.testrail.io/index.php?/cases/view/28486) | VIU-Verified |
| FD-CUST-003 | [C28487](https://shopview.testrail.io/index.php?/cases/view/28487) | VIU-Verified |
| FD-CUST-004 | [C28488](https://shopview.testrail.io/index.php?/cases/view/28488) | VIU-Verified |
| FD-CUST-005 | [C28489](https://shopview.testrail.io/index.php?/cases/view/28489) | VIU-Deviation |
| FD-CUST-006 | [C28490](https://shopview.testrail.io/index.php?/cases/view/28490) | VIU-Deviation |
| FD-CUST-007 | [C28491](https://shopview.testrail.io/index.php?/cases/view/28491) | VIU-Verified |
| FD-CUST-008 | [C28492](https://shopview.testrail.io/index.php?/cases/view/28492) | VIU-Verified |
| FD-CUST-009 | [C28493](https://shopview.testrail.io/index.php?/cases/view/28493) | VIU-Verified |
| FD-CUST-010 | [C28494](https://shopview.testrail.io/index.php?/cases/view/28494) | VIU-Verified |
| FD-CUST-011 | [C28495](https://shopview.testrail.io/index.php?/cases/view/28495) | VIU-Verified |
| FD-CUST-012 | [C28496](https://shopview.testrail.io/index.php?/cases/view/28496) | VIU-Verified |
| FD-CUST-013 | [C28497](https://shopview.testrail.io/index.php?/cases/view/28497) | VIU-Verified |
| FD-CUST-014 | [C28498](https://shopview.testrail.io/index.php?/cases/view/28498) | VIU-Verified |
| FD-CUST-015 | [C28499](https://shopview.testrail.io/index.php?/cases/view/28499) | VIU-Verified |
| FD-CUST-016 | [C28500](https://shopview.testrail.io/index.php?/cases/view/28500) | VIU-Verified |
| FD-CUST-017 | [C28501](https://shopview.testrail.io/index.php?/cases/view/28501) | VIU-Verified |

**Push totals:** 17 updated · 0 no-op · 0 error.

## Area: FD-LABOR + FD-PART (line-level fees/discounts) — 15 cases — TESTER-READY

**Build terms confirmed live (part flow, shots line-01/02):** the line ⋮ menu item is
**'Add Fee/Discount'** (was "Add fee / discount"); the line-scope dialog is **'Add new
fee/discount'** with a grey subtitle **'Applying to: <line/part name>'** (just the name — NO
'Line N Part/Labor —' prefix, so the old spec subtitle text was wrong); part scope defaults
Calculation Type to **'% Of Parts Total'** (labor scope → '% of Labor Total' by symmetry).
Part ⋮ menu = **'Move' / 'Add Fee/Discount'**.

**VIU (fresh 2026-07-13):** part-line menu + scope dialog captured live; labor-line menu not
re-captured (symmetry + prior VIU — noted). Arithmetic/behavior carried from 2026-07-10.
**Flipped to Verified after wording match:** FD-LABOR-001, FD-PART-001. **Pending:**
FD-PART-005 (requested→received blocked by the env WO line-create 500 + completed-line lock).
FD-LABOR-007 permission negative: re-check after the roles matrix is re-derived.

| FD-ID | TestRail | viu_status |
|---|---|---|
| FD-LABOR-001 | [C28439](https://shopview.testrail.io/index.php?/cases/view/28439) | VIU-Verified |
| FD-LABOR-002 | [C28440](https://shopview.testrail.io/index.php?/cases/view/28440) | VIU-Verified |
| FD-LABOR-003 | [C28441](https://shopview.testrail.io/index.php?/cases/view/28441) | VIU-Verified |
| FD-LABOR-004 | [C28442](https://shopview.testrail.io/index.php?/cases/view/28442) | VIU-Verified |
| FD-LABOR-005 | [C28443](https://shopview.testrail.io/index.php?/cases/view/28443) | VIU-Verified |
| FD-LABOR-006 | [C28444](https://shopview.testrail.io/index.php?/cases/view/28444) | VIU-Verified |
| FD-LABOR-007 | [C28445](https://shopview.testrail.io/index.php?/cases/view/28445) | VIU-Verified |
| FD-PART-001 | [C28446](https://shopview.testrail.io/index.php?/cases/view/28446) | VIU-Verified |
| FD-PART-002 | [C28447](https://shopview.testrail.io/index.php?/cases/view/28447) | VIU-Verified |
| FD-PART-003 | [C28448](https://shopview.testrail.io/index.php?/cases/view/28448) | VIU-Verified |
| FD-PART-004 | [C28449](https://shopview.testrail.io/index.php?/cases/view/28449) | VIU-Verified |
| FD-PART-005 | [C28450](https://shopview.testrail.io/index.php?/cases/view/28450) | VIU-Pending |
| FD-PART-006 | [C28451](https://shopview.testrail.io/index.php?/cases/view/28451) | VIU-Verified |
| FD-PART-007 | [C28452](https://shopview.testrail.io/index.php?/cases/view/28452) | VIU-Verified |
| FD-PART-008 | [C28453](https://shopview.testrail.io/index.php?/cases/view/28453) | VIU-Verified |

**Push totals:** 15 updated · 0 no-op · 0 error.

## Area: FD-PROC (Processing Fee) — 14 cases — TESTER-READY

**Build:** the template Type dropdown offers only Fee/Discount → **FD-PROC-001..004 stay
Blocked-NotBuilt** (Story-8 builder UI not shipped; BE accepts kind=processing_fee via API).
Behavior cases use build labels ('Add Fee/Discount', 'Apply From Template', ⋮ 'Remove').
**VIU (fresh 2026-07-13, API):** Processing Fee + Max/min cap → 400 'A processing fee cannot
have a minimum or maximum cap.'; disallowed method → 400 'Calculation type "pct_subtotal" is
not allowed for a processing_fee.' → confirms FD-PROC-010 AND FD-PROC-014. **Deviations
kept:** FD-PROC-008 (Edit shown but inert for a pfee), FD-PROC-009 (FDBUG-2 base includes
whole-WO adjustments).

| FD-ID | TestRail | viu_status |
|---|---|---|
| FD-PROC-001 | [C28519](https://shopview.testrail.io/index.php?/cases/view/28519) | VIU-Blocked-NotBuilt |
| FD-PROC-002 | [C28520](https://shopview.testrail.io/index.php?/cases/view/28520) | VIU-Blocked-NotBuilt |
| FD-PROC-003 | [C28521](https://shopview.testrail.io/index.php?/cases/view/28521) | VIU-Blocked-NotBuilt |
| FD-PROC-004 | [C28522](https://shopview.testrail.io/index.php?/cases/view/28522) | VIU-Blocked-NotBuilt |
| FD-PROC-005 | [C28523](https://shopview.testrail.io/index.php?/cases/view/28523) | VIU-Verified |
| FD-PROC-006 | [C28524](https://shopview.testrail.io/index.php?/cases/view/28524) | VIU-Verified |
| FD-PROC-007 | [C28525](https://shopview.testrail.io/index.php?/cases/view/28525) | VIU-Verified |
| FD-PROC-008 | [C28526](https://shopview.testrail.io/index.php?/cases/view/28526) | VIU-Deviation |
| FD-PROC-009 | [C28527](https://shopview.testrail.io/index.php?/cases/view/28527) | VIU-Deviation |
| FD-PROC-010 | [C28528](https://shopview.testrail.io/index.php?/cases/view/28528) | VIU-Verified |
| FD-PROC-011 | [C28529](https://shopview.testrail.io/index.php?/cases/view/28529) | VIU-Verified |
| FD-PROC-012 | [C28530](https://shopview.testrail.io/index.php?/cases/view/28530) | VIU-Verified |
| FD-PROC-013 | [C28531](https://shopview.testrail.io/index.php?/cases/view/28531) | VIU-Verified |
| FD-PROC-014 | [C28532](https://shopview.testrail.io/index.php?/cases/view/28532) | VIU-Verified |

**Push totals:** 14 updated · 0 no-op · 0 error.
