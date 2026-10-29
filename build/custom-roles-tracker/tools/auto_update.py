#!/usr/bin/env python3
"""ONE COMMAND that brings the tracker up to date after a release. The scheduled update runs it
every hour, and so does the portal's Update button.

  python3 auto_update.py [--repo /home/user/shopview] [--approved ID[,ID]] [--approved-by NAME]
                         [--requested TAG[,TAG]]
  python3 auto_update.py --mark-published     # only AFTER the page was republished successfully

What it does, in order:
  1. reads which release is live on production (the app-version marker);
  2. saves permanently any checked release that someone approved in the portal (--approved);
  3. checks the live release if it is neither saved nor already waiting for approval, and any
     newer release someone asked for (--requested). A checked release is shown at once, with its
     retest checklist, as "checked, waiting for approval". Nothing is saved without approval;
  4. rebuilds the portal (portal/dist/);
  5. prints a JSON summary on the last line. `publish_needed` says whether the page's content
     changed and must be republished. `status` is the freshness record the portal shows to
     everyone (the scheduled update writes it into the portal's `status` collection).

Never guesses: a live release whose commit cannot be found stops with a reason in the summary
(`problem`), and the portal says so instead of claiming to be up to date.
"""
import argparse, datetime, glob, hashlib, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('CRP_ROOT') or os.path.normpath(os.path.join(HERE, '..'))
sys.path.insert(0, HERE)
import snapshot_store, track_changes  # noqa: E402

STATE = os.path.join(ROOT, 'portal', 'published-state.json')


def sh(*cmd, cwd=HERE):
    r = subprocess.run(list(cmd), capture_output=True, text=True, cwd=cwd)
    return r.returncode, (r.stdout + r.stderr).strip()


def pending():
    out = {}
    for f in glob.glob(os.path.join(ROOT, 'snapshots', 'pending', '*.json')):
        p = json.load(open(f))
        out[p['snapshot_id']] = p
    return out


def signature():
    """What the published page shows. A change here means the page must be republished."""
    reg = snapshot_store.load_registry()
    parts = [s['id'] + ':' + s['sha256'] for s in reg['snapshots']]
    parts += sorted(f"pending:{k}:{v['release']['commit']}" for k, v in pending().items())
    data = json.load(open(os.path.join(ROOT, 'portal', 'dist', 'data.json')))
    parts += ['live:' + str((data.get('deployed') or {}).get('build_marker')),
              'known:' + ','.join(t['tag'] for t in data.get('known_releases') or [])]
    return hashlib.sha256('\n'.join(parts).encode()).hexdigest(), data


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', default=track_changes.DEFAULT_REPO)
    ap.add_argument('--approved', default='')
    ap.add_argument('--approved-by', default='Approved in the portal')
    ap.add_argument('--requested', default='')
    ap.add_argument('--mark-published', action='store_true')
    a = ap.parse_args()
    if a.mark_published:
        sig, data = signature()
        json.dump({'signature': sig, 'page_built_at': data['built_at'], 'live_marker': (data.get('deployed') or {}).get('build_marker')},
                  open(STATE, 'w'), indent=1)
        print(json.dumps({'marked_published': data['built_at']}))
        return
    now = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat()
    did = {'confirmed': [], 'scanned': [], 'skipped': [], 'problem': None}

    # make sure the product repository has the newest tags and production's commit
    if sh('git', '-C', a.repo, 'rev-parse', '--is-shallow-repository')[1] == 'true':
        sh('git', '-C', a.repo, 'fetch', '-q', '--tags', '--shallow-since=2026-05-01', 'origin', 'main', 'develop')
    else:
        sh('git', '-C', a.repo, 'fetch', '-q', '--tags', 'origin', 'main', 'develop')

    marker = track_changes.measure_production()
    live_commit = marker.rsplit('-', 1)[-1]

    # 2. approved checks become permanent
    pend = pending()
    for sid in [x for x in a.approved.split(',') if x]:
        if sid not in pend:
            if sid not in [s['id'] for s in snapshot_store.load_registry()['snapshots']]:
                did['skipped'].append(f'{sid}: not waiting for approval')
            continue  # already saved: an old approval, nothing to do
        reports = glob.glob(os.path.join(ROOT, 'reports', f'*__to__{sid}.json'))
        no_change = bool(reports) and not json.load(open(reports[0]))['changes']
        rc, out = sh(sys.executable, 'track_changes.py', 'confirm', sid, '--by', a.approved_by, *(['--checkpoint'] if no_change else []))
        (did['confirmed'] if rc == 0 else did['skipped']).append(sid if rc == 0 else f'{sid}: {out[-200:]}')

    # 3. check the live release, and any newer release someone asked for
    reg = snapshot_store.load_registry()
    recorded = lambda c: any(s.get('release', {}).get('commit', '').startswith(c) for s in reg['snapshots'])  # noqa: E731
    waiting = lambda c: any(p['release']['commit'].startswith(c) for p in pending().values())  # noqa: E731
    if not recorded(live_commit) and not waiting(live_commit):
        rc, out = sh(sys.executable, 'track_changes.py', 'scan', '--production', '--repo', a.repo)
        if rc == 0:
            did['scanned'].append(marker)
        else:
            did['problem'] = f'Could not check the live release {marker}: {out.splitlines()[-1] if out else rc}'
    latest = snapshot_store.latest(reg, 'implementation')
    latest_date = latest['release']['commit_date'] if latest else ''
    for tag in [x for x in a.requested.split(',') if x and x != 'production']:
        rc, commit = sh('git', '-C', a.repo, 'rev-parse', f'{tag}^{{commit}}')
        if rc != 0:
            did['skipped'].append(f'{tag}: no such release')
            continue
        date = sh('git', '-C', a.repo, 'show', '-s', '--format=%cI', commit)[1]
        if recorded(commit) or waiting(commit):
            did['skipped'].append(f'{tag}: already checked')
        elif date <= latest_date:
            did['skipped'].append(f'{tag}: older than the last saved release (see Release history)')
        else:
            rc, out = sh(sys.executable, 'track_changes.py', 'scan', '--ref', tag, '--repo', a.repo)
            (did['scanned'] if rc == 0 else did['skipped']).append(tag if rc == 0 else f'{tag}: {out[-200:]}')

    # 4. rebuild the portal
    rc, out = sh(sys.executable, os.path.join(HERE, '..', 'portal', 'build_portal.py'), '--measure-production')
    if rc != 0:
        raise SystemExit(f'portal build failed: {out[-400:]}')
    sig, data = signature()
    before = json.load(open(STATE)) if os.path.exists(STATE) else {}
    publish_needed = sig != before.get('signature')

    reg = snapshot_store.load_registry()
    live_recorded = recorded(live_commit)
    live_waiting = waiting(live_commit)
    status = {
        'checked_at': now,
        'live_marker': marker,
        'live_release': marker.rsplit('-', 1)[0],
        'live_state': 'saved' if live_recorded else 'waiting' if live_waiting else 'not_checked',
        # the page_built_at of the version people can open: the new one only once it is published
        'page_built_at': data['built_at'] if publish_needed else before.get('page_built_at'),
        'problem': did['problem'],
    }
    print(json.dumps(dict(did, publish_needed=publish_needed, previous_page_built_at=before.get('page_built_at'), status=status)))


if __name__ == '__main__':
    main()
