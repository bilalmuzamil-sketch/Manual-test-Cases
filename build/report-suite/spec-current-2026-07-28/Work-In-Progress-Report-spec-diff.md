# WIP (Work In Progress) Report — Spec Diff (current Confluence vs our ingest) — 2026-07-28

- **pageId:** 703660034
- **Current Confluence version:** v5  (last updated 2026-07-21T07:13:22Z by Chris Ward)
- **Our ingested spec:** `build/report-suite/specs/wip-work-in-progress.md` (ingested 2026-07-22)
- **Verbatim current capture:** `Work-In-Progress-Report-current.md` (same folder)

## 1. Sections ADDED / REMOVED / CHANGED since our ingest

**NONE.** The current Confluence page is content-identical to our 2026-07-22 ingest:

- **Requirement-ID set:** identical — 0 requirement IDs added, 0 removed (exact set comparison).
- **Change-log latest entry (current == ingested):** 2026-07-21 (Milan review + Chris override: nightly WIP snapshot capture moved IN SCOPE [new Story 11]; WO# drill-through opens SAME tab; "All Time" removed, default now "This Week").
- **Normalized text similarity:** high (0.92–0.99); the only differences are formatting artifacts between our BeautifulSoup pipe-table ingest and this html2text capture — no wording, requirement, table value, or change-log entry differs.

> Result: **ADDED = none · REMOVED = none · CHANGED = none.** Nothing in this report's spec changed between 2026-07-22 and 2026-07-28.

## 2. Kickoff-video delta items vs THIS report's current spec

Whether each relevant video delta (`video-deltas-2026-07-28.md`) is reflected in the CURRENT spec text.

| Video delta item | In current spec? | Citation |
| --- | --- | --- |
| 1. "All time" date filter removed? | YES | S7-R6 "'All Time' is not offered"; §3 + change-log 2026-07-21 removed All Time, default now This Week. |
| 2. Asset identifier = SERIAL NUMBER (not unit number)? | NO | S4-R7 Asset cell = unit number (line 1) + VIN (line 2); S4-R9 "sorts by unit number"; §4 "Asset … identified by its unit number and its VIN". Still UNIT NUMBER. |
| 6. "All locations" option + location label on every report? | YES | All-locations option YES (S7-R9). Per-row location label YES — a "Location" column exists (S4-R1, off by default; export header "Branch", S9-E1). |
| 7. Snapshot "taken X days ago" label removed? | YES | Story 11 nightly snapshot is capture-only; S11-R7 "No screen in this version reads the snapshot" — no age label displayed. |
| 9. Location filter gated by custom roles/permissions (hidden when <=1 location)? | NO | S7-R11 scopes to accessible locations; no visibility-gating (hide-when-<=1) rule. |
| 10. Column selector present/absent per report (esp. TU, IV)? | PRESENT | Story 8 "Column Selection and Persistence" (S8-R1); Total column always on. |
| 11. Labor Delta green(+)/black(0.0)/red(-) rules? | YES (color) / basis differs | S4-R24 green positive / red negative / default at 0.0 for "Inv. Hrs"; BUT S4-R23/§4 basis = quoted (Est.) labor hours - worked, i.e. vs ESTIMATE, whereas video P14 says clocked/tech vs INVOICED. WIP is a pre-invoice report so uses quoted hours — flag for VIU. |

## 3. Biggest changes since our ingest

- **None spec-side** — the spec has not changed since 2026-07-22 (§1).
- **Pending / to-confirm video deltas:** asset identifier still **unit number** — serial-number change (P24 FIRM) not yet in spec; WIP already HAS a Location column (P10 — the location-label aspect is satisfied here). Confirm labor-delta colors (P14; note WIP's Inv. Hrs is quoted-vs-worked, not invoiced-vs-worked), pinned top/bottom rows + oversized headline (P15), nightly snapshot capture (P7/P8) at VIU.

*Basis: text diff only — no live-build/VIU observation this phase (Rules 12/22). Design-pinned/spec-pinned != VIU-verified.*

