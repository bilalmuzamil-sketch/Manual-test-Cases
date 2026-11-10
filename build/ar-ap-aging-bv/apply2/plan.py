# Pass 2 plan: which tests get a Setup list (+ a "Partly checked" line where something was not seen), from the live snapshot.
import json, os, sys, re, html
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import setup as S, manual as MM
LIVE = json.load(open(f'{D}/live.json'))
HARD = json.load(open(f'{D}/../hard-classes.json'))   # the 142 record-needing tests the QA lead approved full Setup lists for
STAMP = '<p>Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.</p>'
PRE = 'Partly checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026; not yet seen on that build: '
SKIP_SECTIONS = {133628}   # "Run on Production After Release": nothing is made on the QA site for those
def new_fields(c):
    items, unseen, un = S.setup_for(c, MM.MANUAL)
    assert not un, (c['id'], un)
    if not items or c['section_id'] in SKIP_SECTIONS: return None
    p, e = c['custom_preconds'], c['custom_expected']
    assert 'Setup</strong>' not in p and p.rstrip().endswith('</ul>'), c['id']
    p2 = p + S.to_html(items)
    e2 = e
    if unseen:
        assert e.count(STAMP) == 1, c['id']
        e2 = e.replace(STAMP, f'<p>{PRE}{html.escape("; ".join(unseen), quote=False)}.</p>')
    return {'custom_preconds': p2, **({'custom_expected': e2} if e2 != e else {})}
PLAN = {k: f for k, c in LIVE.items() if k in HARD and (f := new_fields(c))}
if __name__ == '__main__':
    print('tests getting Setup', len(PLAN), '| with partly line', sum('custom_expected' in v for v in PLAN.values()))
    print('by folder', {s: sum(1 for k in PLAN if LIVE[k]['section_id'] == s) for s in sorted({LIVE[k]['section_id'] for k in PLAN})})
    json.dump(PLAN, open(f'{D}/plan.json', 'w'), indent=1)
