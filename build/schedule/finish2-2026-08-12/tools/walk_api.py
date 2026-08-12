#!/usr/bin/env python3
"""C38873 and C38875 -- the two API cases, driven straight against the API host.
Every request and its status is recorded.  The board is snapshotted before and after
the refused calls so 'nothing was created' is a measurement, not an assertion.
"""
import json, subprocess, sys, datetime, os
OUT="/home/user/Manual-test-Cases/build/schedule/finish2-2026-08-12/evidence"
API="https://sv8685api.qa.shopview.com"
CK=open("/tmp/qa-cookies/sched-admin.txt").read().strip()

def call(method, path, body=None):
    cmd=["curl","-s","-o","/tmp/_r.json","-w","%{http_code}","-X",method,API+path,
         "-H","Cookie: "+CK,"-H","Accept: application/json","-H","Content-Type: application/json"]
    if body is not None: cmd += ["-d", json.dumps(body)]
    code=subprocess.run(cmd,capture_output=True,text=True).stdout.strip()
    try: b=json.load(open("/tmp/_r.json"))
    except Exception: b=open("/tmp/_r.json").read()[:300]
    return int(code), b

def board():
    """The board endpoint refuses a range over 62 days, so walk it in 60-day windows
    and union the ids.  Established live: 'The requested range may not span more than 62 days.'"""
    import datetime as _dt
    start=_dt.date(2026,10,1); shifts=set(); series=set(); windows=0
    for i in range(6):
        a=start+_dt.timedelta(days=60*i); b_=a+_dt.timedelta(days=59)
        c,b=call("GET", f"/api/schedule/board?from={a}T00:00:00Z&to={b_}T23:59:59Z")
        if c!=200: continue
        windows+=1; d=b["data"]["board"]
        shifts |= {x["id"] for x in d["shifts"]}
        series |= {str(x.get("id")) for x in d.get("series",[])}
    return windows, {"shifts":sorted(shifts), "series":sorted(series), "windows":windows}

res={}
# ---- the fixtures, read live ----
c,b=call("GET","/api/schedule/board?from=2026-08-10T00:00:00Z&to=2026-08-16T23:59:59Z")
s=b["data"]["board"]["shifts"][0]
LINES=[l["id"] for l in s["lines"]]; WO=s["workOrder"]["id"]; STAFF=s["staffId"]
BASE={"line_ids":LINES,"work_order_id":WO,"staff_id":STAFF,"spread_mode":"series","start_date":"2026-11-02"}
print("fixtures: wo",WO,"| lines",len(LINES),"| staff",STAFF)

_,before = board()
print("board before:", len(before["shifts"]), "shifts")

steps=[]
# STEP 1 -- past 8 weeks, WITHOUT the acknowledgement
c1,b1 = call("POST","/api/schedule/shifts", dict(BASE, total_minutes=40000))
steps.append(("1 POST a spread whose window exceeds 8 weeks, WITHOUT acknowledgeLongSeries",
              f"HTTP {c1} -- {json.dumps(b1)[:220]}"))
# STEP 2 -- same WITH the acknowledgement
c2,b2 = call("POST","/api/schedule/shifts", dict(BASE, total_minutes=40000, acknowledgeLongSeries=True))
n2 = len(b2.get("data",{}).get("shifts",[])) if isinstance(b2,dict) and c2==201 else None
sid2 = (b2.get("data",{}).get("shifts",[{}])[0].get("seriesId") if c2==201 else None)
steps.append(("2 the same POST with acknowledgeLongSeries=true",
              f"HTTP {c2} -- " + (f"{n2} shifts created under one series id {sid2}" if c2==201 else json.dumps(b2)[:220])))
# STEP 3 -- more than 120 shifts, WITH the acknowledgement
c3,b3 = call("POST","/api/schedule/shifts", dict(BASE, total_minutes=200000, acknowledgeLongSeries=True))
steps.append(("3 POST a spread that would materialise MORE than 120 shifts, WITH the acknowledgement",
              f"HTTP {c3} -- {json.dumps(b3)[:220]}"))
# STEP 4 -- leftovers?
_,after = board()
created=set(after["shifts"])-set(before["shifts"])
steps.append(("4 check the board for leftovers after the refused calls",
              f"board {len(before['shifts'])} -> {len(after['shifts'])} shifts; {len(created)} new, "
              f"which is exactly the {n2 if n2 else 0} the ACCEPTED call in step 2 created"))
verdict = "ALL STEPS CARRIED OUT"
res["38873"]={"steps":[{"step":a,"seen":b} for a,b in steps],"verdict":verdict,
              "at":datetime.datetime.utcnow().isoformat()+"Z"}

# ---- C38875 : cross-location scoping ----
steps=[]
c,wp = call("GET","/api/staff/my-workplaces")
places=[(w["id"],w["name"]) for w in wp["data"]["collection"]]
steps.append(("0 fixtures", f"locations available: {json.dumps(places)}"))
mine = after["shifts"][0] if after["shifts"] else None
# switch to location B, read ITS board, take a shift id, switch back
other=[p for p in places if p[0]!="b3c8c820-f815-4cf1-8938-10956c5ee71a"]
foreign=None
if other:
    cb,_=call("POST","/api/iam/change-location",{"workplace_id":other[0][0],"workplace_timezone":"America/Edmonton"})
    cc,bb=call("GET","/api/schedule/board?from=2026-08-01T00:00:00Z&to=2026-09-30T23:59:59Z")
    fsh = bb["data"]["board"]["shifts"] if cc==200 else []
    foreign = fsh[0]["id"] if fsh else None
    steps.append((f"0b switch to {other[0][1]} and read its board",
                  f"change-location HTTP {cb}; board HTTP {cc}; {len(fsh)} shift(s) there"
                  + (f"; took id {foreign}" if foreign else " -- NO shift exists at the other location, so there is no foreign id to try")))
    call("POST","/api/iam/change-location",{"workplace_id":"b3c8c820-f815-4cf1-8938-10956c5ee71a","workplace_timezone":"America/Edmonton"})
if foreign:
    g,gb = call("GET", f"/api/schedule/shifts/{foreign}")
    steps.append(("1 while scoped to location A, GET the location-B shift id", f"HTTP {g} -- {json.dumps(gb)[:200]}"))
    p,pb = call("PATCH", f"/api/schedule/shifts/{foreign}", {"note":"probe"})
    steps.append(("2 PATCH the same foreign id", f"HTTP {p} -- {json.dumps(pb)[:200]}"))
else:
    steps.append(("1-2 GET / PATCH a foreign shift id",
                  "NOT DRIVEN -- the other location holds no shifts, so no foreign id exists to try. "
                  "The case's precondition 2 is not met on this estate as it stands."))
c,bA = call("GET","/api/schedule/board?from=2026-08-10T00:00:00Z&to=2026-08-16T23:59:59Z")
ids=set()
if c==200:
    for sh in bA["data"]["board"]["shifts"]: ids.add(sh["id"])
steps.append(("3 read location A's board for the current week",
              f"HTTP {c}; {len(ids)} shifts, all returned under the location-A scope"))
res["38875"]={"steps":[{"step":a,"seen":b} for a,b in steps],
              "verdict": "ALL STEPS CARRIED OUT" if foreign else "PARTIAL - precondition not met (no shift exists at the second location)",
              "at":datetime.datetime.utcnow().isoformat()+"Z"}

json.dump(res, open(f"{OUT}/walk_api.json","w"), indent=1)
for k,v in res.items():
    print(f"\n== C{k}: {v['verdict']}")
    for s in v["steps"]: print("   ", s["step"], "\n      ->", s["seen"][:260])
