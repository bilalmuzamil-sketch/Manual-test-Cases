#!/usr/bin/env python3
"""Build the write plan for the Chris-new-requirements pass. Emits writeplan.json.
NOTHING is written to TestRail by this script."""
import json,os,sys,re,copy
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRE=json.load(open(f'{D}/PRE/cases-4281.json'))
BY={c['id']:c for c in PRE}
PROV_NEW="This has not yet been checked against a build."
KNOWN="Known issue: the product does not currently do this. It has been filed for a fix here: https://shopview.atlassian.net/browse/"
def tail(prov, marker):
    return "\n\n---\n"+prov+"\n"+PROV_NEW+"\n\nAUTOMATION: "+marker+"\n"
def set_marker(expected, marker):
    """Replace the trailing AUTOMATION marker, leaving everything else byte-identical."""
    assert expected.count("AUTOMATION: ")==1, "expected exactly one marker"
    head,_,_=expected.partition("AUTOMATION: ")
    return head+"AUTOMATION: "+marker+"\n"

plan={"adds":[],"updates":[]}

# ─────────────────────────── NEW CASES ───────────────────────────
plan["adds"].append({"internal_id":"WIP-COL-09","section_id":4353,
 "title":"The WO # is plain text, not a link, without Work Order permission",
 "refs":"SV-8660 (WIP spec v9 2026-08-05 Story 4 S4-R5 — the negative half: a person without Work Order permission sees the WO # as plain text and not a link)",
 "preconds":"\n".join([
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. You need TWO sign-ins for this test: one person who can open work orders, and one person who can see reports but CANNOT open work orders. Ask whoever manages permissions to set the second one up for you, or set it up yourself in administration and put it back as you found it afterwards.",
  "3. The Work In Progress report has at least one work order showing. If a tab looks empty, widen the date range."]),
 "steps":"\n".join([
  "1. Sign in as the person who CAN open work orders, open the Work In Progress report, and look at the WO # in the first column.",
  "2. Sign in as the person who can see reports but CANNOT open work orders, and open the Work In Progress report again.",
  "3. Look at the WO # in the first column, and try to click it.",
  "4. Do the same on all four tabs.",
  "5. If you are testing on a phone or tablet as well, repeat step 3 there."]),
 "expected":"\n".join([
  "1. For the person who CAN open work orders, the WO # is shown as a link.",
  "2. For the person who CANNOT open work orders, the WO # is shown as ordinary plain text — it is not a link, there is nothing to click, and clicking it does nothing.",
  "3. Nothing goes wrong: no page that says you are not allowed in, no blank page, and no error message. The report simply shows the number as text.",
  "4. Everything else about the row is the same for both people — the work order still appears, with its status, customer, asset and money values.",
  "5. The behaviour is the same on all four tabs.",
  "6. Note for the tester: the point of this test is that a person who cannot open a work order should never be given a link that leads nowhere. If you find a link that takes you to a page saying you are not allowed in, that is a failure — report it."])
 +tail("This is the expected behaviour as per epic SV-8582 and the Work In Progress report specification version 9 (S4-R5), which states that the WO # is shown as a link only when the user has permission to access Work Orders and that a user without Work Order permission sees the WO # as plain text and not a link.",
       "HOLD - needs a second sign-in that can see reports but cannot open work orders; no such account exists on this test system yet")})

