"""Build the intended payload for all 168 Schedule cases.

Rule 54: exactly TWO provenance sentences that never merge -
  1. names ONLY documents
  2. "Last checked against build <marker> on <date>."
Rule 61: every expect-fail case carries the three-outcome block BEFORE the provenance line.
Rule 57: assertion bodies are NOT rewritten to the build. Only notes, provenance and markers move.
"""
import json, re

SNAP = 'build/schedule/full-viu-2026-08-05/snapshots/PRE-WRITE-168-2026-08-06.json'
SEP = '\n\n---\n'
MARKUP = re.compile(r'<(?:ol|li|ul|p|br|hr|div|strong|em|span|table|tr|td)\b', re.I)

OLD = ('v3.5-d122eef', '8/5/2026')
NEW = ('v3.5-7ec992f', '8/6/2026')

# ---------- per-case decisions ----------
# ticket -> the deviation is live and reproduces; symptom is what WE observed.
EXPECT_FAIL = {
 29927: ("SV-8826", "Week view runs Sunday to Saturday. The seven columns read Sunday Aug 2, Monday Aug 3, and so on to Saturday Aug 8, instead of starting on Monday."),
 29939: ("SV-8873", "Typing a technician's full name finds nothing. 'Andrew' on its own finds 14 work orders and 'Wade' on its own finds the same 14, but 'Andrew Wade' finds 0, and so do 'andrew wade' and 'Wade Andrew'. A full customer name such as 'Vuchester Retail' works, so it is not a problem with spaces."),
 29960: ("SV-8840", "Nothing highlights and nothing follows the cursor while you drag a line from the list on the left onto the grid. No cell lights up as a drop target, and the faint shape that does follow the cursor is empty - it does not show the line name or the hours."),
 29962: ("SV-8957", "There is no way to place a job by clicking. The work order card in the panel on the left has no button on it at all - not when you hover it, and not inside its line list - so dragging is the only way to schedule anything."),
 29975: ("SV-8924", "Giving an unassigned job to a technician quietly changes its saved start time to six hours earlier. A job booked for 7:00 in the morning is saved as 1:00 in the morning after it is assigned, with no warning."),
 29987: ("SV-8958", "In Month view the bar for a multi-day job does not say whose it is. It reads, for example, 'Xiriver Apparel  24069  19 Lines  Part of a series' with no technician name anywhere on it."),
 30001: ("SV-8837", "Day view opens showing midnight at the left-hand edge instead of the start of the working day. The working day starts at 6:00 AM, but 12 AM sits at the left edge, and stepping to the next day leaves it at midnight again."),
 30009: ("SV-8833", "The start and end time boxes accept any minute you like, not quarter hours. Typing 08:07 is accepted and it is still 08:07 after you click away."),
 30010: ("SV-8834", "The time-logged figure shows as fully complete when nothing has been clocked. A shift created moments earlier, on a line nobody has ever clocked into, reads 'TIME LOGGED 1h / 1h' with a full bar."),
 30014: ("SV-8852", "The clash warning appears but gives you no way to fix it. On a shift whose reason is 'Double-booked with ...', 'Extends past working hours' or 'Not a working day' there is no Adjust button - eight clashing shifts were checked and not one offered it. An Adjust button does exist for one other reason ('Starts before working hours'), so do not be surprised to see it there."),
 30035: ("SV-8959", "The clash warning is at the bottom of the hover tooltip instead of next to the customer name. The first row is just the customer name with no warning mark; the warning only appears in the last row."),
 30036: ("SV-8893", "The event's hover tooltip has no grey dot next to the event name. It shows the name, the date and time range and the technician, and no dot at all."),
 30041: ("SV-8874", "Searching in the grid removes the shifts that do not match instead of fading them. The non-matching blocks disappear from the grid entirely rather than staying visible and dimmed."),
 30045: ("SV-8941", "Month view prints the VIN on shift blocks when the VIN switch is on. It should be left off in Month view because the blocks are small. Day and Week views are correct."),
 30046: ("SV-8827", "Business Hours starts switched ON in View Options when it should start switched off. The other five options in that menu do start in the right position."),
 30050: ("SV-8851", "Turning on Tech Hours in View Options changes nothing you can see. None of the technician rows shows its working hours, on any day."),
 30086: ("SV-8942", "The whole page slides sideways instead of just the grid, and the panel on the left never folds away. At 960 pixels wide - which is the narrowest width the Schedule is meant to support - the page is still 1030 pixels wide and the panel is still its full width. Narrowing further changes neither."),
 30087: ("SV-8913", "The list of work orders on the left does not scroll continuously. It shows 18 cards with a 'Load More' button at the bottom, even though 91 work orders exist."),
 38865: ("SV-8848", "The start times on either side of the clock change do not read the same. The same job reads 12 PM before 1 November and 1 PM after it. The times are stored correctly underneath - it is the times shown on screen that are wrong, and every Schedule time is shown six hours late for the same reason."),
 43554: ("SV-8863", "The Schedule opens on Week view. Week is the highlighted button and the grid draws the seven-column week layout."),
 43556: ("SV-8867", "A shift that is part of a repeating series cannot be moved to another technician in Week or Month view - the block lifts, moves, and then springs back to where it was."),
}

