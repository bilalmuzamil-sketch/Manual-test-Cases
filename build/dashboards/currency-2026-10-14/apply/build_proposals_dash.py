#!/usr/bin/env python3
"""Builds proposals-dash.json for the QA lead's authorised Dashboard write of 14 Oct 2026 (group 12166, run 525):
 - 6 behaviour-change edits (followup-rows.json "update" rows C351723, C351734, C88606, C88647, C351729; C88632 from
   notify/sheet-data.json "update" + the followup "corrections" rows), each rewritten in full to the Rule 117 layout (Rule 41/122);
 - 17 new tests (sheet-data.json "new" 3 + followup-rows.json "new" 14, with the "corrections" dates applied).
Tester text is written here. EVERY quote is copied by code from the saved PRD v46 (anchor-quotes-current.json, built by
apply_dash.py --anchors, or a regex over the saved page), the saved release notes or the saved tech plan; never typed.
Run from the repo root:  python3 build/dashboards/currency-2026-10-14/apply/build_proposals_dash.py"""
import json, re
H = "build/dashboards/currency-2026-10-14/apply"
ANCH = json.load(open(f"{H}/anchor-quotes-current.json"))
def ws(s): return re.sub(r"\s+", " ", s.replace("**", "").replace("\\", "")).strip()
PRDW = ws(open("build/dashboards/currency-2026-10-14/CONFLUENCE-788430850-v48-2026-10-14c.md").read())
TPW = ws(open("build/dashboards/sources/Dashboard-v1-Technical-Implementation-Plan.md").read())
RNW = ws(open("build/dashboards/currency-2026-10-14/RELEASE-NOTES-DASHBOARD-2026-10-14b.md").read())
def q(code): return [code, ANCH[code]]
def grab(text, pat, label):
    m = re.search(pat, text); assert m, label; return [label, m.group(0)]
Q_E2_SALES = grab(PRDW, r"That is a defect in the Sales report rather than a dashboard decision.*?so it ships with a release note\.", "S3-E2 context note (Sales report)")
Q_E2_SAA = grab(PRDW, r"Service Advisor Analysis is a direct copy of the Sales report's invoice query.*?under the same release note\.", "S3-E2 context note (Service Advisor Analysis)")
Q_SEC7 = grab(PRDW, r"The dashboard is read-only\. It shows no toasts.*?\(S8-N1, S8-N1a\)\.", "Section 7 (User Feedback Summary)")
Q_E1_CTX = grab(PRDW, r"with S10-R7 in place, every tile preset exists in every linked report, so S10-E1 is reached only if a report's date list changes later\.", "Context note (Story 10, when the Custom fallback is reached)")
Q_REV_ROW = grab(PRDW, r"Sum of invoice subtotals in the selected range, before any discount and before tax, minus credit memos\. Shown to the cent\.", "S3-R2 (Revenue row of the measure table)")
Q_NFR010 = grab(TPW, r"Both report corrections ship with one plain-language release note:.*?where a figure can move \*up\*", "Tech plan NFR-010")
Q_RN = grab(RNW, r"Sales report totals can change for some past dates\..*?Expect questions about this\.", "Release notes, Dashboard, Worth knowing (Confluence 931069964 v7 and 928121200 v6, 14 Oct 2026)")

PRD = "Dashboard v1 PRD, Confluence 788430850, version 48 (14 Oct 2026, 17:09 UTC, Chris Ward)"
V45 = "added in version 45 on 14 Oct 2026 (15:06 UTC) by Chris Ward"
CL14 = "the spec's change log (version 46) lists it under 2026-10-14"
def ans(n): return f"from Chris Ward's answer {n} of 14 Oct 2026 to our question sheet"
NOTYET = "Source-verified 14 October 2026. Not yet checked against a build."
def prev(stamp): return ("Source-verified 14 October 2026. This version of the case has not yet been checked against a build" +
                         (f" (the previous version was last checked against build {stamp})." if stamp else "."))
MARKER_NEW = "AUTOMATION: HOLD - not yet build-verified"
STAMP_813 = "Last checked against build v26.40.8-754bd3a on 10/13/2026."

# ---------- shared tester sentences ----------
def signed(loc_ex="Staging Heavy Duty - 9919", extra=""):
    return ("You are signed in as {User-A} (for example Admin ShopView), whose role has the Reports permission" + extra +
            f", at location {{Location-A}} (for example {loc_ex}).")
DESK = "Your browser window is at least 1024 pixels wide at 100% zoom (a maximised laptop or desktop window)."
SCREEN1536 = ("Your screen is 1536 x 864 at 100% browser zoom, with the browser window maximised (for example a 1920 x 1080 laptop "
              "with the computer's display scaling set to 125%).")
SAMEBROWSER = "You use the same browser throughout, not a private window (the dashboard keeps these choices in this browser only)."
def techs(when="this month", chart="Technician Efficiency and Technician Utilization charts"):
    return (f"Technicians {{Technician-A}} and {{Technician-B}} (for example ZZAUTOTEST Tech One and ZZAUTOTEST Tech Two) have clocked "
            f"time at {{Location-A}} {when}, so both are listed in the {chart}.")
def advisors(when="this month"):
    return (f"Service advisors {{Advisor-A}} and {{Advisor-B}} (for example Admin ShopView and ZZAUTOTEST Advisor Two) have invoiced "
            f"work with clocked time at {{Location-A}} {when}, so both are listed in the Billing Efficiency chart.")

# ---------- shared doc (Part 1) lines ----------
P1_SIGN = ("Sign in as an Admin user: on the QA site's sign-in page, in the DEV MODE - QUICK LOGIN panel, click Admin (you appear as "
           "Admin ShopView). This is {User-A}. To use another role instead, check it has Reports: your initials (top right) > Settings > "
           "Roles & Permissions > edit icon on the role > Reports is switched on.")
P1_LOC = ("Pick the location: click your initials (top right, beside the current location name) > under Change Location click the orange "
          "button showing the current location > pick the location. On the QA site start with Staging Heavy Duty - 9919. This is {Location-A}; "
          "use it for the whole case.")
def P1_NEWLOC(ex):
    return ("Create a fresh location for this run, with a new name each time (for example " + ex + "): your initials (top right) > Settings > "
            "Locations > New Location: Name, Address 1, City, State/Province, ZIP/Postal Code, Timezone, Telephone, Shop Supplies Charge 0 > "
            "Save & Close. Switch to it: your initials > Change Location > pick it. This is {Location-A}. Nothing else is invoiced or clocked there.")
P1_DESK = "Use a desktop browser window at least 1024 pixels wide at 100% zoom."
P1_RATE = ("While in {Location-A}, add a labor rate (rates belong to each location): your initials > Settings > Labor Rates > New Labor Rate: "
           "Name (for example ZZAUTOTEST Rate 100), Rate 100 > Save & Close.")
def P1_CUST(ex, ph="Customer-A"):
    return (f'Customers > New Customer > Name (for example "{ex}") > Save. On its Contacts tab click New Contact, enter a First Name and Last '
            "Name > Save. On its Assets tab click New Asset, pick the contact and fill Year, Make and Unit (for example 2022, Freightliner, "
            f"ZZ-101) > Save. This is {{{ph}}}; use it for this case only.")
P1_INVOICE = ("Work Orders > Create Work Order > in the New Work Order window pick {Customer-A} and its asset > Save (if a Confirmation says the "
              "customer is over their credit limit, click Create). In the New Line window: What Are You Doing? (for example \"ZZAUTOTEST Line 1\"), "
              "Add Technician (yourself), Labor Rate (the $100 rate of this location), Estimated Time and Tech Time (for example 1.00), tick Line "
              "Approved > Save & Close. On the line's Labor row click Start, wait a minute, then Stop > Clock Out. On the line click Story > type a "
              "short story > Update. Click Complete (if a Missing Details window asks for Mileage, enter one > Complete All Lines), then Mark "
              "Reviewed. Finance tab > Create Invoice, and close the New Customer Payment window without paying.")
P1_TECHS_CHECK = ("Check the technicians: Reports > Technician Utilization (Date: This month) lists at least two technicians with clocked hours. "
                  "Write two of their names down as {Technician-A} and {Technician-B}. If fewer than two are listed, try another location in the list. "
                  "To add your own instead: your initials > Settings > Staff > New Staff Member: First Name and Last Name (for example ZZAUTOTEST Tech "
                  "One), an Email you can open, Role Technician, Department Service, Location {Location-A}, Time Clock on > Save & Close; accept the "
                  "invitation email and set a password; then, signed in as that technician in a private window, open a work order line assigned to "
                  "them and click Start, wait a minute, then Stop > Clock Out. Repeat for a second technician.")
P1_ADV_CHECK = ("Check the advisors: Reports > Advisor Analysis (Date: This month, no advisor chosen) lists at least two advisors. Write two of their "
                "names down as {Advisor-A} and {Advisor-B}. If fewer than two are listed, create an invoiced work order (as in the recipe above) and "
                "pick a different Service Advisor in the work order's left panel before you invoice it.")
def CHECK(text): return "Check the setup worked: " + text

# ---------- shared doc (Part 2) lines ----------
P2_SCREEN = ("Prepare the data on screen exactly as Part 1. No API recipe for this case's data has been proven on the Dashboard QA site "
             "(UNVERIFIED); if you try one, confirm the result on screen with Part 1's check before step 1.")
P2_HIST = ("This case reads history (earlier days or months). Invoices and clocked time cannot be back-dated by hand, so use a location that "
           "already holds it, prove it with Part 1's check and record the location and the real values in the case's verification folder.")
P2_EVID = "Evidence: a screenshot after each step that has an expected result, the build marker, and the real value of every brace name."
P2_FILTER = ("Technician and advisor filter choices, the expanded tile and the At Risk window are kept in the browser (local storage), per "
             "browser and device; clear them only when the case says so.")

PROPOSALS = {"updates": [], "new": [], "retire": [], "anchors_covered": {}, "notes": []}
def cover(key, codes):
    for a in codes: PROPOSALS["anchors_covered"].setdefault(a, []).append(key)

