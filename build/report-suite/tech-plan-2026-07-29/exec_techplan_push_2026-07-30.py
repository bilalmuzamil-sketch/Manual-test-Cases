#!/usr/bin/env python3
"""Execute the AUTHORIZED Report Suite tech-plan push (2026-07-30, "Push all three").

Scope: EXACTLY ChangeList-2026-07-30.md section C — 5 update_case + 5 add_case.
NOTHING else: 0 deletes, 0 section writes, NO run writes (R359 untouched).
Payload conventions mirror reconciliation-2026-07-28/exec_push_2026-07-28.py
(clean() internal-id scrub, joinlines, refs = cleaned spec_ref condensed to the
250-char TestRail cap, re-GET byte-verify per op).

Usage: python3 exec_techplan_push_2026-07-30.py [--preflight-only]
"""
import json, glob, os, re, subprocess, sys, time
from datetime import datetime, timezone

BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ["TESTRAIL_USER"]; KEY = os.environ["TESTRAIL_KEY"]
HERE = os.path.dirname(os.path.abspath(__file__))
CASES_DIR = os.path.join(HERE, "..", "cases")
TYPE_ID = {"Functional": 6, "Negative": 5, "Accessibility": 2}
PRIO_ID = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}

UPDATES = [  # internal id -> C-id (per ChangeList C + id-map)
    ("WIP-API-01", 30528),
    ("SBR-STAT-02", 30209),
    ("PV-CALC-07", 30365),
    ("SBC-API-02", 30191),
    ("IV-EXP-07", 30593),
]
ADDS = [  # internal id -> live TestRail section id (resolved 2026-07-30, all under group 4281)
    ("PV-EXP-11", 4335),   # PV — Exports (parent Parts Velocity Report)
    ("TU-EXP-09", 4346),   # TU — Exports (parent Technician Utilization)
    ("WIP-CALC-10", 4354), # WIP — Earned & Remaining (parent Work In Progress)
    ("IV-DATE-09", 4368),  # IV — As-of Date & Snapshots (parent Inventory Value)
    ("SBR-CALC-09", 4314), # SBR — Inv. Hrs & Calculations (parent Sales By Representative Report)
]

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

def condense_refs(refs):
    """TestRail refs cap = 250 chars; condense by dropping parentheticals from the tail."""
    if len(refs) <= 250:
        return refs
    r = re.sub(r"\s*\([^()]*\)", "", refs)  # drop innermost parentheticals
    if len(r) <= 250:
        return r
    return r[:247] + "..."

def api(method, endpoint, payload=None):
    for attempt in range(6):
        cmd = ["curl", "-sS", "--cacert", CA, "-u", f"{USER}:{KEY}",
               "-H", "Content-Type: application/json", "-w", "\n%{http_code}",
               BASE + endpoint]
        if method == "POST":
            cmd[1:1] = ["-X", "POST", "--data-binary",
                        json.dumps(payload if payload is not None else {})]
        out = subprocess.run(cmd, capture_output=True, text=True)
        body, _, code = out.stdout.rpartition("\n")
        code = code.strip()
        if code in ("429", "000") or code.startswith("5"):
            wait = 2 ** attempt
            print(f"  transient HTTP {code} on {endpoint} - retry in {wait}s", flush=True)
            time.sleep(wait)
            continue
        return code, body
    return "000", "retries exhausted"

# ---- load local case bodies
cases = {}
for f in glob.glob(os.path.join(CASES_DIR, "cases-*.json")):
    for c in json.load(open(f)):
        if not str(c.get("viu_status", "")).startswith("Retired"):
            cases[c["id"]] = c

def desired_body(c):
    return {
        "title": clean(c["title"].strip()),
        "custom_preconds": joinlines(c.get("preconditions", [])),
        "custom_steps": joinlines(c.get("steps", [])),
        "custom_expected": joinlines(c.get("expected", [])),
        "refs": condense_refs(clean((c.get("spec_ref") or "").strip())),
    }

# ---- PRE-FLIGHT all 10 payloads
print("===== PRE-FLIGHT (10 payloads) =====")
problems = []
for iid, _ in UPDATES + ADDS:
    if iid not in cases:
        problems.append(f"{iid}: LOCAL BODY NOT FOUND"); continue
    w = desired_body(cases[iid])
    tl, rl = len(w["title"]), len(w["refs"])
    angle = any(("<" in v or ">" in v) for v in w.values())
    viu = any(re.search(r"\bVIU\b|feature[ -]flag", v, re.I) for v in w.values())
    flags = []
    if tl > 84: flags.append(f"TITLE {tl}>84")
    if rl > 250: flags.append(f"REFS {rl}>250")
    if angle: flags.append("ANGLE-BRACKETS")
    if viu: flags.append("VIU/FLAG WORD")
    print(f"  {iid}: title {tl} chars | refs {rl} chars | {'; '.join(flags) if flags else 'OK'}")
    if flags: problems.append(f"{iid}: {'; '.join(flags)}")
# note: the 4 unchanged update titles (>84, pre-existing, NOT part of this authorized diff)
# are exempt — only IV-EXP-07's title changes this push.
hard = [p for p in problems if "NOT FOUND" in p or "REFS" in p or "ANGLE" in p]
if hard:
    print("PRE-FLIGHT HARD FAILURES:"); [print("  -", p) for p in hard]; sys.exit(1)
if "--preflight-only" in sys.argv:
    print("Pre-flight only — no writes."); sys.exit(0)

log = []
ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
failures = []
new_cids = {}

