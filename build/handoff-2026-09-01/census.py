#!/usr/bin/env python3
"""Marker census + run set-equality proof for the two suites being handed over.

G7 of skill 04: GENERATE the numbers, never transcribe them. Everything the brief states comes from
this script and holds.py, read LIVE from TestRail.

Core §3.3 trap: get_sections and get_cases must be PAGED - an unpaged call returns 250 and silently
finds nothing.
"""
import json, base64, urllib.request, re, html, collections, os, time

C = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
BASE = 'https://shopview.testrail.io/index.php?/api/v2/'
def get(p, tries=6):
    # The agent proxy resets a connection now and then. Every figure in the brief comes from this
    # script, so it must not die halfway and leave a half-written census behind (measured 2026-09-01:
    # "Connection reset by peer" mid-run).
    for a in range(tries):
        try:
            r = urllib.request.Request(BASE + p, headers={'Authorization': 'Basic ' + AUTH})
            return json.load(urllib.request.urlopen(r, timeout=180))
        except Exception:
            if a == tries - 1: raise
            time.sleep(2 ** a)
def paged(p, key):
    out, off = [], 0
    while True:
        j = get(f'{p}&limit=250&offset={off}')
        chunk = j[key] if isinstance(j, dict) else j
        out += chunk
        if len(chunk) < 250: break
        off += 250
    return out
def txt(h):
    if not h: return ''
    s = re.sub(r'<(br|/p|/li|/div|hr)[^>]*>', '\n', h)
    return html.unescape(re.sub(r'<[^>]+>', '', s))

SUITES = {
 'Inline Add and Edit Parts': {'sections': [6755, 6756, 6757, 6758, 6759, 6760, 6771], 'run': 418},
 'Printer Friendly Work Orders': {'sections': [6761, 6762, 6763, 6764, 6765, 6766], 'run': 419},
}
# get_users is 403 for this account, so users are resolved one at a time by id (get_user/<id> DOES
# work - that is how the Invoice pass named a case's author). Only the ids that actually appear are
# looked up, so this is a couple of calls, not a directory dump.
_UCACHE = {}
def user(uid):
    if uid not in _UCACHE:
        try: _UCACHE[uid] = get(f'get_user/{uid}')['name']
        except Exception: _UCACHE[uid] = f'user {uid}'
    return _UCACHE[uid]
