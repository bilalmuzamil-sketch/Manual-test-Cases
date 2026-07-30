#!/usr/bin/env python3
"""Schedule COVERAGE RE-DERIVATION - TestRail sync (2026-07-31).

MODE: --dry  read-only plan   |   --exec  execute
Ops: 1 add_case (SCH-PERM-13 -> section 4279) + 1 update_case (SCH-DND-07 C29961, PARTIAL)
     + Rule-34 union run-357 sync. 0 delete, 0 result writes, no other run.
Field mapping / clean() / semeq() / verify() mirror exec_sync_authenticity_2026-07-31.py.
"""
import csv, json, glob, os, re, subprocess, sys, time
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
BASE_URL = "https://shopview.testrail.io/index.php?/api/v2/"; CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ.get("TESTRAIL_USER"); KEY = os.environ.get("TESTRAIL_KEY")
if not USER or not KEY: sys.exit("Set TESTRAIL_USER / TESTRAIL_KEY in env (never in files).")
GROUP_ID = 4254; RUN_ID = 357; PERM_SECTION = 4279
NEW_ID = "SCH-PERM-13"; UPD_ID = "SCH-DND-07"
MODE = "--exec" if "--exec" in sys.argv else "--dry"
SNAP = os.path.join(HERE, "pre-push-snapshot"); os.makedirs(SNAP, exist_ok=True)
ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")

def api(method, endpoint, payload=None):
    for attempt in range(6):
        cmd = ["curl", "-sS", "--cacert", CA, "-u", f"{USER}:{KEY}",
               "-H", "Content-Type: application/json", "-w", "\n%{http_code}", BASE_URL + endpoint]
        if method == "POST": cmd[1:1] = ["-X", "POST", "--data-binary", json.dumps(payload)]
        out = subprocess.run(cmd, capture_output=True, text=True)
        body, _, code = out.stdout.rpartition("\n"); code = code.strip()
        if code in ("429", "000") or code.startswith("5"):
            w = 2 ** attempt; print(f"  HTTP {code} on {endpoint} - retry in {w}s", flush=True); time.sleep(w); continue
        if code != "200": raise RuntimeError(f"HTTP {code} on {method} {endpoint}: {body[:400]}")
        return json.loads(body) if body.strip() else {}
    raise RuntimeError(f"Retries exhausted on {method} {endpoint}")

def clean(s):
    if not s: return s
    s = re.sub(r"\s*\(see (?:SCH|FLT|GS|SF|FD)-[A-Z0-9-]+(?:'s setup)?\)", "", s)
    s = re.sub(r"\s*\(from (?:SCH|FLT|GS|SF|FD)-[A-Z0-9-]+'s setup\)", "", s)
    s = re.sub(r"\s*\(per (?:SCH|FLT|GS|SF|FD)-[A-Z0-9-]+\)", "", s)
    s = re.sub(r"[,;]?\s*SCH-[A-Z]+-\d+(\.\.\d+)?", "", s)
    s = re.sub(r"feature[ -]flags?", "Schedule feature", s, flags=re.I)
    return s
def joinlines(l): return "\n".join(clean(x.rstrip()) for x in (l or []))
def norm_refs(s): return re.sub(r",\s*", ",", (s or "").strip())
def desired(c):
    return {"title": clean(c["title"].strip()),
            "custom_preconds": joinlines(c.get("preconditions", [])),
            "custom_steps": joinlines(c.get("steps", [])),
            "custom_expected": joinlines(c.get("expected", [])),
            "refs": clean((c.get("refs") or c.get("spec_ref") or "").strip())}
BODY = {"custom_preconds", "custom_steps", "custom_expected"}
def semeq(a, b):
    import html as _h
    def norm(s):
        s = _h.unescape(s or "")
        s = re.sub(r"</li>|<li>", "", s); s = re.sub(r"</?ol>|</?ul>|</?p>", "", s)
        s = re.sub(r"^\s*\d+\.\s*", "", s, flags=re.M)
        return re.sub(r"\s+", " ", s).strip()
    return norm(a) == norm(b)
def verify(after, want):
    def eq(k, v):
        if k == "refs": return norm_refs(after.get("refs") or "") == norm_refs(v)
        a = after.get(k)
        if isinstance(v, int): return a == v          # numeric fields: 0 is a REAL value, not blank
        return (a or "") == v
    d = {k: eq(k, v) for k, v in want.items()}
    return all(d.values()), d

