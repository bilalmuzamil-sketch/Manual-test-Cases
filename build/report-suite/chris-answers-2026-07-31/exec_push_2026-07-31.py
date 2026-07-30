#!/usr/bin/env python3
"""AUTHORIZED push of the Chris-Ward-2026-07-31 answers + the 2026-07-29 spec changelog.

Scope EXACTLY per testrail-push-manifest-2026-07-31.md:
  70 update_case + 7 add_case + 0 delete + run-359 case sync (Standing Rule 34).

Conventions mirrored from chris-update-2026-07-29/exec_companion_push_2026-07-30.py:
  - pre-op live snapshot (get_case) of every update target into pre-push-snapshot/
  - update_case / add_case then re-GET verify title/preconds/steps/expected/refs
  - transient 429/5xx/000 retried with exponential backoff
  - post-push live count of cases under group 4281 (must equal 472)
  - run 359: snapshot get_run + get_tests + get_results_for_run, then UNION-only update_run,
    then verify count / prior cases present / results count UNCHANGED. NO other run touched.
"""
import json, glob, os, re, subprocess, sys, time
from datetime import datetime, timezone

BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ["TESTRAIL_USER"]; KEY = os.environ["TESTRAIL_KEY"]
RS = "build/report-suite"
HERE = os.path.join(RS, "chris-answers-2026-07-31")
SNAP = os.path.join(HERE, "pre-push-snapshot")
GROUP = 4281
RUN = 359
EXPECTED_AFTER = 472
os.makedirs(SNAP, exist_ok=True)

IDPAT = r"(?:SBC|SBR|PV|TU|WIP|IV)-[A-Z]+-\d+"
def clean(s):
    if not s: return s
    s = re.sub(r"\s*\((?:see|per|from|verified in|as seeded for)\s+" + IDPAT +
               r"(?:(?:,|\s+and)\s+" + IDPAT + r")*(?:'s setup)?\)", "", s)
    s = re.sub(r"\s*\(" + IDPAT + r"\)", "", s)
    s = re.sub(r",?\s*[—–-]?\s*see\s+" + IDPAT, "", s)
    s = re.sub(r"covered by\s+" + IDPAT + r"(?:\s+and\s+" + IDPAT + r")*",
               "covered by separate cases", s)
    s = re.sub(r"[,;]?\s*(?:as seeded for\s+|verified in\s+)?" + IDPAT, "", s)
    s = re.sub(r"feature[ -]flags?", "report feature", s, flags=re.I)
    return s

def joinlines(lst):
    return "\n".join(clean(x.rstrip()) for x in (lst or []))

def norm_refs(s):
    return re.sub(r",\s*", ",", (s or "").strip())

def api(method, endpoint, payload=None):
    for attempt in range(6):
        cmd = ["curl", "-sS", "--cacert", CA, "-u", f"{USER}:{KEY}",
               "-H", "Content-Type: application/json", "-w", "\n%{http_code}", BASE + endpoint]
        if method == "POST":
            cmd[1:1] = ["-X", "POST", "--data-binary",
                        json.dumps(payload if payload is not None else {})]
        out = subprocess.run(cmd, capture_output=True, text=True)
        body, _, code = out.stdout.rpartition("\n")
        code = code.strip()
        if code in ("429", "000") or code.startswith("5"):
            wait = 2 ** attempt
            print(f"  transient HTTP {code} on {endpoint} - retry in {wait}s", flush=True)
            time.sleep(wait); continue
        return code, body
    return "000", "retries exhausted"

# ---------------------------------------------------------------- inputs
cases = {}
for f in glob.glob(os.path.join(RS, "cases", "cases-*.json")):
    for c in json.load(open(f)):
        if str(c.get("viu_status", "")).startswith("Retired"):
            continue
        cases[c["id"]] = c
idmap = {r.split(",")[0]: r.split(",")[1]
         for r in open(os.path.join(RS, "testrail-id-map.csv")).read().splitlines()[1:]}
