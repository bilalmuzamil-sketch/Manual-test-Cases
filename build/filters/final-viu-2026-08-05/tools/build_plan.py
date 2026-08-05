#!/usr/bin/env python3
import json, re
CASES={c['id']:c for c in json.load(open('/tmp/fv/cases-PRE.json'))}
P=json.load(open('/tmp/fv/plan-inputs.json'))
REPAIR={int(k):v for k,v in P['REPAIR'].items()}
NOTBUILT={int(k):v for k,v in P['NOTBUILT'].items()}
PHONE={int(k):v for k,v in P['PHONE'].items()}
BUILD='v3.4.2-d00239b'; DATE='8/5/2026'
OLDSPEC='the Filters specification version 1.6 as revised on 4 August 2026'
NEWSPEC='the Filters specification at Confluence version 18 (published 4 August 2026)'
WAIVER=re.compile(r'\n*Known and accepted:.*?(?=\n\n|\n---|\Z)', re.S)
plan=[]
for cid,c in sorted(CASES.items()):
    exp=c['custom_expected']; refs=c.get('refs') or ''
    new=exp; nrefs=refs; why=[]
    r=REPAIR.get(cid,{})
    # 1) drop the waiver paragraph
    if r.get('drop_waiver'):
        n2=WAIVER.sub('', new)
        assert n2!=new, f'C{cid} waiver not found'
        new=n2; why.append('class-A waiver paragraph deleted')
    # 2) targeted expected replacements
    for old,rep in r.get('expected_replace',[]):
        assert old in new, f'C{cid} expected_replace anchor missing: {old[:60]}'
        new=new.replace(old,rep,1); why.append('assertion restored to the documented requirement')
    # 3) add the tester note, immediately before the provenance separator
    if r.get('add_note'):
        assert '\n---\n' in new, f'C{cid} no provenance separator'
        new=new.replace('\n---\n', '\n\n'+r['add_note']+'\n\n---\n',1)
        why.append('plain deviation note added naming the closed ticket')
    # 4) refs repair
    for old,rep in r.get('refs_replace',[]):
        assert old in nrefs, f'C{cid} refs anchor missing'
        nrefs=nrefs.replace(old,rep,1); why.append('stale refs corrected')
    # 5) provenance sentence repair
    for old,rep in r.get('prov_replace',[]):
        assert old in new, f'C{cid} prov anchor missing'
        new=new.replace(old,rep,1); why.append('"and the build" dropped from the divergence sentence')
    # 6) the spec-version correction, on ALL 110
    if cid==38882:
        o='the Filters specification version 1.6, in the revision published on the afternoon of 4 August 2026,'
        assert o in new
        new=new.replace(o,'the Filters specification at Confluence version 18, published on the afternoon of 4 August 2026,',1)
        why.append('spec version corrected 1.6 -> Confluence 18')
    if OLDSPEC in new:
        new=new.replace(OLDSPEC,NEWSPEC); why.append('spec version corrected 1.6 -> Confluence 18')
    if OLDSPEC[0].upper()+OLDSPEC[1:] in new:
        new=new.replace(OLDSPEC[0].upper()+OLDSPEC[1:], NEWSPEC[0].upper()+NEWSPEC[1:])
        why.append('spec version corrected 1.6 -> Confluence 18')
    # 7) the 8 not-built cases: the build is not the source of their expectation
    if cid in NOTBUILT:
        old=f'This is the expected behaviour as per the build tested on {DATE} (ShopView {BUILD} on the Filters QA branch) and epic SV-8785.'
        rep=('This is the expected behaviour as per epic SV-8785, the designs and the product owner\'s answers named below - '
             'not as per the build, because this part of the product is not built yet. '
             f'On the build looked at on {DATE} (ShopView {BUILD} on the Filters QA branch) the controls this test needs were looked for and were not found.')
        assert old in new, f'C{cid} notbuilt provenance anchor missing'
        new=new.replace(old,rep,1); why.append('false "as per the build" provenance corrected for a not-built feature')
    # 8) the 10 phone cases: state-1 -> state-2 provenance now that they were observed live
    if cid in PHONE:
        old=('This has not been checked against the running app in this pass, so no build or test date is claimed for it.')
        if old in new:
            new=new.replace(old, f'This was checked against the running app on {DATE}, on build ShopView {BUILD} on the Filters QA branch, at a phone-sized screen 390 pixels wide.',1)
            why.append('provenance moved to state 2 - build + tested-on date now claimed, because it was observed')
    # 9) marker
    if r.get('marker') or cid in PHONE:
        want=r.get('marker') or PHONE[cid][0]
        m=re.search(r'\n\nAUTOMATION: .*$', new, re.S)
        assert m, f'C{cid} no marker'
        if m.group(0).strip()!=want:
            new=new[:m.start()]+'\n\n'+want+'\n'
            why.append('marker set from the live verdict')
        elif not new.endswith('\n'):
            new=new+'\n'
    # 9b) SV-8845 is closed OBSOLETE but this pass PROVED it still reproduces -> qualify it,
    #     and strip it from C29630, whose own steps never go near a shared link.
    if cid==29630:
        m=re.search(r'\n*Known issue: on a phone a link carrying filters.*?(?=\n\n|\n---|\Z)', new, re.S)
        assert m, 'C29630 stale note not found'
        new=new[:m.start()]+new[m.end():]
        why.append('note about a shared-link fault removed - this case reaches the empty state by tapping, so the note would make a passing case look failed')
    if cid==29618:
        o='(ticket: https://shopview.atlassian.net/browse/SV-8845)'
        assert o in new
        new=new.replace(o,'(ticket: https://shopview.atlassian.net/browse/SV-8845 - reported, and closed without a fix, so do not expect it to change)',1)
        new=new.replace('AUTOMATION: READY - EXPECT FAIL (SV-8845, SV-8871)',
                        'AUTOMATION: READY - EXPECT FAIL (SV-8845 - reported, closed without a fix; SV-8871)')
        why.append('SV-8845 qualified as closed without a fix, since this pass proved it still reproduces')
    # 10) tidy: never two blank lines in the body
    new=re.sub(r'\n{3,}', '\n\n', new)
    # 11) HONESTY: where the build FAILS the requirement, "expected behaviour as per the build
    #     tested on X" is literally false. Put the documented source first and the build second.
    mk=re.search(r'AUTOMATION: (.*)', new)
    if mk and 'EXPECT FAIL' in mk.group(1):
        o=f'This is the expected behaviour as per the build tested on {DATE} (ShopView {BUILD} on the Filters QA branch), epic SV-8785 and '
        if o in new:
            new=new.replace(o, 'This is the expected behaviour as per epic SV-8785 and ',1)
            tail=f' It was checked against the build on {DATE} (ShopView {BUILD} on the Filters QA branch), which does not behave this way yet.'
            m2=re.search(r'(\(S[^)]*\)\.)', new)
            assert m2, f'C{cid} cannot place the build sentence'
            new=new[:m2.end()]+tail+new[m2.end():]
            why.append('provenance no longer names the build as the source of an expectation the build fails')
    if new!=exp or nrefs!=refs:
        plan.append(dict(cid=cid, why=why, expected=new, refs=nrefs,
                         changed_expected=new!=exp, changed_refs=nrefs!=refs))
json.dump(plan, open('/tmp/fv/plan.json','w'), indent=1)
print('cases to write:',len(plan))
from collections import Counter
print(Counter(w for p in plan for w in p['why']))
# sanity: exactly one provenance line and one marker each
for p in plan:
    assert p['expected'].count('This is the expected behaviour as per')==1, p['cid']
    assert len(re.findall(r'AUTOMATION: ',p['expected']))==1, p['cid']
    assert 'version 1.6' not in p['expected'], p['cid']
    assert 'Known and accepted' not in p['expected'], p['cid']
print('sanity OK: one provenance line, one marker, no "version 1.6", no waiver, in every planned text')
