#!/usr/bin/env python3
"""Text inventory of the design canvas (Rule 124 as amended 9 Oct 2026, skill 21 §4): every on-screen text in the design's files (canvas.json,
the 7 boards: titles, notes, badges, figure headings, alt texts, captions) and every word of the 43 screenshots (screen_text.py, transcribed by
viewing each picture), each classified DATA / COVERED (case keys) / OUT-OF-SCOPE (reason) / SPEC-CONFLICT (question) / CASE-NEEDED.
Zero unclassified is the gate. python3 make_inventory.py (run authoring/build.py first: it reads authoring/proposals.json)."""
import json, os, re, html, sys
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
sys.path.insert(0, H); sys.path.insert(0, f"{P}/authoring")
import screen_text as ST
import design_data as DD
PROP = json.load(open(f"{P}/authoring/proposals.json"))
def strip(x): return html.unescape(re.sub(r"<[^>]+>", " ", x or ""))
TESTER = {k: strip(v["fields"]["custom_preconds"]) + " " + strip(v["fields"]["custom_steps"]) + " " + strip(v["fields"]["custom_expected"].split("Exact quotes from the source")[0])
          for k, v in PROP.items()}
REFS = {k: strip(v["fields"]["custom_expected"].split("References from Design")[-1]) for k, v in PROP.items()}
def keys_with(t, where=TESTER, n=8):
    ks = [k for k, x in where.items() if t in x]
    return ks[:n] + ([f"+{len(ks) - n} more"] if len(ks) > n else [])

rows = {}
def add(text, src, kind):
    r = rows.setdefault(text, dict(text=text, sources=[], kinds=set()))
    if src not in r["sources"]: r["sources"].append(src)
    r["kinds"].add(kind)

# ---- the design's files
cj = json.load(open(f"{H}/files/project/canvas.json"))
add(cj["title"], "canvas.json title", "canvas")
for pg in cj["pages"]: add(pg["name"], "canvas.json pages", "canvas")
for b, v in cj["boards"].items(): add(v["title"], f"canvas.json boards[{b}].title", "canvas")
for b in DD.BOARD:
    t = open(f"{H}/files/project/{b}").read()
    add(re.search(r"<title>(.*?)</title>", t).group(1), f"{b} <title>", "canvas")
    add(html.unescape(re.search(r'<h2 class="sv-h2"[^>]*>(.*?)</h2>', t).group(1)), f"{b} h2", "board-title")
    add(html.unescape(re.search(r'<p style="margin: 0; font-size: 14px[^>]*>(.*?)</p>', t).group(1)), f"{b} note", "board-note")
for f in DD.FIGS:
    add(f["badge"], f"{f['board']} figure {f['n']} badge", "badge")
    add(f["heading"], f"{f['board']} figure {f['n']} heading", "heading")
    add(f["alt"], f"{f['board']} figure {f['n']} alt", "alt")
    add(f["caption"], f"{f['board']} figure {f['n']} caption", "caption")
# ---- the screenshots
for iid, v in ST.S.items():
    for t in v["ui"]: add(t, f"{iid} ({'after' if v['after'] else 'before'})", "ui-after" if v["after"] else "ui-before")
    for t in v["data"]: add(t, f"{iid}", "data")

