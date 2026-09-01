#!/usr/bin/env python3
"""THE LAST GATES BEFORE THE SUITES LEAVE — run live, summarised, nothing bulk-read (Rule 88).

Skill 04 requires more than the counts. This script runs, over the LIVE case bodies, the checks that
are cheap to automate and expensive to miss:

  G1  MARKER IS LAST           the AUTOMATION marker is the last thing in Expected Results (Rule 61)
  G2  EXACTLY ONE MARKER       never two, never zero
  G3  PROVENANCE PRESENT       every case says what its expectation is based on (Rule 54)
  G4  NO EXPECT-FAIL WITHOUT BACKING   an EXPECT FAIL marker must name a live ticket (skill 04 s4)
  G5  NO BARRED PHRASE         "as per the build tested on" is barred (Rule 54)
  G6  NO STYLING TAG           <b>/<i>/<strong>/<code>/<span> show LITERALLY to the tester whatever
                               the container (playbook J). <p> and <br> are what the TestRail UI
                               editor itself emits and they RENDER - these cases were written through
                               the editor, not the API, and the served-page scan is the authority on
                               what actually appears. So <br> is NOT a failure here, and flagging it
                               as one is a false alarm this script made on its first run.
  G7  CROSS-CASE CONTRADICTION a heuristic sweep: two cases asserting the OPPOSITE thing about the
                               same on-screen label. Prints candidates for a human read - it does not
                               judge them, because only a person can tell a real contradiction from
                               two cases about different situations (skill 04 s2).
  G8  NO EMPTY FIELD           a case with no preconditions or no steps cannot be run

Exit 1 if G1-G6 or G8 fail on any case in scope. G7 prints candidates and never fails the run.
"""
import json, base64, urllib.request, re, html, collections, sys, time

C = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
BASE = 'https://shopview.testrail.io/index.php?/api/v2/'
def get(p, tries=5):
    for a in range(tries):
        try:
            r = urllib.request.Request(BASE + p, headers={'Authorization': 'Basic ' + AUTH})
            return json.load(urllib.request.urlopen(r, timeout=180))
        except Exception:
            if a == tries - 1: raise
            time.sleep(2 ** a)
def txt(h):
    if not h: return ''
    s = re.sub(r'<(br|/p|/li|/div|hr)[^>]*>', '\n', h)
    return html.unescape(re.sub(r'<[^>]+>', '', s))

census = json.load(open('/tmp/handoff/census.json'))
scope, excluded = {}, {}
for suite, d in census.items():
    ex = set(d['arithmetic']['excluded_from_the_gate'])
    for cid in d['per_case']:
        if int(cid) not in ex: scope[int(cid)] = suite
        else: excluded[int(cid)] = suite

