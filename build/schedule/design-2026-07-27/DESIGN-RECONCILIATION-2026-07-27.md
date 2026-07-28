# Schedule — Design ZIP ingest + reconciliation vs the 167 cases (2026-07-27)

> **ANALYSIS ONLY — no case authoring, no TestRail writes.** This documents what the two
> user-provided design ZIPs contain, whether they are new vs the Claude prototype we already
> used, how the ~18 "confirm-at-VIU" pinned labels fare against the new design, and the full
> list of case-update deltas for a LATER authorized update pass.
>
> **Rule 12 caveat:** a design prototype is still NOT the live build. Everything below is
> "design-pinned", not "VIU-Verified". The live build must still confirm each item at the VIU
> pass once the QA branch exists (OQ-2 Epic key + OQ-3 QA env still open).

---

## 1. What the two ZIPs are

- **Inputs:** `f2d898cf-Schedule_1.zip` and `fb6b9382-Schedule_2.zip`.
- **The two ZIPs are BYTE-IDENTICAL to each other** (`diff -rq` = identical; same
  `Schedule.dc.html` md5 `d4d5ccfb…`). They are the same package delivered twice — treat as ONE
  design set.
- **What it is:** a **Claude.ai design export** — a coded interactive HTML/JS prototype
  (`Schedule.dc.html`, ~350 KB, `<sc-if>/<sc-for>` templates + JS state/logic), a rendered PRD
  (`Schedule PRD.dc.html`), focused sub-prototypes (`Line Drag Scheduling.dc.html`,
  `Line Picker Popover.dc.html`, `Edit Modals.dc.html`), a printable **week-export** view
  (`Schedule Week Export.dc.html` + `schedule-week-view.html`), 60+ render screenshots, PRD
  upload screenshots, and the ShopView design-system bundle (`_ds/…` colors/type CSS + Inter
  fonts). **NOT a Figma file.** Same format/lineage as the design we captured 2026-07-22.
- 207 files per ZIP (vs 185 in the 2026-07-22 capture). Saved (design assets only, no fonts,
  no secrets) under `build/schedule/design-2026-07-27/` (prototypes/, screenshots/, avatars/,
  a curated set of the newest 2026-07-24 uploads).

## 2. Same as the Claude prototype we already used? → **NEWER REVISION of the same prototype**

**Not a brand-new/different design — it is an UPDATED version of the SAME Claude prototype**
we reconciled against on 2026-07-22 (same `_ds` design-system bundle `fac6efcf…`, same screen,
same lineage). Evidence:

| Check | 2026-07-22 capture | New ZIP (2026-07-27) |
|---|---|---|
| `Schedule.dc.html` md5 | `8021f90b…` | `d4d5ccfb…` (**CHANGED**) |
| File count | 185 | 207 (+22) |
| Newest asset date | 2026-07-22 | **2026-07-24** |

**Added in the new revision:** `Edit Modals.dc.html` (merges the old Edit Staff Member + Hours
Settings into one file — Edit Staff Member + Edit Location modals), `Schedule Week Export.dc.html`
+ `schedule-week-view.html` (a **printable/exportable week view**, Department × Technician),
`avatars/*.png`, `export/sv-tokens-nofont.css` + `theme-shim.js`, and new screenshots
(`footer`, `footer2`, `menu-test*`, `split-fix`, `split-menu`, `schedule-export`, `final-check`).
**Removed:** `Edit Staff Member.dc.html`, `Hours Settings.dc.html` (folded into Edit Modals).

**Net:** the authoritative prototype changed enough to matter — two behavioral/label areas moved
(see §3–§4). Most of the ~48 labels folded on 2026-07-22 are UNCHANGED and still valid (spot-check
of ~18 key labels: all present — "Schedule whole work order", "Select multiple", "Create shift",
"Change scope", "Full estimate"/"Until a date…"/"Specific hours…", "Remove from series"/"This shift
only"/"The whole series", "Needs techs", "Search work orders"/"Search lines", "VIN Number",
"Adjust"; modal still has NO Reassign / NO "Open Work Order" / NO $).

## 3. The ~18 "confirm-at-VIU" pinned labels (coverage-matrix §D.1) — CONFIRMED vs DELTA

