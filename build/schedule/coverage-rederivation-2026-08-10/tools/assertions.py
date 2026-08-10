#!/usr/bin/env python3
"""Split each requirement LINE into its individual ASSERTIONS (Standing Rule 45(e)).

WHY THIS EXISTS, and what it fixes about the previous pass.
The 2026-08-06 Schedule re-derivation verdicted at LINE level: 224 requirement
lines, 0 uncovered. A line, though, routinely carries several separate promises
-- "the tooltip opens after 300-500ms; dismisses on mouse-leave; is read-only;
and flips above the block when there is no room below" is FOUR assertions. A
line-level "covered" can therefore be true of one promise and silently false of
the other three: the Report Suite sweep on 2026-08-10 found exactly that class of
miss, cases that "tested half the promise". Rule 45(e) requires ONE ROW PER
ASSERTION, so the unit of verdict here is the assertion, not the line.

Splitting is deliberately conservative and reversible: every assertion keeps its
parent line's id and text, so a reader can always reassemble the original and
check the split itself. Where the splitter is wrong, the hand pass says so.
READ-ONLY.
"""
import json, re, sys

# A semicolon separates independent promises in this spec's style far more often
# than it joins one; a colon usually introduces a list that IS the promise.
ABBREV = re.compile(r"(?:e\.g|i\.e|vs|approx|Mr|St|no)\.$", re.I)


def split_sentences(text):
    parts, buf = [], ""
    for tok in re.split(r"(?<=[.!?])\s+", text):
        buf = (buf + " " + tok).strip() if buf else tok
        # keep going if we split on an abbreviation or a bare numeral like "4.7"
        if ABBREV.search(buf) or re.search(r"\(§[\d.]*$|\b\d\.$", buf):
            continue
        parts.append(buf)
        buf = ""
    if buf:
        parts.append(buf)
    return parts


def split_clauses(sent):
    """Split a sentence on semicolons, and on ', and ' / ', but ' where both
    halves are substantial. Anything under 25 chars is glued back on -- a
    fragment is not an assertion."""
    bits = [b.strip() for b in re.split(r";\s+", sent) if b.strip()]
    out = []
    for b in bits:
        sub = re.split(r",\s+(?:and|but|while|whereas)\s+(?=[a-z])", b)
        if len(sub) > 1 and all(len(s.strip()) >= 25 for s in sub):
            out.extend(s.strip() for s in sub)
        else:
            out.append(b)
    merged = []
    for o in out:
        if merged and len(o) < 25:
            merged[-1] = merged[-1] + "; " + o
        else:
            merged.append(o)
    return merged


def assertions_of(text):
    out = []
    for s in split_sentences(text):
        out.extend(split_clauses(s))
    out = [a for a in out if a.strip()]
    # This spec writes bullets as "**Control.** A borderless panel-left icon...".
    # The bold lead is a LABEL introducing the bullet, not an assertion of its own,
    # and left alone it yields rows reading only "Control." -- which no case can
    # cover and which would inflate the uncovered count with nothing real. Glue a
    # short label FORWARD onto the promise it introduces. (split_clauses glues short
    # fragments BACKWARD, which is the right rule everywhere else.)
    glued = []
    for a in out:
        if glued and len(glued[-1]) < 25 and glued[-1].endswith("."):
            glued[-1] = glued[-1] + " " + a
        else:
            glued.append(a)
    return glued


def main(extract, out_json):
    recs = json.load(open(extract))
    rows, n = [], 0
    for i, r in enumerate(recs):
        if r["class"] != "REQ":
            continue
        n += 1
        line_id = f"§{r['section']}-L{i+1}"
        parts = assertions_of(r["text"])
        for k, a in enumerate(parts, 1):
            rows.append({"assertion_id": f"{line_id}.A{k}" if len(parts) > 1 else f"{line_id}.A1",
                         "line_id": line_id, "section": r["section"],
                         "section_title": r["section_title"],
                         "tag": r["tag"], "line_text": r["text"], "assertion_text": a,
                         "n_in_line": len(parts)})
    json.dump(rows, open(out_json, "w"), indent=1)
    print(f"requirement lines : {n}")
    print(f"ASSERTIONS        : {len(rows)}")
    print(f"lines carrying >1 : {len({r['line_id'] for r in rows if r['n_in_line']>1})}")
    from collections import Counter
    c = Counter(r["section"] for r in rows)
    print("per section:", dict(sorted(c.items(), key=lambda kv: [int(x) for x in kv[0].split('.')])))


if __name__ == "__main__":
    main(*sys.argv[1:])
