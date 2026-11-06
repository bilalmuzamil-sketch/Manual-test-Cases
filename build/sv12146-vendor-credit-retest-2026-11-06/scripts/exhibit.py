# usage: python3.12 exhibit.py -> annotated SV-12146 exhibits ../ev/exh-*.png (Payments-tab screenshots at 2x + remittance slips rendered at 150 dpi)
import json, re, html, textwrap
from PIL import Image, ImageDraw, ImageFont
EV='../ev/'; F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def font(s,b=False): return ImageFont.truetype(FB if b else F,s)
RED=(220,30,30); GRN=(20,140,60)
def words(tag):
    t=open(EV+tag+'.bbox.html').read(); k=150/72
    return [(html.unescape(w),float(a)*k,float(b)*k,float(c)*k,float(d)*k) for a,b,c,d,w in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</word>',t)]
def line_box(ws,label,occ=0):
    hits=[w for w in ws if w[0]==label]; w=hits[occ]; y=(w[2]+w[4])/2
    same=[v for v in ws if abs((v[2]+v[4])/2-y)<6 and v[1]>=w[1]-230]
    return (min(v[1] for v in same)-8,min(v[2] for v in same)-6,max(v[3] for v in same)+8,max(v[4] for v in same)+6)
def row_box(ws,first,occ=0):  # whole table row starting with word `first`
    w=[v for v in ws if v[0]==first][occ]; y=(w[2]+w[4])/2
    same=[v for v in ws if abs((v[2]+v[4])/2-y)<6]
    return (min(v[1] for v in same)-8,min(v[2] for v in same)-6,max(v[3] for v in same)+8,max(v[4] for v in same)+6)
def slip(tag,boxes,color,y1=495):
    im=Image.open(EV+tag+'.png').convert('RGB'); ws=words(tag)
    yl=max(v[4] for v in ws if v[0] in ('Total:','Credit:'))+25
    d=ImageDraw.Draw(im)
    for b in boxes: d.rectangle(b(ws),outline=color,width=5)
    return im.crop((95,y1,1150,int(yl)))
def paytab(tag,rows,color):
    im=Image.open(EV+tag+'-payments.png').convert('RGB'); R=json.load(open(EV+tag+'-payments-rects.json')); d=ImageDraw.Draw(im)
    for i in rows:
        r=R[i]; d.rectangle((r['x']*2+4,r['y']*2+4,(r['x']+r['w'])*2-4,(r['y']+r['h'])*2-4),outline=color,width=6)
    last=R[-1]; return im.crop((int(R[0]['x']*2), int(R[0]['y']*2)-10, int((R[0]['x']+R[0]['w'])*2), int((last['y']+last['h'])*2)+10)).resize((1100, int(1100*((last['y']+last['h']-R[0]['y'])*2+20)/(R[0]['w']*2))))
def header(w,text,color):
    h=Image.new('RGB',(w,70),color); ImageDraw.Draw(h).text((18,18),text,font=font(28,True),fill='white'); return h
def stack(parts,bg='white',pad=14):
    W=max(p.width for p in parts); H=sum(p.height for p in parts)+pad*(len(parts)-1)
    out=Image.new('RGB',(W,H),bg); y=0
    for p in parts: out.paste(p,(0,y)); y+=p.height+pad
    return out
def side(a,b,pad=30):
    out=Image.new('RGB',(a.width+b.width+pad,max(a.height,b.height)),'white'); out.paste(a,(0,0)); out.paste(b,(a.width+pad,0)); return out
def caption(img,lines):
    f=font(24); wrapped=[]; 
    for l in lines: wrapped+=textwrap.wrap(l,int(img.width/13.5))+['']
    h=30*len(wrapped)+20; out=Image.new('RGB',(img.width,img.height+h),'white'); out.paste(img,(0,0)); d=ImageDraw.Draw(out)
    for i,l in enumerate(wrapped): d.text((16,img.height+10+30*i),l,font=f,fill=(30,30,30))
    return out
# 1 before vs after
B=stack([header(1100,'BEFORE - production v26.45.1-753355c, 6 Nov 2026',RED),paytab('PB1',[2,3],RED),
         slip('PB1-remit-dl-1',[lambda w:line_box(w,'Included:'),lambda w:line_box(w,'Total:',0),lambda w:row_box(w,'C-18008')],RED)])
A=stack([header(1100,'AFTER - QA branch sv11839 v26.45.0-5d54a3f, 6 Nov 2026',GRN),paytab('A1',[2,3],GRN),
         slip('A1-remit-dl-1',[lambda w:line_box(w,'Included:'),lambda w:line_box(w,'Total:',0),lambda w:row_box(w,'C-13671'),lambda w:line_box(w,'Credit:')],GRN)])
caption(side(B,A),['Same steps on both builds: a $10.00 bill, a $100.00 credit, New Payment with the bill and the credit ticked, Make Payment. Top: the vendor\'s Payments tab. Bottom: the Remittance slip of that payment.',
 'Before: the bill line shows $0.00, the credit line -$100.00 Applied, the slip says Credits Included $100.00 and Total $-90.00, and the whole credit is used up.',
 'After: the bill line shows $10.00, the credit line -$10.00 Applied, the slip says Credits Included $10.00 and Total $0.00, and the Credits Summary shows Payment $10.00, Remaining $90.00 and "Remaining Credit: $90.00".']).save(EV+'exh-1-before-after.png')
# 2 second payment from the leftover
un=Image.open(EV+'A2-unpaid.png').convert('RGB'); 
A2=stack([header(1100,'QA branch: $50.00 bill paid from the $90.00 left on the credit',GRN),paytab('A2',[2,3,5,6],GRN),
          slip('A2-remit-dl-1',[lambda w:line_box(w,'Included:'),lambda w:line_box(w,'Total:',0),lambda w:row_box(w,'C-13671'),lambda w:line_box(w,'Credit:')],GRN)])
caption(A2,['Payments tab: the new payment shows the $50.00 bill and -$50.00 Applied from credit C-13671; the first payment still shows $10.00 and -$10.00 Applied.',
 'Slip of the second payment: Credits Included $50.00, Total $0.00, credit Balance $90.00, Payment $50.00, Remaining $40.00, "Remaining Credit: $40.00". Unpaid Invoices then lists C-13671 with -$40.00 still open (Unapplied).']).save(EV+'exh-2-second-payment.png')
# 3 variants
V1=stack([header(1100,'One $60.00 credit across two bills ($25.00 + $15.00)',GRN),slip('B1-remit-dl-1',[lambda w:line_box(w,'Included:'),lambda w:line_box(w,'Total:',0),lambda w:line_box(w,'Credit:')],GRN)])
V2=stack([header(1100,'A $20.00 credit on a $50.00 bill ($30.00 paid from the bank)',GRN),slip('E1-remit-dl-1',[lambda w:line_box(w,'Included:'),lambda w:line_box(w,'Total:',0),lambda w:line_box(w,'Credit:')],GRN)])
caption(side(V1,V2),['QA branch, Remittance slips. Left: $40.00 of the $60.00 credit used, Total $0.00, Remaining Credit $20.00. Right: the whole $20.00 credit used, $30.00 paid, Total $30.00, Remaining Credit $0.00.']).save(EV+'exh-3-variants.png')
print('ok')
