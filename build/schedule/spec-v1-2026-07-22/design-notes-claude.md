# Schedule — Claude Design Capture (authoritative design, 2026-07-22)

> **Source:** `/root/.claude/uploads/dd1d42ba-2c47-5229-9b17-b8f94e3eb99a/72d051ef-Schedule.zip`
> extracted to `/tmp/schedule-design/`. This is a **Claude.ai design export** (a coded
> interactive HTML/JS prototype + a rendered PRD + supporting screenshots), NOT a Figma
> file. Per PO Branko (Q0), **the linked Claude prototype `Schedule.dc.html` IS the
> authoritative design** ("Design added to the doc"). This project is therefore NO LONGER
> "spec-only" — a design now exists.
>
> **Standing Rule 12 caveat:** a design prototype is still NOT the live build. Labels
> captured here are now **design-pinned** (we have an authoritative source to author
> build-accurate wording against, instead of inventing/flagging as unknown), but the
> FINAL VIU pass must still confirm each label against the real build once the QA branch
> exists (Rule 9/10). "Pinned by design" ≠ "VIU-Verified".

---

## 0. Inventory of the design export (185 files total)

| Item | What it is | Authoritative? |
|---|---|---|
| `Schedule.dc.html` (349 KB) | The interactive coded prototype — the full Schedule screen, all views, modals, popovers, toolbar, sidebar. React-like `<sc-if>/<sc-for>` templates + JS state/logic. | **YES — authoritative (Q0)** |
| `Schedule PRD.dc.html` / `Schedule PRD-print-*.dc.html` | The PRD rendered as HTML (same text as the spec). | Reference |
| `Line Drag Scheduling.dc.html`, `Line Picker Popover.dc.html` | Focused sub-prototypes of the drag flow / scope picker. | Supporting |
| `Edit Staff Member.dc.html`, `Hours Settings.dc.html` | Staff-record + working-hours settings screens (department, Time Clock, working hours/weekdays). | Supporting |
| `screenshots/*.png` (44) | Rendered captures of the prototype (day/week/month, modal, spread, popover, delete-scope, conflicts, capacity tooltip, series banners, lane stacking). **SOME are stale — see §5.** | Mixed |
| `uploads/*.png` (84) + `*.svg` icons | Screenshots embedded in the PRD + nav icons (Work Order, Filter, Settings). | Reference |
| `_ds/shopview-design-system-*/` | The ShopView design-system bundle (colors/type CSS, Inter fonts, JS). | Design system |

Method: read the authoritative prototype's template + JS to extract exact on-screen
labels, controls, states, and the capacity/conflict LOGIC; cross-checked against the
current-state screenshots; viewed representative frames directly.

---

## 1. Top-level layout & navigation (confirms §1, §3, §6)
- Global nav (left→right): **Work Orders · Schedule · Customers · Parts · Reports**, a
  global **Search** box with a **⌘K** hint, and a user chip ("Heavy Duty" org, "AK" avatar).
  Confirms Schedule is a top-level nav item (SCH-NAV-01).
- Screen split: **left work order sidebar** + **main schedule grid** (SCH-NAV-02).
- Grid toolbar: **Today** button · **‹ ›** nav arrows · **date-range label** (e.g.
  "Jul 12 – 18, 2026" week / "July 2026" month) · **conflict pill** ("13 conflicts" with a
  warning triangle) · search icon · a **Filter and Display** icon · a **View Options** icon ·
  **Day / Week / Month** segmented control (SCH-TOOL-*, SCH-NAV-03).
- Grid rows grouped under collapsible **department** headers ("SERVICE", "ADMINISTRATION")
  with a **"Department"** row-header label; each tech row shows avatar + name + role
  (e.g. "Aaron Keating / Lead Technician", "D. Martinez / Diesel Tech"). Confirms
  department grouping and **no Tech/Dept toggle** (SCH-NAV-04, SCH-NAV-06).

## 2. Sidebar (confirms §3.1, §5)
- **"Search work orders"** placeholder input (SCH-WOL-03..06, SCH-FILT-06).
- A **"Filters"** button with a filter icon (screenshot shows the plural "Filters"; the
  spec/prototype template uses "Filter" — **VIU-confirm the exact caption**). **No
  Assigned/Unassigned tabs** — assignment is a filter option (confirms SCH-WOL-01,
  SCH-FILT-02; the removed-tabs ruling is already reflected).
- WO card anatomy (matches §3.1): WO number top-left in accent (e.g. "S-490"),
  "N lines · Xh Est." top-right, customer bold ("ABC Truck Lines"), unit ("39104"),
  lead-tech row (avatar "JM" + "Jackie Moore"), colored status left-border.
