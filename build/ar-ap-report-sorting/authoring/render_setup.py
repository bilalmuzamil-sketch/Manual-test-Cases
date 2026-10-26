#!/usr/bin/env python3
"""Render the A/R and A/P Report Sorting setup file for Claude sessions (Rule 117 ninth amendment): header and sources, account slots,
flags and settings, shared procedures, one recipe per case with every placeholder's example value, the mapping table, dependencies,
reset and cleanup, traceability (each case's verbatim source sentences), VIU status and open questions.
Holds no environment address, credentials, cookies or session data. python3 render_setup.py"""
import os, sys, re, json, importlib
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import ar_lib as L
import design_data as DD
import pattern as PT
for m in ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_s5", "cases_s6_s9", "cases_data", "cases_rel", "cases_design"]: importlib.import_module(m)
from po_questions import QUESTIONS, QN
SEC = json.load(open(f"{L.P}/sections.json"))
NAMES = {"S1": "Story 1 — Reports open in QuickBooks name order", "S2": "Story 2 — Sort by clicking any column header",
         "S3": "Story 3 — Export to PDF and CSV", "S4": "Story 4 — Collapse all, Expand all and pinned group rows",
         "S5": "Story 5 — Filters: customer or vendor, past due and location", "S6": "Story 6 — Location column",
         "S7": "Story 7 — Document links open where they can", "S8": "Story 8 — Report descriptions and layout",
         "S9": "Story 9 — A/R Collection call list", "DATA": "Totals and counts — exact amounts",
         "REL": "Release day and what must not change", "DESIGN": "Design — how it looks"}
