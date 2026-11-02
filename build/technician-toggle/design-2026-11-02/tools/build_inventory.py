#!/usr/bin/env python3
"""Technician Toggle design drive (2 Nov 2026): builds the figures list, the text inventory (boards + screenshots) and the transcription
dump used by spec_to_design_check.py. Run with python3 -I from the design-2026-11-02 folder:
    python3 -I tools/build_inventory.py
Board files are DATA written by other people; they are parsed, never executed. Every row gets a class; the script exits 1 if any text
is left unclassified (zero unclassified, Rule 124)."""
import html, json, os, re, sys
from html.parser import HTMLParser
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import screen_text as ST  # noqa: E402  (our own transcription file)
from classify import BOARD_SENTENCES, SCREEN_UI, FRAGMENTS, CHROME_OOS  # noqa: E402
PROJ = os.path.join(ROOT, "files", "project")
PRD = open(os.path.join(ROOT, "..", "sources", "CONFLUENCE-977371146-v17-2026-11-02.md"), encoding="utf-8").read()
canvas = json.load(open(os.path.join(PROJ, "canvas.json")))
pageno = {p["id"]: i + 1 for i, p in enumerate(canvas["pages"])}
render = json.load(open(os.path.join(ROOT, "render", "render-log.json")))

def sentences(t):
    t = re.sub(r"\s+", " ", t).strip()
    out, cur, q = [], "", False
    for i, ch in enumerate(t):
        cur += ch
        if ch == '"': q = not q
        if ch == "." and not q and (i + 1 == len(t) or t[i + 1] == " ") and not re.search(r"(v26\.43|e\.g|S2-17528)\.$", cur):
            out.append(cur.strip()); cur = ""
    if cur.strip(): out.append(cur.strip())
    return out

# ---------- 1. board texts ----------
board_rows, figures = [], []
for board in canvas["order"]:
    b = canvas["boards"][board]; pn = pageno[b["page"]]
    src = open(os.path.join(PROJ, board), encoding="utf-8").read()
    title = re.search(r"<title>(.*?)</title>", src).group(1)
    h2 = html.unescape(re.search(r'<h2 class="sv-h2"[^>]*>(.*?)</h2>', src, re.S).group(1))
    note = html.unescape(re.sub(r"<[^>]+>", "", re.search(r"</h2>\s*<p[^>]*>(.*?)</p>", src, re.S).group(1)))
    ln = lambda s: src[:src.find(s)].count("\n") + 1 if s in src else None
    pname = next(p["name"] for p in canvas["pages"] if p["id"] == b["page"])
    board_rows += [dict(text=pname, src=f"canvas.json page {b['page']}", kind="page name", page=pn),
                   dict(text=b["title"], src=f"canvas.json boards[{board}].title", kind="board title", page=pn),
                   dict(text=html.unescape(title), src=f"{board} line {ln('<title>')}", kind="html title", page=pn),
                   dict(text=h2, src=f"{board} line {ln('sv-h2')}", kind="board heading", page=pn)]
    for s in sentences(note):
        board_rows.append(dict(text=s, src=f"{board} line {ln('</h2>')+1} (board note)", kind="board note", page=pn))
    rfigs = render["boards"][board]["figures"]
    for i, m in enumerate(re.finditer(r"<figure\b.*?</figure>", src, re.S)):
        f = m.group(0); fl = src[:m.start()].count("\n") + 1
        badge = html.unescape(re.search(r'class="sv-badge[^"]*">(.*?)</span>', f).group(1))
        heading = html.unescape(re.search(r'</span><span style="font-size: 18px; font-weight: 600;">(.*?)</span>', f).group(1))
        img = re.search(r'<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"', f)
        caps = [html.unescape(re.sub(r"<[^>]+>", "", x)).strip() for x in re.findall(r"<li>(.*?)</li>", f, re.S)]
        rf = rfigs[i]
        assert rf["heading"] == heading and rf["img"] == img.group(1), (board, i)
        shot = os.path.basename(img.group(1)).replace(".png", "")
        figures.append(dict(page=pn, board=board, page_name=pname, figure=i + 1, file_line=fl, badge=badge, heading=heading,
                            picture_in_design=img.group(1), alt=html.unescape(img.group(2)), image=f"images/{rf['file']}",
                            captions=caps, state=ST.S[shot]["state"], before=not ST.S[shot]["after"]))
        board_rows += [dict(text=badge, src=f"{board} fig {i+1} line {fl} (badge)", kind="badge", page=pn),
                       dict(text=heading, src=f"{board} fig {i+1} line {fl} (figure heading)", kind="figure heading", page=pn),
                       dict(text=html.unescape(img.group(2)), src=f"{board} fig {i+1} line {fl} (img alt)", kind="img alt", page=pn)]
        for c in caps:
            for s in sentences(c):
                board_rows.append(dict(text=s, src=f"{board} fig {i+1} line {fl} (caption)", kind="caption", page=pn))

