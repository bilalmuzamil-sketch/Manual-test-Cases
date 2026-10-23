#!/usr/bin/env python3
"""Text inventory of the Credit terms design (Rule 124 as amended 9 Oct 2026; Rule 126; skill 21 §4).
Every on-screen text of the 9 boards (HTML text and visible/accessible attributes), every caption item, every board title/note/badge/
heading/alt, canvas.json strings, and every word of the 25 screenshots (screen_text.py), each classified:
  DATA · PRD-MATCH (code) · OUT-OF-SCOPE (reason) · SPEC-CONFLICT (design words vs PRD v3 words, both quoted, register id) · LOOK-ONLY.
Letter case is compared exactly (L-04): a case-insensitive-only match is never PRD-MATCH.
Run: python3 -I tools/make_inventory.py   (from the design-2026-10-23 folder). Exit 1 while any row is unclassified."""
import json, os, re, sys, glob, html
H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(H, "tools"))
import prd_quotes as PQ, screen_text as ST
from classify import EXPLICIT, CAPTIONS, DEMO_DATA, CHROME_OOS, FRAMING

QUOTES, PRD_LINES = PQ.load()
PRD_TEXT = "\n".join(PRD_LINES)
def code_rank(c):
    return 0 if re.match(r"S\d+-[RNE]", c) else 1 if c.startswith("§8") else 2 if "table row" in c or "Error" in c else 3
def _lit(q): return len(re.sub(r"\{[^}]+\}", "", q).strip(" :.,/()"))
TEMPL = [(PQ.template_re(q["q"]), q) for q in QUOTES if "{" in q["q"] and _lit(q["q"]) >= 8]
def prd_match(t):
    hits = [q for q in QUOTES if q["q"] == t] or [q for rx, q in TEMPL if rx.match(t)]
    if hits:
        codes = sorted({h["code"] for h in hits}, key=code_rank)
        return "quoted", codes[:4]
    # unquoted, exact case, whole-word occurrence (labels the PRD names without quotes, e.g. column names)
    if len(t) > 2 and re.search(r"(?<![A-Za-z])" + re.escape(t) + r"(?![A-Za-z])", PRD_TEXT):
        for i, l in enumerate(PRD_LINES):
            if re.search(r"(?<![A-Za-z])" + re.escape(t) + r"(?![A-Za-z])", l):
                m = None
                for j in range(i, -1, -1):
                    m = re.search(r"\*\*(S\d+-[RNE]\d+[a-z]?):\*\*", PRD_LINES[j]) or (re.match(r"^## (\d+)\.", PRD_LINES[j]) and re.match(r"^## (\d+)\.", PRD_LINES[j]))
                    if m: break
                return "unquoted", [(m.group(1) if m and m.group(1).startswith("S") else "§" + m.group(1)) if m else "PRD"]
    if re.search(re.escape(t), PRD_TEXT, re.I) and len(t) > 3:
        return "case-differs", []
    return None, []

rows = {}
def add(text, src, kind):
    text = text.strip()
    if not text: return
    r = rows.setdefault(text, dict(text=text, sources=[], kinds=set()))
    if src not in r["sources"]: r["sources"].append(src)
    r["kinds"].add(kind)

cj = json.load(open(f"{H}/files/project/canvas.json"))
add(cj["title"], "canvas.json title", "framing")
for pg in cj["pages"]: add(pg["name"], "canvas.json pages", "framing")
for b, v in cj["boards"].items(): add(v["title"], f"canvas.json boards[{b}].title", "framing")
add(cj["designSystems"][0]["title"], "canvas.json designSystems", "framing")
for f in sorted(glob.glob(f"{H}/extract/*.dc.html.json")):
    d = json.load(open(f)); b = d["board"]
    add(d["title"], f"{b} <title>", "framing"); add(d["h2"], f"{b} h2", "framing"); add(d["note"], f"{b} note", "framing")
    for fg in d["figures"]:
        where = f"{b} fig {fg['n']}"
        add(fg["badge"], where + " badge", "framing"); add(fg["heading"], where + " heading", "framing")
        for im in fg["imgs"]: add(im["alt"], where + " img alt", "framing")
        for c in fg["captions"]: add(c, where + " caption", "caption")
        for t in fg["texts"]:
            if t["kind"] == "caption" or t["text"] in (fg["badge"], fg["heading"]): continue
            if t["kind"].startswith("attr:alt"): continue
            add(t["text"], f"{where} line {t['line']}" + (" (" + t["kind"] + ")" if t["kind"] != "text" else ""), "attr" if t["kind"] != "text" else "screen")
for sid, v in ST.S.items():
    tag = "shot-after" if v["after"] else "shot-before"
    for c in v["chrome"]:
        for t in ST.CHROME[c]: add(t, f"shots/{sid}.png ({c})", tag)
    for t in v["ui"]: add(t, f"shots/{sid}.png", tag)
    for t in v["data"]: add(t, f"shots/{sid}.png (data)", "data")