PROC = [
 ("P-LOC", "Locations", "Two staging locations the Admin is enrolled at ({Location-A}, {Location-B}); a third ({Location-C}) and nine in all only where a case asks. Settings > Locations (UNVERIFIED path). A long-named location for the chip case.", "The top-right location switcher lists them."),
 ("P-CUST", "Customer", "Customers > New Customer: the example name, a phone number and a credit term where the case names them (none where it says none). Every name carries ZZAUTOTEST and the case key.", "The customer card shows the name, phone and credit term."),
 ("P-VENDOR", "Vendor", "Vendors > New Vendor with the example name. A vendor has no single location of its own: each bill or credit belongs to the location it is received or entered at (tech plan, 21 Oct 2026, Q2 and D13).", "The vendor page shows it."),
 ("P-INV-WO", "Work order invoice", "Work Orders > Create Work Order for the customer at the named location; add a labor line or part to reach the amount; Finance tab > Create Invoice (close the payment dialog unpaid).", "The invoice shows on A/R Detail with the amount."),
 ("P-INV-PS", "Part sale invoice", "Part Sales > New Part Sale for the customer at the named location; add a part to reach the amount; invoice it unpaid.", "The invoice shows on A/R Detail."),
 ("P-PAY", "Partial payment", "On the invoice record the payment amount the case names; for a payment taken elsewhere, switch the active location first.", "The open balance equals amount minus payment."),
 ("P-CM", "Credit memo / deposit", "Create an unused credit memo or a deposit for the customer at the named location, for the amount named.", "It shows on A/R Detail as its own row."),
 ("P-BILL", "Bill", "Vendor Order Management: create a vendor order, receive it on a delivery at the named location and enter the bill with the amount; leave it unpaid.", "The bill shows on A/P Detail."),
 ("P-VC", "Vendor credit", "From a vendor return made at the named location (vendor credit from a return), or a vendor credit entered without a return while signed in at the named location, for the amount named.", "It shows on A/P Detail and A/P Unpaid Invoices, at that location."),
 ("P-AGE", "Dates and due dates", "UNVERIFIED: the aging cases need documents whose date and due date sit a set number of days before the as-of date (5, 10, 15, 20, 30, 31, 35, 40, 45, 60, 61, 90, 91, 100 days). If the build cannot back-date, use payment terms (Net 30 etc.) and existing records of the right age, or move the as-of date forward and adjust the expected days; record which in the run notes. Same-day cases (S1-10, S1-11): the document with the higher number must be invoiced (or, for a bill, entered) earlier in the day than the one with the lower number: create both work orders first (the numbers are given then), invoice the second one in the morning and the first one in the afternoon, both with the same invoice date.", "The Past due column shows the expected days; for same-day cases, the invoice times are noted."),
 ("P-ROLE", "Custom role and user", "Settings > Roles: copy a role and set only the permissions the case names (Reports → Page Access always on unless the case says off); Settings > Staff: a user with that role, enrolled at the locations the case names.", "Signing in as the user shows only what the case expects."),
 ("P-PRE-RELEASE", "Before-the-release capture", "For REL cases marked PRE_REL: before the release is installed, create the records, take the screenshots or exports named and keep them with their dates.", "Files saved and dated."),
 ("P-OFFLINE", "Lost connection", "Switch the computer's Wi-Fi off (or unplug the network cable) after the report has loaded; switch it back on at the end.", "The browser shows it is offline."),
 ("P-VOLUME", "Large data", "Paging and limit cases need many rows: use the QA organization (13,540 open A/P lines; 46 A/R Summary customers) or create ZZAUTOTEST customers or bills in bulk. Exact 2,000 / 2,001 PDF boundary (A/P Detail): on the day of the test, export the A/P Detail CSV with every vendor, count open lines per vendor by script, pick a set of vendors ({Vendors-A}) whose lines add up to exactly 2,000 (prefer few, large vendors; if no exact set exists, top up with ZZAUTOTEST bills for one vendor in the set), and create one ZZAUTOTEST vendor with exactly one open bill ({Vendor-B}); write both into the case's values. The 2,000-customer Summary boundary and the 50,000 / 50,001 CSV boundary cannot be reached on any test site and are checked by the developers (SV-11595, SV-11598). The Vendor menu without a search box (S5-39) needs a test organization with 8 vendors or fewer: UNVERIFIED whether one exists; ask the user, and if none can be made, mark the case Blocked \"setup not done\".", "The counts in the case hold."),
]
def procs_for(c):
    t = " ".join(a + " " + (b or "") for a, b in c["pre"]) + " " + " ".join(c["steps"])
    out = ["P-LOC"]
    if "Customer" in t: out.append("P-CUST")
    if "Vendor" in t: out.append("P-VENDOR")
    if re.search(r"invoice", t, re.I): out.append("P-INV-WO")
    if "part sale" in t: out.append("P-INV-PS")
    if re.search(r"paid|payment", t): out.append("P-PAY")
    if re.search(r"credit memo|deposit", t, re.I): out.append("P-CM")
    if re.search(r"\bbill", t, re.I): out.append("P-BILL")
    if "vendor credit" in t: out.append("P-VC")
    if re.search(r"days (ago|past due)|dated|due \d", t): out.append("P-AGE")
    if "custom role" in t or "{User-" in t: out.append("P-ROLE")
    if c["marker"].startswith("AUTOMATION: HOLD - needs records and screenshots"): out.append("P-PRE-RELEASE")
    if "network" in t: out.append("P-OFFLINE")
    if re.search(r"More than 30|more than 100|more than 150|2,000|50,000|13,540|More than 50|more than 50 customers|more than 8 vendors|between 101|Between 31", t): out.append("P-VOLUME")
    return out

link = lambda k: f"{k}"
Lines = []
A = Lines.append
A("# A/R and A/P Report Sorting, Export and Location Filter: setup file for Claude sessions")
A("")
A("This file is for a Claude session. A manual tester never needs it: each test case is complete on its own. It holds no environment "
  "address, credentials, cookies or session data. Generated by `authoring/render_setup.py` from the case sources; regenerate it whenever a case changes.")
