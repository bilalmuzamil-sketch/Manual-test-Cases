#!/usr/bin/env python3
"""SKILL 04 SECTION 4 AS A GATE: every case the brief tells the tester to skip, or to run only part
of, must carry that reason IN ITS OWN WORDS at the end of its Expected Results.

Why it is a gate and not a note. A tester opens cases from the run, not from the brief. On 1 Sep a
live check found 14 of ours telling the tester nothing about a situation that does not exist on this
system - so they would have tried to set it up, failed, and either guessed or recorded the wrong
result. The brief alone does not fix that.

Exit 1 if any case in scope lacks the note. Foreign and Automated-held cases are named and excluded,
never silently dropped.
"""
import json, base64, urllib.request, re, html, time, sys

C = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
def get(p):
    for a in range(5):
        try:
            r = urllib.request.Request('https://shopview.testrail.io/index.php?/api/v2/' + p,
                                       headers={'Authorization': 'Basic ' + AUTH})
            return json.load(urllib.request.urlopen(r, timeout=180))
        except Exception:
            if a == 4: raise
            time.sleep(2 ** a)
def txt(h):
    if not h: return ''
    s = re.sub(r'<(br|/p|/li|/div|hr)[^>]*>', '\n', h)
    return html.unescape(re.sub(r'<[^>]+>', '', s)).strip()

# the cases the brief does NOT tell the tester to run end to end, from each suite's verdicts.py
import importlib.util, os
ROOT = '/home/user/Manual-test-Cases'
def V(p):
    s = importlib.util.spec_from_file_location('v' + os.path.basename(os.path.dirname(p)), p)
    m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return dict(m.V)
allv = {}
for p in (f'{ROOT}/build/inline-add-edit-parts/build-verify-2026-09-01/verdicts/verdicts.py',
          f'{ROOT}/build/printer-friendly-wo/build-verify-2026-09-01/verdicts/verdicts.py'):
    allv.update(V(p))
need = [cid for cid, v in sorted(allv.items())
        if v[0] in ('NOTVER', 'UNREACHABLE', 'PARTIAL', 'FOREIGN', None)]

missing, excluded, ok = [], [], []
for cid in need:
    c = get(f'get_case/{cid}')
    if c['created_by'] != 3:
        excluded.append(f'C{cid} (foreign — {get("get_user/%d" % c["created_by"])["name"]}, Rule 38)'); continue
    if c.get('custom_atmstatus') == 3:
        excluded.append(f'C{cid} (Automated, awaiting a per-case go-ahead, Rule 71)'); continue
    e = txt(c.get('custom_expected') or '')
    (ok if 'NOTE FOR THE TESTER' in e else missing).append(cid)

print(f'cases the brief does not send the tester through end to end: {len(need)}')
print(f'  carry their reason in their own words : {len(ok)}  {["C%d" % i for i in ok]}')
print(f'  MISSING the note                     : {len(missing)}  {["C%d" % i for i in missing]}')
print(f'  named and excluded                   : {len(excluded)}')
for x in excluded: print(f'     {x}')
print()
print('SELF-EXPLAIN GATE:', 'ALL CLEAR' if not missing else f'{len(missing)} CASES WOULD MISLEAD A TESTER')
sys.exit(1 if missing else 0)
