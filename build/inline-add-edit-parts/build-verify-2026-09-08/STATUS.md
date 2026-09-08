# Build verification 2026-09-08 — 6597 (Inline Add Part) & 6617 (WO Print) on sv9315 v26.35.9-7f2e4fa

**Order:** build-verify both suites. **Rule 81 gate clean** — both source-verified 2026-09-07 and
re-confirmed today 2026-09-08 (GO verdicts in each suite's `RECHECK-2026-09-08.md`); no source pass to
run. Signed in as administrator (42 fe_permissions), Full View. Only foreign lock is invoice-ui-refresh
(different suite) — no collision.

## Verified on v26.35.9 this pass

| What | Result | Evidence |
|---|---|---|
| **6617 — the Print route** | **CONFIRMED.** The work-order More menu (three dots, header) reads exactly `Audit Log · Timesheets (0) · Add Work Order Fee / Discount · Print Work Order · Delete Work Order` on an Estimate WO — matching the recorded route; `Print Work Order` present | `verify_c45047_print.mjs` output; kebab#0 top=94 |
| **6597 — the inline Add Part route** | **CONFIRMED.** `+ Add Part` on a line's Parts section opens the inline row with `Description · Part number · Qty` and `Save` / `Cancel` | `verify_routes.mjs`, `inline-row.png` |
| **C53477 barred label** | **FIXED** — `Work Order View Mode set to Full View` → the `"Work orders"` section's `"View mode"` set to `"Full View"` (canonical C45222 phrasing). Label gate now clears except Vladimir's two |
| **Sources** | current as of today (2026-09-08), both suites |

## Suite-gate state (live)

- **6617:** 44 cases, all gates green **except stale build stamps** (name `v26.35.6-598cc8a`; build is now `v26.35.9-7f2e4fa`). 2 Automated (C45107, C45123) — read, not written.
- **6597:** 127 cases (123 ours + **4 Vladimir Tomovic's, hands-off**: C45220, C45268, C53474, C53475). Stamps stale. Label gate clear except C53474/C53475 — Vladimir's automated cases whose `ZZAUTOTEST …` strings are **test-data names, not build labels** (Rule 38, reported not edited). 2 new cases since last census: C53474, C53475 (Vladimir's).

## Left to do (concrete, for a session to pick up)

1. **C45047 modal-cancel behaviour** (build-check line removed 2026-09-07 — MUST re-check on the build).
   Its exact live drive needs the inline row opened on an **editable** line then `More options` → change
   a field → Cancel → observe: **no confirmation, returns to the inline row, original values kept, modal
   change not carried back** (the reversed 2026-09-04 behaviour). On sv9315, an **Estimate** WO is
   needed (all the top WOs are `Complete`, locked). The `More options` modal is `New Part Request` /
   `Edit Part Request` with the Cancel control labelled `Cancel Order`. Scripts:
   `c45047.mjs` (needs the right line expanded before `+ Add Part` yields the inline row).
2. **The other 4 source-changed cases** (2026-09-07 deltas): C45001, C45039, C45232, plus C45047 — each
   needs its specific behaviour re-checked on v26.35.9.
3. **Build-stamp re-stamp** (v26.35.6 → v26.35.9): 44 cases in 6617, ~114 in 6597. **A stamp must reflect
   an actual check (Rule 54), so this is NOT a find-replace.** The two suites' CORE routes are confirmed
   unchanged v26.35.6→v26.35.9 (above), which supports re-stamping cases that depend only on those
   routes — but that is a QA-lead call (per-case behavioural re-check vs core-route-confirmation), see the
   OUTSTANDING ask in the report.
