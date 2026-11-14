#!/usr/bin/env python3
"""PRD v12 -> v13 update of the A/R A/P regression cases (QA lead 14 Nov 2026: "2. YES" to: relabel the cases' PRD
citations v12 -> v13, and take the EXPECT FAIL off C1078980 / C1078981 now that the SV-12545 fix passed on staging).
v13 (13 Nov 2026, Chris Ward) only ADDS S5-R10b and a change-log row (diff of ../sources v12 vs v13), so every quote
already in the cases is still word for word in v13. Works on the LIVE text (live-before/, read 14 Nov 2026); only
custom_expected changes:
  1-4. the v12 labels -> v13 (same four patterns update_v12.py used)
  5. C1078980 / C1078981 only: EXPECT FAIL block removed; "PRD ... is silent on it" -> S5-R10b quoted verbatim
     (Rule 113/123 - the sentence was no longer true); Rule 54 stamp -> v26.45.4-f3d3d2d (staging) 11/14/2026, the
     build both passed on (run 557, 14 Nov); marker -> AUTOMATION: READY (EXPECT FAIL outcome 3: the fix shipped).
  python3 update_v13.py --dry-run | --write"""
import json, glob, re, sys, html, datetime, os
H = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(H, '..', 'tools')); from push_testrail import req
PRD = open(os.path.join(H, '..', 'sources', 'PRD-947650561-v13-2026-11-14.md')).read()
S5R10B = re.search(r'^- \*\*S5-R10b:\*\* (.*)$', PRD, re.M).group(1).strip()
RETIRED = {'C1078998', 'C1078999', 'C1079000', 'C1095432'}
FIXED = {'C1078980', 'C1078981'}; MARK = 'v26.45.4-f3d3d2d'
WRITE = '--write' in sys.argv; out = []
for f in sorted(glob.glob(os.path.join(H, 'live-before', '*.json'))):
    c = json.load(open(f)); cid = 'C%d' % c['id']; t0 = c['custom_expected'] or ''; t = t0
    if cid in RETIRED: continue
    t = t.replace('PRD v12 (Confluence 947650561', 'PRD v13 (Confluence 947650561')
    t = t.replace('(Confluence 947650561) v12, 12 Nov 2026', '(Confluence 947650561) v13, 13 Nov 2026')
    t = t.replace('<li>PRD v12, ', '<li>PRD v13, ')
    t = t.replace('Confluence 947650561, version 12 (12 Nov 2026, Milos Vasic), read 12 Nov 2026',
                  'Confluence 947650561, version 13 (13 Nov 2026, Chris Ward), read 14 Nov 2026')
    if cid in FIXED:
        t, n1 = re.subn(r'<ul><li></li></ul><ul><li>EXPECT FAIL\..*?Put it in the Defects field when you mark this test FAILED\.</li></ul>', '', t, flags=re.S)
        old = '; the A/R and A/P Report Sorting PRD v13 (Confluence 947650561) is silent on it.'
        new = ('; the A/R and A/P Report Sorting PRD v13 (Confluence 947650561), 13 Nov 2026, S5-R10b, keeps it, quoted: \u201c'
               + html.escape(S5R10B, quote=False) + '\u201d')
        n2 = t.count(old); t = t.replace(old, new)
        t, n3 = re.subn(r'Last checked against build [^<]*?on \d+/\d+/\d{4}\.', f'Last checked against build {MARK} (staging) on 11/14/2026.', t)
        n4 = t.count('AUTOMATION: READY - EXPECT FAIL (SV-12545)'); t = t.replace('AUTOMATION: READY - EXPECT FAIL (SV-12545)', 'AUTOMATION: READY')
        assert (n1, n2, n3, n4) == (1, 1, 1, 1), (cid, n1, n2, n3, n4)
        assert 'EXPECT FAIL' not in t and t.count('AUTOMATION:') == 1
    left = [m.group(0) for m in re.finditer(r'.{0,12}(v12|version 12).{0,6}', t) if 'sv11315' not in m.group(0)]
    assert not left, (cid, left)
    if t == t0: continue
    rec = {'case': cid, 'utc': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
           'v12_labels': len(re.findall(r'PRD v12|947650561\) v12|version 12', t0)), 'expect_fail_removed': cid in FIXED}
    if WRITE:
        s, r = req(f'update_case/{c["id"]}', {'custom_expected': t}); s2, back = req(f'get_case/{c["id"]}')
        rec.update(http=s, verification='OK' if s2 == 200 and back.get('custom_expected') == t and back.get('title') == c['title']
                   and back.get('custom_steps') == c.get('custom_steps') and back.get('custom_preconds') == c.get('custom_preconds')
                   and back.get('custom_atmstatus') == c.get('custom_atmstatus') else 'MISMATCH')
        with open(os.path.join(H, 'push-log.jsonl'), 'a') as fh: fh.write(json.dumps(rec) + '\n')
    else:
        open(os.path.join(H, f'dryrun-{cid}.html'), 'w').write(t) if cid in FIXED else None
    out.append(rec)
print(('WRITTEN' if WRITE else 'DRY RUN') + f': {len(out)} cases change; EXPECT FAIL removed on {sum(r["expect_fail_removed"] for r in out)}'
      + (f'; verification {dict((v, sum(1 for r in out if r.get("verification") == v)) for v in ("OK", "MISMATCH"))}' if WRITE else ''))
