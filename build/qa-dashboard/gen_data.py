#!/usr/bin/env python3
"""Build dash-data JSON for the QA dashboard template from raw ticket pulls.

Inputs (in the working dir passed as argv[1], default scratchpad):
  tickets-unique.json   deduped ticket records (see REFRESH-RUNBOOK.md)
  story-epic-map.json   parentStory -> epic map
  asof (argv[2])        snapshot date YYYY-MM-DD
Output: dash-data.json (embed into qa-dashboard-template.html at "__DATA__")
"""
import json, sys
from collections import Counter

W = sys.argv[1] if len(sys.argv) > 1 else '.'
ASOF = sys.argv[2]

FIRST = {'mudassir':'Mudassir Qamar','viktoria':'Viktoria Videnovic','nebojsa':'Nebojsa Glavinic',
'ahtasham':'Ahtasham Amjad','nemanja':'Nemanja Djuric','stefan':'Stefan Vukovic',
'bilal':'Bilal Muzamil','bilalmuzamil':'Bilal Muzamil','ayesha':'Ayesha Khan',
'dusan':'Dusan Bulovan','vladimir':'Vladimir Tomovic'}

def person_from(tok):
    tok = tok.strip('_').lower()
    if not tok: return None
    return FIRST.get(tok.split('_')[0]) or FIRST.get(tok)

# The QA team (used to decide which Tasks count as tickets, and to build the queue tables).
QA_TEAM = {'Bilal Muzamil','Ayesha Khan','Mudassir Qamar','Viktoria Videnovic',
           'Nebojsa Glavinic','Ahtasham Amjad'}

# Statuses that mean QA has FINISHED testing the ticket even though Jira still files them
# under the "In Progress" category. Jira's statusCategory alone under-reports QA progress:
# "QA Complete" is category In Progress, so counting only category==Done would show a
# finished ticket as still in the pipeline. Ticket field 'fin' = QA-finished.
FINISHED_STATUSES = {'QA Complete', 'Ready for Production'}
# Optional sidecar {issueKey: ISO timestamp} = when a finished status was reached, from the
# changelog. Needed because statuscategorychangedate does NOT move for a status change that
# stays inside the same category (Ready for QA -> TESTING QA -> QA Complete are all one).
try:
    finish_dates = json.load(open(f'{W}/finish-dates.json'))
except Exception:
    finish_dates = {}

recs = json.load(open(f'{W}/tickets-unique.json'))
semap = json.load(open(f'{W}/story-epic-map.json'))

epics, out = {}, []
variants = Counter(); mismatch = 0; bare = 0; lower = 0; inprog = 0
for r in recs:
    ep = en = None
    if r['parentType'] == 'Epic':
        ep, en = r['parent'], r['parentSummary']
    elif r['parent'] and r['parent'] in semap and semap[r['parent']]['epic']:
        ep, en = semap[r['parent']]['epic'], semap[r['parent']]['epicSummary']
    if ep: epics[ep] = en or ep
    lc, lip, sv, rj = [], [], False, False
    for l in r['labels']:
        ll = l.lower()
        if ll.startswith('qacomplete'):
            p = person_from(l[len('qacomplete'):])
            variants[l] += 1
            if not l.startswith('QAComplete'): lower += 1
            if p: lc.append(p)
            else: bare += 1
        elif ll.endswith('_inprogress') or ll.startswith('inprogress_'):
            raw = l[:-len('_inprogress')] if ll.endswith('_inprogress') else l[len('inprogress_'):]
            p = person_from(raw)
            inprog += 1
            if p: lip.append(p)
        elif ll == 'staging_verified': sv = True
        elif ll == 'rejected_staging': rj = True
        elif ll.startswith('prod_verified'):
            p = person_from(l[len('prod_verified'):])
            if p: lc.append(p)
    if lc and r['qa'] and not set(lc) & set(r['qa']): mismatch += 1
    # QA-finished = Jira category Done (folds in Obsolete/Duplicate) OR an explicit
    # QA-finished status. dn = when that happened (changelog sidecar wins; it is the only
    # accurate source for in-category transitions such as -> QA Complete).
    fin = r['statusCat'] == 'Done' or r['status'] in FINISHED_STATUSES
    dn = (finish_dates.get(r['key']) or r['catchange']) if fin else None
    # A "defect ticket" for coverage = Bug / Story Defect, OR a Task raised by a QA member.
    is_defect = r['type'] in ('Bug', 'Story Defect') or (r['type'] == 'Task' and r['reporter'] in QA_TEAM)
    out.append({'k':r['key'],'s':r['summary'][:96],'st':r['status'],'ty':r['type'],
        'pr':r['priority'],'ep':ep,'qa':r['qa'],'rep':r['reporter'],'as':r.get('assignee'),
        'lc':sorted(set(lc)),'lip':sorted(set(lip)),'sv':sv,'rj':rj,'cr':r['created'],
        'up':r['updated'],'dn':dn,'cat':r['statusCat'],'dz':is_defect,'fin':fin})

