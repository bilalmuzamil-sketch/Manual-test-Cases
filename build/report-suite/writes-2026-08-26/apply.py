# -*- coding: utf-8 -*-
"""Apply update_case writes with Rule-50 byte verification.
Sends ALL FOUR text fields every time (+title when changed). Re-GETs and byte-compares."""
import json, sys, datetime
sys.path.insert(0,'/tmp/rswrite')
from tr import call

WATCH = ['section_id','type_id','priority_id','custom_atmstatus','custom_automation_type',
         'estimate','milestone_id','template_id','custom_manual_reference']

def apply(updates, logpath, label):
    fresh = json.load(open('/tmp/rswrite/cases_fresh.json'))
    log, ok, fail = [], [], []
    for cid in sorted(updates, key=lambda x:int(x[1:])):
        u = updates[cid]
        before = fresh[cid]
        body = {'custom_preconds': u['pre'], 'custom_steps': u['steps'],
                'custom_expected': u['exp'], 'refs': u['refs']}
        if 'title' in u: body['title'] = u['title']
        s, d = call('update_case/'+cid[1:], body)
        if s != 200:
            log.append(f"update_case · {cid} · HTTP {s} · verification FAIL (write rejected: {str(d)[:150]})")
            fail.append(cid); continue
        s2, g = call('get_case/'+cid[1:])
        if s2 != 200:
            log.append(f"update_case · {cid} · HTTP {s} · verification FAIL (re-GET HTTP {s2})")
            fail.append(cid); continue
        probs = []
        for k, want in body.items():
            got = g.get(k)
            if got != want:
                probs.append(f"{k}: WANT {want!r} GOT {got!r}")
        for k in WATCH:
            if before.get(k) != g.get(k):
                probs.append(f"UNTOUCHED FIELD MOVED {k}: {before.get(k)!r} -> {g.get(k)!r}")
        if 'title' not in body and before.get('title') != g.get('title'):
            probs.append(f"UNTOUCHED FIELD MOVED title: {before.get('title')!r} -> {g.get('title')!r}")
        if probs:
            log.append(f"update_case · {cid} · HTTP {s} · verification FAIL · " + " | ".join(p[:400] for p in probs))
            fail.append(cid)
        else:
            n = len(body)
            log.append(f"update_case · {cid} · HTTP {s} · verification PASS (byte-identical on all {n} sent fields; {len(WATCH)} untouched fields unmoved)")
            ok.append(cid)
        fresh[cid] = g
    json.dump(fresh, open('/tmp/rswrite/cases_fresh.json','w'))
    hdr = (f"# {label}\n# run {datetime.datetime.utcnow().isoformat()}Z\n"
           f"# attempted {len(updates)} · byte-verified PASS {len(ok)} · FAIL {len(fail)}\n")
    open(logpath,'w').write(hdr + "\n".join(log) + "\n")
    print(hdr)
    if fail: print('FAIL:', fail)
    return ok, fail
