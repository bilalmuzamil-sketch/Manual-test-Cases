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

## Status — 2026-09-10 (authoring in progress)
- Spec read live (worker), section 7800 created. Cases being authored full-coverage per requirement (Rule 43),
  five-dimension quality (title/preconds/steps/expected/sources consistent; steps cover expected). Then the
  authenticity gate (`audit_case_authenticity.py`) + per-requirement coverage check before hand-off.
- **10 open ambiguities (G1–G10)** for a PO question sheet (sent last, Rule 66): ship date (G1), Setting-UI
  design (G2), story keys (G3), **legacy templates exist? (G4/AS-1 — gates every Legacy render case)**,
  permission model (G5), voided-vs-reversed (G6), parts-sale "invoiced" trigger (G7), emailed-estimate design
  timing (G8), version integer (G9), Rev-3 string currency (G10).
