#!/usr/bin/env python3
"""Build the DVI V2 change notification workbook (xlsx, uploaded to Google Sheets)."""
import json, re, os
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
H = os.path.dirname(os.path.abspath(__file__)); C = os.path.dirname(H)
p = json.load(open(f"{C}/PRD-DIFF-2026-09-22-vs-2026-10-14.json")); d = json.load(open(f"{C}/impact-2026-10-14.json"))
dates = json.load(open(f"{H}/change-dates.json"))
OLD, NEW = p["old"], p["new"]
clean = lambda s: re.sub(r"\s+", " ", (s or "").replace("**", "").replace("\\", "")).strip()
PRD = "https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=768507905"
TR = lambda c: f"https://shopview.testrail.io/index.php?/cases/view/{c}"
SLACK = "https://shopview.slack.com/archives/C0C39T5MLMB/p1791807912692899"
link = lambda url, text: f'=HYPERLINK("{url}","{text}")'
F = "Arial"; HDR = PatternFill("solid", fgColor="1F3864"); thin = Side(style="thin", color="BFBFBF")
def header(ws, cols, widths):
    ws.append(cols)
    for i, w in enumerate(widths, 1):
        c = ws.cell(row=1, column=i); c.font = Font(name=F, bold=True, color="FFFFFF"); c.fill = HDR
        c.alignment = Alignment(wrap_text=True, vertical="top"); ws.column_dimensions[c.column_letter].width = w
    ws.freeze_panes = "A2"
def body(ws):
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.font = Font(name=F, color="1155CC", underline="single") if str(c.value).startswith("=HYPERLINK") else Font(name=F)
            c.alignment = Alignment(wrap_text=True, vertical="top"); c.border = Border(bottom=thin)
import datetime
def nice(t):
    def one(v):
        try: return datetime.date.fromisoformat(v).strftime("%-d %b %Y")
        except Exception: return v
    return re.sub(r"\d{4}-\d{2}-\d{2}", lambda m: one(m.group(0)), t or "")
def when(code):
    x = dates.get(code, {})
    entry = (f"{nice(x['date'])}: \"{x['entry']}\"" if x.get("entry") else "")
    also = "; ".join(f"{nice(a.get('date',''))}: \"{a.get('entry','')}\"" for a in x.get("also", []) if a.get("entry"))
    if also: entry += ("\nAlso: " if entry else "Also: ") + also
    return nice(x.get("date", "")), entry, {"named": "The change log entry names this rule", "topic": "The change log entry describes this change", "not in the change log": "Not named in the change log; changed between 29 Sep and 13 Oct"}.get(x.get("basis", ""), x.get("basis", "")), x.get("what_changed", ""), x.get("jira", "")
wb = Workbook(); rd = wb.active; rd.title = "Read me"
# ---- Cases to update
ws = wb.create_sheet("Cases to update")
header(ws, ["Case", "Case title", "Automated?", "Who this is for", "Spec rule", "What the spec said before (22 Sep 2026)", "What the spec says now (version 43, 13 Oct 2026)",
            "What changed, in plain words", "When the spec changed", "Spec change log entry", "How we know the date", "Decided in Jira", "What to do", "Where in the spec"],
       [11, 34, 12, 22, 10, 55, 55, 40, 13, 30, 26, 12, 40, 14])
old = sorted(int(c) for c, es in d["reflect"].items() if any(e[2].startswith("quotes OLD") for e in es))
part = sorted(int(c) for c, es in d["reflect"].items() if not any(e[2].startswith("quotes OLD") for e in es) and any(e[2].startswith("partial") for e in es))
for group, cases in (("old", old), ("part", part)):
    for cid in cases:
        auto = d["who"][str(cid)].startswith("Vladimir")
        for code, kind, state in d["reflect"][str(cid)]:
            if state.startswith("quotes CURRENT"): continue
            dt, entry, basis, what, jira = when(code)
            before = clean(OLD.get(code)) if kind != "added" else "(not in the spec yet)"
            now = clean(NEW.get(code)) if kind != "removed" else "(removed from the spec)"
            if group == "part": todo = "Please check: the case words this rule in its own way, so we could not tell whether it follows the old or the new text. Update it if it follows the old text."
            elif kind == "removed": todo = "The spec no longer has this rule. Remove or rewrite the steps and expected results that check it."
            else: todo = "Update the steps and expected results to match the new text."
            if auto: todo += " Vladimir: the automation for this case may check the old behaviour."
            who = "Viktoria (case text) and Vladimir (automation)" if auto else "Viktoria (case text)"
            ws.append([link(TR(cid), f"C{cid}"), d["titles"][str(cid)], "Yes" if auto else "No", who, code, before, now, what, dt, entry, basis,
                       link(f"https://shopview.atlassian.net/browse/{jira}", jira) if jira else "", todo, link(PRD, "Spec page")])
body(ws)
# ---- Later decisions
lj = wb.create_sheet("Later Jira decisions")
header(lj, ["Case", "Case title", "Automated?", "Ticket", "Who decided, and when", "The decision", "What the spec still says", "What to do"], [11, 34, 12, 12, 26, 60, 50, 40])
s521 = clean(NEW.get("S5-R21"))
rows = [(88575, "SV-10960", "Milos Vasic (product), 8 Oct 2026", "When a work order is deleted, the inspection that survives moves to the asset the work order has at that moment. Changing or merging an asset never regenerates existing reports; a manual regenerate uses the work order's current asset.", s521),
        (88561, "SV-11103", "Branko Cicovic (design), 12 Oct 2026", "Long names end with \"…\" and show the full name in a tooltip on hover.", "The spec only says long names are shortened."),
        (88579, "SV-11103", "Branko Cicovic (design), 12 Oct 2026", "Long names end with \"…\" and show the full name in a tooltip on hover.", "The spec only says long names are shortened.")]
