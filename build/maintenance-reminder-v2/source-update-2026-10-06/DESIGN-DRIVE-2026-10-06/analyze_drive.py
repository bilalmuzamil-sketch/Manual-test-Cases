#!/usr/bin/env python3
"""Post-process the drive_design_full.py outputs for the MR V2 design package (2026-10-06).
Writes: coverage.json, exposed-catalogue.json/.md, spec-compare-candidates.md (helper lists for human review).
Run: python3 analyze_drive.py   (from anywhere; paths are absolute)"""
import json, re, pathlib, collections, difflib

OUT = pathlib.Path(__file__).resolve().parent
SRC = OUT.parents[1] / "sources"
SPECS = {"Chunk 1": SRC / "CONFLUENCE-886931488-Chunk1-MR-2026-10-06.md", "Chunk 2": SRC / "CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md"}
BOARDS = ["Chunk 1", "Chunk 2", "Maintenance Reminders", "Maintenance Reminders - Flow Map", "Maintenance Reminders Demo",
          "Canned lines per location - proposal", "4-work-order (old WO chrome)", "SettingsSidebar", "ShopviewHeader"]

# ---- story tagging (artboard id -> story), from the artboard index and the spec's story list -----------------------
C1 = {
 "S1 Create a maintenance schedule": "s2b s3new s3one ma mb v1",
 "S2 Add a routine service": "c1 c2b c2 r4 r7 t1 t2 t3 c2all t5 r5 r5a r5b c6",
 "S2 Add a routine service / S5 Reminder timing": "c7",
 "S3 Compliance inspection service": "c4 k02 r6 k03",
 "S4 Canned lines": "d1 r4ro r8",
 "S6 Edit/archive a schedule": "e02 c5 c3 e04e e04r r1 s2arch r2 r3 s3 m7",
 "S7 Enrol an asset": "m4 x1 x1s x1t x1r cs0 x4a x4b x4c x4d mf",
 "S8 Compliance records": "k2 k4 k4a md",
 "S9 Asset Maintenance tab": "s4 m1 m2 m2e m2c m1u m6 p4 mc mg",
 "S9 Asset Maintenance tab / S10 Enter a reading": "p2 p3 n5 me",
 "S13 Worklist": "s1 s1m2 s1m s1mc s1mt s1d s1x s1f s1ci s1b s1c s1dl b3 mh",
 "S14 Contact card": "b1 b5 b5b b1r b1p b4 b4f b1t b1o b1e b1l b5l b5m b1n",
}
C2 = {
 "S16 Maintenance panel on a work order": "wo1 y0 w2r w2k w3 w4 w4o w6 w7 w7inv",
 "S17 Add a service to a work order": "w2x y1h y1a w2b u1 u2 u3 y1t",
 "S17 Add a service to a work order (another location) / S4 Canned lines": "l1 l2 l3 l4 l4n l5",
 "S18 Complete a service": "y1d w13a y1u w13c i1 i1d i2 i3 i6 i4 i5 i7",
 "S22 Origin reporting": "y4",
 "S19 Customer reminder email": "r1 r1p r1t r1u r1n r1z p5",
}
STORY = {}
for m in (C1, C2):
    for st, ids in m.items():
        for i in ids.split():
            STORY[i] = st
BOARD_STORY = {"Maintenance Reminders Demo": "Walkthrough S1→S2→S4→S7→S13/S14→S17→S18",
               "Canned lines per location - proposal": "S4 Canned lines (proposal) / S17",
               "4-work-order (old WO chrome)": "S16/S17/S18 (old work-order chrome)",
               "Maintenance Reminders - Flow Map": "Flow map (all stories)", "Maintenance Reminders": "Index",
               "SettingsSidebar": "S1 (Settings sidebar component)", "ShopviewHeader": "App header component"}


def load_jsonl(p):
    return [json.loads(l) for l in open(p)] if p.exists() else []


art_index = json.loads((OUT / "artboard-index.json").read_text())


def artboard_of(board, selector):
    m = re.match(r"#([^ >]+)", selector or "")
    aid = m.group(1).replace("\\", "") if m else None
    idx = {a["id"]: a for a in art_index.get(board + ".dc.html", [])}
    return aid, (idx.get(aid, {}).get("title") if aid else None)


def story_of(board, aid):
    if board in BOARD_STORY:
        return BOARD_STORY[board]
    return STORY.get(aid, "(board chrome / navigation)" if aid in (None, "top", "page1", "page2", "page3", "p4", "p5") else "untagged")


def is_caption(selector):
    # artboard caption = first child div of an artboard (code + title + designer note); the screen follows it
    return bool(re.match(r"#[^ >]+ > div:nth-of-type\(1\)( |$)", selector or ""))


