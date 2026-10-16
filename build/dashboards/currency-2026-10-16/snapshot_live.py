"""READ-ONLY: snapshot every live case under TestRail group 12166 (fully paged) into snapshots-live/ (16 Oct 2026)."""
import json, os, base64, time, urllib.request
HOST = "https://shopview.testrail.io"; D = os.path.dirname(os.path.abspath(__file__))
cr = json.load(open("/tmp/testrail/creds.json"))
auth = base64.b64encode(f"{cr.get('user') or cr['email']}:{cr.get('api_key') or cr['password']}".encode()).decode()
def get(p):
    for t in range(5):
        try:
            r = urllib.request.Request(f"{HOST}/index.php?/api/v2/{p}", headers={"Authorization": "Basic " + auth})
            return json.load(urllib.request.urlopen(r, timeout=180))
        except Exception:
            if t == 4: raise
            time.sleep(2 ** t)
def paged(ep, key):
    out, off = [], 0
    while True:
        j = get(f"{ep}&limit=250&offset={off}"); out += j[key]
        if not j.get("_links", {}).get("next"): return out
        off += 250
secs = paged("get_sections/1&suite_id=1", "sections"); kids = {}
for s in secs: kids.setdefault(s.get("parent_id"), []).append(s["id"])
tree, stack = [], [12166]
while stack:
    x = stack.pop(); tree.append(x); stack += kids.get(x, [])
cases = []
for sid in tree: cases += paged(f"get_cases/1&suite_id=1&section_id={sid}", "cases")
users = {}
os.makedirs(f"{D}/snapshots-live", exist_ok=True)
for c in cases: json.dump(c, open(f"{D}/snapshots-live/C{c['id']}.json", "w"), indent=1, ensure_ascii=False)
json.dump({str(k): v for k, v in users.items()}, open(f"{D}/snapshots-live/_users.json", "w"), indent=1)
print("sections", len(tree), "cases", len(cases))
