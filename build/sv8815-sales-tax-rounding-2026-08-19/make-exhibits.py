#!/usr/bin/env python3
"""Build the annotation spec from the CAPTURED bounding boxes - never from eyeballed coordinates."""
import json, os, sys
SH='/tmp/sv8815/shots'
OUT='/home/user/Manual-test-Cases/build/sv8815-sales-tax-rounding-2026-08-19/evidence'
BUILD='v3.8-1f5fb3c'
GREEN=[20,120,60]; AMBER=[200,110,0]; BLUE=[25,70,170]

def load(k):
    return json.load(open(f'{SH}/{k}.json'))

def box(d, kind, key, pad=6):
    """kind: 'fin' row/value by label, or 'extra' by text."""
    if kind=='fin':
        r=d['fin'][key]['value']
    else:
        r=d['extra'][key]
    return {"x":int(r['x'])-pad,"y":int(r['y'])-pad,"w":int(r['w'])+2*pad,"h":int(r['h'])+2*pad}

def finrow(d,label,pad=6):
    r=d['fin'][label]['row']
    return {"x":int(r['x'])-pad,"y":int(r['y'])-pad,"w":int(r['w'])+2*pad,"h":int(r['h'])+2*pad}

# Labels go in the EMPTY COLUMN to the right of the Financial Info panel, never on top of the
# numbers they point at, and spread vertically so consecutive labels cannot collide.
LX=430
def lane(d, i, base=None):
    """i = 0,1,2... -> a y position in the free space, stepped well clear of its neighbours."""
    anchor = base if base is not None else int(min(v['row']['y'] for v in d['fin'].values()))
    return anchor + 40 + i*64

spec=[]

def add(key,dst,banner,bannercol,boxes,caption):
    spec.append({"src":f"{SH}/{key}.png","dst":f"{OUT}/{dst}","banner":banner,
                 "bannercol":bannercol,"boxes":boxes,"caption":caption})

# ---- A: case 1, the real customer invoice
for key,dst,mode,tax,total,extra_note in [
 ("A1-case1-default","EXHIBIT-A1-case1-DEFAULT-302.81.png","Line by line (default)","$302.81","$6,358.46",
  "This is the number on the customer's paper invoice (INV-S-26020). The default path is unchanged."),
 ("A2-case1-invoicetotal","EXHIBIT-A2-case1-INVOICE-TOTAL-302.78.png","Invoice total","$302.78","$6,358.43",
  "Same 13 taxable lines, same subtotal - only the rounding method differs. 3 cents lower."),
]:
    d=load(key); tk=[k for k in d['fin'] if k not in ('Parts','Labor','Shop Supplies','Subtotal','Total','Balance','Payments')][0]
    add(key,dst,
        f"CASE 1  -  real reported invoice  -  sales tax rounding = \"{mode}\"  -  invoiced work order {d['num']}",
        GREEN,
        [dict(**finrow(d,'Subtotal'),color=BLUE,label='taxable subtotal $6,055.65  (check this FIRST)',lx=LX,ly=lane(d,0)),
         dict(**finrow(d,tk),color=GREEN,label=f'TAX = {tax}',lx=LX,ly=lane(d,1)),
         dict(**finrow(d,'Total'),color=GREEN,label=f'TOTAL = {total}',lx=LX,ly=lane(d,2))],
        f"Work order {d['num']} on {BUILD}, already INVOICED so these figures are frozen.\n"
        f"Subtotal $6,055.65 (labor 3,312.50 + parts 2,511.27 + shop supplies 231.88, entered as 13 taxable lines).\n"
        f"Tax {tax}, total {total} - exactly the figures the ticket and the QA plan predict.\n{extra_note}")

