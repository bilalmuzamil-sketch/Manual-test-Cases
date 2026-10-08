import json,base64,urllib.request,time,re,sys,collections,os
cr=json.load(open('/tmp/testrail/creds.json')); sec=cr.get('api_key') or cr.get('password')
auth=base64.b64encode(f"{cr['user']}:{sec}".encode()).decode()
H={'Authorization':'Basic '+auth,'Content-Type':'application/json'}
def call(p,data=None):
    for t in range(7):
        try:
            r=urllib.request.Request(f'https://shopview.testrail.io/index.php?/api/v2/{p}',headers=H,data=(json.dumps(data).encode() if data is not None else None))
            return json.load(urllib.request.urlopen(r,timeout=120))
        except urllib.error.HTTPError as e:
            body=e.read().decode()[:200]
            if e.code in (429,500,502,503) or 'deadlock' in body.lower(): time.sleep(2*(2**t)); continue
            raise RuntimeError(f'{e.code} {body}')
        except Exception: time.sleep(2*(2**t))
    raise RuntimeError('retries exhausted')
STAMP='(build v26.40.8-7a95011, 10/8/2026)'
ROUTE=(' The example customer and unit are not on the test site, so create them first: top menu Customers &gt; New Customer &gt; Name (e.g. "Fibridge Commercial") &gt; Save. '
       'On the customer page click the Contacts tab &gt; New Contact &gt; First Name and Last Name &gt; Save (a new asset needs a contact). '
       'Then click the Assets tab &gt; New Asset &gt; pick the Contact, then Year, Make, Model and Unit (e.g. 2022, Freightliner, M2, TRK-118) &gt; Save. Make is required; Unit can be left empty.')
A_OLD='pick the Customer (e.g. "Fibridge Commercial") and the Asset (e.g. unit TRK-118, 2022 Freightliner M2) &gt; Save.'
B_OLD='Name (e.g. "ZZ Board Test Co"), add an asset with a unit number and year/make/model (e.g. unit "TRK-118", "2022 Freightliner M2"), then Save.'
B_NEW=('Name (e.g. "ZZ Board Test Co") &gt; Save. On the customer page click the Contacts tab &gt; New Contact &gt; First Name and Last Name &gt; Save (a new asset needs a contact). '
       'Then click the Assets tab &gt; New Asset &gt; pick the Contact, then Year, Make, Model and Unit (e.g. 2022, Freightliner, M2, unit "TRK-118") &gt; Save. Make is required; Unit can be left empty.')
LINE_NOTE=('<li>Line names in this case (such as "Line 1") are only labels for you: the New Line form\'s "What Are You Doing?" box only offers ready-made lines (typed text finds no results), '
           'so pick any ready-made line for each one (e.g. "Replace - Brake pot") and write down which is which.</li>')
STEP={  # cid: [(old,new)] on custom_steps
 '154887':[('<li>Read the tooltip.</li>','<li>Read the tooltip shown next to the Reassign lead technician action.</li>')],
 '96964':[('<li>Read the tooltip.</li>','<li>Read the tooltip shown next to the Reassign lead technician action.</li>')],
 '368131':[('<li>Open Work Orders.</li>','<li>Click Work Orders in the top menu.</li>')],
 '96926':[('<li>Open Work Orders.</li>','<li>Click Work Orders in the top menu.</li>')],
 '96934':[('<li>Open Work Orders.</li>','<li>Click Work Orders in the top menu.</li>')],
 '96952':[('<li>Open Work Orders.</li>','<li>Click Work Orders in the top menu.</li>')],
 '96933':[('<li>Read the Unassigned group.</li>','<li>Read the Unassigned group (the first group in the list).</li>')],
 '96955':[('<li>Open the Density control.</li>','<li>Open the Density menu in the toolbar.</li>')],
 '96973':[('<li>Read the technicians offered.</li>','<li>Read the technicians listed in the Reassign lead technician dialog.</li>')],
 '96977':[('<li>Open Fields to display.</li>','<li>Open the Fields to display menu in the toolbar.</li>')],
 '96981':[('<li>Open Fields to display.</li>','<li>Open the Fields to display menu in the toolbar.</li>')],
 '96982':[('<li>Read both cards.</li>','<li>Read each card on the board (both of them).</li>')],
 '96984':[('<li>Read the four cards.</li>','<li>Read each card on the board (all four, or three if (c) could not be made; see the preconditions).</li>')],
 '97033':[('Board View &gt; Fields to display, turn','Board View &gt; the Fields to display menu, turn')],
}
PRE={
 '96984':[('(c) asset with no unit number and no year, make or model;','(c) asset with no unit number and no year, make or model (this cannot be made by hand on this test site: the New Asset form will not save without a Make; skip (c) and write "(c) not built - an asset needs a Make" in the result comment);')],
}
def OUT(today,blocked=False):
    one='mark the case Blocked (the developer says this part is not in this release) and raise nothing new' if blocked else 'mark the case Failed and raise nothing new'
    return (f'<p><strong>What you should see today</strong> {STAMP}: {today} (1) If you see exactly that, {one}. '
            '(2) If it fails in a different way, that is a new problem: report it. (3) If it behaves as the expected results above say, the change has shipped: mark it Passed and tell the QA lead.</p>')
