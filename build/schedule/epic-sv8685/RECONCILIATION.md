# Schedule Epic SV-8685 — Reconciliation vs our 167 Schedule cases

> ⚠️ **COVERAGE SECTIONS SUPERSEDED 2026-07-31** — any coverage/completeness claim in this file
> was derived from the **v18-era** baseline. The authoritative coverage statement is
> `build/schedule/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md` (spec **v23**).
> The epic/story ingest and the story-by-story reconciliation below remain valid (epic SV-8685
> re-verified UNCHANGED 2026-07-31).


**Date:** 2026-07-28 · **PO:** Branko · **Scope of this doc:** ANALYSIS ONLY.
No VIU (QA branch still pending, OQ-3), no TestRail writes, no case authoring.

## Bottom line (plain words)

- The **15 Jira stories are a story-level split of the SAME PRD** our 167 cases were
  written from. Section-for-section they line up: the story PRD anchors (§3.1, §3.2,
  §4.1–§4.13, §5, §6, §7, §9, §10, §11, §14) are the exact same section numbers our
  cases already cite in their `spec_ref`.
- So **the large majority of our 167 cases MATCH the stories 1:1.** The mapping below
  shows every story → our section(s) → our case IDs (with TestRail C-ids).
- BUT the Jira PRD is a slightly **NEWER snapshot** than our ingested `requirements.md`.
  It carries **one whole missing area (Working Hours Settings editor = SV-8699)** and a
  handful of **scope changes** where the current story text contradicts our current cases.
- **Estimated later work (needs authorization; not done now):** ~**6–8 NEW cases** (all
  for SV-8699) + ~**1 small new/edited case** for a left-click menu, and ~**5 case edits**
  for the deltas below. Plus the **epic-key backfill onto all 167 cases' refs** (map ready).

---

## 1. Story → our cases map (the MATCH picture)

Our case source: `build/schedule/cases/*.json` + `testrail-id-map.csv` (167 active +
1 retired SCH-REAS-02). C-ids shown; TestRail link pattern
`https://shopview.testrail.io/index.php?/cases/view/<id>`.

