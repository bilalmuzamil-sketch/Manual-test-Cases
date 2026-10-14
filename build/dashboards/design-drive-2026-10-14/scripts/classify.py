"""Stage 2: classify every row of universe.json. Rules are explicit and ordered; every row ends with a class.
Classes: DATA · COVERED (C-ids) · OUT-OF-SCOPE (ruling) · DESIGN NOTE · SPEC-CONFLICT (PO question) · CASE-NEEDED."""
import json,glob,re,html,sys,collections
S=sys.argv[1]
U=json.load(open(S+'/inv/universe.json'))
cs={};own={}
for f in glob.glob(S+'/cases106/*.json'):
    j=json.load(open(f)); t=' '.join(str(j.get(k) or '') for k in ('title','custom_preconds','custom_steps','custom_expected'))
    cs[j['id']]=re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',t))); own[j['id']]=j['_orig_created_by']
anc=collections.defaultdict(set)
for i,t in cs.items():
    for a in re.findall(r'S\d+-[RNE]\d+a?',t): anc[a].add(i)
def by(*anchors):
    out=set()
    for a in anchors: out|=anc.get(a,set())
    return sorted(out)
def pat(rx):
    return sorted(i for i,t in cs.items() if re.search(rx,t,re.I))
C=lambda ids: ', '.join('C%d'%i for i in ids[:6])+(' …(+%d)'%(len(ids)-6) if len(ids)>6 else '')
BEFORE_RULING='OUT-OF-SCOPE: "Before · production" screen — the old dashboard this project replaces (PRD v44 §2 Out of Scope; Main board: "Before is production\'s code as it ships today"). Not a target; no case tests old behaviour.'
# board prefix -> anchors the caption illustrates (for DESIGN NOTE / COVERED traceability)
BOARD={'01_Opens_After':['S7-R7','S7-R8','S1-R1','S1-R5','S4-R4','S4-R6','S4-R8'],'02_Last12_After':['S7-R1','S7-R3','S7-R4','S10-R1','S10-R2'],
 '03_Range_After':['S7-R2'],'04_Revenue_After':['S6-R3','S6-R2','S10-R2'],'04_Revenue_Hover':['S9-R1','S9-R8'],
 '05_Billing_After':['S6-R4','S8-R3','S9-R4','S7-R5'],'05_Billing_Hover':['S9-R5'],'05_Billing_Legend':[],
 '06_TechEff_After':['S6-R5','S8-R1','S7-R5'],'06_TechEff_Hover':['S9-R7'],'06_TechEff_Legend':[],
 '07_TechUtil_After':['S6-R6','S8-R1','S7-R5'],'07_TechUtil_Hover':['S9-R7'],'07_TechUtil_Legend':[],
 '08_Customers_After':['S6-R7','S5-R6'],'08_Customers_New':['S2-R2','S5-R1'],'09_AtRisk_After':['S6-R8','S5-N2','S10-N1'],
 '09_AtRisk_Window':['S5-R10','S5-R11','S5-R14'],'10_sales_After':['S11-R1','S11-R2','S11-R2a'],'10_sales_Hidden':['S11-R2','S11-E1','S6-R16'],
 '10_sales_Hover':['S11-R7'],'11_saa_Hover':['S9-R5','S11-R7'],'11_saa_Legend':[],'11_service-advisor-analysis_After':['S11-R1','S11-R2','S11-R2a'],
 '11_service-advisor-analysis_Hidden':['S11-R2','S11-E1'],'12_te_Hover':['S11-R7'],'12_te_Legend':[],'12_technician-efficiency_After':['S11-R1','S11-R2','S11-R2a'],
 '12_technician-efficiency_Hidden':['S11-R2','S11-E1'],'13_technician-utilization_After':['S11-R1','S11-R2','S11-R2a'],'13_technician-utilization_Hidden':['S11-R2','S11-E1'],
 '13_tu_Hover':['S11-R7'],'13_tu_Legend':[],'14_Phone_After':['S6-E1','S6-E2','S6-E3','S12-N1'],
 '15_Empty_Design':['S3-E3','S4-R12','S4-R13','S4-R15','S4-R16','S4-R18','S5-R16','S4-E2']}
