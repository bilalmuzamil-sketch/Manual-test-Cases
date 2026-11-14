"""Shared helpers for the v1.4 named-set write scripts (14 Nov 2026). DRY RUN unless --apply (the QA lead's go-ahead, Rule 6).
--check-live makes a dry run also READ TestRail (GET only). Credentials: /tmp/testrail/creds.json via trlib (never printed). Every
operation is logged with C-id, HTTP status and read-back (Rule 50) to log-<name>.jsonl beside these scripts."""
import json, os, sys, csv, time, re
W = os.path.dirname(os.path.abspath(__file__)); A = os.path.dirname(W); P = os.path.dirname(A); AU = f"{P}/authoring"
sys.path.insert(0, f"{P}/../../dashboards/currency-2026-10-14/apply")
sys.path.insert(0, f"{P}/../../testing-tools")
APPLY = "--apply" in sys.argv
LIVE = APPLY or "--check-live" in sys.argv
PLAN = json.load(open(f"{W}/plan-v14.json")); NOW = json.load(open(f"{AU}/proposals.json"))
SECS = json.load(open(f"{P}/sections.json"))["sections"]; SUITE = 1; RUN = PLAN["run"]
FIELDS = ["title", "custom_preconds", "custom_steps", "custom_expected"]
IMG = f"{P}/design-2026-11-12/images"
def mapping(): return {r["key"]: r for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
def write_map(M):
    with open(f"{P}/testrail-id-map.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["key", "case_id", "section", "title", "link", "prd_version"]); w.writeheader(); w.writerows(M.values())
def tr():
    from trlib import api, LAST
    return api, LAST
def safe(api, ep, data=None):
    try: return api(ep, data), None
    except SystemExit as e: return None, str(e)[:300]
def logger(name):
    f = open(f"{W}/log-{name}.jsonl", "a")
    def L(rec):
        rec = {"at": time.strftime("%Y-%m-%dT%H:%M:%S"), "apply": APPLY, **rec}; f.write(json.dumps(rec, ensure_ascii=False) + "\n"); f.flush()
        return rec
    return L
def same(live, want):
    """Field-by-field equality of a live case and a body we hold (refs compared without spaces)."""
    bad = [k for k in FIELDS if (live.get(k) or "") != (want.get(k) or "")]
    if (live.get("refs") or "").replace(" ", "") != (want.get("refs") or "").replace(" ", ""): bad.append("refs")
    return bad
def attachments(api, cid):
    d = api(f"get_attachments_for_case/{cid}")
    d = d.get("attachments", d) if isinstance(d, dict) else d
    return [{"id": a.get("id"), "name": a.get("name") or a.get("filename")} for a in d]
def tests(api, run):
    """Every test of a run, paged (an unpaged read stops at 250 and a partial case_ids list would delete tests)."""
    out, off = [], 0
    while True:
        t = api(f"get_tests/{run}&limit=250&offset={off}"); t = t["tests"] if isinstance(t, dict) else t; out += t
        if len(t) < 250: return out
        off += 250
def section_cases(api, sid):
    out, off = [], 0
    while True:
        r = api(f"get_cases/{SUITE}&section_id={sid}&limit=250&offset={off}"); c = r["cases"] if isinstance(r, dict) else r; out += c
        if len(c) < 250: return out
        off += 250
def upload(cid, name):
    """add_attachment_to_case (multipart), the request of po-answers-2026-11-12/write/_upload.py."""
    sys.path.insert(0, f"{A}/write")
    from _upload import upload as _u
    return _u(cid, name)