cases = {}
for f in glob.glob(os.path.join(ROOT, "cases", "cases-*.json")):
    for c in json.load(open(f)):
        if str(c.get("viu_status", "")).lower().startswith("retired"): continue
        cases[c["id"]] = c
rows = list(csv.DictReader(open(os.path.join(ROOT, "testrail-id-map.csv"))))
idmap = {r["internal_id"]: r["testrail_case_id"] for r in rows}
print(f"local active cases: {len(cases)}  (expect 165)")
assert NEW_ID in cases and UPD_ID in cases

# ---- live scope ---------------------------------------------------------
secs = api("GET", "get_sections/1&suite_id=1")
seclist = secs["sections"] if isinstance(secs, dict) and "sections" in secs else secs
subtree = {GROUP_ID}; ch = True
while ch:
    ch = False
    for s in seclist:
        if s.get("parent_id") in subtree and s["id"] not in subtree: subtree.add(s["id"]); ch = True
assert PERM_SECTION in subtree, "target section is not inside group 4254 - ABORT"
def live_cases():
    out = {}; off = 0
    while True:
        r = api("GET", f"get_cases/1&suite_id=1&limit=250&offset={off}")
        b = r["cases"] if isinstance(r, dict) and "cases" in r else r
        for c in b:
            if c.get("section_id") in subtree: out[c["id"]] = c
        if len(b) < 250: break
        off += 250
    return out
live = live_cases()
print(f"LIVE cases under group {GROUP_ID}: {len(live)}  (expect 164 before the add)")

# ---- plan --------------------------------------------------------------
add_payload = dict(desired(cases[NEW_ID]))
add_payload.update({"custom_atmstatus": 3, "custom_automation_type": 0,
                    "priority_id": {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}.get(cases[NEW_ID]["priority"], 2)})
print(f"\nOP1 add_case -> section {PERM_SECTION}: {add_payload['title']!r}")
print(f"     refs={add_payload['refs']!r} (len {len(add_payload['refs'])}, commas {add_payload['refs'].count(',')})")
assert len(add_payload["refs"]) <= 245 and "," not in add_payload["refs"]
assert len(add_payload["title"]) <= 80
assert idmap.get(NEW_ID, "") == "", f"{NEW_ID} already has a C-id: {idmap.get(NEW_ID)}"

cid_upd = int(idmap[UPD_ID].lstrip("C")); before = live[cid_upd]
full = desired(cases[UPD_ID])
changed = [k for k, v in full.items()
           if (before.get(k) or "") != v
           and not (k == "refs" and norm_refs(before.get("refs") or "") == norm_refs(v))
           and not (k in BODY and semeq(v, before.get(k) or ""))]
upd_payload = {k: full[k] for k in changed}
print(f"\nOP2 update_case C{cid_upd} ({UPD_ID}) PARTIAL fields: {changed}")
for k in changed:
    print(f"     {k}: len {len(before.get(k) or '')} -> {len(full[k])}")
assert "," not in full["refs"], "refs must be comma-free"
assert len(full["refs"]) <= 245

run = api("GET", f"get_run/{RUN_ID}")
def run_tests():
    t = []; off = 0
    while True:
        r = api("GET", f"get_tests/{RUN_ID}&limit=250&offset={off}")
        b = r["tests"] if isinstance(r, dict) and "tests" in r else r
        t += b
        if len(b) < 250: break
        off += 250
    return t
def run_results():
    res = []; off = 0
    while True:
        r = api("GET", f"get_results_for_run/{RUN_ID}&limit=250&offset={off}")
        b = r["results"] if isinstance(r, dict) and "results" in r else r
        res += b
        if len(b) < 250: break
        off += 250
    return res
tests0 = run_tests(); res0 = run_results()
cur_ids = sorted({t["case_id"] for t in tests0})
print(f"\nOP3 run {RUN_ID} {run.get('name')!r} include_all={run.get('include_all')}")
print(f"     tests before: {len(tests0)} | distinct case_ids: {len(cur_ids)} | results before: {len(res0)}")
if MODE == "--dry":
    print("\nDRY RUN - no writes issued."); sys.exit(0)