plan["adds"].append({"internal_id":"SBC-LINK-05","section_id":4296,
 "title":"You cannot reach an invoice you have no permission to open",
 "refs":"SV-8607 (SBC spec v15 2026-08-05 Story 9 S9-R1a and S9-N2 — the two say different things about what the invoice number looks like; this case asserts only what both of them agree on)",
 "preconds":"\n".join([
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. You need TWO sign-ins: one person who can open work orders and part sales, and one person who can see reports but CANNOT open them. Ask whoever manages permissions to set the second one up, or set it up yourself in administration and put it back as you found it afterwards.",
  "3. On the Sales By Customer report you have expanded a customer and then an asset, so you can see the invoice rows underneath. You need one service invoice and one parts invoice — use a different customer for the second one if you have to."]),
 "steps":"\n".join([
  "1. Signed in as the person who CAN open them, click a service invoice's Invoice # and note where it takes you. Come back, then do the same for a parts invoice.",
  "2. Sign in as the person who CANNOT open them and open the Sales By Customer report again.",
  "3. Expand down to the same invoice rows and look carefully at the Invoice # values.",
  "4. Try to click one.",
  "5. Write down exactly what you see and what happens, in your own words."]),
 "expected":"\n".join([
  "1. For the person who CAN open them, each Invoice # is a link: a service invoice opens the work order's Finance tab, and a parts invoice opens the part sale's Part Requests tab, both in the same browser tab.",
  "2. For the person who CANNOT open them, the invoice's contents stay out of reach — they must not end up looking at a work order or a part sale they are not allowed to see.",
  "3. The report itself keeps working: the customer, asset and invoice rows are all still listed with their figures, and nothing on the page breaks.",
  "4. Note for the tester: what the Invoice # should LOOK like for that second person is an open question and you should not fail the test on it either way. The written description says two different things — in one place it says the number is shown as ordinary plain text with no link at all, and in another place it says the person clicks the link and lands on a page telling them they are not allowed in. The product owner has been asked which he wants. So write down exactly what you saw — plain text, or a link that leads to a not-allowed page — and carry on. Only report a failure if that person actually gets to SEE the work order or part sale."])
 +tail("This is the expected behaviour as per epic SV-8582 and the Sales By Customer report specification version 15. Two parts of that description disagree: S9-R1a says the invoice number is rendered as a link only when the user has permission to open the target and that a user without that permission sees it as plain text, while S9-N2 says that a user who lacks permission to open the destination invoice is shown the standard access-denied page and can press back. This case therefore asserts only what both of them require — that the person cannot reach the invoice — and the product owner has been asked to settle the rest.",
       "HOLD - waiting on one answer from the product owner about what the invoice number should look like, and it needs a second sign-in that cannot open work orders or part sales")})

plan["adds"].append({"internal_id":"SBR-LINK-06","section_id":4317,
 "title":"Invoice # and customer name when you cannot open what they point at",
 "refs":"SV-8629 (SBR spec v17 2026-08-05 §2 expanded rows — a link is rendered only with permission to open the target; note S12-R1 and S12-R3 still read as though the links are always there)",
 "preconds":"\n".join([
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. You need TWO sign-ins: one person who can open work orders, part sales and customers, and one person who can see reports but CANNOT open them. Ask whoever manages permissions to set the second one up, or set it up yourself in administration and put it back as you found it afterwards.",
  "3. On the Sales By Representative report you have expanded a representative so you can see the invoice rows underneath, each showing an Invoice # and a customer name."]),
 "steps":"\n".join([
  "1. Signed in as the person who CAN open them, click an Invoice # and note where it goes; come back and click a customer name and note where that goes.",
  "2. Sign in as the person who CANNOT open them and open the Sales By Representative report again.",
  "3. Expand the same representative and look at the Invoice # values, then try clicking one.",
  "4. Now CLICK a customer name — do not judge this one by looking at it.",
  "5. Write down exactly what happened in each case."]),
 "expected":"\n".join([
  "1. For the person who CAN open them, the Invoice # takes you to the work order or the part sale, and the customer name takes you to the customer's record, both in the same browser tab.",
  "2. For the person who CANNOT open them, neither one takes them anywhere: the work order, the part sale and the customer record all stay out of reach.",
  "3. Nothing goes wrong on the way: no page saying you are not allowed in, no blank page, no error message. The report keeps showing all its rows and figures.",
  "4. Note for the tester: you have to CLICK the customer name rather than look at it. Even for someone who IS allowed to open it, the customer name is deliberately styled to look like ordinary text — same colour, no underline — so a name you can use and a name you cannot use look exactly the same. Clicking is the only way to tell.",
  "5. Note for the tester: what these two values should LOOK like for the second person is not fully settled, so do not fail the test on appearance. The report's description says they are shown as plain text when the person cannot open the target, but the numbered requirements underneath it still say the Invoice # and the customer name are always links. The product owner has been asked. Write down what you saw and carry on; only report a failure if that person actually reaches the work order, the part sale or the customer record."])
 +tail("This is the expected behaviour as per epic SV-8582 and the Sales By Representative report specification version 17, whose §2 describes each expanded row's invoice number as a clickable link to the underlying work order or parts sale rendered as a link only when the user has permission to open that target and otherwise plain text, and the customer name as non-interactive plain text when the user cannot open the customer. That report's numbered requirements S12-R1 and S12-R3 were not updated to match and still describe both as clickable links, so this case asserts only what both readings require — that the person cannot reach the target — and the product owner has been asked to settle the rest.",
       "HOLD - waiting on one answer from the product owner about what these two values should look like, and it needs a second sign-in that cannot open work orders, part sales or customers")})

