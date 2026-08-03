#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""EXECUTOR for the six verifier findings — update_case ONLY.

HARD GUARDS (all assert-enforced before a single byte is written):
  * update_case ONLY. No add_case, no delete_case, no add_section, no run write.
  * REFUSES the foreign cases C38919-C38923 (Vladimir Tomovic, Rule 38).
  * REFUSES C30327 / C30391 (another worker is rescoping them).
  * REFUSES any case whose live created_by != 3 (us).
  * Sends ONLY the fields the plan changes.
  * Re-GETs after every write and compares field by field, accounting for
    TestRail's refs normalisation (split on ",", trim, rejoin with ",").

Usage:  execute.py --dry     (default: prints the diff, writes nothing)
        execute.py --go      (executes)
"""
import json, os, sys, base64, urllib.request, urllib.error, time, difflib

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from plan import PLAN, NEVER_TOUCH  # noqa: E402

CREDS = json.load(open('/tmp/testrail/creds.json'))
SECRET = CREDS.get('password') or CREDS.get('key')
HOST = CREDS['host'].rstrip('/')
AUTH = 'Basic ' + base64.b64encode(f"{CREDS['email']}:{SECRET}".encode()).decode()

FOREIGN = {38919, 38920, 38921, 38922, 38923}
OTHER_WORKER = {30327, 30391}
ALLOWED_FIELDS = {'refs', 'title', 'preconds', 'steps', 'expected'}
FIELD_MAP = {'refs': 'refs', 'title': 'title', 'preconds': 'custom_preconds',
             'steps': 'custom_steps', 'expected': 'custom_expected'}


def api(path, body=None):
    url = f'{HOST}/index.php?/api/v2/{path}'
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method='POST' if data else 'GET',
                                headers={'Authorization': AUTH, 'Content-Type': 'application/json'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.status, json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            return e.code, json.loads(e.read().decode() or '{}')
        except Exception as e:                                    # network blip
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)
            print(f'    (retry {attempt+1} after {e})')


def norm_refs(s):
    """TestRail normalisation, proved live 2026-08-03: split on ",", trim, rejoin."""
    return ','.join(p.strip() for p in (s or '').split(','))


def joined(v):
    return '\n'.join(v) if isinstance(v, list) else v


# ── guards ───────────────────────────────────────────────────────────────────
assert not (set(PLAN) & FOREIGN), 'PLAN touches a FOREIGN case (Rule 38) — refusing'
assert not (set(PLAN) & OTHER_WORKER), 'PLAN touches another worker\'s case — refusing'
assert not (set(PLAN) & NEVER_TOUCH), 'PLAN touches a NEVER_TOUCH case — refusing'
for cid, spec in PLAN.items():
    bad = set(spec['fields']) - ALLOWED_FIELDS
    assert not bad, f'C{cid}: field(s) {bad} are not writable by this pass'

GO = '--go' in sys.argv
log = []
changed = 0
failed = []

print(f'{"EXECUTING" if GO else "DRY RUN"} — {len(PLAN)} planned update_case ops\n')

for n, cid in enumerate(sorted(PLAN), 1):
    spec = PLAN[cid]
    st, before = api(f'get_case/{cid}')
    assert st == 200, f'C{cid}: pre-read HTTP {st}'
    assert before['created_by'] == 3, f'C{cid}: created_by={before["created_by"]} is NOT ours — refusing'
    assert cid not in FOREIGN and cid not in OTHER_WORKER

    body, diffs = {}, []
    for fld, newval in spec['fields'].items():
        tr = FIELD_MAP[fld]
        cur = before.get(tr) or ''
        new = joined(newval)
        if fld == 'refs':
            same = norm_refs(cur) == norm_refs(new)
        else:
            same = cur == new
        if not same:
            body[tr] = new
            diffs.append((fld, cur, new))

    head = f'[{n:02d}/{len(PLAN)}] C{cid} {spec["group"]:8s} {before["title"][:58]}'
    if not body:
        print(head + '   NO-OP (already matches plan)')
        log.append(dict(op=n, case_id=cid, group=spec['group'], http=None, result='NO-OP',
                        why=spec['why'], reverified=spec['reverified'], fields=[]))
        continue

    print(head + f'   fields: {", ".join(f for f, _, _ in diffs)}')
    for fld, cur, new in diffs:
        print(f'      - {fld} BEFORE: {cur[:220]}')
        print(f'      - {fld} AFTER : {new[:220]}')

    if not GO:
        log.append(dict(op=n, case_id=cid, group=spec['group'], http='dry',
                        result='PLANNED', why=spec['why'], reverified=spec['reverified'],
                        fields=[dict(field=f, before=c, after=a) for f, c, a in diffs]))
        continue

    st, res = api(f'update_case/{cid}', body)
    ok = st == 200
    # verify with a fresh re-GET, field by field
    st2, after = api(f'get_case/{cid}')
    assert st2 == 200, f'C{cid}: post-read HTTP {st2}'
    mismatches = []
    for fld, _cur, new in diffs:
        tr = FIELD_MAP[fld]
        got = after.get(tr) or ''
        if fld == 'refs':
            good = norm_refs(got) == norm_refs(new)
        else:
            good = got == new
        if not good:
            mismatches.append(dict(field=fld, expected=new, got=got))
    # untouched fields must be byte-identical
    for tr in ('title', 'custom_preconds', 'custom_steps', 'custom_expected', 'refs',
               'section_id', 'type_id', 'priority_id', 'custom_automation_type', 'custom_atmstatus'):
        if tr in body:
            continue
        if (before.get(tr) or '') != (after.get(tr) or ''):
            mismatches.append(dict(field=tr, expected='(unchanged)', got=after.get(tr)))
    verdict = 'MATCH' if ok and not mismatches else 'FAIL'
    if verdict == 'FAIL':
        failed.append((cid, st, res, mismatches))
    else:
        changed += 1
    print(f'      -> HTTP {st}  re-GET {verdict}')
    log.append(dict(op=n, case_id=cid, group=spec['group'], http=st, result=verdict,
                    why=spec['why'], reverified=spec['reverified'],
                    fields=[dict(field=f, before=c, after=a) for f, c, a in diffs],
                    mismatches=mismatches,
                    error=None if ok else res))

out = os.path.join(HERE, '..', 'execution-log.json')
json.dump(log, open(out, 'w'), indent=1, ensure_ascii=False)
print(f'\nwritten+verified: {changed}   failed: {len(failed)}   log: {os.path.relpath(out)}')
if failed:
    print(json.dumps(failed, indent=1, ensure_ascii=False)[:3000])
    sys.exit(1)
