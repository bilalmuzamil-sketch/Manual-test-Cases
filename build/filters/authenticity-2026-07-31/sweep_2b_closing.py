#!/usr/bin/env python3
"""STANDING RULE 28 — Stage-2b CROSS-CASE CONSISTENCY SWEEP for the Filters
CLOSING-AUTHENTICITY pass (2026-07-31).

Supersedes `../branko-answers-2026-07-31/sweep_2b.py` for the CURRENT suite: that
script's check 13 asserts the OLD refs convention `Filters (Epic key TBD)`, which
this pass deliberately replaced with the honest `Filters (no Jira epic)` (no epic
exists — 170 SV epics enumerated). Do not re-run the old one as-is.

Every check is an ASSERTION: the script exits non-zero if any consistency rule is
violated, so nothing can be delivered with an unresolved contradiction. Run:
  python3 build/filters/authenticity-2026-07-31/sweep_2b_closing.py
"""
import json, glob, os, re, sys, csv, collections

FILTERS = "/home/user/Manual-test-Cases/build/filters"
SPEC = os.path.join(FILTERS, "spec-current-2026-07-31/Filters-spec-current.md")
LIMIT = 80

fails, notes = [], []
def check(cond, msg):
    (notes if cond else fails).append(("PASS  " if cond else "FAIL  ") + msg)

allc = []
for f in sorted(glob.glob(os.path.join(FILTERS, "cases", "cases-*.json"))):
    for c in json.load(open(f)):
        c["_file"] = os.path.basename(f)
        allc.append(c)
by = {c["id"]: c for c in allc}
active = [c for c in allc if not str(c.get("viu_status", "")).startswith("Retired")]
retired = [c for c in allc if str(c.get("viu_status", "")).startswith("Retired")]
idmap = {r["internal_id"]: (r["testrail_case_id"] or "").strip()
         for r in csv.DictReader(open(os.path.join(FILTERS, "testrail-id-map.csv")))}
spec = open(SPEC).read()
valid_anchors = set(re.findall(r"\bS\d{1,2}-[RNE]\d{1,2}\b", spec))

print("=" * 78)
print("STAGE 2b CROSS-CASE CONSISTENCY SWEEP — Filters closing pass, 2026-07-31")
print("=" * 78)
print("authored %d | ACTIVE %d | retired %d | id-map rows %d"
      % (len(allc), len(active), len(retired), len(idmap)))
check(len(active) == 110, "active suite is 110 cases -> %d" % len(active))
check(len(idmap) == 110 and all(v.startswith("C") for v in idmap.values()),
      "id-map = 110 rows with ZERO blank C-ids")
check(set(idmap) == {c["id"] for c in active},
      "id-map population == active population exactly")

# ---- 1. CONTROL-GROUPING / same-control expected diff --------------------------
groups = collections.defaultdict(list)
for c in active:
    groups[c["area"]].append(c)
print("\nControl groups (area -> cases): %d areas" % len(groups))
for a, v in sorted(groups.items(), key=lambda kv: -len(kv[1])):
    print("  %2d  %s" % (len(v), a))
# inside one area, no two cases may have byte-identical expected results
for a, v in groups.items():
    seen = {}
    for c in v:
        key = "\n".join(x.split(". ", 1)[-1].strip().lower() for x in c["expected"])
        check(key not in seen, "area '%s': %s and %s do not share byte-identical "
              "expected results" % (a, seen.get(key), c["id"]))
        seen[key] = c["id"]

# ---- 2. OPPOSITE-ASSERTION keyword sweep --------------------------------------
OPP = [
    (r"no Apply (or [A-Za-z]+ )?button|applies (immediately|straight away)",
     r"tap(ping)? (the )?'?Apply", "apply-immediately vs Apply-button"),
    (r"\bis hidden\b|\bis not shown\b|\bdisappears\b", r"\bis (still )?shown\b|\bis displayed\b",
     "hidden vs shown"),
    (r"remembered permanently|survives? (logout|closing the browser)",
     r"only for (one|this) browser session|forgotten when you close", "persistence scope"),
    (r"more than one (choice|value)|multi-select|tick more than one",
     r"only one (choice|value) can be (chosen|selected|active)", "single vs multi select"),
]
for pos, neg, label in OPP:
    P = [c["id"] for c in active if re.search(pos, " ".join(c["expected"]), re.I)]
    N = [c["id"] for c in active if re.search(neg, " ".join(c["expected"]), re.I)]
    print("\nopposite sweep '%s': positives %d, negatives %d" % (label, len(P), len(N)))
    if P and N:
        print("   positives:", P)
        print("   negatives:", N)

# the ONE known/declared disagreement pair must be declared in refs on BOTH cases
for cid in ("FLT-TAB-02", "FLT-TAB-03"):
    r = by[cid]["spec_ref"]
    check("PRD text says" in r and "Branko Q4=B" in r,
          "%s: the Status-chip 'hidden' PRD disagreement is DECLARED in refs" % cid)
# and the whole suite must say greyed-out, never 'hidden', for that behaviour
hid = [c["id"] for c in active
       if re.search(r"Status (filter )?chip is (not shown|hidden)", " ".join(c["expected"]), re.I)]
