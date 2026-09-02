#!/usr/bin/env python3
"""Build the write payload for the AUTOMATED cases the QA lead authorised on 2026-09-02.

AUTHORISATION (verbatim, 2026-09-02): "yes this case needs to be updated, and all those test case
also need to be updated which are automated but yet they should be updated to make them runnable and
Build verified. This authorization is for these three suites for now. 1. Invoice refresh 2. Inline Add
Part 3. Workorder Print"

SCOPE, derived live from TestRail (never from a local list):
  13 cases carry custom_atmstatus = 3 across the three suites.
  C45220 is EXCLUDED: created_by = 1, Vladimir Tomovic. His cases are never changed, on any
  authorisation ("If the creator is Vladimir leave the test cases as is - remember this rule").
  => 12 in scope. This pass writes the 7 whose correct labels are PROVEN; the 5 Invoice cases quote
  two labels ("Approves Work", "Part Sales") that have never been observed on the build, so they
  need a probe first and are NOT in this payload (Rule 12: never assert an unobserved label).

WHAT CHANGES, AND WHY EACH LABEL IS TRUSTED
  6 Inline cases (C45005, C45026, C45223, C45224, C45227, C45237): preconditions 2 and 3 name
  "Work Order Line - Create and Edit" and "Work Orders -> Work Order View Mode". NEITHER STRING
  EXISTS. The QA lead's 2026-09-02 screenshots of the role-edit screen show the real thing:
    * a section headed "Work order lines", described "Add, edit, and remove the individual labor and
      part lines on a work order.", with columns "Create & Edit" and "Delete"
    * a section headed "Work orders", described "Manage work orders the core operational records in
      ShopView.", with columns "View", "Create & Edit", "Delete"
    * beneath it a block headed "View mode", described "Controls interface complexity, not access
      controls.", offering "Full View" and "Tech view"
  Only those two lines change; every other line is copied from the live case byte for byte.

  C45123 (Printer Friendly, "Printing logs a Work Order Printed event in audit history"): its steps
  said "Open the work order's audit history" and named nothing to click, so it failed the runnability
  gate. The QA lead's screenshots give the whole route: the three-dots button at the top right of the
  work order (between "SHOPCOACH ANALYSIS" and "New Line") -> "Audit Log" -> a window titled
  "Work Order Log" with a "Search" box and columns "Event", "User", "Line", "Details", "Date", "Time",
  whose event rows read "Work order printed".

  🛑 AND IT CORRECTS A FINDING THAT WAS MY OWN READING ERROR. The 2026-09-01 pass recorded the event
  as "Work order printed history" and raised a wording divergence against the requirement's
  "Work Order Printed". There is no divergence. probe_print3.mjs line 52 read each row with
  `tr.innerText`, which flattens the row into one string -- and the Event cell carries a clock icon
  whose own text is "history", immediately after the event name. So "history" was the ICON, not the
  label. The divergence is withdrawn and the case now names the real label.

  Its marker also moves from "Not available on Build to test Yet" to "AUTOMATION: READY" with the
  Rule-54 build sentence: the behaviour was verdicted PASS live on 2026-09-01 and is re-proven by the
  screenshots, so the deferred marker is now a false statement about the build.
"""
import json, re, html, sys, pathlib

LIVE = {}
for f in pathlib.Path('/tmp/dx').glob('cases-*.json'):
    for c in json.load(open(f)):
        LIVE[c['id']] = c

