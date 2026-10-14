"""READ-ONLY: snapshot every live case under TestRail group 12166 (suite 1, all subsections, fully paged)
into snapshots-after-answers/, compare with snapshots-before/, and pull get_history_for_case for changed cases."""
import json, os, base64, time, urllib.request, glob
HOST = "https://shopview.testrail.io"
cr = json.load(open("/tmp/testrail/creds.json"))
auth = base64.b64encode(f"{cr['user']}:{cr.get('api_key') or cr['password']}".encode()).decode()
def get(p):
    for t in range(5):
        try:
            r = urllib.request.Request(f"{HOST}/index.php?/api/v2/{p}", headers={"Authorization": "Basic " + auth})
            return json.load(urllib.request.urlopen(r, timeout=180))
        except Exception as e:
            if t == 4: raise
            time.sleep(2 ** t)
def paged(ep, key):
    out, off = [], 0
    while True:
        j = get(f"{ep}&limit=250&offset={off}")
        out += j[key]
        if not j.get("_links", {}).get("next"): break
        off += 250
    return out
secs = paged("get_sections/1&suite_id=1", "sections")
kids = {}
for s in secs: kids.setdefault(s.get("parent_id"), []).append(s["id"])
tree, stack = [], [12166]
while stack:
    x = stack.pop(); tree.append(x); stack += kids.get(x, [])
cases = []
for sid in tree:
    cases += paged(f"get_cases/1&suite_id=1&section_id={sid}", "cases")
os.makedirs("snapshots-after-answers", exist_ok=True)
for c in cases:
    json.dump(c, open(f"snapshots-after-answers/C{c['id']}.json", "w"), indent=1, ensure_ascii=False)
before = {os.path.basename(f)[1:-5]: json.load(open(f)) for f in glob.glob("snapshots-before/C*.json")}
after = {str(c["id"]): c for c in cases}
TEXT = ["title", "custom_preconds", "custom_steps", "custom_expected", "custom_steps_separated", "refs",
        "custom_atmstatus", "custom_automation_type", "section_id", "priority_id", "type_id", "template_id"]
changed = {}
for cid in sorted(set(before) | set(after), key=int):
    b, a = before.get(cid), after.get(cid)
    if b is None or a is None:
        changed[cid] = {"status": "new" if b is None else "gone"}; continue
    f = [k for k in TEXT if str(b.get(k)) != str(a.get(k))]
    if f or str(b.get("updated_on")) != str(a.get("updated_on")):
        changed[cid] = {"status": "changed", "fields": f, "updated_by": a.get("updated_by"), "updated_on": a.get("updated_on"),
                        "before_updated_on": b.get("updated_on")}
hist = {}
for cid, v in changed.items():
    if v["status"] != "gone":
        try: hist[cid] = paged(f"get_history_for_case/{cid}", "history")
        except Exception as e: hist[cid] = {"error": str(e)[:200]}
json.dump({"sections": tree, "n_cases": len(cases), "changed": changed, "history": hist},
          open("answers-followup/snapshot-compare.json", "w"), indent=1, ensure_ascii=False)
print("sections", len(tree), "cases", len(cases), "before", len(before), "changed", len(changed))
for k, v in changed.items(): print(k, v)