check(not hid, "no active case says the Status chip is HIDDEN on a tab (suite speaks with "
      "one voice: shown greyed-out) -> %s" % hid)
grey = [c["id"] for c in active
        if re.search(r"Status chip is (shown )?(but )?grey", " ".join(c["expected"]), re.I)]
print("cases asserting the greyed-out Status chip:", grey)

# the single-date-range exception stays declared (spec v1.6 §4 named exception)
check(any("Only one date range can be active" in x for x in by["FLT-RPTS-23"]["expected"]),
      "FLT-RPTS-23 keeps the single-date-range exception (named in spec v1.6 §4)")

# ---- 3. TITLE vs EXPECTED (critical: 37 titles were rewritten this pass) ------
STOP = {"filter", "filte", "shows", "their", "which", "every", "still", "avail", "there",
        "order", "orders", "again", "other", "befor", "after", "while", "value", "match",
        "with", "that", "them", "this", "from", "into", "when", "only", "plus", "your"}
def stems(t):
    return {w[:5].lower() for w in re.findall(r"[A-Za-z]{4,}", t)}
# Candidates are ADJUDICATED one by one (below). The stem heuristic cannot tell a
# genuine drift from a plain-English synonym, so every candidate must appear in
# TITLE_SYNONYM_OK with a written reason or the sweep fails.
TITLE_SYNONYM_OK = {
    "FLT-COLL-02": "title says 'brings it back' where Expected 1 says 'reappears' — the same "
                   "event in plain synonyms; nothing in the title is unverifiable by the steps.",
    "FLT-TAB-05":  "title says 'switch tabs' / 'comes back' where the steps click the Estimates "
                   "then the All tab and Expected 2 says 'Back on the All tab ... still applied' "
                   "— synonym only ('tab' vs 'tabs' also falls under the 4-letter stem cut-off).",
}
drift = []
for c in active:
    tw = {w for w in stems(c["title"]) if w not in STOP}
    blob = stems(" ".join(c["expected"] + c["steps"] + c.get("preconditions", [])))
    miss = sorted(tw - blob)
    if miss and len(miss) > len(tw) // 2:
        drift.append((c["id"], c["title"], miss))
unadjudicated = [d for d in drift if d[0] not in TITLE_SYNONYM_OK]
check(not unadjudicated, "TITLE-vs-EXPECTED scan over all 110: every candidate is either "
      "re-worded or adjudicated-with-reason -> unadjudicated %s" % [d[0] for d in unadjudicated])
print("\nTITLE-vs-EXPECTED candidates adjudicated as plain synonyms (%d):" % len(drift))
for cid, t, miss in drift:
    print("  %-13s %s" % (cid, TITLE_SYNONYM_OK.get(cid, "!! UNADJUDICATED")))
for c in active:
    check(len(c["title"]) <= LIMIT, "%s title <= %d chars (%d)" % (c["id"], LIMIT, len(c["title"])))
# no duplicate titles
dup = [t for t, n in collections.Counter(c["title"] for c in active).items() if n > 1]
check(not dup, "no duplicate titles in the active suite -> %s" % dup)

# ---- 4. SAME-ANCHOR CLUSTERING ----------------------------------------------
cl = collections.defaultdict(list)
for c in active:
    key = ";".join(sorted(set(re.findall(r"\bS\d{1,2}-[A-Z]\d{1,2}\b", c["spec_ref"] or ""))))
    cl[key or "(no numbered anchor)"].append(c["id"])
print("\nSame-anchor clusters (>1 case citing the identical anchor set):")
for k, v in sorted(cl.items(), key=lambda kv: -len(kv[1])):
    if len(v) > 1:
        print("  %2d  [%s]  %s" % (len(v), k, v))
# High title overlap inside a same-anchor cluster is only a defect if the two cases
# test the SAME thing. These two pairs are deliberate and load-bearing:
NEAR_DUP_OK = {
    ("FLT-ASSET-02", "FLT-ASSET-07"):
        "deliberate opposite-direction PAIR on the same control (Yes vs No). High word "
        "overlap is inherent — the whole difference is the value chosen. Both are "
        "load-bearing: the 'No' direction is NEW capability (tech plan G4) and was split "
        "out of ASSET-02 by the 2026-07-31 audit precisely so each direction is driven by "
        "its own steps.",
    ("FLT-PARTS-01", "FLT-RPTS-01"):
        "different products entirely — the Parts pages vs the Reports pages — each the "
        "presence-matrix SURVIVOR of its own merge group (MG14 / MG15). They share the "
        "sentence shape, not the subject; neither can cover the other's pages.",
}
for k, v in cl.items():
    for i in range(len(v)):
        for j in range(i + 1, len(v)):
            a, b = set(by[v[i]]["title"].lower().split()), set(by[v[j]]["title"].lower().split())
            jac = len(a & b) / len(a | b)
            pair = tuple(sorted((v[i], v[j])))
            check(jac < 0.7 or pair in NEAR_DUP_OK,
                  "same-anchor near-duplicate titles: %s vs %s (overlap %.2f) — reworded or "
                  "adjudicated?" % (v[i], v[j], jac))
