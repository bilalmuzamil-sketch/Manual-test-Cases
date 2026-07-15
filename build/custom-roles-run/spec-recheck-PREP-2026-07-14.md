# Custom Roles (SV-7388) — Spec-Recheck + VIU PREP (offline) — 2026-07-14

> **Purpose.** Vlad (automation) reports Custom Roles **nightly failures caused by
> test-case-vs-spec mismatch** and asked for a spec-recheck + VIU. This is the
> **OFFLINE prep** so we can execute fast once the user supplies (a) the CURRENT
> Confluence page and (b) the DONE SV-7388 Jira tickets. Atlassian is login-walled
> in this env — **we cannot fetch either**; both must be exported/pasted.
> **READ-ONLY prep: no env, no TestRail writes, no case edits were performed.**
> Canonical resume docs this builds on: `WORDING-VIU-STATE-2026-07-13.md`,
> `viu-scope-2026-07-13.md`, `PROD-VS-STAGING-STATE-2026-07-14.md`,
> `../custom-roles-spec-update/updated-spec-diff.md`.

---

## 1. Case inventory (where the Custom Roles cases are NOW)

### 1a. Local editable source — `build/custom-roles-run/cases-2026-07-13/`
- **269 case JSON bodies** (one file per case, filename = `C<id>.json`; each carries
  `case_id` + `section_id` + `viu_status` + `evidence` + `fresh_run:2026-07-13`).
  **No `testrail-id-map.csv`** for Custom Roles — the filename IS the C-ID.
- ID range **C26307 → C29460**.
- This is **+15 cases vs the 254 in `WORDING-VIU-STATE-2026-07-13.md`.** The +15 are
  the **Time-Clock API backend-enforcement cases C29446–C29460** authored after that
  doc (see 1c).

**Local tally (269) reconciled to the canonical doc:**
| Bucket | 254-case doc | +15 API cases | Local now (269) |
|---|---:|---:|---:|
| VIU-Verified | 204 | +11 | **215** |
| Blocked-UI (manual / 2nd-user residue) | 39 | +0 | **39** |
| Deviation / Finding (route to dev) | 11 | +4 | **15** |
| **TOTAL** | **254** | **15** | **269** |

(Non-verified = 54 = 39 Blocked-UI + 15 Deviation. The 4 new deviations = the 4
Time-Clock API leak-bugs; see §4.)

### 1b. TestRail — section 3527 subtree ("Custom Roles - (Revised)")
Per `viu-scope-2026-07-13.md` (sized from the Jul 8–9 TestRail cache; **re-pull before
any edit**):
- Section **3527** = 57 child sections, ~726 cases total. **Core in-scope = 3528–3553
  (26 sections, 249 cases)** — the wording+VIU target.
- Standing-OUT (unless told otherwise): Backend API & Security **3554** (38), Digital
  Inspections per-role **3647–3657** (143), Regression Suite / Minja API **3667–3677**
  (116), SV-7388 Combo+Breakage **3642–3645** (180, "Phase-2 / confirm").
- Local `cases-2026-07-13/` covers the core 3528–3553 subtree + 2 moved-in stubs +
  section **4091** (new API section, see 1c). Sections present in the local source and
  their case counts: 3528(18) 3529(16) 3530(8) 3531(5) 3532(5) 3533(14) 3534(18)
  3535(9) 3536(5) 3537(8) 3538(15) 3539(13) 3540(7) 3541(6) 3542(14) 3543(15) 3544(10)
  3545(12) 3546(2) 3547(5) 3548(12) 3549(13) 3550(3) 3551(3) 3552(8) 3553(10) **4091(15)**.

### 1c. The 15 Time-Clock API cases — C29446–C29460 (section **4091**)
- **All 15 live in section 4091**, an **API-titled section** (satisfies Standing Rule 4
  — API endpoints/HTTP verbs/status codes must sit in an API-named section).
- **NOTE:** the task brief mentioned "the new API section 4091/4092-etc." **Only 4091
  exists in the local source; there is no 4092** among the local case bodies. If a
  4092 exists in TestRail it is not represented locally — verify against a fresh
  TestRail pull.
