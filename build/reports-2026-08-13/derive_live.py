#!/usr/bin/env python3
"""Live derivation for the Rule-67 completion reports (Filters + Schedule), 2026-08-13.

READ-ONLY: TestRail get_* only. Zero Jira. Zero app access. Zero writes.
Credentials read from /tmp/testrail/creds.json (never committed).
Every URL uses '&' inside the /api/v2 path (core 00 §3.3); everything paged
(unpaged get_sections returns 250 of 625 and silently finds nothing — §3.3).

Outputs a JSON summary per project into this folder (committed as working).
"""
import json, re, sys, csv, glob, datetime, urllib.request, base64, collections

CREDS = json.load(open('/tmp/testrail/creds.json'))
HOST = CREDS['host'].rstrip('/')
AUTH = base64.b64encode(f"{CREDS.get('email') or CREDS.get('user')}:{CREDS['password']}".encode()).decode()

def api(path):
    # path like 'get_sections/1&suite_id=1' -- ampersand-only inside the query
    url = f"{HOST}/index.php?/api/v2/{path}"
    req = urllib.request.Request(url, headers={'Authorization': f'Basic {AUTH}', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())

def paged(path, key):
    out, offset = [], 0
    while True:
        d = api(f"{path}&limit=250&offset={offset}")
        chunk = d[key] if isinstance(d, dict) else d
        out.extend(chunk)
        if isinstance(d, dict) and d.get('_links', {}).get('next'):
            offset += 250
        else:
            break
    return out

READ_AT = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')
print(f"READ_AT {READ_AT}", flush=True)

# --- statuses (derive names live, nothing transcribed) ---
statuses = {s['id']: s['name'] for s in api('get_statuses')}

# --- sections: full paged read, build subtree per group ---
sections = paged('get_sections/1&suite_id=1', 'sections')
print(f"sections total {len(sections)}", flush=True)
children = collections.defaultdict(list)
for s in sections:
    children[s.get('parent_id')].append(s['id'])

def subtree(root):
    out, stack = set(), [root]
    while stack:
        n = stack.pop(); out.add(n); stack.extend(children.get(n, []))
    return out

# --- all cases, paged once ---
cases = paged('get_cases/1&suite_id=1', 'cases')
print(f"cases total {len(cases)}", flush=True)

MARKER_RE = re.compile(r'AUTOMATION:\s*(READY - EXPECT FAIL \((SV-\d+)\)|READY|HOLD\b[^\n]*)')
S2_RE = re.compile(r'[Ll]ast checked against (?:the )?build\s+(\S+?)\s+on\s+([0-9A-Za-z /]+)')
READDATE_RE = re.compile(r'read on\s+([0-9]{1,2}\s+\w+\s+[0-9]{4}|[0-9]{1,2}/[0-9]{1,2}/[0-9]{4})')
SPECPIN_RE = re.compile(r'(?:specification (?:at Confluence )?version|Confluence version)\s+(\d+)')

def analyse(project, group_root, run_id, idmap_path, import_path, cases_dir):
    secs = subtree(group_root)
    live = [c for c in cases if c.get('section_id') in secs]
    ours = [c for c in live if c.get('created_by') == 3]
    foreign = [c for c in live if c.get('created_by') != 3]
    res = {'project': project, 'read_at': READ_AT, 'group': group_root, 'run': run_id,
           'live_total': len(live), 'ours': len(ours),
           'foreign': [{'id': c['id'], 'created_by': c['created_by'], 'title': c['title']} for c in foreign]}
    # markers + provenance on OUR cases
    m_ready, m_ef, m_hold, m_none = [], [], [], []
    src_ok, src_miss = [], []
    builds = collections.Counter(); no_stamp = []
    hold_reasons = {}; ef_tickets = {}
    pins = collections.Counter(); readdates = collections.Counter()
    for c in ours:
        exp = c.get('custom_expected') or ''
        mm = list(MARKER_RE.finditer(exp))
        if not mm: m_none.append(c['id'])
        else:
            t = mm[-1].group(1)
            if t.startswith('READY - EXPECT FAIL'):
                m_ef.append(c['id']); ef_tickets[c['id']] = mm[-1].group(2)
            elif t.startswith('READY'): m_ready.append(c['id'])
            else:
                m_hold.append(c['id']); hold_reasons[c['id']] = t[:160]
        s2 = S2_RE.search(exp)
        if s2: builds[(s2.group(1), s2.group(2).strip())] += 1
        else: no_stamp.append(c['id'])
        rd = READDATE_RE.search(exp); pin = SPECPIN_RE.search(exp)
        if rd and pin:
            src_ok.append(c['id']); pins[pin.group(1)] += 1; readdates[rd.group(1)] += 1
        else: src_miss.append(c['id'])
    res.update(marker_ready=len(m_ready), marker_expect_fail=len(m_ef), marker_hold=len(m_hold),
               marker_none=m_none, gate_a=len(m_ready)+len(m_ef), gate_b=len(ours)-len(m_hold),
               expect_fail_tickets=ef_tickets, hold_reasons=hold_reasons,
               source_verified=len(src_ok), source_missing=src_miss,
               spec_pins=dict(pins), read_dates=dict(readdates),
               build_stamps={f"{b} on {d}": n for (b, d), n in builds.most_common()},
               no_build_stamp=no_stamp)
    # run sync + grading
    run = api(f'get_run/{run_id}')
    tests = paged(f'get_tests/{run_id}', 'tests')
    results = paged(f'get_results_for_run/{run_id}', 'results')
    run_case_ids = {t['case_id'] for t in tests}
    live_ids = {c['id'] for c in live}
    grading = collections.Counter(statuses.get(t['status_id'], t['status_id']) for t in tests)
    res.update(run_include_all=run['include_all'], run_tests=len(tests),
               in_run_not_suite=sorted(run_case_ids - live_ids), in_suite_not_run=sorted(live_ids - run_case_ids),
               run_results_records=len(results), grading=dict(grading),
               run_counts_check={k: run.get(k) for k in ('passed_count','failed_count','blocked_count','retest_count','untested_count')})
    # id-map + import set equality
    idmap_cids, idmap_blank = set(), 0
    with open(idmap_path) as f:
        for row in csv.DictReader(f):
            v = (row.get('testrail_case_id') or '').strip().lstrip('C')
            if v: idmap_cids.add(int(v))
            else: idmap_blank += 1
    ours_ids = {c['id'] for c in ours}
    with open(import_path) as f:
        import_rows = sum(1 for _ in csv.DictReader(f))
    res.update(idmap_rows=len(idmap_cids)+idmap_blank, idmap_blank=idmap_blank,
               idmap_minus_live=sorted(idmap_cids - ours_ids), live_minus_idmap=sorted(ours_ids - idmap_cids),
               import_rows=import_rows)
    # local active bodies
    local = 0; retired = 0
    for fp in glob.glob(f'{cases_dir}/cases-*.json'):
        for b in json.load(open(fp)):
            if isinstance(b, dict) and ('retired' in (str(b.get('status','')) + str(b.get('viu_status',''))).lower() or b.get('retired')):
                retired += 1
            else: local += 1
    res.update(local_bodies_active=local, local_bodies_retired=retired)
    return res

out = {}
out['filters'] = analyse('Filters', 4110, 352, 'build/filters/testrail-id-map.csv',
                         'testrail-import/filters-v1-testrail-import.csv', 'build/filters/cases')
out['schedule'] = analyse('Schedule', 4254, 357, 'build/schedule/testrail-id-map.csv',
                          'testrail-import/schedule-v1-testrail-import.csv', 'build/schedule/cases')
with open('build/reports-2026-08-13/live-derivation.json', 'w') as f:
    json.dump(out, f, indent=1)
for p, r in out.items():
    print(f"\n== {p} == live {r['live_total']} ours {r['ours']} | READY {r['marker_ready']} EF {r['marker_expect_fail']} HOLD {r['marker_hold']} none {r['marker_none']} | gate {r['gate_a']}=={r['gate_b']} | src {r['source_verified']} | run tests {r['run_tests']} sync {not r['in_run_not_suite'] and not r['in_suite_not_run']} | grading {r['grading']}")