# =====================================================================================================================
# EDIT 1 — C88632 (NF 12179): step about the release note now checks the CURRENT published note (sheet-data.json update row
# C88632 + followup "corrections" rows for C88632); whole case rewritten to the 8 Oct layout.
# =====================================================================================================================
PROPOSALS["updates"].append({
 "case_id": 88632,
 "title": "Sales and Advisor Analysis reports drop a voided invoice and keep its re-invoice",
 "preconditions": [
  "You are signed in as {User-A} (for example Admin ShopView), whose role has the Reports permission and can create and invoice work orders.",
  "Location {Location-A} (for example ZZAUTOTEST Quiet 14 Oct A) is a fresh location made for this run: nothing else is invoiced, credited or "
  "clocked there, so on the Dashboard the Revenue tile on This Week reads $0.00 with 0 Invoices.",
  "Labor rate {Rate-A} (for example ZZAUTOTEST Rate 100) charges $100.00 an hour at {Location-A}.",
  "Customer {Customer-A} (for example ZZAUTOTEST C88632 Void Reinvoice) has one contact and one asset (for example unit ZZ-101).",
  "{User-A} has Time Clock on and is the technician on the work.",
  "Work order {Work-order-1} (for example S490-1201) for {Customer-A} is invoiced, not sent and not paid, and its Service Advisor is {User-A}.",
  "{Work-order-1} has one labor line, {Line-1} (for example \"ZZAUTOTEST Line 1\"), with technician {User-A}, labor rate {Rate-A}, Estimated "
  "Time 2.00 and Tech Time 2.00, and exactly 2.00 hours clocked on it.",
  "You have written down the invoice's Subtotal (for example $200.00).",
  "You run the whole case on one day, and not on the last evening of the week, so every record stays inside This Week.",
  "You can open the release notes page on Confluence (https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=931069964).",
 ],
 "steps": [
  "Click Reports in the top menu, then Sales in the left menu.",
  "Set the Date control to This week.",
  "Write down the row for {Work-order-1}'s invoice and the Subtotal in the Totals row.",
  "Click Advisor Analysis in the left menu (the page is titled Service Advisor Analysis) and set the Date control to This week, with no advisor chosen.",
  "Write down the invoice's row: Hrs Worked, Hrs Invoiced, Billing Efficiency, ELR and Subtotal.",
  "Click Work Orders in the top menu and open {Work-order-1}.",
  "On the Lines tab click New Line and add a second line: What Are You Doing? (for example \"ZZAUTOTEST Line 2\"), Add Technician {User-A}, "
  "Labor Rate {Rate-A}, Estimated Time 1.00, Tech Time 1.00, tick Line Approved, then click Save & Close.",
  "On the new line click Story, type a short story and click Update.",
  "Click Complete on the new line (if a window offers Complete All Lines or asks for Mileage, finish it there), then click Mark Reviewed.",
  "Click the Finance tab and write down how it shows the first invoice.",
  "Click Create Invoice, close the New Customer Payment window without paying, and write down the new Subtotal.",
  "Open Reports > Sales again (Date: This week) and write down the rows and the Totals row Subtotal.",
  "Open Reports > Advisor Analysis again (Date: This week, no advisor chosen) and write down the rows and the Totals row.",
  "Click Parts > Part Sales > New Part Sale and try to invoice the sale without choosing a customer. If the screen insists on a customer, stop this step.",
  "Open the release notes page and find the Dashboard note that starts \"Sales report totals can change\".",
 ],
 "results": [
  "Steps 3 and 5: Before the void, the Sales report lists the invoice and its Totals row Subtotal is the amount you wrote down (for example "
  "$200.00). Advisor Analysis shows Hrs Worked 2.00, Hrs Invoiced 2.00 and Billing Efficiency 100.00% (2.00 / 2.00 x 100).",
  "Steps 10 and 11: Write down how the Finance tab marks the first invoice (for example a Void label) and the new Subtotal (for example $300.00 = "
  "$200.00 + 1.00 hour x $100.00). These two readings are records, not pass or fail points.",
  "Step 12: The Sales report lists only the new invoice: the voided invoice is gone, and the Totals row Subtotal equals the new Subtotal (for "
  "example $300.00), not the two added together (for example $500.00 = $200.00 + $300.00).",
  "Step 13: Advisor Analysis shows one row for {Work-order-1}, the new invoice, with Hrs Invoiced 3.00 (2.00 + 1.00) and the new Subtotal (for "
  "example $300.00). Hrs Worked stays 2.00, so Billing Efficiency reads 150.00% (3.00 / 2.00 x 100). The figures moved up: this is the "
  "void-then-reinvoice case.",
  "Step 14: If you could invoice a sale with no customer, it appears in the Sales report total and in Advisor Analysis. If the screen insisted on "
  "a customer, write \"no-customer invoice not reachable by hand\" in the result comment.",
  "Step 15: The note says Sales report totals can change for some past dates: voided invoices are no longer counted, which lowers a total; invoices "
  "with no customer attached are now included, which raises one; and a voided invoice that was invoiced again counts only the new amount. It also "
  "says the Service Advisor Analysis report changes the same way and walk-in sales now count toward advisor figures. This checks the published "
  "notes, not the product screens.",
 ],
 "source": ("Epic SV-490; story SV-9575 (Story 3, Measure Formulas and Report Parity); " + PRD + ", S3-E2 and its context notes (unchanged since "
            "version 42); read 14 Oct 2026. Release notes, Confluence 931069964 (version 7) and 928121200 (version 6), Dashboard \"Worth "
            "knowing\" note, changed on 14 Oct 2026 (15:07 UTC) by Chris Ward in answer to our question 2 of 14 Oct 2026; read 14 Oct 2026. "
            "Dashboard v1 Technical Implementation Plan (16 Sep 2026), NFR-010; it informs and never overrules the PRD. The note first published "
            "on 9 Oct 2026 said totals \"can drop\"; the note as changed on 14 Oct 2026 says they \"can change\", and we take the later note as "
            "prevailing. " + prev("v26.39.1-09be696 on 10/2/2026")),
 "quotes": [q("S3-E2"), Q_E2_SALES, Q_E2_SAA, Q_NFR010, Q_RN],
 "stamp": "Last checked against build v26.39.1-09be696 on 10/2/2026.",
 "marker": "AUTOMATION: READY",
 "doc_part1": [
  P1_SIGN,
  P1_NEWLOC("ZZAUTOTEST Quiet 14 Oct A"),
  P1_RATE + " This is {Rate-A}.",
  P1_CUST("ZZAUTOTEST C88632 Void Reinvoice"),
  "Check that {User-A} has Time Clock on: your initials > Settings > Staff > your own row > edit > Time Clock is on. In a fresh location you are "
  "the technician offered in Add Technician, and you clock time yourself.",
  "Work Orders > Create Work Order > pick {Customer-A} and its asset > Save. In the left panel set Service Advisor to {User-A} (your own name, "
  "usually already shown). In the New Line window: What Are You Doing? (for example \"ZZAUTOTEST Line 1\"), Add Technician {User-A}, Labor Rate "
  "{Rate-A}, Estimated Time 2, Tech Time 2, tick Line Approved > Save & Close. This is {Work-order-1} with {Line-1}; write down its number.",
  "On {Line-1}'s Labor row click Start, then Stop > Clock Out. Make the clocked time exactly 2.00 hours: three dots at the top right of the Lines "
  "tab > Timesheets (1) > edit the record (if it cannot be edited there or in Reports > Timesheet Activities, keep the real time and use the hours "
  "Timesheet Activities shows in every sum).",
  "On {Line-1} click Story > type a short story > Update. Click Complete (if a Missing Details window asks for Mileage, enter one > Complete All "
  "Lines), then Mark Reviewed.",
  "Finance tab > Create Invoice. Close the New Customer Payment window without paying; do not send or pay the invoice. Write down the Subtotal "
  "shown on the Finance tab.",
  CHECK("on the Dashboard the Revenue tile on This Week reads the Subtotal you wrote down (for example $200.00), and Reports > Sales (Date: This "
        "week) lists exactly one invoice, {Work-order-1}'s. Run the steps on the same day."),
 ],
 "doc_part2": [
  "Goal: a fresh location {Location-A} holding exactly one invoiced, unpaid, unsent work order {Work-order-1} with 2.00 hours clocked and billed "
  "at $100.00 an hour; then the void (adding a line to that unpaid, unsent invoice), the re-invoice and the release-note check.",
  P2_SCREEN,
  "Trap (tech plan section 7): Reverse on an invoice deletes it rather than voiding it. Do not use Reverse; the void comes from adding a line "
  "while the invoice is unpaid and unsent (step 7).",
  "Step 15: open https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=931069964 (Release Notes (Combined)), find the Dashboard "
  "section's \"Worth knowing\" list and compare the note with the expected result word for word. The pre-release and release-day email copy on "
  "the same page still says totals will be \"lower\"; step 15 does not check the email copy.",
  "UNVERIFIED on the Dashboard QA site: whether Part Sales lets a sale be invoiced with no customer (step 14). Record what the screen does.",
  P2_EVID,
 ],
 "change_summary": ("Rewritten in full to the 8 Oct layout (setup doc link, Preconditions with {placeholders} and examples, setup moved to the "
                    "doc). Step 14 (now 15) checks the release note as published and changed on 14 Oct 2026: totals \"can change\", voids lower, "
                    "no-customer invoices raise, a re-invoiced void counts only the new amount; the release note is quoted. Old step 8 split "
                    "into steps 8 and 9. Quotes re-copied from PRD v46 and the tech plan."),
})
cover(88632, ["S3-E2"])

# =====================================================================================================================
# EDIT 2 — C351723 (S9 12175): legend hover shows the latest value and month, no average (S9-R10, v45).
# =====================================================================================================================
LEG_PRE = [signed(), DESK, techs("in the last twelve months", "Technician Efficiency and Technician Utilization chart legends on Last 12 Months"),
           advisors("in the last twelve months").replace("listed in the Billing Efficiency chart", "listed in the Billing Efficiency chart legend on Last 12 Months")]
LEG_P1 = [P1_SIGN, P1_LOC, P1_DESK,
          "Check the names: on the Dashboard set Technician Efficiency to Last 12 Months, click View details and open the Technician filter: it "
          "lists at least two names. Write two down as {Technician-A} and {Technician-B}. Set Billing Efficiency to Last 12 Months, click View "
          "details and open the Advisor filter: it lists at least two names. Write two down as {Advisor-A} and {Advisor-B}. If not, try another "
          "location in the list. The legends read twelve months of history, which cannot be created by hand in one day.",
          CHECK("the Billing Efficiency, Technician Efficiency and Technician Utilization charts on Last 12 Months each show at least two named "
                "lines in their legend, including {Advisor-A} and {Technician-A}.")]
PROPOSALS["updates"].append({
 "case_id": 351723,
 "title": "Hovering a name in a dashboard chart legend shows the latest value and month",
 "preconditions": LEG_PRE,
 "steps": [
  "Click Dashboard in the top bar.",
  "Set the Billing Efficiency pill to Last 12 Months and click View details on Billing Efficiency.",
  "Hover {Advisor-A}'s name in the legend above the chart.",
  "Read the box that appears.",
  "Hover {Advisor-A}'s last point on the chart and read its value and month.",
  "Set the Technician Efficiency pill to Last 12 Months, click View details on Technician Efficiency and hover {Technician-A}'s name in the legend.",
  "Set the Technician Utilization pill to Last 12 Months, click View details on Technician Utilization and hover {Technician-A}'s name in the legend.",
 ],
 "results": [
  "Step 4: The box shows {Advisor-A}'s name, their most recent value and the month it is from (for example 120% and Aug 2026).",
  "Step 4: The box shows no average: no \"avg\" figure and no other figure for the whole range anywhere in it.",
  "Steps 4 and 5: The value and the month in the box match the last point on {Advisor-A}'s line (for example both read 120% for Aug 2026).",
  "Steps 6 and 7: On the Technician Efficiency and Technician Utilization charts the box shows {Technician-A}'s most recent value and its month, "
  "with no average.",
 ],
 "source": ("Epic SV-490; story SV-9581 (Story 9, Chart Behavior); " + PRD + ", S9-R10 (" + V45 + ", from Chris Ward's answer 12 of 14 Oct "
            "2026 to our question sheet; " + CL14 + ") and S9-R4; read 14 Oct 2026. The design canvas "
            "(claude.ai/artifact/Wae9DFQ8PJQBy8mbLsL5ge) boards 05_Billing_Legend, 06_TechEff_Legend and 07_TechUtil_Legend show an average in "
            "the box; PRD version 45 (14 Oct 2026) says the box shows no average, and we take the later PRD as prevailing. " + prev("v26.40.8-754bd3a on 10/13/2026")),
 "quotes": [q("S9-R10"), q("S9-R4")],
 "stamp": STAMP_813,
 "marker": "AUTOMATION: READY",
 "doc_part1": LEG_P1,
 "doc_part2": [
  "Goal: Billing Efficiency, Technician Efficiency and Technician Utilization expanded on Last 12 Months, each with at least two named lines.",
  P2_HIST,
  "Steps 3 to 7: hover the legend name with Playwright and read the box's full text; record it exactly. A pass needs no \"avg\" text in the box "
  "and the value and month equal to the last plotted point (hover the point and read its tooltip).",
  "Context: Chris Ward said on 14 Oct 2026 that the build still shows \" · avg\". That is not a backed expected failure (no ticket exists); judge "
  "only what you see.",
  P2_EVID,
 ],
 "change_summary": ("Title loses \"and average\". Rewritten in full to the 8 Oct layout. The box must show the latest value and month and no "
                    "average (S9-R10, v45); the old step 6 (compare the average with the table) and its result removed; quotes now S9-R10 and "
                    "S9-R4 from v46; Rule 56 sentence on the design boards that show an average."),
})
cover(351723, ["S9-R10", "S9-R4"])

