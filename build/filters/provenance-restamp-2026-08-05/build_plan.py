#!/usr/bin/env python3
"""Rewrite all 110 Filters provenance lines to the Rule-54 (amended 2026-08-05) two-sentence form.
SENTENCE 1 names ONLY documents. SENTENCE 2 names the build ONLY as what it was last checked against.
Every rewrite is a deterministic transform of the live text; nothing is composed from memory."""
import json, re, sys

BUILD = 'ShopView v3.4.2-d00239b on the Filters QA branch'
SPEC  = 'the Filters specification at Confluence version 18 (published 4 August 2026)'
A_PRE = f'This is the expected behaviour as per the build tested on 8/5/2026 ({BUILD}), epic SV-8785 and {SPEC} '
B_PRE = f'This is the expected behaviour as per epic SV-8785 and {SPEC} '
NEW_PRE = f'This is the expected behaviour as per epic SV-8785 and {SPEC} '
S2      = f'Last checked on 8/5/2026 against build {BUILD}.'
S2_FAIL = f'Last checked on 8/5/2026 against build {BUILD}; the build does not behave this way yet.'
S2_NB   = (f'Last checked on 8/5/2026 against build {BUILD}: this part of the product is not built '
           f'yet, and the controls this test needs were looked for and were not found.')
S2_MOB  = f'Last checked on 8/5/2026 against build {BUILD}, at a phone-sized screen 390 pixels wide.'

OLD_FAIL = ('It was checked against the build on 8/5/2026 '
            f'({BUILD}), which does not behave this way yet.')
OLD_MOB  = ('This was checked against the running app on 8/5/2026, on build '
            f'{BUILD}, at a phone-sized screen 390 pixels wide.')
NB_OPEN  = ("This is the expected behaviour as per epic SV-8785, the designs and the product owner's "
            "answers named below - not as per the build, because this part of the product is not built yet. "
            f'On the build looked at on 8/5/2026 ({BUILD}) the controls this test needs were looked for '
            'and were not found. ')
NB_NEW   = ("This is the expected behaviour as per epic SV-8785, the designs and the product owner's "
            "answers named below. ")
C876_OLD = f'This is the expected behaviour as per the build tested on 8/5/2026 ({BUILD}) and epic SV-8785. '
C876_NEW = 'This is the expected behaviour as per epic SV-8785. '

# build-as-corroboration clauses inside the trailing divergence Note (Rule 54: the build is never
# named as a source, not even in passing) — these are the QA lead's exact concern, so they go.
CORROB = [
 (' the specification and the build both hide it, and the specification is the newer source, so this '
  'test follows the specification and the build.',
  ' the specification hides it, and the specification is the newer source, so this test follows the '
  'specification.'),
 (' the specification and the build both hide it, and the specification is the newer source, so this '
  'test follows the specification.',
  ' the specification hides it, and the specification is the newer source, so this test follows the '
  'specification.'),
 (' the specification asks only for the name and the arrow, and the build matches the specification, '
  'so this test follows the specification and the build.',
  ' the specification asks only for the name and the arrow, so this test follows the specification.'),
]

BARRED = ['as per the build', 'build tested on', 'verified by the build', 'as the build behaves',
          'as per the build tested']

rows = json.load(open('classify2.json'))
cases = {c['id']: c for c in json.load(open('cases-PRE.json'))}
plan, groups = [], {}

for r in rows:
    cid, p = r['cid'], r['prov']
    g = None
    if p.startswith(A_PRE):
        rest = p[len(A_PRE):]
        new = NEW_PRE + rest
        for a, b in CORROB:
            if a in new: new = new.replace(a, b)
        new = new.rstrip() + ' ' + S2
        g = 'A-barred-build-first'
    elif p.startswith(B_PRE) and OLD_FAIL in p:
        new = p.replace(OLD_FAIL, S2_FAIL).rstrip()
        g = 'B-deviation'
    elif p.startswith(B_PRE) and OLD_MOB in p:
        new = p.replace(OLD_MOB, S2_MOB).rstrip()
        g = 'B-mobile'
    elif p.startswith(NB_OPEN):
        new = NB_NEW + p[len(NB_OPEN):].rstrip()
        if not new.endswith('.'): new += '.'
        new = new + ' ' + S2_NB
        g = 'C-not-built'
    elif p.startswith(C876_OLD):
        new = C876_NEW + p[len(C876_OLD):].rstrip()
        if not new.endswith('.'): new += '.'
        new = new + ' ' + S2
        g = 'C-no-anchor'
    else:
        print('!! UNCLASSIFIED C%s' % cid); print(p); sys.exit(1)
    groups[g] = groups.get(g, 0) + 1

    # rebuild the whole expected field: body + '---' + newprov + tail(unchanged)
    old_exp = cases[cid]['custom_expected']
    blocks = old_exp.split('\n\n')
    i = r['prov_idx']
    assert blocks[i].startswith('---\n')
    blocks[i] = '---\n' + new
    new_exp = '\n\n'.join(blocks)
    plan.append(dict(cid=cid, group=g, old_prov=p, new_prov=new,
                     expected=new_exp, old_expected=old_exp,
                     changed=(new_exp != old_exp)))

print('planned:', len(plan), '| changed:', sum(1 for p in plan if p['changed']))
print('groups:', groups)

# ---- gates on the planned text -------------------------------------------------
bad = []
for p in plan:
    for b in BARRED:
        if b in p['new_prov']: bad.append((p['cid'], b))
print('BARRED phrasings remaining in planned provenance:', len(bad), bad[:5])

# exactly one provenance sentence, marker still last, marker unchanged, body unchanged
prob = []
for p in plan:
    ne, oe = p['expected'], p['old_expected']
    if ne.count('This is the expected behaviour') != 1: prob.append((p['cid'], 'prov count'))
    if not ne.rstrip().split('\n')[-1].startswith('AUTOMATION: '): prob.append((p['cid'], 'marker not last'))
    om = [l for l in oe.split('\n') if l.startswith('AUTOMATION: ')]
    nm = [l for l in ne.split('\n') if l.startswith('AUTOMATION: ')]
    if om != nm: prob.append((p['cid'], 'MARKER CHANGED'))
    # body = everything before the '---' provenance block must be byte-identical
    ob = oe.split('\n\n---\n')[0]; nb = ne.split('\n\n---\n')[0]
    if ob != nb: prob.append((p['cid'], 'BODY CHANGED'))
    # tail after the provenance block byte-identical
    ot = oe.split('\n\n---\n')[1].split('\n\n',1); nt = ne.split('\n\n---\n')[1].split('\n\n',1)
    if len(ot) > 1 and len(nt) > 1 and ot[1] != nt[1]: prob.append((p['cid'], 'TAIL CHANGED'))
print('structural problems:', len(prob), prob[:8])
json.dump(plan, open('plan.json','w'), indent=1)
