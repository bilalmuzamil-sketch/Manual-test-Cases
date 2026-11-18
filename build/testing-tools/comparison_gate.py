"""comparison_gate.py - Standing Rule 143 (QA lead 2026-11-18, after SV-12853 was closed Obsolete): a finding that compares two
sides - staging vs production, after vs before a release, one build vs another - is NOT put to the QA lead as a defect, not drafted
as a ticket and not used to fail a test until this gate exits 0 on its evidence folder.

Usage:  python3 comparison_gate.py --check <evidence_dir>        (reads <evidence_dir>/COMPARISON.json)
        python3 comparison_gate.py --template <evidence_dir>     (writes an empty COMPARISON.json to fill in)
        python3 comparison_gate.py --selftest                    (proves the gate refuses and accepts what it should)

COMPARISON.json:
{ "claim": "plain sentence of what differs",          "title": "the ticket title you would use (optional)",
  "sides": { "test":      {"environment","build","location","location_tz","browser_tz","app_tz_setting","session_tz","observed_on","screenshots":[...]},
             "reference": {same fields} },
  "contradicting_statements": [{"who","where","said","resolved_by"}],   # every developer/PO statement that disagrees; [] if none found
  "disprove_attempt": "file (relative to the folder) describing the attempt to prove the finding wrong and what it found",
  "jira_search": {"jql": "...", "date": "YYYY-MM-DD", "read_every_result": true},     # tickets from this login, last 14 days, same feature
  "latest_results_read": ["<TestRail test id>", ...] }                                 # tests the finding would touch; [] if none

What it refuses (each one is a way SV-12853 went wrong):
  1 either side missing any of the four time zones (location, browser, the app's own setting, server session), or the two sides
    disagreeing on location or any zone - two clocks compared is the measurement, not the product;
  2 either side without at least one screenshot that exists - "copied from the screen" without a picture is not evidence;
  3 "production" in the claim or title while the reference side is not production observed on screen within 1 day of the test side;
  4 a contradicting statement with no "resolved_by" (resolved means production/the reference was observed, never "our data says");
  5 no disprove-attempt file, or an empty one;
  6 no Jira search of recent tickets on the same feature, or results not read (another session may already have filed it);
  7 a title that states a conclusion ("different from production", "regression", "broken") that rule 3 has not proved.
"""
import json, os, sys, re, tempfile, shutil
from datetime import date

ZONES = ('location_tz', 'browser_tz', 'app_tz_setting', 'session_tz')
FIELDS = ('environment', 'build', 'location') + ZONES + ('observed_on', 'screenshots')


def check(folder):
    errs = []
    p = os.path.join(folder, 'COMPARISON.json')
    if not os.path.exists(p):
        return [f'no COMPARISON.json in {folder} (make one with --template)']
    try:
        c = json.load(open(p))
    except Exception as e:
        return [f'COMPARISON.json is not valid JSON: {e}']
    sides = c.get('sides') or {}
    for name in ('test', 'reference'):
        s = sides.get(name) or {}
        for f in FIELDS:
            if not s.get(f):
                errs.append(f'1/2: {name} side has no "{f}"')
        for shot in s.get('screenshots') or []:
            if not os.path.exists(os.path.join(folder, shot)) and not os.path.exists(shot):
                errs.append(f'2: {name} screenshot not found: {shot}')
    t, r = sides.get('test') or {}, sides.get('reference') or {}
    for f in ('location',) + ZONES:
        if t.get(f) and r.get(f) and str(t[f]).strip().lower() != str(r[f]).strip().lower():
            errs.append(f'1: the two sides differ on {f} ({t[f]} vs {r[f]}) - compare like with like')
    text = (c.get('claim', '') + ' ' + c.get('title', '')).lower()
    prod_ok = False
    try:
        gap = abs((date.fromisoformat(str(t.get('observed_on'))[:10]) - date.fromisoformat(str(r.get('observed_on'))[:10])).days)
        prod_ok = 'production' in str(r.get('environment', '')).lower() and gap <= 1
    except Exception:
        gap = None
    if 'production' in text and not prod_ok:
        errs.append('3: the claim/title names production, but the reference side is not production observed on screen within 1 day of the test side')
    if re.search(r'different from production|differs from production|regression|broken', c.get('title', ''), re.I) and not prod_ok:
        errs.append('7: the title states a conclusion that was not observed on production - say what the screen shows instead')
    cs = c.get('contradicting_statements')
    if cs is None:
        errs.append('4: "contradicting_statements" missing - list every developer/PO statement that disagrees, or [] after looking')
    else:
        for x in cs:
            if not str(x.get('resolved_by', '')).strip():
                errs.append(f'4: statement by {x.get("who", "?")} not resolved - observe the reference side first, never overrule with our data')
    d = c.get('disprove_attempt')
    if not d or not os.path.exists(os.path.join(folder, d)) or os.path.getsize(os.path.join(folder, d)) < 40:
        errs.append('5: no attempt to prove the finding wrong (disprove_attempt file missing or empty)')
    j = c.get('jira_search') or {}
    if not j.get('jql') or not j.get('read_every_result'):
        errs.append('6: no Jira search of recent tickets from this login on the same feature (or results not read)')
    if c.get('latest_results_read') is None:
        errs.append('6: "latest_results_read" missing - read each affected test\'s newest result first ([] if none)')
    return errs


