#!/usr/bin/env python3
"""Reconcile each project's LOCAL id-map against the LIVE TestRail group, READ-ONLY.

Set equality on titles in BOTH directions (Rule 50: two sets of the same size can
differ), then emit the proposed internal_id -> C-ID mapping as evidence. NO WRITES
to TestRail and no edit to any id-map -- this only proposes the mapping.
"""
import json, base64, urllib.request, csv, collections, sys, os

C = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
BASE = C['host'] + '/index.php?/api/v2/'

def get(p):
    r = urllib.request.Request(BASE + p)
    r.add_header('Authorization', 'Basic ' + AUTH); r.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(r, timeout=60) as x: return json.loads(x.read().decode())

def paged(p, k):
    out, off = [], 0
    while True:
        d = get(f"{p}&limit=250&offset={off}")
        ch = d[k] if isinstance(d, dict) else d
        if not ch: break
        out.extend(ch)
        if len(ch) < 250: break
        off += 250
    return out

PROJ = {
    6658: ("Digital Inspections V2", "digital-inspections-v2"),
    6720: ("Global Search V2",       "global-search"),
    6665: ("Simple Flow V2",         "simple-flow-v2"),
    6559: ("Invoice Refresh",        "invoice-ui-refresh"),
    6597: ("Inline Add and Edit Parts","inline-add-edit-parts"),
    6617: ("Printer Friendly Work Orders","printer-friendly-wo"),
}

sections = paged("get_sections/1&suite_id=1", "sections")
kids = collections.defaultdict(list)
for s in sections: kids[s.get('parent_id')].append(s['id'])
def subtree(r):
    seen, st = [], [r]
    while st:
        n = st.pop(); seen.append(n); st.extend(kids.get(n, []))
    return seen
cases = paged("get_cases/1&suite_id=1", "cases")
bysec = collections.defaultdict(list)
for c in cases: bysec[c['section_id']].append(c)

def norm(t): return ' '.join((t or '').split()).strip().lower()

summary = {}
mapping_out = {}
for gid, (label, slug) in PROJ.items():
    live = [c for s in subtree(gid) for c in bysec.get(s, [])]
    live_by_title = collections.defaultdict(list)
    for c in live: live_by_title[norm(c['title'])].append(c['id'])

    path = f'build/{slug}/testrail-id-map.csv'
    local = []
    with open(path, newline='') as f:
        for row in csv.DictReader(f): local.append(row)
    local_titles = collections.Counter(norm(r['title']) for r in local)

    only_local = sorted(t for t in local_titles if t not in live_by_title)
    only_live  = sorted(t for t in live_by_title if t not in local_titles)
    dup_live   = {t: v for t, v in live_by_title.items() if len(v) > 1}

    matched = []
    for r in local:
        t = norm(r['title'])
        ids = live_by_title.get(t, [])
        if len(ids) == 1:
            matched.append((r['internal_id'], ids[0], r['title']))
    mapping_out[slug] = matched

    summary[gid] = {
        "project": label, "slug": slug,
        "local_rows": len(local), "live_cases": len(live),
        "matched_1to1": len(matched),
        "only_local_count": len(only_local), "only_live_count": len(only_live),
        "ambiguous_dup_titles_live": len(dup_live),
        "set_equal_both_ways": (not only_local and not only_live),
        "only_local_sample": only_local[:3], "only_live_sample": only_live[:3],
        "cid_min": min((i for _, i, _ in matched), default=None),
        "cid_max": max((i for _, i, _ in matched), default=None),
        "local_cid_column_populated": sum(1 for r in local if (r.get('testrail_case_id') or '').strip().isdigit()),
    }

os.makedirs('build/build-verify-session-2026-08-21/evidence', exist_ok=True)
json.dump(summary, open('build/build-verify-session-2026-08-21/evidence/reconcile-summary.json','w'), indent=2)
for slug, m in mapping_out.items():
    with open(f'build/build-verify-session-2026-08-21/evidence/proposed-cid-map-{slug}.csv','w',newline='') as f:
        w = csv.writer(f); w.writerow(['internal_id','proposed_testrail_case_id','title'])
        w.writerows(m)

print(f"{'GROUP':>6} {'PROJECT':<30} {'LOCAL':>5} {'LIVE':>5} {'1:1':>5} {'ONLY-LOC':>8} {'ONLY-LIVE':>9} {'EQUAL':>6} {'C-ID RANGE':>17} {'LOCAL C-IDs':>11}")
for gid, s in summary.items():
    print(f"{gid:>6} {s['project']:<30} {s['local_rows']:>5} {s['live_cases']:>5} {s['matched_1to1']:>5} "
          f"{s['only_local_count']:>8} {s['only_live_count']:>9} {str(s['set_equal_both_ways']):>6} "
          f"{str(s['cid_min'])+'-'+str(s['cid_max']):>17} {s['local_cid_column_populated']:>11}")
print()
for gid, s in summary.items():
    if not s['set_equal_both_ways']:
        print(f"  {s['project']}: only-local e.g. {s['only_local_sample']}")
        print(f"  {s['project']}: only-live  e.g. {s['only_live_sample']}")
