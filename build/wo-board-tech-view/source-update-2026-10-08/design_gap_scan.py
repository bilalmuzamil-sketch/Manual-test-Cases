#!/usr/bin/env python3
"""After the crawl: every distinct KIND of text the design showed (screens, hover/click/type/drag results, tooltips),
with record data as placeholders, that appears in NO live case of ours. Output: design-gap-scan.json + .md."""
import json, glob, re, html, collections, sys, importlib.util
B = "build/wo-board-tech-view/source-update-2026-10-08"
spec = importlib.util.spec_from_file_location("c", "build/testing-tools/crawl_design_states.py"); c = importlib.util.module_from_spec(spec); spec.loader.exec_module(c)
texts = collections.defaultdict(set)  # shape -> examples ; where
where = collections.defaultdict(set)
for w in ("list", "tech", "board"):
    for l in open(f"{B}/design-crawl/{w}/states.jsonl"):
        s = json.loads(l)
        for k in s.get("keys", []):
            p = k.split("|")
            if p[0] == "img" and re.fullmatch(r"[A-Z][a-z]+(?: [A-Z][a-z]+)+", p[3]): c.NAMES.add(p[3])
for w in ("list", "tech", "board"):
    for l in open(f"{B}/design-crawl/{w}/states.jsonl"):
        s = json.loads(l)
        for t in s["lines"]: texts[c.shape(t)].add(t); where[c.shape(t)].add(f"{w}:screen {s['id']}")
    for l in open(f"{B}/design-crawl/{w}/actions.jsonl"):
        r = json.loads(l)
        for t in (r.get("new_text") or []) + ([r["tooltip"]] if r.get("tooltip") else []):
            for part in t.split(" | "):
                part = re.sub(r"^(title|data-tip-text|data-tip|aria-label)=", "", part)
                texts[c.shape(part)].add(part); where[c.shape(part)].add(f"{w}:{r['action'].split(':')[0]} '{r.get('label','')[:30]}' on screen {r['state']}")
cases = " ".join(html.unescape(re.sub(r"<[^>]+>", " ", (j.get("custom_preconds") or "") + (j.get("custom_steps") or "") + (j.get("custom_expected") or "") + j["title"]))
                 for j in (json.load(open(f)) for f in glob.glob(f"{B}/snapshots-final/C*.json")) if j["created_by"] == 3).lower().replace("’", "'")
gap = []
for sh, ex in texts.items():
    e = sorted(ex)[0]
    if len(e) < 2 or re.fullmatch(r"[#N\W\d]+", sh) or sh in ("#NAME", "#WO"): continue
    if e.lower().replace("’", "'") in cases: continue
    gap.append({"shape": sh, "example": e, "variants": len(ex), "seen": sorted(where[sh])[:5], "seen_count": len(where[sh])})
gap.sort(key=lambda g: -g["seen_count"])
json.dump(gap, open(f"{B}/design-gap-scan.json", "w"), indent=1, ensure_ascii=False)
open(f"{B}/design-gap-scan.md", "w").write("# Design text not mentioned in any case (after the full crawl)\n\n" + "\n".join(f"- `{g['example']}` ({g['variants']} variants; seen {g['seen_count']}×, e.g. {g['seen'][0]})" for g in gap) + "\n")
print("distinct kinds of text:", len(texts), "· not in any case:", len(gap))