# cases that FLIPPED to PASS and must lose their now-false note + expect-fail marker
FLIPPED_PASS = {
 29946: "SV-8857 is fixed: the Filters button now shows a count badge and a 'Clear all' control resets every filter in one click.",
 29970: "The shop now has business hours set, so this test can be run.",
 29988: "SV-8849 is fixed: the series block opens from Week view, and the banner now carries an edge chevron and a 'Week 1 of 2' cue.",
 29999: "SV-8850 is fixed: the '+N more' link now lists the hidden shifts and they open when clicked.",
 30012: "SV-8829's inline editor now exists.",
 30017: "The Day-view live preview is now built.",
 30034: "The tooltip now caps the line names at three and adds a '+N more lines' row.",
 30066: "SV-8853 no longer reproduces: Escape closes both confirmation windows on the first press.",
 30068: "SV-8853 no longer reproduces: Enter now confirms the reassign window.",
 38863: "The feature this test checks is now built.",
 38873: "The feature this test checks is now built: the over-long series is refused with a clear message, the acknowledgement lets it through, and the 120-shift cap cannot be overridden.",
}

# markers for everything that is not a plain READY or an expect-fail
HOLD = {
 # the 7 that could not be re-driven this session
 29967: "not re-checked against the current build - it needs a drag that could not be completed",
 29982: "not re-checked against the current build - it needs a drag that could not be completed",
 29984: "not re-checked against the current build - it needs a drag that could not be completed",
 29985: "not re-checked against the current build - it needs a drag that could not be completed",
 30004: "not re-checked against the current build - it needs a drag that could not be completed",
 30013: "not re-checked against the current build - it needs a drag that could not be completed",
 30020: "not re-checked against the current build - it needs a drag that could not be completed",
 # the 12 never observed - need a second sign-in as another user
 30074: "needs a second sign-in as a view-only user", 30075: "needs a second sign-in as a view-only user",
 30076: "needs a second sign-in as a user without the Schedule permission",
 30077: "needs a second sign-in as an edit-without-delete user",
 30078: "needs a second sign-in as an edit-without-delete user",
 30079: "needs a second sign-in as a delete-capable user",
 30081: "needs a second sign-in as a user who cannot see work orders",
 30082: "needs a second sign-in as a view-only technician",
 30084: "needs a second sign-in as each of the two staff members",
 30614: "needs a second sign-in as a user who cannot see work orders",
 38872: "needs three separate sign-ins, one per permission level",
 38874: "needs a second sign-in as a user who cannot see work orders",
 38926: "needs a second sign-in as a holder of each permission level",
 # genuinely absent product / open PO question
 29983: "waiting on the product owner's answer, and the question has not been sent yet",
 30089: "waiting on the product owner's answer, and the shop-closure setting does not exist in the build",
 43555: "waiting on the product owner's answer, and the question has not been sent yet",
 30044: "needs a second sign-in as a user with no staff record of their own",
 38867: "cannot be run now - it needs shifts noted BEFORE the release, and the release is already deployed",
 38868: "the Dashboard section this test needs does not exist in the build",
 38869: "work order creation offers no appointment in the build",
 38871: "the Priority field this test needs does not exist in the build",
}

