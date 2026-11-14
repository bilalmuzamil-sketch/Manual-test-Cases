import csv,datetime as dt,json,collections,sys
D=lambda s:dt.date.fromisoformat(s)
def load(f):
    rows=list(csv.reader(open(f,encoding='utf-8-sig'))); i=next(k for k,r in enumerate(rows) if len(r)>3); h=rows[i]
    return rows[0][0], h, [dict(zip(h,r)) for r in rows[i+1:] if r and r[0]!='Totals'], [r for r in rows[i+1:] if r and r[0]=='Totals']
def bucket(pd):
    return 'Current' if pd<=0 else '1-30' if pd<=30 else '31-60' if pd<=60 else '61-90' if pd<=90 else '91+'
BN={'current':'Current','1-30 days past due':'1-30','31-60 days past due':'31-60','61-90 days past due':'61-90','91 or more days past due':'91+'}
res={}
for asof in ['2026-11-14','2026-12-31']:
    A=D(asof); r={}
    for rep in ['ar-aging-collection','ap-unpaid-invoices','ap-aging-detail','ar-aging-detail']:
        head,h,rows,tot=load(f'{rep}-{asof}-all.csv'); bad=[]; late=0; nodue=0
        for x in rows:
            if D(x['Date'])>A: late+=1
            due=x.get('Due Date') or ''
            if not due: nodue+=1; continue
            exp=(A-D(due)).days
            if 'Past Due' in x and x['Past Due']!='' and int(x['Past Due'])!=max(exp,0) and int(x['Past Due'])!=exp: bad.append((x.get('ID') or x.get('No.'),due,x['Past Due'],exp))
            if 'Aging Bucket' in x and BN.get(x['Aging Bucket'].lower(),x['Aging Bucket'])!=bucket(exp): bad.append(('bucket',x.get('ID') or x.get('No.'),due,x['Aging Bucket'],bucket(exp)))
            if rep=='ar-aging-collection' and exp<=0: bad.append(('notpastdue-in-collection',x['ID'],due))
        r[rep]=dict(header=head,rows=len(rows),bad=len(bad),sample=bad[:5],dated_after_asof=late,no_due=nodue,totals=tot)
    # summary totals vs detail bucket sums
    for side,det in [('ar','ar-aging-detail'),('ap','ap-aging-detail')]:
        head,h,rows,tot=load(f'{det}-{asof}-all.csv'); s=collections.Counter()
        for x in rows: s[BN.get(x['Aging Bucket'].lower(),x['Aging Bucket'])]+=round(float(x['Open Balance'])*100)
        sh,shh,srows,stot=load(f'{side}-aging-summary-{asof}-all.csv')
        st=dict(zip(shh,stot[0])) if stot else {}
        cmp={b:(s[b]/100, st.get(c)) for b,c in [('Current','Current'),('1-30','1-30 Days'),('31-60','31-60 Days'),('61-90','61-90 Days'),('91+','91 And Over')]}
        r[side+'-summary-vs-detail']={'header':sh,'cmp':cmp,'summary_total':st.get('Total'),'detail_total':sum(s.values())/100}
    res[asof]=r
json.dump(res,open('rowcheck.json','w'),indent=1,default=str)
for a,r in res.items():
    print('=== as of',a)
    for k,v in r.items():
        if 'cmp' in v: print(k, v['header'], 'summary',v['summary_total'],'detail',v['detail_total'], {b:c for b,c in v['cmp'].items()})
        else: print(k, v['header'], 'rows',v['rows'],'bad',v['bad'],v['sample'][:3],'dated_after_asof',v['dated_after_asof'],'no_due',v['no_due'],'totals',v['totals'])
