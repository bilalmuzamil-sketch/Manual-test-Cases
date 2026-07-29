#!/usr/bin/env python3
"""Execute the AUTHORIZED Report Suite TestRail push (2026-07-28).

Per build/report-suite/reconciliation-2026-07-28/testrail-push-manifest-2026-07-28.md:
  update_case x70 (final local body) -> add_case x1 (SBC-EXP-16, section 4300)
  -> delete_case x57. Each update re-GET verified; each delete verified gone.
NEVER writes to any run. Persistent per-item failures are recorded and skipped,
the rest continue.
"""
import json, glob, os, re, subprocess, sys, time
from datetime import datetime, timezone

BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ["TESTRAIL_USER"]; KEY = os.environ["TESTRAIL_KEY"]
RS = "build/report-suite"
SBC_EXPORTS_SECTION = 4300
TYPE_ID = {"Functional": 6, "Negative": 5, "Accessibility": 2}
PRIO_ID = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}

REFS_OVERRIDE = {
 "SBC-EXP-01": ("SV-8612; SV-8613 (specs/sbc-sales-by-customer.md S14-R1; S14-R2; S15-R1; S15-R2; "
                "S20-R16 — Print REMOVED per kickoff video P25 31:14, overriding Story 16 / SV-8614; "
                "user ruling 2026-07-28 video-overrides-spec)"),
 "SBR-LOC-03": ("SV-8638 (specs/sbr-sales-by-representative.md Story 21 S21-R3; S21-R4; S21-R5; §3 — "
                "per-row location identifier ADDED per kickoff video P10 40:58-41:20; user ruling "
                "2026-07-28 video-overrides-spec)"),
}

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
    """Returns (code, body). Retries 429/5xx/000 with backoff."""
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

# ---- load local state
cases = {}
for f in glob.glob(os.path.join(RS, "cases", "cases-*.json")):
    for c in json.load(open(f)):
        cases[c["id"]] = c
ops = json.load(open("/tmp/rs-push/ops.json"))
idmap = ops["idmap"]

def desired_body(c):
    iid = c["id"]
    refs = REFS_OVERRIDE.get(iid) or clean((c.get("spec_ref") or "").strip())
    return {
        "title": clean(c["title"].strip()),
        "custom_preconds": joinlines(c.get("preconditions", [])),
        "custom_steps": joinlines(c.get("steps", [])),
        "custom_expected": joinlines(c.get("expected", [])),
        "refs": refs,
    }

log = []
ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
failures = []
new_cid = None

# ============ PHASE 1: update_case x70 ============
print("===== PHASE 1: update_case x%d =====" % len(ops["updates"]), flush=True)
for i, iid in enumerate(ops["updates"]):
    cid = idmap[iid].lstrip("C")
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
    if not match:
        failures.append(("update_verify", iid, cid, "200", str(checks)))
        print(f"  MISMATCH update {iid} C{cid}: {checks}", flush=True)
    if (i + 1) % 10 == 0:
        print(f"  {i+1}/{len(ops['updates'])} updated", flush=True)
    time.sleep(0.2)

# ============ PHASE 2: add_case x1 ============
print("===== PHASE 2: add_case SBC-EXP-16 =====", flush=True)
c = cases["SBC-EXP-16"]
want = desired_body(c)
payload = dict(want)
payload.update({"type_id": TYPE_ID[c["type"].strip()],
                "priority_id": PRIO_ID[c["priority"].strip()],
                "template_id": 1,
                "custom_atmstatus": 3, "custom_automation_type": 0})
code, body = api("POST", f"add_case/{SBC_EXPORTS_SECTION}", payload)
if code != "200":
    failures.append(("add_case", "SBC-EXP-16", "-", code, body[:300]))
    log.append({"op": "add_case", "id": "SBC-EXP-16", "http": code, "ts": ts(),
                "err": body[:300]})
    print(f"  FAIL add_case: HTTP {code} {body[:200]}", flush=True)
