# -*- coding: utf-8 -*-
import json
src=open('new_cases_parity.py').read(); ns={}
exec(compile(src.split("CASES = [")[0],'x','exec'),ns)
PRE,PROV,FLAG,P=ns['PRE'],ns['PROV'],ns['FLAG'],ns['P']

C=[
{'t':'Finding a customer by company name','r':'SV-9160 (INV-03; V1 baseline 55767168; c.name)',
 'p':"<br>1. The customer 'ZZAUTOTEST Bridgeport Hauling' exists.<br>2. Customers access: View.",
 's':'1. Open global search.<br>2. Type a distinctive word from the company name: Bridgeport<br>3. Read the Customers group.<br>4. Clear the input and type the full name: ZZAUTOTEST Bridgeport Hauling<br>5. Read the Customers group again.',
 'e':"Both searches return the customer 'ZZAUTOTEST Bridgeport Hauling'.<br>This is the most basic thing global search does and the control for every other customer case on this suite - if this fails, nothing else about customers can be trusted."+FLAG,
 'c':'FetchDataQueryHandler.php:224-245, where c.name is the label and is also folded into the customer search text',
 'x':'Version 1.5 of the specification (Confluence page 576978945) section 4 indexes the customer name.'},
{'t':'Finding a vendor by name','r':'SV-9160 (INV-05; V1 baseline 55767168; v.name)',
 'p':"<br>1. The vendor 'ZZAUTOTEST Kestrel Parts Supply' exists.<br>2. Vendors access: View.",
 's':'1. Open global search.<br>2. Type a distinctive word from the vendor name: Kestrel<br>3. Read the Vendors group.<br>4. Clear the input and type the full name: ZZAUTOTEST Kestrel Parts Supply<br>5. Read the Vendors group again.',
 'e':"Both searches return the vendor 'ZZAUTOTEST Kestrel Parts Supply' under Vendors.<br>Note the word Kestrel also appears on a part and on the customer address - the vendor must still be returned in its own group, not swallowed by the others."+FLAG,
 'c':'FetchDataQueryHandler.php:155-164, where v.name is folded into the vendor search text',
 'x':'Version 1.5 of the specification (Confluence page 576978945) section 4 indexes the vendor name.'},
{'t':'Finding an asset by its VIN, in full and in part','r':'SV-9160 (INV-04; V1 baseline 55767168; v.vin)',
 'p':"<br>1. The asset with VIN '1FUJGLDR9KLZZ4471', unit 'ZZT-4471', exists.<br>2. Customers access: View.",
 's':'1. Open global search.<br>2. Type the COMPLETE VIN: 1FUJGLDR9KLZZ4471<br>3. Read the Assets group.<br>4. Clear the input and type the last part of the VIN only: ZZ4471<br>5. Read the Assets group again.',
 'e':("Both searches return the asset.<br>In V1 the VIN was matched anywhere inside the record's search text, so the whole VIN and any piece of it both worked - a technician reading the last six characters off a windscreen plate could find the vehicle.<br>"
      "<strong>THIS CASE IS EXPECTED TO FAIL ON THE CURRENT BUILD, AND IN A STRANGE WAY.</strong> On 14 September 2026 the complete VIN returned NOTHING while the first eleven characters '1FUJGLDR9KL' DID return the asset. If you see exactly that, mark FAILED and raise nothing new - it is already reported. Fails differently: a NEW problem, report it. Passes: the fix shipped, tell the QA lead."+FLAG),
 'c':'FetchDataQueryHandler.php:292 (v.vin folded into the asset search text) with useGlobalSearch.ts:92 (matched anywhere inside it)',
 'x':"Version 1.5 of the specification (Confluence page 576978945) section 4 indexes VIN and section 7 requires an exact match after normalization - so the complete VIN returning nothing is a build defect. Whether a PART of a VIN should still match is the V1 behaviour this suite protects."},
{'t':"Finding a customer or vendor by a contact's first or last name",'r':'SV-9160 (INV-03; V1 baseline 55767168; cu.first_name + cu.last_name)',
 'p':"<br>1. The customer 'ZZAUTOTEST Bridgeport Hauling' has the contact person Marlene Okonkwo.<br>2. Customers access: View.",
 's':'1. Open global search.<br>2. Type the contact first name: Marlene<br>3. Read the results.<br>4. Clear the input and type the contact last name: Okonkwo<br>5. Read the results again.',
 'e':"Both searches return the customer 'ZZAUTOTEST Bridgeport Hauling'.<br>In V1 a contact match produced its own row; in V2 the company row is returned instead, marked as a contact match. Either presentation passes - what must not happen is finding nothing, because the person's name is how staff look up a company they only know by who they speak to."+FLAG,
 'c':'FetchDataQueryHandler.php:240-243, which folds every contact first name and last name into the customer search text',
 'x':'Version 1.5 of the specification (Confluence page 576978945) section 4 indexes contact names.'},
{'t':'Search finds records whatever mix of capitals is typed','r':'SV-9160 (INV-13; V1 baseline 55767168; case-insensitive)',
 'p':"<br>1. The customer 'ZZAUTOTEST Bridgeport Hauling' exists.<br>2. Customers access: View.",
 's':'1. Open global search.<br>2. Type all lower case: bridgeport<br>3. Read the Customers group.<br>4. Clear the input and type all capitals: BRIDGEPORT<br>5. Read it again.<br>6. Clear the input and type a mixture: BrIdGePoRt<br>7. Read it again.',
 'e':"All three return the same customer.<br>In V1 both the typed text and the record text were put into lower case before matching, so capitals never mattered. Nobody types a company name with the right capitals."+FLAG,
 'c':'useGlobalSearch.ts:67, 81 and 91, where the query and both matching passes are lower-cased',
 'x':'Version 1.5 of the specification (Confluence page 576978945) section 7 describes normalization before matching.'},
{'t':'Finding a work order by its plain number with no prefix','r':'SV-9160 (INV-02; V1 baseline 55767168; wo.raw_number)',
 'p':"<br>1. The work order S9160-17580 exists. Its plain number is 17580 - that is the number without the S, without the shop number and without the dash.<br>2. Work Orders access: View.",
 's':'1. Open global search.<br>2. Type the plain number on its own: 17580<br>3. Read the Work orders group.',
 'e':("The work order S9160-17580 is returned.<br>In V1 the plain number was stored as a searchable value in its own right, separately from the formatted number - it was not merely a fragment that happened to match. So typing the bare number was a supported way to find a work order, not a side-effect."+FLAG),
 'c':'FetchDataQueryHandler.php:96 (wo.raw_number folded into the work order search text as its own value, alongside wo.number)',
 'x':'Version 1.5 of the specification (Confluence page 576978945) section 4 indexes the work order number; it does not separately name the unprefixed number.'},
{'t':'Pressing Enter opens the top result without arrowing to it','r':'SV-9160 (INV-41; V1 baseline 55767168)',
 'p':"<br>1. The customer 'ZZAUTOTEST Bridgeport Hauling' exists.<br>2. Customers access: View.",
 's':'1. Open global search.<br>2. Type: Bridgeport<br>3. Wait for the results to appear.<br>4. WITHOUT pressing any arrow key, press Enter.',
 'e':"The top result opens.<br>In V1 the first selectable result was highlighted automatically as soon as results appeared, so type-then-Enter went straight to the record. If Enter does nothing until you press a Down arrow first, that is a step added to the single most common way people use search."+FLAG,
 'c':'GlobalSearch.vue:173-184 and 205, which highlight the first selectable result after every filter',
 'x':'Version 1.5 of the specification (Confluence page 576978945) section 5.5 says Enter opens the focused row; it does not say whether a row is focused automatically.'},
{'t':'Search can be reached on a phone and a tablet as well as a desktop','r':'SV-9160 (INV-50; V1 baseline 55767168)',
 'p':"<br>1. The customer 'ZZAUTOTEST Bridgeport Hauling' exists.<br>2. Customers access: View.<br>3. You can resize the browser window, or use a real phone and tablet.",
 's':'1. On a normal desktop window, confirm you can reach global search and find the customer by typing Bridgeport.<br>2. Narrow the window to tablet width (about 900 pixels) and repeat.<br>3. Narrow it to phone width (about 400 pixels) and repeat - on a narrow screen search may be behind an icon you tap first.',
 'e':"At all three sizes search can be reached and returns the customer.<br>In V1 search was always visible on desktop and tablet, and on a phone it appeared when you tapped a search icon. Technicians work from phones in the yard, so losing search at phone width removes the feature for the people who lean on it most."+FLAG,
 'c':'DesktopMenu.vue:52, 74, 77-101 with GlobalSearch.vue:81-91, which place search on desktop and tablet and toggle it inline on mobile',
 'x':'Version 1.5 of the specification (Confluence page 576978945) covers the mobile surface; this case checks only that the capability is reachable at each size.'},
{'t':'A search that matches nothing says so plainly','r':'SV-9160 (INV-44; V1 baseline 55767168)',
 'p':"<br>1. Any signed-in user.<br>2. No record contains the text ZZNOSUCHRECORD9999.",
 's':'1. Open global search.<br>2. Type: ZZNOSUCHRECORD9999<br>3. Wait for the search to run and read what the screen says.',
 'e':"A clear no-results message is shown.<br>The list does not simply sit empty, and it does not keep showing a spinner or the previous results.<br>In V1 the no-results message appeared only after at least two characters had been typed and nothing matched - so an empty box never claimed there were no results."+FLAG,
 'c':'GlobalSearch.vue:33-39 and 151-153, which show the no-results state only after a two-character search returns nothing',
 'x':'Version 1.5 of the specification (Confluence page 576978945) describes a no-results state.'},
]
out=[{'section_id':6769,'title':c['t'],'template_id':1,'type_id':7,'priority_id':2,'refs':c['r'],
 'custom_automation_type':0,'custom_atmstatus':1,'custom_preconds':P(PRE+c['p']),
 'custom_steps':P(c['s']),'custom_expected':P(c['e'])+PROV.format(cite=c['c'],spec=c['x'])} for c in C]
json.dump(out,open('parity-cases-batch3.json','w'),indent=1)
for i,c in enumerate(out,1):
    assert len(c['title'])<=80,(len(c['title']),c['title']); assert ',' not in c['refs'].split('(')[0]
    print(f"{i}. [{len(c['title']):2d}] {c['title']}")