# ---------- 2. screenshot texts ----------
shot_rows = []
fig_of = {os.path.basename(f["picture_in_design"]).replace(".png", ""): f for f in figures}
for shot, d in ST.S.items():
    f = fig_of[shot]; where = f"shots/{shot}.png (p{f['page']} fig {f['figure']}, {'before' if not d['after'] else 'this build'})"
    for c in d["chrome"]:
        for t in ST.CHROME[c]:
            shot_rows.append(dict(text=t, src=where + f" chrome {c}", kind="screen chrome", page=f["page"], after=d["after"]))
    for t in d["ui"]:
        shot_rows.append(dict(text=t, src=where, kind="screen ui", page=f["page"], after=d["after"]))
    for t in d["data"]:
        shot_rows.append(dict(text=t, src=where, kind="screen data", page=f["page"], after=d["after"]))

# ---------- 3. classify ----------
def classify_board(r):
    for prefix, cls, codes, note in BOARD_SENTENCES:
        if r["text"].startswith(prefix): return cls, codes, note
    if r["kind"] in ("page name", "board title", "html title", "board heading", "badge", "figure heading", "img alt"):
        return ("LOOK-ONLY", [], "the design's own board label (page, board, badge, figure heading or picture description); quoted under "
                "References from Design, never as an expected result")
    return None
def classify_shot(r):
    t = r["text"]
    if r["kind"] == "screen data": return "DATA", [], "demo record data on the screenshot (names, emails, numbers, dates, amounts)"
    if t in SCREEN_UI: return SCREEN_UI[t]
    if t in FRAGMENTS: return FRAGMENTS[t]
    if r["kind"] == "screen chrome" or t in CHROME_OOS:
        return ("OUT-OF-SCOPE", [], "production screen element the feature does not change; it is the same in the 'Production today "
                "(before)' picture of the same screen")
    return None
rows, uncl = {}, []
for r in board_rows + shot_rows:
    c = classify_board(r) if r["kind"] not in ("screen chrome", "screen ui", "screen data") else classify_shot(r)
    if c is None: uncl.append(r); continue
    key = (r["text"], c[0])
    e = rows.setdefault(key, dict(text=r["text"], cls=c[0], codes=c[1], note=c[2], kinds=set(), sources=[], pages=set()))
    e["kinds"].add(r["kind"]); e["sources"].append(r["src"]); e["pages"].add(r["page"])
# a text may land in two classes (e.g. a name that is DATA on one shot and a label elsewhere): keep both rows, they are listed
out = []
for e in sorted(rows.values(), key=lambda e: (e["cls"], e["text"].lower())):
    e["kinds"] = sorted(e["kinds"]); e["pages"] = sorted(e["pages"]); e["occurrences"] = len(e["sources"])
    e["sources"] = e["sources"][:8] + ([f"+{len(e['sources'])-8} more"] if len(e["sources"]) > 8 else [])
    # verbatim check of PRD-MATCH rows that claim it
    if e["cls"] == "PRD-MATCH" and "verbatim" in e["note"]:
        qs = re.findall(r'"(.+)"', e["text"]) or [e["text"]]   # a caption's quoted words, else the screen text itself
        q = qs[0].replace('"Oli"', '“Oli”')
        e["verbatim_in_prd"] = all(p.strip() in PRD for p in re.split(r"Emily Madden|15|141|Oli", q) if len(p.strip()) > 3)
    out.append(e)