# ---- B: case 3 goes DOWN a cent   /  C: case 2 goes UP a cent
for key,dst,label,tax,total,dirn in [
 ("B1-case3-default","EXHIBIT-B1-case3-DEFAULT-6.46.png","Line by line (default)","$6.46","$87.13",""),
 ("B2-case3-invoicetotal","EXHIBIT-B2-case3-INVOICE-TOTAL-6.45.png","Invoice total","$6.45","$87.12","DOWN one cent"),
 ("C1-case2-default","EXHIBIT-C1-case2-DEFAULT-1.80.png","Line by line (default)","$1.80","$20.34",""),
 ("C2-case2-invoicetotal","EXHIBIT-C2-case2-INVOICE-TOTAL-1.81.png","Invoice total","$1.81","$20.35","UP one cent"),
]:
    d=load(key); tk=[k for k in d['fin'] if k not in ('Parts','Labor','Shop Supplies','Subtotal','Total','Balance','Payments')][0]
    case='CASE 3 (8% on $80.67)' if key.startswith('B') else 'CASE 2 (9.75% on $18.54)'
    tail=f"  ->  {dirn}" if dirn else ""
    add(key,dst,f"{case}  -  \"{label}\"  -  invoiced work order {d['num']}{tail}",GREEN,
        [dict(**finrow(d,'Subtotal'),color=BLUE,label=f'taxable subtotal {d["fin"]["Subtotal"]["text"]}',lx=LX,ly=lane(d,0)),
         dict(**finrow(d,tk),color=GREEN,label=f'TAX = {tax}',lx=LX,ly=lane(d,1)),
         dict(**finrow(d,'Total'),color=GREEN,label=f'TOTAL = {total}',lx=LX,ly=lane(d,2))],
        f"Work order {d['num']} on {BUILD}, INVOICED (frozen).\n"
        f"These two cases together prove the setting is NOT a one-way \"tax goes down\" lever:\n"
        f"case 3 drops a cent (6.46 -> 6.45) while case 2 RISES a cent (1.80 -> 1.81).\n"
        f"A tester who only checks one of them will report the other as a bug.")

# ---- D: three stacked rates - the per-rate breakdown moves, the total does not.
# The three rate rows sit 19px apart on the invoice document, so the boxes get a TIGHT pad and the
# labels go in the empty middle column with 58px spacing - otherwise the boxes merge and the labels
# cover the very amounts they point at.
for key,dst,mode,rates in [
 ("D1-stacked-default","EXHIBIT-D1-stacked-DEFAULT-breakdown.png","Line by line (default)",[('$1.11','4%'),('$0.84','3%'),('$0.27','1%')]),
 ("D2-stacked-invoicetotal","EXHIBIT-D2-stacked-INVOICE-TOTAL-breakdown.png","Invoice total",[('$1.11','4%'),('$0.83','3%'),('$0.28','1%')]),
]:
    d=load(key)
    bx=[]
    first=min(d['extra'][a]['y'] for a,_ in rates if a in d['extra'])
    for i,(amt,pct) in enumerate(rates):
        if amt not in d['extra']: continue
        note='  <- a cent LOWER' if (mode=='Invoice total' and pct=='3%') else ('  <- a cent HIGHER' if (mode=='Invoice total' and pct=='1%') else '')
        bx.append(dict(**box(d,'extra',amt,pad=2),color=GREEN,
                       label=f'{pct} rate on its own base = {amt}{note}',lx=600,ly=int(first)-70+i*58))
    if '$2.22' in d['extra']:
        bx.append(dict(**box(d,'extra','$2.22',pad=6),color=AMBER,
                       label='invoice tax total = $2.22   IDENTICAL in both modes',lx=470,ly=int(d['extra']['$2.22']['y'])-58))
    changed=("the 3% row is a cent LOWER and the 1% row a cent HIGHER than on the default setting"
             if mode=='Invoice total' else "the default breakdown, for comparison with the next exhibit")
    add(key,dst,f"THREE STACKED RATES (4% + 3% + 1% on $27.81)  -  \"{mode}\"  -  invoiced work order {d['num']}",GREEN,bx,
        f"Work order {d['num']} on {BUILD}, INVOICED (frozen). The three rate rows are read off the printed\n"
        f"invoice document on the right; the single tax total is the Financial Info panel on the left.\n"
        f"Each rate is rounded ONCE ON ITS OWN BASE - the rates are never merged into one combined percentage.\n"
        f"Here: {changed}, and the three rate rows still add up to the invoice tax exactly.\n"
        f"The TOTAL is identical in both modes ($2.22), so checking only the total would miss this completely.")

