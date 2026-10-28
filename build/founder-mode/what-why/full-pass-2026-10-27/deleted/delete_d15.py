"""28 Oct 2026, QA lead: "Delete it (Recommended)" — the held design-version case D-15 C839525 (DV-04), after Product answer 12
(27 Oct: an imported invoice never appears in the report; the board's example is illustrative; the page wins).
Checks: in section 105855, created by us (user 3), not flagged Automated, unchanged since our 27 Oct read-back, no result in any open
run of the project. Then: full snapshot, delete_case, get_case must answer 400. python3 delete_d15.py [--apply]"""
import sys, os, json, base64, urllib.request, urllib.error, datetime
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(os.path.dirname(H)); B = os.path.dirname(os.path.dirname(P))
sys.path.insert(0, f"{B}/dashboards/currency-2026-10-14/apply"); from trlib import api
CID = 839525
live = api(f"get_case/{CID}"); last = json.load(open(f"{P}/applied-2026-10-27/C{CID}-after.json"))
probs = []
if live.get("section_id") != 105855: probs.append("not in section 105855")
if live.get("created_by") != 3: probs.append(f"created by {live.get('created_by')}")
if live.get("custom_atmstatus") not in (1, None): probs.append("Automated flag")
if live["updated_on"] != last["updated_on"] and not all(live[k] == last[k] for k in ("title", "custom_preconds", "custom_steps", "custom_expected")):
    probs.append("changed since our 27 Oct read-back")
runs, off = [], 0
while True:
    r = api(f"get_runs/1&is_completed=0&limit=250&offset={off}"); rs = r["runs"] if isinstance(r, dict) else r
    runs += rs
    if not isinstance(r, dict) or not r.get("_links", {}).get("next"): break
    off += 250
hits = []
for run in runs:
    try:
        x = api(f"get_results_for_case/{run['id']}/{CID}")
        xs = x["results"] if isinstance(x, dict) else x
        if [y for y in xs if y.get("status_id")]: hits.append(run["id"])
    except BaseException:
        pass   # 400: the case is not in that run
json.dump({"case": f"C{CID}", "runs_checked": len(runs), "runs_with_results": hits}, open(f"{H}/results-check-C{CID}.json", "w"), indent=1)
if hits: probs.append(f"results in runs {hits}")
print(f"open runs checked {len(runs)} | runs with results {hits} | problems {probs} | {live['title']}")
if "--apply" not in sys.argv or probs: sys.exit(0)
c = json.load(open("/tmp/testrail/creds.json")); auth = base64.b64encode(f"{c.get('email') or c.get('user')}:{c['password']}".encode()).decode()
def raw(ep, post):
    r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{ep}", data=(b"{}" if post else None),
                               headers={"Authorization": f"Basic {auth}", "Content-Type": "application/json"})
    try: x = urllib.request.urlopen(r, timeout=120); return x.status, x.read().decode()
    except urllib.error.HTTPError as e: return e.code, e.read().decode()
json.dump(live, open(f"{H}/C{CID}-snapshot.json", "w"), indent=1, ensure_ascii=False)
st, _ = raw(f"delete_case/{CID}", True); gst, _ = raw(f"get_case/{CID}", False)
open(f"{H}/delete-log.jsonl", "a").write(json.dumps({"op": "delete_case", "case": f"C{CID}", "title": live["title"], "http": st,
    "gone_on_readback": gst == 400, "readback_http": gst, "why": "QA lead 28 Oct 2026: 'Delete it (Recommended)' after Product answer 12",
    "at": datetime.datetime.utcnow().isoformat() + "Z"}) + "\n")
print("delete", st, "| read-back", gst)
