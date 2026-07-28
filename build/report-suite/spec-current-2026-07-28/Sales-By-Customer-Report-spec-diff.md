# SBC (Sales By Customer) Report — Spec Diff (current Confluence vs our ingest) — 2026-07-28

- **pageId:** 577634305
- **Current Confluence version:** v11  (last updated 2026-07-21T07:12:55Z by Chris Ward)
- **Our ingested spec:** `build/report-suite/specs/sbc-sales-by-customer.md` (ingested 2026-07-22)
- **Verbatim current capture:** `Sales-By-Customer-Report-current.md` (same folder)

## 1. Sections ADDED / REMOVED / CHANGED since our ingest

**NONE.** The current Confluence page is content-identical to our 2026-07-22 ingest:

- **Requirement-ID set:** identical — 0 requirement IDs added, 0 removed (exact set comparison).
- **Change-log latest entry (current == ingested):** 2026-07-21 (Milan review resolution: Story-18 server-backed type-ahead Customer filter + explicit all-customers state; 10,000-row export cap on CSV/PDF/Print; asset grouping by vehicle id; expand-all scoped to current page).
- **Normalized text similarity:** high (0.92–0.99); the only differences are formatting artifacts between our BeautifulSoup pipe-table ingest and this html2text capture — no wording, requirement, table value, or change-log entry differs.

> Result: **ADDED = none · REMOVED = none · CHANGED = none.** Nothing in this report's spec changed between 2026-07-22 and 2026-07-28.

## 2. Kickoff-video delta items vs THIS report's current spec

Whether each relevant video delta (`video-deltas-2026-07-28.md`) is reflected in the CURRENT spec text.

| Video delta item | In current spec? | Citation |
| --- | --- | --- |
| 1. "All time" date filter removed? | YES | S2-R2 lists 11 presets (Today…Custom), NO "All Time"; change-log 2026-07-16 "Removed the 'All Time' date range". |
| 2. Asset identifier = SERIAL NUMBER (not unit number)? | NO | S8-R8 asset-label suffix priority = "· Unit {unit}" -> plate -> "VIN …{last 8}" -> none. Still UNIT NUMBER; "serial number" appears nowhere. |
| 3. Print button on Sales By Customer removed? | NO | Story 16 "Print the report" is fully present (S16-R1..R6); S14-R1 overflow menu holds "Print"; §7 lists "Print PDF fails". Print STILL PRESENT. |
| 5. Compressed/expanded download view on Sales By Customer? | NO | SBC exports are a single FLAT shape (Customer then Invoice rows, no asset layer) — S14-R6/S14-R10 (CSV), S15-R16 (PDF). There is NO Summary-vs-Expanded / compressed-vs-expanded option. |
| 6. "All locations" option + location label on every report? | PARTIAL | All-locations option YES (S4-R3 "All locations" pinned top). Per-row location LABEL: NO (tree is Customer->Asset->Invoice; no Location column). |
| 9. Location filter gated by custom roles/permissions (hidden when <=1 location)? | NO | Location scoping by accessible locations present (S4-R2/R9), but no "hide filter when <=1 location" rule stated. |
| 10. Column selector present/absent per report (esp. TU, IV)? | PRESENT | Story 13 "Show or hide columns" (S13-R1..R8); 9 toggleable columns. |
| 11. Labor Delta green(+)/black(0.0)/red(-) rules? | YES | S12-R3 "+" green / S12-R4 "-" red / S12-R5 "0.0" default(black); column "Inv. Hrs" = hours invoiced - hours worked (§4). Matches video P14. |

## 3. Biggest changes since our ingest

- **None spec-side** — the spec has not changed since 2026-07-22 (§1).
- **Pending video deltas that will affect this report (not yet in spec, Rule 23):** remove the Print button (P25 FIRM); add a compressed/expanded download view (P21 FIRM); change the asset identifier from unit number to **serial number** (P24 FIRM); add a per-row **location label** when "All locations" is active (P10 FIRM). "Refunds/credits ignored" (P34) and Product-Type = Part Sales/WO Sales/Both (P22) are confirmations to verify at VIU.

*Basis: text diff only — no live-build/VIU observation this phase (Rules 12/22). Design-pinned/spec-pinned != VIU-verified.*

