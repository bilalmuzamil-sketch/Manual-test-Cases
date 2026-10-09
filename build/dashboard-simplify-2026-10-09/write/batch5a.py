import json,re,sys
sys.path.insert(0,'/tmp/cln/refine'); from lib import *
L={str(c['id']):c for c in json.load(open('/tmp/cln/dash-live-1009.json'))}
R100='EVR Travel to EVO ($100 an hour)'; R150='Calgary Transit Rate ($150 an hour)'
def namefix(s):
    for a,b in [('Tom Tech','Technician 1'),('Tara Tech','Technician 2'),('Alex Advisor','Advisor A'),('Bea Advisor','Advisor B'),
                ("Tom's","Technician 1's"),("Tara's","Technician 2's"),("Alex's","Advisor A's"),("Bea's","Advisor B's")]: s=s.replace(a,b)
    s=re.sub(r'\bTom\b','Technician 1',s); s=re.sub(r'\bTara\b','Technician 2',s); s=re.sub(r'\bAlex\b','Advisor A',s); s=re.sub(r'\bBea\b','Advisor B',s)
    return s
def routefix(s):
    s=s.replace('Description "','What Are You Doing? "').replace('Description &quot;','What Are You Doing? &quot;')
    s=s.replace('Technician "Technician 1"','Add Technician = Technician 1').replace('Technician &quot;Technician 1&quot;','Add Technician = Technician 1')
    s=s.replace('Labor Rate e.g. $100.00 per hour','Labor Rate '+R100).replace('Labor Rate e.g. $150.00 per hour','Labor Rate '+R150)
    s=s.replace('tick Approved','tick Line Approved')
    s=s.replace('Work Orders &gt; New Work Order &gt; customer and asset &gt; Create','Work Orders &gt; Create Work Order &gt; pick the customer and its asset &gt; Save')
    s=s.replace('use Clock In on that line and clock out','on that line\'s Labor row click Start, then Stop &gt; Clock Out')
    s=s.replace('Type a Story on the new line, set it to Complete, then click Complete Work Order and Mark Reviewed.','On the new line click Story &gt; type a short story &gt; Update, then click Complete (if a window offers Complete All Lines or asks for Mileage, finish it there), then click Mark Reviewed.')
    s=s.replace('Type a Story on the line, set it to Complete, click Complete Work Order and Mark Reviewed','On the line click Story &gt; type a short story &gt; Update, click Complete (finish any Missing Details window), then Mark Reviewed')
    s=s.replace('click Clock In in the top menu, choose the department','click Clock In in the top bar, choose the department')
    return s
def steps(k): return routefix(namefix(L[k]['custom_steps']))
P_DAY='You run the whole case on one day, and not on the last evening of the week, so every record you create stays inside This Week.'
P_CUST='A test customer with one contact and one asset that uses that contact (for example ZZAUTOTEST Dash Customer 1, contact Dana Test, unit ZZ-101).'
P_T1='Technician 1: a technician at this location, with Time Clock on, whose sign-in you have (you clock time as them in a second browser or a private window).'
P_T2='Technician 2: a second technician at this location, set up the same way.'
P_A='Advisor A: a name in the work order\'s Service Advisor list (your own name, Admin ShopView, is filled in by default).'
P_B='Advisor B: a second, different name in the Service Advisor list.'
P_DEPT='Technician 1 belongs to a department whose time clock is on (for internal, non work order time).'
def quiet_pre(tile,cond): return f'You are in a quiet test location: nobody else invoices, issues credits or clocks time there this week; on the Dashboard, the {tile} tile on This Week {cond}.'
def S_quiet(n,tile,cond): return (f'For {n}: to change location, {LOC_ROUTE}; pick ZZAUTOTEST Dashboard Quiet (it already exists and charges 0 % shop supplies). Check: Dashboard {G} {tile} tile {G} range pill {G} This Week: it {cond}. '
  'If it does not, try another location in the list. Locations cannot be deleted, so do not create another one: if no location is quiet this week, mark the case Blocked and write in the result comment that no quiet location was free this week.')
