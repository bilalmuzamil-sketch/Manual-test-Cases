import json
cases={c['id']:c for c in json.load(open('/tmp/sf_sec6677.json'))}
BUILD="Last checked against build v26.35.9-5700a76 on 9/9/2026."
RP='Settings -> "Roles & Permissions" (left sidebar) -> click the pencil on a role to open its permission toggles'
TECH='use TECH@shopview.com whose role is set for this test (reset the role from Settings -> Roles & Permissions, then assign it to TECH; never change the Admin role)'
PRE={
 44606:["1. Sign in as an Owner or Admin.", f"2. Open {RP}. Find the \"Received later\" permission (the one new permission this release): confirm it is present, OFF by default, and set per role."],
 44607:["1. Sign in as an Owner or Admin to read the permission map in {0}; then, to check gating, {1} with only the mapped atom for each Simple Flow action (WO Lines: Create & Edit; Order Parts; Pick Parts; Vendor & Order Mgmt: Create & Edit; Received later; See Financial Data).".format(RP,TECH),
        "2. For each Simple Flow action, confirm it is available only when its mapped existing atom is granted."],
 44608:[f"1. Sign in as an Owner or Admin; for the checks, {TECH} with See Financial Data ON vs OFF and View mode Full vs Tech.", "2. Open a work order and the receive/PO surfaces and confirm money fields follow See Financial Data and the work UI follows View mode."],
 44609:[f"1. For each check, {TECH} WITHOUT the relevant atom (e.g. without Order Parts, or without Pick Parts).", "2. Open the work order / receive surfaces and confirm the gated action is not shown, and that a hidden value is never submitted."],
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
print(f"authored {len(out)} permission cases")
