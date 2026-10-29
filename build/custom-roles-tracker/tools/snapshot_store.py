#!/usr/bin/env python3
"""The tracker's permanent, append-only snapshot store.

  snapshots/<id>.json      one file per snapshot, written ONCE, then made read-only
  snapshots/registry.json  the ordered list of snapshots, each with the SHA-256 of its file

The rules this file enforces (requirement 9 - "historical versions preserved permanently",
"protection against accidental deletion or overwriting"):

  * a snapshot id is never reused, and a file is never overwritten;
  * an implementation snapshot is never recorded twice for the same COMMIT (scanning the same
    release again cannot create a duplicate tab);
  * registry entries are only ever appended - never edited or removed by this tool;
  * `verify` recomputes every hash and reports any file that changed or vanished since it was
    recorded. Git is the second safety net: every snapshot is committed, so even a forced edit
    leaves history.

  python3 snapshot_store.py verify
  python3 snapshot_store.py list
"""
import datetime, hashlib, json, os, stat, sys

HERE = os.path.dirname(os.path.abspath(__file__))
# CRP_ROOT points the whole tracker at another store (the validation suite uses a throw-away one).
SNAP_DIR = os.path.join(os.environ.get('CRP_ROOT') or os.path.normpath(os.path.join(HERE, '..')), 'snapshots')
REGISTRY = os.path.join(SNAP_DIR, 'registry.json')


def _now():
    return datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat()


def load_registry():
    if not os.path.exists(REGISTRY):
        return {'_README': 'Append-only. Every entry pins a snapshot file by SHA-256. Never edit by hand; '
                           'use tools/snapshot_store.py / tools/track_changes.py.', 'snapshots': []}
    return json.load(open(REGISTRY))


def save_registry(reg):
    tmp = REGISTRY + '.tmp'
    json.dump(reg, open(tmp, 'w'), indent=1, ensure_ascii=False)
    os.replace(tmp, REGISTRY)


def sha256(path):
    return hashlib.sha256(open(path, 'rb').read()).hexdigest()


def find(reg, sid):
    return next((s for s in reg['snapshots'] if s['id'] == sid), None)


def find_by_commit(reg, commit):
    return next((s for s in reg['snapshots'] if s.get('kind') == 'implementation'
                 and (s.get('release') or {}).get('commit') == commit), None)


def latest(reg, kind='implementation'):
    xs = [s for s in reg['snapshots'] if s.get('kind') == kind]
    return xs[-1] if xs else None


def record(snapshot, sid, label, recorded_by, previous=None, change_report=None, notes=None,
           checkpoint=False, approvals=None):
    """Write `snapshot` as snapshots/<sid>.json and append it to the registry. Refuses duplicates."""
    reg = load_registry()
    if find(reg, sid):
        raise SystemExit(f'REFUSED: snapshot id {sid!r} already recorded - snapshots are never overwritten')
    commit = (snapshot.get('release') or {}).get('commit')
    if snapshot.get('kind') == 'implementation' and commit:
        dup = find_by_commit(reg, commit)
        if dup:
            raise SystemExit(f'REFUSED: commit {commit[:7]} is already recorded as {dup["id"]!r} '
                             f'({dup["label"]}) - the same release is never snapshotted twice')
    path = os.path.join(SNAP_DIR, f'{sid}.json')
    if os.path.exists(path):
        raise SystemExit(f'REFUSED: {path} exists on disk but not in the registry - investigate, never overwrite')
    snapshot = dict(snapshot, snapshot_id=sid)
    with open(path, 'w') as f:
        json.dump(snapshot, f, indent=1, ensure_ascii=False)
    os.chmod(path, stat.S_IRUSR | stat.S_IRGRP | stat.S_IROTH)
    entry = {'id': sid, 'kind': snapshot.get('kind'), 'label': label, 'file': f'{sid}.json',
             'sha256': sha256(path), 'recorded_at': _now(), 'recorded_by': recorded_by,
             'previous': previous, 'checkpoint_only': checkpoint, 'change_report': change_report,
             'notes': notes, 'approvals': approvals or []}
    if snapshot.get('kind') == 'implementation':
        r = snapshot['release']
        entry['release'] = {'ref': r.get('ref'), 'tags': r.get('tags'), 'commit': r.get('commit'),
                            'commit_date': r.get('commit_date'), 'build_marker': r.get('build_marker')}
    if snapshot.get('kind') == 'prd':
        entry['source'] = {k: snapshot['source'].get(k) for k in ('page_id', 'version', 'created_at', 'published_at')
                           if snapshot['source'].get(k) is not None}
    reg['snapshots'].append(entry)
    save_registry(reg)
    return entry


def verify():
    reg, bad = load_registry(), []
    for s in reg['snapshots']:
        p = os.path.join(SNAP_DIR, s['file'])
        if not os.path.exists(p):
            bad.append((s['id'], 'FILE MISSING'))
        elif sha256(p) != s['sha256']:
            bad.append((s['id'], 'CONTENT CHANGED since it was recorded'))
    return reg, bad


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'list'
    if cmd == 'verify':
        reg, bad = verify()
        for sid, why in bad:
            print(f'🔴 {sid}: {why}')
        print(f"{len(reg['snapshots'])} snapshots, {len(bad)} integrity problems")
        sys.exit(1 if bad else 0)
    for s in load_registry()['snapshots']:
        print(f"{s['id']:28} {s['kind']:14} {s['recorded_at']}  {s['label']}")
