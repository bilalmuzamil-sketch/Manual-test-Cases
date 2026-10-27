#!/usr/bin/env python3
"""27 Oct 2026, QA lead: "Delete all 12 (Recommended)" — the 12 cases in Part Lifecycle's "Retire OR retest" section 54275.
Checks first, for every case, and nothing is deleted unless all 12 pass: still in section 54275, created by us (user 3), not flagged
Automated, unchanged since our last read-back (latest applied/C<id>-after.json of the 13/14 Oct updates), no result in any of the 308
open Nightly runs (retire-12-results-check.json, 27 Oct). Then: full snapshot, delete_case, get_case must answer 400.
python3 delete_retire_12.py [--apply]"""
import sys, os, json, glob, base64, urllib.request, urllib.error, datetime
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H); B = os.path.dirname(os.path.dirname(P))
sys.path.insert(0, f"{B}/dashboards/currency-2026-10-14/apply"); from trlib import api
IDS = [425659, 425758, 425639, 425759, 154761, 425602, 425622, 425629, 425701, 425723, 425755, 425776]
WHY = ("QA lead 27 Oct 2026: 'Delete all 12 (Recommended)' — the Retire OR retest section: 7 a manual tester cannot run, C154761 "
       "proposed for retirement 9 Oct, 4 for behaviour the PRD removed (Critical Reorder, dashboard inventory figure)")
res = json.load(open(f"{H}/retire-12-results-check.json"))
probs, plan = [], []
if res["hits"] or len(res["runs_checked"]) < 300: probs.append(f"results check: {len(res['hits'])} results, {len(res['runs_checked'])} runs")
for cid in IDS:
    live = api(f"get_case/{cid}")
    backs = sorted(glob.glob(f"{P}/update-2026-10-1*/applied/C{cid}-after.json"))
    last = max((json.load(open(f)) for f in backs), key=lambda a: a["updated_on"]) if backs else None
    if live.get("section_id") != 54275: probs.append(f"C{cid}: not in section 54275")
    if live.get("created_by") != 3: probs.append(f"C{cid}: created by {live.get('created_by')}")
    if live.get("custom_atmstatus") not in (1, None): probs.append(f"C{cid}: Automated flag")
    if last and live["updated_on"] != last["updated_on"]:
        # our own 14 Oct move into 54275 changes updated_on; accept only if the body is byte-identical and the last edit is ours
        same = all(live[k] == last[k] for k in ("title", "custom_preconds", "custom_steps", "custom_expected"))
        if not (same and live.get("updated_by") == 3): probs.append(f"C{cid}: changed since our last read-back")
    plan.append((cid, live, bool(last)))
print(f"checked {len(plan)} | problems {len(probs)}"); [print("  ", p) for p in probs]
for cid, live, hb in plan: print(f"  C{cid} read-back on file: {hb} | {live['title'][:70]}")
if "--apply" not in sys.argv or probs or len(plan) != 12: sys.exit(0)
c = json.load(open("/tmp/testrail/creds.json")); auth = base64.b64encode(f"{c.get('email') or c.get('user')}:{c['password']}".encode()).decode()
def raw(ep, post):
    r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{ep}", data=(b"{}" if post else None),
                               headers={"Authorization": f"Basic {auth}", "Content-Type": "application/json"})
    try: x = urllib.request.urlopen(r, timeout=120); return x.status, x.read().decode()
    except urllib.error.HTTPError as e: return e.code, e.read().decode()
os.makedirs(f"{H}/deleted", exist_ok=True); log = open(f"{H}/deleted/delete-log.jsonl", "a")
for cid, live, _ in plan:
    json.dump(live, open(f"{H}/deleted/C{cid}-snapshot.json", "w"), indent=1, ensure_ascii=False)
    st, _ = raw(f"delete_case/{cid}", True); gst, _ = raw(f"get_case/{cid}", False)
    log.write(json.dumps({"op": "delete_case", "case": f"C{cid}", "title": live["title"], "http": st, "gone_on_readback": gst == 400,
                          "readback_http": gst, "why": WHY, "at": datetime.datetime.utcnow().isoformat() + "Z"}, ensure_ascii=False) + "\n"); log.flush()
print("done")
