#!/usr/bin/env python3
"""PHASE 1 — Rule-20 traceability audit of all 472 active Report Suite cases.

For every case, check the `spec_ref` (= the TestRail `refs` field) carries BOTH
  (a) a Jira ticket key  AND  (b) a spec anchor,   in `<TICKET> (<spec-anchor>)` form.

Also detects STALE anchors: a cited Story that no longer exists in the CURRENT spec
(build/report-suite/spec-current-2026-07-31/) or a cited S<n>-<R|N|E><k> requirement
token that is no longer present in that spec's text.

READ-ONLY. Writes TRACEABILITY-AUDIT.md + audit.json. No case edits, no TestRail writes.
"""
import json, re, glob, os, csv, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))       # build/report-suite
OUT  = os.path.join(ROOT, "authenticity-2026-07-31")
SPECDIR = os.path.join(ROOT, "spec-current-2026-07-31")

# ---------------------------------------------------------------- story -> ticket
INGEST = open(os.path.join(ROOT, "epic-sv8582", "INGEST-SUMMARY.md"), encoding="utf-8").read()
REPNAME = {"SBC": "SBC", "SBR": "SBR", "Velocity": "PV", "Tech Util": "TU",
           "WIP": "WIP", "Inv Value": "IV"}
STORY_TICKET, TICKET_TITLE = {}, {}
for row in re.finditer(r"^\| (SV-\d+) \| (.+?) \| Story \|", INGEST, re.M):
    key, title = row.group(1), row.group(2)
    TICKET_TITLE[key] = title
    mm = re.match(r"(SBC|SBR|Velocity|Tech Util|WIP|Inv Value) - Story (\d+) - ", title)
    if mm:
        STORY_TICKET[(REPNAME[mm.group(1)], int(mm.group(2)))] = key
assert len(STORY_TICKET) == 80, len(STORY_TICKET)
EPIC = "SV-8582"

# ---------------------------------------------------------------- current specs
SPECFILE = {"IV": "Inventory-Value-Report-current.md",
            "PV": "Parts-Velocity-Report-current.md",
            "SBC": "Sales-By-Customer-Report-current.md",
            "SBR": "Sales-By-Representative-Report-current.md",
            "TU": "Technician-Utilization-Report-current.md",
            "WIP": "Work-In-Progress-Report-current.md"}
SPEC_TOKENS, SPEC_STORIES, SPEC_REMOVED = {}, {}, {}
for rep, fn in SPECFILE.items():
    txt = open(os.path.join(SPECDIR, fn), encoding="utf-8").read()
    SPEC_TOKENS[rep] = set(re.findall(r"S\d+-[A-Z]+\d+[a-z]?", txt))
    heads = dict((int(n), t.strip()) for n, t in re.findall(r"^### Story (\d+):(.*)$", txt, re.M))
    SPEC_STORIES[rep] = heads
    SPEC_REMOVED[rep] = {n for n, t in heads.items() if t.lower().startswith("(removed")}

# ---------------------------------------------------------------- cases
cases = {}
files = sorted(glob.glob(os.path.join(ROOT, "cases", "cases-*.json")))
for f in files:
    for c in json.load(open(f, encoding="utf-8")):
        if str(c.get("viu_status", "")).startswith("Retired"):
            continue
        cases[c["id"]] = c
assert len(cases) == 472, len(cases)

TICK = re.compile(r"SV-\d+")
ANCHOR = re.compile(r"(S\d+-[A-Z]+\d+[a-z]?|Story \d+|§\s?\d|specs/[a-z0-9-]+\.md|"
                    r"§\d|Key Decisions|Terminology|Assumptions|Golden Rule|"
                    r"tech-plan|invariant|Known Limitations|User Feedback)", re.I)

def report_of(iid):  return iid.split("-")[0]

def cited_stories(iid, refs):
    """Every story number the anchor cites, in citation order (never guessed)."""
    rep = report_of(iid)
    seen, order = set(), []
    for m in re.finditer(r"Story (\d+)|S(\d+)-[A-Z]+\d+", refs):
        n = int(m.group(1) or m.group(2))
        if n not in seen:
            seen.add(n); order.append(n)
    return rep, order

rows = []
for iid in sorted(cases):
    c = cases[iid]
    refs = (c.get("spec_ref") or "").strip()
    rep = report_of(iid)
    has_t = bool(TICK.search(refs))
    has_a = bool(ANCHOR.search(re.sub(r"^SV-\d+\s*", "", refs)))
    _, stories = cited_stories(iid, refs)
    # stale detection
    stale = []
    for n in stories:
        if n in SPEC_REMOVED.get(rep, ()):
            stale.append(f"Story {n} REMOVED from the current {rep} spec")
        elif n not in SPEC_STORIES.get(rep, {}):
            stale.append(f"Story {n} does not exist in the current {rep} spec")
    for tok in set(re.findall(r"S\d+-[A-Z]+\d+[a-z]?", refs)):
        if tok not in SPEC_TOKENS.get(rep, ()):
            stale.append(f"requirement {tok} not found in the current {rep} spec")
    # expected ticket (per-story precision)
    exp, why = None, ""
    if stories:
        for n in stories:
            if (rep, n) in STORY_TICKET:
                exp = STORY_TICKET[(rep, n)]; why = f"{rep} Story {n}"
                break
        if exp is None:
            why = f"{rep} Story {stories[0]} has NO Jira story in epic SV-8582"
    else:
        why = "anchor cites no story number (cross-cutting)"
    got = TICK.search(refs).group(0) if has_t else None
    if has_t and exp and got != exp:
        # a case may legitimately cite a different story than its first anchor
        why += f" (present ticket {got} != first-anchor story ticket {exp})"
    if has_t and has_a:
        status = "compliant"
    elif has_t and not has_a:
        status = "anchor-missing"
    elif has_a and not has_t:
        status = "ticket-missing"
    else:
        status = "neither"
    rows.append(dict(id=iid, cid=None, area=c["area"], report=rep, refs=refs,
                     status=status, stale=stale, stories=stories,
                     ticket=got, expected=exp, why=why, len=len(refs)))

idmap = {r["internal_id"]: r["testrail_case_id"]
         for r in csv.DictReader(open(os.path.join(ROOT, "testrail-id-map.csv")))}
for r in rows:
    r["cid"] = idmap.get(r["id"], "")

cnt = collections.Counter(r["status"] for r in rows)
stale_rows = [r for r in rows if r["stale"]]
noowner = [r for r in rows if r["expected"] is None and not r["ticket"]]
overcap = [r for r in rows if r["len"] > 250]

json.dump(rows, open(os.path.join(OUT, "audit.json"), "w"), indent=1)
print("=== Rule-20 traceability audit — 472 active cases ===")
for k in ("compliant", "ticket-missing", "anchor-missing", "neither"):
    print(f"  {k:16s} {cnt.get(k,0)}")
print(f"  stale-anchor     {len(stale_rows)}")
print(f"  refs > 250 chars {len(overcap)}")
print(f"  no owning story  {len(noowner)}")
for r in noowner[:20]:
    print("    ", r["id"], r["cid"], "|", r["why"])
print("\nstale examples:")
for r in stale_rows[:15]:
    print("    ", r["id"], r["cid"], "|", "; ".join(r["stale"]))
