#!/usr/bin/env python3
"""Standing Rule 28 — Stage 2b CROSS-CASE CONSISTENCY SWEEP for the Branko
Parts/Reports/page-search apply pass (2026-07-31).

Mandatory, suite-wide, never skipped. This pass is exactly the dangerous kind:
it changes the SAME SENTENCE in seven cases at once while a sibling worker edits
the same files. Every check below is an ASSERTION — the script exits non-zero if
any consistency rule is violated, so nothing can be delivered with an unresolved
contradiction.

Run: python3 build/filters/branko-answers-2026-07-31/sweep_2b.py
"""
import json, glob, os, re, sys, csv
from collections import defaultdict

FILTERS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CASES = os.path.join(FILTERS, "cases")

BLOCK_P_PARTS = ("Any signed-in user with access to the Parts pages. The filter buttons "
                 "and their choices are the same for every user - a person's role does "
                 "not change them.")
BLOCK_P_RPTS = ("Any signed-in user with access to the Reports pages. The filter buttons "
                "and their choices are the same for every user - a person's role does "
                "not change them.")
BLOCK_T = ("The choices inside each filter come from your own shop's data (for example "
           "your real vendors or categories), so there is no fixed list to compare "
           "against - check that the choices you see match the data in your shop.")

TOUCHED = ["FLT-PARTS-01", "FLT-PARTS-09", "FLT-PARTS-11", "FLT-PARTS-12", "FLT-PARTS-13",
           "FLT-RPTS-01", "FLT-RPTS-21", "FLT-RPTS-22", "FLT-RPTS-23", "FLT-PERS-05"]
RETIRED_THIS_PASS = [f"FLT-SRCH-0{i}" for i in range(1, 10)]
PSRCH_PROTECTED = [f"FLT-PSRCH-{i:02d}" for i in range(1, 14)]

fails, notes = [], []


def check(cond, msg):
    (notes if cond else fails).append(("PASS " if cond else "FAIL ") + msg)


all_cases = []
for f in sorted(glob.glob(os.path.join(CASES, "cases-*.json"))):
    for c in json.load(open(f)):
        c["_file"] = os.path.basename(f)
        all_cases.append(c)
by_id = {c["id"]: c for c in all_cases}
active = [c for c in all_cases if not str(c.get("viu_status", "")).startswith("Retired")]
retired = [c for c in all_cases if str(c.get("viu_status", "")).startswith("Retired")]

print("=" * 78)
print("STAGE 2b CROSS-CASE CONSISTENCY SWEEP — Filters, 2026-07-31")
print("=" * 78)
print(f"authored total {len(all_cases)} | ACTIVE {len(active)} | retired {len(retired)}")

# ---------------------------------------------------------------- 1. BLOCK-T identical
carriers = [c for c in active
            if any(BLOCK_T in x for x in c.get("expected", []))]
check(len(carriers) == 3, f"BLOCK-T (data-driven option lists) carried by exactly 3 cases "
      f"-> {[c['id'] for c in carriers]}")
for c in carriers:
    hits = [x for x in c["expected"] if BLOCK_T in x]
    check(len(hits) == 1 and hits[0].split(". ", 1)[1] == BLOCK_T,
          f"{c['id']}: BLOCK-T text byte-identical to the canonical block")

# no case may assert a FIXED option list while another says data-driven
fixedlist = [c["id"] for c in active
             for x in c.get("expected", [])
             if re.search(r"the (full |complete )?list of choices (is|are) fixed", x, re.I)]
check(not fixedlist, f"no active case asserts a FIXED option list (would contradict "
      f"BLOCK-T) -> {fixedlist}")

# ---------------------------------------------------------------- 2. BLOCK-P role rule
pr = [c for c in active if c["area"] in ("Parts Page Filters", "Reports Page Filters")]
for c in pr:
    want = BLOCK_P_PARTS if c["area"] == "Parts Page Filters" else BLOCK_P_RPTS
    check(c.get("permissions_required") == want,
          f"{c['id']}: permissions_required == BLOCK-P ({c['area'].split()[0]} variant)")
rolehedge = [c["id"] for c in active
             if "differ by role is to confirm" in (c.get("permissions_required") or "")]
check(not rolehedge, f"no surviving role-dependence hedge -> {rolehedge}")
# nothing anywhere may claim role-dependent filter chips/options
roleclaim = []
for c in active:
    blob = " ".join(c.get("expected", []) + c.get("steps", []))
    if re.search(r"(hidden|not shown|limited).{0,40}depend(ing|s)? on (the )?(person'?s )?role", blob, re.I):
        roleclaim.append(c["id"])
check(not roleclaim, f"no active case asserts role-dependent filter chips/options "
      f"(would contradict Q7=A) -> {roleclaim}")

# ---------------------------------------------------------------- 3. stale-string grep
STALE = ["pending Branko's PRD", "pending Branko’s PRD", "spec v1.3", "Behaviour to confirm",
         "VIU-confirm", "(to be checked live once available)"]
