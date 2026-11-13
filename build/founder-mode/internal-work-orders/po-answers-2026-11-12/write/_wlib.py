"""Shared helpers for the write scripts (Internal Work Orders; round 3 12 Nov 2026, reused for round 4 13 Nov 2026; the lock is still the live body in proposals-before-v1.1.json). DRY RUN unless --apply. Reads use the TestRail API with
/tmp/testrail/creds.json (never printed). Every write is read back and logged to log-<script>.jsonl beside these scripts."""
import json, os, sys, csv, time
W = os.path.dirname(os.path.abspath(__file__)); A = os.path.dirname(W); P = os.path.dirname(A); AU = f"{P}/authoring"
sys.path.insert(0, f"{P}/../../dashboards/currency-2026-10-14/apply")
APPLY = "--apply" in sys.argv
LIVE = APPLY or "--check-live" in sys.argv          # a dry run reads live only when asked (reads are allowed; writes need the QA lead's go-ahead)
PLAN = json.load(open(f"{W}/plan.json")); NOW = json.load(open(f"{AU}/proposals.json")); BEFORE = json.load(open(f"{W}/proposals-before-v1.1.json"))
SECS = json.load(open(f"{P}/sections.json"))["sections"]; SUITE = 1; RUN = 559
FIELDS = ["title", "custom_preconds", "custom_steps", "custom_expected"]
def mapping(): return {r["key"]: r for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
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
def live_cases(api):
    """Every live case in the subsections of section 136701, by id, read in pages of 250 (get_cases with section_id), for the lock check."""
    out = {}
    for s in SECS.values():
        if not s.get("id"): continue
        off = 0
        while True:
            r = api(f"get_cases/1&section_id={s['id']}&limit=250&offset={off}"); cs = r["cases"] if isinstance(r, dict) else r
            for c in cs: out[str(c["id"])] = c
            if len(cs) < 250: break
            off += 250
    return out
