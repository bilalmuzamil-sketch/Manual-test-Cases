#!/usr/bin/env python3
"""Per-ticket words for the rework. Every value a step tells the tester to read was confirmed
visible on the record's own page first (FIELD-CHECK.json, FIELD-CHECK-4.json); every count in
"Current behaviour" was read off the build on 15 September (REVERIFY-2026-09-15.json, QA-CAPTURE.json)
and every "what today's version does" off production the same day (PROD-CAPTURE.json)."""
import json, os

D = os.path.dirname(os.path.abspath(__file__))
RUN = 'https://shopview.testrail.io/index.php?/tests/view/'

def sign(step2=None):
    return ["Sign in to the new version on the test branch: https://sv9160.qa.shopview.com"]

def src_v1(typed, what, rows_v1):
    return ("The expected behaviour comes from the version people use today. It was not read out of a "
            "specification - it was typed into the live product at https://app.shopview.com on 15 September "
            f"2026, where {typed} returned {rows_v1}, and the picture above is that search. "
            "The same records are seeded on both, so the two halves of the picture are the same words "
            "typed into the same box, one version each.")

T = {}

T['SV-10002'] = dict(
 title="Global Search: a customer cannot be found by their postcode",
 image="SV-10002.png",
 description=("A customer's postcode is printed on their record, and the search box ignores it. Anyone who "
   "knows roughly where a customer is - which is how people tell two similar company names apart - has no "
   "way to reach them from the search box. On the version people use today, typing the postcode brings the "
   "customer straight back."),
 steps=["Sign in to the new version on the test branch: https://sv9160.qa.shopview.com",
   "Click the search box at the top of the screen (or press Ctrl and K), type ZZAUTOTEST Bridgeport Hauling, "
   "and open that customer from the Customers group. This also shows the search box itself is working.",
   "On the customer's page, read the postcode under Address. It is 44872-9931.",
   "Open the search box again and type that postcode exactly as the record prints it.",
   "Wait for the results and read the Customers group."],
 current=["Nothing comes back at all. The panel reads \"No results for 44872-9931\" and every group shows nought.",
   "The same customer comes straight back when their name is typed, so the record is there and the search box is working."],
 expected=["The customer whose postcode was typed is returned, under Customers.",
   "This is what the version people use today does."],
 shot_caption="The same postcode typed into both versions. Above, the live product returns the customer. Below, the new version returns nothing.",
 sources=src_v1("the postcode 44872-9931", "a customer postcode", "the customer ZZAUTOTEST Bridgeport Hauling"),
 test=("Finding a customer by address, city or postal code still works", 2959359))

T['SV-10003'] = dict(
 title="Global Search: a customer cannot be found by their website address",
 image="SV-10003.png",
 description=("A customer's website is printed on their record, and the search box ignores it. Someone who has "
   "the company's website in front of them - off an email footer or an invoice - cannot use it to reach the "
   "customer. On the version people use today, typing the website brings the customer straight back."),
 steps=["Sign in to the new version on the test branch: https://sv9160.qa.shopview.com",
   "Click the search box at the top of the screen (or press Ctrl and K), type ZZAUTOTEST Bridgeport Hauling, "
   "and open that customer from the Customers group. This also shows the search box itself is working.",
   "On the customer's page, read the line marked Website. It is bridgeporthauling-zzt.com.",
   "Open the search box again and type that website address exactly as the record prints it.",
   "Wait for the results and read the Customers group."],
 current=["Nothing comes back at all. The panel reads \"No results for bridgeporthauling-zzt.com\" and every group shows nought.",
   "The same customer comes straight back when their name is typed, so the record is there and the search box is working."],
 expected=["The customer whose website was typed is returned, under Customers.",
   "This is what the version people use today does."],
 shot_caption="The same website address typed into both versions. Above, the live product returns the customer. Below, the new version returns nothing.",
 sources=src_v1("the website bridgeporthauling-zzt.com", "a customer website", "the customer ZZAUTOTEST Bridgeport Hauling"),
 test=("Finding a customer by their website still works", 2959360))