# =====================================================================================================================
# EDIT 3 — C351734 (S11 12177): the same rule on the report pages' charts.
# =====================================================================================================================
PROPOSALS["updates"].append({
 "case_id": 351734,
 "title": "Hovering a name in a report chart legend shows the latest value and month",
 "preconditions": LEG_PRE[:2] + [LEG_PRE[2].replace("chart legends on Last 12 Months", "report chart legends on Last 12 months"),
                                 LEG_PRE[3].replace("Billing Efficiency chart legend on Last 12 Months", "Advisor Analysis report chart legend on Last 12 months"),
  "On the Advisor Analysis, Technician Efficiency and Technician Utilization reports the chart is shown (the chart button beside the filters reads Hide chart)."],
 "steps": [
  "Click Reports in the top bar and click Advisor Analysis in the left menu.",
  "Set the Date control to Last 12 months.",
  "Hover {Advisor-A}'s name in the legend above the chart and read the box that appears.",
  "Hover {Advisor-A}'s last point on the chart and read its value and month.",
  "Click Technician Efficiency in the left menu, set the Date control to Last 12 months and hover {Technician-A}'s name in the legend.",
  "Click Technician Utilization in the left menu, set the Date control to Last 12 months and hover {Technician-A}'s name in the legend.",
 ],
 "results": [
  "Step 3: The box shows {Advisor-A}'s name, their most recent value and the month it is from (for example 120% and Aug 2026).",
  "Step 3: The box shows no average: no \"avg\" figure and no other figure for the whole range anywhere in it.",
  "Steps 3 and 4: The value and the month in the box match the last point on {Advisor-A}'s line.",
  "Steps 5 and 6: On the Technician Efficiency and Technician Utilization report charts the box shows {Technician-A}'s most recent value and its "
  "month (for example 70% and Aug 2026), with no average.",
 ],
 "source": ("Epic SV-490; stories SV-9583 (Story 11, Chart on the Report Page) and SV-9581 (Story 9, Chart Behavior); " + PRD + ", S9-R10 ("
            + V45 + ", from Chris Ward's answer 12 of 14 Oct 2026 to our question sheet; " + CL14 + ") and S11-R7 (the report page shows the "
            "dashboard's own chart); read 14 Oct 2026. The design canvas (claude.ai/artifact/Wae9DFQ8PJQBy8mbLsL5ge) boards 11_saa_Legend, "
            "12_te_Legend and 13_tu_Legend show an average in the box; PRD version 45 (14 Oct 2026) says the box shows no average, and we take "
            "the later PRD as prevailing. " + prev("v26.40.8-754bd3a on 10/13/2026")),
 "quotes": [q("S9-R10"), q("S11-R7")],
 "stamp": STAMP_813,
 "marker": "AUTOMATION: READY",
 "doc_part1": [P1_SIGN, P1_LOC, P1_DESK,
  "Check the names: Reports > Advisor Analysis, Date Last 12 months: the chart legend lists at least two advisors; write two down as {Advisor-A} "
  "and {Advisor-B}. Reports > Technician Efficiency, Date Last 12 months: the legend lists at least two technicians; write two down as "
  "{Technician-A} and {Technician-B}. If not, try another location in the list.",
  "On each of the three reports, if the chart button beside the filters reads Show chart, click it so the chart is shown (each report remembers "
  "this choice).",
  CHECK("each of the three reports shows its chart with at least two named lines in the legend, including {Advisor-A} or {Technician-A}.")],
 "doc_part2": [
  "Goal: the three report charts shown, on Last 12 months, each with at least two named lines.",
  P2_HIST,
  "Steps 3 to 6: hover the legend name with Playwright and read the box's full text; record it exactly. A pass needs no \"avg\" text in the box.",
  "Context: Chris Ward said on 14 Oct 2026 that the build still shows \" · avg\". That is not a backed expected failure (no ticket exists); judge "
  "only what you see.",
  P2_EVID,
 ],
 "change_summary": ("Title loses \"and average\". Rewritten in full to the 8 Oct layout; Date control set to Last 12 months as a step; the box "
                    "must show the latest value and month and no average (S9-R10, v45); the old \"write down the average\" result removed; the "
                    "duplicate S11-R7 quote replaced by S9-R10 + S11-R7 from v46; Rule 56 sentence on the design boards."),
})
cover(351734, ["S9-R10", "S11-R7"])

# =====================================================================================================================
# EDIT 4 — C88606 (S4 12170, AUTOMATED): 731/732-day step removed (S7-R2a: tile calendar max 366 days).
# =====================================================================================================================
def range_step(n): return f"Click the Revenue tile's date pill, pick a start day and an end day in the calendar so the readout at the bottom reads \"Range: {n} days\", and click Apply."
PROPOSALS["updates"].append({
 "case_id": 88606,
 "title": "The small trend line uses days, weeks or months by range length",
 "preconditions": [
  signed(), DESK,
  "{Location-A} has invoices spread over the last twelve months, so the Revenue tile shows an amount above $0.00 on Last 12 Months.",
  "This month, at least two days at {Location-A} have clocked time on invoiced work, with a day between them that has no clocked time at all, "
  "{Day-A} (for example a Sunday).",
 ],
 "steps": [
  "Click Dashboard in the top bar.",
  range_step(31),
  "Count the points (corners) on the Revenue trend line.",
  range_step(32) + " Count the points.",
  range_step(182) + " Count the points.",
  range_step(183) + " Count the points.",
  "Set the Revenue pill to Last 12 Months and click View details on Revenue.",
  "Compare the Revenue trend line's shape with the monthly bars in the Revenue chart.",
  "Set the Billing Efficiency pill to This Month and look at its trend line at {Day-A}.",
 ],
 "results": [
  "Step 3: 31 days draws exactly 31 points, one for every day, including days with no sales: on Revenue a day with no sales is a point at $0, not a gap.",
  "Step 4: 32 days draws one point per week (about 5 points).",
  "Step 5: 182 days still draws one point per week (about 26 points).",
  "Step 6: 183 days draws one point per month (about 7 points).",
  "Steps 7 and 8: On Last 12 Months the trend line has 12 points, and they rise and fall exactly like the 12 monthly bars in the expanded Revenue "
  "chart. No point disagrees with the bar for the same month.",
  "Step 9: At {Day-A} the Billing Efficiency line has a gap: it breaks and resumes. It is not drawn down to zero and the days either side are not "
  "joined across the gap.",
 ],
 "source": ("Epic SV-490; story SV-9576 (Story 4, KPI Hero Tiles), with SV-9579 (Story 7), SV-9578 (Story 6) and SV-9581 (Story 9); " + PRD +
            ", S4-R10 and S4-R11 (unchanged since version 42), S4-R11a (added in version 43 on 9 Oct 2026), S7-R2a, S6-R3a and S9-R9 (" + V45 + "; " + CL14 + "); read 14 Oct 2026. The "
            "731-day and 732-day ranges were removed because a tile's calendar now allows at most 366 days (S7-R2a, Chris Ward's answer 3 of 14 Oct "
            "2026), so the switch to one point per quarter cannot be reached from a tile. Design canvas board 03_Range_After for the date pill, "
            "calendar and \"Range: N days\" readout. " + prev(None)),
 "quotes": [q("S4-R10"), q("S4-R11"), q("S4-R11a"), q("S7-R2a"), q("S6-R3a"), q("S9-R9")],
 "marker": "AUTOMATION: READY",
 "doc_part1": [P1_SIGN, P1_LOC, P1_DESK,
  "Check the invoices: on the Dashboard set the Revenue tile to Last 12 Months: it shows an amount above $0.00. Set it back to This Month.",
  "Check the clocked time: Reports > Timesheet Activities, Date Range This month: at least two days with clocked time, and between them a day "
  "with none. Write that day down as {Day-A}. If no location in the list has such a day this month, write \"no such day this month\" in the "
  "result comment and mark only the step 9 check Blocked.",
  CHECK("Revenue on Last 12 Months is above $0.00 and {Day-A} is written down.")],
 "doc_part2": [
  "Goal: a location with twelve months of invoices and, this month, a day without clocked time between two days with clocked time.",
  P2_HIST,
  "Steps 2 to 6: pick the dates in the calendar on screen and read the \"Range: N days\" readout before Apply; count the points of the trend line "
  "from its drawn path (record how you counted).",
  P2_EVID,
 ],
 "change_summary": ("Title now \"days, weeks or months\" (quarters cannot be reached from a tile any more). Rewritten in full to the 8 Oct layout "
                    "(setup doc link, Preconditions with {placeholders}; the old Setup block and the \"how to set a custom range\" precondition "
                    "moved into the steps and the doc). Old step 4 (731 and 732 days) and its result removed (S7-R2a: at most 366 days); "
                    "preconditions now need one year of invoices, not two; step 3 now expects exactly 31 points, a no-sales day being a point at $0 "
                    "(S4-R11a, v43), so a line that skips no-sales days fails; each step split to one action; every result tied to its step; "
                    "the untied result about fewer than two points removed (covered by C351707); quotes S4-R10, S4-R11 re-copied and S7-R2a, "
                    "S6-R3a, S9-R9 added from v46."),
})
cover(88606, ["S4-R10", "S4-R11", "S4-R11a", "S7-R2a", "S6-R3a", "S9-R9"])

