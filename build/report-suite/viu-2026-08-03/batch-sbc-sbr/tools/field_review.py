#!/usr/bin/env python3
"""field_review.py — the objective half of the per-case FULL FIELD REVIEW for the SBC + SBR cases.

Checks, per case, the things that can be decided mechanically and completely (Rule 17):
  title       : present, <= 80 chars (the QA lead's TestRail-display rule), and consistent with the
                case's own expected results (keyword overlap check flags suspicious pairs)
  precond     : present and numbered
  steps       : present and numbered
  expected    : present, numbered, and screened for brittle closed enumerations (Rule 42) —
                "exactly", "only these", "no other", "the complete list"
  references  : present, and carries BOTH a Jira ticket key AND a spec anchor (Rule 20), with the
                anchor checked for EXISTENCE in the live-captured spec
  section     : any API content (endpoint / HTTP verb / status code) must sit in an "API" section (Rule 4)
  notes       : screened for the Rule-49 non-final-build marker

Writes field-review.json next to the batch deliverables. Read-only; touches no TestRail.
"""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]           # repo root
BATCH = Path(__file__).resolve().parents[1]
CASES_DIR = ROOT / "build/report-suite/cases"
IDMAP = ROOT / "build/report-suite/testrail-id-map.csv"
SPECS = ROOT / "build/report-suite/spec-watch-verification-2026-08-03/live-capture-2026-08-03"
SPEC_FILES = {
    "SBC": SPECS / "Sales-By-Customer-Report-current-2026-08-03.md",
    "SBR": SPECS / "Sales-By-Representative-Report-current-2026-08-03.md",
}
TITLE_MAX = 80
BUILD_MARKER = "v3.4.1-0ed4433"

API_PAT = re.compile(
    r"(/api/|\bHTTP\b|\bGET\b|\bPOST\b|\bPUT\b|\bPATCH\b|\bDELETE\b|"
    r"\b(?:200|201|204|400|401|403|404|409|422|500)\b|endpoint|payload|response body)", re.I)
BRITTLE_PAT = re.compile(r"\b(exactly|only these|no other|the complete list|and nothing else)\b", re.I)
TICKET_PAT = re.compile(r"\bSV-\d+\b")
ANCHOR_PAT = re.compile(r"\bS\d+-[RNE]\d+[a-z]?\b")


def load_cases():
    out = {}
    for f in CASES_DIR.glob("*.json"):
        for c in json.loads(f.read_text()):
            out[c["id"]] = c
    return out


def spec_anchors(rep):
    txt = SPEC_FILES[rep].read_text()
    return set(ANCHOR_PAT.findall(txt)), txt


def numbered(lines):
    return bool(lines) and all(re.match(r"^\s*\d+[.)]", str(l)) for l in lines)


