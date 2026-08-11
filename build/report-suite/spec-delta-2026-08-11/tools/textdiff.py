#!/usr/bin/env python3
"""GROUND-TRUTH document diff, attributed to the requirement that OWNS the text.

Why this exists, and why spec_compare.py alone is not enough:
spec_compare.py slices the body from each anchor to the NEXT anchor. That span
frequently belongs to a DIFFERENT requirement -- a rule that CROSS-REFERENCES an
anchor sits in the span attributed to that anchor. Parts Velocity is the live
proof: the span for `S4-R1` changed, but S4-R1's own definition ("A column picker
is accessible via a toolbar button...") is byte-identical in both versions; the
text that actually moved is the LOCATION-COLUMN requirement, which merely
mentions S4-R1 in passing.

Attributing a change to the wrong requirement is the same class of error as
Rule 31 trap (c): it is confidently wrong and it looks rigorous.

So: diff the flattened text word by word, then attribute each changed region to
the nearest DEFINING anchor at or before it -- a defining occurrence being
`S<n>-<T><m>:` with a colon, which is how these six specs declare a requirement.
"""
import difflib, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from spec_compare import PAIRS, flatten, EV

DEF = re.compile(r"\bS\d+-(?:R|E|N|Q)\d+[a-z]?(?=\s*:)")
HEAD = re.compile(r"\b(?:Story \d+|Change Log|Key Decisions|Terminology|Error Handling)\b")

def owner_map(flat):
    """word-index -> (defining anchor, heading) in force at that point."""
    words = flat.split(" ")
    owners, cur, head = [], None, None
    pos = 0
    for w in words:
        seg = flat[pos:pos+len(w)+1]
        m = DEF.search(seg)
        if m: cur = m.group(0)
        h = HEAD.search(seg)
        if h: head = h.group(0)
        owners.append((cur, head)); pos += len(w)+1
    return words, owners

def diff(name, slug, pv, lv):
    a = flatten(open(f"{EV}/{slug}-v{pv}.xml").read())
    b = flatten(open(f"{EV}/{slug}-v{lv}.xml").read())
    aw, ao = owner_map(a); bw, bo = owner_map(b)
    sm = difflib.SequenceMatcher(None, aw, bw, autojunk=False)
    regions = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal": continue
        oa = ao[i1][0] if i1 < len(ao) else None
        ob = bo[j1][0] if j1 < len(bo) else None
        ha = ao[i1][1] if i1 < len(ao) else None
        hb = bo[j1][1] if j1 < len(bo) else None
        regions.append({
            "op": tag, "owner_pinned": oa, "owner_live": ob,
            "heading_pinned": ha, "heading_live": hb,
            "removed": " ".join(aw[i1:i2]), "added": " ".join(bw[j1:j2]),
            "n_removed": i2-i1, "n_added": j2-j1,
        })
    return regions

if __name__ == "__main__":
    allr = {}
    for name,(slug,pv,lv) in PAIRS.items():
        if pv == lv:
            print(f"\n### {name}: v{pv} is live — no diff"); allr[name]=[]; continue
        rs = diff(name, slug, pv, lv)
        allr[name] = rs
        print(f"\n### {name}: v{pv} -> v{lv} — {len(rs)} changed region(s)")
        for k,r in enumerate(rs,1):
            print(f"\n  [{k}] {r['op']}  owner={r['owner_live'] or r['owner_pinned']}  "
                  f"heading={r['heading_live'] or r['heading_pinned']}  "
                  f"(-{r['n_removed']} +{r['n_added']} words)")
            if r["removed"]: print(f"      REMOVED: {r['removed'][:600]}")
            if r["added"]:   print(f"      ADDED  : {r['added'][:600]}")
    json.dump(allr, open(f"{EV}/textdiff.json","w"), indent=1)
    print(f"\ntotal regions: {sum(len(v) for v in allr.values())}")
