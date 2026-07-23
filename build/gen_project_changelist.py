#!/usr/bin/env python3
"""Spec-Recheck Change-List Workbook generator for Simple Flow + Fees & Discounts.
Mirrors build/custom-roles-run/gen_simple_changelist.py 1:1 (2 tabs, 7 columns, same
styling, .xlsx + .md twin). Only the per-project data (TOTAL, rows) differs.
Change text is plain layman (Rule 7); Case ID + TestRail link every row (Rule 8);
driving ticket + Done/Not-Done status from live Jira 2026-07-23; nothing pushed to TestRail.
Human-readable filenames (Rule 19)."""
import os
BASE = os.path.dirname(os.path.abspath(__file__))
LINK = "https://shopview.testrail.io/index.php?/cases/view/{}"
JIRA = "https://shopview.atlassian.net/browse/{}"
DATE = "2026-07-23"

# row = (Case ID, Area, plain "what needs to change / decide", tickets, ticket_status, action)
# ticket_status: "DONE" | "NOT DONE (<state>)"
SIMPLE_FLOW = {
 "name": "Simple Flow",
 "total": 184,
 "file": "simple-flow/SimpleFlow_SpecRecheck_ChangeList_2026-07-23",
 "omit_note": ("The other 180 cases need no change (151 Verified, 21 Blocked-on-environment, "
               "4 to re-verify live, 3 retired, plus 4 Create-Purchase-Orders cases deleted from "
               "TestRail and ignored per your ruling). Nothing pushed to TestRail yet."),
 "rows": [
  ("C29373","Accept Delivery",
   "On the Accept Delivery screen the group of parts with no vendor yet appears at the TOP of the "
   "list; the product owner wanted it at the BOTTOM. Reviewed and accepted as a look-only difference "
   "(no effect on how it works) — confirm we keep it as-is and change nothing.",
   "SV-7707","DONE","DECISION"),
  ("C29375","Accept Delivery",
   "Same Accept-Delivery point as C29373 — the position of the no-vendor group and the multi-vendor "
   "indicator. Accepted as look-only — confirm keep as-is, no case change.",
   "SV-7707","DONE","DECISION"),
  ("C29396","Review before completion",
   "When 'require review before completion' is on, signing off finishes the work order straight away "
   "with no separate 'Reviewed' holding step. Whether invoicing should be blocked until a review "
   "happens is a product decision (Milos). Don't finalise this case until that review ticket ships.",
   "SV-7870","NOT DONE (Blocked)","DECISION"),
  ("C29404","Completion screen — Close/Cancel",
   "The 'Close' vs 'Cancel' confirmation pop-up on the completion screens isn't finalised in the "
   "design yet, so the exact behaviour isn't defined. Needs Milos to confirm what Close and Cancel "
   "should do before the case can state a result.",
   "SV-7710","NOT DONE (Blocked)","DECISION"),
 ],
}

FEES_DISCOUNTS = {
 "name": "Fees and Discounts",
 "total": 186,
 "file": "fees-discounts/FeesAndDiscounts_SpecRecheck_ChangeList_2026-07-23",
 "omit_note": ("The other 174 cases need no change (167 Verified, 21 Blocked-on-environment, "
               "1 to re-verify live, 4 retired). Note: the Fees & Discounts V1 stories are still "
               "Open in Jira even though the feature is live, so most rows below wait on an open "
               "ticket. Nothing pushed to TestRail yet."),
 "rows": [
  ("C28436","Whole-WO Fee/Discount",
   "Confirm which permission controls adding or editing a whole-work-order fee/discount — the build "
   "may use one single 'edit work order' check instead of the separate whole-WO and line-level "
   "permissions the spec describes. Needs a check on staging with a restricted user.",
   "SV-8277 / SV-8289","NOT DONE (Open)","DECISION"),
  ("C28456","Inline display (Lines tab)",
   "On a labour line with two or more fees/discounts the build shows every row and has NO "
   "'Show more / Show less' collapse control the spec asks for. Confirmed difference — decide whether "
   "to change the case to match the build or log a fix for the build.",
   "SV-8279 / SV-8288","NOT DONE (Open)","DECISION"),
  ("C28460","Statistics tab",
   "The Statistics tab shows fees/discounts as one combined total with no per-item rows, so there is "
   "no per-item link to jump to the item. Confirmed difference from the design — decide keep-as-is or "
   "log a fix.",
   "SV-8280","NOT DONE (Open)","DECISION"),
  ("C28462","Statistics tab",
   "Wording check: the spec says work-order screens list fees/discounts oldest-first (the order they "
   "were created); an internal note said newest-first. The case was written to the spec (oldest-first) "
   "— confirm the actual order on staging.",
   "SV-8280","NOT DONE (Open)","DECISION"),
  ("C30618","Labor-line Fee/Discount",
   "The 'Add Labor Fee / Discount' label is correct, but the three-dot menu shows to the RIGHT of "
   "'Unassigned' and should be on the LEFT. A fix is expected (this is why the ticket re-opened) — "
   "re-check the LEFT position on staging, then update the case.",
   "SV-8479","DONE","Apply update"),
  ("C28489","Customer Fees & Discounts tab",
   "On the customer Fees & Discounts tab the 'add template' dropdown lists the template NAME only "
   "(no Type/Calc/Amount columns), and a Processing Fee shows as 'Fee'. Confirm the accepted display "
   "and update the case wording to match the build.",
   "SV-8284 / SV-8285","NOT DONE (Open)","Apply update"),
  ("C28490","Customer Fees & Discounts tab",
   "When every template is already linked, the dropdown shows 'No results' instead of the spec's "
   "'No templates available to add.' The product owner accepted 'No results' as-is — update the "
   "case's expected message to 'No results'.",
   "SV-8285","NOT DONE (Open)","Apply update"),
  ("C28511","Template admin — scoping",
   "On a single labour/part line there is NO 'Apply from template' picker at all, so the "
   "template-scoping rule can't be exercised at line level (the picker only exists on the whole "
   "work-order dialog). Confirm and adjust the case's scope.",
   "SV-8278 / SV-8281","NOT DONE (Open)","DECISION"),
  ("C28526","Processing Fee — WO behavior",
   "A processing fee can't be edited (the backend blocks it), but the work-order ⋮ menu still shows "
   "'Edit | Remove'; the spec wants Remove/Delete only. Decide keep-as-is or log a fix.",
   "SV-8279 / SV-8284","NOT DONE (Open)","DECISION"),
  ("C28527","Processing Fee — calculation",
   "The processing-fee amount is worked out on the wrong base — it includes the whole-work-order fees "
   "and their tax, when the spec says to leave those out. Confirmed calculation defect — log the fix; "
   "the case stays as-is and will correctly fail until it's fixed.",
   "SV-8284","NOT DONE (Open)","DECISION"),
  ("C28580","Calculation contract",
   "Same processing-fee base problem as C28527 in the overall calculation check — the grand-total base "
   "wrongly includes whole-work-order fees and their tax. Confirmed calculation defect — log the fix.",
   "SV-7865","NOT DONE (Testing QA)","DECISION"),
  ("C28586","Permissions (Story 13)",
   "Adding a whole-work-order fee/discount is not blocked by the backend for a user without "
   "work-order edit rights (the block is front-end only). Confirm the intended enforcement.",
   "SV-8289","NOT DONE (Open)","DECISION"),
 ],
}

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
hf = PatternFill('solid', fgColor='1F4E78'); hfont = Font(bold=True, color='FFFFFF')
wrap = Alignment(wrap_text=True, vertical='top')
warnfill = PatternFill('solid', fgColor='FCE4D6')      # orange = NOT DONE ticket
thin = Border(*[Side(style='thin', color='D9D9D9')]*4)
HDR = ['Case ID','TestRail link','Area','What needs to change','Driving ticket','Ticket status','Action']

