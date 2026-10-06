import json, re, sys, html, collections
import os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from p_common import *
import p_upd1, p_upd2, p_upd3, p_new
from p_upd1 import FLAGWHY
from p_diverge import DIVERGE, EXCLUDE
ROOT = '/home/user/Manual-test-Cases/build/maintenance-reminder-v2/'
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
SP = os.path.join(HERE, 'work') + '/'
cases = {c['id']: c for c in json.load(open(SP + 'cases.json'))}
U = {}
for m in (p_upd1, p_upd2, p_upd3):
    for k, v in m.U.items():
        assert k not in U, k
        U[k] = v
import p_patch
p_patch.apply(U, p_new.N)
import p_v2
p_v2.apply(U, p_new.N)
import p_v3
p_v3.apply(U, p_new.N)
DIVERGE = DIVERGE + p_v3.DIVERGE
EXCLUDE = EXCLUDE + p_v3.EXCLUDE

def clean(t):
    t = t.replace('**', '').replace('\\-', '-').replace('\\<', '<').replace('\\>', '>').replace('\\[', '[').replace('\\]', ']').replace('\\_', '_').replace('\\*', '*')
    t = t.replace('->', '→')
    return re.sub(r'\s+', ' ', t).strip()
def parse(path):
    out = {}
    for line in open(path, encoding='utf-8'):
        m = re.match(r'^\s*-\s+\*\*(S\d+-[A-Z]+\d+):\s*\*\*\s*(.*)$', line) or re.match(r'^\s*-\s+\*\*(S\d+-[A-Z]+\d+)\*\*:?\s*(.*)$', line) or re.match(r'^\s*-\s+\*\*(S\d+-[A-Z]+\d+):\*\*\s*(.*)$', line)
        if m: out[m.group(1)] = clean(m.group(2))
    return out
A1 = json.load(open(ROOT + 'source-update-2026-10-06/anchors-old-new.json'))['new']
A2 = parse(ROOT + 'sources/CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md')
SPEC = clean(open(ROOT + 'sources/CONFLUENCE-886931488-Chunk1-MR-2026-10-06.md', encoding='utf-8').read())
MAINT = clean(open(ROOT + 'sources/CONFLUENCE-833290250-Maintenance-Reminders-V1-2026-10-06.md', encoding='utf-8').read())
PL1 = clean(open(ROOT + 'sources/tech-plan/Plan-1-Track-act-clear-Technical-Implementation-Plan.md', encoding='utf-8').read())
PL2 = clean(open(ROOT + 'sources/tech-plan/Plan-2-The-work-order-and-the-customer-Technical-Implementation-Plan.md', encoding='utf-8').read())
BOARD = open(ROOT + 'source-update-2026-10-06/design-text/Chunk1-board-text-2026-10-06.txt', encoding='utf-8').read()
BOARD += '\n' + open(ROOT + 'source-update-2026-10-06/design-text/Chunk1-board-attribute-text-2026-10-06.txt', encoding='utf-8').read()
BOARD += '\n' + open(SP + 'drive_corpus.txt', encoding='utf-8').read()
DEMO = open(ROOT + 'source-update-2026-10-06/design-text/Demo-board-text-2026-10-06.txt', encoding='utf-8').read()
DRIVE = open(ROOT + 'source-update-2026-10-06/DESIGN-DRIVE-2026-10-06/DESIGN-DRIVE-FINDINGS.md', encoding='utf-8').read()
BOARDLINES = set(l.strip() for l in BOARD.splitlines())

def norm(q):
    return re.sub(r'\s+', ' ', q.replace('->', '→')).strip()
def check_quote(ref, q):
    qn = norm(q)
    if re.match(r'^S\d+-[A-Z]+\d+$', ref):
        text = A1.get(ref)
        if text is None: return 'ANCHOR-NOT-IN-CURRENT-CHUNK1'
        parts = [p.strip(' .') for p in re.split(r'\.\.\.|…', qn) if p.strip(' .')]
        return 'OK' if all(p in text for p in parts) else 'NOT-VERBATIM'
    m2 = re.match(r'^(S\d+-[A-Z]+\d+) \(Chunk 2 MR', ref)
    if m2:
        return 'OK' if qn in A2.get(m2.group(1), '') else 'NOT-VERBATIM'
    if ref.startswith('Chunk 1 MR'):
        return 'OK' if qn in SPEC else 'NOT-VERBATIM'
    if ref.startswith('Plan 1'):
        return 'OK' if qn in PL1 else 'NOT-VERBATIM'
    if ref.startswith('Plan 2'):
        return 'OK' if qn in PL2 else 'NOT-VERBATIM'
    if ref.startswith('Design drive findings'):
        return 'OK' if (q in DRIVE) else 'NOT-VERBATIM'
    if ref.startswith('Design Demo board'):
        return 'OK' if (norm(q) in norm(DEMO)) else 'NOT-VERBATIM'
    if ref.startswith('Design'):
        return 'OK' if (q in BOARD) else 'NOT-VERBATIM'
    if ref.startswith('Maintenance Reminders V1'):
        return 'OK' if qn in MAINT else 'NOT-VERBATIM'
    return 'UNKNOWN-REF'

