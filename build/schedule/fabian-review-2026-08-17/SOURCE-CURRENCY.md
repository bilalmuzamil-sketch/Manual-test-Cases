# Schedule — SOURCE CURRENCY (Standing Rule 31) — 2026-08-17

> Fabian design-review reconciliation pass. **Build verification is DELIBERATELY DEFERRED this pass**
> (QA-lead instruction 2026-08-17): the application was NOT opened, no behaviour was observed, and no
> case names a build. Every case authored/updated this pass carries the new
> `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` marker (Standing Rule 69).

## SOURCE CURRENCY — read 2026-08-17T18:10–18:19Z

| # | Source | Identifier | Version / last-updated | Date checked | Verdict |
|---|---|---|---|---|---|
| **A** | **Specification** | Confluence page **713031682** "Schedule", space `SHOPVIEW` | **Confluence version 30** (`version.number`), upstream last edited **2026-08-13T22:48:26.711Z** by Branko Cicovic | 2026-08-17 | **STALE — our baseline `requirements.md` reflects v25; cases were last re-stamped to reference v27 (source-accuracy 2026-08-10). Live is v30 — a v25→v30 / v27→v30 delta.** The v30 body carries all the new-scope terms (unassigned lane ×8, app-level default ×5, resolved working ×10, remaining hours ×11, Today only ×3, peek ×7, collapse ×11, pixels-per-hour ×2, Assign work order ×7, continuation chevron ×1), so **spec (A) and stories (C) agree on the new scope** (Rule 32 — duplication raises confidence). |
| **B** | **The build** | `https://sv8685.qa.shopview.com` | **NOT READ — deliberately.** Build verification deferred per the QA lead's 2026-08-17 directive. | 2026-08-17 | **DEFERRED — nothing observed, nothing claimed (Rule 12). The application was not opened. A later sync will build-verify; until then every touched case carries the "Not available on Build to test Yet" marker.** |
| **C** | **Epic + child stories** | Jira epic **SV-8685** | **39 direct children**, verified two independent ways — `parent=SV-8685` → 39 and `"Epic Link"=SV-8685` → 39, **key sets equal both ways, no paging remainder** | 2026-08-17T18:12Z | **CURRENT — and grown from 19 (2026-08-06) to 39. 14 NEW stories SV-9231…SV-9244 (12 "Ready for QA" + 2 "TESTING QA") + SV-9245 (OBSOLETE, Light/Dark/System theme). The 14 are the Fabian-review new scope; ZERO of them appear in our 176 cases today (grep = 0).** Also new since our ingest: Tasks SV-8992/9020/9083 (clarification/improvement backlog — not testable requirements), Bugs SV-8993/8921 (Done/OBSOLETE), Bug SV-8916 (Blocked — "Add Existing Work Order button missing", **superseded by SV-9242**), Bug SV-8917 (conflict-label wording, still TESTING QA). |
| **D** | **The designs** | `build/schedule/design-2026-07-27/` (Claude prototype `Schedule.dc.html`, Branko-ruled authoritative at Q0) | **no version, no date on the artefact** | 2026-08-17 | **PARTIAL — and unchanged from the 2026-08-06 finding.** ~48 of our Schedule labels are pinned from this prototype. Three earlier tickets (SV-8915/8916/8917) cite a different, **undated, editable** `claude.ai/design/p/…?via=share` link that cannot be dated for recency (Rule 32 cannot be applied to it — skill `02` step 4). Design was **NOT fetched** — the QA lead's re-ingest authorisation is conditional (*"Yes if Sasha's design is final"*) and that condition is not established. **Consequence for this pass: exact on-screen labels not pinned by the spec/story text are marked "VIU-confirm", never invented (Rule 9/12).** |
| **E** | **Engineering tech plan** | `build/schedule/tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md` | **2026-07-29**, as supplied | 2026-08-17 | **PARTIAL — no newer version supplied and no way to re-fetch it; "current" cannot be asserted (Rule 12).** No newer tech plan / technical design was provided for the Fabian review — **flagged as OUTSTANDING** (Rule 30). |
| **F** | **PO / stakeholder answers, messages, shared .md files** | Fabian design-review handover `af54d7ba-Schedule_scheduledesignreview20260805.md` (ingested 2026-08-10, `build/handover-ingest-2026-08-10/SCHEDULE-RECONCILIATION.md`) + the 14 new stories' descriptions | Handover Aug 5; new stories created/edited after 2026-08-10 | 2026-08-17 | **CURRENT — the 14 new stories are the newest authoritative product source and supersede the Aug-5 handover where they overlap (Rule 32).** The handover's two biggest items ("Add Existing Work Order" button, carryover) are now **re-specified**: the button → **SV-9242 Assign work order modal**, which explicitly *"Supersedes SV-8916"*. |

**Sources read at pass start:** 2026-08-17T18:10Z · **re-read at write start (Rule 59):** to be recorded per authoring batch in `testrail-execution-log.md` before each write.

## What is STALE and what it blocks

- **`requirements.md` is at v25; the cases reference v27; live is v30.** A full v25→v30 body re-ingest of `requirements.md` is **OWED** and is **NOT done in this pass** (this pass reconciles the epic-story new scope and the highest-impact existing-case deltas; see `COVERAGE-REDERIVATION.md`). Until the re-ingest runs, `requirements.md` must not be described as current.
- **The 14 new stories block nothing on access** — they are documents, fully readable, and are the authoritative source for the new cases authored this pass.
- **Build verification is deferred** — so every verdict about whether a case is *runnable* is pending the later sync; every touched case says so on itself via the Rule-69 marker.

## OUTSTANDING — what I need from you
- **Tech plan / technical design for the Fabian-review scope (Rule 30)** — owed by engineering; none supplied for SV-9231…SV-9244. Blocks: edge-case/API-contract strengthening of the new cases.
- **Design finality (source D)** — is Sasha's design final? Blocks: re-ingesting the newer design and confirming ~unpinned labels currently marked "VIU-confirm".
- **The later build-verification sync** — to lift the Rule-69 "Not available on Build to test Yet" markers to `READY` (or `READY - EXPECT FAIL` where a live-backed ticket exists).