| Story | Our section(s) | Our case IDs (C-ids) | Verdict |
|-------|----------------|----------------------|---------|
| **SV-8686** Grid Layout & Navigation | Navigation and Layout; Grid Toolbar | SCH-NAV-01..07 (C29925–C29931); SCH-TOOL-01..03 (C30039–C30041) | MATCH |
| **SV-8687** WO Sidebar & Mini Calendar | Mini Calendar; WO List & Search; WO Filters; Line Drill-Down | SCH-MCAL-01..04 (C29932–C29935); SCH-WOL-01..06 (C29936–C29941); SCH-FILT-01..06 (C29942–C29947); SCH-LINE-01..07 (C29948–C29954) | MATCH |
| **SV-8688** Drag-and-Drop & Shift Creation | Drag-and-Drop Scheduling; Shift Start Times & Unassigned | SCH-DND-01..08 (C29955–C29962); SCH-START-01..08 (C29969–C29976) | MATCH |
| **SV-8689** Scope Picker | Scope Picker | SCH-SCOPE-01..06 (C29963–C29968) | MATCH |
| **SV-8690** Shift Block Anatomy | Shift Block Anatomy | SCH-BLOCK-01..05 (C29991–C29995) | MATCH **except SCH-BLOCK-04 — see Delta D3** |
| **SV-8691** Multi-Day Spread | Multi-Day Spread Scheduling; (edge) | SCH-SPREAD-01..10 (C29977–C29986); SCH-EDGE-01/05/06 (C30085/C30089/C30090) | MATCH **except SCH-SPREAD-07 + SCH-EDGE-05 — see Delta D2** |
| **SV-8692** Linked Series & Banners | Linked Series and Banners; Deletion, Series Scopes and Undo | SCH-SER-01..04 (C29987–C29990); SCH-DEL-01..09 (C30057–C30065) | MATCH |
| **SV-8693** Overlap & Lane Stacking | Overlap and Lane Stacking | SCH-LANE-01..05 (C29996–C30000) | MATCH |
| **SV-8694** Day View Timeline | Day View Timeline | SCH-DAY-01..07 (C30001–C30007) | MATCH |
| **SV-8695** Shift Detail Modal & Tooltips | Shift Detail Modal; Hover Tooltips; Reassignment | SCH-MODAL-01..08 (C30008–C30015); SCH-TIP-01..05 (C30034–C30038); SCH-REAS-01 (C30052) | MATCH **except modal Reassign — see Delta D4** |
| **SV-8696** Events | Events | SCH-EVT-01..08 (C30016–C30022, C30615) | MATCH **except SCH-EVT-08 (capacity) — Delta D1; menu labels — Delta D5** |
| **SV-8697** Conflict Detection | Conflict Detection | SCH-CONF-01..07 (C30023–C30029) | MATCH |
| **SV-8698** Capacity Visualization | Capacity Bars | SCH-CAP-01..04 (C30030–C30033) | MATCH **except events-count-toward-capacity — Delta D1** |
| **SV-8699** Working Hours Settings | **(none)** | **NONE** | **GAP G1 — new cases needed** |
| **SV-8700** View Options, Color System & Display | Filter & Display & View Options; Color System; Keyboard Interactions; Reassignment/Context Menu | SCH-VIEW-01..10 (C30042–C30051); SCH-COLOR-01..03 (C30071–C30073); SCH-KEY-01..05 (C30066–C30070); SCH-REAS-03/04/05 (C30054–C30056) | MATCH **except left-click menu — Gap/Delta G2/D5** |
| **Cross-cutting §14** (epic) | Permissions | SCH-PERM-01..12 (C30074–C30084, C30614) | MATCH (maps to epic; a few map to a story — see §3) |

Every one of our 167 active cases is accounted for above. No orphan cases (nothing in
our suite that the epic no longer wants), and no story left without cases **except
SV-8699**.

---

## 2. DELTAS & GAPS (specific, with story keys + our case IDs/C-ids + verbatim source)

### GAP G1 — Working Hours Settings editor (SV-8699) is NOT covered at all
- **Story:** SV-8699 "Working Hours Settings" (§4.2 settings side).
- **What the story requires (verbatim):**
  - "Business hours in Edit Location: behind a toggle ('Set business hours for this shop'),
    off by default. Per-day editor (Mon–Sun) with From → To ranges."
  - "Technician hours in Edit Staff Member: behind a toggle ('Set custom hours for this
    technician'), off by default … Tech with no custom hours inherits shop business hours."
  - "'Add hours' appends more to support split shifts, each removable. Added ranges start empty."
  - "Overlap validation: if a day's ranges overlap, the offending range is flagged in red
    with inline message ('These hours overlap. Adjust the times so they don't conflict.')
    and Save is disabled. Incomplete rows (empty From/To) ignored by check."
- **Our coverage:** our cases only test the **consumption** of working hours — start-time
  hierarchy (SCH-START-01/02/03 = C29969–C29971), before/after-hours conflicts
  (SCH-CONF-02/03/04 = C30024–C30026), capacity math. **The editor UI itself is untested.**
- **Action later:** author a **new section** (e.g. "Working Hours Settings") with
  **~6–8 new cases** (location toggle; staff toggle + inherit-shop-hours; per-day From→To;
  Add hours split shift / removable / starts empty; overlap red flag + message + Save
  disabled; incomplete-row ignored). NEW authoring — pending authorization + VIU.

### DELTA D1 — Events DO count toward capacity (SCH-EVT-08 / SCH-CAP conflict)
- **Story SV-8698 (verbatim):** "Blue fill: aggregate technician-hours booked
  (**shifts + events**) / total available…"; AC: "Given a 2h meeting event for Tech B,
  when capacity is calculated, then **those 2h count toward the aggregate**."
  **Story SV-8696 (verbatim):** events "occupy technician time and affect capacity
  calculations"; "their time counts toward capacity."
- **Our case that conflicts:** **SCH-EVT-08 (C30615)** — "An event **does not count
  toward a technician's capacity bar** and does not raise a conflict." The
  "does not raise a conflict" half is CORRECT (SV-8696/SV-8697: events not
  conflict-checked); the "does not count toward capacity" half **contradicts SV-8698**.
- **Also check:** SCH-CAP-01 (C30030) should read blue fill = **shifts + events**.
- **Action later:** revise SCH-EVT-08 (C30615) to "counts toward capacity but is not
  conflict-checked"; confirm SCH-CAP-01 wording. Verify live at VIU (Rule 12).

### DELTA D2 — Shop closures NOT skipped in V1 (spread)
- **Story SV-8691 (verbatim):** "Uses the technician's own working hours. Automatically
  **skips weekends when business hours are not set for them**. **Shop closures and public
  holidays are not skipped in V1.** End date is emergent." **Epic Key Decision (verbatim):**
  "Weekends are skipped by spread scheduling only when business hours are not set for them;
  **shop closures/holidays are not skipped in V1.**"
- **Our cases that conflict:** **SCH-SPREAD-07 (C29983)** — "Spread … **skips weekends and
  shop closures**"; **SCH-EDGE-05 (C30089)** — "**Shop closures block the spread step** from
  placing shifts on those days." Both follow our OLDER `requirements.md` (§12, lines 208–209,
  500) which said spread skips shop closures — the current Jira has REMOVED that from V1.
