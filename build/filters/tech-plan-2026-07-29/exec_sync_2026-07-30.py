#!/usr/bin/env python3
"""Execute the AUTHORIZED Filters tech-plan TestRail push (2026-07-30).

Per build/filters/tech-plan-2026-07-29/ChangeList.md §E (user authorization
"Push all three", 2026-07-30):
  - add_section x1 (if missing): "Page Search Toolbar" (parent = group 4110)
    — explicitly named in §E for FLT-PSRCH-01..07.
  - add_case x15  : FLT-TAB-06, FLT-STAT-07, FLT-ASSET-07, FLT-URL-05,
                    FLT-PERS-05, FLT-PERS-06, FLT-RPTS-23, FLT-PSRCH-01..07,
                    FLT-API-06 (custom_atmstatus:3 + custom_automation_type:0).
  - update_case x1: FLT-PERS-02 = C29614 (steps 6 / expected 3 / cross-device).
  - NOTHING else: 0 deletes, 0 run writes, only group 4110 touched.

Section placement:
  - FLT-API-06 -> existing 4124 "API — Work Orders List Filtering".
  - FLT-PSRCH-01..07 -> the new "Page Search Toolbar" section.
  - FLT-RPTS-23 -> authored area "Reports Page Filters" does NOT exist live and
    a second add_section was NOT authorized; placed in the most fitting existing
    section 4117 "Active Filter Chips and Clear Filters" (it is a chip-behaviour
    case); to be MOVED to "Reports Page Filters" when the pending 43-case
    Parts/Reports queue is authorized (documented in the execution log).

Field mapping mirrors build/filters/gen_import.py (clean()/joinlines; References
= spec_ref) and the established Filters push (branko-answers-2026-07-17 audit
log). Pre-flight gates per the authorization: add-case titles <=80 chars, no
angle brackets in any pushed field, refs present and <=250 chars.
Stops on ANY non-200 / any re-GET MISMATCH. Never writes a run.
"""
import csv, json, glob, os, re, subprocess, sys, time
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))          # build/filters/tech-plan-2026-07-29
PROJ = os.path.dirname(HERE)                               # build/filters
BASE_URL = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ.get("TESTRAIL_USER")
KEY = os.environ.get("TESTRAIL_KEY")
if not USER or not KEY:
    sys.exit("Set TESTRAIL_USER / TESTRAIL_KEY in env (never in files).")

GROUP_ID = 4110
TYPE_ID = {"Functional": 6, "Negative": 5, "Accessibility": 2}
PRIO_ID = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}

# ChangeList §A order.
ADDS = ["FLT-TAB-06", "FLT-STAT-07", "FLT-ASSET-07", "FLT-URL-05",
        "FLT-PERS-05", "FLT-PERS-06", "FLT-RPTS-23",
        "FLT-PSRCH-01", "FLT-PSRCH-02", "FLT-PSRCH-03", "FLT-PSRCH-04",
        "FLT-PSRCH-05", "FLT-PSRCH-06", "FLT-PSRCH-07", "FLT-API-06"]

UPDATES = {"FLT-PERS-02": "29614"}

NEW_SECTION = "Page Search Toolbar"

# authored-area -> live section id (existing tree read 2026-07-30)
SECTION_MAP = {
    "Status Filter": 4112,
    "Asset on Site Filter": 4116,
    "Active Filter Chips and Clear Filters": 4117,
    "Tab Behaviour": 4120,
    "Persistence": 4121,
    "URL State and Shareable Links": 4122,
    "API - Work Orders List Filtering": 4124,   # authored hyphen == live em-dash
}
# FLT-RPTS-23: authored "Reports Page Filters" (not live) -> 4117, noted.
AREA_OVERRIDE = {"FLT-RPTS-23": ("Reports Page Filters", 4117)}


