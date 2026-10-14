#!/usr/bin/env python3
"""Turn the one-click sweep's interaction log and the flow drive's step log into plain text files for
design_text_inventory.py --sweep-text (one visible text per line), so texts that only appear after a hover, click,
type or drag are inventoried too.   python3 -I extract_sweep_text.py <sweep dir> <flows.json> <out dir>"""
import glob, json, os, re, sys
sweep, flows, out = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
for f in glob.glob(os.path.join(sweep, "*", "*-interactions.jsonl")):
    texts = set()
    for line in open(f, encoding="utf-8"):
        r = json.loads(line)
        for k in ("exposed_text",):
            v = r.get(k)
            for t in (v if isinstance(v, list) else re.split(r"\n", v or "")):
                if isinstance(t, dict):
                    t = t.get("text") or t.get("t") or " ".join(str(x) for x in t.values() if isinstance(x, str))
                for piece in re.split(r"\n", t or ""):
                    piece = piece.strip()
                    if piece: texts.add(piece)
    name = os.path.basename(f).replace("-interactions.jsonl", "")
    open(os.path.join(out, f"exposed-{name}.txt"), "w").write("\n".join(sorted(texts)) + "\n")
    print(name, len(texts))
texts = set()
def walk(steps):
    for s in steps:
        if "steps" in s: walk(s["steps"])
        for t in s.get("new_text", []):
            texts.add(re.sub(r"^\[iframe\] |^@(title|aria-label|placeholder): ", "", t))
for fl in json.load(open(flows)):
    walk(fl.get("steps", []))
open(os.path.join(out, "flow-texts.txt"), "w").write("\n".join(sorted(texts)) + "\n")
print("flows", len(texts))
