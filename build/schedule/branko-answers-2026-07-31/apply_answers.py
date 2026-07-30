#!/usr/bin/env python3
"""Apply Branko's 2026-07-31 answers + the v18->v23 spec-diff deltas to the local
Schedule case bodies.

Per build/schedule/branko-answers-2026-07-31/DELTAS.md:
  - 15 cases get a tester-facing / refs edit (these need a TestRail update_case)
  - 6 cases get a notes-only edit (LOCAL ONLY - the executor never pushes `notes`)
  - 1 case (SCH-EXP-01) gets a RETIRE-CANDIDATE note; it is NOT retired here and NOT
    deleted anywhere - it is held for explicit user authorization (Standing Rule 6)
  - 0 new cases, 0 deletes, 0 status changes (everything stays VIU-Pending, Rule 12)

Pre-edit backups of EVERY touched case body are written to backup/ before any change.
Every edit is an exact-string replacement that ASSERTS the old text was found, so a
silent no-op or a drifted body stops the run.
"""
import json, os, sys, glob, shutil
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
CASES_DIR = os.path.join(HERE, "..", "cases")
BACKUP = os.path.join(HERE, "backup")
os.makedirs(BACKUP, exist_ok=True)

RULING = "Branko answer 2026-07-31"
SPEC = "Confluence v23 (2026-07-30)"

# ---------------------------------------------------------------- load
files = {}
index = {}
for f in sorted(glob.glob(os.path.join(CASES_DIR, "cases-*.json"))):
    data = json.load(open(f))
    files[f] = data
    for c in data:
        index[c["id"]] = (f, c)

# ---------------------------------------------------------------- edit helpers
touched = {}      # id -> set of fields
errors = []


def rec(cid, field):
    touched.setdefault(cid, set()).add(field)


def set_field(cid, field, value):
    c = index[cid][1]
    if c.get(field) == value:
        errors.append(f"{cid}.{field}: NO-OP (already equals the new value)")
        return
    c[field] = value
    rec(cid, field)


def repl_line(cid, field, old, new):
    """Replace exactly one list entry, asserting the old text exists exactly once."""
    c = index[cid][1]
    lst = c.get(field) or []
    hits = [i for i, l in enumerate(lst) if l == old]
    if len(hits) != 1:
        errors.append(f"{cid}.{field}: expected exactly 1 match for {old!r}, found {len(hits)}")
        return
    lst[hits[0]] = new
    rec(cid, field)


def drop_line(cid, field, old):
    c = index[cid][1]
    lst = c.get(field) or []
    hits = [i for i, l in enumerate(lst) if l == old]
    if len(hits) != 1:
        errors.append(f"{cid}.{field}: expected exactly 1 match to DROP {old!r}, found {len(hits)}")
        return
    lst.pop(hits[0])
    # renumber the remaining "N. " prefixes so the tester's numbering stays contiguous
    for i, l in enumerate(lst):
        head, sep, tail = l.partition(". ")
        if sep and head.strip().isdigit():
            lst[i] = f"{i+1}. {tail}"
    rec(cid, field)


def note(cid, text):
    c = index[cid][1]
    prev = (c.get("notes") or "").rstrip()
    c["notes"] = (prev + " | " if prev else "") + text
    rec(cid, "notes")


def note_strip(cid, fragment, replacement=""):
    """Remove a now-false clause from an existing note, asserting it was there."""
    c = index[cid][1]
    prev = c.get("notes") or ""
    if fragment not in prev:
        errors.append(f"{cid}.notes: fragment not found to strip: {fragment!r}")
        return
    c["notes"] = prev.replace(fragment, replacement)
    rec(cid, "notes")