def lines_of(field_html):
    """A TestRail block-HTML field written through the editor is one <p> whose lines are <br>s.
    Return them as the editor's own line list, tags stripped, entities decoded."""
    s = field_html or ''
    s = re.sub(r'</p>\s*<p>', '\n\n', s)
    s = re.sub(r'<br\s*/?>', '\n', s, flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    return [ln.strip() for ln in html.unescape(s).split('\n')]

INLINE_6 = [45005, 45026, 45223, 45224, 45227, 45237]

# Only CLICKABLE labels are put in quotes. The role screen's descriptive sentences are paraphrased,
# not quoted: quoting them would read as a label to the tester and to check_precond_labels.py.
NEW_P2 = (
    'Your role can add and edit part lines. To check it: open “Settings”, click '
    '“Roles & Permissions” in the sidebar, click the pencil on the role your user is on, and scroll '
    'to the section headed “Work order lines” — it is the one about adding, editing and removing the '
    'labor and part lines on a work order. Make sure the box in its “Create & Edit” column is ticked.'
)
NEW_P3 = (
    'Your role is on Tech view. On the same role screen, find the section headed “Work orders”, and '
    'directly beneath it the block headed “View mode”, which controls interface complexity rather '
    'than access. It offers “Full View” and “Tech view” — click “Tech view”, then click “Save” at the '
    'bottom of the role screen.'
)

OLD_P2 = re.compile(r"^2\.\s.*Work Order Line\s*-\s*Create and Edit")
OLD_P3 = re.compile(r"^3\.\s.*Work Order View Mode")

payload = {}
snapshot = {}

for cid in INLINE_6:
    c = LIVE[cid]
    src = lines_of(c['custom_preconds'])
    out, hit2, hit3 = [], 0, 0
    for ln in src:
        if OLD_P2.match(ln):
            out.append('2. ' + NEW_P2); hit2 += 1
        elif OLD_P3.match(ln):
            out.append('3. ' + NEW_P3); hit3 += 1
        else:
            out.append(ln)
    assert hit2 == 1 and hit3 == 1, f'C{cid}: expected one line 2 and one line 3, got {hit2}/{hit3}'
    out = [l for l in out if l != '']
    # apply_cases.mjs verifies the WHOLE case after any write, custom_expected included, so the
    # marker and Rule-54 sentence 2 that are ALREADY on the case must be declared here even though
    # this pass does not touch that field. They are read off the live case, never invented: the
    # behaviour was verified on 2026-09-01 and that date must not drift because a precondition was
    # reworded (Rule 77 - the check is still inside its validity window).
    exp = html.unescape(re.sub('<[^>]+>', '\n', c['custom_expected'] or ''))
    mk = [l.strip() for l in exp.split('\n') if l.strip().startswith('AUTOMATION:')]
    bs = [l.strip() for l in exp.split('\n') if l.strip().startswith('Last checked against build')]
    assert len(mk) == 1, f'C{cid}: expected exactly one AUTOMATION marker, found {mk}'
    payload[str(cid)] = {
        'title': c['title'],
        'verdict': 'PASS',
        'marker_override': mk[0],
        'build_sentence': bs[0] if bs else None,
        'fields': {'custom_preconds': {'blocks': [out], 'text': '\n'.join(out)}},
    }
    snapshot[str(cid)] = {
        'title': c['title'], 'atm': c.get('custom_atmstatus'), 'section_id': c['section_id'],
        'refs': c.get('refs'), 'provenance': [],
        'before': {'custom_preconds': c['custom_preconds']},
    }

# ---------------- C45123 ----------------
c = LIVE[45123]
pre = [
    '1. In the top menu click “Work Orders”, then click a work order’s row in the list to open it. '
    'It opens on its “Lines” tab.',
    '2. The work order has at least one line item — the “Lines” tab shows a count beside it and that '
    'count is not zero. With no line items the print option is greyed out and this case cannot be run.',
]
stp = [
    '1. At the top right of the work order, between “SHOPCOACH ANALYSIS” and the “New Line” button, '
    'click the three-dots button, then choose “Print Work Order”. Send or cancel the print dialog '
    'your browser opens — the event is logged either way.',
    '2. Click the same three-dots button again and choose “Audit Log”.',
    '3. A window titled “Work Order Log” opens, with a “Search” box and the columns “Event”, “User”, '
    '“Line”, “Details”, “Date” and “Time”. Read its top row.',
]
body = [
    '1. The top row of the “Event” column reads “Work order printed”, and it is the most recent entry '
    'in the window.',
    '2. On that row: “User” names the person who printed, “Line” shows “-”, “Details” shows the work '
    'order total (for example “Total: $6,389.62”), and “Date” and “Time” show when the print happened.',
]
prov = [
    'This is the expected behaviour as per epic SV-9383 and story SV-9389 (Story 6, Audit Trail) and '
    'the Printer Friendly Work Orders specification version 8, section S6-R1, read on 25 August 2026.',
    'Last checked against build v26.35.6-598cc8a on 9/2/2026.',
]
marker = 'AUTOMATION: READY'
payload['45123'] = {
    'title': c['title'],
    'verdict': 'PASS',
    'marker_override': marker,
    # apply_cases.mjs asserts sentence 2 per case: a build sentence in the text WITHOUT this key is
    # treated as a claim about a case that is not build-verified, and the write is failed. C45123 was
    # verdicted PASS live on 2026-09-01 and is re-proven by the 2026-09-02 screenshots, so the
    # sentence is legitimate and must be declared here.
    'build_sentence': 'Last checked against build v26.35.6-598cc8a on 9/2/2026.',
    'fields': {
        'custom_preconds': {'blocks': [pre], 'text': '\n'.join(pre)},
        'custom_steps': {'blocks': [stp], 'text': '\n'.join(stp)},
        'custom_expected': {'blocks': [body, ['---'], prov, [marker]],
                            'text': '\n\n'.join(['\n'.join(b) for b in (body, ['---'], prov, [marker])])},
    },
}
snapshot['45123'] = {
    'title': c['title'], 'atm': c.get('custom_atmstatus'), 'section_id': c['section_id'],
    'refs': c.get('refs'), 'provenance': [],
    'before': {k: c[k] for k in ('custom_preconds', 'custom_steps', 'custom_expected')},
}

D = pathlib.Path('build/automated-cases-2026-09-02')
json.dump(payload, open(D / 'intended-blocks.json', 'w'), indent=1, ensure_ascii=False)
json.dump(snapshot, open(D / 'PRE-snapshot.json', 'w'), indent=1, ensure_ascii=False)
json.dump(sorted(int(k) for k in payload), open(D / 'automated-authorised.json', 'w'))
print('payload cases:', ', '.join('C' + k for k in payload))
print('authorised   :', json.load(open(D / 'automated-authorised.json')))
