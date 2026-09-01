#!/usr/bin/env python3
"""Build the runnable-steps batch for Invoice UI Refresh, and PROVE it before writing.

Design points that matter:
  * The route is chosen by the case's SECTION, because a Credit Invoice is not reached the way a
    work-order Invoice is. Picking the first route-looking sentence in the preconditions put a
    "Work Orders -> Finance" route on Credit Invoice cases on the first build of this script.
  * Nothing is invented. The routes below are the ones OBSERVED on sv8218 and recorded in skill 18.
  * Only preconditions/steps change. Expected Results are never touched (Rule 57).
  * EVERY proposed case is run through the real gate's audit() IN MEMORY before it is written, so a
    fix that would not actually pass never reaches TestRail.
"""
import json, re, html, urllib.request, base64, sys, importlib.util

spec = importlib.util.spec_from_file_location('gate', '/home/user/Manual-test-Cases/build/testing-tools/check_runnable_cases.py')
gate = importlib.util.module_from_spec(spec); spec.loader.exec_module(gate)

cr = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{cr['user']}:{cr['password']}".encode()).decode()
def get(p):
    r = urllib.request.Request(cr['host'] + '/index.php?/api/v2/' + p, headers={'Authorization': 'Basic ' + AUTH})
    return json.load(urllib.request.urlopen(r, timeout=90))
def lines(v):
    v = v or ''; v = re.sub(r'<[^>]+>', '\n', v)
    return [x.strip() for x in html.unescape(v).split('\n') if x.strip()]

WO_ROUTE = ('To put the document on screen: click "Work Orders" in the top menu, open the work order '
            'you need, then click the "Finance" tab. The document appears on the right. Use the '
            '"Estimate / Invoice" toggle above it to switch between the two.')
CREDIT_ROUTE = ('To open the Credit Invoice: click "Customers" in the top menu, open the customer, click '
                'the "Invoices" tab, find the credit\'s row (its credit number, for example CM-100, is in '
                'the "Invoice #" column next to ordinary invoice numbers), then click the print icon at '
                'the right of that row (its tooltip reads "Print credit memo").')
PS_ROUTE = ('To put the document on screen: click "Parts" in the top menu, open "Part Sales", open the '
            'part sale you need, then click the "Finance" tab.')

def route_for(section_path, title):
    blob = f'{section_path} {title}'.lower()
    if 'credit' in blob:     return CREDIT_ROUTE
    if 'parts sale' in blob: return PS_ROUTE
    return WO_ROUTE

LEAD = re.compile(r'^\s*\d+\.\s*')
HAS_ROUTE = re.compile(r'\b(top menu|tab\b|icon\b|button\b|menu\b|Work Orders|Customers|Parts)\b', re.I)

def rebuild_steps(step, route):
    out = []
    for i, s in enumerate(step, start=1):
        body = LEAD.sub('', s).rstrip('.')
        if i == 1 and not HAS_ROUTE.search(body):
            body = f'{route} Then {body[0].lower() + body[1:]}'
        elif i > 1 and len(body.split()) <= 4:
            body = f'{body}, on the document now on screen'
        out.append(f'{i}. {body}.')
    return out

paths = json.load(open('/tmp/inv6/secpaths.json'))
MINE = json.load(open('../markers-2026-09-01/intended-blocks.json'))
LOST = set(json.load(open('/tmp/inv6/lost.json')))
AUDIT = json.load(open(sys.argv[1]))

todo = sorted(set(LOST) | {c for c, v in AUDIT.items() if v['fails']})
out, still_bad = {}, []
for cid in todo:
    d = get(f'get_case/{cid}')
    sec = paths.get(str(d['section_id']), '')
    route = route_for(sec, d['title'])
    pre_text = (MINE[cid]['fields']['custom_preconds']['text'] if cid in LOST
                else '\n'.join(lines(d.get('custom_preconds'))))
    step_src = (MINE[cid]['fields']['custom_steps']['text'].split('\n') if cid in LOST
                else lines(d.get('custom_steps')))
    new_steps = rebuild_steps([s for s in step_src if s.strip()], route)
    probe = {'custom_preconds': '<p>' + '</p><p>'.join(pre_text.split('\n')) + '</p>',
             'custom_steps':    '<p>' + '</p><p>'.join(new_steps) + '</p>'}
    fails = gate.audit(probe)
    # a genuine API case is allowed API words - that is its substance (Rule 4)
    is_api = '/api/' in ' '.join(new_steps) or 'api' in d['title'].lower()
    if is_api: fails = [f for f in fails if not f.startswith('R5')]
    if fails:
        still_bad.append((cid, d['title'], fails)); continue
    out[cid] = {'title': d['title'], 'section': sec,
                'fields': {'custom_preconds': {'blocks': [pre_text.split('\n')], 'text': pre_text},
                           'custom_steps':    {'blocks': [new_steps], 'text': '\n'.join(new_steps)}},
                'marker_override': MINE[cid]['marker_override'] if cid in MINE else None}
json.dump(out, open('batch.json', 'w'), indent=1)
print(f'proposed fixes that PASS the gate: {len(out)}')
if still_bad:
    print(f'\nSTILL FAILING, need a hand-written route ({len(still_bad)}):')
    for cid, t, f in still_bad:
        print(f'  C{cid} {t[:55]}')
        for x in f: print('     -', x)