- Breakdown: **11 VIU-Verified** (correct enforcement) + **4 Deviation = 4 backend
  leak-bugs** (C29457 Settings read 200, C29458 Taxes read 200, C29459 Customer
  create 201, C29460 WO create not-403). Full evidence:
  `CustomRoles_TimeClock-API-Enforcement_2026-07-13.md` + JIRA draft
  `JIRA-comment-timeclock-BE-2026-07-13.md`. Linked bug: *BE — Time Clock Role
  Permissions Not Properly Enforced.*

### 1d. Section-3658 stub tree — RESOLVED (context for the recheck)
Original 10-case stub tree fully resolved 2026-07-13: 3 dups deleted, 2 moved into
3527 (**C27731→3549 Migration**, **C27736→3545 AP/AR**), 5 stubs deleted (QA-lead
authorized: C27729/30/32/34/38). **Section 3658 subtree (3658 + 3659–3665) is now
EMPTY = candidate for section removal** (reported, not deleted; needs separate OK).
Detail: `section-3658-resolution-2026-07-13.md`, `section-3658-dedupe-2026-07-13.md`.

---

## 2. Spec-version-on-file audit (what we hold vs the canonical page)

### 2a. What we hold
- **On-file spec:** `build/custom-roles-spec-update/updated-spec-source.md` (verbatim
  readable copy). **Exported 09 Jul 2026 11:05 UTC.**
- **Newest Change-Log row on file: 09 Jul 2026** (Sasha Grosman) — "Clarified See
  Financial Data applies to Core app, not Customer Portal, Billing Portal, and
  Settings pages." Prior daily rows go back through 01 Jun → 08 Jul 2026.
- **Companion diff already computed:** `updated-spec-diff.md` (Phase-1 diff of the 09
  Jul export vs the RUN-331 160-case set → 3 UPDATED / 16 FLAGGED / ~141 unaffected).

### 2b. Is it current? — **PROBABLY STALE. Cannot confirm without the user.**
- The **canonical current page = Confluence pageId 565116952** ("Custom Roles and
  Permissions", SV-7388, Owner Sasha Grosman). **We CANNOT FETCH IT** (Atlassian SSO
  login-wall). Authoritative reconciliation **REQUIRES the user to export/paste the
  current page.**
- **Risk read:** our copy is dated 09 Jul; today is **15 Jul** = 6 days old. The change
  log shows Sasha edited the page **almost daily through early July** — so a 6-day gap
  very plausibly contains newer changes. **Vlad's nightly runs against the LIVE current
  doc**, so any post-09-Jul change is a prime candidate for the mismatch he sees. Treat
  the on-file spec as a **diff baseline, not ground truth.**

### 2c. What our on-file spec covers (for a fast diff when the current page arrives)
Top-level structure of `updated-spec-source.md`:
- **§1 CRUD Areas:** 1a Work Orders · 1b Work Order Lines · 1d Customer Management ·
  1e Part Sales · 1f Catalog and Inventory · 1g Vendor and Order Management ·
  **1h View Part History** (renamed from "View History Logs") · 1i Invoicing ·
  1j Timesheets (no Delete).
- **§2 Page Access Toggles:** 2a Reports · 2b Customer Portal · 2c Billing Portal ·
  2d Parts Department (parent gate).
- **§3 Settings Access** (sub-settings incl. Integrations = QuickBooks/IBS/Open API;
  Departments under App Settings).
- **§4 View Mode** (Tech vs Full; Time Clock = empty).
- **§5 Cross-Cutting Toggles:** 5a See Financial Data · 5b Manage Accounts Payable and
  Receivable (renamed from "View and Manage AP/AR"; requires SFD ON).
- **Admin pages:** Roles list / Create-Edit / Financial-Data Confirmation Modal /
  Delete Role / Permission Summary / Staff Page.
- **System Role Templates + Permission Matrix + Role Descriptions** (11 shipped; prose
  still says 12 = dropped Owner merged into Admin).
