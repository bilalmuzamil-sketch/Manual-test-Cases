#!/usr/bin/env python3
"""Direction A (requirement -> case) and Direction B (case -> requirement) mapping.

Rule 45(e): a requirement making more than one ASSERTION gets ONE ROW PER ASSERTION,
and a "covered" verdict is INVALID unless BOTH texts are quoted side by side. So every
row emitted here carries `requirement_text` AND `covering_expected_quote` verbatim.

ASSERTION SPLIT RULE (mechanical, documented, re-runnable)
  A requirement is split into assertions at sentence boundaries, keeping only sentences
  that make an independently observable claim. A sentence is NOT its own assertion when
  it is:
    - pure rationale / justification  ("This matches ...", "Because ...", "The reason ...")
    - a pure cross-reference          ("See S8-R3.", "(Story 9 covers the location filter)")
    - a restatement of the parent id  (an inline title such as "(Summary contents)")
  A requirement is FORCE-SPLIT when one sentence names MORE THAN ONE SURFACE
  (screen + export, CSV + PDF, on-screen + API): each surface becomes its own assertion,
  because Rule 40 requires a per-surface verdict.

COVERAGE STATUS (mechanical, before human adjudication)
  DIRECT        a live case's refs cite this exact requirement id
  PARENT        a live case cites the dotted/lettered parent (S18-R7 covers S18-R7.1..)
  STORY         a live case cites the story-level anchor only (e.g. "Story 14") and the
                requirement belongs to that story  -> reported, needs adjudication
  TEXT-ONLY     no anchor, but a case body carries the requirement's distinctive terms
  NONE          nothing at all

SUBSTANTIATION (Rule 45(e) / Rule 12)
  For each assertion, the covering case's expected result is searched for the sentence
  with the highest content-word overlap. score >= STRONG  -> SUBSTANTIATED-MACHINE
                                            >  0         -> WEAK (must be human-read)
                                            == 0         -> UNSUBSTANTIATED (must be human-read)
  Nothing is written as "covered" on the anchor alone.

OUTPUTS (../data/)
  coverage-rows.json     one entry per requirement/assertion, with both verbatim texts
  case-anchors.json      per case: refs, anchors cited, orphan anchors
  direction-b.json       stale/orphan anchor findings
"""
import json
import os
import re
import sys
from collections import Counter, OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.abspath(os.path.join(HERE, "..", "data"))
RS = os.path.abspath(os.path.join(HERE, "..", ".."))
IDMAP = os.path.join(RS, "testrail-id-map.csv")

STRONG = 0.34   # content-word overlap ratio treated as machine-substantiated

REQ_ID = r"S\d+-[RNE]\d+[a-z]?(?:\.\d+)?"
ANY_ID = re.compile(r"\b(" + REQ_ID + r")\b")
# "S14-R1/R2/R4"  and  "S2-R4/R5"  and  "S7-R6/R7/R7a"
COMPRESSED = re.compile(r"\b(S\d+)-([RNE]?\d+[a-z]?(?:\.\d+)?(?:/[RNE]?\d+[a-z]?(?:\.\d+)?)+)\b")
# "S1-R1..R4"  "S1-R1-R4"  "S1-R1–R4"  "S18-R7.1–R7.6"
RANGE = re.compile(r"\b(S\d+)-([RNE])(\d+)(?:\.(\d+))?\s*(?:\.\.|[–—-])\s*(?:[RNE])?(\d+)(?:\.(\d+))?\b")
STORY_REF = re.compile(r"\bStor(?:y|ies)\s+(\d+(?:\s*[,/&]\s*\d+)*)", re.I)

STOP = set("""a an the and or but if then than that this these those of to in on at by for with
from as is are was were be been being it its it's their there here not no nor so such when while
where which who whom whose what how why any all each every both either neither only also just
does do did done can could may might must shall should will would has have had into over under
about above below between across per via up down out off again further more most other some own
same too very s t don now one two three four five row rows value values show shows shown display
displays user users report reports case cases test tests you your""".split())

