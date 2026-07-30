#!/usr/bin/env python3
"""Execute the AUTHORIZED Schedule tech-plan TestRail push (2026-07-30).

Per build/schedule/tech-plan-2026-07-29/Schedule_TechPlan_ChangeList_2026-07-29.md
(user authorization "Push all three", 2026-07-30), EXACTLY:
  - add_section x2 under group 4254: "Cross-Module and Rewrite Regression",
    "API — Schedule" (Rule 4)
  - update_case x2 : SCH-WOL-05 (C29940), SCH-VIEW-03 (C30044) — tester-facing
    added-expected lines (pre-push get_case snapshots saved first)
  - add_case  x13 : SCH-SPREAD-11, SCH-DEL-10, SCH-EDGE-07/08, SCH-REG-01..05,
    SCH-API-01..04 (custom_atmstatus:3 + custom_automation_type:0)
Nothing else: no deletes, no run writes, no other sections/cases touched.
Ends with a live count of all cases under the group-4254 subtree (expect 190).

Field mapping mirrors build/schedule/gen_import.py + the established Schedule
executors (exec_sync_epic_2026-07-27.py). Stops on ANY non-200 / re-GET MISMATCH.
"""
import csv, json, glob, os, re, subprocess, sys, time
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))          # build/schedule
BASE_URL = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ.get("TESTRAIL_USER")
KEY = os.environ.get("TESTRAIL_KEY")
if not USER or not KEY:
    sys.exit("Set TESTRAIL_USER / TESTRAIL_KEY in env (never in files).")

GROUP_ID = 4254
TYPE_ID = {"Functional": 6, "Negative": 5, "Accessibility": 2}
PRIO_ID = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}

ADDS = ["SCH-SPREAD-11", "SCH-DEL-10", "SCH-EDGE-07", "SCH-EDGE-08",
        "SCH-REG-01", "SCH-REG-02", "SCH-REG-03", "SCH-REG-04", "SCH-REG-05",
        "SCH-API-01", "SCH-API-02", "SCH-API-03", "SCH-API-04"]
UPDATES = {"SCH-WOL-05": 29940, "SCH-VIEW-03": 30044}
NEW_SECTIONS = ["Cross-Module and Rewrite Regression", "API — Schedule"]

SNAP_DIR = os.path.join(HERE, "tech-plan-2026-07-29", "pre-push-snapshot")
os.makedirs(SNAP_DIR, exist_ok=True)


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


# --- clean() mirrors build/schedule/gen_import.py exactly ---------------------
def clean(s):
    if not s:
        return s
    s = re.sub(r"\s*\(see (?:SCH|FLT|GS|SF|FD)-[A-Z0-9-]+(?:'s setup)?\)", "", s)
    s = re.sub(r"\s*\(from (?:SCH|FLT|GS|SF|FD)-[A-Z0-9-]+'s setup\)", "", s)
    s = re.sub(r"\s*\(per (?:SCH|FLT|GS|SF|FD)-[A-Z0-9-]+\)", "", s)
    s = re.sub(r"[,;]?\s*SCH-[A-Z]+-\d+(\.\.\d+)?", "", s)
    s = re.sub(r"feature[ -]flags?", "Schedule feature", s, flags=re.I)
    return s


def joinlines(lst):
    return "\n".join(clean(x.rstrip()) for x in (lst or []))


def norm_refs(s):
    return re.sub(r",\s*", ",", (s or "").strip())


def desired_body(c):
    return {
        "title": clean(c["title"].strip()),
        "custom_preconds": joinlines(c.get("preconditions", [])),
        "custom_steps": joinlines(c.get("steps", [])),
        "custom_expected": joinlines(c.get("expected", [])),
        "refs": clean((c.get("refs") or c.get("spec_ref") or "").strip()),
    }


def section_for(c):
    area = c["area"].strip()
    if c.get("api_related"):
        leaf = re.sub(r"^API\s*[—-]\s*", "", area).strip()
        return "API — " + leaf
    return area


def verify(after, want, section_id=None, check_atm=False):
    d = {
        "title": (after.get("title") or "") == want["title"],
        "preconds": (after.get("custom_preconds") or "") == want["custom_preconds"],
        "steps": (after.get("custom_steps") or "") == want["custom_steps"],
        "expected": (after.get("custom_expected") or "") == want["custom_expected"],
        "refs": norm_refs(after.get("refs") or "") == norm_refs(want["refs"]),
    }
    if section_id is not None:
        d["section"] = after.get("section_id") == section_id
    if check_atm:
        d["atm"] = (after.get("custom_atmstatus") == 3
                    and after.get("custom_automation_type") == 0)
    return all(d.values()), d


# --- load local cases ---------------------------------------------------------
cases = {}
for f in glob.glob(os.path.join(HERE, "cases", "cases-*.json")):
    for c in json.load(open(f)):
        cases[c["id"]] = c

log = []
ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
done = {"sections": [], "update": [], "add": []}
new_cids = {}

