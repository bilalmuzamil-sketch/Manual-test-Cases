#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rule 28 closing gate — cross-case consistency sweep over the 40 edited cases.

Four passes, all against the LIVE post-write state:
  1. SAME-ANCHOR CLUSTERS   every anchor cited by an edited case -> every OTHER case
                            citing it; diff their expected results on the shared
                            control noun.
  2. OPPOSITE-ASSERTION     hidden/shown, disabled/enabled, exactly/conditional,
                            reloads/does-not-reload, measure/by-eye, devtools/no-devtools.
  3. TITLE-vs-EXPECTED      does each edited case's title still describe its expected?
  4. NAMED-ENTITY           the verifier's honest limit (§6): a polarity heuristic misses
                            conflicts that turn on a NAME, so sweep the control names the
                            edits introduced (Location / Branch column, contrast ratio,
                            devtools) across ALL 475.
READ-ONLY.
"""
import json, os, re, sys, itertools

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from plan import PLAN  # noqa: E402

LIVE = [c for c in json.load(open('/tmp/vf/live-cases.json')) if c['created_by'] == 3]
SECS = {s['id']: s['name'] for s in json.load(open('/tmp/vf/sections.json'))}
BY = {c['id']: c for c in LIVE}
EDITED = sorted(PLAN)
ANCH = re.compile(r'S\d+-(?:R\d+[a-z]?|N\d+|E\d+)')


def rep(c):
    n = SECS[c['section_id']]
    return n.split(' ')[0]


def text(c):
    return ' '.join([(c.get('custom_expected') or ''), (c.get('custom_steps') or ''),
                     (c.get('custom_preconds') or '')])


findings = []

# ── 1 · same-anchor clusters ─────────────────────────────────────────────────
print('=' * 90)
print('PASS 1 — SAME-ANCHOR CLUSTERS containing an edited case')
clusters = {}
for c in LIVE:
    for a in set(ANCH.findall(c.get('refs') or '')):
        clusters.setdefault((rep(c), a), []).append(c['id'])
touched_clusters = {k: v for k, v in clusters.items()
                    if len(v) > 1 and any(i in PLAN for i in v)}
print(f'  clusters with >1 case that include an edited case: {len(touched_clusters)}')
NEW_ANCHORS = {30167: ['S4-R13', 'S15-R14'], 30277: ['S14-R20'], 30376: ['S6-R11'],
               30437: ['S7-R13'], 30511: ['S7-R13', 'S9-E1'], 30588: ['S10-R15'],
               38856: ['S14-R2', 'S14-R4', 'S15-R2', 'S15-R4', 'S15-R5']}
print('\n  NEW anchor links created by this pass (the re-check net they now join):')
for cid, anchors in sorted(NEW_ANCHORS.items()):
    for a in anchors:
        peers = sorted(set(clusters.get((rep(BY[cid]), a), [])) - {cid})
        print(f'    C{cid} +{a:9s} -> now clustered with {len(peers)} case(s): '
              f'{", ".join("C%d" % p for p in peers) or "(none)"}')

# ── 2 · opposite-assertion keyword sweep, restricted to the edited cases and
#        every case sharing one of their anchors ───────────────────────────────
print()
print('=' * 90)
print('PASS 2 — OPPOSITE-ASSERTION sweep (edited cases vs their same-anchor peers)')
POLARITY = [
    ('column shown', r'\b(Location|Branch) column[^.]{0,60}\b(is |are |appears?|carr(y|ies)|includes?)',
     r'\bno (Location|Branch) column|(Location|Branch) column is (hidden|absent|not)'),
    ('closed vs conditional', r'\b(are|is) exactly\b|\bexactly (two|three|four|five|six|seven|nine|ten|eleven)\b',
     r'\bWith a single location in scope\b|\bwhen more than one location\b'),
    ('reload', r'\breloads?\b(?![^.]*not)', r'\bdoes NOT reload\b|\bNO reload\b|\bno server request\b'),
    ('devtools', r'\bdevtools\b|\bnetwork tab\b', r'\bdo not need developer tools\b'),
    ('measure', r'\bMeasure\b', r'\bdo not need to measure\b'),
]
pairs = 0
for (r_, a), ids in sorted(touched_clusters.items()):
    for x, y in itertools.combinations(sorted(ids), 2):
        if x not in PLAN and y not in PLAN:
            continue
        tx, ty = text(BY[x]), text(BY[y])
        for label, pos, neg in POLARITY:
            hx, hy = re.search(pos, tx, re.I), re.search(neg, ty, re.I)
            hx2, hy2 = re.search(neg, tx, re.I), re.search(pos, ty, re.I)
            if (hx and hy) or (hx2 and hy2):
                pairs += 1
                findings.append((r_, a, x, y, label))
print(f'  candidate opposite-assertion pairs raised: {pairs}')
for r_, a, x, y, label in findings:
    print(f'    [{r_} {a}] C{x} vs C{y}  ({label})')

# ── 3 · title vs expected ────────────────────────────────────────────────────
print()
print('=' * 90)
print('PASS 3 — TITLE-vs-EXPECTED on every edited case')
STOP = set('a an the and or of in on to for with is are be by from that this it its no not '
           'when then their there each every all both any as at into per shows show '
           'appear appears keeps keep holds hold order same only exactly'.split())
weak = []
for cid in EDITED:
    c = BY[cid]
    words = {w.lower().strip('".,()%/-') for w in re.findall(r"[A-Za-z][\w'/-]+", c['title'])}
    words -= STOP
    body = (text(c) + ' ' + c['title']).lower()
    missing = sorted(w for w in words if w and w not in body)
    if missing:
        weak.append((cid, missing))
print(f'  edited cases whose title has a term absent from its own body: {len(weak)}')
for cid, m in weak:
    print(f'    C{cid}: {m}   title="{BY[cid]["title"]}"')

# ── 4 · named-entity sweep across ALL 475 ────────────────────────────────────
print()
print('=' * 90)
print('PASS 4 — NAMED-ENTITY sweep across all 475 (the verifier\'s §6 blind spot)')
for name, pat in [
    ('asks the tester to MEASURE a ratio', r'\bmeasure\b[^.]{0,60}\b(contrast|ratio)'),
    ('requires devtools / network tab', r'\bdevtools\b|\bnetwork tab\b'),
    ('closes a column list with "exactly" and no location conditional',
     r'columns?[^.]{0,40}\bexactly\b'),
]:
    hits = [c['id'] for c in LIVE if re.search(pat, text(c), re.I)]
    ui = [h for h in hits if 'API' not in SECS[BY[h]['section_id']]]
    print(f'  {name}: {len(hits)} case(s) total, {len(ui)} of them in a NON-API section '
          f'-> {["C%d" % h for h in ui]}')

print()
print('=' * 90)
print(f'CONTRADICTIONS INTRODUCED BY THIS PASS: {len(findings)} candidate pair(s) '
      f'(each must be judged by hand below)')
