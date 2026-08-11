#!/usr/bin/env python3
"""READ-ONLY. Pull EVERY Schedule case live and search all tester-facing fields
for the fade/highlight assertion and for the five-field search assertion, so
"does this conflict touch any other case?" is answered by measurement over the
whole population, not by a sample (Standing Rule 50).
"""
import html
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                "..", "..", "coverage-rederivation-2026-08-10", "tools"))
import tr  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(HERE, "..", "evidence")
PROJECT, SUITE, GROUP = 1, 1, 4254

FIELDS = ["title", "custom_preconds", "custom_steps", "custom_expected", "refs"]

PATTERNS = {
    "fade": r"fade|faded|fades",
    "highlight": r"highlight",
    "non-matching": r"non-?matching",
    "five-field search list": r"unit number.{0,40}technician name",
    "restore/clearing": r"\brestor|\bclearing\b",
    "rearrange": r"rearrang",
    "SV-8874": r"SV-8874",
}


def plain(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()


def main():
    secs = tr.paged(f"get_sections/{PROJECT}&suite_id={SUITE}", "sections")
    ids, frontier = set(), [GROUP]
    while frontier:
        p = frontier.pop()
        ids.add(p)
        for s in secs:
            if s.get("parent_id") == p and s["id"] not in ids:
                frontier.append(s["id"])
    cases = [c for c in tr.paged(f"get_cases/{PROJECT}&suite_id={SUITE}", "cases")
             if c.get("section_id") in ids]
    secname = {s["id"]: s["name"] for s in secs}
    print(f"Schedule group {GROUP}: {len(ids)} sections, {len(cases)} cases live")
    json.dump(cases, open(os.path.join(EV, "schedule-all-cases.json"), "w"), indent=1)

    hits = {k: [] for k in PATTERNS}
    for c in cases:
        blob = " || ".join(plain(str(c.get(f) or "")) for f in FIELDS)
        for k, pat in PATTERNS.items():
            for m in re.finditer(pat, blob, re.I):
                a, b = max(0, m.start() - 110), min(len(blob), m.end() + 110)
                hits[k].append({"id": c["id"], "title": c["title"],
                                "section": secname.get(c["section_id"]),
                                "refs": c.get("refs"), "context": blob[a:b]})
                break
    json.dump(hits, open(os.path.join(EV, "assertion-scan.json"), "w"), indent=1)
    for k, v in hits.items():
        print(f"\n### {k}: {len(v)} case(s)")
        for h in v:
            print(f"  C{h['id']} [{h['section']}] {h['title'][:70]}")
            print(f"      …{h['context'][:220]}…")
    # authorship census, so a foreign case is never touched (Rule 38)
    authors = {}
    for c in cases:
        authors.setdefault(c.get("created_by"), []).append(c["id"])
    print("\ncreated_by census:", {k: len(v) for k, v in authors.items()})
    print("non-ours (created_by != 3):", [i for k, v in authors.items() if k != 3 for i in v])


if __name__ == "__main__":
    main()
