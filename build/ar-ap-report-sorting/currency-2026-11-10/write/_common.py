"""Shared by the 10 Nov 2026 write scripts (dry run by default; --apply writes). Credentials come from /tmp/testrail/creds.json via trlib and are
never printed. Every script calls the tester-readiness check first (Rule 138) and logs operation, C-id, HTTP status and read-back (Rule 50)."""
import sys, os, json, csv
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-10"
sys.path.insert(0, "/home/user/Manual-test-Cases/build/testing-tools"); sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply")
APPLY = "--apply" in sys.argv
PROP = json.load(open(f"{B}/authoring/proposals.json"))
SNAP = {c["id"]: c for c in json.load(open(f"{W}/live-before/live-cases-2026-11-10.json"))["cases"]}
def ids(): return {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
STAMP = json.load(open(f"{W}/stamp-diff.json"))
OUT = f"{W}/applied"; os.makedirs(OUT, exist_ok=True)
def readiness():
    import tester_readiness_check as T
    T.require(B)
def norm_refs(x): return (x or "").replace(" ", "")
def same(field, a, b): return norm_refs(a) == norm_refs(b) if field == "refs" else (a if a is not None else "") == (b if b is not None else "")
def log(name): return open(f"{OUT}/{name}", "a")