try:
    # ============ PHASE 0: 2 add_section under group 4254 ==================
    print("\n===== PHASE 0: add_section x2 =====", flush=True)
    secs = api("GET", "get_sections/1&suite_id=1")
    seclist = secs["sections"] if isinstance(secs, dict) and "sections" in secs else secs
    name2id = {s["name"]: s["id"] for s in seclist if s.get("parent_id") == GROUP_ID}
    for nm in NEW_SECTIONS:
        if nm in name2id:
            print(f"  section EXISTS: {nm!r} = {name2id[nm]}", flush=True)
            done["sections"].append((nm, name2id[nm], "existing"))
        else:
            res = api("POST", "add_section/1",
                      {"suite_id": 1, "parent_id": GROUP_ID, "name": nm})
            name2id[nm] = res["id"]
            print(f"  section CREATED: {nm!r} = {res['id']}", flush=True)
            done["sections"].append((nm, res["id"], "created"))
            log.append({"op": "add_section", "name": nm, "id": res["id"], "ts": ts()})

    # ============ PHASE 1: snapshots + update_case x2 =======================
    print("\n===== PHASE 1: pre-push snapshots + update_case x2 =====", flush=True)
    for sid, cid in UPDATES.items():
        before = api("GET", f"get_case/{cid}")
        snap = os.path.join(SNAP_DIR, f"C{cid}-{sid}-pre-push-2026-07-30.json")
        json.dump(before, open(snap, "w"), indent=2)
        print(f"  snapshot saved: {snap}", flush=True)
        c = cases[sid]
        want = desired_body(c)
        # Sanity: title must be unchanged (the authorized change = expected lines only)
        title_same = (before.get("title") or "") == want["title"]
        print(f"  {sid} C{cid}: live-title==local-title: {title_same}", flush=True)
        api("POST", f"update_case/{cid}", want)
        after = api("GET", f"get_case/{cid}")
        match, detail = verify(after, want)
        print(f"  {sid}: update_case C{cid} MATCH={match}", flush=True)
        done["update"].append((sid, cid, match))
        log.append({"op": "update_case", "sch": sid, "cid": cid, "ts": ts(),
                    "match": match, "detail": detail, "title_unchanged": title_same,
                    "before_expected": before.get("custom_expected"),
                    "after_expected": after.get("custom_expected")})
        if not match:
            raise RuntimeError(f"update_case MISMATCH on {sid} C{cid}: {detail}")

    # ============ PHASE 2: add_case x13 ====================================
    print("\n===== PHASE 2: add_case x13 =====", flush=True)
    for sid in ADDS:
        c = cases[sid]
        sec_name = section_for(c)
        section_id = name2id.get(sec_name)
        if not section_id:
            raise RuntimeError(f"No section id for {sec_name!r} ({sid})")
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
        new_cid = res["id"]
        new_cids[sid] = new_cid
        after = api("GET", f"get_case/{new_cid}")
        match, detail = verify(after, want, section_id=section_id, check_atm=True)
        print(f"  {sid}: created C{new_cid} in section {section_id} ({sec_name}). "
              f"MATCH={match}", flush=True)
        done["add"].append((sid, new_cid, match))
        log.append({"op": "add_case", "sch": sid, "cid": new_cid,
                    "section_id": section_id, "section": sec_name, "ts": ts(),
                    "type_id": payload["type_id"],
                    "priority_id": payload["priority_id"],
                    "match": match, "detail": detail})
        if not match:
            raise RuntimeError(f"add_case MISMATCH on {sid} C{new_cid}: {detail}")

    # ============ PHASE 3: live count under group 4254 ======================
    print("\n===== PHASE 3: live count under group 4254 =====", flush=True)
    secs = api("GET", "get_sections/1&suite_id=1")
    seclist = secs["sections"] if isinstance(secs, dict) and "sections" in secs else secs
    subtree = {GROUP_ID}
    changed = True
    while changed:
        changed = False
        for s in seclist:
            if s.get("parent_id") in subtree and s["id"] not in subtree:
                subtree.add(s["id"])
                changed = True
    total, offset = 0, 0
    while True:
        res = api("GET", f"get_cases/1&suite_id=1&limit=250&offset={offset}")
        batch = res["cases"] if isinstance(res, dict) and "cases" in res else res
        total += sum(1 for c in batch if c.get("section_id") in subtree)
        if len(batch) < 250:
            break
        offset += 250
    print(f"  LIVE CASE COUNT under group {GROUP_ID} subtree: {total}", flush=True)
    log.append({"op": "live_count", "group": GROUP_ID, "count": total, "ts": ts()})

finally:
    json.dump({"done": done, "new_cids": new_cids, "log": log},
              open("/tmp/sched_techplan_sync_result.json", "w"), indent=2)
    print("\n===== SUMMARY =====", flush=True)
    print("sections:", done["sections"], flush=True)
    print("updates:", done["update"], flush=True)
    print("adds:", done["add"], flush=True)
    print("new_cids:", new_cids, flush=True)
