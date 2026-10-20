#!/usr/bin/env python3
"""Builds SPEC-TO-DESIGN-v10.{md,json}, DESIGN-TO-CASES.{md,json} and DESIGN-DIVERGENCE-REGISTER.json for the 20 Oct 2026 design
re-check. Run: python3 -B tools/recheck.py  (from design-recheck-2026-10-20/). Reads only; writes only into this folder."""
import json, os, re, glob, html, sys
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.dirname(HERE)
DD = f"{P}/design-drive-2026-10-19"
sys.path.insert(0, os.path.join(HERE, "tools"))
from boards import B, ZOOM
from spec_elements import E, H
from register import R, T

ans = {a["no"]: a for a in json.load(open(f"{HERE}/chris-answers.json"))["answers"]}
cases = json.load(open(f"{HERE}/ssr-cases-2026-10-20.json"))
sec = {v: k for k, v in json.load(open(f"{P}/applied/sections.json")).items()}
def txt(s):
    s = re.sub(r"<br\s*/?>|</li>|</p>", "\n", s or ""); return html.unescape(re.sub(r"<[^>]+>", " ", s))
corpus = {f"C{c['id']}": (c["title"] + "\n" + txt(c["custom_preconds"]) + "\n" + txt(c["custom_steps"]) + "\n" + txt(c["custom_expected"])) for c in cases}
title = {f"C{c['id']}": c["title"] for c in cases}
csec = {f"C{c['id']}": sec[c["section_id"]] for c in cases}
# attached pictures (TestRail add_attachment_to_case log of 19 Oct 2026)
att = {}
for f in ("apply-log.jsonl", "apply2-log.jsonl", "apply3-log.jsonl"):
    for l in open(f"{P}/applied/{f}"):
        try: r = json.loads(l)
        except Exception: continue
        if r.get("op") == "add_attachment_to_case" and r.get("attachment_id"): att.setdefault(r["case"], set()).add(r["file"])
file2board = {f: b for b, _, f, *_ in B}
board_cases = {}
for c, fs in att.items():
    for f in fs: board_cases.setdefault(file2board[f], set()).add(c)

# ---------------- register ----------------
reg = {}
def A(n): return None if n is None else {"answer_no": n, "answer_verbatim": ans[n]["answer_verbatim"], "sheet_row": ans[n]["sheet_row"]}
for r in R:
    e = dict(outcome=r["outcome"], boards=r["boards"], design_shows=r["design"], prd_v10=r["prd"].replace('\\"', '"'), cases=r["cases"])
    if r.get("answer") is not None: e["po_answer"] = A(r["answer"])
    if r.get("question"): e["question_drafted_not_sent"] = r["question"]; e["sent_on"] = None
    if r.get("note"): e["note"] = r["note"]
    e["where"] = (f"Chris Ward answer {r['answer']} (question sheet of 19 Oct 2026, row {ans[r['answer']]['sheet_row']})" if r["outcome"] == "PO-RULED"
                  else f"boards {r['boards']} looked at 20 Oct 2026" if r["outcome"] in ("DESIGN-SILENT", "SHOWN-WHEN-DRIVEN") else "question drafted 20 Oct 2026, NOT sent (lane session sends)")
    reg[r["key"]] = e
for k, (o, n, cs) in T.items():
    e = dict(outcome=o, cases=cs, where="no board draws this state (all 68 boards looked at 20 Oct 2026)" if o == "DESIGN-SILENT" else "board 1.19 shows the same wording with the design's sample names")
    if n is not None: e["po_answer"] = A(n)
    reg[k] = e
json.dump({"project": "Splitting Sales Representatives", "prd": "Confluence 919928833 v10 (19 Oct 2026, Chris Ward)", "design": "Claude artifact 8MHqwyffAYtqZ6EccS5RUm, export of 19 Oct 2026 (68 boards)",
           "built": "2026-10-20", "outcomes": sorted({v["outcome"] for v in reg.values()}),
           "counts": {o: sum(v["outcome"] == o for v in reg.values()) for o in sorted({v["outcome"] for v in reg.values()})},
           "unsent_questions": sum(v["outcome"] == "QUESTION-NEEDED" for v in reg.values()), "rows": reg},
          open(f"{HERE}/DESIGN-DIVERGENCE-REGISTER.json", "w"), indent=1, ensure_ascii=False)