- **Action later:** revise SCH-SPREAD-07 (C29983) to weekend-skip-only-when-no-business-hours
  and drop the shop-closure skip; re-scope or retire SCH-EDGE-05 (C30089). Verify at VIU.

### DELTA D3 — Shift block color defaults to blue, not tied to the work order
- **Story SV-8690 (verbatim):** "**All shift blocks use the default blue color.** Users can
  optionally assign a **custom color per shift** via the color picker in the detail modal."
  **Epic Key Decision (verbatim):** "All shift blocks default to blue; **custom colors are
  optional per shift.**"
- **Our case that conflicts:** **SCH-BLOCK-04 (C29993)** — "Block color is **tied to the work
  order** — blocks from the same order share a color." Follows our OLDER `requirements.md`
  (line 179). Our SCH-COLOR-01 (C30071) "Blue is the default color for all shifts" already
  agrees with the story.
- **Action later:** revise SCH-BLOCK-04 (C29993) to "default blue; optional per-shift custom
  color" (no WO-tied color). Verify at VIU.

### DELTA D4 — Modal "Reassign" action: Jira still lists it; our cases removed it (design-vs-spec)
- **Story SV-8695 (verbatim):** "Actions: **Delete (series-aware) and Reassign to another
  technician.**" plus "Reassignment: dragging a shift block between technician rows reassigns
  it … **Confirmation modal for cross-tech moves.**"
- **Our cases:** **SCH-MODAL-08 (C30015)** says "Delete (series-aware) action **only — there
  is no Reassign action**", and we **RETIRED SCH-REAS-02** (modal-Reassign) on 2026-07-22
  because the **design prototype removed it** (Branko Q0, design authoritative). Drag-reassign
  is kept as SCH-REAS-01 (C30052).
- So the **Jira story agrees with our OLD requirements.md** (line 282 lists modal Reassign)
  but **disagrees with our design-reconciled cases.** This is a live **design-vs-Jira
  conflict.**
- **Action later:** raise with Branko / confirm at VIU which wins. If Jira wins → re-add a
  modal-Reassign case (SCH-MODAL-08 back to Delete+Reassign) and un-retire SCH-REAS-02. If
  design wins → the Jira story text should be updated. **Open question — do not change cases
  until resolved.**

