# -*- coding: utf-8 -*-
"""Restore C30114's documented assertion (S18-N1) and set its EXPECT-FAIL marker with the Rule-61 symptom.

C30114 is the SCREEN half of SV-8991; C30173 (repaired earlier today) is the EXPORT half.
Rule 57: the case keeps the DOCUMENTED expectation - S18-N1 requires the totals row to show zeros -
and becomes a deviation. The expectation is NOT rewritten to match the build.
Rule 61: the symptom and all three outcomes go in the tester-facing Expected Results BEFORE the
Rule-54 provenance line; the marker goes last, blank line before, line break after.
Rule 50: all three text fields are sent explicitly, because update_case re-renders any text field
omitted from the payload. Every field is re-GET and byte-compared afterwards.
Rule 12: the provenance build sentence is NOT re-stamped - nothing was re-observed; the branch is
unreachable (shared sign-in expired estate-wide ~11:37Z) and quick-login/switch-user were not called.
"""
import json, sys, os, base64, urllib.request, time

HERE = os.path.dirname(os.path.abspath(__file__))
CID = 30114
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
            return e.code, e.read().decode(errors='replace')[:600]
        except Exception:
            if a == 3:
                raise
            time.sleep(2 * (a + 1))


# --- UNCHANGED, byte-identical to what is live (sent explicitly per Rule 50) ---
PRECONDS = (
 '1. You are on the Sales By Customer report with several customers in the current results.'
)

STEPS = (
 '1. Open the Customer filter while it is in the all-customers state and read the pinned control at '
 'the top of the dropdown.\n'
 '2. Activate it ("Clear all") and read the table body, the totals row, and the filter\'s collapsed '
 'label.\n'
 '3. Read the pinned control again and activate it once more.'
)

# --- REPAIRED ---
EXPECTED = (
 '1. In the all-customers state the pinned control reads "Clear all"; activating it clears the '
 'selection to an empty set.\n'
 '2. When the filter is NOT in the all-customers state the pinned control reads "All customers"; '
 'activating it puts the filter back in the all-customers state.\n'
 '3. The control is pinned to the top of the dropdown in both states.\n'
 '4. After "Clear all": the report shows the empty-state message "No sales data found for the '
 'selected filters." The collapsed label reads "None", and the totals row shows zeros.\n'
 '\n'
 'What you should see today: everything in item 4 happens except the totals row - the empty-state '
 'message appears and the collapsed label reads "None", but there is no totals row on the report at '
 'all, of zeros or otherwise. This is a known problem and it is already reported - see '
 'https://shopview.atlassian.net/browse/SV-8991.\n'
 '- If you see exactly that, mark this test FAILED and do not raise anything new.\n'
 '- If it fails in a DIFFERENT way from what is described above - for example a totals row appears '
 'but the figures are not zeros, or the empty-state message or the "None" label is wrong, or the '
 'pinned control in items 1 to 3 does not behave as described - that is a NEW problem, so please '
 'report it.\n'
 '- If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note '
 'removed.\n'
 '\n'
 '---\n'
 'This is the expected behaviour as per epic SV-8582 and the Sales By Customer report specification '
 'version 15 (S18-R3, S18-N1, S17-E1).\n'
 'Last checked against build v3.5-7168d14 on 8/6/2026.\n'
 '\n'
 'AUTOMATION: READY - EXPECT FAIL (SV-8991)\n'
)

REFS = 'SV-8616 (SBC spec v15 2026-08-05 Story 18 S18-R3; S18-N1; S17-E1)'

PAYLOAD = {'custom_preconds': PRECONDS, 'custom_steps': STEPS,
           'custom_expected': EXPECTED, 'refs': REFS}


def norm_refs(s):
    """TestRail's declared refs normalisation: split on commas, trim, rejoin with a bare comma."""
    return ','.join(p.strip() for p in (s or '').split(','))


