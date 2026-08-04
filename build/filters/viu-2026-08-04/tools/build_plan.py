#!/usr/bin/env python3
"""Build the TestRail edit plan for the 2026-08-04 Filters VIU pass.

Produces plan.json: one entry per case with the pre-write snapshot (read live) and the
exact intended field values.  Nothing is written here.
"""
import json, os, re, sys, csv, html

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import findings as F
import verdicts as V

ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
LIVE = {c['id']: c for c in json.load(open('/tmp/fviu/live-cases-4110.json'))}
IDMAP = {int(r['testrail_case_id'][1:]): r['internal_id']
         for r in csv.DictReader(open(os.path.join(ROOT, 'build', 'filters', 'testrail-id-map.csv')))}
BY_IID = {v: k for k, v in IDMAP.items()}

TR = 'https://shopview.atlassian.net/browse/'
BRANKO_FILE = ('build/filters/branko-answers-2026-08-04/answers-ingested.md '
               '(https://github.com/bmuzamil-shopview/Manual-test-Cases/blob/main/'
               'build/filters/branko-answers-2026-08-04/answers-ingested.md)')

# ---- 1. build-accurate label corrections (Rule 9) ---------------------------------
LABEL_FIX = [
    ("'Clear selection'", "'Clear Selection'"),
    ('"Clear selection"', '"Clear Selection"'),
    ('Clear selection',   'Clear Selection'),
    ("'Clear filters'",   "'Clear Filters'"),
    ('Clear filters',     'Clear Filters'),
    ('Asset on site',     'Asset on Site'),
    ("'Search customer'", "'Search'"),
    ('Search customer',   'Search'),
    ("'Search technician'", "'Search'"),
    ('Search technician',  'Search'),
    ("'Search advisor'",   "'Search'"),
    ('Search advisor',     'Search'),
    ('New Work Order',     'Create Work Order'),
    ("'Back to my view'",  "'Back To My Saved Filters'"),
    ('Back to my view',    'Back To My Saved Filters'),
]

# ---- 2. targeted rewrites, per case ----------------------------------------------
# each entry: list of (find, replace) applied to the whole body after LABEL_FIX
REWRITE = {
 # H2 - the Status chip is HIDDEN on Estimates and Completed, not greyed out
 'FLT-TAB-02': [
   ('Completed tab: Status chip greyed out and pre-filled; other four still work',
    'Completed tab: the Status chip is not shown; the other four filters still work'),
   ('The Status chip is not usable on this tab: it is shown greyed out and already filled in with the tab\'s own status, and cannot be clicked.',
    'The Status chip is not shown on this tab at all - only four chips appear.'),
 ],
 'FLT-TAB-03': [
   ('Estimates tab: Status chip greyed out and pre-filled; other four still work',
    'Estimates tab: the Status chip is not shown; the other four filters still work'),
   ('The Status chip is not usable on this tab: it is shown greyed out and already filled in with the tab\'s own status, and cannot be clicked.',
    'The Status chip is not shown on this tab at all - only four chips appear.'),
 ],
 'FLT-BAR-03': [
   ('The Status chip is not usable on this tab: it is shown greyed out and already filled in with the tab\'s own status, and cannot be clicked.',
    'The Status chip is not shown on this tab at all - only four chips appear.'),
 ],
 # BAR-02: remove the design-only leading-icon assertion (build + spec agree: name + chevron)
 'FLT-BAR-02': [
   ('In the design the icons are: a spinner for Status, a person for Customer, a wrench for Lead Technician, a headset for Service Advisor and a truck for Asset on Site.',
    'Each chip shows only the filter name and the arrow - there is no picture icon in front of the name.'),
   ('Each chip shows a small icon, the filter name and a down arrow (chevron) indicating it opens a dropdown.',
    'Each chip shows the filter name and a down arrow (chevron) indicating it opens a dropdown.'),
 ],
 # CUST-01: the in-dropdown search box is NOT auto-focused
 'FLT-CUST-01': [
   ("A search input with the placeholder 'Search' is at the top, already focused so you can type right away.",
    "A search box with the placeholder 'Search' is at the top of the panel. Click it before you type - it is not focused for you automatically."),
 ],
 # TECH-03 / ADV-03: selection is shown as a checkmark plus a tag, not a filled checkbox
 'FLT-TECH-03': [('filled checkbox', 'checkmark on the row, and as a small removable tag above the list')],
 'FLT-ADV-03':  [('filled checkbox', 'checkmark on the row, and as a small removable tag above the list')],
 # CHIP-02: the chip shows a comma list truncated with an ellipsis
 'FLT-CHIP-02': [
   ('the chip shows the first value followed by a count of the extra ones',
    'the chip shows the values separated by commas, cut short with three dots when there are too many to fit'),
 ],
}

