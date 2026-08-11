#!/usr/bin/env python3
"""Per-report comparison of the PINNED specification version against the LIVE one.

Two jobs, kept strictly apart because they answer different questions:

  (1) ANCHOR EXISTENCE — does every requirement anchor our cases cite still
      exist in the live body? A moved requirement can leave a case pinned to an
      anchor that is GONE, and that is a finding for STALE-ANCHORS.md.

  (2) ANCHOR TEXT — for every anchor that exists in BOTH versions, is its own
      text byte-identical? This is Rule 31 trap (c) in mechanical form: a page's
      version number says NOTHING about the age of a rule inside it, so a rule is
      dated by diffing ITS OWN text across versions, never by the page's date.

Nothing here re-verdicts a case. A materially changed requirement is RECORDED for
a later Rule-43 coverage re-derivation; re-pinning is this pass's job, re-judging
is not.
"""
import html
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(HERE, "..", "evidence")

# report -> (slug, pinned_version, live_version)
PAIRS = {
    "Sales By Customer":       ("Sales-By-Customer", 16, 17),
    "Sales By Representative": ("Sales-By-Representative", 17, 18),
    "Parts Velocity":          ("Parts-Velocity", 5, 6),
    "Technician Utilization":  ("Technician-Utilization", 7, 7),
    "Work In Progress":        ("Work-In-Progress", 10, 11),
    "Inventory Value":         ("Inventory-Value", 4, 5),
}

ANCHOR = re.compile(r"\bS\d+-(?:R|E|N|Q)\d+[a-z]?\b")


def flatten(xml):
    """Storage XML -> plain text. Tags become a single space so that a word can
    never be silently glued to its neighbour across a tag boundary."""
    t = re.sub(r"<[^>]+>", " ", xml)
    t = html.unescape(t)
    return re.sub(r"\s+", " ", t).strip()


def anchor_texts(flat):
    """Map every anchor to the text that follows it up to the NEXT anchor.
    That span is the requirement's own wording, which is what Rule 31 trap (c)
    says must be diffed.

    CORRECTED 2026-08-11, and the correction is the point: an earlier draft used
    `setdefault`, keeping only each anchor's FIRST occurrence. An anchor is often
    CROSS-REFERENCED before it is DEFINED, so the first occurrence is frequently a
    passing mention rather than the requirement, and comparing only that reported
    Sales By Representative as "0 anchors changed" when its Location-column rule
    had in fact been rewritten wholesale. That is a FALSE ALL-CLEAR — the exact
    failure mode Rule 45(e) exists to prevent — so EVERY occurrence is kept and
    the full ordered list is compared."""
    hits = list(ANCHOR.finditer(flat))
    out = {}
    for i, m in enumerate(hits):
        end = hits[i + 1].start() if i + 1 < len(hits) else len(flat)
        out.setdefault(m.group(0), []).append(flat[m.start():end].strip())
    return out


def load(slug, ver):
    p = os.path.join(EV, f"{slug}-v{ver}.xml")
    return flatten(open(p).read())


if __name__ == "__main__":
    report = {}
    for name, (slug, pv, lv) in PAIRS.items():
        live = load(slug, lv)
        live_a = anchor_texts(live)
        if pv == lv:
            print(f"\n=== {name}: pinned v{pv} IS the live version — no diff to run")
            report[name] = {"pinned": pv, "live": lv, "moved": False,
                            "anchors_live": len(live_a), "gone": [], "added": [],
                            "changed": []}
            continue
        old = load(slug, pv)
        old_a = anchor_texts(old)
        gone = sorted(set(old_a) - set(live_a))
        added = sorted(set(live_a) - set(old_a))
        changed = sorted(a for a in (set(old_a) & set(live_a)) if old_a[a] != live_a[a])
        print(f"\n=== {name}: v{pv} -> v{lv}")
        print(f"  anchors: v{pv}={len(old_a)}  v{lv}={len(live_a)}")
        print(f"  GONE in live      : {len(gone)} {gone}")
        print(f"  ADDED in live     : {len(added)} {added}")
        print(f"  TEXT CHANGED      : {len(changed)} {changed}")
        report[name] = {"pinned": pv, "live": lv, "moved": True,
                        "anchors_pinned": len(old_a), "anchors_live": len(live_a),
                        "gone": gone, "added": added, "changed": changed,
                        "changed_detail": {a: {"pinned": old_a[a], "live": live_a[a]}
                                           for a in changed}}
        json.dump({a: {"pinned": old_a[a], "live": live_a[a]} for a in changed},
                  open(os.path.join(EV, f"{slug}-v{pv}-to-v{lv}-changed-anchors.json"), "w"), indent=1)
    json.dump(report, open(os.path.join(EV, "spec-compare.json"), "w"), indent=1)
    print("\nwrote evidence/spec-compare.json")
