#!/usr/bin/env python3
"""Map every live case to its report folder, and index its full text."""
import json, os, re, html, sys
HERE=os.path.dirname(os.path.abspath(__file__)); SNAP=os.path.join(HERE,"..","snapshots")
def load(tag="PRE"):
    cases=json.load(open(f"{SNAP}/cases-{tag}.json"))
    secs=json.load(open(f"{SNAP}/sections-{tag}.json"))
    byid={s["id"]:s for s in secs}
    def chain(sid):
        out=[]
        while sid and sid in byid:
            out.append(byid[sid]["name"]); sid=byid[sid].get("parent_id")
        return list(reversed(out))
    rep={}
    for c in cases:
        ch=chain(c["section_id"])
        # ch[0] == 'Reports Suite'; ch[1] == report folder
        c["_chain"]=ch
        c["_report"]=ch[1] if len(ch)>1 else "(root)"
        c["_leaf"]=ch[-1] if ch else ""
    return cases
def text(c):
    parts=[c.get("title") or "", c.get("custom_preconds") or "", c.get("custom_steps") or "",
           c.get("custom_expected") or "", c.get("refs") or ""]
    t=" \n ".join(parts)
    return html.unescape(re.sub(r"<[^>]+>"," ",t))
if __name__=="__main__":
    cs=load()
    from collections import Counter
    print(Counter(c["_report"] for c in cs))
    print("ours:",sum(1 for c in cs if c["created_by"]==3),"foreign:",sum(1 for c in cs if c["created_by"]!=3))
