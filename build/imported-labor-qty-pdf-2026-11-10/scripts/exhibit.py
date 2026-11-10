import sys
from PIL import Image, ImageDraw, ImageFont
env=sys.argv[1]; ev=f'ev/{env}'
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; FR='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
fb=lambda n: ImageFont.truetype(F,n); fr=lambda n: ImageFont.truetype(FR,n)
RED=(220,30,30); GRN=(20,140,60); BLUE=(25,90,200)
import re,json
# --- screen panel (dpr 2; CSS coords)
scr=Image.open(f'{ev}/screen.png').convert('RGB')
rows=json.load(open(f'{ev}/screen-rows.json'))
cx0,cy0,cx1,cy1=616,75,1590,745   # CSS crop
crop=scr.crop((cx0*2,cy0*2,cx1*2,cy1*2)); d=ImageDraw.Draw(crop)
def sbox(x0,y0,x1,y1,col,w=6): d.rectangle(((x0-cx0)*2,(y0-cy0)*2,(x1-cx0)*2,(y1-cy0)*2),outline=col,width=w)
# quantity column CSS x ~ 1040-1085 inside table rows
qrows=[r for r in rows if re.search(r'Tow in|Brake inspection|Brake pad',r['t'])]
for r in qrows:
    y0=r['y']+r['h']-24 if r['h']>30 else r['y']; sbox(1035,y0-2,1092,y0+22,RED)
# download icon (CSS ~ 1526,104)
sbox(1508,88,1546,122,BLUE,5)
d.text(((1470-cx0)*2,(88-cy0)*2),'A',font=fb(44),fill=BLUE)
# --- pdf panel 288dpi = pt*4
pdf=Image.open(f'{ev}/pdf288-1.png').convert('RGB')
words=re.findall(r'xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]+)<',open(f'{ev}/bbox.html').read())
px0,py0,px1,py1=52,255,552,442
pc=pdf.crop((px0*4,py0*4,px1*4,py1*4)); dp=ImageDraw.Draw(pc)
for x0,y0,x1,y1,t in words:
    x0,y0,x1,y1=map(float,(x0,y0,x1,y1))
    if t in('180.00','150.00') and 300<x0<400:
        dp.rectangle(((x0-4-px0)*4,(y0-3-py0)*4,(x1+4-px0)*4,(y1+3-py0)*4),outline=RED,width=10)
    if t=='4.00' and 300<x0<400:
        dp.rectangle(((x0-4-px0)*4,(y0-3-py0)*4,(x1+4-px0)*4,(y1+3-py0)*4),outline=GRN,width=10)
W=1948; pc=pc.resize((W,int(pc.height*W/pc.width)),Image.LANCZOS)
def title(txt,col): im=Image.new('RGB',(W,90),col); ImageDraw.Draw(im).text((24,18),txt,font=fb(36),fill="white"); return im
def cap(lines):
    h=24+len(lines)*52; im=Image.new('RGB',(W,h),'white'); dd=ImageDraw.Draw(im)
    for i,(t,c) in enumerate(lines): dd.text((24,14+i*52),t,font=fr(36),fill=c)
    return im
envname='PRODUCTION (app.shopview.com)' if env=='prod' else 'QA ENVIRONMENT (sv12435.qa.shopview.com)'
inv='ZZQTYPDF-P' if env=='prod' else 'ZZQTYPDF-QA'
parts=[title(f'{envname} - imported invoice {inv}, 10 Nov 2026',(40,40,40)),
 title('1. ON SCREEN (Work Orders > Imported invoice)',(70,70,70)), crop,
 cap([('A = the Download button (top right). Red boxes = the Quantity column.',BLUE),
      ('On screen the quantities match the import file: 3.00, 2.50 and 4.',RED),
      (('Build v26.45.3-fc08f23' if env=='prod' else 'Build v26.45.3-8f11821')+', checked 10 Nov 2026, 17:00 UTC.',(90,90,90))]),
 title('2. DOWNLOADED PDF of the same invoice',(70,70,70)), pc,
 cap([('Red boxes: the labor and sublet quantities print as 180.00 and 150.00',RED),
      ('(the hours x 60), so 150.00 x $40.00 does not make $100.00.',RED),
      ('Green box: the part quantity prints correctly as 4.00.',GRN)])]
H=sum(p.height for p in parts); out=Image.new('RGB',(W,H),'white'); y=0
for p in parts: out.paste(p,(0,y)); y+=p.height
out.save(f'ev/{env}-qty-screen-vs-pdf.png'); print(out.size)