# =====================================================================================================================
# EDIT 5 — C88647 (DATA 12180): same removal, manual twin.
# =====================================================================================================================
def rng(n): return f"pick a start day and an end day so the readout at the bottom reads \"Range: {n} days\" and click Apply"
PROPOSALS["updates"].append({
 "case_id": 88647,
 "title": "Trend line splits the range by day, week or month correctly",
 "preconditions": [
  signed(), DESK,
  "{Location-A} has invoices on most days of the last twelve months, so Revenue has a value in every period.",
  "Day {Day-A} (for example a Sunday this month) has no clocked time at {Location-A}, while the day before and the day after it do.",
  "Day {Day-B} (for example a Saturday) has clocked time at {Location-A}, and the day after it, {Day-C}, has none.",
 ],
 "steps": [
  "Click Dashboard in the top bar.",
  "Click the Revenue tile's date pill, " + rng(31) + ".",
  "Hover along the Revenue trend line, or count its points, and write down how many points there are and the date each shows.",
  "Click the Revenue pill again, " + rng(32) + ", and do the same.",
  "Do the same with a range of 182 days, then with a range of 183 days.",
  "Set a 31-day range again, hover one point and write down its date and value.",
  "Click Reports in the top bar, click Sales, set the Date control to that single day and read the Totals row Subtotal.",
  "Go back to the Dashboard and set the Technician Utilization tile to a custom range from the day before {Day-A} to the day after {Day-A}.",
  "Look at the Technician Utilization trend line around {Day-A}.",
  "Set the Technician Utilization tile to a custom range from {Day-B} to {Day-C} and look at where the trend line would be.",
 ],
 "results": [
  "Steps 3 and 4: 31 days: one point per day (31 points). 32 days: one point per week.",
  "Step 5: 182 days: one point per week. 183 days: one point per month.",
  "Steps 6 and 7: The hovered day's value equals the Sales report's Totals row Subtotal for that day.",
  "Step 9: {Day-A} leaves a gap in the line: the line is not joined across it and does not drop to zero.",
  "Step 10: With only one day that has a value, no line is drawn. In its place the tile shows the empty-chart placeholder: a light grey dashed "
  "outline with rounded corners, no fill and a grey line-chart icon in the middle, the same height as a trend line. The headline still shows its figure.",
  "Steps 3 to 7: If the trend line shows no dates or values when you hover it, count the points instead (zoom the browser in if needed) and write "
  "\"values not checked by hand\" in the result comment for steps 6 and 7.",
 ],
 "source": ("Epic SV-490; story SV-9576 (Story 4, KPI Hero Tiles), with SV-9579 (Story 7) and SV-9575 (Story 3); " + PRD + ", S4-R11, S4-R12, "
            "S4-R15, S4-R16, S4-R18 and S3-R1 (unchanged since version 42) and S7-R2a (" + V45 + "; " + CL14 + "); read 14 Oct 2026. The 731-day "
            "and 732-day ranges were removed because a tile's calendar now allows at most 366 days (S7-R2a, Chris Ward's answer 3 of 14 Oct 2026). "
            "Design canvas board 03_Range_After (calendar, \"Range: N days\" readout, Apply) and row 15 (empty-chart placeholder, approved "
            "7 Oct 2026). " + prev("v26.40.8-754bd3a on 10/13/2026")),
 "quotes": [q("S4-R11"), q("S3-R1"), q("S4-R12"), q("S4-R15"), q("S4-R16"), q("S4-R18"), q("S7-R2a")],
 "stamp": STAMP_813,
 "marker": "AUTOMATION: READY",
 "doc_part1": [P1_SIGN, P1_LOC, P1_DESK,
  "Check the invoices: Reports > Sales, Date Last 12 months: invoices in every month.",
  "Check the days: Reports > Timesheet Activities, Date Range This month (or Last month): find a day with no clocked time between two days that "
  "have it; write it down as {Day-A}. Find a day with clocked time followed by a day with none; write them down as {Day-B} and {Day-C}. If none "
  "exists, try another location, then write \"no such days\" in the result comment and mark only steps 8 to 10 Blocked.",
  CHECK("{Day-A}, {Day-B} and {Day-C} are written down and Timesheet Activities confirms which of them has clocked time.")],
 "doc_part2": [
  "Goal: a location with a year of invoices and two short day patterns in its clocked time.",
  P2_HIST,
  "Steps 6 and 7: read the hovered point's date and value from its tooltip; compare to the cent with the Sales report Totals row for that day.",
  P2_EVID,
 ],
 "change_summary": ("Title now \"by day, week or month\". Rewritten in full to the 8 Oct layout (setup doc link, Preconditions with {Day-A}, "
                    "{Day-B}, {Day-C}). Old step 4 (731/732 days) and its result removed (S7-R2a); preconditions need one year, not two; the "
                    "single-day comparison split into steps 6 and 7; the gap and single-point checks now name their days; quotes re-copied "
                    "from v46 with S3-R1, S4-R15, S4-R16, S4-R18 and S7-R2a added to back every result."),
})
cover(88647, ["S4-R11", "S3-R1", "S4-R12", "S4-R15", "S4-R16", "S4-R18", "S7-R2a"])

# =====================================================================================================================
# EDIT 6 — C351729 (S10 12176): the tile calendar's custom range is required (S7-R2a); no Blocked escape.
# =====================================================================================================================
PROPOSALS["updates"].append({
 "case_id": 351729,
 "title": "A tile's custom range opens its report on the same dates, showing Custom",
 "preconditions": [signed(), DESK, "Every tile is on its default range: you have just opened the Dashboard, and no custom range is set."],
 "steps": [
  "Click Dashboard in the top bar.",
  "Click the Revenue tile's date pill and, in the calendar, pick a start day and an end day yourself (for example Aug 3, 2026 and Aug 17, 2026).",
  "Click Apply and write down the dates the Revenue pill shows.",
  "Click the report icon beside Revenue.",
  "Read the Sales report's Date control and the dates it covers.",
  "Click Reports in the top bar and, for Sales, Advisor Analysis, Technician Efficiency, Technician Utilization and Sales By Customer, open the "
  "Date control and write down its choices.",
  "Compare each list with the tile presets: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week.",
  "If a report lacks one of those presets, go to the Dashboard, set that report's tile to the missing preset, write down the tile's dates, click "
  "the tile's report icon and read the report's Date control.",
 ],
 "results": [
  "Steps 2 and 3: The calendar lets you pick your own start day and end day, and the Revenue pill then shows those dates (for example Aug 3, 2026 "
  "- Aug 17, 2026). If it does not, the case fails.",
  "Step 5: The Sales report opens on exactly the dates the tile showed (for example Aug 3, 2026 to Aug 17, 2026).",
  "Step 5: Its Date control shows Custom.",
  "Step 7: Write down any preset a report lacks. If every report has all nine, step 8 is not needed: write \"every preset found\" in the result comment.",
  "Step 8: The report opens on exactly the tile's dates and its Date control shows Custom.",
 ],
 "source": ("Epic SV-490; stories SV-9582 (Story 10, Report Drill-In) and SV-9579 (Story 7, Per-Tile Date Ranges); " + PRD + ", S7-R2a (" + V45 +
            ", from Chris Ward's answer 3 of 14 Oct 2026 to our question sheet; " + CL14 + "), S10-R3, S10-E1 and the Story 10 context note on "
            "S10-E1 (unchanged since version 41); read 14 Oct 2026. Design canvas board 03_Range_After (the tile's calendar with Apply), used for "
            "on-screen labels only. " + prev("v26.40.8-754bd3a on 10/13/2026")),
 "quotes": [q("S7-R2a"), q("S10-R3"), q("S10-E1"), Q_E1_CTX],
 "stamp": STAMP_813,
 "marker": "AUTOMATION: READY",
 "doc_part1": [P1_SIGN, P1_LOC, P1_DESK,
  "Open the Dashboard fresh (click Dashboard in the top bar); a tile's range is never remembered between visits, so every tile is on its default.",
  CHECK("the Revenue pill reads This Month and the Sales by Customer pill reads Last 12 Months.")],
 "doc_part2": [
  "Goal: the Dashboard on its defaults; then a custom range on Revenue and the drill-in to the Sales report.",
  "No data is needed: the check is the dates and the Date control's label, which do not depend on rows.",
  "Step 5: record the Sales report's Date control text exactly and its from and to dates.",
  P2_EVID,
 ],
 "change_summary": ("Title now names the custom range. Rewritten in full to the 8 Oct layout. The custom range on the tile calendar is now done "
                    "every time (steps 2 to 5, first) and is required: a build without it fails instead of being marked Blocked (S7-R2a, v45). "
                    "The preset scan moved after it (steps 6 to 8). Duplicate S10-E1 quote removed; S7-R2a and S10-R3 added; quotes from v46."),
})
cover(351729, ["S7-R2a", "S10-R3", "S10-E1"])


# =====================================================================================================================
# SECOND BATCH (coordinator, from the full audit FULL-AUDIT-2026-10-14.md, same QA-lead authorisation): C88645 and C351716
# read the tile trend line's level, which S4-R11b (v45) rules out.
# =====================================================================================================================
PROPOSALS["updates"].append({
 "case_id": 88645,
 "title": "At Risk trend line has twelve monthly points and the last equals the count",
 "preconditions": [
  signed(extra=" and can reverse an invoice"), DESK,
  "{Location-A} has invoices going back more than a year, with many customers.",
  "The At Risk Customers tile's window pill reads 120 Days.",
  "Customer {Customer-A} (for example ZZAUTOTEST Lapsed Fleet) is at risk on 120 days: its newest invoice, on work order {Work-order-1} (for example "
  "S490-1180), is 2 to 6 months old, and it also has an older invoice.",
  "{Work-order-1}'s invoice has no payment, so it can be reversed.",
 ],
 "steps": [
  "Click Dashboard in the top bar.",
  "Take a screenshot of the At Risk Customers tile and read its headline.",
  "Count the points on the At Risk Customers trend line, from left to right.",
  "Hover over each point and write down the month and the value it shows.",
  "Click Work Orders, open {Work-order-1}, click the Finance tab, click the invoice's three dots, click Reverse and confirm.",
  "Click Dashboard in the top bar and check the At Risk Customers pill still reads 120 Days.",
  "Hover over each point again, write down the month and the value, and read the headline.",
 ],
 "results": [
  "Step 3: The trend line has twelve points, one per month, for the last twelve months.",
  "Step 4: The right-most point's value equals the headline from step 2 (for example both 12).",
  "Step 7: At least one earlier month's value differs from what you wrote down in step 4, not only the last one: every point is worked out again "
  "from today's data rather than kept from the past.",
  "Step 7: The right-most point's value still equals the headline.",
  "Steps 4 and 7: If the points show no value when you hover them, the values cannot be checked by hand, because the line's height does not show "
  "the count (each tile draws its line between its own lowest and highest point). Write \"point values not checked by hand\" in the result "
  "comment and mark the case Blocked.",
 ],
 "source": ("Epic SV-490; story SV-9577 (Story 5, Count Tiles), with SV-9576 (Story 4); " + PRD + ", S5-R13 (unchanged since version 42) and "
            "S4-R11b (" + V45 + ", " + ans(1) + "; " + CL14 + "); read 14 Oct 2026. Design canvas (claude.ai/artifact/Wae9DFQ8PJQBy8mbLsL5ge) boards "
            "01_Opens_After and 09_AtRisk_After, used for on-screen labels only. " + prev("v26.39.1-09be696 on 10/2/2026")),
 "quotes": [q("S5-R13"), q("S4-R11b")],
 "stamp": "Last checked against build v26.39.1-09be696 on 10/2/2026.",
 "marker": "AUTOMATION: READY",
 "doc_part1": [P1_SIGN, P1_LOC, P1_DESK,
  "Find the customer: on the Dashboard set the At Risk Customers pill to 120 Days and click View details. Pick a customer whose Last Invoice Date "
  "is 2 to 6 months ago and whose Lifetime Invoices is 2 or more; write it down as {Customer-A}. Customers > {Customer-A} > Invoices tab (turn "
  "Open only off): its newest invoice's work order is {Work-order-1}; write down both invoice dates. Prefer a ZZAUTOTEST customer; this case "
  "reverses its newest invoice. At-risk customers need months-old invoices, which cannot be created by hand.",
  "If {Work-order-1}'s invoice has a payment, reverse the payment first: Customers > {Customer-A} > Payments > the payment's three dots > Reverse.",
  CHECK("{Customer-A} is listed in the At Risk Customers table on 120 Days, and {Work-order-1}'s Finance tab offers Reverse in the invoice's three dots.")],
 "doc_part2": [
  "Goal: an at-risk customer on 120 days whose newest invoice (2 to 6 months old, unpaid) can be reversed, plus an older invoice.",
  P2_HIST,
  "Steps 4 and 7: read each point's month and value from its hover tooltip; record all twelve both times and compare month by month.",
  "Trap (tech plan section 7): Reverse deletes the invoice rather than voiding it. Either way the point values must be worked out again from "
  "today's data (S5-R13); record which months changed.",
  P2_EVID,
 ],
 "change_summary": ("Rewritten in full to the 8 Oct layout (setup doc link, Preconditions with {Customer-A} and {Work-order-1}). The fallback "
                    "\"compare heights\" / \"judge from the two screenshots\" removed: under S4-R11b (v45) the line is drawn between its own "
                    "lowest and highest point, so heights cannot show the count; without hover values the case is now Blocked instead. "
                    "Added a check that the last point still equals the headline after the reversal; steps split to one action; quotes "
                    "S5-R13 and S4-R11b from v48."),
})
cover(88645, ["S5-R13", "S4-R11b"])

