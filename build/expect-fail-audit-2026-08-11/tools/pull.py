import sys, json
sys.path.insert(0,'/tmp/testrail')
import tr
secs=[]; off=0
while True:
    st,b=tr.api(f"get_sections/1&suite_id=1&limit=250&offset={off}")
    assert st==200, b
    ch=b['sections'] if isinstance(b,dict) else b
    secs.extend(ch)
    if len(ch)==250: off+=250; continue
    break
json.dump(secs,open('sections.json','w'))
print('sections',len(secs))
cases=tr.get_cases()
json.dump(cases,open('all-cases.json','w'))
print('cases',len(cases))