per_person = Counter()
for lbl, n in variants.items():
    p = person_from(lbl[len('qacomplete'):]) if lbl.lower().startswith('qacomplete') else None
    if p: per_person[p.split(' ')[0]] += n

# Per-epic start date = earliest created of ANY ticket in the epic (its real start), falling
# back to its first Bug/Story Defect. The order used to be the other way round because the
# pull was QA-filtered, so the first defect was the first thing we saw; on a whole-epic pull
# the first ticket is the honest start date and using the first defect would hide the weeks
# of story work that came before it.
# Known QA-handoff overrides win (data-derived value matches, but keep it explicit).
EPIC_HANDOFF = {'SV-7388': '2026-06-17'}   # Custom Roles & Permissions handed to QA 17 Jun 2026
defect_min, any_min = {}, {}
for t in out:
    ek = t['ep']
    if not ek: continue
    any_min[ek] = min(any_min.get(ek, '9999'), t['cr'])
    if t['ty'] in ('Bug', 'Story Defect'):
        defect_min[ek] = min(defect_min.get(ek, '9999'), t['cr'])
epic_start = {}
for ek in epics:
    epic_start[ek] = any_min.get(ek) or defect_min.get(ek) or ASOF
for ek, d in EPIC_HANDOFF.items():          # only for epics actually in this pull
    if ek in epics: epic_start[ek] = d
data_min = min((t['cr'] for t in out), default=ASOF)

# In-progress tickets: any ticket currently carrying an InProgress_<name> / <name>_inprogress
# label. "since" from the optional changelog sidecar; stale = ticket already resolved.
try:
    since_map = json.load(open(f'{W}/inprogress-since.json'))
except Exception:
    since_map = {}
inprogress = []
for t in out:
    if t['lip']:
        inprogress.append({'k': t['k'], 's': t['s'], 'people': t['lip'],
                           'st': t['st'], 'stale': t['fin'],
                           'since': since_map.get(t['k'])})
inprogress.sort(key=lambda r: (r['since'] or '9999'))

# Per-person activity (yesterday/today, PKT) from the optional sidecar.
try:
    activity = json.load(open(f'{W}/activity.json'))
except Exception:
    activity = None

# "Tickets created by each QA member" table — PROJECT-WIDE per-member-per-day counts (not the
# three-epic set), because it measures each person's real output. Built by fetch_created.py.
# Optional: if the sidecar is absent the template falls back to the three-epic ticket data.
try:
    created_by_member = json.load(open(f'{W}/created-by-member.json'))
except Exception:
    created_by_member = None

# Two follow-up tables (all "not finished by QA" = 'fin' false — see FINISHED_STATUSES):
#  needsResponse — the normal Assignee is a QA member (a query is likely waiting on QA),
#                  PLUS any QA-raised Task still open (so we see it + who it's assigned to).
#  openQueue     — the QA Assignee field is a QA member and the ticket isn't finished.
def trow(t):
    return {'k': t['k'], 'ty': t['ty'], 's': t['s'], 'assignee': t['as'],
            'qa': t['qa'], 'st': t['st'], 'ep': t['ep']}
needs_response, open_queue = [], []
for t in out:
    if t['fin']:
        continue
    assignee_is_qa = t['as'] in QA_TEAM
    qa_raised_task = t['ty'] == 'Task' and t['rep'] in QA_TEAM
    if assignee_is_qa or qa_raised_task:
        row = trow(t)
        row['reason'] = 'Assignee is QA' if assignee_is_qa else 'QA-raised task'
        needs_response.append(row)
    if any(p in QA_TEAM for p in t['qa']):
        open_queue.append(trow(t))
needs_response.sort(key=lambda r: (r['ep'] or 'zz', r['k']))
open_queue.sort(key=lambda r: (r['ep'] or 'zz', r['k']))

data = {'asof': ASOF, 'tz': 'PKT (UTC+5)', 'tickets': out, 'epics': epics,
        'tables': {'needsResponse': needs_response, 'openQueue': open_queue},
        'epicStart': epic_start, 'dataMinDate': data_min,
        'inprogress': inprogress, 'activity': activity,
        'createdByMember': created_by_member,
        'hygiene': {'inprog': inprog, 'bare': bare, 'lower': lower, 'mismatch': mismatch,
                    'per_person': dict(per_person.most_common())}}
json.dump(data, open(f'{W}/dash-data.json', 'w'), separators=(',', ':'))
print('tickets', len(out), 'epics', len(epics), 'hygiene', data['hygiene'])
