#!/usr/bin/env python3
"""Generate the intended field blocks for suite 6617 (Printer Friendly Work Orders).

The suite was authored with no build in existence, so every case carries a route marked PROVISIONAL
and tells the tester to "confirm the exact toolbar/labels on the build". The build now exists and has
been walked, so those hedges are replaced with what is actually on screen. Nothing in any Expected
Results changes: expectations come from the documents, never from the build (Rule 57).

  T1  the work-order route and the More-menu route -> the observed menu, in order, with the real ids
  T2  the theme setting -> the click path that was observed
  T3  the view-permission precondition -> the real Settings -> Roles & Permissions path
  T4  Expected Results: Rule-54 sentence 2 added ONLY where this pass observed the case live, and the
      AUTOMATION marker lifted off "Not available on Build to test Yet"

EXCLUSION: C45123 is flagged Automated (Rule 71) - held for the QA lead.
"""
import json, re, sys, html, os

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'verdicts'))
from verdicts import V                                            # noqa: E402

CASES = json.load(open('/tmp/pf6617/cases6617.json'))
BUILD_SENTENCE = 'Last checked against build v26.35.6-598cc8a on 9/1/2026.'
AUTOMATED_AUTHORISED = set()          # nothing authorised yet for this suite

MENU = ('The menu holds five items in this order: “Audit Log”, “Timesheets”, “Add Work Order Fee / '
        'Discount”, “Print Work Order”, “Delete Work Order”.')
ROUTE_PRINT = ('In the top menu click “Work Orders” and open a work order by clicking its row. On the '
               'work order’s toolbar click the three-dots button at the top right, then choose “Print '
               'Work Order”. ' + MENU + ' Choosing it opens your browser’s own print dialog — the '
               'printout is what you are checking, so use your browser’s print preview to look at it.')
ROUTE_DETAIL = ('In the top menu click “Work Orders” and open a work order by clicking its row. Its '
                'toolbar carries a three-dots button at the top right; that is the “More” menu. ' + MENU)
ROLE_PATH = ('open “Settings” from the menu behind your name at the top right, click “Roles & '
             'Permissions” in the sidebar, then click the pencil on the role in question')

def t1(line):
    if line.startswith('In the top menu click “Work Orders”, open a work order to reach its detail view'):
        return ROUTE_PRINT
    if line.startswith('In the top menu click “Work Orders”, then open a work order (click its row) to reach its detail view'):
        return ROUTE_DETAIL
    if line.startswith('You are on the work order detail view'):
        return ROUTE_DETAIL
    return line

def t2(line):
    if 'dark mode' in line:
        return ('Your app theme is set to dark mode. To set it: click the menu behind your name at the '
                'top right — the same one that holds “Settings” — and choose “Dark” at the bottom of it.')
    return line

def t3(line):
    if 'does NOT have permission to view' in line:
        return ('Sign in as a user whose role cannot view work orders, or have an administrator create '
                f'one. To set a role up that way: {ROLE_PATH} and switch its work-order viewing '
                'permission off. Then, in the top menu, try to reach “Work Orders” at all.')
    return line

def to_lines(h):
    if not h: return []
    paras = re.findall(r'<p>(.*?)</p>', h, re.S) or [re.sub(r'<[^>]+>', '', h)]
    out = []
    for p in paras:
        lines = [html.unescape(re.sub(r'<[^>]+>', '', x)).strip() for x in re.split(r'<br\s*/?>', p)]
        out.append([x for x in lines if x])
    return [p for p in out if p]

def renumber(lines):
    out, n = [], 0
    for l in lines:
        n += 1
        out.append(f'{n}. ' + re.sub(r'^\s*\d+\.\s*', '', l))
    return out

intended, snapshot, skipped = {}, {}, []
for c in CASES:
    cid = c['id']
    if c.get('custom_atmstatus') == 3 and cid not in AUTOMATED_AUTHORISED:
        skipped.append({'cid': cid, 'reason': 'flagged Automated (Rule 71) — held for the QA lead'})
        continue
    verdict = V[cid][0]
    pre = [t3(t2(t1(re.sub(r'^\s*\d+\.\s*', '', l))))
           for para in to_lines(c.get('custom_preconds')) for l in para]
    pre = renumber(pre)
    stp = renumber([re.sub(r'^\s*\d+\.\s*', '', l) for para in to_lines(c.get('custom_steps')) for l in para])

    exp = to_lines(c.get('custom_expected'))
    body, prov = [], []
    for para in exp:
        if para[0].startswith('---'): prov = list(para[1:])
        elif para[0].startswith('AUTOMATION:'): continue
        else: body += para
    body = renumber([re.sub(r'^\s*\d+\.\s*', '', l) for l in body])
    prov = [l for l in prov if not l.startswith('Last checked against build')]
    assert len(prov) == 1, (cid, prov)
    prov_block = ['---'] + prov
    # a case this pass actually exercised carries sentence 2; one it could not, does not
    observed = verdict in ('PASS', 'PARTIAL', 'UNREACHABLE')
    if observed:
        prov_block.append(BUILD_SENTENCE)
    marker = 'AUTOMATION: READY'

    intended[str(cid)] = {
        'title': c['title'], 'verdict': verdict, 'marker_override': marker,
        'build_sentence': BUILD_SENTENCE if observed else None,
        'fields': {
            'custom_preconds': {'blocks': [pre], 'text': '\n'.join(pre)},
            'custom_steps':    {'blocks': [stp], 'text': '\n'.join(stp)},
            'custom_expected': {'blocks': [body, prov_block, [marker]],
                                'text': '\n\n'.join(['\n'.join(b) for b in (body, prov_block, [marker])])},
        },
    }
    snapshot[str(cid)] = {'title': c['title'], 'atm': c.get('custom_atmstatus'),
                          'section_id': c['section_id'], 'refs': c.get('refs'), 'provenance': prov}

json.dump(intended, open(f'{HERE}/intended-blocks.json', 'w'), indent=1, ensure_ascii=False)
json.dump(snapshot, open(f'{HERE}/PRE-snapshot.json', 'w'), indent=1, ensure_ascii=False)
json.dump(skipped, open(f'{HERE}/SKIPPED.json', 'w'), indent=1, ensure_ascii=False)
json.dump(sorted(AUTOMATED_AUTHORISED), open(f'{HERE}/automated-authorised.json', 'w'))
import collections
print(f'queued {len(intended)}, skipped {len(skipped)}')
print(collections.Counter(v['verdict'] for v in intended.values()))
print('with build sentence:', sum(1 for v in intended.values() if v['build_sentence']))