# the tool reads a flat {key: {outcome, where, cases}} map
json.dump({k: {"outcome": v["outcome"], "where": v["where"], "cases": v["cases"]} for k, v in reg.items()}, open(f"{HERE}/tools/register-flat.json", "w"), indent=1, ensure_ascii=False)

# ---------------- spec -> design ----------------
s2d = [dict(id=i, prd=c, kind=k, element=el, result=res, boards=bd, design_shows=ds, register=rk or None,
            outcome=(reg[rk]["outcome"] if rk in reg else None), cases=cs) for i, c, k, el, res, bd, ds, rk, cs in E]
missing_reg = [x["register"] for x in s2d if x["register"] and x["register"] not in reg]
assert not missing_reg, missing_reg
hand = [dict(item=a, prd=b, prd_rows=c, boards=d, design_rows=e, verdict=f) for a, b, c, d, e, f in H]
json.dump({"prd": "Confluence 919928833 v10", "elements": s2d, "by_hand_menus_lists_dialogs": hand}, open(f"{HERE}/SPEC-TO-DESIGN-v10.json", "w"), indent=1, ensure_ascii=False)
from collections import Counter
cnt = Counter(x["result"].split(" (")[0] for x in s2d)
md = ["# PRD v10 to design — Splitting Sales Representatives (20 Oct 2026)", "",
      "Every PRD v10 (Confluence 919928833, 19 Oct 2026, Chris Ward) word or element a screen can show, checked against the design export of",
      "19 Oct 2026 by LOOKING at the 68 board pictures (not only OCR). SHOWN / DIFFERENT (with the board) / NOT DRAWN. Each difference or",
      "not-drawn element points at its row in `DESIGN-DIVERGENCE-REGISTER.json`.", "",
      f"Totals: {len(s2d)} elements; " + ", ".join(f"{k} {v}" for k, v in sorted(cnt.items())) + ". The machine check (`spec_to_design_check.py`, OCR + canvas texts as the design files) is in `spec-to-design-tool-run.txt`.", "",
      "| # | PRD v10 | Kind | Element (PRD) | Result | Boards | Design shows | Register outcome | Cases |", "|---|---|---|---|---|---|---|---|---|"]
for x in s2d:
    md.append(f"| {x['id']} | {x['prd']} | {x['kind']} | {x['element']} | **{x['result']}** | {x['boards']} | {x['design_shows']} | {x['outcome'] or '-'} | {', '.join(x['cases'])} |")
md += ["", "## By hand: every menu, list, dialog, tooltip and message, row by row (lesson L-02)", "",
       "| Item | PRD v10 | PRD rows / options / buttons | Boards | Design rows / options / buttons | Verdict |", "|---|---|---|---|---|---|"]
for x in hand: md.append(f"| {x['item']} | {x['prd']} | {x['prd_rows']} | {x['boards']} | {x['design_rows']} | **{x['verdict']}** |")
open(f"{HERE}/SPEC-TO-DESIGN-v10.md", "w").write("\n".join(md) + "\n")

