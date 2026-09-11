# Invoice Design Selection — PROJECT STATE (canonical cold-resume doc)

**Feature:** an organization-level "Invoice Design" setting (options **"Modern"** / **"Legacy"**) that
controls which design the 5 refreshed customer documents render in. Invoice-type docs (Work Order Invoice,
Credit Invoice, Parts Sale Invoice) **capture** the setting at creation; estimate-type docs (Estimate,
Parts Sale Estimate) follow the **live** setting until their work order is invoiced, then match that invoice.
Story 4 pins the back-catalogue by creation-date cohort. Story 5 = every render surface honours the design.

- **Spec:** Confluence page **845447188** "Invoice Design Selection — Product Spec", space ~Sasha Grosman.
  **Status: DRAFT · Revision 3 (2026-09-10)** by Sasha Grosman. Version integer not retrievable
  (Rule 42 anchor = page-id + Rev 3 + read-date). Extraction: `SPEC-EXTRACTION-2026-09-10.md`.
- **Epic:** **SV-8218** (Invoice UI Refresh — the user supplied this; the spec header says "Epic: TBD").
  Story Jira keys all TBD (G3). Design artifact = the SV-8218 Design Document
  (https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354); Setting-UI design is TBD (G2).
- **TestRail:** new section **"Invoice Design Selection" = id 7800**, under group **6559 "Invoice Refresh
  (Aug 2026)"**, suite 1. Created 2026-09-10.
- **Tester (Rule 38):** Mudassir Qamar (TestRail user 6) owns the Invoice Refresh tree; cases authored by us
  (`created_by=3`).
- **🛑 NOT YET BUILT.** Draft spec; S4-R5 says the pinning "must both be built"; the Setting UI is TBD. So
  every case is authored SOURCE-DERIVED with PROVISIONAL routes and marker
  **`AUTOMATION: Not available on Build to test Yet - Last checked 9/10/2026`** (Rule 69); Story-5 portal
  cases (S5-R4/R5) carry the **staging-only customer-portal HOLD**. Build-verification is deferred until the
  feature ships (Rule 85 pattern).
- **Run (Rule 34):** cases are NOT added to a run yet — the feature is unbuilt, so a run + build-verify is
  deferred; the QA lead decides whether they get a dedicated run or union into the Invoice Refresh run R417
  when built. (Flagged, not auto-done, to avoid polluting a live run with untestable cases.)

## Status — 2026-09-10 (AUTHORING COMPLETE — 54 cases, source-derived, all 5 dimensions audited)

- **54 cases created: C53518–C53571** in section **7800**, `created_by=3`, `custom_atmstatus=1`,
  `custom_automation_type` set per case (no None), all rendered **`fr-view` (54/54)**. id-map:
  `testrail-id-map.csv`. Authoring JSON preserved implicitly in `intended-blocks.json`.
- **FULL coverage of every spec id** — FO-1..9 · S1-R1..R10/N1..N4/E1 · S2-R1..R6/E1..E4 ·
  S3-R1..R3/N1..N2/E1..E3 · S4-R1..R5/N1..N2/E1..E2 · S5-R1..R5/N1..N2/E1..E2 (0 missing).
- **Five-dimension authenticity gate (skill 02 §5c) run and clean:** Titles — 0 contradictions
  (independent audit); Steps-cover-Expected — 2 gaps found (C53532 render-under-new-design; C53547
  change-setting-and-re-view) and **fixed → 0**; Mechanical — clean (2 false positives, "Invoiced"/"Paid
  banner" as words, not statuses); Expected — verbatim spec strings (labels, toasts, both dialog bodies,
  helper text); Sources — uniform provenance (epic SV-8218 + spec page 845447188 Rev 3, read 10 Sep).
- **Markers:** all `AUTOMATION: Not available on Build to test Yet - Last checked 9/10/2026`; 4 portal
  cases (C53558/S4-R4-render, C53566/S5-R4, C53567/S5-R5, C53569/S5-N2) additionally noted staging-only.
  S4-R5 (C53558) authored in three-outcomes style (today a pre-refresh invoice reprints Modern; must
  reprint Legacy once pinning is built).