coverage = {}; exposed = []
for b in BOARDS:
    s = OUT / f"{b}-summary.json"
    if not s.exists():
        coverage[b] = None; continue
    summ = json.loads(s.read_text()); disc = json.loads((OUT / f"{b}-discovery.json").read_text())
    nav = load_jsonl(OUT / f"{b}-navigation.jsonl"); recs = load_jsonl(OUT / f"{b}-interactions.jsonl")
    flow_by_idx = {c["idx"]: c.get("flow", "") for c in disc["candidates"]}
    coverage[b] = {"pages": summ["pages"], "interactions": summ["interactions"], "exposed": summ["exposed"],
                   "hidden_text_blocks": summ["hidden_text_blocks"], "hidden_exposed": summ["hidden_text_blocks_exposed_by_interaction"],
                   "hidden_never_exposed": summ["hidden_text_blocks_never_exposed"], "nav": nav,
                   "native_listener_elements": len(disc.get("native_listener_elements", [])), "react_handler_elements": len(disc.get("react_handler_elements", [])),
                   "hover_rules": len(disc.get("hover_rules", [])), "selects": disc.get("selects"), "variants": disc.get("variants"),
                   "page_labels": {p["id"]: p["label"] for p in disc["pages"]}, "elapsed_s": summ.get("elapsed_s"),
                   "candidates_by_kind": dict(collections.Counter(k.split(":")[0] for c in disc["candidates"] for k in c["kinds"])),
                   "candidates": len(disc["candidates"]), "fast": sum(1 for c in disc["candidates"] if c.get("fast"))}
    for r in recs:
        if not r.get("exposed"):
            continue
        aid, atitle = artboard_of(b, r["selector"])
        kind = r.get("exposed_kind")
        texts = [x["text"] for x in r.get("exposed_text", []) if x.get("text")]
        if kind == "native-title":
            texts = [r.get("native_title_tooltip")]
        if kind in ("navigation-in-board", "navigation-other-board"):
            texts = [("→ #" + r.get("nav_hash", "") + " : " + (r.get("nav_target_text") or "(target missing)")) if kind == "navigation-in-board"
                     else ("→ " + (r.get("navigated_to_document") or "").rsplit("/", 1)[-1] + " : " + (r.get("landed_text") or ""))]
        exposed.append({"board": b, "page": r["page"], "flow": flow_by_idx.get(r["idx"], ""), "artboard": aid, "artboard_title": atitle,
                        "story": story_of(b, aid), "host": r["label"], "selector": r["selector"], "action": r["action"], "kind": kind,
                        "where": "designer note on the artboard caption" if is_caption(r["selector"]) else "on the screen",
                        "texts": texts, "screenshot": r.get("screenshot"), "idx": r["idx"]})
(OUT / "coverage.json").write_text(json.dumps(coverage, indent=1, ensure_ascii=False))
(OUT / "exposed-all.json").write_text(json.dumps(exposed, indent=1, ensure_ascii=False))

# ---- unique exposure catalogue (text-revealing only: tooltips/hover cards/new content/native titles) ------------------
cat = collections.OrderedDict()
for e in exposed:
    if e["kind"] not in ("tooltip/hover-card", "new-content", "native-title"):
        continue
    for t in e["texts"]:
        key = (e["board"], e["artboard"], e["where"], t)
        if key not in cat:
            cat[key] = {**{k: e[k] for k in ("board", "page", "flow", "artboard", "artboard_title", "story", "where", "kind")}, "text": t, "hosts": [], "actions": set(), "screens": []}
        cat[key]["hosts"].append(e["host"] or "[icon]"); cat[key]["actions"].add(e["action"])
        if e["screenshot"] and len(cat[key]["screens"]) < 2:
            cat[key]["screens"].append(e["screenshot"])
catl = [{**v, "actions": sorted(v["actions"]), "hosts": sorted(set(v["hosts"]))[:4]} for v in cat.values()]
(OUT / "exposed-catalogue.json").write_text(json.dumps(catl, indent=1, ensure_ascii=False))

# ---- spec comparison helper ---------------------------------------------------------------------------------------------
def norm(t):
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9%$ ]", " ", t.lower().replace("’", "'"))).strip()

spec_sents = []
for ch, p in SPECS.items():
    story = ""
    for line in p.read_text().splitlines():
        m = re.match(r"#+\s*(S\d+):?\s*(.*)", line)
        if m:
            story = m.group(1) + " " + m.group(2)
        for sent in re.split(r"(?<=[.;:])\s+", re.sub(r"\*\*|\[|\]\([^)]*\)", "", line)):
            if len(sent.split()) >= 2:
                spec_sents.append((ch, story, sent.strip(), set(norm(sent).split()), norm(sent)))
spec_all_norm = {ch: norm(p.read_text()) for ch, p in SPECS.items()}


def best(text):
    w = set(norm(text).split());
    if not w:
        return 0, None
    sc = sorted(((len(w & s[3]) / max(1, len(w)), s) for s in spec_sents), key=lambda x: -x[0])[:8]
    bestr, bests = 0, None
    for _, s in sc:
        r = difflib.SequenceMatcher(None, norm(text), s[4]).ratio()
        cov = len(w & s[3]) / len(w)
        m = max(r, cov * 0.9)
        if m > bestr:
            bestr, bests = m, s
    return bestr, bests

lines = ["# Spec-compare helper (machine shortlist for human review — NOT the findings)\n"]
for c in catl:
    sc, s = best(c["text"])
    c["spec_best_score"] = round(sc, 2); c["spec_best"] = (s[1] + " :: " + s[2]) if s else None
    lines.append(f"- [{c['board']} / {c['artboard']} {c['artboard_title'] or ''} / {c['story']} / {c['where']}] score={sc:.2f}\n  DESIGN: {c['text']}\n  SPEC:   {c['spec_best']}")
(OUT / "exposed-catalogue.json").write_text(json.dumps(catl, indent=1, ensure_ascii=False))
(OUT / "spec-compare-candidates.md").write_text("\n".join(lines))
print("boards with summary:", [b for b in BOARDS if coverage.get(b)])
print("exposed records:", len(exposed), "unique text exposures:", len(catl))
