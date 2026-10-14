"""READ-ONLY: get_history_for_case for all 106 cases; report any history entry newer than the case's updated_on in snapshots-before/."""
import json, glob, os, base64, time, urllib.request
cr = json.load(open("/tmp/testrail/creds.json"))
auth = base64.b64encode(f"{cr['user']}:{cr.get('api_key') or cr['password']}".encode()).decode()
def get(p):
    for t in range(5):
        try:
            r = urllib.request.Request("https://shopview.testrail.io/index.php?/api/v2/" + p, headers={"Authorization": "Basic " + auth})
            return json.load(urllib.request.urlopen(r, timeout=120))
        except Exception:
            if t == 4: raise
            time.sleep(2 ** t)
res, newer = {}, []
for f in sorted(glob.glob("snapshots-before/C*.json")):
    b = json.load(open(f)); cid = str(b["id"]); cut = int(b["updated_on"])
    h = get(f"get_history_for_case/{cid}")
    hs = h.get("history", h) if isinstance(h, dict) else h
    latest = max((int(x.get("created_on", 0)) for x in hs), default=0)
    res[cid] = {"entries": len(hs), "latest": latest, "before_updated_on": cut}
    if latest > cut: newer.append(cid)
json.dump({"checked": len(res), "newer_than_before_snapshot": newer, "cases": res}, open("answers-followup/history-check.json", "w"), indent=1)
print("checked", len(res), "newer", newer)
