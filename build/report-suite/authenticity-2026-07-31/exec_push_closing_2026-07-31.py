#!/usr/bin/env python3
"""PHASE 5 — the authorized TestRail push for the closing authenticity pass.

  * update_case for every case whose desired body differs from live
  * add_case x2 for PV-PREC-01 / PV-PREC-02 (custom_atmstatus:3 + custom_automation_type:0)
  * 0 delete_case, 0 add_section
  * then the Rule-34 union add of the 2 new cases to run 359

Every update is preceded by a get_case snapshot and followed by a re-GET verification of
title / preconds / steps / expected / refs.

Run with  --dry  to emit the manifest only.
"""
import json, os, re, glob, csv, sys, time, subprocess
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.dirname(HERE)
SNAP = os.path.join(HERE, "pre-push-snapshot")
BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
DRY = "--dry" in sys.argv
RUN = 359
os.makedirs(SNAP, exist_ok=True)
if not DRY:
    USER = os.environ["TESTRAIL_USER"]; KEY = os.environ["TESTRAIL_KEY"]

IDPAT = r"(?:SBC|SBR|PV|TU|WIP|IV)-[A-Z]+-\d+"
def clean(s):
    """Identical to the 2026-07-31 executor: strip internal-id cross-refs + flag words
    from the tester-facing text on the way to TestRail."""
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

def joinlines(lst): return "\n".join(clean(x.rstrip()) for x in (lst or []))
def norm_refs(s): return re.sub(r",\s*", ",", (s or "").strip())
def unhtml(s):
    """Cases created by the original CSV import store <ol><li> markup; compare on text."""
    if not s or "<li>" not in s: return s or ""
    import html
    items = re.findall(r"<li>(.*?)</li>", s, re.S)
    return "\n".join("%d. %s" % (i + 1, html.unescape(x).strip()) for i, x in enumerate(items))

def api(method, endpoint, payload=None):
    for attempt in range(6):
        cmd = ["curl", "-sS", "--cacert", CA, "-u", f"{USER}:{KEY}",
               "-H", "Content-Type: application/json", "-w", "\n%{http_code}", BASE + endpoint]
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
        try: return code, (json.loads(body) if body.strip() else None)
        except Exception: return code, body
    return "000", "retries exhausted"

# ---------------------------------------------------------------- inputs
cases = {}
for f in sorted(glob.glob(os.path.join(RS, "cases", "cases-*.json"))):
    for c in json.load(open(f, encoding="utf-8")):
        if str(c.get("viu_status", "")).startswith("Retired"): continue
        cases[c["id"]] = c
assert len(cases) == 474, len(cases)
idmap = {r["internal_id"]: r["testrail_case_id"]
         for r in csv.DictReader(open(os.path.join(RS, "testrail-id-map.csv"), encoding="utf-8"))}
live = {c["id"]: c for c in json.load(open("/tmp/live_4281.json"))["cases"]}
SECTION = {s["name"]: s["id"] for s in json.load(open("/tmp/live_4281.json"))["sections"]}

def desired(c):
    return {"title": clean(c["title"].strip()),
            "custom_preconds": joinlines(c.get("preconditions")),
            "custom_steps": joinlines(c.get("steps")),
            "custom_expected": joinlines(c.get("expected")),
            "refs": clean((c.get("spec_ref") or "").strip())}

UPDATES, ADDS, NOOP = [], [], []
for iid in sorted(cases):
    c = cases[iid]; want = desired(c)
    assert len(want["title"]) <= 80, (iid, len(want["title"]))
    assert len(want["refs"]) <= 250, (iid, len(want["refs"]))
    assert re.match(r"^SV-\d+", want["refs"]), iid
    assert "," not in want["refs"], iid
    for k in ("custom_preconds", "custom_steps", "custom_expected"):
        assert want[k].strip(), (iid, k)
    cid = idmap.get(iid, "").strip()
    if not cid:
        ADDS.append(iid); continue
    L = live[int(cid.lstrip("C"))]
    same = (want["title"].strip() == (L["title"] or "").strip()
            and want["custom_preconds"] == unhtml(L.get("custom_preconds"))
            and want["custom_steps"] == unhtml(L.get("custom_steps"))
            and want["custom_expected"] == unhtml(L.get("custom_expected"))
            and norm_refs(want["refs"]) == norm_refs(L.get("refs")))
    (NOOP if same else UPDATES).append((iid, cid.lstrip("C")))
