#!/usr/bin/env python3
"""Post-write verification — READ-ONLY. Rule 50: exhaustive then exact.

  1. Re-read all 119 live cases individually and byte-compare every field:
       * ours: `custom_expected` == the planned bytes, everything else identical
         to the pre-write snapshot (bar the server's updated_on/updated_by)
       * the 5 foreign cases: byte-identical INCLUDING updated_on / updated_by
  2. Read-date census: how many per case, and none missing.
  3. Sentence 2 preserved character-for-character on every case.
  4. The AUTOMATION marker and the provenance-line count unchanged; raw-markup
     census re-taken.
  5. Run 352 proven undamaged: include_all, test set both directions, every prior
     result present BY ID with 0 graded-field changes; `case_title` and `case_refs`
     excluded as declared echoes (playbook §J #2/#2b/#2c).
"""
import collections
import datetime as dt
import json
import os
import re

import tr

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, "..", "snapshots")
RUN = 352
GRADED = ["id", "test_id", "status_id", "created_by", "created_on", "assignedto_id",
          "comment", "version", "elapsed", "defects", "case_id"]
ECHO = {"case_title", "case_refs"}
MARKUP = re.compile(r"</?(?:p|ol|ul|li|br|div|span|strong|em|hr|a)\b[^>]*>", re.I)

PRE = json.load(open(f"{SNAP}/cases-PRE.json"))
PLAN = json.load(open("/tmp/filters_stamp_plan.json"))
OURS = [c for c in PRE if PRE[c].get("created_by") == 3]
FOREIGN = [c for c in PRE if PRE[c].get("created_by") != 3]

print("verifying at", dt.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"))

post = {}
for cid in PRE:
    st, d = tr.req(f"get_case/{cid}")
    assert st == 200, (cid, st, d)
    post[cid] = d
json.dump(post, open(f"{SNAP}/cases-POST.json", "w"), indent=1)
print(f"re-read live individually: {len(post)}  (ours {len(OURS)}, foreign {len(FOREIGN)})")

# 1. ours — intended field exact, everything else byte-identical
fails = []
for cid in OURS:
    want = PLAN[cid]["body"] + PLAN[cid]["new_block"]
    if post[cid]["custom_expected"] != want:
        fails.append((cid, "custom_expected", "NOT THE PLANNED BYTES"))
    for k in set(PRE[cid]) | set(post[cid]):
        if k in ("custom_expected", "updated_on", "updated_by"):
            continue
        if PRE[cid].get(k) != post[cid].get(k):
            fails.append((cid, k, f"{PRE[cid].get(k)!r:.120} -> {post[cid].get(k)!r:.120}"))
print("OUR-CASE field mismatches:", len(fails))
for f in fails[:10]:
    print("   ", f)

# 1b. foreign — byte-identical including the timestamps
ffails = []
for cid in FOREIGN:
    for k in set(PRE[cid]) | set(post[cid]):
        if PRE[cid].get(k) != post[cid].get(k):
            ffails.append((cid, k))
print("FOREIGN-CASE field differences (must be 0, incl. updated_on/updated_by):",
      len(ffails), ffails)

# 2. read-date census
missing = [c for c in OURS if "read on 11 August 2026" not in post[c]["custom_expected"]]
print("our cases with NO read-date:", len(missing), missing)
cnt = collections.Counter(post[c]["custom_expected"].count("read on ") for c in OURS)
print("read-date mentions per case:", dict(sorted(cnt.items())))
print("cases still carrying the honest earlier '10 August 2026' handover date:",
      [c for c in OURS if "read on 10 August 2026" in post[c]["custom_expected"]])

# 3. sentence 2 preserved exactly
S2 = "Last checked against build"
s2bad = [c for c in OURS
         if PRE[c]["custom_expected"].split(S2, 1)[1:] != post[c]["custom_expected"].split(S2, 1)[1:]]
print("sentence-2 altered on:", s2bad)
print("cases with a sentence 2:", sum(1 for c in OURS if S2 in post[c]["custom_expected"]),
      "| without:", sum(1 for c in OURS if S2 not in post[c]["custom_expected"]))
builds = collections.Counter(
    re.search(rf"{S2} (\S+) on (\S+?)\.", post[c]["custom_expected"]).groups()
    if S2 in post[c]["custom_expected"] else ("(none)", "(none)") for c in OURS)
print("build lines, unchanged:", dict(builds))

# 4. invariants + markup census
inv, markup = [], []
for c in OURS:
    e = post[c]["custom_expected"]
    m = [l for l in e.split("\n") if l.strip().startswith("AUTOMATION:")]
    if len(m) != 1:
        inv.append((c, "markers", len(m)))
    elif e.split(m[0], 1)[1].strip():
        inv.append((c, "text-after-marker"))
    if e.count("This is the expected behaviour as per") != 1:
        inv.append((c, "provenance-count"))
    if "\n---\n" not in e:
        inv.append((c, "separator"))
for c in post:
    t = "".join(str(post[c].get(f) or "") for f in
                ("title", "custom_preconds", "custom_steps", "custom_expected"))
    if MARKUP.search(t):
        markup.append(c)
print("invariant breaches:", inv)
print("RAW MARKUP census over all 119 live cases:", len(markup), markup)
print("custom_atmstatus == 3 after:", sorted(c for c in post if post[c].get("custom_atmstatus") == 3))

# 5. run 352
st, run = tr.req(f"get_run/{RUN}")
assert st == 200
pre_run = json.load(open(f"{SNAP}/run352-PRE.json"))
print(f"\nrun {RUN}: include_all {pre_run['include_all']} -> {run['include_all']}"
      f" | counts P{pre_run['passed_count']}/F{pre_run['failed_count']}/B{pre_run['blocked_count']}"
      f"/U{pre_run['untested_count']} -> P{run['passed_count']}/F{run['failed_count']}"
      f"/B{run['blocked_count']}/U{run['untested_count']}")
tests = tr.getall(f"get_tests/{RUN}", "tests")
json.dump(tests, open(f"{SNAP}/run352-tests-POST.json", "w"), indent=1)
pt = json.load(open(f"{SNAP}/run352-tests-PRE.json"))
print("tests:", len(pt), "->", len(tests),
      "| test-id sets equal both ways:", {t["id"] for t in pt} == {t["id"] for t in tests},
      "| case-id sets equal both ways:", {t["case_id"] for t in pt} == {t["case_id"] for t in tests})
res = tr.getall(f"get_results_for_run/{RUN}", "results")
json.dump(res, open(f"{SNAP}/run352-results-POST.json", "w"), indent=1)
pr = {r["id"]: r for r in json.load(open(f"{SNAP}/run352-results-PRE.json"))}
po = {r["id"]: r for r in res}
print("results:", len(pr), "->", len(po),
      "| missing BY ID:", sorted(set(pr) - set(po)), "| new:", sorted(set(po) - set(pr)))
gbad, echo = [], collections.Counter()
for rid in pr:
    if rid not in po:
        continue
    for f in GRADED:
        if pr[rid].get(f) != po[rid].get(f):
            gbad.append((rid, f))
    for f in ECHO:
        if pr[rid].get(f) != po[rid].get(f):
            echo[f] += 1
print("GRADED-field changes across every prior result:", len(gbad), gbad[:8])
print("declared echoes that moved (case_title / case_refs):", dict(echo))
print("done", dt.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"))
