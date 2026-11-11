#!/usr/bin/env python3
"""Builds results.json and RESULTS.md from run-qa.json (V2, QA branch) and run-prod.json (V1, production).
Final verdicts: PASS / FAIL / BLOCKED / CASE-WRONG / NOT RUN. A QA FAIL whose V1 side on production behaves as the case
says is LOST (a V2 regression); if V1 also does not behave as the case says, the case is CASE-WRONG.
For planned-change cases (V1R-73..93) a FAIL on a quoted PRD sentence is a PRD deviation, not a V1 loss."""
import json, csv, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.dirname(HERE)
cases = json.load(open(f'{OUT}/../cases/cases.json')); ids = {r['key']: r['cid'] for r in csv.DictReader(open(f'{OUT}/../testrail/id-map.csv'))}
qa = json.load(open(f'{HERE}/run-qa.json')) if os.path.exists(f'{HERE}/run-qa.json') else {}
pr = json.load(open(f'{HERE}/run-prod.json')) if os.path.exists(f'{HERE}/run-prod.json') else {}
extra = json.load(open(f'{HERE}/judgement.json')) if os.path.exists(f'{HERE}/judgement.json') else {}
res = []
for c in cases:
    k = c['id']; q = qa.get(k); p = pr.get(k); j = extra.get(k, {})
    planned = int(k[4:]) >= 73
    v = q['verdict'] if q else 'NOT RUN'
    cls = None
    if v == 'FAIL' and not planned:
        if p and p['verdict'] == 'PASS': cls = 'LOST (V2 regression, V1 confirmed on production)'
        elif p and p['verdict'] == 'FAIL': v = 'CASE-WRONG'; cls = 'V1 on production also does not do it'
        else: cls = 'V1 side not yet confirmed'
    if v == 'FAIL' and planned: cls = j.get('class', 'PRD deviation (V2 does not do what the quoted PRD sentence says)')
    v = j.get('verdict', v)
    res.append({'key': k, 'cid': 'C' + ids[k], 'link': f'https://shopview.testrail.io/index.php?/cases/view/{ids[k]}', 'title': c['title'],
                'group': 'planned change (PRD v11)' if planned else 'V1 regression', 'marker': c.get('marker'), 'verdict': v, 'classification': cls,
                'plain': j.get('plain') or (q or {}).get('note'), 'observed_qa': (q or {}).get('observed'), 'expect_fail_outcome': (q or {}).get('expect_fail_outcome'),
                'evidence_qa': (q or {}).get('evidence', []), 'qa_marker': (q or {}).get('marker'), 'qa_utc': (q or {}).get('utc_end'),
                'v1_prod': ({'verdict': p['verdict'], 'observed': p['observed'], 'evidence': p.get('evidence', []), 'marker': p['marker'], 'utc': p['utc_end']} if p else None)})
json.dump({'run': '2026-11-11', 'qa_marker': 'v26.45.2-6a8b89c', 'prod_marker_measured': sorted({r['v1_prod']['marker'] for r in res if r['v1_prod']}), 'cases': res}, open(f'{OUT}/results.json', 'w'), indent=1)
from collections import Counter
cnt = Counter(r['verdict'] for r in res)
def line(r):
    obs = r['plain'] or r['observed_qa'] or ''
    obs = re.sub(r'\s+', ' ', obs)
    ev = '; '.join(r['evidence_qa'][:3]) + (f" (+{len(r['evidence_qa']) - 3} more)" if len(r['evidence_qa']) > 3 else '')
    return f"| {r['key']} | [{r['cid']}]({r['link']}) | **{r['verdict']}**{(' - ' + r['classification']) if r['classification'] else ''} | {obs[:600].replace('|', '/')} | {ev.replace('|', '/')} | {r['qa_marker'] or '-'} {(r['qa_utc'] or '')[:16]}Z |"
lost = [r for r in res if r['classification'] and r['classification'].startswith('LOST')]
md = [f"# A/R and A/P aging: live run on the upgraded build (QA sv11315), 11 Nov 2026\n",
      "QA branch `https://sv11315.qa.shopview.com`, marker **v26.45.2-6a8b89c** (re-read before every batch, unchanged all day). "
      "Production (V1, used only to confirm a QA failure): `app.shopview.com`, marker measured **" + ', '.join(sorted({r['v1_prod']['marker'] for r in res if r['v1_prod']}) or ['-']) + "** "
      "(the V1 baseline was read at fc08f23; production has since been redeployed - noted, not explained away).\n",
      "Every verdict was observed on the screen in a signed-in Chromium (menu, date chip calendar, Customer/Vendor chips, arrows, Export menu), with screenshots in `evidence/`. "
      "Records were identified by their own numbers (identity), dated documents were back-dated through the app's own fields, and every number on screen was checked against the record that made it (attribution). "
      "Where the steps say \"find customer X\" in a long list, X was found by ticking it in the Customer/Vendor chip; that is said on the case.\n",
      "## Summary\n", "| Verdict | Count |", "|---|---|"] + [f"| {k} | {cnt.get(k, 0)} |" for k in ['PASS', 'FAIL', 'BLOCKED', 'CASE-WRONG', 'NOT RUN']] + [f"| **Total** | **{len(res)}** |\n"]
md += ["## Confirmed LOST (V1 can, V2 cannot) - both sides observed\n"]
for r in lost:
    md.append(f"- **{r['key']} [{r['cid']}]({r['link']}) {r['title']}**  \n  V2 (QA): {r['observed_qa'][:400]}  \n  V1 (production): {r['v1_prod']['observed'][:400]}  \n  Evidence: {', '.join(r['evidence_qa'][:4])}; {', '.join(r['v1_prod']['evidence'][:4])}")
if not lost: md.append('- none')
md += ["\n## Every FAIL, BLOCKED and CASE-WRONG in one line\n"]
for r in res:
    if r['verdict'] in ('FAIL', 'BLOCKED', 'CASE-WRONG'):
        md.append(f"- {r['key']} [{r['cid']}]({r['link']}) **{r['verdict']}**{(' (' + r['classification'] + ')') if r['classification'] else ''}: {re.sub(r'\s+', ' ', (r['plain'] or r['observed_qa'] or ''))[:400]}")
md += ["\n## Per case\n", "| Key | TestRail | Verdict | Observed (plain) | Evidence | QA marker + UTC |", "|---|---|---|---|---|---|"] + [line(r) for r in res]
open(f'{OUT}/RESULTS.md', 'w').write('\n'.join(md) + '\n')
print(dict(cnt), 'lost:', [r['key'] for r in lost])
