#!/usr/bin/env python3
"""Enumerate LIVE every ticket WE created against epic SV-8582 and its stories.

Read-only. Three independent routes, then the union, so no single query's blind
spot decides the population (Rule 17 / Rule 50 exhaustiveness).
  R1  direct children of the epic            (parent = SV-8582)
  R2  children of every story under the epic (parent in (<story keys>))
  R3  everything we created in project SV that links to the epic or a story
Plus R4: re-verify every Report Suite key in the 2026-08-06 type audit.
"""
import json, sys, os, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import jiralib as J

EPIC = 'SV-8582'
ME = '712020:6d590212-5c9b-4135-ae11-277f3826110e'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'snapshots')

FIELDS = ('key,summary,status,resolution,issuetype,parent,priority,creator,reporter,assignee,'
          'labels,issuelinks,customfield_10153,description,attachment,created,updated,project')


def jql(q, fields=FIELDS):
    """Fully paged JQL search. Returns list of issues."""
    out, token = [], None
    while True:
        body = {'jql': q, 'maxResults': 100, 'fields': fields.split(',')}
        if token:
            body['nextPageToken'] = token
        code, d = J.post('/rest/api/3/search/jql', body, out='/tmp/_rf_jql.json')
        if code != '200':
            raise SystemExit(f'JQL {code} for {q}: {str(d)[:400]}')
        out += d.get('issues', [])
        token = d.get('nextPageToken')
        if not token or d.get('isLast'):
            break
    return out


def brief(i):
    f = i['fields']
    return {
        'key': i['key'],
        'summary': f['summary'],
        'status': f['status']['name'],
        'status_category': f['status']['statusCategory']['name'],
        'resolution': (f.get('resolution') or {}).get('name'),
        'issuetype': f['issuetype']['name'],
        'issuetype_id': f['issuetype']['id'],
        'parent': (f.get('parent') or {}).get('key'),
        'parent_type': ((f.get('parent') or {}).get('fields') or {}).get('issuetype', {}).get('name'),
        'priority': (f.get('priority') or {}).get('name'),
        'creator': (f.get('creator') or {}).get('displayName'),
        'creator_id': (f.get('creator') or {}).get('accountId'),
        'reporter': (f.get('reporter') or {}).get('displayName'),
        'assignee': (f.get('assignee') or {}).get('displayName'),
        'labels': f.get('labels') or [],
        'product_area': (f.get('customfield_10153') or {}).get('value') if isinstance(f.get('customfield_10153'), dict) else f.get('customfield_10153'),
        'attachments': [{'id': a['id'], 'filename': a['filename'], 'size': a['size']} for a in (f.get('attachment') or [])],
        'links': [{'type': l['type']['name'],
                   'outward': (l.get('outwardIssue') or {}).get('key'),
                   'inward': (l.get('inwardIssue') or {}).get('key')} for l in (f.get('issuelinks') or [])],
        'created': f.get('created'),
        'updated': f.get('updated'),
    }


