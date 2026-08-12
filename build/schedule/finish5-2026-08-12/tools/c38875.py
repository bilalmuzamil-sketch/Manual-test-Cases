"""C38875 - a shift from ANOTHER LOCATION returns 404, not another shop's data.

The case's precondition needs a shift to EXIST at location B.  Lethbridge's board holds
zero shifts, so nothing foreign exists to request - this seeds one (test data, tagged in
the evidence as ZZAUTOTEST-created), then drives the case from location A.

Creates ONE shift.  Deletes NOTHING.  Presses no destructive control.
"""
import json, sys
sys.path.insert(0, "/home/user/Manual-test-Cases/build/schedule/finish5-2026-08-12/tools")
from api import call, nonget, now, CALLS, HEAVY, LETH

OUT = "/home/user/Manual-test-Cases/build/schedule/finish5-2026-08-12/evidence"
ev = {"case": "C38875", "read_at": now(), "build": "v3.5-65d6500",
      "location_A": "Staging Heavy Duty - 9919", "location_B": "Staging Lethbridge - 4310",
      "checks": [], "steps": []}

WIN = "from=2026-08-01T00:00:00Z&to=2026-09-15T00:00:00Z"


def board(loc):
    st, r = call("GET", f"/api/schedule/board?{WIN}", loc=loc)
    assert st == 200, (st, r)
    return r["data"]["board"]


# ---- 0 · state before -------------------------------------------------------
bA, bB = board(HEAVY), board(LETH)
ev["before"] = {"A_shifts": len(bA["shifts"]), "B_shifts": len(bB["shifts"])}
print(f"before: A={len(bA['shifts'])} shifts   B={len(bB['shifts'])} shifts")

# technicians that belong to B and NOT to A, so the seeded shift is unambiguously foreign
tA = {t["id"] for dp in bA["resources"]["departments"] for t in dp.get("technicians", [])}
tB = [t for dp in bB["resources"]["departments"] for t in dp.get("technicians", [])]
only_B = [t for t in tB if t["id"] not in tA]
tech = only_B[0]
print(f"location-B-only technician: {tech['firstName']} {tech['lastName']}  {tech['id']}")

# ---- 1 · SEED a shift at location B -----------------------------------------
st, wos = call("GET", "/api/schedule/work-orders?limit=20", loc=LETH)
assert st == 200
wo = next(w for w in wos["data"]["workOrders"] if w.get("lines"))
body = {"staff_id": tech["id"], "work_order_id": wo["id"],
        "line_ids": [l["id"] for l in wo["lines"]],
        "start_date": "2026-08-20", "spread_mode": "single",
        "total_minutes": wo.get("totalTimeEstimateMinutes") or 60}
print("\nSEED payload:", json.dumps(body))
st, made = call("POST", "/api/schedule/shifts", body, loc=LETH)
print("POST /api/schedule/shifts ->", st, str(made)[:300])
assert st in (200, 201), (st, made)
sh = made["data"]
sid = (sh.get("shift") or sh).get("id") if isinstance(sh, dict) else None
if not sid:
    sids = (sh.get("shifts") or [])
    sid = sids[0]["id"] if sids else None
assert sid, made
ev["seeded"] = {"shift_id": sid, "at": "Staging Lethbridge - 4310",
                "work_order": wo["number"], "customer": wo.get("customerName"),
                "technician": f"{tech['firstName']} {tech['lastName']}",
                "start_date": "2026-08-20", "total_minutes": body["total_minutes"],
                "note": "test data; the QA lead has authorised seeding freely on this branch"}
print(f"seeded foreign shift {sid} on {wo['number']} at Lethbridge")

# confirm it really is on B's board and NOT on A's
bB2, bA2 = board(LETH), board(HEAVY)
onB = sid in {s["id"] for s in bB2["shifts"]}
onA = sid in {s["id"] for s in bA2["shifts"]}
ev["checks"].append({"check": "the seeded shift is on location B's board", "result": onB})
ev["checks"].append({"check": "the seeded shift is ABSENT from location A's board", "result": not onA})
print(f"on B's board: {onB}   on A's board: {onA}")

# ---- STEP 1 · GET the foreign id while scoped to A --------------------------
st1, r1 = call("GET", f"/api/schedule/shifts/{sid}", loc=HEAVY)
ev["steps"].append({"step": 1, "call": "GET /api/schedule/shifts/{foreign id} scoped to location A",
                    "status": st1, "body": str(r1)[:400]})
print(f"\nSTEP 1  GET foreign shift as A -> HTTP {st1}   {str(r1)[:200]}")

# control: the SAME endpoint scoped to B, to prove the route exists and the id is real
stc, rc = call("GET", f"/api/schedule/shifts/{sid}", loc=LETH)
ev["steps"].append({"step": "1-control", "call": "the same GET scoped to location B",
                    "status": stc, "note": "proves the route exists and the id is real",
                    "body": str(rc)[:400]})
print(f"CONTROL GET same shift as B  -> HTTP {stc}   {str(rc)[:200]}")

# ---- STEP 2 · PATCH the foreign id while scoped to A ------------------------
st2, r2 = call("PATCH", f"/api/schedule/shifts/{sid}", {"note": "ZZAUTOTEST cross-location probe"}, loc=HEAVY)
ev["steps"].append({"step": 2, "call": "PATCH /api/schedule/shifts/{foreign id} scoped to location A",
                    "status": st2, "body": str(r2)[:400]})
print(f"STEP 2  PATCH foreign shift as A -> HTTP {st2}   {str(r2)[:200]}")

# ---- STEP 3 · A's board contains only A's shifts ----------------------------
bA3 = board(HEAVY)
bB3 = board(LETH)
idsA, idsB = {s["id"] for s in bA3["shifts"]}, {s["id"] for s in bB3["shifts"]}
leak = idsA & idsB
ev["steps"].append({"step": 3, "call": "GET /api/schedule/board for location A",
                    "status": 200, "A_shifts": len(idsA), "B_shifts": len(idsB),
                    "ids_present_in_both": sorted(leak)})
print(f"STEP 3  A board={len(idsA)}  B board={len(idsB)}  ids in BOTH = {len(leak)}")

ev["non_get_calls"] = nonget()
ev["all_calls"] = CALLS
json.dump(ev, open(f"{OUT}/c38875.json", "w"), indent=1)
print("\nnon-GET calls made:", json.dumps(nonget()))
