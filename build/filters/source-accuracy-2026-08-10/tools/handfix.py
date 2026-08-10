"""Hand repairs to source citations, Filters + Schedule, 2026-08-10.
Each repair is an EXACT string substitution asserted present (and unique) before it
is applied. The build-stamp sentence is never touched: nothing was observed on either
QA branch this pass. Markup is asserted unchanged - this pass neither adds nor removes
any of the raw <ol>/<li> that 37 cases already carried."""
import json, re, sys, html
sys.path.insert(0, '/tmp/testrail'); import tr
from restamp import shape, unmarkup

def apply(cid, exp_subs=(), title_new=None, refs_new=None, note='', log=None):
    st0, live = tr.get_case(cid)
    assert st0 == 200, f'C{cid} pre-GET {st0}'
    old_exp = live.get('custom_expected') or ''
    exp = old_exp
    bld_o = re.findall(r'Last checked against build [^\n<]*', unmarkup(old_exp))
    for old, new in exp_subs:
        n = exp.count(old)
        assert n >= 1, f'C{cid}: anchor text NOT FOUND -> {old[:90]!r}'
        exp = exp.replace(old, new)
    shape(exp, old_exp, cid)
    assert re.findall(r'Last checked against build [^\n<]*', unmarkup(exp)) == bld_o, \
        f'C{cid}: build sentence changed - refused'
    payload = {'custom_preconds': live.get('custom_preconds') or '',
               'custom_steps': live.get('custom_steps') or '',
               'custom_expected': exp}
    if title_new is not None:
        assert len(title_new) <= 80, f'C{cid}: title {len(title_new)} chars > 80'
        payload['title'] = title_new
    if refs_new is not None:
        for e in refs_new.split(','):
            assert len(e) <= 248, f'C{cid}: refs entry {len(e)} chars > 248'
        payload['refs'] = refs_new
    st, line, before, after = tr.update_case_verified(cid, payload, 'handfix')
    rec = {'cid': cid, 'op': 'update_case', 'http': st, 'verify': line, 'note': note}
    print(f'C{cid} {line}  [{note}]')
    if log is not None: log.append(rec)
    return rec
