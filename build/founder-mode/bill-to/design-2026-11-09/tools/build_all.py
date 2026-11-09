#!/usr/bin/env python3
"""Bill To design drive (9 Nov 2026): figures list, text inventory (boards + 124 screenshots), PRD-to-design table and the divergence
register. Run from design-2026-11-09 with: python3 -I tools/build_all.py. Exits 1 while any row is unclassified."""
import os, sys, json, re, html
from collections import Counter, defaultdict
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); sys.path.insert(0, HERE)
import rows as R, classify as C, prd as P, register_data as RD, screen_text as ST
from spec_verdicts import VERDICTS, S8_VERDICTS
PRDL = P.TEXT
board = R.board_rows(); screen = R.screen_rows()
prod_ui, all_data = set(), set()
for fn, v in ST.SCREENS.items():
    for w in v.get("data", []): all_data.add(w)
    if fn.startswith("before-"):
        for w in v.get("ui", []): prod_ui.add(w)
        for c in v.get("chrome", []):
            lst = getattr(ST, c.split(" (")[0], None)
            if isinstance(lst, list): prod_ui.update(lst)
for name in ("HEADER", "HEADER_MARY", "HEADER_MARY_9919", "HEADER_1600", "PHONE_TOP", "CUSTOMERS_LIST_UI"): prod_ui.update(getattr(ST, name))
prod_ui.update(ST.CUSTOMERS_LIST_DATA); all_data.update(ST.CUSTOMERS_LIST_DATA)
def case_check(t):
    if t in PRDL: return "exact"
    if t.lower() in PRDL.lower(): return "CASE-DIFFERS"
    return "template"
def cl_screen(r):
    f, t, k = r["file"], r["text"], r["kind"]
    if k == "duplicate": return ("OUT-OF-SCOPE", [], "byte-identical picture; its words are counted under the picture it copies")
    if k == "chrome-ref": return ("OUT-OF-SCOPE", [], "screen chrome named only (dimmed page behind a window)")
    if (f, t) in C.FILE_UI: return C.FILE_UI[(f, t)]
    if f.startswith("before-"):
        return ("DATA", [], "demo data") if (k == "data" or C.DATA_RE.match(t) or t in all_data) else ("OUT-OF-SCOPE", [], "production today (before picture), unchanged by Bill To")
    if t in ("Bill To", "BILL TO") and ("-p4-" in f or "finance" in f): return ("OUT-OF-SCOPE", [], "document's existing Bill To heading (production label); S7-R1 covers its content")
    if t.endswith("(this customer)"): return ("PRD-MATCH", ["S1-R5", "S2-R4", "S3-R3"], "template '[customer] (this customer)'")
    if t in C.UI: return C.UI[t]
    if k == "data" or C.DATA_RE.match(t) or t in all_data: return ("DATA", [], "demo data")
    if t in prod_ui: return ("OUT-OF-SCOPE", [], "same label in a production picture: unchanged by Bill To")
    if t in C.OTHER_FEATURE: return ("OUT-OF-SCOPE", [], "existing production control or another feature in the same build (cover note); not Bill To")
    return None
out, unc = [], []
for i, r in enumerate(board + screen, 1):
    res = C.classify_board(r) if r["src"] == "board" else cl_screen(r)
    r = dict(id="T%05d" % i, **r)
    if res is None: unc.append(r); r.update(cls="UNCLASSIFIED", codes=[], note="")
    else:
        r.update(cls=res[0], codes=res[1], note=res[2])
        if res[0] == "PRD-MATCH" and r["src"] == "screen": r["letter_case"] = case_check(r["text"])
    out.append(r)
cnt = Counter(r["cls"] for r in out)
case_flags = sorted({r["text"] for r in out if r.get("letter_case") == "CASE-DIFFERS"})
# ---- figures list --------------------------------------------------------------------------------------------------------
log = json.load(open(os.path.join(ROOT, "render", "render-log.json")))
figs = []
for b, v in log["boards"].items():
    for f in v["figures"]:
        badge = f["badge"]
        side = "Production today (before)" if badge.startswith("Production") else ("Not shown" if badge == "Not shown" else "This build (after)")
        shot = (f["img"] or "").replace("shots/", "")
        figs.append(dict(board=b, page=v["page"], page_name=v["canvasTitle"], n=f["n"], badge=badge, side=side, heading=f["heading"], captions=f["captions"],
                         picture_in_design=f["img"], figure_picture="images/" + f["file"], alt=f["alt"], shown_size="%sx%s" % (f["w"], f["h"]),
                         state=(ST.SCREENS.get(shot, {}).get("look") or ["portal placeholder: not shot"])[0]))
