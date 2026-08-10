import json,re
sc={}
for r,cs in json.load(open('scope-cases.json')).items():
    for c in cs: sc[c['id']]=(r,c)
PAT={
 'spec-edit-owed': r'spec edit (?:pending|owed)|spec correction pending|correction pending|edit owed|still names|still says|is stale|left un-updated|un-updated',
 'not-answered'  : r'has not answered|has not yet answered|not answered yet|awaiting (?:his|an) answer|has been asked and has not|neither reading is asserted',
 'divergence'    : r'where the .{0,80} (?:says something different|differs)|his decision is the (?:later word and is the )?authority',
 'spec-silent'   : r'specification is silent|spec is silent|no source (?:says|states)',
 'build-derived' : r'known and accepted|on purpose for now|do not raise this as a new problem|as per the build tested on',
}
hits={k:[] for k in PAT}
for cid,(rep,c) in sc.items():
    text=(c.get('custom_expected') or '')+'\n'+(c.get('refs') or '')
    for k,p in PAT.items():
        if re.search(p,text,re.I): hits[k].append((rep,cid,c['title'][:60]))
for k,v in hits.items():
    print(f'=== {k}: {len(v)}')
    for rep,cid,t in sorted(v): print(f'   {rep:4s} C{cid} {t}')
json.dump({k:[x[1] for x in v] for k,v in hits.items()}, open('claims.json','w'), indent=1)
