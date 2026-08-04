#!/usr/bin/env python3
"""Emit the per-spec SIDE-BY-SIDE coverage appendices (Rule 45(e)).

Rule 45(e): a "covered" verdict is INVALID unless BOTH TEXTS are quoted side by side. With
1278 assertion rows the quotes cannot all live in one readable document, so they are emitted
one file per spec, in requirement order, and COVERAGE-EXHAUSTIVE.md points at them. Every row
in every file carries the requirement text AND the covering case's expected-result text.
"""
import csv
import os
import sys
from collections import OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))
OUTDIR = os.path.join(ROOT, "side-by-side")
TR = "https://shopview.testrail.io/index.php?/cases/view/"

NAMES = OrderedDict([("SBC", ("Sales By Customer", "v13", "577634305")),
                     ("SBR", ("Sales By Representative", "v15", "585629698")),
                     ("PV", ("Parts Velocity", "v4", "620888066")),
                     ("TU", ("Technician Utilization", "v5", "641400833")),
                     ("WIP", ("Work In Progress", "v6", "703660034")),
                     ("IV", ("Inventory Value", "v3", "720142338"))])


def esc(s):
    return (s or "").replace("|", "\\|").replace("\n", " ").strip()


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    rows = list(csv.DictReader(open(os.path.join(ROOT, "requirement-coverage.csv"))))
    for pfx, (name, ver, pid) in NAMES.items():
        sub = [r for r in rows if r["spec_prefix"] == pfx]
        sub.sort(key=lambda r: (int(r["story"]), r["requirement_id"], int(r["assertion_index"])))
        out = [f"# {name} — requirement-by-requirement side-by-side coverage",
               "",
               f"**Spec:** Confluence pageId **{pid}**, version **{ver}** · "
               f"**{len(set((r['requirement_id']) for r in sub))} requirements** → "
               f"**{len(sub)} assertion rows** (Rule 45(e): one row per assertion).",
               "",
               "Rule 45(e) requires BOTH texts quoted. Column **Requirement / assertion** is "
               "verbatim spec text; column **Covering case's expected result** is verbatim from "
               "the live TestRail case. A verdict with no quote is never written as covered.",
               ""]
        story = None
        for r in sub:
            if r["story"] != story:
                story = r["story"]
                out += ["", f"## Story {story} — {r['story_title']}", "",
                        "| Req | # | Kind | Requirement / assertion (verbatim) | Verdict | "
                        "Covering case | Covering case's expected result (verbatim) |",
                        "|---|---|---|---|---|---|---|"]
            cov = ""
            if r["covering_c_ids"]:
                parts = []
                for iid, cid in zip(r["covering_internal_ids"].split(),
                                    r["covering_c_ids"].split()):
                    parts.append(f"{iid} = [{cid}]({TR}{cid[1:]})")
                cov = "<br>".join(parts)
            q = esc(r["covering_expected_quote_verbatim"])
            if r["quote_from_internal_id"]:
                q = f"*(from {r['quote_from_internal_id']} {r['quote_from_c_id']})* {q}"
            idx = (f"{r['assertion_index']}/{r['assertion_count']}"
                   if r["assertion_count"] != "1" else "1")
            out.append(f"| `{r['requirement_id']}` | {idx} | {r['kind']} | "
                       f"{esc(r['assertion_text_verbatim'])} | **{r['verdict']}** | {cov} | {q} |")
        path = os.path.join(OUTDIR, f"{name.replace(' ', '-')}.md")
        open(path, "w", encoding="utf-8").write("\n".join(out) + "\n")
        print(f"{pfx:4} {len(sub):5} rows -> {os.path.relpath(path, ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
