#!/usr/bin/env python3
"""Resume the Schedule epic sync — remaining update_case only (transient HTTP 000
dropped the run after 151/167). Sections + 10 add_case already done; DO NOT re-add."""
import csv, json, glob, os, re, subprocess, sys, time
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
BASE_URL = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ.get("TESTRAIL_USER"); KEY = os.environ.get("TESTRAIL_KEY")
if not USER or not KEY:
    sys.exit("Set creds in env.")

TESTER_FACING = {"SCH-FILT-01", "SCH-VIEW-01", "SCH-EVT-01", "SCH-REAS-03",
                 "SCH-REAS-04", "SCH-REAS-05", "SCH-DEL-08", "SCH-SPREAD-07",
                 "SCH-EDGE-05", "SCH-BLOCK-04"}


def api(method, endpoint, payload=None):
    url = BASE_URL + endpoint
    for attempt in range(8):
        cmd = ["curl", "-sS", "--cacert", CA, "-u", f"{USER}:{KEY}",
               "-H", "Content-Type: application/json", "-w", "\n%{http_code}", url]
        if method == "POST":
            cmd[1:1] = ["-X", "POST", "--data-binary", json.dumps(payload)]
        out = subprocess.run(cmd, capture_output=True, text=True)
        body, _, code = out.stdout.rpartition("\n")
        code = code.strip()
        if code in ("000", "429") or code.startswith("5"):
            wait = 2 ** attempt
            print(f"  HTTP {code} on {endpoint} - retry in {wait}s", flush=True)
            time.sleep(wait); continue
        if code != "200":
            raise RuntimeError(f"HTTP {code} on {method} {endpoint}: {body[:400]}")
        return json.loads(body) if body.strip() else {}
    raise RuntimeError(f"Retries exhausted on {method} {endpoint}")


def clean(s):
    if not s: return s
    s = re.sub(r"\s*\(see (?:SCH|FLT|GS|SF|FD)-[A-Z0-9-]+(?:'s setup)?\)", "", s)
    s = re.sub(r"\s*\(from (?:SCH|FLT|GS|SF|FD)-[A-Z0-9-]+'s setup\)", "", s)
    s = re.sub(r"\s*\(per (?:SCH|FLT|GS|SF|FD)-[A-Z0-9-]+\)", "", s)
    s = re.sub(r"[,;]?\s*SCH-[A-Z]+-\d+(\.\.\d+)?", "", s)
    s = re.sub(r"feature[ -]flags?", "Schedule feature", s, flags=re.I)
    return s


def joinlines(lst): return "\n".join(clean(x.rstrip()) for x in (lst or []))
def norm_refs(s): return re.sub(r",\s*", ",", (s or "").strip())
def refs_of(c): return clean((c.get("refs") or c.get("spec_ref") or "").strip())


cases = {}
for f in glob.glob(os.path.join(HERE, "cases", "cases-*.json")):
    for c in json.load(open(f)):
        cases[c["id"]] = c

prev = json.load(open("/tmp/sched_epic_sync_result.json"))
done_upd = {u[0] for u in prev["done"]["update"]}
log = json.load(open("/tmp/sched_epic_sync_result.json"))["log"]
ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")

idmap = {}
for row in csv.DictReader(open(os.path.join(HERE, "testrail-id-map.csv"))):
    cid = row["testrail_case_id"].strip().lstrip("C")
    if cid: idmap[row["internal_id"]] = cid

remaining = [(s, c) for s, c in idmap.items() if s not in done_upd]
print(f"resuming {len(remaining)} update_case", flush=True)
newlog = []
for sid, cid in remaining:
    c = cases[sid]
    want = {"title": clean(c["title"].strip()),
            "custom_preconds": joinlines(c.get("preconditions", [])),
            "custom_steps": joinlines(c.get("steps", [])),
            "custom_expected": joinlines(c.get("expected", [])),
            "refs": refs_of(c)}
    tf = sid in TESTER_FACING
    payload = dict(want) if tf else {"refs": want["refs"]}
    api("POST", f"update_case/{cid}", payload)
    after = api("GET", f"get_case/{cid}")
    refs_ok = norm_refs(after.get("refs") or "") == norm_refs(want["refs"])
    if tf:
        detail = {"refs": refs_ok,
                  "title": (after.get("title") or "") == want["title"],
                  "preconds": (after.get("custom_preconds") or "") == want["custom_preconds"],
                  "steps": (after.get("custom_steps") or "") == want["custom_steps"],
                  "expected": (after.get("custom_expected") or "") == want["custom_expected"]}
        match = all(detail.values())
    else:
        detail = {"refs": refs_ok}; match = refs_ok
    print(f"  {sid} C{cid} ({'tf' if tf else 'meta'}): MATCH={match}", flush=True)
    prev["done"]["update"].append((sid, cid, "tf" if tf else "meta", match))
    newlog.append({"op": "update_case", "sch": sid, "cid": cid,
                   "kind": "tf" if tf else "meta", "ts": ts(),
                   "match": match, "detail": detail})
    if not match:
        raise RuntimeError(f"MISMATCH {sid} C{cid}: {detail}")

prev["log"] = log + newlog
json.dump(prev, open("/tmp/sched_epic_sync_result.json", "w"), indent=2)
print(f"\nTOTAL update_case now: {len(prev['done']['update'])}", flush=True)
