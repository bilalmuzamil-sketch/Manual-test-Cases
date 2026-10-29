#!/usr/bin/env python3
"""Assemble the portal: portal/dist/index.html (page + the comparison engine, embedded so the
browser runs the SAME engine as the command-line tool) and portal/dist/data.json (everything the
page shows, read from the append-only store - nothing in it is typed by hand).

  python3 build_portal.py [--measure-production]

Re-run after every Track Changes scan or confirm, then republish the artifact.
"""
import datetime, json, os, re, subprocess, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..'))
TOOLS = os.path.join(ROOT, 'tools')
SNAP = os.path.join(ROOT, 'snapshots')
DIST = os.path.join(HERE, 'dist')
REPO = '/home/user/shopview'
sys.path.insert(0, TOOLS)
import snapshot_store  # noqa: E402


def main():
    reg, bad = snapshot_store.verify()
    if bad:
        raise SystemExit(f'REFUSED to build: snapshot integrity problems {bad}')
    snaps = {s['id']: json.load(open(os.path.join(SNAP, s['file']))) for s in reg['snapshots']}
    reports = {}
    for s in reg['snapshots']:
        if s.get('change_report'):
            reports[s['change_report']] = json.load(open(os.path.join(ROOT, s['change_report'])))
    pend_dir = os.path.join(SNAP, 'pending')
    pending = [json.load(open(os.path.join(pend_dir, f))) for f in sorted(os.listdir(pend_dir))] if os.path.isdir(pend_dir) else []

    impl = [s for s in reg['snapshots'] if s['kind'] == 'implementation']
    latest = impl[-1]
    pvi = json.loads(subprocess.run(['node', os.path.join(TOOLS, 'engine', 'cli.js'), '--prd-vs-impl',
                                     os.path.join(SNAP, 'prd-v7.json'), os.path.join(SNAP, 'prd-v54.json'),
                                     os.path.join(SNAP, latest['file'])] +
                                    ([os.path.join(ROOT, 'ledger.json')] if os.path.exists(os.path.join(ROOT, 'ledger.json')) else []),
                                    capture_output=True, text=True, check=True).stdout)

    hist_dir = os.path.join(ROOT, 'reports', 'history')
    history = json.load(open(os.path.join(hist_dir, 'index.json')))
    history_reports = {h['report']: json.load(open(os.path.join(hist_dir, h['report'])))
                       for h in history['releases'] if h.get('report')}

    # deployed release: measured now when asked, else the latest measurement recorded in a snapshot
    deployed = None
    if '--measure-production' in sys.argv:
        html = urllib.request.urlopen('https://app.shopview.com/', timeout=30).read().decode('utf-8', 'replace')
        m = re.search(r'app-version" content="([^"]+)"', html)
        if m:
            deployed = {'build_marker': m.group(1), 'commit': m.group(1).rsplit('-', 1)[-1],
                        'measured_at': datetime.date.today().isoformat()}
    if not deployed:
        for s in reversed(impl):
            d = (snaps[s['id']]['release'] or {}).get('deployed')
            if d:
                deployed = {'build_marker': d['build_marker'], 'commit': d['build_marker'].rsplit('-', 1)[-1],
                            'measured_at': d['measured_at']}
                break

    # release tags newer than the latest recorded snapshot: the "not scanned yet" list
    latest_commit = latest['release']['commit']
    tags = subprocess.run(['git', '-C', REPO, 'for-each-ref', '--sort=creatordate', '--format=%(refname:short)\t%(creatordate:short)',
                           'refs/tags'], capture_output=True, text=True).stdout.splitlines()
    rels = [dict(zip(('tag', 'date'), t.split('\t'))) for t in tags if re.fullmatch(r'v26\.\d+\.\d+(\.\d+)?', t.split('\t')[0])]
    base_tags = latest['release'].get('tags') or []
    idx = max((i for i, r in enumerate(rels) if r['tag'] in base_tags), default=None)
    known = rels[idx + 1:] if idx is not None else []

    data = {'built_at': datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat(),
            'deployed': deployed, 'registry': reg, 'snapshots': snaps, 'reports': reports, 'pending': pending,
            'prd_vs_impl': {'original': 'prd-v7', 'latest_prd': 'prd-v54', 'implementation': latest['id'], 'rows': pvi},
            'history': history, 'history_reports': history_reports, 'known_releases': known}
    os.makedirs(DIST, exist_ok=True)
    json.dump(data, open(os.path.join(DIST, 'data.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    tpl = open(os.path.join(HERE, 'src', 'index.template.html')).read()
    engine = open(os.path.join(TOOLS, 'engine', 'compare.js')).read()
    open(os.path.join(DIST, 'index.html'), 'w').write(tpl.replace('/*__ENGINE__*/', engine))
    size = os.path.getsize(os.path.join(DIST, 'data.json')) / 1e6
    print(f"dist/index.html + dist/data.json ({size:.2f} MB): {len(snaps)} snapshots, {len(pending)} pending scans, "
          f"{len(pvi)} PRD-vs-implementation rows, {len(history_reports)} historical release reports, "
          f"{len(known)} newer release tags, production {deployed and deployed['build_marker']}")


if __name__ == '__main__':
    main()
