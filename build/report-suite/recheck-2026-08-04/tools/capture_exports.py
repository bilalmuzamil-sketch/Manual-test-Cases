"""Re-capture EVERY export surface on the new build: metadata lines + header row + Location column.
Covers Rule 40 (every surface) and the Rule-45(e) one-row-per-assertion requirement."""
import sys, json, time, hashlib, os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__))); import rc

HD='b3c8c820-f815-4cf1-8938-10956c5ee71a'   # Staging Heavy Duty - 9919
LB='f8a8b802-7780-4b16-bf10-343caeb616b2'   # Staging Lethbridge - 4310
BOTH=HD+','+LB

REPORTS=[
 dict(slug='sales-by-customer',       base='range=custom&start_date=2026-07-01&end_date=2026-08-04&productType=all', variants=['summary','expanded'], tabs=[None]),
 dict(slug='sales-by-representative', base='range=custom&start_date=2026-07-01&end_date=2026-08-04&productType=all&invoiceStatus=all', variants=['summary','expanded'], tabs=[None]),
 dict(slug='parts-velocity',          base='type=both&range=custom&start_date=2026-08-01&end_date=2026-08-04', variants=[None], tabs=[None]),
 dict(slug='technician-utilization',  base='range=custom&start_date=2026-08-01&end_date=2026-08-04', variants=['summary','expanded'], tabs=[None]),
 dict(slug='work-in-progress',        base='from=2026-07-01T00:00:00.000Z&to=2026-08-04T23:59:59.999Z&columns=wo_number,status,customer,location,total', variants=[None],
      tabs=['ApprovedNotStarted','ApprovedPartiallyCompleted','Completed','Estimates']),
 dict(slug='inventory-value',         base='range=custom&start_date=2026-08-01&end_date=2026-08-04', variants=[None], tabs=[None]),
]

def csvfields(line):
    out=[];cur='';q=False
    for ch in line or '':
        if ch=='"': q=not q
        elif ch==',' and not q: out.append(cur);cur=''
        else: cur+=ch
    out.append(cur); return out

def analyse(text):
    """Return the leading metadata lines and the header row, as the build actually emits them."""
    lines=text.split('\n')
    meta=[]; hdr=None; hdri=None
    for i,l in enumerate(lines[:12]):
        f=csvfields(l)
        # a metadata line is a single populated field ending in ':' content, or <=2 fields
        nonempty=[x for x in f if x.strip()]
        if len(nonempty)<=1 and l.strip():
            meta.append(l)
        elif l.strip():
            hdr=l; hdri=i; break
    return meta, hdr, hdri, csvfields(hdr) if hdr else []

def run():
    out={'build':'v3.4.1-3d03023','at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'rows':[]}
    for r in REPORTS:
        for scope,loc in [('SINGLE',HD),('MULTI',BOTH),('NO',None)]:
            for variant in r['variants']:
                for tab in r['tabs']:
                    q=f"format=csv&{r['base']}"
                    if loc: q+='&locations='+loc
                    if variant: q+='&variant='+variant
                    if tab: q+='&tab='+tab
                    s,b,h = rc.exp(r['slug'], q)
                    rec=dict(slug=r['slug'],scope=scope,variant=variant,tab=tab,status=s,query=q)
                    if s==200 and isinstance(b,(bytes,bytearray)):
                        t=b.decode('utf-8','replace')
                        meta,hdr,hdri,fields=analyse(t)
                        rec.update(bytes=len(b), sha256=hashlib.sha256(b).hexdigest(),
                                   metaLines=meta, headerLineIndex=hdri, headerLine=hdr,
                                   headerFields=fields, hasLocationColumn=any(x.strip().strip('"') in ('Location','Branch') for x in fields),
                                   locationIndex=next((i for i,x in enumerate(fields) if x.strip().strip('"') in ('Location','Branch')), None),
                                   dataRows=max(0,len(t.rstrip('\n').split('\n'))-(hdri+1 if hdri is not None else 0)))
                        fn=f"exports/{r['slug']}__{scope}__{variant or 'plain'}{('__'+tab) if tab else ''}.csv"
                        rc.save(fn, b)
                        rec['file']=fn
                    else:
                        rec['body']=str(b)[:250]
                    out['rows'].append(rec)
                    print(f"{r['slug'][:22]:22s} {scope:6s} {str(variant):9s} {str(tab):26s} -> {s} "
                          f"loc={rec.get('hasLocationColumn')}@{rec.get('locationIndex')} meta={len(rec.get('metaLines',[]))}")
                    time.sleep(0.4)
    rc.save('location-and-metadata-matrix.json', out)
    return out

if __name__=='__main__':
    run()