# ---- 3. the extra lines that go at the END of Expected Results --------------------
KNOWN_ISSUE = {
 # case -> (ticket, plain sentence)
 'FLT-BAR-01': ('SV-8843', 'Known issue: on the build tested the filter buttons sit on the same row as the tabs instead of on their own row below them. Until it is fixed this test is expected to fail on that point - it is already reported.'),
 'FLT-COLL-02': ('SV-8843', 'Known issue: on the build tested collapsing the bar does not move the table up, because the buttons share the tab row. Until it is fixed this test is expected to fail on that point - it is already reported.'),
 'FLT-EMPTY-01': ('SV-8847', 'Known issue: when only a search is active the message still says "filters" and the only link offered is Clear Filters. Until it is fixed this test is expected to fail on that point - it is already reported.'),
 'FLT-EMPTY-02': ('SV-8847', 'Known issue: the empty screen offers no way to clear the search on its own. Until it is fixed this test is expected to fail on that point - it is already reported.'),
 'FLT-PSRCH-09': ('SV-8847', 'Known issue: the empty screen offers no way to clear the search on its own. Until it is fixed this test is expected to fail on that point - it is already reported.'),
 'FLT-URL-02': ('SV-8845', 'Known issue: on a phone-sized screen a link carrying filters shows the buttons as on but lists the wrong work orders. On a desktop screen it works. Until it is fixed the phone half of this test is expected to fail - it is already reported.'),
 'FLT-MOB-10': ('SV-8845', 'Known issue: on a phone a link carrying filters shows the buttons as on but lists the wrong work orders. Until it is fixed this test is expected to fail on that point - it is already reported.'),
 'FLT-URL-03': ('SV-8832', 'Known issue: a value in the address bar that no longer exists is still sent to the server, so you get an empty list instead of the list without that value. Until it is fixed this test is expected to fail on that point - it is already reported.'),
 'FLT-URL-04': ('SV-8832', 'Known issue: a broken address is not fully ignored - a wrong tab value can switch the tab and a bad customer value is still sent to the server. Until it is fixed this test is expected to fail on that point - it is already reported.'),
 'FLT-API-03': ('SV-8832', 'Known issue: the server does not fail, but the value that no longer exists is still applied instead of being dropped. Until it is fixed this test is expected to fail on that point - it is already reported.'),
 'FLT-API-04': ('SV-8832', 'Known issue: the server does not fail, but a broken address is not fully ignored by the page. Until it is fixed this test is expected to fail on that point - it is already reported.'),
 'FLT-MOB-08': ('SV-8846', 'Known issue: on a phone there is no Clear Filters button at all while filters are on. Until it is fixed this test is expected to fail on that point - it is already reported.'),
 'FLT-PSRCH-10': ('SV-8844', 'Known issue: what you type in the page search is saved against your account, so it comes back on a later visit and can leave the list looking empty. Until it is fixed this test is expected to fail on that point - it is already reported.'),
 'FLT-PSRCH-11': ('SV-8844', 'Known issue: what you type in the page search is saved against your account instead of only for this browser tab. Until it is fixed this test is expected to fail on that point - it is already reported.'),
 'FLT-PSRCH-12': ('SV-8844', 'Known issue: the search text is restored on a later visit instead of starting empty. Until it is fixed this test is expected to fail on that point - it is already reported.'),
}
# the already-filed desktop dropdown defect
SV8824 = ['FLT-STAT-03', 'FLT-STAT-04', 'FLT-STAT-05', 'FLT-CUST-03', 'FLT-CUST-05',
          'FLT-CUST-07', 'FLT-TECH-03', 'FLT-TECH-05', 'FLT-ADV-03', 'FLT-ADV-05',
          'FLT-ASSET-05', 'FLT-CHIP-01']
