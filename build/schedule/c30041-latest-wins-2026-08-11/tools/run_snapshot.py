#!/usr/bin/env python3
"""READ-ONLY. Snapshot run 357 (Ayesha Khan's Schedule run) BY CONTENT, so it can
be proven untouched afterwards rather than merely asserted (Standing Rules 34/47/50).

Untouched-proof is BY CONTENT, never by `updated_on`.
"""
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                "..", "..", "coverage-rederivation-2026-08-10", "tools"))
import tr  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(HERE, "..", "evidence")
RUN = 357


def snap(tag):
    run = tr.get(f"get_run/{RUN}")
    tests = tr.paged(f"get_tests/{RUN}", "tests")
    results = tr.paged(f"get_results_for_run/{RUN}", "results")
    d = {"run": run, "tests": tests, "results": results}
    json.dump(d, open(os.path.join(EV, f"run357-{tag}.json"), "w"), indent=1)
    print(f"[{tag}] run {RUN}: include_all={run.get('include_all')} "
          f"tests={len(tests)} results={len(results)} "
          f"passed={run.get('passed_count')} failed={run.get('failed_count')} "
          f"blocked={run.get('blocked_count')} untested={run.get('untested_count')}")
    return d


def compare(pre, post):
    ok = True
    tpre = {t["id"]: t for t in pre["tests"]}
    tpost = {t["id"]: t for t in post["tests"]}
    cpre = {t["case_id"] for t in pre["tests"]}
    cpost = {t["case_id"] for t in post["tests"]}
    print(f"tests {len(tpre)} -> {len(tpost)}")
    print(f"  case_id set equal both directions: "
          f"{cpre <= cpost and cpost <= cpre}  (pre-only={sorted(cpre-cpost)} post-only={sorted(cpost-cpre)})")
    if pre["run"].get("include_all") is not post["run"].get("include_all"):
        print("  !! include_all CHANGED"); ok = False

    rpre = {r["id"]: r for r in pre["results"]}
    rpost = {r["id"]: r for r in post["results"]}
    missing = sorted(set(rpre) - set(rpost))
    added = sorted(set(rpost) - set(rpre))
    print(f"results {len(rpre)} -> {len(rpost)}; missing BY ID={missing}; new={added}")
    if missing:
        ok = False
    # field-by-field on every surviving result; case_title/case_refs are the
    # DECLARED read-time echoes (APP-ACTIONS-PLAYBOOK §J) and are reported apart.
    echo = {"case_title", "case_refs"}
    graded, echoed = [], []
    for rid in sorted(set(rpre) & set(rpost)):
        a, b = rpre[rid], rpost[rid]
        for k in sorted(set(a) | set(b)):
            if a.get(k) != b.get(k):
                (echoed if k in echo else graded).append((rid, k, a.get(k), b.get(k)))
    print(f"  graded/real field changes on surviving results: {len(graded)}")
    for g in graded[:20]:
        print("    !!", g); ok = False
    print(f"  declared read-time echo changes (case_title/case_refs): {len(echoed)}")
    for e in echoed[:6]:
        print("    echo:", e[0], e[1])
    print("\nRUN 357 UNTOUCHED BY CONTENT:", "YES" if ok else "NO")
    return ok


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd in ("pre", "post"):
        snap(cmd)
    else:
        compare(json.load(open(os.path.join(EV, "run357-pre.json"))),
                json.load(open(os.path.join(EV, "run357-post.json"))))
