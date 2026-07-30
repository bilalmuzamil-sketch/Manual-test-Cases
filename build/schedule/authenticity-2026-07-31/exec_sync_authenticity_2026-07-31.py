#!/usr/bin/env python3
"""Schedule CLOSING AUTHENTICITY pass — TestRail sync (2026-07-31).

MODE:  --dry   read-only: get_case all 164, diff vs local desired, emit the manifest
       --exec  execute: pre-write snapshots -> update_case (200 + re-GET verify) -> run-357 Rule-34

Scope guard: ONLY cases under group 4254 and ONLY run 357. 0 add_case, 0 delete_case,
0 add_section, 0 result writes. Stops on ANY non-200 or re-GET MISMATCH.
Field mapping / clean() / verify() mirror exec_sync_answers_2026-07-31.py exactly.
"""
import csv, json, glob, os, re, subprocess, sys, time
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BASE_URL = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ.get("TESTRAIL_USER"); KEY = os.environ.get("TESTRAIL_KEY")
if not USER or not KEY: sys.exit("Set TESTRAIL_USER / TESTRAIL_KEY in env (never in files).")
GROUP_ID = 4254; RUN_ID = 357
MODE = "--exec" if "--exec" in sys.argv else "--dry"
SNAP = os.path.join(HERE, "pre-push-snapshot"); os.makedirs(SNAP, exist_ok=True)


def api(method, endpoint, payload=None):
    url = BASE_URL + endpoint
    for attempt in range(6):
        cmd = ["curl", "-sS", "--cacert", CA, "-u", f"{USER}:{KEY}",
               "-H", "Content-Type: application/json", "-w", "\n%{http_code}", url]
        if method == "POST":
            cmd[1:1] = ["-X", "POST", "--data-binary", json.dumps(payload)]
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
    """True when two bodies differ ONLY in markup (plain '1. 2.' vs TestRail <ol><li>).

    16 Schedule cases were reformatted into HTML ordered lists directly in TestRail by
    another actor. Their CONTENT is identical to ours. Pushing our plain-text version
    would silently REVERT someone else's formatting, which is out of this task's scope -
    so a markup-only difference is treated as NO CHANGE and never written.
    """
    import html as _h

    def norm(s):
        s = _h.unescape(s or "")
        s = re.sub(r"</li>|<li>", "", s)
        s = re.sub(r"</?ol>|</?ul>|</?p>", "", s)
        s = re.sub(r"^\s*\d+\.\s*", "", s, flags=re.M)
        return re.sub(r"\s+", " ", s).strip()
    return norm(a) == norm(b)


def verify(after, want):
    """Verify ONLY the fields present in the partial payload we sent."""
    d = {}
    for k, v in want.items():
        if k == "refs":
            d[k] = norm_refs(after.get("refs") or "") == norm_refs(v)
        else:
            d[k] = (after.get(k) or "") == v
    return all(d.values()), d

cases = {}
for f in glob.glob(os.path.join(ROOT, "cases", "cases-*.json")):
    for c in json.load(open(f)):
        if str(c.get("viu_status", "")).lower().startswith("retired"): continue
        cases[c["id"]] = c
idmap = {r["internal_id"]: r["testrail_case_id"] for r in csv.DictReader(open(os.path.join(ROOT, "testrail-id-map.csv")))}
print(f"local active cases: {len(cases)}")

# ---- scope: resolve the group-4254 subtree, live -------------------------
secs = api("GET", "get_sections/1&suite_id=1")
seclist = secs["sections"] if isinstance(secs, dict) and "sections" in secs else secs
subtree = {GROUP_ID}; ch = True
while ch:
    ch = False
    for s in seclist:
        if s.get("parent_id") in subtree and s["id"] not in subtree: subtree.add(s["id"]); ch = True
live = {}
off = 0
while True:
    r = api("GET", f"get_cases/1&suite_id=1&limit=250&offset={off}")
    b = r["cases"] if isinstance(r, dict) and "cases" in r else r
    for c in b:
        if c.get("section_id") in subtree: live[c["id"]] = c
    if len(b) < 250: break
    off += 250
print(f"LIVE cases under group {GROUP_ID}: {len(live)}")

# ---- diff ---------------------------------------------------------------
plan = []
for sid, c in sorted(cases.items()):
    cno = idmap.get(sid, "")
    if not cno: print(f"  !! {sid} has NO C-id in id-map"); continue
    cid = int(cno.lstrip("C"))
    if cid not in live: print(f"  !! {sid} C{cid} NOT under group {GROUP_ID} live"); continue
    full = desired(c); before = live[cid]
    changed = [k for k, v in full.items()
               if (before.get(k) or "") != v
               and not (k == "refs" and norm_refs(before.get("refs") or "") == norm_refs(v))
               and not (k in BODY and semeq(v, before.get(k) or ""))]
    if changed:
        want = {k: full[k] for k in changed}   # PARTIAL payload - only fields we really changed
        plan.append((sid, cid, changed, want, before))
print(f"\ncases needing update_case: {len(plan)}")
import collections
fc = collections.Counter()
for _, _, ch2, _, _ in plan:
    for k in ch2: fc[k] += 1
