import json,re
cases={c['id']:c for c in json.load(open('/tmp/sf_area1.json'))}
BUILD="Last checked against build v26.35.9-5700a76 on 9/9/2026."
SET_ROUTE='in the left sidebar under SETTINGS click "Settings", then click the "Work Orders" tab at the top of the page (the page with the WORKFLOW, LINE REQUIREMENTS and PARTS toggle groups and a "Save Settings" button)'
# authored preconditions (list of lines) per case — build routes + seeding
PRE={
 44549:[ "1. Sign in as an Owner or Admin (top-right shows your name and the shop).",
         f"2. Open the work-order settings page: {SET_ROUTE}." ],
 44550:[ "1. Sign in as an Owner or Admin.",
         f"2. Open the work-order settings page: {SET_ROUTE}.",
         "3. Note the shop's current picking behaviour (whether inventory/found parts must be Picked before a line can complete)." ],
 44551:[ "1. Sign in as an Owner or Admin.",
         f"2. Open the work-order settings page: {SET_ROUTE}.",
         "3. Have one open (Approved) work order with a part on a line: top menu \"Work Orders\" -> the \"Work Orders\" tab -> open a work order -> the \"Lines\" tab -> a line that carries a part (use \"+ Add Part\" on a line to add one if none is present)." ],
 44552:[ "1. Sign in as an Owner or Admin.",
         f"2. Open the work-order settings page: {SET_ROUTE}.",
         "3. Have one open work order that carries an inventory (or found) part and a part that still needs receiving: \"Work Orders\" -> \"Work Orders\" tab -> open a work order -> \"Lines\" tab." ],
 44553:[ "1. Sign in as an Owner or Admin.",
         f"2. Open the work-order settings page: {SET_ROUTE}.",
         "3. Have a work order whose parts are already recorded as ordered and as picked: \"Work Orders\" -> \"Work Orders\" tab -> open such a work order -> \"Lines\" tab (a part shows its status badge, e.g. \"In stock\", on its row)." ],
 44554:[ "1. Sign in as an Owner or Admin.",
         f"2. Open the work-order settings page: {SET_ROUTE}.",
         "3. Have several open work orders in different statuses with outstanding parts and unapproved lines: \"Work Orders\" -> the \"Work Orders\" tab lists the open work orders." ],
 44555:[ "1. Sign in as an Owner or Admin.",
         f"2. Open the work-order settings page: {SET_ROUTE}.",
         "3. Have at least one open work order that a settings change will touch: \"Work Orders\" -> \"Work Orders\" tab -> open a work order; its audit trail is the \"History\" tab on the work order." ],
 44556:[ "1. Sign in as an Owner or Admin.",
         f"2. Open the work-order settings page: {SET_ROUTE}.",
         "3. Have one invoiced (or paid) work order and one work order with a declined line and its parts: \"Work Orders\" -> the \"Completed\" tab lists invoiced/paid work orders; the \"Work Orders\" tab lists open ones." ],
 44557:[ "1. Sign in as an Owner or Admin.",
         f"2. Open the work-order settings page: {SET_ROUTE}.",
         "3. Have open work orders with outstanding parts so a settings change affects a non-zero number of records (\"Work Orders\" -> \"Work Orders\" tab), and be able to reach a state where a change affects zero records (a shop with no matching open records)." ],
 44558:[ "1. Sign in as an Owner or Admin.",
         f"2. Open the work-order settings page: {SET_ROUTE}.",
         "3. Begin a settings change so its confirmation dialog is open: toggle one of the PARTS settings (\"Require Ordering Parts\" or \"Require Picking Inventory Parts\") and click \"Save Settings\"." ],
 44559:[ "1. Sign in as an Owner or Admin.",
         f"2. Open the work-order settings page: {SET_ROUTE}.",
         "3. Have a settings change queued that affects many existing records: toggle \"Require Ordering Parts\" or \"Require Picking Inventory Parts\" while several open work orders carry outstanding parts." ],
 44560:[ "1. Sign in as an Owner or Admin.",
         f"2. Open the work-order settings page: {SET_ROUTE}.",
         "3. A large settings change is applied. NOTE: forcing the change to fail part-way is not reachable from the UI (it needs fault injection); if a partial failure is ever observed in the wild, use the checks below." ],
}
# step route-reference fixes
def fix_steps(t):
    t=t.replace("Open Administration > App Settings (the Work Order settings page).","Open Settings -> the \"Work Orders\" tab (left sidebar \"Settings\", then the \"Work Orders\" tab).")
    t=t.replace("Open the Work Order settings page.","Open Settings -> the \"Work Orders\" tab.")
    t=t.replace("Administration > App Settings","Settings -> the \"Work Orders\" tab")
    t=t.replace("App Settings","the \"Work Orders\" settings tab")
    return t
HOLD={44560:'AUTOMATION: HOLD - a settings change that fails part-way cannot be forced from the UI; needs fault injection'}
def split_exp(t):
    # returns (content_lines_before_marker, marker_line)
    lines=[l for l in t.split('\n')]
    mi=[i for i,l in enumerate(lines) if l.strip().startswith('AUTOMATION:')]
    mi=mi[-1]
    return lines[:mi], lines[mi]
out={}
for cid in PRE:
    d=cases[cid]
    pre=PRE[cid]
    steps=[fix_steps(l) for l in d['steps'].split('\n') if l.strip()]
    content,marker = split_exp(d['exp'])
    # content is [outcomes..., '---', provenance...]; insert BUILD before marker, set new marker
    content=[l for l in content if l.strip()!='']
    content=content+[BUILD]
    newmarker = HOLD.get(cid,'AUTOMATION: READY')
    # blocks: outcomes paragraph up to '---'; then provenance paragraph (from '---' onward)
    if '---' in content:
        i=content.index('---'); pblocks=[content[:i], content[i:]+[newmarker]]
    else:
        pblocks=[content+[newmarker]]
    def mk(blocks): return {'blocks':blocks,'text':'\n\n'.join('\n'.join(b) for b in blocks)}
    out[str(cid)]={'title':d['title'],'fields':{
        'custom_preconds':mk([pre]),
        'custom_steps':mk([steps]),
        'custom_expected':mk(pblocks),
    }}
json.dump(out,open('build/simple-flow-v2/build-verify-2026-09-09/intended-blocks.json','w'),indent=1)
json.dump([str(c) for c in PRE],open('build/simple-flow-v2/build-verify-2026-09-09/targets.json','w'))
print(f"authored {len(out)} area-1 cases; targets + intended-blocks written")
# sanity print one expected
print(json.dumps(out['44549']['fields']['custom_expected'],indent=1)[:700])
