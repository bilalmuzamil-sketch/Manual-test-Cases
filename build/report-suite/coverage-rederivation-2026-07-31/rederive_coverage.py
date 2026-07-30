#!/usr/bin/env python3
"""Report Suite — coverage re-derivation against the CURRENT (2026-07-29) spec versions.

Repeatable per spec version. Read-only over the specs, the case bodies and the id-map;
writes only into build/report-suite/coverage-rederivation-2026-07-31/.

WHAT IT DOES
  1. Enumerates EVERY requirement definition in each of the six current specs.
     A requirement definition is a list line inside the "## 6. Requirements" section
     whose first bold run starts with a requirement id:
        * **S1-R1:** ...            (plain)
        * **S5-R1: Inventory ...**  (id + inline title inside the bold)
        * **S18-R7.1:** ...         (dotted sub-requirement)
        * **S3-R1a:** ...           (letter-suffixed sub-requirement)
     Requirement id shapes accepted: S<story>-R<n>[a-z][.<n>]  (R = requirement,
     N = negative case, E = edge case).  Ids that only ever appear as cross-references
     (or only in the change log) are NOT counted as requirements.
  2. Maps every requirement -> case(s):
       DIRECT  - the case's spec_ref cites the exact id
       PARENT  - the case cites the dotted parent (S18-R7 covers S18-R7.1..R7.6)
       TEXT    - no anchor, but the requirement's distinctive terms are present in the
                 case body above a similarity floor (candidate, reported for judgement)
  3. Reverse check: anchors cited by cases that do NOT exist in the current spec.

USAGE
  python3 rederive_coverage.py            # writes requirement-coverage.csv + gaps.json
"""
import csv
import glob
import json
import os
import re
import sys
from collections import Counter, OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.abspath(os.path.join(HERE, ".."))
SPEC_DIR = os.path.join(RS, "spec-current-2026-07-31")
CASES_DIR = os.path.join(RS, "cases")
ID_MAP = os.path.join(RS, "testrail-id-map.csv")

# report prefix (case-id prefix) -> spec file
REPORTS = OrderedDict([
    ("SBC", "Sales-By-Customer-Report-current.md"),
    ("SBR", "Sales-By-Representative-Report-current.md"),
    ("PV", "Parts-Velocity-Report-current.md"),
    ("TU", "Technician-Utilization-Report-current.md"),
    ("WIP", "Work-In-Progress-Report-current.md"),
    ("IV", "Inventory-Value-Report-current.md"),
])
REPORT_NAME = {
    "SBC": "Sales By Customer",
    "SBR": "Sales By Representative",
    "PV": "Parts Velocity",
    "TU": "Technician Utilization",
    "WIP": "Work In Progress",
    "IV": "Inventory Value",
}

REQ_ID = r"S\d+-[RNE]\d+[a-z]?(?:\.\d+)?"
DEF_RE = re.compile(r"^\s*(?:\*|-|\d+\.)\s*\*\*(" + REQ_ID + r")\b")
ANY_RE = re.compile(r"\b(" + REQ_ID + r")\b")
# compressed refs a case may use: "S14-R1/R2/R4" -> S14-R1, S14-R2, S14-R4
COMPRESSED_RE = re.compile(r"\b(S\d+)-([RNE]\d+[a-z]?(?:\.\d+)?(?:/[RNE]?\d+[a-z]?(?:\.\d+)?)+)\b")


def anchors_in(text):
    """Every requirement id a ref string cites, expanding compressed forms."""
    out = set(ANY_RE.findall(text or ""))
    for story, tail in COMPRESSED_RE.findall(text or ""):
        kind = re.match(r"([RNE])", tail).group(1)
        for part in tail.split("/"):
            part = part if re.match(r"[RNE]", part) else kind + part
            out.add(f"{story}-{part}")
    return out
STORY_RE = re.compile(r"^###\s+Story\s+(\d+)\s*:\s*(.*)$")
REQS_START = re.compile(r"^##\s+\d+\.\s+Requirements\s*$")
SECTION_RE = re.compile(r"^##\s+\d+\.\s")


def spec_header(txt):
    """page id / version / last-updated from the capture header."""
    out = {}
    for key, pat in (("page_id", r"pageId:\s*(\S+)"),
                     ("version", r"Current version:\s*(\S+)"),
                     ("updated", r"Last updated:\s*(\S+)"),
                     ("captured", r"Captured:\s*([0-9-]+)")):
        m = re.search(pat, txt)
        out[key] = m.group(1) if m else ""
    return out