# ---- EXECUTE -----------------------------------------------------------
log = []
print("\n===== PHASE 0: pre-write snapshots =====", flush=True)
json.dump(api("GET", f"get_case/{cid_upd}"), open(os.path.join(SNAP, f"C{cid_upd}-{UPD_ID}-pre-push-2026-07-31.json"), "w"), indent=2, ensure_ascii=False)
json.dump(tests0, open(os.path.join(SNAP, f"run{RUN_ID}-tests-pre-push-2026-07-31.json"), "w"), indent=1)
json.dump(res0, open(os.path.join(SNAP, f"run{RUN_ID}-results-pre-push-2026-07-31.json"), "w"), indent=1)
print(f"  case snapshot + run tests ({len(tests0)}) + run results ({len(res0)}) written")

print("\n===== PHASE 1: add_case =====", flush=True)
RESUME_CID = os.environ.get("RESUME_CID")
if RESUME_CID:
    new_cid = int(RESUME_CID.lstrip("C"))
    print(f"  RESUME: case already created as C{new_cid} by the killed run - verifying instead of re-adding")
else:
    created = api("POST", f"add_case/{PERM_SECTION}", add_payload)
    new_cid = created["id"]
after = api("GET", f"get_case/{new_cid}")
m, d = verify(after, add_payload)
print(f"  {NEW_ID} -> C{new_cid}  section={after['section_id']}  MATCH={m}  atm={after.get('custom_atmstatus')} auto={after.get('custom_automation_type')}")
log.append({"op": "add_case", "sch": NEW_ID, "cid": new_cid, "section": after["section_id"], "ts": ts(), "match": m, "detail": d})
if not m or after["section_id"] != PERM_SECTION: raise RuntimeError(f"add_case verify failed: {d}")

print("\n===== PHASE 2: update_case (partial) =====", flush=True)
api("POST", f"update_case/{cid_upd}", upd_payload)
after = api("GET", f"get_case/{cid_upd}")
m, d = verify(after, upd_payload)
print(f"  {UPD_ID} C{cid_upd} changed={changed} MATCH={m}")
log.append({"op": "update_case", "sch": UPD_ID, "cid": cid_upd, "ts": ts(), "match": m, "detail": d, "changed_fields": changed})
if not m: raise RuntimeError(f"MISMATCH on {UPD_ID}: {d}")
assert after["title"] == before["title"], "title must be untouched"

print("\n===== PHASE 3: live count under group 4254 =====", flush=True)
live2 = live_cases()
print(f"  LIVE: {len(live2)}  (expect {len(cases)})")
log.append({"op": "live_count", "group": GROUP_ID, "count": len(live2), "ts": ts()})

print(f"\n===== PHASE 4: Rule-34 union sync of run {RUN_ID} =====", flush=True)
new_sel = sorted(set(cur_ids) | {new_cid})
assert set(cur_ids) <= set(new_sel), "UNION guard failed - a prior case would drop out"
assert len(new_sel) == len(cur_ids) + 1, f"length guard failed {len(new_sel)} vs {len(cur_ids)}+1"
print(f"  union selection: {len(cur_ids)} -> {len(new_sel)} (adding C{new_cid})")
api("POST", f"update_run/{RUN_ID}", {"case_ids": new_sel, "include_all": False})
tests1 = run_tests(); res1 = run_results()
ids1 = {t["case_id"] for t in tests1}
ok = (len(tests1) == len(cur_ids) + 1 and set(cur_ids) <= ids1 and new_cid in ids1 and len(res1) == len(res0))
print(f"  tests {len(tests0)} -> {len(tests1)} | new case present: {new_cid in ids1} | all prior present: {set(cur_ids) <= ids1}")
print(f"  results {len(res0)} -> {len(res1)}  UNCHANGED={len(res0) == len(res1)}")
log.append({"op": "update_run", "run": RUN_ID, "ts": ts(), "tests_before": len(tests0), "tests_after": len(tests1),
            "results_before": len(res0), "results_after": len(res1), "added": new_cid,
            "all_prior_present": bool(set(cur_ids) <= ids1), "ok": bool(ok)})
if not ok: raise RuntimeError("run-357 verification FAILED")

json.dump(log, open(os.path.join(HERE, "testrail-op-log-2026-07-31.json"), "w"), indent=1)
json.dump({"new_case": {NEW_ID: f"C{new_cid}"}}, open(os.path.join(HERE, "new-cid.json"), "w"), indent=1)
print("\nALL OPS VERIFIED. new C-id:", f"C{new_cid}")
