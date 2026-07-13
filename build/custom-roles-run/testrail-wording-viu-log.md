# Custom Roles — Build-Accurate Wording + VIU — TestRail push audit log — 2026-07-13

> Per-case audit of the build-accurate wording + VIU pass
> (`build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`). TestRail writes authorized for
> this pass (`update_case` on the core Custom Roles cases, sections 3528–3553).
> Method per case: get_case → diff 4 fields (title/preconds/steps/expected) →
> update only changed → re-verify 200/200 → skip no-ops. Snapshots baseline (rollback)
> committed at `testrail-snapshots-2026-07-13/`. Glossary:
> `wording-glossary-2026-07-13.md`. Rewritten bodies: `cases-2026-07-13/`.

## Build-wording headline deltas applied (Rule 9 — build wins)
- AP/AR toggle wording corrected to the BUILD label **"View and Manage AP/AR Data"**
  (NOT the spec's "Manage Accounts Payable and Receivable").
- History toggle wording is the BUILD label **"View History Logs"** (gates the
  **Part History** page).
- Resource cards use build sentence-case: **Work orders, Work order lines, Part sales,
  Catalog and Inventory, Vendor and order management, Invoicing & payments**.
- View mode options **Full View / Tech view**; Invoicing delete column **Delete / Reverse**;
  WO toggles **Order parts / Pick parts / Review work orders**.
- Confirm dialogs use build labels: **Enable See Financial Data?** (Cancel/Enable),
  **Disable See Financial Data?** (Cancel/Disable), **Reset to template** (Cancel/Reset).
- Stripped from tester-facing text: spec IDs (SV-####, §refs, doc ids), "per spec",
  "verified in UI", "file a bug against …", enum/HTTP jargon.

---

## Section 3544 — See Financial Data (10 cases) — pushed 2026-07-13
**Result: 10 UPDATED · 0 no-op · 0 failed · all re-verified 200/200.**

| Case | Change | VIU status |
|---|---|---|
| C26467 | Reworded to build labels (Cross-Cutting Toggles / See Financial Data); flagged reused subtitle placeholder | Verified-Label (build) |
| C26468 | Reworded; app-wide "money shown" sweep | Blocked-UI (seeded role + manual sweep) |
| C26469 | Reworded; app-wide "money hidden" sweep | Blocked-UI (SFD-off role + manual sweep) |
| C26470 | Reworded; SFD gate beats CRUD | Blocked-UI (seeded role + UI check) |
| C26471 | Reworded; tick Part sales → Enable dialog | Blocked-UI behavior; modal title+buttons build-verified |
| C26472 | Reworded; Enable button (was "Confirm") | Blocked-UI behavior; Enable button build-verified |
| C26473 | Reworded; Cancel reverts | Blocked-UI behavior; Cancel button build-verified |
| C26474 | Reworded; same dialog for Invoicing & payments | Blocked-UI behavior; modal build-verified |
| C26475 | Reworded to build "Disable See Financial Data?" dialog | **Disable modal now present in build (was RUN331 FAIL) — recommend live re-test** |
| C27869 | Reworded; Order parts enable prompt | Blocked-UI behavior; modal family build-verified |

**Notable finding:** the **FinancialDataDisableConfirmModal** ("Disable See Financial
Data?", Cancel/Disable) is now wired into the shipped PermissionEditor — the
SFD-disable dependent-prompt (C26475), a FAILED deviation in RUN331 as "not
implemented", appears to have since been BUILT. Recommend a live re-test to confirm
the dependent-clear behavior and the exact dependent list.
</content>