# ---------------------------------------------------------------- backup first
BACK_IDS = ["SCH-EVT-08", "SCH-CAP-01", "SCH-CAP-02", "SCH-CAP-03", "SCH-CAP-04",
            "SCH-CONF-01", "SCH-MODAL-08", "SCH-REAS-01", "SCH-EVT-01", "SCH-REAS-03",
            "SCH-EVT-03", "SCH-PERM-02", "SCH-PERM-04", "SCH-REAS-06", "SCH-CONF-03",
            "SCH-TIP-01", "SCH-VIEW-04", "SCH-SER-01", "SCH-SER-02", "SCH-DAY-06",
            "SCH-EDGE-08", "SCH-EXP-01"]
pre = {}
for cid in BACK_IDS:
    if cid not in index:
        sys.exit(f"FATAL: {cid} not found in local cases")
    pre[cid] = json.loads(json.dumps(index[cid][1]))
json.dump(pre, open(os.path.join(BACKUP, "pre-edit-case-bodies-2026-07-31.json"), "w"),
          indent=2, ensure_ascii=False)
for f in files:
    shutil.copy2(f, os.path.join(BACKUP, os.path.basename(f) + ".pre-edit"))
print(f"backup: {len(pre)} case bodies + {len(files)} whole files -> {BACKUP}")

# =====================================================================
# 1. Q1 / D1 - events DO consume capacity (PO answer A; spec S4.11 + S4.12)
# =====================================================================
set_field("SCH-EVT-08", "title",
          "An event's hours count toward the capacity bar but raise no conflict")
repl_line("SCH-EVT-08", "expected",
          "1. Adding the event does NOT change the capacity bar fill - events are not counted toward booked/available hours.",
          "1. Adding the event DOES increase that day's capacity bar fill - the event's hours are counted alongside shift hours (a 2-hour meeting uses up 2 hours of the technician's available time).")
repl_line("SCH-EVT-08", "expected",
          "3. Only shifts drive capacity and conflicts.",
          "3. The two behave differently on purpose: an event uses up capacity, but it is never flagged as a conflict.")
set_field("SCH-EVT-08", "refs",
          "SV-8696 (§4.10 (Events), §4.11 (events not conflict-checked), §4.12 (event time included in the utilization total))")
set_field("SCH-EVT-08", "notes",
          "REVERSED 2026-07-31 by the PO (" + RULING + ", answer A): event hours DO consume "
          "capacity. Verbatim: 'A) §4.12 PRD is explicit: \"Event time is included in the "
          "utilization total alongside shifts, so meetings and training consume capacity.\" A "
          "2-hour meeting consumes 2 hours of capacity. Note the split in §4.11: events count "
          "toward capacity but are not conflict-checked.' Spec basis: " + SPEC + " §4.12 "
          "('Blue fill: aggregate technician-hours booked (shifts plus events)...') + §4.11 "
          "('Events are not conflict-checked for now... Their time still counts toward "
          "capacity'), both added in Confluence v19 (2026-07-23) - after our v18 baseline. This "
          "SUPERSEDES his 2026-07-22 'events currently excluded' answer, which is what this "
          "case previously asserted (Rule 32 newest-wins). NOT YET ANSWERED and therefore NOT "
          "asserted here: whether a DEPARTMENT-assigned event consumes each technician's time, "
          "and whether an ALL-DAY event (no start/end) consumes a full day - see DELTAS.md "
          "questions A2/A3; observe and record LIVE at VIU (Rule 12).")

repl_line("SCH-CAP-01", "expected",
          "1. Each day header shows a capacity bar; the blue fill represents total technician-hours booked divided by total available (sum of all techs' working hours).",
          "1. Each day header shows a capacity bar; the blue fill represents total technician-hours booked - shift hours PLUS event hours - divided by total available (sum of all techs' working hours).")
set_field("SCH-CAP-01", "refs",
          "SV-8698 (§4.12 (Blue fill - aggregate booked = shifts plus events))")
note_strip("SCH-CAP-01",
           " Capacity bar aggregates SHIFT hours only; events do NOT count toward capacity (Branko 2026-07-22 Q1 - may change if the PO decides to support events later; design-confirmed: _capForDate iterates shifts only).")
