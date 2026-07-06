# Fees & Discounts — RESUME STRATEGY

> **Purpose:** a concise, actionable playbook so this project can restart cleanly
> the moment staging is redeployed with the Fees & Discounts feature. Everything
> below is grounded in what we already have on disk:
> `requirements.md` (complete spec, Stories 1–14 + §5 calc contract + Story 13
> permissions), `design-notes.md` (5 HTML mockups + design↔spec discrepancies),
> `viu-findings.md` (current: feature not deployed), and the Loom POC transcript.
>
> **Standing rules that govern this whole plan (from CLAUDE.md):**
> - VIU first — **no vague cases**; build every case from what the app *actually*
>   does, not just the spec.
> - Staging is disposable: mark throwaway data `ZZAUTOTEST`, use **exact-user-match**
>   on role changes, and **restore Tech to Time Clock** after any permission testing.
> - **Never** write to TestRail (cases/runs/results) without explicit user permission,
>   and confirm which project first.
> - **No secrets in the repo** — cookies/tokens live in `/tmp` only.

---

## 1. CURRENT STATE (as of this pause — 2026-07-06)

**What we HAVE (complete, on disk):**
- **COMPLETE spec** — `build/fees-discounts/requirements.md`: Stories 1–14, the full
  §5 calculation contract (§5-R1…R14), §6 QuickBooks (S6-R1…R13), §7 toast table,
  and the **Story 13 permission mapping** (action → existing Custom Roles permission).
- **COMPLETE designs** — `build/fees-discounts/design-notes.md`: extracted verbatim
  from **5 HTML mockups** (Work Order Line, Work Order Line v1, Customer Page, Parts
  Page, bundled) — all labels, columns, options, modals, and calc-preview logic —
  plus a **§10 design↔spec discrepancy list**.
- **Loom transcript** (summary) — `/tmp/fees-discounts/loom-transcript.txt`
  (ephemeral; POC "Fees and Discounts POC"). Key notes: templates filter by scope
  (labor modal only shows labor templates, etc.); whole-WO F&D list is **descending /
  creation order**; edit + delete on everything; scope links open a full breakdown;
  and a **known build bug** — the part-sale breakdown is mis-attributing labor
  underneath a part ("this does not actually belong here").
- **Staging admin access proven** — quick-login `key:'admin'`, boot2 hydration,
  MITM bridge pattern (see `build/TESTING-RUNBOOK.md`). Tools in
  `build/testing-tools/` (`staging-admin.mjs`, `staging-api.mjs`, `staging-bridge.mjs`,
  `staging-boot2.mjs`, `staging-restore-tech.mjs`, `testrail-api.mjs`).

