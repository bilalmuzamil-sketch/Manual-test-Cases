#!/usr/bin/env python3
"""Re-stamp proof (14 Nov 2026, Story 8 named set). For every case in the library:
  1. every PRD quote it renders is checked word for word against the new copy (sources/CONFLUENCE-1003585538-read-2026-11-14.md);
  2. its list of quotes (label and text) is compared with the same case in the last build before this pass (commit 9f5770bf3).
A case passing 1 is moved to the new version in authoring/prd_moves.json (its From line is re-stamped). A case whose quote list is unchanged
(2) and that is outside the named set is "re-stamp only". Writes restamp-proof.json; prints a summary.
Run twice: once to write prd_moves.json, then build.py, then again to confirm (the second run must report the same sets).
python3 restamp_proof.py"""
import sys, os, re, json, glob, importlib, subprocess, html
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H); D = f"{P}/authoring"
sys.path.insert(0, D); import bt_lib as L
for m in sorted(os.path.basename(f)[:-3] for f in glob.glob(f"{D}/cases_*.py")): importlib.import_module(m)
NEWV = "0.5 (edited 14 Nov 2026)"; _m, _t, NW, NRW = L.PRD_TEXTS[NEWV]
KEEP_OLD = {"S8-09"}                     # proposed for deletion; stays on version 0.5, untouched
REPO = os.path.abspath(f"{P}/../../..")
BASE = "9f5770bf3"   # the last commit whose proposals.json was built before this pass (04:49, 14 Nov 2026; later commits are checkpoints of it)
before = json.loads(subprocess.run(["git", "-C", REPO, "show", f"{BASE}:build/founder-mode/bill-to/authoring/proposals.json"],
                                   capture_output=True, text=True, check=True).stdout)
def qlist(exp):
    q = exp.split("Exact quotes from the source")[1].split("References from Design")[0]
    return [html.unescape(re.sub(r"<[^>]+>", "", x)) for x in re.findall(r"<li>(.*?)</li>", q)]
named = set(json.load(open(f"{H}/named-set.json"))) if os.path.exists(f"{H}/named-set.json") else set()
moves, fails, same, changed, new = [], {}, [], [], []
for c in L.CASES:
    k = c["key"]
    bad = [l for l, t in L.quotes(c) if not l.startswith("Jira") and L.ws(t) not in NW and L.ws(t) not in NRW]
    if bad: fails[k] = bad
    elif k not in KEEP_OLD: moves.append(k)
    if k not in before: new.append(k); continue
    (same if qlist(L.render(c)["custom_expected"]) == qlist(before[k]["fields"]["custom_expected"]) else changed).append(k)
mapped_moves = sorted(k for k in moves if k in L.MAPPED)
json.dump({NEWV: mapped_moves}, open(f"{D}/prd_moves.json", "w"), indent=1)
restamp_only = sorted(k for k in same if k not in named)
json.dump({"moved": mapped_moves, "not_in_new_copy": fails, "quotes_unchanged": sorted(same), "quotes_changed": sorted(changed),
           "new_keys": sorted(new), "restamp_only": restamp_only, "named_set": sorted(named),
           "quotes_unchanged_but_in_named_set": sorted(set(same) & named),
           "quotes_changed_outside_named_set": sorted(set(changed) - named)}, open(f"{H}/restamp-proof.json", "w"), indent=1)
print(f"cases {len(L.CASES)} | moved to {NEWV}: {len(mapped_moves)} mapped (+ {len([k for k in moves if k not in L.MAPPED])} unmapped, current by default)")
print(f"quotes not word for word in the new copy: {fails}")
print(f"quote list unchanged: {len(same)} | changed: {len(changed)} {sorted(changed)} | new keys: {len(new)} {sorted(new)}")
print(f"re-stamp only: {len(restamp_only)} | changed outside the named set (must be 0): {sorted(set(changed) - named)}")