SHIFT='changing the lead (by dragging the card or with Reassign lead technician) shows no question about scheduled shifts, even when the outgoing lead has a shift booked for the entire work order. The lead changes at once with the "Lead technician updated" (or "Lead technician removed") message, and the outgoing lead\'s shift stays on the Schedule.'
OUT3={k:OUT(SHIFT) for k in ['96965','154888','154889','368133','368134','368135','368136']}
OUT3['368164']=OUT('the Tech View "Column Selection" menu and the Board View "Fields to display" menu list their items with ticks and have no search box.',True)
OUT3['368162']=OUT('Tech View has no "Collapse all" / "Expand all" button; each group has only its own collapse arrow beside its name.',True)
C160_OLD='(1) If you see exactly that, mark the case Failed and raise nothing new.'
C160_NEW='(1) If you see exactly that, mark the case Blocked (the developer says this part is not in this release) and raise nothing new.'
ids=[x.strip() for x in open(sys.argv[1]).read().split(',') if x.strip()]
APPLY=len(sys.argv)>2 and sys.argv[2]=='--apply'
before={};after={};log=[];hits=collections.Counter()
for k in ids:
    cur=call(f'get_case/{k}'); time.sleep(0.9)
    if cur['created_by']==1: log.append((k,'SKIP Vladimir')); continue
    if cur['updated_by']!=3: log.append((k,f"SKIP last edited by user {cur['updated_by']}")); continue
    p,s,e=cur['custom_preconds'] or '',cur['custom_steps'] or '',cur['custom_expected'] or ''
    np,ns,ne=p,s,e
    if A_OLD in np: np=np.replace(A_OLD,A_OLD+ROUTE); hits['A']+=1
    if B_OLD in np: np=np.replace(B_OLD,B_NEW); hits['B']+=1
    for o,n in PRE.get(k,[]):
        if o in np: np=np.replace(o,n); hits['PRE']+=1
    for o,n in STEP.get(k,[]):
        if o in ns: ns=ns.replace(o,n); hits['STEP']+=1
        elif o in np: np=np.replace(o,n); hits['STEP']+=1
    if re.search(r'"(Line \d|Oil change)',np) and 'only labels for you' not in np and np.rstrip().endswith('</ol>'):
        np=np.rstrip()[:-5]+LINE_NOTE+'</ol>'; hits['LINE']+=1
    for o in ['(tooltip "Pin column")','(tooltip &ldquo;Pin column&rdquo;)']:
        if o in np: np=np.replace(o,"(the pin icon beside the technician's name in the column header)"); hits['PIN']+=1
        if o in ns: ns=ns.replace(o,"(the pin icon beside the technician's name in the column header)"); hits['PIN']+=1
    if '; not yet build-verified.' in ne: ne=ne.replace('; not yet build-verified.','.'); hits['NYBV']+=1
    if k=='368160' and C160_OLD in ne: ne=ne.replace(C160_OLD,C160_NEW); hits['C160']+=1
    if k in OUT3 and 'What you should see today' not in ne and '<p><strong>Source' in ne:
        ne=ne.replace('<p><strong>Source',OUT3[k]+'<p><strong>Source',1); hits['OUT3']+=1
    head=lambda x: re.split(r'<p><strong>(What you should see today|Source)',x)[0]
    assert head(ne)==head(e), k
    payload={f:v for f,v,o in [('custom_preconds',np,p),('custom_steps',ns,s),('custom_expected',ne,e)] if v!=o}
    if not payload: log.append((k,'NOCHANGE')); continue
    before[k]=cur; after[k]={**cur,**payload}
    if APPLY:
        r=call(f'update_case/{k}',payload); time.sleep(1.2)
        log.append((k,'OK' if all(r[f]==payload[f] for f in payload) else 'MISMATCH',sorted(payload)))
    else: log.append((k,'DRY',sorted(payload)))
    print(k,log[-1][1],flush=True)
tag=os.environ.get('TAG','fix')
json.dump(before,open(f'/tmp/cln/{tag}-before.json','w')); json.dump(after,open(f'/tmp/cln/{tag}-after.json','w')); json.dump(log,open(f'/tmp/cln/{tag}-log.json','w'),indent=0)
print(hits); print(collections.Counter(x[1] for x in log))
