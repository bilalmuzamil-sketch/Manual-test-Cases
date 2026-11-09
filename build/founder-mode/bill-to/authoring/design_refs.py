"""References from Design (Rule 117 tenth amendment), round 2 (9 Nov 2026).
- Design cases D-01..D-70: design_refs_design.json, made by make_cases_design.py from the design worker's drafts.
- PRD cases: built here from design-2026-11-09/SPEC-TO-DESIGN-2026-11-09.json (each PRD line's verdict and the figures that show it)
  and DESIGN-FIGURES-2026-11-09.json (page, figure heading, badge, picture, caption). A PRD case gets a block only when a code it quotes is
  SHOWN or DIFFERENT on a board; a case whose screen no board draws gets no heading at all. A DIFFERENT code adds the difference with its
  register id and the PO question number (Rule 130 item 3), so a later ruling finds every affected case by search.
Design: "Bill To design" https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd, version 1794239066-4906, read 9 Nov 2026."""
import json, os, re
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
DD = f"{P}/design-2026-11-09"
CANVAS = 'Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794239066-4906, read 9 Nov 2026'
DREFS = json.load(open(f"{D}/design_refs_design.json"))
FIG = json.load(open(f"{DD}/DESIGN-FIGURES-2026-11-09.json"))["list"]
S2D = {r["code"]: r for r in json.load(open(f"{DD}/SPEC-TO-DESIGN-2026-11-09.json"))["rows"]}
REG = {d["id"]: d for d in json.load(open(f"{P}/DESIGN-DIVERGENCE-REGISTER.json"))["differences"]}
QMAP = {1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9, 7: 10, 8: 11, 9: 12, 10: 13, 11: 14, 12: 15}   # design question -> merged sheet number
BYPIC = {}
for f in FIG:
    if f.get("figure_picture"): BYPIC[os.path.basename(f["figure_picture"])[:8]] = f   # "bt-p1-12" -> figure


def for_codes(codes, max_pics=4):
    figs, notes = [], []
    def add(pre):
        f = BYPIC.get(pre)
        if f and f not in figs: figs.append(f)
    for code in sorted(codes):
        r = S2D.get(code)
        if not r or r["verdict"] not in ("SHOWN", "DIFFERENT"): continue
        for pre in re.findall(r"bt-p\d-\d\d", r.get("where") or ""): add(pre)
        if r["verdict"] == "DIFFERENT":
            for rid in re.findall(r"BT-D\d\d", r.get("note") or ""):
                d = REG.get(rid)
                if not d: continue
                qn = int(re.search(r"question (\d+)", d["question"]).group(1))
                if qn not in QMAP: continue          # design question 13 was dropped (no verdict depends on it)
                for pre in re.findall(r"bt-p\d-\d\d", d.get("picture") or ""): add(pre)
                n = (f"Difference {rid} on {code} ({r['note']}): this case follows the PRD; the design's version is asked in question "
                     f"{QMAP[qn]}.")
                if n not in notes: notes.append(n)
    if not figs: return None
    figs = figs[:max_pics]
    head = (CANVAS + ": pictures " + ", ".join(f'"{f["heading"]}" (page {f["page"]} "{f["page_name"]}", {f["badge"]})' for f in figs)
            + ". Compare the screen with the pictures; the expected results come from the PRD.")
    words = []
    for f in figs:
        for cap in f.get("captions") or []:
            if cap not in words and len(words) < 3: words.append(cap); break
    return {"pages": head, "pictures": [os.path.basename(f["figure_picture"]) for f in figs], "words": words, "notes": notes}


def for_case(c):
    if c["key"] in DREFS: return DREFS[c["key"]]
    return for_codes({x for x in c["q"] if isinstance(x, str)})