T['SV-10005'] = dict(
 title="Global Search: a supplier cannot be found by their postcode",
 image="SV-10005.png",
 description=("A supplier's postcode is printed on their record, and the search box ignores it. Someone holding "
   "a delivery note or an invoice with the supplier's address on it cannot use it to reach them. On the version "
   "people use today, typing the postcode brings the supplier straight back."),
 steps=["Sign in to the new version on the test branch: https://sv9160.qa.shopview.com",
   "Click the search box at the top of the screen (or press Ctrl and K), type ZZAUTOTEST Kestrel, and open "
   "that supplier from the Vendors group. This also shows the search box itself is working.",
   "On the supplier's page, read the postcode in its address. It is 43055-2210.",
   "Open the search box again and type that postcode exactly as the record prints it.",
   "Wait for the results and read the Vendors group."],
 current=["Nothing comes back at all. The panel reads \"No results for 43055-2210\" and every group shows nought.",
   "The same supplier comes straight back when their name is typed, so the record is there and the search box is working."],
 expected=["The supplier whose postcode was typed is returned, under Vendors.",
   "This is what the version people use today does."],
 shot_caption="The same supplier postcode typed into both versions. Above, the live product returns the supplier. Below, the new version returns nothing.",
 sources=src_v1("the postcode 43055-2210", "a supplier postcode", "the supplier ZZAUTOTEST Kestrel Parts Supply"),
 test=("Finding a vendor by address, city or postal code still works", 2959362))

T['SV-10006'] = dict(
 title="Global Search: a supplier cannot be found by the state they are in, although a customer can",
 image="SV-10006.png",
 description=("Typing the name of a state finds the CUSTOMERS in that state but not the SUPPLIERS in it. The "
   "same word, the same box, two different answers depending on which kind of company the record is. Someone "
   "looking for a supplier in a particular state is told there is none, while the customers next door on the "
   "same street are listed. On the version people use today, both come back."),
 steps=["Sign in to the new version on the test branch: https://sv9160.qa.shopview.com",
   "Click the search box at the top of the screen (or press Ctrl and K), type ZZAUTOTEST Kestrel, and open "
   "that supplier from the Vendors group. Read its address: it is in Ohio.",
   "Open the search box again and type Ohio.",
   "Read the Customers group. Customers whose address is in Ohio are listed, with the word Ohio marked in their address.",
   "Now read the Vendors group, and look for ZZAUTOTEST Kestrel Parts Supply."],
 current=["The supplier in Ohio is not there. The Vendors group holds one company, Ohioville Diesel Services LLC, "
   "and it is listed because Ohio is part of its NAME - its address is in North Cathyville.",
   "The Customers group at the same time lists three customers whose address is in Ohio, so the state is being "
   "read on customers and not on suppliers."],
 expected=["Suppliers whose address is in the state typed are returned under Vendors, the same way customers "
   "in that state already are.",
   "This is what the version people use today does."],
 shot_caption="The name of a state typed into both versions. Above, the live product lists the supplier in Ohio. Below, the new version lists the customers in Ohio but not the supplier.",
 sources=src_v1("the state name Ohio", "a supplier's state", "the supplier ZZAUTOTEST Kestrel Parts Supply alongside the customers in that state"),
 test=("Finding a vendor by state or province", 2959372))

