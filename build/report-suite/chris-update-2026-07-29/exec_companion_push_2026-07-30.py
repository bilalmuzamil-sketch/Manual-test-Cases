#!/usr/bin/env python3
"""AUTHORIZED companion-video push, 2026-07-30 (user authorization 2026-07-30: "do update
the test cases if you learn that the video is warranting for that").

Scope EXACTLY per ChangeList-companion-2026-07-30.md §A: 7 update_case. NOTHING else —
no adds, no deletes, no section writes, no run writes (R359 untouched).

Conventions mirrored from exec_chris_push_2026-07-29.py:
  - pre-op live snapshot (get_case) of every target into pre-push-snapshot/
  - update_case then re-GET verify title/preconds/steps/expected/refs
  - transient 429/5xx/000 retried with exponential backoff
  - post-push live count of cases under group 4281 (must equal 465)
"""
import json, glob, os, re, subprocess, time
from datetime import datetime, timezone

BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ["TESTRAIL_USER"]; KEY = os.environ["TESTRAIL_KEY"]
RS = "build/report-suite"
HERE = os.path.join(RS, "chris-update-2026-07-29")
SNAP = os.path.join(HERE, "pre-push-snapshot")
GROUP = 4281

UPDATES = [
    ("SBC-NAV-01", "30096"), ("TU-NAV-01", "30392"), ("SBR-NAV-01", "30195"),
    ("WIP-TAB-01", "30451"), ("PV-NAV-01", "30322"), ("SBR-WO-06", "30315"),
    ("SBR-WO-02", "30311"),
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

# Condensed refs (<=250 chars) where the local spec_ref exceeds the TestRail refs cap.
VIDS = "PRD companion video 2026-07-30 [newest-wins]"
REFS_OVERRIDE = {
 "SBC-NAV-01": ("SV-8600 (specs/sbc-sales-by-customer.md Story 1 S1-R1; S1-R3; S1-R4 — "
   "Performance group + below-the-anchors placement per " + VIDS + " 01:18-02:05; the SBC "
   "spec names no nav group)"),
 "TU-NAV-01": ("SV-8648 (specs/technician-utilization.md S1-R1 — below the named anchor "
   "items per " + VIDS + " 01:18-02:05, refining kickoff video P3)"),
 "SBR-NAV-01": ("SV-8619 (specs/sbr-sales-by-representative.md Story 1 S1-R1..R6 — 'at the "
   "bottom' re-based to below-the-named-anchors per " + VIDS + " 01:18-02:05; order among "
   "the four new reports not important)"),
 "WIP-TAB-01": ("SV-8657 (specs/wip-work-in-progress.md Story 1 S1-R1 — Performance group; "
   "below the named anchor items per " + VIDS + " 01:18-02:05)"),
 "PV-NAV-01": ("SV-8641 (specs/parts-velocity.md S1-R1 — 'only report' superseded: PV and "
   "Inventory Value BOTH under Parts per " + VIDS + " 00:35-01:18; PV-vs-IV S1-R1 "
   "inconsistency flagged)"),
 "SBR-WO-06": ("SV-8636 (specs/sbr-sales-by-representative.md Story 19 S19-R7; S19-E1 — "
   "customer-card row label RE-RULED to the full 'Sales Representative' per " + VIDS +
   " 10:53-11:12, superseding the spec's 'Sales Rep')"),
 "SBR-WO-02": ("SV-8636 (specs/sbr-sales-by-representative.md Story 19 S19-R2; S19-R8 — "
   "toggle entry path Settings - Staff - edit the staff member per " + VIDS +
   " 09:17-09:41; exact toggle label to confirm live)"),
}

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

cases = {}
for f in glob.glob(os.path.join(RS, "cases", "cases-*.json")):
    for c in json.load(open(f)):
        cases[c["id"]] = c

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

payloads = {iid: desired_body(cases[iid]) for iid, _ in UPDATES}
for iid, want in payloads.items():
    assert len(want["title"]) <= 80, f"{iid}: title {len(want['title'])} chars"
    assert len(want["refs"]) <= 250, f"{iid}: refs {len(want['refs'])} chars > cap"
    assert want["refs"], f"{iid}: empty refs"
print(f"pre-flight OK: {len(payloads)} payloads (titles <=80, refs <=250, refs present)", flush=True)

ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
log, failures = [], []

print("===== PHASE 0: pre-push snapshots x%d =====" % len(UPDATES), flush=True)
for iid, cid in UPDATES:
    code, body = api("GET", f"get_case/{cid}")
    if code != "200":
        raise SystemExit(f"SNAPSHOT FAILED {iid} C{cid}: HTTP {code} - NOT proceeding")
    pre = json.loads(body)
    with open(os.path.join(SNAP, f"C{cid}_{iid}.pre-companion-push-2026-07-30.json"), "w") as fh:
        fh.write(json.dumps(pre, indent=2, ensure_ascii=False) + "\n")
print("all %d snapshots saved" % len(UPDATES), flush=True)

print("===== PHASE 1: update_case x%d =====" % len(UPDATES), flush=True)
for i, (iid, cid) in enumerate(UPDATES):
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
    else:
        print(f"  {i+1}/7 {iid} C{cid}: 200 + re-GET MATCH", flush=True)
    time.sleep(0.2)

print("===== POST: live count under group %d =====" % GROUP, flush=True)
sections, offset = [], 0
while True:
    code, body = api("GET", f"get_sections/1&suite_id=1&limit=250&offset={offset}")
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
target_secs = [s["id"] for s in sections if under_group(s["id"])]
count = 0
for sid in target_secs:
    off = 0
    while True:
        code, body = api("GET", f"get_cases/1&suite_id=1&section_id={sid}&limit=250&offset={off}")
        chunk = json.loads(body).get("cases", [])
        count += len(chunk)
        if len(chunk) < 250: break
        off += 250
print(f"live cases under group {GROUP}: {count} (expected 465)", flush=True)

result = {"executed": ts(), "updates": log, "failures": failures,
          "live_count_group_4281": count}
with open(os.path.join(HERE, "testrail-execution-result-companion-2026-07-30.json"), "w") as fh:
    json.dump(result, fh, indent=2, ensure_ascii=False); fh.write("\n")
print("FAILURES:", failures if failures else "NONE", flush=True)
