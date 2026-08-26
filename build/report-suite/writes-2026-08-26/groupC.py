# -*- coding: utf-8 -*-
import json, re, sys, datetime
sys.path.insert(0,'/tmp/rswrite')
from tr import call

LIVE={'IV':'10','PV':'11','SBC':'20','SBR':'24','TU':'9','WIP':'28'}
NOTE=("Re-checked against the live specification on 26 August 2026: the requirements this case "
      "cites are unchanged, so only the version cited above was updated.")

f=json.load(open('/tmp/rswrite/cases_fresh.json'))
pins={p['cid']:p for p in json.load(open('/home/user/Manual-test-Cases/build/report-suite/source-verify-2026-08-26/data/case-version-pins.json'))}
targets=json.load(open('/tmp/rswrite/groupC-blocks.json'))['single']

def transform(cid):
    e=f[cid]['custom_expected'] or ''
    rep=pins[cid]['report']; old=pins[cid]['cited']; live=LIVE[rep]
    if old==live: return None,'already at live version'
    pat='specification version %s'%old
    if pat not in e: return None,'cited version string %r not found'%pat
    new=e.replace(pat,'specification version %s'%live)
    # append the re-check note immediately before the trailing AUTOMATION marker
    m=re.search(r'(<br><br>|\n\n)(AUTOMATION: )', new)
    if not m: return None,'no blank-line + AUTOMATION marker at the tail'
    sep='<br>' if m.group(1)=='<br><br>' else '\n'
    new=new[:m.start()] + sep + NOTE + new[m.start():]
    # ---- guard: reverse the transform and require an EXACT reconstruction of the original.
    # Any edit beyond (a) the cited version token and (b) the appended note breaks this.
    if ('specification version %s' % live) in e:
        return None, 'case already mentions the live version elsewhere - ambiguous, not touched'
    recon = new.replace(sep + NOTE, '', 1).replace('specification version %s' % live,
                                                   'specification version %s' % old)
    if recon != e:
        return None, 'reverse-transform did not reconstruct the original byte-for-byte'
    return new,'ok'

def main():
    log=[];ok=[];fail=[];skip=[]
    for i,cid in enumerate(sorted(targets,key=lambda x:int(x[1:]))):
        new,why=transform(cid)
        if new is None:
            skip.append((cid,why)); log.append('update_case · %s · NOT SENT · skipped: %s'%(cid,why)); continue
        body={'custom_expected': new if new.endswith('\n') else new+'\n'}
        s,d=call('update_case/'+cid[1:], body)
        if s!=200:
            fail.append(cid); log.append('update_case · %s · HTTP %s · verification FAIL (write rejected: %s)'%(cid,s,str(d)[:120])); continue
        s2,g=call('get_case/'+cid[1:])
        got=g.get('custom_expected')
        want=body['custom_expected']
        wrapped='<p>'+want.rstrip('\n')+'</p>\n'      # server wraps bare plain text
        good = got==want or got==wrapped
        # untouched-field check
        moved=[k for k in ['title','custom_preconds','custom_steps','refs','custom_atmstatus','section_id','priority_id','type_id']
               if f[cid].get(k)!=g.get(k)]
        if good and not moved:
            ok.append(cid)
            log.append('update_case · %s · HTTP %s · verification PASS (version %s->%s re-pinned%s; 8 untouched fields byte-identical)'%(
                cid,s,pins[cid]['cited'],LIVE[pins[cid]['report']],'' if got==want else ', server wrapped the bare text in <p> as expected'))
        else:
            fail.append(cid)
            log.append('update_case · %s · HTTP %s · verification FAIL · moved=%s · WANT %r GOT %r'%(cid,s,moved,want[:200],(got or '')[:200]))
        f[cid]=g
        if i%40==0: print(i,flush=True)
    json.dump(f,open('/tmp/rswrite/cases_fresh.json','w'))
    hdr=('# Report Suite Group C - re-pin the cited spec version to the live version\n'
         '# ONLY for cases proven content-current: each cites at least one spec anchor and NONE of\n'
         '# its cited anchors changed between the held and the live spec body.\n'
         '# run %sZ\n# attempted %d · byte-verified PASS %d · FAIL %d · skipped %d\n'%(
         datetime.datetime.utcnow().isoformat(),len(targets),len(ok),len(fail),len(skip)))
    open('/tmp/rswrite/groupC.log','w').write(hdr+'\n'.join(log)+'\n')
    print(hdr)
    if fail: print('FAIL:',fail[:20])
    if skip: print('SKIP:',skip[:20])
    json.dump({'ok':ok,'fail':fail,'skip':skip},open('/tmp/rswrite/groupC-result.json','w'),indent=1)

if __name__=='__main__': main()
