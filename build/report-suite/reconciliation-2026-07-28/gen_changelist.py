#!/usr/bin/env python3
"""Report Suite — spec-relevance reconciliation change-list (2026-07-28).

Phase 2 deliverable. Reconciles all 515 Report Suite cases against the combined
source of truth (RATIFIED current Confluence spec [primary] + Chris Ward's
Q1/Q2/Q3 answers + the kickoff-video deltas). Lists ONLY the cases that need a
change or a decision; the rest are clean no-ops (counted, not listed).

Mirrors the established change-list workbook format
(build/custom-roles-run/CustomRoles_SpecRecheck_ChangeList_2026-07-20.*):
plain rows, TestRail Case ID + /cases/view link (Rule 8), a driving-source
column, a classification column, and a plain-English "What needs to be done"
column (Rule 7 / deliverable convention). Tab 2 = the items blocked on Chris's
spec update (PENDING-CHRIS). NO TestRail writes.
"""
import os
BASE = os.path.dirname(os.path.abspath(__file__))
LINK = "https://shopview.testrail.io/index.php?/cases/view/{}"
DATE = "2026-07-28"
TOTAL_CASES = 515
EDITED_NOW = 2

# Each row: (internal_id, cid, report, driving_source, classification, what_to_do)
# classification in {APPLIED-NOW, PENDING-CHRIS, OPEN-DECISION, LIVE-VIU-PENDING}
ROWS = [
 # ---- APPLIED-NOW (edited locally this pass; firmly confirmed) ----
 ("SBR-DEACT-04","C30255","SBR","PO answer Q1 = B (overrides spec S13-R8)","APPLIED-NOW",
  "DONE THIS PASS. Reworded so pressing the Esc key does NOT close the 'deactivate a sales rep' "
  "confirm pop-up - only the Cancel button and the X icon close it (matches Chris's answer and the "
  "app's house rule that pop-ups do not close on Esc). Long title shortened to fit. Still to be "
  "confirmed live on the QA branch."),
 ("SBR-DEACT-05","C30256","SBR","PO answer Q1 = B (consistency)","APPLIED-NOW",
  "DONE THIS PASS. Small consistency fix: made clear the Esc key never closes this dialog at any "
  "time (aligns with the case above). Overlong title shortened. Confirm live."),

 # ---- PENDING-CHRIS (video intent; current spec still says otherwise - do NOT edit) ----
 ("SBC-LBL-01","C30134","SBC","Video P24 - serial-number identifier","PENDING-CHRIS",
  "If Chris ratifies it, change the asset label to use the SERIAL NUMBER (bin number) as the "
  "identifier instead of Unit -> plate -> VIN. NOT changed yet: the current written spec (S8-R8 "
  "'· Unit {unit}') still uses the unit number, and Chris said he will 'double-check the spec' "
  "first. Also touches SBC-LBL-02 C30135, SBC-LBL-03 C30136, SBC-LBL-04 C30137."),
 ("WIP-COL-05","C30470","WIP","Video P24 - serial-number identifier","PENDING-CHRIS",
  "Same serial-number change for the Work In Progress Asset cell (currently the unit number over "
  "the VIN, per spec S4-R7). NOT changed yet - awaiting Chris's spec update. Also touches "
  "WIP-FLT-03 C30500, WIP-SORT-03 C30485, WIP-EXP-07 C30516."),
 ("SBC-EXP-01","C30159","SBC","Video P25 - remove SBC Print","PENDING-CHRIS",
  "If Chris cuts Print from the spec, remove the 'Print' item from the report's overflow (three-dot) "
  "menu. NOT changed yet: the current spec (Story 16) still includes Print; Chris said 'this should "
  "not exist... I'm going to make sure that's cut out of the spec.'"),
 ("SBC-EXP-13","C30171","SBC","Video P25 - remove SBC Print","PENDING-CHRIS",
  "Retire the SBC Print-behavior case once Print is cut from the spec. NOT changed yet. Print is "
  "also referenced in the empty-state export case SBC-EXP-15 C30173."),
 ("(new - to author)","","SBC","Video P21 - add compressed download","PENDING-CHRIS",
  "Chris agreed live to ADD a compressed/summary download to Sales By Customer, alongside the "
  "existing expanded (nested) download - like the other reports' Summary/Expanded split. NOT "
  "authored yet: the current spec has only the single flat export. Author a new export case once "
  "the spec adds it."),
 ("SBC-LOC-03","C30111","SBC","Video P10 - per-row location label","PENDING-CHRIS",
  "When 'All locations' is selected, add a per-row (or per-section) location label so a user can "
  "tell which shop each row belongs to. NOT added yet on the five non-WIP reports; add once the "
  "spec calls for it. Work In Progress already has a Location column. Also affects SBR-LOC-03 "
  "C30215, PV-FILT-10 C30337, TU-LOC-01 C30442, IV-LOC-01 C30574 - likely a new case per report."),
 ("PV-FILT-01","C30328","PV","Video P31 - Catalogue rename","PENDING-CHRIS",
  "If Chris renames/truncates 'Catalogue' (it means special-order parts never stocked), update the "
  "Type filter option, the Type column value, and the tooltips to the new label. NOT changed yet - "
  "the rename is not decided and the current spec still says 'Catalogue'. Also touches PV-FILT-09 "
  "C30336, PV-ROW-05 C30345, PV-EXP-08 C30382."),
 ("SBR-LOC-04","C30216","SBR","Video P33 - hide location filter when <=1 location","PENDING-CHRIS",
  "Chris's intent: HIDE the Location filter when a user can access only one location, SHOW it when "
  "they can access two or more. This case currently says the OPPOSITE (a one-location user STILL "
  "sees the filter, spec S21-N1) straight from the current spec. Do NOT change until Chris updates "
  "the spec - the written spec directly contradicts the video here. Ties to the Q2 permission "
  "question."),
 ("TU-LOC-05","C30446","TU","Video P33 - hide location filter when <=1 location","PENDING-CHRIS",
  "Same location-filter hide-when-one-location change. NOT changed - the current spec (S9-N1) says "
  "a one-location user still sees the filter."),
 ("IV-LOC-04","C30577","IV","Video P33 - hide location filter when <=1 location","PENDING-CHRIS",
  "Same location-filter hide-when-one-location change. NOT changed - the current spec (S7-N1) says "
  "a one-location user still sees the filter."),
 ("PV-FILT-13","C30340","PV","Video P33 - hide location filter when <=1 location","PENDING-CHRIS",
  "Same location-filter hide-when-one-location change. NOT changed - the current spec (S2-E4) says "
  "a one-location user still sees the filter."),

 # ---- OPEN-DECISION (not settled on the call) ----
 ("WIP-FLT-03","C30500","WIP","Video P12 - asset dropdown behavior","OPEN-DECISION",
  "Undecided on the call: the Asset dropdown stays open while you pick several (Chris) vs matching "
  "the native reports that close on each pick, plus a toggle (Stefan). Do not pass/fail on this "
  "until decided; confirm the final behavior live. Not changed."),
 ("IV-PERS-01","C30579","IV","Video P18 / P36 - column-selector scope","OPEN-DECISION",
  "Column-selector scope was left open across the suite (Chris vetoed one on Technician Utilization, "
  "'not married to it'). Inventory Value currently HAS a column selector per the spec (S8-R1). "
  "Confirm with Chris whether Inventory Value keeps its selector. Not changed."),
 ("PV-API-01","C30388","PV","Video P30 - pagination vs infinite-scroll","OPEN-DECISION",
  "Chris wants to revisit forced pagination vs infinite-scroll / lazy-load for large part lists. "
  "The behavior may change; treat as a performance caveat and confirm live. Not changed. Also "
  "PV-API-02 C30389."),
 ("(no case - TU)","","TU","Video P18 - TU column selector","OPEN-DECISION",
  "Chris vetoed a column selector on Technician Utilization but is 'not married to it.' Our TU "
  "cases correctly have none, matching the spec. No case to change now; if Chris later adds one, "
  "author cases then."),

 # ---- LIVE-VIU-PENDING (needs the live build; no QA branch yet) ----
 ("WIP-CALC-08","C30481","WIP","Video P14 vs spec S4-R23 - labor-delta basis","LIVE-VIU-PENDING",
  "Video P14 says the labor delta = clocked/tech hours vs INVOICED hours; the WIP spec (S4-R23) "
  "uses QUOTED (estimate) hours minus worked hours because WIP is a pre-invoice report. The case "
  "matches the SPEC (quoted-basis) and is NOT changed. Confirm live which basis actually ships. Do "
  "NOT conflate with Sales By Customer / Sales By Representative, which correctly use "
  "invoiced-minus-worked (SBC-CALC-03 C30151, SBR-CALC-02 C30230)."),
 ("TU-NAV-01","C30392","TU","Video P3 - move TU down in nav","LIVE-VIU-PENDING",
  "Video: Technician Utilization is in a bad nav spot and must move toward the bottom (additive, "
  "not interruptive). The spec says the order among the six reports does not matter, so no wording "
  "change; confirm the final nav placement live. Not changed."),
]

