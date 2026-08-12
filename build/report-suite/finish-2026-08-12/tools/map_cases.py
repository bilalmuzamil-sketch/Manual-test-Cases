#!/usr/bin/env python3
"""Map every case to the ROUTE ATOMS its preconditions and steps require, then decide
whether this session actually walked that route.

A case counts as WALKED only when EVERY atom its steps require was performed successfully
this session. One unperformed atom disqualifies the whole case -- that is the step the
tester would stop on. Atoms we could not attempt (a second sign-in, a phone, dark mode,
reading a downloaded file's bytes) are named per case, never folded into the total.
"""
import json,re,sys
from collections import defaultdict,Counter

LIVE='/tmp/rs812/live_now.json'
live=json.load(open(LIVE))
secs={int(k):v for k,v in live['sections'].items()}
def top(sid):
    s=secs.get(sid)
    while s and s.get('parent_id') and s['parent_id']!=4281: s=secs.get(s['parent_id'])
    return s['name'] if s else '?'
KEY={'Work In Progress':'wip','Technician Utilization':'tu','Sales By Customer Report':'sbc',
     'Sales By Representative Report':'sbr','Parts Velocity Report':'pv','Inventory Value':'iv'}
ours=[c for c in live['cases'] if c['created_by']==3]

# ---------------- blockers: things this session cannot do at all ----------------
BLOCK=[
 ('second_signin', r'sign(ed)? in as (a|an) (different|second|another)|another user|a user (who|with) (only|no|does not)|second login|different login|user with access to only one location|restricted user|without the .{0,40}permission|role (that|which) (lacks|does not)'),
 ('phone',         r'\bphone\b|\bmobile\b|narrow (screen|viewport)|390 ?[x×] ?844|small screen'),
 ('dark_mode',     r'\bdark mode\b|dark theme'),
 ('file_contents', r'\bopen the (downloaded|saved) file|read the (csv|pdf|spreadsheet|file)\b|inside the (file|csv|pdf)|the file contains|first line of the file|utf-8|byte order mark|\bBOM\b'),
 ('logo_state',    r'\blogo\b'),
 ('print_view',    r'\bprint (view|preview)\b'),
]
# ---------------- data-state preconditions ----------------
DATA=[
 ('seeded_data',   r'ZZAUTOTEST|seed |seeded|create (a|an|several|five|two|three) .{0,30}(work order|invoice|part)'),
 ('specific_data', r'a (rep|customer|technician|part) (who|whose|with) .{0,60}(span|two different|more than one|no |zero)'),
 ('empty_state',   r'nothing matches|no rows|empty (result|range|state)|returns no'),
]
# ---------------- route atoms ----------------
ATOM=[
 ('nav_via_reports_menu', r'open the reports navigation|reports navigation|inside the .{0,20}group of reports|navigation under'),
 ('report_loads',         r'open the .{0,40}report|you are on the .{0,40}report'),
 ('tabs',                 r'\btab\b|\btabs\b'),
 ('sort',                 r'\bsort\b|sorting|click (the|a) .{0,30}column header|order by'),
 ('expand',               r'\bexpand\b|\bcollapse\b|chevron|drill (down|into)'),
 ('column_selector',      r'column select(or|ion)|column chooser|switch .{0,20}off in the column'),
 ('date_range',           r'date[- ]range|date range|preset|custom range|\bThis month\b|\bLast month\b'),
 ('location_filter',      r'location filter|select .{0,20}location|All locations|narrow(ing)? .{0,20}to a single location'),
 ('export_menu',          r'⋯|three-dot|download menu|export menu|download (the|all|current)|\bdownloads?\b'),
 ('other_filter',         r'(advisor|asset|customer|technician|product type|invoice status|category|vendor|status|search) filter'),
]

def hits(pats,text):
    return [n for n,p in pats if re.search(p,text,re.I)]

walks={}
for k in KEY.values():
    try: walks[k]=json.load(open(f'/tmp/rs812/walk_{k}.json'))
    except Exception: walks[k]=None

def performed(k):
    """set of atom names successfully performed for report k this session"""
    w=walks.get(k)
    if not w: return set(),{}
    ok=set(); detail={}
    byname=defaultdict(list)
    for a in w['atoms']: byname[a['name'].split(':')[0].split('[')[0]].append(a)
    for base,lst in byname.items():
        good=[a for a in lst if a['ok']]
        if base=='control_open':
            # record which controls opened
            for a in lst:
                tid=a['name'].split(':',1)[1]
                detail.setdefault('controls',{})[tid]=a['ok']
            if good: ok.add('controls_any')
        elif good: ok.add(base)
    # translate to atom vocabulary
    out=set()
    if 'nav_via_reports_menu' in ok: out.add('nav_via_reports_menu')
    if 'report_loads' in ok: out.add('report_loads')
    if 'tab_click' in ok: out.add('tabs')
    if 'sort' in ok: out.add('sort')
    if 'expand' in ok: out.add('expand')
    ctl=detail.get('controls',{})
    if any(v for t,v in ctl.items() if 'column_selection' in t): out.add('column_selector')
    if any(v for t,v in ctl.items() if 'date-range' in t):       out.add('date_range')
    if any(v for t,v in ctl.items() if 'location_filter' in t):  out.add('location_filter')
    if any(v for t,v in ctl.items() if 'btn_dropdown' in t):     out.add('export_menu')
    if any(v for t,v in ctl.items() if t.startswith(('select_','toggle_'))): out.add('other_filter')
    return out,detail

rows=[]
for c in ours:
    k=KEY.get(top(c['section_id']),'?')
    txt=' '.join([(c.get('custom_preconds') or ''),(c.get('custom_steps') or '')])
    need=set(hits(ATOM,txt)); need.add('report_loads')
    blk=hits(BLOCK,txt); dat=hits(DATA,txt)
    done,_=performed(k)
    missing=sorted(need-done)
    walked = (not blk) and (not missing)
    rows.append({'id':c['id'],'report':k,'title':c['title'],
                 'need':sorted(need),'missing':missing,'blockers':blk,'data':dat,
                 'walked':walked})

json.dump(rows,open('/tmp/rs812/casemap.json','w'),indent=1)
print('cases:',len(rows))
print('walked:',sum(1 for r in rows if r['walked']))
byrep=defaultdict(lambda:[0,0])
for r in rows:
    byrep[r['report']][1]+=1
    if r['walked']: byrep[r['report']][0]+=1
for k,(w,t) in sorted(byrep.items()): print(f'  {k:5} {w:3}/{t}')
print('\nblocker frequency:',Counter(b for r in rows for b in r['blockers']).most_common())
print('missing-atom frequency:',Counter(m for r in rows for m in r['missing']).most_common())
