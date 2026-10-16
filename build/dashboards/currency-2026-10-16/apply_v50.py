#!/usr/bin/env python3
"""Dashboard, 16 Oct 2026 (QA lead: "1. Yes 2. YES 3. YES ... add that to the test run too"). Apply PRD v50 / PO answer 18:
  C351714  Sales by Customer at zero reads "Top: None"; At Risk at zero reads "$0.00 (12mo) · 0 customers" (S5-R3 v49, S5-R9)
  C88604   S4-R3 quote refreshed to v50; plain result names the missing Other share
  C88636   S4-R3 quote refreshed; the "spec does not say which side shop supplies fall on" Blocked line replaced
  NEW      Revenue tile shows shop supplies as an Other share (two-audience shape, Rule 117 ninth amendment), section 12180
then add the new case to run 525 (union only) and read everything back.
  python3 apply_v50.py           dry run: build and check only
  python3 apply_v50.py --apply   write (edit lock: live updated_on must equal the 16 Oct snapshot)"""
import sys, os, re, json, html
D = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(f"{D}/../../..")
sys.path.insert(0, f"{D}/../currency-2026-10-14/apply"); from trlib import api, LAST
PRD = open(f"{D}/CONFLUENCE-788430850-v50-2026-10-16.md").read()
def ws(s): return re.sub(r"\s+", " ", html.unescape(s).replace("**", "").replace("\\", "")).strip()
PRDW = ws(PRD)
SNAP = lambda i: json.load(open(f"{D}/snapshots-live/C{i}.json"))
SETUP_URL = ("https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/dashboards/setup/"
             "DASHBOARD-SETUP-FILE.md")
PRDV50 = "Dashboard v1 PRD, Confluence 788430850 v50 (16 Oct 2026, Chris Ward), read 16 Oct 2026"
SHEET = "https://docs.google.com/spreadsheets/d/10Bgu1k2Dzxd2kAvIlEBVWSDIIs00G55VgFoImMU9SjY/edit"
CHANGED = ", before the expected results changed on 16 Oct 2026; the changed results have not yet been checked against a build."
e = lambda s: html.escape(s, quote=False)
def code(c):
    m = re.search(r"^\s*-\s+\*\*" + re.escape(c) + r"(?: \([^)]*\))?:\*\*\s*(.*)$", PRD, re.M); return m.group(1).replace("**", "").strip()
Q = {c: code(c) for c in ("S4-R3", "S5-R3", "S5-R9", "S10-R1")}
Q["S3-R2 Revenue"] = "Revenue | Sum of invoice subtotals in the selected range, before any discount and before tax, minus credit memos. Shown to the cent. | Sales report"
problems = []
def li_quote(label, q): return f"<li><strong>{e(label)}:</strong> &ldquo;{e(q)}&rdquo;</li>"
def rep(s, old, new, k):
    if s.count(old) != 1: problems.append(f"{k}: expected 1 match, found {s.count(old)}: {old[:70]}"); return s
    return s.replace(old, new)

# ---------- C351714
c = SNAP(351714); x = c["custom_expected"]
x = rep(x, '<li>Step 2: The supporting lines do not change because of the outline (the approved design shows "$0.00 (12mo) · 0 customers" '
           'on At Risk and no line on Sales by Customer). Write down what you see.</li>',
        '<li>Step 2: The line under Sales by Customer reads "Top: None" and the line under At Risk Customers reads "$0.00 (12mo) · 0 '
        'customers". Neither line disappears because of the outline.</li>', "C351714")
# keep the results in step order: both Step 2 lines first, then Step 3
m = re.search(r"(<li>Step 3: .*?</li>)(<li>Step 2: The line under .*?</li>)", x)
if m: x = x.replace(m.group(0), m.group(2) + m.group(1))
else: problems.append("C351714: could not reorder Step 2 / Step 3")
x = rep(x, "Dashboard v1 PRD, Confluence 788430850 v42, read 7 Oct 2026, Story 5 (S5-R16), which applies Story 4's S4-R12 to S4-R18, S4-E2 and S4-E3.",
        f"{PRDV50}, Story 5 (S5-R16, S5-R3, S5-R9), which applies Story 4's S4-R12 to S4-R18, S4-E2 and S4-E3. Product owner answers: "
        f"Chris Ward, Dashboard question sheet ({SHEET}), answer 9 (14 Oct 2026) and answer 18 (16 Oct 2026).", "C351714")
