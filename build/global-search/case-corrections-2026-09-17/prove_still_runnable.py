#!/usr/bin/env python3
"""PROOF THAT THE THREE EDITED CASES ARE STILL RUNNABLE, AND THAT NOTHING BUT THE NUMBER CHANGED.

Three independent checks, because "I ran my own verifier again" is not proof of anything:
  A. CHARACTER-LEVEL DIFF against the pre-edit snapshot - shows every single change made
  B. INTEGRITY of the things that must NOT have moved - automation marker, provenance line,
     step count, title, section, type, the case's own meaning
  C. LIVE EXECUTION of each case against the build, step by step, as a tester would
"""
import sys, json, re, html, difflib, os, runpy, urllib.parse
sys.path.insert(0, '/tmp')
import trlib
_s = runpy.run_path('/home/user/Manual-test-Cases/build/global-search/seeding/seed.py', run_name='not_main')
call = _s['call']
HERE = os.path.dirname(os.path.abspath(__file__))
snap = json.load(open(f'{HERE}/PRE-EDIT-SNAPSHOT.json'))
CASES = (44843, 44847, 44850)
FIELDS = ('custom_preconds', 'custom_steps', 'custom_expected')
problems = []

print('=' * 78)
print('A. CHARACTER-LEVEL DIFF — every change made to every case')
print('=' * 78)
for cid in CASES:
    before, after = snap[str(cid)], trlib.api(f'get_case/{cid}')
    print(f'\nC{cid}  {after["title"]}')
    any_change = False
    for f in FIELDS:
        b, a = (before.get(f) or ''), (after.get(f) or '')
        if b == a: continue
        any_change = True
        sm = difflib.SequenceMatcher(None, b, a)
        for tag, i1, i2, j1, j2 in sm.get_opcodes():
            if tag == 'equal': continue
            print(f'   [{f.replace("custom_","")}] {tag}: {b[i1:i2]!r} -> {a[j1:j2]!r}')
    if not any_change: print('   (no change)')

print('\n' + '=' * 78)
print('B. INTEGRITY — the things that must NOT have moved')
print('=' * 78)
def txt(s):
    s = re.sub(r'<br\s*/?>', '\n', s or ''); s = re.sub(r'</p>', '\n', s); s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(s).replace('\r', '')
for cid in CASES:
    before, after = snap[str(cid)], trlib.api(f'get_case/{cid}')
    checks = []
    checks.append(('title unchanged', before['title'] == after['title']))
    checks.append(('section unchanged', before['section_id'] == after['section_id']))
    checks.append(('type unchanged', before.get('type_id') == after.get('type_id')))
    checks.append(('priority unchanged', before.get('priority_id') == after.get('priority_id')))
    checks.append(('automation type unchanged',
                   before.get('custom_automation_type') == after.get('custom_automation_type')))
    bm = re.findall(r'AUTOMATION:\s*([A-Z \-]+)', txt(before.get('custom_expected')))
    am = re.findall(r'AUTOMATION:\s*([A-Z \-]+)', txt(after.get('custom_expected')))
    checks.append((f'automation marker intact and identical ({am})', bm == am and len(am) == 1))
    bp = 'This is the expected behaviour as per epic SV-9160' in txt(before.get('custom_expected'))
    ap = 'This is the expected behaviour as per epic SV-9160' in txt(after.get('custom_expected'))
    checks.append(('provenance line still present', bp == ap == True))
    bs = len(re.findall(r'^\s*\d+\.', txt(before.get('custom_steps')), re.M))
    asn = len(re.findall(r'^\s*\d+\.', txt(after.get('custom_steps')), re.M))
    checks.append((f'step count unchanged ({bs})', bs == asn))
    # 🔴 THE DECISIVE TEST, and the only one that actually proves "nothing else changed".
    # The first version of this check compared whitespace-separated TOKENS and raised a false alarm
    # on its own work: the source has no space after a full stop, so "'S2-15276'.The" is one token
    # and reads as a wholesale change when the only difference inside it is 276 -> 430. Comparing
    # sets of tokens can never answer this question. Instead: take the ORIGINAL text, apply ONLY the
    # number substitution, and require byte equality with what is live.
    # Two normalisations are applied to BOTH sides, so neither can hide a real change:
    #   * TestRail re-encodes non-ASCII on save (the ⌘ in the boilerplate becomes &#8984;)
    #   * TestRail appends a trailing newline (playbook §O4)
    SUBS_ = [('S2-15276','S2-15430'), ('S215276','S215430'), ('S2 15276','S2 15430'),
             ('s215276','s215430'), ('S2-15286','S2-15431')]
    norm = lambda t: re.sub(r'&#(\d+);', lambda m: chr(int(m.group(1))), t).rstrip()
    identical = True
    for f in FIELDS:
        exp = before.get(f) or ''
        for x, y in SUBS_: exp = exp.replace(x, y)
        if norm(exp) != norm(after.get(f) or ''): identical = False
    checks.append(('byte-identical to the original once the number is substituted', identical))
    print(f'\nC{cid}')
    for name, ok in checks:
        print(f'   {"✅" if ok else "🔴"} {name}')
        if not ok: problems.append((cid, name))