print("field change counts:", dict(fc))
for sid, cid, ch2, _, _ in plan: print(f"  {sid:16} C{cid}  {ch2}")
json.dump([{"sch": s, "cid": c, "changed": ch2} for s, c, ch2, _, _ in plan],
          open(os.path.join(HERE, "planned-updates.json"), "w"), indent=1)
scope_ok = (len(live) == len(cases))
print(f"\nlive count == local active count: {scope_ok} ({len(live)} vs {len(cases)})")
if MODE == "--dry":
    print("\nDRY RUN - no writes issued."); sys.exit(0)

# ---- EXECUTE ------------------------------------------------------------
ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
log = []
print("\n===== PHASE 0: pre-write get_case snapshots =====", flush=True)
for sid, cid, _, _, _ in plan:
    b = api("GET", f"get_case/{cid}")
    json.dump(b, open(os.path.join(SNAP, f"C{cid}-{sid}-pre-push-2026-07-31.json"), "w"), indent=2, ensure_ascii=False)
print(f"  {len(plan)} snapshots written")
print("\n===== PHASE 1: update_case =====", flush=True)
for sid, cid, ch2, want, _ in plan:
    api("POST", f"update_case/{cid}", want)
    after = api("GET", f"get_case/{cid}")
    m, d = verify(after, want)
    print(f"  {sid:<16} C{cid}  changed={ch2}  MATCH={m}", flush=True)
    log.append({"op": "update_case", "sch": sid, "cid": cid, "ts": ts(), "match": m,
                "detail": d, "changed_fields": ch2})
    if not m: raise RuntimeError(f"MISMATCH on {sid} C{cid}: {d}")
print(f"\n  {len(plan)}/{len(plan)} update_case HTTP 200 + re-GET MATCH")
print("\n===== PHASE 2: live count under group 4254 =====", flush=True)
live2 = {}; off = 0
while True:
    r = api("GET", f"get_cases/1&suite_id=1&limit=250&offset={off}")
    b = r["cases"] if isinstance(r, dict) and "cases" in r else r
    for c in b:
        if c.get("section_id") in subtree: live2[c["id"]] = c
    if len(b) < 250: break
    off += 250
print(f"  LIVE CASE COUNT under group {GROUP_ID}: {len(live2)}  (expect {len(cases)})")
log.append({"op": "live_count", "group": GROUP_ID, "count": len(live2), "ts": ts()})
print(f"\n===== PHASE 3: Rule-34 run {RUN_ID} equality both ways =====", flush=True)
run = api("GET", f"get_run/{RUN_ID}")
print(f"  run {RUN_ID}: {run.get('name')!r}")
tests = []; off = 0
while True:
    r = api("GET", f"get_tests/{RUN_ID}&limit=250&offset={off}")
    b = r["tests"] if isinstance(r, dict) and "tests" in r else r
    tests += b
    if len(b) < 250: break
    off += 250
in_run = {t["case_id"] for t in tests}
want_ids = {int(idmap[s].lstrip("C")) for s in cases if idmap.get(s)}
missing = sorted(want_ids - in_run); extra = sorted(in_run - want_ids)
print(f"  tests in run: {len(tests)} | active cases: {len(want_ids)}")
print(f"  in cases but NOT in run: {len(missing)} {missing}")
print(f"  in run but NOT in active cases: {len(extra)} {extra}")
res = api("GET", f"get_results_for_run/{RUN_ID}&limit=1")
rc = res.get("size") if isinstance(res, dict) else None
allres = []; off = 0
while True:
    r = api("GET", f"get_results_for_run/{RUN_ID}&limit=250&offset={off}")
    b = r["results"] if isinstance(r, dict) and "results" in r else r
    allres += b
    if len(b) < 250: break
    off += 250
print(f"  results in run {RUN_ID}: {len(allres)}")
log.append({"op": "run_verify", "run": RUN_ID, "tests": len(tests), "missing": missing,
            "extra": extra, "results": len(allres), "ts": ts()})
if missing:
    print(f"\n  UNION-ADD required: {len(missing)} case(s) missing from run {RUN_ID}")
    all_ids = sorted(in_run | set(missing))
    api("POST", f"update_run/{RUN_ID}", {"include_all": False, "case_ids": all_ids})
    t2 = []; off = 0
    while True:
        r = api("GET", f"get_tests/{RUN_ID}&limit=250&offset={off}")
        b = r["tests"] if isinstance(r, dict) and "tests" in r else r
        t2 += b
        if len(b) < 250: break
        off += 250
    a2 = []; off = 0
    while True:
        r = api("GET", f"get_results_for_run/{RUN_ID}&limit=250&offset={off}")
        b = r["results"] if isinstance(r, dict) and "results" in r else r
        a2 += b
        if len(b) < 250: break
        off += 250
    print(f"  AFTER union-add: tests={len(t2)} results={len(a2)} (was {len(tests)}/{len(allres)})")
    log.append({"op": "update_run", "run": RUN_ID, "tests_after": len(t2),
                "results_after": len(a2), "added": missing, "ts": ts()})
else:
    print(f"  run {RUN_ID} already equals the active set BOTH WAYS - no update_run issued")
json.dump(log, open(os.path.join(HERE, "testrail-op-log-2026-07-31.json"), "w"), indent=1)
print("\nDONE - per-op log written")
