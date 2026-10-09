import json,re,sys
sys.path.insert(0,'/tmp/cln/refine')
src=open('/tmp/cln/refine/batch5a.py').read(); exec(src[:src.index('spec={}')])
RATE100='the $100 rate you added in this location (for example ZZAUTOTEST Rate 100)'; RATE150='the $150 rate you added in this location (for example ZZAUTOTEST Rate 150)'
def quiet_pre(tile,cond): return f'You are in a fresh test location made for this run, so nothing else is invoiced, credited or clocked there; on the Dashboard, the {tile} tile on This Week {cond}.'
def S_quiet(n,tile,cond,rates=('100',)):
    r=''
    if rates: r=(f' While you are in it, add the labor rate{"s" if len(rates)>1 else ""} this test uses (rates belong to each location): profile icon {G} Settings {G} Labor Rates {G} New Labor Rate: Name (for example '
        + ' and '.join(f'ZZAUTOTEST Rate {x}, Rate {x}' for x in rates) + f') {G} Save &amp; Close.')
    return (f'For {n}: create a fresh location for every run (use a new name each time, for example ZZAUTOTEST Quiet plus today\'s date and a letter): profile icon {G} Settings {G} Locations {G} New Location: Name, Address 1, City, State/Province, ZIP/Postal Code, Timezone, Telephone, Shop Supplies Charge 0 {G} Save &amp; Close. '
            f'Switch to it: {LOC_ROUTE}.{r} Check: Dashboard {G} {tile} tile {G} range pill {G} This Week: it {cond}.')
P_T1_SELF='Technician 1 is you (Admin ShopView, Time Clock on): in a fresh location you are the technician offered in Add Technician, and you clock time yourself.'
S_T1_SELF=lambda n: f'For {n}: nothing to set up. To clock time: on the line\'s Labor row click Start, then Stop {G} Clock Out (same browser).'
P_T_NEW=lambda which,dept: f'{which}: a test technician in this run\'s location, with Time Clock on{" and a department whose time clock is on (for internal, non work order time)" if dept else ""}, whose sign-in you have.'
S_T_NEW=lambda n,which,dept: (f'For {n}: create {which} for this run: profile icon {G} Settings {G} Staff {G} New Staff Member: a name (for example ZZAUTOTEST {which.replace(" ","")} plus today\'s date), an Email you can open, Role Technician, '
  + ('Departments including one with Clock Time Enabled (for example Training; profile icon &gt; Settings &gt; Departments shows which), ' if dept else 'a Department, ')
  + f'Location = this run\'s location, Time Clock on {G} Save &amp; Close. Accept the invitation email, set a password, and sign in as them in a private window when the test needs them.')
CLK=lambda hrs,n='1',who='Technician 1 (yourself)': f'as {who}: on the line\'s Labor row click Start, then Stop {G} Clock Out; as Admin make the clocked time exactly {hrs} hours: three dots at the top right of the Lines tab {G} Timesheets ({n}) {G} edit the record (if it cannot be edited there or in Reports {G} Timesheet Activities, keep the real time and use the hours Timesheet Activities shows in every sum)'
def W(adv='Advisor A',lines='',clock_note=''):
    return (f'{WO_OPEN}; set Service Advisor to {adv} in the left panel; in the New Line window ({G} New Line on the Lines tab for each further line): {lines}, tick Line Approved {G} Save &amp; Close'+(f'; {clock_note}' if clock_note else ''))
P_A='Advisor A: you (Admin ShopView); the Service Advisor in the work order\'s left panel shows your name by default.'
P_B='Advisor B: a second, different name in the Service Advisor list.'
S_A=lambda n: f'For {n}: the Service Advisor is in the work order\'s left panel; pick another name there for a second advisor.'
def steps(k,extra=()):
    s=routefix(namefix(L[k]['custom_steps'])).replace('Labor Rate EVR Travel to EVO ($100 an hour)','Labor Rate = '+RATE100)
    for a,b in extra: assert s.count(a)==1,(k,a[:50]); s=s.replace(a,b)
    return s
