#!/usr/bin/env python3
"""COMPLETION PASS for the authorized 2026-07-28 "Push ALL" (executed 2026-07-29).

The post-push verification (POST-PUSH-VERIFICATION-2026-07-28.md, check 4 / ISSUE-1)
found the push manifest omitted 2 cases that WERE in the user-approved bundle
("29 updates incl. the 2 Esc edits"): SBR-DEACT-04 (C30255) + SBR-DEACT-05 (C30256),
the Chris Q1=B Esc edits. This executor performs ONLY those 2 update_case ops
(title/custom_preconds/custom_steps/custom_expected/refs), each pre-snapshotted and
re-GET byte-verified. NOTHING ELSE (TU-DAY-01/C30418 + the 2 overlong titles stay
untouched — NOT authorized). NEVER writes to any run.
"""
import json, os, re, subprocess, time
from datetime import datetime, timezone

BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ["TESTRAIL_USER"]; KEY = os.environ["TESTRAIL_KEY"]
RS = "build/report-suite"
SNAP = os.path.join(RS, "testrail-pre-push-snapshot-2026-07-28")

TARGETS = [("SBR-DEACT-04", "30255"), ("SBR-DEACT-05", "30256")]
SRC = os.path.join(RS, "cases",
                   "cases-sbr-C-links-deactivation-unassigned-columns-persistence.json")

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
            time.sleep(wait); continue
        return code, body
    return "000", "retries exhausted"

def desired_body(c):
    return {
        "title": clean(c["title"].strip()),
        "custom_preconds": joinlines(c.get("preconditions", [])),
        "custom_steps": joinlines(c.get("steps", [])),
        "custom_expected": joinlines(c.get("expected", [])),
        "refs": clean((c.get("spec_ref") or "").strip()),
    }

cases = {c["id"]: c for c in json.load(open(SRC))}
ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
log, failures = [], []

# ---- PHASE 0: pre-push snapshot of the 2 (same file convention; completion pass)
print("===== PHASE 0: pre-push snapshot (completion pass) =====", flush=True)
for iid, cid in TARGETS:
    code, body = api("GET", f"get_case/{cid}")
    if code != "200":
        raise SystemExit(f"SNAPSHOT FAILED {iid} C{cid}: HTTP {code} — do not proceed")
    with open(os.path.join(SNAP, f"C{cid}_{iid}.json"), "w") as fh:
        fh.write(json.dumps(json.loads(body), indent=2, ensure_ascii=False) + "\n")
    print(f"  snapshotted {iid} C{cid}", flush=True)
    time.sleep(0.15)
with open(os.path.join(SNAP, "COMPLETION-PASS-NOTE.md"), "w") as fh:
    fh.write("# Completion pass note (2026-07-29)\n\n"
             "C30255_SBR-DEACT-04.json and C30256_SBR-DEACT-05.json were snapshotted in the\n"
             "**completion pass** (2026-07-29), not the original 2026-07-28 snapshot run: the\n"
             "original push manifest omitted these 2 user-approved Chris-Q1 Esc cases\n"
             "(POST-PUSH-VERIFICATION-2026-07-28.md ISSUE-1). Bodies here = live state\n"
             "immediately BEFORE the completion update_case ops.\n")

# ---- PHASE 1: update_case x2 + re-GET byte-verify
print("===== PHASE 1: update_case x2 =====", flush=True)
for iid, cid in TARGETS:
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
    print(f"  {iid} C{cid}: HTTP {code} re-GET {'MATCH' if match else 'MISMATCH ' + str(checks)}",
          flush=True)
    if not match:
        failures.append(("update_verify", iid, cid, "200", str(checks)))
    time.sleep(0.2)

# ---- POST: R359 untouched check
code, body = api("GET", "get_run/359")
r359 = json.loads(body) if code == "200" else {}
r359_total = sum(r359.get(k, 0) or 0 for k in
                 ("passed_count", "blocked_count", "untested_count", "retest_count",
                  "failed_count", "custom_status1_count", "custom_status2_count",
                  "custom_status3_count", "custom_status4_count", "custom_status5_count",
                  "custom_status6_count", "custom_status7_count"))
print("R359 post test count:", r359_total, "| untested", r359.get("untested_count"))

out = {"log": log, "failures": failures, "r359_post_total": r359_total}
json.dump(out, open(os.path.join(RS, "reconciliation-2026-07-28",
                                 "testrail-execution-result-completion-2026-07-29.json"), "w"),
          indent=1)
print("\nSUMMARY: updates 2 | FAILURES:", len(failures))
for f in failures:
    print("  FAILURE:", f)