assert ADDS == ["PV-PREC-01", "PV-PREC-02"], ADDS
print("pre-flight OK — updates %d · adds %d · no-op %d" % (len(UPDATES), len(ADDS), len(NOOP)), flush=True)

if DRY:
    man = ["# Report Suite — TestRail sync MANIFEST (closing authenticity pass, 2026-07-31)",
           "", "**STATUS: PENDING — nothing executed.**", "",
           "| Operation | Count |", "|---|---|",
           "| `update_case` | %d |" % len(UPDATES),
           "| `add_case` | %d |" % len(ADDS),
           "| `delete_case` | **0** |", "| `add_section` | **0** |",
           "| `update_run` (run %d case sync) | 1 |" % RUN,
           "| no-op (live already matches) | %d |" % len(NOOP), "",
           "Fields sent per case: `title`, `custom_preconds`, `custom_steps`, `custom_expected`, "
           "`refs`. Adds also carry `section_id`, `type_id`, `priority_id`, "
           "`custom_atmstatus:3`, `custom_automation_type:0`.", "",
           "## add_case (2)", "", "| Internal ID | Section | Section ID | Title |", "|---|---|---|---|"]
    for iid in ADDS:
        man.append("| %s | %s | %d | %s |" % (iid, cases[iid]["area"], SECTION[cases[iid]["area"]],
                                              cases[iid]["title"]))
    man += ["", "## update_case (%d)" % len(UPDATES), "",
            "| # | Internal ID | TestRail | Link |", "|---|---|---|---|"]
    for i, (iid, cid) in enumerate(UPDATES, 1):
        man.append("| %d | %s | C%s | https://shopview.testrail.io/index.php?/cases/view/%s |"
                   % (i, iid, cid, cid))
    open(os.path.join(HERE, "testrail-push-manifest-closing-2026-07-31.md"), "w",
         encoding="utf-8").write("\n".join(man) + "\n")
    print("manifest written (PENDING)")
    sys.exit(0)

ts = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
log, failures = [], []

print("===== PHASE 0: pre-push snapshots x%d =====" % len(UPDATES), flush=True)
for iid, cid in UPDATES:
    code, body = api("GET", "get_case/%s" % cid)
    assert code == "200", (iid, cid, code)
    json.dump(body, open(os.path.join(SNAP, "C%s_%s.pre-push-2026-07-31.json" % (cid, iid)), "w"), indent=1)
code, r359 = api("GET", "get_run/%d" % RUN); assert code == "200", code
code, t359 = api("GET", "get_tests/%d&limit=250" % RUN)
tests = t359["tests"] if isinstance(t359, dict) else t359
off = 250
while len(tests) % 250 == 0 and len(tests) > 0:
    code, more = api("GET", "get_tests/%d&limit=250&offset=%d" % (RUN, off))
    chunk = more["tests"] if isinstance(more, dict) else more
    if not chunk: break
    tests += chunk; off += 250
code, res = api("GET", "get_results_for_run/%d&limit=250" % RUN)
rr = res["results"] if isinstance(res, dict) else res
res_total = res.get("size", len(rr)) if isinstance(res, dict) else len(rr)
PRIOR = sorted({t["case_id"] for t in tests})
json.dump({"run": r359, "test_case_ids": PRIOR, "test_count": len(tests),
           "results_count": res_total},
          open(os.path.join(SNAP, "run359.pre-sync-closing-2026-07-31.json"), "w"), indent=1)
print("run %d BEFORE: %d tests · %d distinct case_ids · %d recorded results · include_all=%s"
      % (RUN, len(tests), len(PRIOR), res_total, r359.get("include_all")), flush=True)

print("===== PHASE 1: update_case x%d =====" % len(UPDATES), flush=True)
for n, (iid, cid) in enumerate(UPDATES, 1):
    want = desired(cases[iid])
    code, body = api("POST", "update_case/%s" % cid, want)
    ok = code == "200"
    v = {}
    if ok:
        code2, after = api("GET", "get_case/%s" % cid)
        v = {"title": (after.get("title") or "").strip() == want["title"].strip(),
             "preconds": (after.get("custom_preconds") or "") == want["custom_preconds"],
             "steps": (after.get("custom_steps") or "") == want["custom_steps"],
             "expected": (after.get("custom_expected") or "") == want["custom_expected"],
             "refs": norm_refs(after.get("refs")) == norm_refs(want["refs"])}
    good = ok and all(v.values())
    if not good: failures.append((iid, cid, code, v))
    log.append({"n": n, "op": "update_case", "id": iid, "cid": "C" + cid, "http": code,
                "verify": "MATCH" if good else "MISMATCH %s" % v, "at": ts()})
    print("  %d/%d %-13s C%-6s %s %s" % (n, len(UPDATES), iid, cid, code,
          "MATCH" if good else "MISMATCH %s" % v), flush=True)