def api(method, endpoint, payload=None):
    url = BASE_URL + endpoint
    for attempt in range(5):
        cmd = ["curl", "-sS", "--cacert", CA, "-u", f"{USER}:{KEY}",
               "-H", "Content-Type: application/json", "-w", "\n%{http_code}", url]
        if method == "POST":
            cmd[1:1] = ["-X", "POST", "--data-binary", json.dumps(payload)]
        out = subprocess.run(cmd, capture_output=True, text=True)
        body, _, code = out.stdout.rpartition("\n")
        code = code.strip()
        if code in ("429", "000") or code.startswith("5"):
            wait = 2 ** attempt
            print(f"  HTTP {code} on {endpoint} - retry in {wait}s", flush=True)
            time.sleep(wait)
            continue
        if code != "200":
            raise RuntimeError(f"HTTP {code} on {method} {endpoint}: {body[:400]}")
        return json.loads(body) if body.strip() else {}
    raise RuntimeError(f"Retries exhausted on {method} {endpoint}")


# --- clean()/joinlines mirror build/filters/gen_import.py ---------------------
def clean(s):
    if not s:
        return s
    s = re.sub(r"\s*\(see (?:FLT|GS|SF|FD)-[A-Z0-9-]+\)", "", s)
    s = re.sub(r"feature[ -]flags?", "Filters feature", s, flags=re.I)
    return s


def joinlines(lst):
    return "\n".join(clean(x.rstrip()) for x in (lst or []))


def norm_refs(s):
    return re.sub(r",\s*", ",", (s or "").strip())


cases = {}
for f in glob.glob(os.path.join(PROJ, "cases", "cases-*.json")):
    for c in json.load(open(f)):
        cases[c["id"]] = c


def desired_body(c):
    return {
        "title": clean(c["title"].strip()),
        "custom_preconds": joinlines(c.get("preconditions", [])),
        "custom_steps": joinlines(c.get("steps", [])),
        "custom_expected": joinlines(c.get("expected", [])),
        "refs": clean((c.get("spec_ref") or "").strip()),
    }


# ============ PRE-FLIGHT (all 16 payloads, gate before ANY write) ============
print("===== PRE-FLIGHT =====", flush=True)
problems = []
for sid in ADDS + list(UPDATES):
    c = cases[sid]
    want = desired_body(c)
    if sid in ADDS and len(want["title"]) > 80:
        problems.append(f"{sid}: title {len(want['title'])} chars > 80")
    if not want["refs"]:
        problems.append(f"{sid}: refs MISSING")
    if len(want["refs"]) > 250:
        problems.append(f"{sid}: refs {len(want['refs'])} chars > 250")
    for fld in ("title", "custom_preconds", "custom_steps", "custom_expected", "refs"):
        if "<" in want[fld] or ">" in want[fld]:
            problems.append(f"{sid}: angle bracket in {fld}")
    print(f"  {sid}: title={len(want['title'])} refs={len(want['refs'])} OK", flush=True)
if problems:
    sys.exit("PRE-FLIGHT FAILED:\n" + "\n".join(problems))
print("PRE-FLIGHT CLEAN (16/16).", flush=True)

log = []
ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
new_cids = {}

# ============ PHASE 0: section ==============================================
print("\n===== PHASE 0: section =====", flush=True)
name2id = dict()
secs = []
off = 0
while True:
    page = api("GET", f"get_sections/1&suite_id=1&limit=250&offset={off}")
    lst = page["sections"] if isinstance(page, dict) and "sections" in page else page
    secs += lst
    if len(lst) < 250:
        break
    off += 250
for s in secs:
    if s.get("parent_id") == GROUP_ID:
        name2id[s["name"]] = s["id"]
if NEW_SECTION in name2id:
    psid = name2id[NEW_SECTION]
    print(f"  section EXISTS: {NEW_SECTION!r} = {psid}", flush=True)
    log.append({"op": "add_section", "name": NEW_SECTION, "id": psid,
                "status": "already-existed", "ts": ts()})
