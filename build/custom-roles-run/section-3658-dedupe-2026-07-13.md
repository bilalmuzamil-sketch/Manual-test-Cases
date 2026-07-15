# Section 3658 "Custom Roles and Permissions" stub tree — dedupe ruling — 2026-07-13

Section **3658** is a small parallel stub tree (7 child sections, 10 cases) that
mirrors core section-3527 topics. Each stub was compared by title + content against
the core Custom Roles cases (sections 3528–3553). Verbatim snapshots of all 10 were
committed to `testrail-snapshots-2026-07-13/` before any deletion (rollback baseline).

## DELETED — confirmed duplicates (3)
| Stub case | Sub-section | Duplicate of (core) | Why |
|---|---|---|---|
| **C27735** | 3662 See Financial Data | **C26467** (sec 3544) | Identical behavior: "See Financial Data toggle exists in the Cross-Cutting Toggles card." |
| **C27733** | 3661 CRUD Cascade | **C26429 + C26371** | "Timesheets shows View + Create and Edit only (no Delete)" — same assertion already covered. |
| **C27737** | 3664 Timesheets | **C26429 + C26371** | Same "Timesheets no Delete" assertion; also identical to C27733. |

All three deleted via `delete_case` (HTTP 200), verified gone.

## LEFT IN PLACE — NOT clean duplicates → need a user ruling (7)
| Stub case | Sub-section | Related core | Why left (needs ruling) |
|---|---|---|---|
| **C27729** | 3659 Roles List | C26322 / C26325 | Adds an Administrator-specific claim ("editable except cannot lose Administration access" + cannot be deleted) not covered by any single core case; also touches the editable/Duplicate model. |
| **C27730** | 3659 Roles List | C26323 (+C26322) | Its titled behavior (three-dot hidden only on Office/Time Clock) duplicates C26323, but it BUNDLES an "Administrator is editable" (spec v35) claim → not a clean 1:1 duplicate. |
| **C27731** | 3660 Migration | (none) | Legacy **Owner** → Administrator migration. Core migration set (3549) has no Owner case (Owner merged into Admin). Distinct scenario. |
| **C27732** | 3660 Migration | **C26510** (CONFLICT) | Same scenario as C26510 (legacy Admin → Administrator) but **contradicts** it: C27732 says the role is *editable* (spec v35); C26510 says *non-editable*. Needs reconciliation, not silent deletion. |
| **C27734** | 3661 CRUD Cascade | C26360/C26372/C26373 | "WO Create & Edit auto-checks WOL Create & Edit" — this exact cascade direction is not cleanly asserted by a single core case (core covers WO-internal cascade and WOL→WO View). |
| **C27736** | 3663 Manage AP/AR | 3545 topic (CONFLICT) | Claims the toggle is labelled **"Manage Accounts Payable and Receivable"** — but the **live build shows "View and Manage AP/AR Data"**, so this claim is build-wrong. Recommend retire or fix, not silent delete. |
| **C27738** | 3665 QuickBooks Relocation | **C26531** (CONFLICT) | Claims the **Integrations** settings section *remains* (QuickBooks/IBS/Open API) — which **matches the live build** but **contradicts core C26531** ("legacy Integrations group no longer present"). C26531 now appears STALE (Integrations IS built). Needs reconciliation ruling.|

## Recommendation to the user
- The 3 deletions are safe (behavior fully covered by core cases).
- For the 7 left cases: rule whether the 3658 stub tree should be (a) retired after
  merging its unique assertions into core cases, or (b) kept. Note two build-driven
  findings surfaced: **AP/AR label is "View and Manage AP/AR Data" (not "Manage
  Accounts Payable and Receivable")** and **the Integrations settings section IS built**
  — so core **C26531** ("Integrations no longer present") and any "AP/AR renamed"
  wording are stale and should be reconciled.
</content>
