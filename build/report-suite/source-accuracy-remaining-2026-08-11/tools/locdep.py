import json,re
sc={}
for r,cs in json.load(open('scope-cases.json')).items():
    for c in cs: sc[c['id']]=(r,c)
OLDTRIG=re.compile(r'(more than one location (?:is )?in scope|only when .{0,40}more than one location|with only one location|when a single location is in scope|not something you can switch on or off|not user-toggleable|in neither list|automatic Location column|appears by itself)',re.I)
hold=[]
for cid,(rep,c) in sorted(sc.items()):
    t=(c['title']+' '+(c.get('custom_preconds') or '')+' '+(c.get('custom_steps') or '')+' '+(c.get('custom_expected') or ''))
    m=sorted(set(x.lower() for x in OLDTRIG.findall(t)))
    if m: hold.append((rep,cid,c['title'][:62],m[:3]))
print('cases whose text uses the OLD location trigger:',len(hold))
for rep,cid,t,m in hold: print(f'  {rep:4s} C{cid} {t}')
json.dump([h[1] for h in hold], open('locdep.json','w'), indent=1)