CLASS_FILL = {
 "APPLIED-NOW":"C6E0B4",       # green
 "PENDING-CHRIS":"FCE4D6",     # orange
 "OPEN-DECISION":"FFF2CC",     # yellow
 "LIVE-VIU-PENDING":"DDEBF7",  # blue
}

def link(cid): return LINK.format(cid[1:]) if cid.startswith("C") else ""


def write_xlsx():
    import openpyxl
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.utils import get_column_letter
    wb = openpyxl.Workbook()
    hf = PatternFill('solid', fgColor='1F4E78'); hfont = Font(bold=True, color='FFFFFF')
    wrap = Alignment(wrap_text=True, vertical='top')
    thin = Border(*[Side(style='thin', color='D9D9D9')]*4)
    HDR = ['Internal ID','TestRail Case ID','TestRail link','Report','Driving source',
           'Classification','What needs to be done (plain)']

    def sheet(ws, rows):
        ws.append(HDR)
        for c in ws[ws.max_row]:
            c.fill=hf; c.font=hfont; c.alignment=wrap
        for iid,cid,rep,src,cls,todo in rows:
            ws.append([iid, cid, link(cid), rep, src, cls, todo])
            r = ws[ws.max_row]
            fill = CLASS_FILL.get(cls)
            for c in r:
                c.alignment=wrap; c.border=thin
            if fill:
                r[5].fill = PatternFill('solid', fgColor=fill)
        for i,w in enumerate([16,15,44,8,42,18,80],1):
            ws.column_dimensions[get_column_letter(i)].width=w
        ws.freeze_panes='A2'

    # Tab 1 — full change list
    ws = wb.active; ws.title='Change list'
    ws.append([f'Report Suite - spec-relevance reconciliation change list ({DATE})'])
    ws['A1'].font=Font(bold=True,size=13)
    ws.append([f"{TOTAL_CASES} cases total. {EDITED_NOW} edited now (green). The rest need a decision "
               f"or await Chris's spec update / a live-build check - listed below. All other cases "
               f"are clean (no change needed now). NO TestRail writes this pass."])
    ws.append(["Legend: APPLIED-NOW = edited locally this pass (firmly confirmed). PENDING-CHRIS = "
               "video intent the current spec still contradicts - not edited, awaiting Chris's spec "
               "update. OPEN-DECISION = not settled on the call. LIVE-VIU-PENDING = needs the live "
               "QA build to confirm (no QA branch yet)."])
    ws.append([])
    sheet(ws, ROWS)

    # Tab 2 — blocked on Chris's spec update
    pend = [r for r in ROWS if r[4]=='PENDING-CHRIS']
    ws2 = wb.create_sheet('Blocked on Chris spec update')
    ws2.append(["Report Suite - items blocked on Chris Ward's spec update (PENDING-CHRIS)"])
    ws2['A1'].font=Font(bold=True,size=13)
    ws2.append(["These are firm video-intent items where the CURRENT written spec still says "
                "otherwise. Per the process, we do NOT rewrite cases to un-ratified verbal intent - "
                "each waits for Chris to update the Confluence spec, then we edit + live-VIU."])
    ws2.append([])
    sheet(ws2, pend)

    out = os.path.join(BASE, f'Report-Suite_Spec-Reconciliation_ChangeList_{DATE}.xlsx')
    wb.save(out)
    return out, len(pend)


