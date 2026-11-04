"""Applies proposals.json (4 Nov 2026 named sets: A/R and A/P EXPECT FAIL x9, What/Why C154708 release).

DRY RUN by default: runs the tester-readiness check (Rule 138) and reads each case live to show whether its edit lock still holds;
writes nothing. With --apply (only after the QA lead's go-ahead, Rule 6):
  1. tester_readiness_check.require() for each suite folder, with this pass's bodies added through --also (readiness-*.json);
     a failure stops the run before any write.
  2. per case: get_case; SKIP unless live updated_on == the before-copy's updated_on (another session's edit wins; re-base first);
     SKIP if TestRail flags it Automated (custom_atmstatus 3, Rule 71); update_case with only the proposal's fields; get_case again;
     log operation, C-id, HTTP status, whether every written field reads back equal and whether any other field moved.
  Log: applied/apply-log.jsonl; read-backs: applied/C<id>-after.json. Never adds or removes run membership (both runs named in the
  project files, 549 and 553, no longer exist in TestRail on 4 Nov 2026).
Re-run make_proposals.py after any new get_case before-copy; never edit proposals.json by hand."""
import sys, os, json, re, html, datetime
HERE = os.path.dirname(os.path.abspath(__file__)); BUILD = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(BUILD, "dashboards", "currency-2026-10-14", "apply")); sys.path.insert(0, os.path.join(BUILD, "testing-tools"))
from trlib import api, LAST
import tester_readiness_check

APPLY = "--apply" in sys.argv
P = json.load(open(os.path.join(HERE, "proposals.json")))
SUITES = {"ar-ap": os.path.join(BUILD, "ar-ap-report-sorting"), "what-why": os.path.join(BUILD, "founder-mode", "what-why")}
for name, folder in SUITES.items():
    tester_readiness_check.require(folder, also=[os.path.join(HERE, f"readiness-{name}.json")])

n = lambda s: re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()
os.makedirs(os.path.join(HERE, "applied"), exist_ok=True)
log, plan = [], []
for key, v in P.items():
    cid = int(key[1:]); before = json.load(open(os.path.join(HERE, "before", f"{key}.json")))
    live = api(f"get_case/{cid}")
    lock = live["updated_on"] == before["updated_on"]
    automated = live.get("custom_atmstatus") == 3
    plan.append(f"{key} {'LOCK OK' if lock else 'CHANGED SINCE BEFORE-COPY -> SKIP'}{' AUTOMATED -> SKIP' if automated else ''} | set {sorted(v['fields'])} | {v['title'][:70]}")
    if not APPLY: continue
    rec = dict(time=datetime.datetime.utcnow().isoformat(timespec="seconds") + "Z", case=key, suite=v["suite"])
    if not lock or automated:
        rec.update(op="SKIPPED", why="changed since the before-copy" if not lock else "flagged Automated (Rule 71)"); log.append(rec); continue
    api(f"update_case/{cid}", v["fields"]); rec.update(op="update_case", http=LAST["status"])
    back = api(f"get_case/{cid}")
    json.dump(back, open(os.path.join(HERE, "applied", f"{key}-after.json"), "w"), indent=1, ensure_ascii=False)
    rec["fields_equal"] = {f: n(back.get(f)) == n(val) for f, val in v["fields"].items()}
    rec["other_fields_moved"] = [f for f in live if f not in v["fields"] and f not in ("updated_on", "updated_by", "version") and live[f] != back.get(f)]
    rec["ok"] = rec["http"] == 200 and all(rec["fields_equal"].values()) and not rec["other_fields_moved"]
    log.append(rec)

print("\n".join(plan))
if not APPLY:
    print(f"DRY RUN: {len(plan)} cases, nothing written. Re-run with --apply after the QA lead's go-ahead.")
else:
    with open(os.path.join(HERE, "applied", "apply-log.jsonl"), "a") as fh:
        for r in log: fh.write(json.dumps(r) + "\n")
    bad = [r for r in log if not r.get("ok")]
    print(f"APPLIED: {sum(1 for r in log if r.get('ok'))} ok, {len(bad)} not ok or skipped:", json.dumps(bad, indent=1))
    sys.exit(1 if bad else 0)
