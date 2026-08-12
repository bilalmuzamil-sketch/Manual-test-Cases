#!/usr/bin/env python3
"""Map every case to the ROUTE ATOMS its preconditions and steps require, then decide
whether this session actually walked that route on the build.

THREE deliberately different numbers, because they mean different things:

  route_walked  every UI route the case's steps name was executed on the build this
                session. Says: the tester will not hit a missing screen or control.
  fully_walked  route_walked AND no blocker (second sign-in / phone / dark mode / reading
                a downloaded file's bytes / logo state) AND no data-state precondition this
                session did not confirm. THIS IS THE NUMBER TO REPORT as steps and
                preconditions walked. It is always the smaller one.
  not_walked    everything else, itemised by reason -- never folded into a total.

One unperformed atom disqualifies the whole case: that is the step the tester stops on.
"""
import json,re,sys
from collections import defaultdict,Counter

live=json.load(open('/tmp/rs812/live_now.json'))
secs={int(k):v for k,v in live['sections'].items()}
def top(sid):
    s=secs.get(sid)
    while s and s.get('parent_id') and s['parent_id']!=4281: s=secs.get(s['parent_id'])
    return s['name'] if s else '?'
KEY={'Work In Progress':'wip','Technician Utilization':'tu','Sales By Customer Report':'sbc',
     'Sales By Representative Report':'sbr','Parts Velocity Report':'pv','Inventory Value':'iv'}
ours=[c for c in live['cases'] if c['created_by']==3]

BLOCK=[
 # widened 2026-08-12 after a HAND AUDIT of 8 'fully walked' cases found 4 with a
 # precondition this session never met. 'access to exactly ONE location' was missed by
 # the earlier 'only one location' wording, and C43550 is exactly that case.
 ('second_signin', r'sign(ed)? in as (a|an|the) [^.]{0,60}(different|second|another|one location|exactly one|single location)|another user|second login|different login|access to (only|exactly) ?\w* ?one location|restricted user|without the .{0,45}permission|role (that|which) (lacks|does not|has no)|a user who (cannot|does not|has no)|permission .{0,25}(turned off|removed)|as a person who has'),
 ('phone',         r'\bphone\b|\bmobile\b|narrow (screen|viewport)|390 ?[x×] ?844|small screen|touch target'),
 ('dark_mode',     r'\bdark mode\b|dark theme'),
 ('file_contents', r'open the (downloaded|saved) file|read the (csv|pdf|spreadsheet|downloaded)|inside the (file|csv|pdf)|the file contains|first line of the file|utf-8|byte order mark|\bBOM\b|open the pdf|the spreadsheet (has|shows|contains)|column headers in the file'),
 ('logo_state',    r'\blogo\b'),
 ('print_view',    r'\bprint (view|preview)\b'),
]
DATA=[
 ('seeded_data',   r'ZZAUTOTEST|seed(ed)? |create (a|an|several|five|two|three|four) .{0,40}(work order|invoice|part)'),
 ('specific_data', r'(rep|customer|technician|part|asset)s? (who|whose|with|that) .{0,70}(span|two different|more than one|no |zero|single location)'),
 ('empty_state',   r'nothing matches|no rows|empty (result|range|state)|returns no|no data'),
 # a precondition that asserts a STATE of the app or the data, rather than a route.
 ('state_precond', r'dialog is open|is open for|enough (columns|customers|rows|data)|are enabled|is turned on|turned on|no saved (settings|view)|first visit|several \w+ in the range|whose \w+ .{0,40}(produce|land|tie)|ideally one|with data loaded|scrolls horizontally|more than one page'),
]
ATOM=[
 ('nav_via_reports_menu', r'open the reports navigation|reports navigation|inside the .{0,25}group|navigation under|appears in the reports'),
 # "tab" also means the BROWSER tab and the devtools Network tab. Only Work In Progress
 # has report tabs at all, so this atom is gated on the report actually having them below.
 ('tabs',                 r'\btabs?\b'),
 ('sort',                 r'\bsort(ing|ed)?\b|click (the|a) .{0,35}column header|order(ed)? by'),
 ('expand',               r'\bexpand(ing|ed)?\b|\bcollapse\b|chevron|drill (down|into)'),
 ('column_selector',      r'column select(or|ion)|column chooser|switch(ing)? .{0,25}off in the column'),
 ('date_range',           r'date[- ]range|date range|preset|custom range'),
 ('location_filter',      r'location filter|select .{0,25}location|all locations|narrow(ing)? .{0,25}to a single location'),
 ('export_menu',          r'⋯|three-dot|download menu|export menu|download (the|all|current|both|each)|\bdownloads?\b'),
 ('other_filter',         r'(advisor|asset|customer|technician|product type|invoice status|category|vendor|status|part|search) filter|filter (by|for)'),
]