SV8824_LINE = ('Known issue: on the build tested the dropdown closes as soon as you tick one value, '
               'so to pick a second value you have to open the chip again. Everything else in this '
               'test still works. Until it is fixed this test is expected to fail on that point - '
               'it is already reported.')

NOT_BUILT = {
 'FLT-PARTS-01': 'Inventory, Part Sales, Catalog and Returns',
 'FLT-PARTS-09': 'Inventory, Part Sales, Catalog and Returns',
 'FLT-PARTS-11': 'Inventory, Part Sales, Catalog and Returns',
 'FLT-PARTS-12': 'Inventory, Part Sales, Catalog and Returns',
 'FLT-PARTS-13': 'Inventory, Part Sales, Catalog and Returns',
 'FLT-RPTS-01': 'reports', 'FLT-RPTS-21': 'reports',
 'FLT-RPTS-22': 'reports', 'FLT-RPTS-23': 'reports',
}
NOT_BUILT_LINE = {
 'parts': ('Not built yet on the build tested: a filter bar exists on Inventory, Part Sales, '
           'Catalog and Returns, but Purchase Orders, Vendor Invoices and Vendors have no filter '
           'bar at all. If the filter bar is missing on the view you are testing, mark this test '
           'BLOCKED - do not mark it failed.'),
 'reports': ('Not built yet on the build tested: only the first report tab (Timesheet Activities) '
             'has a filter bar, with a Date Range and a Filter by Staff button, and no report tab '
             'has a page search box. If the controls this test needs are missing, mark this test '
             'BLOCKED - do not mark it failed.'),
}

HOLD_LINE = ('DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. '
             'Automating it now could lock in the wrong behaviour.')
HOLD_WHY = ('The question is open as SV-8825 (' + TR + 'SV-8825). Branko answered our sheet on '
            '2026-08-04 saying a single filter window on a phone applies straight away with no '
            'Apply button, which is what the build does; hours later he added a new rule to the '
            'specification saying a phone should only apply when you tap an "Apply filters" '
            'button. Both come from him on the same day, so we are not choosing between them. His '
            'answers are in this file: ' + BRANKO_FILE)

EXTDEP = {
 'FLT-API-06': ('Step 3 needs a SECOND sign-in of your own. We could not run it for you: '
                'impersonating another user on this branch returns an error, and a new staff '
                'member cannot finish signing up because the invitation email cannot be received '
                'here. If you have a second account, run step 3 normally. If you do not, mark this '
                'test BLOCKED - do not mark it failed. Steps 1, 2 and 4 were confirmed working.'),
}

# ---- 4. the provenance line (Rule 54) --------------------------------------------
# cases whose position genuinely RESTS ON Branko's answer file (Rule 54 file citation)
BRANKO_GOVERNED = set(F.HELD['H1']['cases']) | {
    'FLT-TAB-06', 'FLT-PARTS-01', 'FLT-PARTS-09', 'FLT-PARTS-11', 'FLT-PARTS-12',
    'FLT-PARTS-13', 'FLT-RPTS-01', 'FLT-RPTS-21', 'FLT-RPTS-22', 'FLT-RPTS-23'}
# only the three cases whose ASSERTION we changed carry the superseded-answer note
STALE_NOTE = {'FLT-TAB-02', 'FLT-TAB-03', 'FLT-BAR-03'}

PROV_RE = re.compile(r'(?:<p>)?-{3,}(?:</p>)?\s*(?:<p>)?This is the expected behaviour.*$',
                     re.S | re.I)
HOLD_RE = re.compile(r'(?:<p>)?DO NOT AUTOMATE YET:.*$', re.S)


def anchors_of(cid):
    refs = LIVE[cid].get('refs') or ''
    a = re.findall(r'\bS\d+-[RNE]\d+\b', refs)
    seen, out = set(), []
    for x in a:
        if x not in seen:
            seen.add(x); out.append(x)
    return out


