import json
cases=json.load(open('/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/cases.json'))
def blob(c): return (c['title']+'\n'+c['pre']+'\n'+c['steps']+'\n'+c['exp']).lower()

print("===== 'fee' anywhere =====")
for c in cases:
    if 'fee' in blob(c):
        print(f"  C{c['id']} [{c['sec']}] {c['title']}")

print("\n===== S3 What Reaches QuickBooks (sec 20463) full titles =====")
for c in cases:
    if c['section_id']==20463:
        print(f"  C{c['id']} {c['title']}")

print("\n===== 'settings' + 'quickbooks' pages =====")
for c in cases:
    b=blob(c)
    if 'settings' in b and ('quickbooks' in b or 'qbo' in b):
        print(f"  C{c['id']} [{c['sec']}] {c['title']}")