# ---------------- design -> cases ----------------
inv = json.load(open(f"{DD}/design-text-inventory-2026-10-19.json"))
ocr = {os.path.basename(f)[:-4] + ".png": open(f).read() for f in glob.glob(f"{DD}/ocr/*.txt")}
PAGE = {"card": "1", "customer": "2", "partsale": "3", "sbr": "4", "sbc": "5", "phone": "6"}
def boards_of(r):
    if r["src"] == "A-title": return [r["text"].split(" ")[0]]
    if r["src"] == "A-note":
        m = re.match(r"canvas note (\w+)-note-(\d+)", r["where"])
        if m: return [f"{PAGE[m.group(1)]}.{int(m.group(2))}"]
        m = re.match(r"canvas note (\w+)-intro", r["where"]); return [f"page {PAGE[m.group(1)]}"] if m else []
    if r["src"] == "A-page": return []
    if r["src"] == "O": return sorted({file2board[f] for f, t in ocr.items() if r["text"] in t}, key=lambda b: [int(x) for x in b.split(".")])
    bs = re.findall(r"(?<![\d.])([1-6]\.\d{1,2})(?![\d])", r["where"])
    if not bs: bs = [file2board[f] for f, t in ocr.items() if r["text"] in t]
    m = re.match(r"p(\d)\b", r["where"])
    return sorted(set(bs), key=lambda b: [int(x) for x in b.split(".")]) or ([f"page {m.group(1)}"] if m else [])
# v10 / answers reclassification, by row index (looked at on the pictures 20 Oct 2026)
RE = {162: ("SAME", "S2-R17 v10 + answer 8: Lead Technician and Service Advisor keep today's read-only labels", "GAP-1"),
      163: ("SAME", "S2-R17 v10 + answer 8", "GAP-1"),
      230: ("DIFFERENT", "S2-N2 v10 says the label stays \"Sales representative\"; the boards read \"Sales Representative\" (PO-RULED, answer 7)", "GAP-2"),
      277: ("DIFFERENT", "PO-RULED answer 24 (dash / blank)", None), 278: ("DIFFERENT", "PO-RULED answer 25 (dash; $0.00 only for a $0.00 charge)", None),
      145: ("DIFFERENT", "PO-RULED answer 11 (arrow always shows)", None),
      293: ("DIFFERENT", "S3-R6 + answer 9 say 'edit button'; QUESTION-NEEDED", "GAP-5"),
      269: ("SAME", "S5-R6 v10: \"Each row shows its share in its Adjustments column.\" (answer 22)", "GAP-7")}
GAPROWS = {"GAP-1": "C666024 / C665932 do not state the LT/SA read-only labels", "GAP-2": "C666030 expects \"Sales Representative\"; C665935 silent",
           "GAP-5": "no case names the phone toggle", "GAP-7": "no case says the share shows in Adjustments"}
out = []
for i, r in enumerate(inv):
    cls, why, gap = r["cls"], r["note"], None
    if i in RE: cls, why, gap = RE[i]
    if cls == "SPEC-CONFLICT": cls = "DIFFERENT"
    bs = boards_of(r)
    pic = sorted({c for b in bs for c in board_cases.get(b, ())})
    words = []
    t = r["text"].strip()
    if cls != "DATA" and (len(t) >= 12 or (cls == "SAME" and len(t) >= 6)):
        words = sorted(k for k, v in corpus.items() if t in v)
    if cls == "DATA": status = "DATA (sample data; no case needed)"
    elif cls == "DIFFERENT" and not gap: status = f"PO-RULED ({why}); the cases follow the ruling"
    elif gap: status = f"MISSING -> {gap} ({GAPROWS.get(gap, '')})".replace(" ()", "")
    elif r["src"] in ("A-page",): status = "DESIGN NAVIGATION (page name; every page's boards are attached to cases)"
    elif words: status = "COVERED (wording)"
    elif pic and r["src"] in ("A-title", "A-note"): status = "COVERED (board title/note of an attached board; quoted under References from Design)" if any(csec[c] == "DESIGN" for c in pic) else "COVERED (Before board attached as today's look)"
    elif i == 228: bs, pic, status = ["2.2", "2.16", "2.17", "2.18", "3.0-3.4"], ["C666003", "C666029", "C666030"], "EXISTING SCREEN TEXT, unchanged by this feature (New Customer and part sale 'Save' buttons, seen on attached boards)"
    elif i == 276: status = "COVERED (wording: 'dash' in C665962, C665973, C666031, C666032)"
    elif pic and ("existing ShopView screen text" in (r["note"] or "") or (r["src"] == "H" and cls == "DESIGN-ONLY" and not r["prd"])): status = "EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards)"
    elif pic: status = "COVERED (picture: the case compares the screen with this board)"
    elif r["src"] == "A-note" and bs and bs[0].startswith("page"): status = "COVERED (page intro; its rules are rows in the visual inventory R1-R10 and in this file)"
    else: status = "CHECK BY HAND"
    out.append(dict(row=i + 1, src=r["src"], text=t, where=r["where"], class_19oct=r["cls"], class_v10=cls, prd=r["prd"], why=why, boards=bs,
                    cases_by_wording=words[:12], cases_by_picture=pic, status=status))