CHROME = set(ST.CHROME_OLD + ST.CHROME_NEW + ST.SIDEBAR)
OOS_CHROME = "App chrome outside the six reports (top bar, other report menus): not changed by PRD v5; nothing on these reports depends on it."
EXPLICIT = {
 "Switch Location": ("SPEC-CONFLICT", "DD-01, question 11 (drafted); PRD S7-R3 \"Switch location\"", ["probe:\"Switch location\""] + ["D-76", "S7-03", "D-39", "D-64"]),
 "×": ("SPEC-CONFLICT", "In the switch-location dialog: DD-01, question 11 (not in PRD S7-R3's button list). In the Location chip, Customer tags and search box: native controls, DR-04 (covered by D-66, D-74).", ["D-76", "D-66", "D-74"]),
 "Search vendor": ("SPEC-CONFLICT", "DD-02, question 12 (drafted); PRD S5-R13 \"Search vendors\"", ["probe:\"Search vendors\""] + ["D-77", "D-32", "D-73", "S5-29"]),
 "Open Ba": ("DATA", "a heading cut at the window edge on a production picture (today's A/R Detail is wider than 1440 px)", []),
 "Staging H": ("DATA", "a location name cut by the open menu", []),
 "Date: 2026-10-15": ("COVERED", "today's date chip label \"Date\" (What changes: now \"As of\")", ["probe:no longer \"Date\""] + ["S5-01", "S5-02", "S5-03"]),
 "Location Name": ("COVERED", "today's A/P heading, renamed \"Location\"", ["probe:no longer \"Location Name\""] + ["S6-02"]),
 "Location Full Name": ("COVERED", "today's A/R heading as the screen writes it (PRD: \"Location full name\"), renamed \"Location\"", ["probe:Location Full Name"] + ["S6-01"]),
 "Customer Full Name": ("SPEC-CONFLICT", "kept heading; PRD writes \"Customer full name\": DD-06, question 4 (sent 22 Oct 2026); A/P-style capitals elsewhere covered", ["probe:Customer Full Name"] + ["D-81", "D-04", "S6-01"]),
 "Transaction Type": ("COVERED", "A/P heading as the PRD writes it; on A/R the PRD writes \"Transaction type\": DD-06, question 4 (sent)", ["probe:\"Transaction Type\""] + ["S2-23", "D-13", "D-81"]),
 "Due Date": ("COVERED", "A/P heading; on A/R see DD-06, question 4", ["probe:\"Due Date\""] + ["S2-24", "D-13", "D-81"]),
 "Past Due": ("COVERED", "A/P heading; on A/R see DD-06, question 4", ["probe:\"Past Due\""] + ["S2-25", "D-13", "D-81"]),
 "Open Balance": ("COVERED", "A/P heading and the headline column; on A/R see DD-06, question 4", ["probe:\"Open Balance\""] + ["S2-25", "D-13", "D-81"]),
 "Total for": ("COVERED", "the group subtotal row label (today's), shown under each open group", ["D-56", "D-62", "D-63"]),
 "Invoice": ("COVERED", "a Transaction type value", ["probe:Transaction type"] + ["S2-11", "D-56", "D-63"]),
 "Credit": ("COVERED", "a Transaction type value (credit memo / vendor credit)", ["probe:credit memo"] + ["S2-11", "D-56", "D-58"]),
 "—": ("COVERED", "an empty Due Date / Past Due cell (DR-05)", ["probe:\"—\""] + ["S2-34", "D-58"]),
 "Close": ("COVERED", "the toast's close control", ["probe:\"Close\""] + ["D-55"]),
 "Total": ("COVERED", "the Summaries' headline column and the group rows' \"Total\" label", ["probe:\"Total\""] + ["S2-02", "D-52", "D-59"]),
 "Totals": ("COVERED", "the Totals row label", ["probe:Totals row"] + ["DATA-05", "D-50", "D-56"]),
 "Any": ("COVERED", "the Past due menu row", ["probe:\"Any\""] + ["S5-30", "D-71"]),
 "All customers": ("COVERED", "the Customer menu row", ["probe:\"All customers\""] + ["S5-28", "D-74"]),
 "All vendors": ("COVERED", "the Vendor menu row", ["probe:\"All vendors\""] + ["S5-29", "D-73"]),
 "Customer": ("COVERED", "the Summary's first heading, and today's Customer picker on A/R Collection", ["probe:\"Customer\""] + ["D-50", "S5-01"]),
 "Vendor": ("COVERED", "the A/P Summary's first heading", ["probe:\"Vendor"] + ["D-54"]),
 "⋯": ("COVERED", "the Export menu button", ["probe:⋯"] + ["S3-01", "D-53"]),
 "Phone:": ("COVERED", "call list label", ["probe:\"Phone: \""] + ["S9-01", "D-56"]),
 "Credit term:": ("COVERED", "call list label", ["probe:\"Credit term: \""] + ["S9-01", "D-56"]),
 "COD": ("COVERED", "credit term shown when none is set", ["probe:COD"] + ["S9-01"]),
 "$0.00": ("SPEC-CONFLICT", "in I35 the No locations empty state draws a Totals row of $0.00 (DD-03, question 13, drafted; PRD S5-R6a \"no totals\"); elsewhere an empty bucket's total in the Totals row (data)", ["D-78", "D-68", "S5-14"]),
 "Net 30": ("DATA", "a customer's credit term (example)", []), "Net 15": ("DATA", "a customer's credit term (example)", []),
 "Net 45": ("DATA", "a customer's credit term (example)", []),
 "1 selected": ("COVERED", "the Location menu count", ["probe:\"1 selected\""] + ["S5-07", "D-67"]),
 "2 selected": ("COVERED", "the Location and Customer menu count", ["probe:\"2 selected\""] + ["S5-07", "D-66", "D-74"]),
 "Location: Staging Lethbri...": ("COVERED", "one location ticked: prefix kept, name shortened (DR-03)", ["probe:Location: Staging Lethbri"] + ["D-67", "S5-10"]),
 "Customer: 10 Trucking": ("COVERED", "one customer ticked: prefix kept (DR-03)", ["probe:\"Customer: \" and"] + ["D-70", "S5-21"]),
 "Customer: Andrews' Truck ...": ("COVERED", "one long-named customer ticked: shortened (DR-03)", ["probe:\"Customer: \" and"] + ["D-75", "S5-28"]),
 "As of: 09/30/2026": ("COVERED", "the date chip with a picked date", ["probe:\"As of: \" and"] + ["D-70", "S5-25"]),
 "As of: 10/19/2026": ("COVERED", "the date chip (S5-R1 format)", ["probe:\"As of: "] + ["S5-01", "D-50"]),
 "Past due: 2 ranges": ("COVERED", "two ranges ticked", ["probe:\"Past due: 2 ranges\""] + ["S5-30", "D-72"]),
 "Customer: 2 customers": ("COVERED", "two customers ticked", ["probe:\"Customer: 2 customers\""] + ["S5-23", "D-74"]),
 "This work order is in Staging Lethbridge - 4310. Switch your active location to view it?": ("COVERED", "the dialog message with an example location", ["probe:This work order is in"] + ["S7-03", "D-64"]),
 "A/P Unpaid Invoices Report": ("COVERED", "the page title of A/P Unpaid Invoices (starting screens name it)", ["probe:\"A/P Unpaid Invoices Report\""] + ["D-58", "S2-06"]),
}
OOS_BEFORE_ONLY = {"All", "Estimates", "Completed", "Search", "Assigned to me", "Asset on Site", "Create Work Order", "On Site", "Status", "Number", "Asset",
                   "Unit", "VIN/Serial #", "Progress", "Service Advisor", "Lead Technician", "Clocked", "Approved", "WorkOrder not found.",
                   "Please try to resolve this.", "Request failed with status code 400", "Error fetching work order"}
