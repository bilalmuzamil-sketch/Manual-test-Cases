# Parts Velocity Report — Spec Diff (current Confluence vs our ingest) — 2026-07-28

- **pageId:** 620888066
- **Current Confluence version:** v3  (last updated 2026-07-17T03:41:45Z by Chris Ward)
- **Our ingested spec:** `build/report-suite/specs/parts-velocity.md` (ingested 2026-07-22)
- **Verbatim current capture:** `Parts-Velocity-Report-current.md` (same folder)

## 1. Sections ADDED / REMOVED / CHANGED since our ingest

**NONE.** The current Confluence page is content-identical to our 2026-07-22 ingest:

- **Requirement-ID set:** identical — 0 requirement IDs added, 0 removed (exact set comparison).
- **Change-log latest entry (current == ingested):** 2026-07-16 (server-side data model per Milan: server-paginated; all filters + sort + null-placement server-side; Custom capped 366 days; page-local toolbar search confirmed).
- **Normalized text similarity:** high (0.92–0.99); the only differences are formatting artifacts between our BeautifulSoup pipe-table ingest and this html2text capture — no wording, requirement, table value, or change-log entry differs.

> Result: **ADDED = none · REMOVED = none · CHANGED = none.** Nothing in this report's spec changed between 2026-07-22 and 2026-07-28.

## 2. Kickoff-video delta items vs THIS report's current spec

Whether each relevant video delta (`video-deltas-2026-07-28.md`) is reflected in the CURRENT spec text.

| Video delta item | In current spec? | Citation |
| --- | --- | --- |
| 1. "All time" date filter removed? | YES | §2 Out of Scope: "An 'All Time' date range … deliberately not offered"; S2-R2 preset list has no All Time. |
| 6. "All locations" option + location label on every report? | PARTIAL | All-Locations option YES (S2-R9 rightmost, + "All Locations"). Per-row location label: NO explicit Location column in the 20-column set (S4-R4), though inventory rows are per-location (S3-R1a). |
| 7. Snapshot "taken X days ago" label removed? | YES | No "snapshot taken N days ago" label anywhere in PV v3. ("Last Sale = N days", S5-R4, is a different per-part metric, not a snapshot-age label.) |
| 8. Catalog naming (special-order parts) — renamed? | NO | Current spec uses "Catalogue" throughout — Type filter Both/Inventory/Catalogue (S2-R1); §4 Terminology "Catalogue part". NOT renamed. |
| 9. Location filter gated by custom roles/permissions (hidden when <=1 location)? | NO / contradicted | S2-R9 scopes to accessible locations; S2-E4: "A user with access to only one location STILL SEES the Location filter with a single selectable location." |
| 10. Column selector present/absent per report (esp. TU, IV)? | PRESENT | Story 4 column picker (S4-R1) over all 20 columns; 14 default-visible / 6 hidden. |

## 3. Biggest changes since our ingest

- **None spec-side** — the spec has not changed since 2026-07-22 (§1).
- **Pending / to-confirm video deltas:** possible rename of **"Catalogue"** (P31 OPEN, still "Catalogue"); confirm the "snapshot taken X days ago" label is gone (P32 — already absent in spec); add per-row **location label** when All-locations is active (P10 FIRM); pagination/infinite-scroll may change (P30 OPEN); local (not global) search (P29). Demand = distinct-transaction count + reversal netting (P35) to verify at VIU.

*Basis: text diff only — no live-build/VIU observation this phase (Rules 12/22). Design-pinned/spec-pinned != VIU-verified.*