edit = json.load(open(os.path.join(HERE, "edit-set.json")))
UPDATES = [(iid, idmap[iid].lstrip("C")) for iid in sorted(edit["edited"])]
ADDS = list(edit["new"])
assert len(UPDATES) == 70 and len(ADDS) == 7, (len(UPDATES), len(ADDS))

def desired_body(c):
    return {"title": clean(c["title"].strip()),
            "custom_preconds": joinlines(c.get("preconditions", [])),
            "custom_steps": joinlines(c.get("steps", [])),
            "custom_expected": joinlines(c.get("expected", [])),
            "refs": clean((c.get("spec_ref") or "").strip())}

payloads = {iid: desired_body(cases[iid]) for iid, _ in UPDATES}
add_payloads = {}
for iid in ADDS:
    c = cases[iid]
    b = desired_body(c)
    b.update({"type_id": {"Functional": 1, "Negative": 1, "Usability": 1}.get(c["type"], 1),
              "priority_id": {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}[c["priority"]],
              "custom_atmstatus": 3, "custom_automation_type": 0})
    add_payloads[iid] = b
for iid, want in list(payloads.items()) + list(add_payloads.items()):
    assert len(want["title"]) <= 80, f"{iid}: title {len(want['title'])} chars"
    assert len(want["refs"]) <= 250, f"{iid}: refs {len(want['refs'])} chars > cap"
    assert want["refs"], f"{iid}: empty refs"
    assert re.search(r"SV-\d+", want["refs"]), f"{iid}: refs has no Jira ticket"
    for k in ("custom_preconds", "custom_steps", "custom_expected"):
        assert want[k].strip(), f"{iid}: empty {k}"
print(f"pre-flight OK: {len(payloads)} updates + {len(add_payloads)} adds", flush=True)

ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
log, failures = [], []

# ------------------------------------------------- PHASE 0: snapshots
print("===== PHASE 0: pre-push snapshots x%d =====" % len(UPDATES), flush=True)
for iid, cid in UPDATES:
    code, body = api("GET", f"get_case/{cid}")
    if code != "200":
        raise SystemExit(f"SNAPSHOT FAILED {iid} C{cid}: HTTP {code} - NOT proceeding")
    with open(os.path.join(SNAP, f"C{cid}_{iid}.pre-push-2026-07-31.json"), "w") as fh:
        fh.write(json.dumps(json.loads(body), indent=2, ensure_ascii=False) + "\n")
print("all %d snapshots saved" % len(UPDATES), flush=True)

# --------------------------------------- resolve section ids for the adds
print("===== PHASE 0b: resolve section ids under group %d =====" % GROUP, flush=True)
sections, offset = [], 0
while True:
    code, body = api("GET", f"get_sections/1&suite_id=1&limit=250&offset={offset}")
    assert code == "200", body[:200]
    chunk = json.loads(body).get("sections", [])
    sections.extend(chunk)
    if len(chunk) < 250: break
    offset += 250
parent = {s["id"]: s.get("parent_id") for s in sections}
def under_group(sid):
    seen = set()
    while sid is not None and sid not in seen:
        if sid == GROUP: return True
        seen.add(sid); sid = parent.get(sid)
    return False
in_group = [s for s in sections if under_group(s["id"])]
name2sec = {}
for s in in_group:
    name2sec.setdefault(s["name"].strip(), []).append(s["id"])
add_sections = {}
for iid in ADDS:
    area = cases[iid]["area"].strip()
    hits = name2sec.get(area, [])
    assert len(hits) == 1, f"{iid}: section '{area}' resolved to {hits}"
    add_sections[iid] = hits[0]
    print(f"  {iid} -> section {hits[0]} '{area}'", flush=True)