- Line drill-down: back control, "Search lines" placeholder, **"All N / Unscheduled N"**
  chips with counts, per-line drag handle, title, hours, avatar-stack roster, **"Needs techs"**
  badge on unstaffed lines (SCH-LINE-*).
- Mini calendar: month/year picker, collapsible chevron, today/selected highlight (SCH-MCAL-*).

## 3. Grid, blocks, views (confirms §3.2, §4.4, §4.6, §4.7)
- **Shift block** = tinted color-filled block with a colored left rail; text lines:
  customer (+ conflict warning icon), unit, (VIN line when toggle on), and line name or
  **"N Lines"** (SCH-BLOCK-*). Confirmed in code: block shows `customer / unit / lineName|'N Lines'`
  and **NO WO number, NO $ figure** on the block.
- **Event block** = white/neutral outlined card, calendar-icon chip, event name + time
  range; structurally distinct from shifts (SCH-EVT-06). Screenshot shows a green-tinted
  event "Fleet Sa… / 10:00 AM – 1…" with a calendar icon.
- **Week view**: 7 day columns with per-day capacity bars + **"OT"** tags in headers.
- **Month view**: day cells with shift chips ("P… 84271 ⚠"), **"+N more"** overflow
  ("+1 more", "+3 more", "+6 more"), per-day capacity bars, "15 conflicts" pill.
- **Series banner** (month): connected bar with faded **"↳ continues"** labels on later
  weeks (SCH-SER-01..03). Delete-scope modal calls it **"Part of a 6-week job · 20 shifts"**.
- **Lane stacking**: 3-lane cap; day lane height grows when VIN on
  (`DAY_LANE_H = schedVin?96:80`, `MAX_CHIPS = schedVin?2:3`) — confirms SCH-DAY-* / SCH-LANE-*.

## 4. Modals & popovers (confirms §4.3, §4.5, §4.9, §7)
### 4a. Scope picker (multi-line drop) — SCH-SCOPE-*
- **"Schedule whole work order"** pinned row (accent color) with line count + total hours.
- Individual line rows (fast single-tap). **"Select multiple"** toggles checkboxes with a
  confirm bar **"Create shift · N lines · Xh"**, a **"Select all" / "Unselect all"** shortcut,
  and **"Cancel"**. Whole-order label reads **"Whole order · Xh"**. All confirmed in JS.

### 4b. Multi-day spread — SCH-SPREAD-*
- Header **"STEP 2 · SPREAD"** + scope + **"Change scope"** back-link.
- Single selector: **"Full estimate"** (default) · **"1 week"** · **"2 weeks"** ·
  **"Until a date…"** (reveals a finish-by date field) · **"Specific hours…"** (reveals an
  hours stepper). Confirmed in JS options — **matches the spec's single-selector model**
  (NOT the "By hours / By end date" tabs seen in the stale `spread.png`, see §5).
- Start-date field; uses the technician's working hours; **Preview** collapsed
  one-liner "N shifts · <start> → <end> · skips weekends + N closures", expandable to a
  week-by-week breakdown.

### 4c. Shift detail modal — SCH-MODAL-* (CRITICAL for Q3)
Header: customer, unit · asset, VIN (when present), a **Delete (trash) icon**, a **close
(×) icon**. Body (in order, confirmed in the authoritative template):
- **"Time Logged"** progress row.
- Conflict banner "Scheduling conflict" + reason list + **"Adjust"** action (when conflicted).
- **"Scheduled"** date · **"Time"** start/end time pickers (15-min) · **"Technician"**.
- **"Work Order Lines"** section — line count + scope text + per-line rows showing
  **line number, title, hours, status pill ONLY**. **NO labor figures and NO total $ are
  rendered.** (The prototype's underlying line data carries `total:'$612.40'` etc., but the
  authoritative modal template does NOT display it.) → **Confirms Q3: no total $ shown.**
- Color picker (editable per-shop labels; §10).
- **"Notes"**: add / edit / delete.
- **NO "Reassign" button and NO "Open Work Order" button** in the authoritative modal —
  the ONLY actions are Delete + close. → **Confirms the Reassign-in-modal removal** and Q3.

### 4d. Reassignment (drag only) — SCH-REAS-01
- Reassignment is **drag a block from one tech row to another**, which opens a
  **cross-tech confirmation modal** ("…move to <tech> on <date>?", Cancel / Confirm).
  There is **no Reassign action in the shift modal** (§4d confirms the removal).

### 4e. Delete-scope modal — SCH-DEL-*
- Title **"Remove from series"**, "Part of a 6-week job · 20 shifts", three options each with
  a **"returns Nh"** chip and a consequence line:
  **"This shift only" (returns 8h)** · **"This and everything after" (returns 80h)** ·
  **"The whole series" (returns 160h)** · **"Cancel"**. Exactly matches spec §7.