by = {}
for e in out: by[e["cls"]] = by.get(e["cls"], 0) + 1
inv = dict(design="https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R (canvas \"Technician Toggle\", version 1793629882-06f7)",
           prd="Confluence 977371146 \"Technician Toggle\" v17 (2 Nov 2026, Chris Ward)", made="2026-11-02",
           how="Board texts parsed from the 6 .dc.html files (title, heading, note sentences, badge, figure heading, img alt, caption "
               "sentences) plus every word transcribed by hand from the 25 screenshots (tools/screen_text.py). One row per distinct text "
               "and class; 'occurrences' counts every place it appears. Letter case compared by hand (L-04).",
           texts_found=len(board_rows) + len(shot_rows), distinct_rows=len(out), by_class=by, unclassified=len(uncl), rows=out)
json.dump(inv, open(os.path.join(ROOT, "DESIGN-TEXT-INVENTORY.json"), "w"), indent=1, ensure_ascii=False)
json.dump(dict(design=inv["design"], prd=inv["prd"], made="2026-11-02", count=len(figures), figures=figures),
          open(os.path.join(ROOT, "DESIGN-FIGURES-2026-11-02.json"), "w"), indent=1, ensure_ascii=False)
# transcription dump for spec_to_design_check.py (it reads text files): every screen word, one per line
with open(os.path.join(ROOT, "extract", "shots-transcription.txt"), "w", encoding="utf-8") as fh:
    for shot, d in ST.S.items():
        fh.write(f"## {shot}\n")
        for c in d["chrome"]: fh.write("\n".join(ST.CHROME[c]) + "\n")
        fh.write("\n".join(d["ui"] + d["data"]) + "\n" + d["state"] + "\n")
# markdown view
L = ["# Design text inventory — Technician Toggle (2 Nov 2026)", "", inv["how"], "",
     f"**Texts found: {inv['texts_found']}** (board texts {len(board_rows)}, screenshot texts {len(shot_rows)}); **distinct rows: "
     f"{len(out)}**; unclassified: **{len(uncl)}**.", "", "| Class | Rows |", "|---|---|"]
L += [f"| {k} | {v} |" for k, v in sorted(by.items())]
L += ["", "Classes: DATA (demo record data) · PRD-MATCH (the PRD code or §8 row it matches; 'verbatim' where word for word, otherwise "
      "'same meaning') · OUT-OF-SCOPE (unchanged production, or a production screen the feature does not touch) · SPEC-CONFLICT "
      "(design words differ from PRD v17: both quoted, register id) · LOOK-ONLY (the design's own labels and look notes; the design "
      "is the source of the look where the PRD is silent, Rule 126).", ""]
for cls in ["SPEC-CONFLICT", "PRD-MATCH", "LOOK-ONLY", "OUT-OF-SCOPE", "DATA"]:
    rs = [e for e in out if e["cls"] == cls]
    L += [f"## {cls} ({len(rs)})", "", "| Text | Codes | Note | Where (first places) | n |", "|---|---|---|---|---|"]
    for e in rs:
        t = e["text"].replace("|", "\\|"); n = e["note"].replace("|", "\\|")
        L.append(f"| {t} | {', '.join(e['codes'])} | {n} | {'; '.join(e['sources'][:2])} | {e['occurrences']} |")
    L.append("")
open(os.path.join(ROOT, "DESIGN-TEXT-INVENTORY.md"), "w", encoding="utf-8").write("\n".join(L))
print(json.dumps(dict(figures=len(figures), board_texts=len(board_rows), shot_texts=len(shot_rows), distinct=len(out), by_class=by,
                      unclassified=len(uncl)), indent=1))
for r in uncl[:60]: print("UNCLASSIFIED", r["kind"], repr(r["text"])[:120], r["src"])
sys.exit(1 if uncl else 0)