out = {}
for name, meta in SUITES.items():
    cases = []
    for s in meta['sections']:
        cases += paged(f'get_cases/1&section_id={s}', 'cases')
    markers = collections.Counter()
    per_case = {}
    for c in cases:
        e = txt(c.get('custom_expected') or '')
        m = re.search(r'AUTOMATION:[^\n]*', e)
        mk = m.group(0).strip() if m else 'NO MARKER'
        markers[mk] += 1
        per_case[c['id']] = {'title': c['title'], 'marker': mk,
                             'author': user(c['created_by']),
                             'automated': c.get('custom_atmstatus') == 3,
                             'foreign': c['created_by'] != 3,
                             'build_sentence': 'Last checked against build' in e}
    tests = paged(f"get_tests/{meta['run']}", 'tests')
    case_ids = {c['id'] for c in cases}
    test_case_ids = {t['case_id'] for t in tests}
    # 🛑 THE ARITHMETIC GATE IS TAKEN OVER THE CASES IN SCOPE, AND THE EXCLUSION IS NAMED.
    # A case that was deliberately NOT written - foreign (Rule 38) or Automated without a per-case
    # go-ahead (Rule 71) - still exists in the suite, so counting it in the denominator makes the gate
    # fail for a reason that has nothing to do with the markers. G4 of skill 04 already requires
    # foreign cases to be excluded from every count AND the exclusion to be stated; the same applies
    # to a held Automated case. The gate is therefore shown twice: over the suite, and over scope.
    excluded, why_each = [], {}
    for c in cases:
        if c['created_by'] != 3:
            excluded.append(c['id'])
            why_each[c['id']] = f"foreign — written by {user(c['created_by'])} (Rule 38)"
        elif c.get('custom_atmstatus') == 3 and re.search(
                r'AUTOMATION: READY', txt(c.get('custom_expected') or '')) is None:
            excluded.append(c['id'])
            why_each[c['id']] = 'flagged Automated and no per-case go-ahead given (Rule 71)'
    excluded = sorted(excluded)
    in_scope = [c for c in cases if c['id'] not in excluded]
    scope_markers = collections.Counter()
    for c in in_scope:
        m = re.search(r'AUTOMATION:[^\n]*', txt(c.get('custom_expected') or ''))
        scope_markers[m.group(0).strip() if m else 'NO MARKER'] += 1
    ready = scope_markers.get('AUTOMATION: READY', 0)
    expfail = sum(v for k, v in scope_markers.items() if 'EXPECT FAIL' in k)
    hold = sum(v for k, v in scope_markers.items() if 'HOLD' in k)
    total = sum(scope_markers.values())
    out[name] = {
        'cases_total': len(cases),
        'ours': sum(1 for v in per_case.values() if not v['foreign']),
        'foreign': {user(c['created_by']): 1 for c in cases if c['created_by'] != 3},
        'foreign_ids': [c['id'] for c in cases if c['created_by'] != 3],
        'automated_ids': [cid for cid, v in per_case.items() if v['automated']],
        'markers': dict(markers),
        'arithmetic': {'ready': ready, 'expect_fail': expfail, 'hold': hold, 'total': total,
                       'ready_plus_expectfail': ready + expfail, 'total_minus_hold': total - hold,
                       'closes': ready + expfail == total - hold,
                       'excluded_from_the_gate': excluded,
                       'why_excluded': '; '.join(f'C{k}: {v}' for k, v in sorted(why_each.items())),
                       'suite_total_including_excluded': sum(markers.values())},
        'run': {'id': meta['run'], 'tests': len(tests),
                'set_equal_to_cases': case_ids == test_case_ids,
                'in_cases_not_in_run': sorted(case_ids - test_case_ids),
                'in_run_not_in_cases': sorted(test_case_ids - case_ids),
                'results_already_recorded': [
                    {'case_id': t['case_id'], 'status_id': t['status_id']}
                    for t in tests if t.get('status_id') not in (3, None)  # 3 = Untested
                ]},
        'without_build_sentence': sorted(cid for cid, v in per_case.items() if not v['build_sentence']),
        'per_case': per_case,
    }
os.makedirs('/tmp/handoff', exist_ok=True)
json.dump(out, open('/tmp/handoff/census.json', 'w'), indent=1)
for name, d in out.items():
    a = d['arithmetic']; r = d['run']
    print(f"\n=== {name}")
    print(f"  cases {d['cases_total']} (ours {d['ours']}, foreign {len(d['foreign_ids'])} {d['foreign']})")
    print(f"  markers: {d['markers']}")
    print(f"  ARITHMETIC GATE, BOTH WAYS, over the {a['total']} cases in scope:")
    print(f"     READY {a['ready']} + EXPECT-FAIL {a['expect_fail']} = {a['ready_plus_expectfail']}"
          f"   |   total {a['total']} - HOLD {a['hold']} = {a['total_minus_hold']}"
          f"   ->  {'CLOSES' if a['closes'] else 'DOES NOT CLOSE'}")
    print(f"     excluded from the gate and why: {a['excluded_from_the_gate']} - {a['why_excluded']}")
    print(f"     suite total including those: {a['suite_total_including_excluded']}")
    print(f"  run {r['id']}: {r['tests']} tests | set-equal to the cases: {r['set_equal_to_cases']}")
    if r['in_cases_not_in_run']: print(f"     cases missing from the run: {r['in_cases_not_in_run']}")
    if r['in_run_not_in_cases']: print(f"     tests in the run with no case: {r['in_run_not_in_cases']}")
    print(f"     results already recorded: {len(r['results_already_recorded'])} {r['results_already_recorded'][:6]}")
    print(f"  automated (Rule 71): {d['automated_ids']}")
    print(f"  no build sentence (this pass could not observe them): {d['without_build_sentence']}")
