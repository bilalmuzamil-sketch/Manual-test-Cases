"""Re-stamp the SPEC VERSION only, in the provenance line and in refs.
Deliberately does NOT touch the build-stamp sentence: nothing was observed on the
build this pass, so a new build date would be a claim we cannot support (Rule 12).
Sends all three text fields explicitly (TestRail re-renders omitted text fields).
"""
import json, re, sys, difflib
sys.path.insert(0, '/tmp/testrail')
import tr

LIVE = {'SBC': (16, '2026-08-06'), 'TU': (7, '2026-08-06'), 'WIP': (10, '2026-08-06')}
NAME = {'SBC': 'Sales By Customer', 'TU': 'Technician Utilization', 'WIP': 'Work In Progress'}
PROV_PAT = {g: r'(?<=report specification version )\d+' for g in LIVE}
ALLNAMES = {'Sales By Customer': 16, 'Technician Utilization': 7, 'Work In Progress': 10}
REFS_PAT = {g: r'(?<=%s spec v)\d+ \d{4}-\d{2}-\d{2}' % g for g in LIVE}
MARKER_RE = re.compile(r'^AUTOMATION: (?:READY - EXPECT FAIL \([^)]*\)|READY|HOLD.*)$', re.M)

def sanity(exp, cid):
    """Shape checks the QA lead asked for, run on the PAYLOAD before it is sent."""
    provs = [l for l in exp.splitlines() if l.strip().startswith('This is the expected behaviour')]
    marks = MARKER_RE.findall(exp)
    assert len(provs) == 1, f'C{cid}: {len(provs)} provenance lines'
    assert len(marks) == 1, f'C{cid}: {len(marks)} markers'
    assert exp.rstrip().splitlines()[-1].startswith('AUTOMATION:'), f'C{cid}: marker not last'
    assert not re.search(r'<(?:ol|li|ul|p|hr|br|strong|em)\b', exp, re.I), f'C{cid}: raw markup'
    for entry in (exp,):
        pass

def plan_case(c, rep):
    ver, date = LIVE[rep]
    exp = c.get('custom_expected') or ''
    refs = c.get('refs') or ''
    new_exp = exp
    for nm, v in ALLNAMES.items():   # a cross-report case cites all three in one line
        new_exp = re.sub(r'(the %s report specification version )\d+' % re.escape(nm),
                         r'\g<1>%d' % v, new_exp)
    new_refs = re.sub(r'\b(%s spec v)\d+ \d{4}-\d{2}-\d{2}' % rep,
                      r'\g<1>%d %s' % (ver, date), refs)
    return new_exp, new_refs

def masked_ok(old, new, pattern, cid, field, maxhits=1):
    """Prove the ONLY difference is inside the spans this pass matched.
    Mask every match in BOTH strings; the masked remainders must be byte-identical."""
    ho = list(re.finditer(pattern, old)); hn = list(re.finditer(pattern, new))
    if len(ho) != len(hn):
        raise RuntimeError(f'C{cid} {field}: match count moved {len(ho)} -> {len(hn)}')
    if len(ho) > maxhits:
        raise RuntimeError(f'C{cid} {field}: {len(ho)} matches, expected at most {maxhits}')
    def mask(s, hits):
        out, last = [], 0
        for m in hits:
            out.append(s[last:m.start()]); out.append('\x00MASK\x00'); last = m.end()
        out.append(s[last:]); return ''.join(out)
    mo, mn = mask(old, ho), mask(new, hn)
    if mo != mn:
        raise RuntimeError(f'C{cid} {field}: change OUTSIDE the version span')
    return True

def run(cids, logpath):
    cases = {c['id']: c for c in json.load(open('/tmp/testrail/all-cases-now.json'))}
    groups = json.load(open('/tmp/testrail/three-reports-2026-08-10.json'))
    rep_of = {c['id']: g for g, v in groups.items() for c in v}
    log = []
    for cid in cids:
        st0, live = tr.get_case(cid)
        assert st0 == 200, f'C{cid} pre-GET {st0}'
        rep = rep_of[cid]
        new_exp, new_refs = plan_case(live, rep)
        old_exp, old_refs = live.get('custom_expected') or '', live.get('refs') or ''
        if new_exp == old_exp and new_refs == old_refs:
            log.append({'cid': cid, 'result': 'NO-OP already current'}); print(f'C{cid} no-op'); continue
        masked_ok(old_exp, new_exp, PROV_PAT[rep], cid, 'expected', 3)
        masked_ok(old_refs, new_refs, REFS_PAT[rep], cid, 'refs', 1)
        sanity(new_exp, cid)
        for entry in new_refs.split(','):
            assert len(entry) <= 248, f'C{cid}: refs entry {len(entry)} chars > 248'
        payload = {'custom_preconds': live.get('custom_preconds') or '',
                   'custom_steps': live.get('custom_steps') or '',
                   'custom_expected': new_exp, 'refs': new_refs}
        st, line, before, after = tr.update_case_verified(cid, payload, 'restamp')
        log.append({'cid': cid, 'report': rep, 'http': st, 'verify': line,
                    'exp_changed': new_exp != old_exp, 'refs_changed': new_refs != old_refs})
        print(f'C{cid} {line}')
    json.dump(log, open(logpath, 'w'), indent=1)
    return log
