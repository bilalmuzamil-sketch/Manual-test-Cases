# WIP report spec — v21 → v22 diff + per-requirement verdict (Standing Rule 43)

**Project:** Report Suite · **report:** Work In Progress · **PO:** Chris Ward · **epic:** SV-8582 ·
**Confluence page:** 703660034 · **TestRail group:** 4281.
**Build DEFERRED (app NOT opened). No Jira. No run writes.**

## SOURCE-CURRENCY (Rule 31 / 59)

| Source | Identifier | Version / date | Read LIVE | Verdict |
|---|---|---|---|---|
| WIP spec (current) | Confluence 703660034 | **version 22**, published by Chris Ward **2026-08-18T17:01:44Z**, change msg *"Story 11 snapshot grain -> per work order per tab (Bilal Q)"* | fetched LIVE 2026-08-18 `GET /wiki/rest/api/content/703660034?status=historical&version=22&expand=body.storage` → HTTP 200, body 70003 chars | **CURRENT** |
| WIP spec (prior) | Confluence 703660034 | **version 21** (createdAt 2026-08-14) | fetched LIVE 2026-08-18 (`&version=21`) → HTTP 200, body 69211 chars | superseded |
| Live TestRail | group 4281, WIP sections 4350–4363 | 94 WIP cases | read LIVE 2026-08-18 | CURRENT |
| Build | `sv8582` QA branch | — | **NOT observed** — build verification DEFERRED | N/A this pass |

Raw evidence in this folder: `wip-spec-v21-text.txt`, `wip-spec-v22-text.txt`, `wip-spec-v21-v22.diff`.

---

## THE HEADLINE, IN ONE LINE

**v22 changed ONLY Story 11 (the nightly-snapshot grain). It did NOT touch Story 2 / Story 3
tab-placement wording, and it did NOT touch the Estimates tooltip.** So the answer to the pass's
central question is:

- **The reworded tab-placement cases' expectation is NOT "now stated directly by v22 as the sole
  model"** — v22 STILL carries BOTH the line-state model AND the older "exactly once / by status"
  text (S2-R4, Story 3), byte-identical to v21. **Their Rule-56 divergence therefore REMAINS real and
  is KEPT** (updated only to reference v22). **Zero divergence→confirmation conversions.**
- **C30493's Q1=A note stays a confirmation** — the Estimates tooltip (S5a-R2) is byte-identical in
  v22.

---

## PER-REQUIREMENT VERDICT (every diff hunk)

| # | Requirement / area | v21 | v22 | Change | Content-affected WIP cases |
|---|---|---|---|---|---|
| 1 | **S11-R1** (snapshot grain) | *"one row per then-open work order — one row per work order per calendar date."* | *"one row per then-open work order **per tab** … Rows are keyed by work order, tab, and calendar date."* | **CHANGED — grain per-WO → per-WO-per-tab** | **C30528** (already fixed to v22 in recovery) |
| 2 | **S11-R2** (snapshot row fields) | fields: work order, status, Earned, Remaining, Adjustments, location, org, date | adds **"the tab (line-state bucket) the row represents"** and **"that tab's Earned and Remaining values, with the underlying Labor and Parts earned/remaining amounts"** | **CHANGED — per-tab fields added** | **C30528** (already fixed) |
| 3 | **S11-R3** (snapshot maths) | *"…can never diverge for a given work order on the capture date."* | *"…for a given work order **and tab** on the capture date."* | **CHANGED — grain qualifier +"and tab"** | **C30530** (cites S11-R3; NOT yet touched — see remainder) |
| 4 | Scope note (§ WIP snapshot) | *"keyed per work order per day"* | *"keyed per work order **per tab** per day"* | CHANGED (wording echo of S11-R1) | covered by C30528 |
| 5 | Glossary "Snapshot" | *"per-work-order earned/remaining figures"* | *"per-work-order-**per-tab** earned/remaining figures"* | CHANGED (echo) | covered by C30528 |
| 6 | Context note (Story 11) | *"per work order per day"* | *"per work order **per tab** per day … the same line-state split"* | CHANGED (echo) | covered by C30528 |
| 7 | Change-log table | — | **new row 2026-08-18**: *"Story 11 snapshot grain — one row per work order per tab … Matches the shipped WorkOrderWipSnapshot"* | ADDED (provenance only) | none |
| 8 | **S2-R4** (placement "exactly once, in exactly one tab") | present | **byte-identical** | **UNCHANGED** | — |
| 9 | **Story 3 / S3-R1..R4** (status→single tab) | present | **byte-identical** | **UNCHANGED** | — |
| 10 | **§3 Key Decisions — status line** (*"tab a job lands in is derived from its status"*) | present | **byte-identical** | **UNCHANGED** | — |
| 11 | **§3 Key Decisions — line-state model (per SV-9027)** | present | **byte-identical** | **UNCHANGED** | line-state model our reworded cases follow was already there at v21 |
| 12 | **S5-R12 / S5a-R2** (Estimates tooltip) | present | **byte-identical** | **UNCHANGED** | C30493 (confirmation, not content) |

**⇒ The ONLY testable content change from v21→v22 is the Story 11 snapshot grain (S11-R1/R2/R3 + its
wording echoes). Everything else moved by zero bytes.**

**⇒ The spec's internal contradiction that Chris's answer B resolves — S2-R4 "exactly once" vs the
SV-9027 line-state Key Decision — is STILL PRESENT in v22, unreconciled.** That is Chris's spec-hygiene
to fix; it is logged OUTSTANDING (carried over from the Chris pass).

---

## WHAT THIS MEANS FOR THE 5 CASES STAMPED AT v21 (the target of this pass)

| C-id | Case | Cites | v22 impact | Note handling | Action |
|---|---|---|---|---|---|
| **C30456** WIP-SCOPE-01 | line-state loading | §3 Key Decisions per SV-9027 | placement wording UNCHANGED in v22; line-state model already at v22; **divergence against S2-R4 still real** | **KEEP divergence** (S2-R4 still in v22) | metadata re-stamp v21→v22 |
| **C30458** WIP-SCOPE-03 | line-state, every matching tab | S2-R4 / §3 Key Decisions | as above | **KEEP divergence** | metadata re-stamp v21→v22 |
| **C30464** WIP-PLACE-03 | Approved started-boundary | S3-R4; §3 Key Decisions | S3-R4 + placement UNCHANGED; **divergence still real** | **KEEP divergence** | metadata re-stamp v21→v22 |
| **C30493** WIP-SUM-07 | Estimates tooltip | S5a-R2 | tooltip UNCHANGED in v22 | **KEEP confirmation** (Q1=A) | metadata re-stamp v21→v22 |
| **C43979** WIP-PLACE-05 | per-tab money slice | §3 Key Decisions per SV-9027 | placement UNCHANGED; line-state already at v22; **divergence still real** | **KEEP divergence** | metadata re-stamp v21→v22 |

**All 5 are `custom_atmstatus = 1` (manual), `created_by = 3` (ours) — confirmed live 2026-08-18.**
**All 5 changes are METADATA-ONLY** (version pin + refs); the numbered expected-result BODY of each is
**byte-identical** before and after (dry-run confirmed). **Per the Rule 69 content-vs-metadata
refinement, the automation marker on all 5 is UNCHANGED** (they keep
`AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026`).

**Divergence-note "update to reference v22":** each divergence note reads *"differs from the older
wording in the same specification (Story 2, S2-R4 …)"* — a **version-neutral** reference to "the same
specification". Once sentence 1 pins v22, "the same specification" = v22, and because S2-R4 is
byte-identical in v22 the note is accurate as written. No note wording change is required or made.
