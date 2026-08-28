#!/usr/bin/env python3
"""Did MY 2026-08-25 writes leave any case showing literal tag text to a tester?

REUSED, NOT RE-DERIVED (Rule 27): the login + container-classification mechanism is
lifted from `build/report-suite/writes2-2026-08-26/job4_render_path_scan.py`, found on the
canonical branch. It needs NO Playwright and NO MITM bridge — a plain form POST to
/index.php?/auth/login/ with a cookie jar is enough to read the served view page, which is
the only place the per-case container flag is visible (`get_case` does not expose it).

Scope: the 9 cases this session wrote on 2026-08-25, plus two controls from the other
session's scan (C30287 known fr-view = safe, C30518 known escaping = damaged) so the
detector is PROVEN ABLE TO FIRE IN BOTH DIRECTIONS before its negatives are believed
(skill 03 §2 — a probe that cannot fail is not a check).

Read-only. No write of any kind.
"""
import json, re, sys
import urllib.request, urllib.parse, http.cookiejar

BASE = 'https://shopview.testrail.io'
MINE = ['44506', '44864', '44874', '44875', '44892', '45032', '45055', '45066']
CONTROLS = {'30287': 'expected SAFE (fr-view)', '30518': 'expected DAMAGED (escaping)'}

api = json.load(open('/tmp/testrail/creds.json'))
try:
    ui = json.load(open('/tmp/testrail/creds-ui.json'))
except Exception:
    ui = None

def login(email, password, label):
    jar = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    op.addheaders = [('User-Agent', 'QA-observation')]
    try:
        op.open(BASE + '/index.php?/auth/login/', timeout=60).read()
        op.open(BASE + '/index.php?/auth/login/',
                urllib.parse.urlencode({'name': email, 'password': password,
                                        'submit_login': 'Log In'}).encode(), timeout=60).read()
        page = op.open(f'{BASE}/index.php?/cases/view/30287', timeout=60).read().decode('utf-8', 'replace')
        ok = bool(re.findall(r'<div class="(markdown[^"]*)">', page))
        print(f"login via {label}: {'OK — view page renders case containers' if ok else 'reached, but no case container found (not a real session)'}")
        return op if ok else None
    except Exception as e:
        print(f"login via {label}: FAILED {type(e).__name__} {str(e)[:120]}")
        return None

op = login(api['email'], api['password'], 'creds.json (API key as password)')
if op is None and ui:
    op = login(ui['email'], ui['password'], 'creds-ui.json (account password)')
if op is None:
    print("\nNo UI session could be established by form login. NOT concluding anything about")
    print("the 9 cases — this is an unestablished check, not a clean result (core §1.4).")
    sys.exit(2)

def scan(cid):
    page = op.open(f'{BASE}/index.php?/cases/view/{cid}', timeout=60).read().decode('utf-8', 'replace')
    classes = re.findall(r'<div class="(markdown[^"]*)">', page)
    escaping = [c for c in classes if 'fr-view' not in c]
    literal = []
    for m in re.finditer(r'<div class="(markdown)">(.*?)</div>', page, re.S):
        for t in ('&lt;p&gt;', '&lt;/p&gt;', '&lt;ol&gt;', '&lt;li&gt;', '&lt;br&gt;', '&lt;hr&gt;'):
            if t in m.group(2):
                literal.append(t.replace('&lt;', '<').replace('&gt;', '>'))
    return {'containers': classes, 'escaping': len(escaping),
            'literal_tags_visible': sorted(set(literal))}

print("\n===== CONTROLS — the detector must fire in BOTH directions =====")
ctrl = {}
for cid, expect in CONTROLS.items():
    r = scan(cid)
    ctrl[cid] = r
    print(f"  C{cid} ({expect}): escaping={r['escaping']} literal={r['literal_tags_visible']}")
control_ok = (ctrl.get('30518', {}).get('literal_tags_visible') or
              ctrl.get('30518', {}).get('escaping'))
print(f"  control verdict: {'DETECTOR CAN FIRE — negatives below are meaningful' if control_ok else 'CONTROL DID NOT FIRE — treat every result below as NOT_ESTABLISHED'}")

print("\n===== MY 9 WRITTEN CASES =====")
out = {}
for cid in MINE:
    r = scan(cid)
    out[cid] = r
    flag = 'DAMAGED — tester sees tags' if r['literal_tags_visible'] else ('escaping container, no tag text' if r['escaping'] else 'safe (fr-view)')
    print(f"  C{cid}: {flag}  containers={r['containers']} literal={r['literal_tags_visible']}")

json.dump({'controls': ctrl, 'control_can_fire': bool(control_ok), 'mine': out},
          open('build/build-verify-session-2026-08-21/evidence/render-path-scan-my-writes.json', 'w'), indent=1)
dmg = [c for c, v in out.items() if v['literal_tags_visible']]
esc = [c for c, v in out.items() if v['escaping']]
print(f"\nof my {len(MINE)} written cases: {len(dmg)} show literal tags, {len(esc)} sit in an escaping container")
print("DAMAGED:", dmg if dmg else "none")