spec={}
def add(k,pre,setup,st_extra=()): spec[k]=([P_ADMIN]+pre,[S_ADMIN]+setup,steps(k,st_extra))
RQ=('Revenue','reads $0.00 with 0 Invoices'); BQ=('Billing Efficiency','shows no percentage (a grey "-")'); TQ=('Technician Efficiency','shows no percentage (a grey "-")'); UQ=('Technician Utilization','shows no percentage (a grey "-")')
add('88632',[quiet_pre(*RQ),P_DAY,P_CUST,P_T1_SELF,P_A,
  'One invoiced work order (not sent, not paid) for that customer, Service Advisor Advisor A, one labor line: What Are You Doing? ZZAUTOTEST Line 1, Technician 1, $100.00 an hour, Estimated Time 2.00, Tech Time 2.00, with exactly 2.00 hours clocked on it. You have written down its Subtotal (e.g. $200.00).'],
  [S_quiet(2,*RQ),S_CUST(4),S_T1_SELF(5),S_A(6),'For 7: '+W(lines=f'What Are You Doing? ZZAUTOTEST Line 1, Add Technician Technician 1, Labor Rate {RATE100}, Estimated Time 2 and Tech Time 2',clock_note=CLK('2.00'))+f'; {FIN}. The Subtotal is on the Finance tab.'])
add('88634',[quiet_pre(*RQ),P_DAY,'An older invoice dated before this week that carries a part (e.g. last month, with a $500.00 part), in any location you can switch to.',P_CUST,
  'This week\'s sale, in the fresh location: one invoiced work order (not sent, not paid) for the test customer, Service Advisor Advisor A, one labor line of 1.00 hour at $150.00 an hour (Estimated Time 1.00, Tech Time 1.00). You have written down its Subtotal (e.g. $150.00).',
  'This week, a credit against the older invoice: its part returned with Outcome Store Credit. You have written down the credit\'s amount before tax (e.g. $500.00).'],
  [S_quiet(2,*RQ,rates=('150',)),f'For 4: Customers {G} a customer {G} Invoices tab (turn Open only off): open an invoice dated before this week and check its parts on the work order\'s Parts or Finance tab. If none exists, create one now with a part and run this case in a later week.',
   S_CUST(5),'For 6: '+W(lines=f'What Are You Doing? ZZAUTOTEST Labor 1h, Add Technician (yourself), Labor Rate {RATE150}, Estimated Time 1 and Tech Time 1')+f'; {FIN}.',
   f'For 7: on the older invoice\'s work order, Finance tab {G} the invoice\'s three dots {G} Issue Credit {G} choose its part, Outcome Store Credit {G} save.'])
add('88635',[quiet_pre(*RQ),P_DAY,P_CUST,P_A,
  'Three invoiced work orders A, B and C (not sent, not paid) for that customer, Service Advisor Advisor A, each with one labor line at $100.00 an hour: A 3.00 hours, B 5.00 hours, C 2.00 hours (Tech Time the same). You have written down each Subtotal (e.g. A $300.00, B $500.00, C $200.00). Invoice C stays unpaid and unsent: it is the one you will void (a line added to a sent or paid invoice splits the work order instead of voiding).',
  'Your role can reverse an invoice (Admin can): Reverse is in the invoice\'s three dots on the Finance tab.'],
  [S_quiet(2,*RQ),S_CUST(4),S_A(5),'For 6: for each of A, B and C: '+W(lines=f'What Are You Doing? ZZAUTOTEST Line, Add Technician (yourself), Labor Rate {RATE100}, Estimated Time and Tech Time 3 for A, 5 for B, 2 for C')+f'; {FIN}.'])
add('88636',[quiet_pre(*RQ),P_DAY,P_CUST+' Its Default Shop Supplies is 0, so the invoice carries only labor and parts.','An in-stock inventory part with a Sell price (e.g. $100.00) that this location can sell.',P_A,
  'One work order for that customer, ready but not invoiced yet: Service Advisor Advisor A, one labor line of 2.00 hours at $100.00 an hour (Estimated Time 2.00, Tech Time 2.00) with the part added (quantity 1, In stock); line completed and the work order marked reviewed.'],
  [S_quiet(2,*RQ),S_CUST(4)+f' Then on the customer page: edit icon {G} Edit Customer {G} Default Shop Supplies 0 {G} Save.',f'For 5: Parts {G} Inventory while in this location (pick a part with stock on hand, or use New Inventory Part).',S_A(6),
   'For 7: '+W(lines=f'What Are You Doing? ZZAUTOTEST Labor 2h, Add Technician (yourself), Labor Rate {RATE100}, Estimated Time 2 and Tech Time 2')+f'; on the line click Add Part, choose the inventory part, quantity 1, and make sure it shows In stock; {FINISH}. Do not invoice yet.'])