out = []
for t, r in rows.items():
    cls, note, keys = None, "", []
    kinds = r["kinds"]
    if t in EXPLICIT:
        cls, note, keys = EXPLICIT[t]
        if keys and keys[0].startswith("probe:"):
            found = [k for k in keys_with(keys[0][6:].replace('\\"', '"'), n=50) if not k.startswith("+")]
            given = [k for k in keys[1:] if k in PROP]
            keys = (list(dict.fromkeys(given + found))[:8] if cls == "SPEC-CONFLICT"
                    else list(dict.fromkeys([k for k in given if k in found] + found))[:8] or given)
    elif t.startswith("Total for "): cls, note, keys = "COVERED", "the subtotal row under an open group (today's label, kept), with the group's name", ["D-56", "D-62", "D-63"]
    elif kinds == {"data"}: cls, note = "DATA", "example record data (names, numbers, dates, amounts, counts, phones, locations)"
    elif t in OOS_BEFORE_ONLY: cls, note = "OUT-OF-SCOPE", "the production Work Orders list a dead-end link lands on today (SV-5706, fixed by Story 7); not a screen of these reports. Covered by S7-03 and S7-18 (links open the document or ask to switch)."
    elif t in CHROME and not keys_with(f"\"{t}\"") and t not in ("Reports",):
        cls, note = "OUT-OF-SCOPE", OOS_CHROME
    elif kinds & {"caption", "alt", "heading", "board-title"}:
        ks = keys_with(t, REFS)
        if ks: cls, note, keys = "COVERED", "the design's own words, quoted under References from Design", ks
        else:
            ks = [k for k, x in REFS.items() if any(f["alt"] == t or f["heading"] == t for f in DD.FIGS if DD.pic(f) in x)]
            cls, note, keys = ("COVERED", "the figure this text belongs to is attached to these cases", ks[:8]) if ks else (None, "", [])
    elif kinds & {"badge", "canvas", "board-note"}:
        ks = keys_with(t, REFS)
        if ks: cls, note, keys = "COVERED", "quoted under References from Design", ks
        else: cls, note = "OUT-OF-SCOPE", "canvas framing (page names, badges, the boards' notes on what the canvas compares); each picture case names its board and badge"
    if cls is None:
        ks = keys_with(t)
        if ks: cls, note, keys = "COVERED", "used word for word in these cases' preconditions, steps or results", ks
        elif re.fullmatch(r"\(\d+\)|\$[-\d,.]+|\d[\d,]*", t): cls, note = "DATA", "a count or amount"
    if cls is None: cls = "UNCLASSIFIED"
    out.append(dict(text=t, sources=r["sources"][:6] + ([f"+{len(r['sources']) - 6} more"] if len(r["sources"]) > 6 else []), cls=cls, note=note, cases=keys))
