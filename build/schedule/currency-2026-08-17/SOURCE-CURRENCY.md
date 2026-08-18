# Schedule — SOURCE CURRENCY (Standing Rule 31) — whole-suite currency pass 2026-08-17

> Build verification **DELIBERATELY DEFERRED** (QA-lead instruction): the application was NOT opened,
> `quick-login`/`switch-user` were never called, no behaviour observed. Every touched case carries the
> Rule-69 `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` marker.

## Pre-flight — read live 2026-08-18 (re-confirming the Fabian 2026-08-17 v30 ingest)

| # | Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|---|
| **A** | **Specification** | Confluence page **713031682** "Schedule", space `SHOPVIEW` | **Confluence v30**, last edited **2026-08-13T22:48:26Z** ("Restore Business hours labelling") | 2026-08-18 | **CURRENT.** Live page last-modified **Aug 14** = the v30 edit; unchanged since the Fabian re-ingest. Body re-read live in full — matches `requirements.md` (v30 baseline). The in-body "Version 1.1" field is the Rule-31(a) trap; the Confluence version number is authoritative. |
| **B** | **The build** | `https://sv8685.qa.shopview.com` | **NOT READ — deliberately** | 2026-08-18 | **DEFERRED** — nothing observed, nothing claimed (Rule 12). The later build-verify sync lifts the Rule-69 markers. |
| **C** | **Epic + child stories** | Jira epic **SV-8685** | **39 direct children**, verified `parent=SV-8685` → totalCount 39 | 2026-08-18 | **CURRENT** — unchanged from the Fabian ingest (14 new stories SV-9231…SV-9244 covered; SV-9245 theme OBSOLETE, not tested). |
| **D** | **Designs** | `build/schedule/design-2026-07-27/` (Claude prototype `Schedule.dc.html`) | no version, no date | 2026-08-18 | **PARTIAL** — unchanged. Sasha's newer `claude.ai/design/p/…?via=share` link is undated/editable; re-ingestion is conditional on "if Sasha's design is final" (not established). Labels not pinned by spec/story text are left "VIU-confirm", never invented. |
| **E** | **Engineering tech plan** | `build/schedule/tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md` | 2026-07-29 (as supplied) | 2026-08-18 | **PARTIAL** — no newer version supplied. The v30 shop-closures rule contradicts this plan (spec wins, Rule 32; reported). |
| **F** | **PO / handover / .md files** | Fabian handover `af54d7ba-Schedule_scheduledesignreview20260805.md` + the 14 new stories | Aug 5 handover; stories after Aug 10 | 2026-08-18 | **CURRENT** — the 14 new stories are the newest authoritative product source. |

**Rule 59:** sources read at pass start 2026-08-18 and unchanged through the write window (spec v30,
epic 39). Dates on the cases are set to **17 August 2026 / 8/17/2026** to keep the whole 195-case suite
**uniform** with the 47 cases the Fabian pass brought to v30 the previous day, per the coordinator's
explicit marker string; execution was on 8/18 (noted for honesty).

## What is current now
- **`requirements.md` = the v30 baseline** (Fabian pass), 0 orphaned anchors — re-read and used as the baseline.
- **All 195 live cases cite spec version 30** (post-write census: 195/195; 0 stray v27).
- Build verification remains deferred — every verdict about whether a case is *runnable* is pending the sync.
