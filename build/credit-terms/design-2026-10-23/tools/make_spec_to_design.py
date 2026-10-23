#!/usr/bin/env python3
"""SPEC-TO-DESIGN-2026-10-23.json (Rule 130, skill 21 §6c): every PRD v3 requirement (211 codes) and every §8 row checked against the
boards by hand: SHOWN (where) · DIFFERENT (register id) · NOT SHOWN (no board draws it; PRD §2 Design coverage or design-silent) ·
NO SCREEN (behaviour with nothing to draw: server, sync, imports, API, counting, dates on stored records). Plus the tool run."""
import json, os, re
H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRD = os.path.join(os.path.dirname(H), "sources", "CONFLUENCE-963346440-v3-2026-10-23.md")
lines = open(PRD, encoding="utf-8").read().replace("\\$", "$").splitlines()
codes = []
for l in lines:
    m = re.search(r"\*\*(S\d+-[RNE]\d+[a-z]?):\*\*\s*(.*)", l)
    if m: codes.append((m.group(1), m.group(2)[:160]))
S, D, N, X = "SHOWN", "DIFFERENT", "NOT SHOWN", "NO SCREEN"
V = {
 "S1-R1": (S, "p1 all figs: Finance > Payment Methods > Credit Terms", "DL-01"), "S1-R2": (S, "p1 fig 1: title, New Credit Term, ⋯", "DL-01"),
 "S1-R3": (S, "p1 fig 1 (Active 13 / Inactive 2), p4", "DL-04"), "S1-R4": (S, "p1 fig 1; widths equal on p4 (measured 347/417/139/139/116)", "DL-01, DL-09"),
 "S1-R5": (S, "p1 fig 1 order; build captures (Net 2 / Net 5 tie A to Z)", "DL-01"), "S1-R6": (N, "no sorted state drawn (CT-N05): app-wide sorting rule", "behaviour cases"),
 "S1-R7": (S, "p1 fig 1 Due column; build captures (25th of the following month)", "DL-01"), "S1-R8": (D, "COD and Credit Hold words match; Due on Receipt differs (CT-D01)", "DL-02, DV-01"),
 "S1-R9": (S, "p1 fig 1 lock tooltip", "DL-02"), "S1-R10": (S, "p1 fig 1", "DL-01"), "S1-R11": (S, "p1 figs 1, 10; p4 fig 1", "DL-06"),
 "S1-R12": (S, "right aligned, 0 shown; Counter Sale not counted (caption)", "DL-01"), "S1-R13": (S, "as S1-R12", "DL-01"),
 "S1-R14": (S, "p4 figs 1-2", "DL-09"), "S1-R15": (S, "r15-long-name.png at 1440 (one line); wrapping not drawn (CT-N09)", "DL-05"),
 "S1-R16": (X, "location switch: behaviour", ""), "S1-N1": (N, "no board for a user without Settings → Finance", ""),
 "S1-N2": (D, "line drawn inside the table under the headings (CT-D02)", "DL-10, DV-02"), "S1-N3": (S, "every row has ⋯; COD/Credit Hold menus (r16-m-cod, p2 fig 9)", "DL-45"),
 "S1-E1": (S, "p4 fig 1", "DL-09"), "S1-E2": (N, "no invoice-only term drawn", ""), "S1-E3": (N, "loading not drawn (CT-N06)", ""),
 "S2-R1": (S, "menus p1 figs 4-8, p2 figs 1/9, p3 fig 5: items, order, icons, greyed, red, divider; own inactive term's menu not drawn (CT-N12)", "DL-07, DL-35, DL-45 … DL-49"),
 "S2-R2": (S, "\"Used by 1 customer and 2 vendors\" (r16-m-inuse); invoice holders not drawn", "DL-46"), "S2-R3": (S, "r16-m-standard, r16-m-inactive", "DL-35, DL-49"),
 "S2-R4": (S, "r15-edit.png", "DL-16"), "S2-R5": (S, "p1 fig 9 (title, message, Cancel, Make Default)", "DL-11"), "S2-R6": (S, "p1 fig 10", "DL-03, DL-06"),
 "S2-R7": (N, "deactivated toast not drawn (CT-N02, PRD §2 toasts)", ""), "S2-R8": (N, "reactivated toast not drawn (CT-N02)", ""),
 "S2-R9": (S, "r15-delete.png; deleted toast not drawn", "DL-12"), "S2-R10": (S, "r16-m-inactive: no Make Default", "DL-49"),
 "S2-R11": (N, "saving state not drawn (CT-N08)", ""), "S2-R12": (S, "r15-long-name toast wraps", "DL-05"),
 "S2-N1": (S, "r16-m-standard", "DL-35"), "S2-N2": (S, "r16-m-cod; p2 fig 9", "DL-45"), "S2-N3": (N, "Credit Hold menu not drawn", ""),
 "S2-N4": (S, "p1 fig 8", "DL-47"), "S2-N5": (S, "r16-m-inuse", "DL-46"), "S2-N6": (X, "click on a greyed item: behaviour", ""),
 "S2-E1": (X, "behaviour", ""), "S2-E2": (N, "error alert not drawn (CT-N03)", ""), "S2-E3": (S, "pattern \"Net 10 (Inactive)\" on cards (p6, p7)", "DL-26"),
 "S3-R1": (S, "p3 figs 1-3, r15-edit", "DL-13, DL-16"), "S3-R2": (S, "p3 figs 1-2 (Name, hint, two options, boxes, trailing words)", "DL-13, DL-14"),
 "S3-R3": (S, "p3 fig 1 (Day disabled, empty)", "DL-13"), "S3-R4": (S, "p3 fig 2 (Days cleared and disabled)", "DL-14"),
 "S3-R5": (D, "words match exactly (Net 14 Days / 10th of next month examples); caption \"No sentence shows while a field is invalid\" differs (CT-D03)", "DL-13, DL-14, DV-03"),
 "S3-R6": (S, "p3 fig 3 Create disabled", "DL-15"), "S3-R7": (S, "r15-long-name toast \"… created\"", "DL-05"), "S3-R8": (N, "saved toast not drawn (CT-N02)", ""),
 "S3-R9": (S, "p3 fig 3 (standard-term and Days messages drawn; others in caption)", "DL-15"),
 "S3-R10": (D, "caption \"Errors show only after a field is touched\" (CT-D04)", "DV-04"), "S3-R11": (X, "behaviour", ""), "S3-R12": (X, "behaviour", ""),
 "S3-R13": (X, "behaviour", ""), "S3-R14": (N, "saving state not drawn (CT-N08)", ""), "S3-R15": (X, "Escape / click outside: behaviour", ""),
 "S3-R16": (X, "today's date by location: behaviour", ""), "S3-N1": (N, "no board for a user without Settings → Finance", ""),
 "S3-N2": (S, "greyed Edit (r16-m-inuse); none on standard (r16-m-standard)", "DL-46, DL-35"), "S3-N3": (S, "Cancel and × drawn", "DL-13"),
 "S3-E1": (S, "build captures: Net 2 = 5 days, Net 6 = 25th of the following month", "DL-01"), "S3-E2": (N, "error alert not drawn (CT-N03)", ""),
 "S4-R1": (S, "p2 figs 2-4, r15-move-cod", "DL-17"), "S4-R2": (S, "p2 figs 2-4 (order of the parts; plural button)", "DL-17"),
 "S4-R3": (S, "caption p2 fig 2", "DL-17"), "S4-R4": (S, "p2 fig 2 all ticked", "DL-17"), "S4-R5": (N, "search typed / no match not drawn (CT-N04)", ""),
 "S4-R6": (X, "behaviour", ""), "S4-R7": (S, "p2 fig 2 hint; fig 4 list; empty Move To not drawn (CT-N07)", "DL-17, DL-37"), "S4-R8": (N, "disabled button not drawn (CT-N08)", ""),
 "S4-R9": (S, "p2 fig 5 toast", "DL-03"), "S4-R10": (S, "r15-move-cod", "DL-18"), "S4-R11": (N, "customer note not drawn", ""), "S4-R12": (X, "back end", ""),
 "S4-R13": (X, "performance", ""), "S4-R14": (S, "r15-limit-confirm (title, message, Cancel, red button in its displayed form)", "DL-19"),
 "S4-R15": (S, "r15-limit-cancel", "DL-19"), "S4-R16": (X, "data change", ""), "S4-R17": (X, "behaviour", ""), "S4-R18": (X, "data", ""), "S4-R19": (X, "data", ""),
 "S4-R20": (N, "note not drawn", ""), "S4-R21": (N, "saving state: the Move button behind the confirmation shows a spinner in r15-limit-confirm (NOTES.md)", ""),
 "S4-R22": (X, "Escape / click outside: behaviour; × and Cancel drawn", "DL-17"), "S4-R23": (N, "long names in the window not drawn (CT-N09)", ""), "S4-R24": (X, "volume", ""),
 "S4-N1": (S, "p2 fig 9", "DL-48"), "S4-N2": (S, "r16-m-cod, r16-m-unused", "DL-45, DL-07"), "S4-N3": (S, "r16-m-inactive (Move Customers on an inactive term); p2 fig 4 list without inactive terms", "DL-49, DL-37"),
 "S4-E1": (X, "concurrency", ""), "S4-E2": (X, "behaviour", ""), "S4-E3": (X, "data", ""), "S4-E4": (X, "behaviour", ""),
 "S5-R1": (S, "p5 fig 2; p6 fig 4", "DL-22, DL-27"), "S5-R2": (S, "p5 fig 2", "DL-22"), "S5-R3": (S, "p5 fig 3 (Default pill)", "DL-23"),
 "S5-R4": (S, "p5 fig 4; p6 fig 6 (disabled $ 0.00 + hover text)", "DL-24, DL-40"), "S5-R5": (S, "p6 fig 4 editable limit", "DL-27"), "S5-R6": (X, "save", ""),
 "S5-R7": (S, "p6 figs 4-5 (selected; the last row not visible in the drawing, CT-D10)", "DL-27, DL-28"), "S5-R8": (S, "p6 fig 2 card; p9 Terms chip prints the plain name", "DL-26, DL-33"),
 "S5-R9": (S, "p6 fig 6", "DL-40"), "S5-R10": (N, "Name validation on customer windows not drawn", ""), "S5-R11": (N, "printed long names (PRD §2, CT-N13)", ""),
 "S5-R12": (S, "p6 fig 4", "DL-27"), "S5-R13": (X, "behaviour", ""), "S5-R14": (N, "long names in dropdown/card not drawn (CT-N09)", ""), "S5-R15": (X, "scope statement", ""),
 "S5-N1": (S, "p5 fig 5", "DL-39"), "S5-N2": (S, "p6 fig 7", "DL-41"), "S5-N3": (N, "Credit Hold not reached in the drawn customer lists (CT-N11)", ""),
 "S5-N4": (X, "server", ""), "S5-E1": (X, "behaviour", ""), "S5-E2": (N, "unknown-text term (PRD §2, CT-N14)", ""), "S5-E3": (X, "loading behaviour", ""),
 "S6-R1": (S, "p7 figs 2, 4, 7, 8", "DL-29, DL-30"), "S6-R2": (S, "p7 fig 2 (COD, no tag)", "DL-29"), "S6-R3": (S, "p7 figs 6, 7", "DL-31, DL-42"),
 "S6-R4": (S, "p7 figs 2, 4 editable $ 0.00", "DL-29"), "S6-R5": (N, "vendor Name validation not drawn", ""), "S6-R6": (N, "long names not drawn (CT-N09)", ""),
 "S6-N1": (N, "no board without AP/AR for vendors", ""), "S6-N2": (S, "p7 fig 8", "DL-30"), "S6-E1": (X, "import", ""), "S6-E2": (X, "counting", ""),
 "S7-R1": (S, "p7 fig 11 (Net 10: Oct 5 → Oct 15)", "DL-43"), "S7-R2": (S, "p9 figs 2-3 (Oct 5 / Oct 28 → Nov 10); p7 fig 10", "DL-33, DL-44, DL-32"),
 "S7-R3": (N, "short months only in captions", ""), "S7-R4": (N, "December not drawn", ""), "S7-R5": (X, "dates", ""), "S7-R6": (X, "time zones", ""),
 "S7-R6a": (X, "behaviour", ""), "S7-R6b": (X, "behaviour", ""), "S7-R7": (X, "behaviour (caption p2 fig 5)", ""), "S7-R8": (X, "behaviour", ""),
 "S7-R9": (S, "p7 figs 9-11 vendor invoice due dates", "DL-32, DL-43"), "S7-R10": (X, "dates", ""), "S7-R11": (X, "export", ""), "S7-N1": (N, "unknown-text term (CT-N14)", ""),
 "S7-E1": (X, "behaviour (captions p6 fig 2, p7 fig 6)", ""), "S7-E2": (X, "stored data", ""), "S7-E3": (X, "behaviour", ""), "S7-E4": (X, "behaviour", ""),
 "S9-R1": (D, "words and buttons match; the board redraw's Cancel is white, today's is blue (CT-D06, settled)", "DL-25, DL-34"),
 "S9-R2": (N, "badge under the new rule not drawn; today's \"Over Limit\" (capital L) on before-invoice.png (CT-D07, CT-N10)", "DL-36"),
 "S9-R3": (S, "p8 fig 3 wording", "DL-25"), "S9-R4": (X, "part sales: no confirmation (caption)", ""), "S9-N1": (S, "p8 fig 2 (COD $0 limit: no warning); card value mismatch on fig 3 (CT-D09)", "DL-34"),
 "S9-N2": (S, "p8 fig 2", "DL-34"), "S9-E1": (X, "behaviour", ""), "S9-E2": (X, "Credit Hold warning unchanged (caption)", ""),
 "S11-R1": (X, "release", ""), "S11-R2": (X, "release", ""), "S11-R3": (X, "release (p4 fig 3 new shop: Active 12)", ""), "S11-R4": (S, "p1 side menu", "DL-01"),
 "S11-R5": (S, "p5 figs 2, 5", "DL-22, DL-39"), "S11-R6": (N, "old error not drawn (correct)", ""), "S11-R7": (N, "old error not drawn (correct)", ""),
 "S11-R8": (S, "p8 figs 2-3", "DL-34, DL-25"), "S11-R9": (X, "counting", ""), "S11-R10": (N, "payment window not drawn", ""), "S11-R11": (X, "data", ""),
 "S11-R12": (S, "p1 fig 1 Due on Receipt default (new-shop default); p4 fig 3", "DL-06"), "S11-R13": (X, "dates", ""), "S11-R14": (X, "dates", ""),
 "S11-R16": (S, "p6 fig 6", "DL-40"), "S11-R17": (X, "behaviour", ""), "S11-N1": (X, "release", ""), "S11-N2": (N, "no board for users without the permissions except p5 fig 5", "DL-39"),
 "S11-E1": (X, "release", ""), "S11-E2": (N, "odd spelling not drawn (CT-N14)", ""),
 "S12-R1": (S, "r16-m-page", "DL-08"), "S12-R2": (S, "r16-log", "DL-20"), "S12-R3": (S, "r16-log: created, edited (two lines), deactivated, reactivated, deleted; Default changed and Customers moved rows not drawn", "DL-20"),
 "S12-R4": (S, "r16-log (Admin ShopView, Oct 22, 2026, 09:35 AM)", "DL-20"), "S12-R5": (N, "typed search not drawn (CT-N15)", ""), "S12-R6": (X, "data", ""),
 "S12-R7": (X, "behaviour (caption p2 fig 8: nothing logged)", ""), "S12-R8": (S, "r16-log two-line details", "DL-20"), "S12-N1": (N, "no board", ""),
 "S12-N2": (X, "release", ""), "S12-N3": (X, "scope", ""), "S12-E1": (S, "r15-log-empty", "DL-21"), "S12-E2": (X, "data", ""), "S12-E3": (X, "data", ""),
}
for c, _ in codes:
    if c.startswith(("S8-", "S10-")): V.setdefault(c, (X, "Story " + c.split("-")[0][1:] + " has no canvas page (\"this story has no new screens\")", ""))