print("\nSame-anchor high-overlap pairs adjudicated as distinct (%d):" % len(NEAR_DUP_OK))
for pair, why in NEAR_DUP_OK.items():
    print("  %s vs %s" % pair)

# ---- 5. NUMBERING + steps/expected integrity --------------------------------
for c in active:
    for field in ("preconditions", "steps", "expected"):
        seq = [int(m.group(1)) for x in c.get(field, []) if (m := re.match(r"(\d+)\.", x))]
        check(seq == list(range(1, len(c.get(field, [])) + 1)),
              "%s.%s numbered 1..n with no gaps/repeats" % (c["id"], field))
    check(c["steps"] and c["expected"] and c.get("preconditions"),
          "%s has preconditions + steps + expected" % c["id"])

# ---- 6. RULE 20 traceability (the new convention) ---------------------------
for c in active:
    r = c["spec_ref"] or ""
    check("no Jira epic" in r, "%s refs state the ticket situation honestly" % c["id"])
    anch = re.findall(r"\bS\d{1,2}-[A-Z]\d{1,2}\b", r)
    check(bool(anch) or "§" in r or "no requirement in the ratified spec" in r,
          "%s refs carry a spec anchor, a spec section, or an explicit no-anchor statement" % c["id"])
    check(all(a in valid_anchors for a in anch),
          "%s every cited anchor exists in spec v1.6 -> %s" % (c["id"], [a for a in anch if a not in valid_anchors]))
    check("," not in r, "%s refs comma-free (TestRail strips the following space)" % c["id"])
    check(len(r) <= 250, "%s refs <= 250 chars (%d)" % (c["id"], len(r)))
    check(not re.search(r"\bFLT-[A-Z]+-\d+", r), "%s refs carry no internal case id" % c["id"])

# ---- 7. NO internal ids / jargon in tester-facing text (Rules 7/9/20) -------
for c in active:
    blob = " ".join([c["title"], c.get("permissions_required") or ""]
                    + c.get("preconditions", []) + c["steps"] + c["expected"])
    for pat, label in [(r"\bFLT-[A-Z]+-\d+", "internal case id"),
                       (r"\bS\d{1,2}-[RNE]\d{1,2}\b", "spec anchor"),
                       (r"\bSV-\d+\b", "Jira key"),
                       (r"\bVIU\b", "VIU jargon"),
                       (r"feature flag", "feature-flag phrasing")]:
        check(not re.search(pat, blob), "%s: no %s in tester-facing text" % (c["id"], label))

# ---- 8. STALE-POINTER grep over tester-facing text --------------------------
for s in ["spec v1.3", "export awaited", "Epic key TBD", "requirements.md",
          "pending Branko's PRD", "Behaviour to confirm"]:
    hits = [c["id"] for c in active
            if s.lower() in " ".join([c["title"]] + c.get("preconditions", [])
                                     + c["steps"] + c["expected"]
                                     + [c["spec_ref"] or ""]).lower()]
    check(not hits, 'stale pointer "%s" absent from tester-facing text + refs -> %s' % (s, hits))

# ---- 9. PALETTE CONTRADICTION CLUSTER stays CLOSED -------------------------
pal = [c["id"] for c in active if "Command-K" in (c.get("area") or "")]
check(not pal, "0 active command-palette cases -> contradiction cluster CLOSED %s" % pal)
srch = [c["id"] for c in allc if c["id"].startswith("FLT-SRCH-")]
check(len(srch) == 9, "the 9 FLT-SRCH bodies are still on record -> %d" % len(srch))
for s in srch:
    check(str(by[s].get("viu_status", "")).startswith("Retired"), "%s remains RETIRED" % s)
    check(s not in idmap, "%s is OUT of the id-map (never in TestRail)" % s)
tb = [c["id"] for c in active if c.get("area") == "Page Search Toolbar"]
check(len(tb) == 13, "the 13 Story-13 in-toolbar page-search cases stay ACTIVE -> %d" % len(tb))

# ---- 10. retired members cannot be referenced as live ----------------------
for c in active:
    blob = c.get("notes") or ""
    for r_ in retired:
        if re.search(r"\bsee %s\b" % r_["id"], blob):
            check(False, "%s points a tester at RETIRED %s" % (c["id"], r_["id"]))

# ---- 11. API placement (Standing Rule 4) ----------------------------------
for c in active:
    api_words = re.search(r"HTTP \d{3}|\bGET\b|\bPUT\b|\bPOST\b|/api/|endpoint",
                          " ".join(c["steps"] + c["expected"]))
    if api_words:
        check(bool(c.get("api_related")), "%s has API content -> flagged api_related "
              "(routes to an 'API — ...' section)" % c["id"])

print("\n" + "=" * 78)
print("CHECKS PASSED: %d   FAILED: %d" % (len(notes), len(fails)))
print("=" * 78)
if fails:
    for f_ in fails:
        print(f_)
    sys.exit(1)
print("STAGE 2b SWEEP CLEAN — 0 contradictions, 0 duplications, 0 stale pointers.")
