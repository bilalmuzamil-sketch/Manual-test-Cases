#!/usr/bin/env python3
"""Rule 124 gap proof: every KIND of text a design crawl showed (screens, hover/click/type/drag results, tooltips; record
data as placeholders) that NO case of ours mentions. Each listed entry must then be classified by hand:
DATA / COVERED (C-id) / OUT-OF-SCOPE (ruling) / SPEC-CONFLICT (PO question) / CASE-NEEDED (write the case).
  python3 design_gap_scan.py --crawl <crawl dir holding one sub-dir per display> --cases <dir of C*.json snapshots>
                             --out <file stem> [--owner 3]
Writes <stem>.json and <stem>.md and prints the counts."""
import argparse, json, glob, re, html, collections, importlib.util, os
ap = argparse.ArgumentParser(); ap.add_argument("--crawl", required=True); ap.add_argument("--cases", required=True)
ap.add_argument("--out", required=True); ap.add_argument("--owner", type=int, default=3); a = ap.parse_args()
spec = importlib.util.spec_from_file_location("c", os.path.join(os.path.dirname(__file__), "crawl_design_states.py"))
c = importlib.util.module_from_spec(spec); spec.loader.exec_module(c)
dirs = [d for d in sorted(glob.glob(os.path.join(a.crawl, "*"))) if os.path.exists(os.path.join(d, "states.jsonl")) and not d.endswith("-audit")]
for d in dirs:
    for l in open(os.path.join(d, "states.jsonl")):
        for k in json.loads(l).get("keys", []):
            p = k.split("|")
            if p[0] == "img" and re.fullmatch(r"[A-Z][a-z]+(?: [A-Z][a-z]+)+", p[3]): c.NAMES.add(p[3])
texts = collections.defaultdict(set); where = collections.defaultdict(set)
for d in dirs:
    w = os.path.basename(d)
    for l in open(os.path.join(d, "states.jsonl")):
        s = json.loads(l)
        for t in s["lines"]: texts[c.shape(t)].add(t); where[c.shape(t)].add(f"{w}:screen {s['id']}")
    for l in open(os.path.join(d, "actions.jsonl")):
        r = json.loads(l)
        for t in (r.get("new_text") or []) + ([r["tooltip"]] if r.get("tooltip") else []):
            for part in t.split(" | "):
                part = re.sub(r"^(title|data-tip-text|data-tip|aria-label)=", "", part)
                texts[c.shape(part)].add(part); where[c.shape(part)].add(f"{w}:{r['action'].split(':')[0]} '{r.get('label','')[:30]}' on screen {r['state']}")
cases = " ".join(html.unescape(re.sub(r"<[^>]+>", " ", (j.get("custom_preconds") or "") + (j.get("custom_steps") or "") + (j.get("custom_expected") or "") + j["title"]))
                 for j in (json.load(open(f)) for f in glob.glob(os.path.join(a.cases, "C*.json"))) if j["created_by"] == a.owner).lower().replace("’", "'")
gap = []
for sh, ex in texts.items():
    e = sorted(ex)[0]
    if len(e) < 2 or re.fullmatch(r"[#N\W\d]+", sh) or sh in ("#NAME", "#WO"): continue
    if e.lower().replace("’", "'") in cases: continue
    gap.append({"shape": sh, "example": e, "variants": len(ex), "seen": sorted(where[sh])[:5], "seen_count": len(where[sh])})
gap.sort(key=lambda g: -g["seen_count"])
json.dump(gap, open(a.out + ".json", "w"), indent=1, ensure_ascii=False)
open(a.out + ".md", "w").write("# Design text not mentioned in any case\n\n" + "\n".join(f"- `{g['example']}` ({g['variants']} variants; seen {g['seen_count']}×, e.g. {g['seen'][0]})" for g in gap) + "\n")
print("distinct kinds of text:", len(texts), "· not in any case:", len(gap), "→ classify every one")
