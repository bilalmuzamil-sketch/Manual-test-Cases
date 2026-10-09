import json,re,sys
sys.path.insert(0,'/tmp/cln/refine'); from lib import *
L={str(c['id']):c for c in json.load(open('/tmp/cln/dash-live-1009.json'))}
R100='EVR Travel to EVO ($100 an hour)'; R150='Calgary Transit Rate ($150 an hour)'
NEWLOC=lambda name: f'profile icon {G} Settings {G} Locations {G} New Location: Name {name}, the address fields, Timezone, Telephone, Shop Supplies Charge 0 % {G} Save &amp; Close (if a location with this name already exists, reuse it only if it still matches the precondition). It then appears in your Change Location list; to switch to it, {LOC_ROUTE}'
CHGLOC='(profile icon &gt; Change Location)'
def stepfix(k,pairs=()):
    s=L[k]['custom_steps']
    s=re.sub(r'<li>Open the dashboard', '<li>Click Dashboard in the top menu', s)
    s=re.sub(r'Pick (ZZAUTOTEST [A-Za-z -]+?) in the workplace selector', r'Change location to \1 '+CHGLOC, s)
    s=re.sub(r'<li>Pick (ZZAUTOTEST [A-Za-z -]+?) and', r'<li>Change location to \1 '+CHGLOC+' and', s)
    s=s.replace('With your busy workplace selected','With your busy location selected')
    s=s.replace('Pick the workplace with the at-risk customer','Change location to the location with the at-risk customer '+CHGLOC)
    s=s.replace('open the dashboard','click Dashboard in the top menu').replace('As the Administrator,','As Admin,')
    for a,b in pairs:
        assert s.count(a)==1,(k,a[:60]); s=s.replace(a,b)
    return s
W=P_WIN
EMPTY_P='You are in a location (workplace) with nothing in it: no work order, invoice, credit or clocked time (for example ZZAUTOTEST Empty Shop).'
EMPTY_S=lambda n: f'For {n}: {NEWLOC("ZZAUTOTEST Empty Shop")}. Create nothing in it.'
DASH_P=('The Dash Shop data set exists, all created today in location ZZAUTOTEST Dash Shop, where nothing else is invoiced or clocked this month: '
 'work order 1 for customer ZZAUTOTEST Alpha Fleet, Service Advisor ZZAUTOTEST Advisor X, one labor line of 2.00 hours at $100.00 an hour with Tech Time 1.50 and technician ZZAUTOTEST Tech One, a part with Sell Price $50.00, and ZZAUTOTEST Tech One clocked exactly 2.50 hours on it; '
 'work order 2 for ZZAUTOTEST Bravo Fleet, Service Advisor ZZAUTOTEST Advisor Y, one labor line of 1.00 hour at $100.00 an hour with Tech Time 1.00 and technicians ZZAUTOTEST Tech One and ZZAUTOTEST Tech Two, a part with Sell Price $160.00, Tech One clocked exactly 0.25 hours and Tech Two exactly 0.75 hours on it. '
 'Neither work order has shop supplies, a fee or a discount; both are invoiced and not paid. Totals: invoices $250.00 and $260.00; 3.00 labor hours billed; 2.50 technician hours on the lines; 3.50 clocked hours; no internal (non work order) time.')
DASH_S=lambda n: (f'For {n}: if ZZAUTOTEST Dash Shop already exists with exactly this data, reuse it. Otherwise: (a) location: {NEWLOC("ZZAUTOTEST Dash Shop")}. '
 f'(b) staff: profile icon {G} Settings {G} Staff {G} New Staff Member, four times: ZZAUTOTEST Tech One and ZZAUTOTEST Tech Two with Role Technician and Time Clock on, ZZAUTOTEST Advisor X and ZZAUTOTEST Advisor Y with Role Service Advisor; each with Location ZZAUTOTEST Dash Shop and a Department {G} Save &amp; Close. Give each technician an email address you can open: they must accept the invitation email and set a password so you can sign in as them in a private window. '
 f'(c) customers: {NEW_CUST}, for ZZAUTOTEST Alpha Fleet and ZZAUTOTEST Bravo Fleet. '
 f'(d) each work order: {WO_OPEN}; {NEW_LINE(rate=R100,tech="the technician(s)",times="Estimated Time and Tech Time as above")}; set Service Advisor in the work order\'s left panel; on the line click Add Part and add a part with the Sell Price above (it must show In stock, or be ordered and received, before you can invoice). '
 f'(e) clocked time: sign in as each technician in a private window {G} open the work order {G} on the line\'s Labor row click Start, then Stop {G} Clock Out; then, as Admin, {EXACT.replace("to make the time exact, as Admin: ","")}. '
 f'(f) on each work order: {FINISH}; {INVOICE}.')
