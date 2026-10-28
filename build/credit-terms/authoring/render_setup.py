#!/usr/bin/env python3
"""Render the Credit terms setup file for Claude sessions (Rule 117 ninth amendment): header and sources, account slots and custom roles,
flags and settings, shared procedures, one recipe per case with every placeholder's example value, the mapping table, dependencies,
reset and cleanup, traceability (each case's verbatim source sentences), VIU status and open questions.
Holds no environment address, credentials, cookies or session data. python3 render_setup.py"""
import os, sys, re, json, importlib, html
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import ct_lib as L
import pattern as PAT
import build_mods
from po_questions import QUESTIONS, DROPPED
SEC = json.load(open(f"{L.P}/sections.json"))
NAMES = {"S1": "Story 1 — Credit Terms page and list", "S2": "Story 2 — Row menu actions", "S3": "Story 3 — Create or edit a credit term",
         "S4": "Story 4 — Move Customers", "S5": "Story 5 — New Customer and Edit Customer", "S6": "Story 6 — Vendors", "S7": "Story 7 — Due dates",
         "S8": "Story 8 — QuickBooks sync - credit terms", "S9": "Story 9 — Over Credit warning", "S10": "Story 10 — Imports and Public API",
         "S11": "Release day and what must not change", "S12": "Story 12 — Credit Terms audit log", "DATA": "Counts and due dates — exact numbers", "DESIGN": "Design — how it looks"}