### DELTA/GAP D5 / G2 — Event-creation menu: left-click labels differ / possibly missing
- **Story SV-8696 & SV-8700 (verbatim):** "Create events via **left-click** on empty grid
  space, which opens a menu with **'Create event' and 'New work order'**." (SV-8700 repeats it.)
- **Our cases:** SCH-EVT-01 (C30016) "**right-click** 'New Event'"; SCH-EVT-02 (C30017)
  day-view click-create with preview; SCH-REAS-03 (C30054) "**right-click** context menu with
  **New Shift, New Event, View Day**." We have the right-click context menu, but **no case for
  the LEFT-click empty-grid menu {Create event, New work order}**, and the **labels differ**
  ("Create event" vs "New Event").
- **Action later:** confirm at VIU whether the menu is left-click and/or right-click and its
  exact labels; add ~1 case for the left-click {Create event, New work order} menu and align
  labels. Small — likely 1 new/edited case. Design-vs-Jira wording — verify live (Rule 9/12).

### Minor wording note (not a separate delta)
- SV-8691 weekend rule "skips weekends **when business hours are not set for them**" — our
  SCH-SPREAD-07 just says "skips weekends"; tighten the qualifier when D2 is applied.

**Delta/gap tally for later (authorization + VIU required):**
- NEW cases: ~6–8 (SV-8699 Working Hours Settings) + ~1 (left-click menu, D5/G2).
- EDIT cases: SCH-EVT-08 (C30615), SCH-CAP-01 (C30030), SCH-SPREAD-07 (C29983),
  SCH-EDGE-05 (C30089), SCH-BLOCK-04 (C29993) = ~5, plus SCH-MODAL-08 (C30015) pending D4
  resolution.
- Everything else = MATCH.

---

## 3. EPIC-KEY BACKFILL PLAN (Rule 20) — map READY

**Why:** OQ-2 (Schedule Epic/Jira key) was UNKNOWN, so our cases' `refs` currently carry
**only the PRD `spec_ref` anchor and NO Jira ticket key** (checked: every case body's
`refs` = empty; only `spec_ref`/`design_ref` present). Now the epic = **SV-8685** and the
15 story keys are known, so every case can be backfilled to the Rule-20 format
**`<TICKET> (<spec-anchor>)`**, e.g. `SV-8686 (§3.2)`.

**How the backfill works (per section → owning story key):** keep each case's EXISTING
`spec_ref` anchor as the spec half; prepend the owning story key (or the epic key for
cross-cutting cases). This is metadata-layer only (Rule 20) — tester-facing fields
untouched. **This is for a LATER authorized `update_case` pass, not now.**

