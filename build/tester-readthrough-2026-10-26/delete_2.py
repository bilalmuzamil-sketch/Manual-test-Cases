#!/usr/bin/env python3
"""(delete_2.py) 26 Oct 2026, QA lead: "1. Do it" to deleting Credit terms S12-18 and D-38, the same kind as the 15 below.
Copied from delete_15.py: — the 15 cases a manual tester cannot set up (4 Splitting Sales Representatives,
1 A/R and A/P, 10 Credit terms). Safety checks first, for every case, and nothing is deleted unless all 15 pass:
created by us (user 3), not flagged Automated, unchanged since our last read-back (edit lock), no result recorded in any of our runs.
Then: full snapshot, delete_case, get_case must answer 400, removed map rows kept, requirement codes the case quoted recorded so the
coverage records can say which requirements are now left to the developers' own checks. python3 delete_15.py [--apply]"""
import sys, os, json, csv, re, base64, urllib.request, urllib.error, datetime
D = os.path.dirname(os.path.abspath(__file__)); B = os.path.dirname(D)
sys.path.insert(0, f"{B}/dashboards/currency-2026-10-14/apply"); from trlib import api
WHY = ("QA lead 26 Oct 2026: '1. Do it' (delete S12-18 and D-38, as the 15 deleted earlier that day: '2. Delete these test cases') (the cases a manual tester cannot set up: a staff record that no longer "
       "exists or sits in another organization, more rows than any test site holds, a refusal only a request sent outside the screen "
       "reaches, or a loading or failure state a tester cannot produce)")
DEL = {"credit-terms": {"S12-18": 724125, "D-38": 724185}}
RUN = {"credit-terms": 551}
OUT = f"{D}/deleted"; os.makedirs(OUT, exist_ok=True)
def tests(rid):
    got, off = [], 0
    while True:
        t = api(f"get_tests/{rid}&limit=250&offset={off}"); t = t["tests"] if isinstance(t, dict) else t; got += t
        if len(t) < 250: return got
        off += 250
problems, plan = [], []
for s, keys in DEL.items():
    ids = {r["key"]: r for r in csv.DictReader(open(f"{B}/{s}/testrail-id-map.csv"))}
    run = {t["case_id"]: t for t in tests(RUN[s])}
    for k, cid in keys.items():
        if ids.get(k, {}).get("case_id") != str(cid): problems.append(f"{s} {k}: map says {ids.get(k)} not C{cid}"); continue
        prev = json.load(open(f"{B}/{s}/applied/C{cid}-after.json")); live = api(f"get_case/{cid}")
        if live["updated_on"] != prev["updated_on"]: problems.append(f"C{cid}: changed since our read-back")
        if live.get("created_by") != 3: problems.append(f"C{cid}: created by user {live.get('created_by')}, not us")
        if live.get("custom_atmstatus") not in (1, None): problems.append(f"C{cid}: Automated flag {live.get('custom_atmstatus')}")
        t = run.get(cid); res = api(f"get_results/{t['id']}") if t else []
        res = res.get("results", res) if isinstance(res, dict) else res
        if res: problems.append(f"C{cid}: {len(res)} result(s) recorded in run {RUN[s]}")
        codes = sorted(set(re.findall(r"\b(?:S\d+-[RN]\d+[a-z]?|[A-Z]{1,3}-\d+[a-z]?)\b", live.get("refs") or "")))
        plan.append((s, k, cid, live, ids[k], bool(t), codes))
print(f"checked {len(plan)} cases | problems: {len(problems)}"); [print("  ", p) for p in problems]
for s, k, cid, live, _, inrun, codes in plan: print(f"  {s} {k} C{cid} in run: {inrun} | {live['title'][:70]}")
if "--apply" not in sys.argv or problems or len(plan) != 2: sys.exit(0)
c = json.load(open("/tmp/testrail/creds.json")); auth = base64.b64encode(f"{c.get('email') or c.get('user')}:{c['password']}".encode()).decode()
def raw(ep, post):
    r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{ep}", data=(b"{}" if post else None),
                               headers={"Authorization": f"Basic {auth}", "Content-Type": "application/json"})
    try: x = urllib.request.urlopen(r, timeout=120); return x.status, x.read().decode()
    except urllib.error.HTTPError as e: return e.code, e.read().decode()
before = {s: len(tests(r)) for s, r in RUN.items()}
log = open(f"{OUT}/delete-log.jsonl", "a"); removed = []
for s, k, cid, live, row, inrun, codes in plan:
    json.dump(live, open(f"{OUT}/C{cid}-{s}-{k}-snapshot.json", "w"), indent=1, ensure_ascii=False)
    st, _ = raw(f"delete_case/{cid}", True); gst, gbody = raw(f"get_case/{cid}", False)
    log.write(json.dumps({"op": "delete_case", "suite": s, "key": k, "case": f"C{cid}", "title": live["title"], "http": st,
                          "gone_on_readback": gst == 400, "readback_http": gst, "was_in_run": inrun, "refs": live.get("refs"),
                          "why": WHY, "at": datetime.datetime.utcnow().isoformat() + "Z"}, ensure_ascii=False) + "\n"); log.flush()
    removed.append((s, row))
for s in DEL:
    p = f"{B}/{s}/testrail-id-map.csv"; rows = list(csv.DictReader(open(p))); gone = {str(v) for v in DEL[s].values()}
    with open(f"{OUT}/{s}-map-rows-removed-2.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=rows[0].keys()); w.writeheader(); w.writerows(r for r in rows if r["case_id"] in gone)
    with open(p, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=rows[0].keys()); w.writeheader(); w.writerows(r for r in rows if r["case_id"] not in gone)
after = {s: len(tests(r)) for s, r in RUN.items()}
json.dump({"runs_before": before, "runs_after": after}, open(f"{OUT}/runs-before-after-2.json", "w"), indent=1)
print("runs before", before, "after", after)
