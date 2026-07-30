# Schedule — SPEC DIFF: our baseline (Confluence v18) → CURRENT (Confluence v23)

> **Pulled 2026-07-31.** Page **713031682** "Schedule", space **SHOPVIEW**
> (`/wiki/spaces/shopviewapp/pages/713031682/Schedule`).
> Auth pre-verified `GET /rest/api/3/myself` → **HTTP 200** (Bilal Muzamil), then
> `GET /wiki/rest/api/content/713031682?expand=body.storage,version,history.lastUpdated`
> → **HTTP 200**. Historical bodies pulled with `?status=historical&version=<n>` for
> v17–v22 so every delta could be attributed to the exact version that introduced it.
>
> | | |
> |---|---|
> | **Our baseline** | Confluence **version 18** — 2026-07-22T09:18:11Z (= `build/schedule/requirements.md`) |
> | **Current** | Confluence **version 23** — 2026-07-30T10:40:32Z, by **Branko Cicovic**, no version comment |
> | **Versions behind** | **5** (19, 20, 21, 22, 23) |
> | **Page-body "Version" field** | still reads **1.0** in both — Branko never bumps it. **The Confluence version number is the only reliable version marker for this page.** |
>
> **Baseline proof (5 marker strings, run against every historical body):**
>
> | Marker | v17 | v18 | v19 | v20 | v21 | v22 | v23 | our `requirements.md` |
> |---|---|---|---|---|---|---|---|---|
> | `and Reassign to another technician` (§4.9) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | **✘** | **✔** |
> | `Event time is included in the utilization` (§4.12) | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | **✘** |
> | `Events are not conflict-checked` (§4.11) | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | **✘** |
> | `Hours settings (tech and business hours)` (§4.2) | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | **✘** |
> | `Dark theme` (§11) | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | **✘** |
>
> `requirements.md` matches the **v18** column on all five → baseline = v18 confirmed.
> (v17→v18 added only the `Design` header link — exactly what our own 2026-07-22 note
> recorded: "spec_1 added a Design link, the body is otherwise unchanged".)

---

## 0. Headline

**Nine substantive body changes across the 5 missed versions.** Crucially, **most of
them we already caught** — not from Confluence, but from the Jira epic (SV-8685
stories, 2026-07-27) and the engineering tech plan (2026-07-30). Those passes changed
the **cases** but never updated `requirements.md`, which is why the local spec still
reads as v18.

| # | Delta | Introduced in | Already reflected in our CASES? |
|---|---|---|---|
| D-A | §4.2 **Hours settings** block added (tech + business hours, toggles, per-day editor, "Add hours" split shifts, overlap validation) | **v19** | **YES** — SCH-HRS-01..07 authored 2026-07-27 from SV-8699 |
| D-B | §4.11 **Events are NOT conflict-checked**, "their time still counts toward capacity" | **v19** | **PARTLY** — the not-conflict-checked half is asserted; the counts-toward-capacity half is the **HELD D1** item |
| D-C | §4.12 **Event time IS included in utilization** ("shifts plus events") | **v19** | **NO — this is the HELD D1 item.** Our SCH-EVT-08 / SCH-CAP-01..04 still say events are EXCLUDED |
| D-D | §11 **Dark theme** NFR added | **v19** | **YES** — SCH-EDGE-08 (C38866), authored 2026-07-30 from the tech plan |
| D-E | Header `Design` link gains a **second** design: "Business and Tech hours settings" | **v20** | n/a (metadata) |
| D-F | Header gains an **`Epic`** row (Jira macro) | **v21** | **YES** — epic SV-8685 backfilled onto all cases 2026-07-27 |
| D-G | §4.4 shift block colour: work-order-tied → **default blue + optional per-shift custom colour** | **v22** | **YES** — applied 2026-07-27 (delta D3); SCH-COLOR-02 repaired 2026-07-31 |
| D-H | §4.5/§4.6 spread: **shop closures & public holidays are NOT skipped in V1**; weekend skipping conditioned on business hours; series-banner "break around booked days" removed | **v22** | **YES** — applied 2026-07-27 (delta D2) to SCH-SPREAD-07/08 + SCH-EDGE-05 |
| D-I | §4.10/§7 cell menu: right-click {New Shift, New Event, View Day} → **left-click {Create event, New work order}**; §4.8 now-line label "on hover **over the grid**" | **v22** | **YES** — applied 2026-07-27; SCH-REAS-04/05 removed, SCH-REAS-03/06 + SCH-EVT-01 reworded |
| **D-J** | **§4.9 shift detail modal: "and Reassign to another technician" DELETED from Actions** | **v23 (2026-07-30 — brand new)** | **YES, pre-emptively** — SCH-MODAL-08 already says "Delete only, no Reassign", but it was **HELD as D4** pending Branko. **The spec now settles it.** |

