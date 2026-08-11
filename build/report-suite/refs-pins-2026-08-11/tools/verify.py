#!/usr/bin/env python3
"""POST-write proofs (Rule 50: exhaustive, then exact).

  1. Every planned case carries EXACTLY the refs we intended, by content.
  2. Every case we did NOT plan to touch is byte-identical to its pre-write
     snapshot -- INCLUDING updated_on / updated_by, which is what proves we did
     not touch it (an assertion is not evidence; a byte-identical snapshot is).
  3. The 12 foreign cases are byte-identical, same standard, Rule 38.
  4. Run 359 undamaged: include_all still false, test set equal BOTH directions,
     every prior result present BY ID, 0 graded-field changes. `case_title` and
     `case_refs` are DERIVED read-time echoes (playbook J #2/#2b/#2c) and are
     excluded from the graded comparison -- then traced, to prove every echo
     belongs to a case we actually wrote.
  5. No new raw markup, no CRLF.

Verification is by CONTENT throughout. `updated_on` is NEVER used to decide
whether a case changed -- three cases today carried a fresh timestamp from an
unrelated pass while the intended write had never landed, and separately
TestRail re-renders case text hours later WITHOUT moving the timestamp.
"""
import json
import os
import re
import sys

sys.path.insert(0, "/tmp/testrail")
import tr  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, "..", "snapshots")
LOG = os.path.join(HERE, "..", "logs")

GRADED = ["id", "test_id", "status_id", "comment", "defects", "elapsed",
          "version", "assignedto_id", "created_by", "created_on"]
ECHO = ["case_title", "case_refs"]


