# -*- coding: utf-8 -*-
"""Restore C30173's documented assertion and set its EXPECT-FAIL marker with the Rule-61 symptom.

Rule 57: the case keeps the DOCUMENTED expectation (S18-R10 requires a totals row of zeros) and
becomes a deviation. The expectation is NOT rewritten to match the build.
Rule 61: an EXPECT-FAIL case names the exact observable symptom and all three outcomes, placed in
the tester-facing Expected Results BEFORE the Rule-54 provenance line; the marker goes last.
Rule 50: all three text fields are sent explicitly, because update_case re-renders any text field
omitted from the payload. Every field is re-GET and byte-compared afterwards.
"""
import json, sys, os, base64, urllib.request, time

HERE = os.path.dirname(os.path.abspath(__file__))
CID = 30173
CRED = json.load(open('/tmp/testrail/creds.json'))
HOST = CRED['host'].rstrip('/')
if not HOST.startswith('http'):
    HOST = 'https://' + HOST
AUTH = base64.b64encode(('%s:%s' % (CRED.get('user') or CRED.get('email'), CRED['password'])).encode()).decode()


def api(uri, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request('%s/index.php?/api/v2/%s' % (HOST, uri), data=data,
                                 headers={'Authorization': 'Basic ' + AUTH,
                                          'Content-Type': 'application/json'})
    for a in range(4):
        try:
            r = urllib.request.urlopen(req, timeout=90)
            return r.status, json.load(r)
        except urllib.error.HTTPError as e:
            return e.code, e.read().decode(errors='replace')[:500]
        except Exception:
            if a == 3:
                raise
            time.sleep(2 * (a + 1))


PRECONDS = (
 '1. The Customer filter selection is empty ("Clear all") or the filters otherwise match no customers.'
)

STEPS = (
 '1. Choose "Download (CSV)" and open the file.\n'
 '2. Choose "Download (PDF)" and open the file.'
)

EXPECTED = (
 '1. The export still downloads — no error and no warning is shown.\n'
 '2. The file contains the column headers, a totals row of zeros, and no data rows.\n'
 '\n'
 'What you should see today: the file downloads with the column headings and nothing after them - '
 'there is no totals row at all, of zeros or otherwise. This is a known problem and it is already '
 'reported - see https://shopview.atlassian.net/browse/SV-8991.\n'
 '- If you see exactly that, mark this test FAILED and do not raise anything new.\n'
 '- If it fails in a DIFFERENT way from what is described above - for example the download errors, or '
 'a totals row appears but the figures are not zeros - that is a NEW problem, so please report it.\n'
 '- If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note '
 'removed.\n'
 '\n'
 '---\n'
 'This is the expected behaviour as per epic SV-8582 and the Sales By Customer report specification '
 'version 15 (S18-R10).\n'
 'Last checked against build v3.5-7168d14 on 8/6/2026.\n'
 '\n'
 'AUTOMATION: READY - EXPECT FAIL (SV-8991)\n'
)

REFS = 'SV-8616 (SBC spec v15 2026-08-05 Story 18 S18-R10)'

PAYLOAD = {'custom_preconds': PRECONDS, 'custom_steps': STEPS,
           'custom_expected': EXPECTED, 'refs': REFS}


def norm_refs(s):
    """TestRail's declared refs normalisation: split on commas, trim, rejoin with a bare comma."""
    return ','.join(p.strip() for p in (s or '').split(','))


if __name__ == '__main__':
    st, pre = api('get_case/%d' % CID)
    assert st == 200, (st, pre)
    json.dump(pre, open(os.path.join(HERE, '..', 'snapshots', 'c30173-pre-write.json'), 'w'), indent=1)

    if '--dry-run' in sys.argv:
        print('=== PAYLOAD SANITY ===')
        e = PAYLOAD['custom_expected']
        print('provenance lines            :', e.count('This is the expected behaviour as per'))
        print('build lines                 :', e.count('Last checked against build'))
        print('AUTOMATION markers          :', e.count('AUTOMATION:'))
        print('marker is the last content  :', e.rstrip().endswith('AUTOMATION: READY - EXPECT FAIL (SV-8991)'))
        print('blank line before marker    :', '\n\nAUTOMATION:' in e)
        print('separator present           :', e.count('\n---\n'))
        print('three outcomes present      :', all(x in e for x in
              ('mark this test FAILED', 'that is a NEW problem', 'the fix has shipped')))
        print('raw markup                  :', any(t in e for t in ('<p>', '<ol>', '<li>', '<br')))
        print('refs length / commas        :', len(REFS), '/', REFS.count(','))
        print()
        print('=== EXPECTED, AS IT WILL BE STORED ===')
        print(e)
        sys.exit(0)

    st, out = api('update_case/%d' % CID, PAYLOAD)
    print('update_case HTTP', st)
    if st != 200:
        print(out)
        sys.exit(1)

    st2, post = api('get_case/%d' % CID)
    assert st2 == 200
    json.dump(post, open(os.path.join(HERE, '..', 'snapshots', 'c30173-post-write.json'), 'w'), indent=1)

    intended = dict(PAYLOAD)
    intended['refs'] = norm_refs(REFS)
    rows, fails = [], 0
    for k in sorted(set(list(pre.keys()) + list(post.keys()))):
        if k in ('updated_on', 'updated_by'):
            rows.append((k, 'MOVED (expected on a write)', str(pre.get(k)), str(post.get(k))))
            continue
        if k in intended:
            ok = post.get(k) == intended[k]
            rows.append((k, 'MATCH intended' if ok else 'MISMATCH', '', ''))
        else:
            ok = post.get(k) == pre.get(k)
            rows.append((k, 'byte-identical' if ok else 'CHANGED UNINTENDED',
                         repr(pre.get(k))[:60], repr(post.get(k))[:60]))
        if not ok:
            fails += 1
    print('%-28s %s' % ('FIELD', 'RESULT'))
    for k, r, a, b in rows:
        print('%-28s %s' % (k, r), ('| %s -> %s' % (a, b)) if r.startswith(('CHANGED', 'MOVED')) else '')
    print()
    print('%d fields compared, %d mismatches' % (len(rows), fails))
    json.dump([{'field': k, 'result': r} for k, r, a, b in rows],
              open(os.path.join(HERE, '..', 'C30173-FIELD-COMPARE.json'), 'w'), indent=1)
    if fails:
        print('STOPPING per Standing Rule 50 - a mismatch means the write failed')
        sys.exit(2)
