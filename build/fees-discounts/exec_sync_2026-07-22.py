#!/usr/bin/env python3
"""Execute the authorized SV-8479/8480 TestRail sync for Fees & Discounts (2026-07-22).

Authorized (user, 2026-07-22): (1) the SV-8479/SV-8480 push (18 add_case + 51
update_case), (2) retire 3 (delete_case). Necessary prerequisite: create the 5
net-new sections the parts-sale + API-calc new cases belong in (under group 3894
'Fees & Discounts'). NO writes to any test run.

Field mapping mirrors testrail_viu_sync.py / gen_import.py exactly:
title, custom_preconds, custom_steps, custom_expected, refs (+ add_case requires
custom_atmstatus:3 + custom_automation_type:0).

Creds: env TESTRAIL_USER / TESTRAIL_KEY (never hardcoded).
"""
import csv, json, os, re, subprocess, sys, time
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
BASE_URL = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ.get("TESTRAIL_USER")
KEY = os.environ.get("TESTRAIL_KEY")
FD_GROUP = 3894
if not USER or not KEY:
    sys.exit("Set TESTRAIL_USER / TESTRAIL_KEY in env.")


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
            time.sleep(2 ** attempt); continue
        return body, code
    return "retries exhausted", "ERR"


# ---- content builders (mirror gen_import.py) --------------------------------
def clean(s):
    if not s:
        return s
    s = re.sub(r"\s*\(see (?:SF|FD)-[A-Z0-9-]+\)", "", s)
    s = s.replace(" (Administration → Feature Flags)", "")
    s = s.replace("(Administration → Feature Flags)", "")
    s = s.replace("Fees & Discounts feature flag", "Fees & Discounts feature")
    s = s.replace("FeesAndDiscounts feature flag", "Fees & Discounts feature")
    s = s.replace("FeesAndDiscounts flag", "Fees & Discounts feature")
    s = re.sub(r"feature[ -]flags?", "Fees & Discounts feature", s, flags=re.I)
    m = re.match(r"^(\s*\d+\.\s*)EXPECTED PER SPEC:\s*(.*)$", s, re.I | re.S)
    if m:
        rest = m.group(2)
        rest = rest[:1].upper() + rest[1:] if rest else rest
        s = m.group(1) + rest
    return s


def joinlines(lst):
    return "\n".join(clean(x.rstrip()) for x in lst)


def build_refs(c):
    parts = []
    sr = (c.get("story_ref") or "").strip()
    if sr:
        parts.append(sr)
    for jira in sorted(set(re.findall(r"SV-\d+", str(c.get("story_ref", ""))))):
        if jira not in " ".join(parts):
            parts.append(jira)
    return clean(" ".join(parts).strip())


def desired_fields(c):
    return {
        "title": clean(c["title"].strip()),
        "custom_preconds": joinlines(c.get("preconditions", [])),
        "custom_steps": joinlines(c.get("steps", [])),
        "custom_expected": joinlines(c.get("expected", [])),
        "refs": build_refs(c),
    }


def differs(live, k, v):
    have = live.get(k) or ""
    if k == "refs":
        return have.replace(", ", ",") != v.replace(", ", ",")
    return have != v


# ---- load sources ------------------------------------------------------------
cases = []
for fn in ["group-A-wo-parts.json", "group-B-customer-admin-finance.json",
           "group-C-calc-permissions-validation.json"]:
    with open(os.path.join(HERE, "cases", fn)) as f:
        cases += json.load(f)
byid = {c["id"]: c for c in cases}

idmap = {}
with open(os.path.join(HERE, "testrail-id-map.csv")) as f:
    for row in csv.DictReader(f):
        idmap[row["fd_id"]] = row["ID"]

NEW18 = ["FD-WO-017", "FD-WO-018", "FD-WO-021", "FD-WO-025", "FD-WO-028",
         "FD-PSALE-002", "FD-PSALE-003", "FD-PSALE-004", "FD-PSALE-006",
         "FD-PSALE-008", "FD-PSALE-009", "FD-CALC-018", "FD-CALC-019",
         "FD-CALC-020", "FD-CALC-021", "FD-CALC-022", "FD-CALC-023", "FD-CALC-024"]

RETIRE = {"FD-LABOR-003": "28441", "FD-PCOL-003": "28471", "FD-PCOL-007": "28475"}

