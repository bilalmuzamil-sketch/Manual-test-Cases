# -*- coding: utf-8 -*-
"""Authors the V1-PARITY cases the earlier audit wrongly excluded.

The excluded-because-V2-spec-changed-it reasoning is REVERSED by the QA lead's
2026-09-14 ruling: a capability V1 had and V2 lacks is a finding for the PO to
rule on, EVEN WHERE THE V2 SPEC DELIBERATELY REMOVED IT.
"""
import json

PRE = ('1. Sign in to ShopView. In the app header click the <strong>Search</strong> box '
 '(it is a BUTTON, data-test-id <em>global_search_trigger</em>, not a typeable field) or press '
 '&#8984;K / Ctrl+K. Global search opens as a CENTRED MODAL over the page: a text input at the top, '
 'then a scope tab strip - All, Work orders, Customers, Assets, Parts, Vendors, Part sales, '
 'Purchase orders, Vendor invoices - each showing its own result count, then results grouped by type '
 'with a count beside each heading (e.g. "Work orders (4)"). Esc closes the modal. NOTE: group headings '
 'are SENTENCE case in the build ("Work orders", "Part sales"). If a group shows nothing, click that '
 "entity's scope tab to confirm it really is 0 rather than scrolling. "
 '<em>Modal behaviour verified on the V2 QA branch sv9160 on 14 September 2026.</em>')

PROV = ('<p>---<br>This is the expected behaviour as per epic SV-9160 and the V1 behaviour recorded in the '
 'ShopView code baseline 55767168 ({cite}). {spec}<br>'
 'Standing Rule 96 makes a V1 capability the default expectation and Standing Rule 58 makes a '
 'code-versus-document conflict a PO DECISION ITEM, so this case asserts the V1 behaviour and tells '
 'you to record and flag rather than guess.<br><br>'
 'AUTOMATION: Not available on Build to test Yet - Last checked 14/9/2026</p>')

FLAG = ('<br><strong>IF THIS FAILS:</strong> it is a real V1-to-V2 capability loss. Mark the test '
 'Blocked with the exact query you typed and what came back, and flag it - a task ticket goes to the '
 'Product Owner to confirm whether the loss is acceptable. Do not raise it as a defect until the PO '
 'has ruled, and do not pass the test just because the V2 specification allows the new behaviour.')

def P(s): return '<p>' + s + '</p>\n'

