# Inventory Value Report — Spec Diff (current Confluence vs our ingest) — 2026-07-28

- **pageId:** 720142338
- **Current Confluence version:** v2  (last updated 2026-07-21T07:13:15Z by Chris Ward)
- **Our ingested spec:** `build/report-suite/specs/inventory-value.md` (ingested 2026-07-22)
- **Verbatim current capture:** `Inventory-Value-Report-current.md` (same folder)

## 1. Sections ADDED / REMOVED / CHANGED since our ingest

**NONE.** The current Confluence page is content-identical to our 2026-07-22 ingest:

- **Requirement-ID set:** identical — 0 requirement IDs added, 0 removed (exact set comparison).
- **Change-log latest entry (current == ingested):** 2026-07-21 (server-side data model per Milan, mirroring Parts Velocity: server-paginated; server-side sort; Category/Vendor filters server-side; totals row server-computed over full filtered set; page-level part search; server-side exports + 10k row cap; snapshot retention S11-R6).
- **Normalized text similarity:** high (0.92–0.99); the only differences are formatting artifacts between our BeautifulSoup pipe-table ingest and this html2text capture — no wording, requirement, table value, or change-log entry differs.

> Result: **ADDED = none · REMOVED = none · CHANGED = none.** Nothing in this report's spec changed between 2026-07-22 and 2026-07-28.

## 2. Kickoff-video delta items vs THIS report's current spec

Whether each relevant video delta (`video-deltas-2026-07-28.md`) is reflected in the CURRENT spec text.

| Video delta item | In current spec? | Citation |
| --- | --- | --- |
| 1. "All time" date filter removed? | YES | S5-R1 "It does not offer 'All Time'"; §2 Known Limitations "No 'All Time' date option". |
| 6. "All locations" option + location label on every report? | PARTIAL | All-locations option YES (S7-R1). Per-row location label: NO (one row per part per location, S2-R3, but no Location identifier column in S3-R1). |
| 7. Snapshot "taken X days ago" label removed? | YES (label absent) — but keep "As of"  | No "taken N days ago" label. IV's S5-R5 "As of <date>" indicator is a DIFFERENT indicator the video says to KEEP. |
| 9. Location filter gated by custom roles/permissions (hidden when <=1 location)? | NO / contradicted | S7-R4 scopes to accessible; S7-N1: "A user with access to only one location still sees the filter with a single selectable location." |
| 10. Column selector present/absent per report (esp. TU, IV)? | PRESENT | Story 8 "Column Selection and Persistence" (S8-R1); Margin + Total Sell off by default (S3-R13); Total Cost always on. |

## 3. Biggest changes since our ingest

- **None spec-side** — the spec has not changed since 2026-07-22 (§1).
- **Pending / to-confirm video deltas:** IV correctly has **no compressed/expanded split** (P36 — single view). Column selector is PRESENT (P10/V10). Add per-row **location label** when All-locations is active (P10 FIRM). Keep the "As of <date>" indicator (distinct from the removed "taken X days ago" label, P32). Confirm the location-filter permission model (P33) once Chris specs it.

*Basis: text diff only — no live-build/VIU observation this phase (Rules 12/22). Design-pinned/spec-pinned != VIU-verified.*