PROC = [
 ("P-TERM", "One of the shop's own terms", "Settings > Credit Terms > New Credit Term: the example name, the option and the number the case gives > Create Credit Term. Deactivate it from its row menu where the case says deactivated; make it the default with Make Default for New Customers where the case says default.", "The row shows on the right tab with the Due text the case gives."),
 ("P-STD", "Standard term state", "Settings > Credit Terms: deactivate the named standard term from its row menu (or reactivate it from the Inactive tab). Make Default for New Customers on the term the case names as default (COD unless stated).", "The tabs and the Default tag match the case."),
 ("P-CUST", "Customer on a term", "Customers > New Customer: the example name, Credit Terms and Credit Limit as the case gives > Save. For a blank or odd spelling (\"NET 30\", Prepaid), use the contacts import (P-IMPORT): the screen cannot store them.", "The customer card's \"Credit term\" and credit limit match."),
 ("P-OLD", "Data from before the release", "Customers, vendors and invoices the case says are \"from before the release\" (a COD or Credit Hold customer with a limit above $0, a blank-term customer or vendor, a vendor invoice with no stored due date) are taken on production (QA lead, 26 Oct 2026: \"This you can take from production environment if you need the BEFORE screenshots.\"): shortly before the release reaches production, find or make them on the production test account and capture the values and screenshots the case asks for; the case is then run on production after the release. After the release they cannot be made by hand.", "Values written down with the date."),
 ("P-VENDOR", "Vendor on a term", "Parts > Vendors > New Vendor: the example name > Save & Close; then Edit Vendor > Credit Terms and Credit Limit as the case gives.", "The vendor card's \"Credit term\" matches."),
 ("P-WO", "Work order ready to invoice", "Work Orders > New Work Order for the customer; add a labor line; approve; complete the Review step; leave it Complete (playbook: every part received with a part number, Review done, the customer has a contact).", "Finance tab shows the invoice preview with Invoice Date and Due date, and Create Invoice is enabled."),
 ("P-INV", "Invoice on a term", "P-WO, then on the Finance tab set Invoice Date as the case gives and click Create Invoice; close the payment window unpaid unless the case says paid. For \"held only by invoices\", move the customer off the term afterwards with Move Customers.", "The invoice shows the term and due date."),
 ("P-BAL", "Balance over a limit", "P-INV for the amounts the case names (unpaid), then set the credit limit in Edit Customer before the Over Credit check.", "The customer's balance equals the sum of its unpaid invoices."),
 ("P-VINV", "Vendor invoice", "Parts > Vendors > Vendor Invoices: a new vendor invoice for the vendor with one part; set the invoice date as the case gives. For a delivery: create a purchase order for the vendor at the delivery's location and receive it there.", "The vendor invoice shows the due date."),
 ("P-IMPORT", "Contacts or vendor import", "Settings > Data Import > Contacts (or Vendors): download the template, fill the rows the case names (name, credit term text, credit limit), upload.", "The import finishes and the customers or vendors exist."),
 ("P-ROLE", "Custom role and user", "Settings > Roles & Permissions > Create custom role: Settings page access with only the sub-rows the case needs (\"Finance\" on or off), the \"Customers\" row's \"Create & Edit\" column and the \"View and Manage AP/AR Data\" cross toggle exactly as the case says; assign it to a test user (playbook §G: role swap on the test login, reset afterwards). Out-of-the-box roles: Reset to Template first (Rule 26).", "The user signs in again (a role change signs the user out) and sees the expected menus."),
 ("P-TWO", "Two browsers, two users", "Sign in as the first Admin in one browser and as the second Admin ({User-B}) in another browser or a private window.", "Both browsers show the starting screen."),
 ("P-LOC", "Locations and time zones", "Settings > Locations: {Location-A} (Edmonton time unless the case says otherwise), {Location-B} in another time zone the case names; a location with no time zone where the case asks (UNVERIFIED: the time zone may be required).", "The location switcher lists both."),
 ("P-QBO", "QuickBooks Online sandbox", "Connect the test organization to the QuickBooks Online sandbox (playbook; build/sv9087-credit-term-2026-08-27/FINDINGS.md Check G: the qb1 environment, sync paused items, US tax codes). Sign in to the sandbox in another tab; Terms are under Settings > All lists > Terms.", "Invoices sync and appear in the sandbox."),
 ("P-API", "Public API", "What the case's preconditions name: a valid Public API key for the test organization, the Public API documentation from the developers (the requests to create, update and read a customer) and a request tool such as Postman. The request addresses and field names are not in our sources yet (no tech plan); take them from that documentation.", "UNVERIFIED until the documentation is in hand."),
 ("P-CLEAN", "A shop holding only the case's own records", "Where the case's preconditions say the shop has no other terms of its own, no deactivated term, or a log nobody else has written to, use a test organization that holds none of another session's terms, customers or log rows: a fresh test organization, or the shared one once every foreign term is reactivated and no foreign log row exists. Never reactivate or delete another session's terms on the shared site.", "The tabs and the Credit Terms Log hold only what the case's preconditions name."),
 ("P-VOLUME", "Large term", "2,000 or 2,500 customers on one term: contacts import with that many rows on the term (P-IMPORT), or Move Customers into it.", "The term's Customers count equals the number."),
]
def procs_for(c):
    t = " ".join(a + " " + (b or "") for a, b in c["pre"]) + " " + " ".join(c["steps"])
    out = []
    if "own" in t and "term" in t: out.append("P-TERM")
    if re.search(r"deactivated|default for new customers|standard terms", t): out.append("P-STD")
    if "Customer-" in t: out.append("P-CUST")
    if re.search(r"before the release", t): out.append("P-OLD")
    if "Vendor-" in t: out.append("P-VENDOR")
    if "Work-order-" in t: out.append("P-WO")
    if re.search(r"Invoice-|invoices totalling|invoice", t): out.append("P-INV")
    if "totalling" in t: out.append("P-BAL")
    if "Vendor-invoice" in t or "delivery" in t: out.append("P-VINV")
    if re.search(r"import", t, re.I): out.append("P-IMPORT")
    if "custom role" in t or "out-of-the-box" in t: out.append("P-ROLE")
    if "{User-B}" in t: out.append("P-TWO")
    if "Location-B" in t or "time zone" in t: out.append("P-LOC")
    if "QuickBooks" in t: out.append("P-QBO")
    if c["api"]: out.append("P-API")
    if re.search(r"2,000|2,500", t): out.append("P-VOLUME")
    if c.get("clean"): out.append("P-CLEAN")
    return out or ["none"]

Lines = []; A = Lines.append
A("# Credit terms: setup file for Claude sessions")
A("")
A("This file is for a Claude session. A manual tester never needs it: each test case is complete on its own. It holds no environment "
  "address, credentials, cookies or session data. Generated by `authoring/render_setup.py` from the case sources; regenerate it whenever a case changes.")