rows = []
for c, t in codes:
    v = V.get(c)
    rows.append(dict(code=c, prd=t, verdict=v[0] if v else "UNCHECKED", where=v[1] if v else "", design_case=v[2] if v else ""))
# §8 rows
sec8 = []
in8 = False
for l in lines:
    if l.startswith("## 8."): in8 = True; continue
    if l.startswith("## 9."): break
    if in8 and l.startswith("| ") and not l.startswith("| Trigger") and not l.startswith("|--"):
        cells = [x.strip() for x in l.strip().strip("|").split("|")]
        sec8.append(cells)
T8 = {"Credit Terms list fails to load": N, "Inactive tab is empty": D, "Hover the info icon on Due on Receipt": D, "Term deactivated": N,
      "Term reactivated": N, "Term deleted": N, "Credit term edited and saved": N, "Name too long": N, "Name matches one of the shop's terms": N,
      "Name empty": N, "Day out of range": N, "No option sent on create (server)": N, "Edit or delete of a term in use refused (server)": N,
      "Deactivate or delete of the default refused (server)": N, "Deactivate of COD, Due on Receipt or Credit Hold refused (server)": N,
      "Make Default of an inactive term or Credit Hold refused (server)": N, "Term no longer exists (server)": N, "Move fails partway": N,
      "Move Customers search has no match": N, "Note on each moved customer": N, "Move with no ticked customer still on the term (server)": N,
      "Move To term no longer active (server)": N, "Limit above $0 sent for COD or Credit Hold (server)": N, "New Customer term no longer active (server)": N,
      "Over credit limit on New Work Order (unchanged wording)": S}
