#!/usr/bin/env python3
"""Verify the QA lead's six TestRail parent-folder (group) links resolve, READ-ONLY.

For each group_id: confirm the section exists, name it, walk its FULL descendant
subtree, and count cases -- ours (created_by=3) vs foreign -- plus the AUTOMATION
marker mix and the Automated (custom_atmstatus=3) count.

Traps honoured (00-COMMON-CORE 3.3): the /api/v2 path already sits inside
index.php?, so every extra parameter joins with '&', never a second '?';
get_sections and get_cases BOTH need paging and fail SILENTLY when unpaged
(625+ sections exist; an unpaged call returns 250 and finds zero).

NO WRITES. get_* only. Rule 6: nothing is created, updated or deleted.
"""
import json, base64, urllib.request, urllib.error, sys, collections

C = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
BASE = C['host'] + '/index.php?/api/v2/'

def get(path):
    req = urllib.request.Request(BASE + path)
    req.add_header('Authorization', 'Basic ' + AUTH)
    req.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())

def paged(path, key):
    """Page with '&' unconditionally. Stop on a short page or an empty page."""
    out, offset = [], 0
    while True:
        d = get(f"{path}&limit=250&offset={offset}")
        chunk = d[key] if isinstance(d, dict) else d
        if not chunk:
            break
        out.extend(chunk)
        if len(chunk) < 250:
            break
        offset += 250
    return out

GROUPS = {
    6658: "Digital Inspections V2",
    6720: "Global Search V2",
    6665: "Simple Flow V2",
    6559: "Invoice Refresh",
    6597: "Inline Add and Edit Parts",
    6617: "Printer Friendly Work Orders",
}

print("fetching all sections (paged)...", file=sys.stderr)
sections = paged("get_sections/1&suite_id=1", "sections")
print(f"  {len(sections)} sections total in the estate", file=sys.stderr)
by_id = {s['id']: s for s in sections}
kids = collections.defaultdict(list)
for s in sections:
    kids[s.get('parent_id')].append(s['id'])

def subtree(root):
    seen, stack = [], [root]
    while stack:
        n = stack.pop()
        seen.append(n)
        stack.extend(kids.get(n, []))
    return seen

print("fetching all cases (paged)...", file=sys.stderr)
cases = paged("get_cases/1&suite_id=1", "cases")
print(f"  {len(cases)} cases total in the estate", file=sys.stderr)
by_section = collections.defaultdict(list)
for c in cases:
    by_section[c['section_id']].append(c)

report = {}
for gid, label in GROUPS.items():
    if gid not in by_id:
        report[gid] = {"label": label, "resolves": False,
                       "error": "group_id not present in the paged section list"}
        continue
    ids = subtree(gid)
    grp_cases = [c for s in ids for c in by_section.get(s, [])]
    ours = [c for c in grp_cases if c.get('created_by') == 3]
    foreign = [c for c in grp_cases if c.get('created_by') != 3]
    markers = collections.Counter()
    for c in ours:
        exp = (c.get('custom_expected') or '')
        if 'AUTOMATION: READY - EXPECT FAIL' in exp:      markers['READY-EXPECT-FAIL'] += 1
        elif 'AUTOMATION: READY' in exp:                  markers['READY'] += 1
        elif 'AUTOMATION: HOLD' in exp:                   markers['HOLD'] += 1
        elif 'Not available on Build to test Yet' in exp: markers['NOT-ON-BUILD-YET'] += 1
        else:                                             markers['NO-MARKER'] += 1
    report[gid] = {
        "label": label, "resolves": True,
        "section_name": by_id[gid]['name'],
        "parent_id": by_id[gid].get('parent_id'),
        "descendant_sections": len(ids) - 1,
        "cases_total_live": len(grp_cases),
        "cases_ours": len(ours),
        "cases_foreign": len(foreign),
        "automated_atm3": sum(1 for c in grp_cases if c.get('custom_atmstatus') == 3),
        "markers_ours": dict(markers),
        "case_id_min": min((c['id'] for c in grp_cases), default=None),
        "case_id_max": max((c['id'] for c in grp_cases), default=None),
    }

out = {"estate_sections": len(sections), "estate_cases": len(cases), "groups": report}
with open('build/build-verify-session-2026-08-21/parent-folder-verification.json', 'w') as f:
    json.dump(out, f, indent=2)

print(f"\n{'GROUP':>6}  {'PROJECT':<30} {'SECTIONS':>8} {'LIVE':>5} {'OURS':>5} {'FOREIGN':>7} {'atm=3':>5}")
for gid, r in report.items():
    if not r['resolves']:
        print(f"{gid:>6}  {r['label']:<30} !! DOES NOT RESOLVE: {r['error']}")
    else:
        print(f"{gid:>6}  {r['label']:<30} {r['descendant_sections']:>8} "
              f"{r['cases_total_live']:>5} {r['cases_ours']:>5} {r['cases_foreign']:>7} {r['automated_atm3']:>5}")
print("\nmarker mix (ours only):")
for gid, r in report.items():
    if r['resolves']:
        print(f"  {gid} {r['label']:<30} name={r['section_name']!r} markers={r['markers_ours']}")
