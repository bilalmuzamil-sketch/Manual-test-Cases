"""Hand repairs to source citations on the three handed-off reports, 2026-08-10.
Each repair is an EXACT string substitution asserted present before it is applied.
The build-stamp sentence is never touched: nothing was observed on the build this pass.
"""
import json, re, sys
sys.path.insert(0, '/tmp/testrail')
import tr

MARKER_RE = re.compile(r'^AUTOMATION: (?:READY - EXPECT FAIL \([^)]*\)|READY|HOLD.*)$', re.M)
HEDGE = ('; where the wording of that specification differs, the behaviour above follows '
         "Chris Ward's later decision, recorded in his answers in this file: "
         'https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit'
         '?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true which is the authority.')

def sanity(exp, cid):
    provs = [l for l in exp.splitlines() if l.strip().startswith('This is the expected behaviour')]
    marks = MARKER_RE.findall(exp)
    assert len(provs) == 1, f'C{cid}: {len(provs)} provenance lines'
    assert len(marks) == 1, f'C{cid}: {len(marks)} markers'
    assert exp.rstrip().splitlines()[-1].startswith('AUTOMATION:'), f'C{cid}: marker not last'
    assert not re.search(r'<(?:ol|li|ul|p|hr|br|strong|em)\b', exp, re.I), f'C{cid}: raw markup'
    assert 'Last checked against build' in exp, f'C{cid}: build sentence lost'

def apply(cid, exp_subs=(), refs_new=None, note=''):
    st0, live = tr.get_case(cid)
    assert st0 == 200, f'C{cid} pre-GET {st0}'
    exp = live.get('custom_expected') or ''
    old_build = re.search(r'^Last checked against build .*$', exp, re.M).group(0)
    for old, new in exp_subs:
        assert old in exp, f'C{cid}: anchor text NOT FOUND -> {old[:90]!r}'
        assert exp.count(old) == 1, f'C{cid}: anchor text appears {exp.count(old)} times'
        exp = exp.replace(old, new)
    sanity(exp, cid)
    assert re.search(r'^Last checked against build .*$', exp, re.M).group(0) == old_build, \
        f'C{cid}: build sentence changed - refused'
    payload = {'custom_preconds': live.get('custom_preconds') or '',
               'custom_steps': live.get('custom_steps') or '',
               'custom_expected': exp}
    if refs_new is not None:
        for e in refs_new.split(','):
            assert len(e) <= 248, f'C{cid}: refs entry {len(e)} chars > 248'
        payload['refs'] = refs_new
    st, line, before, after = tr.update_case_verified(cid, payload, 'handfix')
    print(f'C{cid} {line}  [{note}]')
    return {'cid': cid, 'http': st, 'verify': line, 'note': note}