# 54 update from manifest B.1+B.2, minus the 3 retire -> 51
UPDATE54 = {
    "FD-INLINE-001": "28454", "FD-INLINE-002": "28455", "FD-PART-002": "28447",
    "FD-CALC-001": "28568", "FD-FIN-004": "28467", "FD-FIN-001": "28464",
    "FD-LABOR-001": "28439", "FD-LABOR-003": "28441", "FD-LABOR-007": "28445",
    "FD-PART-001": "28446", "FD-WO-001": "28424", "FD-WO-013": "28436",
    "FD-STATS-001": "28459", "FD-PCOL-002": "28470", "FD-PCOL-003": "28471",
    "FD-PCOL-006": "28474", "FD-PCOL-007": "28475", "FD-PSALE-001": "29918",
    "FD-INLINE-004": "28457",
    # B.2 whole-WO 28
    "FD-WO-002": "28425", "FD-WO-003": "28426", "FD-WO-004": "28427",
    "FD-WO-005": "28428", "FD-WO-006": "28429", "FD-WO-007": "28430",
    "FD-WO-008": "28431", "FD-WO-009": "28432", "FD-WO-010": "28433",
    "FD-WO-011": "28434", "FD-WO-012": "28435", "FD-WO-014": "28437",
    "FD-WO-015": "28438", "FD-WO-016": "29441", "FD-STACK-003": "28484",
    "FD-PROC-005": "28523", "FD-PERM-011": "28595", "FD-CALC-002": "28569",
    "FD-CALC-005": "28572", "FD-CALC-006": "28573", "FD-CALC-007": "28574",
    "FD-CALC-008": "28575", "FD-VAL-001": "28599", "FD-VAL-002": "28600",
    "FD-VAL-003": "28601", "FD-VAL-004": "28602", "FD-VAL-005": "28603",
    "FD-VAL-006": "28604",
    # labor 2 / part 3 / mixed 2
    "FD-LABOR-002": "28440", "FD-LABOR-004": "28442",
    "FD-PART-003": "28448", "FD-PART-004": "28449", "FD-CALC-004": "28571",
    "FD-CALC-003": "28570", "FD-TMPL-010": "28511",
}
UPDATE51 = {k: v for k, v in UPDATE54.items() if k not in RETIRE}
assert len(UPDATE51) == 51, len(UPDATE51)

# cross-check C-ids against id-map
for fd, cid in {**UPDATE54, **RETIRE}.items():
    if idmap.get(fd) != cid:
        sys.exit(f"C-id mismatch {fd}: manifest {cid} vs id-map {idmap.get(fd)!r}")
print("C-id cross-check vs id-map: PASS")

# section resolution
SECTION_NAME = {
    "FD-WO-017": "Work Order — Labor-line Fee/Discount",
    "FD-WO-018": "Work Order / Parts — Part-line Fee/Discount",
    "FD-WO-021": "Work Order — Sidebar 'Work Order Fee / Discount' card",
    "FD-WO-025": "Work Order — Whole-WO Fee/Discount",
    "FD-WO-028": "Work Order — Whole-WO Fee/Discount",
    "FD-PSALE-002": "Parts page — 'FEES & DISCOUNTS' column",
    "FD-PSALE-003": "Parts page — 'FEES & DISCOUNTS' column",
    "FD-PSALE-004": "Parts Sale — Fees & Discounts card",
    "FD-PSALE-006": "Parts Sale — Financial Info card",
    "FD-PSALE-008": "Part Sale — Fee/Discount dialog",
    "FD-PSALE-009": "Parts Sale — Statistics tab",
    "FD-CALC-018": "Calculation contract",
    "FD-CALC-019": "Calculation contract",
    "FD-CALC-020": "Calculation contract",
    "FD-CALC-021": "Calculation contract",
    "FD-CALC-022": "Calculation contract",
    "FD-CALC-023": "Calculation contract",
    "FD-CALC-024": "API — Calculation contract",
}
MISSING_SECTIONS = ["Parts Sale — Fees & Discounts card",
                    "Parts Sale — Financial Info card",
                    "Part Sale — Fee/Discount dialog",
                    "Parts Sale — Statistics tab",
                    "API — Calculation contract"]

# fetch current sections
sec_by_name = {}
ep = "get_sections/1&suite_id=1&limit=250&offset=0"
while True:
    body, code = api("GET", ep)
    if code != "200":
        sys.exit(f"get_sections failed HTTP {code}: {body[:200]}")
    resp = json.loads(body)
    for s in resp.get("sections", resp if isinstance(resp, list) else []):
        sec_by_name[s["name"]] = s["id"]
    nxt = (resp.get("_links") or {}).get("next") if isinstance(resp, dict) else None
    if not nxt:
        break
    ep = nxt.split("/api/v2/")[-1]

