#!/usr/bin/env python3
"""Turn reviewed production verdicts into a RESULTS file with annotated pictures (22 Oct 2026). For each chosen C-id in a verdicts JSON
(evidence/prod-2026-10-22/judge/verdicts-*.json), annotate its pictures with a banner naming the test and what the picture shows (2x
source, annotate_v2.py), and write RESULTS-prod-<tag>.json for push_results_to_run.py. Posts nothing itself.
Usage: python3 post_verdicts.py <verdicts.json> <tag> C1 C2 ..."""
import json, os, re, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(H, '..', '..', 'testing-tools', 'annotate_v2.py')
vf, tag, ids = sys.argv[1], sys.argv[2], sys.argv[3:]
V = json.load(open(vf)); out = {'pass_meta': {'env': 'production', 'build': 'v26.43.0-ffea43c', 'date': '22 October 2026', 'note': f'run 498 on production - {tag}'}, 'results': {}}
os.makedirs(os.path.join(H, 'pictures-prod'), exist_ok=True)
def pretty(f):
    s = re.sub(r'^C\d+-', '', os.path.basename(f)).replace('.png', ''); s = re.sub(r'\bs(\d+)', r'step \1', s); return s.replace('-', ' ').replace('_', ' ')
for c in ids:
    v = V[c]; pics = []
    for i, p in enumerate(v.get('pictures', [])[:4], 1):
        src = p if os.path.isabs(p) else os.path.join(H, p); dst = os.path.join(H, 'pictures-prod', f'{c}-{i}-prod-1022.png')
        r = subprocess.run(['python3', A, src, dst, '--scale', '2', '--title', f'{c} on production (v26.43.0-ffea43c) - {pretty(p)}'], capture_output=True, text=True, env={**os.environ, 'PYTHONPATH': '/tmp/pylib'})
        if r.returncode == 0: pics.append(os.path.relpath(dst, H))
        else: print('annotate failed', c, p, r.stderr[-200:])
    res = {'verdict': v['verdict'], 'observed': v['observed'], 'pictures': pics}
    for k in ('failed_steps', 'bold_steps', 'todo', 'ticket', 'ticket_held'):
        if k in v: res[k] = v[k]
    out['results'][c] = res; print(c, v['verdict'], len(pics), 'pictures')
json.dump(out, open(os.path.join(H, f'RESULTS-prod-{tag}.json'), 'w'), indent=1)