# ---- F: payment closes to exactly zero
d=load('F1-payment-zero-balance')
tk=[k for k in d['fin'] if k not in ('Parts','Labor','Shop Supplies','Subtotal','Total','Balance','Payments')][0]
add('F1-payment-zero-balance','EXHIBIT-F1-payment-closes-to-zero.png',
    f"PAYMENT ON AN \"INVOICE TOTAL\" INVOICE  -  closes to EXACTLY zero  -  work order {d['num']}",GREEN,
    [dict(**finrow(d,tk),color=BLUE,label=f'tax billed under "Invoice total" = {d["fin"][tk]["text"]}',lx=LX,ly=lane(d,0)),
     dict(**finrow(d,'Total'),color=BLUE,label=f'total {d["fin"]["Total"]["text"]}',lx=LX,ly=lane(d,1)),
     dict(**finrow(d,'Payments'),color=GREEN,label=f'paid {d["fin"]["Payments"]["text"]}',lx=LX,ly=lane(d,2)),
     dict(**finrow(d,'Balance'),color=GREEN,label='BALANCE = $0.00   no one-cent residue',lx=LX,ly=lane(d,3))],
    f"Work order {d['num']} on {BUILD}. Invoice raised under \"Invoice total\" (tax $2.71, total $30.52), then paid in full.\n"
    f"The balance closes to EXACTLY $0.00 - which is the whole point of the change: the $0.01 residue the\n"
    f"warning banner talks about does not appear on ShopView's own side.")

# ---- G: per location, not per organisation
for key,dst,loc,mode,tax,total in [
 ("G1-locationA-invoicetotal","EXHIBIT-G1-locationA-INVOICE-TOTAL-2.71.png","Staging Heavy Duty - 9919","Invoice total","$2.71","$30.52"),
 ("G2-locationB-default","EXHIBIT-G2-locationB-DEFAULT-2.70.png","Staging Lethbridge - 4310","Line by line (default) - UNTOUCHED","$2.70","$30.51"),
]:
    d=load(key); tk=[k for k in d['fin'] if k not in ('Parts','Labor','Shop Supplies','Subtotal','Total','Balance','Payments')][0]
    add(key,dst,f"PER-LOCATION  -  {loc}  -  \"{mode}\"  -  invoiced work order {d['num']}",GREEN,
        [dict(**finrow(d,'Subtotal'),color=BLUE,label='same taxable subtotal $27.81',lx=LX,ly=lane(d,0)),
         dict(**finrow(d,tk),color=GREEN,label=f'TAX = {tax}',lx=LX,ly=lane(d,1)),
         dict(**finrow(d,'Total'),color=GREEN,label=f'TOTAL = {total}',lx=LX,ly=lane(d,2))],
        f"Work order {d['num']} on {BUILD}, INVOICED (frozen). Location: {loc}.\n"
        f"Both work orders carry the SAME tax model (9.75%) and the SAME taxable subtotal ($27.81).\n"
        f"Only the location that was switched to \"Invoice total\" bills $2.71; the location nobody touched still\n"
        f"bills $2.70. That is the proof the setting is per LOCATION and not per organisation.")

# ---- H: a 2025 invoice, untouched. Read off the STORED INVOICE DOCUMENT, scrolled into view.
# NOT off the Financial Info panel: that panel RE-PRICES an old work order against the location's
# CURRENT config, so for S-4802 it shows 2,833.11 / 2,974.77 while the issued invoice holds
# 2,833.13 / 2,974.79. Annotating the panel here would have handed a reviewer a 2-cent discrepancy.
d=json.load(open(f'{SH}/H1b-stored-invoice.json'))
bx=[]
_rows=[('$2,833.13','stored subtotal $2,833.13',BLUE),
       ('$141.66','stored tax $141.66  (GST, Federal Tax 5%)',GREEN),
       ('$2,974.79','payment applied $2,974.79  (Feb 11, 2025)',GREEN),
       ('$0.00','balance $0.00  (paid, and still exactly zero)',GREEN)]