TEMPLATE = {'claim': '', 'title': '', 'sides': {k: {f: ([] if f == 'screenshots' else '') for f in FIELDS} for k in ('test', 'reference')},
            'contradicting_statements': [], 'disprove_attempt': 'DISPROVE.md', 'jira_search': {'jql': '', 'date': '', 'read_every_result': False},
            'latest_results_read': []}


def selftest():
    d = tempfile.mkdtemp()
    try:
        open(os.path.join(d, 'a.png'), 'wb').write(b'x'); open(os.path.join(d, 'b.png'), 'wb').write(b'x')
        open(os.path.join(d, 'DISPROVE.md'), 'w').write('Looked at production at the same location with the same app time-zone setting; same values.')
        side = lambda env: {'environment': env, 'build': 'v1', 'location': 'Lethbridge', 'location_tz': 'America/Edmonton', 'browser_tz': 'America/Edmonton',
                            'app_tz_setting': 'America/Edmonton', 'session_tz': 'America/Edmonton', 'observed_on': '2026-11-18', 'screenshots': ['a.png' if env != 'production' else 'b.png']}
        good = {'claim': 'staging shows Aug 16, production shows Aug 17', 'title': 'Bill date shows Aug 16 on A/P Aging Detail',
                'sides': {'test': side('staging'), 'reference': side('production')}, 'contradicting_statements': [],
                'disprove_attempt': 'DISPROVE.md', 'jira_search': {'jql': 'x', 'date': '2026-11-18', 'read_every_result': True}, 'latest_results_read': []}
        json.dump(good, open(os.path.join(d, 'COMPARISON.json'), 'w'))
        ok_good = check(d) == []
        bad = json.loads(json.dumps(good)); bad['sides']['reference']['environment'] = 'staging before copy'; bad['sides']['reference']['app_tz_setting'] = 'UTC'
        bad['title'] = 'Dates Different From Production'; bad['contradicting_statements'] = [{'who': 'developer', 'resolved_by': ''}]
        json.dump(bad, open(os.path.join(d, 'COMPARISON.json'), 'w'))
        e = check(d)
        want = ['1:', '3:', '7:', '4:']
        ok_bad = all(any(x.startswith(w) for x in e) for w in want)
        print('selftest: accepts a complete comparison:', ok_good, '| refuses the SV-12853 shape (zones, production, title, unresolved statement):', ok_bad)
        return 0 if ok_good and ok_bad else 1
    finally:
        shutil.rmtree(d, ignore_errors=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['--selftest']:
        sys.exit(selftest())
    if a[:1] == ['--template'] and len(a) == 2:
        os.makedirs(a[1], exist_ok=True); p = os.path.join(a[1], 'COMPARISON.json')
        if os.path.exists(p): sys.exit(f'{p} exists - not overwritten')
        json.dump(TEMPLATE, open(p, 'w'), indent=1); print('wrote', p); sys.exit(0)
    if a[:1] == ['--check'] and len(a) == 2:
        errs = check(a[1])
        for x in errs: print('REFUSED', x)
        print('comparison gate:', 'PASS' if not errs else f'{len(errs)} problem(s) - no ticket, no ask, no Failed result on this finding')
        sys.exit(0 if not errs else 1)
    print(__doc__); sys.exit(2)