add('88637',[quiet_pre(*BQ),P_DAY,P_CUST,P_T1_SELF,P_A,
  'One invoiced work order (not sent, not paid), Service Advisor Advisor A, two labor lines at $100.00 an hour: ZZAUTOTEST Line 1 with Estimated Time 2.00 and Tech Time 2.00, ZZAUTOTEST Line 2 with Estimated Time 1.50 and Tech Time 1.50, both for Technician 1, with exactly 3.00 hours clocked in total.'],
  [S_quiet(2,*BQ),S_CUST(4),S_T1_SELF(5),S_A(6),'For 7: '+W(lines=f'Add Technician Technician 1, Labor Rate {RATE100}; Line 1 Estimated Time 2 and Tech Time 2; Line 2 Estimated Time 1.5 and Tech Time 1.5',clock_note=CLK('3.00'))+f'; {FIN}.'])
add('88638',[quiet_pre(*BQ),P_DAY,P_CUST,P_T1_SELF,P_A,P_B,
  'Work order A (low efficiency, many hours), invoiced, not sent, not paid: Service Advisor Advisor A, one labor line ZZAUTOTEST A, Technician 1, $100.00 an hour, Estimated Time 1.00, Tech Time 1.00, with exactly 4.00 hours clocked.',
  'Work order B (high efficiency, few hours), invoiced, not sent, not paid: Service Advisor Advisor B, one labor line ZZAUTOTEST B, Technician 1, $100.00 an hour, Estimated Time 2.00, Tech Time 2.00, with exactly 1.00 hour clocked.'],
  [S_quiet(2,*BQ),S_CUST(4),S_T1_SELF(5),S_A('6 and 7'),'For 8: '+W(lines=f'What Are You Doing? ZZAUTOTEST A, Add Technician Technician 1, Labor Rate {RATE100}, Estimated Time 1 and Tech Time 1',clock_note=CLK('4.00'))+f'; {FIN}.',
   'For 9: the same, with Service Advisor Advisor B: '+W(adv='Advisor B',lines=f'What Are You Doing? ZZAUTOTEST B, Add Technician Technician 1, Labor Rate {RATE100}, Estimated Time 2 and Tech Time 2',clock_note=CLK('1.00'))+f'; {FIN}.'])
add('88639',[quiet_pre(*TQ),P_DAY,P_CUST,P_T1_SELF,P_A,
  'One invoiced work order (not sent, not paid), Service Advisor Advisor A, two labor lines for Technician 1 at $100.00 an hour whose Tech Time differs from Estimated Time: ZZAUTOTEST Line 1 (Estimated Time 2.00, Tech Time 1.80) and ZZAUTOTEST Line 2 (Estimated Time 1.50, Tech Time 1.20), with exactly 2.00 hours clocked on each line.'],
  [S_quiet(2,*TQ),S_CUST(4),S_T1_SELF(5),S_A(6),'For 7: '+W(lines=f'Add Technician Technician 1, Labor Rate {RATE100}; Line 1 Estimated Time 2 and Tech Time 1.8; Line 2 Estimated Time 1.5 and Tech Time 1.2',clock_note=CLK('2.00 on each line','2'))+f'; {FIN}.'])
add('88640',[quiet_pre(*TQ),P_DAY,P_CUST,P_T1_SELF,P_T_NEW('Technician 2',False),P_A,
  'Work order 1 (technician time but nobody clocks it), invoiced, not sent, not paid: Service Advisor Advisor A, one labor line ZZAUTOTEST No clock, Technician 1, $100.00 an hour, Estimated Time 1.00, Tech Time 1.00; nobody clocks in on it. Work order 2 is created later, in the steps.'],
  [S_quiet(2,*TQ),S_CUST(4),S_T1_SELF(5),S_T_NEW(6,'Technician 2',False),S_A(7),'For 8: '+W(lines=f'What Are You Doing? ZZAUTOTEST No clock, Add Technician Technician 1, Labor Rate {RATE100}, Estimated Time 1 and Tech Time 1')+f'; nobody clocks in; {FIN}.'],
  [('In the second browser, signed in as Technician 1, on that line\'s Labor row click Start, then Stop &gt; Clock Out. Then sign in as Technician 2 and do the same.',
    'As Technician 1 (yourself), on that line\'s Labor row click Start, then Stop &gt; Clock Out. Then, in a private window signed in as Technician 2, do the same.')])
