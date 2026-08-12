#!/usr/bin/env python3
"""Runnability check: every precondition and step of every case, against the build inventory.

The build is the CHECK, not the author. This does not propose wording from the build; it
flags each build-dependent reference a step makes and says whether that thing was observed
this session. A reference we did NOT observe is reported as NOT VERIFIED, never as absent.
"""
import json,re,sys
from collections import defaultdict

EV='/home/user/Manual-test-Cases/build/report-suite/verify-final-2026-08-12/evidence/'
live=json.load(open('/tmp/rs812/live_now.json'))
harv=json.load(open(EV+'harvest-all.json'))
menus=json.load(open(EV+'menus2.json'))
loc=json.load(open(EV+'location-column.json'))

secs={int(k):v for k,v in live['sections'].items()}
def top(sid):
    s=secs.get(sid)
    while s and s.get('parent_id') and s['parent_id']!=4281: s=secs.get(s['parent_id'])
    return s['name'] if s else '?'
M={'Work In Progress':'wip','Technician Utilization':'tu','Sales By Customer Report':'sbc',
   'Sales By Representative Report':'sbr','Parts Velocity Report':'pv','Inventory Value':'iv'}

ICON=re.compile(r'arrow_drop_(up|down)|keyboard_double_arrow_(down|up)|info_outline|chevron_(left|right)|search|check')
def clean(s): return ICON.sub('',s or '').strip()

# ---- the inventory of things OBSERVED on the build this session ----
INV=defaultdict(set)          # report key -> set of observed visible strings
CTRL=defaultdict(set)         # report key -> set of observed control test-ids
for k,v in harv.items():
    if k=='_meta': continue
    for t in v.get('texts',[]):
        INV[k].add(clean(t.get('rendered') or t['tc'])); INV[k].add(clean(t['tc']))
    for h in v.get('headers',[]): INV[k].add(clean(h.get('it') or h['tc']))
    for b in v.get('buttons',[]): INV[k].add(clean(b.get('it') or b['tc']))
    for t in v.get('tabs',[]):
        INV[k].add(clean(t.get('it') or t['tc']))
        INV[k].add(re.sub(r'\s*\(\d+\)\s*$','',clean(t.get('it') or t['tc'])))
    for a in v.get('aria',[]) or []: INV[k].add(clean(a))
    for p in v.get('placeholders',[]) or []: INV[k].add(clean(p))
    CTRL[k] |= set(v.get('testids',[]))
for k,v in menus.items():
    if k=='_meta': continue
    for tid,rec in v.items():
        CTRL[k].add(tid)
        p=(rec or {}).get('panel') or {}
        for x in p.get('raw',[]) or []:
            INV[k].add(clean(x['rendered'])); INV[k].add(clean(x['tc']))
for k,v in loc.items():
    if k=='_meta': continue
    for h in (v.get('headersAfter') or []): INV[k].add(clean(h))
    for c in (v.get('colsAfter') or []): INV[k].add(clean(c.get('label')))
for k in INV: INV[k]={x for x in INV[k] if x}

# things that exist on every report (chrome), and generic browser actions
GLOBAL={'Work Orders','Schedule','Customers','Parts','Reports','Search','Clock In','Reports'}

# ---- the phrase -> control map. A step naming one of these needs that control present. ----
CONTROL_PHRASES=[
 (r'\bcolumn select(or|ion)\b|\bcolumn chooser\b',           'button_column_selection'),
 (r'\bdate[- ]range\b|\bdate range picker\b',                'date-range-selector_{k}_trigger'),
 (r'\blocation filter\b|\bLocation filter\b',                'select_multiple_report_location_filter'),
 (r'\bthree-dot\b|\boverflow menu\b|⋯|\bexport menu\b|\bdownload menu\b','btn_dropdown_{k}_export'),
 (r'\badvisor filter\b',                                     'select_multiple_wip_advisor_filter'),
 (r'\basset filter\b',                                       'select_multiple_wip_asset_filter'),
 (r'\btechnician filter\b',                                  'select_multiple_tu_technician_filter'),
 (r'\bProduct Type\b',                                       'select_{k}_product_type'),
 (r'\bInvoice Status\b',                                     'select_sbr_invoice_status'),
 (r'\bShow Unassigned\b',                                    'toggle_sbr_show_unassigned'),
]
CUSTOMER_FILTER={'wip':'select_multiple_wip_customer_filter','sbc':'select_sbc_customer_filter'}