T['SV-10007'] = dict(
 title="Global Search: a vehicle cannot be found by its number plate",
 image="SV-10007.png",
 description=("A vehicle's number plate is printed on its record, and the search box ignores it. The plate is "
   "what is readable on a truck standing in the yard, so it is often the only thing the person at the desk has. "
   "On the version people use today, typing the plate brings the vehicle straight back."),
 steps=["Sign in to the new version on the test branch: https://sv9160.qa.shopview.com",
   "Click the search box at the top of the screen (or press Ctrl and K), type ZZT-4471, and open the vehicle "
   "from the Assets group. This also shows the search box itself is working.",
   "On the vehicle's page, read its number plate. It is OHZZT471.",
   "Open the search box again and type that plate exactly as the record prints it.",
   "Wait for the results and read the Assets group."],
 current=["Nothing comes back at all. The panel reads \"No results for OHZZT471\" and every group shows nought.",
   "The same vehicle comes straight back when its unit number is typed, so the record is there and the search box is working."],
 expected=["The vehicle whose plate was typed is returned, under Assets.",
   "This is what the version people use today does."],
 shot_caption="The same number plate typed into both versions. Above, the live product returns the vehicle. Below, the new version returns nothing.",
 sources=src_v1("the number plate OHZZT471", "a vehicle number plate", "the vehicle 2019 Freightliner Cascadia"),
 test=("Searching an asset's licence plate finds that asset", 2902696))

T['SV-10008'] = dict(
 title="Global Search: jobs can no longer be found by typing the stage they are at",
 image="SV-10008.png",
 description=("Typing a job stage - Estimate, Approved and the rest - used to list the jobs sitting at that "
   "stage. It no longer does. That is how a service writer sweeps up the estimates waiting on a customer's "
   "word, and it is gone. What comes back instead is a long list of companies whose street address happens "
   "to contain a similar-looking word."),
 steps=["Sign in to the new version on the test branch: https://sv9160.qa.shopview.com",
   "Open Work Orders from the top menu and note that jobs are shown with a stage against them, several of "
   "them at Estimate.",
   "Click the search box at the top of the screen (or press Ctrl and K) and type Estimate.",
   "Wait for the results and read the Work orders group.",
   "Look at what the other groups came back with, and at the words marked inside each row."],
 current=["No job at the Estimate stage comes back. The Work orders group holds one job, and that job is at "
   "the Paid stage - it was matched on the wording of one of its line items, not on its stage.",
   "The other eighteen results are customers and suppliers whose street address contains the word Estate, "
   "which the search treated as near enough to Estimate."],
 expected=["The jobs sitting at the stage typed are returned, under Work orders.",
   "This is what the version people use today does."],
 shot_caption="The same job stage typed into both versions. Above, the live product lists the jobs at that stage. Below, the new version lists street addresses containing the word Estate.",
 sources=src_v1("the stage name Estimate", "a job stage", "the jobs sitting at that stage"),
 test=("Finding a work order by typing its status still works", 2977470))

T['SV-10025'] = dict(
 title="Global Search: a correctly spelled name brings back records that have nothing to do with it",
 image="SV-10025.png",
 gained=True,
 description=("The search corrects spelling, and it corrects it so freely that a name typed correctly is "
   "buried. Type a customer's name exactly as it is written on their record and eighteen things come back, "
   "most of them unrelated - the word MARINE on a battery terminal is offered as a near-spelling of Marlene. "
   "The person has to read the whole list to find the record they already knew the name of."),
 steps=["Sign in to the new version on the test branch: https://sv9160.qa.shopview.com",
   "Click the search box at the top of the screen (or press Ctrl and K) and type Marlene - the name of the "
   "customer ZZAUTOTEST Marlene Freight Lines, spelled exactly as their record spells it.",
   "Wait for the results and count what comes back.",
   "Read the rows and the words marked inside them."],
 current=["Eighteen results come back across five groups.",
   "Most have nothing to do with the name typed: four parts described as MARINE/POST ADAPTER TERMINAL and "
   "MARINE BATTERY TERMINALS, a vehicle belonging to Martens' Diesel Repair, and customers reached through "
   "a contact rather than the name.",
   "The customer actually asked for is in the list, but it takes reading the list to see that."],
 expected=["Typing a name that is spelled correctly returns the records that carry that name, and does not "
   "fill the list with words that merely look similar.",
   "This is what the version people use today does: the same word returns only the records that really carry it."],
 shot_caption="The same correctly spelled customer name typed into both versions. Above, the live product returns only the records that carry it. Below, the new version returns eighteen, most of them unrelated.",
 sources=src_v1("the customer name Marlene", "a correctly spelled name", "only the records that really carry that name"),
 test=("Typing a name does not bring back other differently spelled names", 2984234))

