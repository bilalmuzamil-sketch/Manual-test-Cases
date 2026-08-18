# Filters — whole-case currency pass — SOURCE-CURRENCY (2026-08-17)

**Pass:** `build/filters/currency-2026-08-17/` · worker = TestRail user id 3 (Bilal Muzamil)
**Epic:** SV-8785 · **PO:** Branko Cicovic · **TestRail group:** 4110 · **Run (not ours):** 352
**Goal:** make every Filters case fully CURRENT to spec v21 + epic SV-8785 + the ingested Filters
Claude design (content + labels + refs/provenance). Documents-only pass — **app NOT opened**
(build verification deferred; touched cases carry the Rule-69 marker).

## Sources — currency established LIVE at pass start (2026-08-17)

| # | Source | Identifier | Version / last-edited | Checked (this pass) | Verdict |
|---|---|---|---|---|---|
| a | **Filters spec (Confluence)** | page **572030978** "Filters" | **v21** (in-body field reads "Version: 1.7" — Rule 31 trap (a), ignored). Live `lastModified` = **Aug 14 2026**, author Branko Cicovic. | fetched live via Atlassian MCP `getConfluencePage`, 2026-08-17 | **CURRENT.** Live body compared to the fabian-review pass's saved `spec-v21.txt` by normalised word-multiset: **0 requirement-prose words differ** (only header design/Figma link URLs differ). The spec has **not moved** since the fabian pass earlier today. |
| b | **Epic + child stories** | **SV-8785** | **33 children**, counted two independent ways: `parent = SV-8785` → 33 (5 shown + 28 remaining) and `"Epic Link" = SV-8785` → 33 (equal, no paging remainder — Rule 37 Tier-1). | Atlassian MCP JQL, 2026-08-17 | **CURRENT.** Same 33 as the fabian pass. The 12 redesign stories SV-9268–SV-9279 are mapped; the older stories SV-8786–8790 still describe the pre-redesign 5-chip model but are **superseded by the v21 spec** (which explicitly removes Stories 3/4/5) — Rule 32 latest-wins, spec resolves the divergence itself, no PO question owed. |
| c | **Claude design (Filters)** | `build/filters/design-2026-08-17/DESIGN-NOTES.md` (ingested from the QA lead's `Shopview_Design_System_2.zip`) | attached 2026-08-17 | read 2026-08-17 | **CURRENT — CONFIRMATORY.** Pins the desktop v21 labels (Assigned-to-me toggle no-arrow/no-clear-X; Asset Yes/No single-select + checkmark + "Clear selection"; Status multi-select; per-chip X-circle clear, no global "Clear filters"; shared-link banner verbatim; date presets + "MM/DD/YYYY – MM/DD/YYYY"; empty state; tabs; mobile "Apply filters"). **Does NOT cover** the per-view page rollout (which filters each Parts view / Report carries) — that stays "confirm live" (owed by engineering). The ZIP's mobile frames (`Mobile.png`, `mobile-filters.jsx`) are the OLD superseded combined-drawer model — NOT used. |
| d | **Engineering tech plan / tech design / handover** | `build/filters/tech-plan-2026-07-29/…`, eng handover `SV-8785-app-wide-filter-redesign` (2026-08-10) | 2026-07-29 / 2026-08-10 | **not re-opened this pass** | **CURRENT for the baseline; NOT re-read this pass.** Cited on a handful of cases (C29632 tech design; C38895 tech plan; C38909 handover). Their read-dates on those cases are **left unchanged** — Rule 14.1(2) bars back-filling a read-date onto a source we did not actually re-read. Per-view filter list still **PENDING from engineering** (spec S1-R8 / S13-R23). |
| e | **PO answers (Branko)** | `branko-answers-2026-08-04/answers-ingested.md` etc. | through 2026-08-05 | **not re-opened this pass** | **SUPERSEDED where in conflict with v21.** Cited on C38876 (default tab), C38904–06/38909–11 (Parts/Reports per-view). Read-dates left unchanged (not re-read this pass). |

## What "current" means for this pass
- **Spec + epic re-read live today (17 Aug)** → the two sources whose read-dates move to 17 August 2026 in the provenance lines I touch.
- **Design re-ingested today** (design-2026-08-17) — confirmatory; no label needed changing (fabian already pinned labels from the v21 spec prose, which is complete for labels).
- **All other cited sources (tech plan / tech design / handover / Branko answers / Figma explorations) NOT re-opened** — their read-dates are preserved exactly (Rule 14.1(2)).

## Prior state (fabian-review-2026-08-17, earlier today)
That pass reconciled the whole suite to v21: 60 existing updated + 9 new = 69 cases carrying the
Rule-69 marker and a v21 provenance line (read 17 Aug). It **left 55 cases untouched** whose
behaviour the redesign did not change — but those 55 **still cite spec v19** in refs + provenance
(a version-only re-stamp it explicitly flagged as owed). **That re-stamp is the core of this pass.**

## OUTSTANDING (source side)
- **Per-view filter list PENDING from engineering** (spec S1-R8 / S13-R23) — Parts/Reports coverage
  stays behavioural + "confirm live" until it lands.
- **Build verification deferred** (app not opened) — all touched cases carry the Rule-69 marker; a
  later build-verify sync lifts them to READY.
- **Greyed-vs-hidden Status chip on Estimates/Completed (C29609/C29610)** — v21 S9-R5 says hidden;
  QA-lead ruling 2026-07-30 said greyed — CONFLICT held by fabian, not reversed. (Not touched here.)