note("SCH-CAP-01",
     "UPDATED 2026-07-31 (" + RULING + " answer A + " + SPEC + " §4.12): the aggregate "
     "explicitly includes EVENT hours as well as shift hours ('shifts plus events'). This "
     "reverses the earlier 2026-07-22 'events excluded' note.")

note_strip("SCH-CAP-02",
           " Events are excluded from the capacity aggregate (Branko 2026-07-22 Q1 - may change).")
note("SCH-CAP-02",
     "UPDATED 2026-07-31 (" + RULING + " answer A + " + SPEC + " §4.12): events are NOT "
     "excluded any more - event hours count toward the aggregate, so event time is another way "
     "a day can exceed capacity and show the amber spill. The spill behaviour itself is "
     "unchanged, so no tester-facing edit was needed.")

note_strip("SCH-CAP-03",
           " The OT calculation is over SHIFT hours only; events do not count (Branko 2026-07-22 Q1 - may change).")
note("SCH-CAP-03",
     "UPDATED 2026-07-31: the old 'events do not count' claim is withdrawn (" + RULING +
     " answer A). It is deliberately NOT replaced with the opposite: " + SPEC + " §4.12 says "
     "event time is in the AGGREGATE utilization total but calls overtime 'a separate "
     "per-technician signal, and the two are independent', and never says whether event hours "
     "feed the per-technician OT test. SPEC SILENT (Rule 15) -> VIU-confirm; open question A1 "
     "in DELTAS.md. Do not fail this case on the OT-vs-events point until it is ruled.")

note_strip("SCH-CAP-04",
           " Per-tech capacity breakdown excludes events (Branko 2026-07-22 Q1 - may change).")
note("SCH-CAP-04",
     "UPDATED 2026-07-31: the old 'breakdown excludes events' claim is withdrawn (" + RULING +
     " answer A). Whether the per-TECHNICIAN hover breakdown includes event hours is NOT stated "
     "in " + SPEC + " §4.12 (only the aggregate is) - SPEC SILENT (Rule 15) -> VIU-confirm; "
     "open question A1 in DELTAS.md. Record what the tooltip actually totals when observed live.")

note_strip("SCH-CONF-01",
           " Events do NOT participate in double-booked/overlap conflict detection (Branko 2026-07-22 Q1 - may change; design-confirmed: _conflictReasons iterates shifts only).",
           " Events do NOT participate in double-booked/overlap conflict detection - CONFIRMED 2026-07-31, no longer provisional.")
note("SCH-CONF-01",
     "CONFIRMED 2026-07-31 (" + RULING + " answer A + " + SPEC + " §4.11 verbatim: 'Events are "
     "not conflict-checked for now: an event overlapping a shift (or another event) does not "
     "raise a conflict. Their time still counts toward capacity'). The events-not-conflicted "
     "half is now spec text AND a PO ruling, so the earlier 'may change' caveat is dropped. The "
     "capacity half moved the other way - see SCH-EVT-08. NQ-2 (does the conflict counter "
     "include double-bookings?) is STILL OPEN and untouched by this ruling.")

# =====================================================================
# 2. Q2 / D4 - no Reassign action in the shift modal (PO answer B; v23 deleted it)
# =====================================================================
set_field("SCH-MODAL-08", "refs",
          "SV-8695 (§4.9 (Actions - Delete only; Reassign removed in Confluence v23), §7)")
note("SCH-MODAL-08",
     "HOLD LIFTED 2026-07-31. The case body was already correct and does not change; only its "
     "provenance does. " + RULING + " to 'Should the shift pop-up have a Reassign button?' was "
     "verbatim 'B - No button'. Independently corroborated by the spec itself: " + SPEC + " "
     "DELETED the clause - §4.9 Actions went from 'Actions: Delete (series-aware, §7) and "
     "Reassign to another technician.' to 'Actions: Delete (series-aware, §7)'. The "
     "design-vs-spec conflict that held this case since 2026-07-22 is therefore gone. NOTE FOR "
     "THE STORY OWNER (not a case change): Jira SV-8695's own text still lists a modal Reassign "
     "action and is now the stale artefact.")