DASH_LINE_SHORT=('The Dash Shop data set exists (location ZZAUTOTEST Dash Shop with two invoiced work orders created today: Alpha Fleet $250.00 and Bravo Fleet $260.00, 3.00 labor hours billed, 2.50 technician hours on the lines, 3.50 clocked hours, no internal time; full contents in the Setup).')
spec={}
spec['88602']=([P_REPORTS,W,DASH_P,'ZZAUTOTEST Tech Two belongs to a department whose time clock is on, so they can clock internal (non work order) time.'],
 [S_REPORTS, DASH_S(3), f'For 4: choose that department when you create ZZAUTOTEST Tech Two (New Staff Member {G} Departments); profile icon {G} Settings {G} Departments shows which departments have Clock Time Enabled = Yes (for example Training).'],
 stepfix('88602',[('Sign in as ZZAUTOTEST Tech Two, use the Clock In button in the top bar to clock in to a department (not a work order) and clock out again.','Sign in as ZZAUTOTEST Tech Two in a private window, click Clock In in the top bar, choose the department (not a work order), then clock out.')]))
spec['88603']=([P_REPORTS,W,'You are in a location (workplace) with no clocked time at all and nothing else in it yet (for example ZZAUTOTEST No Clock Shop).'],
 [S_REPORTS, f'For 3: {NEWLOC("ZZAUTOTEST No Clock Shop")}. Create nothing in it yet.'],
 stepfix('88603',[('Create one invoiced work order in this workplace with no clocked time: Customers &gt; New Customer (e.g. "ZZAUTOTEST No Clock Fleet") &gt; Work Orders &gt; New Work Order &gt; that customer &gt; New Line: labor 1.00 hour at $100.00 with technician time 1.00 hour, assign a technician, but do not let anyone clock in &gt; approve &gt; Review &gt; Finance &gt; Create Invoice.',
  'Create one invoiced work order in this location with no clocked time: Customers &gt; New Customer (e.g. ZZAUTOTEST No Clock Fleet) &gt; Save; Work Orders &gt; Create Work Order &gt; that customer and an asset &gt; Save; in New Line: Add Technician, Labor Rate EVR Travel to EVO ($100 an hour), Estimated Time 1 and Tech Time 1, tick Line Approved &gt; Save &amp; Close, and do not let anyone clock in; Story &gt; Update; Complete; Mark Reviewed; Finance &gt; Create Invoice.')]))
spec['88604']=([P_REPORTS,W,'You can switch to a busy location (workplace) that has invoices and technician clocked time on several different days this month and in the last twelve months.',DASH_P],
 [S_REPORTS, S_LOC(3,CHK_BUSY), DASH_S(4)], stepfix('88604'))
spec['88605']=([P_REPORTS,W,DASH_P,'ZZAUTOTEST Tech Two belongs to a department whose time clock is on, so they can clock internal (non work order) time.'],
 [S_REPORTS, DASH_S(3), f'For 4: choose that department when you create ZZAUTOTEST Tech Two (New Staff Member {G} Departments); profile icon {G} Settings {G} Departments shows which departments have Clock Time Enabled = Yes (for example Training).'],
 stepfix('88605',[('Sign in as ZZAUTOTEST Tech Two, click Clock In in the top bar, pick a department (not a work order), then clock out.','Sign in as ZZAUTOTEST Tech Two in a private window, click Clock In in the top bar, choose the department (not a work order), then clock out.')]))
spec['88607']=([P_REPORTS,W,'You can switch to a busy location (workplace) that has invoices and technician clocked time on several different days this month and in the last twelve months.',
 'A location with nothing in it exists (for example ZZAUTOTEST Empty Shop): no work order, invoice, credit or clocked time.',
 'A location with one very large invoice exists (for example ZZAUTOTEST Big Shop): one invoice, not paid, for customer ZZAUTOTEST Big Fleet, with one part of Sell Price $1,234,567.89 and no labor.'],
 [S_REPORTS, S_LOC(3,CHK_BUSY), f'For 4: {NEWLOC("ZZAUTOTEST Empty Shop")}. Create nothing in it.',
  f'For 5: {NEWLOC("ZZAUTOTEST Big Shop")}; switch to it; {NEW_CUST} (ZZAUTOTEST Big Fleet); {WO_OPEN}; in New Line: What Are You Doing? (any text), no labor, tick Line Approved {G} Save &amp; Add Part, and add a part with Sell Price $1,234,567.89 (it must show In stock, or be ordered and received); {FINISH}; {INVOICE}.'],
 stepfix('88607'))
