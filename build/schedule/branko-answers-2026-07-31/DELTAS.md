# Schedule — CONSEQUENCES of Branko's 2026-07-31 answers + the v18→v23 spec diff

> **Input 1:** `answers-ingested.md` (Branko's answered 2026-07-27 sheet — 6 answered, 1 declined).
> **Input 2:** `../spec-current-2026-07-31/SPEC-DIFF.md` (live Confluence **v23** vs our **v18** baseline).
>
> **Authority precedence used throughout (Rule 33):** PO ruling → QA-lead ruling → our
> live-observed findings → a reviewer's spec-reading. Within a tier, newest wins (Rule 32).
> **Branko is the Schedule PO, so his 2026-07-31 answers sit at the TOP tier and outrank the
> engineering tech plan, the design prototype, and stale Jira story text** (Rule 30: engineering
> intent never overrules product truth).
>
> **Nothing here is live-build-verified.** Schedule has no QA branch (OQ-3), so every case stays
> **VIU-Pending** (Rule 12: spec-, design-, plan- and PO-pinned ≠ VIU-Verified).

## Classification tally

| Class | Count | Notes |
|---|---|---|
| **APPLY-NOW** (clear ruling → edit now) | **21 cases** | 15 need a TestRail `update_case` (title/preconds/steps/expected/refs changed); 6 are **notes-only = local only** (the executor does not push `notes`) |
| **NEEDS-NEW-CASE** | **0** | deliberate — see §6. Every ruling either rewrites an existing case or resolves a note. Authoring filler here would be exactly the slop Rule 28 exists to prevent |
| **RETIRE-CANDIDATE** | **1 case** | SCH-EXP-01 (C38853) Week Export — **HELD for user authorization, NOT deleted** |
| **STILL-AMBIGUOUS** (back to Branko / dev) | **10 questions** | 3 brand-new sub-questions his answer opened + Q7 re-route + the 5 unanswered NQ-1..NQ-5 + 1 migration heads-up |
| **NO-CHANGE** (confirmation only) | **6 cases** | already written the answered way; recorded so the confirmation is auditable |

---

## 1. Q1 → D1 · events count toward capacity · **HOLD LIFTS** · answer **A**

**Branko, verbatim:** *"A) §4.12 PRD is explicit: 'Event time is included in the utilization total
alongside shifts, so meetings and training consume capacity.' A 2-hour meeting consumes 2 hours of
capacity. Note the split in §4.11: events count toward capacity but are not conflict-checked."*

**Spec basis (Rule 25 — verbatim, from the live v23 body):**
- §4.12: *"Event time is included in the utilization total alongside shifts, so meetings and
  training consume capacity even though they are not conflict-checked (see §4.11)."* and
  *"**Blue fill:** aggregate technician-hours booked **(shifts plus events)** divided by total
  available…"*
- §4.11: *"Events are not conflict-checked for now: an event overlapping a shift (or another event)
  does not raise a conflict. Their time still counts toward capacity (see §4.12)."*
- Both added in Confluence **v19 (2026-07-23)** — after our v18 baseline, which is why our cases
  never saw them.

**What our cases say today — and why it is now wrong.** This is a **direct reversal**: our cases
were written to Branko's earlier "events do NOT count" answer of 2026-07-22.

| Case | C-id | Change | Class | Push? |
|---|---|---|---|---|
| SCH-EVT-08 | [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) | **Title + Steps + Expected + refs + notes.** Title today: *"An event does not count toward a technician's capacity bar and does not raise a conflict"* — asserts the opposite of the ruling. Expected 1 today: *"Adding the event does NOT change the capacity bar fill"*; Expected 3: *"Only shifts drive capacity and conflicts."* → rewrite to: event hours DO raise the fill, and the event still raises NO conflict | APPLY-NOW | **YES** |
| SCH-CAP-01 | [C30030](https://shopview.testrail.io/index.php?/cases/view/30030) | **Expected 1** gains the spec's own parenthesis: booked = *"shifts plus events"*. Notes drop *"events do NOT count toward capacity"* | APPLY-NOW | **YES** |
| SCH-CAP-02 | [C30031](https://shopview.testrail.io/index.php?/cases/view/30031) | **Notes only** — drop *"Events are excluded from the capacity aggregate"* (the amber-spill behaviour itself is unchanged; event hours are simply another way to exceed capacity) | APPLY-NOW | no (local) |
| SCH-CAP-03 | [C30032](https://shopview.testrail.io/index.php?/cases/view/30032) | **Notes only** — drop *"The OT calculation is over SHIFT hours only; events do not count"*. **Do NOT replace it with the opposite:** §4.12 calls OT *"a separate per-technician signal, and the two are independent"* and never says whether event hours feed the OT test. **Spec silent → VIU-confirm** (new question A1) | APPLY-NOW | no (local) |
| SCH-CAP-04 | [C30033](https://shopview.testrail.io/index.php?/cases/view/30033) | **Notes only** — drop *"Per-tech capacity breakdown excludes events"*; same spec-silence treatment as CAP-03 (question A1) | APPLY-NOW | no (local) |
| SCH-CONF-01 | [C30023](https://shopview.testrail.io/index.php?/cases/view/30023) | **Notes only** — the *"events do NOT participate in conflict detection (…may change)"* caveat is now **CONFIRMED** by §4.11 + the PO; drop "may change" | APPLY-NOW | no (local) |

**Honesty note (Rule 15 — do not over-apply the ruling).** Branko confirmed the AGGREGATE
capacity total includes event time. He did **not** address three sub-cases the engineering plan
flagged as pending product confirmation. Those become new questions (§5), not case assertions:
department-assigned events, unbounded all-day events, and whether the per-technician OT tag /
hover breakdown include event hours.

## 2. Q2 → D4 · shift-modal 'Reassign' · **HOLD LIFTS** · answer **B**

**Branko, verbatim:** *"B - No button"*

**Spec basis (Rule 25):** Confluence **v23 (2026-07-30 — the newest edit to the page)** DELETED
the clause. §4.9 Actions went from *"Actions: Delete (series-aware, §7) **and Reassign to another
technician**."* → *"Actions: Delete (series-aware, §7)"*. He edited the PRD and answered the sheet
in the same window; the two agree.

| Case | C-id | Change | Class | Push? |
|---|---|---|---|---|
| SCH-MODAL-08 | [C30015](https://shopview.testrail.io/index.php?/cases/view/30015) | **Notes + refs.** The case body is **already correct** ("Delete action only… no 'Reassign' action"). What changes is its provenance: it was HELD on a design-vs-spec conflict; the conflict is gone. Notes record Branko 2026-07-31 = B + the v23 deletion. `refs` keeps SV-8695 (Rule 20 needs the ticket) but the spec anchor is restated as §4.9 Actions **as of v23** | APPLY-NOW | **YES** (refs) |
| SCH-REAS-01 | [C30052](https://shopview.testrail.io/index.php?/cases/view/30052) | **Notes only** — drag-reassign is now the ONLY reassignment path, confirmed by the PO. Behaviour unchanged | APPLY-NOW | no (local) |
| SCH-REAS-02 | *(retired + deleted 2026-07-22)* | **Stays retired.** It was retired on the design's authority; the PO and the spec have now caught up. **No un-retire needed** | NO-CHANGE | no |

**Downstream flag for the user (not a case change):** Jira story **SV-8695** still lists a modal
Reassign action in its text. The spec, the design, the tech plan and the PO now all say no button
→ **SV-8695's text is the stale artefact and should be corrected by the story owner.** We are not
editing Jira.

## 3. Q3 · Week Export · answer **No — not in V1, not even in the backlog** → **RETIRE-CANDIDATE (HELD)**

**Branko, verbatim:** *"No. There is nothing about this in the PRD, not in the future
requirements."*

**Independently corroborated:** a full heading + text scan of live v23 finds **no** export or print
item — not in §6 Grid toolbar, not in §9 View options, not in §15 Future considerations. The
engineering tech plan's §9 requirement table has none either.

| Case | C-id | Recommendation | Class |
|---|---|---|---|
| SCH-EXP-01 | [C38853](https://shopview.testrail.io/index.php?/cases/view/38853) *"Week Export opens a printable Department-by-Technician week grid"* | **RETIRE** — the feature is out of V1 scope by PO ruling, so the case tests something that will not exist. Its sibling SCH-EXP-02 (C38854) was already merged away in the 2026-07-31 consolidation, so this is the last survivor | **RETIRE-CANDIDATE — HELD** |

**⚠️ NOT DELETED. Awaiting explicit user authorization** (Standing Rule 6 — TestRail is the only
real system). Two things to decide together:
1. `delete_case` C38853, and
2. the now-empty TestRail **section 5406 "Week Export and Printing"** under group 4254 — leave it
   (harmless, mirrors the SCH-REAS-02 precedent of keeping empty sections) or remove it.
3. It is also a member of **run 357** — removing the case must be followed by a run resync
   (Rule 34), which is a second authorized operation.

If the user prefers to keep it, the honest alternative is to leave the case in place with a note
that it is post-V1 scope — but a tester running run 357 would then hit an untestable case, so
retirement is the cleaner recommendation.

## 4. Q4 · cell menu · answer **C: left-click only; menu = 'Create event' + 'New work order'** → **APPLY-NOW (6 cases)**

**Branko, verbatim:** *"C. there is no right click, only left click. when clicked it opens dropdown
menu with two options (Create event, New work order) as mentioned in prd."*

**Spec basis (Rule 25 — live v23):** §4.10 *"Create via **left-click on empty grid space**, which
opens a menu with 'Create event' and 'New work order'.."* · §7 *"**Left-click on empty grid space**
opens a menu with: Create event, New work order."* (both changed in **v22**).

**This is a real gap in our suite, not a confirmation.** The 2026-07-27 epic pass correctly removed
the old 'View Day' / 'New Shift' items and fixed the labels to 'Create Event' — but it **left the
click type as right-click in 7 places**. A tester would follow a step that cannot work.

| Case | C-id | What is wrong today | Push? |
|---|---|---|---|
| SCH-EVT-01 | [C30016](https://shopview.testrail.io/index.php?/cases/view/30016) | **Title** *"Create an event via **right-click** 'Create Event' on a grid cell"* + Steps + Expected 1 *"The **right-click** context menu contains 'Create Event'"* + refs anchor *"(§7 (right-click menu))"* | **YES** |
| SCH-REAS-03 | [C30054](https://shopview.testrail.io/index.php?/cases/view/30054) | **Title** *"**Right-click** a grid cell opens a menu…"*; Steps; and Expected 5 *"The browser's own right-click menu does not appear instead"* — **which becomes nonsense under left-click** (a left-click never raises the browser menu). Also add the spec's *empty* grid space qualifier | **YES** |
| SCH-EVT-03 | [C30018](https://shopview.testrail.io/index.php?/cases/view/30018) | Precondition 2 *"(via **right-click** 'Create Event')"* | **YES** |
| SCH-PERM-02 | [C30075](https://shopview.testrail.io/index.php?/cases/view/30075) | Step 3 *"**Right-click** a grid cell"* + Expected 3 *"The **right-click** context menu does not appear"* | **YES** |
| SCH-PERM-04 | [C30077](https://shopview.testrail.io/index.php?/cases/view/30077) | Step 2 *"**Right-click** a cell and create an event…"* + Expected 2 *"…including via the **right-click** context menu"* | **YES** |
| SCH-REAS-06 | [C38855](https://shopview.testrail.io/index.php?/cases/view/38855) | Steps use right-click; notes carry a Q4 "pending Branko" flag that is now answered | **YES** |

**What Q4 does NOT settle:** he confirmed the menu and its two items, not what **'New work order'
does** once clicked. Our SCH-REAS-06 expects *"a toast / prompt pointing to the Work Orders tab"*
(design) while the tech plan builds *"the real work-order creation window in place (not a toast)"*.
**Stays VIU-confirm + question A5** — the case's Expected 1–2 pass bar (the item exists, it directs
you to create a work order) is deliberately worded to survive either outcome.

## 5. Q5 · default working day **7:00 AM – 7:00 PM** · answer **B** → **NO-CHANGE + 1 wording fix**

**Branko, verbatim:** *"B) 7:00 AM to 7:00 PM. PRD §4.2 hierarchy: technician's custom hours → shop
business hours → general default of 7 AM 7 PM. §4.8 repeats 7:00 AM as the auto-scroll fallback."*

Spec (unchanged since v8), tech plan (07:00–19:00 constant) and PO all agree; the design
prototype's hardcoded 8 AM–5 PM is the lone outlier.

| Case | C-id | Outcome | Push? |
|---|---|---|---|
| SCH-START-03 | C29971 | **NO-CHANGE** — already asserts the 7:00 AM default | no |
| SCH-START-06 | C29974 | **NO-CHANGE** | no |
| SCH-CONF-03 | [C30025](https://shopview.testrail.io/index.php?/cases/view/30025) | **APPLY-NOW (wording).** Expected 1/2 quote the prototype's numbers — *"in the spirit of 'Starts before working hours (**8:00 AM**)'"* / *"'Extends past working hours (**5:00 PM**)'"*. With 7–7 now confirmed as the default, printing 8:00/5:00 in front of a tester is actively misleading. Reword to the technician's **configured** start/end without the prototype numbers (the hierarchy assertion in Expected 3 already carries the rule) | **YES** |

## 6. Q6 · tooltip VIN always shown · answer **A** → **NO-CHANGE, closes OQ-6(a)**

**Branko, verbatim:** *"A. Vin is always visible on hover regardless of the toggle"*

This is exactly how we resolved the §4.13-vs-§9 inconsistency on 2026-07-22. **The PO has now
ratified our reading.**

| Case | C-id | Outcome | Push? |
|---|---|---|---|
| SCH-TIP-01 | [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) | **NO-CHANGE** to the body; **notes only** — upgrade from "resolved by the design" to "ratified by the PO 2026-07-31"; **OQ-6(a) CLOSED** | no (local) |
| SCH-VIEW-04 | [C30045](https://shopview.testrail.io/index.php?/cases/view/30045) | **NO-CHANGE** to the body; **notes only** — same | no (local) |

**Residual doc-hygiene flag (not a case change):** live v23 **§9 still** ties the tooltip VIN to
the 'VIN Number' toggle, contradicting §4.13 and Branko's own answer. He should tidy the §9 prose.

## 7. Spec-diff deltas with no PO question attached

Folded in from `SPEC-DIFF.md`. All four are our cases going stale against spec text we had not
read until this pass.

| Case | C-id | Delta | Change | Class | Push? |
|---|---|---|---|---|---|
| SCH-SER-01 | [C29987](https://shopview.testrail.io/index.php?/cases/view/29987) | §4.6 month view **(v22)**. v18: *"empty weekend columns, **and visible breaks around skipped or booked days**."* → v23: *"empty weekend columns **(when business hours are not set for weekends)**."* | Expected 3 gains the weekend condition; **Expected 4** *"Visible breaks appear around skipped days and days the technician is otherwise booked"* asserts a clause the spec DELETED → removed. **Also a CONTRADICTION — see §9** | APPLY-NOW | **YES** |
| SCH-SER-02 | [C29988](https://shopview.testrail.io/index.php?/cases/view/29988) | §4.6 week view **(v22)**. v18: *"a 'week N of M' cue, **and a break around any day the technician is otherwise booked**."* → v23: *"a 'week N of M' cue."* | **Expected 4** *"The banner breaks around the day the technician is otherwise booked"* asserts a deleted clause → removed. **CONTRADICTION — see §9** | APPLY-NOW | **YES** |
| SCH-DAY-06 | [C30006](https://shopview.testrail.io/index.php?/cases/view/30006) | §4.8 **(v22)**: *"a label on hover"* → *"a label on hover **over the grid**"* | Expected 3 gains "over the grid" (Rule 9 build-accuracy) | APPLY-NOW | **YES** |
| SCH-EDGE-08 | [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | §11 **Dark theme** NFR added **(v19)** | The case was authored from the tech plan only; it is now **spec-backed**. `refs` upgraded from *"SV-8685 (tech-plan §6 checklist 13 dark mode)"* to carry the real spec anchor **§11 (Dark theme)** — Rule 20 wants the spec anchor, not a plan reference | APPLY-NOW | **YES** |

**Already applied — no action (confirmation that the 2026-07-27 / 2026-07-30 passes were right):**
§4.4 default-blue block colour (v22) · §4.5 closures-not-skipped (v22) · §4.2 Hours settings block
(v19, = SV-8699 → SCH-HRS-02..06) · §4.10/§7 removal of 'View Day' / 'New Shift' (v22) · the epic
header row (v21, = SV-8685 backfill).

## 8. STILL-AMBIGUOUS — questions, not case edits (Rule 32: ambiguity stays a question)

**NEW, opened by Branko's own D1 answer (all three go to Branko; A1 could also go to dev):**

| # | Question (plain, Rule 7) | Affected | Why we cannot decide it |
|---|---|---|---|
| **A1** | When a technician has a meeting, do those meeting hours also count toward the **'OT' overtime tag** and the **per-technician hover breakdown** — or only toward the day's overall busy bar? | SCH-CAP-03 (C30032), SCH-CAP-04 (C30033) | §4.12 says the overall total includes event time but calls overtime *"a separate per-technician signal, and the two are independent"* and never says. **Spec silent** |
| **A2** | If a meeting is put on a **whole department** rather than one named technician, does it use up each of those technicians' time? | SCH-CAP-01..04, SCH-EVT-08 | Not in the spec at all. The engineering plan's working default is "no" — an engineering default, not a product ruling |
| **A3** | An **all-day** event has no start/end time. Does a full working day get used up, or is it just shown on the row without consuming time? | SCH-EVT-08 (C30615), SCH-EVT-03 (C30018) | Not in the spec. The engineering plan's working default is "visual only" |

**Re-routed (do NOT re-ask Branko):**

| # | Question | Status |
|---|---|---|
| **A4** | Q7 — should we test the behind-the-scenes saving/rules as well as the screen? | Branko declined: *"I'm not sure if this question is for me Bilal."* **Correctly not a PO question → put it to engineering / the QA lead.** Note the premise already moved: the tech plan IS the written backend description, and SCH-API-01..04 (C38872–C38875) already exist. That is our reading, **not his ruling** |

**Heads-up, not a question:**

| # | Item | Status |
|---|---|---|
| **A5** | What does **'New work order'** in the cell menu actually do — a toast pointing at the Work Orders tab (design) or open the work-order creation window in place (tech plan)? | Branko confirmed the menu ITEM, not its behaviour. **VIU-confirm**; SCH-REAS-06's pass bar is written to survive either |
| **A6** | At cutover, roughly **9,684 migrated legacy events** will start consuming capacity the moment events count — day bars will jump on day one. Now that D1 = A, this is real. **Tell product it is expected, so it is not filed as a bug** | Flag for the user / product, from the tech plan |

**Still open on the unsent TechPlan sheet — NQ-1..NQ-5.** None were in the answered file. What
changed this pass is that **the live spec now sides with our existing cases on three of them**,
which lowers the risk while they wait:

| NQ | Question | Cases | Where the live v23 spec sits |
|---|---|---|---|
| **NQ-1** | Does a multi-day job skip shop closure days? | SCH-EDGE-05 (C30089), SCH-SPREAD-07 (C29983), SCH-SPREAD-08 (C29984), SCH-SPREAD-11 (C38863), SCH-API-02 (C38873) | **Sides with our cases.** §4.5: *"Shop closures and public holidays are **not** skipped in V1.."* — text is from v22 (2026-07-27), i.e. NEWER than the tech plan's own date, and still standing in v23. Tech plan contradicts it; only Branko can close it |
| **NQ-2** | Does the conflict counter include double-bookings? | SCH-CONF-01 (C30023), SCH-CONF-05 (C30027) | **Genuinely split.** §4.11 lists "Double-booked" as a conflict type (supports our cases); the tech plan calls it a soft front-end warning only |
| **NQ-3** | Where do the shop's working hours and closure days live? | SCH-HRS-02 (C38847) and siblings | **Sides with our cases.** §4.2: hours live in *"Edit Staff Member"* + *"Edit Location"*. The plan's separate Administration "Schedule Settings" page is not in the spec |
| **NQ-4** | Can a technician have a split working day (two ranges)? | SCH-HRS-05 (C38850), SCH-HRS-06 (C38851) | **Sides with our cases.** §4.2 verbatim: *"'Add hours' appends more to **support split shifts**, each removable."* The plan's one-range-per-weekday model conflicts with the spec |
| **NQ-5** | May a technician change other technicians' shifts? | SCH-PERM-09 (C30082) context; a new negative only on answer A | **Spec silent** — re-confirmed on the v23 body: §14 has no write-scoping rule. Genuinely open |

**Recommendation:** send the TechPlan sheet **trimmed to NQ-1..NQ-5** (drop its Q6/Q7 — answered
here), **plus A1/A2/A3**, and reframe NQ-1/NQ-3/NQ-4 as *"please confirm the PRD stands and the
build plan should change"*, since the PRD already answers them.

## 9. Contradictions found by the Rule-28 Stage-2b sweep (pre-fix)

Recorded here because they are consequences of the spec diff; the resolved sweep is in
`AUDIT-2026-07-31.md`.

| # | Group / control | The two assertions | Winner (precedence) |
|---|---|---|---|
| **X1** | **Series banner — breaks around "otherwise booked" / skipped days** | SCH-SER-01 E4 *"Visible breaks appear around skipped days and days the technician is otherwise booked"* + SCH-SER-02 E4 *"The banner breaks around the day the technician is otherwise booked"* **vs** SCH-SPREAD-08 E3 *"in V1 the only skip reason is a weekend day with no working hours set"* and SCH-SPREAD-07 E3 *"Shop closures and public holidays are NOT skipped in V1"* — if nothing but weekends is ever skipped, there are no "skipped days" for a banner to break around | **Spec v23** (the clauses were DELETED in v22) → drop E4 from both SER cases. Tier 3/spec-text; no PO ruling on either side, and the spec text is unambiguous |
| **X2** | **Weekend columns inside a series banner** | SCH-SER-01 E3 *"Weekend columns inside the series are empty (no bar)"* — unconditional **vs** SCH-SPREAD-07 E2 *"if the tech has hours on a weekend day (e.g. Saturday hours) that day is NOT skipped"* (so it WOULD carry a bar) | **Spec v23** — §4.6 now reads *"empty weekend columns **(when business hours are not set for weekends)**"* → add the condition to SER-01 E3 |
| **X3** | **Cell-menu click type — title vs the ruling** *(Stage 2b helper (ii): TITLE-vs-EXPECTED)* | SCH-EVT-01 **title** *"via right-click"* + SCH-REAS-03 **title** *"Right-click a grid cell"* **vs** Branko 2026-07-31 *"there is no right click, only left click"* + §4.10/§7 *"Left-click on empty grid space"*. Also SCH-REAS-03 E5 *"The browser's own right-click menu does not appear instead"* becomes unreachable under left-click | **PO ruling (tier 1) + spec** → all 6 members re-aligned to left-click (§4) |
| **X4** | **Events vs capacity** | SCH-EVT-08 title/E1/E3 *"does not count toward a technician's capacity bar"* / *"Only shifts drive capacity"* **vs** Branko's A + §4.12 *"(shifts plus events)"*, and vs SCH-CAP-01's own basis | **PO ruling (tier 1)** → rewrite SCH-EVT-08 and align the CAP notes (§1) |
| **X5** | **Before/after-hours reference times** | SCH-CONF-03 E1/E2 quote *"8:00 AM"* / *"5:00 PM"* **vs** Branko's Q5 = **7 AM–7 PM** and SCH-START-03's *"7:00 AM default"* | **PO ruling (tier 1)** → drop the prototype numbers from CONF-03 (§5) |

**All five are resolvable from a tier-1 PO ruling or unambiguous newer spec text — none is left
PENDING.** (The genuinely undecidable items became questions A1/A2/A3 instead of contradictions,
because no case currently asserts either side of them.)

## 10. What gets pushed vs what stays local

The Schedule executor pushes exactly **`title`, `custom_preconds`, `custom_steps`,
`custom_expected`, `refs`** (per `exec_sync_techplan_2026-07-30.py` → `desired_body()`). **`notes`
and `viu_status` are LOCAL-ONLY fields** — they never reach TestRail. So:

**15 × `update_case` (TestRail):** SCH-EVT-08 (C30615) · SCH-CAP-01 (C30030) · SCH-MODAL-08
(C30015, refs) · SCH-EVT-01 (C30016) · SCH-REAS-03 (C30054) · SCH-EVT-03 (C30018) · SCH-PERM-02
(C30075) · SCH-PERM-04 (C30077) · SCH-REAS-06 (C38855) · SCH-CONF-03 (C30025) · SCH-SER-01
(C29987) · SCH-SER-02 (C29988) · SCH-DAY-06 (C30006) · SCH-EDGE-08 (C38866) · SCH-TIP-01 (C30034,
refs only — see below)

**6 × notes-only (local):** SCH-CAP-02 (C30031) · SCH-CAP-03 (C30032) · SCH-CAP-04 (C30033) ·
SCH-CONF-01 (C30023) · SCH-REAS-01 (C30052) · SCH-VIEW-04 (C30045)

**0 × `add_case`** (no new cases) · **0 × `add_section`** · **0 × `delete_case`** (the one
retire-candidate is HELD) · **0 × run writes beyond the Rule-34 check** — with no new cases, run
357 needs **verification only**, not a resync.

> *SCH-TIP-01 is listed under push only if its `refs` anchor changes; if the body and refs are
> byte-identical it drops to the notes-only list. Resolved in Phase 3 by comparing the generated
> payload against the live case — no no-op writes.*