DATA_RX = re.compile(r"^(\$ ?[\d,]+\.\d+|[\d,.%]+|\(?\d{3}\)? ?-? ?\d{3} ?- ?\d{4}|\d{3}-\d{3}-\d{4}|[A-Z][a-z]{2} \d{1,2}, 20\d\d|S2-\d+|INV-S2-\d+|\d\d:\d\d [AP]M|\d+ selected|[A-Z]\d[A-Z] ?\d[A-Z]\d|[\w.]+@[\w.]+|www\.[\w.]+)$")
out = []
for t, r in rows.items():
    cls = note = None; codes = []; reg = None
    if t in EXPLICIT:
        cls, note = EXPLICIT[t][:2]; codes = EXPLICIT[t][2] if len(EXPLICIT[t]) > 2 else []; reg = EXPLICIT[t][3] if len(EXPLICIT[t]) > 3 else None
    elif "caption" in r["kinds"] and t in CAPTIONS:
        cls, note = CAPTIONS[t][:2]; codes = CAPTIONS[t][2] if len(CAPTIONS[t]) > 2 else []; reg = CAPTIONS[t][3] if len(CAPTIONS[t]) > 3 else None
    elif "caption" in r["kinds"]:
        cls = None
    elif r["kinds"] <= {"framing"} or t in FRAMING:
        cls, note = "OUT-OF-SCOPE", "canvas framing (page/board title or note, figure badge, heading, picture alt): names the state a design case compares against; quoted under References from Design, not an app text"
    elif t in CHROME_OOS:
        cls, note = CHROME_OOS[t]
    elif t in DEMO_DATA or (r["kinds"] <= {"data"}) or DATA_RX.match(t):
        cls, note = "DATA", "demo record data (names, numbers, dates, amounts, the demo shop's own term names); the boards say \"Names and counts are demo data\""
    else:
        how, cds = prd_match(t)
        if how in ("quoted", "unquoted"):
            cls, codes, note = "PRD-MATCH", cds, ("the PRD quotes these exact words" if how == "quoted" else "the PRD names it (not in quotes), same letter case")
        elif how == "case-differs":
            cls, note = None, "CASE-DIFFERS: the PRD has these words in other capitals"
    out.append(dict(text=t, sources=r["sources"][:6] + ([f"+{len(r['sources']) - 6} more"] if len(r["sources"]) > 6 else []),
                    kinds=sorted(r["kinds"]), cls=cls, note=note, codes=codes, register=reg))
out.sort(key=lambda x: (x["cls"] or "~", x["text"].lower()))
by = {}
for x in out: by[x["cls"] or "UNCLASSIFIED"] = by.get(x["cls"] or "UNCLASSIFIED", 0) + 1
json.dump(dict(design="https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf (version 1792722751-b285)", prd="Confluence 963346440 v3 (2026-10-22)",
               made="2026-10-23", texts=len(out), by_class=by, rows=out), open(f"{H}/DESIGN-TEXT-INVENTORY.json", "w"), indent=1, ensure_ascii=False)
with open(f"{H}/DESIGN-TEXT-INVENTORY.md", "w") as fh:
    fh.write("# Design text inventory — Credit terms (23 Oct 2026)\n\n")
    fh.write("Design: \"Default Credit Terms\" canvas, https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf, version 1792722751-b285 (2026-10-22T17:07Z). "
             "Compared with PRD v3 (Confluence 963346440, 2026-10-22). Every on-screen text in the 9 boards, every caption item, the canvas "
             "framing, and every word transcribed from the 25 screenshots. Letter case compared exactly (L-04). Generator: tools/make_inventory.py "
             "(classification rules in tools/classify.py).\n\n")
    fh.write(f"**Texts: {len(out)}** · " + " · ".join(f"{k} {v}" for k, v in sorted(by.items())) + "\n\n")
    fh.write("Classes: DATA = demo record data · PRD-MATCH = the PRD has these exact words (code given) · OUT-OF-SCOPE = not part of this "
             "feature (reason given) · SPEC-CONFLICT = the design's words differ from PRD v3 (both quoted; register id) · LOOK-ONLY = a look "
             "or design note the PRD does not describe (the design is the source for the look, Rule 126).\n\n")
    for k in sorted(by):
        fh.write(f"\n## {k} ({by[k]})\n\n| # | Text | Where | Codes / register | Note |\n|---|---|---|---|---|\n")
        n = 0
        for x in out:
            if (x["cls"] or "UNCLASSIFIED") != k: continue
            n += 1
            esc = lambda s: str(s).replace("|", "\\|").replace("\n", " ")
            fh.write(f"| {n} | {esc(x['text'])} | {esc('; '.join(x['sources']))} | {esc(', '.join(x['codes']))}{(' · ' + x['register']) if x['register'] else ''} | {esc(x['note'] or '')} |\n")
print(json.dumps(by))
unc = [x for x in out if not x["cls"]]
for x in unc: print("UNCLASSIFIED:", repr(x["text"])[:200], x["kinds"], (x["note"] or ""), x["sources"][:2])
sys.exit(1 if unc else 0)
