"""finish4 - the API case C38875, and seed a SERIES so the series cases become reachable.

Read-only for C38875.  The seed is test data, which the QA lead has authorised freely.
Cookies are read from /tmp only and are never written into the repository.
"""
import json, sys, datetime, urllib.request, urllib.error

OUT = "/home/user/Manual-test-Cases/build/schedule/finish4-2026-08-12/evidence"
API = "https://sv8685api.qa.shopview.com"
CK = open("/tmp/qa-cookies/sched-hdr.txt").read().strip()
WP = "b3c8c820-f815-4cf1-8938-10956c5ee71a"   # Staging Heavy Duty - 9919

def call(method, path, body=None, loc=WP):
    url = API + path
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "Cookie": CK, "Accept": "application/json", "Content-Type": "application/json",
        "X-Location-ID": loc,
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            raw = r.read().decode()
            return r.status, (json.loads(raw) if raw.strip().startswith(("{", "[")) else raw)
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        return e.code, (json.loads(raw) if raw.strip().startswith(("{", "[")) else raw)

log = {"read_at": datetime.datetime.utcnow().isoformat() + "Z", "build": "v3.5-65d6500", "calls": []}
def rec(tag, method, path, st, note=""):
    log["calls"].append({"tag": tag, "m": method, "path": path, "status": st, "note": note})
    print(f"  {tag}: {method} {path} -> {st} {note}")

# ---------------- board snapshot BEFORE anything ----------------
st, board = call("GET", "/api/schedule/board?from=2026-08-01T00:00:00Z&to=2026-09-15T00:00:00Z")
rec("board-BEFORE", "GET", "/api/schedule/board", st)
assert st == 200
d = board["data"]["board"]
shifts = d.get("shifts", [])
print(f"  shifts in window: {len(shifts)}")
json.dump(d, open(f"{OUT}/board-BEFORE.json", "w"))

# ---------------- C38875 : a shift from ANOTHER LOCATION returns 404 ----------------
# Find a location that is not Heavy Duty, and a shift that belongs to it.
st, wps = call("GET", "/api/staff/my-workplaces")
rec("workplaces", "GET", "/api/staff/my-workplaces", st)
wl = wps["data"]["collection"]
others = [w for w in wl if w.get("id") != WP]
print("  other locations:", [(w.get("id")[:8], w.get("name")) for w in others])

c38875 = {"steps": []}
# read the board AS another location, to get a shift id that is genuinely foreign
foreign_shift = None
for w in others:
    st2, b2 = call("GET", "/api/schedule/board?from=2026-08-01T00:00:00Z&to=2026-09-15T00:00:00Z", loc=w["id"])
    d2 = b2["data"]["board"]
    s2 = d2.get("shifts", [])
    rec(f"board-as-{w.get('name')}", "GET", "/api/schedule/board", st2, f"{len(s2)} shifts")
    ours = {s["id"] for s in shifts}
    cand = [s for s in s2 if s["id"] not in ours]
    if cand:
        foreign_shift = (w, cand[0]); break

if foreign_shift:
    w, s = foreign_shift
    c38875["foreign_location"] = {"id": w["id"], "name": w.get("name")}
    c38875["foreign_shift_id"] = s["id"]
    st3, b3 = call("GET", f"/api/schedule/shifts/{s['id']}", loc=WP)
    rec("C38875 foreign GET as Heavy Duty", "GET", f"/api/schedule/shifts/<foreign>", st3)
    c38875["steps"].append({"step": "request a shift belonging to another location while signed in to Staging Heavy Duty - 9919",
                            "seen": f"HTTP {st3}", "body": str(b3)[:300]})
    # control: our own shift on the same endpoint
    if shifts:
        st4, b4 = call("GET", f"/api/schedule/shifts/{shifts[0]['id']}", loc=WP)
        rec("C38875 CONTROL own shift", "GET", "/api/schedule/shifts/<own>", st4)
        c38875["control"] = {"own_shift_status": st4}
else:
    c38875["blocked"] = "no shift found that belongs only to another location"
    print("  C38875: no foreign shift available")

json.dump(c38875, open(f"{OUT}/c38875.json", "w"), indent=1)
json.dump(log, open(f"{OUT}/api_seed-log.json", "w"), indent=1)
print("\nNON-GET CALLS THIS RUN:", [c for c in log["calls"] if c["m"] != "GET"])