CASES = [
{
 'title': 'Finding a work order by typing its status still works',
 'refs': 'SV-9160 (INV-02; V1 baseline 55767168; PRD 1.5 s4 - status DROPPED at spec v12 - PO DECISION)',
 'preconds': PRE + '<br>1. The four seeded work orders S9160-17580, S9160-17581, S9160-17582 and S9160-17583 exist for customer \'ZZAUTOTEST Bridgeport Hauling\'.<br>2. Open one of them and write down the status shown on it (for example Estimate, In Progress, Approved or Quality Check).<br>3. Work Orders access: View.',
 'steps': '1. Open global search.<br>2. Type the status word exactly as it appears on the work order, for example: Estimate<br>3. Read the Work orders group.<br>4. Clear the input and repeat with a two-word status typed as one word, for example: qualitycheck<br>5. Read the Work orders group again.',
 'expected': ('Work orders in that status are returned by both forms.<br>'
   'In V1 the status word was part of what a work order could be found by - the underscore was removed '
   '(so \'in_progress\' matched \'inprogress\') and \'quality_check\' also matched \'qualitycheckqc\'. '
   'A dispatcher typing \'Estimate\' into search got the estimates back.' + FLAG),
 'cite': 'FetchDataQueryHandler.php:113-116, which folds wo.status into the work order search text',
 'spec': 'Version 1.5 of the Global Search - Product Requirements specification (Confluence page 576978945) section 4 does NOT list status among the indexed Work Order fields - it was removed at specification version 12.',
},
{
 'title': 'Finding a record by typing only part of its number still works',
 'refs': 'SV-9160 (INV-12; V1 baseline 55767168; PRD 1.5 s7 identifiers exact-only - PO DECISION)',
 'preconds': PRE + "<br>1. Work order S9160-17580 exists.<br>2. The stocked part 'ZZAUTOTEST Brake Chamber Kestrel', part number 'ZZT-88-4412', exists with quantity on hand.<br>3. The asset with unit number 'ZZT-4471' exists.<br>4. Access: Work Orders View, Catalog &amp; Inventory View, Customers View.",
 'steps': '1. Open global search.<br>2. Type only the tail of the work order number: 17580<br>3. Read the Work orders group.<br>4. Clear the input and type only the tail of the part number: 4412<br>5. Read the Parts group.<br>6. Clear the input and type only the tail of the unit number: 4471<br>7. Read the Assets group.',
 'expected': ('Each search returns its record: 17580 returns work order S9160-17580, 4412 returns the '
   'brake chamber part, and 4471 returns the asset.<br>'
   'In V1 the second matching pass looked for the typed text ANYWHERE inside the record\'s search text, '
   'so a fragment of any number found the record. This is how people actually search - they type the '
   'last few digits of a work order rather than the whole shop-prefixed number.' + FLAG),
 'cite': 'useGlobalSearch.ts:92, the second pass which matches with .includes() - the typed text anywhere inside the search text',
 'spec': 'Version 1.5 of the specification (Confluence page 576978945) section 7 states that identifier fields require an EXACT match after normalization and bypass fuzzy logic, which by design no longer matches a fragment.',
},
{
 'title': 'Finding a record by a fragment from the middle of a word still works',
 'refs': 'SV-9160 (INV-12; V1 baseline 55767168; PRD 1.5 s7 fuzzy scoring - PO DECISION)',
 'preconds': PRE + "<br>1. The customer 'ZZAUTOTEST Bridgeport Hauling' exists, city 'Fernvale', address line 1 '1450 Kestrelway Industrial'.<br>2. Customers access: View.",
 'steps': '1. Open global search.<br>2. Type a fragment from the middle of the city name: ernva<br>3. Read the Customers group.<br>4. Clear the input and type a fragment from the middle of the company name: idgepor<br>5. Read the Customers group again.<br>6. Clear the input and type a fragment from the middle of the address: estrelw<br>7. Read the Customers group again.',
 'expected': ('All three searches return the customer \'ZZAUTOTEST Bridgeport Hauling\'.<br>'
   'In V1 the typed text was matched anywhere inside the record\'s search text, so a fragment from the '
   'middle of any word found the record. V2 scores similarity instead, and a short fragment can score '
   'below the cut-off and return nothing.' + FLAG),
 'cite': 'useGlobalSearch.ts:84-93, the second pass matching the haystack with .includes()',
 'spec': 'Version 1.5 of the specification (Confluence page 576978945) section 7 replaces substring matching with trigram similarity, Damerau-Levenshtein distance and Double Metaphone scoring against a threshold; the specification is SILENT on whether a mid-word fragment still matches.',
},
{
 'title': 'Every matching type still appears when a search matches many records',
 'refs': 'SV-9160 (INV-14, INV-15; V1 baseline 55767168; PRD 1.5 s5.2 20-result cap - PO DECISION)',
 'preconds': PRE + "<br>1. Records exist matching the word ZZAUTOTEST across SEVERAL types at once: the customer 'ZZAUTOTEST Bridgeport Hauling', the asset owned by it, the vendor 'ZZAUTOTEST Kestrel Parts Supply', the part 'ZZAUTOTEST Brake Chamber Kestrel' and the four work orders S9160-17580 to S9160-17583.<br>2. Access to all of those areas: Work Orders View, Customers View, Vendors View, Catalog &amp; Inventory View.",
 'steps': '1. Open global search.<br>2. Type: ZZAUTOTEST<br>3. Stay on the All tab and write down every group heading you can see, and its count.<br>4. Click each scope tab in turn - Work orders, Customers, Assets, Parts, Vendors - and write down the count on each.<br>5. Compare: is there any type that has matches on its own tab but shows NO rows and NO group on the All tab?',
 'expected': ('Every type that has a match is represented on the All tab. No matching type is missing '
   'from the All view.<br>'
   'In V1 each type was given its own slots (up to three) and there was no overall limit, so if six '
   'types matched, all six were shown. V2 caps the whole result list at 20, so a type with real matches '
   'can be squeezed out entirely by a type that matches more often - the user sees nothing for it and '
   'believes the record does not exist.' + FLAG),
 'cite': 'useGlobalSearch.ts:152 (MAX_PER_TYPE = 3, applied per type) with no overall cap anywhere in the filter',
 'spec': 'Version 1.5 of the specification (Confluence page 576978945) section 5.2 caps counts and the result list at 20 and section 2 rules out pagination; the specification is SILENT on whether a matching type may be shown zero rows because of that cap.',
},
{
 'title': "Finding a customer by the company's own main phone number",
 'refs': 'SV-9160 (INV-03; V1 baseline 55767168; PRD 1.5 s4 phones)',
 'preconds': PRE + "<br>1. The customer 'ZZAUTOTEST Bridgeport Hauling' exists with the company telephone '(419) 555-0143'.<br>2. This is the COMPANY's own phone number on the customer record - not the phone number of any contact person. The contact Marlene Okonkwo has a different number, (419) 555-0177.<br>3. Customers access: View.",
 'steps': '1. Open global search.<br>2. Type the company phone number with its formatting: (419) 555-0143<br>3. Read the Customers group.<br>4. Clear the input and type the same number as plain digits: 4195550143<br>5. Read the Customers group again.',
 'expected': ("Both forms return the customer 'ZZAUTOTEST Bridgeport Hauling'.<br>"
   'The result is matched on the COMPANY record, so it should not be labelled as a contact match.<br>'
   'In V1 the company\'s own telephone was searchable in its own right, separately from its contacts\' '
   'numbers. An existing case covers a CONTACT\'s phone number; this one covers the company\'s.' + FLAG),
 'cite': 'FetchDataQueryHandler.php:235, which folds c.telephone into the customer search text with the brackets normalised',
 'spec': 'Version 1.5 of the specification (Confluence page 576978945) sections 4 and 7 index phone numbers and normalise them to digits.',
},
{
 'title': 'Finding a vendor by phone number',
 'refs': 'SV-9160 (INV-05; V1 baseline 55767168; PRD 1.5 s4 Vendors)',
 'preconds': PRE + "<br>1. The vendor 'ZZAUTOTEST Kestrel Parts Supply' exists with telephone '(614) 555-0188'.<br>2. Vendors access: View.",
 'steps': '1. Open global search.<br>2. Type the vendor phone number with its formatting: (614) 555-0188<br>3. Read the Vendors group.<br>4. Clear the input and type the same number as plain digits: 6145550188<br>5. Read the Vendors group again.',
 'expected': ("Both forms return the vendor 'ZZAUTOTEST Kestrel Parts Supply'.<br>"
   'In V1 a vendor could be found by its phone number just as a customer could. The existing phone-number '
   'case in the suite uses a CUSTOMER, so the vendor side was never covered.' + FLAG),
 'cite': 'FetchDataQueryHandler.php:162, which folds v.telephone into the vendor search text',
 'spec': 'Version 1.5 of the specification (Confluence page 576978945) section 4 lists the Vendor fields indexed for search.',
},
{
 'title': 'Finding an asset by its model',
 'refs': 'SV-9160 (INV-04; V1 baseline 55767168; PRD 1.5 s4 Assets)',
 'preconds': PRE + "<br>1. The asset '2019 Freightliner Cascadia', unit number 'ZZT-4471', owned by 'ZZAUTOTEST Bridgeport Hauling', exists.<br>2. Cascadia is the MODEL. Freightliner is the make. This case tests the model.<br>3. Customers access: View (assets are shown under Customers access).",
 'steps': '1. Open global search.<br>2. Type the model name: Cascadia<br>3. Read the Assets group.',
 'expected': ("The asset '2019 Freightliner Cascadia' is returned.<br>"
   'In V1 both the make and the model were searchable. The suite has a case that searches a misspelled '
   'MAKE (Freightliner), which proves the make is searchable, but nothing searched the MODEL on its '
   'own.' + FLAG),
 'cite': 'FetchDataQueryHandler.php:289, which folds the vehicle model name (vm.name) into the asset search text',
 'spec': 'Version 1.5 of the specification (Confluence page 576978945) section 4 lists the Asset fields indexed for search.',
},
{
 'title': "Finding a part sale by its customer's name",
 'refs': 'SV-9160 (INV-02; V1 baseline 55767168; PRD 1.5 s4 Part Sales)',
 'preconds': PRE + "<br>1. A PART SALE exists for the customer 'ZZAUTOTEST Bridgeport Hauling'. A part sale number begins with P (for example P9160-nnnnn), not S. If none exists, create one for that customer first and note its number.<br>2. Part Sales access: View.",
 'steps': '1. Open global search.<br>2. Type the customer name: Bridgeport<br>3. Read the Part sales group (click the Part sales scope tab if the group is not visible on the All tab).',
 'expected': ("The part sale for 'ZZAUTOTEST Bridgeport Hauling' is returned under Part sales.<br>"
   'In V1 work orders and part sales were produced by the same query and both carried the customer '
   'name in their search text, so typing the customer found both. The suite has a case for finding a '
   'WORK ORDER by customer name; the part sale side was never covered, and in V2 Part Sales is a '
   'separate entity with its own indexing.' + FLAG),
 'cite': 'FetchDataQueryHandler.php:91-118 and 284-289, where one fetcher yields both Work Order and Part Sale rows and folds c.name into the search text of both',
 'spec': 'Version 1.5 of the specification (Confluence page 576978945) section 4 lists the Part Sale fields indexed for search.',
},
]

out=[]
for c in CASES:
    out.append({
      'section_id': 6769,
      'title': c['title'],
      'template_id': 1,
      'type_id': 7,
      'priority_id': 2,
      'refs': c['refs'],
      'custom_automation_type': 0,
      'custom_atmstatus': 1,
      'custom_preconds': P(c['preconds']),
      'custom_steps': P(c['steps']),
      'custom_expected': P(c['expected']) + PROV.format(cite=c['cite'], spec=c['spec']),
    })
json.dump(out, open('parity-cases.json','w'), indent=1)
for i,c in enumerate(out,1):
    assert len(c['title'])<=80, c['title']
    print(f"{i}. [{len(c['title']):2d}] {c['title']}")
print(f"\n{len(out)} cases written to parity-cases.json")
