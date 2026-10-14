"""Read-only TestRail snapshot of Dashboard group 12166 (suite 1) and every subsection, fully paged.
GET requests only. Credentials from /tmp/testrail/creds.json, never printed. Usage: python3 -I snapshot_cases.py <outdir>"""
import json, urllib.request, base64, sys, os, time
C = json.load(open("/tmp/testrail/creds.json"))
AUTH = base64.b64encode(f"{C.get('email') or C.get('user')}:{C['password']}".encode()).decode()
HOST = (C.get("host") or "https://shopview.testrail.io").rstrip("/")
def get(ep):
    for a in range(4):
        try:
            r = urllib.request.Request(f"{HOST}/index.php?/api/v2/{ep}", headers={"Authorization": "Basic " + AUTH, "Content-Type": "application/json"})
            return json.load(urllib.request.urlopen(r, timeout=120))
        except Exception as e:
            if a == 3: raise SystemExit(f"GET failed {ep.split('&')[0]}: {str(e)[:120]}")
            time.sleep(2 * (a + 1))
def paged(ep, key):
    out, off = [], 0
    while True:
        d = get(f"{ep}&limit=250&offset={off}")
        items = d[key] if isinstance(d, dict) else d
        out += items
        if not isinstance(d, dict) or not (d.get("_links") or {}).get("next"): break
        off += len(items)
    return out
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
suite = get("get_suite/1"); pid = suite["project_id"]
secs = paged(f"get_sections/{pid}&suite_id=1", "sections")
kids = {}
for s in secs: kids.setdefault(s["parent_id"], []).append(s["id"])
tree, stack = [], [12166]
while stack:
    x = stack.pop(); tree.append(x); stack += kids.get(x, [])
names = {s["id"]: s["name"] for s in secs}
cases = []
for sid in tree:
    cases += paged(f"get_cases/{pid}&suite_id=1&section_id={sid}", "cases")
users = {}
for c in cases:
    json.dump(c, open(f"{out}/C{c['id']}.json", "w"), indent=1, ensure_ascii=False)
summ = {"taken_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "project_id": pid, "total_sections_in_suite": len(secs),
        "sections": [{"id": s, "name": names.get(s)} for s in tree], "cases": len(cases),
        "by_creator": {}, "ids": sorted(c["id"] for c in cases)}
for c in cases: summ["by_creator"][str(c["created_by"])] = summ["by_creator"].get(str(c["created_by"]), 0) + 1
json.dump(summ, open(f"{out}/_SUMMARY.json", "w"), indent=1)
print(json.dumps({k: v for k, v in summ.items() if k not in ("ids", "sections")}), len(tree), "sections")
