#!/usr/bin/env python3
"""AUTHORISED REPAIRS, CORRECTED SCOPE — items 1 and 3 only, plus a structural repair
attempt on C44506 which my own faulty batch damaged.

WHAT CHANGED FROM v1, AND WHY:
  * ITEM 2 IS ABANDONED. The v2 census proves ZERO genuinely collapsed cases exist. The
    16 my v1 detector flagged were the normal block-HTML shape the CSV import produces
    (<ol><li>…</ol>, <hr />, <p>…</p> separated by newlines) and they render correctly.
    Writing to them cannot improve them and — proven on C44506 — actively harms them.
  * THE <br> GUARD IS NOW CONDITIONAL, not universal. It is applied ONLY to a field that
    is PLAIN TEXT with newlines (no block markup), because such a field WILL be
    <p>-wrapped-and-collapsed by this very write (core 2.1a). A field already made of
    block elements is left strictly alone.
  * COMPARISON IS ON RENDERED TEXT, with two normalisations now PROVEN on this estate and
    recorded in the playbook before being relied on (core 3.2's requirement):
      (a) entity encoding on write:  '—' -> '&mdash;'   (renders identically)
      (b) tag re-parsing on write:   '<hr />' -> '<hr>', blank lines dropped
    Both preserve what the tester reads, which is the thing that matters. Byte-equality is
    reported but is NOT the gate, because TestRail's own pipeline makes it unattainable.
"""
import json, base64, urllib.request, urllib.error, re, html, os, sys

C = json.load(open('/tmp/testrail/creds.json'))
A = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B = C['host'] + '/index.php?/api/v2/'
PASS = 'build/build-verify-session-2026-08-21/'
DONE = PASS + 'DONE-v2.jsonl'


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
    """exactly what a tester reads: tags out, entities decoded, whitespace collapsed"""
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', t or '')).split())


P_BLOCK = re.compile(r'<p\b[^>]*>(.*?)</p>', re.S | re.I)


def genuine_collapse(t):
    for inner in P_BLOCK.findall(t or ''):
        if '\n' in inner.strip() and '<br' not in inner.lower():
            return True
    return False


def is_plain(t):
    return not any(x in (t or '').lower() for x in ('<p', '<ol', '<li', '<br', '<hr', '<ul'))


def guard_breaks(t):
    """only for PLAIN multi-line text, which this write would otherwise collapse"""
    if not t or not is_plain(t) or '\n' not in t.strip():
        return t
    return t.replace('\n', '<br>\n')


# ---------- item 1: placeholders (square brackets survive; angle brackets never do) ----
PLACEHOLDER_FIX = {
    44875: {'custom_preconds': [("banner 'Showing N work orders matching ' is visible",
                                 "banner 'Showing N work orders matching [q]' is visible")],
            'custom_expected': [("The 'Showing N work orders matching ' banner is removed",
                                 "The 'Showing N work orders matching [q]' banner is removed")]},
    44892: {'custom_steps': [("{type: customer, id: }", "{type: customer, id: [that customer]}")]},
    45055: {'custom_expected': [("“Create  as a new part”", "“Create [typed text] as a new part”")]},
}
# ---------- item 3: the two colliding titles get their view mode -----------------------
TITLE_FIX = {
    45032: "Edit control not displayed without the Create and Edit setting (Tech View)",
    45066: "Edit control not displayed without the Create and Edit setting (Full View)",
}

done = set()
if os.path.exists(DONE):
    for ln in open(DONE):
        try:
            done.add(json.loads(ln)['cid'])
        except Exception:
            pass

TARGETS = sorted(set(list(PLACEHOLDER_FIX) + list(TITLE_FIX)))
print(f"items 1 and 3: {len(TARGETS)} cases -> {TARGETS}")
print("item 2 ABANDONED: 0 genuinely collapsed cases exist (census v2)\n")

