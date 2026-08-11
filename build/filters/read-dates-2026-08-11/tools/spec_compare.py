#!/usr/bin/env python3
"""Rule 31 trap (a): confirm the Filters spec by CONTENT, never by the version
number alone.

The page's IN-BODY "Version:" field reads 1.6 and has read 1.6 for months; only
the Confluence version integer is honest. But even a matching integer is not
proof our mirror is the same text, so this script flattens the live storage-format
body the same way our committed v19 mirror was flattened and reports:

  * sha256 of both flattened texts
  * the WORD-RUN diff in BOTH directions (runs of 6+ words present in one and
    absent from the other) — the same method the 2026-08-05 Schedule pass used,
    which is robust to the two mirrors' slightly different flatteners.

Zero writes. Read-only.
"""
import html
import re
import sys


def flatten(xml: str) -> str:
    t = xml
    t = re.sub(r"<ri:[^>]*>", " ", t)
    t = re.sub(r"<[^>]+>", "\n", t)
    t = html.unescape(t)
    t = re.sub(r"[ \t\xa0]+", " ", t)
    t = "\n".join(l.strip() for l in t.split("\n"))
    t = re.sub(r"\n{2,}", "\n", t).strip()
    return t


def runs(text, n=6):
    w = re.findall(r"[A-Za-z0-9§._\-/]+", text.lower())
    return {" ".join(w[i:i + n]) for i in range(max(0, len(w) - n + 1))}


if __name__ == "__main__":
    live = flatten(open(sys.argv[1]).read())
    mirror = open(sys.argv[2]).read()
    import hashlib
    print("live  flattened:", len(live), "chars  sha256",
          hashlib.sha256(live.encode()).hexdigest()[:16])
    print("mirror         :", len(mirror), "chars  sha256",
          hashlib.sha256(mirror.encode()).hexdigest()[:16])
    a, b = runs(live), runs(mirror)
    only_live = sorted(a - b)
    only_mirror = sorted(b - a)
    print(f"\n6-word runs LIVE-only (would be NEW text): {len(only_live)}")
    for r in only_live[:25]:
        print("   +", r)
    print(f"\n6-word runs MIRROR-only (would be REMOVED text): {len(only_mirror)}")
    for r in only_mirror[:25]:
        print("   -", r)
    # requirement anchors, both directions
    ra = set(re.findall(r"\bS\d+-[RNEQ]\d+[a-z]?\b", live))
    rb = set(re.findall(r"\bS\d+-[RNEQ]\d+[a-z]?\b", mirror))
    print(f"\nrequirement anchors: live {len(ra)} | mirror {len(rb)} | "
          f"live-only {sorted(ra - rb)} | mirror-only {sorted(rb - ra)}")
    open("../evidence/spec-v19-live-flattened-2026-08-11.txt", "w").write(live)
