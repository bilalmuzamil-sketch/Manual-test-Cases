# Schedule full live VIU — FINDINGS

**Read `BUILD-MARKER-MOVED.md` first.** This pass spans **two different builds**; no single
build was ever observed across all 168 cases.

| | Cases | Build checked against | Date |
|---|---|---|---|
| Batches 1–5 | **97** | `v3.5-d122eef` — **superseded, no longer exists** | 8/5/2026 |
| Batch 6 + part of 7 | **29** | `v3.5-7ec992f` | 8/6/2026 |
| Rest of 7, all of 8 and 9 | **42** | **not yet observed** | — |

**126 of 168 carry a verdict; 42 do not.** Nothing was inferred for the 42, and nothing from
the first 97 has been quietly upgraded to look as though it was seen on the current build.

## Verdict tally (126 recorded)

| Family | Count |
|---|---|
| PASS (incl. label-fix, hold-lifted, over-specified-case, was-expect-fail) | **93** |
| DEVIATION (incl. new, partly-fixed, stale-text, wrong-marker) | **29** |
| HELD | **3** |
| NOT OBSERVED, reason recorded | **1** |

## Sources re-established this session

* **Specification CURRENT at Confluence version 23**, last edited 30 July 2026 by Branko
  Cicovic — before our ingest. Proven by content: the live body (58,584 chars) was split into
  335 sentences over 25 characters and each searched in our mirror; **5 were not found and all
  5 are the documented boundary artefacts** (the page header block plus four heading/sentence
  merges). **0 requirements changed.** The **Rule-31(a) trap is confirmed again** — the page
  body's own "Version" field still reads **1.0** while the Confluence version is **23**.
* **Our ten tickets, read live one by one: all still Open**, resolution null, priority Low.
  Nine are `Story Defect`s under their owning stories; **SV-8848 has no parent**, exactly as
  Mudassir Qamar left it — not reversed. **SV-8857 has moved to `TESTING QA`** (updated
  2026-08-05 19:00:57), the only movement among the ten, and it moved *before* the 22:49
  deploy, so a fix for it may be in this build.
* **A fix shipped without its ticket being closed** — SV-8851, see SCH-VIEW-09.

## Verdicts that CHANGED

