"""C38863 (spread past 8 weeks warns; >120 shifts refused) and C38865 (a multi-week
series keeps the same LOCAL start time across the clock change) - one long spread settles both.

America/Edmonton ends daylight saving on SUNDAY 1 NOVEMBER 2026 (MDT UTC-6 -> MST UTC-7).
A series starting 20 August and spanning 83 days runs to ~11 November, so it has shifts on
BOTH sides of the change.

Creates ONE series.  Deletes nothing.
"""
import json, sys, re, datetime, zoneinfo
sys.path.insert(0, "/home/user/Manual-test-Cases/build/schedule/finish5-2026-08-12/tools")
from api import call, nonget, now, CALLS, HEAVY

OUT = "/home/user/Manual-test-Cases/build/schedule/finish5-2026-08-12/evidence"
TZ = zoneinfo.ZoneInfo("America/Edmonton")
TECH = "ccbacb31-53f3-488e-9a7e-28f781761e62"
ev = {"cases": ["C38863", "C38865"], "read_at": now(), "build": "v3.5-65d6500",
      "location": "Staging Heavy Duty - 9919", "timezone": "America/Edmonton",
      "dst_change": "2026-11-01 (first Sunday in November; MDT UTC-6 -> MST UTC-7)",
      "guards": [], "series": {}, "dst": {}}

st, wos = call("GET", "/api/schedule/work-orders?limit=40", loc=HEAVY)
wo = sorted([x for x in wos["data"]["workOrders"] if x.get("lines")],
            key=lambda x: -(x.get("totalTimeEstimateMinutes") or 0))[0]
base = {"staff_id": TECH, "work_order_id": wo["id"],
        "line_ids": [l["id"] for l in wo["lines"]],
        "start_date": "2026-08-20", "spread_mode": "series"}
ev["work_order"] = {"number": wo["number"], "customer": wo.get("customerName"),
                    "estimate_minutes": wo.get("totalTimeEstimateMinutes"), "lines": len(wo["lines"])}
print(f"work order {wo['number']} · {wo.get('customerName')} · {len(wo['lines'])} lines")

# ---- C38863 step 4 · more than 120 shifts is REFUSED OUTRIGHT ---------------
b = dict(base); b["total_minutes"] = 100000
st1, r1 = call("POST", "/api/schedule/shifts", b, loc=HEAVY)
made1 = len(r1.get("data", {}).get("shifts", [])) if st1 in (200, 201) else 0
ev["guards"].append({"guard": ">120 shifts", "total_minutes": 100000, "status": st1,
                     "body": str(r1)[:300], "shifts_created": made1})
print(f"\n>120 guard: HTTP {st1}  created={made1}  {str(r1)[:160]}")

# and it may NOT be overridden - resubmit the same thing WITH the acknowledgement
b2 = dict(b); b2["acknowledgeLongSeries"] = True; b2["acknowledge_long_series"] = True
st2, r2 = call("POST", "/api/schedule/shifts", b2, loc=HEAVY)
made2 = len(r2.get("data", {}).get("shifts", [])) if st2 in (200, 201) else 0
ev["guards"].append({"guard": ">120 shifts WITH the acknowledgement - must still refuse",
                     "status": st2, "body": str(r2)[:300], "shifts_created": made2})
print(f">120 + acknowledgement: HTTP {st2}  created={made2}  {str(r2)[:160]}")

# ---- C38863 steps 1-2 · past 8 weeks WARNS, then creates on acknowledgement --
b3 = dict(base); b3["total_minutes"] = 42000
st3, r3 = call("POST", "/api/schedule/shifts", b3, loc=HEAVY)
span = re.search(r"span (\d+) days", str(r3))
ev["guards"].append({"guard": "past 8 weeks warns before creating", "total_minutes": 42000,
                     "status": st3, "body": str(r3)[:300],
                     "span_days": int(span.group(1)) if span else None,
                     "shifts_created": len(r3.get("data", {}).get("shifts", [])) if st3 in (200, 201) else 0})
print(f"\n8-week guard: HTTP {st3}  span={span.group(1) if span else '?'}  {str(r3)[:170]}")

# board before, so "created normally" is measured not assumed
def board(a, bb):
    s, r = call("GET", f"/api/schedule/board?from={a}T00:00:00Z&to={bb}T00:00:00Z", loc=HEAVY)
    return r["data"]["board"] if s == 200 else {"shifts": [], "series": []}

pre = {s["id"] for w in [("2026-08-01", "2026-09-30"), ("2026-09-30", "2026-11-25")]
       for s in board(*w)["shifts"]}

b4 = dict(b3); b4["acknowledgeLongSeries"] = True
st4, r4 = call("POST", "/api/schedule/shifts", b4, loc=HEAVY)
shifts = r4.get("data", {}).get("shifts", []) if st4 in (200, 201) else []
ev["guards"].append({"guard": "the SAME spread resubmitted WITH acknowledgeLongSeries",
                     "status": st4, "shifts_created": len(shifts),
                     "body": str(r4)[:200] if st4 not in (200, 201) else "created"})
print(f"acknowledged resubmit: HTTP {st4}  created={len(shifts)}")
assert shifts, r4

sid_series = shifts[0].get("seriesId")
ev["series"] = {"series_id": sid_series, "shift_count": len(shifts),
                "first": shifts[0]["startsAt"], "last": shifts[-1]["startsAt"]}
print(f"series {sid_series}: {len(shifts)} shifts, {shifts[0]['startsAt']} .. {shifts[-1]['startsAt']}")

# ---- C38865 · the SAME local wall-clock time on both sides of 1 November -----
rows = []
for s in shifts:
    u = datetime.datetime.fromisoformat(s["startsAt"].replace("Z", "+00:00"))
    loc = u.astimezone(TZ)
    rows.append({"id": s["id"], "utc": s["startsAt"],
                 "local_date": loc.strftime("%Y-%m-%d"), "local_time": loc.strftime("%H:%M"),
                 "utc_offset": loc.strftime("%z"), "dst": bool(loc.dst())})
before = [r for r in rows if r["local_date"] < "2026-11-01"]
after = [r for r in rows if r["local_date"] >= "2026-11-01"]
tb = sorted({r["local_time"] for r in before})
ta = sorted({r["local_time"] for r in after})
ev["dst"] = {"shifts_before_1_Nov": len(before), "shifts_on_or_after_1_Nov": len(after),
             "distinct_local_start_times_before": tb, "distinct_local_start_times_after": ta,
             "utc_offsets_before": sorted({r["utc_offset"] for r in before}),
             "utc_offsets_after": sorted({r["utc_offset"] for r in after}),
             "same_local_time_across_the_change": tb == ta,
             "sample_before": before[-3:], "sample_after": after[:3]}
print(f"\nC38865: {len(before)} shifts before 1 Nov, {len(after)} on/after")
print(f"  local start times before: {tb}   offsets {sorted({r['utc_offset'] for r in before})}")
print(f"  local start times after : {ta}   offsets {sorted({r['utc_offset'] for r in after})}")
print(f"  SAME local wall-clock time across the change: {tb == ta}")

ev["all_shift_rows"] = rows
ev["non_get_calls"] = nonget()
json.dump(ev, open(f"{OUT}/c38863-c38865.json", "w"), indent=1)
print("\nnon-GET calls:", json.dumps([{k: c[k] for k in ('m', 'path', 'status')} for c in nonget()]))