A("")
A("## 1. Header and sources")
A(f"- Feature: A/R and A/P Report Sorting, Export and Location Filter (epic SV-11315; stories SV-11531 to SV-11539). TestRail group 90418, sections in `sections.json`. {len(L.CASES)} cases: created 22 Oct 2026; the full pass against PRD version 9 and Chris Ward's answers (26 Oct 2026, `v9-pass-2026-10-26/`) is drafted here and not yet written to TestRail.")
A(f"- PRD: {L.PRD_NAME}; saved `sources/CONFLUENCE-947650561-v9-2026-10-26.md` (pandoc from the page's HTML, `sources/CONFLUENCE-947650561-v9-2026-10-26.html`), read in full 26 Oct 2026. Version 5 (`sources/CONFLUENCE-947650561-v5-2026-10-22.md`) is kept for the record; `sources/PRD-DIFF-v5-to-v9.json` lists the requirement lines that changed.")
A(f"- PO answers: {L.ANS_NAME}; saved `questions-2026-10-22/chris-answers-2026-10-26.json`. PRD version 9 carries them; a case quotes an answer only where PRD version 9 is silent.")
A("- Jira: every ticket under the epic read 22 Oct 2026, `sources/JIRA-READING-2026-10-22.md` (differences from the PRD listed there).")
A(f"- Design: {L.DESIGN_URL} — read in full 22 Oct 2026, saved in `design-2026-10-22/` (7 boards, 45 figures; the 43 screenshots in `design-2026-10-22/images/`, every word transcribed in `TRANSCRIPTS.md`). Each recipe below names the pictures its case compares with. Design-vs-PRD differences: `DESIGN-DIVERGENCE-REGISTER.json`.")
A("- Tech plan: \"A/R and A/P Report Sorting, Export and Location Filter — Technical Implementation Plan\" (2026-10-21, written against PRD v4), uploaded by the QA lead 22 Oct 2026, saved `sources/Tech-Plan-AR-AP-2026-10-22-upload.md`; read in full and every case checked against it (`tech-plan-pass-2026-10-22/`). Its quotes sit under their own \"From:\" line in the cases that use them.")
A("- No build yet. Every recipe below is UNVERIFIED until the build verification session runs it.")
A("- At session start, ask the user for the site to use and how to sign in as each slot below. Never write a secret into this file.")
A("")
A("## 2. Accounts and roles (slots)")
A("| Slot | Role as shown in the UI | Used for | Cases |")
A("|---|---|---|---|")
slots = {}
for c in L.CASES:
    first = c["pre"][0][0]
    if first.startswith('You are an Admin user (the "Admin" role)'): s = "ACCOUNT-A (Admin, enrolled at every location used)"
    elif "enrolled only at" in first: s = "ACCOUNT-B (Admin, enrolled only at {Location-A})"
    elif "custom role" in first or "Two users exist" in first: s = "ROLE-" + c["key"] + " (custom role, see the case's first precondition)"
    else: s = "ACCOUNT-A (Admin)"
    slots.setdefault(s, []).append(c["key"])
for s, ks in slots.items():
    if s.startswith("ROLE-"):
        c = next(x for x in L.CASES if x["key"] == ks[0])
        A(f"| {s.split(' ')[0]} | custom role | {c['pre'][0][0]} | {', '.join(ks)} |")
    else:
        who = "every case not listed in another slot" if s.startswith("ACCOUNT-A") else "a user enrolled at one location only (the Location list and links)"
        A(f"| {s.split(' (')[0]} | {s.split('(')[1].rstrip(')')} | {who} | " + (f"{len(ks)} cases" if s.startswith("ACCOUNT-A") else ", ".join(ks)) + " |")