else:
    res = json.loads(body)
    new_cid = res["id"]
    gcode, gbody = api("GET", f"get_case/{new_cid}")
    after = json.loads(gbody) if gcode == "200" else {}
    checks = {
        "title": (after.get("title") or "") == want["title"],
        "preconds": (after.get("custom_preconds") or "") == want["custom_preconds"],
        "steps": (after.get("custom_steps") or "") == want["custom_steps"],
        "expected": (after.get("custom_expected") or "") == want["custom_expected"],
        "refs": norm_refs(after.get("refs")) == norm_refs(want["refs"]),
        "section": after.get("section_id") == SBC_EXPORTS_SECTION,
        "atm": after.get("custom_atmstatus") == 3 and after.get("custom_automation_type") == 0,
    }
    match = all(checks.values())
    log.append({"op": "add_case", "id": "SBC-EXP-16", "cid": str(new_cid), "http": code,
                "verify": "MATCH" if match else "MISMATCH", "detail": checks, "ts": ts()})
    print(f"  SBC-EXP-16 created: C{new_cid} MATCH={match}", flush=True)
    if not match:
        failures.append(("add_verify", "SBC-EXP-16", str(new_cid), "200", str(checks)))

# ============ PHASE 3: delete_case x57 ============
print("===== PHASE 3: delete_case x%d =====" % len(ops["deletes"]), flush=True)
for i, iid in enumerate(ops["deletes"]):
    cid = idmap[iid].lstrip("C")
    n = int(cid)
    if not (30096 <= n <= 30610):   # final range guard
        failures.append(("delete_guard", iid, cid, "-", "OUT OF RANGE — not deleted"))
        print(f"  GUARD: {iid} C{cid} out of range, NOT deleted", flush=True)
        continue
    code, body = api("POST", f"delete_case/{cid}", {})
    if code != "200":
        failures.append(("delete_case", iid, cid, code, body[:300]))
        log.append({"op": "delete_case", "id": iid, "cid": cid, "http": code,
                    "verify": "SKIPPED-FAILED", "ts": ts(), "err": body[:300]})
        print(f"  FAIL delete {iid} C{cid}: HTTP {code}", flush=True)
        continue
    gcode, gbody = api("GET", f"get_case/{cid}")
    gone = gcode != "200" or (gcode == "200" and json.loads(gbody).get("is_deleted") == 1)
    log.append({"op": "delete_case", "id": iid, "cid": cid, "http": code,
                "verify": "GONE(re-GET %s)" % gcode if gone else "STILL PRESENT",
                "ts": ts()})
    if not gone:
        failures.append(("delete_verify", iid, cid, gcode, "still present"))
        print(f"  NOT GONE: {iid} C{cid}", flush=True)
    if (i + 1) % 10 == 0:
        print(f"  {i+1}/{len(ops['deletes'])} deleted", flush=True)
    time.sleep(0.2)

# ============ POST: R359 + group case count ============
code, body = api("GET", "get_run/359")
r359 = json.loads(body) if code == "200" else {}
r359_total = sum(r359.get(k, 0) or 0 for k in
                 ("passed_count", "blocked_count", "untested_count", "retest_count",
                  "failed_count", "custom_status1_count", "custom_status2_count",
                  "custom_status3_count", "custom_status4_count", "custom_status5_count",
                  "custom_status6_count", "custom_status7_count"))
print("R359 post-push test count:", r359_total, "| untested", r359.get("untested_count"))

json.dump({"log": log, "failures": failures, "new_cid": new_cid,
           "r359_post_total": r359_total, "r359_post": r359},
          open("/tmp/rs-push/exec_result.json", "w"), indent=1)
print("\nSUMMARY: updates", len(ops["updates"]), "| add new C-id:", new_cid,
      "| deletes", len(ops["deletes"]), "| FAILURES:", len(failures))
for f in failures:
    print("  FAILURE:", f)
