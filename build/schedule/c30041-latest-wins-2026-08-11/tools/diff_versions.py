#!/usr/bin/env python3
"""READ-ONLY. Diff two cached Confluence version bodies line by line, on the
tag-stripped text, so the deletion is PROVEN from the bodies themselves rather
than from a version comment (the Schedule page carries ten consecutive EMPTY
version comments, which is how four versions of drift went unnoticed).
"""
import difflib
import html
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "..", "evidence", "versions")


def lines(n):
    xml = open(os.path.join(CACHE, f"v{n}.xml")).read()
    out = []
    for m in re.finditer(r"<(h[1-6]|p|li|td|th)\b[^>]*>(.*?)</\1>", xml, re.S):
        txt = html.unescape(re.sub(r"<[^>]+>", "", m.group(2))).strip()
        txt = re.sub(r"\s+", " ", txt)
        if txt:
            out.append(txt)
    return out


if __name__ == "__main__":
    a, b = int(sys.argv[1]), int(sys.argv[2])
    la, lb = lines(a), lines(b)
    print(f"v{a}: {len(la)} content lines   v{b}: {len(lb)} content lines\n")
    n = 0
    for d in difflib.unified_diff(la, lb, f"v{a}", f"v{b}", lineterm="", n=1):
        if d.startswith(("+", "-")) and not d.startswith(("+++", "---")):
            n += 1
        print(d)
    print(f"\nchanged lines: {n}")