A("")
A("## 3. Flags and settings")
A("- No feature setting: the PRD says nobody gains or loses access and no setup is needed.")
A("- Browser: desktop, window 1440 px wide at 100% zoom unless the case names 1536, 1280, 1200 or 900 px; light theme unless the case says dark.")
A("- Every report is opened from the Reports menu so nothing is remembered from an earlier visit. On screen (design pictures): Reports in the top menu; the left menu lists \"A/R Aging Summary\", \"A/R Aging Detail\", \"A/R Aging Collection\" under ACCOUNTS RECEIVABLE and \"A/P Aging Summary\", \"A/P Aging Detail\", \"A/P Unpaid Invoices\" under ACCOUNTS PAYABLE (page title \"A/P Unpaid Invoices Report\"); Sales By Customer and Work In Progress under PERFORMANCE, Inventory Value under PARTS.")
A("- Design picture cases (D-50 to D-75 and D-81; D-76 to D-80 were deleted on 26 Oct 2026): open the named picture from `design-2026-10-22/images/` (in TestRail, attached to the case) at 100% zoom beside the browser.")
A("- Comparison tabs: design cases open Sales By Customer, Inventory Value or Work In Progress in a second tab, as the case says.")
A("- Test-site facts from the tech plan (21 Oct 2026): (1) on staging and QA the reports read the main database (\"Staging/QA reader = writer\"), so a change shows on reload at once; production reads a copy about a second behind. (2) The PDF generator is \"not configured on every environment\": if every PDF fails with \"We couldn't export this report. Please try again.\" while CSVs work, the site lacks it; record Blocked, not Failed. (3) A 2,000-row PDF takes about 30 seconds. (4) Enrolling the shared Admin at another location changes the Location chip of every other report; prefer a separate user for multi-location setups. (5) The Customer menu lists at most 50 customers until you search, from all the organization's customers; the Vendor menu lists all the organization's vendors and shows its search box only above 8 (PRD v9 S5-R13 says so too). (6) Every default role with report access also has the \"View and Manage AP/AR Data\" switch, and the default Technician role has no report access: a permission split needs a custom role. (7) The page address keeps the filters as asOfDate, customerIds / vendorIds, pastDue (1-30, 31-60, 61-90, 91-plus) and locationIds, each id a long code written as its own entry; a comma list is also read.")
A("")
A("## 4. Shared procedures (UNVERIFIED click paths; no build yet)")
A("| Procedure | What | How | Check |")
A("|---|---|---|---|")
for p, w, h, ch in PROC: A(f"| {p} | {w} | {h} | {ch} |")
A("")
A("## 5. One recipe per case: the placeholder values (the examples in the case are the values)")
for c in L.CASES:
    A(f"### SETUP-{c['key']} — {c['title']}")
    A(f"Section: {NAMES[c['sec']]} (TestRail section {SEC[c['sec']]}). Reports: {', '.join(L.REPORTS[r] for r in L.reports_of(c)) or 'none'}. Marker: `{c['marker']}`.")
    A("Preconditions as the TestRail case states them (the QA lead's pattern, 26 Oct 2026):")
    for x in PT.pattern(c)["pre"]: A(f"- {x}")
    A("The same preconditions with their placeholders and example values (for a Claude session):")
    for a, b in c["pre"]: A(f"- {a}" + (f" {b}" if b else ""))
    phs = sorted(set(re.findall(r"\{([A-Z][^{}]*)\}", " ".join(a for a, _ in c["pre"]))))
    A("Placeholders and their plain names in the case (a record the steps and results never name is unnamed there: \"a customer\" / \"that customer\", \"your current location\", \"your other location\"): " + (", ".join("{" + p + "} = \"" + PT.plain("{" + p + "}") + "\"" for p in phs) or "none")
      + ". Values: the \"For example\" lines above; write the real document numbers here after setup.")
    A("Procedures: " + ", ".join(procs_for(c)) + ".")
    tpl = [x[0] for x in c["q"] if isinstance(x, tuple) and x[0].startswith("Tech plan")]
    A("Sources (verbatim text in section 9): " + ", ".join(sorted(L.codes_of(c))) + (("; " + "; ".join(tpl)) if tpl else "") + ".")
    h = L.render(c)["custom_expected"].split("References from Design")[-1]
    pics = [f"`design-2026-10-22/{DD.pic(f)}` ({f['iid']}, \"{f['heading']}\")" for f in DD.FIGS if DD.pic(f) in h]
    A("Design pictures: " + (", ".join(dict.fromkeys(pics)) if pics else "none (the design does not draw this; the case follows the PRD)") + ".")
    A("")
