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
import readthrough as _RTH
import pattern_lib as _PL0   # 26 Oct 2026: the Blocked line is dropped from every recipe (Rule 117 fifteenth amendment)
DR = []
for r in csv.DictReader(open(f"{P}/testrail-id-map.csv")):
    if r["key"].startswith("DR-"):
        a = json.load(open(f"{P}/design-recheck-2026-10-20/applied/C{r['case_id']}-after.json"))
        # 26 Oct 2026: the draft Preconditions with the Scenario line (scenario-preconditions-2026-10-26/DR-PROPOSALS.json) when present
        _drp = f"{P}/scenario-preconditions-2026-10-26/DR-PROPOSALS.json"
        if os.path.exists(_drp) and r["case_id"] in json.load(open(_drp)): a = dict(a, custom_preconds=json.load(open(_drp))[r["case_id"]]["custom_preconds"])
        pre = [(_h.unescape(re.sub(r"<[^>]+>", "", x.replace("<br>", "\n"))).split("\n") + [""])[:2] for x in re.findall(r"<li>(.*?)</li>", a["custom_preconds"], re.S)]
        DR.append({"key": r["key"], "sec": "DESIGN", "title": a["title"], "pre": [(x[0], x[1]) for x in pre if not x[0].startswith("Scenario:") and not _PL0.BLOCKED_RE.search(x[0])]})
# 26 Oct 2026 (Rule 117 fourteenth amendment): the plain names each case uses for its placeholders, so a Claude session can match the
# case's words ("sales rep A", "the first work order") to the recipe's placeholders.
import pattern_lib as _PL
PLAIN = {}
for c in ssr_lib.CASES:
    L_ = ssr_lib.LAYOUT_V2.get(c["key"]) or {}
    nm = _PL.default_names(" ".join([a for a, _ in c["pre"]] + c["steps"] + c["res"] + [c["known"]])); nm.update(L_.get("names", {}))
    PLAIN[c["key"]] = nm
import html as _hh
def _tester(f): return _hh.unescape(re.sub(r"<[^>]+>", " ", f["custom_preconds"] + " " + f["custom_steps"] + " " + f["custom_expected"].split("<p></p>", 1)[0])).lower()
TESTER = {c["key"]: _tester(ssr_lib.render(c)) for c in ssr_lib.CASES}
# records the relevance pass removed (pattern_cases.FIXES reasons "removed sales rep B", "removed sales reps A and B", "removed the two/three sales reps")
from pattern_cases import FIXES as _FIXES
def _removed(reasons):
    out = []
    for r in reasons:
        m = re.match(r"removed (?:sales reps? ([A-D](?: and [A-D])?)|the (two|three) sales reps)", r)
        if not m: continue
        letters = m.group(1).split(" and ") if m.group(1) else (["A", "B"] if m.group(2) == "two" else ["A", "B", "C"])
        out += [f"Sales-rep-{x}" for x in letters if f"Sales-rep-{x}" not in out]
    return out
REMOVED = {k_: _removed(v_) for k_, v_ in _FIXES.items()}
REMOVED.update({"DR-02": ["Sales-rep-B"], "DR-03": ["Sales-rep-B"]})
_drpat = f"{P}/pattern-format-2026-10-26/DR-PATTERN.json"
if os.path.exists(_drpat):
    for k_, v_ in json.load(open(_drpat)).items(): PLAIN[k_] = v_.get("names", {}); TESTER[k_] = _tester(v_["fields"])