from collections import Counter
cnt = Counter(o["cls"] for o in out)
json.dump(dict(design="https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4", made="22 Oct 2026", texts=len(out), by_class=cnt, rows=out),
          open(f"{H}/DESIGN-TEXT-INVENTORY.json", "w"), indent=1, ensure_ascii=False)
md = ["# Design text inventory — A/R and A/P Report Sorting (22 Oct 2026)", "",
      "Every on-screen text of the design canvas: the files (canvas.json, the 7 boards' titles, notes, badges, figure headings, alt texts and captions) and "
      "every word of the 43 screenshots (transcribed by viewing each picture: TRANSCRIPTS.md, screen_text.py). Each distinct text is one row, classified "
      "DATA / COVERED (case keys) / OUT-OF-SCOPE (reason) / SPEC-CONFLICT (question) / CASE-NEEDED. CASE-NEEDED rows found in this pass were written "
      "(D-50 to D-81) and are now COVERED. The design tool's own files (SKILL.md, index.html, reference/*.md, thumbnail.json) hold no ShopView screen "
      "text (DESIGN-READING-RECORD.md).", "",
      f"**Texts: {len(out)}** · " + " · ".join(f"{k}: {v}" for k, v in sorted(cnt.items())) + f" · **unclassified: {cnt.get('UNCLASSIFIED', 0)}**", "",
      "| # | Text | Where | Class | Cases / note |", "|---|---|---|---|---|"]
for i, o in enumerate(sorted(out, key=lambda o: (o["cls"] != "SPEC-CONFLICT", o["cls"], o["text"].lower())), 1):
    t = o["text"].replace("|", "\\|"); t = t if len(t) <= 160 else t[:157] + "…"
    md.append(f"| {i} | {t} | {'; '.join(o['sources'])} | {o['cls']} | {', '.join(o['cases'])}{' — ' if o['cases'] and o['note'] else ''}{o['note']} |")
open(f"{H}/DESIGN-TEXT-INVENTORY.md", "w").write("\n".join(md) + "\n")
print("texts", len(out), dict(cnt))
for o in out:
    if o["cls"] == "UNCLASSIFIED": print("UNCLASSIFIED:", repr(o["text"]), o["sources"][:3])
sys.exit(1 if cnt.get("UNCLASSIFIED") else 0)
