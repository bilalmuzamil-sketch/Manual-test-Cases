"""Stage 2: classify every row of universe.json. Rules are explicit and ordered; every row ends with a class.
Classes: DATA · COVERED (C-ids) · OUT-OF-SCOPE (ruling) · DESIGN NOTE · SPEC-CONFLICT (PO question) · CASE-NEEDED."""
import json,glob,re,html,sys,collections
S=sys.argv[1]
U=json.load(open(S+'/inv/universe.json'))
cs={};own={}
for f in glob.glob(S+'/cases123/*.json'):
    j=json.load(open(f)); t=' '.join(str(j.get(k) or '') for k in ('title','custom_preconds','custom_steps','custom_expected'))
    cs[j['id']]=re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',t))); own[j['id']]=j.get('_orig_created_by',j['created_by'])
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
BEFORE_RULING='OUT-OF-SCOPE: "Before · production" screen — the old dashboard this project replaces (PRD v48 §2 Out of Scope; Main board: "Before is production\'s code as it ships today"). Not a target; no case tests old behaviour.'
# board prefix -> anchors the caption illustrates (for DESIGN NOTE / COVERED traceability)
BOARD={'01_Opens_After':['S7-R7','S7-R8','S1-R1','S1-R5','S4-R4','S4-R6','S4-R8'],'02_Last12_After':['S7-R1','S7-R3','S7-R4','S10-R1','S10-R2','S5-R15'],
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
rows=[]
for u in U:
    t=u['text']; k=u['kind']; w=u['where'][0]; cls=reason=None; ids=[]
    sp=special(t,w)
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
        else: cls,reason='OUT-OF-SCOPE','Reports side-menu entry or heading for a report this project does not touch (PRD v48 §2 Out of Scope: "Any new report. The dashboard reuses existing reports").'
    elif k=='reporttable':
        if t=='Invoiced' and pat(r'Invoiced\W{1,3}tab|tab\W{1,3}Invoiced|\(Invoiced\)'):
            ids=pat(r'Invoiced\W{1,3}tab|tab\W{1,3}Invoiced|\(Invoiced\)'); cls,reason='COVERED','The Technician Efficiency report’s Invoiced view that S3-R2 names for parity — '+C(ids)
        else: cls,reason='OUT-OF-SCOPE','The report’s own detail table/tabs, unchanged by this project ("The details below are the before board’s, unchanged"); PRD v48 Story 11 adds only the chart above it (S11-R1).'
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
        cls,reason='OUT-OF-SCOPE','The report\'s own detail table/tabs, unchanged by this project ("The details below are the before board\'s, unchanged"); PRD v48 Story 11 adds only the chart above it (S11-R1).'
    elif k=='reportnav':
        cls,reason='OUT-OF-SCOPE','Reports side-menu entry for a report this project does not touch (PRD v48 §2 Out of Scope: "Any new report. The dashboard reuses existing reports").'
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
        elif 'no filter control on the revenue panel' in tl: ids=by('S6-R3','S8-R1','S8-R3'); cls,reason='DESIGN NOTE','Consistent with PRD v48 Story 8 (filters only on the technician and Billing Efficiency charts); see '+C(ids)
        elif 'report-link icon beside' in tl: ids=[88604,88623,88629]; cls,reason='COVERED','Report link on each KPI tile and Sales by Customer, none on At Risk (S4-R1, S10-R1, S10-N1) — '+C(ids)
        elif 'previous / next arrows' in tl and 'month and year' in tl: ids=by('S7-R2','S7-R2a'); cls,reason='DESIGN NOTE','Shared calendar navigation (design-only detail of the reports\' date picker, S7-R2a) — '+C(ids)
        elif 'labor delta' in tl: ids=[88628,88642]; cls,reason='DESIGN NOTE','Design-only colour/format of Labor Delta (red in brackets / green with +); PRD v48 S6-R7 does not specify table columns. Column covered by '+C(ids)+'; the column itself was already raised with the PO (PROJECT-STATE 23 Sep).'
        elif 'at risk customers card has no footer' in tl: ids=by('S6-E3'); cls,reason='COVERED','S6-E3 — '+C(ids)
        else: cls,reason='DESIGN NOTE','Visual detail'
    elif k=='board':
        b=re.match(r'(?:boards/)?([\w-]+?)\.dc\.html',w); b=b.group(1) if b else ''
        if b=='15_Empty_Now_REMOVED':
            cls,reason='OUT-OF-SCOPE','Superseded "today" empty state ("n/a", flat line); replaced by PRD v42+ S3-E3 / S4-R12..R18 and the PO decision of 7 Oct 2026.'
        elif b=='Main':
            cls,reason='DESIGN NOTE','Canvas cover: title, PRD/ticket/branch/owner/status metadata, legend chips and the scope list of the 15 rows — describes the canvas, not product UI.'
        elif b.endswith('_Legend'):
            ids=LEGEND; cls,reason='DESIGN NOTE','Board title / shot label for '+b+' (legend hover). The legend cases '+C(ids)+' still expect an average; S9-R10 (no average) has no case yet — see the CASE-NEEDED rows.'
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
        elif re.fullmatch(r'\d[\d,]* customers?',t):
            ids=by('S5-R2'); cls,reason='COVERED','Sales by Customer headline "{count} customers" (S5-R2; number is sample data) — '+C(ids)
        elif re.fullmatch(r'\w{3} \d{1,2}, \d{4} — \w{3} \d{1,2}, \d{4}',t):
            ids=pat(r'calendar header'); cls,reason='COVERED','Calendar header showing the chosen dates (dates are sample data) — '+C(ids)
        elif re.fullmatch(r'Range: \d+ days',t):
            ids=pat(r'Range: (?:N|\d+) days'); cls,reason='COVERED','"Range: N days" readout of the shared calendar (number is sample data) — '+C(ids)
        elif tl.startswith('revenue: $'):
            ids=[351724,351735,581903]; cls,reason='COVERED','Revenue chart tooltip "Revenue: $n" (amount is sample data) — '+C(ids)
        elif re.fullmatch(r'\d+ days(?: \(pill on the at risk tile\))?',tl):
            ids=by('S5-R10','S5-R12'); cls,reason='COVERED','At Risk window pill on a non-default window (S5-R10/S5-R12) — '+C(ids)
        elif re.fullmatch(r'\$[\d,.]+ \(12mo\) · \d+ customers',t):
            ids=by('S5-R9'); cls,reason='COVERED','At Risk supporting line for more than one customer (S5-R9; figures are sample data) — '+C(ids)
        else:
            cls,reason='UNCLASSIFIED',''
    else:
        cls,reason='UNCLASSIFIED',''
    rows.append({**u,'class':cls,'reason':reason,'case_ids':ids})
# CASE-NEEDED: v44 requirements with no case, each tied to the design rows that show the behaviour
need=[('S5-N3','The inactivity window has one control, the pill on the At Risk Customers tile. The expanded At Risk Customers table follows it (S5-R12) and has no inactivity control of its own.','09_AtRisk_After.dc.html caption and after-open-atRiskHero.png (no control inside the panel)',[88628]+by('S5-R12')),
      ('S9-R10','Hovering a name in a chart legend shows that person\'s most recent value and the month it is from, for example "120% · Aug 2026". It shows no average; the table beside the chart gives the figure for the whole range.','05/06/07/11/12/13 *_Legend boards (captions); the six legend screenshots still show " · avg" (build change pending)',LEGEND),
      ('S5-R9 (zero wording)','With none at risk it reads "$0.00 (12mo) · 0 customers", so the line never disappears.','after-dash-default.png, after-dash.png, after-phone.png, after-empty-tiles.png',[351714,88609,88630]),
      ('S11-E2','A chart on a report page with nothing to show for the selected range reads "No data for selected date range", the message these charts already use in production. It does not use the tile\'s dashed empty-chart outline.','not drawn in the design (spec-only); C581905 covers the expanded-tile half (S9-R11); C433976 (Vladimir Tomovic) mentions the text in its preconditions only',[581905,433976])]
for a,q,where,rel in need:
    rows.append({'text':f'[{a}] '+q,'where':[where],'source':'PRD v48 (no case cites it)','kind':'spec','cases':[],'class':'CASE-NEEDED','reason':f'PRD v48 {a}: no case of ours asserts it. Related cases (to extend, or that now disagree): '+C(rel),'case_ids':rel})
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