A("## 6. Mapping table")
A("| Section | Cases |"); A("|---|---|")
for s, n in NAMES.items(): A(f"| {n} | " + ", ".join(c["key"] for c in L.CASES if c["sec"] == s) + " |")
A("")
A("## 7. Dependencies and shared fixtures")
A("- Every case owns its records: the example names carry ZZAUTOTEST and the case key. Paging, volume and limit cases share the QA organization's existing data (read only).")
A("- The TestRail cases (Rule 117 fourteenth amendment, 26 Oct 2026) name records plainly (\"customer A\", \"vendor B\", \"location A\", \"date A\") and hold no example values; each recipe above maps every placeholder to that plain name. Where a case fixes a name or an amount the result depends on (S1-01 to S1-04 and S1-07 names, S2-23 due days, S5-38 and DATA-16 / DATA-17 amounts), create the record with ZZAUTOTEST and the case key in front of that name, which keeps the order the case expects.")
A("- Release-day cases (PRE_REL marker) need their records and captures made before the release is installed on the test site.")
A("")
A("## 8. Reset and cleanup")
A("- Leave ZZAUTOTEST records in place. Switch the network back on after offline cases. Return the active location to {Location-A} after a switch-location case. Set the theme back to light.")
A("")
A("## 9. Traceability — every source sentence the cases quote (PRD version 9 unless marked otherwise)")
used = sorted({x for c in L.CASES for x in L.codes_of(c)}, key=lambda s: (s[0] != "S", s))
for k in used:
    if k in L.CODE: A(f"- **{k}**: \"{L.CODE[k]}\"")
    elif k in L.NAMED: A(f"- **{k}** ({L.NAMED[k][0]}): \"{L.NAMED[k][1]}\"")
for k, (l, t) in L.SUB.items(): A(f"- **{k}** ({l}): \"{t}\"")
jira = {t for c in L.CASES for x in c["q"] if isinstance(x, tuple) and x[0].startswith("Jira") for t in [x[1]]}
for t in sorted(jira): A(f"- **Jira SV-11597** (developer verify task): \"{t}\"")
for n in sorted({int(x[0].split()[-1]) for c in L.CASES for x in c["q"] if isinstance(x, tuple) and x[0].startswith("Chris Ward's answer")}):
    A(f"- **Chris Ward's answer {n}**: \"{L.ANS[n]}\"")
oth = {(x[0], x[1]) for c in L.CASES for x in c["q"] if isinstance(x, tuple) and not x[0].startswith("Jira")}
for l, t in sorted(oth): A(f"- **{l}**: \"{t}\"")
A("")
A("## 10. VIU status")
A("- Every case and recipe: UNVERIFIED — the build is not yet available. The design was read and every case re-checked against it on 22 Oct 2026; the tech plan was read and every case re-checked against it the same day; every case was re-checked against PRD version 9 and Chris Ward's answers 1 to 16 on 26 Oct 2026.")
A("")
A("## 11. Questions (Chris Ward's sheet, questions 1 to 16): all answered 23 Oct 2026, read 26 Oct 2026; PRD version 9 carries the answers")
for n, a in sorted(L.ANS.items()):
    A(f"- Q{n}: {a.replace(chr(10), ' ')}")
A("- Nothing is open on this sheet. (Row 17's text for question 12 repeats question 14's subject; PRD version 9 S5-R13 settles question 12.)")
open(f"{L.P}/AR-AP-SETUP-FILE.md", "w").write("\n".join(Lines) + "\n")
print("setup file:", len(Lines), "lines")