def main():
    pre = {c["id"]: c for c in json.load(open(f"{SNAP}/cases-PRE.json"))}
    post = {c["id"]: c for c in json.load(open(f"{SNAP}/cases-POST.json"))}
    plan = {r["cid"]: r for r in json.load(open(f"{LOG}/plan-final.json"))}
    fails = []

    print(f"cases PRE {len(pre)}  POST {len(post)}")
    if set(pre) != set(post):
        fails.append(f"case-id set moved: +{sorted(set(post)-set(pre))} "
                     f"-{sorted(set(pre)-set(post))}")

    # ---- 1. planned cases carry exactly the intended refs -------------------
    bad = [cid for cid, r in plan.items()
           if tr.norm_refs(post[cid].get("refs")) != tr.norm_refs(r["new"])]
    print(f"[1] planned cases with the intended refs : {len(plan)-len(bad)}/{len(plan)}")
    if bad:
        fails.append(f"refs not as intended on {bad}")

    # ---- 2. unplanned OURS byte-identical incl. updated_on ------------------
    ours = [c for c in post.values() if c["created_by"] == 3]
    untouched = [c["id"] for c in ours if c["id"] not in plan]
    moved = []
    for cid in untouched:
        a, b = pre[cid], post[cid]
        diff = [k for k in set(a) | set(b) if a.get(k) != b.get(k)]
        if diff:
            moved.append((cid, diff))
    print(f"[2] untouched cases of ours proven byte-identical "
          f"(incl. updated_on/updated_by): {len(untouched)-len(moved)}/{len(untouched)}")
    if moved:
        fails.append(f"untouched cases moved: {moved}")

    # ---- 3. foreign cases hands-off ----------------------------------------
    foreign = [c["id"] for c in post.values() if c["created_by"] != 3]
    fmoved = []
    for cid in foreign:
        a, b = pre[cid], post[cid]
        diff = [k for k in set(a) | set(b) if a.get(k) != b.get(k)]
        if diff:
            fmoved.append((cid, diff))
    print(f"[3] foreign cases proven byte-identical: {len(foreign)-len(fmoved)}/{len(foreign)}  "
          f"ids={sorted(foreign)}")
    if fmoved:
        fails.append(f"FOREIGN CASES MOVED: {fmoved}")

    # ---- 4. run 359 ---------------------------------------------------------
    r_pre = json.load(open(f"{SNAP}/run359-PRE.json"))
    r_post = json.load(open(f"{SNAP}/run359-POST.json"))
    t_pre = json.load(open(f"{SNAP}/run359-tests-PRE.json"))
    t_post = json.load(open(f"{SNAP}/run359-tests-POST.json"))
    x_pre = {r["id"]: r for r in json.load(open(f"{SNAP}/run359-results-PRE.json"))}
    x_post = {r["id"]: r for r in json.load(open(f"{SNAP}/run359-results-POST.json"))}

    print(f"[4] run359 include_all {r_pre.get('include_all')} -> {r_post.get('include_all')}")
    if r_post.get("include_all") is not False:
        fails.append("run359 include_all is no longer false")

    cs_pre = {t["case_id"] for t in t_pre}
    cs_post = {t["case_id"] for t in t_post}
    ts_pre = {t["id"] for t in t_pre}
    ts_post = {t["id"] for t in t_post}
    print(f"    tests {len(t_pre)} -> {len(t_post)}; case_id sets equal both ways: "
          f"{cs_pre == cs_post}; test_id sets equal both ways: {ts_pre == ts_post}")
    if cs_pre != cs_post or ts_pre != ts_post:
        fails.append("run359 test/case set moved")

    missing = sorted(set(x_pre) - set(x_post))
    added = sorted(set(x_post) - set(x_pre))
    print(f"    results {len(x_pre)} -> {len(x_post)}; missing BY ID: {len(missing)}; "
          f"new: {len(added)}")
    if missing:
        fails.append(f"run359 results MISSING by id: {missing}")

    graded_moved, echo_moved = [], []
    for rid in set(x_pre) & set(x_post):
        a, b = x_pre[rid], x_post[rid]
        g = [k for k in GRADED if a.get(k) != b.get(k)]
        e = [k for k in ECHO if a.get(k) != b.get(k)]
        if g:
            graded_moved.append((rid, g))
        if e:
            echo_moved.append((rid, a.get("case_id"), e))
    print(f"    graded fields changed on any result: {len(graded_moved)}")
    if graded_moved:
        fails.append(f"run359 GRADED fields moved: {graded_moved[:10]}")

    echo_cases = sorted({cid for _, cid, _ in echo_moved})
    stray = [c for c in echo_cases if c not in plan]
    print(f"    derived echo (case_title/case_refs) moved on {len(echo_moved)} results, "
          f"across {len(echo_cases)} cases; of those NOT written by us: {len(stray)}")
    if stray:
        fails.append(f"echo moved on cases we did NOT write: {stray}")

    # ---- 5. markup / CRLF ---------------------------------------------------
    pat = re.compile(r"<(ol|li|p|br|hr|a |strong|em|div|span)\b", re.I)
    raw = [c["id"] for c in ours
           if any(pat.search(c.get(f) or "") for f in
                  ("custom_preconds", "custom_steps", "custom_expected"))]
    crlf = [c["id"] for c in ours
            if any("\r\n" in (c.get(f) or "") for f in
                   ("custom_preconds", "custom_steps", "custom_expected"))]
    print(f"[5] raw markup: {len(raw)}  CRLF: {len(crlf)}")
    if raw:
        fails.append(f"raw markup on {raw}")
    if crlf:
        fails.append(f"CRLF on {crlf}")

    # ---- refs health --------------------------------------------------------
    over = [(c["id"], max(len(e) for e in (c.get("refs") or "").split(",")))
            for c in ours if max(len(e) for e in (c.get("refs") or "").split(",")) > 248]
    commas = [c["id"] for c in ours if "," in (c.get("refs") or "")]
    noref = [c["id"] for c in ours if not (c.get("refs") or "").strip()]
    print(f"[6] refs entries over 248 chars: {len(over)}; cases still carrying a comma: "
          f"{len(commas)} {commas}; cases with no refs: {len(noref)}")
    if over:
        fails.append(f"refs over limit: {over}")

    # ---- markers ------------------------------------------------------------
    mk = {}
    for c in ours:
        m = re.search(r"AUTOMATION: (READY - EXPECT FAIL|READY|HOLD)", c.get("custom_expected") or "")
        mk[m.group(1) if m else "NONE"] = mk.get(m.group(1) if m else "NONE", 0) + 1
    print(f"[7] markers: {mk}  (total {sum(mk.values())})")

    # ---- version pins -------------------------------------------------------
    LIVE = {"SBC": 17, "SBR": 18, "PV": 6, "TU": 7, "WIP": 11, "IV": 5}
    cite = re.compile(r"\b(SBC|SBR|PV|TU|WIP|IV)\s+spec\s+v(\d+)\s+\d{4}-\d{2}-\d{2}")
    stale = []
    npins = 0
    for c in ours:
        for m in cite.finditer(c.get("refs") or ""):
            npins += 1
            if int(m.group(2)) != LIVE[m.group(1)]:
                stale.append((c["id"], m.group(0)))
    print(f"[8] version pins in refs: {npins}; STALE remaining: {len(stale)} {stale[:5]}")
    if stale:
        fails.append(f"stale pins remain: {stale}")

    print()
    if fails:
        print("*** VERIFICATION FAILURES ***")
        for f in fails:
            print(" -", f)
        sys.exit(1)
    print("ALL POST-WRITE PROOFS PASSED")
    json.dump({"echo_results": len(echo_moved), "echo_cases": echo_cases},
              open(f"{LOG}/run359-echo-trace.json", "w"), indent=1)


if __name__ == "__main__":
    main()