def parse_spec(path):
    """-> (header, [requirement dicts], set(all ids mentioned anywhere), removed_stories)"""
    txt = open(path, encoding="utf-8").read()
    lines = txt.split("\n")
    hdr = spec_header(txt)

    # locate the Requirements section
    start = end = None
    for i, ln in enumerate(lines):
        if REQS_START.match(ln):
            start = i
            continue
        if start is not None and SECTION_RE.match(ln):
            end = i
            break
    assert start is not None, path
    end = end if end is not None else len(lines)
    body = lines[start:end]

    reqs = []
    removed = []
    story_no, story_title = "", ""
    cur = None
    for ln in body:
        ms = STORY_RE.match(ln)
        if ms:
            story_no, story_title = ms.group(1), ms.group(2).strip()
            if story_title.lower().startswith("(removed"):
                removed.append((story_no, story_title))
            cur = None
            continue
        md = DEF_RE.match(ln)
        if md:
            rid = md.group(1)
            cur = {
                "id": rid,
                "kind": {"R": "requirement", "N": "negative", "E": "edge"}[re.search(r"-([RNE])", rid).group(1)],
                "story": story_no,
                "story_title": story_title,
                "text": ln.strip().lstrip("*-0123456789. ").strip(),
                "extra": [],
            }
            reqs.append(cur)
            continue
        # continuation lines (nested bullets / table rows) belong to the last req
        if cur is not None and ln.strip():
            if re.match(r"^##", ln):
                cur = None
            else:
                cur["extra"].append(ln.strip())

    for r in reqs:
        r["full"] = (r["text"] + " " + " ".join(r["extra"])).strip()

    mentioned = set(ANY_RE.findall(txt))
    return hdr, reqs, mentioned, removed


STOP = set("""a an the and or of to in on for is are be been was were it its this that
these those with without from by as at not no any all each per when while which who whom
whose if then than so such same other another there here they them their he she his her
you your we our us i me my do does did done can could should would will shall may might
must have has had having only also both either neither every some more most less least
into onto over under above below between within across after before during until unless
about because but however therefore thus hence via using use used shows show shown see
seen note notes still always never yet already even just etc eg ie vs versus one two three
four five six seven eight nine ten first second third new old same different value values
row rows column columns report reports user users page pages data view views etc""".split())


def tokens(s):
    s = s.lower()
    s = re.sub(r"\*\*|`|\||_", " ", s)
    words = re.findall(r"[a-z][a-z0-9%/#().-]{2,}", s)
    return {w.strip(".-()") for w in words if w.strip(".-()") not in STOP and len(w) > 2}


def load_cases():
    active, retired = [], []
    for f in sorted(glob.glob(os.path.join(CASES_DIR, "*.json"))):
        for c in json.load(open(f, encoding="utf-8")):
            c["_file"] = os.path.basename(f)
            (active if c.get("viu_status") == "VIU-Pending" else retired).append(c)
    return active, retired


def case_body(c):
    parts = [c.get("title", ""), c.get("permissions_required", "") or ""]
    for k in ("preconditions", "steps", "expected"):
        parts += list(c.get(k) or [])
    parts.append(c.get("notes", "") or "")
    return "\n".join(parts)