SURFACE_WORDS = {
    "csv": "CSV export", "pdf": "PDF export", "print": "Print view",
    "api": "API", "mobile": "Mobile", "phone": "Mobile", "email": "Email",
    "column selector": "Column selector", "export": "Export (unspecified format)",
    "download": "Download", "screen": "On screen", "on-screen": "On screen",
    "toast": "Toast/notification", "tooltip": "Tooltip",
    "empty state": "Empty / zero state", "no data": "Empty / zero state",
}
# Do NOT split after a known abbreviation — "Inv. Hrs", "Est. Lost Labor", "e.g." etc.
# would otherwise be torn in half and produce a meaningless one-word assertion.
ABBREV = r"(?<!\bInv\.)(?<!\bEst\.)(?<!\bQty\.)(?<!\bNo\.)(?<!\be\.g\.)(?<!\bi\.e\.)" \
         r"(?<!\bvs\.)(?<!\betc\.)(?<!\bApprox\.)(?<!\bMax\.)(?<!\bMin\.)(?<!\bHrs\.)" \
         r"(?<!\bcf\.)(?<!\bMr\.)(?<!\bDr\.)(?<!\bJan\.)(?<!\bDec\.)"
# Split on sentence-ending periods only. A semicolon does NOT end an assertion — the specs
# use semicolons to separate the items of ONE enumeration (e.g. the range->filename map),
# and splitting there would tear one closed list into fragments.
SENT_SPLIT = re.compile(ABBREV + r"(?<=\.)\s+(?=[A-Z(\"'“*_]|\*\*)")
RATIONALE = re.compile(
    r"^\s*(this matches|this is|this mirrors|because\b|the reason|rationale|the intent|"
    r"that is why|matching the|per the|see \b|as with|consistent with|the point is)", re.I)
XREF_ONLY = re.compile(r"^\s*[(\[]?\s*(see\s+)?(S\d+-[RNE]\d+|Story\s+\d+|§\d+)[^.]{0,60}[)\]]?\s*\.?\s*$", re.I)


def words(s):
    s = re.sub(r"[^a-z0-9%$#/.\- ]", " ", (s or "").lower())
    return [w for w in re.split(r"\s+", s) if w and w not in STOP and len(w) > 1]


def content(s):
    return set(words(s))


def anchors_in(text):
    """Every requirement id a refs string cites, expanding compressed + range forms."""
    t = text or ""
    out = set(ANY_ID.findall(t))
    for story, tail in COMPRESSED.findall(t):
        kind = None
        m = re.match(r"([RNE])", tail)
        if m:
            kind = m.group(1)
        for part in tail.split("/"):
            if re.match(r"[RNE]", part):
                out.add(f"{story}-{part}")
                kind = part[0]
            elif kind:
                out.add(f"{story}-{kind}{part}")
    for story, kind, b1, d1, b2, d2 in RANGE.findall(t):
        if d1 and d2 and b1 == b2:
            out.add(f"{story}-{kind}{b1}")
            for n in range(int(d1), int(d2) + 1):
                out.add(f"{story}-{kind}{b1}.{n}")
        elif not d1 and not d2:
            lo, hi = int(b1), int(b2)
            if 0 < hi - lo <= 40:
                for n in range(lo, hi + 1):
                    out.add(f"{story}-{kind}{n}")
    return {a for a in out if re.fullmatch(REQ_ID, a)}


def stories_in(text):
    out = set()
    for grp in STORY_REF.findall(text or ""):
        for n in re.findall(r"\d+", grp):
            out.add(int(n))
    return out


def split_assertions(text):
    """-> [ (assertion_text, [surfaces]) ]  per the documented split rule."""
    body = re.sub(r"^\*\*" + REQ_ID + r"[^*]*\*\*:?\s*", "", text).strip()
    body = re.sub(r"^" + REQ_ID + r"\s*(\([^)]*\))?\s*:?\s*", "", body).strip()
    sents = [s.strip() for s in SENT_SPLIT.split(body) if s.strip()]
    if not sents:
        sents = [body]
    keep = []
    for s in sents:
        if XREF_ONLY.match(s):
            continue
        if RATIONALE.match(s) and len(keep) > 0:
            continue
        if len(content(s)) < 2:
            continue
        keep.append(s)
    if not keep:
        keep = [body]

    out = []
    for s in keep:
        low = s.lower()
        surf = []
        for k, v in SURFACE_WORDS.items():
            if k in low and v not in surf:
                surf.append(v)
        # collapse the vague ones when a concrete format is present
        if any(x in surf for x in ("CSV export", "PDF export", "Print view")):
            surf = [x for x in surf if x not in ("Export (unspecified format)", "Download")]
        multi = [x for x in surf if x in ("CSV export", "PDF export", "Print view", "API",
                                          "Mobile", "Email", "Column selector")]
        if len(multi) > 1:
            for m in multi:
                rest = [x for x in surf if x == m or x not in multi]
                out.append((s, rest))
        else:
            out.append((s, surf))
    return out


