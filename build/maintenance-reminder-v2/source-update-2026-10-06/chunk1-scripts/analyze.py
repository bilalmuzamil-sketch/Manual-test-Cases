import json, re, sys

d = json.load(open("/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/di_cases.json"))
secname = {s["id"]: s["name"] for s in d["sections"]}
cases = d["cases"]

def strip(h):
    if not h: return ""
    t = re.sub(r"<[^>]+>", " ", h)
    t = re.sub(r"&nbsp;", " ", t)
    t = re.sub(r"&amp;", "&", t)
    t = re.sub(r"\s+", " ", t)
    return t.strip()

def fulltext(c):
    parts = [c.get("title","")]
    for k in ("custom_preconds","custom_steps","custom_expected"):
        parts.append(strip(c.get(k)))
    # separated steps
    for s in c.get("custom_steps_separated") or []:
        parts.append(strip(s.get("content",""))); parts.append(strip(s.get("expected","")))
    return " \n ".join(parts)

mode = sys.argv[1] if len(sys.argv)>1 else "list"

if mode == "list":
    cur = None
    for c in sorted(cases, key=lambda x:(x["section_id"], x["id"])):
        if c["section_id"] != cur:
            cur = c["section_id"]
            print(f"\n=== SEC {cur} :: {secname.get(cur)} ===")
        print(f"  C{c['id']}  {c['title']}")
    print(f"\nTOTAL {len(cases)}")

elif mode == "grep":
    terms = [t.lower() for t in sys.argv[2:]]
    for c in sorted(cases, key=lambda x:(x["section_id"], x["id"])):
        ft = fulltext(c).lower()
        if all(t in ft for t in terms):
            print(f"C{c['id']} [{secname.get(c['section_id'])}] {c['title']}")

elif mode == "show":
    ids = set(int(x) for x in sys.argv[2:])
    for c in cases:
        if c["id"] in ids:
            print(f"\n########## C{c['id']} [SEC {c['section_id']} {secname.get(c['section_id'])}] ##########")
            print("TITLE:", c["title"])
            print("--PRECONDS--\n", strip(c.get("custom_preconds")))
            print("--STEPS--\n", strip(c.get("custom_steps")))
            for i,s in enumerate(c.get("custom_steps_separated") or []):
                print(f"  step{i+1}:", strip(s.get("content","")), "=> EXP:", strip(s.get("expected","")))
            print("--EXPECTED--\n", strip(c.get("custom_expected")))

elif mode == "sec":
    ids = set(int(x) for x in sys.argv[2:])
    for c in sorted(cases, key=lambda x:x["id"]):
        if c["section_id"] in ids:
            print(f"\n--- C{c['id']}: {c['title']}")
            print("PRE:", strip(c.get("custom_preconds"))[:600])
            print("STEP:", strip(c.get("custom_steps"))[:800])
            sep = c.get("custom_steps_separated") or []
            if sep:
                print("STEPsep:", " | ".join(strip(s.get("content","")) for s in sep)[:800])
            print("EXP:", strip(c.get("custom_expected"))[:900])