def main():
    res = {'epic': EPIC, 'routes': {}}

    # ---- the epic's stories, two independent ways (Rule 37 tier 1)
    kids_a = jql(f'parent = {EPIC} ORDER BY key')
    kids_b = jql(f'"Epic Link" = {EPIC} ORDER BY key')
    ka, kb = {i['key'] for i in kids_a}, {i['key'] for i in kids_b}
    res['epic_children_parent_query'] = sorted(ka)
    res['epic_children_epiclink_query'] = sorted(kb)
    res['epic_children_agree'] = (ka == kb)
    res['epic_children_only_in_parent'] = sorted(ka - kb)
    res['epic_children_only_in_epiclink'] = sorted(kb - ka)

    # A direct epic child is a REQUIREMENT STORY only if it is a Story/Task. The 7 Bugs
    # parented directly to the epic are OUR OWN defect tickets under the pre-2026-08-05
    # convention (Rule 52 history) -- they are population, not stories. Getting this
    # wrong is what made the first run report 58 instead of 65.
    stories = sorted({i['key'] for i in kids_a
                      if i['fields']['issuetype']['name'] in ('Story', 'Task')})
    epic_child_defects = sorted({i['key'] for i in kids_a
                                 if i['fields']['issuetype']['name'] not in ('Story', 'Task')})
    res['stories'] = stories
    res['epic_child_defects'] = epic_child_defects
    res['epic_children_detail'] = [brief(i) for i in sorted(kids_a, key=lambda x: x['key'])]

    # ---- R1 direct children of the epic (defect tickets only; stories are not population)
    r1 = {i['key']: brief(i) for i in kids_a if i['key'] in set(epic_child_defects)}

    # ---- R2 children of every story
    r2 = {}
    for chunk in [stories[i:i + 40] for i in range(0, len(stories), 40)]:
        lst = ','.join(chunk)
        for i in jql(f'parent in ({lst}) ORDER BY key'):
            r2[i['key']] = brief(i)

    # ---- R3 anything we created in SV linking to the epic or one of its stories
    r3 = {}
    allkeys = [EPIC] + stories
    for chunk in [allkeys[i:i + 40] for i in range(0, len(allkeys), 40)]:
        lst = ','.join(chunk)
        q = (f'project = SV AND creator = "{ME}" AND issueFunction is not empty') if False else \
            (f'project = SV AND creator = "{ME}" AND (parent in ({lst}) OR issue in linkedIssues({EPIC}))')
        try:
            for i in jql(q):
                r3[i['key']] = brief(i)
        except SystemExit as e:
            res.setdefault('r3_errors', []).append(str(e)[:300])

    res['routes'] = {'R1_epic_children': sorted(r1), 'R2_story_children': sorted(r2),
                     'R3_ours_linked': sorted(r3)}

    # ---- R4 the prior audit's Report Suite keys, re-verified live
    aud = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                      '..', '..', '..', 'ticket-type-audit-2026-08-06', 'type-audit.json')))
    at = aud['tickets']
    arecs = list(at.values()) if isinstance(at, dict) else at
    audit_rs = sorted(r['key'] for r in arecs if r.get('project') == 'Report Suite')
    res['audit_report_suite_keys'] = audit_rs
    res['audit_all_keys'] = sorted(r['key'] for r in arecs)

    r4 = {}
    for chunk in [audit_rs[i:i + 40] for i in range(0, len(audit_rs), 40)]:
        for i in jql(f"key in ({','.join(chunk)})"):
            r4[i['key']] = brief(i)
    res['routes']['R4_audit_reverified'] = sorted(r4)

    # ---- R5 keys mined from our own committed records under build/report-suite/**
    import subprocess
    g = subprocess.run(['grep','-rhoE',r'SV-8[0-9]{3}','../../../report-suite/'],
                       capture_output=True, text=True).stdout.split()
    mined = sorted(set(g) - {EPIC} - set(stories))
    r5 = {}
    for chunk in [mined[i:i+40] for i in range(0,len(mined),40)]:
        for i in jql(f"key in ({','.join(chunk)})"):
            b = brief(i)
            if b['creator_id'] == ME:
                r5[i['key']] = b
    res['routes']['R5_mined_from_records'] = sorted(r5)
    res['r5_mined_candidates'] = mined

    # ---- union, ours only
    merged = {}
    for src, d in (('R1', r1), ('R2', r2), ('R3', r3), ('R4', r4), ('R5', r5)):
        for k, v in d.items():
            merged.setdefault(k, dict(v, found_by=[]))
            merged[k]['found_by'].append(src)

    ours, foreign = {}, {}
    for k, v in merged.items():
        if k == EPIC or k in set(stories):
            continue
        (ours if v['creator_id'] == ME else foreign)[k] = v

    res['ours'] = {k: ours[k] for k in sorted(ours)}
    res['foreign_seen'] = {k: foreign[k] for k in sorted(foreign)}
    res['counts'] = {'stories': len(stories), 'ours': len(ours), 'foreign_seen': len(foreign),
                     'audit_report_suite': len(audit_rs)}
    res['new_since_audit'] = sorted(set(ours) - set(audit_rs))
    res['audit_keys_not_in_live_population'] = sorted(set(audit_rs) - set(ours))

    os.makedirs(OUT, exist_ok=True)
    json.dump(res, open(os.path.join(OUT, 'population.json'), 'w'), indent=1)
    print('epic children:', len(kids_a), '(parent) /', len(kids_b), '(epic link)  agree =', ka == kb)
    print('stories:', len(stories))
    for r, v in res['routes'].items():
        print(f'  {r}: {len(v)}')
    print('OURS (union, excl. epic+stories):', len(ours), ' foreign seen:', len(foreign))
    print('new since audit:', res['new_since_audit'])
    print('audit keys not in live population:', res['audit_keys_not_in_live_population'])


if __name__ == '__main__':
    main()
