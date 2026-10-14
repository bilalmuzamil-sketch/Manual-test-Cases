#!/usr/bin/env python3
"""Apply the Dashboard reference tidy (proposals-tidy.json) to TestRail, one case at a time (14 Oct 2026, QA lead "OK").
Edit lock (per case, re-read immediately before writing): created_by 3, live updated_by 3, and EVERY field equal to
snapshots-after-answers (the 13/14 Oct baseline; the start-of-pass snapshot snap-start/ is identical for all 58).
Read-back (Rules 41/50): fresh GET; every written field byte-equal to the payload; every other field byte-identical to
the pre-write GET except updated_on/updated_by; custom_atmstatus / custom_automation_type unchanged; title and steps
unchanged; the AUTOMATION marker unique and last. Any mismatch STOPS the batch.
Log: applied/apply-log.jsonl (op · case · http · verification). Idempotent: a case already in the log as ok is skipped."""
import json, re, sys, os
H = "build/dashboards/currency-2026-10-14/apply-tidy"; BASE = "build/dashboards/currency-2026-10-14/snapshots-after-answers"
sys.path.insert(0, H); from trlib import api, LAST
props = json.load(open(f"{H}/proposals-tidy.json"))
LOG = f"{H}/applied/apply-log.jsonl"; open(LOG, "a").close()
done = {json.loads(l)["case"] for l in open(LOG) if l.strip() and json.loads(l).get("ok") and json.loads(l)["op"] in ("update_case", "unchanged")}
log = open(LOG, "a")
def L(**k): log.write(json.dumps(k, ensure_ascii=False) + "\n"); log.flush(); print({x: k[x] for x in k if x not in ("fields_written",)})
def marker_ok(exp):
    t = re.sub(r"<[^>]+>", "\n", exp); lines = [l for l in t.split("\n") if l.strip()]
    return sum(l.startswith("AUTOMATION:") for l in lines) == 1 and lines[-1].startswith("AUTOMATION:")
only = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None
for p in props:
    cid = p["case_id"]; tag = f"C{cid}"
    if tag in done or (only and tag not in only): continue
    pay = p["payload"]; base = json.load(open(f"{BASE}/C{cid}.json"))
    c = api(f"get_case/{cid}"); st0 = LAST["status"]
    diff = sorted(x for x in set(c) | set(base) if c.get(x) != base.get(x))
    if c["created_by"] != 3 or c.get("updated_by") != 3 or diff:
        L(op="refused_edit_lock", case=tag, http=st0, ok=False, why=f"created_by {c['created_by']} updated_by {c.get('updated_by')}; fields differing from baseline: {diff}"); continue
    if all(c.get(x) == v for x, v in pay.items()):
        L(op="unchanged", case=tag, http=st0, ok=True); continue
    json.dump(c, open(f"{H}/applied/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    api(f"update_case/{cid}", pay); st = LAST["status"]
    a = api(f"get_case/{cid}"); st2 = LAST["status"]
    json.dump(a, open(f"{H}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    written = {x: a.get(x) == v for x, v in pay.items()}
    # declared normalisation: TestRail's own revision counter "version" rises by exactly 1 on every write
    untouched = sorted(x for x in set(c) | set(a) if x not in pay and x not in ("updated_on", "updated_by", "version") and a.get(x) != c.get(x))
    if a.get("version") != (c.get("version") or 0) + 1: untouched.append(f"version {c.get('version')}->{a.get('version')} (expected +1)")
    ok = all(written.values()) and not untouched and a.get("updated_by") == 3 and marker_ok(a["custom_expected"]) \
         and a["custom_atmstatus"] == c["custom_atmstatus"] and a.get("custom_automation_type") == c.get("custom_automation_type")
    L(op="update_case", case=tag, http=st, readback_http=st2, fields_written=written, untouched_changed=untouched,
      atmstatus=[c["custom_atmstatus"], a["custom_atmstatus"]], automation_type=[c.get("custom_automation_type"), a.get("custom_automation_type")],
      marker_unique_and_last=marker_ok(a["custom_expected"]), ok=ok, changes=p["changes"])
    if not ok: sys.exit(f"STOP: read-back mismatch on {tag} (Rule 50) - see {LOG}")
print("done")
