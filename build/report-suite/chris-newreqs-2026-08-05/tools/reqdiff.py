#!/usr/bin/env python3
"""Extract every numbered requirement (Sn-Rn[a]) from a Confluence storage body and diff two versions by anchor."""
import re,sys,html,json
def strip(t):
    t=re.sub(r'<[^>]+>','',t); t=html.unescape(t)
    return re.sub(r'\s+',' ',t).strip()
def reqs(path):
    s=open(path).read(); out={}
    # every <li> that begins with an anchor in <strong>
    for m in re.finditer(r'<li>\s*(?:<p>)?\s*<strong>\s*(S\d+-R\d+[a-z]?)\s*:?\s*</strong>(.*?)</li>', s, re.S):
        a=m.group(1); body=strip(m.group(2))
        if a in out: out[a]+=" || "+body
        else: out[a]=body
    return out
def narrative(path):
    s=open(path).read()
    # everything with <li> not anchored + paragraphs, for prose diff
    return [strip(x) for x in re.findall(r'<(?:p|li|h1|h2|h3|td)>(.*?)</(?:p|li|h1|h2|h3|td)>', s, re.S) if strip(x)]
if __name__=="__main__":
    old,new=sys.argv[1],sys.argv[2]
    A,B=reqs(old),reqs(new)
    print(f"OLD anchors {len(A)}  NEW anchors {len(B)}")
    added=[k for k in B if k not in A]; removed=[k for k in A if k not in B]
    changed=[k for k in B if k in A and A[k]!=B[k]]
    print(f"ADDED {len(added)}: {added}")
    print(f"REMOVED {len(removed)}: {removed}")
    print(f"CHANGED {len(changed)}: {changed}")
    for k in added:
        print(f"\n=== ADDED {k} ===\nNEW: {B[k]}")
    for k in changed:
        print(f"\n=== CHANGED {k} ===\nOLD: {A[k]}\nNEW: {B[k]}")
    for k in removed:
        print(f"\n=== REMOVED {k} ===\nOLD: {A[k]}")
    # prose diff
    NA,NB=narrative(old),narrative(new)
    sa,sb=set(NA),set(NB)
    po=[x for x in NB if x not in sa]; pr=[x for x in NA if x not in sb]
    print(f"\n--- PROSE/NON-ANCHOR blocks only in NEW: {len(po)} ---")
    for x in po: print("  + "+x[:400])
    print(f"--- only in OLD: {len(pr)} ---")
    for x in pr: print("  - "+x[:400])
