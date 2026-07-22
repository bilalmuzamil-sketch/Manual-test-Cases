#!/usr/bin/env python3
"""Execute the AUTHORIZED Schedule TestRail sync (2026-07-22).

7 update_case + 2 add_case + 1 delete_case, per
build/schedule/spec-v1-2026-07-22/testrail-sync-manifest.md.

Field mapping mirrors build/schedule/gen_import.py (VIU-word-free / flag-free
clean()) and the established fees-discounts push (title, custom_preconds,
custom_steps, custom_expected, refs). Stops on ANY non-200.
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

TYPE_ID = {"Functional": 6, "Negative": 5, "Accessibility": 2}
PRIO_ID = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}
SECTION_ID = {"Permissions": 4279, "Events": 4269}

UPDATES = ["SCH-MODAL-04", "SCH-MODAL-08", "SCH-CONF-02", "SCH-CONF-03",
           "SCH-CONF-04", "SCH-VIEW-04", "SCH-TIP-01"]
ADDS = ["SCH-PERM-12", "SCH-EVT-08"]
DELETE = "SCH-REAS-02"


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
    return re.sub(r",\s*", ",", clean((s or "").strip()))


# --- load local cases + id-map ----------------------------------------------
cases = {}
for f in glob.glob(os.path.join(HERE, "cases", "cases-*.json")):
    for c in json.load(open(f)):
        cases[c["id"]] = c

idmap = {}
with open(os.path.join(HERE, "testrail-id-map.csv")) as f:
    for row in csv.DictReader(f):
        idmap[row["internal_id"]] = row["testrail_case_id"].strip().lstrip("C")


def desired_body(c):
    return {
        "title": clean(c["title"].strip()),
        "custom_preconds": joinlines(c.get("preconditions", [])),
        "custom_steps": joinlines(c.get("steps", [])),
        "custom_expected": joinlines(c.get("expected", [])),
        "refs": norm_refs(c.get("spec_ref", "")),
    }


log = []
ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
done = {"update": [], "add": [], "delete": None}

try:
    # ================= PHASE 1: 7 update_case ==============================
    print("\n===== PHASE 1: update_case x7 =====", flush=True)
    for sid in UPDATES:
        c = cases[sid]
        cid = idmap[sid]
        want = desired_body(c)
        before = api("GET", f"get_case/{cid}")
        payload = dict(want)
        api("POST", f"update_case/{cid}", payload)
        after = api("GET", f"get_case/{cid}")
        match = all((after.get(k) or "") == want[k] for k in want)
        # refs may normalize; recompute compare
        refs_ok = (after.get("refs") or "") == want["refs"]
        title_ok = (after.get("title") or "") == want["title"]
        pre_ok = (after.get("custom_preconds") or "") == want["custom_preconds"]
        steps_ok = (after.get("custom_steps") or "") == want["custom_steps"]
        exp_ok = (after.get("custom_expected") or "") == want["custom_expected"]
        match = all([refs_ok, title_ok, pre_ok, steps_ok, exp_ok])
        print(f"  {sid} C{cid}: pushed. re-GET MATCH={match} "
              f"(title={title_ok} pre={pre_ok} steps={steps_ok} exp={exp_ok} refs={refs_ok})",
              flush=True)
        done["update"].append((sid, cid, match))
        log.append({
            "op": "update_case", "sch": sid, "cid": cid, "ts": ts(),
            "before_title": before.get("title"), "after_title": after.get("title"),
            "match": match,
            "detail": {"title": title_ok, "preconds": pre_ok, "steps": steps_ok,
                       "expected": exp_ok, "refs": refs_ok},
        })
        if not match:
            raise RuntimeError(f"POST-GET MISMATCH on {sid} C{cid}: {log[-1]['detail']}")

    # ================= PHASE 2: 2 add_case ================================
    print("\n===== PHASE 2: add_case x2 =====", flush=True)
    for sid in ADDS:
        c = cases[sid]
        section_id = SECTION_ID[c["area"].strip()]
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
        after = api("GET", f"get_case/{new_cid}")
        title_ok = (after.get("title") or "") == want["title"]
        pre_ok = (after.get("custom_preconds") or "") == want["custom_preconds"]
        steps_ok = (after.get("custom_steps") or "") == want["custom_steps"]
        exp_ok = (after.get("custom_expected") or "") == want["custom_expected"]
        refs_ok = (after.get("refs") or "") == want["refs"]
        sec_ok = after.get("section_id") == section_id
        atm_ok = after.get("custom_atmstatus") == 3 and after.get("custom_automation_type") == 0
        match = all([title_ok, pre_ok, steps_ok, exp_ok, refs_ok, sec_ok, atm_ok])
        print(f"  {sid}: created C{new_cid} in section {section_id} "
              f"({c['area']}). MATCH={match} atm/auto_ok={atm_ok}", flush=True)
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

    # ================= PHASE 3: 1 delete_case =============================
    print("\n===== PHASE 3: delete_case x1 =====", flush=True)
    del_cid = idmap[DELETE]
    api("POST", f"delete_case/{del_cid}", {})
    # verify gone
    gone = False
    try:
        chk = api("GET", f"get_case/{del_cid}")
        # is_deleted flag path (TestRail soft-delete)
        gone = bool(chk.get("is_deleted"))
    except RuntimeError as e:
        gone = ("400" in str(e) or "404" in str(e))
    print(f"  {DELETE} C{del_cid}: delete_case issued. verify-gone={gone}", flush=True)
    done["delete"] = (DELETE, del_cid, gone)
    log.append({"op": "delete_case", "sch": DELETE, "cid": del_cid, "ts": ts(),
                "verify_gone": gone})
    if not gone:
        raise RuntimeError(f"delete_case verify FAILED on {DELETE} C{del_cid}")

finally:
    json.dump({"done": done, "log": log}, open("/tmp/sched_sync_result.json", "w"), indent=2)
    print("\n===== SUMMARY =====", flush=True)
    print("updates:", done["update"], flush=True)
    print("adds:", done["add"], flush=True)
    print("delete:", done["delete"], flush=True)