# ------------------------------------------------- PHASE 1: update_case
print("===== PHASE 1: update_case x%d =====" % len(UPDATES), flush=True)
for i, (iid, cid) in enumerate(UPDATES, 1):
    want = payloads[iid]
    code, body = api("POST", f"update_case/{cid}", want)
    if code != "200":
        failures.append(("update_case", iid, cid, code, body[:300]))
        log.append({"op": "update_case", "id": iid, "cid": cid, "http": code,
                    "verify": "SKIPPED-FAILED", "ts": ts(), "err": body[:300]})
        print(f"  FAIL update {iid} C{cid}: HTTP {code} {body[:200]}", flush=True)
        continue
    gcode, gbody = api("GET", f"get_case/{cid}")
    after = json.loads(gbody) if gcode == "200" else {}
    checks = {"title": (after.get("title") or "") == want["title"],
              "preconds": (after.get("custom_preconds") or "") == want["custom_preconds"],
              "steps": (after.get("custom_steps") or "") == want["custom_steps"],
              "expected": (after.get("custom_expected") or "") == want["custom_expected"],
              "refs": norm_refs(after.get("refs")) == norm_refs(want["refs"])}
    match = all(checks.values())
    log.append({"op": "update_case", "id": iid, "cid": cid, "http": code,
                "verify": "MATCH" if match else "MISMATCH", "detail": checks, "ts": ts()})
    if not match:
        failures.append(("update_verify", iid, cid, "200", str(checks)))
        print(f"  MISMATCH update {iid} C{cid}: {checks}", flush=True)
    else:
        print(f"  {i}/{len(UPDATES)} {iid} C{cid}: 200 + re-GET MATCH", flush=True)
    time.sleep(0.15)

# ------------------------------------------------- PHASE 2: add_case
print("===== PHASE 2: add_case x%d =====" % len(ADDS), flush=True)
new_ids = {}
for i, iid in enumerate(ADDS, 1):
    want = add_payloads[iid]
    code, body = api("POST", f"add_case/{add_sections[iid]}", want)
    if code != "200":
        failures.append(("add_case", iid, "", code, body[:300]))
        log.append({"op": "add_case", "id": iid, "http": code, "verify": "SKIPPED-FAILED",
                    "ts": ts(), "err": body[:300]})
        print(f"  FAIL add {iid}: HTTP {code} {body[:200]}", flush=True)
        continue
    created = json.loads(body); cid = str(created["id"])
    new_ids[iid] = cid
    gcode, gbody = api("GET", f"get_case/{cid}")
    after = json.loads(gbody) if gcode == "200" else {}
    checks = {"title": (after.get("title") or "") == want["title"],
              "preconds": (after.get("custom_preconds") or "") == want["custom_preconds"],
              "steps": (after.get("custom_steps") or "") == want["custom_steps"],
              "expected": (after.get("custom_expected") or "") == want["custom_expected"],
              "refs": norm_refs(after.get("refs")) == norm_refs(want["refs"]),
              "section": after.get("section_id") == add_sections[iid],
              "atmstatus": after.get("custom_atmstatus") == 3,
              "automation_type": after.get("custom_automation_type") == 0}
    match = all(checks.values())
    log.append({"op": "add_case", "id": iid, "cid": cid, "http": code,
                "verify": "MATCH" if match else "MISMATCH", "detail": checks, "ts": ts()})
    if not match:
        failures.append(("add_verify", iid, cid, "200", str(checks)))
        print(f"  MISMATCH add {iid} C{cid}: {checks}", flush=True)
    else:
        print(f"  {i}/{len(ADDS)} {iid} = C{cid}: 200 + re-GET MATCH", flush=True)
    time.sleep(0.15)

# --------------------------------- PHASE 3: live count under the group
print("===== PHASE 3: live count under group %d =====" % GROUP, flush=True)
count = 0
for s in in_group:
    off = 0
    while True:
        code, body = api("GET",
            f"get_cases/1&suite_id=1&section_id={s['id']}&limit=250&offset={off}")
        chunk = json.loads(body).get("cases", [])
        count += len(chunk)
        if len(chunk) < 250: break
        off += 250