r8 = []
for c in sec8:
    trig = c[0]
    verdict = T8.get(trig, S)
    note = {"Inactive tab is empty": "CT-D02", "Hover the info icon on Due on Receipt": "CT-D01", "Over credit limit on New Work Order (unchanged wording)": "words shown; Cancel style CT-D06 settled", "Hover the info icon on Credit Hold": "the words are the icon's hover text on every board and in the p1 fig 2 caption; the tooltip is not drawn open", "Credit Terms Log events": "5 of the 7 events drawn (r16-log); \"Default changed\" and \"Customers moved\" not drawn", "Credit Terms Log details": "created / edited / deactivated / reactivated / deleted details drawn; default-change and move details not drawn"}.get(trig, "")
    if verdict == N and not note:
        note = "not drawn; the PRD text stands (messages written only in captions: \"Enter a name.\", \"Use 31 characters or fewer.\", \"Enter a day from 1 to 31.\", \"A term called {name} already exists.\" appear in the p3 fig 3 caption)" if trig in ("Name empty", "Name too long", "Day out of range", "Name matches one of the shop's terms") else "not drawn (PRD §2: toasts, error alerts and the no-match line follow the PRD text)"
    r8.append(dict(trigger=trig, message=c[1][:200], behavior=c[2] if len(c) > 2 else "", verdict=verdict, note=note))
