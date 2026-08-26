# -*- coding: utf-8 -*-
"""Second pass: the transform already landed on all 163; the byte mismatch was only that the
server re-encodes literal non-ASCII to named entities. Re-send the entity-encoded form of the
CURRENT stored value so the stored bytes are exactly what we sent, then verify exactly."""
import json, re, sys, datetime
sys.path.insert(0,'/tmp/rswrite')
from tr import call
from htmlfmt import ent
LIVE={'IV':'10','PV':'11','SBC':'20','SBR':'24','TU':'9','WIP':'28'}
pins={p['cid']:p for p in json.load(open('/home/user/Manual-test-Cases/build/report-suite/source-verify-2026-08-26/data/case-version-pins.json'))}
targets=json.load(open('/tmp/rswrite/groupC-blocks.json'))['single']
NOTE='Re-checked against the live specification on 26 August 2026'
f=json.load(open('/tmp/rswrite/cases_fresh.json'))
log=[];ok=[];fail=[]
for i,cid in enumerate(sorted(targets,key=lambda x:int(x[1:]))):
    s0,before=call('get_case/'+cid[1:])
    cur=before.get('custom_expected') or ''
    live=LIVE[pins[cid]['report']]
    # sanity: the re-pin and the note must already be present from pass 1
    if ('specification version %s'%live) not in cur or NOTE not in cur:
        fail.append(cid); log.append('update_case · %s · NOT SENT · verification FAIL (pass-1 re-pin not present)'%cid); continue
    want=ent(cur)
    if not want.endswith('\n'): want+='\n'
    if want==cur or want==cur+'\n':
        ok.append(cid); log.append('update_case · %s · NOT SENT · verification PASS (already byte-exact; version %s->%s re-pinned in pass 1)'%(cid,pins[cid]['cited'],live)); continue
    s,d=call('update_case/'+cid[1:], {'custom_expected': want})
    s2,g=call('get_case/'+cid[1:])
    got=g.get('custom_expected')
    moved=[k for k in ['title','custom_preconds','custom_steps','refs','custom_atmstatus','section_id','priority_id','type_id'] if before.get(k)!=g.get(k)]
    if got==want and not moved:
        ok.append(cid); log.append('update_case · %s · HTTP %s · verification PASS (version %s->%s re-pinned; non-ASCII normalised to named entities; 8 untouched fields byte-identical)'%(cid,s,pins[cid]['cited'],live))
    else:
        fail.append(cid); log.append('update_case · %s · HTTP %s · verification FAIL · moved=%s · WANT %r GOT %r'%(cid,s,moved,want[:180],(got or '')[:180]))
    if i%40==0: print(i,flush=True)
hdr=('# Report Suite Group C - re-pin the cited spec version to the live version (pass 2: byte-exact confirmation)\n'
     '# Scope: ONLY cases proven content-current - each cites >=1 spec anchor and NONE of its cited anchors\n'
     '# changed between the held and the live spec body. Stale-content cases were NOT re-pinned.\n'
     '# run %sZ\n# attempted %d · byte-verified PASS %d · FAIL %d\n'%(datetime.datetime.utcnow().isoformat(),len(targets),len(ok),len(fail)))
open('/tmp/rswrite/groupC.log','w').write(hdr+'\n'.join(log)+'\n')
print(hdr)
if fail: print('FAIL:',fail[:20])
json.dump({'ok':ok,'fail':fail},open('/tmp/rswrite/groupC-result.json','w'),indent=1)
