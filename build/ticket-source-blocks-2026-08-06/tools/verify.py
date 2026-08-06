import re,glob,os,json
SPECS={}
for p in sorted(glob.glob('../specs/*-v*.txt')):
    b=os.path.basename(p)[:-4]; slug,ver=b.split('-v')
    SPECS[slug]=(ver, open(p).read())
REPORT={  # ticket -> spec slug (from parent story / content)
 'SV-8820':'iv','SV-8823':'iv','SV-8880':'sbr','SV-8881':'tu','SV-8907':'wip','SV-8908':'wip',
 'SV-8925':'sbc','SV-8926':'iv','SV-8927':'iv','SV-8928':'iv','SV-8929':'iv','SV-8930':'iv',
 'SV-8931':'iv','SV-8932':'iv','SV-8934':'pv','SV-8935':'pv','SV-8936':'pv','SV-8937':'pv',
 'SV-8938':'pv','SV-8939':'pv','SV-8940':'pv','SV-8943':'tu','SV-8944':'tu','SV-8945':'tu',
 'SV-8946':'tu','SV-8947':'tu','SV-8948':'tu','SV-8949':'tu','SV-8950':'tu','SV-8951':'tu',
 'SV-8952':'tu','SV-8953':'tu','SV-8954':'tu','SV-8955':'sbc','SV-8956':'sbc',
 'SV-8845':'filters','SV-8846':'filters','SV-8847':'filters','SV-8871':'filters','SV-8912':'filters',
}
cited=json.load(open('../refs-cited.json'))
res={}
for k,refs in cited.items():
    slug=REPORT.get(k)
    if not slug or not refs: continue
    ver,txt=SPECS[slug]
    res[k]={'spec':slug,'version':ver,'refs':{}}
    print(f"\n===== {k}  [{slug} v{ver}]")
    for r in refs:
        ms=[m.group(0).strip() for m in re.finditer(r'(?m)^\s*-?\s*'+re.escape(r)+r'\s*[:.].*$', txt)]
        if not ms:
            ms=[m.group(0).strip() for m in re.finditer(r'(?m)^.*\b'+re.escape(r)+r'\b.*$', txt)][:1]
            status='INDIRECT' if ms else 'NOT-FOUND'
        else: status='FOUND'
        res[k]['refs'][r]={'status':status,'text':ms[0] if ms else None}
        print(f"  [{status}] {ms[0][:300] if ms else r+' -- NOT IN SPEC'}")
json.dump(res, open('../refs-verified.json','w'), indent=1)