print(f"live cases under group {GROUP}: {count} (expected {EXPECTED_AFTER})", flush=True)

# --------------------------------- PHASE 4: run 359 case sync (Rule 34)
print("===== PHASE 4: run %d case sync (add-only union) =====" % RUN, flush=True)
run_sync = {"run_id": RUN}
code, body = api("GET", f"get_run/{RUN}")
assert code == "200", body[:300]
run = json.loads(body)
run_sync["include_all_before"] = run.get("include_all")
print(f"  run {RUN}: include_all={run.get('include_all')} name={run.get('name')!r}", flush=True)

def get_all(endpoint, key):
    items, off = [], 0
    while True:
        c, b = api("GET", f"{endpoint}&limit=250&offset={off}")
        assert c == "200", b[:300]
        chunk = json.loads(b).get(key, [])
        items.extend(chunk)
        if len(chunk) < 250: break
        off += 250
    return items

tests_before = get_all(f"get_tests/{RUN}", "tests")
results_before = get_all(f"get_results_for_run/{RUN}", "results")
cur = sorted({t["case_id"] for t in tests_before})
run_sync.update({"tests_before": len(tests_before), "results_before": len(results_before),
                 "case_ids_before": len(cur)})
with open(os.path.join(SNAP, f"run{RUN}.pre-sync-2026-07-31.json"), "w") as fh:
    json.dump({"run": run, "tests": tests_before, "results": results_before}, fh, indent=1)
print(f"  before: {len(tests_before)} tests, {len(results_before)} results, "
      f"{len(cur)} distinct case_ids", flush=True)

if run.get("include_all"):
    print("  include_all=True -> new cases appear automatically; no update_run needed", flush=True)
    run_sync["action"] = "none (include_all=true)"
else:
    added = sorted(int(new_ids[i]) for i in ADDS if i in new_ids)
    union = sorted(set(cur) | set(added))
    assert set(cur).issubset(set(union)), "UNION LOST an existing case - ABORT"
    assert len(union) == len(cur) + len([a for a in added if a not in cur]), "union length wrong"
    print(f"  union: {len(cur)} + {len(added)} new -> {len(union)}", flush=True)
    code, body = api("POST", f"update_run/{RUN}", {"case_ids": union})
    if code != "200":
        failures.append(("update_run", str(RUN), "", code, body[:300]))
        print(f"  FAIL update_run {RUN}: HTTP {code} {body[:200]}", flush=True)
        run_sync["action"] = f"FAILED HTTP {code}"
    else:
        tests_after = get_all(f"get_tests/{RUN}", "tests")
        results_after = get_all(f"get_results_for_run/{RUN}", "results")
        after_ids = {t["case_id"] for t in tests_after}
        ok = {"count": len(tests_after) == len(union),
              "prior_cases_present": set(cur).issubset(after_ids),
              "new_cases_present": set(added).issubset(after_ids),
              "results_unchanged": len(results_after) == len(results_before)}
        run_sync.update({"action": "update_run union", "tests_after": len(tests_after),
                         "results_after": len(results_after), "verify": ok})
        print(f"  after: {len(tests_after)} tests, {len(results_after)} results; verify={ok}",
              flush=True)
        if not all(ok.values()):
            failures.append(("run_sync_verify", str(RUN), "", "200", str(ok)))

result = {"executed": ts(), "ops": log, "failures": failures,
          "new_case_ids": new_ids, "live_count_group_4281": count,
          "expected_count": EXPECTED_AFTER, "run_sync": run_sync}
with open(os.path.join(HERE, "testrail-execution-result-2026-07-31.json"), "w") as fh:
    json.dump(result, fh, indent=2, ensure_ascii=False); fh.write("\n")
print("NEW C-IDS:", json.dumps(new_ids), flush=True)
print("FAILURES:", failures if failures else "NONE", flush=True)
