import json
cases={}
for sec in ['6673','6674','6675','6676']:
    for c in json.load(open(f'/tmp/sf_sec{sec}.json')): cases[c['id']]=c
BUILD="Last checked against build v26.35.9-5700a76 on 9/9/2026."
WO='top menu "Work Orders" -> the "Work Orders" tab -> open a work order -> its "Lines" tab'
WIZ='The completion wizard opens from "Create invoice" (in the work order header three-dot / more_vert menu) when something is still collectable; it shows step pills across the top (e.g. "Tech stories (1)", "Pick parts (2)", "Missing Details (1)") each with a count, and each step carries its own action button (Save Story / Pick all / Receive parts) that saves and advances - there is no Continue button'
PARTMENU='the part row three-dot (more_vert, "Part context menu"): it holds "Move" and "Add Part Fee / Discount"'
PRE={
 # Completion Wizard
 44594:["1. Sign in as an Owner or Admin (completion permission).", f"2. Open, via {WO}, a work order that has something outstanding (e.g. a line missing a required tech story, an unpicked inventory part). {WIZ}. Also try opening it from the other finish paths (bulk complete, clock out and complete)."],
 44595:["1. Sign in as an Owner or Admin.", f"2. Open, via {WO}, a work order with several kinds of outstanding items (tech stories, pick parts, cores, receive, missing details). {WIZ}."],
 44596:["1. Sign in as an Owner or Admin.", f"2. Open, via {WO}, a work order with an outstanding wizard step. {WIZ}."],
 44597:["1. Sign in as an Owner or Admin.", f"2. Open, via {WO}, a work order and start the wizard from different entry points (Create invoice; complete/finish). {WIZ}."],
 44598:["1. Sign in as an Owner or Admin.", f"2. Open, via {WO}, a work order with a mix of required and not-required steps. {WIZ}."],
 # Finish Action
 44599:["1. Sign in as an Owner or Admin.", f"2. Open, via {WO}, work orders in different states. The header three-dot (more_vert) menu offers the finish action that is genuinely next (\"Create invoice\", or complete/review as applicable); \"Mark as reviewed\" appears only once every line is complete."],
 44600:["1. Sign in as an Owner or Admin (invoicing permission).", f"2. Open, via {WO}, a completable work order that still has outstanding steps. Use \"Create invoice\" in the header three-dot menu: it runs the completion wizard first if needed, then invoices and opens the payment screen."],
 44601:["1. Sign in as an Owner or Admin for most checks; for the no-permission check, use TECH@shopview.com whose role lacks the finish permission (reset the role from Settings -> Roles & Permissions, then assign to TECH; never change the Admin role).", f"2. Open, via {WO}, work orders that are: awaiting review, invoice-locked, and declined-only, to see which finish action is offered."],
 # Part Rows and Menus
 44602:["1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit, Full View).", f"2. Open, via {WO}, a work order with lines and parts. Open {PARTMENU}, and the line's three-dot menu, to read the actions each offers."],
 44603:["1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit, Full View).", f"2. Open, via {WO}, a work order with parts in states that exercise the negatives (a part that could be requested, a completed line to Uncomplete, a part whose Receive visibility depends on the receiving setting). Open {PARTMENU} and the line's three-dot menu."],
 # Reordering
 44604:["1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit, Full View).", f"2. Open, via {WO}, a line that carries two or more parts. Use \"Move\" (or \"Move up\" / \"Move down\") in {PARTMENU} to reorder a part within its line; reload to confirm the order persists."],
 44605:["1. Sign in as an Owner or Admin (Work Order Lines: Create & Edit, Full View).", f"2. Open, via {WO}, a line with parts, plus an invoiced work order, for the negatives (cross-line moves, invoiced work order, concurrent edits). Use \"Move\" in {PARTMENU}."],
}
def split_exp(t):
    lines=t.split('\n'); mk=[i for i,l in enumerate(lines) if l.strip().startswith('AUTOMATION:')]
    return lines[:mk[-1]] if mk else lines
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
print(f"authored {len(out)} mid cases: {sorted(PRE)}")