note("SCH-REAS-01",
     "CONFIRMED 2026-07-31 (" + RULING + " answer B + " + SPEC + " §4.9): dragging is now the "
     "ONLY way to reassign a shift - the shift detail modal has no Reassign action at all. "
     "Behaviour under test is unchanged, so no tester-facing edit was needed. The retired "
     "SCH-REAS-02 (modal-Reassign, deleted 2026-07-22) correctly stays retired.")

# =====================================================================
# 3. Q4 - the cell menu opens on LEFT-click on EMPTY grid space
# =====================================================================
Q4 = ("Q4 ANSWERED 2026-07-31 (" + RULING + ", option C, verbatim: 'C. there is no right click, "
      "only left click. when clicked it opens dropdown menu with two options (Create event, New "
      "work order) as mentioned in prd.'). Spec basis: " + SPEC + " §4.10 ('Create via left-click "
      "on empty grid space, which opens a menu with \"Create event\" and \"New work order\"..') "
      "+ §7 ('Left-click on empty grid space opens a menu with: Create event, New work order.'), "
      "changed in Confluence v22. The 2026-07-27 pass fixed the menu ITEMS but left the CLICK "
      "TYPE as right-click - corrected here. Confirm the exact on-screen labels LIVE at VIU "
      "(Rules 9/12).")

set_field("SCH-EVT-01", "title",
          "Create an event via left-click 'Create Event' on empty grid space")
repl_line("SCH-EVT-01", "steps",
          "1. Right-click a technician's cell on a working day.",
          "1. Left-click an empty spot in a technician's cell on a working day (not on an existing block).")
repl_line("SCH-EVT-01", "steps",
          "2. Choose 'Create Event' from the context menu.",
          "2. Choose 'Create Event' from the menu that opens.")
repl_line("SCH-EVT-01", "expected",
          "1. The right-click context menu contains 'Create Event'.",
          "1. A menu opens at the spot you clicked and contains 'Create Event'.")
set_field("SCH-EVT-01", "refs", "SV-8696 (§4.10 (left-click menu on empty grid space), §7)")
note("SCH-EVT-01", Q4)

set_field("SCH-REAS-03", "title",
          "Left-click empty grid space opens a menu: Create Event and New Work Order")
repl_line("SCH-REAS-03", "steps",
          "1. Right-click a technician's grid cell.",
          "1. Left-click an empty spot in a technician's grid cell (not on an existing shift or event block).")
repl_line("SCH-REAS-03", "expected",
          "1. A context menu opens at the cell.",
          "1. A dropdown menu opens at the spot you clicked.")
repl_line("SCH-REAS-03", "expected",
          "5. The browser's own right-click menu does not appear instead.",
          "5. This menu is opened by a normal left-click - right-clicking the cell does not open it.")
set_field("SCH-REAS-03", "refs",
          "SV-8700 (§7 (left-click menu on empty grid space; View Day and New Shift removed), §14.1 (creation via the cell menu))")
note("SCH-REAS-03", Q4 + " The old expected line \"The browser's own right-click menu does not "
     "appear instead\" was unreachable under left-click and has been replaced with the "
     "PO-backed negative (a right-click does NOT open this menu).")

repl_line("SCH-EVT-03", "preconditions",
          "2. You are on the Schedule page with the event modal open (via right-click 'Create Event').",
          "2. You are on the Schedule page with the event modal open (left-click empty grid space, then 'Create Event').")
note("SCH-EVT-03", Q4)

repl_line("SCH-PERM-02", "steps",
          "3. Right-click a grid cell.",
          "3. Left-click an empty spot in a grid cell.")
repl_line("SCH-PERM-02", "expected",
          "3. The right-click context menu does not appear (no creation entries - no 'Create Event' and no 'New Work Order').",
          "3. No creation menu opens at all - there is no 'Create Event' and no 'New Work Order' offered.")
note("SCH-PERM-02", Q4)

