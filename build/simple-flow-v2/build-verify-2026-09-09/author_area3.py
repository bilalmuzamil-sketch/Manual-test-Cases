import json
cases={c['id']:c for c in json.load(open('/tmp/sf_area3.json'))}
BUILD="Last checked against build v26.35.9-5700a76 on 9/9/2026."
WO='top menu "Work Orders" -> the "Work Orders" tab -> open a work order -> its "Lines" tab'
LINEMENU='the line\'s three-dot (more_vert) menu at the right of the line row'
PRE={
 44566:[ "1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit, in Full View).",
         f"2. Open a work order with lines in each status, via {WO}. Reach the statuses this way: a brand-new line via \"New Line\" is Needs Approval; approve it to make it Approved; decline it (from {LINEMENU}) to make it Declined; complete an Approved line (its \"Complete\" button) to make it Complete." ],
 44567:[ "1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit, in Full View).",
         f"2. Open, via {WO}, an Approved line that holds a part which has been received or picked (the part row shows \"Received\" or has been Picked)." ],
 44568:[ "1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit + Full View, Pick Parts and Order Parts).",
         f"2. Open a work order, via {WO}, with parts in each state on its lines: Requested, Quoted, Auth to order, In Stock (unpicked), Awaiting, Received later, and Received/picked (and a Returned part). A part's state shows as its status badge on its row; states are reached through the part lifecycle (add a part request, Order it, Receive it, Pick it, return it)." ],
 44569:[ "1. Sign in as an Owner or Admin (Order Parts permission).",
         f"2. Open, via {WO}, a work order with a vendor-sourced part that is unordered; you can toggle the receiving setting in Settings -> the \"Work Orders\" tab (Require Receiving Parts Before Completion)." ],
 44570:[ "1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit, in Full View).",
         f"2. Open, via {WO}, an Approved line holding parts in mixed states: Requested, In Stock, Quoted, Auth to order, Awaiting, Received and Returned (states shown as each part's status badge)." ],
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
print(f"authored {len(out)} area-3 cases")