print("===== PHASE 2: add_case x%d =====" % len(ADDS), flush=True)
NEWIDS = {}
for iid in ADDS:
    c = cases[iid]; b = desired(c)
    b.update({"type_id": {"Functional": 1, "Negative": 1, "Usability": 1}.get(c["type"], 1),
              "priority_id": {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}[c["priority"]],
              "custom_atmstatus": 3, "custom_automation_type": 0})
    sec = SECTION[c["area"]]
    code, body = api("POST", "add_case/%d" % sec, b)
    ok = code == "200" and body and body.get("id")
    v = {}
    if ok:
        cid = body["id"]; NEWIDS[iid] = cid
        code2, after = api("GET", "get_case/%d" % cid)
        v = {"title": (after.get("title") or "").strip() == b["title"].strip(),
             "preconds": (after.get("custom_preconds") or "") == b["custom_preconds"],
             "steps": (after.get("custom_steps") or "") == b["custom_steps"],
             "expected": (after.get("custom_expected") or "") == b["custom_expected"],
             "refs": norm_refs(after.get("refs")) == norm_refs(b["refs"]),
             "atmstatus": after.get("custom_atmstatus") == 3,
             "automation_type": after.get("custom_automation_type") == 0,
             "section": after.get("section_id") == sec}
    good = ok and all(v.values())
    if not good: failures.append((iid, "NEW", code, v))
    log.append({"n": len(log) + 1, "op": "add_case", "id": iid,
                "cid": "C%s" % NEWIDS.get(iid, "?"), "http": code,
                "verify": "MATCH" if good else "MISMATCH %s" % v, "at": ts()})
    print("  %-13s -> C%s %s %s" % (iid, NEWIDS.get(iid, "?"), code,
          "MATCH" if good else "MISMATCH %s" % v), flush=True)

assert not failures, failures
print("===== PHASE 3: run %d union sync (Standing Rule 34) =====" % RUN, flush=True)
new_ids = sorted(NEWIDS.values())
union = sorted(set(PRIOR) | set(new_ids))
assert set(PRIOR).issubset(set(union)), "prior set is not a subset of the union"
assert len(union) == len(PRIOR) + len(new_ids), (len(union), len(PRIOR), len(new_ids))
code, body = api("POST", "update_run/%d" % RUN, {"include_all": False, "case_ids": union})
assert code == "200", (code, body)
code, t2 = api("GET", "get_tests/%d&limit=250" % RUN)
tests2 = t2["tests"] if isinstance(t2, dict) else t2
off = 250
while True:
    code, more = api("GET", "get_tests/%d&limit=250&offset=%d" % (RUN, off))
    chunk = more["tests"] if isinstance(more, dict) else more
    if not chunk: break
    tests2 += chunk; off += 250
code, res2 = api("GET", "get_results_for_run/%d&limit=250" % RUN)
rr2 = res2["results"] if isinstance(res2, dict) else res2
res2_total = res2.get("size", len(rr2)) if isinstance(res2, dict) else len(rr2)
after_ids = {t["case_id"] for t in tests2}
verify = {"count": len(tests2) == len(union),
          "prior_cases_present": set(PRIOR).issubset(after_ids),
          "new_cases_present": set(new_ids).issubset(after_ids),
          "results_unchanged": res2_total == res_total}
print("run %d AFTER: %d tests · %d recorded results · verify %s"
      % (RUN, len(tests2), res2_total, verify), flush=True)
assert all(verify.values()), verify

json.dump({"log": log, "new_case_ids": NEWIDS, "failures": failures,
           "run_sync": {"run": RUN, "before_tests": len(tests), "after_tests": len(tests2),
                        "before_results": res_total, "after_results": res2_total,
                        "verify": verify}},
          open(os.path.join(HERE, "testrail-execution-result-closing-2026-07-31.json"), "w"), indent=1)
print("\nALL OPERATIONS SUCCEEDED — %d update_case · %d add_case · 0 delete · run %d synced"
      % (len(UPDATES), len(ADDS), RUN))