by = {}
for r in rows: by[r["verdict"]] = by.get(r["verdict"], 0) + 1
by8 = {}
for r in r8: by8[r["verdict"]] = by8.get(r["verdict"], 0) + 1
tool = json.load(open(os.path.join(H, "render", "spec-check-raw.json")))
reg = json.load(open(os.path.join(os.path.dirname(H), "DESIGN-DIVERGENCE-REGISTER.json")))
json.dump(dict(made="2026-10-23", prd="PRD v3 (Confluence 963346440)", design="https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf (1792722751-b285)",
               summary=dict(requirements=len(rows), by_verdict=by, section8_rows=len(r8), section8_by_verdict=by8,
                            tool_rows=len(tool), tool_open_after_register=sum(1 for t in tool if reg.get(t["key"], {}).get("outcome") not in
                                ("QUESTION-SENT", "PO-RULED", "QA-LEAD-RULED", "DESIGN-SILENT", "SHOWN-WHEN-DRIVEN")),
                            differences=[d["id"] for d in reg["differences"]], unsent_questions=reg["unsent_questions"]),
               by_hand=rows, section8=r8,
               tool=dict(command="python3 build/testing-tools/spec_to_design_check.py --prd render/prd-v3-unescaped.md --design 'files/project/*.dc.html' render/shots-text.txt --register build/credit-terms/DESIGN-DIVERGENCE-REGISTER.json",
                         note="render/prd-v3-unescaped.md is the saved PRD with pandoc's \\$ escapes removed (otherwise every \"$0\" phrase reads as not shown); render/shots-text.txt holds the 25 screenshots' transcribed words (tools/screen_text.py), because screenshot words are not in the HTML",
                         rows=tool)),
          open(os.path.join(H, "SPEC-TO-DESIGN-2026-10-23.json"), "w"), indent=1, ensure_ascii=False)
print(by, by8, "unchecked:", [r["code"] for r in rows if r["verdict"] == "UNCHECKED"])
