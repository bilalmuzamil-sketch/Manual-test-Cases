#!/usr/bin/env python3
"""Phase D outputs (draft): text inventory (machine + hand transcription, classified), visual inventory (tool + hand),
DESIGN-CASE-PLAN.md, DESIGN-DIVERGENCE-ROWS.json, QUESTIONS-DESIGN.json. Exits 1 if any text or visual row is unclassified.
Run from anywhere: python3 build/founder-mode/part-lifecycle/full-pass-2026-10-27/design/build_design_outputs.py"""
import glob, html, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
PL = os.path.normpath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, HERE)
import design_plan as P
import visual_rows as V

RET = {"C425659", "C425758", "C425639", "C425759", "C154761", "C425602", "C425622", "C425629", "C425701", "C425723", "C425755", "C425776"}
cases = {}
titles = {}
for f in glob.glob(os.path.join(HERE, "inventory", "cases-live", "C*.json")):
    d = json.load(open(f))
    cid = "C%d" % d["id"]
    if cid in RET:
        continue
    t = " ".join(html.unescape(re.sub(r"<[^>]+>", " ", (d.get(k) or ""))) for k in ("title", "custom_preconds", "custom_steps", "custom_expected"))
    cases[cid] = re.sub(r"\s+", " ", t.replace("’", "'").replace("“", '"').replace("”", '"')).lower()
    titles[cid] = d["title"]


def where(t):
    a = _where(t.lower().replace("’", "'"))
    return a or _where(t.lower().replace("’", "'").replace(" / ", " | "))


def _where(t):
    parts = [p.strip(" .,:;-+") for p in re.split(r"\{…\}|…|\.\.\.", t)]
    parts = [p for p in parts if len(p) >= 3]
    if not parts:
        return []
    return sorted(c for c, x in cases.items() if all(p in x for p in parts))


BOARD_TO_D = {}
for c in P.CASES:
    for b in c["boards"]:
        m = re.match(r"(\d+\.\d+)", b)
        if m:
            BOARD_TO_D.setdefault(m.group(1), []).append(c["key"])
PAGE_TO_D = {}
for k, v in BOARD_TO_D.items():
    PAGE_TO_D.setdefault(k.split(".")[0], []).extend(v)

# --- explicit classes for rows a rule cannot decide (lower-cased text -> class) ---
OVERRIDE = {
    "bin location: all bin locations": "CASE-NEEDED D-01 (toolbar look)",
    "category: all categories": "CASE-NEEDED D-01 (toolbar look)",
    "inventory qty: 78 ea": "CASE-NEEDED D-35 (lookup result second line)",
    "remaining quantity": "CASE-NEEDED D-42, D-47 (column name)",
    "part history at lethbridge": "CASE-NEEDED D-33 (board title)",
    "+ add bin location": "COVERED C425684, C425685 (\"Add Bin Location\" with a plus icon); look in D-14",
    "2 records selected.": "COVERED C154757; look in D-08",
    "630 records selected.": "COVERED C154757, C425596; look in D-10",
    "f40010212 already exists at this location.": "COVERED C425677 (S7-N3 message with the number as a placeholder); look in D-19",
    "part created. linked to f40010212 in the part library. its description": "COVERED C154777 (S7-R9 message, number as a placeholder); look in D-18",
    "the same part is renamed in place. it keeps its stock, its bins and its history.": "COVERED design note restating S13-R18 (C154838); look in D-01 (board 2.3)",
    "no parts match the search \"n6801-06-04\".": "COVERED C425592 (the usual no-match message); look in D-04",
}
GLYPH = re.compile(r"^[\W\d_]{0,3}$|^[a-z]$|^(as|ai|ap|ea|o|i)$")
CHROME = {"schedule", "customers", "contact", "decline", "technicians", "line approved", "n/a", "not available", "1 available",
          "the blue", "clock in", "sales & service", "supply chain"}
NOTE_OUT = ("today ", "part history records counts", "no active and inactive tabs", "the page is called catalog",
            "create a part", "correct a part", "retire one part", "retire or bring back", "stop counting", "an inactive part in daily",
            "the part library the shared", "s number or description")
