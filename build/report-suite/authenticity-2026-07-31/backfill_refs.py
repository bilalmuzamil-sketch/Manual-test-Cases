#!/usr/bin/env python3
"""PHASE 1 backfill — make every one of the 472 active Report Suite cases Rule-20
compliant: `refs` = "<TICKET> (<spec-anchor>)", both halves always present.

Sources (never invented):
  * story -> Jira key: parsed live out of build/report-suite/epic-sv8582/INGEST-SUMMARY.md
    (the SV-8582 epic ingest; story titles carry "<Report> - Story N - ...").
  * spec anchors: kept VERBATIM from each case's existing spec_ref (only provenance
    prose is compressed when the 250-char cap forces it; every S<n>-<R|N|E><k>
    requirement token is asserted to survive).

Applied in order:
  (F1) 5 MIS-CITED tickets (present ticket != the story its own first anchor cites).
  (F2) 1 STALE anchor (SBC-API-05 cited SBC Story 16 / S16-R6 = Print, REMOVED from
       the current spec v12).
  (F3) 6 no-owning-story / cross-cutting cases -> explicit epic-level or shared-chassis
       ref, stated as such inside the ref text.
  (F4) 358 ticket-missing backfills (per-story precision).
  (F5) hygiene: comma-free refs (TestRail normalises ", " to ",") + the 250-char cap.

LOCAL ONLY. No TestRail writes.
"""
import json, re, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "authenticity-2026-07-31")

INGEST = open(os.path.join(ROOT, "epic-sv8582", "INGEST-SUMMARY.md"), encoding="utf-8").read()
REPNAME = {"SBC": "SBC", "SBR": "SBR", "Velocity": "PV", "Tech Util": "TU",
           "WIP": "WIP", "Inv Value": "IV"}
STORY_TICKET = {}
for row in re.finditer(r"^\| (SV-\d+) \| (.+?) \| Story \|", INGEST, re.M):
    mm = re.match(r"(SBC|SBR|Velocity|Tech Util|WIP|Inv Value) - Story (\d+) - ", row.group(2))
    if mm:
        STORY_TICKET[(REPNAME[mm.group(1)], int(mm.group(2)))] = row.group(1)
assert len(STORY_TICKET) == 80, len(STORY_TICKET)

files = sorted(glob.glob(os.path.join(ROOT, "cases", "cases-*.json")))
data = {f: json.load(open(f, encoding="utf-8")) for f in files}
cases = {c["id"]: c for lst in data.values() for c in lst
         if not str(c.get("viu_status", "")).startswith("Retired")}
assert len(cases) == 472, len(cases)

TOK = lambda s: set(re.findall(r"S\d+-[A-Z]+\d+[a-z]?", s))
log = []
def setref(iid, newref, why, keep_tokens=True):
    c = cases[iid]
    if keep_tokens:
        lost = TOK(c["spec_ref"]) - TOK(newref)
        assert not lost, "%s would lose requirement tokens %s" % (iid, sorted(lost))
    log.append({"id": iid, "before": c["spec_ref"], "after": newref, "why": why})
    c["spec_ref"] = newref

# ---------------------------------------------------------------- F1 mis-cited
MIS = {
 "SBC-LOC-01": ("SV-8600", "SV-8603", "its anchor is SBC Story 4 Filter by location = SV-8603; SV-8600 is SBC Story 1"),
 "SBC-LOC-04": ("SV-8600", "SV-8603", "its anchor is SBC Story 4 Filter by location = SV-8603; SV-8600 is SBC Story 1"),
 "TU-ELL-02":  ("SV-8652", "SV-8649", "its first anchor is TU S2 Columns and Calculations = SV-8649; SV-8652 is TU Story 5 Technician Filter"),
 "WIP-COL-01": ("SV-8659", "SV-8660", "its anchor is WIP Story 4 Columns and Calculations = SV-8660; SV-8659 is WIP Story 3 Tab Placement"),
 "WIP-COL-02": ("SV-8659", "SV-8660", "its anchors are WIP Story 4 = SV-8660 plus Story 8 = SV-8664; SV-8659 is WIP Story 3 Tab Placement"),
}
for iid, (old, new, why) in MIS.items():
    r = cases[iid]["spec_ref"]
    assert r.startswith(old), (iid, r[:40])
    setref(iid, new + r[len(old):], "F1 mis-cited ticket corrected %s -> %s: %s" % (old, new, why))

# ---------------------------------------------------------------- F2 stale anchor
r = cases["SBC-API-05"]["spec_ref"]
assert "; Story 16 S16-R6" in r
setref("SBC-API-05", r.replace("; Story 16 S16-R6", ""),
       "F2 STALE anchor dropped: SBC Story 16 (Print) reads '(removed - Print retired)' in the "
       "current SBC spec v12 2026-07-29, so S16-R6 no longer exists", keep_tokens=False)