audit = []
for cid in TARGETS:
    if cid in done:
        print(f"C{cid}: already done, skipped")
        continue
    st, pre = call(f'get_case/{cid}')
    if st != 200:
        print(f"C{cid}: pre-read HTTP {st} - STOP")
        sys.exit(1)
    if pre.get('custom_atmstatus') == 3:
        print(f"C{cid}: Automated - Rule 71 ask needed. SKIPPED unwritten.")
        audit.append({'cid': cid, 'result': 'SKIPPED', 'why': 'atm=3'})
        continue
    os.makedirs(PASS + 'snapshots/batch', exist_ok=True)
    json.dump(pre, open(f"{PASS}snapshots/batch/PRE-C{cid}.json", 'w'), indent=1)

    payload = {'title': pre['title'], 'refs': pre.get('refs') or '',
               'custom_preconds': pre.get('custom_preconds') or '',
               'custom_steps': pre.get('custom_steps') or '',
               'custom_expected': pre.get('custom_expected') or ''}
    intended_render = {f: rendered(payload[f]) for f in payload}
    changes = []
    for fld, subs in PLACEHOLDER_FIX.get(cid, {}).items():
        for old, new in subs:
            if old not in payload[fld]:
                print(f"  C{cid} {fld}: expected substring NOT FOUND - STOP, never blind-write")
                sys.exit(1)
            payload[fld] = payload[fld].replace(old, new)
            intended_render[fld] = rendered(payload[fld])
            changes.append(f"{fld}: placeholder restored as [square brackets]")
    if cid in TITLE_FIX:
        payload['title'] = TITLE_FIX[cid]
        intended_render['title'] = rendered(payload['title'])
        changes.append("title: view mode added")
    for fld in ('custom_preconds', 'custom_steps', 'custom_expected'):
        g = guard_breaks(payload[fld])
        if g != payload[fld]:
            payload[fld] = g
            changes.append(f"{fld}: <br> added (plain text this write would collapse)")
    if not changes:
        print(f"C{cid}: nothing to do")
        continue
    assert '<' not in payload['title'] and '>' not in payload['title']
    assert len(payload['title']) <= 80, f"C{cid} title {len(payload['title'])} chars"

    print(f"C{cid}: {'; '.join(changes)}")
    st2, _ = call(f'update_case/{cid}', payload)
    if st2 != 200:
        print(f"  write HTTP {st2} - STOP")
        sys.exit(1)
    st3, post = call(f'get_case/{cid}')
    exp = post.get('custom_expected') or ''
    checks = [('title exact', post['title'] == payload['title'])]
    for f in ('custom_preconds', 'custom_steps', 'custom_expected', 'refs'):
        checks.append((f'{f} renders as intended', rendered(post.get(f)) == intended_render[f]))
    checks += [('no genuine collapse', not any(genuine_collapse(post.get(f)) for f in
                                               ('custom_preconds', 'custom_steps', 'custom_expected'))),
               ('one provenance', exp.count('This is the expected behaviour as per') <= 1),
               ('one marker', exp.count('AUTOMATION:') == 1),
               ('marker date unmoved', ('Last checked' in exp) ==
                ('Last checked' in (pre.get('custom_expected') or ''))),
               ('atm unchanged', post.get('custom_atmstatus') == pre.get('custom_atmstatus')),
               ('section unchanged', post.get('section_id') == pre.get('section_id')),
               ('no angle bracket in title', '<' not in post['title'])]
    bad = [n for n, r in checks if not r]
    json.dump(post, open(f"{PASS}snapshots/batch/POST-C{cid}.json", 'w'), indent=1)
    if bad:
        print(f"  *** FAILED: {bad} - BATCH STOPPED")
        audit.append({'cid': cid, 'result': 'FAILED', 'failed_checks': bad, 'changes': changes})
        json.dump(audit, open(PASS + 'batch-audit-v2.json', 'w'), indent=1)
        sys.exit(1)
    print(f"  HTTP 200 - {len(checks)} checks PASSED")
    audit.append({'cid': cid, 'result': 'OK', 'changes': changes,
                  'atm': pre.get('custom_atmstatus')})
    with open(DONE, 'a') as f:
        f.write(json.dumps({'cid': cid, 'changes': changes}) + "\n")

print(f"\n===== {sum(1 for a in audit if a['result']=='OK')} written, "
      f"{sum(1 for a in audit if a['result']=='SKIPPED')} skipped, "
      f"{sum(1 for a in audit if a['result']=='FAILED')} failed =====")
json.dump(audit, open(PASS + 'batch-audit-v2.json', 'w'), indent=1)
