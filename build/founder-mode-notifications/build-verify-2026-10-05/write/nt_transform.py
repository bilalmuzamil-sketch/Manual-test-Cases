import json,re,html
d=json.load(open('/tmp/cln/nt-live.json'))
E=lambda s: html.escape(s,quote=False)
STAMP='<p>Last checked against build v26.40.7-7ffda69 on 10/5/2026.</p>'
M_READY='<p>AUTOMATION: READY</p>'
M_PORTAL='<p>AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA branch</p>'
ADMIN='Sign in as an Owner/Admin user (on a QA branch: the Admin quick-login button on the sign-in page; you appear as "Admin ShopView"). The Notifications page opens from the bell icon at the top right, next to your location name.'
SECOND='on a QA branch the second user is the Tech quick-login user (sign in from a private browser window with the Tech button; appears as "Tech ShopView")'
WO_ROUTE='top menu Work Orders -> click a work order number (e.g. S2-4219) -> Notes tab'
SEED_N=('a second user writes the notes ('+SECOND+'): open a work order ('+WO_ROUTE+') -> New Note, type a message, type @ and pick "Admin ShopView" (or click a tag group pill you belong to under "Tag groups:"), then click Save')
R=[
 ('You are signed in as a user (e.g. "Admin ShopView"), on the build under test. The Notifications Center feature is on.',ADMIN),
 ('You are signed in as a user, on the build under test. The Notifications Center feature is on.',ADMIN),
 ('Sign in as any user on the build under test.',ADMIN),
 ('from another signed-in user, open a work order (e.g. S2-17578) or part sale, click New Note, @-mention you (or a tag group you belong to), with distinct sender names, references (e.g. S2-17578) and message text, and Save.',
  SEED_N.replace('then click Save','using distinct references (different work orders) and message text, then click Save')+'.'),
 ('from another signed-in user, open a work order (e.g. S2-17578) or part sale, click New Note, @-mention you (or a tag group you belong to), and Save.',SEED_N+'.'),
 ('Open the Notifications inbox from the bell icon in the top navigation.','Open the Notifications page from the bell icon at the top right (it opens on the Inbox tab).'),
 ('You are adding a note from a record that supports notes (a work order, a work order line, or a part sale), with the permission that opens it (Work Orders -> View, or Part Sales -> View for a part sale). Open the record and click New Note.',
  'Sign in as an Owner/Admin user (on a QA branch: the Admin quick-login; it holds Work orders -> View and Part sales -> View). Open a record that supports notes - a work order ('+WO_ROUTE+') or a part sale (top menu Parts -> Part Sales -> click a sale, e.g. P9667-370 -> Notes tab) - and click New Note. (For a work order line, pick the line in the dialog\'s "Create note for" list, if offered.)'),
 ('(top-right location selector)','(the location name shown next to the bell; change it with your initials at the top right -> Change Location)'),
 ('in the top-right location selector','with your initials at the top right -> Change Location'),
 ('A teammate at the same location to tag, User B (e.g. "Dana Lee"); they are listed under Settings -> Staff.',
  'A teammate at the same location to tag, User B, who can sign in: '+SECOND+'. They are listed under Settings -> Staff.'),
 ('A teammate at the same location to tag, User B (e.g. "Dana Lee"); they are listed under Settings -> Staff. Create the test role:',
  'A teammate at the same location to tag, User B, who can sign in: '+SECOND+'. They are listed under Settings -> Staff. Create the test role:'),
 ('A second teammate, User C (e.g. "Sam Ortiz").',
  'A second teammate, User C. On a QA branch only two users can sign in (Admin and Tech): when a step says "Sign in as User C", first give Tech ShopView User C\'s role (Settings -> Staff -> on Tech ShopView\'s row click the edit icon -> Role -> Save & Close; Tech signs out and back in) and run that step as Tech ShopView. For tagging or group membership only, any staff member (e.g. "Ashlee Thomas") can be User C.'),
 ('A teammate with neither role and none of those Delete permissions, User D (e.g. a Technician).',
  'A teammate with neither role and none of those Delete permissions, User D: on a QA branch, Tech ShopView with its standard Technician role (set its Role back to "Technician" before that step; check under Settings -> Roles & Permissions that the Technician role has no Delete under Work orders, Part sales or Customers).'),
 ('A teammate who is not an admin, User B (e.g. a Service Advisor "Dana Lee").','A teammate who is not an admin, User B: '+SECOND+'.'),
 ('A second non-admin teammate, User C (e.g. "Sam Ortiz").','A second non-admin teammate, User C: on a QA branch, after User B\'s steps give Tech ShopView the "Service Advisor" role (Settings -> Staff -> edit icon -> Role -> Save & Close) and use it as User C.'),
 ('A second user (e.g. "Ashlee Thomas") who has access to a work order; you will tag them on a note.',
  'A second user who can sign in and has access to a work order; you will tag them on a note: '+SECOND+'. Reading their email needs a mailbox you can open for that user; the QA quick-login addresses cannot be opened by a tester, so the email half cannot be done by hand on a QA branch (left to automation) - do the inbox and bell half.'),
 ('A user who has never opened Preferences or saved a preference.',
  'A user who has never opened Preferences or saved a preference ('+SECOND+', if its Preferences have never been saved). Whether an email arrives cannot be checked by hand on a QA branch (no mailbox a tester can open) - that half is left to automation.'),
 ('Settings -> Roles & Permissions -> Create custom role -> choose a template (e.g. "Service Advisor") -> Apply;',
  'Settings (click your initials at the top right -> Settings) -> Roles & Permissions -> Create Custom Role -> in Choose a template pick "Service Advisor" -> Apply;'),
 ('Work Orders -> New Work Order, select a customer (e.g. "4 Star Truck Repair"), save.','top menu Work Orders -> Create Work Order, select a customer (e.g. "4 Star Truck Repair"), save.'),
 ('(switch to Location 2, then Work Orders -> New Work Order)','(switch to Location 2 with your initials at the top right -> Change Location, then top menu Work Orders -> Create Work Order)'),
 ('Parts -> Part Sales -> New Part Sale, select the customer.','top menu Parts -> Part Sales -> New Part Sale, pick the Customer and click Save.'),
 ('The customer\'s own notes: Customers -> open the customer','The customer\'s own notes: top menu Customers -> open the customer'),
 ('Assets tab -> open the asset (add one if none exists) -> Notes tab.','Assets tab -> open the asset (add one if none exists) -> its Notes tab.'),
 ('To write a note on any of these records: on its Notes tab click New Note, type the message, type @ and pick the person, then save.',
  'To write a note on any of these records: on its Notes tab click New Note, type the message, type @ and pick the person from the list, then click Save.'),
 ('Open a Part Sale (e.g. "Part Sale: P99-4021").','Open a part sale: top menu Parts -> Part Sales -> click a sale (e.g. P9667-370).'),
 ('A context where more than one record could be the note\'s subject (to see "Create note for").','A context where more than one record could be the note\'s subject: a work order\'s Notes tab -> New Note shows "Create note for" (Work Order, or one of its lines).'),
 ('You are viewing a note you authored on a record (add one via New Note).','You are viewing a note you authored on a record: '+WO_ROUTE+' -> New Note -> type a message -> Save.'),
 ("Open the note's actions menu and choose \"Delete Note\".","Open the note's menu ( ... ) at its top right and choose \"Delete Note\"."),
 ("open the note's actions and look for \"Delete Note\".","open the note's menu ( ... ) and look for \"Delete Note\"."),
 ('Open a work order and start a New Note.','Open a work order ('+WO_ROUTE+') and click New Note.'),
 ('Seed a notification whose note carries an attachment.','Seed a notification whose note carries an attachment: '+SEED_N+'; then, as that author, open the note\'s menu ( ... ) -> Add attachment and attach any file.'),
 ('(edit it as its author)','(as its author, the note\'s menu ( ... ) -> Edit)'),
 ('S2-17578','S2-4219'),('"17578"','"4219"'),
 ('Collect in Portal','Collect In Portal'),
]
PERM=[('Work Orders -> View','Work orders -> View'),('Part Sales -> View','Part sales -> View'),('Work Orders -> Edit','Work orders -> Create & Edit'),
      ('Part Sales -> Edit','Part sales -> Create & Edit'),('Customers -> Edit','Customers -> Create & Edit'),('Work Orders -> Delete','Work orders -> Delete'),
      ('Part Sales -> Delete','Part sales -> Delete')]