json.dump(dict(design="Bill To design, https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd, version 1794239066-4906", made="9 Nov 2026",
               boards=len(log["boards"]), figures=len(figs), figures_with_picture=sum(1 for f in figs if f["picture_in_design"]), list=figs),
          open(os.path.join(ROOT, "DESIGN-FIGURES-2026-11-09.json"), "w"), indent=1, ensure_ascii=False)
# ---- text inventory ------------------------------------------------------------------------------------------------------
summ = dict(made="9 Nov 2026", rows=len(out), board_rows=len(board), screen_rows=len(screen), by_class=dict(cnt), unclassified=len(unc),
            letter_case_flags=case_flags, screens_transcribed=len(ST.SCREENS),
            distinct_screen_texts=len({(r["text"]) for r in out if r["src"] == "screen"}))
json.dump(dict(summary=summ, rows=out), open(os.path.join(ROOT, "DESIGN-TEXT-INVENTORY.json"), "w"), indent=0, ensure_ascii=False)
md = ["# Design text inventory — Bill To (9 Nov 2026)", "",
      "Every text in the 8 board files (title, headings, notes, badges, picture headings, alt text, every caption sentence, the cover lists) and every word transcribed by hand from the 124 screenshots (`tools/screen_text.py`). Built by `tools/build_all.py` with the rules in `tools/classify.py`; full rows with file and line in `DESIGN-TEXT-INVENTORY.json`. Classes: DATA · PRD-MATCH (code) · OUT-OF-SCOPE (reason) · SPEC-CONFLICT (register id) · LOOK-ONLY. Letter case of every PRD-MATCH screen label was compared with the PRD by script (L-04).", "",
      "## Counts", "", "| | rows |", "|---|---|", "| Board rows | %d |" % len(board), "| Screenshot rows (incl. shared chrome expanded per picture) | %d |" % len(screen)]
md += ["| %s | %d |" % (k, v) for k, v in sorted(cnt.items())] + ["| **Unclassified** | **%d** |" % len(unc), "",
       "Letter-case differences against the PRD among PRD-MATCH labels: %s." % (", ".join(case_flags) if case_flags else "none"), "",
       "## Board rows (every sentence)", "", "| Id | Board | Line | Kind | Text | Class | Codes | Note |", "|---|---|---|---|---|---|---|---|"]
for r in out:
    if r["src"] == "board":
        md.append("| %s | %s | %s | %s | %s | %s | %s | %s |" % (r["id"], r["board"], r["line"], r["kind"], r["text"].replace("|", "/"), r["cls"], ", ".join(r["codes"]), r["note"].replace("|", "/")))
md += ["", "## Screenshot words (distinct text per class; files listed)", "", "| Text | Class | Codes | Pictures | Note |", "|---|---|---|---|---|"]
agg = defaultdict(set); meta = {}
for r in out:
    if r["src"] == "screen": agg[(r["text"], r["cls"])].add(r["file"]); meta[(r["text"], r["cls"])] = (r["codes"], r["note"])
for (t, c), fs in sorted(agg.items(), key=lambda x: (x[0][1], x[0][0])):
    fl = sorted(fs); md.append("| %s | %s | %s | %s | %s |" % (t.replace("|", "/"), c, ", ".join(meta[(t, c)][0]), (", ".join(fl) if len(fl) <= 4 else "%d pictures, e.g. %s" % (len(fl), ", ".join(fl[:3]))), meta[(t, c)][1].replace("|", "/")))
