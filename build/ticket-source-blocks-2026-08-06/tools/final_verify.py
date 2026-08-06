import json,sys,os,glob
sys.path.insert(0,'.')
import jiralib as J
from adf import to_text
keys=sorted(os.path.basename(p)[:-5] for p in glob.glob('../snapshots/SV-*.json'))
os.makedirs('../final',exist_ok=True)
rows=[];bad=0
for k in keys:
    pre=json.load(open(f'../snapshots/{k}.json'))
    c,d=J.issue(k,out=f'../final/{k}.json')
    assert c=='200',(k,c)
    t=to_text(d['fields']['description'])
    n=t.count('Where this expected behaviour comes from')
    idx=t.find('Where this expected behaviour comes from')
    at_bottom = idx>=0 and 'Where this expected behaviour comes from' in t[len(t)//2:]
    pre_c=pre['fields']['description']['content']; post_c=d['fields']['description']['content']
    head=json.dumps(post_c[:len(pre_c)],sort_keys=True)==json.dumps(pre_c,sort_keys=True)
    fdiff=[f for f,v in pre['fields'].items() if f not in ('description','updated','lastViewed')
           and json.dumps(v,sort_keys=True)!=json.dumps(d['fields'].get(f),sort_keys=True)]
    ok = n==1 and head and not fdiff
    if not ok: bad+=1
    rows.append({'key':k,'blocks':n,'head_byte_identical':head,'other_fields_changed':fdiff,
                 'status':d['fields']['status']['name'],'priority':(d['fields'].get('priority') or {}).get('name'),
                 'type':d['fields']['issuetype']['name'],'parent':(d['fields'].get('parent') or {}).get('key'),
                 'block_is_last_section':bool(idx>=0 and idx> len(t)*0.5),'verdict':'PASS' if ok else 'FAIL'})
    print(f"{k}  blocks={n}  head_identical={head}  other_changed={fdiff}  {rows[-1]['verdict']}")
json.dump(rows,open('../FINAL-VERIFICATION.json','w'),indent=1)
print('\nTOTAL',len(rows),'FAIL',bad)
# SV-8923 untouched check
c,d=J.issue('SV-8923',out='../final/SV-8923.json')
f=d['fields']
print('SV-8923:',f['status']['name'],'| block present:', 'Where this expected behaviour comes from' in json.dumps(f.get('description')), '| updated', f['updated'])
