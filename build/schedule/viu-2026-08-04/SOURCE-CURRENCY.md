# Schedule — SOURCE-CURRENCY block (Standing Rule 31 pre-flight)

**Pass:** live VIU against the Schedule QA branch `sv8685` · **date checked 2026-08-04**

| # | Source | Identifier | Version / last-updated (LIVE) | Our baseline before this pass | Verdict |
|---|---|---|---|---|---|
| 1 | **Spec** | Confluence page **713031682** "Schedule" | **Confluence version 23**, 2026-07-30T10:40:32.155Z, Branko Cicovic, no comment. The in-body "Version:" line still reads **1.0** — the known staleness trap, so the Confluence version number was used. | mirror captured at Confluence **v23** | **CURRENT — unchanged** |
| 2 | **Epic + child stories** | **SV-8685 "Schedule — Technician Scheduling Module"** (Epic, Open) | **28 descendants**, verified two independent ways (`parent = SV-8685` → 28 and `"Epic Link" = SV-8685` → 28, same keys, no paging remainder). | we knew of **16**: 15 stories + SV-8812 | **WAS STALE — REFRESHED** (Tier-1 only; no Tier-2 full re-read was needed or asked for) |
| 3 | **Designs** | none — Branko confirmed 2026-07-21 there is no Figma for Schedule; the Claude prototype `Schedule.dc.html` was ruled authoritative | unchanged | **CURRENT.** No Rule-35 fetch queue exists or is needed for this project. |
| 4 | **Engineering tech plan** | `build/schedule/tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md` | reconciled 2026-07-29 / 07-30 | same | **CURRENT** |
| 5 | **PO / stakeholder answers** | `build/schedule/branko-answers-2026-07-31/answers-ingested.md` | ingested 2026-07-31 | same | **CURRENT — and two of its rulings now clash with tickets another QA raised today; see below** |
| 6 | **THE BUILD** (new source this pass) | `sv8685.qa.shopview.com`, API `sv8685api.qa.shopview.com` (host confirmed by probe, not assumed) | **`v3.5-4873abe`**, `index.html` last-modified Tue, 04 Aug 2026 14:47:39 GMT, etag `9b4b1fc776ebbfb04a9a0ca051d847f7` — **identical at start, mid-run and end** | never observed before today | **PARTIAL — the branch is NOT declared final**, so every verdict is provisional and `RECHECK-QUEUE.md` is OPEN |
| 7 | **TestRail group 4254** | 165 cases | all `created_by: 3` | 165 | **CURRENT — 0 foreign cases** |
| 8 | **TestRail run 357** | "Schedule - Ayesha (VIU Pending)" | `include_all:false`, **165 tests**, **429 result records**, all `created_by: 3`, **all Untested**, **zero tester comments** | the brief said 165 / 429 | **CURRENT — verified, not trusted** |

**Nothing in this pass is reported as complete while source 6 is PARTIAL.** The exact shortfall:
engineering has not declared `sv8685` final, so all 165 verdicts are **provisional** and the
re-check queue stays OPEN.

## FINDING 1 (epic) — twelve defect tickets exist that we had never seen

The epic went from the 16 children we knew about to **28**. What changed:

- **the 15 stories SV-8686…SV-8700 all moved to `Ready for QA`** (the brief expected "In Progress")
- **SV-8812** "Set up a dedicated QA environment for testing" is now **Done** — that is this branch
- **twelve NEW `Bug` tickets, SV-8826 … SV-8841, all raised on 2026-08-04 by Mudassir Qamar**,
  every one parented to SV-8685 with Product Area *Schedule* and priority Medium

Every one was reproduced independently this pass. Six confirmed exactly as written, two do not
reproduce as written, and two contradict a recorded PO ruling — the detail is in `FINDINGS.md`
sections 12 and 13, and it is a QA-lead conversation, not something we changed on their behalf
(Standing Rules 38 / 39).

## FINDING 2 (spec vs PO) — two of those tickets argue against Branko's own rulings

- **SV-8835** says the hover tooltip should hide the VIN when the VIN switch is off. **Branko ruled
  on 2026-07-31 (Q6 = A) that the VIN is always visible on hover regardless of the switch**, and
  spec §4.13 lists it unconditionally. Our SCH-TIP-01 = C30034 and SCH-VIEW-04 = C30045 assert the
  build's behaviour on that ruling.
- **SV-8829** says the shift window should show labor and total figures on the line. **Branko ruled
  on 2026-07-22: "We do not show total $ anywhere in the schedule."** Our SCH-MODAL-04 = C30011
  asserts no money. (The ticket's *other* half — no inline edit on the estimated hours — is a
  genuine gap and is confirmed.)

Under Standing Rule 33 the PO ruling outranks a reviewer's spec reading, so **the rulings stand and
nothing was changed**; both are on the QA lead's desk with the evidence.
