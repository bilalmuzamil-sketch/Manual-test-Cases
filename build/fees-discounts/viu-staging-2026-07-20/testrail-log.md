# F&D LIVE VIU on STAGING — 2026-07-20 (per-case log + TestRail audit)

**Host confirmed:** `app.staging.shopview.com` / API `api.staging.shopview.com`
(cookie domain `.staging.shopview.com`). Quick-login `{key:'admin'}` → 200;
`GET /api/auth/me/fe-permissions` → 200 (42 perms). Org `d55bc308-e61a-438d-b5f1-c7a73c89d49f`.
**Feature flags ENABLED on staging:** `FeesAndDiscounts`, `PartSales`, `QuickBooks`,
`Deposits`, `LateFeesMvp`, `CustomerPortal` (full list in ff3 probe). This differs from
qb.qa where Part Sales / Processing-Fee builder were Not-Built.

Evidence dir: `build/fees-discounts/viu-staging-2026-07-20/` (screenshots + net logs).
Method: Chromium boot2 (direct `$HTTPS_PROXY`, cookies seeded, localStorage hydrated),
live-observed on-screen; API via node fetch + `NODE_USE_ENV_PROXY=1`.

The §5-R15 note exact spec string = **"Tax treatment varies by jurisdiction — confirm your local requirements before saving."**

---

## PRIORITY 1 — Chris Q1=B (§5-R15 note below EVERY Taxable control) — LIVE OBSERVED

| Surface | Observed? | Note present | Evidence |
|---|---|---|---|
| (c) Admin fee-template dialog — Type=Fee (default) | YES | **PRESENT** | tmpl-new-default.png |
| (c) Admin fee-template dialog — Type=Processing Fee | YES | **PRESENT** | proc-fee-full.png, proc-fee-calc-open.png |
| (a) WO Add Fee/Discount dialog ("Add new fee/discount") | YES | **PRESENT** | wo-add-dialog-final.png |
| (a) WO Edit dialog ("Edit Fee / Discount") | YES | **PRESENT** | wo-fee-edit-dialog.png |
| (b) Part Sale Add/Edit dialog | (pending) | | |

