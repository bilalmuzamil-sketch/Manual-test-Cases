#!/usr/bin/env python3
"""
run_format_check_group.py — driver that runs the EXISTING mechanical
tester-readiness checks (check_tester_readiness.check_case) over EVERY case
under a TestRail section GROUP (a parent section and all its descendants).

READ-ONLY. get_sections / get_cases only. No write verb exists here.

It exists because check_tester_readiness.py takes ONE --section, while a project
suite is a tree of sections under a group (Report Suite = group 4281). Paging is
mandatory: an unpaged get_sections returns 250 and silently finds zero.

Usage:
  python3 build/testing-tools/run_format_check_group.py --group 4281 \
      --created-by 3 --outdir build/report-suite/format-check-2026-08-21
"""
import argparse
import csv
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from check_tester_readiness import load_creds, tr_get, check_case  # noqa: E402


def paged(path, key, creds):
    out, offset = [], 0
    while True:
        page = tr_get(f"{path}&limit=250&offset={offset}", creds)
        chunk = page.get(key, page) if isinstance(page, dict) else page
        if not chunk:
            break
        out.extend(chunk)
        if len(chunk) < 250:
            break
        offset += 250
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--group", required=True, type=int)
    ap.add_argument("--project", default="1")
    ap.add_argument("--suite", default="1")
    ap.add_argument("--created-by", type=int, default=None)
    ap.add_argument("--outdir", required=True)
    a = ap.parse_args()

    creds = load_creds()
    if not creds[0]:
        return 2

    sections = paged(f"get_sections/{a.project}&suite_id={a.suite}", "sections", creds)
    by_id = {s["id"]: s for s in sections}
    # descendants of the group, by walking parent_id upward
    def in_group(sid):
        seen = set()
        while sid and sid not in seen:
            if sid == a.group:
                return True
            seen.add(sid)
            sid = (by_id.get(sid) or {}).get("parent_id")
        return False

    group_sections = {s["id"] for s in sections if in_group(s["id"])}

    all_cases = paged(f"get_cases/{a.project}&suite_id={a.suite}", "cases", creds)
    scoped = [c for c in all_cases if c.get("section_id") in group_sections]
    foreign = [c for c in scoped
               if a.created_by is not None and c.get("created_by") != a.created_by]
    ours = [c for c in scoped
            if a.created_by is None or c.get("created_by") == a.created_by]

    os.makedirs(a.outdir, exist_ok=True)
    per_check, rows = {}, []
    for case in sorted(ours, key=lambda c: c.get("id", 0)):
        fails, _ = check_case(case)
        cid = f"C{case['id']}"
        for f in fails:
            per_check.setdefault(f.split(" ", 1)[1].split(" (")[0], []).append(cid)
        rows.append({
            "case_id": cid,
            "url": f"https://shopview.testrail.io/index.php?/cases/view/{case['id']}",
            "section_id": case.get("section_id"),
            "section": (by_id.get(case.get("section_id")) or {}).get("name", ""),
            "title": case.get("title", ""),
            "title_len": len(case.get("title") or ""),
            "verdict": "FAIL" if fails else "PASS",
            "reasons": "; ".join(fails),
        })

    if not rows:
        sys.stderr.write("no cases matched that group/created-by selection\n")
        return 2
    csv_path = os.path.join(a.outdir, "RESULTS.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    failed = [r for r in rows if r["verdict"] == "FAIL"]
    print(f"SECTIONS IN ESTATE (paged) : {len(sections)}")
    print(f"SECTIONS UNDER GROUP {a.group} : {len(group_sections)}")
    print(f"CASES IN ESTATE (paged)    : {len(all_cases)}")
    print(f"CASES UNDER GROUP          : {len(scoped)}  (ours {len(ours)} / foreign {len(foreign)})")
    print(f"SCORED                     : {len(rows)} of {len(ours)} (100%, no sampling)")
    print(f"PASSED {len(rows)-len(failed)}  FAILED {len(failed)}")
    for k, v in sorted(per_check.items(), key=lambda kv: -len(kv[1])):
        print(f"  {k:<34} {len(v)}")
    print("FOREIGN C-IDS (excluded, Rule 38): " +
          (", ".join(f"C{c['id']}" for c in foreign) or "none"))
    print(f"CSV -> {csv_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
