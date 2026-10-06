import json
cases=json.load(open('/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/cases.json'))
def blob(c): return (c['title']+'\n'+c['pre']+'\n'+c['steps']+'\n'+c['exp']).lower()

print("===== S3 Fixed Rules - sortable columns (sec 20467) full =====")
for c in cases:
    if c['section_id']==20467:
        print(f"\n  C{c['id']} {c['title']}")
        exp=c['exp'][:400].replace('\n',' ')
        print(f"      EXP: {exp}")

print("\n\n===== category-less / empty category / sorts last / no category anywhere =====")
for c in cases:
    b=blob(c)
    for t in ['without a category','no category','empty category','category cell','sorts last','category-less','without category','rules without']:
        if t in b:
            print(f"  C{c['id']} [{c['sec']}] {c['title']}  (term: {t})")
            break
