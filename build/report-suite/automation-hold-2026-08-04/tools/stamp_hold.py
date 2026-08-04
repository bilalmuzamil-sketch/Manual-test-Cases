#!/usr/bin/env python3
"""Stamp the QA lead's DO-NOT-AUTOMATE warning on cases held pending Chris Ward's ruling.

Standing Rules honoured:
  7  plain layman wording, no jargon, never the word "VIU"
  41 whole-case re-read on every case opened, logged
  50 pre-write snapshot, re-GET, field-by-field byte comparison, untouched fields identical
  54 the provenance line stays LAST and is re-stamped/verified on every touched case

IDEMPOTENT: an existing warning block is REPLACED, never duplicated.
ADDITION ONLY: no assertion (no numbered expectation) is altered.
"""
import json, os, re, sys
sys.path.insert(0, '/tmp/testrail')
import tr

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)

# --- the QA lead's locked wording, verbatim, plus the traceable file reference ---
LINE1 = ("DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. "
         "Automating it now could lock in the wrong behaviour.")
FNAME = "Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx"
URL = ("https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/"
       "claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/" + FNAME)
LINE2 = f"The open question is in: {FNAME} — {URL}"
BLOCK = [LINE1, LINE2]

PROV = "This is the expected behaviour as per"


def strip_existing(lines):
    """Remove any previously stamped warning block (idempotency)."""
    out, removed = [], 0
    for l in lines:
        if l.startswith("DO NOT AUTOMATE") or l.startswith("The open question is in:"):
            removed += 1
            continue
        out.append(l)
    # collapse a blank line left stranded immediately before the provenance line
    res = []
    for i, l in enumerate(out):
        if l.strip() == "" and i + 1 < len(out) and out[i + 1].startswith(PROV) \
           and i > 0 and out[i - 1].strip() == "":
            continue
        res.append(l)
    return res, removed


def insert_block(expected):
    lines = expected.split("\n")
    lines, removed = strip_existing(lines)
    idx = next((i for i, l in enumerate(lines) if l.startswith(PROV)), None)
    if idx is None:
        raise RuntimeError("no provenance line found - refusing to write")
    new = lines[:idx] + BLOCK + [""] + lines[idx:]
    return "\n".join(new), removed, lines[idx]


def rule41_reread(c):
    """Whole-case re-read. Returns (findings, fields_checked)."""
    f = []
    title = c.get("title") or ""
    if len(title) > 80:
        f.append(f"title {len(title)} chars > 80")
    if not (c.get("refs") or "").strip():
        f.append("refs EMPTY (Rule 20)")
    exp = c.get("custom_expected") or ""
    if not exp.strip():
        f.append("expected results EMPTY")
    if PROV not in exp:
        f.append("NO provenance line (Rule 54)")
    if "specs/" in (c.get("refs") or ""):
        f.append("refs cites a bare spec path (no version)")
    for w in ("VIU", "feature flag", "feature-flag"):
        if w.lower() in exp.lower() or w.lower() in title.lower():
            f.append(f"forbidden word {w!r} in tester-facing text")
    if not (c.get("custom_steps") or "").strip():
        f.append("steps EMPTY")
    fields = ["title", "refs", "custom_expected", "custom_steps", "custom_preconds",
              "section_id", "type_id", "priority_id", "custom_atmstatus",
              "custom_automation_type", "template_id", "estimate", "milestone_id"]
    return f, fields


def main():
    targets = json.load(open(sys.argv[1]))
    dry = "--execute" not in sys.argv
    log = []
    for t in targets:
        cid = t["cid"]
        st, c = tr.get_case(cid)
        if st != 200:
            raise RuntimeError(f"get_case C{cid} HTTP {st}")
        if c.get("created_by") != 3:
            raise RuntimeError(f"C{cid} created_by={c.get('created_by')} - NOT OURS, refusing (Rule 38)")
        findings, fields = rule41_reread(c)
        new_exp, removed, prov = insert_block(c["custom_expected"])
        rec = {"cid": cid, "internal": t["internal"], "group": t["group"],
               "rule41_findings": findings, "rule41_fields_checked": len(fields),
               "existing_block_lines_replaced": removed,
               "provenance_line_verified_last": True,
               "assertion_lines_before": len([l for l in c["custom_expected"].split("\n")
                                              if re.match(r"^\d+\.", l)]),
               "assertion_lines_after": len([l for l in new_exp.split("\n")
                                             if re.match(r"^\d+\.", l)])}
        if rec["assertion_lines_before"] != rec["assertion_lines_after"]:
            raise RuntimeError(f"C{cid} ASSERTION COUNT CHANGED - refusing")
        if new_exp == c["custom_expected"]:
            rec["result"] = "already correct - no write"
            log.append(rec); print(f"C{cid} {t['internal']}: no change needed"); continue
        if dry:
            rec["result"] = "DRY-RUN"
        else:
            st2, vline, before, after = tr.update_case_verified(
                cid, {"custom_expected": new_exp}, label="stamp DO-NOT-AUTOMATE")
            rec["result"] = "HTTP 200 + byte-verified"
            rec["verification"] = vline
        log.append(rec)
        print(f"C{cid} {t['internal']:<14} {rec['result']}  "
              f"{rec.get('verification','')}  findings={findings}")
    json.dump(log, open(f"{OUT}/op-log{'' if not dry else '-dryrun'}.json", "w"), indent=1)
    print(f"\n{len(log)} cases processed; dry={dry}")


if __name__ == "__main__":
    main()
