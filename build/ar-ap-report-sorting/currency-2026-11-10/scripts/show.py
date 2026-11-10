import json,re,html,sys
exec(open('/home/user/Manual-test-Cases/build/ar-ap-report-sorting/currency-2026-11-10/scripts/assess.py').read().split('res = []')[0])
want = sys.argv[1].split(','); full = len(sys.argv) > 2
for c in live:
    k = idmap[c["id"]]
    if k not in want: continue
    E = txt(c["custom_expected"]); head, _, tail = E.partition("Exact quotes from the source")
    print(f"######## {k} C{c['id']} | {c['title']} | refs {c.get('refs')}")
    print("PRE:", re.sub(r"\n+", " / ", txt(c["custom_preconds"]).strip())[:1500])
    print("STEPS:", re.sub(r"\n+", " / ", txt(c["custom_steps"]).strip())[:1200])
    print("RES:", re.sub(r"\n+", " / ", head.strip())[:2200])
    if full: print("TAIL:", re.sub(r"\n+", " / ", tail.strip())[:2500])
