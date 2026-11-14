import json, csv
from collections import Counter
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"
L = json.load(open(f"{B}/currency-2026-11-14/live-before/live-2026-11-14.json"))
mp = {int(r["case_id"]): r["key"] for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
sec = {s["id"]: s for s in L["sections"]}
cases = {c["id"]: c for c in L["cases"]}
secmap = json.load(open(f"{B}/sections.json"))
print("sections.json", secmap if len(str(secmap))<600 else list(secmap.items())[:20])
print("sections under/used:")
cnt = Counter(c["section_id"] for c in L["cases"])
for sid, n in sorted(cnt.items()):
    s = sec.get(sid, {}); ours = sum(1 for c in L["cases"] if c["section_id"] == sid and c["id"] in mp)
    print(f"  {sid} parent={s.get('parent_id')} ours={ours} total={n} name={s.get('name')!r}")
print("created_by of non-map cases:", Counter(c["created_by"] for c in L["cases"] if c["id"] not in mp))
print("created_by of map cases:", Counter(c["created_by"] for c in L["cases"] if c["id"] in mp))
inrun = {t["case_id"] for t in L["tests"]}
print("map cases in run", len(inrun & set(mp)), "not in run", sorted(mp[i] + " C" + str(i) for i in set(mp) - inrun if i in cases))
foreign = [cases.get(t["case_id"]) for t in L["tests"] if t["case_id"] not in mp]
print("foreign tests", len(foreign), "missing case rows", sum(1 for f in foreign if f is None))
print("foreign created_by", Counter(f["created_by"] for f in foreign if f), "sections", Counter(f["section_id"] for f in foreign if f))
