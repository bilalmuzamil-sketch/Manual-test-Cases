#!/usr/bin/env python3
"""Extract EVERY non-blank content line of the Schedule spec (Confluence storage
format) and classify it, so extraction completeness can be PROVEN with zero
unaccounted remainder (Standing Rules 43 + 50).

Read-only. Input: a raw Confluence storage-format body saved to disk.
Output: JSON — one record per content line, with its section anchor and class.

Classes
-------
REQ   requirement-bearing content (a behaviour a test can assert)
HEAD  a heading (structure, not a requirement)
NARR  narrative / rationale / goal / persona prose (no assertable behaviour)
TBLH  table header cell (formatting)
META  document header metadata (Status, Author, Design, Epic ...)
"""
import html
import json
import re
import sys

META_KEYS = {"status", "author", "last updated", "version", "stakeholders",
             "design", "epic", "complete", "product team", "engineering, design, shop operations"}


def content_lines(storage: str):
    """Yield (tag, text, offset) for every non-empty text-bearing element, in order."""
    for m in re.finditer(r"<(h[1-6]|p|li|td|th)\b[^>]*>(.*?)</\1>", storage, re.S):
        tag, inner = m.group(1), m.group(2)
        txt = html.unescape(re.sub(r"<[^>]+>", "", inner)).strip()
        txt = re.sub(r"\s+", " ", txt)
        if txt:
            yield tag, txt, m.start()


def classify(tag, txt, section, in_narrative_section):
    if tag.startswith("h"):
        return "HEAD"
    if tag == "th":
        return "TBLH"
    if section is None:
        return "META" if txt.lower() in META_KEYS or len(txt) < 60 else "NARR"
    if in_narrative_section:
        return "NARR"
    return "REQ"


# §1, §1.1, §2, §13, §15 are narrative / metrics / out-of-scope-future by their own headings
NARRATIVE_SECTIONS = {"1", "1.1", "2", "13", "15"}


def main(path, out):
    storage = open(path).read()
    recs, section, sec_title = [], None, None
    for tag, txt, off in content_lines(storage):
        if tag in ("h2", "h3", "h4"):
            # NB: headings come in BOTH shapes — "6. Grid toolbar" (integer plus a
            # period) and "4.10 Events" (dotted, no period). An earlier version of
            # this regex required whitespace straight after the number, so every
            # bare-integer heading silently failed to match and its content was
            # attributed to the PREVIOUS subsection (§5.2 showed 30 requirement
            # lines and §8.2 showed 60). The optional period is what fixes it.
            m = re.match(r"^(\d+(?:\.\d+)*)\.?\s+(.*)$", txt)
            if m:
                section, sec_title = m.group(1), m.group(2)
        cls = classify(tag, txt, section, section in NARRATIVE_SECTIONS)
        recs.append({"offset": off, "tag": tag, "section": section,
                     "section_title": sec_title, "class": cls, "text": txt})
    json.dump(recs, open(out, "w"), indent=1)

    from collections import Counter
    c = Counter(r["class"] for r in recs)
    print(f"content lines total : {len(recs)}")
    for k in ("HEAD", "REQ", "NARR", "TBLH", "META"):
        print(f"  {k:<5}: {c.get(k, 0)}")
    print(f"accounted for       : {sum(c.values())}")
    print(f"UNACCOUNTED         : {len(recs) - sum(c.values())}")
    reqsec = sorted({r["section"] for r in recs if r["class"] == "REQ"},
                    key=lambda s: [int(x) for x in s.split(".")])
    print(f"sections bearing REQ ({len(reqsec)}): {reqsec}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
