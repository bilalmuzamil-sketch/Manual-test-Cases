#!/usr/bin/env python3
"""Execute the AUTHORIZED Schedule "Branko answers" TestRail push (2026-07-31).

Per build/schedule/branko-answers-2026-07-31/testrail-sync-manifest-2026-07-31.md, EXACTLY:
  - update_case x15 (pre-write get_case snapshots first; re-GET + field verify after each)
  - 0 add_case, 0 add_section, 0 delete_case, 0 update_run, 0 result writes

Then, read-only:
  - live case count under the group-4254 subtree (expect 165)
  - Rule-34 run-357 verification: test count, every prior case still present, result count
    unchanged. No update_run is issued because add_case count is 0.

Field mapping / clean() / verify() mirror exec_sync_techplan_2026-07-30.py exactly.
Stops on ANY non-200 or re-GET MISMATCH.
"""
import csv, json, glob, os, re, subprocess, sys, time
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
BASE_URL = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ.get("TESTRAIL_USER")
KEY = os.environ.get("TESTRAIL_KEY")
if not USER or not KEY:
    sys.exit("Set TESTRAIL_USER / TESTRAIL_KEY in env (never in files).")

GROUP_ID = 4254
RUN_ID = 357

# the 15 authorized updates, in manifest order
UPDATES = [
    ("SCH-EVT-08", 30615), ("SCH-CAP-01", 30030), ("SCH-MODAL-08", 30015),
    ("SCH-EVT-01", 30016), ("SCH-EVT-02", 30017), ("SCH-REAS-03", 30054),
    ("SCH-EVT-03", 30018), ("SCH-PERM-02", 30075), ("SCH-PERM-04", 30077),
    ("SCH-REAS-06", 38855), ("SCH-CONF-03", 30025), ("SCH-SER-01", 29987),
    ("SCH-SER-02", 29988), ("SCH-DAY-06", 30006), ("SCH-EDGE-08", 38866),
]
SNAP_DIR = os.path.join(HERE, "branko-answers-2026-07-31", "pre-push-snapshot")
os.makedirs(SNAP_DIR, exist_ok=True)


def api(method, endpoint, payload=None):
    url = BASE_URL + endpoint
    for attempt in range(5):
        cmd = ["curl", "-sS", "--cacert", CA, "-u", f"{USER}:{KEY}",
               "-H", "Content-Type: application/json", "-w", "\n%{http_code}", url]
        if method == "POST":
            cmd[1:1] = ["-X", "POST", "--data-binary", json.dumps(payload)]
        out = subprocess.run(cmd, capture_output=True, text=True)
        body, _, code = out.stdout.rpartition("\n")
        code = code.strip()
        if code in ("429", "000") or code.startswith("5"):
            wait = 2 ** attempt
            print(f"  HTTP {code} on {endpoint} - retry in {wait}s", flush=True)
            time.sleep(wait)
            continue
        if code != "200":
            raise RuntimeError(f"HTTP {code} on {method} {endpoint}: {body[:400]}")
        return json.loads(body) if body.strip() else {}
    raise RuntimeError(f"Retries exhausted on {method} {endpoint}")


def clean(s):
    if not s:
        return s
    s = re.sub(r"\s*\(see (?:SCH|FLT|GS|SF|FD)-[A-Z0-9-]+(?:'s setup)?\)", "", s)
    s = re.sub(r"\s*\(from (?:SCH|FLT|GS|SF|FD)-[A-Z0-9-]+'s setup\)", "", s)
    s = re.sub(r"\s*\(per (?:SCH|FLT|GS|SF|FD)-[A-Z0-9-]+\)", "", s)
    s = re.sub(r"[,;]?\s*SCH-[A-Z]+-\d+(\.\.\d+)?", "", s)
    s = re.sub(r"feature[ -]flags?", "Schedule feature", s, flags=re.I)
    return s


def joinlines(lst):
    return "\n".join(clean(x.rstrip()) for x in (lst or []))


def norm_refs(s):
    return re.sub(r",\s*", ",", (s or "").strip())


def desired_body(c):
    return {
        "title": clean(c["title"].strip()),
        "custom_preconds": joinlines(c.get("preconditions", [])),
        "custom_steps": joinlines(c.get("steps", [])),
        "custom_expected": joinlines(c.get("expected", [])),
        "refs": clean((c.get("refs") or c.get("spec_ref") or "").strip()),
    }


def verify(after, want):
    d = {
        "title": (after.get("title") or "") == want["title"],
        "preconds": (after.get("custom_preconds") or "") == want["custom_preconds"],
        "steps": (after.get("custom_steps") or "") == want["custom_steps"],
        "expected": (after.get("custom_expected") or "") == want["custom_expected"],
        "refs": norm_refs(after.get("refs") or "") == norm_refs(want["refs"]),
    }
    return all(d.values()), d


cases = {}
for f in glob.glob(os.path.join(HERE, "cases", "cases-*.json")):
    for c in json.load(open(f)):
        cases[c["id"]] = c

log = []
ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
done = []