open(os.path.join(ROOT, "DESIGN-TEXT-INVENTORY.md"), "w").write("\n".join(md) + "\n")
# ---- PRD -> design ------------------------------------------------------------------------------------------------------
NOSCREEN = {6, 11, 17, 18, 19}
s2d, miss = [], []
for code, text in P.REQ.items():
    st = int(code[1:].split("-")[0])
    if code in VERDICTS: v, where, note = VERDICTS[code]
    elif st in NOSCREEN: v, where, note = "NO SCREEN", "", "PRD: 'Design: No screen change.'"
    else: miss.append(code); v, where, note = "UNCHECKED", "", ""
    s2d.append(dict(code=code, prd_words=text, verdict=v, where=where, note=note))
for s in P.S8:
    key = s["id"] + "|" + s["trigger"]
    v, where, note = S8_VERDICTS.get(key, ("UNCHECKED", "", "")); miss += [] if key in S8_VERDICTS else [key]
    s2d.append(dict(code="§8 " + s["id"], prd_words=s["message"] + " — " + s["behavior"], trigger=s["trigger"], verdict=v, where=where, note=note))
vc = Counter(x["verdict"] for x in s2d)
json.dump(dict(made="9 Nov 2026", prd="PRD v0.5 (Confluence 1003585538)", design="Bill To design version 1794239066-4906", counts=dict(vc), unchecked=miss,
               method="every requirement line and every §8 row compared by hand with the boards' pictures and captions; SHOWN = the design draws it as the PRD says; DIFFERENT = register row; NOT SHOWN = no picture (register BT-N rows); NO SCREEN = PRD says no screen change",
               rows=s2d), open(os.path.join(ROOT, "SPEC-TO-DESIGN-2026-11-09.json"), "w"), indent=1, ensure_ascii=False)
# ---- register -------------------------------------------------------------------------------------------------------------
reg = dict(project="Bill To (Founder Mode), epic SV-12289", design="https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd, canvas \"Bill To design\", version 1794239066-4906 (created 2026-11-06T18:55Z)",
           prd="Confluence 1003585538, PRD v0.5 (pending approval, last modified 7 Nov 2026), saved build/founder-mode/bill-to/sources/CONFLUENCE-1003585538-v0.5-2026-11-09.md",
           made="9 Nov 2026, design drive build/founder-mode/bill-to/design-2026-11-09/", how="Rule 130: both directions (text inventory design -> PRD; SPEC-TO-DESIGN-2026-11-09.json PRD -> design; every dialog, menu, toast and tooltip listed by hand in DESIGN-VISUAL-INVENTORY.md)",
           unsent_questions=len(RD.DIFFERENCES), unsent_note="All %d questions are drafted in design-2026-11-09/NEW-QUESTIONS.py and NOT sent (the QA lead sends them). Rule 126.6: unsent must reach 0 before the suite is called complete." % len(RD.DIFFERENCES),
           differences=RD.DIFFERENCES, settled=RD.SETTLED,
           not_shown=[dict(id=i, prd_code=c, state=s, outcome="DESIGN-SILENT: nothing drawn, so no held case (Rule 130.5); the PRD-following case is the only case", checked="9 Nov 2026, all 126 figures") for i, c, s in RD.NOT_SHOWN])
for k, (o, w) in RD.TOOL_KEYS.items(): reg[k] = dict(outcome=o, where=w)
json.dump(reg, open(os.path.join(ROOT, "..", "DESIGN-DIVERGENCE-REGISTER.json"), "w"), indent=1, ensure_ascii=False)
# ---- transcription dump for spec_to_design_check.py ----------------------------------------------------------------------
words = sorted({r["text"] for r in out if r["src"] == "screen" and r["file"].startswith("after-")})
open(os.path.join(ROOT, "extract", "screen-transcription-after.html"), "w").write("<html><body>\n" + "\n".join("<p>%s</p>" % html.escape(w) for w in words) + "\n</body></html>\n")
print(json.dumps(summ, indent=1)); print("figures", len(figs), "| PRD->design", dict(vc), "unchecked", len(miss))
for r in unc[:80]: print("UNC", r.get("board") or r.get("file"), r["kind"], "|", r["text"][:150])
if miss: print("UNCHECKED codes:", miss)
sys.exit(1 if unc or miss else 0)