- **Migration Plan** (legacy→new mapping + behavior changes) · **Staff Record Settings**
  · **Office Users Cannot Create Invoices** · Key Decisions · Open Questions · Change
  Log (last row 09 Jul 2026).

**Key deltas already captured (from `updated-spec-diff.md`) — use as the diff crib:**
1. View History Logs → **View Part History** (inventory only; WO audit log now = WO
   Create&Edit; story history = WOL View). 2. AP/AR aging → **Reports** permission
   (all-or-nothing). 3. **Reverse Invoice → WO Delete** (was Invoicing Delete). 4.
   **Order Parts** controls WO Parts tab + requires SFD. 5. SFD OFF → **prompt** to
   disable dependents. 6. Manage AP/AR **requires SFD ON** + gates sensitive Vendor
   fields. 7. Customer Portal default ON for SA/SSA/SM/PM(+Admin). 8. Notes model (WO
   View = create/edit any note; WO Delete = delete any; **customer notes = Customer
   Management**). 9. Send to Portal = Full View; Send to Terminal = Invoicing C&E +
   Customer Portal ON. 10. **Office users cannot create invoices** (hard rule). 11.
   Cores OK/Not-OK = WO View (spec-internal conflict w/ WOL C&E). 12. Integrations
   hosts QB/IBS/Open API; Departments under App Settings. 14. Timesheets no Delete. 15.
   11 system roles (Owner merged).

---

## 3. DONE-tickets ingestion scaffold
Created **`build/custom-roles-run/sv7388-done-tickets/`** with:
- `README.md` — the required paste/export format (ticket key, title, type, status,
  description, resolution, FULL comments) so pasted tickets drop straight in.
- `ticket-behavior-map.md` — template table: **ticket → behavior outside on-file spec
  → affected case(s)** to fill once tickets arrive.

Drop one `SV-XXXXX.md` per ticket into that folder (template in the README), then fill
the map table. This lets us reconcile "DONE work that changed behavior" against both
the current Confluence page and the 269 local cases.

---

## 4. Preliminary self-check (PROVISIONAL — NOT authoritative)
> **Caveat (state to Vlad):** this uses ONLY our **09-Jul on-file spec + the 269 local
> cases**. Vlad's nightly runs against the **LIVE current doc, which may differ.** This
> is an *early read of likely mismatch AREAS*, not a verified failing-case list. The
> authoritative reconciliation waits on the current-page export + Vlad's failing IDs.

**Likely mismatch areas (ranked):**
1. **15 known Deviations (build ≠ case / stale premise)** — highest-value candidates
   for nightly divergence:
   - WO-modal new-customer/new-asset "Add" shown+enabled with Customers C&E OFF
     (**C26387/C26388** — RUN331 fail persists).
   - Labor rate not hidden by Tech View when SFD ON (**C26459/C26464**).
   - Invoicing Delete/Reverse with AP/AR OFF shows no AP/AR prompt — gates on SFD
     (**C26424**).
   - Role name not strictly unique; dup dialog keys on identical permissions
     (**C26339**).
   - Template picker names/descriptions identical to Roles list (**C26340/C26341**).
   - QuickBooks under **Integrations**, not Finance (**C26529/C26531**).
   - **+4 Time-Clock API backend leaks (C29457/58/59/60)** — Settings read, Taxes
     read, Customer create, WO create not blocked (backend missing the gate its
     view/delete counterparts have).
   *(Fixes already verified: C26475 SFD-disable confirm modal built; C26482 aging
   follows Reports.)*
2. **Spec-diff FLAGs never resolved (16 case IDs in `updated-spec-diff.md`)** — cases
   whose subject the 09-Jul spec changed but which were flagged (not rewritten):
   C2480, C2497, C2500, C2561, C2565, C2567, C26340, C26419, C26488, C26496, C26553,
   C27873, C27418, C27468, C27487, C27494. **C26488** (View History Logs → View Part
   History repurpose) is the strongest nightly-mismatch suspect — the toggle was
   relabelled AND repurposed. These are prime "case-vs-spec mismatch" seeds.