### SCH-VIEW-09 = C30050 — DEVIATION → **PASS. Fixed.**
Previously "toggling Tech Hours produced no observable change at all". Now the toggle appends
each technician's hours to their row header — `Brittany Anderson | HD Technician | 7:00 AM –
7:00 PM` — and shows **"Not working"** for the technician with no configured hours. Values
match the stored windows (420–1140 minutes). Off removes them. **All three items pass.**
**SV-8851 is still Open and should be closed.**

### SCH-DEL-08 = C30064 — our case was OVER-SPECIFIED, the build is fine
Our case asserts "~7 seconds with Undo; ~4 seconds without". **Neither half is in the spec.**
§7 says "The toast persists for **4 to 7 seconds**, stays while the cursor is over it", and in
the same paragraph "**Every** create, delete, move, and reassign action produces a toast **with
an Undo option**" — so a no-Undo toast should not exist. Consistent with that, all four actions
produced Undo toasts and none without could be found to time. Measured **~6.8s**, inside the
spec window. **PASS**; the unsourced split is deleted, not replaced by an observation
(Rules 25/42/57).

### SCH-REAS-06 = C38855 — our case was OVER-SPECIFIED
Our case demands "a toast / prompt pointing to the Work Orders tab". The spec says only
"Left-click on empty grid space opens a menu with: Create event, New work order" and **nothing**
about what choosing it does. The build opens a **New Work Order dialog in place** (Customer +
Add, Asset + Add, "Asset Here?", Save) — *more* than our case asked for. **PASS**; the
unsourced parenthetical is removed.

## Deviations found this session

### SCH-REAS-07 = C43556 — series members still cannot be reassigned · SV-8867 · STILL REPRODUCES
Dragging a series block ("Joshore Farms | 70 | Service - Air filter | Part of a series") from
Andrew Wade to Colleen Guerrero produced **no dialog, no toast, no change**. **Controlled
contrast in the same session:** an ordinary shift dragged between the same rows *does* open
`Reassign shift → "Move this shift to Ayesha Khan AK on Mon, Mar 22?"` and completes. Spec §7
requires drag reassignment with a confirmation modal and §8.2 makes a series a grouping over
ordinary shifts. The case keeps the documented expectation (Rule 57).

### SCH-VIEW-05 = C30046 — Business Hours defaults ON · SV-8827 · STILL REPRODUCES
Six toggles offered; five defaults correct. **Business Hours defaults ON; §9 requires OFF.**
**A correction to the ticket:** SV-8827 also claims Tech Hours starts ON. **It does not** — it
starts OFF, which is what the spec wants. That half of the ticket is wrong.

### SCH-VIEW-06 = C30047 — the Business Hours toggle shades nothing · **NOW FILED as [SV-8923](https://shopview.atlassian.net/browse/SV-8923)**
§9/§4.8: "With the toggle on, the hours OUTSIDE the working day are shaded with a grey overlay."
In Day view on Thu 6 Aug 2026 with the toggle **on** (its default) the timeline from 12 AM to
11 PM renders **uniformly white**. Measured ON, OFF and restored: the only shaded element in the
whole calendar is the department divider (`fc-resource-timeline-divider fc-cell-shaded`), count
**2 in all three states**. Confirmed on the screenshot, not only by class name. **Distinct from
SV-8827**, which is about the default state, not about the toggle having no effect.
**FILED 2026-08-06 as [SV-8923](https://shopview.atlassian.net/browse/SV-8923)** —
`Story Defect`, parent SV-8700, priority Low, `relates to` SV-8700, no Product Area.
Duplicate search run first over four queries; the nearest three (SV-8827 default state,
SV-8837 and SV-8915 opening scroll position) are all a different assertion.

### SCH-START-07 = C29975 — assigning an unassigned shift moves its start six hours · **NOW FILED as [SV-8924](https://shopview.atlassian.net/browse/SV-8924)**
Items 1 and 2 pass (shift moves to the technician; line roster gains them). **Item 3 fails:**
on assignment to Kellie Ayers the stored start moved from `2026-08-08T13:00:00Z` (07:00 local)
to **`2026-08-08T07:00:00Z`** = **01:00 local**, outside her own working hours. Her configured
start is 07:00, so the app took the right number in the wrong timezone frame. **Not a display
problem — the stored instant moved.** SV-8848 was then read in full before filing: it
describes times being *shown* six hours late (block position, hover summary, shift window,
now-marker), whereas this is the stored value being *written* six hours early. Same six hours,
opposite direction — most likely one missing conversion on read and another on write, but
separately testable, because fixing the display leaves records already damaged by the assign
path still wrong. **FILED 2026-08-06 as
[SV-8924](https://shopview.atlassian.net/browse/SV-8924)** — `Story Defect`, parent SV-8688,
priority Low, `relates to` SV-8688 and SV-8848, no Product Area.

### SV-8848 still reproduces
An unassigned shift stored at `13:00Z` (07:00 local) shows **"13:00"** in its modal; a shift
dropped at the 10 AM column in Day view renders at about **4 PM**. Three start-time cases carry
a tester note to ignore it; **SCH-START-04 = C29972 does not and needs the same note** — without
it a tester fails a build whose stored value is correct.

## Two near-misses — false defects avoided by looking twice

1. **A cross-technician drag looked completely broken** — three attempts moved nothing and
   produced no toast. Each had in fact **opened a "Reassign shift" confirmation that was never
   confirmed**. The drag works. (Rules 12/44.)
2. **The Unassigned lane looked absent** — not in the visible grid, not in Day view, the word
   never on screen; three cases looked like "not built" against a requirement the spec states
   four times. It is **real**: it sits **below every technician row**, reachable only by
   scrolling, and is **only rendered in a date range that already contains an unassigned
   shift**. In an empty week it is absent when idle, during a drag, and when dragging to the
   bottom (21 lanes both ways).

**Point 2 deserves engineering's attention even though the case passes:** §4.2 says unassigned
shifts *are created by* dropping onto that row — but in a week with none, there is nothing to
drop onto. Recorded as an observation, not filed.

## Sources moved after this pass — read `SESSION-BLOCKED-2026-08-06.md` §5

Checked live on 2026-08-06. **Six new Schedule tickets** appeared on 5 Aug evening, after
the batch-1–5 observations were taken. Three are from **Sasha Grosman**, raised in a
**Schedule design review with Fabian on 5 Aug** and **scoped for V1**:
[SV-8915](https://shopview.atlassian.net/browse/SV-8915) (view opens at midnight — touches
**SCH-DAY-01 = C30001**, which we carry against SV-8837, and it **states the opening
hierarchy in full**, a documented expectation our cases do not yet reflect),
[SV-8916](https://shopview.atlassian.net/browse/SV-8916) ("Add Existing Work Order" button
missing — **no case of ours identified, a possible gap**),
[SV-8917](https://shopview.atlassian.net/browse/SV-8917) (conflict label wording).
Three more are Ayesha Khan's: [SV-8922](https://shopview.atlassian.net/browse/SV-8922),
[SV-8921](https://shopview.atlassian.net/browse/SV-8921),
[SV-8919](https://shopview.atlassian.net/browse/SV-8919) — **candidate coverage gaps, not
authored**. All three Sasha tickets cite a **design link**, so the design source may have
moved since our ingest; not re-checked.

## Honest limits

* **42 of 168 have no verdict** — rest of batch 7 (Toolbar search, Colour, Working Hours,
  Keyboard), all of batch 8 (Permissions, Edge Cases), all of batch 9 (Regression, API).
* **The 97 verdicts from batches 1–5 sit on a build that no longer exists.** The 25 deviations
  among them are the exposed ones. We did not look, and we do not guess.
* **SCH-START-01 = C29969 could not be settled** — every technician with configured hours has
  the identical 07:00–19:00 window, byte-for-byte the general default, so a 07:00 start proves
  nothing about precedence. Needs one technician given a genuinely different window.
* **SCH-START-02 = C29970 stays HELD** — the shop has no business hours set, and turning the
  Edit Location toggle on changes a shared setting that would invalidate batch 5's
  working-hours observations.
* **NO TESTRAIL WRITE HAS BEEN MADE**, deliberately: the write pass begins only once all 168
  are observed. Re-proven on 2026-08-06 by re-reading all 168 live and comparing **content**
  field by field (0 differences, and 0 `updated_on` movement) — not by trusting the timestamp.
* **The 2026-08-06 resume attempt observed NOTHING** — the Schedule sign-in returns HTTP 401
  `sso_required` and `quick-login` is barred. The 42 are still 42.
* **The branch is not declared final, so every verdict is PROVISIONAL** (Rule 49).
