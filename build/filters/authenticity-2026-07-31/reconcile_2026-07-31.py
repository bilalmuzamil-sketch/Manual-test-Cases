#!/usr/bin/env python3
"""RECONCILE — Filters closing-authenticity pass (2026-07-31).

Regenerates the import + id-map from the audited case bodies, RE-MERGES the C-ids
(gen_import.py deliberately blanks that column on every run — the documented gotcha),
then runs the full hygiene gate and proves live == id-map == import.
"""
import csv, json, os, re, subprocess, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from tr_api import api, get_all
from caseio import active

ROOT = "/home/user/Manual-test-Cases"
IDMAP = os.path.join(ROOT, "build/filters/testrail-id-map.csv")
IMPORT = os.path.join(ROOT, "testrail-import/filters-v1-testrail-import.csv")
REF_IMPORTS = ["fees-discounts-v1-testrail-import.csv", "simple-flow-v1-testrail-import.csv",
               "global-search-v2-testrail-import.csv", "report-suite-v1-testrail-import.csv",
               "schedule-v1-testrail-import.csv"]

fails = []
def check(cond, msg):
    print(("PASS  " if cond else "FAIL  ") + msg)
    if not cond:
        fails.append(msg)


def main():
    # ---- 0. preserve the C-ids before gen_import blanks them -------------------
    keep = {r["internal_id"]: r["testrail_case_id"]
            for r in csv.DictReader(open(IDMAP))}
    print("C-ids held for re-merge:", len(keep))

    # ---- 1. regenerate -------------------------------------------------------
    out = subprocess.run([sys.executable, os.path.join(ROOT, "build/filters/gen_import.py")],
                         capture_output=True, text=True, cwd=ROOT)
    print(out.stdout.strip())
    assert out.returncode == 0, out.stderr[-2000:]

    # ---- 2. re-merge the C-ids ------------------------------------------------
    rows = list(csv.DictReader(open(IDMAP)))
    for r in rows:
        r["testrail_case_id"] = keep.get(r["internal_id"], "")
    with open(IDMAP, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["internal_id", "testrail_case_id", "title", "section"])
        w.writeheader(); w.writerows(rows)
    check(len(rows) == 110, "id-map = 110 rows (%d)" % len(rows))
    check(all(r["testrail_case_id"].startswith("C") for r in rows),
          "id-map has ZERO blank C-ids")
    check(len({r["testrail_case_id"] for r in rows}) == 110, "id-map C-ids unique")

    # ---- 3. hygiene on the import --------------------------------------------
    with open(IMPORT, newline="") as f:
        data = list(csv.reader(f))
    hdr, body = data[0], data[1:]
    check(len(body) == 110, "import has 110 data rows (%d)" % len(body))
    ref_hdr = None
    for name in REF_IMPORTS:
        p = os.path.join(ROOT, "testrail-import", name)
        if os.path.exists(p):
            with open(p, newline="") as f:
                ref_hdr = next(csv.reader(f))
            check(hdr == ref_hdr, "import header byte-identical to %s" % name)
    blob = "\n".join("\t".join(r) for r in body)
    check("VIU" not in blob and "viu" not in blob.lower().replace("previous", ""),
          "0 VIU words in the import")
    for w in ("feature flag", "flag on", "flag off"):
        check(w not in blob.lower(), "0 '%s' phrasings in the import" % w)
    tester_cols = [0, 4, 5, 6]      # Title, Preconditions, Steps, Expected Result
    leaks = [(r[0][:40], m) for r in body for c in tester_cols
             for m in re.findall(r"\bFLT-[A-Z]+-\d+|\bS\d{1,2}-[RNE]\d{1,2}\b|\bSV-\d+\b", r[c])]
    check(not leaks, "0 internal-id / spec-anchor / Jira-key leaks in tester-facing columns -> %s" % leaks[:5])
    titles = [r[0] for r in body]
    dup = [t for t, n in collections.Counter(titles).items() if n > 1]
    check(not dup, "0 duplicate titles in the import -> %s" % dup)
    check(all(len(t) <= 80 for t in titles), "every import title <= 80 chars (max %d)" % max(map(len, titles)))
    check(all(r[4].strip() and r[5].strip() and r[6].strip() for r in body),
          "no row missing Preconditions/Steps/Expected")
    # API placement (Rule 4)
    api_rows = [r for r in body if re.search(r"HTTP \d{3}|\bGET\b|\bPUT\b|\bPOST\b|/api/|endpoint", r[5] + r[6])]
    check(all("API" in r[1] for r in api_rows),
          "every API-content row sits in an 'API ...' section (%d rows)" % len(api_rows))
    check(all(r[7].strip() for r in body), "every row carries a References value")
    check(all(len(r[7]) <= 250 and "," not in r[7] for r in body),
          "every References value <=250 chars and comma-free")

    # ---- 4. live == id-map == import ------------------------------------------
    secs = get_all("get_sections/1&suite_id=1", "sections")
    kid = {s["id"] for s in secs if s.get("parent_id") == 4110}
    cases = get_all("get_cases/1&suite_id=1", "cases")
    live = {c["id"]: c for c in cases if c["section_id"] in kid}
    mapped = {int(r["testrail_case_id"].lstrip("C")) for r in rows}
    check(len(live) == 110, "LIVE count under group 4110 == 110 (%d)" % len(live))
    check(mapped == set(live), "id-map == live BOTH ways (live-not-in-map %s / map-not-live %s)"
          % (sorted(set(live) - mapped), sorted(mapped - set(live))))
    loc = {c["id"]: c for _, c in active()}
    tmis = [r["internal_id"] for r in rows
            if live[int(r["testrail_case_id"].lstrip("C"))]["title"] != loc[r["internal_id"]]["title"]]
    check(not tmis, "live titles == local titles 110/110 -> %s" % tmis)
    rmis = [r["internal_id"] for r in rows
            if (live[int(r["testrail_case_id"].lstrip("C"))].get("refs") or "")
            != (loc[r["internal_id"]]["spec_ref"] or "")]
    check(not rmis, "live refs == local refs 110/110 -> %s" % rmis)
    sec_by_id = {s["id"]: s["name"] for s in secs}
    imp_sec = {r[0]: r[1] for r in body}
    smis = [r["internal_id"] for r in rows
            if sec_by_id[live[int(r["testrail_case_id"].lstrip("C"))]["section_id"]].replace("—", "-")
            != imp_sec[loc[r["internal_id"]]["title"]].replace("—", "-")]
    check(not smis, "live section == import Section 110/110 -> %s" % smis)

    # ---- 5. run 352 (Rule 34) -------------------------------------------------
    st, run = api("get_run/352")
    tests = get_all("get_tests/352", "tests")
    res = get_all("get_results_for_run/352", "results")
    runcids = {t["case_id"] for t in tests}
    check(len(tests) == 110, "run 352 has 110 tests (%d)" % len(tests))
    check(runcids == mapped, "run 352 == active set BOTH ways (missing %s / extra %s)"
          % (sorted(mapped - runcids), sorted(runcids - mapped)))
    check(len(res) == 395, "run 352 result records UNCHANGED at 395 (%d)" % len(res))
    check(run.get("include_all") is False, "run 352 include_all still false")
    json.dump({"tests": len(tests), "results": len(res), "case_ids": sorted(runcids),
               "include_all": run.get("include_all")},
              open(os.path.join(HERE, "post-push-verify", "run-352-after.json"), "w"), indent=1)

    print("\n%s — %d checks failed" % ("RECONCILE CLEAN" if not fails else "RECONCILE FAILED", len(fails)))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