# ⚠️ STYLING tags only. <p> and <br> are the TestRail editor's own output and render correctly;
# an earlier version of this script flagged all 767 <br>s and 124 &amp;s as failures, which was wrong
# - the served-page scan showed 0 literal tags on all 161 cases. Only a tag TestRail's renderer will
# not honour belongs here.
STYLING_TAG = re.compile(r'<\s*/?\s*(b|i|u|em|strong|code|span|font|mark)\b', re.I)
# &amp; is correct (it renders as &, e.g. "Roles & Permissions") and &lt;/&gt; are correct where the
# specification's own message template contains a placeholder such as <on hand>. A DOUBLE escape is
# the real defect - the tester would read "&amp;amp;".
DOUBLE_ESCAPE = re.compile(r'&amp;(amp|lt|gt|quot|nbsp|#\d+);')
fails = collections.defaultdict(list)
bodies = {}
for cid, suite in sorted(scope.items()):
    c = get(f'get_case/{cid}')
    exp_raw = c.get('custom_expected') or ''
    exp = txt(exp_raw).rstrip()
    pre = txt(c.get('custom_preconds') or '').strip()
    steps = txt(c.get('custom_steps') or '').strip()
    bodies[cid] = (suite, c['title'], pre, steps, exp)
    marks = re.findall(r'AUTOMATION:[^\n]*', exp)
    if len(marks) != 1:
        fails['G2 exactly one marker'].append(f'C{cid}: found {len(marks)}')
    if marks:
        tail = exp.split(marks[-1])[-1].strip()
        if tail:
            fails['G1 marker is last'].append(f'C{cid}: {tail[:60]!r} sits after it')
        if 'EXPECT FAIL' in marks[-1] and not re.search(r'SV-\d+', marks[-1]):
            fails['G4 expect-fail without a ticket'].append(f'C{cid}: {marks[-1][:70]}')
    if not re.search(r'(Source|Based on|specification|Sources?:)', exp, re.I):
        fails['G3 provenance present'].append(f'C{cid}')
    if re.search(r'as per the build tested on', exp, re.I):
        fails['G5 barred phrase'].append(f'C{cid}')
    for fld, raw in (('preconditions', c.get('custom_preconds') or ''), ('steps', c.get('custom_steps') or ''),
                     ('expected', exp_raw)):
        if STYLING_TAG.search(raw):   fails['G6 styling tag'].append(f'C{cid} {fld}')
        if DOUBLE_ESCAPE.search(raw): fails['G6 double-escaped entity'].append(f'C{cid} {fld}')
    if not pre:   fails['G8 empty field'].append(f'C{cid}: no preconditions')
    if not steps: fails['G8 empty field'].append(f'C{cid}: no steps')

# ---- G7 heuristic contradiction sweep: same quoted on-screen label, opposite assertion
QUOTED = re.compile(r'"([A-Z][^"\n]{2,40})"')
POS = re.compile(r'\b(is|are) (shown|displayed|visible|present|enabled|available)\b', re.I)
NEG = re.compile(r'\b(is|are) (not shown|not displayed|not visible|hidden|absent|disabled|greyed|'
                 r'not present|not enabled|unavailable)\b|\bdoes not appear\b|\bis never\b', re.I)
by_label = collections.defaultdict(lambda: {'pos': [], 'neg': []})
for cid, (suite, title, pre, steps, exp) in bodies.items():
    for label in set(QUOTED.findall(exp)):
        for sent in re.split(r'(?<=[.;])\s+', exp):
            if label not in sent: continue
            if NEG.search(sent):   by_label[label]['neg'].append(cid)
            elif POS.search(sent): by_label[label]['pos'].append(cid)
cands = {l: v for l, v in by_label.items() if v['pos'] and v['neg']}

print(f'cases in scope: {len(scope)}   deliberately excluded: {sorted(excluded)}')
print()
for g in ('G1 marker is last', 'G2 exactly one marker', 'G3 provenance present',
          'G4 expect-fail without a ticket', 'G5 barred phrase', 'G6 styling tag',
          'G6 double-escaped entity', 'G8 empty field'):
    v = fails.get(g, [])
    print(f'{"FAIL" if v else "PASS"}  {g:32} {len(v)}')
    for x in v[:8]: print(f'         {x}')
print()
print(f'G7  contradiction candidates for a human read: {len(cands)}')
for l, v in sorted(cands.items(), key=lambda kv: -len(kv[1]['pos'] + kv[1]['neg']))[:12]:
    print(f'     "{l}"  shown in {["C%d" % i for i in sorted(set(v["pos"]))]}  '
          f'not shown in {["C%d" % i for i in sorted(set(v["neg"]))]}')
hard = sum(len(v) for k, v in fails.items())
print()
print('HANDOVER GATES:', 'ALL CLEAR' if hard == 0 else f'{hard} PROBLEMS ABOVE')
json.dump({'fails': {k: v for k, v in fails.items()},
           'contradiction_candidates': {k: {kk: sorted(set(vv)) for kk, vv in v.items()} for k, v in cands.items()},
           'scope': len(scope), 'excluded': sorted(excluded)},
          open('/tmp/handoff/handover-gates.json', 'w'), indent=1)
sys.exit(1 if hard else 0)