## 5. Conflict & capacity LOGIC read from the prototype code (CRITICAL for Q1 & Q2)
- **Capacity `_capForDate(iso)`**: iterates **`state.shifts` ONLY** — capacity/aggregate
  hours are computed from SHIFTS; **events are NOT included**. Capacity = Σ(each tech's
  working hours), assigned = Σ shift block durations. → **Confirms Q1 (events excluded from
  capacity).**
- **Conflict `_conflictReasons(shift)`**: iterates **`state.shifts` ONLY** for overlap
  ("Double-booked with <customer>"); **events do NOT create or participate in conflicts**. →
  **Confirms Q1 (events excluded from conflict).**
- **BUT the prototype's weekend/hours conflict test is SIMPLIFIED/hardcoded**: weekend =
  `dow===0||dow===6` (static Sat/Sun, "Scheduled on a weekend (outside Mon–Fri)");
  before/after hours = fixed **`<8` / `>17`** ("Starts before working hours (8:00 AM)" /
  "Extends past working hours (5:00 PM)"). This does **NOT** implement **Q2** (per-tech
  configured working weekdays+hours, hierarchy Tech > Business > Default). **Q2 is Branko's
  authoritative ruling → the expected results follow Q2; the prototype simplifies it →
  confirm the real hierarchy LIVE at VIU.** (Capacity DOES use per-tech `t.hours.end -
  t.hours.start`, so per-tech hours exist in the model.)

## 6. VIN behaviour — RESOLVES the §4.13-vs-§9 inconsistency
- The Filter-and-Display toggle is labeled **"VIN Number"** (not just "VIN") and it drives
  the **shift-block VIN line + lane height ONLY** (`schedVin` → block line + taller lanes).
- The **hover tooltip shows VIN unconditionally when the WO has one** (code:
  `unitAsset = unit · asset (+ ' · VIN '+vin if vin)`), i.e. **NOT gated by the VIN toggle**.
- The **modal always shows VIN**.
- → **The design RESOLVES the inconsistency in favour of §4.13**: the tooltip always shows
  VIN; the toggle affects the BLOCK only. §9's implication that the toggle also gates the
  tooltip is superseded by the design (latest-wins). Exact toggle label = **"VIN Number"**.

## 7. Conflict-reason wording pinned by the design (differs from the spec's type NAMES)
The spec §4.11 lists conflict *type names* ("Double-booked / Weekend shift / Before hours /
After hours"); the design surfaces them as *reason sentences*:
- "Double-booked with &lt;customer&gt;"
- "Scheduled on a weekend (outside Mon–Fri)"  *(reframe to per-tech working days per Q2)*
- "Starts before working hours (8:00 AM)"  *(per-tech start per Q2)*
- "Extends past working hours (5:00 PM)"  *(per-tech end per Q2)*
→ Author the tester-facing wording to the design's reason sentences, adjusted for the Q2
hierarchy; confirm live.

## 8. Staff / hours settings (supporting screens — confirm §14.4, §4.2)
- `Edit Staff Member.dc.html` + `Hours Settings.dc.html` show department assignment, a
  **Time Clock** setting, and per-tech **working hours + working weekdays** — the inputs the
  Q2 conflict hierarchy and the §4.2 start-time hierarchy depend on (SCH-PERM-10/11, SCH-START-*).

## 9. STALE / superseded renders (do NOT author to these)
Some `screenshots/*.png` are earlier iterations that show now-REMOVED elements (they predate
the Q&A rulings and the Q3 change). Authoritative = `Schedule.dc.html`; treat these as history:
- `modal-v2.png`, `modal-approved.png`, `modal-estimate-*.png`, `dropdown.png` — show the modal
  WITH **"$2,180.00" total, a "Labor" row, and an "Open Work Order" button** → superseded by Q3
  (no $, no labor row, no Open-WO button in the authoritative modal).
- `popover-v4.png`, `spread.png` — show the removed **"Assigned (5) / Unassigned (3)" sidebar
  tabs**, the removed **"Tech | Department" grid toggle**, and a different **"By hours / By end
  date"** spread UI with "All remaining" → all superseded (authoritative uses filter-not-tabs,
  no toggle, and the single-selector spread).
Current-state renders that DO match the authoritative build: `week-view.png`, `month-view.png`,
`delete-scope.png`, `day-view.png`, `day-now.png`, `day-overflow.png`, `series-month.png`,
`series-week.png`, `cap-tooltip.png`, `conflicts.png`, `month-lanes*.png`.