# a plain tester note owed to C29972 (its three siblings carry one)
C29972_NOTE = ("Note for the tester: every time on the Schedule is currently shown six hours later than the time it "
  "was booked for. That is already reported as SV-8848 (https://shopview.atlassian.net/browse/SV-8848). Read the "
  "position on the timeline rather than the printed time, and do not raise it again.")


def rule61(ticket, symptom):
    return (f"What you should see today: {symptom} This is a known problem and it is already reported - see "
            f"https://shopview.atlassian.net/browse/{ticket}\n"
            f"· If you see exactly that, mark this test FAILED and do not raise anything new.\n"
            f"· If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.\n"
            f"· If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed.")


NOTE_START = re.compile(r'^(Known issue on the build (tested|checked)|Not built on the build tested|'
                        r'DO NOT AUTOMATE YET|This test cannot be run on the build tested|'
                        r'What you should see today)')


def build(case, build_marker, build_date):
    cid = case['id']
    e = case['custom_expected']
    if MARKUP.search(e) or MARKUP.search(case.get('custom_steps') or '') or MARKUP.search(case.get('custom_preconds') or ''):
        raise RuntimeError(f"C{cid}: RAW MARKUP present - refusing to write (a writer must never append to a case whose text carries raw HTML)")
    i = e.rindex(SEP)
    head, tail = e[:i], e[i + len(SEP):]
    j = tail.index('\n\nAUTOMATION:')
    prov_full = tail[:j]
    # sentence 1 = documents only
    k = prov_full.find(' Last checked against build ')
    if k < 0:
        raise RuntimeError(f"C{cid}: provenance has no 'Last checked against build' clause")
    sent1 = prov_full[:k].rstrip()
    sent2 = f"Last checked against build {build_marker} on {build_date}."

    paras = [p for p in head.split('\n\n')]
    # drop every existing build-state note paragraph; they are rebuilt below
    paras = [p for p in paras if not NOTE_START.match(p.strip())]

    if cid in EXPECT_FAIL:
        ticket, symptom = EXPECT_FAIL[cid]
        paras.append(rule61(ticket, symptom))
        marker = f"AUTOMATION: READY - EXPECT FAIL ({ticket})"
    elif cid in HOLD:
        marker = f"AUTOMATION: HOLD - {HOLD[cid]}"
    else:
        marker = "AUTOMATION: READY"

    if cid == 29972 and not any('SV-8848' in p for p in paras):
        paras.append(C29972_NOTE)

    new_head = '\n\n'.join(p for p in paras if p.strip())
    out = new_head + SEP + sent1 + ' ' + sent2 + '\n\nAUTOMATION: ' + marker.split('AUTOMATION: ', 1)[1] + '\n'

    # invariants
    assert out.count('This is the expected behaviour as per') == 1, f"C{cid}: provenance count"
    assert out.count('AUTOMATION:') == 1, f"C{cid}: marker count"
    assert out.count('Last checked against build') == 1, f"C{cid}: build stamp count"
    assert not MARKUP.search(out), f"C{cid}: markup leaked in"
    return out, marker


def main():
    cases = {c['id']: c for c in json.load(open(SNAP))}
    state = json.load(open('/tmp/schedule-viu/state168.json'))
    plan = {}
    for cid, c in sorted(cases.items()):
        st = state[str(cid)]
        bm, bd = (st['build'], st['date'])
        newexp, marker = build(c, bm, bd)
        plan[cid] = {
            'id': cid, 'internal': st.get('iid'), 'verdict': st.get('v'),
            'build': bm, 'date': bd, 'marker': marker,
            'changed': newexp != c['custom_expected'],
            'custom_expected': newexp,
            'custom_preconds': c.get('custom_preconds') or '',
            'custom_steps': c.get('custom_steps') or '',
        }
    json.dump(plan, open('/tmp/schedule-viu/write/plan.json', 'w'), indent=1)
    from collections import Counter
    print('cases planned:', len(plan))
    print('changed:', sum(1 for v in plan.values() if v['changed']))
    fam = Counter(('EXPECT FAIL' if 'EXPECT FAIL' in v['marker'] else ('HOLD' if 'HOLD' in v['marker'] else 'READY')) for v in plan.values())
    print('markers:', dict(fam))
    print('build split:', dict(Counter(v['build'] for v in plan.values())))


if __name__ == '__main__':
    main()