A("")
A("## 1. Header and sources")
A(f"- Feature: Credit terms (epic SV-11638; stories SV-11670 to SV-11681). TestRail group 91454 (suite 1), sections in `sections.json`. {len(L.CASES)} cases, drafted 23 Oct 2026, not in TestRail.")
A(f"- PRD: {L.PRD_NAME}; saved `sources/CONFLUENCE-963346440-v3-2026-10-23.md` (1,075 lines, read in full 23 Oct 2026). Every quote is checked word for word against it by `authoring/build.py`.")
A("- Jira: the epic and its 12 stories, saved `sources/JIRA-SV-11638-stories-2026-10-23.md`; sweep of 23 Oct 2026 in `sources/SWEEP-2026-10-23.md` (13 tickets, PRD still v3).")
A(f"- Design: {L.DESIGN_URL} (\"Default Credit Terms\"), saved in `design-2026-10-23/` and driven by a second worker; the design pass adds each case's pictures and design words under \"References from Design\".")
A("- Tech plan: not yet shared (QA lead, 23 Oct 2026). A full pass follows when it arrives (Rule 134).")
A("- Today's behaviour (facts, not expectations): `build/sv9087-credit-term-2026-08-27/FINDINGS.md` (Net 30 due dates, Credit Hold banner \"Cannot invoice this customer. Customer is on Credit Hold\", Charge Account withheld from COD, Invoice Date field on the Finance tab, vendor due dates on Accept Delivery) and `build/sv8815-customer-credit-2026-08-20/`.")
A("- No QA branch for this epic is known yet. Every recipe below is UNVERIFIED until the build verification session runs it.")
A("- At session start, ask the user for the site to use and how to sign in as each slot below. Never write a secret into this file.")
A("")
A("## 2. Accounts and roles (slots)")
A("| Slot | Role as shown in the UI | Used for | Cases |"); A("|---|---|---|---|")
slots = {}
for c in L.CASES:
    first = c["pre"][0][0]
    if first.startswith("You are an Admin user"): s = "ADMIN-A"
    elif "custom role" in first: s = "ROLE-" + c["key"]
    elif "out-of-the-box" in first: s = "OOTB-" + c["key"]
    else: s = "OTHER-" + c["key"]
    slots.setdefault(s, []).append(c["key"])
for s, ks in slots.items():
    c = next(x for x in L.CASES if x["key"] == ks[0])
    if s == "ADMIN-A": A(f"| ADMIN-A | Admin | every case not listed below | {len(ks)} cases |")
    else: A(f"| {s} | {'custom role' if s.startswith('ROLE') else 'out-of-the-box role' if s.startswith('OOTB') else 'see the case'} | {c['pre'][0][0]} | {', '.join(ks)} |")
two = [c["key"] for c in L.CASES if any("{User-B}" in a for a, _ in c["pre"])]
A(f"| ADMIN-B | Admin (second user, second browser) | the two-browser cases | {', '.join(two)} |")
A("")
A("## 3. Flags and settings")
A("- No feature flag (PRD Key Decisions: \"No feature flag.\"). The page is Settings > Finance > Credit Terms, below Payment Methods.")
A("- Desktop browser, 1440 px wide unless the case names another width or a phone; light theme.")
A("- Every case owns its records: example names carry ZZAUTOTEST and the case key, and term names stay within 31 characters.")
A("- Shared test site: standard terms hold real customers (PRD §6: 1,528 on Due on Receipt), so a case that needs a term holding exactly N customers uses a fresh shop term made in its setup ({Term-A}); a case that must use a standard term states counts relatively ({Count-A} + 3) or reaches its customers in Move Customers with Select None, the search and a tick.")
A("- Dates: the due-date cases set the Invoice Date on the Finance tab's invoice preview (existing behaviour, S7-R8); a case that needs \"today\" names it as {Date-A}.")
A("")
A("## 4. Shared procedures (UNVERIFIED click paths; no build yet)")
A("| Procedure | What | How | Check |"); A("|---|---|---|---|")
for p, w, h, ch in PROC: A(f"| {p} | {w} | {h} | {ch} |")
A("")
A("## 5. One recipe per case: the placeholder values (the examples in the case are the values)")
for c in L.CASES:
    A(f"### SETUP-{c['key']} — {c['title']}")
    A(f"Section: {NAMES[c['sec']]} (TestRail section {SEC[c['sec']]}). Marker: `{c['marker']}`.")
    A("Preconditions with their placeholders and examples (for Claude sessions; the TestRail case states the same in plain words, without the examples):")
    for a, b in c["pre"]: A(f"- {a}" + (f" {b}" if b else ""))
    _f = L.render(c)   # 26 Oct 2026 tester read-through: the plain preconditions exactly as the TestRail case states them
    A("Preconditions as the TestRail case states them (tester read-through, 26 Oct 2026):")
    for _b in re.findall(r"<li>(.*?)</li>", _f["custom_preconds"], re.S): A("  - " + html.unescape(_b))
    nm = PAT.names_for(c)
    if nm: A("Names in the TestRail case (Rule 117 fourteenth amendment): " + ", ".join(f"{p} = {v}" for p, v in nm.items()) + ".")
    phs = sorted(set(re.findall(r"\{([A-Z][^{}]*)\}", " ".join(a for a, _ in c["pre"]))))
    A("Placeholders: " + (", ".join("{" + p + "}" for p in phs) or "none") + ". Values: the \"For example\" lines above; write the real numbers (work order, invoice) here after setup.")
    A("Procedures: " + ", ".join(procs_for(c)) + ".")
    A("Sources (verbatim text in section 9): " + ", ".join(sorted(L.codes_of(c))) + ".")
    A("")