FORBID = [r'\bS\d{1,2}-[A-Z]+\d+\b', r'\bSV-\d+', r'\bflag\b', r'Rule \d', r'\bDVI\b', r'absorb', r'Plan [12]', r'\bTD-\d', r'\bFD-\d', r'\bAPI\b', r'\bHTTP\b', r'[Ee]ffective', r'expiry month', r'mail catcher', r'mail sink', r'testability', r'\(S\d{1,2}\)', r'\bS\d{1,2}\b(?! ·)']

def mech(c):
    def fix(t):
        t = re.sub(r'\s*The Maintenance Reminders feature is on[^.]*?flag\)\.', '', t)
        t = t.replace('In the left sidebar under Settings choose "Maintenance" (it sits beneath "Inspection Templates"). Schedules here belong to the location chosen in the header.', NAV)
        t = re.sub(r'-> Enrol(?![l])', '-> Enroll in Schedule', t)
        t = t.replace('Calendar - needs', 'Calendar · needs')
        t = t.replace('These are numeric/date-accuracy cases (Rule 116):', 'These are number and date accuracy cases:')
        t = t.replace('absorbed', 'covered')
        return t.strip()
    return [fix(x) for x in c['pre'] if fix(x)], [fix(x) for x in c['steps']], [fix(x) for x in c['results']]

MECH_STORY = {146384: 'S3', 146388: 'S13', 146389: 'S2'}
MECH_NOTE = {}
updates = []
for cid in sorted(cases):
    c = cases[cid]
    if cid in U:
        u = dict(U[cid]); u['case_id'] = cid
    else:
        story = MECH_STORY.get(cid) or re.match(r'(S\d+)', c['sec']).group(1)
        pre, steps, res = mech(c)
        u = dict(case_id=cid, why=FLAGWHY, title=c['title'], preconds=pre, steps=steps, results=res,
                 source=src(story, story + ' (unchanged requirements)'), quotes=[list(q) for q in c['quotes']])
        p_patch.mech_fix(cid, u)
        p_v2.mech_fix(cid, u)
        p_v3.mech_fix(cid, u)
    u['marker'] = MARKER
    updates.append({k: u[k] for k in ['case_id', 'why', 'title', 'preconds', 'steps', 'results', 'source', 'quotes', 'marker']})
new = [dict({k: n[k] for k in ['story', 'title', 'preconds', 'steps', 'results', 'source', 'quotes']}, marker=MARKER) for n in p_new.N]
for x in updates + new:
    assert x['marker'] == 'AUTOMATION: HOLD - not yet build-verified on a Maintenance Reminders QA build'
    assert x['source'].endswith('read 6 Oct 2026. Source-verified 6 October 2026; not yet build-verified.'), x['source'][-80:]

# ---- checks ----
fails = []; nq = 0; lint = []
def run_checks(label, item):
    global nq
    if len(item['title']) > 80: fails.append((label, 'TITLE>80', len(item['title']), item['title']))
    for ref, q in item['quotes']:
        nq += 1
        st = check_quote(ref, q)
        if st != 'OK': fails.append((label, st, ref, q[:160]))
    for fld in ('preconds', 'steps', 'results'):
        for line in item[fld]:
            for pat in FORBID:
                if re.search(pat, line) and not ('Feature Flags' in line and 'flag' in pat):
                    lint.append((label, fld, pat, line[:200]))
for u in updates: run_checks('C%d' % u['case_id'], u)
for i, n in enumerate(new): run_checks('NEW%d %s' % (i + 1, n['story']), n)
for d in DIVERGE:
    for side in ('source_a', 'source_b'):
        ref, q = d[side]; nq += 1
        st = check_quote(ref, q)
        if st != 'OK': fails.append(('DIVERGE ' + d['topic'][:40], st, ref, q[:160]))
print('updates', len(updates), 'new', len(new), 'diverge', len(DIVERGE), 'exclude', len(EXCLUDE))
print('quotes checked', nq, 'failures', len(fails))
for f in fails: print('  FAIL', f)
print('lint hits', len(lint))
for l in lint: print('  LINT', l)
# uncited anchors after proposals (Chunk 1 anchors only)
cited = collections.Counter(ref for x in updates + new for ref, q in x['quotes'] if re.match(r'^S\d+-[A-Z]+\d+$', ref))
unc = [a for a in A1 if a not in cited]
print('current anchors not cited by any proposed case:', len(unc), unc)
out = dict(updates=updates, new=new, diverge=DIVERGE, exclude=EXCLUDE)
if '--write' in sys.argv:
    json.dump(out, open(ROOT + 'source-update-2026-10-06/chunk1-proposals.json', 'w'), indent=1, ensure_ascii=False)
    os.makedirs(SP, exist_ok=True)
    json.dump(dict(fails=fails, lint=lint, nq=nq, cited=cited, uncited=unc), open(SP + 'check_result.json', 'w'), indent=1, ensure_ascii=False)
    print('written')
