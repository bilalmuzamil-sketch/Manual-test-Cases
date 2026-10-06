import json, re, html, sys

d = json.load(open("/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/bm_cases.json"))
cases = {c["id"]: c for c in d["cases"]}

def strip(t):
    if not t: return ""
    t = re.sub(r"<[^>]+>", " ", t)
    return html.unescape(re.sub(r"\s+", " ", t)).strip()

def body(c):
    return " ".join([strip(c.get("custom_preconds")), strip(c.get("custom_steps")), strip(c.get("custom_steps_separated") and json.dumps(c.get("custom_steps_separated")) or ""), strip(c.get("custom_expected"))])

mode = sys.argv[1]
if mode == "dump":
    for cid in sys.argv[2:]:
        c = cases[int(cid)]
        print(f"\n########## C{cid}  {c['title']} ##########")
        print("PRECONDS:", strip(c.get("custom_preconds"))[:1500])
        print("STEPS:", strip(c.get("custom_steps"))[:2500] or strip(json.dumps(c.get("custom_steps_separated")))[:2500])
        print("EXPECTED:", strip(c.get("custom_expected"))[:2500])
elif mode == "grep":
    kw = sys.argv[2].lower()
    for cid, c in sorted(cases.items()):
        txt = (c["title"] + " " + body(c)).lower()
        if kw in txt:
            # print title + snippet around kw
            idx = txt.find(kw)
            print(f"C{cid} [{c['title']}] ...{txt[max(0,idx-80):idx+120]}...")