### FD-WO-016 (C29441) — VIU-Deviation → **VIU-Verified**
The §5-R15 note IS now built. Observed directly below the Taxable Yes/No toggle in BOTH
the WO **Add** dialog ("Add new fee/discount") and the WO **Edit** dialog ("Edit Fee /
Discount"), exact string. Prior 2026-07-13 qb VIU had it ABSENT; staging build has it.
Evidence: wo-add-dialog-final.png, wo-fee-edit-dialog.png. TestRail: expected already
build-accurate (asserts the exact string) → status flip local; wording no-op unless diff.

### FD-PROC-004 (C28522) — VIU-Blocked-NotBuilt → **VIU-Verified**
Processing-Fee builder now built (admin template dialog, Type=Processing Fee): Taxable
defaults to **Yes** and the §5-R15 note shows directly below Taxable, exact string.
Evidence: proc-fee-full.png. (Was Blocked-NotBuilt on qb — builder absent.)

## PRIORITY 2 — Processing-Fee builder (deployment-sensitive; were Blocked-NotBuilt)

### FD-PROC-001 (C28519) — Blocked-NotBuilt → **VIU-Verified**
Type dropdown in the New Fee / Discount template dialog offers exactly **Fee, Discount,
Processing Fee**. Evidence: proc-type-open (TYPE OPTIONS: Fee, Discount, Processing Fee).

### FD-PROC-002 (C28520) — Blocked-NotBuilt → **VIU-Verified**
With Type=Processing Fee, Calculation Type offers exactly **Flat Amount** (default) and
**% of Grand Total** — only two options (Fee shows the four Flat/% of Labor/Parts/Subtotal).
Evidence: proc-fee-calc-open.png.

### FD-PROC-003 (C28521) — Blocked-NotBuilt → **VIU-Verified**
No **Max Amount** field is shown for a Processing Fee under either method. Evidence:
proc-fee-full.png (dialog has no Max Amount row); confirmed for Flat Amount + % of Grand Total.

## PRIORITY 1(b) — Part Sale Add/Edit dialog note (Story 11) — LIVE OBSERVED
Part Sales feature is BUILT on staging (PartSales flag ON). Part Sale detail =
`/parts/part-sale/{id}/part-requests`.
- **Whole part-sale** ⋮ menu = "Add Parts Sale Fee / Discount" (S11-R4a) → dialog
  "Add new fee/discount" → **note PRESENT**. Evidence: ps-wholesale-dialog.png.
- **Part-line** row ⋮ menu = "Add Fee / Discount" (S11-R4b) → dialog "Add new
  fee/discount" with subtitle **"Applying to: Part — (NL245-04) #04 NEXUS SAE100R5..."**
  (S11-R6a) → **note PRESENT**. Evidence: psB4-filled.png / psA-partline-dialog2 log.
→ Chris Q1=B satisfied for the Part Sale surface. NEW CASE authored (see below).

## PRIORITY 2 — Parts-page Fees & Discounts column (Story 11) — were Blocked-NotBuilt → VERIFIED
All observed live on part sales P3-1068 (approved) and P3-1088 (paid):
- **FD-PCOL-001 (C28469)** → **VIU-Verified**: column shows single fee/discount name+rate
  (e.g. "Fee $6.00", "Discount −11%", "Flat Fee $5.00"). Evidence: ps-scrolled/psJ.
- **FD-PCOL-002 (C28470)** → **VIU-Verified**: after seeding a 2nd fee the cell shows the
  "+N" badge ("Fee $6.00 +1"; "Flat Fee 2 $4.00 +2" on P3-1079). Evidence: psB4-badge.png.
- **FD-PCOL-003 (C28471)** → **VIU-Verified**: a part with no fee shows a "+ Add" button
  (observed on P3-1088). Add on an editable sale confirmed working via the row ⋮ →
  Add Fee/Discount flow on P3-1068.
- **FD-PCOL-004 (C28472)** → **VIU-Verified**: clicking a filled cell opens the viewer
  "Fees & Discounts" (subtitle = part label) with columns **Name, Type, Calculation,
  Amount, Max Amount** (S11-R11/R12). Evidence: psC-viewer2rows.png.
- **FD-PCOL-005 (C28473)** → **VIU-Verified**: viewer "Net adjustment" row = signed sum
  (2 fees +$12.00 + $2.00 → Net +$14.00; single → +$12.00). Evidence: psC-viewer2rows.png.
- **FD-PCOL-006 (C28474)** → **VIU-Verified**: per-row delete → confirm "Remove Fee /
  Discount — Are you sure you want to remove this fee?" → Remove → row removed, Net
  updated, badge reverts to single. Evidence: psE-confirm.png / psE-afterremove.png.
  (My ZZAUTOTEST seed fee removed = cleanup complete; P3-1068 restored.)
- **FD-PCOL-007 (C28475)** → **VIU-Verified**: on the Paid sale P3-1088 the "+ Add"
  button is DISABLED (btnDisabled=true; sale can't be edited). Evidence: psH2-invoiced.png.

Also incidentally re-confirmed (Add button disabled until valid on the part-sale dialog
= FD-WO-005 / FD-VAL-001 behavior) — Add Fee button stays disabled until Name+Amount set.

## Q2=A SFD-gate negative (Chris) + FD-WO-016/FD-PROC-004 gate — LIVE OBSERVED
The Tech user on staging ALREADY carries the exact Q2 negative profile:
`fe_permissions` includes **settingsFinance** (Manage Finance Settings) but NOT
`seeFinancialData`; `cross_toggles.seeFinancialData=false` (confirmed via
`GET /api/auth/me/fe-permissions` as tech). No role seeding needed.
- **As Tech (MFS, no SFD):** admin Fees & Discounts page + "New Fee / Discount" dialog
  ARE accessible; the Taxable toggle shows **Yes** but the jurisdiction NOTE is
  **ABSENT**. Evidence: tech-tmpl-dialog.png.
- **As Admin (has SFD):** same dialog shows the note. Evidence: tmpl-new-default.png.
→ **Chris Q2=A CONFIRMED** (admin fee-template dialog is the one place the SFD gate is
  observable) and the **FD-WO-016 / FD-PROC-004 "note shown only to users with See
  Financial Data" gate is VERIFIED LIVE** (V1_3 Δ1).

## FD-PERM-004 (C28588) — Blocked-NotBuilt → VIU-Verified (part-sale permission gate)
- Positive: Admin (has partSalesCreateAndEdit + SFD) can add/edit/remove part-sale
  fees/discounts — observed (seeded + removed a part-line fee on P3-1068).
- Negative: Tech (partSalesCreateAndEdit=false, partSalesView=false, SFD=false) has the
  **Parts nav entirely hidden** → the Part Sales area and its F&D controls are
  unreachable. Evidence: tech-ps run log (Parts nav visible=0).
→ Requires Part Sales: Create and Edit (+ See Financial Data) as spec'd. VIU-Verified.
  (Note: Tech lacks all three perms, so the negative is broad, not isolated to C&E.)

## SUMMARY OF 12 BLOCKED-NOTBUILT → all VIU-Verified on staging
FD-PROC-001/002/003/004, FD-PCOL-001/002/003/004/005/006/007, FD-PERM-004.
Cause: staging has PartSales flag ON + the Processing-Fee builder shipped (both were
absent on qb.qa). Cleanup: ZZAUTOTEST seed fee removed; no residual test data.
