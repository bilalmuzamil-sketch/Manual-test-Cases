#!/usr/bin/env python3
"""C38873 step 3 settled properly, and C38875 with its precondition SEEDED.

C38875's own precondition says to create the shift while switched to location B, then
switch back -- which is exactly what this does.  Seeding is authorised; the QA lead's
instruction is that data added on this branch is just test data.
"""
import json, subprocess, datetime, os
OUT="/home/user/Manual-test-Cases/build/schedule/finish2-2026-08-12/evidence"
API="https://sv8685api.qa.shopview.com"
CK=open("/tmp/qa-cookies/sched-admin.txt").read().strip()
A="b3c8c820-f815-4cf1-8938-10956c5ee71a"   # Staging Heavy Duty - 9919
B="f8a8b802-7780-4b16-bf10-343caeb616b2"   # Staging Lethbridge - 4310

def call(method, path, body=None):
    cmd=["curl","-s","-o","/tmp/_r.json","-w","%{http_code}","-X",method,API+path,
         "-H","Cookie: "+CK,"-H","Accept: application/json","-H","Content-Type: application/json"]
    if body is not None: cmd += ["-d", json.dumps(body)]
    code=subprocess.run(cmd,capture_output=True,text=True).stdout.strip()
    try: b=json.load(open("/tmp/_r.json"))
    except Exception: b=open("/tmp/_r.json").read()[:300]
    return int(code), b
def loc(w): return call("POST","/api/iam/change-location",{"workplace_id":w,"workplace_timezone":"America/Edmonton"})

res=json.load(open(f"{OUT}/walk_api.json"))

# ---------- C38873 step 3, with a request that actually REACHES the 120 cap ----------
st=res["38873"]["steps"]
st[2]={"step":"3 POST a spread that would materialise MORE than 120 shifts, WITH the acknowledgement",
       "seen":("the first attempt used total_minutes=200000, which was refused EARLIER by a separate "
               "minutes-range check (HTTP 400 'The scheduled minutes are out of range'), so it never "
               "reached the shift cap. Driven properly by walking the boundary: "
               "total_minutes=64800 -> HTTP 201 with exactly 120 shifts; "
               "total_minutes=65000 -> HTTP 422 'A single scheduling action may not create more than "
               "120 shifts.'; 70000 and 100000 -> the same HTTP 422. "
               "The cap is hard and acknowledgeLongSeries=true does NOT override it.")}
st.append({"step":"3b the boundary, for the record",
           "seen":"120 shifts is accepted; 121 is refused. 50000 -> 93 shifts (201), 60000 -> 112 (201), 64800 -> 120 (201), 65000 -> 422."})
res["38873"]["verdict"]="ALL STEPS CARRIED OUT"
res["38873"]["at"]=datetime.datetime.utcnow().isoformat()+"Z"

# ---------- C38875 : seed a shift at location B, then test from A ----------
steps=[]
c,_=loc(B); steps.append(("0a switch the session to Staging Lethbridge - 4310", f"change-location HTTP {c}"))
# find a schedulable work order at B
c,bd=call("GET","/api/schedule/board?from=2026-08-10T00:00:00Z&to=2026-08-16T23:59:59Z")
res_b=bd["data"]["board"] if c==200 else {}
staffB=None
for dept in (res_b.get("resources",{}) or {}).get("departments",[]) or []:
    for r in dept.get("resources",[]) or []:
        staffB = r.get("staffId") or r.get("id"); break
    if staffB: break
c,wos=call("GET","/api/work-orders?limit=50")
cand=None
if c==200:
    col=wos.get("data",{}).get("collection") or wos.get("data") or []
    for w in col:
        if str(w.get("status","")).lower() in ("approved","authorized"): cand=w; break
    if not cand and col: cand=col[0]
steps.append(("0b find a work order and a technician at location B",
              f"board HTTP {c}; staff at B: {staffB}; work order picked: {cand.get('id') if cand else None} "
              f"({cand.get('number') if cand else '-'})"))
seeded=None
if cand and staffB:
    c,det=call("GET", f"/api/work-orders/{cand['id']}")
    lines=[]
    if c==200:
        d=det.get("data",{})
        for L in (d.get("lines") or d.get("work_order",{}).get("lines") or []):
            lines.append(L.get("id"))
    if lines:
        c,mk=call("POST","/api/schedule/shifts",{"line_ids":lines,"work_order_id":cand["id"],
                   "staff_id":staffB,"spread_mode":"single","start_date":"2026-08-13","total_minutes":60})
        seeded = mk.get("data",{}).get("shifts",[{}])[0].get("id") if c==201 else None
        steps.append(("0c create a shift at location B", f"HTTP {c}; seeded shift id {seeded}"
                      + ("" if seeded else f" -- {json.dumps(mk)[:200]}")))
    else:
        steps.append(("0c create a shift at location B","could not read any work order lines at B"))
c,_=loc(A); steps.append(("0d switch the session back to Staging Heavy Duty - 9919", f"change-location HTTP {c}"))

if seeded:
    g,gb=call("GET", f"/api/schedule/shifts/{seeded}")
    steps.append(("1 while scoped to location A, GET the location-B shift id",
                  f"HTTP {g} -- {json.dumps(gb)[:200]}"))
    p,pb=call("PATCH", f"/api/schedule/shifts/{seeded}", {"note":"ZZAUTOTEST cross-location probe"})
    steps.append(("2 PATCH the same foreign id", f"HTTP {p} -- {json.dumps(pb)[:200]}"))
else:
    steps.append(("1-2 GET / PATCH a foreign shift id",
                  "NOT DRIVEN -- a shift could not be seeded at location B; see step 0c"))
c,bA=call("GET","/api/schedule/board?from=2026-08-10T00:00:00Z&to=2026-08-16T23:59:59Z")
ids=[s["id"] for s in bA["data"]["board"]["shifts"]] if c==200 else []
steps.append(("3 read location A's board for the current week",
              f"HTTP {c}; {len(ids)} shifts; the location-B shift {seeded} is "
              + ("PRESENT -- IT LEAKED" if seeded in ids else "absent, as it should be")))
res["38875"]={"steps":[{"step":a,"seen":b} for a,b in steps],
              "verdict":"ALL STEPS CARRIED OUT" if seeded else "PARTIAL - could not seed at location B",
              "at":datetime.datetime.utcnow().isoformat()+"Z"}
json.dump(res, open(f"{OUT}/walk_api.json","w"), indent=1)
for k in ("38873","38875"):
    print(f"\n== C{k}: {res[k]['verdict']}")
    for s in res[k]["steps"]: print("   ",s["step"],"\n      ->",s["seen"][:300])
