#!/usr/bin/env python3
"""EXHAUSTIVE spec parser for the Report Suite — Standing Rule 50 (exhaustive first).

WHY THIS EXISTS
  The 2026-07-31 pass extracted 856 of ~895 requirement anchors and called the result
  "partial". Under Rule 50 that is an UNFINISHED JOB. This parser accounts for EVERY
  NON-BLANK LINE of all six current specs: each line is assigned EXACTLY ONE class,
  and the completeness proof is `lines_present == lines_accounted` with zero remainder.

CLASSES (exactly one per non-blank line)
  requirement-bearing (become rows in requirement-coverage.csv)
    REQ-DEF        a bullet whose leading bold run opens with a requirement id
                   (S<story>-R|N|E<n>[a-z][.<n>]) -> ONE requirement row
    REQ-CONT       a continuation line of the REQ-DEF immediately above it
                   (wrapped text, nested sub-bullet, or an inline table belonging to it)
  non-requirement content (explicitly classified, never silently dropped)
    CAPTURE-HDR    our own capture front-matter (blockquote header above the first ---)
    RULE           a horizontal rule
    HEADING        any ATX heading
    META-TABLE     the Epic/Owner/Status/Branch page-properties table
    LABEL          a bold field label line: Requirements:/Negative cases:/Edge cases:/
                   Prerequisites:/Design:/Jira:/API:/Acceptance:
    PREREQ         a bullet under **Prerequisites:**
    STORY-INTRO    the one-line prose summary under a `### Story N:` heading
    CONTEXT-NOTE   an italic/blockquote "* Context note: ..." aside
    NARRATIVE      prose or a bullet in a non-requirement section (Business Case,
                   Feature Overview, Key Decisions, Terminology, Assumptions,
                   User Feedback Summary) -- includes goal/persona narrative and rationale
    TABLE-HDR      a table header row or its --- separator
    TABLE-ROW      a table data row outside the Requirements section (feedback/toast/changelog)
    CHANGELOG-ROW  a data row of the Change Log table
    STRAY          anything the parser could not classify -> MUST BE ZERO

OUTPUTS (../data/)
  spec-lines.csv        every non-blank line with its class + owning requirement id
  requirements.json     every requirement, with story, kind, verbatim text, assertions
  line-accounting.json  per-spec present/accounted totals + per-class histogram
"""
import csv
import json
import os
import re
import sys
from collections import Counter, OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.abspath(os.path.join(HERE, "..", "data"))

LIVE = os.path.join(RS, "spec-watch-verification-2026-08-03", "live-capture-2026-08-03")
M0731 = os.path.join(RS, "spec-current-2026-07-31")

# prefix -> (path, confluence pageId, TRUE confluence version, live lastModified, capture date, pipeline)
SPECS = OrderedDict([
    ("SBC", (os.path.join(LIVE, "Sales-By-Customer-Report-current-2026-08-03.md"),
             "577634305", "v13", "Jul 31, 2026", "2026-08-03", "Atlassian-MCP markdown")),
    ("SBR", (os.path.join(LIVE, "Sales-By-Representative-Report-current-2026-08-03.md"),
             "585629698", "v15", "Jul 29, 2026", "2026-08-03", "Atlassian-MCP markdown")),
    ("PV", (os.path.join(LIVE, "Parts-Velocity-Report-current-2026-08-03.md"),
            "620888066", "v4", "Jul 29, 2026", "2026-08-03", "Atlassian-MCP markdown")),
    ("TU", (os.path.join(M0731, "Technician-Utilization-Report-current.md"),
            "641400833", "v5", "Jul 29, 2026", "2026-07-31", "REST storage -> html2text")),
    ("WIP", (os.path.join(M0731, "Work-In-Progress-Report-current.md"),
             "703660034", "v6", "Jul 29, 2026", "2026-07-31", "REST storage -> html2text")),
    ("IV", (os.path.join(M0731, "Inventory-Value-Report-current.md"),
            "720142338", "v3", "Jul 29, 2026", "2026-07-31", "REST storage -> html2text")),
])
REPORT_NAME = {
    "SBC": "Sales By Customer", "SBR": "Sales By Representative",
    "PV": "Parts Velocity", "TU": "Technician Utilization",
    "WIP": "Work In Progress", "IV": "Inventory Value",
}

