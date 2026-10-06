import json
cases=json.load(open('/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/cases.json'))
def blob(c): return (c['title']+'\n'+c['pre']+'\n'+c['steps']+'\n'+c['exp']).lower()

for term in ['inspection','auto-post','autopost','customer portal','for customer','customer visible','attachment','report pdf']:
    found=[f"C{c['id']} [{c['sec']}] {c['title']}" for c in cases if term in blob(c)]
    print(f"\n'{term}': {len(found)}")
    for f in found[:12]: print("   "+f)