add('88641',[quiet_pre(*UQ),P_DAY,P_CUST,P_T_NEW('Technician 1',True),
  'Work-order time: a work order with one labor line (ZZAUTOTEST Line 1, Technician 1, $100.00 an hour, Estimated Time 2.00, Tech Time 2.00) with exactly 2.00 hours clocked on it. It does not need to be invoiced: this tile counts clocked time only.',
  'Internal time: Technician 1 clocked into the department (not a work order) for exactly 1.00 hour earlier today.'],
  [S_quiet(2,*UQ),S_CUST(4),S_T_NEW(5,'Technician 1',True),'For 6: create a work order: '+W(lines=f'What Are You Doing? ZZAUTOTEST Line 1, Add Technician Technician 1, Labor Rate {RATE100}, Estimated Time 2 and Tech Time 2',clock_note=CLK('2.00',who='Technician 1 in the private window'))+'.',
   f'For 7: as Technician 1 in the private window: Clock In in the top bar {G} choose the department {G} clock out; as Admin: Reports {G} Timesheet Activities {G} edit that record to exactly 1.00 hour earlier today (if it cannot be edited, use the hours shown there in the sums).'])
add('88642',[quiet_pre(*RQ),P_DAY,'Four test customers, each with one contact and one asset that uses that contact (e.g. ZZAUTOTEST SBC 1 to ZZAUTOTEST SBC 4).',
  'Invoiced work orders (each one labor line, 1.00 hour at $100.00 an hour, Tech Time 1.00): Customer 1 two; Customer 2 one; Customer 3 one, then reversed; Customer 4 one left unpaid and unsent, then voided by adding a new line (e.g. 0.50 hour), with no new invoice created for it.'],
  [S_quiet(2,*RQ),S_CUST(4).replace('For 4:','For 4: for each customer,'),
   'For 5: each work order: '+W(lines=f'What Are You Doing? (any text), Add Technician (yourself), Labor Rate {RATE100}, Estimated Time 1 and Tech Time 1')+f'; {FIN}. Reverse (Customer 3): Finance tab {G} the invoice\'s three dots {G} Reverse {G} confirm. Void (Customer 4): on its Lines tab click New Line, add a 0.5-hour line {G} Save &amp; Close; do not create a new invoice.'])
add('88646',['You are in a fresh test location made for this run, with no clocked time and no invoices this week (you check this in step 1).',P_DAY,P_T_NEW('Technician 1',True)],
  [S_quiet(2,*RQ,rates=()),S_T_NEW(4,'Technician 1',True)])
add('88651',[quiet_pre(*RQ)+' This is location A.',P_DAY,'A second location B you can switch to (any other location in the list).',P_CUST,
  'In location A: one invoiced work order (not sent, not paid) for the test customer, one labor line of 3.00 hours at $100.00 an hour (Tech Time 3.00). You have written down its Subtotal (e.g. $300.00).'],
  [S_quiet(2,*RQ),'For 4: the same Change Location list; any other location.',S_CUST(5),'For 6: in location A: '+W(lines=f'What Are You Doing? (any text), Add Technician (yourself), Labor Rate {RATE100}, Estimated Time 3 and Tech Time 3')+f'; {FIN}.'])
add('88652',[quiet_pre(*RQ),P_DAY,P_CUST,P_T_NEW('Technician 1',True),
  'One work order for the test customer, ready but not invoiced yet: Service Advisor set, one labor line of 2.50 hours at $100.00 an hour (Tech Time 2.50); line completed and the work order marked reviewed.'],
  [S_quiet(2,*RQ),S_CUST(4),S_T_NEW(5,'Technician 1',True),'For 6: '+W(lines=f'What Are You Doing? (any text), Add Technician (yourself), Labor Rate {RATE100}, Estimated Time 2.5 and Tech Time 2.5')+f'; {FINISH}. Do not invoice yet.'],
  [('In the second browser, signed in as Technician 1, click Clock In','In the private window, signed in as Technician 1, click Clock In')])
out={}
for k,(pre,setup,st) in spec.items():
    n={'custom_preconds':build(pre,setup),'custom_steps':st}
    ex=namefix(L[k]['custom_expected'].split('Source')[0])+('Source'+'Source'.join(L[k]['custom_expected'].split('Source')[1:]) if 'Source' in L[k]['custom_expected'] else '')
    n['custom_expected']=ex
    out[k]=n
# 88646 steps
s=out['88646']['custom_steps']; a='In the second browser, signed in as Technician 1, click Clock In'
if a in s: out['88646']['custom_steps']=s.replace(a,'In the private window, signed in as Technician 1, click Clock In')
json.dump(out,open('/tmp/cln/refine/batch6q.json','w')); print(len(out))