**What we VERIFIED (see `viu-findings.md` + `screenshots/`):**
- The **`FeesAndDiscounts` feature flag is ENABLED** for org
  `d55bc308-e61a-438d-b5f1-c7a73c89d49f` — confirmed both in
  `GET /api/organization/feature-flags?organization_id=d55bc308-…` (present in the
  org's curated enabled set) and on the Administration → Feature Flags page
  (`viu-50-feature-flags.png`).
- **BUT the feature is NOT deployed / not exercisable.** Concretely:
  - **No** fee/discount permission key in `fe-permissions`.
  - **No** adjustments / fees_and_discounts collection on a work order's JSON.
  - **All** fees/discounts endpoints return **404**.
  - **ZERO** F&D controls render on **any** surface — WO toolbar/⋯, labor-line ⋮,
    sidebar "WO Fee/Discount" card, Stats section, Financial Info row, Parts column,
    Customer "Fees & Discounts" tab, Administration → Service templates. Both
    frontend and backend layers are absent (not a "frontend-only" split).
- **Dev team is deploying Fees & Discounts to staging** (~2 hours from this pause).

**Bottom line:** we can write nothing final yet — cases must be VIU-grounded, and
there is nothing live to verify. Resume when the deploy lands.

---

## 2. WHEN STAGING IS BACK — STEP BY STEP

### a. Get fresh access
- Staging sessions expire ~1 hour, so get **FRESH** cookies each run.
- If the tools aren't already staged, copy `build/testing-tools/*` to `/tmp`.
- Write cookies to `/tmp/cln/cookies.json`, `chmod 600`. **Never** commit them.
- Build a **fresh MITM bridge** (port rotates — read `$HTTPS_PROXY` live), then use
  the **boot2** hydration pattern (seed cookies + localStorage `user` /
  `fe_permissions_wrapper` / `token`, THEN navigate). DEV login buttons are unreliable.
- Confirm **admin quick-login returns 200** before proceeding.

### b. RE-VERIFY the feature is actually live (do NOT assume)
Repeat the four `viu-findings.md` probes; **all must now be TRUE**:
1. `fe-permissions` now includes fee/discount permission key(s).
2. A work order's JSON now carries an **adjustments / fees_and_discounts** collection.
3. The fees/discounts **endpoints return 200** — discover the **real route names**
   at this point (record them; they are an open item, §4).
4. The **UI renders F&D controls** on the surfaces that were empty before.

**If any are still absent → STOP and report "still not deployed."** Do not start
writing cases against a half-deployed build.

### c. FULL VIU — exercise every surface on disposable data
Record **actual behavior + screenshots** for each. Pull exact expected labels/values
from `requirements.md` and `design-notes.md`. Mark throwaway data `ZZAUTOTEST`.
Checklist by surface:

- **Work Order** (Stories 1–4, 12):
  - Whole-WO adjustment via toolbar ⋯ ("Add Work Order Fee / Discount", S1-R1).
  - Labor-line adjustment via the line's 3-dot menu (locked Labor Line scope, S1-R3).
  - Part-line adjustment via a part's menu (staged + requested parts, S1-R4/R5).
  - **Add dialog** (Story 2): Apply-from-template list (scope-filtered, S2-R14…R17;
    hint "Showing templates compatible with this line."), Name (100 chars, S2-R19),
    Type (Fee/Discount, default Fee, S2-R20), Calculation type (options by scope,
    §5-R10), Amount vs Percent input (S2-R23), Max Amount (percentage only, S2-R24),
    Taxable Yes/No (default Yes, S2-R26), and the **live preview** (target now →
    adjustment → new value; "Base ·" rows; "Tax is recalculated on save."; green
    fee / red discount only here, S2-R31…R42).
  - Inline line/part display: "↳" arrow, name, **signed rate badge**, resolved
    amount in **plain grey**, per-line Total = gross + that line's adjustments
    (S3-R12…R19), "Show N more"/"Show less" for ≥2 (S3-R15/R16).
  - **Stats** "Fees & Discounts (N)" section: "%" + "Amount" columns, signed rows,
    scope links, Total row (S4-R1…R6).
  - **Financial Info** "Fees & Discounts (N)" row: read-only, collapsed by default,
    net total, creation-order list (S3-R20…R24).
  - **"WO Fees & Discounts" sidebar card**: whole-WO only, hidden when none, signed
    rate badge, grey resolved amount, hover 3-dot Edit/Delete, no Add control
    (S3-R3…R11); Processing Fee entry is **Delete-only** (S8-R17).
  - **Edit** dialog: which fields lock (Type + Calculation type locked, S2-R5;
    scope/target locked, S2-R8; Name/value/Max/Taxable editable, S2-R4).
  - **Remove**: confirm dialog title "Remove Fee / Discount", body
    'Remove "{name}" from this work order?', red "Remove" button (S3-R11a).
  - Creation/**descending** order and "Show N more" (per Loom + §5-R9).

- **Parts page** (Story 11):
  - "FEES & DISCOUNTS" column three states: single (name + rate), "+N" badge,
    "+ Add" (S11-R9/R10).
  - Add to a **Pending/requested** part (S11-R4b, §5-R13).
  - Per-part **breakdown viewer**: Name/Type/Calculation/Amount/Max Amount, Net
    adjustment, per-row remove, Close-only (S11-R11…R17).
  - Flat Amount on a Part Line = **per item** (amount × qty, §5-R14): e.g. $5 × 3 = −$15.

- **Customer page** (Story 9):
  - "Fees & Discounts (N)" tab + "Default Fees & Discounts" card + caption (S9-R11…R14).
  - Table columns: Name / Type / Calculation Type / Amount / Max Amount / Taxable /
    Auto-Apply to Work Orders (S9-R15; note design shows Auto-Apply column).
  - "Add Fee/Discount" multi-select template picker (S9-R18…R22); Remove (no confirm,
    S9-R24).
  - **Auto-apply to new WOs** (S9-R2/R3, independent copy).
  - Delete-template-vs-existing-adjustments behavior (S9-R8/R9, S7-R4).

- **Template admin** (Story 7): Administration → Service → **Fees & Discounts**
  (below Canned Lines, S7-R7). Create/edit/delete template; fields Type
  (Fee/Discount/**Processing Fee**), Calculation type, Name, Amount/Percent, Max
  Amount (percentage only), Taxable, **Auto-apply** checkbox (S7-R12); toasts
  ("Fee added"/"Processing fee added" etc., S7-R18); delete confirm + customer-default
  warning (S7-R20/R21).

- **Processing Fee** (Story 8): template-only, whole-WO, Flat **or % of Grand Total**
  (tax-inclusive base), **no Max Amount**, **no manual add**, **remove-not-edit** on a
  WO. Verify the **legal disclosure text** renders below Taxable — capture literal
  wording (open item §4).

- **Finance / estimate / invoice + QuickBooks** (Stories 5, 6, 14):
  - Customer document layout: per-line adjustments indented with "↳" + phrase
    "(% of labor)"/"(% of parts)"; discount in accounting brackets "($X.XX)";
    whole-WO "Adjustments" block in creation order; line-level grouped "(×N)"
    (S5-R2…R9).
  - QuickBooks: each F&D = its own invoice line item (fee +, discount −); $0.00 lines
    skipped; description = adjustment name, item = mapped Fee/Discount item; **mapping
    guard** blocks add per-kind (S6-R6); negative-total **floor at $0.00** with carried
    **credit memo** + mandatory warning (S6-R10…R13).
  - Shop Supplies hidden on estimate/invoice/financial tab when $0.00 (S14).

- **History log** (Story 10): add/edit/remove each = one entry; event bold labels
  ("Fee added"/"Discount updated"/…); Line column "−"; Details Name/Type/Amount
  (set rate, not resolved)/Applied to ("Full invoice"/"Labor line"/"Part"). Gated by
  **View History Logs**; entries stay visible even with F&D UI hidden (S10, S13-R10).

### d. VERIFY THE CALCULATION CONTRACT (§5) with the spec's worked examples
- 10% fee on $150.00 → **$15.00** (§5-R3).
- 5% discount on $33.33 → $1.6665 → **$1.67** (round half-cent **up**).
- 3% Processing Fee on Grand Total $324 → **+$9.72** (§5-R4 worked example).
- $5.00 flat Part-Line discount × qty 3 → **−$15.00** (§5-R14).
- Percentage **discount cap 100%** (§5-R2); percentage **fee** uncapped.
- **Max Amount** clamps a percentage: 20% fee on $100 → $20 → Max $15 → **+$15**.
- **$0 / negative base → $0.00** (§5-R3/R8).
- Taxable adjustment raises/lowers the taxable amount; non-taxable doesn't (§5-R11).
- **3-step resolution order:** line-level gross (Step 1) → whole-WO net (Step 2) →
  Processing Fee on Grand Total (Step 3); no stacking within a step (§5-R5).

### e. VERIFY the STORY 13 PERMISSION MATRIX
Assign **ZZAUTOTEST** roles to **Tech** (exact-user-match; Tech `/change` staff_id
`6fb22c1b-…`, NOT the staff-list id) and check each gate, then **restore Tech to Time
Clock** (`staging-restore-tech.mjs`; role `77b069d1-…`):
- **See Financial Data** gates all $ visibility (S13-R2, S13-N1).
- Whole-WO add/edit/remove → **Work Orders: Create and Edit** (S13-R3).
- Labor/Part-line add/edit/remove → **Work Order Lines: Create and Edit** (S13-R4).
- Part Sale part adjustment → **Part Sales: Create and Edit** (S13-R5).
- **Remove uses "Create and Edit", NOT "Delete"** (S13-R7).
- Template admin → **Settings → Finance** (S13-R8).
- Customer defaults → **Customer Management: Create and Edit** AND **Manage Accounts
  Payable and Receivable** (S13-R9, S13-N3).
- F&D history entries → **View History Logs** (S13-R10).
- **Feature flag OFF** hides everything except the history log (Story 10).

> **CAUTION (CLAUDE.md):** Story 13 is the *target* Custom-Roles model (SV-7388) and
> several F&D-adjacent spec changes may not be live yet. Record what staging actually
> enforces vs the spec; flag divergences rather than assuming the spec.

### f. RESOLVE the design↔spec discrepancies via VIU (from design-notes §10)
Record what staging **actually does** for each:
- Is there a **calc-base selector** (Subtotal / Labor Total / Parts Total) in the Add
  modal? (Design mock had none; spec §5 implies bases exist.)
- Is there a **Taxable** field in the Add/Edit modal? (Design collected it only on the
  customer tab.)
- Is there a **Processing Fee** type in the template builder (and only there)?
- Which **template list** is real — the 6-entry dropdown or the 8-entry picker?
- **Remove vs Delete** wording per surface.

### g. CHECK known bugs
- **Loom's part-sale breakdown mis-attribution** — labor showing underneath a part on
  a part sale where it "does not belong."
- **Auto-apply + customer-default double-add** (S9 known gap): a template that is both
  location auto-apply and a customer default should yield **one** adjustment, but may
  add **twice**. Treat a double-add as a known defect, not a spec requirement.

Findings from (f) and (g) feed the **VIU tab** of the deliverable.

---

## 3. THEN BUILD THE DELIVERABLE

- **Excel of manual test cases**, in the SIMPLEST form for a manual QA tester:
  numbered **Preconditions / Steps / Expected**, each concrete (no vague steps),
  grounded in **VIU behavior + spec**. Organize **by surface / story**.
- Include a **separate "VIU" tab** for observations + anything still unclear. Any
  item that could not be verified live must be **clearly flagged** as not-verified.
- Follow the user's Excel convention: a **tab per result status** + a **Summary** tab
  (when this becomes an execution deliverable).
- **Deliver the Excel for user review FIRST.** Only after the user **explicitly
  approves** do we upload/assign to TestRail — and **confirm which project** first
  (standing rule: never write TestRail without explicit permission). When logging a
  run, **log only Passed cases to TestRail**; Failed/Retest/Blocked stay in the local
  per-status report.

---

## 4. OPEN QUESTIONS to resolve during VIU

(Carried from `requirements.md §14` and `design-notes.md §9–10`.)
1. **Whole-Work-Order Flat Amount base** — §5-R4 lists explicit bases only for the
   three percentage methods; confirm Whole-WO Flat = "the set amount" with no base row.
2. **"History mode" definition** — a Story 1 prerequisite ("user not in history mode")
   that the spec never defines. Confirm what puts a user in history mode.
3. **Processing Fee legal disclosure literal text** — spec says render "exactly as
   written" but the wording itself isn't in the export. Capture the literal text from
   the live dialog / legal before asserting it.
4. **Auto-apply + customer-default duplication** — known bug (§2g); verify current
   behavior.
5. **Endpoint route names** — discover live during step 2b (all endpoints 404 today).
6. **Design↔spec items** from §2f (base selector, Taxable in modal, Processing Fee
   type, which template list, Remove vs Delete wording).

---

## Quick-reference IDs (non-secret; detail in CLAUDE.md / runbook)
- Org: `d55bc308-e61a-438d-b5f1-c7a73c89d49f` (FeesAndDiscounts flag ON).
- Tech `/change` staff_id: `6fb22c1b-…` (NOT the staff-list id `a7fd0a88-…`).
- Time Clock role (restore target): `77b069d1-…`; workplace `b3c8c820-…`.
- Staging: `app.staging.shopview.com` (SPA) / `api.staging.shopview.com` (Symfony).
- Evidence for current state: `viu-findings.md` + `build/fees-discounts/screenshots/`.
</content>
</invoke>
