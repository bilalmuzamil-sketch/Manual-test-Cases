#!/usr/bin/env python3
"""Raw-markup census across the six suites (core 3.5 — run at the START of every pass).
Read-only. Also flags the COLLAPSE pattern from skill 14: a bare \n inside <p> with no
<br>, which renders as one unreadable run-on paragraph for the tester."""
import json, base64, urllib.request, collections
C=json.load(open('/tmp/testrail/creds.json'))
A=base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B=C['host']+'/index.php?/api/v2/'
def get(p):
    r=urllib.request.Request(B+p); r.add_header('Authorization','Basic '+A)
    with urllib.request.urlopen(r,timeout=60) as x: return json.loads(x.read().decode())
def paged(p,k):
    o,f=[],0
    while True:
        d=get(f"{p}&limit=250&offset={f}"); c=d[k] if isinstance(d,dict) else d
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
    while st: n=st.pop(); seen.append(n); st.extend(kids.get(n,[]))
    return seen
allc=paged("get_cases/1&suite_id=1","cases")
bysec=collections.defaultdict(list)
for c in allc: bysec[c['section_id']].append(c)
G={'digital-inspections-v2':6658,'global-search':6720,'simple-flow-v2':6665,
   'invoice-ui-refresh':6559,'inline-add-edit-parts':6597,'printer-friendly-wo':6617}
FIELDS=('custom_preconds','custom_steps','custom_expected')
def has_markup(t): 
    t=(t or '').lower(); return any(x in t for x in ('<ol','<li','<p>','<p ','<br','<hr','<a href','&nbsp;'))
def collapses(t):
    t=t or ''
    return '\n' in t.strip() and '<p' in t.lower() and '<br' not in t.lower()
rep={}
det=[]
for slug,gid in G.items():
    live=[c for s in sub(gid) for c in bysec.get(s,[])]
    m=collections.Counter()
    for c in live:
        any_m=any(has_markup(c.get(f)) for f in FIELDS)
        any_c=any(collapses(c.get(f)) for f in FIELDS)
        if any_m: m['markup']+=1
        if any_c:
            m['collapse']+=1
            det.append({'slug':slug,'cid':c['id'],'title':c['title'][:80],
                        'fields':[f for f in FIELDS if collapses(c.get(f))]})
        if not any_m: m['plain']+=1
    rep[slug]={'live':len(live),**dict(m)}
json.dump({'summary':rep,'collapse_detail':det},
          open('build/build-verify-session-2026-08-21/evidence/markup-census.json','w'),indent=1)
print(f"{'PROJECT':<28}{'LIVE':>5}{'HTML':>6}{'PLAIN':>7}{'COLLAPSE-RISK':>15}")
t=collections.Counter()
for s,r in rep.items():
    t['live']+=r['live']; t['markup']+=r.get('markup',0); t['plain']+=r.get('plain',0); t['collapse']+=r.get('collapse',0)
    print(f"{s:<28}{r['live']:>5}{r.get('markup',0):>6}{r.get('plain',0):>7}{r.get('collapse',0):>15}")
print(f"{'TOTAL':<28}{t['live']:>5}{t['markup']:>6}{t['plain']:>7}{t['collapse']:>15}")
print(f"\ncases at COLLAPSE risk (bare newline inside <p>, no <br>): {len(det)}")
for d in det[:8]: print(f"   C{d['cid']} [{d['slug']}] {d['fields']} {d['title'][:60]}")
