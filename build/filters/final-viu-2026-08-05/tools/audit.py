import json, re, csv, collections
cs={c['id']:c for c in json.load(open('/tmp/fv/cases-PRE.json'))}
R=json.load(open('/tmp/fv/spec-reqs-v18.json'))
secs={s['id']:s['name'] for s in json.load(open('/tmp/fv/sections-4110.json'))}
idm={}
for r in csv.DictReader(open('/home/user/Manual-test-Cases/build/filters/testrail-id-map.csv')):
    idm[r['testrail_case_id'].lstrip('C')]=r

# --- the four-way classification, decided case by case from the evidence read above ---
# A = build-derived expectation OVERRIDING a documented requirement -> RESTORE
A = {
 29557:('S1-R1','"Known and accepted: on the build tested the filter buttons sit on the same row as the tabs instead of on their own row below them. The product behaves this way on purpose for now. Do not raise this as a new problem."','SV-8843'),
 29602:('S1-R5','"Known and accepted: on the build tested collapsing the bar does not move the table up, because the buttons share the tab row. The product behaves this way on purpose for now. Do not raise this as a new problem."','SV-8843'),
 29606:('S8-R3','"Known and accepted: when only a search is active the message still says \\"filters\\" and the only link offered is Clear Filters. The product behaves this way on purpose for now. Do not raise this as a new problem."','SV-8847'),
 29607:('S8-R4','"Known and accepted: the empty screen offers no way to clear the search on its own. The product behaves this way on purpose for now. Do not raise this as a new problem."','SV-8847'),
 38899:('S8-R4','"Known and accepted: the empty screen offers no way to clear the search on its own. The product behaves this way on purpose for now. Do not raise this as a new problem."','SV-8847'),
}
# D = our own unsourced / build-enumerated assertion -> remove or make scope-conditional
D = {38882:'item 1 enumerates the ten ready-made periods as seen on the build; the specification deliberately does not fix the list ("standard predefined ranges")'}
# B = build-derived AND the spec is silent -> cannot be restored; needs a PO answer
B = {}
# the 8 not-built Parts/Reports cases: assertion is design+PO sourced (C), but the PROVENANCE
# falsely names the build as the source of an expectation for a feature that is not in the product
PROV_FALSE = [38904,38905,38906,38907,38908,38909,38910,38911]

rows=[]
for cid in sorted(cs):
    c=cs[cid]; iid=idm.get(str(cid),{}).get('internal_id','?')
    exp=c.get('custom_expected') or ''
    head=exp.split('\n---\n')[0]
    anchors=re.findall(r'S\d+-[RNE]\d+', c.get('refs') or '')
    quoted=[]
    for a in dict.fromkeys(anchors):
        if a in R: quoted.append((a,R[a]))
    if cid in A: cls='A'
    elif cid in D: cls='D'
    elif cid in B: cls='B'
    else: cls='C'
    rows.append(dict(cid=cid,iid=iid,sec=secs[c['section_id']],title=c['title'],cls=cls,
        anchors=anchors,quoted=quoted,head=head,marker=re.findall(r'AUTOMATION: .*',exp),
        provfalse=cid in PROV_FALSE))
json.dump(rows,open('/tmp/fv/audit-rows.json','w'),indent=1)
print('classified', collections.Counter(r['cls'] for r in rows))
print('rows with NO spec anchor quotable:', sum(1 for r in rows if not r['quoted']))
for r in rows:
    if not r['quoted']: print('   C%d %s | refs=%s'%(r['cid'],r['iid'],(cs[r['cid']].get('refs') or '')[:110]))