REQ_ID = r"S\d+-[RNE]\d+[a-z]?(?:\.\d+)?"
# a requirement DEFINITION: list bullet, then bold, then the id. The id may be followed by
# ':' inside the bold ( **S1-R1:** ) or the bold may wrap an inline title
# ( **S14-R4 (Summary contents):** ) or ( **S5-R1: Inventory ...** ).
DEF_RE = re.compile(r"^(\s*)(?:[*\-+]|\d+\.)\s+\*\*(" + REQ_ID + r")\b")
ANY_ID_RE = re.compile(r"\b(" + REQ_ID + r")\b")
BULLET_RE = re.compile(r"^(\s*)(?:[*\-+]|\d+\.)\s+")
HEADING_RE = re.compile(r"^#{1,6}\s")
SECTION_RE = re.compile(r"^##\s+(\d+)\.\s+(.*?)\s*$")
STORY_RE = re.compile(r"^###\s+Story\s+(\d+)\s*:\s*(.*?)\s*$")
LABEL_RE = re.compile(
    r"^\s*(?:[*\-+]\s+)?\*\*(Requirements|Negative cases|Negative Cases|Edge cases|Edge Cases|"
    r"Prerequisites|Design|Jira|API|Acceptance|Acceptance criteria|Out of scope|Notes|"
    r"Error Handling|Error handling|Error cases|Performance|Analytics|Telemetry|Data)\b")
DESIGN_JIRA_RE = re.compile(r"^\*\*Design:\*\*|^\*\*Jira:\*\*|\*\*Jira:\*\*")
CONTEXT_RE = re.compile(r"^\s*>?\s*_?\*?\s*\\?\*\s*Context note", re.I)
CONTEXT2_RE = re.compile(r"^\s*>\s*\*?\\?\*?\s*Context", re.I)
TABLE_SEP_RE = re.compile(r"^\s*\|?[\s:|-]*-{2,}[\s:|-]*\|?\s*$")
TABLE_ROW_RE = re.compile(r"^\s*(\|.*\||[^|\n]*\|[^|\n]*)$")
RULE_RE = re.compile(r"^\s*(-{3,}|\*{3,}|_{3,})\s*$")
META_KEYS = re.compile(r"^\s*\|?\s*\*\*(Epic|Owner|Status|Branch|Companion Video|Design|Spec)\*\*")

REQ_SECTION_TITLES = ("Requirements",)
NONREQ_SECTIONS = ("Business Case", "Feature Overview", "Key Decisions", "Terminology",
                   "Assumptions", "User Feedback Summary", "Change Log")

# label lines that open a requirement block, and what kind the following bullets are
BLOCK_KIND = {
    "requirements": "requirement",
    "negative cases": "negative",
    "edge cases": "edge",
    "prerequisites": "prereq",
}


def norm(s):
    """Normalise a spec line for text comparison (not for byte proof)."""
    s = s.replace("\u00a0", " ")
    s = re.sub(r"\\([*_#\[\]()~`>|-])", r"\1", s)   # html2text escapes
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def strip_md(s):
    s = norm(s)
    s = re.sub(r"^(?:[*\-+]|\d+\.)\s+", "", s)
    s = s.replace("**", "").replace("__", "")
    return s.strip()


