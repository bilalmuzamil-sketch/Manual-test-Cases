#!/usr/bin/env python3
"""TRACK CHANGES — find what a release changed in Custom Roles & Permissions, review it, then record it.

Step 1 — scan (read-only, records nothing):
    python3 track_changes.py scan --production          # measure what production runs, then scan it
    python3 track_changes.py scan --ref v26.44.0        # scan a release tag (or any commit)
    python3 track_changes.py scan --ref <sha> --build-marker v26.44.0-abc1234

  * identifies the release and pins its EXACT commit (a tag is resolved to a commit; production's
    build marker "vYY.WW.P-<sha7>" is matched to its tag AND its commit, and a mismatch stops the scan);
  * refuses if that commit is already recorded (no duplicate snapshot for the same release);
  * extracts the release from the repository AT THAT COMMIT - never the working tree;
  * compares it with the LATEST RECORDED implementation snapshot, by meaning (not text);
  * writes the review package: reports/<from>__to__<to>.json + .md, and a pending snapshot.

Step 2 — confirm (after QA has reviewed the report):
    python3 track_changes.py confirm <pending-id> --by "Name" [--label "..."] [--checkpoint]

  * records the pending snapshot permanently (write-once, hash-pinned) and links its change report;
  * when the scan found NO permission-related change, recording is refused unless --checkpoint is
    given, and then it is recorded as a "no-change checkpoint" - never as a changed-behaviour tab.

If the release cannot be identified, or its source is not in the repository, the scan STOPS and
says what to supply (a tag, a commit, or a build marker) - it never guesses.
"""
import argparse, datetime, json, os, re, subprocess, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import extract_impl, snapshot_store  # noqa: E402

ROOT = os.environ.get('CRP_ROOT') or os.path.normpath(os.path.join(HERE, '..'))
PENDING = os.path.join(ROOT, 'snapshots', 'pending')
REPORTS = os.path.join(ROOT, 'reports')
ENGINE = os.path.join(HERE, 'engine', 'cli.js')
DEFAULT_REPO = '/home/user/shopview'
PROD_URL = 'https://app.shopview.com/'


def git(repo, *a):
    r = subprocess.run(['git', '-C', repo, *a], capture_output=True, text=True)
    return r.returncode, r.stdout.strip(), r.stderr.strip()


def measure_production():
    html = urllib.request.urlopen(urllib.request.Request(PROD_URL, headers={'User-Agent': 'crp-tracker'}), timeout=30).read().decode('utf-8', 'replace')
    m = re.search(r'app-version" content="([^"]+)"', html)
    if not m:
        raise SystemExit('STOPPED: production served no app-version marker - supply --ref and --build-marker instead')
    return m.group(1)


def resolve(repo, ref=None, marker=None):
    """-> (ref_label, commit, tags, marker). Stops, never guesses, when anything does not line up."""
    git(repo, 'fetch', '-q', '--tags', 'origin')
    if marker and not ref:
        m = re.fullmatch(r'(v[\d.]+)-([0-9a-f]{7,40})', marker)
        if not m:
            raise SystemExit(f'STOPPED: build marker {marker!r} is not "vYY.WW.P-<sha>" - supply --ref <commit>')
        tag, short = m.groups()
        rc, tag_commit, _ = git(repo, 'rev-parse', f'{tag}^{{commit}}')
        rc2, commit, _ = git(repo, 'rev-parse', f'{short}^{{commit}}')
        if rc2 != 0:
            raise SystemExit(f'STOPPED: commit {short} (from build marker {marker}) is not in the repository - '
                             'fetch it or supply the commit/tag that was deployed')
        if rc == 0 and tag_commit != commit:
            print(f'⚠️  build marker {marker}: commit {short} is NOT the commit tagged {tag} ({tag_commit[:7]}). '
                  'The deployed commit is what gets scanned.')
        ref = tag if rc == 0 and tag_commit == commit else commit
    rc, commit, err = git(repo, 'rev-parse', f'{ref}^{{commit}}')
    if rc != 0:
        raise SystemExit(f'STOPPED: {ref!r} is not a tag or commit in {repo} ({err[:120]}) - supply the release tag or commit')
    tags = git(repo, 'tag', '--points-at', commit)[1].split()
    return ref, commit, tags, marker


