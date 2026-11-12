import subprocess, re, html, sys
from PIL import Image, ImageDraw, ImageFont
EV='/home/user/Manual-test-Cases/build/sv12547-aging-pdf-total-for-2026-11-12/ev2/'; OUT=EV+'../exhibits/'
F='/usr/share/fonts/truetype/dejavu/DejaVuSans'; fb=lambda s:ImageFont.truetype(F+'-Bold.ttf',s); fr=lambda s:ImageFont.truetype(F+'.ttf',s)
DPI=150; RED=(200,30,30); GRN=(20,140,60)
def render(pdf):
    subprocess.run(['pdftoppm','-r',str(DPI),'-f','1','-l','1','-png',EV+pdf,'/tmp/_r'],check=True)
    import glob; return Image.open(sorted(glob.glob('/tmp/_r*.png'))[0]).convert('RGB')
def lines(pdf):
    x=subprocess.run(['pdftotext','-bbox-layout','-f','1','-l','1',EV+pdf,'-'],capture_output=True,text=True).stdout
    out=[]
    for m in re.finditer(r'<line xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</line>',x,re.S):
        words=re.findall(r'>([^<]*)</word>',m.group(5)); out.append(([float(v)*DPI/72 for v in m.groups()[:4]],html.unescape(' '.join(words))))
    return out
def find(pdf,pat):
    r=[b for b,t in lines(pdf) if re.search(pat,t)]
    if not r: sys.exit(f'not found {pat} in {pdf}')
    return r
def rowbox(pdf,pat,W):  # box across the whole row
    b=find(pdf,pat)[0]; return [b[0]-8,b[1]-6,W-int(22*DPI/72),b[3]+6]
def panel(img,title,col,boxes,caption,crop):
    img=img.crop(crop); d=ImageDraw.Draw(img)
    for b in boxes: d.rectangle([b[0]-crop[0],b[1]-crop[1],b[2]-crop[0],b[3]-crop[1]],outline=col,width=5)
    W=img.width; head=60; foot=110; c=Image.new('RGB',(W,img.height+head+foot),'white'); c.paste(img,(0,head))
    d=ImageDraw.Draw(c); d.rectangle([0,0,W,head],fill=col); d.text((18,14),title,font=fb(28),fill='white')
    y=img.height+head+14
    for ln in caption: d.text((18,y),ln,font=fr(24),fill=(30,30,30)); y+=34
    ImageDraw.Draw(c).rectangle([0,0,W-1,c.height-1],outline=(180,180,180),width=2); return c
def side(a,b,name):
    h=max(a.height,b.height); c=Image.new('RGB',(a.width+b.width+30,h),'white'); c.paste(a,(0,0)); c.paste(b,(a.width+30,0)); c.save(OUT+name); print(name,c.size)
# 1 before/after: ticket PIC1 (scaled) vs fixed PDF
pb=Image.open(EV+'before-PIC1-qa-subtotal.png').convert('RGB').crop((16,52,858,330)); pb=pb.resize((pb.width*2,pb.height*2),Image.LANCZOS)
pdf='ex1-arcol.pdf'; ia=render(pdf); W=ia.width
bb=rowbox(pdf,r'^Total for ZZAUTOTEST AR R36',W)
after=panel(ia,'AFTER - QA branch with the fix (12 Nov 2026, build v26.45.3-34788b2)',GRN,[bb],['The customer now closes with "Total for ZZAUTOTEST AR R36 Collect X  $110.00  $110.00",','the same words as the screen. Amounts and the Totals row are unchanged.'],(0,0,W,int(bb[3]+90)))

before=panel(pb,'BEFORE - QA branch before the fix (ticket picture, 11 Nov 2026)',RED,[],['The same customer closed with only "Subtotal  $110.00  $110.00" -','the customer\'s name was missing.'],(0,0,pb.width,pb.height))
before=before.resize((after.width,int(before.height*after.width/before.width)),Image.LANCZOS)
c=Image.new('RGB',(after.width,before.height+after.height+30),'white'); c.paste(before,(0,0)); c.paste(after,(0,before.height+30)); c.save(OUT+'EX1-before-after-ar-collection.png'); print('EX1',c.size)
# 2 example 2 after
pdf='ex2-ardet.pdf'; im=render(pdf); W=im.width; bs=find(pdf,r'^Total for ')
boxes=[[b[0]-8,b[1]-6,W-int(22*DPI/72),b[3]+6] for b in bs]
last=max(b[3] for b in boxes)
panel(im,'A/R Aging Detail - ZZAUTOTEST AR R13 Payment After (QA branch v26.45.3-34788b2, 12 Nov 2026)',GRN,boxes,['Each bucket closes with "Total for <bucket name>", e.g. "Total for 31-60 days past due  $100.00  $60.00"','(it read "Subtotal  $100.00  $60.00" before the fix).'],(0,0,W,int(last+90))).save(OUT+'EX2-ar-detail-total-for-bucket.png'); print('EX2')
# 3 long name wrap
pdf='apun-wrap.pdf'; im=render(pdf); W=im.width; tb=find(pdf,r'Total for ZZAUTOTEST SV12547')
ls=lines(pdf); y0=min(b[1] for b in tb); y1=max(b[3] for b,t in ls if b[1]>=y0-2 and b[1]<y0+60)
hdr=find(pdf,r'^Date')[0]
panel(im,'A/P Unpaid Invoices - vendor with a 173-character name (QA branch v26.45.3-34788b2, 12 Nov 2026)',GRN,[[tb[0][0]-8,y0-6,W-int(22*DPI/72),y1+6],[hdr[0]-6,hdr[1]-4,hdr[2]+6,hdr[3]+4]],['The long "Total for ..." label wraps inside its own row; the Date column keeps its normal width','and the amounts stay under Amount and Open Balance.'],(0,0,W,int(y1+90))).save(OUT+'EX3-long-name-wraps-in-row.png'); print('EX3')
# 4 credit term admin vs reports-only
def cut(pdf,title,cap):
    im=render(pdf); W=im.width; b1=list(find(pdf,r'^Bancescu & Sons')[0]); tf=find(pdf,r'^Total for Bancescu'); b2=tf[0]
    b1[2]=max(b[2] for b,t in lines(pdf) if abs(b[1]-b1[1])<4)
    return panel(im,title,GRN,[[b1[0]-8,b1[1]-6,b1[2]+8,b1[3]+6],[b2[0]-8,b2[1]-6,W-int(22*DPI/72),b2[3]+6]],cap,(0,int(b1[1]-80),W,int(b2[3]+14)))
a=cut('arcol-bancescu.pdf','Admin (has A/R and A/P data access)',['Customer line: "Phone: 257-911-9306   Credit term: COD".','Total row: name and the two amounts only.'])
b=cut('tech-arcol-bancescu.pdf','User with Reports access only (no A/R and A/P data access)',['Customer line: "Phone: 257-911-9306" - no Credit term, as intended.','Total row: name and the two amounts only.'])
c=Image.new('RGB',(a.width,a.height+b.height+30),'white'); c.paste(a,(0,0)); c.paste(b,(0,a.height+30)); c.save(OUT+'EX4-phone-credit-term-by-role.png'); print('EX4',c.size)
