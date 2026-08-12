import json,re,sys
d=json.load(open('/tmp/rs812/rs.json'))
ours=[c for c in d['cases'] if c['created_by']==3]
foreign=[c for c in d['cases'] if c['created_by']!=3]
secname={s['id']:s['name'] for s in d['sections']}
parent={s['id']:s.get('parent_id') for s in d['sections']}
def report_of(sid):
    seen=set()
    while sid and sid not in seen:
        seen.add(sid)
        if parent.get(sid)==4281: return secname.get(sid)
        sid=parent.get(sid)
    return secname.get(sid,'?')
MARK=re.compile(r'^AUTOMATION:\s*(READY - EXPECT FAIL \(([^)]*)\)|READY|HOLD\b.*)$',re.M)
PROV=re.compile(r'This is the expected behaviour as per',re.M)
RAW=re.compile(r'</?(p|ol|ul|li|br|div|span|strong|em|table|tr|td)\b',re.I)
BUILDLINE=re.compile(r'Last checked against build\s+(\S+?)\s+on\s+([0-9/]+|\d+ \w+ \d+)',re.M)
BARRED=re.compile(r'as per the build tested on',re.I)
rows=[];tal={'READY':0,'EXPECT_FAIL':0,'HOLD':0,'NONE':0}
issues={'multi_marker':[],'no_marker':[],'multi_prov':[],'no_prov':[],'rawmarkup':[],'longtitle':[],'barred':[],'no_buildline':[]}
for c in ours:
    exp=c.get('custom_expected') or ''
    ms=MARK.findall(exp); mlines=[l for l in exp.splitlines() if l.strip().startswith('AUTOMATION:')]
    provs=PROV.findall(exp)
    builds=BUILDLINE.findall(exp)
    kind='NONE'
    if len(mlines)==1:
        t=mlines[0]
        kind='EXPECT_FAIL' if 'EXPECT FAIL' in t else ('HOLD' if 'HOLD' in t else ('READY' if 'READY' in t else 'NONE'))
    tal[kind]=tal.get(kind,0)+1
    if len(mlines)>1: issues['multi_marker'].append(c['id'])
    if len(mlines)==0: issues['no_marker'].append(c['id'])
    if len(provs)>1: issues['multi_prov'].append(c['id'])
    if len(provs)==0: issues['no_prov'].append(c['id'])
    txt=' '.join([c.get('title') or '',c.get('custom_preconds') or '',c.get('custom_steps') or '',exp])
    if RAW.search(txt): issues['rawmarkup'].append(c['id'])
    if len(c.get('title') or '')>80: issues['longtitle'].append(c['id'])
    if BARRED.search(txt): issues['barred'].append(c['id'])
    if not builds: issues['no_buildline'].append(c['id'])
    rows.append({'id':c['id'],'title':c['title'],'report':report_of(c['section_id']),'section':secname.get(c['section_id']),
                 'marker':(mlines[0].strip() if mlines else None),'kind':kind,'build':builds[-1] if builds else None,
                 'refs':c.get('refs'),'expected':exp,'steps':c.get('custom_steps') or '','preconds':c.get('custom_preconds') or ''})
json.dump({'rows':rows,'foreign':[{'id':c['id'],'title':c['title'],'updated_on':c['updated_on'],'updated_by':c['updated_by']} for c in foreign]},open('/tmp/rs812/rows.json','w'))
print('OURS',len(ours),'FOREIGN',len(foreign))
print('MARKERS',tal,'-> READY+EXPECTFAIL =',tal['READY']+tal['EXPECT_FAIL'],'| total-HOLD =',len(ours)-tal['HOLD'])
for k,v in issues.items(): print(f"{k:14s} {len(v):4d}", (v[:12] if v else ''))
from collections import Counter
print('\nPER REPORT:'); 
for r,n in Counter(x['report'] for x in rows).most_common(): 
    kk=Counter(x['kind'] for x in rows if x['report']==r); print(f"  {r:34s} {n:4d}  {dict(kk)}")
print('\nBUILD LINES:', Counter(str(x['build']) for x in rows).most_common(8))