rows = []


def classify(text, src, w, prior=""):
    lo = text.lower().strip()
    if w:
        return "IN A CASE (" + ", ".join(w[:6]) + (" …" if len(w) > 6 else "") + ")"
    if lo in OVERRIDE:
        return OVERRIDE[lo]
    if prior and not prior.startswith("COVERED") and prior:
        return prior
    if "Before.dc.html" in src or "before" in src.lower() and src.startswith(("2.0", "1.0", "3.0", "6.0", "7.0")):
        return "OUT-OF-SCOPE Before board (today's screen, not the target; Rule 115)"
    m = re.match(r"^(\d+\.\d+) ", text)
    if m:
        if "before" in lo:
            return "OUT-OF-SCOPE Before board title (today's screen)"
        ks = BOARD_TO_D.get(m.group(1))
        return "CASE-NEEDED " + ", ".join(ks) + " (board title, quoted under References from Design)" if ks else "UNCLASSIFIED"
    m = re.match(r"^(\d)\. ", text)
    if m:
        return "CASE-NEEDED " + ", ".join(sorted(set(PAGE_TO_D.get(m.group(1), [])))) + " (page name, cited under References from Design)"
    if src.endswith(("canvas.json",)) or "canvas.json" in src:
        if "edited and deleted" in lo:
            return "SPEC-CONFLICT DV-02 (question DQ-02)"
        if "wraps onto a second line" in lo or "changed at: staging heavy duty - 9919\", naming" in lo or "they end with" in lo:
            return "SPEC-CONFLICT DV-03 (question DQ-03; held D-33)"
        if lo.startswith(NOTE_OUT):
            return "OUT-OF-SCOPE design note introducing a page or describing today's screen"
        codes = re.findall(r"S\d+-[RNE]\d+[a-z]?", text)
        cov = sorted({c for code in codes for c, x in cases.items() if code.lower() + ":" in x})
        if cov:
            return "COVERED design note restating " + ", ".join(sorted(set(codes))) + " (" + ", ".join(cov[:6]) + (" …" if len(cov) > 6 else "") + ")"
        if lo.startswith("new part request on work order"):
            return "CASE-NEEDED D-35 (note on board 6.1, quoted under References from Design)"
        if lo.startswith("new line on s2-9647"):
            return "CASE-NEEDED D-38 (note on board 6.4, quoted under References from Design)"
        if "story 13" in lo or "badge" in lo:
            return "CASE-NEEDED D-20, D-21, D-22 (note on the title-row pill)"
        if "shot of the build" in lo or "redrawn" in lo:
            return "SPEC-CONFLICT DV-03 (question DQ-03; held D-33)"
        return "CASE-NEEDED " + ", ".join(sorted(set(sum(BOARD_TO_D.values(), []))))[:0] + "UNCLASSIFIED"
    if "correct-06" in src:
        if re.search(r"changed at:", lo):
            return "COVERED via template C425774, C425775 (\"... | Changed at: <location>\"); look in D-33"
        return "DATA (example data on the redrawn table)"
    if GLYPH.match(lo):
        return "DATA (single character, digit or glyph)"
    if lo in CHROME:
        return "OUT-OF-SCOPE existing ShopView screen text this feature does not change"
    return prior or "UNCLASSIFIED"


# machine rows (design files)
mach = json.load(open(os.path.join(HERE, "inventory", "machine-text-inventory-2026-10-27.json")))
for r in mach["rows"]:
    w = where(r["text"])
    c = classify(r["text"], r["where"], w, r["class"] if r["class"].startswith("DATA") else "")
    rows.append(dict(source="design file", text=r["text"], where=r["where"], cls=c))