Q=re.compile(r'"([^"\n]{2,60})"')
NUMERIC=re.compile(r'^[\d\s.,$%/()+\-—–]+$')

def check_case(c):
    k=M.get(top(c['section_id']),'?')
    pre=[l for l in (c.get('custom_preconds') or '').split('\n') if l.strip()]
    st =[l for l in (c.get('custom_steps') or '').split('\n') if l.strip()]
    issues=[]
    body=' '.join(pre+st)
    # 1. controls named
    for pat,tid in CONTROL_PHRASES:
        if re.search(pat,body,re.I):
            t=tid.format(k=k)
            if t not in CTRL.get(k,set()):
                issues.append(('CONTROL',t,pat))
    if re.search(r'\bCustomer filter\b',body) and k in CUSTOMER_FILTER:
        if CUSTOMER_FILTER[k] not in CTRL.get(k,set()):
            issues.append(('CONTROL',CUSTOMER_FILTER[k],'Customer filter'))
    # 2. quoted labels named in PRECONDS/STEPS only (tester-facing objects)
    for m in Q.finditer(body):
        s=m.group(1).strip().rstrip('.,;:')
        if not s or NUMERIC.match(s) or s.startswith('http'): continue
        if s in GLOBAL: continue
        if len(s)>55: continue
        if s in INV.get(k,set()): continue
        # tolerate a trailing count "(N)" and case differences
        alt={s, s.rstrip('.'), re.sub(r'\s*\(\d+\)$','',s)}
        low={x.lower() for x in INV.get(k,set())}
        if any(a.lower() in low for a in alt): continue
        issues.append(('LABEL',s,None))
    return k,issues,len(pre),len(st)

rows=[]
for c in live['cases']:
    if c['created_by']!=3: continue
    k,issues,npre,nst=check_case(c)
    rows.append({'id':c['id'],'r':k,'t':c['title'],'npre':npre,'nst':nst,'issues':issues})

FINAL=('wip','tu','sbc')
def report(keys,label):
    sub=[r for r in rows if r['r'] in keys]
    ctrl=[r for r in sub if any(i[0]=='CONTROL' for i in r['issues'])]
    lab =[r for r in sub if any(i[0]=='LABEL' for i in r['issues']) and r not in ctrl]
    print(f"\n=== {label}: {len(sub)} cases ===")
    print(f"  cases naming a CONTROL not observed on the build : {len(ctrl)}")
    print(f"  cases naming a LABEL not observed this session   : {len(lab)}")
    for r in ctrl:
        print(f"   [CONTROL] C{r['id']} [{r['r']}] {r['t'][:60]}")
        for i in r['issues']:
            if i[0]=='CONTROL': print(f"        missing control: {i[1]}")
    return sub,ctrl,lab

report(FINAL,'THE THREE FINAL REPORTS')
report(('sbr','pv','iv'),'THE OTHER THREE')
json.dump(rows,open('/tmp/rs812/runnable.json','w'))

# label misses, grouped, for hand review
from collections import Counter
cnt=Counter()
for r in rows:
    for i in r['issues']:
        if i[0]=='LABEL': cnt[(r['r'],i[1])]+=1
print(f"\n=== distinct (report,label) not found in the harvest: {len(cnt)} ===")
for (k,s),n in cnt.most_common(80):
    ids=[f"C{r['id']}" for r in rows if r['r']==k and any(i[0]=='LABEL' and i[1]==s for i in r['issues'])]
    print(f"  {k:4s} {s!r:52s} x{n}  {' '.join(ids[:6])}")