A("## 6. Mapping table")
A("| Section | Cases |"); A("|---|---|")
for s, n in NAMES.items(): A(f"| {n} | " + ", ".join(c["key"] for c in L.CASES if c["sec"] == s) + " |")
A("")
A("## 7. Dependencies and shared fixtures")
A("- Cases marked `AUTOMATION: HOLD - needs the before values taken on production ...` need P-OLD done on production before the release reaches production.")
A("- Cases that move customers off COD, Net 30 or other busy terms untick everyone first (Select None) and tick only the case's own customers.")
A("- The QuickBooks cases share one sandbox; each uses its own term names so the Terms list never collides.")
A("")
A("## 8. Reset and cleanup")
A("- Leave ZZAUTOTEST records in place. Put the default back to what it was before the case (COD on an existing organization). Reactivate any standard term a case deactivated. Reset out-of-the-box roles to their templates and restore the test login's role (playbook §G).")
A("")
A("## 9. Traceability — every source sentence the cases quote (PRD v3 unless marked Jira)")
used = sorted({x for c in L.CASES for x in L.codes_of(c)}, key=lambda s: (s[0] != "S", s))
for k in used:
    if k in L.CODE5 and L.CODE5[k] != L.CODE.get(k): A(f"- **{k}** (PRD v5, quoted by the 28 Oct 2026 named set and new cases): \"{L.CODE5[k]}\"")
    if k in L.NAMED5 and k in L.NAMED5_CHANGED: A(f"- **{k}** ({L.NAMED5[k][0]}, PRD v5, quoted by the 28 Oct 2026 named set and new cases): \"{L.NAMED5[k][1]}\"")
    if k in L.CODE: A(f"- **{k}**: \"{L.CODE[k]}\"")
    elif k in L.NAMED: A(f"- **{k}** ({L.NAMED[k][0]}): \"{L.NAMED[k][1]}\"")
    elif k in L.SUB: A(f"- **{k}** ({L.SUB[k][0]}): \"{L.SUB[k][1]}\"")
jira = sorted({(x[0], x[1]) for c in L.CASES for x in c["q"] if isinstance(x, tuple)})
for l, t in jira: A(f"- **{l}**: \"{t}\"")
A("")
A("## 10. VIU status")
A("- Every case and recipe: UNVERIFIED — no build of this epic is available. Source-verified against PRD v3 and the 12 stories on 23 Oct 2026.")
A("")
A("## 11. Open questions (Chris Ward, drafted 23 Oct 2026, NOT sent)")
held = {}
for c in L.CASES:
    m = re.search(r"question (\d+)", c["marker"])
    if m: held.setdefault(int(m.group(1)), []).append(c["key"])
for i, (slug, q, basis, opts, holds) in enumerate(QUESTIONS, 1):
    A(f"- Q{i}: {q} — held cases: {', '.join(held.get(i, [])) or 'none'}")
_out = "\n".join(Lines) + "\n"
# Rule 117 fifteenth amendment (26 Oct 2026): the setup file never carries the "mark this test Blocked" line or a variant
if re.search(r"mark this test Blocked|If you cannot set up any of the above|If any record above is missing", _out, re.I):
    raise SystemExit("setup file would carry a 'mark this test Blocked' line: refused")
open(f"{L.P}/CREDIT-TERMS-SETUP-FILE.md", "w").write(_out)
print("setup file:", len(Lines), "lines")
