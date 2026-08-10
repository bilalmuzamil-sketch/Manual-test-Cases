"""Re-stamp the SPEC VERSION only (provenance line + refs) for Filters and Schedule.

Deliberately does NOT touch the build-stamp sentence: nothing was observed on either
QA branch this pass, so a fresh build date would be a claim we cannot support (Rule 12).
Proof of safety: every span the substitution matches is masked out of BOTH the before
and after text, and the masked remainders must be byte-identical - so nothing outside
the version token can move, and the checker fails closed.
Sends all three text fields explicitly (TestRail re-renders any omitted text field).
"""
import json, re, sys, html
sys.path.insert(0, '/tmp/testrail'); import tr

CFG = {
 'Filters': {
   'exp_subs': [
     (r'Filters specification at Confluence version 18 \(published 4 August 2026\)',
      'Filters specification at Confluence version 19 (published 6 August 2026)'),
     (r'Filters specification at Confluence version 18(?! \(published)',
      'Filters specification at Confluence version 19'),
   ],
   'refs_subs': [
     (r'\bspec v18 2026-08-04\b', 'spec v19 2026-08-06'),
     (r'\bspec v18\b', 'spec v19'),
   ],
   'exp_mask': [r'Filters specification at Confluence version \d+(?: \(published \d+ August 2026\))?'],
   'refs_mask': [r'\bspec v\d+(?: \d{4}-\d{2}-\d{2})?'],
 },
 'Schedule': {
   'exp_subs': [ (r'Schedule specification version 23', 'Schedule specification version 27') ],
   'refs_subs': [ (r'\bspec v23 2026-07-30\b', 'spec v27 2026-08-07') ],
   'exp_mask': [r'Schedule specification version \d+'],
   'refs_mask': [r'\bspec v\d+(?: \d{4}-\d{2}-\d{2})?'],
 },
}
MARKER_RE = re.compile(r'^AUTOMATION: (?:READY - EXPECT FAIL \([^)]*\)|READY|HOLD.*)$', re.M)
LISTMK = re.compile(r'<(?:ol|ul|li|p|br)\b', re.I)

def unmarkup(s):
    s = re.sub(r'<br\s*/?>', '\n', s or '', flags=re.I)
    s = re.sub(r'</(p|li|div)>', '\n', s, flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(s).replace('\xa0', ' ')

def shape(new_exp, old_exp, cid):
    """Shape checks run on the PAYLOAD before it is sent.
    Markup is asserted UNCHANGED rather than absent: 37 cases carried raw <ol>/<li>
    before this pass and this pass neither adds nor removes any."""
    t = unmarkup(new_exp)
    provs = [l for l in t.splitlines() if l.strip().startswith('This is the expected behaviour')]
    marks = MARKER_RE.findall(t)
    assert len(provs) <= 1, f'C{cid}: {len(provs)} provenance lines'
    assert len(marks) <= 1, f'C{cid}: {len(marks)} markers'
    if marks:
        assert t.rstrip().splitlines()[-1].strip().startswith('AUTOMATION:'), f'C{cid}: marker not last'
    assert len(LISTMK.findall(new_exp)) == len(LISTMK.findall(old_exp)), f'C{cid}: markup count moved'

def masked_ok(old, new, patterns, cid, field):
    """Mask every match in BOTH strings; the masked remainders must be byte-identical.
    The mask patterns match BOTH the old and the new form of the version token, so the
    only thing that may legitimately differ is inside a masked span."""
    def mask(s):
        for i, p in enumerate(patterns):
            s = re.sub(p, f'\x00M{i}\x00', s)
        return s
    mo, mn = mask(old), mask(new)
    if mo != mn:
        raise RuntimeError(f'C{cid} {field}: change OUTSIDE the version span')
    return True

def plan(c, proj):
    cfg = CFG[proj]
    exp = c.get('custom_expected') or ''; refs = c.get('refs') or ''
    ne = exp
    for p, r in cfg['exp_subs']: ne = re.sub(p, r, ne)
    nr = refs
    for p, r in cfg['refs_subs']: nr = re.sub(p, r, nr)
    return ne, nr

def run(cids, proj, logpath, dry=True):
    log = []
    for cid in cids:
        st0, live = tr.get_case(cid)
        assert st0 == 200, f'C{cid} pre-GET {st0}'
        old_exp = live.get('custom_expected') or ''; old_refs = live.get('refs') or ''
        ne, nr = plan(live, proj)
        if ne == old_exp and nr == old_refs:
            log.append({'cid': cid, 'op': 'update_case', 'http': None,
                        'verify': 'NO-OP already cites the live version'}); continue
        masked_ok(old_exp, ne, CFG[proj]['exp_mask'], cid, 'custom_expected')
        masked_ok(old_refs, nr, CFG[proj]['refs_mask'], cid, 'refs')
        shape(ne, old_exp, cid)
        bld_o = re.findall(r'Last checked against build [^\n<]*', unmarkup(old_exp))
        bld_n = re.findall(r'Last checked against build [^\n<]*', unmarkup(ne))
        assert bld_o == bld_n, f'C{cid}: build sentence moved - refused'
        for e in nr.split(','):
            assert len(e) <= 248, f'C{cid}: refs entry {len(e)} chars > 248'
        if dry:
            log.append({'cid': cid, 'op': 'DRY', 'exp_changed': ne != old_exp,
                        'refs_changed': nr != old_refs}); continue
        payload = {'custom_preconds': live.get('custom_preconds') or '',
                   'custom_steps': live.get('custom_steps') or '',
                   'custom_expected': ne, 'refs': nr}
        st, line, before, after = tr.update_case_verified(cid, payload, 'restamp')
        log.append({'cid': cid, 'op': 'update_case', 'http': st, 'verify': line,
                    'exp_changed': ne != old_exp, 'refs_changed': nr != old_refs})
        print(f'C{cid} {line}')
    json.dump(log, open(logpath, 'w'), indent=1)
    return log