**Net new information for us: exactly two items — D-C (D1) and D-J (D4). Both are the
two HELD items.** Everything else is confirmation that our Jira/tech-plan-driven case
edits were right.

---

## 1. ADDED (present in v23, absent from our v18 baseline)

### A1 — §4.2 "Hours settings (tech and business hours)" — whole new block *(v19)*

> "**Hours settings (tech and business hours).** Working hours are defined in two
> places: a technician's custom schedule in Edit Staff Member, and the shop's business
> hours in Edit Location. Both use the same pattern:
> - **Behind a toggle, off by default.** Each section sits behind a toggle ("Set custom
>   hours for this technician" / "Set business hours for this shop"). The per-day editor
>   appears only when the toggle is on. A technician with no custom hours inherits the
>   shop's business hours (per the hierarchy above).
> - **Per-day editor.** One row per day (Mon–Sun): day name, with From → To ranges on
>   the right. Each day starts with a single range; "Add hours" appends more to support
>   split shifts, each removable. Added ranges start empty so the user explicitly sets
>   the times.
> - **Overlap validation.** If a day's ranges overlap, the offending range is flagged in
>   red with an inline message ("These hours overlap. Adjust the times so they don't
>   conflict.") and Save is disabled until it is resolved. Incomplete rows (empty
>   From/To) are ignored by the check."

**Impact:** none new — this is the source text behind SV-8699, from which SCH-HRS-01..07
were authored 2026-07-27. **It does, however, settle two of the still-open NQ questions
in Branko's favour-of-the-spec:**
- **NQ-3 (where do the hours live?)** → the spec says **Edit Staff Member** + **Edit
  Location**, NOT a separate "Schedule Settings" page in Administration. Our
  SCH-HRS-02..06 are homed in Edit Staff Member / Edit Location = **spec-correct**. The
  tech plan's `ScheduleSettings.vue` conflicts with the spec here; that stays a question
  for Branko (NQ-3), but the spec's current position is now on record.
- **NQ-4 (split shifts?)** → the spec **explicitly** says "'Add hours' appends more to
  **support split shifts**". Our SCH-HRS-05/06 (and merged-away SCH-HRS-07) are
  **spec-correct**; the tech plan's one-range-per-weekday data model conflicts with the
  spec. NQ-4 stays a question, but the spec's position is on record.

### A2 — §4.11 events are not conflict-checked *(v19)*

> "**Events are not conflict-checked for now:** an event overlapping a shift (or another
> event) does not raise a conflict. Their time still counts toward capacity (see §4.12)."

### A3 — §11 Dark theme NFR *(v19)*

> "**Dark theme.** The Schedule supports a user-selectable Light / Dark theme, chosen
> from the user menu and persisted per user. It is built on the design-system color
> tokens, so surfaces, borders, text, and accents remap automatically; elevation/shadow
> tokens also swap so depth reads correctly on dark surfaces."

**Impact:** confirms SCH-EDGE-08 (C38866) is now **spec-backed**, not merely
tech-plan-pinned. Worth a `refs`/notes upgrade.

### A4 — header metadata rows *(v20, v21)*

`| Design | Schedule , Business and Tech hours settings |` and `| Epic | [macro:jira] |`.

---

## 2. CHANGED (wording differs between our v18 baseline and v23)

### C1 — §4.12 capacity now INCLUDES event time *(v19)* — **the D1 HELD item**

| | |
|---|---|
| **v18 (our baseline)** | "When enabled in View Options, each day column header shows a capacity bar. Fill represents aggregate utilization; overtime is a separate per-technician signal, and the two are independent." … "**Blue fill:** aggregate technician-hours booked divided by total available (the sum of all techs' working hours)." |
| **v23 (current)** | "…the two are independent. **Event time is included in the utilization total alongside shifts, so meetings and training consume capacity even though they are not conflict-checked (see §4.11).**" … "**Blue fill:** aggregate technician-hours booked **(shifts plus events)** divided by total available…" |

### C2 — §4.4 shift block colour *(v22)*

| | |
|---|---|
| **v18** | "…with **color tied to the work order (so blocks from the same order share a color)**:" |
| **v23** | "…with a **default blue color (users can optionally assign a custom color per shift via the color picker in the detail modal, see §10)**:" |

### C3 — §4.5 spread skipping *(v22)*