link = lambda k: f"[C{ids[k]}](https://shopview.testrail.io/index.php?/cases/view/{ids[k]})" if k in ids else (f"{k} (new 22 Oct 2026, Rule 136 split of {re.sub(r'[a-z]$', '', k)} C{ids.get(re.sub(r'[a-z]$', '', k), '?')}; not yet in TestRail)" if re.search(r"[a-z]$", k) else f"{k} (new 22 Oct 2026; not yet in TestRail)")
L = []
L += ["# Splitting Sales Representatives: setup file for Claude sessions",
      "",
      "This file is for a Claude session. A manual tester never needs it: each test case is complete on its own. **It is prepared but "
      "not linked from the test cases** (QA lead, 19 Oct 2026). It holds no environment address, credentials, cookies or session data.",
      "",
      "## 1. Header",
      f"- Feature: Splitting Sales Representatives (epic SV-10890; stories SV-11265 to SV-11272). TestRail group 84266, {len(ssr_lib.CASES) + len(DR)} cases.",
      "- Generated: 19 Oct 2026, with the cases; regenerated 20 Oct 2026 for PRD version 10, Chris Ward's answers, the 7 new cases and the 8 design cases DR-01 to DR-08; regenerated 22 Oct 2026 for PRD version 11 (answers 39 and 40, new cases S5-18 and REL-16, DR-03 released, DR-08 deleted); regenerated again 22 Oct 2026 for the tech plan pass (Rule 134: 13 cases changed, 9 new draft cases, not yet in TestRail; 8 of them remain: S2-15, S2-16, S4-27, S4-28, S5-20, REL-17, REL-18, REL-19); regenerated again 22 Oct 2026 for the one-action-steps pass (steps split to one action each and unnecessary steps removed; no precondition changed, so every recipe below is unchanged); regenerated again 22 Oct 2026 for the Rule 136 pass (DRAFT: 32 cases split into 2 or 3, 36 new cases with keys ending b or c, not yet in TestRail; steps that only read are folded into the step before; untested state such as the report already open for today, an invoice already made, a switch already turned off, moved into the preconditions, so the recipes of the cases that changed follow their new precondition lines); regenerated 26 Oct 2026 for the QA lead's pattern (Rule 117 fourteenth amendment, DRAFT, not yet in TestRail: the cases now say their preconditions in plain words with no placeholders or examples, so every recipe below adds a \"Plain names in the test case\" line, and, after the relevance and independence passes the same day, a line naming the records the case no longer uses and the records it must make fresh for itself matching the case's words to the placeholders; the records, values and examples are unchanged); regenerated again 26 Oct 2026 after the tester read-through (build/tester-readthrough-2026-10-26/splitting-sales-reps/): the 4 cases a manual tester cannot set up were deleted from TestRail on the QA lead's order, so their recipes and the developer-check slot are gone (requirements: NO_MANUAL_CASE.json); no recipe carries the closing Blocked line any more (Rule 117 fifteenth amendment); the recipes of the 22 cases whose precondition wording the read-through changed carry a \"Tester read-through\" line with the new wording; earlier, regenerated 26 Oct 2026 for the scenario preconditions (Rule 117 thirteenth amendment, DRAFT, not yet in TestRail: every case's Preconditions open with a \"Scenario:\" line; the design cases' browser-window and design-pictures line now sits just above the starting screen; the Counter Sale customer's state in " + link("S4-13") + " is its own line; no record, value or example changed, so every recipe below satisfies the same records as before).",
      "- Sources: PRD Confluence 919928833 version 11 (21 Oct 2026, Chris Ward); Chris Ward's answers 1 to 40 to the question sheet (19 and 21 Oct 2026); tech plan (dated 14 Oct 2026, uploaded 19 Oct 2026 and again, byte-identical, 22 Oct 2026; read in full 22 Oct 2026); "
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
      "| ACCOUNT-F (customers only) | custom role with Customers — Create & Edit, no Work Orders — View, no Work Orders — Create & Edit | the representative list in Edit Customer | " + link("S4-28") + " |",
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
      "| P-EXPAND | On Sales By Representative, a representative's invoice rows show only after their row is expanded with the chevron in its Date cell (the Date column header's chevron expands every row). | The invoice rows show under the representative. |",
      "| P-HISTORY | Open the work order's history and open a saved version (the read-only card). | The version opens read-only. |",
      "| P-SPLIT / P-REOPEN | Split Work Order or Split Part Sale moving one line or part to the new document; or pay the invoice in full and reopen the paid work order. | A new work order or part sale exists, made from the first. |",
      "| P-TAX-EXEMPT | Mark the customer tax exempt so no tax applies to its invoices; add a non-taxable whole-invoice discount on the Finance tab. | The invoice total before tax equals the total. |",
      "| P-PRE-RELEASE | For release-day cases: create the named records and export the named report on the site BEFORE the release is installed; keep the files. | Files saved with their dates. |",
      "",
      "### One recipe per case: the placeholder values (the examples in the case are the values)"]