def sheet(ws, rows):
    ws.append(HDR)
    for c in ws[ws.max_row]: c.fill=hf; c.font=hfont; c.alignment=wrap
    for cid,area,change,tix,status,action in rows:
        ws.append([cid, LINK.format(cid[1:]), area, change, tix, status, action])
        r = ws[ws.max_row]
        fill = warnfill if status.startswith('NOT DONE') else None
        for c in r:
            c.alignment=wrap; c.border=thin
            if fill: c.fill=fill
    for i,w in enumerate([9,40,20,72,20,22,14],1):
        ws.column_dimensions[openpyxl.utils.get_column_letter(i)].width=w
    ws.freeze_panes='A2'

def build(proj):
    rows = proj['rows']; n=len(rows); total=proj['total']
    nd = [r for r in rows if r[4].startswith('NOT DONE')]
    wb = openpyxl.Workbook()
    ws = wb.active; ws.title=f'Change list ({n})'
    ws.append([f"{proj['name']} spec-recheck — cases that need a change or a decision ({n} of {total})."])
    ws['A1'].font=Font(bold=True,size=13)
    ws.append(["PROVISIONAL — column D 'What needs to change' is pending a fresh LIVE staging check "
               "(needs current cookies); it will be rewritten to observed build behaviour before sign-off."])
    ws['A2'].font=Font(bold=True, color='C00000')
    ws.append([proj['omit_note'] + "  Orange rows = waiting on a ticket that is NOT yet done."])
    ws.append([])
    sheet(ws, rows)
    ws2 = wb.create_sheet('Waiting on open tickets')
    ws2.append(['Cases whose change depends on a ticket that is NOT yet done'])
    ws2['A1'].font=Font(bold=True,size=13)
    ws2.append(['These should NOT be finalised until the ticket ships; keep the case tracking the target and re-verify after the fix.'])
    ws2.append([])
    sheet(ws2, nd)
    out = os.path.join(BASE, proj['file'])
    wb.save(out + '.xlsx')
    with open(out + '.md','w') as fh:
        fh.write(f"# {proj['name']} spec-recheck — change list ({DATE})\n\n")
        fh.write("> **PROVISIONAL** — column *What needs to change* is pending a fresh LIVE staging "
                 "check (needs current cookies); it will be rewritten to observed build behaviour "
                 "before sign-off.\n\n")
        fh.write(f"{n} of {total} cases need a change or a decision. {proj['omit_note']}\n\n")
        fh.write("**Legend:** Action = *Apply update* (wording/expected fix) or *Decision* (needs you/PO/dev to choose). "
                 "Ticket status shows whether the driving Jira ticket is Done (live status 2026-07-23).\n\n")
        fh.write("| Case | Area | What needs to change | Ticket | Ticket status | Action |\n|---|---|---|---|---|---|\n")
        for cid,area,change,tix,status,action in rows:
            fh.write(f"| [{cid}]({LINK.format(cid[1:])}) | {area} | {change} | {tix} | {status} | {action} |\n")
        fh.write(f"\n## Highlight — cases waiting on a ticket that is NOT yet done ({len(nd)})\n\n")
        fh.write("| Case | Ticket | Ticket status | Why it's blocked |\n|---|---|---|---|\n")
        for cid,area,change,tix,status,action in nd:
            fh.write(f"| [{cid}]({LINK.format(cid[1:])}) | {tix} | {status} | {change} |\n")
    print(f"{proj['name']}: {n} rows ({len(nd)} waiting on NOT-DONE tickets) -> {proj['file']}.xlsx/.md")

build(SIMPLE_FLOW)
build(FEES_DISCOUNTS)
