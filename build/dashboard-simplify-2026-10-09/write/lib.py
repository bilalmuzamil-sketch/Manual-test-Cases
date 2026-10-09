import json,re,html
G='&gt;'
LOC_ROUTE=f'click your profile icon (your initials, top right, beside the current location name) {G} under Change Location: click the orange button showing the current location {G} pick the location from the list'
SIGNIN_ADMIN='on the QA site\'s sign-in page, in the DEV MODE — QUICK LOGIN panel, click Admin (this signs you in as Admin ShopView)'
SIGNIN_TECH='in a second browser or a private window, on the QA site\'s sign-in page, in the DEV MODE — QUICK LOGIN panel, click Tech (this signs you in as Tech ShopView, a technician at Staging Heavy Duty - 9919 with Time Clock on)'
ROLE_CHECK=f'To use another role, check it has Reports: profile icon {G} Settings {G} Roles &amp; Permissions {G} edit icon on the role {G} Reports is switched on.'
P_ADMIN='You are signed in as an Admin (the Admin role has every permission, including Reports).'
P_REPORTS='You are signed in as a user whose role has the Reports permission (for example Admin).'
P_ZOOM='You use a desktop browser at 100% zoom on a screen at least 1024 pixels wide (any ordinary laptop or desktop monitor).'
P_WIN='You use a desktop browser window at least 1024 pixels wide (a maximised laptop or desktop window).'
S_ADMIN=f'For 1: {SIGNIN_ADMIN}. {ROLE_CHECK}'
LOC_9919=f'to change location, {LOC_ROUTE}. On the QA site use Staging Heavy Duty - 9919'
CHK_L12M='Check: on the Dashboard, set the Revenue pill to Last 12 Months: it must show an amount above $0.00'
BLOCK_IF='If no location in the list passes this check, mark the case Blocked and write in the result comment that no location has this data.'
def build(pre,setup):
    h='<p><strong>Preconditions</strong></p><ol>'+''.join(f'<li>{x}</li>' for x in pre)+'</ol>'
    if setup: h+='<p><strong>Setup</strong></p><ul>'+''.join(f'<li>{x}</li>' for x in setup)+'</ul>'
    return h
def sub(s,pairs,key):
    for a,b in pairs:
        n=s.count(a)
        assert n>=1,(key,a[:80])
        s=s.replace(a,b)
    return s
NEW_CUST=f'Customers {G} New Customer {G} Name {G} Save'
NEW_CONTACT=f'on the customer\'s Contacts tab: New Contact'
WO_OPEN=f'Work Orders {G} Create Work Order {G} in the New Work Order window pick the Customer and an Asset (Add beside either if needed) {G} Save (if a Confirmation says the customer is over their credit limit, click Create)'
NEW_LINE=lambda rate='any rate in the list, for example EVR Travel to EVO ($100 an hour)', tech='a technician (for example Tech ShopView)', times='Estimated Time and Tech Time': f'the New Line window opens: What Are You Doing? (any text), Add Technician = {tech}, Labor Rate = {rate}, {times}, tick Line Approved {G} Save &amp; Close'
FINISH=f'on the line click Story (Add tech story for this line) {G} type a short story {G} Update; click Complete (if a Missing Details window asks for Mileage, enter one {G} Complete All Lines); click Mark Reviewed'
INVOICE=f'Finance tab {G} Create Invoice; close the New Customer Payment window without paying (do not send or pay the invoice)'
CLOCK=f'clock time as the technician: {SIGNIN_TECH}; open the work order {G} on the line\'s Labor row click Start; when done click Stop {G} Clock Out'
EXACT=f'to make the time exact, as Admin: the three dots at the top right of the Lines tab {G} Timesheets (n) {G} edit the record\'s start and end (if it cannot be edited there or in Reports {G} Timesheet Activities, keep the real time and use the hours Timesheet Activities shows)'
def wo_recipe(rate=None,tech=None,times=None,clock=False):
    a=[WO_OPEN, NEW_LINE(**{k:v for k,v in (('rate',rate),('tech',tech),('times',times)) if v})]
    if clock: a+= [CLOCK, EXACT]
    a+=[FINISH, INVOICE]
    return '; '.join(a)+'.'
P_LOC_BUSY='You are in a location (workplace) that has invoices and technician clocked time on several different days this month and in the last twelve months.'
CHK_BUSY='Check: on the Dashboard, Revenue on This Month is above $0.00 and Technician Efficiency on This Month shows a percentage (not -); switch both pills to Last 12 Months: both show figures; then set both back to This Month (the dashboard remembers your choices in this browser)'
def S_LOC(n,check=None,use9919=True,extra=''):
    s=f'For {n}: to change location, {LOC_ROUTE}.'
    if use9919: s+=' On the QA site try Staging Heavy Duty - 9919.'
    if check: s+=f' {check}. If not, try the other locations in the list. {BLOCK_IF}'
    return s+(' '+extra if extra else '')
S_REPORTS=f'For 1: {SIGNIN_ADMIN}. {ROLE_CHECK}'
FRESH_NOTE='Do this check in your normal browser window, not in the private window you test in (the dashboard remembers choices).'
