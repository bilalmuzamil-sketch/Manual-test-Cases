#!/usr/bin/env python3
"""AUTHORIZED wave-2 Chris-update push, 2026-07-29 (explicit user authorization "Push" 2026-07-29).

Scope EXACTLY per ChangeList-2026-07-29.md "Push queue — wave 2": 4 update_case
(WIP-COL-05 C30470, WIP-FLT-03 C30500, WIP-SORT-03 C30485, WIP-EXP-07 C30516).
NOTHING else — no adds, no deletes, no section writes, no run writes (R359 untouched).

Conventions mirrored 1:1 from exec_chris_push_2026-07-29.py (wave 1):
  - pre-flight gates BEFORE any write (titles <=80, refs <=250 + present, no angle brackets)
  - pre-op live snapshot (get_case) of every target into pre-push-snapshot/ (wave-2 suffix)
  - update_case then re-GET byte-verify title/preconds/steps/expected/refs
  - transient 429/5xx/000 retried with exponential backoff
  - REFS cap convention (2026-07-28): refs longer than the TestRail 250-char cap are
    CONDENSED at push (ticket + spec anchor + "Chris Ward answer A 2026-07-29" kept);
    the full text stays in the local spec_ref (source of record).
  - post-push live count of cases under group 4281 (must equal 460).
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

UPDATES = [  # (internal id, C-id) — exactly the wave-2 push queue
    ("WIP-COL-05", "30470"),
    ("WIP-FLT-03", "30500"),
    ("WIP-SORT-03", "30485"),
    ("WIP-EXP-07", "30516"),
]

# Condensed refs (<=250 chars) — full text remains in the local spec_ref (source of record).
REFS_OVERRIDE = {
 "WIP-COL-05": ("SV-8660 (specs/wip-work-in-progress.md S4-R7; S4-R8; S4-R10 — identifier "
   "RE-RULED to VIN, then Unit #, then plate, per Chris Ward answer A 2026-07-29 "
   "[last-update-wins], superseding video P24 serial + the spec's unit-number rule)"),
 "WIP-FLT-03": ("SV-8663 (specs/wip-work-in-progress.md S7-R4; S7-R5 — option text + "
   "type-ahead match fields RE-RULED to the VIN chain (VIN, then Unit #, then plate) per "
   "Chris Ward answer A 2026-07-29 [last-update-wins], superseding the video P24 serial "
   "ruling)"),
 "WIP-SORT-03": ("SV-8660 (specs/wip-work-in-progress.md S4-R27; S4-R9 — Asset sort key "
   "RE-RULED to the VIN chain (VIN, then Unit #, then plate) per Chris Ward answer A "
   "2026-07-29 [last-update-wins], superseding video P24 serial + 'sorts by unit number')"),
 "WIP-EXP-07": ("SV-8665 (specs/wip-work-in-progress.md S9-E1; §2 Known Limitations (v1) — "
   "asset identifier RE-RULED to the VIN chain per Chris Ward answer A 2026-07-29 "
   "[last-update-wins], superseding video P24 serial; export header text unpinned)"),
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

# ---- load local case bodies (source of truth)
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

# ---- PRE-FLIGHT gates (before ANY write)
payloads = {}
for iid, _ in UPDATES:
    payloads[iid] = desired_body(cases[iid])
for iid, want in payloads.items():
    assert len(want["title"]) <= 80, f"{iid}: title {len(want['title'])} chars"
    assert len(want["refs"]) <= 250, f"{iid}: refs {len(want['refs'])} chars > cap"
    assert want["refs"], f"{iid}: empty refs"
    assert "VIN" in want["custom_expected"], f"{iid}: VIN chain missing from expected"
    assert "<" not in json.dumps(want), f"{iid}: angle bracket in payload"
print(f"pre-flight OK: {len(payloads)} payloads (titles <=80, refs <=250 + present, "
      f"VIN chain present, no angle brackets)", flush=True)
for iid, want in payloads.items():
    print(f"  {iid}: title {len(want['title'])} chars, refs {len(want['refs'])} chars",
          flush=True)

ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
log, failures = [], []

# ---- PHASE 0: pre-push snapshots of all 4 update targets (abort if any fails)
print("===== PHASE 0: pre-push snapshots x%d (wave 2) =====" % len(UPDATES), flush=True)
for iid, cid in UPDATES:
    code, body = api("GET", f"get_case/{cid}")
    if code != "200":
        raise SystemExit(f"SNAPSHOT FAILED {iid} C{cid}: HTTP {code} - NOT proceeding")
    pre = json.loads(body)
    with open(os.path.join(SNAP, f"C{cid}_{iid}.pre-wave2-push-2026-07-29.json"), "w") as fh:
        fh.write(json.dumps(pre, indent=2, ensure_ascii=False) + "\n")
print("all 4 snapshots saved (wave-2 suffix)", flush=True)

# ---- PHASE 1: 4 update_case
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
        print(f"  {i+1}/4 {iid} C{cid}: 200 + re-GET MATCH", flush=True)
    time.sleep(0.2)

# ---- POST: live case count under group 4281 (expect 460)
print("===== POST: live count under group %d =====" % GROUP, flush=True)
sections, offset = [], 0
while True:
    code, body = api("GET", f"get_sections/1&suite_id=1&limit=250&offset={offset}")
    chunk = json.loads(body).get("sections", [])
    sections.extend(chunk)
    if len(chunk) < 250: break
    offset += 250
children = {s["id"]: s.get("parent_id") for s in sections}
def under_group(sid):
    seen = set()
    while sid is not None and sid not in seen:
        if sid == GROUP: return True
        seen.add(sid); sid = children.get(sid)
    return False
in_group = {sid for sid in children if under_group(sid)}
count, offset = 0, 0
while True:
    code, body = api("GET", f"get_cases/1&suite_id=1&limit=250&offset={offset}")
    chunk = json.loads(body).get("cases", [])
    count += sum(1 for x in chunk if x.get("section_id") in in_group)
    if len(chunk) < 250: break
    offset += 250
print(f"LIVE COUNT under group {GROUP}: {count} (expect 460)", flush=True)

json.dump({"log": log, "failures": failures, "live_count_4281": count},
          open(os.path.join(HERE, "testrail-execution-result-wave2-2026-07-29.json"), "w"),
          indent=1)
print("\nSUMMARY: updates", len(UPDATES), "| live count:", count,
      "| FAILURES:", len(failures))
for f in failures:
    print("  FAILURE:", f)