print('\n' + '=' * 78)
print('C. LIVE EXECUTION — can a tester actually run each case right now?')
print('=' * 78)
def srch(q): return (call('/api/search?q=' + urllib.parse.quote(q))['json'] or {}).get('data', {}) or {}
def pin(q):  return (srch(q).get('pinned') or {}).get('primary')
def rows(q):
    d = srch(q); return sum(len(g['items']) for g in d.get('groups') or []) + (1 if d.get('pinned') else 0)

def step(cid, desc, got, want):
    ok = got == want
    print(f'   {"✅" if ok else "🔴"} {desc:58} -> {got!r}')
    if not ok: problems.append((cid, desc))

print("\nC44843 — 'A Work Order S2-15430 exists'; type it three ways")
step(44843, "precondition: S2-15430 exists", pin('S2-15430'), 'S2-15430')
step(44843, "step 1  type 'S2-15430'", pin('S2-15430'), 'S2-15430')
step(44843, "step 2  type 'S215430' (no dash)", pin('S215430'), 'S2-15430')
step(44843, "step 3  type 'S2 15430' (with a space)", pin('S2 15430'), 'S2-15430')

print("\nC44847 — 'S2-15430 exists and no S2-15431 exists'; type the near miss")
step(44847, "precondition a: S2-15430 exists", pin('S2-15430'), 'S2-15430')
step(44847, "precondition b: S2-15431 does NOT exist", rows('S2-15431'), 0)
step(44847, "step 1  typing the near miss returns nothing", rows('S2-15431'), 0)

print("\nC44850 — 'A Work Order S2-15430 exists'; it is pinned at the very top")
d = srch('S2-15430')
step(44850, "precondition: S2-15430 exists", pin('S2-15430'), 'S2-15430')
step(44850, "step 2  a pinned row sits above the groups", bool(d.get('pinned')), True)
step(44850, "         the pinned row IS that work order", (d.get('pinned') or {}).get('primary'), 'S2-15430')

print("\nunderneath all three: the record must be OPENABLE, not merely indexed")
p = d.get('pinned') or {}
v = call(f"/api/work-orders/view/{p.get('id')}")
w = ((v.get('json') or {}).get('data') or {}).get('work_order') or {}
step(0, "GET /api/work-orders/view -> 200 at Staging Heavy Duty", v.get('status'), 200)
print(f"      it is {w.get('number')}, status {w.get('status')}, customer {w.get('company_name')}")

print('\n' + '=' * 78)
if problems:
    print(f'🔴 {len(problems)} PROBLEM(S): {problems}')
    sys.exit(1)
print('✅ ALL THREE CASES ARE RUNNABLE, AND THE ONLY THING THAT CHANGED IS THE WORK ORDER NUMBER.')