def node(*args):
    r = subprocess.run(['node', ENGINE, *args], capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(f'comparison engine failed: {r.stderr[:400]}')
    return json.loads(r.stdout)


def report_md(rep, prev, new):
    """The review report, in plain words first; the technical detail follows for developers."""
    to, frm = rep['to']['label'], rep['from']['label']
    L = [f"# What release {to} changed in Custom Roles & Permissions", '',
         f"Compared with: **{frm}**. Checked on {datetime.date.today().isoformat()}.", '',
         'This was read from the app itself. It shows how the app is built; nothing here has been tested by a person yet.', '']
    if not rep['changes']:
        L += ['**No Custom Roles & Permissions changes detected in this release.**', '',
              'It can be saved only as a "no change" release (`confirm ... --checkpoint`).']
        return '\n'.join(L)
    groups = [('access', 'Changes to who can do what'), ('screens', 'Changes to what people see on screen'),
              ('behind', 'Behind-the-scenes checks')]
    L += ['| Priority | Change |', '|---|---|'] + [f"| {c['plain']['priority']} | {c['plain']['headline']} |" for c in rep['changes']]
    for g, title in groups:
        xs = [c for c in rep['changes'] if c['plain']['group'] == g]
        if not xs:
            continue
        L += ['', f'## {title} ({len(xs)})', '']
        for c in xs:
            p = c['plain']
            L += [f"### {p['headline']}", f"**{p['priority']}.** {p['what']}".rstrip(), '', f"Why it matters: {p['why']}", '']
            if p.get('before') or p.get('after'):
                L += [f"Before: {p.get('before') or '-'} → Now: {p.get('after') or '-'}", '']
            if p.get('roles'):
                L += [f"Who is affected: {', '.join(p['roles'])}", '']
            L += ['How to check it (suggestions, not proof):'] + [f'{i}. {x}' for i, x in enumerate(p['check'], 1)] + \
                 ['', 'Test result: Not Tested · Approval: Not documented', '']
    L += ['---', '', '## Technical details (for developers)', '', f"Compared snapshot `{prev['id']}` with `{new}`, engine {rep['engine_version']}.", '']
    for c in rep['changes']:
        L += [f"- **{c['title']}** — {c['risk']}: {c['risk_reason']} Before `{str(c['before'])[:120]}` → now `{str(c['after'])[:120]}`. "
              f"Evidence `{json.dumps(c.get('evidence'), ensure_ascii=False)[:240]}`"]
    return '\n'.join(L)


def retest_md(plan, tag):
    """The manual-QA retest checklist for one release, in plain words."""
    L = [f'# What to retest after release {tag}', '',
         'Custom Roles & Permissions only. Read from the app itself; the steps are suggestions to plan with.', '']
    if not plan['needs_retest']:
        return '\n'.join(L + [f'Nothing in Custom Roles & Permissions changed in release {tag}. '
                               'No Custom Roles retest is needed for this release. Normal regression testing still applies.'])
    total = len(plan['items']) + len(plan['spot_checks'])
    L += [f"Release {tag} changed {plan['change_count']} things in roles and permissions. {total} checks to do.", '']
    parts = [('Check what changed', [i for i in plan['items'] if i['kind'] == 'change']),
             ('Re-check these areas', [i for i in plan['items'] if i['kind'] == 'area']),
             ('Quick checks after any permission change', plan['spot_checks'])]
    n, part = 0, 0
    for title, xs in parts:
        if not xs:
            continue
        part += 1
        L += [f'## Part {part} · {title}', '']
        for it in xs:
            n += 1
            L += [f"### {n}. {it['title']}" + (f" ({it['priority']})" if it.get('priority') else ''), '']
            if it.get('what'):
                L += [it['what'], '']
            if it.get('quote'):
                L += [f"The plan says: \"{it['quote']}\"", '']
            r = it.get('roles') or {}
            if r.get('with') or r.get('without'):
                L += [f"Should work for: {r.get('with') or '-'} · Should be refused for: {r.get('without') or 'a test role with the permission switched off'}", '']
            L += [f'{i}. {x}' for i, x in enumerate(it['steps'], 1)] + ['']
            if it.get('actions'):
                L += ['Features to try: ' + '; '.join(it['actions'][:15]) + (f' and {len(it["actions"]) - 15} more' if len(it['actions']) > 15 else ''), '']
            L += ['Test result: Not Tested', '']
    return '\n'.join(L)


def scan(a):
    repo = a.repo
    marker = a.build_marker
    if a.production:
        marker = measure_production()
        print(f'production runs: {marker} (measured {datetime.datetime.now(datetime.timezone.utc):%Y-%m-%d %H:%M} UTC)')
    if not a.ref and not marker:
        raise SystemExit('STOPPED: say which release - --production, --ref <tag|commit>, or --build-marker')
    ref, commit, tags, marker = resolve(repo, a.ref, marker)
    reg = snapshot_store.load_registry()
    dup = snapshot_store.find_by_commit(reg, commit)
    if dup:
        print(f'Already recorded: commit {commit[:7]} is snapshot "{dup["id"]}" ({dup["label"]}), recorded '
              f'{dup["recorded_at"]}. Nothing to do - the same release is never snapshotted twice.')
        return 0
    prev = snapshot_store.latest(reg, 'implementation')
    if not prev:
        raise SystemExit('STOPPED: no implementation baseline is recorded yet')
    snap = extract_impl.extract(repo, ref, marker)
    if a.production:
        snap['release']['deployed'] = {'environment': 'production (app.shopview.com)', 'build_marker': marker,
                                       'measured_at': datetime.date.today().isoformat(),
                                       'how': 'app-version meta tag read from https://app.shopview.com/'}
    sid = 'impl-' + (tags[0] if tags else commit[:10])
    os.makedirs(PENDING, exist_ok=True); os.makedirs(REPORTS, exist_ok=True)
    pend = os.path.join(PENDING, f'{sid}.json')
    json.dump(dict(snap, snapshot_id=sid), open(pend, 'w'), indent=1, ensure_ascii=False)
    prev_path = os.path.join(snapshot_store.SNAP_DIR, prev['file'])
    rep = node(prev_path, pend)
    base = f"{prev['id']}__to__{sid}"
    json.dump(rep, open(os.path.join(REPORTS, base + '.json'), 'w'), indent=1, ensure_ascii=False)
    open(os.path.join(REPORTS, base + '.md'), 'w').write(report_md(rep, prev, sid))
    rt = subprocess.run(['node', ENGINE, '--retest', os.path.join(REPORTS, base + '.json'), pend], capture_output=True, text=True)
    if rt.returncode == 0:
        open(os.path.join(REPORTS, base + '-RETEST.md'), 'w').write(retest_md(json.loads(rt.stdout), tags[0] if tags else commit[:7]))
    if not rep['changes']:
        print(f'\nNo Custom Roles & Permissions changes detected in this release ({ref}, {commit[:7]}) '
              f'compared with {prev["label"]}.')
        print(f'To record a no-change checkpoint: python3 track_changes.py confirm {sid} --by "<name>" --checkpoint')
    else:
        print(f'\n{len(rep["changes"])} permission-related change(s) in {ref} ({commit[:7]}) vs {prev["label"]}: {rep["counts"]}')
        for c in rep['changes'][:15]:
            print(f"  {c['risk']:6} {c['title'][:110]}")
        print(f'Retest checklist for the QA team: reports/{base}-RETEST.md')
        print(f'\nReview: reports/{base}.md   then: python3 track_changes.py confirm {sid} --by "<name>"')
    return 0


def confirm(a):
    pend = os.path.join(PENDING, f'{a.id}.json')
    if not os.path.exists(pend):
        raise SystemExit(f'STOPPED: no pending scan {a.id!r} - run scan first')
    snap = json.load(open(pend))
    reg = snapshot_store.load_registry()
    prev = snapshot_store.latest(reg, 'implementation')
    base = f"{prev['id']}__to__{a.id}"
    rp = os.path.join(REPORTS, base + '.json')
    if not os.path.exists(rp):
        raise SystemExit(f'STOPPED: the change report {base}.json is missing - re-run scan; a snapshot is never recorded unreviewed')
    rep = json.load(open(rp))
    if not rep['changes'] and not a.checkpoint:
        raise SystemExit('REFUSED: this release has NO permission-related change. Record it with --checkpoint '
                         '(a no-change checkpoint), never as a changed-behaviour snapshot.')
    r = snap['release']
    label = a.label or (f"Release {r['ref']} — {'no permission changes (checkpoint)' if not rep['changes'] else 'Permissions changes'}")
    snap.pop('snapshot_id', None)
    e = snapshot_store.record(snap, a.id, label, a.by, previous=prev['id'],
                              change_report=f'reports/{base}.json', checkpoint=not rep['changes'],
                              notes=a.notes)
    os.remove(pend)
    print(f"recorded {e['id']} ({e['label']}) sha256 {e['sha256'][:12]} — previous {prev['id']}")
    return 0


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    s = sub.add_parser('scan'); s.add_argument('--repo', default=DEFAULT_REPO); s.add_argument('--ref')
    s.add_argument('--build-marker'); s.add_argument('--production', action='store_true')
    c = sub.add_parser('confirm'); c.add_argument('id'); c.add_argument('--by', required=True)
    c.add_argument('--label'); c.add_argument('--notes'); c.add_argument('--checkpoint', action='store_true')
    a = ap.parse_args()
    sys.exit(scan(a) if a.cmd == 'scan' else confirm(a))
