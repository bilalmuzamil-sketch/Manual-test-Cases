#!/usr/bin/env python3
"""Turn section 6769's cases into an execution plan: (query, group) pairs per case.

Queries are taken from the case's own steps. Where a case describes its query in prose instead of
giving it ("Type the asset's FULL licence plate"), the value is supplied here EXPLICITLY, read off
the case and the seed rather than guessed, and the override is recorded so it is auditable.
"""
import sys, re, json
sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
import tr_client as t

GROUPS=['Work Orders','Part sales','Purchase orders','Vendor invoices','Customers','Assets','Parts','Vendors']
def gmatch(w):
    w=w.strip().lower()
    for g in GROUPS:
        if g.lower()==w: return g
    c=[g for g in GROUPS if g.lower().rstrip('s')==w.rstrip('s')]
    if c: return c[0]
    c=[g for g in GROUPS if g.lower().startswith(w[:5])]
    return sorted(c,key=len)[0] if c else None

# Cases whose steps do not spell the query out. Values come from the live seed (seed-state-live.json
# and the records themselves), not from the old handoff, which is stale on work-order numbers.
OVERRIDE={
 53516: [('OHZZT471','Assets')],                       # the asset's full licence plate
 # shop_id is 9160, read from /api/staff/my-workplaces. The case's "S12-" is a PLACEHOLDER in its
 # example text, not a real prefix -- an earlier override copied it literally and would have reported
 # a failure for a work-order number that never existed.
 53579: [('S-17597','Work Orders'),('S17597','Work Orders'),
         ('S9160-17597','Work Orders'),('9160-17597','Work Orders')],
 53582: [('Kestrelway','Customers'),('Fernvale','Customers'),('Ohio','Customers'),('44872-9931','Customers')],
 53585: [('Halbrook','Vendors'),('Marnston','Vendors'),('43055-2210','Vendors')],
 45155: [('Cascadia',None)],                           # which heading do vehicles appear under?
 45157: [('Kestrel',None)],                            # a word matching one record more than one way
 45161: [('Z',None),('ZZ',None)],                      # one character, then two
}
def clean(s): return re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',s or '')).strip()

def build():
    cr=t.get('get_cases/1&suite_id=1&section_id=6769'); cs=cr[1] if isinstance(cr,tuple) else cr
    cases=cs.get('cases',cs) if isinstance(cs,dict) else cs
    out=[]
    for c in cases:
        steps=clean(c.get('custom_steps')); pre=clean(c.get('custom_preconds'))
        exp=clean(c.get('custom_expected')).split('SOURCE - THIS CASE')[0]
        parts=re.split(r'(?:(?<=\s)|^)(\d{1,2})\.\s', ' '+steps)
        chunks=[parts[i+1] for i in range(1,len(parts)-1,2)] if len(parts)>2 else [steps]
        pairs=[]; pending=None
        for ch in chunks:
            m=re.search(r'\b(?:[Tt]ype|[Ss]earch)(?:\s+(?:the|it|for))?[^:]{0,80}:\s*(.+)$', ch)
            if m:
                q=re.split(r'\s{2,}', m.group(1).strip().rstrip('.').strip())[0].strip()
                q=re.sub(r'^(for example|e\.g\.)\s+','',q,flags=re.I).strip()
                if 1<len(q)<45 and not q.lower().startswith('the '):
                    if pending: pairs.append(pending)
                    pending={'q':q,'group':None}
            g=re.search(r'Read the ([A-Za-z ]{3,18}?) group', ch)
            if g and pending and not pending['group']: pending['group']=gmatch(g.group(1))
        if pending: pairs.append(pending)
        lvl=re.findall(r'Read the ([A-Za-z ]{3,18}?) group', steps)
        default=gmatch(lvl[0]) if lvl else None
        for p in pairs:
            if not p['group']: p['group']=default
        override=False
        if c['id'] in OVERRIDE:
            pairs=[{'q':q,'group':g} for q,g in OVERRIDE[c['id']]]; override=True
        out.append({'id':c['id'],'title':c['title'],'pairs':pairs,'override':override,
            'needs_roles':bool(re.search(r'User A|User B|sign in as|a role that|permission|role',steps+' '+pre,re.I)),
            'steps':steps[:340],'expected':exp[:420]})
    return out

if __name__=='__main__':
    o=build()
    json.dump(o, open('/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14/CASES-6769.json','w'), indent=1)
    run=[x for x in o if x['pairs'] and not x['needs_roles']]
    print('runnable:',len(run),'of',len(o),'| roles:',sum(1 for x in o if x['needs_roles']),
          '| still no query:',sum(1 for x in o if not x['pairs']))
    print('overrides applied:',[x['id'] for x in o if x['override']])
    for x in o:
        if not x['pairs'] and not x['needs_roles']: print(f"   no query: C{x['id']} {x['title'][:56]}")
