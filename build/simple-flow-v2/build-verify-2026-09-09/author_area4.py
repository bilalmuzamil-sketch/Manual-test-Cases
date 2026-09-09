import json
cases={c['id']:c for c in json.load(open('/tmp/sf_area4.json'))}
BUILD="Last checked against build v26.35.9-5700a76 on 9/9/2026."
WO='top menu "Work Orders" -> the "Work Orders" tab -> open a work order -> its "Lines" tab'
BAR='tick the row checkboxes on the lines/parts to raise the bulk action bar (it shows "N selected", the primary actions, a "More" overflow, and a "close" X, replacing the column headers)'
TECH='sign in as TECH@shopview.com whose role has been set for this test (reset the role from Settings -> Roles & Permissions, then assign it to TECH; never change the Admin role)'
def P(*lines): return list(lines)
PRE={
 44571:P("1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit, Full View).",
         f"2. Open, via {WO}, a work order with several lines in mixed statuses (Needs Approval, Approved, Declined, Complete) that carry parts; {BAR}."),
 44572:P("1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit, Full View).",
         f"2. Open a work order via {WO} and make a selection that qualifies for several actions including the finish/complete action; {BAR}."),
 44573:P("1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit, Full View).",
         f"2. Open a work order via {WO} and select lines/parts that qualify for approve, order and receive; {BAR}."),
 44574:P(f"1. For the no-permission check, {TECH} WITHOUT Work Order Lines: Create & Edit.",
         f"2. Separately, as a user WITH it, open a work order via {WO} and make a selection that qualifies for nothing (e.g. only Complete lines with no eligible action); {BAR}."),
 44575:P("1. Sign in as an Owner or Admin (completion permission).",
         f"2. Open, via {WO}, an Approved work order with four labour lines: two Needs Approval, one Approved, one Declined (a new \"New Line\" is Needs Approval; approve/decline via the line's three-dot menu); {BAR}."),
 44576:P("1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit, Full View).",
         f"2. Open a work order via {WO}. Make a four-line selection where one line holds received parts, and separately a selection made entirely of declined lines; {BAR}."),
 44577:P("1. Sign in as an Owner or Admin (Work Orders: Create & Edit).",
         f"2. Open a work order via {WO}. Select Approved lines, some missing a tech story or mileage; and separately select every open line; {BAR}."),
 44578:P("1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit, Full View).",
         f"2. Open a work order via {WO} with several lines and select them; {BAR}."),
 44579:P("1. Sign in as an Owner or Admin (Order Parts + See Financial Data).",
         f"2. Open a work order via {WO} and select unordered parts spanning two vendors, plus a Requested part and a vendorless part; {BAR}."),
 44580:P("1. Sign in as an Owner or Admin (Order Parts).",
         f"2. Open a work order via {WO} and select a mix of already-ordered parts, inventory/found parts, and a part with no source; {BAR}. For the negative check, {TECH} WITHOUT Order Parts."),
 44581:P("1. Sign in as an Owner or Admin (Pick Parts).",
         f"2. Open a work order via {WO} and select several inventory/found parts that are \"In Stock\" and unpicked; {BAR}."),
 44582:P(f"1. For the no-permission check, {TECH} WITHOUT Pick Parts.",
         f"2. Open a work order via {WO} and select pickable parts; {BAR}."),
 53486:P("1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit, Full View).",
         f"2. Open a work order via {WO} that has several lines and parts, so both a line group and a parts group can appear in the bulk action bar; {BAR}."),
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
print(f"authored {len(out)} area-4 cases")