S_CUST=lambda n: f'For {n}: {NEW_CUST}; on its Contacts tab: New Contact; add an asset (Add beside Asset in the New Work Order window, or the customer\'s Assets tab) and pick that contact in the asset\'s Contact field.'
S_T=lambda n,which='Technician 1': (f'For {n}: {which}: a technician offered in Add Technician at this location whose sign-in you have. If there is none, create one: profile icon {G} Settings {G} Staff {G} New Staff Member: a name (for example ZZAUTOTEST {which.replace(" ","")}), an Email you can open, Role Technician, a Department, Location = this location, Time Clock on {G} Save &amp; Close; accept the invitation email and set a password.')
S_A=lambda n: f'For {n}: the Service Advisor is in the work order\'s left panel (it shows your own name by default); to use another advisor, pick another name there.'
S_DEPT=lambda n: f'For {n}: profile icon {G} Settings {G} Departments lists departments with Clock Time Enabled (for example Training; New Department {G} Name, Enable time clock? on {G} Save &amp; Close). A technician gets a department when created (New Staff Member {G} Departments).'
def W(adv='Advisor A',lines='',clock_note=''):
    return (f'{WO_OPEN}; set Service Advisor to {adv} in the left panel; in the New Line window ({G} New Line on the Lines tab for each further line): {lines}, tick Line Approved {G} Save &amp; Close'
            + (f'; {clock_note}' if clock_note else ''))
CLK=lambda hrs,n='1': f'as Technician 1 in a second browser: open the work order {G} on the line\'s Labor row click Start, then Stop {G} Clock Out; as Admin make the clocked time exactly {hrs} hours: three dots at the top right of the Lines tab {G} Timesheets ({n}) {G} edit the record (if it cannot be edited there or in Reports {G} Timesheet Activities, keep the real time and use the hours Timesheet Activities shows in every sum)'
FIN=f'{FINISH}; {INVOICE}'
spec={}
def add(k,pre,setup): spec[k]=([P_ADMIN]+pre,[S_ADMIN]+setup)
add('88632',[quiet_pre('Revenue','reads $0.00 with 0 Invoices'),P_DAY,P_CUST,P_T1,P_A,
  'One invoiced work order (not sent, not paid) for that customer, Service Advisor Advisor A, one labor line: What Are You Doing? ZZAUTOTEST Line 1, Technician 1, $100.00 an hour, Estimated Time 2.00, Tech Time 2.00, with exactly 2.00 hours clocked on it. You have written down its Subtotal (e.g. $200.00).'],
  [S_quiet(2,'Revenue','reads $0.00 with 0 Invoices'),S_CUST(4),S_T(5),S_A(6),'For 7: '+W(lines=f'What Are You Doing? ZZAUTOTEST Line 1, Add Technician Technician 1, Labor Rate {R100}, Estimated Time 2 and Tech Time 2',clock_note=CLK('2.00'))+f'; {FIN}. The Subtotal is on the Finance tab.'])
add('88634',[quiet_pre('Revenue','reads $0.00 with 0 Invoices'),P_DAY,
  'An older invoice in this location dated before this week that carries a part (e.g. last month, with a $500.00 part).',P_CUST,
  'This week\'s sale: one invoiced work order (not sent, not paid) for the test customer, Service Advisor Advisor A, one labor line of 1.00 hour at $150.00 an hour (Estimated Time 1.00, Tech Time 1.00). You have written down its Subtotal (e.g. $150.00).',
  'This week, a credit against the older invoice: its part returned with Outcome Store Credit. You have written down the credit\'s amount before tax (e.g. $500.00).'],
  [S_quiet(2,'Revenue','reads $0.00 with 0 Invoices'),f'For 4: Customers {G} a customer {G} Invoices tab (turn Open only off): open an invoice dated before this week and check its parts on the work order\'s Parts or Finance tab. If none exists, create one now with a part and run this case in a later week.',
   S_CUST(5),'For 6: '+W(lines=f'What Are You Doing? ZZAUTOTEST Labor 1h, Add Technician (any), Labor Rate {R150}, Estimated Time 1 and Tech Time 1')+f'; {FIN}.',
   f'For 7: on the older invoice\'s work order, Finance tab {G} the invoice\'s three dots {G} Issue Credit {G} choose its part, Outcome Store Credit {G} save.'])
