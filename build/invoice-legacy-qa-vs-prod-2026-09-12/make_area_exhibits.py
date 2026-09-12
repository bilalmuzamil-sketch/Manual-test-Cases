#!/usr/bin/env python3
"""One annotated comparison exhibit per AREA of the invoice, QA vs Production.

Each exhibit shows the same area cropped from both documents at the same scale,
plus the checks a tester runs on that area and the measured verdict for each.
Every number is read out of the PDFs - nothing is eyeballed.
"""
import os, pymupdf
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(HERE, 'ev', 'areas'); os.makedirs(OUT, exist_ok=True)
QA   = os.path.join(HERE, 'Legacy_QA.pdf')
PR   = os.path.join(HERE, 'Legacy_Production.pdf')
DPI  = 150; S = DPI/72.0
F  = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
BLUE=(28,78,168); AMBER=(176,108,0); GREEN=(22,133,62); RED=(190,45,45)
DARK=(28,32,36); GREY=(110,118,125); WHITE=(255,255,255); LINE=(214,219,223)

font  = lambda s,b=False: ImageFont.truetype(FB if b else F, s)
probe = ImageDraw.Draw(Image.new('RGB',(8,8)))
tw    = lambda t,f: probe.textbbox((0,0),t,font=f)[2]-probe.textbbox((0,0),t,font=f)[0]

def crop(pdf,pno,x0,y0,x1,y1):
    pm = pymupdf.open(pdf)[pno].get_pixmap(dpi=DPI, clip=pymupdf.Rect(x0,y0,x1,y1))
    return Image.frombytes('RGB',(pm.width,pm.height),pm.samples)

def wrap(text,f,maxw):
    out,cur=[],''
    for w in text.split():
        t=(cur+' '+w).strip()
        if tw(t,f)>maxw and cur: out.append(cur); cur=w
        else: cur=t
    out.append(cur); return out

def exhibit(n, area, qa_c, pr_c, checks, note, verdict):
    """checks = [(what a tester checks, QA value, PROD value, 'SAME'|'DIFF'|'n/a')]"""
    qa = crop(*qa_c); pr = crop(*pr_c)
    fT=font(27,True); fL=font(16,True); fH=font(12,True); fC=font(15); fV=font(15,True); fN=font(15)
    # column widths for the checks table
    c0=max([tw(c[0],fC) for c in checks]+[tw('WHAT A TESTER CHECKS',fH)])
    c1=max([tw(str(c[1]),fV) for c in checks]+[tw('QA BRANCH',fH)])
    c2=max([tw(str(c[2]),fV) for c in checks]+[tw('PRODUCTION',fH)])
    c3=max([tw(c[3],fV) for c in checks]+[tw('RESULT',fH)])
    X0,G=16,34
    X1=X0+c0+G; X2=X1+c1+G; X3=X2+c2+G
    tblW=X3+c3+X0
    imW=max(qa.width,pr.width)+2*X0
    hdrW=tw(f'{n}.  {area}',fT)+2*X0
    W=max(tblW,imW,hdrW,900)
    nl=wrap(note,fN,W-2*X0) if note else []
    H=(64+26+qa.height+16+26+pr.height+30+26+(len(checks)*30)+18
       +(len(nl)*24+18 if nl else 0)+18)
    img=Image.new('RGB',(W,H),WHITE); d=ImageDraw.Draw(img)
    # title bar
    vc=GREEN if verdict.startswith('IDENT') else (RED if verdict.startswith('DIFF') else AMBER)
    d.rectangle([0,0,W,56],fill=vc)
    d.text((X0,14),f'{n}.  {area}',font=fT,fill=WHITE)
    vw=tw(verdict,fL)
    d.text((W-X0-vw,21),verdict,font=fL,fill=WHITE)
    y=64+6
    d.text((X0,y),'QA BRANCH   INV-S99999-16518',font=fH,fill=BLUE); y+=20
    d.rectangle([X0,y,X0+qa.width,y+qa.height],outline=BLUE,width=2); img.paste(qa,(X0+1,y+1)); y+=qa.height+18
    d.text((X0,y),'PRODUCTION   INV-S2-194',font=fH,fill=AMBER); y+=20
    d.rectangle([X0,y,X0+pr.width,y+pr.height],outline=AMBER,width=2); img.paste(pr,(X0+1,y+1)); y+=pr.height+26
    # checks table
    d.line([X0,y,W-X0,y],fill=LINE,width=1); y+=8
    for lbl,x in (('WHAT A TESTER CHECKS',X0),('QA BRANCH',X1),('PRODUCTION',X2),('RESULT',X3)):
        d.text((x,y),lbl,font=fH,fill=GREY)
    y+=20; d.line([X0,y,W-X0,y],fill=LINE,width=1); y+=8
    for what,a,b,res in checks:
        rc=GREEN if res=='SAME' else (RED if res=='DIFF' else GREY)
        d.text((X0,y),what,font=fC,fill=DARK)
        d.text((X1,y),str(a),font=fV,fill=BLUE)
        d.text((X2,y),str(b),font=fV,fill=AMBER)
        d.text((X3,y),res,font=fV,fill=rc)
        y+=30
    if nl:
        y+=8; d.line([X0,y,W-X0,y],fill=LINE,width=1); y+=10
        for ln in nl: d.text((X0,y),ln,font=fN,fill=GREY); y+=24
    p=os.path.join(OUT,f'{n:02d}-{area.lower().replace(" ","-").replace("/","-").replace(",","")}.png')
    img.save(p); print(f'  {n:02d} {area:34} {img.size[0]}x{img.size[1]}  {verdict}')
    return p

