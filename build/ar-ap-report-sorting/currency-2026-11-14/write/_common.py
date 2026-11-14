"""Shared by the 14 Nov 2026 write scripts (PRD version 13 currency pass). Dry run by default; --apply writes. Mirrors currency-2026-11-10/write/.
Credentials come from /tmp/testrail/creds.json via trlib and are never printed. Every script runs the tester-readiness check first (Rule 138) and
logs operation, C-id, HTTP status and read-back for every call (Rule 50). No script moves a case: every case stays in its current live folder."""
import sys, os, json, csv
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-14"
sys.path.insert(0, "/home/user/Manual-test-Cases/build/testing-tools")
sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply")
sys.path.insert(0, f"{B}/authoring")
APPLY = "--apply" in sys.argv
PROP = json.load(open(f"{B}/authoring/proposals.json"))                       # the library (build.py, 0 PROBLEM lines)
MERGED = json.load(open(f"{W}/proposals-v13-on-live-writable.json"))           # v13 bodies built on the live text (merge_on_live.py)
HELD = json.load(open(f"{W}/held-out-of-write.json"))                          # not written, with the reason
SNAP14 = {c["id"]: c for c in json.load(open(f"{W}/live-before/live-2026-11-14.json"))["cases"]}   # live as read 14 Nov 2026
DEMO = {f"D-{n}" for n in range(82, 96)}                                       # being written by their own script: never touched here
FIELDS = ["title", "custom_preconds", "custom_steps", "custom_expected", "refs"]
OUT = f"{W}/applied"; os.makedirs(OUT, exist_ok=True)
def ids(): return {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
def last_written(cid):
    """Our last written body: the read-back of our last write (10 Nov 2026), or None."""
    p = f"{B}/currency-2026-11-10/applied/C{cid}-after.json"
    return json.load(open(p)) if os.path.exists(p) else None
def norm(field, v): v = v or ""; return v.replace(" ", "") if field == "refs" else v
def same(field, a, b): return norm(field, a) == norm(field, b)
def readiness():
    import tester_readiness_check as T
    T.require(B, also=[f"{W}/proposals-v13-on-live-writable.json"])
def log(name): return open(f"{OUT}/{name}", "a")
def link(cid): return f"https://shopview.testrail.io/index.php?/cases/view/{cid}"
