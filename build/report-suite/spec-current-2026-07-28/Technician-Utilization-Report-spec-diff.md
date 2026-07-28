# Technician Utilization Report — Spec Diff (current Confluence vs our ingest) — 2026-07-28

- **pageId:** 641400833
- **Current Confluence version:** v4  (last updated 2026-07-17T03:44:06Z by Chris Ward)
- **Our ingested spec:** `build/report-suite/specs/technician-utilization.md` (ingested 2026-07-22)
- **Verbatim current capture:** `Technician-Utilization-Report-current.md` (same folder)

## 1. Sections ADDED / REMOVED / CHANGED since our ingest

**NONE.** The current Confluence page is content-identical to our 2026-07-22 ingest:

- **Requirement-ID set:** identical — 0 requirement IDs added, 0 removed (exact set comparison).
- **Change-log latest entry (current == ingested):** 2026-07-16 (Milan review: All Time removed [Story 10 deleted]; Custom capped 366 days; per-day breakdown lazy-loads on expand; single report-level timezone = active workplace).
- **Normalized text similarity:** high (0.92–0.99); the only differences are formatting artifacts between our BeautifulSoup pipe-table ingest and this html2text capture — no wording, requirement, table value, or change-log entry differs.

> Result: **ADDED = none · REMOVED = none · CHANGED = none.** Nothing in this report's spec changed between 2026-07-22 and 2026-07-28.

## 2. Kickoff-video delta items vs THIS report's current spec

Whether each relevant video delta (`video-deltas-2026-07-28.md`) is reflected in the CURRENT spec text.

| Video delta item | In current spec? | Citation |
| --- | --- | --- |
| 1. "All time" date filter removed? | YES | S1-R4 Custom capped 366d, no All Time; change-log 2026-07-16 "Removed All Time (deleted Story 10)". |
| 5. Compressed/expanded download view on Sales By Customer? | YES (already, different report) | TU has Summary PDF + Expanded-View PDF (S7-R2/R3) + one CSV. |
| 6. "All locations" option + location label on every report? | PARTIAL | All-Locations option YES (S9-R1). Per-row location label: NO (hours pooled across locations into one row per tech, S9-R4 — no per-row location identifier). |
| 9. Location filter gated by custom roles/permissions (hidden when <=1 location)? | NO / contradicted | S9-R5 scopes to accessible; S9-N1: "A user with access to only one location still sees the filter with a single selectable location." |
| 10. Column selector present/absent per report (esp. TU, IV)? | ABSENT | No column-selector story; toolbar S8-R3 = download menu, technician filter, date picker, location filter only. Matches video P18 (Chris vetoed). |

## 3. Biggest changes since our ingest

- **None spec-side** — the spec has not changed since 2026-07-22 (§1).
- **Pending / to-confirm video deltas:** TU must **move DOWN** in the reports nav (additive-not-interruptive; P3 FIRM) — verify our TU-NAV placement cases require "toward the bottom / below existing items". **No column selector** (P18) matches the current spec. Est. Lost Labor = location default labor rate × internal hours (P17) and collapsed/expanded Timesheet-Activities links (P16) to confirm at VIU. Add per-row **location label** when All-locations is active (P10 FIRM).

*Basis: text diff only — no live-build/VIU observation this phase (Rules 12/22). Design-pinned/spec-pinned != VIU-verified.*

