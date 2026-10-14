#!/usr/bin/env python3
"""Independent read-back (Rules 41/50) of the v49 write, 14 Oct 2026: fresh GET of every touched case, every intended field compared
byte for byte with the payload rebuilt from proposals-v49.json + doc ids (and, for the two quote refreshes, with refresh_quote.py's
planned text); every other field compared with snapshots-after-answers (only updated_on/updated_by/version may differ); marker
unique and last; untouched neighbours (Vladimir's C236975/C236976, C581889-91, C154648) byte-identical incl. updated_on.
Writes applied/readback-2026-10-14-v49.jsonl."""
import json, sys, re, importlib.util, os
H = "build/wo-board-tech-view/currency-2026-10-14/apply-v49"; SNAP = "build/wo-board-tech-view/currency-2026-10-14/snapshots-after-answers"
sys.path.insert(0, H); from trlib import api, LAST
sys.argv = ["x", "--config", f"{H}/config.json", "--only", f"{H}/proposals-v49.json"]
spec = importlib.util.spec_from_file_location("t", f"{H}/apply_wo.py"); t = importlib.util.module_from_spec(spec); spec.loader.exec_module(t)
spec2 = importlib.util.spec_from_file_location("r", f"{H}/refresh_quote.py")
docs = {json.loads(l)["id"]: f"https://docs.google.com/document/d/{json.loads(l)['doc']}/edit" for l in open(f"{H}/doc-ids-0.jsonl")}
newids = json.load(open(f"{H}/applied/new-case-ids.json"))
SYS = ("updated_on", "updated_by", "version")
def marker_info(exp):
    txt = re.sub(r"<[^>]+>", "\n", exp); m = re.findall(r"AUTOMATION:[^\n]*", txt)
    return m, len(m) == 1 and [l for l in txt.split("\n") if l.strip()][-1].startswith("AUTOMATION:")
rows = []
items = [(cid, p, pay, "upd") for cid, p, pay in t.plans] + [(newids[k], p, pay, "new") for k, sec, p, pay in t.news]
for cid, p, pay, kind in items:
    a = api(f"get_case/{cid}"); st = LAST["status"]
    want = dict(pay, custom_preconds=t.preconds(p, docs[f"C{cid}"]))
    fields = {x: a.get(x) == v for x, v in want.items()}
    m, last = marker_info(a["custom_expected"])
    row = {"op": "readback", "case": f"C{cid}", "http": st, "fields_match": fields, "marker": m, "marker_unique_and_last": last,
           "created_by": a["created_by"], "section_id": a["section_id"], "custom_atmstatus": a["custom_atmstatus"],
           "custom_automation_type": a["custom_automation_type"], "type_id": a["type_id"], "priority_id": a["priority_id"], "refs": a["refs"]}
    if kind == "upd":
        s = json.load(open(f"{SNAP}/C{cid}.json"))
        row["other_fields_changed"] = [k for k in s if k not in want and k not in SYS and a.get(k) != s.get(k)]
    else:
        row["expected_section"] = p["section_id"]; row["other_fields_changed"] = [] if a["section_id"] == p["section_id"] else ["section_id"]
        row["new_case_fields_ok"] = all(a.get(k) == v for k, v in t.CFG["NEW_CASE_FIELDS"].items())
    row["ok"] = all(fields.values()) and last and not row["other_fields_changed"] and a["created_by"] == 3 and row.get("new_case_fields_ok", True)
    rows.append(row)
# the two quote refreshes: compare with the planned text rebuilt from the snapshot
r = importlib.util.module_from_spec(spec2); src = open(f"{H}/refresh_quote.py").read()
plan_src = src.split("os.makedirs(")[0]; ns = {"__file__": f"{H}/refresh_quote.py"}; exec(compile(plan_src, "rq", "exec"), ns)
for cid in (368133, 96965):
    s = json.load(open(f"{SNAP}/C{cid}.json")); a = api(f"get_case/{cid}"); st = LAST["status"]
    want = ns["plan"](cid, s["custom_expected"]); m, last = marker_info(a["custom_expected"])
    other = [k for k in s if k not in ("custom_expected",) + SYS and a.get(k) != s.get(k)]
    rows.append({"op": "readback", "case": f"C{cid}", "http": st, "fields_match": {"custom_expected": a["custom_expected"] == want},
                 "other_fields_changed": other, "marker": m, "marker_unique_and_last": last,
                 "custom_atmstatus": [s["custom_atmstatus"], a["custom_atmstatus"]], "custom_automation_type": [s["custom_automation_type"], a["custom_automation_type"]],
                 "build_stamp_kept": "Last checked against build v26.40.17-ddb9ba1 (staging) on 10/14/2026." in a["custom_expected"],
                 "v49_quote_present": ns["esc"](ns["NEW_R28"]) in a["custom_expected"], "v48_quote_absent": ns["esc"](ns["OLD_R28"]) not in a["custom_expected"],
                 "ok": a["custom_expected"] == want and not other and last})
for cid in (236975, 236976, 581889, 581890, 581891, 154648):
    s = json.load(open(f"{SNAP}/C{cid}.json")); a = api(f"get_case/{cid}")
    diff = [k for k in set(s) | set(a) if a.get(k) != s.get(k)]
    rows.append({"op": "untouched_check", "case": f"C{cid}", "http": LAST["status"], "created_by": a["created_by"], "differs_from_snapshot": diff, "ok": not diff})
with open(f"{H}/applied/readback-2026-10-14-v49.jsonl", "w") as f:
    for x in rows: f.write(json.dumps(x, ensure_ascii=False) + "\n")
for x in rows: print(x["case"], x["op"], "OK" if x["ok"] else "PROBLEM", {k: v for k, v in x.items() if k in ("marker", "custom_atmstatus", "custom_automation_type", "section_id", "differs_from_snapshot", "other_fields_changed", "build_stamp_kept", "v49_quote_present", "v48_quote_absent")})
