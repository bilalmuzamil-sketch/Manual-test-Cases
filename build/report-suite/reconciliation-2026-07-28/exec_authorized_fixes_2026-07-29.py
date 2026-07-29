#!/usr/bin/env python3
"""AUTHORIZED FIXES 2026-07-29 (explicit user authorization 2026-07-29).

EXACTLY 3 update_case ops, nothing else, never any run write:
  - TU-DAY-01  C30418  repair the import angle-bracket artifact ("Expand 's daily
    breakdown" -- the <technician> placeholder was swallowed as an HTML tag at the
    2026-07-22 CSV import); wording rewritten plain, no angle brackets.
  - PV-API-02  C30389  title 100 chars -> 71 (concise-title rule, <=80).
  - PV-FILT-09 C30336  title 96 chars -> 77 (concise-title rule, <=80).

Each op: pre-op live snapshot (get_case) into testrail-pre-push-snapshot-2026-07-28/
(completion-pass convention), then update_case, then re-GET byte-verify.
Field mapping identical to exec_push_2026-07-28.py / exec_completion_2026-07-28.py.
"""
import json, os, re, subprocess, time
from datetime import datetime, timezone

BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ["TESTRAIL_USER"]; KEY = os.environ["TESTRAIL_KEY"]
RS = "build/report-suite"
SNAP = os.path.join(RS, "testrail-pre-push-snapshot-2026-07-28")

TARGETS = [
    ("TU-DAY-01", "30418", "cases/cases-tu-B-sort-summary-day-filter.json"),
    ("PV-API-02", "30389", "cases/cases-pv-D-exports-visual-api.json"),
    ("PV-FILT-09", "30336", "cases/cases-pv-A-access-permissions-filters.json"),
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

ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
log, failures = [], []

for iid, cid, src in TARGETS:
    c = {x["id"]: x for x in json.load(open(os.path.join(RS, src)))}[iid]
    want = desired_body(c)
    assert "<" not in json.dumps(want), f"{iid}: angle bracket in payload!"
    # Title-length gate only for the two authorized title trims. TU-DAY-01's own
    # 87-char title is NOT in the authorization scope - pushed UNCHANGED and
    # reported as a follow-up trim candidate.
    if iid in ("PV-API-02", "PV-FILT-09"):
        assert len(want["title"]) <= 80, f"{iid}: title {len(want['title'])} chars"

    # pre-op live snapshot
    code, body = api("GET", f"get_case/{cid}")
    if code != "200":
        raise SystemExit(f"SNAPSHOT FAILED {iid} C{cid}: HTTP {code} - not proceeding")
    pre = json.loads(body)
    with open(os.path.join(SNAP, f"C{cid}_{iid}.pre-authorized-fix-2026-07-29.json"), "w") as fh:
        fh.write(json.dumps(pre, indent=2, ensure_ascii=False) + "\n")
    print(f"snapshotted {iid} C{cid} (pre-op title: {pre.get('title','')[:90]!r})", flush=True)

    code, body = api("POST", f"update_case/{cid}", want)
    if code != "200":
        failures.append((iid, cid, code, body[:300]))
        print(f"FAIL update {iid} C{cid}: HTTP {code} {body[:200]}", flush=True)
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
                "verify": "MATCH" if match else "MISMATCH", "detail": checks,
                "new_title": want["title"], "ts": ts()})
    print(f"{iid} C{cid}: update HTTP {code}, re-GET "
          f"{'MATCH' if match else 'MISMATCH ' + str(checks)}", flush=True)
    if not match:
        failures.append((iid, cid, "verify", str(checks)))
    time.sleep(0.2)

with open(os.path.join(RS, "reconciliation-2026-07-28",
                       "testrail-execution-result-authorized-fixes-2026-07-29.json"), "w") as fh:
    json.dump({"log": log, "failures": failures}, fh, indent=2, ensure_ascii=False)
print("FAILURES:", failures if failures else "none")