for cid, t, who, dec, spec in rows:
    auto = d["who"][str(cid)].startswith("Vladimir")
    lj.append([link(TR(cid), f"C{cid}"), d["titles"][str(cid)], "Yes" if auto else "No", link(f"https://shopview.atlassian.net/browse/{t}", t), who, dec, spec,
               "The decision is later than the spec, so the latest decision wins. Add it to the case."])
body(lj)
# ---- No case yet
nc = wb.create_sheet("No case yet")
header(nc, ["Spec rule or ticket", "What it says", "When it was added or decided", "Source", "What to do"], [16, 70, 24, 16, 40])
covered = {x[1] for x in d["out"] if x[2]}
for code in sorted(set(p["added"]) - covered):
    dt, entry, basis, what, jira = when(code)
    nc.append([code, clean(NEW.get(code)), f"{dt} ({entry})" if entry else dt, link(PRD, "Spec page"), "New rule with no case. Add a case if it should be tested."])
nc.append([link("https://shopview.atlassian.net/browse/SV-10938", "SV-10938"), "On a phone, filling an inspection has Save & exit, like desktop. (Not in the spec yet.)", "9 Oct 2026, Milos Vasic", link("https://shopview.atlassian.net/browse/SV-10938", "Jira"), "Add a case if it should be tested."])
nc.append([link("https://shopview.atlassian.net/browse/SV-10937", "SV-10937"), "An inspection on a completed line can now be filled and submitted. This changes how V1 worked, and no product decision is recorded.", "9 Oct 2026, developer", link("https://shopview.atlassian.net/browse/SV-10937", "Jira"), "Worth confirming with Milos before adding a case."])
body(nc)
# ---- Read me
rd.column_dimensions["A"].width = 34; rd.column_dimensions["B"].width = 100
lines = [
 ("DVI V2 test cases: what changed in the spec since 22 September", ""),
 ("", ""),
 ("Hi Vladimir and Viktoria,", ""),
 ("", "We checked the Digital Inspection V2 test cases against every current source on 14 October 2026, and we would like to share what has changed, in case it helps."),
 ("", "Our cases were written against the spec as it was on 22 September. The spec has changed a number of times since, up to version 43 on 13 October. Some cases still follow the earlier wording."),
 ("Why you, Viktoria", "The DVI V2 team sync of 12 October says \"QA on the feature squad owns writing and updating test cases\", so these updates are yours to make. We have not edited any case."),
 ("Why you, Vladimir", "Some of these cases are automated. Where the behaviour changed, the automation may still check the old behaviour."),
 ("", ""),
 ("What is in each tab", ""),
 ("Cases to update", "One row per case and spec rule: what the spec said before, what it says now, when the spec changed it (from the spec's own change log), and what to do. \"Please check\" rows are cases that word the rule in their own way."),
 ("Later Jira decisions", "Decisions made in Jira after the spec text was written. The latest decision wins, so the case should follow it."),
 ("No case yet", "New rules, or later decisions, that no case covers yet."),
 ("", ""),
 ("At a glance", ""),
 ("Case rows to update (old wording)", "=COUNTIF('Cases to update'!M2:M,\"Update*\")+COUNTIF('Cases to update'!M2:M,\"The spec no longer*\")"),
 ("Case rows to check", "=COUNTIF('Cases to update'!M2:M,\"Please check*\")"),
 ("Rows on automated cases", "=COUNTIF('Cases to update'!C2:C,\"Yes\")"),
 ("Later Jira decisions", "=COUNTA('Later Jira decisions'!A2:A)"),
 ("Rules with no case yet", "=COUNTA('No case yet'!A2:A)"),
 ("", ""),
 ("Sources", ""),
 ("The spec", link(PRD, "Confluence page 768507905, Digital Inspections V2, version 43 (13 Oct 2026)")),
 ("Team sync, 12 Oct 2026", link(SLACK, "Milos Vasic in #fs-dvi-v2")),
 ("The epic", link("https://shopview.atlassian.net/browse/SV-8181", "SV-8181 and its tickets")),
 ("The test cases", link("https://shopview.testrail.io/index.php?/suites/view/1&group_id=6658", "TestRail folder: Digital Inspection V2")),
 ("How the dates were found", "From the Change Log at the end of the spec. The column \"How we know the date\" says whether the entry names the rule or describes the change."),
 ("", ""),
 ("Thank you,", "Bilal Muzamil"),
]
for a, b in lines: rd.append([a, b])
for row in rd.iter_rows():
    for c in row:
        c.alignment = Alignment(wrap_text=True, vertical="top")
        c.font = Font(name=F, color="1155CC", underline="single") if str(c.value).startswith("=HYPERLINK") else Font(name=F, bold=(c.column == 1 and bool(c.value)))
rd["A1"].font = Font(name=F, bold=True, size=14)
out = f"{H}/DVI-V2-changes-for-Vladimir-and-Viktoria.xlsx"; wb.save(out)
print("rows:", ws.max_row - 1, lj.max_row - 1, nc.max_row - 1, os.path.getsize(out))