LEGEND=[351723,351734]
SC={}  # special decisions keyed by substring of text
def special(t):
    tl=t.lower()
    if tl.startswith('last updated'):
        return 'SPEC-CONFLICT','D-10 (already in the register, not sent): footer "Last updated: N minutes ago" implies cached figures; PRD v44 S3-R1 "There is no freshness allowance and no \\"up to N minutes behind\\" in this spec." No PRD requirement for this footer.',[88652]
    if 'no report arrow on technician efficiency' in tl:
        return 'SPEC-CONFLICT','NEW D-11: approved row-15 drawing (after-empty-tiles.png) shows no report link on the Technician Efficiency and Technician Utilization tiles; PRD v44 S4-R1 "Each KPI tile shows a label, a headline value, a sparkline, a date-range control, and a report link." and S10-R1. Cases follow the PRD.',by('S4-R1','S10-R1')
    if tl.startswith('at risk reads $40.50'):
        return 'SPEC-CONFLICT','NEW D-12: board 02 note says the At Risk card "now measures revenue the way Sales By Customer does, from the labor, parts and shop supplies stored on each invoice"; PRD v44 S5-R15 says "measured the way the Revenue tile measures revenue: invoice subtotals before any discount and before tax, minus credit memos." Cases follow S5-R15.',by('S5-R15','S5-R8','S5-R9')
    if tl.startswith('six cards on one screen. the four number cards'):
        return 'SPEC-CONFLICT','NEW D-13 (confirm only): board 01 caption says "At Risk opens on 120 days. Every visit opens on these defaults, whatever was chosen last time (S7-R8)"; PRD v44 S5-R14 "The inactivity window the user chose is remembered and applied on their next visit" (board 09 agrees with S5-R14). Cases follow S5-R14 / S7-R8 (ranges only).',by('S5-R14','S7-R8','S7-R7')
    if 'dashed' in tl and ('gap' in tl or 'no value' in tl):
        return 'SPEC-CONFLICT','NEW D-14 (spec silent): the expanded charts bridge months with no value with a dashed line. PRD v44 defines gaps only for the sparkline (S4-R11 "interior gaps are preserved rather than closed up or drawn as zero"); for full charts its S4 context note says only "The full chart inside an expanded tile ... [is] unchanged." No quotable rule for full-chart gaps, so no case is written (Rules 58/64).',by('S9-R1','S9-R2','S9-R3')
    if tl.startswith('$0.00 (12mo) · 0 customers'):
        return 'SPEC-CONFLICT','D-4 (already in the register): PRD v44 S5-R8/S5-R9 define the At Risk supporting line for exactly one and for more than one customer only; the zero case is unspecified.',[351714,351715]
    if tl in ('inactive for','120 days (select inside the panel)'):
        return 'SPEC-CONFLICT','D-3 (already in the register): the expanded At Risk panel carries its own "Inactive for" select besides the tile pill; PRD v44 S5-R10 names one inactivity-window control on the tile.',[88628]+by('S5-R10')
    if 'avg ' in tl and re.search(r'\d{4} · avg',tl):
        return 'COVERED','Legend hover readout (design-only detail, cited to the board) — '+C(LEGEND)+'; its "avg" figure is open question D-1.',LEGEND
    return None