T['SV-10055'] = dict(
 title="Global Search: a vehicle cannot be found by its year and make typed together",
 image="SV-10055.png",
 description=("A vehicle is named on its own record by its year and its make - 2019 Freightliner Cascadia - "
   "and typing that into the search box returns no vehicle at all. It is the most natural thing to type when "
   "someone is looking at a truck. On the version people use today it brings the vehicle straight back."),
 steps=["Sign in to the new version on the test branch: https://sv9160.qa.shopview.com",
   "Click the search box at the top of the screen (or press Ctrl and K), type ZZT-4471, and open the vehicle "
   "from the Assets group. This also shows the search box itself is working.",
   "On the vehicle's page, read how it is named: 2019 Freightliner Cascadia, with Year: 2019 shown against it.",
   "Open the search box again and type 2019 Freightliner.",
   "Wait for the results and read the Assets group."],
 current=["No vehicle comes back. The Assets group shows nought, even though thirty-five other things are found.",
   "What does come back is fifteen parts, two part sales and eighteen purchase orders, matched on the words "
   "Freightliner or 2019 appearing in a part name or an order line.",
   "The same vehicle comes straight back when its unit number is typed, so the record is there."],
 expected=["The vehicle whose year and make were typed is returned, under Assets.",
   "This is what the version people use today does."],
 shot_caption="A vehicle's year and make typed into both versions. Above, the live product returns the vehicle. Below, the new version returns thirty-five results and not one of them a vehicle.",
 sources=src_v1("the year and make 2019 Freightliner", "a vehicle year and make", "the vehicle 2019 Freightliner Cascadia"),
 test=("Finding an asset by its year and make typed together", 2959371))

T['SV-10057'] = dict(
 title="Global Search: a customer cannot be found by part of their telephone number",
 image="SV-10057.png",
 description=("Typing the whole telephone number finds the customer. Typing only the last part of it finds "
   "nothing. People rarely have the whole number - they have the last few digits off a caller display, or the "
   "part they can remember - and on the version people use today any part of it was enough. This report is "
   "about the partial number only: the whole number works on the new version, in every way of writing it."),
 steps=["Sign in to the new version on the test branch: https://sv9160.qa.shopview.com",
   "Click the search box at the top of the screen (or press Ctrl and K), type ZZAUTOTEST Bridgeport Hauling, "
   "and open that customer from the Customers group.",
   "On the customer's page, read the line marked Phone. It is (419) 555-0143.",
   "Open the search box again and type the whole number, (419) 555-0143. The customer comes back - this part works.",
   "Now clear the box and type only the last part of the same number: 555-0143.",
   "Wait for the results and read the Customers group."],
 current=["Part of the number returns nothing at all. The panel reads \"No results for 555-0143\" and every "
   "group shows nought. Typing it without the dash, 5550143, does the same.",
   "The whole number works in all four ways of writing it - (419) 555-0143, 419-555-0143, 4195550143 and "
   "419 555 0143 - so this is about the partial number only."],
 expected=["Part of a telephone number finds the customer, the way the whole number already does.",
   "This is what the version people use today does: it looks for what was typed anywhere inside the number."],
 shot_caption="Part of a telephone number typed into both versions. Above, the live product returns the customer. Below, the new version returns nothing.",
 sources=src_v1("the part-number 555-0143", "part of a telephone number", "the customer ZZAUTOTEST Bridgeport Hauling"),
 test=("Finding a customer by the company's own main phone number", 2977474))