x = rep(x, "Design canvas boards 15_Empty_Design and 15_Empty_Now (row 15).</p>",
        "Design canvas boards 15_Empty_Design and 15_Empty_Now (row 15).</p><p>The design's row 15 (re-shared 14 Oct 2026) shows no line "
        "under Sales by Customer when it reads 0 customers. Chris Ward's answer 18 (16 Oct 2026, question sheet above) and the PRD from "
        "version 49 (S5-R3) say the line reads “Top: None”. This case follows the later decision, which we take as prevailing.</p>", "C351714")
x = rep(x, "</li></ul><p>Last checked against build v26.40.8-754bd3a on 10/13/2026.</p>",
        "</li>" + li_quote("S5-R3", Q["S5-R3"]) + li_quote("S5-R9", Q["S5-R9"]) +
        "</ul><p>Last checked against build v26.40.8-754bd3a on 10/13/2026" + CHANGED + "</p>", "C351714")
EDIT = {351714: {"custom_expected": x}}

# ---------- C88604
c = SNAP(88604); x = c["custom_expected"]
x = rep(x, '<li>Revenue\'s supporting line reads "Parts 41% · Labor 59%", whole numbers with no decimals (210 ÷ 510 = 41.2%, so 41%; 300 ÷ 510 = 58.8%, so 59%).</li>',
        '<li>Revenue\'s supporting line reads "Parts 41% · Labor 59%", whole numbers with no decimals that add up to 100 (210 ÷ 510 = 41.2%, so 41%; '
        '300 ÷ 510 = 58.8%, so 59%). There is no "Other" share, because these invoices have no shop supplies or fees.</li>', "C88604")
x = rep(x, "Dashboard v1 PRD, Confluence 788430850 v42, read 7 Oct 2026, Story 4.", f"{PRDV50}, Story 4.", "C88604")
x = rep(x, "<li><strong>S4-R3:</strong> &ldquo;The Revenue tile shows a supporting line reading \"Parts {parts}% · Labor {labor}%\", each percent shown as a whole number.&rdquo;</li>",
        li_quote("S4-R3", Q["S4-R3"]), "C88604")
x = rep(x, "<p>Last checked against build v26.39.1-09be696 on 10/2/2026.</p>", "<p>Last checked against build v26.39.1-09be696 on 10/2/2026" + CHANGED + "</p>", "C88604")
EDIT[88604] = {"custom_expected": x}

# ---------- C88636
c = SNAP(88636); x = c["custom_expected"]
x = rep(x, '<li>Step 5: After the invoice: the line reads "Parts 33% · Labor 67%", each a whole number (33.33 rounds to 33, 66.67 rounds to 67), and the two add up to 100.</li>',
        '<li>Step 5: After the invoice: the line reads "Parts 33% · Labor 67%", each a whole number (33.33 rounds to 33, 66.67 rounds to 67), and the two add up to 100. '
        'There is no "Other" share, because the invoice has no shop supplies or fees.</li>', "C88636")
x = rep(x, "<li>Steps 3, 4 and 5: If the invoice carried shop supplies and your percentages differ only because of them, mark the case Blocked and write all three amounts in the comment: the specification does not say which side shop supplies fall on.</li>",
        '<li>Step 3: If the invoice shows shop supplies or a fee, the customer\'s Default Shop Supplies is not 0: mark this test Blocked: "setup not done" '
        "and write the amounts in the comment.</li>", "C88636")
x = rep(x, "Dashboard v1 PRD, Confluence 788430850 v48, read 14 Oct 2026,", f"{PRDV50},", "C88636")
x = rep(x, "<li><strong>S4-R3:</strong> &ldquo;The Revenue tile shows a supporting line reading \"Parts {parts}% · Labor {labor}%\", each percent shown as a whole number.&rdquo;</li>",
        li_quote("S4-R3", Q["S4-R3"]), "C88636")
x = rep(x, "<p>Last checked against build v26.39.1-09be696 on 10/2/2026.</p>", "<p>Last checked against build v26.39.1-09be696 on 10/2/2026" + CHANGED + "</p>", "C88636")
EDIT[88636] = {"custom_expected": x}

