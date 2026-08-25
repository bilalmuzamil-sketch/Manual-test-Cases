#!/usr/bin/env python3
"""C44874 / GS-LIST-01 — remove the literal backslashes. QA lead approved 2026-08-25.

Unlike the four placeholder cases, this defect is in OUR LOCAL SOURCE as well, so it is
an authoring defect faithfully carried into TestRail rather than an import artefact.
Both sides are therefore fixed, local first so the source of truth leads.

    was:  'Showing 12 work orders matching \\'Fib\\''
    now:  'Showing 12 work orders matching "Fib"'

Nested single quotes were the cause; double quotes inside the single-quoted banner text
need no escaping and read correctly to a tester.

Applies the conditional <br> guard (playbook J #3a-i): this write would otherwise
<p>-wrap the plain-text fields with bare newlines and collapse them.
"""
import json, base64, urllib.request, urllib.error, re, html, glob, sys

CID = 44874
LID = 'GS-LIST-01'
OLD = "matching \\'Fib\\'"
NEW = 'matching "Fib"'

C = json.load(open('/tmp/testrail/creds.json'))
A = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B = C['host'] + '/index.php?/api/v2/'
PASS = 'build/build-verify-session-2026-08-21/'


def call(path, payload=None):
    r = urllib.request.Request(B + path,
                               data=json.dumps(payload).encode() if payload is not None else None)
    r.add_header('Authorization', 'Basic ' + A)
    r.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(r, timeout=60) as x:
            return x.status, json.loads(x.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:300]


def rendered(t):
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', t or '')).split())


P_BLOCK = re.compile(r'<p\b[^>]*>(.*?)</p>', re.S | re.I)


def genuine_collapse(t):
    return any('\n' in i.strip() and '<br' not in i.lower() for i in P_BLOCK.findall(t or ''))


def is_plain(t):
    return not any(x in (t or '').lower() for x in ('<p', '<ol', '<li', '<br', '<hr', '<ul'))


def guard_breaks(t):
    if not t or not is_plain(t) or '\n' not in t.strip():
        return t
    return t.replace('\n', '<br>\n')


# ---------------- 1. LOCAL SOURCE FIRST ----------------
local_hits = 0
for fp in glob.glob('build/global-search/cases/*.json'):
    data = json.load(open(fp))
    if not isinstance(data, list):
        continue
    touched = False
    for it in data:
        if isinstance(it, dict) and it.get('id') == LID:
            for k in ('expected', 'preconditions', 'steps', 'title'):
                v = it.get(k)
                if isinstance(v, str) and OLD in v:
                    it[k] = v.replace(OLD, NEW)
                    local_hits += 1
                    touched = True
                elif isinstance(v, list):
                    nv = [x.replace(OLD, NEW) if isinstance(x, str) else x for x in v]
                    if nv != v:
                        it[k] = nv
                        local_hits += 1
                        touched = True
    if touched:
        with open(fp, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"local: {fp} updated ({local_hits} field(s))")
if not local_hits:
    print("local: nothing matched — STOP, do not write live on a guess")
    sys.exit(1)
# prove the file still parses
for fp in glob.glob('build/global-search/cases/*.json'):
    json.load(open(fp))
print("local: all global-search case JSON re-parses cleanly")

# ---------------- 2. LIVE CASE ----------------
st, pre = call(f'get_case/{CID}')
if st != 200:
    print(f"live pre-read HTTP {st} — STOP")
    sys.exit(1)
json.dump(pre, open(f'{PASS}snapshots/batch/PRE-C{CID}.json', 'w'), indent=1)
if pre.get('custom_atmstatus') == 3:
    print("live: case is Automated — Rule 71 ask needed. Local fixed, live HELD.")
    sys.exit(0)

payload = {'title': pre['title'], 'refs': pre.get('refs') or '',
           'custom_preconds': pre.get('custom_preconds') or '',
           'custom_steps': pre.get('custom_steps') or '',
           'custom_expected': pre.get('custom_expected') or ''}
found = False
for fld in ('custom_preconds', 'custom_steps', 'custom_expected'):
    if OLD in payload[fld]:
        payload[fld] = payload[fld].replace(OLD, NEW)
        found = True
        print(f"live: {fld} — backslashes removed")
if not found:
    print(f"live: {OLD!r} not present — STOP, never blind-write")
    sys.exit(1)
intended = {f: rendered(payload[f]) for f in payload}
for fld in ('custom_preconds', 'custom_steps', 'custom_expected'):
    g = guard_breaks(payload[fld])
    if g != payload[fld]:
        payload[fld] = g
        print(f"live: {fld} — <br> added (plain text this write would collapse)")

assert '\\' not in payload['custom_expected'], "backslashes must be gone"
st2, _ = call(f'update_case/{CID}', payload)
print("live: update_case HTTP", st2)
if st2 != 200:
    sys.exit(1)
st3, post = call(f'get_case/{CID}')
e = post.get('custom_expected') or ''
checks = [('backslashes gone', '\\' not in e),
          ('double-quoted Fib present', '"Fib"' in e),
          ('expected renders as intended', rendered(e) == intended['custom_expected']),
          ('preconds renders as intended', rendered(post.get('custom_preconds')) == intended['custom_preconds']),
          ('steps renders as intended', rendered(post.get('custom_steps')) == intended['custom_steps']),
          ('title untouched', post['title'] == pre['title']),
          ('refs untouched', rendered(post.get('refs')) == intended['refs']),
          ('no genuine collapse', not genuine_collapse(e)),
          ('one provenance', e.count('This is the expected behaviour as per') == 1),
          ('one marker', e.count('AUTOMATION:') == 1),
          ('marker date unmoved', ('Last checked' in e) == ('Last checked' in (pre.get('custom_expected') or ''))),
          ('atm unchanged', post.get('custom_atmstatus') == pre.get('custom_atmstatus')),
          ('section unchanged', post.get('section_id') == pre.get('section_id'))]
print("\n===== VERIFICATION =====")
ok = True
for n, r in checks:
    print(f"  [{'PASS' if r else 'FAIL'}] {n}")
    ok = ok and r
json.dump(post, open(f'{PASS}snapshots/batch/POST-C{CID}.json', 'w'), indent=1)
print("\nrendered now:", rendered(e)[:190])
print("RESULT:", "C44874 COMPLETE (local + live)" if ok else "*** FAILED ***")
sys.exit(0 if ok else 1)