hand_left = [x for x in out if x["status"] == "CHECK BY HAND"]
# visual inventory rows -> cases (by hand, from the 20 Oct look at the pictures)
VI = json.load(open(f"{HERE}/tools/visual_rows.json"))
json.dump({"text_rows": out, "visual_rows": VI}, open(f"{HERE}/DESIGN-TO-CASES.json", "w"), indent=1, ensure_ascii=False)
sc = Counter(x["status"].split(" (")[0].split(" ->")[0] for x in out); cc = Counter(x["class_v10"] for x in out)
vc = Counter(v["status"].split(" (")[0].split(" ->")[0] for v in VI)
md = ["# Design to cases — Splitting Sales Representatives (20 Oct 2026)", "",
      "Every row of the 19 Oct text inventory (1,370 rows) and of the visual inventory (70 rows), re-classified against PRD v10 and Chris",
      "Ward's answers, with the case that checks it. 'Picture' coverage = the case attaches that board's picture and tells the tester to",
      "compare the screen with it (attachment log `applied/apply*-log.jsonl`); 'wording' = the case's own text contains the words.", "",
      "## Counts", "", "| Text rows by class (v10) | n |", "|---|---|"] + [f"| {k} | {v} |" for k, v in sorted(cc.items())] + \
     ["", "| Text rows by status | n |", "|---|---|"] + [f"| {k} | {v} |" for k, v in sorted(sc.items())] + \
     ["", "| Visual rows by status | n |", "|---|---|"] + [f"| {k} | {v} |" for k, v in sorted(vc.items())] + \
     ["", f"Rows left to check by hand: {len(hand_left)}.", "",
      "## Visual inventory rows (70)", "", "| # | Row | Class (v10) | Case(s) | Status |", "|---|---|---|---|---|"] + \
     [f"| {v['id']} | {v['what']} | {v['class_v10']} | {', '.join(v['cases'])} | {v['status']} |" for v in VI] + \
     ["", "## Text inventory rows that are not sample data", "", "| Row | Src | Text | Class (v10) | Boards | Wording cases | Picture cases | Status |", "|---|---|---|---|---|---|---|---|"]
for x in out:
    if x["class_v10"] == "DATA": continue
    md.append(f"| {x['row']} | {x['src']} | {x['text'][:140].replace('|', '/')} | {x['class_v10']} | {', '.join(x['boards'][:8])}{' …' if len(x['boards']) > 8 else ''} | {', '.join(x['cases_by_wording'][:6])}{' …' if len(x['cases_by_wording']) > 6 else ''} | {', '.join(x['cases_by_picture'][:6])} | {x['status']} |")
md += ["", f"The {cc['DATA']} DATA rows (names, amounts, dates, ids, record text) are listed in `DESIGN-TO-CASES.json` with their boards."]
open(f"{HERE}/DESIGN-TO-CASES.md", "w").write("\n".join(md) + "\n")
print("register", len(reg), json.load(open(f"{HERE}/DESIGN-DIVERGENCE-REGISTER.json"))["counts"])
print("spec->design", len(s2d), dict(cnt)); print("text rows", len(out), dict(cc), dict(sc)); print("visual", len(VI), dict(vc))
for x in hand_left[:80]: print("HAND", x["row"], x["src"], x["text"][:80], x["boards"][:5], x["class_v10"])