# ─────────────────────────── EDITS ───────────────────────────
def upd(cid,fields,note):
    c=BY[cid]
    plan["updates"].append({"case_id":cid,"note":note,"fields":fields})

# C30498 — S7-R1 scope
e=BY[30498]['custom_expected']
new=e.replace("1. The Advisor filter is a multi-select listing the advisors present in the loaded jobs.",
 "1. The Advisor filter is a multi-select listing the advisors on every open job in what the report is currently showing you — not only the ones on the rows that happen to have loaded.")
assert new!=e
new=new.replace("3. With two advisors selected, jobs for either advisor are shown.",
 "3. With two advisors selected, jobs for either advisor are shown.\n4. Pick an advisor whose jobs sit a long way down the list — scroll to the bottom of a busy tab to find one — and confirm every one of that advisor's jobs is still shown. You must never end up with only the part of the list that had loaded when you opened the filter.")
s=BY[30498]['custom_steps'].replace("3. Add a second advisor to the selection.",
 "3. Add a second advisor to the selection.\n4. Scroll to the bottom of a busy tab, note an advisor who only appears down there, then open the filter again and check that advisor is offered.")
upd(30498,{"custom_expected":new,"custom_steps":s,"custom_preconds":BY[30498]['custom_preconds'],
  "refs":"SV-8663 (WIP spec v9 2026-08-05 Story 7 S7-R1 — the option list covers every open job in the current scope and not only the loaded rows)"},
  "S7-R1 changed in v8: 'present in the loaded jobs' -> 'present across all open jobs in the current scope'")

# C30499 — S7-R2 scope
e=BY[30499]['custom_expected']
new=e.replace("2. Typing narrows the option list (type-ahead); the options are the customers present in the loaded jobs.",
 "2. Typing narrows the option list (type-ahead); the options are the customers on every open job in what the report is currently showing you — not only the ones on the rows that happen to have loaded.")
assert new!=e
new=new.replace("4. Clear returns the filter to \"All customers\" and every job is shown again.",
 "4. Clear returns the filter to \"All customers\" and every job is shown again.\n5. Pick a customer whose jobs sit a long way down the list — scroll to the bottom of a busy tab to find one — and confirm every one of that customer's jobs is still shown. You must never end up with only the part of the list that had loaded when you opened the filter.")
s=BY[30499]['custom_steps'].replace("4. Use the \"Clear\" action.",
 "4. Use the \"Clear\" action.\n5. Scroll to the bottom of a busy tab, note a customer who only appears down there, then type that customer's name into the filter and check they are offered.")
upd(30499,{"custom_expected":new,"custom_steps":s,"custom_preconds":BY[30499]['custom_preconds'],
  "refs":"SV-8663 (WIP spec v9 2026-08-05 Story 7 S7-R2 and S7-R3 — the option list covers every open job in the current scope and not only the loaded rows)"},
  "S7-R2 changed in v8: 'present in the loaded jobs' -> 'present across all open jobs in the current scope'")

# C30500 — S7-R4 scope + the filed defect
e=BY[30500]['custom_expected']
new=e.replace("2. Each option shows both the asset's Unit # and its VIN.",
 "2. The list offers every asset on every open job in what the report is currently showing you — not only the ones on the rows that happen to have loaded — and each option shows both the asset's Unit # and its VIN.")