PROPOSALS["updates"].append({
 "case_id": 351716,
 "title": "This Month's figure and trend line both include today's sales",
 "preconditions": [
  signed("ZZAUTOTEST Today Sales 14 Oct A"), DESK,
  "{Location-A} is a fresh location made for this run: before today nothing was invoiced or credited there.",
  "Today is not the 1st of the month.",
  "Work order {Work-order-1} (for example S490-1310) for customer {Customer-A} (for example ZZAUTOTEST Today Sales Fleet) was invoiced today at "
  "{Location-A}, with no discount and a Subtotal of (for example) $250.00 (2.50 hours at $100.00 an hour).",
 ],
 "steps": [
  "Click Dashboard in the top bar (the Revenue tile opens on This Month).",
  "Read the Revenue headline.",
  "Look at the Revenue trend line.",
  "Hover the right-hand end of the trend line and read the date and value shown, if any.",
 ],
 "results": [
  "Step 2: The Revenue headline equals {Work-order-1}'s invoice Subtotal (for example $250.00): the This Month figure runs from the 1st of the "
  "month up to and including today.",
  "Step 3: A trend line is drawn, not the dashed empty-chart outline. It runs flat along the bottom for the earlier days of this month, which "
  "had no sales, and rises at its right-hand end, today, the only day with sales.",
  "Step 4: The last point is today and reads the same amount as the headline (for example $250.00). If hovering shows no value, write \"point "
  "values not checked by hand\" in the result comment; step 3 still decides pass or fail.",
 ],
 "source": ("Epic SV-490; story SV-9579 (Story 7, Per-Tile Date Ranges), with SV-9576 (Story 4); " + PRD + ", S7-E1, S4-R2 and S4-E3 (since "
            "version 42), S4-R11a (added in version 43 on 9 Oct 2026) and S4-R11b (" + V45 + ", " + ans(1) + "); read 14 Oct 2026. Design canvas "
            "(claude.ai/artifact/Wae9DFQ8PJQBy8mbLsL5ge) board 01_Opens_After, used for on-screen labels only. " + prev("v26.39.1-09be696 on 10/2/2026")),
 "quotes": [q("S7-E1"), q("S4-R2"), q("S4-R11a"), q("S4-R11b"), q("S4-E3")],
 "stamp": "Last checked against build v26.39.1-09be696 on 10/2/2026.",
 "marker": "AUTOMATION: READY",
 "doc_part1": [P1_SIGN, P1_NEWLOC("ZZAUTOTEST Today Sales 14 Oct A"), P1_RATE, P1_CUST("ZZAUTOTEST Today Sales Fleet"), P1_DESK,
  "Today, create and invoice one work order for {Customer-A}: " + P1_INVOICE.replace("Estimated Time and Tech Time (for example 1.00)", "Estimated Time 2.50 and Tech Time 2.50") +
  " This is {Work-order-1}; write down its number and the Subtotal (for example $250.00).",
  CHECK("Reports > Sales, Date This month, at {Location-A} lists only {Work-order-1}'s invoice, dated today.")],
 "doc_part2": [
  "Goal: a fresh location whose only invoice this month is today's.",
  P2_SCREEN,
  "Step 3: record the trend line's drawn points; every point before today must sit at the bottom edge and today's at the top edge "
  "(the line is drawn between its own lowest and highest point).",
  P2_EVID,
 ],
 "change_summary": ("Rewritten in full to the 8 Oct layout (setup doc link, Preconditions with {placeholders}, a fresh location so the "
                    "headline before the invoice is $0.00). \"Its last point has risen compared with before the invoice\" replaced: under "
                    "S4-R11b (v45) the line shows direction, not level, so the check is now that a line is drawn, flat on the earlier no-sales "
                    "days (S4-R11a) and rising at today, with the hovered last point equal to the headline. Duplicate S7-E1 quote replaced by "
                    "S7-E1, S4-R2, S4-R11a, S4-R11b and S4-E3 from v48."),
})
cover(351716, ["S7-E1", "S4-R2", "S4-R11a", "S4-R11b", "S4-E3"])

# =====================================================================================================================
# NEW TESTS (17)
# =====================================================================================================================
def new(key, sec, title, pre, steps, results, source, quotes, p1, p2, why, codes):
    PROPOSALS["new"].append({"key": key, "section_id": sec, "title": title, "preconditions": pre, "steps": steps, "results": results,
                             "source": source, "quotes": quotes, "marker": MARKER_NEW, "doc_part1": p1, "doc_part2": p2, "why": why})
    cover(key, codes)
V44 = "added in version 44, saved on 13 Oct 2026 (13:37 UTC) by Chris Ward with the note \"the table follows the chart filter (Ayesha)\"; the spec's change log (version 46) lists it under 2026-10-13"
def ans(n): return f"from Chris Ward's answer {n} of 14 Oct 2026 to our question sheet"

# N1 — S8 untick all on Technician Utilization (sheet-data new 1, with the corrected date)
new("N01", 12174, "Unticking every technician on Technician Utilization hides its chart and table",
 [signed(), DESK, techs(chart="Technician filter of the Technician Utilization chart")],
 ["Click Dashboard in the top bar.", "Click View details on Technician Utilization.", "Click the Technician filter button.",
  "Untick every technician.", "Close the list and look at where the chart and the table were.", "Tick {Technician-A} again."],
 ["Step 5: The Technician Utilization chart is hidden: no empty chart box and no empty axes are shown in its place.",
  "Step 5: The Technician Utilization table under it is hidden too: no table with no rows is shown.",
  "Steps 4 and 5: No message, toast or alert appears.",
  "Step 6: The chart comes back with {Technician-A}'s line, and the table comes back listing {Technician-A} only."],
 ("Epic SV-490; story SV-9580 (Story 8, Chart Filters); " + PRD + ", S8-N1 and S8-R5 (since version 42), S8-N1a and S8-R5a (" + V44 + "), and "
  "section 7 (reworded in version 45 on 14 Oct 2026 to name the table); read 14 Oct 2026. Page change: "
  "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions=43&selectedPageVersions=44. " + NOTYET),
 [q("S8-N1"), q("S8-N1a"), Q_SEC7, q("S8-R5"), q("S8-R5a")],
 [P1_SIGN, P1_LOC, P1_DESK, P1_TECHS_CHECK,
  CHECK("on the Dashboard, View details on Technician Utilization: the Technician filter lists {Technician-A} and {Technician-B}, both ticked.")],
 ["Goal: the Technician Utilization chart with at least two technicians this month.", P2_SCREEN, P2_FILTER,
  "After the test, tick every technician again so the remembered choice does not affect other cases.", P2_EVID],
 "S8-N1a (v44, 13 Oct): the table hides with the chart; C88620 checks Technician Efficiency only.", ["S8-N1", "S8-N1a", "S8-R5", "S8-R5a"])

# N2 — S8 remembered filter + table (sheet-data new 2)
new("N02", 12174, "On your next visit the table still follows the remembered filter choice",
 [signed(), DESK, SAMEBROWSER, techs(chart="Technician filter of the Technician Efficiency chart"), advisors()],
 ["Click Dashboard in the top bar.", "Click View details on Technician Efficiency.",
  "In the Technician filter keep only {Technician-A} ticked.", "Click View details on Billing Efficiency.",
  "In the Advisor filter choose {Advisor-A}.", "Close the browser tab.",
  "Open the site again in the same browser and click Dashboard in the top bar.",
  "Click View details on Technician Efficiency and read the chart and the Technician Efficiency table.",
  "Click View details on Billing Efficiency and read the chart and the Advisor Analysis table."],
 ["Step 8: The chart shows only {Technician-A}'s line, and the Technician Efficiency table lists only {Technician-A}.",
  "Step 9: The chart shows only {Advisor-A}'s line, and the Advisor Analysis table lists only {Advisor-A}."],
 ("Epic SV-490; story SV-9580 (Story 8, Chart Filters), with SV-9578 (Story 6); " + PRD + ", S8-R6 and S6-R16 (since version 42) and S8-R5a (" +
  V44 + "); read 14 Oct 2026. Page change: "
  "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions=43&selectedPageVersions=44. " + NOTYET),
 [q("S8-R6"), q("S8-R5a"), q("S6-R16")],
 [P1_SIGN, P1_LOC, P1_DESK, P1_TECHS_CHECK, P1_ADV_CHECK,
  CHECK("on the Dashboard, View details on Technician Efficiency lists {Technician-A} and {Technician-B} in its filter, and View details on "
        "Billing Efficiency lists {Advisor-A} and {Advisor-B} in its Advisor filter.")],
 ["Goal: two technicians and two advisors with work this month; one browser profile kept between steps 6 and 7.", P2_SCREEN, P2_FILTER,
  "Steps 6 and 7: with Playwright, close the page and open a new page in the SAME browser context (a new context is a new browser and loses "
  "local storage). If the session cookie is lost, sign in again in that context.",
  "After the test, tick every technician and clear the advisor choice again.", P2_EVID],
 "S8-R5a (v44, 13 Oct) with S8-R6: the table follows a remembered choice; C351718 checks only the chart.", ["S8-R6", "S8-R5a", "S6-R16"])

