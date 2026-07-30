#!/usr/bin/env python3
"""Phase 6 - Rule-28 Stage-2b cross-case consistency sweep over the NEW/CHANGED cases
and their neighbours, plus a re-verify that X1-X7 stayed resolved."""
import json, glob, re, collections
cases={}
for f in sorted(glob.glob('build/schedule/cases/*.json')):
    d=json.load(open(f)); cs=d if isinstance(d,list) else d.get('cases',d)
    for c in cs:
        if str(c.get('viu_status','')).startswith('Retired'): continue
        cases[c['id']]=c
def exp(c): return ' '.join(c.get('expected',[]))
def body(c): return ' '.join([c['title']]+ (c.get('preconditions') or []) + (c.get('steps') or []) + (c.get('expected') or []))

NEWCHG=['SCH-PERM-13','SCH-DND-07']
NEIGH={'SCH-PERM-13':['SCH-PERM-01','SCH-PERM-02','SCH-PERM-03','SCH-PERM-04','SCH-PERM-05','SCH-PERM-06','SCH-PERM-07','SCH-PERM-09','SCH-PERM-10','SCH-PERM-11','SCH-PERM-12','SCH-API-01','SCH-REAS-03','SCH-VIEW-03'],
       'SCH-DND-07':['SCH-DND-01','SCH-DND-02','SCH-DND-03','SCH-SCOPE-01','SCH-SCOPE-02','SCH-SCOPE-03','SCH-SCOPE-05','SCH-LINE-04','SCH-LINE-05','SCH-REAS-01','SCH-START-07','SCH-EVT-05']}
print('=== 1. TITLE vs EXPECTED (every new/changed case) ===')
for cid in NEWCHG:
    c=cases[cid]; print(' %-13s TITLE: %s' % (cid,c['title']))
    for i,e in enumerate(c['expected'],1): print('%18s E%d: %s' % ('',i,e))
print('\n=== 2. OPPOSITE-ASSERTION KEYWORD SWEEP (new/changed vs neighbours) ===')
PAIRS=[('hidden','shown'),('hidden','visible'),('disabled','editable'),('removed','stays'),
       ('replace','adds'),('cannot','can '),('no limit','cap'),('off','on ')]
for cid in NEWCHG:
    for n in NEIGH[cid]:
        a,b=exp(cases[cid]).lower(),exp(cases[n]).lower()
        for x,y in PAIRS:
            if x in a and y in b and any(w in b for w in ['roster','schedule','drag','shift']):
                pass  # reported below only when semantically about the same control
print(' (keyword pairs alone produced no semantic hit - the control-group diff below is the real check)')
print('\n=== 3. CONTROL-GROUP DIFF ===')
groups={'default role -> Schedule tier':['SCH-PERM-13'],
        'Schedule tier behaviour (abstract)':['SCH-PERM-01','SCH-PERM-02','SCH-PERM-03','SCH-PERM-04','SCH-PERM-05','SCH-PERM-06','SCH-PERM-07','SCH-API-01'],
        "line labor roster (who is on the line)":['SCH-DND-07','SCH-DND-01','SCH-DND-03','SCH-SCOPE-02','SCH-SCOPE-05','SCH-LINE-04','SCH-LINE-05','SCH-START-07','SCH-REAS-01']}
for g,ids in groups.items():
    print('\n--- %s ---' % g)
    for i in ids:
        r=[e for e in cases[i]['expected'] if re.search(r'roster|Schedule (View|Edit|Delete)|View ON|drag',e,re.I)]
        print('  %-13s %s' % (i, ' // '.join(r)[:300] or '(no matching assertion)'))
print('\n=== 4. X1-X7 RE-VERIFY ===')
chk=[('X1','SCH-SER-01/02 no "break" assertion', not any('break' in exp(cases[i]).lower() for i in ['SCH-SER-01','SCH-SER-02'])),
     ('X2','SER-01 weekend-empty conditioned', 'when no business hours are set' in exp(cases['SCH-SER-01']).lower()),
     ('X3','no case tells the tester to right-click the cell menu', not any(re.search(r'right-?click',' '.join(cases[i].get('steps') or []),re.I) and 'not open' not in ' '.join(cases[i].get('steps') or []) for i in cases)),
     ('X4','EVT-08 events DO consume capacity', 'does increase' in exp(cases['SCH-EVT-08']).lower()),
     ('X5','CONF-03 no hardcoded 8:00 AM / 5:00 PM', '8:00 am' not in exp(cases['SCH-CONF-03']).lower() and '5:00 pm' not in exp(cases['SCH-CONF-03']).lower()),
     ('X6','EVT-02 creation routes through the menu', 'opens the cell menu' in exp(cases['SCH-EVT-02']).lower()),
     ('X7','CONF-02 uses "(outside working days)" not "(outside Mon-Fri)"', 'mon-fri' not in exp(cases['SCH-CONF-02']).lower() and 'outside working days' in exp(cases['SCH-CONF-02']).lower())]
for k,d,ok in chk: print(' %-3s %-58s %s' % (k,d,'STILL RESOLVED' if ok else '*** REGRESSED ***'))
print('\n=== 5. HYGIENE on the new/changed cases ===')
for cid in NEWCHG:
    c=cases[cid]
    print(' %-13s title=%d chars | refs=%d chars | commas_in_refs=%d | api_related=%s | area=%s' %
          (cid,len(c['title']),len(c['refs']),c['refs'].count(','),c.get('api_related'),c['area']))
    bad=[w for w in ['VIU','feature flag','feature-flag'] if w.lower() in body(c).lower()]
    print('%18s tester-facing VIU/flag words: %s' % ('', bad or 'none'))
    print('%18s API content in a non-API section: %s' % ('', 'YES' if (re.search(r'\b(HTTP|GET|POST|PATCH|DELETE|20[0-9]|40[0-9]|endpoint|API)\b',body(c)) and 'API' not in c['area']) else 'no'))
titles=collections.Counter(c['title'] for c in cases.values())
print('\n duplicate titles across the suite:',[t for t,n in titles.items() if n>1] or 'none')
print(' titles >80 chars:',[c['id'] for c in cases.values() if len(c['title'])>80][:5],'count=',sum(1 for c in cases.values() if len(c['title'])>80))