else:
    res = api("POST", "add_section/1",
              {"suite_id": 1, "parent_id": GROUP_ID, "name": NEW_SECTION})
    psid = res["id"]
    print(f"  section CREATED: {NEW_SECTION!r} = {psid}", flush=True)
    log.append({"op": "add_section", "name": NEW_SECTION, "id": psid,
                "status": "created", "ts": ts()})
SECTION_MAP["Page Search Toolbar"] = psid

# ============ PHASE 1: add_case x15 =========================================
print("\n===== PHASE 1: add_case x15 =====", flush=True)
for sid in ADDS:
    c = cases[sid]
    if sid in AREA_OVERRIDE:
        authored_area, section_id = AREA_OVERRIDE[sid]
        placed_note = f"authored area {authored_area!r} not live; placed in 4117"
    else:
        area = c["area"].strip()
        section_id = SECTION_MAP.get(area)
        placed_note = ""
    if not section_id:
        raise RuntimeError(f"No live section for {sid} area {c['area']!r}")
    want = desired_body(c)
    payload = dict(want)
    payload.update({
        "type_id": TYPE_ID[c["type"].strip()],
        "priority_id": PRIO_ID[c["priority"].strip()],
        "template_id": 1,
        "custom_atmstatus": 3,
        "custom_automation_type": 0,
    })
    res = api("POST", f"add_case/{section_id}", payload)
    cid = res["id"]
    new_cids[sid] = cid
    after = api("GET", f"get_case/{cid}")
    detail = {
        "title": (after.get("title") or "") == want["title"],
        "preconds": (after.get("custom_preconds") or "") == want["custom_preconds"],
        "steps": (after.get("custom_steps") or "") == want["custom_steps"],
        "expected": (after.get("custom_expected") or "") == want["custom_expected"],
        "refs": norm_refs(after.get("refs")) == norm_refs(want["refs"]),
        "section": after.get("section_id") == section_id,
        "atm": after.get("custom_atmstatus") == 3 and after.get("custom_automation_type") == 0,
    }
    match = all(detail.values())
    print(f"  {sid}: C{cid} in section {section_id}. MATCH={match} {placed_note}", flush=True)
    log.append({"op": "add_case", "internal": sid, "cid": cid,
                "section_id": section_id, "placed_note": placed_note,
                "match": match, "detail": detail, "ts": ts()})
    if not match:
        raise RuntimeError(f"add_case verify MISMATCH on {sid} C{cid}: {detail}")

# ============ PHASE 2: update_case x1 (C29614) ==============================
print("\n===== PHASE 2: update_case x1 =====", flush=True)
for sid, cid in UPDATES.items():
    c = cases[sid]
    want = desired_body(c)
    api("POST", f"update_case/{cid}", want)
    after = api("GET", f"get_case/{cid}")
    detail = {
        "title": (after.get("title") or "") == want["title"],
        "preconds": (after.get("custom_preconds") or "") == want["custom_preconds"],
        "steps": (after.get("custom_steps") or "") == want["custom_steps"],
        "expected": (after.get("custom_expected") or "") == want["custom_expected"],
        "refs": norm_refs(after.get("refs")) == norm_refs(want["refs"]),
    }
    match = all(detail.values())
    print(f"  {sid}: update_case C{cid}. MATCH={match}", flush=True)
    log.append({"op": "update_case", "internal": sid, "cid": int(cid),
                "match": match, "detail": detail, "ts": ts()})
    if not match:
        raise RuntimeError(f"update_case verify MISMATCH on {sid} C{cid}: {detail}")

with open(os.path.join(HERE, "exec-log-2026-07-30.json"), "w") as fh:
    json.dump({"new_cids": new_cids, "log": log}, fh, indent=1)
print("\nDONE. New C-ids:", json.dumps(new_cids, indent=1), flush=True)
