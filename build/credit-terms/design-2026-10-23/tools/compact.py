#!/usr/bin/env python3
"""Compact per-figure text dump: texts in DOM order with a short class context, the repeated app chrome (header + sidebar) printed once per board."""
import json, sys, os, re
E=sys.argv[1]
for f in sorted(os.listdir(E)):
    if not f.endswith(".json") or f.startswith("_"): continue
    d=json.load(open(os.path.join(E,f)))
    out=[f"#### {d['board']}  title={d['title']!r}\nh2: {d['h2']}\nnote: {d['note']}\nhelmet css:\n{d['helmet_css'].strip()}\n"]
    seen_chrome=None
    for fg in d["figures"]:
        out.append(f"\n== fig {fg['n']} (line {fg['line']}) badge={fg['badge']!r} heading={fg['heading']!r} imgs={[(i['src'],i['alt']) for i in fg['imgs']]}")
        body=[t for t in fg["texts"] if t["kind"]!="caption"]
        # chrome: texts with ctx containing sv-header or sv-sidebar / nav
        chrome=[t["text"] for t in body if re.search(r"sv-(header|sidebar|nav)",t.get("ctx",""))]
        key="|".join(chrome)
        if chrome:
            if key==seen_chrome: out.append("  [app chrome: same as first figure]")
            else: out.append("  [app chrome] "+" · ".join(chrome)); seen_chrome=key
        prev=None; line=[]
        for t in body:
            if re.search(r"sv-(header|sidebar|nav)",t.get("ctx","")): continue
            if t is fg["texts"][0] and False: pass
            c=t.get("ctx","").split(" ")[0]
            tag=f"{t['text']}" + (f"{{{c}}}" if c and c!=prev else "")
            prev=c
            line.append(tag)
        out.append("  "+" | ".join(line))
        out.append("  caption: "+" // ".join(fg["captions"]))
    open(os.path.join(E,"_"+f.replace('.json','.compact.txt')),"w").write("\n".join(out))
    print(f, sum(len(x) for x in out))
