#!/usr/bin/env python3
"""Post-write verification. READ-ONLY.

Everything is proven BY CONTENT, never by `updated_on`: TestRail re-renders
stored text hours after a write without moving that timestamp, and a case has
already been seen carrying a fresh timestamp while the intended write had never
landed. So a timestamp is never evidence here, in either direction.
"""
import collections
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
SNAP = os.path.join(HERE, "..", "snapshots")
LOGS = os.path.join(HERE, "..", "logs")

READ = "read on 11 August 2026"
LIVE = {"Sales By Customer": 17, "Sales By Representative": 18, "Parts Velocity": 6,
        "Technician Utilization": 7, "Work In Progress": 11, "Inventory Value": 5}
SPEC = re.compile(r"(?P<name>" + "|".join(re.escape(n) for n in LIVE) +
                  r") report specification(?: version (?P<n>\d+))?")
MARKUP = re.compile(r"</?(?:p|ol|ul|li|br|div|span|strong|em|b|i|table|tr|td)\b[^>]*>", re.I)
S2 = ("Last checked against build", "This has not yet been checked against a build")
GRADED = ["status_id", "comment", "defects", "elapsed", "version", "created_by",
          "created_on", "test_id", "assignedto_id"]
ECHO = {"case_title", "case_refs"}


