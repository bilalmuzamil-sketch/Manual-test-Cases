#!/usr/bin/env python3
"""THE AUTHORISED REPAIR BATCH — QA lead approved items 1, 2, 3 on 2026-08-25.

(1) PLACEHOLDERS: restore what TestRail's HTML pipeline ate on import, using SQUARE
    brackets. Angle brackets can never be stored (core 3.8), so [query] carries the
    same meaning and survives.
(2) COLLAPSE: on cases whose custom_expected is <p>-wrapped with bare newlines and no
    <br>, rewrite THE BREAKS ONLY -- never the wording.
(3) TITLES: give the two colliding Inline-Parts titles their view mode.

UNIVERSAL GUARD, learned the hard way on C44864 an hour ago: ANY update_case re-renders
text fields and will itself create the collapse pattern. So every multi-line field in
every payload gets <br> before its newlines, whether or not that case was on the
collapse list. The repair and the damage-prevention are the same operation.

Idempotent: DONE.jsonl is read on start and completed cases are skipped.
Every write: all text fields + refs sent; dry-run printed; byte-verified after; the
batch STOPS on any mismatch (core 2.1/2.2/2.3/2.9).
"""
import json, base64, urllib.request, urllib.error, re, os, sys

C = json.load(open('/tmp/testrail/creds.json'))
A = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B = C['host'] + '/index.php?/api/v2/'
PASS = 'build/build-verify-session-2026-08-21/'
DONE = PASS + 'DONE.jsonl'


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


# ---- exact, minimal, source-faithful substitutions -------------------------------
PLACEHOLDER_FIX = {
    44864: {'refs': [("No results for  +", "No results for [query] +")],
            'custom_expected': [("No results for  + quick-create chips",
                                 "No results for [query] + quick-create chips"),
                                ("""reads 'No results for \\'S1- 56438\\''""",
                                 '''reads "No results for 'S1- 56438'"''')]},
    44875: {'custom_preconds': [("banner 'Showing N work orders matching ' is visible",
                                 "banner 'Showing N work orders matching [q]' is visible")],
            'custom_expected': [("The 'Showing N work orders matching ' banner is removed",
                                 "The 'Showing N work orders matching [q]' banner is removed")]},
    44892: {'custom_steps': [("{type: customer, id: }", "{type: customer, id: [that customer]}")]},
    45055: {'custom_expected': [("“Create  as a new part”",
                                 "“Create [typed text] as a new part”")]},
}
TITLE_FIX = {
    45032: "Edit control not displayed without the Create and Edit setting (Tech View)",
    45066: "Edit control not displayed without the Create and Edit setting (Full View)",
}
COLLAPSE = [44536, 44520, 44506, 44512, 44517, 44823, 44804, 44561, 44549, 44988,
            45084, 45086, 45088, 45091]
HELD_FOREIGN_LOCK = [44901, 44908]

TARGETS = sorted(set(list(PLACEHOLDER_FIX) + list(TITLE_FIX) + COLLAPSE))
print(f"targets: {len(TARGETS)}  | held out (foreign lock): {HELD_FOREIGN_LOCK}\n")


def strip_tags(t):
    return re.sub(r'<[^>]+>', '', t or '')


def words(t):
    return ' '.join(strip_tags(t).split())


def add_breaks(t):
    if not t or '<br' in t.lower():
        return t
    return t.replace('\n', '<br>\n') if '\n' in t.strip() else t


def collapses(t):
    t = t or ''
    return '\n' in t.strip() and '<p' in t.lower() and '<br' not in t.lower()


done = set()
if os.path.exists(DONE):
    for ln in open(DONE):
        try:
            done.add(json.loads(ln)['cid'])
        except Exception:
            pass

