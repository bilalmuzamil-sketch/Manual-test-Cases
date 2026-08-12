"""Prove run 357 untouched BY CONTENT (never by updated_on), and re-derive the
live suite state after the writes.  READ ONLY."""
import json
import re
import sys

sys.path.insert(0, "/tmp/testrail")
import tr  # noqa: E402

OUT = "/home/user/Manual-test-Cases/build/schedule/finish3-2026-08-12/evidence"
BUILD = "v3.5-65d6500"
MARKER = re.compile(r"AUTOMATION:\s*(READY - EXPECT FAIL[^\n<]*|READY|HOLD[^\n<]*)")


def paged(base, key):
    out, off = [], 0
    while True:
        s, b = tr.api(f"{base}&limit=250&offset={off}")
        assert s == 200, (s, b)
        ch = b[key] if isinstance(b, dict) else b
        out.extend(ch)
        if len(ch) < 250:
            break
        off += 250
    return out


def main():
    pre = json.load(open(f"{OUT}/run357-PRE.json"))
    st, run = tr.api("get_run/357")
    tests = paged("get_tests/357", "tests")
    results = paged("get_results_for_run/357", "results")
    json.dump({"run": run, "tests": tests, "results": results},
              open(f"{OUT}/run357-POST.json", "w"), indent=1)

    print("=== RUN 357, proven by content ===")
    print(f"include_all : {pre['run'].get('include_all')} -> {run.get('include_all')}")
    a, b = {t["id"] for t in pre["tests"]}, {t["id"] for t in tests}
    ca, cb = {t["case_id"] for t in pre["tests"]}, {t["case_id"] for t in tests}
    print(f"tests       : {len(pre['tests'])} -> {len(tests)} ; "
          f"test-id sets equal both ways: {a == b} ; case-id sets equal both ways: {ca == cb}")

    # every prior result present BY ID, and byte-identical field by field
    pr = {r["id"]: r for r in pre["results"]}
    po = {r["id"]: r for r in results}
    missing = sorted(set(pr) - set(po))
    new = sorted(set(po) - set(pr))
    graded = ["status_id", "comment", "defects", "elapsed", "version",
              "assignedto_id", "created_by", "created_on", "test_id"]
    changed_graded, changed_echo = [], []
    for rid in set(pr) & set(po):
        for k in set(pr[rid]) | set(po[rid]):
            if pr[rid].get(k) != po[rid].get(k):
                (changed_graded if k in graded else changed_echo).append((rid, k))
    print(f"results     : {len(pre['results'])} -> {len(results)} ; "
          f"missing by id: {len(missing)} ; new during the window: {len(new)}")
    print(f"graded fields changed on any prior result : {len(changed_graded)} {changed_graded[:5]}")
    print(f"derived/echo fields changed               : {len(changed_echo)} "
          f"{sorted({k for _, k in changed_echo})}")
    counters = {k: (pre['run'].get(k), run.get(k)) for k in
                ('passed_count', 'failed_count', 'blocked_count', 'retest_count', 'untested_count')}
    print(f"counters    : {counters}")

    # ---- live suite state -------------------------------------------------
    st, secs = tr.api("get_sections/1&suite_id=1&limit=250&offset=0")
    allsecs = secs["sections"] if isinstance(secs, dict) else secs
    off = 250
    while True:
        st, more = tr.api(f"get_sections/1&suite_id=1&limit=250&offset={off}")
        ch = more["sections"] if isinstance(more, dict) else more
        if not ch:
            break
        allsecs.extend(ch)
        off += 250
        if len(ch) < 250:
            break
    kids = {}
    for s in allsecs:
        kids.setdefault(s.get("parent_id"), []).append(s["id"])
    ids, stack = set(), [4254]
    while stack:
        n = stack.pop()
        if n in ids:
            continue
        ids.add(n)
        stack.extend(kids.get(n, []))
    cases = [c for c in tr.get_cases() if c["section_id"] in ids]

    kinds = {"READY": 0, "EXPECT-FAIL": 0, "HOLD": 0, "NONE": 0}
    dbl = raw = cur = nostamp = 0
    for c in cases:
        e = c.get("custom_expected") or ""
        m = MARKER.findall(e)
        if len(m) > 1:
            dbl += 1
        if not m:
            kinds["NONE"] += 1
        elif m[0].startswith("HOLD"):
            kinds["HOLD"] += 1
        elif "EXPECT FAIL" in m[0]:
            kinds["EXPECT-FAIL"] += 1
        else:
            kinds["READY"] += 1
        if re.search(r"<(p|ol|li|br|div)\b", e):
            raw += 1
        if BUILD in e:
            cur += 1
        if "Last checked against build" not in e:
            nostamp += 1
        if len(re.findall(r"This is the expected behaviour", e)) > 1:
            dbl += 1

    n = len(cases)
    gate = kinds["READY"] + kinds["EXPECT-FAIL"]
    print("\n=== LIVE SUITE STATE (re-derived, not from notes) ===")
    print(f"cases in group 4254 : {n}   foreign: {sum(1 for c in cases if c.get('created_by') != 3)}")
    print(f"markers: READY {kinds['READY']} + EXPECT-FAIL {kinds['EXPECT-FAIL']} = {gate} ; "
          f"HOLD {kinds['HOLD']} ; unmarked {kinds['NONE']} ; doubled {dbl}")
    print(f"gate the other way: {n} - {kinds['HOLD']} = {n - kinds['HOLD']}  -> "
          f"{'CLOSES BOTH WAYS' if gate == n - kinds['HOLD'] else 'DOES NOT CLOSE'}")
    print(f"build line naming {BUILD}: {cur} of {n}   (cases with no build line at all: {nostamp})")
    print(f"raw markup: {raw}   titles over 80 chars: {sum(1 for c in cases if len(c['title']) > 80)}")
    json.dump({"n": n, "kinds": kinds, "gate": gate, "build_current": cur,
               "no_stamp": nostamp, "raw": raw, "doubled": dbl},
              open(f"{OUT}/final-state.json", "w"), indent=1)


if __name__ == "__main__":
    main()
