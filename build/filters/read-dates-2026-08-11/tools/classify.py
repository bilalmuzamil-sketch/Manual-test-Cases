#!/usr/bin/env python3
"""Per-case source inventory for the Filters read-date sweep — READ-ONLY.

For every one of our 114 cases this lists EVERY mention of a source inside the
provenance block and gives each one a verdict:

  CITATION  — the source is supplying the expectation → it gets a read-date
  NEGATIVE  — the source is named only to say it does NOT cover the point
              (e.g. "... has no numbered requirement covering ...", or a Rule-56
              divergence sentence "... says instead that ..."). Stamping one of
              these would assert that the source supports an expectation it
              explicitly does not, so it is deliberately LEFT UNSTAMPED.
  DATED     — already carries ", read on ..." immediately after it.

Nothing is written. The output of this script is the input to the write plan, and
it is what `FINDINGS.md` quotes.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, "..", "snapshots")

PROV = "This is the expected behaviour as per"
S2 = "Last checked against build"

# Ordered list of source patterns. Each is (label, regex).
SOURCES = [
    ("epic", r"epic SV-8785"),
    ("story", r"(?:the owning stor(?:y|ies) |its story |story )SV-\d+(?:(?:,| and) SV-\d+)*"),
    ("spec", r"Filters specification at Confluence version 19 \(published 6 August 2026\)"
             r"(?: \([^)]*\))?"),
    ("spec-bare", r"Filters specification at Confluence version 19(?! \(published)"),
    ("answers-0804", r"build/filters/branko-answers-2026-08-04/answers-ingested\.md"),
    ("answers-0717", r"build/filters/branko-answers-2026-07-17/answers-ingested\.md"),
    ("answers-0731", r"build/filters/branko-answers-2026-07-31/answers-ingested\.md"),
    ("techplan", r"build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign\.md"),
    ("handover", r"[A-Za-z0-9._/\-]*HANDOVER[A-Za-z0-9._/\-]*\.md"),
]

# A mention is NEGATIVE when the text immediately following it says the source
# does not cover the point, or contradicts what the case asserts.
NEG_AFTER = [
    r"^ has no\b", r"^ says instead\b", r"^ does not\b", r"^ is silent\b",
    r"^ says nothing\b", r"^ contains no\b", r"^ asked only\b",
]


def prov_block(exp):
    i = exp.find(PROV)
    if i < 0:
        return None, None, None
    t = exp[i:]
    j = t.find("AUTOMATION:")
    block = t[:j] if j >= 0 else t
    k = block.find(S2)
    return block, (block[:k] if k >= 0 else block), (block[k:] if k >= 0 else "")


def mentions(head):
    """Every source mention in sentence-1 territory, with a verdict."""
    out = []
    for label, rx in SOURCES:
        for m in re.finditer(rx, head):
            after = head[m.end():]
            verdict = "CITATION"
            if after.startswith(", read on"):
                verdict = "DATED"
            else:
                for nrx in NEG_AFTER:
                    if re.search(nrx, after):
                        verdict = "NEGATIVE"
                        break
            out.append({"label": label, "text": m.group(0),
                        "start": m.start(), "end": m.end(), "verdict": verdict,
                        "after": after[:60]})
    out.sort(key=lambda x: x["start"])
    # 'spec' and 'spec-bare' overlap: drop a bare hit inside a full hit
    keep, spans = [], []
    for x in out:
        if any(s <= x["start"] and x["end"] <= e for s, e in spans):
            continue
        keep.append(x)
        spans.append((x["start"], x["end"]))
    return keep


if __name__ == "__main__":
    d = json.load(open(f"{SNAP}/cases-PRE.json"))
    ours = {k: v for k, v in d.items() if v.get("created_by") == 3}
    plan = {}
    tally = {}
    for cid in sorted(ours, key=int):
        exp = ours[cid]["custom_expected"] or ""
        block, head, tail = prov_block(exp)
        assert block is not None, cid
        ms = mentions(head)
        plan[cid] = {"head": head, "tail": tail, "mentions": ms,
                     "atmstatus": ours[cid].get("custom_atmstatus"),
                     "title": ours[cid]["title"]}
        for m in ms:
            tally[(m["label"], m["verdict"])] = tally.get((m["label"], m["verdict"]), 0) + 1
    json.dump(plan, open("/tmp/filters_classify.json", "w"), indent=1)

    print("cases analysed:", len(plan))
    print("\nmention tally (label, verdict) -> count")
    for k in sorted(tally):
        print(f"   {k[0]:<14} {k[1]:<9} {tally[k]}")

    nocit = [c for c, p in plan.items()
             if not [m for m in p["mentions"] if m["verdict"] in ("CITATION", "DATED")]]
    print("\ncases with NO stampable citation at all:", nocit)

    print("\nNEGATIVE mentions, in full (these are deliberately not stamped):")
    for c, p in plan.items():
        for m in p["mentions"]:
            if m["verdict"] == "NEGATIVE":
                print(f"   C{c} [{m['label']}] ...{m['text'][-45:]}{m['after'][:70]!r}")

    print("\nalready-DATED mentions:")
    for c, p in plan.items():
        ds = [m["label"] for m in p["mentions"] if m["verdict"] == "DATED"]
        cs = [m["label"] for m in p["mentions"] if m["verdict"] == "CITATION"]
        if ds:
            print(f"   C{c}: dated={ds} still-undated={cs}")

    if "-v" in sys.argv:
        for c, p in plan.items():
            print("=" * 90)
            print(f"C{c} {p['title'][:70]}")
            print(p["head"])
            for m in p["mentions"]:
                print(f"    [{m['verdict']:<8}] {m['label']:<14} {m['text'][:70]!r}")