rows=[]
for u in U:
    t=u['text']; k=u['kind']; w=u['where'][0]; cls=reason=None; ids=[]
    sp=special(t)
    if sp: cls,reason,ids=sp
    elif k=='data':
        cls,reason='DATA','Sample record data from the QA Testing workplace (names, amounts, dates, axis ticks) — illustration only (Rule 117: examples, never fixed values).'
    elif k=='before' or re.search(r'_Before\.dc\.html|before-[a-z-]+\.png',w) and k!='sweep':
        cls,reason='OUT-OF-SCOPE',BEFORE_RULING
    elif k=='board' and 'Main.dc.html' in w:
        cls,reason='DESIGN NOTE','Canvas cover (Main board): title, PRD/ticket/branch/owner/status metadata, legend chips and the scope list of the 15 rows — describes the canvas, not product UI.'
    elif k=='topbar':
        if t in ('Reports','Dashboard'): ids=by('S1-R1','S1-R5','S1-R2'); cls,reason='COVERED','Top-navigation entry (S1-R1/S1-R5) — '+C(ids)
        elif t=='Work Orders': ids=by('S1-R8'); cls,reason='COVERED','Top-navigation entry where a user without access lands (S1-R8) — '+C(ids)
        elif 'hamburger' in t.lower() or 'logo' in t.lower(): ids=by('S1-N5','S1-N6','S1-N7','S1-N8'); cls,reason='COVERED','Logo / small-screen menu button — '+C(ids)
        elif t in ('ShopHub','QA Testing','MH'): cls,reason='DATA','Workplace name / signed-in user shown in the top bar (S1-R4 is covered by '+C(by('S1-R4'))+').'
        else: cls,reason='OUT-OF-SCOPE','Global top-bar element (other navigation entries, search, shortcut hint, notification count, user menu) not defined by the Dashboard PRD beyond S1-R5; Main board: "The wider search box in the top bar comes from develop, not from this PR."'
    elif k=='reportnav':
        if t in ('Sales','Sales By Customer','Advisor Analysis','Technician Efficiency','Technician Utilization'):
            ids=by('S10-R2','S11-R1'); cls,reason='COVERED','Reports side-menu entry of a linked report (S10-R2/S11-R1) — '+C(ids)+('; menu reads "Advisor Analysis" while the page and PRD say "Service Advisor Analysis" (wording difference already recorded in the register, 7 Oct)' if t=='Advisor Analysis' else '')
        else: cls,reason='OUT-OF-SCOPE','Reports side-menu entry or heading for a report this project does not touch (PRD v44 §2 Out of Scope: "Any new report. The dashboard reuses existing reports").'
    elif k=='reporttable':
        if t=='Invoiced' and pat(r'Invoiced\W{1,3}tab|tab\W{1,3}Invoiced|\(Invoiced\)'):
            ids=pat(r'Invoiced\W{1,3}tab|tab\W{1,3}Invoiced|\(Invoiced\)'); cls,reason='COVERED','The Technician Efficiency report’s Invoiced view that S3-R2 names for parity — '+C(ids)
        else: cls,reason='OUT-OF-SCOPE','The report’s own detail table/tabs, unchanged by this project ("The details below are the before board’s, unchanged"); PRD v44 Story 11 adds only the chart above it (S11-R1).'
    elif k=='label' and t=='Today':
        cls,reason='DESIGN NOTE','The shared calendar’s Today shortcut ("the same calendar and the same presets" — board 03); not a PRD preset (S7-R2).'
    elif k=='label' and t=='October':
        cls,reason='DATA','Calendar month heading (sample date).'
    elif k=='sweep' and t=='Main':
        cls,reason='DESIGN NOTE','Design-canvas board name (cover board).'
    elif u['cases'] and not (k in ('canvas','sweep') and not re.fullmatch(r'\d\d_[\w-]+',t)) and (len(t)>20 or [i for i in u['cases'] if re.search(r'(?<![A-Za-z0-9])'+re.escape(t)+r'(?![A-Za-z0-9])',cs[i])]):
        hh=[i for i in u['cases'] if re.search(r'(?<![A-Za-z0-9])'+re.escape(t)+r'(?![A-Za-z0-9])',cs[i])] if len(t)<=20 else u['cases']
        cls,reason,ids='COVERED','Text appears (exact case, whole word) in the case(s): '+C(hh),hh
    elif k=='reporttable':
        cls,reason='OUT-OF-SCOPE','The report\'s own detail table/tabs, unchanged by this project ("The details below are the before board\'s, unchanged"); PRD v44 Story 11 adds only the chart above it (S11-R1).'
    elif k=='reportnav':
        cls,reason='OUT-OF-SCOPE','Reports side-menu entry for a report this project does not touch (PRD v44 §2 Out of Scope: "Any new report. The dashboard reuses existing reports").'
    elif k=='topbar':
        if 'hamburger' in t.lower() or 'logo' in t.lower():
            ids=by('S1-N5','S1-N6','S1-N7','S1-N8'); cls,reason='COVERED','Logo / small-screen menu button — '+C(ids)
        elif t=='ShopHub':
            cls,reason='DATA','Workplace name shown in the workplace selector (S1-R4 covered by '+C(by('S1-R4'))+').'
        else:
            cls,reason='OUT-OF-SCOPE','Global top-bar element (search, shortcut hint, notifications, user menu) not defined by the Dashboard PRD; Main board: "The wider search box in the top bar comes from develop, not from this PR."'
    elif k=='canvas' or (k=='sweep' and not re.fullmatch(r'\d\d_[\w-]+',t)):
        cls,reason='OUT-OF-SCOPE','Design-canvas tool chrome (Play/Export/Pages/Zoom/Fit menus, tooltips, "Click to load", "Read-only", board-name labels) — the Claude Design viewer, not the Dashboard product the PRD describes.'
    elif k=='sweep':
        if t in ('Click to load','Tap to load','Read-only') or 'PAGE _whole_board' in t or re.fullmatch(r'\d\d_[\w-]+|Main',t):
            cls,reason='DESIGN NOTE','Design-canvas viewer chrome / board name (not product UI).'
        else:
            cls,reason='DESIGN NOTE','Canvas page text rendered by the sweep (viewer chrome).'
    elif k=='visual':
        tl=t.lower()
        if 'dashed outline' in tl: ids=by('S4-R15','S4-R16','S5-R16'); cls,reason='COVERED','Empty-chart placeholder — '+C(ids)
        elif 'flat line along the bottom' in tl: cls,reason='OUT-OF-SCOPE','Superseded empty state (before-empty-tiles.png "drawn from this build\'s rules"); replaced by PRD v42+ S4-R12..R18 and the PO decision of 7 Oct 2026 (Chris Ward, Slack).'
        elif 'previous / next page' in tl: ids=pat(r'1 - 10 of'); cls,reason='COVERED','Detail-table pager — '+C(ids)
        elif 'no filter control on the revenue panel' in tl: ids=by('S6-R3','S8-R1','S8-R3'); cls,reason='DESIGN NOTE','Consistent with PRD v44 Story 8 (filters only on the technician and Billing Efficiency charts); see '+C(ids)
        elif 'labor delta' in tl: ids=[88628,88642]; cls,reason='DESIGN NOTE','Design-only colour/format of Labor Delta (red in brackets / green with +); PRD v44 S6-R7 does not specify table columns. Column covered by '+C(ids)+'; the column itself was already raised with the PO (PROJECT-STATE 23 Sep).'
        elif 'at risk customers card has no footer' in tl: ids=by('S6-E3'); cls,reason='COVERED','S6-E3 — '+C(ids)
        else: cls,reason='DESIGN NOTE','Visual detail'
    elif k=='board':
        b=re.match(r'(?:boards/)?([\w-]+?)\.dc\.html',w); b=b.group(1) if b else ''
        if b=='15_Empty_Now':
            cls,reason='OUT-OF-SCOPE','Superseded "today" empty state ("n/a", flat line); replaced by PRD v42+ S3-E3 / S4-R12..R18 and the PO decision of 7 Oct 2026.'
        elif b=='Main':
            cls,reason='DESIGN NOTE','Canvas cover: title, PRD/ticket/branch/owner/status metadata, legend chips and the scope list of the 15 rows — describes the canvas, not product UI.'
        elif b in BOARD:
            ids=by(*BOARD[b]) if BOARD[b] else LEGEND
            cls,reason='DESIGN NOTE','Designer caption / screenshot label for board '+b+'; the behaviour it describes is tested by '+C(ids)+' (expected results quote the PRD, not the caption).'
        else:
            cls,reason='DESIGN NOTE','Board caption'
    elif k=='label':
        tl=t.lower()
        if re.search(r'invoiced / [\d.,]+ clocked|invoiced tech hrs / [\d.,]+ clocked|wo hrs / [\d.,]+ clocked',tl):
            ids=by('S4-R5','S4-R7','S4-R9'); cls,reason='COVERED','Supporting-line pattern (numbers are sample data) — '+C(ids)
        elif tl.startswith('top: '):
            ids=[88608]; cls,reason='COVERED','"Top: {name}" supporting line — C88608 (name is sample data)'
        elif tl.startswith('elr: '):
            ids=by('S9-R5'); cls,reason='COVERED','ELR on hover (S9-R5) — '+C(ids)
        elif tl.startswith('- (grey dash'):
            ids=by('S3-E3'); cls,reason='COVERED','Grey "-" headline (S3-E3) — '+C(ids)
        elif tl.startswith('sun mon'):
            ids=by('S7-R2'); cls,reason='DESIGN NOTE','Weekday header of the shared calendar ("the same calendar and the same presets" — board 03); presets covered by '+C(ids)
        elif tl=='•••' or tl.startswith('••• '):
            ids=by('S11-R2a'); cls,reason='COVERED','The report\'s ⋯ (more actions) menu that S11-R2a positions the chart toggle against — '+C(ids)
        elif 'column-chooser' in tl:
            cls,reason='OUT-OF-SCOPE','The Technician Utilization report\'s own column control, unchanged by this project.'
        elif tl.startswith('location: qa testing'):
            ids=by('S11-R3'); cls,reason='OUT-OF-SCOPE','The Technician Utilization report\'s own Location filter (existing); S11-R3 (chart follows the report\'s filters) is covered by '+C(ids)+'. "QA Testing" is sample data.'
        elif tl.startswith('technician efficiency (report title') or tl.startswith('technician utilization (report title'):
            ids=by('S11-R1'); cls,reason='COVERED','Report page title — '+C(ids)
        elif tl.startswith('date: this year (toolbar'):
            ids=by('S11-R2','S11-R2a'); cls,reason='COVERED','Report toolbar after Hide Chart — '+C(ids)
        else:
            cls,reason='UNCLASSIFIED',''
    else:
        cls,reason='UNCLASSIFIED',''
    rows.append({**u,'class':cls,'reason':reason,'case_ids':ids})
