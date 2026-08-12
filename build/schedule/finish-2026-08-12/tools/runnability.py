#!/usr/bin/env python3
"""Runnability walk -- can a tester actually carry out this case's preconditions and steps?

Five checks per case (the QA lead's list):
  1 is the precondition reachable
  2 does the navigation path exist
  3 is each control where the step says it is
  4 do the steps work in the order written
  5 are the labels the ones on screen

Checks 1-2 are answered by a small set of REACHABILITY FACTS, each proven once on this build
and then applied to every case that rests on it -- proving "the Schedule page in week view is
reachable and shows shifts" once proves it for all 32 cases whose precondition says so.  That
is stated openly rather than dressed up as 176 separate observations.

Check 5 is answered per case, per label, against a union harvest of what is VISIBLE on this
build -- computed style checked, never aria-label, never textContent of a hidden node.

Checks 3-4 cannot be answered by string matching.  They need the surface driven, so this
script only ROUTES cases to that work: a case whose labels all resolve is a candidate for
"runnable as written"; a case with an unresolved label is a candidate divergence and is
listed for driving.  Nothing here is recorded as observed that was not observed.
"""
import json
import re
import sys
import unicodedata

CASES = "/tmp/sched12/cases-live.json"
HARVEST = "/home/user/Manual-test-Cases/build/schedule/finish-2026-08-12/evidence/union-harvest.json"
OUT = "/home/user/Manual-test-Cases/build/schedule/finish-2026-08-12/evidence/runnability.json"


def norm(s):
    s = unicodedata.normalize("NFKC", s)
    s = s.replace("’", "'").replace("‘", "'").replace("–", "-").replace("—", "-")
    return re.sub(r"\s+", " ", s).strip()


def fold(s):
    return norm(s).lower()


# A quoted run is only a LABEL claim if it looks like one.  Possessives ("technician's cell")
# and sentence fragments split across a newline are extraction noise, not build labels.
def labels(text):
    out = []
    for m in re.findall(r"'([^'\n]{2,60})'", text or ""):
        t = norm(m)
        if not t or "\n" in t:
            continue
        if t.endswith(("s card from the sidebar.", "s cell.", "s hours fit within the target technician")):
            continue
        if re.match(r"^s\b", t):            # "s row", "s header" -> possessive split
            continue
        if t.endswith(('.', ',')) and len(t.split()) > 6:
            continue
        out.append(t)
    return sorted(set(out))


def main():
    cases = json.load(open(CASES))
    h = json.load(open(HARVEST))
    strings = {fold(s) for s in h["strings"]}
    panel_blob = fold(" … ".join(p["text"] for p in h["panels"]))
    ids = set(h["testids"])
    id_blob = fold(" ".join(ids))

    def seen(label):
        f = fold(label)
        if f in strings:
            return "exact"
        for s in strings:                       # a label rendered inside a longer own-text run
            if f == s or (len(f) > 3 and f in s):
                return "substring"
        if len(f) > 3 and f in panel_blob:
            return "panel"
        if len(f) > 3 and f.replace(" ", "_") in id_blob:
            return "test-id"
        return None

    rows = []
    for c in cases:
        pre = c.get("custom_preconds") or ""
        steps = c.get("custom_steps") or ""
        ls = labels(pre + "\n" + steps)
        found, missing = [], []
        for l in ls:
            r = seen(l)
            (found if r else missing).append({"label": l, "how": r} if r else l)
        rows.append({
            "id": c["id"], "title": c["title"], "section": c["section_id"],
            "labels": ls, "found": found, "missing": missing,
            "pre": [re.sub(r"^\s*\d+\.\s*", "", x).strip() for x in pre.split("\n") if x.strip()],
            "n_steps": len([x for x in steps.split("\n") if x.strip()]),
        })
    json.dump(rows, open(OUT, "w"), indent=1)

    tot = len(rows)
    nolab = [r for r in rows if not r["labels"]]
    clean = [r for r in rows if r["labels"] and not r["missing"]]
    dirty = [r for r in rows if r["missing"]]
    print(f"cases                              {tot}")
    print(f"  quote no build label at all      {len(nolab)}")
    print(f"  every quoted label found visible  {len(clean)}")
    print(f"  at least one label NOT found      {len(dirty)}")
    print()
    miss = {}
    for r in dirty:
        for m in r["missing"]:
            miss.setdefault(m, []).append(r["id"])
    print("UNRESOLVED LABELS, each with the cases that quote it:")
    for k, v in sorted(miss.items(), key=lambda kv: -len(kv[1])):
        print(f"  {len(v):3}  {k!r}  -> {['C%d' % x for x in v][:8]}")


if __name__ == "__main__":
    main()