# N3 — S4-R11a Revenue zero days between two sales days (sheet-data new 3, corrected date v43 9 Oct)
new("N03", 12170, "Revenue trend line drops to $0 on days with no sales between two sales days",
 [signed("ZZAUTOTEST Gap Days 14 Oct A"), DESK,
  "This month {Location-A} has invoices on exactly two days, {Day-A} and {Day-B} (for example the 3rd and the 9th), at least two days apart, "
  "and no invoice on any day between them.",
  "Today is {Day-B} or a later day of the same month."],
 ["Click Dashboard in the top bar (the Revenue tile opens on This Month).",
  "Look at the Revenue tile's trend line between {Day-A} and {Day-B}.",
  "Hover the trend line on a day between {Day-A} and {Day-B} and read the value, if one is shown."],
 ["Step 2: The trend line is one continuous line: it drops to the bottom of the trend area on the days with no sales and rises again at {Day-B}. "
  "It does not break into separate pieces or single dots.",
  "Step 2: It is not the dashed empty-chart outline.",
  "Step 3: The day between reads $0.00. If hovering shows no value, write \"values not checked by hand\" in the result comment."],
 ("Epic SV-490; story SV-9576 (Story 4, KPI Hero Tiles); " + PRD + ", S4-R11a (added in version 43 on 9 Oct 2026, 15:41 UTC, by Chris Ward with "
  "the note \"no-sales bucket is a 0 point (SV-11076)\"; the spec's change log (version 46) lists it under 2026-10-09; Chris Ward's comment on "
  "Jira SV-11076, 9 Oct 2026), S4-R11b (" + V45 + ") and S4-E3; read 14 Oct 2026. Page change: "
  "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions=42&selectedPageVersions=43. " + NOTYET),
 [q("S4-R11a"), q("S4-R11b"), q("S4-E3")],
 [P1_SIGN, P1_NEWLOC("ZZAUTOTEST Gap Days 14 Oct A"), P1_RATE, P1_CUST("ZZAUTOTEST Gap Days Fleet"), P1_DESK,
  "On the first day, {Day-A}, create and invoice one work order for {Customer-A}: " + P1_INVOICE,
  "Wait at least two days without invoicing anything at {Location-A}. Then, on {Day-B} (same month), create and invoice a second work order the same way.",
  "Instead of a fresh location you may use an existing one only if Reports > Sales (Date: This month) shows invoices on exactly two days with "
  "nothing between them; write those days down as {Day-A} and {Day-B}.",
  CHECK("Reports > Sales, Date This month at {Location-A}: invoices on {Day-A} and {Day-B} only, and none on the days between.")],
 ["Goal: a location whose invoices this month fall on exactly two days at least two days apart.",
  "This setup spans several days (invoices cannot be back-dated). Record {Day-A}, {Day-B} and the location; run the steps on {Day-B} or later in the same month.",
  P2_SCREEN, P2_EVID],
 "S4-R11a (v43, 9 Oct): a no-sales day is a $0 point on Revenue; C351709 checks one sales day only.", ["S4-R11a", "S4-R11b", "S4-E3"])

# N4 — S4-R11b flat line along the bottom
new("N04", 12170, "A tile's trend line that never changes is drawn flat along the bottom",
 [signed("ZZAUTOTEST Flat Shop 14 Oct A"), DESK,
  "This month every technician's clocked time at {Location-A} is on work order lines only (no internal time), on at least two different days, "
  "so Technician Utilization is 100.00% on every day with clocked time.",
  "This month {Location-A} has invoices on at least two days with different totals (for example $100.00 on one day and $400.00 on another)."],
 ["Click Dashboard in the top bar (the four top tiles open on This Month).", "Read the Technician Utilization headline.",
  "Look at the Technician Utilization trend line.", "Look at the Revenue trend line."],
 ["Step 2: The headline reads 100.00%.",
  "Step 3: The trend line is a flat line along the bottom of the trend area, not in the middle and not at the top. It is not the dashed empty-chart outline.",
  "Step 4: The Revenue line uses the whole height of the trend area: its lowest day touches the bottom and its highest day touches the top."],
 ("Epic SV-490; story SV-9576 (Story 4, KPI Hero Tiles); " + PRD + ", S4-R11b (" + V45 + ", " + ans(1) + "; " + CL14 + "), S4-R8 and S4-R12 "
  "(since version 42); read 14 Oct 2026. Page change: "
  "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions=44&selectedPageVersions=45. " + NOTYET),
 [q("S4-R11b"), q("S4-R8"), q("S4-R12")],
 [P1_SIGN, P1_NEWLOC("ZZAUTOTEST Flat Shop 14 Oct A"), P1_RATE, P1_CUST("ZZAUTOTEST Flat Line Fleet"), P1_DESK,
  "On one day, create and invoice a work order for {Customer-A} with a $100.00 line (Estimated Time 1.00): " + P1_INVOICE,
  "On a later day of the same month, create and invoice a second work order with a $400.00 line (Estimated Time 4.00) the same way. Clock time "
  "only with Start and Stop on the line's Labor row; never use Clock In for internal or department time at {Location-A}.",
  CHECK("Reports > Technician Utilization, Date This month: Utilization 100.00% (no internal hours); Reports > Sales, Date This month: two "
        "invoice days with different totals.")],
 ["Goal: a location where, this month, all clocked time is work-order time on at least two days and two invoice days differ in total.",
  "This setup spans at least two days (invoices and clocked time cannot be back-dated). Record the days and totals.",
  P2_SCREEN,
  "Steps 3 and 4: take a screenshot of each tile and record the line's lowest and highest drawn position inside the trend area (for example from "
  "the drawn path's points); flat along the bottom means every point sits at the bottom edge.", P2_EVID],
 "S4-R11b (v45, 14 Oct): the trend line shows direction, not level; no case checks a flat line.", ["S4-R11b", "S4-R8", "S4-R12"])

# N5 — S7-R2a tile date picker: Today, 366-day limit, not remembered
new("N05", 12173, "A tile's date picker offers Today and a custom range of up to 366 days",
 [signed(), DESK, SAMEBROWSER,
  "Work order {Work-order-1} (for example S490-1301) for customer {Customer-A} (for example ZZAUTOTEST Today Picker) was invoiced today at {Location-A}."],
 ["Click Dashboard in the top bar.", "Click the Revenue tile's date pill and read the list of presets.",
  "In the calendar click Today, then click Apply.", "Read the Revenue pill and headline.",
  "Click the report icon beside Revenue and read the Sales report's dates and its Totals row Subtotal.",
  "Go back to the Dashboard, click the Revenue pill, pick a start day and an end day so the readout at the bottom reads \"Range: 366 days\", and click Apply.",
  "Read the Revenue pill.",
  "Click the Revenue pill again, try to pick a range one day longer (the readout would read \"Range: 367 days\") and try to click Apply.",
  "Close the browser tab.", "Open the site again in the same browser and click Dashboard in the top bar.", "Read the Revenue pill."],
 ["Step 2: The presets are the nine named ones, in this order: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last "
  "Month, This Week, Last Week. Today is not one of them.",
  "Step 3: The Today button is inside the calendar.",
  "Step 4: The pill shows today's date only (for example \"Oct 14, 2026 - Oct 14, 2026\").",
  "Step 5: The Sales report covers today only, and its Totals row Subtotal equals the Revenue headline from step 4. Write down what its Date control shows.",
  "Step 7: The 366-day range is accepted: the pill shows the start and end days you picked.",
  "Step 8: A range longer than 366 days cannot be applied: the pill never shows a 367-day range.",
  "Step 11: The pill reads This Month again: the custom range was not remembered."],
 ("Epic SV-490; story SV-9579 (Story 7, Per-Tile Date Ranges); " + PRD + ", S7-R2a (" + V45 + ", " + ans(3) + "; " + CL14 + "), S7-R2, S7-R7, "
  "S7-R8 and S3-R1 (since version 42); release notes (Confluence 931069964 v7) also say \"or any range of up to 366 days picked on the "
  "calendar\"; read 14 Oct 2026. Page change: "
  "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions=44&selectedPageVersions=45. " + NOTYET),
 [q("S7-R2"), q("S7-R2a"), q("S3-R1"), q("S7-R8"), q("S7-R7")],
 [P1_SIGN, P1_LOC, P1_DESK, P1_CUST("ZZAUTOTEST Today Picker"),
  "Today, create and invoice one work order for {Customer-A}: " + P1_INVOICE.replace("(the $100 rate of this location)", "(any labor rate of this location)") + " This is {Work-order-1}; write down its number.",
  CHECK("Reports > Sales, Date Today (or a custom range of today only): {Work-order-1}'s invoice is listed.")],
 ["Goal: one invoice today at the location, so today's Revenue is above $0.00.", P2_SCREEN,
  "Step 8: record exactly how the picker refuses the 367th day (the day cannot be picked, Apply stays unavailable, or a message appears); any "
  "of these is a pass as long as the tile never shows a 367-day range.",
  "Steps 9 to 11: close the page and open a new page in the SAME browser context.", P2_EVID],
 "S7-R2a (v45, 14 Oct): Today in the calendar, custom range up to 366 days, not remembered; no case checks these.",
 ["S7-R2", "S7-R2a", "S3-R1", "S7-R8", "S7-R7"])

# N6 — S6-R8a At Risk revenue link
new("N06", 12172, "At Risk table revenue link opens the Sales report with the same total",
 [signed(), DESK, "The At Risk Customers tile's window pill reads 120 Days (the default).",
  "Customer {Customer-A} (for example ZZAUTOTEST Risk Fleet) is in the At Risk Customers table with a Revenue (12 Mo) above $0.00 (for example $1,250.00).",
  "Customer {Customer-B} (for example ZZAUTOTEST Old Fleet) is in the same table with a Revenue (12 Mo) of $0.00.",
  "The table may also show a walk-in row (sales with no customer); the check of that row is recorded as not reachable if there is none."],
 ["Click Dashboard in the top bar.", "Click View details on At Risk Customers.", "Write down {Customer-A}'s Revenue (12 Mo).",
  "Click {Customer-A}'s Revenue (12 Mo) amount.", "Read the Sales report's customer filter, its dates and its Totals row Subtotal.",
  "Go back to the Dashboard and click View details on At Risk Customers.", "Point at {Customer-B}'s $0.00 amount, then click it.",
  "Point at the walk-in row's amount, if there is one, then click it."],
 ["Step 5: The Sales report is filtered to {Customer-A} only.",
  "Step 5: It covers the twelve months the amount covers: from the 1st of the month eleven months back through today (for example Nov 1, 2025 to Oct 14, 2026 when tested on Oct 14, 2026).",
  "Step 5: Its Totals row Subtotal equals the amount from step 3, to the cent.",
  "Step 7: The $0.00 amount is plain text: the pointer does not change to a hand and clicking does nothing.",
  "Step 8: The walk-in amount is plain text in the same way. If there is no walk-in row, write \"walk-in row not reachable by hand\" in the result comment."],
 ("Epic SV-490; story SV-9578 (Story 6, Expanding a Tile), with SV-9582 (Story 10); " + PRD + ", S6-R8a (" + V45 + ", " + ans(4) + "; " + CL14 +
  ") and S10-R8 (since version 41); read 14 Oct 2026. Page change: "
  "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions=44&selectedPageVersions=45. " + NOTYET),
 [q("S6-R8a"), q("S10-R8")],
 [P1_SIGN, P1_LOC, P1_DESK,
  "Check the customers: on the Dashboard click View details on At Risk Customers (pill on 120 Days). Pick a customer with a Revenue (12 Mo) above "
  "$0.00 and write the name down as {Customer-A}; pick one with $0.00 and write it down as {Customer-B}. Note whether a walk-in row is listed. "
  "At-risk customers need invoices that are months old, which cannot be created by hand in one day, so use a location that already has them "
  "(try another location in the list if needed).",
  CHECK("the At Risk Customers table on 120 Days lists {Customer-A} with an amount above $0.00 and {Customer-B} with $0.00.")],
 ["Goal: an At Risk Customers table (120 days) with one customer above $0.00 and one at $0.00.", P2_HIST,
  "Step 5: read the Sales report's customer filter chip, its from and to dates and the Totals row Subtotal; compare to the cent with the amount "
  "from step 3. Record the report's address too.",
  "Steps 7 and 8: read the computed cursor style of the amount and whether it is a link; record what clicking does.", P2_EVID],
 "S6-R8a (v45, 14 Oct): link opens the Sales report with the same total, $0.00 and walk-in are plain text; C540783 checks the link only.",
 ["S6-R8a", "S10-R8"])

