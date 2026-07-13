# Section 3658 stub-tree — RESOLUTION of the 7 remaining cases — 2026-07-13

Follow-up to `section-3658-dedupe-2026-07-13.md` (3 clean duplicates already deleted;
7 left for a ruling). **QA-lead ruling:** MOVE each VALID stub into the correct
sub-folder under "Custom Roles - (Revised)" (section 3527) and apply the
build-accurate + layman wording treatment; LEAVE any not-valid stub (empty /
no real steps / fully redundant / build-wrong) in 3658 and report it for a decision.
**Nothing deleted.** All 7 were snapshotted pre-edit in
`testrail-snapshots-2026-07-13/` (fully reversible).

## Outcome summary
- **MOVED + reworded + pushed (VALID): 2** — C27731 -> 3549, C27736 -> 3545.
- **LEFT in 3658 for QA-lead decision (NOT valid): 5** — C27729, C27730, C27732,
  C27734, C27738.
- **TestRail status:** 2 `move_cases_to_section` (HTTP 200, sections re-verified),
  2 `update_case` (HTTP 200, re-verified 200/200). No case deleted. The 5 left-behind
  cases were **not touched** in TestRail.

---

## MOVED (VALID) — 2

### C27731 -> section 3549 (Migration) — Blocked-UI
- **Was:** section 3660 (stub). Title "Legacy 'Owner' users land on system
  'Administrator' role (Owner merged into Admin)".
- **Valid?** YES — distinct. Core Migration set (3549) has **no** legacy-Owner case
  (Owner is merged into Administrator, so there is no Owner system role). Not covered
  by any single core case.
- **Wording:** rewritten to build-accurate, numbered, layman; VIU/spec-ref jargon
  removed. New title: "Legacy 'Owner' users become 'Administrator' after migration
  (Owner merged into Admin)".
- **VIU:** **Blocked-UI.** The migration *landing* outcome is not drivable in this
  env (needs a real pre-migration 'Owner' user + a migration run; not seedable).
  Partial confirmation from the live roles API: there is **no 'Owner' system role**
  among the 11 shipped system roles, and the Administrator role **is editable**
  (roles-matrix-2026-07-13). Full behavior = manual / second-real-user.

### C27736 -> section 3545 (View and Manage AP/AR Data) — VIU-Verified
- **Was:** section 3663 (stub). Title "Cross-cutting toggle is labeled 'Manage
  Accounts Payable and Receivable'".
- **Valid?** YES — distinct structural check. Section 3545 has 11 behavioral cases
  but **no** toggle-label/exists case; this parallels the See Financial Data
  toggle-exists case (C26467, in 3544). The stub's asserted label was BUILD-WRONG.
- **Wording:** corrected to the **live build label 'View and Manage AP/AR Data'**
  (the stub claimed 'Manage Accounts Payable and Receivable', which does not exist in
  the build). New title: "The AP/AR cross-cutting toggle is labeled 'View and Manage
  AP/AR Data'".
- **VIU:** **VIU-Verified** from the shipped build chunk
  `CrossTogglesSection.ChT56hCk.js`: the "Cross-Cutting Toggles" card contains
  "See Financial Data" (seeFinancialData), "View and Manage AP/AR Data" (seeApArData),
  and "View History Logs" (viewHistoryLogs).

---

## LEFT in 3658 for QA-lead decision (NOT valid) — 5

All have real steps/expected but are **redundant with an existing core case** and/or
assert **build-wrong** behavior. Recommend RETIRE (or delete after the ruling); do not
re-home, because moving would create a duplicate or a knowingly-wrong case.

| Stub | Sub-section | Why not valid (with core overlap) |
|---|---|---|
| **C27729** | 3659 | **Redundant.** "Administrator row editable (pencil/eye/three-dot) + cannot be deleted" is fully covered by **C26322** ("An editable system role's three-dot menu shows View Permissions and no Delete" — uses Administrator as the example) plus **C26543** ("only Office User + Time Clock User non-editable; Administrator editable; no system role deletable"). Both are already build/roles-API-verified in the 2026-07-13 pass. |
| **C27730** | 3659 | **Redundant.** Its titled behavior ("three-dot hidden only on Office/Time Clock User") is verbatim **C26323**; the bundled "Administrator is editable" claim is **C26543**. No new assertion. |
| **C27732** | 3660 | **Redundant (conflict now resolved).** "Legacy Admin/Administrator -> Administrator, editable, cannot lose admin access" is exactly **C26510**. The old editable-vs-non-editable CONFLICT flagged in the dedupe doc is **resolved**: C26510 was corrected during the 2026-07-13 wording pass to state the Administrator role **is editable** (matches C27732). So C27732 is now a straight duplicate of C26510. |
| **C27734** | 3661 | **Build-wrong premise.** "Ticking Create & Edit on Work orders auto-checks Create & Edit on Work order lines" does **not** happen in the build. The shipped cascade handler (`z` in `PermissionEditor.js`) applies the standard CRUD cascade to Work orders (Create & Edit ticks View) and, **only when Work orders View is unticked**, clears Work order lines Create & Edit / Delete + the WO sub-settings. It never auto-ticks Work order lines. The real cascades are already covered by **C26360** (WO Create & Edit -> WO View) and **C26373** (unticking WO View clears WO lines Create & Edit / Delete). |
| **C27738** | 3665 | **Redundant + partly build-wrong.** "Integrations section remains hosting QuickBooks/IBS/Open API" = **C26531**; "QuickBooks appears under Integrations" = **C26529**. Its only unique claim, "QuickBooks entry point under **Finance**", is **build-wrong** — in the build QuickBooks stays under **Integrations** (settingsIntegrations gates IBS/Open API/QuickBooks; Finance gates only Payment Methods/Taxes). |

### Recommended QA-lead decision for the 5
- **Retire (delete) C27729, C27730, C27732** — clean redundancy with verified core
  cases (C26322/C26323/C26510/C26543).
- **Retire (delete) C27734, C27738** — assert behavior that does not exist in the
  build; the true behavior is covered by C26360/C26373 (C27734) and C26529/C26531
  (C27738).
- If instead the stub tree is to be kept, C27734 and C27738 must be reworded to the
  true build behavior — at which point they duplicate the core cases above.

---

## Reversibility
Every one of the 7 has a verbatim pre-edit snapshot in
`testrail-snapshots-2026-07-13/C277{29,30,31,32,34,36,38}.json`. The two moves +
two updates can be rolled back from those snapshots (restore `section_id` +
title/preconds/steps/expected).