- **🛑 Runnable-shape gate = 16/54 pass — EXPECTED and correct for an UNBUILT feature (Rule 85 / skill
  18c).** The "Invoice Design" control, the render surfaces, and the back-catalogue pinning do not exist
  yet (feature is Draft; S4-R5 says it "must be built"; Setting UI is TBD, G2). Routes are drafted from the
  spec and marked PROVISIONAL, never fabricated (fabricating controls to pass the gate is barred, Rule
  18a). The gate is **finalised at build-verification** when the feature ships — that pass names the real
  on-screen controls and flips markers to READY.
- **Run (QA lead, 2026-09-10):** dedicated run **R446 "Invoice Design Selection"** created — suite 1,
  **milestone 3 "ShopView Manual QA - Aug 2026 Feature Cycle"** (the same milestone as the Invoice Refresh
  run R417), **assigned to Mudassir Qamar (user 6)**, all **54 tests assigned to Mudassir** (the run
  assignment propagated to every test; verified live, distinct assignedto = {6}). include_all=false, the 54
  case_ids C53518–C53571. ⚠️ A TestRail **milestone has no assignee field** — a milestone cannot be assigned
  to a user; the run and its tests carry the assignment instead. https://shopview.testrail.io/index.php?/runs/view/446
- **PO question sheet delivered:** `PO-QUESTIONS-Invoice-Design-Selection-2026-09-10.xlsx` (6 PO questions +
  QA-internal), Rule 66.

## Status — 2026-09-10 (authoring in progress)
- Spec read live (worker), section 7800 created. Cases being authored full-coverage per requirement (Rule 43),
  five-dimension quality (title/preconds/steps/expected/sources consistent; steps cover expected). Then the
  authenticity gate (`audit_case_authenticity.py`) + per-requirement coverage check before hand-off.
- **10 open ambiguities (G1–G10)** for a PO question sheet (sent last, Rule 66): ship date (G1), Setting-UI
  design (G2), story keys (G3), **legacy templates exist? (G4/AS-1 — gates every Legacy render case)**,
  permission model (G5), voided-vs-reversed (G6), parts-sale "invoiced" trigger (G7), emailed-estimate design
  timing (G8), version integer (G9), Rev-3 string currency (G10).

---

## 🛑 QA LEAD RULINGS — RUN 446 EVIDENCE AUDIT (2026-09-11). DO NOT RE-RAISE THESE.

He reviewed the evidence audit of run 446 and closed the following **permanently**. A later session
must NOT list, question or re-audit them, and must not quote them back to him:

| Test | Case | His ruling |
|---|---|---|
| T2924622 | C53537 Credit Invoice against several invoices | **He personally tested it and left his feedback in the run.** Never quote again. |
| T2924607 | C53522 Existing organization starts on Modern | **He personally verified.** Never quote again. |
| T2924608 | C53523 New organization starts on Modern | **He personally verified.** Never quote again. |
| T2924603 | C53518 "Legacy invoice layout" toggle is the last row | Ignore. Never quote again. |
| T2924604 | C53519 Toggle has two states | Ignore. Never quote again. |
| T2924605 | C53520 Helper text wording | Ignore. Never quote again. |
| T2924611 | C53526 Confirming shows the success toast | Ignore. Never quote again. |
| T2924606 | C53521 One org-wide setting, no per-location variant | Ignore. Never quote again. |
| T2924636 | C53551 Re-sent estimate reaches customer in new design | Ignore. Never quote again. |
| T2924650 | C53565 Emailed PDF renders the current selection | Ignore. Never quote again. |
| T2924653 | C53568 Batch and imported invoices unaffected | Ignore. Never quote again. |

**The ONLY item still open from that audit:** **C53543 / T2924628 — "Invoice Design selection governs
all six customer documents."** Four of six are proven (Estimate, Work Order Invoice, Parts Sale
Invoice, Credit Invoice). Still to prove: **Parts Sale Estimate** and **Parts Sale Credit**.

**Rule learned (L0055):** an evidence audit is delivered ONCE. When he rules on an item, that ruling
is final and is recorded here; re-surfacing a closed item wastes his time and reads as not listening.
