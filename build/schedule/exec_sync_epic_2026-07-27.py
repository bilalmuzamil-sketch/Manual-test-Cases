#!/usr/bin/env python3
"""Execute the AUTHORIZED Schedule TestRail epic-backfill sync (2026-07-27).

Per build/schedule/spec-v1-2026-07-22/testrail-sync-manifest-epic-2026-07-27.md:
  - add_section x2 (if missing): "Working Hours Settings", "Week Export and Printing"
  - add_case x10  : SCH-HRS-01..07, SCH-EXP-01/02, SCH-REAS-06 (new-scope, VIU-Pending)
  - update_case x167: epic SV-8685 refs backfill on every active C-id'd case;
                      10 of those ALSO push tester-facing title/preconds/steps/expected.

Field mapping mirrors build/schedule/gen_import.py (VIU-word-free / flag-free clean())
and the established Schedule push (title, custom_preconds, custom_steps, custom_expected,
refs). Stops on ANY non-200 / any re-GET MISMATCH. Never writes a run.
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

ADDS = ["SCH-HRS-01", "SCH-HRS-02", "SCH-HRS-03", "SCH-HRS-04", "SCH-HRS-05",
        "SCH-HRS-06", "SCH-HRS-07", "SCH-EXP-01", "SCH-EXP-02", "SCH-REAS-06"]

# The 10 update_case that ALSO change tester-facing fields.
TESTER_FACING = {"SCH-FILT-01", "SCH-VIEW-01", "SCH-EVT-01", "SCH-REAS-03",
                 "SCH-REAS-04", "SCH-REAS-05", "SCH-DEL-08", "SCH-SPREAD-07",
                 "SCH-EDGE-05", "SCH-BLOCK-04"}

NEW_SECTIONS = ["Working Hours Settings", "Week Export and Printing"]


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
        if code in ("429",) or code.startswith("5"):
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
    """TestRail normalizes spaces after commas in refs; match that for compare."""
    return re.sub(r",\s*", ",", (s or "").strip())


def refs_of(c):
    return clean((c.get("refs") or c.get("spec_ref") or "").strip())


# --- load local cases + id-map ----------------------------------------------
cases = {}
for f in glob.glob(os.path.join(HERE, "cases", "cases-*.json")):
    for c in json.load(open(f)):
        cases[c["id"]] = c

idmap = {}
with open(os.path.join(HERE, "testrail-id-map.csv")) as fh:
    for row in csv.DictReader(fh):
        idmap[row["internal_id"]] = row["testrail_case_id"].strip().lstrip("C")


def desired_body(c):
    return {
        "title": clean(c["title"].strip()),
        "custom_preconds": joinlines(c.get("preconditions", [])),
        "custom_steps": joinlines(c.get("steps", [])),
        "custom_expected": joinlines(c.get("expected", [])),
        "refs": refs_of(c),
    }


log = []
ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
done = {"sections": [], "add": [], "update": []}
new_cids = {}

try:
    # ============ PHASE 0: resolve/create sections =========================
    print("\n===== PHASE 0: sections =====", flush=True)
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

    # ============ PHASE 1: add_case x10 ====================================
    print("\n===== PHASE 1: add_case x10 =====", flush=True)
    for sid in ADDS:
        c = cases[sid]
        area = c["area"].strip()
        if c.get("api_related"):
            raise RuntimeError(f"{sid} is api_related but no API section handling")
        section_id = name2id.get(area)
        if not section_id:
            raise RuntimeError(f"No section id for area {area!r} ({sid})")
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
        title_ok = (after.get("title") or "") == want["title"]
        pre_ok = (after.get("custom_preconds") or "") == want["custom_preconds"]
        steps_ok = (after.get("custom_steps") or "") == want["custom_steps"]
        exp_ok = (after.get("custom_expected") or "") == want["custom_expected"]
        refs_ok = norm_refs(after.get("refs") or "") == norm_refs(want["refs"])
        sec_ok = after.get("section_id") == section_id
        atm_ok = after.get("custom_atmstatus") == 3 and after.get("custom_automation_type") == 0
        match = all([title_ok, pre_ok, steps_ok, exp_ok, refs_ok, sec_ok, atm_ok])
        print(f"  {sid}: created C{new_cid} in section {section_id} ({area}). "
              f"MATCH={match} atm/auto_ok={atm_ok}", flush=True)
        done["add"].append((sid, new_cid, match))
        log.append({
            "op": "add_case", "sch": sid, "cid": new_cid, "section_id": section_id,
            "ts": ts(), "type_id": payload["type_id"], "priority_id": payload["priority_id"],
            "match": match,
            "detail": {"title": title_ok, "preconds": pre_ok, "steps": steps_ok,
                       "expected": exp_ok, "refs": refs_ok, "section": sec_ok, "atm": atm_ok},
        })
        if not match:
            raise RuntimeError(f"add_case verify MISMATCH on {sid} C{new_cid}: {log[-1]['detail']}")

    # ============ PHASE 2: update_case x167 ================================
    print("\n===== PHASE 2: update_case x167 =====", flush=True)
    n_meta = n_tf = 0
    for sid, cid in idmap.items():
        if not cid:              # the 10 new-scope (just added) — skip
            continue
        c = cases[sid]
        want = desired_body(c)
        tf = sid in TESTER_FACING
        if tf:
            payload = dict(want)                 # full body + refs
        else:
            payload = {"refs": want["refs"]}     # metadata-only: refs field only
        api("POST", f"update_case/{cid}", payload)
        after = api("GET", f"get_case/{cid}")
        refs_ok = norm_refs(after.get("refs") or "") == norm_refs(want["refs"])
        if tf:
            title_ok = (after.get("title") or "") == want["title"]
            pre_ok = (after.get("custom_preconds") or "") == want["custom_preconds"]
            steps_ok = (after.get("custom_steps") or "") == want["custom_steps"]
            exp_ok = (after.get("custom_expected") or "") == want["custom_expected"]
            match = all([refs_ok, title_ok, pre_ok, steps_ok, exp_ok])
            detail = {"refs": refs_ok, "title": title_ok, "preconds": pre_ok,
                      "steps": steps_ok, "expected": exp_ok}
            n_tf += 1
        else:
            match = refs_ok
            detail = {"refs": refs_ok}
            n_meta += 1
        done["update"].append((sid, cid, "tf" if tf else "meta", match))
        log.append({"op": "update_case", "sch": sid, "cid": cid, "kind": "tf" if tf else "meta",
                    "ts": ts(), "match": match, "detail": detail})
        if not match:
            raise RuntimeError(f"update_case POST-GET MISMATCH on {sid} C{cid}: {detail}")
    print(f"  update_case done: {n_meta} metadata-only + {n_tf} tester-facing = "
          f"{n_meta + n_tf}", flush=True)

finally:
    json.dump({"done": done, "new_cids": new_cids, "log": log},
              open("/tmp/sched_epic_sync_result.json", "w"), indent=2)
    print("\n===== SUMMARY =====", flush=True)
    print("sections:", done["sections"], flush=True)
    print("adds:", done["add"], flush=True)
    print("updates:", len(done["update"]), flush=True)
    print("new_cids:", new_cids, flush=True)