# ---------- NEW case (two-audience shape)
TITLE = "Revenue tile shows shop supplies as an Other share"
def new_fields(cid):
    n = f"C{cid}"
    pre = [("You are signed in as an Admin (the Admin role has every permission, including Reports).", None),
           ('You are in location {Location-A}, where nothing else is invoiced, credited or clocked this week. On the Dashboard, the Revenue tile on This Week reads $0.00 with "0 Invoices".',
            f"For example: {{Location-A}} is ZZAUTOTEST {n} Other Shop."),
           ("Customer {Customer-A} has one asset, {Unit-A}.", f"For example: {{Customer-A}} is ZZAUTOTEST {n} Other Fleet and {{Unit-A}} is ZZ-{n}-1."),
           ("Work order {Work-order-1} for {Customer-A} and {Unit-A} is reviewed and not invoiced. It has one approved labor line, {Line-1}, of 3.00 hours at $100.00 an hour, one part, {Part-A}, with Sell Price $100.00, and shop supplies of 10% of labor.",
            f"For example: {{Work-order-1}} is S2-15500, {{Line-1}} is ZZAUTOTEST {n} Line 1 and {{Part-A}} is ZZAUTOTEST-{n}-P1."),
           ("Starting screen: the Dashboard at {Location-A}.", None),
           ('If any record above is missing, mark this test Blocked: "setup not done".', None)]
    steps = ["Click Work Orders in the top menu and open {Work-order-1}.",
             "Click the Finance tab and click Create Invoice.",
             "Close the New Customer Payment dialog without paying.",
             "On the invoice, read the Labor, Parts, Shop Supplies and Subtotal amounts.",
             "Click Dashboard in the top menu and set the Revenue tile's date range to This Week.",
             "Read the Revenue headline.",
             "Read the line under the Revenue headline.",
             "Click the report arrow beside the Revenue tile's name.",
             "In the Sales report, read the Labor column figure for this range."]
    res = ["Step 1: {Work-order-1} opens.",
           "Step 2: The invoice is created and the New Customer Payment dialog opens.",
           "Step 3: The dialog closes and the invoice stays unpaid.",
           "Step 4: The invoice shows Labor $300.00, Parts $100.00, Shop Supplies $30.00 and Subtotal $430.00 (for example). Write the four amounts down.",
           "Step 5: The Revenue tile shows This Week.",
           "Step 6: Revenue reads the invoice Subtotal, to the cent (for example $430.00).",
           'Step 7: The line reads "Parts 23% · Labor 70% · Other 7%" (for example). Parts = 100 ÷ 430 = 23.3%, so 23. Labor = 300 ÷ 430 = 69.8%, so 70. '
           "Other = the shop supplies, 30 ÷ 430 = 7.0%, so 7. Each is a whole number, the three add up to 100, and the shop supplies are not counted in Labor.",
           "Step 8: The Sales report opens on the same dates (This Week).",
           "Step 9: The Labor column shows the invoice's labor only (for example $300.00), the same labor figure the tile's Labor share is worked out from."]
    source = (f"Epic SV-490; story SV-9576 (Story 4, KPI Hero Tiles), story SV-9575 (Story 3, Measure Formulas), story SV-9582 (Story 10, Report Drill-In); "
              f"{PRDV50}, S4-R3 (reworded in v50 after Ayesha Khan's question of 16 Oct 2026, Chris Ward's ruling in the PRD Change Log), "
              "S3-R2 table (Revenue row), S10-R1. Source-verified 16 October 2026. Not yet checked against a build.")
    quotes = [("S3-R2 table: Revenue", Q["S3-R2 Revenue"]), ("S4-R3", Q["S4-R3"]), ("S10-R1", Q["S10-R1"])]
    pre_html = (f'<p><strong><a href="{SETUP_URL}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
                "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in pre) + "</ul>")
    exp_html = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in res) + "</ul>"
                + f"<p><strong>Source &mdash; where this behaviour comes from</strong><br>{e(source)}</p>"
                + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p><ul>" + "".join(li_quote(l, q) for l, q in quotes) + "</ul>"
                + "<p>AUTOMATION: HOLD - not yet build-verified</p>")
    f = {"title": TITLE, "section_id": 12180, "template_id": 1, "type_id": 7, "priority_id": 2, "custom_automation_type": 2, "custom_atmstatus": 1,
         "custom_preconds": pre_html, "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in steps) + "</ol>", "custom_expected": exp_html}
    # checks
    if len(TITLE) > 80 or ";" in TITLE: problems.append("NEW: title")
    if len(res) != len(steps): problems.append("NEW: results vs steps")
    for i, r in enumerate(res, 1):
        if not r.startswith(f"Step {i}: "): problems.append(f"NEW: result {i}")
    defined = set(re.findall(r"\{([^{}]+)\}", " ".join(a for a, _ in pre)))
    for p in set(re.findall(r"\{([A-Z][^{}]+)\}", " ".join(steps + res))):
        if p not in defined: problems.append(f"NEW: {{{p}}} not defined")
    if re.search(r"ZZAUTOTEST", " ".join([a for a, _ in pre] + steps + res)): problems.append("NEW: hard-coded record in tester text")
    return f, quotes

# ---------- quote gate: every quote in every touched case verbatim in PRD v50
def quotes_in(h): return re.findall(r"<li><strong>([^<]+):</strong> &ldquo;(.*?)&rdquo;</li>", h)
for cid, f in EDIT.items():
    for l, q in quotes_in(f["custom_expected"]):
        if ws(q) not in PRDW: problems.append(f"C{cid}: quote {l} not verbatim in PRD v50")
    if f["custom_expected"].count("AUTOMATION:") != 1 or not re.search(r"<p>AUTOMATION: [^<]+</p>$", f["custom_expected"]): problems.append(f"C{cid}: marker not last")
nf, nq = new_fields("NEWID")
for l, q in nq:
    if ws(q) not in PRDW: problems.append(f"NEW: quote {l} not verbatim in PRD v50")
for p in problems: print("PROBLEM", p)
if problems: sys.exit(1)
os.makedirs(f"{D}/applied", exist_ok=True)
json.dump({"edits": {f"C{k}": v for k, v in EDIT.items()}, "new": nf}, open(f"{D}/applied/proposals.json", "w"), indent=1, ensure_ascii=False)
print("checks OK: 3 edits + 1 new; quotes verbatim in PRD v50")
if "--apply" not in sys.argv: sys.exit(0)

log = open(f"{D}/applied/apply-log.jsonl", "a")
def L(r): log.write(json.dumps(r) + "\n"); log.flush(); print(r)
for cid, f in EDIT.items():
    live = api(f"get_case/{cid}")
    if live["updated_on"] != SNAP(cid)["updated_on"]: L({"op": "refused_edit_lock", "case": f"C{cid}"}); continue
    json.dump(live, open(f"{D}/applied/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    api(f"update_case/{cid}", f); st = LAST["status"]; a = api(f"get_case/{cid}")
    json.dump(a, open(f"{D}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    un = [k for k in a if k not in f and k not in ("updated_on", "updated_by", "version") and a.get(k) != live.get(k)]
    L({"op": "update_case", "case": f"C{cid}", "http": st, "fields_ok": all(a.get(k) == v for k, v in f.items()), "untouched_changed": un,
       "atm_kept": a.get("custom_atmstatus") == live.get("custom_atmstatus")})
# new case: create, then write the final text with its own number
created = api("add_case/12180", {k: v for k, v in nf.items() if k != "section_id"}); nid = created["id"]; L({"op": "add_case", "case": f"C{nid}", "http": LAST["status"]})
json.dump({"new_case": nid}, open(f"{D}/applied/new-case-id.json", "w"))
nf2, _ = new_fields(nid)
api(f"update_case/{nid}", {k: v for k, v in nf2.items() if k != "section_id"}); st = LAST["status"]; a = api(f"get_case/{nid}")
json.dump(a, open(f"{D}/applied/C{nid}-after.json", "w"), indent=1, ensure_ascii=False)
L({"op": "update_case(new, own number)", "case": f"C{nid}", "http": st, "fields_ok": all(a.get(k) == v for k, v in nf2.items() if k != "section_id"),
   "section_ok": a["section_id"] == 12180})
