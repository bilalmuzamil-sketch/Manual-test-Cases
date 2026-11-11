#!/usr/bin/env python3
"""Mechanical checks for the A/R and A/P V1 regression suite. Exit 1 on any PROBLEM.

    python3 build/ar-ap-report-sorting/v1-regression/tools/check.py [--repo /home/user/shopview]

Checks:
  cases   - SOURCE line present and leading with the V1 repo + commit; exactly one AUTOMATION marker and
            it is the last thing; title <= 80 characters; no step holding two actions; preconditions,
            steps and expected present; every invariant named exists.
  register- every invariant has a new case, an existing PRD-suite case, or a written reason; every
            CHANGED/REMOVED-BY-DESIGN row carries a document quote; every POSSIBLY LOST row has a case
            and a PO question; every quoted sentence is word for word in the saved PRD v11; every
            existing PRD-suite key is in the id map.
  sources - (with --repo) every V1 citation names a file that exists at fc08f23 and a line range inside it.
"""
import argparse
import csv
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE))
import inventory as I  # noqa: E402

MARKER = re.compile(r"^AUTOMATION: (READY|READY - EXPECT FAIL \(.+\)|HOLD - .+)$")
ACTION_VERBS = r"(click|open|type|press|pick|set|read|find|look|scroll|reload|choose|tick|point|move|add|close|switch|go)"
TWO_ACTIONS = [
    re.compile(r"\b(and|then)\s+" + ACTION_VERBS + r"\b", re.I),
    re.compile(r",\s*then\b", re.I),
    re.compile(r"\.\s+[A-Z]"),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", help="path to the ShopView/shopview checkout, to verify V1 citations")
    a = ap.parse_args()
    problems = []

    cases = json.loads((ROOT / "cases" / "cases.json").read_text(encoding="utf-8"))
    inv_ids = {i["id"] for i in I.INV}
    for c in cases:
        cid = c["id"]
        if len(c["title"]) > 80:
            problems.append(f"{cid}: title {len(c['title'])} > 80")
        if not c["source"].startswith("SOURCE: " + I.V1_LABEL + ", "):
            problems.append(f"{cid}: SOURCE line missing or not leading with the V1 repo and commit")
        markers = [x for x in [c["marker"]] + c["expected"] + [c["provenance"]] if x.startswith("AUTOMATION:")]
        if len(markers) != 1 or not MARKER.match(c["marker"]):
            problems.append(f"{cid}: needs exactly one valid AUTOMATION marker, found {markers}")
        if not (c["preconditions"] and c["steps"] and c["expected"]):
            problems.append(f"{cid}: preconditions, steps or expected empty")
        for n, s in enumerate(c["steps"], 1):
            if any(p.search(s.replace("Est. ", "Est ")) for p in TWO_ACTIONS):
                problems.append(f"{cid}: step {n} may hold two actions: {s!r}")
        for x in c["invariants"]:
            if x not in inv_ids:
                problems.append(f"{cid}: unknown invariant {x}")
        if "EXPECT FAIL" in c["marker"] and not any(e.startswith("(1)") for e in c["expected"]):
            problems.append(f"{cid}: EXPECT FAIL without the three outcomes")

    md = (ROOT / "cases" / "CASES.md").read_text(encoding="utf-8")
    for c in cases:
        block = md.split(f"## {c['id']} ")[1].split("\n## ")[0].rstrip()
        if not block.endswith(c["marker"]):
            problems.append(f"{c['id']}: marker is not the last line of the case in CASES.md")

    prd = (ROOT / "sources" / "PRD-947650561-v11-2026-11-05.md").read_text(encoding="utf-8")
    with (ROOT / "sources" / "PRD-SUITE-ID-MAP-group-90418.csv").open(encoding="utf-8") as fh:
        idm = {r["key"] for r in csv.DictReader(fh)}
    wc = {w["inv"]: w for w in json.loads((ROOT / "what-changed.json").read_text(encoding="utf-8"))}
    served = {x for c in cases for x in c["invariants"]}
    for i in I.INV:
        iid = i["id"]
        if iid not in served and not i.get("existing") and not i.get("reason"):
            problems.append(f"{iid}: in the register with no case and no written reason")
        if i["status"] in ("CHANGED-BY-DESIGN", "REMOVED-BY-DESIGN"):
            q = wc[iid]["quote"]
            if not q:
                problems.append(f"{iid}: {i['status']} without a document quote")
            elif q["text"] not in prd:
                problems.append(f"{iid}: quote not found word for word in PRD v11: {q['text'][:60]!r}")
        if i["status"] == "POSSIBLY LOST" and (iid not in served or not i.get("po")):
            problems.append(f"{iid}: POSSIBLY LOST needs a case and a PO question")
        for k in i.get("existing", []):
            if k not in idm:
                problems.append(f"{iid}: existing key {k} not in the PRD-suite id map")
        if i["status"] not in ("KEPT", "CHANGED-BY-DESIGN", "REMOVED-BY-DESIGN", "POSSIBLY LOST", "UNCLEAR"):
            problems.append(f"{iid}: unknown status {i['status']}")

    checked = 0
    if a.repo:
        sizes = {}
        for i in I.INV:
            for ct in i["cite"]:
                m = re.match(r"^(.+?):(\d+)(?:-(\d+))?$", ct)
                if not m:
                    problems.append(f"{i['id']}: citation without line numbers: {ct}")
                    continue
                path, lo, hi = m.group(1), int(m.group(2)), int(m.group(3) or m.group(2))
                if path not in sizes:
                    r = subprocess.run(["git", "-C", a.repo, "show", f"{I.V1_COMMIT}:{path}"], capture_output=True, text=True)
                    sizes[path] = len(r.stdout.splitlines()) if r.returncode == 0 else -1
                if sizes[path] < 0:
                    problems.append(f"{i['id']}: {path} does not exist at {I.V1_COMMIT}")
                elif not (1 <= lo <= hi <= sizes[path]):
                    problems.append(f"{i['id']}: {ct} outside the file ({sizes[path]} lines)")
                checked += 1

    for p in problems:
        print("PROBLEM", p)
    print(f"cases {len(cases)}  invariants {len(I.INV)}  citations checked against the repo {checked}  problems {len(problems)}")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