# ------------------------------------------- F3 no-owning-story / cross-cutting
F3 = {
 "SBC-EMPTY-04": ("SV-8582 (SBC spec §7 User Feedback Summary — the data-fetch error toast; "
                  "CROSS-CUTTING: the SBC spec carries no error-state story of its own so the "
                  "epic key is used deliberately)",
                  "F3 no owning story — SBC error states live only in §7; epic-level ref stated explicitly"),
 "SBR-CALC-06": ("SV-8582 (SBR spec §3 definitions; §4 Terminology — money-column labels and the "
                 "Subtotal/Margin definitions; CROSS-CUTTING across every SBR row level with no "
                 "single owning story)",
                 "F3 cross-cutting money definitions; epic-level ref stated explicitly"),
 "SBR-CALC-07": ("SV-8593 (SBR spec §3 Key Decisions accounting parentheses — owned by the shared "
                 "A5 report-shell formatter module: verbatim 'accounting-parens negatives')",
                 "F3 shared-chassis story SV-8593 [A5] verbatim owns the accounting-parens formatter"),
 "SBR-CALC-08": ("SV-8582 (SBR spec §3 half-up rounding rule + round of unrounded rollups; "
                 "CROSS-CUTTING display rule with no single owning story)",
                 "F3 cross-cutting rounding rule; epic-level ref stated explicitly"),
 "WIP-CALC-07": ("SV-8660 (WIP spec Story 4 S4-R15 verbatim 'summed across the work order's "
                 "approved lines' + §2 Relationship to the work order; §4 Terminology Approved line)",
                 "F3 owning story identified: WIP Story 4 Columns and Calculations = SV-8660 (S4-R15 verbatim)"),
 "TU-COL-01": ("SV-8582 (TU spec v5 2026-07-29 Story 10 S10-R1; S10-R2; S10-R3; S10-R4; S10-R5; "
               "S10-R6 column selector — NO OWNING JIRA STORY: epic SV-8582 carries no TU Story-10 "
               "ticket and the spec's own Jira field reads TBD; epic key used and FLAGGED)",
               "F3 no owning story — was mis-cited to SV-8655 (TU Story 8 Visual Conformance); "
               "TU Story 10 has no Jira ticket at all (spec Jira field: TBD)"),
}
for iid, (newref, why) in F3.items():
    setref(iid, newref, why, keep_tokens=(iid == "TU-COL-01"))

# ---------------------------------------------------------------- F4 backfill
LEAD = re.compile(r"^SV-\d+")
for iid in sorted(cases):
    c = cases[iid]
    if LEAD.match(c["spec_ref"].strip()):
        continue
    rep = iid.split("-")[0]
    anchor = c["spec_ref"].strip()
    nums, seen = [], set()
    for m in re.finditer(r"Story (\d+)|S(\d+)-[A-Z]+\d+", anchor):
        n = int(m.group(1) or m.group(2))
        if n not in seen:
            seen.add(n); nums.append(n)
    tk = src = None
    for n in nums:
        if (rep, n) in STORY_TICKET:
            tk, src = STORY_TICKET[(rep, n)], "%s Story %d" % (rep, n); break
    assert tk, "no story ticket derivable for %s: %s" % (iid, anchor)
    setref(iid, "%s (%s)" % (tk, anchor),
           "F4 Rule-20 ticket backfilled from the SV-8582 epic ingest (%s)" % src)

# ---------------------------------------------------------------- F5a comma-free
for iid in sorted(cases):
    c = cases[iid]
    if "," in c["spec_ref"]:
        before = c["spec_ref"]
        after = re.sub(r"\s*;\s*\)", ")", re.sub(r",\s*", "; ", before))
        setref(iid, after, "F5a comma-free refs (TestRail normalises ', ' to ',')")

