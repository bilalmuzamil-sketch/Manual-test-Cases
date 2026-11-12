# per PDF: no "Subtotal"; every group closes with "Total for <name>"; on that row only the two money figures, under Amount / Open Balance;
# nothing in Due Date / Past Due; Date column width per page; CSV has no group/total-for rows and one Totals row.
import subprocess,re,sys,html,json,glob,os,csv,io
def words(pdf):
    x=subprocess.run(['pdftotext','-bbox',pdf,'-'],capture_output=True,text=True).stdout
    pages=[]
    for pg in re.findall(r'<page[^>]*>(.*?)</page>',x,re.S):
        pages.append([(float(a),float(b),float(c),float(d),html.unescape(t)) for a,b,c,d,t in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</word>',pg)])
    return pages
def lines(ws):
    L={}
    for w in ws: L.setdefault(round(w[1]/2),[]).append(w)
    return [sorted(v) for k,v in sorted(L.items())]
MONEY=re.compile(r'^\(?-?\$[\d,]+\.\d\d\)?$')
res={}
for pdf in sorted(glob.glob('ev/*.pdf')):
    tag=os.path.basename(pdf)[:-4]; pages=words(pdf); r={'pages':len(pages),'subtotal':0,'totalfor':[],'bad':[],'datecolw':[],'headers_per_page':[]}
    for pi,ws in enumerate(pages):
        ls=lines(ws); hdr=None
        for l in ls:
            t=' '.join(w[4] for w in l)
            if 'Subtotal' in t: r['subtotal']+=1
            if l[0][4]=='Date' and 'Amount' in t: hdr={w[4]:w for w in l}; nxt=l[1]; r['datecolw'].append(round(nxt[0]-l[0][0],1)); r['headers_per_page'].append(t)
            if t.startswith('Total for'):
                money=[w for w in l if MONEY.match(w[4])]; label=' '.join(w[4] for w in l if not MONEY.match(w[4]))
                r['totalfor'].append(label+' | '+' '.join(w[4] for w in money))
                if hdr:
                    am=hdr.get('Amount'); ob=[w for w in l if 0] 
                    hx={w[4]:w for w in l}
                    # Amount header & Open/Balance header x ranges
                    H=[w for w in sum([[w] for w in hdr.values()],[])]
                    amt=hdr['Amount']; bal=hdr.get('Balance'); due=[w for w in ls[ls.index([w for w in ls if w[0][4]=='Date' and 'Amount' in ' '.join(x[4] for x in w)][-1])] if w[4] in('Due','Past')] if False else None
                    if len(money)!=2: r['bad'].append(f'p{pi+1} {len(money)} money tokens: {t}')
                    else:
                        m1,m2=money
                        if not (m1[2]<=bal[0]+1 and m1[2]>=amt[0]-60): r['bad'].append(f'p{pi+1} first amount not under Amount: {m1} amt={amt[:3]}')
                        if not (abs(m2[2]-bal[2])<25): r['bad'].append(f'p{pi+1} second amount not under Open Balance: {m2} bal={bal[:3]}')
                    # any date or number tokens between Due Date header start and Amount header start (other than label text)
                    dd=[w for w in hdr.values() if w[4]=='Due']
                    if dd:
                        x0=min(w[0] for w in dd)
                        stray=[w[4] for w in l if w[0]>=x0-2 and w[2]<=amt[0]-5 and re.match(r'^[\d—,]+$|^[A-Z][a-z]{2}$',w[4]) and not MONEY.match(w[4])]
                        if stray and not t.startswith('Total for '+'x'): r['bad'].append(f'p{pi+1} figures under Due Date/Past Due on total row: {stray}')
                    if label.count('Total for')!=1: r['bad'].append(f'p{pi+1} label odd: {label}')
    res[tag]=r
for c in sorted(glob.glob('ev/*.csv')):
    tag=os.path.basename(c)[:-4]; rows=list(csv.reader(io.StringIO(open(c,encoding='utf-8-sig').read())))
    body=[x for x in rows if len(x)>3]; tot=[x for x in body if x[0]=='Totals']; grp=[x for x in rows if any(('Total for' in y or 'Subtotal' in y) for y in x)]
    res.setdefault(tag,{})['csv']={'rows':len(body),'totals_rows':len(tot),'group_or_totalfor_rows':len(grp),'header':body[0][:3] if body else None}
for k,v in res.items():
    print(f"== {k}: pages={v.get('pages')} Subtotal={v.get('subtotal')} datecol={sorted(set(v.get('datecolw',[])))} bad={len(v.get('bad',[]))} csv={v.get('csv')}")
    for t in v.get('totalfor',[]): print('   ',t)
    for b in v.get('bad',[])[:6]: print('   BAD',b)
json.dump(res,open('ev/check.json','w'),indent=1)
