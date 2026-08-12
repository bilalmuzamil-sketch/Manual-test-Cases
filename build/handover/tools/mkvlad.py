#!/usr/bin/env python3
"""Assemble vlad.json — every case we created, updated or deleted on 11 and 12 August,
established from the committed per-operation logs AND verified against live TestRail.

Section A is the operative one: cases TestRail flags as Automated (custom_atmstatus = 3),
each confirmed from get_history_for_case to have been flagged by Vladimir Tomovic himself.
"""
import json, collections

PM = json.load(open('/tmp/hand12/passmap.json'))         # pass -> cases it wrote
LIVE = json.load(open('/tmp/hand12/changed_ids.json'))   # project -> {updated, created}
PROV = json.load(open('/tmp/hand12/prov.json'))          # per-case live fields
MD = json.load(open('/tmp/hand12/markerdiff.json'))      # what actually moved
ATM = json.load(open('/tmp/hand12/atmhist.json'))        # who set the Automated flag
OUT = '/home/user/Manual-test-Cases/build/handover/vlad.json'

PROJ_OF = {}
TITLE = {}
ATMNOW = {}
for proj, rows in PROV.items():
    for r in rows:
        if not r['foreign']:
            PROJ_OF[r['id']] = proj
            TITLE[r['id']] = r['title']
            ATMNOW[r['id']] = r['atm']

# ---------------------------------------------------------------- pass descriptions
# One plain phrase per pass. Derived from each pass's own committed CHANGES-MADE.md
# / execution log, not invented.
PASS = {
    'read-dates-2026-08-11': (
        "The date we read each source ('read on 11 August 2026') was added to the sourcing line "
        "at the bottom of the expected results.", False),
    'refs-pins-2026-08-11': (
        "The References field was updated so the product-description version it cites is the "
        "current one.", False),
    'refs-cleanup-2026-08-11': (
        "The References field was tidied — a missing version pin added, or a stray comma "
        "repaired.", False),
    'dated-provenance-2026-08-11': (
        "Corrected the sourcing line, and on one case corrected the tab names in the expected "
        "result to match the product description.", None),
    'label-vs-behaviour-2026-08-11': (
        "Corrected an on-screen name (a tab label) so it reads the way the product actually "
        "shows it. The thing being checked did not change — only the words used to point at it.",
        None),
    'spec-delta-2026-08-11': (
        "Applied a change the product owner made to the written description. Some of these "
        "rewrote what the case asserts.", None),
    'build-verify-2026-08-11': (
        "Corrected a button name to the exact wording the build shows.", None),
    'c29600-fix-2026-08-11': (
        "Corrected which document the case cites as the source of its expected behaviour. "
        "Title, steps and every expected outcome are byte-identical to what was there before.",
        False),
    'sv9041-2026-08-11': (
        "Rewrote the case against a newly published requirement about the collapse control.",
        None),
    'build-viu-2026-08-12': (
        "Part of the 12 August build check: the build stamp at the bottom of the case was re-cut "
        "to the build running today.", None),
    'drag-retry-2026-08-12': (
        "Driven live for the first time on 12 August. The expected behaviour did NOT change - what "
        "was added is the exact symptom you will see today and what to do about it.", None),
    'labels-final-2026-08-11': (
        "Corrected on-screen names to the exact wording the build shows.", None),
    'panel-collapse-2026-08-11': (
        "New case, written for the panel-collapse requirement.", None),
    'staged-push-2026-08-11': (
        "Corrections from the 11 August build check — labels, navigation and build stamps.",
        None),
    'followup-push-2026-08-11': (
        "Correction from the 11 August build check.", None),
    'c30041-latest-wins-2026-08-11': (
        "Applied the newer of two conflicting sources to the expected behaviour.", None),
}

by_case = collections.defaultdict(list)
for p, ids in PM.items():
    short = p.split('/')[-1]
    for i in ids:
        by_case[i].append(short)