3. **Prod-vs-staging drift findings** (`PROD-VS-STAGING-STATE-2026-07-14.md`) implying
   over/under-grants that a nightly may assert against: genuine over-grants kept as
   No = Parts Manager (WO C&E + WO Lines C&E), SM/PM (delete + settings), Sales Rep
   (SFD/AP-AR); plus STAGING-LESS regressions. If the nightly encodes intended-spec
   permission sets, these staging grants will fail.
4. **Section-3658 changes** — 5 stubs deleted + 2 moved (C27731→3549, C27736→3545). A
   nightly still referencing the old stub C-IDs or the empty 3658 subtree would fail
   on missing cases.
5. **Post-09-Jul spec changes we don't have** — anything Sasha changed 10–15 Jul is
   invisible to us and is the likeliest *unknown* mismatch source. Only the current
   page export closes this.

---

## 5. What we need from user / Vlad (checklist)
- [ ] **Current Confluence page 565116952** — full export/paste (Atlassian is
      login-walled here; we cannot fetch). This is the ground-truth spec.
- [ ] **All DONE SV-7388 tickets + FULL comments** — export/paste into
      `sv7388-done-tickets/` (one `SV-XXXXX.md` per ticket; format in that README).
      These capture behavior decided in tickets that may not be in the page body.
- [ ] **Vlad's failing case IDs from the nightly** (the exact C-IDs + the assertion
      that failed) — so we reconcile against real failures, not guesses.
- [ ] **Which process(es) to run** (Standing Rule 11): (1)
      `BUILD-ACCURATE-WORDING-VIU-PROCESS.md` (per-case wording + behavior VIU) and/or
      (2) `SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` (whole-suite relevance/obsolescence
      + regenerate all deliverables). Confirm before proceeding.
- [ ] **Fresh staging cookies** to `/tmp/custom-roles/` (ephemeral, ~24h) for the live
      VIU — incl. `cf_clearance`.
- [ ] **Fresh explicit TestRail write authorization** (one-day) — the pass is a
      get_case→edit→update_case flow; no local id-map, filename = C-ID.
- [ ] **Confirm scope:** core 3528–3553 (249) only, or +Combo/Breakage 3642–3645 (180)
      Phase-2; keep API/Security 3554, Digital Inspections, Regression-Minja OUT?
- [ ] **Env reset reminder:** Tech is DRIFTED (Technician) on the shared staging org;
      reset Tech → Time Clock User before negatives. **Note the ID discrepancy:** the
      Time-Clock API doc found the org reseeded (current Time Clock User =
      `be58f381-52fd-4958-9961-2d207bd1f09c`), while the wording-VIU doc/CLAUDE.md say
      `a0359055-…`. **Re-derive the roles matrix live at run start** (shared env) before
      trusting either ID.

---

## 6. Headline for the coordinator
- **Case inventory:** **269 local case bodies** (C26307–C29460) = the 254-case
  2026-07-13 pass **+15 Time-Clock API cases (C29446–C29460, all in new API section
  4091)**. Local tally **215 VIU-Verified / 39 Blocked-UI / 15 Deviation**. TestRail
  core in-scope = 3528–3553 (249). **No 4092 locally** (task mentioned it — flag).
- **On-file spec:** `updated-spec-source.md`, exported **09 Jul 2026**, newest
  change-log row 09 Jul. **Looks 6 days stale** (page was edited near-daily) →
  **authoritative recheck REQUIRES the current page export.** Diff crib in §2c.
- **Provisional mismatch areas:** 15 deviations + 16 unresolved spec-diff FLAGs (esp.
  C26488 View-Part-History repurpose) + prod-vs-staging over/under-grants + section-3658
  deletions/moves + unknown post-09-Jul changes.
- **Needs from user/Vlad:** current Confluence 565116952 export; DONE SV-7388 tickets +
  comments; Vlad's failing IDs; process choice (Rule 11); fresh cookies + TestRail
  write auth; scope confirm; roles-matrix re-derive (ID discrepancy).
