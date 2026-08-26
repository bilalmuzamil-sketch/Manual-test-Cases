import json, re, hashlib, html, os
import tr

SNAP='/home/user/Manual-test-Cases/build/report-suite/source-verify-2026-08-26/data/live-cases.json'
snap={str(c['id']):c for c in json.load(open(SNAP))}
cids=[l.strip().lstrip('C') for l in open('/home/user/Manual-test-Cases/build/report-suite/writes2-2026-08-26/logs/job4-damaged-cids.txt') if l.strip()]
FMAP={'custom_preconds':'pre','custom_steps':'steps','custom_expected':'expected'}
TAG=re.compile(r'&lt;/?(p|br|ul|li|ol|div|span|b|i|strong|em)\b[^&]*&gt;|</?(p|br|ul|li|ol|div)\b[^>]*>')
out={}
for cid in cids:
    s,live=tr.call(f'get_case/{cid}')
    if s!=200:
        out[cid]={'error':(s,live)}; continue
    rec={'title':live.get('title'),'atm':live.get('custom_atmstatus'),'section':live.get('section_id'),'fields':{}}
    sn=snap.get(cid)
    for api,sk in FMAP.items():
        cur=live.get(api) or ''
        old=(sn.get(sk) if sn else None) or ''
        tags=sorted(set(m.group(0) for m in TAG.finditer(cur)))
        oldtags=sorted(set(m.group(0) for m in TAG.finditer(old)))
        rec['fields'][api]={
          'changed': cur!=old,
          'damaged': bool(tags) and not oldtags,
          'live_tags':tags[:8],'snap_tags':oldtags[:8],
          'live_len':len(cur),'snap_len':len(old),
          'live_sha':hashlib.sha256(cur.encode()).hexdigest()[:12],
          'snap_sha':hashlib.sha256(old.encode()).hexdigest()[:12],
          'in_snapshot': sn is not None,
        }
    out[cid]=rec
json.dump(out,open('scope.json','w'),indent=1)
dmg=[c for c,r in out.items() if 'fields' in r and any(f['damaged'] for f in r['fields'].values())]
print('checked',len(out),'damaged',len(dmg))
print('automated(3):',[c for c in dmg if out[c]['atm']==3])
from collections import Counter
print(Counter(tuple(sorted(f for f,v in out[c]['fields'].items() if v['damaged'])) for c in dmg))
missing=[c for c,r in out.items() if 'fields' in r and not r['fields']['custom_steps']['in_snapshot']]
print('not in snapshot:',missing)