add('88635',[quiet_pre('Revenue','reads $0.00 with 0 Invoices'),P_DAY,P_CUST,P_A,
  'Three invoiced work orders A, B and C (not sent, not paid) for that customer, Service Advisor Advisor A, each with one labor line at $100.00 an hour: A 3.00 hours, B 5.00 hours, C 2.00 hours (Tech Time the same). You have written down each Subtotal (e.g. A $300.00, B $500.00, C $200.00). Invoice C stays unpaid and unsent: it is the one you will void (a line added to a sent or paid invoice splits the work order instead of voiding).',
  'Your role can reverse an invoice (Admin can): Reverse is in the invoice\'s three dots on the Finance tab.'],
  [S_quiet(2,'Revenue','reads $0.00 with 0 Invoices'),S_CUST(4),S_A(5),'For 6: for each of A, B and C: '+W(lines=f'What Are You Doing? ZZAUTOTEST Line, Add Technician (any), Labor Rate {R100}, Estimated Time and Tech Time 3 for A, 5 for B, 2 for C')+f'; {FIN}.'])
add('88636',[quiet_pre('Revenue','reads $0.00 with 0 Invoices'),P_DAY,P_CUST+' Its Default Shop Supplies is 0, so the invoice carries only labor and parts.',
  'An in-stock inventory part with a Sell price (e.g. $100.00).',P_A,
  'One work order for that customer, ready but not invoiced yet: Service Advisor Advisor A, one labor line of 2.00 hours at $100.00 an hour (Estimated Time 2.00, Tech Time 2.00) with the part added (quantity 1, In stock); line completed and the work order marked reviewed.'],
  [S_quiet(2,'Revenue','reads $0.00 with 0 Invoices'),S_CUST(4)+f' Then on the customer page: edit icon {G} Edit Customer {G} Default Shop Supplies 0 {G} Save.',f'For 5: Parts {G} Inventory (pick a part with stock on hand, or use New Inventory Part).',S_A(6),
   'For 7: '+W(lines=f'What Are You Doing? ZZAUTOTEST Labor 2h, Add Technician (any), Labor Rate {R100}, Estimated Time 2 and Tech Time 2')+f'; on the line click Add Part, choose the inventory part, quantity 1, and make sure it shows In stock; {FINISH}. Do not invoice yet.'])
add('88637',[quiet_pre('Billing Efficiency','shows no percentage (a grey "-")'),P_DAY,P_CUST,P_T1,P_A,
  'One invoiced work order (not sent, not paid), Service Advisor Advisor A, two labor lines at $100.00 an hour: ZZAUTOTEST Line 1 with Estimated Time 2.00 and Tech Time 2.00, ZZAUTOTEST Line 2 with Estimated Time 1.50 and Tech Time 1.50, both for Technician 1, with exactly 3.00 hours clocked in total.'],
  [S_quiet(2,'Billing Efficiency','shows no percentage (a grey "-")'),S_CUST(4),S_T(5),S_A(6),'For 7: '+W(lines=f'Add Technician Technician 1, Labor Rate {R100}; Line 1 Estimated Time 2 and Tech Time 2; Line 2 Estimated Time 1.5 and Tech Time 1.5',clock_note=CLK('3.00'))+f'; {FIN}.'])
