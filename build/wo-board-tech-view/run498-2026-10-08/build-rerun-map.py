#!/usr/bin/env python3
"""Rebuild rerun-map.json / rerun-order.txt: every case in the run -> the NEWEST script (by git creation order) that
names it. Run after any new fix script is added, so run-all.sh always uses the final, proven version."""
import json, glob, re, subprocess, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
cases = [c['case_id'] for c in json.load(open('cases-read-2026-10-08.json'))]
born = {}
for f in glob.glob('*.mts'):
    if f in ('profile.mts', 'discover-profile.mts', 'session.mts', 'runner.mts', 'viewas.mts', 'data.mts', 'wob.mts', 'staff.mts'): continue
    r = subprocess.run(['git', 'log', '--diff-filter=A', '--format=%ct', '--', f], capture_output=True, text=True).stdout.split()
    born[f] = int(r[-1]) if r else 9_999_999_999
order = sorted(born, key=lambda f: born[f]); text = {f: open(f).read() for f in order}
MANUAL = {97026, 97033, 97034}                                    # Google Analytics REPORTS: read by hand
MANUAL_ORGB = {368175, 154650}                                    # need a second organisation: manual testing (QA lead, 9 Oct 2026)
PIN = {368164: 's5-batchA.mts', 96997: 's7-batch.mts', 96999: 's7-batch.mts', 97000: 's7-batch.mts'}
m = {}
for cid in cases:
    if cid in MANUAL: m.setdefault('(manual: Google Analytics reports)', []).append(cid); continue
    if cid in MANUAL_ORGB: m.setdefault('(manual: needs a second organisation)', []).append(cid); continue
    hits = [f for f in order if re.search(r"['\"`]C%d['\"`]" % cid, text[f])]
    m.setdefault(PIN.get(cid) or (hits[-1] if hits else '(none)'), []).append(cid)
json.dump({k: sorted(v) for k, v in m.items()}, open('rerun-map.json', 'w'), indent=1)
scripts = [k for k in m if not k.startswith('(') and k != 'signout-fix.mts'] + (['signout-fix.mts'] if 'signout-fix.mts' in m else [])
open('rerun-order.txt', 'w').write('\n'.join(scripts) + '\n')
print(len(scripts), 'scripts;', {k: v for k, v in m.items() if k.startswith('(')})
