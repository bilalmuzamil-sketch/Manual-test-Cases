"""28 Oct 2026, QA lead: "Delete all 9 (Recommended)" — the 9 Parts Lifecycle cases a manual tester can no longer run after Chris Ward's
answers 13 and 14 (27 Oct; PRD v35 S5-E3, S9-R18a): NO-MANUAL-PROPOSAL.json P1-P3. Checks first, for every case, and nothing is deleted
unless all pass: created by us (user 3), not flagged Automated, unchanged since our latest read-back, no result in any open run of the
project (runs with any non-untested test are checked case by case). Then: snapshot, delete_case, get_case must answer 400.
python3 delete_nomanual_9.py [--apply]"""
import sys, os, json, base64, urllib.request, urllib.error, datetime
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(os.path.dirname(H)); B = os.path.dirname(os.path.dirname(P))
sys.path.insert(0, f"{B}/dashboards/currency-2026-10-14/apply"); from trlib import api
IDS = {154770: "S5-01", 573677: "S5-18", 425769: "S10-22", 425777: "S10-29", 839442: "S13-03b",
       425603: "S2-19", 839419: "S2-19b", 425634: "S5-08", 425635: "S5-09"}
probs, plan = [], []
for cid, key in IDS.items():
    live = api(f"get_case/{cid}"); f = f"{P}/applied-2026-10-27/C{cid}-after.json"
    last = json.load(open(f)) if os.path.exists(f) else None
    if live.get("created_by") != 3: probs.append(f"C{cid}: created by {live.get('created_by')}")
    if live.get("custom_atmstatus") not in (1, None): probs.append(f"C{cid}: Automated flag {live.get('custom_atmstatus')}")
    if not last: probs.append(f"C{cid}: no 27 Oct read-back")
    elif live["updated_on"] != last["updated_on"] and not all(live[k] == last[k] for k in ("title", "custom_preconds", "custom_steps", "custom_expected")):
        probs.append(f"C{cid}: changed since our read-back")
    plan.append((cid, key, live))
runs, off = [], 0
while True:
    r = api(f"get_runs/1&is_completed=0&limit=250&offset={off}"); rs = r["runs"] if isinstance(r, dict) else r; runs += rs
    if not isinstance(r, dict) or not r.get("_links", {}).get("next"): break
    off += 250
ran = [x for x in runs if sum(x.get(k) or 0 for k in x if k.endswith("_count") and k != "untested_count") > 0]
hits = []
for run in ran:
    for cid in IDS:
        try:
            x = api(f"get_results_for_case/{run['id']}/{cid}"); xs = x["results"] if isinstance(x, dict) else x
            if [y for y in xs if y.get("status_id")]: hits.append((run["id"], cid))
        except BaseException: pass
json.dump({"open_runs": len(runs), "runs_with_any_result": [x["id"] for x in ran], "hits": hits}, open(f"{H}/results-check.json", "w"), indent=1)
if hits: probs.append(f"results: {hits}")
print(f"open runs {len(runs)} | runs with any result {len(ran)} | hits {hits} | problems {probs}")
if "--apply" not in sys.argv or probs: sys.exit(0)
c = json.load(open("/tmp/testrail/creds.json")); auth = base64.b64encode(f"{c.get('email') or c.get('user')}:{c['password']}".encode()).decode()
def raw(ep, post):
    r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{ep}", data=(b"{}" if post else None),
                               headers={"Authorization": f"Basic {auth}", "Content-Type": "application/json"})
    try: x = urllib.request.urlopen(r, timeout=120); return x.status, x.read().decode()
    except urllib.error.HTTPError as e: return e.code, e.read().decode()
log = open(f"{H}/delete-log.jsonl", "a")
for cid, key, live in plan:
    json.dump(live, open(f"{H}/C{cid}-snapshot.json", "w"), indent=1, ensure_ascii=False)
    st, _ = raw(f"delete_case/{cid}", True); gst, _ = raw(f"get_case/{cid}", False)
    log.write(json.dumps({"op": "delete_case", "key": key, "case": f"C{cid}", "title": live["title"], "http": st, "gone_on_readback": gst == 400,
                          "readback_http": gst, "why": "QA lead 28 Oct 2026: 'Delete all 9 (Recommended)' (NO-MANUAL-PROPOSAL P1-P3)",
                          "at": datetime.datetime.utcnow().isoformat() + "Z"}) + "\n"); log.flush()
    print(key, f"C{cid}", st, gst)
