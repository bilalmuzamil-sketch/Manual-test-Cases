#!/usr/bin/env python3
"""Apply the three corrections, byte-verified, with the oplog written AS each write happens.

Differs from the write prepared by verify-final-2026-08-12, deliberately and on my own
live evidence — see RUNNABILITY.md section 2. In short: a HOLD would disarm cases that a
tester can start and that produce a correct FAIL, on a FINAL report, the day before release.
"""
import sys,json,os,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/report-suite/verify-final-2026-08-12/tools')
from tr import call

OUT='/home/user/Manual-test-Cases/build/report-suite/finish-2026-08-12/'
LOG=OUT+'testrail-execution-log.md'
BUILD='v3.7-4626299'
STAMP='Last checked against build v3.7-4626299 on 12 August 2026.'

def log(s):
    with open(LOG,'a') as f: f.write(s+'\n')
    print(s)

def restamp(exp):
    """Replace an existing 'Last checked against build ...' line, or insert one after the
    provenance sentence. Never appends a second."""
    lines=exp.split('\n'); out=[]; done=False
    for ln in lines:
        if ln.startswith('Last checked against build'):
            out.append(STAMP); done=True
        else: out.append(ln)
    if not done:
        # insert directly after the 'This is the expected behaviour as per' line
        for i,ln in enumerate(out):
            if ln.startswith('This is the expected behaviour as per'):
                out.insert(i+1,STAMP); done=True; break
    assert done,'no provenance line found'
    return '\n'.join(out)

def set_marker(exp,new):
    lines=exp.split('\n'); hit=0
    for i,ln in enumerate(lines):
        if ln.startswith('AUTOMATION:'):
            lines[i]=new; hit+=1
    assert hit==1, f'expected exactly one AUTOMATION line, found {hit}'
    return '\n'.join(lines)

def insert_before_sep(exp,block):
    """Insert a tester block immediately BEFORE the '---' provenance separator (Rule 61
    placement: with the deviation note, before the provenance line)."""
    idx=exp.rfind('\n---\n')
    assert idx!=-1,'no --- separator'
    return exp[:idx]+'\n'+block+exp[idx:]

C30107_BLOCK=(
"What you should see today: the \"Product Type\" filter is still the older single-select. "
"Opening it shows three choices — \"Parts & Service\", \"Parts only\" and \"Service only\" — with no "
"\"All products\" row, no \"Clear all\" row and no \"Parts\"/\"Services\" toggles, so steps 2 to 4 cannot "
"be carried out exactly as written. This is a known problem and it is already reported — see "
"https://shopview.atlassian.net/browse/SV-9074.\n"
"· If you see exactly that, mark this test FAILED and do not raise anything new.\n"
"· If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please report it.\n"
"· If it PASSES — the filter opens with the two action rows above two toggles — the fix has shipped: "
"tell the QA lead so the ticket can be closed and this note removed."
)

C43591_BLOCK=(
"What you should see today: the \"Product Type\" filter is still the older single-select. Opening it "
"shows three choices — \"Parts & Service\", \"Parts only\" and \"Service only\" — with no \"All products\" "
"row and no \"Clear all\" row, so there is nothing to clear and steps 2 to 5 cannot be carried out. "
"This is a known problem and it is already reported — see https://shopview.atlassian.net/browse/SV-9074.\n"
"· If you see exactly that, mark this test FAILED and do not raise anything new.\n"
"· If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please report it.\n"
"· If it PASSES — the filter opens with \"All products\" and \"Clear all\" pinned at the top — the fix has "
"shipped: tell the QA lead so the ticket can be closed and this note removed."
)

C38913_BLOCK=(
"Note for the tester about step 8: on today's build the column selector on this report lists only "
"Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin and Margin % — there is "
"no Location entry in it to switch off. Step 8 therefore cannot be carried out as written: mark step 8 "
"as blocked and record the other steps as normal."
)

PLAN={
 30107:{'block':C30107_BLOCK,'marker':'AUTOMATION: READY - EXPECT FAIL (SV-9074)'},
 43591:{'block':C43591_BLOCK,'marker':'AUTOMATION: READY - EXPECT FAIL (SV-9074)'},
 38913:{'block':C38913_BLOCK,'marker':None},   # marker deliberately unchanged
}

TEXT=('custom_preconds','custom_steps','custom_expected')

def main():
    log(f'\n## write3 — {time.strftime("%Y-%m-%dT%H:%M:%SZ",time.gmtime())} — build {BUILD}\n')
    log('| # | case | op | HTTP | fields compared | mismatches | atmstatus | verdict |')
    log('|---|---|---|---|---|---|---|---|')
    n=0
    for cid,p in PLAN.items():
        n+=1
        st,before=call(f'get_case/{cid}')
        assert st==200,(cid,st)
        exp=before['custom_expected']
        new=insert_before_sep(exp,p['block'])
        new=restamp(new)
        if p['marker']: new=set_marker(new,p['marker'])
        payload={'custom_preconds':before['custom_preconds'],
                 'custom_steps':before['custom_steps'],
                 'custom_expected':new}
        # PRINT the payload tail before sending (brief: read your built payloads)
        print(f'\n----- PAYLOAD {cid} (expected tail) -----')
        print(new[-700:])
        print('----- end payload -----')
        st2,after=call(f'update_case/{cid}',payload)
        if st2!=200:
            log(f'| {n} | C{cid} | update_case | {st2} | - | - | - | **FAILED — BATCH STOPPED** |')
            log(f'\n**STOPPED.** `update_case/{cid}` returned {st2}: `{str(after)[:200]}`')
            sys.exit(1)
        # byte-verify by RE-GET, never from the response body
        st3,live=call(f'get_case/{cid}')
        assert st3==200
        mism=[]
        for k in TEXT:
            want=payload[k] if k in payload else before.get(k)
            if (live.get(k) or '')!=(want or ''): mism.append(k)
        # every other field must be byte-identical to the pre-write snapshot
        for k in before:
            if k in TEXT or k in ('updated_on','updated_by'): continue
            if json.dumps(before[k],sort_keys=True)!=json.dumps(live.get(k),sort_keys=True):
                mism.append(k)
        nfields=len(set(list(before.keys())+list(live.keys())))
        verdict='MATCH' if not mism else '**MISMATCH**'
        log(f'| {n} | [C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid}) | update_case | {st2} | {nfields} | {len(mism)} {mism if mism else ""} | {live.get("custom_atmstatus")} | {verdict} |')
        if mism:
            log(f'\n**STOPPED — byte mismatch on C{cid}: {mism}**'); sys.exit(1)
        json.dump({'before':before,'after':live},open(f'/tmp/rs812/w_{cid}.json','w'),indent=1)
    log(f'\n**3 of 3 written, all HTTP 200, all byte-verified MATCH, 0 mismatches.**')

main()
