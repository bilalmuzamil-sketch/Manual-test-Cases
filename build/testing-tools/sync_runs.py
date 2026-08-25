#!/usr/bin/env python3
"""Keep each suite's full-suite test run in sync with its cases (Rule 34, UNION-ONLY).

Use this AFTER new cases are added to a suite (post source-verification) and imported
into TestRail, so the new cases are appended to the related run automatically.

For each run it sets case_ids = UNION(cases currently in the run) ∪ (all cases in the
suite's TestRail section subtree). Union-only: it NEVER sends a partial list, so no
existing test or its results is ever deleted (Rule 34). New cases in the subtree are
added; nothing is dropped.

Read-only creds come from /tmp/shopview-creds.env (Rule 82 — never committed).
Runs/groups are configured in testrail_runs.json (no secrets).

Usage:
  python3 build/testing-tools/sync_runs.py            # dry-run: show what WOULD change
  python3 build/testing-tools/sync_runs.py --apply    # perform update_run (a TestRail write)
  python3 build/testing-tools/sync_runs.py --apply --only inline-add-edit-parts

A TestRail WRITE (update_run) requires the QA lead's explicit go-ahead each time (Rule 6);
--apply is intentionally separate from the default dry-run so a sync is never silent.
"""
import urllib.request, json, base64, ssl, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
CFG = json.load(open(os.path.join(HERE, "testrail_runs.json")))
CREDS_PATH = "/tmp/shopview-creds.env"

def creds():
    d = {}
    for line in open(CREDS_PATH):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1); d[k] = v
    return d["CLAUDE_USERNAME"], d["TESTRAIL_API_KEY"]

EMAIL, KEY = creds()
BASE = CFG["base_url"] + "/index.php?/api/v2/"
CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")

def _req(path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    method = "POST" if body is not None else "GET"
    req = urllib.request.Request(BASE + path, data=data, method=method)
    req.add_header("Authorization", "Basic " + base64.b64encode(f"{EMAIL}:{KEY}".encode()).decode())
    if body is not None: req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, context=CTX, timeout=120) as r:
        return json.loads(r.read().decode())

def all_sections():
    secs = []; off = 0
    while True:
        r = _req(f"get_sections/{CFG['project_id']}&suite_id={CFG['suite_id']}&limit=250&offset={off}")
        b = r["sections"] if isinstance(r, dict) and "sections" in r else r
        secs += b
        if len(b) < 250: break
        off += 250
    return secs

def subtree(sections, root):
    kids = {}
    for s in sections: kids.setdefault(s.get("parent_id"), []).append(s["id"])
    out = set([root]); stack = [root]
    while stack:
        n = stack.pop()
        for c in kids.get(n, []):
            if c not in out: out.add(c); stack.append(c)
    return out

def all_cases():
    cases = []; off = 0
    while True:
        r = _req(f"get_cases/{CFG['project_id']}&suite_id={CFG['suite_id']}&limit=250&offset={off}")
        b = r["cases"] if isinstance(r, dict) and "cases" in r else r
        cases += b
        if len(b) < 250: break
        off += 250
    return cases

def suite_case_ids(sections, group_id, cases):
    st = subtree(sections, group_id)
    return set(c["id"] for c in cases if c["section_id"] in st)

def run_case_ids(run_id):
    ids = []; off = 0
    while True:
        r = _req(f"get_tests/{run_id}&limit=250&offset={off}")
        b = r["tests"] if isinstance(r, dict) and "tests" in r else r
        ids += [t["case_id"] for t in b]
        if len(b) < 250: break
        off += 250
    return set(ids)

def main():
    apply = "--apply" in sys.argv
    only = None
    if "--only" in sys.argv: only = sys.argv[sys.argv.index("--only") + 1]
    sections = all_sections()
    cases = all_cases()
    for slug, info in CFG["runs"].items():
        if only and slug != only: continue
        in_run = run_case_ids(info["run_id"])
        in_suite = suite_case_ids(sections, info["group_id"], cases)
        union = in_run | in_suite
        added = sorted(in_suite - in_run)
        print(f"{info['name']} (R{info['run_id']}): run has {len(in_run)}, suite has {len(in_suite)}, "
              f"new to add {len(added)} -> union {len(union)}")
        if added: print("   adding case ids:", added)
        if apply and union != in_run:
            _req(f"update_run/{info['run_id']}", {"include_all": False, "case_ids": sorted(union)})
            print(f"   APPLIED update_run/{info['run_id']} -> {len(union)} cases (union-only, nothing dropped)")
        elif apply:
            print("   no change needed")
    if not apply:
        print("\nDRY-RUN only. Re-run with --apply to write (requires QA-lead go-ahead, Rule 6).")

if __name__ == "__main__":
    main()