# ============ PHASE 1: update_case x5 ============
print("===== PHASE 1: update_case x%d =====" % len(UPDATES), flush=True)
for iid, cid in UPDATES:
    want = desired_body(cases[iid])
    code, body = api("POST", f"update_case/{cid}", want)
    if code != "200":
        failures.append(("update_case", iid, cid, code, body[:300]))
        log.append({"op": "update_case", "id": iid, "cid": cid, "http": code,
                    "verify": "SKIPPED-FAILED", "ts": ts(), "err": body[:300]})
        print(f"  FAIL update {iid} C{cid}: HTTP {code}", flush=True)
        continue
    gcode, gbody = api("GET", f"get_case/{cid}")
    after = json.loads(gbody) if gcode == "200" else {}
    checks = {
        "title": (after.get("title") or "") == want["title"],
        "preconds": (after.get("custom_preconds") or "") == want["custom_preconds"],
        "steps": (after.get("custom_steps") or "") == want["custom_steps"],
        "expected": (after.get("custom_expected") or "") == want["custom_expected"],
        "refs": norm_refs(after.get("refs")) == norm_refs(want["refs"]),
    }
    match = all(checks.values())
    log.append({"op": "update_case", "id": iid, "cid": cid, "http": code,
                "verify": "MATCH" if match else "MISMATCH", "detail": checks, "ts": ts()})
    print(f"  update {iid} C{cid}: HTTP {code} verify={'MATCH' if match else checks}", flush=True)
    if not match:
        failures.append(("update_verify", iid, cid, "200", str(checks)))
    time.sleep(0.3)

# ============ PHASE 2: add_case x5 ============
print("===== PHASE 2: add_case x%d =====" % len(ADDS), flush=True)
for iid, sec in ADDS:
    c = cases[iid]
    want = desired_body(c)
    payload = dict(want)
    payload.update({"type_id": TYPE_ID[c["type"].strip()],
                    "priority_id": PRIO_ID[c["priority"].strip()],
                    "template_id": 1,
                    "custom_atmstatus": 3, "custom_automation_type": 0})
    code, body = api("POST", f"add_case/{sec}", payload)
    if code != "200":
        failures.append(("add_case", iid, "-", code, body[:300]))
        log.append({"op": "add_case", "id": iid, "section": sec, "http": code,
                    "ts": ts(), "err": body[:300]})
        print(f"  FAIL add {iid} (sec {sec}): HTTP {code} {body[:200]}", flush=True)
        continue
    res = json.loads(body)
    cid = res["id"]
    new_cids[iid] = cid
    gcode, gbody = api("GET", f"get_case/{cid}")
    after = json.loads(gbody) if gcode == "200" else {}
    checks = {
        "title": (after.get("title") or "") == want["title"],
        "preconds": (after.get("custom_preconds") or "") == want["custom_preconds"],
        "steps": (after.get("custom_steps") or "") == want["custom_steps"],
        "expected": (after.get("custom_expected") or "") == want["custom_expected"],
        "refs": norm_refs(after.get("refs")) == norm_refs(want["refs"]),
        "section": after.get("section_id") == sec,
        "atm": after.get("custom_atmstatus") == 3 and after.get("custom_automation_type") == 0,
    }
    match = all(checks.values())
    log.append({"op": "add_case", "id": iid, "cid": str(cid), "section": sec, "http": code,
                "verify": "MATCH" if match else "MISMATCH", "detail": checks, "ts": ts()})
    print(f"  add {iid} -> C{cid} (sec {sec}) verify={'MATCH' if match else checks}", flush=True)
    if not match:
        failures.append(("add_verify", iid, str(cid), "200", str(checks)))
    time.sleep(0.3)

# ============ POST: live count under 4281 + R359 untouched check ============
code, body = api("GET", "get_cases/1&suite_id=1&limit=1&offset=0")
# count cases under group 4281 via sections
scode, sbody = api("GET", "get_sections/1&suite_id=1&limit=250&offset=0")
secs = []
off = 0
while True:
    scode, sbody = api("GET", f"get_sections/1&suite_id=1&limit=250&offset={off}")
    d = json.loads(sbody)
    batch = d["sections"] if isinstance(d, dict) else d
    secs += batch
    if len(batch) < 250: break
    off += 250
byid = {s["id"]: s for s in secs}
def under4281(sid):
    s = byid.get(sid)
    while s:
        if s["id"] == 4281: return True
        s = byid.get(s["parent_id"])
    return False
group_secs = [s["id"] for s in secs if under4281(s["id"])]
total = 0
for sid in group_secs:
    ccode, cbody = api("GET", f"get_cases/1&suite_id=1&section_id={sid}&limit=250")
    d = json.loads(cbody)
    items = d["cases"] if isinstance(d, dict) else d
    total += len([x for x in items if x.get("section_id") == sid])
print("LIVE COUNT under group 4281:", total)

rcode, rbody = api("GET", "get_run/359")
r359 = json.loads(rbody) if rcode == "200" else {}
print("R359: untested", r359.get("untested_count"), "| passed", r359.get("passed_count"),
      "| failed", r359.get("failed_count"), "| completed", r359.get("is_completed"))

json.dump({"log": log, "failures": failures, "new_cids": new_cids,
           "live_count_4281": total, "r359": {k: r359.get(k) for k in
           ("untested_count", "passed_count", "failed_count", "blocked_count", "retest_count")}},
          open(os.path.join(HERE, "testrail-execution-result-techplan-2026-07-30.json"), "w"),
          indent=1)
print("\nSUMMARY: updates", len(UPDATES), "| adds", len(ADDS), "| new C-ids:", new_cids,
      "| FAILURES:", len(failures))
for f in failures:
    print("  FAILURE:", f)