spec['88608']=([P_REPORTS,W,'A location with exactly one customer sold to exists (for example ZZAUTOTEST One Customer Shop): one invoice, not paid, for customer ZZAUTOTEST Solo Fleet (for example 1.00 hour at $100.00).',DASH_P],
 [S_REPORTS, f'For 3: {NEWLOC("ZZAUTOTEST One Customer Shop")}; switch to it; {NEW_CUST} (ZZAUTOTEST Solo Fleet); '+wo_recipe(rate=R100,times='Estimated Time 1 and Tech Time 1'), DASH_S(4)], stepfix('88608'))
spec['88611']=([P_REPORTS,W,EMPTY_P,'A second location exists with two walk-in part sales (no customer) invoiced in it (for example ZZAUTOTEST Walk-in Shop, each sale with one part, e.g. Sell Price $25.00).'],
 [S_REPORTS, EMPTY_S(3), f'For 4: {NEWLOC("ZZAUTOTEST Walk-in Shop")}; switch to it; Parts {G} Part Sales {G} New Part Sale, leave the customer empty (walk-in), add a part (e.g. Sell Price $25.00) and invoice it; do this twice. If the build does not allow a sale with no customer, write in the result comment that a walk-in sale could not be created, and skip the last result.'],
 stepfix('88611'))
spec['351705']=([P_REPORTS,W,
 'A location for the void check exists (for example ZZAUTOTEST Void Shop) with two invoices, not paid and not sent: customer ZZAUTOTEST Keep Fleet, one labor line of 1.00 hour at $100.00 an hour with Tech Time 1.00 and exactly 1.00 hour clocked on it; customer ZZAUTOTEST Void Fleet, one labor line of 2.00 hours at $150.00 an hour (e.g. $300.00) with Tech Time 2.00 and nobody clocked on it.',
 'You can switch to a location with at-risk customers, and you have written down one at-risk customer\'s name and Last Invoice Date (Dashboard &gt; View details on At Risk Customers).'],
 [S_REPORTS, f'For 3: {NEWLOC("ZZAUTOTEST Void Shop")}; switch to it; {NEW_CUST} for ZZAUTOTEST Keep Fleet and ZZAUTOTEST Void Fleet. Keep Fleet: '+wo_recipe(rate=R100,tech='a technician you can sign in as (for example Tech ShopView; set its Location to this location first if the Technicians list does not offer it: profile icon &gt; Settings &gt; Staff &gt; edit icon &gt; Location &gt; Save &amp; Close)',times='Estimated Time 1 and Tech Time 1',clock=True)+' Void Fleet: '+wo_recipe(rate=R150,times='Estimated Time 2 and Tech Time 2')+' Nobody clocks on the Void Fleet line.',
  S_LOC(4,'Check: the At Risk Customers tile shows a number above 0')], 
 stepfix('351705',[('Create a new work order for that customer with one labor line (e.g. 0.50 hour at $100.00) &gt; approve &gt; Review &gt; Finance &gt; Create Invoice (do not pay or send).','Create a new work order for that customer: Work Orders &gt; Create Work Order &gt; the customer and an asset &gt; Save; in New Line one labor line (e.g. Labor Rate EVR Travel to EVO, Estimated Time 0.5), tick Line Approved &gt; Save &amp; Close; Story &gt; Update; Complete; Mark Reviewed; Finance &gt; Create Invoice (do not pay or send).')]))
for k in ['351706','351708','351711','351713','351714']:
    spec[k]=([P_REPORTS,W,EMPTY_P],[S_REPORTS,EMPTY_S(3)],stepfix(k))
spec['351712']=([P_REPORTS,W,EMPTY_P,'You have a screen reader. On a Mac use VoiceOver, which is built in: press Command + F5 to turn it on or off. On Windows use NVDA (free from nvaccess.org): install it, start it with Ctrl + Alt + N, and stop it with Insert + Q.'],[S_REPORTS,EMPTY_S(3)],stepfix('351712'))
for k in ['351707','351715']:
    spec[k]=([P_REPORTS,W,DASH_P],[S_REPORTS,DASH_S(3)],stepfix(k))
spec['351709']=([P_REPORTS,W,DASH_P,'You run this case on any day except the 1st of the month (on the 1st, This Month has only one day).'],[S_REPORTS,DASH_S(3)],stepfix('351709'))
spec['351710']=([P_REPORTS,W,DASH_P,'You run it on any day except the 1st of the month.'],[S_REPORTS,DASH_S(3)],stepfix('351710'))
out={}
for k,(pre,setup,steps) in spec.items():
    n={'custom_preconds':build(pre,setup)}
    if steps!=L[k]['custom_steps']: n['custom_steps']=steps
    out[k]=n
json.dump(out,open('/tmp/cln/refine/batch3.json','w')); print(len(out))
