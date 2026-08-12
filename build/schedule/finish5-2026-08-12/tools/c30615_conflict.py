"""C30615 - the conflict half, measured against the fields that actually exist.

CORRECTION TO OUR OWN EARLIER READING: the first probe read `shift.conflicts`, which is
NOT a field on this payload and is therefore null on every shift - it would have "proved"
no conflict on a board where every shift conflicted.  The real fields are `isConflict`
and `conflictReasons`.  The mistake was ours, it was caught by reading the payload's own
key list, and the measurement below is the repeat.

Creates one event that DELIBERATELY overlaps a shift.  Deletes nothing.
"""
import json, sys
sys.path.insert(0, "/home/user/Manual-test-Cases/build/schedule/finish5-2026-08-12/tools")
from api import call, nonget, now, HEAVY

OUT = "/home/user/Manual-test-Cases/build/schedule/finish5-2026-08-12/evidence"
WIN = "from=2026-09-01T00:00:00Z&to=2026-09-20T00:00:00Z"
TECH = "7a495a78-5972-4a2d-8631-ecd9555d6b07"   # Brittany Rodriguez
DAY = "2026-09-07"


def bd():
    st, r = call("GET", f"/api/schedule/board?{WIN}", loc=HEAVY)
    assert st == 200
    return r["data"]["board"]


def conflicts(b):
    hits = [{"id": s["id"], "staffId": s["staffId"], "startsAt": s["startsAt"],
             "reasons": s.get("conflictReasons")} for s in b["shifts"] if s.get("isConflict")]
    return hits


def cap(b, staff, date):
    for d in b.get("capacity", []):
        if d["date"] == date:
            for t in d.get("technicians", []):
                if t["staffId"] == staff:
                    return {"scheduledMinutes": t["scheduledMinutes"],
                            "availableMinutes": t["availableMinutes"],
                            "utilization": t["utilization"], "isOvertime": t["isOvertime"]}


b1 = bd()
c1 = conflicts(b1)
cap1 = cap(b1, TECH, DAY)
sh = [s for s in b1["shifts"] if s["staffId"] == TECH and s["startsAt"][:10] == DAY]
ev1 = [e for e in b1.get("events", []) if e["staffId"] == TECH and e["startsAt"][:10] == DAY]
print(f"BEFORE  board conflicts={len(c1)}   {TECH[:8]} on {DAY}: "
      f"{len(sh)} shift(s), {len(ev1)} event(s), capacity {cap1}")
for s in sh:
    print(f"   shift {s['id'][:8]}  {s['startsAt']} -> {s['endsAt']}  "
          f"isConflict={s.get('isConflict')}  reasons={s.get('conflictReasons')}")

# an event placed WHOLLY INSIDE the shift's hours - the strongest possible overlap
st, made = call("POST", "/api/schedule/events", {
    "staff_id": TECH, "title": "ZZAUTOTEST overlap - inside the shift",
    "starts_at": f"{DAY}T13:00:00Z", "ends_at": f"{DAY}T14:30:00Z",
    "is_all_day": False, "color": "#eaddff"}, loc=HEAVY)
print(f"\ncreated an overlapping 90-minute event -> HTTP {st}")

b2 = bd()
c2 = conflicts(b2)
cap2 = cap(b2, TECH, DAY)
sh2 = [s for s in b2["shifts"] if s["staffId"] == TECH and s["startsAt"][:10] == DAY]
ev2 = [e for e in b2.get("events", []) if e["staffId"] == TECH and e["startsAt"][:10] == DAY]
print(f"AFTER   board conflicts={len(c2)}   {TECH[:8]} on {DAY}: "
      f"{len(sh2)} shift(s), {len(ev2)} event(s), capacity {cap2}")
for s in sh2:
    print(f"   shift {s['id'][:8]}  isConflict={s.get('isConflict')}  reasons={s.get('conflictReasons')}")

out = {"case": "C30615", "read_at": now(), "build": "v3.5-65d6500",
       "correction": "the first probe read shift.conflicts, which is not a field on this "
                     "payload; the real fields are isConflict and conflictReasons",
       "technician": "Brittany Rodriguez", "day": DAY,
       "event_placed": "13:00-14:30Z, wholly inside the shift's 12:00-21:00Z hours",
       "event_create_status": st,
       "before": {"board_conflict_shifts": len(c1), "conflict_rows": c1,
                  "capacity": cap1, "events_on_the_day": len(ev1),
                  "target_shifts": [{"id": s["id"], "isConflict": s.get("isConflict"),
                                     "conflictReasons": s.get("conflictReasons"),
                                     "startsAt": s["startsAt"], "endsAt": s["endsAt"]} for s in sh]},
       "after": {"board_conflict_shifts": len(c2), "conflict_rows": c2,
                 "capacity": cap2, "events_on_the_day": len(ev2),
                 "target_shifts": [{"id": s["id"], "isConflict": s.get("isConflict"),
                                    "conflictReasons": s.get("conflictReasons")} for s in sh2]},
       "capacity_rose_by": (cap2["scheduledMinutes"] - cap1["scheduledMinutes"]) if cap1 and cap2 else None,
       "event_duration_minutes": 90,
       "board_conflict_count_unchanged": len(c1) == len(c2),
       "overlapped_shift_still_not_a_conflict": all(not s.get("isConflict") for s in sh2),
       "non_get_calls": nonget()}
json.dump(out, open(f"{OUT}/c30615-conflict.json", "w"), indent=1)
print(f"\ncapacity rose by {out['capacity_rose_by']} min (the event is 90 min)")
print(f"board conflict count unchanged: {out['board_conflict_count_unchanged']}")
print(f"the overlapped shift is still NOT a conflict: {out['overlapped_shift_still_not_a_conflict']}")