add('88638',[quiet_pre('Billing Efficiency','shows no percentage (a grey "-")'),P_DAY,P_CUST,P_T1,P_A,P_B,
  'Work order A (low efficiency, many hours), invoiced, not sent, not paid: Service Advisor Advisor A, one labor line ZZAUTOTEST A, Technician 1, $100.00 an hour, Estimated Time 1.00, Tech Time 1.00, with exactly 4.00 hours clocked.',
  'Work order B (high efficiency, few hours), invoiced, not sent, not paid: Service Advisor Advisor B, one labor line ZZAUTOTEST B, Technician 1, $100.00 an hour, Estimated Time 2.00, Tech Time 2.00, with exactly 1.00 hour clocked.'],
  [S_quiet(2,'Billing Efficiency','shows no percentage (a grey "-")'),S_CUST(4),S_T(5),S_A('6 and 7'),'For 8: '+W(lines=f'What Are You Doing? ZZAUTOTEST A, Add Technician Technician 1, Labor Rate {R100}, Estimated Time 1 and Tech Time 1',clock_note=CLK('4.00'))+f'; {FIN}.',
   'For 9: the same, with Service Advisor Advisor B: '+W(adv='Advisor B',lines=f'What Are You Doing? ZZAUTOTEST B, Add Technician Technician 1, Labor Rate {R100}, Estimated Time 2 and Tech Time 2',clock_note=CLK('1.00'))+f'; {FIN}.'])
add('88639',[quiet_pre('Technician Efficiency','shows no percentage (a grey "-")'),P_DAY,P_CUST,P_T1,P_A,
  'One invoiced work order (not sent, not paid), Service Advisor Advisor A, two labor lines for Technician 1 at $100.00 an hour whose Tech Time differs from Estimated Time: ZZAUTOTEST Line 1 (Estimated Time 2.00, Tech Time 1.80) and ZZAUTOTEST Line 2 (Estimated Time 1.50, Tech Time 1.20), with exactly 2.00 hours clocked on each line.'],
  [S_quiet(2,'Technician Efficiency','shows no percentage (a grey "-")'),S_CUST(4),S_T(5),S_A(6),'For 7: '+W(lines=f'Add Technician Technician 1, Labor Rate {R100}; Line 1 Estimated Time 2 and Tech Time 1.8; Line 2 Estimated Time 1.5 and Tech Time 1.2',clock_note=CLK('2.00 on each line','2'))+f'; {FIN}.'])
add('88640',[quiet_pre('Technician Efficiency','shows no percentage (a grey "-")'),P_DAY,P_CUST,P_T1,P_T2,P_A,
  'Work order 1 (technician time but nobody clocks it), invoiced, not sent, not paid: Service Advisor Advisor A, one labor line ZZAUTOTEST No clock, Technician 1, $100.00 an hour, Estimated Time 1.00, Tech Time 1.00; nobody clocks in on it. Work order 2 is created later, in the steps.'],
  [S_quiet(2,'Technician Efficiency','shows no percentage (a grey "-")'),S_CUST(4),S_T(5),S_T(6,'Technician 2'),S_A(7),'For 8: '+W(lines=f'What Are You Doing? ZZAUTOTEST No clock, Add Technician Technician 1, Labor Rate {R100}, Estimated Time 1 and Tech Time 1')+f'; nobody clocks in; {FIN}.'])
add('88641',[quiet_pre('Technician Utilization','shows no percentage (a grey "-")'),P_DAY,P_CUST,P_T1,P_DEPT,
  'Work-order time: a work order with one labor line (ZZAUTOTEST Line 1, Technician 1, $100.00 an hour, Estimated Time 2.00, Tech Time 2.00) with exactly 2.00 hours clocked on it. It does not need to be invoiced: this tile counts clocked time only.',
  'Internal time: Technician 1 clocked into the department (not a work order) for exactly 1.00 hour earlier today.'],
  [S_quiet(2,'Technician Utilization','shows no percentage (a grey "-")'),S_CUST(4),S_T(5),S_DEPT(6),'For 7: '+W(lines=f'What Are You Doing? ZZAUTOTEST Line 1, Add Technician Technician 1, Labor Rate {R100}, Estimated Time 2 and Tech Time 2',clock_note=CLK('2.00'))+'.',
   f'For 8: as Technician 1 in the second browser: Clock In in the top bar {G} choose the department {G} clock out; as Admin: Reports {G} Timesheet Activities {G} edit that record to exactly 1.00 hour earlier today (if it cannot be edited, use the hours shown there in the sums).'])
