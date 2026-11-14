"""Print one or more library cases (model + rendered tester text) for a bounded human read.  python3 show.py KEY [KEY...] [--live]"""
import sys, os, json, importlib, re, html, csv
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"
sys.path.insert(0, f"{B}/authoring"); os.chdir(f"{B}/authoring")
import ar_lib as L, pattern as PT
for m in ["cases_s1","cases_s2","cases_s3","cases_s4","cases_s5","cases_s6_s9","cases_data","cases_rel","cases_design","cases_v11","cases_demo_2026_11_13"]: importlib.import_module(m)
by = {c["key"]: c for c in L.CASES}
mp = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
live = {c["id"]: c for c in json.load(open(f"{B}/currency-2026-11-14/live-before/live-2026-11-14.json"))["cases"]}
def strip(h): return re.sub(r"\n\s*\n+", "\n", html.unescape(re.sub(r"</(p|li)>", "\n", re.sub(r"<(?!/(p|li)>)[^>]+>", "", h or "")))).strip()
for k in [a for a in sys.argv[1:] if not a.startswith("--")]:
    c = by[k]; p = PT.pattern(c)
    print(f"===== {k} C{mp.get(k)} [{c['sec']}] {p['title']}\nPRE: " + " | ".join(p["pre"]))
    for i, (s, r) in enumerate(zip(p["steps"], p["results"]), 1): print(f"  {i}. {s}\n     => " + " / ".join(r))
    if c["note"]: print("  NOTE:", c["note"][:400])
    print("  codes:", sorted(L.codes_of(c)), "| marker:", c["marker"][:60])
    if "--live" in sys.argv and mp.get(k) in live:
        lv = live[mp[k]]
        print("  LIVE PRE:", strip(lv["custom_preconds"])[:1500].replace("\n", " | "))
        print("  LIVE STEPS:", strip(lv["custom_steps"]).replace("\n", " | ")[:1200])
        print("  LIVE EXP:", strip(lv["custom_expected"].split("Exact quotes")[0]).replace("\n", " | ")[:1500])
