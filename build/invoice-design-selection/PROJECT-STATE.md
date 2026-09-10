# Invoice Design Selection — PROJECT STATE (canonical cold-resume doc)

**Feature:** an organization-level "Invoice Design" setting (options **"Modern"** / **"Legacy"**) that
controls which design the 5 refreshed customer documents render in. Invoice-type docs (Work Order Invoice,
Credit Invoice, Parts Sale Invoice) **capture** the setting at creation; estimate-type docs (Estimate,
Parts Sale Estimate) follow the **live** setting until their work order is invoiced, then match that invoice.
Story 4 pins the back-catalogue by creation-date cohort. Story 5 = every render surface honours the design.

- **Spec:** Confluence page **845447188** "Invoice Design Selection — Product Spec", space ~Sasha Grosman.
  **Status: DRAFT · Revision 5 (2026-09-10)** by Sasha Grosman — Q6 to Q12 awaiting a Product decision
  (Section 8.1). Version integer not retrievable (Rule 42 anchor = page-id + Rev 5 + read-date). Original
  extraction: `SPEC-EXTRACTION-2026-09-10.md` (Rev 3); **Rev 3 → Rev 5 reconciliation:
  `source-verify-2026-09-10/CHANGE-ANALYSIS-Rev5.md`.**
- **Epic:** **SV-9892** "Invoice Design Selection" (Open) — the real epic now exists (was authored against
  old epic SV-8218, which is the RELATED refresh epic, now Done/released v26.36.0 2026-09-09).
  **Stories now exist (resolves G3):** Story 1 **SV-9893**, Story 2 **SV-9894**, Story 3 **SV-9895**,
  Story 4 **SV-9896**, Story 5 **SV-9897**; engineering-review story **SV-9872**. Design artifact = the
  SV-8218 Design Document (https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354) for Modern;
  Legacy = the v26.35.10 templates **restored by engineering (Q13 — resolves G4/AS-1)**. Setting-UI design
  still TBD (G2).
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

## Status — 2026-09-10 (SECOND full re-verify same day — Q6 decision recorded, header still lags)
Re-read all sources again on the QA lead's order. **Jira unchanged; spec Requirements body (Story 1–5)
byte-for-byte identical to Rev 5.** Only the Section 8.1 decision cells moved: **Q6 now records option (a)**
(the pre-refresh back catalogue IS pinned; Story 4 ships as written), Q7/Q8 prefixed "A)", Q12 gains a
"(C) edit manually", Q17 still pending. **The spec is internally contradictory on Q6** — decision cell says
(a) but the header still reads "awaiting", SV-9896 still says "do not start", no new revision. ⇒ **No
expectation changes on any of the 54** (body unchanged). The **10 Story-4 cases (C53554–C53562, C53546)**
had their Q6 note updated to record option (a) **while disclosing the header/story lag**; they stay
**NOT-FINAL** (Rule 56/58). All 54 re-verified for render. Flagged to the QA lead (register item B): treat
Q6 as decided (make the ten final) or hold until the spec is cleaned up? Detail: CHANGE-ANALYSIS-Rev5.md §G.

## Status — 2026-09-10 (RE-VERIFIED against spec Revision 5 + new epic/stories — all 54 corrected)
Full source re-verification (Rule 101) after the QA lead handed over the updated sources. Reconciliation:
`source-verify-2026-09-10/CHANGE-ANALYSIS-Rev5.md`.
- **All 54 cases (C53518–C53571) re-pointed** from old epic SV-8218 → **epic SV-9892 + per-story key**
  (S1→SV-9893 … S5→SV-9897; FO-4 → epic-level) and **spec Revision 3 → Revision 5**, read 10 Sep. Applied
  via the fr-view UI/Froala harness (`hs_write_rev5.mjs`, `intended-blocks-rev5.json`); **54/54 verified
  `fr-view`, no literal tags, marker last, atm unchanged** (harness checkView). These are our cases
  (`created_by=3`, `custom_atmstatus=1`) — corrected directly, no Rule 38/71 constraint.
- **Case-specific corrections:** **C53570** (S5-E1) retitled + rewritten to the **Q14** truth — the legacy
  templates DO print an Authorizer column carrying the IBS approval code (the earlier "no place for it"
  claim was reversed by engineering); the contact is still selected + locked on the WO. **Story-4 cases**
  (C53554–62, C53546) pin the exact cutoff **2026-09-09 09:13:36 UTC (Q16)** and carry a **Q6-open** note
  (the back-catalogue flip is awaiting a Product decision and may be dropped). Decision notes added for
  **Q19** (C53541 labour-fix keeps design), **Q10** (C53520/24/25 copy under challenge), **Q9** (C53551/66
  portal held copies), **Q21** (C53543 sixth document Part Sale Credit), **Q18** (C53552 void = reversal).
- **Gaps resolved:** G3 (story keys), G4/AS-1 (legacy templates exist — restored from v26.35.10, Q13),
  cohort cutoff pinned (Q16). Still open: **G2** (Setting-UI design TBD), **Q6** (Story-4 fate),
  **Q7/Q15** (restored Legacy defects; SV-9832 fee breakdown), **Q10** (final copy).
- **Markers unchanged** — no dated QA build yet (target v26.38.0 not created); build-verification deferred
  (Rule 85). Run **R446** membership unchanged (still the 54 case_ids).

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
