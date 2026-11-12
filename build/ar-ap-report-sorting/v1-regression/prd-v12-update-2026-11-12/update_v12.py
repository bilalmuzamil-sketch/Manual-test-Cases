#!/usr/bin/env python3
"""PRD v11 -> v12 update of the A/R A/P regression cases (QA lead 12 Nov 2026: "DO it if that is the best approach and
re run the test cases"). Works on the LIVE TestRail text (live-before/*.json, read 12 Nov 2026) so nobody's edit is
lost; only custom_expected changes, and only these strings:
  1. "PRD v11 (Confluence 947650561"            -> "PRD v12 (Confluence 947650561"
  2. "(Confluence 947650561) v11, 5 Nov 2026"   -> "(Confluence 947650561) v12, 12 Nov 2026"
  3. "<li>PRD v11, "                             -> "<li>PRD v12, "
  4. V1R-90 only: the S1-R8 quote becomes v12's full S1-R8 (v12 added one sentence) - Rule 113.
  5. Rule 54 stamp from the case's latest observed staging result in run 557 (stamps.json, read 12 Nov 2026):
     "Not yet checked against any build." / "Last checked against build ... ." -> "Last checked against build <that build> (staging) on 11/12/2026."
Every other quoted PRD sentence was checked word for word against live v12 first (quote-check.json: 25 of 25).
  python3 update_v12.py --dry-run | --write   (stamps read from stamps.json: {"C<id>": "PASS"|"FAIL"})"""
import json, glob, re, sys, html, datetime, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'tools')); from push_testrail import req
H = os.path.dirname(os.path.abspath(__file__)); MARK = 'v26.45.4-e16016f'
PRD = open('/tmp/claude-0/-home-user/ef40c1d4-3e84-5396-9a66-1a25d97a7768/scratchpad/prd-live-v12.md').read()
S1R8_V12 = re.search(r'^- \*\*S1-R8:\*\* (.*)$', PRD, re.M).group(1).strip()
OLD_S1R8 = S1R8_V12.split(' The documents of an open customer')[0]
assert OLD_S1R8 != S1R8_V12
STAMPS = json.load(open(os.path.join(H, 'stamps.json'))) if os.path.exists(os.path.join(H, 'stamps.json')) else {}
RETIRED = {'C1078998', 'C1078999', 'C1079000', 'C1095432'}   # V1R-25/26/27/76, retired to section 134653
WRITE = '--write' in sys.argv; out = []; changed = 0
for f in sorted(glob.glob(os.path.join(H, 'live-before', '*.json'))):
    c = json.load(open(f)); cid = 'C%d' % c['id']; t0 = c['custom_expected'] or ''; t = t0
    if cid in RETIRED: continue
    t = t.replace('PRD v11 (Confluence 947650561', 'PRD v12 (Confluence 947650561')
    t = t.replace('(Confluence 947650561) v11, 5 Nov 2026', '(Confluence 947650561) v12, 12 Nov 2026')
    t = t.replace('<li>PRD v11, ', '<li>PRD v12, ')
    t = t.replace('Confluence 947650561, version 11 (5 Nov 2026, Chris Ward), read 10 Nov 2026',
                  'Confluence 947650561, version 12 (12 Nov 2026, Milos Vasic), read 12 Nov 2026')   # section 133628 cases
    if cid == 'C1095446':
        old = html.escape(OLD_S1R8, quote=False); new = html.escape(S1R8_V12, quote=False)
        assert t.count(old) == 1, 'V1R-90 quote not found'; t = t.replace(old, new)
    if STAMPS.get(cid):
        t, n = re.subn(r'(Not yet checked against any build\.|Last checked against build [^<]*?on \d+/\d+/\d{4}\.)',
                       f'Last checked against build {STAMPS[cid]["build"]} (staging) on 11/12/2026.', t)
    left = [m.group(0) for m in re.finditer(r'.{0,12}(v11|version 11).{0,6}', t) if 'sv11315' not in m.group(0)]
    assert not left, (cid, left)
    if t == t0: continue
    changed += 1; rec = {'case': cid, 'utc': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
                         'v11_labels': len(re.findall(r'PRD v11|947650561\) v11', t0)), 'stamped': (STAMPS.get(cid) or {}).get('build')}
    if WRITE:
        s, r = req(f'update_case/{c["id"]}', {'custom_expected': t}); s2, back = req(f'get_case/{c["id"]}')
        rec.update(http=s, verification='OK' if s2 == 200 and back.get('custom_expected') == t and back.get('title') == c['title']
                   and back.get('custom_steps') == c.get('custom_steps') and back.get('custom_preconds') == c.get('custom_preconds') else 'MISMATCH')
        with open(os.path.join(H, 'push-log.jsonl'), 'a') as fh: fh.write(json.dumps(rec) + '\n')
    out.append(rec)
print(('WRITTEN' if WRITE else 'DRY RUN') + f': {changed} cases change; stamped {sum(1 for r in out if r["stamped"])}; '
      + (f'verification {dict((v, sum(1 for r in out if r.get("verification") == v)) for v in ("OK", "MISMATCH"))}' if WRITE else ''))
print('V1R-90 new quote ends:', S1R8_V12[-150:])