def main():
    pre = json.load(open(f"{SNAP}/cases-PRE.json"))
    post = json.load(open(f"{SNAP}/cases-POST.json"))
    plan = json.load(open("/tmp/rs_readdate_plan.json"))
    ours_pre = {k: v for k, v in pre.items() if v.get("created_by") == 3}
    ours_post = {k: v for k, v in post.items() if v.get("created_by") == 3}

    print("=" * 72)
    print("1 · COUNTS")
    print(f"  live under group 4281 : pre {len(pre)}  post {len(post)}")
    print(f"  OURS (created_by=3)   : pre {len(ours_pre)}  post {len(ours_post)}")
    print(f"  FOREIGN (Rule 38)     : {len(post) - len(ours_post)}")
    print(f"  id sets equal both ways: {set(pre) == set(post)}")

    print("\n2 · FOREIGN CASES PROVEN BYTE-IDENTICAL, INCLUDING updated_on/updated_by")
    foreign = [k for k, v in post.items() if v.get("created_by") != 3]
    bad = []
    for k in foreign:
        for f in set(pre[k]) | set(post[k]):
            if pre[k].get(f) != post[k].get(f):
                bad.append((k, f, pre[k].get(f), post[k].get(f)))
    print(f"  foreign cases: {len(foreign)} — {sorted('C'+k for k in foreign)}")
    print(f"  field differences across all of them: {len(bad)} {bad[:5]}")

    print("\n3 · EVERY INTENDED CHANGE LANDED, VERIFIED BY CONTENT")
    miss = []
    for cid, p in plan.items():
        want = p["body"] + p["new_block"]
        if post[cid]["custom_expected"] != want:
            miss.append(cid)
    print(f"  planned {len(plan)} · stored exactly as planned {len(plan)-len(miss)} · MISMATCH {len(miss)} {miss[:10]}")

    print("\n4 · SENTENCE 2 UNTOUCHED ON EVERY CASE")
    s2bad = []
    for cid in ours_pre:
        def tail(t):
            i = [t.find(m) for m in S2]
            i = [x for x in i if x >= 0]
            return t[min(i):] if i else ""
        if tail(pre[cid]["custom_expected"]) != tail(post[cid]["custom_expected"]):
            s2bad.append(cid)
    print(f"  sentence 2 changed on: {len(s2bad)} cases {s2bad[:10]}")
    builds = collections.Counter()
    for cid, c in ours_post.items():
        m = re.search(r"Last checked against build ([\w.\-]+) on ([\d/]+)", c["custom_expected"])
        builds[m.groups() if m else ("NONE — says it has not been checked", "")] += 1
    for k, v in builds.most_common():
        print(f"     {v:>4}  {k}")

    print("\n5 · READ-DATES PRESENT (Job 1)")
    nodate = [cid for cid, c in ours_post.items() if READ not in c["custom_expected"]]
    dist = collections.Counter(c["custom_expected"].count(READ) for c in ours_post.values())
    print(f"  cases with at least one read-date: {len(ours_post)-len(nodate)} of {len(ours_post)}")
    print(f"  cases with NONE: {len(nodate)} {nodate}")
    print(f"  read-dates per case: {dict(sorted(dist.items()))}")
    print(f"  total read-dates live: {sum(c['custom_expected'].count(READ) for c in ours_post.values())}")

    print("\n6 · VERSION PINS CORRECT (Job 2)")
    stale, novers = [], []
    for cid, c in ours_post.items():
        for m in SPEC.finditer(c["custom_expected"]):
            if m.group("n") is None:
                novers.append((cid, m.group("name")))
            elif int(m.group("n")) != LIVE[m.group("name")]:
                stale.append((cid, m.group("name"), m.group("n")))
    print(f"  citations still pinned to a superseded version: {len(stale)} {stale}")
    print(f"  citations carrying NO version at all: {len(novers)} {novers}")

    print("\n7 · SHAPE — markers, provenance, markup")
    m0 = [cid for cid, c in ours_post.items()
          if len(re.findall(r'^AUTOMATION: .*$', c["custom_expected"], re.M)) != 1]
    p1 = [cid for cid, c in ours_post.items()
          if c["custom_expected"].count("This is the expected behaviour") != 1]
    mk = [cid for cid, c in ours_post.items()
          if any(MARKUP.search(c.get(f) or "") for f in
                 ("custom_expected", "custom_preconds", "custom_steps"))]
    print(f"  cases without exactly one automation marker: {len(m0)} {m0}")
    print(f"  cases without exactly one provenance opening: {len(p1)} {p1}")
    print(f"  cases showing raw markup in any tester-facing field: {len(mk)} {mk}")

    print("\n8 · RUN 359 — PROVEN UNDAMAGED BY CONTENT")
    rpre = json.load(open(f"{SNAP}/run359-PRE.json"))
    rpost = json.load(open(f"{SNAP}/run359-POST.json"))
    tpre = json.load(open(f"{SNAP}/run359-tests-PRE.json"))
    tpost = json.load(open(f"{SNAP}/run359-tests-POST.json"))
    xpre = json.load(open(f"{SNAP}/run359-results-PRE.json"))
    xpost = json.load(open(f"{SNAP}/run359-results-POST.json"))
    print(f"  include_all: {rpre['include_all']} -> {rpost['include_all']}")
    print(f"  tests: {len(tpre)} -> {len(tpost)}")
    print(f"  case_id sets equal both ways: {set(t['case_id'] for t in tpre) == set(t['case_id'] for t in tpost)}")
    print(f"  test_id sets equal both ways: {set(t['id'] for t in tpre) == set(t['id'] for t in tpost)}")
    print(f"  result records: {len(xpre)} -> {len(xpost)}")
    a = {r["id"]: r for r in xpre}
    b = {r["id"]: r for r in xpost}
    print(f"  every prior result present BY ID: {set(a) <= set(b)} · missing {len(set(a)-set(b))} · new {len(set(b)-set(a))}")
    gch = collections.Counter()
    ech = collections.Counter()
    for i in set(a) & set(b):
        for f in set(a[i]) | set(b[i]):
            if a[i].get(f) != b[i].get(f):
                (gch if f in GRADED else ech)[f] += 1
    print(f"  GRADED field changes across all results: {sum(gch.values())} {dict(gch)}")
    print(f"  other/echo field changes: {sum(ech.values())} {dict(ech)}")
    print(f"  counters: passed {rpre.get('passed_count')}->{rpost.get('passed_count')} "
          f"failed {rpre.get('failed_count')}->{rpost.get('failed_count')} "
          f"untested {rpre.get('untested_count')}->{rpost.get('untested_count')}")

    print("\n9 · AUTOMATED-FLAGGED CASES WE CHANGED (Rule 65)")
    log = []
    for f in sorted(os.listdir(LOGS)):
        log += json.load(open(os.path.join(LOGS, f)))
    at3 = [r for r in log if r["atmstatus_at_write"] == 3]
    print(f"  operations logged: {len(log)} · all MATCH: {all(r['verification']=='MATCH' for r in log)}")
    print(f"  cases carrying custom_atmstatus=3 AT WRITE TIME: {len(at3)}")
    print(f"  {sorted('C'+str(r['case_id']) for r in at3)}")
    json.dump(sorted(r["case_id"] for r in at3), open("/tmp/rs_at3.json", "w"))


if __name__ == "__main__":
    main()
