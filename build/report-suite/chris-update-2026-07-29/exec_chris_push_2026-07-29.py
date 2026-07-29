#!/usr/bin/env python3
"""AUTHORIZED Chris-update push, 2026-07-29 (explicit user authorization 2026-07-29).

Scope EXACTLY per ChangeList-2026-07-29.md "Push queue": 24 update_case + 1 add_case
(TU-COL-01). NOTHING else — no deletes, no section writes, no run writes.

Conventions mirrored from exec_push_2026-07-28.py / exec_authorized_fixes_2026-07-29.py:
  - pre-op live snapshot (get_case) of every update target into pre-push-snapshot/
  - update_case then re-GET byte-verify title/preconds/steps/expected/refs
  - add_case with type_id/priority_id/template_id=1 + custom_atmstatus:3 +
    custom_automation_type:0, re-GET verify incl. section + atm fields
  - transient 429/5xx/000 retried with exponential backoff; persistent failures
    recorded + skipped, the rest continue
  - REFS cap convention (2026-07-28, SBC-EXP-01/SBR-LOC-03): refs longer than the
    TestRail 250-char cap are CONDENSED at push (ticket + spec anchor + driving
    source kept); the full text stays in the local spec_ref / import References.
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
TYPE_ID = {"Functional": 6, "Negative": 5, "Accessibility": 2}
PRIO_ID = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}
TU_VIS_SIBLING = "30447"   # TU-VIS-01 — same leaf section as TU-COL-01

UPDATES = [  # (internal id, C-id) — exactly the change-list push queue, TU-DAY-01 last
    ("SBC-LBL-01", "30134"), ("SBC-LBL-04", "30137"), ("SBC-EXP-01", "30159"),
    ("SBC-EXP-16", "38856"), ("SBC-EXP-03", "30161"), ("SBC-EXP-11", "30169"),
    ("SBC-EXP-09", "30167"), ("SBR-EXP-02", "30277"), ("PV-EXP-02", "30376"),
    ("TU-EXP-04", "30437"), ("IV-EXP-02", "30588"), ("WIP-EXP-02", "30511"),
    ("SBC-LOC-03", "30111"), ("SBR-LOC-03", "30215"), ("PV-FILT-10", "30337"),
    ("TU-LOC-02", "30443"), ("IV-LOC-02", "30575"), ("WIP-FLT-06", "30503"),
    ("PV-FILT-01", "30328"), ("PV-FILT-09", "30336"), ("PV-ROW-05", "30345"),
    ("PV-EXP-08", "30382"), ("PV-EXP-05", "30379"), ("TU-DAY-01", "30418"),
]
NEW_ID = "TU-COL-01"

# Condensed refs (<=250 chars) for the cases whose full spec_ref exceeds the TestRail
# refs cap. Full text remains in the local spec_ref (source of record) + import.
MSG = "Chris Ward msg 2026-07-29 [last-update-wins]"
REFS_OVERRIDE = {
 "SBC-LBL-01": ("SV-8606 (specs/sbc-sales-by-customer.md Story 8 S8-R7..R10 — identifier "
   "RE-RULED to VIN, then Unit #, then plate, per " + MSG + ", superseding video P24 serial "
   "+ the spec's year/make/model rule)"),
 "SBC-EXP-01": ("SV-8612; SV-8613 (specs/sbc-sales-by-customer.md S14-R1; S14-R2; S15-R1; "
   "S15-R2; S20-R16 — four Summary/Expanded menu items per " + MSG + ", ratifies video P21; "
   "Print REMOVED per video P25 31:14, confirmed)"),
 "SBC-EXP-16": ("SV-8612; SV-8613 (specs/sbc-sales-by-customer.md Stories 14/15 — "
   "Summary/Expanded split, both PDF+CSV, per " + MSG + ", ratifying video P21; overrides "
   "the old single-flat-export S14-R6; S14-R10; S15-R16)"),
 "SBC-EXP-03": ("SV-8612 (specs/sbc-sales-by-customer.md Story 14 S14-R6..R9 — Expanded View "
   "CSV, Customer/Asset/Invoice breakdown + Locations: line, per " + MSG + "; old S14-R10 "
   "flat/no-asset-layer rule superseded)"),
 "SBC-EXP-11": ("SV-8613 (specs/sbc-sales-by-customer.md Story 15 S15-R16..R21 — body now "
   "the Expanded View with Customer/Asset/Invoice breakdown per " + MSG + "; old "
   "flat/no-asset-layer shape superseded)"),
 "SBC-EXP-09": ("SV-8613 (specs/sbc-sales-by-customer.md Story 15 S15-R7..R11 — 'location "
   "not shown in header' REVERSED by the Locations: line in every export per " + MSG + ")"),
 "SBR-EXP-02": ("SV-8631 (specs/sbr-sales-by-representative.md Story 14 S14-R2; S14-R2a; "
   "Story 21 S21-R6; Story 22 S22-R4 + Locations: line in every CSV/PDF export per "
   + MSG + ")"),
 "SBC-LOC-03": ("SV-8603 (specs/sbc-sales-by-customer.md Story 4 S4-R5; S4-R6 — per-row "
   "location identifier per kickoff video P10, ruling 2026-07-28 video-overrides-spec + "
   "on-screen scope indicator per " + MSG + ")"),
 "SBR-LOC-03": ("SV-8638 (specs/sbr-sales-by-representative.md Story 21 S21-R3; S21-R4; "
   "S21-R5; §3 — per-row location identifier per video P10, ruling 2026-07-28 "
   "video-overrides-spec + on-screen scope indicator per " + MSG + ")"),
 "PV-FILT-10": ("SV-8642 (specs/parts-velocity.md S2-R9 — per-row location identifier per "
   "kickoff video P10, ruling 2026-07-28 video-overrides-spec + on-screen scope indicator "
   "per " + MSG + ")"),
 "PV-FILT-01": ("SV-8642 (specs/parts-velocity.md S2-R1; S3-R5 — 'Catalogue' RENAMED to the "
   "exact label 'Special Order' [Type filter, column, export] per " + MSG + ", confirming "
   "kickoff video P31)"),
 "PV-FILT-09": ("SV-8642 (specs/parts-velocity.md S2-R8 — 'Catalogue' RENAMED to the exact "
   "label 'Special Order' per " + MSG + ", confirming kickoff video P31)"),
 "PV-ROW-05": ("SV-8643 (specs/parts-velocity.md S3-R4; S3-R5; S3-R8 — Type value "
   "'Catalogue' RENAMED to the exact label 'Special Order' per " + MSG + ", confirming "
   "kickoff video P31)"),
 "TU-COL-01": ("SV-8655 (specs/technician-utilization.md Story 8 Visual Conformance and "
   "Accessibility — column selector ADDED per " + MSG + "; no spec anchor yet — confirm "
   "from the updated spec changelog)"),
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

# ---- load local case bodies
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

# ---- PRE-FLIGHT gates (before ANY write): payloads sane, refs <= cap, titles <= 80
payloads = {}
for iid, _ in UPDATES:
    payloads[iid] = desired_body(cases[iid])
payloads[NEW_ID] = desired_body(cases[NEW_ID])
for iid, want in payloads.items():
    assert len(want["title"]) <= 80, f"{iid}: title {len(want['title'])} chars"
    assert len(want["refs"]) <= 250, f"{iid}: refs {len(want['refs'])} chars > cap"
    assert want["refs"], f"{iid}: empty refs"
    assert "<" not in json.dumps(want), f"{iid}: angle bracket in payload"
print(f"pre-flight OK: {len(payloads)} payloads (titles <=80, refs <=250, refs present, "
      f"no angle brackets)", flush=True)

ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
log, failures = [], []

# ---- PHASE 0: pre-push snapshots of all 24 update targets (abort if any fails)
print("===== PHASE 0: pre-push snapshots x%d =====" % len(UPDATES), flush=True)
for iid, cid in UPDATES:
    code, body = api("GET", f"get_case/{cid}")
    if code != "200":
        raise SystemExit(f"SNAPSHOT FAILED {iid} C{cid}: HTTP {code} - NOT proceeding")
    pre = json.loads(body)
    with open(os.path.join(SNAP, f"C{cid}_{iid}.pre-chris-push-2026-07-29.json"), "w") as fh:
        fh.write(json.dumps(pre, indent=2, ensure_ascii=False) + "\n")
print("all 24 snapshots saved", flush=True)

# ---- resolve TU — Visual & Accessibility section id from the sibling TU-VIS-01
code, body = api("GET", f"get_case/{TU_VIS_SIBLING}")
if code != "200":
    raise SystemExit(f"section resolve failed: get_case/{TU_VIS_SIBLING} HTTP {code}")
tu_vis_section = json.loads(body)["section_id"]
code, body = api("GET", f"get_section/{tu_vis_section}")
sec = json.loads(body) if code == "200" else {}
print(f"TU-COL-01 target section = {tu_vis_section} ({sec.get('name')!r})", flush=True)
assert "Visual" in (sec.get("name") or ""), "section name sanity check failed"

# ---- PHASE 1: 24 update_case
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
        print(f"  {i+1:2}/24 {iid} C{cid}: 200 + re-GET MATCH", flush=True)
    time.sleep(0.2)

# ---- PHASE 2: add_case TU-COL-01
print("===== PHASE 2: add_case TU-COL-01 =====", flush=True)
c = cases[NEW_ID]
want = payloads[NEW_ID]
payload = dict(want)
payload.update({"type_id": TYPE_ID[c["type"].strip()],
                "priority_id": PRIO_ID[c["priority"].strip()],
                "template_id": 1,
                "custom_atmstatus": 3, "custom_automation_type": 0})
new_cid = None
code, body = api("POST", f"add_case/{tu_vis_section}", payload)
if code != "200":
    failures.append(("add_case", NEW_ID, "-", code, body[:300]))
    log.append({"op": "add_case", "id": NEW_ID, "http": code, "ts": ts(), "err": body[:300]})
    print(f"  FAIL add_case: HTTP {code} {body[:200]}", flush=True)
else:
    new_cid = json.loads(body)["id"]
    gcode, gbody = api("GET", f"get_case/{new_cid}")
    after = json.loads(gbody) if gcode == "200" else {}
    checks = {
        "title": (after.get("title") or "") == want["title"],
        "preconds": (after.get("custom_preconds") or "") == want["custom_preconds"],
        "steps": (after.get("custom_steps") or "") == want["custom_steps"],
        "expected": (after.get("custom_expected") or "") == want["custom_expected"],
        "refs": norm_refs(after.get("refs")) == norm_refs(want["refs"]),
        "section": after.get("section_id") == tu_vis_section,
        "atm": after.get("custom_atmstatus") == 3 and after.get("custom_automation_type") == 0,
    }
    match = all(checks.values())
    log.append({"op": "add_case", "id": NEW_ID, "cid": str(new_cid), "http": code,
                "verify": "MATCH" if match else "MISMATCH", "detail": checks, "ts": ts()})
    print(f"  TU-COL-01 created: C{new_cid} MATCH={match}", flush=True)
    if not match:
        failures.append(("add_verify", NEW_ID, str(new_cid), "200", str(checks)))

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

json.dump({"log": log, "failures": failures, "new_cid": new_cid,
           "tu_vis_section": tu_vis_section, "live_count_4281": count},
          open(os.path.join(HERE, "testrail-execution-result-2026-07-29.json"), "w"),
          indent=1)
print("\nSUMMARY: updates", len(UPDATES), "| add new C-id:", new_cid,
      "| live count:", count, "| FAILURES:", len(failures))
for f in failures:
    print("  FAILURE:", f)
