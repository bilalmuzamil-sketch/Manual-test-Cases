#!/usr/bin/env python3
"""Render the Splitting Sales Representatives setup file for Claude sessions (Rule 117 ninth amendment) — PREPARED, NOT LINKED
from the cases (QA lead, 19 Oct 2026: "do not attach that claude file … but keep it prepared so that we can later attach it").
Holds no environment address, credentials, cookies or session data."""
import os, sys, re, csv, json
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, D)
import ssr_lib, importlib
for m in ["cases_s1_s2", "cases_s3_s4", "cases_s5_s8", "cases_tp", "cases_rs", "cases_rel", "cases_design"]: importlib.import_module(m)
ids = {r["key"]: r["case_id"] for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
SEC = dict(json.load(open(f"{P}/applied/sections.json")))
NAMES = {"S1": "Story 1 — One Sales Representative field on the work order", "S2": "Story 2 — Separate Labor and Parts representatives",
         "S3": "Story 3 — Representatives on a phone", "S4": "Story 4 — A customer's default representatives",
         "S5": "Story 5 — Credit on the invoice and in Sales By Representative", "DATA": "Credit and totals — exact amounts",
         "S6": "Story 6 — Printed work order", "S7": "Story 7 — Work order log", "S8": "Story 8 — Sales Type filters on both sales reports",
         "REL": "Release day and what must not change", "DESIGN": "Design — how it looks"}
import html as _h
DR = []
for r in csv.DictReader(open(f"{P}/testrail-id-map.csv")):
    if r["key"].startswith("DR-"):
        a = json.load(open(f"{P}/design-recheck-2026-10-20/applied/C{r['case_id']}-after.json"))
        pre = [(_h.unescape(re.sub(r"<[^>]+>", "", x.replace("<br>", "\n"))).split("\n") + [""])[:2] for x in re.findall(r"<li>(.*?)</li>", a["custom_preconds"], re.S)]
        DR.append({"key": r["key"], "sec": "DESIGN", "title": a["title"], "pre": [(x[0], x[1]) for x in pre]})
link = lambda k: f"[C{ids[k]}](https://shopview.testrail.io/index.php?/cases/view/{ids[k]})"
L = []
L += ["# Splitting Sales Representatives: setup file for Claude sessions",
      "",
      "This file is for a Claude session. A manual tester never needs it: each test case is complete on its own. **It is prepared but "
      "not linked from the test cases** (QA lead, 19 Oct 2026). It holds no environment address, credentials, cookies or session data.",
      "",
      "## 1. Header",
      f"- Feature: Splitting Sales Representatives (epic SV-10890; stories SV-11265 to SV-11272). TestRail group 84266, {len(ssr_lib.CASES) + len(DR)} cases.",
      "- Generated: 19 Oct 2026, with the cases; regenerated 20 Oct 2026 for PRD version 10, Chris Ward's answers, the 7 new cases and the 8 design cases DR-01 to DR-08.",
      "- Sources: PRD Confluence 919928833 version 10 (19 Oct 2026, Chris Ward); Chris Ward's answers to the question sheet (19 Oct 2026); tech plan (dated 14 Oct 2026, uploaded 19 Oct 2026); "
      "Claude design canvas https://claude.ai/artifact/8MHqwyffAYtqZ6EccS5RUm (export read 19 Oct 2026); Sales By Representative spec "
      "Confluence 585629698 version 28; Sales By Customer spec Confluence 577634305 version 21.",
      "- **No build yet** (QA lead, 19 Oct 2026). Every recipe below is UNVERIFIED until the build verification session runs it.",
      "- At session start, ask the user for: the site to use and how to sign in as ACCOUNT-A (and ACCOUNT-B/C/D where a case needs them).",
      "",
      "## 2. Accounts and roles",
      "| Slot | Role as shown in the UI | Used for | Cases |",
      "|---|---|---|---|",
      "| ACCOUNT-A | Admin | Creates every record and performs every step except where another slot is named. | all |",
      "| ACCOUNT-B (view only) | custom role with Work Orders — View only | the plain-text field | " + link("S1-06") + " |",
      "| ACCOUNT-C (work orders only) | custom role with Work Orders — Create & Edit, no Customers — Create & Edit | New Customer from a work order | " + link("S4-24") + " |",
      "| ACCOUNT-D (no reports) | custom role without Reports — Page Access | report access | " + link("REL-13") + " |",
      "| ACCOUNT-E (part sales only) | custom role with Part Sales — Create & Edit, no Customers — Create & Edit, no Work Orders — Create & Edit | New Customer from a part sale | " + link("S4-25") + " |",
      "| Developer check | not a UI account: only a data repair makes a staff record stop existing or belong to another organization | developers set this up; manual QA cannot | " + link("S1-11") + ", " + link("S7-05") + ", " + link("S6-05") + " |",
      "",
      "## 3. Flags and settings",
      "- Always on: no feature setting (PRD Key Decisions: \"Always on.\").",
      "- Staff \"Sales Representative\" switch on for every {Sales-rep-…} person; off for {Staff-member-D}.",
      "- Location Shop Supplies Charge: 0% for the money cases unless the case names 10%.",
      "- Browser: desktop at least 1024 px; design cases 1440 px at 100% zoom (1536 px and 200% zoom where named); phone cases on a touch screen with no mouse pointer; the wide-tablet case on a touch tablet with no mouse at least 1024 px wide; two-window cases in two windows of one browser.",
      "- Report cases: Sales By Representative with Show Unassigned on and the Sales Type column turned on in the column selector, as each case says.",
      "",
      "## 4. Data recipes",
      "### Shared procedures (UNVERIFIED click paths; no build yet)",
      "| Procedure | How | Check |",
      "|---|---|---|",
      "| P-REP | Settings > Staff > New Staff Member: First Name, Last Name, an email with ZZAUTOTEST in it, a Role, a Department, Location {Location-A}; turn the \"Sales Representative\" switch on; save. | The person is listed in a work order's Sales Representative dropdown. |",
      "| P-NOSWITCH | As P-REP with the \"Sales Representative\" switch off. | Not listed in the dropdown. |",
      "| P-CUSTOMER | Customers > New Customer: Name, required details, Sales Representative field(s) as the case names (+ to add Service Parts / Part Sales); save. Add a contact and an asset (unit). | The customer page lists the representative rows as named. |",
      "| P-WO | Work Orders > Create Work Order: the customer and an asset; on the card set the Sales Representative field(s) as named (+ > \"Sales Representative - Parts\" for Labor/Parts); add the labor line(s) (hours × rate) and part(s) the case names; approve the lines. | The card and the Finance tab show what the case names. |",
      "| P-PARTSALE | Part Sales > New Part Sale for the customer; add the part(s) and shop supplies named. | The part sale shows the named Sales Representative. |",
      "| P-FEE | On the work order Finance tab add the whole-invoice fee or discount (not on a line) or the line fee/discount the case names. | The Finance tab totals match the case's numbers. |",
      "| P-INVOICE | Finance tab > Create Invoice (close the payment dialog without paying). | The invoice exists; the card is read-only. |",
      "| P-PRE-RELEASE | For release-day cases: create the named records and export the named report on the site BEFORE the release is installed; keep the files. | Files saved with their dates. |",
      "",
      "### One recipe per case: the placeholder values (the examples in the case are the values)"]
for c in ssr_lib.CASES + DR:
    k = c["key"]
    L.append(f"#### SETUP-{k} — {link(k)} {c['title']}")
    L.append(f"Sub folder: {NAMES[c['sec']]} (section {SEC[c['sec']]}).")
    L.append("Satisfies these precondition lines, exactly as the case states them:")
    for a, b in c["pre"]:
        L.append(f"- {a}" + (f" {b}" if b else ""))
    phs = sorted(set(re.findall(r"\{([A-Z][^{}]*)\}", " ".join(a for a, _ in c["pre"]))))
    L.append("Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; "
             "P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.")
    L.append("Placeholders used: " + ", ".join("{" + p + "}" for p in phs) + ". Values: the \"For example\" lines above; record the real work order and part sale numbers here after setup.")
    L.append("")
L += ["## 5. Mapping table", "| Sub folder | Cases |", "|---|---|"]
for s, n in NAMES.items():
    L.append(f"| {n} | " + ", ".join(link(c["key"]) for c in ssr_lib.CASES + DR if c["sec"] == s) + " |")
L += ["", "## 6. Dependencies and shared fixtures",
      "- Every case owns its records; the example names carry ZZAUTOTEST. Money cases need a location where nothing else is invoiced that day (or a fresh ZZAUTOTEST location).",
      "", "## 7. Reset and cleanup",
      "- Leave ZZAUTOTEST records in place. Turn back on any \"Sales Representative\" switch a case turned off, and reactivate any staff member a case deactivated, before reusing them.",
      "", "## 8. Traceability",
      "Every case's expected results quote their source sentences word for word (PRD v10, Chris Ward's answers, tech plan, report specs); the checker `authoring/build.py` refuses any quote not found verbatim. All 142 PRD version 10 requirement codes are covered.",
      "", "## 9. VIU status", "- Every case and recipe: UNVERIFIED — the build is not yet available.",
      "", "## 10. Open questions",
      "- Chris Ward answered all 38 questions of the first sheet on 19 Oct 2026 (design-recheck-2026-10-20/chris-answers.json).", "- Three design questions are questions 39, 40 and 41 (rows 46 to 48, light green) of the same sheet, added 20 Oct 2026 (https://docs.google.com/spreadsheets/d/17Ry1BtRTPEkecBP5TlgAE0T93Ai1TQewdJ7B7WpWDBQ); " + link("DR-03") + ", " + link("DR-05") + " and " + link("DR-08") + " are held until he answers."]
open(f"{P}/SPLITTING-SALES-REPS-SETUP-FILE.md", "w").write("\n".join(L) + "\n")
print("setup file:", len(L), "lines")