| Our section (case IDs) | Backfill ticket key | Refs example |
|------------------------|---------------------|--------------|
| Navigation and Layout (SCH-NAV-01..07) | SV-8686 | `SV-8686 (§3.2)` |
| Grid Toolbar (SCH-TOOL-01..03) | SV-8686 | `SV-8686 (§6)` |
| Sidebar - Mini Calendar (SCH-MCAL-01..04) | SV-8687 | `SV-8687 (§3.1, §5.2)` |
| Sidebar - WO List & Search (SCH-WOL-01..06) | SV-8687 | `SV-8687 (§3.1)` |
| Sidebar - WO Filters (SCH-FILT-01..06) | SV-8687 | `SV-8687 (§5.1)` |
| Sidebar - Line Drill-Down (SCH-LINE-01..07) | SV-8687 | `SV-8687 (§3.1)` |
| Drag-and-Drop Scheduling (SCH-DND-01..08) | SV-8688 | `SV-8688 (§4.1)` |
| Shift Start Times & Unassigned (SCH-START-01..08) | SV-8688 | `SV-8688 (§4.2)` |
| Scope Picker (SCH-SCOPE-01..06) | SV-8689 | `SV-8689 (§4.3)` |
| Shift Block Anatomy (SCH-BLOCK-01..05) | SV-8690 | `SV-8690 (§4.4)` |
| Multi-Day Spread (SCH-SPREAD-01..10) | SV-8691 | `SV-8691 (§4.5)` |
| Linked Series and Banners (SCH-SER-01..04) | SV-8692 | `SV-8692 (§4.6)` |
| Deletion, Series Scopes & Undo (SCH-DEL-01..06 series) | SV-8692 | `SV-8692 (§7 series-aware deletion)` |
| Deletion — generic toast/undo (SCH-DEL-07/08/09) | SV-8688 | `SV-8688 (§7 toast/undo)` *(§7 is cross-cutting; SV-8688 owns create-toast)* |
| Overlap and Lane Stacking (SCH-LANE-01..05) | SV-8693 | `SV-8693 (§4.7)` |
| Day View Timeline (SCH-DAY-01..07) | SV-8694 | `SV-8694 (§4.8)` |
| Shift Detail Modal (SCH-MODAL-01..08) | SV-8695 | `SV-8695 (§4.9)` |
| Hover Tooltips (SCH-TIP-01..05) | SV-8695 | `SV-8695 (§4.13)` |
| Reassignment — drag (SCH-REAS-01) | SV-8695 | `SV-8695 (§7 reassignment)` |
| Reassignment/Context Menu (SCH-REAS-03/04/05) | SV-8700 | `SV-8700 (§7 / §4.10 menu)` *(New Shift↔SV-8688, New Event↔SV-8696, View Day↔SV-8686 — menu owned by SV-8700)* |
| Events (SCH-EVT-01..08) | SV-8696 | `SV-8696 (§4.10)` |
| Conflict Detection (SCH-CONF-01..07) | SV-8697 | `SV-8697 (§4.11)` |
| Capacity Bars (SCH-CAP-01..04) | SV-8698 | `SV-8698 (§4.12)` |
| Filter & Display & View Options (SCH-VIEW-01..10) | SV-8700 | `SV-8700 (§9)` |
| Color System (SCH-COLOR-01..03) | SV-8700 | `SV-8700 (§10)` |
| Keyboard Interactions (SCH-KEY-01..05) | SV-8700 | `SV-8700 (§7 / §11)` |
| Permissions — core tiers (SCH-PERM-01..07, 09) | **SV-8685 (epic)** | `SV-8685 (§14.1)` *(cross-cutting, no single-story owner)* |
| Permissions — WO:View dep (SCH-PERM-08, 12) | SV-8687 | `SV-8687 (§14.2)` |
| Permissions — dept rows / Time Clock (SCH-PERM-10, 11) | SV-8686 | `SV-8686 (§14.4)` |
| Edge — perf/responsiveness (SCH-EDGE-02/03/04) | SV-8686 / SV-8687 | `SV-8686 (§11)` / `SV-8687 (§11)` |
| Edge — spread/quantities (SCH-EDGE-01/05/06) | SV-8691 | `SV-8691 (§4.5, §12)` |

**Notes / judgment calls in the map:**
- §7 (interaction patterns) and §14 (permissions) are **cross-cutting** in the PRD. Where a
  case cleanly serves one story, it is mapped there; the core permission tiers stay on the
  **epic SV-8685** per Rule 20 (cross-cutting = epic key, stated explicitly).
- Keep each case's existing `spec_ref` as the parenthetical spec anchor — do not drop it
  (Rule 20 requires ticket + spec both).
- For the deltas (D1–D5, G1/G2) the refs still backfill the same way; the case-body edits are
  a separate concern.

**Is the map ready?** **YES.** Every one of the 167 active cases has a determined
backfill key above. This can drive a later authorized `update_case` pass (metadata-only,
no tester-facing change) once the user approves — resolves OQ-2.

---

## 4. What was NOT done (per task scope)
- No VIU / live-build check (QA branch pending, OQ-3).
- No TestRail writes (no add/update/delete of cases, sections, runs, or results).
- No case authoring or editing — all deltas/gaps/backfill are staged as a plan only.
