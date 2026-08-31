#!/usr/bin/env python3
"""Record the C45185 finding: historyEvent binds but does not change the document."""
import json, urllib.request, re, html, hashlib
DIR='build/invoice-ui-refresh/build-verify-2026-08-31'
API='https://sv8218api.qa.shopview.com'
COOK=open('/tmp/qa-cookies/sv8218-live-session.txt').read().strip()
INV='8ed189b1-6e2c-4412-9b20-6253361c0ed4'
def get(p):
    r=urllib.request.Request(API+p); r.add_header('Cookie',COOK)
    with urllib.request.urlopen(r,timeout=120) as x: return x.read().decode('utf-8','replace')
def vis(h):
    t=re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>','',h)
    return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',t)))
ev=json.load(open(f'{DIR}/walk-evidence.json'))
sha={}
for h in ('','1','2','5','99'):
    d=get(f'/api/invoices/preview?invoice_id={INV}&type=html&isEstimate=0&includeDeclined=0&historyEvent={h}')
    sha[h or 'none']={'bytes':len(d),'visible':len(vis(d)),
                      'sha256_visible':hashlib.sha256(vis(d).encode()).hexdigest()[:16]}
uniq={v['sha256_visible'] for v in sha.values()}
ev['C45185_historyEvent']={
 'step':'Generate its PDF (of a snapshot created BEFORE the redesign)',
 'per_value':sha,'distinct_documents':len(uniq),
 'conclusion':('historyEvent is ACCEPTED by the endpoint but returns a BYTE-IDENTICAL document for '
               'every value tried (none/1/2/5/99) -- one distinct rendering only. So the parameter '
               'binding proves nothing about snapshots: either this invoice has no history events, '
               'or the value is ignored on this branch. The precondition "a snapshot created before '
               'the redesign" is therefore NOT ESTABLISHED, and C45185 stays unverified. Marking it '
               'verified on the strength of an accepted parameter would be the exact overclaim '
               'skill 03 8.0-a warns about.')}
json.dump(ev,open(f'{DIR}/walk-evidence.json','w'),indent=1,ensure_ascii=False)
print('C45185 historyEvent probe:')
for k,v in sha.items(): print(f'   historyEvent={k:<5} visible={v["visible"]:<6} sha={v["sha256_visible"]}')
print(f'   distinct documents: {len(uniq)}  -> precondition NOT established')