# hand transcription rows (14 Oct inventory strings, the 13 Oct boards, re-checked by viewing on 27 Oct)
base = json.load(open(os.path.join(PL, "update-2026-10-14", "design-strings-2026-10-14.json")))
for r in base:
    if r["class"].startswith("NOT DESIGN TEXT"):
        rows.append(dict(source="hand transcription", text=r["text"], where=r["where"][0], cls="NOT DESIGN TEXT (our own change-note phrase, kept for the record)"))
        continue
    w = where(r["text"])
    prior = r["class"]
    if prior.startswith("COVERED") and not w:
        prior = prior  # COVERED rows of 14 Oct cite templates or design-only lines; keep them, they cite no retired case
        c = OVERRIDE.get(r["text"].lower().strip()) or prior
    else:
        c = classify(r["text"], r["where"][0], w, prior)
    rows.append(dict(source="hand transcription", text=r["text"], where=r["where"][0], cls=c))
# texts seen on 27 Oct that the 14 Oct list lacked (from viewing the images)
EXTRA = [
    ("No parts match the search \"N6801-06-04\".", "3.4 Done", None),
    ("Avg Cost", "5.3 / 5.4 / 4.0", None),
    ("Total Qty", "5.3 / 5.4 / 5.7 / 4.0", None),
    ("Search customers, work orders, ...", "4.0 Before", "OUT-OF-SCOPE Before board (today's screen, not the target; Rule 115)"),
    ("Catalog", "4.0 Before (side menu)", "OUT-OF-SCOPE Before board (today's screen, not the target; Rule 115)"),
    ("Last", "4.0 Before (column cut off)", "CASE-NEEDED D-01 (default column set)"),
    ("Unassigned | 0", "6.6 (bin chip of the active result)", "DATA (example bin chip)"),
]
for t, wh, c in EXTRA:
    w = where(t)
    rows.append(dict(source="hand transcription (27 Oct)", text=t, where=wh, cls=c if (c and not w) else classify(t, wh, w)))

# de-duplicate by (lower text) keeping the first
seen, uniq = set(), []
for r in rows:
    k = r["text"].lower().strip()
    if k in seen:
        continue
    seen.add(k)
    uniq.append(r)
rows = uniq
unc = [r for r in rows if "UNCLASSIFIED" in r["cls"] or not r["cls"]]
from collections import Counter
cnt = Counter(r["cls"].split(" ")[0] if not r["cls"].startswith("IN A CASE") else "IN-A-CASE" for r in rows)
json.dump(dict(rows=rows, counts=cnt, unclassified=len(unc)), open(os.path.join(HERE, "inventory", "TEXT-INVENTORY-2026-10-27.json"), "w"), indent=1, ensure_ascii=False)
with open(os.path.join(HERE, "inventory", "TEXT-INVENTORY-2026-10-27.md"), "w") as o:
    o.write("# Part Lifecycle — design text inventory, 27 Oct 2026 (Rule 124 as amended 9 Oct; Rule 126)\n\n")
    o.write("Design: canvas Vz6rprcWyP16tYxzM1kdeE, 13 Oct copy (all 53 files unchanged on 27 Oct). The boards are images, so the\n"
            "inventory is (1) `design_text_inventory.py` over the design's files (board titles, page names, the 59 notes, the four Before\n"
            "boards' HTML, the redrawn 2.6 table) and (2) the hand transcription of every board image (`BOARD-TRANSCRIPTION-2026-10-27.md`,\n"
            "all 47 images viewed 27 Oct). Matched against the 274 live cases that stay (the 12 \"Retire OR retest\" cases excluded).\n\n")
    o.write(f"Distinct texts: {len(rows)} · counts by class: {dict(cnt)} · **unclassified: {len(unc)}**\n\n| # | Source | Text | Where | Class |\n|---|---|---|---|---|\n")
    for i, r in enumerate(rows):
        o.write(f"| {i} | {r['source']} | {r['text'][:110].replace('|', '/')} | {str(r['where'])[:60].replace('|', '/')} | {r['cls'].replace('|', '/')} |\n")

