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
