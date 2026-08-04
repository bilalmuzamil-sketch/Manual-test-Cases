import json,csv
from decimal import Decimal, ROUND_HALF_UP
d=json.load(open('api-all.json')); rows=d['rows']
txt=open('default.csv',encoding='utf-8-sig').read()
cr=list(csv.reader(txt.splitlines())); hdr=cr[2]
data=[r for r in cr[3:] if r and len(r)==len(hdr)]
body=[r for r in data if r[0]!='Totals']; totrow=[r for r in data if r[0]=='Totals'][0]
idx={h:i for i,h in enumerate(hdr)}
print('CSV body',len(body),'| API',len(rows))
# 1. positional part-number alignment
pn_mis=[(i,body[i][0],rows[i]['part_number']) for i in range(len(body)) if body[i][0]!=rows[i]['part_number']]
print('positional part-number mismatches:',len(pn_mis), pn_mis[:5])
dups=len(body)-len({r[0] for r in body}); print('duplicate part numbers in the export:',dups)

def cents(s):
    s=s.strip()
    if s in ('','—','-'): return None
    return int(Decimal(s.replace('$','').replace(',','')).scaleb(2).to_integral_value(rounding=ROUND_HALF_UP))
def half_up_1(x): return Decimal(str(x)).quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)

COLS={'Unit Cost':'unit_cost','Unit Sell':'unit_sell','Total Cost':'total_cost','Total Sell':'total_sell','Margin':'margin'}
compared=matched=0; bad=[]; pct_halfup=pct_other=0
for i,r in enumerate(body):
    a=rows[i]
    for h,k in COLS.items():
        compared+=1
        if cents(r[idx[h]])==a[k]: matched+=1
        else: bad.append((a['part_number'],h,r[idx[h]],a[k]))
    compared+=1
    cs=r[idx['Margin %']].replace('%','').strip(); ap=a['margin_pct']
    if cs in ('','—'):
        (matched.__class__)  # noop
        if ap is None: matched+=1
        else: bad.append((a['part_number'],'Margin %',r[idx['Margin %']],ap))
    else:
        if Decimal(cs)==half_up_1(ap): matched+=1; pct_halfup+=1
        else: bad.append((a['part_number'],'Margin %',r[idx['Margin %']],ap)); pct_other+=1
print(f'\nEXHAUSTIVE: {compared} cells compared over {len(body)} rows -> matched {matched}, mismatched {len(bad)}')
for b in bad[:10]: print('   ',b)
print(f'Margin % cells equal to half-up-1dp of the API value: {pct_halfup} (other: {pct_other})')
# totals row
t=d['totals']; print('\nAPI totals:',t)
print('CSV totals row:', {h:totrow[idx[h]] for h in hdr if totrow[idx[h]]})