repl_line("SCH-PERM-04", "steps",
          "2. Right-click a cell and create an event via 'Create Event'; in day view, click empty space to create.",
          "2. Left-click an empty spot in a cell and create an event via 'Create Event'; in day view, click empty space to create.")
repl_line("SCH-PERM-04", "expected",
          "2. Shift and event creation works, including via the right-click context menu and day-view click-to-create.",
          "2. Shift and event creation works, including via the menu opened by left-clicking empty grid space and day-view click-to-create.")
note("SCH-PERM-04", Q4)

repl_line("SCH-REAS-06", "steps",
          "1. Right-click an empty grid cell.",
          "1. Left-click an empty spot in a grid cell.")
note("SCH-REAS-06", Q4 + " STILL NOT ANSWERED: what 'New Work Order' actually DOES once clicked "
     "(a toast pointing to the Work Orders tab, per the design, vs opening the work-order "
     "creation window in place, per the engineering plan). Branko confirmed the menu ITEM only. "
     "Expected 1-2 are deliberately worded to pass either way - capture the real behaviour LIVE "
     "at VIU (question A5 in DELTAS.md).")

# =====================================================================
# 4. Q5 - default working day 7:00 AM to 7:00 PM (drop the prototype's 8-5)
# =====================================================================
repl_line("SCH-CONF-03", "expected",
          "1. The shift is flagged as a before-hours conflict (the design's reason sentence reads in the spirit of 'Starts before working hours (8:00 AM)'), measured against the technician's configured working-day start.",
          "1. The shift is flagged as a before-hours conflict, with a reason sentence in the spirit of 'Starts before working hours', measured against that technician's own configured working-day START time (not a fixed hour).")
repl_line("SCH-CONF-03", "expected",
          "2. The shift is flagged as an after-hours conflict (the design's reason sentence reads in the spirit of 'Extends past working hours (5:00 PM)'), measured against the technician's configured working-day end.",
          "2. The shift is flagged as an after-hours conflict, with a reason sentence in the spirit of 'Extends past working hours', measured against that technician's own configured working-day END time (not a fixed hour).")
repl_line("SCH-CONF-03", "expected",
          "3. Both the start and the end follow the hierarchy technician hours, then business hours, then the default.",
          "3. Both the start and the end follow the hierarchy technician hours, then shop business hours, then the general default working day of 7:00 AM to 7:00 PM.")
set_field("SCH-CONF-03", "refs",
          "SV-8697 (§4.11 (Before hours, After hours), §4.2 (working-hours hierarchy; 7:00 AM to 7:00 PM default))")
note("SCH-CONF-03",
     "Q5 ANSWERED 2026-07-31 (" + RULING + ", option B, verbatim: 'B) 7:00 AM to 7:00 PM. PRD "
     "§4.2 hierarchy: technician's custom hours -> shop business hours -> general default of 7 "
     "AM 7 PM. §4.8 repeats 7:00 AM as the auto-scroll fallback.'). The prototype's hardcoded "
     "8:00 AM / 5:00 PM numbers have been REMOVED from the expected results - printing them in "
     "front of a tester was misleading now that 7-7 is confirmed by the PO, the spec and the "
     "engineering plan alike (the prototype is the lone outlier).")

# =====================================================================
# 5. Q6 - tooltip VIN always shown (confirmation; closes OQ-6(a))
# =====================================================================
VIN = ("Q6 ANSWERED 2026-07-31 - PO RATIFIES our 2026-07-22 reading (" + RULING + ", option A, "
       "verbatim: 'A. Vin is always visible on hover regardless of the toggle'). The §4.13-vs-§9 "
       "inconsistency is settled in favour of §4.13; OQ-6(a) is CLOSED. No tester-facing edit "
       "needed - the case already asserted this. DOC-HYGIENE FLAG for Branko (not a case "
       "change): " + SPEC + " §9 STILL ties the tooltip VIN to the 'VIN Number' toggle, "
       "contradicting §4.13 and his own answer.")
note("SCH-TIP-01", VIN)
note("SCH-VIEW-04", VIN)

