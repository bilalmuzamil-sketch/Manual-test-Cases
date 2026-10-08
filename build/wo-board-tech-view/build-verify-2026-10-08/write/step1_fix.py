import json,re,sys,base64,urllib.request,time
cr=json.load(open('/tmp/testrail/creds.json')); sec=cr.get('api_key') or cr.get('password')
auth=base64.b64encode(f"{cr['user']}:{sec}".encode()).decode()
def get(k):
    for t in range(6):
        try:
            r=urllib.request.Request(f'https://shopview.testrail.io/index.php?/api/v2/get_case/{k}',headers={'Authorization':'Basic '+auth}); return json.load(urllib.request.urlopen(r,timeout=120))
        except Exception: time.sleep(2*2**t)
held=json.load(open('/tmp/cln/layout170-held.json'))
STATUS_OLD='use the status control on the work order page for In Progress, Review (Ready for Review) and Complete; decline the estimate for Declined; Finance tab &gt; Create Invoice for Invoiced; record a payment for the full amount for Paid.'
STATUS_NEW=('for In Progress click Start on the line\'s Labor row (stop the clock afterwards with Stop &gt; Clock Out); for Review click the line\'s Complete button, '
 'type a Tech Story (fill any missing detail it asks for, e.g. Mileage) and click Complete Line (the List shows "Ready For Review"); for Complete then click '
 'Mark Reviewed, enter the VIN if asked and click Confirm Review; for Declined save the line with Line Approved off and click Decline on it (it must be the work '
 'order\'s only line); for Invoiced complete and review it first, then Finance tab &gt; Create Invoice; for Paid, after invoicing, Finance tab &gt; New Payment '
 'for the full amount &gt; Make Payment.')
IMPORT_ROUTE=('Settings &gt; Invoices (in the IMPORTS group): click Download Template, fill one row in the template (keep its heading row; the columns marked * are required; '
 'Shop Location = this location\'s name, a customer name, an Invoice Number such as ZZIMP-1001, Invoice Date as month/day/year e.g. 10/01/2026, Item Labor, a Line Title, '
 'Qty 1, Rate 100, Total 100, Tax Amount 5), save it as a .csv file, click Select CSV File, pick the file and click Import Invoices; the message reads '
 '"All invoices have been imported successfully." The imported work order\'s number is the Invoice Number you typed, and it is listed only when Status &gt; Imported is ticked')
P={  # cid: list of (old,new) applied to custom_preconds (and steps when noted)
 '96914':[('in the New Work Order window turn Asset Here? on','in the New Work Order window leave Asset Here? on (it is on by default)'),
          ('Asset Here? off','in the New Work Order window switch Asset Here? off (it is on by default)')],
 '96959':[('(and remove any extra work order from this customer by setting its status to Declined)','(this customer is used by this case only, so it has no other work orders; if it has, create a new customer for this case with a different name and do the setup again)')],
 '96984':[('and save no line on it (it stays an Estimate with 0 lines)','and close the New Line form that opens with the close (×) at its top right without saving, so no line is saved (it stays an Estimate with 0 lines)')],
 '368158':[('Approve it, set lead Ana, then Finance &gt; Create Invoice.','Approve it, set lead Ana, then complete and review it (the line\'s Complete &gt; Tech Story &gt; Complete Line; then Mark Reviewed &gt; Confirm Review, entering the VIN if asked) and click Finance tab &gt; Create Invoice.')],
 '96997':[('Enter a tech story on Line 1 (e.g. "Brought unit in. Completed inspection.") and save.','Enter a tech story on Line 1: on the Lines tab, in Line 1\'s Story row click the edit pencil ("Edit tech story"); the window "Tech Story: &lt;line name&gt;" opens; type the story (e.g. "Brought unit in. Completed inspection.") and click Update.')],
 '154648':[('(Imported work orders come only from Settings &gt; Data Import &gt; Invoices)','(Imported work orders come only from an invoice import: '+IMPORT_ROUTE+')')],
 '154887':[('Imported work orders come from a data import, so this case uses an existing one rather than its own customer.','Imported work orders come only from an invoice import; to make one: '+IMPORT_ROUTE+'.')],
 '368247':[('(Imported work orders come from a data import and cannot be created by hand)','(Imported work orders come only from an invoice import; to make one: '+IMPORT_ROUTE+')'),
           ('If none is listed, mark the case Blocked with "no Imported work order on this site".','If none is listed, make one with the invoice import above, then tick Imported again.')],
}
OUT_368247=('<p><strong>What you should see today</strong> (build v26.40.8-7a95011, 10/8/2026): opening an imported work order goes to a separate imported page showing the number, '
 '"Imported", "Invoiced: &lt;date&gt;", Financial Info and the invoice, with no Lead Technician shown at all, so there is nothing to write down at step 2 or change at step 3. '
 '(1) If you see exactly that, mark the case Failed and raise nothing new. (2) If it fails in a different way, that is a new problem: report it. '
 '(3) If it behaves as the expected results above say, the change has shipped: mark it Passed and tell the QA lead.</p>')
written_status=['97001','97002','97003','97004','97005','97006','97007','97008','97009','97010','97011','97012','97013','368144','368145','368147','368148','368149','97020','97021','97022','368150','368151','368152','97028','97030','97031','97032','368159']
HELD_OK=['96914','96915','96944','96954','96959','96975','96980','96984','96997','97027','154648','368158']
out={};snap=json.load(open('/tmp/cln/l253-live.json')); rep=[]
def apply(k,p,s):
    for o,n in P.get(k,[]):
        if o.replace('&gt;','>') in p and o not in p: o=o.replace('&gt;','>'); n=n
        c=p.count(o)
        if c==0: rep.append(f'C{k} MISSING: {o[:60]}')
        p=p.replace(o,n)
    if STATUS_OLD in p: p=p.replace(STATUS_OLD,STATUS_NEW)
    return p,s
for k in HELD_OK:
    p,s=apply(k,held[k]['custom_preconds'],held[k]['custom_steps']); out[k]={'custom_preconds':p,'custom_steps':s}
for k in written_status+['154887','368247']:
    cur=get(k); time.sleep(0.8)
    assert cur['updated_by']==3, k
    snap[k]=cur
    p,s=apply(k,cur['custom_preconds'],cur['custom_steps']); d={'custom_preconds':p,'custom_steps':s}
    if k=='368247':
        e=cur['custom_expected']; assert 'What you should see today' not in e; d['custom_expected']=e.replace('<p><strong>Source',OUT_368247+'<p><strong>Source',1)
    out[k]=d
json.dump(snap,open('/tmp/cln/l253-live.json','w')); json.dump(out,open('/tmp/cln/step1-write.json','w'))
left=[k for k,v in out.items() if STATUS_OLD in v['custom_preconds']]
print(len(out),'cases; status paragraph left:',left); print('\n'.join(rep))