| # | D.1 item (case) | Verdict vs new design |
|---|---|---|
| 1 | "Filter" vs "Filters" sidebar caption — **SCH-FILT-01 (C29942)** | **DELTA → resolves to "Filters"** (plural; screenshot + template both show "Filters"). Our case says "Filter". |
| 2 | Right-click menu "New Shift"/"View Day" — **SCH-REAS-03 (C30054), SCH-REAS-04 (C30055), SCH-REAS-05 (C30056)** | **DELTA** — the new cell context menu has only **"Create Event"** + **"New Work Order"**. No "New Shift", no "View Day". (See §4.) |
| 3 | Sidebar Status-filter enumeration | STILL OPEN (tenant/app data — not pinned by design). |
| 4 | Department names | STILL OPEN (tenant data; SERVICE/ADMINISTRATION illustrative only). |
| 5 | Schedule permission naming in roles admin | STILL OPEN (Edit Staff modal shows a generic Role dropdown, not the Schedule View/Edit/Delete tiers). |
| 6 | Tooltip open delay ~300–500 ms | STILL OPEN (not exercised by prototype). |
| 7 | Toast lifetime 4–7 s — **SCH-DEL-08** | **CONFIRMED / now pinned** — code sets `undo?7000:4000` = **7 s with Undo, 4 s without** (inside the 4–7 s range). |
| 8 | Auto-scroll buffer 30–60 min | STILL OPEN (approximate; not pinned). |
| 9 | 960 px min width / sidebar-collapse breakpoint | STILL OPEN (not pinned). |
| 10 | **7 AM–7 PM default working day** — SCH-START-03/06 | **STILL OPEN — discrepancy PERSISTS.** New prototype STILL hardcodes `start:8,end:17` (9 h). Spec says 7 AM–7 PM. Resolve LIVE. |
| 11 | Virtualization at 50+ | STILL OPEN (impl detail). |
| 12 | Direct-URL access with Schedule: View OFF | STILL OPEN (spec-only). |
| 13 | Department-less staff row handling | STILL OPEN (not pinned). |
| 14 | Notes per-work-order sharing across shifts | STILL OPEN (scoping not pinned). |
| 15 | Hidden-weekend-column behaviour for existing weekend shifts | STILL OPEN (not pinned). |
| 16 | Now line on non-today days | STILL OPEN (not pinned). |
| 17 | "Until a date…" overflow behaviour | STILL OPEN (label pinned, overflow behaviour not). |
| 18 | Standalone-shift delete confirmation — SCH-DEL-06 | STILL OPEN (not pinned). |
| 19 | Hidden-vs-disabled for View-only — SCH-PERM-02 | STILL OPEN (not pinned). |