XREF_TAIL = re.compile(
    r"\s*[—\-–(]\s*(?:see\s+)?(?:Story|Stories)\s+\d+[^)]*\)?|"
    r"\s*\((?:see\s+)?(?:" + REQ_ID + r"|§\d+[^)]*)\)|"
    r"\s*—\s*see\s+" + REQ_ID + r"\.?|"
    r"\s*\bper\s+" + REQ_ID + r"\b", re.I)


def score_text(assertion):
    """Assertion normalised FOR SCORING ONLY — cross-references stripped, because a
    pointer such as '— see Story 6' carries no independently observable content. The
    verbatim assertion text is always what is written to the deliverable."""
    s = XREF_TAIL.sub(" ", assertion)
    s = re.sub(r"\(" + REQ_ID + r"\)", " ", s)
    return s


def best_quote(assertion, expected):
    """Highest-overlap sentence of `expected` against `assertion`. -> (quote, score)"""
    if not expected:
        return "", 0.0
    parts = [p.strip() for p in re.split(r"(?<=[.;:])\s+|\n+", expected) if p.strip()]
    a = content(score_text(assertion))
    if not a:
        return (parts[0] if parts else ""), 0.0
    best, bs = "", 0.0
    for p in parts:
        c = content(p)
        if not c:
            continue
        sc = len(a & c) / len(a)
        if sc > bs:
            best, bs = p, sc
    # also try 2-sentence windows for split assertions
    for i in range(len(parts) - 1):
        p = parts[i] + " " + parts[i + 1]
        c = content(p)
        sc = len(a & c) / len(a)
        if sc > bs:
            best, bs = p, sc
    return best, round(bs, 3)


