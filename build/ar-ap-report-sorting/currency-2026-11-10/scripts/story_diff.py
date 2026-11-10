import json, re, difflib, sys
S = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting/sources"
old = open(f"{S}/JIRA-SV-11315-stories-2026-10-26.md", encoding="utf-8").read()
parts = re.split(r"(?m)^# (SV-\d+) — .*$", old)
oldd = {parts[i]: parts[i+1] for i in range(1, len(parts), 2)}
new = {}
for f in ["JIRA-stories-SV-11531-11539-2026-11-10.json", "JIRA-epic-bugs-tasks-SV-11315-2026-11-10.json"]:
    for i in json.load(open(f"{S}/{f}"))["issues"]["nodes"]: new[i["key"]] = i["fields"].get("description") or ""
def norm(t):
    t = t.replace("\\", "").replace("**", "").replace(" ", " ")
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)
    return [re.sub(r"\s+", " ", l).strip(" -*") for l in t.splitlines() if l.strip(" -*#|")]
print("in 26 Oct copy:", sorted(oldd)); print("not in today's sweep:", sorted(set(oldd) - set(new)))
out = []
for k in sorted(oldd):
    if k not in new: continue
    d = list(difflib.unified_diff(norm(oldd[k]), norm(new[k]), "26 Oct", "10 Nov", n=0, lineterm=""))
    print(k, "diff lines", len(d))
    out.append(f"===== {k}\n" + "\n".join(d))
open(sys.argv[1], "w").write("\n".join(out))
