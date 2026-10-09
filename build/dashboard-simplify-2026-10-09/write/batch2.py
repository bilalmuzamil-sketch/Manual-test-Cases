import json,re,sys
sys.path.insert(0,'/tmp/cln/refine'); from lib import *
exec(open('/tmp/cln/refine/batch1.py').read().split("T_ADMIN='")[0].split("L=json.load")[1].join(['',''])) if False else None
L={str(c['id']):c for c in json.load(open('/tmp/cln/dash-live-1009.json'))}
def stepfix(k,pairs=()):
    s=L[k]['custom_steps']
    s=re.sub(r'<li>Open the dashboard', '<li>Click Dashboard in the top menu', s)
    for a,b in pairs:
        assert s.count(a)==1,(k,a); s=s.replace(a,b)
    return s
W=P_WIN
spec={}
# 88594 (Automated) — first screen after login + Revenue matches Sales
spec['88594']=([P_REPORTS,'You open the site in a fresh private (incognito) browser window, so nothing remembered from an earlier visit is in play.',W,
 'You are in one location (workplace); write down its name.','That location has one invoice created this month (for example 1.00 hour at $100.00). Write down its subtotal (for example $100.00).'],
 [S_REPORTS, S_LOC(4), f'For 5: {NEW_CUST} (for example "ZZAUTOTEST Entry Fleet"); then '+wo_recipe(rate='EVR Travel to EVO ($100 an hour)',times='Estimated Time 1 and Tech Time 1')+' The subtotal is on the Finance tab.'],
 stepfix('88594',[('<li>Read the workplace name in the workplace selector at the top left and the Revenue tile\'s headline.</li>','<li>Read the location name at the top right (beside your initials) and the Revenue tile\'s headline.</li>'),
   ('<li>Sign out (user menu at the top right &gt; sign out).</li>','<li>Sign out (profile icon at the top right &gt; Logout).</li>')]))
spec['88601']=([P_REPORTS,W,P_LOC_BUSY,'Your role can create a work order and an invoice in that location (Admin can).'],
 [S_REPORTS, S_LOC(3,CHK_BUSY)],
 stepfix('88601',[('Create one new invoice in the same workplace today: Work Orders &gt; New Work Order &gt; a customer &gt; a labor line (e.g. 1.00 hour at $100.00) &gt; approve &gt; Review &gt; Finance &gt; Create Invoice.',
   'Create one new invoice in the same location today: Work Orders &gt; Create Work Order &gt; a customer and asset &gt; Save; in New Line add a labor line (e.g. Labor Rate EVR Travel to EVO, $100 an hour, Estimated Time 1) and tick Line Approved &gt; Save &amp; Close; Story &gt; Update; Complete; Mark Reviewed; Finance &gt; Create Invoice.')]))
spec['88606']=([P_REPORTS,W,P_LOC_BUSY,'You know how to set a custom range: open a tile\'s range pill, click a start day and an end day in the calendar, check the length shown at the bottom (e.g. "Range: 31 days"), then click Apply.'],
 [S_REPORTS, S_LOC(3,CHK_BUSY)], stepfix('88606'))
CHK_AR60='Check: on the Dashboard set At Risk Customers to 60 days and click View details: at least one row has a Last Invoice Date 60 to 119 days ago'
spec['88609']=([P_REPORTS,W,'You open the site in a fresh private (incognito) browser window, so nothing remembered from an earlier visit is in play.',
 'You are in a location (workplace) with customers who have not been invoiced for a while.','At least one customer shows in the At Risk table at 60 days whose Last Invoice Date is between 60 and 119 days ago (the automated version of this case seeds its own customer with one invoice about 90 days old; a manual tester uses the existing customers).'],
 [S_REPORTS, S_LOC(4)+'', S_LOC(5,CHK_AR60).replace('For 5: to change location, '+LOC_ROUTE+'. On the QA site try Staging Heavy Duty - 9919. ','For 5: ')+' '+FRESH_NOTE+' Then set the At Risk window back to 120 days.'], stepfix('88609'))
spec['88610']=([P_REPORTS,W,'You are in a location (workplace) with at-risk customers.',
 'In that location\'s At Risk table (Dashboard &gt; View details on At Risk Customers) there are two customers whose invoices are inside the last twelve months: Customer A with Lifetime Invoices 1 and a parts-only invoice (e.g. Revenue (12 Mo) $40.50), and Customer B with Lifetime Invoices 2 or more. You have written down both names and the At Risk headline.'],
 [S_REPORTS, S_LOC(3,'Check: the At Risk Customers tile shows a number above 0'),
  'For 4: read the table\'s Lifetime Invoices and Revenue (12 Mo) columns; to see whether an invoice has only parts: Customers &gt; the customer &gt; Invoices tab (turn Open only off). Invoices cannot be back-dated, so if no such customers exist, mark the case Blocked and write in the result comment that no such customers exist.'], stepfix('88610'))
spec['88612']=([P_REPORTS,W,'You open the site in a fresh private (incognito) browser window, so nothing remembered from an earlier visit is in play.',P_LOC_BUSY,
 'Test data: the automated version of this case seeds its own invoiced work order this month with a technician\'s clocked hours on its labor line; a manual tester uses the busy location in 4.'],
 [S_REPORTS, S_LOC(4,CHK_BUSY)+' '+FRESH_NOTE], stepfix('88612'))
spec['88613']=([P_REPORTS,W,'You are in a location (workplace) with several at-risk customers (use the window that gives the most rows, e.g. 30 days).'],
 [S_REPORTS, S_LOC(3,'Check: the At Risk Customers tile shows 2 or more on at least one window')], stepfix('88613'))
for k in ['88614','88627','88628']:
    spec[k]=([P_REPORTS,W,P_LOC_BUSY],[S_REPORTS,S_LOC(3,CHK_BUSY)],stepfix(k))
spec['88616']=([P_REPORTS,P_LOC_BUSY,'You have a small screen: a phone, a tablet held upright, or a desktop browser window made narrower than 1024 pixels (the tiles stack into one column once it is narrow enough).','You also have a desktop window at least 1024 pixels wide.'],
 [S_REPORTS,S_LOC(2,CHK_BUSY)],stepfix('88616'))
spec['88630']=([P_REPORTS,W,'You are in a location (workplace) where at least two customers are at risk on some window (try 30 days).'],
 [S_REPORTS,S_LOC(3,'Check: the At Risk Customers tile shows 2 or more on at least one window')],stepfix('88630'))
spec['351704']=([P_REPORTS,W,'You are in a location (workplace) where no invoice has been created today.','That location has an invoice from an earlier day with a part on it (e.g. a part with Sell Price $160.00).'],
 [S_REPORTS, S_LOC(3,'Check: Reports &gt; Sales &gt; Date: pick a custom range of today only in the calendar (click today twice, then Apply): the total reads $0.00'),
  'For 4: Customers &gt; a customer &gt; Invoices tab (turn Open only off) lists their invoices; open one dated before today whose work order\'s Parts tab shows a part, and find it on the work order\'s Finance tab.'], stepfix('351704'))
out={}
for k,(pre,setup,steps) in spec.items():
    n={'custom_preconds':build(pre,setup)}
    if steps!=L[k]['custom_steps']: n['custom_steps']=steps
    out[k]=n
json.dump(out,open('/tmp/cln/refine/batch2.json','w')); print(len(out),[k for k in out if 'custom_steps' in out[k]])