# what actually moved, from the live-vs-baseline diff
moved_marker, moved_title, moved_body, created = {}, set(), set(), set()
for proj, d in MD.items():
    for m in d['marker_moved']:
        moved_marker[m['id']] = (m['from'], m['to'])
    moved_title |= set(d['title_changed'] if isinstance(d['title_changed'][0], int)
                       else [x['id'] for x in d['title_changed']]) if d['title_changed'] else set()
    moved_body |= set(d['body_changed'])
    created |= set(d['created_after_snapshot'])

# cases created in the window, live
for proj, d in LIVE.items():
    created |= set(d['created'])

# Passes that ran BEFORE the diff baseline, so their edits are invisible to it.
# Taken from those passes' own committed records rather than guessed.
PRE_BASELINE_BODY = {
    29623: "The button name in the steps and the expected result was corrected from "
           "'Apply filters' to 'Apply Filters' — the build shows a capital F.",
    29622: "Button name corrected to 'Apply Filters'.",
    29624: "Button name corrected to 'Apply Filters'.",
    29625: "Button name corrected to 'Apply Filters'.",
    29626: "Button name corrected to 'Apply Filters'.",
    29627: "Button name corrected to 'Apply Filters'.",
    29595: "Wording corrected to the build's own.",
    29596: "Wording corrected to the build's own.",
    30452: "The four tab names in the expected result were changed to lower case, to match the "
           "product description rather than the build's own capitalisation. This is a verdict "
           "change, not a tidy-up.",
    30434: "Title and wording corrected; the download-order check was deliberately excluded.",
    30172: "A tab name was corrected to the wording the build shows.",
    30173: "A tab name was corrected to the wording the build shows.",
    30194: "A tab name was corrected to the wording the build shows.",
    30436: "A tab name was corrected to the wording the build shows.",
    30462: "A tab name in the expected result was corrected to the wording the build shows; "
           "what is being asserted (which tab a job lands in) did not change.",
    30464: "A tab name was corrected to the wording the build shows.",
    30488: "A tab name in the preconditions was corrected to the wording the build shows.",
    30489: "A tab name was corrected to the wording the build shows.",
    30490: "A tab name was corrected to the wording the build shows.",
    30041: "The expected behaviour was re-sourced to the newer of two conflicting documents.",
}

# Per-case overrides for the Automated set, transcribed from the passes' own records.
SPECIFIC = {
    30107: ("The title, the steps and the expected outcomes were rewritten. It used to assert "
            "'exactly three options, in this order: Parts & Service, Parts only, Service only'. "
            "That control is now a multi-select with two pinned rows ('All products', 'Clear "
            "all') above two toggles reading 'Parts' and 'Services', both on by default. The "
            "case also gained a note that the exports still print the older wordings.", True,
            "YES. The assertion itself changed, and so did the option names. Anything asserting "
            "three options in a fixed order, or matching 'Parts only' / 'Service only' on "
            "screen, will now be wrong."),
    30352: ("Expected outcome 3 changed from 'When more than one location is in scope the "
            "Location column shows as well' to 'If your login can reach more than one location "
            "the Location column shows as well' — the trigger moved from what is selected to "
            "what the login can reach. The tester note was also replaced with a narrower one "
            "naming two points still with the product owner.", True,
            "YES. The condition under which the Location column is expected changed. A check "
            "that varies the location SELECTION to make the column appear will now be testing "
            "the wrong trigger."),
    30462: ("A tab name was corrected to the wording the build shows, and the automation marker "
            "moved from READY to HOLD because the written description now states two different "
            "rules for which tab a job lands in.", True,
            "YES. It has moved to HOLD — it should come OUT of an automated run until the product "
            "owner settles which rule governs."),
    30452: ("The four tab names in the expected result were changed to lower case, to match the "
            "product description rather than the build's own capitalisation.", True,
            "YES. If a check compares the tab labels as text, it will now disagree with the build "
            "on purpose — this case is expected to find a difference."),
    30488: ("A tab name in the preconditions was corrected to the wording the build shows.", True,
            "PROBABLY. Only the words used to find the tab changed, not what is asserted — but if "
            "a check matches that string, it needs the new one."),
    30518: ("The automation marker moved from 'expect this to fail' to plain READY, and the "
            "paragraph telling the tester that nothing downloads was removed. The underlying "
            "problem (Work In Progress downloads failing) is fixed — proven by 8 successful "
            "downloads out of 8.", True,
            "YES, and this is the most important row here. If your suite still expects this to "
            "fail, invert it. It should now pass."),
    29623: (PRE_BASELINE_BODY[29623], True,
            "YES. If a check clicks or asserts a button named 'Apply filters', it needs the "
            "capital F."),
    30510: ("The build stamp was re-cut to the build checked today. Nothing else changed.", False,
            "No."),
    30515: ("The build stamp was re-cut to the build checked today. Nothing else changed.", False,
            "No."),
    29600: ("Corrected which document the case cites as the source of its expected behaviour. "
            "Title, steps and every expected outcome are byte-identical to what was there "
            "before.", False,
            "No. Nothing an automated check evaluates has changed."),
}