| | |
|---|---|
| **v18** | "Uses the technician's own working hours. **Automatically skips weekends and shop closures, so the end date is emergent.**" |
| **v23** | "Uses the technician's own working hours. **Automatically skips weekends when business hours are not set for them. Shop closures and public holidays are not skipped in V1..**" *(sic — double full stop in the source)* |

**Note for NQ-1:** the CURRENT spec (v22/v23) says closures are **NOT** skipped in V1.
The tech plan (dated 2026-07-22, handed over 2026-07-29) says closures ARE skipped.
**Last-update-wins now favours the spec** — the spec text is v22, 2026-07-27, i.e.
NEWER than the plan's own date, and it is still standing unchanged in v23 (2026-07-30).
Our SCH-SPREAD-07/08 + SCH-EDGE-05 already say "not skipped" = **spec-correct**. NQ-1
remains worth confirming with Branko but our cases are on the right side of it.

### C4 — §4.6 linked-series banners *(v22)*

| | |
|---|---|
| **v18 month view** | "…a faded 'continues' label on later weeks, empty weekend columns, **and visible breaks around skipped or booked days**." |
| **v23 month view** | "…a faded 'continues' label on later weeks, empty weekend columns **(when business hours are not set for weekends)**." |
| **v18 week view** | "…a 'week N of M' cue, **and a break around any day the technician is otherwise booked**." |
| **v23 week view** | "…a 'week N of M' cue." |

### C5 — §4.8 now line *(v22)*

| | |
|---|---|
| **v18** | "**Now line.** A vertical indicator showing the current time, with a label on hover." |
| **v23** | "…with a label on hover **over the grid**." |

### C6 — §4.10 / §7 cell menu *(v22)*

| | |
|---|---|
| **v18 §4.10** | "Create via a **right-click context menu on any cell**, or by clicking empty grid space in day view." |
| **v23 §4.10** | "Create via **left-click on empty grid space, which opens a menu with 'Create event' and 'New work order'..**" *(sic)* |
| **v18 §7** | "**Right-click context menu on any grid cell: New Shift, New Event, View Day.**" |
| **v23 §7** | "**Left-click on empty grid space opens a menu with: Create event, New work order.**" |

---

## 3. REMOVED (in our v18 baseline, deleted by v23)

### R1 — §4.9 modal "Reassign to another technician" *(deleted in **v23**, 2026-07-30)* — **the D4 HELD item**

| | |
|---|---|
| **v18 (our baseline)** | "- **Actions: Delete (series-aware, §7) and Reassign to another technician.**" |
| **v23 (current)** | "- **Actions: Delete (series-aware, §7)**" |

This is the **single change made in v23** and it is the newest edit to the page. It
retires the design-vs-spec conflict that has held SCH-MODAL-08 (C30015) since
2026-07-22: the spec itself has now dropped the modal Reassign action, matching the
design prototype, the engineering tech plan, and our current case wording.

### R2 — §4.6 "break around booked days" (see C4) and §4.5 "shop closures" skipping (see C3)

Recorded as CHANGED above because the surrounding sentence survived.

---

## 4. What is NOT in the current page (unchanged from our baseline note)

- **No change-log section** and **no open-questions section** in the page body — the
  version history has to be reconstructed from Confluence version metadata (done, in
  `Schedule-spec-current.md`).
- **No Week Export / print view** anywhere in v23 — not in §6 Grid toolbar, not in §9
  View options, not in §15 Future considerations. This independently corroborates
  Branko's 2026-07-31 answer to Q3 ("No. There is nothing about this in the PRD, not in
  the future requirements.").
- **No API/backend contract** in the page body (§8 Data model is entity-level only) —
  Q7's premise still holds; the tech plan remains the only backend description.
- §14 Roles and permissions still has **no WRITE-scoping / own-data rule** → NQ-5 is
  still genuinely open (spec silent, per Rule 15).
- Default working day **7 AM – 7 PM** is unchanged in §4.2/§4.8 → corroborates Branko's
  Q5 answer B.

---

## 5. Verification / honesty notes

- Every quoted string above was taken from the live Confluence storage-format body (or a
  historical body) pulled this run — not from memory, not from a prose summary
  (Rule 15).
- Deltas were attributed to a version by pulling **each** intermediate body (v17→v22)
  and diffing pairwise, so no delta is mis-dated.
- Two source typos are reproduced verbatim (`in V1..` and `'New work order'..`) — do NOT
  "fix" them silently in case wording; they are the spec's own text.
- **This is a spec read only.** Nothing here is live-build-verified — Schedule still has
  no QA branch (OQ-3), so every case remains **VIU-Pending** (Rule 12: spec-pinned and
  design-pinned ≠ VIU-Verified).
