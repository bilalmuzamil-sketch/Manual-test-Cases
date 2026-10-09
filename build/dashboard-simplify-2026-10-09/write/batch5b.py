import json,re,sys
sys.path.insert(0,'/tmp/cln/refine'); from lib import *
L={str(c['id']):c for c in json.load(open('/tmp/cln/dash-live-1009.json'))}
src=open('/tmp/cln/refine/batch1.py').read(); exec(src[src.index('NAME_FIX='):src.index('CHK_PEOPLE=')])
R100='EVR Travel to EVO ($100 an hour)'
def steps(k,pairs=()):
    s=fixnames(L[k]['custom_steps'])
    for a,b in pairs: assert s.count(a)==1,(k,a[:50]); s=s.replace(a,b)
    return s
BACK='then set the pill back to its default (the dashboard remembers your choices)'
def LOCN(n,check): return f'For {n}: to change location, {LOC_ROUTE}. On the QA site try Staging Heavy Duty - 9919. {check}. If not, try the other locations in the list. {BLOCK_IF}'
spec={}
def add(k,pre,setup,st=()): spec[k]=([P_ADMIN]+pre,[S_ADMIN]+setup,steps(k,st))
AR='Check: the At Risk Customers tile on 120 Days shows a number above 0, and View details lists customers with Last Invoice Dates spread over the last months'
add('88631',['You are in the busiest location (workplace) you can reach: the one with the most invoices and clocked time, so every tile has real work to do.','You have a stopwatch or a phone timer ready.'],
  [LOCN(2,'Check: on the Dashboard, Sales by Customer (Last 12 Months) and Technician Utilization show figures; pick the location where they are largest')])
add('88643',['You are in a location (workplace) with several months of invoice history (many customers, invoices going back more than a year). At Risk needs old invoices, which cannot be back-dated by hand.',
  'Customer W: in the At Risk table (window 120 Days), a customer with Lifetime Invoices 2 or more, whose newest invoice you will make and then undo. You have written down W\'s Last Invoice Date.',
  'Customer X: a customer whose only invoice is more than 12 months old (Lifetime Invoices 1, so Revenue (12 Mo) is $0.00).',
  'Customer Y: a customer with 2 or more invoices, all more than 12 months old.'],
  [LOCN(2,AR),f'For 3: Dashboard {G} At Risk Customers on 120 Days {G} View details: the table shows Customer, Last Invoice Date, Lifetime Invoices and Revenue (12 Mo).',f'For 4 and 5: Customers {G} the customer {G} Invoices tab (turn Open only off) shows each invoice\'s date.'],
  [('Make a new invoice today for customer W: Work Orders &gt; New Work Order &gt; W and its asset &gt; one line &gt; Story &gt; Complete &gt; Complete Work Order &gt; Mark Reviewed &gt; Finance &gt; Create Invoice (close the payment dialog without paying).',
    f'Make a new invoice today for customer W: Work Orders &gt; Create Work Order &gt; W and its asset &gt; Save; in New Line one labor line (e.g. Labor Rate {R100}, Estimated Time 1), tick Line Approved &gt; Save &amp; Close; Story &gt; Update; Complete (finish any Missing Details window); Mark Reviewed; Finance &gt; Create Invoice (close the New Customer Payment window without paying).')])
add('88644',['You are in a location (workplace) with several months of invoice history (many customers, invoices going back more than a year). At Risk needs old invoices, which cannot be back-dated by hand.',
  'You have written down the location\'s time zone.',
  'You have a second device (a second computer or a phone) whose clock is set to a time zone far from the location\'s (e.g. 8 or more hours apart), signed in as the same or another user with the Reports permission and the same location selected.',
  'The At Risk Customers table is open (Dashboard &gt; View details under the At Risk Customers tile); it shows Customer, Last Invoice Date, Lifetime Invoices and Revenue (12 Mo).'],
  [LOCN(2,AR),f'For 3: profile icon {G} Settings {G} Locations: the Timezone column shows it.','For 4: on the second device, sign in the same way (For 1) and change location as in For 2.'])
add('88645',['You are in a location (workplace) with several months of invoice history (many customers, invoices going back more than a year). At Risk needs old invoices, which cannot be back-dated by hand.',
  'Customer V: with the At Risk Customers window on 120 Days, an at-risk customer whose newest invoice is from 2 to 6 months ago and who also has an older invoice. You have written down both invoice dates.',
  'Your role can reverse an invoice (Admin can).'],
  [LOCN(2,AR),f'For 3: Dashboard {G} At Risk Customers window pill {G} 120 Days {G} View details; invoice dates: Customers {G} V {G} Invoices tab (turn Open only off).'])
add('88647',['You are in a location (workplace) with more than two years of invoices, so Revenue has a value in every period.',
  'You know how to set a custom range on the Revenue tile: click its range pill, click a start day and an end day in the calendar, check the "Range: N days" readout at the bottom, then click Apply.'],
  [LOCN(2,f'Check: the Revenue tile shows an amount above $0.00 on Last Year and on This Year; {BACK}')])
add('88648',['You are in a location (workplace) with more than two years of invoices and clocked time, so every range has figures.',
  'You have a grid to fill in: five tiles (Revenue, Billing Efficiency, Technician Efficiency, Technician Utilization, Sales by Customer) by nine ranges (Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week): 45 tile figures and 45 report figures.'],
  [LOCN(2,f'Check: Revenue and Technician Efficiency show figures on Last Year and on This Year; {BACK}')])
add('88649',['You are in a location (workplace) with several advisors and technicians and at least two months of invoices and clocked time.',
  'Chart tooltips show whole percentages (e.g. 117%) while the reports show two decimals: compare after rounding the report figure to a whole number.'],
  [LOCN(2,f'Check: Billing Efficiency and Technician Efficiency set to Last 12 Months &gt; View details: the Advisor filter and the Technician filter each list at least two names; {BACK}')])
add('88650',['You are in a location (workplace) with invoices and clocked time this month.','You run this case before the last day of the month, so This Month is not finished yet.',
  'If a total differs only in the last decimal place (0.01) because rows are rounded, mark the case Blocked and write both numbers in the comment: the specification does not cover rounding of row sums.'],
  [LOCN(2,'Check: on the Dashboard, Revenue on This Month is above $0.00 and Technician Efficiency on This Month shows a percentage (not -)')])
out={}
for k,(pre,setup,st) in spec.items():
    n={'custom_preconds':build(pre,setup)}
    if st!=L[k]['custom_steps']: n['custom_steps']=st
    out[k]=n
json.dump(out,open('/tmp/cln/refine/batch5b.json','w')); print(len(out),'steps:',[k for k in out if 'custom_steps' in out[k]])
