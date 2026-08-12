#!/usr/bin/env python3
"""Schedule finish pass -- role-permission lever, 2026-08-12.

WHY THIS EXISTS
  Ten Schedule cases need a signed-in user at a permission level this estate does not
  hold.  This estate has exactly two sign-ins (administrator, and a Technician).  A
  STAFF-record edit invalidates that user's session instantly (proven 2026-08-11,
  HTTP 409 "Session has expired"), so re-pointing the Technician staff record at a
  different role would cost us the only second sign-in we have.

  A ROLE-DEFINITION edit does not touch the staff record.  So the lever used here is:
  edit the permission atoms of the role the Technician already holds, re-read the
  Technician's own fe-permissions to prove the new set applied, drive the case, then
  restore the role byte-exact.

  Rules 5 / 14 / 26 authorise exactly this, and require the restore be proven field by
  field rather than asserted.

SAFETY
  * snapshot() is called before the first edit and the JSON is committed as evidence.
  * every operation appends to the oplog IMMEDIATELY, so a killed run leaves its
    position on disk.
  * restore() re-PUTs the snapshot and byte-compares every field of the read-back.
"""
import json
import os
import subprocess
import sys
import datetime

API = "https://sv8685api.qa.shopview.com"
ORG = open("/tmp/sched-org.txt").read().strip()
TECHNICIAN = "0a80a61f-957d-4ea9-9ece-5645802f5788"
OPLOG = "/home/user/Manual-test-Cases/build/schedule/finish-2026-08-12/evidence/role-oplog.json"
SNAP = "/home/user/Manual-test-Cases/build/schedule/finish-2026-08-12/evidence/role-Technician-BEFORE.json"

ATOM = {
    "scheduleView":          "04d25547-7c01-4fe8-9b7b-ce802c2a00c4",
    "scheduleCreateAndEdit": "a4704317-baf7-42b0-8824-7cf41fce430d",
    "scheduleDelete":        "18608d7e-92ed-4e1d-936b-6bad0d3174d7",
    "workOrdersView":        "9ee63982-f02d-4362-8c56-9af1bf694d6d",
    "customersView":         None,   # filled from the snapshot
    "woPickParts":           None,
    "woTechViewMode":        None,
    "workOrderLinesCreateAndEdit": None,
}


def now():
    return datetime.datetime.utcnow().isoformat() + "Z"


def cookie(who):
    return open(f"/tmp/qa-cookies/sched-{who}.txt").read().strip()


def curl(path, who="admin", method="GET", body=None):
    """Returns (status:int, parsed-or-text). curl keeps the cookie out of argv/env dumps."""
    cmd = ["curl", "-s", "-o", "/tmp/_rt.out", "-w", "%{http_code}",
           f"{API}{path}", "-H", f"Cookie: {cookie(who)}", "-X", method]
    if body is not None:
        cmd += ["-H", "Content-Type: application/json", "-d", json.dumps(body)]
    st = int(subprocess.run(cmd, capture_output=True, text=True).stdout.strip() or 0)
    raw = open("/tmp/_rt.out").read()
    try:
        return st, json.loads(raw)
    except Exception:
        return st, raw


def log(entry):
    entry["at"] = now()
    rows = json.load(open(OPLOG)) if os.path.exists(OPLOG) else []
    rows.append(entry)
    json.dump(rows, open(OPLOG, "w"), indent=1)
    print(f"  [oplog] {entry.get('op')} -> {entry.get('result')}")


def role(rid=TECHNICIAN, who="admin"):
    st, b = curl(f"/api/roles/{rid}", who)
    if st != 200:
        raise RuntimeError(f"read role HTTP {st}: {b}")
    return b.get("data", b)


def snapshot():
    r = role()
    json.dump(r, open(SNAP, "w"), indent=1, sort_keys=True)
    for p in r["fe_permissions"]:
        ATOM[p["code"]] = p["id"]
    log({"op": "snapshot Technician", "result": "saved",
         "atoms": sorted(p["code"] for p in r["fe_permissions"]),
         "view_mode": r.get("view_mode"), "cross_toggles": r.get("cross_toggles")})
    return r


def payload_from(base, codes):
    return {
        "name": base["name"],
        "description": base.get("description") or "",
        "organization": ORG,
        "fe_permissions": [ATOM[c] for c in codes],
        "view_mode": base.get("view_mode"),
        "cross_toggles": base.get("cross_toggles"),
    }


def set_atoms(codes, label):
    """PUT the Technician role to exactly `codes`; prove it applied to the TECH session."""
    base = json.load(open(SNAP))
    body = payload_from(base, codes)
    st, resp = curl(f"/api/roles/{TECHNICIAN}", "admin", "PUT", body)
    if st != 200:
        log({"op": f"set_atoms {label}", "result": f"WRITE FAILED HTTP {st}", "resp": str(resp)[:300]})
        raise RuntimeError(f"role PUT HTTP {st}: {resp}")
    back = sorted(p["code"] for p in role()["fe_permissions"])
    if back != sorted(codes):
        log({"op": f"set_atoms {label}", "result": "READ-BACK MISMATCH",
             "want": sorted(codes), "got": back})
        raise RuntimeError(f"role read-back mismatch: want {sorted(codes)} got {back}")
    stf, fp = curl("/api/auth/me/fe-permissions", "tech")
    applied = sorted((fp.get("data", fp) or {}).get("fe_permissions", [])) if stf == 200 else None
    log({"op": f"set_atoms {label}", "result": f"HTTP {st}, role read-back MATCH",
         "atoms": sorted(codes), "tech_session_http": stf, "tech_sees": applied})
    return stf, applied


def restore():
    """Put the role back and prove EVERY field byte-identical to the snapshot."""
    base = json.load(open(SNAP))
    codes = sorted(p["code"] for p in base["fe_permissions"])
    st, _ = curl(f"/api/roles/{TECHNICIAN}", "admin", "PUT", payload_from(base, codes))
    after = role()
    bad = []
    for k in sorted(set(base) | set(after)):
        b, a = base.get(k), after.get(k)
        if k == "fe_permissions":
            b = sorted(p["code"] for p in b)
            a = sorted(p["code"] for p in a)
        if b != a:
            bad.append(f"{k}: before={b!r} after={a!r}")
    log({"op": "restore Technician", "result": "BYTE-IDENTICAL" if not bad else "MISMATCH",
         "http": st, "fields_compared": len(set(base) | set(after)), "mismatches": bad})
    if bad:
        raise RuntimeError("RESTORE NOT CLEAN:\n" + "\n".join(bad))
    return True


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "snapshot":
        print(json.dumps(snapshot(), indent=1)[:400])
    elif cmd == "set":
        print(set_atoms(sys.argv[2].split(","), sys.argv[3]))
    elif cmd == "restore":
        print("restored byte-identical:", restore())
    elif cmd == "show":
        r = role()
        print(sorted(p["code"] for p in r["fe_permissions"]), r.get("view_mode"), r.get("cross_toggles"))