# ---------------------------------------------------------------- F5b 250-char cap
# Compress ONLY repeated provenance prose. Requirement tokens are asserted intact.
COMPRESS = [
 (r"\(chris-update-2026-07-29/(?:chris-message|wip-identifier-answer)-2026-07-29\.md; "
  r"(?:NEWEST source; )?last-update-wins\)", "[newest-wins]"),
 (r"per Chris Ward group message 2026-07-29", "per Chris Ward msg 2026-07-29"),
 (r"by Chris Ward group message 2026-07-29", "by Chris Ward msg 2026-07-29"),
 (r"by Chris Ward answer A 2026-07-29", "by Chris Ward answer 2026-07-29"),
 (r"user ruling 2026-07-28: video overrides spec \(video newer; last-update-wins\)",
  "[ruling 2026-07-28 video-overrides-spec]"),
 (r"per kickoff video P10 40:58-41:20", "per kickoff video P10"),
 (r"per the PRD companion video 2026-07-30 (\d\d:\d\d-\d\d:\d\d)", r"per PRD video 2026-07-30 \1"),
 (r"; confirming kickoff video P31", " [cf video P31]"),
 (r"confirming kickoff video P31", "[cf video P31]"),
 (r"superseding the kickoff video's serial-number ruling P24 AND", "supersedes video P24 serial ruling AND"),
 (r"superseding the video P24 serial ruling", "supersedes video P24 serial ruling"),
 (r"on-screen location-scope indicator", "on-screen location-scope indicator"),
 (r"identifier RE-RULED to VIN; falling back to Unit #; then plate",
  "identifier RE-RULED to the VIN chain (VIN -> Unit # -> plate)"),
 (r"RE-RULED to the VIN chain \(VIN; then Unit #; then plate\)",
  "RE-RULED to the VIN chain (VIN -> Unit # -> plate)"),
 (r"the spec's 'only report' sentence is superseded", "spec's 'only report' sentence superseded"),
 (r"PV S1-R1 vs IV S1-R1 inconsistency flagged to SPEC-WATCH", "PV-vs-IV S1-R1 clash on SPEC-WATCH"),
 (r"'at the bottom' re-based to below-the-named-anchors", "'at the bottom' = below the named anchors"),
 (r"order among the four new reports not important", "order among the four not important"),
 (r"refining kickoff video P3; video authoritative; newest-wins", "refines video P3 [newest-wins]"),
 (r"menu RESHAPED to the four Summary/Expanded items", "menu RESHAPED to 4 Summary/Expanded items"),
 (r"\[ratifies \+ extends video P21\]", "[extends video P21]"),
 (r"'Print' REMOVED per video P25 31:14; CONFIRMED by the same message",
  "'Print' REMOVED per video P25 [same msg confirms]"),
 (r"the old 'location is not shown in the header' rule is REVERSED by the Locations: line added to every export",
  "old 'location not in the header' rule REVERSED by the Locations: line in every export"),
 (r"\+ Locations: line in every CSV/PDF export per Chris Ward msg 2026-07-29 \[newest-wins\]",
  "+ Locations: line in every export per Chris Ward msg 2026-07-29 [newest-wins]"),
 (r"the spec's original unit-number\+VIN matching partially survives via the chain",
  "spec's unit-number+VIN matching partly survives via the chain"),
 (r"AND the spec's 'sorts by unit number'", "AND the spec's 'sorts by unit number' rule"),
 (r"export header text at export unpinned", "export header text unpinned"),
 (r"option text \+ type-ahead match fields", "option text + type-ahead match fields"),
 (r"AND the spec's year/make/model \+ unit/plate/VIN-suffix rule", "AND the spec's year/make/model rule"),
 (r"AND the spec's unit-number rule", "AND the spec's unit-number rule"),
 (r"specs/sbr-sales-by-representative\.md", "SBR spec"),
 (r"specs/sbc-sales-by-customer\.md", "SBC spec"),
 (r"specs/wip-work-in-progress\.md", "WIP spec"),
 (r"specs/technician-utilization\.md", "TU spec"),
 (r"specs/parts-velocity\.md", "PV spec"),
 (r"specs/inventory-value\.md", "IV spec"),
]
COMPRESS2 = [
 (r"per Chris Ward msg 2026-07-29 \[newest-wins\]", "per Chris Ward 2026-07-29"),
 (r"by Chris Ward answer 2026-07-29 \[newest-wins\]", "by Chris Ward answer 2026-07-29"),
 (r";\s*\[ruling 2026-07-28 video-overrides-spec\]", " [ruling 2026-07-28 video-overrides-spec]"),
 (r"; spec's unit-number\+VIN matching partly survives via the chain", ""),
 (r"option text \+ type-ahead match fields RE-RULED", "option text + match fields RE-RULED"),
 (r"; supersedes video P24 serial ruling", " [supersedes video P24]"),
 (r"supersedes video P24 serial ruling AND", "supersedes video P24 AND"),
]
for iid in sorted(cases):
    c = cases[iid]
    if len(c["spec_ref"]) <= 250:
        continue
    before = s = c["spec_ref"]
    for pat, rep in COMPRESS:
        s = re.sub(pat, rep, s)
    s = re.sub(r"\s{2,}", " ", s).strip()
    if len(s) > 250:                       # second, more aggressive pass
        for pat, rep in COMPRESS2:
            s = re.sub(pat, rep, s)
        s = re.sub(r"\s{2,}", " ", s).strip()
    assert len(s) <= 250, "%s still %d chars: %s" % (iid, len(s), s)
    setref(iid, s, "F5b compressed to the 250-char TestRail refs cap "
                   "(every requirement token + the driving source kept; only repeated provenance prose removed)")

# ---------------------------------------------------------------- verify
bad = []
for iid, c in cases.items():
    r = c["spec_ref"]
    if not re.match(r"^SV-\d+", r): bad.append((iid, "no leading Jira ticket", r))
    if len(r) > 250: bad.append((iid, "over the 250-char cap (%d)" % len(r), r))
    if "," in r: bad.append((iid, "contains a comma", r))
    if not re.search(r"\(.+\)", r): bad.append((iid, "no parenthesised spec anchor", r))
assert not bad, bad[:6]

for f, lst in data.items():
    json.dump(lst, open(f, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    open(f, "a").write("\n")
json.dump(log, open(os.path.join(OUT, "refs-backfill-log.json"), "w"), indent=1, ensure_ascii=False)
print("cases touched:", len({e["id"] for e in log}), "| log entries:", len(log))
print("all 472: leading Jira ticket + parenthesised spec anchor + <=250 chars + comma-free")