# N7 — S6-R3a expanded Revenue chart follows the tile range
new("N07", 12172, "The expanded Revenue chart follows the Revenue tile's date range",
 [signed(), DESK, "{Location-A} has invoices on several days this month, in last quarter and across the last twelve months."],
 ["Click Dashboard in the top bar (the Revenue tile opens on This Month).", "Click View details on Revenue.",
  "Read the labels along the bottom of the Revenue chart and count the bars.", "Set the Revenue pill to Last Quarter.",
  "Read the chart's labels and count the bars.", "Set the Revenue pill to Last 12 Months.", "Read the chart's labels and count the bars.",
  "Hover each of the twelve bars, write down its amount and add them up."],
 ["Step 3: The chart is day by day: its labels are days of this month, not months.",
  "Step 5: The chart is week by week across the three months of last quarter (about 13 bars).",
  "Step 7: Twelve bars, one per month, from the month eleven months back to this month (for example Nov 2025 to Oct 2026 when tested in October 2026).",
  "Step 8: The twelve amounts add up to the Revenue headline for Last 12 Months."],
 ("Epic SV-490; story SV-9578 (Story 6, Expanding a Tile); " + PRD + ", S6-R3a (" + V45 + ", " + ans(5) + "; " + CL14 + "), S4-R11, S10-R8 and "
  "the Revenue row of the S3-R2 table (since version 42); read 14 Oct 2026. Page change: "
  "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions=44&selectedPageVersions=45. " + NOTYET),
 [q("S6-R3a"), q("S4-R11"), q("S10-R8"), Q_REV_ROW],
 [P1_SIGN, P1_LOC, P1_DESK,
  "Check the invoices: Reports > Sales with Date This month, then Last quarter, then Last 12 months: each lists invoices on several days. If not, "
  "try another location in the list (last quarter and last year cannot be created by hand today).",
  CHECK("the Revenue tile reads above $0.00 on This Month, Last Quarter and Last 12 Months.")],
 ["Goal: a location with invoices this month, last quarter and over the last twelve months.", P2_HIST,
  "Steps 3 to 8: read the chart's axis labels and bar count from the drawn chart; read each bar's amount from its tooltip; add them to the cent.",
  P2_EVID],
 "S6-R3a (v45, 14 Oct): the expanded Revenue chart follows the tile range; C88612 checks Last 12 Months only.",
 ["S6-R3a", "S4-R11", "S10-R8"])

# N8 — S9-R9 dashed join across an empty month
new("N08", 12175, "An expanded chart joins the points around an empty month with a dashed line",
 [signed(), DESK,
  "Technician {Technician-A} (for example ZZAUTOTEST Tech Gap) has clocked time at {Location-A} in {Month-A} and in {Month-C} (for example July "
  "2026 and September 2026), both within the last twelve months, and no clocked time in {Month-B} (for example August 2026), the month between."],
 ["Click Dashboard in the top bar.", "Set the Technician Efficiency pill to Last 12 Months and click View details on Technician Efficiency.",
  "In the Technician filter keep only {Technician-A} ticked.", "Look at {Technician-A}'s line across {Month-B}."],
 ["Step 4: A dashed line joins {Technician-A}'s points for {Month-A} and {Month-C} across {Month-B}.",
  "Step 4: The line does not break at {Month-B} and does not drop to zero there."],
 ("Epic SV-490; story SV-9581 (Story 9, Chart Behavior); " + PRD + ", S9-R9 (" + V45 + ", " + ans(6) + "; " + CL14 + ") and S8-R5 (since "
  "version 42); read 14 Oct 2026. Page change: "
  "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions=44&selectedPageVersions=45. " + NOTYET),
 [q("S9-R9"), q("S8-R5")],
 [P1_SIGN, P1_LOC, P1_DESK,
  "Find the technician: Reports > Technician Efficiency (or Reports > Timesheet Activities), month by month over the last twelve months, until "
  "you find a technician with clocked time in one month, none in the next and some again in the month after. Write down the technician as "
  "{Technician-A} and the three months as {Month-A}, {Month-B} and {Month-C}. If no location in the list has one, write \"no empty month found\" "
  "in the result comment and mark the case Blocked (months of history cannot be created by hand).",
  CHECK("Timesheet Activities shows {Technician-A} with clocked time in {Month-A} and {Month-C} and none in {Month-B}.")],
 ["Goal: a technician with a month without clocked time between two months with clocked time, inside the last twelve months.", P2_HIST,
  "Step 4: record whether the segment across {Month-B} is drawn dashed (its stroke style) and that no point is drawn at {Month-B}.",
  "After the test, tick every technician again.", P2_EVID],
 "S9-R9 (v45, 14 Oct): an expanded chart joins an empty month with a dashed line; only tile trend lines leave a gap.", ["S9-R9", "S8-R5"])

# N9 — S9-R11 expanded chart with no data
new("N09", 12175, "An expanded chart with nothing to show reads \"No data for selected date range\"",
 [signed("ZZAUTOTEST Empty 14 Oct A"), DESK,
  "{Location-A} is a location made for this test, with no invoices and no clocked time at all."],
 ["Click Dashboard in the top bar.", "Click View details on Billing Efficiency and read the chart area.",
  "Click View details on Technician Efficiency and read the chart area.", "Click View details on Technician Utilization and read the chart area.",
  "Click View details on Revenue and read the chart area."],
 ["Steps 2 to 5: Each chart area reads \"No data for selected date range\", including the Revenue chart, because there are no sales at all.",
  "Steps 2 to 5: None of them shows the dashed outline with the chart icon, and no error appears."],
 ("Epic SV-490; story SV-9581 (Story 9, Chart Behavior); " + PRD + ", S9-R11 (" + V45 + ", " + ans(15) + "; " + CL14 + "; reworded in version 48 on 14 Oct 2026, 17:09 UTC, " + ans(16) + ", so a Revenue "
  "range with no sales at all also reads \"No data for selected date range\"); read 14 Oct 2026. Page change: "
  "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions=44&selectedPageVersions=45 and "
  "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions=47&selectedPageVersions=48. " + NOTYET),
 [q("S9-R11")],
 [P1_SIGN, P1_NEWLOC("ZZAUTOTEST Empty 14 Oct A"), P1_DESK,
  CHECK("on the Dashboard at {Location-A} the Revenue tile reads $0.00 and the three ratio tiles read \"-\".")],
 ["Goal: a fresh location with no invoices and no clocked time.", P2_SCREEN,
  "Steps 2 to 5: read the chart area's text exactly and compare it character for character with \"No data for selected date range\".",
  "Step 5 follows Chris Ward's answer 16 (14 Oct 2026) and PRD version 48: a chart has nothing to show when no point has a value or every point is zero.", P2_EVID],
 "S9-R11 (v45, reworded v48, 14 Oct): an expanded chart with no data, Revenue included, reads \"No data for selected date range\"; no case checks the dashboard's expanded charts.",
 ["S9-R11"])

# N10 — S10-R1 / S4-R18 report link on empty technician tiles
new("N10", 12176, "Technician tiles with no data keep their report link",
 [signed("ZZAUTOTEST No Clock 14 Oct A"), DESK, "{Location-A} is a location made for this test, with no clocked time at all."],
 ["Click Dashboard in the top bar.", "Look beside the names of the Technician Efficiency and Technician Utilization tiles.",
  "Point at the report icon beside Technician Efficiency and read the tooltip.", "Click the icon.",
  "Go back to the Dashboard, point at the report icon beside Technician Utilization and read the tooltip.", "Click the icon."],
 ["Step 2: Both tiles show the grey \"-\" headline and the dashed empty-chart outline, and both still show the report icon beside their name.",
  "Steps 3 and 5: The tooltip names the report the icon opens. Write the tooltip text in the result comment.",
  "Step 4: The Technician Efficiency report opens.", "Step 6: The Technician Utilization report opens."],
 ("Epic SV-490; story SV-9582 (Story 10, Report Drill-In), with SV-9576 (Story 4) and SV-9575 (Story 3); " + PRD + ", S10-R1, S10-R2, S10-R4, "
  "S4-R12, S4-R18 and S3-E3 (unchanged since version 42); confirmed by " + ans(7) + ": \"No PRD change: every tile keeps its report link with "
  "or without data\". The design canvas row 15 drawing shows these tiles without the report link; Chris Ward's answer of 14 Oct 2026 says that "
  "drawing is wrong, and we take the PRD and his later answer as prevailing. " + NOTYET),
 [q("S10-R1"), q("S4-R18"), q("S3-E3"), q("S4-R12"), q("S10-R4"), q("S10-R2")],
 [P1_SIGN, P1_NEWLOC("ZZAUTOTEST No Clock 14 Oct A"), P1_DESK,
  CHECK("on the Dashboard at {Location-A} the Technician Efficiency and Technician Utilization tiles read \"-\".")],
 ["Goal: a fresh location with no clocked time.", P2_SCREEN,
  "Steps 3 and 5: read the tooltip text exactly. Steps 4 and 6: record the report page's title and address.", P2_EVID],
 "S10-R1/S4-R18 confirmed by PO answer 7 (14 Oct): every tile keeps its report link with or without data; no case checks an empty tile.",
 ["S10-R1", "S4-R18", "S3-E3", "S4-R12", "S10-R4", "S10-R2"])

