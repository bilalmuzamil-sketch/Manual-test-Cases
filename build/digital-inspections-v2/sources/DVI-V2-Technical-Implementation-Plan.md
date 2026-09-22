# Digital Inspections V2 — Foundation — Technical Implementation Plan

**Date:** 2026-09-15
**PRD:** https://shopview.atlassian.net/wiki/spaces/PM/pages/768507905/Digital+Inspections+V2
**Jira epic:** [SV-8181](https://shopview.atlassian.net/browse/SV-8181) — Digital Inspection V2
**Design:** claude.ai design project `0c2be389-b1b1-41f9-8b95-6dba538c69ba` ("ShopView Inspection Form Redesign"), read from the handoff bundle the requester supplied — its own `FR-01`–`FR-24`, a numbered build spec, an acceptance-criteria doc, a Preview-mode handover, and 27 artboards across five files
**Tech stack:** PHP 8.5 / Symfony 7.4 / Doctrine ORM 3 + DBAL 4 / MySQL / Redis (`api/`) · Vue 3.5 / Quasar 2 / Vite / TypeScript / Vuex 4 (`app/`) · Playwright (`e2e/`)
**Estimated complexity:** High

**Scope of this document:** the **foundation** half of the epic — the per-axle field, the template builder work, the note and photo validation rules, reference files, bulk Mark OK, and phone rendering. The work-order hand-off (S2, S3, S4, S5, S6, S7, S15) and the customer report (S13) are a **named second plan**, deliberately deferred: they depend on the data model this plan establishes, and their assistant-side dependency is untestable on QA and partly owned outside this repository.

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Not started
- **Current phase:** —
- **Last completed:** —
- **Open questions / blockers:** **None that touch this plan.** Product answered the planning pass on 2026-09-16 by revising the PRD — see §1.5 and §3.6. Every item bearing on the foundation scope is settled: the photo and note defaults are on, a per-axle field arrives pre-filled, the nine-unit list stays with inches first, the reference-file limit is **10 MB** (settled with Product; see D9 for the two rationales that were withdrawn on the way there), and HEIC is now a required photo format. One item remains open with Product and it belongs to the second plan: the asset-tab filters, which wait on a production query we owe them — and Product has already narrowed what it decides, since All and Needs action stay either way and the number only settles the paging deferral and whether With issues and Not started earn their place. The phone design for the drafting panel is **no longer open**: Product reported the design added on 2026-09-16. The *requirement* (`S15-R26`) was never the gap — it is identical in both PRD revisions; the missing thing was the artboard. Two further questions were raised with Product on 2026-09-16 and **answered the same day** (§3.6): an inspection whose work order has been deleted stays listed, readable and with its report downloadable — second-plan work, but it settles what the schema must support — and a photograph the report cannot render prints a placeholder naming the format, which lands in Phase 6. Two further items are environment blockers rather than decisions: a live uncaptured 400 on the submit endpoint on QA, and an unnamed ShopCoach owner (the latter affects the second plan, not this one).

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), the mandatory E2E ask, and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore this note and continue — you're in the right place.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins — if the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

---

## 1. Requirements

### 1.1 How requirements are identified in this plan

The PRD's own requirement ids are used as the functional requirement set — `S8-R11`, `S1-R3`, `S12-R29` and so on — rather than being renumbered `FR-001`. Those ids are already cited by the epic's 22 Jira stories, by the design bundle's build spec, and by all 72 items on the PRD's review child page. Renumbering would break traceability with three systems for no gain. Two additions carry new prefixes:

- **`DFR-xxx`** — a requirement the **design** specifies that the Confluence PRD does not state at all. These are real requirements; they simply have only one source.
- **`NFR-xxx`** — a non-functional requirement introduced by **this analysis**. The PRD is almost entirely silent on the non-functional surface, so every one of these is new.

### 1.2 Stories in scope