# visual inventory: tool rows + hand rows
vt = json.load(open(os.path.join(HERE, "inventory", "visual-tool", "visual-rows.json")))
vt_rows = vt if isinstance(vt, list) else vt.get("rows", [])
vrows = []
for r in vt_rows:
    states = " ".join(str(x) for x in (r.get("states") or r.get("seen_in") or []))
    s = json.dumps(r)
    if "correct-06" in s:
        c = "D-33 (redrawn table on board 2.6)"
    else:
        c = "OUT-OF-SCOPE Before board measured by the tool (today's screen, not the target)"
    vrows.append(dict(source="design_visual_inventory.py", id=r.get("id"), element=r.get("element"), attribute=r.get("attribute"), value=str(r.get("value"))[:120], cls=c))
for b, e, seen_, c in V.ROWS:
    vrows.append(dict(source="hand (image viewed 27 Oct)", board=b, element=e, value=seen_, cls=c))
vunc = [r for r in vrows if not r["cls"]]
json.dump(dict(rows=vrows, unclassified=len(vunc)), open(os.path.join(HERE, "inventory", "VISUAL-INVENTORY-2026-10-27.json"), "w"), indent=1, ensure_ascii=False)
vc = Counter(("CASE-NEEDED" if re.match(r"D-\d", r["cls"]) else r["cls"].split(" ")[0]) for r in vrows)
with open(os.path.join(HERE, "inventory", "VISUAL-INVENTORY-2026-10-27.md"), "w") as o:
    o.write("# Part Lifecycle — design visual inventory, 27 Oct 2026 (Rule 126 point 3, skill 21 §4b)\n\n")
    o.write("`design_visual_inventory.py` rendered all 51 board files at 1440 and 1536 px (`visual-tool/`). It can measure only the\n"
            "DOM, which exists on the four Before boards and the redrawn 2.6 table; the other 46 boards are screenshots, so every look\n"
            "item on them was listed by hand from the image (`visual_rows.py`).\n\n")
    o.write(f"Rows: {len(vrows)} ({len(vt_rows)} tool + {len(V.ROWS)} hand) · by class: {dict(vc)} · **unclassified: {len(vunc)}**\n\n")
    o.write("| Source | Board | Element | What is seen | Class |\n|---|---|---|---|---|\n")
    for r in vrows:
        o.write(f"| {r['source']} | {r.get('board','')} | {str(r.get('element'))[:50]} | {str(r.get('value') or '')[:150].replace('|','/')} {('· ' + str(r.get('attribute'))) if r.get('attribute') else ''} | {r['cls']} |\n")

# case plan
with open(os.path.join(HERE, "DESIGN-CASE-PLAN.md"), "w") as o:
    held = [c for c in P.CASES if c.get("hold")]
    o.write("# Part Lifecycle — \"Design — how it looks\" case plan (Phase D draft, 27 Oct 2026)\n\n")
    o.write("New TestRail section **\"Design — how it looks\"** under Part Lifecycle 20439 (the coordinator creates it). Keys D-nn, no C-id\n"
            "yet. Every case follows the QA lead's pattern (Rule 117 fourteenth and fifteenth amendments): title starts \"Design: \", short\n"
            "plain preconditions (sign in, the records the screen needs, \"Use a desktop browser at least 1440 pixels wide\", \"Open board\n"
            "<n> of the design to compare\"), one action per step, \"Step N:\" results that say what is seen, then the PRD quotes with\n"
            "From: lines, \"References from Design\" (board names, attached board pictures, the design's own notes quoted) and the\n"
            "AUTOMATION line last. Expected look: the PRD where it speaks; the named board where the PRD is silent (Rule 126 point 5).\n"
            "Pixel values a person cannot judge by eye are compared side by side with the board picture at 100% zoom.\n\n")
    o.write(f"**{len(P.CASES)} cases** · {len(P.CASES) - len(held)} to release when written · {len(held)} held design-version cases "
            f"({', '.join(c['key'] for c in held)}), marker `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO` (D-33: "
            "the design and the tech plan differ, waiting on the PO).\n\n")
    o.write("Boards attached at least once: every one of the 46 target boards (1.1–7.2); the 5 Before boards (1.0/3.0, 2.0, 4.0, 6.0,\n"
            "7.0) are today's screens and are not a target, except 4.0's column set, which D-01 uses as today's default columns.\n\n")
    for c in P.CASES:
        o.write(f"## {c['key']} · {c['title']}  ({len(c['title'])} chars)\n")
        o.write(f"- **Boards / pictures:** {'; '.join(c['boards'])}\n")
        o.write("- **What the tester checks:**\n" + "".join(f"  - {x}\n" for x in c["checks"]))
        o.write(f"- **Backed by:** {'; '.join(c['backing'])}\n")
        o.write(f"- **Existing live cases that already check part of it:** {'; '.join(c['existing']) if c['existing'] else 'none'}\n")
        if c.get("hold"):
            o.write(f"- **HELD** on {c['hold']} (Rule 130 item 5); not added to the run until released.\n")
        if c.get("note"):
            o.write(f"- **Note:** {c['note']}\n")
        o.write("\n")
    # board coverage table
    allboards = ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8",
                 "4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7", "4.8", "4.9", "4.10", "5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7",
                 "6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7", "7.1", "7.2"]
    o.write("## Board → design cases\n\n| Board | Cases |\n|---|---|\n")
    missing = []
    for b in allboards:
        ks = BOARD_TO_D.get(b, [])
        if not ks:
            missing.append(b)
        o.write(f"| {b} | {', '.join(ks) or '**none**'} |\n")
    o.write(f"\nTarget boards with no design case: {missing or 'none'} (4.0 Before is used by D-01 for the column set only).\n")

