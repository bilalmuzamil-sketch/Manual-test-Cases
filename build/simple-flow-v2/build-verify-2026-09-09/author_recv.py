import json
cases={}
for sec in ['6670','6672']:
    for c in json.load(open(f'/tmp/sf_sec{sec}.json')): cases[c['id']]=c
BUILD="Last checked against build v26.35.9-5700a76 on 9/9/2026."
WO='top menu "Work Orders" -> the "Work Orders" tab -> open a work order -> its "Lines" tab'
RCV='On the part\'s row click "Receive" to open the "Receive parts" modal (fields: "Assign vendor", "Vendor invoice number", "Invoice date", "Delivery note"; buttons "Select all", "Receive later", "Receive parts (n)")'
TECH='sign in as TECH@shopview.com whose role is set for this test (reset the role from Settings -> Roles & Permissions, then assign it to TECH; never change the Admin role)'
AWAIT=f'Open, via {WO}, a work order with a vendor-sourced part that has been ordered and is awaiting receipt (Require Ordering Parts and Require Receiving Parts Before Completion on in Settings -> the "Work Orders" tab; add a vendor part to a line and click "Order", so its row shows it awaiting receipt).'
PRE={
 44583:["1. Sign in as an Owner or Admin (Order Parts).", f"2. {AWAIT}", f"3. {RCV}. The modal's contents depend on the entry point (part row, line menu, bulk action bar, or completion wizard)."],
 44584:["1. Sign in as an Owner or Admin (Order Parts).", f"2. {AWAIT}", f"3. {RCV}."],
 44585:["1. Sign in as an Owner or Admin (Order Parts + Vendor & Order Mgmt: Create & Edit).", f"2. {AWAIT} with a part whose vendor is missing.", f"3. {RCV}; use \"Assign vendor\" on the vendor-missing card."],
 44586:["1. Sign in as an Owner or Admin (Order Parts).", f"2. {AWAIT} with parts across two purchase orders.", f"3. {RCV}."],
 44587:[f"1. For this check, {TECH} with See Financial Data OFF but Work Orders View + Order/Receive Parts ON.", f"2. {AWAIT}", f"3. {RCV} and confirm the money fields (cost, tax, sell) are removed while receiving still works."],
 44588:["1. Sign in as an Owner or Admin (Order Parts).", f"2. {AWAIT}; also have an unordered/unapproved part and an invoiced work order for the negative checks.", f"3. {RCV}."],
 53487:["1. Sign in as an Owner or Admin (Order Parts + Vendor & Order Mgmt: Create & Edit).", f"2. {AWAIT}", f"3. {RCV}; correct the vendor before the part is received, then receive it."],
 44592:["1. Sign in as an Owner or Admin with the Received later permission and Order Parts; Require Receiving Parts Before Completion is on (Settings -> the \"Work Orders\" tab).", f"2. {AWAIT}", f"3. On the part row the Receive control is a split button: \"Receive\", a divider, and a caret offering \"Received later\" (also in the bulk action bar and the completion wizard's receive step). It is chosen per part inside the \"Receive parts\" modal via \"Receive later\"."],
 44593:[f"1. For the no-permission check, {TECH} WITHOUT the Received later permission; and separately, with Require Receiving Parts Before Completion OFF (Settings -> the \"Work Orders\" tab).", f"2. {AWAIT}", "3. Look at the Receive control on the part row and in the \"Receive parts\" modal for any \"Received later\" option."],
 53489:["1. Sign in as an Owner or Admin with the Received later permission and Order Parts.", f"2. {AWAIT} with a part that carries a core.", f"3. {RCV} and choose \"Received later\" for the parent part."],
}
def split_exp(t):
    lines=t.split('\n'); mi=[i for i,l in enumerate(lines) if l.strip().startswith('AUTOMATION:')][-1]
    return lines[:mi]
out={}
for cid in PRE:
    d=cases[cid]
    steps=[l for l in d['steps'].split('\n') if l.strip()]
    content=[l for l in split_exp(d['exp']) if l.strip()!='']+[BUILD]
    if '---' in content:
        i=content.index('---'); pblocks=[content[:i], content[i:]+['AUTOMATION: READY']]
    else:
        pblocks=[content+['AUTOMATION: READY']]
    mk=lambda blocks:{'blocks':blocks,'text':'\n\n'.join('\n'.join(b) for b in blocks)}
    out[str(cid)]={'title':d['title'],'fields':{'custom_preconds':mk([PRE[cid]]),'custom_steps':mk([steps]),'custom_expected':mk(pblocks)}}
json.dump(out,open('build/simple-flow-v2/build-verify-2026-09-09/intended-blocks.json','w'),indent=1)
json.dump([str(c) for c in PRE],open('build/simple-flow-v2/build-verify-2026-09-09/targets.json','w'))
print(f"authored {len(out)} receiving+receive-later cases: {sorted(PRE)}")
