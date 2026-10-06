import json, re
cases=json.load(open('/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/cases.json'))

def blob(c): return (c['title']+'\n'+c['pre']+'\n'+c['steps']+'\n'+c['exp']).lower()

def hits(terms, label):
    print(f"\n===== {label} =====")
    for c in cases:
        b=blob(c)
        matched=[t for t in terms if t in b]
        if matched:
            print(f"  C{c['id']} [{c['sec']}] {c['title']}")
            print(f"       matched: {matched}")

# SV-10398 per-fee QBO mapping
hits(['income account','product/service','products/services','qbo','map','mapping','fee item','shipping income','cc fee'], "SV-10398 QBO per-fee mapping")