# divergence rows (spec_to_design_check register format + hand rows)
raw = json.load(open(os.path.join(HERE, "inventory", "spec-to-design-raw.json")))
reg = {}
SHOWN_FRAG = {"S10-R9|Existing records that use ...": "The design shows \"Existing records that use them stay as they are.\" (4.4, 4.7) and \"... use it ...\" (3.3); the PRD's own words are a fragment with \"...\"",
              "S7-R9|Part created. Linked to N68SL-356 in the Part Library. Its description ": "The design shows the same message with its own example data (board 1.4: \"Part created. Linked to F40010212 in the Part Library. Its description \\\"Slack Adjuster\\\" was kept.\")",
              "S7-N5|the same number": "PRD definition in quotes, not on-screen words"}
for r in raw:
    k = r["key"]
    if k in SHOWN_FRAG:
        reg[k] = dict(outcome="SHOWN-WHEN-DRIVEN", where=SHOWN_FRAG[k] + "; checked by viewing the boards 27 Oct 2026", cases=[])
    else:
        reg[k] = dict(outcome="DESIGN-SILENT", where="the design draws no screen or state with these words (all 47 board images viewed and the 59 notes read, 27 Oct 2026)", cases=[])
for dv in P.DIVERGENCES:
    reg[dv["key"] + "|" + dv["where"]] = dict(outcome="QUESTION-READY", where=f"question {dv['question']} drafted 27 Oct 2026, NOT sent (Phase D draft; no Google writes)",
                                             design=dv["design"], prd=dv["prd"], cases=dv["cases_following_prd"], held_case=dv["held_case"])
json.dump(reg, open(os.path.join(HERE, "DESIGN-DIVERGENCE-ROWS.json"), "w"), indent=1, ensure_ascii=False)
json.dump(P.QUESTIONS, open(os.path.join(HERE, "QUESTIONS-DESIGN.json"), "w"), indent=1, ensure_ascii=False)
print(f"text rows {len(rows)} unclassified {len(unc)} {dict(cnt)}")
print(f"visual rows {len(vrows)} unclassified {len(vunc)} {dict(vc)}")
print(f"plan cases {len(P.CASES)} held {sum(1 for c in P.CASES if c.get('hold'))}; target boards without a case: {missing}")
print(f"divergence register rows {len(reg)}: " + str(Counter(v['outcome'] for v in reg.values())))
for c in P.CASES:
    if len(c["title"]) > 80 or ";" in c["title"] or not c["title"].startswith("Design: "):
        print("TITLE PROBLEM", c["key"], c["title"])
for r in unc[:40]:
    print("UNCLASSIFIED:", r["text"][:90], "|", r["where"][:60])
sys.exit(1 if (unc or vunc) else 0)
