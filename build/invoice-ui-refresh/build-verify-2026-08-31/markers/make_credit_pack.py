#!/usr/bin/env python3
"""The Credit Invoice pack the QA lead asked for on 2026-08-31:
   "Please share with me any case related to credit invoice I want to see what steps of
    replication do we have."

Full Preconditions / Steps / Expected for every case in the suite that involves a Credit Invoice,
read LIVE from TestRail (not from the local extract, which predates today's repairs).
Layman wording throughout (Rules 7/9): no rule anchors in the tester-facing text, the build's own
labels as written.
"""
import json, base64, urllib.request, re, html, collections

C = json.load(open('/tmp/testrail/creds.json'))
A = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31'
LINK = 'https://shopview.testrail.io/index.php?/cases/view/'

def get(p):
    r = urllib.request.Request(C['host'] + '/index.php?/api/v2/' + p)
    r.add_header('Authorization', 'Basic ' + A)
    return json.loads(urllib.request.urlopen(r, timeout=60).read().decode())

ver = json.load(open(f'{DIR}/verification.json'))
req = json.load(open(f'{DIR}/requirements.json'))

def lines(t):
    # <br> must become a newline BEFORE the generic tag strip, or a repaired field stored as
    # <p>1. a<br>2. b</p> collapses to a single line.
    t = re.sub(r'<br\s*/?>', '\n', t or '', flags=re.I)
    t = html.unescape(re.sub(r'<[^>]+>', '\n', t))
    return [l.strip() for l in t.split('\n') if l.strip()]

def renumber(ls):
    # Cases in this suite are stored two ways: as <ol><li> HTML (no literal numbers) and as plain
    # "1. " text after today's display repair. Number here so the pack reads uniformly either way.
    strip_num = re.compile(r'^\d+\.\s*')
    return [f'{i}. {strip_num.sub("", l)}' for i, l in enumerate(ls, 1)]

cred = []
for cid, r in ver['cases'].items():
    blob = ' '.join(req[cid]['preconditions'] + req[cid]['steps'] + [req[cid]['title']]).lower()
    if 'credit' in blob or 'credit-invoice' in r['needs']:
        cred.append(cid)

PLAIN = {
    'RUNNABLE': 'Build verified — ready to run',
    'NOT_ESTABLISHED': 'Cannot run yet — I could not produce a Credit Invoice document on the build',
    'LABELS_UNCONFIRMED': 'Cannot confirm yet — a word the case quotes was not on any screen I could reach',
    'NEEDS_STEP_WALK': 'Needs a person to click through it once',
}

cases = {}
for cid in sorted(cred, key=int):
    c = get(f'get_case/{cid}')
    exp = lines(c.get('custom_expected'))
    cases[cid] = {
        'title': c['title'], 'section': ver['cases'][cid]['section'],
        'verdict': ver['cases'][cid]['verdict'], 'atm': c.get('custom_atmstatus'),
        'pre': lines(c.get('custom_preconds')), 'steps': lines(c.get('custom_steps')),
        'expected': [l for l in exp if not l.startswith('AUTOMATION:')
                     and not l.startswith('This is the expected behaviour')
                     and not l.startswith('Last checked against build') and l != '---'],
        'marker': next((l for l in exp if l.startswith('AUTOMATION:')), None),
        'source': next((l for l in exp if l.startswith('This is the expected behaviour')), None),
    }

core = [c for c in cases if cases[c]['section'] == 'Credit Invoice']
other = [c for c in cases if c not in core]

with open(f'{DIR}/CREDIT-INVOICE-CASES-2026-08-31.md', 'w') as f:
    f.write('# Credit Invoice — every test case we have, with its steps\n\n')
    f.write('**Asked for by the QA lead, 31 August 2026.** Read live from TestRail that day.\n\n')
    f.write(f'**{len(cases)} cases involve a Credit Invoice.** {len(core)} of them are the dedicated '
            f'Credit Invoice cases; the other {len(other)} are cases in other areas that include the '
            'Credit Invoice among the documents they check.\n\n')
    f.write('## Where these stand on the build\n\n| Status | Cases |\n|---|---|\n')
    for k, n in collections.Counter(v['verdict'] for v in cases.values()).most_common():
        f.write(f'| {PLAIN[k]} | {n} |\n')
    f.write('\n**The honest position on the blocked ones:** I could not create a Credit Invoice '
            'document on the QA branch. The "Issue Credit" action in the invoice menu does run, but '
            'what it produced was a **part-sale credit**, not a work-order Credit Invoice document — '
            'so I have never seen the document these cases describe. That is the one thing standing '
            'between most of this list and a verdict. **I do not know yet whether the Credit Invoice '
            'document is built at all**, which is why it is a question for the developer rather than '
            'a defect.\n\n')
    f.write('---\n\n# The dedicated Credit Invoice cases\n\n')
    for grp, ids, head in (('core', core, None), ('other', other, 'Other cases that also cover the Credit Invoice')):
        if head: f.write(f'---\n\n# {head}\n\n')
        for cid in sorted(ids, key=int):
            c = cases[cid]
            f.write(f"## [C{cid}]({LINK}{cid}) — {c['title']}\n\n")
            f.write(f"**Area:** {c['section']}  \n**Status on the build:** {PLAIN[c['verdict']]}")
            if c['atm'] == 3: f.write('  \n**⚠️ TestRail flags this case Automated** (held under Rule 71)')
            f.write('\n\n**Preconditions**\n\n')
            for l in renumber(c['pre']): f.write(f'{l}\n')
            f.write('\n**Steps**\n\n')
            for l in renumber(c['steps']): f.write(f'{l}\n')
            f.write('\n**Expected result**\n\n')
            for l in renumber(c['expected']): f.write(f'{l}\n')
            if c['source']: f.write(f"\n*Source: {c['source']}*\n")
            if c['marker']: f.write(f"\n`{c['marker']}`\n")
            f.write('\n')

json.dump(cases, open(f'{DIR}/markers/credit-cases.json', 'w'), indent=1, ensure_ascii=False)
print(f'credit-related cases : {len(cases)}')
print(f'  dedicated section  : {len(core)}')
print(f'  other areas        : {len(other)}')
print(f'  flagged Automated  : {sum(1 for v in cases.values() if v["atm"] == 3)}')
print('by status:', dict(collections.Counter(v['verdict'] for v in cases.values())))
