#!/usr/bin/env python3
"""restamp_eligibility.py — decide, per case, whether the COMMITTED EVIDENCE shows
its asserted on-screen labels were actually compared against a harvest taken from
build v3.5-65d6500.

THE BAR (deliberately strict).  A case is eligible ONLY if it quotes at least one
on-screen label AND every one of those labels is present as a VISIBLE string in
the union harvest.  Everything else is left alone and listed:

  RESTAMP    every quoted label matched a visible string from this build
  AMBIGUOUS  at least one label was not found on a surface this build's harvest
             reached, or matched only an aria-label / test-id.  A string search
             cannot tell an assertion from a negation, so a case asserting a
             control is ABSENT lands here too - correctly, because it needs a
             human to read it.
  NO-LABEL   the case quotes no on-screen label at all, so nothing about it was
             ever compared against the build.  Being present during a pass is not
             being checked.

Deliberately NOT eligible on mechanical grounds alone: a case merely present in a
pass's snapshot.  An over-claimed stamp is worse than a stale one.
"""
import json, re, os

ROOT = "/home/user/Manual-test-Cases/build/schedule"
OUT = f"{ROOT}/verify-final-2026-08-12/evidence"

H = json.load(open(f"{OUT}/union-harvest.json"))
VIS = set(H["visible"])
VIS_LOWER = {v.lower(): v for v in VIS}
VIS_BLOB_L = "\n".join(VIS).lower()
ACC_BLOB_L = "\n".join(H["accessible"]).lower()

CASES = json.load(open("/tmp/sched/live-2026-08-12b.json"))

# Strings inside quotes that are plainly not UI labels: our own throwaway data,
# deliberate placeholder wording (Rule 42), numbers, and prose caught by the regex.
SKIP = re.compile(
    r"(ZZAUTOTEST|^\d|^[a-z] |^N [A-Z]|\bN Lines\b|\+N more|^\s*$|\.\s*$|^and |^the |^with )",
    re.I)


def quoted(text):
    return re.findall(r"'([^']{2,60})'", text or "")


rows, per_case = [], {}
for c in sorted(CASES, key=lambda x: x["id"]):
    labels, seen = [], []
    for f in ("title", "custom_preconds", "custom_steps", "custom_expected"):
        labels += quoted(c.get(f) or "")
    for l in labels:
        l = l.strip()
        if not l or SKIP.search(l) or l in seen:
            continue
        seen.append(l)

    verdicts = []
    for l in seen:
        ll = l.lower()
        if l in VIS:
            v = "OK-exact"
        elif ll in VIS_LOWER:
            v = "OK-casing-differs"
        elif ll in VIS_BLOB_L:
            v = "OK-substring"
        elif ll in ACC_BLOB_L:
            v = "ARIA-ONLY"
        else:
            v = "NOT-FOUND"
        verdicts.append(v)
        rows.append({"case": c["id"], "label": l, "verdict": v})

    if not seen:
        bucket = "NO-LABEL"
    elif all(v.startswith("OK-") and v != "OK-casing-differs" for v in verdicts):
        bucket = "RESTAMP"
    else:
        bucket = "AMBIGUOUS"
    per_case[c["id"]] = {
        "bucket": bucket,
        "labels": seen,
        "verdicts": verdicts,
        "bad": sorted({l for l, v in zip(seen, verdicts)
                       if not (v.startswith("OK-") and v != "OK-casing-differs")}),
    }

json.dump({"per_case": per_case, "rows": rows}, open(f"{OUT}/restamp-eligibility.json", "w"), indent=1)

import collections
b = collections.Counter(v["bucket"] for v in per_case.values())
print("buckets:", dict(b))
print("label verdicts:", dict(collections.Counter(r["verdict"] for r in rows)))
print()
for name in ("RESTAMP", "AMBIGUOUS", "NO-LABEL"):
    ids = sorted(k for k, v in per_case.items() if v["bucket"] == name)
    print(f"{name} ({len(ids)}):", ids if name != "NO-LABEL" else f"{len(ids)} cases")