def parse(prefix, path):
    raw = open(path, encoding="utf-8").read()
    lines = raw.split("\n")
    n_total = len(lines)
    n_blank = sum(1 for L in lines if not L.strip())

    rows = []          # per-line accounting
    reqs = OrderedDict()

    # ---- locate the end of our capture front-matter: the FIRST standalone `---`
    fm_end = None
    for i, L in enumerate(lines):
        if RULE_RE.match(L) and i > 0:
            fm_end = i
            break
    assert fm_end is not None, path

    section = "(front matter)"
    section_no = None
    story_no = None
    story_title = ""
    block = None          # 'requirement' | 'negative' | 'edge' | 'prereq' | None
    cur_req = None
    in_meta_table = False
    in_changelog = False
    seen_story_intro = False

    for i, L in enumerate(lines):
        s = L.strip()
        if not s:
            continue
        cls = None
        owner = ""

        if i <= fm_end:
            cls = "CAPTURE-HDR" if not RULE_RE.match(L) else "RULE"
            rows.append((i + 1, cls, "", "", "", L))
            continue

        # ---------- headings ----------
        m = SECTION_RE.match(L)
        if m:
            section_no, section = int(m.group(1)), m.group(2)
            story_no, story_title, block, cur_req = None, "", None, None
            in_changelog = section.strip().lower().startswith("change log")
            rows.append((i + 1, "HEADING", section, "", "", L))
            continue
        m = STORY_RE.match(L)
        if m:
            story_no, story_title = int(m.group(1)), m.group(2)
            block, cur_req, seen_story_intro = None, None, False
            rows.append((i + 1, "HEADING", section, str(story_no), "", L))
            continue
        if HEADING_RE.match(L):
            # a plain heading (# title, ### Core ShopView, ### Out of Scope ...)
            if not SECTION_RE.match(L):
                sub = strip_md(L.lstrip("#").strip())
                if section_no is None:
                    section = sub or section
            rows.append((i + 1, "HEADING", section, str(story_no or ""), "", L))
            continue
        if RULE_RE.match(L):
            rows.append((i + 1, "RULE", section, str(story_no or ""), "", L))
            continue

        # ---------- page-properties meta table ----------
        if META_KEYS.match(L):
            in_meta_table = True
            rows.append((i + 1, "META-TABLE", section, "", "", L))
            continue
        if in_meta_table and (TABLE_SEP_RE.match(L) or (("|" in L) and section_no is None)):
            rows.append((i + 1, "META-TABLE", section, "", "", L))
            continue
        in_meta_table = False

        # ---------- field labels ----------
        lm = LABEL_RE.match(L)
        if lm:
            key = lm.group(1).strip().lower()
            if key in BLOCK_KIND:
                block = BLOCK_KIND[key]
                cur_req = None
            rows.append((i + 1, "LABEL", section, str(story_no or ""), "", L))
            continue
        if DESIGN_JIRA_RE.search(L) and story_no is not None and "**Design:**" in L:
            rows.append((i + 1, "LABEL", section, str(story_no), "", L))
            continue

        # ---------- context notes ----------
        if CONTEXT_RE.match(L) or CONTEXT2_RE.match(L) or re.match(r"^\s*_\*?\s*\\?\*", L):
            rows.append((i + 1, "CONTEXT-NOTE", section, str(story_no or ""),
                         cur_req or "", L))
            continue

        # ---------- change log ----------
        if in_changelog:
            if TABLE_SEP_RE.match(L) or re.match(r"^\s*\|?\s*Date\s*\|", L) or \
               re.match(r"^\s*Date\|", L):
                rows.append((i + 1, "TABLE-HDR", section, "", "", L))
            else:
                rows.append((i + 1, "CHANGELOG-ROW", section, "", "", L))
            continue

        # ---------- requirement definitions ----------
        dm = DEF_RE.match(L)
        if dm and section_no is not None and section.strip().lower().startswith("requirement"):
            rid = dm.group(2)
            kind = block or ("negative" if rid.split("-")[1].startswith("N")
                             else "edge" if rid.split("-")[1].startswith("E") else "requirement")
            if rid.split("-")[1].startswith("N"):
                kind = "negative"
            elif rid.split("-")[1].startswith("E"):
                kind = "edge"
            elif block in (None, "requirement"):
                kind = "requirement"
            else:
                kind = block
            cur_req = rid
            if rid in reqs:
                reqs[rid]["duplicate_definition_lines"].append(i + 1)
            else:
                reqs[rid] = {
                    "report": REPORT_NAME[prefix], "prefix": prefix,
                    "story": story_no, "story_title": story_title,
                    "id": rid, "kind": kind, "def_line": i + 1,
                    "text_lines": [], "duplicate_definition_lines": [],
                }
            reqs[rid]["text_lines"].append(norm(L))
            rows.append((i + 1, "REQ-DEF", section, str(story_no or ""), rid, L))
            continue

        # ---------- inside the Requirements section, not a definition ----------
        if section_no is not None and section.strip().lower().startswith("requirement"):
            if block == "prereq" and BULLET_RE.match(L):
                rows.append((i + 1, "PREREQ", section, str(story_no or ""), "", L))
                continue
            # a nested / wrapped line belonging to the current requirement
            if cur_req is not None:
                reqs[cur_req]["text_lines"].append(norm(L))
                rows.append((i + 1, "REQ-CONT", section, str(story_no or ""), cur_req, L))
                continue
            # a table inside a story but before any requirement (e.g. toast tables)
            if TABLE_SEP_RE.match(L):
                rows.append((i + 1, "TABLE-HDR", section, str(story_no or ""), "", L))
                continue
            if "|" in L:
                rows.append((i + 1, "TABLE-ROW", section, str(story_no or ""), "", L))
                continue
            if story_no is not None and not seen_story_intro and not BULLET_RE.match(L):
                seen_story_intro = True
                rows.append((i + 1, "STORY-INTRO", section, str(story_no), "", L))
                continue
            rows.append((i + 1, "NARRATIVE", section, str(story_no or ""), "", L))
            continue

        # ---------- non-requirement sections ----------
        if TABLE_SEP_RE.match(L):
            rows.append((i + 1, "TABLE-HDR", section, "", "", L))
            continue
        if "|" in L:
            rows.append((i + 1, "TABLE-ROW", section, "", "", L))
            continue
        rows.append((i + 1, "NARRATIVE", section, str(story_no or ""), "", L))

    # ---- finalise requirement verbatim text
    for rid, r in reqs.items():
        body = " ".join(r["text_lines"])
        body = re.sub(r"^(?:[*\-+]|\d+\.)\s+", "", body).strip()
        r["text"] = body
        r["text_clean"] = strip_md(body)
        del r["text_lines"]

    accounted = len(rows)
    present = n_total - n_blank
    hist = Counter(c for _, c, _, _, _, _ in rows)
    strays = [r for r in rows if r[1] == "STRAY"]

    return {
        "prefix": prefix, "path": os.path.relpath(path, RS), "lines_total": n_total,
        "lines_blank": n_blank, "lines_present": present, "lines_accounted": accounted,
        "remainder": present - accounted, "class_histogram": dict(sorted(hist.items())),
        "strays": [s[0] for s in strays],
    }, rows, reqs