add('88642',[quiet_pre('Revenue','reads $0.00 with 0 Invoices'),P_DAY,'Four test customers, each with one contact and one asset that uses that contact (e.g. ZZAUTOTEST SBC 1 to ZZAUTOTEST SBC 4).',
  'Invoiced work orders (each one labor line, 1.00 hour at $100.00 an hour, Tech Time 1.00): Customer 1 two; Customer 2 one; Customer 3 one, then reversed; Customer 4 one left unpaid and unsent, then voided by adding a new line (e.g. 0.50 hour), with no new invoice created for it.'],
  [S_quiet(2,'Revenue','reads $0.00 with 0 Invoices'),S_CUST(4).replace('For 4:','For 4: for each customer,'),
   'For 5: each work order: '+W(lines=f'What Are You Doing? (any text), Add Technician (any), Labor Rate {R100}, Estimated Time 1 and Tech Time 1')+f'; {FIN}. Reverse (Customer 3): Finance tab {G} the invoice\'s three dots {G} Reverse {G} confirm. Void (Customer 4): on its Lines tab click New Line, add a 0.5-hour line {G} Save &amp; Close; do not create a new invoice.'])
add('88646',['You are in a quiet test location: nobody else invoices, issues credits or clocks time there this week, and it has no clocked time and no invoices this week (you check this in step 1).',P_DAY,P_T1,P_DEPT],
  [f'For 2: to change location, {LOC_ROUTE}; pick ZZAUTOTEST Dashboard Quiet (it already exists). Locations cannot be deleted, so do not create another one: if no location is quiet this week, mark the case Blocked and write in the result comment that no quiet location was free this week.',S_T(4),S_DEPT(5)])
add('88651',[quiet_pre('Revenue','reads $0.00 with 0 Invoices')+' This is location A.',P_DAY,'A second location B you can switch to (any other location in the list).',P_CUST,
  'In location A: one invoiced work order (not sent, not paid) for the test customer, one labor line of 3.00 hours at $100.00 an hour (Tech Time 3.00). You have written down its Subtotal (e.g. $300.00).'],
  [S_quiet(2,'Revenue','reads $0.00 with 0 Invoices'),f'For 4: the same Change Location list; any other location.',S_CUST(5),'For 6: in location A: '+W(lines=f'What Are You Doing? (any text), Add Technician (any), Labor Rate {R100}, Estimated Time 3 and Tech Time 3')+f'; {FIN}.'])
add('88652',[quiet_pre('Revenue','reads $0.00 with 0 Invoices'),P_DAY,P_CUST,P_T1,P_DEPT,
  'One work order for the test customer, ready but not invoiced yet: Service Advisor set, one labor line of 2.50 hours at $100.00 an hour (Tech Time 2.50); line completed and the work order marked reviewed.'],
  [S_quiet(2,'Revenue','reads $0.00 with 0 Invoices'),S_CUST(4),S_T(5),S_DEPT(6),'For 7: '+W(lines=f'What Are You Doing? (any text), Add Technician (any), Labor Rate {R100}, Estimated Time 2.5 and Tech Time 2.5')+f'; {FINISH}. Do not invoice yet.'])
out={}
for k,(pre,setup) in spec.items():
    n={'custom_preconds':build(pre,setup)}
    st=steps(k)
    if st!=L[k]['custom_steps']: n['custom_steps']=st
    ex=namefix(L[k]['custom_expected'].split('Source')[0])+('Source'+'Source'.join(L[k]['custom_expected'].split('Source')[1:]) if 'Source' in L[k]['custom_expected'] else '')
    if ex!=L[k]['custom_expected']: n['custom_expected']=ex
    out[k]=n
json.dump(out,open('/tmp/cln/refine/batch5a.json','w')); print(len(out),'steps:',[k for k in out if 'custom_steps' in out[k]],'exp:',[k for k in out if 'custom_expected' in out[k]])
