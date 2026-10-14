import json,glob,re,html,sys,collections
sys.path.insert(0,'full-audit'); from verdicts_src import V
CHANGED={'01_Opens_After','02_Last12_After','03_Range_After','04_Revenue_After','04_Revenue_Hover','05_Billing_After','05_Billing_Legend','06_TechEff_After','06_TechEff_Legend','07_TechUtil_After','07_TechUtil_Legend','08_Customers_After','09_AtRisk_After','09_AtRisk_Window','11_saa_Legend','12_te_Legend','13_tu_Legend','14_Phone_After'}
REMOVED={'15_Empty_Design','15_Empty_Now'}
RANGES={'04 to 09 *_After':['04_Revenue_After','05_Billing_After','06_TechEff_After','07_TechUtil_After','08_Customers_After','09_AtRisk_After'],
        '10 to 13 *_After':['10_sales_After','11_service-advisor-analysis_After','12_technician-efficiency_After','13_technician-utilization_After'],
        '10 to 13 *_After and *_Hidden':[], '10 to 12':['10_sales_After','11_service-advisor-analysis_After','12_technician-efficiency_After']}
own={1:'Vladimir',2:'Nebojsa',3:'us'}; atm={1:'No (manual)',3:'Yes (automated)',4:'Waiting to be automated'}
rows=[]
for f in glob.glob('snapshots-after-answers/C*.json'):
    d=json.load(open(f)); cid='C'+str(d['id'])
    o='Vladimir' if int(d['created_by'])==1 else ('Nebojsa' if int(d['updated_by'])==2 else 'us')
    e=html.unescape(re.sub(r'<[^>]+>',' ',d['custom_expected'] or ''))
    src=e.split('Exact quotes')[0]
    src=src[src.find('Source'):] if 'Source' in src else ''
    boards=set(re.findall(r'\b(\d\d_[A-Za-z][A-Za-z0-9_\-]*[A-Za-z])',src))
    for k,v in RANGES.items():
        if 'boards '+k in src: boards|=set(v)
    if re.search(r'row 15',src): boards|={'15_Empty_Design'} if '15_Empty' not in src else set()
    ch=sorted(boards&CHANGED); rm=sorted(boards&REMOVED)
    verd,reason=V[cid]; vs=[x for x in verd.split(',') if x!='OK']
    if ch or rm: vs.append('D')
    if not vs: vs=['OK']
    dnote=''
    if rm: dnote+=' D: cites removed board(s) '+', '.join(rm)+' (now 15_Empty_After).'
    if ch: dnote+=' D: cites changed board(s) '+', '.join(ch)+'.'
    rows.append(dict(case_id=cid,owner=o,atm=atm.get(int(d['custom_atmstatus']),str(d['custom_atmstatus'])),verdicts=vs,reason=reason+dnote,title=d['title'],boards_cited=sorted(boards)))
rows.sort(key=lambda r:int(r['case_id'][1:]))
json.dump([{k:r[k] for k in ('case_id','owner','atm','verdicts','reason')} for r in rows],open('full-audit/verdicts.json','w'),indent=1,ensure_ascii=False)
json.dump(rows,open('full-audit/_rows_full.json','w'),indent=1,ensure_ascii=False)
c=collections.Counter()
for r in rows:
    for v in r['verdicts']: c[(r['owner'],v)]+=1
    c[(r['owner'],'n')]+=1
for o in ['us','Nebojsa','Vladimir']:
    print(o,{v:c[(o,v)] for v in ['n','A','B','C','D','OK']})
print(len(rows))