# CASE-NEEDED: v44 requirements with no case, each tied to the design rows that show the behaviour
need=[('S8-R5a','The table under the chart follows the same filter: it lists only the selected technicians, or only the selected advisor. With no advisor chosen it lists every advisor, as the chart does.','after-open-techEfficiencyKpi.png / after-open-techUtilizationKpi.png ("Technician: All technicians" over the Technician Efficiency / Technician Utilization table); after-open-billingEfficiencyKpi.png ("Advisor" over the Advisor Analysis table)', by('S8-R1','S8-R2','S8-R3','S8-R4','S8-R5')),
      ('S8-N1a','In the same case the table under the chart is hidden too, rather than shown with no rows.','not drawn in the design (no board shows every technician deselected); spec-only', by('S8-N1')),
      ('S4-R11a','On Revenue and the count tiles, a bucket with no sales is a point at 0. Only a ratio tile\'s "-" (S3-E3) contributes no point.','after-dash-default.png (Revenue This Month sparkline returns to the baseline between sales days); 15_Empty_Design', by('S4-R11','S5-R5','S4-R12','S4-R13'))]
for a,q,where,rel in need:
    rows.append({'text':f'[{a}] '+q,'where':[where],'source':'PRD v44 (added since v42)','kind':'spec','cases':[],'class':'CASE-NEEDED','reason':f'PRD v44 {a} (new since our v42 cases, 13 Oct 2026); no case cites it. Nearest existing cases to extend or pair with: '+C(rel),'case_ids':rel})
for r in rows:
    if r['class']=='COVERED' and 'exact case' in r['reason'] and r['kind']=='label':
        col=pat(r'columns?[^.]{0,140}(?<![A-Za-z])'+re.escape(r['text'])+r'(?![A-Za-z])')
        if r['text']=='Apply': col=pat(r'click Apply|Apply(?= if the calendar)')
        if col and len(col)<len(r['case_ids']): r['case_ids']=col; r['reason']='Text appears (as a column/control the case tells the tester to read or click) in: '+C(col)
json.dump(rows,open(S+'/inv/classified.json','w'),indent=0,ensure_ascii=False)
cnt=collections.Counter(r['class'] for r in rows)
print(cnt, 'total',len(rows))
for r in rows:
    if r['class']=='UNCLASSIFIED': print('UNCL',r['kind'],r['text'][:100],r['where'][0][:50])