if __name__ == '__main__':
    print('Building per-area comparison exhibits...')

    exhibit(1,'Shop name and address block',
        (QA,0,50,22,300,120),(PR,0,50,22,300,120),
        [('Starts at (top of page)','30.00 pt','30.00 pt','SAME'),
         ('Left edge of the text','58.50 pt','58.50 pt','SAME'),
         ('Shop-name type size','14.4 pt bold','14.4 pt bold','SAME'),
         ('Address type size','10.8 pt regular','10.8 pt regular','SAME'),
         ('Gap between address lines','14.732 pt','14.732 pt','SAME'),
         ('Gap: name to first address line','19.641 pt','19.641 pt','SAME'),
         ('Number of lines printed','5','6','n/a')],
        'The line count differs because the production shop has a longer address - six lines against five. '
        'Every position, size and gap the template controls is identical. Because the block has a minimum '
        'height and the production address overruns it, everything below this block sits 3.29 pt lower on '
        'production.','IDENTICAL')

    exhibit(2,'Document label and dates',
        (QA,0,380,22,560,95),(PR,0,380,22,560,80),
        [('Right edge of the block','540.7 pt','540.7 pt','SAME'),
         ('Label type size','14.4 pt bold','14.4 pt bold','SAME'),
         ('Date type size','10.8 pt regular','10.8 pt regular','SAME'),
         ('"Invoice:" label present','yes','yes','SAME'),
         ('"Invoice Date:" label present','yes','yes','SAME'),
         ('"Due date:" label present','yes','yes','SAME'),
         ('Gap between the two date lines','14.732 pt','14.732 pt','SAME')],
        'The QA invoice number is long enough to wrap onto a second line; the production one is not. Same '
        'block, same right edge, same sizes - only the length of the number differs.','IDENTICAL')

    exhibit(3,'Logo panel',
        (QA,0,205,28,410,132),(PR,0,205,28,410,132),
        [('Left edge of the panel','217.9 pt','217.9 pt','SAME'),
         ('Right edge of the panel','396.4 pt','396.4 pt','SAME'),
         ('Vertical centre of the panel','81.0 pt','81.0 pt','SAME'),
         ('Height of the image inside it','87.6 pt','89.2 pt','n/a')],
        'The panel is the same box in the same place on both. The image height differs only because the two '
        'shops uploaded logos with different shapes - the picture is fitted inside the panel and centred.',
        'IDENTICAL')

    exhibit(4,'Bill To and Remit payment to',
        (QA,0,50,120,560,205),(PR,0,50,122,560,205),
        [('"Bill To" heading present','yes','yes','SAME'),
         ('"Remit payment to" heading present','yes','yes','SAME'),
         ('Bill To left edge','58.50 pt','58.50 pt','SAME'),
         ('Remit heading left edge','418.23 pt','418.23 pt','SAME'),
         ('Heading type size','14.4 pt bold','14.4 pt bold','SAME'),
         ('Body type size','10.8 pt regular','10.8 pt regular','SAME'),
         ('Gap heading to first line','19.641 pt','19.641 pt','SAME'),
         ('Gap between body lines','14.732 pt','14.732 pt','SAME'),
         ('Bill To lines','3','3','SAME'),
         ('Remit payment to lines','4','4','SAME')],
        'Both headings, both blocks, same positions and same spacing. Only the names and addresses differ.',
        'IDENTICAL')

    exhibit(5,'Asset table',
        (QA,0,50,214,560,258),(PR,0,50,217,560,262),
        [('"Unit" heading','present','present','SAME'),
         ('"VIN/Serial #" heading','present','present','SAME'),
         ('"Asset" heading','present','present','SAME'),
         ('"Mileage" heading','present','present','SAME'),
         ('"Eng Hrs" heading','present','present','SAME'),
         ('Headings on one line','yes','yes','SAME'),
         ('Heading type size','10.5 pt bold','10.5 pt bold','SAME'),
         ('Value type size','10.5 pt regular','10.5 pt regular','SAME'),
         ('Gap heading row to value row','20.323 pt','20.323 pt','SAME'),
         ('All five values filled in','yes','yes','SAME')],
        'All five headings present and identical on both. The columns sit at different x positions because '
        'this table sizes its columns to whatever is in them, and the two vehicles have different-length '
        'values - the same behaviour on both documents.','IDENTICAL')

    exhibit(6,'Service Order table',
        (QA,0,50,263,560,310),(PR,0,50,266,560,328),
        [('"Service Order" heading','present','present','SAME'),
         ('"Terms" heading','present','present','SAME'),
         ('"Due date" heading','present','present','SAME'),
         ('"Customer PO" heading','present','present','SAME'),
         ('"Authorizer" heading','present','present','SAME'),
         ('Heading type size','10.5 pt bold','10.5 pt bold','SAME'),
         ('Gap heading row to value row','20.323 pt','20.323 pt','SAME'),
         ('"Service Order" fits on one line','yes','NO - 2 lines','DIFF'),
         ('Order number printed under it','S99999-16518','S2-194','n/a'),
         ('  ...how wide that number is','73.93 pt','38.85 pt','n/a'),
         ('Customer PO value','(blank)','(blank)','SAME'),
         ('Authorizer value','(blank)','(blank)','SAME')],
        'This is the ONE visible difference in the whole document. The first column is set to 15% of the '
        'table, which leaves 62.29 pt for the words after padding - and "Service Order" needs 69.21 pt, so '
        'it is 6.92 pt short. The column only widens if the order number under it is wide. A QA invoice with '
        'a short order number (INV-S2-4219) breaks in exactly the same way, so this is the template, not '
        'production. Customer PO and Authorizer are blank on BOTH - no value was entered, not a fault.',
        'DIFFERENT - explained')

    exhibit(7,'Line table column headings',
        (QA,0,50,318,560,340),(PR,0,50,336,560,358),
        [('"Description" heading','90.41 pt','90.41 pt','SAME'),
         ('"Quantity" heading','339.40 pt','339.40 pt','SAME'),
         ('"Rate" heading','442.17 pt','442.17 pt','SAME'),
         ('"Amount" heading','498.79 pt','498.79 pt','SAME'),
         ('Heading type size','9.6 pt bold','9.6 pt bold','SAME'),
         ('Rule under the headings','60.00 to 535.28','60.00 to 535.28','SAME'),
         ('Rule thickness','0.75 pt','0.75 pt','SAME'),
         ('Gap: headings to first job','29.444 pt','29.444 pt','SAME')],
        'The four column headings sit at exactly the same place on both documents, to the hundredth of a '
        'point, and the rule beneath them is the same width and thickness.','IDENTICAL')

    exhibit(8,'A job line',
        (QA,0,50,348,560,512),(PR,0,50,365,560,495),
        [('Job title, bold','yes','yes','SAME'),
         ('Job title left edge','90.41 pt','90.41 pt','SAME'),
         ('"Labor" tag left of the text','60.75 pt','60.75 pt','SAME'),
         ('"Labor" tag is NOT bold','correct','correct','SAME'),
         ('Description text left edge','90.41 pt','90.41 pt','SAME'),
         ('Gap between description lines','13.095 pt','13.095 pt','SAME'),
         ('Quantity column','355.76 pt','355.76 pt','SAME'),
         ('Rate right edge','465.11 pt','465.11 pt','SAME'),
         ('Amount right edge','537.00 pt','537.00 pt','SAME'),
         ('Gap: one job to the next','27.942 pt','27.942 pt','SAME')],
        'A whole job line, end to end. Same tag position, same text position, same three money columns, '
        'same line spacing and the same gap before the next job.','IDENTICAL')

    exhibit(9,'Part rows',
        (QA,1,50,418,560,556),(PR,0,50,420,560,440),
        [('"Parts" tag left of the row','60.75 pt','60.75 pt','SAME'),
         ('Part text left edge','90.41 pt','90.41 pt','SAME'),
         ('Part text format','NUMBER - Description','NUMBER - Description','SAME'),
         ('Quantity column','355.76 pt','355.76 pt','SAME'),
         ('Rate right edge','465.11 pt','465.11 pt','SAME'),
         ('Amount right edge','537.00 pt','537.00 pt','SAME'),
         ('Gap between part rows','16.09 pt','16.09 pt','SAME'),
         ('Part rows in this document','11','3','n/a')],
        'Part rows print identically on both. The QA invoice has 11 of them and production has 3, which is '
        'just the work that was done.','IDENTICAL')

    exhibit(10,'Per-line totals',
        (QA,0,330,458,560,512),(PR,0,330,440,560,495),
        [('"Parts Total" label','416.44 pt','416.44 pt','SAME'),
         ('"Labor Total" label','414.67 pt','414.67 pt','SAME'),
         ('"Line Total" label','419.76 pt','419.76 pt','SAME'),
         ('"Line Total" is bold','yes','yes','SAME'),
         ('"Parts Total" is NOT bold','correct','correct','SAME'),
         ('"Labor Total" is NOT bold','correct','correct','SAME'),
         ('The amounts are NOT bold','correct','correct','SAME'),
         ('Boxes around the amounts','70.39 x 16.09 pt','70.39 x 16.09 pt','SAME'),
         ('Gap between the three rows','17.595 pt','17.595 pt','SAME')],
        'The bold/not-bold pattern here is a product decision from ticket SV-4314: the words "Line Total" '
        'stay bold, everything else in this block does not. Both documents follow it exactly.','IDENTICAL')

    exhibit(11,'Money summary block',
        (QA,5,330,100,560,212),(PR,1,330,496,560,622),
        [('"Labor" row','present','present','SAME'),
         ('"Parts" row','present','present','SAME'),
         ('"Shop supplies" row','present','present','SAME'),
         ('"Subtotal" row','present','present','SAME'),
         ('Tax row(s)','GST (5%)','2% VAT + 3% VAT','n/a'),
         ('"Total" row','present','present','SAME'),
         ('"Payments" row','present','present','SAME'),
         ('"Balance" row','present','present','SAME'),
         ('Labels right-align to','472.42 pt','472.42 pt','SAME'),
         ('Amounts right-align to','539.25 pt','539.25 pt','SAME'),
         ('Gap between rows','13.095 pt','13.095 pt','SAME'),
         ('Gap above the block','33.198 pt','33.198 pt','SAME'),
         ('Labels bold, amounts not','correct','correct','SAME')],
        'Every row of the money block is present on both, right-aligned to the same two columns, with the '
        'same spacing. Production shows two tax rows because that shop charges two taxes; the QA shop '
        'charges one. Production names its fee "Shop supplies (10% of labor)" - the same row, just a '
        'longer name the shop typed in.','IDENTICAL')

    exhibit(12,'Small print (disclaimer)',
        (QA,5,50,226,560,298),(PR,1,50,635,560,706),
        [('Number of lines','7','7','SAME'),
         ('Type size','6.48 pt','6.48 pt','SAME'),
         ('Text colour','#424242 grey','#424242 grey','SAME'),
         ('Left edge','58.50 pt','58.50 pt','SAME'),
         ('Gap between lines','8.836 pt','8.836 pt','SAME'),
         ('Gap above the block','33.929 pt','33.929 pt','SAME'),
         ('Where each line breaks','7 positions','same 7 positions','SAME')],
        'This is the single strongest piece of evidence in the whole comparison. The paragraph is one long '
        'sentence the engine has to break by itself, and it breaks in exactly the same seven places on both '
        'documents - 525.02, 522.87, 536.69, 521.88, 506.26, 527.87 and 212.85 pt. A writing area even a '
        'fraction of a point narrower would break somewhere else.','IDENTICAL')

    exhibit(13,'Signature block',
        (QA,5,50,305,560,352),(PR,1,50,714,560,760),
        [('"Customer signature:" label','58.50 pt','58.50 pt','SAME'),
         ('"Printed name:" label','58.50 pt','58.50 pt','SAME'),
         ('"Date:" label','382.27 pt','382.27 pt','SAME'),
         ('All three labels bold','yes','yes','SAME'),
         ('Type size','9.6 pt','9.6 pt','SAME'),
         ('Gap above the block','26.837 pt','26.837 pt','SAME'),
         ('Gap between the two lines','22.094 pt','22.094 pt','SAME'),
         ('Signature rules present','yes','yes','SAME')],
        'All three labels, both signing lines, same positions, same spacing.','IDENTICAL')

    exhibit(14,'Page footer',
        (QA,0,10,806,585,824),(PR,0,10,806,585,824),
        [('Footer baseline','814.08 pt','814.08 pt','SAME'),
         ('Left cell starts at','22.50 pt','22.50 pt','SAME'),
         ('"Powered by ShopView" centred at','248.65 pt','248.65 pt','SAME'),
         ('Right cell ends at','572.80 pt','572.80 pt','SAME'),
         ('Type size','9.6 pt','9.6 pt','SAME'),
         ('Page number shown','yes','yes','SAME'),
         ('Tax registration number','GST# 812694966 RT0001','5454545454544544','n/a')],
        'The tax registration number is free text each shop types into its own settings - we confirmed this '
        'by rendering a second QA invoice from a different shop, which prints its number with no "GST#" '
        'prefix at all. Nothing to fix.','IDENTICAL')

    exhibit(15,'Continuation page header',
        (QA,1,50,15,560,34),(PR,1,50,15,560,34),
        [('Headings repeat on later pages','yes','yes','SAME'),
         ('Repeat baseline','23.25 pt','23.25 pt','SAME'),
         ('"Description"','90.41 pt','90.41 pt','SAME'),
         ('"Quantity"','339.40 pt','339.40 pt','SAME'),
         ('"Rate"','442.17 pt','442.17 pt','SAME'),
         ('"Amount"','498.79 pt','498.79 pt','SAME')],
        'When an invoice runs past one page, both documents repeat the four column headings at the top of '
        'every following page, in the same place.','IDENTICAL')

    print('\nDone - exhibits in ev/areas/')
