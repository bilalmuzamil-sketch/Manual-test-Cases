"""Report Suite VIU writer, 2026-08-06.
Rule 50: every write re-GET and byte-compared; ALL THREE text fields sent every time
(TestRail re-renders any omitted text field).  Rule 54: provenance is TWO sentences that
never merge - sentence 1 names only documents, sentence 2 is
"Last checked against build <marker> on <date>."
"""
import json, re, sys
sys.path.insert(0, '/tmp/testrail')
import tr

BUILD = 'v3.5-16cf83f'
DATE = '8/6/2026'
MARKER_RE = re.compile(r'^AUTOMATION: (?:READY - EXPECT FAIL \([^)]*\)|READY|HOLD.*)$', re.M)
LASTCHK_RE = re.compile(r'^Last checked against build .*$', re.M)


def split_expected(exp):
    """-> (body, prov_sentence1, marker)"""
    m = MARKER_RE.search(exp)
    marker = m.group(0) if m else None
    head = exp[:m.start()] if m else exp
    lines = head.rstrip().split('\n')
    prov1 = None
    for i, l in enumerate(lines):
        if l.startswith('This is the expected behaviour'):
            prov1 = l
            break
    return head, prov1, marker


def rebuild(exp, marker=None, known=None, body_edits=None):
    """Rewrite an expected-results field: refresh sentence 2, set marker, apply edits."""
    m = MARKER_RE.search(exp)
    head = exp[:m.start()].rstrip('\n') if m else exp.rstrip('\n')
    old_marker = m.group(0) if m else 'AUTOMATION: READY'
    new_marker = marker or old_marker

    # split body from provenance block on the '---' separator
    if '\n---\n' in head:
        body, prov = head.split('\n---\n', 1)
    else:
        body, prov = head, ''

    if body_edits:
        for old, new in body_edits:
            if old not in body:
                raise RuntimeError('body edit anchor not found: %r' % old[:70])
            body = body.replace(old, new)

    # known-issue line goes at the end of the body, once
    body = re.sub(r'\nKnown issue: .*(?:\n(?!\n).*)*', '', body).rstrip()
    if known:
        body = body + '\n' + known

    # sentence 2
    newline2 = 'Last checked against build %s on %s.' % (BUILD, DATE)
    if LASTCHK_RE.search(prov):
        prov = LASTCHK_RE.sub(newline2, prov).rstrip()
    else:
        prov = prov.rstrip() + '\n' + newline2

    return body.rstrip() + '\n\n---\n' + prov.strip() + '\n\n' + new_marker


def write(cid, new_expected, refs=None, log=None):
    st, cur = tr.get_case(cid)
    if st != 200:
        raise RuntimeError('pre-GET C%d HTTP %s' % (cid, st))
    payload = {
        'custom_preconds': cur.get('custom_preconds') or '',
        'custom_steps': cur.get('custom_steps') or '',
        'custom_expected': new_expected,
    }
    if refs is not None:
        payload['refs'] = refs
    st, line, before, after = tr.update_case_verified(cid, payload, 'update_case')
    if log is not None:
        log.append({'cid': cid, 'http': st, 'verify': line})
    return line
