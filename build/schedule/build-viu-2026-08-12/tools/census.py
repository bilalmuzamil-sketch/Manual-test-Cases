#!/usr/bin/env python3
"""census.py — read all 176 Schedule cases LIVE and check what a manual tester
would actually meet tomorrow: raw markup on screen, exactly one automation marker,
exactly one provenance line, and which build each verdict rests on.
"""
import json, re, sys, collections
sys.path.insert(0, "/tmp/testrail")
import tr

secs = set(json.load(open("/tmp/sched/sched_sections.json")))
cases = [c for c in tr.get_cases(1, 1) if c["section_id"] in secs]
json.dump(cases, open("/tmp/sched/live-cases-post.json", "w"))

MARK = re.compile(r"AUTOMATION: (READY - EXPECT FAIL \([^)]*\)|READY|HOLD[^\n]*)")
PROV = re.compile(r"This is the expected behaviour as per")
STAMP = re.compile(r"Last checked against build (\S+) on (\d{1,2}/\d{1,2}/\d{4})")
MARKUP = re.compile(r"<(p|ol|ul|li|br|div|strong|em)\b[^>]*>", re.I)

rows, problems = [], []
builds, markers = collections.Counter(), collections.Counter()
for c in sorted(cases, key=lambda x: x["id"]):
    txt = {f: (c.get(f) or "") for f in ("title", "custom_preconds", "custom_steps", "custom_expected")}
    blob = "\n".join(txt.values())
    e = txt["custom_expected"]
    m = MARK.findall(e)
    p = PROV.findall(e)
    s = STAMP.findall(e)
    raw = sorted({f for f, v in txt.items() if MARKUP.search(v)})
    if len(m) != 1: problems.append((c["id"], "markers=%d" % len(m)))
    if len(p) != 1: problems.append((c["id"], "provenance lines=%d" % len(p)))
    if len(s) > 1: problems.append((c["id"], "build stamps=%d" % len(s)))
    if raw: problems.append((c["id"], "RAW MARKUP in " + ",".join(raw)))
    if len(c["title"]) > 80: problems.append((c["id"], "title %d chars" % len(c["title"])))
    markers[m[0].split(" (")[0] if m else "NONE"] += 1
    builds[s[0][0] if s else "no build line"] += 1
    rows.append({"cid": c["id"], "title": c["title"], "marker": m[0] if m else None,
                 "build": s[0][0] if s else None, "date": s[0][1] if s else None})

json.dump({"rows": rows, "problems": problems}, open(
    "/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-12/evidence/census.json", "w"), indent=1)

print("cases:", len(cases))
print("\nMARKERS:", dict(markers))
ready = markers.get("READY", 0) + markers.get("READY - EXPECT FAIL", 0)
hold = markers.get("HOLD", 0)
print("  gate: READY %d + EXPECT-FAIL %d = %d   and   %d - HOLD %d = %d   -> %s"
      % (markers.get("READY", 0), markers.get("READY - EXPECT FAIL", 0), ready,
         len(cases), hold, len(cases) - hold, "PASSES" if ready == len(cases) - hold else "FAILS"))
print("\nBUILD EACH VERDICT RESTS ON:")
for b, n in builds.most_common(): print("  %-28s %d" % (b, n))
print("\nPROBLEMS:", len(problems))
for cid, why in problems[:40]: print("  C%d  %s" % (cid, why))