# =====================================================================
# 6. Spec-diff-only deltas (no PO question attached)
# =====================================================================
repl_line("SCH-SER-01", "expected",
          "3. Weekend columns inside the series are empty (no bar).",
          "3. Weekend columns inside the series are empty (no bar) when no business hours are set for those weekend days.")
drop_line("SCH-SER-01", "expected",
          "4. Visible breaks appear around skipped days and days the technician is otherwise booked.")
note("SCH-SER-01",
     "UPDATED 2026-07-31 from the live spec (" + SPEC + " §4.6 Month view; the change landed in "
     "Confluence v22, after our v18 baseline). v18 read 'empty weekend columns, and visible "
     "breaks around skipped or booked days.'; v23 reads 'empty weekend columns (when business "
     "hours are not set for weekends).' - so the breaks-around-skipped/booked-days clause was "
     "DELETED from the spec and is removed here, and the empty-weekend assertion is now "
     "conditional. It was also a live CONTRADICTION (Rule-28 Stage 2b, groups X1/X2) against "
     "SCH-SPREAD-07 ('shop closures and public holidays are NOT skipped in V1'; a Saturday with "
     "hours is NOT skipped) and SCH-SPREAD-08 ('in V1 the only skip reason is a weekend day "
     "with no working hours set') - if nothing but weekends is skipped, there are no skipped "
     "days for a banner to break around.")

drop_line("SCH-SER-02", "expected",
          "4. The banner breaks around the day the technician is otherwise booked.")
note("SCH-SER-02",
     "UPDATED 2026-07-31 from the live spec (" + SPEC + " §4.6 Week view; changed in Confluence "
     "v22). v18 read \"a 'week N of M' cue, and a break around any day the technician is "
     "otherwise booked.\"; v23 stops at \"a 'week N of M' cue.\" - the break-around-booked-days "
     "clause was DELETED from the spec and is removed here. Same contradiction group as "
     "SCH-SER-01 (Rule-28 Stage 2b, group X1).")

repl_line("SCH-DAY-06", "expected",
          "3. Hovering it shows a label (the current time).",
          "3. Hovering the now line while your pointer is over the grid shows a label (the current time).")
note("SCH-DAY-06",
     "UPDATED 2026-07-31 from the live spec (" + SPEC + " §4.8; changed in Confluence v22): "
     "'a label on hover' became 'a label on hover over the grid'. Build-accurate wording per "
     "Rule 9.")

set_field("SCH-EDGE-08", "refs",
          "SV-8685 (§11 (Dark theme - user-selectable Light / Dark, persisted per user))")
note("SCH-EDGE-08",
     "UPGRADED 2026-07-31: dark mode is NO LONGER tech-plan-only - it is spec text. " + SPEC +
     " §11 verbatim: 'Dark theme. The Schedule supports a user-selectable Light / Dark theme, "
     "chosen from the user menu and persisted per user. It is built on the design-system color "
     "tokens, so surfaces, borders, text, and accents remap automatically; elevation/shadow "
     "tokens also swap so depth reads correctly on dark surfaces.' (added in Confluence v19). "
     "References now carry the real spec anchor instead of a tech-plan checklist item (Rule 20). "
     "Cross-cutting NFR with no single story owner -> epic SV-8685 per Rule 20.")

# =====================================================================
# 7. Q3 - Week Export out of V1 scope -> RETIRE-CANDIDATE, HELD (nothing deleted)
# =====================================================================
note("SCH-EXP-01",
     "RETIRE-CANDIDATE 2026-07-31 - HELD FOR USER AUTHORIZATION, NOT RETIRED, NOT DELETED "
     "(Standing Rule 6). Q3 ANSWERED by the PO (" + RULING + ", verbatim: 'No. There is nothing "
     "about this in the PRD, not in the future requirements.') - Week Export / the printable "
     "week view is NOT in V1 and is not even in the future-considerations backlog, so this case "
     "tests something that will not exist. Independently corroborated: a full heading + text "
     "scan of " + SPEC + " finds no export or print item in §6 Grid toolbar, §9 View options or "
     "§15 Future considerations, and the engineering tech plan's §9 requirement table has none "
     "either. If authorized, retiring it also empties TestRail section 5406 'Week Export and "
     "Printing' and requires a run-357 resync (Rule 34). Its sibling SCH-EXP-02 (C38854) was "
     "already merged away in the 2026-07-31 consolidation, so this is the last survivor. "
     "viu_status deliberately LEFT as-is pending the ruling.")

