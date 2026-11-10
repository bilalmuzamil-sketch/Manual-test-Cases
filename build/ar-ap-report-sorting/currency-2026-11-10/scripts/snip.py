import json,re,html,sys,csv
exec(open('/home/user/Manual-test-Cases/build/ar-ap-report-sorting/currency-2026-11-10/scripts/assess.py').read().split('res = []')[0])
pat = re.compile(sys.argv[1], re.I); keys = set(sys.argv[2].split(',')) if len(sys.argv) > 2 and sys.argv[2] else None
for c in live:
    k = idmap[c["id"]]
    if keys and k not in keys: continue
    E = txt(c["custom_expected"]); head = E.split("Exact quotes from the source")[0]
    body = "\n".join([c["title"], txt(c["custom_preconds"]), txt(c["custom_steps"]), head])
    lines = [l.strip() for l in body.split("\n") if pat.search(l)]
    if lines:
        print(f"## {k} C{c['id']} {c['title']}")
        for l in lines[:6]: print("   ", l[:260])
