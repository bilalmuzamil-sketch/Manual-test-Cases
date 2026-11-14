import subprocess,re,glob
from PIL import Image,ImageDraw,ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans'; DPI=150; k=DPI/72
def words(pdf,page):
    x=subprocess.run(['pdftotext','-bbox','-f',str(page),'-l',str(page),pdf,'-'],capture_output=True,text=True).stdout
    return [(float(a)*k,float(b)*k,float(c)*k,float(d)*k,w) for a,b,c,d,w in re.findall(r'xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<',x)]
def page_of(pdf,pat):
    n=int(re.search(r'Pages:\s+(\d+)',subprocess.run(['pdfinfo',pdf],capture_output=True,text=True).stdout).group(1))
    for p in range(1,n+1):
        if any(re.search(pat,w[4]) for w in words(pdf,p)): return p
def build(pdf,pat,label,out,title,cap):
    p=page_of(pdf,pat); W=words(pdf,p)
    [__import__('os').remove(f) for f in glob.glob('/tmp/_side*.png')]
    subprocess.run(['pdftoppm','-r',str(DPI),'-f',str(p),'-l',str(p),'-png',pdf,'/tmp/_side'],check=True)
    im=Image.open(sorted(glob.glob('/tmp/_side*.png'))[-1]).convert('RGB'); d=ImageDraw.Draw(im); PW=im.width
    nm=[w for w in W if re.search(pat,w[4])]
    hdr=[w for w in W if w[4] in ('Current','Days','31-60') or w[4].startswith('6')]
    hy=min(w[1] for w in W if w[4] in ('Current',))
    over=[w for w in W if w[2]>PW-40]
    tot=[w for w in W if w[4]=='Totals']; yb=(tot[0][3]+12) if tot else im.height-140
    d.rectangle([PW-34,hy-14,PW-3,yb],outline=(200,30,30),width=7)
    for w in nm: d.rectangle([w[0]-8,w[1]-6,w[2]+8,w[3]+6],outline=(30,90,200),width=5)
    # page footer number
    pg=[w for w in W if w[4]=='Page']; 
    c=Image.new('RGB',(PW,im.height+250),'white'); c.paste(im,(0,90)); d=ImageDraw.Draw(c)
    d.rectangle([0,0,PW,90],fill=(200,30,30)); d.text((20,22),title,font=ImageFont.truetype(F+'-Bold.ttf',34),fill='white')
    y=im.height+105
    for i,(t,col) in enumerate(cap): d.text((20,y),t,font=ImageFont.truetype(F+'.ttf',27),fill=col); y+=42
    d.rectangle([0,0,PW-1,c.height-1],outline=(170,170,170),width=3)
    c.save(out); print(out,'page',p,len(over),'words past edge', 'name boxes',len(nm))
build('side-ar-aging-summary-all.pdf',r'^Superlongunbroken','A/R','../exhibits/PIC1-ar-summary-pdf-columns-off-page.png',
 'A/R Aging Summary PDF - staging, downloaded 14 Nov 2026, page 1 of 28',
 [('Blue: a customer name with no spaces ("Superlongunbroken...") cannot wrap, so it widens the Customer column.',(30,90,200)),
  ('Red: the page ends here - 61-90 Days, 91 And Over and Total are pushed off the right edge.',(200,30,30)),
  ('Every page of the PDF is cut the same way.',(30,30,30))])
build('side-ap-aging-summary-all.pdf',r'^ZZAUTOTESTAbcdefghij','A/P','../exhibits/PIC2-ap-summary-pdf-columns-off-page.png',
 'A/P Aging Summary PDF - staging, downloaded 14 Nov 2026, page 47 of 47',
 [('Blue: vendor names with no spaces ("ZZAUTOTESTAbcdefghij...") cannot wrap and widen the Vendor column.',(30,90,200)),
  ('Red: the page ends here - 61-90 Days, 91 And Over and Total are pushed off the right edge.',(200,30,30))])