def main():
    idmap = {r["internal_id"]: r["testrail_case_id"]
             for r in csv.DictReader(open(ID_MAP, encoding="utf-8"))}
    active, retired = load_cases()

    by_report_cases = {p: [] for p in REPORTS}
    for c in active + retired:
        p = c["id"].split("-")[0]
        if p in by_report_cases:
            by_report_cases[p].append(c)

    rows = []
    summary = OrderedDict()
    reverse = []          # stale / invented anchors
    headers = {}
    parse_notes = {}

    for prefix, fname in REPORTS.items():
        path = os.path.join(SPEC_DIR, fname)
        hdr, reqs, mentioned, removed = parse_spec(path)
        headers[prefix] = hdr
        defined = {r["id"] for r in reqs}
        parse_notes[prefix] = {
            "defined": len(defined),
            "mentioned_only": sorted(mentioned - defined),
            "removed_stories": removed,
        }

        # ---- anchor index over this report's cases -------------------------
        anchors = {}          # req id -> [case ids]
        for c in by_report_cases[prefix]:
            cited = anchors_in(c.get("spec_ref", ""))
            for a in cited:
                anchors.setdefault(a, []).append(c["id"])
            # reverse check
            for a in cited:
                if a not in defined:
                    reverse.append({
                        "report": prefix, "case": c["id"],
                        "c_id": idmap.get(c["id"], ""),
                        "anchor": a,
                        "active": c.get("viu_status") == "VIU-Pending",
                        "mentioned_in_spec": a in mentioned,
                    })

        # ---- token index for TEXT fallback --------------------------------
        ctok = {c["id"]: tokens(case_body(c)) for c in by_report_cases[prefix]
                if c.get("viu_status") == "VIU-Pending"}

        covered = gaps = 0
        for r in reqs:
            direct = sorted(set(anchors.get(r["id"], [])))
            direct_active = [x for x in direct if any(
                c["id"] == x and c.get("viu_status") == "VIU-Pending" for c in by_report_cases[prefix])]
            direct_retired = [x for x in direct if x not in direct_active]

            parent = []
            if "." in r["id"]:
                pid = r["id"].split(".")[0]
                parent = sorted(set(anchors.get(pid, [])))
                parent = [x for x in parent if any(
                    c["id"] == x and c.get("viu_status") == "VIU-Pending" for c in by_report_cases[prefix])]

            status = "COVERED-DIRECT" if direct_active else ("COVERED-PARENT" if parent else "")
            cases = direct_active or parent

            text_cands = []
            if not status:
                rt = tokens(r["full"])
                if rt:
                    scored = []
                    for cid, tk in ctok.items():
                        inter = rt & tk
                        if inter:
                            scored.append((len(inter) / max(6, len(rt)), len(inter), cid))
                    scored.sort(reverse=True)
                    text_cands = [(round(s, 3), cid) for s, n, cid in scored[:3] if s >= 0.34]
                status = "TEXT-CANDIDATE" if text_cands else "NO-CASE"

            if status.startswith("COVERED"):
                covered += 1
            else:
                gaps += 1

            rows.append({
                "report": REPORT_NAME[prefix],
                "report_prefix": prefix,
                "story": r["story"],
                "story_title": r["story_title"],
                "requirement_id": r["id"],
                "kind": r["kind"],
                "requirement_text": re.sub(r"\s+", " ", r["full"])[:600],
                "status": status,
                "covering_cases": "; ".join(cases),
                "covering_c_ids": "; ".join(idmap.get(x, "") for x in cases),
                "retired_only_anchor": "; ".join(direct_retired) if (not direct_active and direct_retired) else "",
                "text_candidates": "; ".join(f"{cid}({s})" for s, cid in text_cands),
            })

        summary[prefix] = {
            "report": REPORT_NAME[prefix],
            "spec": fname,
            "page_id": hdr["page_id"], "version": hdr["version"],
            "updated": hdr["updated"], "captured": hdr["captured"],
            "requirements": len(reqs),
            "R": sum(1 for r in reqs if r["kind"] == "requirement"),
            "N": sum(1 for r in reqs if r["kind"] == "negative"),
            "E": sum(1 for r in reqs if r["kind"] == "edge"),
            "stories": len({r["story"] for r in reqs}),
            "covered": covered,
            "unmapped": gaps,
            "active_cases": sum(1 for c in by_report_cases[prefix]
                                if c.get("viu_status") == "VIU-Pending"),
        }

    out_csv = os.path.join(HERE, "requirement-coverage.csv")
    with open(out_csv, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    json.dump({"summary": summary, "parse_notes": parse_notes, "reverse_check": reverse},
              open(os.path.join(HERE, "coverage-summary.json"), "w", encoding="utf-8"),
              indent=1)

    tot = sum(s["requirements"] for s in summary.values())
    cov = sum(s["covered"] for s in summary.values())
    print(f"{'report':<28}{'reqs':>6}{'cov':>6}{'unmapped':>10}{'cases':>7}  spec")
    for p, s in summary.items():
        print(f"{s['report']:<28}{s['requirements']:>6}{s['covered']:>6}{s['unmapped']:>10}"
              f"{s['active_cases']:>7}  v{s['version']} {s['updated'][:10]}")
    print(f"{'TOTAL':<28}{tot:>6}{cov:>6}{tot-cov:>10}"
          f"{sum(s['active_cases'] for s in summary.values()):>7}")
    print("\nreverse-check (anchors not defined in current spec):", len(reverse))
    for r in reverse:
        print("  ", r["report"], r["case"], r["c_id"], r["anchor"],
              "ACTIVE" if r["active"] else "retired",
              "(mentioned-in-spec)" if r["mentioned_in_spec"] else "(ABSENT)")
    print("\nunmapped rows written to", out_csv)


if __name__ == "__main__":
    main()