log = []
ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")

# ---- STEP 0: create missing sections ---------------------------------------
print("\n=== CREATE MISSING SECTIONS ===")
for name in MISSING_SECTIONS:
    if name in sec_by_name:
        print(f"  exists: {name} = {sec_by_name[name]}")
        continue
    body, code = api("POST", "add_section/1",
                     {"suite_id": 1, "parent_id": FD_GROUP, "name": name})
    if code != "200":
        print(f"STOP: add_section '{name}' HTTP {code}: {body[:300]}")
        sys.exit(1)
    sid = json.loads(body)["id"]
    sec_by_name[name] = sid
    log.append(("SECTION", name, str(sid), "created", ts()))
    print(f"  created: {name} = {sid}")
    time.sleep(0.25)

# ---- STEP 1: add_case (18) --------------------------------------------------
print("\n=== ADD 18 NEW CASES ===")
newids = {}
for fd in NEW18:
    c = byid[fd]
    secname = SECTION_NAME[fd]
    sid = sec_by_name[secname]
    payload = dict(desired_fields(c))
    payload["custom_atmstatus"] = 3
    payload["custom_automation_type"] = 0
    body, code = api("POST", f"add_case/{sid}", payload)
    if code != "200":
        print(f"STOP: add_case {fd} HTTP {code}: {body[:400]}")
        sys.exit(1)
    cid = json.loads(body)["id"]
    newids[fd] = cid
    # re-GET verify
    gbody, gcode = api("GET", f"get_case/{cid}")
    live = json.loads(gbody)
    d = desired_fields(c)
    diffs = [k for k in d if differs(live, k, d[k])]
    match = "MATCH" if not diffs else "MISMATCH:" + ",".join(diffs)
    log.append(("ADD", fd, f"C{cid}", f"section {sid} '{secname}'; {match}", ts()))
    print(f"  {fd} -> C{cid}  [{match}]")
    if diffs:
        print(f"STOP: re-GET mismatch for {fd} C{cid}: {diffs}")
        sys.exit(1)
    time.sleep(0.3)

# ---- STEP 2: delete_case (3) -----------------------------------------------
print("\n=== DELETE 3 RETIRE-CANDIDATES ===")
for fd, cid in RETIRE.items():
    body, code = api("POST", f"delete_case/{cid}", {})
    if code != "200":
        print(f"STOP: delete_case {fd} C{cid} HTTP {code}: {body[:300]}")
        sys.exit(1)
    gbody, gcode = api("GET", f"get_case/{cid}")
    gone = gcode in ("400", "404")
    log.append(("DELETE", fd, f"C{cid}", f"deleted HTTP {code}; re-GET HTTP {gcode} ({'gone' if gone else 'STILL PRESENT'})", ts()))
    print(f"  {fd} C{cid} deleted; re-GET HTTP {gcode} {'(gone)' if gone else '(STILL PRESENT!)'}")
    if not gone:
        print(f"STOP: {fd} C{cid} not gone after delete")
        sys.exit(1)
    time.sleep(0.3)

# ---- STEP 3: update_case (51) ----------------------------------------------
print("\n=== UPDATE 51 EXISTING CASES ===")
for fd, cid in sorted(UPDATE51.items(), key=lambda kv: int(kv[1])):
    c = byid[fd]
    d = desired_fields(c)
    body, code = api("POST", f"update_case/{cid}", d)
    if code != "200":
        print(f"STOP: update_case {fd} C{cid} HTTP {code}: {body[:400]}")
        sys.exit(1)
    gbody, gcode = api("GET", f"get_case/{cid}")
    live = json.loads(gbody)
    diffs = [k for k in d if differs(live, k, d[k])]
    match = "MATCH" if not diffs else "MISMATCH:" + ",".join(diffs)
    log.append(("UPDATE", fd, f"C{cid}", match, ts()))
    print(f"  {fd} C{cid}  [{match}]")
    if diffs:
        print(f"STOP: re-GET mismatch for {fd} C{cid}: {diffs}")
        sys.exit(1)
    time.sleep(0.3)

# ---- write results json for downstream steps -------------------------------
with open(os.path.join(HERE, "exec_sync_result.json"), "w") as f:
    json.dump({"newids": newids, "log": log}, f, indent=2)
print("\nDONE. new C-ids:", newids)