def provenance(iid, cid):
    a = anchors_of(cid)
    anch = ' (%s)' % ', '.join(a) if a else ''
    base = ('This is the expected behaviour as per the build tested on 8/4/2026 '
            '(ShopView %s on the Filters QA branch), epic SV-8785 and the Filters specification '
            'version 1.6 as revised on 4 August 2026%s.' % (F.BUILD, anch))
    if not a:
        base = ('This is the expected behaviour as per the build tested on 8/4/2026 '
                '(ShopView %s on the Filters QA branch) and epic SV-8785. The Filters '
                'specification version 1.6 as revised on 4 August 2026 has no numbered '
                'requirement for this, so there is no requirement reference to give.' % F.BUILD)
    if iid in BRANKO_GOVERNED:
        base += (' The position on this point comes from Branko\'s answers, in this file: %s'
                 % BRANKO_FILE)
    if iid == 'FLT-BAR-02':
        base += (' Note: the design frame also draws a small picture icon in front of each filter '
                 'name; the specification asks only for the name and the arrow, and the build '
                 'matches the specification, so this test follows the specification and the build.')
    if iid in STALE_NOTE:
        base += (' Note: an earlier answer of 2026-07-17 and the design frame both show the Status '
                 'button greyed out and pre-filled on this tab; the specification and the build '
                 'both hide it, and the specification is the newer source, so this test follows '
                 'the specification and the build.')
    return base


def strip_tail(exp):
    exp = HOLD_RE.sub('', exp)
    exp = PROV_RE.sub('', exp)
    return exp.rstrip()


def build():
    rows = V.load()
    plan = []
    for r in rows:
        iid, cid = r['iid'], r['cid']
        c = LIVE[cid]
        snap = {k: c.get(k) for k in sorted(c.keys())}
        title = c['title']
        pre = c.get('custom_preconds') or ''
        steps = c.get('custom_steps') or ''
        exp = strip_tail(c.get('custom_expected') or '')
        for a, b in LABEL_FIX:
            title = title.replace(a, b); pre = pre.replace(a, b)
            steps = steps.replace(a, b); exp = exp.replace(a, b)
        for a, b in REWRITE.get(iid, []):
            for fld in ('title', 'pre', 'steps', 'exp'):
                pass
            title = title.replace(a, b); pre = pre.replace(a, b)
            steps = steps.replace(a, b); exp = exp.replace(a, b)
        extra = []
        if iid in KNOWN_ISSUE:
            t, s = KNOWN_ISSUE[iid]
            extra.append('%s Ticket: %s%s' % (s, TR, t))
        if iid in SV8824:
            extra.append('%s Ticket: %sSV-8824' % (SV8824_LINE, TR))
        if iid in NOT_BUILT:
            extra.append(NOT_BUILT_LINE['parts' if iid.startswith('FLT-PARTS') else 'reports'])
        if iid in EXTDEP:
            extra.append(EXTDEP[iid])
        hold = iid in V.HELD
        body = exp
        for e in extra:
            body += '\n\n' + e
        if hold:
            body += '\n\n' + HOLD_LINE + ' ' + HOLD_WHY
        body += '\n\n---\n' + provenance(iid, cid)
        intended = {}
        if title != c['title']:
            intended['title'] = title
        if pre != (c.get('custom_preconds') or ''):
            intended['custom_preconds'] = pre
        if steps != (c.get('custom_steps') or ''):
            intended['custom_steps'] = steps
        if body != (c.get('custom_expected') or ''):
            intended['custom_expected'] = body
        plan.append({'iid': iid, 'cid': cid, 'section': r['section'],
                     'verdict': r['verdict'], 'snapshot': snap, 'intended': intended,
                     'skip': not intended})
    return plan


if __name__ == '__main__':
    plan = build()
    todo = [p for p in plan if not p['skip']]
    print('cases in plan  :', len(plan))
    print('cases to write :', len(todo))
    print('no-op          :', len(plan) - len(todo))
    import collections
    print('fields:', collections.Counter(k for p in todo for k in p['intended']))
    over = [(p['iid'], len(p['intended']['title'])) for p in todo
            if 'title' in p['intended'] and len(p['intended']['title']) > 80]
    print('new titles over 80 chars:', over)
    json.dump(plan, open('/tmp/fviu/plan.json', 'w'), indent=1)
    for p in todo[:3]:
        print('\n---', p['iid'], 'C%s' % p['cid'], list(p['intended']))
        if 'custom_expected' in p['intended']:
            print(p['intended']['custom_expected'][-700:])
