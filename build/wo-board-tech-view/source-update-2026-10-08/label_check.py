#!/usr/bin/env python3
"""Every on-screen word a draft tells the tester to click or read (text in double quotes inside preconditions and steps)
must appear somewhere in the design (template text, one-click sweep, every crawled screen and action) or in the PRD.
Re-run after the crawl finishes; prints the labels found nowhere, with the cases that use them."""
import json, glob, re, collections, html
D = "build/wo-board-tech-view"
corpus = []
corpus.append(open(f"{D}/sources/design-2026-10-08-upload/Work Orders.dc.html").read())
corpus.append(open(f"{D}/sources/design-2026-10-08-upload/wo-details/Add Part.html").read())
corpus.append(open(f"{D}/sources/CONFLUENCE-845185030-WO-BoardView-TechView-PRD-v33-edited-2026-10-07.md").read())
for f in glob.glob(f"{D}/source-update-2026-10-08/design-drive/*/*pages.txt") + glob.glob(f"{D}/source-update-2026-10-08/design-drive/*/*interactions.jsonl"):
    corpus.append(open(f).read())
for f in glob.glob(f"{D}/source-update-2026-10-08/design-crawl/*/states.jsonl") + glob.glob(f"{D}/source-update-2026-10-08/design-crawl/*/actions.jsonl"):
    corpus.append(open(f).read())
C = html.unescape("\n".join(corpus)).lower().replace("’", "'")
miss = collections.defaultdict(list); n = 0
for f in sorted(glob.glob(f"{D}/source-update-2026-10-08/proposals-*.json")):
    d = json.load(open(f))
    for p in d["updates"] + d["new"]:
        k = p.get("case_id") or p.get("key")
        for line in p["preconds"] + p["steps"]:
            for lab in re.findall(r'"([^"]{2,60})"', line):
                n += 1
                if lab.lower().replace("’", "'") not in C and not lab.startswith(("ZZAUTOTEST", "e.g")):
                    miss[lab].append(str(k))
print("quoted labels checked:", n, "· not found in design or PRD:", len(miss))
for lab, ks in sorted(miss.items(), key=lambda x: -len(x[1])): print(f"  {lab!r}: {', '.join(ks[:8])}{' …' if len(ks) > 8 else ''}")