def main():
    reqs = json.load(open(os.path.join(DATA, "requirements.json")))
    live = json.load(open(os.path.join(DATA, "live-cases-4281.json")))
    ours = [c for c in live["cases"] if c.get("created_by") == 3]
    foreign = [c for c in live["cases"] if c.get("created_by") != 3]

    import csv as _csv
    idmap = {int(r["testrail_case_id"].lstrip("C")): r["internal_id"]
             for r in _csv.DictReader(open(IDMAP)) if r["testrail_case_id"].strip()}

    defined = {}
    for k in reqs:
        p, rid = k.split(":")
        defined.setdefault(p, set()).add(rid)

    # ---------- per-case anchor extraction ----------
    cases = {}
    for c in ours:
        internal = idmap.get(c["id"], "")
        prefix = internal.split("-")[0] if internal else ""
        refs = c.get("refs") or ""
        anc = anchors_in(refs)
        cases[c["id"]] = {
            "c_id": c["id"], "internal_id": internal, "prefix": prefix,
            "title": c.get("title", ""), "section": c.get("_section_name", ""),
            "refs": refs, "anchors": sorted(anc), "stories": sorted(stories_in(refs)),
            "expected": c.get("custom_expected") or "",
            "steps": c.get("custom_steps") or "",
            "preconds": c.get("custom_preconds") or "",
            "api_section": "API" in (c.get("_section_name") or ""),
            "orphan_anchors": sorted(a for a in anc if a not in defined.get(prefix, set())),
            "no_anchor": not anc,
        }

    # ---------- requirement -> covering cases ----------
    by_prefix_anchor = {}
    for cid, c in cases.items():
        for a in c["anchors"]:
            by_prefix_anchor.setdefault((c["prefix"], a), []).append(cid)
    by_prefix_story = {}
    for cid, c in cases.items():
        for s in c["stories"]:
            by_prefix_story.setdefault((c["prefix"], s), []).append(cid)

    rows = []
    for key, r in reqs.items():
        p, rid = key.split(":")
        cov = list(by_prefix_anchor.get((p, rid), []))
        how = "DIRECT" if cov else ""
        if not cov and ("." in rid or re.search(r"[a-z]$", rid.split("-")[1])):
            parent = re.sub(r"(\.\d+|[a-z])$", "", rid)
            cov = list(by_prefix_anchor.get((p, parent), []))
            how = "PARENT" if cov else ""
        if not cov:
            st = by_prefix_story.get((p, r["story"]), [])
            if st:
                cov, how = list(st), "STORY"
        if not cov:
            # text-only candidate search across that report's cases
            rc = content(r["text_clean"])
            best = []
            for cid, c in cases.items():
                if c["prefix"] != p:
                    continue
                blob = " ".join((c["title"], c["expected"], c["steps"]))
                sc = len(rc & content(blob)) / max(1, len(rc))
                if sc >= 0.5:
                    best.append((round(sc, 3), cid))
            best.sort(reverse=True)
            if best:
                cov, how = [c for _, c in best[:3]], "TEXT-ONLY"
        if not cov:
            how = "NONE"

        for a_text, surfaces in split_assertions(r["text"]):
            quote, score, qcid = "", 0.0, ""
            for cid in cov:
                q, s = best_quote(a_text, cases[cid]["expected"])
                if s > score:
                    quote, score, qcid = q, s, cid
            if score >= STRONG:
                subst = "SUBSTANTIATED-MACHINE"
            elif score > 0:
                subst = "WEAK-NEEDS-HUMAN-READ"
            else:
                subst = "UNSUBSTANTIATED-NEEDS-HUMAN-READ"
            if how == "NONE":
                subst = "NO-COVERING-CASE"
            rows.append({
                "report": r["report"], "prefix": p, "story": r["story"],
                "story_title": r["story_title"], "requirement_id": rid, "kind": r["kind"],
                "requirement_text": r["text_clean"],
                "assertion_text": a_text,
                "assertion_index": 0,   # filled below
                "surfaces": surfaces,
                "map_how": how,
                "covering_c_ids": [f"C{c}" for c in sorted(cov)],
                "covering_internal_ids": [cases[c]["internal_id"] for c in sorted(cov)],
                "quote_from_c_id": f"C{qcid}" if qcid else "",
                "covering_expected_quote": quote,
                "overlap_score": score,
                "substantiation": subst,
            })

    # assertion indices per requirement
    seen = Counter()
    for row in rows:
        k = (row["prefix"], row["requirement_id"])
        seen[k] += 1
        row["assertion_index"] = seen[k]
    for row in rows:
        row["assertion_count"] = seen[(row["prefix"], row["requirement_id"])]

    # ---------- Direction B ----------
    orphans = {cid: c["orphan_anchors"] for cid, c in cases.items() if c["orphan_anchors"]}
    no_anchor = {cid: c["refs"] for cid, c in cases.items() if c["no_anchor"]}
    wrong_prefix = {}
    for cid, c in cases.items():
        cross = [a for a in c["anchors"]
                 if a not in defined.get(c["prefix"], set())
                 and any(a in defined[q] for q in defined if q != c["prefix"])]
        if cross:
            wrong_prefix[cid] = cross

    json.dump(rows, open(os.path.join(DATA, "coverage-rows.json"), "w"),
              indent=1, ensure_ascii=False)
    json.dump(cases, open(os.path.join(DATA, "case-anchors.json"), "w"),
              indent=1, ensure_ascii=False)
    json.dump({"orphan_anchor_cases": orphans, "cases_with_no_anchor": no_anchor,
               "anchor_resolves_only_in_another_spec": wrong_prefix,
               "foreign_cases": [{"c_id": f["id"], "title": f.get("title"),
                                  "refs": f.get("refs"), "created_by": f.get("created_by"),
                                  "section": f.get("_section_name")} for f in foreign]},
              open(os.path.join(DATA, "direction-b.json"), "w"), indent=1, ensure_ascii=False)

    print("requirements        :", len(reqs))
    print("assertion rows      :", len(rows))
    print("map_how             :", dict(sorted(Counter(r["map_how"] for r in rows).items())))
    print("substantiation      :", dict(sorted(Counter(r["substantiation"] for r in rows).items())))
    reqlevel = {}
    for r in rows:
        k = (r["prefix"], r["requirement_id"])
        reqlevel[k] = r["map_how"]
    print("per-REQUIREMENT how :", dict(sorted(Counter(reqlevel.values()).items())))
    print("cases               :", len(cases), " with orphan anchors:", len(orphans),
          " with NO anchor:", len(no_anchor))
    return 0


if __name__ == "__main__":
    sys.exit(main())