for c in ssr_lib.CASES + DR:
    k = c["key"]
    L.append(f"#### SETUP-{k} — {link(k)} {c['title']}")
    L.append(f"Sub folder: {NAMES[c['sec']]} (section {SEC[c['sec']]}).")
    L.append("Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):")
    for a, b in c["pre"]:
        L.append(f"- {a}" + (f" {b}" if b else ""))
    phs = sorted(set(re.findall(r"\{([A-Z][^{}]*)\}", " ".join(a for a, _ in c["pre"]))))
    L.append("Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; "
             "P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.")
    L.append("Placeholders used: " + ", ".join("{" + p + "}" for p in phs) + ". Values: the \"For example\" lines above; record the real work order and part sale numbers here after setup.")
    nm = PLAIN.get(k, {})
    if nm: L.append("Plain names in the test case: " + "; ".join(f"{{{p}}} = {v}" for p, v in sorted(nm.items())) + ".")
    tt = TESTER.get(k, "")
    gone = REMOVED.get(k, [])
    if gone: L.append("Not used by the test case since 26 Oct 2026 (relevance pass): " + ", ".join("{" + p + "}" for p in gone) + "; do not create them for this case.")
    fresh = [x for x in ("work order", "customer", "part sale", "staff member") if re.search(r"(" + (r"staff members?|sales rep [A-D]" if x == "staff member" else x) + r")s?( [A-D])?,? (made )?for this test", tt, re.I)]
    if fresh: L.append("Make fresh for this test (the case changes it; never reuse another case's): " + ", ".join(fresh) + ".")
    _rt = [op for op in _RTH.RT.get(k, {}).get("ops", []) if op[0] in ("pre_sub", "pre_ins", "pre_del")]
    if _rt:   # 26 Oct 2026, tester read-through: precondition wording the case now carries on top of the recipe above
        L.append("Tester read-through, 26 Oct 2026: the case's preconditions now also say: " + " / ".join(
            ("(removed) " + op[1]) if op[0] == "pre_del" else ("\"" + (op[2] if op[0] == "pre_ins" else op[2]) + "\"") for op in _rt) + ". Set the records up to match.")
    L.append("")
L += ["## 5. Mapping table", "| Sub folder | Cases |", "|---|---|"]
for s, n in NAMES.items():
    L.append(f"| {n} | " + ", ".join(link(c["key"]) for c in ssr_lib.CASES + DR if c["sec"] == s) + " |")
L += ["", "## 6. Dependencies and shared fixtures",
      "- Every case owns its records; the example names carry ZZAUTOTEST. Money cases need a location where nothing else is invoiced that day (or a fresh ZZAUTOTEST location).",
      "", "## 7. Reset and cleanup",
      "- Leave ZZAUTOTEST records in place. Turn back on any \"Sales Representative\" switch a case turned off, and reactivate any staff member a case deactivated, before reusing them.",
      "", "## 8. Traceability",
      "Every case's expected results quote their source sentences word for word (PRD v11, Chris Ward's answers, tech plan, report specs); the checker `authoring/build.py` refuses any quote not found verbatim. All 143 PRD version 11 requirement codes are covered (" + str(len(ssr_lib.CASES)) + " library cases), except S1-E3, S6-N1 and S7-R6: their cases were deleted on 26 Oct 2026 on the QA lead's order because a manual tester cannot set them up (only a data repair makes a staff record stop existing or belong to another organization); they are left to the developers' own checks (NO_MANUAL_CASE.json).",
      "", "## 9. VIU status", "- Every case and recipe: UNVERIFIED — the build is not yet available.",
      "", "## 10. Open questions",
      "- Chris Ward answered all 38 questions of the first sheet on 19 Oct 2026 (design-recheck-2026-10-20/chris-answers.json).", "- Questions 39 and 40 (rows 46 and 47, light green) of the same sheet (https://docs.google.com/spreadsheets/d/17Ry1BtRTPEkecBP5TlgAE0T93Ai1TQewdJ7B7WpWDBQ) were answered by Chris Ward on 21 Oct 2026 and became PRD version 11: " + link("DR-03") + " was released; DR-08 (C690665) was deleted on 22 Oct 2026 because nothing makes a Lead Technician message show today (answer 40). (A third, on the phone control, was withdrawn on 20 Oct 2026 as answered by answer 9; its held case DR-05 was deleted.) Question 41 (a customer adds the Part Sales field while its Service Parts or one representative has the switch off: what does the new field start with?) was drafted on 22 Oct 2026 in tech-plan-pass-2026-10-22/NEW-QUESTIONS.md; it was added to the same sheet on 22 Oct 2026 (rows 48-49, light orange) and Chris Ward answered it on 23 Oct 2026 (PRD version 13, S4-R7 and S4-R8: the added field starts \"Unassigned\"); no case is held on it."]
open(f"{P}/SPLITTING-SALES-REPS-SETUP-FILE.md", "w").write("\n".join(L) + "\n")
print("setup file:", len(L), "lines")
