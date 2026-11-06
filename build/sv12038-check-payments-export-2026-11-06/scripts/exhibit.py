import sys,csv,io,json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, font, RED, GRN, BLK
from PIL import Image, ImageDraw
def rows(f,key):
    raw=open(f,encoding='utf-8-sig').read()
    try: raw=''.join(json.loads(raw)['data'])
    except Exception: pass
    r=list(csv.reader(io.StringIO(raw))); return r[0],[x for x in r[1:] if key in x[0]]
def table(f,key,title,col,note):
    h,rs=rows(f,key); cols=[0,1,2,3,4,6]; W=[300,230,520,230,220,200]; S=2; rh=40*S
    im=Image.new('RGB',(sum(W)*S+40*S, (len(rs)+1)*rh+150*S+70*S),'white'); d=ImageDraw.Draw(im)
    d.rectangle([0,0,im.width,60*S],fill=(244,246,250)); d.text((20*S,16*S),title,font=font(22*S,True),fill=BLK)
    y=80*S; x=20*S
    for i,c in enumerate(cols): d.text((x+8*S,y+10*S),h[c],font=font(17*S,True),fill=BLK); x+=W[i]*S
    d.line([20*S,y+rh,im.width-20*S,y+rh],fill=(200,205,215),width=2*S)
    for j,r in enumerate(rs):
        y=80*S+(j+1)*rh; x=20*S
        for i,c in enumerate(cols): d.text((x+8*S,y+10*S),r[c],font=font(17*S),fill=BLK); x+=W[i]*S
    y=80*S+len(rs)*rh; d.rectangle([14*S,80*S+rh-4*S,im.width-14*S,y+rh+4*S],outline=col,width=4*S)
    tot=sum(float(r[6].replace(',','')) for r in rs)
    d.text((20*S,y+rh+20*S),note.format(n=len(rs),t=f'{tot:,.2f}'),font=font(18*S,True),fill=col)
    return im
a=panel('ev/prod-payment-methods.png',crop=(200,280,1570,470),title='BEFORE - production (v26.45.2-198e632), 6 Nov 2026: "Cheque" was accepted next to "Check"',
        boxes=[(248,334,1552,428,RED,1)],notes=[(1,RED,'Settings > Payment Methods > Customer Payments now lists both "Check" and "Cheque". The app gives both the same internal code, so it treats them as one method twice.')])
b=table('ev/prod-before-customer_payment-this_month.csv','ZZ12038','BEFORE - production export (Reports > Export Reports > Customer Payment)',RED,'One $959.58 check (ZZ12038-1) shows {n} rows = ${t} - every invoice line is listed twice.')
c=panel('ev/branch-new-pm-after-Cheque.png',crop=(440,330,1520,900),title='AFTER - QA branch sv12038 (v26.45.2-df7aeed), 6 Nov 2026: "Cheque" is refused',
        boxes=[(521,424,1079,464,GRN,1),(1100,834,1500,890,GRN,2)],notes=[(1,GRN,'Settings > Payment Methods > New Payment Method, Name typed as "Cheque", then Save & Close.'),(2,GRN,'The branch answers "Payment method already exist" and nothing is added, so the duplicate can no longer be created.')])
d=table('ev/branch-after-pay-export-range_this_month.csv','ZZ12038','AFTER - QA branch export (same report, same steps)',GRN,'One $4,417.57 check (ZZ12038-B1) over two invoices shows {n} rows = ${t} - each invoice once.')
stack([a,b,c,d]).save('ev/jira/01-check-export-before-after.png'); print(Image.open('ev/jira/01-check-export-before-after.png').size)
