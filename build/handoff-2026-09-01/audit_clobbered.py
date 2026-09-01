#!/usr/bin/env python3
"""DID MY WRITE PASS OVERWRITE SOMEONE ELSE'S EDIT? — a live audit, not an assumption.

WHY. C44996 and C44994 both turned out to have been corrected BY HAND between the snapshot my write
payload was built from and the moment the write landed, and my write reverted both corrections. The
writer verified its result against MY INTENDED TEXT, which is exactly the check that cannot notice
this. So: measure it across every case the pass wrote.

HOW, and it needs no guesswork about who edited what. `get_history_for_case` records, per change, the
`old_value` the field actually held immediately before that change. For each case my pass wrote:

    the old_value on MY change entry   vs   the `before` value in MY PRE-snapshot

If they differ, the field changed between the snapshot and the write, and my write silently reverted
whatever that change was. TestRail's own record is the authority - the snapshot alone cannot see it
(Rule 87: get_history_for_case IS the authoritative per-field record).
"""
import json, base64, urllib.request, re, time, datetime, os, sys, collections

C = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
def get(p):
    for a in range(6):
        try:
            r = urllib.request.Request('https://shopview.testrail.io/index.php?/api/v2/' + p,
                                       headers={'Authorization': 'Basic ' + AUTH})
            return json.load(urllib.request.urlopen(r, timeout=180))
        except Exception:
            if a == 5: raise
            time.sleep(2 ** a)

ROOT = '/home/user/Manual-test-Cases'
PASSES = [
 ('main build-verification write (6597)',
  f'{ROOT}/build/inline-add-edit-parts/build-verify-2026-09-01/write-2026-09-01'),
 ('main build-verification write (6617)',
  f'{ROOT}/build/printer-friendly-wo/build-verify-2026-09-01/write-2026-09-01'),
 ('tester-note write', f'{ROOT}/build/handoff-2026-09-01/tester-note-write'),
 ('printer verdict-update write', f'{ROOT}/build/handoff-2026-09-01/verdict-update-write'),
 ('inline verdict-update write', f'{ROOT}/build/handoff-2026-09-01/inline-verdict-write'),
]
norm = lambda s: re.sub(r'\s+', ' ', (s or '').replace('&nbsp;', ' ')).strip()

clobbered, noop, checked = [], [], 0
for name, d in PASSES:
    snapf = f'{d}/PRE-snapshot.json'
    appf = f'{d}/APPLIED.jsonl'
    if not (os.path.exists(snapf) and os.path.exists(appf)):
        print(f'SKIP {name}: no snapshot/applied file'); continue
    snap = json.load(open(snapf))
    applied = []
    for line in open(appf):
        if line.strip():
            j = json.loads(line)
            if j.get('ok'): applied.append((str(j['cid']), j.get('at'), j.get('fields') or []))
    print(f'{name}: {len(applied)} cases written')
    for cid, at, fields in applied:
        checked += 1
        if cid not in snap: continue
        want_before = snap[cid].get('before') or {}
        h = get(f'get_history_for_case/{cid}')
        ch = h.get('history') if isinstance(h, dict) else h
        ts = int(datetime.datetime.strptime(at.replace('Z', ''), '%Y-%m-%dT%H:%M:%S.%f')
                 .replace(tzinfo=datetime.timezone.utc).timestamp()) if at else None
        # my entry = the one closest to (and within 90s of) the applied timestamp
        mine = min((x for x in ch if ts and abs(x['created_on'] - ts) <= 90),
                   key=lambda x: abs(x['created_on'] - ts), default=None)
        if not mine:
            # NOT a clobber. The writer logs "save button disabled — content already matches" when the
            # intended text already equals the stored text; TestRail writes no history entry for a
            # no-op, so there is nothing to compare. Counted separately, never as a finding.
            noop.append((cid, name)); continue
        for c in (mine.get('changes') or []):
            f = c.get('field')
            if f not in want_before: continue
            live_before = norm(c.get('old_value'))
            snap_before = norm(want_before.get(f))
            if live_before != snap_before:
                clobbered.append((cid, name, f, snap_before, live_before))

print(f'\ncases checked: {checked}')
print(f'no-op writes (content already matched, no history entry): {len(noop)} '
      f'{["C%s" % c for c, _ in noop]}')
print(f'FIELDS WHERE MY WRITE REVERTED AN INTERVENING EDIT: {len(clobbered)}')
by_case = collections.defaultdict(list)
for cid, name, f, s_, l_ in clobbered: by_case[cid].append((name, f, s_, l_))
for cid in sorted(by_case):
    print(f'\n=== C{cid}')
    for name, f, s_, l_ in by_case[cid]:
        print(f'  pass: {name}   field: {f}')
        if s_ is not None:
            print(f'    my snapshot said the field held : {s_[:220]}')
            print(f'    it ACTUALLY held just before me : {l_[:220]}')
json.dump({'checked': checked, 'noop': [{'case': c, 'pass': n} for c, n in noop], 'clobbered': [
    {'case': c, 'pass': n, 'field': f, 'snapshot_before': s_, 'live_before': l_}
    for c, n, f, s_, l_ in clobbered]}, open('/tmp/handoff/clobber-audit.json', 'w'), indent=1)
sys.exit(1 if clobbered else 0)