assert new!=e
new=new.replace("\n\n---\n", "\n"+KNOWN+"SV-8908\nThat is about assets that share a Unit # with another asset: only one of them is offered, so typing the other one's VIN finds nothing. On today's test data six assets are affected. Everything else in this test works.\n\n---\n",1)
new=set_marker(new,"READY - EXPECT FAIL (SV-8908)")
s=BY[30500]['custom_steps'].replace("4. Select one or more assets and watch the rows; then use the \"Clear\" action.",
 "4. Scroll to the bottom of a busy tab, note an asset that only appears down there, then type its Unit # and then its VIN into the filter and check it is offered both ways.\n5. Select one or more assets and watch the rows; then use the \"Clear\" action.")
upd(30500,{"custom_expected":new,"custom_steps":s,"custom_preconds":BY[30500]['custom_preconds'],
  "refs":"SV-8663 (WIP spec v9 2026-08-05 Story 7 S7-R4 and S7-R5 — the option list covers every asset on every open job in the current scope; option text and match fields per Chris Ward answer 2026-07-29)"},
  "S7-R4 changed in v9: scope wording added; and the matching assertion is now provably broken - SV-8908")

# C30100 — SBC S9-N2 vs the new S9-R1a
e=BY[30100]['custom_expected']
new=e.replace("\n\n---\n",
 "\n3. Note for the tester: the written description now says two different things about this, so do not fail the test on what the invoice number LOOKS like. The part this test was written from says the person clicks the link and lands on a page telling them they are not allowed in. Another part, added on 5 August 2026, says that person is not given a link at all and simply sees the invoice number as ordinary plain text. Both are in the same description today. The product owner has been asked which he wants. Write down exactly what you saw — a link leading to a not-allowed page, or plain text with nothing to click — and carry on. The one thing that would be a real failure is that person actually SEEING the invoice they are not allowed to see.\n\n---\n",1)
assert new!=e
new=new.replace("This is the expected behaviour as per epic SV-8582 and the Sales By Customer report specification version 15 (S9-N2).",
 "This is the expected behaviour as per epic SV-8582 and the Sales By Customer report specification version 15 (S9-N2), which states that a user who lacks permission to open the destination invoice is shown the standard access-denied page and can press back to return to the report. The same version's S9-R1a, added on 5 August 2026, instead states that such a user is never given a link and sees the invoice number as plain text; the two have not been reconciled and the product owner has been asked which applies.")
new=set_marker(new,"HOLD - waiting on one answer from the product owner about whether this person is given a link at all")
upd(30100,{"custom_expected":new,"custom_steps":BY[30100]['custom_steps'],"custom_preconds":BY[30100]['custom_preconds']},
  "SBC v15 added S9-R1a which contradicts this case's own S9-N2; held rather than flipped (Rules 15/57)")

# The nine WIP export cases -> EXPECT FAIL on the filed download defect
WIP_EXP=[30510,30512,30513,30514,30515,30516,30517,30518,38918]
for cid in WIP_EXP:
    c=BY[cid]; e=c['custom_expected']
    assert "AUTOMATION: READY\n"==e[-len("AUTOMATION: READY\n"):], f"C{cid} unexpected marker"
    new=e.replace("\n\n---\n","\n"+KNOWN+"SV-8907\nOn this build the Work In Progress download fails whenever the tab you are on has any rows in it — no file arrives and an error appears — so you cannot get far enough to check the things below. A download only succeeds on a tab with no rows at all.\n\n---\n",1)
    assert new!=e
    new=set_marker(new,"READY - EXPECT FAIL (SV-8907)")
    upd(cid,{"custom_expected":new,"custom_steps":c['custom_steps'],"custom_preconds":c['custom_preconds']},
        "the Work In Progress download is broken on this build - SV-8907")

json.dump(plan,open(f'{D}/writeplan.json','w'),indent=1)
print("adds",len(plan["adds"]),"updates",len(plan["updates"]))
for a in plan["adds"]:
    print(f"  ADD {a['internal_id']:12s} sec {a['section_id']} | title {len(a['title'])} chars | refs {len(a['refs'])} chars")
    assert len(a['title'])<=80, "title too long"
    for part in a['refs'].split(','): assert len(part.strip())<=248, "refs entry too long"
for u in plan["updates"]:
    print(f"  UPD C{u['case_id']} {u['note'][:80]}")
    if 'refs' in u['fields']:
        for part in u['fields']['refs'].split(','): assert len(part.strip())<=248