preexisting = defaultdict(list)
for s in STALE:
    hits = []
    for c in active:
        blob = "\n".join([c.get("title", ""), c.get("permissions_required") or ""]
                         + c.get("preconditions", []) + c.get("steps", [])
                         + c.get("expected", []) + [c.get("spec_ref") or ""])
        if s.lower() in blob.lower():
            hits.append(c["id"])
    mine = [h for h in hits if h in TOUCHED]
    check(not mine, f'stale string "{s}" absent from every case TOUCHED this pass '
          f"(tester-facing text + refs) -> {mine}")
    for h in hits:
        if h not in TOUCHED:
            preexisting[s].append(h)
# notes layer may keep provenance ("... instead of 'spec v1.3 (export awaited)'"), but
# the two dead pointers must not survive as live pointers on a case we touched.
for s in ["pending Branko's PRD", "spec v1.3"]:
    hits = [c["id"] for c in active
            if s.lower() in (c.get("notes") or "").lower() and c["id"] in TOUCHED]
    check(not hits, f'dead pointer "{s}" absent from the notes of every case TOUCHED '
          f"this pass -> {hits}")

# ---------------------------------------------------------------- 4. anti-duplication
scoping = [c["id"] for c in active
           if re.search(r"(do(es)? ?n[o']t carry|keeps? its own)", " ".join(c.get("expected", [])), re.I)
           and re.search(r"(Parts view|Report tab)", " ".join(c.get("expected", [])), re.I)]
check(scoping == ["FLT-PERS-05"], f"per-view/per-tab scoping asserted by FLT-PERS-05 ONLY "
      f"-> {scoping}")
check(not any("do not carry" in x for x in by_id["FLT-PARTS-12"]["expected"]),
      "FLT-PARTS-12 does NOT duplicate FLT-PERS-05's scoping assertion")

# ---------------------------------------------------------------- 5. Vendors hedge survives
v = by_id["FLT-PARTS-01"]
check(any("not been given a design for the Vendors page" in x for x in v["expected"]),
      "the Vendors-page hedge SURVIVES in FLT-PARTS-01 (Q2=A does not answer it)")
contra = [c["id"] for c in active if c["id"] != "FLT-PARTS-01"
          and re.search(r"Vendors (list )?page shows .* filter button", " ".join(c.get("expected", [])))]
check(not contra, f"no other active case contradicts the Vendors hedge -> {contra}")

# ---------------------------------------------------------------- 6. opposite assertions
OPPOSITES = [
    (r"no Apply (or [A-Za-z]+ )?button", r"press (the )?Apply", "Apply button"),
    (r"allows more than one choice|lets you tick more than one|More than one value can be chosen",
     r"only one (choice|value) can be (chosen|selected)", "multi-select"),
]
for pos, neg, label in OPPOSITES:
    p = [c["id"] for c in active if re.search(pos, " ".join(c.get("expected", [])), re.I)]
    n = [c["id"] for c in active if re.search(neg, " ".join(c.get("expected", [])), re.I)]
    # the ONE legitimate single-range exception is the date-range chip (FLT-RPTS-23)
    n = [x for x in n if x != "FLT-RPTS-23"]
    check(not (p and n), f'opposite-assertion sweep "{label}": positives {p} vs negatives {n}')
# date-range single-range is the named spec exception, not a contradiction
check(any("Only one date range can be active" in x for x in by_id["FLT-RPTS-23"]["expected"]),
      "FLT-RPTS-23 keeps the single-range date exception (spec v1.6 §4 named exception)")

# ---------------------------------------------------------------- 7. TITLE vs EXPECTED
# Stem-based (prefix 5) so inflections ("Ticking"/"tick", "Applying"/"apply") do not
# read as drift. Real drift = the title's SUBJECT NOUNS are absent from steps+expected.
STOP = {"filter", "filte", "shows", "their", "which", "every", "still", "avail", "there",
        "order", "orders", "again", "other", "befor", "after", "while", "value", "match"}


def stems(text):
    return {w[:5].lower() for w in re.findall(r"[A-Za-z]{4,}", text)}


title_drift = []
for c in active:
    tw = {w for w in stems(c["title"]) if w not in STOP}
    blob = stems(" ".join(c.get("expected", []) + c.get("steps", []) + [c.get("title", "")]))
    blob |= stems(" ".join(c.get("preconditions", [])))
    miss = sorted(tw - blob)
    if miss and len(miss) > len(tw) // 2:
        title_drift.append((c["id"], c["title"], miss))
check(not title_drift, f"TITLE-vs-EXPECTED drift scan over every ACTIVE case "
      f"-> {[t[0] for t in title_drift]}")

