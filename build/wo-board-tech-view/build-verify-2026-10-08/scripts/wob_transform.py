import json,re,html,collections
import os
d=json.load(open(os.environ.get('INJ','/tmp/cln/wob-live.json')))
E=lambda s: html.escape(s,quote=False)
STAMP='<p>Last checked against build v26.40.8-7a95011 on 10/8/2026.</p>'
READY='<p>AUTOMATION: READY</p>'
NOTHAND='<p>AUTOMATION: HOLD - not manually testable (developer/automated check only)</p>'
ADMIN='Sign in as an Owner/Admin user (on a QA branch: the Admin quick-login button on the sign-in page; you appear as "Admin ShopView"). The Admin role holds Work orders > View and Work orders > Create & Edit (to check: your initials at the top right > Settings > Roles & Permissions > Admin > Work orders).'
LOC='Use one location for the whole case: it is shown in the top bar next to the bell (e.g. "Staging Heavy Duty - 9919"); to change it click your initials at the top right > Change Location.'
LEAD_NOTE=' (While a work order is an Estimate its Lead technician is read-only on the work order page; give an Estimate its lead from Board View instead: the card\'s More actions (…) > Reassign lead technician > pick the technician > Reassign.)'
LEAD_SET='Once the work order is Approved, pick the technician in the Lead Technician dropdown on the work order page'
R=[
 # display switcher design notes
 (' (in the design its tooltip reads "Board")',' (tooltip "Board View")'),
 (' (in the design its tooltip reads "By Lead Tech")',' (tooltip "Tech View")'),
 (' (in the design its tooltip reads "Table")',' (tooltip "List")'),
 (' (right side of the toolbar; in the design its button tooltip reads "Board")',' (right side of the toolbar; tooltip "Board View")'),
 (' (the design tooltip reads "Board")',' (tooltip "Board View")'),
 (' (the design tooltip reads "By Lead Tech")',' (tooltip "Tech View")'),
 (' (the design tooltip reads "Table")',' (tooltip "List")'),
 (' (the design labels it "Reassign Lead Tech")',''),
 ('click the Columns button (tooltip "Columns")','click the Column Selection button (tooltip "Column Selection")'),
 ('Click the Columns button','Click the Column Selection button'),
 ('open the column chooser (Columns)','open Column Selection'),
 ("Tech View's column chooser","Tech View's Column Selection menu"),
 ('open its column chooser','open its Column Selection menu'),
 ('open the column chooser','open Column Selection'),
 ('its column chooser','its Column Selection menu'),
 ('column chooser','Column Selection menu'),
 ('Open the density control (Density in the PRD. The design shows "Card size")','Open the Density control'),
 (' (tooltip "Drag to reorder technicians")',' (the six-dot handle)'),
 ('collapse arrow (tooltip "Collapse")','collapse arrow'),('expand arrow (tooltip "Expand")','expand arrow'),
 ('pin control (tooltip "Pin column")','pin icon'),
 # sign-in
 ('Sign in to the Work Orders build under test as a user whose role has Work Orders view and Work Orders create and edit. To check: Settings > Roles & Permissions > open the role > Work Orders (an Owner or Admin role has both).',ADMIN),
 ('Sign in to the build under test as a user whose role has Work Orders view (check in Settings > Roles & Permissions > open your role > Work Orders section). The Admin role has both.',ADMIN),
 ('Sign in to the build under test as a dispatcher whose role has Work Orders view and Work Orders create and edit (check: Settings > Roles & Permissions > open the role > on the Work Orders card, View and Create & Edit are both ticked. The Admin role has both).',ADMIN+' This user is the dispatcher.'),
 ('Sign in to the build under test as a user whose role has Work Orders view and Work Orders create and edit (check in Settings > Roles & Permissions > open your role > Work Orders section). The Admin role has both.',ADMIN),
 # location
 ('In the top bar, choose the location you will test in (e.g. "Heavy Duty"). Create everything below in this location.',LOC+' Create everything below in this location.'),
 ('In the top bar, pick the location you will test in (e.g. "Heavy Duty") and stay in it for the whole case.',LOC),
 ('In the top bar, choose the location you test in (e.g. "Heavy Duty"). Every technician and work order below belongs to this location.',LOC+' Every technician and work order below belongs to this location.'),
 ('In the top bar switch to the second location','Click your initials at the top right > Change Location and pick the second location'),
 ('In the top bar, change to the second location','Click your initials at the top right > Change Location and pick the second location'),
 ('Switch to the second location in the top bar','Switch to the second location (your initials at the top right > Change Location)'),
 ('Change back to the first location','Change back to the first location (your initials > Change Location)'),
 ('switch to in the top bar','switch to (your initials at the top right > Change Location)'),
 ('in the top-right location selector','with your initials at the top right > Change Location'),
 ('(top-right location selector)','(your initials at the top right > Change Location)'),
 # staff
 ('Settings > Staff > add a staff member > enter the first and last name (e.g. Esther Howard), role Technician, Clockable on, Active, enrolled at this location > Save.',
  'Settings (your initials at the top right > Settings) > Staff > New Staff Member > First Name and Last Name (e.g. Esther Howard), an Email, Role "Technician", at least one Department (required), Location = this location, Time Clock on > Save & Close.'),
 ('Pick a role that is not Office or Time Clock User (e.g. "Technician"), turn Clockable on, keep the record Active, enrol the staff member at this location, then Save.',
  'Pick a Role that is not Office User or Time Clock User (e.g. "Technician"), pick at least one Department (required), set Location to this location and turn Time Clock on, then click Save & Close.'),
 ('Settings > Staff > add a staff member, enter a first and last name','Settings (your initials at the top right > Settings) > Staff > New Staff Member, enter First Name and Last Name'),
 ('Settings > Staff > add a staff member with those settings','Settings (your initials at the top right > Settings) > Staff > New Staff Member with those settings (at least one Department is required)'),
 ('Settings > Staff > add a staff member','Settings (your initials at the top right > Settings) > Staff > New Staff Member'),
 ('in Settings > Staff > open the staff member > Edit Staff Member','in Settings > Staff > the staff member\'s edit icon > Edit Staff Member'),
 ('the Time Clock (clockable) setting is on','Time Clock is on'),
 ('Clockable is on, the staff record is Active, the role is neither Office nor Time Clock User, and they are enrolled at this location',
  'Time Clock is on, the staff member is active (not deactivated), the Role is neither Office User nor Time Clock User, and this location is picked in their Location field'),
 ('the staff record is Active, Clockable is on, the role is neither Office nor Time Clock User, and they are enrolled at this location',
  'the staff member is active (not deactivated), Time Clock is on, the Role is neither Office User nor Time Clock User, and this location is picked in their Location field'),
 ('set the staff record inactive > Save','click Deactivate Account and confirm'),
 ('Settings > Staff > open Ralph Edwards','Settings > Staff > Ralph Edwards\' edit icon'),
 ('Edit Staff Member > Active off','Edit Staff Member > Deactivate Account'),
 # roles
 ('Create custom role > Skip > Role name','Create Custom Role > Skip > Role Name'),
 ('tick only View on the Work Orders card','under Work orders tick only View'),
 ('untick Create & Edit on the Work Orders card','under Work orders untick Create & Edit'),
 ("Settings > Roles & Permissions > the role's work order view mode","Settings > Roles & Permissions > the role > Work orders > View mode = Tech view"),
 ('Settings > Locations > add a location > Save > Save','Settings > Locations > New Location > fill in and save'),
 # work orders
 ('Work Orders > New Work Order > choose a customer','Work Orders > Create Work Order > in the New Work Order window pick the Customer'),
 (') and an asset (e.g. unit TRK-118, 2022 Freightliner M2) > Create.',') and the Asset (e.g. unit TRK-118, 2022 Freightliner M2) > Save.'),
 ('Work Orders > New Work Order > pick the case customer (e.g. "ZZ Board Test Co") and its asset > create it','Work Orders > Create Work Order > in the New Work Order window pick the case Customer (e.g. "ZZ Board Test Co") and its Asset > Save'),
 ('Work Orders > New Work Order > pick the customer (add it from the window if it does not exist, e.g. "ZZAUTOTEST Alpha Co") and any asset > Create.',
  'Work Orders > Create Work Order > in the New Work Order window pick the Customer (or click Add beside it to create one, e.g. "ZZAUTOTEST Alpha Co") and any Asset (or Add) > Save.'),
 ('Work Orders > New Work Order > case customer > create it','Work Orders > Create Work Order > pick the case Customer and an Asset > Save'),
 ('Work Orders > New Work Order','Work Orders > Create Work Order'),
 ('Write down the number the build gives the work order (the numbers in this case are examples).','Write down the number the build gives the work order (the numbers in this case are examples; on a QA branch they look like "S10043-17581").'),
 # lines
 ('On the Lines tab click New Line, enter a name (e.g. "Brake inspection") and labor hours (e.g. 2.0), and save the line.',
  'The new work order opens with the New Line form (otherwise click New Line on the Lines tab): in "What Are You Doing?" pick a ready-made line (e.g. "Replace - Brake pot"; typed free text finds no results) and click Save & Close.'),
 ("Click the line's Approve (check) button so the work order status reads Approved.",
  'Approve the line so the work order status reads Approved: turn on Line Approved in the New Line form before saving (or use the line\'s approve control on the Lines tab).'),
 # lead
 ('On the work order page set Lead Technician (e.g. Esther Howard) and save.',LEAD_SET+' (e.g. Esther Howard); it saves at once.'+LEAD_NOTE),
 ('On the work order page set Lead Technician to the technician named (leave it empty for an unassigned one).',LEAD_SET+' (leave it as Unassigned for an unassigned one).'+LEAD_NOTE),
 ('On the work order page set Lead Technician to "Esther Howard".',LEAD_SET+' and choose "Esther Howard".'+LEAD_NOTE),
 ('Set Lead Technician to "Esther Howard" on the work order page.',LEAD_SET+' and choose "Esther Howard".'),
 # misc
 ('Customers > New Customer, name (e.g.','top menu Customers > New Customer, Name (e.g.'),
 ('Click the Columns button in the toolbar (in the design its tooltip reads "Columns")','Click the Column Selection button in the toolbar (tooltip "Column Selection")'),
 ('(in the design its button tooltip reads "By Lead Tech")','(tooltip "Tech View")'),
 (' (in the design the column reads "Assigned Tech")',''),
 (' (in the design its tooltip reads "Collapse all")',''),
 ('(in the design it reads "Search technicians")','(it reads "Search technicians")'),
 ('(pin button "Pin column" in each header)','(the pin icon in each header)'),('(pin button "Pin column" in his header)','(the pin icon in his header)'),
 ('(the same button, now "Unpin column")','(the same pin icon)'),
 ('Close the Columns menu','Close the Column Selection menu'),('(Columns menu)','(Column Selection menu)'),('the same place as Columns in Tech View','the same place as Column Selection in Tech View'),
 ('Click New Work Order, pick customer','Click Create Work Order, pick customer'),
 ('In the top bar choose Heavy Duty','Click your initials at the top right > Change Location > "Staging Heavy Duty - 9919"'),
 ('Choose Heavy Duty again','Change Location back to "Staging Heavy Duty - 9919"'),
 ('In the top bar choose ZZAUTOTEST Loc2','Click your initials at the top right > Change Location > "ZZAUTOTEST Loc2"'),
 ('remove this location from her enrolment','remove this location from her Location field'),
 ('Settings > Staff > open Jenny Wilson','Settings > Staff > Jenny Wilson\'s edit icon'),('Settings > Staff > open Theresa Webb','Settings > Staff > Theresa Webb\'s edit icon'),
 ('Settings > Staff > open ZZAUTOTEST Ezra Echo','Settings > Staff > ZZAUTOTEST Ezra Echo\'s edit icon'),
 ('Settings > Staff > add a new staff member','Settings > Staff > New Staff Member (at least one Department is required):'),
 ('Column Selection button in the toolbar (in the design its tooltip reads "Columns")','Column Selection button in the toolbar (tooltip "Column Selection")'),
 ('In the top bar switch to the new location','Click your initials at the top right > Change Location and pick the new location'),
 ('a new work order starts as Estimate; approve the estimate for Approved;','a new work order starts as Estimate (it opens with the New Line form: pick a ready-made line and Save & Close); for Approved turn on Line Approved on its line;'),
 ('Note for the tester: the server-side scoping and the organization check','Note for the tester: the behind-the-screen scoping and the organization check'), ('and they are enrolled at this location','and this location is picked in their Location field'),
 ('the role is neither Office nor Time Clock User','the Role is neither Office User nor Time Clock User'),
 ('role not Office or Time Clock User','Role not Office User or Time Clock User'),
 ('Clockable on','Time Clock on'),('Clockable','Time Clock'),
 ('enrolled at this location','with this location picked in Location'),('enrolled here','with this location picked in Location'),
 ('Create custom role','Create Custom Role'),
 ('Settings > Staff > add staff member','Settings > Staff > New Staff Member'),
 ('Settings > Staff > add "','Settings > Staff > New Staff Member (at least one Department is required): add "'),
 ('Settings > Staff > open your own staff record >','Settings > Staff > your own row\'s edit icon >'),
 ('Settings > Staff > your record >','Settings > Staff > your own row\'s edit icon >'),
 ('same toolbar place as the Columns button in List and Tech View','same toolbar place as the Column Selection button in List and Tech View'),
]
NOTHAND_IDS={368153,368155,97023,97024,97025,97026,97027,97029,97033,97034,97035}
OUT3={368160:'<p><strong>What you should see today</strong> (build v26.40.8-7a95011, 10/8/2026): the Tech View column menu is headed "Column Selection" and lists the columns with ticks, with no count beside the heading and no "Show all" or "Reset to default" buttons. (1) If you see exactly that, mark the case Failed and raise nothing new. (2) If it fails in a different way, that is a new problem: report it. (3) If the menu matches the expected results above, the change has shipped: mark it Passed and tell the QA lead.</p>',96918:'<p><strong>What you should see today</strong> (build v26.40.8-7a95011, 10/8/2026): List, Tech View and Board View show "No work orders match these filters", "Try removing a filter to widen your results." and a "Clear all filters" button. (1) If you see exactly that, mark the case Failed and raise nothing new. (2) If it fails in a different way, that is a new problem: report it. (3) If it reads "No work orders match your filters" with "Clear filters" as described above, the change has shipped: mark it Passed and tell the QA lead.</p>'}
out={};rep=[];hits=collections.Counter()
for k,c in d.items():
    cid=int(k)
    if c['created_by']==1: continue
    np,ns,e=c['custom_preconds'] or '',c['custom_steps'] or '',c['custom_expected'] or ''
    for a,b in [(E(x),E(y)) for x,y in R]:
        for f in ('p','s'):
            src=np if f=='p' else ns
            if a in src:
                hits[html.unescape(a)[:50]]+=src.count(a); src=src.replace(a,b)
                if f=='p': np=src
                else: ns=src
    # build order: a lead can only be picked once Approved -> move the lead <li> after the approve <li>
    def li_span(src,needle):
        i=src.find(needle)
        if i<0: return None
        a=src.rfind('<li>',0,i); b=src.find('</li>',i)
        return (a,b+5) if a>=0 and b>=0 else None
    sl=li_span(np,'Once the work order is Approved, pick the technician'); sa=li_span(np,'Approve the line so the work order status reads Approved')
    if sl and sa and sl[0]<sa[0] and np.count('Once the work order is Approved, pick the technician')==1:
        lead_li=np[sl[0]:sl[1]]; np=np[:sl[0]]+np[sl[1]:]
        sa=li_span(np,'Approve the line so the work order status reads Approved'); np=np[:sa[1]]+lead_li+np[sa[1]:]; hits['REORDER']+=1
    ms=re.findall(r'<p>AUTOMATION:[^<]*</p>',e)
    if len(ms)!=1: rep.append(f'C{k} markers {len(ms)}'); continue
    if cid==154650: newm='<p>AUTOMATION: HOLD - not manually testable on this QA branch (needs a second organisation; the scoping itself is a developer/automated check)</p>'
    elif cid in NOTHAND_IDS: newm=NOTHAND
    else: newm=READY
    ne=e.replace(ms[0],STAMP+newm)
    if cid in OUT3: ne=ne.replace('<p><strong>Source',OUT3[cid]+'<p><strong>Source',1) if '<p><strong>Source' in ne else ne
    head=lambda x: re.split(r'<p><strong>(What you should see today|Source)',x)[0]
    if head(ne)!=head(e): rep.append(f'C{k} EXPECTED HEAD CHANGED')
    out[k]={'custom_preconds':np,'custom_steps':ns,'custom_expected':ne,'_marker':newm[3:-4]}
json.dump(out,open(os.environ.get('OUTJ','/tmp/cln/wob-new.json'),'w'))
print('out',len(out),collections.Counter(v['_marker'][:60] for v in out.values()))
for r in rep: print(r)
print('reordered',hits['REORDER']); print('OUT3 applied:', [k for k in out if 'What you should see today' in out[k]['custom_expected']])
LEFT=['in the design','design tooltip','New Work Order >','Clockable','add a staff member','Columns button','column chooser','In the top bar, ','enrolled at this location','Create custom role']
for k,v in out.items():
    t=html.unescape(v['custom_preconds']+v['custom_steps'])
    for L in LEFT:
        if L in t: print('LEFT',k,L, '|', t[t.find(L)-60:t.find(L)+80].replace('\n',' '))