def hits(pats,text): return [n for n,p in pats if re.search(p,text,re.I)]

walks={}
for k in set(KEY.values()):
    for path in (f'/tmp/rs812/walk_{k}.json', f'/tmp/rs812/walk_{k}.SAVED.json'):
        try: walks[k]=json.load(open(path)); break
        except Exception: pass

def performed(k):
    w=walks.get(k)
    if not w: return set(), {}
    out=set(); ctl={}
    for a in w['atoms']:
        n=a['name']
        if n=='nav_via_reports_menu' and a['ok']: out.add('nav_via_reports_menu')
        elif n=='report_loads' and a['ok']:
            out.add('report_loads')
            ctl['__rowcount']=a.get('rowcount',0)
        elif n.startswith('tab_click') and a['ok']: out.add('tabs')
        elif n.startswith('sort:') and a['ok']:
            # a sort probe that measured ZERO rows could not have failed, so it establishes
            # nothing. Require evidence the extractor actually read rows.
            if a.get('extractor_returned_rows',0)>0: out.add('sort')
        elif n.startswith('expand:') and a['ok']:
            if a.get('rows_before',0)>0: out.add('expand')
        elif n.startswith('control_open:'):         ctl[n.split(':',1)[1]]=a['ok']
    # TU: the walk's expand-all click timed out behind an overlay from the previous atom.
    # A targeted probe (tools/probe_tu.cjs) found the control present, visible at 22x22,
    # and working -- rows 4 -> 7. Credit expand on that evidence.
    # TU's SORT is deliberately NOT credited: the row change there is confounded by data
    # still arriving, so the probe cannot separate a sort from a load.
    if k=='tu':
        try:
            pt=json.load(open('/tmp/rs812/probe_tu.json'))
            if pt.get('expand_clicked') and pt.get('rows_after_expand',0)>pt.get('rows_before_expand',0):
                out.add('expand')
        except Exception: pass
    if any(v for t,v in ctl.items() if 'column_selection' in t): out.add('column_selector')
    if any(v for t,v in ctl.items() if 'date-range' in t):       out.add('date_range')
    if any(v for t,v in ctl.items() if 'location_filter' in t):  out.add('location_filter')
    if any(v for t,v in ctl.items() if 'btn_dropdown' in t):     out.add('export_menu')
    if any(v for t,v in ctl.items() if t.startswith(('select_','toggle_')) and 'location' not in t):
        out.add('other_filter')
    return out, ctl

rows=[]
for c in ours:
    k=KEY.get(top(c['section_id']),'?')
    txt=' '.join([(c.get('custom_preconds') or ''),(c.get('custom_steps') or '')])
    need=set(hits(ATOM,txt)); need.add('report_loads')
    # a report with no tabs cannot require the tabs atom: the word is matching the browser
    # tab or the devtools Network tab, not a control the tester must find.
    w=walks.get(k)
    has_tabs = bool(w) and any(a['name'].startswith('tab_click') for a in w['atoms'])
    if not has_tabs: need.discard('tabs')
    blk=hits(BLOCK,txt); dat=hits(DATA,txt)
    done,_=performed(k)
    missing=sorted(need-done)
    route = (not missing) and bool(walks.get(k))
    rows.append({'id':c['id'],'report':k,'title':c['title'],
                 'need':sorted(need),'missing':missing,'blockers':blk,'data':dat,
                 'route_walked':route,
                 'fully_walked': route and not blk and not dat})

json.dump(rows,open('/tmp/rs812/casemap.json','w'),indent=1)

def tally(pred):
    d=defaultdict(int)
    for r in rows:
        if pred(r): d[r['report']]+=1
    return d
tot=Counter(r['report'] for r in rows)
rw=tally(lambda r:r['route_walked']); fw=tally(lambda r:r['fully_walked'])
print(f"{'report':6} {'cases':>6} {'route':>6} {'FULL':>6}")
for k in ['wip','tu','sbc','sbr','pv','iv']:
    print(f'{k:6} {tot[k]:6} {rw[k]:6} {fw[k]:6}')
print(f"{'TOTAL':6} {sum(tot.values()):6} {sum(rw.values()):6} {sum(fw.values()):6}")
print('\nreasons a case is not fully walked:')
for n,c in Counter([b for r in rows if not r['fully_walked'] for b in (r['blockers'] or [])]).most_common(): print(f'   blocker {n:16} {c}')
for n,c in Counter([d for r in rows if not r['fully_walked'] and not r['blockers'] for d in (r['data'] or [])]).most_common(): print(f'   data    {n:16} {c}')
for n,c in Counter([m for r in rows if r['missing'] for m in r['missing']]).most_common(): print(f'   MISSING ATOM {n:14} {c}')