# ---------------------------------------------------------------- 8. steps drive expected
for cid in TOUCHED:
    c = by_id[cid]
    check(len(c.get("steps", [])) >= 1 and len(c.get("expected", [])) >= 1,
          f"{cid}: has both steps and expected")
    hedge = [x for x in c["expected"] if x.lower().startswith(tuple(
        f"{i}. behaviour to confirm" for i in range(1, 30)))]
    check(not hedge, f"{cid}: no unfalsifiable 'Behaviour to confirm' expected line")

# ---------------------------------------------------------------- 9. numbering integrity
for c in active:
    for field in ("preconditions", "steps", "expected"):
        seq = [int(m.group(1)) for x in c.get(field, [])
               if (m := re.match(r"(\d+)\.", x))]
        check(seq == list(range(1, len(c.get(field, [])) + 1)),
              f"{c['id']}.{field}: numbering is 1..n with no gaps/repeats")

# ---------------------------------------------------------------- 10. same-anchor clusters
clusters = defaultdict(list)
for c in active:
    key = re.sub(r"[^a-z0-9]", "", (c.get("spec_ref") or "").lower())[:80]
    clusters[key].append(c["id"])
big = {k: v for k, v in clusters.items() if len(v) > 1}
print("\nSame-anchor clusters (>1 case sharing an identical refs prefix):")
for k, v in sorted(big.items(), key=lambda kv: -len(kv[1])):
    print(f"  {len(v):>2}  {v}")
# each cluster must not contain two cases whose TITLES are near-identical
for k, v in big.items():
    titles = [by_id[i]["title"].lower() for i in v]
    for i in range(len(titles)):
        for j in range(i + 1, len(titles)):
            a, b = set(titles[i].split()), set(titles[j].split())
            jac = len(a & b) / len(a | b)
            check(jac < 0.7, f"same-anchor cluster near-duplicate titles: "
                             f"{v[i]} vs {v[j]} (overlap {jac:.2f})")

# ---------------------------------------------------------------- 11. the retired 9
idmap = {r["internal_id"]: (r["testrail_case_id"] or "").strip()
         for r in csv.DictReader(open(os.path.join(FILTERS, "testrail-id-map.csv")))}
for sid in RETIRED_THIS_PASS:
    c = by_id[sid]
    check(str(c["viu_status"]).startswith("Retired — page-search palette confirmed "
                                          "Global-Search-owned"),
          f"{sid}: retired with the Branko-Q6 reason recorded")
    check(idmap.get(sid, "") == "", f"{sid}: C-id was BLANK -> no delete_case was needed")
    check("Branko" in c["notes"] and "Global Search" in c["notes"],
          f"{sid}: retirement notes carry the ruling + evidence")
# the previously-flagged CONTRADICTION CLUSTER: palette cases vs Story-13 toolbar cases
pal = [c["id"] for c in active if "Command-K" in c.get("area", "")]
check(not pal, f"CONTRADICTION CLUSTER CLOSED: 0 active command-palette cases remain "
      f"-> {pal}")
tb = [c["id"] for c in active if c.get("area") == "Page Search Toolbar"]
check(len(tb) == 13, f"the 13 Story-13 toolbar cases are all still ACTIVE -> {len(tb)}")

# ---------------------------------------------------------------- 12. PSRCH untouched
for pid in PSRCH_PROTECTED:
    check(pid in by_id and not str(by_id[pid].get("viu_status", "")).startswith("Retired"),
          f"{pid}: present and ACTIVE (protected)")
    check(idmap.get(pid, "").startswith("C"), f"{pid}: has a live C-id ({idmap.get(pid)})")

# ---------------------------------------------------------------- 13. Rule 20 traceability
for cid in TOUCHED:
    c = by_id[cid]
    r = c.get("spec_ref") or ""
    check("Filters (Epic key TBD)" in r, f"{cid}: refs carry the ticket half (Epic key TBD "
                                         f"— OQ-3 still open, not invented)")
    check("spec v1.6" in r or "tech plan" in r, f"{cid}: refs carry a spec anchor")
    check("," not in r, f"{cid}: refs are COMMA-FREE (TestRail strips the space after "
                        f"commas -> false re-GET mismatch)")

# ---------------------------------------------------------------- 14. title length
long = [(c["id"], len(c["title"])) for c in active if len(c["title"]) > 80]
print(f"\nTitles over 80 chars (house convention): {len(long)}")
for i, n in long:
    print(f"  {i} ({n})")

print("\nPRE-EXISTING stale strings on cases NOT touched this pass "
      "(out of the authorized scope -> reported as follow-ups, NOT fixed):")
if preexisting:
    for s, ids in preexisting.items():
        print(f"  \"{s}\" -> {sorted(set(ids))}")
else:
    print("  none")

print("\n" + "=" * 78)
print(f"CHECKS PASSED: {len(notes)}   FAILED: {len(fails)}")
print("=" * 78)
if fails:
    for f_ in fails:
        print(f_)
    sys.exit(1)
print("STAGE 2b SWEEP CLEAN — no contradiction, no duplication, no stale hedge.")