AUTOMATED = sorted(ATM.keys(), key=int)
AUTOMATED = [int(x) for x in AUTOMATED]


def describe(cid):
    """Return (what changed, affects?) for a case."""
    if cid in SPECIFIC:
        txt, _, verdict = SPECIFIC[cid]
        return txt, verdict
    if cid in created:
        return "New case.", "This is a new test, not a change to an existing one."

    # The concrete movements first — they are what he needs to see.
    lead, routine = [], []
    affects = False
    if cid in moved_marker:
        a, b = moved_marker[cid]
        lead.append(f"Automation marker moved: {a or 'none'}  ->  {b or 'none'}.")
        affects = True
    if cid in moved_title:
        lead.append("The title changed.")
        affects = True
    if cid in PRE_BASELINE_BODY:
        lead.append(PRE_BASELINE_BODY[cid])
        affects = True
    elif cid in moved_body:
        lead.append("The preconditions, steps or expected outcomes were edited.")
        affects = True

    for p in sorted(by_case.get(cid, [])):
        phrase, _ = PASS.get(p, (f"Edited in the {p} pass.", None))
        routine.append(phrase)

    if affects:
        txt = " ".join(dict.fromkeys(lead + ["Also: "] + routine)).replace("Also:  ", "Also: ")
        return txt, "YES — something a check reads changed. Please look at this one."
    txt = " ".join(dict.fromkeys(routine)) + \
        " Nothing a tester reads, and nothing a check evaluates, changed."
    return txt, ("No. Only the sourcing line or the References field moved.")


rows_a, rows_b, rows_c = [], [], []
for proj in ('Filters', 'Schedule', 'Report Suite'):
    ids = set(LIVE[proj]['updated']) | set(LIVE[proj]['created'])
    for cid in sorted(ids):
        what, aff = describe(cid)
        row = {'id': cid, 'project': proj, 'title': TITLE.get(cid, ''),
               'what': what, 'affects': aff,
               'automated': ATMNOW.get(cid) == 3,
               'flagged_by': (ATM.get(str(cid), {}).get('setters') or [{}])[-1].get('by')
                             if str(cid) in ATM else None,
               'flagged_on': (ATM.get(str(cid), {}).get('setters') or [{}])[-1].get('on')
                             if str(cid) in ATM else None}
        if cid in created:
            rows_c.append(row)
        elif row['automated']:
            rows_a.append(row)
        else:
            rows_b.append(row)

# band A so the ones that matter sit at the top
rows_a.sort(key=lambda r: (not r['affects'].startswith('YES'), r['project'], r['id']))

summary = {
    'A': len(rows_a), 'B': len(rows_b), 'C': len(rows_c),
    'A_affecting': sum(1 for r in rows_a if r['affects'].startswith(('YES', 'PROBABLY'))),
    'deleted': 0,
    'total': len(rows_a) + len(rows_b) + len(rows_c),
    'per_project': {p: {'updated': len(LIVE[p]['updated']), 'created': len(LIVE[p]['created'])}
                    for p in LIVE},
}
json.dump({'A': rows_a, 'B': rows_b, 'C': rows_c, 'summary': summary}, open(OUT, 'w'), indent=1)
print(json.dumps(summary, indent=1))
print('\nSection A, banded:')
for r in rows_a:
    print(f"  C{r['id']} [{r['project'][:4]}] {r['affects'][:34]:36} {r['title'][:44]}")