| Story | Jira | Requirement ids | What it delivers |
|---|---|---|---|
| **S8** Record measurements per axle | [SV-9106](https://shopview.atlassian.net/browse/SV-9106) | `S8-R1`–`R28`, `S8-N1`–`N3`, `S8-E1`–`E7` | A new `Per axle` field type: authoring its measurement rows, and filling it per wheel position with a verdict on every value |
| **S12** Template builder authoring | [SV-9110](https://shopview.atlassian.net/browse/SV-9110) | `S12-R1`–`R5`, `R7`–`R33`, `S12-N1`–`N3`, `S12-E1`–`E4` (the PRD defines no `S12-R6`) | The starter library and reduced empty state, the per-axle properties panel, the `Axles` control, one merged Text field, "times used" copy |
| **S12 (Preview)** | [SV-9884](https://shopview.atlassian.net/browse/SV-9884) | `S12-R25`, `R31`, `R32`, `R33`, `S12-E4` | Preview mode — the real fill screen mounted against the current draft |
| **S1** Require a note on flagged responses | [SV-9099](https://shopview.atlassian.net/browse/SV-9099) | `S1-R1`–`R7`, `S1-N1`–`N2`, `S1-E1`–`E7` | A new per-field validation rule, enforced on submit |
| **S17** Require a photo on a Not OK response | [SV-9440](https://shopview.atlassian.net/browse/SV-9440) | `S17-R1`–`R9`, `S17-N1`–`N3`, `S17-E1`–`E6` | **The gate is already shipped; the formats are not.** The setting and its submit enforcement exist (§1.5). In scope: the default, the precedence rule, the Add Photo affordance, and — new on 2026-09-16 — **accepting HEIC** (`S17-R9`) with the accepted formats named at the point of failure (`S17-E6`). The HEIC half is real work on three layers, not a toggle |
| **S11** Attach a reference file to a question | [SV-9109](https://shopview.atlassian.net/browse/SV-9109) | `S11-R1`–`R9`, `S11-N1`–`N3`, `S11-E1`–`E4` | One file per field, an in-tab viewer, and a download-only state for types that cannot render |
| **S18** Mark a whole scope OK in one press | [SV-9883](https://shopview.atlassian.net/browse/SV-9883) | `S18-R1`–`R11`, `S18-N1`–`N2`, `S18-E1`–`E2` | Bulk OK at inspection, section and field level, with Undo |
| **S14** Inspection filling on a phone | [SV-9397](https://shopview.atlassian.net/browse/SV-9397) | `S14-R1`–`R8`, `S14-N1`–`N2`, `S14-E1`–`E2` | The phone rendering of everything above |
| Seed the five starter templates | [SV-9881](https://shopview.atlassian.net/browse/SV-9881) | `S12-R4`, `R5`, `R27`, `R28` | The starter **catalogue structure** and the seeding mechanism — which does not exist today. The checklist **content** of the five is a Product input this plan does not invent (Phase 9); `S12-R27` fixes how it is shaped — one per-axle field wherever the same thing is measured on every wheel position — but not what the items say |
| Unify the measurement row scope vocabulary | [SV-9885](https://shopview.atlassian.net/browse/SV-9885) | `S8-R4`, `S8-R5` | "1 per side" / "Outer + inner" on every surface, phone included |
| Success and error message copy | [SV-9887](https://shopview.atlassian.net/browse/SV-9887) | `S1-R5`, `S17-R5`, `S17-E4`, `S5-N3`, `S11-N1`, `S11-E1`, `S11-E4`, `S12-R12`–`R15`, `S18-R10` in this plan's scope (the rest belong to the second plan) | **Cross-cutting, not a phase.** Each phase writes the strings its own surfaces need, and this ticket is the audit trail that they were written rather than left as "a message is shown". The requirements that promise a message without writing it are enumerated here so the ticket's scope is recoverable from the plan rather than only from the PRD |

**Explicitly out of scope of this plan** (second plan): S2 [SV-9100](https://shopview.atlassian.net/browse/SV-9100), S3 [SV-9101](https://shopview.atlassian.net/browse/SV-9101), S4 [SV-9102](https://shopview.atlassian.net/browse/SV-9102), S5 [SV-9103](https://shopview.atlassian.net/browse/SV-9103), S6 [SV-9104](https://shopview.atlassian.net/browse/SV-9104), S7 [SV-9105](https://shopview.atlassian.net/browse/SV-9105), S15 [SV-9404](https://shopview.atlassian.net/browse/SV-9404), the ShopCoach brief [SV-9112](https://shopview.atlassian.net/browse/SV-9112), S13 [SV-9111](https://shopview.atlassian.net/browse/SV-9111), the reference-file conversion ticket [SV-9882](https://shopview.atlassian.net/browse/SV-9882), and the asset-tab mobile design [SV-9886](https://shopview.atlassian.net/browse/SV-9886). [SV-9108](https://shopview.atlassian.net/browse/SV-9108) (S10, instruction acknowledgement) is OBSOLETE and stays that way — the PRD puts conditional logic and acknowledgement out of scope.

### 1.3 Design-sourced requirements (`DFR`) — specified in the design, absent from the PRD

| id | Requirement | Source |
|---|---|---|
| **DFR-001** | A verdict is stored **only** at position level. Row, axle, field and section verdicts are always computed, never persisted. | design invariant I1 |
| **DFR-002** | `na` is never written as a default by any code path, including bulk Mark OK. | design invariant I2 |
| **DFR-003** | No answer exists carrying a verdict the technician did not cause — no seeding, no migration fill, no "complete the record" job. | design invariant I3 |
| **DFR-004** | "Not inspected" is the **absence** of a verdict, not a value of it, and never appears as a selectable option in the verdict menu. | design invariant I4 |
| **DFR-005** | A measured value is only ever written by direct typing. No bulk action, default or derivation writes one. | design invariant I5 |
| **DFR-006** | The axle-count default constrains nothing at fill time — it must appear in no validation and in no comparison against the number of axles actually recorded. | design invariant I6 |
| **DFR-007** | Verdict colour appears on the input border, the verdict marker and status chips only — never as a container or card background. | design invariant I7 |
| **DFR-008** | Reading order of positions across the screen is left-outer, left-inner, right-inner, right-outer. It is not to be reordered. | design §4.2 |
| **DFR-009** | Switching an axle Single↔Dual copies outer readings to the single values and restores the dual store on switching back; the alternate store is session state and is never persisted. Submitting stamps the axle's configuration and persists only the matching store. | design §4.5 |
| **DFR-010** | Measurement rows can be reordered by dragging. | design TB-02a |
| ~~**DFR-011**~~ | ~~Inspection photos accept JPG and PNG only; video is rejected.~~ **Superseded by the new `S17-R9`, 2026-09-16**, which adds HEIC. The video exclusion survives; the JPEG-and-PNG-only half does not. Do not implement this row — Phase 6 carries the replacement. | design FD-06e, superseded |
| **DFR-012** | A reference file never blocks submit. | design FD-05e |
| **DFR-013** | Removing a reference file is an X followed by attaching again — there is no "Replace" control. | design TB-05c |
| **DFR-014** | A bulk-OK action whose scope has nothing left to mark renders inert (greyed, non-functional) rather than disappearing. The pattern keeps its place. | design §6.2, and PRD `S18-R9` agrees |
| **DFR-015** | The submit blocker count rides on the action that completes the section, and opens a list where each item navigates to its own field. | design §9, PRD `S14-R6`/`R7` agrees |

### 1.4 Non-functional requirements (`NFR`) — introduced by this analysis

Only the ones bearing on the foundation scope are listed; the remainder belong to the second plan.

| id | Requirement | Why it exists |
|---|---|---|
| **NFR-003** | An inspection's finding summary — per-verdict counts, and whether it carries any Monitor or Not OK — is derived **once at completion** and stored, not rolled up from positions on every read. The live fill screen still derives everything (DFR-001 holds); only the post-completion summary is materialised. | `S5-R17` makes one counting rule serve the asset list, the report summary and the Needs-action filter. A 77-field template carrying per-axle fields produces hundreds of positions per inspection. Rolling that up per page view is the shape of a timeout. |
| **NFR-004** | Every rule that withholds an action has a server-side negative test, endpoint by endpoint. | `S2-R17` promoted from prose to a gate. The named precedent, SV-7932, was a view-only user invoking the line builder because only the button was hidden. |
| **NFR-008** | The per-position answer volume is sized before the schema ships, and the index design is deliberate rather than incidental. **Resolved 2026-09-17 against production data — no additional index needed.** | Measured: 1,340 completed inspections, averaging 32.6 answer rows and at most 234; 48,312 answer rows in total. The per-axle field does **not** multiply that row count — §4.4 stores every position of a per-axle field as JSON inside **one** response row, under the existing unique `(inspection_id, field_id)` index. What grows is that row's document: a seven-axle dual unit (112 positions, `S8-E4`) is roughly 17 KB including row units, and a typical three-axle unit about 5 KB. That is small for a JSON column and irrelevant to indexing, and it also confirms deferring the materialised summary (NFR-003) — rolling up a few hundred positions per inspection in PHP is trivial. |
| **NFR-009** | A bulk Mark OK is one request and one transaction, not one write per position. Undo is equally atomic. | At inspection level on a 77-field template this is hundreds of position writes. The design's record of exactly what changed is what makes Undo exact. |
| **NFR-005** | Every new read path is tenant-scoped. The reference-file and axle rows carry no tenant column of their own, so each read joins its aggregate root and applies **both** organisation and workplace. | The asset-history requirement deliberately crosses a *customer* boundary, so scoping cannot be inherited incidentally from a customer join — it has to be explicit. |
| **NFR-007** | Reference-file storage growth is accepted, and measured rather than assumed. | `S11-E2` and `S11-R8` mean attachments are never deleted, because later template versions reference the same stored file. The PRD calls this an accepted cost; the plan should say what the cost is and record a review trigger. Belongs to **Phase 3**, not the second plan. |
| **NFR-014** | The feature flag gates every new endpoint and every new surface, and flag-off is a tested state. | The PRD gives the flag two bullets and no requirements, no negative cases, and no statement of who enables it per shop. |
| **NFR-017** | Verdict is never conveyed by colour alone on any surface — a shape, glyph or text label accompanies it. | The design's own token audit found no verdict tokens; the app carries verdicts by colour throughout. Deciding this when the tokens are created is far cheaper than retrofitting, and it is the on-screen form of the mono-print defect that affects the report in the second plan. |
| **NFR-018** | The dark tier distinguishes not-inspected from judged correctly. | The token layer already has a dark theme. The grey-versus-tinted distinction is how a technician reads which positions are still unjudged, so an inversion here is functional, not cosmetic. |

### 1.5 Clarifications and PRD comment outcomes

| Question | Asked via | Answer |
|---|---|---|
| Plan scope for a 22-story epic | intake | Foundation first; the hand-off and the report as a named second plan. Matches the design bundle's own build order and keeps the assistant-dependent work off the critical path. |
| How to plan against eight PRD-vs-design conflicts before Product rules | intake | Per-item and evidence-led: where shipped code already agrees with the design, plan the design's way and ask Product to correct the PRD; where nothing exists yet, decide it technically; where it is a pure product call, plan the PRD's way and flag it. |
| How to satisfy `S2-R17` when the permissions it names are indistinguishable server-side | intake | Add one new permission atom via migration, scoped to the new endpoints only, leaving the existing bundle mappings untouched. |
| How to treat surfaces that have requirements but no design | intake | Plan them from the PRD text, and raise the gaps on the PRD. |
| What does bulk Mark OK do to a position with no value entered? | PRD Key Decisions (answering the design's own blocking open question) | Stamp every position in scope, including unmeasured ones; the verdict is reversible until the next edit. Skipping them would leave the technician unsure the press did anything. |
| Where do Advisor, Started and per-section progress live on the completed screen? | PRD `S3-R7` (answering a design open question) | Nowhere — they are not carried onto that screen. The first two belong to the work order; progress is meaningless once the inspection is locked. |
| Does Preview draw a banner explaining itself? | PRD `S12-R33` (resolving a contradiction internal to the design) | No banner, and no line stating how many axles the technician starts on. The mode control already says which mode the author is in. |
| Is "Photo required if Not OK" on by default? | **Answered 2026-09-16** — Product ruled by revising the PRD, leaving `S17-R2` and the Key Decision that covers it **unchanged**. | **ON — settled, not assumed.** An earlier revision of this plan assumed off, because the setting ships off and the design reversed it deliberately on 2026-09-03 with a verification gate around the reversal. That reasoning was too thin: the PRD does not merely state `S17-R2` in passing — its **Key Decisions** section rules on it explicitly ("Note required on a flagged response, and photo required on a Not OK response to a checkbox, are on by default for newly created templates"), and that section post-dates the design review by a week. That is a considered product position, not an oversight an older design supersedes. The same Key Decision covers the note rule, `S1-R2`, so **both** default on for a newly added field. This is now a requirement rather than a working assumption. |
| Does a new per-axle field arrive pre-filled with four rows? | **Answered 2026-09-16** — `S8-R2`, `S8-R3` and `S8-R4` left unchanged in Product's revision. | **YES**, with the named rows, units and scopes of `S8-R3`/`S8-R4`. Settled. |
| Which measurement units, in what order? | **Answered 2026-09-16** — `S8-R28` left unchanged, and nothing in the revision shortens the list. | **Keep all nine shipped units and reorder so inches is first.** The design's five-unit list would have removed four that live templates may already use; the PRD never asked for that and now explicitly stands. Remember the reorder touches **two** files, since the unit union is duplicated in the API model. |
| Does Preview write its axle count back to the draft? | Confluence comment, 2026-09-15 — **resolved here, ruling still welcome** | **Yes — build `S12-R31` as written.** The earlier assumption of "no" was wrong, and retiring it is one of this plan's audit fixes. The design's prohibition is asserted over **inspection and answer** rows — its own self-check reads "assert the inspection tables are untouched" — and writing a draft *template's* axle count touches none of them. So the two documents are reconcilable and the PRD's requirement stands: adding or deleting an axle in Preview writes the count back to the draft, which is the round trip the mode exists to remove. Phase 8 implements this; nothing in the plan now assumes otherwise. |
| Reference-file size limit | **Answered 2026-09-16**, and Product agreed **10 MB** the same day. | **10 MB.** Note the reasoning, because an earlier revision got it wrong twice. We first said 10 MB *because 20 MB would need the platform upload cap raised* — it would not: that 10 MB figure is the **local development** container's, while the deployed one allows 120 MB with the proxy at 150 MB, so `S11-R3`'s first branch is already satisfied and 20 MB costs nothing. We also said 10 MB "matches the existing per-inspection photo budget", which compared a per-file cap to a **cumulative whole-inspection** total. Both are withdrawn. 10 MB stands as a product choice rather than a constraint, and 20 MB remains one line of configuration away. |

---

## 2. Architecture Overview

Digital Inspections V1 already occupies one well-formed bounded context. Nothing in this plan creates a new context or crosses a boundary that is not already crossed; the work is an extension of an existing aggregate pair plus one genuinely new concept.

```
api/src/VehicleService/Inspections/            ← everything below lives here
├── Domain/
│   ├── Template/    InspectionTemplate (lineage) → Version → Section → Field
│   │                FieldType, FieldConfig, LineageStatus, VersionStatus
│   ├── Instance/    Inspection → InspectionResponse → InspectionResponsePhoto
│   │                InspectionStatus, ResponseValue, WorkOrderLineSnapshot
│   └── Report/      InspectionReport  (append-only versions)
├── Application/     Command/Query + Handler per use case, DTOs, subscribers
├── Infrastructure/  Doctrine write repositories (ORM XML) + DBAL read fetchers
└── UI/HTTP/         thin controllers + two access gates (template, instance)

app/src/components/ts/inspections/
├── builder/         InspectionTemplateBuilder.vue  (one reactive model, props/emits)
│                    + InspectionBuilderMobile.vue  (separate phone layout)
├── filler/          DesktopFiller.vue / MobileFiller.vue, chosen on $q.screen.lt.md
│                    fields/InspectionFieldCard.vue  (v-if chain on field.type)
├── completion/      InspectionCompletedView.vue (+ mobile twin)
└── composables/     useInspection, useInspectionTemplate, useInspectionTemplates
```

**What changes structurally.** One new field type, `Per axle`, is unlike the existing five in a way that matters: every other type stores **one answer per field**, enforced by a unique constraint on `(inspection_id, field_id)`. A per-axle field stores **many answers per field** — one per wheel position, on a variable number of axles the technician adds while filling. That single difference is the architectural centre of this plan, and it drives the schema question in §4, the state-model question in §6, and the roll-up question that NFR-003 answers.

**The read path is where the cost lands.** A verdict is stored only per position (DFR-001) and every aggregation above it is computed. That is correct while the technician is filling — the data is in memory and the roll-up is cheap. It stops being correct once the same counting rule has to serve the asset list, the report and the findings that feed the work-order build, because those read completed inspections at volume. The plan resolves this by keeping derivation live during filling and materialising a summary once, at completion, on the path that already exists for that purpose.

**Three existing mechanisms are reused rather than rebuilt**, which keeps the blast radius small:

| Need | Existing mechanism |
|---|---|
| Seeding starter templates to every organisation | An application service invoked by an endpoint and by a console command — **not** the migration-plus-registration-subscriber pattern the feature flag uses, which §3.3 (D7′) shows is impossible here: templates are workplace-scoped, and organisation registration fires before any workplace exists |
| One transactional multi-write for bulk Mark OK | `BulkChangeLineStatusCommandHandler`'s shape — explicit transaction, pre-computed changed and failed lists, one aggregate event per batch rather than per row |
| Storing and serving reference files with tenant isolation | `FileStorage`/`S3Storage` behind `InspectionStoragePathBuilder`, exactly as inspection photos already do, with the read path scoped by joining to the aggregate root |

**What must be built with no precedent in this codebase:** a full-screen modal wrapper, an in-app file viewer (reports currently open through `window.open` on a blob URL), a template-field attachment of any kind, and a per-field validation rule keyed off flagged positions rather than a single stored answer.

---

## 3. Technical Decisions

### 3.1 Decisions taken by the requester

| # | Decision | Rationale, and what was rejected |
|---|---|---|
| **D2** | Plan the foundation now; the hand-off and the report as a second plan. | Matches the design bundle's own stated build order (data model → value control → per-axle → field card → builder inspector → hand-off), and keeps the assistant-dependent work — which is untestable on QA today and whose brief lives outside this repository — off the critical path. *Rejected:* one whole-epic document, which would be hundreds of pages and stale before execution; and hand-off first, which would front-load the customer value but depend on a data model that did not exist yet. |
| **D3** | Resolve PRD-versus-design conflicts per item, led by evidence. | Neither document is categorically authoritative: the PRD is later-dated overall, but the design carries recorded rationale the PRD never folded in, and in one case the shipped code settles the matter outright. *Rejected:* "the PRD always wins", which would have planned a change to released behaviour as if it were a new default; and "the design always wins", which risks planning against decisions Product knowingly superseded. |
| **D4** | Add one new permission atom by migration, scoped to the new endpoints. Leave existing bundle mappings untouched. | Delivers `S2-R17` where this epic needs it without re-litigating an app-wide authorization policy that is deliberate and documented. Per repo convention a new permission ships as a migration, so it is recorded and runs everywhere, not as a one-off command. *Rejected:* fixing the bundle mappings properly, which is architecturally right and fixes the SV-7932 class at its root but changes authorization for every feature relying on the current mapping; and enforcing with existing atoms plus a Golden-Rule exemption, which leaves in place exactly the precedent `S2-R17` was written to prevent. |
| **D5** | Plan the undesigned surfaces from the PRD text, and raise the gaps on the PRD. | `S13` is largely deletions from an existing template with identifiable line numbers and `S7` is two record writes; both are specific enough to implement. Two parts are carved out as genuinely needing a designer: the report's new per-axle table, and making a verdict readable in black and white. |

### 3.2 Decisions taken here

| # | Decision | Rationale, and what was rejected |
|---|---|---|
| **D1** | Keep the PRD's own requirement ids as the functional requirement set; add `DFR-` for design-only requirements and `NFR-` for analysis-introduced non-functionals. | Those ids are cited by 22 Jira stories, the design build spec and 72 review items. *Rejected:* renumbering to `FR-001`, which breaks traceability with three systems for no benefit. |
| ~~**D7**~~ | **Superseded by D7′ in §3.3 — do not build this.** Seed starter templates with a migration for existing organisations plus a subscriber on organisation registration. | This is precisely how the `DigitalInspections` feature flag is already seeded in this context, so it is a proven pattern rather than an invention — and the design records that no seeding mechanism exists, leaving the choice open. *Rejected:* an on-demand copy at first builder visit, which makes the starter library's content depend on when a shop first opens the builder and gives no way to correct a starter later; and a CLI command, which would not run for organisations created after it was executed. |
| **D8** | Map verdict colours onto the **existing** `--sv-success` / `--sv-warning` / `--sv-danger` semantic tokens plus grey for not-inspected. Do **not** introduce new verdict hexes. Keep the ShopCoach purple as a brand-scoped token, explicitly **not** semantic. | The design's own token audit found the verdict colours already match the shipped scales exactly; the design README hard-codes hexes only because it was written outside the token system. Keeping the purple non-semantic is a PRD Key Decision, not a preference. *Rejected:* a new verdict token family, which would duplicate three existing scales and create two sources of truth for the same colour. |
| **D9** | The reference-file size limit is **10 MB**, held as a **single configured constant** referenced by the endpoint, the request validation and the user-facing copy string. | Product agreed 10 MB on 2026-09-16. **Two earlier rationales are withdrawn and must not be re-derived.** First, that 20 MB would require raising the platform upload cap: it would not — the deployed container allows 120 MB and the proxy 150 MB, and the 10 MB limit that prompted the claim belongs to the *local development* container. Second, that 10 MB "matches the existing per-inspection photo budget": that budget is a **cumulative whole-inspection** total, not a per-file cap, so the two were never the same kind of number. 10 MB is therefore a product choice, not a constraint, and 20 MB is one line of configuration away. The constant remains rather than a literal because `S11-R3` exists precisely to stop the enforced limit and the stated limit drifting apart — the copy must read from the same source the validator does. |
| **D10** | Phone and desktop remain **two components**, not one compressed layout, for every new surface. | This is the established pattern in this exact feature — the filler and the completed view each already ship a desktop and a phone component chosen on `$q.screen.lt.md`, and the builder ships a separate phone component with its desktop view inline — and the design is explicit that the axle grid is abandoned below tablet rather than squeezed. `S8-R23` requires it in so many words. |
| **D11** | Bulk Mark OK is **one endpoint, one transaction**, parameterised by scope, returning the exact set of positions it changed. | NFR-009. The returned set is what makes Undo exact rather than approximate, and it is what the cascading after-state counts are computed from. *Rejected:* one write per position, which at inspection scope on a 77-field template is hundreds of round trips; and computing Undo by re-deriving what "was probably not inspected", which cannot distinguish a position the press changed from one the technician set to OK by hand a moment earlier. |

### 3.3 Decisions corrected by codebase planning

Two decisions recorded above were made before the planners had read the code, and the code overruled them. They are kept visible rather than quietly rewritten, because the reasoning matters.

| # | What was decided | What the code showed | Revised decision |
|---|---|---|---|
| **D7 → D7′** | Seed starter templates with a migration for existing organisations plus a subscriber on organisation registration, mirroring how the feature flag is seeded. | **Both halves are impossible.** Templates are tenant rows scoped to a **workplace** with a four-level graph of UUIDs beneath them, so a migration would have to enumerate every workplace, mint fresh UUIDs, emit around forty inserts each, and could never be tested with PHPUnit — and it would only cover workplaces existing at deploy time. Worse, `OrganizationRegistered` **fires before any workplace exists**, and there is no workplace-created event to hook. The flag-seeding precedent does not transfer: a feature flag is a global row with a natural key; a template is neither. | **An application service plus a console command plus an on-demand endpoint.** `StarterTemplateSeeder::seed(slugs)` runs for the current organisation and workplace, is idempotent by template name, and publishes what it creates so the starters are immediately attachable. A CLI command backfills existing tenants by enumerating organisations holding the `DigitalInspections` flag and running the seeder per workplace under the sanctioned `runAs` decorator shape. An endpoint exposes it for self-serve. A domain event from workplace creation, to auto-seed new workplaces, is noted as follow-up work outside this plan. |
| **NFR-003 placement** | An inspection's finding summary is derived once at completion and stored, because rolling up positions per page view "is the shape of a timeout". | The premise was wrong for *this* scope. The report and the completed view **already** read `value` JSON per field and roll up in PHP, and there is **no SQL-side aggregation over statuses anywhere in the codebase**. So JSON answer storage costs the current readers nothing, and a materialised summary would be built for a reader that does not exist yet. | **NFR-003 moves to the second plan**, where the asset Inspections tab genuinely needs cross-inspection aggregation. It stays in the requirement set so it is not lost, and the per-axle roll-up is implemented as **one domain function** so the eventual denormalised column has a single place to be written from. |

### 3.4 Cross-area contract conflicts, resolved

The two planners worked independently and disagreed twice on the wire contract. Both are resolved in the backend's favour, for reasons the frontend planner did not have visibility of.

| Conflict | Frontend proposed | Backend proposed | Resolution |
|---|---|---|---|
| **Where the axle list lives** | `axles` as a field inside the per-axle response value, on the grounds that adding and removing axles is a fill-time action | Its own table, `inspection_axle`, as a fourth child collection of the inspection | **The backend's.** Axles describe the **vehicle**, not one field. A template may carry two per-axle fields — a tractor's brakes and its tyres — and both must see the same axles, which is only possible if the axle list is owned by the inspection. The response value therefore carries **no axle list** — only `positions` and the optional `rowUnits` of §4.4 — and anything else at the top level is rejected loudly rather than persisted silently. |
| **What identifies an axle in a position key** | The axle's **index** — `${axleIdx}_${rowId}_${slot}` | The axle's server-minted **UUID** — `fieldId:rowId:axleId:position` | **The backend's.** An index is not an identity: deleting axle 2 of 4 renumbers the rest, so every key beneath them has to be rewritten, and the frontend plan had already noticed this and added a `removeAxle` re-keying helper to compensate. A UUID makes the re-key unnecessary and makes "prune the positions of a removed axle" a single predicate. Separately, `data-test-id` values use `_` separators and never contain a colon — that is a test-id convention, not a change to the key. |

### 3.5 Corrected by the plan-versus-PRD audit

An adversarial audit was run against this plan with no knowledge of how it was written, comparing it
rule by rule against the PRD and spot-verifying its claims about the codebase. It returned 23 ranked
findings and every one is resolved in the text above. Four classes are worth naming, because they are
the classes a second reader should look for:

- **A default that leaked out of its scope.** The 2–5 axle range belongs to the *template* control
  and had reached **fill-time validation**, which would have made a seven-axle road train
  un-inspectable — contradicting `S8-E4`, `S8-R9` and this plan's own `DFR-006`, while four other
  sections sized for seven axles. Silent, and the severest finding.
- **A requirement with nowhere to live.** `S8-R27` lets a technician change a row's unit while
  filling, and the schema had no place to put it. `rowUnits` (§4.4) now does, keyed per field, row
  and axle — the exact scope the requirement states.
- **Two requirements that would have shipped a wrong artefact.** `S8-R24`'s report half was deferred
  behind a status reading "Planned", and because completion *is* report generation, every completed
  per-axle inspection would have emitted a PDF printing the field as a bare label with no readings.
  And `S11-N3`, removing an attachment, was architecturally blocked: no detach endpoint existed and
  the carry-forward was unconditional, so a file once attached could never be removed, permanently.
- **Requirements traced but never tasked.** Around a dozen ids had a traceability row and no work in
  any phase — the clear-axle action, axle expansion, several builder edge cases, the phone axle
  header. Traceability had become a claim rather than a plan, which is exactly what a traceability
  table is supposed to prevent.

Two smaller corrections change what a reader should believe: the plan had **contradicted itself** on
whether Preview writes its axle count back to the draft (§1.5 said no, Phase 8 built yes — Phase 8
was right, and the PRD's requirement stands), and it had mis-stated the E2E deletion picture —
though the specific claim made there, that an existing unit test asserts publishing is allowed with
an empty *response* label, proved **wrong in itself** and is withdrawn in §7.5: the two tests in
question guard a field with **no label**, which `S1-E6` and `S17-E5` require to keep working. Do not
invert them. Several code claims were also simply
wrong and are now corrected: the "times used" work targeted two files that render no usage figure
while the four that do were untouched, the shared-resolver refactor described four handlers where
three are identical, and the per-axle counting unit was left unspecified where the PRD's own change
log records it as contested and resolved.

### 3.6 Answered by Product, 2026-09-16

Product responded to the planning pass by **revising the PRD rather than replying to the comment**,
and the page's change log records nine corrections attributable to it. Everything bearing on this
plan's scope is now settled. Three of the rulings changed this plan; the rest confirmed it.

**Confirmed by the PRD standing unchanged** — the photo and note defaults are on for a newly added
field, a per-axle field arrives pre-filled with the four named rows and their units and scopes, and
the nine shipped measurement units stay with inches moved first. The plan already built all three,
so nothing moved.

**Changed this plan:**

- **HEIC is now a requirement, not a mitigation.** The new `S17-R9` accepts HEIC for inspection
  photographs, because a phone camera must not be able to make `S17-R3`'s submit blocker
  unsatisfiable, and the new `S17-E6` names the accepted formats at the point of failure. The plan
  had assumed only the honest-rejection half; Phase 6 now does both and reuses Phase 3's HEIC
  handling and download-only viewer.
- **The reference-file limit is conditional on an infrastructure change.** `S11-R3` was rewritten: it
  no longer claims an endpoint enforces 20 MB, and the limit is 20 MB *only where the platform's own
  upload cap is raised in the same release*, 10 MB otherwise, with the panel saying whichever applies.
- **`S8-R1` lost its second clause** — the removal of a measurement axle option that had never
  existed. There is no requirement there to satisfy or to mark void.

**Two questions this plan raised on 2026-09-16 were answered the same day.** For `S5-E3`, an inspection whose work order has been deleted stays **listed, readable, and with its report still downloadable** — the fullest of the three options put forward. That is second-plan work, but it settles what the schema has to support. For a photograph the report cannot render, the report **prints a placeholder naming the format** rather than a broken image or nothing at all; that half lands in Phase 6 and is now settled rather than assumed. Product also took the four residual open/closed wordings to QA directly.

**Also worth knowing, because the plan's own claims fed it:** the PRD stopped describing a work order
as open or closed anywhere. `S2-R4` and `S2-R5` now name an **eligible build target** and say why —
"the platform carries several competing definitions of open, and this rule names its own predicate
rather than joining them." The Key Decision gating the build on a completed inspection now gives its
real reason (completion means a report exists, a fixed record of the findings) rather than the
reopening argument, which did not hold. `S3-E4` was deleted, because it described an inspection the
platform cannot produce. `S2-E8` was **deleted and replaced**, not merely dropped: a shop with no
labour types is a perfectly producible state — what could not happen is the outcome it described, a
line arriving with zero labour cost. Its replacement is a new prerequisite ("the shop has at least
one labour type") plus the new `S2-N6`, which has the build refuse and state the reason rather than
producing a line that cannot be saved. The second plan picks that up. And the template-version
pinning moved out of Assumptions into
a stated fact, crediting the planning pass.

### 3.7 A schema dependency the second plan now carries

`S5-R21` became a **schema requirement** in the same revision: the asset is "stored on the inspection
when it is created rather than derived through its work order", and "inspections that exist before
this release are backfilled from their work order's asset at migration." `S5-E3` goes further —
"this requires an inspection to **outlive its work order** rather than being removed with it."

Two things in this paragraph belong to **`S2`** rather than `S5`. Product ruled explicitly on the eligible-target predicate: `S2-R5` **supersedes** the 25 August comment in this page's own thread, and the 25 August thread is being resolved pointing at the new wording. And one status question the page could not settle was answered from the code on 2026-09-16: **Imported is not a work order status at all** — the enum carries eight values and none is `imported`, imported work orders being a separate aggregate in their own table. They do carry lines of their own, in `work_order_line_imported` — what they have no relationship to is the `work_order_line` table an inspection hangs off, and no path creates one against them. So it is ineligible by construction rather than by rule, and a prior product ruling of 2026-08-26 had already dropped it from a status list for the same reason.

Both belong to `S5`, which this plan defers, so neither is in scope here. Two consequences are worth
recording anyway, because they are cheaper to know now than to discover later:

- It is a **second migration altering the `inspection` table**, after the one **Phase 7** ships — the
  bulk-OK ledger column of §4.5. Phase 5's migration creates a *new* table (`inspection_axle`) and
  does not alter `inspection` at all. If the second plan lands close behind Phase 7, the two
  alterations are worth combining rather than sequencing.
- Stopping an inspection being cascade-deleted with its line is a **change to shipped V1 behaviour**,
  not an addition. It alters what the fill and completed screens can encounter — an inspection whose
  work order no longer exists — which is a state no current code path produces. That is a behavioural
  change with its own test surface, and it should not be treated as a column addition.

---

## 4. Database Changes

> ⚠️ Migrations are written **by hand** and verified as a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"). DBAL's schema tools choke on functional and expression indexes in this repo, so the real migration is produced by the implementer against the live schema. Hand-authored foreign keys must be registered in `MANUALLY_MANAGED_FOREIGN_KEYS`. See `api/.claude/reference/database.md`. The SQL below communicates **shape and intent** only.

Three migrations, in dependency order. Every addition is nullable or defaulted, so each is backward compatible with the running application.

### 4.1 `inspection_template_field` — three new columns

Entity `api/src/VehicleService/Inspections/Domain/Template/Field.php`; mapping `Infrastructure/Persistence/Repository/Doctrine/Template/Field.orm.xml`.

| Column | Type | Null | Purpose |
|---|---|---|---|
| `field_key` | `BINARY(16)` (`binary_uuid`) | NOT NULL after backfill | Stable identity across draft saves **and** version clones — the mechanics are below in this section and in Phase 1 |
| `is_note_required_if_flagged` | `TINYINT(1)` default 0 | NOT NULL | `S1`. Named for what triggers it — Monitor **or** Not OK — deliberately not mirroring the shipped `is_photo_required_if_not_ok`, which fires on Not OK alone. **The column default stays 0 on purpose**: `S1-E2` requires templates created before this release to be unaffected, so a column default of 1 would retroactively turn the rule on for every existing field. `S1-R2`'s "on by default" is a property of a **newly added field in the builder**, and it is set there (Phase 2) |
| `reference_file_id` | `BINARY(16)` (`binary_uuid`) | NULL | `S11`. Points at an immutable reference-file row; copied verbatim by `Field::copyInto` so a cloned version keeps the same file |

```sql
-- Illustrative shape only, NOT the migration to copy-paste
ALTER TABLE inspection_template_field
    ADD field_key BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)' AFTER id,
    ADD is_note_required_if_flagged TINYINT(1) NOT NULL DEFAULT 0 AFTER is_photo_required_if_not_ok,
    ADD reference_file_id BINARY(16) DEFAULT NULL COMMENT '(DC2Type:binary_uuid)';

UPDATE inspection_template_field SET field_key = id WHERE field_key IS NULL;   -- hand-authored backfill

ALTER TABLE inspection_template_field
    MODIFY field_key BINARY(16) NOT NULL COMMENT '(DC2Type:binary_uuid)';

CREATE INDEX itf__reference_file_id_idx ON inspection_template_field (reference_file_id);
```

**No unique index on `field_key`**, because a key recurs across versions by design and the version id lives on the section rather than the field. Uniqueness within a save payload is enforced in the handler. **No foreign key** on `reference_file_id`: rows are never deleted, so the integrity it would buy is already guaranteed. The backfill gives a v1 field and its v2 clone *different* keys, which is acceptable — no attachments exist yet, and nothing in scope needs cross-version key equality for legacy data. Say so in the migration description.

**Per-axle authoring data stays in the existing `config` JSON column**, whitelisted like every other field type:

```json
{"axleCountDefault": 3,
 "rows": [
   {"id": "tire-pressure",    "label": "Tire pressure",    "unit": "PSI",    "scope": "perTire"},
   {"id": "tread-depth",      "label": "Tread depth",      "unit": "in.",  "scope": "perTire"},
   {"id": "brake-lining",     "label": "Brake lining",     "unit": "in.",  "scope": "perSide"},
   {"id": "push-rod-travel",  "label": "Push-rod travel",  "unit": "in.",  "scope": "perSide"}]}
```

A separate table for measurement rows was **rejected**: rows have no lifecycle independent of their field, are capped at twelve, and every existing reader already has the field's `config` in hand. Crucially, `Field::copyInto` copies `config` verbatim, so row ids survive a version clone for free — whereas a table would need its own reconciliation inside the draft rebuild and a fourth cascade. Row ids are client-supplied slugs (`^[a-z0-9][a-z0-9-]{0,63}$`) validated unique within the field; the four defaults use the fixed slugs above, which is what makes a position key readable.

### 4.2 `inspection_template_reference_file` — new table

Entity `Domain/Template/TemplateReferenceFile.php`, a child of `InspectionTemplate` mirroring how `InspectionResponsePhoto` hangs off `Inspection`. Columns: `id`, `template_id` (FK to `inspection_template`, `ON DELETE CASCADE`), `field_key`, `file_name`, `storage_path`, `mime_type`, `file_size`, `uploaded_by`, `uploaded_at` — the photo table's shape with its two parent columns changed: this hangs off the **template** rather than an inspection, and it records the field **key** rather than a field id, because the id churns and the key does not. Index `itrf__template_id_idx`. **No orphan removal** on the association: rows are immutable and never deleted.

The row lives at **lineage** level while the live link is the field's `reference_file_id` pointer. That is what makes `S11-R8` work: because `copyInto` carries the pointer, a v1 field and its v2 clone share one file row, and replacing the file on a draft mints a **new** row and re-points only the draft field — so v1 and the completed inspections beneath it keep the old file untouched. Keying the file by `(template_id, field_key)` alone was **rejected**: replacing would then silently change what an already-published version shows.

Storage path `organization/{org}/workplace/{wp}/inspection-templates/{templateId}/reference-files/{fileId}`, added as a method alongside the existing photo path builder. Tenant isolation is not a column on the row — every read joins `inspection_template` and applies both `organization_id` and `workplace_id`, exactly as the photo download fetcher already does through `inspection`.

### 4.3 `inspection_axle` — new table

Entity `Domain/Instance/InspectionAxle.php`, a fourth one-to-many beside responses, photos and reports. Columns: `id` (server-minted — **this is the `axleId` in every position key**), `inspection_id` (FK, `ON DELETE CASCADE`), `position` (`SMALLINT UNSIGNED`, 1-based display order), `tire_configuration` (`single`/`dual`), `brake_type` (`drum`/`disc`), `updated_at`. Unique index `ia__inspection_id_position_unq (inspection_id, position)`.

Its own table rather than JSON, per §3.4: axles describe the vehicle, so two per-axle fields on one template must see the same axle list, and the report and completed view want them ordered without decoding JSON.

### 4.4 Per-axle answers — no new table

One `inspection_response` row per per-axle field, using the existing unique constraint on `(inspection_id, field_id)` and the existing `value` JSON column:

```json
{"positions": {
   "<fieldId>:tire-pressure:<axleId>:lo": {"value": "32.5", "status": "pass"},
   "<fieldId>:tread-depth:<axleId>:li":   {"value": null,   "status": "fail"},
   "<fieldId>:brake-lining:<axleId>:l":   {"value": "N/A",  "status": null}},
 "rowUnits": {
   "<fieldId>:tire-pressure:<axleId>": "PSI"}}
```

**`value` is a string, not a number, and that is a deliberate schema decision.** `S8-R16` requires
values to "accept numbers **and characters**, including the text N/A"; `S8-E3` requires free text to
reach the report "as entered, without being converted or dropped"; and `S8-E2` makes the point
sharpest — "A value containing the text N/A and a verdict of N/A are **different statements**, and
both survive to the report distinctly." A numeric column cannot hold the first of those, and a
coercing one destroys the third.

So the position entry stores **exactly the characters the technician typed**, and nothing on the
write path parses, rounds or normalises them. This differs from the existing standalone measurement
field, whose branch validates a numeric `amount` — do **not** copy that branch here. It is the
single most expensive thing in this plan to get wrong, because changing it later means migrating
every stored answer.

**`rowUnits` is what makes `S8-R27` storable**, and it is the reason the value carries a second key.
The technician may change a row's unit while filling, and the requirement is precise about the
scope: the change "applies to that row across the whole axle, so every position on it is read in one
unit, and it does not touch the other rows or the other axles." So the unit is keyed per **field,
row and axle** — not per position, which the PRD rules out explicitly ("What is not supported is a
unit per position. One tire in inches and the next in millimetres would make a row's readings
incomparable and its roll-up meaningless"), and not per row alone, which would leak across axles.

An absent key means "use the template's unit for that row", so the common case stores nothing.
Changing a unit **never converts the amounts already entered** (`S8-E7`) — the technician is
recording what the gauge shows, and silently multiplying their numbers would be worse than leaving
them. The unit also travels downstream: `S15-R1` sends the measured value **and its unit** to the
assistant, so without this the second plan's brief would report a reading in the wrong unit.

Rules the value object enforces: an entry exists **only** when it carries a value or a verdict, so an absent key *is* "not inspected" (DFR-004); `status: null` with a value means measured but not judged; a value of `"N/A"` with `status: null` is a measurement that does not apply, which is **not** the same as `status: "na"` (`S8-E2`); and no code path ever writes `na` except an explicit position write by the technician (DFR-002).

A positions table was **rejected** on evidence rather than preference: the completed view and the report already fetch `value` per field and roll up in PHP, and there is **no SQL-side aggregation over statuses anywhere in the codebase**. A table would add roughly sixty rows per field, per-position updates from the fill screen and a fifth child collection, in exchange for cross-inspection SQL aggregation that nothing in this scope reads. Bulk Mark OK is also markedly cheaper against JSON — one aggregate load, N in-memory merges, one flush. If analytics later needs it, the roll-up is one domain function and a denormalised column can be projected from it.

`assertExactKeys` is strict in this codebase, and the per-axle branch must keep it that way: `positions` and the optional `rowUnits` are the **only** permitted top-level keys, so a frontend that adds a computed `rollup` to its save payload is **rejected loudly** rather than persisted silently. A `rowUnits` **value** is validated only as a non-empty string — deliberately **not** against the shipped unit list, because Phase 4 keeps the backend free of a unit whitelist and a live template's row may already hold a string outside that list; whitelisting here would stop a technician recording the row's own default unit. Its **key** has three segments rather than a position key's four, so it needs its own parser, and it must name a row that exists on the field and an axle that exists on the inspection.

### 4.5 `inspection.bulk_ok_ledger` — new JSON column

Holds only the **last** bulk-OK batch: `{"batchId": "…", "stamps": [{"fieldId": "…", "positionKey": "…|null"}]}`. Cleared by every other mutation — recording a response, adding or removing a photo, reconfiguring axles, and reopening — which is precisely what makes `S18-R8`'s "the report clears on the next edit anywhere" true by construction rather than by a timer.

A ledger *table* was rejected as over-built for one-level undo, and a marker inside each stamped value was rejected because it would break the strict key assertion on checkbox values.

### 4.6 Data migrations

Only one: the `field_key` backfill in §4.1, a single `UPDATE … SET field_key = id`. Fine at current volumes; batch it if the table turns out to be large in production. There is **no** migration for the new field-type values (the column is a `VARCHAR(20)` with an enum type, not a database enum), none for per-axle config (JSON), and none for the starter templates (§3.3, D7′).

**Two things the earlier review worried about need no migration at all**: there is no axle option on the measurement field to remove — Product removed that clause from `S8-R1` on 2026-09-16 once the planning pass reported the option had never existed, which also closes the item the PRD's own review child page filed as MF-9, on the grounds that the removal had no migration story — and there is no conditional-logic or branch data anywhere in `api/` to delete.

---

## 5. API Changes

All responses use the internal envelope. Template endpoints are gated by `InspectionTemplateAccessGate`, instance endpoints by `InspectionInstanceAccessGate`, and every one of them inherits the `DigitalInspections` feature-flag guard those gates already apply (NFR-014).

### 5.1 New endpoints

| # | Method & path | Purpose | Gate |
|---|---|---|---|
| 1 | `POST /api/inspection-templates/{id}/draft/fields/{fieldKey}/reference-file` | Upload one reference file for a **draft** field. Multipart, part name `file`. Returns the descriptor with a download URL. Replacing is simply uploading again — a new immutable row, the old one untouched. | `guardChange` |
| 2a | `DELETE /api/inspection-templates/{id}/draft/fields/{fieldKey}/reference-file` | **Detach** the file from a draft field — clears the pointer only; the stored row and the object are never deleted (`S11-E2`, NFR-007). This is `S11-N3`, and without it a file once attached could never be removed, permanently, because nothing else clears the pointer and Phase 1's carry-forward is otherwise unconditional. The frontend's remove control needs this counterpart. | `guardChange` |
| 2 | `GET /api/inspection-templates/{id}/reference-files/{referenceFileId}` | Stream the file. Read through a new fetcher that joins `inspection_template` and applies organisation **and** workplace. | `guardViewOrWorkOrderLineChange` — a technician filling an inspection needs to open it, and holds the work-order right rather than the template right |
| 3 | `POST /api/inspection-templates/starters` | Seed starter templates for the current organisation and workplace. Body `{"slugs": [...]}`, omitted meaning all five. Returns what was created and what was skipped. Idempotent by template name. | `guardCreate` |
| 4 | `PUT /api/inspections/{id}/axles` | Set the inspection's axle list — replace semantics, reconciled by id, with contiguous positions. **There is no upper bound on the number of axles**: `S8-R9` makes the template's count "a starting point rather than a shape" whose recorded axles "are never validated against it", `S8-E4` requires a seven-or-more-axle road train to work, and `DFR-006` forbids the default appearing in any validation. The 2–5 range belongs to the **template** control (`S12-R29`) and must not reach this endpoint. A lower bound of one is the only constraint. | `guardChange` |
| 5 | `POST /api/inspections/{id}/mark-ok` | Bulk Mark OK. Body `{"scope": "inspection"\|"section"\|"field", "sectionId"?, "fieldId"?}`. Returns the batch id, the counts, **and the exact set of stamps it applied** — per D11 that set is what makes Undo exact rather than approximate, so it belongs in the response and not only in the server ledger. One request, one transaction (NFR-009). An empty scope is a 400 rather than a silent no-op. **The server ledger is the single authority for Undo**: the client keeps the returned set only to render the per-level counts and to grey an exhausted action, and it undoes by calling endpoint 6 rather than restoring values itself. Two independent undo paths would drift the moment a save interleaved. | `guardChange` |
| 6 | `DELETE /api/inspections/{id}/mark-ok/{batchId}` | Undo that batch. **409** when the ledger no longer matches because something was edited since. Mirrors the existing photo upload/delete pairing. | `guardChange` |
| 7 | `GET /api/inspections/{id}/outstanding` | The navigable outstanding-items list: `{"canSubmit", "isSignatureRequired", "outstanding": [...]}`, each item carrying its section, field and — for a per-axle field — the flagged position keys. This is what `S1-R5`, `S17-R5` and `S14-R6`/`R7` need, and what the desktop list (which has no design) is built from. | `guardView` |

An action-style path for Mark OK is the documented exception for non-CRUD operations in this codebase, so endpoints 5 and 6 are conventional rather than novel.

### 5.2 Modified endpoints

| Endpoint | Change |
|---|---|
| `PUT /api/inspection-templates/{id}/draft` | Each field may carry `key` (echoed back, §4.1), `isNoteRequiredIfFlagged`, and the new type `perAxle`. It carries **no** detach flag for the reference file — detaching is endpoint 2a, and having two paths that clear the same pointer would leave neither authoritative. `shortText` and `longText` stay accepted and stay the only text types on the wire — a version clone copies old types into a new draft and re-saving that draft cannot be allowed to fail. When a per-axle field arrives with no `rows` at all, the handler applies the four defaults, so "arrives pre-filled" is true server-side as well as in the builder. |
| `GET /api/inspection-templates/{id}` | Field objects gain `key`, `isNoteRequiredIfFlagged` and the `referenceFile` descriptor. |
| `POST /api/inspections/{id}/responses` | Accepts the per-axle value shape. Validation is passed the inspection's axle ids so it can reject an unknown axle, an unknown row, or a position key whose field id does not match the field it is stored under. Full-replace-per-field semantics are unchanged. |
| `GET /api/inspections/{id}` | Gains `axles`, a computed `verdict` per response, a `rollup` (`rows`, `axles`, `field`) for per-axle responses, a per-section verdict, and a nullable `bulkOkBatchId` so the client knows whether to offer Undo. |
| `POST /api/inspections/{id}/submit` | Field-level validation moves out into a shared resolver — see §5.4. |

### 5.3 A refactor to land first

**Three** handlers contain a byte-identical `resolveFields()` that loads the pinned version and asserts it matches the inspection — the submit, save-responses and photo-upload handlers. Extract it to `Application/Service/Instance/PinnedVersionResolver` before adding endpoints 4 through 7, and switch those three. A fourth candidate, the get-inspection query handler, makes the *same* pinned-version assertion under a different name and returns the version rather than a field map — fold it in only if the resolver exposes both shapes, and treat that as a judgement call rather than a mechanical swap. The three are covered by existing tests; the fourth is not a drop-in.

### 5.4 Submit validation

The **three** field-level validations currently inline in the submit handler — required answer, required photo, and the conditional photo rule — move into a stateless domain service, `InspectionOutstandingResolver`, which becomes the **single** source of truth for the submit gate, the preflight endpoint and the fill screen's outstanding badge. Its rules:

- **`requiredAnswer`** — the field is required and nothing answers it. For a per-axle field that means no position carries a verdict. Nothing is ever inferred from the axle-count default (DFR-006).
- **`requiredPhoto`** — either the unconditional photo rule, or the conditional one on a checkbox field whose verdict is Not OK, with no photo present. Precedence is enforced as a **constructor invariant on `Field`**: the conditional flag is forced false whenever the unconditional rule is on or the type is not a checkbox, so the resolver reads the flags without re-deriving them. Legacy rows saved before that invariant existed get the same guard applied explicitly.
- **`requiredNote`** — the note rule is on, the field's verdict is flagged, and the comment is blank. For a per-axle field the flagged position keys travel with the item so the client can highlight them, while the note itself stays per field (`S1-R7` triggers off positions; the PRD's "one option per field, not one per response" keeps the note singular).
- **`signature`** — surfaced by the preflight only; the submit command keeps throwing its own specific error so the message stays precise.

**On the live QA defect:** the submit endpoint's 400 has ten distinguishable causes, and every error body in this codebase is flat — `{"errors":[{"error":"<message>"}]}` — so **the message names the branch**. Capture the body and the diagnosis is immediate. The three likeliest are a checkbox with the conditional photo rule answered Not OK with no photo (the current UI gives no per-field hint), the work order or its line having moved to a non-editable state between opening and submitting, and a missing signature style on a template that requires one.

Because that error body is flat, the client cannot receive a structured list from the submit call. The contract is therefore: submit returns a 400 whose message carries the count, and the client renders the list from endpoint 7. Teaching the shared error handler to attach a details payload was **rejected for now** — it touches the error path of every endpoint in the application, and the preflight endpoint is needed anyway for the outstanding badge.

---

## 6. Implementation Phases

Nine phases, dependency-ordered. Every phase sits behind the `DigitalInspections` flag and is independently testable. **Phases 1 and 3 are matched pairs** — the frontend must ship with or before the backend, because an old frontend saving a draft without echoing field keys would detach a draft's reference file. There is no data loss in that case (the file row survives and can be re-attached), but it is avoidable.

Paths are relative to the repository root.

---

### Phase 1: Seams, identity and contract
**Implements:** `S12-R20`–`R23` (backend half), `S1-R1` (storage), the `DFR` invariants as enforceable rules, NFR-014, NFR-017, NFR-018
**Depends on:** Nothing (starting point)
**User-visible change:** none, except a deliberate colour shift on existing verdict tiles — see the risk note

This phase buys the identity and the type-safety that every later phase spends. It changes no behaviour.

#### Database changes
| Migration | Description |
|---|---|
| `api/migrations/Version<ts>.php` | §4.1 — `field_key` (added nullable, backfilled from `id`, then made NOT NULL), `is_note_required_if_flagged`, `reference_file_id`, and the reference-file index |

#### Backend changes (`api/`)
| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/Inspections/Domain/Template/FieldType.php` | Modify | Add `PER_AXLE = 'perAxle'`. **Do not add a `text` case** — Phase 2 merges the two text types in the *builder* only and the wire keeps `shortText` and `longText`, so a `text` case would have no caller. Add `isText()` (true for both existing text types) and `hasVerdict()` (checkbox, measurement, per-axle — this is about which types *have* a verdict, which is broader than which types take the note rule; see Phase 2) |
| `api/src/VehicleService/Inspections/Domain/Template/Field.php` | Modify | New properties `fieldKey`, `isNoteRequiredIfFlagged`, `referenceFileId`, added as **trailing defaulted parameters** so the existing positional call sites keep compiling. Constructor invariant: force the conditional photo flag false when the unconditional rule is on or the type is not a checkbox; force the note flag false when the type carries no verdict. Add `fieldKey()`, `attachReferenceFile()`, `referenceFileId()`. `copyInto` passes both the key and the file pointer to the clone |
| `api/src/VehicleService/Inspections/Domain/Template/FieldConfig.php` | Modify | Nothing in this phase. The existing `shortText` and `longText` configs already carry everything the merged builder chip needs — a placeholder, and a row count on the multi-line side |
| `api/src/VehicleService/Inspections/Domain/Template/Version.php` | Modify | Add `findFieldByKey(Uuid): ?Field` |
| `api/src/VehicleService/Inspections/Application/Command/Template/SaveDraftFieldInput.php` | Modify | Add `?string $key` |
| `api/src/VehicleService/Inspections/Application/Handler/Template/SaveDraftCommandHandler.php` | Modify | **The key carry-forward.** Before the rebuild wipes the draft, snapshot `[fieldKey => Field]`; when building each field, reuse an incoming key that exists in the snapshot and carry its `referenceFileId` forward, else mint a fresh key. Reject duplicate keys within one payload. The existing `shortText` and `longText` config whitelists are unchanged |
| `api/src/VehicleService/Inspections/UI/HTTP/Template/SaveDraftController.php` + `DTO/SaveDraftRequestDto.php` | Modify | Map and validate `key` (optional UUID) and `isNoteRequiredIfFlagged` (optional bool). Rewrite the two stale comments claiming field ids are ignored |
| `api/src/VehicleService/Inspections/Application/DTO/Template/TemplateDetailDto.php` · `DTO/Instance/InspectionDetailDto.php` | Modify | Serialise `key` and `isNoteRequiredIfFlagged` |
| `api/src/VehicleService/Inspections/Application/Service/Instance/PinnedVersionResolver.php` | Create | §5.3 — extract the byte-identical `resolveFields()` from the **three** handlers that define it (submit, save-responses, photo-upload) and switch those three. The get-inspection query handler makes the same assertion under a different name and shape; folding it in is a judgement call, not part of this task |
| `api/src/VehicleService/Inspections/Domain/Template/TemplateValidationError.php` | Modify | `duplicateFieldKey`, `fieldNotInDraft` |

#### Frontend changes (`app/`)
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/inspections/fieldTypes.ts` | Create | The single metadata registry, `Record<InspectionFieldType, FieldTypeMeta>`, **moving** (not duplicating) the four hand-maintained tables that exist today. Because it is a `Record` over the union, adding a type later makes the compiler list every site that lacks it |
| `app/src/components/ts/inspections/builder/fields/Model.ts` · `filler/fields/Model.ts` · `composables/useInspectionAnalytics.ts` · `builder/fields/FieldCanvasRow.vue` · `builder/InspectionBuilderSection.vue` · `builder/InspectionBuilderMobile.vue` · `filler/fields/InspectionFieldCard.vue` · `completion/CompletedFieldCard.vue` | Modify | Read the registry; re-export the old names as derived views so no other consumer changes. Add an `assertNever`-style exhaustive default to every switch-style function so a missing branch becomes a compile error |
| `app/src/api/inspections/InspectionsModel.ts` | Modify | Add `'perAxle'` to the field-type union and a seventh member to the field union; add `isNoteRequiredIfFlagged` and `referenceFile` to **every** member; add the per-axle config, axle, row and position types, and the reference-file descriptor. Adding to the union is what makes the compiler enumerate the work for the phases after this one |
| `app/src/components/ts/inspections/builder/Model.ts` | Modify | Echo `key` in the save-draft payload — **this is the matched-pair half of the backend change**; carry `isNoteRequiredIfFlagged` and the reference-file pointer through `fieldFromServer`, `cloneConfig` and `fieldToPayload` |
| `app/src/css/tokens.scss` | Modify | Verdict tokens **aliased onto the existing** `--sv-success` / `--sv-warning` / `--sv-danger` families plus grey for N/A — no new hexes in the light tier. In the dark tier, declare the three values that do not flip automatically: the N/A fill and text, and the not-inspected trio. Add a comment recording that the ShopCoach purple stays a brand mark and no `--sv-ai-*` family is to be "completed" here |
| `app/src/components/ts/inspections/filler/fields/_status-tiles.scss` | Modify | Read the verdict tokens instead of the raw Quasar variables |
| `app/src/components/ts/inspections/composables/useInspection.ts` | Modify | Extract `hydrate(detail, workOrder)` out of `load` so `load` becomes fetch-then-hydrate. Preview depends on this in Phase 8 |
| `app/src/components/ts/inspections/filler/DesktopFiller.vue` · `MobileFiller.vue` | Modify | Add `preview?: boolean` and `showChrome?: boolean` props, defaulting to the current behaviour — **no-ops in this phase** |
| `app/src/components/ts/shared/dialogs/BaseDialog.vue` | Modify | Optional `maximized?: boolean`, default false, bound to the underlying dialog plus a modifier class. Extending the one dialog primitive rather than adding a second |

#### Key logic
```
// api/src/VehicleService/Inspections/Application/Handler/Template/SaveDraftCommandHandler.php
// The draft rebuild regenerates field PKs on every save, and version cloning regenerates them
// again. field_key is the identity that survives both, so a reference file attached to a draft
// field is still attached after the next autosave.
$previous = [];                                  // fieldKey (string) => Field, from the draft being replaced
foreach ($draft->sections() as $s) { foreach ($s->fields() as $f) { $previous[(string) $f->fieldKey()] = $f; } }
// ... while building each incoming field:
$carried = $input->key !== null ? ($previous[$input->key] ?? null) : null;
$key     = $carried?->fieldKey() ?? Uuid::new();
$refFile = $carried?->referenceFileId();         // carried forward; only endpoint 2a clears it
```

#### Unit / integration tests
- Backend: a key is preserved across two consecutive draft saves; a key is minted when the payload omits it; a duplicate key in one payload is rejected; `copyInto` preserves both the key and the file pointer; the photo-precedence invariant normalises a field saved with both flags on; a legacy `shortText` field still saves unchanged, and so does a `longText` one.
- Frontend: every existing inspections spec stays green (the registry move is behaviour-neutral); the save-draft payload round-trips `key`.

#### Verification (Definition of Done gates)
- **Static (scoped):** `composer cs-fix` · `vendor/bin/phpstan analyse` on the changed files · `./vendor/bin/pest` on the mirrored tests. Frontend `npx eslint --max-warnings=0`, `npx vitest related --run`, `npx vue-tsc --noEmit`
- **Migration gate:** `doctrine:migrations:migrate`, then `migrations:diff --allow-empty-diff` must report "No changes detected"
- **Smoke:** `bin/smoke-test.sh` — no 500s
- **Compile:** Vite up with no errors
- **Browser-walk:** open an existing template in the builder as the seeded `admin` user, save a draft twice, confirm the template still loads and publishes. Open an in-progress inspection and confirm the verdict tiles render — **expect a deliberate green/red shade shift** as the tiles move onto design-system values. That shift is the one visible change in this phase and it needs a design nod before merge

---

### Phase 2: Builder foundations — one Text field, the note toggle, photo precedence
**Implements:** `S12-R20`–`R23`, `S12-R26`, `S1-R1`, `S1-R2`, `S1-R6`, `S17-R1`, `S17-R2`, `S17-R7`, `S12-R14`, `S12-R15`, `S12-N3`
**Depends on:** Phase 1

#### Frontend changes (`app/`)
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/inspections/builder/fields/TextInspector.vue` | Create | The merged Text inspector: a placeholder input plus a Multi-line toggle that emits a type change between `shortText` and `longText`. The API types are untouched — one chip in the builder, two types on the wire |
| `app/src/components/ts/inspections/filler/fields/ShortTextField.vue` | Modify | **`S12-R21` — the Text field grows as the technician types rather than scrolling within itself.** The multi-line variant already autogrows; the single-line one does not, and since the builder now offers one "Text" chip, a technician typing a long answer into a non-multi-line field would hit a fixed single-line box. Merging the chip without this makes the requirement false for half the fields it covers |
| `app/src/components/ts/inspections/builder/fields/ShortTextInspector.vue` · `LongTextInspector.vue` (+ their specs) | Delete | Replaced |
| `app/src/components/ts/inspections/builder/fields/FieldInspector.vue` | Modify | Register `TextInspector`; collapse the two text chips into one; add the note-required toggle for **checkbox and per-axle only** — `S1-R1` scopes the rule to checkbox and `S1-R6` extends it to per-axle, and S1's own prerequisites name those two. A standalone measurement field does carry a verdict, so widening it would work, but it is invented scope and is left out; replace the two hint paragraphs with an information affordance carrying the precedence summary on demand (`S12-R14`, `S12-N3`) |
| `app/src/components/ts/inspections/builder/fields/PhotoInspector.vue` | Modify | Replace its hint paragraph with the same on-demand affordance |
| `app/src/components/ts/inspections/builder/InspectionTemplateBuilder.vue` | Modify | Carry `placeholder` across the Multi-line toggle instead of resetting the config; carry the note flag through the validation-update handler; **set both the note rule and the conditional photo rule `true` for a newly added verdict-bearing field** (`S1-R2`, `S17-R2` — the PRD's Key Decisions rule on the pair together). See the decision note below |
| `app/src/components/ts/inspections/builder/fields/CheckboxInspector.vue` · `builder/fields/Model.ts` | Modify | **"Include Monitor option" on by default for a new checkbox field** (`S12-R11`). It is off today, so this is a behavioural change and the only existing default this plan raises |
| `app/src/components/ts/inspections/builder/validation.ts` | Modify | **Block publishing on an empty *response* label, with the error on the row** (`S12-R12`, `S12-N2`) — while still allowing a draft to be saved. The property is a checkbox field's response labels, **not** the field's own label: publish validation today checks only the template name, the section count and empty sections, and inspects response labels nowhere. **Do not touch the field-label case** — the two existing tests that allow publishing a field with an empty label are asserting behaviour `S1-E6` and `S17-E5` require to keep working, because the outstanding-items list must still identify an unlabelled field by its type and position |
| `app/src/components/ts/inspections/builder/fields/FieldCanvasRow.vue` | Modify | A marker when the note rule is on; type, summary line and markers **wrapping rather than being cut off** (`S12-R16`); a checkbox's summary line lists its responses (`S12-R17`); a very long field or section name is shortened rather than breaking the layout (`S12-E3`) |
| `app/src/components/ts/inspections/builder/InspectionBuilderSection.vue` | Modify | `S12-R19` — an empty section offers no duplicate way to add a field, no self-duplication and no add-section control until it has content. `S12-E1` — if the last section is deleted, the canvas still offers a way to add one back |
| `app/src/components/ts/inspections/builder/fields/FieldInspector.vue` (selection) | Modify | `S12-E2` — deleting the selected field **clears** the properties panel rather than leaving a field that no longer exists. `S12-R9` — a newly added measurement row opens ready to be renamed |
| `app/src/components/ts/inspections/InspectionTemplates.vue` · `InspectionTemplatesModel.ts` · `InspectionTemplatesMobile.vue` · `InspectionTemplateActionSheet.vue` | Modify | **"Times used", not "Runs" (`S12-R26`).** These are the four files that actually render the figure — the desktop KPI card and table column, the phone chip and card, and the action sheet. The requirement names "the summary figure and the table column alike", so all four are in scope. The API field name stays as it is; only the user-facing wording changes. The publish-confirm dialog renders no usage figure and is **not** part of this |

**On the S17 and S1 defaults.** The builder sets both rules **on** for a newly added verdict-bearing field, per `S17-R2` and `S1-R2` — which the PRD's Key Decisions rule on as a pair. Two boundaries matter and are easy to conflate:

- **The column defaults stay 0.** `S1-E2` and `S17-N3` both require templates created before this release to be unaffected, so a database default of 1 would retroactively turn the rules on for every existing field. "On by default" is a property of the builder's new-field factory, not of the schema.
- **The save-draft mapper's absent-key default also stays false.** Changing it would silently alter payloads from the E2E factories and from any older client, which is a different failure from the one `S1-R2` is about.

The starter catalog does **not** set either flag, because `S12-R28` speaks only to required-to-complete — it says a shop "turns off what it does not want rather than turning on what it does", which is about the required flag and not these two.

#### Unit / integration tests
- The Multi-line toggle preserves the placeholder across the type change; the precedence summary renders the correct sentence for each combination of the two photo flags; the note toggle appears for verdict-bearing types only; a new field's flags match the recorded defaults.
- Before deleting the hint paragraphs, grep for their strings — the existing inspector and mobile-builder specs may assert on them, and so may the E2E builder specs.

#### Verification
Static gates; compile gate; browser-walk of the builder as `admin`: add a Text field, toggle Multi-line, confirm the placeholder survives; turn on both photo rules and read the summary; confirm no descriptor line has appeared anywhere the technician will see.

---

### Phase 3: Reference files, end to end
**Implements:** `S11-R1`–`R9`, `S11-N1`–`N3`, `S11-E1`–`E4`, `DFR-012`, `DFR-013`, NFR-007
**Depends on:** Phase 1 (the field key is what the upload addresses)
**Matched pair:** yes

#### Database changes
| Migration | Description |
|---|---|
| `api/migrations/Version<ts>.php` | §4.2 — `inspection_template_reference_file`, with its cascade foreign key and index |

#### Backend changes (`api/`)
| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/Inspections/Domain/Template/TemplateReferenceFile.php` | Create | Immutable entity, mirroring the inspection photo entity's shape |
| `api/src/VehicleService/Inspections/Domain/Template/TemplateReferenceFilePolicy.php` | Create | The accept list for **reference files**, which is a *separate* list from the photo one — that follows from reading `S11-R2` and the new `S17-R9` together rather than from an explicit ruling, but it follows unambiguously: `S11-R2` as written — PDF, JPEG, PNG, HEIC/HEIF, Word and Excel, **no video**. Inspection photographs take their own shorter list (JPEG, PNG, HEIC — Phase 6), and the two must not be collapsed into one policy class. The size limit is **injected as a container parameter**, not a class constant (D9), so Product's answer is one line of configuration. HEIC needs an extension fallback: PHP's mime sniffing reports `application/octet-stream` for some HEIC files, and without the fallback every upload from an iPhone fails |
| `api/src/VehicleService/Inspections/Domain/Template/InspectionTemplate.php` | Modify | The reference-file collection, `addReferenceFile()`, `findReferenceFile()` |
| `api/src/VehicleService/Inspections/UI/HTTP/Template/UploadTemplateReferenceFileController.php` + handler | Create | Endpoint 1. Copy the raw-request multipart handling of the existing photo upload controller, including its empty-upload guard. In one transaction: add the row, point the field at it, write the stream, save |
| `api/src/VehicleService/Inspections/UI/HTTP/Template/DownloadTemplateReferenceFileController.php` + query + fetcher | Create | Endpoint 2, with organisation **and** workplace scoping applied by joining the template — the same shape as the photo download fetcher |
| `api/src/VehicleService/Inspections/UI/HTTP/Template/DetachTemplateReferenceFileController.php` + command/handler | Create | **Endpoint 2a — this is `S11-N3`**, and it is the only mechanism for it. Clears the draft field's pointer; the stored row and the object are untouched (`S11-E2`, NFR-007). Without this task the requirement is designed and unbuildable, and a file once attached could never be removed — permanently, since nothing deletes files by design |
| `api/src/VehicleService/Inspections/Application/Service/Instance/InspectionStoragePathBuilder.php` | Modify | Add the template reference-file path |

#### Frontend changes (`app/`)
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/inspections/builder/fields/FieldCanvasRow.vue` | Modify | **`S11-R5` — show the attached file on the field's row on the canvas**, so an author scanning a template sees which questions carry a reference without opening each one |
| `app/src/components/ts/inspections/builder/fields/ReferenceFileControl.vue` | Create | Authoring upload: the accepted types and the size limit are stated **before** the upload (`S11-R3`), the control reads "Attach File" on every field type (`S11-R6`), a filename chip with open and remove, an **unusually long file name shortened rather than breaking the layout** (`S11-E3`), and disabled with an explanation while the template has no server id yet |
| `app/src/components/ts/shared/FileViewer.vue` | Create | Genuinely shared: image, PDF, and a **download-only** state for anything it cannot render, which says so rather than opening blank or silently downloading (`S11-R9`) |
| `app/src/components/ts/inspections/filler/fields/ReferenceFileChip.vue` · `useReferenceFile.ts` | Create | The technician-facing chip, and the blob plus object-URL lifecycle |
| `app/src/api/inspections/keys.ts` · `queries.ts` | Create | The **only** TanStack Query use in this plan — a reference file is immutable server state, so it caches with an infinite stale time. Copy the key-factory shape the other domains already use |
| `app/src/api/inspections/index.ts` | Modify | `uploadReferenceFile`, `deleteReferenceFile`; reuse the existing blob getter for reads rather than adding a near-duplicate |
| `app/src/components/ts/inspections/filler/fields/InspectionFieldCard.vue` | Modify | The chip in the card header, opening the viewer in a maximized dialog |
| `app/src/components/ts/inspections/builder/fields/FieldInspector.vue` | Modify | **Mount `ReferenceFileControl` for every field type.** Without this the control is created and never rendered, and `S11-R1`, `S11-R3`, `S11-R6` and `S8-R8` have no reachable surface — the whole authoring half of S11 would be unbuildable from the builder. `S11-R6` also fixes the label as "Attach File" on every type, so it belongs in the shared inspector rather than per-type |

**A side effect to document:** uploading to a template whose lineage is active must fork a draft first, because uploads target draft fields. The author will see a pending draft appear. That is correct but surprising, so it belongs in the copy.

#### Unit / integration tests
- Backend unit: the policy accepts each listed type and rejects video; the HEIC extension fallback; the size limit reads the injected parameter; the handler rolls back cleanly when the stream write fails, leaving **no** recorded attachment (`S11-E1`).
- Backend functional: upload, then save the draft, and the file is still attached (this is the regression the field key exists to prevent); publish, edit, and the v2 field reports the **same** file id (`S11-R8`); a download from another workplace returns 404 (`S11-N2`, NFR-004).
- Frontend: the viewer's three branches; the chip; a query test with the shared client wrapper.

#### Verification
Static, migration and smoke gates. Browser-walk: attach a PDF to a field as `admin`, save the draft, reload, confirm it is still attached; open it as the `tech` user from the fill screen and confirm it renders in-tab with close and download; attach an XLSX and confirm the download-only state appears rather than a blank frame.

---

### Phase 4: Per-axle authoring
**Implements:** `S8-R1`–`R9`, `S8-R28`, `S12-R8`–`R10`, `S12-R18`, `S12-R24`, `S12-R29`, `S12-R30`, `S8-R4`, `S8-R5`
**Depends on:** Phases 1 and 2

#### Backend changes (`api/`)
| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/Inspections/Domain/Template/MeasurementRowScope.php` · `PerAxleMeasurementRow.php` · `PerAxleFieldConfig.php` | Create | Always-valid value objects. The config holds one to twelve rows with unique ids and an axle-count default of two to five, and exposes `defaults()` returning the four named rows |
| `api/src/VehicleService/Inspections/Application/Handler/Template/SaveDraftCommandHandler.php` | Modify | Whitelist the per-axle config. **When `rows` is absent entirely, apply the defaults** — so a new field arrives pre-filled server-side as well as in the builder |
| `api/src/VehicleService/Inspections/Domain/Template/FieldConfig.php` | Modify | Add `perAxle()` and `perAxleConfig()` |

There is **no backend unit whitelist** for measurement units, and none is to be added: the backend accepts any non-empty string today and live templates may hold anything. The unit list and its ordering (`S8-R28`) are purely a frontend concern.

#### Frontend changes (`app/`)
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/inspections/builder/fields/PerAxleInspector.vue` | Create | The properties panel, **in the order `S12-R29` specifies**: the measurement rows first under the heading "Measurement rows · every axle", then the axles control, then the control that adds a row — so the panel reads top to bottom as *what every axle is measured on*, then *how many axles to start with*. Rows carry a label, a unit and the tire-versus-brake scope, with add, inline rename confirmed by a check and dismissed by an X, drag reorder (`DFR-010`), and delete with the last row protected (`S8-R7`) |
| `app/src/components/ts/inspections/builder/fields/PerAxleInspector.vue` (scope control) · `filler/fields/PerAxleFieldMobile.vue` | Modify | **[SV-9885] One vocabulary for the row scope — "1 per side" and "Outer + inner" — on every surface, phone included** (`S8-R4`, `S8-R5`). The PRD makes this a Key Decision: the phone drew different words for the same control, and two names for one thing is worse than either name. The phone half lands with Phase 5 |
| `app/src/components/ts/inspections/builder/fields/AxlesControl.vue` | Create | The axle-count control: **default 3, range 2–5** (`S12-R29`), an out-of-range value dropping back to the default rather than being rejected (`S12-R30`), explained on demand rather than in permanent text |
| `app/src/components/ts/inspections/builder/fields/FieldInspector.vue` · `builder/fields/Model.ts` · `builder/validation.ts` | Modify | Register the inspector; the per-axle default config; publishing blocked when a measurement row has an empty label, with the error **on the row** (`S12-R13`). Note the validation file sits at `builder/validation.ts`, not under `builder/fields/` |
| `app/src/components/ts/inspections/builder/fields/FieldCanvasRow.vue` | Modify | The canvas row lists the measurement rows and notes that the technician adds axles while filling — `S12-R18` keeps this deliberately, and it is not the descriptor `S12-N3` forbids, because `S12-N3` governs only what the **technician** sees |

#### Unit / integration tests
Defaults applied when rows are absent; the row-id, scope and axle-range validators; the twelve-row cap; and a **regression guard** — the report data fetcher must render a per-axle field as "no status" without crashing, since Phase 4 can ship before filling exists.

#### Verification
Static and smoke gates; compile gate. Browser-walk: add a per-axle field as `admin`, confirm it arrives named and pre-filled with the four rows, rename a row inline, reorder by dragging, change a unit, set the axle count, publish.

---

### Phase 5: Per-axle filling — the largest phase
**Implements:** `S8-R10`–`R25`, `S8-R27`, `S8-N1`–`N3`, `S8-E1`–`E7`, `S14-R1`–`R3`, `S14-E1`, `S14-E2`, `DFR-001`–`DFR-009`, NFR-008. (`S8-R26` — a flagged row producing its own *finding* — is deferred with the hand-off that consumes findings; the roll-up this phase builds is what it will read.)
**Depends on:** Phase 4
**Matched pair:** the backend contract is a hard predecessor — the response validator rejects an unknown value shape outright, so the frontend is stub-only until it lands

#### Database changes
| Migration | Description |
|---|---|
| `api/migrations/Version<ts>.php` | §4.3 — `inspection_axle`, with its unique index and cascade foreign key |

#### Backend changes (`api/`)
| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/Inspections/Domain/Instance/Verdict.php` | Create | The enum plus `severity()`, `isFlagged()`, and **`worstOf(iterable<?Verdict>): ?Verdict`** returning null when every input is null. This one function is the roll-up for rows, axles, fields, sections, the report counters and the outstanding resolver — there is exactly one implementation |
| `api/src/VehicleService/Inspections/Domain/Instance/TirePosition.php` | Create | The position enum plus `forRow(scope, tireConfiguration)`: per-tire on a dual axle gives four positions in reading order, per-tire on a single axle two, per-side always two |
| `api/src/VehicleService/Inspections/Domain/Instance/AxleTireConfiguration.php` · `AxleBrakeType.php` · `InspectionAxle.php` | Create | The axle entity and its two enums |
| `api/src/VehicleService/Inspections/Domain/Instance/PositionKey.php` · `RowKey.php` | Create | `PositionKey` parses and validates the four-segment key; `RowKey` does the same for `rowUnits`' three-segment form. Both reject an unknown row, an unknown axle, or a field id that does not match the response they sit in |
| `api/src/VehicleService/Inspections/Domain/Instance/PerAxleAnswer.php` | Create | The value object over the JSON: reads and writes positions **and row units**, prunes **both** an axle's positions and its row-unit entries on removal (an orphaned unit key would fail the value's own axle-exists check with no way for a user to clear it), derives row, axle and field verdicts through `Verdict::worstOf`, lists flagged position keys, resolves a row's effective unit as *the stored override, else the template's*, and **refuses to store an entry carrying neither a value nor a verdict** — which is how "not inspected is absence" becomes structural rather than conventional |
| `api/src/VehicleService/Inspections/Domain/Instance/ResponseValue.php` | Modify | The per-axle branch: `positions` required, `rowUnits` optional, **nothing else accepted**. This needs a **new allow-list check, not `assertExactKeys`** — that helper asserts exact cardinality *and* exact presence, so every key it is given is mandatory and it cannot express an optional one. Reusing it would reject either the plain payload or the unit-bearing one. Also `verdictOf(FieldType, ?array)` as the single verdict reader |
| `api/src/VehicleService/Inspections/Domain/Instance/Inspection.php` | Modify | `axles()`, and `configureAxles()` reconciling by id — keep, add, remove — pruning both the positions **and the row units** of a removed axle from every per-axle response |
| `api/src/VehicleService/Inspections/UI/HTTP/Instance/ConfigureInspectionAxlesController.php` + DTO/command/handler | Create | Endpoint 4, with the same four preconditions the existing response-save handler applies |
| `api/src/VehicleService/Inspections/Infrastructure/.../DbalInspectionFetcher.php` · `DbalInspectionReportDataFetcher.php` · `DbalInspectionListFetcher.php` | Modify | Load axles; replace the fetcher's private status reader with `ResponseValue::verdictOf`. **The KPI counter needs more than that**: it currently counts one per field, and `S8-R25`/`S5-R20` require **one count per axle**, each carrying that axle's worst verdict. This is the one point the PRD's own change log records as contested and resolved, so getting the unit wrong reintroduces the contradiction it settled. **Two further counting surfaces must agree with it**, because `S8-R25` promises the same numbers on all of them: the report template's own per-section counters, which also increment once per field, and the work-order inspections list, whose read model carries only answered-versus-total field counts and no verdict counts at all — so that list needs the counts added before it can be consistent rather than merely not wrong. **The list fetcher is a 500 risk:** its answered-field counter calls `FieldType::from` and the answered check, so both must know the new types before any V2 template exists, or the work-order inspections list breaks |
| `api/templates/inspections/report.html.twig` + its value helper | Modify | **Render the per-axle field's values per position with the row's derived verdict** — this is the second half of `S8-R24` and it cannot be deferred. The report's field read model currently carries a single status and a single display value per field, so **it has to grow a per-position structure first**; the template cannot render rows and positions from what it is handed today. Completion *is* report generation, so **every** completed per-axle inspection emits a PDF; leaving the field on the default branch prints it as a bare label with a "No status" badge and no readings, which is a wrong document reaching a customer rather than a missing nicety. Keep it plain — a rows-by-positions table with a status column, no restyling. `S13-R0`'s full report treatment and the mono-print work (NFR-016) stay in the second plan |
| `api/src/VehicleService/Inspections/Application/DTO/Instance/InspectionDetailDto.php` | Modify | `axles`, the computed verdict per response, the per-axle roll-up, and each row's **effective unit per axle** — without which a unit the technician changed never comes back on reload |

#### Frontend changes (`app/`)
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/inspections/filler/fields/perAxle.ts` | Create | Pure, Vue-free helpers: the position list for a row, both key forms, **one `rollup()` pass** returning row, axle and field verdicts together, add and remove axle (pruning that axle's units as well as its positions), the row-unit override and its resolution against the template default, the Single/Dual switch, and alternate restoration. Unit-tested in isolation |
| `app/src/components/ts/inspections/filler/fields/PerAxlePositionInput.vue` | Create | The value control — an input plus a 38px verdict marker opening the four-option menu. **Unchanged by design**: the design defers reworking it deliberately, and changing it would invalidate the interactive prototypes and every measurement in the handoff |
| `app/src/components/ts/inspections/filler/fields/PerAxleField.vue` | Create | The desktop grid, the axle header with its derived verdict and the Single/Dual and Drum/Disc controls, add-axle, **a per-row unit selector on each axle** (`S8-R27`), and the top view docked beside it |
| `app/src/components/ts/inspections/filler/fields/AxleTopView.vue` | Create | The truck diagram: one tyre per position tinted by the **worst** verdict of the rows measuring it, grey until judged, and selecting one moves to that axle, row and position (`S8-R18`, `S8-R19`) |
| `app/src/components/ts/inspections/filler/fields/PerAxleFieldMobile.vue` | Create | One card per measurement row, never scrolling sideways at any width (`S8-R23`, `S14-R1`). Also `S14-R4` — moving between axles happens from a header rather than by scrolling, and the primary action advances to the next axle — and `S14-R8`/`S14-N2`: draw no back control where the device provides one, and place nothing where the device's own navigation overlaps it |
| `app/src/components/ts/inspections/filler/fields/PerAxleField.vue` (axle header) | Modify | `S8-R20` — **the first axle can never be deleted**, and carries instead a clear action that empties its readings and verdicts and leaves the axle in place. `S8-R21` — any later axle can be deleted, with the ones below moving up and the numbering following. `S8-R22` — axles expand one at a time or all at once, and opening one never collapses another |
| `app/src/components/ts/inspections/composables/useInspection.ts` | Modify | `setPositionValue`, `setRowUnit` (`S8-R27` — one row across the whole axle, leaving other rows and other axles alone, and **never converting** the readings already entered, `S8-E7`), `setAxles`, and the **session-only** alternate store for Single/Dual — not in the dirty set, not in the payload, reset on hydrate, so leaving the page discards it by construction (`S8-E6`, `DFR-009`) |
| `app/src/components/ts/inspections/filler/fields/InspectionFieldCard.vue` · `Model.ts` | Modify | Render the per-axle field by layout; the answered check for per-axle; the collapsed summary |
| `app/src/components/ts/inspections/completion/CompletedFieldCard.vue` | Modify | Mount the same grid disabled — **do not build a second read-only renderer** |
| `app/src/components/ts/inspections/filler/DesktopFiller.vue` | Modify | The keyboard resolver must check a focused **position** before falling back to the field, or the verdict shortcuts hit the wrong target |

#### Key logic
```
// api/src/VehicleService/Inspections/Domain/Instance/Verdict.php
// The single roll-up. All-null in means null out — that is "not inspected", not "OK".
public static function worstOf(iterable $verdicts): ?self
{
    $worst = null;
    foreach ($verdicts as $v) {
        if ($v === null) { continue; }
        if ($worst === null || $v->severity() > $worst->severity()) { $worst = $v; }
    }
    return $worst;   // fail > monitor > pass > na; null when nothing was judged
}
```

#### Unit / integration tests
- Backend: the roll-up truth table including all-null to null and N/A-only staying N/A; the position matrix for every scope and configuration; key parsing and rejection; the answer object never storing an empty entry and never emitting N/A; axle removal pruning positions; validation rejecting an unknown row, unknown axle, or foreign field id; and the report fetcher's functional test extended with a per-axle field so the counters come from the roll-up.
- Frontend: the roll-up worst-first, the alternate store discarded on hydrate, the top view's grey-until-judged state, and a **profiler check at seven axles by four rows** — 112 position controls is the real cost in this phase, and the plan is to measure before optimising rather than virtualising up front.

#### Verification
All five gates. Browser-walk as `tech`: fill a per-axle field, set verdicts per position, switch an axle Single↔Dual and confirm the readings survive, switch back and confirm they return, add and delete an axle, confirm the top view tints correctly and selecting a tyre jumps to its input, then reload the page and confirm the alternate readings are gone while saved values remain.

---

### Phase 6: The note rule, and the outstanding-items list
**Implements:** `S1-R3`–`R7`, `S1-N1`, `S1-N2`, `S1-E1`–`E7`, `S17-R3`–`R6`, `S17-R8`, **`S17-R9`**, `S17-E1`–`E5`, **`S17-E6`**, `S14-R6`, `S14-R7`, `DFR-015` (and it **supersedes `DFR-011`**)
**Depends on:** Phase 5 (a per-axle field's note rule triggers off flagged positions)

#### Backend changes (`api/`)
| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/Inspections/Domain/Instance/InspectionPhotoMimeTypes.php` · `…/Handler/Instance/UploadInspectionPhotosCommandHandler.php` | Modify | **`S17-R9` — accept HEIC for inspection photographs**, alongside JPEG and PNG. Product added this on 2026-09-16: a phone camera must not be able to make `S17-R3`'s submit blocker unsatisfiable. Reuse Phase 3's HEIC handling including the extension fallback for a generic-binary sniff. The photo accept list stays a **separate class** from the reference-file policy — the two lists differ and must not be collapsed. **`S17-E4`** keeps its own case: upload unavailable to the shop is told as a reason, not a silent block |
| `api/src/VehicleService/Inspections/Infrastructure/.../DbalInspectionReportDataFetcher.php` · `api/templates/inspections/report.html.twig` | Modify | **The consequence of accepting HEIC, and it lands in this plan.** The report fetcher embeds every photo as a `data:` URI using its stored MIME type, so an accepted HEIC photo reaches the **customer PDF** as `data:image/heic`, which the renderer cannot draw. Since completion *is* report generation, that document ships on every completed inspection carrying one. Until server-side conversion lands (`S11-R9`'s separate ticket), print a placeholder naming the format rather than a broken image. **Product agreed to this on 2026-09-16**, so it is settled rather than assumed |
| `api/src/VehicleService/Inspections/Domain/Instance/OutstandingItem.php` · `InspectionOutstandingResolver.php` | Create | The stateless resolver that becomes the single truth for the submit gate, the preflight endpoint and the fill screen badge — §5.4 |
| `api/src/VehicleService/Inspections/Application/Handler/Instance/SubmitInspectionCommandHandler.php` | Modify | The field-level checks move out to the resolver; the handler keeps its preconditions, the resolver call, and the signature check |
| `api/src/VehicleService/Inspections/UI/HTTP/Instance/GetInspectionOutstandingController.php` + query/handler | Create | Endpoint 7 — the navigable list |

#### Frontend changes (`app/`)
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/inspections/filler/DesktopOutstandingList.vue` | Create | **The surface with no design.** Grouped by section; a row per outstanding item naming its reason; selecting one moves to the **first field that still needs an answer** rather than to a summary (`S14-R7`), and for a note reason it opens the note editor on arrival |
| `app/src/components/ts/inspections/filler/fields/Model.ts` | Modify | The note-unmet predicate; a `note` reason in the outstanding item type — **keep the existing test id on the row and add a reason attribute**, because renaming it is E2E reference breakage, which is mandatory and uncapped to fix under the coverage policy |
| `app/src/components/ts/inspections/filler/fields/InspectionFieldCard.vue` | Modify | Add Photo sits in the **footer beside Add Note**, and the photo target opens on its own the moment a response makes a photo required (`S17-R8`); the note editor opens with a required marker when the note rule is unmet |
| `app/src/components/ts/inspections/filler/MobileFiller.vue` · `MobileMissingList.vue` | Modify | The note reason on the phone list; the outstanding count rides the section-completing action. **Keep the existing swap between the count and the advance action** rather than badging the advance button — two phone specs assert the two are mutually exclusive |
| `app/src/components/ts/inspections/filler/fields/PhotoField.vue` · `filler/fields/InspectionFieldCard.vue` | Modify | **`S17-R9` / `S17-E6`, frontend half.** Both declare `accept="image/*"` today, which lets a HEIC file through the picker and then fails server-side — so `S17-E6`'s message belongs here, naming the accepted formats at the point of failure rather than surfacing a generic upload error |
| `app/src/components/ts/inspections/filler/fields/usePhotoThumbnails.ts` · `app/src/components/ts/shared/FileViewer.vue` | Modify | **`S17-R9`'s render half.** A browser cannot draw HEIC, so an accepted HEIC photo renders broken in the field card and the completed view unless routed to the download-only state `S11-R9` already defines — which is why `S17-R9` says "as `S11-R9` already does for reference files". Reuse Phase 3's viewer rather than adding a second |

#### Unit / integration tests
**For `S17-R9`/`S17-E6` first, because they span three layers:** the photo accept list admits HEIC and HEIF and still rejects video; the extension fallback fires when the sniffed type is generic binary (without it every iPhone upload fails — the same trap Phase 3 guards); a rejected format yields a message naming the accepted formats rather than a generic error; an accepted HEIC photo routes to the download-only viewer state rather than rendering broken; and the report emits a placeholder rather than an undrawable `data:image/heic`. Then, for the note rule: every existing submit scenario re-expressed against the resolver, with the scenarios kept and the note cases added: flagged with a blank note produces an item carrying the flagged position keys; flagged with a note produces none; a passing response with a blank note produces none; a note of only spaces counts as empty (`S1-E1`); a note written then the response changed to OK keeps the note (`S1-E4`); the conditional photo rule is ignored on a non-checkbox field (`S17-R6`); a legacy row with both photo flags on behaves as the unconditional rule. Functional: the preflight payload is navigable, and submit's 400 carries the count.

#### Verification
All five gates. Browser-walk as `tech`: mark a checkbox Monitor with no note and confirm submit is blocked, the field appears in the outstanding list, and selecting it lands on the field with the note editor open; add the note and confirm submit proceeds. Repeat on a per-axle field by flagging a single tyre. Then for `S17-R9`: upload a **HEIC** photo to a Not OK checkbox, confirm it is accepted, that it renders as a download-only card rather than a broken image anywhere it appears, that submit unblocks, and that the generated PDF shows a placeholder rather than an empty frame. Offer an unsupported format and confirm the message names what is accepted.

---

### Phase 7: Bulk Mark OK, and Undo
**Implements:** `S18-R1`–`R11`, `S18-N1`, `S18-N2`, `S18-E1`, `S18-E2`, `DFR-014`, NFR-009
**Depends on:** Phase 5

#### Database changes
| Migration | Description |
|---|---|
| `api/migrations/Version<ts>.php` | §4.5 — `inspection.bulk_ok_ledger` |

#### Backend changes (`api/`)
| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/Inspections/Domain/Instance/BulkOkLedger.php` | Create | The last batch only |
| `api/src/VehicleService/Inspections/Domain/Instance/Inspection.php` | Modify | `markOk(fieldsInScope, batchId, now)` — sets OK **only** on positions and fields carrying no verdict, keeps any amount, never writes N/A, never touches a verdict already picked; `undoMarkOk(batchId, now)` reverting only stamps still reading OK; and ledger invalidation from every other mutation, which is what makes "clears on the next edit" structural |
| `api/src/VehicleService/Inspections/UI/HTTP/Instance/MarkInspectionOkController.php` · `UndoMarkInspectionOkController.php` + commands/handlers | Create | Endpoints 5 and 6 — **one transaction each**. An empty scope is a 400. A stale undo is a **409** |

#### Frontend changes (`app/`)
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/inspections/filler/markOk.ts` | Create | The pure planner: what a given scope would stamp, and the counts per level |
| `app/src/components/ts/inspections/filler/fields/MarkOkButton.vue` | Create | `S18-R10` — each level **explains its scope on demand**: what it covers, what it leaves alone, and that values are never filled in. One component for all three levels — same wording, same treatment, the level read from the row it sits on. The after-state replaces the action in place with a check and a count **in that level's own unit** — fields at inspection and section level, positions at field level — and an inert state when nothing is left to mark (`DFR-014`) |
| `app/src/components/ts/inspections/composables/useInspection.ts` | Modify | `markOk` and `undoMarkOk`. **Undo is exact**: keep the previous value reference and whether the field was already dirty, and restore through a private path that does not re-stamp dirty, so the payload after an undo is byte-identical to before |
| `app/src/components/ts/inspections/filler/DesktopFiller.vue` · `MobileFiller.vue` | Modify | The three affordances. On the phone they take three surfaces — the section header, the field sub-header, and the app-bar menu — and the footer stays section navigation and gains nothing (`S18-R11`) |

**Undo is inline only.** No toast: `S18-R6` puts Undo on the row that was pressed, and a notification would be exactly the explanatory furniture the PRD's standing rule rules out.

#### Unit / integration tests
Stamps only verdict-less positions across rows, axles and positions; keeps existing verdicts and amounts untouched; never writes N/A; stamps a per-axle field's unmeasured positions (the PRD decision) while never inventing an amount; section and field scope filtering; an empty scope returns 400; undo reverts only the stamps still reading OK; undo after an unrelated edit returns 409; one request produces one transaction. Frontend: undo restores the value **and** the dirty flag exactly; the next edit anywhere clears the report; the inert state renders rather than disappearing.

#### Verification
All five gates. Browser-walk as `tech`: press Mark all OK on a multi-section inspection, confirm the count reads in fields at inspection level and positions at field level, confirm every level beneath shows its own count, press Undo and confirm the inspection returns exactly to its prior state, then press again and make one edit and confirm the report clears and the actions return.

---

### Phase 8: Preview mode
**Implements:** `S12-R25`, `S12-R31`, `S12-R32`, `S12-R33`, `S12-E4`, `S18-N2`
**Depends on:** Phases 4, 5 and 7 — it mounts all of them
**Frontend only**

| File | Action | Description |
|---|---|---|
| `app/src/components/ts/inspections/composables/useBuilderPreview.ts` | Create | Returns the fill screen's own interface, built from the **draft** including unsaved edits, with every write method overridden by a typed no-op — so a write method added later is a **compile error** until it is stubbed here |
| `app/src/components/ts/inspections/builder/InspectionBuilderPreview.vue` | Create | Mounts the real filler. Input is intercepted in the **capture phase** at the host rather than drilling an inert prop through a dozen components — one place that a new field type cannot forget. Elements marked as pass-through are exempt, which is how add-axle and the Single/Dual chips keep working. Selecting a field returns to Edit with that field selected |
| `app/src/components/ts/inspections/builder/InspectionTemplateBuilder.vue` · `InspectionBuilderMobile.vue` | Modify | The Edit/Preview control; the properties panel steps aside and the canvas takes its width; the sections rail stays; **no banner and no submit bar** |

**The axle control is the one deliberate leak.** Adding or deleting an axle in Preview must edit the **draft config**, not a response, so the host provides a callback the per-axle field routes to when present. Document why in the code.

**Recorded so they are not re-proposed:** a dialog (drawn and dropped), inline inside the properties panel (tried, fails on width — the axle grid needs ~800px and the panel is ~360), a second renderer or mock (a preview that can drift from the thing it previews is worse than none, because it will be trusted), and a separate preview route or embedded frame (both need a saved draft and so cannot show unsaved edits).

**Tests:** a scripted interaction across the whole preview asserts **zero network requests**; selecting a field lands in Edit with it selected; add-axle mutates the draft; no submit bar is rendered; bulk Mark OK is present but inert (`S18-N2`).

**Verification:** compile gate; browser-walk as `admin`: edit a per-axle field, switch to Preview without saving and confirm the unsaved edit is visible, type into a value and confirm nothing persists, add an axle, return to Edit by clicking a field, and confirm no banner appeared.

---

### Phase 9: Starter templates
**Implements:** `S12-R1`–`R5`, `S12-R7`, `S12-R19`, `S12-R27`, `S12-R28`, `S12-N1`
**Depends on:** Phase 4 (the starters use per-axle fields, per `S12-R27`)

| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/Inspections/Domain/Template/StarterTemplateCatalog.php` | Create | The five starters as pure definitions. **The checklist content is a Product input** — carry slugs and placeholders; do not invent inspection items. Where the same thing is measured on every wheel position they use **one per-axle field** (`S12-R27`); the DOT form keeps its own structure because an inspector signs against its stated items |
| `api/src/VehicleService/Inspections/Application/Service/Template/StarterTemplateSeeder.php` | Create | Seeds for the current organisation and workplace, idempotent by name, publishing what it creates so the starters are immediately attachable |
| `api/src/VehicleService/Inspections/UI/HTTP/Template/SeedStarterTemplatesController.php` + command/handler | Create | Endpoint 3 |
| `api/src/VehicleService/Inspections/UI/CLI/SeedStarterTemplatesCommand.php` | Create | Backfill for existing tenants: enumerate organisations holding the flag, then run the seeder per workplace under the sanctioned decorator shape. Per repo convention the command itself is not unit-tested; the seeder is |
| `app/src/components/ts/inspections/builder/StarterLibrary.vue` · `starterPresets.ts` | Create | The empty first screen: the two starting points of `S12-R1` — **start from a template, or build from scratch** — where the template side is six slots, five carrying content and the sixth an unpickable pending placeholder, each card an icon and a name with no second line. The build-from-scratch path is not optional garnish: it is what the existing builder specs will use once this screen gates the builder, and the design draws it as its own set of field-type cards. **The empty state is one section with zero fields, not zero sections** — the builder always seeds a first section, so keying on an empty section list would never fire |
| `app/src/components/ts/inspections/builder/InspectionTemplateBuilder.vue` | Modify | Show the library only on a new unsaved template; applying a preset pushes many fields and re-initialises the drag handling **once after the batch**, not per field |

**Tests:** the seeder is idempotent and publishes; every catalog entry satisfies the publish invariants; a second run reports the skipped slugs rather than duplicating.

**Verification:** static, migration-free, smoke gates. Browser-walk as `admin`: create a new template and confirm only the starting-point choice appears — no section heading, no field count, no add-section control (`S12-R1`); pick a starter and confirm the full builder appears with its content; confirm the sixth slot is not pickable; confirm a starting point is not offered on a second section (`S12-R7`, `S12-N1`).

---

## 7. Testing Strategy

### 7.1 Backend unit tests (`api/tests/Unit/VehicleService/Inspections/`)

The highest-value targets are the value objects, because this plan pushes correctness into them deliberately so that the invariants hold by construction rather than by convention:

- **`Verdict::worstOf`** — the full truth table, and specifically that all-null in gives null out. Getting this wrong makes an untouched inspection read as passing, which is the worst available failure in this feature.
- **`PerAxleAnswer`** — never stores an entry with neither amount nor verdict; never emits N/A; prunes a removed axle's positions; derives row, axle and field verdicts through the one roll-up.
- **`TirePosition::forRow`** — the scope-by-configuration matrix, including that a per-side row is two values regardless of Single or Dual.
- **`PositionKey`** — parses the four segments and rejects an unknown row, an unknown axle, and a field id that does not match its own response.
- **`PerAxleFieldConfig`** — the row cap, unique row ids, the axle range, and that an out-of-range count falls back to the default rather than erroring.
- **`Field`'s constructor invariants** — photo-rule precedence and the note flag on verdict-bearing types only.
- **`TemplateReferenceFilePolicy`** — every accepted type, video rejected, the HEIC extension fallback, and the injected size limit.
- **`Inspection::markOk` / `undoMarkOk`** — the full matrix in Phase 7's test list.
- **`InspectionOutstandingResolver`** — every existing submit scenario plus the note cases.

### 7.2 Backend functional tests (`api/tests/Functional/VehicleService/Inspections/`)

- **The field-key regression** — upload a reference file, save the draft, and the file is still attached. This is the single test that protects the whole identity design; without it the next refactor of the draft rebuild silently detaches attachments.
- **Cross-version file sharing** — publish, edit, and the cloned field reports the same file id.
- **Tenant isolation** — a reference-file download from another workplace returns 404 (NFR-004).
- **The report data fetcher** extended with a per-axle field, so the counters come from the roll-up rather than from a private status reader.
- **The work-order inspections list** with a V2 template present — this is the 500 risk the list fetcher's answered-field counter creates.
- **Bulk Mark OK in one transaction**, asserted by a single updated timestamp.
- **The preflight endpoint's payload** being navigable, and submit's 400 carrying the count.

### 7.3 Frontend unit tests (`app/src/components/ts/inspections/**/tests/`)

- **`perAxle.ts`** in isolation, Vue-free: the roll-up, add and remove axle, the Single/Dual switch and alternate restoration.
- **`markOk.ts`** as a pure planner, and then `useInspection`'s exactness: undo restores the value **and** the dirty flag, and the next edit anywhere clears the report.
- **The alternate store discarded on hydrate** — the mechanism that makes "leaving the page loses them" true.
- **`FileViewer`'s three branches**, including that the download-only state says why rather than opening blank.
- **A profiler measurement at seven axles by four rows** — 112 position controls. Measure before optimising; virtualise only if the tablet is sluggish.
- **The registry's exhaustiveness** is enforced by the compiler rather than a test, which is the point of making it a `Record` over the union.

### 7.4 Manual testing checklist

Each phase's browser-walk in §6 is the checklist for that phase. Beyond those, three things need a human because no automated check will catch them:

1. **The verdict colour shift in Phase 1** — existing tiles move onto design-system values. Compare before and after against the design and get a designer's nod.
2. **Dark theme, per NFR-018** — confirm a judged position reads as a tinted surface and an unjudged one as neutral grey with a dashed border, never a tinted grey. This is how a technician reads what is left to do, so an inversion here is a functional bug.
3. **A gloved-thumb pass on a real phone** for the per-axle field, per `S14-R2` — every target including the unit selector and the Drum/Disc and Single/Dual controls. A viewport emulator cannot answer this.

### 7.5 E2E tests (`e2e/`)

Organised **by phase** rather than as nine scattered stubs, because the coverage policy's batch cap
applies per implementation run and each phase is its own run — so the per-run budget is the thing a
reader needs to see in one place.

**Eight new specs across nine runs, at most two per run — comfortably inside `batchCap = 5`.** Two
candidates go to a Backlog table.

**Deletions — two spec files, and they need your explicit confirmation before an implementer removes
them.** Phase 2 replaces the two text-inspector components with one merged inspector, which retires
their two unit specs along with them. Repo policy is that deletes are surfaced for confirmation
rather than assumed, so they are listed here and asked separately rather than folded into the batch.

An earlier revision of this section claimed a third deletion — that an existing unit test asserts
publishing is allowed with an empty **response** label, which `S12-R12` would remove. That was a
misread and is withdrawn: the two tests in question are about a field's **own** label on an
instructions field, publish validation never inspects response labels at all, and inverting those
assertions would block a state `S1-E6` and `S17-E5` explicitly require to keep working.

All new specs live under `e2e/tests/ui/inspections/`, which the `admin` project glob already
collects. **Role note:** builder specs run as `admin`, fill-screen specs as *admin with work-order
edit* — the same role the existing fill and complete specs use. The browser-walks in §6 say `tech`,
and that is right for a human at a keyboard, but the technician role needs staff-id fixtures that are
not available on a local stack, and technician reachability of the filler is already proven by the
132-test per-role matrix. Do not duplicate that matrix into every new spec.

| Run | New specs | Reference fixes (mandatory, uncapped) | PR block line |
|---|---|---|---|
| Phase 1 | — | none required | **override marker** — see below |
| Phase 2 | 1 · note toggle persists | **`TC-BLD-02` rewrite**; builder page-object chip type | 1 workflow |
| Phase 3 | 1 · reference file attach → save → view | factory: raw reference-file upload | 1 |
| Phase 4 | 1 · author a per-axle field | `TC-BLD-02` gains `perAxle`; factory type | 1 |
| Phase 5 | 2 · fill desktop, fill phone | factory: axles + per-axle response and row-unit builders | 2 + **override marker** (backlog) |
| Phase 6 | 1 · note gate + outstanding list | verify the two CTA ids; add a reason-aware page-object method | 1 + **override marker** (backlog) |
| Phase 7 | 1 · mark all OK → undo | factory: raw mark-ok and undo | 1 |
| Phase 8 | — | none | **override marker** — see below |
| Phase 9 | 1 · starting-point choice → publish | **seven builder specs** via a new-template helper | 1 |

#### The scenarios

**Note-required toggle persists** (happy path, Phase 2 — `S1-R1`, `S1-R2`, `S1-R6`, `S12-R14`; admin)
1. Open an API-seeded draft in the builder and select the checkbox field
2. Turn the note-required toggle on
3. Save draft, reload, reselect the field
- **Expected:** the toggle still reads on, and the template detail reports the flag set. Seed through the API and deep-link the builder so this spec is immune to the Phase 9 starter gate. Ranked lowest of the eight — if a run is squeezed, defer this one; the Phase 6 spec seeds the flag by API and does not depend on it.

**Reference file attach and view** (happy path, Phase 3 — `S11-R1`–`R3`, `S11-R8`, `DFR-012`; admin)
1. Open an API-seeded draft, select a field, upload a small PDF through the new control
2. Save draft, reload, reselect the field
3. Publish, attach an inspection to a work-order line, open the filler
4. Click the reference chip, then close the viewer
- **Expected:** the chip survives the save (this is **the `field_key` regression test**, observed through the real builder echo and the real carry-forward), the cloned version reports the same file, the viewer renders the PDF in-tab, and closing returns to the filler unchanged. Arm the file-chooser listener *before* the click.

**Per-axle field authoring** (happy path, Phase 4 — `S8-R1`, `S8-R2`, `S8-R4`, `S8-R5`, `S12-R8`–`R10`, `S12-R29`; admin)
1. Add field → Per axle
2. Rename a row inline and confirm with the check; change its unit; switch its scope
3. Set the axle count; publish
- **Expected:** the inspector opens with **four pre-filled rows**, and the published config matches what was authored when read back through the API.

**Per-axle fill, desktop** (happy path, Phase 5 — `S8-R10`–`R17`, `DFR-001` observed through the roll-up; admin with WO edit)
1. Open the filler and expand the per-axle field
2. Enter an amount and pick OK on one position; pick Not OK on another
3. Switch an axle Single → Dual and enter an outer reading
4. Add an axle; Save & exit; reopen
- **Expected:** the axle header derives the **worst** verdict of its positions, and every amount, verdict, axle configuration and added axle is restored after reload. Do **not** attempt the seven-axle profiler case — that is a development measurement, not a test.

**Per-axle fill, phone** (happy path, Phase 5 — `S8-R23`, `S14-R1`–`R3`; admin with WO edit, phone viewport)
1. Focus the per-axle item under the phone viewport
2. Enter an amount and pick a verdict on one position
3. Leave via back, save at the guard, reopen
- **Expected:** one card per measurement row, no horizontal scroll, and the value restored. It earns its own spec rather than being a viewport variation because the phone renders a **different component**.

**Note-required submit gate** (happy path plus the one UI-distinct gate, Phase 6 — `S1-R3`–`R5`, `S1-R7`, `S14-R6`, `S14-R7`, `DFR-015`; admin with WO edit)
1. Mark a note-ruled checkbox Monitor with no note
2. Open the outstanding list; select the row for that field
3. Type a note; submit
- **Expected:** submit is replaced by the outstanding count; the row names its reason; selecting it lands on the field **with the note editor open**; adding the note restores submit and the inspection completes. A field carrying both a photo and a note reason renders two rows sharing one id, so the page object needs a reason-aware selector.

**Bulk Mark OK and Undo** (happy path, Phase 7 — `S18-R1`–`R8`, NFR-009 observed as a single request; admin with WO edit)
1. Hand-set one checkbox to Not OK first
2. Press Mark all OK at inspection level
3. Reload; press Undo; reload again
- **Expected:** counts read in **fields** at inspection and section level and in **positions** at field level, every level beneath shows its own count, the hand-set Not OK is untouched, and Undo returns the inspection exactly to its prior state — both states surviving a reload, because Mark OK persists server-side by design.

**Starter library on a new template** (happy path, Phase 9 — `S12-R1`–`R5`, `S12-R27`; admin)
1. Templates → New Template
2. Pick a starter
3. Publish
- **Expected:** the first screen shows **only** the starting-point choice — no section heading, no field count, no add-section control — and the chosen starter publishes with its structure intact. This asserts the library UI and the publish round-trip, not that the organisation holds seeded rows.

#### Backlog (deferred, recorded so they are not lost)
| Workflow | Why deferred |
|---|---|
| The note rule on a per-axle field — flag one tyre, confirm the outstanding item carries the position | A value variation of the Phase 6 happy path on a different field type. The flagged-position highlight is a frontend unit concern and the resolver's flagged keys are a backend unit concern |
| The completed view rendering a per-axle field as the same grid, disabled | The completed card mounts the *same* grid, so the Phase 5 spec already exercises the renderer against the same response shape. Low marginal value |

#### What is deliberately **not** E2E
Many of this plan's requirements are invariants, not journeys, and promising Playwright coverage for
them would be dishonest. Routed to their proper layer: the design invariants `DFR-001`–`DFR-009`
(backend unit — an absence-of-write is only provable at the aggregate); Preview writing nothing
(frontend unit, as a zero-network assertion — a spy on fetch catches any write, which no UI
assertion can); Undo restoring the dirty flag byte-identically (frontend unit, by payload
comparison); the file policy's accept list, size limit and HEIC fallback (backend unit); the
cross-workplace 404 and the one-request-one-transaction guarantee (backend functional); and the
verdict colour work of `NFR-017`/`NFR-018` (manual plus design review — it is visual).

Also not automated, as a value call rather than a gate failure: dragging measurement rows to reorder
(browser drag-and-drop is a flake source and the unit test observes the same thing), the top-view
tint and jump, the phone's no-sideways-scroll rule, the sixth starter slot being unpickable, and the
photo target auto-opening.

**One infrastructure limit worth stating:** `NFR-014` asks for flag-off to be a tested state, and the
E2E factory **cannot disable an organisation's feature flag**. That test therefore has to be backend
functional, not E2E — the same limitation already documented for an existing public-report case.

#### Block lines and skip reasons

**One constraint applies to more phases than it first appears.** A non-zero Backlog **fails** the
coverage check — deferred workflows count as incomplete coverage — so every phase whose block carries
a backlog row needs the override marker, not a plain count. The two backlog workflows attach to
**Phases 5 and 6**, so those two carry the marker alongside their new specs. Either that, or the
backlog items are promoted into their runs; the cap has room for both, and the reason they are
backlogged is value rather than budget.

- **Phase 1** needs the **override marker**, not `None — internal-refactor`. That pre-approved string
  means no template, route or store-shape change, and Phase 1 binds new props in three component
  templates and edits five more, so it does not qualify however honest the substance is. The substance
  *is* a no-behaviour-change phase — no workflow moves and no spec asserts colour, since selection is
  asserted through classes — which makes the marker's one-line reason true: "seam phase, no behaviour
  change; verdict-colour shift design-approved". Disregard the clause that follows, left by an earlier
  revision: no
  spec asserts colour. The caveat for a reviewer is that it does bind a new prop on the shared
  dialog and ships the deliberate verdict-colour shift — if that reads as too much for
  "internal-refactor", use the override marker instead with a one-line reason.
- **Phase 8** has no candidate that clears the bar for an E2E test, because every Preview assertion
  is observable with a mocked API. It therefore needs the **override marker**, not a free-text
  `None — …`, which CI rejects by design.

#### TestRail
Eight new cases. Builder-side cases belong in the templates and lifecycle section, fill-side cases in
the filling section — but the push script maps the whole new folder to the **builder** section only,
so without per-file entries the five fill-side cases would be minted into the wrong place. Add those
entries, and resolve section **ids** rather than names, because the names are duplicated under
another parent. Two existing cases are retitled rather than replaced. Nothing is deprecated.

---

## 8. Rollback Plan

Every phase sits behind the `DigitalInspections` organisation flag, so the first and cheapest rollback is always **turning the flag off for the affected organisations**, which withdraws every new surface at once without a deploy.

Beyond that, the phases differ in how reversible they are:

| Phase | Rollback |
|---|---|
| 1 (seams and identity) | Revert the code. **Leave the migration in place** — three nullable or defaulted columns are inert to the previous version, and rolling the backfill back would lose the keys that any attachments created since depend on. This is the only phase whose migration is worth keeping after a revert. |
| 2, 4, 8, 9 (builder, authoring, Preview, starters) | Pure code revert. No schema, no data. A template already authored with a per-axle field keeps its config JSON, which an older builder will not render — so revert the frontend and backend together, or leave the flag off for the organisations that used it. |
| 3 (reference files) | Revert the code; leave the table and the uploaded files. Orphaned rows are harmless because nothing deletes them by design, and re-applying the phase re-attaches them through the field key. |
| 5 (per-axle filling) | The risky one. Revert the code and leave `inspection_axle` and the answer JSON in place; both are additive and invisible to V1 code paths. **But** an inspection already filled with per-axle answers cannot be rendered by the previous version, so it must be reopened and its per-axle field left unanswered, or the flag must stay off for that organisation. Do not drop the table on a revert — that destroys technician work. |
| 6 (note rule) | Revert the code. Any field already saved with the note flag on keeps it; the previous version ignores the column, so those inspections simply stop enforcing the rule. Safe. |
| 7 (bulk Mark OK) | Revert the code and leave the ledger column. Verdicts already stamped are ordinary verdicts — `S2-R2`'s principle applies, a stamped OK is indistinguishable from a typed one — so nothing needs unwinding. |

**The one-way door** is Phase 1's `field_key` backfill, and it is one-way only in the sense that re-running it would mint different keys. Nothing else in this plan destroys or transforms existing data.

---

## 9. Security Considerations

| Concern | How it is addressed |
|---|---|
| **Tenant isolation on the new read paths** | Neither the reference-file row nor the axle row carries a tenant column. Every read joins its aggregate root and applies **both** `organization_id` and `workplace_id`, copying the existing photo-download fetcher rather than inventing a pattern. NFR-005. The functional test for a cross-workplace 404 is not optional. |
| **Server-side enforcement of every withheld action** | NFR-004, from `S2-R17`. Each new endpoint is gated by the existing access gates, which also apply the feature flag. A negative test per endpoint, per NFR-014 — flag off is a tested state, not an assumed one. |
| **The permission model cannot express what the PRD asks** | Recorded honestly rather than papered over: there is no "work order line create and edit" right at the enforcement level, that bundle resolves to the same underlying rights as "Work Orders — Create & Edit", and "Work Orders — View" also resolves the edit right by documented platform policy. Per D4, one new atom is added by migration and scoped to the new endpoints. **This lands in the second plan**, with the build flow it protects; the foundation endpoints are authored and filled under the existing template and work-order rights, which is the V1 status quo and not a regression. Flagged here so it is not mistaken for an oversight. |
| **File upload** | An allow-list of MIME types, not a deny-list; video rejected explicitly; the size limit enforced server-side from injected configuration rather than trusted from the client; the stored path derived from server-side identity, never from the uploaded filename. Files are written **inside** the transaction's try so a failed write leaves no recorded attachment — `S11-E1`'s stated goal is to avoid an attachment that points at nothing. |
| **HEIC sniffing** | The extension fallback exists because PHP may report `application/octet-stream` for HEIC. It widens what is accepted, so it must not become a general escape hatch: it applies only when the sniffed type is the generic binary one **and** the extension is HEIC or HEIF. |
| **Reference files are never deleted** | An accepted and documented cost (`S11-E2`, `S11-R8`, NFR-007): later template versions reference the same stored file, so deletion would break earlier published versions and the completed inspections beneath them. The consequence is unbounded storage growth, which the prod query in the appendix sizes. |
| **Strict value validation** | The per-axle branch permits `positions` and the optional `rowUnits`, and nothing else. A client that sends a computed roll-up alongside its answers is rejected loudly. This matters because the roll-up is authoritative on the server — accepting a client-supplied verdict would let a caller mark an inspection passed without answering it. |
| **Bulk operations are scoped server-side** | Mark OK resolves its own field set from the pinned version rather than accepting a list of positions from the client, so a caller cannot stamp fields outside the scope it named — or outside the inspection it addressed. |

---

## 10. Requirement Traceability

Requirement ids are the PRD's own (§1.1). Where a contiguous group lands wholly in one phase it is given as a range; where a story's requirements split across phases, each cluster has its own row. `E2E` rows are added in the E2E pass.

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| `S8-R1` (per-axle is its own type) | 1 | API | `api/…/Domain/Template/FieldType.php` | Planned |
| `S8-R1` (second clause — remove the measurement axle option) | — | — | **Gone from the PRD.** The planning pass reported that no axle option had ever existed; Product removed the clause on 2026-09-16, so there is no requirement here at all | N/A |
| `S8-R2`–`R9`, `S8-R28` (authoring rows, units, scope, axle default) | 4 | API | `api/…/Domain/Template/{PerAxleFieldConfig,PerAxleMeasurementRow,MeasurementRowScope}.php`, `…/Handler/Template/SaveDraftCommandHandler.php` | Planned |
| `S8-R2`–`R9`, `S8-R28` | 4 | App | `app/…/builder/fields/{PerAxleInspector,AxlesControl}.vue`, `builder/fields/Model.ts`, `builder/validation.ts` | Planned |
| `S8-R10`–`R22`, `S8-R27` (filling, verdicts, Single/Dual, diagram) | 5 | API | `api/…/Domain/Instance/{Verdict,TirePosition,PositionKey,PerAxleAnswer,InspectionAxle}.php`, `…/ResponseValue.php`, `…/Inspection.php` | Planned |
| `S8-R10`–`R22`, `S8-R27` | 5 | App | `app/…/filler/fields/{perAxle.ts,PerAxlePositionInput,PerAxleField,AxleTopView}.vue`, `composables/useInspection.ts` | Planned |
| `S8-R23` (two layouts, phone one card per row) | 5 | App | `app/…/filler/fields/PerAxleFieldMobile.vue` | Planned |
| `S8-R24` (completed view and report show per-position values) | 5 | API + App | `api/templates/inspections/report.html.twig` (values per position with the row's verdict — **both halves in this phase**) · `app/…/completion/CompletedFieldCard.vue` | Planned |
| `S8-R25` (counting per axle, one rule everywhere) | 5 | API | `api/…/Domain/Instance/Verdict.php` (`worstOf`) **and the report's KPI counter**, which today counts one per *field* — a three-axle field must contribute three counts, so swapping the status reader is not enough | Planned |
| `S8-R26` (a flagged row produces its own finding) | — | — | **Second plan** — a finding only exists once something consumes it (S15) | Deferred |
| `S8-N1`–`N3`, `S8-E1`–`E7` | 5 | API + App | as `S8-R10`–`R22` | Planned |
| `S1-R1`, `S1-R2`, `S1-R6` (the authoring option and its default — checkbox and per-axle only) | 1 (storage), 2 (UI) | API + App | `api/…/Domain/Template/Field.php` + migration · `app/…/builder/fields/FieldInspector.vue` | Planned |
| `S1-R3`–`R5`, `S1-R7`, `S1-N1`, `S1-N2`, `S1-E1`–`E7` (enforcement and the outstanding list) | 6 | API + App | `api/…/Domain/Instance/InspectionOutstandingResolver.php`, `…/Handler/Instance/SubmitInspectionCommandHandler.php` · `app/…/filler/DesktopOutstandingList.vue`, `filler/fields/Model.ts` | Planned |
| `S17-R1`, `S17-R2`, `S17-R7` (option, default, precedence) | 2 | API + App | `api/…/Domain/Template/Field.php` (constructor invariant) · `app/…/builder/fields/FieldInspector.vue` | Planned |
| `S17-R3`–`R6`, `S17-R8`, `S17-N1`–`N3`, `S17-E1`–`E5` | 6 | API + App | `api/…/Domain/Instance/InspectionOutstandingResolver.php` · `app/…/filler/fields/InspectionFieldCard.vue` | Planned |
| `S11-R1`–`R9`, `S11-N1`–`N3`, `S11-E1`–`E4` | 3 | API | `api/…/Domain/Template/{TemplateReferenceFile,TemplateReferenceFilePolicy}.php`, `…/UI/HTTP/Template/{Upload,Download}TemplateReferenceFileController.php`, `…/Service/Instance/InspectionStoragePathBuilder.php` + migration | Planned |
| `S11-R1`–`R9` | 3 | App | `app/…/builder/fields/ReferenceFileControl.vue`, `app/…/shared/FileViewer.vue`, `app/…/filler/fields/{ReferenceFileChip.vue,useReferenceFile.ts}`, `app/src/api/inspections/{keys,queries}.ts` | Planned |
| `S18-R1`–`R11`, `S18-N1`, `S18-E1`, `S18-E2` | 7 | API | `api/…/Domain/Instance/{BulkOkLedger.php,Inspection.php}`, `…/UI/HTTP/Instance/{MarkInspectionOk,UndoMarkInspectionOk}Controller.php` + migration | Planned |
| `S18-R1`–`R11` | 7 | App | `app/…/filler/markOk.ts`, `app/…/filler/fields/MarkOkButton.vue`, `composables/useInspection.ts`, both fillers | Planned |
| `S18-N2` (inert in Preview) | 8 | App | `app/…/builder/InspectionBuilderPreview.vue` | Planned |
| `S12-R1`–`R5`, `S12-R7`, `S12-R19`, `S12-R27`, `S12-R28`, `S12-N1` (starters and the empty screen) | 9 | API + App | `api/…/Domain/Template/StarterTemplateCatalog.php`, `…/Service/Template/StarterTemplateSeeder.php`, `…/UI/CLI/SeedStarterTemplatesCommand.php` · `app/…/builder/{StarterLibrary.vue,starterPresets.ts}` | Planned |
| `S12-R8`–`R10`, `S12-R13`, `S12-R18`, `S12-R24`, `S12-R29`, `S12-R30` (per-axle panel and the axles control) | 4 | App | `app/…/builder/fields/{PerAxleInspector,AxlesControl,FieldCanvasRow}.vue`, `builder/validation.ts` | Planned |
| `S12-R9`, `S12-R11`, `S12-R12`, `S12-R16`, `S12-R17`, `S12-R19`, `S12-N2`, `S12-E1`–`E3` (response options, canvas, validation display) | 2 | App | `app/…/builder/fields/{FieldInspector,CheckboxInspector,FieldCanvasRow}.vue`, `builder/InspectionBuilderSection.vue`, `builder/validation.ts` | Planned |
| `S12-R14`, `S12-R15`, `S12-N3` (explanation on demand; no descriptor the technician sees) | 2 | App | `app/…/builder/fields/{FieldInspector,PhotoInspector}.vue` | Planned |
| `S12-R20`–`R23` (one Text field, old templates untouched) | 1 (API), 2 (App) | API + App | `api/…/Domain/Template/{FieldType,FieldConfig}.php`, `…/Handler/Template/SaveDraftCommandHandler.php` · `app/…/builder/fields/TextInspector.vue` | Planned |
| `S12-R25`, `S12-R31`–`R33`, `S12-E4` (Preview) | 8 | App | `app/…/composables/useBuilderPreview.ts`, `app/…/builder/InspectionBuilderPreview.vue` | Planned |
| `S12-R26` ("times used") | 2 | App | `app/…/inspections/InspectionTemplates.vue`, `InspectionTemplatesModel.ts`, `InspectionTemplatesMobile.vue`, `InspectionTemplateActionSheet.vue` | Planned |
| `S14-R1`–`R3`, `S14-E1`, `S14-E2`, `S14-N1` (phone per-axle, tap targets, no zoom, no sideways scroll) | 5 | App | `app/…/filler/fields/PerAxleFieldMobile.vue` | Planned |
| `S14-R4`, `S14-R5`, `S14-R8`, `S14-N2` (axle header navigation, full-screen file, no duplicate back control) | 3 and 5 | App | `app/…/filler/MobileFiller.vue`, `app/…/shared/FileViewer.vue` | Planned |
| `S14-R6`, `S14-R7` (outstanding count on the section action; jump to the first unanswered field) | 6 | App | `app/…/filler/{DesktopOutstandingList.vue,MobileMissingList.vue,MobileFiller.vue}` | Planned |
| `DFR-001`–`DFR-009` (the design invariants) | 5 | API | `api/…/Domain/Instance/{Verdict,PerAxleAnswer,PositionKey}.php` — enforced by construction, tested per §7.1 | Planned |
| `DFR-010` (row drag reorder) | 4 | App | `app/…/builder/fields/PerAxleInspector.vue` | Planned |
| `S17-R9`, `S17-E6` (photo formats — **supersedes `DFR-011`**) | 6 | API + App | `api/…/Domain/Instance/InspectionPhotoMimeTypes.php`, `…/Handler/Instance/UploadInspectionPhotosCommandHandler.php`, `…/Query/Dbal/Instance/DbalInspectionReportDataFetcher.php`, `api/templates/inspections/report.html.twig` · `app/…/filler/fields/{PhotoField,InspectionFieldCard}.vue`, `filler/fields/usePhotoThumbnails.ts`, `app/…/shared/FileViewer.vue` | Planned |
| `DFR-012`, `DFR-013` (files never block submit; no Replace control) | 3 | API + App | `api/…/Domain/Instance/InspectionOutstandingResolver.php` · `app/…/builder/fields/ReferenceFileControl.vue` | Planned |
| `DFR-014` (an exhausted scope renders inert) | 7 | App | `app/…/filler/fields/MarkOkButton.vue` | Planned |
| `DFR-015` (the blocker count rides the section action) | 6 | App | `app/…/filler/MobileFiller.vue`, `filler/DesktopFiller.vue` | Planned |
| `NFR-003` (materialised finding summary) | — | — | **Second plan** — §3.3. The roll-up is one function so there is a single place to write it from | Deferred |
| `NFR-004` (server-side negative test per endpoint) | 3, 5, 6, 7 | API | the functional suites of each phase | Planned |
| `NFR-005` (tenant scoping on new reads) | 3, 5 | API | `api/…/Query/Dbal/Template/DbalTemplateReferenceFileFetcher.php`, `…/Instance/DbalInspectionFetcher.php` | Planned |
| `NFR-008` (answer volume sized before the schema ships) | 5 | API | Measured on production 2026-09-17 — see Appendix A. No new index; per-axle answers stay one JSON row per field | Resolved |
| `NFR-009` (bulk OK is one request, one transaction) | 7 | API | `api/…/UI/HTTP/Instance/MarkInspectionOkController.php` | Planned |
| `NFR-014` (the flag gates every endpoint; flag-off is tested) | every phase | API | the two access gates, already applying the flag | Planned |
| `NFR-017` (verdict never by colour alone) | 1 | App | `app/src/css/tokens.scss`, `filler/fields/_status-tiles.scss`, `AxleTopView.vue` | Planned |
| `NFR-018` (dark tier distinguishes not-inspected from judged) | 1 | App | `app/src/css/tokens.scss` | Planned |
| `NFR-006`, `NFR-010`–`NFR-013`, `NFR-015`, `NFR-016` | — | — | **Second plan** — they attach to the hand-off, the report and provenance | Deferred |
| `NFR-001`, `NFR-002` | — | — | **Second plan** — both are properties of the asset Inspections list, which this plan does not build | Deferred |

---

## 11. Verification Tickets

Created 2026-09-16, all assigned to **Dusan Radulovic**, type Task, Product Area "Work Orders",
each `Relates`-linked to the epic stories it verifies.

| Ticket | Covers | Linked stories |
|---|---|---|
| [SV-10144](https://shopview.atlassian.net/browse/SV-10144) | Phase 1 — seams, field identity and contract | SV-9110, SV-9099 |
| [SV-10145](https://shopview.atlassian.net/browse/SV-10145) | Phase 2 — one Text field, note and photo defaults, response-label validation | SV-9110, SV-9099, SV-9440 |
| [SV-10146](https://shopview.atlassian.net/browse/SV-10146) | Phase 3 — reference files | SV-9109 |
| [SV-10147](https://shopview.atlassian.net/browse/SV-10147) | Phase 4 — per-axle authoring | SV-9106, SV-9110, SV-9885 |
| [SV-10148](https://shopview.atlassian.net/browse/SV-10148) | Phase 5 — filling a per-axle field | SV-9106, SV-9397 |
| [SV-10149](https://shopview.atlassian.net/browse/SV-10149) | Phase 6 — note rule, outstanding list, HEIC | SV-9099, SV-9440, SV-9397 |
| [SV-10150](https://shopview.atlassian.net/browse/SV-10150) | Phase 7 — bulk Mark OK and Undo | SV-9883 |
| [SV-10151](https://shopview.atlassian.net/browse/SV-10151) | Phase 8 — Preview mode | SV-9884, SV-9110 |
| [SV-10152](https://shopview.atlassian.net/browse/SV-10152) | Phase 9 — starter library and seeding | SV-9881, SV-9110 |

**SV-10149 carries a warning in its own description**: Phase 6 was reworked late, after an audit
found its HEIC work incomplete across three layers, and that rework was not itself re-audited. Its
HEIC checks are the highest-risk items in the set.

When all nine are Done, the foundation is ready for QA.

---

## Appendix A — Production queries to run before Phase 5

Five read-only queries are prepared and schema-verified, held with this plan's working files rather than in the repository. Two of them gate decisions **in this plan**:

- **Answer rows per completed inspection — run 2026-09-17: 1,340 completed, min 1, average 32.6, max 234.** An earlier revision of this appendix said the per-axle field multiplies row counts. It does not, and that sentence contradicted §4.4: positions live as JSON inside one response row per field, so row counts are unchanged and only that row's payload grows — about 17 KB at the seven-axle worst case. The numbers are comfortably small either way.
- **Answer-table volume and ninety-day growth — run 2026-09-17: 48,312 answer rows, 2,450 inspections, 1,340 completed in the last 90 days.** Two readings matter. The 90-day completion count **equals** the all-time count, so V1 has been completing inspections for under three months and this is its launch curve rather than a steady-state rate — re-measure before trusting it as a trend. And only 1,340 of 2,450 inspections are completed; the rest are not started, in progress, or submitted without a report. That split does not affect this plan, but it matters to the second, whose build is gated on *completed*.

The other three gate decisions in the **second** plan and in Product's hands: the distribution of completed inspections per asset (which settles both the asset-tab filter argument and whether paging is deferrable — the two documents disagree by roughly fifteen times), inspection photo storage as the proxy for never-deleted reference-file growth, and whether V1 is actually being used, which the PRD asserts without a figure.

Every statement is `SELECT`-only, bounded, and mechanically checked for mutating verbs. They join `inspection → work_order_line → work_order → vehicle` because an inspection carries **no** asset or work-order column of its own — which is itself the finding behind `S5-R21`.