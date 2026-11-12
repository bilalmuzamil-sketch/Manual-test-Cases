#!/usr/bin/env python3
"""Merge the tech-user runs (../shots/<KEY> staging-tech.json, from run.js here) into
../../live-run-2026-11-11/tools/run-staging.json, so results_for_testrail.py builds one RESULTS file.
Verdict = PASS only when the run had no harness error, the screen was used by tech@shopview.com, and every check is OK;
a harness error is ERROR (not a product verdict, Rule 12); otherwise FAIL. Evidence = the run's own screenshots.
    python3 merge_tech.py V1R-32 V1R-53 V1R-87"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); SHOTS = os.path.join(os.path.dirname(HERE), 'shots')
RUN = os.path.join(HERE, '..', '..', 'live-run-2026-11-11', 'tools', 'run-staging.json')
res = json.load(open(RUN))
for key in sys.argv[1:]:
    R = json.load(open(os.path.join(SHOTS, f'{key} staging-tech.json')))
    checks = R.get('checks') or []
    if R.get('error') or not checks: v = 'ERROR'
    elif R.get('user') != 'tech@shopview.com': v = 'ERROR'
    else: v = 'PASS' if all(c['ok'] for c in checks) else 'FAIL'
    ev = [os.path.join(SHOTS, s['f'] if isinstance(s, dict) else s) for s in R.get('shots') or []]
    res[key] = {'verdict': v, 'checks': checks, 'observed': ' | '.join(f"{'OK' if c['ok'] else 'NOT OK'} {c['what']}: {c['saw']}" for c in checks) or ('harness error: ' + str(R.get('error'))[:200]),
                'evidence': [e for e in ev if os.path.isfile(e)], 'marker': R.get('marker'), 'env': 'staging', 'user': R.get('user'),
                'utc_start': R.get('startUtc'), 'utc_end': R.get('endUtc'), 'note': f"run as {R.get('user')} in its own session (tech-tools/run.js)"}
    print(key, v, R.get('user'), R.get('marker'), len(res[key]['evidence']), 'pictures')
json.dump(res, open(RUN, 'w'), indent=1)