T['SV-10058'] = dict(
 title="Global Search: a vehicle cannot be found by part of its chassis number",
 image="SV-10058.png",
 description=("Typing the whole chassis number finds the vehicle. Typing the last few characters of it finds "
   "nothing. The last few characters are what people use, because that is what fits on a note and what is "
   "quoted on the phone. On the version people use today any part of it was enough. This report is about the "
   "partial number only: the whole number works on the new version."),
 steps=["Sign in to the new version on the test branch: https://sv9160.qa.shopview.com",
   "Click the search box at the top of the screen (or press Ctrl and K), type ZZT-4471, and open the vehicle "
   "from the Assets group.",
   "On the vehicle's page, read the line marked VIN/Serial #. It is 1FUJGLDR9KLZZ4471.",
   "Open the search box again and type the whole number, 1FUJGLDR9KLZZ4471. The vehicle comes back - this part works.",
   "Now clear the box and type only the last six characters of the same number: ZZ4471.",
   "Wait for the results and read the Assets group."],
 current=["Part of the number returns nothing at all. The panel reads \"No results for ZZ4471\" and every group shows nought.",
   "The whole chassis number returns the vehicle in the same sitting, so this is about the partial number only."],
 expected=["Part of a chassis number finds the vehicle, the way the whole number already does.",
   "This is what the version people use today does: it looks for what was typed anywhere inside the number."],
 shot_caption="Part of a chassis number typed into both versions. Above, the live product returns the vehicle. Below, the new version returns nothing.",
 sources=src_v1("the part-number ZZ4471", "part of a chassis number", "the vehicle 2019 Freightliner Cascadia"),
 test=("Finding an asset by its VIN, in full and in part", 2980691))

T['SV-10060'] = dict(
 title="Global Search: part of a word finds the record in the company name and the street, but not in the town",
 image="SV-10060.png",
 description=("Typing a few characters from the middle of a word finds the record when those characters sit in "
   "the company's name or in the street, and finds nothing when the same characters sit in the town. The person "
   "typing has no way of knowing which part of an address the rule applies to, so the search looks broken to "
   "them roughly half the time. On the version people use today it works in all of them."),
 steps=["Sign in to the new version on the test branch: https://sv9160.qa.shopview.com",
   "Click the search box at the top of the screen (or press Ctrl and K), type ZZAUTOTEST Bridgeport Hauling, "
   "and open that customer from the Customers group.",
   "On the customer's page, read the address: 1450 Kestrelway Industrial, Dock 7B, Fernvale, Ohio 44872-9931.",
   "Open the search box again and type ernva - five characters from the middle of the town, Fernvale.",
   "Read the Customers group.",
   "Now clear the box and type idgepor - seven characters from the middle of the company's own name. Then "
   "try estrelw, from the middle of the street name Kestrelway."],
 current=["The characters from the middle of the TOWN return nothing at all. The panel reads \"No results for ernva\".",
   "The characters from the middle of the COMPANY NAME return the customer, and so do the characters from the "
   "middle of the STREET. The same kind of typing works on two parts of the record and not on the third."],
 expected=["A few characters from the middle of a word find the record wherever that word sits on it, the town included.",
   "This is what the version people use today does."],
 shot_caption="A fragment from the middle of a town name typed into both versions. Above, the live product returns the customers in that town. Below, the new version returns nothing.",
 sources=src_v1("the fragment ernva, from the middle of the town Fernvale", "a mid-word fragment",
                "the customers whose address is in that town"),
 test=("Finding a record by a fragment from the middle of a word still works", 2977472))

for k,v in T.items():
    if 'test' in v:
        name,tid = v.pop('test')
        v['sources'] = v['sources'] + ("\n\nThe test that covers this, and its result on this run: \"" + name +
            "\" - " + RUN + str(tid))

p = os.path.join(D,'TICKET-CONTENT.json')
old = json.load(open(p)) if os.path.exists(p) else {}
old.update(T)
json.dump(old, open(p,'w'), indent=1)
print('written', len(T), 'tickets; file now holds', len(old))