try:
    # ---- PHASE 0: pre-write snapshots -----------------------------------
    print("\n===== PHASE 0: pre-write get_case snapshots x15 =====", flush=True)
    before_all = {}
    for sid, cid in UPDATES:
        before = api("GET", f"get_case/{cid}")
        before_all[sid] = before
        json.dump(before, open(os.path.join(SNAP_DIR, f"C{cid}-{sid}-pre-push-2026-07-31.json"),
                               "w"), indent=2, ensure_ascii=False)
        print(f"  snapshot C{cid} {sid}", flush=True)

    # ---- PHASE 1: update_case x15 ---------------------------------------
    print("\n===== PHASE 1: update_case x15 =====", flush=True)
    for sid, cid in UPDATES:
        c = cases[sid]
        want = desired_body(c)
        before = before_all[sid]
        changed = [k for k, v in want.items()
                   if (before.get(k) or "") != v
                   and not (k == "refs" and norm_refs(before.get("refs") or "") == norm_refs(v))]
        if not changed:
            raise RuntimeError(f"{sid} C{cid}: payload identical to live - a no-op write was "
                               f"not authorized; investigate before proceeding.")
        api("POST", f"update_case/{cid}", want)
        after = api("GET", f"get_case/{cid}")
        match, detail = verify(after, want)
        print(f"  {sid:<14} C{cid}  changed={changed}  MATCH={match}", flush=True)
        done.append((sid, cid, match))
        log.append({"op": "update_case", "sch": sid, "cid": cid, "ts": ts(),
                    "match": match, "detail": detail, "changed_fields": changed,
                    "before": {k: before.get(k) for k in want},
                    "after": {k: after.get(k) for k in want}})
        if not match:
            raise RuntimeError(f"update_case MISMATCH on {sid} C{cid}: {detail}")

    # ---- PHASE 2: live count under group 4254 (read-only) ---------------
    print("\n===== PHASE 2: live case count under group 4254 =====", flush=True)
    secs = api("GET", "get_sections/1&suite_id=1")
    seclist = secs["sections"] if isinstance(secs, dict) and "sections" in secs else secs
    subtree = {GROUP_ID}
    changed = True
    while changed:
        changed = False
        for s in seclist:
            if s.get("parent_id") in subtree and s["id"] not in subtree:
                subtree.add(s["id"])
                changed = True
    live_cids, offset = set(), 0
    while True:
        res = api("GET", f"get_cases/1&suite_id=1&limit=250&offset={offset}")
        batch = res["cases"] if isinstance(res, dict) and "cases" in res else res
        live_cids |= {c["id"] for c in batch if c.get("section_id") in subtree}
        if len(batch) < 250:
            break
        offset += 250
    print(f"  LIVE CASE COUNT under group {GROUP_ID}: {len(live_cids)}", flush=True)
    log.append({"op": "live_count", "group": GROUP_ID, "count": len(live_cids), "ts": ts()})

    # ---- PHASE 3: Rule-34 run-357 VERIFY ONLY (no update_run) -----------
    print(f"\n===== PHASE 3: run {RUN_ID} verification (READ-ONLY, no update_run) =====", flush=True)
    run = api("GET", f"get_run/{RUN_ID}")
    print(f"  run {RUN_ID}: {run.get('name')!r}", flush=True)
    tests, offset = [], 0
    while True:
        res = api("GET", f"get_tests/{RUN_ID}&limit=250&offset={offset}")
        batch = res["tests"] if isinstance(res, dict) and "tests" in res else res
        tests += batch
        if len(batch) < 250:
            break
        offset += 250
    run_cids = {t["case_id"] for t in tests}
    results, offset = 0, 0
    while True:
        res = api("GET", f"get_results_for_run/{RUN_ID}&limit=250&offset={offset}")
        batch = res["results"] if isinstance(res, dict) and "results" in res else res
        results += len(batch)
        if len(batch) < 250:
            break
        offset += 250
    updated = {cid for _, cid in UPDATES}
    missing = updated - run_cids
    print(f"  tests in run: {len(tests)} | distinct case_ids: {len(run_cids)} | "
          f"result records: {results}", flush=True)
    print(f"  all 15 updated cases present in the run: {not missing} "
          f"{'(missing: %s)' % sorted(missing) if missing else ''}", flush=True)
    print(f"  run set == live group-4254 set: {run_cids == live_cids} "
          f"| in-run-not-live: {sorted(run_cids - live_cids)} "
          f"| live-not-in-run: {sorted(live_cids - run_cids)}", flush=True)
    log.append({"op": "run_verify", "run": RUN_ID, "name": run.get("name"),
                "tests": len(tests), "distinct_case_ids": len(run_cids),
                "result_records": results,
                "updated_cases_present": sorted(updated - missing),
                "updated_cases_missing": sorted(missing),
                "run_equals_live": run_cids == live_cids,
                "in_run_not_live": sorted(run_cids - live_cids),
                "live_not_in_run": sorted(live_cids - run_cids),
                "update_run_issued": False, "ts": ts()})

finally:
    json.dump({"done": done, "log": log},
              open("/tmp/sched_answers_sync_result.json", "w"), indent=2, ensure_ascii=False)
    print("\n===== SUMMARY =====", flush=True)
    print(f"update_case: {len(done)} / 15  all MATCH={all(m for _, _, m in done) if done else False}",
          flush=True)
    print("add_case: 0 | add_section: 0 | delete_case: 0 | update_run: 0 | results: 0", flush=True)
