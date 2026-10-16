#!/usr/bin/env python3
"""TestRail writes for the 21 two-audience cases (QA lead, 16 Oct 2026). One writer; every write logged with HTTP status and read back.
  --add-new            add the 4 new cases (fields from payloads.json rendered with a temporary link) → applied/new-ids.json
  --update             update the 17 existing cases (edit lock: unchanged since live-17-before.json) and the 4 new (link) from payloads.json
  --run                union-only sync of run 498, then a Retest result for each existing case whose expected results changed
  --readback           fresh GET of all 21, field-by-field against payloads.json; run 498 membership; writes applied/readback.json"""
import sys, os, json, base64, urllib.request, urllib.error, time
D = os.path.dirname(os.path.abspath(__file__)); AP = f"{D}/applied"; os.makedirs(AP, exist_ok=True)
C = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
NEW_FIELDS = {"type_id": 7, "priority_id": 2, "custom_automation_type": 2, "custom_atmstatus": 1}
FIELDS = ("title", "custom_preconds", "custom_steps", "custom_expected", "refs")
def api(ep, data=None):
    r = urllib.request.Request("https://shopview.testrail.io/index.php?/api/v2/" + ep, data=json.dumps(data).encode() if data is not None else None,
                               headers={"Authorization": "Basic " + AUTH, "Content-Type": "application/json"})
    for a in range(4):
        try:
            resp = urllib.request.urlopen(r, timeout=120); return resp.status, json.load(resp)
        except urllib.error.HTTPError as e:
            if e.code < 500 or a == 3: raise SystemExit(f"HTTP {e.code} on {ep}: {e.read()[:300]}")
        time.sleep(2 * (a + 1))
log = open(f"{AP}/apply-log.jsonl", "a")
def L(**k): log.write(json.dumps(k) + "\n"); log.flush(); print(k)
pay = json.load(open(f"{D}/payloads.json"))
NEWIDS = f"{AP}/new-ids.json"; new = json.load(open(NEWIDS)) if os.path.exists(NEWIDS) else {}
def fields(p): return {f: p[f] for f in FIELDS if f != "refs" or p.get("refs")}

if "--add-new" in sys.argv:
    for k, p in pay.items():
        if k.startswith("C") or k in new: continue
        st, r = api(f"add_case/{p['section_id']}", dict(fields(p), **NEW_FIELDS)); st2, a = api(f"get_case/{r['id']}")
        new[k] = r["id"]; json.dump(new, open(NEWIDS, "w"), indent=1)
        json.dump(a, open(f"{AP}/C{r['id']}-added.json", "w"), indent=1)
        L(op="add_case", key=k, case=f"C{r['id']}", http=st, section=a["section_id"], ok=all((a.get(f) or None) == (v or None) for f, v in fields(p).items()))

if "--update" in sys.argv:
    before = {c["id"]: c for c in json.load(open(f"{D}/../two-audience/live-17-before.json"))}
    LOCK = ("updated_on", "title", "custom_preconds", "custom_steps", "custom_expected", "custom_atmstatus", "section_id", "refs")
    for k, p in pay.items():
        cid = int(k[1:]) if k.startswith("C") else new[k]
        st, c = api(f"get_case/{cid}")
        if k.startswith("C"):
            diff = [x for x in LOCK if c.get(x) != before[cid].get(x)]
            if c["created_by"] != 3 or diff: L(op="refused_edit_lock", case=k, why=f"changed since snapshot: {diff}"); continue
        else:
            b = json.load(open(f"{AP}/C{cid}-added.json"))
            if c["updated_on"] != b["updated_on"]: L(op="refused_edit_lock", case=f"C{cid}", why="changed since added"); continue
        json.dump(c, open(f"{AP}/C{cid}-before.json", "w"), indent=1)
        st, _ = api(f"update_case/{cid}", fields(p)); st2, a = api(f"get_case/{cid}")
        json.dump(a, open(f"{AP}/C{cid}-after.json", "w"), indent=1)
        untouched = [x for x in c if x not in FIELDS and x not in ("updated_on", "updated_by", "version") and a.get(x) != c.get(x)]
        L(op="update_case", case=f"C{cid}", key=k, http=st, written={f: (a.get(f) or None) == (v or None) for f, v in fields(p).items()},
          untouched_changed=untouched, atm=a["custom_atmstatus"])

def tests():
    out, off = [], 0
    while True:
        st, d = api(f"get_tests/498&limit=250&offset={off}"); out += d["tests"]
        if d.get("_links", {}).get("next"): off += 250
        else: return {t["case_id"]: (t["id"], t["status_id"]) for t in out}

if "--run" in sys.argv:
    st, run = api("get_run/498"); assert not run["is_completed"] and not run["include_all"]
    b = tests(); ids = [int(k[1:]) if k.startswith("C") else new[k] for k in pay]
    union = sorted(set(b) | set(ids))
    if union != sorted(b): st, _ = api("update_run/498", {"include_all": False, "case_ids": union}); L(op="update_run", http=st, added=sorted(set(ids) - set(b)))
    a = tests()
    L(op="run_check", before=len(b), after=len(a), dropped=[c for c in b if c not in a], others_changed=[c for c in b if a.get(c) != b[c] and c not in ids])
    rt = [int(k[1:]) for k, p in pay.items() if k.startswith("C") and p["expected_changed"] and a[int(k[1:])][1] in (1, 2, 5)]
    msg = ("Retest: this case was rewritten on 16 Oct 2026 in the new two-audience layout (test case for the tester, setup file for "
           "Claude) and its expected results changed with PRD version 61 (Confluence 845185030). The earlier result was against the old "
           "expected results; please run it again as it now reads.")
    if rt:
        st, r = api("add_results_for_cases/498", {"results": [{"case_id": c, "status_id": 4, "comment": msg} for c in rt]})
        L(op="retest", http=st, cases=[f"C{c}" for c in rt], before={f"C{c}": a[c][1] for c in rt})

if "--readback" in sys.argv:
    t = tests(); rows = []
    for k, p in pay.items():
        cid = int(k[1:]) if k.startswith("C") else new[k]
        st, a = api(f"get_case/{cid}")
        ok = {f: (a.get(f) or None) == (v or None) for f, v in fields(p).items()}
        exp = a["custom_expected"]; last = exp.rstrip().rsplit("<p>", 1)[-1]
        rows.append({"case": f"C{cid}", "key": k, "fields_ok": all(ok.values()), "marker_last": last.startswith("AUTOMATION:") and exp.count("AUTOMATION:") == 1,
                     "in_run": cid in t, "test": t.get(cid, (None,))[0], "status": t.get(cid, (None, None))[1], "atm": a["custom_atmstatus"], "section": a["section_id"]})
    json.dump(rows, open(f"{AP}/readback.json", "w"), indent=1)
    for r in rows: print(r)
    print("ALL OK" if all(r["fields_ok"] and r["marker_last"] and r["in_run"] for r in rows) else "PROBLEMS")