# ---------------------------------------------------------------- write
if errors:
    print("\n!!! ABORTING - no files written. Assertion failures:")
    for e in errors:
        print("   -", e)
    sys.exit(1)

for f, data in files.items():
    json.dump(data, open(f, "w"), indent=2, ensure_ascii=False)
    open(f, "a").write("\n")

# ---------------------------------------------------------------- manifest
PUSH = ["SCH-EVT-08", "SCH-CAP-01", "SCH-MODAL-08", "SCH-EVT-01", "SCH-REAS-03",
        "SCH-EVT-03", "SCH-PERM-02", "SCH-PERM-04", "SCH-REAS-06", "SCH-CONF-03",
        "SCH-SER-01", "SCH-SER-02", "SCH-DAY-06", "SCH-EDGE-08"]
PUSHABLE = {"title", "preconditions", "steps", "expected", "refs"}
lines = ["# Pre-edit backup MANIFEST - Schedule / Branko answers 2026-07-31", "",
         f"Generated {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%SZ')} by `apply_answers.py`.",
         "", "## What is backed up here", "",
         "- `pre-edit-case-bodies-2026-07-31.json` - the EXACT pre-edit JSON body of every case",
         "  this pass touches (keyed by internal ID). Restore = copy the body back over the",
         "  matching entry in `../cases/cases-*.json`.",
         "- `cases-*.json.pre-edit` - byte-for-byte copies of every case FILE before any edit.",
         "  Restore = `cp backup/cases-X.json.pre-edit cases/cases-X.json`.", "",
         "## Cases touched", "",
         "| Internal ID | TestRail | Fields changed | Needs TestRail update_case? |",
         "|---|---|---|---|"]
idmap = {}
for row in open(os.path.join(HERE, "..", "testrail-id-map.csv")):
    p = row.split(",")
    idmap[p[0]] = p[1] if len(p) > 1 else ""
for cid in BACK_IDS:
    flds = sorted(touched.get(cid, set()))
    needs = "**YES**" if (set(flds) & PUSHABLE) else "no (local only)"
    lines.append(f"| {cid} | {idmap.get(cid,'?')} | {', '.join(flds) or 'none'} | {needs} |")
lines += ["", f"**{len(touched)} cases edited** - "
          f"{sum(1 for c in touched if set(touched[c]) & PUSHABLE)} need a TestRail "
          f"`update_case`, {sum(1 for c in touched if not (set(touched[c]) & PUSHABLE))} are "
          "notes-only and stay LOCAL (the executor pushes only title / custom_preconds / "
          "custom_steps / custom_expected / refs).", "",
          "**0 cases added · 0 cases retired · 0 cases deleted · 0 `viu_status` changes** "
          "(everything stays VIU-Pending - Schedule has no QA branch, Rule 12).", "",
          "SCH-EXP-01 is a **RETIRE-CANDIDATE held for user authorization** - it is annotated "
          "only; nothing was retired or deleted."]
open(os.path.join(BACKUP, "MANIFEST.md"), "w").write("\n".join(lines) + "\n")

print(f"\nEDITED {len(touched)} cases:")
for cid in BACK_IDS:
    if cid in touched:
        print(f"  {cid:<14} {sorted(touched[cid])}")
print(f"\npush-needed: {sum(1 for c in touched if set(touched[c]) & PUSHABLE)} "
      f"| local-only: {sum(1 for c in touched if not (set(touched[c]) & PUSHABLE))}")
print("manifest:", os.path.join(BACKUP, "MANIFEST.md"))
