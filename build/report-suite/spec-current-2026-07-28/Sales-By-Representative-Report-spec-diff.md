# SBR (Sales By Representative) Report — Spec Diff (current Confluence vs our ingest) — 2026-07-28

- **pageId:** 585629698
- **Current Confluence version:** v14  (last updated 2026-07-21T07:13:08Z by Chris Ward)
- **Our ingested spec:** `build/report-suite/specs/sbr-sales-by-representative.md` (ingested 2026-07-22)
- **Verbatim current capture:** `Sales-By-Representative-Report-current.md` (same folder)

## 1. Sections ADDED / REMOVED / CHANGED since our ingest

**NONE.** The current Confluence page is content-identical to our 2026-07-22 ingest:

- **Requirement-ID set:** identical — 0 requirement IDs added, 0 removed (exact set comparison).
- **Change-log latest entry (current == ingested):** 2026-07-21 (Milan re-review: 5 payment states -> 3 display values mapping as single source of truth for badge + Invoice-Status filter; Expanded-View-PDF 10,000-row cap; expand-all/detail-page-size tech notes).
- **Normalized text similarity:** high (0.92–0.99); the only differences are formatting artifacts between our BeautifulSoup pipe-table ingest and this html2text capture — no wording, requirement, table value, or change-log entry differs.

> Result: **ADDED = none · REMOVED = none · CHANGED = none.** Nothing in this report's spec changed between 2026-07-22 and 2026-07-28.

## 2. Kickoff-video delta items vs THIS report's current spec

Whether each relevant video delta (`video-deltas-2026-07-28.md`) is reflected in the CURRENT spec text.

| Video delta item | In current spec? | Citation |
| --- | --- | --- |
| 1. "All time" date filter removed? | YES | S2-R2 presets, NO "All Time"; change-log 2026-07-16 "Removed All Time (D1)". |
| 4. "Sales by Representative" naming (not Associate)? | YES | S1-R1 "'Sales By Representative' … the full word 'Representative,' not the 'Rep' shorthand"; S1-R5 page title "Sales By Representative"; §1 naming note. "Associate" appears NOWHERE. |
| 5. Compressed/expanded download view on Sales By Customer? | YES (already, different report) | SBR HAS Summary + Expanded for BOTH PDF and CSV (S14-R1: four downloads). This is where the "compressed/expanded" concept already lives. |
| 6. "All locations" option + location label on every report? | PARTIAL | All-Locations option YES (S21-R1). Per-row location label: NO (no Location column). |
| 9. Location filter gated by custom roles/permissions (hidden when <=1 location)? | NO / contradicted | S21-R5 scopes to accessible locations, but S21-N1: "A single-location user STILL SEES the filter with one selectable location" — opposite of hide-when-<=1. |
| 10. Column selector present/absent per report (esp. TU, IV)? | PRESENT | Story 20 column selector (S20-R1); 7 toggleable metric columns. |
| 11. Labor Delta green(+)/black(0.0)/red(-) rules? | YES | S9-R3 "+" green / S9-R4 "-" red / S9-R5 "0.0" default; "Inv. Hrs" = hours invoiced - hours worked (§3). |

## 3. Biggest changes since our ingest

- **None spec-side** — the spec has not changed since 2026-07-22 (§1).
- **Pending / to-confirm video deltas:** the "Sales By Representative" naming is already correct in-spec (P5 — "Associate" is only Chris's wrong local label). Add per-row **location label** when All-locations is active (P10 FIRM). Confirm the labor-delta color rules (P14) and the Show-Unassigned-off-by-default + non-role-gated Sales-Rep toggle (P26) at VIU.

*Basis: text diff only — no live-build/VIU observation this phase (Rules 12/22). Design-pinned/spec-pinned != VIU-verified.*

