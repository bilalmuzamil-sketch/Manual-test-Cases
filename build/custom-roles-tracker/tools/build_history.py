#!/usr/bin/env python3
"""Reconstruct the release-by-release history BEFORE the baseline, from the product repo's tags.
Every v26.* release tag is extracted at its commit and compared with the previous tag by the same
engine Track Changes uses. Output: ../reports/history/index.json (+ one report per changed release).
This is repository evidence for "when did this change ship" - it is NOT a set of confirmed snapshots."""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import extract_impl
REPO = '/home/user/shopview'; OUT = os.path.join(HERE, '..', 'reports', 'history')
TMP = sys.argv[1] if len(sys.argv) > 1 else '/tmp'
tags = [t for t in subprocess.run(['git', '-C', REPO, 'tag', '--sort=creatordate'], capture_output=True, text=True).stdout.split()
        if re.fullmatch(r'v26\.\d+\.\d+(\.\d+)?', t)]
tags = tags[:tags.index('v26.43.3') + 1]
index, prev = [], None
for t in tags:
    path = os.path.join(TMP, f'hist-{t}.json')
    if not os.path.exists(path):
        json.dump(dict(extract_impl.extract(REPO, t), snapshot_id='impl-' + t), open(path, 'w'))
    if prev:
        r = subprocess.run(['node', os.path.join(HERE, 'engine', 'cli.js'), prev[1], path], capture_output=True, text=True, check=True)
        rep = json.loads(r.stdout)
        cdate = json.load(open(path))['release']['commit_date'][:10]
        entry = {'from': prev[0], 'to': t, 'date': cdate, 'changes': len(rep['changes']), 'counts': rep['counts'],
                 'headline': [c['title'] for c in rep['changes'] if c['risk'] == 'High'][:6]}
        if rep['changes']:
            # the commits between the two tags that touched permission code: PR / Jira leads
            log = subprocess.run(['git', '-C', REPO, 'log', '--format=%h\t%ad\t%s', '--date=short', f'{prev[0]}..{t}', '--',
                                  'api/src/Auth', 'api/src/IAM/AccessControl', 'app/src/services/permissions',
                                  'app/src/components/ts/administration/permissions'], capture_output=True, text=True).stdout
            rep['commits'] = [dict(zip(('commit', 'date', 'subject'), l.split('\t', 2))) for l in log.splitlines()][:60]
            rep['tickets'] = sorted(set(re.findall(r'\bSV-\d+', log)))
            rep['pull_requests'] = sorted(set(re.findall(r'#(\d{3,5})', log)), key=int)
            entry.update(tickets=rep['tickets'], pull_requests=rep['pull_requests'], report=f'{prev[0]}__to__{t}.json')
            json.dump(rep, open(os.path.join(OUT, entry['report']), 'w'), indent=1, ensure_ascii=False)
        index.append(entry)
    prev = (t, path)
json.dump({'note': 'Reconstructed from release tags by tools/build_history.py. Repository evidence, not confirmed snapshots, not verified behaviour.',
           'releases': index}, open(os.path.join(OUT, 'index.json'), 'w'), indent=1)
changed = [e for e in index if e['changes']]
print(f'{len(tags)} tags, {len(index)} release steps, {len(changed)} with permission-related changes')
for e in changed:
    print(f"  {e['to']:12} {e['date']} {e['changes']:3} changes {e['counts']}  {', '.join(e['tickets'][:6])}")
