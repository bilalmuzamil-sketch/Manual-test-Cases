#!/usr/bin/env python3
"""
Create the Invoice Design Selection cases from the merged authoring JSON.
- Reads /tmp/invoice_cases_merged.json (list of {req_ids,title,atm_type,marker_type,preconds,steps,expected}).
- Builds uniform provenance + AUTOMATION marker; emits block HTML (<p>+<br>) for each field.
- add_case into section 7800, custom_atmstatus=1, real custom_automation_type.
- Writes id-map, and intended-blocks.json + targets.json for the fr-view harness (add_case lands in the
  ESCAPING container; the harness flips it to fr-view — L0028: creation still needs the UI/Froala save).
Idempotent-ish: skips a req-signature already in the id-map so a re-run does not duplicate.
"""
import json, urllib.request, base64, time, os, sys

DIR = os.path.dirname(os.path.abspath(__file__))
SECTION = 7800
creds = json.load(open('/tmp/testrail/creds.json'))
B = 'https://shopview.testrail.io/index.php?/api/v2/'
AUTH = base64.b64encode(f"{creds.get('user') or creds.get('email')}:{creds['password']}".encode()).decode()

def call(ep, payload=None, tries=6):
    for t in range(tries):
        try:
            data = json.dumps(payload).encode() if payload is not None else None
            return json.load(urllib.request.urlopen(urllib.request.Request(
                B+ep, data=data, headers={'Authorization':'Basic '+AUTH,'Content-Type':'application/json'})))
        except Exception as e:
            last=e; time.sleep(3)
    raise last

NOTBUILT = "AUTOMATION: Not available on Build to test Yet - Last checked 9/10/2026"
DESIGN_LINK = "https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354"
RENDER_PREFIXES = ('S2','S3','S4','S5')
RENDER_FO = {'FO-4','FO-5','FO-6','FO-7','FO-8','FO-9'}

def wants_design(req_ids):
    return any(r.split('-')[0] in RENDER_PREFIXES for r in req_ids) or any(r in RENDER_FO for r in req_ids)

def provenance(req_ids, marker_type):
    ids = ", ".join(req_ids)
    note = ("Note: this feature is not yet built (spec Status: Draft) and the setting UI is not yet "
            "designed; the route and on-screen labels here are provisional and to be finalised at "
            "build-verification.")
    if marker_type == 'portal':
        note += (" This case renders on the customer portal, which exists only on staging (not the QA "
                 "branch); it will carry the customer-portal staging-only HOLD at build-verification.")
    lines = ["---",
             (f"This is the expected behaviour as per epic SV-8218 and the Invoice Design Selection "
              f"specification (Confluence page 845447188, Revision 3), section {ids}, read on 10 September 2026."),
             note]
    if wants_design(req_ids):
        lines.append(f"Design: the Design Document ({DESIGN_LINK}) shows the new (Modern) design (SV-8218); "
                     "the specific view/frame anchors are not yet given in the spec (provisional).")
    return lines

def esc(s): return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
def block_html(blocks): return ''.join('<p>'+'<br>'.join(esc(l) for l in b)+'</p>' for b in blocks)

def main():
    cases = json.load(open('/tmp/invoice_cases_merged.json'))
    idmap_path = f'{DIR}/testrail-id-map.csv'
    seen = set()
    if os.path.exists(idmap_path):
        for line in open(idmap_path):
            parts=line.rstrip('\n').split('\t')
            if len(parts)>=2: seen.add(parts[0])
    idmap = open(idmap_path,'a')
    intended={}; targets=[]
    created=0
    for c in cases:
        sig = "|".join(c['req_ids'])+"::"+c['title']
        if sig in seen:
            continue
        atm_type = int(c.get('atm_type') or 2)
        marker = NOTBUILT
        exp_blocks = [c['expected']] + [provenance(c['req_ids'], c.get('marker_type','notbuilt'))] + [[marker]]
        pre_blocks = [c['preconds']]
        step_blocks = [c['steps']]
        payload = {
            'title': c['title'][:250],
            'custom_atmstatus': 1,
            'custom_automation_type': atm_type,
            'custom_preconds': block_html(pre_blocks),
            'custom_steps': block_html(step_blocks),
            'custom_expected': block_html(exp_blocks),
        }
        r = call(f'add_case/{SECTION}', payload)
        cid = str(r['id'])
        created += 1
        idmap.write(f"{sig}\t{cid}\t{','.join(c['req_ids'])}\tatm{atm_type}\t{c.get('marker_type','notbuilt')}\n")
        idmap.flush()
        # for the harness (text = normalized join used by checkView)
        def field(blocks): return {"blocks":blocks,"text":"\n\n".join("\n".join(b) for b in blocks)}
        intended[cid] = {"title": c['title'][:250], "fields": {
            "custom_preconds": field(pre_blocks),
            "custom_steps": field(step_blocks),
            "custom_expected": field(exp_blocks)}}
        targets.append(cid)
        print(f"created C{cid}  atm={atm_type}  {c['req_ids']}  {c['title'][:50]}")
    json.dump(intended, open(f'{DIR}/intended-blocks.json','w'), ensure_ascii=False, indent=1)
    json.dump(targets, open(f'{DIR}/targets.json','w'))
    print(f"\nCREATED {created} cases into section {SECTION}. targets.json has {len(targets)}.")

if __name__ == '__main__':
    main()