PER={
 154659:[('Seed notifications from a note on a work order (e.g. shop 99, number 15591), a part sale (P99-4021), and a work order line.',
          'Seed notifications from a note on a work order (e.g. S2-4219), a part sale (e.g. P9667-370), and a work order line: '+SECOND+'; it writes each note (Notes tab -> New Note; for the line, pick it under "Create note for"), types @ and picks "Admin ShopView", then clicks Save.')],
 154660:[('Seed a note that tags four people other than you as recipients (e.g. Ashlee Thomas, Ashley Schultz, +2), addressed to you; and a note whose only recipient is its own author.',
          'Seed a note that tags you and four other people (e.g. Ashlee Thomas, Ashley Schultz, Amy Fernandez, Angelica Harper): '+SECOND+'; it writes the note on a work order ('+WO_ROUTE+' -> New Note), types @ and picks each person in that order, then clicks Save. Also, as yourself, write a note whose only recipient is you (type @ and pick "Admin ShopView (You)").')],
 154664:[('The location has more than seven staff, and several tag groups (own + public).','The location has more than seven staff (Staging Heavy Duty - 9919 does), and several tag groups (own + public): bell -> Tag groups tab -> New tag group -> Name, Members -> Create; turn Public tag group on for the public ones.')],
 154665:[('You own a tag group; a public tag group exists at the active location; another user owns a personal group (should not appear).',
          'You own a tag group; a public tag group exists at the active location; another user owns a personal group (should not appear). Create them on bell -> Tag groups tab -> New tag group (Name, Members, Public tag group on for the public one) -> Create; for the other user\'s personal group, sign in as Tech ShopView (Tech quick-login) and create one with Public tag group off.')],
 154666:[('You have saved quick notes (Quick notes tab); also test as a user with no quick notes.','You have saved quick notes (bell -> Quick notes tab -> New quick note -> Name and text -> Create); also test as a user with no quick notes ('+SECOND+', if it has none).')],
 154668:[('Compose a note that tags a group you belong to AND @-mentions a person who is also in that group AND @-mentions yourself.',
          'Compose a note that tags a group you belong to AND @-mentions a person who is also in that group AND @-mentions yourself. Make the group first: bell -> Tag groups -> New tag group, Members "Admin ShopView" and "Tech ShopView" -> Create; the overlapping person is Tech ShopView, whose inbox you check by signing in with the Tech quick-login.')],
 154670:[('Also a note being written on a customer and on an asset.','Also a note being written on a customer (top menu Customers -> open the customer -> Notes tab -> New Note) and on an asset (the customer\'s Assets tab -> open the asset -> its Notes tab -> New Note).')],
 154673:[("A note that reached several recipients (including an author who tagged themselves); a second user who will delete it while recipients have their inbox open.",
          "A note that reached several recipients (including an author who tagged themselves): "+SECOND+"; it writes the note on a work order, tagging itself and \"Admin ShopView\". A second user who will delete it while recipients have their inbox open: you, as Owner/Admin (the note's menu ( ... ) -> Delete Note), while Tech ShopView keeps its inbox open in the private window.")],
 154675:[('A note you authored that tagged several recipients and carries an attachment; those recipients received notifications.',
          'A note you authored that tagged several recipients and carries an attachment: '+WO_ROUTE+' -> New Note, type @ and pick "Tech ShopView" and another teammate, Save; then the note\'s menu ( ... ) -> Add attachment. Tech ShopView (Tech quick-login, private window) sees it in its inbox.')],
 154676:[('A note authored by someone else; sign in as (a) a user who is neither author nor a Delete-holder for that record, and (b) any non-author.',
          'A note authored by someone else: as Owner/Admin write a note on a work order ('+WO_ROUTE+' -> New Note -> Save). Then sign in as Tech ShopView (Tech quick-login, standard Technician role - check under Settings -> Roles & Permissions that Technician has no Work orders -> Delete); Tech ShopView is both (a) a user who is neither author nor a Delete-holder for that record, and (b) a non-author.')],
 154677:[('A notification in your inbox that you did not author.','A notification in your inbox that you did not author: '+SEED_N+'.')],
 154679:[('Confirm every user who can open the page sees all four tabs (no settings-permission gate).','Confirm every user who can open the page sees all four tabs (no settings-permission gate): check as Admin ShopView and as Tech ShopView (Tech quick-login, Technician role).')],
 154689:[('A public group and your personal group; and a personal group owned by another user.','A public group and your personal group (bell -> Tag groups -> New tag group, Public tag group on / off -> Create); and a personal group owned by another user (sign in as Tech ShopView and create one with Public tag group off). "Another user at the location" in the steps is Tech ShopView.')],
 154691:[('A public group; a personal group owned by another user; sign-in as a non-owner non-admin, and as an admin.','A public group; a personal group owned by another user; sign-in as a non-owner non-admin, and as an admin. On a QA branch: the admin is Admin ShopView; the non-admin and "another user" is Tech ShopView (Tech quick-login, Technician role). Create the public group as Admin ShopView and the personal group as Tech ShopView.')],
 154692:[('A second user at the same location.','A second user at the same location: '+SECOND+'.')],
 154693:[("A public group (that you will switch to personal); an admin renaming another user's public group; and a group whose only member has left the location.",
          "A public group (that you will switch to personal); an admin renaming another user's public group (Tech ShopView creates a public group; Admin ShopView renames it); and a group whose only member has left the location (make a group whose only member is a spare staff member, then remove that person from this location in Settings -> Staff -> edit icon -> Location -> Save & Close).")],
 154697:[('Seed a quick note whose body tags a teammate and a tag group (type @ and pick them), and a second whose body tags yourself.','Seed a quick note whose body tags a teammate and a tag group (bell -> Quick notes -> New quick note; in the text type @ and pick them, or click a "Tag groups:" pill), and a second whose body tags yourself (type @ and pick "Admin ShopView (You)"); Create each.')],
 154656:[('Seed: a notification from a work-order/part-sale note at location A, and a notification from a note on a customer or an asset (which has no location).',
          'Seed: a notification from a work-order/part-sale note at location A, and a notification from a note on a customer or an asset (which has no location): '+SECOND+'; at location A it writes a note on a work order and one on a customer (top menu Customers -> open the customer -> Notes tab), each tagging "Admin ShopView". Location B is any other location in Change Location (e.g. Staging Lethbridge - 4310).')],
 154654:[('A second user account and a second browser/device.','A second user account and a second browser/device: '+SECOND+'.')],
 154655:[('Have some unread notifications; then a state with none unread.','Have some unread notifications ('+SEED_N+'); then a state with none unread (Mark all read).')],
 154661:[],
 154662:[('Seed a notification whose note has been edited','Seed three notifications addressed to you - '+SEED_N+' - one whose note has been edited')],
 154701:[('Open the Part Sale\'s Notes tab and add a note (type @ to tag a teammate/tag group, insert a quick note, attach a file), then read it back.','Open the part sale\'s Notes tab and add a note (New Note; type @ to tag a teammate/tag group, click a "Quick notes:" pill; after saving, the note\'s menu ( ... ) -> Add attachment), then read it back.'),
         ('Edit and delete the note.','Edit and delete the note (its menu ( ... ) -> Edit, then Delete Note).')],
}
PORTAL={236974}
out={};rep=[]
for k,c in d.items():
    cid=int(k); pre=c['custom_preconds'] or ''; stp=c['custom_steps'] or ''; exp=c['custom_expected'] or ''
    np,ns=pre,stp
    for a,b in [(E(x),E(y)) for x,y in PER.get(cid,[])]:
        if a in np: np=np.replace(a,b)
        elif a in ns: ns=ns.replace(a,b)
        else: rep.append(f'C{cid} PER-MISS {html.unescape(a)[:70]}')
    for a,b in [(E(x),E(y)) for x,y in R+PERM]:
        np=np.replace(a,b); ns=ns.replace(a,b)
    # staff edit for User B/C role assignment: 'Settings -> Staff -> open User X -> Edit Staff Member -> Role -> pick "N" -> save.'
    rx=re.compile(r'Settings -&gt; Staff -&gt; open (User [A-D]) -&gt; Edit Staff Member -&gt; Role -&gt; pick (&quot;|")([^"&]+)(&quot;|") -&gt; save\.')
    np=rx.sub(lambda m:f'Settings -&gt; Staff -&gt; on {m.group(1)}\'s row click the edit icon -&gt; in Edit Staff Member set Role to "{m.group(3)}" -&gt; Save &amp; Close.',np)
    ne=re.sub(r'Source-verified ([0-9]+ [A-Z][a-z]+ 2026); not yet build-verified\.',r'Source-verified \1.',exp)
    ms=re.findall(r'<p>AUTOMATION:[^<]*</p>',ne)
    if len(ms)!=1: rep.append(f'C{cid} markers {len(ms)}'); continue
    newm=M_PORTAL if cid in PORTAL else M_READY
    ne=ne.replace(ms[0],STAMP+newm)
    head=lambda x: re.split(r'<p><strong>Source',x)[0]
    if head(ne)!=head(exp): rep.append(f'C{cid} EXPECTED HEAD CHANGED')
    out[k]={'custom_preconds':np,'custom_steps':ns,'custom_expected':ne,'_marker':newm[3:-4]}
json.dump(out,open('/tmp/cln/nt-new.json','w'))
print('out',len(out)); [print(r) for r in rep]
L=['You are signed in as a user','e.g. &quot;Dana Lee&quot;','e.g. "Dana Lee"','Sam Ortiz','New Work Order','top-right location','Create custom role','Edit Staff Member -&gt; Role -&gt; pick','another signed-in user','Work Orders -&gt; View','Part Sales -&gt; View','P99-4021','17578']
for k,v in out.items():
    t=v['custom_preconds']+v['custom_steps']
    for x in L:
        if x in t: print(f'C{k} LEFT: {x}')
