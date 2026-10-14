"""Independent read-back of the reference tidy: a fresh, fully paged census of group 12166 (all 15 sections).
(1) each of the 58 written cases: every field equals the start snapshot with the payload applied, except updated_on,
    updated_by (must be 3) and version (start +1); marker unique and last; no Source field still names v42 or a removed board.
(2) every other case in the group (Nebojsa's, Vladimir's, the 25 written earlier today): byte-identical to the start
    snapshot, updated_on included. Writes applied/readback-tidy-2026-10-14.jsonl."""
import json, glob, re, sys, subprocess
H = "build/dashboards/currency-2026-10-14/apply-tidy"
subprocess.run([sys.executable, f"{H}/census.py", f"{H}/snap-after"], check=True)
S = {json.load(open(f))["id"]: json.load(open(f)) for f in glob.glob(f"{H}/snap-start/C*.json")}
A = {json.load(open(f))["id"]: json.load(open(f)) for f in glob.glob(f"{H}/snap-after/C*.json")}
P = {p["case_id"]: p for p in json.load(open(f"{H}/proposals-tidy.json"))}
rows = []
def mk(e):
    l = [x for x in re.sub(r"<[^>]+>", "\n", e).split("\n") if x.strip()]; return sum(x.startswith("AUTOMATION:") for x in l) == 1 and l[-1].startswith("AUTOMATION:")
for cid in sorted(set(S) | set(A)):
    s, a = S.get(cid), A.get(cid)
    if s is None or a is None: rows.append({"op": "census", "case": f"C{cid}", "ok": False, "why": "missing in one census"}); continue
    if cid in P:
        want = dict(s, **P[cid]["payload"])
        diff = sorted(k for k in set(want) | set(a) if k not in ("updated_on", "updated_by", "version") and a.get(k) != want.get(k))
        stale = [w for w in ("v42", "read 7 Oct 2026, S", "15_Empty_Design", "15_Empty_Now", "before-empty", "remembers your choice") if w in a["custom_expected"] + a["custom_preconds"]]
        ok = not diff and a["updated_by"] == 3 and a["version"] == s["version"] + 1 and mk(a["custom_expected"]) and not stale
        rows.append({"op": "readback_written", "case": f"C{cid}", "http": 200, "fields_differing_from_intended": diff, "updated_by": a["updated_by"],
                     "version": [s["version"], a["version"]], "marker_unique_and_last": mk(a["custom_expected"]), "stale_refs": stale,
                     "atmstatus": a["custom_atmstatus"], "automation_type": a.get("custom_automation_type"), "ok": ok})
    else:
        diff = sorted(k for k in set(s) | set(a) if a.get(k) != s.get(k))
        rows.append({"op": "untouched_check", "case": f"C{cid}", "created_by": s["created_by"], "updated_by": a.get("updated_by"), "differs": diff, "ok": not diff})
open(f"{H}/applied/readback-tidy-2026-10-14.jsonl", "w").write("".join(json.dumps(r) + "\n" for r in rows))
w = [r for r in rows if r["op"] == "readback_written"]; u = [r for r in rows if r["op"] == "untouched_check"]
from collections import Counter
print("written ok", sum(r["ok"] for r in w), "/", len(w), "| untouched identical", sum(r["ok"] for r in u), "/", len(u), "by updated_by", Counter(r["updated_by"] for r in u))
for r in rows:
    if not r["ok"]: print("PROBLEM", r)