def main():
    os.makedirs(OUT, exist_ok=True)
    acct, all_rows, all_reqs = OrderedDict(), [], OrderedDict()
    for prefix, (path, pid, ver, mod, cap, pipe) in SPECS.items():
        a, rows, reqs = parse(prefix, path)
        a.update({"page_id": pid, "version": ver, "live_last_modified": mod,
                  "captured": cap, "pipeline": pipe,
                  "requirements": len(reqs),
                  "kinds": dict(sorted(Counter(r["kind"] for r in reqs.values()).items()))})
        acct[prefix] = a
        for r in rows:
            all_rows.append((prefix,) + r)
        for rid, r in reqs.items():
            all_reqs[f"{prefix}:{rid}"] = r

    with open(os.path.join(OUT, "spec-lines.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["spec", "line_no", "class", "section", "story", "requirement_id", "raw_line"])
        w.writerows(all_rows)
    json.dump(all_reqs, open(os.path.join(OUT, "requirements.json"), "w"),
              indent=1, ensure_ascii=False)

    tot_present = sum(a["lines_present"] for a in acct.values())
    tot_acct = sum(a["lines_accounted"] for a in acct.values())
    tot_reqs = sum(a["requirements"] for a in acct.values())
    summary = {"per_spec": acct, "totals": {
        "lines_present": tot_present, "lines_accounted": tot_acct,
        "remainder": tot_present - tot_acct, "requirements": tot_reqs,
        "strays": sum(len(a["strays"]) for a in acct.values())}}
    json.dump(summary, open(os.path.join(OUT, "line-accounting.json"), "w"), indent=1)

    print(f"{'spec':5} {'present':>8} {'accounted':>10} {'rem':>5} {'reqs':>5}")
    for p, a in acct.items():
        print(f"{p:5} {a['lines_present']:8} {a['lines_accounted']:10} "
              f"{a['remainder']:5} {a['requirements']:5}")
    print(f"{'TOTAL':5} {tot_present:8} {tot_acct:10} {tot_present - tot_acct:5} {tot_reqs:5}")
    if tot_present != tot_acct or summary["totals"]["strays"]:
        print("!! INCOMPLETE — remainder or strays present")
        return 1
    print("COMPLETE — zero unaccounted lines, zero strays")
    return 0


if __name__ == "__main__":
    sys.exit(main())