logrows = []
for cid in TARGETS:
    if cid in done:
        print(f"C{cid}: already done, skipped")
        continue
    st, pre = call(f'get_case/{cid}')
    if st != 200:
        print(f"C{cid}: pre-read HTTP {st} - STOP")
        sys.exit(1)
    if pre.get('custom_atmstatus') == 3:
        print(f"C{cid}: flagged Automated - Rule 71 needs a separate ask. SKIPPED, not written.")
        logrows.append((cid, 'SKIPPED', 'atm=3 Rule 71', pre.get('custom_atmstatus')))
        continue
    os.makedirs(PASS + 'snapshots/batch', exist_ok=True)
    json.dump(pre, open(f"{PASS}snapshots/batch/PRE-C{cid}.json", 'w'), indent=1)

    payload = {'title': pre['title'], 'refs': pre.get('refs') or '',
               'custom_preconds': pre.get('custom_preconds') or '',
               'custom_steps': pre.get('custom_steps') or '',
               'custom_expected': pre.get('custom_expected') or ''}
    changes = []
    for fld, subs in PLACEHOLDER_FIX.get(cid, {}).items():
        for old, new in subs:
            if old in payload[fld]:
                payload[fld] = payload[fld].replace(old, new)
                changes.append(f"{fld}: placeholder restored")
            else:
                print(f"  C{cid} {fld}: expected substring NOT FOUND - STOP (never blind-write)")
                sys.exit(1)
    if cid in TITLE_FIX:
        payload['title'] = TITLE_FIX[cid]
        changes.append("title: view mode added")
    for fld in ('custom_preconds', 'custom_steps', 'custom_expected'):
        b = add_breaks(payload[fld])
        if b != payload[fld]:
            payload[fld] = b
            changes.append(f"{fld}: line breaks made explicit")
    if not changes:
        print(f"C{cid}: nothing to change, not written")
        continue
    assert '<' not in payload['title'] and '>' not in payload['title'], f"C{cid} title holds markup"
    assert len(payload['title']) <= 80, f"C{cid} title over 80 chars"

    print(f"C{cid}: {', '.join(changes)}")
    st2, _ = call(f'update_case/{cid}', payload)
    if st2 != 200:
        print(f"  write HTTP {st2} - STOP")
        sys.exit(1)
    st3, post = call(f'get_case/{cid}')
    exp = post.get('custom_expected') or ''
    checks = [('title exact', post['title'] == payload['title']),
              ('preconds wording', words(post.get('custom_preconds')) == words(payload['custom_preconds'])),
              ('steps wording', words(post.get('custom_steps')) == words(payload['custom_steps'])),
              ('expected wording', words(exp) == words(payload['custom_expected'])),
              ('refs wording', words(post.get('refs')) == words(payload['refs'])),
              ('no collapse left', not any(collapses(post.get(f)) for f in
                                           ('custom_preconds', 'custom_steps', 'custom_expected'))),
              ('one provenance', exp.count('This is the expected behaviour as per') <= 1),
              ('one marker', exp.count('AUTOMATION:') == 1),
              ('atm unchanged', post.get('custom_atmstatus') == pre.get('custom_atmstatus')),
              ('section unchanged', post.get('section_id') == pre.get('section_id')),
              ('no angle bracket in title', '<' not in post['title'])]
    bad = [n for n, r in checks if not r]
    json.dump(post, open(f"{PASS}snapshots/batch/POST-C{cid}.json", 'w'), indent=1)
    if bad:
        print(f"  *** BYTE-CHECK FAILED: {bad} - BATCH STOPPED (core 2.3)")
        logrows.append((cid, 'FAILED', ';'.join(bad), pre.get('custom_atmstatus')))
        open(PASS + 'batch-audit.json', 'w').write(json.dumps(logrows, indent=1))
        sys.exit(1)
    print(f"  HTTP 200 - {len(checks)} checks PASSED")
    logrows.append((cid, 'OK', ' | '.join(changes), pre.get('custom_atmstatus')))
    with open(DONE, 'a') as f:
        f.write(json.dumps({'cid': cid, 'changes': changes}) + "\n")

print(f"\n===== BATCH COMPLETE: {sum(1 for r in logrows if r[1]=='OK')} written, "
      f"{sum(1 for r in logrows if r[1]=='SKIPPED')} skipped, "
      f"{sum(1 for r in logrows if r[1]=='FAILED')} failed =====")
json.dump(logrows, open(PASS + 'batch-audit.json', 'w'), indent=1)