**Summary of the ~18/19:** **2 newly resolved/pinned** (#1 "Filters" caption, #7 toast lifetime),
**1 DELTA** (#2 right-click menu labels), **1 explicit discrepancy that persists** (#10 8–17 vs
7 AM–7 PM). The remaining **~15 STAY VIU-confirm** (tenant data, timing thresholds, and behaviours
the prototype doesn't exercise — the new revision doesn't pin them either).

## 4. Case-update deltas vs the 167 cases (for a later AUTHORIZED update pass — NOT now)

**Biggest change — events now count toward CAPACITY (reverses Branko Q1 for capacity):**
The new `_capForDate` code now adds **technician-assigned event hours** to both the per-tech and
the aggregate capacity totals ("aggregate assigned = all shift hours + all technician-assigned
event hours that day"; all-day events consume the full day, timed events consume end−start).
The 2026-07-22 prototype EXCLUDED events from capacity. **Conflict is UNCHANGED** — events still
do NOT participate in overlap/conflict detection.

| # | Case (C-id) | Delta | Type |
|---|---|---|---|
| 1 | **SCH-EVT-08 (C30615)** "event does not count toward capacity **and** does not raise a conflict" | Now **half-wrong**: a tech-assigned event DOES count toward the capacity bar; still does NOT raise a conflict. **Rewrite** to split the two behaviours. | Behavioral rewrite |
| 2 | **SCH-CAP-01 (C30030)** | Capacity bar aggregate now **includes** tech-assigned event hours. Remove/flip the "events-excluded (may change)" note. | Notes/expected |
| 3 | **SCH-CAP-02 (C30031)** | Amber spill can now be driven by events too. Same note flip. | Notes/expected |
| 4 | **SCH-CAP-03 (C30032)** | A tech's own event hours can push them over → OT tag. Same note flip. | Notes/expected |
| 5 | **SCH-CAP-04 (C30033)** | Per-tech hover breakdown now includes event hours. Same note flip. | Notes/expected |
| 6 | **SCH-CONF-01 (C30023)** | Events-excluded-from-conflict is now **firm** (code confirms). Can drop the "may change" hedge. | Notes (firm-up) |
| 7 | **SCH-EVT-01 (C30016)** "right-click 'New Event'" | Menu label is now **"Create Event"**. Rename. | Label |
| 8 | **SCH-REAS-03 (C30054)** "context menu with New Shift, New Event, View Day" | New menu = **"Create Event" + "New Work Order"** only. Rewrite the menu contents. | Label/rewrite |
| 9 | **SCH-REAS-04 (C30055)** "'View Day' in the context menu…" | "View Day" item **no longer exists** in the menu. **Retire/rework candidate.** | Retire candidate |
| 10 | **SCH-REAS-05 (C30056)** "'New Shift' in the context menu…" | "New Shift" item **no longer exists** in the menu. **Retire/rework candidate.** | Retire candidate |
| 11 | **SCH-FILT-01 (C29942)** "'Filter' button…" | Caption is **"Filters"** (plural). Rename. | Label |
| 12 | **SCH-VIEW-01 (C30042)** "'Filter and Display'…" | Control label is **"Filter & Display"** (ampersand, not "and"). Minor rename. | Label (minor) |
| 13 | **SCH-SER-01 (C29987)** faded "continues" label | Literal "continues" not found in the new template — the series-continuation label may have changed. **Re-confirm label** (soft). | Label re-confirm |

**Count: ~13 cases need a wording/label/behaviour change**, of which **2 are retire/rework
candidates** (SCH-REAS-04/05, the removed "View Day"/"New Shift" menu items), **1 is a behavioral
rewrite** (SCH-EVT-08 + the 4 CAP notes), and the rest are label renames.

> **Rule 25 note (spec basis of the menu delta):** SCH-REAS-03/04/05 + SCH-EVT-01 were authored to
> spec §7/§4.10, which lists the right-click menu as "New Shift / New Event / View Day". The new
> DESIGN prototype shows "Create Event / New Work Order" instead. This is a **design-vs-spec
> conflict** — flag to Branko before editing (do not silently retire spec-sourced cases). Same
> latest-wins caution applies to the events-count-toward-capacity reversal (design changed vs
> Branko's earlier Q1 ruling — confirm Q1 is superseded).

## 5. Possible NEW scope surfaced by the new ZIP (flag to Branko — not covered by the 167 cases)

- **Week Export / Print view** — `Schedule Week Export.dc.html` + `schedule-week-view.html` +
  `schedule-export.png` render a printable Department × Technician week grid. **Our spec and all
  167 cases have ZERO export/print coverage.** Ask Branko whether a Week Export / Print feature is
  in V1 scope; if yes, it needs a new case group (later, not now).
- **"New Work Order" cell context-menu shortcut** — right-click a grid cell → "New Work Order"
  (pushes a toast pointing to the Work Orders tab). New shortcut not in our cases; confirm scope.
- **Edit Staff Member / Edit Location modals** (`Edit Modals.dc.html`) — supporting settings
  screens (department, role, salary, billable, location/timezone). These feed the §14.4
  department + §4.2 working-hours inputs but are largely outside the Schedule test scope; no case
  delta unless Branko wants them covered.

## 6. Items that STAY VIU-confirm for the live pass (unchanged by this design)

All §D.1 rows marked STILL OPEN above (tenant enumerations — Status filter list, department names,
Schedule permission naming; timing thresholds — hover delay, auto-scroll buffer, breakpoints,
virtualization; and unpinned behaviours — direct-URL guard, department-less rows, notes scoping,
hidden-weekend-column, now-line on non-today, "Until a date…" overflow, standalone-delete confirm,
hidden-vs-disabled). Plus the **8–17 vs 7 AM–7 PM working-day default discrepancy** (§3 #10) must be
resolved LIVE. Design-pinned ≠ VIU-Verified (Rule 12) — all of the above, including the CONFIRMED
labels, still get a live check at the VIU pass.