if __name__ == '__main__':
    st, pre = api('get_case/%d' % CID)
    assert st == 200, (st, pre)
    json.dump(pre, open(os.path.join(HERE, 'c30114-pre-write.json'), 'w'), indent=1)

    if '--dry-run' in sys.argv:
        e = PAYLOAD['custom_expected']
        print('=== PAYLOAD SANITY (shape checked BEFORE sending, Rule 50) ===')
        print('provenance lines            :', e.count('This is the expected behaviour as per'))
        print('build lines                 :', e.count('Last checked against build'))
        print('AUTOMATION markers          :', e.count('AUTOMATION:'))
        print('marker is the last content  :', e.rstrip().endswith('AUTOMATION: READY - EXPECT FAIL (SV-8991)'))
        print('blank line before marker    :', '\n\nAUTOMATION:' in e)
        print('line break after marker     :', e.endswith('\n'))
        print('separator present           :', e.count('\n---\n'))
        print('three outcomes present      :', all(x in e for x in
              ('mark this test FAILED', 'that is a NEW problem', 'the fix has shipped')))
        print('ticket named in symptom     :', 'SV-8991' in e)
        print('zeros assertion restored    :', 'the totals row shows zeros' in e)
        print('false note gone             :', 'does not say what the totals row' not in e)
        print('raw markup                  :', any(t in e for t in ('<p>', '<ol>', '<li>', '<br')))
        print('CRLF in any text field      :', any('\r' in (PAYLOAD[k] or '') for k in
              ('custom_preconds','custom_steps','custom_expected')))
        print('refs len / commas           :', len(REFS), '/', REFS.count(','))
        print('refs normalises to itself   :', norm_refs(REFS) == REFS)
        print('preconds byte-identical live:', PAYLOAD['custom_preconds'] == pre.get('custom_preconds'))
        print('steps byte-identical to live:', PAYLOAD['custom_steps'] == pre.get('custom_steps'))
        print()
        print('=== EXPECTED, AS IT WILL BE STORED ===')
        print(e)
        sys.exit(0)

    st, out = api('update_case/%d' % CID, PAYLOAD)
    print('update_case HTTP', st)
    if st != 200:
        print(out); sys.exit(1)

    st2, post = api('get_case/%d' % CID)
    assert st2 == 200
    json.dump(post, open(os.path.join(HERE, 'c30114-post-write.json'), 'w'), indent=1)

    intended = dict(PAYLOAD)
    intended['refs'] = norm_refs(REFS)
    rows, fails = [], 0
    for k in sorted(set(list(pre.keys()) + list(post.keys()))):
        if k in ('updated_on', 'updated_by'):
            rows.append((k, 'MOVED (expected on a write)', str(pre.get(k)), str(post.get(k)))); continue
        if k in intended:
            ok = post.get(k) == intended[k]
            rows.append((k, 'MATCH intended' if ok else 'MISMATCH', repr(intended[k])[:70], repr(post.get(k))[:70]))
        else:
            ok = post.get(k) == pre.get(k)
            rows.append((k, 'byte-identical' if ok else 'CHANGED UNINTENDED',
                         repr(pre.get(k))[:70], repr(post.get(k))[:70]))
        if not ok:
            fails += 1
    print('%-30s %s' % ('FIELD', 'RESULT'))
    for k, r, a, b in rows:
        print('%-30s %s' % (k, r), ('| %s -> %s' % (a, b)) if r.startswith(('CHANGED', 'MOVED', 'MISMATCH')) else '')
    print()
    print('%d fields compared, %d mismatches' % (len(rows), fails))
    json.dump([{'field': k, 'result': r} for k, r, a, b in rows],
              open(os.path.join(HERE, 'C30114-FIELD-COMPARE.json'), 'w'), indent=1)
    if fails:
        print('STOPPING per Standing Rule 50 - a mismatch means the write failed')
        sys.exit(2)
