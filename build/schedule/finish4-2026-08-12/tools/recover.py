"""finish4 PHASE 1 - prove, BY CONTENT, what the killed finish3 pass actually landed.

Never by updated_on: a fresh timestamp is not evidence a write landed, and TestRail
re-renders text without moving it at all.  Every check below reads the case body.
"""
import json, re, sys, datetime
sys.path.insert(0, "/tmp/testrail"); import tr

OUT = "/home/user/Manual-test-Cases/build/schedule/finish4-2026-08-12/evidence"
BUILD = "v3.5-65d6500"
STAMP = f"Last checked against build {BUILD} on 12 August 2026."

oplog = json.load(open("/home/user/Manual-test-Cases/build/schedule/finish3-2026-08-12/evidence/testrail-oplog.json"))
written = sorted({o["cid"] for o in oplog})

# the content each op claimed to leave behind
EXPECT = {}
for cid in written:
    EXPECT[cid] = [("stamp", STAMP)]
for cid in (29973, 29974, 29975):
    EXPECT[cid].append(("unassigned-note", "there is no Unassigned row in the grid"))
    EXPECT[cid].append(("hold-marker", "AUTOMATION: HOLD - the Unassigned row does not exist"))
EXPECT[29980].append(("sv9005-new", "on this build that no longer happens"))
EXPECT[30064].append(("toast-4to7", "stays on screen for between 4 and 7 seconds"))
EXPECT[29967].append(("all-scopecond", "All <number of lines>"))

ABSENT = {
    29980: [("sv9005-stale", "Note on point 2:")],
    30064: [("toast-7s", "persists about 7 seconds")],
    29967: [("all27", "'All 27' chip")],
}

rows = []
for cid in written:
    st, c = tr.get_case(cid)
    assert st == 200, (cid, st)
    exp = c.get("custom_expected") or ""
    checks = []
    ok = True
    for name, needle in EXPECT[cid]:
        hit = needle in exp
        checks.append({"check": name, "want": "present", "found": hit})
        ok = ok and hit
    for name, needle in ABSENT.get(cid, []):
        hit = needle in exp
        checks.append({"check": name, "want": "absent", "found": not hit})
        ok = ok and not hit
    # exactly one stamp, exactly one marker, no raw markup
    nstamp = len(re.findall(r"Last checked against build", exp))
    nmark = len(re.findall(r"^AUTOMATION: ", exp, re.M))
    raw = bool(re.search(r"</?(p|ol|li|ul|br)\b", exp))
    checks.append({"check": "one-stamp", "want": 1, "found": nstamp}); ok = ok and nstamp == 1
    checks.append({"check": "one-marker", "want": 1, "found": nmark}); ok = ok and nmark == 1
    checks.append({"check": "no-raw-markup", "want": False, "found": raw}); ok = ok and not raw
    rows.append({"cid": cid, "title": c["title"], "landed": ok, "checks": checks})

json.dump({"read_at": datetime.datetime.utcnow().isoformat() + "Z",
           "written_by_finish3": written, "rows": rows},
          open(f"{OUT}/recover-writes.json", "w"), indent=1)

bad = [r for r in rows if not r["landed"]]
print(f"finish3 ops claimed: {len(oplog)} over {len(written)} cases")
print(f"VERIFIED LANDED BY CONTENT: {len(rows)-len(bad)} / {len(rows)}")
for r in bad:
    print("  NOT LANDED", r["cid"], [c for c in r["checks"] if c["found"] != c["want"] and c["found"] is not True])