# N11 — S3-N2 no "Last updated" line
new("N11", 12169, "The dashboard shows no \"Last updated\" line",
 [signed(), DESK],
 ["Click Dashboard in the top bar and wait for all six tiles to load.", "Read the whole page, from the top bar to below the last tile.",
  "Click View details on Revenue and read the panel that opens, down to its bottom edge."],
 ["Steps 2 and 3: Nowhere is there a \"Last updated\" line, a time such as \"3 minutes ago\", or any other note about when the figures were refreshed."],
 ("Epic SV-490; story SV-9575 (Story 3, Measure Formulas and Report Parity); " + PRD + ", S3-N2 (" + V45 + ", " + ans(11) + "; " + CL14 + "); "
  "read 14 Oct 2026. The design canvas shows a \"Last updated\" line; PRD version 45 (14 Oct 2026) says there is none, and we take the later PRD "
  "as prevailing. Page change: "
  "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions=44&selectedPageVersions=45. " + NOTYET),
 [q("S3-N2")],
 [P1_SIGN, P1_LOC, P1_DESK, CHECK("the Dashboard opens with all six tiles at {Location-A}.")],
 ["Goal: the Dashboard open at any location.", "No data is needed.",
  "Steps 2 and 3: search the page's visible text for \"updated\", \"ago\", \"refreshed\" and a clock time, and record the result.", P2_EVID],
 "S3-N2 (v45, 14 Oct): no freshness line; the design still shows one, so a build could add it.", ["S3-N2"])

# N12 — S12-R6
new("N12", 12178, "A report opened from a tile shows its Date filter panel once, with no jump",
 [signed(), DESK],
 ["Click Dashboard in the top bar.", "Click the report icon beside Revenue and watch the Date filter panel while the Sales report opens.",
  "Click Reports in the top bar, click Sales in the left menu, and watch the Date filter panel while it opens."],
 ["Step 2: The Date filter panel appears once, already in its final place. It does not appear somewhere else first and then jump.",
  "Step 3: It appears the same way as in step 2."],
 ("Epic SV-490; story SV-9584 (Story 12, Visual Conformance); " + PRD + ", S12-R6 (" + V45 + ", " + ans(13) + ", one rule per defect ticket "
  "SV-10891; " + CL14 + "); read 14 Oct 2026. " + NOTYET),
 [q("S12-R6")],
 [P1_SIGN, P1_LOC, P1_DESK, CHECK("the Dashboard opens and the Revenue tile shows its report icon.")],
 ["Goal: the Dashboard open at any location.", "No data is needed.",
  "Step 2: record a short screen video (or screenshots every 100 ms) while the report opens, and compare the panel's position across frames.", P2_EVID],
 "S12-R6 (v45, 14 Oct; SV-10891): the Date filter panel opens once with no jump; no case checks it.", ["S12-R6"])

# N13 — S12-R7 and S12-R8
new("N13", 12178, "At 1536 x 864 a report keeps table rows visible and scrollable under its chart",
 [signed(), SCREEN1536,
  "{Location-A} has more Sales invoices in the last 12 months than fit on one screen (for example more than 30).",
  "On the Sales report the chart is shown (the chart button beside the filters reads Hide chart)."],
 ["Click Reports in the top bar and click Sales in the left menu.", "Set the Date control to Last 12 months.", "Look under the chart.",
  "Point at the table rows and scroll down with the mouse wheel."],
 ["Step 3: Table rows are visible under the chart, without zooming out or hiding the chart.",
  "Step 4: Only the table rows move. The chart and the filters stay where they are.",
  "Step 4: You can scroll down to the last rows of the table."],
 ("Epic SV-490; story SV-9584 (Story 12, Visual Conformance); " + PRD + ", S12-R7 and S12-R8 (" + V45 + ", " + ans(13) + ", one rule per defect "
  "ticket SV-10933 and SV-10934; " + CL14 + "); read 14 Oct 2026. " + NOTYET),
 [q("S12-R7"), q("S12-R8")],
 [P1_SIGN, P1_LOC,
  "Use a 1536 x 864 screen at 100% browser zoom with the window maximised. A 1920 x 1080 screen with the computer's display scaling at 125% "
  "gives exactly that. Do not use the browser's own zoom to get there.",
  "Check the invoices: Reports > Sales, Date Last 12 months, lists more rows than fit on the screen. If the chart button reads Show chart, click it.",
  CHECK("the Sales report on Last 12 months shows its chart and more rows than fit under it.")],
 ["Goal: the Sales report with its chart and a long table, in a 1536 x 864 viewport.",
  "Set the Playwright viewport to 1536 x 864 with device scale factor 1; record it.", P2_HIST,
  "Step 4: scroll with the mouse wheel over the table body; record the chart's and the filters' positions before and after.", P2_EVID],
 "S12-R7/S12-R8 (v45, 14 Oct; SV-10933, SV-10934); C433976 checks the space under the chart, not the scrolling.", ["S12-R7", "S12-R8"])

# N14 — S12-R9
new("N14", 12178, "An open date picker on a tile stays with its tile",
 [signed(), DESK],
 ["Click Dashboard in the top bar.", "Click the Revenue tile's date pill so the picker opens.",
  "With the pointer over the open picker, scroll the mouse wheel down and then up.", "Look at the picker and the page."],
 ["Step 3: The page does not scroll.", "Step 4: The picker stays attached under the Revenue tile's pill; it does not float away from its tile."],
 ("Epic SV-490; story SV-9584 (Story 12, Visual Conformance); " + PRD + ", S12-R9 (" + V45 + ", " + ans(13) + ", one rule per defect ticket "
  "SV-10936; " + CL14 + "); read 14 Oct 2026. " + NOTYET),
 [q("S12-R9")],
 [P1_SIGN, P1_LOC, P1_DESK, CHECK("the Dashboard opens and the Revenue pill opens its picker.")],
 ["Goal: the Dashboard open at any location.", "No data is needed.",
  "Step 3: record the page's scroll position and the picker's position before and after the wheel.", P2_EVID],
 "S12-R9 (v45, 14 Oct; SV-10936): an open tile date picker stays with its tile; no case checks it.", ["S12-R9"])

# N15 — S12-R10
new("N15", 12178, "A chart filter list that opens upward never covers the top menu bar",
 [signed(), SCREEN1536,
  "At least ten technicians have clocked time at {Location-A} this month, so the Technician Efficiency chart's Technician filter list is long."],
 ["Click Dashboard in the top bar and click View details on Technician Efficiency.",
  "Scroll the page until the chart's Technician filter button is near the bottom of the window.", "Click the Technician filter button.",
  "Look at the top of the list that opens."],
 ["Step 3: The list opens upward. If it opens downward, scroll so the button sits lower and try again; if it never opens upward, write \"list "
  "never opened upward\" in the result comment.",
  "Step 4: The list stays below the top menu bar and covers no part of it. If it is too tall for the space, it is shorter and scrolls inside."],
 ("Epic SV-490; story SV-9584 (Story 12, Visual Conformance); " + PRD + ", S12-R10 (" + V45 + ", " + ans(13) + ", one rule per defect ticket "
  "SV-11242; " + CL14 + "); read 14 Oct 2026. " + NOTYET),
 [q("S12-R10")],
 [P1_SIGN, P1_LOC,
  "Use a 1536 x 864 screen at 100% browser zoom with the window maximised (a 1920 x 1080 screen at 125% display scaling gives exactly that).",
  "Check the technicians: Reports > Technician Efficiency, Date This month, lists at least ten technicians. If not, try another location in the list.",
  CHECK("on the Dashboard, View details on Technician Efficiency: the Technician filter lists at least ten technicians.")],
 ["Goal: a long Technician filter list in a 1536 x 864 viewport.", "Set the Playwright viewport to 1536 x 864 with device scale factor 1.",
  P2_HIST, "Step 4: record the list's top edge and the top menu bar's bottom edge; the list's top must be at or below the bar's bottom.", P2_EVID],
 "S12-R10 (v45, 14 Oct; SV-11242): an upward filter list never covers the top bar; no case checks it.", ["S12-R10"])

# N16 — S12-R11
new("N16", 12178, "In the dark theme the tile date picker is fully dark",
 [signed(), DESK, "The app is in the dark theme."],
 ["Click Dashboard in the top bar.", "Click the Revenue tile's date pill.",
  "Look at the whole picker: presets, calendar, range text and buttons.",
  "Press Escape, click Reports in the top bar, click Sales and open its Date filter.", "Compare it with the tile's picker."],
 ["Step 3: Every part of the picker is dark, with near-white presets, range text and buttons. There is no white panel and no dark text on a dark background.",
  "Step 5: The tile's picker looks like the report's Date filter."],
 ("Epic SV-490; story SV-9584 (Story 12, Visual Conformance); " + PRD + ", S12-R11 (" + V45 + ", " + ans(13) + ", one rule per defect ticket "
  "SV-11245; " + CL14 + "); read 14 Oct 2026. " + NOTYET),
 [q("S12-R11")],
 [P1_SIGN, P1_LOC, P1_DESK,
  "Switch the app to the dark theme with the app's theme switch (your initials, top right, then the dark theme switch).",
  CHECK("the app's background is dark on the Dashboard.")],
 ["Goal: the Dashboard in the dark theme.", "UNVERIFIED on the Dashboard QA site: where the theme switch sits; record where you found it.",
  "Step 3: record the picker's background colour and the colour of the preset and button text.", P2_EVID],
 "S12-R11 (v45, 14 Oct; SV-11245): the whole tile picker is dark in the dark theme; C351736 checks the tile text only.", ["S12-R11"])

# N17 — S12-R12
new("N17", 12178, "On a phone every tile's date button opens its picker after scrolling",
 [signed(),
  "You use a phone, or a desktop browser window narrowed to less than 1024 pixels wide (for example about 400 pixels), so the tiles stand in one column."],
 ["Open the Dashboard (it opens after you sign in; otherwise tap the menu button and tap Dashboard).",
  "Scroll down to the Sales by Customer tile.", "Tap its date button.", "Close the picker.",
  "Scroll back up to the Revenue tile and tap its date button."],
 ["Step 3: The picker opens next to the Sales by Customer tile.", "Step 5: The picker opens next to the Revenue tile."],
 ("Epic SV-490; story SV-9584 (Story 12, Visual Conformance); " + PRD + ", S12-R12 (" + V45 + ", " + ans(13) + ", one rule per defect ticket "
  "SV-11246; " + CL14 + ") and S12-N1 (since version 42); read 14 Oct 2026. " + NOTYET),
 [q("S12-R12"), q("S12-N1")],
 [P1_SIGN, P1_LOC,
  "Use a phone, or narrow a desktop browser window to less than 1024 pixels wide (for example about 400 pixels) by dragging its edge; do not use "
  "the browser's zoom.",
  CHECK("the Dashboard shows the tiles in one column.")],
 ["Goal: the Dashboard at phone width.", "Set the Playwright viewport to 390 x 844 (or any width under 1024).",
  "Steps 3 and 5: record whether the picker opened and its position relative to the tile.", P2_EVID],
 "S12-R12 (v45, 14 Oct; SV-11246): every tile's date button opens on a phone; C557284 covers sideways scrolling.", ["S12-R12", "S12-N1"])

PROPOSALS["notes"] = [
 "Marker for the 17 new tests: AUTOMATION: HOLD - not yet build-verified, the exact literal this suite's own never-run cases carried when "
 "created on 7 Oct 2026 (14 cases; the build-verification session later set them to READY). The 6 edited cases keep AUTOMATION: READY with the "
 "sentence that this version has not yet been checked against a build (Rule 61: no live ticket backs an expected failure).",
 "C88606 is Automated (custom_atmstatus 3); its automation fields are not in the payload, so they cannot change.",
]
json.dump(PROPOSALS, open(f"{H}/proposals-dash.json", "w"), indent=1, ensure_ascii=False)
print("updates", len(PROPOSALS["updates"]), "new", len(PROPOSALS["new"]))
