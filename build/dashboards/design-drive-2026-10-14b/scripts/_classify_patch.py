import re,sys
src=open(sys.argv[1]).read()
a=src.index("BOARD={"); b=src.index("rows=[]")
NEW_MID=r'''BOARD={'01_Opens_After':['S7-R7','S7-R8','S1-R1','S1-R5','S4-R4','S4-R6','S4-R8'],'02_Last12_After':['S7-R1','S7-R3','S7-R4','S10-R1','S10-R2','S5-R15'],
 '03_Range_After':['S7-R2','S7-R2a'],'04_Revenue_After':['S6-R3','S6-R3a','S6-R2','S10-R2'],'04_Revenue_Hover':['S9-R1','S9-R8','S6-R3a'],
 '05_Billing_After':['S6-R4','S8-R3','S9-R4','S7-R5'],'05_Billing_Hover':['S9-R5'],
 '06_TechEff_After':['S6-R5','S8-R1','S7-R5'],'06_TechEff_Hover':['S9-R7'],
 '07_TechUtil_After':['S6-R6','S8-R1','S7-R5'],'07_TechUtil_Hover':['S9-R7'],
 '08_Customers_After':['S6-R7','S5-R6'],'08_Customers_New':['S2-R2','S5-R1'],'09_AtRisk_After':['S6-R8','S6-R8a','S5-N2','S10-N1'],
 '09_AtRisk_Window':['S5-R10','S5-R11','S5-R14'],'10_sales_After':['S11-R1','S11-R2','S11-R2a'],'10_sales_Hidden':['S11-R2','S11-E1','S6-R16'],
 '10_sales_Hover':['S11-R7'],'11_saa_Hover':['S9-R5','S11-R7'],'11_service-advisor-analysis_After':['S11-R1','S11-R2','S11-R2a'],
 '11_service-advisor-analysis_Hidden':['S11-R2','S11-E1'],'12_te_Hover':['S11-R7'],'12_technician-efficiency_After':['S11-R1','S11-R2','S11-R2a'],
 '12_technician-efficiency_Hidden':['S11-R2','S11-E1'],'13_technician-utilization_After':['S11-R1','S11-R2','S11-R2a'],'13_technician-utilization_Hidden':['S11-R2','S11-E1'],
 '13_tu_Hover':['S11-R7'],'14_Phone_After':['S6-E1','S6-E2','S6-E3','S12-N1'],
 '15_Empty_After':['S3-E3','S4-R12','S4-R13','S4-R15','S4-R16','S4-R18','S5-R16','S4-E2','S10-R1']}
LEGEND=[351723,351734]
S910='CASE-NEEDED (S9-R10, new in PRD v45/v48): "Hovering a name in a chart legend shows that person\'s most recent value and the month it is from, for example "120% · Aug 2026". It shows no average; the table beside the chart gives the figure for the whole range." No case cites S9-R10. The legend cases C351723 and C351734 still EXPECT the average (e.g. "Aug 2026 · avg 107%") and call the readout design-only, so they now disagree with the PRD and with the design\'s own caption ("removed by S9-R10, build change pending"). PO answer 12: log the build\'s " · avg" as a bug against S9-R10. D-1 is closed by the PRD.'
S5N3='CASE-NEEDED (S5-N3, new in PRD v45): "The inactivity window has one control, the pill on the At Risk Customers tile. The expanded At Risk Customers table follows it (S5-R12) and has no inactivity control of its own." The design now shows no control inside the panel (D-3 closed). No case cites S5-N3, and C88628 still EXPECTS an "Inactive for" select at the panel\'s top right, so C88628 now disagrees with the design and the PRD.'
S5R9Z='CASE-NEEDED (S5-R9 zero wording, PRD v45): "With none at risk it reads "$0.00 (12mo) · 0 customers", so the line never disappears." The design shows exactly this (D-4 At Risk half closed). No case asserts it: C351714 still says "Write down what you see" under the old open question, and C88609 / C88630 cite S5-R9 with the pre-v45 wording.'
def special(t,w=''):
    tl=t.lower(); before=bool(re.search(r'before-[a-z-]+\.png|_Before\.dc\.html',w))
    if before: return None
    if tl.startswith('last updated'):
        return 'SPEC-CONFLICT','D-10: footer "Last updated" on an After screen; PRD v48 S3-N2 forbids it.',[581907]
    if 'removed by s9-r10' in tl or ('avg ' in tl and re.search(r'\d{4} · avg',tl)) or tl.startswith('aug 2026 · avg'):
        return 'CASE-NEEDED',S910,LEGEND
    if 's5-n3' in tl or 'no inactivity control' in tl or 'no control inside the panel' in tl:
        return 'CASE-NEEDED',S5N3,[88628]+by('S6-R8a')
    if tl.startswith('$0.00 (12mo) · 0 customers'):
        return 'CASE-NEEDED',S5R9Z,[351714,88609,88630]
    if 'no top: line' in tl:
        return 'SPEC-CONFLICT','D-4b (still open, the Sales by Customer half of D-4): at 0 customers the tile shows no "Top:" line (15_Empty_After / after-empty-tiles.png). PRD v48 S5-R3: "The Sales by Customer tile shows a supporting line reading "Top: {top customer name}"." and S4-R18 "The placeholder changes nothing else on the tile. The headline and the supporting line show their usual values." The PRD does not say what the line reads with no customer; PO answer 9 covered At Risk only.',[351714,88608,88611]
    if tl.startswith('six cards on one screen. the four number cards'):
        return 'SPEC-CONFLICT','D-13 (still open, confirm only; caption unchanged tonight): board 01 says "At Risk opens on 120 days. Every visit opens on these defaults, whatever was chosen last time (S7-R8)"; PRD v48 S5-R14 "The inactivity window the user chose is remembered and applied on their next visit, in place of the 120-day default (S5-R11)" (board 09 agrees with S5-R14). Cases follow S5-R14.',by('S5-R14','S7-R8','S7-R7')
    if 'report arrow beside every tile name' in tl or tl.startswith('the three ratio tiles read a grey') or 'every tile keeps its report arrow' in tl or 'every report arrow kept' in tl:
        return 'COVERED','D-11 closed: the design now shows the report arrow on every tile with no data, Technician Efficiency and Technician Utilization included (S10-R1, S4-R18; PO answer 7) — '+C([581906,88623,88604]),[581906,88623,88604]
    if tl.startswith('at risk reads 0 on its 120-day window'):
        return 'COVERED','D-12 closed: board 02 now says At Risk measures revenue "the way the Revenue tile and the Sales report do: invoice subtotals before discount and tax, minus credit memos (S5-R15)", matching PRD v48 S5-R15 — '+C(by('S5-R15')),by('S5-R15')
    if 'dashed' in tl and ('gap' in tl or 'no value' in tl or 'across the empty' in tl or 'across months' in tl):
        return 'COVERED','D-14 closed: PRD v48 S9-R9 "In an expanded chart, a month with no value is drawn as a dashed line joining the points on either side of it." — '+C([581904]),[581904]
    if tl.startswith('oct 1, 2020 - oct 28, 2020') or 'custom range of up to 366 days' in tl:
        return 'COVERED','Custom range on the tile picker (S7-R2a: presets + calendar up to 366 days + Today) — '+C([581901]),[581901]
    if 'amounts drawn as links' in tl:
        return 'COVERED','At Risk revenue link (S6-R8a) and order highest first (S6-R8) — '+C([581902,88613]),[581902,88613]
    if 'nov 2025 .. oct 2026' in tl or 'twelve monthly bars' in tl:
        return 'COVERED','Expanded chart follows the tile range; Last 12 Months = twelve months to the current month (S6-R3a, S10-R8) — '+C([581903,88612,351728]),[581903,88612,351728]
    if 'flat along the bottom' in tl or 'isolated points' in tl or 'start part-way' in tl:
        return 'COVERED','Sparkline gaps kept (S4-R11) and constant figure drawn flat along the bottom (S4-R11b) — '+C([581900,88606]),[581900,88606]
    if 'drops to the baseline' in tl:
        return 'COVERED','Revenue bucket with no sales is a point at 0 (S4-R11a) — '+C([581899]),[581899]
    if 'no last updated' in tl:
        return 'COVERED','No "Last updated" line (S3-N2; D-10 closed) — '+C([581907]),[581907]
    if 'keeps its twelve-month trend line' in tl or tl.startswith('real zeros stay'):
        return 'COVERED','At Risk sparkline is twelve monthly points (S5-R13); real zeros keep their headline (S4-E2) — '+C([88610,351714,351715]),[88610,351714,351715]
    return None
'''
src=src[:a]+NEW_MID+src[b:]
src=src.replace("sp=special(t)","sp=special(t,w)")
src=src.replace("elif b in BOARD:\n            ids=by(*BOARD[b]) if BOARD[b] else LEGEND","elif b in BOARD:\n            ids=by(*BOARD[b]) if BOARD[b] else LEGEND")
# CASE-NEEDED spec-only rows: replace the v44 'need' list
na=src.index("need=["); nb=src.index("for a,q,where,rel in need:")
src=src[:na]+r'''need=[('S5-N3','The inactivity window has one control, the pill on the At Risk Customers tile. The expanded At Risk Customers table follows it (S5-R12) and has no inactivity control of its own.','09_AtRisk_After.dc.html caption and after-open-atRiskHero.png (no control inside the panel)',[88628]+by('S5-R12')),
      ('S9-R10','Hovering a name in a chart legend shows that person\'s most recent value and the month it is from, for example "120% · Aug 2026". It shows no average; the table beside the chart gives the figure for the whole range.','05/06/07/11/12/13 *_Legend boards (captions); the six legend screenshots still show " · avg" (build change pending)',LEGEND),
      ('S5-R9 (zero wording)','With none at risk it reads "$0.00 (12mo) · 0 customers", so the line never disappears.','after-dash-default.png, after-dash.png, after-phone.png, after-empty-tiles.png',[351714,88609,88630]),
      ('S11-E2','A chart on a report page with nothing to show for the selected range reads "No data for selected date range", the message these charts already use in production. It does not use the tile\'s dashed empty-chart outline.','not drawn in the design (spec-only); C581905 covers the expanded-tile half (S9-R11); C433976 (Vladimir Tomovic) mentions the text in its preconditions only',[581905,433976])]
'''+src[nb:]
src=src.replace("'source':'PRD v44 (added since v42)'","'source':'PRD v48 (no case cites it)'").replace("f'PRD v44 {a} (new since our v42 cases, 13 Oct 2026); no case cites it. Nearest existing cases to extend or pair with: '+C(rel)","f'PRD v48 {a}: no case of ours asserts it. Related cases (to extend, or that now disagree): '+C(rel)")
src=src.replace("cs[j['id']]=re.sub","cs[j['id']]=re.sub").replace("/cases106/","/cases123/")
src=src.replace("b=='15_Empty_Now'","b=='15_Empty_Now_REMOVED'")
open(sys.argv[2],'w').write(src)
