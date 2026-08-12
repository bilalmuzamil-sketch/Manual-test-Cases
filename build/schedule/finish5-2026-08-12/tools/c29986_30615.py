"""C29986 - the same work order on a SECOND technician spreads the full estimate again.
C30615 - an event's hours count toward the capacity bar but raise NO conflict.

Both are measured BEFORE and AFTER, per technician per day, from the board's own
capacity block - so "the fill increases" is a measurement, not an impression.

Creates two series and one event.  Deletes nothing.  Presses no destructive control.
"""
import json, sys, datetime
sys.path.insert(0, "/home/user/Manual-test-Cases/build/schedule/finish5-2026-08-12/tools")
from api import call, nonget, now, CALLS, HEAVY

OUT = "/home/user/Manual-test-Cases/build/schedule/finish5-2026-08-12/evidence"
ev = {"cases": ["C29986", "C30615"], "read_at": now(), "build": "v3.5-65d6500",
      "location": "Staging Heavy Duty - 9919"}
WIN = "from=2026-09-01T00:00:00Z&to=2026-09-20T00:00:00Z"


def board():
    st, r = call("GET", f"/api/schedule/board?{WIN}", loc=HEAVY)
    assert st == 200, (st, r)
    return r["data"]["board"]


def cap(b, staff, date):
    for d in b.get("capacity", []):
        if d["date"] == date:
            for t in d.get("technicians", []):
                if t["staffId"] == staff:
                    return {"date": date, "scheduledMinutes": t["scheduledMinutes"],
                            "availableMinutes": t["availableMinutes"],
                            "utilization": t["utilization"], "isOvertime": t["isOvertime"]}
    return None


b0 = board()
deps = b0["resources"]["departments"]
techs = [t for dp in deps for t in dp.get("technicians", [])]

# ============================ C29986 ========================================
# a work order about the size the case names ("for example 40h"), unspread
st, wos = call("GET", "/api/schedule/work-orders?limit=60", loc=HEAVY)
cands = [w for w in wos["data"]["workOrders"]
         if w.get("lines") and 1800 <= (w.get("totalTimeEstimateMinutes") or 0) <= 3000]
wo = cands[0]
EST = wo["totalTimeEstimateMinutes"]
A, B = techs[3], techs[4]
print(f"C29986  work order {wo['number']} · {wo.get('customerName')} · full estimate {EST} min "
      f"({EST/60:.1f}h) · {len(wo['lines'])} lines")
print(f"        technician A = {A['firstName']} {A['lastName']}   B = {B['firstName']} {B['lastName']}")

base = {"work_order_id": wo["id"], "line_ids": [l["id"] for l in wo["lines"]],
        "start_date": "2026-09-07", "spread_mode": "series", "total_minutes": EST}

stA, rA = call("POST", "/api/schedule/shifts", dict(base, staff_id=A["id"]), loc=HEAVY)
sA = rA.get("data", {}).get("shifts", [])
print(f"        spread on A -> HTTP {stA}, {len(sA)} shifts, {sum(x['durationMinutes'] for x in sA)} min")

# the SAME work order, the SAME full estimate, onto technician B
stB, rB = call("POST", "/api/schedule/shifts", dict(base, staff_id=B["id"]), loc=HEAVY)
sB = rB.get("data", {}).get("shifts", [])
print(f"        spread on B -> HTTP {stB}, {len(sB)} shifts, {sum(x['durationMinutes'] for x in sB)} min")

minA, minB = sum(x["durationMinutes"] for x in sA), sum(x["durationMinutes"] for x in sB)
ev["C29986"] = {
    "work_order": {"number": wo["number"], "customer": wo.get("customerName"),
                   "full_estimate_minutes": EST, "lines": len(wo["lines"])},
    "technician_A": {"name": f"{A['firstName']} {A['lastName']}", "id": A["id"],
                     "status": stA, "shifts": len(sA), "minutes": minA,
                     "series_id": sA[0].get("seriesId") if sA else None},
    "technician_B": {"name": f"{B['firstName']} {B['lastName']}", "id": B["id"],
                     "status": stB, "shifts": len(sB), "minutes": minB,
                     "series_id": sB[0].get("seriesId") if sB else None},
    "B_got_the_full_estimate_again": minB == EST,
    "B_was_not_reduced_by_As_booking": minB == minA == EST,
    "series_are_independent": (sA[0].get("seriesId") if sA else 1) != (sB[0].get("seriesId") if sB else 2),
    "planned_across_technicians": minA + minB,
    "exceeds_the_estimate_without_error": (minA + minB) > EST and stB in (200, 201),
    "error_on_the_second_spread": None if stB in (200, 201) else str(rB)[:300]}
print(f"        A={minA} min  B={minB} min  estimate={EST} min  "
      f"-> B full again: {minB == EST}; combined {minA+minB} > estimate, no error: "
      f"{(minA+minB) > EST and stB in (200,201)}")

# ============================ C30615 ========================================
# a technician who has a shift, and an event on the SAME day and time
TDAY = "2026-09-07"
b1 = board()
tgt = A["id"]
shifts_that_day = [s for s in b1["shifts"]
                   if s["staffId"] == tgt and s["startsAt"][:10] == TDAY]
print(f"\nC30615  technician {A['firstName']} {A['lastName']} has "
      f"{len(shifts_that_day)} shift(s) on {TDAY}")
before = cap(b1, tgt, TDAY)
conf_before = [s.get("conflicts") for s in shifts_that_day]
print(f"        capacity BEFORE the event: {before}")

st, made = call("POST", "/api/schedule/events", {
    "staff_id": tgt, "title": "ZZAUTOTEST capacity vs conflict",
    "starts_at": f"{TDAY}T15:00:00Z", "ends_at": f"{TDAY}T17:00:00Z",
    "is_all_day": False, "color": "#eaddff"}, loc=HEAVY)
print(f"        POST /api/schedule/events -> HTTP {st}  {str(made)[:200]}")

b2 = board()
after = cap(b2, tgt, TDAY)
shifts_after = [s for s in b2["shifts"] if s["staffId"] == tgt and s["startsAt"][:10] == TDAY]
evs_after = [e for e in b2.get("events", []) if e["staffId"] == tgt and e["startsAt"][:10] == TDAY]
print(f"        capacity AFTER  the event: {after}")

ev["C30615"] = {
    "technician": f"{A['firstName']} {A['lastName']}", "day": TDAY,
    "event_created": {"status": st, "body": str(made)[:300]},
    "shifts_on_the_day": len(shifts_that_day), "events_on_the_day_after": len(evs_after),
    "capacity_before": before, "capacity_after": after,
    "scheduled_minutes_rose": (before and after and after["scheduledMinutes"] > before["scheduledMinutes"]),
    "rise": (after["scheduledMinutes"] - before["scheduledMinutes"]) if (before and after) else None,
    "event_duration_minutes": 120,
    "conflicts_on_the_shifts_before": conf_before,
    "conflicts_on_the_shifts_after": [s.get("conflicts") for s in shifts_after],
    "board_conflictsComputed": b2.get("conflictsComputed")}
print(f"        scheduled minutes {before['scheduledMinutes'] if before else '?'} -> "
      f"{after['scheduledMinutes'] if after else '?'}  (event is 120 min)")
print(f"        conflicts on the day's shifts after: {[s.get('conflicts') for s in shifts_after]}")

ev["non_get_calls"] = nonget()
json.dump(ev, open(f"{OUT}/c29986-c30615.json", "w"), indent=1)
print("\nnon-GET calls:", json.dumps([{k: c[k] for k in ('m', 'path', 'status')} for c in nonget()]))
