#!/usr/bin/env python3
"""Authorised READS: pre-write case-body snapshots (Rule 87), C44897 history, C45032/66 bodies."""
import json, base64, urllib.request, urllib.error, collections, sys
C=json.load(open('/tmp/testrail/creds.json'))
A=base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B=C['host']+'/index.php?/api/v2/'
def get(p):
    r=urllib.request.Request(B+p); r.add_header('Authorization','Basic '+A); r.add_header('Content-Type','application/json')
    try:
        with urllib.request.urlopen(r,timeout=60) as x: return x.status, json.loads(x.read().decode())
    except urllib.error.HTTPError as e: return e.code, e.read().decode()[:300]
def paged(p,k):
    o,f=[],0
    while True:
        s,d=get(f"{p}&limit=250&offset={f}")
        if s!=200: return o
        c=d[k] if isinstance(d,dict) else d
        if not c: break
        o.extend(c)
        if len(c)<250: break
        f+=250
    return o
sec=paged("get_sections/1&suite_id=1","sections")
kids=collections.defaultdict(list)
for s in sec: kids[s.get('parent_id')].append(s['id'])
def sub(r):
    seen,st=[],[r]
    while st:
        n=st.pop(); seen.append(n); st.extend(kids.get(n,[]))
    return seen
allc=paged("get_cases/1&suite_id=1","cases")
bs=collections.defaultdict(list)
for c in allc: bs[c['section_id']].append(c)

# Rule 87 — pre-write snapshot of BOTH affected groups, committed
for gid,slug in ((6720,'global-search'),(6597,'inline-add-edit-parts')):
    g=[c for s in sub(gid) for c in bs.get(s,[])]
    p=f'build/build-verify-session-2026-08-21/snapshots/PRE-WRITE-{slug}-{gid}-2026-08-25.json'
    json.dump(sorted(g,key=lambda c:c['id']),open(p,'w'),indent=1)
    print(f"snapshot {slug}: {len(g)} cases -> {p}")

print("\n===== ITEM 3 · C44897 HISTORY =====")
s,h=get('get_history_for_case/44897')
print('get_history_for_case/44897 -> HTTP',s)
if s==200:
    ents = h.get('history',h) if isinstance(h,dict) else h
    print('entries:',len(ents))
    print(json.dumps(ents,indent=1)[:2600])
else:
    print('body:',h)

print("\n===== ITEM 4 · C45032 vs C45066 =====")
for cid in (45032,45066):
    s,c=get(f'get_case/{cid}')
    if s!=200: print(cid,'HTTP',s,c); continue
    print(f"\n--- C{cid} | section {c['section_id']} | created_on {c.get('created_on')} | atm {c.get('custom_atmstatus')}")
    print("TITLE   :",c['title'])
    print("REFS    :",(c.get('refs') or '')[:200])
    print("PRECONDS:",(c.get('custom_preconds') or '')[:400].replace('\n',' | '))
    print("STEPS   :",(c.get('custom_steps') or '')[:600].replace('\n',' | '))
    print("EXPECTED:",(c.get('custom_expected') or '')[:700].replace('\n',' | '))

print("\n===== C44864 PRE-WRITE STATE (the one authorised write) =====")
s,c=get('get_case/44864')
print('HTTP',s,'| atm',c.get('custom_atmstatus'),'| section',c.get('section_id'))
print('TITLE   :',c['title'])
print('REFS    :',(c.get('refs') or '')[:260])
print('EXPECTED (tail):',(c.get('custom_expected') or '')[-500:].replace('\n',' | '))
json.dump(c,open('build/build-verify-session-2026-08-21/snapshots/PRE-WRITE-C44864.json','w'),indent=1)
