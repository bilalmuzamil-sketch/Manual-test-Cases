"""Seed a SERIES on a SECOND technician for the same work order, so C30060's
precondition ('the SAME work order has a series on technician A and an independent
series on technician B') is actually reachable.  Test data - authorised freely.
"""
import json, sys, urllib.request, urllib.error, datetime
OUT = "/home/user/Manual-test-Cases/build/schedule/finish4-2026-08-12/evidence"
API = "https://sv8685api.qa.shopview.com"
CK = open("/tmp/qa-cookies/sched-hdr.txt").read().strip()
WP = "b3c8c820-f815-4cf1-8938-10956c5ee71a"

def call(m, p, body=None):
    req = urllib.request.Request(API + p, data=json.dumps(body).encode() if body is not None else None,
        method=m, headers={"Cookie": CK, "Accept": "application/json", "Content-Type": "application/json",
                           "X-Location-ID": WP, "User-Agent": "Mozilla/5.0 Chrome/120.0.0.0"})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            raw = r.read().decode(); return r.status, (json.loads(raw) if raw.strip().startswith(("{", "[")) else raw)
    except urllib.error.HTTPError as e:
        raw = e.read().decode(); return e.code, (json.loads(raw) if raw.strip().startswith(("{", "[")) else raw)

board = json.load(open(f"{OUT}/board-BEFORE.json"))
byId = {s["id"]: s for s in board["shifts"]}
target = byId["207e4f90-f3e5-4e1d-959e-d11022e4d527"]
wo = target["workOrder"]["id"]; techA = target["staffId"]
lines = [l["id"] for l in target["lines"]]
print("work order", target["workOrder"]["number"], "techA", techA[:8], "lines on this shift", len(lines))

# the work order's FULL line set - a subset is refused
st, wod = call("GET", f"/api/work-orders/{wo}")
allLines = None
if st == 200:
    d = wod.get("data", wod)
    for k in ("work_order", "workOrder", "order"):
        if isinstance(d, dict) and k in d: d = d[k]
    ls = d.get("lines") or d.get("work_order_lines") or []
    allLines = [l.get("id") for l in ls if l.get("id")]
print("work order lines:", len(allLines or []), "status", st)

# pick technician B: a technician with a row on the board who is not techA
techs = []
for dep in board["resources"]["departments"]:
    for t in dep.get("technicians", []): techs.append((t["id"], f"{t['firstName']} {t['lastName']}", dep["name"]))
techB = next((t for t in techs if t[0] != techA), None)
# prefer the named test technician if present
for t in techs:
    if "Qamar" in t[1]: techB = t; break
print("techB:", techB)

body = {"line_ids": allLines or lines, "work_order_id": wo, "staff_id": techB[0],
        "spread_mode": "series", "start_date": "2026-08-10", "total_minutes": 1200}
st, res = call("POST", "/api/schedule/shifts", body)
print("seed series ->", st, json.dumps(res)[:400])
out = {"attempt": {k: (v if k != "line_ids" else len(v)) for k, v in body.items()}, "status": st,
       "techA": techA, "techB": {"id": techB[0], "name": techB[1], "dept": techB[2]},
       "work_order": target["workOrder"], "at": datetime.datetime.utcnow().isoformat() + "Z"}
if st in (200, 201):
    d = res.get("data", res)
    out["created"] = json.dumps(d)[:1500]
json.dump(out, open(f"{OUT}/seed-series.json", "w"), indent=1)