def write_md(n_pend):
    out = os.path.join(BASE, f'Report-Suite_Spec-Reconciliation_ChangeList_{DATE}.md')
    n_applied = sum(1 for r in ROWS if r[4]=='APPLIED-NOW')
    n_open = sum(1 for r in ROWS if r[4]=='OPEN-DECISION')
    n_viu = sum(1 for r in ROWS if r[4]=='LIVE-VIU-PENDING')
    with open(out,'w') as fh:
        fh.write(f"# Report Suite - spec-relevance reconciliation change list ({DATE})\n\n")
        fh.write(f"**{TOTAL_CASES} cases reconciled** against the RATIFIED current Confluence spec "
                 f"(primary source of truth), Chris Ward's Q1/Q2/Q3 answers, and the kickoff-video "
                 f"deltas. Only cases needing a change or a decision are listed; **all other cases "
                 f"are clean no-ops** (no change needed now, live-VIU later). **NO TestRail writes "
                 f"this pass** (Rule 6 - needs explicit user permission).\n\n")
        fh.write(f"**Counts:** {n_applied} edited now (APPLIED-NOW) | {n_pend} awaiting Chris's spec "
                 f"update (PENDING-CHRIS) | {n_open} open decisions (OPEN-DECISION) | {n_viu} awaiting "
                 f"a live-build check (LIVE-VIU-PENDING).\n\n")
        fh.write("**Legend:**\n"
                 "- **APPLIED-NOW** - edited locally this pass (firmly confirmed by Chris's answer). \n"
                 "- **PENDING-CHRIS** - firm video intent the *current written spec still "
                 "contradicts*; NOT edited, awaiting Chris's spec update (Rule 23 - spec wins, don't "
                 "rewrite to un-ratified verbal intent).\n"
                 "- **OPEN-DECISION** - not settled on the call.\n"
                 "- **LIVE-VIU-PENDING** - needs the live QA build to confirm; no QA branch yet, so "
                 "labelled 'not live-verified this run' (Rule 22).\n\n")
        fh.write("| Internal ID | Case | Report | Driving source | Classification | What needs to be done (plain) |\n")
        fh.write("|---|---|---|---|---|---|\n")
        for iid,cid,rep,src,cls,todo in ROWS:
            case = f"[{cid}]({link(cid)})" if cid else "_new - no C-ID yet_"
            fh.write(f"| {iid} | {case} | {rep} | {src} | **{cls}** | {todo} |\n")

        pend = [r for r in ROWS if r[4]=='PENDING-CHRIS']
        fh.write(f"\n## Blocked on Chris's spec update - PENDING-CHRIS ({len(pend)})\n\n")
        fh.write("These firm video-intent items where the **current written spec still says "
                 "otherwise**. We do NOT rewrite cases to un-ratified verbal intent - each waits for "
                 "Chris to update the Confluence spec, then we edit + live-VIU.\n\n")
        fh.write("| Internal ID | Case | Report | Driving source | What needs to be done (plain) |\n")
        fh.write("|---|---|---|---|---|\n")
        for iid,cid,rep,src,cls,todo in pend:
            case = f"[{cid}]({link(cid)})" if cid else "_new - no C-ID yet_"
            fh.write(f"| {iid} | {case} | {rep} | {src} | {todo} |\n")

        fh.write("\n## Confirmed already-matching (no change needed) - notable\n\n")
        fh.write("- **All-Time removal (video P9):** every report's date-range case correctly shows "
                 "NO 'All Time' option (matches spec). Caveat: Stefan noted the backend caps history "
                 "at ~365 days, so a Custom range beyond ~1 year returns limited data - a VIU/data "
                 "caveat, not a wording change.\n")
        fh.write("- **'Sales By Representative' naming (video P5):** SBR-NAV cases already use the "
                 "full 'Sales By Representative' name; 'Associate' appears nowhere.\n")
        fh.write("- **'Parts' nav section (video P2):** PV-NAV-01 (C30322) and IV-NAV-01 (C30534) "
                 "already place Parts Velocity + Inventory Value under a 'Parts' nav group.\n")
        fh.write("- **No 'snapshot taken X days ago' label (video P32):** no case expects that "
                 "label; the Inventory Value 'As of <date>' indicator is a different, kept "
                 "indicator.\n")
        fh.write("- **Labor-delta colors (video P14):** SBC/SBR (invoiced-minus-worked) and WIP "
                 "(quoted-minus-worked) cases render green(+)/black(0.0)/red(-) per spec; the WIP "
                 "basis-vs-video difference is the LIVE-VIU-PENDING row above.\n")

        fh.write("\n## Q2 permission model (user ruling 2026-07-28)\n\n")
        fh.write("All permission cases KEEP the shipped MIXED model (Sales By Customer = dedicated "
                 "permission; Parts Velocity + Inventory Value = inventory-reports access; Sales By "
                 "Rep = performance group). They are **not edited**. The PO-vs-build discrepancy "
                 "(Chris wants 'normal reports access' for all) is captured for Chris/dev in "
                 "`build/report-suite/chris-answers-2026-07-28/Q2-permission-discrepancy-for-Chris-dev.md`.\n")
    return out


if __name__ == "__main__":
    xlsx, n_pend_x = write_xlsx()
    n_pend = sum(1 for r in ROWS if r[4]=='PENDING-CHRIS')
    md = write_md(n_pend)
    print("Wrote:", xlsx)
    print("Wrote:", md)
    from collections import Counter
    c = Counter(r[4] for r in ROWS)
    print("Rows by classification:", dict(c), "| total rows:", len(ROWS))