_first=min(d['extra'][a]['y'] for a,_,_ in _rows if a in d['extra'])
for _i,(amt,lab,col) in enumerate(_rows):
    if amt not in d['extra']: continue
    r=d['extra'][amt]
    # the document rows are only 19px apart, so labels must be spread or they cover each other
    bx.append(dict(x=int(r['x'])-4,y=int(r['y'])-3,w=int(r['w'])+8,h=int(r['h'])+6,color=col,
                   label=lab,lx=470,ly=int(_first)-90+_i*52))
spec.append({"src":f"{SH}/H1b-stored-invoice.png","dst":f"{OUT}/EXHIBIT-H1-invoice-from-Feb-2025-untouched.png",
 "banner":"AN INVOICE FROM 12 FEBRUARY 2025  -  the ISSUED INVOICE, still exactly as it was billed  -  S-4802",
 "bannercol":GREEN,"boxes":bx,
 "caption":(f"The ISSUED INVOICE DOCUMENT for S-4802 (invoice INV-S2-4802, dated Feb 12 2025), read on {BUILD}.\n"
   f"Tax model GST, rate Federal Tax 5%, tax $141.66, subtotal $2,833.13, total $2,974.79, balance $0.00.\n"
   f"This run deliberately changed that location's whole tax model five times over (GST -> 8% -> 9.75% ->\n"
   f"three stacked rates -> GST+PST). The issued invoice followed none of it: it keeps its own frozen copy\n"
   f"of the tax model. All 1,000 existing invoices were read the same way - 993 still carry their original\n"
   f"GST 5% snapshot, and the only 7 that do not are the ones this test run created.\n"
   f"NOTE, so nobody has to spot it: the Financial Info panel on the LEFT reads 2,833.11 / 2,974.77.\n"
   f"That panel RE-PRICES the work order live against the location's CURRENT settings, so on a 2025\n"
   f"record it is not the billed figure. The ISSUED INVOICE on the right is the billed figure, and it is\n"
   f"the one that has not moved. Checking an old invoice against that panel produces a false alarm.")})

# ---- The setting itself, from REAL captured geometry (the earlier version of these two used
# eyeballed coordinates - see LESSONS).
for key,dst,mode,banner_note in [
 ("LOC1-default","EXHIBIT-S1-setting-DEFAULT-line-by-line.png","Line By Line (Default)",
  "No warning banner - correct, because nothing has been changed away from the default."),
 ("LOC2-invoicetotal","EXHIBIT-S2-setting-INVOICE-TOTAL-warning.png","Invoice Total",
  "Selecting it raises the QuickBooks $0.01 open-balance warning, which is required by the ticket (AC5)."),
]:
    g=json.load(open(f'{SH}/{key}.json'))['extraGeom']
    bx=[dict(x=int(g['field']['x'])-8,y=int(g['field']['y'])-14,w=int(g['field']['w'])+16,h=int(g['field']['h'])+22,
             color=GREEN,label=f'Sales Tax Rounding = "{mode}"',lx=250,ly=int(g['field']['y'])-70)]
    if 'banner' in g:
        bx.append(dict(x=int(g['banner']['x'])-6,y=int(g['banner']['y'])-6,w=int(g['banner']['w'])+12,h=int(g['banner']['h'])+12,
                       color=AMBER,label='the required QuickBooks $0.01 warning',lx=250,ly=int(g['banner']['y'])+30))
    add(key,dst,f"THE SETTING  -  Administration > Locations > Staging Heavy Duty - 9919  -  \"{mode}\"",GREEN,bx,
        f"Read live on {BUILD}. Field label on the build: \"Sales Tax Rounding\".\n"
        f"Option wording: \"Line by line (default)\" - \"Round the tax on every line to the cent, then add them up.\"\n"
        f"and \"Invoice total\" - \"Add the taxable lines up first, then round the tax once.\"\n"
        f"{banner_note}\n"
        f"Saving and reopening keeps the value; switching back removes the banner and also persists.")

json.dump(spec,open('/tmp/sv8815/annspec2.json','w'),indent=1)
print(f'{len(spec)} exhibits queued')
for s in spec: print('  ',os.path.basename(s['dst']))
