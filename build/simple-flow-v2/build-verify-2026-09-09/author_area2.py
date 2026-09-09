import json
cases={c['id']:c for c in json.load(open('/tmp/sf_area2.json'))}
BUILD="Last checked against build v26.35.9-5700a76 on 9/9/2026."
WO='top menu "Work Orders" -> the "Work Orders" tab -> open a work order -> its "Lines" tab'
SETT='Settings -> the "Work Orders" tab (left sidebar "Settings", then the "Work Orders" tab)'
PRE={
 44561:[ "1. Sign in as an Owner or Admin (completion permission).",
         f"2. In {SETT}, set Require Review Before Completion OFF and Require Tech Story / Mileage / Engine Hours OFF; click \"Save Settings\".",
         f"3. Open an Approved work order with an Approved line carrying three parts in three open states, via {WO}: one part never ordered (Require Ordering Parts on, no Order clicked), one ordered but not received (Order clicked, Receive not), and one in stock but not picked (an \"In stock\" part with Pick not clicked). Each part shows its status badge on its row." ],
 44562:[ "1. Sign in as an Owner or Admin (completion permission).",
         f"2. In {SETT} turn ON the relevant LINE REQUIREMENTS (Require Tech Story / Require Mileage / Require Engine Hours) and Save.",
         f"3. Open an Approved line that is missing a required tech story / mileage / engine hours, or carries an unresolved core, via {WO}." ],
 44563:[ "1. Sign in as an Owner or Admin (completion permission).",
         f"2. Have a completable Approved line, via {WO}. The paths to try are: the line's own \"Complete\" button; the bulk action bar \"Complete line\" after ticking lines; \"Create invoice\" in the work order's header three-dot (more_vert) menu; and \"Clock out and complete\" in the clock-out modal (press \"Start\" then \"Stop\" on a line)." ],
 44564:[ "1. Sign in as an Owner or Admin, clocked onto a line: open a work order's \"Lines\" tab and press \"Start\" on a line.",
         f"2. Review may be on or off (set in {SETT} -> Require Review Before Completion)." ],
 44565:[ "1. Sign in as an Owner or Admin (completion permission).",
         f"2. Have an Approved line with outstanding parts and, separately, a completed line, via {WO}. A completed line offers a \"Reopen\" control on its row.",
         "3. For the Technician check: use the TECH@shopview.com login in Tech View (never change the Admin role)." ],
}
def fix_steps(t):
    t=t.replace("Press Stop","Press \"Stop\"").replace("press Complete","press \"Complete\"")
    return t
def split_exp(t):
    lines=t.split('\n'); mi=[i for i,l in enumerate(lines) if l.strip().startswith('AUTOMATION:')][-1]
    return lines[:mi]
out={}
for cid in PRE:
    d=cases[cid]
    pre=PRE[cid]
    steps=[fix_steps(l) for l in d['steps'].split('\n') if l.strip()]
    content=[l for l in split_exp(d['exp']) if l.strip()!='']+[BUILD]
    if '---' in content:
        i=content.index('---'); pblocks=[content[:i], content[i:]+['AUTOMATION: READY']]
    else:
        pblocks=[content+['AUTOMATION: READY']]
    mk=lambda blocks:{'blocks':blocks,'text':'\n\n'.join('\n'.join(b) for b in blocks)}
    out[str(cid)]={'title':d['title'],'fields':{'custom_preconds':mk([pre]),'custom_steps':mk([steps]),'custom_expected':mk(pblocks)}}
json.dump(out,open('build/simple-flow-v2/build-verify-2026-09-09/intended-blocks.json','w'),indent=1)
json.dump([str(c) for c in PRE],open('build/simple-flow-v2/build-verify-2026-09-09/targets.json','w'))
print(f"authored {len(out)} area-2 cases")