def main():
    cases = load_cases()
    idmap = {r["internal_id"]: r for r in csv.DictReader(IDMAP.open())}
    mine = [i for i in idmap if i.split("-")[0] in ("SBC", "SBR")]
    anchors = {rep: spec_anchors(rep) for rep in ("SBC", "SBR")}

    rows = []
    for iid in sorted(mine, key=lambda x: (x.split("-")[0], x)):
        c = cases[iid]
        rep = iid.split("-")[0]
        known_anchors, spec_txt = anchors[rep]
        title = c.get("title", "")
        exp = c.get("expected", []) or []
        steps = c.get("steps", []) or []
        pre = c.get("preconditions", []) or []
        refs = c.get("spec_ref", "") or ""
        section = idmap[iid]["section"]
        notes = c.get("notes", "") or ""
        blob = " ".join([*pre, *steps, *exp])

        # --- references: ticket + anchor, and does the anchor still exist? ---
        tickets = TICKET_PAT.findall(refs)
        cited = ANCHOR_PAT.findall(refs)
        missing_anchors = [a for a in cited if a not in known_anchors]
        if not refs:
            ref_verdict = "MISSING — no reference at all (Rule 20 fail)"
        elif not tickets:
            ref_verdict = "EDIT NEEDED — no Jira ticket key (Rule 20 requires ticket AND anchor)"
        elif not cited:
            ref_verdict = "EDIT NEEDED — no spec anchor (Rule 20 requires ticket AND anchor)"
        elif missing_anchors:
            ref_verdict = f"EDIT NEEDED — anchor(s) not in the current spec: {','.join(missing_anchors)}"
        else:
            ref_verdict = f"OK — {','.join(sorted(set(tickets)))} + {','.join(cited)}"

        # --- section vs API content (Rule 4) ---
        api_hits = sorted({h.strip() for h in API_PAT.findall(blob)})
        is_api_section = "API" in section.upper()
        if api_hits and not is_api_section:
            sec_verdict = f"EDIT NEEDED — API content ({', '.join(api_hits[:4])}) outside an API section"
        elif is_api_section and not api_hits:
            sec_verdict = "REVIEW — in an API section but no API content detected"
        else:
            sec_verdict = "OK"

        # --- title ---
        t_issues = []
        if not title:
            t_issues.append("missing")
        if len(title) > TITLE_MAX:
            t_issues.append(f"{len(title)} chars > {TITLE_MAX}")
        title_verdict = "OK" if not t_issues else "EDIT NEEDED — " + "; ".join(t_issues)

        # --- title vs expected coherence: do they share meaningful words? ---
        def words(s):
            return {w.lower() for w in re.findall(r"[A-Za-z%#]{4,}", s)}
        overlap = words(title) & words(" ".join(map(str, exp)))
        tve = "OK" if len(overlap) >= 2 else "REVIEW — title and expected share <2 significant words"

        # --- brittle enumerations (Rule 42) ---
        brittle = [str(e) for e in exp if BRITTLE_PAT.search(str(e))]
        exp_verdict = "OK" if exp and numbered(exp) else (
            "EDIT NEEDED — expected results missing" if not exp else "EDIT NEEDED — expected results not numbered")
        if brittle and exp_verdict == "OK":
            exp_verdict = f"REVIEW — closed enumeration ({len(brittle)}): needs a version-pinned anchor or scope-conditional wording (Rule 42)"

        rows.append({
            "internal_id": iid,
            "cid": idmap[iid]["testrail_case_id"],
            "link": f"https://shopview.testrail.io/index.php?/cases/view/{idmap[iid]['testrail_case_id'].lstrip('C')}",
            "report": rep,
            "area": c.get("area", ""),
            "section": section,
            "title": title,
            "title_len": len(title),
            "f_title": title_verdict,
            "f_title_vs_expected": tve,
            "f_preconditions": "OK" if pre and numbered(pre) else ("EDIT NEEDED — missing" if not pre else "EDIT NEEDED — not numbered"),
            "f_steps": "OK" if steps and numbered(steps) else ("EDIT NEEDED — missing" if not steps else "EDIT NEEDED — not numbered"),
            "f_expected": exp_verdict,
            "f_references": ref_verdict,
            "f_section": sec_verdict,
            "f_notes": ("OK — build marker present" if BUILD_MARKER in notes
                        else "EDIT NEEDED — add the non-final-build marker (build v3.4.1-0ed4433, observed 2026-08-04) per Rule 49"),
            "refs_raw": refs,
            "cited_anchors": ",".join(cited),
            "brittle_count": len(brittle),
            "brittle_text": " || ".join(b[:200] for b in brittle[:2]),
            "api_hits": ",".join(api_hits[:6]),
        })

    out = BATCH / "evidence/field-review.json"
    out.write_text(json.dumps(rows, indent=1))
    # summary
    from collections import Counter
    print(f"cases reviewed: {len(rows)}  (SBC {sum(1 for r in rows if r['report']=='SBC')} / "
          f"SBR {sum(1 for r in rows if r['report']=='SBR')})")
    for f in ("f_title", "f_title_vs_expected", "f_preconditions", "f_steps", "f_expected",
              "f_references", "f_section", "f_notes"):
        c = Counter(r[f].split(" —")[0] for r in rows)
        print(f"  {f:24s} {dict(c)}")
    print("\nTITLES over 80 chars:", sum(1 for r in rows if r["title_len"] > TITLE_MAX))
    print("BRITTLE enumerations:", sum(1 for r in rows if r["brittle_count"]))
    print("API content outside an API section:", sum(1 for r in rows if r["f_section"].startswith("EDIT")))
    print("REFERENCE problems:", sum(1 for r in rows if not r["f_references"].startswith("OK")))
    print("wrote", out)


if __name__ == "__main__":
    main()
